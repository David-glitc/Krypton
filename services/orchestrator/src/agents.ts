import crypto from 'node:crypto'
import { Keypair } from '@solana/web3.js'

import type { Character } from './character/types.js'
import { generatePresetCharacter } from './character/generator.js'
import { AgentRuntime, type CycleOutput } from './runtime.js'
import type {
  AgentContext,
  MonitoringOutput,
  PermissionGateOutput,
  ResearchOutput,
  RiskReviewOutput,
  SimulationOutput,
  StrategyOutput,
} from './cycle-fsm.js'

const STUB_MODE = process.env.KRYPTON_STUB_AGENTS === 'true'

const RPC_URL =
  process.env.SOLANA_RPC_URL ?? 'https://api.devnet.solana.com'
const PROGRAM_ID =
  process.env.KRYPTON_PROGRAM_ID ?? '7CpwaaPcgxiC2oJv8ZdVX6m7fQZ2qDnQ6hGfUayvq1AS'

function loadAuthorityKeypair(): Keypair | undefined {
  const b64 = process.env.KRYPTON_AUTHORITY_KEYPAIR
  if (!b64) return undefined
  try {
    const bytes = new Uint8Array(JSON.parse(Buffer.from(b64, 'base64').toString('utf-8')))
    return Keypair.fromSecretKey(bytes)
  } catch {
    // eslint-disable-next-line no-console
    console.warn('[agents] Failed to decode KRYPTON_AUTHORITY_KEYPAIR — on-chain execution disabled')
    return undefined
  }
}

const authorityKeypair = loadAuthorityKeypair()

/** Cache runtimes per vault so plugin state persists across cycles. */
const runtimeCache = new Map<string, AgentRuntime>()

function now(): number {
  return Date.now()
}

function getCharacterForVault(vaultPubkey: string): Character {
  if (STUB_MODE) {
    return generatePresetCharacter('stable-saver')
  }

  const preset = process.env.KRYPTON_CHARACTER_PRESET
  if (preset) {
    return generatePresetCharacter(preset)
  }

  return generatePresetCharacter('steady-compounder')
}

function getRuntime(context: AgentContext): AgentRuntime {
  const existing = runtimeCache.get(context.vaultPubkey)
  if (existing) return existing

  const character = getCharacterForVault(context.vaultPubkey)
  const runtime = new AgentRuntime(character, {
    rpcUrl: RPC_URL,
    vaultPubkey: context.vaultPubkey,
    programId: PROGRAM_ID,
    authorityKeypair,
  })
  runtimeCache.set(context.vaultPubkey, runtime)
  return runtime
}

/** Exposed for worker.ts to access AgentRuntime for on-chain execution. */
export function getAgentRuntime(vaultPubkey: string): AgentRuntime {
  return getRuntime({ vaultPubkey, cycleId: 0, permissionLevel: 1 })
}

function toCycleInput(context: AgentContext, stage: string) {
  return {
    vaultPubkey: context.vaultPubkey,
    cycleId: context.cycleId,
    stage,
    context: { permissionLevel: context.permissionLevel },
  }
}

function researchToOutput(output: CycleOutput): ResearchOutput {
  return {
    stage: 'RESEARCHING',
    rationale: output.rationale,
    hypotheses: output.alerts?.length ? output.alerts : ['Maintain current allocation'],
    stub: STUB_MODE,
    generatedAt: now(),
  }
}

function strategyToOutput(output: CycleOutput): StrategyOutput {
  return {
    stage: 'STRATEGIZING',
    rationale: output.rationale,
    candidateActions: output.actions?.map((a) => a) ?? ['noop'],
    stub: STUB_MODE,
    generatedAt: now(),
  }
}

function riskToOutput(output: CycleOutput): RiskReviewOutput {
  return {
    stage: 'RISK_REVIEW',
    rationale: output.rationale,
    riskScore: output.riskScore ?? 0.25,
    flags: output.alerts ?? [],
    stub: STUB_MODE,
    generatedAt: now(),
  }
}

function simToOutput(output: CycleOutput): SimulationOutput {
  return {
    stage: 'SIMULATING',
    rationale: output.rationale,
    projectedReturnBps: Math.round((output.riskScore ?? 0.5) * 200),
    projectedMaxDrawdownBps: Math.round((output.riskScore ?? 0.5) * 150),
    stub: STUB_MODE,
    generatedAt: now(),
  }
}

function permToOutput(output: CycleOutput): PermissionGateOutput {
  return {
    stage: 'PERMISSION_GATE',
    rationale: output.rationale,
    requiresUserApproval: output.decision === 'requires_approval',
    permissionLevel: 1,
    stub: STUB_MODE,
    generatedAt: now(),
  }
}

function monToOutput(output: CycleOutput): MonitoringOutput {
  return {
    stage: 'MONITORING',
    rationale: output.rationale,
    alerts: output.alerts ?? [],
    stub: STUB_MODE,
    generatedAt: now(),
  }
}

export async function runResearchAgent(context: AgentContext): Promise<ResearchOutput> {
  if (STUB_MODE) {
    return {
      stage: 'RESEARCHING',
      rationale: `vault=${context.vaultPubkey} cycle=${context.cycleId} level=${context.permissionLevel} — stub research`,
      hypotheses: ['Maintain current allocation with minor rebalance.', 'Increase exposure to top-performing assets.'],
      stub: true,
      generatedAt: now(),
    }
  }

  const runtime = getRuntime(context)
  const out = await runtime.runStage(toCycleInput(context, 'RESEARCHING'))
  return researchToOutput(out)
}

export async function runStrategyAgent(context: AgentContext): Promise<StrategyOutput> {
  if (STUB_MODE) {
    return {
      stage: 'STRATEGIZING',
      rationale: `vault=${context.vaultPubkey} cycle=${context.cycleId} level=${context.permissionLevel} — stub strategy`,
      candidateActions: ['swap 2% from stable to SOL', 'rebalance to target weights'],
      stub: true,
      generatedAt: now(),
    }
  }

  const runtime = getRuntime(context)
  const out = await runtime.runStage(toCycleInput(context, 'STRATEGIZING'))
  return strategyToOutput(out)
}

export async function runRiskReviewAgent(context: AgentContext): Promise<RiskReviewOutput> {
  if (STUB_MODE) {
    return {
      stage: 'RISK_REVIEW',
      rationale: `vault=${context.vaultPubkey} cycle=${context.cycleId} level=${context.permissionLevel} — stub risk review`,
      riskScore: 0.15,
      flags: [],
      stub: true,
      generatedAt: now(),
    }
  }

  const runtime = getRuntime(context)
  const out = await runtime.runStage(toCycleInput(context, 'RISK_REVIEW'))
  return riskToOutput(out)
}

export async function runSimulationAgent(context: AgentContext): Promise<SimulationOutput> {
  if (STUB_MODE) {
    return {
      stage: 'SIMULATING',
      rationale: `vault=${context.vaultPubkey} cycle=${context.cycleId} level=${context.permissionLevel} — stub simulation`,
      projectedReturnBps: 120,
      projectedMaxDrawdownBps: 80,
      stub: true,
      generatedAt: now(),
    }
  }

  const runtime = getRuntime(context)
  const out = await runtime.runStage(toCycleInput(context, 'SIMULATING'))
  return simToOutput(out)
}

export async function runPermissionGateAgent(context: AgentContext): Promise<PermissionGateOutput> {
  if (STUB_MODE) {
    return {
      stage: 'PERMISSION_GATE',
      rationale: `vault=${context.vaultPubkey} cycle=${context.cycleId} level=${context.permissionLevel} — stub permission gate`,
      requiresUserApproval: context.permissionLevel >= 2,
      permissionLevel: context.permissionLevel,
      stub: true,
      generatedAt: now(),
    }
  }

  const runtime = getRuntime(context)
  const out = await runtime.runStage(toCycleInput(context, 'PERMISSION_GATE'))
  return permToOutput(out)
}

export async function runMonitoringAgent(context: AgentContext): Promise<MonitoringOutput> {
  if (STUB_MODE) {
    return {
      stage: 'MONITORING',
      rationale: `vault=${context.vaultPubkey} cycle=${context.cycleId} level=${context.permissionLevel} — stub monitoring`,
      alerts: [],
      stub: true,
      generatedAt: now(),
    }
  }

  const runtime = getRuntime(context)
  const out = await runtime.runStage(toCycleInput(context, 'MONITORING'))
  return monToOutput(out)
}
