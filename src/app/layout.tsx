import type { Metadata } from 'next'
import { Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { DynamicProvider } from '@/lib/dynamic-provider'

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Krypton — Programmable Capital Policy Engine for Solana',
  description: 'Define objectives, constraints, and permissions as on-chain policy. A multi-agent AI pipeline generates strategies — the constraint engine enforces your rules. No custodian. No black box.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${hanken.variable} ${jetbrains.variable}`}>
      <body className="bg-bg-base text-text-primary antialiased font-[family-name:var(--font-hanken)]">
        <DynamicProvider>{children}</DynamicProvider>
      </body>
    </html>
  )
}
