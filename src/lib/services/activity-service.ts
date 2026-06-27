import { randomUUID } from 'node:crypto'

import { dbAll, dbGet, dbRun, ensureDbReady, usesRemoteDb, withWriteTransaction } from '@/lib/db'
import type { ActivityEvent, AppendActivityInput } from '@/lib/db/types'

export const runtime = 'nodejs'

function now(): number {
  return Date.now()
}

export async function appendActivityEvent(input: AppendActivityInput): Promise<ActivityEvent> {
  await ensureDbReady()
  const event: ActivityEvent = {
    id: randomUUID(),
    vault_pubkey: input.vaultPubkey,
    event_type: input.eventType,
    payload_json: JSON.stringify(input.payload ?? {}),
    created_at: now(),
  }

  await dbRun(
    `INSERT INTO activity_events (id, vault_pubkey, event_type, payload_json, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [event.id, event.vault_pubkey, event.event_type, event.payload_json, event.created_at],
  )

  return event
}

export async function listActivityByVault(
  vaultPubkey: string,
  options?: { limit?: number; offset?: number },
): Promise<ActivityEvent[]> {
  await ensureDbReady()
  const limit = options?.limit ?? 50
  const offset = options?.offset ?? 0

  return dbAll<ActivityEvent>(
    `SELECT * FROM activity_events
     WHERE vault_pubkey = ?
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [vaultPubkey, limit, offset],
  )
}

export async function getActivityEvent(eventId: string): Promise<ActivityEvent | null> {
  await ensureDbReady()
  return (await dbGet<ActivityEvent>(`SELECT * FROM activity_events WHERE id = ?`, [eventId])) ?? null
}

export function parseActivityPayload<T extends Record<string, unknown> = Record<string, unknown>>(
  event: ActivityEvent,
): T {
  try {
    return JSON.parse(event.payload_json) as T
  } catch {
    return {} as T
  }
}
