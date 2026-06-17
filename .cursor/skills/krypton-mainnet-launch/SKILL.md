---
name: krypton-mainnet-launch
description: >-
  Orchestrates Krypton Solana mainnet private beta launch across protocol,
  frontend, AI harness, marketing, GTM, and DevOps. Use when planning
  mainnet deployment, private beta gates, launch checklists, or cross-team
  dependencies for the Krypton capital policy engine.
---

# Krypton Mainnet Private Beta Launch

## Authority documents

1. `docs/MAINNET-PRIVATE-BETA-MAP.md` — full cross-domain checklist
2. `AGENTS.md` — skill index and build order
3. `Execution-Architecture-Ika.md` — Ika = signing, not privacy (update marketing before launch)

## Launch phases

```
DEVNET COMPLETE → AUDIT → MAINNET DEPLOY → INVITE BETA → STABLE 2W → PUBLIC
```

## Private beta constraints (non-negotiable)

- **Level 2 default** — suggest-only; user signs every execution
- **Level 4 disabled** — no fully autonomous UX in beta
- **Invite allowlist** — wallet-gated `/app`
- **Per-vault deposit cap** — e.g. $10k USDC equivalent until stable
- **Guardian multisig** on all programs; `force_pause` drill before invites

## Cross-domain gate checklist

Copy and track:

```
Protocol:
- [ ] krypton_core mainnet program ID deployed (verified build)
- [ ] adapter_jupiter deployed + whitelisted in program config
- [ ] 2x leverage cap immutable in program binary
- [ ] Constraint Engine: all 8 checks revert-tested
- [ ] Oracle staleness (120s) revert-tested
- [ ] Upgrade authority = Squads multisig + timelock

AI Harness:
- [ ] OpenRouter keys in secrets manager (not in repo)
- [ ] Agent session key scoped: propose/execute only, no withdraw
- [ ] Audit trail: Arweave + on-chain hash per cycle
- [ ] Cycle abort on malformed agent JSON (max 2 retries)

Frontend:
- [ ] Mainnet RPC + program IDs in env
- [ ] Transaction preview on every wallet signature
- [ ] Level 2 approval UI tested on mainnet

Marketing:
- [ ] Privacy claims = Ika signing non-custody (NOT encrypted balances)
- [ ] Legal disclaimers on deposit flow
- [ ] No "fund/returns/managed/alpha" language

GTM:
- [ ] Invite list finalized (20–50 wallets)
- [ ] Support channel + incident runbook

DevOps:
- [ ] Helius mainnet RPC + rate limits
- [ ] Monitoring: pause events, oracle staleness, cycle abort rate
- [ ] Backup RPC provider configured
```

## Skill routing

| Task domain | Load skill |
|-------------|------------|
| Anchor programs | `krypton-protocol-anchor` |
| TanStack Start UI | `krypton-frontend-tanstack` |
| Agent pipeline | `krypton-ai-harness` |
| Landing/copy | `krypton-marketing-landing` |
| Beta cohort/outreach | `krypton-gtm` |
| Hosting/CI | `krypton-devops` |

## Open items before mainnet

See `cursor_project_rules/implementation-plan.mdc` — update each with "Done" + two-line summary when resolved.
