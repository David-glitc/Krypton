'use client'

import { useContext, useState } from 'react'
import Link from 'next/link'
import { Edit2, Check as CheckIcon, X, Zap, ExternalLink, AlertCircle } from 'lucide-react'
import { DynamicContext } from '@dynamic-labs/sdk-react-core'

import { PageHeader } from '@/components/app/page-header'
import { vaultDisplayName } from '@/lib/format-money'
import { useVaultRegistry } from '@/contexts/vault-registry-context'

export default function SettingsPage() {
  const dynamicContext = useContext(DynamicContext)
  const wallet = dynamicContext?.primaryWallet
  const { vaults, refetchVaults, updateVaultNameLocal } = useVaultRegistry()
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleRename = async (vaultAddress: string) => {
    if (!renameValue.trim() || !wallet?.address) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/vaults/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vaultPubkey: vaultAddress,
          name: renameValue.trim(),
          ownerWallet: wallet.address,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Rename failed')
      updateVaultNameLocal(vaultAddress, renameValue.trim())
      await refetchVaults()
      setRenaming(null)
      setRenameValue('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rename failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-page stack-section">
      <PageHeader
        title="Settings"
        description="Rename vaults — names update everywhere instantly."
        backHref="/app/profile"
      />

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-accent-risk/40 bg-accent-risk-muted/20 px-4 py-3 text-sm text-accent-risk">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-hanken)] text-xl font-medium text-text-primary">Vault names</h2>
        {vaults.length === 0 ? (
          <div className="panel p-5">
            <p className="text-sm text-text-muted">
              No vaults yet.{' '}
              <Link href="/app/create" className="text-accent hover:underline">
                Create one
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {vaults.map((v) => (
              <div key={v.address} className="panel flex items-center justify-between gap-4 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Zap className="h-4 w-4 shrink-0 text-accent" />
                  <div className="min-w-0">
                    {renaming === v.address ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="input-field h-8 w-48 text-xs"
                          autoFocus
                          disabled={saving}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRename(v.address)
                            if (e.key === 'Escape') setRenaming(null)
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRename(v.address)}
                          disabled={saving}
                          className="text-accent disabled:opacity-50"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setRenaming(null)} className="text-text-secondary">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-text-primary">
                        {vaultDisplayName(v.name, v.address)}
                      </span>
                    )}
                    <p className="truncate font-mono text-[11px] text-text-muted">{v.address}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRenaming(v.address)
                      setRenameValue(v.name || '')
                    }}
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

      <section className="panel space-y-3 p-5">
        <h2 className="font-[family-name:var(--font-hanken)] text-lg font-medium text-text-primary">Account</h2>
        <p className="text-sm text-text-secondary">
          Wallet, balances, and sign-out on your{' '}
          <Link href="/app/profile" className="text-accent hover:underline">
            profile
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
