---
name: krypton-devops
description: >-
  Deploys and operates Krypton infrastructure — TanStack Start hosting, AI
  orchestrator, keeper cranks, Helius RPC, CI/CD, secrets, monitoring, and
  Solana mainnet program deployment. Use when setting up Krypton DevOps, Docker,
  Traefik, GitHub Actions, or production hosting architecture.
---

# Krypton DevOps & Hosting

## Stack

Cloudflare → Traefik → web (TanStack Start) + orchestrator + krypton-sim-rs + keeper → Helius RPC → Solana mainnet

## Secrets (never in git)

OPENROUTER_API_KEY, HELIUS_API_KEY, AGENT_SESSION_KEYPAIR, ARWEAVE_WALLET_JWK, GUARDIAN_MULTISIG

## CI/CD

PR: anchor test, cargo test, pnpm build.
Tag: docker push, mainnet deploy with manual approval.

## Monitoring alerts

ConstraintState.paused, oracle staleness >120s, cycle abort rate >30%/hr, RPC failures.

## Mainnet deploy

1. Audit hash = binary
2. Squads multisig upgrade authority
3. anchor deploy mainnet
4. Verify Solscan
5. Smoke test create_vault

See [traefik.md](traefik.md) and docs/MAINNET-PRIVATE-BETA-MAP.md §6
