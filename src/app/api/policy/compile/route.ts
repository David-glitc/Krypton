import { createHash } from 'node:crypto'

import { NextResponse } from 'next/server'

import { appendMessage, createSession, getSession, SessionNotFoundError, updateSessionStatus } from '@/lib/services/session-service'
import { clampCreationFeeUsd } from '@/lib/solana/fees'

export const runtime = 'nodejs'
export const maxDuration = 60

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? ''
const MODEL = process.env.OPENROUTER_POLICY_MODEL ?? 'google/gemini-2.5-flash-preview'

const SYSTEM_PROMPT = `You are Krypton's AI policy engine. Convert the user's capital deployment intent into a structured Capital Policy for Solana.

Respond with ONLY valid JSON (no markdown fences):
{
  "vaultName": "short name (3-5 words)",
  "riskProfile": "low" | "medium" | "high",
  "maxDrawdownPct": number (2-50),
  "maxLeverage": number (1.0-2.0),
  "maxPositionPct": number (10-100),
  "maxCorrelatedExposurePct": number (20-100),
  "liquidityFloorUsd": number (1000000-50000000),
  "assets": string[] (SOL, ETH, BTC, USDC, USDT, JitoSOL, JupSOL, mSOL, bSOL),
  "protocols": string[] (jupiter, drift, kamino, sanctum, marginfi),
  "allowedActions": string[] (swap, stake, lend, borrow, provide_liquidity),
  "forbiddenActions": string[] (leverage_above_policy_max, unverified_protocols, memecoins),
  "executionMode": "advisory" | "constrained_auto" | "full_auto",
  "rebalanceFrequency": "event_driven" | "hourly" | "daily" | "weekly",
  "privacyLevel": "standard" | "full",
  "creationFeeUsd": number (2-15),
  "reasoning": "1-2 sentences explaining policy fit"
}

creationFeeUsd rules:
- Simple/low-complexity (few assets, low risk, read-only): $2–$5
- Medium complexity (multi-asset, moderate constraints): $5–$9
- High complexity (many protocols, leverage, aggressive): $9–$15
- Never below 2 or above 15.`

async function compilePolicy(description: string) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('AI service not configured')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45_000)

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://krypton.atomiclabs.cc',
        'X-Title': 'Krypton Policy Engine',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: description },
        ],
        temperature: 0.25,
        max_tokens: 900,
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(`AI service error: ${response.status}${detail ? ` — ${detail.slice(0, 120)}` : ''}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('Empty response from AI')
    }

    const jsonStr = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const policy = JSON.parse(jsonStr) as Record<string, unknown>
    policy.creationFeeUsd = clampCreationFeeUsd(Number(policy.creationFeeUsd ?? 5))
    return policy
  } finally {
    clearTimeout(timeout)
  }
}

async function persistSession(
  ownerWallet: string,
  sessionId: string | null,
  description: string,
  policy: Record<string, unknown>,
): Promise<string | null> {
  let resolvedSessionId = sessionId

  if (resolvedSessionId) {
    await getSession(resolvedSessionId)
  } else {
    resolvedSessionId = (await createSession(ownerWallet)).session_id
  }

  await appendMessage(resolvedSessionId, 'user', description)
  await appendMessage(resolvedSessionId, 'assistant', JSON.stringify(policy))
  await updateSessionStatus(resolvedSessionId, 'compiled', {
    extractedIntent: createHash('sha256').update(description).digest('hex'),
    compiledPolicyDraft: policy,
  })

  return resolvedSessionId
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const description = body?.description?.trim()
  const ownerWallet = typeof body?.ownerWallet === 'string' ? body.ownerWallet : null
  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : null

  if (!description || typeof description !== 'string') {
    return NextResponse.json({ error: 'Missing description' }, { status: 400 })
  }

  try {
    const policy = await compilePolicy(description)

    let resolvedSessionId: string | null = sessionId
    if (ownerWallet) {
      try {
        resolvedSessionId = await persistSession(ownerWallet, sessionId, description, policy)
      } catch (error) {
        if (error instanceof SessionNotFoundError) {
          return NextResponse.json({ error: error.message }, { status: 404 })
        }
        // Session persistence is best-effort — policy still returned.
        console.warn('[policy/compile] session persist failed:', error)
      }
    }

    return NextResponse.json({ policy, sessionId: resolvedSessionId })
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'Policy generation timed out — try a shorter description'
        : error instanceof Error
          ? error.message
          : 'Failed to compile policy'

    return NextResponse.json({ error: message, sessionId }, { status: 502 })
  }
}
