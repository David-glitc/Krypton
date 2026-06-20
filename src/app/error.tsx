'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">something went wrong</p>
      <p className="max-w-md text-sm text-text-secondary">{error.message ?? 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
