"use client"

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { SolanaWalletConnectors } from "@dynamic-labs/solana"

const DYNAMIC_ENV_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? ""

export function DynamicProvider({ children }: { children: React.ReactNode }) {
  if (!DYNAMIC_ENV_ID) {
    console.warn("[Dynamic] NEXT_PUBLIC_DYNAMIC_ENV_ID not set — wallet connection disabled")
    return <>{children}</>
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENV_ID,
        walletConnectors: [SolanaWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}
