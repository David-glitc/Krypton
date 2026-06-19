import { createFileRoute, Link, Outlet, useParams } from '@tanstack/react-router'
import { KryptonAuthProvider, useKryptonAuth } from '~/lib/AuthProvider'
import { isInviteAllowed, getInviteHint } from '~/lib/invite'
import { KryptonLogo } from '~/components/KryptonLogo'

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
  const { isConnected, primaryAddress, lazorkit } = useKryptonAuth()
  const allowed = isInviteAllowed(primaryAddress)

  if (!isConnected) {
    return (
      <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
        <header className="border-b border-[var(--border)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
            <KryptonLogo />
          </div>
        </header>
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">auth_required</p>
          <h1 className="font-display mt-4 text-2xl font-semibold">Connect your wallet</h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{getInviteHint()}</p>
          <button
            onClick={() => {
              if (lazorkit?.connect) {
                lazorkit.connect()
              }
            }}
            className="btn-primary mt-6 text-xs"
          >
            Connect wallet →
          </button>
        </main>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
        <header className="border-b border-[var(--border)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
            <KryptonLogo />
          </div>
        </header>
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--accent)]">access_denied</p>
          <h1 className="font-display mt-4 text-2xl font-semibold">Private beta</h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Your wallet is not in the beta allowlist.
          </p>
        </main>
      </div>
    )
  }

  return <AppShell />
}

const NAV = [
  { to: '/app', label: 'Vaults' },
  { to: '/app/create', label: 'Deploy vault' },
  { to: '/docs', label: 'Policy schema' },
] as const

function AppShell() {
  const { primaryAddress } = useKryptonAuth()

  return (
    <div className="flex min-h-dvh bg-[var(--bg-base)]">
      <aside className="hidden w-48 shrink-0 border-r border-[var(--border)] bg-[var(--bg-panel)] lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-[var(--border)] px-3 py-3">
            <KryptonLogo size="sm" />
          </div>
          <nav className="flex-1 px-2 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded px-2 py-1.5 font-mono text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-panel-raised)] hover:text-[var(--text-primary)]"
                activeProps={{
                  className: 'block rounded px-2 py-1.5 font-mono text-xs bg-[var(--accent-muted)] text-[var(--accent)]',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {primaryAddress && (
            <div className="border-t border-[var(--border)] px-3 py-2">
              <p className="truncate font-mono text-[10px] text-[var(--text-muted)]">
                {primaryAddress.slice(0, 6)}…{primaryAddress.slice(-4)}
              </p>
            </div>
          )}
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-[var(--border)]">
          <div className="flex items-center justify-between gap-4 px-4 py-2 lg:px-6">
            <span className="font-mono text-xs text-[var(--text-muted)] lg:hidden">Krypton</span>
            {primaryAddress && (
              <span className="font-mono text-xs text-[var(--text-muted)] lg:hidden">
                {primaryAddress.slice(0, 4)}…{primaryAddress.slice(-4)}
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
