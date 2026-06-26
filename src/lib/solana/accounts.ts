import { PublicKey } from '@solana/web3.js'

import { getProgramId } from './idl'

const VAULT_SEED = Buffer.from('vault')
const POLICY_SEED = Buffer.from('policy')
const PERMISSION_SEED = Buffer.from('permission')
const ENCRYPTED_SEED = Buffer.from('encrypted')
const VAULT_GOAL_SEED = Buffer.from('vault_goal')
const EXECUTION_LOG_SEED = Buffer.from('execution_log')

export interface VaultPda {
  address: PublicKey
  bump: number
}

export interface PolicyPda {
  address: PublicKey
  bump: number
}

export interface PermissionPda {
  address: PublicKey
  bump: number
}

export interface EncryptedStatePda {
  address: PublicKey
  bump: number
}

export interface VaultGoalPda {
  address: PublicKey
  bump: number
}

export interface ExecutionLogPda {
  address: PublicKey
  bump: number
}

/** Derive vault PDA: seeds `[b"vault", owner]`. */
export function deriveVaultPda(
  owner: PublicKey,
  programId: PublicKey = getProgramId(),
): VaultPda {
  const [address, bump] = PublicKey.findProgramAddressSync(
    [VAULT_SEED, owner.toBuffer()],
    programId,
  )
  return { address, bump }
}

/** Derive policy PDA: seeds `[b"policy", vault]`. */
export function derivePolicyPda(
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): PolicyPda {
  const [address, bump] = PublicKey.findProgramAddressSync(
    [POLICY_SEED, vault.toBuffer()],
    programId,
  )
  return { address, bump }
}

/** Derive permission PDA: seeds `[b"permission", vault]`. */
export function derivePermissionPda(
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): PermissionPda {
  const [address, bump] = PublicKey.findProgramAddressSync(
    [PERMISSION_SEED, vault.toBuffer()],
    programId,
  )
  return { address, bump }
}

/** Derive vault goal PDA: seeds `[b"vault_goal", vault]`. */
export function deriveVaultGoalPda(
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): VaultGoalPda {
  const [address, bump] = PublicKey.findProgramAddressSync(
    [VAULT_GOAL_SEED, vault.toBuffer()],
    programId,
  )
  return { address, bump }
}

/** Derive execution log PDA: seeds `[b"execution_log", vault]`. */
export function deriveExecutionLogPda(
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): ExecutionLogPda {
  const [address, bump] = PublicKey.findProgramAddressSync(
    [EXECUTION_LOG_SEED, vault.toBuffer()],
    programId,
  )
  return { address, bump }
}

/** Derive encrypted state PDA: seeds `[b"encrypted", vault]`. */
export function deriveEncryptedStatePda(
  vault: PublicKey,
  programId: PublicKey = getProgramId(),
): EncryptedStatePda {
  const [address, bump] = PublicKey.findProgramAddressSync(
    [ENCRYPTED_SEED, vault.toBuffer()],
    programId,
  )
  return { address, bump }
}
