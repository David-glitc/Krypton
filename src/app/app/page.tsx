'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { DynamicContext } from '@dynamic-labs/sdk-react-core'
import { Building2, ExternalLink, Zap } from 'lucide-react'
import {
  MetricCard,
  OutlineButton,
  PrimaryCta,
  StatusPill,
} from '@/components/app/app-shell'
import { SectionHeading } from '@/components/app/section-heading'
import {
  CONSTRAINT_MONITOR,
  GLOBAL_METRICS,
  VAULT_DEPLOYMENTS,
} from '@/lib/vault-demo-data'

function VaultIcon({ type }: { type: 'bank' | 'zap' }) {
  const Icon = type === 'bank' ? Building2 : Zap
  return (
    <div className="flex h-12 w-12 items-center justify-center border border-border bg-bg-base">
      <Icon className="h-5 w-5 text-accent" />
    </div>
  )
}

export default function VaultsPage() {
  const dynamicContext = useContext(DynamicContext)
  const [liveVaults, setLiveVaults] = useState<
    Array<{
      registry: { vault_pubkey: string; name: string | null }
      onChain: { navUsd: string; policyVersion: number; paused: boolean } | null
      cycleStatus: { activeJob: { status: string } | null }
    }>
  >([])

  useEffect(() => {
    const ownerWallet = dynamicContext?.primaryWallet?.address
    if (!ownerWallet) {
      setLiveVaults([])
      return
    }

    let cancelled = false
    fetch(`/api/vaults?ownerWallet=${encodeURIComponent(ownerWallet)}`, { cache: 'no-store' })
      .then(async (res) => {
        const json = (await res.json()) as { vaults?: typeof liveVaults }
        if (!cancelled) setLiveVaults(json.vaults ?? [])
      })
      .catch(() => {
        if (!cancelled) setLiveVaults([])
      })

    return () => {
      cancelled = true
    }
  }, [dynamicContext?.primaryWallet?.address])

  const liveMetrics = useMemo(() => {
    if (!liveVaults.length) return null

    const totalNav = liveVaults.reduce((sum, vault) => sum + Number(vault.onChain?.navUsd ?? '0'), 0)
    return {
      tvl: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalNav),
      avgApy: 'Pending',
      activeConstraints: String(liveVaults.length * 3),
      uptime: liveVaults.some((vault) => vault.onChain?.paused) ? 'Paused' : 'Healthy',
    }
  }, [liveVaults])

  const renderedVaults = liveVaults.length
    ? liveVaults.map((vault) => ({
        id: vault.registry.vault_pubkey,
        name: vault.registry.name ?? vault.registry.vault_pubkey,
        policyId: `PV-${vault.onChain?.policyVersion ?? 0}`,
        icon: 'bank' as const,
        tvl: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(vault.onChain?.navUsd ?? '0')),
        netApy: '—',
        riskLevel: vault.onChain?.paused ? ('Paused' as const) : ('Live' as const),
        riskTone: vault.onChain?.paused ? ('risk' as const) : ('default' as const),
        status: vault.cycleStatus.activeJob?.status?.toUpperCase() ?? 'REGISTERED',
        tags: [
          `Policy Version ${vault.onChain?.policyVersion ?? 0}`,
          vault.onChain?.paused ? 'Constraint Pause Active' : 'Constraint Engine Ready',
        ],
      }))
    : VAULT_DEPLOYMENTS

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
        <PrimaryCta href="/app/create">New Vault</PrimaryCta>
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
          {renderedVaults.map((vault) => (
            <article key={vault.id} className="panel p-4 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:gap-6">
                <div className="flex gap-3 sm:gap-4">
                  <VaultIcon type={vault.icon} />
                  <div className="min-w-0">
                    <h3 className="truncate font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary sm:text-xl">
                      {vault.name}
                    </h3>
                    <p className="mt-0.5 font-[family-name:var(--font-jetbrains)] text-[12px] tracking-wide text-text-secondary sm:text-[13px]">
                      Policy ID: {vault.policyId}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                  {[
                    { label: 'TVL', value: vault.tvl, accent: false },
                    { label: 'Net APY', value: vault.netApy, accent: true },
                    {
                      label: 'Risk Level',
                      value: vault.riskLevel,
                      accent: false,
                      risk: vault.riskTone === 'risk',
                    },
                    { label: 'Status', value: vault.status, accent: true, status: true },
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

                <OutlineButton href={`/app/vault/${vault.id}`}>Analyze</OutlineButton>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-4 sm:mt-6 sm:gap-3 sm:pt-6">
                {vault.tags.map((tag) => (
                  <StatusPill key={tag} label={tag} />
                ))}
              </div>
            </article>
          ))}
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
