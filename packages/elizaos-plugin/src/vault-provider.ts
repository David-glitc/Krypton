import type { Provider, ProviderResult, VaultState } from './types.js'

/**
 * Vault-state provider: injects vault/policy/constraint context into
 * the agent's system prompt before each cycle stage.
 */
export function createVaultStateProvider(
  fetcher: (vaultPubkey: string) => Promise<VaultState | null>,
  formatFn?: (state: VaultState) => string,
): Provider {
  return {
    name: 'VAULT_STATE',
    description: 'Current vault state, policy limits, and constraint readings. Injected automatically before each agent cycle.',
    get: async (_runtime, context): Promise<ProviderResult> => {
      const vaultPubkey = context.vaultPubkey
      if (!vaultPubkey) {
        return { success: false, data: { error: 'No vaultPubkey provided' } }
      }

      const state = await fetcher(vaultPubkey)
      if (!state) {
        return { success: false, data: { error: `Vault ${vaultPubkey} not found` } }
      }

      const formatted = formatFn ? formatFn(state) : formatVaultState(state)

      return {
        success: true,
        data: {
          ...state,
          formatted,
        },
      }
    },
  }
}

/**
 * Default formatter: produces a human-readable constraint context string
 * for injection into the agent's system prompt.
 */
export function formatVaultState(state: VaultState): string {
  const c = state.constraints
  return [
    '=== VAULT STATE ===',
    `Vault: ${state.vaultPubkey.slice(0, 8)}...${state.vaultPubkey.slice(-4)}`,
    `Paused: ${state.paused}`,
    '',
    '=== CONSTRAINT STATE ===',
    `Drawdown: ${c.currentDrawdownBps} / ${c.maxDrawdownBps} bps`,
    `Leverage: ${c.currentLeverageBps} / ${c.maxLeverageBps} bps`,
    `Concentration: ${c.currentConcentrationBps} / ${c.maxPositionBps} bps`,
    '',
    'Before any action, call CONSTRAINT_CHECK with your proposed params.',
  ].join('\n')
}
