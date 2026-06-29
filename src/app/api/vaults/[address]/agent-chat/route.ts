import { NextResponse } from 'next/server'

import {
  appendMessage,
  clearSessionMessages,
  getOrCreateVaultSession,
  getSessionMessages,
} from '@/lib/services/session-service'
import { getVault, registerVault, VaultNotFoundError } from '@/lib/services/vault-registry-service'
import { fetchVaultAccount, withRpcFallback } from '@/lib/solana/client'
import { PublicKey } from '@solana/web3.js'

export const runtime = 'nodejs'
export const maxDuration = 60

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? ''
const MODEL = process.env.OPENROUTER_AGENT_CHAT_MODEL ?? 'openrouter/owl-alpha'

const SYSTEM_PROMPT = `You are the Krypton vault agent — a DeFi research and strategy advisor for a user's Solana vault.

Speak in plain English. Be direct and actionable. No model names, no pipeline jargon.

When the user asks questions:
- RESEARCH: market read, vault state, yield opportunities within policy (Jupiter swaps, Kamino lend, Sanctum LST, Meteora LP)
- STRATEGY: concrete moves with sizes (e.g. "swap 30% idle SOL to jitoSOL via Jupiter")

Always include when relevant:
1. A one-sentence **investment goal** for this vault
2. **Proposed moves** as bullet points (or "hold" if truly nothing to do)
3. **Risk note** — how moves fit drawdown/leverage/concentration limits

Keep responses under 250 words unless the user asks for detail.`

async function loadVaultContext(vaultPubkey: string): Promise<string> {
  try {
    const { onChainVault } = await withRpcFallback(async (connection) => ({
      onChainVault: await fetchVaultAccount(connection, new PublicKey(vaultPubkey)),
    }))
    if (!onChainVault) return `Vault ${vaultPubkey} — on-chain state unavailable.`

    const c = onChainVault.constraint
    return [
      `Vault: ${vaultPubkey}`,
      `Paused: ${onChainVault.paused}`,
      `Drawdown: ${Number(c.currentDrawdownBps) / 100}% / ${Number(c.maxDrawdownBps) / 100}% max`,
      `Leverage: ${Number(c.currentLeverageBps) / 100}% / ${Number(c.maxLeverageBps) / 100}% max`,
      `Concentration: ${Number(c.currentConcentrationBps) / 100}% / ${Number(c.maxPositionBps) / 100}% max`,
      `Correlated: ${Number(c.currentCorrelatedExposureBps) / 100}% / ${Number(c.maxCorrelatedExposureBps) / 100}% max`,
    ].join('\n')
  } catch {
    return `Vault ${vaultPubkey} — could not load on-chain state.`
  }
}

async function ensureRegistry(vaultPubkey: string, ownerWallet: string) {
  try {
    await getVault(vaultPubkey)
  } catch (e) {
    if (e instanceof VaultNotFoundError) {
          await registerVault({ vaultPubkey, ownerWallet, permissionLevel: 2 })
    }
  }
}

async function chatReply(
  vaultContext: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    return 'Agent chat is not configured (missing OPENROUTER_API_KEY). Use **Run agent** for automated cycles.'
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://krypton.atomiclabs.cc',
      'X-Title': 'Krypton Vault Agent',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\n=== Current vault ===\n${vaultContext}` },
        ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ],
      temperature: 0.35,
      max_tokens: 600,
    }),
  })

  if (!response.ok) {
    throw new Error(`AI service error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() ?? 'No response from agent.'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params
  const ownerWallet = new URL(request.url).searchParams.get('ownerWallet')
  if (!ownerWallet) {
    return NextResponse.json({ error: 'ownerWallet required' }, { status: 400 })
  }

  try {
    await ensureRegistry(address, ownerWallet)
    const session = await getOrCreateVaultSession(ownerWallet, address)
    const messages = await getSessionMessages(session.session_id)
    return NextResponse.json({ sessionId: session.session_id, messages })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load chat' },
      { status: 500 },
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params
  const body = await request.json().catch(() => null)
  const ownerWallet = typeof body?.ownerWallet === 'string' ? body.ownerWallet : null
  const message = typeof body?.message === 'string' ? body.message.trim() : null

  if (!ownerWallet || !message) {
    return NextResponse.json({ error: 'ownerWallet and message required' }, { status: 400 })
  }

  try {
    await ensureRegistry(address, ownerWallet)
    const session = await getOrCreateVaultSession(ownerWallet, address)
    await appendMessage(session.session_id, 'user', message)

    const history = (await getSessionMessages(session.session_id)).map((m) => ({
      role: m.role,
      content: m.content,
    }))
    const vaultContext = await loadVaultContext(address)
    const reply = await chatReply(vaultContext, history, message)
    await appendMessage(session.session_id, 'assistant', reply)

    const messages = await getSessionMessages(session.session_id)
    return NextResponse.json({ sessionId: session.session_id, messages, reply })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Chat failed' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params
  const ownerWallet = new URL(request.url).searchParams.get('ownerWallet')
  if (!ownerWallet) {
    return NextResponse.json({ error: 'ownerWallet required' }, { status: 400 })
  }

  try {
    await ensureRegistry(address, ownerWallet)
    const session = await getOrCreateVaultSession(ownerWallet, address)
    await clearSessionMessages(session.session_id)
    return NextResponse.json({ cleared: true, sessionId: session.session_id })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to clear chat' },
      { status: 500 },
    )
  }
}
