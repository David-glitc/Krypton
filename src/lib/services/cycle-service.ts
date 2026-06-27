import { randomUUID } from 'node:crypto'

import { dbAll, dbGet, dbRun, ensureDbReady, withWriteTransaction } from '@/lib/db'
import type { CycleJob, CycleJobStatus, EnqueueCycleJobInput } from '@/lib/db/types'

export const runtime = 'nodejs'

const DEFAULT_LEASE_MS = 5 * 60 * 1000

export class CycleJobNotFoundError extends Error {
  constructor(jobId: string) {
    super(`Cycle job not found: ${jobId}`)
    this.name = 'CycleJobNotFoundError'
  }
}

export class VaultCycleMutexError extends Error {
  constructor(vaultPubkey: string) {
    super(`Vault ${vaultPubkey} already has an active cycle job`)
    this.name = 'VaultCycleMutexError'
  }
}

function now(): number {
  return Date.now()
}

async function expireStaleLeases(vaultPubkey?: string): Promise<void> {
  const ts = now()

  if (vaultPubkey) {
    await dbRun(
      `UPDATE cycle_jobs
       SET status = 'pending', lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
       WHERE vault_pubkey = ? AND status = 'leased' AND lease_expires_at IS NOT NULL AND lease_expires_at <= ?`,
      [ts, vaultPubkey, ts],
    )
    return
  }

  await dbRun(
    `UPDATE cycle_jobs
     SET status = 'pending', lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
     WHERE status = 'leased' AND lease_expires_at IS NOT NULL AND lease_expires_at <= ?`,
    [ts, ts],
  )
}

async function hasActiveJob(vaultPubkey: string): Promise<boolean> {
  await expireStaleLeases(vaultPubkey)
  const row = await dbGet<{ count: number }>(
    `SELECT COUNT(*) AS count
     FROM cycle_jobs
     WHERE vault_pubkey = ? AND status IN ('pending', 'leased')`,
    [vaultPubkey],
  )
  return (row?.count ?? 0) > 0
}

export async function enqueueCycleJob(input: EnqueueCycleJobInput): Promise<CycleJob> {
  await ensureDbReady()
  await expireStaleLeases(input.vaultPubkey)

  if (await hasActiveJob(input.vaultPubkey)) {
    throw new VaultCycleMutexError(input.vaultPubkey)
  }

  const ts = now()
  const job: CycleJob = {
    id: randomUUID(),
    vault_pubkey: input.vaultPubkey,
    cycle_id: input.cycleId,
    permission_level: input.permissionLevel ?? 2,
    priority: input.priority ?? 0,
    status: 'pending',
    scheduled_at: input.scheduledAt ?? ts,
    lease_owner: null,
    lease_expires_at: null,
    error: null,
    created_at: ts,
    updated_at: ts,
  }

  await dbRun(
    `INSERT INTO cycle_jobs (
      id, vault_pubkey, cycle_id, permission_level, priority, status,
      scheduled_at, lease_owner, lease_expires_at, error, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      job.id,
      job.vault_pubkey,
      job.cycle_id,
      job.permission_level,
      job.priority,
      job.status,
      job.scheduled_at,
      job.lease_owner,
      job.lease_expires_at,
      job.error,
      job.created_at,
      job.updated_at,
    ],
  )

  return job
}

export async function acquireLease(
  vaultPubkey: string,
  workerId: string,
  leaseDurationMs: number = DEFAULT_LEASE_MS,
): Promise<CycleJob | null> {
  await ensureDbReady()

  return withWriteTransaction(async (run, get) => {
    const ts = now()

    await run(
      `UPDATE cycle_jobs
       SET status = 'pending', lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
       WHERE vault_pubkey = ? AND status = 'leased' AND lease_expires_at IS NOT NULL AND lease_expires_at <= ?`,
      [ts, vaultPubkey, ts],
    )

    const existingLease = await get<CycleJob>(
      `SELECT * FROM cycle_jobs
       WHERE vault_pubkey = ? AND status = 'leased' AND lease_expires_at > ?
       LIMIT 1`,
      [vaultPubkey, ts],
    )

    if (existingLease) {
      return existingLease.lease_owner === workerId ? existingLease : null
    }

    const job = await get<CycleJob>(
      `SELECT * FROM cycle_jobs
       WHERE vault_pubkey = ? AND status = 'pending' AND scheduled_at <= ?
       ORDER BY priority DESC, scheduled_at ASC
       LIMIT 1`,
      [vaultPubkey, ts],
    )

    if (!job) {
      return null
    }

    const leaseExpiresAt = ts + leaseDurationMs
    const updated = await run(
      `UPDATE cycle_jobs
       SET status = 'leased', lease_owner = ?, lease_expires_at = ?, updated_at = ?
       WHERE id = ? AND status = 'pending'`,
      [workerId, leaseExpiresAt, ts, job.id],
    )

    if (updated.changes === 0) {
      return null
    }

    return {
      ...job,
      status: 'leased' as CycleJobStatus,
      lease_owner: workerId,
      lease_expires_at: leaseExpiresAt,
      updated_at: ts,
    }
  })
}

export async function acquireNextLease(
  workerId: string,
  leaseDurationMs: number = DEFAULT_LEASE_MS,
): Promise<CycleJob | null> {
  await expireStaleLeases()

  const candidates = await dbAll<{ vault_pubkey: string }>(
    `SELECT vault_pubkey FROM cycle_jobs
     WHERE status = 'pending' AND scheduled_at <= ?
     GROUP BY vault_pubkey
     ORDER BY MAX(priority) DESC, MIN(scheduled_at) ASC`,
    [now()],
  )

  for (const { vault_pubkey } of candidates) {
    const job = await acquireLease(vault_pubkey, workerId, leaseDurationMs)
    if (job) {
      return job
    }
  }

  return null
}

export async function renewLease(
  jobId: string,
  workerId: string,
  leaseDurationMs: number = DEFAULT_LEASE_MS,
): Promise<CycleJob> {
  const ts = now()
  const result = await dbRun(
    `UPDATE cycle_jobs
     SET lease_expires_at = ?, updated_at = ?
     WHERE id = ? AND lease_owner = ? AND status = 'leased'`,
    [ts + leaseDurationMs, ts, jobId, workerId],
  )

  if (result.changes === 0) {
    throw new CycleJobNotFoundError(jobId)
  }

  return getCycleJob(jobId)
}

export async function completeCycleJob(jobId: string): Promise<CycleJob> {
  return setJobTerminalStatus(jobId, 'completed')
}

export async function failCycleJob(jobId: string, error: string): Promise<CycleJob> {
  const ts = now()
  const result = await dbRun(
    `UPDATE cycle_jobs
     SET status = 'failed', error = ?, lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
     WHERE id = ? AND status = 'leased'`,
    [error, ts, jobId],
  )

  if (result.changes === 0) {
    throw new CycleJobNotFoundError(jobId)
  }

  return getCycleJob(jobId)
}

async function setJobTerminalStatus(jobId: string, status: 'completed' | 'failed'): Promise<CycleJob> {
  const ts = now()
  const result = await dbRun(
    `UPDATE cycle_jobs
     SET status = ?, lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
     WHERE id = ? AND status = 'leased'`,
    [status, ts, jobId],
  )

  if (result.changes === 0) {
    throw new CycleJobNotFoundError(jobId)
  }

  return getCycleJob(jobId)
}

export async function getCycleJob(jobId: string): Promise<CycleJob> {
  const job = await dbGet<CycleJob>(`SELECT * FROM cycle_jobs WHERE id = ?`, [jobId])

  if (!job) {
    throw new CycleJobNotFoundError(jobId)
  }

  return job
}

export interface VaultCycleStatus {
  vaultPubkey: string
  activeJob: CycleJob | null
  pendingCount: number
  lastCompleted: CycleJob | null
}

export async function getVaultCycleStatus(vaultPubkey: string): Promise<VaultCycleStatus> {
  await expireStaleLeases(vaultPubkey)

  const activeJob = await dbGet<CycleJob>(
    `SELECT * FROM cycle_jobs
     WHERE vault_pubkey = ? AND status IN ('pending', 'leased')
     ORDER BY CASE status WHEN 'leased' THEN 0 ELSE 1 END, created_at DESC
     LIMIT 1`,
    [vaultPubkey],
  )

  const pendingRow = await dbGet<{ count: number }>(
    `SELECT COUNT(*) AS count FROM cycle_jobs
     WHERE vault_pubkey = ? AND status = 'pending'`,
    [vaultPubkey],
  )

  const lastCompleted = await dbGet<CycleJob>(
    `SELECT * FROM cycle_jobs
     WHERE vault_pubkey = ? AND status IN ('completed', 'failed')
     ORDER BY updated_at DESC
     LIMIT 1`,
    [vaultPubkey],
  )

  return {
    vaultPubkey,
    activeJob: activeJob ?? null,
    pendingCount: pendingRow?.count ?? 0,
    lastCompleted: lastCompleted ?? null,
  }
}

export async function listCycleJobsByVault(vaultPubkey: string, limit = 20): Promise<CycleJob[]> {
  return dbAll<CycleJob>(
    `SELECT * FROM cycle_jobs
     WHERE vault_pubkey = ?
     ORDER BY created_at DESC
     LIMIT ?`,
    [vaultPubkey, limit],
  )
}
