import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'

import { fetchExecutionLogAccount, withRpcFallback } from '@/lib/solana/client'
import { listAgentInvocationsByVault } from '@/lib/services/agent-invocations-service'
import { listCycleRunsByVault } from '@/lib/services/cycle-runs-service'

export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  try {
    const vaultPubkey = new PublicKey(address)

    const [onChainLog, offChainRuns, invocations] = await Promise.all([
      withRpcFallback((connection) => fetchExecutionLogAccount(connection, vaultPubkey)),
      listCycleRunsByVault(address, { limit: 80 }),
      listAgentInvocationsByVault(address, { limit: 80 }),
    ])

    return NextResponse.json({
      onChain: onChainLog,
      offChainRuns: offChainRuns.map((run) => ({
        ...run,
        decision: run.decision ? JSON.parse(run.decision) : null,
      })),
      invocations,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load execution logs' }, { status: 500 })
  }
}
