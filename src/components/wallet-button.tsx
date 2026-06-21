"use client"

import { useState, useEffect, useContext } from "react"
import { DynamicContext } from "@dynamic-labs/sdk-react-core"

const DYNAMIC_ENV_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? ""

const placeholder = (
  <div className="inline-flex items-center justify-center bg-accent/40 text-white/40 px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider rounded cursor-default">
    Connect wallet
  </div>
)

export function WalletButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return placeholder
  if (!DYNAMIC_ENV_ID) return placeholder

  return <WalletButtonInner />
}

function WalletButtonInner() {
  const dynamicContext = useContext(DynamicContext)

  if (!dynamicContext) return placeholder

  const { primaryWallet } = dynamicContext
  const setShowAuthFlow = dynamicContext.setShowAuthFlow

  if (primaryWallet) {
    const address = primaryWallet.address
    const short = `${address.slice(0, 4)}...${address.slice(-4)}`
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-accent-positive" />
        <span className="font-mono text-[11px] text-text-secondary">{short}</span>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowAuthFlow(true)}
      className="inline-flex items-center justify-center bg-accent text-white px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider hover:bg-accent-hover transition-colors rounded"
    >
      Connect wallet
    </button>
  )
}
