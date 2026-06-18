import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { ConstraintBars, PolicyBlock } from '@krypton/ui'
import { getVault, NAV_HISTORY, constraintToBarInput } from '~/lib/mock-data'
import { fetchVault } from '~/lib/vault-data'
import { computeDrawdownBps, checkThresholds, DEFAULT_THRESHOLD_CONFIG } from '~/lib/telemetry-engine'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import type { VaultSummary } from '@krypton/sdk'

export const Route = createFileRoute('/app/vault/$id')({
  component: VaultDashboardPage,
})

function VaultDashboardPage() {
  const { id } = Route.useParams()
  const [vault, setVault] = useState<VaultSummary | undefined>(() => getVault(id))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchVault(id).then((result) => {
      if (!cancelled && result) setVault(result)
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [id])

  const telemetry = useMemo(() => {
    if (!vault) return null
    const liveDrawdownBps = computeDrawdownBps(vault.navUsd, vault.navUsd * 1.15)
    const maxDrawdownBps = vault.constraint.maxDrawdownBps
    const alert = checkThresholds(
      { vaultId: id, nav: vault.navUsd, peakNav: vault.navUsd * 1.15, liveDrawdownBps, positions: [], lastUpdated: Date.now() },
      maxDrawdownBps,
      DEFAULT_THRESHOLD_CONFIG,
    )
    return { liveDrawdownBps, alert }
  }, [vault, id])
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6">
        <LoadingSpinner label="Loading vault data…" />
      </div>
    )
  }

  if (!vault) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-[var(--accent-risk)]">Vault not found — {id}</p>
        <Link to="/app" className="btn-secondary mt-6 inline-flex">Back to vaults</Link>
      </div>
    )
  }

  const bars = constraintToBarInput(vault.constraint)
  const drawdownUtil = ((vault.constraint.currentDrawdownBps / vault.constraint.maxDrawdownBps) * 100).toFixed(0)
  const leverageUtil = ((vault.constraint.currentLeverageBps / vault.constraint.maxLeverageBps) * 100).toFixed(0)
  const concentrationUtil = ((vault.constraint.currentPositionConcentrationBps / vault.constraint.maxPositionBps) * 100).toFixed(0)

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold">{vault.name}</h1>
            {vault.constraint.paused && (
              <span className="rounded-sm bg-[var(--accent-risk)]/10 px-2 py-0.5 font-mono text-xs uppercase text-[var(--accent-risk)]">paused</span>
            )}
            {telemetry?.alert && (
              <span className={`rounded-sm px-2 py-0.5 font-mono text-xs uppercase ${
                telemetry.alert.level === 'breach'
                  ? 'bg-[var(--accent-risk)]/10 text-[var(--accent-risk)]'
                  : 'bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]'
              }`}>
                {telemetry.alert.level}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <span className="font-mono text-[var(--accent-policy)]">${vault.navUsd.toLocaleString()} NAV</span>
            <span>Policy v{vault.policyVersion}</span>
            <span>Level {vault.permissionLevel}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/app/vault/$id/activity" params={{ id }} className="btn-secondary text-xs">Activity</Link>
          <Link to="/app/vault/$id/policy" params={{ id }} className="btn-secondary text-xs">Policy</Link>
        </div>
      </div>

      {/* Alert banner */}
      {telemetry?.alert && telemetry.alert.level !== 'watch' && (
        <div className={`mt-4 rounded-sm border p-3 text-sm ${
          telemetry.alert.level === 'breach'
            ? 'border-[var(--accent-risk)]/40 bg-[var(--accent-risk)]/10 text-[var(--accent-risk)]'
            : 'border-[var(--accent-policy)]/40 bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]'
        }`}>
          <p className="font-mono text-xs uppercase tracking-wider">{telemetry.alert.level}</p>
          <p className="mt-1 text-xs">{telemetry.alert.message}</p>
          {telemetry.alert.recommendedActions.length > 0 && (
            <ul className="mt-2 space-y-1">
              {telemetry.alert.recommendedActions.map((a, i) => (
                <li key={i} className="text-xs">→ {a}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Constraint cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ConstraintCard label="drawdown" current={vault.constraint.currentDrawdownBps / 100} max={vault.constraint.maxDrawdownBps / 100} unit="%" utilization={Number(drawdownUtil)} />
        <ConstraintCard label="leverage" current={vault.constraint.currentLeverageBps / 10000} max={vault.constraint.maxLeverageBps / 10000} unit="x" utilization={Number(leverageUtil)} />
        <ConstraintCard label="concentration" current={vault.constraint.currentPositionConcentrationBps / 100} max={vault.constraint.maxPositionBps / 100} unit="%" utilization={Number(concentrationUtil)} />
      </div>

      {/* Charts + Policy */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">nav_history</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={NAV_HISTORY}>
                <defs>
                  <linearGradient id="navGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-policy)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--accent-policy)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="nav" stroke="var(--accent-policy)" fill="url(#navGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">constraint_utilization</p>
          <div className="mt-6"><ConstraintBars {...bars} /></div>
          <div className="mt-6 rounded-sm border border-[var(--border)] bg-[var(--bg-base)] p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">status</p>
            <p className="mt-1 text-sm text-[var(--text-primary)]">
              {vault.constraint.paused
                ? 'Vault is paused. No actions will execute.'
                : `All constraints within bounds. ${100 - Number(drawdownUtil)}% drawdown headroom remaining.`}
            </p>
          </div>
        </div>
      </div>

      {/* Policy */}
      <div className="panel mt-6 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">active_policy</p>
        <div className="mt-4">
          <PolicyBlock
            fields={{
              policy_version: vault.policyVersion,
              permission_level: vault.permissionLevel,
              governance: 'owner',
              max_drawdown: `${(vault.constraint.maxDrawdownBps / 100).toFixed(0)}%`,
              max_leverage: `${(vault.constraint.maxLeverageBps / 10000).toFixed(1)}x`,
              signing: 'ika_dwallet',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ConstraintCard({ label, current, max, unit, utilization }: { label: string; current: number; max: number; unit: string; utilization: number }) {
  const isDanger = utilization >= 90
  const isWarning = utilization >= 70
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
        <span className={`font-mono text-xs ${isDanger ? 'text-[var(--accent-risk)]' : isWarning ? 'text-[var(--accent-policy)]' : 'text-[var(--accent-privacy)]'}`}>
          {utilization}%
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">
        {current.toFixed(1)}<span className="text-sm text-[var(--text-muted)]">/{max.toFixed(1)}{unit}</span>
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-sm bg-[var(--bg-panel-raised)]">
        <div className={`h-full ${isDanger ? 'bg-[var(--accent-risk)]' : isWarning ? 'bg-[var(--accent-policy)]' : 'bg-[var(--accent-policy)]'}`} style={{ width: `${Math.min(100, utilization)}%` }} />
      </div>
    </div>
  )
}
