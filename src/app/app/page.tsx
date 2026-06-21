"use client"

import Link from "next/link"

export default function VaultsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label mb-1">capital</p>
          <h1 className="font-display text-2xl font-semibold text-text-primary">Your vaults</h1>
        </div>
        <Link
          href="/app/create"
          className="btn-primary"
        >
          New vault →
        </Link>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 animate-float">
          <span className="text-2xl text-accent">◈</span>
        </div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-2">No vaults yet</h2>
        <p className="text-sm text-text-secondary text-center max-w-md mb-6">
          Create your first policy-bound vault. Describe your strategy in natural language and our AI agents will generate the constraints.
        </p>
        <Link
          href="/app/create"
          className="btn-primary animate-pulse-glow"
        >
          Create your first vault →
        </Link>
      </div>
    </div>
  )
}
