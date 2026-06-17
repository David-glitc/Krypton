import type { VaultSummary, PendingAction, ConstraintState } from '@krypton/sdk'

export const DEMO_VAULTS: VaultSummary[] = [
  {
    id: 'vault-alpha',
    name: 'alpha-policy-vault',
    navUsd: 12_450,
    permissionLevel: 2,
    policyVersion: 1,
    constraint: {
      currentDrawdownBps: 340,
      maxDrawdownBps: 1200,
      currentLeverageBps: 11200,
      maxLeverageBps: 20000,
      currentPositionConcentrationBps: 1800,
      maxPositionBps: 3500,
      paused: false,
    },
  },
  {
    id: 'vault-beta',
    name: 'treasury-stables',
    navUsd: 48_200,
    permissionLevel: 2,
    policyVersion: 2,
    constraint: {
      currentDrawdownBps: 120,
      maxDrawdownBps: 800,
      currentLeverageBps: 10000,
      maxLeverageBps: 15000,
      currentPositionConcentrationBps: 2200,
      maxPositionBps: 3000,
      paused: false,
    },
  },
]

export const DEMO_PENDING_ACTIONS: Record<string, PendingAction[]> = {
  'vault-alpha': [
    {
      id: 'pa-4821',
      vaultId: 'vault-alpha',
      cycleId: 4821,
      actionType: 'Swap',
      rationale:
        'Rebalance toward SOL exposure within policy universe. Simulation favors moderate risk-adjusted improvement with drawdown within 12% envelope.',
      expectedReturnPct: 4.2,
      expectedDrawdownPct: 3.4,
      var95Pct: 5.1,
      compositeScore: 0.74,
      postLeverageBps: 11800,
      postConcentrationBps: 2100,
      createdAt: new Date().toISOString(),
    },
  ],
  'vault-beta': [],
}

export const NAV_HISTORY = [
  { date: 'Jun 1', nav: 11800 },
  { date: 'Jun 3', nav: 11950 },
  { date: 'Jun 5', nav: 12100 },
  { date: 'Jun 7', nav: 12020 },
  { date: 'Jun 9', nav: 12280 },
  { date: 'Jun 11', nav: 12390 },
  { date: 'Jun 13', nav: 12450 },
]

export function getVault(id: string) {
  return DEMO_VAULTS.find((v) => v.id === id)
}

export function constraintToBarInput(c: ConstraintState) {
  return {
    drawdown: { current: c.currentDrawdownBps / 100, max: c.maxDrawdownBps / 100 },
    leverage: { current: c.currentLeverageBps, max: c.maxLeverageBps },
    concentration: {
      current: c.currentPositionConcentrationBps / 100,
      max: c.maxPositionBps / 100,
    },
  }
}
