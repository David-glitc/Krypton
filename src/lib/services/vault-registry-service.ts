import { dbAll, dbGet, dbRun, ensureDbReady } from '@/lib/db'
import type { RegisterVaultInput, VaultRegistryEntry } from '@/lib/db/types'

export const runtime = 'nodejs'

export class VaultAlreadyRegisteredError extends Error {
  constructor(vaultPubkey: string) {
    super(`Vault already registered: ${vaultPubkey}`)
    this.name = 'VaultAlreadyRegisteredError'
  }
}

export class VaultNotFoundError extends Error {
  constructor(vaultPubkey: string) {
    super(`Vault not found: ${vaultPubkey}`)
    this.name = 'VaultNotFoundError'
  }
}

function now(): number {
  return Date.now()
}

export async function registerVault(input: RegisterVaultInput): Promise<VaultRegistryEntry> {
  await ensureDbReady()
  const existing = await dbGet(`SELECT vault_pubkey FROM vault_registry WHERE vault_pubkey = ?`, [
    input.vaultPubkey,
  ])

  if (existing) {
    throw new VaultAlreadyRegisteredError(input.vaultPubkey)
  }

  const ts = now()
  const entry: VaultRegistryEntry = {
    vault_pubkey: input.vaultPubkey,
    owner_wallet: input.ownerWallet,
    policy_id: input.policyId ?? null,
    name: input.name ?? null,
    permission_level: input.permissionLevel ?? 2,
    tx_signature: input.txSignature ?? null,
    agent_secret_key: input.agentSecretKey ?? null,
    created_at: ts,
    updated_at: ts,
  }

  await dbRun(
    `INSERT INTO vault_registry (
      vault_pubkey, owner_wallet, policy_id, name,
      permission_level, tx_signature, agent_secret_key, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.vault_pubkey,
      entry.owner_wallet,
      entry.policy_id,
      entry.name,
      entry.permission_level,
      entry.tx_signature,
      entry.agent_secret_key,
      entry.created_at,
      entry.updated_at,
    ],
  )

  return entry
}

export async function getVault(vaultPubkey: string): Promise<VaultRegistryEntry> {
  await ensureDbReady()
  const vault = await dbGet<VaultRegistryEntry>(`SELECT * FROM vault_registry WHERE vault_pubkey = ?`, [
    vaultPubkey,
  ])

  if (!vault) {
    throw new VaultNotFoundError(vaultPubkey)
  }

  return vault
}

export async function getAgentSecretKey(vaultPubkey: string): Promise<string | null> {
  await ensureDbReady()
  const row = await dbGet<{ agent_secret_key: string | null }>(
    `SELECT agent_secret_key FROM vault_registry WHERE vault_pubkey = ?`,
    [vaultPubkey],
  )
  return row?.agent_secret_key ?? null
}

export async function storePendingVaultKey(vaultPubkey: string, agentSecretKey: string): Promise<void> {
  await ensureDbReady()
  await dbRun(
    `INSERT OR REPLACE INTO pending_vault_keys (vault_pubkey, agent_secret_key, created_at)
     VALUES (?, ?, ?)`,
    [vaultPubkey, agentSecretKey, now()],
  )
}

export async function consumePendingVaultKey(vaultPubkey: string): Promise<string | null> {
  await ensureDbReady()
  const row = await dbGet<{ agent_secret_key: string }>(
    `SELECT agent_secret_key FROM pending_vault_keys WHERE vault_pubkey = ?`,
    [vaultPubkey],
  )
  if (row) {
    await dbRun(`DELETE FROM pending_vault_keys WHERE vault_pubkey = ?`, [vaultPubkey])
    return row.agent_secret_key
  }
  return null
}

export async function listVaultsByOwner(ownerWallet: string): Promise<VaultRegistryEntry[]> {
  await ensureDbReady()
  return dbAll<VaultRegistryEntry>(
    `SELECT * FROM vault_registry
     WHERE owner_wallet = ?
     ORDER BY created_at DESC`,
    [ownerWallet],
  )
}

export async function updateVault(
  vaultPubkey: string,
  fields: Partial<Pick<VaultRegistryEntry, 'name' | 'policy_id' | 'permission_level' | 'tx_signature'>>,
): Promise<VaultRegistryEntry> {
  await getVault(vaultPubkey)
  const ts = now()

  await dbRun(
    `UPDATE vault_registry
     SET name = COALESCE(?, name),
         policy_id = COALESCE(?, policy_id),
         permission_level = COALESCE(?, permission_level),
         tx_signature = COALESCE(?, tx_signature),
         updated_at = ?
     WHERE vault_pubkey = ?`,
    [
      fields.name ?? null,
      fields.policy_id ?? null,
      fields.permission_level ?? null,
      fields.tx_signature ?? null,
      ts,
      vaultPubkey,
    ],
  )

  return getVault(vaultPubkey)
}
