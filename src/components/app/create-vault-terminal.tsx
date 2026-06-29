'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PrimaryCta } from '@/components/app/app-shell'
import type { GeneratedPolicy } from '@/lib/create-vault'

export function CreateVaultTerminal({
  onPolicy,
  ownerWallet,
  sessionId,
  onSession,
  initialPrompt,
  analyzeTrigger,
  onAnalyzingChange,
}: {
  onPolicy: (policy: GeneratedPolicy) => void
  ownerWallet?: string | null
  sessionId?: string | null
  onSession?: (nextSessionId: string | null) => void
  initialPrompt?: string
  analyzeTrigger?: number
  onAnalyzingChange?: (loading: boolean) => void
}) {
  const [input, setInput] = useState(initialPrompt ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastTrigger = useRef(0)

  const analyze = useCallback(
    async (message: string) => {
      const msg = message.trim()
      if (!msg || loading) return
      setLoading(true)
      onAnalyzingChange?.(true)
      setError(null)

      try {
        const res = await fetch('/api/policy/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: msg, ownerWallet, sessionId }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data.error ?? `Request failed (${res.status})`)
        }
        onSession?.(typeof data.sessionId === 'string' ? data.sessionId : null)
        onPolicy(data.policy as GeneratedPolicy)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate policy')
      } finally {
        setLoading(false)
        onAnalyzingChange?.(false)
      }
    },
    [loading, onAnalyzingChange, onPolicy, onSession, ownerWallet, sessionId],
  )

  useEffect(() => {
    if (initialPrompt) setInput(initialPrompt)
  }, [initialPrompt])

  useEffect(() => {
    if (!analyzeTrigger || analyzeTrigger === lastTrigger.current) return
    lastTrigger.current = analyzeTrigger
    if (initialPrompt) analyze(initialPrompt)
  }, [analyzeTrigger, initialPrompt, analyze])

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-border bg-bg-deep px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
          Step 2 — Describe intent
        </p>
      </div>
      <div className="p-4 sm:p-6">
        <p className="font-mono text-xs text-accent sm:text-sm">
          <span className="text-text-muted">{'>'}</span> Natural language → constraint-bound policy
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:gap-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                analyze(input)
              }
            }}
            placeholder="e.g. Deploy USDC into tier-1 lending, max 4% drawdown, no leverage..."
            rows={4}
            disabled={loading}
            className="input-field min-h-[112px] w-full resize-none font-mono text-sm"
          />
          <PrimaryCta
            onClick={() => analyze(input)}
            className={`w-full sm:ml-auto sm:w-auto ${loading ? 'pointer-events-none opacity-60' : ''}`}
          >
            {loading ? 'Analyzing strategy…' : 'Generate policy'}
          </PrimaryCta>
        </div>
        {loading && (
          <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
            <span>Compiling policy (may take ~15s)…</span>
          </div>
        )}
        {error && (
          <p className="mt-3 font-mono text-xs text-accent-risk">{error}</p>
        )}
      </div>
    </section>
  )
}
