import { PublicKey, Keypair, Connection } from '@solana/web3.js'
import bs58 from 'bs58'

export type OffChainResult =
  | { success: true; txSignature: string }
  | { success: false; error: string }

export interface DispatchParams {
  targetProtocolId: number
  actionTypeId: number
  vaultOwner: PublicKey
  agentKeypair: Keypair
  connection: Connection
}

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const SOL_MINT = new PublicKey('So11111111111111111111111111111111111111112')

export async function dispatchExecution(params: DispatchParams): Promise<OffChainResult> {
  switch (params.targetProtocolId) {
    case 0: return dispatchJupiterSwap(params)
    case 1: return dispatchDriftPerp(params)
    case 2: return dispatchAdrena(params)
    case 3: return dispatchPumpFun(params)
    case 4: return dispatchRaydium(params)
    case 5: return dispatchKamino(params)
    default: return { success: false, error: `Unknown target protocol: ${params.targetProtocolId}` }
  }
}

async function buildAgentKit(connection: Connection, keypair: Keypair) {
  const { SolanaAgentKit } = await import('solana-agent-kit')
  const privateKey = bs58.encode(Buffer.from(keypair.secretKey))
  return new SolanaAgentKit(
    privateKey,
    connection.rpcEndpoint,
    { OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '' },
  )
}

async function dispatchJupiterSwap(params: DispatchParams): Promise<OffChainResult> {
  try {
    const agent = await buildAgentKit(params.connection, params.agentKeypair)
    const sig = await agent.trade(SOL_MINT, 0.01)
    return { success: true, txSignature: sig }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

async function dispatchDriftPerp(params: DispatchParams): Promise<OffChainResult> {
  try {
    const agent = await buildAgentKit(params.connection, params.agentKeypair)
    const sig = await agent.tradeUsingDriftPerpAccount(0.1, 'SOL-PERP', 'long', 'market')
    return { success: true, txSignature: sig }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

async function dispatchAdrena(params: DispatchParams): Promise<OffChainResult> {
  try {
    const agent = await buildAgentKit(params.connection, params.agentKeypair)
    const sig = await agent.openPerpTradeLong({
      price: 0,
      collateralAmount: 0.1,
      leverage: 3,
    })
    return { success: true, txSignature: sig }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

async function dispatchPumpFun(params: DispatchParams): Promise<OffChainResult> {
  try {
    const agent = await buildAgentKit(params.connection, params.agentKeypair)
    const sig = await agent.trade(SOL_MINT, 0.01)
    return { success: true, txSignature: sig }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

async function dispatchRaydium(params: DispatchParams): Promise<OffChainResult> {
  try {
    const agent = await buildAgentKit(params.connection, params.agentKeypair)
    const sig = await agent.lendAssets(10)
    return { success: true, txSignature: sig }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

async function dispatchKamino(params: DispatchParams): Promise<OffChainResult> {
  try {
    const agent = await buildAgentKit(params.connection, params.agentKeypair)
    const sig = await agent.lendAssets(10)
    return { success: true, txSignature: sig }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}
