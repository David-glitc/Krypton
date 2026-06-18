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
    title: 'Describe your goal',
    desc: '"Grow this slowly and safely." "I want collateral I can borrow against." "Compound this for ten years." Plain language in, every time.',
    tag: 'intent',
  },
  {
    num: '02',
    title: 'Review the policy, not a black box',
    desc: 'Krypton compiles your intent into a structured policy — risk limits, asset universe, drawdown tolerance — and shows it back in plain English before you ever sign.',
    tag: 'policy',
  },
  {
    num: '03',
    title: 'Deploy and deposit',
    desc: 'One signature creates your vault. A second funds it. From here, your policy — not a person, not a black-box bot — is what every future action answers to.',
    tag: 'deploy',
  },
  {
    num: '04',
    title: 'The agent executes, the contract enforces',
    desc: 'A multi-agent pipeline researches, proposes, simulates, and either executes or discards every cycle. The model\'s judgment is a recommendation. Your policy\'s limits are the law.',
    tag: 'execute',
  },
] as const

const DIFF_ROWS = [
  ['Strategy', 'Fixed or opaque', 'Ephemeral, regenerated each cycle'],
  ['Execution', 'Agent-held keys', 'Policy-gated MPC (Ika dWallet)'],
  ['Enforcement', 'Model judgment', 'On-chain Constraint Engine'],
  ['Auditability', 'Trust the operator', 'Every cycle hashed and logged'],
  ['Ops', '9-5 oversight', '24/7 autonomous within bounds'],
] as const

const VALUE_PROPS = [
  {
    title: 'Policy-enforced, not promise-enforced',
    desc: 'Leverage, drawdown, and asset limits are checked on-chain at every single execution — not just claimed in a pitch deck.',
  },
  {
    title: 'Non-custodial, end to end',
    desc: 'From the passkey that logs you in to the cross-chain signature that settles a trade, no private key ever sits with a person or a server.',
  },
  {
    title: 'Goal-based, not APY-based',
    desc: 'Tell Krypton what you\'re trying to achieve. The agent optimizes toward that goal inside the boundaries you set — it doesn\'t chase headline yield.',
  },
  {
    title: 'Auditable by construction',
    desc: 'Every proposed action — executed or rejected — is hashed and logged. The trail replaces "trust us" with "check for yourself."',
  },
  {
    title: 'Governed by markets, not apathy',
    desc: 'DAO-mode vaults amend policy through futarchy — conditional markets price the proposal itself — instead of a low-turnout token vote.',
  },
] as const

const USE_CASES = [
  {
    title: 'The saver',
    desc: 'Park capital with a strict drawdown ceiling and a lending-only universe. No swaps, no leverage, no surprises.',
  },
  {
    title: 'The compounder',
    desc: 'Set a long horizon and a yield target. Let the agent rotate between staking, lending, and stable yield as conditions change — inside limits you set once.',
  },
  {
    title: 'The builder with a treasury',
    desc: 'Stand up a DAO vault where policy changes are decided by a market pricing the proposal\'s actual expected effect on your token.',
  },
  {
    title: 'The high-conviction allocator',
    desc: 'Set an aggressive target and a hard stop. Krypton will tell you plainly if the two don\'t mathematically fit together — and default you to reviewing every trade.',
  },
  {
    title: 'The collateral holder',
    desc: 'Deposit an asset to simply hold it, fully on-chain, as collateral for something else — no strategy running at all, by design.',
  },
] as const

function LandingPage() {
  const betaActive = isPrivateBetaActive()

  return (
    <PageShell>
      {/* §1 — Hero */}
      <section className="border-b border-[var(--border)] px-6 pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 border border-[var(--accent-policy)] bg-[var(--accent-policy)]/5 px-3 py-1">
            <span className="status-dot status-dot--active" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-policy)]">
              Private beta — devnet
            </span>
          </div>

          <h1 className="font-display mt-6 max-w-5xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Deploy a fund manager.<br />Keep the keys.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            Describe what you want your capital to do. Krypton compiles it into an enforced, on-chain policy — and a non-custodial agent executes it, with no one, anywhere, ever holding your keys.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {betaActive ? (
              <Link to="/app" className="btn-primary text-xs">
                Deploy your first vault →
              </Link>
            ) : (
              <Link to="/app/create" className="btn-primary text-xs">
                Deploy your first vault →
              </Link>
            )}
            <Link to="/docs" className="btn-secondary text-xs">
              Read the policy spec
            </Link>
          </div>

          <div className="mt-12">
            <PipelineStrip />
          </div>
        </div>
      </section>

      {/* §2 — The Shift */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="policy-label">objective:</p>
              <h2 className="font-display mt-3 text-2xl font-semibold md:text-3xl">
                Vaults today are a black box or a straitjacket.
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              <p>
                A hard-coded strategy can't adapt. An off-chain bot you "trust" can't be audited. And every position, every rebalance, every signature is either fully public for the world to copy — or fully custodied by someone else.
              </p>
              <p>
                Krypton replaces "trust the operator" with "verify the policy." You write down what you want capital to do — in plain language. The policy becomes the enforced object. The strategy underneath it is disposable, regenerated, simulated, and logged every single cycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* §3 — How It Works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div>
          <p className="policy-label">policy:</p>
          <h2 className="font-display mt-3 text-2xl font-semibold">
            You set the terms. The policy enforces them.
            <br />
            The agent executes inside them.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.num} className="panel p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-[var(--border)] bg-[var(--bg-panel-raised)] font-mono text-xs font-bold text-[var(--accent-policy)]">
                  {step.num}
                </span>
                <span className="rounded-sm bg-[var(--accent-policy)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-policy)]">
                  {step.tag}
                </span>
              </div>
              <h3 className="font-display mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Agent pipeline */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="policy-label">operations: 24/7_autonomous</p>
              <h2 className="font-display mt-3 text-2xl font-semibold">
                Your vault never sleeps
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                Every vault gets a dedicated multi-agent pipeline that researches, proposes, simulates, and either executes or discards a strategy every cycle. The model's judgment is a recommendation — your policy's limits, checked on-chain, are the actual law.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 status-dot status-dot--safe" />
                  <span className="text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Agent pipeline</strong> — Research, strategy, simulation, and execution agents coordinate autonomously
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 status-dot status-dot--safe" />
                  <span className="text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Role-scoped wallets</strong> — Each agent action uses a deterministic PDA for its purpose, auditable and verifiable
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 status-dot status-dot--safe" />
                  <span className="text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Constraint Engine</strong> — Leverage, concentration, and drawdown limits enforced on-chain before any execution
                  </span>
                </li>
              </ul>
            </div>
            <div className="panel p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                agent_architecture
              </p>
              <div className="mt-4 space-y-2">
                <div className="border border-[var(--border)] bg-[var(--bg-panel)] p-3">
                  <p className="font-mono text-xs text-[var(--accent-policy)]">Research Agent</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Market analysis, opportunity scanning, risk assessment</p>
                </div>
                <div className="border border-[var(--border)] bg-[var(--bg-panel)] p-3">
                  <p className="font-mono text-xs text-[var(--accent-policy)]">Strategy Agent</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Position sizing, portfolio rebalancing, execution routing</p>
                </div>
                <div className="border border-[var(--border)] bg-[var(--bg-panel)] p-3">
                  <p className="font-mono text-xs text-[var(--accent-policy)]">Simulation Agent</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">Monte Carlo simulation, backtesting, scenario analysis</p>
                </div>
                <div className="border border-[var(--accent-policy)]/30 bg-[var(--accent-policy)]/5 p-3">
                  <p className="font-mono text-xs text-[var(--accent-privacy)]">Execution Agent</p>
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

      {/* §4 — Value Propositions */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="policy-label">guarantees:</p>
        <h2 className="font-display mt-3 text-2xl font-semibold">
          What Krypton guarantees — and what it doesn't pretend to.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="panel p-4">
              <h3 className="font-display text-base font-semibold">{prop.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {prop.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* §5 — Use Cases */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="policy-label">universe:</p>
          <h2 className="font-display mt-3 text-2xl font-semibold">
            One policy engine. Every capital objective.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="panel p-4">
                <h3 className="font-display text-base font-semibold">{uc.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {uc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §6 — Why Now */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="policy-label">time_horizon:</p>
            <h2 className="font-display mt-3 text-2xl font-semibold md:text-3xl">
              Agentic execution stopped being a novelty. The guardrails didn't keep up.
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Autonomous agents now move real volume on-chain — and the tooling to let them sign, swap, lend, and stake without a human in the loop has matured fast. What hasn't matured at the same pace is the enforcement layer underneath them.
            </p>
            <p>
              Most "AI vaults" today are a chat interface wrapped around a wallet, with no independent check on what the model decides to do. Krypton starts from the opposite assumption: the model proposes, the chain disposes.
            </p>
          </div>
        </div>
      </section>

      {/* Differentiation table */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="policy-label">constraints: vs_alternatives</p>
          <div className="mt-6 overflow-x-auto border border-[var(--border)]">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-panel-raised)] font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="px-4 py-3">Dimension</th>
                  <th className="px-4 py-3">Typical AI vault</th>
                  <th className="px-4 py-3">Krypton</th>
                </tr>
              </thead>
              <tbody>
                {DIFF_ROWS.map(([dim, typical, krypton]) => (
                  <tr key={dim} className="border-b border-[var(--border)]/60 last:border-b-0">
                    <td className="px-4 py-3 font-medium">{dim}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{typical}</td>
                    <td className="px-4 py-3 text-[var(--accent-privacy)]">{krypton}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* §7 — Trust / Security */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="policy-label">constraint_engine:</p>
            <h2 className="font-display mt-3 text-2xl font-semibold md:text-3xl">
              The agent can suggest anything. It can only execute what your policy allows.
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            <p>
              Every action — whether proposed by the agent or approved by you — passes through the same on-chain check, regardless of how much autonomy you've granted. Leverage caps, position limits, drawdown thresholds, and an approved asset list are enforced by the contract itself, not by the good behavior of a model.
            </p>
            <p>
              Cross-chain actions are signed through Ika's threshold network — your vault's signing authority is split across a decentralized network of parties, with no single party, including Krypton, ever able to sign alone.
            </p>
            <div className="border border-[var(--border)] bg-[var(--bg-panel)] p-3">
              <p className="font-mono text-xs text-[var(--text-muted)]">word_choice_note</p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                Say <span className="text-[var(--accent-policy)]">non-custodial</span>, <span className="text-[var(--accent-policy)]">policy-enforced</span>, <span className="text-[var(--accent-policy)]">on-chain constraint checks</span>, and <span className="text-[var(--accent-policy)]">threshold signing</span> — not <span className="text-[var(--text-muted)] line-through">encrypted</span>, <span className="text-[var(--text-muted)] line-through">confidential</span>, or <span className="text-[var(--text-muted)] line-through">private by default</span>. The trust claim: "no one holds your keys." Not yet: "no one can see your positions."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="policy-label">integrations: ecosystem</p>
          <h2 className="font-display mt-3 text-2xl font-semibold">Built on Solana</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {INTEGRATIONS.map(({ name, tag }) => (
              <div
                key={name}
                className="panel flex items-center justify-between gap-2 px-3 py-2 sm:flex-col sm:items-start sm:gap-1"
              >
                <span className="font-display text-sm font-semibold">{name}</span>
                <span className="rounded-sm bg-[var(--accent-policy)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-policy)]">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* §8 — Final CTA */}
      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold md:text-4xl">
            Stop trusting a strategy.<br />Start enforcing a policy.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Describe your goal. Review the policy. Deploy the vault. Krypton handles the rest — inside limits only you control.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {betaActive ? (
              <Link to="/app" className="btn-primary text-xs">
                Deploy your first vault →
              </Link>
            ) : (
              <Link to="/app/create" className="btn-primary text-xs">
                Deploy your first vault →
              </Link>
            )}
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">
            No seed phrase. No custodian. No black box.
          </p>
        </div>
      </section>

      {/* §9 — Footer tagline */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-panel)] px-6 py-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--text-muted)]">
            The policy is the product.
          </p>
        </div>
      </section>
    </PageShell>
  )
}
