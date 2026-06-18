import * as React from 'react'
import { DynamicContextProvider, useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
import {
  KryptonWalletProvider,
  useLazorkitWallet,
  LazorkitSafeContext,
} from '~/lib/LazorkitProvider'

const DYNAMIC_ENV_ID =
  (import.meta as { env?: Record<string, string> }).env?.VITE_DYNAMIC_ENVIRONMENT_ID ?? ''

interface KryptonAuthProviderProps {
  children: React.ReactNode
}

/**
 * Catches errors from wallet SDK initialization.
 * On error: renders children in safe mode (wallet hooks return defaults).
 */
class WalletBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError(): { hasError: true } {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <LazorkitSafeContext.Provider value={false}>
          {this.props.children}
        </LazorkitSafeContext.Provider>
      )
    }
    return (
      <LazorkitSafeContext.Provider value={true}>
        <KryptonWalletProvider>{this.props.children}</KryptonWalletProvider>
      </LazorkitSafeContext.Provider>
    )
  }
}

export function KryptonAuthProvider({ children }: KryptonAuthProviderProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENV_ID || '',
        walletConnectors: [SolanaWalletConnectors],
      }}
    >
      <WalletBoundary>{children}</WalletBoundary>
    </DynamicContextProvider>
  )
}

/** Unified wallet access — never throws, always safe. */
export function useKryptonAuth() {
  const dynamic = useDynamicContext()
  const lazorkit = useLazorkitWallet()
  return {
    dynamic: DYNAMIC_ENV_ID ? dynamic : null,
    lazorkit,
    isConnected: (dynamic?.primaryWallet != null) || lazorkit.isConnected,
    primaryAddress:
      dynamic?.primaryWallet?.address ?? lazorkit.wallet?.smartWallet ?? null,
  }
}

export { useDynamicContext, useLazorkitWallet }
