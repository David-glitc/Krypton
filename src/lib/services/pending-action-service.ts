import { randomUUID } from 'node:crypto'

import { dbAll, dbGet, dbRun, ensureDbReady } from '@/lib/db'
import type { PendingAction, PendingActionStatus } from '@/lib/db/types'

function now(): number {
  return Date.now()
}

export async function createPendingAction(input: {
  vaultPubkey: string
  cycleId: number
  typedAction: Record<string, unknown>
  expiresAt?: number | null
}): Promise<PendingAction> {
  await ensureDbReady()
  const ts = now()
  const action: PendingAction = {
    id: randomUUID(),
    vault_pubkey: input.vaultPubkey,
    cycle_id: input.cycleId,
    typed_action_json: JSON.stringify(input.typedAction),
    status: 'pending',
    expires_at: input.expiresAt ?? null,
    created_at: ts,
    updated_at: ts,
  }

  await dbRun(
    `INSERT INTO pending_actions (
      id, vault_pubkey, cycle_id, typed_action_json, status, expires_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      action.id,
      action.vault_pubkey,
      action.cycle_id,
      action.typed_action_json,
      action.status,
      action.expires_at,
      action.created_at,
      action.updated_at,
    ],
  )

  return action
}

export async function listPendingActionsByVault(
  vaultPubkey: string,
  status?: PendingActionStatus,
): Promise<PendingAction[]> {
  await ensureDbReady()

  if (status) {
    return dbAll<PendingAction>(
      `SELECT * FROM pending_actions
       WHERE vault_pubkey = ? AND status = ?
       ORDER BY created_at DESC`,
      [vaultPubkey, status],
    )
  }

  return dbAll<PendingAction>(
    `SELECT * FROM pending_actions
     WHERE vault_pubkey = ?
     ORDER BY created_at DESC`,
    [vaultPubkey],
  )
}

export async function updatePendingActionStatus(
  id: string,
  status: PendingActionStatus,
): Promise<PendingAction | null> {
  await ensureDbReady()
  const ts = now()
  const result = await dbRun(
    `UPDATE pending_actions
     SET status = ?, updated_at = ?
     WHERE id = ?`,
    [status, ts, id],
  )

  if (result.changes === 0) {
    return null
  }

  return (await dbGet<PendingAction>(`SELECT * FROM pending_actions WHERE id = ?`, [id])) ?? null
}
