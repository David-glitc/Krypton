'use client'

import Link from 'next/link'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { Copy, Check, LogOut, Wallet, Zap, Settings } from 'lucide-react'

import { PageHeader } from '@/components/app/page-header'
import { MetricCard } from '@/components/app/app-shell'
import { formatSol, formatUsd, solToUsd, vaultDisplayName } from '@/lib/format-money'
import { useSolPrice } from '@/hooks/use-sol-price'
import { useVaultRegistry } from '@/contexts/vault-registry-context'
import { withRpcFallback } from '@/lib/solana/rpc-fallback'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { primaryWallet, handleLogOut, user } = useDynamicContext()
  const { vaults, loading } = useVaultRegistry()
  const { solPriceUsd } = useSolPrice()
  const [walletSol, setWalletSol] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const address = primaryWallet?.address
  const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? 'devnet'

  useEffect(() => {
    if (!address) return
    withRpcFallback((c) => c.getBalance(new PublicKey(address)))
      .then((lamports) => setWalletSol(lamports / 1e9))
      .catch(() => setWalletSol(null))
  }, [address])

  const vaultTotalSol = vaults.reduce((sum, v) => sum + v.balanceSol, 0)
  const walletUsd = walletSol != null ? solToUsd(walletSol, solPriceUsd) : null
  const vaultUsd = solToUsd(vaultTotalSol, solPriceUsd)

  async function copyAddress() {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="app-page stack-section">
      <PageHeader title="Profile" description="Your wallet, balances, and account." backHref="/app" />

      {!address ? (
        <div className="panel p-6 text-sm text-text-secondary">
          Connect a wallet from the header to view your profile.
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Wallet"
              value={walletSol != null ? `${formatUsd(walletUsd ?? 0)} · ${formatSol(walletSol)}` : '—'}
              accent
              size="lg"
            />
            <MetricCard
              label="In vaults"
              value={`${formatUsd(vaultUsd)} · ${formatSol(vaultTotalSol)}`}
              accent
            />
            <MetricCard label="Vaults" value={loading ? '…' : String(vaults.length)} />
          </div>

          <section className="panel panel-pad space-y-5">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent" />
              <h2 className="section-title">Account</h2>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-5">
              <div className="min-w-0">
                <p className="stat-label">Wallet address</p>
                <p className="mt-1 break-all font-mono text-sm text-text-primary">{address}</p>
              </div>
              <button type="button" onClick={copyAddress} className="text-text-secondary hover:text-accent">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-text-secondary">Connector</p>
                <p className="mt-1 text-text-primary">{primaryWallet?.connector?.name ?? 'Wallet'}</p>
              </div>
              <div>
                <p className="text-text-secondary">Network</p>
                <p className="mt-1 capitalize text-text-primary">{cluster}</p>
              </div>
              {user?.email && (
                <div>
                  <p className="text-text-secondary">Email</p>
                  <p className="mt-1 text-text-primary">{user.email}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/app/settings"
                className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-text-primary hover:border-accent"
              >
                <Settings className="h-3.5 w-3.5" />
                Vault names
              </Link>
              <button
                type="button"
                onClick={() => handleLogOut()}
                className="inline-flex items-center gap-2 border border-accent-risk/40 bg-accent-risk-muted px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-accent-risk hover:border-accent-risk"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </section>

          {vaults.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-display text-lg font-medium text-text-primary">
                Your vaults
              </h2>
              {vaults.map((v) => (
                <Link
                  key={v.address}
                  href={`/app/vault/${v.address}`}
                  className="panel flex items-center justify-between gap-4 p-4 transition-colors hover:bg-bg-hover/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Zap className="h-4 w-4 shrink-0 text-accent" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {vaultDisplayName(v.name, v.address)}
                      </p>
                      <p className="truncate font-mono text-[11px] text-text-muted">{v.address}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-sm text-accent">
                      {formatUsd(solToUsd(v.balanceSol, solPriceUsd))}
                    </p>
                    <p className="text-[11px] text-text-muted">{formatSol(v.balanceSol)}</p>
                  </div>
                </Link>
              ))}
            </section>
          )}

          <p className="text-xs text-text-muted">
            SOL at {formatUsd(solPriceUsd)} (CoinGecko). {cluster} balances are test funds.
          </p>
        </>
      )}
    </div>
  )
}
