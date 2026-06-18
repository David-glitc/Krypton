import { describe, it, expect } from 'vitest'
import {
  createOrchestrator,
  researchAgent,
  strategyAgent,
  riskAgent,
  simulationAgent,
  permissionGate,
} from './index.js'

const BASE_VAULT = {
  vaultId: 'test-vault',
  owner: 'test-owner',
  navUsd: 10000,
  maxDrawdownBps: 1000,
  maxLeverageBps: 20000,
  maxPositionBps: 5000,
  currentDrawdownBps: 200,
  currentLeverageBps: 5000,
  currentConcentrationBps: 2000,
  policyVersion: 1,
  paused: false,
}

describe('researchAgent', () => {
  it('generates hypotheses for normal vault state', () => {
    const hyps = researchAgent(BASE_VAULT, 1)
    expect(hyps.length).toBeGreaterThan(0)
    expect(hyps[0]).toHaveProperty('id')
    expect(hyps[0]).toHaveProperty('actionType')
    expect(hyps[0]).toHaveProperty('rationale')
    expect(hyps[0].confidence).toBeGreaterThan(0)
    expect(hyps[0].confidence).toBeLessThanOrEqual(1)
  })

  it('generates de-risk hypothesis when drawdown is high', () => {
    const vault = { ...BASE_VAULT, currentDrawdownBps: 800 }
    const hyps = researchAgent(vault, 1)
    const derisk = hyps.find(h => h.rationale.includes('Drawdown'))
    expect(derisk).toBeDefined()
    expect(derisk!.actionType).toBe('Swap')
  })

  it('generates diversification hypothesis when concentration is high', () => {
    const vault = { ...BASE_VAULT, currentConcentrationBps: 4500 }
    const hyps = researchAgent(vault, 1)
    const diversify = hyps.find(h => h.rationale.includes('concentration'))
    expect(diversify).toBeDefined()
  })
})

describe('strategyAgent', () => {
  it('ranks proposals by composite score', () => {
    const hyps = researchAgent(BASE_VAULT, 1)
    const proposals = strategyAgent(BASE_VAULT, hyps)
    expect(proposals.length).toBeGreaterThan(0)
    // Should be sorted descending by score
    for (let i = 1; i < proposals.length; i++) {
      expect(proposals[i - 1].compositeScore).toBeGreaterThanOrEqual(proposals[i].compositeScore)
    }
  })

  it('calculates post-trade state', () => {
    const hyps = [{ id: 'h1', actionType: 'Stake' as const, rationale: 'test', expectedReturnPct: 5, expectedDrawdownPct: 2, var95Pct: 3, confidence: 0.8, sources: [] }]
    const proposals = strategyAgent(BASE_VAULT, hyps)
    expect(proposals[0].postLeverageBps).toBeGreaterThan(BASE_VAULT.currentLeverageBps)
  })
})

describe('riskAgent', () => {
  it('approves proposals within policy bounds', () => {
    const hyps = researchAgent(BASE_VAULT, 1)
    const proposals = strategyAgent(BASE_VAULT, hyps)
    const reviews = riskAgent(BASE_VAULT, proposals)
    expect(reviews.length).toBe(proposals.length)
    // At least one should be approved
    expect(reviews.some(r => r.approved)).toBe(true)
  })

  it('rejects proposals exceeding leverage limit', () => {
    const proposals = [{ hypothesisId: 'h1', actionType: 'Swap' as const, rationale: 'test', expectedReturnPct: 5, expectedDrawdownPct: 2, var95Pct: 3, compositeScore: 800, postLeverageBps: 99999, postConcentrationBps: 1000, postDrawdownBps: 100 }]
    const reviews = riskAgent(BASE_VAULT, proposals)
    expect(reviews[0].approved).toBe(false)
    expect(reviews[0].flags.some(f => f.includes('leverage'))).toBe(true)
  })
})

describe('simulationAgent', () => {
  it('passes approved proposals', () => {
    const hyps = researchAgent(BASE_VAULT, 1)
    const proposals = strategyAgent(BASE_VAULT, hyps)
    const riskReviews = riskAgent(BASE_VAULT, proposals)
    const sims = simulationAgent(BASE_VAULT, proposals, riskReviews)
    expect(sims.length).toBe(proposals.length)
    expect(sims[0]).toHaveProperty('scenarios')
    expect(sims[0]).toHaveProperty('failures')
    expect(sims[0].scenarios).toBe(100)
  })

  it('fails rejected proposals', () => {
    const proposals = [{ hypothesisId: 'h1', actionType: 'Swap' as const, rationale: 'test', expectedReturnPct: 5, expectedDrawdownPct: 2, var95Pct: 3, compositeScore: 800, postLeverageBps: 99999, postConcentrationBps: 1000, postDrawdownBps: 100 }]
    const riskReviews = [{ proposalId: 'h1', approved: false, reason: 'exceeds limits', adjustedScore: 400, flags: ['leverage'] }]
    const sims = simulationAgent(BASE_VAULT, proposals, riskReviews)
    expect(sims[0].passed).toBe(false)
  })
})

describe('permissionGate', () => {
  it('rejects when no proposals pass', () => {
    const decision = permissionGate(BASE_VAULT, [], [], [], { rpcUrl: 'x', programId: 'y' })
    expect(decision.decision).toBe('rejected')
  })

  it('advisory-locks vaults in advisoryOnlyVaults', () => {
    const hyps = researchAgent(BASE_VAULT, 1)
    const proposals = strategyAgent(BASE_VAULT, hyps)
    const riskReviews = riskAgent(BASE_VAULT, proposals)
    const sims = simulationAgent(BASE_VAULT, proposals, riskReviews)
    const decision = permissionGate(
      BASE_VAULT,
      proposals,
      riskReviews,
      sims,
      { rpcUrl: 'x', programId: 'y', advisoryOnlyVaults: ['test-vault'] },
    )
    expect(decision.decision).toBe('advisory_pending')
  })
})

describe('createOrchestrator', () => {
  it('creates an orchestrator with IDLE state', () => {
    const orch = createOrchestrator({ rpcUrl: 'x', programId: 'y' })
    expect(orch.state).toBe('IDLE')
  })

  it('runs a full cycle', async () => {
    const orch = createOrchestrator({ rpcUrl: 'x', programId: 'y' })
    const events: string[] = []
    orch.on('cycle:start', () => events.push('start'))
    orch.on('agent:research', () => events.push('research'))
    orch.on('agent:strategy', () => events.push('strategy'))
    orch.on('agent:risk', () => events.push('risk'))
    orch.on('agent:simulation', () => events.push('simulation'))
    orch.on('gate:permission', () => events.push('gate'))
    orch.on('cycle:complete', () => events.push('complete'))

    const result = await orch.startCycle(BASE_VAULT)

    expect(result.vaultId).toBe('test-vault')
    expect(result.hypotheses.length).toBeGreaterThan(0)
    expect(result.proposals.length).toBeGreaterThan(0)
    expect(result.riskReviews.length).toBeGreaterThan(0)
    expect(result.simulations.length).toBeGreaterThan(0)
    expect(result.permissionDecision).toBeDefined()
    expect(events).toContain('start')
    expect(events).toContain('research')
    expect(events).toContain('complete')
  })
})
