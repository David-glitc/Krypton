#!/usr/bin/env bash
# Sync Krypton app env vars to all Vercel environments (production, preview, development).
# Secrets are read from production via `vercel env run` (pull masks sensitive values).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOCAL_ENV_BACKUP=""
if [[ -f .env.local ]]; then
  LOCAL_ENV_BACKUP=".env.local.bak.$$"
  mv .env.local "$LOCAL_ENV_BACKUP"
fi
trap '[[ -n "$LOCAL_ENV_BACKUP" && -f "$LOCAL_ENV_BACKUP" ]] && mv "$LOCAL_ENV_BACKUP" .env.local' EXIT

OPENROUTER_KEY="$(vercel env run --environment=production -- sh -c 'printf %s "$OPENROUTER_API_KEY"' 2>/dev/null | tail -1 || true)"

sync_var() {
  local key="$1" val="$2"
  for env in production preview development; do
    printf '%s' "$val" | vercel env add "$key" "$env" --force --yes 2>/dev/null \
      || printf '%s' "$val" | vercel env add "$key" "$env" --yes
  done
  echo "synced $key"
}

sync_var LIBSQL_URL 'https://krypton-db.chessonchain.online'
sync_var NEXT_PUBLIC_DYNAMIC_ENV_ID '7a529f4c-9cc3-4e88-9911-1a10672cc36c'
sync_var NEXT_PUBLIC_KRYPTON_PROGRAM_ID '7CpwaaPcgxiC2oJv8ZdVX6m7fQZ2qDnQ6hGfUayvq1AS'
HELIUS_DEVNET='https://devnet.helius-rpc.com/?api-key=057b3e58-abee-40df-9898-95d0b8bca95f'
HELIUS_MAINNET='https://mainnet.helius-rpc.com/?api-key=057b3e58-abee-40df-9898-95d0b8bca95f'
ALCHEMY_DEVNET='https://solana-devnet.g.alchemy.com/v2/H10XsCFWojDIXpUWdB-bZ'
ALCHEMY_MAINNET='https://solana-mainnet.g.alchemy.com/v2/H10XsCFWojDIXpUWdB-bZ'

sync_var NEXT_PUBLIC_SOLANA_RPC_URL "$HELIUS_DEVNET"
sync_var NEXT_PUBLIC_SOLANA_RPC_FALLBACK_URL "$ALCHEMY_DEVNET"
sync_var NEXT_PUBLIC_SOLANA_RPC_MAINNET_URL "$HELIUS_MAINNET"
sync_var NEXT_PUBLIC_SOLANA_RPC_MAINNET_FALLBACK_URL "$ALCHEMY_MAINNET"
sync_var SOLANA_RPC_URL "$HELIUS_DEVNET"
sync_var SOLANA_RPC_FALLBACK_URL "$ALCHEMY_DEVNET"
sync_var SOLANA_RPC_MAINNET_URL "$HELIUS_MAINNET"
sync_var SOLANA_RPC_MAINNET_FALLBACK_URL "$ALCHEMY_MAINNET"
sync_var OPENROUTER_POLICY_MODEL 'openrouter/owl-alpha'
sync_var KRYPTON_STUB_AGENTS 'true'

if [[ -n "$OPENROUTER_KEY" ]]; then
  sync_var OPENROUTER_API_KEY "$OPENROUTER_KEY"
else
  echo "WARN: OPENROUTER_API_KEY not found in production — set manually"
fi

vercel env ls
