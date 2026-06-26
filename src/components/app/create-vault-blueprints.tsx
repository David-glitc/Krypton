'use client'

import { Layers, Shield, Zap } from 'lucide-react'
import { SectionHeading } from '@/components/app/section-heading'
import { BLUEPRINTS } from '@/lib/vault-demo-data'

const ICONS = {
  shield: Shield,
  zap: Zap,
  layers: Layers,
} as const

export function CreateVaultBlueprints({
  onSelect,
  disabled,
}: {
  onSelect: (prompt: string) => void
  disabled?: boolean
}) {
  return (
    <section className="space-y-4 sm:space-y-6">
      <SectionHeading title="Start from a blueprint" />
      <p className="text-sm text-text-secondary">Pick a template or describe your own strategy below.</p>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {BLUEPRINTS.map((bp) => {
          const Icon = ICONS[bp.icon]
          return (
            <button
              key={bp.title}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(bp.prompt)}
              className="panel group min-h-[140px] p-4 text-left transition-colors hover:border-accent/50 disabled:opacity-50 sm:min-h-[160px] sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <Icon className="h-5 w-5 shrink-0 text-accent sm:h-6 sm:w-6" />
                <span className="font-[family-name:var(--font-jetbrains)] text-sm text-accent sm:text-lg">{bp.apy}</span>
              </div>
              <h3 className="mt-3 font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary sm:text-lg">
                {bp.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-secondary sm:mt-2 sm:text-sm">
                {bp.description}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
