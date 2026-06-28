---
title: Funding & Running Cycles
description: Deposit capital and trigger the agent pipeline
---

## Depositing SOL

On your vault detail page, use the **Deposit** panel:

1. Enter an amount in SOL
2. Optionally scan the QR code to send from mobile
3. Click **Send SOL** and sign the transfer transaction
4. SOL arrives in the vault PDA

## Running a Cycle

Click **Run Cycle** on the vault detail page. This queues a cycle in the registry. The orchestrator picks it up and runs:

1. Research → 2. Strategy → 3. Risk Review → 4. Simulation → 5. Permission Gate

You can watch progress in the **Agent Logs & Reasoning** section. When the agent produces an action, it appears in **Pending Actions**.
