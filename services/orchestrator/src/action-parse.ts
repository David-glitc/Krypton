export function parseActionType(label: string): number {
  const lower = label.toLowerCase()
  if (lower.includes('swap')) return 0
  if (lower.includes('stake') || lower.includes('unstake')) return 1
  if (lower.includes('lend') || lower.includes('borrow')) return 2
  if (lower.includes('liquidity') || lower.includes('provide')) return 3
  if (lower.includes('close_perp') || lower.includes('close')) return 5
  if (lower.includes('perp') || lower.includes('open_perp')) return 4
  return 0
}

export function parseTargetProtocol(label: string): number {
  const lower = label.toLowerCase()
  if (lower.includes('jupiter') || lower.includes('jup')) return 0
  if (lower.includes('drift')) return 1
  if (lower.includes('adrena')) return 2
  if (lower.includes('pump') || lower.includes('pumpfun')) return 3
  if (lower.includes('raydium')) return 4
  if (lower.includes('kamino')) return 5
  if (lower.includes('sanctum') || lower.includes('jito') || lower.includes('msol')) return 6
  if (lower.includes('meteora')) return 7
  return 0
}
