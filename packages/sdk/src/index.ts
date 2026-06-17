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

export const CLUSTER = (import.meta as { env?: Record<string, string> }).env
  ?.VITE_SOLANA_CLUSTER ?? 'devnet'

export const RPC_URL =
  (import.meta as { env?: Record<string, string> }).env?.VITE_SOLANA_RPC_URL ??
  'https://api.devnet.solana.com'

export const KRYPTON_PROGRAM_ID =
  (import.meta as { env?: Record<string, string> }).env?.VITE_KRYPTON_PROGRAM_ID ??
  '4Xs4pQ2vA9bv8dTxoe6cA9sQZBLZr6aKD4RrGnCdB1g6'

export const PROTOCOL_MAX_LEVERAGE_BPS = 20_000
