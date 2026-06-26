import nacl from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'
import { Keypair } from '@solana/web3.js'

export type PositionData = {
  positions: Position[]
  navBreakdown: NavEntry[]
  updatedAt: string
}

export type Position = {
  asset: string
  amount: string
  usdValue: string
  chain?: 'solana' | 'bitcoin' | 'ethereum'
}

export type NavEntry = {
  asset: string
  pct: number
}

export type EncryptedPayload = {
  ciphertext: string
  nonce: string
  version: number
}

const DOMAIN_SEPARATOR = 'krypton-positions-v1'
const ENCRYPTION_KEY_VERSION = 1

/**
 * Derive a symmetric encryption key from the wallet's Ed25519 secret key.
 * Uses SHA-512 with domain separation so the derived key is never the
 * same as the signing key itself.
 */
export function deriveEncryptionKey(walletSecretKey: Uint8Array): Uint8Array {
  const domainBytes = new TextEncoder().encode(DOMAIN_SEPARATOR)
  const combined = new Uint8Array(walletSecretKey.length + domainBytes.length)
  combined.set(walletSecretKey)
  combined.set(domainBytes, walletSecretKey.length)
  const hash = nacl.hash(combined)
  return hash.slice(0, 32)
}

/**
 * Derive encryption key from a Solana Keypair.
 */
export function deriveEncryptionKeyFromKeypair(wallet: Keypair): Uint8Array {
  return deriveEncryptionKey(wallet.secretKey)
}

/**
 * Encrypt position data using NaCl secretbox (XSalsa20-Poly1305).
 * Returns base64-encoded ciphertext and nonce.
 */
export function encryptPositions(
  data: PositionData,
  key: Uint8Array,
): EncryptedPayload {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
  const plaintext = new TextEncoder().encode(JSON.stringify(data))
  const ciphertext = nacl.secretbox(plaintext, nonce, key)

  if (!ciphertext) {
    throw new Error('Encryption failed — ciphertext is null')
  }

  return {
    ciphertext: encodeBase64(ciphertext),
    nonce: encodeBase64(nonce),
    version: ENCRYPTION_KEY_VERSION,
  }
}

/**
 * Decrypt position data using NaCl secretbox (XSalsa20-Poly1305).
 * Returns the decrypted PositionData.
 */
export function decryptPositions(
  payload: EncryptedPayload,
  key: Uint8Array,
): PositionData {
  const ciphertext = decodeBase64(payload.ciphertext)
  const nonce = decodeBase64(payload.nonce)

  const plaintext = nacl.secretbox.open(ciphertext, nonce, key)

  if (!plaintext) {
    throw new Error('Decryption failed — invalid key or corrupted data')
  }

  return JSON.parse(new TextDecoder().decode(plaintext)) as PositionData
}

/**
 * Convenience: encrypt positions from a Solana Keypair (for testing/CLI use).
 */
export function encryptPositionsWithKeypair(
  data: PositionData,
  wallet: Keypair,
): EncryptedPayload {
  const key = deriveEncryptionKeyFromKeypair(wallet)
  return encryptPositions(data, key)
}

/**
 * Convenience: decrypt positions from a Solana Keypair.
 */
export function decryptPositionsWithKeypair(
  payload: EncryptedPayload,
  wallet: Keypair,
): PositionData {
  const key = deriveEncryptionKeyFromKeypair(wallet)
  return decryptPositions(payload, key)
}
