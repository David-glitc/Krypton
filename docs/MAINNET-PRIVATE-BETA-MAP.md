# Krypton — Mainnet Private Beta Launch Map

**Scope:** Solana mainnet, invite-only private beta. Capital at risk. Real integrations.

---

## 1. Landing & Marketing Surface

| Deliverable | Owner skill | Done when |
|-------------|-------------|-----------|
| Public landing at `/` | `krypton-marketing-landing` | Hero, pipeline strip, differentiation table, CTA to waitlist/private beta |
| Style guide implementation | `krypton-marketing-landing` | Colors, Space Grotesk + IBM Plex, policy-block motif |
| One-pager PDF/web | `krypton-marketing-landing` | Privacy/signing claims aligned with Ika doc (not old IKA ZK copy) |
| Pitch deck | `extracted/Deck.html` refresh | Same alignment + MVP scope footnote |
| `/docs` public docs | `krypton-frontend-tanstack` | Policy schema reference, integration overview |
| Legal disclaimers | `krypton-gtm` | No "fund/returns/managed" language; risk disclosure on deposit |
| Waitlist / invite flow | `krypton-gtm` | Email + wallet allowlist; no open signup on mainnet |

**Blockers:** Trademark/brand review (working name Krypton). Update One-Pager §privacy row before any public marketing.

---

## 2. Go-To-Market (Private Beta)

| Workstream | Actions |
|------------|---------|
| **Cohort definition** | 20–50 wallets: power users + 2–3 DAO treasuries (small AUM) |
| **Invite mechanics** | On-chain allowlist PDA or backend-signed invite codes; cap vault count |
| **Positioning** | "Policy interpreter + constrained execution" — not AI hedge fund |
| **Channels** | Direct outreach, Solana builder Discords, DAO governance forums |
| **Success metrics** | Vaults created, policies committed, Level 2 approvals completed, zero constraint bypasses |
| **Support** | Discord/Telegram mod channel; runbook for `force_pause` incidents |
| **Comms plan** | No public mainnet announcement until 2 weeks stable devnet + audit findings addressed |

---

## 3. Protocol (Solana Mainnet)

### 3.1 Programs to deploy

| Program | Priority | Mainnet gate |
|---------|----------|--------------|
| `krypton_core` | P0 | Audited; upgrade authority multisig; immutable 2x leverage cap |
| `adapter_jupiter` | P0 | Swap-only V1; whitelisted mints |
| `adapter_kamino` | P1 | Lend deposit/withdraw |
| `adapter_drift` | P2 | Post-beta if perps in scope |
| `adapter_sanctum` | P1 | LST stake/unstake |
| Ika bridge module | P1 | If BTC/ETH in V1 universe |

### 3.2 Core instructions (V1 private beta)

- `create_vault`, `submit_policy`, `deposit`, `request_withdrawal`
- `propose_action`, `execute_action` (Levels 2–3 only for beta — **no Level 4** initially)
- `force_pause`, `update_constraint_state`
- Guardian multisig configured on all beta vaults

### 3.3 Constraint Engine (must pass before mainnet)

All 8 checks in PRD §5 enforced in `ExecutionRouter::execute_action`:

1. Leverage ≤ min(policy, 2x protocol max)
2. Position concentration
3. Correlated exposure (oracle-fed matrix)
4. Drawdown → auto-pause + de-risk-only
5. Protocol whitelist bitmap
6. Asset universe whitelist
7. Pool liquidity floor
8. Oracle staleness (120s default)

### 3.4 Security gates

- [ ] Third-party audit (krypton_core + adapter_jupiter minimum)
- [ ] Bug bounty (Immunefi or equivalent) — optional for private beta, required for public
- [ ] Upgrade authority: Squads multisig, timelock on upgrades
- [ ] Program IDs published; verified builds on explorer
- [ ] Agent session key: no withdrawal authority; rotatable via `PermissionAccount`

### 3.5 External integrations (mainnet addresses)

| Integration | Purpose |
|-------------|---------|
| Pyth | Price feeds for ConstraintState |
| Jupiter | Swap routing (Ultra/MEV-protected where available) |
| Kamino | Lending |
| Sanctum | LST |
| Helius | RPC + webhooks |
| Ika | dWallet signing for cross-chain legs |
| MetaDAO / futarchy | DAO governance — **defer for private beta** if cohort is personal vaults only |

---

## 4. AI Harness (Off-Chain)

| Component | Private beta scope |
|-----------|-------------------|
| Orchestrator | Per-vault cycle scheduler; devnet → mainnet RPC switch |
| Agents | Research, Strategy, Risk, Simulation, Execution, Monitoring |
| OpenRouter | API key in secrets; per-agent cost ceilings |
| Tool layer | MCP-compatible: quotes, `build_typed_action`, no raw tx bytes |
| Audit trail | Arweave upload + on-chain hashes in ExecutionLog |
| Permission | **Level 2 (suggest-only)** default for beta; Level 3 for opted-in wallets only |

**Mainnet gate:** Deterministic Risk post-check; malformed JSON → cycle abort (max 2 retries); `REJECTED_ONCHAIN` fed to next cycle context.

---

## 5. Frontend (TanStack Start SPA)

| Route | Private beta |
|-------|--------------|
| `/` | Marketing landing |
| `/app` | Vault list (auth-gated) |
| `/app/create` | Policy builder wizard |
| `/app/vault/:id` | Dashboard: ConstraintState bars, NAV, execution log |
| `/app/vault/:id/activity` | Pending actions (Level 2 approve/reject) |
| `/docs` | Schema + integration docs |

**Wallet:** `@solana/wallet-adapter` — Phantom, Solflare, Backpack.

**Mainnet gate:** Transaction previews before every signature; constraint violation copy per style guide.

---

## 6. Hosting & DevOps Architecture

```
                    ┌─────────────────────────────────────┐
                    │  Cloudflare (DNS, WAF, CDN)          │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  Traefik / reverse proxy (TLS)       │
                    └──────────────┬──────────────────────┘
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
    ┌──────▼──────┐        ┌───────▼───────┐      ┌───────▼────────┐
    │ TanStack    │        │ Orchestrator  │      │ krypton-sim-rs │
    │ Start (web) │        │ (Node/Rust)   │      │ (Rust)         │
    └─────────────┘        └───────┬───────┘      └────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  Helius RPC (mainnet)                │
                    │  + webhook indexer                   │
                    └──────────────┬──────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │  Solana mainnet (krypton_core)       │
                    └─────────────────────────────────────┘

    Keeper service ──► update_constraint_state (cron + Pyth)
    Secrets: Vault / Doppler — OpenRouter, agent session key, RPC keys
    Monitoring: Grafana + alerts on pause events, oracle staleness, cycle abort rate
```

| Environment | Purpose |
|-------------|---------|
| `localnet` | Anchor tests, adapter mocks |
| `devnet` | Full stack integration; fake USDC |
| `mainnet-beta` | Invite-only; real capital caps per vault |

**CI/CD:** GitHub Actions — `anchor test`, `cargo test`, frontend lint/build, Docker image push on tag.

---

## 7. Private Beta → Public Mainnet Checklist

### Must have (beta launch)

- [ ] `krypton_core` + `adapter_jupiter` audited
- [ ] Guardian multisig + `force_pause` tested
- [ ] Level 2 default; manual approval UX
- [ ] Pyth staleness revert tested
- [ ] Landing + disclaimers live
- [ ] Invite allowlist enforced
- [ ] ExecutionLog audit trail end-to-end
- [ ] Incident runbook documented

### Nice to have (beta)

- [ ] Kamino + Sanctum adapters
- [ ] Level 3 constrained auto for opt-in users
- [ ] Ika BTC leg (if in universe)

### Defer past beta

- DAO futarchy governance UI
- Strategy marketplace
- Tokenized vault shares
- Cross-chain beyond Ika-supported set
- Full confidential balances

---

## 8. Dependency Timeline

| Week | Milestone |
|------|-----------|
| 1–2 | Monorepo scaffold, krypton_core devnet, policy schema package |
| 3–4 | Jupiter adapter, Constraint Engine, keeper crank |
| 5–6 | Orchestrator + 3 agents, Level 2 flow |
| 7–8 | TanStack Start app, landing, policy builder |
| 9–10 | Devnet dogfood, audit kickoff |
| 11–12 | Audit remediation, mainnet deploy, private beta invites |

*Adjust based on team size and audit queue.*
