"use client"

import { useState, useEffect, useContext, useRef } from "react"
import Link from "next/link"
import { DynamicContext } from "@dynamic-labs/sdk-react-core"
import { ChevronDown, LogOut, User, Settings } from "lucide-react"

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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!dynamicContext) return placeholder

  const { primaryWallet, handleLogOut } = dynamicContext
  const setShowAuthFlow = dynamicContext.setShowAuthFlow

  if (primaryWallet) {
    const address = primaryWallet.address
    const short = `${address.slice(0, 4)}…${address.slice(-4)}`
    const cluster = process.env.NEXT_PUBLIC_SOLANA_CLUSTER ?? 'devnet'

    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded border border-border bg-bg-base px-3 py-2 transition-colors hover:border-accent/40"
        >
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-mono text-[11px] text-text-primary">{short}</span>
          <ChevronDown className="h-3 w-3 text-text-muted" />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-bg-panel py-1 shadow-xl">
            <div className="border-b border-border px-3 py-2">
              <p className="font-mono text-[10px] text-text-muted break-all">{address}</p>
              <p className="mt-1 text-[10px] uppercase text-text-secondary">{cluster}</p>
            </div>
            <Link
              href="/app/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            >
              <User className="h-3.5 w-3.5" />
              Profile
            </Link>
            <Link
              href="/app/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                handleLogOut()
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-accent-risk hover:bg-accent-risk-muted/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>
        )}
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
