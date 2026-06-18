import { createFileRoute, Link, Outlet, useParams } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { KryptonAuthProvider, useKryptonAuth } from '~/lib/AuthProvider'
import { getInviteHint, isInviteAllowed } from '~/lib/invite'
import { KryptonLogo } from '~/components/KryptonLogo'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { DEMO_VAULTS } from '~/lib/mock-data'
export const Route = createFileRoute('/app')({
  component: AppLayout,
})
function AppLayout() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Give wallet SDKs a moment to initialize (or fail).
    // This prevents a flash of blank content during startup.
    const timer = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--bg-base)]">
        <LoadingSpinner label="Initializing…" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <KryptonAuthProvider>
        <AppGate />
      </KryptonAuthProvider>
    </ErrorBoundary>
  )
}
function AppGate() {
  const { isConnected, primaryAddress, dynamic, lazorkit } = useKryptonAuth()
  const allowed = isInviteAllowed(primaryAddress)

  if (!isConnected) {
    return (
      <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
        <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
            <KryptonLogo />
          </div>
        </header>
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]">auth_required</p>
          <h1 className="font-display mt-4 text-2xl font-semibold">Connect your wallet</h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{getInviteHint()}</p>
          <p className="mt-6 text-xs text-[var(--text-muted)]">Use Dynamic (social/email) or Lazorkit (passkey) to connect.</p>
        </main>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
        <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
            <KryptonLogo />
          </div>
        </header>
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent-warning)]">access_denied</p>
          <h1 className="font-display mt-4 text-2xl font-semibold">Private beta</h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Your wallet is not in the beta allowlist. Request access to continue.</p>
        </main>
      </div>
    )
  }

  return <AppShell />
}

const NAV_SECTIONS = [
  { label: 'capital', items: [{ to: '/app', label: 'Vaults' }] },
  { label: 'create', items: [{ to: '/app/create', label: 'Deploy vault' }, { to: '/docs', label: 'Policy schema' }] },
] as const

function AppShell() {
  const { primaryAddress, dynamic } = useKryptonAuth()
  const params = useParams({ strict: false })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentVaultId = params.id

  return (
    <div className="flex min-h-dvh bg-[var(--bg-base)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-panel)]/95 backdrop-blur-md transition-transform lg:relative lg:z-auto lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
            <KryptonLogo />
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <span className="text-xs text-[var(--text-muted)]">✕</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label} className="mb-4">
                <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  {section.label}
                </p>
                {section.items.map((item) => (
                  <SidebarLink key={item.to} to={item.to}>
                    {item.label}
                  </SidebarLink>
                ))}
              </div>
            ))}

            {/* Vault list in sidebar */}
            <div className="mb-4">
              <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                your_vaults ({DEMO_VAULTS.length})
              </p>
              {DEMO_VAULTS.map((v) => (
                <SidebarLink
                  key={v.id}
                  to="/app/vault/$id"
                  params={{ id: v.id }}
                  active={currentVaultId === v.id}
                  badge={
                    v.constraint.paused
                      ? 'paused'
                      : v.constraint.currentDrawdownBps / v.constraint.maxDrawdownBps > 0.9
                        ? 'danger'
                        : undefined
                  }
                >
                  <span className="truncate">{v.name}</span>
                </SidebarLink>
              ))}
            </div>
          </nav>

          {/* Wallet info */}
          <div className="border-t border-[var(--border)] px-4 py-3">
            {primaryAddress && (
              <p className="truncate font-mono text-xs text-[var(--text-muted)]">
                {primaryAddress.slice(0, 6)}...{primaryAddress.slice(-4)}
              </p>
            )}
            {dynamic?.primaryWallet != null && (
              <button
                onClick={() => dynamic?.setShowDynamicUserProfile?.(true)}
                className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-policy)] hover:underline"
              >
                Manage profile
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <span className="text-sm">☰</span>
            </button>
            {primaryAddress && (
              <span className="font-mono text-xs text-[var(--text-muted)] lg:hidden">
                {primaryAddress.slice(0, 4)}...{primaryAddress.slice(-4)}
              </span>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function SidebarLink({
  to,
  params,
  active,
  badge,
  children,
}: {
  to: string
  params?: Record<string, string>
  active?: boolean
  badge?: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      params={params}
      className={`flex items-center justify-between rounded-lg px-2 py-1.5 font-mono text-xs transition ${
        active
          ? 'bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-panel-raised)] hover:text-[var(--text-primary)]'
      }`}
      activeProps={{
        className: 'flex items-center justify-between rounded-lg px-2 py-1.5 font-mono text-xs bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]',
      }}
    >
      {children}
      {badge && (
        <span
          className={`rounded px-1 py-0.5 font-mono text-[8px] uppercase ${
            badge === 'danger'
              ? 'bg-[var(--accent-risk)]/10 text-[var(--accent-risk)]'
              : 'bg-[var(--accent-warning)]/10 text-[var(--accent-warning)]'
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}
