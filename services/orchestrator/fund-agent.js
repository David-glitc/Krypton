const { Keypair, Connection } = require('@solana/web3.js');
const b64 = 'WzI0NywxMTUsMjMsMjEsMjEyLDIxMywyNDAsNjYsMjA3LDE2Miw3MywxOTgsNjksMTgyLDEzNywxNzQsMjIyLDIxLDEyNywyOCw0OSwxNTEsNzcsMTM3LDEwNSwyNDgsMjE1LDIzMywxMDUsMTE1LDEyMSwxMTYsNDIsMTEyLDIwOCw4OSwyMzgsMjQ1LDI0OCw3LDE1OCwxMywxNzIsMjAwLDIzMCwyNCwxNjAsMTg3LDU4LDEwMSwyNDMsODEsMiwxMzgsODQsMTg3LDE4MCwyMTgsNTAsNjIsNTUsOSw1NCwyMTld';
const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(Buffer.from(b64, 'base64').toString())));
console.log('Pubkey:', keypair.publicKey.toBase58());
const conn = new Connection('https://api.devnet.solana.com');
conn.requestAirdrop(keypair.publicKey, 5e9).then(sig => {
  console.log('Airdrop sig:', sig);
  return conn.confirmTransaction(sig);
}).then(confirmed => {
  console.log('Confirmed:', JSON.stringify(confirmed));
}).catch(e => console.error('Error:', e.message));
