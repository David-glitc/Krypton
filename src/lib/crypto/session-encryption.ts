import nacl from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'
import crypto from 'node:crypto'

const ALGORITHM_VERSION = 1

function getEncryptionKey(): Uint8Array {
  const b64 = process.env.SESSION_ENCRYPTION_KEY
  if (b64) {
    const key = decodeBase64(b64)
    if (key.length === 32) return key
  }
  const derived = crypto.createHash('sha256').update('krypton-session-encryption-v1').digest()
  return derived
}

export type EncryptedMessagePayload = {
  v: number
  c: string
  n: string
}

export function encryptMessageJson(messagesJson: string): string {
  const key = getEncryptionKey()
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
  const plaintext = new TextEncoder().encode(messagesJson)
  const ciphertext = nacl.secretbox(plaintext, nonce, key)
  if (!ciphertext) throw new Error('Encryption failed')
  const payload: EncryptedMessagePayload = {
    v: ALGORITHM_VERSION,
    c: encodeBase64(ciphertext),
    n: encodeBase64(nonce),
  }
  return JSON.stringify(payload)
}

export function decryptMessageJson(encrypted: string): string {
  const key = getEncryptionKey()
  let payload: EncryptedMessagePayload
  try {
    payload = JSON.parse(encrypted) as EncryptedMessagePayload
  } catch {
    return encrypted
  }
  if (payload.v !== ALGORITHM_VERSION) return encrypted
  try {
    const ciphertext = decodeBase64(payload.c)
    const nonce = decodeBase64(payload.n)
    const plaintext = nacl.secretbox.open(ciphertext, nonce, key)
    if (!plaintext) return encrypted
    return new TextDecoder().decode(plaintext)
  } catch {
    return encrypted
  }
}
