'use client'

import { useEffect, useState } from 'react'

import { FALLBACK_SOL_USD } from '@/lib/format-money'

export function useSolPrice() {
  const [solPriceUsd, setSolPriceUsd] = useState(FALLBACK_SOL_USD)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      .then((r) => r.json())
      .then((data: { solana?: { usd?: number } }) => {
        if (!cancelled && data.solana?.usd) setSolPriceUsd(data.solana.usd)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { solPriceUsd, loading }
}
