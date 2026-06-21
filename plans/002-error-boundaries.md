# Plan 002: Add error boundaries to all route segments

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.

> **Drift check (run first)**: `git diff --stat 23968b68d..HEAD -- src/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `23968b68d`, 2026-06-19

## Why this matters

If any component throws during rendering, the entire page crashes with no fallback user interface. Next.js requires `error.tsx` files to define error boundaries per route segment. Without them, users see a blank screen or the default Next.js error page with no way to recover.

## Current state

- No `error.tsx` files exist in any route segment
- Route segments: `src/app/` (root), `src/app/app/` (app shell), `src/app/app/vault/[id]/` (vault detail), `src/app/app/vault/[id]/activity/` (activity), `src/app/app/create/` (create vault)
- The repo uses the App Router pattern where each directory is a route segment

## Commands you will need

| Purpose   | Command                | Expected on success |
|-----------|------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`     | exit 0, no errors   |
| Build     | `pnpm build`           | exit 0              |

## Scope

**In scope** (create these new files):
- `src/app/error.tsx` — root error boundary
- `src/app/app/error.tsx` — app section error boundary
- `src/app/app/vault/[id]/error.tsx` — vault detail error boundary
- `src/app/app/vault/[id]/activity/error.tsx` — activity error boundary
- `src/app/app/create/error.tsx` — create vault error boundary

**Out of scope**:
- Any existing page components
- `src/app/layout.tsx` — don't modify

## Steps

### Step 1: Create root error boundary

Create `src/app/error.tsx`:

```tsx
'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[Root Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">something went wrong</p>
      <p className="max-w-md text-sm text-text-secondary">{error.message ?? 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 2: Create app section error boundary

Create `src/app/app/error.tsx`:

```tsx
'use client'

import { useEffect } from 'react'

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[App Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">something went wrong</p>
      <p className="max-w-md text-sm text-text-secondary">{error.message ?? 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 3: Create vault detail error boundary

Create `src/app/app/vault/[id]/error.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function VaultError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[Vault Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">vault error</p>
      <p className="max-w-md text-sm text-text-secondary">{error.message ?? 'Failed to load vault.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
        >
          Try again
        </button>
        <Link
          href="/app"
          className="inline-flex items-center justify-center border border-accent bg-accent/10 px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-accent hover:bg-accent/20 transition-colors"
        >
          Back to vaults
        </Link>
      </div>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 4: Create activity error boundary

Create `src/app/app/vault/[id]/activity/error.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ActivityError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[Activity Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">activity error</p>
      <p className="max-w-md text-sm text-text-secondary">{error.message ?? 'Failed to load activity.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
        >
          Try again
        </button>
        <Link
          href="/app"
          className="inline-flex items-center justify-center border border-accent bg-accent/10 px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-accent hover:bg-accent/20 transition-colors"
        >
          Back to vaults
        </Link>
      </div>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 5: Create create vault error boundary

Create `src/app/app/create/error.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function CreateError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[Create Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">creation error</p>
      <p className="max-w-md text-sm text-text-secondary">{error.message ?? 'Failed to load create form.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center border border-border bg-bg-panel px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-text-primary hover:border-text-secondary transition-colors"
        >
          Try again
        </button>
        <Link
          href="/app"
          className="inline-flex items-center justify-center border border-accent bg-accent/10 px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-accent hover:bg-accent/20 transition-colors"
        >
          Back to vaults
        </Link>
      </div>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 6: Build and verify

```bash
pnpm build
```

**Verify**: Build exits 0 with no errors

## Test plan

- No new tests needed — error boundaries are tested implicitly by the build succeeding and by future integration tests.

## Done criteria

- [ ] `pnpm build` exits 0
- [ ] `npx tsc --noEmit` exits 0
- [ ] 5 `error.tsx` files exist in the correct route segments
- [ ] Each error boundary displays a "Try again" button
- [ ] Vault and activity error boundaries include a "Back to vaults" link

## STOP conditions

- If `error.tsx` files cause build errors due to missing `'use client'` directive, add it
- If the `reset` prop type causes issues, change to `reset: () => void`

## Maintenance notes

- When adding new route segments, always create a corresponding `error.tsx`
- Consider adding error tracking (Sentry, etc.) to the `useEffect` in each boundary
- The error boundaries use inline styles matching the existing design system — keep consistent with `globals.css` variables
