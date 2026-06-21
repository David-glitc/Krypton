import { NextResponse } from 'next/server'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? ''
const MODEL = process.env.OPENROUTER_POLICY_MODEL ?? 'openrouter/owl-alpha'

const SYSTEM_PROMPT = `You are Krypton's AI policy engine. Your job is to convert a user's natural language description of their investment goals, risk tolerance, and preferences into a structured Capital Policy configuration for the Krypton protocol on Solana.

You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no explanation) matching this exact schema:
{
  "vaultName": "short descriptive name (3-5 words)",
  "riskProfile": "low" | "medium" | "high",
  "maxDrawdownPct": number (2-50),
  "maxLeverage": number (1.0-2.0),
  "maxPositionPct": number (10-100),
  "maxCorrelatedExposurePct": number (20-100),
  "liquidityFloorUsd": number (1000000-50000000),
  "assets": string[] (from: SOL, ETH, BTC, USDC, USDT, JitoSOL, JupSOL, mSOL, bSOL),
  "protocols": string[] (from: jupiter, drift, kamino, sanctum, marginfi),
  "allowedActions": string[] (from: swap, stake, lend, borrow, provide_liquidity),
  "forbiddenActions": string[] (from: leverage_above_policy_max, unverified_protocols, memecoins),
  "executionMode": "advisory" | "constrained_auto" | "full_auto",
  "rebalanceFrequency": "event_driven" | "hourly" | "daily" | "weekly",
  "privacyLevel": "standard" | "full",
  "reasoning": "1-2 sentence explanation of why this policy fits the user's request"
}

Rules:
- Be conservative with risk. If unsure, default to medium risk.
- maxLeverage can never exceed 2.0 (protocol hard cap).
- If user mentions "safe" or "conservative" or "preserve", use low risk, 1x leverage, stables-heavy.
- If user mentions "aggressive" or "growth" or "degen", use higher leverage (up to 2x), more assets.
- If user mentions "auto" or "hands-off", use constrained_auto or full_auto.
- If user mentions "control" or "approve", use advisory.
- Always include leverage_above_policy_max and unverified_protocols in forbiddenActions.
- Default to daily rebalance unless user specifies otherwise.
- Default to standard privacy.
- Keep vaultName short and descriptive.`

export async function POST(request: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: 'AI service not configured' },
      { status: 503 }
    )
  }

  const body = await request.json().catch(() => null)
  const userDescription = body?.description?.trim()

  if (!userDescription || typeof userDescription !== 'string') {
    return NextResponse.json(
      { error: 'Missing description' },
      { status: 400 }
    )
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://krypton.atomiclabs.cc',
      'X-Title': 'Krypton Policy Engine',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userDescription },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => 'Unknown error')
    return NextResponse.json(
      { error: `AI service error: ${response.status}` },
      { status: 502 }
    )
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    return NextResponse.json(
      { error: 'Empty response from AI' },
      { status: 502 }
    )
  }

  const jsonStr = content
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  try {
    const policy = JSON.parse(jsonStr)
    return NextResponse.json({ policy })
  } catch {
    return NextResponse.json(
      { error: 'Failed to parse AI response', raw: content.slice(0, 200) },
      { status: 502 }
    )
  }
}
