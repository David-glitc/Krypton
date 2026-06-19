import Link from 'next/link'
import { ReactNode } from 'react'

const NAV_LINKS = [
  { href: '/app', label: 'Vaults' },
  { href: '/app/deploy', label: 'Deploy vault' },
  { href: '/app/policy', label: 'Policy schema' },
]

const WALLET_ADDRESS = '0x1a2B...3c4D'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — hidden on mobile */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-bg-panel border-r border-border">
        {/* Logo */}
        <div className="flex items-center h-14 px-4 border-b border-border">
          <span className="font-mono text-sm font-semibold text-text-primary tracking-tight">
            krypton
          </span>
        </div>

        {/* Wallet */}
        <div className="px-4 py-3 border-b border-border">
          <span className="font-mono text-[10px] text-text-muted">WALLET</span>
          <p className="font-mono text-xs text-text-secondary mt-0.5">{WALLET_ADDRESS}</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-2 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-text-secondary hover:text-text-primary px-2 py-1.5 rounded-sm transition-colors [&.active]:bg-accent-muted [&.active]:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 bg-bg-base">
        {/* Mobile header */}
        <header className="flex md:hidden items-center justify-between h-14 px-4 border-b border-border bg-bg-panel">
          <span className="font-mono text-sm font-semibold text-text-primary tracking-tight">
            krypton
          </span>
          <span className="font-mono text-xs text-text-secondary">{WALLET_ADDRESS}</span>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
