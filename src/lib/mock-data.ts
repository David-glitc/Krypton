// ── Types (kept for type safety, no mock data) ──────────────────────────────

export interface ConstraintState {
  label: string
  current: number
  max: number
  unit: string
}

export type ExecutionMode = 'advisory' | 'constrained_auto' | 'full_auto'
export type GovernanceMode = 'owner' | 'dao_prediction_market'
export type PrivacyLevel = 'standard' | 'full'
export type VaultStatus = 'active' | 'paused' | 'pending'
export type RebalanceFrequency = 'event_driven' | 'hourly' | 'daily' | 'weekly'
export type RiskProfile = 'low' | 'medium' | 'high' | 'custom'
export type PermissionLevel = 1 | 2 | 3 | 4

export interface Vault {
  id: string
  name: string
  nav: number
  policyVersion: number
  level: PermissionLevel
  status: VaultStatus
  executionMode: ExecutionMode
  governanceMode: GovernanceMode
  privacyLevel: PrivacyLevel
  riskProfile: RiskProfile
  rebalanceFrequency: RebalanceFrequency
  allowedActions: string[]
  forbiddenActions: string[]
  assets: string[]
  protocols: string[]
  constraints: {
    drawdown: ConstraintState
    leverage: ConstraintState
    concentration: ConstraintState
    correlatedExposure: ConstraintState
  }
  agentPipeline: {
    lastCycleId: number
    lastCycleAt: string
    lastStage: 'research' | 'strategy' | 'risk' | 'simulation' | 'execution' | 'monitoring'
    lastDecision: 'executed' | 'rejected' | 'advisory_pending' | 'governance_pending'
  }
}

export interface NavHistoryPoint {
  date: string
  nav: number
}

export interface PendingAction {
  id: string
  description: string
  vaultId: string
  vaultName: string
  submittedAt: string
  approvals: number
  required: number
  agentRationale?: string
  simulationScore?: {
    expectedReturn: number
    expectedDrawdown: number
    var95: number
    compositeScore: number
  }
}

export type ActivityType =
  | 'deposit'
  | 'withdrawal'
  | 'constraint_update'
  | 'policy_change'
  | 'rebalance'
  | 'governance_proposal'
  | 'agent_cycle'
  | 'simulation_score'

export interface ActivityEntry {
  id: string
  type: ActivityType
  description: string
  timestamp: string
  vaultName: string
  detail: string
  status: 'completed' | 'pending' | 'failed'
  cycleId?: number
  agentStage?: string
}

export interface GovernanceProposal {
  id: string
  description: string
  proposedPolicyVersion: number
  status: 'trading' | 'passed' | 'failed' | 'finalized'
  twapPass: number
  twapFail: number
  tradingEndsAt: string
}

export interface GeneratedPolicy {
  vaultName: string
  riskProfile: RiskProfile
  maxDrawdownPct: number
  maxLeverage: number
  maxPositionPct: number
  maxCorrelatedExposurePct: number
  liquidityFloorUsd: number
  assets: string[]
  protocols: string[]
  allowedActions: string[]
  forbiddenActions: string[]
  executionMode: ExecutionMode
  rebalanceFrequency: RebalanceFrequency
  privacyLevel: PrivacyLevel
  reasoning: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function constraintToBarInput(constraint: ConstraintState) {
  const pct = Math.min((constraint.current / constraint.max) * 100, 100)
  const color =
    pct > 90 ? 'bg-accent-risk' : pct > 70 ? 'bg-accent-warn' : 'bg-accent-positive'
  return {
    pct,
    color,
    label: constraint.label,
    current: constraint.current,
    max: constraint.max,
    unit: constraint.unit,
  }
}

export function levelName(level: PermissionLevel): string {
  const names: Record<PermissionLevel, string> = {
    1: 'Read-only',
    2: 'Advisory',
    3: 'Constrained auto',
    4: 'Full auto',
  }
  return names[level]
}

export function levelDescription(level: PermissionLevel): string {
  const desc: Record<PermissionLevel, string> = {
    1: 'Agents research and produce reports. No transactions proposed.',
    2: 'Full pipeline runs. Winning candidates surface for manual signature.',
    3: 'Agents execute within hard policy constraints without per-action approval.',
    4: 'Same on-chain constraints as Level 3. No per-cycle notification required.',
  }
  return desc[level]
}
