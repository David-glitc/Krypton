import { clusterApiUrl } from '@solana/web3.js'

export type SolanaCluster = 'devnet' | 'mainnet-beta' | 'testnet'

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim()
    if (value) return value
  }
  return undefined
}

function uniqueUrls(urls: Array<string | undefined>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const url of urls) {
    if (!url || seen.has(url)) continue
    seen.add(url)
    out.push(url)
  }
  return out
}

/** Devnet-only RPC list: Helius (primary) → Helius public → public devnet. */
const DEVNET_RPCS = [
  process.env.NEXT_PUBLIC_HELIUS_DEVNET_URL,
  'https://devnet.helius-rpc.com/?api-key=2dccd8c8-3285-4886-9eb3-9c01963e7ea1',
  'https://api.devnet.solana.com',
].filter(Boolean) as string[]

export function getRpcEndpoints(_cluster?: SolanaCluster): string[] {
  return DEVNET_RPCS
}

export function getPrimaryRpcUrl(_cluster?: SolanaCluster): string {
  return DEVNET_RPCS[0]!
}

export function isRetryableRpcError(error: unknown): boolean {
  if (!(error instanceof Error)) return true
  const message = error.message.toLowerCase()
  return (
    message.includes('429') ||
    message.includes('503') ||
    message.includes('502') ||
    message.includes('504') ||
    message.includes('timeout') ||
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('econnreset') ||
    message.includes('too many requests')
  )
}
