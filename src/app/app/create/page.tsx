'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = ['Start', 'Risk', 'Universe', 'Review'] as const

const PRESETS = [
  { id: 'stable-saver', name: 'Stable Saver', desc: 'Preservation-focused. Lend USDC/USDT. No swaps, no leverage.', maxDd: 2, maxLev: 1, assets: ['USDC', 'USDT'], protocols: ['kamino'] },
  { id: 'steady-compounder', name: 'Steady Compounder', desc: 'LST yield + lending blend for sustainable ~6-10% APY.', maxDd: 8, maxLev: 1, assets: ['SOL', 'USDC'], protocols: ['sanctum', 'kamino'] },
  { id: 'growth-allocator', name: 'Growth Allocator', desc: 'Multi-asset growth with advisory → auto progression.', maxDd: 15, maxLev: 1.5, assets: ['SOL', 'ETH', 'BTC', 'USDC'], protocols: ['jupiter', 'kamino'] },
  { id: 'aggressive-compounder', name: 'Aggressive Compounder', desc: 'High-variance leveraged strategies. HARD-LOCKED to advisory.', maxDd: 30, maxLev: 2, assets: ['SOL', 'ETH', 'BTC'], protocols: ['jupiter', 'drift'] },
  { id: 'collateral-vault', name: 'Collateral Vault', desc: 'Hold a single asset as collateral. No strategy pipeline.', maxDd: 5, maxLev: 1, assets: ['SOL', 'USDC'], protocols: [] },
  { id: 'onchain-deposit-box', name: 'On-Chain Deposit Box', desc: 'Deposit and hold. No agent pipeline runs at all.', maxDd: 100, maxLev: 1, assets: [], protocols: [] },
]

const DEFAULT_FORM = {
  vaultName: '',
  riskProfile: 'medium',
  maxDrawdownPct: 12,
  maxLeverage: 1.5,
  maxPositionPct: 35,
  assets: ['SOL', 'USDC'],
  protocols: ['jupiter', 'kamino'],
  executionMode: 'advisory',
  rebalanceFrequency: 'daily',
}

export default function CreateVaultPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isAggressive = form.maxDrawdownPct * 100 >= 2500

  function applyPreset(preset: typeof PRESETS[number]) {
    setSelectedPreset(preset.id)
    setForm((f) => ({
      ...f,
      vaultName: f.vaultName || preset.id.replace(/-/g, '_'),
      riskProfile: preset.maxDd <= 5 ? 'low' : preset.maxDd <= 15 ? 'medium' : 'high',
      maxDrawdownPct: preset.maxDd,
      maxLeverage: preset.maxLev,
      assets: [...preset.assets],
      protocols: [...preset.protocols],
      executionMode: preset.id === 'aggressive-compounder' ? 'advisory' : f.executionMode,
    }))
    setStep(1)
  }

  function update(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleListItem(key: 'assets' | 'protocols', item: string) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(item) ? f[key].filter((x: string) => x !== item) : [...f[key], item],
    }))
  }

  async function submit() {
    setSubmitting(true)
    await new Promise<void>((resolve) => setTimeout(resolve, 1500))
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
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase text-text-secondary">describe_your_goal</label>
              <textarea
                className="input-field mt-2"
                rows={3}
                placeholder="e.g. I want 5x in 10 weeks, stop if I'm down 5%. Or: Compound my SOL for the long term."
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-xs text-text-muted">or choose a preset</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`rounded border p-4 text-left transition hover:border-accent/50 ${
                    selectedPreset === preset.id ? 'border-accent bg-accent-muted' : 'border-border bg-bg-panel'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-semibold">{preset.name}</span>
                    {preset.id === 'aggressive-compounder' && (
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-accent">advisory only</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{preset.desc}</p>
                  <div className="mt-2 flex gap-1">
                    <span className="rounded bg-bg-panel-raised px-1.5 py-0.5 font-mono text-[9px] text-text-muted">max {preset.maxDd}% dd</span>
                    <span className="rounded bg-bg-panel-raised px-1.5 py-0.5 font-mono text-[9px] text-text-muted">{preset.maxLev}x lev</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">vault_name</span>
              <input type="text" className="input-field mt-1" placeholder="my-policy-vault" value={form.vaultName} onChange={(e) => update('vaultName', e.target.value)} />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">risk_profile</span>
              <select className="input-field mt-1" value={form.riskProfile} onChange={(e) => update('riskProfile', e.target.value)}>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_drawdown_pct</span>
              <input type="number" min={1} max={50} className="input-field mt-1" value={form.maxDrawdownPct} onChange={(e) => update('maxDrawdownPct', Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_leverage</span>
              <input type="number" min={1} max={2} step={0.1} className="input-field mt-1" value={form.maxLeverage} onChange={(e) => update('maxLeverage', Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">execution_mode</span>
              <select className="input-field mt-1" value={form.executionMode} onChange={(e) => update('executionMode', e.target.value)}>
                <option value="advisory">advisory</option>
                <option value="constrained_auto">constrained_auto</option>
              </select>
            </label>
            {isAggressive && (
              <div className="rounded border border-accent/40 bg-accent-muted p-3 text-sm text-accent">
                <p className="font-mono text-xs uppercase tracking-wider">advisory_lock</p>
                <p className="mt-1 text-xs">Drawdown ≥ 25% requires advisory-only mode per safety policy.</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase text-text-secondary">universe.assets</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['SOL', 'ETH', 'BTC', 'USDC', 'USDT'].map((asset) => (
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
                {['jupiter', 'kamino', 'sanctum', 'drift', 'marginfi'].map((p) => (
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

        {step === 3 && (
          <div className="space-y-4">
            <div className="panel p-4">
              <p className="label">policy_summary</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-text-secondary">Risk profile</span><span className="font-mono">{form.riskProfile}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Max drawdown</span><span className="font-mono">{form.maxDrawdownPct}%</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Max leverage</span><span className="font-mono">{form.maxLeverage}x</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Assets</span><span className="font-mono">{form.assets.join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Protocols</span><span className="font-mono">{form.protocols.join(', ')}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Execution</span><span className="font-mono">{form.executionMode}</span></div>
              </div>
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
          <button type="button" onClick={submit} disabled={submitting} className="btn-primary disabled:opacity-50">{submitting ? 'Creating...' : 'Sign & create vault →'}</button>
        )}
      </div>
    </div>
  )
}
