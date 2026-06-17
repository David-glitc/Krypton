import { createFileRoute, Link } from '@tanstack/react-router'
import { PipelineStrip } from '@krypton/ui'
import { PageShell } from './__root'
import { isPrivateBetaActive } from '~/lib/invite'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const INTEGRATIONS = [
  { name: 'Jupiter', tag: 'Swap' },
  { name: 'Kamino', tag: 'Lend' },
  { name: 'Sanctum', tag: 'Stake' },
  { name: 'Drift', tag: 'Perps' },
  { name: 'Pyth', tag: 'Oracle' },
  { name: 'Ika', tag: 'MPC' },
] as const

const STEPS = [
  {
    num: '01',
    title: 'Define your Capital Policy',
    desc: 'Objectives, risk envelope, execution mandate — signed once. Constraints enforced on-chain, not a black box.',
    tag: 'policy',
  },
  {
    num: '02',
    title: 'Agent pipeline proposes actions',
    desc: 'Multi-agent system researches, strategies, and simulates every decision. Level 1 review or Level 2 auto-approve within bounds.',
    tag: 'agents',
  },
  {
    num: '03',
    title: 'Constraint Engine gates execution',
    desc: 'Leverage caps, concentration limits, drawdown stops — hard coded, not promised. Runs 24/7, no babysitting.',
    tag: 'engine',
  },
] as const

const DIFF_ROWS = [
  ['Strategy', 'Fixed or opaque', 'Ephemeral, regenerated each cycle'],
  ['Execution', 'Agent-held keys', 'Policy-gated MPC (Ika dWallet)'],
  ['Enforcement', 'Model judgment', 'On-chain Constraint Engine'],
  ['Auditability', 'Trust the operator', 'Every cycle hashed and logged'],
  ['Ops', '9-5 oversight', '24/7 autonomous within bounds'],
] as const

const STATS = [
  { value: '8', label: 'Constraint checks per action' },
  { value: '0', label: 'Agent-held private keys' },
  { value: '100%', label: 'On-chain audit trail' },
] as const

function LandingPage() {
  const betaActive = isPrivateBetaActive()

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--accent-primary)_0%,_transparent_30%)] opacity-[0.08]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--accent-secondary)_0%,_transparent_35%)] opacity-[0.06]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary-glow)] bg-[var(--accent-primary)]/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-secondary)]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-secondary)]">
              Private beta — devnet
            </span>
          </div>

          <h1 className="font-display mt-8 max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Create your own{' '}
            <span className="gradient-text">
              hedge fund
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            Define a Capital Policy — objectives, risk envelope, execution mandate.
            An AI agent pipeline researches strategies, simulates outcomes, and proposes
            actions. The on-chain Constraint Engine enforces every trade.
          </p>

          <p className="mt-4 max-w-2xl text-sm text-[var(--text-muted)]">
            Fund infrastructure, not a fund manager. Your vault runs 24/7 within the
            bounds you set. No seed phrases, no black box, no babysitting.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {betaActive ? (
              <Link to="/app" className="btn-primary text-sm">
                Launch app →
              </Link>
            ) : (
              <Link to="/app/create" className="btn-primary text-sm">
                Request private beta
              </Link>
            )}
            <Link to="/docs" className="btn-secondary text-sm">
              Read the schema
            </Link>
          </div>

          <div className="mt-16">
            <PipelineStrip />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-panel)]/60 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold gradient-text md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)]">
            flow: how_it_works
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold">
            From policy to execution
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Three layers define the system. You set the rules, agents propose, engines enforce.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.num} className="panel p-6 transition-all hover:border-[var(--accent-primary)]/30 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-panel-raised)] font-mono text-sm font-bold text-[var(--accent-primary)]">
                  {step.num}
                </span>
                <span className="rounded bg-[var(--accent-primary)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)]">
                  {step.tag}
                </span>
              </div>
              <h3 className="font-display mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Agentic trading section */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)]/40 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-secondary)]">
                operations: 24/7_autonomous
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold">
                Your vault never sleeps
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                Every vault gets a dedicated agent that manages multiple scoped addresses.
                Each address has a specific role — swap, lend, stake, oracle, fee — and
                executes within its bounds autonomously.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-secondary)]" />
                  <span className="text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Agent pipeline</strong> — Research, strategy, simulation, and execution agents coordinate autonomously
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-secondary)]" />
                  <span className="text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Role-scoped wallets</strong> — Each agent action uses a deterministic PDA for its purpose, auditable and verifiable
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-secondary)]" />
                  <span className="text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Constraint Engine</strong> — Leverage, concentration, and drawdown limits enforced on-chain before any execution
                  </span>
                </li>
              </ul>
            </div>
            <div className="panel-raised p-6">
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
                agent_architecture
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-4">
                  <p className="font-mono text-xs text-[var(--accent-primary)]">Research Agent</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Market analysis, opportunity scanning, risk assessment</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-4">
                  <p className="font-mono text-xs text-[var(--accent-primary)]">Strategy Agent</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Position sizing, portfolio rebalancing, execution routing</p>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-4">
                  <p className="font-mono text-xs text-[var(--accent-primary)]">Simulation Agent</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Monte Carlo simulation, backtesting, scenario analysis</p>
                </div>
                <div className="rounded-xl border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 p-4">
                  <p className="font-mono text-xs text-[var(--accent-secondary)]">Execution Agent</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Submits to Constraint Engine → Ika dWallet signing → settles on-chain.
                    Full audit trail, every cycle hashed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)]">
          constraints: vs_alternatives
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-panel-raised)] font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                <th className="px-5 py-4">Dimension</th>
                <th className="px-5 py-4">Typical AI vault</th>
                <th className="px-5 py-4">Krypton</th>
              </tr>
            </thead>
            <tbody>
              {DIFF_ROWS.map(([dim, typical, krypton]) => (
                <tr
                  key={dim}
                  className="border-b border-[var(--border)]/60 last:border-b-0 transition-colors hover:bg-[var(--bg-panel)]/50"
                >
                  <td className="px-5 py-4 font-medium">{dim}</td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">{typical}</td>
                  <td className="px-5 py-4 text-[var(--accent-secondary)]">{krypton}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)]/40 px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)]">
            integrations: ecosystem
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold">Built on Solana</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {INTEGRATIONS.map(({ name, tag }) => (
              <div
                key={name}
                className="panel flex items-center justify-between gap-2 px-4 py-3 transition-all hover:border-[var(--accent-primary)]/30 sm:flex-col sm:items-start sm:gap-1"
              >
                <span className="font-display text-sm font-semibold">{name}</span>
                <span className="rounded bg-[var(--accent-primary)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)]">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            ready: deploy
          </p>
          <h2 className="font-display mt-4 text-3xl font-semibold md:text-4xl">
            Verify the policy.
            <br />
            Not the strategy.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Your vault enforces a signed Capital Policy. No manager risk. No black box.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {betaActive ? (
              <Link to="/app" className="btn-primary text-sm">
                Launch app →
              </Link>
            ) : (
              <Link to="/app/create" className="btn-primary text-sm">
                Request private beta
              </Link>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  )
}