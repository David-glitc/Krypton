export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-10">
        <div className="flex items-center gap-2.5">
          {/* Krypton hexagon SVG */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Krypton logo"
          >
            <path
              d="M12 2L3 7v10l9 5 9-5V7L12 2z"
              stroke="var(--accent)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M12 2L3 7l9 5 9-5-9-5z"
              fill="var(--accent-muted)"
            />
          </svg>
          <span className="font-display text-sm font-semibold tracking-wide text-text-primary">
            Krypton
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
        >
          Connect wallet
        </button>
      </header>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center lg:py-32">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-text-primary lg:text-5xl">
            Deploy a fund manager.
            <br />
            Keep the keys.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-text-secondary lg:text-lg">
            A non-custodial policy engine for Solana. Define execution rules
            on-chain — every trade, transfer, and rebalance passes through your
            constraints before it lands.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="inline-flex items-center justify-center bg-accent text-white px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors"
            >
              Connect wallet →
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center border border-border bg-bg-panel px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
            >
              Read the policy spec
            </button>
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
            Use cases
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-text-primary lg:text-3xl">
            One engine. Every capital strategy.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "The saver",
                description:
                  "Auto-harvest yield into a stablecoin vault. Set a floor, set a cap, walk away.",
              },
              {
                title: "The compounder",
                description:
                  "Rebalance across LSTs on a schedule. Enforce slippage limits and max gas per epoch.",
              },
              {
                title: "The DAO treasury",
                description:
                  "Multi-sig policy with spending caps, whitelisted destinations, and time-locked proposals.",
              },
              {
                title: "The allocator",
                description:
                  "Maintain target weights across DeFi protocols. Rebalance only when drift exceeds threshold.",
              },
              {
                title: "The collateral holder",
                description:
                  "Protect a lending position with automated top-ups and liquidation buffers.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="border border-border bg-bg-panel p-6"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-text-primary">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-border px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
            How it works
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-text-primary lg:text-3xl">
            Four steps. No custody.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Describe",
                description:
                  "Write your policy in the constraint language — asset limits, time windows, oracle guards.",
              },
              {
                step: "02",
                title: "Review",
                description:
                  "Simulate every branch on a forked state. See exactly what the engine will and won't allow.",
              },
              {
                step: "03",
                title: "Deploy",
                description:
                  "Ship the policy to Solana as a lightweight program. It lives in your wallet — not ours.",
              },
              {
                step: "04",
                title: "Execute",
                description:
                  "Submit intents. The policy engine validates each one against your rules before it touches the chain.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border border-border bg-bg-panel p-6"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-text-primary lg:text-4xl">
            Stop trusting a strategy.
            <br />
            Start enforcing a policy.
          </h2>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="inline-flex items-center justify-center bg-accent text-white px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors"
            >
              Connect wallet →
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center border border-border bg-bg-panel px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
            >
              Read the policy spec
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-border px-6 py-6 lg:px-10">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">
          © 2026 Krypton — The policy is the product.
        </p>
      </footer>
    </div>
  );
}
