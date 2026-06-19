import { createFileRoute, Link } from '@tanstack/react-router'
import { PageShell } from './__root'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="border-b border-[var(--border)] px-6 pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 border border-[var(--accent-muted)] px-3 py-1">
            <span className="status-dot status-dot--active" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
              Private beta — devnet
            </span>
          </div>

          <h1 className="font-display mt-6 max-w-5xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Deploy a fund manager.
            <br />
            Keep the keys.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Describe what you want your capital to do. Krypton compiles it into an enforced, on-chain policy — and a non-custodial agent executes it, with no one, anywhere, ever holding your keys.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/app" className="btn-primary text-xs">
              Connect wallet →
            </Link>
            <Link to="/docs" className="btn-secondary text-xs">
              Read the policy spec
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="label">use_cases</p>
          <h2 className="font-display mt-3 text-2xl font-semibold">
            Every capital objective. One policy engine.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="panel p-4">
                <h3 className="font-display text-sm font-semibold">{uc.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="label">how_it_works</p>
        <h2 className="font-display mt-3 text-2xl font-semibold">Set terms. Policy enforces. Agent executes.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.num} className="panel p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center border border-[var(--border)] bg-[var(--bg-panel-raised)] font-mono text-xs font-bold text-[var(--accent)]">
                  {step.num}
                </span>
                <span className="label">{step.tag}</span>
              </div>
              <h3 className="font-display mt-3 text-sm font-semibold">{step.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)] px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-semibold md:text-4xl">
            Stop trusting a strategy.
            <br />
            Start enforcing a policy.
          </h2>
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            No seed phrase. No custodian. No black box.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/app" className="btn-primary text-xs">
              Connect wallet →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

const STEPS = [
  { num: '01', tag: 'describe', title: 'Describe your goal', desc: '"Grow slowly and safely." "I want collateral." "Compound for ten years." Plain language in.' },
  { num: '02', tag: 'review', title: 'Review the policy', desc: 'Krypton compiles your intent into a structured policy — risk limits, asset universe, drawdown tolerance — shown back in plain English.' },
  { num: '03', tag: 'deploy', title: 'Deploy and deposit', desc: 'One signature creates your vault. A second funds it. Your policy is the law.' },
  { num: '04', tag: 'execute', title: 'Agent executes, chain enforces', desc: 'A multi-agent pipeline proposes every cycle. The model recommends. The on-chain constraint engine disposes.' },
] as const

const USE_CASES = [
  { title: 'The saver', desc: 'Park capital with a strict drawdown ceiling and lending-only universe.' },
  { title: 'The compounder', desc: 'Set a long horizon. Agent rotates between staking, lending, and stable yield inside your limits.' },
  { title: 'The DAO treasury', desc: 'Policy changes decided by conditional markets pricing the proposal\'s expected effect.' },
  { title: 'The allocator', desc: 'Aggressive target with a hard stop. Krypton warns if they don\'t mathematically fit.' },
  { title: 'The collateral holder', desc: 'Deposit and hold. No strategy running at all, by design.' },
] as const
