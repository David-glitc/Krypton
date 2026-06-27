import { Connection, PublicKey } from '@solana/web3.js'

export interface ConstraintCheckParams {
  vaultPubkey: PublicKey
  postLeverageBps: bigint
  postConcentrationBps: bigint
  postDrawdownBps: bigint
  postCorrelatedBps: bigint
  targetProtocolId: number
}

export interface ConstraintCheckResult {
  passed: boolean
  error?: string
}

/**
 * Decoded on-chain constraint state layout:
 *   maxLeverageBps: u64 (8 bytes)
 *   maxDrawdownBps: u64 (8 bytes)
 *   maxPositionBps: u64 (8 bytes)
 *   maxCorrelatedExposureBps: u64 (8 bytes)
 *   lastUpdated: i64 (8 bytes)
 *   paused: u8 (1 byte)
 * Total: 41 bytes
 */
interface DecodedConstraintState {
  maxLeverageBps: bigint
  maxDrawdownBps: bigint
  maxPositionBps: bigint
  maxCorrelatedExposureBps: bigint
  lastUpdated: bigint
  paused: boolean
}

function decodeConstraintState(data: Buffer): DecodedConstraintState {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
  return {
    maxLeverageBps: view.getBigUint64(8, true),
    maxDrawdownBps: view.getBigUint64(16, true),
    maxPositionBps: view.getBigUint64(24, true),
    maxCorrelatedExposureBps: view.getBigUint64(32, true),
    lastUpdated: view.getBigInt64(40, true),
    paused: data[48] === 1,
  }
}

export class ConstraintClient {
  private programId: PublicKey

  constructor(
    private connection: Connection,
    programId: string,
  ) {
    this.programId = new PublicKey(programId)
  }

  async checkConstraints(params: ConstraintCheckParams): Promise<ConstraintCheckResult> {
    try {
      const [constraintPubkey] = PublicKey.findProgramAddressSync(
        [Buffer.from('constraint_state'), params.vaultPubkey.toBuffer()],
        this.programId,
      )

      const constraintAccount = await this.connection.getAccountInfo(constraintPubkey)
      if (!constraintAccount) {
        return { passed: false, error: 'Constraint state account not found' }
      }

      const state = decodeConstraintState(constraintAccount.data)

      if (state.paused) {
        return { passed: false, error: 'Vault is paused' }
      }

      if (state.maxLeverageBps !== 0n && params.postLeverageBps > state.maxLeverageBps) {
        return {
          passed: false,
          error: `Leverage ${params.postLeverageBps} bps exceeds max ${state.maxLeverageBps} bps`,
        }
      }

      if (state.maxDrawdownBps !== 0n && params.postDrawdownBps > state.maxDrawdownBps) {
        return {
          passed: false,
          error: `Drawdown ${params.postDrawdownBps} bps exceeds max ${state.maxDrawdownBps} bps`,
        }
      }

      if (state.maxPositionBps !== 0n && params.postConcentrationBps > state.maxPositionBps) {
        return {
          passed: false,
          error: `Concentration ${params.postConcentrationBps} bps exceeds max ${state.maxPositionBps} bps`,
        }
      }

      if (state.maxCorrelatedExposureBps !== 0n && params.postCorrelatedBps > state.maxCorrelatedExposureBps) {
        return {
          passed: false,
          error: `Correlated exposure ${params.postCorrelatedBps} bps exceeds max ${state.maxCorrelatedExposureBps} bps`,
        }
      }

      return { passed: true }
    } catch (e) {
      return { passed: false, error: String(e) }
    }
  }
}
