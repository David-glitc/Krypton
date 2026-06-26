export const GLOBAL_METRICS = {
  tvl: '$4,821,092.42',
  avgApy: '18.4%',
  activeConstraints: '142',
  uptime: '99.99%',
}

export type VaultDeployment = {
  id: string
  name: string
  policyId: string
  icon: 'bank' | 'zap'
  tvl: string
  netApy: string
  riskLevel: 'Low' | 'High'
  riskTone: 'default' | 'risk'
  status: string
  tags: string[]
}

export const VAULT_DEPLOYMENTS: VaultDeployment[] = [
  {
    id: 'kryp-0041-a',
    name: 'SOL/USDC Conservative Yield',
    policyId: 'KRYP-0041-A',
    icon: 'bank',
    tvl: '$1.2M',
    netApy: '8.2%',
    riskLevel: 'Low',
    riskTone: 'default',
    status: 'OPTIMIZING',
    tags: ['Price Feed OK', 'Liquidity Check OK', 'Collateral Ratio: 154%'],
  },
  {
    id: 'kryp-0089-b',
    name: 'High-Leverage ETH Growth',
    policyId: 'KRYP-0089-B',
    icon: 'zap',
    tvl: '$3.6M',
    netApy: '32.1%',
    riskLevel: 'High',
    riskTone: 'risk',
    status: 'REBALANCING',
    tags: ['Volatility Guard Active', 'Aggregating DEX liquidity'],
  },
]

export const CONSTRAINT_MONITOR = [
  { label: 'Max Drawdown (Global)', value: '< 4.5%', status: 'PASS' },
  { label: 'Concentration Limit', value: '20% per protocol', status: 'ENFORCED' },
  { label: 'Audit Lag', value: '0.02ms', status: 'OPTIMAL' },
]

export const BLUEPRINTS = [
  {
    title: 'USDC Safe Harbor',
    description: 'Market-neutral yield extraction across tier-1 lending protocols with automated collateral rebalancing.',
    apy: '8.4%',
    prompt: 'Conservative USDC yield across tier-1 lending with max 4% drawdown and no leverage',
    icon: 'shield' as const,
  },
  {
    title: 'Solana Ecosystem Maximizer',
    description: 'Delta-hedged liquidity provision on high-volume CLMM pairs for maximum fee accumulation.',
    apy: '22.1%',
    prompt: 'Delta-hedged SOL ecosystem liquidity on CLMM pairs, medium risk, daily rebalance',
    icon: 'zap' as const,
  },
  {
    title: 'LST Leverage Arbitrage',
    description: 'Recursive borrowing against Liquid Staking Tokens to capture spread between rewards and rates.',
    apy: '14.7%',
    prompt: 'LST recursive leverage arbitrage on SOL with 2x max leverage and strict drawdown protection',
    icon: 'layers' as const,
  },
]
