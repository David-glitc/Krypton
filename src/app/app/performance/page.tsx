'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, LineChart, Loader2 } from 'lucide-react'

import { MetricCard, StatusPill } from '@/components/app/app-shell'
import { PageHeader } from '@/components/app/page-header'
import { SectionHeading } from '@/components/app/section-heading'
import { useVaultRegistry } from '@/contexts/vault-registry-context'
import { vaultDisplayName } from '@/lib/format-money'

type VaultPerformanceRow = {
  vaultPubkey: string
  name: string | null
  completedRuns: number
  failedRuns: number
  pendingApprovals: number
  lastRunAt: number | null
  lastRunStatus: string | null
  avgCycleDurationMs: number | null
}

type PerformanceResponse = {
  vaults: VaultPerformanceRow[]
  totals: {
    completedRuns: number
    failedRuns: number
    pendingApprovals: number
  }
}

function formatDuration(ms: number | null): string {
  if (ms == null || !Number.isFinite(ms)) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`
  return `${(ms / 60_000).toFixed(1)} min`
}

function formatWhen(ts: number | null): string {
  if (!ts) return 'Never'
  const d = new Date(ts)
  const diff = Date.now() - ts
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function successRate(completed: number, failed: number): string {
  const total = completed + failed
  if (total === 0) return '—'
  return `${Math.round((completed / total) * 100)}%`
}

export default function PerformancePage() {
  const { ownerWallet, vaults: registryVaults, loading: registryLoading } = useVaultRegistry()
  const [data, setData] = useState<PerformanceResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ownerWallet) {
      setData(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/vaults/performance?ownerWallet=${encodeURIComponent(ownerWallet)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error ?? 'Failed to load')
        return res.json() as Promise<PerformanceResponse>
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load performance')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [ownerWallet])

  const rows = useMemo(() => {
    if (!data?.vaults.length) return []
    return [...data.vaults].sort((a, b) => {
      const aTotal = a.completedRuns + a.failedRuns
      const bTotal = b.completedRuns + b.failedRuns
      return bTotal - aTotal
    })
  }, [data])

  const totals = data?.totals ?? { completedRuns: 0, failedRuns: 0, pendingApprovals: 0 }
  const withDuration = rows.filter((r) => r.avgCycleDurationMs != null)
  const avgDuration = withDuration.length
    ? withDuration.reduce((s, r) => s + (r.avgCycleDurationMs ?? 0), 0) / withDuration.length
    : null

  if (!ownerWallet) {
    return (
      <div className="app-page">
        <PageHeader title="Performance" description="Agent run history and cycle health across your vaults." />
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-text-secondary">
          Connect your wallet to view performance.
        </div>
      </div>
    )
  }

  return (
    <div className="app-page stack-section">
      <PageHeader
        title="Performance"
        description="Agent cycles, success rates, and approval backlog across your portfolio."
      />

      {loading || registryLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading performance…
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 rounded-lg border border-accent-risk/30 bg-accent-risk-muted/20 p-4 text-sm text-accent-risk">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : registryVaults.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-text-secondary">
          No vaults yet.{' '}
          <Link href="/app/create" className="text-accent hover:underline">
            Create one
          </Link>{' '}
          to start tracking agent performance.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Completed runs" value={String(totals.completedRuns)} accent size="lg" />
            <MetricCard label="Failed runs" value={String(totals.failedRuns)} />
            <MetricCard
              label="Success rate"
              value={successRate(totals.completedRuns, totals.failedRuns)}
              accent
            />
            <MetricCard label="Pending approvals" value={String(totals.pendingApprovals)} />
            <MetricCard label="Avg cycle time" value={formatDuration(avgDuration)} />
          </div>

          <section className="space-y-4">
            <SectionHeading title="By vault" />
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vault</th>
                    <th>Completed</th>
                    <th>Failed</th>
                    <th>Success</th>
                    <th>Pending</th>
                    <th>Avg cycle</th>
                    <th>Last run</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const name = vaultDisplayName(row.name, row.vaultPubkey)
                    const rate = successRate(row.completedRuns, row.failedRuns)
                    return (
                      <tr key={row.vaultPubkey}>
                        <td>
                          <Link
                            href={`/app/vault/${row.vaultPubkey}`}
                            className="text-base font-medium text-text-primary hover:text-accent"
                          >
                            {name}
                          </Link>
                          <p className="mt-0.5 font-[family-name:var(--font-jetbrains)] text-xs text-text-muted">
                            {row.vaultPubkey.slice(0, 6)}…{row.vaultPubkey.slice(-4)}
                          </p>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1.5 text-text-primary">
                            <CheckCircle2 className="h-4 w-4 text-green-500/80" />
                            {row.completedRuns}
                          </span>
                        </td>
                        <td className="text-text-secondary">{row.failedRuns}</td>
                        <td className="metric-value text-base text-accent">{rate}</td>
                        <td>
                          {row.pendingApprovals > 0 ? (
                            <StatusPill label={`${row.pendingApprovals} waiting`} variant="warn" />
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </td>
                        <td className="font-[family-name:var(--font-jetbrains)] text-text-secondary">
                          {formatDuration(row.avgCycleDurationMs)}
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1.5 text-text-secondary">
                            <Clock className="h-4 w-4" />
                            {formatWhen(row.lastRunAt)}
                          </span>
                          {row.lastRunStatus && (
                            <p className="stat-label mt-1">{row.lastRunStatus}</p>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {totals.pendingApprovals > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent-muted/20 p-4">
              <LineChart className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {totals.pendingApprovals} action{totals.pendingApprovals === 1 ? '' : 's'} awaiting approval
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Agents stay idle until you approve. Open a vault to review proposed moves.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
