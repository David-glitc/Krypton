'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, ExternalLink, Zap, Server, Key, Edit2, Check as CheckIcon, X } from 'lucide-react'
import { DynamicContext } from '@dynamic-labs/sdk-react-core'

type VaultEntry = {
  address: string
  name: string | null
}

export default function SettingsPage() {
  const dynamicContext = useContext(DynamicContext)
  const wallet = dynamicContext?.primaryWallet
  const [vaults, setVaults] = useState<VaultEntry[]>([])
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const addr = wallet?.address
    if (!addr) return
    fetch(`/api/vaults?ownerWallet=${encodeURIComponent(addr)}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(j => {
        const raw = j as { vaults?: Array<{ registry?: { vault_pubkey: string; name: string | null }; onChain?: { address: string } | null }> }
        const mapped: VaultEntry[] = (raw.vaults ?? []).map(v => ({
          address: v.onChain?.address ?? v.registry?.vault_pubkey ?? '',
          name: v.registry?.name ?? null,
        }))
        setVaults(mapped)
      })
      .catch(() => {})
  }, [wallet?.address])

  const copy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 1500)
  }

  const handleRename = async (address: string) => {
    if (!renameValue.trim()) return
    try {
      await fetch('/api/vaults/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaultPubkey: address, name: renameValue.trim() }),
      })
      setVaults(prev => prev.map(v => v.address === address ? { ...v, name: renameValue.trim() } : v))
    } catch {}
    setRenaming(null)
    setRenameValue('')
  }

  const env = useMemo(() => ({
    rpc: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    programId: 'DQVp9hnnU6zbyPCJbcEnS6F1fWZMQ2yCCH9jL6cFVPxF',
    network: 'devnet',
  }), [])

  return (
    <div className="mx-auto max-w-4xl space-y-10 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link href="/app" className="text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-hanken)] text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Settings
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Wallet connection, vault management, and environment config.
          </p>
        </div>
      </div>

      {/* Wallet */}
      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-hanken)] text-xl font-medium text-text-primary">Connected Wallet</h2>
        <div className="panel p-5 space-y-4">
          {wallet ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-text-primary">{wallet.address}</span>
                  <button onClick={() => copy(wallet.address, 'wallet')}>
                    {copiedField === 'wallet' ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4 text-text-secondary hover:text-text-primary" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Connector</span>
                <span className="text-xs text-text-primary">{wallet.connector?.name || 'Dynamic'}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-text-muted">No wallet connected. Connect via the button in the header.</p>
          )}
        </div>
      </section>

      {/* Vault Management */}
      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-hanken)] text-xl font-medium text-text-primary">Your Vaults</h2>
        {vaults.length === 0 ? (
          <div className="panel p-5">
            <p className="text-sm text-text-muted">No vaults yet. Create one from the dashboard.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vaults.map(v => (
              <div key={v.address} className="panel p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Zap className="h-4 w-4 shrink-0 text-accent" />
                  <div className="min-w-0">
                    {renaming === v.address ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={e => setRenameValue(e.target.value)}
                          className="input-field h-8 w-48 text-xs"
                          autoFocus
                          onKeyDown={e => { if (e.key === 'Enter') handleRename(v.address); if (e.key === 'Escape') setRenaming(null) }}
                        />
                        <button onClick={() => handleRename(v.address)} className="text-accent hover:text-accent-hover">
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => setRenaming(null)} className="text-text-secondary hover:text-text-primary">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-text-primary">{v.name || v.address.slice(0, 8) + '…'}</span>
                    )}
                    <p className="font-mono text-[11px] text-text-muted truncate">{v.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setRenaming(v.address); setRenameValue(v.name || '') }}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <Link href={`/app/vault/${v.address}`} className="text-text-secondary hover:text-accent">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Environment */}
      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-hanken)] text-xl font-medium text-text-primary">Environment</h2>
        <div className="panel p-5 space-y-4">
          {[
            { label: 'Network', value: 'Devnet', icon: Server },
            { label: 'RPC URL', value: env.rpc, icon: Server },
            { label: 'Program ID', value: env.programId, icon: Key },
          ].map(f => {
            const Icon = f.icon
            return (
              <div key={f.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-text-secondary" />
                  <span className="text-sm text-text-secondary">{f.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-text-primary">{f.value}</span>
                  <button onClick={() => copy(f.value, f.label)}>
                    {copiedField === f.label ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4 text-text-secondary hover:text-text-primary" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Orchestrator Status */}
      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-hanken)] text-xl font-medium text-text-primary">Orchestrator</h2>
        <div className="panel p-5">
          <p className="text-sm text-text-secondary">
            The agent orchestrator runs as a systemd service on your VPS. Check its status via{' '}
            <code className="rounded bg-bg-deep px-1.5 py-0.5 font-mono text-xs text-accent">ssh krypton-vps systemctl status krypton-orchestrator</code>
          </p>
        </div>
      </section>
    </div>
  )
}
