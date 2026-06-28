import { PublicKey } from '@solana/web3.js'

/** krypton_core program ID (declare_id in lib.rs). */
export const KRYPTON_CORE_PROGRAM_ID = new PublicKey(
  'DQVp9hnnU6zbyPCJbcEnS6F1fWZMQ2yCCH9jL6cFVPxF',
)

export const SYSTEM_PROGRAM_ID = new PublicKey('11111111111111111111111111111111')

/** Anchor instruction discriminators — sha256("global:<name>")[0..8]. */
export const IX_DISCRIMINATORS = {
  createVault: Buffer.from([0x1d, 0xed, 0xf7, 0xd0, 0xc1, 0x52, 0x36, 0x87]),
  submitPolicy: Buffer.from([0x3a, 0xef, 0x7e, 0x1b, 0x55, 0xed, 0x2b, 0x85]),
  checkConstraints: Buffer.from([0x2d, 0x3e, 0xaa, 0x69, 0x61, 0x68, 0x55, 0xf1]),
  executeAction: Buffer.from([0xf6, 0x89, 0x69, 0x71, 0xf7, 0x06, 0xdf, 0xae]),
  pauseVault: Buffer.from([0xfa, 0x06, 0xe4, 0x39, 0x06, 0x68, 0x13, 0xd2]),
  unpauseVault: Buffer.from([0x7d, 0x1d, 0xd5, 0xd5, 0x72, 0x9b, 0x7d, 0x3f]),
  deposit: Buffer.from([0xf2, 0x23, 0xc6, 0x89, 0x52, 0xe1, 0xf2, 0xb6]),
  withdraw: Buffer.from([0xb7, 0x12, 0x46, 0x9c, 0x94, 0x6d, 0xa1, 0x22]),
  amendPolicy: Buffer.from([0x8d, 0x36, 0x46, 0xd3, 0x71, 0xe3, 0x0f, 0x72]),
  storeEncryptedState: Buffer.from([0xab, 0x6c, 0xfe, 0xc7, 0xc0, 0x01, 0xe0, 0xfe]),
  rotateAgentKey: Buffer.from([0x55, 0x1f, 0x11, 0xd4, 0xa2, 0x35, 0x99, 0x73]),
  updateConstraintState: Buffer.from([0x99, 0x09, 0x21, 0xda, 0x10, 0xc8, 0xdd, 0x2d]),
  discloseEncryptedState: Buffer.from([0xbe, 0xe3, 0xb0, 0x08, 0x1e, 0x8f, 0xfd, 0xca]),
  confirmAction: Buffer.from([0x30, 0xb9, 0x29, 0x16, 0xaf, 0x95, 0xf1, 0x78]),
  rejectAction: Buffer.from([0xdc, 0x93, 0xca, 0xc4, 0x36, 0x49, 0x70, 0x5c]),
} as const

/** Anchor account discriminators — sha256("account:<Name>")[0..8]. */
export const ACCOUNT_DISCRIMINATORS = {
  vault: Buffer.from([0xd3, 0x08, 0xe8, 0x2b, 0x02, 0x98, 0x75, 0x77]),
  policy: Buffer.from([0xde, 0x87, 0x07, 0xa3, 0xeb, 0xb1, 0x21, 0x44]),
  permission: Buffer.from([0xac, 0xb1, 0x85, 0x22, 0x07, 0x88, 0x7a, 0x54]),
  encryptedState: Buffer.from([0x28, 0x32, 0x0e, 0x55, 0xd5, 0xf3, 0x7c, 0xad]),
  vaultGoal: Buffer.from([0xac, 0x6c, 0x1d, 0x1e, 0xd6, 0x99, 0x2f, 0x18]),
  executionLog: Buffer.from([0x73, 0x97, 0x34, 0xd5, 0x63, 0xab, 0xc8, 0xf0]),
} as const

/** Matches `ConstraintState` in programs/krypton_core/src/lib.rs. */
export interface ConstraintState {
  maxDrawdownBps: bigint
  maxLeverageBps: bigint
  maxPositionBps: bigint
  maxCorrelatedExposureBps: bigint
  minPoolLiquidityUsd: bigint
  currentDrawdownBps: bigint
  currentLeverageBps: bigint
  currentConcentrationBps: bigint
  currentCorrelatedExposureBps: bigint
  lastOracleUpdate: bigint
  allowedProtocolsBitmap: bigint
  allowedAssetsHash: Uint8Array
}

/** Decoded on-chain `Vault` account. */
export interface OnChainVault {
  address: string
  owner: string
  bump: number
  nonce: number
  policyVersion: number
  paused: boolean
  pauseReason: string | null
  constraint: ConstraintState
  pendingActionId: bigint
  pendingLeverageBps: bigint
  pendingConcentrationBps: bigint
  pendingDrawdownBps: bigint
  pendingCorrelatedBps: bigint
}

/** Decoded on-chain `Policy` account. */
export interface OnChainPolicy {
  address: string
  vault: string
  policyVersion: number
  contentHash: Uint8Array
}

/** Decoded on-chain `PermissionAccount`. */
export interface OnChainPermission {
  address: string
  vault: string
  owner: string
  agentSigner: string
  maxLevel: number
  guardianMultisig: string
}

/** Decoded on-chain `VaultGoal`. */
export interface OnChainVaultGoal {
  address: string
  vault: string
  targetType: number
  targetValue: number | null
  timeHorizonDays: number
  useCase: number | null
  createdFromPromptHash: Uint8Array
}

/** Decoded on-chain `ExecutionLogEntry`. */
export interface OnChainExecutionLogEntry {
  cycleId: bigint
  timestamp: bigint
  decision: number
  actionType: number
  txSigPrefix: Uint8Array
}

/** Decoded on-chain `ExecutionLog`. */
export interface OnChainExecutionLog {
  address: string
  vault: string
  head: number
  count: number
  entries: OnChainExecutionLogEntry[]
}

/** Decoded on-chain `EncryptedState`. */
export interface OnChainEncryptedState {
  address: string
  vault: string
  encryptedData: Uint8Array
  nonce: Uint8Array
  encryptionKeyVersion: number
  updatedAt: bigint
}

export interface CreateVaultArgs {
  nonce: number
  maxDrawdownBps: bigint
  maxLeverageBps: bigint
  maxPositionBps: bigint
  maxCorrelatedExposureBps: bigint
  minPoolLiquidityUsd: bigint
  allowedProtocolsBitmap: bigint
  allowedAssetsHash: Uint8Array
  initialPermissionLevel: number
  goalTargetType: number
  goalTimeHorizonDays: number
  goalUseCase: number
  goalCreatedFromPromptHash: Uint8Array
}

export interface SubmitPolicyArgs {
  maxDrawdownBps: bigint
  maxLeverageBps: bigint
  maxPositionBps: bigint
  maxCorrelatedExposureBps: bigint
  contentHash: Uint8Array
  allowedProtocolsBitmap: bigint
  allowedAssetsHash: Uint8Array
}

export interface ExecuteActionArgs {
  actionType: number
  postLeverageBps: bigint
  postConcentrationBps: bigint
  postDrawdownBps: bigint
  postCorrelatedBps: bigint
  compositeScore: number
  targetProtocolId: number
  isDeRisk: boolean
  requiredLevel: number
}

export interface StoreEncryptedStateArgs {
  encryptedData: Uint8Array
  nonce: Uint8Array
  encryptionKeyVersion: number
}

/** Unsigned transaction bundle for wallet signing. */
export interface CreateVaultTxBundle {
  vaultPda: string
  policyPda?: string
  instructionsBase64: string[]
  transactionBase64: string
}

export function getProgramId(): PublicKey {
  const fromEnv = process.env.NEXT_PUBLIC_KRYPTON_PROGRAM_ID
  if (fromEnv) {
    return new PublicKey(fromEnv)
  }
  return KRYPTON_CORE_PROGRAM_ID
}

import { getPrimaryRpcUrl } from './rpc'

export function getRpcUrl(): string {
  return getPrimaryRpcUrl()
}
