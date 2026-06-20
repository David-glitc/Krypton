'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/app', label: 'Vaults' },
  { href: '/app/create', label: 'Deploy vault' },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 bg-bg-panel border-r border-border">
        <Link href="/" className="flex items-center h-14 px-4 border-b border-border hover:bg-bg-panel-raised transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" />
            <path d="M12 2L3 7l9 5 9-5-9-5z" fill="var(--color-accent-muted)" />
            <line x1="8" y1="10" x2="8" y2="16" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="square" />
            <line x1="9" y1="13" x2="15" y2="10" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="square" />
            <line x1="9" y1="13" x2="15" y2="16" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <span className="font-mono text-sm font-semibold text-text-primary tracking-tight">krypton</span>
        </Link>

        <nav className="flex flex-col gap-0.5 px-2 py-3">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs px-2 py-1.5 rounded transition-colors ${
                  active
                    ? 'bg-accent-muted text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-panel-raised'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex md:hidden items-center justify-between h-14 px-4 border-b border-border bg-bg-panel">
          <Link href="/" className="font-mono text-sm font-semibold text-text-primary tracking-tight">
            krypton
          </Link>
          <div className="flex gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                  pathname === link.href
                    ? 'bg-accent-muted text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
