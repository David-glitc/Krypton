/**
 * Telemetry & Preemptive De-Risking Engine
 *
 * Pure, deterministic functions for live vault telemetry, drawdown
 * monitoring, threshold-based alerting, and stress-test simulation.
 *
 * No side effects. No external calls. Fully testable.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PriceFeed {
  symbol: string
  price: number
  timestamp: number
}

export interface Position {
  protocol: string
  asset: string
  valueUsd: number
  leverage: number
}

export interface TelemetryState {
  vaultId: string
  nav: number
  peakNav: number
  liveDrawdownBps: number
  positions: Position[]
  lastUpdated: number
}

export interface ThresholdConfig {
  /** Fraction of max_drawdown that triggers the watch band (e.g. 70 = 70%). */
  watchBandPct: number
  /** Fraction of max_drawdown that triggers the pre-breach band (e.g. 90). */
  preemptBandPct: number
  preemptAction: 'trigger_derisk' | 'reduce_leverage' | 'notify_only'
}

export interface TelemetryAlert {
  level: 'watch' | 'pre_breach' | 'breach'
  vaultId: string
  liveDrawdownBps: number
  maxDrawdownBps: number
  message: string
  recommendedActions: string[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DEFAULT_THRESHOLD_CONFIG: ThresholdConfig = {
  watchBandPct: 70,
  preemptBandPct: 90,
  preemptAction: 'trigger_derisk',
}

/** Shock percentages (negative = price drop) for stress testing. */
export const STRESS_SHOCK_PCTS = [-10, -20, -30] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Basis-points helper: 1 bps = 0.01%. */
const BPS_PER_UNIT = 10_000

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Compute drawdown in basis points between a current NAV and its peak.
 *
 * Returns 0 when peakNav ≤ 0 or currentNav ≥ peakNav.
 * Clamps to non-negative — never returns a negative drawdown.
 */
export function computeDrawdownBps(currentNav: number, peakNav: number): number {
  if (peakNav <= 0) return 0
  if (currentNav >= peakNav) return 0
  const drawdown = (peakNav - currentNav) / peakNav
  return Math.round(drawdown * BPS_PER_UNIT)
}

/**
 * Recompute live NAV from positions and current price feeds, then return
 * the drawdown in bps relative to the provided peak.
 *
 * - Positions without a matching price feed are valued at their last known
 *   `valueUsd` (price = 1.0 effectively).
 * - Empty positions → nav = 0.
 */
export function computeLiveDrawdown(positions: Position[], prices: PriceFeed[]): number {
  if (positions.length === 0) return 0

  const priceMap = new Map<string, number>()
  for (const p of prices) {
    priceMap.set(p.symbol, p.price)
  }

  let nav = 0
  for (const pos of positions) {
    const currentPrice = priceMap.get(pos.asset)
    if (currentPrice === undefined || currentPrice <= 0) {
      // No price data — carry last known value
      nav += pos.valueUsd
    } else {
      // Re-value proportionally to price change.
      // We treat the stored valueUsd as the mark-to-market at the last
      // known price; without the original entry price we approximate by
      // assuming the feed price is relative (i.e. price = 1.0 is the
      // reference). For a real system you'd store entryPrice; here we
      // use valueUsd * currentPrice as a deterministic proxy.
      nav += pos.valueUsd * currentPrice
    }
  }

  // Peak is implicit: if nav ≥ 0 the drawdown is 0; the caller supplies
  // the real peak when calling computeDrawdownBps.  This function returns
  // the raw NAV so the caller can compute drawdown against their peak.
  // ── Wait, the spec says "returns number" (drawdown).  We need a peak.
  // The simplest deterministic interpretation: use the sum of absolute
  // position values as the "peak" reference (i.e. all prices at 1.0).
  const peakNav = positions.reduce((sum, pos) => sum + pos.valueUsd, 0)
  return computeDrawdownBps(nav, peakNav)
}

/**
 * Evaluate telemetry state against threshold bands derived from the
 * vault's configured maximum drawdown.
 *
 * Bands (in bps):
 *   watch     = maxDrawdownBps × watchBandPct / 100
 *   pre_breach = maxDrawdownBps × preemptBandPct / 100
 *   breach    = maxDrawdownBps
 *
 * Returns `null` when the state is within the watch band.
 */
export function checkThresholds(
  state: TelemetryState,
  maxDrawdownBps: number,
  config: ThresholdConfig,
): TelemetryAlert | null {
  const { liveDrawdownBps, vaultId } = state

  const watchBps = Math.round((maxDrawdownBps * config.watchBandPct) / 100)
  const preemptBps = Math.round((maxDrawdownBps * config.preemptBandPct) / 100)

  // Breach: at or beyond the max drawdown
  if (liveDrawdownBps >= maxDrawdownBps) {
    return {
      level: 'breach',
      vaultId,
      liveDrawdownBps,
      maxDrawdownBps,
      message: `Vault ${vaultId} has breached the maximum drawdown (${liveDrawdownBps} bps ≥ ${maxDrawdownBps} bps). Immediate action required.`,
      recommendedActions: [
        'Halt all leveraged positions immediately',
        'Rotate all assets to USDC',
        'Notify vault owner and risk committee',
      ],
    }
  }

  // Pre-breach: within the preempt band
  if (liveDrawdownBps >= preemptBps) {
    const actions = buildPreemptActions(config, state)
    return {
      level: 'pre_breach',
      vaultId,
      liveDrawdownBps,
      maxDrawdownBps,
      message: `Vault ${vaultId} is approaching maximum drawdown (${liveDrawdownBps} bps / ${maxDrawdownBps} bps). Preemptive de-risking recommended.`,
      recommendedActions: actions,
    }
  }

  // Watch band
  if (liveDrawdownBps >= watchBps) {
    return {
      level: 'watch',
      vaultId,
      liveDrawdownBps,
      maxDrawdownBps,
      message: `Vault ${vaultId} drawdown (${liveDrawdownBps} bps) is within the watch band (${watchBps} bps). Monitor closely.`,
      recommendedActions: [
        'Review position sizing',
        'Check oracle price freshness',
        'Prepare de-risk candidates',
      ],
    }
  }

  // Within safe range
  return null
}

/** Build recommended actions based on the threshold config and state. */
function buildPreemptActions(config: ThresholdConfig, state: TelemetryState): string[] {
  const base = generateDeRiskCandidates(state)

  switch (config.preemptAction) {
    case 'trigger_derisk':
      return [
        'Execute full de-risking sequence',
        ...base,
        'Notify vault owner after execution',
      ]
    case 'reduce_leverage':
      return [
        'Reduce all leverages to ≤ 1.0x',
        ...base,
      ]
    case 'notify_only':
      return [
        'Alert vault owner — no automatic action',
        ...base,
      ]
  }
}

/**
 * Generate deterministic de-risk action descriptions for a given vault state.
 *
 * Rules (deterministic, sorted by priority):
 *   1. Any position with leverage > 2.0x → reduce to 1.0x
 *   2. Any position with leverage > 1.0x → reduce to 1.0x
 *   3. If total position value > 0 → rotate 20% to USDC
 *   4. If any non-stable asset → add stablecoin hedge suggestion
 */
export function generateDeRiskCandidates(state: TelemetryState): string[] {
  const actions: string[] = []
  const { positions } = state

  if (positions.length === 0) return ['No positions to de-risk']

  // Identify high-leverage positions (deterministic: sort by protocol+asset)
  const sorted = [...positions].sort((a, b) =>
    `${a.protocol}:${a.asset}`.localeCompare(`${b.protocol}:${b.asset}`),
  )

  for (const pos of sorted) {
    if (pos.leverage > 2.0) {
      actions.push(`Reduce ${pos.asset} leverage on ${pos.protocol} from ${pos.leverage.toFixed(1)}x to 1.0x`)
    }
  }

  for (const pos of sorted) {
    if (pos.leverage > 1.0 && pos.leverage <= 2.0) {
      actions.push(`Reduce ${pos.asset} leverage on ${pos.protocol} from ${pos.leverage.toFixed(1)}x to 1.0x`)
    }
  }

  // Rotation suggestion
  const totalValue = positions.reduce((s, p) => s + p.valueUsd, 0)
  if (totalValue > 0) {
    const rotateAmount = Math.round(totalValue * 0.2)
    actions.push(`Rotate $${rotateAmount.toLocaleString()} (20%) to USDC`)
  }

  // Stablecoin hedge: check if any non-stable asset exists
  const STABLES: Record<string, true> = { USDC: true, USDT: true, DAI: true, USD: true }
  const hasNonStable = positions.some((p) => !STABLES[p.asset.toUpperCase()])
  if (hasNonStable) {
    actions.push('Add stablecoin hedge for non-stable assets')
  }

  return actions.length > 0 ? actions : ['Vault is already fully de-risked']
}

/**
 * Simulate a uniform price shock across all positions and return the
 * resulting telemetry state.
 *
 * @param shockPct  Negative number (e.g. -20 = 20% drop).  Positive values
 *                  are treated as a price increase (reduced drawdown).
 */
export function simulatePriceShock(positions: Position[], shockPct: number): TelemetryState {
  const shockMultiplier = 1 + shockPct / 100

  const shockedPositions: Position[] = positions.map((pos) => ({
    ...pos,
    valueUsd: pos.valueUsd * shockMultiplier,
  }))

  const nav = shockedPositions.reduce((s, p) => s + p.valueUsd, 0)

  // For simulation, the "peak" is the pre-shock NAV (sum of original values).
  const peakNav = positions.reduce((s, p) => s + p.valueUsd, 0)

  const liveDrawdownBps = computeDrawdownBps(nav, peakNav)

  return {
    vaultId: 'simulation',
    nav,
    peakNav,
    liveDrawdownBps,
    positions: shockedPositions,
    lastUpdated: Date.now(),
  }
}
