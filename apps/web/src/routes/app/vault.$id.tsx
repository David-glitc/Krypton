import { createFileRoute, Link } from '@tanstack/react-router'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { ConstraintBars, PolicyBlock } from '@krypton/ui'
import { constraintToBarInput, getVault, NAV_HISTORY } from '~/lib/mock-data'

export const Route = createFileRoute('/app/vault/$id')({
  component: VaultDashboardPage,
})

function VaultDashboardPage() {
  const { id } = Route.useParams()
  const vault = getVault(id)

  if (!vault) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-[var(--accent-risk)]">Vault not found — {id}</p>
        <Link to="/app" className="btn-secondary mt-6 inline-flex">
          Back to vaults
        </Link>
      </div>
    )
  }

  const bars = constraintToBarInput(vault.constraint)
  const drawdownUtilization = ((vault.constraint.currentDrawdownBps / vault.constraint.maxDrawdownBps) * 100).toFixed(0)
  const leverageUtilization = ((vault.constraint.currentLeverageBps / vault.constraint.maxLeverageBps) * 100).toFixed(0)

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold">{vault.name}</h1>
            {vault.constraint.paused && (
              <span className="rounded bg-[var(--accent-risk)]/10 px-2 py-0.5 font-mono text-xs uppercase text-[var(--accent-risk)]">
                paused
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
          <Link to="/app/vault/$id/activity" params={{ id }} className="btn-secondary text-xs">
            Activity
          </Link>
          <Link to="/app/vault/$id/policy" params={{ id }} className="btn-secondary text-xs">
            Policy
          </Link>
        </div>
      </div>

      {/* Constraint overview cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <ConstraintCard
          label="drawdown"
          current={vault.constraint.currentDrawdownBps / 100}
          max={vault.constraint.maxDrawdownBps / 100}
          unit="%"
          utilization={Number(drawdownUtilization)}
        />
        <ConstraintCard
          label="leverage"
          current={vault.constraint.currentLeverageBps / 10000}
          max={vault.constraint.maxLeverageBps / 10000}
          unit="x"
          utilization={Number(leverageUtilization)}
        />
        <ConstraintCard
          label="concentration"
          current={vault.constraint.currentPositionConcentrationBps / 100}
          max={vault.constraint.maxPositionBps / 100}
          unit="%"
          utilization={Number(((vault.constraint.currentPositionConcentrationBps / vault.constraint.maxPositionBps) * 100).toFixed(0))}
        />
      </div>

      {/* Charts + Policy */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* NAV chart */}
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            nav_history
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={NAV_HISTORY}>
                <defs>
                  <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="nav" stroke="var(--accent-primary)" fill="url(#navGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Constraint bars */}
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            constraint_utilization
          </p>
          <div className="mt-6">
            <ConstraintBars {...bars} />
          </div>
          <div className="mt-6 rounded border border-[var(--border)] bg-[var(--bg-base)] p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              status
            </p>
            <p className="mt-1 text-sm text-[var(--text-primary)]">
              {vault.constraint.paused
                ? 'Vault is paused. No actions will execute.'
                : `All constraints within bounds. ${100 - Number(drawdownUtilization)}% drawdown headroom remaining.`}
            </p>
          </div>
        </div>
      </div>

      {/* Policy summary */}
      <div className="panel mt-6 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">
          active_policy
        </p>
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

function ConstraintCard({
  label,
  current,
  max,
  unit,
  utilization,
}: {
  label: string
  current: number
  max: number
  unit: string
  utilization: number
}) {
  const isDanger = utilization >= 90
  const isWarning = utilization >= 70

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
        <span
          className={`font-mono text-xs ${
            isDanger ? 'text-[var(--accent-risk)]' : isWarning ? 'text-[var(--accent-warning)]' : 'text-[var(--accent-secondary)]'
          }`}
        >
          {utilization}%
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold">
        {current.toFixed(1)}
        <span className="text-sm text-[var(--text-muted)]">/{max.toFixed(1)}{unit}</span>
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-sm bg-[var(--bg-panel-raised)]">
        <div
          className={`h-full transition-all ${
            isDanger ? 'bg-[var(--accent-risk)]' : isWarning ? 'bg-[var(--accent-warning)]' : 'bg-[var(--accent-policy)]'
          }`}
          style={{ width: `${Math.min(100, utilization)}%` }}
        />
      </div>
    </div>
  )
}
