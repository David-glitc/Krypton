import { isSolanaWallet } from '@dynamic-labs/solana'
import type { Wallet } from '@dynamic-labs/sdk-react-core'
import { PublicKey, Transaction } from '@solana/web3.js'

import { withRpcFallback } from '@/lib/solana/rpc-fallback'

function isValidAddress(a: string): boolean {
  try { return new PublicKey(a).toBase58() === a } catch { return false }
}

function toBytes(signed: unknown): Uint8Array {
  if (signed instanceof Uint8Array) return signed
  const o = signed as Record<string, unknown>
  if (typeof o?.serialize === 'function') {
    const r = o.serialize()
    if (r instanceof Uint8Array) return r
  }
  throw new Error('signTransaction returned an unexpected format')
}

function extractSignature(r: unknown): string {
  if (typeof r === 'string') return r
  if (r && typeof r === 'object' && 'signature' in r) return String((r as { signature: unknown }).signature)
  throw new Error('signAndSendTransaction returned unexpected format')
}

export async function signAndSendSolanaTransactionBase64(
  wallet: Wallet | null | undefined,
  transactionBase64: string,
): Promise<string> {
  if (!wallet || !isSolanaWallet(wallet)) throw new Error('Connect a Solana wallet')
  const addr = wallet.address?.trim()
  if (!addr || !isValidAddress(addr)) throw new Error('Invalid Solana address')

  return withRpcFallback(async (connection) => {
    const tx = Transaction.from(Buffer.from(transactionBase64, 'base64'))
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
    tx.recentBlockhash = blockhash
    tx.feePayer = new PublicKey(addr)

    // Dynamic SDK returns ISolana which expects Transaction|VersionedTransaction
    // Cast via any to handle @solana/web3.js version mismatch between our dep and Dynamic's
    const signer = (await wallet!.getSigner()) as {
      signAndSendTransaction: (t: Transaction) => Promise<unknown>
      signTransaction: (t: Transaction) => Promise<unknown>
    }

    let signature: string
    try {
      const r = await signer.signAndSendTransaction(tx)
      signature = extractSignature(r)
    } catch {
      const signed = await signer.signTransaction(tx)
      signature = await connection.sendRawTransaction(toBytes(signed), {
        skipPreflight: false, preflightCommitment: 'confirmed',
      })
    }

    await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed')
    return signature
  })
}
