import { r as __exportAll } from "../_runtime.mjs";
import { a as createHash, d as hexStringToBase64url, f as uint8ArrayFromHexString, p as uint8ArrayToHexString, u as pointDecode } from "./@dynamic-labs/embedded-wallet+[...].mjs";
import { o as p256 } from "./noble__curves+noble__hashes.mjs";
import * as crypto$2 from "crypto";
//#region ../../node_modules/.pnpm/@turnkey+api-key-stamper@0.4.7/node_modules/@turnkey/api-key-stamper/dist/utils.mjs
/**
* Converts a Turnkey API key pair into a JSON Web Key (JWK) format.
* This function accepts P-256 API keys only.
*
* @param {Object} input - The Turnkey API key components.
* @param {string} input.uncompressedPrivateKeyHex - Hexadecimal-encoded uncompressed private key (32-byte scalar).
* @param {string} input.compressedPublicKeyHex - Hexadecimal-encoded compressed public key (33 bytes).
* @returns {JsonWebKey} A JSON Web Key object representing the EC P-256 key.
*/
function convertTurnkeyApiKeyToJwk(input) {
	const { uncompressedPrivateKeyHex, compressedPublicKeyHex } = input;
	let jwk;
	try {
		jwk = pointDecode(uint8ArrayFromHexString(compressedPublicKeyHex));
	} catch (e) {
		throw new Error(`unable to load API key: invalid public key. Did you switch your public and private key by accident? Is your public key a valid, compressed P-256 public key?`);
	}
	jwk.d = hexStringToBase64url(uncompressedPrivateKeyHex, 32);
	return jwk;
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+api-key-stamper@0.4.7/node_modules/@turnkey/api-key-stamper/dist/nodecrypto.mjs
var nodecrypto_exports = /* @__PURE__ */ __exportAll({ signWithApiKey: () => signWithApiKey$2 });
var signWithApiKey$2 = async (input) => {
	const { content, publicKey, privateKey } = input;
	const privateKeyObject = crypto$2.createPrivateKey({
		key: convertTurnkeyApiKeyToJwk({
			uncompressedPrivateKeyHex: privateKey,
			compressedPublicKeyHex: publicKey
		}),
		format: "jwk"
	});
	const sign = crypto$2.createSign("SHA256");
	sign.write(Buffer.from(content));
	sign.end();
	return sign.sign(privateKeyObject, "hex");
};
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+api-key-stamper@0.4.7/node_modules/@turnkey/api-key-stamper/dist/purejs.mjs
var purejs_exports = /* @__PURE__ */ __exportAll({ signWithApiKey: () => signWithApiKey$1 });
var signWithApiKey$1 = async (input) => {
	const publicKeyString = uint8ArrayToHexString(p256.getPublicKey(input.privateKey, true));
	if (publicKeyString != input.publicKey) throw new Error(`Bad API key. Expected to get public key ${input.publicKey}, got ${publicKeyString}`);
	const hash = createHash().update(input.content).digest();
	return p256.sign(hash, input.privateKey).toDERHex();
};
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+api-key-stamper@0.4.7/node_modules/@turnkey/api-key-stamper/dist/webcrypto.mjs
var webcrypto_exports = /* @__PURE__ */ __exportAll({ signWithApiKey: () => signWithApiKey });
var signWithApiKey = async (input) => {
	const { content, publicKey, privateKey } = input;
	return await signMessage({
		key: await importTurnkeyApiKey({
			uncompressedPrivateKeyHex: privateKey,
			compressedPublicKeyHex: publicKey
		}),
		content
	});
};
/**
* Imports a P-256 Turnkey API key into a WebCrypto `CryptoKey`.
*
* @param {Object} input - The Turnkey API key components.
* @param {string} input.uncompressedPrivateKeyHex - Hexadecimal-encoded uncompressed private key (32-byte scalar).
* @param {string} input.compressedPublicKeyHex - Hexadecimal-encoded compressed public key (33 bytes).
* @returns {Promise<CryptoKey>} A `CryptoKey` object representing a P-256 key.
*/
async function importTurnkeyApiKey(input) {
	const { uncompressedPrivateKeyHex, compressedPublicKeyHex } = input;
	const jwk = convertTurnkeyApiKeyToJwk({
		uncompressedPrivateKeyHex,
		compressedPublicKeyHex
	});
	return await crypto.subtle.importKey("jwk", jwk, {
		name: "ECDSA",
		namedCurve: "P-256"
	}, false, ["sign"]);
}
async function signMessage(input) {
	const { key, content } = input;
	const signatureIeee1363 = await crypto.subtle.sign({
		name: "ECDSA",
		hash: "SHA-256"
	}, key, new TextEncoder().encode(content));
	return uint8ArrayToHexString(convertEcdsaIeee1363ToDer(new Uint8Array(signatureIeee1363)));
}
/**
* `SubtleCrypto.sign(...)` outputs signature in IEEE P1363 format:
* - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign#ecdsa
*
* Turnkey expects the signature encoding to be DER-encoded ASN.1:
* - https://github.com/tkhq/tkcli/blob/7f0159af5a73387ff050647180d1db4d3a3aa033/src/internal/apikey/apikey.go#L149
*
* Code modified from https://github.com/google/tink/blob/6f74b99a2bfe6677e3670799116a57268fd067fa/javascript/subtle/elliptic_curves.ts#L114
*
* Transform an ECDSA signature in IEEE 1363 encoding to DER encoding.
*
* @param ieee the ECDSA signature in IEEE encoding
* @return ECDSA signature in DER encoding
*/
function convertEcdsaIeee1363ToDer(ieee) {
	if (ieee.length % 2 != 0 || ieee.length == 0 || ieee.length > 132) throw new Error("Invalid IEEE P1363 signature encoding. Length: " + ieee.length);
	const r = toUnsignedBigNum(ieee.subarray(0, ieee.length / 2));
	const s = toUnsignedBigNum(ieee.subarray(ieee.length / 2, ieee.length));
	let offset = 0;
	const length = 2 + r.length + 1 + 1 + s.length;
	let der;
	if (length >= 128) {
		der = new Uint8Array(length + 3);
		der[offset++] = 48;
		der[offset++] = 129;
		der[offset++] = length;
	} else {
		der = new Uint8Array(length + 2);
		der[offset++] = 48;
		der[offset++] = length;
	}
	der[offset++] = 2;
	der[offset++] = r.length;
	der.set(r, offset);
	offset += r.length;
	der[offset++] = 2;
	der[offset++] = s.length;
	der.set(s, offset);
	return der;
}
/**
* Code modified from https://github.com/google/tink/blob/6f74b99a2bfe6677e3670799116a57268fd067fa/javascript/subtle/elliptic_curves.ts#L311
*
* Transform a big integer in big endian to minimal unsigned form which has
* no extra zero at the beginning except when the highest bit is set.
*/
function toUnsignedBigNum(bytes) {
	let start = 0;
	while (start < bytes.length && bytes[start] == 0) start++;
	if (start == bytes.length) start = bytes.length - 1;
	let extraZero = 0;
	if ((bytes[start] & 128) == 128) extraZero = 1;
	const res = new Uint8Array(bytes.length - start + extraZero);
	res.set(bytes.subarray(start), extraZero);
	return res;
}
//#endregion
export { purejs_exports as n, nodecrypto_exports as r, webcrypto_exports as t };
