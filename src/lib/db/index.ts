import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'

import { ensureDbReady, usesRemoteDb } from './store'

export const runtime = 'nodejs'

export { ensureDbReady, usesRemoteDb } from './store'
export {
  dbAll,
  dbGet,
  dbRun,
  withWriteTransaction,
  type SqlArgs,
  type SqlValue,
} from './store'

let legacyDb: Database.Database | null = null

/** @deprecated Prefer async dbRun/dbGet/dbAll from this module. Local SQLite only. */
export function getDb(): Database.Database {
  if (usesRemoteDb()) {
    throw new Error('getDb() is unavailable when LIBSQL_URL is set; use dbRun/dbGet/dbAll instead')
  }

  if (!legacyDb) {
    const dbPath = process.env.KRYPTON_DB_PATH ?? path.join(process.cwd(), '.data', 'krypton.db')
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    legacyDb = new Database(dbPath)
    legacyDb.pragma('journal_mode = WAL')
    legacyDb.pragma('foreign_keys = ON')
    const schema = fs.readFileSync(path.join(process.cwd(), 'src/lib/db/schema.sql'), 'utf8')
    legacyDb.exec(schema)
  }

  return legacyDb
}

export function closeDb(): void {
  if (legacyDb) {
    legacyDb.close()
    legacyDb = null
  }
}
