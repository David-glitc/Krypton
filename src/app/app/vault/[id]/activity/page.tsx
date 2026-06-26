import { VaultActivityClient } from '@/components/app/vault-activity-client'

export default async function ActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <VaultActivityClient vaultAddress={id} />
}
