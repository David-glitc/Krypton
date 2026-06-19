import { createFileRoute, Link } from '@tanstack/react-router'
import { PolicyBlock } from '@krypton/ui'
import { PageShell } from './__root'

export const Route = createFileRoute('/docs')({
  component: DocsPage,
})

function DocsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-display text-4xl font-semibold">Policy schema reference</h1>
        <p className="mt-4 text-[var(--text-secondary)]">
          Canonical Capital Policy fields stored off-chain (Arweave) with hash anchored on-chain in{' '}
          <code className="font-mono text-[var(--accent)]">PolicyAccount</code>.
        </p>

        <div className="mt-10 space-y-6">
          <PolicyBlock
            fields={{
              policy_version: '1',
              objective: 'maximize_risk_adjusted_return',
              risk_profile: 'low | medium | high | custom',
              max_drawdown_pct: '1–50',
              max_leverage: '≤ 2.0 (protocol cap)',
              execution_mode: 'advisory | constrained_auto | full_auto',
              governance_mode: 'owner | dao_prediction_market',
            }}
          />

          <div className="panel p-6">
            <h2 className="font-display text-xl font-medium">Permission levels</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">Level 2 (beta default):</strong>{' '}
                pipeline runs; owner signs each execution
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Level 3:</strong> constrained
                auto-execute when on-chain checks pass
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Level 4:</strong> same contract path
                as L3; UX-only distinction (disabled in private beta)
              </li>
            </ul>
          </div>

          <div className="panel p-6">
            <h2 className="font-display text-xl font-medium">Constraint Engine checks</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              All enforced at <code className="font-mono">execute_action</code> — leverage,
              concentration, correlated exposure, drawdown, protocol/asset whitelist, liquidity
              floor, oracle staleness.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link to="/app/create" className="btn-primary">
            Open policy builder
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
