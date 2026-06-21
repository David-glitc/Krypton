# Plan 001: Wire up wallet connection

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.

> **Drift check (run first)**: `git diff --stat 23968b68d..HEAD -- src/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `23968b68d`, 2026-06-19

## Why this matters

The "Connect wallet" button on the landing page and the app sidebar are dead — they have no onClick handler and no wallet adapter. Users can't connect their wallets, which means they can't create vaults, deposit funds, or interact with the protocol. This is the single biggest blocker to making the app functional.

## Current state

- `src/app/page.tsx:31-36` — "Connect wallet" button has no onClick handler, just a static `<button>` element
- `src/app/app/layout.tsx:10` — `WALLET_ADDRESS` is hardcoded to `'0x1a2B...3c4D'`
- `src/app/app/layout.tsx:48-51` — Mobile header shows hardcoded address
- No wallet adapter package is installed (`@solana/wallet-adapter-react`, `@solana/wallet-adapter-wallets`, `@solana/wallet-adapter-base`)
- No wallet context provider exists

## Commands you will need

| Purpose   | Command                | Expected on success |
|-----------|------------------------|---------------------|
| Install   | `pnpm install`         | exit 0              |
| Typecheck | `npx tsc --noEmit`     | exit 0, no errors   |
| Build     | `pnpm build`           | exit 0              |
| Lint      | `pnpm lint`            | exit 0              |

## Scope

**In scope** (the only files you should modify):
- `package.json` — add wallet adapter dependencies
- `src/app/page.tsx` — wire up Connect wallet button
- `src/app/app/layout.tsx` — replace hardcoded wallet with connected state
- `src/app/providers.tsx` — create new wallet context provider
- `src/lib/wallet.ts` — create wallet connection utilities

**Out of scope**:
- `src/lib/mock-data.ts` — don't touch mock data
- `src/app/app/vault/[id]/page.tsx` — vault dashboard page
- `src/app/app/create/page.tsx` — create vault page
- Any Anchor program code

## Steps

### Step 1: Install wallet adapter packages

```bash
pnpm add @solana/wallet-adapter-react @solana/wallet-adapter-wallets @solana/wallet-adapter-base @solana/web3.js
```

**Verify**: `pnpm list @solana/wallet-adapter-react` → shows version number

### Step 2: Create wallet context provider

Create `src/app/providers.tsx`:

```tsx
'use client'

import { ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// Default styles for wallet modal
import '@solana/wallet-adapter-react-ui/styles.css'

export function Providers({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), [])
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 3: Wrap the app with the wallet provider

Modify `src/app/layout.tsx` to import and use the Providers:

```tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.className} ${mono.className} ${display.className}`}>
      <body className="bg-bg-base text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 4: Create wallet connection hook

Create `src/lib/use-wallet-connection.ts`:

```tsx
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useState, useCallback } from 'react'

export function useWalletConnection() {
  const { publicKey, connected, connect, disconnect, wallet } = useWallet()
  const { connection } = useConnection()
  const [connecting, setConnecting] = useState(false)

  const handleConnect = useCallback(async () => {
    setConnecting(true)
    try {
      await connect()
    } catch (err) {
      console.error('Wallet connection failed:', err)
    } finally {
      setConnecting(false)
    }
  }, [connect])

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
    } catch (err) {
      console.error('Wallet disconnect failed:', err)
    }
  }, [disconnect])

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null

  return {
    publicKey,
    connected,
    connecting,
    wallet,
    connection,
    shortAddress,
    handleConnect,
    handleDisconnect,
  }
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 5: Wire up the landing page Connect wallet button

Modify `src/app/page.tsx` to use the wallet hook:

```tsx
'use client'

import { useWalletConnection } from '@/lib/use-wallet-connection'
import Link from 'next/link'

export default function Home() {
  const { connected, connecting, shortAddress, handleConnect, handleDisconnect } = useWalletConnection()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-10">
        <div className="flex items-center gap-2.5">
          {/* ... existing logo SVG ... */}
          <span className="font-display text-sm font-semibold tracking-wide text-text-primary">
            Krypton
          </span>
        </div>
        {connected ? (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-text-secondary">{shortAddress}</span>
            <button
              type="button"
              onClick={handleDisconnect}
              className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            disabled={connecting}
            className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors disabled:opacity-50"
          >
            {connecting ? 'Connecting...' : 'Connect wallet'}
          </button>
        )}
      </header>

      {/* ... rest of the landing page ... */}
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 6: Wire up the app sidebar wallet display

Modify `src/app/app/layout.tsx` to use the wallet hook instead of hardcoded address:

```tsx
'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWalletConnection } from '@/lib/use-wallet-connection'

const NAV_LINKS = [
  { href: '/app', label: 'Vaults' },
  { href: '/app/create', label: 'Deploy vault' },
  { href: '/docs', label: 'Policy schema' },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { connected, connecting, shortAddress, handleConnect } = useWalletConnection()

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-bg-panel border-r border-border">
        <div className="flex items-center h-14 px-4 border-b border-border">
          <span className="font-mono text-sm font-semibold text-text-primary tracking-tight">
            krypton
          </span>
        </div>

        <div className="px-4 py-3 border-b border-border">
          {connected ? (
            <>
              <span className="font-mono text-[10px] text-text-muted">WALLET</span>
              <p className="font-mono text-xs text-text-secondary mt-0.5">{shortAddress}</p>
            </>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="font-mono text-[10px] text-accent hover:underline disabled:opacity-50"
            >
              {connecting ? 'Connecting...' : 'Connect wallet'}
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-0.5 px-2 py-3">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs px-2 py-1.5 rounded-sm transition-colors ${
                  active
                    ? 'bg-accent-muted text-accent'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 bg-bg-base">
        <header className="flex md:hidden items-center justify-between h-14 px-4 border-b border-border bg-bg-panel">
          <span className="font-mono text-sm font-semibold text-text-primary tracking-tight">
            krypton
          </span>
          {connected ? (
            <span className="font-mono text-xs text-text-secondary">{shortAddress}</span>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="font-mono text-[10px] text-accent hover:underline disabled:opacity-50"
            >
              {connecting ? 'Connecting...' : 'Connect wallet'}
            </button>
          )}
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 7: Build and verify

```bash
pnpm build
```

**Verify**: Build exits 0 with no errors

## Test plan

- No new tests needed for this plan — wallet connection is infrastructure that will be tested by the data fetching plan (Plan 002).

## Done criteria

- [ ] `pnpm build` exits 0
- [ ] `npx tsc --noEmit` exits 0
- [ ] Landing page "Connect wallet" button opens wallet selection modal
- [ ] After connecting, wallet address is displayed in header
- [ ] App sidebar shows connected wallet address
- [ ] Disconnect button works and returns to "Connect wallet" state

## STOP conditions

- If `@solana/wallet-adapter-react-ui` CSS import causes build errors, skip the CSS import and style the modal manually
- If `autoConnect` causes issues with SSR, remove it from the WalletProvider props

## Maintenance notes

- When the Anchor program is deployed, update the RPC endpoint from `clusterApiUrl('devnet')` to the actual RPC URL
- When adding more wallet adapters, add them to the `wallets` array in `src/app/providers.tsx`
- The wallet modal styles are imported from `@solana/wallet-adapter-react-ui/styles.css` — if this conflicts with the dark theme, override the CSS variables
