import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { KryptonLogo, FAVICON_SVG } from '~/components/KryptonLogo'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ...seo({
        title: 'Krypton — Agentic Capital Automation for Solana',
        description:
          'Define a Capital Policy — objectives, risk envelope, execution mandate. AI agent pipeline proposes actions. On-chain Constraint Engine enforces every trade.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}`,
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh antialiased">
        {children}
        {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
        <Scripts />
      </body>
    </html>
  )
}

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <KryptonLogo size="sm" />
          <span className="gradient-text">Krypton</span>
        </Link>
        <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          <Link to="/docs" className="hover:text-[var(--text-primary)] transition-colors">
            Docs
          </Link>
          <Link to="/app" className="hover:text-[var(--text-primary)] transition-colors">
            App
          </Link>
          <Link to="/app/create" className="btn-primary text-xs">
            Create vault
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-3">
          <KryptonLogo size="sm" />
          <span className="font-display text-sm font-semibold text-[var(--text-secondary)]">
            Krypton
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
          Krypton is infrastructure, not an investment adviser. Capital is at risk.
        </p>
        <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
          Working name &middot; subject to brand review
        </p>
      </div>
    </footer>
  )
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

export function RootOutlet() {
  return <Outlet />
}