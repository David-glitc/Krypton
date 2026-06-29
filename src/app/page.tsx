"use client"

import { useContext, useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DynamicContext } from "@dynamic-labs/sdk-react-core"
import {
  Search,
  Brain,
  Shield,
  FlaskConical,
  Zap,
  LineChart as LineChartIcon,
  Plus,
  ArrowRight,
} from "lucide-react"
import { WalletButton } from "@/components/wallet-button"
import { SimulationChart } from "@/components/landing/simulation-chart"

type GeneratedPolicy = Record<string, unknown>

const SUGGESTIONS = [
  'I want conservative yield on USDC and SOL, max 5% drawdown',
  'Aggressive growth with SOL and ETH, 2x leverage, auto-rebalance daily',
  'Balanced portfolio: SOL, BTC, USDC. Medium risk, I approve every trade',
]

const PIPELINE_STAGES = [
  { id: 'research', icon: Search, label: 'Research', sub: 'Market data' },
  { id: 'strategy', icon: Brain, label: 'Strategy', sub: 'Allocations' },
  { id: 'risk', icon: Shield, label: 'Risk', sub: 'Constraints' },
  { id: 'simulation', icon: FlaskConical, label: 'Simulation', sub: 'Backtests' },
  { id: 'execution', icon: Zap, label: 'Execute', sub: 'Routing' },
  { id: 'monitoring', icon: LineChartIcon, label: 'Monitor', sub: 'Every block' },
]

const CONSTRAINT_CHECKS = [
  'Leverage < 2x cap',
  'Position concentration',
  'Correlated exposure',
  'Drawdown threshold',
  'Protocol whitelist',
  'Asset universe',
  'Liquidity floor',
  'Oracle freshness',
]

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

  return (
    <div className="w-full max-w-3xl">
      {messages.length > 0 && (
        <div className="mb-4 max-h-[280px] space-y-3 overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
              <p className="text-sm text-text-primary whitespace-pre-wrap">{msg.content}</p>
              {msg.policy && (
                <Link
                  href={`/app/create?policy=${encodeURIComponent(JSON.stringify(msg.policy))}`}
                  className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent hover:text-accent-hover transition-colors"
                >
                  <span>Review & deploy this policy</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble chat-bubble-ai">
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {messages.length === 0 && (
        <>
          <p className="mb-6 text-center text-sm text-text-secondary">
            Describe your investment strategy in natural language.
            <br />
            Our AI agent will generate a structured capital policy from your description.
          </p>
          <div className="mb-6 flex flex-col items-center gap-3">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSubmit(s)}
                disabled={loading}
                className="w-full max-w-xl rounded-xl border border-border bg-bg-base px-4 py-2.5 text-center font-mono text-[13px] uppercase tracking-wide text-text-secondary transition-colors hover:border-accent hover:text-text-primary disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
        className="relative"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
          placeholder="Describe your investment goals... e.g. I want to compound SOL yield with low risk"
          rows={3}
          disabled={loading}
          className="input-field min-h-[128px] resize-none pb-14"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary absolute bottom-4 left-4 inline-flex items-center gap-2"
        >
          {loading ? '···' : 'Generate'}
          {!loading && <ArrowRight className="h-3 w-3" />}
        </button>
      </form>
    </div>
  )
}

function KryptonLogo() {
  return (
    <div className="flex h-8 w-8 items-center justify-center border border-border bg-bg-panel">
      <span className="font-mono text-sm font-bold text-accent">K</span>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const dynamicContext = useContext(DynamicContext)
  const [generatedPolicy, setGeneratedPolicy] = useState<GeneratedPolicy | null>(null)
  const [checkedAuth, setCheckedAuth] = useState(false)
  void generatedPolicy

  useEffect(() => {
    if (!checkedAuth && dynamicContext?.primaryWallet) {
      router.replace('/app')
    }
    if (!checkedAuth) setCheckedAuth(true)
  }, [dynamicContext?.primaryWallet, checkedAuth, router])

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <header className="glass sticky top-0 z-50 border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <KryptonLogo />
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">
              Krypton
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/app" className="border-b-2 border-accent pb-1 text-lg text-accent">
              Dashboard
            </Link>
            <Link href="#simulation" className="text-lg text-text-secondary transition-colors hover:text-text-primary">
              Research
            </Link>
            <a href="https://github.com/David-glitc/Krypton" className="text-lg text-text-secondary transition-colors hover:text-text-primary">
              Docs
            </a>
          </nav>

          <WalletButton />
        </div>
      </header>

      <main className="flex flex-col gap-32 py-32">
        <section className="flex flex-col items-center px-6">
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-bg-panel px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-mono text-[13px] uppercase tracking-wide text-text-secondary">
              AI-Powered · Solana Devnet Beta · On-Chain Agent Logs
            </span>
          </div>

          <h1 className="max-w-4xl text-center font-display text-5xl font-bold leading-[1.1] tracking-tight text-text-primary lg:text-7xl">
            DeFi vaults managed by
            <br />
            <span className="text-accent">AI agents, bound by policy.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-center text-lg leading-relaxed text-text-secondary">
            You set the rules. A pipeline of six AI agents researches, strategizes, risk-checks, simulates,
            and executes on Solana — every action constrained by on-chain policy.
            No custody. No black box. Every decision logged.
          </p>

          <div className="mt-10 w-full max-w-3xl rounded-lg border border-border bg-bg-panel p-8 shadow-[0_0_40px_rgba(5,250,83,0.05)]">
            <HeroChat onPolicyGenerated={setGeneratedPolicy} />
          </div>
        </section>

        <section className="border-y border-border">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              { value: '8', label: 'ON-CHAIN CHECKS PER ACTION' },
              { value: '6', label: 'AI AGENTS IN PIPELINE' },
              { value: '$4-20', label: 'ONE-TIME VAULT FEE' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center bg-bg-base py-12">
                <p className="font-display text-6xl font-bold tracking-tight text-accent lg:text-7xl">
                  {stat.value}
                </p>
                <p className="mt-4 font-mono text-[13px] uppercase tracking-wide text-text-secondary">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="label mb-4">agent_pipeline</p>
              <h2 className="font-display text-3xl font-semibold text-text-primary lg:text-4xl">
                Six agents. One enforcement layer.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
                Each stage sharpens the signal. The smart contract enforces the final decision.
                A hallucinating LLM cannot exceed your policy limits.
              </p>
            </div>

            <div className="relative mb-16">
              <div className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" />
              <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                {PIPELINE_STAGES.map((stage, i) => {
                  const Icon = stage.icon
                  return (
                    <div key={stage.id} className="flex flex-col items-center text-center">
                      <div className={`relative z-10 flex h-12 w-12 items-center justify-center border bg-bg-panel ${i === 0 ? 'border-accent shadow-[0_0_20px_rgba(5,250,83,0.15)]' : 'border-border'}`}>
                        <Icon className={`h-5 w-5 ${i === 0 ? 'text-accent' : 'text-text-secondary'}`} />
                      </div>
                      <p className="mt-4 font-mono text-[13px] uppercase tracking-wide text-text-primary">
                        {stage.label}
                      </p>
                      <p className="mt-1 text-sm text-text-muted">{stage.sub}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  tag: 'Research → Strategy',
                  body: 'Research Agent analyzes market data, on-chain flows, and governance signals. Strategy Agent converts the best hypotheses into candidate allocations that fit your policy universe.',
                },
                {
                  tag: 'Risk → Simulation',
                  body: 'Risk Agent rejects candidates that violate policy constraints. Simulation Agent scores survivors with backtests, Monte Carlo, and stress scenarios.',
                },
                {
                  tag: 'Execute → Monitor',
                  body: 'Execution Agent routes swaps through Jupiter with tool-call precision. Monitoring Agent runs post-execution checks on every block.',
                },
              ].map((card) => (
                <div key={card.tag} className="panel p-6">
                  <p className="mb-3 font-mono text-[13px] uppercase tracking-wide text-accent">
                    {card.tag}
                  </p>
                  <p className="text-sm leading-relaxed text-text-secondary">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="simulation" className="border-t border-border px-6 pt-16">
          <div className="mx-auto max-w-6xl">
            <SimulationChart />
          </div>
        </section>

        <section className="px-6">
          <div className="mx-auto max-w-5xl text-center">
            <p className="label mb-4">constraint_engine</p>
            <h2 className="font-display text-3xl font-semibold text-text-primary lg:text-4xl">
              8 checks. On-chain. Every action.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              The agents propose. The contract disposes.
              Every transaction passes through eight on-chain constraint checks before execution.
              A compromised LLM cannot exceed policy limits.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CONSTRAINT_CHECKS.map((check) => (
                <div
                  key={check}
                  className="flex items-center gap-3 border border-border bg-bg-panel px-6 py-4 text-left"
                >
                  <Plus className="h-3 w-3 shrink-0 text-accent" />
                  <span className="font-mono text-[13px] uppercase tracking-wide text-text-secondary">
                    {check}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-semibold text-text-primary lg:text-5xl">
              You set the policy.
              <br />
              <span className="text-accent">Agents execute within it.</span>
            </h2>
            <p className="mt-6 text-lg text-text-secondary">
              No custodian. No black box. Every action logged on-chain with full agent reasoning.
              <br />
              One-time vault fee from $4 to $20.
            </p>
            <Link href="/app/create" className="btn-primary mt-10 inline-flex items-center gap-2 !px-8 !py-4 !text-sm">
              Create a vault
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-[13px] uppercase tracking-wide text-text-muted">
            © 2026 Krypton Systems
          </p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/David-glitc/Krypton" className="font-mono text-[13px] uppercase tracking-wide text-text-muted transition-colors hover:text-text-secondary">
              GitHub
            </a>
            <span className="font-mono text-[13px] uppercase tracking-wide text-text-muted">
              Legal
            </span>
            <span className="font-mono text-[13px] uppercase tracking-wide text-text-muted">
              Devnet Beta
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
