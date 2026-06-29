import { Keypair, PublicKey } from '@solana/web3.js'

import {
  createCycleEvaluator,
  createConstraintCheckAction,
  createVaultStateProvider,
  createSimulationAction,
  createOpenRouterLlmCall,
  formatVaultState,
  CYCLE_STAGES,
  type ConstraintCheckParams,
  type VaultState as VaultStateType,
  type SimulationResult,
  type CycleStage,
  type LlmCallFn,
} from '@krypton/elizaos-plugin'

import { KryptonPlugin } from './plugins/krypton-plugin.js'

export { CYCLE_STAGES }
export type { LlmCallFn }

export interface CycleInput {
  vaultPubkey: string
  cycleId: number
  stage: string
  context: Record<string, unknown>
}

export interface CycleOutput {
  stage: string
  decision: string
  rationale: string
  actions?: string[]
  riskScore?: number
  alerts?: string[]
  llmCostUsd?: number
  llmLatencyMs?: number
  llmModel?: string
}

/**
 * AgentRuntime — wraps the @krypton/elizaos-plugin evaluator
 * with real on-chain connections and simulation runners.
 * Two-phase commit: approveAction (Phase 1), confirmAction/rejectAction (Phase 2).
 */
export class AgentRuntime {
  private plugin: KryptonPlugin
  private llmCall: LlmCallFn | null = null

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    character: { name: string; constraints?: any },
    pluginConfig: {
      rpcUrl: string
      vaultPubkey?: string
      programId: string
      authorityKeypair?: Keypair
    },
  ) {
    this.plugin = new KryptonPlugin(pluginConfig)

    const openRouterKey = process.env.OPENROUTER_API_KEY
    if (openRouterKey) {
      this.llmCall = createOpenRouterLlmCall(openRouterKey)
    }

    formatter = (state: VaultStateType) => {
      const c = character.constraints ?? {}
      return [
        formatVaultState(state),
        '',
        '=== CHARACTER PROFILE ===',
        `Name: ${character.name}`,
        `Allowed protocols: ${(c.allowedProtocols as string[] | undefined)?.join(', ') ?? 'none'}`,
        `Allowed actions: ${(c.allowedActions as string[] | undefined)?.join(', ') ?? 'none'}`,
      ].join('\n')
    }
  }

  getPlugin(): KryptonPlugin {
    return this.plugin
  }

  async approveAction(params: Parameters<KryptonPlugin['approveAction']>[0]): Promise<ReturnType<KryptonPlugin['approveAction']>> {
    return this.plugin.approveAction(params)
  }

  async confirmAction(vaultOwner: PublicKey, vaultNonce = 0): Promise<string> {
    return this.plugin.confirmAction(vaultOwner, vaultNonce)
  }

  async rejectAction(vaultOwner: PublicKey, vaultNonce = 0): Promise<string> {
    return this.plugin.rejectAction(vaultOwner, vaultNonce)
  }

  /**
   * Run a single cycle stage through the package's evaluator.
   */
  async runStage(input: CycleInput): Promise<CycleOutput> {
    const constraintChecker = (params: ConstraintCheckParams) =>
      this.plugin.constraintCheck({
        vaultPubkey: params.vaultPubkey,
        postLeverageBps: Number(params.postLeverageBps),
        postConcentrationBps: Number(params.postConcentrationBps),
        postDrawdownBps: Number(params.postDrawdownBps),
        postCorrelatedBps: Number(params.postCorrelatedBps),
        targetProtocolId: params.targetProtocolId,
      })

    const stateFetcher = async (vaultPubkey: string): Promise<VaultStateType | null> => {
      const s = await this.plugin.getVaultState(vaultPubkey)
      if (!s) return null
      return {
        vaultPubkey: s.vaultPubkey,
        navUsd: s.navUsd,
        paused: s.paused,
        constraints: {
          maxLeverageBps: s.constraintState.maxLeverageBps,
          maxDrawdownBps: s.constraintState.maxDrawdownBps,
          maxPositionBps: Math.max(s.constraintState.maxLeverageBps, 3500),
          currentLeverageBps: s.constraintState.currentLeverageBps,
          currentDrawdownBps: s.constraintState.currentDrawdownBps,
          currentConcentrationBps: s.constraintState.currentConcentrationBps,
          lastOracleUpdate: s.constraintState.lastOracleUpdate,
        },
      }
    }

    const simRunner = async (allocation: Record<string, number>): Promise<SimulationResult> => {
      return this.plugin.runSimulation(allocation)
    }

    const constraintAction = createConstraintCheckAction(constraintChecker)
    const vaultProvider = createVaultStateProvider(stateFetcher, formatter!)
    const simAction = createSimulationAction(simRunner)
    const evaluator = createCycleEvaluator(
      constraintAction,
      vaultProvider,
      simAction,
      this.llmCall ?? undefined,
    )

    const cycleInput: Record<string, unknown> = {
      vaultPubkey: input.vaultPubkey,
      cycleId: input.cycleId,
      stage: input.stage,
      permissionLevel: input.context?.permissionLevel ?? 1,
      context: input.context,
    }

    const evaluatorResult = await evaluator.handler(cycleInput)
    if (!evaluatorResult.success) {
      return {
        stage: input.stage,
        decision: 'error',
        rationale: evaluatorResult.error ?? 'Unknown evaluator error',
      }
    }

    const result = evaluatorResult.data?.result as
      | { outputs: Array<{ stage: string; decision: string; rationale: string; actions?: string[]; riskScore?: number; alerts?: string[] }> }
      | undefined

    if (!result) {
      return {
        stage: input.stage,
        decision: 'no_output',
        rationale: `Evaluator produced no result for ${input.stage}`,
      }
    }

    // In single-stage mode, outputs has exactly 1 entry matching the requested stage.
    // In full-cycle mode, find the matching stage output.
    const stageOutput = result.outputs.find((o) => o.stage === input.stage) ?? result.outputs[0]

    if (!stageOutput) {
      return {
        stage: input.stage,
        decision: 'no_output',
        rationale: `No output for stage ${input.stage}`,
      }
    }

    return stageOutput
  }
}

let formatter: ((state: VaultStateType) => string) | null = null
