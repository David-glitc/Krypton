'use client'

import { useMemo, useState, type ComponentType } from 'react'
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Cpu,
  Lightbulb,
  LineChart,
  Lock,
  RefreshCw,
  Search,
  ShieldAlert,
} from 'lucide-react'

import { StatusPill } from '@/components/app/app-shell'
import { AgentActionBrief } from '@/components/app/agent-action-brief'

const STAGE_ORDER = [
  'QUEUED',
  'RESEARCHING',
  'STRATEGIZING',
  'RISK_REVIEW',
  'SIMULATING',
  'PERMISSION_GATE',
  'MONITORING',
] as const

function stageIndex(stage: string): number {
  const idx = STAGE_ORDER.indexOf(stage as (typeof STAGE_ORDER)[number])
  return idx === -1 ? STAGE_ORDER.length : idx
}
const STAGE_META: Record<
  string,
  { label: string; icon: ComponentType<{ className?: string }>; tone: string }
> = {
  QUEUED: { label: 'Queued', icon: Cpu, tone: 'text-text-muted' },
  RESEARCHING: { label: 'Research', icon: Search, tone: 'text-accent-info' },
  STRATEGIZING: { label: 'Strategy', icon: Lightbulb, tone: 'text-accent' },
  RISK_REVIEW: { label: 'Risk Review', icon: ShieldAlert, tone: 'text-accent-warn' },
  SIMULATING: { label: 'Simulation', icon: LineChart, tone: 'text-accent-info' },
  PERMISSION_GATE: { label: 'Permission', icon: Lock, tone: 'text-accent' },
  MONITORING: { label: 'Monitor', icon: Activity, tone: 'text-text-secondary' },
}

const DECISION_LABELS: Record<number, string> = {
  0: 'Executed',
  1: 'Rejected',
  2: 'Advisory',
}

type ParsedDecision = {
  stage?: string
  rationale?: string
  investmentGoal?: string
  hypotheses?: string[]
  candidateActions?: string[]
  actions?: string[]
  riskScore?: number
  flags?: string[]
  alerts?: string[]
  projectedReturnBps?: number
  projectedMaxDrawdownBps?: number
  requiresUserApproval?: boolean
  stub?: boolean
  llmModel?: string
  llmLatencyMs?: number
  llmCostUsd?: number
}

export type AgentLogsData = {
  onChain: {
    address: string
    vault: string
    head: number
    count: number
    entries: Array<{
      cycleId: string
      timestamp: string
      decision: number
      actionType: number
      txSignature: string
    }>
  } | null
  offChainRuns: Array<{
    id: string
    vault_pubkey: string
    cycle_id: number
    stage: string
    decision: ParsedDecision | null
    started_at: number
    completed_at: number | null
    error: string | null
  }>
  invocations: Array<{
    id: string
    cycle_id: number | null
    agent_role: string
    model_id: string | null
    latency_ms: number | null
    cost_usd: number | null
    status: string
    created_at: number
  }>
}

function isInfraError(text: string | null | undefined): boolean {
  if (!text) return false
  return /vault state unavailable|VAULT_STATE_UNAVAILABLE|on-chain vault account could not be loaded/i.test(text)
}

function formatDuration(ms: number | null): string | null {
  if (ms == null || ms < 0) return null
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function riskTone(score: number): string {
  if (score >= 0.7) return 'bg-accent-risk'
  if (score >= 0.4) return 'bg-accent-warn'
  return 'bg-accent'
}

function cleanRationale(text?: string): string | undefined {
  if (!text) return undefined
  if (/^LLM response for /i.test(text)) return undefined
  if (/^LLM returned unparseable/i.test(text)) return undefined
  return text.trim()
}

function groupRunsByCycle(data: AgentLogsData) {
  const map = new Map<
    number,
    {
      cycleId: number
      runs: AgentLogsData['offChainRuns']
      invocations: AgentLogsData['invocations']
    }
  >()

  for (const run of data.offChainRuns) {
    const bucket = map.get(run.cycle_id) ?? { cycleId: run.cycle_id, runs: [], invocations: [] }
    bucket.runs.push(run)
    map.set(run.cycle_id, bucket)
  }

  for (const inv of data.invocations) {
    if (inv.cycle_id == null) continue
    const bucket = map.get(inv.cycle_id) ?? { cycleId: inv.cycle_id, runs: [], invocations: [] }
    bucket.invocations.push(inv)
    map.set(inv.cycle_id, bucket)
  }

  return [...map.values()]
    .map((cycle) => {
      const sortedRuns = [...cycle.runs].sort((a, b) => stageIndex(a.stage) - stageIndex(b.stage))
      const startedAt = Math.min(...sortedRuns.map((r) => r.started_at))
      const completedAt = sortedRuns.every((r) => r.completed_at)
        ? Math.max(...sortedRuns.map((r) => r.completed_at ?? r.started_at))
        : null
      const hasInfraError = sortedRuns.some(
        (r) => isInfraError(r.error) || isInfraError(r.decision?.rationale ?? null),
      )
      const hasStageError = sortedRuns.some((r) => Boolean(r.error))
      const finishedStages = sortedRuns.filter((r) => r.stage !== 'QUEUED').length
      const status = hasInfraError ? 'infra_error' : hasStageError ? 'error' : completedAt ? 'complete' : 'running'

      return {
        ...cycle,
        runs: sortedRuns,
        startedAt,
        completedAt,
        hasInfraError,
        status,
        finishedStages,
      }
    })
    .sort((a, b) => b.cycleId - a.cycleId)
}

function ChipList({ items, variant = 'default' }: { items: string[]; variant?: 'default' | 'warn' | 'risk' }) {
  const styles =
    variant === 'warn'
      ? 'border-accent-warn/30 bg-accent-warn-muted text-accent-warn'
      : variant === 'risk'
        ? 'border-accent-risk/30 bg-accent-risk-muted text-accent-risk'
        : 'border-border bg-bg-base text-text-secondary'

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className={`rounded border px-2 py-0.5 text-[11px] leading-snug ${styles}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

function StageRunCard({
  run,
  invocation,
}: {
  run: AgentLogsData['offChainRuns'][0]
  invocation?: AgentLogsData['invocations'][0]
}) {
  const meta = STAGE_META[run.stage] ?? { label: run.stage, icon: Cpu, tone: 'text-text-muted' }
  const Icon = meta.icon
  const d = run.decision
  const duration = run.completed_at ? formatDuration(run.completed_at - run.started_at) : null
  const infra = isInfraError(run.error) || isInfraError(d?.rationale)
  const actions = d?.candidateActions ?? d?.actions ?? []
  const hypotheses = (d?.hypotheses ?? []).filter((h) => !/^maintain current/i.test(h))
  const flags = d?.flags ?? d?.alerts ?? []

  return (
    <div
      className={`relative pl-8 ${infra ? 'rounded-lg border border-accent-risk/30 bg-accent-risk-muted/20 p-3 -ml-1' : ''}`}
    >
      <div
        className={`absolute left-0 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-bg-panel ${meta.tone}`}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-text-primary">
            {meta.label}
          </p>
          <p className="mt-0.5 text-[11px] text-text-muted">
            {new Date(run.started_at).toLocaleTimeString()}
            {duration ? ` · ${duration}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {infra && (
            <span className="inline-flex items-center gap-1 rounded border border-accent-risk/40 bg-accent-risk-muted px-2 py-0.5 text-[10px] uppercase text-accent-risk">
              <AlertTriangle className="h-3 w-3" />
              Infra
            </span>
          )}
          {d?.stub && (
            <span className="rounded border border-border px-2 py-0.5 text-[10px] uppercase text-text-muted">Stub</span>
          )}
          {invocation?.latency_ms != null && (
            <span className="rounded border border-border px-2 py-0.5 font-mono text-[10px] text-text-muted">
              {formatDuration(invocation.latency_ms)}
            </span>
          )}
        </div>
      </div>

      {cleanRationale(d?.rationale) && (
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{cleanRationale(d?.rationale)}</p>
      )}

      {d?.investmentGoal && (
        <p className="mt-3 text-sm font-medium text-accent">{d.investmentGoal}</p>
      )}

      {typeof d?.riskScore === 'number' && (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-text-muted">
            <span>Risk score</span>
            <span className="font-mono">{(d.riskScore * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg-deep">
            <div
              className={`h-full rounded-full transition-all ${riskTone(d.riskScore)}`}
              style={{ width: `${Math.min(100, d.riskScore * 100)}%` }}
            />
          </div>
        </div>
      )}

      {(d?.projectedReturnBps != null || d?.projectedMaxDrawdownBps != null) && (
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-mono text-text-muted">
          {d.projectedReturnBps != null && <span>Return: {d.projectedReturnBps} bps</span>}
          {d.projectedMaxDrawdownBps != null && <span>Max DD: {d.projectedMaxDrawdownBps} bps</span>}
        </div>
      )}

      {hypotheses.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Hypotheses</p>
          <ChipList items={hypotheses} />
        </div>
      )}

      {actions.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Proposed actions</p>
          <ChipList items={actions} variant="default" />
        </div>
      )}

      {flags.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Flags</p>
          <ChipList items={flags} variant={infra ? 'risk' : 'warn'} />
        </div>
      )}

      {d?.requiresUserApproval != null && (
        <p className="mt-3 text-[11px] text-text-muted">
          {d.requiresUserApproval ? 'Requires owner approval' : 'Auto-execute eligible'}
        </p>
      )}

      {run.error && (
        <p className="mt-3 rounded border border-accent-risk/30 bg-accent-risk-muted/30 px-3 py-2 text-xs text-accent-risk">
          {run.error.includes('AccountNotInitialized')
            ? 'On-chain execution failed: vault account mismatch (fixed in latest orchestrator).'
            : run.error.length > 280
              ? `${run.error.slice(0, 280)}…`
              : run.error}
        </p>
      )}
    </div>
  )
}

function CycleCard({
  cycle,
  defaultOpen,
}: {
  cycle: ReturnType<typeof groupRunsByCycle>[0]
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const invocationByRole = useMemo(() => {
    const map = new Map<string, AgentLogsData['invocations'][0]>()
    for (const inv of cycle.invocations) {
      map.set(inv.agent_role, inv)
    }
    return map
  }, [cycle.invocations])

  const summary = cycle.runs.find((r) => r.decision?.rationale)?.decision?.rationale
  const statusLabel =
    cycle.status === 'infra_error'
      ? 'Infra error'
      : cycle.status === 'error'
        ? 'Error'
        : cycle.status === 'running'
          ? 'Running'
          : 'Complete'
  const statusVariant =
    cycle.status === 'infra_error' || cycle.status === 'error'
      ? 'risk'
      : cycle.status === 'running'
        ? 'warn'
        : 'ok'

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-base">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-bg-hover/40"
      >
        <span className="mt-0.5 text-text-muted">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-medium text-text-primary">
              Agent run
            </span>
            <StatusPill label={statusLabel} variant={statusVariant} />
            <span className="text-[11px] text-text-muted">
              {cycle.finishedStages} steps
            </span>
          </div>
          <p className="mt-1 text-[11px] text-text-muted">
            {new Date(cycle.startedAt).toLocaleString()}
            {cycle.completedAt ? ` → ${new Date(cycle.completedAt).toLocaleTimeString()}` : ''}
          </p>
          {!open && summary && (
            <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{summary}</p>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-2">
          <div className="relative space-y-6 border-l border-border/60 pl-4 ml-3">
            {cycle.runs
              .filter((r) => r.stage !== 'QUEUED' || cycle.runs.length === 1)
              .map((run) => (
                <StageRunCard
                  key={run.id}
                  run={run}
                  invocation={invocationByRole.get(run.stage)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function AgentLogsPanel({
  data,
  loading,
  onRefresh,
  vaultUsd,
}: {
  data: AgentLogsData | null
  loading: boolean
  onRefresh?: () => void
  vaultUsd?: number
}) {
  const cycles = useMemo(() => (data ? groupRunsByCycle(data) : []), [data])
  const [showPipeline, setShowPipeline] = useState(false)

  return (
    <section className="panel p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-text-primary sm:text-xl">
            Agent activity
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            What the agent wants to do with your capital — then the full pipeline if you need it.
          </p>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      <div className="mt-6">
        <AgentActionBrief data={data} vaultUsd={vaultUsd} />
      </div>

      <button
        type="button"
        onClick={() => setShowPipeline((v) => !v)}
        className="mt-6 flex w-full items-center justify-between rounded border border-border bg-bg-base px-4 py-3 text-left text-sm text-text-secondary hover:border-border-hover"
      >
        <span>{showPipeline ? 'Hide' : 'View'} full pipeline & on-chain log</span>
        {showPipeline ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {showPipeline && (
      <div className="mt-6 space-y-8">
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            On-chain execution log
            {data?.onChain ? ` · ${data.onChain.count} entries` : ''}
          </h3>
          {loading && !data ? (
            <div className="mt-4 h-16 animate-pulse rounded-lg bg-bg-panel" />
          ) : data?.onChain && data.onChain.entries.length > 0 ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-bg-panel font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  <tr>
                    <th className="px-4 py-2">Decision</th>
                    <th className="px-4 py-2">Run</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="hidden px-4 py-2 sm:table-cell">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.onChain.entries.map((entry, i) => (
                    <tr key={i} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-3">
                        <StatusPill label={DECISION_LABELS[entry.decision] ?? `#${entry.decision}`} />
                      </td>
                      <td className="px-4 py-3 font-mono text-text-primary">
                        #{entry.cycleId}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">Type {entry.actionType}</td>
                      <td className="hidden px-4 py-3 text-xs text-text-muted sm:table-cell">
                        {new Date(Number(entry.timestamp) * 1000).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-secondary">No on-chain decisions yet.</p>
          )}
        </div>

        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Agent pipeline
            {cycles.length > 0 ? ` · ${cycles.length} run${cycles.length === 1 ? '' : 's'}` : ''}
          </h3>

          {loading && cycles.length === 0 ? (
            <div className="mt-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-bg-panel" />
              ))}
            </div>
          ) : cycles.length > 0 ? (
            <div className="mt-4 space-y-3">
              {cycles.map((cycle, index) => (
                <CycleCard key={cycle.cycleId} cycle={cycle} defaultOpen={index === 0} />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-secondary">
              No agent activity yet. Run the agent to see what it recommends for this vault.
            </p>
          )}
        </div>
      </div>
      )}
    </section>
  )
}
