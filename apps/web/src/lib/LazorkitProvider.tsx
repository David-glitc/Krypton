import * as React from 'react'
import { RPC_URL } from '@krypton/sdk'
import type { PublicKey } from '@solana/web3.js'
import {
  LazorkitProvider as LzProvider,
  useWallet as useLazorkitBase,
  useWalletStore,
} from '@lazorkit/wallet'
import type { WalletHookInterface } from '@lazorkit/wallet'

export type { WalletHookInterface }
export { useWalletStore }

const SAFE: WalletHookInterface = {
  smartWalletPubkey: null,
  wallet: null,
  isConnected: false,
  isLoading: false,
  isConnecting: false,
  isSigning: false,
  error: null,
  connect: async () => { throw new Error('Wallet SDK not available') },
  disconnect: async () => {},
  signAndSendTransaction: async () => { throw new Error('Wallet SDK not available') },
  signMessage: async () => { throw new Error('Wallet SDK not available') },
  verifyMessage: async () => false,
}

export const LazorkitSafeContext = React.createContext(true)

export function useLazorkitWallet(): WalletHookInterface {
  const isSafe = React.useContext(LazorkitSafeContext)
  const base = useLazorkitBase()
  return isSafe ? base : SAFE
}

export interface KryptonWalletProviderProps {
  children: React.ReactNode
}

export function KryptonWalletProvider({ children }: KryptonWalletProviderProps) {
  if (!RPC_URL) return <>{children}</>
  return (
    <LzProvider rpcUrl={RPC_URL} portalUrl="https://portal.lazor.sh">
      {children}
    </LzProvider>
  )
}
