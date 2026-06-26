import { PublicKey } from '@solana/web3.js'

export function readU8(buf: Buffer, offset: number): [number, number] {
  return [buf.readUInt8(offset), offset + 1]
}

export function readU32(buf: Buffer, offset: number): [number, number] {
  return [buf.readUInt32LE(offset), offset + 4]
}

export function readU64(buf: Buffer, offset: number): [bigint, number] {
  const lo = BigInt(buf.readUInt32LE(offset))
  const hi = BigInt(buf.readUInt32LE(offset + 4))
  return [hi * BigInt(4294967296) + lo, offset + 8]
}

export function readI64(buf: Buffer, offset: number): [bigint, number] {
  const [value, next] = readU64(buf, offset)
  const maxSigned = BigInt('9223372036854775808')
  const mod = BigInt('18446744073709551616')
  const signed = value >= maxSigned ? value - mod : value
  return [signed, next]
}

export function readBool(buf: Buffer, offset: number): [boolean, number] {
  const [tag, next] = readU8(buf, offset)
  return [tag !== 0, next]
}

export function readPubkey(buf: Buffer, offset: number): [PublicKey, number] {
  return [new PublicKey(buf.subarray(offset, offset + 32)), offset + 32]
}

export function readFixedBytes(
  buf: Buffer,
  offset: number,
  length: number,
): [Uint8Array, number] {
  return [buf.subarray(offset, offset + length), offset + length]
}

export function readF64(buf: Buffer, offset: number): [number, number] {
  return [buf.readDoubleLE(offset), offset + 8]
}

export function readOptionString(
  buf: Buffer,
  offset: number,
): [string | null, number] {
  const [tag, afterTag] = readU8(buf, offset)
  if (tag === 0) return [null, afterTag]
  if (tag !== 1) {
    throw new Error(`Invalid Option tag: ${tag}`)
  }
  const [len, afterLen] = readU32(buf, afterTag)
  const value = buf.subarray(afterLen, afterLen + len).toString('utf8')
  return [value, afterLen + len]
}

export function writeU8(buf: Buffer, offset: number, value: number): number {
  buf.writeUInt8(value, offset)
  return offset + 1
}

export function writeU32(buf: Buffer, offset: number, value: number): number {
  buf.writeUInt32LE(value, offset)
  return offset + 4
}

export function writeBool(buf: Buffer, offset: number, value: boolean): number {
  buf.writeUInt8(value ? 1 : 0, offset)
  return offset + 1
}

export function writeU64(buf: Buffer, offset: number, value: bigint | number): number {
  const v = BigInt(value)
  const mask = BigInt(4294967295)
  buf.writeUInt32LE(Number(v & mask), offset)
  buf.writeUInt32LE(Number(v / BigInt(4294967296)), offset + 4)
  return offset + 8
}

export function writeFixedBytes(
  buf: Buffer,
  offset: number,
  bytes: Uint8Array,
): number {
  buf.set(bytes, offset)
  return offset + bytes.length
}

export function assertAccountDiscriminator(
  data: Buffer,
  expected: Buffer,
  accountName: string,
): void {
  const actual = data.subarray(0, 8)
  if (!actual.equals(expected)) {
    throw new Error(
      `Invalid ${accountName} discriminator: expected ${expected.toString('hex')}, got ${actual.toString('hex')}`,
    )
  }
}
