export const FALLBACK_SOL_USD = 150

export function formatUsd(amount: number, opts?: { compact?: boolean }): string {
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: opts?.compact ? 0 : 2,
    notation: opts?.compact && amount >= 10_000 ? 'compact' : 'standard',
  }).format(amount)
}

export function formatSol(sol: number): string {
  if (!Number.isFinite(sol)) return '—'
  if (sol >= 1) return `${sol.toFixed(3)} SOL`
  return `${sol.toFixed(4)} SOL`
}

export function solToUsd(sol: number, solPriceUsd: number): number {
  return sol * solPriceUsd
}

export async function fetchSolPriceUsd(): Promise<number> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return FALLBACK_SOL_USD
    const data = (await res.json()) as { solana?: { usd?: number } }
    return data.solana?.usd ?? FALLBACK_SOL_USD
  } catch {
    return FALLBACK_SOL_USD
  }
}

export function vaultDisplayName(name: string | null | undefined, address: string): string {
  if (name?.trim()) return name.trim()
  return `Vault ${address.slice(0, 4)}…${address.slice(-4)}`
}
