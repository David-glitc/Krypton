import { NextResponse } from 'next/server'

import { listActivityByVault } from '@/lib/services/activity-service'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') ?? 50)
  const offset = Number(searchParams.get('offset') ?? 0)

  const events = (await listActivityByVault(address, { limit, offset })).map((event) => ({
    ...event,
    payload_json: JSON.parse(event.payload_json),
  }))

  return NextResponse.json({ events })
}
