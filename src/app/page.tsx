import Link from 'next/link'

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
          <Link
            href="/app"
            className="inline-flex items-center justify-center bg-accent text-white px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors rounded"
          >
            Open app →
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        {/* Subtle background accent */}
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
            Deploy a fund manager.
            <br />
            <span className="text-accent">Keep the keys.</span>
          </h1>

          <p className="mt-6 text-base leading-relaxed text-text-secondary lg:text-lg max-w-xl mx-auto">
            A non-custodial policy engine for Solana. Define execution rules
            on-chain — every trade, transfer, and rebalance passes through your
            constraints before it lands.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/app"
              className="inline-flex items-center justify-center bg-accent text-white px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors rounded-md shadow-[0_0_20px_rgba(153,69,255,0.15)]"
            >
              Deploy your first vault →
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center border border-border bg-bg-panel px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors rounded-md"
            >
              Read the policy spec
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex items-center justify-center gap-6 text-text-muted">
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-text-primary tabular-nums">8</p>
              <p className="font-mono text-[9px] uppercase tracking-wider mt-1">constraint checks/action</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-text-primary tabular-nums">0</p>
              <p className="font-mono text-[9px] uppercase tracking-wider mt-1">custodial risk</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-text-primary tabular-nums">2x</p>
              <p className="font-mono text-[9px] uppercase tracking-wider mt-1">max leverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="label mb-3">how_it_works</p>
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-3xl">
            Set terms. Policy enforces. Agent executes.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: '01',
                title: 'Describe your goal',
                desc: '"Grow slowly and safely." "I want collateral I can borrow against." "Compound for ten years." Plain language in.',
              },
              {
                num: '02',
                title: 'Review the policy',
                desc: 'Krypton compiles your intent into a structured policy — risk limits, asset universe, drawdown tolerance — shown back in plain English.',
              },
              {
                num: '03',
                title: 'Deploy and deposit',
                desc: 'One signature creates your vault. A second funds it. Your policy is the law.',
              },
              {
                num: '04',
                title: 'Agent executes, chain enforces',
                desc: 'A multi-agent pipeline proposes every cycle. The model recommends. The on-chain constraint engine disposes.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="panel p-5 rounded-lg border border-border bg-bg-panel hover:border-accent/30 transition-colors"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent">{step.num}</span>
                <h3 className="font-display text-sm font-semibold text-text-primary mt-3">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="label mb-3">use_cases</p>
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-3xl">
            Every capital objective. One policy engine.
          </h2>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'The saver', desc: 'Park capital with a strict drawdown ceiling and lending-only universe. No swaps, no leverage, no surprises.' },
              { title: 'The compounder', desc: 'Set a long horizon and a yield target. Agent rotates between staking, lending, and stable yield inside your limits.' },
              { title: 'The DAO treasury', desc: 'Policy changes decided by conditional markets pricing the proposal\'s expected effect on your token.' },
              { title: 'The allocator', desc: 'Aggressive target with a hard stop. Krypton warns if they don\'t mathematically fit — and defaults to reviewing every trade.' },
              { title: 'The collateral holder', desc: 'Deposit an asset to simply hold it, fully on-chain, as collateral for something else. No strategy running at all.' },
            ].map((uc) => (
              <div key={uc.title} className="panel p-4 rounded-md border border-border bg-bg-panel">
                <h3 className="font-display text-sm font-semibold text-text-primary">{uc.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-text-primary lg:text-4xl">
            Stop trusting a strategy.
            <br />
            Start enforcing a policy.
          </h2>
          <p className="mt-4 text-sm text-text-secondary">
            No seed phrase. No custodian. No black box.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/app"
              className="inline-flex items-center justify-center bg-accent text-white px-6 py-3 font-mono text-xs font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors rounded-md shadow-[0_0_20px_rgba(153,69,255,0.15)]"
            >
              Deploy your first vault →
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
