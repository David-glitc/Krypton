---
title: Approving & Rejecting Actions
description: Two-phase commit for AI-proposed strategies
---

## Advisory Mode (Default)

1. The agent completes its pipeline and writes a pending action with rationale
2. You see the action in **Pending Actions** on the vault detail page
3. Review the rationale — what the agent wants to do and why
4. Click **Approve** to confirm (opens a confirmation dialog)
5. Sign the on-chain transaction with your wallet
6. The action is recorded in the execution log

Alternatively, click **Reject** to skip the action.

## Auto Mode

Future feature: the agent can execute actions without manual approval within policy limits.

## On-chain Record

Every approved or rejected action is recorded in the vault's `ExecutionLogAccount` on Solana, providing a verifiable audit trail.
