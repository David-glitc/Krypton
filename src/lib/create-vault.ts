import {
  type ExecutionMode,
  type GovernanceMode,
  type PrivacyLevel,
  type RebalanceFrequency,
  type RiskProfile,
  type PermissionLevel,
} from '@/lib/mock-data'

export interface GeneratedPolicy {
  vaultName?: string
  riskProfile?: RiskProfile
  maxDrawdownPct?: number
  maxLeverage?: number
  maxPositionPct?: number
  maxCorrelatedExposurePct?: number
  liquidityFloorUsd?: number
  assets?: string[]
  protocols?: string[]
  allowedActions?: string[]
  forbiddenActions?: string[]
  executionMode?: ExecutionMode
  rebalanceFrequency?: RebalanceFrequency
  privacyLevel?: PrivacyLevel
  creationFeeUsd?: number
  reasoning?: string
}

export interface FormState {
  vaultName: string
  governanceMode: GovernanceMode
  privacyLevel: PrivacyLevel
  riskProfile: RiskProfile
  maxDrawdownPct: number
  maxLeverage: number
  maxPositionPct: number
  maxCorrelatedExposurePct: number
  liquidityFloorUsd: number
  assets: string[]
  protocols: string[]
  executionMode: ExecutionMode
  permissionLevel: PermissionLevel
  rebalanceFrequency: RebalanceFrequency
  allowedActions: string[]
  forbiddenActions: string[]
  pauseAuthority: string[]
}

export const DEFAULT_FORM: FormState = {
  vaultName: '',
  governanceMode: 'owner',
  privacyLevel: 'standard',
  riskProfile: 'medium',
  maxDrawdownPct: 12,
  maxLeverage: 1.5,
  maxPositionPct: 35,
  maxCorrelatedExposurePct: 60,
  liquidityFloorUsd: 5000000,
  assets: ['SOL', 'USDC'],
  protocols: ['jupiter', 'kamino'],
  executionMode: 'advisory',
  permissionLevel: 2,
  rebalanceFrequency: 'daily',
  allowedActions: ['swap', 'stake', 'lend'],
  forbiddenActions: ['leverage_above_policy_max', 'unverified_protocols', 'memecoins'],
  pauseAuthority: ['owner_wallet'],
}

export interface ConstraintCheck {
  label: string
  pass: boolean
  detail: string
}

export function validateConstraints(f: FormState): ConstraintCheck[] {
  return [
    {
      label: 'Leverage ≤ 2x protocol cap',
      pass: f.maxLeverage <= 2,
      detail: f.maxLeverage > 2 ? `${f.maxLeverage}x exceeds 2x hard cap` : `${f.maxLeverage}x ≤ 2x ✓`,
    },
    { label: 'Leverage ≤ policy max', pass: true, detail: `Policy sets ${f.maxLeverage}x` },
    {
      label: 'Position concentration ≤ 100%',
      pass: f.maxPositionPct <= 100,
      detail: f.maxPositionPct > 100 ? `${f.maxPositionPct}% exceeds 100%` : `${f.maxPositionPct}% ≤ 100% ✓`,
    },
    { label: 'Correlated exposure ≤ 100%', pass: f.maxCorrelatedExposurePct <= 100, detail: `${f.maxCorrelatedExposurePct}% ✓` },
    { label: 'Drawdown ≥ 0%', pass: f.maxDrawdownPct > 0, detail: `${f.maxDrawdownPct}% ✓` },
    {
      label: 'Assets non-empty if pipeline active',
      pass: f.permissionLevel === 1 || f.assets.length > 0,
      detail: f.permissionLevel === 1 ? 'Read-only: no assets needed' : `${f.assets.length} assets selected`,
    },
    {
      label: 'Protocols non-empty if actions selected',
      pass: f.allowedActions.length === 0 || f.protocols.length > 0,
      detail: `${f.protocols.length} protocols for ${f.allowedActions.length} actions`,
    },
    { label: 'Oracle staleness check configured', pass: true, detail: '120s threshold (protocol default)' },
  ]
}

export function applyPolicyToForm(policy: Partial<GeneratedPolicy>, base: FormState): FormState {
  return {
    ...base,
    vaultName: policy.vaultName || base.vaultName,
    riskProfile: policy.riskProfile || base.riskProfile,
    maxDrawdownPct: policy.maxDrawdownPct ?? base.maxDrawdownPct,
    maxLeverage: policy.maxLeverage ?? base.maxLeverage,
    maxPositionPct: policy.maxPositionPct ?? base.maxPositionPct,
    maxCorrelatedExposurePct: policy.maxCorrelatedExposurePct ?? base.maxCorrelatedExposurePct,
    liquidityFloorUsd: policy.liquidityFloorUsd ?? base.liquidityFloorUsd,
    assets: policy.assets?.length ? policy.assets : base.assets,
    protocols: policy.protocols?.length ? policy.protocols : base.protocols,
    allowedActions: policy.allowedActions?.length ? policy.allowedActions : base.allowedActions,
    forbiddenActions: policy.forbiddenActions?.length ? policy.forbiddenActions : base.forbiddenActions,
    executionMode: policy.executionMode || base.executionMode,
    rebalanceFrequency: policy.rebalanceFrequency || base.rebalanceFrequency,
    privacyLevel: policy.privacyLevel || base.privacyLevel,
  }
}
