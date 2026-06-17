import { describe, it, expect } from 'vitest'
import {
  capitalPolicySchema,
  formToCapitalPolicy,
  defaultPolicyBuilderForm,
  RISK_PROFILES,
  policyBuilderFormSchema,
  validateCapitalPolicy,
  vaultGoalSchema,
  assessFeasibility,
  PRESET_FUND_MANAGERS,
} from './index.js'

describe('CapitalPolicy schema', () => {
  it('validates defaultPolicyBuilderForm produces a valid CapitalPolicy', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse(policy)
    expect(result.success).toBe(true)
  })

  it.each(RISK_PROFILES)('validates risk profile "%s" produces valid conversion', (profile) => {
    const form = { ...defaultPolicyBuilderForm, riskProfile: profile }
    const policy = formToCapitalPolicy(form)
    const result = capitalPolicySchema.safeParse(policy)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.risk.profile).toBe(profile)
    }
  })

  it('rejects negative management_bps', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({ ...policy, fees: { ...policy.fees, management_bps: -1 } })
    expect(result.success).toBe(false)
  })

  it('rejects negative performance_bps', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({ ...policy, fees: { ...policy.fees, performance_bps: -100 } })
    expect(result.success).toBe(false)
  })

  it('rejects string values where number is expected', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({ ...policy, time_horizon_days: 'abc' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid enum values', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({ ...policy, risk: { ...policy.risk, profile: 'extreme' } })
    expect(result.success).toBe(false)
  })

  it('validates JSON round-trip produces expected shape', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const json = JSON.stringify(policy)
    const parsed = JSON.parse(json)
    const result = capitalPolicySchema.safeParse(parsed)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.policy_version).toBe(1)
      expect(result.data.objective.type).toBe('maximize_risk_adjusted_return')
      expect(result.data.objective.benchmark).toBe('SOL_USD')
      expect(result.data.universe.assets).toEqual(['SOL', 'USDC', 'USDT'])
      expect(result.data.universe.protocols_allowed).toEqual(['jupiter', 'kamino', 'sanctum'])
      expect(result.data.risk.profile).toBe('medium')
      expect(result.data.risk.max_drawdown_pct).toBe(12)
      expect(result.data.risk.max_leverage).toBe(2)
      expect(result.data.risk.max_position_pct).toBe(35)
      expect(result.data.risk.max_correlated_exposure_pct).toBe(60)
      expect(result.data.liquidity.min_pool_liquidity_usd).toBe(5_000_000)
      expect(result.data.time_horizon_days).toBe(90)
      expect(result.data.allowed_actions).toEqual(['swap', 'stake', 'lend'])
      expect(result.data.execution.mode).toBe('advisory')
      expect(result.data.execution.rebalance_frequency).toBe('daily')
      expect(result.data.governance.mode).toBe('owner')
      expect(result.data.privacy.level).toBe('standard')
      expect(result.data.fees.management_bps).toBe(0)
      expect(result.data.fees.performance_bps).toBe(1000)
      expect(result.data.emergency.pause_authority).toContain('owner_wallet')
    }
  })

  it('rejects empty assets array', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({
      ...policy,
      universe: { ...policy.universe, assets: [] },
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty protocols_allowed array', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({
      ...policy,
      universe: { ...policy.universe, protocols_allowed: [] },
    })
    expect(result.success).toBe(false)
  })

  it('accepts time_horizon_days at minimum (7)', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({ ...policy, time_horizon_days: 7 })
    expect(result.success).toBe(true)
  })

  it('accepts time_horizon_days at maximum (365)', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({ ...policy, time_horizon_days: 365 })
    expect(result.success).toBe(true)
  })

  it('rejects time_horizon_days below minimum (6)', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({ ...policy, time_horizon_days: 6 })
    expect(result.success).toBe(false)
  })

  it('rejects time_horizon_days above maximum (366)', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = capitalPolicySchema.safeParse({ ...policy, time_horizon_days: 366 })
    expect(result.success).toBe(false)
  })
})

describe('PolicyBuilderForm schema', () => {
  it('rejects empty vaultName', () => {
    const result = policyBuilderFormSchema.safeParse(defaultPolicyBuilderForm)
    expect(result.success).toBe(false)
  })

  it('accepts form with valid vaultName', () => {
    const result = policyBuilderFormSchema.safeParse({ ...defaultPolicyBuilderForm, vaultName: 'My Vault' })
    expect(result.success).toBe(true)
  })

  it('rejects non-numeric string for coerced number field', () => {
    const result = policyBuilderFormSchema.safeParse({
      ...defaultPolicyBuilderForm,
      vaultName: 'My Vault',
      maxDrawdownPct: 'not-a-number',
    })
    expect(result.success).toBe(false)
  })
})

describe('validateCapitalPolicy helper', () => {
  it('returns success for valid policy', () => {
    const policy = formToCapitalPolicy(defaultPolicyBuilderForm)
    const result = validateCapitalPolicy(policy)
    expect(result.success).toBe(true)
  })

  it('returns failure for invalid input', () => {
    const result = validateCapitalPolicy({ not_a_policy: true })
    expect(result.success).toBe(false)
  })
})

describe('VaultGoal schema', () => {
  it('validates a multiple target type', () => {
    const result = vaultGoalSchema.safeParse({
      target_type: 'multiple',
      target_value: 5.0,
      time_horizon_days: 70,
      use_case: 'speculative_growth',
    })
    expect(result.success).toBe(true)
  })

  it('validates a preservation target type without value', () => {
    const result = vaultGoalSchema.safeParse({
      target_type: 'preservation',
      time_horizon_days: 90,
    })
    expect(result.success).toBe(true)
  })

  it('rejects time_horizon_days below minimum', () => {
    const result = vaultGoalSchema.safeParse({
      target_type: 'apy',
      time_horizon_days: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe('Feasibility assessment', () => {
  it('returns feasible for conservative target with high tolerance', () => {
    const r = assessFeasibility('preservation', 1.0, 5, 365)
    expect(r.status).toBe('feasible')
    expect(r.reference_band).toBeDefined()
  })

  it('returns infeasible for aggressive target with tight drawdown limit', () => {
    const r = assessFeasibility('multiple', 5.0, 5, 70)
    expect(r.status).toBe('infeasible')
    expect(r.negotiation_prompt).toBeDefined()
  })

  it('returns feasible for matching band', () => {
    const r = assessFeasibility('multiple', 2.0, 15, 365)
    expect(r.status).toBe('feasible')
  })
})

describe('Preset Fund Managers', () => {
  it('contains all expected presets', () => {
    const ids = PRESET_FUND_MANAGERS.map((p) => p.id)
    expect(ids).toContain('stable-saver')
    expect(ids).toContain('steady-compounder')
    expect(ids).toContain('growth-allocator')
    expect(ids).toContain('aggressive-compounder')
    expect(ids).toContain('collateral-vault')
    expect(ids).toContain('onchain-deposit-box')
  })

  it('aggressive-compounder is hard-locked to advisory', () => {
    const p = PRESET_FUND_MANAGERS.find((x) => x.id === 'aggressive-compounder')
    expect(p).toBeDefined()
    expect(p!.executionMode).toBe('advisory')
    expect(p!.hardLockAdvisory).toBe(true)
  })

  it('stable-saver has zero leverage', () => {
    const p = PRESET_FUND_MANAGERS.find((x) => x.id === 'stable-saver')
    expect(p).toBeDefined()
    expect(p!.maxLeverage).toBe(1)
  })
})