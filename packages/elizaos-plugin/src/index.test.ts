import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  createConstraintCheckAction,
  createVaultStateProvider,
  createSimulationAction,
  createCycleEvaluator,
  createOpenRouterLlmCall,
  formatVaultState,
  CYCLE_STAGES,
  runCycle,
  type CycleEvaluatorResult,
} from './index.js'

import type { ConstraintCheckParams, ConstraintCheckResult, VaultState, SimulationResult } from './types.js'

describe('CYCLE_STAGES', () => {
  it('has exactly 6 stages in order', () => {
    expect(CYCLE_STAGES).toEqual([
      'RESEARCHING',
      'STRATEGIZING',
      'RISK_REVIEW',
      'SIMULATING',
      'PERMISSION_GATE',
      'MONITORING',
    ])
  })
})

describe('createConstraintCheckAction', () => {
  it('returns action with correct metadata', () => {
    const checker = vi.fn()
    const action = createConstraintCheckAction(checker)
    expect(action.name).toBe('CONSTRAINT_CHECK')
    expect(action.similes).toContain('CHECK_CONSTRAINTS')
  })

  it('validate returns false for missing params', async () => {
    const action = createConstraintCheckAction(vi.fn())
    const valid = await action.validate({})
    expect(valid).toBe(false)
  })

  it('validate returns true for valid params', async () => {
    const action = createConstraintCheckAction(vi.fn())
    const valid = await action.validate({
      postLeverageBps: 1500,
      postConcentrationBps: 3000,
      postDrawdownBps: 500,
    })
    expect(valid).toBe(true)
  })

  it('handler returns passed result from checker', async () => {
    const checker = vi.fn(async (_p: ConstraintCheckParams): Promise<ConstraintCheckResult> => ({
      passed: true,
    }))
    const action = createConstraintCheckAction(checker)
    const result = await action.handler({
      vaultPubkey: 'abc',
      postLeverageBps: 1000,
      postConcentrationBps: 2000,
      postDrawdownBps: 300,
    })
    expect(result.success).toBe(true)
    expect(result.data?.passed).toBe(true)
  })

  it('handler returns failed result from checker', async () => {
    const checker = vi.fn(async (_p: ConstraintCheckParams): Promise<ConstraintCheckResult> => ({
      passed: false,
      error: 'Leverage exceeds max',
    }))
    const action = createConstraintCheckAction(checker)
    const result = await action.handler({
      vaultPubkey: 'abc',
      postLeverageBps: 9999,
      postConcentrationBps: 2000,
      postDrawdownBps: 300,
    })
    expect(result.success).toBe(false)
    expect(result.error).toBe('Leverage exceeds max')
  })

  it('passes correct bigint params to checker', async () => {
    const checker = vi.fn(async (p: ConstraintCheckParams): Promise<ConstraintCheckResult> => {
      expect(p.postLeverageBps).toBe(1500n)
      expect(p.postConcentrationBps).toBe(3000n)
      expect(p.postDrawdownBps).toBe(500n)
      expect(p.postCorrelatedBps).toBe(0n)
      return { passed: true }
    })
    const action = createConstraintCheckAction(checker)
    await action.handler({
      vaultPubkey: 'abc',
      postLeverageBps: 1500,
      postConcentrationBps: 3000,
      postDrawdownBps: 500,
    })
    expect(checker).toHaveBeenCalledTimes(1)
  })
})

describe('createVaultStateProvider', () => {
  const mockState: VaultState = {
    vaultPubkey: 'vault123',
    navUsd: 1_000_000,
    paused: false,
    constraints: {
      maxLeverageBps: 2000,
      maxDrawdownBps: 1000,
      maxPositionBps: 3500,
      currentLeverageBps: 500,
      currentDrawdownBps: 200,
      currentConcentrationBps: 1500,
      lastOracleUpdate: Date.now() / 1000,
    },
  }

  it('returns failed result when no vaultPubkey', async () => {
    const fetcher = vi.fn()
    const provider = createVaultStateProvider(fetcher)
    const result = await provider.get(null, {})
    expect(result.success).toBe(false)
    expect(result.data.error).toContain('vaultPubkey')
  })

  it('fetches and returns vault state', async () => {
    const fetcher = vi.fn(async () => mockState)
    const provider = createVaultStateProvider(fetcher)
    const result = await provider.get(null, { vaultPubkey: 'vault123' })
    expect(result.success).toBe(true)
    expect(result.data.vaultPubkey).toBe('vault123')
    expect(result.data.navUsd).toBe(1_000_000)
  })

  it('returns failed when fetcher returns null', async () => {
    const fetcher = vi.fn(async () => null)
    const provider = createVaultStateProvider(fetcher)
    const result = await provider.get(null, { vaultPubkey: 'nonexistent' })
    expect(result.success).toBe(false)
  })

  it('applies custom formatter when provided', async () => {
    const formatter = (s: VaultState) => `Formatted: ${s.vaultPubkey}`
    const fetcher = vi.fn(async () => mockState)
    const provider = createVaultStateProvider(fetcher, formatter)
    const result = await provider.get(null, { vaultPubkey: 'vault123' })
    expect(result.data.formatted).toBe('Formatted: vault123')
  })

  it('default formatter includes constraint info', async () => {
    const fetcher = vi.fn(async () => mockState)
    const provider = createVaultStateProvider(fetcher)
    const result = await provider.get(null, { vaultPubkey: 'vault123' })
    expect(result.data.formatted).toContain('VAULT STATE')
    expect(result.data.formatted).toContain('500 / 2000 bps')
  })
})

describe('formatVaultState', () => {
  it('includes constraint details', () => {
    const state: VaultState = {
      vaultPubkey: 'abc123def456',
      navUsd: 500_000,
      paused: false,
      constraints: {
        maxLeverageBps: 2000,
        maxDrawdownBps: 1000,
        maxPositionBps: 3500,
        currentLeverageBps: 300,
        currentDrawdownBps: 100,
        currentConcentrationBps: 1200,
        lastOracleUpdate: 1_700_000_000,
      },
    }
    const result = formatVaultState(state)
    expect(result).toContain('abc123de')
    expect(result).toContain('300 / 2000')
    expect(result).toContain('100 / 1000')
    expect(result).toContain('1200 / 3500')
  })
})

describe('createSimulationAction', () => {
  it('validate returns false for missing allocation', async () => {
    const action = createSimulationAction(vi.fn())
    const valid = await action.validate({})
    expect(valid).toBe(false)
  })

  it('handler returns simulation result', async () => {
    const runner = vi.fn(async (_a: Record<string, number>): Promise<SimulationResult> => ({
      candidateId: 'sim-1',
      expectedReturnBps: 150,
      expectedDrawdownBps: 80,
      var95Bps: 120,
      compositeScore: 720,
      narrative: 'Good risk-adjusted return',
    }))
    const action = createSimulationAction(runner)
    const result = await action.handler({ allocation: { SOL: 0.5, USDC: 0.5 } })
    expect(result.success).toBe(true)
    expect(result.data?.compositeScore).toBe(720)
    expect(result.data?.narrative).toBe('Good risk-adjusted return')
  })
})

describe('createCycleEvaluator', () => {
  const makeChecker = () => {
    const fn = vi.fn(async (_p: ConstraintCheckParams): Promise<ConstraintCheckResult> => ({
      passed: true,
    }))
    return createConstraintCheckAction(fn)
  }

  const makeProvider = () => {
    const state: VaultState = {
      vaultPubkey: 'vault123',
      navUsd: 1_000_000,
      paused: false,
      constraints: {
        maxLeverageBps: 2000,
        maxDrawdownBps: 1000,
        maxPositionBps: 3500,
        currentLeverageBps: 500,
        currentDrawdownBps: 200,
        currentConcentrationBps: 1500,
        lastOracleUpdate: Date.now() / 1000,
      },
    }
    return createVaultStateProvider(async () => state)
  }

  const makeSim = () => {
    return createSimulationAction(async () => ({
      candidateId: 'sim-1',
      expectedReturnBps: 150,
      expectedDrawdownBps: 80,
      var95Bps: 120,
      compositeScore: 720,
      narrative: 'Good score',
    }))
  }

  it('runs all 6 stages successfully', async () => {
    const evaluator = createCycleEvaluator(makeChecker(), makeProvider(), makeSim())
    const result = await evaluator.handler({
      vaultPubkey: 'vault123',
      cycleId: 1,
      permissionLevel: 1,
    })
    expect(result.success).toBe(true)
    const cycleResult = result.data!.result as CycleEvaluatorResult
    expect(cycleResult.finalStage).toBe('MONITORING')
    expect(cycleResult.outputs).toHaveLength(6)
    expect(cycleResult.outputs.map((o) => o.stage)).toEqual([
      'RESEARCHING',
      'STRATEGIZING',
      'RISK_REVIEW',
      'SIMULATING',
      'PERMISSION_GATE',
      'MONITORING',
    ])
  })

  it('research stage includes vault state context', async () => {
    const evaluator = createCycleEvaluator(makeChecker(), makeProvider(), makeSim())
    const result = await evaluator.handler({
      vaultPubkey: 'vault123',
      cycleId: 1,
    })
    const research = (result.data!.result as CycleEvaluatorResult).outputs.find((o) => o.stage === 'RESEARCHING')
    expect(research?.rationale).toContain('loaded')
  })

  it('permission gate requests approval for level >= 2', async () => {
    const evaluator = createCycleEvaluator(makeChecker(), makeProvider(), makeSim())
    const result = await evaluator.handler({
      vaultPubkey: 'vault123',
      cycleId: 1,
      permissionLevel: 3,
    })
    const perm = (result.data!.result as CycleEvaluatorResult).outputs.find((o) => o.stage === 'PERMISSION_GATE')
    expect(perm?.decision).toBe('requires_approval')
  })

  it('permission gate auto-executes for level < 2', async () => {
    const evaluator = createCycleEvaluator(makeChecker(), makeProvider(), makeSim())
    const result = await evaluator.handler({
      vaultPubkey: 'vault123',
      cycleId: 1,
      permissionLevel: 1,
    })
    const perm = (result.data!.result as CycleEvaluatorResult).outputs.find((o) => o.stage === 'PERMISSION_GATE')
    expect(perm?.decision).toBe('auto_execute')
  })

  it('includes simulation score in simulation stage', async () => {
    const evaluator = createCycleEvaluator(makeChecker(), makeProvider(), makeSim())
    const result = await evaluator.handler({
      vaultPubkey: 'vault123',
      cycleId: 1,
    })
    const sim = (result.data!.result as CycleEvaluatorResult).outputs.find((o) => o.stage === 'SIMULATING')
    expect(sim?.rationale).toContain('720')
    expect(sim?.riskScore).toBe(0.72)
  })

  it('validate returns false for missing vaultPubkey', async () => {
    const evaluator = createCycleEvaluator(makeChecker(), makeProvider(), makeSim())
    const valid = await evaluator.validate({})
    expect(valid).toBe(false)
  })

  it('validate returns false for missing cycleId', async () => {
    const evaluator = createCycleEvaluator(makeChecker(), makeProvider(), makeSim())
    const valid = await evaluator.validate({ vaultPubkey: 'abc' })
    expect(valid).toBe(false)
  })

  it('validate returns true for valid params', async () => {
    const evaluator = createCycleEvaluator(makeChecker(), makeProvider(), makeSim())
    const valid = await evaluator.validate({ vaultPubkey: 'abc', cycleId: 1 })
    expect(valid).toBe(true)
  })
})

describe('createOpenRouterLlmCall', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns a function', () => {
    const llmCall = createOpenRouterLlmCall('sk-test-key')
    expect(typeof llmCall).toBe('function')
  })

  it('sends POST to OpenRouter with correct headers', async () => {
    const mockFetch = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: '{"rationale":"test"}' } }],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      }),
      text: () => Promise.resolve(''),
    } as unknown as Response)
    vi.stubGlobal('fetch', mockFetch)

    const llmCall = createOpenRouterLlmCall('sk-test-key')
    await llmCall('RESEARCHING', 'vault context')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, opts] = mockFetch.mock.calls[0]!
    expect(url).toBe('https://openrouter.ai/api/v1/chat/completions')
    expect((opts as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer sk-test-key',
      'Content-Type': 'application/json',
    })
  })

  it('returns content from LLM response', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: '{"rationale":"good","riskScore":0.5}' } }],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      }),
      text: () => Promise.resolve(''),
    } as unknown as Response))

    const llmCall = createOpenRouterLlmCall('sk-test-key')
    const result = await llmCall('RESEARCHING', 'context')
    expect(result.content).toBe('{"rationale":"good","riskScore":0.5}')
    expect(result.model).toBe('google/gemini-2.0-flash-exp:free')
    expect(result.costUsd).toBe(0)
    expect(result.latencyMs).toBeGreaterThanOrEqual(0)
  })

  it('uses free model for all stages', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: '{}' } }],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      }),
      text: () => Promise.resolve(''),
    } as unknown as Response))

    const llmCall = createOpenRouterLlmCall('sk-key')
    for (const stage of ['RESEARCHING', 'STRATEGIZING', 'RISK_REVIEW', 'SIMULATING', 'PERMISSION_GATE', 'MONITORING']) {
      const result = await llmCall(stage, 'ctx')
      expect(result.model).toBe('google/gemini-2.0-flash-exp:free')
    }
  })

  it('throws on non-200 response with body text', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: () => Promise.resolve('Unauthorized'),
    } as unknown as Response))

    const llmCall = createOpenRouterLlmCall('bad-key')
    await expect(llmCall('RESEARCHING', 'ctx')).rejects.toThrow('OpenRouter 401: Unauthorized')
  })
})

describe('runCycle', () => {
  it('runs all 6 stages and returns outputs', async () => {
    const result = await runCycle('vault123', 1, 1, {
      constraintCheckAction: createConstraintCheckAction(async () => ({ passed: true })),
      vaultStateProvider: createVaultStateProvider(async () => ({
        vaultPubkey: 'vault123',
        navUsd: 1_000_000,
        paused: false,
        constraints: {
          maxLeverageBps: 2000,
          maxDrawdownBps: 1000,
          maxPositionBps: 3500,
          currentLeverageBps: 500,
          currentDrawdownBps: 200,
          currentConcentrationBps: 1500,
          lastOracleUpdate: Date.now() / 1000,
        },
      })),
      simulationAction: createSimulationAction(async () => ({
        candidateId: 'sim-1',
        expectedReturnBps: 150,
        expectedDrawdownBps: 80,
        var95Bps: 120,
        compositeScore: 720,
        narrative: 'Good score',
      })),
    })

    expect(result.finalStage).toBe('MONITORING')
    expect(result.outputs).toHaveLength(6)
    expect(result.outputs.map((o) => o.stage)).toEqual(CYCLE_STAGES)
  })

  it('includes cycle cost tracking in outputs when LLM is configured', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: '{"rationale":"llm research"}' } }],
        usage: { prompt_tokens: 100, completion_tokens: 50 },
      }),
      text: () => Promise.resolve(''),
    } as unknown as Response))

    const llmCall = createOpenRouterLlmCall('sk-key')
    const evaluator = createCycleEvaluator(
      createConstraintCheckAction(async () => ({ passed: true })),
      createVaultStateProvider(async () => ({
        vaultPubkey: 'vault123',
        navUsd: 1_000_000,
        paused: false,
        constraints: {
          maxLeverageBps: 2000, maxDrawdownBps: 1000, maxPositionBps: 3500,
          currentLeverageBps: 500, currentDrawdownBps: 200, currentConcentrationBps: 1500,
          lastOracleUpdate: Date.now() / 1000,
        },
      })),
      createSimulationAction(async () => ({
        candidateId: 'sim-1', expectedReturnBps: 150, expectedDrawdownBps: 80,
        var95Bps: 120, compositeScore: 720, narrative: 'Good',
      })),
      llmCall,
    )

    const result = await evaluator.handler({ vaultPubkey: 'vault123', cycleId: 1, stage: 'RESEARCHING' })
    const output = (result.data!.result as CycleEvaluatorResult).outputs[0]!
    expect(output.llmCostUsd).toBe(0)
    expect(output.llmLatencyMs).toBeGreaterThanOrEqual(0)
    expect(output.llmModel).toBe('google/gemini-2.0-flash-exp:free')
  })
})
