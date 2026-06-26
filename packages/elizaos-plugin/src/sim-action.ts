import type { Action, ActionResult, SimulationResult } from './types.js'

/**
 * Simulation action: runs Monte Carlo simulation via krypton-sim-rs.
 * Called during the SIMULATING stage to evaluate proposed allocations.
 */
export function createSimulationAction(
  runner: (allocation: Record<string, number>) => Promise<SimulationResult>,
): Action {
  return {
    name: 'RUN_SIMULATION',
    description: 'Run a Monte Carlo simulation of the proposed allocation. Returns expected return, drawdown, and VaR(95).',
    similes: ['SIMULATE', 'MONTE_CARLO', 'PROJECT_RETURNS', 'RUN_SIM'],
    validate: async (params) => {
      return typeof params.allocation === 'object' && params.allocation !== null
    },
    handler: async (params): Promise<ActionResult> => {
      const result = await runner(params.allocation as Record<string, number>)
      return {
        success: true,
        data: {
          candidateId: result.candidateId,
          expectedReturnBps: result.expectedReturnBps,
          expectedDrawdownBps: result.expectedDrawdownBps,
          var95Bps: result.var95Bps,
          compositeScore: result.compositeScore,
          narrative: result.narrative,
        },
      }
    },
    examples: [
      {
        input: { allocation: { SOL: 0.5, USDC: 0.3, jitoSOL: 0.2 } },
        output: { compositeScore: 720, narrative: 'Balanced allocation with moderate risk-adjusted return' },
      },
    ],
  }
}
