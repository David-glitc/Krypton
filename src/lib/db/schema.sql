-- Krypton multi-tenant agent session storage

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS interactive_sessions (
  session_id TEXT PRIMARY KEY,
  owner_wallet TEXT NOT NULL,
  vault_draft_id TEXT,
  messages_json TEXT NOT NULL DEFAULT '[]',
  extracted_intent TEXT,
  compiled_policy_draft TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'compiled', 'abandoned')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_interactive_sessions_owner
  ON interactive_sessions (owner_wallet, status, expires_at);

CREATE TABLE IF NOT EXISTS vault_registry (
  vault_pubkey TEXT PRIMARY KEY,
  owner_wallet TEXT NOT NULL,
  policy_id TEXT,
  name TEXT,
  permission_level INTEGER NOT NULL DEFAULT 2,
  tx_signature TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vault_registry_owner
  ON vault_registry (owner_wallet);

CREATE TABLE IF NOT EXISTS cycle_jobs (
  id TEXT PRIMARY KEY,
  vault_pubkey TEXT NOT NULL,
  cycle_id INTEGER NOT NULL,
  permission_level INTEGER NOT NULL DEFAULT 2,
  priority INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'leased', 'completed', 'failed')),
  scheduled_at INTEGER NOT NULL,
  lease_owner TEXT,
  lease_expires_at INTEGER,
  error TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cycle_jobs_vault_status
  ON cycle_jobs (vault_pubkey, status);

CREATE INDEX IF NOT EXISTS idx_cycle_jobs_queue
  ON cycle_jobs (status, priority DESC, scheduled_at ASC);

CREATE TABLE IF NOT EXISTS cycle_runs (
  id TEXT PRIMARY KEY,
  vault_pubkey TEXT NOT NULL,
  cycle_id INTEGER NOT NULL,
  job_id TEXT REFERENCES cycle_jobs (id),
  stage TEXT NOT NULL,
  decision TEXT,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_cycle_runs_vault
  ON cycle_runs (vault_pubkey, cycle_id, started_at DESC);

CREATE TABLE IF NOT EXISTS agent_invocations (
  id TEXT PRIMARY KEY,
  vault_pubkey TEXT,
  cycle_id INTEGER,
  session_id TEXT,
  agent_role TEXT NOT NULL,
  model_id TEXT,
  prompt_hash TEXT,
  response_hash TEXT,
  cost_usd REAL,
  latency_ms INTEGER,
  status TEXT NOT NULL,
  arweave_uri TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_invocations_vault
  ON agent_invocations (vault_pubkey, cycle_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agent_invocations_session
  ON agent_invocations (session_id, created_at DESC);

CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY,
  vault_pubkey TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_events_vault
  ON activity_events (vault_pubkey, created_at DESC);

CREATE TABLE IF NOT EXISTS pending_actions (
  id TEXT PRIMARY KEY,
  vault_pubkey TEXT NOT NULL,
  cycle_id INTEGER NOT NULL,
  typed_action_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  expires_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pending_actions_vault
  ON pending_actions (vault_pubkey, status, created_at DESC);
