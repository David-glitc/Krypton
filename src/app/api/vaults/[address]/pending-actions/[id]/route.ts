import { NextResponse } from 'next/server'

import { appendActivityEvent } from '@/lib/services/activity-service'
import { enqueueCycleJob } from '@/lib/services/cycle-service'
import { updatePendingActionStatus } from '@/lib/services/pending-action-service'

export const runtime = 'nodejs'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ address: string; id: string }> },
) {
  const { address, id } = await params

  try {
    const body = await request.json() as { status?: string }
    const status = body.status

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json(
        { error: 'status must be "approved" or "rejected"' },
        { status: 400 },
      )
    }

    const updated = await updatePendingActionStatus(id, status)
    if (!updated) {
      return NextResponse.json(
        { error: 'Pending action not found' },
        { status: 404 },
      )
    }

    await appendActivityEvent({
      vaultPubkey: address,
      eventType: 'pending_action_updated',
      payload: {
        actionId: id,
        actionType: (() => {
          try { return JSON.parse(updated.typed_action_json)?.actionType } catch { return null }
        })(),
        status,
        previousStatus: 'pending',
      },
    })

    if (status === 'approved') {
      await enqueueCycleJob({
        vaultPubkey: address,
        cycleId: updated.cycle_id,
        priority: 10,
        permissionLevel: 1,
        scheduledAt: Date.now(),
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update pending action' },
      { status: 500 },
    )
  }
}
