---
name: krypton-protocol-anchor
description: >-
  Builds Krypton Solana on-chain programs with Anchor Rust — krypton_core,
  ExecutionRouter, Constraint Engine, protocol adapters (Jupiter, Kamino,
  Drift, Sanctum), and Ika dWallet CPI. Use when writing Solana programs,
  TypedAction, PolicyAccount, execute_action, or adapter CPI for Krypton.
---

# Krypton Protocol (Anchor)

## Program topology

```
krypton_core
├── PolicyAccount, CapitalAccount, ConstraintState
├── PermissionAccount, ExecutionLog, GovernanceAccount (DAO later)
├── ExecutionRouter (single entry for execute_action)
├── constraint_engine (deterministic — NOT an LLM)
├── adapter_dispatch (CPI to whitelisted adapters)
└── ika_bridge (cross-chain dWallet signing requests)
```

Reference: `PRD (1).md` §4–5, `Execution-Architecture-Ika.md` §1–4.

## TypedAction (agent ↔ contract boundary)

```rust
pub struct TypedAction {
    pub vault: Pubkey,
    pub cycle_id: u64,
    pub action_type: ActionType,
    pub asset_in: AssetRef,
    pub asset_out: AssetRef,
    pub target: ExecutionTarget,
    pub max_slippage_bps: u16,
    pub expiry_slot: u64,
    pub simulation_ref: [u8; 32],
}
```

LLMs never emit raw transaction bytes. Execution Agent calls `build_typed_action` off-chain; on-chain re-validates.

## ExecutionRouter flow

1. `constraint_engine::validate` — all 8 PRD §5 checks
2. Branch: `SolanaAdapter` CPI **or** `IkaDWallet` signature request
3. `constraint_engine::update_post_execution`
4. `execution_log::append`

## Constraint checks (hard revert)

| # | Check |
|---|-------|
| 1 | Leverage ≤ min(policy.max_leverage, 20000 bps = 2x) |
| 2 | Position concentration ≤ policy.max_position_bps |
| 3 | Correlated exposure ≤ policy.max_correlated_exposure_bps |
| 4 | Drawdown ≥ max → pause; de-risk actions only |
| 5 | Adapter in allowed_protocols_bitmap |
| 6 | Assets in policy universe |
| 7 | Pool liquidity ≥ policy.min_pool_liquidity_usd |
| 8 | Oracle age ≤ MAX_STALENESS_SECONDS (120) |

## Protocol adapters (V1 private beta)

| Adapter | Actions | Beta priority |
|---------|---------|---------------|
| `adapter_jupiter` | swap | P0 |
| `adapter_kamino` | lend, withdraw | P1 |
| `adapter_sanctum` | stake LST, unstake | P1 |
| `adapter_drift` | perps, margin | P2 (post-beta) |

Each adapter implements:

```rust
pub trait ProtocolAdapter {
    fn validate_action(&self, action: &TypedAction, policy: &PolicyAccount) -> Result<()>;
    fn build_cpi(&self, action: &TypedAction) -> Result<Instruction>;
    fn estimate_exposure_delta(&self, action: &TypedAction) -> Result<ExposureDelta>;
}
```

## Ika integration (signing, not privacy)

- dWallet provisioned at `create_vault` for external-chain assets in policy universe
- Vault PDA holds secret share — **never** orchestrator or agent session key
- `ika_bridge::request_signature` only after constraint validation passes
- See `Execution-Architecture-Ika.md` §3

## Permission levels (on-chain)

| Level | `execute_action` | Beta |
|-------|------------------|------|
| 1 | Blocked | — |
| 2 | Owner only (after propose_action) | **Default** |
| 3 | Agent if constraints pass | Opt-in |
| 4 | Same as 3 (UX only) | **Disabled in beta** |

## Dev workflow

```bash
# From programs/krypton_core
anchor build
anchor test                    # localnet
anchor deploy --provider.cluster devnet
```

## Mainnet deploy requirements

- Verified build hash matches audit artifact
- Upgrade authority = multisig (Squads)
- Program IDs in `packages/sdk/src/constants.ts`
- Guardian pubkey in `PermissionAccount` for beta vaults

## Additional reference

See [reference.md](reference.md) for account layouts and instruction table.
