import { Connection, type Commitment } from '@solana/web3.js'

import { getRpcEndpoints, isRetryableRpcError, type SolanaCluster } from './rpc'

export async function withRpcFallback<T>(
  fn: (connection: Connection) => Promise<T>,
  options: { cluster?: SolanaCluster; commitment?: Commitment } = {},
): Promise<T> {
  const { cluster = 'devnet', commitment = 'confirmed' } = options
  const endpoints = getRpcEndpoints(cluster)

  if (endpoints.length === 0) {
    throw new Error('No Solana RPC endpoints configured')
  }

  let lastError: unknown

  for (const url of endpoints) {
    try {
      const connection = new Connection(url, commitment)
      return await fn(connection)
    } catch (error) {
      lastError = error
      if (!isRetryableRpcError(error)) {
        throw error
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('All Solana RPC endpoints failed')
}

export async function getHealthyConnection(
  options: { cluster?: SolanaCluster; commitment?: Commitment } = {},
): Promise<Connection> {
  const { cluster = 'devnet', commitment = 'confirmed' } = options
  return withRpcFallback(async (connection) => {
    await connection.getLatestBlockhash(commitment)
    return connection
  }, options)
}
