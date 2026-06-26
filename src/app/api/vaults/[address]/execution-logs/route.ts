import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'

import { fetchExecutionLogAccount, withRpcFallback } from '@/lib/solana/client'
import { listCycleRunsByVault } from '@/lib/services/cycle-runs-service'

export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  try {
    const vaultPubkey = new PublicKey(address)

    const [onChainLog, offChainRuns] = await Promise.all([
      withRpcFallback((connection) => fetchExecutionLogAccount(connection, vaultPubkey)),
      listCycleRunsByVault(address, { limit: 20 }),
    ])

    return NextResponse.json({
      onChain: onChainLog,
      offChainRuns: offChainRuns.map((run) => ({
        ...run,
        decision: run.decision ? JSON.parse(run.decision) : null,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load execution logs' }, { status: 500 })
  }
}
