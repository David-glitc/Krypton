import * as React from 'react'
import {
  DynamicContextProvider,
  DynamicUserProfile,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'
import { LazorkitProvider, useWallet as useLazorkitWallet } from '@lazorkit/wallet'
import { RPC_URL } from '@krypton/sdk'

/**
 * Krypton unified auth — Dynamic (social/email/embedded wallet) + Lazorkit (passkey smart wallet).
 *
 * Flow:
 * 1. Dynamic modal: sign in with X, email, or embedded wallet
 * 2. Lazorkit passkey wallet: create/connect a passkey-based smart wallet
 * 3. Both wallets are available for different use cases:
 *    - Dynamic for easy onboarding (X, email)
 *    - Lazorkit for passkey-secured actions
 */

const DYNAMIC_ENV_ID =
  (import.meta as { env?: Record<string, string> }).env?.VITE_DYNAMIC_ENVIRONMENT_ID ??
  'd388d3b0-2620-4ef0-8c09-3ace6d0ebbf6'

interface KryptonAuthProviderProps {
  children: React.ReactNode
}

export function KryptonAuthProvider({ children }: KryptonAuthProviderProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENV_ID,
        walletConnectors: [SolanaWalletConnectors],
        events: {
          onAuthSuccess: () => {
            console.debug('[KryptonAuth] Dynamic auth success')
          },
        },
      }}
    >
      <LazorkitProvider rpcUrl={RPC_URL}>{children}</LazorkitProvider>
      <DynamicUserProfile />
    </DynamicContextProvider>
  )
}

export type KryptonWallet = {
  dynamic: ReturnType<typeof useDynamicContext>
  lazorkit: ReturnType<typeof useLazorkitWallet>
}

export function useKryptonAuth() {
  const dynamic = useDynamicContext()
  const lazorkit = useLazorkitWallet()

  return {
    dynamic,
    lazorkit,
    isConnected: dynamic.primaryWallet != null || lazorkit.isConnected,
    primaryAddress:
      dynamic.primaryWallet?.address ?? lazorkit.wallet?.smartWallet ?? null,
  }
}

export { useDynamicContext, useLazorkitWallet }
