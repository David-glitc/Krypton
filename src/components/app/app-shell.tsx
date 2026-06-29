'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutGrid,
  LineChart,
  Brain,
  Shield,
  Settings,
  User,
  ArrowRight,
  Menu,
  X,
  Zap,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react'
import { WalletButton } from '@/components/wallet-button'
import { vaultDisplayName } from '@/lib/format-money'
import { useVaultRegistry } from '@/contexts/vault-registry-context'

const SIDEBAR_LINKS = [
  { href: '/app', label: 'Vaults', icon: LayoutGrid, match: (p: string) => p === '/app' || p.startsWith('/app/vault') },
  { href: '/app/performance', label: 'Performance', icon: LineChart, match: (p: string) => p.startsWith('/app/performance') },
  { href: '/app/create', label: 'Strategy', icon: Brain, match: (p: string) => p.startsWith('/app/create') },
  { href: '/app/risk', label: 'Risk', icon: Shield, match: (p: string) => p.startsWith('/app/risk') },
  { href: '/app/profile', label: 'Profile', icon: User, match: (p: string) => p.startsWith('/app/profile') },
  { href: '/app/settings', label: 'Settings', icon: Settings, match: (p: string) => p.startsWith('/app/settings') },
]

type SidebarVault = {
  address: string
  name: string | null
}

function SidebarNav({
  vaults,
  currentVaultAddress,
  pathname,
  collapsed,
  mobile,
  onClose,
}: {
  vaults: SidebarVault[]
  currentVaultAddress: string | undefined
  pathname: string
  collapsed: boolean
  mobile?: boolean
  onClose?: () => void
}) {
  return (
    <>
      <nav className={`flex flex-col gap-1 ${collapsed ? 'px-2 items-center' : 'px-3'}`}>
        {SIDEBAR_LINKS.map((link) => {
          const active = link.match(pathname)
          const Icon = link.icon
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => mobile && onClose?.()}
              className={`flex items-center gap-3 rounded transition-colors ${
                collapsed ? 'justify-center p-3 w-10 h-10' : 'px-4 py-3'
              } ${
                active
                  ? 'bg-accent text-bg-base'
                  : 'text-text-secondary hover:bg-bg-panel hover:text-text-primary'
              }`}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-wide">{link.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {!collapsed && vaults.length > 0 && (
        <div className="mt-8 px-3">
          <p className="mb-2 px-4 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-text-muted">
            Your Vaults
          </p>
          <div className="flex flex-col gap-0.5">
            {vaults.map((v) => {
              const active = currentVaultAddress === v.address
              return (
                <Link
                  key={v.address}
                  href={`/app/vault/${v.address}`}
                  onClick={() => mobile && onClose?.()}
                  className={`flex items-center gap-2 rounded px-4 py-2.5 text-sm transition-colors ${
                    active
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:bg-bg-panel hover:text-text-primary'
                  }`}
                >
                  <Zap className="h-3 w-3 shrink-0" />
                  <span className="truncate">{vaultDisplayName(v.name, v.address)}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { vaults } = useVaultRegistry()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const currentVaultAddress = pathname.match(/^\/app\/vault\/(.+)$/)?.[1]

  const sidebarVaults: SidebarVault[] = vaults.map((v) => ({
    address: v.address,
    name: v.name,
  }))

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('krypton_sidebar_collapsed') === 'true' } catch {}
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('krypton_sidebar_collapsed', String(collapsed))
  }, [collapsed])

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-bg-deep transition-all duration-200 md:flex ${collapsed ? 'w-16' : 'w-64'}`}
      >
        <div className={`flex flex-col items-start px-5 pt-8 pb-6 ${collapsed ? 'px-0 items-center' : ''}`}>
          {collapsed ? (
            <Zap className="h-6 w-6 text-accent" />
          ) : (
            <>
              <h2 className="font-[family-name:var(--font-hanken)] text-lg font-bold leading-tight tracking-tight text-text-primary">
                Krypton
              </h2>
              <p className="mt-1 label-caps">
                AI vaults
              </p>
            </>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarNav
            vaults={sidebarVaults}
            currentVaultAddress={currentVaultAddress}
            pathname={pathname}
            collapsed={collapsed}
          />
        </div>

        <div className={`border-t border-border ${collapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-4'}`}>
          {!collapsed && <WalletButton />}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="text-text-secondary hover:text-text-primary transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>
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

        <div className="flex-1 overflow-y-auto">
          <SidebarNav
            vaults={sidebarVaults}
            currentVaultAddress={currentVaultAddress}
            pathname={pathname}
            collapsed={false}
            mobile
            onClose={() => setDrawerOpen(false)}
          />
        </div>

        <div className="border-t border-border p-4">
          <WalletButton />
        </div>
      </aside>

      <div className={`flex min-w-0 flex-1 flex-col transition-all duration-200 ${collapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <header className="glass sticky top-0 z-30 border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-text-secondary hover:text-text-primary md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="font-[family-name:var(--font-hanken)] text-base font-bold text-text-primary md:text-lg">
                Krypton
              </Link>
              <nav className="hidden items-center gap-5 sm:flex">
                <Link
                  href="/app"
                  className={`text-sm md:text-base ${pathname.startsWith('/app') ? 'border-b-2 border-accent text-accent pb-0.5' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Dashboard
                </Link>
                <Link href="/app/docs" className="text-sm text-text-secondary hover:text-text-primary md:text-base">
                  Docs
                </Link>
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
  const classes = `inline-flex items-center gap-2.5 bg-[#66ff8e] px-6 py-3.5 font-[family-name:var(--font-jetbrains)] text-[13px] font-medium uppercase tracking-wider text-[#003915] transition-[filter] hover:brightness-110 sm:px-8 sm:py-4 sm:text-sm ${className}`

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
  disabled = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  disabled?: boolean
}) {
  const classes =
    `inline-flex items-center justify-center border border-border px-5 py-2.5 font-[family-name:var(--font-jetbrains)] text-sm uppercase tracking-wide text-text-primary transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50 ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}

export function MetricCard({
  label,
  value,
  accent = false,
  size = 'default',
}: {
  label: string
  value: string
  accent?: boolean
  size?: 'default' | 'lg'
}) {
  const valueClass = size === 'lg' ? 'metric-value-lg' : 'metric-value'
  return (
    <div className="panel metric-card">
      <p className="label-caps">{label}</p>
      <p className={`${valueClass} ${accent ? 'text-accent' : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  )
}

export function StatusPill({
  label,
  variant = 'ok',
}: {
  label: string
  variant?: 'ok' | 'warn' | 'risk'
}) {
  const dot =
    variant === 'risk'
      ? 'bg-accent-risk'
      : variant === 'warn'
        ? 'bg-accent-warn'
        : 'bg-accent'

  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-base px-3.5 py-2 font-[family-name:var(--font-jetbrains)] text-xs text-text-primary sm:text-[13px]">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
