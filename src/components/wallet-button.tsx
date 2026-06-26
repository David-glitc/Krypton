"use client"

import { useState, useEffect, useContext } from "react"
import { DynamicContext } from "@dynamic-labs/sdk-react-core"

const DYNAMIC_ENV_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? ""

const placeholder = (
  <div className="btn-primary !py-2 !px-6 !text-[13px] !opacity-40 cursor-default">
    Connect Wallet
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
        <div className="h-2 w-2 rounded-full bg-accent" />
        <span className="font-[family-name:var(--font-jetbrains)] text-[11px] text-text-secondary">{short}</span>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowAuthFlow(true)}
      className="btn-primary !py-2 !px-6 !text-[13px]"
    >
      Connect Wallet
    </button>
  )
}
