import { createHash } from 'node:crypto'

import { NextResponse } from 'next/server'
import { Keypair, PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'

import { withRpcFallback } from '@/lib/solana/rpc-fallback'
import { deriveVaultPda } from '@/lib/solana/accounts'
import { fetchAllVaults } from '@/lib/solana/client'
import { pctToBps, leverageToBps } from '@/lib/solana/bps'
import { clampCreationFeeUsd, quoteCreationFee, riskToCreationFeeUsd } from '@/lib/solana/fees'
import { buildVaultCreationTxBundle } from '@/lib/solana/transactions'
import { getProgramId } from '@/lib/solana/idl'
import { storePendingVaultKey } from '@/lib/services/vault-registry-service'

export const runtime = 'nodejs'

/** Get the agent signer pubkey — env var, generated dev key, or ephemeral keypair. */
function getAgentSigner(): { pubkey: PublicKey; secretKey?: string } {
  const fromEnv = process.env.AGENT_SIGNER_PUBKEY
  if (fromEnv) return { pubkey: new PublicKey(fromEnv) }

  const fromSecret = process.env.AGENT_SIGNER_SECRET
  if (fromSecret) {
    const kp = Keypair.fromSecretKey(bs58.decode(fromSecret))
    return { pubkey: kp.publicKey, secretKey: fromSecret }
  }

  // Dev-only: generate an ephemeral agent keypair
  const kp = new Keypair()
  return {
    pubkey: kp.publicKey,
    secretKey: bs58.encode(kp.secretKey),
  }
}

/** Get the guardian multisig address — env var or placeholder. */
function getGuardianMultisig(): PublicKey {
  const fromEnv = process.env.NEXT_PUBLIC_GUARDIAN_MULTISIG
  if (fromEnv) return new PublicKey(fromEnv)
  return new PublicKey('11111111111111111111111111111111')
}

/** Fee multiplier for vault index — 1x for first 5, 2x for 6-10, 3x for 11-15, etc. */
function feeMultiplier(vaultIndex: number): number {
  if (vaultIndex < 5) return 1
  return 1 + Math.floor(vaultIndex / 5)
}

function formToCapitalPolicy(form: Record<string, unknown>) {
  return {
    policy_version: 1,
    objective: { type: 'maximize_risk_adjusted_return', benchmark: 'SOL_USD' },
    universe: {
      assets: Array.isArray(form.assets) ? form.assets.map(String) : [],
      protocols_allowed: Array.isArray(form.protocols) ? form.protocols.map(String) : [],
    },
    risk: {
      profile: String(form.riskProfile ?? 'medium'),
      max_drawdown_pct: Number(form.maxDrawdownPct ?? 12),
      max_leverage: Number(form.maxLeverage ?? 1.5),
      max_position_pct: Number(form.maxPositionPct ?? 35),
      max_correlated_exposure_pct: Number(form.maxCorrelatedExposurePct ?? 60),
    },
    liquidity: { min_pool_liquidity_usd: Number(form.liquidityFloorUsd ?? 5_000_000) },
    time_horizon_days: 90,
    allowed_actions: Array.isArray(form.allowedActions) ? form.allowedActions.map(String) : ['swap', 'stake', 'lend'],
    forbidden: Array.isArray(form.forbiddenActions) ? form.forbiddenActions.map(String) : [],
    execution: {
      mode: String(form.executionMode ?? 'advisory'),
      rebalance_frequency: String(form.rebalanceFrequency ?? 'daily'),
    },
    governance: { mode: String(form.governanceMode ?? 'owner') },
    privacy: { level: String(form.privacyLevel ?? 'standard'), disclose: ['vault_nav', 'proof_of_performance'] },
    fees: { management_bps: 0, performance_bps: 1000, hurdle_rate_pct: 0 },
    emergency: { pause_authority: Array.isArray(form.pauseAuthority) ? form.pauseAuthority.map(String) : ['owner_wallet'], auto_pause_on: ['drawdown_exceeds_max'] },
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const ownerWallet = typeof body?.ownerWallet === 'string' ? body.ownerWallet : null
  const form = body?.form as Record<string, unknown> | undefined
  const creationFeeUsd = clampCreationFeeUsd(
    riskToCreationFeeUsd(String(form?.riskProfile ?? 'medium')),
  )

  if (!ownerWallet || !form) {
    return NextResponse.json({ error: 'Missing ownerWallet or form' }, { status: 400 })
  }

  try {
    new PublicKey(ownerWallet)
  } catch {
    return NextResponse.json(
      { error: 'ownerWallet must be a valid Solana base58 public key' },
      { status: 400 },
    )
  }

  try {
    const owner = new PublicKey(ownerWallet)
    const programId = getProgramId()

    // Find the first unused nonce via a single getProgramAccounts call
    const existingVaults = await withRpcFallback((connection) =>
      fetchAllVaults(connection, owner, programId),
    )
    const usedNonces = new Set(existingVaults.map((v) => v.nonce))
    let vaultNonce = 0
    while (usedNonces.has(vaultNonce)) vaultNonce++

    if (vaultNonce >= 256) {
      return NextResponse.json({
        error: 'All 256 vault slots are in use for this wallet.',
      }, { status: 409 })
    }

    const vaultPda = deriveVaultPda(owner, programId, vaultNonce).address

    const { blockhash } = await withRpcFallback((connection) =>
      connection.getLatestBlockhash('confirmed'),
    )

    // Fee scaling: 1x for first 5 vaults, then 2x, 3x, etc.
    const vaultCount = existingVaults.length
    const multiplier = feeMultiplier(vaultCount)
    const scaledFeeUsd = clampCreationFeeUsd(creationFeeUsd * multiplier)
    const feeQuote = await quoteCreationFee(scaledFeeUsd)
    const feeLamports = feeQuote.feeLamports

    const policy = formToCapitalPolicy(form)
    const policyJson = JSON.stringify(policy)
    const contentHash = createHash('sha256').update(policyJson).digest()

    // Resolve addresses from env vars or generate dev keys
    const agent = getAgentSigner()
    const guardianMultisig = getGuardianMultisig()

    const allowedAssetsStr = JSON.stringify(form.assets ?? [])
    const allowedAssetsHash = createHash('sha256').update(allowedAssetsStr).digest()
    const allowedProtocolsBitmap = BigInt(255)

    const goalPromptHash = createHash('sha256').update(policyJson + allowedAssetsStr).digest()

    const bundle = buildVaultCreationTxBundle(
      owner,
      agent.pubkey,
      guardianMultisig,
      {
        nonce: vaultNonce,
        maxDrawdownBps: pctToBps(Number(form.maxDrawdownPct ?? 12)),
        maxLeverageBps: leverageToBps(Number(form.maxLeverage ?? 1.5)),
        maxPositionBps: pctToBps(Number(form.maxPositionPct ?? 35)),
        maxCorrelatedExposureBps: pctToBps(Number(form.maxCorrelatedExposurePct ?? 60)),
        minPoolLiquidityUsd: BigInt(Number(form.liquidityFloorUsd ?? 5_000_000)),
        allowedProtocolsBitmap,
        allowedAssetsHash: Uint8Array.from(allowedAssetsHash),
        initialPermissionLevel: 2,
        goalTargetType: Number(form.goalTargetType ?? 0),
        goalTimeHorizonDays: Number(form.timeHorizonDays ?? 90),
        goalUseCase: Number(form.goalUseCase ?? 0),
        goalCreatedFromPromptHash: Uint8Array.from(goalPromptHash),
      },
      {
        maxDrawdownBps: pctToBps(Number(form.maxDrawdownPct ?? 12)),
        maxLeverageBps: leverageToBps(Number(form.maxLeverage ?? 1.5)),
        maxPositionBps: pctToBps(Number(form.maxPositionPct ?? 35)),
        maxCorrelatedExposureBps: pctToBps(Number(form.maxCorrelatedExposurePct ?? 60)),
        contentHash: Uint8Array.from(contentHash),
        allowedProtocolsBitmap,
        allowedAssetsHash: Uint8Array.from(allowedAssetsHash),
      },
      blockhash,
      feeLamports,
    )

    // Store agent secret key server-side (never exposed to client)
    if (agent.secretKey) {
      await storePendingVaultKey(bundle.vaultPda, agent.secretKey)
    }

    return NextResponse.json({
      vaultPda: bundle.vaultPda,
      vaultNonce,
      feeMultiplier: multiplier,
      policyPda: bundle.policyPda,
      permissionPda: (bundle as any).permissionPda,
      blockhash,
      policy,
      policyJson,
      creationFeeUsd: feeQuote.creationFeeUsd,
      feeLamports: feeQuote.feeLamports,
      feeSol: feeQuote.feeSol,
      solPriceUsd: feeQuote.solPriceUsd,
      transactionBundle: {
        transactionBase64: bundle.transactionBase64,
        instructionsBase64: bundle.instructionsBase64,
      },
      explorerUrl: `https://explorer.solana.com/address/${bundle.vaultPda}?cluster=devnet`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to prepare vault transactions' },
      { status: 500 },
    )
  }
}
