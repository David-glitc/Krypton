'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

import { withRpcFallback } from '@/lib/solana/rpc-fallback'

export type VaultRegistryEntry = {
  address: string
  name: string | null
  paused: boolean
  balanceSol: number
  permissionLevel: number
  constraint: {
    maxDrawdownBps: string
    maxLeverageBps: string
    maxPositionBps: string
    maxCorrelatedExposureBps: string
    currentDrawdownBps: string
    currentLeverageBps: string
    currentConcentrationBps: string
    currentCorrelatedExposureBps: string
  } | null
}

type RawVaultResponse = {
  registry?: { vault_pubkey: string; name: string | null; permission_level?: number }
  onChain?: {
    address: string
    paused: boolean
    constraint: VaultRegistryEntry['constraint']
  } | null
}

type VaultRegistryContextValue = {
  vaults: VaultRegistryEntry[]
  loading: boolean
  ownerWallet: string | undefined
  refetchVaults: () => Promise<void>
  getVaultName: (address: string) => string | null
  updateVaultNameLocal: (address: string, name: string) => void
}

const VaultRegistryContext = createContext<VaultRegistryContextValue | null>(null)

async function mapVaults(raw: RawVaultResponse[]): Promise<VaultRegistryEntry[]> {
  const entries = raw
    .map((v) => ({
      address: v.onChain?.address ?? v.registry?.vault_pubkey ?? '',
      name: v.registry?.name ?? null,
      paused: v.onChain?.paused ?? false,
      permissionLevel: v.registry?.permission_level ?? 2,
      constraint: v.onChain?.constraint ?? null,
    }))
    .filter((v) => v.address)

  return Promise.all(
    entries.map(async (v) => {
      const lamports = await withRpcFallback((c) => c.getBalance(new PublicKey(v.address))).catch(() => 0)
      return { ...v, balanceSol: lamports / LAMPORTS_PER_SOL }
    }),
  )
}

export function VaultRegistryProvider({ children }: { children: React.ReactNode }) {
  const { primaryWallet } = useDynamicContext()
  const ownerWallet = primaryWallet?.address
  const [vaults, setVaults] = useState<VaultRegistryEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refetchVaults = useCallback(async () => {
    if (!ownerWallet) {
      setVaults([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/vaults?ownerWallet=${encodeURIComponent(ownerWallet)}`, {
        cache: 'no-store',
      })
      const json = (await res.json()) as { vaults?: RawVaultResponse[] }
      setVaults(await mapVaults(json.vaults ?? []))
    } catch {
      setVaults([])
    } finally {
      setLoading(false)
    }
  }, [ownerWallet])

  useEffect(() => {
    refetchVaults()
  }, [refetchVaults])

  const updateVaultNameLocal = useCallback((address: string, name: string) => {
    setVaults((prev) => prev.map((v) => (v.address === address ? { ...v, name } : v)))
  }, [])

  const getVaultName = useCallback(
    (address: string) => vaults.find((v) => v.address === address)?.name ?? null,
    [vaults],
  )

  const value = useMemo(
    () => ({
      vaults,
      loading,
      ownerWallet,
      refetchVaults,
      getVaultName,
      updateVaultNameLocal,
    }),
    [vaults, loading, ownerWallet, refetchVaults, getVaultName, updateVaultNameLocal],
  )

  return <VaultRegistryContext.Provider value={value}>{children}</VaultRegistryContext.Provider>
}

export function useVaultRegistry() {
  const ctx = useContext(VaultRegistryContext)
  if (!ctx) {
    throw new Error('useVaultRegistry must be used within VaultRegistryProvider')
  }
  return ctx
}

export function useVaultRegistryOptional() {
  return useContext(VaultRegistryContext)
}
