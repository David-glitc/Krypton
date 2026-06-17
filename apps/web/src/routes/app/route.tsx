import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { KryptonAuthProvider, useKryptonAuth } from '~/lib/AuthProvider'
import { getInviteHint, isInviteAllowed } from '~/lib/invite'
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
  const { isConnected, primaryAddress, dynamic, lazorkit } = useKryptonAuth()
  const allowed = isInviteAllowed(primaryAddress)

  if (!isConnected) {
    return (
      <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
        <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <KryptonLogo size="sm" />
              <span className="gradient-text">Krypton</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <KryptonLogo size="xl" animated />
          <p className="font-mono mt-8 text-xs uppercase tracking-wider text-[var(--accent-primary)]">
            access: agentic_capital
          </p>
          <h1 className="font-display mt-4 text-3xl font-semibold">Connect your wallet</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Sign in with email, X (Twitter), or create a passkey wallet to manage your vault.
            No seed phrases needed — your wallet is secured by your device biometrics.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => dynamic.setShowAuthFlow?.(true)}
              className="btn-primary text-sm"
            >
              Continue with Dynamic →
            </button>
            <button
              onClick={() => lazorkit.connect()}
              className="btn-secondary text-sm"
            >
              Passkey wallet
            </button>
          </div>
          <p className="mt-6 text-xs text-[var(--text-muted)]">{getInviteHint()}</p>
        </main>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
        <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <KryptonLogo size="sm" />
              <span className="gradient-text">Krypton</span>
            </Link>
          </div>
        </header>
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="font-display text-3xl font-semibold text-[var(--accent-risk)]">
            Not on invite list
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            {primaryAddress} is not authorized for private beta.
          </p>
          <Link to="/" className="btn-secondary mt-8">
            Back to landing
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <KryptonLogo size="sm" />
              <span className="gradient-text">Krypton</span>
            </Link>
            <nav className="flex gap-3 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              <Link
                to="/app"
                activeOptions={{ exact: true }}
                activeProps={{ className: 'text-[var(--accent-primary)] font-medium' }}
                inactiveProps={{ className: 'hover:text-[var(--text-primary)]' }}
              >
                Vaults
              </Link>
              <Link
                to="/app/create"
                activeProps={{ className: 'text-[var(--accent-primary)] font-medium' }}
                inactiveProps={{ className: 'hover:text-[var(--text-primary)]' }}
              >
                Create
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {primaryAddress && (
              <span className="hidden font-mono text-xs text-[var(--text-muted)] sm:block">
                {primaryAddress.slice(0, 4)}...{primaryAddress.slice(-4)}
              </span>
            )}
            {dynamic.isAuthenticated && (
              <button
                onClick={() => dynamic.setShowDynamicUserProfile?.(true)}
                className="btn-ghost text-xs"
              >
                Profile
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}