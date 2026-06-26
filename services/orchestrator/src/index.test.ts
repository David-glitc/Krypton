import { describe, it, expect } from 'vitest'
import { Keypair, TransactionInstruction } from '@solana/web3.js'
import { generateCharacterFromPolicy, generatePresetCharacter } from './character/generator.js'
import type { CapitalPolicy } from './character/types.js'
import { ExecutionClient } from './execution-client.js'
import { CYCLE_STAGES } from './cycle-fsm.js'

describe('generateCharacterFromPolicy', () => {
  const lowRiskPolicy: CapitalPolicy = {
    objective: { type: 'capital_preservation', benchmark: 'USDC' },
    universe: {
      assets: ['SOL', 'USDC'],
      protocols_allowed: ['sanctum', 'kamino'],
    },
    risk: {
      profile: 'low',
      max_drawdown_pct: 5,
      max_leverage: 1,
      max_position_pct: 40,
      max_correlated_exposure_pct: 30,
    },
    execution: {
      mode: 'constrained_auto',
      rebalance_frequency: 'weekly',
    },
    allowed_actions: ['stake', 'lend'],
  }

  const highRiskPolicy: CapitalPolicy = {
    objective: { type: 'maximize_risk_adjusted_return', benchmark: 'SOL_USD' },
    universe: {
      assets: ['SOL', 'ETH', 'USDC'],
      protocols_allowed: ['jupiter', 'drift', 'kamino'],
    },
    risk: {
      profile: 'high',
      max_drawdown_pct: 25,
      max_leverage: 3,
      max_position_pct: 50,
      max_correlated_exposure_pct: 80,
    },
    execution: {
      mode: 'constrained_auto',
      rebalance_frequency: 'daily',
    },
    allowed_actions: ['swap', 'lend', 'borrow', 'open_perp', 'close_perp'],
  }

  it('generates a character with correct name', () => {
    const char = generateCharacterFromPolicy(lowRiskPolicy, undefined, 'my-agent')
    expect(char.name).toBe('my-agent')
  })

  it('generates character with model provider matching risk profile', () => {
    const low = generateCharacterFromPolicy(lowRiskPolicy)
    expect(low.modelProvider).toBe('anthropic')

    const high = generateCharacterFromPolicy(highRiskPolicy)
    expect(high.modelProvider).toBe('anthropic')
  })

  it('includes constraint limits from policy', () => {
    const char = generateCharacterFromPolicy(lowRiskPolicy)
    expect(char.constraints).toBeDefined()
    expect(char.constraints!.maxLeverageBps).toBe(1000)
    expect(char.constraints!.maxDrawdownBps).toBe(500)
    expect(char.constraints!.maxPositionBps).toBe(4000)
    expect(char.constraints!.maxCorrelatedExposureBps).toBe(3000)
    expect(char.constraints!.rebalanceFrequency).toBe('weekly')
  })

  it('includes high-risk constraints correctly', () => {
    const char = generateCharacterFromPolicy(highRiskPolicy)
    expect(char.constraints!.maxLeverageBps).toBe(3000)
    expect(char.constraints!.maxDrawdownBps).toBe(2500)
    expect(char.constraints!.rebalanceFrequency).toBe('daily')
  })

  it('includes the krypton plugin in plugins array', () => {
    const char = generateCharacterFromPolicy(lowRiskPolicy)
    expect(char.plugins).toContain('@krypton/elizaos-plugin')
  })

  it('generates goals based on policy objective', () => {
    const presChar = generateCharacterFromPolicy(lowRiskPolicy)
    expect(presChar.goals!.some((g) => g.name === 'capital_preservation')).toBe(true)

    const maxChar = generateCharacterFromPolicy(highRiskPolicy)
    expect(maxChar.goals!.some((g) => g.name === 'risk_adjusted_return')).toBe(true)
  })

  it('all presets include policy_compliance goal', () => {
    const char = generateCharacterFromPolicy(lowRiskPolicy)
    expect(char.goals!.some((g) => g.name === 'policy_compliance')).toBe(true)
  })

  it('system prompt includes action restrictions', () => {
    const char = generateCharacterFromPolicy(lowRiskPolicy)
    expect(char.system).toContain('stake')
    expect(char.system).toContain('lend')
  })

  it('system prompt includes drawdown and leverage limits', () => {
    const char = generateCharacterFromPolicy(lowRiskPolicy)
    expect(char.system).toContain('5%')
    expect(char.system).toContain('1x')
  })

  it('advisory mode includes confirmation note', () => {
    const advisoryPolicy: CapitalPolicy = {
      ...lowRiskPolicy,
      execution: { mode: 'advisory', rebalance_frequency: 'event_driven' },
    }
    const char = generateCharacterFromPolicy(advisoryPolicy)
    expect(char.system).toContain('advisory mode')
    expect(char.system).toContain('Never execute without confirmation')
  })
})

describe('generatePresetCharacter', () => {
  const presets = [
    'stable-saver',
    'steady-compounder',
    'growth-allocator',
    'aggressive-compounder',
    'collateral-vault',
    'on-chain-deposit-box',
  ] as const

  it('generates all 6 presets without error', () => {
    for (const name of presets) {
      const char = generatePresetCharacter(name)
      expect(char.name).toBe(name)
      expect(char.constraints).toBeDefined()
    }
  })

  it('stable-saver has zero leverage and weekly rebalance', () => {
    const char = generatePresetCharacter('stable-saver')
    expect(char.constraints!.maxLeverageBps).toBe(1000)
    expect(char.constraints!.rebalanceFrequency).toBe('weekly')
  })

  it('aggressive-compounder has highest max drawdown', () => {
    const char = generatePresetCharacter('aggressive-compounder')
    expect(char.constraints!.maxDrawdownBps).toBe(2000)
    expect(char.constraints!.allowedActions).toContain('open_perp')
  })

  it('collateral-vault is advisory mode with rebalanceFrequency event_driven', () => {
    const char = generatePresetCharacter('collateral-vault')
    expect(char.constraints!.rebalanceFrequency).toBe('event_driven')
    expect(char.system).toContain('advisory mode')
  })

  it('throws for unknown preset', () => {
    expect(() => generatePresetCharacter('unknown-preset')).toThrow('Unknown preset')
  })
})

describe('CYCLE_STAGES', () => {
  it('has 6 stages in correct order', () => {
    expect(CYCLE_STAGES).toEqual([
      'RESEARCHING',
      'STRATEGIZING',
      'RISK_REVIEW',
      'SIMULATING',
      'PERMISSION_GATE',
      'MONITORING',
    ])
  })
})

describe('parseActionType', () => {
  it('returns 0 for swap actions', async () => {
    const { parseActionType } = await import('./worker.js')
    expect(parseActionType('swap 5% USDC to SOL')).toBe(0)
    expect(parseActionType('swap')).toBe(0)
    expect(parseActionType('noop')).toBe(0)
  })

  it('returns 1 for stake actions', async () => {
    const { parseActionType } = await import('./worker.js')
    expect(parseActionType('stake 10 SOL')).toBe(1)
    expect(parseActionType('unstake')).toBe(1)
  })

  it('returns 2 for lend/borrow', async () => {
    const { parseActionType } = await import('./worker.js')
    expect(parseActionType('lend USDC on kamino')).toBe(2)
    expect(parseActionType('borrow SOL')).toBe(2)
  })

  it('returns 3 for liquidity actions', async () => {
    const { parseActionType } = await import('./worker.js')
    expect(parseActionType('provide liquidity')).toBe(3)
    expect(parseActionType('liquidity pool')).toBe(3)
  })

  it('returns 4 for open_perp', async () => {
    const { parseActionType } = await import('./worker.js')
    expect(parseActionType('open perp position')).toBe(4)
    expect(parseActionType('perp')).toBe(4)
  })

  it('returns 5 for close_perp', async () => {
    const { parseActionType } = await import('./worker.js')
    expect(parseActionType('close_perp')).toBe(5)
    expect(parseActionType('close position')).toBe(5)
  })
})

describe('ExecutionClient', () => {
  const mockConnection = {} as any
  const client = new ExecutionClient({ connection: mockConnection })

  it('buildExecuteActionInstruction returns a TransactionInstruction', () => {
    const authority = Keypair.generate()
    const ix = client.buildExecuteActionInstruction({
      vaultPubkey: Keypair.generate().publicKey,
      vaultOwner: Keypair.generate().publicKey,
      actionType: 1,
      postLeverageBps: 1000,
      postConcentrationBps: 2000,
      postDrawdownBps: 500,
      postCorrelatedBps: 1000,
      compositeScore: 750,
      targetProtocolId: 0,
      isDeRisk: false,
      requiredLevel: 1,
      typedActionData: Buffer.from('stake SOL'),
      authority,
    })

    expect(ix).toBeInstanceOf(TransactionInstruction)
    expect(ix.keys.length).toBe(8)
    expect(ix.data.length).toBeGreaterThan(8)
    // First 8 bytes are the discriminator
    expect(ix.data.subarray(0, 8)).toEqual(Buffer.from([0xf6, 0x89, 0x69, 0x71, 0xf7, 0x06, 0xdf, 0xae]))
    // Byte 8 is actionType
    expect(ix.data[8]).toBe(1)
    // Last bytes are the typed action data
    const dataBuf = Buffer.from('stake SOL')
    expect(ix.data.subarray(ix.data.length - dataBuf.length)).toEqual(dataBuf)
  })

  it('includes authority as signer in keys', () => {
    const authority = Keypair.generate()
    const ix = client.buildExecuteActionInstruction({
      vaultPubkey: Keypair.generate().publicKey,
      vaultOwner: Keypair.generate().publicKey,
      actionType: 0,
      postLeverageBps: 0, postConcentrationBps: 0, postDrawdownBps: 0, postCorrelatedBps: 0,
      compositeScore: 0, targetProtocolId: 0, isDeRisk: false, requiredLevel: 0,
      typedActionData: Buffer.from('test'),
      authority,
    })

    const signerKey = ix.keys.find((k) => k.isSigner)
    expect(signerKey).toBeDefined()
    expect(signerKey!.pubkey.toString()).toBe(authority.publicKey.toString())
  })
})
