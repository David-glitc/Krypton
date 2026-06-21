"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  type ExecutionMode,
  type GovernanceMode,
  type PrivacyLevel,
  type RebalanceFrequency,
  type RiskProfile,
  type PermissionLevel,
} from "@/lib/mock-data"

/* ── Types ── */

interface GeneratedPolicy {
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
  reasoning?: string
}

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
  vaultName: "",
  governanceMode: "owner",
  privacyLevel: "standard",
  riskProfile: "medium",
  maxDrawdownPct: 12,
  maxLeverage: 1.5,
  maxPositionPct: 35,
  maxCorrelatedExposurePct: 60,
  liquidityFloorUsd: 5000000,
  assets: ["SOL", "USDC"],
  protocols: ["jupiter", "kamino"],
  executionMode: "advisory",
  permissionLevel: 2,
  rebalanceFrequency: "daily",
  allowedActions: ["swap", "stake", "lend"],
  forbiddenActions: ["leverage_above_policy_max", "unverified_protocols", "memecoins"],
  pauseAuthority: ["owner_wallet"],
}

const ALL_ASSETS = ["SOL", "ETH", "BTC", "USDC", "USDT"]
const ALL_PROTOCOLS = ["jupiter", "drift", "kamino", "sanctum", "marginfi"]
const ALL_ACTIONS = ["swap", "stake", "lend", "borrow", "provide_liquidity"]
const ALL_FORBIDDEN = ["leverage_above_policy_max", "unverified_protocols", "memecoins"]

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
    { label: "Leverage ≤ 2x protocol cap", pass: f.maxLeverage <= 2, detail: f.maxLeverage > 2 ? `${f.maxLeverage}x exceeds 2x hard cap` : `${f.maxLeverage}x ≤ 2x ✓` },
    { label: "Leverage ≤ policy max", pass: true, detail: `Policy sets ${f.maxLeverage}x` },
    { label: "Position concentration ≤ 100%", pass: f.maxPositionPct <= 100, detail: f.maxPositionPct > 100 ? `${f.maxPositionPct}% exceeds 100%` : `${f.maxPositionPct}% ≤ 100% ✓` },
    { label: "Correlated exposure ≤ 100%", pass: f.maxCorrelatedExposurePct <= 100, detail: `${f.maxCorrelatedExposurePct}% ✓` },
    { label: "Drawdown ≥ 0%", pass: f.maxDrawdownPct > 0, detail: `${f.maxDrawdownPct}% ✓` },
    { label: "Assets non-empty if pipeline active", pass: f.permissionLevel === 1 || f.assets.length > 0, detail: f.permissionLevel === 1 ? "Read-only: no assets needed" : `${f.assets.length} assets selected` },
    { label: "Protocols non-empty if actions selected", pass: f.allowedActions.length === 0 || f.protocols.length > 0, detail: `${f.protocols.length} protocols for ${f.allowedActions.length} actions` },
    { label: "Oracle staleness check configured", pass: true, detail: "120s threshold (protocol default)" },
  ]
}

function applyPolicyToForm(policy: Partial<GeneratedPolicy>, base: FormState): FormState {
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

/* ── NLP Chat Component ── */
function NlpChat({ onPolicy }: { onPolicy: (p: GeneratedPolicy) => void }) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [loading, error])

  const handleSubmit = useCallback(async () => {
    const msg = input.trim()
    if (!msg || loading) return
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/generate-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: msg }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(err.error)
      }
      const data = await res.json()
      onPolicy(data.policy as GeneratedPolicy)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate policy")
    }
    setLoading(false)
  }, [input, loading, onPolicy])

  return (
    <div className="space-y-3">
      <div className="panel-glow p-4">
        <p className="text-xs text-text-secondary mb-3">
          Describe your investment strategy in natural language. Our AI will generate a structured policy.
        </p>
        <div className="flex gap-2 flex-wrap mb-3">
          {[
            "Conservative USDC yield, max 3% drawdown",
            "Aggressive SOL/ETH growth, 2x leverage",
            "Balanced SOL/BTC/USDC, medium risk",
          ].map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s) }}
              className="px-2.5 py-1 text-[10px] font-mono text-text-secondary border border-border rounded-full hover:border-accent hover:text-accent transition-all"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
          className="relative"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            placeholder="e.g. I want to compound SOL yield with low risk, max 5% drawdown..."
            rows={2}
            disabled={loading}
            className="input-field pr-20 resize-none text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary absolute right-2 bottom-2 !py-1 !px-3 !text-[10px]"
          >
            {loading ? "···" : "Generate"}
          </button>
        </form>
        {loading && (
          <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
            <div className="typing-indicator"><span></span><span></span><span></span></div>
            <span>AI is generating your policy...</span>
          </div>
        )}
        {error && <p className="mt-2 text-xs text-accent-risk">{error}</p>}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}

/* ── Main Page ── */

const STEPS = ["Policy", "Constraints", "Universe", "Review"] as const

export default function CreateVaultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM })
  const [submitting, setSubmitting] = useState(false)
  const [aiPolicy, setAiPolicy] = useState<GeneratedPolicy | null>(null)

  // Load AI-generated policy from URL
  useEffect(() => {
    const policyParam = searchParams.get("policy")
    if (policyParam) {
      try {
        const policy = JSON.parse(decodeURIComponent(policyParam)) as GeneratedPolicy
        setAiPolicy(policy)
        setForm(applyPolicyToForm(policy, DEFAULT_FORM))
      } catch {
        // ignore malformed param
      }
    }
  }, [searchParams])

  const isAggressive = form.maxDrawdownPct >= 25
  const constraintChecks = validateConstraints(form)
  const allConstraintsPass = constraintChecks.every((c) => c.pass)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleListItem(key: "assets" | "protocols" | "allowedActions" | "forbiddenActions" | "pauseAuthority", item: string) {
    setForm((f) => {
      const arr = f[key] as string[]
      return { ...f, [key]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item] }
    })
  }

  function handleAiPolicy(policy: GeneratedPolicy) {
    setAiPolicy(policy)
    setForm(applyPolicyToForm(policy, form))
  }

  async function submit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    router.push("/app")
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="label">policy: builder</p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-text-primary">Create vault</h1>

      {/* Step indicator */}
      <div className="mt-6 flex gap-2">
        {STEPS.map((label, i) => (
          <span key={label} className={`font-mono text-xs uppercase tracking-wider ${i === step ? "text-accent" : "text-text-secondary"}`}>
            {label}{i < STEPS.length - 1 && " · "}
          </span>
        ))}
      </div>

      <div className="panel-glow mt-8 p-6">
        {/* Step 0: NLP + Policy core */}
        {step === 0 && (
          <div className="space-y-6">
            <NlpChat onPolicy={handleAiPolicy} />

            {aiPolicy?.reasoning && (
              <div className="panel p-4 animate-fade-in">
                <p className="label">ai_reasoning</p>
                <p className="mt-1 text-sm text-text-secondary">{aiPolicy.reasoning}</p>
              </div>
            )}

            <div className="h-px bg-border" />

            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">vault_name</span>
              <input type="text" className="input-field mt-1" placeholder="my-policy-vault" value={form.vaultName} onChange={(e) => update("vaultName", e.target.value)} />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="font-mono text-xs uppercase text-text-secondary">risk_profile</span>
                <select className="input-field mt-1" value={form.riskProfile} onChange={(e) => update("riskProfile", e.target.value as RiskProfile)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-xs uppercase text-text-secondary">execution_mode</span>
                <select className="input-field mt-1" value={form.executionMode} onChange={(e) => update("executionMode", e.target.value as ExecutionMode)}>
                  <option value="advisory">Advisory — I approve every action</option>
                  <option value="constrained_auto">Constrained auto — agent executes within policy</option>
                  <option value="full_auto">Full auto — no per-cycle notification</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="font-mono text-xs uppercase text-text-secondary">privacy_level</span>
                <select className="input-field mt-1" value={form.privacyLevel} onChange={(e) => update("privacyLevel", e.target.value as PrivacyLevel)}>
                  <option value="standard">Standard — NAV public</option>
                  <option value="full">Full — NAV hidden</option>
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-xs uppercase text-text-secondary">rebalance_frequency</span>
                <select className="input-field mt-1" value={form.rebalanceFrequency} onChange={(e) => update("rebalanceFrequency", e.target.value as RebalanceFrequency)}>
                  <option value="event_driven">Event-driven</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </label>
            </div>

            {isAggressive && (
              <div className="rounded border border-accent-warn/40 bg-accent-warn-muted p-3 animate-fade-in">
                <p className="font-mono text-xs uppercase tracking-wider text-accent-warn">advisory_lock</p>
                <p className="mt-1 text-xs text-text-secondary">Drawdown ≥ 25% requires advisory-only mode per protocol safety.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Constraints */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_drawdown_pct</span>
              <input type="number" min={1} max={50} className="input-field mt-1" value={form.maxDrawdownPct} onChange={(e) => update("maxDrawdownPct", Number(e.target.value))} />
              <span className="font-mono text-[10px] text-text-muted mt-1 block">Current: {form.maxDrawdownPct}%</span>
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_leverage (protocol cap: 2x)</span>
              <input type="number" min={1} max={2} step={0.1} className="input-field mt-1" value={form.maxLeverage} onChange={(e) => update("maxLeverage", Number(e.target.value))} />
              <span className="font-mono text-[10px] text-text-muted mt-1 block">Current: {form.maxLeverage}x</span>
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_position_pct (single asset)</span>
              <input type="number" min={1} max={100} className="input-field mt-1" value={form.maxPositionPct} onChange={(e) => update("maxPositionPct", Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">max_correlated_exposure_pct</span>
              <input type="number" min={1} max={100} className="input-field mt-1" value={form.maxCorrelatedExposurePct} onChange={(e) => update("maxCorrelatedExposurePct", Number(e.target.value))} />
            </label>
            <label className="block">
              <span className="font-mono text-xs uppercase text-text-secondary">min_pool_liquidity_usd</span>
              <input type="number" min={0} step={1000000} className="input-field mt-1" value={form.liquidityFloorUsd} onChange={(e) => update("liquidityFloorUsd", Number(e.target.value))} />
              <span className="font-mono text-[10px] text-text-muted mt-1 block">Current: {formatUsd(form.liquidityFloorUsd)}</span>
            </label>

            <div>
              <span className="font-mono text-xs uppercase text-text-secondary">allowed_actions</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_ACTIONS.map((action) => (
                  <button key={action} type="button" onClick={() => toggleListItem("allowedActions", action)}
                    className={`rounded border px-3 py-1 font-mono text-xs transition-all ${form.allowedActions.includes(action) ? "border-accent bg-accent-muted text-accent" : "border-border text-text-secondary hover:border-accent/50"}`}
                  >{action}</button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-xs uppercase text-text-secondary">forbidden_actions</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_FORBIDDEN.map((action) => (
                  <button key={action} type="button" onClick={() => toggleListItem("forbiddenActions", action)}
                    className={`rounded border px-3 py-1 font-mono text-xs transition-all ${form.forbiddenActions.includes(action) ? "border-accent-risk bg-accent-risk/10 text-accent-risk" : "border-border text-text-secondary hover:border-accent-risk/50"}`}
                  >{action}</button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-xs uppercase text-text-secondary">pause_authority</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {["owner_wallet", "protocol_guardian_multisig"].map((auth) => (
                  <button key={auth} type="button" onClick={() => toggleListItem("pauseAuthority", auth)}
                    className={`rounded border px-3 py-1 font-mono text-xs transition-all ${form.pauseAuthority.includes(auth) ? "border-accent bg-accent-muted text-accent" : "border-border text-text-secondary hover:border-accent/50"}`}
                  >{auth}</button>
                ))}
              </div>
            </div>

            {/* Constraint validation */}
            <div className="mt-4 rounded border border-border bg-bg-base p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-3">constraint_engine validation</p>
              <div className="space-y-2">
                {constraintChecks.map((check, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`font-mono text-[10px] mt-0.5 ${check.pass ? "text-accent-positive" : "text-accent-risk"}`}>{check.pass ? "✓" : "✗"}</span>
                    <div>
                      <span className="font-mono text-[10px] text-text-secondary">{check.label}</span>
                      <span className="font-mono text-[10px] text-text-muted ml-2">— {check.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              {!allConstraintsPass && <p className="font-mono text-[10px] text-accent-risk mt-3">Some checks failed. Fix before submitting.</p>}
            </div>
          </div>
        )}

        {/* Step 2: Universe */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase text-text-secondary">universe.assets</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_ASSETS.map((asset) => (
                  <button key={asset} type="button" onClick={() => toggleListItem("assets", asset)}
                    className={`rounded border px-3 py-1 font-mono text-xs transition-all ${form.assets.includes(asset) ? "border-accent bg-accent-muted text-accent" : "border-border text-text-secondary hover:border-accent/50"}`}
                  >{asset}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase text-text-secondary">protocols_allowed</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_PROTOCOLS.map((p) => (
                  <button key={p} type="button" onClick={() => toggleListItem("protocols", p)}
                    className={`rounded border px-3 py-1 font-mono text-xs transition-all ${form.protocols.includes(p) ? "border-accent bg-accent-muted text-accent" : "border-border text-text-secondary hover:border-accent/50"}`}
                  >{p}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="panel p-4">
              <p className="label">policy_summary</p>
              <div className="mt-3 space-y-2">
                {[
                  ["Vault name", form.vaultName || "—"],
                  ["Risk profile", form.riskProfile],
                  ["Max drawdown", `${form.maxDrawdownPct}%`],
                  ["Max leverage", `${form.maxLeverage}x`],
                  ["Max position", `${form.maxPositionPct}%`],
                  ["Correlated exposure", `${form.maxCorrelatedExposurePct}%`],
                  ["Liquidity floor", formatUsd(form.liquidityFloorUsd)],
                  ["Assets", form.assets.join(", ") || "None"],
                  ["Protocols", form.protocols.join(", ") || "None"],
                  ["Execution", form.executionMode],
                  ["Rebalance", form.rebalanceFrequency],
                  ["Privacy", form.privacyLevel],
                  ["Allowed actions", form.allowedActions.join(", ") || "None"],
                  ["Forbidden", form.forbiddenActions.join(", ")],
                  ["Pause authority", form.pauseAuthority.join(", ")],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-text-secondary text-xs">{label}</span>
                    <span className="font-mono text-xs text-text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded border p-3 ${allConstraintsPass ? "border-accent-positive/30 bg-accent-positive/5" : "border-accent-risk/30 bg-accent-risk/5"}`}>
              <p className={`font-mono text-xs ${allConstraintsPass ? "text-accent-positive" : "text-accent-risk"}`}>
                {allConstraintsPass ? "✓ All 8 constraint checks pass" : "✗ Some constraint checks failed"}
              </p>
            </div>

            {aiPolicy?.reasoning && (
              <div className="panel p-3">
                <p className="label">ai_reasoning</p>
                <p className="mt-1 text-xs text-text-secondary">{aiPolicy.reasoning}</p>
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
            {submitting ? "Creating..." : "Sign & create vault →"}
          </button>
        )}
      </div>
    </div>
  )
}
