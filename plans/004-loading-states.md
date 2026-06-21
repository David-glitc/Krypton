# Plan 004: Add loading states to all route segments

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

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `23968b68d`, 2026-06-19

## Why this matters

Pages render immediately with mock data — there are no loading spinners, skeleton states, or async patterns. When real data fetching is implemented (Plan 002), users will see blank screens while data loads. Adding `loading.tsx` files now establishes the pattern for every route segment.

## Current state

- No `loading.tsx` files exist in any route segment
- All page components are synchronous server components that render immediately
- Route segments: `src/app/`, `src/app/app/`, `src/app/app/vault/[id]/`, `src/app/app/vault/[id]/activity/`, `src/app/app/create/`

## Commands you will need

| Purpose   | Command                | Expected on success |
|-----------|------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`     | exit 0, no errors   |
| Build     | `pnpm build`           | exit 0              |

## Scope

**In scope** (create these new files):
- `src/app/loading.tsx` — root loading state
- `src/app/app/loading.tsx` — app section loading state
- `src/app/app/vault/[id]/loading.tsx` — vault detail loading state
- `src/app/app/vault/[id]/activity/loading.tsx` — activity loading state
- `src/app/app/create/loading.tsx` — create vault loading state

**Out of scope**:
- Any existing page components
- `src/app/layout.tsx` — don't modify

## Steps

### Step 1: Create a shared skeleton component

Create `src/components/skeleton.tsx`:

```tsx
export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-sm bg-bg-panel-raised ${className}`} />
}

export function SkeletonText({ width }: { width?: string }) {
  return <Skeleton className={`h-3 ${width ?? 'w-24'}`} />
}

export function SkeletonTitle() {
  return <Skeleton className="h-6 w-48" />
}

export function SkeletonCard() {
  return (
    <div className="border border-border rounded-sm p-4 space-y-3">
      <SkeletonTitle />
      <SkeletonText width="w-32" />
      <div className="h-1.5 rounded-sm bg-bg-panel-raised overflow-hidden">
        <div className="h-full w-2/3 rounded-sm bg-accent/30 animate-pulse" />
      </div>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 2: Create root loading state

Create `src/app/loading.tsx`:

```tsx
import { Skeleton, SkeletonTitle, SkeletonText } from '@/components/skeleton'

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-28" />
      </header>
      <section className="flex flex-col items-center justify-center px-6 py-24">
        <Skeleton className="h-10 w-96 mb-4" />
        <Skeleton className="h-6 w-64 mb-8" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-40" />
        </div>
      </section>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 3: Create app loading state

Create `src/app/app/loading.tsx`:

```tsx
import { SkeletonCard, SkeletonTitle, SkeletonText } from '@/components/skeleton'

export default function AppLoading() {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-bg-panel border-r border-border">
        <div className="h-14 px-4 flex items-center border-b border-border">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="px-4 py-3 border-b border-border">
          <SkeletonText width="w-12" />
          <Skeleton className="h-3 w-20 mt-1" />
        </div>
        <nav className="px-2 py-3 space-y-1">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <SkeletonTitle />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 4: Create vault detail loading state

Create `src/app/app/vault/[id]/loading.tsx`:

```tsx
import { SkeletonCard, SkeletonTitle, Skeleton } from '@/components/skeleton'

export default function VaultLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <SkeletonTitle />
          <SkeletonText width="w-40" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border rounded-sm p-5">
          <SkeletonTitle />
          <div className="mt-4 h-64 rounded-sm bg-bg-panel-raised animate-pulse" />
        </div>
        <div className="border border-border rounded-sm p-5">
          <SkeletonTitle />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 5: Create activity loading state

Create `src/app/app/vault/[id]/activity/loading.tsx`:

```tsx
import { Skeleton, SkeletonTitle, SkeletonText } from '@/components/skeleton'

export default function ActivityLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Skeleton className="h-4 w-32 mb-4" />
      <SkeletonTitle />
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 rounded border border-border bg-bg-panel p-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex-1">
              <SkeletonText width="w-64" />
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 6: Create create vault loading state

Create `src/app/app/create/loading.tsx`:

```tsx
import { Skeleton, SkeletonTitle } from '@/components/skeleton'

export default function CreateLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Skeleton className="h-4 w-40 mb-6" />
      <SkeletonTitle />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="panel mt-8 p-6 space-y-4">
        <SkeletonTitle />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
```

**Verify**: `npx tsc --noEmit` → no errors

### Step 7: Build and verify

```bash
pnpm build
```

**Verify**: Build exits 0 with no errors

## Test plan

- No unit tests needed — loading states are visual-only and tested by the build

## Done criteria

- [ ] `pnpm build` exits 0
- [ ] 6 `loading.tsx` files exist in all route segments
- [ ] 1 shared `src/components/skeleton.tsx` component exists
- [ ] All skeleton components use the `animate-pulse` animation from Tailwind

## STOP conditions

- If `animate-pulse` is not available in Tailwind v4, use a custom CSS animation instead
- If the Skeleton component causes TypeScript errors with the `className` prop, add proper typing: `className?: string`
