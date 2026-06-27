import { isSolanaWallet } from '@dynamic-labs/solana'
import type { Wallet } from '@dynamic-labs/sdk-react-core'
import { PublicKey, Transaction } from '@solana/web3.js'

import { withRpcFallback } from '@/lib/solana/rpc-fallback'

function extractSignature(result: unknown): string {
  if (typeof result === 'string') {
    return result
  }

  if (result && typeof result === 'object' && 'signature' in result) {
    const signature = (result as { signature?: unknown }).signature
    if (typeof signature === 'string') {
      return signature
    }
  }

  throw new Error('Wallet did not return a valid transaction signature')
}

function isValidSolanaAddress(address: string): boolean {
  try {
    const key = new PublicKey(address)
    return key.toBase58() === address
  } catch {
    return false
  }
}

export async function signAndSendSolanaTransactionBase64(
  wallet: Wallet | null | undefined,
  transactionBase64: string,
): Promise<string> {
  if (!wallet || !isSolanaWallet(wallet)) {
    throw new Error('Connect a Solana devnet wallet before creating a vault')
  }

  const walletAddress = wallet.address?.trim()
  if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
    throw new Error('Connected wallet address is not a valid Solana base58 public key')
  }

  const signer = await wallet.getSigner()
  const feePayer = new PublicKey(walletAddress)

  return withRpcFallback(async (connection) => {
    const transaction = Transaction.from(Buffer.from(transactionBase64, 'base64'))
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
    transaction.recentBlockhash = blockhash
    transaction.feePayer = feePayer

    const serialized = transaction.serialize({ verifySignatures: false, requireAllSignatures: false })

    let signature: string

    try {
      const result = await signer.signAndSendTransaction(serialized as unknown as Parameters<typeof signer.signAndSendTransaction>[0])
      signature = extractSignature(result)
    } catch (sendError) {
      if (typeof signer.signTransaction !== 'function') {
        throw sendError
      }

      const signed = await signer.signTransaction(serialized as unknown as Parameters<typeof signer.signTransaction>[0])
      signature = await connection.sendRawTransaction(
        signed instanceof Uint8Array ? signed : (signed as { serialize: () => Uint8Array }).serialize(),
        { skipPreflight: false, preflightCommitment: 'confirmed' },
      )
    }

    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed')
    return signature
  })
}
