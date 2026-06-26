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

/** Ordered RPC list: Helius (primary) → Alchemy (fallback) → public cluster URL. */
export function getRpcEndpoints(cluster: SolanaCluster = 'devnet'): string[] {
  if (cluster === 'mainnet-beta') {
    return uniqueUrls([
      readEnv('SOLANA_RPC_MAINNET_URL', 'NEXT_PUBLIC_SOLANA_RPC_MAINNET_URL'),
      readEnv('SOLANA_RPC_MAINNET_FALLBACK_URL', 'NEXT_PUBLIC_SOLANA_RPC_MAINNET_FALLBACK_URL'),
      clusterApiUrl('mainnet-beta'),
    ])
  }

  if (cluster === 'testnet') {
    return uniqueUrls([
      readEnv('SOLANA_RPC_TESTNET_URL', 'NEXT_PUBLIC_SOLANA_RPC_TESTNET_URL'),
      readEnv('SOLANA_RPC_TESTNET_FALLBACK_URL', 'NEXT_PUBLIC_SOLANA_RPC_TESTNET_FALLBACK_URL'),
      clusterApiUrl('testnet'),
    ])
  }

  return uniqueUrls([
    readEnv('SOLANA_RPC_URL', 'NEXT_PUBLIC_SOLANA_RPC_URL'),
    readEnv('SOLANA_RPC_FALLBACK_URL', 'NEXT_PUBLIC_SOLANA_RPC_FALLBACK_URL'),
    clusterApiUrl('devnet'),
  ])
}

export function getPrimaryRpcUrl(cluster: SolanaCluster = 'devnet'): string {
  const endpoints = getRpcEndpoints(cluster)
  if (endpoints.length === 0) {
    return clusterApiUrl(cluster === 'mainnet-beta' ? 'mainnet-beta' : 'devnet')
  }
  return endpoints[0]!
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
