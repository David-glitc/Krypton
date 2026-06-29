'use client'

import { Coins, Shield, Zap } from 'lucide-react'
import { SectionHeading } from './section-heading'

export type PipelinePreviewData = {
  assets: string[]
  stablecoins: string
  largeCaps: string
  maxLeverage: string
  targetApy: string
  protocols: string
  frequency: string
  active: boolean
}

export const DEFAULT_PIPELINE: PipelinePreviewData = {
  assets: ['USDC', 'PYUSD', 'SOL', 'JUP'],
  stablecoins: 'USDC, PYUSD',
  largeCaps: 'SOL, JUP',
  maxLeverage: '2.50x',
  targetApy: '12.5%',
  protocols: 'Kamino, Meteora',
  frequency: '10m / Audit',
  active: true,
}

export function pipelineFromForm(form: {
  assets: string[]
  protocols: string[]
  maxLeverage: number
  maxDrawdownPct: number
  rebalanceFrequency: string
}): PipelinePreviewData {
  const stables = form.assets.filter((a) => ['USDC', 'USDT', 'PYUSD'].includes(a))
  const caps = form.assets.filter((a) => !['USDC', 'USDT', 'PYUSD'].includes(a))

  return {
    assets: form.assets,
    stablecoins: stables.length ? stables.join(', ') : '—',
    largeCaps: caps.length ? caps.join(', ') : '—',
    maxLeverage: `${form.maxLeverage.toFixed(2)}x`,
    targetApy: `${Math.max(8, 24 - form.maxDrawdownPct).toFixed(1)}%`,
    protocols: form.protocols.length ? form.protocols.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ') : '—',
    frequency: form.rebalanceFrequency.replace('_', ' '),
    active: true,
  }
}

function StageCard({
  stage,
  icon: Icon,
  headerRightLabel,
  headerRightValue,
  rows,
}: {
  stage: string
  icon: React.ComponentType<{ className?: string }>
  headerRightLabel: string
  headerRightValue: string
  rows: { label: string; value: string }[]
}) {
  return (
    <div className="relative flex-1 panel p-6">
      <span className="absolute -top-3 left-6 border border-border bg-bg-base px-3 py-1 font-mono text-[10px] uppercase text-[#a9e2ef]">
        {stage}
      </span>
      <div className="mb-6 flex items-start justify-between">
        <Icon className="h-6 w-6 text-accent" />
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase text-text-secondary">
            {headerRightLabel}
          </p>
          <p className="font-mono text-lg text-accent">{headerRightValue}</p>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-text-secondary">{row.label}</span>
            <span className="font-mono text-accent">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PipelinePreview({ data }: { data: PipelinePreviewData }) {
  return (
    <section className="space-y-8 pt-8">
      <SectionHeading
        title="Agent Pipeline Preview"
        trailing={
          data.active ? (
            <span className="border border-accent/30 px-2 py-1 font-mono text-[10px] uppercase text-accent">
              Simulation Active
            </span>
          ) : null
        }
      />

      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
        <StageCard
          stage="STG-1: Universe"
          icon={Coins}
          headerRightLabel="Assets Selected"
          headerRightValue={`${data.assets.length} Tokens`}
          rows={[
            { label: 'Stablecoins', value: data.stablecoins },
            { label: 'Large Caps', value: data.largeCaps },
          ]}
        />
        <div className="hidden h-px w-8 shrink-0 bg-gradient-to-r from-border via-accent to-border lg:block" />
        <StageCard
          stage="STG-2: Risk Engine"
          icon={Shield}
          headerRightLabel="Max Leverage"
          headerRightValue={data.maxLeverage}
          rows={[
            { label: 'Auto-Deleverage Threshold', value: '92% LTV' },
            { label: 'Volatility Guard', value: '15min Window' },
          ]}
        />
        <div className="hidden h-px w-8 shrink-0 bg-gradient-to-r from-border via-accent to-border lg:block" />
        <StageCard
          stage="STG-3: Execution"
          icon={Zap}
          headerRightLabel="Target APY"
          headerRightValue={data.targetApy}
          rows={[
            { label: 'Protocols', value: data.protocols },
            { label: 'Frequency', value: data.frequency },
          ]}
        />
      </div>
    </section>
  )
}
