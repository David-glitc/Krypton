---
title: Overview
description: What is Krypton and how it works
---

Krypton is an AI-managed yield protocol built on Solana. It uses a **two-phase commit** model where an AI agent researches and proposes strategies, and you approve or reject them on-chain.

## Core Concepts

- **Vault** — A PDA on Solana that holds capital and enforces policy constraints
- **Policy** — Immutable rules (max drawdown, leverage, position size, correlated exposure) committed on-chain
- **Agent Pipeline** — The orchestrator runs solana-agent-kit to research, strategize, simulate, and produce advisory actions
- **Two-Phase Commit** — Phase 1: agent works off-chain and writes an action to the registry. Phase 2: you sign an on-chain transaction to execute or reject

## Network

Currently deployed on **Solana devnet** only. The program is at `DQVp9hnnU6zbyPCJbcEnS6F1fWZMQ2yCCH9jL6cFVPxF`.

## Repo

[github.com/David-glitc/Krypton](https://github.com/David-glitc/Krypton)
