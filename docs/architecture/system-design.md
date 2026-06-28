---
title: System Design
description: High-level architecture of the Krypton system
---

## Components

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Frontend   │────▶│ Orchestrator │────▶│ Solana      │
│  (Next.js)  │     │ (systemd)    │     │ (devnet)    │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │
       ▼                    ▼
┌─────────────┐     ┌──────────────┐
│ Dynamic SDK │     │ PostgreSQL   │
│ (wallets)   │     │ (Neon)       │
└─────────────┘     └──────────────┘
```

- **Frontend**: Next.js 16 on Vercel, server and client components
- **Orchestrator**: systemd unit on a Linux VPS, runs solana-agent-kit
- **On-chain**: Anchor program on Solana devnet
- **Database**: PostgreSQL via Neon — vault registry, pending actions, execution logs
