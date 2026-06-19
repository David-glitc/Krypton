import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useKryptonAuth } from '~/lib/AuthProvider'
import { fetchVaults } from '~/lib/vault-data'
import { DEMO_VAULTS } from '~/lib/mock-data'
import { VaultCard } from '~/components/VaultCard'
import type { VaultSummary } from '@krypton/sdk'

export const Route = createFileRoute('/app/')({
  component: VaultListPage,
})

function VaultListPage() {
  const { primaryAddress } = useKryptonAuth()
  const [vaults, setVaults] = useState<VaultSummary[]>(DEMO_VAULTS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!primaryAddress) {
      setVaults(DEMO_VAULTS)
      return
    }
    setLoading(true)
    fetchVaults(primaryAddress)
      .then((result) => {
        if (result.length > 0) setVaults(result)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [primaryAddress])

  const totalNav = vaults.reduce((sum, v) => sum + v.navUsd, 0)
  const activeVaults = vaults.filter((v) => !v.constraint.paused).length

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
            capital: your_vaults
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold">Vaults</h1>
        </div>
        <Link to="/app/create" className="btn-primary text-xs">
          New vault
        </Link>
      </div>

      {loading && (
        <p className="mt-4 font-mono text-xs text-[var(--text-muted)]">Loading vaults…</p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="panel p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">total_nav</p>
          <p className="mt-1 font-display text-xl font-semibold">${totalNav.toLocaleString()}</p>
        </div>
        <div className="panel p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">active_vaults</p>
          <p className="mt-1 font-display text-xl font-semibold">{activeVaults}/{vaults.length}</p>
        </div>
        <div className="panel p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]">constraint_checks</p>
          <p className="mt-1 font-display text-xl font-semibold">8<span className="text-sm text-[var(--text-muted)]">/action</span></p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {vaults.map((vault) => (
          <VaultCard key={vault.id} vault={vault} />
        ))}
      </div>

      <div className="mt-10 panel p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          quick_actions
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/app/create" className="btn-secondary text-xs">
            Create new vault
          </Link>
          <Link to="/docs" className="btn-ghost text-xs">
            View policy schema
          </Link>
        </div>
      </div>
    </div>
  )
}
