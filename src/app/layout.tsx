import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'

const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'] })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'] })
const display = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Krypton — Programmable Capital Policy Engine for Solana',
  description: 'Define objectives, constraints, and permissions as on-chain policy. A multi-agent AI pipeline generates strategies — the constraint engine enforces your rules. No custodian. No black box.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.className} ${mono.className} ${display.className}`}>
      <body className="bg-bg-base text-text-primary antialiased">{children}</body>
    </html>
  )
}
