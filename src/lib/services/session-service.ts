import { randomUUID } from 'node:crypto'

import { dbAll, dbGet, dbRun, ensureDbReady } from '@/lib/db'
import type { InteractiveSession, MessageRole, SessionMessage, SessionStatus } from '@/lib/db/types'

export const runtime = 'nodejs'

const SESSION_TTL_MS = 24 * 60 * 60 * 1000
const MAX_CONCURRENT_SESSIONS_PER_WALLET = 3

export class SessionRateLimitError extends Error {
  constructor(wallet: string) {
    super(`Wallet ${wallet} has reached the maximum of ${MAX_CONCURRENT_SESSIONS_PER_WALLET} concurrent sessions`)
    this.name = 'SessionRateLimitError'
  }
}

export class SessionNotFoundError extends Error {
  constructor(sessionId: string) {
    super(`Session not found: ${sessionId}`)
    this.name = 'SessionNotFoundError'
  }
}

export class SessionExpiredError extends Error {
  constructor(sessionId: string) {
    super(`Session expired: ${sessionId}`)
    this.name = 'SessionExpiredError'
  }
}

function now(): number {
  return Date.now()
}

function parseMessages(messagesJson: string): SessionMessage[] {
  try {
    const parsed = JSON.parse(messagesJson) as SessionMessage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function expireStaleSessions(ownerWallet?: string): Promise<void> {
  const ts = now()

  if (ownerWallet) {
    await dbRun(
      `UPDATE interactive_sessions
       SET status = 'abandoned', updated_at = ?
       WHERE owner_wallet = ? AND status = 'active' AND expires_at <= ?`,
      [ts, ownerWallet, ts],
    )
    return
  }

  await dbRun(
    `UPDATE interactive_sessions
     SET status = 'abandoned', updated_at = ?
     WHERE status = 'active' AND expires_at <= ?`,
    [ts, ts],
  )
}

async function countActiveSessions(ownerWallet: string): Promise<number> {
  await expireStaleSessions(ownerWallet)
  const row = await dbGet<{ count: number }>(
    `SELECT COUNT(*) AS count
     FROM interactive_sessions
     WHERE owner_wallet = ? AND status = 'active' AND expires_at > ?`,
    [ownerWallet, now()],
  )
  return row?.count ?? 0
}

export async function createSession(ownerWallet: string, vaultDraftId?: string): Promise<InteractiveSession> {
  await ensureDbReady()
  await expireStaleSessions(ownerWallet)

  if ((await countActiveSessions(ownerWallet)) >= MAX_CONCURRENT_SESSIONS_PER_WALLET) {
    throw new SessionRateLimitError(ownerWallet)
  }

  const ts = now()
  const session: InteractiveSession = {
    session_id: randomUUID(),
    owner_wallet: ownerWallet,
    vault_draft_id: vaultDraftId ?? null,
    messages_json: '[]',
    extracted_intent: null,
    compiled_policy_draft: null,
    status: 'active',
    created_at: ts,
    updated_at: ts,
    expires_at: ts + SESSION_TTL_MS,
  }

  await dbRun(
    `INSERT INTO interactive_sessions (
      session_id, owner_wallet, vault_draft_id, messages_json,
      extracted_intent, compiled_policy_draft, status,
      created_at, updated_at, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      session.session_id,
      session.owner_wallet,
      session.vault_draft_id,
      session.messages_json,
      session.extracted_intent,
      session.compiled_policy_draft,
      session.status,
      session.created_at,
      session.updated_at,
      session.expires_at,
    ],
  )

  return session
}

export async function getSession(sessionId: string): Promise<InteractiveSession> {
  await ensureDbReady()
  await expireStaleSessions()

  const session = await dbGet<InteractiveSession>(`SELECT * FROM interactive_sessions WHERE session_id = ?`, [
    sessionId,
  ])

  if (!session) {
    throw new SessionNotFoundError(sessionId)
  }

  if (session.status === 'active' && session.expires_at <= now()) {
    await dbRun(
      `UPDATE interactive_sessions
       SET status = 'abandoned', updated_at = ?
       WHERE session_id = ?`,
      [now(), sessionId],
    )
    throw new SessionExpiredError(sessionId)
  }

  return session
}

export async function getSessionMessages(sessionId: string): Promise<SessionMessage[]> {
  const session = await getSession(sessionId)
  return parseMessages(session.messages_json)
}

export async function appendMessage(
  sessionId: string,
  role: MessageRole,
  content: string,
): Promise<InteractiveSession> {
  const session = await getSession(sessionId)
  const messages = parseMessages(session.messages_json)
  messages.push({ role, content, at: now() })

  const ts = now()
  await dbRun(
    `UPDATE interactive_sessions
     SET messages_json = ?, updated_at = ?
     WHERE session_id = ?`,
    [JSON.stringify(messages), ts, sessionId],
  )

  return { ...session, messages_json: JSON.stringify(messages), updated_at: ts }
}

export async function updateSessionStatus(
  sessionId: string,
  status: SessionStatus,
  fields?: {
    extractedIntent?: string
    compiledPolicyDraft?: Record<string, unknown>
  },
): Promise<InteractiveSession> {
  await getSession(sessionId)
  const ts = now()

  await dbRun(
    `UPDATE interactive_sessions
     SET status = ?,
         extracted_intent = COALESCE(?, extracted_intent),
         compiled_policy_draft = COALESCE(?, compiled_policy_draft),
         updated_at = ?
     WHERE session_id = ?`,
    [
      status,
      fields?.extractedIntent ?? null,
      fields?.compiledPolicyDraft ? JSON.stringify(fields.compiledPolicyDraft) : null,
      ts,
      sessionId,
    ],
  )

  return getSession(sessionId)
}

export async function listActiveSessionsByWallet(ownerWallet: string): Promise<InteractiveSession[]> {
  await ensureDbReady()
  await expireStaleSessions(ownerWallet)
  return dbAll<InteractiveSession>(
    `SELECT * FROM interactive_sessions
     WHERE owner_wallet = ? AND status = 'active' AND expires_at > ?
     ORDER BY created_at DESC`,
    [ownerWallet, now()],
  )
}
