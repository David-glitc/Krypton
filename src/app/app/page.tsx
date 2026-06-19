import Link from 'next/link'
import { DEMO_VAULTS, constraintToBarInput } from '@/lib/mock-data'

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

function ConstraintBar({ current, max, unit }: { current: number; max: number; unit: string }) {
  const { pct, color } = constraintToBarInput({
    label: '',
    current,
    max,
    unit,
  })
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-sm bg-bg-panel-raised overflow-hidden">
        <div className={`h-full rounded-sm ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[10px] text-text-muted shrink-0">
        {current}{unit} / {max}{unit}
      </span>
    </div>
  )
}

export default function VaultsPage() {
  const totalNav = DEMO_VAULTS.reduce((s: number, v: { nav: number }) => s + v.nav, 0)
  const activeCount = DEMO_VAULTS.filter((v: { status: string }) => v.status === 'active').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-lg font-semibold text-text-primary">Vaults</h1>
        <Link
          href="/app/deploy"
          className="font-mono text-xs text-text-secondary border border-border px-3 py-1.5 rounded-sm hover:text-text-primary hover:border-text-muted transition-colors"
        >
          + New vault
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">Total NAV</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            {formatUsd(totalNav)}
          </p>
        </div>
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">Active vaults</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            {activeCount}
          </p>
        </div>
        <div className="bg-bg-panel border border-border rounded-sm p-4">
          <span className="font-mono text-[10px] text-text-muted uppercase">Constraint checks</span>
          <p className="font-mono text-lg font-semibold text-text-primary mt-1">
            8 / action
          </p>
        </div>
      </div>

      {/* Vault cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DEMO_VAULTS.map((vault) => (
          <Link
            key={vault.id}
            href={`/app/vault/${vault.id}`}
            className="bg-bg-panel border border-border rounded-sm p-5 hover:border-text-muted transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                  {vault.name}
                </h2>
                <StatusBadge status={vault.status} />
              </div>
              <span className="font-mono text-sm font-semibold text-text-primary">
                {formatUsd(vault.nav)}
              </span>
            </div>

            <div className="space-y-2.5">
              <ConstraintBar
                current={vault.constraints.drawdown.current}
                max={vault.constraints.drawdown.max}
                unit="%"
              />
              <ConstraintBar
                current={vault.constraints.leverage.current}
                max={vault.constraints.leverage.max}
                unit="x"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
