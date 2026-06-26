#!/usr/bin/env bash
# Deploy krypton_core to devnet using the Atomic/chessonchain deployer keypair.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROGRAMS="$ROOT/programs"
KEYPAIR="${SOLANA_KEYPAIR:-$HOME/.config/solana/chessonchain-casino-deployer.json}"
PROGRAM_KP="$PROGRAMS/target/deploy/krypton_core-keypair.json"
RPC_URL="${SOLANA_RPC_URL:-${NEXT_PUBLIC_SOLANA_RPC_URL:-https://api.devnet.solana.com}}"

export PATH="$HOME/.avm/bin:$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin:$PATH"

if [[ ! -f "$KEYPAIR" ]]; then
  echo "ERROR: deployer keypair not found at $KEYPAIR"
  exit 1
fi

mkdir -p "$PROGRAMS/target/deploy"
if [[ ! -f "$PROGRAM_KP" ]]; then
  solana-keygen new -o "$PROGRAM_KP" --no-bip39-passphrase --force
fi

PROGRAM_ID="$(solana address -k "$PROGRAM_KP")"
DEPLOYER="$(solana address -k "$KEYPAIR")"

echo "Program ID: $PROGRAM_ID"
echo "Deployer:   $DEPLOYER"
echo "RPC:        $RPC_URL"
echo "Balance:    $(solana balance "$DEPLOYER" --url "$RPC_URL")"

cd "$PROGRAMS"
anchor build || cargo build-sbf --manifest-path krypton_core/Cargo.toml

solana program deploy "$PROGRAMS/target/deploy/krypton_core.so" \
  --program-id "$PROGRAM_KP" \
  --keypair "$KEYPAIR" \
  --url "$RPC_URL" \
  --with-compute-unit-price 50000

echo ""
echo "Deployed krypton_core to devnet."
echo "NEXT_PUBLIC_KRYPTON_PROGRAM_ID=$PROGRAM_ID"
echo "Verify: solana program show $PROGRAM_ID --url $RPC_URL"
