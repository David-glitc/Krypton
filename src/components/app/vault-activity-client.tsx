'use client'

import { useEffect, useState } from 'react'

type VaultActivityEvent = {
  id: string
  event_type: string
  payload_json: Record<string, unknown>
  created_at: number
}

export function VaultActivityClient({ vaultAddress }: { vaultAddress: string }) {
  const [events, setEvents] = useState<VaultActivityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/vaults/${vaultAddress}/activity`, { cache: 'no-store' })
        const json = (await res.json()) as { events?: VaultActivityEvent[]; error?: string }
        if (!res.ok) {
          throw new Error(json.error ?? 'Failed to load activity')
        }
        if (!cancelled) {
          setEvents(json.events ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load activity')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [vaultAddress])

  if (loading) {
    return <div className="mx-auto max-w-5xl p-6 text-sm text-text-secondary lg:p-8">Loading execution history…</div>
  }

  if (error) {
    return <div className="mx-auto max-w-5xl p-6 text-sm text-accent-risk lg:p-8">{error}</div>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
      <div>
        <p className="font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-text-muted">
          Vault activity
        </p>
        <h1 className="mt-3 break-all font-[family-name:var(--font-hanken)] text-4xl font-bold text-text-primary">
          {vaultAddress}
        </h1>
      </div>

      <div className="panel p-6">
        <div className="space-y-6">
          {events.length ? (
            events.map((event) => (
              <div key={event.id} className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wide text-accent">
                    {event.event_type.replaceAll('_', ' ')}
                  </span>
                  <span className="text-xs text-text-muted">{new Date(event.created_at).toLocaleString()}</span>
                </div>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-[family-name:var(--font-jetbrains)] text-[11px] text-text-secondary">
                  {JSON.stringify(event.payload_json, null, 2)}
                </pre>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-secondary">No activity has been indexed for this vault yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
