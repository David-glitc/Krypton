# Krypton — Platform Completion TODO

**Audited: 2026-06-18**

---

## 🔴 BLOCKING — Core functionality missing

### 1. Ika dWallet CPI Integration
- **Status**: Commented-out placeholder at `programs/krypton_core/src/lib.rs:112-124`
- **What's missing**: Actual CPI call to `ika_dwallet::cpi::sign_action()`
- **What needs to happen**:
  - Add Ika program ID to contract config
  - Implement `execute_action` with real Ika CPI
  - Add dWallet PDA derivation
  - Test on devnet with Ika's program
- **Impact**: Without this, vaults can't execute cross-chain actions or use threshold signing. The "non-custodial" claim is incomplete.

### 2. On-Chain Program Deployment
- **Status**: Program builds locally but not deployed to devnet/mainnet
- **What needs to happen**:
  - Deploy `krypton_core` to devnet
  - Initialize program
  - Verify all instructions work
- **Impact**: No real vaults can exist on-chain

### 3. Real Vault Data Fetching
- **Status**: `vault-data.ts` exists but all RPC calls fail → falls back to mock
- **What needs to happen**:
  - Deploy program first (see #2)
  - Update RPC calls with correct IDL
  - Handle account parsing for Vault, Policy, ConstraintState
- **Impact**: All vault pages show fake data

### 4. Adapter CPI (Jupiter/Drift/Sanctum)
- **Status**: `execute_action` has no adapter calls
- **What needs to happen**:
  - Implement Jupiter swap CPI
  - Implement lending CPI (Kamino/MarginFi)
  - Implement staking CPI (Sanctum)
- **Impact**: Vaults can't actually trade, lend, or stake

---

## 🟠 HIGH — Incorrect results or insecure

### 5. Live Oracle Price Feeds
- **Status**: Constraint checking uses static/mock values
- **What needs to happen**:
  - Integrate Pyth push oracles for SOL/ETH/BTC/USDC
  - Add staleness checks (`MAX_STALENESS_SECONDS`)
  - Update `ConstraintState.last_oracle_update` on each check
- **Impact**: Constraints can't be properly enforced without live pricing

### 6. VaultGoal Account On-Chain
- **Status**: `VaultGoal` struct exists in contract but never created
- **What needs to happen**:
  - Create `VaultGoal` PDA during `create_vault` or `submit_policy`
  - Store target_type, target_value, time_horizon_days
- **Impact**: Strategy Agent can't optimize toward user's goal

### 7. Activity Feed — Real Event Querying
- **Status**: `DEMO_ACTIVITY` hardcoded array
- **What needs to happen**:
  - Query `ActionExecuted` events from the program
  - Parse transaction logs for execution history
  - Subscribe to real-time events via WebSocket
- **Impact**: Activity page shows fake history

### 8. Withdraw / Amend Policy Wiring
- **Status**: Contract has instructions, frontend has no UI
- **What needs to happen**:
  - Add withdraw form to vault dashboard
  - Add policy amendment flow
  - Both need LazorKit signature flow
- **Impact**: Users can't withdraw or update policy

---

## 🟡 MEDIUM — Works in demo, not production

### 9. NAV History — Real Data
- **Status**: 7 hardcoded data points in `NAV_HISTORY`
- **What needs to happen**:
  - Track NAV changes from on-chain events
  - Store historical NAV per vault
  - Query from chain or indexer
- **Impact**: Chart shows fake growth

### 10. Telemetry Engine — Live Position Data
- **Status**: `TelemetryState.positions` always empty
- **What needs to happen**:
  - Parse Helius webhooks for position updates
  - Or fetch position data from program accounts
  - Feed real data into `checkThresholds()`
- **Impact**: Pre-breach alerts can't fire

### 11. Agent Pipeline (Research/Strategy/Simulation/Risk)
- **Status**: No orchestrator service running
- **What needs to happen**:
  - Deploy `services/orchestrator` to server
  - Implement Research Agent (market data)
  - Implement Strategy Agent (portfolio optimization)
  - Implement Simulation Agent (Monte Carlo)
  - Implement Risk Agent (constraint pre-check)
- **Impact**: No autonomous execution — vaults are static

### 12. Simulation Engine (`krypton-sim-rs`)
- **Status**: Rust service not built/deployed
- **What needs to happen**:
  - Implement Monte Carlo simulation
  - Implement backtesting corpus
  - Connect to Policy Compiler's feasibility check
- **Impact**: Feasibility bands are static, not data-driven

---

## 🟢 LOW — Nice-to-have

### 13. Gasless Onboarding
- Sponsored transactions for `create_vault` below deposit threshold

### 14. Futarchy Governance
- DAO vault policy amendment via conditional markets

### 15. Progress UI
- "On pace for 3.2x of your 5x target at week 6 of 10"

### 16. Protocol Incident Feed
- Drift/Kamino/Sanctum pause detection

### 17. Confidential Balances (deferred)
- Position-level privacy — explicitly NOT in V1 scope

---

## Summary

| Priority | Count | Key Blocker |
|----------|-------|-------------|
| 🔴 BLOCKING | 4 | Ika CPI + program deployment |
| 🟠 HIGH | 4 | Oracles + adapters + events |
| 🟡 MEDIUM | 4 | Agent pipeline + simulation |
| 🟢 LOW | 4 | Gasless, governance, progress UI |

**The single biggest gap**: Ika dWallet CPI integration. Everything else depends on it.
