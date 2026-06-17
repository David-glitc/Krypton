import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
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
} from '@krypton/policy-schema'
import { PolicyBlock } from '@krypton/ui'

export const Route = createFileRoute('/app/create')({
  component: CreateVaultPage,
})

const STEPS = ['Basics', 'Risk envelope', 'Universe', 'Review'] as const

function CreateVaultPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<PolicyBuilderForm>(defaultPolicyBuilderForm)
  const [errors, setErrors] = useState<string[]>([])

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

  function next() {
    setErrors([])
    if (step === 0 && !form.vaultName.trim()) {
      setErrors(['Vault name is required'])
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
        {step === 0 && (
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
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">permission_level</span>
              <select
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                value={form.permissionLevel}
                onChange={(e) => update('permissionLevel', Number(e.target.value))}
              >
                <option value={2}>2 — suggest-only (beta default)</option>
                <option value={3}>3 — constrained auto</option>
              </select>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">risk_profile</span>
              <select
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                value={form.riskProfile}
                onChange={(e) => update('riskProfile', e.target.value as PolicyBuilderForm['riskProfile'])}
              >
                {RISK_PROFILES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
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
            <label className="block">
              <span className="font-mono text-xs uppercase text-[var(--text-secondary)]">execution_mode</span>
              <select
                className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm"
                value={form.executionMode}
                onChange={(e) => update('executionMode', e.target.value as PolicyBuilderForm['executionMode'])}
              >
                {EXECUTION_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
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
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

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

        {step === 3 && (
          <div className="space-y-4">
            <PolicyBlock
              fields={{
                vault: form.vaultName || '—',
                governance: form.governanceMode,
                permission_level: form.permissionLevel,
                max_drawdown_pct: `${form.maxDrawdownPct}%`,
                max_leverage: `${form.maxLeverage}x`,
                assets: form.assets.join(', '),
                protocols: form.protocols.join(', '),
              }}
            />
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
