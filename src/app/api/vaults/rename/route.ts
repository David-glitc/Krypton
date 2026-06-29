import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'

import { updateVault, registerVault, getVault, VaultNotFoundError } from '@/lib/services/vault-registry-service'
import { fetchVaultAccount, withRpcFallback } from '@/lib/solana/client'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const vaultPubkey = typeof body?.vaultPubkey === 'string' ? body.vaultPubkey : null
  const name = typeof body?.name === 'string' ? body.name.trim() : null
  const ownerWallet = typeof body?.ownerWallet === 'string' ? body.ownerWallet : null

  if (!vaultPubkey || !name) {
    return NextResponse.json({ error: 'Missing vaultPubkey or name' }, { status: 400 })
  }

  if (name.length < 2 || name.length > 64) {
    return NextResponse.json({ error: 'Name must be 2–64 characters' }, { status: 400 })
  }

  try {
    if (ownerWallet) {
      try {
        const entry = await getVault(vaultPubkey)
        if (entry.owner_wallet !== ownerWallet) {
          return NextResponse.json({ error: 'Not your vault' }, { status: 403 })
        }
      } catch (e) {
        if (e instanceof VaultNotFoundError) {
          const onChain = await withRpcFallback((c) =>
            fetchVaultAccount(c, new PublicKey(vaultPubkey)),
          )
          if (!onChain || onChain.owner !== ownerWallet) {
            return NextResponse.json({ error: 'Not your vault' }, { status: 403 })
          }
          await registerVault({ vaultPubkey, ownerWallet, name, permissionLevel: 2 })
          return NextResponse.json({ vault: await getVault(vaultPubkey) })
        }
        throw e
      }
    }

    const entry = await updateVault(vaultPubkey, { name })
    return NextResponse.json({ vault: entry })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to rename vault' },
      { status: 500 },
    )
  }
}
