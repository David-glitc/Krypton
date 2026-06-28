---
title: API Reference
description: Frontend API routes
---

## `GET /api/vaults`

Lists vaults for an owner.

**Query Parameters**:
- `ownerWallet` (string, required) — base58 Solana address

**Response**:
```json
{
  "vaults": [
    {
      "registry": { "vault_pubkey": "...", "name": "My Vault" },
      "onChain": { "address": "...", "owner": "...", "nonce": 0, "paused": false },
      "cycleStatus": { "activeJob": null }
    }
  ]
}
```

## `GET /api/vaults/:address`

Get full vault detail including on-chain state, registry, pending actions, recent activity, and cycle status.

## `POST /api/vaults/create`

Prepare a vault creation transaction bundle.

**Body**:
```json
{
  "ownerWallet": "...",
  "form": { "riskProfile": "moderate", "maxDrawdownPct": 12, ... }
}
```

**Response**: Transaction bundle, fee quote, vault PDA address.

## `POST /api/vaults/:address/pending-actions/:id`

Approve or reject a pending action.

**Body**: `{ "status": "approved" | "rejected" }`

## `POST /api/vaults/:address/cycles`

Queue a new cycle for the orchestrator.

**Body**: `{ "permissionLevel": 2, "priority": 5 }`

## `GET /api/vaults/:address/execution-logs`

Get on-chain and off-chain execution records.

## `POST /api/vaults/rename`

Rename a vault in the registry.

**Body**: `{ "vaultPubkey": "...", "name": "New Name" }`
