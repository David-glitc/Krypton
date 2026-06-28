---
title: Quick Start
description: Get up and running in 5 minutes
---

## 1. Connect a Wallet

Click **Connect Wallet** in the header and sign in with Backpack, Phantom, or any Dynamic-supported Solana wallet. Switch your wallet to **devnet**.

## 2. Create a Vault

Navigate to **Strategy** and configure:

- **Risk Profile** — conservative, moderate, or aggressive
- **Max Drawdown** — the maximum allowed loss before pausing (default 12%)
- **Max Leverage** — cap on leverage (default 1.5x)
- **Assets** — which tokens the agent is allowed to trade
- **Vault Name** — a display label for your vault

Review the creation fee (in SOL) and sign the transaction bundle.

## 3. Fund Your Vault

Go to your vault detail page and use the **Deposit** panel to send SOL into the vault PDA.

## 4. Queue a Cycle

Click **Run Cycle** on the vault detail page. The orchestrator will pick up the cycle, run the agent pipeline, and produce advisory actions.

## 5. Approve or Reject

When the agent produces an action, you'll see it in the **Pending Actions** panel. Review the rationale, then approve (signs on-chain) or reject.
