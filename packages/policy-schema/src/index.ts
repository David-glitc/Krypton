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
