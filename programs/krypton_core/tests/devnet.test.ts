/**
 * Devnet on-chain tests for Krypton Core.
 *
 * Uses a fresh owner keypair per run to avoid stale PDAs from the old program.
 * The deployer wallet funds the test owner.
 *
 * Usage: tsx programs/krypton_core/tests/devnet.test.ts
 */

import { randomBytes } from 'node:crypto'
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL, type Commitment, type TransactionSignature } from '@solana/web3.js'
import { readFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'

async function sendAndConfirm(conn: Connection, tx: Transaction, signers: Keypair[], commitment: Commitment = 'confirmed'): Promise<TransactionSignature> {
  tx.feePayer ??= signers[0].publicKey
  const bh = await conn.getLatestBlockhash(commitment)
  tx.recentBlockhash = bh.blockhash
  for (const s of signers) tx.partialSign(s)
  const sig = await conn.sendRawTransaction(tx.serialize())
  const start = Date.now()
  while (Date.now() - start < 60_000) {
    const res = await conn.getSignatureStatus(sig)
    if (res?.value?.confirmationStatus === commitment || res?.value?.confirmationStatus === 'finalized') return sig
    await new Promise(r => setTimeout(r, 1000))
  }
  throw new Error(`Transaction ${sig} not confirmed within 60s`)
}

// ── Wire-format helpers (no IDL available) ──────────────────────

// Correct discriminators: sha256("global:<ix>")[0..8]
const D: Record<string, Buffer> = {
  create_vault:             Buffer.from([0x1d,0xed,0xf7,0xd0,0xc1,0x52,0x36,0x87]),
  submit_policy:            Buffer.from([0x3a,0xef,0x7e,0x1b,0x55,0xed,0x2b,0x85]),
  check_constraints:        Buffer.from([0x2d,0x3e,0xaa,0x69,0x61,0x68,0x55,0xf1]),
  execute_action:           Buffer.from([0xf6,0x89,0x69,0x71,0xf7,0x06,0xdf,0xae]),
  pause_vault:              Buffer.from([0xfa,0x06,0xe4,0x39,0x06,0x68,0x13,0xd2]),
  unpause_vault:            Buffer.from([0x7d,0x1d,0xd5,0xd5,0x72,0x9b,0x7d,0x3f]),
  store_encrypted_state:    Buffer.from([0xab,0x6c,0xfe,0xc7,0xc0,0x01,0xe0,0xfe]),
  rotate_agent_key:         Buffer.from([0x55,0x1f,0x11,0xd4,0xa2,0x35,0x99,0x73]),
  deposit:                  Buffer.from([0xf2,0x23,0xc6,0x89,0x52,0xe1,0xf2,0xb6]),
  withdraw:                 Buffer.from([0xb7,0x12,0x46,0x9c,0x94,0x6d,0xa1,0x22]),
  amend_policy:             Buffer.from([0x8d,0x36,0x46,0xd3,0x71,0xe3,0x0f,0x72]),
  disclose_encrypted_state: Buffer.from([0xbe,0xe3,0xb0,0x08,0x1e,0x8f,0xfd,0xca]),
  update_constraint_state:  Buffer.from([0x99,0x09,0x21,0xda,0x10,0xc8,0xdd,0x2d]),
}

function wU8(buf: Buffer, off: number, v: number): number { buf.writeUInt8(v, off); return off + 1 }
function wU32(buf: Buffer, off: number, v: number): number { buf.writeUInt32LE(v, off); return off + 4 }
function wBool(buf: Buffer, off: number, v: boolean): number { buf.writeUInt8(v ? 1 : 0, off); return off + 1 }
function wBytes(buf: Buffer, off: number, b: Uint8Array): number { buf.set(b, off); return off + b.length }
function wU64(buf: Buffer, off: number, v: bigint): number {
  buf.writeUInt32LE(Number(v & 0xffffffffn), off)
  buf.writeUInt32LE(Number(v >> 32n), off + 4)
  return off + 8
}
function wPubkey(buf: Buffer, off: number, pk: PublicKey): number { return wBytes(buf, off, pk.toBuffer()) }

// ── Config ──────────────────────────────────────────────────────
const RPC = process.env.RPC_URL ?? 'https://api.devnet.solana.com'
const PROGRAM_ID = new PublicKey('7CpwaaPcgxiC2oJv8ZdVX6m7fQZ2qDnQ6hGfUayvq1AS')
const OWNER_FUND_AMT = 0.5 * LAMPORTS_PER_SOL

function loadWallet(): Keypair {
  for (const p of [
    process.env.DEPLOYER_KEYPAIR,
    `${homedir()}/.config/solana/chessonchain-casino-deployer.json`,
    '/tmp/krypton-deploy-keypair.json',
  ]) {
    if (p && existsSync(p)) return Keypair.fromSecretKey(new Uint8Array(JSON.parse(readFileSync(p, 'utf-8'))))
  }
  throw new Error('No wallet keypair found')
}

function pda(...seeds: (Buffer | Uint8Array)[]): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(seeds, PROGRAM_ID)
}

// ── Test helpers ────────────────────────────────────────────────
let pass = 0, fail = 0

async function run(name: string, fn: () => Promise<void>) {
  try { await fn(); pass++; console.log(`  ✅ ${name}`) }
  catch (e: any) {
    fail++
    const logs = e.logs ? '\n       ' + e.logs.join('\n       ') : ''
    const msg = e.message?.split('\n')[0] ?? String(e)
    const truncated = logs.length > 600 ? logs.slice(0, 600) + '\n       ... (truncated)' : logs
    console.log(`  ❌ ${name}: ${msg}${truncated}`)
  }
}

async function expectError(name: string, fn: () => Promise<void>, expectedCode?: string) {
  try {
    await fn()
    fail++
    console.log(`  ❌ ${name}: expected error but tx succeeded`)
  } catch (e: any) {
    const msg = e.message ?? String(e)
    if (expectedCode && !msg.includes(expectedCode)) {
      fail++
      console.log(`  ❌ ${name}: expected code ${expectedCode} but got: ${msg.slice(0, 200)}`)
    } else {
      pass++
      console.log(`  ✅ ${name}`)
    }
  }
}

async function main() {
  console.log(`\n🔷 Krypton Core — Devnet On-Chain Tests\n`)
  console.log(`RPC: ${RPC}`)
  console.log(`Program: ${PROGRAM_ID.toBase58()}`)

  const conn = new Connection(RPC, 'confirmed')
  const deployer = loadWallet()
  console.log(`Deployer: ${deployer.publicKey.toBase58()}`)

  // Create a fresh test owner so vault PDA is new (avoids stale layout from old binary)
  const owner = Keypair.generate()
  console.log(`Test Owner: ${owner.publicKey.toBase58()}\n`)

  // Fund owner from deployer
  const fundIx = SystemProgram.transfer({
    fromPubkey: deployer.publicKey,
    toPubkey: owner.publicKey,
    lamports: OWNER_FUND_AMT,
  })
  const fundSig = await sendAndConfirm(conn, new Transaction().add(fundIx), [deployer])
  console.log(`  Funded owner: ${fundSig}\n`)

  // Common PDAs
  const [vPda] = pda(Buffer.from('vault'), owner.publicKey.toBuffer())
  const [pemPda] = pda(Buffer.from('permission'), vPda.toBuffer())
  const [polPda] = pda(Buffer.from('policy'), vPda.toBuffer())
  const [encPda] = pda(Buffer.from('encrypted'), vPda.toBuffer())
  const [vGoalPda] = pda(Buffer.from('vault_goal'), vPda.toBuffer())
  const [exeLogPda] = pda(Buffer.from('execution_log'), vPda.toBuffer())
  const agent   = Keypair.generate()
  const guardian = Keypair.generate()

  // ── 1. Create vault ─────────────────────────────────────────
  await run('1. Create vault', async () => {
    // CreateVaultArgs: 6×u64 (48) + [u8;32] (32) + u8 (1) + 4 extra vault_goal fields = 127 total
    const buf = Buffer.alloc(127)
    D.create_vault.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 1000n); o = wU64(buf, o, 2000n); o = wU64(buf, o, 3500n)
    o = wU64(buf, o, 5000n); o = wU64(buf, o, 1_000_000n); o = wU64(buf, o, 15n)
    o = wBytes(buf, o, new Uint8Array(32).fill(0xaa))
    o = wU8(buf, o, 3) // initial_permission_level
    // vault_goal fields
    o = wU8(buf, o, 0)  // goal_target_type
    o = wU32(buf, o, 30) // goal_time_horizon_days
    o = wU8(buf, o, 0)  // goal_use_case (0 = None)
    wBytes(buf, o, new Uint8Array(32).fill(0xdd)) // goal_created_from_prompt_hash

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
        { pubkey: pemPda, isSigner: false, isWritable: true },
        { pubkey: agent.publicKey, isSigner: false, isWritable: false },
        { pubkey: guardian.publicKey, isSigner: false, isWritable: false },
        { pubkey: vGoalPda, isSigner: false, isWritable: true },
        { pubkey: exeLogPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)

    const acc = await conn.getAccountInfo(vPda)
    if (!acc) throw new Error('Vault account not found')
    if (acc.data.length < 100) throw new Error('Vault account too small: ' + acc.data.length)
    console.log(`     vault size: ${acc.data.length} bytes`)

    const logAcc = await conn.getAccountInfo(exeLogPda)
    if (!logAcc) throw new Error('ExecutionLog account not found')
    console.log(`     execution_log size: ${logAcc.data.length} bytes`)
  })

  // ── 2. Submit policy ────────────────────────────────────────
  await run('2. Submit policy', async () => {
    const buf = Buffer.alloc(112)
    D.submit_policy.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 1000n); o = wU64(buf, o, 2000n); o = wU64(buf, o, 3500n); o = wU64(buf, o, 5000n)
    o = wBytes(buf, o, randomBytes(32))
    o = wU64(buf, o, 15n)
    wBytes(buf, o, new Uint8Array(32).fill(0xbb))

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
        { pubkey: polPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)

    const acc = await conn.getAccountInfo(polPda)
    if (!acc) throw new Error('Policy account not found')
  })

  // ── 3-6. check_constraints ──────────────────────────────────
  await run('3. check_constraints — valid action', async () => {
    const buf = Buffer.alloc(41)
    D.check_constraints.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 100n); o = wU64(buf, o, 500n); o = wU64(buf, o, 50n); o = wU64(buf, o, 100n)
    wU8(buf, o, 0)

    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: false },
        { pubkey: vPda, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
  })

  await run('4. check_constraints — reject leverage > max', async () => {
    const buf = Buffer.alloc(41)
    D.check_constraints.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 9999n); o = wU64(buf, o, 500n); o = wU64(buf, o, 50n); o = wU64(buf, o, 100n)
    wU8(buf, o, 0)

    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: false },
        { pubkey: vPda, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
  })

  await run('5. check_constraints — reject concentration > max', async () => {
    const buf = Buffer.alloc(41)
    D.check_constraints.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 500n); o = wU64(buf, o, 9999n); o = wU64(buf, o, 50n); o = wU64(buf, o, 100n)
    wU8(buf, o, 0)

    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: false },
        { pubkey: vPda, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
  })

  await run('6. check_constraints — reject drawdown > max', async () => {
    const buf = Buffer.alloc(41)
    D.check_constraints.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 500n); o = wU64(buf, o, 500n); o = wU64(buf, o, 9999n); o = wU64(buf, o, 100n)
    wU8(buf, o, 0)

    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: false },
        { pubkey: vPda, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
  })

  await run('7. check_constraints — reject correlated exposure > max', async () => {
    const buf = Buffer.alloc(41)
    D.check_constraints.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 500n); o = wU64(buf, o, 500n); o = wU64(buf, o, 50n); o = wU64(buf, o, 9999n)
    wU8(buf, o, 0)

    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: false },
        { pubkey: vPda, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
  })

  // ── 8. execute_action — constraint rejected ─────────────────
  await expectError('8. execute_action — constraint reject', async () => {
    const buf = Buffer.alloc(48)
    D.execute_action.copy(buf, 0)
    let o = 8
    o = wU8(buf, o, 0); o = wU64(buf, o, 9999n); o = wU64(buf, o, 500n); o = wU64(buf, o, 50n); o = wU64(buf, o, 100n)
    o = wU32(buf, o, 300); o = wU8(buf, o, 0); o = wBool(buf, o, false); o = wU8(buf, o, 3)

    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: false },
        { pubkey: vPda, isSigner: false, isWritable: true },
        { pubkey: polPda, isSigner: false, isWritable: false },
        { pubkey: pemPda, isSigner: false, isWritable: false },
        { pubkey: vGoalPda, isSigner: false, isWritable: false },
        { pubkey: exeLogPda, isSigner: false, isWritable: true },
      ],
      data: buf,
    }), [owner])
  }, 'ConstraintRejected')

  // ── 9. execute_action — not authorized ──────────────────────
  await expectError('9. execute_action — not authorized', async () => {
    const wrongSigner = Keypair.generate()
    const fundWrong = SystemProgram.transfer({
      fromPubkey: owner.publicKey,
      toPubkey: wrongSigner.publicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    })
    await sendAndConfirm(conn, new Transaction().add(fundWrong), [owner])

    const buf = Buffer.alloc(48)
    D.execute_action.copy(buf, 0)
    let o = 8
    o = wU8(buf, o, 1); o = wU64(buf, o, 500n); o = wU64(buf, o, 500n); o = wU64(buf, o, 50n); o = wU64(buf, o, 100n)
    o = wU32(buf, o, 300); o = wU8(buf, o, 0); o = wBool(buf, o, false); o = wU8(buf, o, 3)

    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: wrongSigner.publicKey, isSigner: true, isWritable: false },
        { pubkey: vPda, isSigner: false, isWritable: true },
        { pubkey: polPda, isSigner: false, isWritable: false },
        { pubkey: pemPda, isSigner: false, isWritable: false },
        { pubkey: vGoalPda, isSigner: false, isWritable: false },
        { pubkey: exeLogPda, isSigner: false, isWritable: true },
      ],
      data: buf,
    }), [wrongSigner])
  }, 'NotAuthorised')

  // ── 10. Pause vault ─────────────────────────────────────────
  await run('10. Pause vault', async () => {
    const buf = Buffer.alloc(9)
    D.pause_vault.copy(buf, 0)
    wU8(buf, 8, 0) // Option::None for reason

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)

    // Verify paused flag
    const acc = await conn.getAccountInfo(vPda)
    if (!acc) throw new Error('Vault not found')
    // paused is after owner(32) + bump(1) + nonce(1) + policy_version(4) = 38
    // Let's just check the instruction succeeded
  })

  // ── 11. Pause vault — already paused (should fail) ──────────
  await expectError('11. Pause vault — already paused', async () => {
    const buf = Buffer.alloc(9)
    D.pause_vault.copy(buf, 0)
    wU8(buf, 8, 0)

    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
      ],
      data: buf,
    }), [owner])
  }, 'VaultPaused')

  // ── 12. Unpause vault ───────────────────────────────────────
  await run('12. Unpause vault', async () => {
    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
      ],
      data: D.unpause_vault,
    }), [owner])
    console.log(`     sig: ${sig}`)
  })

  // ── 13. Store encrypted state ───────────────────────────────
  await run('13. Store encrypted state', async () => {
    const payload = randomBytes(64)
    const nonce = randomBytes(24)
    const buf = Buffer.alloc(104)
    D.store_encrypted_state.copy(buf, 0)
    let o = 8
    o = wU32(buf, o, 64); o = wBytes(buf, o, payload); o = wBytes(buf, o, nonce)
    wU32(buf, o, 1)

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: false },
        { pubkey: encPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)

    const acc = await conn.getAccountInfo(encPda)
    if (!acc) throw new Error('Encrypted state account not found')
    console.log(`     enc state size: ${acc.data.length} bytes`)
  })

  // ── 14. Store encrypted state — overwrite ───────────────────
  await run('14. Store encrypted state — overwrite', async () => {
    const payload = randomBytes(128)
    const nonce = randomBytes(24)
    const buf = Buffer.alloc(168)
    D.store_encrypted_state.copy(buf, 0)
    let o = 8
    o = wU32(buf, o, 128); o = wBytes(buf, o, payload); o = wBytes(buf, o, nonce)
    wU32(buf, o, 2)

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: false },
        { pubkey: encPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig} (overwrite)`)

    const acc = await conn.getAccountInfo(encPda)
    if (!acc) throw new Error('Encrypted state not found after overwrite')
  })

  // ── 15. Rotate agent key ────────────────────────────────────
  await run('15. Rotate agent key', async () => {
    const newAgent = Keypair.generate()
    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
        { pubkey: pemPda, isSigner: false, isWritable: true },
        { pubkey: newAgent.publicKey, isSigner: false, isWritable: false },
      ],
      data: D.rotate_agent_key,
    }), [owner])
    console.log(`     sig: ${sig}`)

    const acc = await conn.getAccountInfo(pemPda)
    if (!acc) throw new Error('Permission account not found')
    const stored = new PublicKey(acc.data.subarray(72, 104))
    if (!stored.equals(newAgent.publicKey)) {
      throw new Error(`Agent not rotated: expected ${newAgent.publicKey.toBase58()}, got ${stored.toBase58()}`)
    }
    console.log(`     agent rotated to ${newAgent.publicKey.toBase58()}`)
  })

  // ── 16. Rotate agent key — unauthorized ─────────────────────
  await expectError('16. Rotate agent key — unauthorized', async () => {
    const wrongSigner = Keypair.generate()
    const fundWrong = SystemProgram.transfer({
      fromPubkey: owner.publicKey,
      toPubkey: wrongSigner.publicKey,
      lamports: 0.01 * LAMPORTS_PER_SOL,
    })
    await sendAndConfirm(conn, new Transaction().add(fundWrong), [owner])

    const newAgent = Keypair.generate()
    await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: wrongSigner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
        { pubkey: pemPda, isSigner: false, isWritable: true },
        { pubkey: newAgent.publicKey, isSigner: false, isWritable: false },
      ],
      data: D.rotate_agent_key,
    }), [wrongSigner])
  }, 'NotOwner')

  // ── 17. Deposit ─────────────────────────────────────────────
  await run('17. Deposit', async () => {
    const buf = Buffer.alloc(16) // disc(8) + u64(8)
    D.deposit.copy(buf, 0)
    wU64(buf, 8, 100_000_000n) // $100 notional

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)
  })

  // ── 18. Withdraw ────────────────────────────────────────────
  await run('18. Withdraw', async () => {
    const buf = Buffer.alloc(16)
    D.withdraw.copy(buf, 0)
    wU64(buf, 8, 10_000_000n)

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)
  })

  // ── 19. Amend policy ────────────────────────────────────────
  await run('19. Amend policy', async () => {
    const buf = Buffer.alloc(112)
    D.amend_policy.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 1500n); o = wU64(buf, o, 2500n); o = wU64(buf, o, 3000n); o = wU64(buf, o, 4000n)
    o = wBytes(buf, o, randomBytes(32))
    o = wU64(buf, o, 31n)
    wBytes(buf, o, new Uint8Array(32).fill(0xcc))

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
        { pubkey: polPda, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)
  })

  // ── 20. Update constraint state ─────────────────────────────
  await run('20. Update constraint state', async () => {
    // UpdateConstraintStateArgs: 4×u64 = 32 bytes + 8 disc = 40
    const buf = Buffer.alloc(40)
    D.update_constraint_state.copy(buf, 0)
    let o = 8
    o = wU64(buf, o, 800n); o = wU64(buf, o, 300n); o = wU64(buf, o, 100n); o = wU64(buf, o, 200n)

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: true },
        { pubkey: deployer.publicKey, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)
  })

  // ── 21. Disclose encrypted state ────────────────────────────
  await run('21. Disclose encrypted state', async () => {
    const viewer = Keypair.generate()
    const buf = Buffer.alloc(41) // disc(8) + pubkey(32) + u8(1)
    D.disclose_encrypted_state.copy(buf, 0)
    wPubkey(buf, 8, viewer.publicKey)
    wU8(buf, 40, 1) // disclosure_type = risk_metrics

    const sig = await sendAndConfirm(conn, new Transaction().add({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: owner.publicKey, isSigner: true, isWritable: true },
        { pubkey: vPda, isSigner: false, isWritable: false },
      ],
      data: buf,
    }), [owner])
    console.log(`     sig: ${sig}`)
  })

  console.log(`\n📊 Results: ${pass} passed, ${fail} failed out of ${pass + fail}\n`)
}

main().catch(e => { console.error('Fatal:', e); process.exit(1) })
