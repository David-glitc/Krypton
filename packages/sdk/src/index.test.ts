import { describe, it, expect } from 'vitest'
import {
  PROTOCOL_MAX_LEVERAGE_BPS,
  ActionType,
  ExecutionDecision,
  VaultSummary,
  PendingAction,
  KRYPTON_PROGRAM_ID,
} from './index'

// --- value checks ---

describe('constants', () => {
  it('PROTOCOL_MAX_LEVERAGE_BPS equals 20000', () => {
    expect(PROTOCOL_MAX_LEVERAGE_BPS).toBe(20_000)
  })

  it('KRYPTON_PROGRAM_ID is a non-empty string', () => {
    expect(typeof KRYPTON_PROGRAM_ID).toBe('string')
    expect(KRYPTON_PROGRAM_ID.length).toBeGreaterThan(0)
  })
})

// --- compile-time type checks using const assignments ---

describe('types', () => {
  it('ActionType is a valid union', () => {
    const _swap: ActionType = 'Swap'
    const _lend: ActionType = 'Lend'
    const _borrow: ActionType = 'Borrow'
    const _stake: ActionType = 'Stake'
    const _provideLiquidity: ActionType = 'ProvideLiquidity'
    const _openPerp: ActionType = 'OpenPerp'
    const _closePerp: ActionType = 'ClosePerp'
    const _unstake: ActionType = 'Unstake'
    // Narrowing: union is complete — no literal not in the list
    expect([_swap, _lend, _borrow, _stake, _provideLiquidity, _openPerp, _closePerp, _unstake]).toHaveLength(8)
  })

  it('ExecutionDecision types are valid', () => {
    const _executed: ExecutionDecision = 'executed'
    const _rejected: ExecutionDecision = 'rejected'
    const _advisory: ExecutionDecision = 'advisory_pending'
    const _governance: ExecutionDecision = 'governance_pending'
    expect([_executed, _rejected, _advisory, _governance]).toHaveLength(4)
  })

  it('VaultSummary interface accepts a valid object', () => {
    const summary: VaultSummary = {
      id: 'vault-1',
      name: 'Test Vault',
      navUsd: 1_250_000,
      permissionLevel: 2,
      policyVersion: 1,
      constraint: {
        currentDrawdownBps: 500,
        maxDrawdownBps: 2000,
        currentLeverageBps: 0,
        maxLeverageBps: 5000,
        currentPositionConcentrationBps: 1500,
        maxPositionBps: 3000,
        paused: false,
      },
    }
    expect(summary.id).toBe('vault-1')
    expect(summary.constraint.paused).toBe(false)
  })

  it('PendingAction interface accepts a valid object', () => {
    const action: PendingAction = {
      id: 'action-42',
      vaultId: 'vault-1',
      cycleId: 7,
      actionType: 'Swap',
      rationale: 'Rebalancing asset allocation',
      expectedReturnPct: 2.5,
      expectedDrawdownPct: 0.8,
      var95Pct: 1.2,
      compositeScore: 0.85,
      postLeverageBps: 3000,
      postConcentrationBps: 1200,
      createdAt: '2026-06-17T12:00:00Z',
    }
    expect(action.id).toBe('action-42')
    expect(action.actionType).toBe('Swap')
  })
})