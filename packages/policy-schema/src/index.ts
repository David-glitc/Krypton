import { z } from 'zod'

export const RISK_PROFILES = ['low', 'medium', 'high', 'custom'] as const
export const EXECUTION_MODES = ['advisory', 'constrained_auto', 'full_auto'] as const
export const GOVERNANCE_MODES = ['owner', 'dao_prediction_market'] as const
export const PRIVACY_LEVELS = ['standard', 'full'] as const
export const REBALANCE_FREQUENCIES = [
  'event_driven',
  'hourly',
  'daily',
  'weekly',
] as const
export const ALLOWED_ACTIONS = [
  'swap',
  'stake',
  'lend',
  'borrow',
  'provide_liquidity',
] as const
export const DEFAULT_ASSETS = ['SOL', 'ETH', 'BTC', 'USDC', 'USDT'] as const
export const DEFAULT_PROTOCOLS = [
  'jupiter',
  'drift',
  'kamino',
  'sanctum',
  'marginfi',
] as const

export const PROTOCOL_MAX_LEVERAGE = 2.0

export const capitalPolicySchema = z.object({
  policy_version: z.literal(1),
  objective: z.object({
    type: z.enum(['maximize_risk_adjusted_return']),
    benchmark: z.string().optional(),
  }),
  universe: z.object({
    assets: z.array(z.string()).min(1),
    protocols_allowed: z.array(z.string()).min(1),
  }),
  risk: z.object({
    profile: z.enum(RISK_PROFILES),
    max_drawdown_pct: z.number().min(1).max(50),
    max_leverage: z.number().min(1).max(PROTOCOL_MAX_LEVERAGE),
    max_position_pct: z.number().min(5).max(100),
    max_correlated_exposure_pct: z.number().min(10).max(100),
  }),
  liquidity: z.object({
    min_pool_liquidity_usd: z.number().min(0),
  }),
  time_horizon_days: z.number().min(7).max(365),
  allowed_actions: z.array(z.enum(ALLOWED_ACTIONS)).min(1),
  forbidden: z.array(z.string()).default([]),
  execution: z.object({
    mode: z.enum(EXECUTION_MODES),
    rebalance_frequency: z.enum(REBALANCE_FREQUENCIES),
  }),
  governance: z.object({
    mode: z.enum(GOVERNANCE_MODES),
  }),
  privacy: z.object({
    level: z.enum(PRIVACY_LEVELS),
    disclose: z.array(z.string()).default([]),
  }),
  fees: z
    .object({
      management_bps: z.number().min(0).max(500),
      performance_bps: z.number().min(0).max(5000),
      hurdle_rate_pct: z.number().min(0).max(100),
    })
    .default({ management_bps: 0, performance_bps: 1000, hurdle_rate_pct: 0 }),
  emergency: z
    .object({
      pause_authority: z.array(z.string()).default(['owner_wallet']),
      auto_pause_on: z.array(z.string()).default([]),
    })
    .default({ pause_authority: ['owner_wallet'], auto_pause_on: [] }),
})

export type CapitalPolicy = z.infer<typeof capitalPolicySchema>

export const policyBuilderFormSchema = z.object({
  vaultName: z.string().min(2).max(48),
  governanceMode: z.enum(GOVERNANCE_MODES),
  riskProfile: z.enum(RISK_PROFILES),
  maxDrawdownPct: z.coerce.number().min(1).max(50),
  maxLeverage: z.coerce.number().min(1).max(PROTOCOL_MAX_LEVERAGE),
  maxPositionPct: z.coerce.number().min(5).max(100),
  assets: z.array(z.string()).min(1),
  protocols: z.array(z.string()).min(1),
  executionMode: z.enum(EXECUTION_MODES),
  rebalanceFrequency: z.enum(REBALANCE_FREQUENCIES),
  permissionLevel: z.coerce.number().min(1).max(4).default(2),
})

export type PolicyBuilderForm = z.infer<typeof policyBuilderFormSchema>

export function formToCapitalPolicy(form: PolicyBuilderForm): CapitalPolicy {
  return {
    policy_version: 1,
    objective: { type: 'maximize_risk_adjusted_return', benchmark: 'SOL_USD' },
    universe: { assets: form.assets, protocols_allowed: form.protocols },
    risk: {
      profile: form.riskProfile,
      max_drawdown_pct: form.maxDrawdownPct,
      max_leverage: form.maxLeverage,
      max_position_pct: form.maxPositionPct,
      max_correlated_exposure_pct: 60,
    },
    liquidity: { min_pool_liquidity_usd: 5_000_000 },
    time_horizon_days: 90,
    allowed_actions: ['swap', 'stake', 'lend'],
    forbidden: ['leverage_above_policy_max', 'unverified_protocols', 'memecoins'],
    execution: {
      mode: form.executionMode,
      rebalance_frequency: form.rebalanceFrequency,
    },
    governance: { mode: form.governanceMode },
    privacy: {
      level: 'standard',
      disclose: ['proof_of_reserves', 'proof_of_performance', 'fee_accrual', 'vault_nav'],
    },
    fees: { management_bps: 0, performance_bps: 1000, hurdle_rate_pct: 0 },
    emergency: {
      pause_authority: ['owner_wallet', 'protocol_guardian_multisig'],
      auto_pause_on: ['drawdown_exceeds_max', 'oracle_staleness_seconds_gt_120'],
    },
  }
}

export function validateCapitalPolicy(input: unknown) {
  return capitalPolicySchema.safeParse(input)
}

export const defaultPolicyBuilderForm: PolicyBuilderForm = {
  vaultName: '',
  governanceMode: 'owner',
  riskProfile: 'medium',
  maxDrawdownPct: 12,
  maxLeverage: 2,
  maxPositionPct: 35,
  assets: ['SOL', 'USDC', 'USDT'],
  protocols: ['jupiter', 'kamino', 'sanctum'],
  executionMode: 'advisory',
  rebalanceFrequency: 'daily',
  permissionLevel: 2,
}


// ──────────────────────────────────────────
// VaultGoal — user's stated target (non-binding optimization signal)
// ──────────────────────────────────────────

export const VAULT_GOAL_TARGET_TYPES = [
  'multiple',
  'apy',
  'preservation',
  'fixed_use_case',
] as const

export const VAULT_USE_CASES = [
  'compound',
  'save',
  'collateral',
  'onchain_deposit_box',
  'speculative_growth',
] as const

export const vaultGoalSchema = z.object({
  vault: z.string().optional(),
  target_type: z.enum(VAULT_GOAL_TARGET_TYPES),
  target_value: z.number().positive().optional(),
  time_horizon_days: z.number().min(7).max(365),
  use_case: z.enum(VAULT_USE_CASES).optional(),
  created_from_prompt_hash: z.string().optional(),
})

export type VaultGoal = z.infer<typeof vaultGoalSchema>

// ──────────────────────────────────────────
// Feasibility — historical band reference for Policy Compiler
// ──────────────────────────────────────────

export type FeasibilityStatus = 'feasible' | 'infeasible' | 'feasible_with_conditions'

export interface FeasibilityResult {
  status: FeasibilityStatus
  reference_band: {
    min_historical_drawdown_pct: number
    max_historical_drawdown_pct: number
  }
  negotiation_prompt?: string
}

// Historical reference bands per risk profile (from MVP §2.2)
export const HISTORICAL_DRAWDOWN_BANDS: Record<string, { min: number; max: number }> = {
  low: { min: 1, max: 5 },
  'low-medium': { min: 5, max: 10 },
  medium: { min: 10, max: 20 },
  high: { min: 20, max: 40 },
  extreme: { min: 30, max: 60 },
}

export const AGGRESSIVE_THRESHOLD_BPS = 2500 // 25% drawdown -> advisory-only lock
export const PROTOCOL_MAX_LEVERAGE_BPS = 20_000

export function assessFeasibility(
  targetType: string,
  targetValue: number,
  drawdownLimitPct: number,
  timeHorizonDays: number,
): FeasibilityResult {
  const requiredBand = determineRequiredBand(targetType, targetValue, timeHorizonDays)
  const band = HISTORICAL_DRAWDOWN_BANDS[requiredBand]

  if (!band) {
    return {
      status: 'feasible',
      reference_band: { min_historical_drawdown_pct: 0, max_historical_drawdown_pct: 50 },
    }
  }

  const feasible = drawdownLimitPct >= band.min

  if (!feasible) {
    return {
      status: 'infeasible',
      reference_band: { min_historical_drawdown_pct: band.min, max_historical_drawdown_pct: band.max },
      negotiation_prompt:
        `A ${targetValue}x target in ${timeHorizonDays} days historically requires strategies with ` +
        `${band.min}-${band.max}%+ drawdown risk. Your ${drawdownLimitPct}% drawdown limit ` +
        `and this target are not jointly achievable. Consider raising drawdown tolerance, ` +
        `extending horizon, or advisory-only mode.`,
    }
  }

  return {
    status: 'feasible',
    reference_band: { min_historical_drawdown_pct: band.min, max_historical_drawdown_pct: band.max },
  }
}

function determineRequiredBand(targetType: string, targetValue: number, timeHorizonDays: number): string {
  if (targetType === 'preservation' || targetType === 'fixed_use_case') {
    return 'low'
  }
  if (targetType === 'apy') {
    // APY → rough multiple: e.g., 10% APY over 1 year ≈ 1.1x
    const impliedMultiple = 1 + (targetValue / 100) * (timeHorizonDays / 365)
    if (impliedMultiple < 1.1) return 'low'
    if (impliedMultiple < 1.3) return 'low-medium'
    return 'medium'
  }
  // multiple target
  const annualizedFactor = targetValue ** (365 / Math.max(timeHorizonDays, 1))
  if (annualizedFactor < 1.5) return 'low'
  if (annualizedFactor < 3) return 'low-medium'
  if (annualizedFactor < 6) return 'medium'
  if (annualizedFactor < 15) return 'high'
  return 'extreme'
}

// ──────────────────────────────────────────
// Preset Fund Managers (MVP §3.2)
// ──────────────────────────────────────────

export interface PresetFundManager {
  id: string
  name: string
  description: string
  targetType: (typeof VAULT_GOAL_TARGET_TYPES)[number]
  riskProfile: string
  executionMode: string
  assets: string[]
  protocols: string[]
  maxDrawdownPct: number
  maxLeverage: number
  maxPositionPct: number
  hardLockAdvisory: boolean
}

export const PRESET_FUND_MANAGERS: PresetFundManager[] = [
  {
    id: 'stable-saver',
    name: 'Stable Saver',
    description: 'Preservation-focused. Lend USDC/USDT across lending protocols. No swaps, no leverage.',
    targetType: 'preservation',
    riskProfile: 'low',
    executionMode: 'constrained_auto',
    assets: ['USDC', 'USDT'],
    protocols: ['kamino', 'marginfi'],
    maxDrawdownPct: 2,
    maxLeverage: 1,
    maxPositionPct: 50,
    hardLockAdvisory: false,
  },
  {
    id: 'steady-compounder',
    name: 'Steady Compounder',
    description: 'LST yield + lending blend for sustainable ~6-10% APY.',
    targetType: 'apy',
    riskProfile: 'low-medium',
    executionMode: 'constrained_auto',
    assets: ['SOL', 'USDC', 'USDT'],
    protocols: ['sanctum', 'kamino'],
    maxDrawdownPct: 8,
    maxLeverage: 1,
    maxPositionPct: 40,
    hardLockAdvisory: false,
  },
  {
    id: 'growth-allocator',
    name: 'Growth Allocator',
    description: 'Multi-asset growth with advisory → auto progression after track record.',
    targetType: 'multiple',
    riskProfile: 'medium',
    executionMode: 'constrained_auto',
    assets: ['SOL', 'ETH', 'BTC', 'USDC'],
    protocols: ['jupiter', 'kamino', 'sanctum'],
    maxDrawdownPct: 15,
    maxLeverage: 1.5,
    maxPositionPct: 35,
    hardLockAdvisory: false,
  },
  {
    id: 'aggressive-compounder',
    name: 'Aggressive Compounder',
    description: 'High-variance leveraged strategies. HARD-LOCKED to advisory mode regardless of permission level.',
    targetType: 'multiple',
    riskProfile: 'high',
    executionMode: 'advisory',
    assets: ['SOL', 'ETH', 'BTC', 'USDC'],
    protocols: ['jupiter', 'drift'],
    maxDrawdownPct: 30,
    maxLeverage: 2,
    maxPositionPct: 50,
    hardLockAdvisory: true,
  },
  {
    id: 'collateral-vault',
    name: 'Collateral Vault',
    description: 'Hold a single asset as collateral for external borrowing. No strategy pipeline.',
    targetType: 'fixed_use_case',
    riskProfile: 'low',
    executionMode: 'constrained_auto',
    assets: ['SOL', 'USDC'],
    protocols: [],
    maxDrawdownPct: 5,
    maxLeverage: 1,
    maxPositionPct: 100,
    hardLockAdvisory: false,
  },
  {
    id: 'onchain-deposit-box',
    name: 'On-Chain Deposit Box',
    description: 'Degenerate case — deposit and hold. No agent pipeline runs.',
    targetType: 'fixed_use_case',
    riskProfile: 'low',
    executionMode: 'constrained_auto',
    assets: [],
    protocols: [],
    maxDrawdownPct: 100,
    maxLeverage: 1,
    maxPositionPct: 100,
    hardLockAdvisory: false,
  },
]