import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'

import { fetchAllVaults, fetchPolicyByVault, fetchVaultGoalByVault, withRpcFallback } from '@/lib/solana/client'
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
    const owner = new PublicKey(ownerWallet)
    const [registryEntries, onChainVaults] = await Promise.all([
      listVaultsByOwner(ownerWallet).catch(() => [] as Array<{ vault_pubkey: string; name: string | null }>),
      withRpcFallback((connection) => fetchAllVaults(connection, owner)),
    ])

    const registryByAddress = new Map(registryEntries.map((e) => [e.vault_pubkey, e]))

    const vaults = await withRpcFallback(async (connection) => {
      return Promise.all(
        onChainVaults.map(async (onChainVault) => {
          const vaultPubkey = new PublicKey(onChainVault.address)
          const registry = registryByAddress.get(onChainVault.address) ?? null

          const [onChainPolicy, onChainGoal, cycleStatus] = await Promise.all([
            fetchPolicyByVault(connection, vaultPubkey).catch(() => null),
            fetchVaultGoalByVault(connection, vaultPubkey).catch(() => null),
            getVaultCycleStatus(onChainVault.address).catch(() => null),
          ])

          const {
            maxDrawdownBps,
            maxLeverageBps,
            maxPositionBps,
            maxCorrelatedExposureBps,
            minPoolLiquidityUsd,
            currentDrawdownBps,
            currentLeverageBps,
            currentConcentrationBps,
            currentCorrelatedExposureBps,
            lastOracleUpdate,
            allowedProtocolsBitmap,
            allowedAssetsHash,
          } = onChainVault.constraint

          return {
            registry,
            onChain: {
              address: onChainVault.address,
              owner: onChainVault.owner,
              bump: onChainVault.bump,
              nonce: onChainVault.nonce,
              pendingActionId: serializeBigint(onChainVault.pendingActionId),
              pendingLeverageBps: serializeBigint(onChainVault.pendingLeverageBps),
              pendingConcentrationBps: serializeBigint(onChainVault.pendingConcentrationBps),
              pendingDrawdownBps: serializeBigint(onChainVault.pendingDrawdownBps),
              pendingCorrelatedBps: serializeBigint(onChainVault.pendingCorrelatedBps),
              policyVersion: onChainVault.policyVersion,
              paused: onChainVault.paused,
              pauseReason: onChainVault.pauseReason,
              constraint: {
                maxDrawdownBps: serializeBigint(maxDrawdownBps),
                maxLeverageBps: serializeBigint(maxLeverageBps),
                maxPositionBps: serializeBigint(maxPositionBps),
                maxCorrelatedExposureBps: serializeBigint(maxCorrelatedExposureBps),
                minPoolLiquidityUsd: serializeBigint(minPoolLiquidityUsd),
                currentDrawdownBps: serializeBigint(currentDrawdownBps),
                currentLeverageBps: serializeBigint(currentLeverageBps),
                currentConcentrationBps: serializeBigint(currentConcentrationBps),
                currentCorrelatedExposureBps: serializeBigint(currentCorrelatedExposureBps),
                lastOracleUpdate: serializeBigint(lastOracleUpdate),
                allowedProtocolsBitmap: serializeBigint(allowedProtocolsBitmap),
                allowedAssetsHash: Buffer.from(allowedAssetsHash).toString('hex'),
              },
            },
            policy: onChainPolicy
              ? { ...onChainPolicy, contentHash: Buffer.from(onChainPolicy.contentHash).toString('hex') }
              : null,
            goal: onChainGoal
              ? { ...onChainGoal, createdFromPromptHash: Buffer.from(onChainGoal.createdFromPromptHash).toString('hex') }
              : null,
            cycleStatus,
          }
        }),
      )
    })

    // Also include registry-only vaults (created off-chain but not yet on-chain)
    for (const entry of registryEntries) {
      if (!onChainVaults.some((v) => v.address === entry.vault_pubkey)) {
        vaults.push({
          registry: entry,
          onChain: null as any,
          policy: null,
          goal: null,
          cycleStatus: await getVaultCycleStatus(entry.vault_pubkey).catch(() => null),
        })
      }
    }

    return NextResponse.json({ vaults })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to list vaults' }, { status: 500 })
  }
}
