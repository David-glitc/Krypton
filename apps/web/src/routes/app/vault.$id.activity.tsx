import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { PendingActionCard } from '@krypton/ui'
import { DEMO_PENDING_ACTIONS, getVault } from '~/lib/mock-data'

export const Route = createFileRoute('/app/vault/$id/activity')({
  component: VaultActivityPage,
})

function VaultActivityPage() {
  const { id } = Route.useParams()
  const vault = getVault(id)
  const [actions, setActions] = useState(DEMO_PENDING_ACTIONS[id] ?? [])
  const [message, setMessage] = useState<string | null>(null)

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

      <section className="mt-8">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">
          pending_actions
        </p>
        {actions.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--text-secondary)]">No pending actions.</p>
        ) : (
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
        )}
      </section>

      <section className="mt-10">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          recent_executions
        </p>
        <ul className="mt-4 space-y-2 font-mono text-sm text-[var(--text-secondary)]">
          <li>
            <span className="text-[var(--accent-positive)]">executed</span> · cycle 4820 · swap
          </li>
          <li>
            <span className="text-[var(--accent-risk)]">rejected_onchain</span> · cycle 4819 ·
            leverage 2.3x exceeds policy max 2.0x
          </li>
        </ul>
      </section>
    </div>
  )
}
