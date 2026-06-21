import Link from "next/link"
import { WalletButton } from "@/components/wallet-button"
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-10">
        <div className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Krypton logo">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
            <path d="M12 2L3 7l9 5 9-5-9-5z" fill="var(--color-accent-muted)" />
            <line x1="8" y1="10" x2="8" y2="16" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="square" />
            <line x1="9" y1="13" x2="15" y2="10" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="square" />
            <line x1="9" y1="13" x2="15" y2="16" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <span className="font-display text-sm font-semibold tracking-tight text-text-primary">
            Krypton
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="font-mono text-[11px] uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
          >
            Docs
          </Link>
          <WalletButton />
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-3xl" />
        </div>

        <div className="relative max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 mb-6">
            <span className="status-dot status-dot--active" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              Private beta — devnet
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-text-primary lg:text-6xl">
            A programmable capital policy
            <br />
            <span className="text-accent">engine for Solana.</span>
          </h1>

          <p className="mt-6 text-base leading-relaxed text-text-secondary lg:text-lg max-w-xl mx-auto">
            Define objectives, constraints, and permissions as on-chain policy.
            A multi-agent AI pipeline generates and simulates strategies —
            the constraint engine enforces your rules on-chain. No custodian.
            No black box.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/app/create"
              className="inline-flex items-center justify-center bg-accent text-white px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors rounded-md shadow-[0_0_20px_rgba(153,69,255,0.15)]"
            >
              Create a vault →
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center border border-border bg-bg-panel px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors rounded-md"
            >
              Read the policy spec
            </Link>
          </div>

          <div className="mt-14 flex items-center justify-center gap-6 text-text-muted">
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-text-primary tabular-nums">8</p>
              <p className="font-mono text-[9px] uppercase tracking-wider mt-1">on-chain constraint checks</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-text-primary tabular-nums">0</p>
              <p className="font-mono text-[9px] uppercase tracking-wider mt-1">custodial risk</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-text-primary tabular-nums">2x</p>
              <p className="font-mono text-[9px] uppercase tracking-wider mt-1">protocol leverage cap</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="label mb-3">architecture</p>
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-3xl">
            Six primitives. One enforcement layer.
          </h2>
          <p className="mt-3 text-sm text-text-secondary max-w-2xl">
            Krypton separates concerns that other vault products hard-code together.
            Policy, intelligence, execution, privacy, and governance are distinct layers —
            the on-chain constraint engine is the only thing that can dispose.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PrimitiveCard
              title="Capital Primitive"
              desc="Custody, shares, accounting. Holds assets — never makes decisions."
            />
            <PrimitiveCard
              title="Policy Primitive"
              desc="Objectives, constraints, permissions. A signed, versioned, machine-readable document — not code."
            />
            <PrimitiveCard
              title="Agent Pipeline"
              desc="Research, strategy generation, risk scoring, simulation. Proposes — never disposes."
            />
            <PrimitiveCard
              title="Execution Primitive"
              desc="Routing, signing, settlement. Constrained by policy, not by strategy invention."
            />
            <PrimitiveCard
              title="Privacy Primitive"
              desc="Encrypted balances, positions, and pending actions via IKA threshold encryption. Selective disclosure."
            />
            <PrimitiveCard
              title="Governance Primitive"
              desc="Policy amendments via futarchy — conditional markets price a proposal expected effect on your vault token."
              comingSoon
            />
          </div>
        </div>
      </section>

      {/* ── Agent Pipeline ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="label mb-3">agent_pipeline</p>
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-3xl">
            The model recommends. The chain disposes.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AgentCard
              num="01"
              title="Research Agent"
              desc="Synthesizes market data, on-chain flows, governance signals into ranked hypotheses. Mid-tier model, high context."
            />
            <AgentCard
              num="02"
              title="Strategy Agent"
              desc="Converts top hypotheses into 1-3 candidate allocations within policy universe and allowed actions."
            />
            <AgentCard
              num="03"
              title="Risk Agent"
              desc="Rejects candidates violating policy or protocol-wide constraints. High-reasoning tier + deterministic checks."
            />
            <AgentCard
              num="04"
              title="Simulation Agent"
              desc="Scores surviving candidates via backtests, Monte Carlo, and stress scenarios. Composite score determines advancement."
            />
            <AgentCard
              num="05"
              title="Execution Agent"
              desc="Chooses routing, timing, slippage tolerance. Calls constrained tool set — never constructs raw transactions."
            />
            <AgentCard
              num="06"
              title="Monitoring Agent"
              desc="Continuous post-execution checks: drawdown, oracle staleness, liquidation proximity, protocol incident feeds."
            />
          </div>
        </div>
      </section>

      {/* ── Constraint Engine ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="label mb-3">constraint_engine</p>
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-3xl">
            8 checks. On-chain. Every action.
          </h2>
          <p className="mt-3 text-sm text-text-secondary max-w-2xl">
            The agent pipeline is advisory. The smart contract is the final enforcer.
            A compromised or hallucinating LLM cannot exceed policy limits — even at full auto-execution.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              "Leverage ≤ min(policy max, 2x protocol cap)",
              "Single-asset exposure ≤ policy position limit",
              "Correlated exposure ≤ policy correlation bucket limit",
              "Drawdown ≥ max → all non-de-risking actions blocked",
              "Target protocol must be in allowed bitmap",
              "All assets must be in policy universe",
              "Pool TVL ≥ policy liquidity floor",
              "Oracle feed fresh (< 120s staleness)",
            ].map((check, i) => (
              <div key={i} className="flex items-start gap-3 panel p-4 rounded-md border border-border bg-bg-panel">
                <span className="font-mono text-[10px] text-accent mt-0.5 shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
                <p className="text-xs text-text-secondary leading-relaxed">{check}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Target Users ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="label mb-3">who_uses_krypton</p>
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-3xl">
            Policy-bound capital. For anyone who needs it.
          </h2>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <UseCaseCard
              title="Power users"
              desc='Personal, policy-bound autonomous vault. "Medium risk, SOL/ETH/stables, max 12% drawdown, advisory mode."'
            />
            <UseCaseCard
              title="DAOs and treasuries"
              desc="Programmable, auditable treasury management. Policy changes gated by futarchy — conditional markets on your vault token."
              comingSoon
            />
            <UseCaseCard
              title="Strategy designers"
              desc="Publish composable, tradable Capital Policies without writing smart contracts. (V2)"
            />
            <UseCaseCard
              title="Institutions"
              desc="Multi-signature vaults, confidential positions, compliance-friendly audit proofs. (V2)"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-4xl">
            Stop trusting a strategy.
            <br />
            <span className="text-accent">Start enforcing a policy.</span>
          </h2>
          <p className="mt-4 text-sm text-text-secondary">
            No custodian. No black box. No regulatory ambiguity.
            <br />
            The policy is the product.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/app/create"
              className="inline-flex items-center justify-center bg-accent text-white px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors rounded-md shadow-[0_0_20px_rgba(153,69,255,0.15)]"
            >
              Create a vault →
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center border border-border bg-bg-panel px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors rounded-md"
            >
              Read the policy spec
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-border px-6 py-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
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

function PrimitiveCard({ title, desc, comingSoon }: { title: string; desc: string; comingSoon?: boolean }) {
  return (
    <div className="panel p-5 rounded-lg border border-border bg-bg-panel hover:border-accent/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-sm font-semibold text-text-primary">{title}</h3>
        {comingSoon && (
          <span className="font-mono text-[8px] uppercase tracking-wider text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded-sm">
            coming soon
          </span>
        )}
      </div>
      <p className="text-xs leading-relaxed text-text-secondary">{desc}</p>
    </div>
  )
}

function AgentCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="panel p-5 rounded-lg border border-border bg-bg-panel hover:border-accent/30 transition-colors">
      <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{num}</span>
      <h3 className="font-display text-sm font-semibold text-text-primary mt-3">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-text-secondary">{desc}</p>
    </div>
  )
}

function UseCaseCard({ title, desc, comingSoon }: { title: string; desc: string; comingSoon?: boolean }) {
  return (
    <div className="panel p-4 rounded-md border border-border bg-bg-panel">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-sm font-semibold text-text-primary">{title}</h3>
        {comingSoon && (
          <span className="font-mono text-[8px] uppercase tracking-wider text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded-sm">
            coming soon
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{desc}</p>
    </div>
  )
}
