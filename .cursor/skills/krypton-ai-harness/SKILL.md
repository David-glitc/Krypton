---
name: krypton-ai-harness
description: >-
  Implements Krypton off-chain AI orchestrator — OpenRouter agent pipeline,
  Research/Strategy/Risk/Simulation/Execution/Monitoring agents, MCP tool layer,
  cycle state machine, and audit trail. Use when building agent services,
  TypedAction construction, or OpenRouter integration for Krypton.
---

# Krypton AI Harness

## Architecture

```
Orchestrator (per vault, per cycle)
  Research → Strategy → Risk → Simulation → Governance? → Permission gate → Execution → Monitoring
       └────────────────── OpenRouter SDK ──────────────────┘
                              │
                    Tool Layer (MCP, typed, bounds-checked)
                              │
                    Solana RPC → ExecutionRouter (on-chain hard gate)
```

Reference: `PRD (1).md` §3, `Execution-Architecture-Ika.md` §2.

## Service layout

```
services/orchestrator/     # TypeScript — cycle FSM, agent calls
services/krypton-sim-rs/   # Rust — Monte Carlo, backtests (not LLM)
```

## Agent roles

| Agent | Output schema | Model tier |
|-------|---------------|------------|
| Research | hypotheses_v1.json | mid, :floor OK |
| Strategy | candidates_v1.json | high-reasoning |
| Risk | risk_verdict_v1.json | high-reasoning + deterministic post-check |
| Simulation | composite_score + metrics | Rust engine; LLM narrative only |
| Execution | typed_action_v1.json | low-cost; routing deterministic |
| Monitoring | alerts_v1.json | low-cost; 15s poll |

## OpenRouter client rules

- Per-agent primary_model + fallback_chain
- response_format json_schema — malformed → retry max 2 → CycleAbortError
- max_cost_per_call_usd per role
- Audit: hash prompt + response → Arweave → pointer in ExecutionLog

## Tool layer (Execution Agent)

| Tool | Purpose |
|------|---------|
| get_jupiter_quote | Swap quote |
| get_titan_quote | Competing quote |
| build_typed_action | Validated TypedAction (soft reject with feedback) |
| request_ika_signature | Cross-chain after on-chain constraint pass |

## Cycle state machine

IDLE → RESEARCHING → STRATEGIZING → RISK_REVIEW → SIMULATING → PERMISSION_GATE → SUBMITTING → EXECUTED | REJECTED_ONCHAIN → MONITORING → IDLE

REJECTED_ONCHAIN context injected into next Research cycle.

## Private beta config

- default_permission_level: 2 (suggest-only)
- enabled_levels: [1, 2, 3] — no level 4
- advisory_timeout_hours: 24

## Environment variables

OPENROUTER_API_KEY, SOLANA_RPC_URL, AGENT_SESSION_KEYPAIR_PATH, ARWEAVE_WALLET_JWK, KRYPTON_PROGRAM_ID

## Additional reference

See [agent-config.md](agent-config.md)
