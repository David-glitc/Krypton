// ── Types ──────────────────────────────────────────────────────────────────

export interface ConstraintState {
  label: string
  current: number
  max: number
  unit: string
}

export interface Vault {
  id: string
  name: string
  nav: number
  policyVersion: number
  level: number
  status: 'active' | 'paused' | 'pending'
  constraints: {
    drawdown: ConstraintState
    leverage: ConstraintState
    concentration: ConstraintState
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
}

export interface ActivityEntry {
  id: string
  type: 'deposit' | 'withdrawal' | 'constraint_update' | 'policy_change' | 'rebalance'
  description: string
  timestamp: string
  vaultName: string
  detail: string
  status: 'completed' | 'pending' | 'failed'
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
    constraints: {
      drawdown: { label: 'Max Drawdown', current: 2, max: 10, unit: '%' },
      leverage: { label: 'Max Leverage', current: 1.2, max: 3.0, unit: 'x' },
      concentration: { label: 'Concentration', current: 35, max: 60, unit: '%' },
    },
  },
  {
    id: 'vault-treasury',
    name: 'vault-treasury',
    nav: 128500,
    policyVersion: 1,
    level: 2,
    status: 'active',
    constraints: {
      drawdown: { label: 'Max Drawdown', current: 5, max: 10, unit: '%' },
      leverage: { label: 'Max Leverage', current: 1.0, max: 3.0, unit: 'x' },
      concentration: { label: 'Concentration', current: 18, max: 60, unit: '%' },
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
    description: 'Increase drawdown limit from 10% to 15%',
    vaultId: 'vault-alpha',
    vaultName: 'vault-alpha',
    submittedAt: '2h ago',
    approvals: 1,
    required: 2,
  },
  {
    id: 'pa-2',
    description: 'Add new asset class: staked SOL derivatives',
    vaultId: 'vault-treasury',
    vaultName: 'vault-treasury',
    submittedAt: '5h ago',
    approvals: 0,
    required: 2,
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
    description: 'Portfolio rebalanced',
    timestamp: '1h ago',
    vaultName: 'vault-alpha',
    detail: 'SOL → USDC (12%)',
    status: 'completed',
  },
  {
    id: 'act-3',
    type: 'constraint_update',
    description: 'Drawdown limit increase proposed',
    timestamp: '2h ago',
    vaultName: 'vault-alpha',
    detail: '10% → 15%',
    status: 'pending',
  },
  {
    id: 'act-4',
    type: 'policy_change',
    description: 'Policy schema updated',
    timestamp: '1d ago',
    vaultName: 'vault-treasury',
    detail: 'v1 → v2',
    status: 'completed',
  },
  {
    id: 'act-5',
    type: 'withdrawal',
    description: 'Withdrawal processed',
    timestamp: '2d ago',
    vaultName: 'vault-treasury',
    detail: '-$12,000 USDC',
    status: 'completed',
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
  return { pct, color, label: constraint.label, current: constraint.current, max: constraint.max, unit: constraint.unit }
}

export function isInviteAllowed(_vaultId: string): boolean {
  return true
}

export function getInviteHint(_vaultId: string): string {
  return 'Invite co-signers to approve policy changes and constraint updates.'
}
