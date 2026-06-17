# Krypton
### A Programmable Capital Policy Engine for Solana
**One-Page Executive Overview**

---

**The shift:** On-chain vaults today hard-code a strategy into a contract or trust an opaque off-chain bot. Krypton replaces "trust the strategy" with "verify the policy." Users define an objective, a risk envelope, and an execution mandate — a **Capital Policy** — and a multi-agent AI pipeline generates, simulates, and (within hard on-chain constraints) executes strategies against it. Nothing about the strategy is permanent; everything about the policy is auditable.

---

### The Core Idea

A vault is not a strategy — it's an execution environment. The durable asset is the **Policy Layer**: composable, portable, auditable objects that describe *what* capital should do, not *how*. Strategies are ephemeral — generated fresh each cycle, simulated, scored, executed or discarded, and logged.

```
Capital  →  Policy  →  Agent Pipeline  →  Constrained Execution  →  Non-Custodial State  →  Repeat
```

### Why Now

- Agentic DeFi crossed from novelty to infrastructure in early 2026 — autonomous agents now account for a meaningful share of on-chain transaction volume, and dedicated DeFi-agent toolkits (wallet + protocol action layers) have matured enough to expose typed, bounded actions rather than raw transaction signing.
- Existing "AI vault" products are largely thin chat wrappers with no constraint layer, no simulation step, and no privacy guarantees — and several documented cases show narrowly-optimized agents finding unintended loopholes (reward hacking) when the only check is the model's own judgment.
- Solana's DeFi stack (Jupiter, Drift, Kamino, Sanctum, Pyth) is deep and composable enough to support real constrained execution across swaps, lending, perps, and liquid staking from a single policy object.

### What Makes Krypton Different

| | Typical "AI vault" | Krypton |
|---|---|---|
| Strategy | Fixed, hard-coded or opaque | Ephemeral, regenerated each cycle |
| Enforcement | Model's judgment | On-chain Constraint Engine — model cannot exceed policy even at full autonomy |
| Privacy | Positions fully public | Non-custodial signing via Ika threshold MPC; policy enforcement on-chain; proof-of-reserves & proof-of-performance disclosed via ZK |
| Governance | Token vote or none | Prediction-market-gated policy amendments (DAO mode) |
| Auditability | "Trust the operator" | Every cycle — proposed, simulated, executed or rejected — hashed and logged |

### Architecture at a Glance

**Primitives:** Capital · Policy · Constraint Engine · Strategy (ephemeral) · Execution (advisory or constrained-auto) · Privacy (IKA) · Governance (prediction markets)

**Agent pipeline:** Research → Strategy → Risk → Simulation → (Governance check, DAO mode) → Permission gate → Execution → Monitoring, with each agent routed through **OpenRouter** for model selection/failover and an AI capital action SDK for bounded, typed on-chain calls.

**Permission levels:** Read-only → Suggest-only → Constrained auto-execute → Fully autonomous. The contract-level Constraint Engine enforces identically at levels 3 and 4 — autonomy changes UX, not the safety boundary.

### Integration Surface (V1)

Swapping/routing: **Jupiter, Titan (DART)** · Lending/yield: **Kamino, Jupiter Lend, MarginFi-class venue** · Perps: **Drift** · Liquid staking: **Sanctum Infinity** · Oracles/data: **Pyth, Helius, DefiLlama/Birdeye** · Privacy: **IKA** · Governance: prediction-market venue (TBD) · Wallets: **Phantom, Solflare, Backpack**

### Positioning

Krypton is **not** an AI hedge fund. It does not promise returns or take discretionary decisions outside the user's signed policy. It is a **policy interpreter and constrained execution layer** — the policy is the product; the AI and the vault are how the policy gets carried out.

### MVP Scope

Anchor program (vault creation, deposits/withdrawals, share accounting, policy storage, permission management, on-chain constraint enforcement) · single orchestrator running three agents (Research, Strategy, Risk) plus simulation and execution services · execution limited to swap/lend/stake across a small audited protocol set · non-custodial signing via Ika threshold MPC; policy-enforced state · two governance modes (personal owner-controlled; DAO via prediction market) · policy builder + dashboard frontend.

### Roadmap Beyond V1

Strategy marketplace and copyable/tradable policies · third-party AI provider competition · agent reputation systems · institutional multi-sig vaults · cross-chain execution · tokenized vault shares · insurance modules · performance-based fee distribution to strategy designers.

---
*Working name: Krypton. Subject to change pending brand/trademark review.*
