"use client"

import { useState, useEffect, Component, type ReactNode } from "react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

const DYNAMIC_ENV_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? ""

class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function WalletButtonInner() {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext()

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

  // No env ID configured — skip Dynamic entirely, never call useDynamicContext
  if (!DYNAMIC_ENV_ID) return placeholder

  return (
    <ErrorBoundary fallback={placeholder}>
      <WalletButtonInner />
    </ErrorBoundary>
  )
}
