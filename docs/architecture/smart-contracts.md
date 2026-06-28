---
title: Smart Contracts
description: Solana program account model and instructions
---

## Program

- **Program ID**: `DQVp9hnnU6zbyPCJbcEnS6F1fWZMQ2yCCH9jL6cFVPxF`
- **Framework**: Anchor
- **Language**: Rust

## Accounts

### VaultAccount

Stores vault state: owner, nonce, bump, policy version, pause status.

Derived via PDA with seeds `[b"vault", owner.key().as_ref(), &nonce.to_le_bytes()]`.

### PolicyAccount

Stores committed policy parameters: max drawdown (bps), max leverage (bps), position caps, content hash of the full policy JSON.

### PermissionAccount

Controls who can execute actions. Supports owner-only, advisory, and guardian modes.

### ExecutionLogAccount

Append-only log of executed on-chain actions. Each entry records cycle ID, timestamp, decision, action type, and tx signature.

## Instructions

- `create_vault` — initialize a vault and its policy
- `confirm_action` — execute or reject a pending action
- `pause_vault` / `unpause_vault` — emergency controls
- `deposit` — receive SOL into the vault PDA
