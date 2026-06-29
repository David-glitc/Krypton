'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageSquare, Send, Loader2, Trash2, X, AlertTriangle } from 'lucide-react'

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
  at: number
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}

function renderContent(text: string) {
  const parts: Array<{ type: 'text' | 'code' | 'bold'; content: string }> = []
  let remaining = text

  while (remaining.length > 0) {
    const codeMatch = remaining.match(/```(\w*)\n?([\s\S]*?)```/)
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) parts.push({ type: 'text', content: remaining.slice(0, codeMatch.index) })
      parts.push({ type: 'code', content: codeMatch[2]!.trim() })
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length)
      continue
    }

    const inlineCode = remaining.match(/`([^`]+)`/)
    if (inlineCode && inlineCode.index !== undefined) {
      if (inlineCode.index > 0) parts.push({ type: 'text', content: remaining.slice(0, inlineCode.index) })
      parts.push({ type: 'code', content: inlineCode[1]! })
      remaining = remaining.slice(inlineCode.index + inlineCode[0].length)
      continue
    }

    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push({ type: 'text', content: remaining.slice(0, boldMatch.index) })
      parts.push({ type: 'bold', content: boldMatch[1]! })
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
      continue
    }

    parts.push({ type: 'text', content: remaining })
    remaining = ''
  }

  return parts.map((part, i) => {
    if (part.type === 'code') {
      return (
        <code
          key={i}
          className="block overflow-x-auto rounded border border-border/50 bg-bg-panel px-3 py-2.5 font-mono text-xs leading-relaxed"
        >
          {part.content}
        </code>
      )
    }
    if (part.type === 'bold') {
      return <strong key={i} className="font-semibold text-text-primary">{part.content}</strong>
    }
    const lines = part.content.split('\n')
    return (
      <span key={i}>
        {lines.map((line, li) => {
          if (/^\s*[-*]\s/.test(line)) {
            return (
              <span key={li} className="ml-3 block">
                <span className="mr-2 text-accent">→</span>
                {line.replace(/^\s*[-*]\s/, '')}
                {li < lines.length - 1 && <br />}
              </span>
            )
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <span key={li} className="ml-3 block">
                <span className="mr-2 text-accent">{line.match(/^\d+/)?.[0]}.</span>
                {line.replace(/^\d+\.\s/, '')}
                {li < lines.length - 1 && <br />}
              </span>
            )
          }
          return (
            <span key={li}>
              {line}
              {li < lines.length - 1 && <br />}
            </span>
          )
        })}
      </span>
    )
  })
}

export function AgentChatPanel({
  vaultAddress,
  ownerWallet,
  vaultName,
}: {
  vaultAddress: string
  ownerWallet: string | undefined
  vaultName: string
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [booting, setBooting] = useState(true)
  const [clearing, setClearing] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadChat = useCallback(async () => {
    if (!ownerWallet) {
      setBooting(false)
      return
    }
    try {
      const res = await fetch(
        `/api/vaults/${vaultAddress}/agent-chat?ownerWallet=${encodeURIComponent(ownerWallet)}`,
        { cache: 'no-store' },
      )
      const json = await res.json()
      if (res.ok) setMessages(json.messages ?? [])
    } catch {
      // silent
    } finally {
      setBooting(false)
    }
  }, [vaultAddress, ownerWallet])

  useEffect(() => {
    loadChat()
  }, [loadChat])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    if (!ownerWallet || !input.trim() || loading) return
    const text = input.trim()
    setInput('')
    setLoading(true)
    setMessages((prev) => [...prev, { role: 'user', content: text, at: Date.now() }])

    try {
      const res = await fetch(`/api/vaults/${vaultAddress}/agent-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerWallet, message: text }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Send failed')
      setMessages(json.messages ?? [])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: err instanceof Error ? err.message : 'Could not reach agent.',
          at: Date.now(),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  async function handleClear() {
    if (!ownerWallet) return
    setClearing(true)
    try {
      await fetch(
        `/api/vaults/${vaultAddress}/agent-chat?ownerWallet=${encodeURIComponent(ownerWallet)}`,
        { method: 'DELETE' },
      )
      setMessages([])
    } catch {
      // silent
    } finally {
      setClearing(false)
      setConfirmClear(false)
    }
  }

  const userMessages = messages.filter((m) => m.role !== 'system')
  const tokenEstimate = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0)

  return (
    <section className="panel flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare className="h-4 w-4 shrink-0 text-accent" />
          <h2 className="truncate font-display text-base font-semibold text-text-primary">
            Talk to your agent
          </h2>
        </div>
        {userMessages.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            {tokenEstimate > 0 && (
              <span className="hidden text-[10px] text-text-muted sm:block">
                {userMessages.length} msgs · ~{tokenEstimate >= 1000 ? `${(tokenEstimate / 1000).toFixed(1)}k` : tokenEstimate} tok
              </span>
            )}
            {confirmClear ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-accent-warn">Clear all?</span>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={clearing}
                  className="rounded bg-accent-risk/20 px-2 py-1 text-[10px] text-accent-risk hover:bg-accent-risk/30 disabled:opacity-50"
                >
                  {clearing ? '…' : 'Yes'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded px-1.5 py-1 text-text-muted hover:text-text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="rounded p-1.5 text-text-muted transition-colors hover:bg-bg-panel hover:text-accent-warn"
                title="Clear chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex min-h-[240px] max-h-[400px] flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6">
        {!ownerWallet ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-text-muted">Connect your wallet to chat with the agent.</p>
          </div>
        ) : booting ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading conversation…
            </div>
          </div>
        ) : userMessages.length === 0 ? (
          <div className="space-y-3 text-sm">
            <p className="text-text-secondary">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'What should we do with idle capital?',
                'Best yield strategy within my limits?',
                'Summarize risk headroom right now',
                'Show me the vault balance breakdown',
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInput(prompt)
                    inputRef.current?.focus()
                  }}
                  className="rounded-md border border-border/60 bg-bg-panel/50 px-3 py-2 text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {userMessages.map((m, i) => (
              <div
                key={`${m.at}-${i}`}
                className={`max-w-[94%] rounded-lg px-3.5 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'ml-auto bg-accent/15 text-text-primary'
                    : 'mr-auto border border-border/50 bg-bg-base text-text-secondary'
                }`}
              >
                {m.role === 'assistant' && (
                  <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                    Agent
                  </p>
                )}
                <div className="whitespace-pre-wrap break-words">
                  {renderContent(m.content)}
                </div>
                <p className="mt-1.5 text-right text-[10px] text-text-muted/50">{formatTime(m.at)}</p>
              </div>
            ))}
            {loading && (
              <div className="mr-auto flex items-center gap-2.5 rounded-lg border border-border/50 bg-bg-base px-4 py-3">
                <span className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent/60" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent/60" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-accent/60" style={{ animationDelay: '300ms' }} />
                </span>
                <span className="text-sm text-text-muted">Thinking…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {userMessages.length >= 20 && !confirmClear && (
        <div className="flex items-center gap-1.5 border-t border-border/40 px-4 py-2 sm:px-6">
          <AlertTriangle className="h-3 w-3 shrink-0 text-accent-warn" />
          <p className="text-[10px] text-text-muted">
            Long chat — clear to reduce token usage and keep responses sharp.
          </p>
        </div>
      )}

      <div className="border-t border-border p-4 sm:p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={ownerWallet ? 'Ask about research or strategy…' : 'Connect wallet first'}
            disabled={!ownerWallet || loading}
            className="input-field h-11 flex-1 text-sm"
          />
          <button
            type="button"
            onClick={send}
            disabled={!ownerWallet || loading || !input.trim()}
            className="inline-flex h-11 w-11 items-center justify-center bg-accent text-bg-base transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
