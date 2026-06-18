import { t as __commonJSMin } from "../_runtime.mjs";
import { a as require_utils, n as require_hmac } from "./noble__curves+noble__hashes.mjs";
//#region ../../node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/hkdf.js
var require_hkdf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hkdf = void 0;
	exports.extract = extract;
	exports.expand = expand;
	/**
	* HKDF (RFC 5869): extract + expand in one step.
	* See https://soatok.blog/2021/11/17/understanding-hkdf/.
	* @module
	*/
	var hmac_ts_1 = require_hmac();
	var utils_ts_1 = require_utils();
	/**
	* HKDF-extract from spec. Less important part. `HKDF-Extract(IKM, salt) -> PRK`
	* Arguments position differs from spec (IKM is first one, since it is not optional)
	* @param hash - hash function that would be used (e.g. sha256)
	* @param ikm - input keying material, the initial key
	* @param salt - optional salt value (a non-secret random value)
	*/
	function extract(hash, ikm, salt) {
		(0, utils_ts_1.ahash)(hash);
		if (salt === void 0) salt = new Uint8Array(hash.outputLen);
		return (0, hmac_ts_1.hmac)(hash, (0, utils_ts_1.toBytes)(salt), (0, utils_ts_1.toBytes)(ikm));
	}
	var HKDF_COUNTER = /* @__PURE__ */ Uint8Array.from([0]);
	var EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
	/**
	* HKDF-expand from the spec. The most important part. `HKDF-Expand(PRK, info, L) -> OKM`
	* @param hash - hash function that would be used (e.g. sha256)
	* @param prk - a pseudorandom key of at least HashLen octets (usually, the output from the extract step)
	* @param info - optional context and application specific information (can be a zero-length string)
	* @param length - length of output keying material in bytes
	*/
	function expand(hash, prk, info, length = 32) {
		(0, utils_ts_1.ahash)(hash);
		(0, utils_ts_1.anumber)(length);
		const olen = hash.outputLen;
		if (length > 255 * olen) throw new Error("Length should be <= 255*HashLen");
		const blocks = Math.ceil(length / olen);
		if (info === void 0) info = EMPTY_BUFFER;
		const okm = new Uint8Array(blocks * olen);
		const HMAC = hmac_ts_1.hmac.create(hash, prk);
		const HMACTmp = HMAC._cloneInto();
		const T = new Uint8Array(HMAC.outputLen);
		for (let counter = 0; counter < blocks; counter++) {
			HKDF_COUNTER[0] = counter + 1;
			HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
			okm.set(T, olen * counter);
			HMAC._cloneInto(HMACTmp);
		}
		HMAC.destroy();
		HMACTmp.destroy();
		(0, utils_ts_1.clean)(T, HKDF_COUNTER);
		return okm.slice(0, length);
	}
	/**
	* HKDF (RFC 5869): derive keys from an initial input.
	* Combines hkdf_extract + hkdf_expand in one step
	* @param hash - hash function that would be used (e.g. sha256)
	* @param ikm - input keying material, the initial key
	* @param salt - optional salt value (a non-secret random value)
	* @param info - optional context and application specific information (can be a zero-length string)
	* @param length - length of output keying material in bytes
	* @example
	* import { hkdf } from '@noble/hashes/hkdf';
	* import { sha256 } from '@noble/hashes/sha2';
	* import { randomBytes } from '@noble/hashes/utils';
	* const inputKey = randomBytes(32);
	* const salt = randomBytes(32);
	* const info = 'application-key';
	* const hk1 = hkdf(sha256, inputKey, salt, info, 32);
	*/
	var hkdf = (hash, ikm, salt, info, length) => expand(hash, extract(hash, ikm, salt), info, length);
	exports.hkdf = hkdf;
}));
//#endregion
export { require_hkdf as t };
