'use client'

import { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DynamicContext } from '@dynamic-labs/sdk-react-core'
import { OutlineButton, PrimaryCta } from '@/components/app/app-shell'
import { CreateVaultBlueprints } from '@/components/app/create-vault-blueprints'
import { CreateVaultTerminal } from '@/components/app/create-vault-terminal'
import { CreateVaultWizard, WIZARD_STEPS } from '@/components/app/create-vault-wizard'
import { PipelinePreview, pipelineFromForm } from '@/components/app/pipeline-preview'
import {
  applyPolicyToForm,
  DEFAULT_FORM,
  type FormState,
  type GeneratedPolicy,
  validateConstraints,
} from '@/lib/create-vault'
import { clampCreationFeeUsd, formatSolAmount } from '@/lib/solana/fees'
import { signAndSendSolanaTransactionBase64 } from '@/lib/solana/wallet-sign'

const FLOW_STEPS = ['Blueprint', 'Intent', 'Policy', 'Deploy'] as const

function flowIndex(step: number, wizardOpen: boolean): number {
  if (!wizardOpen) return step <= 1 ? step : 1
  if (step < WIZARD_STEPS.length - 1) return 2
  return 3
}

export default function CreateVaultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dynamicContext = useContext(DynamicContext)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM })
  const [submitting, setSubmitting] = useState(false)
  const [aiPolicy, setAiPolicy] = useState<GeneratedPolicy | null>(null)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [terminalPrompt, setTerminalPrompt] = useState('')
  const [analyzeTrigger, setAnalyzeTrigger] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)

  const [feeQuote, setFeeQuote] = useState<{ usd: number; sol: number } | null>(null)

  const creationFeeUsd = clampCreationFeeUsd(aiPolicy?.creationFeeUsd ?? 5)
  const estimatedFeeSol = feeQuote?.sol ?? creationFeeUsd / 150

  useEffect(() => {
    const policyParam = searchParams.get('policy')
    if (policyParam) {
      try {
        const policy = JSON.parse(decodeURIComponent(policyParam)) as GeneratedPolicy
        setAiPolicy(policy)
        setForm(applyPolicyToForm(policy, DEFAULT_FORM))
        setWizardOpen(true)
      } catch {
        // ignore malformed param
      }
    }
  }, [searchParams])

  const isAggressive = form.maxDrawdownPct >= 25
  const constraintChecks = validateConstraints(form)
  const allConstraintsPass = constraintChecks.every((c) => c.pass)
  const activeFlow = flowIndex(step, wizardOpen)

  const pipelineData = useMemo(
    () =>
      pipelineFromForm({
        assets: form.assets,
        protocols: form.protocols,
        maxLeverage: form.maxLeverage,
        maxDrawdownPct: form.maxDrawdownPct,
        rebalanceFrequency: form.rebalanceFrequency,
      }),
    [form],
  )

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleListItem(
    key: 'assets' | 'protocols' | 'allowedActions' | 'forbiddenActions' | 'pauseAuthority',
    item: string,
  ) {
    setForm((f) => {
      const arr = f[key] as string[]
      return { ...f, [key]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item] }
    })
  }

  function handleAiPolicy(policy: GeneratedPolicy) {
    setAiPolicy(policy)
    setForm((f) => applyPolicyToForm(policy, f))
    setWizardOpen(true)
    setStep(0)
  }

  function handleBlueprintSelect(prompt: string) {
    setTerminalPrompt(prompt)
    setAnalyzeTrigger((n) => n + 1)
  }

  async function submit() {
    setSubmitting(true)
    setCreateError(null)

    try {
      const ownerWallet = dynamicContext?.primaryWallet?.address
      if (!ownerWallet) {
        throw new Error('Connect a wallet before creating a vault')
      }

      const prepareRes = await fetch('/api/vaults/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerWallet,
          form,
          sessionId,
          creationFeeUsd,
        }),
      })

      const prepared = (await prepareRes.json()) as {
        error?: string
        vaultPda: string
        creationFeeUsd?: number
        feeSol?: number
        transactionBundle: { transactionBase64: string }
      }

      if (!prepareRes.ok) {
        throw new Error(prepared.error ?? 'Failed to prepare vault transactions')
      }

      if (prepared.creationFeeUsd && prepared.feeSol) {
        setFeeQuote({ usd: prepared.creationFeeUsd, sol: prepared.feeSol })
      }

      const createSignature = await signAndSendSolanaTransactionBase64(
        dynamicContext?.primaryWallet,
        prepared.transactionBundle.transactionBase64,
      )

      const finalizeRes = await fetch('/api/vaults/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vaultPubkey: prepared.vaultPda,
          ownerWallet,
          name: form.vaultName,
          permissionLevel: form.permissionLevel,
          txSignature: createSignature,
        }),
      })

      const finalized = (await finalizeRes.json()) as { error?: string }
      if (!finalizeRes.ok) {
        throw new Error(finalized.error ?? 'Failed to finalize vault registry entry')
      }

      router.push(`/app/vault/${prepared.vaultPda}`)
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Failed to create vault')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 lg:p-8">
      <div className="max-w-2xl">
        <span className="inline-block border border-border px-3 py-1 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider text-accent">
          Protocol v4.2.0
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-hanken)] text-3xl font-bold tracking-tight text-text-primary sm:mt-4 sm:text-5xl lg:text-6xl">
          Initiate New Vault
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text-secondary sm:mt-4 sm:text-lg">
          Blueprint → intent → policy review → one signed deployment.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2 sm:gap-3" aria-label="Vault creation progress">
        {FLOW_STEPS.map((label, i) => (
          <span
            key={label}
            className={`rounded border px-3 py-1.5 font-[family-name:var(--font-jetbrains)] text-[10px] uppercase tracking-wider sm:text-xs ${
              i === activeFlow
                ? 'border-accent bg-accent-muted text-accent'
                : i < activeFlow
                  ? 'border-border text-text-secondary'
                  : 'border-border/60 text-text-muted'
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </nav>

      <CreateVaultBlueprints
        disabled={analyzing}
        onSelect={handleBlueprintSelect}
      />

      <CreateVaultTerminal
        onPolicy={handleAiPolicy}
        ownerWallet={dynamicContext?.primaryWallet?.address ?? null}
        sessionId={sessionId}
        onSession={setSessionId}
        initialPrompt={terminalPrompt}
        analyzeTrigger={analyzeTrigger}
        onAnalyzingChange={setAnalyzing}
      />

      {wizardOpen && (
        <>
          <PipelinePreview data={pipelineData} />

          <CreateVaultWizard
            step={step}
            form={form}
            isAggressive={isAggressive}
            constraintChecks={constraintChecks}
            allConstraintsPass={allConstraintsPass}
            aiReasoning={aiPolicy?.reasoning}
            onUpdate={update}
            onToggle={toggleListItem}
          />

          <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-bg-base/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <OutlineButton
                className="w-full sm:w-auto"
                onClick={() => {
                  if (step === 0) setWizardOpen(false)
                  else setStep((s) => s - 1)
                }}
              >
                {step === 0 ? 'Edit intent' : 'Back'}
              </OutlineButton>
              {step < WIZARD_STEPS.length - 1 ? (
                <PrimaryCta className="w-full sm:w-auto" onClick={() => setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1))}>
                  Continue
                </PrimaryCta>
              ) : (
                <PrimaryCta
                  onClick={() => {
                    if (!submitting && allConstraintsPass) submit()
                  }}
                  className={`w-full sm:w-auto ${submitting || !allConstraintsPass ? 'pointer-events-none opacity-50' : ''}`}
                >
                  {submitting
                    ? 'Signing transaction…'
                    : `Sign & Create — $${creationFeeUsd.toFixed(2)} (~${formatSolAmount(estimatedFeeSol)} SOL)`}
                </PrimaryCta>
              )}
            </div>
            {step === WIZARD_STEPS.length - 1 && !submitting && (
              <p className="mt-2 text-xs text-text-muted">
                Protocol fee in SOL; wallet total also includes small account rent.
              </p>
            )}
            {createError && <p className="mt-3 text-sm text-accent-risk">{createError}</p>}
            {!dynamicContext?.primaryWallet?.address && step === WIZARD_STEPS.length - 1 && (
              <p className="mt-2 text-xs text-text-muted">Connect a devnet wallet to deploy.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
