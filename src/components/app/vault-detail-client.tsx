'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { MetricCard, OutlineButton, StatusPill } from '@/components/app/app-shell'
import { AgentChatPanel } from '@/components/app/agent-chat-panel'
import { AgentLogsPanel, type AgentLogsData } from '@/components/app/agent-logs-panel'
import { ConstraintPanel } from '@/components/app/constraint-panel'
import { SectionHeading } from '@/components/app/section-heading'
import { VaultDeposit } from '@/components/app/vault-deposit'
import { VaultWithdraw } from '@/components/app/vault-withdraw'
import { useVaultRegistry } from '@/contexts/vault-registry-context'
import { useSolPrice } from '@/hooks/use-sol-price'
import { formatSol, formatUsd, solToUsd, vaultDisplayName } from '@/lib/format-money'
import { withRpcFallback } from '@/lib/solana/rpc-fallback'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

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
    activeJob: {
      status: string
      cycle_id: number
      lease_expires_at?: number | null
      created_at?: number
      updated_at?: number
    } | null
    lastCompleted: { status: string; cycle_id: number; updated_at: number; error?: string | null } | null
    quota?: {
      minIncluded: number
      remainingIncluded: number
      infraFailures: number
      usedBillable: number
    }
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

function hasRunningAgent(activeJob: VaultApiResponse['cycleStatus']['activeJob']): boolean {
  if (!activeJob) return false
  return activeJob.status === 'pending' || activeJob.status === 'leased'
}

function isStuckAgent(activeJob: VaultApiResponse['cycleStatus']['activeJob']): boolean {
  if (!activeJob) return false
  const now = Date.now()
  if (activeJob.status === 'leased' && activeJob.lease_expires_at != null) {
    return activeJob.lease_expires_at < now
  }
  if (activeJob.status === 'pending') {
    const started = activeJob.created_at ?? activeJob.updated_at ?? 0
    return now - started > 3 * 60 * 1000
  }
  return false
}

function PendingActionCard({
  action,
  vaultAddress,
  onActionUpdated,
}: {
  action: VaultApiResponse['pendingActions'][0]
  vaultAddress: string
  onActionUpdated: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  async function handleApprove() {
    setConfirming(false)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/vaults/${vaultAddress}/pending-actions/${action.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setToast('Action approved — agent will execute')
      onActionUpdated()
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to approve')
    } finally {
      setSubmitting(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  async function handleReject() {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/vaults/${vaultAddress}/pending-actions/${action.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setToast('Action rejected')
      onActionUpdated()
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to reject')
    } finally {
      setSubmitting(false)
      setTimeout(() => setToast(null), 5000)
    }
  }

  const actionData = action.typed_action_json as {
    actionType?: string
    rationale?: string
    txSignature?: string
    candidateActions?: string[]
    idleReason?: string
    agentState?: string
    investmentGoal?: string
  }
  const isIdle = actionData.agentState === 'idle_awaiting_approval'
  const isPending = action.status === 'pending'
  const canAct = isPending && !submitting
  const proposed =
    actionData.candidateActions?.filter((a) => a && a !== 'noop') ??
    (actionData.actionType && actionData.actionType !== 'agent_proposed' ? [actionData.actionType] : [])

  return (
    <div className="panel panel-pad">
      <div className="flex items-center justify-between gap-4">
        <span className="label-caps text-accent">
          {isIdle ? 'Agent idle' : 'Agent run'}
        </span>
        <StatusPill
          label={isIdle ? 'Awaiting approval' : action.status}
          variant={isIdle ? 'warn' : action.status === 'approved' ? 'ok' : undefined}
        />
      </div>

      {actionData.investmentGoal && (
        <p className="mt-2 text-xs text-text-muted">
          Goal: <span className="text-text-secondary">{actionData.investmentGoal}</span>
        </p>
      )}

      {proposed.length > 0 && (
        <ul className="mt-4 space-y-2">
          {proposed.slice(0, 4).map((move) => (
            <li key={move} className="text-base text-text-primary">
              → {move}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-base leading-relaxed text-text-secondary">
        {actionData.idleReason ?? actionData.rationale ?? 'No rationale'}
      </p>
      {actionData.txSignature && (
        <p className="mt-1 font-mono text-[11px] text-text-muted">
          Tx: {actionData.txSignature.slice(0, 16)}…
        </p>
      )}
      {canAct && (
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => setConfirming(true)}
            className="btn-primary px-5 py-2 text-xs"
            disabled={submitting}
          >
            {submitting ? '…' : 'Approve'}
          </button>
          <button
            onClick={handleReject}
            className="btn-secondary px-5 py-2 text-xs"
            disabled={submitting}
          >
            {submitting ? '…' : 'Reject'}
          </button>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="panel mx-4 max-w-md p-6">
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Confirm approval
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Execute this action on-chain? This will submit a transaction to Solana.
            </p>
            {actionData.rationale && (
              <p className="mt-3 rounded border border-border bg-bg-base p-3 text-xs text-text-secondary">
                {actionData.rationale}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="rounded border border-border px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="rounded bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600"
              >
                Confirm & Execute
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded border border-border bg-bg-surface px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

export function VaultDetailClient({ vaultAddress }: { vaultAddress: string }) {
  const { primaryWallet } = useDynamicContext()
  const { getVaultName, refetchVaults } = useVaultRegistry()
  const { solPriceUsd } = useSolPrice()
  const [data, setData] = useState<VaultApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [queueing, setQueueing] = useState(false)
  const [releasing, setReleasing] = useState(false)
  const [execLogs, setExecLogs] = useState<AgentLogsData | null>(null)
  const [logsLoading, setLogsLoading] = useState(true)
  const [balanceLamports, setBalanceLamports] = useState<number | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const hasActiveJob = data?.cycleStatus?.activeJob != null

  const load = useCallback(async () => {
    try {
      const [res, bal] = await Promise.all([
        fetch(`/api/vaults/${vaultAddress}`, { cache: 'no-store' }),
        withRpcFallback(c => c.getBalance(new PublicKey(vaultAddress))).catch(() => null),
      ])
      const json = (await res.json()) as VaultApiResponse & { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Failed to load vault')
      setData(json)
      setBalanceLamports(bal)
      setError(null)
      refetchVaults()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vault')
    } finally {
      setLoading(false)
    }
  }, [vaultAddress, refetchVaults])

  const loadLogs = useCallback(async () => {
    try {
      const res = await fetch(`/api/vaults/${vaultAddress}/execution-logs`, { cache: 'no-store' })
      const json = (await res.json()) as AgentLogsData & { error?: string }
      if (!json.error) setExecLogs(json)
    } catch {
      // silent
    } finally {
      setLogsLoading(false)
    }
  }, [vaultAddress])

  useEffect(() => {
    load()
    loadLogs()
  }, [load, loadLogs])

  // Auto-poll every 15s while a cycle is active
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (hasActiveJob) {
      pollRef.current = setInterval(() => { load(); loadLogs() }, 15_000)
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [hasActiveJob, load, loadLogs])

  if (loading) {
    return <div className="app-page text-sm text-text-secondary">Loading vault…</div>
  }

  if (error) {
    return <div className="app-page text-sm text-accent-risk">{error}</div>
  }

  const vaultName = vaultDisplayName(
    getVaultName(vaultAddress) ?? data?.registry?.name,
    vaultAddress,
  )
  const constraint = data?.vault?.constraint as {
    maxDrawdownBps: string
    maxLeverageBps: string
    maxPositionBps: string
    maxCorrelatedExposureBps: string
    currentDrawdownBps: string
    currentLeverageBps: string
    currentConcentrationBps: string
    currentCorrelatedExposureBps: string
  } | undefined
  const balanceSol = balanceLamports !== null ? balanceLamports / LAMPORTS_PER_SOL : null
  const vaultUsd = balanceSol != null ? solToUsd(balanceSol, solPriceUsd) : null
  const agentRunning = hasRunningAgent(data?.cycleStatus?.activeJob ?? null)
  const stuck = isStuckAgent(data?.cycleStatus?.activeJob ?? null)

  async function stopAgent() {
    setReleasing(true)
    try {
      const res = await fetch(`/api/vaults/${vaultAddress}/cycles`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to stop agent')
      await load()
      await loadLogs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop agent')
    } finally {
      setReleasing(false)
    }
  }

  async function runAgent() {
    setQueueing(true)
    try {
      const res = await fetch(`/api/vaults/${vaultAddress}/cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionLevel: data?.registry?.permission_level ?? 2, priority: 5 }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.hint ? `${json.error} ${json.hint}` : (json.error ?? 'Failed to run agent'))
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run agent')
    } finally {
      setQueueing(false)
    }
  }

  return (
    <div className="app-page stack-section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-3xl">
          <p className="label-caps">Vault</p>
          <h1 className="page-title mt-1 truncate">{vaultName}</h1>
          <p className="mt-2 font-mono text-sm text-text-muted break-all sm:break-normal sm:truncate">{vaultAddress}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <OutlineButton onClick={runAgent} disabled={agentRunning}>
            {queueing ? 'Starting…' : agentRunning ? 'Agent running…' : 'Run agent'}
          </OutlineButton>
          {agentRunning && (
            <OutlineButton onClick={stopAgent}>
              {releasing ? 'Stopping…' : 'Stop agent'}
            </OutlineButton>
          )}
          <OutlineButton href={`/app/vault/${vaultAddress}/activity`}>View Activity</OutlineButton>
          <OutlineButton href={`https://explorer.solana.com/address/${vaultAddress}?cluster=devnet`}>Explorer</OutlineButton>
        </div>
      </div>

      {stuck && (
        <div className="rounded-lg border border-accent-warn/40 bg-accent-warn/10 px-4 py-3 text-sm text-text-secondary">
          The agent looks stuck — it has been {data?.cycleStatus.activeJob?.status} for too long.
          Tap <strong>Stop agent</strong>, then run it again. Reject any stale pending actions below.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Vault balance"
          value={balanceSol != null ? `${formatUsd(vaultUsd ?? 0)} · ${formatSol(balanceSol)}` : '—'}
          accent
          size="lg"
        />
        <MetricCard label="On-chain NAV (USD)" value={formatUsd(Number(data?.vault?.navUsd ?? 0))} />
        <MetricCard label="Pending Actions" value={String(data?.pendingActions.length ?? 0)} accent />
        <MetricCard label="Agent queue" value={String(data?.cycleStatus.pendingCount ?? 0)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel panel-pad">
          <ConstraintPanel
            constraint={constraint ?? null}
            paused={data?.vault?.paused ?? false}
            compact
          />
        </div>
        <AgentChatPanel
          vaultAddress={vaultAddress}
          ownerWallet={primaryWallet?.address}
          vaultName={vaultName}
        />
      </div>

      <div className="panel panel-pad">
        <SectionHeading title="Agent" />
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="stat-label">Status</p>
            <p className="stat-value text-accent">
              {agentRunning
                ? stuck
                  ? 'Stuck — stop and retry'
                  : 'Running'
                : 'Idle'}
            </p>
          </div>
          <div>
            <p className="stat-label">Last run</p>
            <p className="stat-value text-text-primary">
              {data?.cycleStatus.lastCompleted
                ? data.cycleStatus.lastCompleted.status === 'completed'
                  ? 'Completed'
                  : data.cycleStatus.lastCompleted.status
                : 'None'}
            </p>
          </div>
          <div>
            <p className="stat-label">Included runs</p>
            <p className="stat-value text-text-primary">
              {data?.cycleStatus.quota
                ? `${data.cycleStatus.quota.remainingIncluded} of ${data.cycleStatus.quota.minIncluded} remaining`
                : '—'}
            </p>
          </div>
          <div>
            <p className="stat-label">Approvals</p>
            <p className="stat-value text-text-primary">
              {data?.registry?.permission_level != null && data.registry.permission_level >= 2
                ? 'You approve trades'
                : 'Auto-execute'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <VaultDeposit vaultAddress={vaultAddress} />
        <VaultWithdraw vaultAddress={vaultAddress} onWithdrawn={load} />
      </div>

      <div className="panel panel-pad">
        <SectionHeading title="Pending Actions" />
          <div className="mt-5 space-y-4">
              {data?.pendingActions.length ? (
              data.pendingActions.map((action) => (
                <PendingActionCard
                  key={action.id}
                  action={action}
                  vaultAddress={vaultAddress}
                  onActionUpdated={load}
                />
              ))
            ) : (
              <p className="body-sm text-text-secondary">No advisory actions are waiting for approval.</p>
            )}
          </div>
        </div>

        <div className="panel panel-pad">
          <SectionHeading title="Recent Activity" />
          <div className="mt-5 space-y-4">
            {data?.recentActivity.length ? (
              data.recentActivity.map((event) => (
                <div key={event.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs uppercase text-accent">
                      {event.event_type.replaceAll('_', ' ')}
                    </span>
                    <span className="text-xs text-text-muted">{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] text-text-secondary">
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
            className="mt-6 inline-flex font-mono text-xs uppercase tracking-wide text-accent"
          >
            Open full activity log →
          </Link>
        </div>

      <AgentLogsPanel data={execLogs} loading={logsLoading} onRefresh={loadLogs} vaultUsd={vaultUsd ?? undefined} />
    </div>
  )
}
