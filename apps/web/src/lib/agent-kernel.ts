import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { KRYPTON_PROGRAM_ID } from '@krypton/sdk'
import { useLazorkitWallet } from './LazorkitProvider'

/**
 * Agent Kernel — per-vault agent with delegated address management.
 *
 * Every vault gets an agent that holds a set of scoped addresses.
 * Each address has a purpose (swap, lend, stake, oracle, fee) and
 * can execute on-chain actions within its scope.
 *
 * The agent address is derived from the vault ID + agent seed so
 * it's deterministic and verifiable on-chain.
 */

export type AgentRole = 'swap' | 'lend' | 'stake' | 'oracle' | 'fee' | 'guard' | 'policy'

export interface AgentAddress {
  publicKey: PublicKey
  role: AgentRole
  label: string
  createdAt: number
}

export interface VaultAgent {
  vaultId: string
  agentId: PublicKey
  addresses: AgentAddress[]
}

export interface AgentAction {
  id: string
  vaultId: string
  agentId: string
  fromAddress: PublicKey
  toAddress: PublicKey
  role: AgentRole
  instruction: TransactionInstruction
  status: 'pending' | 'simulated' | 'executed' | 'failed'
  reason: string
  timestamp: number
}

/**
 * Resolve vault agent PDA from vault ID
 */
export function resolveAgentAddress(
  programId: PublicKey,
  vaultPda: PublicKey,
  agentSeed: string,
): PublicKey {
  const seed = Buffer.from(agentSeed)
  const [pda] = PublicKey.findProgramAddressSync(
    [vaultPda.toBuffer(), seed],
    programId,
  )
  return pda
}

/**
 * Generate deterministic scoped addresses for a vault agent.
 * Each role gets a deterministic PDA off the agent root.
 */
export function deriveAddressesForRole(
  programId: PublicKey,
  agentPda: PublicKey,
  roles: AgentRole[],
): AgentAddress[] {
  return roles.map((role) => {
    const seed = Buffer.from(`role:${role}`)
    const [pda] = PublicKey.findProgramAddressSync(
      [agentPda.toBuffer(), seed],
      programId,
    )
    return {
      publicKey: pda,
      role,
      label: `${role}-${pda.toBase58().slice(0, 4)}`,
      createdAt: Date.now(),
    }
  })
}

/**
 * Hook: useAgentWallet — agent-aware wallet interface for a specific vault.
 *
 * Provides managed addresses and action execution scoped to the
 * agent's roles.
 */
export function useAgentWallet(vaultId: string) {
  const { wallet, signAndSendTransaction } = useLazorkitWallet()

  if (!wallet) {
    return {
      agent: null,
      addresses: [] as AgentAddress[],
      executeAction: async () => {
        throw new Error('No wallet connected')
      },
  const programId = new PublicKey(KRYPTON_PROGRAM_ID)
  const agentPda = resolveAgentAddress(
    programId,
    wallet.publicKey,
    `agent:${vaultId}`,
  )

  const roles: AgentRole[] = ['swap', 'lend', 'stake', 'oracle', 'fee']
  const addresses = deriveAddressesForRole(
    programId,
    agentPda,
    roles,
  )

  const agent: VaultAgent = {
    vaultId,
    agentId: agentPda,
    addresses,
  }

  const executeAction = async (
    role: AgentRole,
    instruction: TransactionInstruction,
    reason: string,
  ) => {
    const fromAddr = addresses.find((a) => a.role === role)
    if (!fromAddr) throw new Error(`No address for role: ${role}`)

    const sig = await signAndSendTransaction({
      instructions: [instruction],
      // The Lazorkit smart wallet handles passkey signing
    })

    return { signature: sig, fromAddress: fromAddr.publicKey }
  }

  return { agent, addresses, executeAction }
}