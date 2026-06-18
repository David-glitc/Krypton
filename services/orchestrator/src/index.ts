/**
 * Krypton Agent Pipeline Orchestrator
 *
 * Implements the 6-agent pipeline from PRD §3.2:
 *   Research → Strategy → Risk → Simulation → Permission Gate → Execute
 *
 * Each agent is a pure function that takes context and returns a result.
 * The orchestrator chains them together and emits events.
 */

import { EventEmitter } from 'node:events'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CycleState =
  | 'IDLE'
  | 'RESEARCHING'
  | 'STRATEGIZING'
  | 'RISK_REVIEW'
  | 'SIMULATING'
  | 'AWAITING_USER_SIGNATURE'
  | 'SUBMITTING'
  | 'EXECUTED'
  | 'REJECTED_ONCHAIN'
  | 'ABORTED'

export interface OrchestratorConfig {
  rpcUrl: string
  programId: string
  openRouterApiKey?: string
  /** Minimum composite score (0-1000) to auto-execute without user approval */
  autoExecuteThreshold?: number
  /** Vaults that require manual approval regardless of score */
  advisoryOnlyVaults?: string[]
}

export interface VaultContext {
  vaultId: string
  owner: string
  navUsd: number
  maxDrawdownBps: number
  maxLeverageBps: number
  maxPositionBps: number
  currentDrawdownBps: number
  currentLeverageBps: number
  currentConcentrationBps: number
  policyVersion: number
  paused: boolean
  /** User's stated goal (non-binding optimization signal) */
  goal?: {
    targetType: 'multiple' | 'apy' | 'preservation' | 'fixed_use_case'
    targetValue?: number
    timeHorizonDays: number
  }
}

export interface ResearchHypothesis {
  id: string
  actionType: 'Swap' | 'Lend' | 'Borrow' | 'Stake' | 'ProvideLiquidity' | 'OpenPerp' | 'ClosePerp' | 'Unstake'
  rationale: string
  expectedReturnPct: number
  expectedDrawdownPct: number
  var95Pct: number
  confidence: number // 0-1
  sources: string[]
}

export interface StrategyProposal {
  hypothesisId: string
  actionType: ResearchHypothesis['actionType']
  rationale: string
  expectedReturnPct: number
  expectedDrawdownPct: number
  var95Pct: number
  compositeScore: number // 0-1000
  postLeverageBps: number
  postConcentrationBps: number
  postDrawdownBps: number
}

export interface RiskReview {
  proposalId: string
  approved: boolean
  reason: string
  adjustedScore: number
  flags: string[]
}

export interface SimulationResult {
  proposalId: string
  passed: boolean
  simulatedReturnPct: number
  simulatedMaxDrawdownPct: number
  simulatedLeverageBps: number
  simulatedConcentrationBps: number
  scenarios: number
  failures: number
}

export interface PermissionDecision {
  proposalId: string
  decision: 'execute' | 'advisory_pending' | 'rejected'
  reason: string
}

export interface CycleResult {
  vaultId: string
  cycleId: number
  state: CycleState
  hypotheses: ResearchHypothesis[]
  proposals: StrategyProposal[]
  riskReviews: RiskReview[]
  simulations: SimulationResult[]
  permissionDecision?: PermissionDecision
  txSignature?: string
  error?: string
  startedAt: number
  completedAt?: number
}

// ---------------------------------------------------------------------------
// Agent implementations
// ---------------------------------------------------------------------------

/**
 * Research Agent: generates hypotheses based on market data and vault goal.
 * In Phase 2, this calls OpenRouter for LLM-based research.
 * For now, uses deterministic heuristics based on vault state.
 */
export function researchAgent(
  vault: VaultContext,
  _cycleId: number,
): ResearchHypothesis[] {
  const hypotheses: ResearchHypothesis[] = []

  // Heuristic: if drawdown is approaching limit, suggest de-risking
  const drawdownUtilization = vault.currentDrawdownBps / vault.maxDrawdownBps
  if (drawdownUtilization > 0.7) {
    hypotheses.push({
      id: `hyp-${Date.now()}-derisk`,
      actionType: 'Swap',
      rationale: `Drawdown utilization at ${(drawdownUtilization * 100).toFixed(0)}% — rotating to stables to reduce risk`,
      expectedReturnPct: 0.5,
      expectedDrawdownPct: -0.2,
      var95Pct: 1.0,
      confidence: 0.8,
      sources: ['constraint_engine', 'drawdown_velocity'],
    })
  }

  // Heuristic: if leverage is below max and goal is growth, suggest increasing yield
  const leverageUtilization = vault.currentLeverageBps / vault.maxLeverageBps
  if (leverageUtilization < 0.5 && vault.goal?.targetType === 'multiple') {
    hypotheses.push({
      id: `hyp-${Date.now()}-yield`,
      actionType: 'Stake',
      rationale: 'Low leverage utilization with growth target — staking SOL for yield',
      expectedReturnPct: 4.5,
      expectedDrawdownPct: 2.0,
      var95Pct: 5.0,
      confidence: 0.7,
      sources: ['goal_optimization', 'yield_opportunity'],
    })
  }

  // Heuristic: if concentration is high, suggest diversification
  const concentrationUtilization = vault.currentConcentrationBps / vault.maxPositionBps
  if (concentrationUtilization > 0.8) {
    hypotheses.push({
      id: `hyp-${Date.now()}-diversify`,
      actionType: 'Swap',
      rationale: `Position concentration at ${(concentrationUtilization * 100).toFixed(0)}% — diversifying to reduce single-asset risk`,
      expectedReturnPct: 0.2,
      expectedDrawdownPct: -0.5,
      var95Pct: 2.0,
      confidence: 0.75,
      sources: ['concentration_risk', 'policy_compliance'],
    })
  }

  // Default: if no urgent signals, suggest holding
  if (hypotheses.length === 0) {
    hypotheses.push({
      id: `hyp-${Date.now()}-hold`,
      actionType: 'Lend',
      rationale: 'No urgent risk signals — lending USDC for stable yield',
      expectedReturnPct: 3.0,
      expectedDrawdownPct: 0.1,
      var95Pct: 0.5,
      confidence: 0.6,
      sources: ['steady_state', 'yield_optimization'],
    })
  }

  return hypotheses
}

/**
 * Strategy Agent: ranks hypotheses and produces a proposal with post-trade state.
 */
export function strategyAgent(
  vault: VaultContext,
  hypotheses: ResearchHypothesis[],
): StrategyProposal[] {
  return hypotheses.map((hyp) => {
    // Calculate post-trade state
    const postLeverage = hyp.actionType === 'Stake'
      ? Math.min(vault.currentLeverageBps + 500, vault.maxLeverageBps)
      : vault.currentLeverageBps

    const postConcentration = hyp.actionType === 'Swap'
      ? Math.max(vault.currentConcentrationBps - 1000, 0)
      : vault.currentConcentrationBps + 200

    const postDrawdown = hyp.expectedDrawdownPct > 0
      ? vault.currentDrawdownBps + Math.round(hyp.expectedDrawdownPct * 100)
      : vault.currentDrawdownBps

    // Composite score: weighted combination of return, risk, and confidence
    const returnScore = Math.min(hyp.expectedReturnPct * 100, 400)
    const riskScore = Math.max(300 - hyp.var95Pct * 50, 0)
    const confidenceScore = hyp.confidence * 300
    const compositeScore = Math.round(returnScore + riskScore + confidenceScore)

    return {
      hypothesisId: hyp.id,
      actionType: hyp.actionType,
      rationale: hyp.rationale,
      expectedReturnPct: hyp.expectedReturnPct,
      expectedDrawdownPct: hyp.expectedDrawdownPct,
      var95Pct: hyp.var95Pct,
      compositeScore: Math.min(compositeScore, 1000),
      postLeverageBps: postLeverage,
      postConcentrationBps: postConcentration,
      postDrawdownBps: postDrawdown,
    }
  }).sort((a, b) => b.compositeScore - a.compositeScore)
}

/**
 * Risk Agent: reviews proposals against policy constraints.
 */
export function riskAgent(
  vault: VaultContext,
  proposals: StrategyProposal[],
): RiskReview[] {
  return proposals.map((proposal) => {
    const flags: string[] = []
    let approved = true

    if (proposal.postLeverageBps > vault.maxLeverageBps) {
      flags.push(`leverage ${proposal.postLeverageBps} > max ${vault.maxLeverageBps}`)
      approved = false
    }
    if (proposal.postConcentrationBps > vault.maxPositionBps) {
      flags.push(`concentration ${proposal.postConcentrationBps} > max ${vault.maxPositionBps}`)
      approved = false
    }
    if (proposal.postDrawdownBps > vault.maxDrawdownBps) {
      flags.push(`drawdown ${proposal.postDrawdownBps} > max ${vault.maxDrawdownBps}`)
      approved = false
    }
    if (proposal.var95Pct > 10) {
      flags.push(`VaR95 ${proposal.var95Pct}% exceeds 10% threshold`)
      approved = false
    }

    return {
      proposalId: proposal.hypothesisId,
      approved,
      reason: approved ? 'Within policy bounds' : flags.join('; '),
      adjustedScore: approved ? proposal.compositeScore : Math.round(proposal.compositeScore * 0.5),
      flags,
    }
  })
}

/**
 * Simulation Agent: Monte Carlo simulation of proposal outcomes.
 * In Phase 2, this calls krypton-sim-rs.
 * For now, uses deterministic stress testing.
 */
export function simulationAgent(
  vault: VaultContext,
  proposals: StrategyProposal[],
  riskReviews: RiskReview[],
): SimulationResult[] {
  return proposals.map((proposal, i) => {
    const risk = riskReviews[i]
    if (!risk.approved) {
      return {
        proposalId: proposal.hypothesisId,
        passed: false,
        simulatedReturnPct: 0,
        simulatedMaxDrawdownPct: proposal.expectedDrawdownPct,
        simulatedLeverageBps: proposal.postLeverageBps,
        simulatedConcentrationBps: proposal.postConcentrationBps,
        scenarios: 0,
        failures: 1,
      }
    }

    // Deterministic stress test: simulate 100 scenarios
    const scenarios = 100
    let failures = 0
    let totalReturn = 0
    let maxDrawdown = 0

    for (let s = 0; s < scenarios; s++) {
      // Simple random walk simulation
      const shock = (Math.random() - 0.5) * proposal.var95Pct * 2
      const scenarioReturn = proposal.expectedReturnPct + shock
      totalReturn += scenarioReturn

      if (scenarioReturn < 0) {
        maxDrawdown = Math.max(maxDrawdown, Math.abs(scenarioReturn))
      }

      // Check if this scenario violates constraints
      const simLeverage = proposal.postLeverageBps + Math.round(shock * 100)
      const simConcentration = proposal.postConcentrationBps + Math.round(shock * 50)
      if (simLeverage > vault.maxLeverageBps || simConcentration > vault.maxPositionBps) {
        failures++
      }
    }

    const failureRate = failures / scenarios
    const passed = failureRate < 0.1 // Less than 10% failure rate

    return {
      proposalId: proposal.hypothesisId,
      passed,
      simulatedReturnPct: totalReturn / scenarios,
      simulatedMaxDrawdownPct: maxDrawdown,
      simulatedLeverageBps: proposal.postLeverageBps,
      simulatedConcentrationBps: proposal.postConcentrationBps,
      scenarios,
      failures,
    }
  })
}

/**
 * Permission Gate: decides whether to execute, hold for advisory, or reject.
 */
export function permissionGate(
  vault: VaultContext,
  proposals: StrategyProposal[],
  riskReviews: RiskReview[],
  simulations: SimulationResult[],
  config: OrchestratorConfig,
): PermissionDecision {
  // Find the best approved proposal
  const best = proposals
    .map((p, i) => ({ proposal: p, risk: riskReviews[i], sim: simulations[i] }))
    .filter(({ risk, sim }) => risk.approved && sim.passed)
    .sort((a, b) => b.proposal.compositeScore - a.proposal.compositeScore)[0]

  if (!best) {
    return {
      proposalId: proposals[0]?.hypothesisId ?? 'none',
      decision: 'rejected',
      reason: 'No proposals passed risk review and simulation',
    }
  }

  // Check if vault is advisory-only
  if (config.advisoryOnlyVaults?.includes(vault.vaultId)) {
    return {
      proposalId: best.proposal.hypothesisId,
      decision: 'advisory_pending',
      reason: 'Vault is in advisory-only mode — requires manual approval',
    }
  }

  // Auto-execute if score is high enough
  if (best.proposal.compositeScore >= (config.autoExecuteThreshold ?? 700)) {
    return {
      proposalId: best.proposal.hypothesisId,
      decision: 'execute',
      reason: `Score ${best.proposal.compositeScore} >= threshold ${config.autoExecuteThreshold ?? 700}`,
    }
  }

  return {
    proposalId: best.proposal.hypothesisId,
    decision: 'advisory_pending',
    reason: `Score ${best.proposal.compositeScore} below auto-execute threshold`,
  }
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

export interface Orchestrator {
  config: OrchestratorConfig
  state: CycleState
  emitter: EventEmitter
  startCycle: (vault: VaultContext) => Promise<CycleResult>
  on: (event: string, handler: (...args: unknown[]) => void) => void
}

export function createOrchestrator(config: OrchestratorConfig): Orchestrator {
  const emitter = new EventEmitter()
  let state: CycleState = 'IDLE'
  let cycleCounter = 0

  function setState(newState: CycleState) {
    state = newState
    emitter.emit('state', newState)
  }

  async function startCycle(vault: VaultContext): Promise<CycleResult> {
    const cycleId = ++cycleCounter
    const startedAt = Date.now()

    const result: CycleResult = {
      vaultId: vault.vaultId,
      cycleId,
      state: 'IDLE',
      hypotheses: [],
      proposals: [],
      riskReviews: [],
      simulations: [],
      startedAt,
    }

    emitter.emit('cycle:start', { vaultId: vault.vaultId, cycleId })

    try {
      // Step 1: Research
      setState('RESEARCHING')
      const hypotheses = researchAgent(vault, cycleId)
      result.hypotheses = hypotheses
      emitter.emit('agent:research', { cycleId, hypotheses })

      // Step 2: Strategy
      setState('STRATEGIZING')
      const proposals = strategyAgent(vault, hypotheses)
      result.proposals = proposals
      emitter.emit('agent:strategy', { cycleId, proposals })

      // Step 3: Risk Review
      setState('RISK_REVIEW')
      const riskReviews = riskAgent(vault, proposals)
      result.riskReviews = riskReviews
      emitter.emit('agent:risk', { cycleId, riskReviews })

      // Step 4: Simulation
      setState('SIMULATING')
      const simulations = simulationAgent(vault, proposals, riskReviews)
      result.simulations = simulations
      emitter.emit('agent:simulation', { cycleId, simulations })

      // Step 5: Permission Gate
      const decision = permissionGate(vault, proposals, riskReviews, simulations, config)
      result.permissionDecision = decision
      emitter.emit('gate:permission', { cycleId, decision })

      if (decision.decision === 'execute') {
        setState('SUBMITTING')
        // In Phase 2: submit transaction via LazorKit/Ika
        // For now, emit event for frontend to handle signing
        emitter.emit('cycle:submit', { cycleId, decision })
        result.txSignature = 'pending-signature'
        setState('AWAITING_USER_SIGNATURE')
      } else if (decision.decision === 'advisory_pending') {
        setState('AWAITING_USER_SIGNATURE')
        emitter.emit('cycle:advisory', { cycleId, decision })
      } else {
        setState('REJECTED_ONCHAIN')
        emitter.emit('cycle:rejected', { cycleId, decision })
      }

      result.state = state
      result.completedAt = Date.now()
      emitter.emit('cycle:complete', result)

      return result
    } catch (err) {
      setState('ABORTED')
      result.state = 'ABORTED'
      result.error = err instanceof Error ? err.message : String(err)
      result.completedAt = Date.now()
      emitter.emit('cycle:error', { cycleId, error: result.error })
      return result
    }
  }

  return {
    config,
    get state() { return state },
    emitter,
    startCycle,
    on: (event: string, handler: (...args: unknown[]) => void) => emitter.on(event, handler),
  }
}
