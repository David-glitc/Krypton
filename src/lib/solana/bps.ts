/** Percentage 0–100 → basis points (e.g. 12% → 1200). */
export function pctToBps(value: number): bigint {
  return BigInt(Math.round(value * 100))
}

/** Leverage multiplier 1.0–2.0 → basis points (e.g. 1.5x → 15000). */
export function leverageToBps(value: number): bigint {
  return BigInt(Math.round(value * 10_000))
}
