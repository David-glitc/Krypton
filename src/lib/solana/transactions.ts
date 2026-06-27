import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import {
  deriveEncryptedStatePda,
  deriveExecutionLogPda,
  derivePermissionPda,
  derivePolicyPda,
  deriveVaultGoalPda,
  deriveVaultPda,
} from './accounts'
import { writeBool, writeFixedBytes, writeU32, writeU64, writeU8 } from './borsh'
import { KRYPTON_FEE_COLLECTOR } from './fees'
import {
  IX_DISCRIMINATORS,
  SYSTEM_PROGRAM_ID,
  type CreateVaultArgs,
  type CreateVaultTxBundle,
  type ExecuteActionArgs,
  type StoreEncryptedStateArgs,
  type SubmitPolicyArgs,
  getProgramId,
} from './idl'

function encodeCreateVaultArgs(args: CreateVaultArgs): Buffer {
  // 1 x u8 + 6 x u64 + 1 x [u8;32] + 1 x u8 + 1 x u8 + 1 x u32 + 1 x u8 + 1 x [u8;32] = 120 bytes + 8 discriminator
  const buf = Buffer.alloc(8 + 120)
  IX_DISCRIMINATORS.createVault.copy(buf, 0)
  let offset = 8
  offset = writeU8(buf, offset, args.nonce)
  offset = writeU64(buf, offset, args.maxDrawdownBps)
  offset = writeU64(buf, offset, args.maxLeverageBps)
  offset = writeU64(buf, offset, args.maxPositionBps)
  offset = writeU64(buf, offset, args.maxCorrelatedExposureBps)
  offset = writeU64(buf, offset, args.minPoolLiquidityUsd)
  offset = writeU64(buf, offset, args.allowedProtocolsBitmap)
  offset = writeFixedBytes(buf, offset, args.allowedAssetsHash)
  offset = writeU8(buf, offset, args.initialPermissionLevel)
  offset = writeU8(buf, offset, args.goalTargetType)
  offset = writeU32(buf, offset, args.goalTimeHorizonDays)
  offset = writeU8(buf, offset, args.goalUseCase)
  offset = writeFixedBytes(buf, offset, args.goalCreatedFromPromptHash)
  return buf
}

function encodeSubmitPolicyArgs(args: SubmitPolicyArgs): Buffer {
  // 4 x u64 + 1 x [u8;32] + 1 x u64 + 1 x [u8;32] = 32 + 32 + 8 + 32 = 104 + 8 discriminator
  const buf = Buffer.alloc(8 + 104)
  IX_DISCRIMINATORS.submitPolicy.copy(buf, 0)
  let offset = 8
  offset = writeU64(buf, offset, args.maxDrawdownBps)
  offset = writeU64(buf, offset, args.maxLeverageBps)
  offset = writeU64(buf, offset, args.maxPositionBps)
  offset = writeU64(buf, offset, args.maxCorrelatedExposureBps)
  offset = writeFixedBytes(buf, offset, args.contentHash)
  offset = writeU64(buf, offset, args.allowedProtocolsBitmap)
  writeFixedBytes(buf, offset, args.allowedAssetsHash)
  return buf
}

function encodeExecuteActionArgs(args: ExecuteActionArgs): Buffer {
  // 4 x u64 + 1 x u32 + 2 x u8 + 1 x bool + 1 x u8 = 46 bytes + 8 discriminator
  const buf = Buffer.alloc(8 + 46)
  IX_DISCRIMINATORS.executeAction.copy(buf, 0)
  let offset = 8
  offset = writeU8(buf, offset, args.actionType)
  offset = writeU64(buf, offset, args.postLeverageBps)
  offset = writeU64(buf, offset, args.postConcentrationBps)
  offset = writeU64(buf, offset, args.postDrawdownBps)
  offset = writeU64(buf, offset, args.postCorrelatedBps)
  offset = writeU32(buf, offset, args.compositeScore)
  offset = writeU8(buf, offset, args.targetProtocolId)
  offset = writeBool(buf, offset, args.isDeRisk)
  writeU8(buf, offset, args.requiredLevel)
  return buf
}

function encodeStoreEncryptedStateArgs(args: StoreEncryptedStateArgs): Buffer {
  const dataLen = args.encryptedData.length
  const buf = Buffer.alloc(8 + 4 + dataLen + 24 + 4)
  IX_DISCRIMINATORS.storeEncryptedState.copy(buf, 0)
  let offset = 8
  offset = writeU32(buf, offset, dataLen)
  offset = writeFixedBytes(buf, offset, args.encryptedData)
  offset = writeFixedBytes(buf, offset, args.nonce)
  writeU32(buf, offset, args.encryptionKeyVersion)
  return buf
}

export function buildCreateVaultInstruction(
  signer: PublicKey,
  agentSigner: PublicKey,
  guardianMultisig: PublicKey,
  args: CreateVaultArgs,
  programId: PublicKey = getProgramId(),
): { instruction: TransactionInstruction; vaultPda: PublicKey; permissionPda: PublicKey; vaultGoalPda: PublicKey; executionLogPda: PublicKey } {
  const { address: vaultPda } = deriveVaultPda(signer, programId, args.nonce)
  const { address: permissionPda } = derivePermissionPda(vaultPda, programId)
  const { address: vaultGoalPda } = deriveVaultGoalPda(vaultPda, programId)
  const { address: executionLogPda } = deriveExecutionLogPda(vaultPda, programId)

  const instruction = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer, isSigner: true, isWritable: true },
      { pubkey: vaultPda, isSigner: false, isWritable: true },
      { pubkey: permissionPda, isSigner: false, isWritable: true },
      { pubkey: agentSigner, isSigner: false, isWritable: false },
      { pubkey: guardianMultisig, isSigner: false, isWritable: false },
      { pubkey: vaultGoalPda, isSigner: false, isWritable: true },
      { pubkey: executionLogPda, isSigner: false, isWritable: true },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: encodeCreateVaultArgs(args),
  })

  return { instruction, vaultPda, permissionPda, vaultGoalPda, executionLogPda }
}

export function buildSubmitPolicyInstruction(
  signer: PublicKey,
  vaultOwner: PublicKey,
  args: SubmitPolicyArgs,
  programId: PublicKey = getProgramId(),
  nonce: number = 0,
): {
  instruction: TransactionInstruction
  vaultPda: PublicKey
  policyPda: PublicKey
} {
  const { address: vaultPda } = deriveVaultPda(vaultOwner, programId, nonce)
  const { address: policyPda } = derivePolicyPda(vaultPda, programId)

  const instruction = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer, isSigner: true, isWritable: true },
      { pubkey: vaultPda, isSigner: false, isWritable: true },
      { pubkey: policyPda, isSigner: false, isWritable: true },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: encodeSubmitPolicyArgs(args),
  })

  return { instruction, vaultPda, policyPda }
}

export function buildExecuteActionInstruction(
  signer: PublicKey,
  vaultOwner: PublicKey,
  args: ExecuteActionArgs,
  programId: PublicKey = getProgramId(),
  nonce: number = 0,
): TransactionInstruction {
  const { address: vaultPda } = deriveVaultPda(vaultOwner, programId, nonce)
  const { address: policyPda } = derivePolicyPda(vaultPda, programId)
  const { address: permissionPda } = derivePermissionPda(vaultPda, programId)
  const { address: vaultGoalPda } = deriveVaultGoalPda(vaultPda, programId)
  const { address: executionLogPda } = deriveExecutionLogPda(vaultPda, programId)

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer, isSigner: true, isWritable: false },
      { pubkey: vaultPda, isSigner: false, isWritable: true },
      { pubkey: policyPda, isSigner: false, isWritable: false },
      { pubkey: permissionPda, isSigner: false, isWritable: false },
      { pubkey: vaultGoalPda, isSigner: false, isWritable: false },
      { pubkey: executionLogPda, isSigner: false, isWritable: true },
    ],
    data: encodeExecuteActionArgs(args),
  })
}

export function buildStoreEncryptedStateInstruction(
  signer: PublicKey,
  vaultOwner: PublicKey,
  args: StoreEncryptedStateArgs,
  programId: PublicKey = getProgramId(),
  nonce: number = 0,
): TransactionInstruction {
  const { address: vaultPda } = deriveVaultPda(vaultOwner, programId, nonce)
  const { address: encryptedStatePda } = deriveEncryptedStatePda(vaultPda, programId)

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer, isSigner: true, isWritable: true },
      { pubkey: vaultPda, isSigner: false, isWritable: false },
      { pubkey: encryptedStatePda, isSigner: false, isWritable: true },
      { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: encodeStoreEncryptedStateArgs(args),
  })
}

/** Wire-format serialization of a single instruction for wallet adapters. */
export function serializeInstructionToBase64(ix: TransactionInstruction): string {
  const keyCount = ix.keys.length
  const data = Buffer.from(ix.data)
  const buf = Buffer.alloc(1 + keyCount * (32 + 1) + 32 + 4 + data.length)

  let offset = 0
  buf.writeUInt8(keyCount, offset)
  offset += 1

  for (const meta of ix.keys) {
    meta.pubkey.toBuffer().copy(buf, offset)
    offset += 32
    const flags = (meta.isSigner ? 1 : 0) | (meta.isWritable ? 2 : 0)
    buf.writeUInt8(flags, offset)
    offset += 1
  }

  ix.programId.toBuffer().copy(buf, offset)
  offset += 32
  buf.writeUInt32LE(data.length, offset)
  offset += 4
  data.copy(buf, offset)

  return buf.toString('base64')
}

export function serializeInstructionsToBase64(
  instructions: TransactionInstruction[],
  feePayer: PublicKey,
  recentBlockhash: string,
): { instructionsBase64: string[]; transactionBase64: string } {
  const instructionsBase64 = instructions.map(serializeInstructionToBase64)

  const transaction = new Transaction()
  transaction.feePayer = feePayer
  transaction.recentBlockhash = recentBlockhash
  transaction.add(...instructions)

  return {
    instructionsBase64,
    transactionBase64: transaction
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString('base64'),
  }
}

export function buildCreateVaultTxBundle(
  signer: PublicKey,
  agentSigner: PublicKey,
  guardianMultisig: PublicKey,
  args: CreateVaultArgs,
  recentBlockhash: string,
  programId: PublicKey = getProgramId(),
): CreateVaultTxBundle & { vaultGoalPda: string; executionLogPda: string } {
  const { instruction, vaultPda, vaultGoalPda, executionLogPda } = buildCreateVaultInstruction(
    signer, agentSigner, guardianMultisig, args, programId,
  )
  const serialized = serializeInstructionsToBase64([instruction], signer, recentBlockhash)

  return {
    vaultPda: vaultPda.toBase58(),
    vaultGoalPda: vaultGoalPda.toBase58(),
    executionLogPda: executionLogPda.toBase58(),
    ...serialized,
  }
}

export function buildSubmitPolicyTxBundle(
  signer: PublicKey,
  vaultOwner: PublicKey,
  args: SubmitPolicyArgs,
  recentBlockhash: string,
  programId: PublicKey = getProgramId(),
): CreateVaultTxBundle {
  const { instruction, vaultPda, policyPda } = buildSubmitPolicyInstruction(
    signer, vaultOwner, args, programId,
  )
  const serialized = serializeInstructionsToBase64([instruction], signer, recentBlockhash)

  return {
    vaultPda: vaultPda.toBase58(),
    policyPda: policyPda.toBase58(),
    ...serialized,
  }
}

export function buildVaultCreationTxBundle(
  signer: PublicKey,
  agentSigner: PublicKey,
  guardianMultisig: PublicKey,
  createArgs: CreateVaultArgs,
  submitArgs: SubmitPolicyArgs,
  recentBlockhash: string,
  feeLamports: number,
  programId: PublicKey = getProgramId(),
): CreateVaultTxBundle & { policyPda: string; permissionPda: string; vaultGoalPda: string; executionLogPda: string; feeLamports: number } {
  const { instruction: createIx, vaultPda, permissionPda, vaultGoalPda, executionLogPda } = buildCreateVaultInstruction(
    signer, agentSigner, guardianMultisig, createArgs, programId,
  )
  const { instruction: submitIx, policyPda } = buildSubmitPolicyInstruction(
    signer, signer, submitArgs, programId, createArgs.nonce,
  )

  const instructions: TransactionInstruction[] = [createIx, submitIx]

  if (feeLamports > 0) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: signer,
        toPubkey: KRYPTON_FEE_COLLECTOR,
        lamports: feeLamports,
      }),
    )
  }

  const serialized = serializeInstructionsToBase64(instructions, signer, recentBlockhash)

  return {
    vaultPda: vaultPda.toBase58(),
    policyPda: policyPda.toBase58(),
    permissionPda: permissionPda.toBase58(),
    vaultGoalPda: vaultGoalPda.toBase58(),
    executionLogPda: executionLogPda.toBase58(),
    feeLamports,
    ...serialized,
  }
}

/** Build a rotate agent key instruction. */
export function buildRotateAgentKeyInstruction(
  signer: PublicKey,
  vaultOwner: PublicKey,
  newAgentSigner: PublicKey,
  programId: PublicKey = getProgramId(),
  nonce: number = 0,
): TransactionInstruction {
  const { address: vaultPda } = deriveVaultPda(vaultOwner, programId, nonce)
  const { address: permissionPda } = derivePermissionPda(vaultPda, programId)

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer, isSigner: true, isWritable: true },
      { pubkey: vaultPda, isSigner: false, isWritable: true },
      { pubkey: permissionPda, isSigner: false, isWritable: true },
      { pubkey: newAgentSigner, isSigner: false, isWritable: false },
    ],
    data: IX_DISCRIMINATORS.rotateAgentKey,
  })
}

/** Build a confirm action instruction for the two-phase commit. */
export function buildConfirmActionInstruction(
  signer: PublicKey,
  vaultOwner: PublicKey,
  programId: PublicKey = getProgramId(),
  nonce: number = 0,
): TransactionInstruction {
  const { address: vaultPda } = deriveVaultPda(vaultOwner, programId, nonce)
  const { address: permissionPda } = derivePermissionPda(vaultPda, programId)

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer, isSigner: true, isWritable: false },
      { pubkey: vaultPda, isSigner: false, isWritable: true },
      { pubkey: permissionPda, isSigner: false, isWritable: false },
    ],
    data: IX_DISCRIMINATORS.confirmAction,
  })
}

/** Build a reject action instruction for the two-phase commit. */
export function buildRejectActionInstruction(
  signer: PublicKey,
  vaultOwner: PublicKey,
  programId: PublicKey = getProgramId(),
  nonce: number = 0,
): TransactionInstruction {
  const { address: vaultPda } = deriveVaultPda(vaultOwner, programId, nonce)
  const { address: permissionPda } = derivePermissionPda(vaultPda, programId)

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: signer, isSigner: true, isWritable: false },
      { pubkey: vaultPda, isSigner: false, isWritable: true },
      { pubkey: permissionPda, isSigner: false, isWritable: false },
    ],
    data: IX_DISCRIMINATORS.rejectAction,
  })
}
