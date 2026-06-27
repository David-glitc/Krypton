import type { CapitalPolicy, Character, CharacterGoal, KryptonConstraints, ModelProviderName, VaultGoalInput } from './types.js'

const RISK_SYSTEM_PROMPTS: Record<string, string> = {
  low: 'You are a conservative capital allocator focused on capital preservation. Prioritize stable assets, established protocols, and minimal leverage. Never chase yield at the expense of principal safety.',
  medium: 'You are a balanced capital allocator seeking risk-adjusted returns. You take calculated positions within policy bounds, diversifying across assets and protocols to manage risk while pursuing growth.',
  high: 'You are an aggressive capital allocator seeking maximum returns within defined risk parameters. You actively rotate between opportunities and use leverage strategically, always respecting hard policy constraints.',
}

const RISK_BIO_LINES: Record<string, string[]> = {
  low: [
    'Capital preservation specialist',
    'Prefers LST staking and blue-chip lending over volatile strategies',
    'Never exceeds conservative allocation limits',
  ],
  medium: [
    'Balanced growth allocator',
    'Seeks risk-adjusted returns across diversified positions',
    'Actively manages portfolio within policy guardrails',
  ],
  high: [
    'High-conviction alpha hunter',
    'Aggressively pursues yield opportunities within risk limits',
    'Uses leverage and perp strategies strategically',
  ],
}

function profileToRiskLevel(profile: string): string {
  if (['low', 'conservative', 'stable', 'preservation'].includes(profile)) return 'low'
  if (['medium', 'moderate', 'balanced', 'growth'].includes(profile)) return 'medium'
  return 'high'
}

function rebalanceFrequencyFromPolicy(freq: string): KryptonConstraints['rebalanceFrequency'] {
  const map: Record<string, KryptonConstraints['rebalanceFrequency']> = {
    event_driven: 'event_driven',
    hourly: 'hourly',
    daily: 'daily',
    weekly: 'weekly',
    never: 'never',
  }
  return map[freq] ?? 'daily'
}

function generateModelConfig(policy: CapitalPolicy): { provider: ModelProviderName; model: string } {
  const riskLevel = profileToRiskLevel(policy.risk.profile)
  if (riskLevel === 'high') {
    return { provider: 'anthropic', model: 'claude-sonnet-4-6' }
  }
  return { provider: 'anthropic', model: 'claude-haiku-4-5' }
}

function generateGoals(policy: CapitalPolicy, vaultGoal?: VaultGoalInput): CharacterGoal[] {
  const goals: CharacterGoal[] = []
  const riskLevel = profileToRiskLevel(policy.risk.profile)

  if (policy.objective.type === 'maximize_risk_adjusted_return') {
    goals.push({
      name: 'risk_adjusted_return',
      description: `Maximize risk-adjusted returns with ${riskLevel} risk profile`,
      condition: `current_drawdown < max_drawdown && leverage <= max_leverage`,
    })
  } else if (policy.objective.type === 'capital_preservation') {
    goals.push({
      name: 'capital_preservation',
      description: 'Maintain NAV above 99% of peak at all times',
      condition: 'current_drawdown <= max_drawdown * 0.5',
    })
  }

  if (vaultGoal?.targetType === 'multiple') {
    goals.push({
      name: 'target_multiple',
      description: vaultGoal.description ?? `Grow capital ${vaultGoal.targetValue}x within ${vaultGoal.timeHorizonDays} days`,
      condition: `nav_multiple >= ${vaultGoal.targetValue}`,
    })
  }

  goals.push({
    name: 'policy_compliance',
    description: 'Never violate policy constraints',
    condition: 'all_constraints_pass == true',
  })

  return goals
}

function generateSystemPrompt(policy: CapitalPolicy): string {
  const riskLevel = profileToRiskLevel(policy.risk.profile)
  const basePrompt = RISK_SYSTEM_PROMPTS[riskLevel] ?? RISK_SYSTEM_PROMPTS.medium

  const actionDesc = policy.allowed_actions?.length
    ? `You are restricted to these actions: ${policy.allowed_actions.join(', ')}.`
    : ''

  const assetDesc = policy.universe.assets.length
    ? `Your asset universe: ${policy.universe.assets.join(', ')}.`
    : 'Trade only whitelisted assets.'

  const protocolDesc = policy.universe.protocols_allowed.length
    ? `Allowed protocols: ${policy.universe.protocols_allowed.join(', ')}.`
    : ''

  return [
    basePrompt,
    actionDesc,
    assetDesc,
    protocolDesc,
    `Max drawdown: ${policy.risk.max_drawdown_pct}%. Max leverage: ${policy.risk.max_leverage}x. Max position size: ${policy.risk.max_position_pct}%.`,
    policy.execution.mode === 'advisory'
      ? 'You operate in advisory mode — propose actions for user approval. Never execute without confirmation.'
      : 'You operate in constrained auto-execute mode — execute within policy bounds without per-action approval.',
    'Before any action, call constraint_check() to verify on-chain policy compliance.',
  ].filter(Boolean).join(' ')
}

function generateConstraints(policy: CapitalPolicy): KryptonConstraints {
  return {
    maxLeverageBps: Math.round(policy.risk.max_leverage * 1000),
    maxDrawdownBps: Math.round(policy.risk.max_drawdown_pct * 100),
    maxPositionBps: Math.round(policy.risk.max_position_pct * 100),
    maxCorrelatedExposureBps: policy.risk.max_correlated_exposure_pct
      ? Math.round(policy.risk.max_correlated_exposure_pct * 100)
      : 6000,
    allowedProtocols: policy.universe.protocols_allowed,
    allowedActions: policy.allowed_actions ?? ['swap', 'stake', 'lend'],
    allowedAssets: policy.universe.assets,
    rebalanceFrequency: rebalanceFrequencyFromPolicy(policy.execution.rebalance_frequency),
  }
}

function generateKnowledge(policy: CapitalPolicy): string[] {
  const k: string[] = []
  if (policy.objective.benchmark) {
    k.push(`Benchmark: ${policy.objective.benchmark}`)
  }
  return k
}

/**
 * Generate an ElizaOS-compatible character file from a Capital Policy.
 * This allows ANY policy to become an autonomous agent, not just the 6 presets.
 */
export function generateCharacterFromPolicy(
  policy: CapitalPolicy,
  vaultGoal?: VaultGoalInput,
  name?: string,
): Character {
  const riskLevel = profileToRiskLevel(policy.risk.profile)
  const modelConfig = generateModelConfig(policy)

  return {
    name: name ?? `policy-agent-${riskLevel}`,
    modelProvider: modelConfig.provider,
    settings: {
      model: modelConfig.model,
      temperature: riskLevel === 'high' ? 0.4 : 0.2,
      maxTokens: 4096,
      chains: {
        solana: {
          allowedActions: policy.allowed_actions ?? ['swap', 'stake', 'lend'],
          allowedProtocols: policy.universe.protocols_allowed,
          maxSlippageBps: riskLevel === 'high' ? 100 : 50,
        },
      },
    },
    plugins: [
      '@elizaos/plugin-solana-agent-kit',
      '@krypton/elizaos-plugin',
    ],
    system: generateSystemPrompt(policy),
    bio: generateBio(policy),
    lore: generateLore(policy),
    knowledge: generateKnowledge(policy),
    goals: generateGoals(policy, vaultGoal),
    constraints: generateConstraints(policy),
    style: {
      all: ['Concise', 'Data-driven', 'Policy-aware'],
      chat: ['Professional', 'Clear rationale'],
    },
    topics: ['DeFi', 'Solana', 'Capital markets', policy.objective.type],
    adjectives: riskLevel === 'low'
      ? ['Conservative', 'Methodical', 'Risk-aware']
      : riskLevel === 'medium'
        ? ['Balanced', 'Strategic', 'Analytical']
        : ['Aggressive', 'Conviction-driven', 'Opportunistic'],
  }
}

function generateBio(policy: CapitalPolicy): string[] {
  const riskLevel = profileToRiskLevel(policy.risk.profile)
  const bios = RISK_BIO_LINES[riskLevel] ?? RISK_BIO_LINES.medium
  return [
    ...bios,
    `Manages capital in ${policy.universe.assets.slice(0, 3).join(', ')}${policy.universe.assets.length > 3 ? ', and more' : ''}`,
    `Constrained by ${policy.risk.max_drawdown_pct}% max drawdown, ${policy.risk.max_leverage}x max leverage`,
  ]
}

function generateLore(policy: CapitalPolicy): string[] {
  return [
    `Operates under ${policy.execution.mode} execution mode`,
    `Rebalances ${policy.execution.rebalance_frequency}`,
    `Uses ${policy.universe.protocols_allowed.slice(0, 3).join(', ')} protocols`,
  ]
}

/**
 * Generate a preset character for one of the 6 built-in fund manager types.
 */
export function generatePresetCharacter(
  presetName: string,
  vaultGoal?: VaultGoalInput,
): Character {
  const presets: Record<string, Partial<CapitalPolicy>> = {
    'stable-saver': {
      objective: { type: 'capital_preservation', benchmark: 'USDC' },
      universe: { assets: ['SOL', 'USDC', 'jitoSOL', 'JupSOL'], protocols_allowed: ['sanctum', 'kamino'] },
      risk: { profile: 'low', max_drawdown_pct: 5, max_leverage: 1, max_position_pct: 40, max_correlated_exposure_pct: 30 },
      execution: { mode: 'constrained_auto', rebalance_frequency: 'weekly' },
      allowed_actions: ['stake', 'lend'],
    },
    'steady-compounder': {
      objective: { type: 'maximize_risk_adjusted_return', benchmark: 'SOL_USD' },
      universe: { assets: ['SOL', 'USDC', 'USDT', 'jitoSOL'], protocols_allowed: ['kamino', 'sanctum', 'jupiter'] },
      risk: { profile: 'medium', max_drawdown_pct: 8, max_leverage: 1.5, max_position_pct: 35, max_correlated_exposure_pct: 50 },
      execution: { mode: 'constrained_auto', rebalance_frequency: 'daily' },
      allowed_actions: ['swap', 'lend', 'stake'],
    },
    'growth-allocator': {
      objective: { type: 'maximize_risk_adjusted_return', benchmark: 'SOL_USD' },
      universe: { assets: ['SOL', 'ETH', 'USDC', 'jitoSOL'], protocols_allowed: ['jupiter', 'kamino', 'drift', 'sanctum'] },
      risk: { profile: 'medium', max_drawdown_pct: 12, max_leverage: 2, max_position_pct: 35, max_correlated_exposure_pct: 60 },
      execution: { mode: 'constrained_auto', rebalance_frequency: 'daily' },
      allowed_actions: ['swap', 'lend', 'stake', 'provide_liquidity'],
    },
    'aggressive-compounder': {
      objective: { type: 'maximize_risk_adjusted_return', benchmark: 'SOL_USD' },
      universe: { assets: ['SOL', 'ETH', 'USDC', 'BTC'], protocols_allowed: ['jupiter', 'drift', 'kamino'] },
      risk: { profile: 'high', max_drawdown_pct: 20, max_leverage: 2, max_position_pct: 50, max_correlated_exposure_pct: 70 },
      execution: { mode: 'constrained_auto', rebalance_frequency: 'daily' },
      allowed_actions: ['swap', 'lend', 'borrow', 'open_perp', 'close_perp'],
    },
    'collateral-vault': {
      objective: { type: 'maximize_risk_adjusted_return' },
      universe: { assets: ['SOL', 'USDC', 'ETH', 'BTC'], protocols_allowed: ['jupiter', 'kamino', 'drift'] },
      risk: { profile: 'medium', max_drawdown_pct: 10, max_leverage: 0, max_position_pct: 100, max_correlated_exposure_pct: 80 },
      execution: { mode: 'advisory', rebalance_frequency: 'event_driven' },
      allowed_actions: ['swap', 'lend', 'borrow'],
    },
    'on-chain-deposit-box': {
      objective: { type: 'capital_preservation', benchmark: 'USDC' },
      universe: { assets: ['SOL', 'USDC'], protocols_allowed: ['sanctum'] },
      risk: { profile: 'low', max_drawdown_pct: 2, max_leverage: 1, max_position_pct: 100, max_correlated_exposure_pct: 100 },
      execution: { mode: 'constrained_auto', rebalance_frequency: 'never' },
      allowed_actions: ['stake'],
    },
  }

  const preset = presets[presetName]
  if (!preset) {
    throw new Error(`Unknown preset: ${presetName}. Available: ${Object.keys(presets).join(', ')}`)
  }

  return generateCharacterFromPolicy(preset as CapitalPolicy, vaultGoal, presetName)
}
