'use client'

import { useContext, useState, useEffect } from 'react'
import { DynamicContext } from '@dynamic-labs/sdk-react-core'
import { isSolanaWallet } from '@dynamic-labs/solana'
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
// @ts-expect-error no types
import QRCode from 'qrcode'

import { withRpcFallback } from '@/lib/solana/rpc-fallback'
import { SectionHeading } from '@/components/app/section-heading'

export function VaultDeposit({ vaultAddress }: { vaultAddress: string }) {
  const dynamicContext = useContext(DynamicContext)
  const [amount, setAmount] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    QRCode.toDataURL(vaultAddress, { width: 200, margin: 2 }).then(setQrDataUrl).catch(() => {})
  }, [vaultAddress])

  async function handleDeposit() {
    const wallet = dynamicContext?.primaryWallet
    if (!wallet || !isSolanaWallet(wallet)) {
      setStatus('error'); setStatusMsg('Connect a Solana wallet first')
      return
    }
    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL)
    if (!lamports || lamports <= 0) {
      setStatus('error'); setStatusMsg('Enter a valid SOL amount')
      return
    }

    setStatus('sending'); setStatusMsg('')

    try {
      const feePayer = new PublicKey(wallet.address!)
      const vaultPubkey = new PublicKey(vaultAddress)

      await withRpcFallback(async (connection) => {
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
        const tx = new Transaction()
        tx.feePayer = feePayer
        tx.recentBlockhash = blockhash
        tx.add(SystemProgram.transfer({ fromPubkey: feePayer, toPubkey: vaultPubkey, lamports }))

        const signer = await wallet!.getSigner() as {
          signAndSendTransaction: (t: Transaction) => Promise<unknown>
          signTransaction: (t: Transaction) => Promise<unknown>
        }

        let signature: string
        try {
          const r = await signer.signAndSendTransaction(tx)
          signature = typeof r === 'string' ? r : String((r as { signature: unknown }).signature)
        } catch {
          const signed = await signer.signTransaction(tx)
          const bytes = signed instanceof Uint8Array ? signed : (signed as { serialize: () => Uint8Array }).serialize()
          signature = await connection.sendRawTransaction(bytes, {
            skipPreflight: false, preflightCommitment: 'confirmed',
          })
        }

        await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed')
        setStatus('sent')
        setStatusMsg(`Deposit confirmed: ${signature.slice(0, 16)}…`)
      })
    } catch (err) {
      setStatus('error')
      setStatusMsg(err instanceof Error ? err.message : 'Deposit failed')
    }
  }

  return (
    <div className="panel p-4 sm:p-6">
      <SectionHeading title="Deposit" />
      <p className="mt-2 text-xs text-text-secondary">
        Send SOL directly to this vault. Funds are held in the vault contract.
      </p>

      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-start">
        <div className="flex-shrink-0">
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="Vault address QR code" width={200} height={200} className="rounded border border-border" />
          )}
          <p className="mt-2 max-w-[200px] break-all text-[10px] text-text-muted">{vaultAddress}</p>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <label className="text-xs text-text-secondary">Amount (SOL)</label>
          <input
            type="number"
            min="0"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full rounded border border-border bg-bg-base px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-accent"
          />
          <button
            onClick={handleDeposit}
            disabled={status === 'sending'}
            className="w-full rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send from wallet'}
          </button>
          {statusMsg && (
            <p className={`text-xs ${status === 'error' ? 'text-accent-risk' : 'text-accent'}`}>{statusMsg}</p>
          )}
        </div>
      </div>
    </div>
  )
}
