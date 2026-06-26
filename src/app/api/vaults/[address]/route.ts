import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'

import { fetchPolicyByVault, fetchVaultAccount, withRpcFallback } from '@/lib/solana/client'
import { listActivityByVault } from '@/lib/services/activity-service'
import { getVaultCycleStatus } from '@/lib/services/cycle-service'
import { listPendingActionsByVault } from '@/lib/services/pending-action-service'
import { getVault } from '@/lib/services/vault-registry-service'

export const runtime = 'nodejs'

function stringifyBigints(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString()
  if (Array.isArray(value)) return value.map(stringifyBigints)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, stringifyBigints(inner)]))
  }
  return value
}

export async function GET(_: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  try {
    const vaultPubkey = new PublicKey(address)

    const { onChainVault, onChainPolicy } = await withRpcFallback(async (connection) => {
      const onChainVault = await fetchVaultAccount(connection, vaultPubkey)
      const onChainPolicy = await fetchPolicyByVault(connection, vaultPubkey)
      return { onChainVault, onChainPolicy }
    })

    let registry = null
    try {
      registry = await getVault(address)
    } catch {
      registry = null
    }

    return NextResponse.json({
      vault: onChainVault ? stringifyBigints(onChainVault) : null,
      policy: onChainPolicy
        ? {
            ...onChainPolicy,
            contentHash: Buffer.from(onChainPolicy.contentHash).toString('hex'),
          }
        : null,
      registry,
      cycleStatus: await getVaultCycleStatus(address),
      pendingActions: (await listPendingActionsByVault(address, 'pending')).map((action) => ({
        ...action,
        typed_action_json: JSON.parse(action.typed_action_json),
      })),
      recentActivity: (await listActivityByVault(address, { limit: 10 })).map((event) => ({
        ...event,
        payload_json: JSON.parse(event.payload_json),
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load vault' }, { status: 500 })
  }
}
