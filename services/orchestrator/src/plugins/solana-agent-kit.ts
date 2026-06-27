/**
 * Solana Agent Kit action stubs — defines the actions that the agent can invoke.
 * In production, these call the real @solana-agent-kit/plugin-solana actions.
 */

export type SolanaAction =
  | 'swap'
  | 'stake'
  | 'unstake'
  | 'lend'
  | 'borrow'
  | 'repay'
  | 'withdraw'
  | 'open_perp'
  | 'close_perp'
  | 'provide_liquidity'
  | 'remove_liquidity'
  | 'transfer'
  | 'noop'

export interface ActionSpec {
  id: SolanaAction
  label: string
  protocols: string[]
  requiresApproval: boolean
  riskWeight: number
}

export const ALL_SOLANA_ACTIONS: ActionSpec[] = [
  { id: 'swap', label: 'Token swap via Jupiter', protocols: ['jupiter'], requiresApproval: false, riskWeight: 1 },
  { id: 'stake', label: 'Liquid staking via Sanctum/Jito', protocols: ['sanctum', 'jito'], requiresApproval: false, riskWeight: 0.5 },
  { id: 'unstake', label: 'Unstake liquid staking tokens', protocols: ['sanctum', 'jito'], requiresApproval: false, riskWeight: 0.5 },
  { id: 'lend', label: 'Supply liquidity to lending protocol', protocols: ['kamino', 'marginfi'], requiresApproval: false, riskWeight: 0.8 },
  { id: 'borrow', label: 'Borrow from lending protocol', protocols: ['kamino', 'marginfi', 'drift'], requiresApproval: true, riskWeight: 2 },
  { id: 'repay', label: 'Repay borrowed position', protocols: ['kamino', 'marginfi', 'drift'], requiresApproval: false, riskWeight: 0.3 },
  { id: 'withdraw', label: 'Withdraw supplied liquidity', protocols: ['kamino', 'marginfi'], requiresApproval: false, riskWeight: 0.3 },
  { id: 'open_perp', label: 'Open perpetual position on Drift', protocols: ['drift'], requiresApproval: true, riskWeight: 3 },
  { id: 'close_perp', label: 'Close perpetual position', protocols: ['drift'], requiresApproval: true, riskWeight: 2 },
  { id: 'provide_liquidity', label: 'Provide concentrated liquidity', protocols: ['meteora', 'raydium'], requiresApproval: false, riskWeight: 1.5 },
  { id: 'remove_liquidity', label: 'Remove concentrated liquidity', protocols: ['meteora', 'raydium'], requiresApproval: false, riskWeight: 1 },
  { id: 'transfer', label: 'Transfer token between wallets', protocols: [], requiresApproval: true, riskWeight: 0.1 },
  { id: 'noop', label: 'No operation — skip cycle', protocols: [], requiresApproval: false, riskWeight: 0 },
]

export function getAction(actionId: SolanaAction): ActionSpec | undefined {
  return ALL_SOLANA_ACTIONS.find((a) => a.id === actionId)
}

export function filterActionsByPolicy(
  actions: SolanaAction[],
  allowedActions: string[],
  allowedProtocols: string[],
): SolanaAction[] {
  return actions.filter((actionId) => {
    const spec = getAction(actionId)
    if (!spec) return false
    if (!allowedActions.includes(actionId)) return false
    if (spec.protocols.length > 0 && !spec.protocols.some((p) => allowedProtocols.includes(p))) {
      return false
    }
    return true
  })
}
