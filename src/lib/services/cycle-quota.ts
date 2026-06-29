import { dbAll } from '@/lib/db'
import type { CycleJob } from '@/lib/db/types'

export const MIN_INCLUDED_CYCLES_PER_VAULT = 3
export const MAX_INFRA_AUTO_RETRIES = 3

const INFRA_ERROR_RE =
  /vault state unavailable|VAULT_STATE_UNAVAILABLE|on-chain vault account could not be loaded|openrouter\s+404|openrouter\s+5\d\d/i

export function isInfrastructureCycleError(message: string | null | undefined): boolean {
  if (!message) return false
  return INFRA_ERROR_RE.test(message)
}

export interface VaultCycleQuota {
  vaultPubkey: string
  minIncluded: number
  usedBillable: number
  infraFailures: number
  remainingIncluded: number
}

export async function getVaultCycleQuota(vaultPubkey: string): Promise<VaultCycleQuota> {
  const jobs = await dbAll<CycleJob>(
    `SELECT * FROM cycle_jobs WHERE vault_pubkey = ? ORDER BY created_at ASC`,
    [vaultPubkey],
  )

  const infraFailures = jobs.filter(
    (job) => job.status === 'failed' && isInfrastructureCycleError(job.error),
  ).length

  const usedBillable = jobs.filter(
    (job) =>
      job.status === 'completed' ||
      (job.status === 'failed' && !isInfrastructureCycleError(job.error)),
  ).length

  const remainingIncluded =
    Math.max(0, MIN_INCLUDED_CYCLES_PER_VAULT - usedBillable) + infraFailures

  return {
    vaultPubkey,
    minIncluded: MIN_INCLUDED_CYCLES_PER_VAULT,
    usedBillable,
    infraFailures,
    remainingIncluded,
  }
}
