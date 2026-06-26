import type { Action, ActionResult, ConstraintCheckParams, ConstraintCheckResult } from './types.js'

/**
 * Constraint-action: on-chain policy gate.
 * Called by the agent before any DeFi action to verify the proposed
 * state would still pass all 8 constraint engine checks on-chain.
 */
export function createConstraintCheckAction(
  checker: (params: ConstraintCheckParams) => Promise<ConstraintCheckResult>,
): Action {
  return {
    name: 'CONSTRAINT_CHECK',
    description: 'Verify a proposed action would pass on-chain constraint policy. Call this before every trade, deposit, borrow, or rebalance.',
    similes: ['CHECK_CONSTRAINTS', 'VERIFY_POLICY', 'VALIDATE_ACTION', 'GATE_CHECK'],
    validate: async (params) => {
      return (
        typeof params.postLeverageBps === 'number' &&
        typeof params.postConcentrationBps === 'number' &&
        typeof params.postDrawdownBps === 'number'
      )
    },
    handler: async (params): Promise<ActionResult> => {
      const checkParams: ConstraintCheckParams = {
        vaultPubkey: params.vaultPubkey as string,
        postLeverageBps: BigInt(params.postLeverageBps as number),
        postConcentrationBps: BigInt(params.postConcentrationBps as number),
        postDrawdownBps: BigInt(params.postDrawdownBps as number),
        postCorrelatedBps: BigInt((params.postCorrelatedBps as number) ?? 0),
        targetProtocolId: (params.targetProtocolId as number) ?? 0,
      }

      const result: ConstraintCheckResult = await checker(checkParams)

      return {
        success: result.passed,
        data: {
          passed: result.passed,
          error: result.error ?? null,
          postLeverageBps: params.postLeverageBps,
          postConcentrationBps: params.postConcentrationBps,
          postDrawdownBps: params.postDrawdownBps,
        },
        error: result.error,
      }
    },
    examples: [
      {
        input: { vaultPubkey: 'abc123', postLeverageBps: 1500, postConcentrationBps: 3000, postDrawdownBps: 500 },
        output: { passed: true, error: null },
      },
    ],
  }
}
