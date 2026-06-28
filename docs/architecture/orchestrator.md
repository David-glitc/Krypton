---
title: Orchestrator
description: The off-chain agent pipeline running on a VPS
---

## Service

The orchestrator runs as a systemd unit:

```
systemctl status krypton-orchestrator
```

It polls the PostgreSQL registry for pending cycles, runs the agent pipeline, and writes results back.

## Pipeline Stages

1. **Research** — Gathers on-chain data: pool prices, volume, TVL, network congestion
2. **Strategize** — Uses solana-agent-kit to propose actions (swap, stake, lend)
3. **Risk Review** — Checks proposed actions against vault policy constraints
4. **Simulate** — Dry-runs transactions to estimate slippage and gas
5. **Permission Gate** — Writes action to registry for owner approval (advisory mode) or auto-executes (auto mode)
6. **Monitor** — Tracks execution and updates vault status

## Agent Configuration

Configured via environment variables in `/etc/krypton-orchestrator.env`:
`AGENT_SIGNER_SECRET` — the agent's Solana keypair for signing advisory transactions
