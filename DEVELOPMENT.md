## Development Log

- 2026-06-25T12:00:00Z — Deployed shared libSQL (`krypton-sqld` on VPS :8787, public `https://krypton-db.chessonchain.online`) and wired Vercel production `LIBSQL_URL` to it; removed invalid serverless `KRYPTON_DB_PATH`.
- 2026-06-25T19:00:00Z — RPC failover chain: Helius primary → Alchemy fallback → public; synced devnet/mainnet RPC env vars to Vercel prod/preview/dev.

- 2026-06-25T07:47:59Z — Implemented beta vertical slice APIs (`/api/policy/compile`, `/api/vaults*`) and wired `/app/create` to build/sign/finalize on-chain vault + policy transaction bundles.
- 2026-06-25T07:47:59Z — Replaced stubbed vault notFound routes with live vault/activity clients, added cycle queue trigger UI, and stabilized `services/orchestrator` worker for shared SQLite multi-tenant cycle processing.

- 2026-06-25T08:27:00Z — Implemented initial `services/orchestrator` package with cycle worker CLI, FSM stages, stub agents, and SQLite integration for cycle runs, agent invocations, and pending actions.
- 2026-06-25T07:48:00Z — Cleaned duplicate orchestrator file collisions, normalized ESM imports, and verified root `pnpm orchestrator` starts worker in stub mode.

## 2026-06-24 22:30 UTC

- Added SQLite-backed multi-tenant storage under `src/lib/db` with schema for interactive sessions, cycle jobs, cycle runs, agent invocations, vault registry, activity events, and pending actions.
- Added service modules for session lifecycle, cycle leasing, vault registration, and activity event storage, and ignored `.data/` for the local database file.

## 2026-06-24 23:10 UTC

- Added `services/orchestrator` as a workspace package with a TypeScript CLI entrypoint, shared SQLite access, and a polling worker started by `pnpm orchestrator`.
- Implemented the cycle FSM, stub agent pipeline, agent invocation and cycle run persistence, and Level 2 `pending_actions` creation at the permission gate.
