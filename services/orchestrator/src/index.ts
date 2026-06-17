/**
 * Phase 2 stub — agent pipeline orchestrator lands here.
 * @see .cursor/skills/krypton-ai-harness/SKILL.md
 */

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
}

export function createOrchestratorStub(config: OrchestratorConfig) {
  return {
    config,
    state: 'IDLE' as CycleState,
    async startCycle(_vaultId: string) {
      console.info('[orchestrator] Phase 2 — cycle not yet implemented', _vaultId)
    },
  }
}

