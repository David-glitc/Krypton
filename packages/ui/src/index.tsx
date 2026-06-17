import clsx from 'clsx'
import type { ReactNode } from 'react'

export function PolicyBlock({
  fields,
  className,
}: {
  fields: Record<string, ReactNode>
  className?: string
}) {
  return (
    <div
      className={clsx(
        'rounded border border-[var(--border)] bg-[var(--bg-panel)] p-4 font-mono text-sm',
        className,
      )}
    >
      {Object.entries(fields).map(([key, value]) => (
        <div key={key} className="py-0.5">
          <span className="text-[var(--accent-policy)]">{key}:</span>{' '}
          <span className="text-[var(--text-primary)]">{value}</span>
        </div>
      ))}
    </div>
  )
}

export function PipelineStrip({ className }: { className?: string }) {
  const nodes = [
    { id: 'policy', label: 'policy', privacy: false },
    { id: 'agents', label: 'agents', privacy: false },
    { id: 'constraints', label: 'constraints', privacy: false },
    { id: 'signing', label: 'ika_signing', privacy: true },
    { id: 'vault', label: 'vault', privacy: false },
  ] as const

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]',
        className,
      )}
    >
      {nodes.map((node, i) => (
        <div key={node.id} className="flex items-center gap-2">
          <span
            className={clsx(
              'rounded border px-3 py-1.5',
              node.privacy
                ? 'border-[var(--accent-privacy)]/40 bg-[var(--accent-privacy)]/10 text-[var(--accent-privacy)] backdrop-blur-sm'
                : 'border-[var(--border)] bg-[var(--bg-panel)] text-[var(--text-primary)]',
            )}
          >
            {node.label}
          </span>
          {i < nodes.length - 1 && (
            <span className="text-[var(--text-secondary)]">→</span>
          )}
        </div>
      ))}
    </div>
  )
}

export function ConstraintBars({
  drawdown,
  leverage,
  concentration,
}: {
  drawdown: { current: number; max: number }
  leverage: { current: number; max: number }
  concentration: { current: number; max: number }
}) {
  const bars = [
    { label: 'drawdown', ...drawdown, unit: '%' },
    { label: 'leverage', current: leverage.current / 100, max: leverage.max / 100, unit: 'x' },
    { label: 'concentration', ...concentration, unit: '%' },
  ]

  return (
    <div className="space-y-4">
      {bars.map((bar) => {
        const pct = bar.max > 0 ? Math.min(100, (bar.current / bar.max) * 100) : 0
        const danger = pct >= 90
        return (
          <div key={bar.label}>
            <div className="mb-1 flex justify-between font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              <span>{bar.label}</span>
              <span>
                {bar.current}
                {bar.unit} / {bar.max}
                {bar.unit}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-sm bg-[var(--bg-panel-raised)]">
              <div
                className={clsx(
                  'h-full transition-all',
                  danger ? 'bg-[var(--accent-risk)]' : 'bg-[var(--accent-policy)]',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function PendingActionCard({
  action,
  onApprove,
  onReject,
}: {
  action: {
    id: string
    actionType: string
    rationale: string
    expectedReturnPct: number
    expectedDrawdownPct: number
    var95Pct: number
    compositeScore: number
    postLeverageBps: number
    postConcentrationBps: number
  }
  onApprove?: () => void
  onReject?: () => void
}) {
  return (
    <div className="rounded border border-[var(--border)] bg-[var(--bg-panel)] p-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">
            pending_action
          </p>
          <h3 className="mt-1 font-display text-lg text-[var(--text-primary)]">
            {action.actionType}
          </h3>
        </div>
        <span className="rounded border border-[var(--accent-positive)]/30 bg-[var(--accent-positive)]/10 px-2 py-1 font-mono text-xs text-[var(--accent-positive)]">
          score {(action.compositeScore * 100).toFixed(0)}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{action.rationale}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ['expected_return', `${action.expectedReturnPct.toFixed(1)}%`],
          ['expected_drawdown', `${action.expectedDrawdownPct.toFixed(1)}%`],
          ['var_95', `${action.var95Pct.toFixed(1)}%`],
        ].map(([k, v]) => (
          <div key={k} className="rounded border border-[var(--border)] bg-[var(--bg-base)] p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
              {k}
            </p>
            <p className="mt-1 font-mono text-sm text-[var(--text-primary)]">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-xs text-[var(--text-secondary)]">
        post_execution: leverage {(action.postLeverageBps / 100).toFixed(2)}x · concentration{' '}
        {(action.postConcentrationBps / 100).toFixed(1)}%
      </p>
      {(onApprove || onReject) && (
        <div className="mt-5 flex flex-wrap gap-3">
          {onApprove && (
            <button
              type="button"
              onClick={onApprove}
              className="rounded border border-[var(--accent-policy)] bg-[var(--accent-policy)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--bg-base)] transition hover:opacity-90"
            >
              Approve & sign
            </button>
          )}
          {onReject && (
            <button
              type="button"
              onClick={onReject}
              className="rounded border border-[var(--border)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] transition hover:border-[var(--accent-risk)] hover:text-[var(--accent-risk)]"
            >
              Reject
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export { PolicyBlock as default }
