import { createFileRoute, Link } from '@tanstack/react-router'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">
            vault: {id}
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold">{vault.name}</h1>
          <p className="mt-1 font-mono text-lg text-[var(--accent-policy)]">
            ${vault.navUsd.toLocaleString()} NAV
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/app/vault/$id/activity"
            params={{ id }}
            className="btn-primary"
          >
            Pending actions
          </Link>
          <Link
            to="/app/vault/$id/policy"
            params={{ id }}
            className="btn-secondary"
          >
            Policy
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            constraint_state
          </p>
          <div className="mt-4">
            <ConstraintBars {...bars} />
          </div>
          {vault.constraint.paused && (
            <p className="mt-4 font-mono text-sm text-[var(--accent-risk)]">
              Paused — {vault.constraint.pauseReason ?? 'guardian or drawdown trigger'}
            </p>
          )}
        </div>

        <div className="panel p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            active_policy
          </p>
          <div className="mt-4">
            <PolicyBlock
              fields={{
                policy_version: vault.policyVersion,
                permission_level: vault.permissionLevel,
                max_drawdown: `${(vault.constraint.maxDrawdownBps / 100).toFixed(0)}%`,
                max_leverage: `${(vault.constraint.maxLeverageBps / 10000).toFixed(1)}x`,
                signing: 'ika_dwallet',
              }}
            />
          </div>
        </div>
      </div>

      <div className="panel mt-6 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          nav_history
        </p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={NAV_HISTORY}>
              <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--border)',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="nav"
                stroke="var(--accent-policy)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel mt-6 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          execution_log
        </p>
        <ul className="mt-4 space-y-2 font-mono text-sm text-[var(--text-secondary)]">
          <li>
            <span className="text-[var(--accent-positive)]">executed</span> · cycle 4820 · swap
            USDC→SOL · constraint pass
          </li>
          <li>
            <span className="text-[var(--accent-policy)]">advisory_pending</span> · cycle 4821 ·
            awaiting owner signature
          </li>
          <li>
            <span className="text-[var(--accent-risk)]">rejected_onchain</span> · cycle 4819 ·
            leverage 2.3x exceeds policy max 2.0x
          </li>
        </ul>
      </div>
    </div>
  )
}
