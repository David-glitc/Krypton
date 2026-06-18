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
        title: 'Krypton — Programmable Capital Policy Engine for Solana',
        description:
          'Deploy a fund manager. Keep the keys. Describe what you want your capital to do. Krypton compiles it into an enforced, on-chain policy.',
      }),
    ],
    links: [
      { rel: 'icon', href: FAVICON_SVG },
      { rel: 'stylesheet', href: appCss },
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
      <body className="bg-[var(--bg-base)] text-[var(--text-primary)] antialiased">
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <KryptonLogo />
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
            Home
          </Link>
          <Link to="/app" className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
            App
          </Link>
          <Link to="/docs" className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
            Docs
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            © 2026 Krypton — The policy is the product.
          </p>
          <div className="flex gap-6">
            <a href="https://github.com/David-glitc/Krypton" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
              GitHub
            </a>
            <a href="https://x.com/krypton" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
              X
            </a>
          </div>
        </div>
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
