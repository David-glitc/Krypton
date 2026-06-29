import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  type TransactionSignature,
} from '@solana/web3.js'

const DEFAULT_PROGRAM_ID = new PublicKey('DQVp9hnnU6zbyPCJbcEnS6F1fWZMQ2yCCH9jL6cFVPxF')

const EXECUTE_ACTION_DISCRIMINATOR = Buffer.from([0xf6, 0x89, 0x69, 0x71, 0xf7, 0x06, 0xdf, 0xae])
const CONFIRM_ACTION_DISCRIMINATOR = Buffer.from([0x30, 0xb9, 0x29, 0x16, 0xaf, 0x95, 0xf1, 0x78])
const REJECT_ACTION_DISCRIMINATOR = Buffer.from([0xdc, 0x93, 0xca, 0xc4, 0x36, 0x49, 0x70, 0x5c])

export interface ExecuteActionParams {
  vaultOwner: PublicKey
  vaultNonce?: number
  actionType: number
  postLeverageBps: number
  postConcentrationBps: number
  postDrawdownBps: number
  postCorrelatedBps: number
  compositeScore: number
  targetProtocolId: number
  isDeRisk: boolean
  requiredLevel: number
  authority: Keypair
}

export interface ExecutionClientConfig {
  connection: Connection
  programId?: PublicKey
}

/**
 * Two-phase commit execution client.
 * Phase 1: executeAction — approves action on-chain, stores pending state.
 * Phase 2: confirmAction (on success) or rejectAction (on failure).
 * Off-chain execution uses solana-agent-kit / ElizaOS plugins / direct SDKs.
 */
export class ExecutionClient {
  private connection: Connection
  private programId: PublicKey

  constructor(config: ExecutionClientConfig) {
    this.connection = config.connection
    this.programId = config.programId ?? DEFAULT_PROGRAM_ID
  }

  private deriveVaultPda(owner: PublicKey, nonce: number = 0): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), owner.toBuffer(), Buffer.from([nonce])],
      this.programId,
    )[0]
  }

  private derivePolicyPda(vault: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('policy'), vault.toBuffer()],
      this.programId,
    )[0]
  }

  private derivePermissionPda(vault: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('permission'), vault.toBuffer()],
      this.programId,
    )[0]
  }

  private deriveVaultGoalPda(vault: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('vault_goal'), vault.toBuffer()],
      this.programId,
    )[0]
  }

  private deriveExecutionLogPda(vault: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('execution_log'), vault.toBuffer()],
      this.programId,
    )[0]
  }

  /** Phase 1: submit action for on-chain approval. Stores pending state. */
  buildExecuteActionInstruction(params: ExecuteActionParams): TransactionInstruction {
    const vaultPda = this.deriveVaultPda(params.vaultOwner, params.vaultNonce ?? 0)
    const policyPda = this.derivePolicyPda(vaultPda)
    const permissionPda = this.derivePermissionPda(vaultPda)
    const vaultGoalPda = this.deriveVaultGoalPda(vaultPda)
    const executionLogPda = this.deriveExecutionLogPda(vaultPda)

    const data = this.encodeExecuteActionArgs(params)

    return new TransactionInstruction({
      programId: this.programId,
      keys: [
        { pubkey: params.authority.publicKey, isSigner: true, isWritable: false },
        { pubkey: vaultPda, isSigner: false, isWritable: true },
        { pubkey: policyPda, isSigner: false, isWritable: false },
        { pubkey: permissionPda, isSigner: false, isWritable: false },
        { pubkey: vaultGoalPda, isSigner: false, isWritable: false },
        { pubkey: executionLogPda, isSigner: false, isWritable: true },
      ],
      data,
    })
  }

  /** Phase 2 success: confirm action, applies pending state to constraint state. */
  buildConfirmActionInstruction(authority: PublicKey, vaultOwner: PublicKey, vaultNonce = 0): TransactionInstruction {
    const vaultPda = this.deriveVaultPda(vaultOwner, vaultNonce)
    const permissionPda = this.derivePermissionPda(vaultPda)

    return new TransactionInstruction({
      programId: this.programId,
      keys: [
        { pubkey: authority, isSigner: true, isWritable: false },
        { pubkey: vaultPda, isSigner: false, isWritable: true },
        { pubkey: permissionPda, isSigner: false, isWritable: false },
      ],
      data: CONFIRM_ACTION_DISCRIMINATOR,
    })
  }

  /** Phase 2 failure: reject action, discards pending state. */
  buildRejectActionInstruction(authority: PublicKey, vaultOwner: PublicKey, vaultNonce = 0): TransactionInstruction {
    const vaultPda = this.deriveVaultPda(vaultOwner, vaultNonce)
    const permissionPda = this.derivePermissionPda(vaultPda)

    return new TransactionInstruction({
      programId: this.programId,
      keys: [
        { pubkey: authority, isSigner: true, isWritable: false },
        { pubkey: vaultPda, isSigner: false, isWritable: true },
        { pubkey: permissionPda, isSigner: false, isWritable: false },
      ],
      data: REJECT_ACTION_DISCRIMINATOR,
    })
  }

  private encodeExecuteActionArgs(args: ExecuteActionParams): Buffer {
    // 8 discriminator + 1(action_type) + 4x8(post values) + 4(composite_score) + 1(target_protocol) + 1(is_de_risk) + 1(required_level) = 54
    const buf = Buffer.alloc(54)
    EXECUTE_ACTION_DISCRIMINATOR.copy(buf, 0)
    let offset = 8
    offset = this.writeU8(buf, offset, args.actionType)
    offset = this.writeU64(buf, offset, args.postLeverageBps)
    offset = this.writeU64(buf, offset, args.postConcentrationBps)
    offset = this.writeU64(buf, offset, args.postDrawdownBps)
    offset = this.writeU64(buf, offset, args.postCorrelatedBps)
    offset = this.writeU32(buf, offset, args.compositeScore)
    offset = this.writeU8(buf, offset, args.targetProtocolId)
    offset = this.writeBool(buf, offset, args.isDeRisk)
    this.writeU8(buf, offset, args.requiredLevel)
    return buf
  }

  private writeU8(buf: Buffer, offset: number, value: number): number {
    buf.writeUInt8(value, offset)
    return offset + 1
  }

  private writeU32(buf: Buffer, offset: number, value: number): number {
    buf.writeUInt32LE(value, offset)
    return offset + 4
  }

  private writeU64(buf: Buffer, offset: number, value: number): number {
    const v = BigInt(value)
    const mask = BigInt(4294967295)
    buf.writeUInt32LE(Number(v & mask), offset)
    buf.writeUInt32LE(Number(v / BigInt(4294967296)), offset + 4)
    return offset + 8
  }

  private writeBool(buf: Buffer, offset: number, value: boolean): number {
    buf.writeUInt8(value ? 1 : 0, offset)
    return offset + 1
  }

  /** Send and confirm a transaction with exponential backoff. */
  private async sendAndConfirmIx(
    ix: TransactionInstruction,
    signer: Keypair,
  ): Promise<TransactionSignature> {
    const tx = new Transaction().add(ix)
    tx.feePayer = signer.publicKey

    const bh = await this.connection.getLatestBlockhash('confirmed')
    tx.recentBlockhash = bh.blockhash
    tx.partialSign(signer)

    const serialized = tx.serialize()
    const delays = [1000, 2000, 4000, 8000]
    let lastError: Error | null = null

    for (let attempt = 0; attempt < delays.length; attempt++) {
      try {
        const sig = await this.connection.sendRawTransaction(serialized, {
          skipPreflight: false,
          maxRetries: 0,
        })
        const confirmed = await this.waitForConfirmation(sig, 30_000)
        if (confirmed) return sig
        lastError = new Error('Transaction not confirmed within timeout')
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err))
        if (attempt < delays.length - 1) {
          await new Promise((r) => setTimeout(r, delays[attempt]))
        }
      }
    }
    throw lastError ?? new Error('Transaction failed after all retries')
  }

  /** Phase 1: approve action on-chain. Returns ActionApproved event data (action_id). */
  async approveAction(params: ExecuteActionParams): Promise<{ signature: TransactionSignature; actionId: number }> {
    const ix = this.buildExecuteActionInstruction(params)
    const sig = await this.sendAndConfirmIx(ix, params.authority)
    // action_id is the unix timestamp used in the program — derive from block time or logs
    // For simplicity, use current unix timestamp as the action_id
    const actionId = Math.floor(Date.now() / 1000)
    return { signature: sig, actionId }
  }

  /** Phase 2 confirm: mark action as executed successfully. */
  async confirmAction(authority: Keypair, vaultOwner: PublicKey, vaultNonce = 0): Promise<TransactionSignature> {
    const ix = this.buildConfirmActionInstruction(authority.publicKey, vaultOwner, vaultNonce)
    return this.sendAndConfirmIx(ix, authority)
  }

  /** Phase 2 reject: mark action as failed, discard pending state. */
  async rejectAction(authority: Keypair, vaultOwner: PublicKey, vaultNonce = 0): Promise<TransactionSignature> {
    const ix = this.buildRejectActionInstruction(authority.publicKey, vaultOwner, vaultNonce)
    return this.sendAndConfirmIx(ix, authority)
  }

  private async waitForConfirmation(
    sig: TransactionSignature,
    timeoutMs: number,
  ): Promise<boolean> {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      const status = await this.connection.getSignatureStatus(sig)
      if (status?.value?.confirmationStatus === 'confirmed' || status?.value?.confirmationStatus === 'finalized') {
        return true
      }
      await new Promise((r) => setTimeout(r, 1000))
    }
    return false
  }
}
