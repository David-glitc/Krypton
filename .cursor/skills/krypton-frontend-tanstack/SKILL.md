---
name: krypton-frontend-tanstack
description: >-
  Builds Krypton web app with TanStack Start and React — landing page, vault
  dashboard, policy builder wizard, wallet adapter, Level 2 approval UI, and
  ConstraintState visualization. Use when implementing Krypton frontend,
  routes, React components, or Solana wallet flows.
---

# Krypton Frontend (TanStack Start + React)

## Stack

| Piece | Choice |
|-------|--------|
| Framework | TanStack Start (file routes, SSR/streaming) |
| UI | React 19, Tailwind CSS |
| Wallet | `@solana/wallet-adapter-react` — Phantom, Solflare, Backpack |
| Charts | Recharts (NAV, constraint bars) |
| State | TanStack Query for RPC/indexer data |
| SDK | `@krypton/sdk` (program client, TypedAction types) |

**Do not use Next.js** — PRD §8.3 is superseded by project tech stack.

## Route map

```
/                           → marketing landing (public)
/app                        → vault list (invite-gated)
/app/create                 → policy builder wizard
/app/vault/:id              → dashboard
/app/vault/:id/policy       → policy detail + amend
/app/vault/:id/activity     → execution log, pending actions
/app/vault/:id/governance   → DAO only (defer beta)
/docs                       → schema reference
```

## Design system (mandatory)

From `extracted/Style-Guide.md`:

| Token | Hex | Use |
|-------|-----|-----|
| --bg-base | #0E1116 | Background |
| --accent-policy | #FFB02E | Active policy, CTAs |
| --accent-privacy | #5EE6D9 | Ika signing / non-custody indicators |
| --accent-risk | #FF6B5E | Constraint violations only |

Fonts: **Space Grotesk** (display), **IBM Plex Sans** (body), **IBM Plex Mono** (policy blocks).

**Policy block motif:** YAML-style `field: value` labels for schema fields — not decorative numbering.

## Core user flows

### 1. Vault creation wizard

Steps: name → governance mode (personal default) → policy builder form → live validation → review → sign `create_vault` + `submit_policy`.

Policy builder maps form fields to canonical YAML schema (`packages/policy-schema`).

### 2. Deposit

Wallet connect → asset select → amount → tx preview (show constraint impact) → sign `deposit`.

### 3. Dashboard

- Policy summary card (Plex Mono fields)
- ConstraintState progress bars: drawdown, leverage, concentration vs limits
- NAV chart (respect privacy level — V1: public NAV, signing non-custody via Ika)
- Execution log feed

### 4. Level 2 pending action (beta default)

Card per `propose_action`:
- Plain-language rationale (from agent summary)
- Simulation: expected return, drawdown, VaR
- Constraint preview: post-execution bars
- Approve / Reject buttons → owner signs `execute_action`

### 5. Error copy (style guide)

Factual, specific: `Rejected — leverage 2.3x exceeds policy max 2.0x`

## Wallet integration

```typescript
// apps/web/src/lib/wallet.tsx
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter, BackpackWalletAdapter } from '@solana/wallet-adapter-wallets';
```

Env: `VITE_SOLANA_RPC`, `VITE_KRYPTON_PROGRAM_ID`, `VITE_CLUSTER=mainnet-beta`.

## TanStack Start project structure

```
apps/web/
├── app/
│   ├── routes/
│   │   ├── index.tsx          # landing
│   │   ├── app/
│   │   │   ├── index.tsx
│   │   │   ├── create.tsx
│   │   │   └── vault.$id.tsx
│   │   └── docs/
│   ├── components/
│   │   ├── PolicyBlock.tsx
│   │   ├── ConstraintBars.tsx
│   │   └── PendingActionCard.tsx
│   └── lib/
│       ├── wallet.tsx
│       └── krypton-client.ts
└── tailwind.config.ts
```

## Private beta gates

- `/app/*` behind invite allowlist check (wallet pubkey)
- Mainnet program IDs only in production env
- Transaction simulation before every sign prompt

## Additional reference

Component patterns: [components.md](components.md)
