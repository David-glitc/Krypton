'use client'

import Link from 'next/link'
import { Zap, Shield, Cpu, BookOpen, ExternalLink, LucideIcon } from 'lucide-react'

const SECTIONS: Array<{ icon: LucideIcon; title: string; desc: string; href: string }> = [
  { icon: Zap, title: 'Vaults', desc: 'Create, manage, and monitor AI-managed yield vaults with on-chain policy.', href: '/app' },
  { icon: Cpu, title: 'Agent Pipeline', desc: 'Two-phase commit: the agent researches, strategizes, and you approve or reject on-chain.', href: '/app/create' },
  { icon: Shield, title: 'Policy Engine', desc: 'Constraints enforced on-chain. Max drawdown, leverage, position size, correlated exposure.', href: '/app/risk' },
  { icon: BookOpen, title: 'Architecture', desc: 'System design: Solana program, orchestrator, PostgreSQL registry, and frontend architecture.', href: '#' },
]

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-[family-name:var(--font-hanken)] text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
          Krypton Docs
        </h1>
        <p className="mt-3 text-lg text-text-secondary">
          AI-managed vaults constrained by on-chain policy on Solana devnet.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map(s => {
          const Icon = s.icon
          const inner = (
            <div className="panel p-5 h-full flex flex-col gap-3 transition-colors hover:bg-bg-panel/50">
              <Icon className="h-5 w-5 text-accent" />
              <h3 className="font-[family-name:var(--font-hanken)] text-lg font-medium text-text-primary">{s.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
            </div>
          )
          return s.href !== '#'
            ? <Link key={s.title} href={s.href}>{inner}</Link>
            : <div key={s.title}>{inner}</div>
        })}
      </div>

      <div className="panel p-6 space-y-6">
        <h2 className="font-[family-name:var(--font-hanken)] text-2xl font-bold text-text-primary">Quick Start</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-accent mb-1">1. Connect Wallet</h3>
            <p className="text-sm text-text-secondary">Connect a Solana wallet (Backpack, Phantom) via the Dynamic widget in the header. Devnet only.</p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-accent mb-1">2. Create a Vault</h3>
            <p className="text-sm text-text-secondary">Set risk parameters, select assets, and deploy. A PDA vault is created on-chain with your policy committed immutably.</p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-jetbrains)] text-xs uppercase tracking-wider text-accent mb-1">3. Fund & Run</h3>
            <p className="text-sm text-text-secondary">Deposit SOL into your vault, then queue a cycle. The agent pipeline researches, strategizes, and produces advisory actions for you to approve or reject.</p>
          </div>
        </div>
      </div>

      <div className="panel p-6 space-y-4">
        <h2 className="font-[family-name:var(--font-hanken)] text-2xl font-bold text-text-primary">Architecture</h2>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p><strong className="text-text-primary">On-chain:</strong> Solana Anchor program at <code className="rounded bg-bg-deep px-1.5 py-0.5 font-mono text-xs text-accent">DQVp9hnnU6zbyPCJbcEnS6F1fWZMQ2yCCH9jL6cFVPxF</code> on devnet. Manages vault PDAs, policy accounts, permission gates, and execution logs.</p>
          <p><strong className="text-text-primary">Orchestrator:</strong> systemd service on a VPS running solana-agent-kit. Polls for pending cycles, runs AI research/strategy, writes advisory actions to the registry DB.</p>
          <p><strong className="text-text-primary">Frontend:</strong> Next.js 16 app on Vercel. Dynamic wallets, real-time vault telemetry, approve/reject actions, deposit SOL.</p>
          <p><strong className="text-text-primary">Database:</strong> PostgreSQL via Neon. Stores vault registry (name, owner, permission level), agent reasoning logs, pending actions.</p>
        </div>
      </div>

      <div className="panel p-6 flex items-center gap-4">
        <ExternalLink className="h-5 w-5 text-text-secondary" />
        <div>
          <p className="text-sm text-text-primary font-medium">Full documentation</p>
          <p className="text-sm text-text-secondary">Detailed API references, agent configuration, and deployment guide hosted on Mintlify.</p>
        </div>
      </div>
    </div>
  )
}
