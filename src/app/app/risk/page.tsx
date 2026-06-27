'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RiskPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link href="/app" className="text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-hanken)] text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Risk
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Exposure analysis, drawdown monitoring, and constraint health.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-24">
        <p className="text-sm text-text-muted">Risk dashboard coming soon.</p>
      </div>
    </div>
  )
}
