import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import {
  defaultPolicyBuilderForm,
  formToCapitalPolicy,
  policyBuilderFormSchema,
  type PolicyBuilderForm,
  ALLOWED_ACTIONS,
  DEFAULT_ASSETS,
  DEFAULT_PROTOCOLS,
  RISK_PROFILES,
  EXECUTION_MODES,
  REBALANCE_FREQUENCIES,
  GOVERNANCE_MODES,
  PRESET_FUND_MANAGERS,
  assessFeasibility,
  AGGRESSIVE_THRESHOLD_BPS,
} from '@krypton/policy-schema'
import { PolicyBlock } from '@krypton/ui'

export const Route = createFileRoute('/app/create')({
  component: CreateVaultPage,
})

const STEPS = ['Start', 'Risk', 'Universe', 'Review'] as const
type Step = (typeof STEPS)[number]

function CreateVaultPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<PolicyBuilderForm>(defaultPolicyBuilderForm)
  const [errors, setErrors] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const feasibility = useMemo(() => {
    if (form.maxDrawdownPct <= 0) return null
    const targetType = form.riskProfile === 'high' ? 'multiple' : form.riskProfile === 'low' ? 'preservation' : 'apy'
    const targetValue = form.riskProfile === 'high' ? 3 : form.riskProfile === 'low' ? 1 : 8
    return assessFeasibility(targetType, targetValue, form.maxDrawdownPct, 90)
  }, [form.maxDrawdownPct, form.riskProfile])

  const isAggressiveLocked = form.maxDrawdownPct * 100 >= AGGRESSIVE_THRESHOLD_BPS

  function update<K extends keyof PolicyBuilderForm>(key: K, value: PolicyBuilderForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleInList(key: 'assets' | 'protocols', item: string) {
    setForm((f) => {
      const list = f[key]
      return {
        ...f,
        [key]: list.includes(item) ? list.filter((x) => x !== item) : [...list, item],
      }
    })
  }

  function applyPreset(presetId: string) {
    const preset = PRESET_FUND_MANAGERS.find((p) => p.id === presetId)
    if (!preset) return
    setSelectedPreset(presetId)
    setForm((f) => ({
      ...f,
      vaultName: f.vaultName || preset.id.replace(/-/g, '_'),
      riskProfile: preset.riskProfile as PolicyBuilderForm['riskProfile'],
      maxDrawdownPct: preset.maxDrawdownPct,
      maxLeverage: preset.maxLeverage,
      maxPositionPct: preset.maxPositionPct,
      assets: preset.assets,
      protocols: preset.protocols,
      executionMode: preset.executionMode as PolicyBuilderForm['executionMode'],
    }))
    setStep(1)
  }

  function handlePromptSubmit() {
    const p = prompt.toLowerCase()
    // Simple NL matching
    if (p.includes('save') || p.includes('usdc') || p.includes('stable') || p.includes('lend')) {
      applyPreset('stable-saver')
    } else if (p.includes('compound') || p.includes('long term') || p.includes('grow') || p.includes('yield')) {
      applyPreset('steady-compounder')
    } else if (p.includes('5x') || p.includes('aggressive') || p.includes('high risk') || p.includes('perps')) {
      applyPreset('aggressive-compounder')
    } else if (p.includes('collateral') || p.includes('hold') || p.includes('deposit box')) {
      applyPreset('collateral-vault')
    } else if (p.includes('2x') || p.includes('3x') || p.includes('growth')) {
      applyPreset('growth-allocator')
    } else {
      // Default: parse what we can
      const drawdownMatch = p.match(/(\d+)%?\s*(?:drawdown|down|loss|stop)/i)
      const leverageMatch = p.match(/(\d+(?:\.\d+)?)x?\s*(?:leverage|lev)/i)
      if (drawdownMatch) update('maxDrawdownPct', Math.min(50, Math.max(1, Number(drawdownMatch[1]))))
      if (leverageMatch) update('maxLeverage', Math.min(2, Math.max(1, Number(leverageMatch[1]))))
      setStep(1)
    }
  }

  function next() {
    setErrors([])
    if (step === 0 && !form.vaultName.trim() && !selectedPreset) {
      setErrors(['Enter a vault name or select a preset'])
      return
    }
    if (step < STEPS.length - 1) setStep((s) => s + 1)
  }

  function back() {
    setErrors([])
    if (step > 0) setStep((s) => s - 1)
  }

  function submit() {
    const parsed = policyBuilderFormSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((i) => i.message))
      return
    }
    const policy = formToCapitalPolicy(parsed.data)
    console.info('Policy ready for on-chain submit_policy', policy)
    navigate({ to: '/app/vault/$id', params: { id: 'vault-alpha' } })
  }

  const previewPolicy = formToCapitalPolicy(form)

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">
        policy: builder_wizard
      </p>
      <h1 className="font-display mt-2 text-3xl font-semibold">Create vault</h1>

      {/* Step indicator */}
      <div className="mt-6 flex gap-2">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={
              i === step
                ? 'font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]'
                : 'font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]'
            }
          >
            {label}
            {i < STEPS.length - 1 && ' · '}
          </span>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="mt-4 rounded border border-[var(--accent-risk)]/50 bg-[var(--accent-risk)]/10 p-3 text-sm text-[var(--accent-risk)]">
          {errors.join(' · ')}
        </div>
      )}

      <div className="panel mt-8 p-6">
        {/* Step 0: Prompt + Presets */}
        {step === 0 && (
          <div className="space-y-6">
            {/* Natural language prompt */}
            <div>
              <label className="block">
                <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">
                  describe_your_goal
                </span>
                <textarea
                  className="mt-2 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. I want 5x in 10 weeks, stop if I'm down 5%. Or: Compound my SOL for the long term."
                />
              </label>
              <button
                type="button"
                onClick={handlePromptSubmit}
                className="btn-secondary mt-3 text-xs"
              >
                Parse prompt →
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="font-mono text-xs text-[var(--text-muted)]">or choose a preset</span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            {/* Preset cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {PRESET_FUND_MANAGERS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`rounded-xl border p-4 text-left transition-all hover:border-[var(--accent-policy)]/50 ${
                    selectedPreset === preset.id
                      ? 'border-[var(--accent-policy)] bg-[var(--accent-policy)]/5'
                      : 'border-[var(--border)] bg-[var(--bg-panel)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-semibold">{preset.name}</span>
                    {preset.hardLockAdvisory && (
                      <span className="rounded bg-[var(--accent-warning)]/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--accent-warning)]">
                        advisory only
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">{preset.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="rounded bg-[var(--bg-panel-raised)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">
                      max {preset.maxDrawdownPct}% drawdown
                    </span>
                    <span className="rounded bg-[var(--bg-panel-raised)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">
                      {preset.maxLeverage}x lev
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Risk */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">vault_name</span>
              <input
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                value={form.vaultName}
                onChange={(e) => update('vaultName', e.target.value)}
                placeholder="my-policy-vault"
              />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">governance_mode</span>
              <select
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                value={form.governanceMode}
                onChange={(e) => update('governanceMode', e.target.value as PolicyBuilderForm['governanceMode'])}
              >
                {GOVERNANCE_MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">risk_profile</span>
              <select
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                value={form.riskProfile}
                onChange={(e) => update('riskProfile', e.target.value as PolicyBuilderForm['riskProfile'])}
              >
                {RISK_PROFILES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            {(
              [
                ['maxDrawdownPct', 'max_drawdown_pct', 1, 50],
                ['maxLeverage', 'max_leverage', 1, 2],
                ['maxPositionPct', 'max_position_pct', 5, 100],
              ] as const
            ).map(([key, label, min, max]) => (
              <label key={key} className="block">
                <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">{label}</span>
                <input
                  type="number"
                  min={min}
                  max={max}
                  step={key === 'maxLeverage' ? 0.1 : 1}
                  className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                  value={form[key]}
                  onChange={(e) => update(key, Number(e.target.value) as PolicyBuilderForm[typeof key])}
                />
              </label>
            ))}

            {/* Feasibility warning */}
            {feasibility && feasibility.status === 'infeasible' && (
              <div className="rounded border border-[var(--accent-warning)]/40 bg-[var(--accent-warning)]/10 p-3 text-sm text-[var(--accent-warning)]">
                <p className="font-mono text-xs uppercase tracking-wider">feasibility_warning</p>
                <p className="mt-1 text-xs">{feasibility.negotiation_prompt}</p>
              </div>
            )}
            {feasibility && feasibility.status === 'feasible' && (
              <div className="rounded border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary)]/5 p-3 text-xs text-[var(--accent-secondary)]">
                ✓ Risk envelope is feasible for the selected profile.
              </div>
            )}

            {isAggressiveLocked && (
              <div className="rounded border border-[var(--accent-warning)]/40 bg-[var(--accent-warning)]/10 p-3 text-sm text-[var(--accent-warning)]">
                <p className="font-mono text-xs uppercase tracking-wider">advisory_lock</p>
                <p className="mt-1 text-xs">
                  Drawdown ≥ 25% requires advisory-only mode per safety policy. Execution will require manual approval.
                </p>
              </div>
            )}

            <label className="block">
              <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">execution_mode</span>
              <select
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                value={form.executionMode}
                onChange={(e) => update('executionMode', e.target.value as PolicyBuilderForm['executionMode'])}
              >
                {EXECUTION_MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">rebalance_frequency</span>
              <select
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                value={form.rebalanceFrequency}
                onChange={(e) =>
                  update('rebalanceFrequency', e.target.value as PolicyBuilderForm['rebalanceFrequency'])
                }
              >
                {REBALANCE_FREQUENCIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Step 2: Universe */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--text-secondary)]">universe.assets</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DEFAULT_ASSETS.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => toggleInList('assets', asset)}
                    className={
                      form.assets.includes(asset)
                        ? 'rounded border border-[var(--accent-policy)] bg-[var(--accent-policy)]/10 px-3 py-1 font-mono text-xs text-[var(--accent-policy)]'
                        : 'rounded border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]'
                    }
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-[var(--text-secondary)]">protocols_allowed</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {DEFAULT_PROTOCOLS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleInList('protocols', p)}
                    className={
                      form.protocols.includes(p)
                        ? 'rounded border border-[var(--accent-policy)] bg-[var(--accent-policy)]/10 px-3 py-1 font-mono text-xs text-[var(--accent-policy)]'
                        : 'rounded border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]'
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <p className="font-mono text-xs text-[var(--text-secondary)]">
              allowed_actions: {ALLOWED_ACTIONS.join(', ')}
            </p>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <PolicyBlock
              fields={{
                vault: form.vaultName || '—',
                governance: form.governanceMode,
                risk_profile: form.riskProfile,
                max_drawdown_pct: `${form.maxDrawdownPct}%`,
                max_leverage: `${form.maxLeverage}x`,
                assets: form.assets.join(', '),
                protocols: form.protocols.join(', '),
                execution: form.executionMode,
              }}
            />
            {selectedPreset && (
              <div className="rounded border border-[var(--accent-policy)]/30 bg-[var(--accent-policy)]/5 p-3">
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">
                  preset: {selectedPreset}
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {PRESET_FUND_MANAGERS.find((p) => p.id === selectedPreset)?.description}
                </p>
              </div>
            )}
            <details className="text-sm text-[var(--text-secondary)]">
              <summary className="cursor-pointer font-mono text-xs uppercase">Canonical JSON</summary>
              <pre className="mt-2 overflow-x-auto rounded bg-[var(--bg-base)] p-3 font-mono text-xs">
                {JSON.stringify(previewPolicy, null, 2)}
              </pre>
            </details>
            <p className="text-xs text-[var(--text-secondary)]">
              Signing will call create_vault + submit_policy on devnet once Phase 1 program is deployed.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={back} disabled={step === 0} className="btn-secondary disabled:opacity-40">
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="btn-primary">
            Continue
          </button>
        ) : (
          <button type="button" onClick={submit} className="btn-primary">
            Sign & create vault
          </button>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-[var(--text-secondary)]">
        <Link to="/app">Cancel</Link>
      </p>
    </div>
  )
}
