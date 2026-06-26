/**
 * ElizaOS-compatible plugin types.
 *
 * These match the ElizaOS v2 plugin schema so that @krypton/elizaos-plugin
 * is a drop-in plugin for the full ElizaOS runtime.
 */

export interface Action {
  name: string
  description: string
  similes: string[]
  validate: (params: Record<string, unknown>) => Promise<boolean>
  handler: (params: Record<string, unknown>) => Promise<ActionResult>
  examples?: Array<{ input: Record<string, unknown>; output: Record<string, unknown> }>
}

export interface ActionResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
}

export interface Provider {
  name: string
  description: string
  get: (runtime: unknown, context: ProviderContext) => Promise<ProviderResult>
}

export interface ProviderContext {
  vaultPubkey?: string
  agentPubkey?: string
}

export interface ProviderResult {
  success: boolean
  data: Record<string, unknown>
}

export interface Evaluator {
  name: string
  description: string
  similes: string[]
  alwaysRun?: boolean
  validate: (params: Record<string, unknown>) => Promise<boolean>
  handler: (params: Record<string, unknown>) => Promise<EvaluatorResult>
}

export interface EvaluatorResult {
  success: boolean
  data?: Record<string, unknown>
  error?: string
}

export interface Plugin {
  name: string
  description: string
  actions: Action[]
  providers: Provider[]
  evaluators: Evaluator[]
}

/**
 * Cycle FSM stage types — the 6-stage pipeline every vault cycle runs through.
 */
export type CycleStage =
  | 'RESEARCHING'
  | 'STRATEGIZING'
  | 'RISK_REVIEW'
  | 'SIMULATING'
  | 'PERMISSION_GATE'
  | 'MONITORING'

export const CYCLE_STAGES: CycleStage[] = [
  'RESEARCHING',
  'STRATEGIZING',
  'RISK_REVIEW',
  'SIMULATING',
  'PERMISSION_GATE',
  'MONITORING',
]

export interface CycleInput {
  vaultPubkey: string
  cycleId: number
  stage: CycleStage
  permissionLevel?: number
  context?: Record<string, unknown>
}

export interface CycleOutput {
  stage: CycleStage
  decision: string
  rationale: string
  actions?: string[]
  riskScore?: number
  alerts?: string[]
}

export interface CycleEvaluatorResult {
  finalStage: CycleStage
  outputs: CycleOutput[]
  error?: string
}

/**
 * Constraint check result from on-chain state.
 */
export interface ConstraintCheckParams {
  vaultPubkey: string
  postLeverageBps: bigint
  postConcentrationBps: bigint
  postDrawdownBps: bigint
  postCorrelatedBps: bigint
  targetProtocolId?: number
}

export interface ConstraintCheckResult {
  passed: boolean
  error?: string
}

/**
 * Vault state snapshot for agent context injection.
 */
export interface VaultState {
  vaultPubkey: string
  navUsd: number
  paused: boolean
  constraints: {
    maxLeverageBps: number
    maxDrawdownBps: number
    maxPositionBps: number
    maxCorrelatedExposureBps?: number
    currentLeverageBps: number
    currentDrawdownBps: number
    currentConcentrationBps: number
    lastOracleUpdate: number
  }
}

/**
 * Simulation result from krypton-sim-rs.
 */
export interface SimulationResult {
  candidateId: string
  expectedReturnBps: number
  expectedDrawdownBps: number
  var95Bps: number
  compositeScore: number
  narrative: string
}

/**
 * Solana Agent Kit action specs.
 */
export interface ActionSpec {
  id: string
  label: string
  protocols: string[]
  requiresApproval: boolean
  riskWeight: number
}
