import crypto, { createHash } from 'node:crypto'
import { PublicKey, Keypair } from '@solana/web3.js'

import {
  getAgentRuntime,
  runMonitoringAgent,
  runPermissionGateAgent,
  runResearchAgent,
  runRiskReviewAgent,
  runSimulationAgent,
  runStrategyAgent,
} from './agents.js'
import {
  type AgentInvocationInsert,
  type CycleJobRow,
  completeCycleJob,
  countInfraFailedJobs,
  failCycleJob,
  hasActiveCycleJob,
  insertAgentInvocation,
  insertCycleRun,
  insertInfraRetryJob,
  leaseNextCycleJob,
  updateCycleRunCompletion,
} from './db.js'
import {
  CYCLE_STAGES,
  type AgentContext,
  type AgentOutput,
  type CycleFsmResult,
  type CycleStage,
  type PermissionGateOutput,
} from './cycle-fsm.js'
import {
  extractExecutionPlan,
  queueIdlePendingApproval,
  requiresHumanApproval,
  tryAutoExecuteOnChain,
} from './cycle-execution.js'
import { isInfrastructureCycleError, outputsIndicateInfrastructureFailure } from './infra-errors.js'

const POLL_INTERVAL_MS = Number.parseInt(process.env.KRYPTON_ORCHESTRATOR_POLL_MS ?? '2000', 10)
const STUB_MODE = process.env.KRYPTON_STUB_AGENTS === 'true'
const MAX_INFRA_AUTO_RETRIES = 3

export { parseActionType, parseTargetProtocol } from './action-parse.js'

async function assertVaultStateAvailable(vaultPubkey: string): Promise<void> {
  const runtime = getAgentRuntime(vaultPubkey)
  const state = await runtime.getPlugin().getVaultState(vaultPubkey)
  if (!state) {
    throw new Error(
      'VAULT_STATE_UNAVAILABLE: On-chain vault account could not be loaded. Check RPC connectivity and vault address.',
    )
  }
}

async function maybeScheduleInfraRetry(job: CycleJobRow, message: string): Promise<void> {
  if (!isInfrastructureCycleError(message)) return
  if (await hasActiveCycleJob(job.vault_pubkey)) return

  const infraFailures = await countInfraFailedJobs(job.vault_pubkey)
  if (infraFailures >= MAX_INFRA_AUTO_RETRIES) return

  await insertInfraRetryJob(job, now())
  // eslint-disable-next-line no-console
  console.warn(
    `[worker] scheduled infra retry ${infraFailures + 1}/${MAX_INFRA_AUTO_RETRIES} for vault=${job.vault_pubkey}`,
  )
}

const now = (): number => Date.now()
const generateId = (): string => crypto.randomUUID()

function loadAuthorityKeypair(): Keypair | undefined {
  const b64 = process.env.KRYPTON_AUTHORITY_KEYPAIR
  if (!b64) return undefined
  try {
    const bytes = new Uint8Array(JSON.parse(Buffer.from(b64, 'base64').toString('utf-8')))
    return Keypair.fromSecretKey(bytes)
  } catch {
    return undefined
  }
}

function createAgentContext(job: CycleJobRow): AgentContext {
  return {
    vaultPubkey: job.vault_pubkey,
    cycleId: job.cycle_id,
    permissionLevel: job.permission_level,
  }
}

async function runStage(stage: CycleStage, context: AgentContext): Promise<AgentOutput> {
  switch (stage) {
    case 'RESEARCHING':
      return runResearchAgent(context)
    case 'STRATEGIZING':
      return runStrategyAgent(context)
    case 'RISK_REVIEW':
      return runRiskReviewAgent(context)
    case 'SIMULATING':
      return runSimulationAgent(context)
    case 'PERMISSION_GATE':
      return runPermissionGateAgent(context)
    case 'MONITORING':
      return runMonitoringAgent(context)
  }
}

async function runCycle(job: CycleJobRow): Promise<CycleFsmResult> {
  if (!STUB_MODE) {
    await assertVaultStateAvailable(job.vault_pubkey)
  }

  const context = createAgentContext(job)
  const outputs: AgentOutput[] = []

  for (const stage of CYCLE_STAGES) {
    const cycleRunId = generateId()
    await insertCycleRun({
      id: cycleRunId,
      vault_pubkey: job.vault_pubkey,
      cycle_id: job.cycle_id,
      job_id: job.id,
      stage,
      decision: null,
      started_at: now(),
      completed_at: null,
      error: null,
    })

    let stageOutput: AgentOutput | null = null
    let stageError: string | null = null
    let stageDecision: string | null = null

    try {
      const invokeStart = now()
      stageOutput = await runStage(stage, { ...context, priorOutputs: outputs })
      const invokeEnd = now()
      stageDecision = JSON.stringify(stageOutput)

      const stageData = stageOutput as unknown as Record<string, unknown> | null
      const llmCost = stageData?.llmCostUsd as number | undefined
      const llmLatency = stageData?.llmLatencyMs as number | undefined
      const llmModel = stageData?.llmModel as string | undefined

      const responseHash = stageDecision ? createHash('sha256').update(stageDecision).digest('hex') : null

      const invocation: AgentInvocationInsert = {
        id: generateId(),
        vault_pubkey: job.vault_pubkey,
        cycle_id: job.cycle_id,
        session_id: null,
        agent_role: stage,
        model_id: llmModel ?? (STUB_MODE ? 'stub' : null),
        prompt_hash: null,
        response_hash: responseHash,
        cost_usd: llmCost ?? (STUB_MODE ? 0 : null),
        latency_ms: llmLatency ?? invokeEnd - invokeStart,
        status: STUB_MODE ? 'stubbed' : (llmModel ? 'completed' : 'completed'),
        arweave_uri: null,
        created_at: invokeEnd,
      }
      await insertAgentInvocation(invocation)

      if (
        outputsIndicateInfrastructureFailure([...outputs, stageOutput], stageError) ||
        stageOutput.rationale.includes('VAULT_STATE_UNAVAILABLE')
      ) {
        stageError = stageOutput.rationale
        break
      }

      if (stage === 'PERMISSION_GATE') {
        const permGate = stageOutput as PermissionGateOutput
        const plan = extractExecutionPlan(outputs, permGate)

        if (outputsIndicateInfrastructureFailure(outputs, stageError)) {
          stageError = stageError ?? 'Skipped pending action: infrastructure failure during cycle'
        } else if (requiresHumanApproval(context, permGate) || !plan) {
          await queueIdlePendingApproval({
            job,
            context,
            plan,
            permGate,
            reason: !plan
              ? 'No executable action proposed — agent on standby'
              : context.permissionLevel >= 2
                ? 'Your vault requires owner approval — agent idle until you approve'
                : 'Approval required — agent idle until you act',
            invokeEnd,
          })
        } else {
          const agentKeypair = loadAuthorityKeypair()
          if (!agentKeypair) {
            await queueIdlePendingApproval({
              job,
              context,
              plan,
              permGate,
              reason: 'Server agent key not configured — approve to execute with your wallet',
              invokeEnd,
            })
          } else {
            const runtime = getAgentRuntime(job.vault_pubkey)
            const result = await tryAutoExecuteOnChain({
              runtime,
              plugin: runtime.getPlugin(),
              job,
              context,
              plan,
              agentKeypair,
              invokeEnd,
            })
            if (result.stageError) stageError = result.stageError
          }
        }
      }
    } catch (error) {
      stageError = error instanceof Error ? error.message : String(error)
    } finally {
      await updateCycleRunCompletion(cycleRunId, now(), stageDecision, stageError)
    }

    if (!stageOutput) {
      break
    }
    outputs.push(stageOutput)
  }

  return {
    finalStage: outputs.length > 0 ? outputs[outputs.length - 1]!.stage : 'RESEARCHING',
    outputs,
  }
}

async function processOne(workerId: string): Promise<boolean> {
  const job = await leaseNextCycleJob(workerId, now())
  if (!job) {
    return false
  }

  try {
    await runCycle(job)
    await completeCycleJob(job.id, now())
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await failCycleJob(job.id, message, now())
    await maybeScheduleInfraRetry(job, message)
  }

  return true
}

export async function runWorker(): Promise<void> {
  const workerId =
    process.env.KRYPTON_ORCHESTRATOR_WORKER_ID ??
    `worker-${process.pid}-${Math.floor(Math.random() * 1_000_000)}`

  const dbTarget = process.env.LIBSQL_URL ?? process.env.KRYPTON_DB_PATH ?? '../../.data/krypton.db'

  // eslint-disable-next-line no-console
  console.log(
    `[worker] starting id=${workerId} stub_agents=${process.env.KRYPTON_STUB_AGENTS ?? 'false'} db=${dbTarget}`,
  )

  while (true) {
    const hadJob = await processOne(workerId)
    if (!hadJob) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
    }
  }
}
