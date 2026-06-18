import * as React from 'react'

interface LoadingSpinnerProps {
  label?: string
  className?: string
}

export function LoadingSpinner({ label = 'Loading…', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent-policy)]"
        aria-label="Loading"
      />
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
    </div>
  )
}
