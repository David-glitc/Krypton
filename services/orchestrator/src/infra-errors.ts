const INFRA_ERROR_RE =
  /vault state unavailable|VAULT_STATE_UNAVAILABLE|on-chain vault account could not be loaded|openrouter\s+404|openrouter\s+5\d\d/i

export function isInfrastructureCycleError(message: string | null | undefined): boolean {
  if (!message) return false
  return INFRA_ERROR_RE.test(message)
}

export function outputsIndicateInfrastructureFailure(
  outputs: Array<{ rationale?: string }>,
  error?: string | null,
): boolean {
  const haystack = [error ?? '', ...outputs.map((output) => output.rationale ?? '')].join(' ')
  return isInfrastructureCycleError(haystack)
}
