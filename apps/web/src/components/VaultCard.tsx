import { Link } from '@tanstack/react-router'
import type { VaultSummary } from '@krypton/sdk'

export function VaultCard({ vault }: { vault: VaultSummary }) {
  const drawdownPct = ((vault.constraint.currentDrawdownBps / vault.constraint.maxDrawdownBps) * 100).toFixed(0)
  const leveragePct = ((vault.constraint.currentLeverageBps / vault.constraint.maxLeverageBps) * 100).toFixed(0)
  const isDanger = Number(drawdownPct) >= 90 || Number(leveragePct) >= 90
  const isWarning = Number(drawdownPct) >= 70 || Number(leveragePct) >= 70

  return (
    <Link
      to="/app/vault/$id"
      params={{ id: vault.id }}
      className="panel block p-5 transition hover:bg-[var(--bg-panel-raised)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-mono text-lg text-[var(--text-primary)]">{vault.name}</h2>
          <p className="mt-1 font-mono text-sm text-[var(--accent)]">
            ${vault.navUsd.toLocaleString()} NAV
          </p>
        </div>
        <div className="flex items-center gap-2">
          {vault.constraint.paused && (
            <span className="rounded-sm bg-[var(--accent-risk)]/10 px-2 py-0.5 font-mono text-[10px] uppercase text-[var(--accent-risk)]">
              paused
            </span>
          )}
          <span className="font-mono text-xs text-[var(--text-secondary)]">L{vault.permissionLevel}</span>
        </div>
      </div>

      {/* Constraint bars */}
      <div className="mt-4 space-y-2">
        <ConstraintMiniBar
          label="drawdown"
          current={vault.constraint.currentDrawdownBps / 100}
          max={vault.constraint.maxDrawdownBps / 100}
          unit="%"
          isDanger={isDanger}
          isWarning={isWarning}
        />
        <ConstraintMiniBar
          label="leverage"
          current={vault.constraint.currentLeverageBps / 10000}
          max={vault.constraint.maxLeverageBps / 10000}
          unit="x"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Policy v{vault.policyVersion}</span>
        <span>{vault.constraint.paused ? 'Paused' : 'Active'}</span>
      </div>
    </Link>
  )
}

function ConstraintMiniBar({
  label,
  current,
  max,
  unit,
  isDanger,
  isWarning,
}: {
  label: string
  current: number
  max: number
  unit: string
  isDanger?: boolean
  isWarning?: boolean
}) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0
  return (
    <div>
      <div className="mb-0.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        <span>{label}</span>
        <span>
          {current.toFixed(1)}{unit} / {max.toFixed(1)}{unit}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-sm bg-[var(--bg-panel-raised)]">
        <div
          className={`h-full transition-all ${
            isDanger ? 'bg-[var(--accent-risk)]' : isWarning ? 'bg-[var(--accent)]' : 'bg-[var(--accent)]'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
