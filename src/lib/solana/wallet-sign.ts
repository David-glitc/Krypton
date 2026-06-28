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

function isBlockhashExpired(err: unknown): boolean {
  const m = String(err)
  return m.includes('block height exceeded') || m.includes('BlockhashNotFound') || m.includes('expired')
}

function prepTx(txBase64: string, blockhash: string, feePayer: PublicKey): Transaction {
  const tx = Transaction.from(Buffer.from(txBase64, 'base64'))
  tx.recentBlockhash = blockhash
  tx.feePayer = feePayer
  return tx
}

export async function signAndSendSolanaTransactionBase64(
  wallet: Wallet | null | undefined,
  transactionBase64: string,
): Promise<string> {
  if (!wallet || !isSolanaWallet(wallet)) throw new Error('Connect a Solana wallet')
  const addr = wallet.address?.trim()
  if (!addr || !isValidAddress(addr)) throw new Error('Invalid Solana address')
  const feePayer = new PublicKey(addr)

  return withRpcFallback(async (connection) => {
    const s = (await wallet!.getSigner()) as {
      signAndSendTransaction: (t: Transaction) => Promise<unknown>
      signTransaction: (t: Transaction) => Promise<unknown>
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
      let lastErr: unknown

      // Try signAndSendTransaction
      try {
        const r = await s.signAndSendTransaction(prepTx(transactionBase64, blockhash, feePayer))
        const sig = extractSignature(r)
        await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed')
        return sig
      } catch (e) { lastErr = e }

      // Fallback: signTransaction + sendRawTransaction
      try {
        const signed = await s.signTransaction(prepTx(transactionBase64, blockhash, feePayer))
        const sig = await connection.sendRawTransaction(toBytes(signed), {
          skipPreflight: false, preflightCommitment: 'confirmed',
        })
        await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, 'confirmed')
        return sig
      } catch { /* both failed */ }

      if (isBlockhashExpired(lastErr) && attempt < 2) continue
      throw lastErr
    }

    throw new Error('Failed to send transaction after 3 attempts')
  })
}
