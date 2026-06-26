#!/usr/bin/env bash
# Upsert krypton-db.chessonchain.online → VPS IPv4 (Cloudflare proxied).
# Requires CLOUDFLARE_API_TOKEN in environment or --env-file pointing at chessonchain .env.local
set -euo pipefail

ENV_FILE="${ENV_FILE:-/home/david/chessonchain/.env.local}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN}"
ZONE_NAME="${CLOUDFLARE_ZONE_NAME:-chessonchain.online}"
VPS_IP="${CLOUDFLARE_DEFAULT_IP:-109.205.181.119}"
SUBDOMAIN="${1:-krypton-db}"

ZONE_ID=$(curl -4 -sS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}" \
  | python3 -c "import sys,json; r=json.load(sys.stdin)['result'][0]; print(r['id'])")

FQDN="${SUBDOMAIN}.${ZONE_NAME}"
EXISTING=$(curl -4 -sS -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?name=${FQDN}&type=A")

RECORD_ID=$(echo "$EXISTING" | python3 -c "import sys,json; r=json.load(sys.stdin).get('result',[]); print(r[0]['id'] if r else '')")

PAYLOAD=$(python3 -c "import json; print(json.dumps({'type':'A','name':'${SUBDOMAIN}','content':'${VPS_IP}','ttl':1,'proxied':True}))")

if [[ -n "$RECORD_ID" ]]; then
  echo "Updating ${FQDN} → ${VPS_IP} (proxied)"
  curl -4 -sS -X PUT -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${RECORD_ID}" \
    -d "$PAYLOAD" | python3 -c "import sys,json; d=json.load(sys.stdin); print('success:', d['success'], 'name:', d.get('result',{}).get('name'))"
else
  echo "Creating ${FQDN} → ${VPS_IP} (proxied)"
  curl -4 -sS -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
    -d "$PAYLOAD" | python3 -c "import sys,json; d=json.load(sys.stdin); print('success:', d['success'], 'name:', d.get('result',{}).get('name'))"
fi

echo "Verify: dig +short ${FQDN} A"
dig +short "${FQDN}" A
