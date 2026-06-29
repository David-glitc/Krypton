import crypto from 'node:crypto'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

import type { AgentRuntime } from './runtime.js'
import type { KryptonPlugin } from './plugins/krypton-plugin.js'
import type { AgentContext, AgentOutput, PermissionGateOutput, StrategyOutput } from './cycle-fsm.js'
import { dispatchExecution } from './execution-dispatcher.js'
import { insertPendingAction } from './db.js'
import { parseActionType, parseTargetProtocol } from './action-parse.js'

function generateId(): string {
  return crypto.randomUUID()
}

function now(): number {
  return Date.now()
}

export type ExecutionPlan = {
  actionLabel: string
  strategyOutput: StrategyOutput
  permGate: PermissionGateOutput
}

/** L2+ vaults always need human approval — agent goes idle until user acts. */
export function requiresHumanApproval(context: AgentContext, permGate: PermissionGateOutput): boolean {
  if (context.permissionLevel >= 2) return true
  if (permGate.requiresUserApproval) return true
  return false
}

export function extractExecutionPlan(
  outputs: AgentOutput[],
  permGate: PermissionGateOutput,
): ExecutionPlan | null {
  const strategyOutput = outputs.find((o) => o.stage === 'STRATEGIZING') as StrategyOutput | undefined
  if (!strategyOutput) return null
  const candidateActions =
    strategyOutput.candidateActions?.filter((a) => a && a !== 'noop') ?? []
  const actionLabel = candidateActions[0]
  if (!actionLabel) return null
  return { actionLabel, strategyOutput, permGate }
}

export async function queueIdlePendingApproval(input: {
  job: { vault_pubkey: string; cycle_id: number }
  context: AgentContext
  plan: ExecutionPlan | null
  permGate: PermissionGateOutput
  reason: string
  invokeEnd: number
}): Promise<void> {
  const { job, context, plan, permGate, reason, invokeEnd } = input
  await insertPendingAction({
    id: generateId(),
    vault_pubkey: job.vault_pubkey,
    cycle_id: job.cycle_id,
    typed_action_json: JSON.stringify({
      actionType: plan?.actionLabel ?? 'agent_proposed',
      candidateActions: plan?.strategyOutput.candidateActions ?? [],
      investmentGoal: plan?.strategyOutput.investmentGoal,
      rationale: plan?.strategyOutput.rationale ?? permGate.rationale,
      permissionLevel: context.permissionLevel,
      requiresUserApproval: true,
      agentState: 'idle_awaiting_approval',
      idleReason: reason,
    }),
    status: 'pending',
    expires_at: now() + 7 * 24 * 60 * 60 * 1000,
    created_at: invokeEnd,
    updated_at: invokeEnd,
  })
}

export async function canAgentSignOnChain(
  plugin: KryptonPlugin,
  vaultPubkey: string,
  authority: PublicKey,
): Promise<{ ok: boolean; callerLevel: number; reason?: string }> {
  const perm = await plugin.resolveCallerPermission(vaultPubkey, authority.toBase58())
  if (!perm) {
    return { ok: false, callerLevel: 0, reason: 'Permission account not found on-chain' }
  }
  if (perm.callerLevel === 0) {
    return {
      ok: false,
      callerLevel: 0,
      reason: `Signer ${authority.toBase58().slice(0, 8)}… is not vault owner or registered agent (${perm.agentSigner.slice(0, 8)}…)`,
    }
  }
  return { ok: true, callerLevel: perm.callerLevel }
}

export async function tryAutoExecuteOnChain(input: {
  runtime: AgentRuntime
  plugin: KryptonPlugin
  job: { vault_pubkey: string; cycle_id: number }
  context: AgentContext
  plan: ExecutionPlan
  agentKeypair: Keypair
  invokeEnd: number
}): Promise<{ stageError: string | null; fellBackToIdle: boolean }> {
  const { runtime, plugin, job, context, plan, agentKeypair, invokeEnd } = input
  const { actionLabel } = plan

  const resolved = await plugin.resolveVaultOwner(job.vault_pubkey)
  if (!resolved) {
    await queueIdlePendingApproval({
      job,
      context,
      plan,
      permGate: plan.permGate,
      reason: 'Could not resolve vault owner — queued for your approval',
      invokeEnd,
    })
    return { stageError: null, fellBackToIdle: true }
  }

  const { owner: vaultOwner, nonce: vaultNonce } = resolved
  const authCheck = await canAgentSignOnChain(plugin, job.vault_pubkey, agentKeypair.publicKey)
  if (!authCheck.ok) {
    await queueIdlePendingApproval({
      job,
      context,
      plan,
      permGate: plan.permGate,
      reason: authCheck.reason ?? 'Agent not authorised on-chain — approve to execute with your wallet',
      invokeEnd,
    })
    return { stageError: null, fellBackToIdle: true }
  }

  const connection = new Connection(
    process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com',
    'confirmed',
  )

  try {
    const { signature: approveSig, actionId } = await runtime.approveAction({
      vaultOwner,
      vaultNonce,
      actionType: parseActionType(actionLabel),
      postLeverageBps: 1000,
      postConcentrationBps: 2000,
      postDrawdownBps: 500,
      postCorrelatedBps: 1000,
      compositeScore: 750,
      targetProtocolId: parseTargetProtocol(actionLabel),
      isDeRisk: false,
      requiredLevel: Math.min(authCheck.callerLevel, 3),
    })

    const offChainResult = await dispatchExecution({
      targetProtocolId: parseTargetProtocol(actionLabel),
      actionTypeId: parseActionType(actionLabel),
      vaultOwner,
      vaultPubkey: job.vault_pubkey,
      actionLabel,
      agentKeypair,
      connection,
    })

    let phase2Sig: string | null = null
    if (offChainResult.success) {
      phase2Sig = await runtime.confirmAction(vaultOwner, vaultNonce)
    } else {
      phase2Sig = await runtime.rejectAction(vaultOwner, vaultNonce)
    }

    await insertPendingAction({
      id: generateId(),
      vault_pubkey: job.vault_pubkey,
      cycle_id: job.cycle_id,
      typed_action_json: JSON.stringify({
        actionId,
        actionType: actionLabel,
        candidateActions: plan.strategyOutput.candidateActions,
        approveSignature: approveSig,
        offChainSignature: offChainResult.success ? offChainResult.txSignature : null,
        phase2Signature: phase2Sig,
        offChainSuccess: offChainResult.success,
        offChainError: offChainResult.success ? null : offChainResult.error,
        rationale: plan.permGate.rationale,
        permissionLevel: context.permissionLevel,
        requiresUserApproval: false,
        agentState: offChainResult.success ? 'executed' : 'execution_failed',
      }),
      status: offChainResult.success ? 'approved' : 'rejected',
      expires_at: now() + 24 * 60 * 60 * 1000,
      created_at: invokeEnd,
      updated_at: invokeEnd,
    })

    if (!offChainResult.success) {
      return { stageError: `Off-chain execution failed: ${offChainResult.error}`, fellBackToIdle: false }
    }
    return { stageError: null, fellBackToIdle: false }
  } catch (execError) {
    const msg = execError instanceof Error ? execError.message : String(execError)
    const isAuth = /0x1771|NotAuthorised|not authorised/i.test(msg)
    if (isAuth) {
      await queueIdlePendingApproval({
        job,
        context,
        plan,
        permGate: plan.permGate,
        reason: 'On-chain agent not authorised — approve in app to sign with your wallet',
        invokeEnd,
      })
      return { stageError: null, fellBackToIdle: true }
    }

    await insertPendingAction({
      id: generateId(),
      vault_pubkey: job.vault_pubkey,
      cycle_id: job.cycle_id,
      typed_action_json: JSON.stringify({
        error: msg,
        actionType: actionLabel,
        candidateActions: plan.strategyOutput.candidateActions,
        rationale: plan.permGate.rationale,
        permissionLevel: context.permissionLevel,
        agentState: 'execution_failed',
      }),
      status: 'rejected',
      expires_at: now() + 24 * 60 * 60 * 1000,
      created_at: invokeEnd,
      updated_at: invokeEnd,
    })
    return { stageError: `Two-phase execution failed: ${msg}`, fellBackToIdle: false }
  }
}
