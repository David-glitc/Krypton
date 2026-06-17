/** Dev-only invite allowlist for private beta gate */
const BETA_ALLOWLIST = new Set([
  'DemoWallet111111111111111111111111111111111',
  'InviteBeta22222222222222222222222222222222',
])

const FEATURE_PRIVATE_BETA =
  (import.meta as { env?: Record<string, string> }).env?.VITE_FEATURE_PRIVATE_BETA === 'true'

export function isInviteAllowed(walletAddress: string | null | undefined) {
  if (!walletAddress) return false
  if (import.meta.env.DEV) return true
  if (FEATURE_PRIVATE_BETA) return true
  return BETA_ALLOWLIST.has(walletAddress)
}

export function getInviteHint() {
  return 'Connect an invited wallet to access /app during private beta.'
}

export function isPrivateBetaActive() {
  return import.meta.env.DEV || FEATURE_PRIVATE_BETA
}
