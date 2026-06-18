import type { VaultSummary, PendingAction, ConstraintState } from '@krypton/sdk'
import { RPC_URL, KRYPTON_PROGRAM_ID } from '@krypton/sdk'
import { Connection, PublicKey } from '@solana/web3.js'
import {
  DEMO_VAULTS,
  DEMO_PENDING_ACTIONS,
  NAV_HISTORY,
  getVault as getMockVault,
} from './mock-data'

// ---------------------------------------------------------------------------
// Vault account layout (Anchor-derived, on-chain byte offsets)
// ---------------------------------------------------------------------------
// Anchor discriminator: 8 bytes
// owner:                32 bytes
// --- Vault fields follow ---
// nav_usd:              u64  (8 bytes, little-endian)
// permission_level:     u8
// policy_version:       u32
// paused:                u8  (0 = false, 1 = true)
// constraint_state:
//   current_drawdown_bps:              u32
//   max_drawdown_bps:                  u32
//   current_leverage_bps:              u32
//   max_leverage_bps:                  u32
//   current_position_concentration_bps: u32
//   max_position_bps:                  u32

const DISC_SIZE = 8
const OWNER_SIZE = 32
const OFFSET_NAV = DISC_SIZE + OWNER_SIZE
const OFFSET_PERM = OFFSET_NAV + 8
const OFFSET_POLICY_VERSION = OFFSET_PERM + 1
const OFFSET_PAUSED = OFFSET_POLICY_VERSION + 4
const CONSTRAINT_BASE = OFFSET_PAUSED + 1
const CONSTRAINT_FIELD_SIZE = 4 // u32

const CONSTRAINT_FIELDS = [
  'currentDrawdownBps',
  'maxDrawdownBps',
  'currentLeverageBps',
  'maxLeverageBps',
  'currentPositionConcentrationBps',
  'maxPositionBps',
] as const

type ConstraintNumericKey = (typeof CONSTRAINT_FIELDS)[number]

function readU64LE(buf: Uint8Array, offset: number): number {
  let result = 0
  for (let i = 0; i < 8; i++) {
    result |= buf[offset + i] << (i * 8)
  }
  return result
}

function readU32LE(buf: Uint8Array, offset: number): number {
  return (
    (buf[offset] |
      (buf[offset + 1] << 8) |
      (buf[offset + 2] << 16) |
      (buf[offset + 3] << 24)) >>>
    0
  )
}

/**
 * Parse a Solana account buffer into vault fields.
 * Returns null if the buffer is too short or contains implausible values.
 */
function parseVaultAccount(buf: Uint8Array): {
  navUsd: number
  permissionLevel: number
  policyVersion: number
  paused: boolean
  constraint: ConstraintState
} | null {
  const minLen =
    CONSTRAINT_BASE + CONSTRAINT_FIELDS.length * CONSTRAINT_FIELD_SIZE
  if (buf.length < minLen) return null

  const navUsd = readU64LE(buf, OFFSET_NAV)
  const permissionLevel = buf[OFFSET_PERM]
  const policyVersion = readU32LE(buf, OFFSET_POLICY_VERSION)
  const paused = buf[OFFSET_PAUSED] !== 0

  // Build constraint with index-assignment to satisfy TS readonly inference.
  const constraint = {
    currentDrawdownBps: 0,
    maxDrawdownBps: 0,
    currentLeverageBps: 0,
    maxLeverageBps: 0,
    currentPositionConcentrationBps: 0,
    maxPositionBps: 0,
  } as ConstraintState & Record<ConstraintNumericKey, number>

  for (let i = 0; i < CONSTRAINT_FIELDS.length; i++) {
    const field = CONSTRAINT_FIELDS[i]
    const value = readU32LE(buf, CONSTRAINT_BASE + i * CONSTRAINT_FIELD_SIZE)
    // Unreasonably large values (except leverage which can be 20000+ bps)
    // indicate we're not looking at a real Vault account.
    if (value > 1_000_000 && field !== 'currentLeverageBps' && field !== 'maxLeverageBps') {
      return null
    }
    constraint[field] = value
  }

  return { navUsd, permissionLevel, policyVersion, paused, constraint }
}

// ---------------------------------------------------------------------------
// PDA helper
// ---------------------------------------------------------------------------

/**
 * Derive the Vault PDA for a given owner.
 * seeds = [b"vault", owner_pubkey]
 */
function deriveVaultPda(owner: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), owner.toBuffer()],
    new PublicKey(KRYPTON_PROGRAM_ID)
  )
  return pda
}

// ---------------------------------------------------------------------------
// Public data-access functions
// ---------------------------------------------------------------------------

/**
 * Fetch all vaults owned by `walletAddress`.
 *
 * Tries getProgramAccounts with an owner memcmp filter.  Any error
 * (CORS, rate-limit, network, parse failure) falls back to DEMO_VAULTS.
 */
export async function fetchVaults(walletAddress: string): Promise<VaultSummary[]> {
  try {
    if (!walletAddress) return DEMO_VAULTS

    const owner = new PublicKey(walletAddress)
    const connection = new Connection(RPC_URL, 'confirmed')
    const programId = new PublicKey(KRYPTON_PROGRAM_ID)
    const vaultPda = deriveVaultPda(owner)

    const accounts = await connection.getProgramAccounts(programId, {
      filters: [
        {
          memcmp: {
            offset: DISC_SIZE, // right after discriminator = owner field
            bytes: owner.toBase58(),
          },
        },
      ],
    })

    if (accounts.length === 0) {
      return [] // No vaults found — don't lie with demo data
    }

    const parsed: VaultSummary[] = []
    for (const acc of accounts) {
      const info = parseVaultAccount(acc.account.data)
      if (!info) continue

      parsed.push({
        id: acc.pubkey.toBase58(),
        name: `vault-${acc.pubkey.toBase58().slice(0, 8)}`,
        navUsd: info.navUsd,
        permissionLevel: info.permissionLevel,
        policyVersion: info.policyVersion,
        constraint: info.constraint,
      })
    }

    return parsed.length > 0 ? parsed : DEMO_VAULTS
  } catch {
    return DEMO_VAULTS
  }
}

/**
 * Fetch a single vault by its on-chain PDA string.
 *
 * Falls back to mock-data getVault when the RPC call fails.
 */
export async function fetchVault(id: string): Promise<VaultSummary | undefined> {
  try {
    if (!id) return getMockVault(id)

    const connection = new Connection(RPC_URL, 'confirmed')
    const pubkey = new PublicKey(id)
    const account = await connection.getAccountInfo(pubkey)

    if (!account) return getMockVault(id)

    const info = parseVaultAccount(account.data)
    if (!info) return getMockVault(id)

    return {
      id,
      name: `vault-${id.slice(0, 8)}`,
      navUsd: info.navUsd,
      permissionLevel: info.permissionLevel,
      policyVersion: info.policyVersion,
      constraint: info.constraint,
    }
  } catch {
    return getMockVault(id)
  }
}

/**
 * Fetch pending actions for a vault.
 *
 * Falls back to DEMO_PENDING_ACTIONS[vaultId] (or an empty array).
 */
export async function fetchActivity(vaultId: string): Promise<PendingAction[]> {
  try {
    const connection = new Connection(RPC_URL, 'confirmed')
    const programId = new PublicKey(KRYPTON_PROGRAM_ID)

    // Query ActionExecuted events via transaction logs
    const signatures = await connection.getSignaturesForAddress(
      programId,
      { limit: 20 },
    )

    if (signatures.length === 0) {
      return DEMO_PENDING_ACTIONS[vaultId] ?? []
    }

    // Parse transaction logs for ActionExecuted events
    const actions: PendingAction[] = []
    for (const sig of signatures.slice(0, 10)) {
      try {
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        })
        if (!tx?.meta?.logMessages) continue

        for (const log of tx.meta.logMessages) {
          if (log.includes('ActionExecuted')) {
            actions.push({
              id: `action-${sig.signature.slice(0, 8)}`,
              vaultId,
              cycleId: 0,
              actionType: 'Swap',
              rationale: `On-chain action (${sig.signature.slice(0, 16)}...)`,
              expectedReturnPct: 0,
              expectedDrawdownPct: 0,
              var95Pct: 0,
              compositeScore: 0,
              postLeverageBps: 0,
              postConcentrationBps: 0,
              createdAt: new Date(sig.blockTime! * 1000).toISOString(),
            })
          }
        }
      } catch {
        continue
      }
    }

    return actions.length > 0 ? actions : DEMO_PENDING_ACTIONS[vaultId] ?? []
  } catch {
    return DEMO_PENDING_ACTIONS[vaultId] ?? []
  }
}

export async function fetchNavHistory(
  vaultId: string,
): Promise<{ date: string; nav: number }[]> {
  try {
    void vaultId // reserved for future indexer use
    // TODO: query on-chain NAV history from deposit/withdrawal events
    return NAV_HISTORY
  } catch {
    return NAV_HISTORY
  }
}
