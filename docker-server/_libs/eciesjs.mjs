import { t as __commonJSMin } from "../_runtime.mjs";
import { i as require_sha2, r as require_ed25519, t as require_secp256k1 } from "./noble__curves+noble__hashes.mjs";
import { n as require_node, r as require_utils$1, t as require_node$1 } from "./ecies__ciphers+noble__ciphers.mjs";
import { t as require_webcrypto } from "./noble__ciphers.mjs";
import { t as require_hkdf } from "./noble__hashes.mjs";
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/consts.js
var require_consts = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AEAD_TAG_LENGTH = exports.XCHACHA20_NONCE_LENGTH = exports.CURVE25519_PUBLIC_KEY_SIZE = exports.ETH_PUBLIC_KEY_SIZE = exports.UNCOMPRESSED_PUBLIC_KEY_SIZE = exports.COMPRESSED_PUBLIC_KEY_SIZE = exports.SECRET_KEY_LENGTH = void 0;
	exports.SECRET_KEY_LENGTH = 32;
	exports.COMPRESSED_PUBLIC_KEY_SIZE = 33;
	exports.UNCOMPRESSED_PUBLIC_KEY_SIZE = 65;
	exports.ETH_PUBLIC_KEY_SIZE = 64;
	exports.CURVE25519_PUBLIC_KEY_SIZE = 32;
	exports.XCHACHA20_NONCE_LENGTH = 24;
	exports.AEAD_TAG_LENGTH = 16;
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/config.js
var require_config = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ephemeralKeySize = exports.symmetricNonceLength = exports.symmetricAlgorithm = exports.isHkdfKeyCompressed = exports.isEphemeralKeyCompressed = exports.ellipticCurve = exports.ECIES_CONFIG = exports.Config = void 0;
	var consts_js_1 = require_consts();
	var Config = function() {
		function Config() {
			this.ellipticCurve = "secp256k1";
			this.isEphemeralKeyCompressed = false;
			this.isHkdfKeyCompressed = false;
			this.symmetricAlgorithm = "aes-256-gcm";
			this.symmetricNonceLength = 16;
		}
		Object.defineProperty(Config.prototype, "ephemeralKeySize", {
			get: function() {
				var mapping = {
					secp256k1: this.isEphemeralKeyCompressed ? consts_js_1.COMPRESSED_PUBLIC_KEY_SIZE : consts_js_1.UNCOMPRESSED_PUBLIC_KEY_SIZE,
					x25519: consts_js_1.CURVE25519_PUBLIC_KEY_SIZE,
					ed25519: consts_js_1.CURVE25519_PUBLIC_KEY_SIZE
				};
				/* v8 ignore else -- @preserve */
				if (this.ellipticCurve in mapping) return mapping[this.ellipticCurve];
				else throw new Error("Not implemented");
			},
			enumerable: false,
			configurable: true
		});
		return Config;
	}();
	exports.Config = Config;
	exports.ECIES_CONFIG = new Config();
	/** @deprecated - use individual attribute instead */
	var ellipticCurve = function() {
		return exports.ECIES_CONFIG.ellipticCurve;
	};
	exports.ellipticCurve = ellipticCurve;
	/** @deprecated - use individual attribute instead */
	var isEphemeralKeyCompressed = function() {
		return exports.ECIES_CONFIG.isEphemeralKeyCompressed;
	};
	exports.isEphemeralKeyCompressed = isEphemeralKeyCompressed;
	/** @deprecated - use individual attribute instead */
	var isHkdfKeyCompressed = function() {
		return exports.ECIES_CONFIG.isHkdfKeyCompressed;
	};
	exports.isHkdfKeyCompressed = isHkdfKeyCompressed;
	/** @deprecated - use individual attribute instead */
	var symmetricAlgorithm = function() {
		return exports.ECIES_CONFIG.symmetricAlgorithm;
	};
	exports.symmetricAlgorithm = symmetricAlgorithm;
	/** @deprecated - use individual attribute instead */
	var symmetricNonceLength = function() {
		return exports.ECIES_CONFIG.symmetricNonceLength;
	};
	exports.symmetricNonceLength = symmetricNonceLength;
	/** @deprecated - use individual attribute instead */
	var ephemeralKeySize = function() {
		return exports.ECIES_CONFIG.ephemeralKeySize;
	};
	exports.ephemeralKeySize = ephemeralKeySize;
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/utils/hex.js
var require_hex = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decodeHex = exports.remove0x = void 0;
	var utils_1 = require_utils$1();
	var remove0x = function(hex) {
		return hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
	};
	exports.remove0x = remove0x;
	var decodeHex = function(hex) {
		return (0, utils_1.hexToBytes)((0, exports.remove0x)(hex));
	};
	exports.decodeHex = decodeHex;
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/utils/elliptic.js
var require_elliptic = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hexToPublicKey = exports.convertPublicKeyFormat = exports.getSharedPoint = exports.getPublicKey = exports.isValidPrivateKey = exports.getValidSecret = void 0;
	var webcrypto_1 = require_webcrypto();
	var ed25519_1 = require_ed25519();
	var secp256k1_1 = require_secp256k1();
	var config_js_1 = require_config();
	var consts_js_1 = require_consts();
	var hex_js_1 = require_hex();
	var getValidSecret = function(curve) {
		var key;
		do
			key = (0, webcrypto_1.randomBytes)(consts_js_1.SECRET_KEY_LENGTH);
		while (!(0, exports.isValidPrivateKey)(key, curve));
		return key;
	};
	exports.getValidSecret = getValidSecret;
	var isValidPrivateKey = function(secret, curve) {
		return _exec(curve, function(curve) {
			return curve.utils.isValidSecretKey(secret);
		}, function() {
			return true;
		}, function() {
			return true;
		});
	};
	exports.isValidPrivateKey = isValidPrivateKey;
	var getPublicKey = function(secret, curve) {
		return _exec(curve, function(curve) {
			return curve.getPublicKey(secret);
		}, function(curve) {
			return curve.getPublicKey(secret);
		}, function(curve) {
			return curve.getPublicKey(secret);
		});
	};
	exports.getPublicKey = getPublicKey;
	var getSharedPoint = function(sk, pk, compressed, curve) {
		return _exec(curve, function(curve) {
			return curve.getSharedSecret(sk, pk, compressed);
		}, function(curve) {
			return curve.getSharedSecret(sk, pk);
		}, function(curve) {
			return getSharedPointOnEd25519(curve, sk, pk);
		});
	};
	exports.getSharedPoint = getSharedPoint;
	var convertPublicKeyFormat = function(pk, compressed, curve) {
		return _exec(curve, function(curve) {
			return curve.getSharedSecret(Uint8Array.from(Array(31).fill(0).concat([1])), pk, compressed);
		}, function() {
			return pk;
		}, function() {
			return pk;
		});
	};
	exports.convertPublicKeyFormat = convertPublicKeyFormat;
	var hexToPublicKey = function(hex, curve) {
		var decoded = (0, hex_js_1.decodeHex)(hex);
		return _exec(curve, function() {
			return compatEthPublicKey(decoded);
		}, function() {
			return decoded;
		}, function() {
			return decoded;
		});
	};
	exports.hexToPublicKey = hexToPublicKey;
	function _exec(curve, secp256k1Callback, x25519Callback, ed25519Callback) {
		var _curve = curve || config_js_1.ECIES_CONFIG.ellipticCurve;
		/* v8 ignore else -- @preserve */
		if (_curve === "secp256k1") return secp256k1Callback(secp256k1_1.secp256k1);
		else if (_curve === "x25519") return x25519Callback(ed25519_1.x25519);
		else if (_curve === "ed25519") return ed25519Callback(ed25519_1.ed25519);
		else throw new Error("Not implemented");
	}
	var compatEthPublicKey = function(pk) {
		if (pk.length === consts_js_1.ETH_PUBLIC_KEY_SIZE) {
			var fixed = new Uint8Array(1 + pk.length);
			fixed.set([4]);
			fixed.set(pk, 1);
			return fixed;
		}
		return pk;
	};
	var getSharedPointOnEd25519 = function(curve, sk, pk) {
		var scalar = curve.utils.getExtendedPublicKey(sk).scalar;
		return curve.Point.fromBytes(pk).multiply(scalar).toBytes();
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/utils/hash.js
var require_hash = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSharedKey = exports.deriveKey = void 0;
	var utils_1 = require_utils$1();
	var hkdf_1 = require_hkdf();
	var sha2_1 = require_sha2();
	var deriveKey = function(master, salt, info) {
		return (0, hkdf_1.hkdf)(sha2_1.sha256, master, salt, info, 32);
	};
	exports.deriveKey = deriveKey;
	var getSharedKey = function() {
		var parts = [];
		for (var _i = 0; _i < arguments.length; _i++) parts[_i] = arguments[_i];
		return (0, exports.deriveKey)(utils_1.concatBytes.apply(void 0, parts));
	};
	exports.getSharedKey = getSharedKey;
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/utils/symmetric.js
var require_symmetric = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.aesDecrypt = exports.aesEncrypt = exports.symDecrypt = exports.symEncrypt = void 0;
	var aes_1 = require_node();
	var chacha_1 = require_node$1();
	var utils_1 = require_utils$1();
	var webcrypto_1 = require_webcrypto();
	var config_js_1 = require_config();
	var consts_js_1 = require_consts();
	var symEncrypt = function(key, plainText, AAD) {
		return _exec(_encrypt, config_js_1.ECIES_CONFIG.symmetricAlgorithm, config_js_1.ECIES_CONFIG.symmetricNonceLength, key, plainText, AAD);
	};
	exports.symEncrypt = symEncrypt;
	var symDecrypt = function(key, cipherText, AAD) {
		return _exec(_decrypt, config_js_1.ECIES_CONFIG.symmetricAlgorithm, config_js_1.ECIES_CONFIG.symmetricNonceLength, key, cipherText, AAD);
	};
	exports.symDecrypt = symDecrypt;
	/** @deprecated - use `symEncrypt` instead. */
	exports.aesEncrypt = exports.symEncrypt;
	/** @deprecated - use `symDecrypt` instead. */
	exports.aesDecrypt = exports.symDecrypt;
	function _exec(callback, algorithm, nonceLength, key, data, AAD) {
		if (algorithm === "aes-256-gcm") return callback(aes_1.aes256gcm, key, data, nonceLength, consts_js_1.AEAD_TAG_LENGTH, AAD);
		else if (algorithm === "xchacha20") return callback(chacha_1.xchacha20, key, data, consts_js_1.XCHACHA20_NONCE_LENGTH, consts_js_1.AEAD_TAG_LENGTH, AAD);
		else if (algorithm === "aes-256-cbc") return callback(aes_1.aes256cbc, key, data, 16, 0);
		else throw new Error("Not implemented");
	}
	function _encrypt(func, key, data, nonceLength, tagLength, AAD) {
		var nonce = (0, webcrypto_1.randomBytes)(nonceLength);
		var encrypted = func(key, nonce, AAD).encrypt(data);
		if (tagLength === 0) return (0, utils_1.concatBytes)(nonce, encrypted);
		var cipherTextLength = encrypted.length - tagLength;
		var cipherText = encrypted.subarray(0, cipherTextLength);
		var tag = encrypted.subarray(cipherTextLength);
		return (0, utils_1.concatBytes)(nonce, tag, cipherText);
	}
	function _decrypt(func, key, data, nonceLength, tagLength, AAD) {
		var nonce = data.subarray(0, nonceLength);
		var cipher = func(key, Uint8Array.from(nonce), AAD);
		var encrypted = data.subarray(nonceLength);
		if (tagLength === 0) return cipher.decrypt(encrypted);
		var tag = encrypted.subarray(0, tagLength);
		var cipherText = encrypted.subarray(tagLength);
		return cipher.decrypt((0, utils_1.concatBytes)(cipherText, tag));
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/utils/index.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_elliptic(), exports);
	__exportStar(require_hash(), exports);
	__exportStar(require_hex(), exports);
	__exportStar(require_symmetric(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/keys/PublicKey.js
var require_PublicKey = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PublicKey = void 0;
	var utils_1 = require_utils$1();
	var index_js_1 = require_utils();
	exports.PublicKey = function() {
		function PublicKey(data, curve) {
			var compressed = (0, index_js_1.convertPublicKeyFormat)(data, true, curve);
			var uncompressed = (0, index_js_1.convertPublicKeyFormat)(data, false, curve);
			this.data = compressed;
			this.dataUncompressed = compressed.length !== uncompressed.length ? uncompressed : null;
		}
		PublicKey.fromHex = function(hex, curve) {
			return new PublicKey((0, index_js_1.hexToPublicKey)(hex, curve), curve);
		};
		Object.defineProperty(PublicKey.prototype, "_uncompressed", {
			get: function() {
				return this.dataUncompressed !== null ? this.dataUncompressed : this.data;
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(PublicKey.prototype, "uncompressed", {
			/** @deprecated - use `PublicKey.toBytes(false)` instead. You may also need `Buffer.from`. */
			get: function() {
				return Buffer.from(this._uncompressed);
			},
			enumerable: false,
			configurable: true
		});
		Object.defineProperty(PublicKey.prototype, "compressed", {
			/** @deprecated - use `PublicKey.toBytes()` instead. You may also need `Buffer.from`. */
			get: function() {
				return Buffer.from(this.data);
			},
			enumerable: false,
			configurable: true
		});
		PublicKey.prototype.toBytes = function(compressed) {
			if (compressed === void 0) compressed = true;
			return compressed ? this.data : this._uncompressed;
		};
		PublicKey.prototype.toHex = function(compressed) {
			if (compressed === void 0) compressed = true;
			return (0, utils_1.bytesToHex)(this.toBytes(compressed));
		};
		/**
		* Derives a shared secret from receiver's private key (sk) and ephemeral public key (this).
		* Opposite of `encapsulate`.
		* @see PrivateKey.encapsulate
		*
		* @param sk - Receiver's private key.
		* @param compressed - (default: `false`) Whether to use compressed or uncompressed public keys in the key derivation (secp256k1 only).
		* @returns Shared secret, derived with HKDF-SHA256.
		*/
		PublicKey.prototype.decapsulate = function(sk, compressed) {
			if (compressed === void 0) compressed = false;
			var senderPoint = this.toBytes(compressed);
			var sharedPoint = sk.multiply(this, compressed);
			return (0, index_js_1.getSharedKey)(senderPoint, sharedPoint);
		};
		PublicKey.prototype.equals = function(other) {
			return (0, utils_1.equalBytes)(this.data, other.data);
		};
		return PublicKey;
	}();
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/keys/PrivateKey.js
var require_PrivateKey = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PrivateKey = void 0;
	var utils_1 = require_utils$1();
	var index_js_1 = require_utils();
	var PublicKey_js_1 = require_PublicKey();
	exports.PrivateKey = function() {
		function PrivateKey(secret, curve) {
			this.curve = curve;
			if (secret === void 0) this.data = (0, index_js_1.getValidSecret)(curve);
			else if ((0, index_js_1.isValidPrivateKey)(secret, curve)) this.data = secret;
			else throw new Error("Invalid private key");
			this.publicKey = new PublicKey_js_1.PublicKey((0, index_js_1.getPublicKey)(this.data, curve), curve);
		}
		PrivateKey.fromHex = function(hex, curve) {
			return new PrivateKey((0, index_js_1.decodeHex)(hex), curve);
		};
		Object.defineProperty(PrivateKey.prototype, "secret", {
			/** @description From version 0.5.0, `Uint8Array` will be returned instead of `Buffer`. */
			get: function() {
				return Buffer.from(this.data);
			},
			enumerable: false,
			configurable: true
		});
		PrivateKey.prototype.toHex = function() {
			return (0, utils_1.bytesToHex)(this.data);
		};
		/**
		* Derives a shared secret from ephemeral private key (this) and receiver's public key (pk).
		* @description The shared key is 32 bytes, derived with `HKDF-SHA256(senderPoint || sharedPoint)`. See implementation for details.
		*
		* There are some variations in different ECIES implementations:
		* which key derivation function to use, compressed or uncompressed `senderPoint`/`sharedPoint`, whether to include `senderPoint`, etc.
		*
		* Because the entropy of `senderPoint`, `sharedPoint` is enough high[1], we don't need salt to derive keys.
		*
		* [1]: Two reasons: the public keys are "random" bytes (albeit secp256k1 public keys are **not uniformly** random), and ephemeral keys are generated in every encryption.
		*
		* @param pk - Receiver's public key.
		* @param compressed - (default: `false`) Whether to use compressed or uncompressed public keys in the key derivation (secp256k1 only).
		* @returns Shared secret, derived with HKDF-SHA256.
		*/
		PrivateKey.prototype.encapsulate = function(pk, compressed) {
			if (compressed === void 0) compressed = false;
			var senderPoint = this.publicKey.toBytes(compressed);
			var sharedPoint = this.multiply(pk, compressed);
			return (0, index_js_1.getSharedKey)(senderPoint, sharedPoint);
		};
		PrivateKey.prototype.multiply = function(pk, compressed) {
			if (compressed === void 0) compressed = false;
			return (0, index_js_1.getSharedPoint)(this.data, pk.toBytes(true), compressed, this.curve);
		};
		PrivateKey.prototype.equals = function(other) {
			return (0, utils_1.equalBytes)(this.data, other.data);
		};
		return PrivateKey;
	}();
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/keys/index.js
var require_keys = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PublicKey = exports.PrivateKey = void 0;
	var PrivateKey_js_1 = require_PrivateKey();
	Object.defineProperty(exports, "PrivateKey", {
		enumerable: true,
		get: function() {
			return PrivateKey_js_1.PrivateKey;
		}
	});
	var PublicKey_js_1 = require_PublicKey();
	Object.defineProperty(exports, "PublicKey", {
		enumerable: true,
		get: function() {
			return PublicKey_js_1.PublicKey;
		}
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/eciesjs@0.4.17/node_modules/eciesjs/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.utils = exports.PublicKey = exports.PrivateKey = exports.ECIES_CONFIG = void 0;
	exports.encrypt = encrypt;
	exports.decrypt = decrypt;
	var utils_1 = require_utils$1();
	var config_js_1 = require_config();
	var index_js_1 = require_keys();
	var index_js_2 = require_utils();
	/**
	* Encrypts data with a receiver's public key.
	* @description From version 0.5.0, `Uint8Array` will be returned instead of `Buffer`.
	* To keep the same behavior, use `Buffer.from(encrypt(...))`.
	*
	* @param receiverRawPK - Raw public key of the receiver, either as a hex `string` or a `Uint8Array`.
	* @param data - Data to encrypt.
	* @returns Encrypted payload, format: `public key || encrypted`.
	*/
	function encrypt(receiverRawPK, data) {
		return Buffer.from(_encrypt(receiverRawPK, data, config_js_1.ECIES_CONFIG));
	}
	function _encrypt(receiverRawPK, data, config) {
		var curve = config.ellipticCurve;
		var ephemeralSK = new index_js_1.PrivateKey(void 0, curve);
		var receiverPK = receiverRawPK instanceof Uint8Array ? new index_js_1.PublicKey(receiverRawPK, curve) : index_js_1.PublicKey.fromHex(receiverRawPK, curve);
		var sharedKey = ephemeralSK.encapsulate(receiverPK, config.isHkdfKeyCompressed);
		var ephemeralPK = ephemeralSK.publicKey.toBytes(config.isEphemeralKeyCompressed);
		var encrypted = (0, index_js_2.symEncrypt)(sharedKey, data);
		return (0, utils_1.concatBytes)(ephemeralPK, encrypted);
	}
	/**
	* Decrypts data with a receiver's private key.
	* @description From version 0.5.0, `Uint8Array` will be returned instead of `Buffer`.
	* To keep the same behavior, use `Buffer.from(decrypt(...))`.
	*
	* @param receiverRawSK - Raw private key of the receiver, either as a hex `string` or a `Uint8Array`.
	* @param data - Data to decrypt.
	* @returns Decrypted plain text.
	*/
	function decrypt(receiverRawSK, data) {
		return Buffer.from(_decrypt(receiverRawSK, data));
	}
	function _decrypt(receiverRawSK, data, config) {
		if (config === void 0) config = config_js_1.ECIES_CONFIG;
		var curve = config.ellipticCurve;
		var receiverSK = receiverRawSK instanceof Uint8Array ? new index_js_1.PrivateKey(receiverRawSK, curve) : index_js_1.PrivateKey.fromHex(receiverRawSK, curve);
		var keySize = config.ephemeralKeySize;
		var ephemeralPK = new index_js_1.PublicKey(data.subarray(0, keySize), curve);
		var encrypted = data.subarray(keySize);
		var sharedKey = ephemeralPK.decapsulate(receiverSK, config.isHkdfKeyCompressed);
		return (0, index_js_2.symDecrypt)(sharedKey, encrypted);
	}
	var config_js_2 = require_config();
	Object.defineProperty(exports, "ECIES_CONFIG", {
		enumerable: true,
		get: function() {
			return config_js_2.ECIES_CONFIG;
		}
	});
	var index_js_3 = require_keys();
	Object.defineProperty(exports, "PrivateKey", {
		enumerable: true,
		get: function() {
			return index_js_3.PrivateKey;
		}
	});
	Object.defineProperty(exports, "PublicKey", {
		enumerable: true,
		get: function() {
			return index_js_3.PublicKey;
		}
	});
	/** @deprecated - use `import * as utils from "eciesjs/utils"` instead. */
	exports.utils = {
		aesEncrypt: index_js_2.aesEncrypt,
		aesDecrypt: index_js_2.aesDecrypt,
		symEncrypt: index_js_2.symEncrypt,
		symDecrypt: index_js_2.symDecrypt,
		decodeHex: index_js_2.decodeHex,
		getValidSecret: index_js_2.getValidSecret,
		remove0x: index_js_2.remove0x
	};
}));
//#endregion
export { require_dist as t };
