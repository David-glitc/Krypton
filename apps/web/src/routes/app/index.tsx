import { createFileRoute, Link } from '@tanstack/react-router'
import { PolicyBlock } from '@krypton/ui'
import { DEMO_VAULTS } from '~/lib/mock-data'

export const Route = createFileRoute('/app/')({
  component: VaultListPage,
})

function VaultListPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">
            capital: your_vaults
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold">Vaults</h1>
        </div>
        <Link to="/app/create" className="btn-primary">
          New vault
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {DEMO_VAULTS.map((vault) => (
          <Link
            key={vault.id}
            to="/app/vault/$id"
            params={{ id: vault.id }}
            className="panel block p-5 transition hover:bg-[var(--bg-panel-raised)]"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-mono text-lg text-[var(--text-primary)]">{vault.name}</h2>
              <span className="font-mono text-xs text-[var(--text-secondary)]">
                L{vault.permissionLevel}
              </span>
            </div>
            <p className="mt-2 font-mono text-sm text-[var(--accent-policy)]">
              ${vault.navUsd.toLocaleString()} NAV
            </p>
            <div className="mt-4">
              <PolicyBlock
                fields={{
                  drawdown: `${(vault.constraint.currentDrawdownBps / 100).toFixed(1)}% / ${(vault.constraint.maxDrawdownBps / 100).toFixed(0)}%`,
                  leverage: `${(vault.constraint.currentLeverageBps / 10000).toFixed(2)}x / ${(vault.constraint.maxLeverageBps / 10000).toFixed(1)}x`,
                  policy_version: vault.policyVersion,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
