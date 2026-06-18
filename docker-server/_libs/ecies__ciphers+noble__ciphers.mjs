import { a as __require, t as __commonJSMin } from "../_runtime.mjs";
//#region ../../node_modules/.pnpm/@noble+ciphers@1.3.0/node_modules/@noble/ciphers/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Utilities for hex, bytes, CSPRNG.
	* @module
	*/
	/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.wrapCipher = exports.Hash = exports.nextTick = exports.isLE = void 0;
	exports.isBytes = isBytes;
	exports.abool = abool;
	exports.anumber = anumber;
	exports.abytes = abytes;
	exports.ahash = ahash;
	exports.aexists = aexists;
	exports.aoutput = aoutput;
	exports.u8 = u8;
	exports.u32 = u32;
	exports.clean = clean;
	exports.createView = createView;
	exports.bytesToHex = bytesToHex;
	exports.hexToBytes = hexToBytes;
	exports.hexToNumber = hexToNumber;
	exports.bytesToNumberBE = bytesToNumberBE;
	exports.numberToBytesBE = numberToBytesBE;
	exports.utf8ToBytes = utf8ToBytes;
	exports.bytesToUtf8 = bytesToUtf8;
	exports.toBytes = toBytes;
	exports.overlapBytes = overlapBytes;
	exports.complexOverlapBytes = complexOverlapBytes;
	exports.concatBytes = concatBytes;
	exports.checkOpts = checkOpts;
	exports.equalBytes = equalBytes;
	exports.getOutput = getOutput;
	exports.setBigUint64 = setBigUint64;
	exports.u64Lengths = u64Lengths;
	exports.isAligned32 = isAligned32;
	exports.copyBytes = copyBytes;
	/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
	function isBytes(a) {
		return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
	}
	/** Asserts something is boolean. */
	function abool(b) {
		if (typeof b !== "boolean") throw new Error(`boolean expected, not ${b}`);
	}
	/** Asserts something is positive integer. */
	function anumber(n) {
		if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
	}
	/** Asserts something is Uint8Array. */
	function abytes(b, ...lengths) {
		if (!isBytes(b)) throw new Error("Uint8Array expected");
		if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
	}
	/**
	* Asserts something is hash
	* TODO: remove
	* @deprecated
	*/
	function ahash(h) {
		if (typeof h !== "function" || typeof h.create !== "function") throw new Error("Hash should be wrapped by utils.createHasher");
		anumber(h.outputLen);
		anumber(h.blockLen);
	}
	/** Asserts a hash instance has not been destroyed / finished */
	function aexists(instance, checkFinished = true) {
		if (instance.destroyed) throw new Error("Hash instance has been destroyed");
		if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
	}
	/** Asserts output is properly-sized byte array */
	function aoutput(out, instance) {
		abytes(out);
		const min = instance.outputLen;
		if (out.length < min) throw new Error("digestInto() expects output buffer of length at least " + min);
	}
	/** Cast u8 / u16 / u32 to u8. */
	function u8(arr) {
		return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
	}
	/** Cast u8 / u16 / u32 to u32. */
	function u32(arr) {
		return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
	}
	/** Zeroize a byte array. Warning: JS provides no guarantees. */
	function clean(...arrays) {
		for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
	}
	/** Create DataView of an array for easy byte-level manipulation. */
	function createView(arr) {
		return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
	}
	/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
	exports.isLE = (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
	var hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
	var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
	/**
	* Convert byte array to hex string. Uses built-in function, when available.
	* @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
	*/
	function bytesToHex(bytes) {
		abytes(bytes);
		if (hasHexBuiltin) return bytes.toHex();
		let hex = "";
		for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
		return hex;
	}
	var asciis = {
		_0: 48,
		_9: 57,
		A: 65,
		F: 70,
		a: 97,
		f: 102
	};
	function asciiToBase16(ch) {
		if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
		if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
		if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
	}
	/**
	* Convert hex string to byte array. Uses built-in function, when available.
	* @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
	*/
	function hexToBytes(hex) {
		if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
		if (hasHexBuiltin) return Uint8Array.fromHex(hex);
		const hl = hex.length;
		const al = hl / 2;
		if (hl % 2) throw new Error("hex string expected, got unpadded hex of length " + hl);
		const array = new Uint8Array(al);
		for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
			const n1 = asciiToBase16(hex.charCodeAt(hi));
			const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
			if (n1 === void 0 || n2 === void 0) {
				const char = hex[hi] + hex[hi + 1];
				throw new Error("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
			}
			array[ai] = n1 * 16 + n2;
		}
		return array;
	}
	function hexToNumber(hex) {
		if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
		return BigInt(hex === "" ? "0" : "0x" + hex);
	}
	function bytesToNumberBE(bytes) {
		return hexToNumber(bytesToHex(bytes));
	}
	function numberToBytesBE(n, len) {
		return hexToBytes(n.toString(16).padStart(len * 2, "0"));
	}
	var nextTick = async () => {};
	exports.nextTick = nextTick;
	/**
	* Converts string to bytes using UTF8 encoding.
	* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
	*/
	function utf8ToBytes(str) {
		if (typeof str !== "string") throw new Error("string expected");
		return new Uint8Array(new TextEncoder().encode(str));
	}
	/**
	* Converts bytes to string using UTF8 encoding.
	* @example bytesToUtf8(new Uint8Array([97, 98, 99])) // 'abc'
	*/
	function bytesToUtf8(bytes) {
		return new TextDecoder().decode(bytes);
	}
	/**
	* Normalizes (non-hex) string or Uint8Array to Uint8Array.
	* Warning: when Uint8Array is passed, it would NOT get copied.
	* Keep in mind for future mutable operations.
	*/
	function toBytes(data) {
		if (typeof data === "string") data = utf8ToBytes(data);
		else if (isBytes(data)) data = copyBytes(data);
		else throw new Error("Uint8Array expected, got " + typeof data);
		return data;
	}
	/**
	* Checks if two U8A use same underlying buffer and overlaps.
	* This is invalid and can corrupt data.
	*/
	function overlapBytes(a, b) {
		return a.buffer === b.buffer && a.byteOffset < b.byteOffset + b.byteLength && b.byteOffset < a.byteOffset + a.byteLength;
	}
	/**
	* If input and output overlap and input starts before output, we will overwrite end of input before
	* we start processing it, so this is not supported for most ciphers (except chacha/salse, which designed with this)
	*/
	function complexOverlapBytes(input, output) {
		if (overlapBytes(input, output) && input.byteOffset < output.byteOffset) throw new Error("complex overlap of input and output is not supported");
	}
	/**
	* Copies several Uint8Arrays into one.
	*/
	function concatBytes(...arrays) {
		let sum = 0;
		for (let i = 0; i < arrays.length; i++) {
			const a = arrays[i];
			abytes(a);
			sum += a.length;
		}
		const res = new Uint8Array(sum);
		for (let i = 0, pad = 0; i < arrays.length; i++) {
			const a = arrays[i];
			res.set(a, pad);
			pad += a.length;
		}
		return res;
	}
	function checkOpts(defaults, opts) {
		if (opts == null || typeof opts !== "object") throw new Error("options must be defined");
		return Object.assign(defaults, opts);
	}
	/** Compares 2 uint8array-s in kinda constant time. */
	function equalBytes(a, b) {
		if (a.length !== b.length) return false;
		let diff = 0;
		for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
		return diff === 0;
	}
	/** For runtime check if class implements interface. */
	var Hash = class {};
	exports.Hash = Hash;
	/**
	* Wraps a cipher: validates args, ensures encrypt() can only be called once.
	* @__NO_SIDE_EFFECTS__
	*/
	var wrapCipher = (params, constructor) => {
		function wrappedCipher(key, ...args) {
			abytes(key);
			if (!exports.isLE) throw new Error("Non little-endian hardware is not yet supported");
			if (params.nonceLength !== void 0) {
				const nonce = args[0];
				if (!nonce) throw new Error("nonce / iv required");
				if (params.varSizeNonce) abytes(nonce);
				else abytes(nonce, params.nonceLength);
			}
			const tagl = params.tagLength;
			if (tagl && args[1] !== void 0) abytes(args[1]);
			const cipher = constructor(key, ...args);
			const checkOutput = (fnLength, output) => {
				if (output !== void 0) {
					if (fnLength !== 2) throw new Error("cipher output not supported");
					abytes(output);
				}
			};
			let called = false;
			return {
				encrypt(data, output) {
					if (called) throw new Error("cannot encrypt() twice with same key + nonce");
					called = true;
					abytes(data);
					checkOutput(cipher.encrypt.length, output);
					return cipher.encrypt(data, output);
				},
				decrypt(data, output) {
					abytes(data);
					if (tagl && data.length < tagl) throw new Error("invalid ciphertext length: smaller than tagLength=" + tagl);
					checkOutput(cipher.decrypt.length, output);
					return cipher.decrypt(data, output);
				}
			};
		}
		Object.assign(wrappedCipher, params);
		return wrappedCipher;
	};
	exports.wrapCipher = wrapCipher;
	/**
	* By default, returns u8a of length.
	* When out is available, it checks it for validity and uses it.
	*/
	function getOutput(expectedLength, out, onlyAligned = true) {
		if (out === void 0) return new Uint8Array(expectedLength);
		if (out.length !== expectedLength) throw new Error("invalid output length, expected " + expectedLength + ", got: " + out.length);
		if (onlyAligned && !isAligned32(out)) throw new Error("invalid output, must be aligned");
		return out;
	}
	/** Polyfill for Safari 14. */
	function setBigUint64(view, byteOffset, value, isLE) {
		if (typeof view.setBigUint64 === "function") return view.setBigUint64(byteOffset, value, isLE);
		const _32n = BigInt(32);
		const _u32_max = BigInt(4294967295);
		const wh = Number(value >> _32n & _u32_max);
		const wl = Number(value & _u32_max);
		const h = isLE ? 4 : 0;
		const l = isLE ? 0 : 4;
		view.setUint32(byteOffset + h, wh, isLE);
		view.setUint32(byteOffset + l, wl, isLE);
	}
	function u64Lengths(dataLength, aadLength, isLE) {
		abool(isLE);
		const num = new Uint8Array(16);
		const view = createView(num);
		setBigUint64(view, 0, BigInt(aadLength), isLE);
		setBigUint64(view, 8, BigInt(dataLength), isLE);
		return num;
	}
	function isAligned32(bytes) {
		return bytes.byteOffset % 4 === 0;
	}
	function copyBytes(bytes) {
		return Uint8Array.from(bytes);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/@ecies+ciphers@0.2.6_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/_node/compat.js
var require_compat = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._compat = void 0;
	var node_crypto_1 = __require("node:crypto");
	var utils_1 = require_utils();
	var AEAD_TAG_LENGTH = 16;
	/**
	* make `node:crypto`'s ciphers compatible with `@noble/ciphers`.
	*
	* `Cipher`'s interface is the same for both `aes-256-gcm` and `chacha20-poly1305`,
	* albeit the latter is one of `CipherCCMTypes`.
	* Interestingly, whether to set `plaintextLength` or not, or which value to set, has no actual effect.
	*/
	var _compat = (algorithm, key, nonce, AAD) => {
		const isAEAD = algorithm === "aes-256-gcm" || algorithm === "chacha20-poly1305";
		const authTagLength = isAEAD ? AEAD_TAG_LENGTH : 0;
		const options = isAEAD ? { authTagLength } : void 0;
		const encrypt = (plainText) => {
			const cipher = (0, node_crypto_1.createCipheriv)(algorithm, key, nonce, options);
			if (isAEAD && AAD !== void 0) cipher.setAAD(AAD);
			const updated = cipher.update(plainText);
			const finalized = cipher.final();
			const tag = isAEAD ? cipher.getAuthTag() : new Uint8Array(0);
			return (0, utils_1.concatBytes)(updated, finalized, tag);
		};
		const decrypt = (cipherText) => {
			const rawCipherText = cipherText.subarray(0, cipherText.length - authTagLength);
			const tag = cipherText.subarray(cipherText.length - authTagLength);
			const decipher = (0, node_crypto_1.createDecipheriv)(algorithm, key, nonce, options);
			if (isAEAD) {
				if (AAD !== void 0) decipher.setAAD(AAD);
				decipher.setAuthTag(tag);
			}
			const updated = decipher.update(rawCipherText);
			const finalized = decipher.final();
			return (0, utils_1.concatBytes)(updated, finalized);
		};
		return {
			encrypt,
			decrypt
		};
	};
	exports._compat = _compat;
}));
//#endregion
//#region ../../node_modules/.pnpm/@ecies+ciphers@0.2.6_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/aes/node.js
var require_node$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.aes256cbc = exports.aes256gcm = void 0;
	var compat_js_1 = require_compat();
	var aes256gcm = (key, nonce, AAD) => (0, compat_js_1._compat)("aes-256-gcm", key, nonce, AAD);
	exports.aes256gcm = aes256gcm;
	var aes256cbc = (key, nonce, _AAD) => (0, compat_js_1._compat)("aes-256-cbc", key, nonce);
	exports.aes256cbc = aes256cbc;
}));
//#endregion
//#region ../../node_modules/.pnpm/@ecies+ciphers@0.2.6_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/_node/hchacha.js
var require_hchacha = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._hchacha20 = void 0;
	/**
	* Copied from `@noble/ciphers/chacha`
	*/
	var _hchacha20 = (s, k, i, o32) => {
		let x00 = s[0], x01 = s[1], x02 = s[2], x03 = s[3], x04 = k[0], x05 = k[1], x06 = k[2], x07 = k[3], x08 = k[4], x09 = k[5], x10 = k[6], x11 = k[7], x12 = i[0], x13 = i[1], x14 = i[2], x15 = i[3];
		for (let r = 0; r < 20; r += 2) {
			x00 = x00 + x04 | 0;
			x12 = rotl(x12 ^ x00, 16);
			x08 = x08 + x12 | 0;
			x04 = rotl(x04 ^ x08, 12);
			x00 = x00 + x04 | 0;
			x12 = rotl(x12 ^ x00, 8);
			x08 = x08 + x12 | 0;
			x04 = rotl(x04 ^ x08, 7);
			x01 = x01 + x05 | 0;
			x13 = rotl(x13 ^ x01, 16);
			x09 = x09 + x13 | 0;
			x05 = rotl(x05 ^ x09, 12);
			x01 = x01 + x05 | 0;
			x13 = rotl(x13 ^ x01, 8);
			x09 = x09 + x13 | 0;
			x05 = rotl(x05 ^ x09, 7);
			x02 = x02 + x06 | 0;
			x14 = rotl(x14 ^ x02, 16);
			x10 = x10 + x14 | 0;
			x06 = rotl(x06 ^ x10, 12);
			x02 = x02 + x06 | 0;
			x14 = rotl(x14 ^ x02, 8);
			x10 = x10 + x14 | 0;
			x06 = rotl(x06 ^ x10, 7);
			x03 = x03 + x07 | 0;
			x15 = rotl(x15 ^ x03, 16);
			x11 = x11 + x15 | 0;
			x07 = rotl(x07 ^ x11, 12);
			x03 = x03 + x07 | 0;
			x15 = rotl(x15 ^ x03, 8);
			x11 = x11 + x15 | 0;
			x07 = rotl(x07 ^ x11, 7);
			x00 = x00 + x05 | 0;
			x15 = rotl(x15 ^ x00, 16);
			x10 = x10 + x15 | 0;
			x05 = rotl(x05 ^ x10, 12);
			x00 = x00 + x05 | 0;
			x15 = rotl(x15 ^ x00, 8);
			x10 = x10 + x15 | 0;
			x05 = rotl(x05 ^ x10, 7);
			x01 = x01 + x06 | 0;
			x12 = rotl(x12 ^ x01, 16);
			x11 = x11 + x12 | 0;
			x06 = rotl(x06 ^ x11, 12);
			x01 = x01 + x06 | 0;
			x12 = rotl(x12 ^ x01, 8);
			x11 = x11 + x12 | 0;
			x06 = rotl(x06 ^ x11, 7);
			x02 = x02 + x07 | 0;
			x13 = rotl(x13 ^ x02, 16);
			x08 = x08 + x13 | 0;
			x07 = rotl(x07 ^ x08, 12);
			x02 = x02 + x07 | 0;
			x13 = rotl(x13 ^ x02, 8);
			x08 = x08 + x13 | 0;
			x07 = rotl(x07 ^ x08, 7);
			x03 = x03 + x04 | 0;
			x14 = rotl(x14 ^ x03, 16);
			x09 = x09 + x14 | 0;
			x04 = rotl(x04 ^ x09, 12);
			x03 = x03 + x04 | 0;
			x14 = rotl(x14 ^ x03, 8);
			x09 = x09 + x14 | 0;
			x04 = rotl(x04 ^ x09, 7);
		}
		let oi = 0;
		o32[oi++] = x00;
		o32[oi++] = x01;
		o32[oi++] = x02;
		o32[oi++] = x03;
		o32[oi++] = x12;
		o32[oi++] = x13;
		o32[oi++] = x14;
		o32[oi++] = x15;
	};
	exports._hchacha20 = _hchacha20;
	var rotl = (a, b) => {
		return a << b | a >>> 32 - b;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/@ecies+ciphers@0.2.6_@noble+ciphers@1.3.0/node_modules/@ecies/ciphers/dist/chacha/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.chacha20 = exports.xchacha20 = void 0;
	var utils_1 = require_utils();
	var compat_js_1 = require_compat();
	var hchacha_js_1 = require_hchacha();
	var xchacha20 = (key, nonce, AAD) => {
		if (nonce.length !== 24) throw new Error("xchacha20's nonce must be 24 bytes");
		const constants = new Uint32Array([
			1634760805,
			857760878,
			2036477234,
			1797285236
		]);
		const subKey = new Uint32Array(8);
		(0, hchacha_js_1._hchacha20)(constants, (0, utils_1.u32)(key), (0, utils_1.u32)(nonce.subarray(0, 16)), subKey);
		const subNonce = new Uint8Array(12);
		subNonce.set([
			0,
			0,
			0,
			0
		]);
		subNonce.set(nonce.subarray(16), 4);
		return (0, compat_js_1._compat)("chacha20-poly1305", (0, utils_1.u8)(subKey), subNonce, AAD);
	};
	exports.xchacha20 = xchacha20;
	var chacha20 = (key, nonce, AAD) => {
		if (nonce.length !== 12) throw new Error("chacha20's nonce must be 12 bytes");
		return (0, compat_js_1._compat)("chacha20-poly1305", key, nonce, AAD);
	};
	exports.chacha20 = chacha20;
}));
//#endregion
export { require_node$1 as n, require_utils as r, require_node as t };
