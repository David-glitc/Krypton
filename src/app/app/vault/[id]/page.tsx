import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVault, NAV_HISTORY, constraintToBarInput, levelName, levelDescription } from '@/lib/mock-data'

function formatUsd(n: number) {
  return '$' + n.toLocaleString('en-US')
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'active'
      ? 'text-accent-positive'
      : status === 'paused'
        ? 'text-amber-500'
        : 'text-text-muted'
  return (
    <span className={`font-mono text-[10px] uppercase ${color}`}>
      ● {status}
    </span>
  )
}

function ConstraintCard({ label, current, max, unit }: { label: string; current: number; max: number; unit: string }) {
  const { pct, color } = constraintToBarInput({ label, current, max, unit })
  return (
    <div className="bg-bg-panel border border-border rounded-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
        <span className="font-mono text-xs text-text-primary tabular-nums">
          {current}{unit} / {max}{unit}
        </span>
      </div>
      <div className="h-1.5 rounded-sm bg-bg-panel-raised overflow-hidden">
        <div className={`h-full rounded-sm ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[10px] text-text-muted mt-1.5 block">
        {pct.toFixed(0)}% utilized
      </span>
    </div>
  )
}

function PipelineStage({ name, active, complete }: { name: string; active: boolean; complete: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-accent animate-pulse' : complete ? 'bg-accent-positive' : 'bg-bg-panel-raised'}`} />
      <span className={`font-mono text-[10px] uppercase tracking-wider ${active ? 'text-accent' : complete ? 'text-accent-positive' : 'text-text-muted'}`}>
        {name}
      </span>
    </div>
  )
}

export default function VaultPage({ params }: { params: Promise<{ id: string }> }) {
  return <VaultPageContent params={params} />
}

async function VaultPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vault = getVault(id)

  if (!vault) notFound()

  const pipelineStages = ['research', 'strategy', 'risk', 'simulation', 'execution', 'monitoring'] as const
  const currentStageIdx = pipelineStages.indexOf(vault.agentPipeline.lastStage)
  const isDao = vault.governanceMode === 'dao_prediction_market'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/app"
        className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1 mb-6"
      >
        ← Vaults
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="font-mono text-lg font-semibold text-text-primary">{vault.name}</h1>
        <StatusBadge status={vault.status} />
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-accent-muted text-accent">
          {vault.executionMode}
        </span>
        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-border text-text-secondary">
          Level {vault.level} — {levelName(vault.level)}
        </span>
        {isDao && (
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-500">
            governance — coming soon
          </span>
        )}
        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-border text-text-secondary">
          privacy: {vault.privacyLevel}
        </span>
        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-border text-text-secondary">
          {vault.riskProfile} risk
        </span>
      </div>

      {/* Info row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">NAV</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            {formatUsd(vault.nav)}
          </p>
        </div>
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">Policy</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            v{vault.policyVersion}
          </p>
        </div>
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">Last cycle</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            #{vault.agentPipeline.lastCycleId}
          </p>
          <span className="font-mono text-[10px] text-text-muted">{vault.agentPipeline.lastCycleAt}</span>
        </div>
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">Rebalance</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            {vault.rebalanceFrequency}
          </p>
        </div>
      </div>

      {/* Agent Pipeline Status */}
      <h2 className="font-mono text-xs font-semibold text-text-muted uppercase mb-3">
        Agent pipeline
      </h2>
      <div className="bg-bg-panel border border-border rounded-sm p-4 mb-8">
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-3">
          {pipelineStages.map((stage, i) => (
            <PipelineStage
              key={stage}
              name={stage}
              active={vault.agentPipeline.lastStage === stage}
              complete={i < currentStageIdx}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Last decision</span>
            <p className="font-mono text-xs text-text-primary mt-0.5">{vault.agentPipeline.lastDecision}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Level {vault.level}</span>
            <p className="font-mono text-xs text-text-secondary mt-0.5">{levelDescription(vault.level)}</p>
          </div>
        </div>
      </div>

      {/* Constraint utilization */}
      <h2 className="font-mono text-xs font-semibold text-text-muted uppercase mb-3">
        Constraint utilization
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <ConstraintCard
          label="Drawdown"
          current={vault.constraints.drawdown.current}
          max={vault.constraints.drawdown.max}
          unit="%"
        />
        <ConstraintCard
          label="Leverage"
          current={vault.constraints.leverage.current}
          max={vault.constraints.leverage.max}
          unit="x"
        />
        <ConstraintCard
          label="Concentration"
          current={vault.constraints.concentration.current}
          max={vault.constraints.concentration.max}
          unit="%"
        />
        <ConstraintCard
          label="Correlated Exposure"
          current={vault.constraints.correlatedExposure.current}
          max={vault.constraints.correlatedExposure.max}
          unit="%"
        />
      </div>

      {/* NAV history chart */}
      <h2 className="font-mono text-xs font-semibold text-text-muted uppercase mb-3">
        NAV history
      </h2>
      <div className="bg-bg-panel border border-border rounded-sm p-5 mb-8">
        <div className="flex items-end gap-1 h-40">
          {NAV_HISTORY.map((pt: { nav: number; date: string }, i: number) => {
            const min = Math.min(...NAV_HISTORY.map((p: { nav: number }) => p.nav))
            const max = Math.max(...NAV_HISTORY.map((p: { nav: number }) => p.nav))
            const range = max - min || 1
            const height = ((pt.nav - min) / range) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-accent/40 rounded-sm min-h-[2px]"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={formatUsd(pt.nav)}
                />
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[10px] text-text-muted">
            {NAV_HISTORY[0]?.date}
          </span>
          <span className="font-mono text-[10px] text-text-muted">
            {NAV_HISTORY[NAV_HISTORY.length - 1]?.date}
          </span>
        </div>
      </div>

      {/* Policy summary */}
      <h2 className="font-mono text-xs font-semibold text-text-muted uppercase mb-3">
        Policy summary
      </h2>
      <div className="bg-bg-panel border border-border rounded-sm p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Governance</span>
            <p className="font-mono text-sm text-text-primary mt-1">
              {vault.governanceMode === 'owner' ? 'Owner (direct)' : 'DAO (futarchy)'}
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Privacy</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.privacyLevel}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Risk profile</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.riskProfile}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Max drawdown</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.constraints.drawdown.max}%</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Max leverage</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.constraints.leverage.max}x</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Concentration limit</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.constraints.concentration.max}%</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Correlated exposure</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.constraints.correlatedExposure.max}%</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Liquidity floor</span>
            <p className="font-mono text-sm text-text-primary mt-1">
              {vault.constraints.drawdown.max > 0 ? `$${(5000000 / 1000000).toFixed(1)}M` : '—'}
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Rebalance</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.rebalanceFrequency}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Assets</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.assets.join(', ')}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Protocols</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.protocols.join(', ')}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Allowed actions</span>
            <p className="font-mono text-sm text-text-primary mt-1">{vault.allowedActions.join(', ') || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Activity link */}
      <Link
        href={`/app/vault/${id}/activity`}
        className="font-mono text-xs text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-1"
      >
        View execution log →
      </Link>
    </div>
  )
}
