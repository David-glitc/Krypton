import { VaultDetailClient } from '@/components/app/vault-detail-client'

export default async function VaultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <VaultDetailClient vaultAddress={id} />
}
