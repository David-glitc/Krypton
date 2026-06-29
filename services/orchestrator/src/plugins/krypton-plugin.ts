import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

import { ConstraintClient } from '../constraint-client.js'
import { ExecutionClient, type ExecuteActionParams } from '../execution-client.js'
import type { Character } from '../character/types.js'

export interface ConstraintCheckResult {
  passed: boolean
  error?: string
  postLeverageBps: number
  postConcentrationBps: number
  postDrawdownBps: number
  postCorrelatedBps: number
  targetProtocolId: number
}

export interface SimulationResult {
  candidateId: string
  expectedReturnBps: number
  expectedDrawdownBps: number
  var95Bps: number
  compositeScore: number
  narrative: string
}

export interface VaultState {
  vaultPubkey: string
  navUsd: number
  policyVersion: number
  paused: boolean
  constraintState: {
    maxDrawdownBps: number
    maxLeverageBps: number
    currentDrawdownBps: number
    currentLeverageBps: number
    currentConcentrationBps: number
    lastOracleUpdate: number
  }
  pendingFields: {
    actionId: number
    leverageBps: number
    concentrationBps: number
    drawdownBps: number
    correlatedBps: number
  } | null
  recentCycles: Array<{
    cycleId: number
    decision: string
    timestamp: number
  }>
}

export class KryptonPlugin {
  private constraintClient: ConstraintClient | null = null
  private executionClient: ExecutionClient | null = null
  private connection: Connection | null = null
  private vaultPubkey: string | null = null

  constructor(
    private config: {
      rpcUrl: string
      vaultPubkey?: string
      programId: string
      authorityKeypair?: Keypair
    },
  ) {
    if (config.rpcUrl) {
      this.connection = new Connection(config.rpcUrl, 'confirmed')
      this.constraintClient = new ConstraintClient(
        this.connection,
        config.programId,
      )
      this.executionClient = new ExecutionClient({
        connection: this.connection,
        programId: new PublicKey(config.programId),
      })
    }
    this.vaultPubkey = config.vaultPubkey ?? null
  }

  async constraintCheck(params: {
    vaultPubkey?: string
    postLeverageBps: number
    postConcentrationBps: number
    postDrawdownBps: number
    postCorrelatedBps?: number
    targetProtocolId?: number
  }): Promise<ConstraintCheckResult> {
    if (!this.constraintClient) {
      return { passed: true, postLeverageBps: params.postLeverageBps, postConcentrationBps: params.postConcentrationBps, postDrawdownBps: params.postDrawdownBps, postCorrelatedBps: params.postCorrelatedBps ?? 0, targetProtocolId: params.targetProtocolId ?? 0, error: 'No RPC connection — skipping on-chain check' }
    }

    const vaultPubkey = params.vaultPubkey ?? this.vaultPubkey
    if (!vaultPubkey) {
      return { passed: false, postLeverageBps: params.postLeverageBps, postConcentrationBps: params.postConcentrationBps, postDrawdownBps: params.postDrawdownBps, postCorrelatedBps: params.postCorrelatedBps ?? 0, targetProtocolId: params.targetProtocolId ?? 0, error: 'No vault pubkey configured' }
    }

    try {
      const result = await this.constraintClient.checkConstraints({
        vaultPubkey: new PublicKey(vaultPubkey),
        postLeverageBps: BigInt(params.postLeverageBps),
        postConcentrationBps: BigInt(params.postConcentrationBps),
        postDrawdownBps: BigInt(params.postDrawdownBps),
        postCorrelatedBps: BigInt(params.postCorrelatedBps ?? 0),
        targetProtocolId: params.targetProtocolId ?? 0,
      })

      return {
        passed: result.passed,
        error: result.error,
        postLeverageBps: params.postLeverageBps,
        postConcentrationBps: params.postConcentrationBps,
        postDrawdownBps: params.postDrawdownBps,
        postCorrelatedBps: params.postCorrelatedBps ?? 0,
        targetProtocolId: params.targetProtocolId ?? 0,
      }
    } catch (e) {
      return {
        passed: false,
        error: String(e),
        postLeverageBps: params.postLeverageBps,
        postConcentrationBps: params.postConcentrationBps,
        postDrawdownBps: params.postDrawdownBps,
        postCorrelatedBps: params.postCorrelatedBps ?? 0,
        targetProtocolId: params.targetProtocolId ?? 0,
      }
    }
  }

  /** Decode vault owner + nonce from the vault PDA account (needed for execute_action). */
  async resolveVaultOwner(vaultPubkey: string): Promise<{ owner: PublicKey; nonce: number } | null> {
    const vpk = vaultPubkey ?? this.vaultPubkey
    if (!vpk) return null

    const rpcUrls = [
      this.config.rpcUrl,
      process.env.SOLANA_RPC_FALLBACK_URL,
      'https://api.devnet.solana.com',
    ].filter((url): url is string => Boolean(url))

    for (const rpcUrl of [...new Set(rpcUrls)]) {
      const connection =
        rpcUrl === this.config.rpcUrl && this.connection
          ? this.connection
          : new Connection(rpcUrl, 'confirmed')

      try {
        const accountInfo = await connection.getAccountInfo(new PublicKey(vpk))
        if (!accountInfo) continue
        const decoded = this.decodeVaultAccount(accountInfo.data)
        if (!decoded) continue
        return { owner: decoded.owner, nonce: decoded.nonce }
      } catch {
        continue
      }
    }
    return null
  }

  /** Resolve on-chain permission level for a signer (owner=4, agent=max_level, else 0). */
  async resolveCallerPermission(
    vaultPubkey: string,
    signerPubkey: string,
  ): Promise<{
    callerLevel: number
    owner: string
    agentSigner: string
    maxAgentLevel: number
  } | null> {
    if (!this.connection) return null
    const vaultPk = new PublicKey(vaultPubkey)
    const programId = new PublicKey(this.config.programId)

    const [permissionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('permission'), vaultPk.toBuffer()],
      programId,
    )

    const info = await this.connection.getAccountInfo(permissionPda)
    if (!info || info.data.length < 8 + 32 + 32 + 32 + 1) return null

    let offset = 8
    offset += 32 // vault pubkey in account
    const owner = new PublicKey(info.data.subarray(offset, offset + 32))
    offset += 32
    const agentSigner = new PublicKey(info.data.subarray(offset, offset + 32))
    offset += 32
    const maxAgentLevel = info.data[offset] ?? 0

    const signer = new PublicKey(signerPubkey)
    let callerLevel = 0
    if (signer.equals(owner)) callerLevel = 4
    else if (signer.equals(agentSigner)) callerLevel = maxAgentLevel

    return {
      callerLevel,
      owner: owner.toBase58(),
      agentSigner: agentSigner.toBase58(),
      maxAgentLevel,
    }
  }

  /** Phase 1: approve action on-chain. */
  async approveAction(params: Omit<ExecuteActionParams, 'authority'>): Promise<{ signature: string; actionId: number }> {
    if (!this.executionClient || !this.config.authorityKeypair) {
      throw new Error('ExecutionClient not configured — missing authority keypair or RPC')
    }
    return this.executionClient.approveAction({
      ...params,
      authority: this.config.authorityKeypair,
    })
  }

  /** Phase 2 success: confirm action. */
  async confirmAction(vaultOwner: PublicKey, vaultNonce = 0): Promise<string> {
    if (!this.executionClient || !this.config.authorityKeypair) {
      throw new Error('ExecutionClient not configured')
    }
    return this.executionClient.confirmAction(this.config.authorityKeypair, vaultOwner, vaultNonce)
  }

  /** Phase 2 failure: reject action. */
  async rejectAction(vaultOwner: PublicKey, vaultNonce = 0): Promise<string> {
    if (!this.executionClient || !this.config.authorityKeypair) {
      throw new Error('ExecutionClient not configured')
    }
    return this.executionClient.rejectAction(this.config.authorityKeypair, vaultOwner, vaultNonce)
  }

  /**
   * Decode a Vault account from on-chain data.
   * Layout: discriminator(8) + owner(32) + bump(1) + nonce(1) + policy_version(4)
   *   + paused(1) + pause_reason(Option<String>) + constraint(96)
   *   + pending_action_id(8) + pending_leverage_bps(8) + pending_concentration_bps(8)
   *   + pending_drawdown_bps(8) + pending_correlated_bps(8)
   */
  private decodeVaultAccount(data: Buffer): {
    owner: PublicKey
    bump: number
    nonce: number
    policyVersion: number
    paused: boolean
    constraint: {
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
      allowedAssetsHash: Buffer
    }
    pendingFields: {
      actionId: bigint
      leverageBps: bigint
      concentrationBps: bigint
      drawdownBps: bigint
      correlatedBps: bigint
    }
  } | null {
    try {
      let offset = 8
      const view = new DataView(data.buffer, data.byteOffset, data.byteLength)

      const owner = new PublicKey(data.subarray(offset, offset + 32))
      offset += 32
      const bump = data[offset++]
      const nonce = data[offset++]
      const policyVersion = view.getUint32(offset, true)
      offset += 4
      const paused = data[offset++] === 1
      // Anchor Option<String>: 1-byte tag (0=None, 1=Some), then u32 len + bytes if Some
      const pauseReasonTag = data[offset++]
      if (pauseReasonTag === 1) {
        const pauseReasonLen = view.getUint32(offset, true)
        offset += 4 + pauseReasonLen
      } else if (pauseReasonTag !== 0) {
        return null
      }

      // Pre-upgrade vault accounts are ~171 bytes; constraints start at byte 55
      // (max_drawdown omitted, 7-byte pad after pause_reason).
      const isCompactVault = data.length < 208
      if (isCompactVault) {
        offset = 55
      }

      const readU64 = () => { const v = view.getBigUint64(offset, true); offset += 8; return v }
      const readI64 = () => { const v = view.getBigInt64(offset, true); offset += 8; return v }

      const constraint = isCompactVault
        ? {
            maxDrawdownBps: 0n,
            maxLeverageBps: readU64(),
            maxPositionBps: readU64(),
            maxCorrelatedExposureBps: readU64(),
            minPoolLiquidityUsd: readU64(),
            currentDrawdownBps: readI64(),
            currentLeverageBps: readI64(),
            currentConcentrationBps: readI64(),
            currentCorrelatedExposureBps: readI64(),
            lastOracleUpdate: readI64(),
            allowedProtocolsBitmap: readU64(),
            allowedAssetsHash: offset + 32 <= data.length
              ? Buffer.from(data.subarray(offset, offset + 32))
              : Buffer.alloc(32),
          }
        : {
            maxDrawdownBps: readU64(),
            maxLeverageBps: readU64(),
            maxPositionBps: readU64(),
            maxCorrelatedExposureBps: readU64(),
            minPoolLiquidityUsd: readU64(),
            currentDrawdownBps: readI64(),
            currentLeverageBps: readI64(),
            currentConcentrationBps: readI64(),
            currentCorrelatedExposureBps: readI64(),
            lastOracleUpdate: readI64(),
            allowedProtocolsBitmap: readU64(),
            allowedAssetsHash: Buffer.from(data.subarray(offset, offset + 32)),
          }
      if (!isCompactVault) {
        offset += 32
      } else if (offset + 32 <= data.length) {
        offset += 32
      }

      let pendingFields = {
        actionId: 0n,
        leverageBps: 0n,
        concentrationBps: 0n,
        drawdownBps: 0n,
        correlatedBps: 0n,
      }
      if (offset + 40 <= data.length) {
        pendingFields = {
          actionId: readU64(),
          leverageBps: readU64(),
          concentrationBps: readU64(),
          drawdownBps: readU64(),
          correlatedBps: readU64(),
        }
      }

      return { owner, bump, nonce, policyVersion, paused, constraint, pendingFields }
    } catch {
      return null
    }
  }

  async getVaultState(vaultPubkey?: string): Promise<VaultState | null> {
    const vpk = vaultPubkey ?? this.vaultPubkey
    if (!vpk) return null

    const rpcUrls = [
      this.config.rpcUrl,
      process.env.SOLANA_RPC_FALLBACK_URL,
      'https://api.devnet.solana.com',
    ].filter((url): url is string => Boolean(url))
    const uniqueRpcUrls = [...new Set(rpcUrls)]

    for (const rpcUrl of uniqueRpcUrls) {
      const connection =
        rpcUrl === this.config.rpcUrl && this.connection
          ? this.connection
          : new Connection(rpcUrl, 'confirmed')

      const state = await this.fetchVaultStateFromConnection(connection, vpk)
      if (state) return state
    }

    return null
  }

  private async fetchVaultStateFromConnection(
    connection: Connection,
    vpk: string,
  ): Promise<VaultState | null> {
    try {
      const vaultPubkeyObj = new PublicKey(vpk)
      const accountInfo = await connection.getAccountInfo(vaultPubkeyObj)
      if (!accountInfo) return null

      const decoded = this.decodeVaultAccount(accountInfo.data)
      if (!decoded) return null

      const lamports = await connection.getBalance(vaultPubkeyObj)
      const solBalance = lamports / 1e9

      const pf = decoded.pendingFields
      const hasPending = pf.actionId !== 0n

      return {
        vaultPubkey: vpk,
        navUsd: solBalance,
        policyVersion: decoded.policyVersion,
        paused: decoded.paused,
        constraintState: {
          maxDrawdownBps: Number(decoded.constraint.maxDrawdownBps),
          maxLeverageBps: Number(decoded.constraint.maxLeverageBps),
          currentDrawdownBps: Number(decoded.constraint.currentDrawdownBps),
          currentLeverageBps: Number(decoded.constraint.currentLeverageBps),
          currentConcentrationBps: Number(decoded.constraint.currentConcentrationBps),
          lastOracleUpdate: Number(decoded.constraint.lastOracleUpdate),
        },
        pendingFields: hasPending ? {
          actionId: Number(pf.actionId),
          leverageBps: Number(pf.leverageBps),
          concentrationBps: Number(pf.concentrationBps),
          drawdownBps: Number(pf.drawdownBps),
          correlatedBps: Number(pf.correlatedBps),
        } : null,
        recentCycles: [],
      }
    } catch {
      return null
    }
  }

  async runSimulation(allocation: Record<string, number>): Promise<SimulationResult> {
    const simBin = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../../../../services/krypton-sim-rs/target/release/krypton-sim',
    )

    if (!existsSync(simBin)) {
      return {
        candidateId: 'sim-fallback',
        expectedReturnBps: 0,
        expectedDrawdownBps: 0,
        var95Bps: 0,
        compositeScore: 500,
        narrative: 'Simulation engine not available — using neutral score',
      }
    }

    try {
      const output = execSync(
        `${simBin} simulate --allocation '${JSON.stringify(allocation)}' --output json`,
        { encoding: 'utf-8', timeout: 30000 },
      )
      return JSON.parse(output) as SimulationResult
    } catch (e) {
      return {
        candidateId: 'sim-error',
        expectedReturnBps: 0,
        expectedDrawdownBps: 0,
        var95Bps: 0,
        compositeScore: 500,
        narrative: `Simulation error: ${String(e)}`,
      }
    }
  }

  formatVaultContext(state: VaultState, character: Character): string {
    const c = character.constraints
    const pending = state.pendingFields
    const pendingLine = pending
      ? `Pending action #${pending.actionId}: lev=${pending.leverageBps} conc=${pending.concentrationBps} dd=${pending.drawdownBps} corr=${pending.correlatedBps} bps`
      : 'No pending action'

    return [
      '=== VAULT STATE ===',
      `Vault: ${state.vaultPubkey.slice(0, 8)}...${state.vaultPubkey.slice(-4)}`,
      `Paused: ${state.paused}`,
      `Pending: ${pendingLine}`,
      '',
      '=== CONSTRAINT STATE ===',
      `Drawdown: ${state.constraintState.currentDrawdownBps} / ${state.constraintState.maxDrawdownBps} bps`,
      `Leverage: ${state.constraintState.currentLeverageBps} / ${state.constraintState.maxLeverageBps} bps`,
      `Concentration: ${state.constraintState.currentConcentrationBps} / ${c?.maxPositionBps ?? 3500} bps`,
      '',
      '=== POLICY LIMITS ===',
      `Max leverage: ${c?.maxLeverageBps ? `${c.maxLeverageBps / 1000}x` : 'N/A'}`,
      `Max drawdown: ${c?.maxDrawdownBps ? `${c.maxDrawdownBps / 100}%` : 'N/A'}`,
      `Allowed protocols: ${c?.allowedProtocols.join(', ') ?? 'none'}`,
      `Allowed actions: ${c?.allowedActions.join(', ') ?? 'none'}`,
      `Allowed assets: ${c?.allowedAssets.join(', ') ?? 'none'}`,
      `Rebalance: ${c?.rebalanceFrequency ?? 'N/A'}`,
      '',
      'Before any action, call constraint_check() with your proposed params.',
    ].join('\n')
  }
}
