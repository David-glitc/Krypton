# Krypton Protocol — Account & Instruction Reference

## PolicyAccount (summary fields on-chain)

Full canonical policy = off-chain JSON (Arweave/IPFS); on-chain stores hash + summary.

| Field | Type | Notes |
|-------|------|-------|
| policy_hash | [u8; 32] | SHA-256 of canonical JSON |
| max_leverage_bps | u16 | Hard cap 20000 at protocol level |
| max_drawdown_bps | u16 | |
| allowed_protocols_bitmap | u64 | One bit per adapter |
| execution_mode | u8 | Maps to permission level 1–4 |

## Core instructions

| Instruction | Caller | Effect |
|-------------|--------|--------|
| create_vault | user | Init Capital + Permission accounts |
| submit_policy | owner | Validate caps, write PolicyAccount |
| deposit | user | Mint shares, update capital |
| request_withdrawal | user | Enqueue withdrawal |
| propose_action | agent_signer | ExecutionLog = advisory_pending |
| execute_action | agent (L3) or owner (L2) | Constraint re-check → CPI/Ika |
| force_pause | guardian or owner | paused = true |
| update_constraint_state | keeper | Refresh drawdown/leverage from Pyth |

## External positions (cross-chain)

```rust
pub struct ExternalPositionSummary {
    pub chain_id: ChainId,
    pub asset_denom: String,
    pub amount: u64,
    pub usd_value: u64,
    pub last_updated: i64,
}
```

Keeper crank via light client or oracle attestation — same staleness rules as Solana oracles.

## Rejection logging

Failed constraint → revert + ExecutionLog rejection reason → orchestrator marks `rejected_onchain` → next Research cycle context.
