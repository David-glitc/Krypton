// ── Types ──────────────────────────────────────────────────────────────────

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

// ── Data ───────────────────────────────────────────────────────────────────

const VAULTS: Vault[] = [
  {
    id: 'vault-alpha',
    name: 'vault-alpha',
    nav: 45230,
    policyVersion: 3,
    level: 2,
    status: 'active',
    executionMode: 'advisory',
    governanceMode: 'owner',
    privacyLevel: 'standard',
    riskProfile: 'medium',
    rebalanceFrequency: 'daily',
    allowedActions: ['swap', 'stake', 'lend', 'provide_liquidity'],
    forbiddenActions: ['leverage_above_policy_max', 'unverified_protocols', 'memecoins'],
    assets: ['SOL', 'ETH', 'USDC', 'USDT'],
    protocols: ['jupiter', 'kamino', 'sanctum'],
    constraints: {
      drawdown: { label: 'Max Drawdown', current: 2.1, max: 12, unit: '%' },
      leverage: { label: 'Max Leverage', current: 1.0, max: 2.0, unit: 'x' },
      concentration: { label: 'Concentration', current: 28, max: 35, unit: '%' },
      correlatedExposure: { label: 'Correlated Exposure', current: 32, max: 60, unit: '%' },
    },
    agentPipeline: {
      lastCycleId: 147,
      lastCycleAt: '1h ago',
      lastStage: 'execution',
      lastDecision: 'executed',
    },
  },
  {
    id: 'vault-treasury',
    name: 'vault-treasury',
    nav: 128500,
    policyVersion: 1,
    level: 3,
    status: 'active',
    executionMode: 'constrained_auto',
    governanceMode: 'dao_prediction_market',
    privacyLevel: 'standard',
    riskProfile: 'low',
    rebalanceFrequency: 'weekly',
    allowedActions: ['swap', 'lend', 'stake'],
    forbiddenActions: ['leverage_above_policy_max', 'unverified_protocols', 'memecoins', 'borrow'],
    assets: ['SOL', 'USDC', 'USDT'],
    protocols: ['kamino', 'jupiter'],
    constraints: {
      drawdown: { label: 'Max Drawdown', current: 1.2, max: 8, unit: '%' },
      leverage: { label: 'Max Leverage', current: 1.0, max: 1.5, unit: 'x' },
      concentration: { label: 'Concentration', current: 22, max: 35, unit: '%' },
      correlatedExposure: { label: 'Correlated Exposure', current: 25, max: 50, unit: '%' },
    },
    agentPipeline: {
      lastCycleId: 89,
      lastCycleAt: '3d ago',
      lastStage: 'monitoring',
      lastDecision: 'executed',
    },
  },
  {
    id: 'vault-growth',
    name: 'vault-growth',
    nav: 78400,
    policyVersion: 2,
    level: 4,
    status: 'active',
    executionMode: 'full_auto',
    governanceMode: 'owner',
    privacyLevel: 'full',
    riskProfile: 'high',
    rebalanceFrequency: 'daily',
    allowedActions: ['swap', 'stake', 'lend', 'borrow', 'provide_liquidity'],
    forbiddenActions: ['leverage_above_policy_max', 'unverified_protocols', 'memecoins'],
    assets: ['SOL', 'ETH', 'BTC', 'USDC'],
    protocols: ['jupiter', 'drift', 'kamino', 'sanctum', 'marginfi'],
    constraints: {
      drawdown: { label: 'Max Drawdown', current: 4.8, max: 12, unit: '%' },
      leverage: { label: 'Max Leverage', current: 1.4, max: 2.0, unit: 'x' },
      concentration: { label: 'Concentration', current: 31, max: 35, unit: '%' },
      correlatedExposure: { label: 'Correlated Exposure', current: 45, max: 60, unit: '%' },
    },
    agentPipeline: {
      lastCycleId: 203,
      lastCycleAt: '45m ago',
      lastStage: 'execution',
      lastDecision: 'executed',
    },
  },
]

export const DEMO_VAULTS = VAULTS

export const NAV_HISTORY: NavHistoryPoint[] = [
  { date: '2026-05-01', nav: 38000 },
  { date: '2026-05-05', nav: 39200 },
  { date: '2026-05-10', nav: 37800 },
  { date: '2026-05-15', nav: 41000 },
  { date: '2026-05-20', nav: 42500 },
  { date: '2026-05-25', nav: 43100 },
  { date: '2026-05-30', nav: 44800 },
  { date: '2026-06-05', nav: 43900 },
  { date: '2026-06-10', nav: 45230 },
  { date: '2026-06-15', nav: 45230 },
]

export const DEMO_PENDING_ACTIONS: PendingAction[] = [
  {
    id: 'pa-1',
    description: 'Rebalance: rotate 12% SOL → USDC per risk agent signal',
    vaultId: 'vault-alpha',
    vaultName: 'vault-alpha',
    submittedAt: '2h ago',
    approvals: 0,
    required: 1,
    agentRationale: 'Research Agent flagged elevated SOL volatility (30d realized vol +18%). Risk Agent passed with adjusted allocation. Simulation Agent composite score: 0.74.',
    simulationScore: {
      expectedReturn: 0.04,
      expectedDrawdown: 0.03,
      var95: 0.02,
      compositeScore: 0.74,
    },
  },
  {
    id: 'pa-2',
    description: 'Add JitoSOL to universe.assets (Sanctum LST)',
    vaultId: 'vault-treasury',
    vaultName: 'vault-treasury',
    submittedAt: '5h ago',
    approvals: 1,
    required: 2,
    agentRationale: 'Strategy Agent identified JitoSOL as highest-yielding LST within policy risk bounds. Requires policy amendment (owner signature).',
  },
]

export const DEMO_ACTIVITY: ActivityEntry[] = [
  {
    id: 'act-1',
    type: 'deposit',
    description: 'Deposit received',
    timestamp: '10m ago',
    vaultName: 'vault-alpha',
    detail: '+$5,000 USDC',
    status: 'completed',
  },
  {
    id: 'act-2',
    type: 'rebalance',
    description: 'Agent cycle #147 — rebalance executed',
    timestamp: '1h ago',
    vaultName: 'vault-alpha',
    detail: 'SOL → USDC (12%)',
    status: 'completed',
    cycleId: 147,
    agentStage: 'execution',
  },
  {
    id: 'act-3',
    type: 'agent_cycle',
    description: 'Cycle #147 — Research → Strategy → Risk → Simulation → Execute',
    timestamp: '1h ago',
    vaultName: 'vault-alpha',
    detail: 'composite_score: 0.74',
    status: 'completed',
    cycleId: 147,
  },
  {
    id: 'act-4',
    type: 'governance_proposal',
    description: 'Governance (futarchy) — coming soon',
    timestamp: '—',
    vaultName: 'vault-treasury',
    detail: 'disabled',
    status: 'pending',
  },
  {
    id: 'act-5',
    type: 'policy_change',
    description: 'Policy amended: v1 → v2 (add sanctum protocol)',
    timestamp: '2d ago',
    vaultName: 'vault-treasury',
    detail: 'v1 → v2',
    status: 'completed',
  },
  {
    id: 'act-6',
    type: 'withdrawal',
    description: 'Withdrawal processed',
    timestamp: '3d ago',
    vaultName: 'vault-treasury',
    detail: '-$12,000 USDC',
    status: 'completed',
  },
]

export const DEMO_GOVERNANCE_PROPOSALS: GovernanceProposal[] = [
  {
    id: 'gp-1',
    description: 'Increase ETH allocation ceiling from 20% to 30%, add Sanctum Infinity router',
    proposedPolicyVersion: 2,
    status: 'trading',
    twapPass: 1.04,
    twapFail: 0.97,
    tradingEndsAt: '2026-06-24',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

export function getVault(id: string): Vault | undefined {
  return VAULTS.find((v) => v.id === id)
}

export function constraintToBarInput(constraint: ConstraintState) {
  const pct = Math.min((constraint.current / constraint.max) * 100, 100)
  const color =
    pct > 90 ? 'bg-accent-risk' : pct > 70 ? 'bg-amber-500' : 'bg-accent-positive'
  return {
    pct,
    color,
    label: constraint.label,
    current: constraint.current,
    max: constraint.max,
    unit: constraint.unit,
  }
}

export function isInviteAllowed(_vaultId: string): boolean {
  return true
}

export function getInviteHint(_vaultId: string): string {
  return 'Invite co-signers to approve policy changes and constraint updates.'
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
