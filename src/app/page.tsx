"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { WalletButton } from "@/components/wallet-button"

type GeneratedPolicy = Record<string, unknown>

/* ─── Hero NLP Chat ─── */
function HeroChat({ onPolicyGenerated }: { onPolicyGenerated: (p: GeneratedPolicy) => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; policy?: Partial<GeneratedPolicy> }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])
  const handleSubmit = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: msg }])

    try {
      const res = await fetch('/api/generate-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: msg }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        setMessages(prev => [...prev, { role: 'ai', content: `Error: ${err.error}` }])
        setLoading(false)
        return
      }

      const data = await res.json()
      const policy = data.policy as GeneratedPolicy
      onPolicyGenerated(policy)
      setMessages(prev => [...prev, {
        role: 'ai',
        content: (policy.reasoning as string) ?? 'Policy generated successfully.',
        policy,
      }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` }])
    }

    setLoading(false)
  }, [input, loading, onPolicyGenerated])

  const suggestions = [
    'I want conservative yield on USDC and SOL, max 5% drawdown',
    'Aggressive growth with SOL and ETH, 2x leverage, auto-rebalance daily',
    'Balanced portfolio: SOL, BTC, USDC. Medium risk, I approve every trade',
    'Just stake SOL for long-term holding, no leverage',
  ]

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Chat messages */}
      <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto pr-2">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary text-sm mb-2">Describe your investment strategy in natural language.</p>
            <p className="text-text-muted text-xs">Our AI agent will generate a structured capital policy from your description.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
            <p className="text-sm text-text-primary whitespace-pre-wrap">{msg.content}</p>
            {msg.policy && (
              <Link
                href={`/app/create?policy=${encodeURIComponent(JSON.stringify(msg.policy))}`}
                className="mt-3 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent hover:text-accent-hover transition-colors"
              >
                <span>Review & deploy this policy</span>
                <span>→</span>
              </Link>
            )}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble chat-bubble-ai">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSubmit(s)}
              disabled={loading}
              className="px-3 py-1.5 text-[11px] font-mono text-text-secondary border border-border rounded-full hover:border-accent hover:text-accent transition-all disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
        className="relative"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
          placeholder="Describe your investment goals... e.g. I want to compound SOL yield with low risk"
          rows={2}
          disabled={loading}
          className="input-field pr-24 resize-none text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary absolute right-2 bottom-2 !py-1.5 !px-4 !text-[10px]"
        >
          {loading ? '···' : 'Generate →'}
        </button>
      </form>
    </div>
  )
}

/* ─── Animated Pipeline ─── */
function AgentPipelineVisualization() {
  const stages = [
    { id: 'research', icon: '◎', label: 'Research', color: 'accent-info', desc: 'Market data, on-chain flows, governance signals' },
    { id: 'strategy', icon: '◈', label: 'Strategy', color: 'accent', desc: 'Candidate allocations within policy bounds' },
    { id: 'risk', icon: '⚙', label: 'Risk', color: 'accent-warn', desc: 'Constraint validation + deterministic checks' },
    { id: 'simulation', icon: '⟳', label: 'Simulation', color: 'accent', desc: 'Backtests, Monte Carlo, stress scenarios' },
    { id: 'execution', icon: '→', label: 'Execute', color: 'accent-positive', desc: 'Routing, signing, settlement via CPI' },
    { id: 'monitoring', icon: '◉', label: 'Monitor', color: 'accent-info', desc: 'Drawdown, oracle health, incident feeds' },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1 mb-6">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center text-center flex-1 group">
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm mb-2 transition-all duration-300 group-hover:scale-110 ${
                i === 0 ? 'border-accent-info/50 bg-accent-info/10 text-accent-info animate-pulse-dot' :
                i === 4 ? 'border-accent-positive/50 bg-accent-positive/10 text-accent-positive' :
                'border-border bg-bg-panel text-text-muted'
              }`}>
                {stage.icon}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">{stage.label}</span>
              <span className="text-[9px] text-text-muted mt-1 hidden lg:block max-w-[100px]">{stage.desc}</span>
            </div>
            {i < stages.length - 1 && (
              <div className="h-px flex-1 bg-gradient-to-r from-border to-border/30 mx-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Constraint Engine Visualization ─── */
function ConstraintEngineViz() {
  const checks = [
    { label: 'Leverage ≤ 2x cap', status: 'pass' },
    { label: 'Position concentration', status: 'pass' },
    { label: 'Correlated exposure', status: 'pass' },
    { label: 'Drawdown threshold', status: 'pass' },
    { label: 'Protocol whitelist', status: 'pass' },
    { label: 'Asset universe', status: 'pass' },
    { label: 'Liquidity floor', status: 'pass' },
    { label: 'Oracle freshness', status: 'pass' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {checks.map((check, i) => (
        <div
          key={i}
          className="panel-glow p-3 flex items-center gap-2 animate-fade-in"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-accent-positive animate-pulse-dot" />
          <span className="text-[10px] font-mono text-text-secondary">{check.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Page ─── */
export default function Home() {
  const [generatedPolicy, setGeneratedPolicy] = useState<GeneratedPolicy | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-bg-base noise-bg">
      {/* ── Header ── */}
      <header className="glass sticky top-0 z-50 border-b border-border">
        <div className="flex items-center justify-between px-6 py-3 lg:px-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center glow-accent">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-text-primary">
              Krypton
            </span>
          </div>
          <div className="flex items-center gap-3">
            <WalletButton />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/[0.04] blur-[120px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <span className="status-dot status-dot--active" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              AI-Powered · Solana Devnet
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-text-primary lg:text-6xl animate-fade-in-slow">
            Describe your strategy.
            <br />
            <span className="gradient-text">We generate the policy.</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-text-secondary lg:text-lg max-w-2xl mx-auto animate-fade-in-slow" style={{ animationDelay: '0.2s' }}>
            A multi-agent AI pipeline that researches, simulates, and executes on-chain —
            constrained by your rules. No custodian. No black box.
          </p>
        </div>

        {/* NLP Chat Interface */}
        <div className="relative w-full max-w-3xl mx-auto animate-fade-in-slow" style={{ animationDelay: '0.4s' }}>
          <div className="glass rounded-2xl border border-border p-4 glow-accent">
            <HeroChat onPolicyGenerated={setGeneratedPolicy} />
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-10 flex items-center justify-center gap-8 animate-fade-in-slow" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
            <p className="font-display text-2xl font-semibold gradient-text tabular-nums">8</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted mt-1">on-chain checks/action</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="font-display text-2xl font-semibold gradient-text tabular-nums">6</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted mt-1">AI agents in pipeline</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="font-display text-2xl font-semibold gradient-text tabular-nums">2x</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted mt-1">protocol leverage cap</p>
          </div>
        </div>
      </section>

      {/* ── Agent Pipeline ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10 bg-bg-deep/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="label mb-3">agent_pipeline</p>
            <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-3xl">
              Six agents. One enforcement layer.
            </h2>
            <p className="mt-3 text-sm text-text-secondary max-w-xl mx-auto">
              The model recommends. The chain disposes. Every action passes through 8 on-chain constraint checks before execution.
            </p>
          </div>

          <AgentPipelineVisualization />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
            <div className="panel-glow p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-accent-info" />
                <span className="text-xs font-mono uppercase tracking-wider text-accent-info">Research → Strategy</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Research Agent synthesizes market data, on-chain flows, and governance signals into ranked hypotheses.
                Strategy Agent converts top hypotheses into 1-3 candidate allocations within your policy universe.
              </p>
            </div>
            <div className="panel-glow p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-accent-warn" />
                <span className="text-xs font-mono uppercase tracking-wider text-accent-warn">Risk → Simulation</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Risk Agent rejects candidates violating policy or protocol-wide constraints.
                Simulation Agent scores survivors via backtests, Monte Carlo, and stress scenarios.
              </p>
            </div>
            <div className="panel-glow p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-accent-positive" />
                <span className="text-xs font-mono uppercase tracking-wider text-accent-positive">Execute → Monitor</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Execution Agent routes via Jupiter/Titan with constrained tool calls.
                Monitoring Agent runs continuous post-execution checks on every block.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Constraint Engine ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="label mb-3">constraint_engine</p>
            <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-3xl">
              8 checks. On-chain. Every action.
            </h2>
            <p className="mt-3 text-sm text-text-secondary max-w-xl mx-auto">
              The agent pipeline is advisory. The smart contract is the final enforcer.
              A compromised or hallucinating LLM cannot exceed policy limits.
            </p>
          </div>

          <ConstraintEngineViz />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border px-6 py-24 lg:px-10 bg-bg-deep/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-4xl">
            Stop trusting a strategy.
            <br />
            <span className="gradient-text">Start enforcing a policy.</span>
          </h2>
          <p className="mt-4 text-sm text-text-secondary">
            No custodian. No black box. No regulatory ambiguity.
            <br />
            The policy is the product.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/app/create"
              className="btn-primary !px-8 !py-3.5 !text-xs animate-pulse-glow"
            >
              Create a vault →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-border px-6 py-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row max-w-7xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">
            © 2026 Krypton — The policy is the product.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/David-glitc/Krypton" className="font-mono text-[10px] uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors">
              GitHub
            </a>
            <a href="https://x.com/krypton" className="font-mono text-[10px] uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors">
              X
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
