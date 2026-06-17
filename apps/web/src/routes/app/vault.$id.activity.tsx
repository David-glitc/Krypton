import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { PendingActionCard } from '@krypton/ui'
import { ActivityFeed, type ActivityEntry } from '~/components/ActivityFeed'
import { DEMO_PENDING_ACTIONS, getVault } from '~/lib/mock-data'

export const Route = createFileRoute('/app/vault/$id/activity')({
  component: VaultActivityPage,
})

const DEMO_ACTIVITY: ActivityEntry[] = [
  {
    id: 'act-1',
    vaultId: 'vault-alpha',
    type: 'executed',
    description: 'Swap 500 USDC → SOL via Jupiter',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: { cycle: '4820', score: '74', impact: '+$1,240' },
  },
  {
    id: 'act-2',
    vaultId: 'vault-alpha',
    type: 'rejected',
    description: 'Leverage increase to 2.3x rejected by Constraint Engine',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: { cycle: '4819', reason: 'exceeds policy max 2.0x' },
  },
  {
    id: 'act-3',
    vaultId: 'vault-alpha',
    type: 'executed',
    description: 'Deposit 2,500 USDC',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    details: { shares: '2,450' },
  },
  {
    id: 'act-4',
    vaultId: 'vault-alpha',
    type: 'policy_amended',
    description: 'Policy updated to v2 — drawdown limit 10% → 12%',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    details: { v: '1 → 2' },
  },
  {
    id: 'act-5',
    vaultId: 'vault-alpha',
    type: 'advisory_pending',
    description: 'Rebalance 30% SOL → JitoSOL for yield optimization',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    details: { score: '68', est_return: '+2.4%' },
  },
]

function VaultActivityPage() {
  const { id } = Route.useParams()
  const vault = getVault(id)
  const [actions, setActions] = useState(DEMO_PENDING_ACTIONS[id] ?? [])
  const [message, setMessage] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'history'>('all')

  if (!vault) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-[var(--accent-risk)]">Vault not found</p>
        <Link to="/app" className="btn-secondary mt-6 inline-flex">
          Back
        </Link>
      </div>
    )
  }

  function handleApprove(actionId: string) {
    setMessage(`Approved ${actionId} — wallet will sign execute_action (devnet stub).`)
    setActions((prev) => prev.filter((a) => a.id !== actionId))
  }

  function handleReject(actionId: string) {
    setMessage(`Rejected ${actionId} — logged to ExecutionLog.`)
    setActions((prev) => prev.filter((a) => a.id !== actionId))
  }

  const filteredActivity = DEMO_ACTIVITY.filter((a) => {
    if (filter === 'pending') return a.type === 'advisory_pending'
    if (filter === 'history') return a.type !== 'advisory_pending'
    return true
  })

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/app/vault/$id"
        params={{ id }}
        className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent-policy)]"
      >
        ← {vault.name}
      </Link>

      <h1 className="font-display mt-4 text-3xl font-semibold">Activity</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Level {vault.permissionLevel} — your vault enforces manual approval before execution.
      </p>

      {message && (
        <div className="mt-4 rounded border border-[var(--accent-positive)]/40 bg-[var(--accent-positive)]/10 p-3 text-sm text-[var(--accent-positive)]">
          {message}
        </div>
      )}

      {/* Pending actions */}
      {actions.length > 0 && (
        <section className="mt-8">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">
            pending_actions ({actions.length})
          </p>
          <div className="mt-4 space-y-4">
            {actions.map((action) => (
              <PendingActionCard
                key={action.id}
                action={action}
                onApprove={() => handleApprove(action.id)}
                onReject={() => handleReject(action.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Activity feed */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            execution_log
          </p>
          <div className="flex gap-1">
            {(['all', 'pending', 'history'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                  filter === f
                    ? 'bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <ActivityFeed entries={filteredActivity} />
        </div>
      </section>
    </div>
  )
}
