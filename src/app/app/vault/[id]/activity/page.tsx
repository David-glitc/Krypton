'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVault, DEMO_PENDING_ACTIONS, DEMO_ACTIVITY, DEMO_GOVERNANCE_PROPOSALS } from '@/lib/mock-data'

const ACTIVITY_ICONS: Record<string, string> = {
  deposit: '↓',
  withdrawal: '↑',
  constraint_update: '⚙',
  policy_change: '◈',
  rebalance: '⇄',
  governance_proposal: '◇',
  agent_cycle: '⟳',
  simulation_score: '◎',
}

function StatusPill({ status }: { status: string }) {
  if (status === 'pending') {
    return (
      <span className="font-mono text-[10px] text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded-sm">
        pending
      </span>
    )
  }
  if (status === 'failed') {
    return (
      <span className="font-mono text-[10px] text-accent-risk border border-accent-risk/30 px-1.5 py-0.5 rounded-sm">
        failed
      </span>
    )
  }
  return (
    <span className="font-mono text-[10px] text-accent-positive border border-accent-positive/30 px-1.5 py-0.5 rounded-sm">
      done
    </span>
  )
}

type FilterTab = 'all' | 'pending' | 'history'

interface ActivityEntry {
  id: string
  type: string
  description: string
  timestamp: string
  vaultName: string
  detail: string
  status: string
  cycleId?: number
  agentStage?: string
}

interface PendingAction {
  id: string
  description: string
  submittedAt: string
  approvals: number
  required: number
  agentRationale?: string
  simulationScore?: {
    expectedReturn: number
    expectedDrawdown: number
    var95: number
    compositeScore: number
  }
}

export default function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  return <ActivityPageContent params={params} />
}

async function ActivityPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vault = getVault(id)

  if (!vault) notFound()

  const [filter, setFilter] = useState<FilterTab>('all')

  const filteredActivity = DEMO_ACTIVITY.filter((entry: ActivityEntry) => {
    if (filter === 'pending') return entry.status === 'pending'
    if (filter === 'history') return entry.status !== 'pending'
    return true
  })

  const isDao = vault.governanceMode === 'dao_prediction_market'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href={`/app/vault/${id}`}
        className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1 mb-6"
      >
        ← {vault.name}
      </Link>

      <h1 className="font-mono text-lg font-semibold text-text-primary mb-8">Activity</h1>

      {/* Governance proposals (DAO vaults) — coming soon */}
      {isDao && (
        <>
          <h2 className="font-mono text-xs font-semibold text-text-muted uppercase mb-3">
            Governance proposals
          </h2>
          <div className="mb-8 rounded border border-border bg-bg-panel p-6 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-amber-500 mb-1">coming soon</p>
            <p className="font-mono text-[11px] text-text-muted max-w-md mx-auto leading-relaxed">
              Futarchy-based governance is in development. Policy amendments will be priced by conditional markets (PASS/FAIL TWAP) — not token votes.
            </p>
          </div>
        </>
      )}

      {/* Pending actions */}
      <h2 className="font-mono text-xs font-semibold text-text-muted uppercase mb-3">
        Pending actions
      </h2>
      <div className="space-y-2 mb-8">
        {DEMO_PENDING_ACTIONS.length === 0 ? (
          <p className="font-mono text-xs text-text-muted">No pending actions.</p>
        ) : (
          DEMO_PENDING_ACTIONS.map((action: PendingAction) => (
            <div
              key={action.id}
              className="bg-bg-panel border border-border rounded-sm p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-mono text-xs text-text-primary">{action.description}</p>
                  <span className="font-mono text-[10px] text-text-muted mt-1 block">
                    {action.submittedAt} · {action.approvals}/{action.required} approvals
                  </span>
                </div>
                <span className="font-mono text-[10px] text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded-sm shrink-0 ml-4">
                  awaiting
                </span>
              </div>

              {/* Agent rationale */}
              {action.agentRationale && (
                <div className="mt-3 rounded border border-border bg-bg-base p-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">agent_rationale</span>
                  <p className="font-mono text-[11px] text-text-secondary mt-1 leading-relaxed">{action.agentRationale}</p>
                </div>
              )}

              {/* Simulation results */}
              {action.simulationScore && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  <div className="rounded border border-border bg-bg-base p-2 text-center">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">exp_return</span>
                    <p className="font-mono text-xs text-text-primary mt-0.5 tabular-nums">{(action.simulationScore.expectedReturn * 100).toFixed(1)}%</p>
                  </div>
                  <div className="rounded border border-border bg-bg-base p-2 text-center">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">exp_drawdown</span>
                    <p className="font-mono text-xs text-text-primary mt-0.5 tabular-nums">{(action.simulationScore.expectedDrawdown * 100).toFixed(1)}%</p>
                  </div>
                  <div className="rounded border border-border bg-bg-base p-2 text-center">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">VaR 95</span>
                    <p className="font-mono text-xs text-text-primary mt-0.5 tabular-nums">{(action.simulationScore.var95 * 100).toFixed(1)}%</p>
                  </div>
                  <div className="rounded border border-accent/30 bg-accent-muted p-2 text-center">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-accent">composite</span>
                    <p className="font-mono text-xs text-accent mt-0.5 tabular-nums">{action.simulationScore.compositeScore.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Activity feed */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-mono text-xs font-semibold text-text-muted uppercase">
          Execution log
        </h2>
        <div className="flex gap-1">
          {(['all', 'pending', 'history'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`font-mono text-[10px] px-2 py-1 rounded-sm transition-colors ${
                filter === tab
                  ? 'bg-accent-muted text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {filteredActivity.length === 0 ? (
          <p className="font-mono text-xs text-text-muted py-4">No entries.</p>
        ) : (
          filteredActivity.map((entry: ActivityEntry) => (
            <div
              key={entry.id}
              className="bg-bg-panel border border-border rounded-sm p-4"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm text-text-muted w-5 text-center shrink-0 mt-0.5">
                  {ACTIVITY_ICONS[entry.type] || '•'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-xs text-text-primary">{entry.description}</p>
                    <StatusPill status={entry.status} />
                    {entry.cycleId && (
                      <span className="font-mono text-[9px] text-text-muted border border-border px-1 py-0.5 rounded-sm">
                        cycle #{entry.cycleId}
                      </span>
                    )}
                    {entry.agentStage && (
                      <span className="font-mono text-[9px] text-accent border border-accent/20 px-1 py-0.5 rounded-sm">
                        {entry.agentStage}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[10px] text-text-muted">{entry.timestamp}</span>
                    <span className="font-mono text-[10px] text-text-muted">·</span>
                    <span className="font-mono text-[10px] text-text-muted">{entry.vaultName}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-text-secondary border border-border px-1.5 py-0.5 rounded-sm shrink-0">
                  {entry.detail}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
