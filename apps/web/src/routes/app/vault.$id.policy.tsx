import { createFileRoute, Link } from '@tanstack/react-router'
import { PolicyBlock } from '@krypton/ui'
import { getVault } from '~/lib/mock-data'

export const Route = createFileRoute('/app/vault/$id/policy')({
  component: VaultPolicyPage,
})

function VaultPolicyPage() {
  const { id } = Route.useParams()
  const vault = getVault(id)

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/app/vault/$id"
        params={{ id }}
        className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent)]"
      >
        ← {vault.name}
      </Link>

      <h1 className="font-display mt-4 text-3xl font-semibold">Policy</h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Owner mode — amend by signing a new policy version (devnet stub until Phase 1).
      </p>

      <div className="panel mt-8 p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">
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
              max_position: `${(vault.constraint.maxPositionBps / 100).toFixed(0)}%`,
              signing: 'ika_dwallet',
            }}
          />
        </div>
      </div>

      <div className="panel mt-6 p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          amendment
        </p>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Policy amendments hash canonical JSON off-chain and write a new version to{' '}
          <code className="font-mono text-[var(--accent)]">PolicyAccount</code>. Prior
          versions remain queryable for audit.
        </p>
        <Link to="/app/create" className="btn-secondary mt-6 inline-flex">
          Open policy builder
        </Link>
      </div>
    </div>
  )
}
