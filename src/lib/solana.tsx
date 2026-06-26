import { createContext, useContext, type ReactNode } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'

import { getPrimaryRpcUrl } from '@/lib/solana/rpc'

const RPC_URL = getPrimaryRpcUrl('devnet') || clusterApiUrl('devnet')
const PROGRAM_ID = process.env.NEXT_PUBLIC_KRYPTON_PROGRAM_ID ?? ''

interface SolanaContextValue {
  connection: Connection
  programId: PublicKey | null
  connected: boolean
}

const SolanaContext = createContext<SolanaContextValue | null>(null)

export function SolanaProvider({ children }: { children: ReactNode }) {
  const connection = new Connection(RPC_URL, 'confirmed')
  const programId = PROGRAM_ID ? new PublicKey(PROGRAM_ID) : null

  return (
    <SolanaContext.Provider value={{ connection, programId, connected: true }}>
      {children}
    </SolanaContext.Provider>
  )
}

export function useSolana(): SolanaContextValue {
  const ctx = useContext(SolanaContext)
  if (!ctx) throw new Error('useSolana must be used within SolanaProvider')
  return ctx
}

export { RPC_URL, PROGRAM_ID }
