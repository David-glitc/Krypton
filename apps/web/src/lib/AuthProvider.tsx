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
 * Catches LzProvider render errors.
 * Normal: children render inside KryptonWalletProvider (with LzProvider).
 * Crashed: children render WITHOUT KryptonWalletProvider (safe mode).
 */
class SafeBoundary extends React.Component<
  { children: React.ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false }

  static getDerivedStateFromError(): { crashed: true } {
    return { crashed: true }
  }

  render() {
    if (this.state.crashed) {
      return (
        <LazorkitSafeContext.Provider value={false}>
          {this.props.children}
        </LazorkitSafeContext.Provider>
      )
    }
    return <KryptonWalletProvider>{this.props.children}</KryptonWalletProvider>
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
      <SafeBoundary>{children}</SafeBoundary>
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
