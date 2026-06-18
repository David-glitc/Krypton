/**
 * Suppress known non-fatal warnings from third-party SDKs.
 * 
 * The LazorKit wallet SDK throws "Failed to update wallet configuration" 
 * during initialization when it can't reach its portal/paymaster endpoints.
 * This is non-fatal — the wallet still works for read operations.
 */
const originalError = console.error
console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''
  
  // Suppress LazorKit config errors
  if (msg.includes('Failed to update wallet configuration')) return
  if (msg.includes('Lazorkit')) return
  
  // Suppress known React warnings from third-party SDKs
  if (msg.includes('Warning: React does not recognize the `su` prop')) return
  
  originalError.apply(console, args)
}

// Also suppress unhandled promise rejections from LazorKit
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  if (reason && typeof reason === 'object' && 'message' in reason) {
    const msg = String(reason.message)
    if (msg.includes('Failed to update wallet configuration')) {
      event.preventDefault()
    }
  }
})
