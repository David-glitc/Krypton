'use client'

import { useState, useMemo } from 'react'
import {
  PRESET_FUND_MANAGERS,
  assessFeasibility,
  AGGRESSIVE_THRESHOLD_BPS,
  formToCapitalPolicy,
  DEFAULT_ASSETS,
  DEFAULT_PROTOCOLS,
  RISK_PROFILES,
  EXECUTION_MODES,
  REBALANCE_FREQUENCIES,
} from '@krypton/policy-schema'

interface FormData {
  vaultName: string
  riskProfile: string
  maxDrawdownPct: number
  maxLeverage: number
  maxPositionPct: number
  executionMode: string
  rebalanceFrequency: string
  assets: string[]
  protocols: string[]
}

const emptyForm: FormData = {
  vaultName: '',
  riskProfile: 'medium',
  maxDrawdownPct: 12,
  maxLeverage: 1,
  maxPositionPct: 35,
  executionMode: 'advisory',
  rebalanceFrequency: 'daily',
  assets: ['SOL', 'USDC', 'USDT'],
  protocols: ['jupiter', 'kamino'],
}

const inputCls =
  'w-full rounded border border-border bg-bg-base px-3 py-2 font-mono text-sm text-text-primary'
const labelCls = 'font-mono text-xs uppercase text-text-secondary'
const selectCls = inputCls

export default function CreateVaultPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({ ...emptyForm })
  const [submitting, setSubmitting] = useState(false)
  const [nlPrompt, setNlPrompt] = useState('')

  const maxDrawdownBps = form.maxDrawdownPct * 100
  const isAggressive = maxDrawdownBps >= AGGRESSIVE_THRESHOLD_BPS

  const feasibility = useMemo(() => {
    if (step < 1) return null
    return assessFeasibility('multiple', 2.0, form.maxDrawdownPct, 90)
  }, [form.maxDrawdownPct, step])

  const capitalPolicy = useMemo(() => {
    if (step < 3) return null
    return formToCapitalPolicy({
      vaultName: form.vaultName || 'My Vault',
      governanceMode: 'owner' as const,
      riskProfile: form.riskProfile as 'low' | 'medium' | 'high' | 'custom',
      maxDrawdownPct: form.maxDrawdownPct,
      maxLeverage: form.maxLeverage,
      maxPositionPct: form.maxPositionPct,
      assets: form.assets,
      protocols: form.protocols,
      executionMode: form.executionMode as 'advisory' | 'constrained_auto' | 'full_auto',
      rebalanceFrequency: form.rebalanceFrequency as 'event_driven' | 'hourly' | 'daily' | 'weekly',
      permissionLevel: 2,
    })
  }, [form, step])

  const applyPreset = (presetId: string) => {
    const preset = PRESET_FUND_MANAGERS.find((p: (typeof PRESET_FUND_MANAGERS)[number]) => p.id === presetId)
    if (!preset) return
    setForm((prev) => ({
      ...prev,
      riskProfile: preset.riskProfile,
      maxDrawdownPct: preset.maxDrawdownPct,
      maxLeverage: preset.maxLeverage,
      maxPositionPct: preset.maxPositionPct,
      executionMode: preset.executionMode,
      assets: preset.assets.length > 0 ? [...preset.assets] : prev.assets,
      protocols: preset.protocols.length > 0 ? [...preset.protocols] : prev.protocols,
    }))
    setStep(1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise<void>((r) => setTimeout(r, 1500))
    setSubmitting(false)
  }

  const toggleAsset = (sym: string) => {
    setForm((prev) => ({
      ...prev,
      assets: prev.assets.includes(sym)
        ? prev.assets.filter((a: string) => a !== sym)
        : [...prev.assets, sym],
    }))
  }

  const toggleProtocol = (proto: string) => {
    setForm((prev) => ({
      ...prev,
      protocols: prev.protocols.includes(proto)
        ? prev.protocols.filter((p: string) => p !== proto)
        : [...prev.protocols, proto],
    }))
  }

  const stepLabels = ['Start', 'Risk', 'Universe', 'Review']

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                i === step
                  ? 'border-accent bg-accent-muted text-accent'
                  : i < step
                    ? 'border-accent/40 bg-bg-panel text-accent hover:border-accent'
                    : 'border-border bg-bg-panel text-text-muted hover:border-text-secondary'
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  i <= step ? 'bg-accent text-white' : 'bg-bg-panel-raised text-text-muted'
                }`}
              >
                {i + 1}
              </span>
              {label}
            </button>
            {i < stepLabels.length - 1 && (
              <div
                className={`h-px w-6 ${i < step ? 'bg-accent' : 'bg-border'}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 0: NL Prompt + Presets ─────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Create a new vault
            </h2>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              Describe your strategy in natural language, or pick a preset to start.
            </p>
          </div>

          <div>
            <label className={labelCls}>Strategy prompt</label>
            <textarea
              value={nlPrompt}
              onChange={(e) => setNlPrompt(e.target.value)}
              placeholder="e.g. I want to earn yield on SOL while limiting drawdown to 10%..."
              rows={3}
              className={`${inputCls} mt-1.5 resize-none`}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              or choose a preset
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRESET_FUND_MANAGERS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className="group rounded border border-border bg-bg-panel p-4 text-left transition-colors hover:border-accent"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-sm font-semibold text-text-primary group-hover:text-accent">
                    {preset.name}
                  </span>
                  {preset.hardLockAdvisory && (
                    <span className="ml-2 inline-flex items-center rounded bg-accent-muted px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase text-accent">
                      advisory
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                  {preset.description}
                </p>
                <div className="mt-3 flex gap-4 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  <span>
                    DD:{' '}
                    <span className="text-text-secondary">
                      {preset.maxDrawdownPct}%
                    </span>
                  </span>
                  <span>
                    Lev:{' '}
                    <span className="text-text-secondary">
                      {preset.maxLeverage}x
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 1: Risk Form ───────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Risk parameters
            </h2>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              Define risk limits and execution mode.
            </p>
          </div>

          <div>
            <label className={labelCls}>Vault name</label>
            <input
              type="text"
              value={form.vaultName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, vaultName: e.target.value }))
              }
              placeholder="My Vault"
              className={`${inputCls} mt-1.5`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Risk profile</label>
              <select
                value={form.riskProfile}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    riskProfile: e.target.value,
                  }))
                }
                className={`${selectCls} mt-1.5`}
              >
                {RISK_PROFILES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Execution mode</label>
              <select
                value={form.executionMode}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    executionMode: e.target.value,
                  }))
                }
                className={`${selectCls} mt-1.5`}
                disabled={isAggressive}
              >
                {EXECUTION_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {isAggressive && (
                <p className="mt-1 font-mono text-[10px] text-accent-risk">
                  Advisory-only lock: max drawdown &ge; 25%
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Max drawdown (%)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={form.maxDrawdownPct}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    maxDrawdownPct: Number(e.target.value),
                  }))
                }
                className={`${inputCls} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelCls}>Max leverage (x)</label>
              <input
                type="number"
                min={1}
                max={2}
                step={0.1}
                value={form.maxLeverage}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    maxLeverage: Number(e.target.value),
                  }))
                }
                className={`${inputCls} mt-1.5`}
              />
            </div>
            <div>
              <label className={labelCls}>Max position (%)</label>
              <input
                type="number"
                min={5}
                max={100}
                value={form.maxPositionPct}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    maxPositionPct: Number(e.target.value),
                  }))
                }
                className={`${inputCls} mt-1.5`}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Rebalance frequency</label>
            <select
              value={form.rebalanceFrequency}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  rebalanceFrequency: e.target.value,
                }))
              }
              className={`${selectCls} mt-1.5 sm:w-48`}
            >
              {REBALANCE_FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {feasibility && (
            <div
              className={`rounded border p-4 ${
                feasibility.status === 'infeasible'
                  ? 'border-accent-risk/40 bg-accent-risk/5'
                  : feasibility.status === 'feasible_with_conditions'
                    ? 'border-accent/40 bg-accent-muted'
                    : 'border-accent-positive/30 bg-accent-positive/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${
                    feasibility.status === 'infeasible'
                      ? 'bg-accent-risk'
                      : feasibility.status === 'feasible_with_conditions'
                        ? 'bg-accent'
                        : 'bg-accent-positive'
                  }`}
                />
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                  Feasibility &mdash; {feasibility.status}
                </span>
              </div>
              {feasibility.negotiation_prompt && (
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feasibility.negotiation_prompt}
                </p>
              )}
              {feasibility.status === 'feasible' && (
                <p className="mt-2 text-xs text-text-muted">
                  Reference band:{' '}
                  {feasibility.reference_band.min_historical_drawdown_pct}&ndash;
                  {feasibility.reference_band.max_historical_drawdown_pct}%
                  historical drawdown.
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex items-center border border-border bg-bg-panel px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:border-text-secondary transition-colors"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center bg-accent px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white hover:bg-accent-hover transition-colors"
            >
              Next: Universe &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Universe ────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Universe
            </h2>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              Select which assets and protocols the vault can interact with.
            </p>
          </div>

          <div>
            <label className={labelCls}>Assets</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEFAULT_ASSETS.map((sym) => {
                const selected = form.assets.includes(sym)
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleAsset(sym)}
                    className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors ${
                      selected
                        ? 'border-accent bg-accent-muted text-accent'
                        : 'border-border bg-bg-panel text-text-secondary hover:border-text-secondary'
                    }`}
                  >
                    <span
                      className={`flex h-3 w-3 items-center justify-center rounded-sm border text-[8px] ${
                        selected
                          ? 'border-accent bg-accent text-white'
                          : 'border-text-muted bg-bg-panel-raised'
                      }`}
                    >
                      {selected && '\u2713'}
                    </span>
                    {sym}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>Protocols</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEFAULT_PROTOCOLS.map((proto) => {
                const selected = form.protocols.includes(proto)
                return (
                  <button
                    key={proto}
                    type="button"
                    onClick={() => toggleProtocol(proto)}
                    className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors ${
                      selected
                        ? 'border-accent bg-accent-muted text-accent'
                        : 'border-border bg-bg-panel text-text-secondary hover:border-text-secondary'
                    }`}
                  >
                    <span
                      className={`flex h-3 w-3 items-center justify-center rounded-sm border text-[8px] ${
                        selected
                          ? 'border-accent bg-accent text-white'
                          : 'border-text-muted bg-bg-panel-raised'
                      }`}
                    >
                      {selected && '\u2713'}
                    </span>
                    {proto}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center border border-border bg-bg-panel px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:border-text-secondary transition-colors"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center bg-accent px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white hover:bg-accent-hover transition-colors"
            >
              Next: Review &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review ──────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-text-primary">
              Review &amp; submit
            </h2>
            <p className="mt-1 font-mono text-xs text-text-secondary">
              Verify your vault policy before deploying on-chain.
            </p>
          </div>

          <div className="rounded border border-border bg-bg-panel p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-text-primary">
                {form.vaultName || 'My Vault'}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                v1
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <span className={labelCls}>Risk profile</span>
                <p className="mt-0.5 font-mono text-sm text-text-primary">
                  {form.riskProfile}
                </p>
              </div>
              <div>
                <span className={labelCls}>Execution</span>
                <p className="mt-0.5 font-mono text-sm text-text-primary">
                  {form.executionMode}
                </p>
              </div>
              <div>
                <span className={labelCls}>Rebalance</span>
                <p className="mt-0.5 font-mono text-sm text-text-primary">
                  {form.rebalanceFrequency}
                </p>
              </div>
              <div>
                <span className={labelCls}>Max drawdown</span>
                <p
                  className={`mt-0.5 font-mono text-sm ${
                    isAggressive ? 'text-accent-risk' : 'text-text-primary'
                  }`}
                >
                  {form.maxDrawdownPct}%
                </p>
              </div>
              <div>
                <span className={labelCls}>Max leverage</span>
                <p className="mt-0.5 font-mono text-sm text-text-primary">
                  {form.maxLeverage}x
                </p>
              </div>
              <div>
                <span className={labelCls}>Max position</span>
                <p className="mt-0.5 font-mono text-sm text-text-primary">
                  {form.maxPositionPct}%
                </p>
              </div>
            </div>

            <div>
              <span className={labelCls}>Assets</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {form.assets.map((a) => (
                  <span
                    key={a}
                    className="inline-flex border border-border bg-bg-panel-raised px-2 py-0.5 font-mono text-[11px] text-text-secondary"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className={labelCls}>Protocols</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {form.protocols.map((p) => (
                  <span
                    key={p}
                    className="inline-flex border border-border bg-bg-panel-raised px-2 py-0.5 font-mono text-[11px] text-text-secondary"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {isAggressive && (
              <div className="rounded border border-accent-risk/30 bg-accent-risk/5 px-3 py-2 font-mono text-xs text-accent-risk">
                &#9888; Advisory-only lock active: max drawdown &ge;25% requires
                advisory execution mode.
              </div>
            )}
          </div>

          {capitalPolicy && (
            <div>
              <label className={labelCls}>Policy JSON</label>
              <pre className="mt-1.5 max-h-64 overflow-auto rounded border border-border bg-bg-panel p-4 font-mono text-[11px] leading-relaxed text-text-secondary">
                {JSON.stringify(capitalPolicy, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center border border-border bg-bg-panel px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:border-text-secondary transition-colors"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={
                submitting
                  ? 'inline-flex items-center cursor-not-allowed border border-border bg-bg-panel px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-text-muted'
                  : 'inline-flex items-center bg-accent px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-white hover:bg-accent-hover transition-colors'
              }
            >
              {submitting ? 'Creating\u2026' : 'Sign & create vault \u2192'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
