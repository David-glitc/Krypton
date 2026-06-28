import { isSolanaWallet } from '@dynamic-labs/solana'
import type { Wallet } from '@dynamic-labs/sdk-react-core'
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'

import { withRpcFallback } from '@/lib/solana/rpc-fallback'

function toBytes(tx: unknown): Uint8Array {
  if (tx instanceof Uint8Array) return tx
  if (tx instanceof Transaction) return tx.serialize({ verifySignatures: false })
  if (tx instanceof VersionedTransaction) return tx.serialize()
  if (tx && typeof tx === 'object' && 'serialize' in tx && typeof (tx as { serialize: () => unknown }).serialize === 'function') {
    const result = (tx as { serialize: () => unknown }).serialize()
    if (result instanceof Uint8Array) return result
  }
  throw new Error('Wallet returned an unrecognised signed transaction format')
}

function extractSignature(result: unknown): string {
  if (typeof result === 'string') return result
  if (result && typeof result === 'object' && 'signature' in result) {
    const sig = (result as { signature?: unknown }).signature
    if (typeof sig === 'string') return sig
  }
  throw new Error('Wallet did not return a valid transaction signature')
}

function isValidSolanaAddress(address: string): boolean {
  try { return new PublicKey(address).toBase58() === address } catch { return false }
}

export async function signAndSendSolanaTransactionBase64(
  wallet: Wallet | null | undefined,
  transactionBase64: string,
): Promise<string> {
  if (!wallet || !isSolanaWallet(wallet)) {
    throw new Error('Connect a Solana wallet before creating a vault')
  }
  const walletAddress = wallet.address?.trim()
  if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
    throw new Error('Connected wallet address is not a valid Solana base58 public key')
  }

  const signer = await wallet.getSigner()
  const feePayer = new PublicKey(walletAddress)

  return withRpcFallback(async (connection) => {
    const tx = Transaction.from(Buffer.from(transactionBase64, 'base64'))
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
    tx.recentBlockhash = blockhash
    tx.feePayer = feePayer

    let signature: string

    try {
      const result = await signer.signAndSendTransaction(tx as unknown as Parameters<typeof signer.signAndSendTransaction>[0])
      signature = extractSignature(result)
    } catch (sendError) {
      if (typeof signer.signTransaction !== 'function') throw sendError

      const signed = await signer.signTransaction(tx as unknown as Parameters<typeof signer.signTransaction>[0])
      signature = await connection.sendRawTransaction(toBytes(signed), {
        skipPreflight: false, preflightCommitment: 'confirmed',
      })
    }

    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed')
    return signature
  })
}
