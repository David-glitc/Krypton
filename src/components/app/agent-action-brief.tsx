'use client'

import type { AgentLogsData } from '@/components/app/agent-logs-panel'
import { StatusPill } from '@/components/app/app-shell'
import { formatUsd } from '@/lib/format-money'
import { ArrowRight, AlertTriangle, Target, TrendingUp, Shield } from 'lucide-react'

type ParsedDecision = {
  rationale?: string
  candidateActions?: string[]
  actions?: string[]
  investmentGoal?: string
  hypotheses?: string[]
  riskScore?: number
  requiresUserApproval?: boolean
}

function isInfra(text: string | null | undefined): boolean {
  return Boolean(text && /vault state unavailable|VAULT_STATE_UNAVAILABLE/i.test(text))
}

function cleanRationale(text?: string): string | undefined {
  if (!text) return undefined
  if (/^LLM response for /i.test(text)) return undefined
  if (/^LLM returned unparseable/i.test(text)) return undefined
  if (/no action has been proposed yet/i.test(text)) return undefined
  if (/has not yet proposed a specific action/i.test(text)) return undefined
  if (/cannot determine if an action is safe/i.test(text)) return undefined
  return text.trim()
}

function latestCycleRuns(data: AgentLogsData) {
  const byCycle = new Map<number, AgentLogsData['offChainRuns']>()
  for (const run of data.offChainRuns) {
    const list = byCycle.get(run.cycle_id) ?? []
    list.push(run)
    byCycle.set(run.cycle_id, list)
  }
  const cycles = [...byCycle.entries()].sort((a, b) => b[0] - a[0])
  if (!cycles.length) return null
  const [cycleId, runs] = cycles[0]!
  return { cycleId, runs }
}

export function extractActionBrief(data: AgentLogsData | null, vaultUsd?: number) {
  if (!data) return null
  const latest = latestCycleRuns(data)
  if (!latest) return null

  const find = (stage: string) =>
    latest.runs.find((r) => r.stage === stage)?.decision as ParsedDecision | null | undefined

  const strategy = find('STRATEGIZING')
  const research = find('RESEARCHING')
  const risk = find('RISK_REVIEW')
  const perm = find('PERMISSION_GATE')
  const monitor = find('MONITORING')

  const actions = (strategy?.candidateActions ?? strategy?.actions ?? []).filter(
    (a) => a && a !== 'noop' && !/^maintain current/i.test(a),
  )
  const investmentGoal =
    strategy?.investmentGoal ??
    (strategy?.rationale?.startsWith('Goal:') ? strategy.rationale.split('\n')[0]?.replace(/^Goal:\s*/, '') : undefined)

  const infra = latest.runs.some((r) => isInfra(r.error) || isInfra(r.decision?.rationale))
  const execError = latest.runs.find((r) => r.error)?.error
  const isAuthError = Boolean(execError && /0x1771|NotAuthorised|not authorised/i.test(execError))

  let verdict: 'action' | 'wait' | 'error' | 'approval' = 'wait'
  if (infra) verdict = 'error'
  else if (isAuthError || (perm?.requiresUserApproval && actions.length > 0)) verdict = 'approval'
  else if (execError) verdict = 'error'
  else if (actions.length > 0) verdict = 'action'

  const summary =
    cleanRationale(strategy?.rationale) ??
    cleanRationale(monitor?.rationale) ??
    cleanRationale(research?.rationale) ??
    cleanRationale(risk?.rationale) ??
    (actions.length > 0
      ? `The agent proposes ${actions.length} move${actions.length === 1 ? '' : 's'} for this vault.`
      : 'Agent is on standby — expand the pipeline below for details.')

  return {
    cycleId: latest.cycleId,
    actions,
    investmentGoal,
    hypotheses: research?.hypotheses?.filter((h) => !/^maintain current/i.test(h)) ?? [],
    riskScore: risk?.riskScore,
    verdict,
    infra,
    execError,
    summary,
    vaultUsd,
  }
}

export function AgentActionBrief({
  data,
  vaultUsd,
}: {
  data: AgentLogsData | null
  vaultUsd?: number
}) {
  const brief = extractActionBrief(data, vaultUsd)
  if (!brief) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-bg-base/50 p-5 text-sm text-text-secondary">
        Run the agent to see what it wants to do with your capital.
      </div>
    )
  }

  const verdictLabel =
    brief.verdict === 'error'
      ? 'Needs attention'
      : brief.verdict === 'approval'
        ? 'Awaiting your approval'
        : brief.verdict === 'action'
          ? 'Ready to deploy'
          : 'On standby'

  const verdictVariant =
    brief.verdict === 'error' ? 'risk' : brief.verdict === 'approval' ? 'warn' : 'ok'

  return (
    <div
      className={`rounded-lg border p-6 sm:p-7 ${
        brief.infra ? 'border-accent-risk/40 bg-accent-risk-muted/20' : 'border-accent/30 bg-accent-muted/30'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-caps">Latest agent run</p>
          <h3 className="section-title mt-2">
            {brief.infra
              ? 'Could not read vault state'
              : brief.execError
                ? 'Execution failed'
                : 'What the agent recommends'}
          </h3>
        </div>
        <StatusPill label={verdictLabel} variant={verdictVariant} />
      </div>

      {brief.investmentGoal && (
        <div className="mt-4 flex items-start gap-2 rounded border border-accent/20 bg-bg-base/60 px-3 py-2.5">
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Investment goal</p>
            <p className="mt-0.5 text-sm font-medium text-text-primary">{brief.investmentGoal}</p>
          </div>
        </div>
      )}

      {brief.execError && !brief.infra && brief.verdict !== 'approval' && (
        <p className="mt-3 flex items-start gap-2 text-sm text-accent-risk">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {brief.execError.includes('AccountNotInitialized')
            ? 'On-chain execution failed — vault owner resolution was wrong (now fixed). Stop the agent and run again.'
            : brief.execError.length > 200
              ? `${brief.execError.slice(0, 200)}…`
              : brief.execError}
        </p>
      )}

      {brief.verdict === 'approval' && !brief.infra && (
        <p className="mt-3 flex items-start gap-2 text-sm text-amber-200/90">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Agent is idle until you approve the proposed moves below.
        </p>
      )}

      {brief.infra && (
        <p className="mt-3 flex items-start gap-2 text-sm text-accent-risk">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Previous run hit an infrastructure error. Stop the agent if it is stuck, then run again.
        </p>
      )}

      <p className="mt-4 text-base leading-relaxed text-text-secondary">{brief.summary}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {vaultUsd != null && (
          <div className="rounded border border-border/60 bg-bg-base/80 p-4">
            <p className="label-caps flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Capital in vault
            </p>
            <p className="metric-value mt-2 text-accent">{formatUsd(vaultUsd)}</p>
          </div>
        )}
        {brief.actions.length > 0 && (
          <div className="rounded border border-border/60 bg-bg-base/80 p-4 sm:col-span-2">
            <p className="label-caps">Proposed moves</p>
            <ul className="mt-3 space-y-2">
              {brief.actions.slice(0, 3).map((action) => (
                <li key={action} className="flex items-start gap-2 text-base text-text-primary">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-accent" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
        {typeof brief.riskScore === 'number' && (
          <div className="rounded border border-border/60 bg-bg-base/80 p-4">
            <p className="label-caps flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Risk score
            </p>
            <p className="metric-value mt-2 text-text-primary">
              {(brief.riskScore * 100).toFixed(0)}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
