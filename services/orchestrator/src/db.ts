import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

import { createClient, type Client } from '@libsql/client'
import Database from 'better-sqlite3'

function usesRemoteDb(): boolean {
  return Boolean(process.env.LIBSQL_URL)
}

function resolveDbPath(): string {
  if (process.env.KRYPTON_DB_PATH) {
    return process.env.KRYPTON_DB_PATH
  }
  return path.resolve(process.cwd(), '../../.data/krypton.db')
}

function resolveSchemaPath(): string {
  return path.resolve(process.cwd(), '../../src/lib/db/schema.sql')
}

function loadSchemaStatements(): string[] {
  const schema = fs.readFileSync(resolveSchemaPath(), 'utf8')
  const withoutLineComments = schema
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')

  return withoutLineComments
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0 && !statement.toUpperCase().startsWith('PRAGMA'))
}

let libsqlClient: Client | null = null
let sqliteDb: Database.Database | null = null
let initPromise: Promise<void> | null = null

function getLibsqlClient(): Client {
  if (!libsqlClient) {
    libsqlClient = createClient({
      url: process.env.LIBSQL_URL!,
      authToken: process.env.LIBSQL_AUTH_TOKEN,
    })
  }
  return libsqlClient
}

function getSqliteDb(): Database.Database {
  if (!sqliteDb) {
    const dbPath = resolveDbPath()
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    sqliteDb = new Database(dbPath)
    sqliteDb.pragma('journal_mode = WAL')
    sqliteDb.pragma('foreign_keys = ON')
    sqliteDb.exec(fs.readFileSync(resolveSchemaPath(), 'utf8'))
  }
  return sqliteDb
}

export async function ensureDbReady(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      if (usesRemoteDb()) {
        const client = getLibsqlClient()
        for (const statement of loadSchemaStatements()) {
          await client.execute(statement)
        }
        return
      }
      getSqliteDb()
    })()
  }
  await initPromise
}

export type OrchestratorDb = Database.Database | Client

export async function openDb(): Promise<OrchestratorDb> {
  await ensureDbReady()
  return usesRemoteDb() ? getLibsqlClient() : getSqliteDb()
}

export interface CycleJobRow {
  id: string
  vault_pubkey: string
  cycle_id: number
  permission_level: number
  priority: number
}

export interface CycleRunRow {
  id: string
  vault_pubkey: string
  cycle_id: number
  job_id: string
  stage: string
  decision: string | null
  started_at: number
  completed_at: number | null
  error: string | null
}

export interface AgentInvocationInsert {
  id: string
  vault_pubkey: string | null
  cycle_id: number | null
  session_id: string | null
  agent_role: string
  model_id: string | null
  prompt_hash: string | null
  response_hash: string | null
  cost_usd: number | null
  latency_ms: number | null
  status: string
  arweave_uri: string | null
  created_at: number
}

export interface PendingActionInsert {
  id: string
  vault_pubkey: string
  cycle_id: number
  typed_action_json: string
  status: string
  expires_at: number | null
  created_at: number
  updated_at: number
}

export async function leaseNextCycleJob(
  leaseOwner: string,
  nowMs: number,
): Promise<CycleJobRow | null> {
  await ensureDbReady()

  if (usesRemoteDb()) {
    const client = getLibsqlClient()
    const txn = await client.transaction('write')

    try {
      await txn.execute({
        sql: `UPDATE cycle_jobs
              SET status = 'pending', lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
              WHERE status = 'leased' AND lease_expires_at IS NOT NULL AND lease_expires_at <= ?`,
        args: [nowMs, nowMs],
      })

      const candidate = await txn.execute({
        sql: `SELECT id, vault_pubkey, cycle_id, permission_level, priority
              FROM cycle_jobs
              WHERE status = 'pending' AND scheduled_at <= ?
              ORDER BY priority DESC, scheduled_at ASC
              LIMIT 1`,
        args: [nowMs],
      })

      if (candidate.rows.length === 0) {
        await txn.commit()
        return null
      }

      const row = candidate.rows[0] as unknown as CycleJobRow
      const leaseExpiresAt = nowMs + 5 * 60 * 1000
      const updated = await txn.execute({
        sql: `UPDATE cycle_jobs
              SET status = 'leased', lease_owner = ?, lease_expires_at = ?, updated_at = ?
              WHERE id = ? AND status = 'pending'`,
        args: [leaseOwner, leaseExpiresAt, nowMs, row.id],
      })

      await txn.commit()
      return updated.rowsAffected === 1 ? row : null
    } catch (error) {
      await txn.rollback()
      throw error
    }
  }

  const db = getSqliteDb()
  const transaction = db.transaction(() => {
    db.prepare(
      `UPDATE cycle_jobs
       SET status = 'pending', lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
       WHERE status = 'leased' AND lease_expires_at IS NOT NULL AND lease_expires_at <= ?`,
    ).run(nowMs, nowMs)

    const row = db
      .prepare(
        `SELECT id, vault_pubkey, cycle_id, permission_level, priority
         FROM cycle_jobs
         WHERE status = 'pending' AND scheduled_at <= ?
         ORDER BY priority DESC, scheduled_at ASC
         LIMIT 1`,
      )
      .get(nowMs) as CycleJobRow | undefined

    if (!row) {
      return null
    }

    const leaseExpiresAt = nowMs + 5 * 60 * 1000
    const updated = db
      .prepare(
        `UPDATE cycle_jobs
         SET status = 'leased', lease_owner = ?, lease_expires_at = ?, updated_at = ?
         WHERE id = ? AND status = 'pending'`,
      )
      .run(leaseOwner, leaseExpiresAt, nowMs, row.id)

    return updated.changes === 1 ? row : null
  })

  return transaction()
}

async function remoteExecute(sql: string, args: unknown[]): Promise<void> {
  await getLibsqlClient().execute({ sql, args: args as never[] })
}

export async function insertCycleRun(row: CycleRunRow): Promise<void> {
  await ensureDbReady()
  const sql = `INSERT INTO cycle_runs (
    id, vault_pubkey, cycle_id, job_id, stage, decision, started_at, completed_at, error
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const args = [
    row.id,
    row.vault_pubkey,
    row.cycle_id,
    row.job_id,
    row.stage,
    row.decision,
    row.started_at,
    row.completed_at,
    row.error,
  ]

  if (usesRemoteDb()) {
    await remoteExecute(sql, args)
    return
  }

  getSqliteDb().prepare(sql).run(...args)
}

export async function updateCycleRunCompletion(
  cycleRunId: string,
  completedAt: number,
  decision: string | null,
  error: string | null,
): Promise<void> {
  await ensureDbReady()
  const sql = `UPDATE cycle_runs
     SET completed_at = ?, decision = ?, error = ?
     WHERE id = ?`
  const args = [completedAt, decision, error, cycleRunId]

  if (usesRemoteDb()) {
    await remoteExecute(sql, args)
    return
  }

  getSqliteDb().prepare(sql).run(...args)
}

export async function insertAgentInvocation(row: AgentInvocationInsert): Promise<void> {
  await ensureDbReady()
  const sql = `INSERT INTO agent_invocations (
    id, vault_pubkey, cycle_id, session_id, agent_role, model_id, prompt_hash,
    response_hash, cost_usd, latency_ms, status, arweave_uri, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const args = [
    row.id,
    row.vault_pubkey,
    row.cycle_id,
    row.session_id,
    row.agent_role,
    row.model_id,
    row.prompt_hash,
    row.response_hash,
    row.cost_usd,
    row.latency_ms,
    row.status,
    row.arweave_uri,
    row.created_at,
  ]

  if (usesRemoteDb()) {
    await remoteExecute(sql, args)
    return
  }

  getSqliteDb().prepare(sql).run(...args)
}

export async function insertPendingAction(row: PendingActionInsert): Promise<void> {
  await ensureDbReady()
  const sql = `INSERT INTO pending_actions (
    id, vault_pubkey, cycle_id, typed_action_json, status, expires_at, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  const args = [
    row.id,
    row.vault_pubkey,
    row.cycle_id,
    row.typed_action_json,
    row.status,
    row.expires_at,
    row.created_at,
    row.updated_at,
  ]

  if (usesRemoteDb()) {
    await remoteExecute(sql, args)
    return
  }

  getSqliteDb().prepare(sql).run(...args)
}

export async function completeCycleJob(jobId: string, nowMs: number): Promise<void> {
  await ensureDbReady()
  const sql = `UPDATE cycle_jobs
     SET status = 'completed', lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
     WHERE id = ?`
  const args = [nowMs, jobId]

  if (usesRemoteDb()) {
    await remoteExecute(sql, args)
    return
  }

  getSqliteDb().prepare(sql).run(...args)
}

export async function failCycleJob(jobId: string, message: string, nowMs: number): Promise<void> {
  await ensureDbReady()
  const sql = `UPDATE cycle_jobs
     SET status = 'failed', error = ?, lease_owner = NULL, lease_expires_at = NULL, updated_at = ?
     WHERE id = ?`
  const args = [message, nowMs, jobId]

  if (usesRemoteDb()) {
    await remoteExecute(sql, args)
    return
  }

  getSqliteDb().prepare(sql).run(...args)
}

export async function countInfraFailedJobs(vaultPubkey: string): Promise<number> {
  await ensureDbReady()
  const sql = `SELECT COUNT(*) AS count
     FROM cycle_jobs
     WHERE vault_pubkey = ?
       AND status = 'failed'
       AND (
         error LIKE '%VAULT_STATE_UNAVAILABLE%'
         OR error LIKE '%vault state unavailable%'
         OR error LIKE '%On-chain vault account could not be loaded%'
       )`
  const args = [vaultPubkey]

  if (usesRemoteDb()) {
    const result = await getLibsqlClient().execute({ sql, args: args as never[] })
    return Number((result.rows[0] as unknown as { count: number }).count ?? 0)
  }

  const row = getSqliteDb().prepare(sql).get(...args) as { count: number } | undefined
  return row?.count ?? 0
}

export async function hasActiveCycleJob(vaultPubkey: string): Promise<boolean> {
  await ensureDbReady()
  const sql = `SELECT COUNT(*) AS count
     FROM cycle_jobs
     WHERE vault_pubkey = ? AND status IN ('pending', 'leased')`
  const args = [vaultPubkey]

  if (usesRemoteDb()) {
    const result = await getLibsqlClient().execute({ sql, args: args as never[] })
    return Number((result.rows[0] as unknown as { count: number }).count ?? 0) > 0
  }

  const row = getSqliteDb().prepare(sql).get(...args) as { count: number } | undefined
  return (row?.count ?? 0) > 0
}

export async function insertInfraRetryJob(job: CycleJobRow, nowMs: number): Promise<void> {
  await ensureDbReady()
  const sql = `INSERT INTO cycle_jobs (
      id, vault_pubkey, cycle_id, permission_level, priority, status,
      scheduled_at, lease_owner, lease_expires_at, error, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const args = [
    randomUUID(),
    job.vault_pubkey,
    job.cycle_id,
    job.permission_level,
    25,
    'pending',
    nowMs + 15_000,
    null,
    null,
    null,
    nowMs,
    nowMs,
  ]

  if (usesRemoteDb()) {
    await remoteExecute(sql, args)
    return
  }

  getSqliteDb().prepare(sql).run(...args)
}
