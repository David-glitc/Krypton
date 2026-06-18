import { o as __toCommonJS, s as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { J as Logger, K as DynamicError, V as PlatformService, Y as LogLevel, b as WalletConnectorBase } from "../@dynamic-labs-connectors/metamask-solana+[...].mjs";
import { F as bufferToBase64URLString, N as startRegistration, P as browserSupportsWebAuthn, Vt as AuthenticatorTransportProtocol } from "../@dynamic-labs-sdk/client+[...].mjs";
import { I as init_lib, L as lib_exports } from "../@coral-xyz/anchor.mjs";
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/DeferredPromise/DeferredPromise.js
/**
* A DeferredPromise provides methods to manually resolve or reject a Promise.
* This is useful in scenarios where you need to resolve or reject a Promise
* outside of the executor function.
*
* @template T The type of the value with which the promise will be resolved.
*/
var DeferredPromise = class {
	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/getTLD/getTLD.js
var getTLD = () => PlatformService.getTLD();
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/_virtual/_tslib.js
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter$1(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+encoding@0.5.0/node_modules/@turnkey/encoding/dist/index.mjs
function stringToBase64urlString(input) {
	return base64StringToBase64UrlEncodedString(btoa$1(input));
}
function hexStringToBase64url(input, length) {
	return stringToBase64urlString(uint8ArrayFromHexString(input.padStart(Math.ceil(input.length / 2) * 2, "0"), length).reduce((result, x) => result + String.fromCharCode(x), ""));
}
function base64StringToBase64UrlEncodedString(input) {
	return input.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function uint8ArrayToHexString(input) {
	return input.reduce((result, x) => result + x.toString(16).padStart(2, "0"), "");
}
var uint8ArrayFromHexString = (hexString, length) => {
	if (!hexString || hexString.length % 2 != 0 || !/^[0-9A-Fa-f]+$/.test(hexString)) throw new Error(`cannot create uint8array from invalid hex string: "${hexString}"`);
	const buffer = new Uint8Array(hexString.match(/../g).map((h) => parseInt(h, 16)));
	if (!length) return buffer;
	if (hexString.length / 2 > length) throw new Error("hex value cannot fit in a buffer of " + length + " byte(s)");
	let paddedBuffer = new Uint8Array(length);
	paddedBuffer.set(buffer, length - buffer.length);
	return paddedBuffer;
};
function btoa$1(s) {
	if (arguments.length === 0) throw new TypeError("1 argument required, but only 0 present.");
	let i;
	s = `${s}`;
	for (i = 0; i < s.length; i++) if (s.charCodeAt(i) > 255) throw new Error(`InvalidCharacterError: found code point greater than 255:${s.charCodeAt(i)} at position ${i}`);
	let out = "";
	for (i = 0; i < s.length; i += 3) {
		const groupsOfSix = [
			void 0,
			void 0,
			void 0,
			void 0
		];
		groupsOfSix[0] = s.charCodeAt(i) >> 2;
		groupsOfSix[1] = (s.charCodeAt(i) & 3) << 4;
		if (s.length > i + 1) {
			groupsOfSix[1] |= s.charCodeAt(i + 1) >> 4;
			groupsOfSix[2] = (s.charCodeAt(i + 1) & 15) << 2;
		}
		if (s.length > i + 2) {
			groupsOfSix[2] |= s.charCodeAt(i + 2) >> 6;
			groupsOfSix[3] = s.charCodeAt(i + 2) & 63;
		}
		for (let j = 0; j < groupsOfSix.length; j++) if (typeof groupsOfSix[j] === "undefined") out += "=";
		else out += btoaLookup(groupsOfSix[j]);
	}
	return out;
}
function btoaLookup(index) {
	/**
	* Lookup table for btoa(), which converts a six-bit number into the
	* corresponding ASCII character.
	*/
	const keystr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	if (index >= 0 && index < 64) return keystr[index];
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+api-key-stamper@0.4.7/node_modules/@turnkey/api-key-stamper/dist/tink/bytes.mjs
/**
* Code modified from https://github.com/google/tink/blob/6f74b99a2bfe6677e3670799116a57268fd067fa/javascript/subtle/bytes.ts
*
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/
/**
* Converts the hex string to a byte array.
*
* @param hex the input
* @return the byte array output
* @throws {!Error}
* @static
*/
function fromHex(hex) {
	if (hex.length % 2 != 0) throw new Error("Hex string length must be multiple of 2");
	const arr = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) arr[i / 2] = parseInt(hex.substring(i, i + 2), 16);
	return arr;
}
/**
* Converts a byte array to hex.
*
* @param bytes the byte array input
* @return hex the output
* @static
*/
function toHex(bytes) {
	let result = "";
	for (let i = 0; i < bytes.length; i++) {
		const hexByte = bytes[i].toString(16);
		result += hexByte.length > 1 ? hexByte : "0" + hexByte;
	}
	return result;
}
/**
* Base64 encode a byte array.
*
* @param bytes the byte array input
* @param opt_webSafe True indicates we should use the alternative
*     alphabet, which does not require escaping for use in URLs.
* @return base64 output
* @static
*/
function toBase64(bytes, opt_webSafe) {
	return btoa(toByteString(bytes)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
/**
* Turns a byte array into the string given by the concatenation of the
* characters to which the numbers correspond. Each byte is corresponding to a
* character. Does not support multi-byte characters.
*
* @param bytes Array of numbers representing
*     characters.
* @return Stringification of the array.
*/
function toByteString(bytes) {
	let str = "";
	for (let i = 0; i < bytes.length; i += 1) str += String.fromCharCode(bytes[i]);
	return str;
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+api-key-stamper@0.4.7/node_modules/@turnkey/api-key-stamper/dist/tink/elliptic_curves.mjs
/**
* Code modified from https://github.com/google/tink/blob/6f74b99a2bfe6677e3670799116a57268fd067fa/javascript/subtle/elliptic_curves.ts
* - The implementation of integerToByteArray has been modified to augment the resulting byte array to a certain length.
* - The implementation of PointDecode has been modified to decode both compressed and uncompressed points by checking for correct format
* - Method isP256CurvePoint added to check whether an uncompressed point is valid
*
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: Apache-2.0
*/
/**
* P-256 only
*/
function getModulus() {
	return BigInt("115792089210356248762697446949407573530086143415290314195533631308867097853951");
}
/**
* P-256 only
*/
function getB() {
	return BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b");
}
/** Converts byte array to bigint. */
function byteArrayToInteger(bytes) {
	return BigInt("0x" + toHex(bytes));
}
/** Converts bigint to byte array. */
function integerToByteArray(i, length) {
	const input = i.toString(16);
	const numHexChars = length * 2;
	let padding = "";
	if (numHexChars < input.length) throw new Error(`cannot pack integer with ${input.length} hex chars into ${length} bytes`);
	else padding = "0".repeat(numHexChars - input.length);
	return fromHex(padding + input);
}
/** Returns true iff the ith bit (in lsb order) of n is set. */
function testBit(n, i) {
	return (n & BigInt(1) << BigInt(i)) !== BigInt(0);
}
/**
* Computes a modular exponent.  Since JavaScript BigInt operations are not
* constant-time, information about the inputs could leak.  Therefore, THIS
* METHOD SHOULD ONLY BE USED FOR POINT DECOMPRESSION.
*
* @param b base
* @param exp exponent
* @param p modulus
* @return b^exp modulo p
*/
function modPow(b, exp, p) {
	if (exp === BigInt(0)) return BigInt(1);
	let result = b;
	const exponentBitString = exp.toString(2);
	for (let i = 1; i < exponentBitString.length; ++i) {
		result = result * result % p;
		if (exponentBitString[i] === "1") result = result * b % p;
	}
	return result;
}
/**
* Computes a square root modulo an odd prime.  Since timing and exceptions can
* leak information about the inputs, THIS METHOD SHOULD ONLY BE USED FOR
* POINT DECOMPRESSION.
*
* @param x square
* @param p prime modulus
* @return square root of x modulo p
*/
function modSqrt(x, p) {
	if (p <= BigInt(0)) throw new Error("p must be positive");
	const base = x % p;
	if (testBit(p, 0) && testBit(p, 1)) {
		const squareRoot = modPow(base, p + BigInt(1) >> BigInt(2), p);
		if (squareRoot * squareRoot % p !== base) throw new Error("could not find a modular square root");
		return squareRoot;
	}
	throw new Error("unsupported modulus value");
}
/**
* Computes the y-coordinate of a point on an elliptic curve given its
* x-coordinate.  Since timing and exceptions can leak information about the
* inputs, THIS METHOD SHOULD ONLY BE USED FOR POINT DECOMPRESSION.
*
* P-256 only
*
* @param x x-coordinate
* @param lsb least significant bit of the y-coordinate
* @return y-coordinate
*/
function getY(x, lsb) {
	const p = getModulus();
	const a = p - BigInt(3);
	const b = getB();
	let y = modSqrt(((x * x + a) * x + b) % p, p);
	if (lsb !== testBit(y, 0)) y = (p - y) % p;
	return y;
}
/**
*
* Given x and y coordinates of a JWK, checks whether these are valid points on
* the P-256 elliptic curve.
*
* P-256 only
*
* @param x x-coordinate
* @param y y-coordinate
* @return boolean validity
*/
function isP256CurvePoint(x, y) {
	const p = getModulus();
	const a = p - BigInt(3);
	const b = getB();
	const rhs = ((x * x + a) * x + b) % p;
	return y ** BigInt(2) % p === rhs;
}
/**
* Decodes a public key in _compressed_ OR _uncompressed_ format.
* Augmented to ensure that the x and y components are padded to fit 32 bytes.
*
* P-256 only
*/
function pointDecode(point) {
	const fieldSize = fieldSizeInBytes();
	const compressedLength = fieldSize + 1;
	const uncompressedLength = 2 * fieldSize + 1;
	if (point.length !== compressedLength && point.length !== uncompressedLength) throw new Error("Invalid length: point is not in compressed or uncompressed format");
	if ((point[0] === 2 || point[0] === 3) && point.length == compressedLength) {
		const lsb = point[0] === 3;
		const x = byteArrayToInteger(point.subarray(1, point.length));
		const p = getModulus();
		if (x < BigInt(0) || x >= p) throw new Error("x is out of range");
		const y = getY(x, lsb);
		return {
			kty: "EC",
			crv: "P-256",
			x: toBase64(integerToByteArray(x, 32)),
			y: toBase64(integerToByteArray(y, 32)),
			ext: true
		};
	} else if (point[0] === 4 && point.length == uncompressedLength) {
		const x = byteArrayToInteger(point.subarray(1, fieldSize + 1));
		const y = byteArrayToInteger(point.subarray(fieldSize + 1, 2 * fieldSize + 1));
		const p = getModulus();
		if (x < BigInt(0) || x >= p || y < BigInt(0) || y >= p || !isP256CurvePoint(x, y)) throw new Error("invalid uncompressed x and y coordinates");
		return {
			kty: "EC",
			crv: "P-256",
			x: toBase64(integerToByteArray(x, 32)),
			y: toBase64(integerToByteArray(y, 32)),
			ext: true
		};
	}
	throw new Error("invalid format");
}
/**
* P-256 only
*/
function fieldSizeInBytes() {
	return 32;
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+api-key-stamper@0.4.7/node_modules/@turnkey/api-key-stamper/dist/index.mjs
var stampHeaderName$2 = "X-Stamp";
var isCryptoEnabledBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined";
var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
var detectRuntime = () => {
	if (isCryptoEnabledBrowser) return "browser";
	if (isNode) return "node";
	return "purejs";
};
/**
* Signature function abstracting the differences between NodeJS and web environments for signing with API keys.
*/
var signWithApiKey = async (input, runtimeOverride) => {
	const runtime = runtimeOverride ?? detectRuntime();
	switch (runtime) {
		case "browser": return (await import("../turnkey__api-key-stamper.mjs").then((n) => n.t)).signWithApiKey(input);
		case "node": return (await import("../turnkey__api-key-stamper.mjs").then((n) => n.r)).signWithApiKey(input);
		case "purejs": return (await import("../turnkey__api-key-stamper.mjs").then((n) => n.n)).signWithApiKey(input);
		default: throw new Error(`Unsupported runtime: ${runtime}`);
	}
};
/**
* Stamper to use with `@turnkey/http`'s `TurnkeyClient`
*/
var ApiKeyStamper = class {
	constructor(config) {
		this.apiPublicKey = config.apiPublicKey;
		this.apiPrivateKey = config.apiPrivateKey;
		this.runtimeOverride = config.runtimeOverride;
	}
	async stamp(payload) {
		const signature = await signWithApiKey({
			publicKey: this.apiPublicKey,
			privateKey: this.apiPrivateKey,
			content: payload
		}, this.runtimeOverride);
		const stamp = {
			publicKey: this.apiPublicKey,
			scheme: "SIGNATURE_SCHEME_TK_API_P256",
			signature
		};
		return {
			stampHeaderName: stampHeaderName$2,
			stampHeaderValue: stringToBase64urlString(JSON.stringify(stamp))
		};
	}
};
var fetch = (/* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nodeFetch = (init_lib(), __toCommonJS(lib_exports));
	var realFetch = nodeFetch.default || nodeFetch;
	var fetch = function(url, options) {
		if (/^\/\//.test(url)) url = "https:" + url;
		return realFetch.call(this, url, options);
	};
	fetch.ponyfill = true;
	module.exports = exports = fetch;
	exports.fetch = fetch;
	exports.Headers = nodeFetch.Headers;
	exports.Request = nodeFetch.Request;
	exports.Response = nodeFetch.Response;
	exports.default = fetch;
})))(), 1)).fetch;
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+http@3.10.0/node_modules/@turnkey/http/dist/base.mjs
function isHttpClient(client) {
	return client?.name === "TurnkeyClient";
}
var TurnkeyRequestError = class extends Error {
	constructor(input) {
		let turnkeyErrorMessage = `Turnkey error ${input.code}: ${input.message}`;
		if (input.details != null) turnkeyErrorMessage += ` (Details: ${JSON.stringify(input.details)})`;
		super(turnkeyErrorMessage);
		this.name = "TurnkeyRequestError";
		this.details = input.details ?? null;
		this.code = input.code;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+http@3.10.0/node_modules/@turnkey/http/dist/version.mjs
var VERSION = "@turnkey/http@3.10.0";
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+http@3.10.0/node_modules/@turnkey/http/dist/__generated__/services/coordinator/public/v1/public_api.client.mjs
var TurnkeyClient = class {
	constructor(config, stamper) {
		this.name = "TurnkeyClient";
		/**
		* Get details about an activity.
		*
		* Sign the provided `TGetActivityBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_activity).
		*
		* See also {@link stampGetActivity}.
		*/
		this.getActivity = async (input) => {
			return this.request("/public/v1/query/get_activity", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetActivityBody` by using the client's `stamp` function.
		*
		* See also {@link GetActivity}.
		*/
		this.stampGetActivity = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_activity";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about an API key.
		*
		* Sign the provided `TGetApiKeyBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_api_key).
		*
		* See also {@link stampGetApiKey}.
		*/
		this.getApiKey = async (input) => {
			return this.request("/public/v1/query/get_api_key", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetApiKeyBody` by using the client's `stamp` function.
		*
		* See also {@link GetApiKey}.
		*/
		this.stampGetApiKey = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_api_key";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about API keys for a user.
		*
		* Sign the provided `TGetApiKeysBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_api_keys).
		*
		* See also {@link stampGetApiKeys}.
		*/
		this.getApiKeys = async (input) => {
			return this.request("/public/v1/query/get_api_keys", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetApiKeysBody` by using the client's `stamp` function.
		*
		* See also {@link GetApiKeys}.
		*/
		this.stampGetApiKeys = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_api_keys";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get the attestation document corresponding to an enclave.
		*
		* Sign the provided `TGetAttestationDocumentBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_attestation).
		*
		* See also {@link stampGetAttestationDocument}.
		*/
		this.getAttestationDocument = async (input) => {
			return this.request("/public/v1/query/get_attestation", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetAttestationDocumentBody` by using the client's `stamp` function.
		*
		* See also {@link GetAttestationDocument}.
		*/
		this.stampGetAttestationDocument = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_attestation";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about an authenticator.
		*
		* Sign the provided `TGetAuthenticatorBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_authenticator).
		*
		* See also {@link stampGetAuthenticator}.
		*/
		this.getAuthenticator = async (input) => {
			return this.request("/public/v1/query/get_authenticator", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetAuthenticatorBody` by using the client's `stamp` function.
		*
		* See also {@link GetAuthenticator}.
		*/
		this.stampGetAuthenticator = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_authenticator";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about authenticators for a user.
		*
		* Sign the provided `TGetAuthenticatorsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_authenticators).
		*
		* See also {@link stampGetAuthenticators}.
		*/
		this.getAuthenticators = async (input) => {
			return this.request("/public/v1/query/get_authenticators", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetAuthenticatorsBody` by using the client's `stamp` function.
		*
		* See also {@link GetAuthenticators}.
		*/
		this.stampGetAuthenticators = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_authenticators";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about Oauth providers for a user.
		*
		* Sign the provided `TGetOauthProvidersBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_oauth_providers).
		*
		* See also {@link stampGetOauthProviders}.
		*/
		this.getOauthProviders = async (input) => {
			return this.request("/public/v1/query/get_oauth_providers", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetOauthProvidersBody` by using the client's `stamp` function.
		*
		* See also {@link GetOauthProviders}.
		*/
		this.stampGetOauthProviders = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_oauth_providers";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about an organization.
		*
		* Sign the provided `TGetOrganizationBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_organization).
		*
		* See also {@link stampGetOrganization}.
		*/
		this.getOrganization = async (input) => {
			return this.request("/public/v1/query/get_organization", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetOrganizationBody` by using the client's `stamp` function.
		*
		* See also {@link GetOrganization}.
		*/
		this.stampGetOrganization = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_organization";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get quorum settings and features for an organization.
		*
		* Sign the provided `TGetOrganizationConfigsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_organization_configs).
		*
		* See also {@link stampGetOrganizationConfigs}.
		*/
		this.getOrganizationConfigs = async (input) => {
			return this.request("/public/v1/query/get_organization_configs", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetOrganizationConfigsBody` by using the client's `stamp` function.
		*
		* See also {@link GetOrganizationConfigs}.
		*/
		this.stampGetOrganizationConfigs = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_organization_configs";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about a policy.
		*
		* Sign the provided `TGetPolicyBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_policy).
		*
		* See also {@link stampGetPolicy}.
		*/
		this.getPolicy = async (input) => {
			return this.request("/public/v1/query/get_policy", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetPolicyBody` by using the client's `stamp` function.
		*
		* See also {@link GetPolicy}.
		*/
		this.stampGetPolicy = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_policy";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get the policy evaluations for an activity.
		*
		* Sign the provided `TGetPolicyEvaluationsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_policy_evaluations).
		*
		* See also {@link stampGetPolicyEvaluations}.
		*/
		this.getPolicyEvaluations = async (input) => {
			return this.request("/public/v1/query/get_policy_evaluations", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetPolicyEvaluationsBody` by using the client's `stamp` function.
		*
		* See also {@link GetPolicyEvaluations}.
		*/
		this.stampGetPolicyEvaluations = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_policy_evaluations";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about a private key.
		*
		* Sign the provided `TGetPrivateKeyBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_private_key).
		*
		* See also {@link stampGetPrivateKey}.
		*/
		this.getPrivateKey = async (input) => {
			return this.request("/public/v1/query/get_private_key", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetPrivateKeyBody` by using the client's `stamp` function.
		*
		* See also {@link GetPrivateKey}.
		*/
		this.stampGetPrivateKey = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_private_key";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about a smart contract interface.
		*
		* Sign the provided `TGetSmartContractInterfaceBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_smart_contract_interface).
		*
		* See also {@link stampGetSmartContractInterface}.
		*/
		this.getSmartContractInterface = async (input) => {
			return this.request("/public/v1/query/get_smart_contract_interface", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetSmartContractInterfaceBody` by using the client's `stamp` function.
		*
		* See also {@link GetSmartContractInterface}.
		*/
		this.stampGetSmartContractInterface = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_smart_contract_interface";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about a user.
		*
		* Sign the provided `TGetUserBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_user).
		*
		* See also {@link stampGetUser}.
		*/
		this.getUser = async (input) => {
			return this.request("/public/v1/query/get_user", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetUserBody` by using the client's `stamp` function.
		*
		* See also {@link GetUser}.
		*/
		this.stampGetUser = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_user";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get details about a wallet.
		*
		* Sign the provided `TGetWalletBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_wallet).
		*
		* See also {@link stampGetWallet}.
		*/
		this.getWallet = async (input) => {
			return this.request("/public/v1/query/get_wallet", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetWalletBody` by using the client's `stamp` function.
		*
		* See also {@link GetWallet}.
		*/
		this.stampGetWallet = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_wallet";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get a single wallet account.
		*
		* Sign the provided `TGetWalletAccountBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/get_wallet_account).
		*
		* See also {@link stampGetWalletAccount}.
		*/
		this.getWalletAccount = async (input) => {
			return this.request("/public/v1/query/get_wallet_account", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetWalletAccountBody` by using the client's `stamp` function.
		*
		* See also {@link GetWalletAccount}.
		*/
		this.stampGetWalletAccount = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/get_wallet_account";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all activities within an organization.
		*
		* Sign the provided `TGetActivitiesBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_activities).
		*
		* See also {@link stampGetActivities}.
		*/
		this.getActivities = async (input) => {
			return this.request("/public/v1/query/list_activities", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetActivitiesBody` by using the client's `stamp` function.
		*
		* See also {@link GetActivities}.
		*/
		this.stampGetActivities = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_activities";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all policies within an organization.
		*
		* Sign the provided `TGetPoliciesBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_policies).
		*
		* See also {@link stampGetPolicies}.
		*/
		this.getPolicies = async (input) => {
			return this.request("/public/v1/query/list_policies", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetPoliciesBody` by using the client's `stamp` function.
		*
		* See also {@link GetPolicies}.
		*/
		this.stampGetPolicies = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_policies";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all private key tags within an organization.
		*
		* Sign the provided `TListPrivateKeyTagsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_private_key_tags).
		*
		* See also {@link stampListPrivateKeyTags}.
		*/
		this.listPrivateKeyTags = async (input) => {
			return this.request("/public/v1/query/list_private_key_tags", input);
		};
		/**
		* Produce a `SignedRequest` from `TListPrivateKeyTagsBody` by using the client's `stamp` function.
		*
		* See also {@link ListPrivateKeyTags}.
		*/
		this.stampListPrivateKeyTags = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_private_key_tags";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all private keys within an organization.
		*
		* Sign the provided `TGetPrivateKeysBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_private_keys).
		*
		* See also {@link stampGetPrivateKeys}.
		*/
		this.getPrivateKeys = async (input) => {
			return this.request("/public/v1/query/list_private_keys", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetPrivateKeysBody` by using the client's `stamp` function.
		*
		* See also {@link GetPrivateKeys}.
		*/
		this.stampGetPrivateKeys = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_private_keys";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all smart contract interfaces within an organization.
		*
		* Sign the provided `TGetSmartContractInterfacesBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_smart_contract_interfaces).
		*
		* See also {@link stampGetSmartContractInterfaces}.
		*/
		this.getSmartContractInterfaces = async (input) => {
			return this.request("/public/v1/query/list_smart_contract_interfaces", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetSmartContractInterfacesBody` by using the client's `stamp` function.
		*
		* See also {@link GetSmartContractInterfaces}.
		*/
		this.stampGetSmartContractInterfaces = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_smart_contract_interfaces";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get all suborg IDs associated given a parent org ID and an optional filter.
		*
		* Sign the provided `TGetSubOrgIdsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_suborgs).
		*
		* See also {@link stampGetSubOrgIds}.
		*/
		this.getSubOrgIds = async (input) => {
			return this.request("/public/v1/query/list_suborgs", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetSubOrgIdsBody` by using the client's `stamp` function.
		*
		* See also {@link GetSubOrgIds}.
		*/
		this.stampGetSubOrgIds = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_suborgs";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all user tags within an organization.
		*
		* Sign the provided `TListUserTagsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_user_tags).
		*
		* See also {@link stampListUserTags}.
		*/
		this.listUserTags = async (input) => {
			return this.request("/public/v1/query/list_user_tags", input);
		};
		/**
		* Produce a `SignedRequest` from `TListUserTagsBody` by using the client's `stamp` function.
		*
		* See also {@link ListUserTags}.
		*/
		this.stampListUserTags = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_user_tags";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all users within an organization.
		*
		* Sign the provided `TGetUsersBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_users).
		*
		* See also {@link stampGetUsers}.
		*/
		this.getUsers = async (input) => {
			return this.request("/public/v1/query/list_users", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetUsersBody` by using the client's `stamp` function.
		*
		* See also {@link GetUsers}.
		*/
		this.stampGetUsers = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_users";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get all email or phone verified suborg IDs associated given a parent org ID.
		*
		* Sign the provided `TGetVerifiedSubOrgIdsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_verified_suborgs).
		*
		* See also {@link stampGetVerifiedSubOrgIds}.
		*/
		this.getVerifiedSubOrgIds = async (input) => {
			return this.request("/public/v1/query/list_verified_suborgs", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetVerifiedSubOrgIdsBody` by using the client's `stamp` function.
		*
		* See also {@link GetVerifiedSubOrgIds}.
		*/
		this.stampGetVerifiedSubOrgIds = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_verified_suborgs";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all accounts within a wallet.
		*
		* Sign the provided `TGetWalletAccountsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_wallet_accounts).
		*
		* See also {@link stampGetWalletAccounts}.
		*/
		this.getWalletAccounts = async (input) => {
			return this.request("/public/v1/query/list_wallet_accounts", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetWalletAccountsBody` by using the client's `stamp` function.
		*
		* See also {@link GetWalletAccounts}.
		*/
		this.stampGetWalletAccounts = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_wallet_accounts";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* List all wallets within an organization.
		*
		* Sign the provided `TGetWalletsBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/list_wallets).
		*
		* See also {@link stampGetWallets}.
		*/
		this.getWallets = async (input) => {
			return this.request("/public/v1/query/list_wallets", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetWalletsBody` by using the client's `stamp` function.
		*
		* See also {@link GetWallets}.
		*/
		this.stampGetWallets = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/list_wallets";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Get basic information about your current API or WebAuthN user and their organization. Affords sub-organization look ups via parent organization for WebAuthN or API key users.
		*
		* Sign the provided `TGetWhoamiBody` with the client's `stamp` function, and submit the request (POST /public/v1/query/whoami).
		*
		* See also {@link stampGetWhoami}.
		*/
		this.getWhoami = async (input) => {
			return this.request("/public/v1/query/whoami", input);
		};
		/**
		* Produce a `SignedRequest` from `TGetWhoamiBody` by using the client's `stamp` function.
		*
		* See also {@link GetWhoami}.
		*/
		this.stampGetWhoami = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/query/whoami";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Approve an activity.
		*
		* Sign the provided `TApproveActivityBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/approve_activity).
		*
		* See also {@link stampApproveActivity}.
		*/
		this.approveActivity = async (input) => {
			return this.request("/public/v1/submit/approve_activity", input);
		};
		/**
		* Produce a `SignedRequest` from `TApproveActivityBody` by using the client's `stamp` function.
		*
		* See also {@link ApproveActivity}.
		*/
		this.stampApproveActivity = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/approve_activity";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Add API keys to an existing user.
		*
		* Sign the provided `TCreateApiKeysBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_api_keys).
		*
		* See also {@link stampCreateApiKeys}.
		*/
		this.createApiKeys = async (input) => {
			return this.request("/public/v1/submit/create_api_keys", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateApiKeysBody` by using the client's `stamp` function.
		*
		* See also {@link CreateApiKeys}.
		*/
		this.stampCreateApiKeys = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_api_keys";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create API-only users in an existing organization.
		*
		* Sign the provided `TCreateApiOnlyUsersBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_api_only_users).
		*
		* See also {@link stampCreateApiOnlyUsers}.
		*/
		this.createApiOnlyUsers = async (input) => {
			return this.request("/public/v1/submit/create_api_only_users", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateApiOnlyUsersBody` by using the client's `stamp` function.
		*
		* See also {@link CreateApiOnlyUsers}.
		*/
		this.stampCreateApiOnlyUsers = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_api_only_users";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create authenticators to authenticate requests to Turnkey.
		*
		* Sign the provided `TCreateAuthenticatorsBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_authenticators).
		*
		* See also {@link stampCreateAuthenticators}.
		*/
		this.createAuthenticators = async (input) => {
			return this.request("/public/v1/submit/create_authenticators", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateAuthenticatorsBody` by using the client's `stamp` function.
		*
		* See also {@link CreateAuthenticators}.
		*/
		this.stampCreateAuthenticators = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_authenticators";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create invitations to join an existing organization.
		*
		* Sign the provided `TCreateInvitationsBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_invitations).
		*
		* See also {@link stampCreateInvitations}.
		*/
		this.createInvitations = async (input) => {
			return this.request("/public/v1/submit/create_invitations", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateInvitationsBody` by using the client's `stamp` function.
		*
		* See also {@link CreateInvitations}.
		*/
		this.stampCreateInvitations = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_invitations";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create Oauth providers for a specified user.
		*
		* Sign the provided `TCreateOauthProvidersBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_oauth_providers).
		*
		* See also {@link stampCreateOauthProviders}.
		*/
		this.createOauthProviders = async (input) => {
			return this.request("/public/v1/submit/create_oauth_providers", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateOauthProvidersBody` by using the client's `stamp` function.
		*
		* See also {@link CreateOauthProviders}.
		*/
		this.stampCreateOauthProviders = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_oauth_providers";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create new policies.
		*
		* Sign the provided `TCreatePoliciesBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_policies).
		*
		* See also {@link stampCreatePolicies}.
		*/
		this.createPolicies = async (input) => {
			return this.request("/public/v1/submit/create_policies", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreatePoliciesBody` by using the client's `stamp` function.
		*
		* See also {@link CreatePolicies}.
		*/
		this.stampCreatePolicies = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_policies";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create a new policy.
		*
		* Sign the provided `TCreatePolicyBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_policy).
		*
		* See also {@link stampCreatePolicy}.
		*/
		this.createPolicy = async (input) => {
			return this.request("/public/v1/submit/create_policy", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreatePolicyBody` by using the client's `stamp` function.
		*
		* See also {@link CreatePolicy}.
		*/
		this.stampCreatePolicy = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_policy";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create a private key tag and add it to private keys.
		*
		* Sign the provided `TCreatePrivateKeyTagBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_private_key_tag).
		*
		* See also {@link stampCreatePrivateKeyTag}.
		*/
		this.createPrivateKeyTag = async (input) => {
			return this.request("/public/v1/submit/create_private_key_tag", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreatePrivateKeyTagBody` by using the client's `stamp` function.
		*
		* See also {@link CreatePrivateKeyTag}.
		*/
		this.stampCreatePrivateKeyTag = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_private_key_tag";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create new private keys.
		*
		* Sign the provided `TCreatePrivateKeysBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_private_keys).
		*
		* See also {@link stampCreatePrivateKeys}.
		*/
		this.createPrivateKeys = async (input) => {
			return this.request("/public/v1/submit/create_private_keys", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreatePrivateKeysBody` by using the client's `stamp` function.
		*
		* See also {@link CreatePrivateKeys}.
		*/
		this.stampCreatePrivateKeys = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_private_keys";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create a read only session for a user (valid for 1 hour).
		*
		* Sign the provided `TCreateReadOnlySessionBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_read_only_session).
		*
		* See also {@link stampCreateReadOnlySession}.
		*/
		this.createReadOnlySession = async (input) => {
			return this.request("/public/v1/submit/create_read_only_session", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateReadOnlySessionBody` by using the client's `stamp` function.
		*
		* See also {@link CreateReadOnlySession}.
		*/
		this.stampCreateReadOnlySession = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_read_only_session";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create a read write session for a user.
		*
		* Sign the provided `TCreateReadWriteSessionBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_read_write_session).
		*
		* See also {@link stampCreateReadWriteSession}.
		*/
		this.createReadWriteSession = async (input) => {
			return this.request("/public/v1/submit/create_read_write_session", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateReadWriteSessionBody` by using the client's `stamp` function.
		*
		* See also {@link CreateReadWriteSession}.
		*/
		this.stampCreateReadWriteSession = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_read_write_session";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create an ABI/IDL in JSON.
		*
		* Sign the provided `TCreateSmartContractInterfaceBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_smart_contract_interface).
		*
		* See also {@link stampCreateSmartContractInterface}.
		*/
		this.createSmartContractInterface = async (input) => {
			return this.request("/public/v1/submit/create_smart_contract_interface", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateSmartContractInterfaceBody` by using the client's `stamp` function.
		*
		* See also {@link CreateSmartContractInterface}.
		*/
		this.stampCreateSmartContractInterface = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_smart_contract_interface";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create a new sub-organization.
		*
		* Sign the provided `TCreateSubOrganizationBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_sub_organization).
		*
		* See also {@link stampCreateSubOrganization}.
		*/
		this.createSubOrganization = async (input) => {
			return this.request("/public/v1/submit/create_sub_organization", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateSubOrganizationBody` by using the client's `stamp` function.
		*
		* See also {@link CreateSubOrganization}.
		*/
		this.stampCreateSubOrganization = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_sub_organization";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create a user tag and add it to users.
		*
		* Sign the provided `TCreateUserTagBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_user_tag).
		*
		* See also {@link stampCreateUserTag}.
		*/
		this.createUserTag = async (input) => {
			return this.request("/public/v1/submit/create_user_tag", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateUserTagBody` by using the client's `stamp` function.
		*
		* See also {@link CreateUserTag}.
		*/
		this.stampCreateUserTag = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_user_tag";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create users in an existing organization.
		*
		* Sign the provided `TCreateUsersBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_users).
		*
		* See also {@link stampCreateUsers}.
		*/
		this.createUsers = async (input) => {
			return this.request("/public/v1/submit/create_users", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateUsersBody` by using the client's `stamp` function.
		*
		* See also {@link CreateUsers}.
		*/
		this.stampCreateUsers = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_users";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create a wallet and derive addresses.
		*
		* Sign the provided `TCreateWalletBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_wallet).
		*
		* See also {@link stampCreateWallet}.
		*/
		this.createWallet = async (input) => {
			return this.request("/public/v1/submit/create_wallet", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateWalletBody` by using the client's `stamp` function.
		*
		* See also {@link CreateWallet}.
		*/
		this.stampCreateWallet = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_wallet";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Derive additional addresses using an existing wallet.
		*
		* Sign the provided `TCreateWalletAccountsBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/create_wallet_accounts).
		*
		* See also {@link stampCreateWalletAccounts}.
		*/
		this.createWalletAccounts = async (input) => {
			return this.request("/public/v1/submit/create_wallet_accounts", input);
		};
		/**
		* Produce a `SignedRequest` from `TCreateWalletAccountsBody` by using the client's `stamp` function.
		*
		* See also {@link CreateWalletAccounts}.
		*/
		this.stampCreateWalletAccounts = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/create_wallet_accounts";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Remove api keys from a user.
		*
		* Sign the provided `TDeleteApiKeysBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_api_keys).
		*
		* See also {@link stampDeleteApiKeys}.
		*/
		this.deleteApiKeys = async (input) => {
			return this.request("/public/v1/submit/delete_api_keys", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteApiKeysBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteApiKeys}.
		*/
		this.stampDeleteApiKeys = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_api_keys";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Remove authenticators from a user.
		*
		* Sign the provided `TDeleteAuthenticatorsBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_authenticators).
		*
		* See also {@link stampDeleteAuthenticators}.
		*/
		this.deleteAuthenticators = async (input) => {
			return this.request("/public/v1/submit/delete_authenticators", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteAuthenticatorsBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteAuthenticators}.
		*/
		this.stampDeleteAuthenticators = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_authenticators";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete an existing invitation.
		*
		* Sign the provided `TDeleteInvitationBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_invitation).
		*
		* See also {@link stampDeleteInvitation}.
		*/
		this.deleteInvitation = async (input) => {
			return this.request("/public/v1/submit/delete_invitation", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteInvitationBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteInvitation}.
		*/
		this.stampDeleteInvitation = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_invitation";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Remove Oauth providers for a specified user.
		*
		* Sign the provided `TDeleteOauthProvidersBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_oauth_providers).
		*
		* See also {@link stampDeleteOauthProviders}.
		*/
		this.deleteOauthProviders = async (input) => {
			return this.request("/public/v1/submit/delete_oauth_providers", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteOauthProvidersBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteOauthProviders}.
		*/
		this.stampDeleteOauthProviders = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_oauth_providers";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete an existing policy.
		*
		* Sign the provided `TDeletePolicyBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_policy).
		*
		* See also {@link stampDeletePolicy}.
		*/
		this.deletePolicy = async (input) => {
			return this.request("/public/v1/submit/delete_policy", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeletePolicyBody` by using the client's `stamp` function.
		*
		* See also {@link DeletePolicy}.
		*/
		this.stampDeletePolicy = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_policy";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete private key tags within an organization.
		*
		* Sign the provided `TDeletePrivateKeyTagsBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_private_key_tags).
		*
		* See also {@link stampDeletePrivateKeyTags}.
		*/
		this.deletePrivateKeyTags = async (input) => {
			return this.request("/public/v1/submit/delete_private_key_tags", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeletePrivateKeyTagsBody` by using the client's `stamp` function.
		*
		* See also {@link DeletePrivateKeyTags}.
		*/
		this.stampDeletePrivateKeyTags = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_private_key_tags";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete private keys for an organization.
		*
		* Sign the provided `TDeletePrivateKeysBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_private_keys).
		*
		* See also {@link stampDeletePrivateKeys}.
		*/
		this.deletePrivateKeys = async (input) => {
			return this.request("/public/v1/submit/delete_private_keys", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeletePrivateKeysBody` by using the client's `stamp` function.
		*
		* See also {@link DeletePrivateKeys}.
		*/
		this.stampDeletePrivateKeys = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_private_keys";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete a smart contract interface.
		*
		* Sign the provided `TDeleteSmartContractInterfaceBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_smart_contract_interface).
		*
		* See also {@link stampDeleteSmartContractInterface}.
		*/
		this.deleteSmartContractInterface = async (input) => {
			return this.request("/public/v1/submit/delete_smart_contract_interface", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteSmartContractInterfaceBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteSmartContractInterface}.
		*/
		this.stampDeleteSmartContractInterface = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_smart_contract_interface";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete a sub-organization.
		*
		* Sign the provided `TDeleteSubOrganizationBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_sub_organization).
		*
		* See also {@link stampDeleteSubOrganization}.
		*/
		this.deleteSubOrganization = async (input) => {
			return this.request("/public/v1/submit/delete_sub_organization", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteSubOrganizationBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteSubOrganization}.
		*/
		this.stampDeleteSubOrganization = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_sub_organization";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete user tags within an organization.
		*
		* Sign the provided `TDeleteUserTagsBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_user_tags).
		*
		* See also {@link stampDeleteUserTags}.
		*/
		this.deleteUserTags = async (input) => {
			return this.request("/public/v1/submit/delete_user_tags", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteUserTagsBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteUserTags}.
		*/
		this.stampDeleteUserTags = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_user_tags";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete users within an organization.
		*
		* Sign the provided `TDeleteUsersBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_users).
		*
		* See also {@link stampDeleteUsers}.
		*/
		this.deleteUsers = async (input) => {
			return this.request("/public/v1/submit/delete_users", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteUsersBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteUsers}.
		*/
		this.stampDeleteUsers = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_users";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Delete wallets for an organization.
		*
		* Sign the provided `TDeleteWalletsBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/delete_wallets).
		*
		* See also {@link stampDeleteWallets}.
		*/
		this.deleteWallets = async (input) => {
			return this.request("/public/v1/submit/delete_wallets", input);
		};
		/**
		* Produce a `SignedRequest` from `TDeleteWalletsBody` by using the client's `stamp` function.
		*
		* See also {@link DeleteWallets}.
		*/
		this.stampDeleteWallets = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/delete_wallets";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Authenticate a user via email.
		*
		* Sign the provided `TEmailAuthBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/email_auth).
		*
		* See also {@link stampEmailAuth}.
		*/
		this.emailAuth = async (input) => {
			return this.request("/public/v1/submit/email_auth", input);
		};
		/**
		* Produce a `SignedRequest` from `TEmailAuthBody` by using the client's `stamp` function.
		*
		* See also {@link EmailAuth}.
		*/
		this.stampEmailAuth = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/email_auth";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Export a private key.
		*
		* Sign the provided `TExportPrivateKeyBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/export_private_key).
		*
		* See also {@link stampExportPrivateKey}.
		*/
		this.exportPrivateKey = async (input) => {
			return this.request("/public/v1/submit/export_private_key", input);
		};
		/**
		* Produce a `SignedRequest` from `TExportPrivateKeyBody` by using the client's `stamp` function.
		*
		* See also {@link ExportPrivateKey}.
		*/
		this.stampExportPrivateKey = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/export_private_key";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Export a wallet.
		*
		* Sign the provided `TExportWalletBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/export_wallet).
		*
		* See also {@link stampExportWallet}.
		*/
		this.exportWallet = async (input) => {
			return this.request("/public/v1/submit/export_wallet", input);
		};
		/**
		* Produce a `SignedRequest` from `TExportWalletBody` by using the client's `stamp` function.
		*
		* See also {@link ExportWallet}.
		*/
		this.stampExportWallet = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/export_wallet";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Export a wallet account.
		*
		* Sign the provided `TExportWalletAccountBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/export_wallet_account).
		*
		* See also {@link stampExportWalletAccount}.
		*/
		this.exportWalletAccount = async (input) => {
			return this.request("/public/v1/submit/export_wallet_account", input);
		};
		/**
		* Produce a `SignedRequest` from `TExportWalletAccountBody` by using the client's `stamp` function.
		*
		* See also {@link ExportWalletAccount}.
		*/
		this.stampExportWalletAccount = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/export_wallet_account";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Import a private key.
		*
		* Sign the provided `TImportPrivateKeyBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/import_private_key).
		*
		* See also {@link stampImportPrivateKey}.
		*/
		this.importPrivateKey = async (input) => {
			return this.request("/public/v1/submit/import_private_key", input);
		};
		/**
		* Produce a `SignedRequest` from `TImportPrivateKeyBody` by using the client's `stamp` function.
		*
		* See also {@link ImportPrivateKey}.
		*/
		this.stampImportPrivateKey = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/import_private_key";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Import a wallet.
		*
		* Sign the provided `TImportWalletBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/import_wallet).
		*
		* See also {@link stampImportWallet}.
		*/
		this.importWallet = async (input) => {
			return this.request("/public/v1/submit/import_wallet", input);
		};
		/**
		* Produce a `SignedRequest` from `TImportWalletBody` by using the client's `stamp` function.
		*
		* See also {@link ImportWallet}.
		*/
		this.stampImportWallet = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/import_wallet";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Initiate a fiat on ramp flow.
		*
		* Sign the provided `TInitFiatOnRampBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/init_fiat_on_ramp).
		*
		* See also {@link stampInitFiatOnRamp}.
		*/
		this.initFiatOnRamp = async (input) => {
			return this.request("/public/v1/submit/init_fiat_on_ramp", input);
		};
		/**
		* Produce a `SignedRequest` from `TInitFiatOnRampBody` by using the client's `stamp` function.
		*
		* See also {@link InitFiatOnRamp}.
		*/
		this.stampInitFiatOnRamp = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/init_fiat_on_ramp";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Initialize a new private key import.
		*
		* Sign the provided `TInitImportPrivateKeyBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/init_import_private_key).
		*
		* See also {@link stampInitImportPrivateKey}.
		*/
		this.initImportPrivateKey = async (input) => {
			return this.request("/public/v1/submit/init_import_private_key", input);
		};
		/**
		* Produce a `SignedRequest` from `TInitImportPrivateKeyBody` by using the client's `stamp` function.
		*
		* See also {@link InitImportPrivateKey}.
		*/
		this.stampInitImportPrivateKey = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/init_import_private_key";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Initialize a new wallet import.
		*
		* Sign the provided `TInitImportWalletBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/init_import_wallet).
		*
		* See also {@link stampInitImportWallet}.
		*/
		this.initImportWallet = async (input) => {
			return this.request("/public/v1/submit/init_import_wallet", input);
		};
		/**
		* Produce a `SignedRequest` from `TInitImportWalletBody` by using the client's `stamp` function.
		*
		* See also {@link InitImportWallet}.
		*/
		this.stampInitImportWallet = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/init_import_wallet";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Initiate a generic OTP activity.
		*
		* Sign the provided `TInitOtpBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/init_otp).
		*
		* See also {@link stampInitOtp}.
		*/
		this.initOtp = async (input) => {
			return this.request("/public/v1/submit/init_otp", input);
		};
		/**
		* Produce a `SignedRequest` from `TInitOtpBody` by using the client's `stamp` function.
		*
		* See also {@link InitOtp}.
		*/
		this.stampInitOtp = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/init_otp";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Initiate an OTP auth activity.
		*
		* Sign the provided `TInitOtpAuthBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/init_otp_auth).
		*
		* See also {@link stampInitOtpAuth}.
		*/
		this.initOtpAuth = async (input) => {
			return this.request("/public/v1/submit/init_otp_auth", input);
		};
		/**
		* Produce a `SignedRequest` from `TInitOtpAuthBody` by using the client's `stamp` function.
		*
		* See also {@link InitOtpAuth}.
		*/
		this.stampInitOtpAuth = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/init_otp_auth";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Initialize a new email recovery.
		*
		* Sign the provided `TInitUserEmailRecoveryBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/init_user_email_recovery).
		*
		* See also {@link stampInitUserEmailRecovery}.
		*/
		this.initUserEmailRecovery = async (input) => {
			return this.request("/public/v1/submit/init_user_email_recovery", input);
		};
		/**
		* Produce a `SignedRequest` from `TInitUserEmailRecoveryBody` by using the client's `stamp` function.
		*
		* See also {@link InitUserEmailRecovery}.
		*/
		this.stampInitUserEmailRecovery = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/init_user_email_recovery";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Authenticate a user with an OIDC token (Oauth).
		*
		* Sign the provided `TOauthBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/oauth).
		*
		* See also {@link stampOauth}.
		*/
		this.oauth = async (input) => {
			return this.request("/public/v1/submit/oauth", input);
		};
		/**
		* Produce a `SignedRequest` from `TOauthBody` by using the client's `stamp` function.
		*
		* See also {@link Oauth}.
		*/
		this.stampOauth = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/oauth";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create an Oauth session for a user.
		*
		* Sign the provided `TOauthLoginBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/oauth_login).
		*
		* See also {@link stampOauthLogin}.
		*/
		this.oauthLogin = async (input) => {
			return this.request("/public/v1/submit/oauth_login", input);
		};
		/**
		* Produce a `SignedRequest` from `TOauthLoginBody` by using the client's `stamp` function.
		*
		* See also {@link OauthLogin}.
		*/
		this.stampOauthLogin = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/oauth_login";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Authenticate a user with an OTP code sent via email or SMS.
		*
		* Sign the provided `TOtpAuthBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/otp_auth).
		*
		* See also {@link stampOtpAuth}.
		*/
		this.otpAuth = async (input) => {
			return this.request("/public/v1/submit/otp_auth", input);
		};
		/**
		* Produce a `SignedRequest` from `TOtpAuthBody` by using the client's `stamp` function.
		*
		* See also {@link OtpAuth}.
		*/
		this.stampOtpAuth = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/otp_auth";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create an OTP session for a user.
		*
		* Sign the provided `TOtpLoginBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/otp_login).
		*
		* See also {@link stampOtpLogin}.
		*/
		this.otpLogin = async (input) => {
			return this.request("/public/v1/submit/otp_login", input);
		};
		/**
		* Produce a `SignedRequest` from `TOtpLoginBody` by using the client's `stamp` function.
		*
		* See also {@link OtpLogin}.
		*/
		this.stampOtpLogin = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/otp_login";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Complete the process of recovering a user by adding an authenticator.
		*
		* Sign the provided `TRecoverUserBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/recover_user).
		*
		* See also {@link stampRecoverUser}.
		*/
		this.recoverUser = async (input) => {
			return this.request("/public/v1/submit/recover_user", input);
		};
		/**
		* Produce a `SignedRequest` from `TRecoverUserBody` by using the client's `stamp` function.
		*
		* See also {@link RecoverUser}.
		*/
		this.stampRecoverUser = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/recover_user";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Reject an activity.
		*
		* Sign the provided `TRejectActivityBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/reject_activity).
		*
		* See also {@link stampRejectActivity}.
		*/
		this.rejectActivity = async (input) => {
			return this.request("/public/v1/submit/reject_activity", input);
		};
		/**
		* Produce a `SignedRequest` from `TRejectActivityBody` by using the client's `stamp` function.
		*
		* See also {@link RejectActivity}.
		*/
		this.stampRejectActivity = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/reject_activity";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Remove an organization feature. This activity must be approved by the current root quorum.
		*
		* Sign the provided `TRemoveOrganizationFeatureBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/remove_organization_feature).
		*
		* See also {@link stampRemoveOrganizationFeature}.
		*/
		this.removeOrganizationFeature = async (input) => {
			return this.request("/public/v1/submit/remove_organization_feature", input);
		};
		/**
		* Produce a `SignedRequest` from `TRemoveOrganizationFeatureBody` by using the client's `stamp` function.
		*
		* See also {@link RemoveOrganizationFeature}.
		*/
		this.stampRemoveOrganizationFeature = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/remove_organization_feature";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Set an organization feature. This activity must be approved by the current root quorum.
		*
		* Sign the provided `TSetOrganizationFeatureBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/set_organization_feature).
		*
		* See also {@link stampSetOrganizationFeature}.
		*/
		this.setOrganizationFeature = async (input) => {
			return this.request("/public/v1/submit/set_organization_feature", input);
		};
		/**
		* Produce a `SignedRequest` from `TSetOrganizationFeatureBody` by using the client's `stamp` function.
		*
		* See also {@link SetOrganizationFeature}.
		*/
		this.stampSetOrganizationFeature = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/set_organization_feature";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Sign a raw payload.
		*
		* Sign the provided `TSignRawPayloadBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/sign_raw_payload).
		*
		* See also {@link stampSignRawPayload}.
		*/
		this.signRawPayload = async (input) => {
			return this.request("/public/v1/submit/sign_raw_payload", input);
		};
		/**
		* Produce a `SignedRequest` from `TSignRawPayloadBody` by using the client's `stamp` function.
		*
		* See also {@link SignRawPayload}.
		*/
		this.stampSignRawPayload = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/sign_raw_payload";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Sign multiple raw payloads with the same signing parameters.
		*
		* Sign the provided `TSignRawPayloadsBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/sign_raw_payloads).
		*
		* See also {@link stampSignRawPayloads}.
		*/
		this.signRawPayloads = async (input) => {
			return this.request("/public/v1/submit/sign_raw_payloads", input);
		};
		/**
		* Produce a `SignedRequest` from `TSignRawPayloadsBody` by using the client's `stamp` function.
		*
		* See also {@link SignRawPayloads}.
		*/
		this.stampSignRawPayloads = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/sign_raw_payloads";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Sign a transaction.
		*
		* Sign the provided `TSignTransactionBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/sign_transaction).
		*
		* See also {@link stampSignTransaction}.
		*/
		this.signTransaction = async (input) => {
			return this.request("/public/v1/submit/sign_transaction", input);
		};
		/**
		* Produce a `SignedRequest` from `TSignTransactionBody` by using the client's `stamp` function.
		*
		* See also {@link SignTransaction}.
		*/
		this.stampSignTransaction = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/sign_transaction";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Create a session for a user through stamping client side (API key, wallet client, or passkey client).
		*
		* Sign the provided `TStampLoginBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/stamp_login).
		*
		* See also {@link stampStampLogin}.
		*/
		this.stampLogin = async (input) => {
			return this.request("/public/v1/submit/stamp_login", input);
		};
		/**
		* Produce a `SignedRequest` from `TStampLoginBody` by using the client's `stamp` function.
		*
		* See also {@link StampLogin}.
		*/
		this.stampStampLogin = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/stamp_login";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Update an existing policy.
		*
		* Sign the provided `TUpdatePolicyBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_policy).
		*
		* See also {@link stampUpdatePolicy}.
		*/
		this.updatePolicy = async (input) => {
			return this.request("/public/v1/submit/update_policy", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdatePolicyBody` by using the client's `stamp` function.
		*
		* See also {@link UpdatePolicy}.
		*/
		this.stampUpdatePolicy = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_policy";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Update human-readable name or associated private keys. Note that this activity is atomic: all of the updates will succeed at once, or all of them will fail.
		*
		* Sign the provided `TUpdatePrivateKeyTagBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_private_key_tag).
		*
		* See also {@link stampUpdatePrivateKeyTag}.
		*/
		this.updatePrivateKeyTag = async (input) => {
			return this.request("/public/v1/submit/update_private_key_tag", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdatePrivateKeyTagBody` by using the client's `stamp` function.
		*
		* See also {@link UpdatePrivateKeyTag}.
		*/
		this.stampUpdatePrivateKeyTag = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_private_key_tag";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Set the threshold and members of the root quorum. This activity must be approved by the current root quorum.
		*
		* Sign the provided `TUpdateRootQuorumBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_root_quorum).
		*
		* See also {@link stampUpdateRootQuorum}.
		*/
		this.updateRootQuorum = async (input) => {
			return this.request("/public/v1/submit/update_root_quorum", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdateRootQuorumBody` by using the client's `stamp` function.
		*
		* See also {@link UpdateRootQuorum}.
		*/
		this.stampUpdateRootQuorum = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_root_quorum";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Update a user in an existing organization.
		*
		* Sign the provided `TUpdateUserBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_user).
		*
		* See also {@link stampUpdateUser}.
		*/
		this.updateUser = async (input) => {
			return this.request("/public/v1/submit/update_user", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdateUserBody` by using the client's `stamp` function.
		*
		* See also {@link UpdateUser}.
		*/
		this.stampUpdateUser = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_user";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Update a user's email in an existing organization.
		*
		* Sign the provided `TUpdateUserEmailBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_user_email).
		*
		* See also {@link stampUpdateUserEmail}.
		*/
		this.updateUserEmail = async (input) => {
			return this.request("/public/v1/submit/update_user_email", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdateUserEmailBody` by using the client's `stamp` function.
		*
		* See also {@link UpdateUserEmail}.
		*/
		this.stampUpdateUserEmail = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_user_email";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Update a user's name in an existing organization.
		*
		* Sign the provided `TUpdateUserNameBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_user_name).
		*
		* See also {@link stampUpdateUserName}.
		*/
		this.updateUserName = async (input) => {
			return this.request("/public/v1/submit/update_user_name", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdateUserNameBody` by using the client's `stamp` function.
		*
		* See also {@link UpdateUserName}.
		*/
		this.stampUpdateUserName = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_user_name";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Update a user's phone number in an existing organization.
		*
		* Sign the provided `TUpdateUserPhoneNumberBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_user_phone_number).
		*
		* See also {@link stampUpdateUserPhoneNumber}.
		*/
		this.updateUserPhoneNumber = async (input) => {
			return this.request("/public/v1/submit/update_user_phone_number", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdateUserPhoneNumberBody` by using the client's `stamp` function.
		*
		* See also {@link UpdateUserPhoneNumber}.
		*/
		this.stampUpdateUserPhoneNumber = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_user_phone_number";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Update human-readable name or associated users. Note that this activity is atomic: all of the updates will succeed at once, or all of them will fail.
		*
		* Sign the provided `TUpdateUserTagBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_user_tag).
		*
		* See also {@link stampUpdateUserTag}.
		*/
		this.updateUserTag = async (input) => {
			return this.request("/public/v1/submit/update_user_tag", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdateUserTagBody` by using the client's `stamp` function.
		*
		* See also {@link UpdateUserTag}.
		*/
		this.stampUpdateUserTag = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_user_tag";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Update a wallet for an organization.
		*
		* Sign the provided `TUpdateWalletBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/update_wallet).
		*
		* See also {@link stampUpdateWallet}.
		*/
		this.updateWallet = async (input) => {
			return this.request("/public/v1/submit/update_wallet", input);
		};
		/**
		* Produce a `SignedRequest` from `TUpdateWalletBody` by using the client's `stamp` function.
		*
		* See also {@link UpdateWallet}.
		*/
		this.stampUpdateWallet = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/update_wallet";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Verify a generic OTP.
		*
		* Sign the provided `TVerifyOtpBody` with the client's `stamp` function, and submit the request (POST /public/v1/submit/verify_otp).
		*
		* See also {@link stampVerifyOtp}.
		*/
		this.verifyOtp = async (input) => {
			return this.request("/public/v1/submit/verify_otp", input);
		};
		/**
		* Produce a `SignedRequest` from `TVerifyOtpBody` by using the client's `stamp` function.
		*
		* See also {@link VerifyOtp}.
		*/
		this.stampVerifyOtp = async (input) => {
			const fullUrl = this.config.baseUrl + "/public/v1/submit/verify_otp";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		/**
		* Set a rate local rate limit just on the current endpoint, for purposes of testing with Vivosuite.
		*
		* Sign the provided `TTestRateLimitsBody` with the client's `stamp` function, and submit the request (POST /tkhq/api/v1/test_rate_limits).
		*
		* See also {@link stampTestRateLimits}.
		*/
		this.testRateLimits = async (input) => {
			return this.request("/tkhq/api/v1/test_rate_limits", input);
		};
		/**
		* Produce a `SignedRequest` from `TTestRateLimitsBody` by using the client's `stamp` function.
		*
		* See also {@link TestRateLimits}.
		*/
		this.stampTestRateLimits = async (input) => {
			const fullUrl = this.config.baseUrl + "/tkhq/api/v1/test_rate_limits";
			const body = JSON.stringify(input);
			return {
				body,
				stamp: await this.stamper.stamp(body),
				url: fullUrl
			};
		};
		if (!config.baseUrl) throw new Error(`Missing base URL. Please verify env vars.`);
		this.config = config;
		this.stamper = stamper;
	}
	async request(url, body) {
		const fullUrl = this.config.baseUrl + url;
		const stringifiedBody = JSON.stringify(body);
		const stamp = await this.stamper.stamp(stringifiedBody);
		const response = await fetch(fullUrl, {
			method: "POST",
			headers: {
				[stamp.stampHeaderName]: stamp.stampHeaderValue,
				"X-Client-Version": VERSION
			},
			body: stringifiedBody,
			redirect: "follow"
		});
		if (!response.ok) {
			let res;
			try {
				res = await response.json();
			} catch (_) {
				throw new Error(`${response.status} ${response.statusText}`);
			}
			throw new TurnkeyRequestError(res);
		}
		return await response.json();
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+iframe-stamper@2.5.0/node_modules/@turnkey/iframe-stamper/dist/index.mjs
var stampHeaderName$1 = "X-Stamp";
var IframeEventType;
(function(IframeEventType) {
	IframeEventType["PublicKeyReady"] = "PUBLIC_KEY_READY";
	IframeEventType["InjectCredentialBundle"] = "INJECT_CREDENTIAL_BUNDLE";
	IframeEventType["InjectKeyExportBundle"] = "INJECT_KEY_EXPORT_BUNDLE";
	IframeEventType["InjectWalletExportBundle"] = "INJECT_WALLET_EXPORT_BUNDLE";
	IframeEventType["InjectImportBundle"] = "INJECT_IMPORT_BUNDLE";
	IframeEventType["ExtractWalletEncryptedBundle"] = "EXTRACT_WALLET_ENCRYPTED_BUNDLE";
	IframeEventType["ExtractKeyEncryptedBundle"] = "EXTRACT_KEY_ENCRYPTED_BUNDLE";
	IframeEventType["ApplySettings"] = "APPLY_SETTINGS";
	IframeEventType["BundleInjected"] = "BUNDLE_INJECTED";
	IframeEventType["EncryptedBundleExtracted"] = "ENCRYPTED_BUNDLE_EXTRACTED";
	IframeEventType["SettingsApplied"] = "SETTINGS_APPLIED";
	IframeEventType["StampRequest"] = "STAMP_REQUEST";
	IframeEventType["Stamp"] = "STAMP";
	IframeEventType["TurnkeyInitMessageChannel"] = "TURNKEY_INIT_MESSAGE_CHANNEL";
	IframeEventType["GetEmbeddedPublicKey"] = "GET_EMBEDDED_PUBLIC_KEY";
	IframeEventType["ClearEmbeddedKey"] = "RESET_EMBEDDED_KEY";
	IframeEventType["InitEmbeddedKey"] = "INIT_EMBEDDED_KEY";
	IframeEventType["Error"] = "ERROR";
})(IframeEventType || (IframeEventType = {}));
var KeyFormat;
(function(KeyFormat) {
	KeyFormat["Hexadecimal"] = "HEXADECIMAL";
	KeyFormat["Solana"] = "SOLANA";
})(KeyFormat || (KeyFormat = {}));
function generateUUID() {
	return crypto.randomUUID();
}
/**
* Stamper to use with `@turnkey/http`'s `TurnkeyClient`
* Creating a stamper inserts an iframe in the current page.
*/
var IframeStamper = class {
	/**
	* Creates a new iframe stamper. This function _does not_ insert the iframe in the DOM.
	* Call `.init()` to insert the iframe element in the DOM.
	*/
	constructor(config) {
		if (typeof window === "undefined") throw new Error("Cannot initialize iframe in non-browser environment");
		if (typeof MessageChannel === "undefined") throw new Error("Cannot initialize iframe without MessageChannel support");
		if (!config.iframeContainer) throw new Error("Iframe container cannot be found");
		this.container = config.iframeContainer;
		if (this.container.querySelector(`#${config.iframeElementId}`)) throw new Error(`Iframe element with ID ${config.iframeElementId} already exists`);
		let iframe = window.document.createElement("iframe");
		iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
		iframe.id = config.iframeElementId;
		iframe.src = config.iframeUrl;
		this.iframe = iframe;
		const iframeUrl = new URL(config.iframeUrl);
		this.iframeOrigin = iframeUrl.origin;
		this.iframePublicKey = null;
		/**
		* The MessageChannel API is used to establish secure communication between two execution contexts.
		* In this case, the parent page and the iframe.
		* See https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel
		*/
		this.messageChannel = new MessageChannel();
		this.pendingRequests = /* @__PURE__ */ new Map();
	}
	onMessageHandler(event) {
		const { type, value, requestId } = event.data || {};
		if (!requestId) {
			if (type === IframeEventType.PublicKeyReady) {
				this.iframePublicKey = value;
				return;
			}
			return;
		}
		const pendingRequest = this.pendingRequests.get(requestId);
		if (!pendingRequest) {
			console.warn(`Received response for unknown request: ${requestId}`);
			return;
		}
		this.pendingRequests.delete(requestId);
		if (type === IframeEventType.Error) {
			pendingRequest.reject(new Error(value));
			return;
		}
		switch (type) {
			case IframeEventType.Stamp:
				pendingRequest.resolve({
					stampHeaderName: stampHeaderName$1,
					stampHeaderValue: value
				});
				break;
			default: pendingRequest.resolve(value);
		}
	}
	/**
	* Inserts the iframe on the page and returns a promise resolving to the iframe's public key
	* @param dangerouslyOverrideIframeKeyTtl Optional TTL override for the iframe's embedded key (default 48 hours). Only use this if you are intentional about the security implications.
	*/
	async init(dangerouslyOverrideIframeKeyTtl) {
		return new Promise((resolve, reject) => {
			this.container.appendChild(this.iframe);
			this.iframe.addEventListener("load", () => {
				if (!this.iframe.contentWindow?.postMessage) {
					reject(/* @__PURE__ */ new Error("contentWindow or contentWindow.postMessage does not exist"));
					return;
				}
				this.iframe.contentWindow.postMessage({
					type: IframeEventType.TurnkeyInitMessageChannel,
					dangerouslyOverrideIframeKeyTtl
				}, this.iframeOrigin, [this.messageChannel.port2]);
			});
			this.messageChannel.port1.onmessage = (event) => {
				if (event.data?.type === IframeEventType.PublicKeyReady) {
					this.iframePublicKey = event.data.value;
					resolve(event.data.value);
				}
				this.onMessageHandler(event);
			};
		});
	}
	/**
	* Removes the iframe from the DOM
	*/
	clear() {
		this.messageChannel?.port1?.close();
		this.messageChannel?.port2?.close();
		this.iframe.remove();
		this.pendingRequests.clear();
	}
	/**
	* Returns the public key, or `null` if the underlying iframe isn't properly initialized.
	*/
	publicKey() {
		return this.iframePublicKey;
	}
	/**
	* Returns the public key, or `null` if the underlying iframe isn't properly initialized.
	* This differs from the above in that it reaches out to the live iframe to see if an embedded key exists.
	*/
	async getEmbeddedPublicKey() {
		const publicKey = await this.createRequest(IframeEventType.GetEmbeddedPublicKey);
		this.iframePublicKey = publicKey;
		return publicKey;
	}
	/**
	* Clears the embedded key within an iframe.
	*/
	async clearEmbeddedKey() {
		await this.createRequest(IframeEventType.ClearEmbeddedKey);
		this.iframePublicKey = "";
		return null;
	}
	/**
	* Creates a new embedded key within an iframe. If an embedded key already exists, this will return it.
	* This is primarily to be used in conjunction with `clearEmbeddedKey()`: after an embedded key is cleared,
	* this can be used to create a new one.
	* @return {string | null} the newly created embedded public key.
	*/
	async initEmbeddedKey() {
		const publicKey = await this.createRequest(IframeEventType.InitEmbeddedKey);
		this.iframePublicKey = publicKey;
		return publicKey;
	}
	/**
	* Generic function to abstract away request creation
	* @param type
	* @param payload
	* @returns expected shape <T>
	*/
	createRequest(type, payload = {}) {
		return new Promise((resolve, reject) => {
			const requestId = generateUUID();
			this.pendingRequests.set(requestId, {
				resolve,
				reject,
				requestId
			});
			this.messageChannel.port1.postMessage({
				type,
				requestId,
				...payload
			});
		});
	}
	/**
	* Function to inject a new credential into the iframe
	* The bundle should be encrypted to the iframe's initial public key
	* Encryption should be performed with HPKE (RFC 9180).
	* This is used during recovery and auth flows.
	*/
	async injectCredentialBundle(bundle) {
		return this.createRequest(IframeEventType.InjectCredentialBundle, { value: bundle });
	}
	/**
	* Function to inject an export bundle into the iframe
	* The bundle should be encrypted to the iframe's initial public key
	* Encryption should be performed with HPKE (RFC 9180).
	* The key format to encode the private key in after it's exported and decrypted: HEXADECIMAL or SOLANA. Defaults to HEXADECIMAL.
	* This is used during the private key export flow.
	*/
	async injectKeyExportBundle(bundle, organizationId, keyFormat) {
		return this.createRequest(IframeEventType.InjectKeyExportBundle, {
			value: bundle,
			keyFormat,
			organizationId
		});
	}
	/**
	* Function to inject an export bundle into the iframe
	* The bundle should be encrypted to the iframe's initial public key
	* Encryption should be performed with HPKE (RFC 9180).
	* This is used during the wallet export flow.
	*/
	async injectWalletExportBundle(bundle, organizationId) {
		return this.createRequest(IframeEventType.InjectWalletExportBundle, {
			value: bundle,
			organizationId
		});
	}
	/**
	* Function to inject an import bundle into the iframe
	* This is used to initiate either the wallet import flow or the private key import flow.
	*/
	async injectImportBundle(bundle, organizationId, userId) {
		return this.createRequest(IframeEventType.InjectImportBundle, {
			value: bundle,
			organizationId,
			userId
		});
	}
	/**
	* Function to extract an encrypted bundle from the iframe
	* The bundle should be encrypted to Turnkey's Signer enclave's initial public key
	* Encryption should be performed with HPKE (RFC 9180).
	* This is used during the wallet import flow.
	*/
	async extractWalletEncryptedBundle() {
		return this.createRequest(IframeEventType.ExtractWalletEncryptedBundle);
	}
	/**
	* Function to extract an encrypted bundle from the iframe
	* The bundle should be encrypted to Turnkey's Signer enclave's initial public key
	* Encryption should be performed with HPKE (RFC 9180).
	* The key format to encode the private key in before it's encrypted and imported: HEXADECIMAL or SOLANA. Defaults to HEXADECIMAL.
	* This is used during the private key import flow.
	*/
	async extractKeyEncryptedBundle(keyFormat) {
		return this.createRequest(IframeEventType.ExtractKeyEncryptedBundle, { keyFormat });
	}
	/**
	* Function to apply settings on allowed parameters in the iframe
	* This is used to style the HTML element used for plaintext in wallet and private key import.
	*/
	async applySettings(settings) {
		return this.createRequest(IframeEventType.ApplySettings, { value: JSON.stringify(settings) });
	}
	/**
	* Function to sign a payload with the underlying iframe
	*/
	async stamp(payload) {
		if (this.iframePublicKey === null) throw new Error("null iframe public key. Have you called/awaited .init()?");
		return this.createRequest(IframeEventType.StampRequest, { value: payload });
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/BaseTurnkeyHandler.js
var BaseTurnkeyHandler = class {
	get client() {
		return this.__turnkeyClient;
	}
	get publicKey() {
		return this.__publicKey;
	}
	clear() {
		var _a;
		(_a = this.__iframeStamper) === null || _a === void 0 || _a.clear();
		this.__iframeStamper = void 0;
		this.__publicKey = void 0;
		this.__turnkeyClient = void 0;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/constants.js
var TURNKEY_API_BASE_URL = "https://api.turnkey.com";
var TURNKEY_API_KEY_EXPIRY_MESSAGE = "Turnkey error 16: expired api key";
var TURNKEY_API_KEY_NOT_FOUND_MESSAGE = "Turnkey error 16: could not find public key";
var WEBAUTHN_NOT_SUPPORTED_OR_CANCELLED_ERROR_MESSAGE = "The operation either timed out or was not allowed";
var WEBAUTHN_NOT_SUPPORTED_OR_DISABLED_ERROR_MESSAGE = "The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.";
var INVALID_PASSKEY_SELECTED_ERROR_MESSAGE = "Turnkey error 5: webauthn authenticator not found in organization or parent organization";
var USER_CANCELLED_REQUEST_ERROR_MESSAGE = "The user cancelled the request";
var TURNKEY_SDK_SESSION_KEY_RETRYABLE_ERRORS = [TURNKEY_API_KEY_EXPIRY_MESSAGE, TURNKEY_API_KEY_NOT_FOUND_MESSAGE];
var TURNKEY_SDK_BENIGN_ERRORS = [
	WEBAUTHN_NOT_SUPPORTED_OR_CANCELLED_ERROR_MESSAGE,
	WEBAUTHN_NOT_SUPPORTED_OR_DISABLED_ERROR_MESSAGE,
	INVALID_PASSKEY_SELECTED_ERROR_MESSAGE,
	USER_CANCELLED_REQUEST_ERROR_MESSAGE
];
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/utils/convertAttestationTransports/convertAttestationTransports.js
var transportMap = {
	AUTHENTICATOR_TRANSPORT_BLE: AuthenticatorTransportProtocol.Ble,
	AUTHENTICATOR_TRANSPORT_HYBRID: AuthenticatorTransportProtocol.Hybrid,
	AUTHENTICATOR_TRANSPORT_INTERNAL: AuthenticatorTransportProtocol.Internal,
	AUTHENTICATOR_TRANSPORT_NFC: AuthenticatorTransportProtocol.Nfc,
	AUTHENTICATOR_TRANSPORT_USB: AuthenticatorTransportProtocol.Usb
};
var convertAttestationTransports = (attestationTransports) => attestationTransports.map((transport) => transportMap[transport]);
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/utils/logger/logger.js
var DynamicEmbeddedWalletsLogger = class extends Logger {
	constructor(name, level) {
		super(name, level);
	}
	error(message, ...args) {
		const [err] = args;
		if (!(err === null || err === void 0 ? void 0 : err.message) || !TURNKEY_SDK_BENIGN_ERRORS.some((errorMsg) => err.message.includes(errorMsg))) this.log(LogLevel.ERROR, message, ...args);
		else this.warn(message, ...args);
	}
};
var logger$1 = new DynamicEmbeddedWalletsLogger("Dynamic embedded wallets", LogLevel.INFO);
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+webauthn-stamper@0.5.1/node_modules/@turnkey/webauthn-stamper/dist/webauthn-json/base64url.mjs
function bufferToBase64url(buffer) {
	const byteView = new Uint8Array(buffer);
	let str = "";
	for (const charCode of byteView) str += String.fromCharCode(charCode);
	return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+webauthn-stamper@0.5.1/node_modules/@turnkey/webauthn-stamper/dist/webauthn-json/convert.mjs
var copyValue = "copy";
var convertValue = "convert";
function convert(conversionFn, schema, input) {
	if (schema === "copy") return input;
	if (schema === "convert") return conversionFn(input);
	if (schema instanceof Array) return input.map((v) => convert(conversionFn, schema[0], v));
	if (schema instanceof Object) {
		const output = {};
		for (const [key, schemaField] of Object.entries(schema)) {
			if (schemaField.derive) {
				const v = schemaField.derive(input);
				if (v !== void 0) input[key] = v;
			}
			if (!(key in input)) {
				if (schemaField.required) throw new Error(`Missing key: ${key}`);
				continue;
			}
			if (input[key] == null) {
				output[key] = null;
				continue;
			}
			output[key] = convert(conversionFn, schemaField.schema, input[key]);
		}
		return output;
	}
}
function derived(schema, derive) {
	return {
		required: true,
		schema,
		derive
	};
}
function required(schema) {
	return {
		required: true,
		schema
	};
}
function optional(schema) {
	return {
		required: false,
		schema
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+webauthn-stamper@0.5.1/node_modules/@turnkey/webauthn-stamper/dist/webauthn-json/schema.mjs
var simplifiedClientExtensionResultsSchema = {
	appid: optional(copyValue),
	appidExclude: optional(copyValue),
	credProps: optional(copyValue)
};
var publicKeyCredentialWithAssertion = {
	type: required(copyValue),
	id: required(copyValue),
	rawId: required(convertValue),
	authenticatorAttachment: optional(copyValue),
	response: required({
		clientDataJSON: required(convertValue),
		authenticatorData: required(convertValue),
		signature: required(convertValue),
		userHandle: required(convertValue)
	}),
	clientExtensionResults: derived(simplifiedClientExtensionResultsSchema, (pkc) => pkc.getClientExtensionResults())
};
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+webauthn-stamper@0.5.1/node_modules/@turnkey/webauthn-stamper/dist/webauthn-json/api.mjs
function getResponseToJSON(credential) {
	return convert(bufferToBase64url, publicKeyCredentialWithAssertion, credential);
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+webauthn-stamper@0.5.1/node_modules/@turnkey/webauthn-stamper/dist/webauthn-json/index.mjs
async function get(options) {
	const response = await navigator.credentials.get(options);
	response.toJSON = () => getResponseToJSON(response);
	return response;
}
//#endregion
//#region ../../node_modules/.pnpm/sha256-uint8array@0.10.7/node_modules/sha256-uint8array/dist/sha256-uint8array.mjs
/**
* sha256-uint8array.ts
*/
var K = [
	1116352408,
	1899447441,
	-1245643825,
	-373957723,
	961987163,
	1508970993,
	-1841331548,
	-1424204075,
	-670586216,
	310598401,
	607225278,
	1426881987,
	1925078388,
	-2132889090,
	-1680079193,
	-1046744716,
	-459576895,
	-272742522,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	-1740746414,
	-1473132947,
	-1341970488,
	-1084653625,
	-958395405,
	-710438585,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	-2117940946,
	-1838011259,
	-1564481375,
	-1474664885,
	-1035236496,
	-949202525,
	-778901479,
	-694614492,
	-200395387,
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
	-2067236844,
	-1933114872,
	-1866530822,
	-1538233109,
	-1090935817,
	-965641998
];
var algorithms = { sha256: 1 };
function createHash(algorithm) {
	if (algorithm && !algorithms[algorithm] && !algorithms[algorithm.toLowerCase()]) throw new Error("Digest method not supported");
	return new Hash();
}
var Hash = class {
	constructor() {
		this.A = 1779033703;
		this.B = -1150833019;
		this.C = 1013904242;
		this.D = -1521486534;
		this.E = 1359893119;
		this.F = -1694144372;
		this.G = 528734635;
		this.H = 1541459225;
		this._size = 0;
		this._sp = 0;
		if (!sharedBuffer || sharedOffset >= 8e3) {
			sharedBuffer = /* @__PURE__ */ new ArrayBuffer(8e3);
			sharedOffset = 0;
		}
		this._byte = new Uint8Array(sharedBuffer, sharedOffset, 80);
		this._word = new Int32Array(sharedBuffer, sharedOffset, 20);
		sharedOffset += 80;
	}
	update(data) {
		if ("string" === typeof data) return this._utf8(data);
		if (data == null) throw new TypeError("Invalid type: " + typeof data);
		const byteOffset = data.byteOffset;
		const length = data.byteLength;
		let blocks = length / 64 | 0;
		let offset = 0;
		if (blocks && !(byteOffset & 3) && !(this._size % 64)) {
			const block = new Int32Array(data.buffer, byteOffset, blocks * 16);
			while (blocks--) {
				this._int32(block, offset >> 2);
				offset += 64;
			}
			this._size += offset;
		}
		if (data.BYTES_PER_ELEMENT !== 1 && data.buffer) {
			const rest = new Uint8Array(data.buffer, byteOffset + offset, length - offset);
			return this._uint8(rest);
		}
		if (offset === length) return this;
		return this._uint8(data, offset);
	}
	_uint8(data, offset) {
		const { _byte, _word } = this;
		const length = data.length;
		offset = offset | 0;
		while (offset < length) {
			const start = this._size % 64;
			let index = start;
			while (offset < length && index < 64) _byte[index++] = data[offset++];
			if (index >= 64) this._int32(_word);
			this._size += index - start;
		}
		return this;
	}
	_utf8(text) {
		const { _byte, _word } = this;
		const length = text.length;
		let surrogate = this._sp;
		for (let offset = 0; offset < length;) {
			const start = this._size % 64;
			let index = start;
			while (offset < length && index < 64) {
				let code = text.charCodeAt(offset++) | 0;
				if (code < 128) _byte[index++] = code;
				else if (code < 2048) {
					_byte[index++] = 192 | code >>> 6;
					_byte[index++] = 128 | code & 63;
				} else if (code < 55296 || code > 57343) {
					_byte[index++] = 224 | code >>> 12;
					_byte[index++] = 128 | code >>> 6 & 63;
					_byte[index++] = 128 | code & 63;
				} else if (surrogate) {
					code = ((surrogate & 1023) << 10) + (code & 1023) + 65536;
					_byte[index++] = 240 | code >>> 18;
					_byte[index++] = 128 | code >>> 12 & 63;
					_byte[index++] = 128 | code >>> 6 & 63;
					_byte[index++] = 128 | code & 63;
					surrogate = 0;
				} else surrogate = code;
			}
			if (index >= 64) {
				this._int32(_word);
				_word[0] = _word[16];
			}
			this._size += index - start;
		}
		this._sp = surrogate;
		return this;
	}
	_int32(data, offset) {
		let { A, B, C, D, E, F, G, H } = this;
		let i = 0;
		offset = offset | 0;
		while (i < 16) W[i++] = swap32(data[offset++]);
		for (i = 16; i < 64; i++) W[i] = gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16] | 0;
		for (i = 0; i < 64; i++) {
			const T1 = H + sigma1(E) + ch(E, F, G) + K[i] + W[i] | 0;
			const T2 = sigma0(A) + maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		this.A = A + this.A | 0;
		this.B = B + this.B | 0;
		this.C = C + this.C | 0;
		this.D = D + this.D | 0;
		this.E = E + this.E | 0;
		this.F = F + this.F | 0;
		this.G = G + this.G | 0;
		this.H = H + this.H | 0;
	}
	digest(encoding) {
		const { _byte, _word } = this;
		let i = this._size % 64 | 0;
		_byte[i++] = 128;
		while (i & 3) _byte[i++] = 0;
		i >>= 2;
		if (i > 14) {
			while (i < 16) _word[i++] = 0;
			i = 0;
			this._int32(_word);
		}
		while (i < 16) _word[i++] = 0;
		const bits64 = this._size * 8;
		const low32 = (bits64 & 4294967295) >>> 0;
		const high32 = (bits64 - low32) / 4294967296;
		if (high32) _word[14] = swap32(high32);
		if (low32) _word[15] = swap32(low32);
		this._int32(_word);
		return encoding === "hex" ? this._hex() : this._bin();
	}
	_hex() {
		const { A, B, C, D, E, F, G, H } = this;
		return hex32(A) + hex32(B) + hex32(C) + hex32(D) + hex32(E) + hex32(F) + hex32(G) + hex32(H);
	}
	_bin() {
		const { A, B, C, D, E, F, G, H, _byte, _word } = this;
		_word[0] = swap32(A);
		_word[1] = swap32(B);
		_word[2] = swap32(C);
		_word[3] = swap32(D);
		_word[4] = swap32(E);
		_word[5] = swap32(F);
		_word[6] = swap32(G);
		_word[7] = swap32(H);
		return _byte.slice(0, 32);
	}
};
var W = new Int32Array(64);
var sharedBuffer;
var sharedOffset = 0;
var hex32 = (num) => (num + 4294967296).toString(16).substr(-8);
var swapLE = ((c) => c << 24 & 4278190080 | c << 8 & 16711680 | c >> 8 & 65280 | c >> 24 & 255);
var swapBE = ((c) => c);
var swap32 = isBE() ? swapBE : swapLE;
var ch = (x, y, z) => z ^ x & (y ^ z);
var maj = (x, y, z) => x & y | z & (x | y);
var sigma0 = (x) => (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10);
var sigma1 = (x) => (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7);
var gamma0 = (x) => (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
var gamma1 = (x) => (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ x >>> 10;
function isBE() {
	return new Uint8Array(new Uint16Array([65279]).buffer)[0] === 254;
}
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+webauthn-stamper@0.5.1/node_modules/@turnkey/webauthn-stamper/dist/index.mjs
var stampHeaderName = "X-Stamp-Webauthn";
var defaultTimeout = 300 * 1e3;
var defaultUserVerification = "preferred";
/**
* Stamper to use with `@turnkey/http`'s `TurnkeyClient`
*/
var WebauthnStamper = class {
	constructor(config) {
		this.rpId = config.rpId;
		this.timeout = config.timeout || defaultTimeout;
		this.userVerification = config.userVerification || defaultUserVerification;
		this.allowCredentials = config.allowCredentials || [];
	}
	async stamp(payload) {
		const challenge = getChallengeFromPayload(payload);
		const assertion = (await get({ publicKey: {
			rpId: this.rpId,
			challenge,
			allowCredentials: this.allowCredentials,
			timeout: this.timeout,
			userVerification: this.userVerification
		} })).toJSON();
		const stamp = {
			authenticatorData: assertion.response.authenticatorData,
			clientDataJson: assertion.response.clientDataJSON,
			credentialId: assertion.id,
			signature: assertion.response.signature
		};
		return {
			stampHeaderName,
			stampHeaderValue: JSON.stringify(stamp)
		};
	}
};
function getChallengeFromPayload(payload) {
	const hexString = createHash().update(payload).digest("hex");
	return new TextEncoder().encode(hexString);
}
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+webauthn@4.89.0/node_modules/@dynamic-labs/webauthn/src/lib/errors/WebauthnNotSupportedError.js
var WebauthnNotSupportedError = class extends Error {
	constructor() {
		super("Webauthn is not supported on this device");
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+webauthn@4.89.0/node_modules/@dynamic-labs/webauthn/_virtual/_tslib.js
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+webauthn@4.89.0/node_modules/@dynamic-labs/webauthn/src/lib/logger.js
var logger = new Logger("Webauthn");
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+webauthn@4.89.0/node_modules/@dynamic-labs/webauthn/src/lib/createWebauthnCredential.js
var createWebauthnCredential = (options) => __awaiter(void 0, void 0, void 0, function* () {
	if (!browserSupportsWebAuthn()) throw new WebauthnNotSupportedError();
	let attestationResp;
	try {
		attestationResp = yield startRegistration({ optionsJSON: options });
	} catch (error) {
		logger.debug("Failed to create webauthn credential", error);
		throw error;
	}
	return attestationResp;
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+webauthn@4.89.0/node_modules/@dynamic-labs/webauthn/src/lib/adapters/convertTransportEnumToTurnkeyEnum.js
var convertTransportEnumToTurnkeyEnum = (transportEnum) => {
	switch (transportEnum) {
		case "internal": return "AUTHENTICATOR_TRANSPORT_INTERNAL";
		case "usb": return "AUTHENTICATOR_TRANSPORT_USB";
		case "nfc": return "AUTHENTICATOR_TRANSPORT_NFC";
		case "ble": return "AUTHENTICATOR_TRANSPORT_BLE";
		case "hybrid": return "AUTHENTICATOR_TRANSPORT_HYBRID";
		default: throw new Error("unsupported transport format " + transportEnum);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+webauthn@4.89.0/node_modules/@dynamic-labs/webauthn/src/lib/adapters/getWebAuthnAttestationTurnkeyAdapter.js
var getWebAuthnAttestationTurnkeyAdapter = (options) => __awaiter(void 0, void 0, void 0, function* () {
	if (!options.publicKey) throw new Error("Invalid options. Public key attribute must be defined");
	return convertAttestationResultToTurnkey(yield createWebauthnCredential(convertPublicKeyToWebauthn(options.publicKey)));
});
var convertAttestationResultToTurnkey = (attestation) => {
	var _a;
	return {
		attestationObject: attestation.response.attestationObject,
		clientDataJson: attestation.response.clientDataJSON,
		credentialId: attestation.rawId,
		transports: ((_a = attestation.response.transports) === null || _a === void 0 ? void 0 : _a.map(convertTransportEnumToTurnkeyEnum)) || []
	};
};
var convertPublicKeyToWebauthn = (publicKey) => {
	var _a;
	return Object.assign(Object.assign({}, publicKey), {
		challenge: bufferSourceToString(publicKey.challenge),
		excludeCredentials: (_a = publicKey.excludeCredentials) === null || _a === void 0 ? void 0 : _a.map((cred) => Object.assign(Object.assign({}, cred), { id: bufferSourceToString(cred.id) })),
		user: Object.assign(Object.assign({}, publicKey.user), { id: bufferSourceToString(publicKey.user.id) })
	});
};
var bufferSourceToString = (buf) => {
	if (buf instanceof ArrayBuffer) return bufferToBase64URLString(buf);
	else return bufferToBase64URLString(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/utils/TurnkeyPasskeyService/utils/createTurnkeyPasskeyService/createTurnkeyPasskeyService.js
var createTurnkeyPasskeyService = () => ({
	createWebauthnStamper: (config) => new WebauthnStamper(config),
	getWebAuthnAttestation: getWebAuthnAttestationTurnkeyAdapter
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/utils/TurnkeyPasskeyService/TurnkeyPasskeyService.js
var _a, _TurnkeyPasskeyService_implementation;
var TurnkeyPasskeyService = class {
	/**
	* Gets the current passkey service implementation.
	* If no implementation is set, it will create a new turnkey passkey service.
	* @returns {ITurnkeyPasskeyService} The passkey service implementation.
	*/
	static get implementation() {
		if (!__classPrivateFieldGet(_a, _a, "f", _TurnkeyPasskeyService_implementation)) return createTurnkeyPasskeyService();
		return __classPrivateFieldGet(_a, _a, "f", _TurnkeyPasskeyService_implementation);
	}
	/**
	* Sets the passkey service implementation.
	* @param {ITurnkeyPasskeyService} implementation The passkey service implementation to set.
	*/
	static set implementation(implementation) {
		__classPrivateFieldSet(_a, _a, implementation, "f", _TurnkeyPasskeyService_implementation);
	}
	/**
	* Gets the WebAuthn attestation method from the current implementation.
	*/
	static get getWebAuthnAttestation() {
		return _a.implementation.getWebAuthnAttestation;
	}
	/**
	* Gets the createWebauthnStamper method from the current implementation.
	*/
	static get createWebauthnStamper() {
		return _a.implementation.createWebauthnStamper;
	}
};
_a = TurnkeyPasskeyService;
_TurnkeyPasskeyService_implementation = { value: void 0 };
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/AuthenticatorHandler/TurnkeyAuthenticatorRecoveryHandler.js
var turnkeyPasskeyRecoveryUrl = "https://recovery.turnkey.com";
var turnkeyEmailRecoveryUrl = "https://auth.turnkey.com";
var TURNKEY_RECOVERY_CREDENTIAL_EXPIRATION_SECONDS = 900;
var TURNKEY_SESSION_EXPIRATION_SECONDS = 1800;
var EMAIL_AUTH_CREDENTIAL_TYPE = "CREDENTIAL_TYPE_API_KEY_P256";
var PASSKEY_RECOVERY_CREDENTIAL_TYPE = "CREDENTIAL_TYPE_RECOVER_USER_KEY_P256";
var TurnkeyAuthenticatorRecoveryHandler = class extends BaseTurnkeyHandler {
	constructor() {
		super(...arguments);
		this.isSessionActive = () => {
			if (!this.__createdAt || this.__recoveryType !== "email") return false;
			if (this.isExpired(this.__createdAt, this.__sessionExpiration || TURNKEY_SESSION_EXPIRATION_SECONDS)) {
				this.clear();
				return false;
			}
			return true;
		};
		this.isValidCode = (organizationId) => __awaiter$1(this, void 0, void 0, function* () {
			var _a, _b, _c, _d;
			if (!organizationId || !this.__turnkeyRecoveryUserId) throw new DynamicError("Cannot proceed with your request");
			const userResponse = yield (_a = this.__turnkeyClient) === null || _a === void 0 ? void 0 : _a.getUser({
				organizationId,
				userId: this.__turnkeyRecoveryUserId
			});
			const credentialTypeMap = {
				email: EMAIL_AUTH_CREDENTIAL_TYPE,
				passkey: PASSKEY_RECOVERY_CREDENTIAL_TYPE
			};
			const recoveryCredential = (_d = (_c = (_b = userResponse === null || userResponse === void 0 ? void 0 : userResponse.user) === null || _b === void 0 ? void 0 : _b.apiKeys) === null || _c === void 0 ? void 0 : _c.filter((k) => k.credential.type === credentialTypeMap[this.__recoveryType])) === null || _d === void 0 ? void 0 : _d.pop();
			if (!recoveryCredential) return false;
			if (this.isExpired(parseInt(recoveryCredential.createdAt.seconds, 10), TURNKEY_RECOVERY_CREDENTIAL_EXPIRATION_SECONDS)) return false;
			this.__createdAt = parseInt(recoveryCredential.createdAt.seconds, 10);
			return true;
		});
		this.isExpired = (createdAtSeconds, expirationTimeSeconds) => {
			const recoveryExpirationSeconds = createdAtSeconds + expirationTimeSeconds;
			const expirationTime = /* @__PURE__ */ new Date(recoveryExpirationSeconds * 1e3);
			if (/* @__PURE__ */ new Date() >= expirationTime) return true;
			return false;
		};
	}
	get recoveryType() {
		return this.__recoveryType;
	}
	get recoveryUserId() {
		return this.__turnkeyRecoveryUserId || "";
	}
	set recoveryUserId(turnkeyRecoveryUserId) {
		this.__turnkeyRecoveryUserId = turnkeyRecoveryUserId;
	}
	clear() {
		super.clear();
		this.__recoveryType = void 0;
		this.__turnkeyRecoveryUserId = void 0;
		this.__createdAt = void 0;
	}
	initRecovery(authType, iframeContainer, iframeElementId, sessionExpiration) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (this.__recoveryType) this.clear();
			this.__sessionExpiration = sessionExpiration;
			this.__recoveryType = authType;
			const iframeUrl = authType === "passkey" ? turnkeyPasskeyRecoveryUrl : turnkeyEmailRecoveryUrl;
			this.__iframeStamper = new IframeStamper({
				iframeContainer,
				iframeElementId,
				iframeUrl
			});
			yield this.__iframeStamper.init();
			this.__publicKey = this.__iframeStamper.publicKey();
			return this.__publicKey;
		});
	}
	verifyRecoveryCode(recoveryBundle, organizationId) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (!this.__iframeStamper) throw new DynamicError("Cannot proceed with your request");
			try {
				yield this.__iframeStamper.injectCredentialBundle(recoveryBundle);
				this.__turnkeyClient = new TurnkeyClient({ baseUrl: TURNKEY_API_BASE_URL }, this.__iframeStamper);
				if (!organizationId || !this.__turnkeyRecoveryUserId) throw new DynamicError("Cannot proceed with your request");
				if (!(yield this.isValidCode(organizationId))) throw new DynamicError("The code is invalid or expired.");
			} catch (err) {
				logger$1.error("Error while verifying recovery code", err);
				if (err instanceof DynamicError) throw err;
				throw new DynamicError("The code is invalid or expired.");
			}
		});
	}
	completeRecovery(_a) {
		return __awaiter$1(this, arguments, void 0, function* ({ attestation, challenge, turnkeySubOrganizationId }) {
			if (!this.__turnkeyClient || !this.__turnkeyRecoveryUserId) throw new DynamicError("Cannot proceed with your request");
			try {
				return this.__turnkeyClient.recoverUser({
					organizationId: turnkeySubOrganizationId,
					parameters: {
						authenticator: {
							attestation,
							authenticatorName: "Passkey",
							challenge
						},
						userId: this.__turnkeyRecoveryUserId
					},
					timestampMs: String(Date.now()),
					type: "ACTIVITY_TYPE_RECOVER_USER"
				});
			} catch (err) {
				logger$1.error("[TK] Error while completing recovery process", err);
				throw err;
			}
		});
	}
	addPasskeyAuthenticator(_a) {
		return __awaiter$1(this, arguments, void 0, function* ({ attestation, challenge, turnkeySubOrganizationId }) {
			if (!this.__turnkeyClient || !this.__turnkeyRecoveryUserId) throw new DynamicError("Cannot proceed with your request");
			try {
				return this.__turnkeyClient.createAuthenticators({
					organizationId: turnkeySubOrganizationId,
					parameters: {
						authenticators: [{
							attestation,
							authenticatorName: "Passkey",
							challenge
						}],
						userId: this.__turnkeyRecoveryUserId
					},
					timestampMs: String(Date.now()),
					type: "ACTIVITY_TYPE_CREATE_AUTHENTICATORS_V2"
				});
			} catch (err) {
				logger$1.error("[TK] Error while creating new authenticator", err);
				throw err;
			}
		});
	}
	addEmailRecovery(_a) {
		return __awaiter$1(this, arguments, void 0, function* ({ organizationId, email, turnkeyUserId }) {
			let rpId = getTLD();
			if (!rpId) rpId = PlatformService.getHostname();
			const stamper = TurnkeyPasskeyService.createWebauthnStamper({ rpId });
			const client = new TurnkeyClient({ baseUrl: TURNKEY_API_BASE_URL }, stamper);
			try {
				return {
					signedRequest: yield client.stampUpdateUser({
						organizationId,
						parameters: {
							userEmail: email,
							userId: turnkeyUserId,
							userTagIds: []
						},
						timestampMs: String(Date.now()),
						type: "ACTIVITY_TYPE_UPDATE_USER"
					}),
					userId: turnkeyUserId
				};
			} catch (err) {
				logger$1.error("Error while adding email recovery", err);
				throw err;
			}
		});
	}
};
var turnkeyAuthenticatorRecoveryHandler = new TurnkeyAuthenticatorRecoveryHandler();
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/ExportHandler/TurnkeyExportHandler.js
var turnkeyExportUrl = "https://export.turnkey.com";
var TurnkeyExportHandler = class TurnkeyExportHandler extends BaseTurnkeyHandler {
	initExport(iframeContainer, iframeElementId) {
		return __awaiter$1(this, void 0, void 0, function* () {
			this.__iframeStamper = new IframeStamper({
				iframeContainer,
				iframeElementId,
				iframeUrl: turnkeyExportUrl
			});
			yield this.__iframeStamper.init();
			this.__publicKey = this.__iframeStamper.publicKey();
			if (turnkeyAuthenticatorRecoveryHandler.isSessionActive()) this.__turnkeyClient = turnkeyAuthenticatorRecoveryHandler.client;
			else {
				let rpId = getTLD();
				if (!rpId) rpId = PlatformService.getHostname();
				const passkeyStamper = TurnkeyPasskeyService.createWebauthnStamper({ rpId });
				const apiKeyStamper = TurnkeyExportHandler === null || TurnkeyExportHandler === void 0 ? void 0 : TurnkeyExportHandler.apiKeyStamper;
				const stamper = apiKeyStamper !== null && apiKeyStamper !== void 0 ? apiKeyStamper : passkeyStamper;
				this.__turnkeyClient = new TurnkeyClient({ baseUrl: TURNKEY_API_BASE_URL }, stamper);
			}
			return this.__publicKey;
		});
	}
	verifyExportWallet(_a) {
		return __awaiter$1(this, arguments, void 0, function* ({ exportBundle, organizationId }) {
			if (!this.__iframeStamper) throw new DynamicError("Cannot proceed with your request");
			try {
				return yield this.__iframeStamper.injectWalletExportBundle(exportBundle, organizationId);
			} catch (err) {
				logger$1.error("Error while verifying export wallet", err);
				throw err;
			}
		});
	}
	verifyExportPrivateKey(_a) {
		return __awaiter$1(this, arguments, void 0, function* ({ exportBundle, organizationId, chain }) {
			if (!this.__iframeStamper) throw new DynamicError("Cannot proceed with your request");
			const keyFormat = chain === "solana" || chain === "SOL" ? KeyFormat.Solana : KeyFormat.Hexadecimal;
			try {
				return yield this.__iframeStamper.injectKeyExportBundle(exportBundle, organizationId, keyFormat);
			} catch (err) {
				logger$1.error("Error while verifying export private key", err);
				throw err;
			}
		});
	}
	exportPrivateKey(_a) {
		return __awaiter$1(this, arguments, void 0, function* ({ privateKeyId, organizationId }) {
			const apiKeyStamper = TurnkeyExportHandler === null || TurnkeyExportHandler === void 0 ? void 0 : TurnkeyExportHandler.apiKeyStamper;
			if (apiKeyStamper) this.__turnkeyClient = new TurnkeyClient({ baseUrl: TURNKEY_API_BASE_URL }, apiKeyStamper);
			if (!this.__iframeStamper || !this.__publicKey || !this.__turnkeyClient || !privateKeyId) throw new DynamicError("Cannot proceed with your request");
			try {
				return (yield this.__turnkeyClient.exportPrivateKey({
					organizationId,
					parameters: {
						privateKeyId,
						targetPublicKey: this.__publicKey
					},
					timestampMs: String(Date.now()),
					type: "ACTIVITY_TYPE_EXPORT_PRIVATE_KEY"
				})).activity;
			} catch (err) {
				logger$1.error("[TK] Error while completing export private key process", err);
				throw err;
			}
		});
	}
	exportWallet(_a) {
		return __awaiter$1(this, arguments, void 0, function* ({ walletId, organizationId, address }) {
			const apiKeyStamper = TurnkeyExportHandler === null || TurnkeyExportHandler === void 0 ? void 0 : TurnkeyExportHandler.apiKeyStamper;
			if (apiKeyStamper) this.__turnkeyClient = new TurnkeyClient({ baseUrl: TURNKEY_API_BASE_URL }, apiKeyStamper);
			if (!this.__iframeStamper || !this.__publicKey || !this.__turnkeyClient || !walletId) throw new DynamicError("Cannot proceed with your request");
			try {
				if (address) return (yield this.__turnkeyClient.exportWalletAccount({
					organizationId,
					parameters: {
						address,
						targetPublicKey: this.__publicKey
					},
					timestampMs: String(Date.now()),
					type: "ACTIVITY_TYPE_EXPORT_WALLET_ACCOUNT"
				})).activity;
				return (yield this.__turnkeyClient.exportWallet({
					organizationId,
					parameters: {
						targetPublicKey: this.__publicKey,
						walletId
					},
					timestampMs: String(Date.now()),
					type: "ACTIVITY_TYPE_EXPORT_WALLET"
				})).activity;
			} catch (err) {
				logger$1.error("[TK] Error while completing export wallet process", err);
				throw err;
			}
		});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/utils/base64UrlEncode/base64UrlEncode.js
var base64UrlEncode = (challenge) => Buffer.from(challenge).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/utils/generateRandomBuffer/generateRandomBuffer.js
var generateRandomBuffer = () => {
	const arr = new Uint8Array(32);
	crypto.getRandomValues(arr);
	return arr.buffer;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/TurnkeyWalletConnectorBase/TurnkeyWalletConnectorBase.js
var TurnkeyWalletConnectorBase = class TurnkeyWalletConnectorBase extends WalletConnectorBase {
	constructor(nameAndKey, props) {
		super(props);
		this.requiresNonDynamicEmailOtp = false;
		this.isEmbeddedWallet = true;
		this.removeSessionKeys = () => __awaiter$1(this, void 0, void 0, function* () {
			TurnkeyWalletConnectorBase.sessionKeys = void 0;
			TurnkeyWalletConnectorBase.apiKeyStamper = void 0;
			TurnkeyExportHandler.apiKeyStamper = void 0;
		});
		this.stampCreateWalletAccountRequest = (_a) => __awaiter$1(this, [_a], void 0, function* ({ request }) {
			yield this.createOrRestoreSession();
			return (yield this.getTurnkeyClient()).stampCreateWalletAccounts(request);
		});
		this.stampDeleteSubOrganizationRequest = (_b) => __awaiter$1(this, [_b], void 0, function* ({ request }) {
			yield this.createOrRestoreSession();
			return (yield this.getTurnkeyClient()).stampDeleteSubOrganization(request);
		});
		if (!props.appName) throw new Error("appName not set");
		this.name = nameAndKey.name;
		this.overrideKey = nameAndKey.key;
		this.appName = props.appName;
		this.__authenticatorMethodHandler = turnkeyAuthenticatorRecoveryHandler;
	}
	getWebAuthnAttestation() {
		return __awaiter$1(this, void 0, void 0, function* () {
			const challenge = generateRandomBuffer();
			const authenticatorUserId = generateRandomBuffer();
			const { email, passkeyIdentifier } = this;
			if (!email && !passkeyIdentifier) throw new Error("Email or passkeyIdentifier must be set to register a webauthn credential.");
			const displayName = email || `${this.appName} - ${passkeyIdentifier}`;
			const webAuthnCreateParams = { publicKey: {
				authenticatorSelection: {
					authenticatorAttachment: void 0,
					requireResidentKey: false,
					residentKey: "preferred",
					userVerification: "discouraged"
				},
				challenge,
				pubKeyCredParams: [{
					alg: -7,
					type: "public-key"
				}],
				rp: {
					id: getTLD(),
					name: this.appName
				},
				user: {
					displayName,
					id: authenticatorUserId,
					name: email || `${this.appName} - ${passkeyIdentifier}`
				}
			} };
			let attestation;
			try {
				attestation = yield TurnkeyPasskeyService.getWebAuthnAttestation(webAuthnCreateParams);
			} catch (error) {
				logger$1.warn(`Unable to register webauthn credential on the current page's TLD ${getTLD()}. Falling back to using hostname. ${PlatformService.getHostname()}`, error);
				webAuthnCreateParams.publicKey.rp.id = PlatformService.getHostname();
				attestation = yield TurnkeyPasskeyService.getWebAuthnAttestation(webAuthnCreateParams);
			}
			return {
				attestation: {
					attestationObject: attestation.attestationObject,
					clientDataJson: attestation.clientDataJson,
					credentialId: attestation.credentialId,
					transports: convertAttestationTransports(attestation.transports)
				},
				challenge: base64UrlEncode(challenge),
				displayName
			};
		});
	}
	getAuthenticatorHandler() {
		return this.__authenticatorMethodHandler;
	}
	getExportHandler() {
		if (!TurnkeyWalletConnectorBase.__exportHandler) TurnkeyWalletConnectorBase.__exportHandler = new TurnkeyExportHandler();
		return TurnkeyWalletConnectorBase.__exportHandler;
	}
	get email() {
		return this._email;
	}
	setEmail(email) {
		this._email = email;
	}
	get phone() {
		return this._phone;
	}
	setPhone(phone) {
		this._phone = phone;
	}
	get passkeyIdentifier() {
		return this._passkeyIdentifier;
	}
	setPasskeyIdentifier(passkeyIdentifier) {
		this._passkeyIdentifier = passkeyIdentifier;
	}
	clearEmail() {
		this._email = null;
	}
	getAddress() {
		return __awaiter$1(this, void 0, void 0, function* () {
			var _a;
			return (_a = this.verifiedCredential) === null || _a === void 0 ? void 0 : _a.address;
		});
	}
	getConnectedAccounts() {
		return __awaiter$1(this, void 0, void 0, function* () {
			return (this.verifiedCredentials || []).map((vc) => vc === null || vc === void 0 ? void 0 : vc.address).filter((a) => typeof a === "string");
		});
	}
	get turnkeyAddress() {
		var _a;
		const { address } = (_a = this.verifiedCredential) !== null && _a !== void 0 ? _a : {};
		return address;
	}
	get walletProperties() {
		const { walletProperties } = this.verifiedCredential || {};
		return walletProperties;
	}
	set verifiedCredentials(verifiedCredentials) {
		this._verifiedCredentials = verifiedCredentials;
	}
	get verifiedCredentials() {
		return this._verifiedCredentials;
	}
	set verifiedCredential(verifiedCredential) {
		this._verifiedCredential = verifiedCredential;
	}
	get verifiedCredential() {
		return this._verifiedCredential;
	}
	setSessionKeyFetcher(func) {
		this.createOrRestoreSessionFetcherFunction = func;
	}
	setSessionKeyRemoveFunction(func) {
		this.removeSessionKeysFunction = func;
	}
	createOrRestoreSession() {
		return __awaiter$1(this, arguments, void 0, function* ({ ignoreRestore } = {}) {
			var _a, _b, _c;
			if (!this.isSessionKeyCompatible() || TurnkeyWalletConnectorBase.isLoadingSession) return;
			if (!this.createOrRestoreSessionFetcherFunction) throw new DynamicError("Cannot register session key to init provider");
			const { sessionKeys } = TurnkeyWalletConnectorBase;
			if (sessionKeys === null || sessionKeys === void 0 ? void 0 : sessionKeys.publicKey) {
				if (!(/* @__PURE__ */ new Date() >= new Date(sessionKeys.expirationDate))) return sessionKeys.publicKey;
			}
			try {
				TurnkeyWalletConnectorBase.isLoadingSession = true;
				this.isLoadingSessionDeferredPromise = new DeferredPromise();
				if (!((_a = this.verifiedCredential) === null || _a === void 0 ? void 0 : _a.id)) throw new DynamicError("No wallet ID found");
				const sessionKeys = yield this.createOrRestoreSessionFetcherFunction({
					ignoreRestore,
					walletId: (_b = this.verifiedCredential) === null || _b === void 0 ? void 0 : _b.id
				});
				TurnkeyWalletConnectorBase.sessionKeys = sessionKeys;
				TurnkeyWalletConnectorBase.apiKeyStamper = new ApiKeyStamper({
					apiPrivateKey: sessionKeys.privateKey,
					apiPublicKey: sessionKeys.publicKey
				});
				TurnkeyExportHandler.apiKeyStamper = TurnkeyWalletConnectorBase.apiKeyStamper;
				logger$1.metaData.set("sessionApiPublicKey", sessionKeys.publicKey);
				return sessionKeys.publicKey;
			} catch (error) {
				logger$1.error(error);
				throw new DynamicError("Failed to create or restore session");
			} finally {
				TurnkeyWalletConnectorBase.isLoadingSession = false;
				(_c = this.isLoadingSessionDeferredPromise) === null || _c === void 0 || _c.resolve();
			}
		});
	}
	isSessionKeyCompatible() {
		var _a;
		const walletProperties = (_a = this.verifiedCredential) === null || _a === void 0 ? void 0 : _a.walletProperties;
		const isSessionKeyCompatible = walletProperties === null || walletProperties === void 0 ? void 0 : walletProperties.isSessionKeyCompatible;
		return Boolean(isSessionKeyCompatible);
	}
	isSessionActive() {
		return __awaiter$1(this, void 0, void 0, function* () {
			const hasWallet = yield this.getAddress();
			return Boolean(hasWallet && TurnkeyWalletConnectorBase.sessionKeys && TurnkeyWalletConnectorBase.apiKeyStamper);
		});
	}
	get sessionKeys() {
		return TurnkeyWalletConnectorBase.sessionKeys;
	}
	getTurnkeyClient() {
		return __awaiter$1(this, void 0, void 0, function* () {
			var _a, _b;
			if (TurnkeyWalletConnectorBase.isLoadingSession) yield (_a = this.isLoadingSessionDeferredPromise) === null || _a === void 0 ? void 0 : _a.promise;
			let rpId = getTLD();
			if (!rpId) rpId = PlatformService.getHostname();
			const passkeyStamper = TurnkeyPasskeyService.createWebauthnStamper({ rpId });
			const apiKeyStamper = TurnkeyWalletConnectorBase === null || TurnkeyWalletConnectorBase === void 0 ? void 0 : TurnkeyWalletConnectorBase.apiKeyStamper;
			const stamper = apiKeyStamper !== null && apiKeyStamper !== void 0 ? apiKeyStamper : passkeyStamper;
			this.__turnkeyClient = (_b = this.getAuthenticatorHandler().client) !== null && _b !== void 0 ? _b : new TurnkeyClient({ baseUrl: TURNKEY_API_BASE_URL }, stamper);
			return this.__turnkeyClient;
		});
	}
	setLoggerMetadata() {
		var _a, _b, _c;
		logger$1.metaData.set("turnkeySubOrganizationId", (_b = (_a = this._verifiedCredential) === null || _a === void 0 ? void 0 : _a.walletProperties) === null || _b === void 0 ? void 0 : _b.turnkeySubOrganizationId);
		logger$1.metaData.set("walletId", (_c = this._verifiedCredential) === null || _c === void 0 ? void 0 : _c.id);
		let authMethod = "Unknown";
		if (this.isSessionKeyCompatible()) authMethod = "SessionKeys";
		else if (this.__authenticatorMethodHandler.recoveryType === "passkey") authMethod = "Passkey";
		else if (this.__authenticatorMethodHandler.recoveryType === "email") authMethod = "EmailAuth";
		logger$1.metaData.set("authMethod", authMethod);
	}
};
TurnkeyWalletConnectorBase.isLoadingSession = false;
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/lib/utils/findTurnkeyVerifiedCredentials/findTurnkeyVerifiedCredentials.js
var findTurnkeyVerifiedCredentials = (verifiedCredentials, chain) => verifiedCredentials === null || verifiedCredentials === void 0 ? void 0 : verifiedCredentials.filter(({ walletName, chain: vcChain }) => (walletName === null || walletName === void 0 ? void 0 : walletName.startsWith("turnkey")) && chain === vcChain);
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@_fe96dd87c3e27e4adf585ecb0adbea56/node_modules/@dynamic-labs/embedded-wallet/src/types.js
var TurnkeyWalletConnectorInfo = {
	Turnkey: {
		key: "turnkey",
		name: "Turnkey"
	},
	TurnkeyHD: {
		key: "turnkeyhd",
		name: "Turnkey HD"
	}
};
//#endregion
export { createHash as a, IframeStamper as c, hexStringToBase64url as d, uint8ArrayFromHexString as f, DeferredPromise as h, WebauthnStamper as i, isHttpClient as l, getTLD as m, findTurnkeyVerifiedCredentials as n, logger$1 as o, uint8ArrayToHexString as p, TurnkeyWalletConnectorBase as r, TURNKEY_SDK_SESSION_KEY_RETRYABLE_ERRORS as s, TurnkeyWalletConnectorInfo as t, pointDecode as u };
