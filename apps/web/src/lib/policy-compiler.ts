import {
  assessFeasibility,
  PRESET_FUND_MANAGERS,
  type VaultGoal,
  type PolicyBuilderForm,
  type FeasibilityResult,
} from '@krypton/policy-schema'

// ──────────────────────────────────────────
// Extracted Intent — deterministic parse result
// ──────────────────────────────────────────

export interface ExtractedIntent {
  /** Target multiple (e.g. 5 for "5x") */
  targetMultiple: number | null
  /** Target APY percentage (e.g. 10 for "10% APY") */
  targetApy: number | null
  /** Time horizon in days */
  timeHorizonDays: number | null
  /** Maximum drawdown percentage (e.g. 5 for "5%") */
  maxDrawdownPct: number | null
  /** Detected use case keyword */
  useCase: VaultGoal['use_case']
  /** Derived target type */
  targetType: VaultGoal['target_type']
  /** Derived target value (multiple or APY) */
  targetValue: number | null
  /** Matched preset ID, if any */
  matchedPresetId: string | null
  /** Whether any intent could be extracted */
  hasIntent: boolean
}

// ──────────────────────────────────────────
// Compilation Result — full pipeline output
// ──────────────────────────────────────────

export interface PolicyCompilationResult {
  /** The raw prompt that was parsed */
  prompt: string
  /** Structured intent extracted from the prompt */
  extracted_intent: ExtractedIntent
  /** Feasibility assessment, null if not enough data */
  feasibility: FeasibilityResult | null
  /** Preset match if one was identified */
  matched_preset: (typeof PRESET_FUND_MANAGERS)[number] | null
  /** Synthesized PolicyBuilderForm, null if not enough data */
  synthesized_form: PolicyBuilderForm | null
  /** Human-readable summary of the compilation */
  summary: string
}

// ──────────────────────────────────────────
// 1. Intent Extraction (deterministic)
// ──────────────────────────────────────────

/**
 * Extract a target multiple from the prompt (e.g. "5x" → 5).
 */
function extractTargetMultiple(normalized: string): number | null {
  // Match patterns: "5x", "5 x", "5X"
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*x\b/)
  return match ? parseFloat(match[1]) : null
}

/**
 * Extract a target APY from the prompt (e.g. "10% apy" → 10).
 */
function extractTargetApy(normalized: string): number | null {
  // Match patterns: "10%", "10 %", with optional "apy" or "yield" nearby
  const match = normalized.match(/(\d+(?:\.\d+)?)\s*%/)
  return match ? parseFloat(match[1]) : null
}

/**
 * Extract time horizon in days from the prompt.
 * Supports: "10 weeks", "6 months", "1 year", "30 days".
 */
function extractTimeHorizonDays(normalized: string): number | null {
  // Order matters: check longer units first to avoid "1 year" matching "1" then nothing
  const yearMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/)
  if (yearMatch) return Math.round(parseFloat(yearMatch[1]) * 365)

  const monthMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:months?|mos?)/)
  if (monthMatch) return Math.round(parseFloat(monthMatch[1]) * 30)

  const weekMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:weeks?|wks?|w\b)/)
  if (weekMatch) return Math.round(parseFloat(weekMatch[1]) * 7)

  const dayMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:days?|d\b)/)
  if (dayMatch) return Math.round(parseFloat(dayMatch[1]))

  return null
}

/**
 * Extract drawdown limit percentage from the prompt.
 * Patterns: "stop if down 5%", "5% drawdown", "max drawdown 10%", "max loss 10%".
 */
function extractDrawdownPct(normalized: string): number | null {
  // "stop if down X%" or "down X%"
  const downMatch = normalized.match(/(?:stop\s+if\s+)?down\s+(\d+(?:\.\d+)?)\s*%/)
  if (downMatch) return parseFloat(downMatch[1])

  // "drawdown X%" or "max drawdown X%"
  const ddMatch = normalized.match(/(?:max\s+)?drawdown\s+(?:limit\s+)?(?:of\s+)?(\d+(?:\.\d+)?)\s*%/)
  if (ddMatch) return parseFloat(ddMatch[1])

  // "max loss X%"
  const lossMatch = normalized.match(/max\s+loss\s+(\d+(?:\.\d+)?)\s*%/)
  if (lossMatch) return parseFloat(lossMatch[1])

  // "risk X%" (conservative interpretation)
  const riskMatch = normalized.match(/(?:max\s+)?risk\s+(\d+(?:\.\d+)?)\s*%/)
  if (riskMatch) return parseFloat(riskMatch[1])

  return null
}

/**
 * Detect use case from keywords in the prompt.
 */
function extractUseCase(normalized: string): VaultGoal['use_case'] {
  if (/\b(save|saving|preserve|preservation|hold|store|hodl)\b/.test(normalized))
    return 'save'
  if (/\b(collateral|borrow|lend|loan)\b/.test(normalized)) return 'collateral'
  if (/\b(deposit\s+box|onchain\s+deposit|vault\s+only)\b/.test(normalized))
    return 'onchain_deposit_box'
  if (
    /\b(speculate|speculative|yolo|degen|moon|100x|nfa)\b/.test(normalized)
  )
    return 'speculative_growth'
  if (/\b(compound|compounding|grow|growth|long\s*term|steady|sustainable)\b/.test(normalized))
    return 'compound'
  return undefined
}

/**
 * Match preset from use case and target signals.
 * Returns the best-matching preset or null.
 */
function matchPreset(
  useCase: VaultGoal['use_case'],
  targetMultiple: number | null,
  targetApy: number | null,
): (typeof PRESET_FUND_MANAGERS)[number] | null {
  // Keyword-driven matches (highest priority)
  if (useCase === 'save') return PRESET_FUND_MANAGERS.find((p) => p.id === 'stable-saver') ?? null
  if (useCase === 'collateral')
    return PRESET_FUND_MANAGERS.find((p) => p.id === 'collateral-vault') ?? null
  if (useCase === 'onchain_deposit_box')
    return PRESET_FUND_MANAGERS.find((p) => p.id === 'onchain-deposit-box') ?? null

  // Compound long term → steady-compounder
  if (useCase === 'compound' && !targetMultiple) {
    return PRESET_FUND_MANAGERS.find((p) => p.id === 'steady-compounder') ?? null
  }

  // Multiple-based matching
  if (targetMultiple !== null) {
    if (targetMultiple >= 5)
      return PRESET_FUND_MANAGERS.find((p) => p.id === 'aggressive-compounder') ?? null
    if (targetMultiple >= 2)
      return PRESET_FUND_MANAGERS.find((p) => p.id === 'growth-allocator') ?? null
    // 1x-2x with growth intent
    return PRESET_FUND_MANAGERS.find((p) => p.id === 'steady-compounder') ?? null
  }

  // APY-based matching
  if (targetApy !== null) {
    if (targetApy <= 10)
      return PRESET_FUND_MANAGERS.find((p) => p.id === 'steady-compounder') ?? null
    if (targetApy <= 25)
      return PRESET_FUND_MANAGERS.find((p) => p.id === 'growth-allocator') ?? null
    return PRESET_FUND_MANAGERS.find((p) => p.id === 'aggressive-compounder') ?? null
  }

  return null
}

/**
 * Full intent extraction pipeline.
 */
export function extractIntent(prompt: string): ExtractedIntent {
  const normalized = prompt.toLowerCase().replace(/\s+/g, ' ').trim()

  const targetMultiple = extractTargetMultiple(normalized)
  const targetApy = extractTargetApy(normalized)
  const timeHorizonDays = extractTimeHorizonDays(normalized)
  const maxDrawdownPct = extractDrawdownPct(normalized)
  const useCase = extractUseCase(normalized)
  const matchedPreset = matchPreset(useCase, targetMultiple, targetApy)

  // Derive targetType and targetValue
  let targetType: VaultGoal['target_type'] = 'multiple'
  let targetValue: number | null = null

  if (useCase === 'save') {
    targetType = 'preservation'
  } else if (useCase === 'collateral' || useCase === 'onchain_deposit_box') {
    targetType = 'fixed_use_case'
  } else if (targetApy !== null && targetMultiple === null) {
    targetType = 'apy'
    targetValue = targetApy
  } else if (targetMultiple !== null) {
    targetType = 'multiple'
    targetValue = targetMultiple
  } else if (matchedPreset) {
    targetType = matchedPreset.targetType
    if (matchedPreset.targetType === 'apy') {
      targetValue = 8 // implied APY for steady-compounder
    } else if (matchedPreset.targetType === 'multiple') {
      targetValue = 3 // implied for growth-allocator
    }
  }

  const hasIntent = !!(
    targetMultiple ||
    targetApy ||
    timeHorizonDays ||
    maxDrawdownPct ||
    useCase
  )

  return {
    targetMultiple,
    targetApy,
    timeHorizonDays,
    maxDrawdownPct,
    useCase,
    targetType,
    targetValue,
    matchedPresetId: matchedPreset?.id ?? null,
    hasIntent,
  }
}

// ──────────────────────────────────────────
// 2. Feasibility Check
// ──────────────────────────────────────────

/**
 * Run feasibility assessment from extracted intent.
 * Returns null if insufficient data for assessment.
 */
export function checkFeasibility(
  intent: ExtractedIntent,
): FeasibilityResult | null {
  if (!intent.targetType || intent.targetValue === null) return null

  const drawdown = intent.maxDrawdownPct ?? 15 // default 15% if not specified
  const horizon = intent.timeHorizonDays ?? 90 // default 90 days if not specified

  return assessFeasibility(intent.targetType, intent.targetValue, drawdown, horizon)
}

// ──────────────────────────────────────────
// 3. Policy Synthesis
// ──────────────────────────────────────────

/**
 * Synthesize a PolicyBuilderForm from extracted intent and preset match.
 * Returns null if there is no usable intent.
 */
export function synthesizeForm(
  intent: ExtractedIntent,
  preset: (typeof PRESET_FUND_MANAGERS)[number] | null,
): PolicyBuilderForm | null {
  if (!intent.hasIntent) return null

  if (preset) {
    // Build from preset defaults, overridden by any extracted drawdown/horizon
    const drawdown = intent.maxDrawdownPct ?? preset.maxDrawdownPct
    const leverage = preset.maxLeverage
    const positionPct = preset.maxPositionPct

    return {
      vaultName: '',
      governanceMode: 'owner',
      riskProfile:
        preset.riskProfile === 'low' || preset.riskProfile === 'medium' || preset.riskProfile === 'high'
          ? preset.riskProfile
          : preset.riskProfile === 'low-medium'
            ? 'medium'
            : 'custom',
      maxDrawdownPct: Math.min(drawdown, 50),
      maxLeverage: leverage,
      maxPositionPct: positionPct,
      assets: preset.assets.length > 0 ? [...preset.assets] : ['USDC'],
      protocols: preset.protocols.length > 0 ? [...preset.protocols] : ['kamino'],
      executionMode: preset.hardLockAdvisory ? 'advisory' : (preset.executionMode as PolicyBuilderForm['executionMode']),
      rebalanceFrequency: 'daily',
      permissionLevel: 2,
    }
  }

  // No preset matched — build form from extracted values
  const drawdown = intent.maxDrawdownPct ?? 12
  const horizon = intent.timeHorizonDays ?? 90

  // Map drawdown to a risk profile
  let riskProfile: PolicyBuilderForm['riskProfile'] = 'custom'
  if (drawdown <= 5) riskProfile = 'low'
  else if (drawdown <= 12) riskProfile = 'medium'
  else riskProfile = 'high'

  return {
    vaultName: '',
    governanceMode: 'owner',
    riskProfile,
    maxDrawdownPct: Math.min(drawdown, 50),
    maxLeverage: 2,
    maxPositionPct: 35,
    assets: ['SOL', 'USDC', 'USDT'],
    protocols: ['jupiter', 'kamino', 'sanctum'],
    executionMode: 'advisory',
    rebalanceFrequency: 'daily',
    permissionLevel: 2,
  }
}

// ──────────────────────────────────────────
// 4. Summary Generation
// ──────────────────────────────────────────

function buildSummary(
  intent: ExtractedIntent,
  feasibility: FeasibilityResult | null,
  preset: (typeof PRESET_FUND_MANAGERS)[number] | null,
): string {
  const parts: string[] = []

  if (!intent.hasIntent) {
    return 'No actionable intent could be extracted from the prompt. Please specify a target multiple, APY, time horizon, or use case.'
  }

  if (preset) {
    parts.push(`Matched preset: ${preset.name}`)
  }

  if (intent.targetType === 'multiple' && intent.targetValue !== null) {
    parts.push(`Target: ${intent.targetValue}x return`)
  } else if (intent.targetType === 'apy' && intent.targetValue !== null) {
    parts.push(`Target APY: ${intent.targetValue}%`)
  } else if (intent.targetType === 'preservation') {
    parts.push('Objective: Capital preservation')
  } else if (intent.targetType === 'fixed_use_case') {
    parts.push('Objective: Fixed use case')
  }

  if (intent.timeHorizonDays !== null) {
    parts.push(`Time horizon: ${intent.timeHorizonDays} days`)
  }

  if (intent.maxDrawdownPct !== null) {
    parts.push(`Max drawdown: ${intent.maxDrawdownPct}%`)
  }

  if (feasibility) {
    if (feasibility.status === 'infeasible') {
      parts.push(`⚠️ Not feasible: ${feasibility.negotiation_prompt}`)
    } else if (feasibility.status === 'feasible_with_conditions') {
      parts.push('Feasible with conditions.')
    } else {
      parts.push('Feasible within historical bands.')
    }
  }

  return parts.join('. ') + '.'
}

// ──────────────────────────────────────────
// 5. Main Entry Point
// ──────────────────────────────────────────

/**
 * Compile a user prompt into a structured PolicyCompilationResult.
 *
 * Pipeline:
 * 1. Extract structured intent (deterministic regex NLP)
 * 2. Match preset if intent aligns
 * 3. Run feasibility check
 * 4. Synthesize PolicyBuilderForm
 * 5. Generate human-readable summary
 *
 * @param prompt - Free-text user prompt (e.g. "I want 5x in 10 weeks")
 * @param presetId - Optional explicit preset override
 */
export function compilePolicy(
  prompt: string,
  presetId?: string,
): PolicyCompilationResult {
  // Step 1: Extract intent
  const intent = extractIntent(prompt)

  // Step 2: Preset selection (explicit override or auto-match)
  let preset: (typeof PRESET_FUND_MANAGERS)[number] | null = null

  if (presetId) {
    preset = PRESET_FUND_MANAGERS.find((p) => p.id === presetId) ?? null
    if (preset) {
      intent.matchedPresetId = preset.id
    }
  } else if (intent.matchedPresetId) {
    preset = PRESET_FUND_MANAGERS.find((p) => p.id === intent.matchedPresetId) ?? null
  }

  // Step 3: Feasibility check
  const feasibility = checkFeasibility(intent)

  // Step 4: Policy synthesis
  const synthesizedForm = synthesizeForm(intent, preset)

  // Step 5: Summary
  const summary = buildSummary(intent, feasibility, preset)

  return {
    prompt,
    extracted_intent: intent,
    feasibility,
    matched_preset: preset,
    synthesized_form: synthesizedForm,
    summary,
  }
}
