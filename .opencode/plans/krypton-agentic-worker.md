# Krypton — Agentic Worker + Dashboard + Monetization

## Context

The orchestrator polling loop runs but all agent stages return stubs. Cycles queue
as "pending" but never execute real actions on-chain (PERMISSION_GATE inserts a
`noop` stub). The frontend shows pending actions as read-only JSON with no
approve/reject. There is no recurring revenue model.

## Approach — 3 phases

### Phase 1: Real Agentic Worker

**Goal**: Worker runs LLM-driven 6-stage cycles with real on-chain execution.

#### 1a. Load wallet key from env
- Add `KRYPTON_AUTHORITY_KEYPAIR` env var (base64-encoded Solana secret key).
- Load into a `Keypair` in `AgentRuntime`/`KryptonPlugin` constructor.
- Pass to `ConstraintClient` and a new `ExecutionClient` for signing.

**Files**: `services/orchestrator/src/runtime.ts`,
`services/orchestrator/src/plugins/krypton-plugin.ts`

#### 1b. Fix `getVaultState` — decode real on-chain data
Current `getVaultState` returns all zeros. Replace with proper Borsh decode of
the Vault account. Verified layout from `lib.rs:511-520` + E2E test (267 bytes):

```
// Vault (Anchor account = 8B discriminator + fields)
offset  size  field
0       8     discriminator (Anchor hash of "account:Vault")
8       32    owner: Pubkey
40      1     bump: u8
41      32    voltr_vault: Pubkey
73      4     policy_version: u32 (LE)
77      1     paused: bool
78      4     pause_reason_len: u32 (LE)  // Option<String>, 0 = None
82      64    pause_reason: [u8; 64]      // max_len 64
146     8     constraint.max_drawdown_bps: u64 (LE)
154     8     constraint.max_leverage_bps: u64 (LE)
162     8     constraint.max_position_bps: u64 (LE)
170     8     constraint.max_correlated_exposure_bps: u64 (LE)
178     8     constraint.min_pool_liquidity_usd: u64 (LE)
186     8     constraint.current_drawdown_bps: i64 (LE)
194     8     constraint.current_leverage_bps: i64 (LE)
202     8     constraint.current_concentration_bps: i64 (LE)
210     8     constraint.current_correlated_exposure_bps: i64 (LE)
218     8     constraint.last_oracle_update: i64 (LE)
226     8     constraint.allowed_protocols_bitmap: u64 (LE)
234     32    constraint.allowed_assets_hash: [u8; 32]
= 266 bytes + 1 padding? → 267 (matches E2E)
```

Use `DataView` / `Buffer.readBigUInt64LE` same pattern as
`constraint-client.ts:36-46`.

**Note**: The vault has no `navUsd` field. NAV is derived from the associated
Voltr vault. For now, return `navUsd: 0` and add a TODO to fetch Voltr vault
NAV in a follow-up. All constraint state fields can be decoded from the layout
above.

**Files**: `services/orchestrator/src/plugins/krypton-plugin.ts:147-174`

#### 1c. Create `ExecutionClient` — on-chain action submission
New class that wraps `buildExecuteActionInstruction` (reuse existing
`src/lib/solana/transactions.ts:155`) to send and confirm `execute_action`
transactions on devnet.

The `execute_action` instruction already includes the `ExecutionLog` PDA in its
account context (`lib.rs:845-854`), so execution is automatically logged. No
separate `log_execution` call needed.

```typescript
class ExecutionClient {
  async executeAction(params: {
    vaultPubkey: PublicKey
    vaultOwner: PublicKey
    actionType: number
    actionData: Buffer  // typed_action_data bytes
    authority: Keypair
  }): Promise<string> // tx signature
}
```

The transaction:
1. Build `execute_action` IX via `buildExecuteActionInstruction` (discriminator
   already verified: `[0xf6, 0x89, 0x69, 0x71, 0xf7, 0x06, 0xdf, 0xae]`)
2. Retry with exponential backoff (1s→2s→4s→8s) on transient failures
3. If all retries exhausted, throw — letting the worker mark the cycle as failed
4. Sign with authority keypair, send & confirm via `sendRawTransaction`,
   verify via `getSignatureStatus`

**Config**: `SOLANA_RPC_URL` env var (already exists), `KRYPTON_AUTHORITY_KEYPAIR`
env var. Program ID from environment or default `DQVp9hnnU6zbyPCJbcEnS6F1fWZMQ2yCCH9jL6cFVPxF`.

**Files**: new `services/orchestrator/src/execution-client.ts`

#### 1d. Replace `cycle-evaluator.ts` stubs with OpenRouter LLM calls
Each stage calls OpenRouter with:
- **System prompt**: stage-specific role (researcher, strategist, risk analyst, etc.)
  + vault constraints + vault state
- **User prompt**: current portfolio state, market conditions (from research stage)
- **Response schema**: structured JSON matching the stage output type

Use `fetch` to `https://openrouter.ai/api/v1/chat/completions` (same pattern as
`src/app/api/generate-policy/route.ts:52-62`). Model: `anthropic/claude-sonnet-4`
for STRATEGIZING/RISK_REVIEW, `anthropic/claude-haiku-3-5` for
RESEARCHING/MONITORING.

**When `KRYPTON_STUB_AGENTS=true`** → return current hardcoded stubs (no LLM call).

**Files**: `packages/elizaos-plugin/src/cycle-evaluator.ts`

#### 1e. Wire PERMISSION_GATE to real execution
- L1 (auto-execute): call `ExecutionClient.executeAction()` with the action from
  STRATEGIZING stage, then call `log_execution` on-chain.
- L2+ (advisory): insert `pending_actions` row with the proposed action (already
  works — just replace the `noop` stub with real action data).

**Files**: `services/orchestrator/src/worker.ts:105-122`

#### 1e-ii. Error handling: exponential backoff retry
Both OpenRouter LLM calls and on-chain `execute_action` transactions retry with
exponential backoff: 1s → 2s → 4s → 8s (4 attempts total). After all retries
exhausted, mark the cycle as `failed` with the last error in `cycle_jobs.error`.
Transient failures (429, 503, tx simulation failure) retry. Permanent failures
(invalid action, bad accounts) fail immediately.

**Files**: `services/orchestrator/src/worker.ts` (wrap stage execution in retry
helper), `packages/elizaos-plugin/src/cycle-evaluator.ts` (wrap OpenRouter calls)

#### 1f. Track LLM cost
Populate `agent_invocations.cost_usd` using OpenRouter's `x-cost` response header
or model pricing table. Store `model_id`, `latency_ms`, `prompt_hash`,
`response_hash`.

**Files**: `services/orchestrator/src/worker.ts` (update the AI invocation block)

#### 1g. Orchestrator Dockerfile
```
FROM node:22-slim
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN corepack enable && pnpm install
COPY services/orchestrator/ ./services/orchestrator/
RUN pnpm --filter @krypton/orchestrator build
CMD ["node", "services/orchestrator/dist/index.js", "worker"]
```

Add `services/orchestrator/Dockerfile` and a service entry in
`docker-compose.coolify.yml`.

### Phase 2: Frontend Agent Dashboard

**Goal**: Users can see, approve, and reject agent-proposed actions. Real-time
cycle status, execution history with reasoning.

#### 2a. `PATCH /api/vaults/:address/pending-actions/:id`
- **Body**: `{ status: 'approved' | 'rejected' }`
- On approve: update status, enqueue a high-priority cycle job via
  `enqueueCycleJob` with `scheduledAt: now()` for immediate pickup.
- On reject: update status, log activity event.
- Returns updated pending action.

**Files**: new `src/app/api/vaults/[address]/pending-actions/[id]/route.ts`

#### 2b. Approve/reject UI on vault detail page
Replace the read-only JSON display in `vault-detail-client.tsx:262-283` with:
- Action card showing: action type, protocol, amount, rationale
- **Approve** button (green) → confirmation dialog
- **Reject** button (red) → immediate with undo option (5s toast)
- Confirmation dialog: "Execute [action description] on [protocol]?"

Use `fetch('PATCH', ...)` to call the new API endpoint. Refresh pending actions
list after approve/reject.

**Files**: `src/components/app/vault-detail-client.tsx`

#### 2c. Cycle status auto-polling
Add a `setInterval` in vault detail page that polls
`GET /api/vaults/:address` every 15s while a cycle is active (activeJob exists).
Update status pills without full page reload. Remove the `window.location.reload()`
on cycle queue.

**Files**: `src/components/app/vault-detail-client.tsx`

## Future work (not in this plan)

- **Monetization model**: Tiered SaaS (Free/Pro/Enterprise) + protocol fee on AUM.
  Deferred — no billing infra, no subscription service, no tier middleware in this
  pass. The creation fee ($4–$20 dynamic) remains the only revenue mechanism.
- **On-chain protocol fee**: `collect_protocol_fee` instruction for the Solana
  program. Requires a program upgrade + mainnet deploy. Separate plan.
- **Agent performance metrics dashboard**: avg cost/cycle, model used, latency.
  Defer until after the core flow works end-to-end.

## Key decisions

| Decision | Choice | Rationale |
|---|---|---|
| Wallet key source | `KRYPTON_AUTHORITY_KEYPAIR` env var (devnet), KMS/ciphertext for mainnet | Devnet: env var is fine. Mainnet: must use GCP Secret Manager / AWS KMS, key never in plaintext env vars. |
| Permission gate | L1 auto-execute, L2+ pending action | Maps cleanly to permission_level field already in the DB |
| LLM provider | OpenRouter | Already used in codebase, one key for multiple models |
| Runtime arch | Replace evaluator stubs, keep FSM | Evaluator abstraction useful for testing |
| ElizaOS deployment | Lightweight runtime (not full container) | Character files & plugin are ElizaOS-portable by contract |
| Frontend approval | Inline buttons + confirm dialog | Fastest path, no new page needed |
| Monetization | Tiered SaaS + protocol fee on AUM | Scales with assets, not usage |
| On-chain verification | getSignatureStatus on tx sig | Confirms tx landed vs silent failure |

## Files to modify

### Phase 1
- `packages/elizaos-plugin/src/cycle-evaluator.ts` — replace stubs with OpenRouter
- `packages/elizaos-plugin/package.json` — add `openrouter` dep (or just use fetch)
- `services/orchestrator/src/plugins/krypton-plugin.ts` — fix getVaultState, pass keypair
- `services/orchestrator/src/runtime.ts` — load authority keypair
- `services/orchestrator/src/worker.ts` — wire PERMISSION_GATE to real execution
- `services/orchestrator/src/constraint-client.ts` — (minor) accept keypair
- `services/orchestrator/src/execution-client.ts` — new file
- `services/orchestrator/Dockerfile` — new file
- `.env.orchestrator` — add OPENROUTER_API_KEY, KRYPTON_AUTHORITY_KEYPAIR
- `.env.example` — document new vars

### Phase 2
- `src/app/api/vaults/[address]/pending-actions/[id]/route.ts` — new file
- `src/components/app/vault-detail-client.tsx` — approve/reject UI, auto-polling
- `src/app/api/vaults/[address]/route.ts` — add agent stats to response

## Testing strategy

### Unit tests
- `services/orchestrator/src/execution-client.test.ts` — mock `Connection` from
  `@solana/web3.js`, verify `executeAction` builds the correct IX and calls
  `sendRawTransaction`. Test success + retry + exhaustion paths.
- `packages/elizaos-plugin/src/cycle-evaluator.test.ts` — mock `fetch` to
  return controlled OpenRouter responses. Verify each stage returns the expected
  structured output. Test rate-limit retry (429 → backoff → success). Test
  `KRYPTON_STUB_AGENTS=true` returns stubs without calling fetch.
- `src/app/api/vaults/[address]/pending-actions/[id]/route.test.ts` — mock DB
  layer. Test approve/reject flows, missing action, already-approved.

### Integration tests
- Worker + local SQLite: run `processOne` with a seeded cycle_job and mock
  agent functions. Verify cycle_runs, agent_invocations, and pending_actions
  are created. Verify job status transitions pending → leased → completed/failed.
- Full devnet E2E: create vault → queue cycle → poll completion → verify
  `execute_action` tx confirmed via `getSignatureStatus` → verify ExecutionLog
  PDA has new entry.

### Frontend tests
- `vault-detail-client.test.tsx` — render component with mock data, click
  approve/reject buttons, verify PATCH call fires with correct body.
- Confirmation dialog renders on approve click and fires on confirm.

## Out of scope

- Full ElizaOS container deployment: kept lightweight runtime. Character files are
  portable when ElizaOS integration is needed.
- Stripe/Paddle billing integration: design the tier model but defer payment
  collection infra.
- Multi-agent coordination: single-agent-per-vault model for now.
- Real-time WebSocket: polling is sufficient for the first pass.
- Agent performance metrics dashboard: basic cycle status is sufficient for first pass.

## Verification

```bash
# Phase 1a — Build
pnpm --filter @krypton/elizaos-plugin build    # must compile
pnpm --filter @krypton/orchestrator build       # must compile
pnpm --filter @krypton/orchestrator typecheck   # no type errors

# Phase 1b — Worker starts in stub mode
KRYPTON_STUB_AGENTS=true KRYPTON_DB_PATH=./.data/test.db \
  pnpm --filter @krypton/orchestrator start &
sleep 3  # let worker start polling
# Expect: "[worker] starting" log line, no crash

# Phase 1c — E2E: create vault, queue cycle, verify execution
# Create vault on devnet (use existing devnet test script or manual API call)
# Then queue a cycle:
VAULT_ADDR=<vault_pda_from_creation>
CYCLE_RES=$(curl -s -X POST "$API_URL/api/vaults/$VAULT_ADDR/cycles" \
  -H 'Content-Type: application/json' \
  -d '{"permissionLevel":1,"priority":5}')
echo "Cycle queued: $CYCLE_RES"

# Poll until cycle completes (max 30s)
for i in $(seq 1 15); do
  STATUS=$(curl -s "$API_URL/api/vaults/$VAULT_ADDR" | jq -r '.cycleStatus.activeJob.status // empty')
  if [ -z "$STATUS" ] || [ "$STATUS" = "null" ]; then
    echo "Cycle completed on attempt $i"
    break
  fi
  echo "Attempt $i: status=$STATUS — waiting…"
  sleep 2
done

# Verify cycle_run has LLM-generated rationale (not stub)
RUNS=$(curl -s "$API_URL/api/vaults/$VAULT_ADDR/execution-logs")
echo "Off-chain runs: $(echo "$RUNS" | jq '.offChainRuns | length')"
echo "$RUNS" | jq '.offChainRuns[0].decision.rationale'  # expect meaningful text, not stub

# Verify on-chain ExecutionLog entry was appended
echo "On-chain entries: $(echo "$RUNS" | jq '.onChain.entries | length')"  # expect > 0

# Verify tx signature confirmed
TX_SIG=$(echo "$RUNS" | jq -r '.onChain.entries[0].txSignature')
if [ -n "$TX_SIG" ] && [ "$TX_SIG" != "null" ]; then
  solana confirm -k devnet "$TX_SIG"  # expect "Transaction confirmed"
fi

# Phase 2 — Frontend
pnpm --filter @krypton/web build               # Next.js builds (no errors)
# Manual: browse vault detail, verify pending action has approve/reject buttons
# Click approve → confirm dialog appears → confirm → verify cycle enqueued
# Verification: GET /api/vaults/$VAULT_ADDR — pendingActions count decreased by 1

# Run unit tests
pnpm --filter @krypton/orchestrator test        # all tests pass
pnpm --filter @krypton/elizaos-plugin test      # all tests pass
pnpm --filter @krypton/web test                 # all tests pass
pnpm --filter @krypton/web typecheck            # typecheck passes
```
