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
import { createResearchTools, type ToolDefinition, type ToolHandler } from './tools.js'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const STAGE_MODELS: Record<string, string> = {
  RESEARCHING: 'openrouter/owl-alpha',
  STRATEGIZING: 'openrouter/owl-alpha',
  RISK_REVIEW: 'openrouter/owl-alpha',
  SIMULATING: 'openrouter/owl-alpha',
  PERMISSION_GATE: 'openrouter/owl-alpha',
  MONITORING: 'openrouter/owl-alpha',
}

const STAGE_SYSTEM_PROMPTS: Record<string, string> = {
  RESEARCHING: `You are a DeFi research analyst for a Solana vault. Use live vault constraints and balances in the user message.
Available DeFi adapters (only recommend these): Jupiter (swaps), Kamino (lending), Sanctum (liquid staking / jitoSOL), Meteora (liquidity).
If capital is idle (zero leverage/concentration), aggressively scan for yield opportunities within policy limits — do not say "unavailable" unless vault state explicitly failed.
Output valid JSON:
- "rationale": string — concise market + vault read (2-4 sentences)
- "hypotheses": string[] — 2-3 concrete next steps (not generic "maintain allocation")`,

  STRATEGIZING: `You are an aggressive DeFi portfolio strategist. Idle capital should be deployed when within constraints.
Use adapters: Jupiter swaps, Kamino lend, Sanctum stake (jitoSOL etc), Meteora LP — match allowed protocols in vault context.
Propose REAL moves with sizes (e.g. "swap 40% idle SOL to USDC on Jupiter", "stake 30% SOL via Sanctum to jitoSOL").
Output valid JSON:
- "investmentGoal": string — one-sentence investment thesis for this vault (e.g. "Compound SOL yield via LST + Kamino lend while staying under 1.5x leverage")
- "rationale": string — why these moves now
- "actions": string[] — 1-3 specific executable actions`,

  RISK_REVIEW: `You are a risk manager. Review the PROPOSED ACTIONS from strategizing (in prior context if present) against vault constraints.
If strategy proposed actions, evaluate those — do not say "no action proposed" when actions exist in context.
Output valid JSON:
- "rationale": string — risk analysis
- "riskScore": number — 0.0 to 1.0
- "alerts": string[] — risk flags (empty if none)`,

  SIMULATING: `You are a portfolio simulation analyst. Project outcomes for the proposed strategy.
Output valid JSON:
- "rationale": string — simulation summary with expected outcome
- "riskScore": number — 0.0 to 1.0 projected risk`,

  PERMISSION_GATE: `You are a permission gate. If concrete swap/stake/lend actions were proposed, set requires_approval based on permission level in context (L2+ needs approval).
Output valid JSON:
- "rationale": string — brief decision reason
- "decision": "auto_execute" | "requires_approval"`,

  MONITORING: `You are a monitoring agent. Summarize whether the agent run achieved its goal or what blocked execution.
Output valid JSON:
- "rationale": string — plain-English summary for the vault owner
- "alerts": string[] — issues only (empty if none)`,
}

interface LlmResponse {
  rationale: string
  investmentGoal?: string
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
 * Supports tool/function calling for agentic stages like RESEARCHING.
 */
export function createOpenRouterLlmCall(apiKey: string): LlmCallFn {
  return async (stage: string, vaultContext: string) => {
    const model = STAGE_MODELS[stage] ?? 'openrouter/owl-alpha'
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
    const FREE_MODELS = new Set(['openrouter/owl-alpha'])
    const isFree = model.endsWith(':free') || FREE_MODELS.has(model)
    const inputTokens = json.usage?.prompt_tokens ?? 0
    const costUsd = isFree ? 0 : (inputTokens / 1000) * 0.00025

    return { content, model, latencyMs, costUsd }
  }
}

const OR_API_KEY = (): string => process.env.OPENROUTER_API_KEY ?? ''

async function callLlmWithTools(
  model: string,
  systemPrompt: string,
  context: string,
  tools: ReturnType<typeof createResearchTools>,
): Promise<{ content: string; model: string; latencyMs: number; costUsd: number }> {
  const messages: Array<Record<string, unknown>> = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: context },
  ]

  let turnCount = 0
  const maxTurns = 5

  while (turnCount < maxTurns) {
    turnCount++
    const start = Date.now()
    const body: Record<string, unknown> = {
      model,
      messages,
      tools: tools.definitions.length > 0 ? tools.definitions : undefined,
      tool_choice: 'auto',
    }
    if (tools.definitions.length === 0) {
      body.response_format = { type: 'json_object' }
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OR_API_KEY()}`,
      },
      body: JSON.stringify(body),
    })
    const latencyMs = Date.now() - start

    if (!response.ok) {
      const errBody = await response.text()
      throw new Error(`OpenRouter ${response.status}: ${errBody.slice(0, 200)}`)
    }

    const json = await response.json() as {
      choices: Array<{
        message: {
          content?: string | null
          tool_calls?: Array<{
            id: string
            type: 'function'
            function: { name: string; arguments: string }
          }>
        }
      }>
      usage?: { prompt_tokens: number; completion_tokens: number }
      model?: string
    }

    const choice = json.choices?.[0]?.message
    const content = choice?.content ?? ''
    const toolCalls = choice?.tool_calls
    const modelUsed = json.model ?? model

    const FREE_MODELS = new Set(['openrouter/owl-alpha'])
    const isFree = modelUsed.endsWith(':free') || FREE_MODELS.has(modelUsed)
    const inputTokens = json.usage?.prompt_tokens ?? 0
    const costUsd = isFree ? 0 : (inputTokens / 1000) * 0.00025

    if (!toolCalls || toolCalls.length === 0) {
      return { content, model: modelUsed, latencyMs, costUsd }
    }

    // Execute tool calls and append results
    messages.push({ role: 'assistant', content: content || null, tool_calls: toolCalls })
    for (const tc of toolCalls) {
      const handler = tools.handlers[tc.function.name]
      let result: string
      if (handler) {
        try {
          const args = JSON.parse(tc.function.arguments)
          result = await handler(args)
        } catch (e) {
          result = JSON.stringify({ error: String(e) })
        }
      } else {
        result = JSON.stringify({ error: `Unknown tool: ${tc.function.name}` })
      }
      messages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: result,
      })
    }
  }

  const final = messages[messages.length - 1]
  return {
    content: (final?.content as string) ?? 'Tool call loop exceeded max turns',
    model,
    latencyMs: 0,
    costUsd: 0,
  }
}

async function researchWithTools(
  context: string,
  stage: string,
): Promise<{ content: string; model: string; latencyMs: number; costUsd: number }> {
  const model = STAGE_MODELS[stage] ?? 'openrouter/owl-alpha'
  const systemPrompt = `You are a DeFi research analyst for a Solana vault. You have access to tools that fetch real-time data.

Available adapters (only recommend these): Jupiter (swaps), Kamino (lending), Sanctum (liquid staking / jitoSOL), Meteora (liquidity).

Use the tools provided to gather real data before forming your analysis. For example:
- Call fetch_sol_price() to get current SOL price and trend
- Call fetch_defi_yields() to find best yields across protocols
- Call fetch_crypto_news() for recent market news
- Call search_web() if you need additional context

After gathering data, produce your analysis. Output valid JSON:
- "rationale": string — concise market + vault read backed by real data (2-4 sentences)
- "hypotheses": string[] — 2-3 concrete next steps based on actual data

IMPORTANT: Use at least 2 tools before generating your final response.`

  const tools = createResearchTools()
  return callLlmWithTools(model, systemPrompt, context, tools)
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
          {
            vaultPubkey,
            cycleId,
            stage,
            permissionLevel,
            context: params.context as Record<string, unknown> | undefined,
          },
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
      context: {
        priorStageOutputs: outputs.map((o) => ({
          stage: o.stage,
          rationale: o.rationale,
          candidateActions: o.actions,
          hypotheses: o.alerts,
        })),
      },
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

function parseLlmJson(content: string, stage: string): LlmResponse {
  const trimmed = content.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i)
  const candidate = (fenced?.[1] ?? trimmed).trim()
  try {
    return JSON.parse(candidate) as LlmResponse
  } catch {
    const objectMatch = candidate.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      return JSON.parse(objectMatch[0]) as LlmResponse
    }
    return { rationale: `LLM returned unparseable JSON for ${stage}: ${candidate.slice(0, 120)}` }
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
  const { vaultPubkey, stage, cycleId, permissionLevel, context } = input

  if (llmCall) {
    return evaluateStageWithLlm(input, deps, llmCall)
  }
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
  const stateData = stateResult.data as unknown as (VaultState & { formatted?: string }) | undefined

  if (!stateResult.success || !stateData) {
    const errorDetail = (stateResult.data as { error?: string } | undefined)?.error
    return {
      stage,
      decision: 'abort',
      rationale:
        errorDetail ??
        `VAULT_STATE_UNAVAILABLE: Could not load on-chain vault ${vaultPubkey}. Check RPC connectivity and vault address.`,
    }
  }

  const vaultState = stateData.formatted ?? formatVaultContext(stateData)

  // Build context string with stage-specific info
  let context = vaultState
  context += `\n\nAgent run: #${cycleId}\nPermission level: L${permLevel}\n`
  context += `DeFi adapters available: Jupiter (swap), Kamino (lend), Sanctum (LST stake), Meteora (LP).\n\n`

  const prior = input.context?.priorStageOutputs as
    | Array<{
        stage: string
        rationale?: string
        hypotheses?: string[]
        candidateActions?: string[]
        investmentGoal?: string
        riskScore?: number
      }>
    | undefined

  if (prior?.length) {
    context += '=== Prior stages this agent run ===\n'
    for (const p of prior) {
      context += `[${p.stage}] ${p.rationale ?? ''}\n`
      if (p.investmentGoal) context += `Investment goal: ${p.investmentGoal}\n`
      if (p.hypotheses?.length) context += `Hypotheses: ${p.hypotheses.join(' | ')}\n`
      if (p.candidateActions?.length) context += `Proposed actions: ${p.candidateActions.join(' | ')}\n`
      if (typeof p.riskScore === 'number') context += `Risk score: ${p.riskScore}\n`
    }
    context += '\n'
  }

  const strategyPrior = prior?.find((p) => p.stage === 'STRATEGIZING')
  if (
    strategyPrior?.candidateActions?.length &&
    (stage === 'RISK_REVIEW' || stage === 'SIMULATING' || stage === 'PERMISSION_GATE')
  ) {
    context += '=== MANDATORY: evaluate these proposed actions ===\n'
    for (const action of strategyPrior.candidateActions) {
      context += `- ${action}\n`
    }
    context += '\n'
  }

  // For SIMULATING, run the simulation first and include results
  if (stage === 'SIMULATING') {
    const simResult = await deps.simulationAction.handler({ allocation: {} })
    const simData = simResult.data as Record<string, unknown> | undefined
    context += `=== Simulation Results ===\nComposite score: ${simData?.compositeScore ?? 'N/A'}\nExpected return: ${simData?.expectedReturnBps ?? 'N/A'} bps\nExpected drawdown: ${simData?.expectedDrawdownBps ?? 'N/A'} bps\n`
  }

    let content: string
    let model: string
    let latencyMs: number
    let costUsd: number

    if (stage === 'RESEARCHING') {
      const r = await researchWithTools(context, stage)
      content = r.content
      model = r.model
      latencyMs = r.latencyMs
      costUsd = r.costUsd
    } else {
      const r = await llmCall(stage, context)
      content = r.content
      model = r.model
      latencyMs = r.latencyMs
      costUsd = r.costUsd
    }

  const parsed = parseLlmJson(content, stage)

  const rationale =
    parsed.rationale && !/^LLM response for /i.test(parsed.rationale)
      ? parsed.investmentGoal && stage === 'STRATEGIZING'
        ? `${parsed.investmentGoal}\n\n${parsed.rationale}`.trim()
        : parsed.rationale
      : parsed.investmentGoal ?? `Completed ${stage.replace(/_/g, ' ').toLowerCase()} assessment.`

  const base = {
    stage,
    rationale,
    llmCostUsd: costUsd,
    llmLatencyMs: latencyMs,
    llmModel: model,
  }

  switch (stage) {
    case 'RESEARCHING':
      return { ...base, decision: 'researched', alerts: parsed.hypotheses }
    case 'STRATEGIZING':
      return { ...base, decision: 'proposed_actions', actions: parsed.actions ?? [], alerts: parsed.investmentGoal ? [parsed.investmentGoal] : undefined }
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
