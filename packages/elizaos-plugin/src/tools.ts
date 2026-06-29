/**
 * Tool definitions and handlers for the agent runtime.
 * Uses OpenAI-compatible tool schema (supported by openrouter/owl-alpha).
 */

export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

export type ToolHandler = (args: Record<string, unknown>) => Promise<string>

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'
const DEFILLAMA_BASE = 'https://yields.llama.fi'

async function fetchJson(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => '')}`)
  return res.json() as Promise<Record<string, unknown>>
}

async function handleFetchSolPrice(): Promise<string> {
  try {
    const data = await fetchJson(
      `${COINGECKO_BASE}/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true`,
    )
    const sol = (data.solana as Record<string, unknown>) ?? {}
    const price = Number(sol.usd ?? 0)
    const change = Number(sol.usd_24h_change ?? 0)
    return JSON.stringify({
      priceUsd: price,
      change24hPct: Math.round(change * 100) / 100,
      timestamp: Date.now(),
    })
  } catch (e) {
    return JSON.stringify({ error: String(e) })
  }
}

async function handleFetchDefiYields(args: Record<string, unknown>): Promise<string> {
  try {
    const protocol = (args.protocol as string | undefined) ?? ''
    const data = await fetchJson(`${DEFILLAMA_BASE}/pools`)
    const pools = (data.data as Array<Record<string, unknown>> | undefined) ?? []
    const filtered = protocol
      ? pools.filter((p) => String(p.project ?? '').toLowerCase() === protocol.toLowerCase())
      : pools
    const sorted = filtered
      .sort((a, b) => Number(b.apy ?? 0) - Number(a.apy ?? 0))
      .slice(0, 10)
      .map((p) => ({
        pool: p.pool,
        project: p.project,
        apy: Number(p.apy).toFixed(2),
        tvlUsd: Number(p.tvlUsd).toFixed(0),
        chain: p.chain,
      }))
    return JSON.stringify({ count: sorted.length, pools: sorted })
  } catch (e) {
    return JSON.stringify({ error: String(e) })
  }
}

async function handleFetchNews(): Promise<string> {
  try {
    const data = await fetchJson(
      `${COINGECKO_BASE}/news?limit=10`,
    )
    const articles = (data.data as Array<Record<string, unknown>> | undefined) ?? []
    return JSON.stringify(
      articles.map((a) => ({
        title: a.title,
        url: a.url,
        source: a.author ?? 'CoinGecko',
        publishedAt: a.published_at ?? a.created_at,
      })),
    )
  } catch {
    return JSON.stringify([])
  }
}

async function handleSearchWeb(args: Record<string, unknown>): Promise<string> {
  const query = String(args.query ?? '').trim()
  if (!query) return JSON.stringify({ error: 'Empty query' })

  const apiKey = process.env.SEARCH_API_KEY
  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
        { headers: { 'Accept': 'application/json', 'Accept-Encoding': 'gzip', 'X-Subscription-Token': apiKey } },
      )
      if (res.ok) {
        const json = await res.json() as { web?: { results: Array<{ title: string; url: string; description: string }> } }
        const results = json.web?.results?.slice(0, 5) ?? []
        return JSON.stringify(results.map((r) => ({ title: r.title, url: r.url, snippet: r.description })))
      }
    } catch {
      // fall through to DDG
    }
  }

  try {
    const res = await fetch(
      `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(8000) },
    )
    const html = await res.text()
    const results: Array<{ title: string; snippet: string }> = []
    const linkRegex = /<a[^>]+class="result-link"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi
    const snippetRegex = /<td[^>]*class="result-snippet"[^>]*>([\s\S]*?)<\/td>/gi
    let m: RegExpExecArray | null
    while ((m = linkRegex.exec(html)) !== null) {
      const snippet = snippetRegex.exec(html)
      results.push({
        title: m[2]?.replace(/<[^>]*>/g, '').trim() ?? '',
        snippet: snippet?.[1]?.replace(/<[^>]*>/g, '').trim() ?? '',
      })
    }
    return JSON.stringify(results.slice(0, 5))
  } catch (e) {
    return JSON.stringify({ error: `Web search unavailable: ${String(e)}` })
  }
}

export function createResearchTools(): { definitions: ToolDefinition[]; handlers: Record<string, ToolHandler> } {
  return {
    definitions: [
      {
        type: 'function',
        function: {
          name: 'fetch_sol_price',
          description: 'Get current SOL/USD price with 24h change. No arguments needed.',
          parameters: { type: 'object', properties: {} },
        },
      },
      {
        type: 'function',
        function: {
          name: 'fetch_defi_yields',
          description: 'Get top DeFi yield pools. Optionally filter by protocol name (e.g. "kamino", "sanctum", "jupiter", "meteora").',
          parameters: {
            type: 'object',
            properties: {
              protocol: { type: 'string', description: 'Optional protocol name to filter by (lowercase)' },
            },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'fetch_crypto_news',
          description: 'Get latest cryptocurrency news headlines. No arguments needed.',
          parameters: { type: 'object', properties: {} },
        },
      },
      {
        type: 'function',
        function: {
          name: 'search_web',
          description: 'Search the web for current information. Use for market trends, yield comparisons, protocol updates.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
            },
            required: ['query'],
          },
        },
      },
    ],
    handlers: {
      fetch_sol_price: handleFetchSolPrice,
      fetch_defi_yields: handleFetchDefiYields,
      fetch_crypto_news: handleFetchNews,
      search_web: handleSearchWeb,
    },
  }
}
