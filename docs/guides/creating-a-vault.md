---
title: Creating a Vault
description: Step-by-step guide to deploying a vault
---

## Prerequisites

- A Solana wallet on devnet with some SOL for creation fees
- Connected to the app via Dynamic

## Steps

1. Go to **Strategy** in the sidebar
2. Fill out the vault configuration form:
   - **Risk Profile**: Choose conservative, moderate, or aggressive — this sets default drawdown and leverage caps
   - **Max Drawdown %**: The agent will pause if losses exceed this threshold
   - **Max Leverage**: Cap on leveraged positions
   - **Assets**: Select which tokens the agent may trade
   - **Vault Name**: A human-readable label
3. Review the creation fee — scaled by a multiplier based on how many vaults you already own (1x for first 5, 2x for 6–10, etc.)
4. Sign the transaction bundle with your wallet
5. Wait for confirmation on devnet
6. Your vault appears in the dashboard

## Fee Structure

| Vaults Owned | Multiplier |
|-------------|-----------|
| 0–5         | 1×        |
| 6–10        | 2×        |
| 11–15       | 3×        |
| 16+         | 4×        |
