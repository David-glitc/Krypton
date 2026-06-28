'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { DynamicContext } from '@dynamic-labs/sdk-react-core'
import { Building2, ExternalLink, Plus, Zap } from 'lucide-react'
import {
  MetricCard,
  PrimaryCta,
  StatusPill,
} from '@/components/app/app-shell'
import { SectionHeading } from '@/components/app/section-heading'
import {
  CONSTRAINT_MONITOR,
  GLOBAL_METRICS,
} from '@/lib/vault-demo-data'

type VaultResponse = {
  registry: { vault_pubkey: string; name: string | null } | null
  onChain: {
    address: string
    owner: string
    bump: number
    nonce: number
    policyVersion: number
    paused: boolean
  } | null
  cycleStatus: { activeJob: { status: string } | null } | null
}

function VaultIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center border border-border bg-bg-base">
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
        Create your first AI-managed vault constrained by on-chain policy.
      </p>
      <PrimaryCta href="/app/create" className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        New Vault
      </PrimaryCta>
    </div>
  )
}

export default function VaultsPage() {
  const dynamicContext = useContext(DynamicContext)
  const ownerWallet = dynamicContext?.primaryWallet?.address
  const hasWallet = Boolean(ownerWallet)
  const [liveVaults, setLiveVaults] = useState<VaultResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasWallet) return

    const controller = new AbortController()
    fetch(`/api/vaults?ownerWallet=${encodeURIComponent(ownerWallet!)}`, { signal: controller.signal, cache: 'no-store' })
      .then(async (res) => {
        const json = (await res.json()) as { vaults?: VaultResponse[] }
        if (!controller.signal.aborted) setLiveVaults(json.vaults ?? [])
      })
      .catch(() => {
        if (!controller.signal.aborted) setLiveVaults([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => { controller.abort() }
  }, [hasWallet, ownerWallet])

  const liveMetrics = useMemo(() => {
    if (!liveVaults.length) return null

    const totalNav = 0 // would read from on-chain data
    return {
      tvl: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalNav),
      avgApy: 'Pending',
      activeConstraints: String(liveVaults.length * 3),
      uptime: liveVaults.some((v) => v.onChain?.paused) ? 'Paused' : 'Healthy',
    }
  }, [liveVaults])

  const vaultPubkey = (v: VaultResponse): string =>
    v.onChain?.address ?? v.registry?.vault_pubkey ?? ''

  const vaultName = (v: VaultResponse): string =>
    v.registry?.name ?? (v.onChain?.address?.slice(0, 8) ?? 'Unknown') + '…'

  const vaultPolicyVersion = (v: VaultResponse): number =>
    v.onChain?.policyVersion ?? 0

  const vaultPaused = (v: VaultResponse): boolean =>
    v.onChain?.paused ?? false

  const vaultStatus = (v: VaultResponse): string =>
    v.cycleStatus?.activeJob?.status?.toUpperCase() ?? 'REGISTERED'

  if (!loading && liveVaults.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 md:space-y-12 lg:p-8">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h1 className="font-[family-name:var(--font-hanken)] text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-7xl">
              Your vaults
            </h1>
            <p className="mt-3 text-base leading-relaxed text-text-secondary sm:text-lg">
              AI-managed vaults constrained by on-chain policy.
            </p>
          </div>
          <input
            type="text"
            placeholder="Paste vault address…"
            className="input-field h-12 text-xs font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim()
                if (val) window.location.href = `/app/vault/${val}`
              }
            }}
          />
        </div>
        <EmptyState />
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="panel p-4 sm:p-6 lg:p-8">
            <h3 className="font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary sm:text-xl">
              Neural Constraint Monitor
            </h3>
            <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
              {CONSTRAINT_MONITOR.map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:pb-4">
                  <div className="min-w-0">
                    <p className="text-sm text-text-primary">{row.label}</p>
                    <p className="mt-1 font-[family-name:var(--font-jetbrains)] text-xs text-text-secondary">
                      {row.value}
                    </p>
                  </div>
                  <span className="shrink-0 font-[family-name:var(--font-jetbrains)] text-[12px] uppercase text-accent sm:text-[13px]">
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-4 sm:p-6 lg:p-8">
            <h3 className="font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary sm:text-xl">
              Strategy Evolution
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:mt-4">
              The AI is currently suggesting a shift towards Jito-MEV strategies based on the last 4 hours of network congestion data.
            </p>
            <Link
              href="/app/create"
              className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-[12px] uppercase tracking-wide text-accent hover:text-accent-hover sm:mt-6 sm:text-[13px]"
            >
              View Proposed Update
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 md:space-y-12 lg:p-8">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h1 className="font-[family-name:var(--font-hanken)] text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-7xl">
            Your vaults
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-secondary sm:text-lg">
            AI-managed vaults constrained by on-chain policy. Create a vault,
            deploy capital, and let the agent pipeline handle the rest.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Paste vault address…"
            className="input-field h-12 text-xs font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim()
                if (val) window.location.href = `/app/vault/${val}`
              }
            }}
          />
          <PrimaryCta href="/app/create">New Vault</PrimaryCta>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Value Locked" value={liveMetrics?.tvl ?? GLOBAL_METRICS.tvl} accent />
        <MetricCard label="Avg. APY" value={liveMetrics?.avgApy ?? GLOBAL_METRICS.avgApy} accent />
        <MetricCard label="Active Constraints" value={liveMetrics?.activeConstraints ?? GLOBAL_METRICS.activeConstraints} />
        <MetricCard label="Uptime / Health" value={liveMetrics?.uptime ?? GLOBAL_METRICS.uptime} accent />
      </div>

      <section className="space-y-4 sm:space-y-6">
        <SectionHeading title="Active Deployments" />

        <div className="space-y-4">
          {liveVaults.map((vault) => {
            const id = vaultPubkey(vault)
            return (
              <article key={id} className="panel relative overflow-hidden p-0 sm:p-0">
                <Link href={`/app/vault/${id}`} className="block p-4 transition-colors hover:bg-bg-panel/50 sm:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:gap-6">
                    <div className="flex gap-3 sm:gap-4">
                      <VaultIcon />
                      <div className="min-w-0">
                        <h3 className="truncate font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary sm:text-xl">
                          {vaultName(vault)}
                        </h3>
                        <p className="mt-0.5 font-[family-name:var(--font-jetbrains)] text-[12px] tracking-wide text-text-secondary sm:text-[13px]">
                          {id.slice(0, 8)}…{id.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
                      {[
                        { label: 'TVL', value: '—', accent: false },
                        { label: 'Net APY', value: '—', accent: true },
                        {
                          label: 'Risk Level',
                          value: vaultPaused(vault) ? 'Paused' : 'Live',
                          accent: false,
                          risk: vaultPaused(vault),
                        },
                        { label: 'Status', value: vaultStatus(vault), accent: true },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wide text-[#a9e2ef] sm:text-[13px]">
                            {stat.label}
                          </p>
                          <p
                            className={`mt-0.5 font-[family-name:var(--font-jetbrains)] text-base sm:text-lg ${
                              stat.risk
                                ? 'text-accent-risk'
                                : stat.accent
                                  ? 'text-accent'
                                  : 'text-text-primary'
                            }`}
                          >
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-4 sm:mt-6 sm:gap-3 sm:pt-6">
                    <StatusPill label={`Policy v${vaultPolicyVersion(vault)}`} />
                    {vaultPaused(vault)
                      ? <StatusPill label="Constraint Pause Active" />
                      : <StatusPill label="Constraint Engine Ready" />
                    }
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4 sm:p-6 lg:p-8">
          <h3 className="font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary sm:text-xl">
            Neural Constraint Monitor
          </h3>
          <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
            {CONSTRAINT_MONITOR.map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:pb-4">
                <div className="min-w-0">
                  <p className="text-sm text-text-primary">{row.label}</p>
                  <p className="mt-1 font-[family-name:var(--font-jetbrains)] text-xs text-text-secondary">
                    {row.value}
                  </p>
                </div>
                <span className="shrink-0 font-[family-name:var(--font-jetbrains)] text-[12px] uppercase text-accent sm:text-[13px]">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-4 sm:p-6 lg:p-8">
          <h3 className="font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary sm:text-xl">
            Strategy Evolution
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:mt-4">
            The AI is currently suggesting a shift towards Jito-MEV strategies based on the last 4 hours of network congestion data.
          </p>
          <Link
            href="/app/create"
            className="mt-4 inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains)] text-[12px] uppercase tracking-wide text-accent hover:text-accent-hover sm:mt-6 sm:text-[13px]"
          >
            View Proposed Update
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  )
}
