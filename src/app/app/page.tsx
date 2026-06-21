import Link from 'next/link'
import { DEMO_VAULTS, levelName } from '@/lib/mock-data'

function formatUsd(n: number) {
  return '$' + n.toLocaleString('en-US')
}

export default function VaultsPage() {
  const totalNav = DEMO_VAULTS.reduce((s, v) => s + v.nav, 0)
  const activeCount = DEMO_VAULTS.filter((v) => v.status === 'active').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label mb-1">capital</p>
          <h1 className="font-display text-2xl font-semibold text-text-primary">Your vaults</h1>
        </div>
        <Link
          href="/app/create"
          className="inline-flex items-center justify-center bg-accent text-white px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors rounded"
        >
          New vault →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="panel p-4 rounded-md border border-border bg-bg-panel">
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted">total_nav</p>
          <p className="font-display text-xl font-semibold text-text-primary mt-1 tabular-nums">{formatUsd(totalNav)}</p>
        </div>
        <div className="panel p-4 rounded-md border border-border bg-bg-panel">
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted">active</p>
          <p className="font-display text-xl font-semibold text-text-primary mt-1 tabular-nums">{activeCount}/{DEMO_VAULTS.length}</p>
        </div>
        <div className="panel p-4 rounded-md border border-border bg-bg-panel">
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted">checks/action</p>
          <p className="font-display text-xl font-semibold text-accent mt-1 tabular-nums">8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DEMO_VAULTS.map((vault) => {
          const ddPct = Math.min(100, (vault.constraints.drawdown.current / vault.constraints.drawdown.max) * 100)
          const ddColor = ddPct >= 90 ? 'bg-accent-risk' : ddPct >= 70 ? 'bg-amber-500' : 'bg-accent-positive'

          return (
            <Link
              key={vault.id}
              href={`/app/vault/${vault.id}`}
              className="panel block p-5 rounded-lg border border-border bg-bg-panel hover:border-accent/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-mono text-base text-text-primary group-hover:text-accent transition-colors">{vault.name}</h2>
                  <p className="font-mono text-sm text-accent mt-0.5 tabular-nums">{formatUsd(vault.nav)} NAV</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded ${
                    vault.status === 'active'
                      ? 'bg-accent-positive/10 text-accent-positive'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    ● {vault.status}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">drawdown</span>
                  <span className="font-mono text-[9px] text-text-muted">
                    {vault.constraints.drawdown.current}% / {vault.constraints.drawdown.max}%
                  </span>
                </div>
                <div className="h-1 rounded-sm bg-bg-panel-raised overflow-hidden">
                  <div className={`h-full rounded-sm ${ddColor}`} style={{ width: `${ddPct}%` }} />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[9px] text-text-muted">Policy v{vault.policyVersion}</span>
                <span className="font-mono text-[9px] text-text-muted">L{vault.level} — {levelName(vault.level)}</span>
                <span className="font-mono text-[9px] text-text-muted">{vault.executionMode}</span>
                {vault.governanceMode === 'dao_prediction_market' && (
                  <span className="font-mono text-[9px] text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded-sm">governance — coming soon</span>
                )}
                <span className="font-mono text-[9px] text-text-muted">{vault.privacyLevel}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
