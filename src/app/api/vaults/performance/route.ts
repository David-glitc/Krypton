import { NextResponse } from 'next/server'

import { getPortfolioPerformance } from '@/lib/services/performance-service'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const ownerWallet = new URL(request.url).searchParams.get('ownerWallet')
  if (!ownerWallet) {
    return NextResponse.json({ error: 'ownerWallet required' }, { status: 400 })
  }

  try {
    const vaults = await getPortfolioPerformance(ownerWallet)
    const totals = vaults.reduce(
      (acc, v) => ({
        completedRuns: acc.completedRuns + v.completedRuns,
        failedRuns: acc.failedRuns + v.failedRuns,
        pendingApprovals: acc.pendingApprovals + v.pendingApprovals,
      }),
      { completedRuns: 0, failedRuns: 0, pendingApprovals: 0 },
    )
    return NextResponse.json({ vaults, totals })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load performance' },
      { status: 500 },
    )
  }
}
