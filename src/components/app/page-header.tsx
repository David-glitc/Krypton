'use client'

import Link from 'next/link'

export function PageHeader({
  title,
  description,
  backHref,
  actions,
}: {
  title: string
  description?: string
  backHref?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-3xl">
        {backHref && (
          <Link href={backHref} className="mb-3 inline-block text-sm text-text-secondary hover:text-text-primary">
            ← Back
          </Link>
        )}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-lead mt-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
