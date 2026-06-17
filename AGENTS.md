# Krypton — Agent Orchestration Map

**Programmable Capital Policy Engine for Solana · Mainnet Private Beta**

This file is the master index for distributed Cursor agent skills and project rules. Each skill is a self-contained resource an agent loads when working in that domain.

---

## Product Truth (read first)

| Source | Path | Authority |
|--------|------|-----------|
| PRD v1.0 | `PRD (1).md` | Product scope, abstractions, integrations |
| Execution Architecture | `Execution-Architecture-Ika.md` | **Supersedes PRD §6 (privacy)** — Ika = dWallet signing, not encrypted balances |
| Marketing one-pager | `extracted/One-Pager.md` | Positioning (update privacy claims before public launch) |
| Style guide | `extracted/Style-Guide.md` | Visual identity, voice, typography |
| Mainnet map | `docs/MAINNET-PRIVATE-BETA-MAP.md` | End-to-end launch checklist |

---

## Tech Stack (binding for implementation)

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend SPA | **TanStack Start** + React 19 | SSR/streaming, file-based routes, NOT Next.js |
| Solana programs | **Anchor** (Rust) | `krypton_core` + protocol adapters |
| Cross-chain signing | **Ika** (dWallet MPC) | Policy-gated co-signing; no agent-held keys |
| AI gateway | **OpenRouter** | Per-agent model routing + fallback chains |
| Simulation | **Rust microservice** (`krypton-sim-rs`) | Monte Carlo + backtests; LLM for narrative only |
| Indexing / RPC | **Helius** | Activity feeds, webhooks, enhanced RPC |
| Oracles | **Pyth** | ConstraintState pricing + staleness checks |
| Storage | **Arweave** or Shadow Drive | Policy JSON, agent transcripts (hashed on-chain) |
| Wallets | Phantom, Solflare, Backpack | `@solana/wallet-adapter` |

---

## Agent Skills Index

Load the skill whose `description` matches your current task.

| Skill | Path | Use when |
|-------|------|----------|
| **Mainnet Launch** | `.cursor/skills/krypton-mainnet-launch/SKILL.md` | Private beta → mainnet gate, checklists, dependencies |
| **Protocol (Anchor)** | `.cursor/skills/krypton-protocol-anchor/SKILL.md` | Solana programs, adapters, Constraint Engine, Ika CPI |
| **Frontend (TanStack)** | `.cursor/skills/krypton-frontend-tanstack/SKILL.md` | Landing, app UI, wallet flows, policy builder |
| **AI Harness** | `.cursor/skills/krypton-ai-harness/SKILL.md` | Agent pipeline, OpenRouter, tool layer, cycle FSM |
| **Marketing & Landing** | `.cursor/skills/krypton-marketing-landing/SKILL.md` | Copy, landing page, deck, style guide compliance |
| **GTM** | `.cursor/skills/krypton-gtm/SKILL.md` | Private beta cohort, DAO outreach, legal framing |
| **DevOps & Hosting** | `.cursor/skills/krypton-devops/SKILL.md` | CI/CD, infra, RPC, secrets, monitoring |

---

## Recommended Build Order

```
Phase 0 — Foundation
  cursor_project_rules + monorepo scaffold (programs/, apps/web/, services/)

Phase 1 — Protocol (devnet)
  krypton_core: create_vault, submit_policy, deposit, ConstraintState
  adapter_jupiter (swap only) → devnet integration tests

Phase 2 — AI Harness (devnet)
  Orchestrator + Research/Strategy/Risk agents → propose_action (Level 2)
  krypton-sim-rs stub → Simulation Agent integration

Phase 3 — Frontend (devnet)
  Landing + /app vault wizard + dashboard + Level 2 approval UI

Phase 4 — Hardening
  Audits, guardian multisig, force_pause drills, oracle staleness tests
  Ika dWallet path (if cross-chain in V1 scope)

Phase 5 — Mainnet Private Beta
  See krypton-mainnet-launch skill + docs/MAINNET-PRIVATE-BETA-MAP.md
```

---

## Monorepo Layout (target)

```
krypton/
├── programs/
│   ├── krypton_core/          # Anchor: vault, policy, constraints, execution router
│   └── adapters/              # jupiter, drift, kamino, sanctum
├── apps/
│   └── web/                   # TanStack Start + React
├── services/
│   ├── orchestrator/          # Agent pipeline (TypeScript)
│   ├── krypton-sim-rs/        # Simulation engine (Rust)
│   └── keeper/                # Oracle crank, constraint refresh
├── packages/
│   ├── policy-schema/         # YAML/JSON schema + validators
│   ├── sdk/                   # Typed client for programs + TypedAction
│   └── ui/                    # Shared React components (policy blocks)
├── ops/                       # Docker, Traefik, deploy scripts
└── docs/
```

---

## Cursor Rules

| Rule | Path | Scope |
|------|------|-------|
| Krypton core | `.cursor/rules/krypton-core.mdc` | Always apply in this repo |

---

## Open Decisions (track in implementation-plan.mdc)

1. Futarchy venue for DAO governance (MetaDAO-class program)
2. External position attestation per chain (light client vs oracle)
3. V1 cross-chain asset list vs Ika signature-scheme coverage
4. Confidential balances — **deferred**; privacy claim = signing non-custody (Ika)
5. Correlation matrix source for `max_correlated_exposure_bps`
