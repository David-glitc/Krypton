import fs from 'node:fs'
import path from 'node:path'

import { createClient, type Client } from '@libsql/client'
import Database from 'better-sqlite3'

export type SqlValue = string | number | bigint | null | Uint8Array
export type SqlArgs = SqlValue[]

let libsqlClient: Client | null = null
let sqliteDb: Database.Database | null = null
let initPromise: Promise<void> | null = null

export function usesRemoteDb(): boolean {
  return Boolean(process.env.LIBSQL_URL)
}

function getLibsqlClient(): Client {
  if (!libsqlClient) {
    libsqlClient = createClient({
      url: process.env.LIBSQL_URL!,
      authToken: process.env.LIBSQL_AUTH_TOKEN,
    })
  }
  return libsqlClient
}

function resolveSqlitePath(): string {
  if (process.env.KRYPTON_DB_PATH) {
    return process.env.KRYPTON_DB_PATH
  }
  return path.join(process.cwd(), '.data', 'krypton.db')
}

function getSqliteDb(): Database.Database {
  if (!sqliteDb) {
    const dbPath = resolveSqlitePath()
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    sqliteDb = new Database(dbPath)
    sqliteDb.pragma('journal_mode = WAL')
    sqliteDb.pragma('foreign_keys = ON')
  }
  return sqliteDb
}

function loadSchemaStatements(): string[] {
  const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  const withoutLineComments = schema
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')

  return withoutLineComments
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0 && !statement.toUpperCase().startsWith('PRAGMA'))
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

      const db = getSqliteDb()
      const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql')
      db.exec(fs.readFileSync(schemaPath, 'utf8'))
    })()
  }

  await initPromise
}

function mapLibsqlRow<T>(row: Record<string, unknown>): T {
  return row as T
}

export async function dbRun(sql: string, args: SqlArgs = []): Promise<{ changes: number }> {
  await ensureDbReady()

  if (usesRemoteDb()) {
    const result = await getLibsqlClient().execute({ sql, args })
    return { changes: result.rowsAffected }
  }

  const result = getSqliteDb().prepare(sql).run(...args)
  return { changes: result.changes }
}

export async function dbGet<T>(sql: string, args: SqlArgs = []): Promise<T | undefined> {
  await ensureDbReady()

  if (usesRemoteDb()) {
    const result = await getLibsqlClient().execute({ sql, args })
    if (result.rows.length === 0) {
      return undefined
    }
    return mapLibsqlRow<T>(result.rows[0] as Record<string, unknown>)
  }

  return getSqliteDb().prepare(sql).get(...args) as T | undefined
}

export async function dbAll<T>(sql: string, args: SqlArgs = []): Promise<T[]> {
  await ensureDbReady()

  if (usesRemoteDb()) {
    const result = await getLibsqlClient().execute({ sql, args })
    return result.rows.map((row) => mapLibsqlRow<T>(row as Record<string, unknown>))
  }

  return getSqliteDb().prepare(sql).all(...args) as T[]
}

export async function withWriteTransaction<T>(
  fn: (run: typeof dbRun, get: typeof dbGet, all: typeof dbAll) => Promise<T>,
): Promise<T> {
  await ensureDbReady()

  if (!usesRemoteDb()) {
    return withLocalWriteTransaction((run, get, all) =>
      fn(
        async (sql, args) => run(sql, args),
        async (sql, args) => get(sql, args),
        async (sql, args) => all(sql, args),
      ),
    )
  }

  const client = getLibsqlClient()
  const txn = await client.transaction('write')

  const run = async (sql: string, args: SqlArgs = []) => {
    const result = await txn.execute({ sql, args })
    return { changes: result.rowsAffected }
  }

  const get = async <Row>(sql: string, args: SqlArgs = []) => {
    const result = await txn.execute({ sql, args })
    if (result.rows.length === 0) {
      return undefined
    }
    return mapLibsqlRow<Row>(result.rows[0] as Record<string, unknown>)
  }

  const all = async <Row>(sql: string, args: SqlArgs = []) => {
    const result = await txn.execute({ sql, args })
    return result.rows.map((row) => mapLibsqlRow<Row>(row as Record<string, unknown>))
  }

  try {
    const value = await fn(run, get, all)
    await txn.commit()
    return value
  } catch (error) {
    await txn.rollback()
    throw error
  }
}

export function withLocalWriteTransaction<T>(
  fn: (
    run: (sql: string, args?: SqlArgs) => { changes: number },
    get: <Row>(sql: string, args?: SqlArgs) => Row | undefined,
    all: <Row>(sql: string, args?: SqlArgs) => Row[],
  ) => T | Promise<T>,
): Promise<T> {
  const db = getSqliteDb()

  const run = (sql: string, args: SqlArgs = []) => {
    const result = db.prepare(sql).run(...args)
    return { changes: result.changes }
  }

  const get = <Row>(sql: string, args: SqlArgs = []) => db.prepare(sql).get(...args) as Row | undefined
  const all = <Row>(sql: string, args: SqlArgs = []) => db.prepare(sql).all(...args) as Row[]

  const value = db.transaction(() => fn(run, get, all))()
  return Promise.resolve(value)
}
