import { randomUUID } from 'node:crypto'

import { NextResponse } from 'next/server'

import { dbAll, dbGet, dbRun } from '@/lib/db'
import { appendActivityEvent } from '@/lib/services/activity-service'
import { enqueueCycleJob, getVaultCycleStatus, releaseStuckCycleJobs, VaultCycleMutexError } from '@/lib/services/cycle-service'

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

    const status = await getVaultCycleStatus(address)

    return NextResponse.json({
      job,
      status,
      quota: status.quota,
    })
  } catch (error) {
    if (error instanceof VaultCycleMutexError) {
      return NextResponse.json(
        {
          error: error.message,
          hint: 'Wait for the active cycle to finish, or use "Release stuck cycle" on the vault page.',
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to enqueue cycle' },
      { status: 500 },
    )
  }
}

/** Release stuck pending/leased cycle jobs for this vault. */
export async function DELETE(_: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  try {
    const released = await releaseStuckCycleJobs(address)
    await appendActivityEvent({
      vaultPubkey: address,
      eventType: 'cycle_released',
      payload: { released },
    })
    const status = await getVaultCycleStatus(address)
    return NextResponse.json({ released, status, quota: status.quota })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to release cycle' },
      { status: 500 },
    )
  }
}
