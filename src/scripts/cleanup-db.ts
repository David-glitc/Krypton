/**
 * Database cleanup script — purge expired/old data.
 *
 * Designed to run as a cron job. Dry-run mode:
 *   npx tsx src/scripts/cleanup-db.ts --dry-run
 *
 * Live run:
 *   npx tsx src/scripts/cleanup-db.ts
 *
 * For remote (LibSQL) DB, set LIBSQL_URL + LIBSQL_AUTH_TOKEN.
 */

import { dbAll, dbRun, ensureDbReady } from '../lib/db'

const PURGE_AFTER_DAYS = 30
const now = Date.now()

type PurgeResult = {
  sessions: { abandoned: number; expired: number; total: number }
  cycleRuns: number
  agentInvocations: number
  pendingActions: number
  activityEvents: number
}

function fmt(n: number): string {
  return n > 0 ? String(n) : '—'
}

async function purge(): Promise<PurgeResult> {
  await ensureDbReady()

  // 1. Abandon sessions older than 7 days
  const abandonedSessions = await dbRun(
    `UPDATE interactive_sessions
     SET status = 'abandoned', updated_at = ?
     WHERE status = 'active' AND expires_at <= ?`,
    [now, now],
  )

  // 2. Delete abandoned sessions older than PURGE_AFTER_DAYS
  const cutoff = now - PURGE_AFTER_DAYS * 24 * 60 * 60 * 1000
  const deletedSessions = await dbRun(
    `DELETE FROM interactive_sessions
     WHERE status = 'abandoned' AND updated_at <= ?`,
    [cutoff],
  )

  // Count remaining abandoned sessions
  const remainingAbandoned = await dbAll<{ count: number }>(
    `SELECT COUNT(*) AS count FROM interactive_sessions WHERE status = 'abandoned'`,
  )
  const remainingExpired = await dbAll<{ count: number }>(
    `SELECT COUNT(*) AS count FROM interactive_sessions
     WHERE status = 'active' AND expires_at <= ?`,
    [now],
  )

  // 3. Delete cycle runs older than PURGE_AFTER_DAYS (keep completed ones)
  const deletedCycleRuns = await dbRun(
    `DELETE FROM cycle_runs
     WHERE completed_at IS NOT NULL AND completed_at <= ?`,
    [cutoff],
  )

  // 4. Delete agent invocations older than PURGE_AFTER_DAYS
  const deletedInvocations = await dbRun(
    `DELETE FROM agent_invocations
     WHERE created_at <= ?`,
    [cutoff],
  )

  // 5. Expire old pending actions
  const deletedPending = await dbRun(
    `DELETE FROM pending_actions
     WHERE status IN ('approved', 'rejected', 'expired') AND updated_at <= ?`,
    [cutoff],
  )

  // 6. Delete activity events older than PURGE_AFTER_DAYS
  const deletedActivity = await dbRun(
    `DELETE FROM activity_events
     WHERE created_at <= ?`,
    [cutoff],
  )

  return {
    sessions: {
      abandoned: Number(abandonedSessions),
      expired: Number(deletedSessions),
      total: (remainingAbandoned[0]?.count ?? 0) + (remainingExpired[0]?.count ?? 0),
    },
    cycleRuns: Number(deletedCycleRuns),
    agentInvocations: Number(deletedInvocations),
    pendingActions: Number(deletedPending),
    activityEvents: Number(deletedActivity),
  }
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run')

  if (isDryRun) {
    console.log('DRY RUN — no data will be modified\n')
  }

  // For dry run just report counts
  if (isDryRun) {
    await ensureDbReady()

    const sessions = await dbAll<{ status: string; count: number }>(
      `SELECT status, COUNT(*) AS count FROM interactive_sessions GROUP BY status`,
    )
    const oldCycleRuns = await dbAll<{ count: number }>(
      `SELECT COUNT(*) AS count FROM cycle_runs
       WHERE completed_at IS NOT NULL AND completed_at <= ?`,
      [now - 30 * 24 * 60 * 60 * 1000],
    )
    const oldInvocations = await dbAll<{ count: number }>(
      `SELECT COUNT(*) AS count FROM agent_invocations WHERE created_at <= ?`,
      [now - 30 * 24 * 60 * 60 * 1000],
    )
    const oldPending = await dbAll<{ count: number }>(
      `SELECT COUNT(*) AS count FROM pending_actions
       WHERE status IN ('approved', 'rejected', 'expired') AND updated_at <= ?`,
      [now - 30 * 24 * 60 * 60 * 1000],
    )
    const oldActivity = await dbAll<{ count: number }>(
      `SELECT COUNT(*) AS count FROM activity_events WHERE created_at <= ?`,
      [now - 30 * 24 * 60 * 60 * 1000],
    )

    console.log('Table rows >30 days old:')
    for (const row of sessions) {
      console.log(`  sessions [${row.status}]: ${row.count}`)
    }
    console.log(`  cycle_runs (completed): ${oldCycleRuns[0]?.count ?? 0}`)
    console.log(`  agent_invocations: ${oldInvocations[0]?.count ?? 0}`)
    console.log(`  pending_actions (resolved): ${oldPending[0]?.count ?? 0}`)
    console.log(`  activity_events: ${oldActivity[0]?.count ?? 0}`)
    return
  }

  const result = await purge()
  console.log('Cleanup complete:')
  console.log(`  Sessions marked abandoned:   ${fmt(result.sessions.abandoned)}`)
  console.log(`  Sessions deleted (expired):  ${fmt(result.sessions.expired)}`)
  console.log(`  Sessions remaining stale:    ${fmt(result.sessions.total)}`)
  console.log(`  Cycle runs purged:           ${fmt(result.cycleRuns)}`)
  console.log(`  Agent invocations purged:    ${fmt(result.agentInvocations)}`)
  console.log(`  Pending actions purged:      ${fmt(result.pendingActions)}`)
  console.log(`  Activity events purged:      ${fmt(result.activityEvents)}`)
}

main().catch((err) => {
  console.error('Cleanup failed:', err)
  process.exit(1)
})
