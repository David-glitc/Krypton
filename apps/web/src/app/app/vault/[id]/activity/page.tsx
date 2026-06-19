'use client'

import { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVault, DEMO_PENDING_ACTIONS, DEMO_ACTIVITY } from '@/lib/mock-data'

const ACTIVITY_ICONS: Record<string, string> = {
  deposit: '↓',
  withdrawal: '↑',
  constraint_update: '⚙',
  policy_change: '◈',
  rebalance: '⇄',
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
}

interface PendingAction {
  id: string
  description: string
  submittedAt: string
  approvals: number
  required: number
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href={`/app/vault/${id}`}
        className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1 mb-6"
      >
        &larr; {vault.name}
      </Link>

      <h1 className="font-mono text-lg font-semibold text-text-primary mb-8">Activity</h1>

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
              className="bg-bg-panel border border-border rounded-sm p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-mono text-xs text-text-primary">{action.description}</p>
                <span className="font-mono text-[10px] text-text-muted mt-1 block">
                  {action.submittedAt} &middot; {action.approvals}/{action.required} approvals
                </span>
              </div>
              <span className="font-mono text-[10px] text-amber-500 border border-amber-500/30 px-1.5 py-0.5 rounded-sm shrink-0 ml-4">
                awaiting
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-mono text-xs font-semibold text-text-muted uppercase">
          Activity feed
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
              className="bg-bg-panel border border-border rounded-sm p-4 flex items-start gap-3"
            >
              <span className="font-mono text-sm text-text-muted w-5 text-center shrink-0 mt-0.5">
                {ACTIVITY_ICONS[entry.type] || '•'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-text-primary">{entry.description}</p>
                  <StatusPill status={entry.status} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[10px] text-text-muted">{entry.timestamp}</span>
                  <span className="font-mono text-[10px] text-text-muted">&middot;</span>
                  <span className="font-mono text-[10px] text-text-muted">{entry.vaultName}</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-text-secondary border border-border px-1.5 py-0.5 rounded-sm shrink-0">
                {entry.detail}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
