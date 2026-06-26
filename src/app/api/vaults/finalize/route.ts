import { NextResponse } from 'next/server'

import { appendActivityEvent } from '@/lib/services/activity-service'
import { enqueueCycleJob, VaultCycleMutexError } from '@/lib/services/cycle-service'
import { registerVault, updateVault, VaultAlreadyRegisteredError } from '@/lib/services/vault-registry-service'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const vaultPubkey = typeof body?.vaultPubkey === 'string' ? body.vaultPubkey : null
  const ownerWallet = typeof body?.ownerWallet === 'string' ? body.ownerWallet : null
  const name = typeof body?.name === 'string' ? body.name : null
  const permissionLevel = Number(body?.permissionLevel ?? 2)
  const txSignature = typeof body?.txSignature === 'string' ? body.txSignature : null

  if (!vaultPubkey || !ownerWallet) {
    return NextResponse.json({ error: 'Missing vaultPubkey or ownerWallet' }, { status: 400 })
  }

  try {
    let vaultEntry

    try {
      vaultEntry = await registerVault({
        vaultPubkey,
        ownerWallet,
        name: name ?? undefined,
        permissionLevel,
        txSignature: txSignature ?? undefined,
      })
    } catch (error) {
      if (error instanceof VaultAlreadyRegisteredError) {
        vaultEntry = await updateVault(vaultPubkey, {
          name: name ?? undefined,
          permission_level: permissionLevel,
          tx_signature: txSignature ?? undefined,
        })
      } else {
        throw error
      }
    }

    await appendActivityEvent({
      vaultPubkey,
      eventType: 'vault_created',
      payload: {
        ownerWallet,
        txSignature,
        permissionLevel,
      },
    })

    try {
      await enqueueCycleJob({
        vaultPubkey,
        cycleId: 1,
        permissionLevel,
        priority: 10,
      })
    } catch (error) {
      if (!(error instanceof VaultCycleMutexError)) {
        throw error
      }
    }

    return NextResponse.json({ vault: vaultEntry })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to finalize vault' }, { status: 500 })
  }
}
