export type SessionStatus = 'active' | 'compiled' | 'abandoned'

export type CycleJobStatus = 'pending' | 'leased' | 'completed' | 'failed'

export type PendingActionStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface SessionMessage {
  role: MessageRole
  content: string
  at: number
}

export interface InteractiveSession {
  session_id: string
  owner_wallet: string
  vault_draft_id: string | null
  messages_json: string
  extracted_intent: string | null
  compiled_policy_draft: string | null
  status: SessionStatus
  created_at: number
  updated_at: number
  expires_at: number
}

export interface VaultRegistryEntry {
  vault_pubkey: string
  owner_wallet: string
  policy_id: string | null
  name: string | null
  permission_level: number
  tx_signature: string | null
  created_at: number
  updated_at: number
}

export interface CycleJob {
  id: string
  vault_pubkey: string
  cycle_id: number
  permission_level: number
  priority: number
  status: CycleJobStatus
  scheduled_at: number
  lease_owner: string | null
  lease_expires_at: number | null
  error: string | null
  created_at: number
  updated_at: number
}

export interface CycleRun {
  id: string
  vault_pubkey: string
  cycle_id: number
  job_id: string | null
  stage: string
  decision: string | null
  started_at: number
  completed_at: number | null
  error: string | null
}

export interface AgentInvocation {
  id: string
  vault_pubkey: string | null
  cycle_id: number | null
  session_id: string | null
  agent_role: string
  model_id: string | null
  prompt_hash: string | null
  response_hash: string | null
  cost_usd: number | null
  latency_ms: number | null
  status: string
  arweave_uri: string | null
  created_at: number
}

export interface ActivityEvent {
  id: string
  vault_pubkey: string
  event_type: string
  payload_json: string
  created_at: number
}

export interface PendingAction {
  id: string
  vault_pubkey: string
  cycle_id: number
  typed_action_json: string
  status: PendingActionStatus
  expires_at: number | null
  created_at: number
  updated_at: number
}

export interface RegisterVaultInput {
  vaultPubkey: string
  ownerWallet: string
  policyId?: string
  name?: string
  permissionLevel?: number
  txSignature?: string
}

export interface EnqueueCycleJobInput {
  vaultPubkey: string
  cycleId: number
  permissionLevel?: number
  priority?: number
  scheduledAt?: number
}

export interface AppendActivityInput {
  vaultPubkey: string
  eventType: string
  payload?: Record<string, unknown>
}
