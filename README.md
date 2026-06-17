# Krypton

Programmable Capital Policy Engine for Solana.

## Monorepo

| Path | Purpose | MVP status |
|------|---------|------------|
| `apps/web` | TanStack Start + React (landing, app, policy builder) | ✅ Live (mock data) |
| `programs/krypton_core` | Anchor program — vault, policy, constraint engine | ✅ Compiles, 7 instructions |
| `packages/policy-schema` | Capital Policy Zod schema | ✅ 21 tests |
| `packages/sdk` | Shared types + env constants | ✅ 6 tests |
| `packages/ui` | PolicyBlock, ConstraintBars, PendingActionCard | ✅ 10 tests |
| `services/orchestrator` | AI agent pipeline | 🔄 Phase 2 scaffold |
| `services/krypton-sim-rs` | Simulation engine | 🔄 Phase 2 scaffold |

## Quick start

```bash
pnpm install
pnpm dev          # TanStack Start @ http://localhost:3000
```

```bash
cd programs && cargo build --package krypton_core
```

## Tests

```bash
# All packages
cd packages/policy-schema && npx vitest run
cd packages/sdk && npx vitest run
cd packages/ui && npx vitest run

# Full workspace type-check
pnpm build
```

Total: **37 tests** across 3 packages, all passing.

## Docs

- [AGENTS.md](./AGENTS.md) — Cursor agent skill index
- [docs/MAINNET-PRIVATE-BETA-MAP.md](./docs/MAINNET-PRIVATE-BETA-MAP.md) — launch checklist

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing |
| `/docs` | Policy schema reference |
| `/app` | Vault list (wallet + invite gate) |
| `/app/create` | Policy builder wizard |
| `/app/vault/:id` | Dashboard |
| `/app/vault/:id/activity` | Level 2 pending actions |
| `/app/vault/:id/policy` | Policy detail |

## Program instructions (Phase 1 MVP)

| Instruction | Description |
|-------------|-------------|
| `create_vault` | Initialize vault with owner + constraint bounds |
| `submit_policy` | Anchor policy hash on-chain, activate vault |
| `deposit` | Increase NAV |
| `pause_vault` / `unpause_vault` | Owner pause/unpause |
| `check_constraints` | Constraint Engine gate (leverage, concentration, drawdown) |

Program ID (devnet): `4Xs4pQ2vA9bv8dTxoe6cA9sQZBLZr6aKD4RrGnCdB1g6`
