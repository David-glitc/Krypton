import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

/** On-chain deployer / protocol fee collector (Atomic chessonchain deployer). */
export const KRYPTON_FEE_COLLECTOR = new PublicKey(
  process.env.KRYPTON_FEE_COLLECTOR ?? '4NMT6NrZGPTGov65CuLNuxqJExQxGoJSH1CsXWrzyapc',
)

/** Fee tier by risk profile: low → $4, medium → $8, high → $15, custom → $20. */
export function riskToCreationFeeUsd(riskProfile: string): number {
  switch (riskProfile) {
    case 'low': return 4
    case 'medium': return 8
    case 'high': return 15
    case 'custom': return 20
    default: return 8
  }
}

const MIN_FEE_USD = 3
const MAX_FEE_USD = 20
const FALLBACK_SOL_USD = 150

export function clampCreationFeeUsd(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return MIN_FEE_USD
  return Math.min(MAX_FEE_USD, Math.max(MIN_FEE_USD, Math.round(value * 100) / 100))
}

export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL
}

export function formatSolAmount(sol: number): string {
  if (sol >= 0.01) return sol.toFixed(3)
  return sol.toFixed(4)
}

export async function usdToLamports(usd: number): Promise<number> {
  const clamped = clampCreationFeeUsd(usd)
  let solPrice = FALLBACK_SOL_USD

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      { next: { revalidate: 120 } },
    )
    if (response.ok) {
      const data = (await response.json()) as { solana?: { usd?: number } }
      if (data.solana?.usd && data.solana.usd > 0) {
        solPrice = data.solana.usd
      }
    }
  } catch {
    // use fallback SOL/USD
  }

  return Math.max(1, Math.ceil((clamped / solPrice) * LAMPORTS_PER_SOL))
}

export async function quoteCreationFee(usd: number): Promise<{
  creationFeeUsd: number
  feeLamports: number
  feeSol: number
  solPriceUsd: number
}> {
  const creationFeeUsd = clampCreationFeeUsd(usd)
  let solPriceUsd = FALLBACK_SOL_USD

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      { next: { revalidate: 120 } },
    )
    if (response.ok) {
      const data = (await response.json()) as { solana?: { usd?: number } }
      if (data.solana?.usd && data.solana.usd > 0) {
        solPriceUsd = data.solana.usd
      }
    }
  } catch {
    // use fallback
  }

  const feeLamports = Math.max(1, Math.ceil((creationFeeUsd / solPriceUsd) * LAMPORTS_PER_SOL))

  return {
    creationFeeUsd,
    feeLamports,
    feeSol: lamportsToSol(feeLamports),
    solPriceUsd,
  }
}
