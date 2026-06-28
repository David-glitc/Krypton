---
title: Program Accounts
description: Solana account layouts and PDA derivation
---

## Vault PDA

**Seeds**: `["vault", owner, nonce_le_bytes]`

**Layout**:
| Field | Type | Offset |
|-------|------|--------|
| owner | Pubkey | 0 |
| bump | u8 | 32 |
| nonce | u64 | 33 |
| policy_version | u64 | 41 |
| paused | bool | 49 |
| pause_reason | String | 50 |

## Policy PDA

**Seeds**: `["policy", vault, version_le_bytes]`

Stores committed policy constraints as bps values and content hash.

## Execution Log

**Seeds**: `["execution_log", vault]`

Append-only array of action records: cycle ID, timestamp, decision, action type, tx signature.
