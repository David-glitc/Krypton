import { dbAll, ensureDbReady } from '@/lib/db'
import type { CycleRun } from '@/lib/db/types'

export const runtime = 'nodejs'

export async function listCycleRunsByVault(
  vaultPubkey: string,
  options?: { limit?: number },
): Promise<CycleRun[]> {
  await ensureDbReady()
  const limit = options?.limit ?? 20

  return dbAll<CycleRun>(
    `SELECT * FROM cycle_runs
     WHERE vault_pubkey = ?
     ORDER BY started_at DESC
     LIMIT ?`,
    [vaultPubkey, limit],
  )
}
