import * as React from 'react'
import { RPC_URL } from '@krypton/sdk'
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
  return <LzProvider rpcUrl={RPC_URL}>{children}</LzProvider>
}