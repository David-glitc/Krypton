import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVault, NAV_HISTORY, constraintToBarInput } from '@/lib/mock-data'

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
        <span className="font-mono text-[10px] text-text-muted uppercase">{label}</span>
        <span className="font-mono text-xs text-text-secondary">
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

export default function VaultPage({ params }: { params: Promise<{ id: string }> }) {
  return <VaultPageContent params={params} />
}

async function VaultPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const vault = getVault(id)

  if (!vault) notFound()

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
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-mono text-lg font-semibold text-text-primary">{vault.name}</h1>
        <StatusBadge status={vault.status} />
      </div>

      {/* Info row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">NAV</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            {formatUsd(vault.nav)}
          </p>
        </div>
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">Policy version</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            v{vault.policyVersion}
          </p>
        </div>
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">Level</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            {vault.level}
          </p>
        </div>
      </div>

      {/* Constraint utilization */}
      <h2 className="font-mono text-xs font-semibold text-text-muted uppercase mb-3">
        Constraint utilization
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
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
      </div>

      {/* NAV history chart placeholder */}
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
      <div className="bg-bg-panel border border-border rounded-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Max drawdown</span>
            <p className="font-mono text-sm text-text-primary mt-1">
              {vault.constraints.drawdown.max}%
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Max leverage</span>
            <p className="font-mono text-sm text-text-primary mt-1">
              {vault.constraints.leverage.max}x
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Concentration limit</span>
            <p className="font-mono text-sm text-text-primary mt-1">
              {vault.constraints.concentration.max}%
            </p>
          </div>
          <div>
            <span className="font-mono text-[10px] text-text-muted uppercase">Policy version</span>
            <p className="font-mono text-sm text-text-primary mt-1">
              v{vault.policyVersion}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
