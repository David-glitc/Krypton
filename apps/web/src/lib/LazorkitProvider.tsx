import * as React from 'react'
import { RPC_URL, KRYPTON_PROGRAM_ID } from '@krypton/sdk'
import { Connection, PublicKey } from '@solana/web3.js'
import {
  LazorkitProvider as LzProvider,
  useWallet as useLazorkitWallet,
  useWalletStore,
} from '@lazorkit/wallet'

export type { WalletHookInterface } from '@lazorkit/wallet'

export { useLazorkitWallet, useWalletStore }

export interface KryptonWalletProviderProps {
  children: React.ReactNode
}

export function KryptonWalletProvider({ children }: KryptonWalletProviderProps) {
  const connection = React.useMemo(
    () => new Connection(RPC_URL, { commitment: 'confirmed' }),
    [],
  )
  const programId = React.useMemo(
    () => new PublicKey(KRYPTON_PROGRAM_ID),
    [],
  )

  return (
    <LzProvider
      rpcUrl={RPC_URL}
      customConnection={connection}
      programId={programId}
      chainId="devnet"
    >
      {children}
    </LzProvider>
  )
}