'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Building2, ExternalLink, Plus, Zap } from 'lucide-react'

import {
  MetricCard,
  PrimaryCta,
  StatusPill,
} from '@/components/app/app-shell'
import { ConstraintPanel, vaultHealthScore } from '@/components/app/constraint-panel'
import { PageHeader } from '@/components/app/page-header'
import { SectionHeading } from '@/components/app/section-heading'
import { useVaultRegistry } from '@/contexts/vault-registry-context'
import { useSolPrice } from '@/hooks/use-sol-price'
import { formatUsd, formatSol, solToUsd, vaultDisplayName } from '@/lib/format-money'

function VaultIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-bg-base">
      <Zap className="h-5 w-5 text-accent" />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
      <Building2 className="mb-4 h-12 w-12 text-text-secondary/40" />
      <h3 className="font-[family-name:var(--font-hanken)] text-lg font-medium text-text-primary">
        No vaults yet
      </h3>
      <p className="mt-2 max-w-md text-center text-sm text-text-secondary">
        Create your first AI-managed vault — set policy, fund it, and chat with your agent.
      </p>
      <PrimaryCta href="/app/create" className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        New Vault
      </PrimaryCta>
    </div>
  )
}

export default function VaultsPage() {
  const { vaults, loading, ownerWallet } = useVaultRegistry()
  const { solPriceUsd } = useSolPrice()
  const hasWallet = Boolean(ownerWallet)

  const liveMetrics = useMemo(() => {
    if (!vaults.length) return null
    const totalSol = vaults.reduce((s, v) => s + v.balanceSol, 0)
    const totalUsd = solToUsd(totalSol, solPriceUsd)
    const avgHealth =
      vaults.reduce((s, v) => s + vaultHealthScore(v.constraint, v.paused), 0) / vaults.length
    return {
      tvl: formatUsd(totalUsd),
      tvlSol: formatSol(totalSol),
      count: String(vaults.length),
      health: vaults.some((v) => v.paused) ? 'Paused' : `${Math.round(avgHealth)}% avg`,
    }
  }, [vaults, solPriceUsd])

  if (!hasWallet) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-sm text-text-secondary lg:p-8">
        Connect your wallet to see vaults.
      </div>
    )
  }

  if (!loading && vaults.length === 0) {
    return (
      <div className="app-page stack-section">
        <PageHeader title="Your vaults" description="AI-managed capital with on-chain policy limits." />
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="app-page stack-section">
      <PageHeader
        title="Your vaults"
        description="Deploy capital, chat with your agent, and stay inside policy limits."
        actions={
          <>
            <input
              type="text"
              placeholder="Paste vault address…"
              className="input-field h-11 max-w-xs text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val) window.location.href = `/app/vault/${val}`
                }
              }}
            />
            <PrimaryCta href="/app/create">New Vault</PrimaryCta>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total (USD)" value={liveMetrics?.tvl ?? '—'} accent size="lg" />
        <MetricCard label="Total SOL" value={liveMetrics?.tvlSol ?? '—'} />
        <MetricCard label="Vaults" value={liveMetrics?.count ?? '0'} />
        <MetricCard label="Portfolio health" value={liveMetrics?.health ?? '—'} accent />
      </div>

      <section className="space-y-4">
        <SectionHeading title="Vaults" />
        <div className="space-y-3">
          {vaults.map((vault) => {
            const usd = solToUsd(vault.balanceSol, solPriceUsd)
            const health = vaultHealthScore(vault.constraint, vault.paused)
            const name = vaultDisplayName(vault.name, vault.address)
            return (
              <article key={vault.address} className="panel overflow-hidden">
                <Link
                  href={`/app/vault/${vault.address}`}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-bg-hover/30 sm:flex-row sm:items-center sm:justify-between sm:p-7"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <VaultIcon />
                    <div className="min-w-0">
                      <h3 className="section-title truncate">
                        {name}
                      </h3>
                      <p className="mt-1 font-mono text-sm text-text-muted">
                        {vault.address.slice(0, 8)}…{vault.address.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 sm:gap-12">
                    <div>
                      <p className="stat-label">Balance</p>
                      <p className="metric-value mt-1 text-accent">
                        {formatUsd(usd)}
                      </p>
                      <p className="mt-0.5 text-sm text-text-muted">{formatSol(vault.balanceSol)}</p>
                    </div>
                    <div>
                      <p className="stat-label">Health</p>
                      <StatusPill
                        label={vault.paused ? 'Paused' : `${health}%`}
                        variant={health >= 70 ? 'ok' : health >= 40 ? 'warn' : 'risk'}
                      />
                    </div>
                    <ExternalLink className="hidden h-4 w-4 text-text-muted sm:block" />
                  </div>
                </Link>
                {vault.constraint && (
                  <div className="border-t border-border px-4 pb-4 pt-2 sm:px-6">
                    <ConstraintPanel
                      constraint={vault.constraint}
                      paused={vault.paused}
                      compact
                    />
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
