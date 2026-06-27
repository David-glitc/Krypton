export type CycleStage =
  | 'RESEARCHING'
  | 'STRATEGIZING'
  | 'RISK_REVIEW'
  | 'SIMULATING'
  | 'PERMISSION_GATE'
  | 'MONITORING'

export const CYCLE_STAGES: CycleStage[] = [
  'RESEARCHING',
  'STRATEGIZING',
  'RISK_REVIEW',
  'SIMULATING',
  'PERMISSION_GATE',
  'MONITORING',
]

export interface AgentContext {
  vaultPubkey: string
  cycleId: number
  permissionLevel: number
}

export interface BaseAgentOutput {
  rationale: string
  stub: boolean
  generatedAt: number
}

export interface ResearchOutput extends BaseAgentOutput {
  stage: 'RESEARCHING'
  hypotheses: string[]
}

export interface StrategyOutput extends BaseAgentOutput {
  stage: 'STRATEGIZING'
  candidateActions: string[]
}

export interface RiskReviewOutput extends BaseAgentOutput {
  stage: 'RISK_REVIEW'
  riskScore: number
  flags: string[]
}

export interface SimulationOutput extends BaseAgentOutput {
  stage: 'SIMULATING'
  projectedReturnBps: number
  projectedMaxDrawdownBps: number
}

export interface PermissionGateOutput extends BaseAgentOutput {
  stage: 'PERMISSION_GATE'
  requiresUserApproval: boolean
  permissionLevel: number
}

export interface MonitoringOutput extends BaseAgentOutput {
  stage: 'MONITORING'
  alerts: string[]
}

export type AgentOutput =
  | ResearchOutput
  | StrategyOutput
  | RiskReviewOutput
  | SimulationOutput
  | PermissionGateOutput
  | MonitoringOutput

export interface CycleFsmResult {
  finalStage: CycleStage
  outputs: AgentOutput[]
}

