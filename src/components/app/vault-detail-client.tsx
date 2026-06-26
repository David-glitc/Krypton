'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { MetricCard, OutlineButton, StatusPill } from '@/components/app/app-shell'
import { SectionHeading } from '@/components/app/section-heading'

type ExecutionLogsResponse = {
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
    decision: Record<string, unknown> | null
    started_at: number
    completed_at: number | null
    error: string | null
  }>
}

const DECISION_LABELS: Record<number, string> = {
  0: 'Executed',
  1: 'Rejected',
  2: 'Advisory',
}

const STAGE_LABELS: Record<string, string> = {
  RESEARCHING: 'Research',
  STRATEGIZING: 'Strategy',
  RISK_REVIEW: 'Risk Review',
  SIMULATING: 'Simulation',
  PERMISSION_GATE: 'Permission',
  MONITORING: 'Monitor',
}

type VaultApiResponse = {
  vault: {
    address: string
    owner: string
    navUsd: string
    policyVersion: number
    paused: boolean
    pauseReason: string | null
    constraint: Record<string, string>
  } | null
  policy: {
    address: string
    policyVersion: number
    contentHash: string
  } | null
  registry: {
    name: string | null
    owner_wallet: string
    permission_level: number
  } | null
  cycleStatus: {
    pendingCount: number
    activeJob: { status: string; cycle_id: number } | null
    lastCompleted: { status: string; cycle_id: number; updated_at: number } | null
  }
  pendingActions: Array<{
    id: string
    cycle_id: number
    typed_action_json: Record<string, unknown>
    status: string
  }>
  recentActivity: Array<{
    id: string
    event_type: string
    payload_json: Record<string, unknown>
    created_at: number
  }>
}

function formatUsd(value: string | undefined) {
  const num = Number(value ?? '0')
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
}

export function VaultDetailClient({ vaultAddress }: { vaultAddress: string }) {
  const [data, setData] = useState<VaultApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [queueing, setQueueing] = useState(false)
  const [execLogs, setExecLogs] = useState<ExecutionLogsResponse | null>(null)
  const [logsLoading, setLogsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/vaults/${vaultAddress}`, { cache: 'no-store' })
        const json = (await res.json()) as VaultApiResponse & { error?: string }
        if (!res.ok) {
          throw new Error(json.error ?? 'Failed to load vault')
        }
        if (!cancelled) {
          setData(json)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load vault')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [vaultAddress])

  useEffect(() => {
    let cancelled = false

    async function loadLogs() {
      setLogsLoading(true)
      try {
        const res = await fetch(`/api/vaults/${vaultAddress}/execution-logs`, { cache: 'no-store' })
        const json = (await res.json()) as ExecutionLogsResponse & { error?: string }
        if (!cancelled && !json.error) {
          setExecLogs(json)
        }
      } catch {
        // silent — non-critical
      } finally {
        if (!cancelled) {
          setLogsLoading(false)
        }
      }
    }

    loadLogs()
    return () => {
      cancelled = true
    }
  }, [vaultAddress])

  if (loading) {
    return <div className="mx-auto max-w-6xl p-6 text-sm text-text-secondary lg:p-8">Loading vault telemetry…</div>
  }

  if (error) {
    return <div className="mx-auto max-w-6xl p-6 text-sm text-accent-risk lg:p-8">{error}</div>
  }

  const vaultName = data?.registry?.name ?? data?.vault?.address ?? vaultAddress

  async function queueCycle() {
    setQueueing(true)
    try {
      const res = await fetch(`/api/vaults/${vaultAddress}/cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionLevel: data?.registry?.permission_level ?? 2, priority: 5 }),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to queue cycle')
      }
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to queue cycle')
    } finally {
      setQueueing(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-6 lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wider text-text-muted">
            Vault address
          </p>
          <h1 className="mt-3 break-all font-[family-name:var(--font-hanken)] text-4xl font-bold tracking-tight text-text-primary lg:text-5xl">
            {vaultName}
          </h1>
          <p className="mt-3 font-[family-name:var(--font-jetbrains)] text-xs text-text-secondary">{vaultAddress}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <OutlineButton onClick={queueCycle}>{queueing ? 'Queueing…' : 'Run Cycle'}</OutlineButton>
          <OutlineButton href={`/app/vault/${vaultAddress}/activity`}>View Activity</OutlineButton>
          <OutlineButton href={`https://explorer.solana.com/address/${vaultAddress}?cluster=devnet`}>Explorer</OutlineButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Vault NAV" value={formatUsd(data?.vault?.navUsd)} accent />
        <MetricCard label="Policy Version" value={String(data?.vault?.policyVersion ?? 0)} />
        <MetricCard label="Pending Actions" value={String(data?.pendingActions.length ?? 0)} accent />
        <MetricCard label="Queued Cycles" value={String(data?.cycleStatus.pendingCount ?? 0)} />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-6">
          <SectionHeading title="Constraint State" />
          <div className="mt-6 space-y-4">
            {Object.entries(data?.vault?.constraint ?? {}).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-text-secondary">{label}</span>
                <span className="font-[family-name:var(--font-jetbrains)] text-sm text-text-primary">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <SectionHeading title="Agent Status" />
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Active cycle</span>
              <span className="font-[family-name:var(--font-jetbrains)] text-sm text-accent">
                {data?.cycleStatus.activeJob ? `#${data.cycleStatus.activeJob.cycle_id} · ${data.cycleStatus.activeJob.status}` : 'Idle'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Last completed</span>
              <span className="font-[family-name:var(--font-jetbrains)] text-sm text-text-primary">
                {data?.cycleStatus.lastCompleted ? `#${data.cycleStatus.lastCompleted.cycle_id} · ${data.cycleStatus.lastCompleted.status}` : 'None'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Permission level</span>
              <span className="font-[family-name:var(--font-jetbrains)] text-sm text-text-primary">
                L{data?.registry?.permission_level ?? 2}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Policy hash</span>
              <span className="font-[family-name:var(--font-jetbrains)] text-xs text-text-primary">
                {data?.policy?.contentHash?.slice(0, 16) ?? '—'}…
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-6">
          <SectionHeading title="Pending Actions" />
          <div className="mt-6 space-y-4">
            {data?.pendingActions.length ? (
              data.pendingActions.map((action) => (
                <div key={action.id} className="border border-border bg-bg-base p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-accent">
                      Cycle #{action.cycle_id}
                    </span>
                    <StatusPill label={action.status} />
                  </div>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-[family-name:var(--font-jetbrains)] text-[11px] text-text-secondary">
                    {JSON.stringify(action.typed_action_json, null, 2)}
                  </pre>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary">No advisory actions are waiting for approval.</p>
            )}
          </div>
        </div>

        <div className="panel p-6">
          <SectionHeading title="Recent Activity" />
          <div className="mt-6 space-y-4">
            {data?.recentActivity.length ? (
              data.recentActivity.map((event) => (
                <div key={event.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-accent">
                      {event.event_type.replaceAll('_', ' ')}
                    </span>
                    <span className="text-xs text-text-muted">{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-[family-name:var(--font-jetbrains)] text-[11px] text-text-secondary">
                    {JSON.stringify(event.payload_json, null, 2)}
                  </pre>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary">No indexed activity yet.</p>
            )}
          </div>
          <Link
            href={`/app/vault/${vaultAddress}/activity`}
            className="mt-6 inline-flex font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wide text-accent"
          >
            Open full activity log →
          </Link>
        </div>
      </section>

      <section className="panel p-6">
        <SectionHeading title="Agent Logs & Reasoning" />
        <div className="mt-6 space-y-6">
          {/* On-chain execution log */}
          <div>
            <h3 className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-text-muted">
              On-chain decisions
              {execLogs?.onChain ? ` · ${execLogs.onChain.count} total` : ''}
            </h3>
            {logsLoading ? (
              <p className="mt-3 text-sm text-text-secondary">Loading logs…</p>
            ) : execLogs?.onChain && execLogs.onChain.entries.length > 0 ? (
              <div className="mt-3 space-y-2">
                {execLogs.onChain.entries.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <StatusPill
                        label={DECISION_LABELS[entry.decision] ?? `#${entry.decision}`}
                      />
                      <span className="text-xs text-text-secondary">
                        Action #{entry.actionType} · Cycle #{entry.cycleId}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {new Date(Number(entry.timestamp) * 1000).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-text-secondary">No on-chain decisions yet.</p>
            )}
          </div>

          {/* Off-chain reasoning */}

          <div>
            <h3 className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-text-muted">
              Agent reasoning
              {execLogs?.offChainRuns ? ` · ${execLogs.offChainRuns.length} runs` : ''}
            </h3>
            {logsLoading ? (
              <p className="mt-3 text-sm text-text-secondary">Loading reasoning…</p>
            ) : execLogs?.offChainRuns && execLogs.offChainRuns.length > 0 ? (
              <div className="mt-3 space-y-3">
                {execLogs.offChainRuns.map((run) => (
                  <div key={run.id} className="border border-border bg-bg-base p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase text-accent">
                          Cycle #{run.cycle_id}
                        </span>
                        <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase text-text-muted">
                          {STAGE_LABELS[run.stage] ?? run.stage}
                        </span>
                      </div>
                      <span className="text-xs text-text-muted">
                        {new Date(run.started_at).toLocaleString()}
                      </span>
                    </div>
                    {run.decision?.rationale ? (
                      <p className="mt-2 text-sm text-text-secondary">{String(run.decision.rationale)}</p>
                    ) : null}
                    {run.decision?.actions && Array.isArray(run.decision.actions) && run.decision.actions.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {run.decision.actions.map((action: string, i: number) => (
                          <span key={i} className="rounded border border-border px-2 py-0.5 text-[11px] text-text-muted">
                            {action}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {run.error ? (
                      <p className="mt-2 text-xs text-accent-risk">{run.error}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-text-secondary">No agent reasoning available yet. Run a cycle to see the agent's thought process.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
