export interface ActivityEntry {
  id: string
  vaultId: string
  type: 'executed' | 'rejected' | 'advisory_pending' | 'policy_amended' | 'deposit' | 'withdrawal' | 'paused' | 'unpaused'
  description: string
  timestamp: string
  details?: Record<string, string>
}

export function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">No activity yet.</p>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <ActivityRow key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const icon = typeIcon[entry.type]
  const color = typeColor[entry.type]

  return (
    <div className="flex gap-3 rounded-sm border border-[var(--border)] bg-[var(--bg-panel)] p-3">
      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${color}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-[var(--text-primary)]">{entry.description}</p>
          <span className="shrink-0 font-mono text-[10px] text-[var(--text-muted)]">
            {formatTime(entry.timestamp)}
          </span>
        </div>
        {entry.details && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {Object.entries(entry.details).map(([k, v]) => (
              <span key={k} className="rounded-sm bg-[var(--bg-panel-raised)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]">
                {k}: {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const typeIcon: Record<ActivityEntry['type'], string> = {
  executed: '✓',
  rejected: '✗',
  advisory_pending: '⏳',
  policy_amended: '📝',
  deposit: '↓',
  withdrawal: '↑',
  paused: '⏸',
  unpaused: '▶',
}

const typeColor: Record<ActivityEntry['type'], string> = {
  executed: 'bg-[var(--accent-positive)]/10 text-[var(--accent-positive)]',
  rejected: 'bg-[var(--accent-risk)]/10 text-[var(--accent-risk)]',
  advisory_pending: 'bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]',
  policy_amended: 'bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]',
  deposit: 'bg-[var(--accent-positive)]/10 text-[var(--accent-positive)]',
  withdrawal: 'bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]',
  paused: 'bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]',
  unpaused: 'bg-[var(--accent-positive)]/10 text-[var(--accent-positive)]',
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return d.toLocaleDateString()
}
