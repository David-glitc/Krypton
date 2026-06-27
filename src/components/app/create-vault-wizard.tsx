'use client'

import {
  type ExecutionMode,
  type PrivacyLevel,
  type RebalanceFrequency,
  type RiskProfile,
} from '@/lib/mock-data'
import type { ConstraintCheck, FormState } from '@/lib/create-vault'

const ALL_ASSETS = ['SOL', 'ETH', 'BTC', 'USDC', 'USDT']
const ALL_PROTOCOLS = ['jupiter', 'drift', 'kamino', 'sanctum', 'marginfi']
const ALL_ACTIONS = ['swap', 'stake', 'lend', 'borrow', 'provide_liquidity']
const ALL_FORBIDDEN = ['leverage_above_policy_max', 'unverified_protocols', 'memecoins']
export const WIZARD_STEPS = ['Policy', 'Constraints', 'Universe', 'Review'] as const

function formatUsd(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

export function CreateVaultWizard({
  step,
  form,
  isAggressive,
  constraintChecks,
  allConstraintsPass,
  aiReasoning,
  onUpdate,
  onToggle,
}: {
  step: number
  form: FormState
  isAggressive: boolean
  constraintChecks: ConstraintCheck[]
  allConstraintsPass: boolean
  aiReasoning?: string
  onUpdate: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onToggle: (
    key: 'assets' | 'protocols' | 'allowedActions' | 'forbiddenActions' | 'pauseAuthority',
    item: string,
  ) => void
}) {
  return (
    <section className="space-y-4 sm:space-y-6">
      <div>
        <p className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-text-muted">
          Step 3 — policy_wizard
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-hanken)] text-2xl font-medium text-text-primary">
          Configure deployment policy
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {WIZARD_STEPS.map((label, i) => (
          <span
            key={label}
            className={`font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider ${
              i === step ? 'text-accent' : 'text-text-secondary'
            }`}
          >
            {label}
            {i < WIZARD_STEPS.length - 1 && ' · '}
          </span>
        ))}
      </div>

      <div className="panel p-6">
        {step === 0 && (
          <div className="space-y-6">
            {aiReasoning && (
              <div className="rounded border border-accent/20 bg-accent-muted p-4">
                <p className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase text-text-muted">
                  ai_reasoning
                </p>
                <p className="mt-2 text-sm text-text-secondary">{aiReasoning}</p>
              </div>
            )}

            <label className="block">
              <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                vault_name
              </span>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="my-policy-vault"
                value={form.vaultName}
                onChange={(e) => onUpdate('vaultName', e.target.value)}
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                  risk_profile
                </span>
                <select
                  className="input-field mt-1"
                  value={form.riskProfile}
                  onChange={(e) => onUpdate('riskProfile', e.target.value as RiskProfile)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="block">
                <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                  execution_mode
                </span>
                <select
                  className="input-field mt-1"
                  value={form.executionMode}
                  onChange={(e) => onUpdate('executionMode', e.target.value as ExecutionMode)}
                >
                  <option value="advisory">Advisory — I approve every action</option>
                  <option value="constrained_auto">Constrained auto</option>
                  <option value="full_auto">Full auto</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                  privacy_level
                </span>
                <select
                  className="input-field mt-1"
                  value={form.privacyLevel}
                  onChange={(e) => onUpdate('privacyLevel', e.target.value as PrivacyLevel)}
                >
                  <option value="standard">Standard — NAV public</option>
                  <option value="full">Full — NAV hidden</option>
                </select>
              </label>
              <label className="block">
                <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                  rebalance_frequency
                </span>
                <select
                  className="input-field mt-1"
                  value={form.rebalanceFrequency}
                  onChange={(e) => onUpdate('rebalanceFrequency', e.target.value as RebalanceFrequency)}
                >
                  <option value="event_driven">Event-driven</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </label>
            </div>

            {isAggressive && (
              <div className="rounded border border-accent-warn/40 bg-accent-warn-muted p-3">
                <p className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-accent-warn">
                  advisory_lock
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Drawdown ≥ 25% requires advisory-only mode per protocol safety.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                max_drawdown_pct
              </span>
              <input
                type="number"
                min={1}
                max={50}
                className="input-field mt-1"
                value={form.maxDrawdownPct}
                onChange={(e) => onUpdate('maxDrawdownPct', Number(e.target.value))}
              />
            </label>
            <label className="block">
              <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                max_leverage (protocol cap: 2x)
              </span>
              <input
                type="number"
                min={1}
                max={2}
                step={0.1}
                className="input-field mt-1"
                value={form.maxLeverage}
                onChange={(e) => onUpdate('maxLeverage', Number(e.target.value))}
              />
            </label>
            <label className="block">
              <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                max_position_pct
              </span>
              <input
                type="number"
                min={1}
                max={100}
                className="input-field mt-1"
                value={form.maxPositionPct}
                onChange={(e) => onUpdate('maxPositionPct', Number(e.target.value))}
              />
            </label>
            <label className="block">
              <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                min_pool_liquidity_usd
              </span>
              <input
                type="number"
                min={0}
                step={1000000}
                className="input-field mt-1"
                value={form.liquidityFloorUsd}
                onChange={(e) => onUpdate('liquidityFloorUsd', Number(e.target.value))}
              />
              <span className="mt-1 block font-[family-name:var(--font-jetbrains)] text-[10px] text-text-muted">
                Current: {formatUsd(form.liquidityFloorUsd)}
              </span>
            </label>

            <div>
              <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                allowed_actions
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_ACTIONS.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => onToggle('allowedActions', action)}
                    className={`border px-3 py-1 font-[family-name:var(--font-jetbrains)] text-xs ${
                      form.allowedActions.includes(action)
                        ? 'border-accent bg-accent-muted text-accent'
                        : 'border-border text-text-secondary'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                forbidden_actions
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_FORBIDDEN.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => onToggle('forbiddenActions', action)}
                    className={`border px-3 py-1 font-[family-name:var(--font-jetbrains)] text-xs ${
                      form.forbiddenActions.includes(action)
                        ? 'border-accent-risk bg-accent-risk-muted text-accent-risk'
                        : 'border-border text-text-secondary'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded border border-border bg-bg-base p-4">
              <p className="mb-3 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-text-muted">
                constraint_engine validation
              </p>
              <div className="space-y-2">
                {constraintChecks.map((check, i) => (
                  <div key={i} className="flex items-start gap-2 text-[10px] font-[family-name:var(--font-jetbrains)]">
                    <span className={check.pass ? 'text-accent-positive' : 'text-accent-risk'}>
                      {check.pass ? '✓' : '✗'}
                    </span>
                    <span className="text-text-secondary">
                      {check.label} — {check.detail}
                    </span>
                  </div>
                ))}
              </div>
              {!allConstraintsPass && (
                <p className="mt-3 text-[10px] text-accent-risk">Some checks failed. Fix before submitting.</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                universe.assets
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_ASSETS.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => onToggle('assets', asset)}
                    className={`border px-3 py-1 font-[family-name:var(--font-jetbrains)] text-xs ${
                      form.assets.includes(asset)
                        ? 'border-accent bg-accent-muted text-accent'
                        : 'border-border text-text-secondary'
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-text-secondary">
                protocols_allowed
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_PROTOCOLS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onToggle('protocols', p)}
                    className={`border px-3 py-1 font-[family-name:var(--font-jetbrains)] text-xs ${
                      form.protocols.includes(p)
                        ? 'border-accent bg-accent-muted text-accent'
                        : 'border-border text-text-secondary'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="panel p-4">
              <p className="label">policy_summary</p>
              <div className="mt-3 space-y-2">
                {[
                  ['Vault name', form.vaultName || '—'],
                  ['Risk profile', form.riskProfile],
                  ['Max drawdown', `${form.maxDrawdownPct}%`],
                  ['Max leverage', `${form.maxLeverage}x`],
                  ['Liquidity floor', formatUsd(form.liquidityFloorUsd)],
                  ['Assets', form.assets.join(', ') || 'None'],
                  ['Protocols', form.protocols.join(', ') || 'None'],
                  ['Execution', form.executionMode],
                  ['Rebalance', form.rebalanceFrequency],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-xs text-text-secondary">{label}</span>
                    <span className="font-[family-name:var(--font-jetbrains)] text-xs text-text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`rounded border p-3 ${
                allConstraintsPass
                  ? 'border-accent-positive/30 bg-accent-positive-muted'
                  : 'border-accent-risk/30 bg-accent-risk-muted'
              }`}
            >
              <p
                className={`font-[family-name:var(--font-jetbrains)] text-xs ${
                  allConstraintsPass ? 'text-accent-positive' : 'text-accent-risk'
                }`}
              >
                {allConstraintsPass ? '✓ All 8 constraint checks pass' : '✗ Some constraint checks failed'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
