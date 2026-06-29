import { dbAll, ensureDbReady } from '@/lib/db'
import type { AgentInvocation } from '@/lib/db/types'

export async function listAgentInvocationsByVault(
  vaultPubkey: string,
  options?: { limit?: number },
): Promise<AgentInvocation[]> {
  await ensureDbReady()
  const limit = options?.limit ?? 60

  return dbAll<AgentInvocation>(
    `SELECT * FROM agent_invocations
     WHERE vault_pubkey = ?
     ORDER BY created_at DESC
     LIMIT ?`,
    [vaultPubkey, limit],
  )
}
