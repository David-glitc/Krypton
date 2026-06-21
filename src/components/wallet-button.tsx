"use client"

import { useState, useEffect } from "react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

function WalletButtonInner() {
  const { setShowAuthFlow, primaryWallet } = useDynamicContext()

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

export function WalletButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="inline-flex items-center justify-center bg-accent/50 text-white/50 px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-wider rounded">
        Connect wallet
      </div>
    )
  }

  return <WalletButtonInner />
}
