import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

import { deriveEncryptedStatePda, deriveExecutionLogPda, derivePermissionPda, derivePolicyPda, deriveVaultGoalPda, deriveVaultPda, deriveVaultPdaLegacy } from './accounts'
import {
  assertAccountDiscriminator,
  readBool,
  readF64,
  readFixedBytes,
  readI64,
  readOptionString,
  readPubkey,
  readU32,
  readU64,
  readU8,
} from './borsh'
import {
  ACCOUNT_DISCRIMINATORS,
  type ConstraintState,
  type OnChainEncryptedState,
  type OnChainExecutionLog,
  type OnChainPermission,
  type OnChainPolicy,
  type OnChainVault,
  type OnChainVaultGoal,
  getProgramId,
  getRpcUrl,
} from './idl'
import { getHealthyConnection, withRpcFallback } from './rpc-fallback'

export { getHealthyConnection, withRpcFallback } from './rpc-fallback'
export { getPrimaryRpcUrl, getRpcEndpoints } from './rpc'

export function createConnection(
  rpcUrl = getRpcUrl(clusterApiUrl('devnet')),
  commitment: 'confirmed' | 'finalized' | 'processed' = 'confirmed',
): Connection {
  return new Connection(rpcUrl, commitment)
}

function decodeConstraintState(buf: Buffer, offset: number): [ConstraintState, number] {
  let cursor = offset
  let value: bigint

  ;[value, cursor] = readU64(buf, cursor)
  const maxDrawdownBps = value
  ;[value, cursor] = readU64(buf, cursor)
  const maxLeverageBps = value
  ;[value, cursor] = readU64(buf, cursor)
  const maxPositionBps = value
  ;[value, cursor] = readU64(buf, cursor)
  const maxCorrelatedExposureBps = value
  ;[value, cursor] = readU64(buf, cursor)
  const minPoolLiquidityUsd = value

  ;[value, cursor] = readI64(buf, cursor)
  const currentDrawdownBps = value
  ;[value, cursor] = readI64(buf, cursor)
  const currentLeverageBps = value
  ;[value, cursor] = readI64(buf, cursor)
  const currentConcentrationBps = value
  ;[value, cursor] = readI64(buf, cursor)
  const currentCorrelatedExposureBps = value

  ;[value, cursor] = readI64(buf, cursor)
  const lastOracleUpdate = value

  ;[value, cursor] = readU64(buf, cursor)
  const allowedProtocolsBitmap = value

  let hash: Uint8Array
  ;[hash, cursor] = readFixedBytes(buf, cursor, 32)
  const allowedAssetsHash = hash

  return [
    {
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
    },
    cursor,
  ]
}

export function decodeVaultAccount(address: PublicKey, data: Buffer): OnChainVault {
  assertAccountDiscriminator(data, ACCOUNT_DISCRIMINATORS.vault, 'Vault')

  let offset = 8
  let owner: PublicKey
  ;[owner, offset] = readPubkey(data, offset)

  let bump: number
  ;[bump, offset] = readU8(data, offset)

  let nonce: number
  ;[nonce, offset] = readU8(data, offset)

  let policyVersion: number
  ;[policyVersion, offset] = readU32(data, offset)

  let paused: boolean
  ;[paused, offset] = readBool(data, offset)

  let pauseReason: string | null
  ;[pauseReason, offset] = readOptionString(data, offset)

  let constraint: ConstraintState
  ;[constraint, offset] = decodeConstraintState(data, offset)

  // Pending fields added in the two-phase commit upgrade.
  // Vaults created before the upgrade are too short — default to 0.
  let pendingActionId = 0n
  let pendingLeverageBps = 0n
  let pendingConcentrationBps = 0n
  let pendingDrawdownBps = 0n
  let pendingCorrelatedBps = 0n

  if (offset + 40 <= data.length) {
    ;[pendingActionId, offset] = readU64(data, offset)
    ;[pendingLeverageBps, offset] = readU64(data, offset)
    ;[pendingConcentrationBps, offset] = readU64(data, offset)
    ;[pendingDrawdownBps, offset] = readU64(data, offset)
    ;[pendingCorrelatedBps, offset] = readU64(data, offset)
  }

  return {
    address: address.toBase58(),
    owner: owner.toBase58(),
    bump,
    nonce,
    policyVersion,
    paused,
    pauseReason,
    constraint,
    pendingActionId,
    pendingLeverageBps,
    pendingConcentrationBps,
    pendingDrawdownBps,
    pendingCorrelatedBps,
  }
}

export function decodePolicyAccount(address: PublicKey, data: Buffer): OnChainPolicy {
  assertAccountDiscriminator(data, ACCOUNT_DISCRIMINATORS.policy, 'Policy')

  let offset = 8
  let vault: PublicKey
  ;[vault, offset] = readPubkey(data, offset)

  let policyVersion: number
  ;[policyVersion, offset] = readU32(data, offset)

  let contentHash: Uint8Array
  ;[contentHash, offset] = readFixedBytes(data, offset, 32)

  return {
    address: address.toBase58(),
    vault: vault.toBase58(),
    policyVersion,
    contentHash,
  }
}

export function decodePermissionAccount(address: PublicKey, data: Buffer): OnChainPermission {
  assertAccountDiscriminator(data, ACCOUNT_DISCRIMINATORS.permission, 'Permission')

  let offset = 8
  let vault: PublicKey
  ;[vault, offset] = readPubkey(data, offset)

  let owner: PublicKey
  ;[owner, offset] = readPubkey(data, offset)

  let agentSigner: PublicKey
  ;[agentSigner, offset] = readPubkey(data, offset)

  let maxLevel: number
  ;[maxLevel, offset] = readU8(data, offset)

  let guardianMultisig: PublicKey
  ;[guardianMultisig, offset] = readPubkey(data, offset)

  return {
    address: address.toBase58(),
    vault: vault.toBase58(),
    owner: owner.toBase58(),
    agentSigner: agentSigner.toBase58(),
    maxLevel,
    guardianMultisig: guardianMultisig.toBase58(),
  }
}

export function decodeVaultGoalAccount(address: PublicKey, data: Buffer): OnChainVaultGoal {
  assertAccountDiscriminator(data, ACCOUNT_DISCRIMINATORS.vaultGoal, 'VaultGoal')

  let offset = 8
  let vault: PublicKey
  ;[vault, offset] = readPubkey(data, offset)

  let targetType: number
  ;[targetType, offset] = readU8(data, offset)

  let targetValue: number | null
  {
    let tag: number
    ;[tag, offset] = readU8(data, offset)
    if (tag === 1) {
      let val: number
      ;[val, offset] = readF64(data, offset)
      targetValue = val
    } else {
      targetValue = null
    }
  }

  let timeHorizonDays: number
  ;[timeHorizonDays, offset] = readU32(data, offset)

  let useCase: number | null
  {
    let tag: number
    ;[tag, offset] = readU8(data, offset)
    if (tag === 1) {
      let val: number
      ;[val, offset] = readU8(data, offset)
      useCase = val
    } else {
      useCase = null
    }
  }

  let createdFromPromptHash: Uint8Array
  ;[createdFromPromptHash, offset] = readFixedBytes(data, offset, 32)

  return {
    address: address.toBase58(),
    vault: vault.toBase58(),
    targetType,
    targetValue,
    timeHorizonDays,
    useCase,
    createdFromPromptHash,
  }
}

export function decodeExecutionLogAccount(address: PublicKey, data: Buffer): OnChainExecutionLog {
  assertAccountDiscriminator(data, ACCOUNT_DISCRIMINATORS.executionLog, 'ExecutionLog')

  let offset = 8
  let vault: PublicKey
  ;[vault, offset] = readPubkey(data, offset)

  let head: number
  ;[head, offset] = readU32(data, offset)

  let count: number
  ;[count, offset] = readU32(data, offset)

  // Vec<ExecutionLogEntry> length prefix
  let entriesLen: number
  ;[entriesLen, offset] = readU32(data, offset)

  const entries: OnChainExecutionLog['entries'] = []
  for (let i = 0; i < entriesLen; i++) {
    let cycleId: bigint
    ;[cycleId, offset] = readU64(data, offset)

    let timestamp: bigint
    ;[timestamp, offset] = readI64(data, offset)

    let decision: number
    ;[decision, offset] = readU8(data, offset)

    let actionType: number
    ;[actionType, offset] = readU8(data, offset)

    const txSigPrefix = new Uint8Array(data.subarray(offset, offset + 8))
    offset += 8

    entries.push({ cycleId, timestamp, decision, actionType, txSigPrefix })
  }

  return {
    address: address.toBase58(),
    vault: vault.toBase58(),
    head,
    count,
    entries,
  }
}

export function decodeEncryptedStateAccount(address: PublicKey, data: Buffer): OnChainEncryptedState {
  assertAccountDiscriminator(data, ACCOUNT_DISCRIMINATORS.encryptedState, 'EncryptedState')

  let offset = 8
  let vault: PublicKey
  ;[vault, offset] = readPubkey(data, offset)

  // Vec<u8> length prefix
  let dataLen: number
  ;[dataLen, offset] = readU32(data, offset)

  let encryptedData: Uint8Array
  ;[encryptedData, offset] = readFixedBytes(data, offset, dataLen)

  let nonce: Uint8Array
  ;[nonce, offset] = readFixedBytes(data, offset, 24)

  let encryptionKeyVersion: number
  ;[encryptionKeyVersion, offset] = readU32(data, offset)

  let updatedAt: bigint
  ;[updatedAt, offset] = readI64(data, offset)

  return {
    address: address.toBase58(),
    vault: vault.toBase58(),
    encryptedData,
    nonce,
    encryptionKeyVersion,
    updatedAt,
  }
}

export async function fetchVaultAccount(
  connection: Connection,
  vaultAddress: PublicKey,
): Promise<OnChainVault | null> {
  const info = await connection.getAccountInfo(vaultAddress)
  if (!info?.data) return null
  return decodeVaultAccount(vaultAddress, Buffer.from(info.data))
}

export async function fetchAllVaults(
  connection: Connection,
  owner: PublicKey,
  programId: PublicKey = getProgramId(),
): Promise<OnChainVault[]> {
  const all: OnChainVault[] = []

  // 1) getProgramAccounts with memcmp on vault.owner at offset 8.
  //    This catches all vaults using the new nonce-based seed in 1 RPC call.
  try {
    const accounts = await connection.getProgramAccounts(programId, {
      filters: [
        { memcmp: { offset: 8, bytes: owner.toBase58() } },
      ],
    })
    for (const { pubkey, account } of accounts) {
      try {
        const vault = decodeVaultAccount(pubkey, Buffer.from(account.data))
        all.push(vault)
      } catch {
        // skip non-Vault accounts that happen to match the owner bytes
      }
    }
  } catch {
    // fallback if getProgramAccounts isn't supported (light RPCs)
    for (let nonce = 0; nonce < 256; nonce++) {
      const { address } = deriveVaultPda(owner, programId, nonce)
      const info = await connection.getAccountInfo(address)
      if (info?.data) {
        all.push(decodeVaultAccount(address, Buffer.from(info.data)))
      }
    }
  }

  // 2) Legacy fallback — check the old seed [b"vault", owner] (no nonce)
  //    for vaults created before the nonce change.
  const { address: legacyAddress } = deriveVaultPdaLegacy(owner, programId)
  if (!all.some((v) => v.address === legacyAddress.toBase58())) {
    const info = await connection.getAccountInfo(legacyAddress)
    if (info?.data) {
      all.push(decodeVaultAccount(legacyAddress, Buffer.from(info.data)))
    }
  }

  return all
}

export async function fetchVaultByOwner(
  connection: Connection,
  owner: PublicKey,
  programId: PublicKey = getProgramId(),
): Promise<OnChainVault | null> {
  const all = await fetchAllVaults(connection, owner, programId)
  return all[0] ?? null
}

export async function fetchPolicyAccount(
  connection: Connection,
  policyAddress: PublicKey,
): Promise<OnChainPolicy | null> {
  const info = await connection.getAccountInfo(policyAddress)
  if (!info?.data) return null
  return decodePolicyAccount(policyAddress, Buffer.from(info.data))
}

export async function fetchPolicyByVault(
  connection: Connection,
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): Promise<OnChainPolicy | null> {
  const { address } = derivePolicyPda(vault, programId)
  return fetchPolicyAccount(connection, address)
}

export async function fetchPermissionAccount(
  connection: Connection,
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): Promise<OnChainPermission | null> {
  const { address } = derivePermissionPda(vault, programId)
  const info = await connection.getAccountInfo(address)
  if (!info?.data) return null
  return decodePermissionAccount(address, Buffer.from(info.data))
}

export async function fetchEncryptedState(
  connection: Connection,
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): Promise<OnChainEncryptedState | null> {
  const { address } = deriveEncryptedStatePda(vault, programId)
  const info = await connection.getAccountInfo(address)
  if (!info?.data) return null
  return decodeEncryptedStateAccount(address, Buffer.from(info.data))
}

export async function fetchExecutionLogAccount(
  connection: Connection,
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): Promise<OnChainExecutionLog | null> {
  const { address } = deriveExecutionLogPda(vault, programId)
  const info = await connection.getAccountInfo(address)
  if (!info?.data) return null
  return decodeExecutionLogAccount(address, Buffer.from(info.data))
}

export async function fetchVaultGoalAccount(
  connection: Connection,
  vaultGoalAddress: PublicKey,
): Promise<OnChainVaultGoal | null> {
  const info = await connection.getAccountInfo(vaultGoalAddress)
  if (!info?.data) return null
  return decodeVaultGoalAccount(vaultGoalAddress, Buffer.from(info.data))
}

export async function fetchVaultGoalByVault(
  connection: Connection,
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): Promise<OnChainVaultGoal | null> {
  const { address } = deriveVaultGoalPda(vault, programId)
  return fetchVaultGoalAccount(connection, address)
}
