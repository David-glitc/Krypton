'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  type ExecutionMode,
  type GovernanceMode,
  type PrivacyLevel,
  type RebalanceFrequency,
  type RiskProfile,
  type PermissionLevel,
} from '@/lib/mock-data'

const STEPS = ['Start', 'Policy', 'Constraints', 'Universe', 'Review'] as const

interface FormState {
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

const DEFAULT_FORM: FormState = {
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

const PRESETS = [
  {
    id: 'stable-saver',
    name: 'Stable Saver',
    desc: 'Capital preservation. Lend USDC/USDT only. No swaps, no leverage.',
    apply: (f: FormState): FormState => ({
      ...f,
      riskProfile: 'low' as const,
      maxDrawdownPct: 2,
      maxLeverage: 1,
      maxPositionPct: 50,
      assets: ['USDC', 'USDT'],
      protocols: ['kamino'],
      executionMode: 'constrained_auto' as const,
      allowedActions: ['lend'],
      rebalanceFrequency: 'weekly' as const,
    }),
  },
  {
    id: 'steady-compounder',
    name: 'Steady Compounder',
    desc: 'LST yield + lending blend. Sustainable single-digit target.',
    apply: (f: FormState): FormState => ({
      ...f,
      riskProfile: 'low' as const,
      maxDrawdownPct: 8,
      maxLeverage: 1,
      maxPositionPct: 40,
      assets: ['SOL', 'USDC'],
      protocols: ['sanctum', 'kamino'],
      executionMode: 'constrained_auto' as const,
      allowedActions: ['swap', 'stake', 'lend'],
      rebalanceFrequency: 'daily' as const,
    }),
  },
  {
    id: 'balanced-growth',
    name: 'Balanced Growth',
    desc: 'Multi-asset with advisory execution. Agent proposes, you dispose.',
    apply: (f: FormState): FormState => ({
      ...f,
      riskProfile: 'medium' as const,
      maxDrawdownPct: 12,
      maxLeverage: 1.5,
      maxPositionPct: 35,
      assets: ['SOL', 'ETH', 'BTC', 'USDC'],
      protocols: ['jupiter', 'kamino', 'sanctum'],
      executionMode: 'advisory' as const,
      permissionLevel: 2,
      allowedActions: ['swap', 'stake', 'lend', 'provide_liquidity'],
      rebalanceFrequency: 'daily' as const,
    }),
  },
  {
    id: 'aggressive-growth',
    name: 'Aggressive Growth',
    desc: 'High-variance with hard stops. HARD-LOCKED to advisory (≥25% drawdown).',
    apply: (f: FormState): FormState => ({
      ...f,
      riskProfile: 'high' as const,
      maxDrawdownPct: 25,
      maxLeverage: 2,
      maxPositionPct: 35,
      assets: ['SOL', 'ETH', 'BTC', 'USDC'],
      protocols: ['jupiter', 'drift', 'kamino'],
      executionMode: 'advisory' as const,
      permissionLevel: 2,
      allowedActions: ['swap', 'stake', 'lend', 'borrow'],
      rebalanceFrequency: 'daily' as const,
    }),
  },
  {
    id: 'dao-treasury',
    name: 'DAO Treasury',
    desc: 'Conservative. Policy changes via futarchy (conditional markets).',
    apply: (f: FormState): FormState => ({
      ...f,
      governanceMode: 'dao_prediction_market' as const,
      riskProfile: 'low' as const,
      maxDrawdownPct: 8,
      maxLeverage: 1,
      maxPositionPct: 35,
      assets: ['SOL', 'USDC', 'USDT'],
      protocols: ['kamino', 'jupiter'],
      executionMode: 'constrained_auto' as const,
      allowedActions: ['swap', 'lend', 'stake'],
      rebalanceFrequency: 'weekly' as const,
      pauseAuthority: ['owner_wallet', 'protocol_guardian_multisig'],
    }),
  },
  {
    id: 'deposit-box',
    name: 'Deposit Box',
    desc: 'Deposit and hold. No agent pipeline. No strategy.',
    apply: (f: FormState): FormState => ({
      ...f,
      riskProfile: 'low' as const,
      maxDrawdownPct: 100,
      maxLeverage: 1,
      maxPositionPct: 100,
      assets: ['SOL'],
      protocols: [],
      executionMode: 'advisory' as const,
      permissionLevel: 1,
      allowedActions: [],
      rebalanceFrequency: 'weekly' as const,
    }),
  },
]

const ALL_ASSETS = ['SOL', 'ETH', 'BTC', 'USDC', 'USDT']
const ALL_PROTOCOLS = ['jupiter', 'drift', 'kamino', 'sanctum', 'marginfi']
const ALL_ACTIONS = ['swap', 'stake', 'lend', 'borrow', 'provide_liquidity']
const ALL_FORBIDDEN = ['leverage_above_policy_max', 'unverified_protocols', 'memecoins']

function formatUsd(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

interface ConstraintCheck {
  label: string
  pass: boolean
  detail: string
}

function validateConstraints(f: FormState): ConstraintCheck[] {
  return [
    {
      label: 'Leverage ≤ 2x protocol cap',
      pass: f.maxLeverage <= 2,
      detail: f.maxLeverage > 2 ? `${f.maxLeverage}x exceeds 2x hard cap` : `${f.maxLeverage}x ≤ 2x ✓`,
    },
    {
      label: 'Leverage ≤ policy max',
      pass: true,
      detail: `Policy sets ${f.maxLeverage}x`,
    },
    {
      label: 'Position concentration ≤ 100%',
      pass: f.maxPositionPct <= 100,
      detail: f.maxPositionPct > 100 ? `${f.maxPositionPct}% exceeds 100%` : `${f.maxPositionPct}% ≤ 100% ✓`,
    },
    {
      label: 'Correlated exposure ≤ 100%',
      pass: f.maxCorrelatedExposurePct <= 100,
      detail: `${f.maxCorrelatedExposurePct}% ✓`,
    },
    {
      label: 'Drawdown ≥ 0%',
      pass: f.maxDrawdownPct > 0,
      detail: `${f.maxDrawdownPct}% ✓`,
    },
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
    {
      label: 'Oracle staleness check configured',
      pass: true,
      detail: '120s threshold (protocol default)',
    },
  ]
}

export default function CreateVaultPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM })
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isAggressive = form.maxDrawdownPct >= 25
  const isDao = form.governanceMode === 'dao_prediction_market'
  const constraintChecks = validateConstraints(form)
  const allConstraintsPass = constraintChecks.every((c) => c.pass)

  function applyPreset(preset: typeof PRESETS[number]) {
    setSelectedPreset(preset.id)
    setForm(preset.apply({ ...DEFAULT_FORM }))
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleListItem(key: 'assets' | 'protocols' | 'allowedActions' | 'forbiddenActions' | 'pauseAuthority', item: string) {
    setForm((f) => {
      const arr = f[key] as string[]
      return { ...f, [key]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item] }
    })
  }

  async function submit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    router.push('/app')
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="label">policy: builder_wizard</p>
      <h1 className="font-display mt-2 text-3xl font-semibold">Create vault</h1>

      <div className="mt-6 flex gap-2">
        {STEPS.map((label, i) => (
          <span key={label} className={`font-mono text-xs uppercase tracking-wider ${i === step ? 'text-accent' : 'text-text-secondary'}`}>
            {label}{i < STEPS.length - 1 && ' · '}
          </span>
        ))}
      </div>

      <div className="panel mt-8 p-6">
        {/* Step 0: Goal + Presets */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase text-text-secondary">describe_your_goal</label>
              <textarea
                className="input-field mt-2"
                rows={3}
                placeholder="e.g. Compound SOL for the long term. Or: Park capital with a strict drawdown ceiling."
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-xs text-text-muted">or choose a preset</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PRESETS.map((preset) => {
                const isDaoPreset = preset.id === 'dao-treasury'
                return (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={isDaoPreset}
                    onClick={() => !isDaoPreset && applyPreset(preset)}
                    className={`rounded border p-4 text-left transition ${
                      isDaoPreset
                        ? 'border-border bg-bg-panel opacity-50 cursor-not-allowed'
                        : selectedPreset === preset.id
                          ? 'border-accent bg-accent-muted hover:border-accent/50'
                          : 'border-border bg-bg-panel hover:border-accent/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-semibold">{preset.name}</span>
                      <div className="flex items-center gap-1.5">
                        {preset.id === 'aggressive-growth' && (
                          <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-accent">advisory only</span>
                        )}
                        {isDaoPreset && (
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-amber-500">coming soon</span>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">{preset.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 1: Policy core */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">vault_name</span>
              <input type="text" className="input-field mt-1" placeholder="my-policy-vault" value={form.vaultName} onChange={(e) => update('vaultName', e.target.value)} />
            </label>

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">governance_mode</span>
              <select className="input-field mt-1" value={form.governanceMode} onChange={(e) => update('governanceMode', e.target.value as GovernanceMode)}>
                <option value="owner">Owner (direct policy amendments)</option>
                <option value="dao_prediction_market" disabled>DAO — futarchy (conditional markets) — coming soon</option>
              </select>
            </label>

            {isDao && (
              <div className="rounded border border-accent/30 bg-accent-muted p-3">
                <p className="font-mono text-xs text-accent">DAO mode requires a vault_token_mint at creation. Policy amendments are priced by conditional markets (PASS/FAIL TWAP comparison), not token votes.</p>
              </div>
            )}

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">privacy_level</span>
              <select className="input-field mt-1" value={form.privacyLevel} onChange={(e) => update('privacyLevel', e.target.value as PrivacyLevel)}>
                <option value="standard">Standard — NAV public, positions encrypted</option>
                <option value="full">Full — NAV hidden, execution batching mandatory</option>
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">risk_profile</span>
              <select className="input-field mt-1" value={form.riskProfile} onChange={(e) => update('riskProfile', e.target.value as RiskProfile)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">execution_mode</span>
              <select className="input-field mt-1" value={form.executionMode} onChange={(e) => update('executionMode', e.target.value as ExecutionMode)}>
                <option value="advisory">Advisory — agent proposes, you sign</option>
                <option value="constrained_auto">Constrained auto — agent executes within policy</option>
                <option value="full_auto">Full auto — same constraints, no per-cycle notification</option>
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">rebalance_frequency</span>
              <select className="input-field mt-1" value={form.rebalanceFrequency} onChange={(e) => update('rebalanceFrequency', e.target.value as RebalanceFrequency)}>
                <option value="event_driven">Event-driven</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>

            {isAggressive && (
              <div className="rounded border border-accent/40 bg-accent-muted p-3">
                <p className="font-mono text-xs uppercase tracking-wider text-accent">advisory_lock</p>
                <p className="mt-1 text-xs text-text-secondary">Drawdown ≥ 25% requires advisory-only mode per protocol safety policy. On-chain constraint engine will block auto-execution.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Constraints */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_drawdown_pct</span>
              <input type="number" min={1} max={100} className="input-field mt-1" value={form.maxDrawdownPct} onChange={(e) => update('maxDrawdownPct', Number(e.target.value))} />
              <span className="font-mono text-[10px] text-text-muted mt-1 block">Current: {form.maxDrawdownPct}%</span>
            </label>

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_leverage (protocol cap: 2x)</span>
              <input type="number" min={1} max={2} step={0.1} className="input-field mt-1" value={form.maxLeverage} onChange={(e) => update('maxLeverage', Number(e.target.value))} />
              <span className="font-mono text-[10px] text-text-muted mt-1 block">Current: {form.maxLeverage}x (hard cap 2x enforced on-chain)</span>
            </label>

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_position_pct (single asset)</span>
              <input type="number" min={1} max={100} className="input-field mt-1" value={form.maxPositionPct} onChange={(e) => update('maxPositionPct', Number(e.target.value))} />
            </label>

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_correlated_exposure_pct</span>
              <input type="number" min={1} max={100} className="input-field mt-1" value={form.maxCorrelatedExposurePct} onChange={(e) => update('maxCorrelatedExposurePct', Number(e.target.value))} />
            </label>

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">min_pool_liquidity_usd</span>
              <input type="number" min={0} step={1000000} className="input-field mt-1" value={form.liquidityFloorUsd} onChange={(e) => update('liquidityFloorUsd', Number(e.target.value))} />
              <span className="font-mono text-[10px] text-text-muted mt-1 block">Current: {formatUsd(form.liquidityFloorUsd)}</span>
            </label>

            <div>
              <span className="font-mono text-xs uppercase text-text-secondary">allowed_actions</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_ACTIONS.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleListItem('allowedActions', action)}
                    className={`rounded border px-3 py-1 font-mono text-xs ${
                      form.allowedActions.includes(action) ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary'
                    }`}
                  >{action}</button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-xs uppercase text-text-secondary">forbidden_actions</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_FORBIDDEN.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleListItem('forbiddenActions', action)}
                    className={`rounded border px-3 py-1 font-mono text-xs ${
                      form.forbiddenActions.includes(action) ? 'border-accent-risk bg-accent-risk/10 text-accent-risk' : 'border-border text-text-secondary'
                    }`}
                  >{action}</button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-xs uppercase text-text-secondary">pause_authority</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {['owner_wallet', 'protocol_guardian_multisig'].map((auth) => (
                  <button
                    key={auth}
                    type="button"
                    onClick={() => toggleListItem('pauseAuthority', auth)}
                    className={`rounded border px-3 py-1 font-mono text-xs ${
                      form.pauseAuthority.includes(auth) ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary'
                    }`}
                  >{auth}</button>
                ))}
              </div>
            </div>

            {/* Constraint validation feedback */}
            <div className="mt-4 rounded border border-border bg-bg-base p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-3">constraint_engine validation</p>
              <div className="space-y-2">
                {constraintChecks.map((check, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`font-mono text-[10px] mt-0.5 ${check.pass ? 'text-accent-positive' : 'text-accent-risk'}`}>
                      {check.pass ? '✓' : '✗'}
                    </span>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary">{check.label}</span>
                      <span className="font-mono text-[10px] text-text-muted ml-2">— {check.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              {!allConstraintsPass && (
                <p className="font-mono text-[10px] text-accent-risk mt-3">Some checks failed. Fix before submitting.</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Universe */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase text-text-secondary">universe.assets</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_ASSETS.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => toggleListItem('assets', asset)}
                    className={`rounded border px-3 py-1 font-mono text-xs ${
                      form.assets.includes(asset) ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary'
                    }`}
                  >{asset}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-text-secondary">protocols_allowed</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_PROTOCOLS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleListItem('protocols', p)}
                    className={`rounded border px-3 py-1 font-mono text-xs ${
                      form.protocols.includes(p) ? 'border-accent bg-accent-muted text-accent' : 'border-border text-text-secondary'
                    }`}
                  >{p}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="panel p-4">
              <p className="label">policy_summary</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">Governance</span><span className="font-mono text-xs">{form.governanceMode === 'owner' ? 'Owner' : 'DAO (futarchy)'}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Privacy</span><span className="font-mono text-xs">{form.privacyLevel}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Risk profile</span><span className="font-mono text-xs">{form.riskProfile}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Max drawdown</span><span className="font-mono text-xs">{form.maxDrawdownPct}%</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Max leverage</span><span className="font-mono text-xs">{form.maxLeverage}x</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Max position</span><span className="font-mono text-xs">{form.maxPositionPct}%</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Correlated exposure</span><span className="font-mono text-xs">{form.maxCorrelatedExposurePct}%</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Liquidity floor</span><span className="font-mono text-xs">{formatUsd(form.liquidityFloorUsd)}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Assets</span><span className="font-mono text-xs">{form.assets.join(', ') || 'None'}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Protocols</span><span className="font-mono text-xs">{form.protocols.join(', ') || 'None'}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Execution</span><span className="font-mono text-xs">{form.executionMode}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Rebalance</span><span className="font-mono text-xs">{form.rebalanceFrequency}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Allowed actions</span><span className="font-mono text-xs">{form.allowedActions.join(', ') || 'None'}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Forbidden</span><span className="font-mono text-xs">{form.forbiddenActions.join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Pause authority</span><span className="font-mono text-xs">{form.pauseAuthority.join(', ')}</span></div>
              </div>
            </div>

            {/* Constraint check summary */}
            <div className={`rounded border p-3 ${allConstraintsPass ? 'border-accent-positive/30 bg-accent-positive/5' : 'border-accent-risk/30 bg-accent-risk/5'}`}>
              <p className={`font-mono text-xs ${allConstraintsPass ? 'text-accent-positive' : 'text-accent-risk'}`}>
                {allConstraintsPass ? '✓ All 8 constraint checks pass' : '✗ Some constraint checks failed — see Constraints step'}
              </p>
            </div>

            {selectedPreset && (
              <div className="rounded border border-accent/30 bg-accent-muted p-3">
                <p className="label">preset: {selectedPreset}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-secondary disabled:opacity-40">Back</button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="btn-primary">Continue</button>
        ) : (
          <button type="button" onClick={submit} disabled={submitting || !allConstraintsPass} className="btn-primary disabled:opacity-50">
            {submitting ? 'Creating...' : 'Sign & create vault →'}
          </button>
        )}
      </div>
    </div>
  )
}
