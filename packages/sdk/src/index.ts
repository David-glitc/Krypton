export type ActionType =
  | 'Swap'
  | 'Lend'
  | 'Borrow'
  | 'Stake'
  | 'ProvideLiquidity'
  | 'OpenPerp'
  | 'ClosePerp'
  | 'Unstake'

export type ExecutionDecision =
  | 'executed'
  | 'rejected'
  | 'advisory_pending'
  | 'governance_pending'

export interface ConstraintState {
  currentDrawdownBps: number
  maxDrawdownBps: number
  currentLeverageBps: number
  maxLeverageBps: number
  currentPositionConcentrationBps: number
  maxPositionBps: number
  paused: boolean
  pauseReason?: string
}

export interface PendingAction {
  id: string
  vaultId: string
  cycleId: number
  actionType: ActionType
  rationale: string
  expectedReturnPct: number
  expectedDrawdownPct: number
  var95Pct: number
  compositeScore: number
  postLeverageBps: number
  postConcentrationBps: number
  createdAt: string
}

export interface VaultSummary {
  id: string
  name: string
  navUsd: number
  permissionLevel: number
  policyVersion: number
  constraint: ConstraintState
}

export interface VaultGoal {
  vaultId: string
  targetType: 'multiple' | 'apy' | 'preservation' | 'fixed_use_case'
  targetValue?: number
  timeHorizonDays: number
  useCase?: string
}

export interface PolicyAccount {
  vault: string
  policyVersion: number
  contentHash: number[]
  maxDrawdownBps: number
  maxLeverageBps: number
  maxPositionBps: number
}

export interface CreateVaultParams {
  maxDrawdownBps: number
  maxLeverageBps: number
  maxPositionBps: number
}

export interface SubmitPolicyParams {
  maxDrawdownBps: number
  maxLeverageBps: number
  maxPositionBps: number
  contentHash: number[]
}

export interface ExecuteActionParams {
  actionType: number
  postLeverageBps: number
  postConcentrationBps: number
  postDrawdownBps: number
  compositeScore: number
}

export const CLUSTER = (import.meta as { env?: Record<string, string> }).env
  ?.VITE_SOLANA_CLUSTER ?? 'devnet'

export const RPC_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_SOLANA_RPC_URL ??
  'https://api.devnet.solana.com'

export const KRYPTON_PROGRAM_ID =
  (import.meta as { env?: Record<string, string> }).env?.VITE_KRYPTON_PROGRAM_ID ??
  '7CpwaaPcgxiC2oJv8ZdVX6m7fQZ2qDnQ6hGfUayvq1AS'

export const PROTOCOL_MAX_LEVERAGE_BPS = 20_000
export const AGGRESSIVE_THRESHOLD_BPS = 2500
export const MAX_STALENESS_SECONDS = 300
