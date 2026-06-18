import { a as __require, s as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { I as require_react } from "../dynamic-labs__iconic+react.mjs";
import { U as require_jsx_runtime } from "../@dynamic-labs/sdk-react-core+[...].mjs";
import { n as esm_default } from "../@dynamic-labs-connectors/metamask-solana+[...].mjs";
import { A as import_eventemitter3, _ as VersionedTransaction, c as init_borsh, d as PublicKey, f as SYSVAR_INSTRUCTIONS_PUBKEY, g as TransactionMessage, h as TransactionInstruction, j as init_eventemitter3, l as ComputeBudgetProgram, m as Transaction, n as Program, p as SystemProgram, r as init_program, s as BorshCoder, t as import_bn, u as Connection, v as init_index_esm } from "../@coral-xyz/anchor.mjs";
import { Buffer as Buffer$1 } from "buffer";
//#region ../../node_modules/.pnpm/zustand@5.0.14_@types+react@19.2.17_react@19.2.7_use-sync-external-store@1.6.0_react@19.2.7_/node_modules/zustand/esm/vanilla.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var createStoreImpl = (createState) => {
	let state;
	const listeners = /* @__PURE__ */ new Set();
	const setState = (partial, replace) => {
		const nextState = typeof partial === "function" ? partial(state) : partial;
		if (!Object.is(nextState, state)) {
			const previousState = state;
			state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
			listeners.forEach((listener) => listener(state, previousState));
		}
	};
	const getState = () => state;
	const getInitialState = () => initialState;
	const subscribe = (listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};
	const api = {
		setState,
		getState,
		getInitialState,
		subscribe
	};
	const initialState = state = createState(setState, getState, api);
	return api;
};
var createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);
//#endregion
//#region ../../node_modules/.pnpm/zustand@5.0.14_@types+react@19.2.17_react@19.2.7_use-sync-external-store@1.6.0_react@19.2.7_/node_modules/zustand/esm/react.mjs
var identity = (arg) => arg;
function useStore(api, selector = identity) {
	const slice = import_react.useSyncExternalStore(api.subscribe, import_react.useCallback(() => selector(api.getState()), [api, selector]), import_react.useCallback(() => selector(api.getInitialState()), [api, selector]));
	import_react.useDebugValue(slice);
	return slice;
}
var createImpl = (createState) => {
	const api = createStore(createState);
	const useBoundStore = (selector) => useStore(api, selector);
	Object.assign(useBoundStore, api);
	return useBoundStore;
};
var create = ((createState) => createState ? createImpl(createState) : createImpl);
//#endregion
//#region ../../node_modules/.pnpm/js-sha256@0.11.1/node_modules/js-sha256/src/sha256.js
var require_sha256 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* [js-sha256]{@link https://github.com/emn178/js-sha256}
	*
	* @version 0.11.1
	* @author Chen, Yi-Cyuan [emn178@gmail.com]
	* @copyright Chen, Yi-Cyuan 2014-2025
	* @license MIT
	*/
	(function() {
		"use strict";
		var ERROR = "input is invalid type";
		var WINDOW = typeof window === "object";
		var root = WINDOW ? window : {};
		if (root.JS_SHA256_NO_WINDOW) WINDOW = false;
		var WEB_WORKER = !WINDOW && typeof self === "object";
		var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node && process.type != "renderer";
		if (NODE_JS) root = global;
		else if (WEB_WORKER) root = self;
		var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === "object" && module.exports;
		var AMD = typeof define === "function" && define.amd;
		var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
		var HEX_CHARS = "0123456789abcdef".split("");
		var EXTRA = [
			-2147483648,
			8388608,
			32768,
			128
		];
		var SHIFT = [
			24,
			16,
			8,
			0
		];
		var K = [
			1116352408,
			1899447441,
			3049323471,
			3921009573,
			961987163,
			1508970993,
			2453635748,
			2870763221,
			3624381080,
			310598401,
			607225278,
			1426881987,
			1925078388,
			2162078206,
			2614888103,
			3248222580,
			3835390401,
			4022224774,
			264347078,
			604807628,
			770255983,
			1249150122,
			1555081692,
			1996064986,
			2554220882,
			2821834349,
			2952996808,
			3210313671,
			3336571891,
			3584528711,
			113926993,
			338241895,
			666307205,
			773529912,
			1294757372,
			1396182291,
			1695183700,
			1986661051,
			2177026350,
			2456956037,
			2730485921,
			2820302411,
			3259730800,
			3345764771,
			3516065817,
			3600352804,
			4094571909,
			275423344,
			430227734,
			506948616,
			659060556,
			883997877,
			958139571,
			1322822218,
			1537002063,
			1747873779,
			1955562222,
			2024104815,
			2227730452,
			2361852424,
			2428436474,
			2756734187,
			3204031479,
			3329325298
		];
		var OUTPUT_TYPES = [
			"hex",
			"array",
			"digest",
			"arrayBuffer"
		];
		var blocks = [];
		if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) Array.isArray = function(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		};
		if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) ArrayBuffer.isView = function(obj) {
			return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
		};
		var createOutputMethod = function(outputType, is224) {
			return function(message) {
				return new Sha256(is224, true).update(message)[outputType]();
			};
		};
		var createMethod = function(is224) {
			var method = createOutputMethod("hex", is224);
			if (NODE_JS) method = nodeWrap(method, is224);
			method.create = function() {
				return new Sha256(is224);
			};
			method.update = function(message) {
				return method.create().update(message);
			};
			for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
				var type = OUTPUT_TYPES[i];
				method[type] = createOutputMethod(type, is224);
			}
			return method;
		};
		var nodeWrap = function(method, is224) {
			var crypto = __require("crypto");
			var Buffer = __require("buffer").Buffer;
			var algorithm = is224 ? "sha224" : "sha256";
			var bufferFrom;
			if (Buffer.from && !root.JS_SHA256_NO_BUFFER_FROM) bufferFrom = Buffer.from;
			else bufferFrom = function(message) {
				return new Buffer(message);
			};
			var nodeMethod = function(message) {
				if (typeof message === "string") return crypto.createHash(algorithm).update(message, "utf8").digest("hex");
				else if (message === null || message === void 0) throw new Error(ERROR);
				else if (message.constructor === ArrayBuffer) message = new Uint8Array(message);
				if (Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer) return crypto.createHash(algorithm).update(bufferFrom(message)).digest("hex");
				else return method(message);
			};
			return nodeMethod;
		};
		var createHmacOutputMethod = function(outputType, is224) {
			return function(key, message) {
				return new HmacSha256(key, is224, true).update(message)[outputType]();
			};
		};
		var createHmacMethod = function(is224) {
			var method = createHmacOutputMethod("hex", is224);
			method.create = function(key) {
				return new HmacSha256(key, is224);
			};
			method.update = function(key, message) {
				return method.create(key).update(message);
			};
			for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
				var type = OUTPUT_TYPES[i];
				method[type] = createHmacOutputMethod(type, is224);
			}
			return method;
		};
		function Sha256(is224, sharedMemory) {
			if (sharedMemory) {
				blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
				this.blocks = blocks;
			} else this.blocks = [
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			if (is224) {
				this.h0 = 3238371032;
				this.h1 = 914150663;
				this.h2 = 812702999;
				this.h3 = 4144912697;
				this.h4 = 4290775857;
				this.h5 = 1750603025;
				this.h6 = 1694076839;
				this.h7 = 3204075428;
			} else {
				this.h0 = 1779033703;
				this.h1 = 3144134277;
				this.h2 = 1013904242;
				this.h3 = 2773480762;
				this.h4 = 1359893119;
				this.h5 = 2600822924;
				this.h6 = 528734635;
				this.h7 = 1541459225;
			}
			this.block = this.start = this.bytes = this.hBytes = 0;
			this.finalized = this.hashed = false;
			this.first = true;
			this.is224 = is224;
		}
		Sha256.prototype.update = function(message) {
			if (this.finalized) return;
			var notString, type = typeof message;
			if (type !== "string") {
				if (type === "object") {
					if (message === null) throw new Error(ERROR);
					else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) message = new Uint8Array(message);
					else if (!Array.isArray(message)) {
						if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) throw new Error(ERROR);
					}
				} else throw new Error(ERROR);
				notString = true;
			}
			var code, index = 0, i, length = message.length, blocks = this.blocks;
			while (index < length) {
				if (this.hashed) {
					this.hashed = false;
					blocks[0] = this.block;
					this.block = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
				}
				if (notString) for (i = this.start; index < length && i < 64; ++index) blocks[i >>> 2] |= message[index] << SHIFT[i++ & 3];
				else for (i = this.start; index < length && i < 64; ++index) {
					code = message.charCodeAt(index);
					if (code < 128) blocks[i >>> 2] |= code << SHIFT[i++ & 3];
					else if (code < 2048) {
						blocks[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					} else if (code < 55296 || code >= 57344) {
						blocks[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					} else {
						code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
						blocks[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
						blocks[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					}
				}
				this.lastByteIndex = i;
				this.bytes += i - this.start;
				if (i >= 64) {
					this.block = blocks[16];
					this.start = i - 64;
					this.hash();
					this.hashed = true;
				} else this.start = i;
			}
			if (this.bytes > 4294967295) {
				this.hBytes += this.bytes / 4294967296 << 0;
				this.bytes = this.bytes % 4294967296;
			}
			return this;
		};
		Sha256.prototype.finalize = function() {
			if (this.finalized) return;
			this.finalized = true;
			var blocks = this.blocks, i = this.lastByteIndex;
			blocks[16] = this.block;
			blocks[i >>> 2] |= EXTRA[i & 3];
			this.block = blocks[16];
			if (i >= 56) {
				if (!this.hashed) this.hash();
				blocks[0] = this.block;
				blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
			}
			blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
			blocks[15] = this.bytes << 3;
			this.hash();
		};
		Sha256.prototype.hash = function() {
			var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
			for (j = 16; j < 64; ++j) {
				t1 = blocks[j - 15];
				s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
				t1 = blocks[j - 2];
				s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
				blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
			}
			bc = b & c;
			for (j = 0; j < 64; j += 4) {
				if (this.first) {
					if (this.is224) {
						ab = 300032;
						t1 = blocks[0] - 1413257819;
						h = t1 - 150054599 << 0;
						d = t1 + 24177077 << 0;
					} else {
						ab = 704751109;
						t1 = blocks[0] - 210244248;
						h = t1 - 1521486534 << 0;
						d = t1 + 143694565 << 0;
					}
					this.first = false;
				} else {
					s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
					s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
					ab = a & b;
					maj = ab ^ a & c ^ bc;
					ch = e & f ^ ~e & g;
					t1 = h + s1 + ch + K[j] + blocks[j];
					t2 = s0 + maj;
					h = d + t1 << 0;
					d = t1 + t2 << 0;
				}
				s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
				s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
				da = d & a;
				maj = da ^ d & b ^ ab;
				ch = h & e ^ ~h & f;
				t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
				t2 = s0 + maj;
				g = c + t1 << 0;
				c = t1 + t2 << 0;
				s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
				s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
				cd = c & d;
				maj = cd ^ c & a ^ da;
				ch = g & h ^ ~g & e;
				t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
				t2 = s0 + maj;
				f = b + t1 << 0;
				b = t1 + t2 << 0;
				s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
				s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
				bc = b & c;
				maj = bc ^ b & d ^ cd;
				ch = f & g ^ ~f & h;
				t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
				t2 = s0 + maj;
				e = a + t1 << 0;
				a = t1 + t2 << 0;
				this.chromeBugWorkAround = true;
			}
			this.h0 = this.h0 + a << 0;
			this.h1 = this.h1 + b << 0;
			this.h2 = this.h2 + c << 0;
			this.h3 = this.h3 + d << 0;
			this.h4 = this.h4 + e << 0;
			this.h5 = this.h5 + f << 0;
			this.h6 = this.h6 + g << 0;
			this.h7 = this.h7 + h << 0;
		};
		Sha256.prototype.hex = function() {
			this.finalize();
			var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
			var hex = HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >>> 28 & 15] + HEX_CHARS[h4 >>> 24 & 15] + HEX_CHARS[h4 >>> 20 & 15] + HEX_CHARS[h4 >>> 16 & 15] + HEX_CHARS[h4 >>> 12 & 15] + HEX_CHARS[h4 >>> 8 & 15] + HEX_CHARS[h4 >>> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >>> 28 & 15] + HEX_CHARS[h5 >>> 24 & 15] + HEX_CHARS[h5 >>> 20 & 15] + HEX_CHARS[h5 >>> 16 & 15] + HEX_CHARS[h5 >>> 12 & 15] + HEX_CHARS[h5 >>> 8 & 15] + HEX_CHARS[h5 >>> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >>> 28 & 15] + HEX_CHARS[h6 >>> 24 & 15] + HEX_CHARS[h6 >>> 20 & 15] + HEX_CHARS[h6 >>> 16 & 15] + HEX_CHARS[h6 >>> 12 & 15] + HEX_CHARS[h6 >>> 8 & 15] + HEX_CHARS[h6 >>> 4 & 15] + HEX_CHARS[h6 & 15];
			if (!this.is224) hex += HEX_CHARS[h7 >>> 28 & 15] + HEX_CHARS[h7 >>> 24 & 15] + HEX_CHARS[h7 >>> 20 & 15] + HEX_CHARS[h7 >>> 16 & 15] + HEX_CHARS[h7 >>> 12 & 15] + HEX_CHARS[h7 >>> 8 & 15] + HEX_CHARS[h7 >>> 4 & 15] + HEX_CHARS[h7 & 15];
			return hex;
		};
		Sha256.prototype.toString = Sha256.prototype.hex;
		Sha256.prototype.digest = function() {
			this.finalize();
			var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
			var arr = [
				h0 >>> 24 & 255,
				h0 >>> 16 & 255,
				h0 >>> 8 & 255,
				h0 & 255,
				h1 >>> 24 & 255,
				h1 >>> 16 & 255,
				h1 >>> 8 & 255,
				h1 & 255,
				h2 >>> 24 & 255,
				h2 >>> 16 & 255,
				h2 >>> 8 & 255,
				h2 & 255,
				h3 >>> 24 & 255,
				h3 >>> 16 & 255,
				h3 >>> 8 & 255,
				h3 & 255,
				h4 >>> 24 & 255,
				h4 >>> 16 & 255,
				h4 >>> 8 & 255,
				h4 & 255,
				h5 >>> 24 & 255,
				h5 >>> 16 & 255,
				h5 >>> 8 & 255,
				h5 & 255,
				h6 >>> 24 & 255,
				h6 >>> 16 & 255,
				h6 >>> 8 & 255,
				h6 & 255
			];
			if (!this.is224) arr.push(h7 >>> 24 & 255, h7 >>> 16 & 255, h7 >>> 8 & 255, h7 & 255);
			return arr;
		};
		Sha256.prototype.array = Sha256.prototype.digest;
		Sha256.prototype.arrayBuffer = function() {
			this.finalize();
			var buffer = /* @__PURE__ */ new ArrayBuffer(this.is224 ? 28 : 32);
			var dataView = new DataView(buffer);
			dataView.setUint32(0, this.h0);
			dataView.setUint32(4, this.h1);
			dataView.setUint32(8, this.h2);
			dataView.setUint32(12, this.h3);
			dataView.setUint32(16, this.h4);
			dataView.setUint32(20, this.h5);
			dataView.setUint32(24, this.h6);
			if (!this.is224) dataView.setUint32(28, this.h7);
			return buffer;
		};
		function HmacSha256(key, is224, sharedMemory) {
			var i, type = typeof key;
			if (type === "string") {
				var bytes = [], length = key.length, index = 0, code;
				for (i = 0; i < length; ++i) {
					code = key.charCodeAt(i);
					if (code < 128) bytes[index++] = code;
					else if (code < 2048) {
						bytes[index++] = 192 | code >>> 6;
						bytes[index++] = 128 | code & 63;
					} else if (code < 55296 || code >= 57344) {
						bytes[index++] = 224 | code >>> 12;
						bytes[index++] = 128 | code >>> 6 & 63;
						bytes[index++] = 128 | code & 63;
					} else {
						code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
						bytes[index++] = 240 | code >>> 18;
						bytes[index++] = 128 | code >>> 12 & 63;
						bytes[index++] = 128 | code >>> 6 & 63;
						bytes[index++] = 128 | code & 63;
					}
				}
				key = bytes;
			} else if (type === "object") {
				if (key === null) throw new Error(ERROR);
				else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) key = new Uint8Array(key);
				else if (!Array.isArray(key)) {
					if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) throw new Error(ERROR);
				}
			} else throw new Error(ERROR);
			if (key.length > 64) key = new Sha256(is224, true).update(key).array();
			var oKeyPad = [], iKeyPad = [];
			for (i = 0; i < 64; ++i) {
				var b = key[i] || 0;
				oKeyPad[i] = 92 ^ b;
				iKeyPad[i] = 54 ^ b;
			}
			Sha256.call(this, is224, sharedMemory);
			this.update(iKeyPad);
			this.oKeyPad = oKeyPad;
			this.inner = true;
			this.sharedMemory = sharedMemory;
		}
		HmacSha256.prototype = new Sha256();
		HmacSha256.prototype.finalize = function() {
			Sha256.prototype.finalize.call(this);
			if (this.inner) {
				this.inner = false;
				var innerHash = this.array();
				Sha256.call(this, this.is224, this.sharedMemory);
				this.update(this.oKeyPad);
				this.update(innerHash);
				Sha256.prototype.finalize.call(this);
			}
		};
		var exports$1 = createMethod();
		exports$1.sha256 = exports$1;
		exports$1.sha224 = createMethod(true);
		exports$1.sha256.hmac = createHmacMethod();
		exports$1.sha224.hmac = createHmacMethod(true);
		if (COMMON_JS) module.exports = exports$1;
		else {
			root.sha256 = exports$1.sha256;
			root.sha224 = exports$1.sha224;
			if (AMD) define(function() {
				return exports$1;
			});
		}
	})();
}));
//#endregion
//#region ../../node_modules/.pnpm/@lazorkit+wallet@2.0.1_cdc94fcdb255c76b6f89bba8f6b8526d/node_modules/@lazorkit/wallet/dist/index.mjs
var import_jsx_runtime = require_jsx_runtime();
init_index_esm();
init_context(), init_error(), init_methods(), init_provider(), init_account(), init_event(), init_common(), init_accounts(), init_borsh(), init_instruction(), init_system(), init_program(), init_event();
var import_sha256 = require_sha256();
init_eventemitter3();
function v(t, e) {
	let a;
	try {
		a = t();
	} catch (t) {
		return;
	}
	return {
		getItem: (t) => {
			var e;
			const n = (t) => null === t ? null : JSON.parse(t, void 0), r = null != (e = a.getItem(t)) ? e : null;
			return r instanceof Promise ? r.then(n) : n(r);
		},
		setItem: (t, e) => a.setItem(t, JSON.stringify(e, void 0)),
		removeItem: (t) => a.removeItem(t)
	};
}
var D = (t) => (e) => {
	try {
		const a = t(e);
		return a instanceof Promise ? a : {
			then: (t) => D(t)(a),
			catch(t) {
				return this;
			}
		};
	} catch (t) {
		return {
			then(t) {
				return this;
			},
			catch: (e) => D(e)(t)
		};
	}
}, C = (t, e) => (a, n, r) => {
	let i = {
		storage: v(() => localStorage),
		partialize: (t) => t,
		version: 0,
		merge: (t, e) => ({
			...e,
			...t
		}),
		...e
	}, s = !1;
	const o = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
	let c = i.storage;
	if (!c) return t((...t) => {
		console.warn(`[zustand persist middleware] Unable to update item '${i.name}', the given storage is currently unavailable.`), a(...t);
	}, n, r);
	const d = () => {
		const t = i.partialize({ ...n() });
		return c.setItem(i.name, {
			state: t,
			version: i.version
		});
	}, A = r.setState;
	r.setState = (t, e) => (A(t, e), d());
	const u = t((...t) => (a(...t), d()), n, r);
	let p;
	r.getInitialState = () => u;
	const g = () => {
		var t, e;
		if (!c) return;
		s = !1, o.forEach((t) => {
			var e;
			return t(null != (e = n()) ? e : u);
		});
		const r = (null == (e = i.onRehydrateStorage) ? void 0 : e.call(i, null != (t = n()) ? t : u)) || void 0;
		return D(c.getItem.bind(c))(i.name).then((t) => {
			if (t) {
				if ("number" != typeof t.version || t.version === i.version) return [!1, t.state];
				if (i.migrate) {
					const e = i.migrate(t.state, t.version);
					return e instanceof Promise ? e.then((t) => [!0, t]) : [!0, e];
				}
				console.error("State loaded from storage couldn't be migrated since no migrate function was provided");
			}
			return [!1, void 0];
		}).then((t) => {
			var e;
			const [r, s] = t;
			if (p = i.merge(s, null != (e = n()) ? e : u), a(p, !0), r) return d();
		}).then(() => {
			r?.(p, void 0), p = n(), s = !0, l.forEach((t) => t(p));
		}).catch((t) => {
			r?.(void 0, t);
		});
	};
	return r.persist = {
		setOptions: (t) => {
			i = {
				...i,
				...t
			}, t.storage && (c = t.storage);
		},
		clearStorage: () => {
			c?.removeItem(i.name);
		},
		getOptions: () => i,
		rehydrate: () => g(),
		hasHydrated: () => s,
		onHydrate: (t) => (o.add(t), () => {
			o.delete(t);
		}),
		onFinishHydration: (t) => (l.add(t), () => {
			l.delete(t);
		})
	}, i.skipHydration || g(), p || u;
}, P = {
	PORTAL_URL: "https://portal.lazor.sh",
	PAYMASTER_URL: "https://lazorkit-paymaster.onrender.com",
	RPC_ENDPOINT: "https://api.devnet.solana.com"
}, W = {
	CONNECT: "connect",
	SIGN: "sign"
}, E = "confirmed", B = {
	WALLET: "lazorkit-wallet",
	CREDENTIALS: "lazorkit-credentials",
	PUBLIC_KEY: "PUBLIC_KEY",
	CREDENTIAL_ID: "CREDENTIAL_ID",
	SMART_WALLET_ADDRESS: "SMART_WALLET_ADDRESS"
}, x = {
	getItem: async (t) => {
		try {
			if ("undefined" == typeof window) return null;
			return localStorage.getItem(t);
		} catch (e) {
			return console.error("Error reading from localStorage:", e, { key: t }), null;
		}
	},
	setItem: async (t, e) => {
		try {
			if ("undefined" == typeof window) return;
			localStorage.setItem(t, e);
		} catch (a) {
			console.error("Error writing to localStorage:", a, {
				key: t,
				valueLength: e.length
			});
		}
	},
	removeItem: async (t) => {
		try {
			if ("undefined" == typeof window) return;
			localStorage.removeItem(t);
		} catch (e) {
			console.error("Error removing from localStorage:", e, { key: t });
		}
	}
};
var U = class {
	static async saveWallet(t) {
		try {
			await x.setItem(B.WALLET, JSON.stringify(t)), await x.setItem(B.CREDENTIAL_ID, t.credentialId), await x.setItem(B.SMART_WALLET_ADDRESS, t.smartWallet), await x.setItem(B.PUBLIC_KEY, Buffer$1.from(t.passkeyPubkey).toString("base64"));
		} catch (t) {
			throw console.error("Failed to save wallet to storage:", t), t;
		}
	}
	static async getWallet() {
		try {
			const t = await x.getItem(B.WALLET);
			return t ? JSON.parse(t) : null;
		} catch (t) {
			return console.error("Failed to get wallet from storage:", t), null;
		}
	}
	static async saveConfig(t) {
		try {
			await x.setItem("lazorkit-config", JSON.stringify(t));
		} catch (t) {
			throw console.error("Failed to save config to storage:", t), t;
		}
	}
	static async getConfig() {
		try {
			const t = await x.getItem("lazorkit-config");
			return t ? JSON.parse(t) : null;
		} catch (t) {
			return console.error("Failed to get config from storage:", t), null;
		}
	}
	static async clearWallet() {
		try {
			await x.removeItem(B.WALLET), await x.removeItem(B.CREDENTIAL_ID), await x.removeItem(B.SMART_WALLET_ADDRESS), await x.removeItem(B.PUBLIC_KEY), await x.removeItem("CREDENTIALS_TIMESTAMP");
		} catch (t) {
			throw console.error("Failed to clear wallet from storage:", t), t;
		}
	}
	static async getItem(t) {
		return await x.getItem(t);
	}
	static async setItem(t, e) {
		await x.setItem(t, e);
	}
	static async removeItem(t) {
		await x.removeItem(t);
	}
};
var R = class {
	constructor(t) {
		this.context = t, this.enabled = false;
	}
	debug(t, e) {
		this.enabled && console.debug(`[${this.context}] ${t}`, e);
	}
	info(t, e) {
		console.info(`[${this.context}] ${t}`, e);
	}
	warn(t, e) {
		console.warn(`[${this.context}] ${t}`, e);
	}
	error(t, e) {
		console.error(`[${this.context}] ${t}`, e);
	}
};
var T = class {
	constructor(t) {
		this.logger = new R("Paymaster"), this.endpoint = t.paymasterUrl, this.apiKey = t.apiKey;
	}
	getHeaders() {
		const t = { "Content-Type": "application/json" };
		return this.apiKey && (t["x-api-key"] = this.apiKey), t;
	}
	async getPayer() {
		try {
			const t = await fetch(`${this.endpoint}`, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify({
					jsonrpc: "2.0",
					id: 1,
					method: "getPayerSigner",
					params: []
				})
			});
			if (!t.ok) throw new Error(`Failed to get payer: ${t.statusText}`);
			return new PublicKey((await t.json()).result.signer_address);
		} catch (t) {
			throw this.logger.error("Failed to get payer", t), t;
		}
	}
	async getBlockhash() {
		try {
			const t = await fetch(`${this.endpoint}`, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify({
					jsonrpc: "2.0",
					method: "getBlockhash",
					id: 1,
					params: []
				})
			});
			if (!t.ok) throw new Error(`Failed to get blockhash: ${t.statusText}`);
			return (await t.json()).result.blockhash;
		} catch (t) {
			throw this.logger.error("Failed to get blockhash", t), t;
		}
	}
	async attemptSign(t, e = 1) {
		try {
			const e = t.serialize({
				verifySignatures: !1,
				requireAllSignatures: !1
			}), a = await fetch(`${this.endpoint}`, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify({
					jsonrpc: "2.0",
					method: "signTransaction",
					id: 1,
					params: [e.toString("base64")]
				})
			});
			if (!a.ok) throw new Error(`Failed to sign transaction: ${a.statusText}`);
			const n = await a.json();
			if (n.error) throw new Error(n.error.message || "Unknown paymaster error");
			return Transaction.from(Buffer$1.from(n.result.signed_transaction, "base64"));
		} catch (t) {
			throw this.logger.error(`Sign attempt ${e} failed:`, t), t;
		}
	}
	async sign(t, e = 3, a = 1e3) {
		for (let n = 1; n <= e; n++) try {
			return await this.attemptSign(t, n);
		} catch (t) {
			if (n === e) throw this.logger.error("All sign retry attempts failed", t), t;
			const r = a * Math.pow(2, n - 1);
			this.logger.info(`Retrying sign in ${r}ms (attempt ${n}/${e})`), await new Promise((t) => setTimeout(t, r));
		}
		throw new Error("Failed to sign transaction after all retries");
	}
	async attemptSignAndSend(t, e = 1) {
		try {
			const e = t.serialize({
				verifySignatures: !1,
				requireAllSignatures: !1
			}), a = await fetch(`${this.endpoint}`, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify({
					jsonrpc: "2.0",
					method: "signAndSendTransaction",
					id: 1,
					params: [e.toString("base64")]
				})
			});
			if (!a.ok) throw new Error(`Failed to sign and send transaction: ${a.statusText}`);
			const n = await a.json();
			if (n.error) throw new Error(n.error.message || "Unknown paymaster error");
			return n.result.signature;
		} catch (t) {
			throw this.logger.error(`Attempt ${e} failed:`, t), t;
		}
	}
	async signAndSend(t, e = 3, a = 1e3) {
		for (let n = 1; n <= e; n++) try {
			return await this.attemptSignAndSend(t, n);
		} catch (t) {
			if (n === e) throw this.logger.error("All retry attempts failed", t), t;
			const r = a * Math.pow(2, n - 1);
			this.logger.info(`Retrying in ${r}ms (attempt ${n}/${e})`), await new Promise((t) => setTimeout(t, r));
		}
		throw new Error("Failed to sign and send transaction after all retries");
	}
	async attemptSignAndSendVersionedTransaction(t, e = 1) {
		try {
			const e = await fetch(`${this.endpoint}`, {
				method: "POST",
				headers: this.getHeaders(),
				body: JSON.stringify({
					jsonrpc: "2.0",
					method: "signAndSendTransaction",
					id: 1,
					params: [Buffer$1.from(t.serialize()).toString("base64")]
				})
			});
			if (!e.ok) throw new Error(`Failed to sign and send transaction: ${e.statusText}`);
			const a = await e.json();
			if (a.error) throw new Error(a.error.message || "Unknown paymaster error");
			return a.result.signature;
		} catch (t) {
			throw this.logger.error(`Attempt ${e} failed:`, t), t;
		}
	}
	async signAndSendVersionedTransaction(t, e = 3, a = 1e3) {
		for (let n = 1; n <= e; n++) try {
			return await this.attemptSignAndSendVersionedTransaction(t, n);
		} catch (t) {
			if (n === e) throw this.logger.error("All retry attempts failed", t), t;
			const r = a * Math.pow(2, n - 1);
			this.logger.info(`Retrying in ${r}ms (attempt ${n}/${e})`), await new Promise((t) => setTimeout(t, r));
		}
		throw new Error("Failed to sign and send transaction after all retries");
	}
};
var M, H = {
	address: "Gsuz7YcA5sbMGVRXT3xSYhJBessW4xFC4xYsihNCqMFh",
	metadata: {
		name: "lazorkit",
		version: "0.1.0",
		spec: "0.1.0",
		description: "Created with Anchor"
	},
	docs: ["LazorKit: Smart Wallet with WebAuthn Passkey Authentication"],
	instructions: [
		{
			name: "create_chunk",
			discriminator: [
				83,
				226,
				15,
				219,
				9,
				19,
				186,
				90
			],
			accounts: [
				{
					name: "payer",
					writable: !0,
					signer: !0
				},
				{
					name: "smart_wallet",
					writable: !0,
					pda: { seeds: [{
						kind: "const",
						value: [
							115,
							109,
							97,
							114,
							116,
							95,
							119,
							97,
							108,
							108,
							101,
							116
						]
					}, {
						kind: "account",
						path: "wallet_state.wallet_id",
						account: "WalletState"
					}] }
				},
				{
					name: "wallet_state",
					pda: { seeds: [{
						kind: "const",
						value: [
							119,
							97,
							108,
							108,
							101,
							116,
							95,
							115,
							116,
							97,
							116,
							101
						]
					}, {
						kind: "account",
						path: "smart_wallet"
					}] }
				},
				{ name: "wallet_device" },
				{ name: "policy_program" },
				{
					name: "chunk",
					writable: !0,
					pda: { seeds: [
						{
							kind: "const",
							value: [
								99,
								104,
								117,
								110,
								107
							]
						},
						{
							kind: "account",
							path: "smart_wallet"
						},
						{
							kind: "account",
							path: "wallet_state.last_nonce",
							account: "WalletState"
						}
					] }
				},
				{
					name: "ix_sysvar",
					address: "Sysvar1nstructions1111111111111111111111111"
				},
				{
					name: "system_program",
					address: "11111111111111111111111111111111"
				}
			],
			args: [{
				name: "args",
				type: { defined: { name: "CreateChunkArgs" } }
			}]
		},
		{
			name: "create_smart_wallet",
			discriminator: [
				129,
				39,
				235,
				18,
				132,
				68,
				203,
				19
			],
			accounts: [
				{
					name: "payer",
					writable: !0,
					signer: !0
				},
				{
					name: "smart_wallet",
					writable: !0,
					pda: { seeds: [{
						kind: "const",
						value: [
							115,
							109,
							97,
							114,
							116,
							95,
							119,
							97,
							108,
							108,
							101,
							116
						]
					}, {
						kind: "arg",
						path: "args.wallet_id"
					}] }
				},
				{
					name: "wallet_state",
					writable: !0,
					pda: { seeds: [{
						kind: "const",
						value: [
							119,
							97,
							108,
							108,
							101,
							116,
							95,
							115,
							116,
							97,
							116,
							101
						]
					}, {
						kind: "account",
						path: "smart_wallet"
					}] }
				},
				{
					name: "wallet_device",
					writable: !0
				},
				{ name: "policy_program" },
				{
					name: "system_program",
					address: "11111111111111111111111111111111"
				}
			],
			args: [{
				name: "args",
				type: { defined: { name: "CreateSmartWalletArgs" } }
			}]
		},
		{
			name: "execute",
			discriminator: [
				130,
				221,
				242,
				154,
				13,
				193,
				189,
				29
			],
			accounts: [
				{
					name: "payer",
					writable: !0,
					signer: !0
				},
				{
					name: "smart_wallet",
					writable: !0,
					pda: { seeds: [{
						kind: "const",
						value: [
							115,
							109,
							97,
							114,
							116,
							95,
							119,
							97,
							108,
							108,
							101,
							116
						]
					}, {
						kind: "account",
						path: "wallet_state.wallet_id",
						account: "WalletState"
					}] }
				},
				{
					name: "wallet_state",
					writable: !0,
					pda: { seeds: [{
						kind: "const",
						value: [
							119,
							97,
							108,
							108,
							101,
							116,
							95,
							115,
							116,
							97,
							116,
							101
						]
					}, {
						kind: "account",
						path: "smart_wallet"
					}] }
				},
				{ name: "wallet_device" },
				{ name: "policy_program" },
				{ name: "cpi_program" },
				{
					name: "ix_sysvar",
					address: "Sysvar1nstructions1111111111111111111111111"
				},
				{
					name: "system_program",
					address: "11111111111111111111111111111111"
				}
			],
			args: [{
				name: "args",
				type: { defined: { name: "ExecuteArgs" } }
			}]
		},
		{
			name: "execute_chunk",
			discriminator: [
				106,
				83,
				113,
				47,
				89,
				243,
				39,
				220
			],
			accounts: [
				{
					name: "payer",
					writable: !0,
					signer: !0
				},
				{
					name: "smart_wallet",
					writable: !0,
					pda: { seeds: [{
						kind: "const",
						value: [
							115,
							109,
							97,
							114,
							116,
							95,
							119,
							97,
							108,
							108,
							101,
							116
						]
					}, {
						kind: "account",
						path: "wallet_state.wallet_id",
						account: "WalletState"
					}] }
				},
				{
					name: "wallet_state",
					writable: !0,
					pda: { seeds: [{
						kind: "const",
						value: [
							119,
							97,
							108,
							108,
							101,
							116,
							95,
							115,
							116,
							97,
							116,
							101
						]
					}, {
						kind: "account",
						path: "smart_wallet"
					}] }
				},
				{
					name: "chunk",
					writable: !0,
					pda: { seeds: [
						{
							kind: "const",
							value: [
								99,
								104,
								117,
								110,
								107
							]
						},
						{
							kind: "account",
							path: "smart_wallet"
						},
						{
							kind: "account",
							path: "chunk.authorized_nonce",
							account: "Chunk"
						}
					] }
				},
				{
					name: "session_refund",
					writable: !0
				},
				{
					name: "system_program",
					address: "11111111111111111111111111111111"
				}
			],
			args: [{
				name: "instruction_data_list",
				type: { vec: "bytes" }
			}, {
				name: "split_index",
				type: "bytes"
			}]
		}
	],
	accounts: [
		{
			name: "Chunk",
			discriminator: [
				134,
				67,
				80,
				65,
				135,
				143,
				156,
				196
			]
		},
		{
			name: "WalletDevice",
			discriminator: [
				35,
				85,
				31,
				31,
				179,
				48,
				136,
				123
			]
		},
		{
			name: "WalletState",
			discriminator: [
				126,
				186,
				0,
				158,
				92,
				223,
				167,
				68
			]
		}
	],
	errors: [
		{
			code: 6e3,
			name: "PasskeyMismatch",
			msg: "Passkey public key mismatch with stored authenticator"
		},
		{
			code: 6001,
			name: "InvalidPolicyDataSize",
			msg: "Invalid policy data size"
		},
		{
			code: 6002,
			name: "Secp256r1InvalidLength",
			msg: "Secp256r1 instruction has invalid data length"
		},
		{
			code: 6003,
			name: "Secp256r1HeaderMismatch",
			msg: "Secp256r1 instruction header validation failed"
		},
		{
			code: 6004,
			name: "Secp256r1DataMismatch",
			msg: "Secp256r1 signature data validation failed"
		},
		{
			code: 6005,
			name: "InvalidSignature",
			msg: "Invalid signature provided for passkey verification"
		},
		{
			code: 6006,
			name: "ClientDataInvalidUtf8",
			msg: "Client data JSON is not valid UTF-8"
		},
		{
			code: 6007,
			name: "ClientDataJsonParseError",
			msg: "Client data JSON parsing failed"
		},
		{
			code: 6008,
			name: "ChallengeMissing",
			msg: "Challenge field missing from client data JSON"
		},
		{
			code: 6009,
			name: "ChallengeBase64DecodeError",
			msg: "Challenge base64 decoding failed"
		},
		{
			code: 6010,
			name: "ChallengeDeserializationError",
			msg: "Challenge message deserialization failed"
		},
		{
			code: 6011,
			name: "HashMismatch",
			msg: "Message hash mismatch: expected different value"
		},
		{
			code: 6012,
			name: "InvalidInstructionDiscriminator",
			msg: "Invalid instruction discriminator"
		},
		{
			code: 6013,
			name: "InsufficientCpiAccounts",
			msg: "Insufficient remaining accounts for CPI instruction"
		},
		{
			code: 6014,
			name: "AccountSliceOutOfBounds",
			msg: "Account slice index out of bounds"
		},
		{
			code: 6015,
			name: "InvalidAccountOwner",
			msg: "Account owner verification failed"
		},
		{
			code: 6016,
			name: "ProgramNotExecutable",
			msg: "Program not executable"
		},
		{
			code: 6017,
			name: "CredentialIdEmpty",
			msg: "Credential ID cannot be empty"
		},
		{
			code: 6018,
			name: "PolicyDataTooLarge",
			msg: "Policy data exceeds maximum allowed size"
		},
		{
			code: 6019,
			name: "TransactionTooOld",
			msg: "Transaction is too old"
		},
		{
			code: 6020,
			name: "InvalidInstructionData",
			msg: "Invalid instruction data"
		},
		{
			code: 6021,
			name: "InvalidInstruction",
			msg: "Invalid instruction"
		},
		{
			code: 6022,
			name: "InsufficientBalanceForFee",
			msg: "Insufficient balance for fee"
		},
		{
			code: 6023,
			name: "InvalidSequenceNumber",
			msg: "Invalid sequence number"
		},
		{
			code: 6024,
			name: "InvalidPasskeyFormat",
			msg: "Invalid passkey format"
		},
		{
			code: 6025,
			name: "ReentrancyDetected",
			msg: "Reentrancy detected"
		},
		{
			code: 6026,
			name: "UnauthorizedAdmin",
			msg: "Unauthorized admin"
		}
	],
	types: [
		{
			name: "Chunk",
			docs: [
				"Transaction chunk for deferred execution",
				"",
				"Created after full passkey and policy verification. Contains all bindings",
				"necessary to execute the transaction later without re-verification.",
				"Used for large transactions that need to be split into manageable chunks."
			],
			type: {
				kind: "struct",
				fields: [
					{
						name: "owner_wallet_address",
						docs: ["Smart wallet address that authorized this chunk session"],
						type: "pubkey"
					},
					{
						name: "cpi_hash",
						docs: ["Combined SHA256 hash of all cpi transaction instruction data"],
						type: { array: ["u8", 32] }
					},
					{
						name: "authorized_nonce",
						docs: ["The nonce that was authorized at chunk creation (bound into data hash)"],
						type: "u64"
					},
					{
						name: "authorized_timestamp",
						docs: ["Timestamp from the original message hash for expiration validation"],
						type: "i64"
					},
					{
						name: "rent_refund_address",
						docs: ["Address to receive rent refund when closing the chunk session"],
						type: "pubkey"
					}
				]
			}
		},
		{
			name: "CreateChunkArgs",
			type: {
				kind: "struct",
				fields: [
					{
						name: "passkey_public_key",
						type: { array: ["u8", 33] }
					},
					{
						name: "signature",
						type: { array: ["u8", 64] }
					},
					{
						name: "client_data_json_raw",
						type: "bytes"
					},
					{
						name: "authenticator_data_raw",
						type: "bytes"
					},
					{
						name: "verify_instruction_index",
						type: "u8"
					},
					{
						name: "policy_data",
						type: "bytes"
					},
					{
						name: "timestamp",
						type: "i64"
					},
					{
						name: "cpi_hash",
						type: { array: ["u8", 32] }
					}
				]
			}
		},
		{
			name: "CreateSmartWalletArgs",
			type: {
				kind: "struct",
				fields: [
					{
						name: "passkey_public_key",
						type: { array: ["u8", 33] }
					},
					{
						name: "credential_hash",
						type: { array: ["u8", 32] }
					},
					{
						name: "init_policy_data",
						type: "bytes"
					},
					{
						name: "wallet_id",
						type: "u64"
					},
					{
						name: "amount",
						type: "u64"
					},
					{
						name: "policy_data_size",
						type: "u16"
					}
				]
			}
		},
		{
			name: "ExecuteArgs",
			type: {
				kind: "struct",
				fields: [
					{
						name: "passkey_public_key",
						type: { array: ["u8", 33] }
					},
					{
						name: "signature",
						type: { array: ["u8", 64] }
					},
					{
						name: "client_data_json_raw",
						type: "bytes"
					},
					{
						name: "authenticator_data_raw",
						type: "bytes"
					},
					{
						name: "verify_instruction_index",
						type: "u8"
					},
					{
						name: "split_index",
						type: "u16"
					},
					{
						name: "policy_data",
						type: "bytes"
					},
					{
						name: "cpi_data",
						type: "bytes"
					},
					{
						name: "timestamp",
						type: "i64"
					}
				]
			}
		},
		{
			name: "WalletDevice",
			docs: ["Wallet device account linking a passkey to a smart wallet"],
			type: {
				kind: "struct",
				fields: [
					{
						name: "passkey_pubkey",
						docs: ["Secp256r1 compressed public key (33 bytes)"],
						type: { array: ["u8", 33] }
					},
					{
						name: "credential_hash",
						docs: ["SHA256 hash of the credential ID"],
						type: { array: ["u8", 32] }
					},
					{
						name: "smart_wallet",
						docs: ["Associated smart wallet address"],
						type: "pubkey"
					},
					{
						name: "bump",
						docs: ["PDA bump seed"],
						type: "u8"
					}
				]
			}
		},
		{
			name: "WalletState",
			docs: ["Wallet state account storing wallet configuration and execution state"],
			type: {
				kind: "struct",
				fields: [
					{
						name: "bump",
						docs: ["PDA bump seed for smart wallet"],
						type: "u8"
					},
					{
						name: "wallet_id",
						docs: ["Unique wallet identifier"],
						type: "u64"
					},
					{
						name: "last_nonce",
						docs: ["Last used nonce for anti-replay protection"],
						type: "u64"
					},
					{
						name: "policy_program",
						docs: ["Policy program that validates transactions"],
						type: "pubkey"
					},
					{
						name: "policy_data",
						docs: ["Serialized policy data returned from policy initialization"],
						type: "bytes"
					}
				]
			}
		}
	]
};
function Q(t, e) {
	return t.keys.map((t) => ({
		pubkey: t.pubkey,
		isWritable: t.isWritable,
		isSigner: !!e && e.some((e) => e.toString() === t.pubkey.toString())
	}));
}
function K(t) {
	if ("function" == typeof globalThis.crypto?.getRandomValues) {
		const e = new Uint8Array(t);
		return globalThis.crypto.getRandomValues(e), e;
	}
	try {
		const { randomBytes: e } = __require("crypto");
		return e(t);
	} catch {
		throw new Error("No CSPRNG available");
	}
}
function O(t) {
	const e = Buffer$1.from(t, "base64");
	return Array.from(new Uint8Array(import_sha256.sha256.arrayBuffer(e)));
}
async function z(t) {
	const e = await t.getSlot(), a = await t.getBlockTime(e);
	if (null === a) throw new Error("Failed to get blockchain timestamp");
	return new import_bn.default(a);
}
async function V(t, e, a) {
	let n = 0;
	for (; n < 3;) {
		try {
			const n = await e.getWalletStateData(a), r = e.getChunkPubkey(a, n.lastNonce);
			if (await t.getAccountInfo(r)) return;
		} catch (t) {
			console.warn(`Attempt ${n + 1} failed to find chunk:`, t);
		}
		n++, n < 3 && await new Promise((t) => setTimeout(t, 3e3));
	}
	throw new Error("Chunk not found");
}
(function(t) {
	t.CreateChunk = "create_chunk", t.ExecuteChunk = "execute_chunk";
})(M || (M = {}));
var J = {
	address: "BiE9vSdz9MidUiyjVYsu3PG4C1fbPZ8CVPADA9jRfXw7",
	metadata: {
		name: "default_policy",
		version: "0.1.0",
		spec: "0.1.0",
		description: "Created with Anchor"
	},
	instructions: [{
		name: "check_policy",
		discriminator: [
			28,
			88,
			170,
			179,
			239,
			136,
			25,
			35
		],
		accounts: [{
			name: "policy_signer",
			signer: !0
		}, { name: "smart_wallet" }],
		args: [
			{
				name: "wallet_id",
				type: "u64"
			},
			{
				name: "passkey_public_key",
				type: { array: ["u8", 33] }
			},
			{
				name: "credential_hash",
				type: { array: ["u8", 32] }
			},
			{
				name: "policy_data",
				type: "bytes"
			}
		]
	}, {
		name: "init_policy",
		discriminator: [
			45,
			234,
			110,
			100,
			209,
			146,
			191,
			86
		],
		accounts: [
			{
				name: "policy_signer",
				signer: !0
			},
			{
				name: "smart_wallet",
				writable: !0
			},
			{
				name: "wallet_state",
				writable: !0
			}
		],
		args: [
			{
				name: "wallet_id",
				type: "u64"
			},
			{
				name: "passkey_public_key",
				type: { array: ["u8", 33] }
			},
			{
				name: "credential_hash",
				type: { array: ["u8", 32] }
			}
		],
		returns: { defined: { name: "PolicyStruct" } }
	}],
	errors: [{
		code: 6e3,
		name: "InvalidPasskey",
		msg: "Invalid passkey format"
	}, {
		code: 6001,
		name: "Unauthorized",
		msg: "Unauthorized to access smart wallet"
	}],
	types: [{
		name: "DeviceSlot",
		type: {
			kind: "struct",
			fields: [{
				name: "passkey_pubkey",
				type: { array: ["u8", 33] }
			}, {
				name: "credential_hash",
				type: { array: ["u8", 32] }
			}]
		}
	}, {
		name: "PolicyStruct",
		type: {
			kind: "struct",
			fields: [
				{
					name: "bump",
					type: "u8"
				},
				{
					name: "smart_wallet",
					type: "pubkey"
				},
				{
					name: "device_slots",
					type: { vec: { defined: { name: "DeviceSlot" } } }
				}
			]
		}
	}]
};
var G = Buffer$1.from("policy");
var q = class extends Error {
	constructor(t, e) {
		super(t), this.field = e, this.name = "ValidationError";
	}
};
function $(t, e) {
	if (null == t || void 0 === t) throw new q(`${e} is required but was ${null === t ? "null" : "undefined"}`, e);
}
function tt(t, e) {
	$(t, e);
	try {
		if ("string" == typeof t) {
			if (0 === t.trim().length) throw new q(`${e} cannot be an empty string`, e);
			new PublicKey(t);
		} else if (!(t instanceof PublicKey || t && "object" == typeof t && "toBase58" in t && "function" == typeof t.toBase58 && "toBytes" in t && "function" == typeof t.toBytes)) throw new q(`${e} must be a PublicKey instance or valid base58 string`, e);
	} catch (t) {
		if (t instanceof q) throw t;
		throw new q(`${e} is not a valid PublicKey: ${t instanceof Error ? t.message : "Invalid format"}`, e);
	}
}
function et(t, e, a) {
	let n;
	if ($(t, a), Array.isArray(t)) n = t;
	else if (t instanceof Uint8Array) n = Array.from(t);
	else {
		if (!t || "object" != typeof t || "number" != typeof t.length) throw new q(`${a} must be an array or Uint8Array`, a);
		n = Array.from(t);
	}
	if (n.length !== e) throw new q(`${a} must be exactly ${e} bytes, got ${n.length}`, a);
	for (let t = 0; t < n.length; t++) {
		const e = n[t];
		if ("number" != typeof e || !Number.isFinite(e) || !Number.isInteger(e) || e < 0 || e > 255) throw new q(`${a}[${t}] must be a valid byte (0-255), got ${"number" == typeof e ? e : typeof e}`, a);
	}
}
function nt(t, e = "passkeyPublicKey") {
	et(t, 33, e);
}
function it(t, e = "credentialHash") {
	et(t, 32, e);
}
function ot(t, e = "signature") {
	et(t, 64, e);
}
function ct(t, e) {
	$(t, e);
	if (!(t instanceof import_bn.default || t && "object" == typeof t && "lt" in t && "function" == typeof t.lt && "toString" in t && "function" == typeof t.toString)) throw new q(`${e} must be a BN instance`, e);
	if (t.lt(new import_bn.default(0))) throw new q(`${e} must be non-negative, got ${t.toString()}`, e);
}
function At(t, e) {
	if ($(t, e), "string" != typeof t) throw new q(`${e} must be a string (got ${typeof t})`, e);
	if (0 === String(t).trim().length) throw new q(`${e} cannot be empty`, e);
}
function ut(t, e) {
	if ($(t, e), !Array.isArray(t)) throw new q(`${e} must be an array (got ${typeof t}${t && "object" == typeof t ? ` with constructor ${t.constructor?.name || "unknown"}` : ""})`, e);
	if (0 === t.length) throw new q(`${e} cannot be empty`, e);
}
function pt(t, e) {
	$(t, e);
	if (!(t instanceof TransactionInstruction || t && "object" == typeof t && "programId" in t && "keys" in t && Array.isArray(t.keys) && "data" in t)) throw new q(`${e} must be a TransactionInstruction instance`, e);
	if (tt(t.programId, `${e}.programId`), !t.keys || !Array.isArray(t.keys) || 0 === t.keys.length) throw new q(`${e} must have at least one account key`, e);
}
function gt(t) {
	return Array.isArray(t) ? t : Array.from(t);
}
function ht(t, e) {
	At(t, e);
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(t)) throw new q(`${e} is not a valid base64 string (invalid characters)`, e);
	try {
		"undefined" != typeof Buffer && Buffer.from ? Buffer.from(t, "base64") : "undefined" != typeof atob && atob(t);
	} catch (t) {
		throw new q(`${e} is not a valid base64 string: ${t instanceof Error ? t.message : "Invalid format"}`, e);
	}
}
function yt(t, e) {
	if ($(t, e), "number" != typeof t || !Number.isFinite(t) || Number.isNaN(t)) throw new q(`${e} must be a finite number (got ${Number.isNaN(t) ? "NaN" : Number.isFinite(t) ? typeof t : t === Infinity ? "Infinity" : "-Infinity"})`, e);
	if (!Number.isInteger(t)) throw new q(`${e} must be an integer, got ${t}`, e);
	if (t <= 0) throw new q(`${e} must be a positive integer, got ${t}`, e);
}
function ft(t, e) {
	if ($(t, e), !Array.isArray(t)) throw new q(`${e} must be an array (got ${typeof t})`, e);
	t.forEach((t, a) => {
		tt(t, `${e}[${a}]`);
	});
}
function wt(t, e) {
	ut(t, e), t.forEach((t, a) => {
		pt(t, `${e}[${a}]`);
	});
}
function bt(t) {
	return Array.isArray(t) ? [...t] : Array.from(t);
}
function St(t, e = "passkeySignature") {
	if ($(t, e), "object" != typeof t || null === t) throw new q(`${e} must be an object`, e);
	nt(t.passkeyPublicKey, `${e}.passkeyPublicKey`), ht(t.signature64, `${e}.signature64`), ht(t.clientDataJsonRaw64, `${e}.clientDataJsonRaw64`), ht(t.authenticatorDataRaw64, `${e}.authenticatorDataRaw64`);
}
var kt = class {
	constructor(t) {
		$(t, "connection"), this.connection = t, this.program = new Program(J, { connection: t }), this.programId = this.program.programId;
	}
	policyPda(t) {
		return tt(t, "smartWallet"), function(t, e) {
			return PublicKey.findProgramAddressSync([G, e.toBuffer()], t)[0];
		}(this.programId, t);
	}
	getPolicyDataSize() {
		return 102;
	}
	validateInitPolicyParams(t) {
		$(t, "params"), ct(t.walletId, "params.walletId"), nt(t.passkeyPublicKey, "params.passkeyPublicKey"), it(t.credentialHash, "params.credentialHash"), tt(t.policySigner, "params.policySigner"), tt(t.smartWallet, "params.smartWallet"), tt(t.walletState, "params.walletState");
	}
	async buildInitPolicyIx(t) {
		return this.validateInitPolicyParams(t), await this.program.methods.initPolicy(t.walletId, bt(t.passkeyPublicKey), bt(t.credentialHash)).accountsPartial({
			smartWallet: t.smartWallet,
			walletState: t.walletState,
			policySigner: t.policySigner
		}).instruction();
	}
	validateCheckPolicyParams(t) {
		if ($(t, "params"), ct(t.walletId, "params.walletId"), nt(t.passkeyPublicKey, "params.passkeyPublicKey"), tt(t.policySigner, "params.policySigner"), tt(t.smartWallet, "params.smartWallet"), it(t.credentialHash, "params.credentialHash"), $(t.policyData, "params.policyData"), !Buffer.isBuffer(t.policyData)) throw new q("params.policyData must be a Buffer instance", "params.policyData");
	}
	async buildCheckPolicyIx(t) {
		return this.validateCheckPolicyParams(t), await this.program.methods.checkPolicy(t.walletId, bt(t.passkeyPublicKey), bt(t.credentialHash), t.policyData).accountsPartial({
			smartWallet: t.smartWallet,
			policySigner: t.policySigner
		}).instruction();
	}
};
var It = Buffer$1.from("smart_wallet"), vt = Buffer$1.from("wallet_state"), Dt = Buffer$1.from("wallet_device"), Ct = Buffer$1.from("chunk");
function Pt(t, e) {
	return PublicKey.findProgramAddressSync([It, e.toArrayLike(Buffer$1, "le", 8)], t)[0];
}
function Wt(t, e) {
	return PublicKey.findProgramAddressSync([vt, e.toBuffer()], t)[0];
}
function Et(t, e) {
	const a = Buffer$1.concat([t.toBuffer(), Buffer$1.from(e)]), n = import_sha256.sha256.arrayBuffer(a);
	return Buffer$1.from(n).subarray(0, 32);
}
function Bt(t, e, a) {
	return PublicKey.findProgramAddressSync([Dt, Et(e, a)], t);
}
function xt(t, e, a) {
	return PublicKey.findProgramAddressSync([
		Ct,
		e.toBuffer(),
		a.toArrayLike(Buffer$1, "le", 8)
	], t)[0];
}
var Ut = class {
	constructor(t) {
		this.programId = t;
	}
	smartWallet(t) {
		return ct(t, "walletId"), Pt(this.programId, t);
	}
	walletState(t) {
		return tt(t, "smartWallet"), Wt(this.programId, t);
	}
	walletDevice(t, e) {
		return tt(t, "smartWallet"), it(e, "credentialHash"), Bt(this.programId, t, e)[0];
	}
	chunk(t, e) {
		return tt(t, "smartWallet"), xt(this.programId, t, e);
	}
};
var Rt = class {
	constructor(t, e) {
		this.policyClient = t, this.walletPdas = e;
	}
	async resolveForExecute({ provided: t, smartWallet: e, credentialHash: a, passkeyPublicKey: n, walletStateData: r }) {
		if (void 0 !== t) return t;
		const i = this.walletPdas.walletDevice(e, a);
		return this.policyClient.buildCheckPolicyIx({
			walletId: r.walletId,
			passkeyPublicKey: n,
			policySigner: i,
			smartWallet: e,
			credentialHash: a,
			policyData: r.policyData
		});
	}
	async resolveForCreate({ provided: t, smartWalletId: e, smartWallet: a, walletState: n, passkeyPublicKey: r, credentialHash: i }) {
		if (void 0 !== t) return t;
		const s = this.walletPdas.walletDevice(a, i);
		return this.policyClient.buildInitPolicyIx({
			walletId: e,
			passkeyPublicKey: r,
			credentialHash: i,
			policySigner: s,
			smartWallet: a,
			walletState: n
		});
	}
};
var Tt = null;
var Mt = (t) => new Uint8Array(import_sha256.sha256.arrayBuffer(t)), Ht = (t, e, a) => {
	const n = import_sha256.sha256.create();
	n.update(t.toBytes());
	for (const t of e) n.update(t.pubkey.toBytes()), n.update(Uint8Array.from([t.isSigner ? 1 : 0])), n.update(Uint8Array.from([t.pubkey.toString() === a.toString() || t.isWritable ? 1 : 0]));
	return new Uint8Array(n.arrayBuffer());
}, Qt = (t, e) => {
	const a = Q(t), n = Ht(t.programId, a, e);
	return {
		policyDataHash: Mt(t.data),
		policyAccountsHash: n
	};
}, Kt = (t, e, a) => {
	const n = Buffer$1.alloc(4);
	n.writeUInt32LE(t.length, 0);
	return {
		cpiDataHash: Mt(Buffer$1.concat([n, ...t.map((t) => {
			const e = Buffer$1.from(t.data), a = Buffer$1.alloc(4);
			return a.writeUInt32LE(e.length, 0), Buffer$1.concat([a, e]);
		})])),
		cpiAccountsHash: ((t, e) => {
			const a = /* @__PURE__ */ new Map();
			for (const e of t) {
				const t = e.pubkey.toString(), n = a.get(t);
				n ? (n.isSigner = n.isSigner || e.isSigner, n.isWritable = n.isWritable || e.isWritable) : a.set(t, {
					isSigner: e.isSigner,
					isWritable: e.isWritable
				});
			}
			const n = t.map((t) => {
				const e = t.pubkey.toString(), n = a.get(e);
				return {
					pubkey: t.pubkey,
					isSigner: n.isSigner,
					isWritable: n.isWritable
				};
			}), r = import_sha256.sha256.create();
			for (const t of n) r.update(t.pubkey.toBytes()), r.update(Uint8Array.from([t.isSigner ? 1 : 0])), r.update(Uint8Array.from([t.pubkey.toString() === e.toString() || t.isWritable ? 1 : 0]));
			return new Uint8Array(r.arrayBuffer());
		})(t.flatMap((t) => [{
			pubkey: t.programId,
			isSigner: !1,
			isWritable: !1
		}, ...Q(t, a)]), e)
	};
}, Nt = (t, e) => {
	try {
		const a = (Tt || (Tt = new BorshCoder({
			version: "0.1.0",
			name: "lazorkit_msgs",
			instructions: [],
			accounts: [],
			types: [{
				name: "SimpleMessage",
				type: {
					kind: "struct",
					fields: [{
						name: "dataHash",
						type: { array: ["u8", 32] }
					}]
				}
			}]
		})), Tt).types.encode(t, e);
		return Buffer$1.from(a);
	} catch (e) {
		throw new Error(`Failed to encode ${t}: ${e instanceof Error ? e.message : "Unknown error"}`);
	}
};
function zt(t, e, a, n, r, i) {
	const s = Qt(n, t), o = Kt(r, t, i), l = new Uint8Array(64);
	l.set(s.policyDataHash, 0), l.set(s.policyAccountsHash, 32);
	const c = Mt(l), d = new Uint8Array(64);
	d.set(o.cpiDataHash, 0), d.set(o.cpiAccountsHash, 32);
	const A = Mt(d), p = Buffer$1.alloc(8);
	p.writeBigUInt64LE(BigInt(e.toString()), 0);
	const g = Buffer$1.alloc(8);
	g.writeBigInt64LE(BigInt(a.toString()), 0);
	const h = Mt(Buffer$1.concat([
		p,
		g,
		Buffer$1.from(c),
		Buffer$1.from(A)
	]));
	return Nt("SimpleMessage", { dataHash: Array.from(h) });
}
var Vt = new PublicKey("Secp256r1SigVerify1111111111111111111111111");
function Ft(t) {
	if (t instanceof Uint8Array) return t;
	if (Array.isArray(t)) return new Uint8Array(t);
	{
		const e = /* @__PURE__ */ new ArrayBuffer(2 * Object.values(t).length), a = new DataView(e);
		return Object.values(t).forEach((t, e) => {
			a.setUint16(2 * e, t, !0);
		}), new Uint8Array(e);
	}
}
function Lt(t) {
	nt(t.passkeyPublicKey, "passkeySignature.passkeyPublicKey"), ht(t.signature64, "passkeySignature.signature64"), ht(t.clientDataJsonRaw64, "passkeySignature.clientDataJsonRaw64"), ht(t.authenticatorDataRaw64, "passkeySignature.authenticatorDataRaw64");
	const e = Buffer.from(t.authenticatorDataRaw64, "base64"), a = Buffer.from(t.clientDataJsonRaw64, "base64"), n = Buffer.from(t.signature64, "base64");
	ot(gt(n), "passkeySignature.signature64 (decoded)");
	return function(t, e, a) {
		if (33 !== e.length || 64 !== a.length) throw new Error("Invalid key or signature length");
		const n = 113 + t.length, r = new Uint8Array(n);
		r.set(Ft([1, 0]), 0);
		const i = {
			signature_offset: 49,
			signature_instruction_index: 65535,
			public_key_offset: 16,
			public_key_instruction_index: 65535,
			message_data_offset: 113,
			message_data_size: t.length,
			message_instruction_index: 65535
		};
		return r.set(Ft(i), 2), r.set(e, 16), r.set(a, 49), r.set(t, 113), new TransactionInstruction({
			keys: [],
			programId: Vt,
			data: Buffer$1.from(r)
		});
	}(Buffer.concat([e, Buffer.from(import_sha256.sha256.arrayBuffer(a))]), t.passkeyPublicKey, n);
}
function jt(t) {
	const e = Buffer.from(t.signature64, "base64");
	return ot(gt(e), "passkeySignature.signature64 (decoded)"), {
		passkeyPublicKey: t.passkeyPublicKey,
		signature: gt(e),
		clientDataJsonRaw: Buffer.from(t.clientDataJsonRaw64, "base64"),
		authenticatorDataRaw: Buffer.from(t.authenticatorDataRaw64, "base64")
	};
}
function Jt(t) {
	return ComputeBudgetProgram.setComputeUnitLimit({ units: t });
}
function Gt(t, e) {
	return void 0 === e ? t : [Jt(e), ...t];
}
function _t(t, e) {
	return [t, ...e];
}
function Yt(t) {
	return void 0 !== t ? 1 : 0;
}
async function Xt(t, e, a, n = {}) {
	const { addressLookupTables: r, recentBlockhash: i, computeUnitLimit: s } = n, o = Gt(a, s), l = void 0 !== r && r.length > 0, c = i || (await t.getLatestBlockhash()).blockhash;
	if (l) return {
		transaction: new VersionedTransaction(new TransactionMessage({
			payerKey: e,
			recentBlockhash: c,
			instructions: o
		}).compileToV0Message([...r])),
		isVersioned: !0,
		recentBlockhash: c
	};
	{
		const t = new Transaction().add(...o);
		return t.feePayer = e, t.recentBlockhash = c, {
			transaction: t,
			isVersioned: !1,
			recentBlockhash: c
		};
	}
}
global.Buffer = Buffer$1, Buffer$1.prototype.subarray = function(t, e) {
	const a = Uint8Array.prototype.subarray.apply(this, [t, e]);
	return Object.setPrototypeOf(a, Buffer$1.prototype), a;
};
var qt = class {
	constructor(t) {
		this.connection = t, this.program = new Program(H, { connection: t }), this.programId = this.program.programId, this.defaultPolicyProgram = new kt(t), this.walletPdas = new Ut(this.programId), this.policyResolver = new Rt(this.defaultPolicyProgram, this.walletPdas);
	}
	getSmartWalletPubkey(t) {
		return this.walletPdas.smartWallet(t);
	}
	getWalletStatePubkey(t) {
		return this.walletPdas.walletState(t);
	}
	getWalletDevicePubkey(t, e) {
		return this.walletPdas.walletDevice(t, e);
	}
	getChunkPubkey(t, e) {
		return this.walletPdas.chunk(t, e);
	}
	generateWalletId() {
		return new import_bn.default(K(8), "le");
	}
	async fetchWalletStateContext(t) {
		const e = this.getWalletStatePubkey(t);
		return {
			walletState: e,
			data: await this.program.account.walletState.fetch(e)
		};
	}
	async fetchChunkContext(t, e) {
		const a = this.getChunkPubkey(t, e);
		return {
			chunk: a,
			data: await this.program.account.chunk.fetch(a)
		};
	}
	validateCreateSmartWalletParams(t) {
		$(t, "params"), tt(t.payer, "params.payer"), nt(t.passkeyPublicKey, "params.passkeyPublicKey"), ht(t.credentialIdBase64, "params.credentialIdBase64"), void 0 !== t.amount && ct(t.amount, "params.amount"), void 0 !== t.smartWalletId && ct(t.smartWalletId, "params.smartWalletId"), void 0 !== t.policyDataSize && yt(t.policyDataSize, "params.policyDataSize"), void 0 !== t.policyInstruction && pt(t.policyInstruction, "params.policyInstruction");
	}
	validateExecuteParams(t) {
		$(t, "params"), tt(t.payer, "params.payer"), tt(t.smartWallet, "params.smartWallet"), St(t.passkeySignature, "params.passkeySignature"), it(t.credentialHash, "params.credentialHash"), pt(t.cpiInstruction, "params.cpiInstruction"), ct(t.timestamp, "params.timestamp"), void 0 !== t.policyInstruction && pt(t.policyInstruction, "params.policyInstruction"), void 0 !== t.cpiSigners && ft(t.cpiSigners, "params.cpiSigners");
	}
	validateCreateChunkParams(t) {
		$(t, "params"), tt(t.payer, "params.payer"), tt(t.smartWallet, "params.smartWallet"), St(t.passkeySignature, "params.passkeySignature"), it(t.credentialHash, "params.credentialHash"), wt(t.cpiInstructions, "params.cpiInstructions"), ct(t.timestamp, "params.timestamp"), void 0 !== t.policyInstruction && pt(t.policyInstruction, "params.policyInstruction"), void 0 !== t.cpiSigners && ft(t.cpiSigners, "params.cpiSigners");
	}
	validateExecuteChunkParams(t) {
		$(t, "params"), tt(t.payer, "params.payer"), tt(t.smartWallet, "params.smartWallet"), wt(t.cpiInstructions, "params.cpiInstructions"), void 0 !== t.cpiSigners && ft(t.cpiSigners, "params.cpiSigners");
	}
	async getWalletStateData(t) {
		const { data: e } = await this.fetchWalletStateContext(t);
		return e;
	}
	async getChunkData(t) {
		return await this.program.account.chunk.fetch(t);
	}
	async getSmartWalletByCredentialHash(t) {
		it(t, "credentialHash");
		const e = H.accounts?.find((t) => "WalletDevice" === t.name)?.discriminator;
		if (!e) throw new q("WalletDevice discriminator not found in IDL", "credentialHash");
		const a = await this.connection.getProgramAccounts(this.programId, { filters: [{ memcmp: {
			offset: 0,
			bytes: esm_default.encode(e)
		} }, { memcmp: {
			offset: 41,
			bytes: esm_default.encode(t)
		} }] });
		if (0 === a.length) return null;
		for (const t of a) {
			const e = await this.program.account.walletDevice.fetch(t.pubkey);
			return {
				smartWallet: e.smartWallet,
				walletState: this.getWalletStatePubkey(e.smartWallet),
				walletDevice: t.pubkey,
				passkeyPublicKey: e.passkeyPubkey
			};
		}
		return null;
	}
	async buildCreateSmartWalletIns(t, e, a, n) {
		return tt(t, "payer"), tt(e, "smartWallet"), pt(a, "policyInstruction"), $(n, "args"), nt(n.passkeyPublicKey, "args.passkeyPublicKey"), it(n.credentialHash, "args.credentialHash"), ct(n.walletId, "args.walletId"), ct(n.amount, "args.amount"), await this.program.methods.createSmartWallet(n).accountsPartial({
			payer: t,
			smartWallet: e,
			walletState: this.getWalletStatePubkey(e),
			walletDevice: this.getWalletDevicePubkey(e, n.credentialHash),
			policyProgram: a.programId,
			systemProgram: SystemProgram.programId
		}).remainingAccounts([...Q(a)]).instruction();
	}
	async buildExecuteIns(t, e, a, n, r, i, s) {
		return tt(t, "payer"), tt(e, "smartWallet"), tt(a, "walletDevice"), $(n, "args"), pt(r, "policyInstruction"), pt(i, "cpiInstruction"), void 0 !== s && ft(s, "cpiSigners"), await this.program.methods.execute(n).accountsPartial({
			payer: t,
			smartWallet: e,
			walletState: this.getWalletStatePubkey(e),
			walletDevice: a,
			policyProgram: r.programId,
			cpiProgram: i.programId,
			ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
			systemProgram: SystemProgram.programId
		}).remainingAccounts([...Q(r), ...Q(i, s)]).instruction();
	}
	async buildCreateChunkIns(t, e, a, n, r) {
		tt(t, "payer"), tt(e, "smartWallet"), tt(a, "walletDevice"), $(n, "args"), pt(r, "policyInstruction");
		const { walletState: i, data: s } = await this.fetchWalletStateContext(e), o = this.getChunkPubkey(e, s.lastNonce);
		return await this.program.methods.createChunk(n).accountsPartial({
			payer: t,
			smartWallet: e,
			walletState: i,
			walletDevice: a,
			policyProgram: r.programId,
			chunk: o,
			ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
			systemProgram: SystemProgram.programId
		}).remainingAccounts([...Q(r)]).instruction();
	}
	async buildExecuteChunkIns(t, e, a, n) {
		tt(t, "payer"), tt(e, "smartWallet"), wt(a, "cpiInstructions"), void 0 !== n && ft(n, "cpiSigners");
		const { data: r, walletState: i } = await this.fetchWalletStateContext(e), { chunk: s, data: o } = await this.fetchChunkContext(e, r.lastNonce), l = a.map((t) => Buffer$1.from(t.data)), c = function(t) {
			const e = [];
			let a = 0;
			for (let n = 0; n < t.length - 1; n++) a += t[n].keys.length + 1, e.push(a);
			return e;
		}(a), d = function(t, e) {
			return t.flatMap((t) => [{
				pubkey: t.programId,
				isSigner: !1,
				isWritable: !1
			}, ...Q(t, e)]);
		}(a, n);
		return await this.program.methods.executeChunk(l, Buffer$1.from(c)).accountsStrict({
			payer: t,
			smartWallet: e,
			walletState: i,
			chunk: s,
			sessionRefund: o.rentRefundAddress,
			systemProgram: SystemProgram.programId
		}).remainingAccounts(d).instruction();
	}
	async createSmartWalletTxn(t, e = {}) {
		this.validateCreateSmartWalletParams(t);
		const a = t.smartWalletId ?? this.generateWalletId(), n = this.getSmartWalletPubkey(a), r = this.getWalletStatePubkey(n), i = t.amount ?? new import_bn.default(890880), s = t.policyDataSize ?? this.defaultPolicyProgram.getPolicyDataSize(), o = O(t.credentialIdBase64), l = await this.policyResolver.resolveForCreate({
			provided: t.policyInstruction,
			smartWalletId: a,
			smartWallet: n,
			walletState: r,
			passkeyPublicKey: t.passkeyPublicKey,
			credentialHash: o
		}), c = {
			passkeyPublicKey: t.passkeyPublicKey,
			credentialHash: o,
			initPolicyData: l.data,
			walletId: a,
			amount: i,
			policyDataSize: s
		}, d = await this.buildCreateSmartWalletIns(t.payer, n, l, c);
		return {
			transaction: (await Xt(this.connection, t.payer, [d], e)).transaction,
			smartWalletId: a,
			smartWallet: n
		};
	}
	async executeTxn(t, e = {}) {
		this.validateExecuteParams(t);
		const a = Lt(t.passkeySignature), n = await this.getWalletStateData(t.smartWallet), r = this.getWalletDevicePubkey(t.smartWallet, t.credentialHash), i = await this.policyResolver.resolveForExecute({
			provided: t.policyInstruction,
			smartWallet: t.smartWallet,
			credentialHash: t.credentialHash,
			passkeyPublicKey: t.passkeySignature.passkeyPublicKey,
			walletStateData: n
		}), s = jt(t.passkeySignature), o = _t(a, [await this.buildExecuteIns(t.payer, t.smartWallet, r, {
			...s,
			verifyInstructionIndex: Yt(e.computeUnitLimit),
			splitIndex: i.keys.length,
			policyData: i.data,
			cpiData: t.cpiInstruction.data,
			timestamp: t.timestamp
		}, i, t.cpiInstruction, [...t.cpiSigners ?? [], t.payer])]);
		return (await Xt(this.connection, t.payer, o, e)).transaction;
	}
	async createChunkTxn(t, e = {}) {
		this.validateCreateChunkParams(t);
		const a = Lt(t.passkeySignature), n = await this.getWalletStateData(t.smartWallet), r = this.getWalletDevicePubkey(t.smartWallet, t.credentialHash), i = await this.policyResolver.resolveForExecute({
			provided: t.policyInstruction,
			smartWallet: t.smartWallet,
			credentialHash: t.credentialHash,
			passkeyPublicKey: t.passkeySignature.passkeyPublicKey,
			walletStateData: n
		}), s = jt(t.passkeySignature), o = function(t, e, a) {
			const n = Kt(t, e, a), r = new Uint8Array(64);
			return r.set(n.cpiDataHash, 0), r.set(n.cpiAccountsHash, 32), Array.from(new Uint8Array(import_sha256.sha256.arrayBuffer(r)));
		}(t.cpiInstructions, t.smartWallet, [...t.cpiSigners ?? [], t.payer]), l = _t(a, [await this.buildCreateChunkIns(t.payer, t.smartWallet, r, {
			...s,
			policyData: i.data,
			verifyInstructionIndex: Yt(e.computeUnitLimit),
			timestamp: t.timestamp,
			cpiHash: Array.from(o)
		}, i)]);
		return (await Xt(this.connection, t.payer, l, e)).transaction;
	}
	async executeChunkTxn(t, e = {}) {
		this.validateExecuteChunkParams(t);
		const a = await this.buildExecuteChunkIns(t.payer, t.smartWallet, t.cpiInstructions, t.cpiSigners);
		return (await Xt(this.connection, t.payer, [a], e)).transaction;
	}
	async buildAuthorizationMessage(t) {
		let e;
		const { action: a, smartWallet: n, passkeyPublicKey: r, timestamp: i } = t;
		switch (a.type) {
			case M.CreateChunk: {
				const { policyInstruction: s, cpiInstructions: o, cpiSigners: l } = a.args, c = await this.getWalletStateData(t.smartWallet), d = await this.policyResolver.resolveForExecute({
					provided: s,
					smartWallet: t.smartWallet,
					credentialHash: t.credentialHash,
					passkeyPublicKey: r,
					walletStateData: c
				});
				e = zt(n, (await this.getWalletStateData(n)).lastNonce, i, d, o, [...l ?? [], t.payer]);
				break;
			}
			default: throw new q(`Unsupported SmartWalletAction: ${a.type}`, "action.type");
		}
		return e;
	}
};
"function" != typeof globalThis.structuredClone && (globalThis.structuredClone = (t) => JSON.parse(JSON.stringify(t)));
var $t = class extends import_eventemitter3.default {
	constructor() {
		super(), this.iframeRef = null, this.retryDelays = [
			200,
			400,
			800,
			1500,
			3e3
		];
	}
	setIframeRef(t) {
		this.iframeRef = t;
	}
	notifyCredentialsUpdated(t) {
		this.emit("credentials-updated", t);
		const e = new CustomEvent("lazorkit:credentials-updated", {
			detail: t,
			bubbles: !0,
			cancelable: !0
		});
		window.dispatchEvent(e);
	}
	syncCredentials(t = !1) {
		this.iframeRef && this.iframeRef.contentWindow ? this.performCredentialSync(t) : setTimeout(() => this.syncCredentials(t), 500);
	}
	performCredentialSync(t) {
		if (!this.iframeRef?.contentWindow) throw new Error("Cannot sync credentials: iframe reference not available");
		const e = localStorage.getItem("CREDENTIAL_ID") || "", a = localStorage.getItem("PUBLIC_KEY") || "", n = localStorage.getItem("SMART_WALLET_ADDRESS") || "";
		if (!(t || e && a)) return;
		const r = {
			type: "SYNC_CREDENTIALS",
			data: {
				credentialId: e,
				publickey: a,
				smartWalletAddress: n,
				timestamp: Date.now()
			}
		};
		try {
			this.iframeRef.contentWindow.postMessage(r, "*"), this.retryDelays.forEach((t) => {
				setTimeout(() => {
					try {
						this.iframeRef?.contentWindow && this.iframeRef.contentWindow.postMessage(r, "*");
					} catch (t) {}
				}, t);
			});
		} catch (t) {}
	}
	storeCredential(t) {
		t.credentialId && localStorage.setItem("CREDENTIAL_ID", t.credentialId), t.publickey && localStorage.setItem("PUBLIC_KEY", t.publickey), t.smartWalletAddress && localStorage.setItem("SMART_WALLET_ADDRESS", t.smartWalletAddress), localStorage.setItem("CREDENTIALS_TIMESTAMP", (/* @__PURE__ */ new Date()).toISOString());
	}
	destroy() {
		this.removeAllListeners(), this.iframeRef = null;
	}
};
var te = class extends import_eventemitter3.default {
	constructor(t) {
		super(), this.dialogRef = null, this.iframeRef = null, this.popupWindow = null, this.popupCloseInterval = null, this.isClosing = !1, this.isDestroyed = !1, this.logger = new R("DialogManager"), this._currentAction = null, this.config = t, this.credentialManager = new $t(), this.logger.debug("Created dialog manager"), this.setupMessageListener();
	}
	async openConnect() {
		return new Promise((t, e) => {
			const a = () => {
				this.off("connect-result", n), this.off("error", r);
			}, n = (e) => {
				a(), t(e);
			}, r = (t) => {
				a(), e(t);
			};
			this.on("connect-result", n), this.on("error", r);
			const i = setTimeout(() => {
				a(), e(/* @__PURE__ */ new Error("Connection timed out after 60 seconds"));
			}, 6e4), s = t, o = e;
			t = (t) => {
				clearTimeout(i), s(t);
			}, e = (t) => {
				clearTimeout(i), o(t);
			}, this._currentAction = W.CONNECT;
			if (this.shouldUsePopup("connect")) {
				const t = `${this.config.portalUrl}?action=${W.CONNECT}`;
				this.openPopup(t).catch(e);
			} else this.openConnectDialog().catch(e);
		});
	}
	async openSign(t, e, a, n) {
		return new Promise((r, i) => {
			const s = () => {
				this.off("sign-result", o), this.off("error", l);
			}, o = (t) => {
				s(), r(t);
			}, l = (t) => {
				s(), i(t);
			};
			this.on("sign-result", o), this.on("error", l);
			const c = setTimeout(() => {
				s(), i(/* @__PURE__ */ new Error("Signing timed out after 60 seconds"));
			}, 6e4), d = r, A = i;
			r = (t) => {
				clearTimeout(c), d(t);
			}, i = (t) => {
				clearTimeout(c), A(t);
			}, this._currentAction = W.SIGN;
			const u = this.shouldUsePopup("sign"), p = encodeURIComponent(t);
			let g = `${this.config.portalUrl}?action=${W.SIGN}&message=${p}&transaction=${encodeURIComponent(e)}&credentialId=${encodeURIComponent(a)}`;
			n && (g += `&clusterSimulation=${n}`), u ? this.openPopup(g).catch(i) : this.openSignDialog(g).catch(i);
		});
	}
	async openSignMessage(t, e) {
		return new Promise((a, n) => {
			const r = () => {
				this.off("sign-result", i), this.off("error", s);
			}, i = (t) => {
				r(), a(t);
			}, s = (t) => {
				r(), n(t);
			};
			this.on("sign-result", i), this.on("error", s);
			const o = setTimeout(() => {
				r(), n(/* @__PURE__ */ new Error("Signing timed out after 60 seconds"));
			}, 6e4), l = a, c = n;
			a = (t) => {
				clearTimeout(o), l(t);
			}, n = (t) => {
				clearTimeout(o), c(t);
			}, this._currentAction = W.SIGN;
			const d = encodeURIComponent(t), A = `${this.config.portalUrl}?action=${W.SIGN}&message=${d}&credentialId=${encodeURIComponent(e)}`;
			this.shouldUsePopup("sign") ? this.openPopup(A).catch(n) : this.openSignDialog(A).catch(n);
		});
	}
	async openConnectDialog() {
		const t = `${this.config.portalUrl}?action=${W.CONNECT}`;
		await this.openModal(t);
	}
	ensureFonts() {
		const t = "lazorkit-font-roboto-flex";
		if (document.getElementById(t)) return;
		const e = document.createElement("link");
		e.id = t, e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap", document.head.appendChild(e);
	}
	ensureDialogBackdropCSS() {
		const t = "lazorkit-dialog-backdrop-style";
		if (document.getElementById(t)) return;
		const e = document.createElement("style");
		e.id = t, e.textContent = "\n    /* ===== Backdrop (overlay nhẹ) ===== */\n    dialog#lazorkit-dialog::backdrop {\n      background: rgba(0,0,0,0);\n      animation: lazor-backdrop-in 160ms ease-out forwards;\n    }\n\n    dialog#lazorkit-dialog[data-state=\"closing\"]::backdrop {\n      animation: lazor-backdrop-out 140ms ease-in forwards;\n    }\n\n    @keyframes lazor-backdrop-in {\n      from { background: rgba(0,0,0,0); }\n      to   { background: rgba(0,0,0,0.12); } /* ✅ overlay nhẹ */\n    }\n\n    @keyframes lazor-backdrop-out {\n      from { background: rgba(0,0,0,0.12); }\n      to   { background: rgba(0,0,0,0); }\n    }\n\n    /* ===== Panel animations ===== */\n    @keyframes lazor-drawer-in {\n      from { transform: translateY(16px); opacity: 0.98; }\n      to   { transform: translateY(0); opacity: 1; }\n    }\n\n    @keyframes lazor-drawer-out {\n      from { transform: translateY(0); opacity: 1; }\n      to   { transform: translateY(16px); opacity: 0.98; }\n    }\n\n    @keyframes lazor-float-in {\n      from { transform: scale(0.985) translateY(4px); opacity: 0; }\n      to   { transform: scale(1) translateY(0); opacity: 1; }\n    }\n\n    @keyframes lazor-float-out {\n      from { transform: scale(1) translateY(0); opacity: 1; }\n      to   { transform: scale(0.985) translateY(4px); opacity: 0; }\n    }\n\n    #lazorkit-panel {\n      will-change: transform, opacity;\n      transform-origin: center;\n    }\n\n    dialog#lazorkit-dialog[data-variant=\"drawer\"][data-state=\"opening\"] #lazorkit-panel {\n      animation: lazor-drawer-in 180ms cubic-bezier(.2,.9,.2,1) forwards;\n    }\n\n    dialog#lazorkit-dialog[data-variant=\"drawer\"][data-state=\"closing\"] #lazorkit-panel {\n      animation: lazor-drawer-out 150ms ease-in forwards;\n    }\n\n    dialog#lazorkit-dialog[data-variant=\"floating\"][data-state=\"opening\"] #lazorkit-panel {\n      animation: lazor-float-in 170ms cubic-bezier(.2,.9,.2,1) forwards;\n    }\n\n    dialog#lazorkit-dialog[data-variant=\"floating\"][data-state=\"closing\"] #lazorkit-panel {\n      animation: lazor-float-out 140ms ease-in forwards;\n    }\n\n    /* ===== Reduced motion ===== */\n    @media (prefers-reduced-motion: reduce) {\n      dialog#lazorkit-dialog::backdrop {\n        animation: none !important;\n        background: rgba(0,0,0,0.12) !important;\n      }\n      dialog#lazorkit-dialog[data-state=\"closing\"]::backdrop {\n        background: rgba(0,0,0,0) !important;\n      }\n      dialog#lazorkit-dialog #lazorkit-panel {\n        animation: none !important;\n      }\n    }\n  ", document.head.appendChild(e);
	}
	createCloseButton(t) {
		const e = document.createElement("button");
		return e.type = "button", e.title = "Close Dialog", e.setAttribute("aria-label", "Close Dialog"), Object.assign(e.style, {
			width: "36px",
			height: "36px",
			borderRadius: "10px",
			border: "none",
			background: "transparent",
			cursor: "pointer",
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "0",
			color: "rgba(255, 255, 255, 0.6)",
			outline: "none",
			webkitTapHighlightColor: "transparent"
		}), e.addEventListener("mouseenter", () => {
			e.style.background = "rgba(255,255,255,0.1)", e.style.color = "#ffffff";
		}), e.addEventListener("mouseleave", () => {
			e.style.background = "transparent", e.style.color = "rgba(255, 255, 255, 0.6)";
		}), e.onclick = t, e.innerHTML = "\n    <svg xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"20\" height=\"20\" viewBox=\"0 0 24 24\"\n      fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"\n      stroke-linecap=\"round\" stroke-linejoin=\"round\">\n      <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\" />\n      <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\" />\n    </svg>\n  ", e;
	}
	async openSignDialog(t) {
		await this.openModal(t), this.iframeRef && (this.credentialManager.setIframeRef(this.iframeRef), setTimeout(() => {
			this.credentialManager.syncCredentials(!0);
		}, 500));
	}
	isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}
	isSafari() {
		return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	}
	shouldUsePopup(t) {
		const e = this.isMobileDevice();
		return !(!this.isSafari() || "connect" !== t) || !(!e || "connect" !== t) || !(!e && "sign" === t) && (!e || "sign" !== t);
	}
	getPopupDimensions() {
		if (!window.top) return {
			width: 450,
			height: 600,
			top: 0,
			left: 0
		};
		const t = window.top.outerWidth / 2 + window.top.screenX - 225;
		return {
			width: 450,
			height: 600,
			top: window.top.outerHeight / 2 + window.top.screenY - 300,
			left: t
		};
	}
	async openPopup(t) {
		if (this.popupWindow && !this.popupWindow.closed) try {
			this.popupWindow.close();
		} catch (t) {}
		const e = this.getPopupDimensions();
		if (this.popupWindow = window.open(t, "lazorkit-popup", `width=${e.width},height=${e.height},top=${e.top},left=${e.left},resizable,scrollbars,status`), this.startPopupMonitor(), !this.popupWindow) throw this.logger.error("Popup was blocked by browser"), /* @__PURE__ */ new Error("Popup was blocked by browser");
	}
	startPopupMonitor() {
		this.popupCloseInterval && clearInterval(this.popupCloseInterval), this.popupCloseInterval = setInterval(() => {
			this.popupWindow?.closed && (this.popupWindow = null, this.popupCloseInterval && (clearInterval(this.popupCloseInterval), this.popupCloseInterval = null));
		}, 500);
	}
	async openModal(t) {
		this.dialogRef || this.createModal(), this.iframeRef && (this.iframeRef.src = t), this.dialogRef && !this.dialogRef.open && (this.dialogRef.setAttribute("data-state", "opening"), this.dialogRef.showModal(), window.setTimeout(() => {
			this.dialogRef?.open && this.dialogRef.setAttribute("data-state", "idle");
		}, 220));
	}
	createModal() {
		this.ensureFonts(), this.ensureDialogBackdropCSS();
		const t = document.createElement("dialog");
		t.id = "lazorkit-dialog", t.style.colorScheme = "dark", t.setAttribute("data-theme", "dark");
		const e = this.isMobileDevice(), a = ((t) => ({
			overlay: {
				position: "fixed",
				inset: 0,
				padding: 0,
				border: "none",
				background: "transparent",
				width: "100%",
				height: "100%",
				maxWidth: "none",
				maxHeight: "none",
				overflow: "visible",
				zIndex: 2147483647,
				display: "grid",
				placeItems: t ? "end center" : "center"
			},
			panel: {
				width: t ? "100%" : "360px",
				maxWidth: t ? "100%" : "90vw",
				height: t ? "55vh" : "650px",
				maxHeight: t ? "55vh" : "90vh",
				background: "white",
				borderRadius: t ? "20px 20px 0 0" : "20px",
				boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
				overflow: "hidden",
				position: "relative"
			},
			closeButton: { zIndex: 10 },
			iframeContainer: {
				position: "relative",
				width: "100%",
				height: "100%",
				border: "none",
				margin: 0,
				padding: 0,
				overflow: "hidden",
				borderRadius: "inherit",
				background: "white"
			},
			iframe: {
				width: "100%",
				height: "100%",
				border: 0,
				borderRadius: "inherit",
				display: "block"
			}
		}))(e);
		Object.assign(t.style, a.overlay), Object.assign(t.style, {
			"--background-color-th_base": "#191919",
			"--background-color-th_frame": "#191919",
			"--text-color-th_base": "#eeeeee",
			"--border-color-th_frame": "rgba(255,255,255,0.10)"
		});
		const n = document.createElement("div"), r = e ? "drawer" : "floating";
		t.setAttribute("data-variant", r), t.setAttribute("data-state", "idle"), n.id = "lazorkit-panel", Object.assign(n.style, a.panel), Object.assign(n.style, {
			display: "flex",
			flexDirection: "column"
		}), Object.assign(n.style, {
			background: "var(--background-color-th_base, #fcfcfc)",
			color: "var(--text-color-th_base, #202020)",
			fontFamily: "\"Roboto Flex\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
		});
		const i = document.createElement("div");
		Object.assign(i.style, {
			height: "32px",
			flex: "0 0 auto",
			display: "flex",
			alignItems: "center",
			justifyContent: "flex-end",
			padding: "0 12px",
			boxSizing: "border-box",
			borderBottom: "1px solid rgba(0,0,0,0.08)"
		}), Object.assign(i.style, {
			background: "var(--background-color-th_frame, var(--background-color-th_base, #fcfcfc))",
			color: "var(--text-color-th_base, #202020)",
			borderBottom: "1px solid var(--border-color-th_frame, rgba(0,0,0,0.08))"
		});
		const s = document.createElement("div");
		Object.assign(s.style, a.iframeContainer), Object.assign(s.style, { flex: "1 1 auto" }), Object.assign(s.style, { background: "var(--background-color-th_base, #fcfcfc)" }), Object.assign(n.style, {
			background: "var(--background-color-th_base, #191919)",
			color: "var(--text-color-th_base, #eeeeee)"
		}), Object.assign(i.style, {
			background: "var(--background-color-th_frame, #191919)",
			color: "var(--text-color-th_base, #eeeeee)",
			borderBottom: "1px solid var(--border-color-th_frame, rgba(255,255,255,0.10))"
		}), Object.assign(s.style, { background: "var(--background-color-th_base, #191919)" });
		const o = this.createCloseButton(() => {
			this.closeDialog(), this.emit("close");
		});
		Object.assign(o.style, {
			position: "static",
			top: "",
			right: ""
		}), o.id = "lazorkit-dialog-close", o.ariaLabel = "Close", Object.assign(o.style, a.closeButton);
		const l = document.createElement("iframe");
		l.id = "lazorkit-iframe", Object.assign(l.style, a.iframe), l.allow = `publickey-credentials-get ${this.config.portalUrl}; publickey-credentials-create ${this.config.portalUrl}; clipboard-write; camera; microphone`;
		const c = l.sandbox;
		c.add("allow-forms"), c.add("allow-scripts"), c.add("allow-same-origin"), c.add("allow-popups"), c.add("allow-popups-to-escape-sandbox"), c.add("allow-modals"), l.setAttribute("aria-label", "Lazor Wallet"), l.tabIndex = 0, l.title = "Lazor", t.addEventListener("cancel", () => this.closeDialog()), t.addEventListener("click", (e) => {
			e.target === t && this.closeDialog();
		}), i.appendChild(o), n.appendChild(i), s.appendChild(l), n.appendChild(s), t.appendChild(n), document.body.appendChild(t), this.dialogRef = t, this.iframeRef = l;
	}
	setupMessageListener() {
		window.addEventListener("message", (t) => {
			if (!t.origin.includes(new URL(this.config.portalUrl).hostname)) return;
			const { type: e, data: a, error: n } = t.data;
			if (n) this.emit("error", new Error(n.message || "Portal error"));
			else switch (e) {
				case "connect-result":
				case "WALLET_CONNECTED":
					const t = {
						publicKey: a.publickey || a.publicKey || "",
						credentialId: a.credentialId,
						isCreated: "create" === a.connectionType || !!a.publickey,
						connectionType: a.connectionType || (a.publickey ? "create" : "get"),
						timestamp: a.timestamp || Date.now(),
						accountName: a.accountName
					};
					this.emit("connect-result", t), this.closeDialog();
					break;
				case "sign-result":
				case "SIGNATURE_CREATED":
					const e = {
						signature: a.normalized,
						clientDataJsonBase64: a.clientDataJSONReturn,
						authenticatorDataBase64: a.authenticatorDataReturn,
						signedPayload: a.msg
					};
					this.emit("sign-result", e), this.closeDialog();
					break;
				case "error":
					this.emit("error", new Error(a?.message || "Unknown portal error"));
					break;
				case "close": this.closeDialog();
			}
		});
	}
	closeDialog() {
		if (this.isClosing) return;
		this.isClosing = !0;
		const t = this.dialogRef, e = this.iframeRef;
		try {
			t && t.setAttribute("data-state", "closing"), window.setTimeout(() => {
				try {
					if (e && (e.parentNode && e.parentNode.removeChild(e), this.iframeRef = null), t) {
						try {
							t.open && t.close();
						} catch {}
						t.parentNode && t.parentNode.removeChild(t), this.dialogRef = null;
					}
					if (this.popupWindow) {
						try {
							this.popupWindow.close();
						} catch {}
						this.popupWindow = null;
					}
					this.popupCloseInterval && (clearInterval(this.popupCloseInterval), this.popupCloseInterval = null), this.logger.debug("Closed dialog (animated)");
				} catch (t) {
					this.logger.error("Error during animated close:", t);
				} finally {
					this.isClosing = !1;
				}
			}, 170);
		} catch (t) {
			this.logger.error("Error closing dialog:", t), this.isClosing = !1;
		}
	}
	getIframeRef() {
		return this.iframeRef;
	}
	getDialogRef() {
		return this.dialogRef;
	}
	getPopupWindow() {
		return this.popupWindow;
	}
	getCurrentAction() {
		return this._currentAction;
	}
	destroy() {
		this.isDestroyed || (this.isDestroyed = !0, this.closeDialog(), this.credentialManager.destroy(), this.removeAllListeners(), this.logger.debug("Destroyed dialog manager"));
	}
};
var ee = (t) => new te({
	portalUrl: t.portalUrl,
	rpcUrl: t.rpcUrl,
	paymasterUrl: t.paymasterConfig.paymasterUrl
}), ae = (t) => Array.from(new Uint8Array(import_sha256.sha256.arrayBuffer(Buffer.from(t, "base64")))), ne = (t, e, a) => {
	const n = t instanceof Error ? t : new Error(String(t));
	throw e({ error: n }), a?.(n), n;
}, re = (t) => t ? Array.from(Buffer.from(t, "base64")) : [], ie = async (t, e, a) => {
	const { isConnecting: n, config: r } = t();
	if (n) throw new Error("Already connecting");
	e({
		isConnecting: !0,
		error: null
	});
	try {
		const n = await U.getWallet();
		if ((() => {
			if ("undefined" == typeof window) return;
			const t = localStorage.getItem("lazorkit-wallet");
			if (t) try {
				const e = JSON.parse(t);
				e.state && void 0 !== e.version && localStorage.removeItem("lazorkit-wallet");
			} catch (t) {}
		})(), n) return e({ wallet: n }), a?.onSuccess?.(n), n;
		const i = ee(r);
		try {
			const n = await i.openConnect(), s = new T(r.paymasterConfig), o = new qt(t().connection), l = ae(n.credentialId), c = await o.getSmartWalletByCredentialHash(l);
			let d, A;
			if (!n.publicKey && c ? (A = Buffer.from(c.passkeyPublicKey).toString("base64"), localStorage.setItem("PUBLIC_KEY", A)) : A = n.publicKey, c) d = c.smartWallet.toBase58();
			else {
				const t = await s.getPayer(), e = await o.createSmartWalletTxn({
					passkeyPublicKey: re(A),
					payer: t,
					credentialIdBase64: n.credentialId
				});
				await s.signAndSend(e.transaction), d = e.smartWallet.toBase58();
			}
			const u = {
				credentialId: n.credentialId,
				passkeyPubkey: re(A),
				expo: "web",
				platform: navigator.platform,
				smartWallet: d,
				walletDevice: "",
				accountName: n.accountName
			};
			return await U.saveWallet(u), e({ wallet: u }), a?.onSuccess?.(u), u;
		} finally {
			i.destroy();
		}
	} catch (t) {
		return ne(t, e, a?.onFail);
	} finally {
		e({ isConnecting: !1 });
	}
}, se = create()(C((t, e) => ({
	wallet: null,
	config: {
		portalUrl: P.PORTAL_URL,
		paymasterConfig: { paymasterUrl: P.PAYMASTER_URL },
		rpcUrl: P.RPC_ENDPOINT
	},
	connection: new Connection(P.RPC_ENDPOINT, E),
	isLoading: !1,
	isConnecting: !1,
	isSigning: !1,
	error: null,
	setConfig: (e) => {
		try {
			t({
				config: e,
				connection: new Connection(e.rpcUrl || P.RPC_ENDPOINT, E)
			});
		} catch (t) {
			throw console.error("Failed to update wallet configuration:", t, { config: e }), /* @__PURE__ */ new Error(`Failed to update configuration: ${t}`);
		}
	},
	setWallet: (e) => {
		try {
			t({ wallet: e });
		} catch (t) {
			throw console.error("Failed to set wallet:", t, { wallet: e }), t;
		}
	},
	setLoading: (e) => t({ isLoading: e }),
	setConnecting: (e) => t({ isConnecting: e }),
	setSigning: (e) => t({ isSigning: e }),
	setConnection: (e) => {
		try {
			t({ connection: e });
		} catch (t) {
			throw console.error("Failed to set connection:", t, { endpoint: e?.rpcEndpoint }), t;
		}
	},
	setError: (e) => {
		t({ error: e }), e && console.error("Error state set:", e);
	},
	clearError: () => {
		t({ error: null });
	},
	connect: (a) => ie(e, t, a),
	disconnect: () => (async (t, e) => {
		try {
			await U.clearWallet(), t({
				wallet: null,
				error: null,
				isConnecting: !1,
				isSigning: !1,
				isLoading: !1
			}), e?.onSuccess?.();
		} catch (a) {
			return ne(a, t, e?.onFail);
		}
	})(t),
	signAndSendTransaction: (a) => (async (t, e, a) => {
		const { isSigning: n, connection: r, wallet: i, config: s } = t();
		if (n) throw new Error("Already signing");
		if (!i) throw new Error("No wallet connected");
		if (!r) throw new Error("No connection available");
		e({
			isSigning: !0,
			error: null
		});
		try {
			const t = new T(s.paymasterConfig), e = new qt(r), n = await t.getPayer(), o = await z(r), l = await e.buildAuthorizationMessage({
				action: {
					type: M.CreateChunk,
					args: { cpiInstructions: a.instructions }
				},
				payer: n,
				smartWallet: new PublicKey(i.smartWallet),
				passkeyPublicKey: i.passkeyPubkey,
				timestamp: new import_bn.default(o),
				credentialHash: ae(i.credentialId)
			}), c = Buffer.from(l).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), p = new VersionedTransaction(new TransactionMessage({
				payerKey: n,
				recentBlockhash: (await r.getLatestBlockhash()).blockhash,
				instructions: a.instructions
			}).compileToV0Message()), g = Buffer.from(p.serialize()).toString("base64"), m = ee(s), h = i.credentialId, y = a.transactionOptions?.clusterSimulation;
			try {
				const s = await m.openSign(c, g, h, y), l = {
					msg: c,
					normalized: s.signature,
					clientDataJSONReturn: s.clientDataJsonBase64,
					authenticatorDataReturn: s.authenticatorDataBase64
				}, d = ae(i.credentialId), u = await e.createChunkTxn({
					payer: n,
					smartWallet: new PublicKey(i.smartWallet),
					passkeySignature: {
						passkeyPublicKey: i.passkeyPubkey,
						signature64: l.normalized,
						clientDataJsonRaw64: l.clientDataJSONReturn,
						authenticatorDataRaw64: l.authenticatorDataReturn
					},
					cpiInstructions: a.instructions,
					timestamp: o,
					credentialHash: d
				}), p = await t.signAndSend(u);
				await r.confirmTransaction(p), await V(r, e, new PublicKey(i.smartWallet));
				const f = a.transactionOptions?.addressLookupTableAccounts || [], w = await e.executeChunkTxn({
					payer: n,
					smartWallet: new PublicKey(i.smartWallet),
					cpiInstructions: a.instructions
				}, {
					addressLookupTables: f,
					computeUnitLimit: a.transactionOptions?.computeUnitLimit
				});
				let b;
				return b = f.length > 0 ? await t.signAndSendVersionedTransaction(w) : await t.signAndSend(w), a.onSuccess?.(b), b;
			} finally {
				m.destroy();
			}
		} catch (t) {
			return ne(t, e, a.onFail);
		} finally {
			e({ isSigning: !1 });
		}
	})(e, t, a),
	signMessage: (a) => (async (t, e, a) => {
		const { isSigning: n, wallet: r, config: i } = t();
		if (n) throw new Error("Already signing");
		if (!r) throw new Error("No wallet connected");
		e({
			isSigning: !0,
			error: null
		});
		try {
			const t = ee(i);
			try {
				const e = await t.openSignMessage(a, r.credentialId);
				return {
					signature: e.signature,
					signedPayload: e.signedPayload
				};
			} finally {
				t.destroy();
			}
		} catch (t) {
			throw e({ error: t }), t;
		} finally {
			e({ isSigning: !1 });
		}
	})(e, t, a)
}), {
	name: "lazorkit-wallet-store",
	storage: v(() => x),
	partialize: (t) => ({
		wallet: t.wallet,
		config: t.config
	})
})), oe = (n) => {
	const { children: r, rpcUrl: i = P.RPC_ENDPOINT, portalUrl: s = P.PORTAL_URL, paymasterConfig: o = { paymasterUrl: P.PAYMASTER_URL } } = n, { setConfig: l } = se();
	return (0, import_react.useEffect)(() => {
		l({
			portalUrl: s,
			paymasterConfig: o,
			rpcUrl: i
		});
	}, [
		i,
		s,
		o,
		l
	]), (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: r });
};
function le(t) {
	return Uint8Array.from(atob(t), (t) => t.charCodeAt(0));
}
async function ce(t) {
	let e = t;
	if (64 === e.length) {
		const t = new Uint8Array(65);
		t[0] = 4, t.set(e, 1), e = t;
	}
	return crypto.subtle.importKey("raw", e, {
		name: "ECDSA",
		namedCurve: "P-256"
	}, !1, ["verify"]);
}
async function de({ signedPayload: t, signature: e, publicKey: a }) {
	const n = le(t), r = le(e), s = await ce(le(a));
	return crypto.subtle.verify({
		name: "ECDSA",
		hash: "SHA-256"
	}, s, r, n);
}
var Ae = () => {
	const { wallet: t, isLoading: e, isConnecting: a, isSigning: i, error: s, connect: o, disconnect: l, signAndSendTransaction: c, signMessage: d } = se(), A = (0, import_react.useCallback)(async (t) => {
		try {
			return await o(t);
		} catch (t) {
			throw console.error("Failed to connect wallet:", t), t;
		}
	}, [o]), u = (0, import_react.useCallback)(async () => {
		try {
			await l();
		} catch (t) {
			throw console.error("Failed to disconnect wallet:", t), t;
		}
	}, [l]), p = (0, import_react.useCallback)(async (t) => {
		try {
			return await c({
				instructions: t.instructions,
				transactionOptions: t.transactionOptions
			});
		} catch (t) {
			throw console.error("Failed to sign and send transaction:", t), t;
		}
	}, [c]), g = (0, import_react.useCallback)(async (t) => {
		try {
			return await d(t);
		} catch (t) {
			throw console.error("Failed to sign message:", t), t;
		}
	}, [d]), m = (0, import_react.useCallback)(async ({ signedPayload: t, signature: e, publicKey: a }) => {
		return await de({
			signedPayload: Buffer.from(t).toString("base64"),
			signature: Buffer.from(e).toString("base64"),
			publicKey: Buffer.from(a).toString("base64")
		});
	}, []);
	return {
		smartWalletPubkey: t?.smartWallet ? new PublicKey(t.smartWallet) : null,
		isConnected: !!t,
		isLoading: e || a || i,
		isConnecting: a,
		isSigning: i,
		error: s,
		wallet: t,
		connect: A,
		disconnect: u,
		signAndSendTransaction: p,
		signMessage: g,
		verifyMessage: m
	};
};
//#endregion
export { oe as n, Ae as t };
