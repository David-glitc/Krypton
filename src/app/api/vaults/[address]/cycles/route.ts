import { randomUUID } from 'node:crypto'

import { NextResponse } from 'next/server'

import { dbAll, dbGet, dbRun } from '@/lib/db'
import { appendActivityEvent } from '@/lib/services/activity-service'
import { enqueueCycleJob, getVaultCycleStatus, VaultCycleMutexError } from '@/lib/services/cycle-service'

export const runtime = 'nodejs'

export async function GET(_: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  const cycleRuns = await dbAll(
    `SELECT * FROM cycle_runs
     WHERE vault_pubkey = ?
     ORDER BY started_at DESC
     LIMIT 20`,
    [address],
  )

  return NextResponse.json({
    status: await getVaultCycleStatus(address),
    runs: cycleRuns,
  })
}

export async function POST(request: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  const body = await request.json().catch(() => null)
  const permissionLevel = Number(body?.permissionLevel ?? 2)
  const priority = Number(body?.priority ?? 1)

  try {
    const maxRow = await dbGet<{ maxCycleId: number | null }>(
      `SELECT MAX(cycle_id) AS maxCycleId FROM cycle_jobs WHERE vault_pubkey = ?`,
      [address],
    )
    const cycleId = (maxRow?.maxCycleId ?? 0) + 1

    const job = await enqueueCycleJob({
      vaultPubkey: address,
      cycleId,
      permissionLevel,
      priority,
    })

    await dbRun(
      `INSERT INTO cycle_runs (id, vault_pubkey, cycle_id, job_id, stage, decision, started_at, completed_at, error)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), address, cycleId, job.id, 'QUEUED', null, Date.now(), null, null],
    )

    await appendActivityEvent({
      vaultPubkey: address,
      eventType: 'cycle_enqueued',
      payload: { cycleId, permissionLevel, priority },
    })

    return NextResponse.json({ job, status: await getVaultCycleStatus(address) })
  } catch (error) {
    if (error instanceof VaultCycleMutexError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to enqueue cycle' }, { status: 500 })
  }
}
