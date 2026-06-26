import { createHash } from 'node:crypto'

import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'

import { withRpcFallback } from '@/lib/solana/rpc-fallback'
import { pctToBps, leverageToBps } from '@/lib/solana/bps'
import { clampCreationFeeUsd, formatSolAmount, quoteCreationFee, riskToCreationFeeUsd } from '@/lib/solana/fees'
import { buildVaultCreationTxBundle } from '@/lib/solana/transactions'
import { getProgramId } from '@/lib/solana/idl'

export const runtime = 'nodejs'

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
    const { blockhash } = await withRpcFallback((connection) =>
      connection.getLatestBlockhash('confirmed'),
    )

    const policy = formToCapitalPolicy(form)
    const policyJson = JSON.stringify(policy)
    const contentHash = createHash('sha256').update(policyJson).digest()
    const feeQuote = await quoteCreationFee(creationFeeUsd)
    const feeLamports = feeQuote.feeLamports

    // Placeholder Voltr/agent/guardian addresses — replace with real SDK calls
    const voltrVault = new PublicKey('11111111111111111111111111111111')
    const agentSigner = new PublicKey('11111111111111111111111111111111')
    const guardianMultisig = new PublicKey('11111111111111111111111111111111')
    const allowedAssetsStr = JSON.stringify(form.assets ?? [])
    const allowedAssetsHash = createHash('sha256').update(allowedAssetsStr).digest()
    const allowedProtocolsBitmap = BigInt(255) // allow first 8 protocols

    const goalPromptHash = createHash('sha256').update(policyJson + allowedAssetsStr).digest()

    const bundle = buildVaultCreationTxBundle(
      owner,
      voltrVault,
      agentSigner,
      guardianMultisig,
      {
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

    return NextResponse.json({
      vaultPda: bundle.vaultPda,
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
