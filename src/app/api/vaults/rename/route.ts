import { NextResponse } from 'next/server'
import { updateVault } from '@/lib/services/vault-registry-service'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const vaultPubkey = typeof body?.vaultPubkey === 'string' ? body.vaultPubkey : null
  const name = typeof body?.name === 'string' ? body.name : null

  if (!vaultPubkey || name === null) {
    return NextResponse.json({ error: 'Missing vaultPubkey or name' }, { status: 400 })
  }

  try {
    const entry = await updateVault(vaultPubkey, { name })
    return NextResponse.json({ vault: entry })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to rename vault' },
      { status: 500 },
    )
  }
}
