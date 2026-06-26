'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutGrid,
  LineChart,
  Brain,
  Shield,
  Settings,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react'
import { WalletButton } from '@/components/wallet-button'

const SIDEBAR_LINKS = [
  { href: '/app', label: 'Assets', icon: LayoutGrid, match: (p: string) => p === '/app' || p.startsWith('/app/vault') },
  { href: '#', label: 'Performance', icon: LineChart, match: () => false },
  { href: '/app/create', label: 'Strategy', icon: Brain, match: (p: string) => p.startsWith('/app/create') },
  { href: '#', label: 'Risk', icon: Shield, match: () => false },
  { href: '#', label: 'Settings', icon: Settings, match: () => false },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const onCreate = pathname.startsWith('/app/create')
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-bg-deep md:flex">
        <div className="px-6 pt-16 pb-8">
          <h2 className="font-[family-name:var(--font-hanken)] text-4xl font-bold leading-tight tracking-tight text-text-primary">
            Krypton Vault
          </h2>
          <p className="mt-2 font-[family-name:var(--font-jetbrains)] text-[13px] uppercase tracking-wide text-text-secondary">
            AI-Managed Yield
          </p>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {SIDEBAR_LINKS.map((link) => {
            const active = link.match(pathname)
            const Icon = link.icon
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 rounded px-4 py-3 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wide transition-colors ${
                  active
                    ? 'bg-accent text-bg-base'
                    : 'text-text-secondary hover:bg-bg-panel hover:text-text-primary'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {onCreate && (
          <div className="mt-auto border-t border-border p-6">
            <div className="flex items-center justify-between font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wide text-text-muted">
              <span>System Load</span>
              <span className="text-accent">34%</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-bg-panel">
              <div className="h-full w-[34%] bg-accent" />
            </div>
          </div>
        )}

        <div className="mt-auto border-t border-border p-4">
          <WalletButton />
        </div>
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-bg-deep transition-transform duration-200 md:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-8">
          <h2 className="font-[family-name:var(--font-hanken)] text-2xl font-bold leading-tight tracking-tight text-text-primary">
            Krypton Vault
          </h2>
          <button onClick={() => setDrawerOpen(false)} className="text-text-secondary hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {SIDEBAR_LINKS.map((link) => {
            const active = link.match(pathname)
            const Icon = link.icon
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 rounded px-4 py-3 font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wide transition-colors ${
                  active
                    ? 'bg-accent text-bg-base'
                    : 'text-text-secondary hover:bg-bg-panel hover:text-text-primary'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-border p-4">
          <WalletButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <header className="glass sticky top-0 z-30 border-b border-border">
          <div className="flex h-14 items-center justify-between px-4 md:h-[72px] md:px-6">
            <div className="flex items-center gap-3 md:gap-8">
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-text-secondary hover:text-text-primary md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="font-[family-name:var(--font-hanken)] text-lg font-bold text-text-primary md:text-xl">
                Krypton
              </Link>
              <nav className="hidden items-center gap-6 sm:flex md:gap-8">
                <Link
                  href="/app"
                  className={`text-base md:text-lg ${pathname.startsWith('/app') ? 'border-b-2 border-accent text-accent pb-0.5' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Dashboard
                </Link>
                <Link href="/#simulation" className="text-base text-text-secondary hover:text-text-primary md:text-lg">
                  Research
                </Link>
                <a href="https://github.com/David-glitc/Krypton" className="text-base text-text-secondary hover:text-text-primary md:text-lg">
                  Docs
                </a>
              </nav>
            </div>
            <WalletButton />
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

export function PrimaryCta({
  children,
  href,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}) {
  const inner = (
    <>
      {children}
      <ArrowRight className="h-3 w-3" />
    </>
  )
  const classes = `inline-flex items-center gap-2 bg-[#66ff8e] px-5 py-3 font-[family-name:var(--font-jetbrains)] text-[12px] font-medium uppercase tracking-wider text-[#003915] transition-[filter] hover:brightness-110 sm:px-8 sm:py-4 sm:text-[13px] ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  )
}

export function OutlineButton({
  children,
  onClick,
  href,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
}) {
  const classes =
    `inline-flex items-center justify-center border border-border px-4 py-2 font-[family-name:var(--font-jetbrains)] text-[13px] uppercase tracking-wide text-text-primary transition-colors hover:border-accent ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  )
}

export function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="panel flex min-h-[104px] flex-col justify-between p-4 sm:p-6">
      <p className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-wide text-[#a9e2ef] sm:text-[13px]">
        {label}
      </p>
      <p className={'font-[family-name:var(--font-jetbrains)] text-2xl font-semibold sm:text-3xl md:text-4xl ' + (accent ? 'text-accent' : 'text-text-primary')}>
        {value}
      </p>
    </div>
  )
}

export function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-base px-3 py-1.5 font-[family-name:var(--font-jetbrains)] text-[11px] text-text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {label}
    </span>
  )
}
