'use client'

import { AppShell } from '@/components/app/app-shell'
import { VaultRegistryProvider } from '@/contexts/vault-registry-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <VaultRegistryProvider>
      <AppShell>{children}</AppShell>
    </VaultRegistryProvider>
  )
}
