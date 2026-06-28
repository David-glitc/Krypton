---
title: Configuration
description: Environment variables and deployment config
---

## Environment Variables

### Frontend (Vercel)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint (defaults to devnet) |
| `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` | Dynamic SDK environment ID |
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `AGENT_SIGNER_SECRET` | Agent Solana keypair (bs58) for signing |

### Orchestrator (VPS)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SOLANA_RPC_URL` | Solana RPC endpoint |
| `AGENT_SIGNER_SECRET` | Agent's private key for signing |
| `OPENAI_API_KEY` | LLM API key for agent reasoning |

## Deployment

- Frontend: Vercel project `krypton-vault`
- Orchestrator: systemd service `krypton-orchestrator` on VPS
- Database: Neon PostgreSQL
- On-chain: Anchor program, upgrade authority keypair on VPS at `~/.config/solana/chessonchain-casino-deployer.json`
