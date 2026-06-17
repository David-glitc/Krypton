# Krypton — Product Requirements Document
**A Programmable Capital Policy Engine for Solana**
Version 1.0 · Draft for internal review

---

## 1. Overview

### 1.1 What Krypton Is

Krypton is infrastructure for deploying **Capital Policies** — machine-readable objectives, constraints, and permissions — that are interpreted by a multi-agent AI pipeline and executed on-chain through a constrained, auditable smart contract layer. A vault is not a strategy. A vault is an execution environment that holds capital, enforces a policy, and exposes encrypted state.

The protocol's job is not to promise superior returns. Its job is to provide:

- a programmable policy language,
- verifiable AI reasoning with an on-chain audit trail,
- constrained autonomous or advisory execution,
- confidential state via encrypted balances, allocations, and pending actions,
- and optional prediction-market-based governance for policy changes.

### 1.2 Problem Statement

Existing on-chain vault products (Kamino vaults, Drift vaults, Kvants-style quant vaults) hard-code a strategy into a contract or an off-chain bot. Changing the strategy means redeploying or trusting an opaque operator. Meanwhile, agentic crypto products in 2026 increasingly let an LLM "do DeFi for you," but mostly as a thin chat wrapper around manual transaction signing, with no constraint layer, no simulation step, and no privacy guarantees — exposing user positions and strategy logic to the entire chain.

Krypton separates these concerns explicitly:

| Layer | Owns | Does not own |
|---|---|---|
| Capital Primitive | custody, shares, accounting | intelligence |
| Policy Primitive | objectives, constraints, permissions | execution |
| Agent Pipeline | research, strategy generation, risk scoring, simulation | custody, final authority beyond granted permission level |
| Execution Primitive | routing, signing, settlement | strategy invention |
| Privacy Primitive | encrypted state, selective disclosure | accounting logic |
| Governance Primitive | policy amendment via prediction markets | day-to-day execution |

### 1.3 Target Users

1. **Individual power users** who want a personal, policy-bound autonomous vault (e.g., "medium risk, SOL/ETH/stables, max 12% drawdown, advisory mode").
2. **DAOs and treasuries** that want programmable, auditable treasury management with prediction-market-gated policy changes instead of low-turnout token votes.
3. **Strategy designers / quant builders** (V2) who want to publish composable, tradable Capital Policies without writing smart contracts.
4. **Institutions** (V2) requiring multi-signature vaults, confidential positions, and compliance-friendly audit proofs.

### 1.4 Non-Goals (V1)

- Krypton is not a hedge fund, asset manager, or fund administrator. It does not take discretionary custody decisions outside the user-defined policy and permission level.
- Krypton does not provide leverage beyond what the user's policy explicitly allows, and V1 caps leverage at 2x regardless of policy.
- Krypton V1 does not support cross-chain execution, tokenized vault shares, or a strategy marketplace — these are V2.
- Krypton does not claim regulatory status as an investment adviser; all framing, UI copy, and legal documentation must avoid "managed," "fund," "returns guaranteed," or similar language.

---

## 2. Core Abstractions

### 2.1 Capital Policy (the primitive)

A Capital Policy is a versioned, signed, machine-readable document attached to a vault. It is stored as structured on-chain account data (not as code) plus an off-chain canonical JSON representation hashed and referenced on-chain.

**Policy schema (canonical fields):**

```yaml
policy_version: 1
objective:
  type: "maximize_risk_adjusted_return" # enum
  benchmark: "SOL_USD" # optional
universe:
  assets: ["SOL", "ETH", "BTC", "USDC", "USDT"]
  protocols_allowed: ["jupiter", "drift", "kamino", "sanctum", "marginfi"]
risk:
  profile: "medium" # low | medium | high | custom
  max_drawdown_pct: 12
  max_leverage: 2.0
  max_position_pct: 35
  max_correlated_exposure_pct: 60
liquidity:
  min_pool_liquidity_usd: 5000000
time_horizon_days: 90
allowed_actions: ["swap", "stake", "lend", "borrow", "provide_liquidity"]
forbidden:
  - "leverage_above_policy_max"
  - "unverified_protocols"
  - "memecoins"
execution:
  mode: "advisory" # advisory | constrained_auto | full_auto
  rebalance_frequency: "daily" # event_driven | hourly | daily | weekly
governance:
  mode: "owner" # owner | dao_prediction_market
privacy:
  level: "standard" # standard | full
  disclose: ["proof_of_reserves", "proof_of_performance", "fee_accrual", "vault_nav"]
fees:
  management_bps: 0
  performance_bps: 1000
  hurdle_rate_pct: 0
emergency:
  pause_authority: ["owner_wallet", "protocol_guardian_multisig"]
  auto_pause_on:
    - "drawdown_exceeds_max"
    - "oracle_staleness_seconds_gt_120"
```

**Policy lifecycle:**

1. **Draft** — user constructs policy in the UI policy builder (form-based, not raw YAML, though raw YAML/JSON editing is exposed for advanced users).
2. **Validate** — Constraint Engine statically validates the policy against protocol-wide hard limits (e.g., 2x leverage ceiling, asset/protocol whitelist).
3. **Sign & Commit** — user signs a transaction that hashes the canonical policy JSON (stored on Arweave/IPFS via Shadow Drive or similar) and writes the hash + summary fields to the on-chain `PolicyAccount`.
4. **Active** — Agent Pipeline begins operating against the policy.
5. **Amend** — owner-mode: direct re-sign of new policy version. DAO mode: amendment must pass through the Governance Primitive (prediction market).
6. **Archive** — superseded policy versions remain queryable on-chain for audit purposes; never deleted.

### 2.2 Vault (the execution environment)

```
Vault
├── CapitalAccount     (assets, shares, withdrawal queue)
├── PolicyAccount      (active policy hash + summary fields)
├── ConstraintState    (live exposure, drawdown tracker, leverage tracker)
├── PermissionAccount  (execution mode, agent authority level)
├── EncryptedState     (IKA-encrypted balances/positions, see §6)
├── ExecutionLog       (append-only record of cycles, hashed)
└── GovernanceAccount  (optional; DAO mode only)
```

### 2.3 Strategies Are Ephemeral

No strategy is stored as a persistent object. Every execution cycle, the Agent Pipeline generates a candidate plan, simulates it, scores it, and either executes it (per permission level) or surfaces it for approval. Executed and rejected plans are both written to the `ExecutionLog` (hashed off-chain payload, on-chain pointer) for auditability — this is the core trust mechanism replacing "trust the manager."

---

## 3. Agent Pipeline Architecture

### 3.1 Pipeline Flow

```
Policy + Capital State
        │
        ▼
 [Research Agent] ──► hypotheses (market data, on-chain activity, governance signals)
        │
        ▼
 [Strategy Agent] ──► candidate allocation(s)
        │
        ▼
 [Risk Agent] ──► pass/reject vs. ConstraintState + PolicyAccount
        │
        ▼
 [Simulation Agent] ──► historical / forward / Monte Carlo / stress scores
        │
        ▼
   Composite Score
        │
        ├─► below threshold ──► discard, log, end cycle
        │
        └─► above threshold
                │
                ▼
        [Governance Check] (DAO mode only — see §7)
                │
                ▼
        Permission Level Gate (see §3.3)
                │
        ┌───────┴────────┐
        ▼                ▼
  Advisory: surface   Auto: [Execution Agent]
  to user, await       signs & submits
  signature                  │
        │                     ▼
        └──────────► [Monitoring Agent] ──► repeat next cycle
```

### 3.2 Agent Roles & Model Assignment

Krypton uses **OpenRouter** as the LLM gateway, enabling per-agent model selection, automatic provider failover, and cost-tiered routing (`:floor` suffix for non-critical agents, pinned high-reasoning models for Risk and Strategy agents). No single model runs the whole pipeline — each agent is a distinct call with a narrow scope, narrow tool access, and a structured-output (JSON) contract.

| Agent | Responsibility | Inputs | Output contract | Suggested model tier |
|---|---|---|---|---|
| **Research Agent** | Synthesize market data, on-chain flows, governance/news/social signals into ranked hypotheses | Pyth/Birdeye price feeds, DefiLlama TVL, on-chain activity (Helius), governance forum scrapes | `{hypotheses: [{thesis, confidence, supporting_evidence, time_horizon}]}` | mid-tier, high context (e.g. long-context model via `:floor`) |
| **Strategy Agent** | Convert top hypotheses into 1–3 candidate allocations within policy universe | Hypotheses, current portfolio state, policy `universe` + `allowed_actions` | `{candidates: [{allocation: {asset: pct}, actions: [...], rationale}]}` | high-reasoning tier |
| **Risk Agent** | Reject candidates violating policy or protocol-wide constraints | Candidates, `PolicyAccount`, `ConstraintState`, live oracle data | `{candidate_id, verdict: pass\|reject, violations: [...], adjusted_allocation?}` | high-reasoning tier, deterministic checks layered on top (non-LLM) |
| **Simulation Agent** | Score surviving candidates via backtests + Monte Carlo + stress scenarios | Candidate allocation, historical price series, volatility surfaces | `{candidate_id, expected_return, expected_drawdown, var_95, stress_results: [...], composite_score}` | hybrid: numerical engine (Python/Rust) + LLM narrative summary |
| **Execution Agent** | Choose routing, timing, batching, slippage tolerance, privacy path for the winning candidate | Winning candidate, DEX/aggregator quotes (Jupiter, Titan DART), gas state | `{transactions: [...], routing_rationale, expected_slippage}` | low-cost tier; deterministic routing logic dominant, LLM used for rationale/explanation only |
| **Monitoring Agent** | Continuous post-execution checks: drawdown, oracle staleness, liquidation proximity, protocol incident feeds | `ExecutionLog`, live positions (encrypted, decrypted in TEE/MPC context), oracle health | `{alerts: [...], auto_pause_triggered: bool}` | low-cost tier, high frequency, runs every block/interval rather than per cycle |

### 3.3 Permission Levels (enforced on-chain)

| Level | Name | Agent authority | On-chain enforcement |
|---|---|---|---|
| 1 | Read-only | Agents may research and produce reports; no transactions proposed | `PermissionAccount.max_level = 1` blocks all `propose_action` calls from agent signer |
| 2 | Suggest-only | Full pipeline runs; winning candidates surface in UI for manual signature | Agent signer cannot call `execute_action`; only `propose_action` |
| 3 | Constrained auto-execute | Agents execute within hard policy constraints without per-action approval | `execute_action` permitted only if `ConstraintState` checks pass on-chain (leverage, drawdown, asset whitelist re-verified in-contract, not just by the agent) |
| 4 | Fully autonomous | As level 3, with relaxed UI friction (no per-cycle notification required) but **same on-chain constraint checks** — level 4 changes UX, not contract-level enforcement | Identical contract path to level 3; the distinction is UX/notification only, by design, so autonomy never bypasses constraints |

**Critical design principle:** the smart contract — not the agent, not the off-chain orchestrator — is the final constraint enforcer. The Risk Agent's verdict is advisory to the pipeline; the on-chain `ConstraintState` check is the actual gate. This means a compromised or hallucinating LLM cannot exceed policy limits even at Level 4.

### 3.4 LLM Infrastructure Detail

- **Gateway:** OpenRouter, OpenAI-compatible API, single key, provider failover enabled by default.
- **Model fallback chains** configured per agent (e.g., Strategy Agent: primary high-reasoning model → secondary equivalent-tier model on timeout/error → tertiary mid-tier on repeated failure, never silently downgrading to a model below a configured minimum capability floor).
- **Cost ceilings:** `max_price` per agent role, configurable by vault tier (personal vaults default to a conservative daily LLM spend cap funded from performance fees; DAO vaults can configure higher ceilings).
- **Structured outputs:** every agent call enforces JSON schema via response format constraints; malformed outputs trigger automatic retry with schema-violation feedback appended, max 2 retries, then cycle aborts and logs failure (no silent fallback to unstructured reasoning for execution-relevant agents).
- **Determinism for audit:** Research/Strategy/Risk/Simulation agent prompts, model IDs, and raw responses are hashed and written to `ExecutionLog` for every cycle (full payload stored off-chain on Arweave, hash on-chain) — this is the "verifiable AI reasoning" claim made concrete.
- **AI capital SDK layer:** in addition to OpenRouter for reasoning, Krypton integrates an on-chain execution SDK (e.g., a WAIaaS-style wallet/DeFi action layer or equivalent self-hosted MCP toolset) that exposes typed, policy-aware tool calls (`swap`, `lend`, `stake`, `provide_liquidity`, `open_perp`, `close_perp`) to the Execution Agent — the LLM never constructs raw transactions; it selects from a constrained tool set whose parameters are independently bounds-checked.

---

## 4. Smart Contract Architecture (Solana / Anchor)

### 4.1 Program Accounts

```
Program: krypton_core

PolicyAccount {
  vault: Pubkey
  version: u32
  policy_hash: [u8; 32]        // hash of canonical off-chain JSON
  objective_type: u8            // enum
  risk_profile: u8
  max_drawdown_bps: u16
  max_leverage_bps: u16         // hard-capped at 20000 (2x) protocol-wide
  max_position_bps: u16
  allowed_protocols_bitmap: u64
  execution_mode: u8            // 1-4
  governance_mode: u8           // owner | dao
  privacy_level: u8
  created_at: i64
  updated_at: i64
}

CapitalAccount {
  vault: Pubkey
  total_shares: u128
  deposit_mints: Vec<Pubkey>    // allowed deposit assets (capped list)
  encrypted_balance_handle: [u8; 32] // pointer into IKA encrypted state
  withdrawal_queue: Vec<WithdrawalRequest>
  fee_accrued: u64
}

ConstraintState {
  vault: Pubkey
  current_drawdown_bps: u16
  current_leverage_bps: u16
  current_position_concentration_bps: u16
  last_oracle_update: i64
  paused: bool
  pause_reason: u8
}

PermissionAccount {
  vault: Pubkey
  owner: Pubkey
  agent_signer: Pubkey          // PDA controlled by off-chain orchestrator's session key
  max_level: u8
  guardian_multisig: Pubkey     // can force-pause regardless of owner
}

ExecutionLog (ring buffer / append via PDA + Arweave pointer) {
  vault: Pubkey
  cycle_id: u64
  timestamp: i64
  candidate_hash: [u8; 32]
  decision: u8                  // executed | rejected | advisory_pending | governance_pending
  tx_signatures: Vec<Signature>
  off_chain_pointer: String     // Arweave/Shadow Drive URI
}

GovernanceAccount (DAO vaults only) {
  vault: Pubkey
  active_proposal: Option<ProposalState>
  prediction_market_address: Pubkey
}
```

### 4.2 Core Instructions

| Instruction | Caller | Effect |
|---|---|---|
| `create_vault` | user | initializes CapitalAccount, PermissionAccount with defaults |
| `submit_policy` | owner (or post-governance for DAO) | validates against protocol-wide caps, writes PolicyAccount, increments version |
| `deposit` | user | mints shares, updates CapitalAccount, updates EncryptedState |
| `request_withdrawal` | user | enqueues withdrawal, subject to liquidity check |
| `propose_action` | agent_signer | writes candidate to ExecutionLog as `advisory_pending`; emits event for UI |
| `execute_action` | agent_signer (levels 3–4) or owner (level 2 approval) | re-validates against ConstraintState **in-contract**; on pass, executes via CPI to integrated protocol adapters; updates ConstraintState; writes `executed` to ExecutionLog |
| `force_pause` | guardian_multisig or owner | sets `paused = true`; blocks `execute_action` |
| `update_constraint_state` | oracle crank / keeper | periodic refresh of drawdown/leverage/concentration metrics from live positions |
| `open_governance_proposal` | DAO member (per DAO config) | creates prediction market for proposed policy change (§7) |
| `finalize_governance` | anyone (permissionless crank, post-market-resolution) | applies winning policy if market resolved in favor |

### 4.3 Protocol Adapters (CPI targets)

Each integrated protocol has a thin adapter program/module translating Krypton's typed actions into protocol-specific instructions:

- `adapter_jupiter` — swaps, routed via Jupiter aggregator
- `adapter_drift` — spot margin, perps, vault deposits
- `adapter_kamino` — lending markets, automated vault deposits, whitelisted reserves
- `adapter_sanctum` — LST minting/redemption via Infinity router
- `adapter_marginfi` (or similar) — additional lending venue for diversification
- `adapter_titan` — DART routing for best-execution swaps

Adapters are individually whitelisted in `PolicyAccount.allowed_protocols_bitmap`; adding a new adapter requires a protocol governance action (separate from individual vault policy governance), since adapters are shared infrastructure.

---

## 5. Constraint Engine (On-Chain Enforcement Detail)

The Constraint Engine is **not an agent** — it is deterministic on-chain logic plus a keeper-fed `ConstraintState`. It is the layer that makes "AI cannot violate hard rules" a contract-level guarantee rather than a prompt-level one.

**Enforced at `execute_action` time:**

1. **Leverage check** — proposed action's resulting leverage ≤ `min(policy.max_leverage_bps, PROTOCOL_MAX_LEVERAGE_BPS)` (protocol max = 2x, immutable in V1).
2. **Position concentration check** — resulting single-asset exposure ≤ `policy.max_position_bps`.
3. **Correlated exposure check** — resulting exposure to assets in the same correlation bucket (maintained via an on-chain or oracle-fed correlation matrix, refreshed periodically) ≤ `policy.max_correlated_exposure_bps`.
4. **Drawdown check** — if `ConstraintState.current_drawdown_bps >= policy.max_drawdown_bps`, all `execute_action` calls except de-risking actions (defined as: net reduction in leverage or net increase in stablecoin allocation) are blocked, and `paused = true` is set automatically.
5. **Protocol whitelist check** — target adapter must be set in `allowed_protocols_bitmap`.
6. **Asset whitelist check** — all assets touched by the action must be in `policy.universe.assets`.
7. **Liquidity floor check** — for LP/lending actions, target pool TVL/liquidity (fed via oracle/keeper) ≥ `policy.liquidity.min_pool_liquidity_usd`.
8. **Oracle staleness check** — if `now - ConstraintState.last_oracle_update > MAX_STALENESS_SECONDS` (protocol-wide constant, e.g. 120s), `execute_action` reverts.

**Failure mode:** any failed check reverts the transaction, logs the rejection reason to `ExecutionLog`, and the off-chain orchestrator marks the cycle as `rejected_onchain` — feeding back into the Research Agent's context for the next cycle (so repeated rejections inform future hypothesis generation).

---

## 6. Privacy Primitive (IKA Integration)

### 6.1 What Is Encrypted

| Data | Encrypted? | Disclosure |
|---|---|---|
| Individual deposit/withdrawal amounts | Yes | Never disclosed individually |
| Per-asset position breakdown | Yes | Aggregate NAV disclosed; breakdown hidden |
| Pending action details (pre-execution) | Yes | Disclosed only after execution, and only as settlement record |
| AI reasoning detail (full agent transcripts) | Yes (stored encrypted off-chain; hash on-chain) | Owner can decrypt; aggregate "decision summary" optionally disclosed |
| Vault NAV (total value) | No | Public |
| Proof of reserves | No (cryptographic proof, not raw data) | Public |
| Proof of performance (return %, not absolute $ if user opts for full privacy) | Configurable | Public unless `privacy.level = full` |
| Fees accrued | No | Public |
| Settlement transaction hashes | No (on-chain by nature) | Public — but **what** was swapped for **what amount** within a batched/private execution path can be obscured via the privacy execution path |

### 6.2 Mechanism

- Encrypted state managed via IKA's MPC/threshold-encryption network: balances and position vectors are stored as ciphertext commitments on Solana, with decryption keys split across an IKA threshold network such that no single party (including Krypton's own infrastructure) can unilaterally decrypt user positions.
- **Proof of reserves**: zero-knowledge range proofs confirm `sum(encrypted_balances) == CapitalAccount.total_value` without revealing individual balances — verifiable on-chain.
- **Proof of performance**: a ZK proof attests that the disclosed return % corresponds to the encrypted position history, without revealing the trades that produced it.
- **Execution privacy path**: where supported by the underlying DEX/aggregator, batched or shielded routing is used so that the specific allocation change is not trivially inferable from a single isolated transaction (e.g., batching with other vaults' rebalances at the orchestrator level, subject to each vault's `privacy.level`).

### 6.3 Privacy Levels

- `standard` (default): balances/positions encrypted; NAV, proof-of-reserves, proof-of-performance, fees public.
- `full`: as above, plus absolute NAV is also hidden (only relative performance % disclosed), and execution batching is mandatory (may introduce minor execution delay, disclosed to user in UI).

---

## 7. Governance Primitive (Prediction-Market Policy Amendments)

**Applies to DAO-mode vaults only.** Personal vaults use direct owner re-signature for policy amendments (no governance overhead).

### 7.1 Flow

1. A DAO member proposes a policy amendment (e.g., "increase ETH allocation ceiling from 30% to 45%").
2. `open_governance_proposal` creates a binary prediction market with a falsifiable, time-boxed question derived from the proposal, e.g.: *"Will the proposed policy amendment improve 30-day risk-adjusted return (Sharpe) relative to the current policy, as measured by the Simulation Agent's backtest on the amendment vs. control?"*
3. Market runs for a configured period (default 7 days). DAO members and external participants can take positions.
4. At resolution, the market outcome is determined by a hybrid oracle: (a) Simulation Agent runs a controlled backtest comparing current vs. proposed policy over the realized window, producing a quantitative Sharpe comparison; (b) this result is the resolution criterion, published with full methodology and raw data hash for challengeability; (c) a dispute window (48h) allows challenges, escalating to a designated arbiter set (multisig of DAO-elected reviewers) only if disputed.
5. `finalize_governance` is a permissionless crank: if the market resolved "yes" (amendment improves risk-adjusted return), the proposed `PolicyAccount` version is activated. If "no," the proposal is archived.

### 7.2 Why Prediction Markets, Not Votes

Token votes measure sentiment and voting power, not expected outcomes, and suffer from low turnout and plutocratic skew. A prediction market on a falsifiable, simulation-backed question aligns incentives toward *being right about the policy's effect*, not toward *preferring* a policy for unrelated reasons. This is explicitly framed in all user-facing copy as "decision markets," not "voting," to avoid conflation with token-weighted governance.

---

## 8. Frontend / Application Layer

### 8.1 Core User Flows

1. **Vault creation** — wizard: name vault → select governance mode (personal / DAO) → policy builder (form UI mapping to YAML schema, with live constraint validation) → review summary → sign `create_vault` + `submit_policy`.
2. **Deposit** — connect wallet (Phantom, Solflare, Backpack via wallet-adapter) → select asset + amount → sign `deposit`.
3. **Policy dashboard** — current policy summary, live `ConstraintState` (drawdown, leverage, concentration as progress bars relative to limits), encrypted NAV chart (showing only what `privacy.level` permits), execution log feed.
4. **Pending action review** (Levels 1–2) — card per `propose_action`: action description, agent rationale (plain-language summary generated from agent transcript), simulation results (expected return/drawdown/VaR), Approve / Reject / Modify-and-approve.
5. **Auto-execution feed** (Levels 3–4) — read-only stream of `executed` actions with rationale, with the same constraint-bar visualization updating live.
6. **Withdrawal** — request → queue position (if liquidity-constrained) → claim.
7. **Governance** (DAO vaults) — proposal list, prediction market positions UI, resolution history.

### 8.2 Information Architecture

```
/                 → marketing/landing
/app              → vault list (user's vaults + discoverable DAO vaults if public)
/app/create       → policy builder wizard
/app/vault/:id           → dashboard
/app/vault/:id/policy    → policy detail + amendment (owner) or proposal list (DAO)
/app/vault/:id/activity  → execution log, pending actions
/app/vault/:id/governance (DAO only)
/docs             → policy schema reference, integration docs
```

### 8.3 Tech Stack (suggested)

- **Frontend:** Next.js 15 (App Router), Tailwind, wallet-adapter (Phantom/Solflare/Backpack), Recharts for NAV/exposure visualization.
- **Orchestrator backend:** Node/TypeScript or Rust service running the Agent Pipeline; calls OpenRouter for LLM agents, calls protocol adapter SDKs for execution-side tool calls; holds the `agent_signer` session key (scoped, rotatable, never the user's primary key).
- **Numerical/simulation engine:** Python (NumPy/pandas) or Rust microservice for Monte Carlo and historical backtests, called by the Simulation Agent step.
- **Indexing:** Helius or similar for on-chain activity feeds; DefiLlama/Birdeye APIs for TVL/price context feeding the Research Agent.
- **Storage:** Arweave or Shadow Drive for off-chain policy JSON, execution transcripts, and simulation artifacts; hashes anchored on-chain.

---

## 9. Integration Touchpoints

### 9.1 LLM / Reasoning Layer

- **OpenRouter** — primary gateway for all agent reasoning calls; per-agent model + fallback chain configuration; cost ceilings per vault tier; structured-output enforcement.
- **AI Capital / DeFi action SDK** — typed tool layer (e.g. WAIaaS-style or equivalent self-hosted MCP toolset) exposing `swap`, `lend`, `borrow`, `stake`, `provide_liquidity`, `open_perp`, `close_perp`, `unstake` as bounded, policy-aware functions callable by the Execution Agent — decouples "LLM picks an action" from "raw transaction construction."

### 9.2 Swapping / Routing

- **Jupiter** (Ultra Mode, MEV-protected routing) — primary aggregator for spot swaps.
- **Titan Exchange (DART)** — secondary/competing router for best-execution price priority; Execution Agent compares quotes across both before selecting a route.

### 9.3 Lending & Yield Protocols

- **Kamino** — lending markets, whitelisted-reserve vaults for conservative yield legs.
- **MarginFi or equivalent** — secondary lending venue for diversification away from single-protocol concentration risk.
- **Jupiter Lend** — additional lending venue, especially relevant given consolidated TVL share.

### 9.4 Perpetuals / Derivatives

- **Drift Protocol** — perps and spot margin; cross-collateral; vault-native integration for delta-neutral or hedged legs within policy bounds (max 2x leverage enforced at the Constraint Engine regardless of Drift's native leverage limits).

### 9.5 Liquid Staking / Restaking

- **Sanctum (Infinity router)** — LST minting/redemption and LST-to-LST swaps for yield-bearing SOL exposure within the `universe.assets` allowlist (e.g., JitoSOL, JupSOL).
- Restaking integrations (V2): evaluate as the Solana restaking landscape matures; V1 treats LSTs as a yield-enhancement layer on SOL exposure, not a separate asset class requiring distinct policy fields.

### 9.6 Oracles & Data

- **Pyth** — primary price oracle for all `ConstraintState` calculations (leverage, drawdown, concentration) and for `update_constraint_state` keeper cranks.
- **Helius** — on-chain activity indexing for Research Agent inputs and Monitoring Agent incident detection.
- **DefiLlama / Birdeye** — TVL, liquidity-floor checks (`liquidity.min_pool_liquidity_usd`), and broad market context.

### 9.7 Privacy

- **IKA** — threshold-encryption network for `EncryptedState`; ZK proof generation/verification for proof-of-reserves and proof-of-performance.

### 9.8 Prediction Markets (Governance)

- Integration with an on-chain prediction market protocol (e.g., a Solana-native market-maker or order-book prediction market venue) for the Governance Primitive's decision markets — selection criteria: binary market support, fast resolution windows, sufficient liquidity for DAO-scale proposals, and a programmatic resolution interface compatible with `finalize_governance`'s permissionless crank model.

### 9.9 Wallets

- **Phantom, Solflare, Backpack** via standard Solana wallet-adapter for user-facing signing (deposits, withdrawals, policy submission, Level 2 approvals).
- A separate, scoped **agent session key** (not the user's wallet) signs `propose_action`/`execute_action` at Levels 2–4; this key has no withdrawal authority and is rotatable by the owner at any time via `PermissionAccount`.

---

## 10. Security & Risk Considerations

- **Protocol-wide leverage ceiling (2x)** is immutable in V1 and enforced at the contract level independent of any individual policy — a compromised policy cannot exceed this.
- **Guardian multisig** can `force_pause` any vault regardless of owner/agent state — addresses scenarios like oracle manipulation, adapter exploits, or detected agent misbehavior (e.g., reward-hacking patterns described in recent agentic-DeFi research, where an agent optimizing for a narrow metric finds unintended loopholes).
- **Agent session key compromise** — scoped permissions (no withdrawal rights) limit blast radius; owner rotation is a single transaction.
- **Adapter risk** — each protocol adapter is independently auditable and individually whitelistable/de-whitelistable at the protocol governance level, isolating exposure if a single integrated protocol (e.g., a lending market) is exploited.
- **Oracle staleness** — hard revert on `execute_action` if Pyth feed is stale beyond threshold; prevents stale-price exploitation during outages.
- **MEV/frontrunning** — routed through MEV-protected paths (Jupiter Ultra) where available; privacy execution path further reduces front-running surface for larger rebalances.
- **Simulation-governance dependency** — the Governance Primitive's reliance on Simulation Agent backtests for market resolution introduces a "garbage in, garbage out" risk; mitigated via published methodology, raw-data hashing, and the dispute/arbiter escalation path.

---

## 11. Open Items / Dependencies

- Finalize selection of prediction market venue for §7 (governance) integration.
- Confirm IKA SDK maturity for Solana-native threshold encryption at vault scale; identify fallback privacy approach (e.g., TEE-based execution with attestation) if IKA integration timeline slips.
- Determine correlation matrix source/refresh cadence for `max_correlated_exposure_bps` checks.
- Define the canonical "decision summary" generation step (agent-transcript → plain-language rationale) — likely a dedicated lightweight summarization call, separate from the Strategy/Risk agents, to avoid mixing execution-relevant reasoning with user-facing explanation.
- Decide on V1 protocol whitelist exact composition (Section 9 lists candidates; final list subject to audit availability).
