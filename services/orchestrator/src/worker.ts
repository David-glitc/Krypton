import crypto from 'node:crypto'
import { PublicKey, Connection, Keypair } from '@solana/web3.js'

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
  failCycleJob,
  insertAgentInvocation,
  insertCycleRun,
  insertPendingAction,
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
  type StrategyOutput,
} from './cycle-fsm.js'
import { dispatchExecution } from './execution-dispatcher.js'

const POLL_INTERVAL_MS = Number.parseInt(process.env.KRYPTON_ORCHESTRATOR_POLL_MS ?? '2000', 10)
const STUB_MODE = process.env.KRYPTON_STUB_AGENTS === 'true'

export function parseActionType(label: string): number {
  const lower = label.toLowerCase()
  if (lower.includes('swap')) return 0
  if (lower.includes('stake') || lower.includes('unstake')) return 1
  if (lower.includes('lend') || lower.includes('borrow')) return 2
  if (lower.includes('liquidity') || lower.includes('provide')) return 3
  if (lower.includes('close_perp') || lower.includes('close')) return 5
  if (lower.includes('perp') || lower.includes('open_perp')) return 4
  return 0
}

export function parseTargetProtocol(label: string): number {
  const lower = label.toLowerCase()
  if (lower.includes('jupiter') || lower.includes('jup')) return 0
  if (lower.includes('drift')) return 1
  if (lower.includes('adrena')) return 2
  if (lower.includes('pump') || lower.includes('pumpfun')) return 3
  if (lower.includes('raydium')) return 4
  if (lower.includes('kamino')) return 5
  return 0
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
      stageOutput = await runStage(stage, context)
      const invokeEnd = now()
      stageDecision = JSON.stringify(stageOutput)

      const stageData = stageOutput as unknown as Record<string, unknown> | null
      const llmCost = stageData?.llmCostUsd as number | undefined
      const llmLatency = stageData?.llmLatencyMs as number | undefined
      const llmModel = stageData?.llmModel as string | undefined

      const invocation: AgentInvocationInsert = {
        id: generateId(),
        vault_pubkey: job.vault_pubkey,
        cycle_id: job.cycle_id,
        session_id: null,
        agent_role: stage,
        model_id: llmModel ?? (STUB_MODE ? 'stub' : null),
        prompt_hash: null,
        response_hash: null,
        cost_usd: llmCost ?? (STUB_MODE ? 0 : null),
        latency_ms: llmLatency ?? invokeEnd - invokeStart,
        status: STUB_MODE ? 'stubbed' : (llmModel ? 'completed' : 'completed'),
        arweave_uri: null,
        created_at: invokeEnd,
      }
      await insertAgentInvocation(invocation)

      if (stage === 'PERMISSION_GATE') {
        const permGate = stageOutput as PermissionGateOutput | null
        const isAutoExecute = permGate !== null && !permGate.requiresUserApproval

        if (isAutoExecute) {
          try {
            const runtime = getAgentRuntime(job.vault_pubkey)
            const connection = new Connection(
              process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
              'confirmed',
            )

            const strategyOutput = outputs.find(
              (o): o is StrategyOutput => o.stage === 'STRATEGIZING',
            )
            const actionLabel = strategyOutput?.candidateActions?.[0] ?? 'noop'

            const [vaultOwner] = PublicKey.findProgramAddressSync(
              [Buffer.from('vault')],
              new PublicKey(process.env.KRYPTON_PROGRAM_ID ?? '7CpwaaPcgxiC2oJv8ZdVX6m7fQZ2qDnQ6hGfUayvq1AS'),
            )

            // Phase 1: approve action on-chain
            const { signature: approveSig, actionId } = await runtime.approveAction({
              vaultOwner,
              actionType: parseActionType(actionLabel),
              postLeverageBps: 1000,
              postConcentrationBps: 2000,
              postDrawdownBps: 500,
              postCorrelatedBps: 1000,
              compositeScore: 750,
              targetProtocolId: parseTargetProtocol(actionLabel),
              isDeRisk: false,
              requiredLevel: 1,
            })

            // Phase 2: execute off-chain via solana-agent-kit / ElizaOS / direct SDK
            const agentKeypair = loadAuthorityKeypair()
            if (!agentKeypair) {
              throw new Error('KRYPTON_AUTHORITY_KEYPAIR not configured — cannot execute off-chain')
            }
            const offChainResult = await dispatchExecution({
              targetProtocolId: parseTargetProtocol(actionLabel),
              actionTypeId: parseActionType(actionLabel),
              vaultOwner,
              agentKeypair,
              connection,
            })

            let phase2Sig: string | null = null
            if (offChainResult.success) {
              phase2Sig = await runtime.confirmAction(vaultOwner)
            } else {
              phase2Sig = await runtime.rejectAction(vaultOwner)
              stageError = `Off-chain execution failed: ${offChainResult.error}`
            }

            await insertPendingAction({
              id: generateId(),
              vault_pubkey: job.vault_pubkey,
              cycle_id: job.cycle_id,
              typed_action_json: JSON.stringify({
                actionId,
                actionType: actionLabel,
                approveSignature: approveSig,
                offChainSignature: offChainResult.success ? offChainResult.txSignature : null,
                phase2Signature: phase2Sig,
                offChainSuccess: offChainResult.success,
                offChainError: offChainResult.success ? null : offChainResult.error,
                rationale: stageOutput.rationale,
                permissionLevel: context.permissionLevel,
                requiresUserApproval: false,
              }),
              status: offChainResult.success ? 'approved' : 'rejected',
              expires_at: now() + 24 * 60 * 60 * 1000,
              created_at: invokeEnd,
              updated_at: invokeEnd,
            })
          } catch (execError) {
            stageError = `Two-phase execution failed: ${execError instanceof Error ? execError.message : String(execError)}`

            await insertPendingAction({
              id: generateId(),
              vault_pubkey: job.vault_pubkey,
              cycle_id: job.cycle_id,
              typed_action_json: JSON.stringify({
                error: stageError,
                rationale: stageOutput.rationale,
                permissionLevel: context.permissionLevel,
              }),
              status: 'rejected',
              expires_at: now() + 24 * 60 * 60 * 1000,
              created_at: invokeEnd,
              updated_at: invokeEnd,
            })
          }
        } else {
          await insertPendingAction({
            id: generateId(),
            vault_pubkey: job.vault_pubkey,
            cycle_id: job.cycle_id,
            typed_action_json: JSON.stringify({
              actionType: 'agent_proposed',
              rationale: stageOutput.rationale,
              permissionLevel: context.permissionLevel,
              requiresUserApproval: true,
            }),
            status: 'pending',
            expires_at: now() + 24 * 60 * 60 * 1000,
            created_at: invokeEnd,
            updated_at: invokeEnd,
          })
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
