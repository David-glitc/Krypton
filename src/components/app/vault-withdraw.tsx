'use client'

import { useContext, useState } from 'react'
import { DynamicContext } from '@dynamic-labs/sdk-react-core'
import { isSolanaWallet } from '@dynamic-labs/solana'
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'

import { withRpcFallback } from '@/lib/solana/rpc-fallback'
import { getProgramId, IX_DISCRIMINATORS } from '@/lib/solana/idl'
import { SectionHeading } from '@/components/app/section-heading'

function encodeU64LE(v: bigint): Buffer {
  const MASK_32 = BigInt(0xffffffff)
  const SHIFT_32 = BigInt(32)
  const buf = Buffer.alloc(8)
  buf.writeUInt32LE(Number(v & MASK_32), 0)
  buf.writeUInt32LE(Number(v >> SHIFT_32), 4)
  return buf
}

export function VaultWithdraw({
  vaultAddress,
  onWithdrawn,
}: {
  vaultAddress: string
  onWithdrawn?: () => void
}) {
  const dynamicContext = useContext(DynamicContext)
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  async function handleWithdraw() {
    const wallet = dynamicContext?.primaryWallet
    if (!wallet || !isSolanaWallet(wallet)) {
      setStatus('error'); setStatusMsg('Connect a Solana wallet first')
      return
    }

    const usdCents = Math.floor(Number(amount) * 100)
    if (!usdCents || usdCents <= 0) {
      setStatus('error'); setStatusMsg('Enter a valid amount (USD)')
      return
    }

    setStatus('sending'); setStatusMsg('')

    try {
      const signer = new PublicKey(wallet.address!)
      const vaultPubkey = new PublicKey(vaultAddress)
      const programId = getProgramId()

      await withRpcFallback(async (connection) => {
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')

        const ix = new TransactionInstruction({
          programId,
          keys: [
            { pubkey: signer, isSigner: true, isWritable: true },
            { pubkey: vaultPubkey, isSigner: false, isWritable: true },
          ],
          data: Buffer.concat([IX_DISCRIMINATORS.withdraw, encodeU64LE(BigInt(usdCents))]),
        })

        const tx = new Transaction()
        tx.feePayer = signer
        tx.recentBlockhash = blockhash
        tx.add(ix)

        const signerWallet = await wallet!.getSigner() as {
          signAndSendTransaction: (t: Transaction) => Promise<unknown>
          signTransaction: (t: Transaction) => Promise<unknown>
        }

        let signature: string
        try {
          const r = await signerWallet.signAndSendTransaction(tx)
          signature = typeof r === 'string' ? r : String((r as { signature: unknown }).signature)
        } catch {
          const signed = await signerWallet.signTransaction(tx)
          const bytes = signed instanceof Uint8Array ? signed : (signed as { serialize: () => Uint8Array }).serialize()
          signature = await connection.sendRawTransaction(bytes, {
            skipPreflight: false, preflightCommitment: 'confirmed',
          })
        }

        await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed')
        setStatus('sent')
        setStatusMsg(`Withdrawal recorded: ${signature.slice(0, 16)}…`)
        onWithdrawn?.()
      })
    } catch (err) {
      setStatus('error')
      setStatusMsg(err instanceof Error ? err.message : 'Withdraw failed')
    }
  }

  return (
    <div className="panel p-4 sm:p-6">
      <SectionHeading title="Withdraw" />
      <p className="mt-2 text-xs text-text-secondary">
        Record a withdrawal intent on-chain. The orchestrator processes this and handles the actual SOL transfer.
      </p>

      <div className="mt-4 flex max-w-xs flex-col gap-3">
        <label className="text-xs text-text-secondary">Amount (USD)</label>
        <input
          type="number"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          className="w-full rounded border border-border bg-bg-base px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent"
        />
        <button
          onClick={handleWithdraw}
          disabled={status === 'sending'}
          className="w-full rounded bg-[#FF8A66] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {status === 'sending' ? 'Signing…' : 'Record Withdraw'}
        </button>
        {statusMsg && (
          <p className={`text-xs ${status === 'error' ? 'text-accent-risk' : 'text-accent'}`}>{statusMsg}</p>
        )}
      </div>
    </div>
  )
}
