import type {
  Action,
  Provider,
  Evaluator,
  CycleInput,
  CycleOutput,
  CycleEvaluatorResult,
  CycleStage,
  ConstraintCheckParams,
  ConstraintCheckResult,
  VaultState,
  SimulationResult,
} from './types.js'
import { CYCLE_STAGES } from './types.js'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const STAGE_MODELS: Record<string, string> = {
  RESEARCHING: 'google/gemini-2.0-flash-exp:free',
  STRATEGIZING: 'google/gemini-2.0-flash-exp:free',
  RISK_REVIEW: 'google/gemini-2.0-flash-exp:free',
  SIMULATING: 'google/gemini-2.0-flash-exp:free',
  PERMISSION_GATE: 'google/gemini-2.0-flash-exp:free',
  MONITORING: 'google/gemini-2.0-flash-exp:free',
}

const STAGE_SYSTEM_PROMPTS: Record<string, string> = {
  RESEARCHING: `You are a DeFi research analyst. Analyze the vault's current state, constraints, and market positioning.
Output valid JSON with these fields:
- "rationale": string — your reasoning about the vault's current state
- "hypotheses": string[] — 2-3 actionable hypotheses for portfolio adjustment`,

  STRATEGIZING: `You are a DeFi portfolio strategist. Based on the vault's state and policy, propose concrete actions.
Output valid JSON with these fields:
- "rationale": string — your strategic reasoning
- "actions": string[] — 1-3 specific action descriptions (e.g. "swap 5% USDC to SOL on Jupiter", "rebalance to 60/40 split")`,

  RISK_REVIEW: `You are a risk manager. Review proposed actions against vault constraints.
Output valid JSON with these fields:
- "rationale": string — your risk analysis
- "riskScore": number — 0.0 to 1.0 (0 = no risk, 1 = extreme risk)
- "alerts": string[] — any risk flags (empty if none)`,

  PERMISSION_GATE: `You are a permission gate. Decide if the proposed action needs user approval.
Output valid JSON with these fields:
- "rationale": string — your reasoning
- "decision": "auto_execute" | "requires_approval"`,

  MONITORING: `You are a monitoring agent. Evaluate the completed cycle for issues.
Output valid JSON with these fields:
- "rationale": string — your evaluation
- "alerts": string[] — any issues detected (empty if none)`,
}

interface LlmResponse {
  rationale: string
  hypotheses?: string[]
  actions?: string[]
  riskScore?: number
  alerts?: string[]
  decision?: string
}

/**
 * Type for an LLM call function injected at construction time.
 */
export type LlmCallFn = (
  stage: string,
  vaultContext: string,
) => Promise<{ content: string; model: string; latencyMs: number; costUsd: number }>

/**
 * Create an LLM call function that uses OpenRouter.
 */
export function createOpenRouterLlmCall(apiKey: string): LlmCallFn {
  return async (stage: string, vaultContext: string) => {
    const model = STAGE_MODELS[stage] ?? 'google/gemini-2.0-flash-exp:free'
    const systemPrompt = STAGE_SYSTEM_PROMPTS[stage] ?? 'Output valid JSON.'

    const start = Date.now()
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: vaultContext },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    const latencyMs = Date.now() - start

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`OpenRouter ${response.status}: ${body.slice(0, 200)}`)
    }

    const json = await response.json() as {
      choices: Array<{ message: { content: string } }>
      usage?: { prompt_tokens: number; completion_tokens: number }
    }

    const content = json.choices?.[0]?.message?.content ?? '{}'

    // Estimate cost: free-tier models cost $0
    const isFree = model.endsWith(':free')
    const inputTokens = json.usage?.prompt_tokens ?? 0
    const costUsd = isFree ? 0 : (inputTokens / 1000) * 0.00025

    return { content, model, latencyMs, costUsd }
  }
}

/**
 * CycleEvaluator: the core FSM that runs a vault cycle through 6 stages.
 *
 * When called with a single stage in params, only that stage is evaluated.
 * Callers pass `stage` in the input to scope execution.
 */
export function createCycleEvaluator(
  constraintCheckAction: Action,
  vaultStateProvider: Provider,
  simulationAction: Action,
  llmCall?: LlmCallFn,
): Evaluator {
  return {
    name: 'CYCLE_EVALUATOR',
    description: 'Six-stage vault cycle: Research, Strategize, Risk Review, Simulate, Permission Gate, Monitor. Runs a single stage when `stage` is provided.',
    similes: ['RUN_CYCLE', 'EXECUTE_CYCLE', 'MANAGE_CYCLE', 'FSM_CYCLE'],
    alwaysRun: true,
    validate: async (params) => {
      return typeof params.vaultPubkey === 'string' && typeof params.cycleId === 'number'
    },
    handler: async (params): Promise<{ success: boolean; data?: { result: CycleEvaluatorResult }; error?: string }> => {
      try {
        const vaultPubkey = params.vaultPubkey as string
        const cycleId = params.cycleId as number
        const permissionLevel = (params.permissionLevel as number) ?? 1
        const stage = params.stage as CycleStage | undefined

        const deps = { constraintCheckAction, vaultStateProvider, simulationAction }

        if (!stage) {
          // No stage — run all stages (backward compat / full cycle mode)
          const result = await runCycle(vaultPubkey, cycleId, permissionLevel, deps)
          return { success: true, data: { result } }
        }

        // Single stage mode
        const output = await evaluateStage(
          { vaultPubkey, cycleId, stage, permissionLevel },
          deps,
          llmCall,
        )
        return {
          success: true,
          data: {
            result: {
              finalStage: stage,
              outputs: [output],
            },
          },
        }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    },
  }
}

/**
 * Run a full vault cycle through all 6 FSM stages.
 */
export async function runCycle(
  vaultPubkey: string,
  cycleId: number,
  permissionLevel: number,
  deps: {
    constraintCheckAction: Action
    vaultStateProvider: Provider
    simulationAction: Action
  },
): Promise<CycleEvaluatorResult> {
  const outputs: CycleOutput[] = []
  let currentStage: CycleStage

  for (const stage of CYCLE_STAGES) {
    currentStage = stage

    const input: CycleInput = {
      vaultPubkey,
      cycleId,
      stage,
      permissionLevel,
    }

    const output = await evaluateStage(input, deps)
    outputs.push(output)

    if (output.decision === 'abort') {
      return {
        finalStage: stage,
        outputs,
        error: output.rationale,
      }
    }
  }

  return {
    finalStage: outputs.length > 0 ? outputs[outputs.length - 1]!.stage : 'MONITORING',
    outputs,
  }
}

function formatVaultContext(state: VaultState | null): string {
  if (!state) return 'Vault state: unavailable'
  return [
    `Vault: ${state.vaultPubkey.slice(0, 8)}...`,
    `Paused: ${state.paused}`,
    `NAV (USD): ${state.navUsd}`,
    '',
    '=== Constraint State ===',
    `Max drawdown: ${state.constraints.maxDrawdownBps} bps`,
    `Max leverage: ${state.constraints.maxLeverageBps} bps`,
    `Max position: ${state.constraints.maxPositionBps} bps`,
    `Current drawdown: ${state.constraints.currentDrawdownBps} bps`,
    `Current leverage: ${state.constraints.currentLeverageBps} bps`,
    `Current concentration: ${state.constraints.currentConcentrationBps} bps`,
  ].join('\n')
}

async function evaluateStage(
  input: CycleInput,
  deps: {
    constraintCheckAction: Action
    vaultStateProvider: Provider
    simulationAction: Action
  },
  llmCall?: LlmCallFn,
): Promise<CycleOutput> {
  const { vaultPubkey, stage, cycleId, permissionLevel } = input

  if (llmCall) {
    return evaluateStageWithLlm(input, deps, llmCall)
  }

  // Fallback: return stub responses when no LLM is configured
  switch (stage) {
    case 'RESEARCHING': {
      return {
        stage, decision: 'researched',
        rationale: `Cycle ${cycleId}: vault ${vaultPubkey.slice(0, 8)} loaded (no LLM configured)`,
      }
    }
    case 'STRATEGIZING': {
      return {
        stage, decision: 'proposed_actions',
        rationale: `Cycle ${cycleId}: no LLM — stub strategy`,
        actions: [],
      }
    }
    case 'RISK_REVIEW': {
      return {
        stage, decision: 'approved',
        rationale: `Cycle ${cycleId}: stub risk review — within bounds`,
        riskScore: 0.25, alerts: [],
      }
    }
    case 'SIMULATING': {
      const simResult = await deps.simulationAction.handler({ allocation: {} })
      const score = simResult.data?.compositeScore as number ?? 500
      return {
        stage, decision: 'simulated',
        rationale: `Cycle ${cycleId}: stub simulation score ${score}/1000`,
        riskScore: score / 1000,
      }
    }
    case 'PERMISSION_GATE': {
      const requiresApproval = (permissionLevel ?? 1) >= 2
      return {
        stage, decision: requiresApproval ? 'requires_approval' : 'auto_execute',
        rationale: requiresApproval
          ? 'Permission level requires user approval'
          : 'Auto-execute within policy bounds',
      }
    }
    case 'MONITORING': {
      return {
        stage, decision: 'monitored',
        rationale: `Cycle ${cycleId} complete (no LLM)`,
        alerts: [],
      }
    }
    default: {
      return { stage, decision: 'unknown', rationale: `Unknown stage: ${stage}` }
    }
  }
}

async function evaluateStageWithLlm(
  input: CycleInput,
  deps: {
    constraintCheckAction: Action
    vaultStateProvider: Provider
    simulationAction: Action
  },
  llmCall: LlmCallFn,
): Promise<CycleOutput> {
  const { vaultPubkey, stage, cycleId, permissionLevel } = input
  const permLevel = permissionLevel ?? 1

  // Fetch vault state for context
  const stateResult = await deps.vaultStateProvider.get(null, { vaultPubkey })
  const vaultState = stateResult.success
    ? formatVaultContext(stateResult.data as unknown as VaultState)
    : 'Vault state unavailable'

  // Build context string with stage-specific info
  let context = vaultState
  context += `\n\nCycle: #${cycleId}\nPermission level: L${permLevel}\n\n`

  // For SIMULATING, run the simulation first and include results
  if (stage === 'SIMULATING') {
    const simResult = await deps.simulationAction.handler({ allocation: {} })
    const simData = simResult.data as Record<string, unknown> | undefined
    context += `=== Simulation Results ===\nComposite score: ${simData?.compositeScore ?? 'N/A'}\nExpected return: ${simData?.expectedReturnBps ?? 'N/A'} bps\nExpected drawdown: ${simData?.expectedDrawdownBps ?? 'N/A'} bps\n`
  }

  const { content, model, latencyMs, costUsd } = await llmCall(stage, context)

  let parsed: LlmResponse
  try {
    parsed = JSON.parse(content) as LlmResponse
  } catch {
    parsed = { rationale: `LLM returned unparseable JSON for ${stage}: ${content.slice(0, 100)}` }
  }

  const base = {
    stage,
    rationale: parsed.rationale ?? `LLM response for ${stage}`,
    llmCostUsd: costUsd,
    llmLatencyMs: latencyMs,
    llmModel: model,
  }

  switch (stage) {
    case 'RESEARCHING':
      return { ...base, decision: 'researched', alerts: parsed.hypotheses }
    case 'STRATEGIZING':
      return { ...base, decision: 'proposed_actions', actions: parsed.actions ?? [] }
    case 'RISK_REVIEW':
      return { ...base, decision: 'approved', riskScore: parsed.riskScore ?? 0.25, alerts: parsed.alerts ?? [] }
    case 'SIMULATING':
      return { ...base, decision: 'simulated', riskScore: parsed.riskScore ?? 0.5 }
    case 'PERMISSION_GATE':
      return { ...base, decision: parsed.decision ?? (permLevel >= 2 ? 'requires_approval' : 'auto_execute') }
    case 'MONITORING':
      return { ...base, decision: 'monitored', alerts: parsed.alerts ?? [] }
    default:
      return { ...base, decision: 'unknown' }
  }
}
