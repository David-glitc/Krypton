import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'

import { fetchPolicyByVault, fetchVaultByOwner, fetchVaultGoalByVault, withRpcFallback } from '@/lib/solana/client'
import { getVaultCycleStatus } from '@/lib/services/cycle-service'
import { listVaultsByOwner } from '@/lib/services/vault-registry-service'

export const runtime = 'nodejs'

function serializeBigint(value: bigint) {
  return value.toString()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ownerWallet = searchParams.get('ownerWallet')

  if (!ownerWallet) {
    return NextResponse.json({ vaults: [] })
  }

  try {
    const registryEntries = await listVaultsByOwner(ownerWallet)
    const owner = new PublicKey(ownerWallet)

    const vaults = await withRpcFallback(async (connection) => {
      const liveVault = await fetchVaultByOwner(connection, owner).catch(() => null)

      return Promise.all(
        registryEntries.map(async (entry) => {
          const onChainVault =
            liveVault && liveVault.address === entry.vault_pubkey ? liveVault : null
          const onChainPolicy = onChainVault
            ? await fetchPolicyByVault(connection, new PublicKey(onChainVault.address)).catch(() => null)
            : null
          const onChainGoal = onChainVault
            ? await fetchVaultGoalByVault(connection, new PublicKey(onChainVault.address)).catch(() => null)
            : null

          return {
            registry: entry,
            onChain: onChainVault
              ? {
                  address: onChainVault.address,
                  owner: onChainVault.owner,
                  bump: onChainVault.bump,
                  voltrVault: onChainVault.voltrVault,
                  policyVersion: onChainVault.policyVersion,
                  paused: onChainVault.paused,
                  pauseReason: onChainVault.pauseReason,
                  constraint: {
                    maxDrawdownBps: serializeBigint(onChainVault.constraint.maxDrawdownBps),
                    maxLeverageBps: serializeBigint(onChainVault.constraint.maxLeverageBps),
                    maxPositionBps: serializeBigint(onChainVault.constraint.maxPositionBps),
                    maxCorrelatedExposureBps: serializeBigint(onChainVault.constraint.maxCorrelatedExposureBps),
                    minPoolLiquidityUsd: serializeBigint(onChainVault.constraint.minPoolLiquidityUsd),
                    currentDrawdownBps: serializeBigint(onChainVault.constraint.currentDrawdownBps),
                    currentLeverageBps: serializeBigint(onChainVault.constraint.currentLeverageBps),
                    currentConcentrationBps: serializeBigint(onChainVault.constraint.currentConcentrationBps),
                    currentCorrelatedExposureBps: serializeBigint(onChainVault.constraint.currentCorrelatedExposureBps),
                    lastOracleUpdate: serializeBigint(onChainVault.constraint.lastOracleUpdate),
                    allowedProtocolsBitmap: serializeBigint(onChainVault.constraint.allowedProtocolsBitmap),
                    allowedAssetsHash: Buffer.from(onChainVault.constraint.allowedAssetsHash).toString('hex'),
                  },
                }
              : null,
            policy: onChainPolicy
              ? {
                  ...onChainPolicy,
                  contentHash: Buffer.from(onChainPolicy.contentHash).toString('hex'),
                }
              : null,
            goal: onChainGoal
              ? {
                  ...onChainGoal,
                  createdFromPromptHash: Buffer.from(onChainGoal.createdFromPromptHash).toString('hex'),
                }
              : null,
            cycleStatus: await getVaultCycleStatus(entry.vault_pubkey),
          }
        }),
      )
    })

    return NextResponse.json({ vaults })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list vaults' }, { status: 500 })
  }
}
