/**
 * ElizaOS-compatible character file format.
 * These types match the ElizaOS v2 character schema so character files
 * are portable between the lightweight runtime and the full ElizaOS agent.
 */
export interface Character {
  name: string
  modelProvider: ModelProviderName
  settings?: CharacterSettings
  plugins: string[]
  clients?: string[]
  system?: string
  bio: string[]
  lore: string[]
  knowledge?: string[]
  goals?: CharacterGoal[]
  constraints?: KryptonConstraints
  style?: CharacterStyle
  topics?: string[]
  adjectives?: string[]
}

export type ModelProviderName =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'ollama'
  | 'deepseek'
  | 'openrouter'

export interface CharacterSettings {
  model: string
  temperature?: number
  maxTokens?: number
  frequency_penalty?: number
  presence_penalty?: number
  chains?: {
    solana?: SolanaSettings
  }
  secrets?: Record<string, string>
}

export interface SolanaSettings {
  allowedActions?: string[]
  allowedProtocols?: string[]
  maxSlippageBps?: number
  rpcUrl?: string
}

export interface CharacterGoal {
  name: string
  description: string
  condition?: string
}

export interface KryptonConstraints {
  maxLeverageBps: number
  maxDrawdownBps: number
  maxPositionBps: number
  maxCorrelatedExposureBps?: number
  allowedProtocols: string[]
  allowedActions: string[]
  allowedAssets: string[]
  rebalanceFrequency: 'event_driven' | 'hourly' | 'daily' | 'weekly' | 'never'
}

export interface CharacterStyle {
  all?: string[]
  chat?: string[]
  post?: string[]
}

/**
 * Capital Policy schema — the input to the character generator.
 */
export interface CapitalPolicy {
  objective: {
    type: string
    benchmark?: string
  }
  universe: {
    assets: string[]
    protocols_allowed: string[]
  }
  risk: {
    profile: string
    max_drawdown_pct: number
    max_leverage: number
    max_position_pct: number
    max_correlated_exposure_pct?: number
  }
  execution: {
    mode: string
    rebalance_frequency: string
  }
  allowed_actions?: string[]
  fees?: {
    management_bps: number
    performance_bps: number
  }
}

export interface VaultGoalInput {
  targetType: 'multiple' | 'apy' | 'preservation' | 'fixed_use_case'
  targetValue?: number
  timeHorizonDays: number
  description?: string
}
