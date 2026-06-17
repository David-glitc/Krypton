import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { KryptonAuthProvider, useKryptonAuth } from '~/lib/AuthProvider'
import { getInviteHint, isInviteAllowed } from '~/lib/invite'
import { KryptonLogo } from '~/components/KryptonLogo'
import { DEMO_VAULTS } from '~/lib/mock-data'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <KryptonAuthProvider>
      <AppGate />
    </KryptonAuthProvider>
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
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            {getInviteHint()}
          </p>
          <p className="mt-6 text-xs text-[var(--text-muted)]">
            Use Dynamic (social/email) or Lazorkit (passkey) to connect.
          </p>
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
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Your wallet is not in the beta allowlist. Request access to continue.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh bg-[var(--bg-base)]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-panel)]/50 lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-[var(--border)] px-4 py-4">
            <KryptonLogo />
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              capital
            </p>
            <SidebarLink to="/app">Vaults</SidebarLink>
            <SidebarLink to="/app/create">Create vault</SidebarLink>

            <div className="my-4 border-t border-[var(--border)]" />

            <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              vaults
            </p>
            {DEMO_VAULTS.map((v) => (
              <SidebarLink key={v.id} to="/app/vault/$id" params={{ id: v.id }}>
                <span className="truncate">{v.name}</span>
              </SidebarLink>
            ))}

            <div className="my-4 border-t border-[var(--border)]" />

            <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              resources
            </p>
            <SidebarLink to="/docs">Policy schema</SidebarLink>
          </nav>

          {/* Wallet info */}
          <div className="border-t border-[var(--border)] px-4 py-3">
            {primaryAddress && (
              <p className="truncate font-mono text-xs text-[var(--text-muted)]">
                {primaryAddress.slice(0, 6)}...{primaryAddress.slice(-4)}
              </p>
            )}
            {dynamic.primaryWallet != null && (
              <button
                onClick={() => dynamic.setShowDynamicUserProfile?.(true)}
                className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-policy)] hover:underline"
              >
                Profile
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <KryptonLogo />
            {primaryAddress && (
              <span className="font-mono text-xs text-[var(--text-muted)]">
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
  children,
}: {
  to: string
  params?: Record<string, string>
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      params={params}
      className="block rounded-lg px-2 py-1.5 font-mono text-xs text-[var(--text-secondary)] transition hover:bg-[var(--bg-panel-raised)] hover:text-[var(--text-primary)]"
      activeProps={{
        className: 'rounded-lg px-2 py-1.5 font-mono text-xs bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]',
      }}
    >
      {children}
    </Link>
  )
}
