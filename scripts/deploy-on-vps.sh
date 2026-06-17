#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Building Krypton production image..."
docker build -t ghcr.io/david-glitc/krypton:latest -f ops/Dockerfile.web .

echo "Deploying production container..."
docker compose -f docker-compose.coolify.yml down 2>/dev/null || true
docker compose -f docker-compose.coolify.yml up -d

echo "Deploying direct hot-reload container..."
docker compose -f docker-compose.hotreload.yml down 2>/dev/null || true
docker compose -f docker-compose.hotreload.yml up -d

if [[ -f ops/traefik-krypton.yaml ]]; then
  echo "Installing Traefik dynamic route config..."
  docker cp ops/traefik-krypton.yaml coolify-proxy:/traefik/dynamic/krypton.yaml
fi

echo "Upserting DNS records..."
if [[ -f "$HOME/chessonchain/.env.local" ]]; then
  node --env-file="$HOME/chessonchain/.env.local" "$HOME/chessonchain/scripts/cloudflare-dns.mjs" upsert krypton 109.205.181.119 --proxied --comment "Krypton production"
  node --env-file="$HOME/chessonchain/.env.local" "$HOME/chessonchain/scripts/cloudflare-dns.mjs" upsert krypton-dev 109.205.181.119 --proxied --comment "Krypton direct hot reload"
else
  echo "Skipped DNS upsert: missing $HOME/chessonchain/.env.local"
fi

echo
echo "Krypton endpoints:"
echo "  https://krypton.chessonchain.online"
echo "  https://krypton-dev.chessonchain.online"
echo
echo "Check containers:"
echo "  docker ps --format '{{.Names}}\t{{.Status}}' | rg '^krypton'"
