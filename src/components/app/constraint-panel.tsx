'use client'

import { AlertTriangle, Shield } from 'lucide-react'

import { StatusPill } from '@/components/app/app-shell'

export type ConstraintSnapshot = {
  maxDrawdownBps: string | number
  maxLeverageBps: string | number
  maxPositionBps: string | number
  maxCorrelatedExposureBps: string | number
  currentDrawdownBps: string | number
  currentLeverageBps: string | number
  currentConcentrationBps: string | number
  currentCorrelatedExposureBps: string | number
}

function bps(n: string | number): number {
  return Number(n) / 100
}

function utilization(current: string | number, max: string | number): number {
  const m = Number(max)
  if (!m) return 0
  return Math.min(100, (Number(current) / m) * 100)
}

export function vaultHealthScore(c: ConstraintSnapshot | null, paused: boolean): number {
  if (paused) return 0
  if (!c) return 50
  const utils = [
    utilization(c.currentDrawdownBps, c.maxDrawdownBps),
    utilization(c.currentLeverageBps, c.maxLeverageBps),
    utilization(c.currentConcentrationBps, c.maxPositionBps),
    utilization(c.currentCorrelatedExposureBps, c.maxCorrelatedExposureBps),
  ]
  const worst = Math.max(...utils)
  return Math.round(Math.max(0, 100 - worst))
}

function healthVariant(score: number): 'ok' | 'warn' | 'risk' {
  if (score >= 70) return 'ok'
  if (score >= 40) return 'warn'
  return 'risk'
}

function ConstraintBar({
  label,
  current,
  max,
  hint,
}: {
  label: string
  current: string | number
  max: string | number
  hint?: string
}) {
  const util = utilization(current, max)
  const barColor = util >= 90 ? 'bg-accent-risk' : util >= 70 ? 'bg-accent-warn' : 'bg-accent'

  return (
    <div className="rounded-lg border border-border/50 bg-bg-base/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-medium text-text-primary">{label}</p>
          {hint && <p className="mt-1 text-sm text-text-muted">{hint}</p>}
        </div>
        <span className="shrink-0 font-mono text-sm text-text-primary">
          {bps(current).toFixed(1)}% <span className="text-text-muted">/ {bps(max).toFixed(1)}%</span>
        </span>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-bg-deep">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${util}%` }} />
      </div>
      <p className="stat-label mt-2">{util.toFixed(0)}% of limit used</p>
    </div>
  )
}

export function ConstraintPanel({
  constraint,
  paused = false,
  compact = false,
}: {
  constraint: ConstraintSnapshot | null
  paused?: boolean
  compact?: boolean
}) {
  if (!constraint) {
    return (
      <div className="rounded-lg border border-dashed border-border p-5 text-sm text-text-secondary">
        Constraint data unavailable — check RPC connection.
      </div>
    )
  }

  const score = vaultHealthScore(constraint, paused)
  const variant = healthVariant(score)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-accent" />
          <span className="section-title">Policy limits</span>
        </div>
        <div className="flex items-center gap-2">
          {paused && (
            <span className="inline-flex items-center gap-1 text-xs text-accent-warn">
              <AlertTriangle className="h-3.5 w-3.5" />
              Paused
            </span>
          )}
          <StatusPill
            label={`Health ${score}%`}
            variant={variant === 'ok' ? 'ok' : variant === 'warn' ? 'warn' : 'risk'}
          />
        </div>
      </div>

      <div className={compact ? 'grid gap-3 sm:grid-cols-2' : 'grid gap-3'}>
        <ConstraintBar
          label="Drawdown"
          current={constraint.currentDrawdownBps}
          max={constraint.maxDrawdownBps}
          hint="Peak-to-trough loss vs limit"
        />
        <ConstraintBar
          label="Leverage"
          current={constraint.currentLeverageBps}
          max={constraint.maxLeverageBps}
          hint="Borrowed exposure vs cap"
        />
        <ConstraintBar
          label="Concentration"
          current={constraint.currentConcentrationBps}
          max={constraint.maxPositionBps}
          hint="Largest single position weight"
        />
        <ConstraintBar
          label="Correlated exposure"
          current={constraint.currentCorrelatedExposureBps}
          max={constraint.maxCorrelatedExposureBps}
          hint="Clustered risk bucket"
        />
      </div>
    </div>
  )
}
