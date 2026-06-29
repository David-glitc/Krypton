import { dbAll, dbGet, ensureDbReady } from '@/lib/db'
import { listVaultsByOwner } from '@/lib/services/vault-registry-service'

export const runtime = 'nodejs'

export type VaultPerformanceRow = {
  vaultPubkey: string
  name: string | null
  completedRuns: number
  failedRuns: number
  pendingApprovals: number
  lastRunAt: number | null
  lastRunStatus: string | null
  avgCycleDurationMs: number | null
}

export async function getPortfolioPerformance(ownerWallet: string): Promise<VaultPerformanceRow[]> {
  await ensureDbReady()
  const vaults = await listVaultsByOwner(ownerWallet)

  const rows: VaultPerformanceRow[] = []
  for (const vault of vaults) {
    const stats = await dbGet<{ completed: number; failed: number }>(
      `SELECT
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
         SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed
       FROM cycle_jobs WHERE vault_pubkey = ?`,
      [vault.vault_pubkey],
    )

    const pending = await dbGet<{ count: number }>(
      `SELECT COUNT(*) AS count FROM pending_actions
       WHERE vault_pubkey = ? AND status = 'pending'`,
      [vault.vault_pubkey],
    )

    const lastJob = await dbGet<{ status: string; updated_at: number }>(
      `SELECT status, updated_at FROM cycle_jobs
       WHERE vault_pubkey = ? AND status IN ('completed', 'failed')
       ORDER BY updated_at DESC LIMIT 1`,
      [vault.vault_pubkey],
    )

    const durationRow = await dbGet<{ avg_ms: number | null }>(
      `SELECT AVG(completed_at - started_at) AS avg_ms
       FROM cycle_runs
       WHERE vault_pubkey = ? AND completed_at IS NOT NULL AND stage = 'MONITORING'`,
      [vault.vault_pubkey],
    )

    rows.push({
      vaultPubkey: vault.vault_pubkey,
      name: vault.name,
      completedRuns: stats?.completed ?? 0,
      failedRuns: stats?.failed ?? 0,
      pendingApprovals: pending?.count ?? 0,
      lastRunAt: lastJob?.updated_at ?? null,
      lastRunStatus: lastJob?.status ?? null,
      avgCycleDurationMs: durationRow?.avg_ms ?? null,
    })
  }

  return rows
}

export async function getRecentCycleActivity(vaultPubkey: string, limit = 10) {
  await ensureDbReady()
  return dbAll<{
    cycle_id: number
    stage: string
    started_at: number
    completed_at: number | null
    error: string | null
  }>(
    `SELECT cycle_id, stage, started_at, completed_at, error
     FROM cycle_runs
     WHERE vault_pubkey = ?
     ORDER BY started_at DESC
     LIMIT ?`,
    [vaultPubkey, limit],
  )
}
