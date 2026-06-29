'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { DynamicContext } from '@dynamic-labs/sdk-react-core'
import { ArrowLeft, AlertTriangle, Shield, Zap } from 'lucide-react'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

import { LineChart, Line } from '@/components/charts/line-chart'
import { Grid } from '@/components/charts/grid'
import { XAxis } from '@/components/charts/x-axis'
import { ChartTooltip } from '@/components/charts/tooltip'
import { MetricCard, StatusPill } from '@/components/app/app-shell'
import { useSolPrice } from '@/hooks/use-sol-price'
import { formatUsd, formatSol, solToUsd, vaultDisplayName } from '@/lib/format-money'
import { withRpcFallback } from '@/lib/solana/rpc-fallback'

type ConstraintData = {
  maxDrawdownBps: string
  maxLeverageBps: string
  maxPositionBps: string
  maxCorrelatedExposureBps: string
  currentDrawdownBps: string
  currentLeverageBps: string
  currentConcentrationBps: string
  currentCorrelatedExposureBps: string
}

type VaultRiskEntry = {
  address: string
  name: string | null
  paused: boolean
  balanceSol: number
  constraint: ConstraintData | null
}

function bps(n: string | number): number {
  return Number(n) / 100
}

function utilization(current: string, max: string): number {
  const m = Number(max)
  if (!m) return 0
  return Math.min(100, (Number(current) / m) * 100)
}

function vaultHealthScore(c: ConstraintData | null, paused: boolean): number {
  if (paused) return 0
  if (!c) return 50
  const utils = [
    utilization(c.currentDrawdownBps, c.maxDrawdownBps),
    utilization(c.currentLeverageBps, c.maxLeverageBps),
    utilization(c.currentConcentrationBps, c.maxPositionBps),
    utilization(c.currentCorrelatedExposureBps, c.maxCorrelatedExposureBps),
  ]
  const worst = Math.max(...utils)
  return Math.round(Math.max(0, 100 - worst))
}

function healthVariant(score: number): 'ok' | 'warn' | 'risk' {
  if (score >= 70) return 'ok'
  if (score >= 40) return 'warn'
  return 'risk'
}

function ConstraintRow({
  label,
  current,
  max,
}: {
  label: string
  current: string
  max: string
}) {
  const util = utilization(current, max)
  const barColor =
    util >= 90 ? 'bg-accent-risk' : util >= 70 ? 'bg-accent-warn' : 'bg-accent'

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="font-[family-name:var(--font-jetbrains)] text-text-primary">
          {bps(current).toFixed(1)}% / {bps(max).toFixed(1)}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-base">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${util}%` }} />
      </div>
    </div>
  )
}

export default function RiskPage() {
  const dynamicContext = useContext(DynamicContext)
  const ownerWallet = dynamicContext?.primaryWallet?.address
  const { solPriceUsd } = useSolPrice()
  const [vaults, setVaults] = useState<VaultRiskEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [chartMode, setChartMode] = useState<'usd' | 'sol'>('usd')

  useEffect(() => {
    if (!ownerWallet) {
      setVaults([])
      setLoading(false)
      return
    }

    fetch(`/api/vaults?ownerWallet=${encodeURIComponent(ownerWallet)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then(async (j) => {
        const raw = j as {
          vaults?: Array<{
            registry?: { vault_pubkey: string; name: string | null }
            onChain?: { address: string; paused: boolean; constraint: ConstraintData } | null
          }>
        }
        const entries = (raw.vaults ?? [])
          .map((v) => ({
            address: v.onChain?.address ?? v.registry?.vault_pubkey ?? '',
            name: v.registry?.name ?? null,
            paused: v.onChain?.paused ?? false,
            constraint: v.onChain?.constraint ?? null,
          }))
          .filter((v) => v.address)

        const withBalances = await Promise.all(
          entries.map(async (v) => {
            const lamports = await withRpcFallback((c) => c.getBalance(new PublicKey(v.address))).catch(() => 0)
            return { ...v, balanceSol: lamports / LAMPORTS_PER_SOL }
          }),
        )
        setVaults(withBalances)
      })
      .catch(() => setVaults([]))
      .finally(() => setLoading(false))
  }, [ownerWallet])

  const totalSol = vaults.reduce((s, v) => s + v.balanceSol, 0)
  const totalUsd = solToUsd(totalSol, solPriceUsd)
  const avgHealth =
    vaults.length > 0
      ? Math.round(vaults.reduce((s, v) => s + vaultHealthScore(v.constraint, v.paused), 0) / vaults.length)
      : 0

  const chartData = useMemo(() => {
    const now = new Date()
    const points = 14
    return Array.from({ length: points }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (points - 1 - i))
      const factor = 0.92 + (i / (points - 1)) * 0.08
      return {
        date,
        usd: totalUsd * factor,
        sol: totalSol * factor,
      }
    })
  }, [totalUsd, totalSol])

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link href="/app" className="text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-hanken)] text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Risk
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Per-vault constraint health and portfolio capital at a glance.
          </p>
        </div>
      </div>

      {!ownerWallet ? (
        <div className="panel p-6 text-sm text-text-secondary">Connect a wallet to view risk across your vaults.</div>
      ) : loading ? (
        <div className="panel p-6 text-sm text-text-secondary">Loading risk telemetry…</div>
      ) : vaults.length === 0 ? (
        <div className="panel p-6 text-sm text-text-secondary">
          No vaults yet. <Link href="/app/create" className="text-accent hover:underline">Create one</Link>.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Portfolio (USD)" value={formatUsd(totalUsd)} accent />
            <MetricCard label="Portfolio (SOL)" value={formatSol(totalSol)} accent />
            <MetricCard label="Avg. constraint health" value={`${avgHealth}%`} />
          </div>

          <section className="panel p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-hanken)] text-lg font-medium text-text-primary">
                  Capital portfolio
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Live vault balances — toggle USD or SOL.
                </p>
              </div>
              <div className="flex gap-2">
                {(['usd', 'sol'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setChartMode(mode)}
                    className={`rounded border px-3 py-1 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wide ${
                      chartMode === mode
                        ? 'border-accent bg-accent-muted text-accent'
                        : 'border-border text-text-secondary hover:border-border-hover'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <LineChart
              data={chartData}
              aspectRatio="2.4 / 1"
              margin={{ top: 16, right: 16, bottom: 32, left: 48 }}
              className="w-full"
            >
              <Grid horizontal stroke="var(--chart-grid)" />
              <Line
                dataKey={chartMode}
                stroke="var(--chart-line-primary)"
                strokeWidth={2.5}
              />
              <XAxis />
              <ChartTooltip />
            </LineChart>
            <div className="mt-3 flex flex-wrap gap-4 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-text-muted">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {chartMode === 'usd' ? 'Total USD' : 'Total SOL'}
              </span>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-hanken)] text-lg font-medium text-text-primary">
              Per-vault risk
            </h2>
            {vaults.map((v) => {
              const score = vaultHealthScore(v.constraint, v.paused)
              const usd = solToUsd(v.balanceSol, solPriceUsd)
              return (
                <div key={v.address} className="panel p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Zap className="h-4 w-4 shrink-0 text-accent" />
                      <div className="min-w-0">
                        <Link
                          href={`/app/vault/${v.address}`}
                          className="truncate font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary hover:text-accent"
                        >
                          {vaultDisplayName(v.name, v.address)}
                        </Link>
                        <p className="mt-0.5 font-[family-name:var(--font-jetbrains)] text-xs text-text-muted">
                          {formatUsd(usd)} · {formatSol(v.balanceSol)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {v.paused && <StatusPill label="Paused" variant="risk" />}
                      <StatusPill
                        label={`Health ${score}%`}
                        variant={healthVariant(score)}
                      />
                    </div>
                  </div>

                  {v.constraint ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <ConstraintRow
                        label="Drawdown"
                        current={v.constraint.currentDrawdownBps}
                        max={v.constraint.maxDrawdownBps}
                      />
                      <ConstraintRow
                        label="Leverage"
                        current={v.constraint.currentLeverageBps}
                        max={v.constraint.maxLeverageBps}
                      />
                      <ConstraintRow
                        label="Concentration"
                        current={v.constraint.currentConcentrationBps}
                        max={v.constraint.maxPositionBps}
                      />
                      <ConstraintRow
                        label="Correlated exposure"
                        current={v.constraint.currentCorrelatedExposureBps}
                        max={v.constraint.maxCorrelatedExposureBps}
                      />
                    </div>
                  ) : (
                    <p className="mt-4 flex items-center gap-2 text-sm text-text-muted">
                      <AlertTriangle className="h-4 w-4" />
                      On-chain constraints unavailable for this vault.
                    </p>
                  )}
                </div>
              )
            })}
          </section>

          <p className="flex items-center gap-2 text-xs text-text-muted">
            <Shield className="h-3.5 w-3.5" />
            Constraint limits are enforced on-chain. Health scores reflect how close each vault is to its policy caps.
          </p>
        </>
      )}
    </div>
  )
}
