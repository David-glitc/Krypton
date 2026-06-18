import { a as __require, i as __reExport, n as __esmMin, o as __toCommonJS, r as __exportAll, s as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { B as sanitizeName, L as PHANTOM_REDIRECT_CONNECTION_TYPE_KEY, R as walletReturnRoute, V as UserRejectedRequestError, a as require_bs58, z as StorageService } from "./sdk-react-core+[...].mjs";
import { A as walletConnectorEvents, B as isSamsungBrowser, C as findWalletBookWallet, D as __awaiter$4, G as NotSupportedError, J as Logger, K as DynamicError, M as isAndroid, O as isSameAddress, R as isMobile, V as PlatformService, X as eventemitter3_default, _ as Transaction, h as PublicKey, k as logger$3, n as esm_default, r as SolanaWalletConnector, t as MetaMaskSolanaWalletConnectors, v as VersionedTransaction, x as getWalletMetadataFromWalletBook } from "../@dynamic-labs-connectors/metamask-solana+[...].mjs";
import { c as TransactionConfirmationTimeoutError, i as SolanaUiTransaction, n as sponsorSolanaTransaction, r as isTxAlreadySigned, s as TransactionFailedError, t as TurnkeySolanaWalletConnectors, u as bufferToBase64 } from "./embedded-wallet-solana+[...].mjs";
import { t as DynamicWalletClient } from "../@dynamic-labs-wallet/browser-wallet-client+[...].mjs";
import { Ot as TokenScope, Tt as MFAAction } from "../@dynamic-labs-sdk/client+[...].mjs";
import { E as keccak_256, T as init_sha3 } from "../@coral-xyz/anchor.mjs";
import crypto$1 from "crypto";
import gs, { EventEmitter } from "events";
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/getProvidersFromWindow/getProvidersFromWindow.js
/**
* return the destination (value)
*
* @param {string} path - path in the obj to the item
* @returns {T[]} - array of found items
*/
var getProvidersFromWindow = (path) => {
	const splitPath = path.split(".");
	let result = window;
	const foundProviders = [];
	for (const [index, p] of Object.entries(splitPath)) {
		result = result[p];
		if (typeof result !== "object" || result === null) return [];
		if (Number(index) === splitPath.length - 1) if (Array.isArray(result)) result.forEach((p) => foundProviders.push(p));
		else if (result.providers) result.providers.forEach((p) => foundProviders.push(p));
		else foundProviders.push(result);
	}
	return foundProviders;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/handleMobileWalletRedirect/handleMobileWalletRedirect.js
var handleMobileWalletRedirect = ({ nativeLink, universalLink }) => {
	const url = encodeURIComponent(PlatformService.getUrl().href);
	const ref = encodeURIComponent(PlatformService.getOrigin());
	if (isSamsungBrowser()) PlatformService.openURL(`${nativeLink}/${url}?ref=${ref}`);
	else PlatformService.openURL(`${universalLink}/${url}?ref=${ref}`);
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/filterDuplicates/filterDuplicates.js
/**
* Filter duplicates from an array by equality.
* Uses a Set internally.
*/
var filterDuplicates = (array) => Array.from(new Set(array));
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/get/get.js
/**
* Retrieves the value at the given path of an object.
* @param obj - The object from which to extract the value.
* @param path - The path to the desired value within the object, using dot notation.
* @returns The value from the specified path, or undefined if the path is not valid.
*/
var get$2 = (obj, path) => {
	try {
		return (path.match(/[^.[\]"']+/g) || []).reduce((acc, key) => acc[key], obj);
	} catch (error) {
		return;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connector-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buffe_f795b07e227478935642fb6d19774621/node_modules/@dynamic-labs/wallet-connector-core/src/utils/ProviderLookup/ProviderLookup.js
var ProviderLookup = (installedProviders, extensionLocators) => {
	if (extensionLocators.length === 0) return;
	return installedProviders.find((provider) => {
		return extensionLocators.every((condition) => {
			return ((provider === null || provider === void 0 ? void 0 : provider[condition.flag]) || false) === condition.value;
		}) === true;
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connector-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buffe_f795b07e227478935642fb6d19774621/node_modules/@dynamic-labs/wallet-connector-core/src/utils/walletConnectDeepLinks/walletConnectDeepLinks.js
var getConnectionDeepLink = (uri, deepLinks, preference, redirectUrl) => {
	if (isAndroid()) return uri;
	const deepLink = getRegularDeepLink(uri, deepLinks, preference);
	if (!deepLink) return `${deepLink}?uri=${encodeURIComponent(uri)}`;
	const deepLinkUrl = new URL(deepLink);
	const deepLinkParams = new URLSearchParams(deepLinkUrl.search);
	deepLinkParams.set("uri", uri);
	if (redirectUrl) deepLinkParams.set("redirectUrl", redirectUrl);
	deepLinkUrl.search = deepLinkParams.toString();
	return deepLinkUrl.toString();
};
var getRegularDeepLink = (uri, deepLinks, preference) => {
	var _a, _b, _c, _d;
	if (isAndroid()) return uri.split("?")[0];
	const index = isMobile() ? "mobile" : "desktop";
	let origin;
	if (preference === "native") origin = ((_a = deepLinks[index]) === null || _a === void 0 ? void 0 : _a.native) || ((_b = deepLinks[index]) === null || _b === void 0 ? void 0 : _b.universal);
	else origin = ((_c = deepLinks[index]) === null || _c === void 0 ? void 0 : _c.universal) || ((_d = deepLinks[index]) === null || _d === void 0 ? void 0 : _d.native);
	return origin || "";
};
var getDeepLink = ({ mode, uri = "", deepLinks, preference, redirectUrl }) => {
	if (!deepLinks) return "";
	switch (mode) {
		case "connection": return getConnectionDeepLink(uri, deepLinks, preference, redirectUrl);
		case "regular": return getRegularDeepLink(uri, deepLinks, preference);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connector-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buffe_f795b07e227478935642fb6d19774621/node_modules/@dynamic-labs/wallet-connector-core/src/utils/walletConnectDeepLinks/performPlatformSpecificConnectionMethod.js
var performPlatformSpecificConnectionMethod = (uri, deepLinks, opts, preference, redirectUrl) => __awaiter$4(void 0, void 0, void 0, function* () {
	var _a, _b, _c;
	const deepLink = getDeepLink({
		deepLinks,
		mode: "connection",
		preference,
		redirectUrl,
		uri
	});
	if (isMobile()) {
		const currentUrl = PlatformService.getUrl();
		walletReturnRoute.set(currentUrl.pathname);
		yield PlatformService.openURL(deepLink);
	} else {
		if ((_a = deepLinks === null || deepLinks === void 0 ? void 0 : deepLinks.desktop) === null || _a === void 0 ? void 0 : _a.native) (_b = opts.onDesktopUri) === null || _b === void 0 || _b.call(opts, deepLink);
		(_c = opts.onDisplayUri) === null || _c === void 0 || _c.call(opts, uri);
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-book@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/wallet-book/src/helpers/findWalletBookWalletByNameAndChain.js
var findWalletBookWalletByNameAndChain = (walletBook, walletName, chain) => {
	var _a;
	return Object.values((_a = walletBook === null || walletBook === void 0 ? void 0 : walletBook.wallets) !== null && _a !== void 0 ? _a : {}).find((wallet) => {
		var _a, _b;
		return wallet.name === walletName && ((_b = (_a = wallet.injectedConfig) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.chain) === chain;
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1._dc4aa6854ef4161dca3d011934dd96b7/node_modules/@dynamic-labs/solana-core/src/utils/isVersionedTransaction/isVersionedTransaction.js
var isVersionedTransaction$1 = (transaction) => "version" in transaction;
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/_virtual/_tslib.js
var import_bs58 = /* @__PURE__ */ __toESM(require_bs58(), 1);
init_sha3();
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
function __awaiter$3(thisArg, _arguments, P, generator) {
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
//#region ../../node_modules/.pnpm/@wallet-standard+app@1.0.1/node_modules/@wallet-standard/app/lib/esm/wallets.js
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AppReadyEvent_detail;
var wallets = void 0;
var registered = /* @__PURE__ */ new Set();
var listeners = {};
/**
* Get an API for {@link Wallets.get | getting}, {@link Wallets.on | listening for}, and
* {@link Wallets.register | registering} {@link "@wallet-standard/base".Wallet | Wallets}.
*
* When called for the first time --
*
* This dispatches a {@link "@wallet-standard/base".WindowAppReadyEvent} to notify each Wallet that the app is ready
* to register it.
*
* This also adds a listener for {@link "@wallet-standard/base".WindowRegisterWalletEvent} to listen for a notification
* from each Wallet that the Wallet is ready to be registered by the app.
*
* This combination of event dispatch and listener guarantees that each Wallet will be registered synchronously as soon
* as the app is ready whether the app loads before or after each Wallet.
*
* @return API for getting, listening for, and registering Wallets.
*
* @group App
*/
function getWallets() {
	if (wallets) return wallets;
	wallets = Object.freeze({
		register,
		get: get$1,
		on: on$3
	});
	if (typeof window === "undefined") return wallets;
	const api = Object.freeze({ register });
	try {
		window.addEventListener("wallet-standard:register-wallet", ({ detail: callback }) => callback(api));
	} catch (error) {
		console.error("wallet-standard:register-wallet event listener could not be added\n", error);
	}
	try {
		window.dispatchEvent(new AppReadyEvent(api));
	} catch (error) {
		console.error("wallet-standard:app-ready event could not be dispatched\n", error);
	}
	return wallets;
}
function register(...wallets) {
	wallets = wallets.filter((wallet) => !registered.has(wallet));
	if (!wallets.length) return () => {};
	wallets.forEach((wallet) => registered.add(wallet));
	listeners["register"]?.forEach((listener) => guard(() => listener(...wallets)));
	return function unregister() {
		wallets.forEach((wallet) => registered.delete(wallet));
		listeners["unregister"]?.forEach((listener) => guard(() => listener(...wallets)));
	};
}
function get$1() {
	return [...registered];
}
function on$3(event, listener) {
	listeners[event]?.push(listener) || (listeners[event] = [listener]);
	return function off() {
		listeners[event] = listeners[event]?.filter((existingListener) => listener !== existingListener);
	};
}
function guard(callback) {
	try {
		callback();
	} catch (error) {
		console.error(error);
	}
}
var AppReadyEvent = class extends Event {
	constructor(api) {
		super("wallet-standard:app-ready", {
			bubbles: false,
			cancelable: false,
			composed: false
		});
		_AppReadyEvent_detail.set(this, void 0);
		__classPrivateFieldSet(this, _AppReadyEvent_detail, api, "f");
	}
	get detail() {
		return __classPrivateFieldGet(this, _AppReadyEvent_detail, "f");
	}
	get type() {
		return "wallet-standard:app-ready";
	}
	/** @deprecated */
	preventDefault() {
		throw new Error("preventDefault cannot be called");
	}
	/** @deprecated */
	stopImmediatePropagation() {
		throw new Error("stopImmediatePropagation cannot be called");
	}
	/** @deprecated */
	stopPropagation() {
		throw new Error("stopPropagation cannot be called");
	}
};
_AppReadyEvent_detail = /* @__PURE__ */ new WeakMap();
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/walletStandard/findWalletProviderFromWalletStandard/findWalletProviderFromWalletStandard.js
var findWalletProviderFromWalletStandard = (injectConfig) => {
	const { walletStandardLocators } = injectConfig;
	if (!walletStandardLocators || walletStandardLocators.length === 0) return;
	const wallets = getWallets().get();
	return walletStandardLocators.reduce((provider, walletStandardLocator) => {
		/**
		* Return early if the provider is already found
		*/
		if (provider) return provider;
		const wallet = wallets.find((w) => w.name === walletStandardLocator.name);
		if (!wallet) return void 0;
		return get$2(wallet, walletStandardLocator.locator);
	}, void 0);
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/utils/isSignedMessage.js
var isSignedMessage = (message) => Boolean(message) && message.signature !== void 0;
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/SolProviderHelper/SolProviderHelper.js
var SolProviderHelper = class {
	constructor(connector) {
		this.walletBookWallet = findWalletBookWallet(connector.walletBook, connector.key);
		this.connector = connector;
	}
	getInjectedConfig() {
		var _a;
		const injectedConfig = (_a = this.walletBookWallet) === null || _a === void 0 ? void 0 : _a.injectedConfig;
		return injectedConfig === null || injectedConfig === void 0 ? void 0 : injectedConfig.find((c) => c.chain === this.connector.connectedChain.toLowerCase());
	}
	getInstalledProvider() {
		const config = this.getInjectedConfig();
		if (!config || !config.extensionLocators) return;
		return this.installedProviderLookup(config.extensionLocators);
	}
	installedProviders() {
		var _a, _b;
		const config = this.getInjectedConfig();
		if (!config) return [];
		const providers = [];
		if (config.windowLocations) for (const windowLocation of config.windowLocations) {
			const foundProviders = getProvidersFromWindow(windowLocation);
			if (foundProviders && foundProviders.length) providers.push(...foundProviders);
		}
		if (config.extensionLocators.length !== 0 && window.solana) if (!window.solana.providers) providers.push(window.solana);
		else window.solana.providers.forEach((provider) => providers.push(provider));
		if (((_b = (_a = config.walletStandardLocators) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0) {
			const walletStandardProvider = findWalletProviderFromWalletStandard(config);
			if (walletStandardProvider) providers.push(walletStandardProvider);
		}
		return providers;
	}
	installedProviderLookup(extensionLocators) {
		const allInstalledProviders = this.installedProviders();
		if (extensionLocators.length === 0) return allInstalledProviders[0];
		return ProviderLookup(allInstalledProviders, extensionLocators);
	}
	findProvider() {
		return this.connector.findProvider();
	}
	isInstalledHelper() {
		return this.findProvider() !== void 0;
	}
	getAddress() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			const provider = this.findProvider();
			if (!provider) return;
			yield provider.connect();
			return (_a = provider.publicKey) === null || _a === void 0 ? void 0 : _a.toString();
		});
	}
	connect() {
		return __awaiter$3(this, void 0, void 0, function* () {
			const provider = this.findProvider();
			if (!provider) {
				logger$3.error("No Solanaprovider found to connect", { connector: this.connector.name });
				return;
			}
			try {
				if (!provider.isConnected) yield provider.connect();
				return provider;
			} catch (err) {
				logger$3.error("Error connecting to Solanaprovider", {
					connector: this.connector.name,
					error: err
				});
				return;
			}
		});
	}
	signMessage(messageToSign) {
		return __awaiter$3(this, void 0, void 0, function* () {
			if (!(yield this.getAddress())) return void 0;
			const provider = this.findProvider();
			if (!provider) return void 0;
			const encodedMessage = new TextEncoder().encode(messageToSign);
			const signedMessage = yield provider.signMessage(encodedMessage, "utf8");
			if (!signedMessage) return void 0;
			return bufferToBase64(isSignedMessage(signedMessage) ? signedMessage.signature : signedMessage);
		});
	}
	handleAccountChange(walletConnector, web3Provider, address) {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			if (!address) {
				yield web3Provider === null || web3Provider === void 0 ? void 0 : web3Provider.connect();
				if ((_a = web3Provider === null || web3Provider === void 0 ? void 0 : web3Provider.publicKey) === null || _a === void 0 ? void 0 : _a.toString()) walletConnector.emit("accountChange", { accounts: [web3Provider.publicKey.toString()] });
				return;
			}
			if (address.toString()) walletConnector.emit("accountChange", { accounts: [address.toString()] });
		});
	}
	_setupEventListeners() {
		const provider = this.findProvider();
		if (!provider) {
			logger$3.warn("Provider not found", { connector: this.connector });
			return;
		}
		if (!provider.on) {
			logger$3.warn("Provider does not support event listeners", {
				connector: this.connector,
				provider
			});
			return;
		}
		provider.on("accountChanged", (publicKey) => this.handleAccountChange(this.connector, provider, publicKey));
		provider.on("disconnect", () => this.connector.emit("disconnect"));
	}
	_teardownEventListeners() {
		const provider = this.findProvider();
		if (!provider) return;
		provider.removeAllListeners();
	}
	getConnectedAccounts() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a, _b;
			const provider = this.findProvider();
			if (!provider) return [];
			let connectionResult;
			try {
				if (!provider.isConnected) connectionResult = yield provider.connect({ onlyIfTrusted: true });
			} catch (e) {
				return [];
			}
			const address = connectionResult === null || connectionResult === void 0 ? void 0 : connectionResult.address;
			if (address) return [address];
			try {
				const publicKey = (_a = connectionResult === null || connectionResult === void 0 ? void 0 : connectionResult.publicKey) !== null && _a !== void 0 ? _a : (_b = provider.publicKey) === null || _b === void 0 ? void 0 : _b.toString();
				if (publicKey) return [publicKey === null || publicKey === void 0 ? void 0 : publicKey.toString()];
			} catch (e) {
				logger$3.debug("Error getting public key", {
					connector: this.connector,
					error: e
				});
			}
			return [];
		});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/errors/SignMessageNotSupportedError.js
var SignMessageNotSupportedError = class extends NotSupportedError {
	constructor(walletName) {
		super(`Message signing is currently not supported on ${walletName} hardware wallet.
    You can use signMessageViaTransaction instead to achieve similar functionality
    by signing a transaction with a memo instruction.
    You can read more about it here https://github.com/solana-labs/solana/issues/21366`);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/utils/logger.js
var logger$2 = new Logger("solana");
//#endregion
//#region ../../node_modules/.pnpm/detect-browser@5.3.0/node_modules/detect-browser/es/index.js
var __spreadArray = function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
var BrowserInfo = function() {
	function BrowserInfo(name, version, os) {
		this.name = name;
		this.version = version;
		this.os = os;
		this.type = "browser";
	}
	return BrowserInfo;
}();
var NodeInfo = function() {
	function NodeInfo(version) {
		this.version = version;
		this.type = "node";
		this.name = "node";
		this.os = process.platform;
	}
	return NodeInfo;
}();
var SearchBotDeviceInfo = function() {
	function SearchBotDeviceInfo(name, version, os, bot) {
		this.name = name;
		this.version = version;
		this.os = os;
		this.bot = bot;
		this.type = "bot-device";
	}
	return SearchBotDeviceInfo;
}();
var BotInfo = function() {
	function BotInfo() {
		this.type = "bot";
		this.bot = true;
		this.name = "bot";
		this.version = null;
		this.os = null;
	}
	return BotInfo;
}();
var ReactNativeInfo = function() {
	function ReactNativeInfo() {
		this.type = "react-native";
		this.name = "react-native";
		this.version = null;
		this.os = null;
	}
	return ReactNativeInfo;
}();
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|curl|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
	["aol", /AOLShield\/([0-9\._]+)/],
	["edge", /Edge\/([0-9\._]+)/],
	["edge-ios", /EdgiOS\/([0-9\._]+)/],
	["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
	["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
	["samsung", /SamsungBrowser\/([0-9\.]+)/],
	["silk", /\bSilk\/([0-9._-]+)\b/],
	["miui", /MiuiBrowser\/([0-9\.]+)$/],
	["beaker", /BeakerBrowser\/([0-9\.]+)/],
	["edge-chromium", /EdgA?\/([0-9\.]+)/],
	["chromium-webview", /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
	["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
	["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
	["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
	["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
	["fxios", /FxiOS\/([0-9\.]+)/],
	["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/],
	["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
	["opera", /OPR\/([0-9\.]+)(:?\s|$)/],
	["pie", /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
	["pie", /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
	["netfront", /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
	["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
	["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
	["ie", /MSIE\s(7\.0)/],
	["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
	["android", /Android\s([0-9\.]+)/],
	["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
	["safari", /Version\/([0-9\._]+).*Safari/],
	["facebook", /FB[AS]V\/([0-9\.]+)/],
	["instagram", /Instagram\s([0-9\.]+)/],
	["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
	["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
	["curl", /^curl\/([0-9\.]+)$/],
	["searchbot", SEARCHBOX_UA_REGEX]
];
var operatingSystemRules = [
	["iOS", /iP(hone|od|ad)/],
	["Android OS", /Android/],
	["BlackBerry OS", /BlackBerry|BB10/],
	["Windows Mobile", /IEMobile/],
	["Amazon OS", /Kindle/],
	["Windows 3.11", /Win16/],
	["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
	["Windows 98", /(Windows 98)|(Win98)/],
	["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
	["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
	["Windows Server 2003", /(Windows NT 5.2)/],
	["Windows Vista", /(Windows NT 6.0)/],
	["Windows 7", /(Windows NT 6.1)/],
	["Windows 8", /(Windows NT 6.2)/],
	["Windows 8.1", /(Windows NT 6.3)/],
	["Windows 10", /(Windows NT 10.0)/],
	["Windows ME", /Windows ME/],
	["Windows CE", /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
	["Open BSD", /OpenBSD/],
	["Sun OS", /SunOS/],
	["Chrome OS", /CrOS/],
	["Linux", /(Linux)|(X11)/],
	["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
	["QNX", /QNX/],
	["BeOS", /BeOS/],
	["OS/2", /OS\/2/]
];
function detect(userAgent) {
	if (!!userAgent) return parseUserAgent(userAgent);
	if (typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative") return new ReactNativeInfo();
	if (typeof navigator !== "undefined") return parseUserAgent(navigator.userAgent);
	return getNodeVersion();
}
function matchUserAgent(ua) {
	return ua !== "" && userAgentRules.reduce(function(matched, _a) {
		var browser = _a[0], regex = _a[1];
		if (matched) return matched;
		var uaMatch = regex.exec(ua);
		return !!uaMatch && [browser, uaMatch];
	}, false);
}
function parseUserAgent(ua) {
	var matchedRule = matchUserAgent(ua);
	if (!matchedRule) return null;
	var name = matchedRule[0], match = matchedRule[1];
	if (name === "searchbot") return new BotInfo();
	var versionParts = match[1] && match[1].split(".").join("_").split("_").slice(0, 3);
	if (versionParts) {
		if (versionParts.length < REQUIRED_VERSION_PARTS) versionParts = __spreadArray(__spreadArray([], versionParts, true), createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length), true);
	} else versionParts = [];
	var version = versionParts.join(".");
	var os = detectOS(ua);
	var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
	if (searchBotMatch && searchBotMatch[1]) return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
	return new BrowserInfo(name, version, os);
}
function detectOS(ua) {
	for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
		var _a = operatingSystemRules[ii], os = _a[0];
		if (_a[1].exec(ua)) return os;
	}
	return null;
}
function getNodeVersion() {
	return typeof process !== "undefined" && process.version ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
	var output = [];
	for (var ii = 0; ii < count; ii++) output.push("0");
	return output;
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/utils/delay.js
var require_delay = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.delay = void 0;
	function delay(timeout) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, timeout);
		});
	}
	exports.delay = delay;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/constants/misc.js
var require_misc = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ONE_THOUSAND = exports.ONE_HUNDRED = void 0;
	exports.ONE_HUNDRED = 100;
	exports.ONE_THOUSAND = 1e3;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/constants/time.js
var require_time$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ONE_YEAR = exports.FOUR_WEEKS = exports.THREE_WEEKS = exports.TWO_WEEKS = exports.ONE_WEEK = exports.THIRTY_DAYS = exports.SEVEN_DAYS = exports.FIVE_DAYS = exports.THREE_DAYS = exports.ONE_DAY = exports.TWENTY_FOUR_HOURS = exports.TWELVE_HOURS = exports.SIX_HOURS = exports.THREE_HOURS = exports.ONE_HOUR = exports.SIXTY_MINUTES = exports.THIRTY_MINUTES = exports.TEN_MINUTES = exports.FIVE_MINUTES = exports.ONE_MINUTE = exports.SIXTY_SECONDS = exports.THIRTY_SECONDS = exports.TEN_SECONDS = exports.FIVE_SECONDS = exports.ONE_SECOND = void 0;
	exports.ONE_SECOND = 1;
	exports.FIVE_SECONDS = 5;
	exports.TEN_SECONDS = 10;
	exports.THIRTY_SECONDS = 30;
	exports.SIXTY_SECONDS = 60;
	exports.ONE_MINUTE = exports.SIXTY_SECONDS;
	exports.FIVE_MINUTES = exports.ONE_MINUTE * 5;
	exports.TEN_MINUTES = exports.ONE_MINUTE * 10;
	exports.THIRTY_MINUTES = exports.ONE_MINUTE * 30;
	exports.SIXTY_MINUTES = exports.ONE_MINUTE * 60;
	exports.ONE_HOUR = exports.SIXTY_MINUTES;
	exports.THREE_HOURS = exports.ONE_HOUR * 3;
	exports.SIX_HOURS = exports.ONE_HOUR * 6;
	exports.TWELVE_HOURS = exports.ONE_HOUR * 12;
	exports.TWENTY_FOUR_HOURS = exports.ONE_HOUR * 24;
	exports.ONE_DAY = exports.TWENTY_FOUR_HOURS;
	exports.THREE_DAYS = exports.ONE_DAY * 3;
	exports.FIVE_DAYS = exports.ONE_DAY * 5;
	exports.SEVEN_DAYS = exports.ONE_DAY * 7;
	exports.THIRTY_DAYS = exports.ONE_DAY * 30;
	exports.ONE_WEEK = exports.SEVEN_DAYS;
	exports.TWO_WEEKS = exports.ONE_WEEK * 2;
	exports.THREE_WEEKS = exports.ONE_WEEK * 3;
	exports.FOUR_WEEKS = exports.ONE_WEEK * 4;
	exports.ONE_YEAR = exports.ONE_DAY * 365;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/constants/index.js
var require_constants$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1$3 = __require("tslib");
	tslib_1$3.__exportStar(require_misc(), exports);
	tslib_1$3.__exportStar(require_time$1(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/utils/convert.js
var require_convert = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromMiliseconds = exports.toMiliseconds = void 0;
	var constants_1 = require_constants$1();
	function toMiliseconds(seconds) {
		return seconds * constants_1.ONE_THOUSAND;
	}
	exports.toMiliseconds = toMiliseconds;
	function fromMiliseconds(miliseconds) {
		return Math.floor(miliseconds / constants_1.ONE_THOUSAND);
	}
	exports.fromMiliseconds = fromMiliseconds;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/utils/index.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1$2 = __require("tslib");
	tslib_1$2.__exportStar(require_delay(), exports);
	tslib_1$2.__exportStar(require_convert(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/watch.js
var require_watch$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Watch = void 0;
	var Watch = class {
		constructor() {
			this.timestamps = /* @__PURE__ */ new Map();
		}
		start(label) {
			if (this.timestamps.has(label)) throw new Error(`Watch already started for label: ${label}`);
			this.timestamps.set(label, { started: Date.now() });
		}
		stop(label) {
			const timestamp = this.get(label);
			if (typeof timestamp.elapsed !== "undefined") throw new Error(`Watch already stopped for label: ${label}`);
			const elapsed = Date.now() - timestamp.started;
			this.timestamps.set(label, {
				started: timestamp.started,
				elapsed
			});
		}
		get(label) {
			const timestamp = this.timestamps.get(label);
			if (typeof timestamp === "undefined") throw new Error(`No timestamp found for label: ${label}`);
			return timestamp;
		}
		elapsed(label) {
			const timestamp = this.get(label);
			return timestamp.elapsed || Date.now() - timestamp.started;
		}
	};
	exports.Watch = Watch;
	exports.default = Watch;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/types/watch.js
var require_watch = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IWatch = void 0;
	var IWatch = class {};
	exports.IWatch = IWatch;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/types/index.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	__require("tslib").__exportStar(require_watch(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+time@1.0.2/node_modules/@walletconnect/time/dist/cjs/index.js
var require_cjs$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1$1 = __require("tslib");
	tslib_1$1.__exportStar(require_utils(), exports);
	tslib_1$1.__exportStar(require_watch$1(), exports);
	tslib_1$1.__exportStar(require_types(), exports);
	tslib_1$1.__exportStar(require_constants$1(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+window-getters@1.0.1/node_modules/@walletconnect/window-getters/dist/cjs/index.js
var require_cjs$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getLocalStorage = exports.getLocalStorageOrThrow = exports.getCrypto = exports.getCryptoOrThrow = exports.getLocation = exports.getLocationOrThrow = exports.getNavigator = exports.getNavigatorOrThrow = exports.getDocument = exports.getDocumentOrThrow = exports.getFromWindowOrThrow = exports.getFromWindow = void 0;
	function getFromWindow(name) {
		let res = void 0;
		if (typeof window !== "undefined" && typeof window[name] !== "undefined") res = window[name];
		return res;
	}
	exports.getFromWindow = getFromWindow;
	function getFromWindowOrThrow(name) {
		const res = getFromWindow(name);
		if (!res) throw new Error(`${name} is not defined in Window`);
		return res;
	}
	exports.getFromWindowOrThrow = getFromWindowOrThrow;
	function getDocumentOrThrow() {
		return getFromWindowOrThrow("document");
	}
	exports.getDocumentOrThrow = getDocumentOrThrow;
	function getDocument() {
		return getFromWindow("document");
	}
	exports.getDocument = getDocument;
	function getNavigatorOrThrow() {
		return getFromWindowOrThrow("navigator");
	}
	exports.getNavigatorOrThrow = getNavigatorOrThrow;
	function getNavigator() {
		return getFromWindow("navigator");
	}
	exports.getNavigator = getNavigator;
	function getLocationOrThrow() {
		return getFromWindowOrThrow("location");
	}
	exports.getLocationOrThrow = getLocationOrThrow;
	function getLocation() {
		return getFromWindow("location");
	}
	exports.getLocation = getLocation;
	function getCryptoOrThrow() {
		return getFromWindowOrThrow("crypto");
	}
	exports.getCryptoOrThrow = getCryptoOrThrow;
	function getCrypto() {
		return getFromWindow("crypto");
	}
	exports.getCrypto = getCrypto;
	function getLocalStorageOrThrow() {
		return getFromWindowOrThrow("localStorage");
	}
	exports.getLocalStorageOrThrow = getLocalStorageOrThrow;
	function getLocalStorage() {
		return getFromWindow("localStorage");
	}
	exports.getLocalStorage = getLocalStorage;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+window-metadata@1.0.1/node_modules/@walletconnect/window-metadata/dist/cjs/index.js
var require_cjs$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getWindowMetadata = void 0;
	var window_getters_1 = require_cjs$2();
	function getWindowMetadata() {
		let doc;
		let loc;
		try {
			doc = window_getters_1.getDocumentOrThrow();
			loc = window_getters_1.getLocationOrThrow();
		} catch (e) {
			return null;
		}
		function getIcons() {
			const links = doc.getElementsByTagName("link");
			const icons = [];
			for (let i = 0; i < links.length; i++) {
				const link = links[i];
				const rel = link.getAttribute("rel");
				if (rel) {
					if (rel.toLowerCase().indexOf("icon") > -1) {
						const href = link.getAttribute("href");
						if (href) if (href.toLowerCase().indexOf("https:") === -1 && href.toLowerCase().indexOf("http:") === -1 && href.indexOf("//") !== 0) {
							let absoluteHref = loc.protocol + "//" + loc.host;
							if (href.indexOf("/") === 0) absoluteHref += href;
							else {
								const path = loc.pathname.split("/");
								path.pop();
								const finalPath = path.join("/");
								absoluteHref += finalPath + "/" + href;
							}
							icons.push(absoluteHref);
						} else if (href.indexOf("//") === 0) {
							const absoluteUrl = loc.protocol + href;
							icons.push(absoluteUrl);
						} else icons.push(href);
					}
				}
			}
			return icons;
		}
		function getWindowMetadataOfAny(...args) {
			const metaTags = doc.getElementsByTagName("meta");
			for (let i = 0; i < metaTags.length; i++) {
				const tag = metaTags[i];
				const attributes = [
					"itemprop",
					"property",
					"name"
				].map((target) => tag.getAttribute(target)).filter((attr) => {
					if (attr) return args.includes(attr);
					return false;
				});
				if (attributes.length && attributes) {
					const content = tag.getAttribute("content");
					if (content) return content;
				}
			}
			return "";
		}
		function getName() {
			let name = getWindowMetadataOfAny("name", "og:site_name", "og:title", "twitter:title");
			if (!name) name = doc.title;
			return name;
		}
		function getDescription() {
			return getWindowMetadataOfAny("description", "og:description", "twitter:description", "keywords");
		}
		const name = getName();
		return {
			description: getDescription(),
			url: loc.origin,
			icons: getIcons(),
			name
		};
	}
	exports.getWindowMetadata = getWindowMetadata;
}));
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
	if (!value) return false;
	if (typeof value !== "string") return false;
	return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/data/size.js
/**
* @description Retrieves the size of the value (in bytes).
*
* @param value The value (hex or byte array) to retrieve the size of.
* @returns The size of the value (in bytes).
*/
function size(value) {
	if (isHex(value, { strict: false })) return Math.ceil((value.length - 2) / 2);
	return value.length;
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/errors/version.js
var version$2 = "2.31.0";
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/errors/base.js
var errorConfig = {
	getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
	version: `viem@${version$2}`
};
var BaseError = class BaseError extends Error {
	constructor(shortMessage, args = {}) {
		const details = (() => {
			if (args.cause instanceof BaseError) return args.cause.details;
			if (args.cause?.message) return args.cause.message;
			return args.details;
		})();
		const docsPath = (() => {
			if (args.cause instanceof BaseError) return args.cause.docsPath || args.docsPath;
			return args.docsPath;
		})();
		const docsUrl = errorConfig.getDocsUrl?.({
			...args,
			docsPath
		});
		const message = [
			shortMessage || "An error occurred.",
			"",
			...args.metaMessages ? [...args.metaMessages, ""] : [],
			...docsUrl ? [`Docs: ${docsUrl}`] : [],
			...details ? [`Details: ${details}`] : [],
			...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
		].join("\n");
		super(message, args.cause ? { cause: args.cause } : void 0);
		Object.defineProperty(this, "details", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "docsPath", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "metaMessages", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "shortMessage", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "version", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "name", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: "BaseError"
		});
		this.details = details;
		this.docsPath = docsPath;
		this.metaMessages = args.metaMessages;
		this.name = args.name ?? this.name;
		this.shortMessage = shortMessage;
		this.version = version$2;
	}
	walk(fn) {
		return walk(this, fn);
	}
};
function walk(err, fn) {
	if (fn?.(err)) return err;
	if (err && typeof err === "object" && "cause" in err && err.cause !== void 0) return walk(err.cause, fn);
	return fn ? null : err;
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/errors/data.js
var SizeExceedsPaddingSizeError = class extends BaseError {
	constructor({ size, targetSize, type }) {
		super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
	}
};
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size = 32 } = {}) {
	if (typeof hexOrBytes === "string") return padHex(hexOrBytes, {
		dir,
		size
	});
	return padBytes(hexOrBytes, {
		dir,
		size
	});
}
function padHex(hex_, { dir, size = 32 } = {}) {
	if (size === null) return hex_;
	const hex = hex_.replace("0x", "");
	if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError({
		size: Math.ceil(hex.length / 2),
		targetSize: size,
		type: "hex"
	});
	return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size * 2, "0")}`;
}
function padBytes(bytes, { dir, size = 32 } = {}) {
	if (size === null) return bytes;
	if (bytes.length > size) throw new SizeExceedsPaddingSizeError({
		size: bytes.length,
		targetSize: size,
		type: "bytes"
	});
	const paddedBytes = new Uint8Array(size);
	for (let i = 0; i < size; i++) {
		const padEnd = dir === "right";
		paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
	}
	return paddedBytes;
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError = class extends BaseError {
	constructor({ max, min, signed, size, value }) {
		super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
	}
};
var SizeOverflowError = class extends BaseError {
	constructor({ givenSize, maxSize }) {
		super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
	}
};
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size$1 }) {
	if (size(hexOrBytes) > size$1) throw new SizeOverflowError({
		givenSize: size(hexOrBytes),
		maxSize: size$1
	});
}
/**
* Decodes a hex value into a bigint.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns BigInt value.
*
* @example
* import { hexToBigInt } from 'viem'
* const data = hexToBigInt('0x1a4', { signed: true })
* // 420n
*
* @example
* import { hexToBigInt } from 'viem'
* const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // 420n
*/
function hexToBigInt(hex, opts = {}) {
	const { signed } = opts;
	if (opts.size) assertSize(hex, { size: opts.size });
	const value = BigInt(hex);
	if (!signed) return value;
	const size = (hex.length - 2) / 2;
	if (value <= (1n << BigInt(size) * 8n - 1n) - 1n) return value;
	return value - BigInt(`0x${"f".padStart(size * 2, "f")}`) - 1n;
}
/**
* Decodes a hex string into a number.
*
* - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
*
* @param hex Hex value to decode.
* @param opts Options.
* @returns Number value.
*
* @example
* import { hexToNumber } from 'viem'
* const data = hexToNumber('0x1a4')
* // 420
*
* @example
* import { hexToNumber } from 'viem'
* const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
* // 420
*/
function hexToNumber(hex, opts = {}) {
	return Number(hexToBigInt(hex, opts));
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/encoding/toHex.js
var hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
/**
* Encodes a string, number, bigint, or ByteArray into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex
* - Example: https://viem.sh/docs/utilities/toHex#usage
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { toHex } from 'viem'
* const data = toHex('Hello world')
* // '0x48656c6c6f20776f726c6421'
*
* @example
* import { toHex } from 'viem'
* const data = toHex(420)
* // '0x1a4'
*
* @example
* import { toHex } from 'viem'
* const data = toHex('Hello world', { size: 32 })
* // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
*/
function toHex(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToHex(value, opts);
	if (typeof value === "string") return stringToHex(value, opts);
	if (typeof value === "boolean") return boolToHex(value, opts);
	return bytesToHex(value, opts);
}
/**
* Encodes a boolean into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#booltohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(true)
* // '0x1'
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(false)
* // '0x0'
*
* @example
* import { boolToHex } from 'viem'
* const data = boolToHex(true, { size: 32 })
* // '0x0000000000000000000000000000000000000000000000000000000000000001'
*/
function boolToHex(value, opts = {}) {
	const hex = `0x${Number(value)}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, { size: opts.size });
	}
	return hex;
}
/**
* Encodes a bytes array into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { bytesToHex } from 'viem'
* const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
* // '0x48656c6c6f20576f726c6421'
*
* @example
* import { bytesToHex } from 'viem'
* const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
*/
function bytesToHex(value, opts = {}) {
	let string = "";
	for (let i = 0; i < value.length; i++) string += hexes[value[i]];
	const hex = `0x${string}`;
	if (typeof opts.size === "number") {
		assertSize(hex, { size: opts.size });
		return pad(hex, {
			dir: "right",
			size: opts.size
		});
	}
	return hex;
}
/**
* Encodes a number or bigint into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { numberToHex } from 'viem'
* const data = numberToHex(420)
* // '0x1a4'
*
* @example
* import { numberToHex } from 'viem'
* const data = numberToHex(420, { size: 32 })
* // '0x00000000000000000000000000000000000000000000000000000000000001a4'
*/
function numberToHex(value_, opts = {}) {
	const { signed, size } = opts;
	const value = BigInt(value_);
	let maxValue;
	if (size) if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;
	else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
	else if (typeof value_ === "number") maxValue = BigInt(Number.MAX_SAFE_INTEGER);
	const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
	if (maxValue && value > maxValue || value < minValue) {
		const suffix = typeof value_ === "bigint" ? "n" : "";
		throw new IntegerOutOfRangeError({
			max: maxValue ? `${maxValue}${suffix}` : void 0,
			min: `${minValue}${suffix}`,
			signed,
			size,
			value: `${value_}${suffix}`
		});
	}
	const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
	if (size) return pad(hex, { size });
	return hex;
}
var encoder$1 = /*#__PURE__*/ new TextEncoder();
/**
* Encodes a UTF-8 string into a hex string
*
* - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
*
* @param value Value to encode.
* @param opts Options.
* @returns Hex value.
*
* @example
* import { stringToHex } from 'viem'
* const data = stringToHex('Hello World!')
* // '0x48656c6c6f20576f726c6421'
*
* @example
* import { stringToHex } from 'viem'
* const data = stringToHex('Hello World!', { size: 32 })
* // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
*/
function stringToHex(value_, opts = {}) {
	return bytesToHex(encoder$1.encode(value_), opts);
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/encoding/toBytes.js
var encoder = /*#__PURE__*/ new TextEncoder();
/**
* Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes
* - Example: https://viem.sh/docs/utilities/toBytes#usage
*
* @param value Value to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes('Hello world')
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes(420)
* // Uint8Array([1, 164])
*
* @example
* import { toBytes } from 'viem'
* const data = toBytes(420, { size: 4 })
* // Uint8Array([0, 0, 1, 164])
*/
function toBytes(value, opts = {}) {
	if (typeof value === "number" || typeof value === "bigint") return numberToBytes(value, opts);
	if (typeof value === "boolean") return boolToBytes(value, opts);
	if (isHex(value)) return hexToBytes(value, opts);
	return stringToBytes(value, opts);
}
/**
* Encodes a boolean into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
*
* @param value Boolean value to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { boolToBytes } from 'viem'
* const data = boolToBytes(true)
* // Uint8Array([1])
*
* @example
* import { boolToBytes } from 'viem'
* const data = boolToBytes(true, { size: 32 })
* // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
*/
function boolToBytes(value, opts = {}) {
	const bytes = new Uint8Array(1);
	bytes[0] = Number(value);
	if (typeof opts.size === "number") {
		assertSize(bytes, { size: opts.size });
		return pad(bytes, { size: opts.size });
	}
	return bytes;
}
var charCodeMap = {
	zero: 48,
	nine: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function charCodeToBase16(char) {
	if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
	if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
	if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
}
/**
* Encodes a hex string into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
*
* @param hex Hex string to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { hexToBytes } from 'viem'
* const data = hexToBytes('0x48656c6c6f20776f726c6421')
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
*
* @example
* import { hexToBytes } from 'viem'
* const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
*/
function hexToBytes(hex_, opts = {}) {
	let hex = hex_;
	if (opts.size) {
		assertSize(hex, { size: opts.size });
		hex = pad(hex, {
			dir: "right",
			size: opts.size
		});
	}
	let hexString = hex.slice(2);
	if (hexString.length % 2) hexString = `0${hexString}`;
	const length = hexString.length / 2;
	const bytes = new Uint8Array(length);
	for (let index = 0, j = 0; index < length; index++) {
		const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
		const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
		if (nibbleLeft === void 0 || nibbleRight === void 0) throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
		bytes[index] = nibbleLeft * 16 + nibbleRight;
	}
	return bytes;
}
/**
* Encodes a number into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
*
* @param value Number to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { numberToBytes } from 'viem'
* const data = numberToBytes(420)
* // Uint8Array([1, 164])
*
* @example
* import { numberToBytes } from 'viem'
* const data = numberToBytes(420, { size: 4 })
* // Uint8Array([0, 0, 1, 164])
*/
function numberToBytes(value, opts) {
	return hexToBytes(numberToHex(value, opts));
}
/**
* Encodes a UTF-8 string into a byte array.
*
* - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
*
* @param value String to encode.
* @param opts Options.
* @returns Byte array value.
*
* @example
* import { stringToBytes } from 'viem'
* const data = stringToBytes('Hello world!')
* // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
*
* @example
* import { stringToBytes } from 'viem'
* const data = stringToBytes('Hello world!', { size: 32 })
* // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
*/
function stringToBytes(value, opts = {}) {
	const bytes = encoder.encode(value);
	if (typeof opts.size === "number") {
		assertSize(bytes, { size: opts.size });
		return pad(bytes, {
			dir: "right",
			size: opts.size
		});
	}
	return bytes;
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
	const to = to_ || "hex";
	const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
	if (to === "bytes") return bytes;
	return toHex(bytes);
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/lru.js
/**
* Map with a LRU (Least recently used) policy.
*
* @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
*/
var LruMap = class extends Map {
	constructor(size) {
		super();
		Object.defineProperty(this, "maxSize", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.maxSize = size;
	}
	get(key) {
		const value = super.get(key);
		if (super.has(key) && value !== void 0) {
			this.delete(key);
			super.set(key, value);
		}
		return value;
	}
	set(key, value) {
		super.set(key, value);
		if (this.maxSize && this.size > this.maxSize) {
			const firstKey = this.keys().next().value;
			if (firstKey) this.delete(firstKey);
		}
		return this;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/address/getAddress.js
var checksumAddressCache = /*#__PURE__*/ new LruMap(8192);
function checksumAddress(address_, chainId) {
	if (checksumAddressCache.has(`${address_}.${chainId}`)) return checksumAddressCache.get(`${address_}.${chainId}`);
	const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
	const hash = keccak256(stringToBytes(hexAddress), "bytes");
	const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
	for (let i = 0; i < 40; i += 2) {
		if (hash[i >> 1] >> 4 >= 8 && address[i]) address[i] = address[i].toUpperCase();
		if ((hash[i >> 1] & 15) >= 8 && address[i + 1]) address[i + 1] = address[i + 1].toUpperCase();
	}
	const result = `0x${address.join("")}`;
	checksumAddressCache.set(`${address_}.${chainId}`, result);
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
/**
* @description Converts an ECDSA public key to an address.
*
* @param publicKey The public key to convert.
*
* @returns The address.
*/
function publicKeyToAddress(publicKey) {
	return checksumAddress(`0x${keccak256(`0x${publicKey.substring(4)}`).substring(26)}`);
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/signature/recoverPublicKey.js
async function recoverPublicKey({ hash, signature }) {
	const hashHex = isHex(hash) ? hash : toHex(hash);
	const { secp256k1 } = await import("../noble__curves+noble__hashes.mjs").then((n) => n.s);
	return `0x${(() => {
		if (typeof signature === "object" && "r" in signature && "s" in signature) {
			const { r, s, v, yParity } = signature;
			const recoveryBit = toRecoveryBit(Number(yParity ?? v));
			return new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit);
		}
		const signatureHex = isHex(signature) ? signature : toHex(signature);
		if (size(signatureHex) !== 65) throw new Error("invalid signature length");
		const recoveryBit = toRecoveryBit(hexToNumber(`0x${signatureHex.slice(130)}`));
		return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
	})().recoverPublicKey(hashHex.substring(2)).toHex(false)}`;
}
function toRecoveryBit(yParityOrV) {
	if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;
	if (yParityOrV === 27) return 0;
	if (yParityOrV === 28) return 1;
	throw new Error("Invalid yParityOrV value");
}
//#endregion
//#region ../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/viem/_esm/utils/signature/recoverAddress.js
async function recoverAddress({ hash, signature }) {
	return publicKeyToAddress(await recoverPublicKey({
		hash,
		signature
	}));
}
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs
function utf8Count(str) {
	const strLength = str.length;
	let byteLength = 0;
	let pos = 0;
	while (pos < strLength) {
		let value = str.charCodeAt(pos++);
		if ((value & 4294967168) === 0) {
			byteLength++;
			continue;
		} else if ((value & 4294965248) === 0) byteLength += 2;
		else {
			if (value >= 55296 && value <= 56319) {
				if (pos < strLength) {
					const extra = str.charCodeAt(pos);
					if ((extra & 64512) === 56320) {
						++pos;
						value = ((value & 1023) << 10) + (extra & 1023) + 65536;
					}
				}
			}
			if ((value & 4294901760) === 0) byteLength += 3;
			else byteLength += 4;
		}
	}
	return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
	const strLength = str.length;
	let offset = outputOffset;
	let pos = 0;
	while (pos < strLength) {
		let value = str.charCodeAt(pos++);
		if ((value & 4294967168) === 0) {
			output[offset++] = value;
			continue;
		} else if ((value & 4294965248) === 0) output[offset++] = value >> 6 & 31 | 192;
		else {
			if (value >= 55296 && value <= 56319) {
				if (pos < strLength) {
					const extra = str.charCodeAt(pos);
					if ((extra & 64512) === 56320) {
						++pos;
						value = ((value & 1023) << 10) + (extra & 1023) + 65536;
					}
				}
			}
			if ((value & 4294901760) === 0) {
				output[offset++] = value >> 12 & 15 | 224;
				output[offset++] = value >> 6 & 63 | 128;
			} else {
				output[offset++] = value >> 18 & 7 | 240;
				output[offset++] = value >> 12 & 63 | 128;
				output[offset++] = value >> 6 & 63 | 128;
			}
		}
		output[offset++] = value & 63 | 128;
	}
}
var sharedTextEncoder = new TextEncoder();
var TEXT_ENCODER_THRESHOLD = 50;
function utf8EncodeTE(str, output, outputOffset) {
	sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
function utf8Encode(str, output, outputOffset) {
	if (str.length > TEXT_ENCODER_THRESHOLD) utf8EncodeTE(str, output, outputOffset);
	else utf8EncodeJs(str, output, outputOffset);
}
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
	let offset = inputOffset;
	const end = offset + byteLength;
	const units = [];
	let result = "";
	while (offset < end) {
		const byte1 = bytes[offset++];
		if ((byte1 & 128) === 0) units.push(byte1);
		else if ((byte1 & 224) === 192) {
			const byte2 = bytes[offset++] & 63;
			units.push((byte1 & 31) << 6 | byte2);
		} else if ((byte1 & 240) === 224) {
			const byte2 = bytes[offset++] & 63;
			const byte3 = bytes[offset++] & 63;
			units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
		} else if ((byte1 & 248) === 240) {
			const byte2 = bytes[offset++] & 63;
			const byte3 = bytes[offset++] & 63;
			const byte4 = bytes[offset++] & 63;
			let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
			if (unit > 65535) {
				unit -= 65536;
				units.push(unit >>> 10 & 1023 | 55296);
				unit = 56320 | unit & 1023;
			}
			units.push(unit);
		} else units.push(byte1);
		if (units.length >= CHUNK_SIZE) {
			result += String.fromCharCode(...units);
			units.length = 0;
		}
	}
	if (units.length > 0) result += String.fromCharCode(...units);
	return result;
}
var sharedTextDecoder = new TextDecoder();
var TEXT_DECODER_THRESHOLD = 200;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
	const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
	return sharedTextDecoder.decode(stringBytes);
}
function utf8Decode(bytes, inputOffset, byteLength) {
	if (byteLength > TEXT_DECODER_THRESHOLD) return utf8DecodeTD(bytes, inputOffset, byteLength);
	else return utf8DecodeJs(bytes, inputOffset, byteLength);
}
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs
/**
* ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
*/
var ExtData = class {
	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs
var DecodeError = class DecodeError extends Error {
	constructor(message) {
		super(message);
		const proto = Object.create(DecodeError.prototype);
		Object.setPrototypeOf(this, proto);
		Object.defineProperty(this, "name", {
			configurable: true,
			enumerable: false,
			value: DecodeError.name
		});
	}
};
function setUint64(view, offset, value) {
	const high = value / 4294967296;
	const low = value;
	view.setUint32(offset, high);
	view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
	const high = Math.floor(value / 4294967296);
	const low = value;
	view.setUint32(offset, high);
	view.setUint32(offset + 4, low);
}
function getInt64(view, offset) {
	const high = view.getInt32(offset);
	const low = view.getUint32(offset + 4);
	return high * 4294967296 + low;
}
function getUint64(view, offset) {
	const high = view.getUint32(offset);
	const low = view.getUint32(offset + 4);
	return high * 4294967296 + low;
}
var TIMESTAMP32_MAX_SEC = 4294967295;
var TIMESTAMP64_MAX_SEC = 17179869183;
function encodeTimeSpecToTimestamp({ sec, nsec }) {
	if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
		const rv = new Uint8Array(4);
		new DataView(rv.buffer).setUint32(0, sec);
		return rv;
	} else {
		const secHigh = sec / 4294967296;
		const secLow = sec & 4294967295;
		const rv = new Uint8Array(8);
		const view = new DataView(rv.buffer);
		view.setUint32(0, nsec << 2 | secHigh & 3);
		view.setUint32(4, secLow);
		return rv;
	}
	else {
		const rv = new Uint8Array(12);
		const view = new DataView(rv.buffer);
		view.setUint32(0, nsec);
		setInt64(view, 4, sec);
		return rv;
	}
}
function encodeDateToTimeSpec(date) {
	const msec = date.getTime();
	const sec = Math.floor(msec / 1e3);
	const nsec = (msec - sec * 1e3) * 1e6;
	const nsecInSec = Math.floor(nsec / 1e9);
	return {
		sec: sec + nsecInSec,
		nsec: nsec - nsecInSec * 1e9
	};
}
function encodeTimestampExtension(object) {
	if (object instanceof Date) return encodeTimeSpecToTimestamp(encodeDateToTimeSpec(object));
	else return null;
}
function decodeTimestampToTimeSpec(data) {
	const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	switch (data.byteLength) {
		case 4: return {
			sec: view.getUint32(0),
			nsec: 0
		};
		case 8: {
			const nsec30AndSecHigh2 = view.getUint32(0);
			const secLow32 = view.getUint32(4);
			return {
				sec: (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32,
				nsec: nsec30AndSecHigh2 >>> 2
			};
		}
		case 12: return {
			sec: getInt64(view, 4),
			nsec: view.getUint32(0)
		};
		default: throw new DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
	}
}
function decodeTimestampExtension(data) {
	const timeSpec = decodeTimestampToTimeSpec(data);
	return /* @__PURE__ */ new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
	type: -1,
	encode: encodeTimestampExtension,
	decode: decodeTimestampExtension
};
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs
var ExtensionCodec = class {
	constructor() {
		this.builtInEncoders = [];
		this.builtInDecoders = [];
		this.encoders = [];
		this.decoders = [];
		this.register(timestampExtension);
	}
	register({ type, encode, decode }) {
		if (type >= 0) {
			this.encoders[type] = encode;
			this.decoders[type] = decode;
		} else {
			const index = -1 - type;
			this.builtInEncoders[index] = encode;
			this.builtInDecoders[index] = decode;
		}
	}
	tryToEncode(object, context) {
		for (let i = 0; i < this.builtInEncoders.length; i++) {
			const encodeExt = this.builtInEncoders[i];
			if (encodeExt != null) {
				const data = encodeExt(object, context);
				if (data != null) return new ExtData(-1 - i, data);
			}
		}
		for (let i = 0; i < this.encoders.length; i++) {
			const encodeExt = this.encoders[i];
			if (encodeExt != null) {
				const data = encodeExt(object, context);
				if (data != null) return new ExtData(i, data);
			}
		}
		if (object instanceof ExtData) return object;
		return null;
	}
	decode(data, type, context) {
		const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
		if (decodeExt) return decodeExt(data, type, context);
		else return new ExtData(type, data);
	}
};
ExtensionCodec.defaultCodec = new ExtensionCodec();
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/utils/typedArrays.mjs
function isArrayBufferLike(buffer) {
	return buffer instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer;
}
function ensureUint8Array(buffer) {
	if (buffer instanceof Uint8Array) return buffer;
	else if (ArrayBuffer.isView(buffer)) return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	else if (isArrayBufferLike(buffer)) return new Uint8Array(buffer);
	else return Uint8Array.from(buffer);
}
var Encoder$1 = class Encoder$1 {
	constructor(options) {
		this.entered = false;
		this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
		this.context = options?.context;
		this.useBigInt64 = options?.useBigInt64 ?? false;
		this.maxDepth = options?.maxDepth ?? 100;
		this.initialBufferSize = options?.initialBufferSize ?? 2048;
		this.sortKeys = options?.sortKeys ?? false;
		this.forceFloat32 = options?.forceFloat32 ?? false;
		this.ignoreUndefined = options?.ignoreUndefined ?? false;
		this.forceIntegerToFloat = options?.forceIntegerToFloat ?? false;
		this.pos = 0;
		this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
		this.bytes = new Uint8Array(this.view.buffer);
	}
	clone() {
		return new Encoder$1({
			extensionCodec: this.extensionCodec,
			context: this.context,
			useBigInt64: this.useBigInt64,
			maxDepth: this.maxDepth,
			initialBufferSize: this.initialBufferSize,
			sortKeys: this.sortKeys,
			forceFloat32: this.forceFloat32,
			ignoreUndefined: this.ignoreUndefined,
			forceIntegerToFloat: this.forceIntegerToFloat
		});
	}
	reinitializeState() {
		this.pos = 0;
	}
	/**
	* This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
	*
	* @returns Encodes the object and returns a shared reference the encoder's internal buffer.
	*/
	encodeSharedRef(object) {
		if (this.entered) return this.clone().encodeSharedRef(object);
		try {
			this.entered = true;
			this.reinitializeState();
			this.doEncode(object, 1);
			return this.bytes.subarray(0, this.pos);
		} finally {
			this.entered = false;
		}
	}
	/**
	* @returns Encodes the object and returns a copy of the encoder's internal buffer.
	*/
	encode(object) {
		if (this.entered) return this.clone().encode(object);
		try {
			this.entered = true;
			this.reinitializeState();
			this.doEncode(object, 1);
			return this.bytes.slice(0, this.pos);
		} finally {
			this.entered = false;
		}
	}
	doEncode(object, depth) {
		if (depth > this.maxDepth) throw new Error(`Too deep objects in depth ${depth}`);
		if (object == null) this.encodeNil();
		else if (typeof object === "boolean") this.encodeBoolean(object);
		else if (typeof object === "number") if (!this.forceIntegerToFloat) this.encodeNumber(object);
		else this.encodeNumberAsFloat(object);
		else if (typeof object === "string") this.encodeString(object);
		else if (this.useBigInt64 && typeof object === "bigint") this.encodeBigInt64(object);
		else this.encodeObject(object, depth);
	}
	ensureBufferSizeToWrite(sizeToWrite) {
		const requiredSize = this.pos + sizeToWrite;
		if (this.view.byteLength < requiredSize) this.resizeBuffer(requiredSize * 2);
	}
	resizeBuffer(newSize) {
		const newBuffer = new ArrayBuffer(newSize);
		const newBytes = new Uint8Array(newBuffer);
		const newView = new DataView(newBuffer);
		newBytes.set(this.bytes);
		this.view = newView;
		this.bytes = newBytes;
	}
	encodeNil() {
		this.writeU8(192);
	}
	encodeBoolean(object) {
		if (object === false) this.writeU8(194);
		else this.writeU8(195);
	}
	encodeNumber(object) {
		if (!this.forceIntegerToFloat && Number.isSafeInteger(object)) if (object >= 0) if (object < 128) this.writeU8(object);
		else if (object < 256) {
			this.writeU8(204);
			this.writeU8(object);
		} else if (object < 65536) {
			this.writeU8(205);
			this.writeU16(object);
		} else if (object < 4294967296) {
			this.writeU8(206);
			this.writeU32(object);
		} else if (!this.useBigInt64) {
			this.writeU8(207);
			this.writeU64(object);
		} else this.encodeNumberAsFloat(object);
		else if (object >= -32) this.writeU8(224 | object + 32);
		else if (object >= -128) {
			this.writeU8(208);
			this.writeI8(object);
		} else if (object >= -32768) {
			this.writeU8(209);
			this.writeI16(object);
		} else if (object >= -2147483648) {
			this.writeU8(210);
			this.writeI32(object);
		} else if (!this.useBigInt64) {
			this.writeU8(211);
			this.writeI64(object);
		} else this.encodeNumberAsFloat(object);
		else this.encodeNumberAsFloat(object);
	}
	encodeNumberAsFloat(object) {
		if (this.forceFloat32) {
			this.writeU8(202);
			this.writeF32(object);
		} else {
			this.writeU8(203);
			this.writeF64(object);
		}
	}
	encodeBigInt64(object) {
		if (object >= BigInt(0)) {
			this.writeU8(207);
			this.writeBigUint64(object);
		} else {
			this.writeU8(211);
			this.writeBigInt64(object);
		}
	}
	writeStringHeader(byteLength) {
		if (byteLength < 32) this.writeU8(160 + byteLength);
		else if (byteLength < 256) {
			this.writeU8(217);
			this.writeU8(byteLength);
		} else if (byteLength < 65536) {
			this.writeU8(218);
			this.writeU16(byteLength);
		} else if (byteLength < 4294967296) {
			this.writeU8(219);
			this.writeU32(byteLength);
		} else throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
	}
	encodeString(object) {
		const maxHeaderSize = 5;
		const byteLength = utf8Count(object);
		this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
		this.writeStringHeader(byteLength);
		utf8Encode(object, this.bytes, this.pos);
		this.pos += byteLength;
	}
	encodeObject(object, depth) {
		const ext = this.extensionCodec.tryToEncode(object, this.context);
		if (ext != null) this.encodeExtension(ext);
		else if (Array.isArray(object)) this.encodeArray(object, depth);
		else if (ArrayBuffer.isView(object)) this.encodeBinary(object);
		else if (typeof object === "object") this.encodeMap(object, depth);
		else throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
	}
	encodeBinary(object) {
		const size = object.byteLength;
		if (size < 256) {
			this.writeU8(196);
			this.writeU8(size);
		} else if (size < 65536) {
			this.writeU8(197);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(198);
			this.writeU32(size);
		} else throw new Error(`Too large binary: ${size}`);
		const bytes = ensureUint8Array(object);
		this.writeU8a(bytes);
	}
	encodeArray(object, depth) {
		const size = object.length;
		if (size < 16) this.writeU8(144 + size);
		else if (size < 65536) {
			this.writeU8(220);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(221);
			this.writeU32(size);
		} else throw new Error(`Too large array: ${size}`);
		for (const item of object) this.doEncode(item, depth + 1);
	}
	countWithoutUndefined(object, keys) {
		let count = 0;
		for (const key of keys) if (object[key] !== void 0) count++;
		return count;
	}
	encodeMap(object, depth) {
		const keys = Object.keys(object);
		if (this.sortKeys) keys.sort();
		const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
		if (size < 16) this.writeU8(128 + size);
		else if (size < 65536) {
			this.writeU8(222);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(223);
			this.writeU32(size);
		} else throw new Error(`Too large map object: ${size}`);
		for (const key of keys) {
			const value = object[key];
			if (!(this.ignoreUndefined && value === void 0)) {
				this.encodeString(key);
				this.doEncode(value, depth + 1);
			}
		}
	}
	encodeExtension(ext) {
		if (typeof ext.data === "function") {
			const data = ext.data(this.pos + 6);
			const size = data.length;
			if (size >= 4294967296) throw new Error(`Too large extension object: ${size}`);
			this.writeU8(201);
			this.writeU32(size);
			this.writeI8(ext.type);
			this.writeU8a(data);
			return;
		}
		const size = ext.data.length;
		if (size === 1) this.writeU8(212);
		else if (size === 2) this.writeU8(213);
		else if (size === 4) this.writeU8(214);
		else if (size === 8) this.writeU8(215);
		else if (size === 16) this.writeU8(216);
		else if (size < 256) {
			this.writeU8(199);
			this.writeU8(size);
		} else if (size < 65536) {
			this.writeU8(200);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(201);
			this.writeU32(size);
		} else throw new Error(`Too large extension object: ${size}`);
		this.writeI8(ext.type);
		this.writeU8a(ext.data);
	}
	writeU8(value) {
		this.ensureBufferSizeToWrite(1);
		this.view.setUint8(this.pos, value);
		this.pos++;
	}
	writeU8a(values) {
		const size = values.length;
		this.ensureBufferSizeToWrite(size);
		this.bytes.set(values, this.pos);
		this.pos += size;
	}
	writeI8(value) {
		this.ensureBufferSizeToWrite(1);
		this.view.setInt8(this.pos, value);
		this.pos++;
	}
	writeU16(value) {
		this.ensureBufferSizeToWrite(2);
		this.view.setUint16(this.pos, value);
		this.pos += 2;
	}
	writeI16(value) {
		this.ensureBufferSizeToWrite(2);
		this.view.setInt16(this.pos, value);
		this.pos += 2;
	}
	writeU32(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setUint32(this.pos, value);
		this.pos += 4;
	}
	writeI32(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setInt32(this.pos, value);
		this.pos += 4;
	}
	writeF32(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setFloat32(this.pos, value);
		this.pos += 4;
	}
	writeF64(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setFloat64(this.pos, value);
		this.pos += 8;
	}
	writeU64(value) {
		this.ensureBufferSizeToWrite(8);
		setUint64(this.view, this.pos, value);
		this.pos += 8;
	}
	writeI64(value) {
		this.ensureBufferSizeToWrite(8);
		setInt64(this.view, this.pos, value);
		this.pos += 8;
	}
	writeBigUint64(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setBigUint64(this.pos, value);
		this.pos += 8;
	}
	writeBigInt64(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setBigInt64(this.pos, value);
		this.pos += 8;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/encode.mjs
/**
* It encodes `value` in the MessagePack format and
* returns a byte buffer.
*
* The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
*/
function encode$4(value, options) {
	return new Encoder$1(options).encodeSharedRef(value);
}
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs
function prettyByte(byte) {
	return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs
var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = class {
	constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
		this.hit = 0;
		this.miss = 0;
		this.maxKeyLength = maxKeyLength;
		this.maxLengthPerKey = maxLengthPerKey;
		this.caches = [];
		for (let i = 0; i < this.maxKeyLength; i++) this.caches.push([]);
	}
	canBeCached(byteLength) {
		return byteLength > 0 && byteLength <= this.maxKeyLength;
	}
	find(bytes, inputOffset, byteLength) {
		const records = this.caches[byteLength - 1];
		FIND_CHUNK: for (const record of records) {
			const recordBytes = record.bytes;
			for (let j = 0; j < byteLength; j++) if (recordBytes[j] !== bytes[inputOffset + j]) continue FIND_CHUNK;
			return record.str;
		}
		return null;
	}
	store(bytes, value) {
		const records = this.caches[bytes.length - 1];
		const record = {
			bytes,
			str: value
		};
		if (records.length >= this.maxLengthPerKey) records[Math.random() * records.length | 0] = record;
		else records.push(record);
	}
	decode(bytes, inputOffset, byteLength) {
		const cachedValue = this.find(bytes, inputOffset, byteLength);
		if (cachedValue != null) {
			this.hit++;
			return cachedValue;
		}
		this.miss++;
		const str = utf8DecodeJs(bytes, inputOffset, byteLength);
		const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
		this.store(slicedCopyOfBytes, str);
		return str;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs
var STATE_ARRAY = "array";
var STATE_MAP_KEY = "map_key";
var STATE_MAP_VALUE = "map_value";
var mapKeyConverter = (key) => {
	if (typeof key === "string" || typeof key === "number") return key;
	throw new DecodeError("The type of key must be string or number but " + typeof key);
};
var StackPool = class {
	constructor() {
		this.stack = [];
		this.stackHeadPosition = -1;
	}
	get length() {
		return this.stackHeadPosition + 1;
	}
	top() {
		return this.stack[this.stackHeadPosition];
	}
	pushArrayState(size) {
		const state = this.getUninitializedStateFromPool();
		state.type = STATE_ARRAY;
		state.position = 0;
		state.size = size;
		state.array = new Array(size);
	}
	pushMapState(size) {
		const state = this.getUninitializedStateFromPool();
		state.type = STATE_MAP_KEY;
		state.readCount = 0;
		state.size = size;
		state.map = {};
	}
	getUninitializedStateFromPool() {
		this.stackHeadPosition++;
		if (this.stackHeadPosition === this.stack.length) this.stack.push({
			type: void 0,
			size: 0,
			array: void 0,
			position: 0,
			readCount: 0,
			map: void 0,
			key: null
		});
		return this.stack[this.stackHeadPosition];
	}
	release(state) {
		if (this.stack[this.stackHeadPosition] !== state) throw new Error("Invalid stack state. Released state is not on top of the stack.");
		if (state.type === STATE_ARRAY) {
			const partialState = state;
			partialState.size = 0;
			partialState.array = void 0;
			partialState.position = 0;
			partialState.type = void 0;
		}
		if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
			const partialState = state;
			partialState.size = 0;
			partialState.map = void 0;
			partialState.readCount = 0;
			partialState.type = void 0;
		}
		this.stackHeadPosition--;
	}
	reset() {
		this.stack.length = 0;
		this.stackHeadPosition = -1;
	}
};
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
	EMPTY_VIEW.getInt8(0);
} catch (e) {
	if (!(e instanceof RangeError)) throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
}
var MORE_DATA = /* @__PURE__ */ new RangeError("Insufficient data");
var sharedCachedKeyDecoder = new CachedKeyDecoder();
var Decoder$1 = class Decoder$1 {
	constructor(options) {
		this.totalPos = 0;
		this.pos = 0;
		this.view = EMPTY_VIEW;
		this.bytes = EMPTY_BYTES;
		this.headByte = HEAD_BYTE_REQUIRED;
		this.stack = new StackPool();
		this.entered = false;
		this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
		this.context = options?.context;
		this.useBigInt64 = options?.useBigInt64 ?? false;
		this.rawStrings = options?.rawStrings ?? false;
		this.maxStrLength = options?.maxStrLength ?? 4294967295;
		this.maxBinLength = options?.maxBinLength ?? 4294967295;
		this.maxArrayLength = options?.maxArrayLength ?? 4294967295;
		this.maxMapLength = options?.maxMapLength ?? 4294967295;
		this.maxExtLength = options?.maxExtLength ?? 4294967295;
		this.keyDecoder = options?.keyDecoder !== void 0 ? options.keyDecoder : sharedCachedKeyDecoder;
		this.mapKeyConverter = options?.mapKeyConverter ?? mapKeyConverter;
	}
	clone() {
		return new Decoder$1({
			extensionCodec: this.extensionCodec,
			context: this.context,
			useBigInt64: this.useBigInt64,
			rawStrings: this.rawStrings,
			maxStrLength: this.maxStrLength,
			maxBinLength: this.maxBinLength,
			maxArrayLength: this.maxArrayLength,
			maxMapLength: this.maxMapLength,
			maxExtLength: this.maxExtLength,
			keyDecoder: this.keyDecoder
		});
	}
	reinitializeState() {
		this.totalPos = 0;
		this.headByte = HEAD_BYTE_REQUIRED;
		this.stack.reset();
	}
	setBuffer(buffer) {
		const bytes = ensureUint8Array(buffer);
		this.bytes = bytes;
		this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		this.pos = 0;
	}
	appendBuffer(buffer) {
		if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) this.setBuffer(buffer);
		else {
			const remainingData = this.bytes.subarray(this.pos);
			const newData = ensureUint8Array(buffer);
			const newBuffer = new Uint8Array(remainingData.length + newData.length);
			newBuffer.set(remainingData);
			newBuffer.set(newData, remainingData.length);
			this.setBuffer(newBuffer);
		}
	}
	hasRemaining(size) {
		return this.view.byteLength - this.pos >= size;
	}
	createExtraByteError(posToShow) {
		const { view, pos } = this;
		return /* @__PURE__ */ new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
	}
	/**
	* @throws {@link DecodeError}
	* @throws {@link RangeError}
	*/
	decode(buffer) {
		if (this.entered) return this.clone().decode(buffer);
		try {
			this.entered = true;
			this.reinitializeState();
			this.setBuffer(buffer);
			const object = this.doDecodeSync();
			if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
			return object;
		} finally {
			this.entered = false;
		}
	}
	*decodeMulti(buffer) {
		if (this.entered) {
			yield* this.clone().decodeMulti(buffer);
			return;
		}
		try {
			this.entered = true;
			this.reinitializeState();
			this.setBuffer(buffer);
			while (this.hasRemaining(1)) yield this.doDecodeSync();
		} finally {
			this.entered = false;
		}
	}
	async decodeAsync(stream) {
		if (this.entered) return this.clone().decodeAsync(stream);
		try {
			this.entered = true;
			let decoded = false;
			let object;
			for await (const buffer of stream) {
				if (decoded) {
					this.entered = false;
					throw this.createExtraByteError(this.totalPos);
				}
				this.appendBuffer(buffer);
				try {
					object = this.doDecodeSync();
					decoded = true;
				} catch (e) {
					if (!(e instanceof RangeError)) throw e;
				}
				this.totalPos += this.pos;
			}
			if (decoded) {
				if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
				return object;
			}
			const { headByte, pos, totalPos } = this;
			throw new RangeError(`Insufficient data in parsing ${prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
		} finally {
			this.entered = false;
		}
	}
	decodeArrayStream(stream) {
		return this.decodeMultiAsync(stream, true);
	}
	decodeStream(stream) {
		return this.decodeMultiAsync(stream, false);
	}
	async *decodeMultiAsync(stream, isArray) {
		if (this.entered) {
			yield* this.clone().decodeMultiAsync(stream, isArray);
			return;
		}
		try {
			this.entered = true;
			let isArrayHeaderRequired = isArray;
			let arrayItemsLeft = -1;
			for await (const buffer of stream) {
				if (isArray && arrayItemsLeft === 0) throw this.createExtraByteError(this.totalPos);
				this.appendBuffer(buffer);
				if (isArrayHeaderRequired) {
					arrayItemsLeft = this.readArraySize();
					isArrayHeaderRequired = false;
					this.complete();
				}
				try {
					while (true) {
						yield this.doDecodeSync();
						if (--arrayItemsLeft === 0) break;
					}
				} catch (e) {
					if (!(e instanceof RangeError)) throw e;
				}
				this.totalPos += this.pos;
			}
		} finally {
			this.entered = false;
		}
	}
	doDecodeSync() {
		DECODE: while (true) {
			const headByte = this.readHeadByte();
			let object;
			if (headByte >= 224) object = headByte - 256;
			else if (headByte < 192) if (headByte < 128) object = headByte;
			else if (headByte < 144) {
				const size = headByte - 128;
				if (size !== 0) {
					this.pushMapState(size);
					this.complete();
					continue DECODE;
				} else object = {};
			} else if (headByte < 160) {
				const size = headByte - 144;
				if (size !== 0) {
					this.pushArrayState(size);
					this.complete();
					continue DECODE;
				} else object = [];
			} else {
				const byteLength = headByte - 160;
				object = this.decodeString(byteLength, 0);
			}
			else if (headByte === 192) object = null;
			else if (headByte === 194) object = false;
			else if (headByte === 195) object = true;
			else if (headByte === 202) object = this.readF32();
			else if (headByte === 203) object = this.readF64();
			else if (headByte === 204) object = this.readU8();
			else if (headByte === 205) object = this.readU16();
			else if (headByte === 206) object = this.readU32();
			else if (headByte === 207) if (this.useBigInt64) object = this.readU64AsBigInt();
			else object = this.readU64();
			else if (headByte === 208) object = this.readI8();
			else if (headByte === 209) object = this.readI16();
			else if (headByte === 210) object = this.readI32();
			else if (headByte === 211) if (this.useBigInt64) object = this.readI64AsBigInt();
			else object = this.readI64();
			else if (headByte === 217) {
				const byteLength = this.lookU8();
				object = this.decodeString(byteLength, 1);
			} else if (headByte === 218) {
				const byteLength = this.lookU16();
				object = this.decodeString(byteLength, 2);
			} else if (headByte === 219) {
				const byteLength = this.lookU32();
				object = this.decodeString(byteLength, 4);
			} else if (headByte === 220) {
				const size = this.readU16();
				if (size !== 0) {
					this.pushArrayState(size);
					this.complete();
					continue DECODE;
				} else object = [];
			} else if (headByte === 221) {
				const size = this.readU32();
				if (size !== 0) {
					this.pushArrayState(size);
					this.complete();
					continue DECODE;
				} else object = [];
			} else if (headByte === 222) {
				const size = this.readU16();
				if (size !== 0) {
					this.pushMapState(size);
					this.complete();
					continue DECODE;
				} else object = {};
			} else if (headByte === 223) {
				const size = this.readU32();
				if (size !== 0) {
					this.pushMapState(size);
					this.complete();
					continue DECODE;
				} else object = {};
			} else if (headByte === 196) {
				const size = this.lookU8();
				object = this.decodeBinary(size, 1);
			} else if (headByte === 197) {
				const size = this.lookU16();
				object = this.decodeBinary(size, 2);
			} else if (headByte === 198) {
				const size = this.lookU32();
				object = this.decodeBinary(size, 4);
			} else if (headByte === 212) object = this.decodeExtension(1, 0);
			else if (headByte === 213) object = this.decodeExtension(2, 0);
			else if (headByte === 214) object = this.decodeExtension(4, 0);
			else if (headByte === 215) object = this.decodeExtension(8, 0);
			else if (headByte === 216) object = this.decodeExtension(16, 0);
			else if (headByte === 199) {
				const size = this.lookU8();
				object = this.decodeExtension(size, 1);
			} else if (headByte === 200) {
				const size = this.lookU16();
				object = this.decodeExtension(size, 2);
			} else if (headByte === 201) {
				const size = this.lookU32();
				object = this.decodeExtension(size, 4);
			} else throw new DecodeError(`Unrecognized type byte: ${prettyByte(headByte)}`);
			this.complete();
			const stack = this.stack;
			while (stack.length > 0) {
				const state = stack.top();
				if (state.type === STATE_ARRAY) {
					state.array[state.position] = object;
					state.position++;
					if (state.position === state.size) {
						object = state.array;
						stack.release(state);
					} else continue DECODE;
				} else if (state.type === STATE_MAP_KEY) {
					if (object === "__proto__") throw new DecodeError("The key __proto__ is not allowed");
					state.key = this.mapKeyConverter(object);
					state.type = STATE_MAP_VALUE;
					continue DECODE;
				} else {
					state.map[state.key] = object;
					state.readCount++;
					if (state.readCount === state.size) {
						object = state.map;
						stack.release(state);
					} else {
						state.key = null;
						state.type = STATE_MAP_KEY;
						continue DECODE;
					}
				}
			}
			return object;
		}
	}
	readHeadByte() {
		if (this.headByte === HEAD_BYTE_REQUIRED) this.headByte = this.readU8();
		return this.headByte;
	}
	complete() {
		this.headByte = HEAD_BYTE_REQUIRED;
	}
	readArraySize() {
		const headByte = this.readHeadByte();
		switch (headByte) {
			case 220: return this.readU16();
			case 221: return this.readU32();
			default: if (headByte < 160) return headByte - 144;
			else throw new DecodeError(`Unrecognized array type byte: ${prettyByte(headByte)}`);
		}
	}
	pushMapState(size) {
		if (size > this.maxMapLength) throw new DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
		this.stack.pushMapState(size);
	}
	pushArrayState(size) {
		if (size > this.maxArrayLength) throw new DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
		this.stack.pushArrayState(size);
	}
	decodeString(byteLength, headerOffset) {
		if (!this.rawStrings || this.stateIsMapKey()) return this.decodeUtf8String(byteLength, headerOffset);
		return this.decodeBinary(byteLength, headerOffset);
	}
	/**
	* @throws {@link RangeError}
	*/
	decodeUtf8String(byteLength, headerOffset) {
		if (byteLength > this.maxStrLength) throw new DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
		if (this.bytes.byteLength < this.pos + headerOffset + byteLength) throw MORE_DATA;
		const offset = this.pos + headerOffset;
		let object;
		if (this.stateIsMapKey() && this.keyDecoder?.canBeCached(byteLength)) object = this.keyDecoder.decode(this.bytes, offset, byteLength);
		else object = utf8Decode(this.bytes, offset, byteLength);
		this.pos += headerOffset + byteLength;
		return object;
	}
	stateIsMapKey() {
		if (this.stack.length > 0) return this.stack.top().type === STATE_MAP_KEY;
		return false;
	}
	/**
	* @throws {@link RangeError}
	*/
	decodeBinary(byteLength, headOffset) {
		if (byteLength > this.maxBinLength) throw new DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
		if (!this.hasRemaining(byteLength + headOffset)) throw MORE_DATA;
		const offset = this.pos + headOffset;
		const object = this.bytes.subarray(offset, offset + byteLength);
		this.pos += headOffset + byteLength;
		return object;
	}
	decodeExtension(size, headOffset) {
		if (size > this.maxExtLength) throw new DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
		const extType = this.view.getInt8(this.pos + headOffset);
		const data = this.decodeBinary(size, headOffset + 1);
		return this.extensionCodec.decode(data, extType, this.context);
	}
	lookU8() {
		return this.view.getUint8(this.pos);
	}
	lookU16() {
		return this.view.getUint16(this.pos);
	}
	lookU32() {
		return this.view.getUint32(this.pos);
	}
	readU8() {
		const value = this.view.getUint8(this.pos);
		this.pos++;
		return value;
	}
	readI8() {
		const value = this.view.getInt8(this.pos);
		this.pos++;
		return value;
	}
	readU16() {
		const value = this.view.getUint16(this.pos);
		this.pos += 2;
		return value;
	}
	readI16() {
		const value = this.view.getInt16(this.pos);
		this.pos += 2;
		return value;
	}
	readU32() {
		const value = this.view.getUint32(this.pos);
		this.pos += 4;
		return value;
	}
	readI32() {
		const value = this.view.getInt32(this.pos);
		this.pos += 4;
		return value;
	}
	readU64() {
		const value = getUint64(this.view, this.pos);
		this.pos += 8;
		return value;
	}
	readI64() {
		const value = getInt64(this.view, this.pos);
		this.pos += 8;
		return value;
	}
	readU64AsBigInt() {
		const value = this.view.getBigUint64(this.pos);
		this.pos += 8;
		return value;
	}
	readI64AsBigInt() {
		const value = this.view.getBigInt64(this.pos);
		this.pos += 8;
		return value;
	}
	readF32() {
		const value = this.view.getFloat32(this.pos);
		this.pos += 4;
		return value;
	}
	readF64() {
		const value = this.view.getFloat64(this.pos);
		this.pos += 8;
		return value;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@msgpack+msgpack@3.1.2/node_modules/@msgpack/msgpack/dist.esm/decode.mjs
/**
* It decodes a single MessagePack object in a buffer.
*
* This is a synchronous decoding function.
* See other variants for asynchronous decoding: {@link decodeAsync}, {@link decodeMultiStream}, or {@link decodeArrayStream}.
*
* @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
* @throws {@link DecodeError} if the buffer contains invalid data.
*/
function decode$3(buffer, options) {
	return new Decoder$1(options).decode(buffer);
}
//#endregion
//#region ../../node_modules/.pnpm/@scure+base@1.2.6/node_modules/@scure/base/lib/esm/index.js
var import_cjs$3 = require_cjs$3();
var import_cjs$1 = require_cjs$2();
var import_cjs$2 = require_cjs$1();
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
	if (!isBytes(b)) throw new Error("Uint8Array expected");
	if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function isArrayOf(isString, arr) {
	if (!Array.isArray(arr)) return false;
	if (arr.length === 0) return true;
	if (isString) return arr.every((item) => typeof item === "string");
	else return arr.every((item) => Number.isSafeInteger(item));
}
function afn(input) {
	if (typeof input !== "function") throw new Error("function expected");
	return true;
}
function astr(label, input) {
	if (typeof input !== "string") throw new Error(`${label}: string expected`);
	return true;
}
function anumber(n) {
	if (!Number.isSafeInteger(n)) throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
	if (!Array.isArray(input)) throw new Error("array expected");
}
function astrArr(label, input) {
	if (!isArrayOf(true, input)) throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
	if (!isArrayOf(false, input)) throw new Error(`${label}: array of numbers expected`);
}
/**
* @__NO_SIDE_EFFECTS__
*/
function chain(...args) {
	const id = (a) => a;
	const wrap = (a, b) => (c) => a(b(c));
	return {
		encode: args.map((x) => x.encode).reduceRight(wrap, id),
		decode: args.map((x) => x.decode).reduce(wrap, id)
	};
}
/**
* Encodes integer radix representation to array of strings using alphabet and back.
* Could also be array of strings.
* @__NO_SIDE_EFFECTS__
*/
function alphabet$1(letters) {
	const lettersA = typeof letters === "string" ? letters.split("") : letters;
	const len = lettersA.length;
	astrArr("alphabet", lettersA);
	const indexes = new Map(lettersA.map((l, i) => [l, i]));
	return {
		encode: (digits) => {
			aArr(digits);
			return digits.map((i) => {
				if (!Number.isSafeInteger(i) || i < 0 || i >= len) throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
				return lettersA[i];
			});
		},
		decode: (input) => {
			aArr(input);
			return input.map((letter) => {
				astr("alphabet.decode", letter);
				const i = indexes.get(letter);
				if (i === void 0) throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
				return i;
			});
		}
	};
}
/**
* @__NO_SIDE_EFFECTS__
*/
function join$2(separator = "") {
	astr("join", separator);
	return {
		encode: (from) => {
			astrArr("join.decode", from);
			return from.join(separator);
		},
		decode: (to) => {
			astr("join.decode", to);
			return to.split(separator);
		}
	};
}
/**
* Pad strings array so it has integer number of bits
* @__NO_SIDE_EFFECTS__
*/
function padding(bits, chr = "=") {
	anumber(bits);
	astr("padding", chr);
	return {
		encode(data) {
			astrArr("padding.encode", data);
			while (data.length * bits % 8) data.push(chr);
			return data;
		},
		decode(input) {
			astrArr("padding.decode", input);
			let end = input.length;
			if (end * bits % 8) throw new Error("padding: invalid, string should have whole number of bytes");
			for (; end > 0 && input[end - 1] === chr; end--) if ((end - 1) * bits % 8 === 0) throw new Error("padding: invalid, string has too much padding");
			return input.slice(0, end);
		}
	};
}
/**
* @__NO_SIDE_EFFECTS__
*/
function normalize(fn) {
	afn(fn);
	return {
		encode: (from) => from,
		decode: (to) => fn(to)
	};
}
var gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
var radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
var powers = /* @__PURE__ */ (() => {
	let res = [];
	for (let i = 0; i < 40; i++) res.push(2 ** i);
	return res;
})();
/**
* Implemented with numbers, because BigInt is 5x slower
*/
function convertRadix2(data, from, to, padding) {
	aArr(data);
	if (from <= 0 || from > 32) throw new Error(`convertRadix2: wrong from=${from}`);
	if (to <= 0 || to > 32) throw new Error(`convertRadix2: wrong to=${to}`);
	if (/* @__PURE__ */ radix2carry(from, to) > 32) throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
	let carry = 0;
	let pos = 0;
	const max = powers[from];
	const mask = powers[to] - 1;
	const res = [];
	for (const n of data) {
		anumber(n);
		if (n >= max) throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
		carry = carry << from | n;
		if (pos + from > 32) throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
		pos += from;
		for (; pos >= to; pos -= to) res.push((carry >> pos - to & mask) >>> 0);
		const pow = powers[pos];
		if (pow === void 0) throw new Error("invalid carry");
		carry &= pow - 1;
	}
	carry = carry << to - pos & mask;
	if (!padding && pos >= from) throw new Error("Excess padding");
	if (!padding && carry > 0) throw new Error(`Non-zero padding: ${carry}`);
	if (padding && pos > 0) res.push(carry >>> 0);
	return res;
}
/**
* If both bases are power of same number (like `2**8 <-> 2**64`),
* there is a linear algorithm. For now we have implementation for power-of-two bases only.
* @__NO_SIDE_EFFECTS__
*/
function radix2(bits, revPadding = false) {
	anumber(bits);
	if (bits <= 0 || bits > 32) throw new Error("radix2: bits should be in (0..32]");
	if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32) throw new Error("radix2: carry overflow");
	return {
		encode: (bytes) => {
			if (!isBytes(bytes)) throw new Error("radix2.encode input should be Uint8Array");
			return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
		},
		decode: (digits) => {
			anumArr("radix2.decode", digits);
			return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
		}
	};
}
function unsafeWrapper(fn) {
	afn(fn);
	return function(...args) {
		try {
			return fn.apply(null, args);
		} catch (e) {}
	};
}
chain(radix2(4), alphabet$1("0123456789ABCDEF"), join$2(""));
/**
* base32 encoding from RFC 4648. Has padding.
* Use `base32nopad` for unpadded version.
* Also check out `base32hex`, `base32hexnopad`, `base32crockford`.
* @example
* ```js
* base32.encode(Uint8Array.from([0x12, 0xab]));
* // => 'CKVQ===='
* base32.decode('CKVQ====');
* // => Uint8Array.from([0x12, 0xab])
* ```
*/
var base32$1 = chain(radix2(5), alphabet$1("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding(5), join$2(""));
chain(radix2(5), alphabet$1("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), join$2(""));
chain(radix2(5), alphabet$1("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding(5), join$2(""));
chain(radix2(5), alphabet$1("0123456789ABCDEFGHIJKLMNOPQRSTUV"), join$2(""));
chain(radix2(5), alphabet$1("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), join$2(""), normalize((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")));
var hasBase64Builtin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toBase64 === "function" && typeof Uint8Array.fromBase64 === "function")();
var decodeBase64Builtin = (s, isUrl) => {
	astr("base64", s);
	const re = isUrl ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/;
	const alphabet = isUrl ? "base64url" : "base64";
	if (s.length > 0 && !re.test(s)) throw new Error("invalid base64");
	return Uint8Array.fromBase64(s, {
		alphabet,
		lastChunkHandling: "strict"
	});
};
/**
* base64 from RFC 4648. Padded.
* Use `base64nopad` for unpadded version.
* Also check out `base64url`, `base64urlnopad`.
* Falls back to built-in function, when available.
* @example
* ```js
* base64.encode(Uint8Array.from([0x12, 0xab]));
* // => 'Eqs='
* base64.decode('Eqs=');
* // => Uint8Array.from([0x12, 0xab])
* ```
*/
var base64$1 = hasBase64Builtin ? {
	encode(b) {
		abytes(b);
		return b.toBase64();
	},
	decode(s) {
		return decodeBase64Builtin(s, false);
	}
} : chain(radix2(6), alphabet$1("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), padding(6), join$2(""));
chain(radix2(6), alphabet$1("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), join$2(""));
hasBase64Builtin || chain(radix2(6), alphabet$1("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), padding(6), join$2(""));
chain(radix2(6), alphabet$1("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), join$2(""));
var BECH_ALPHABET = chain(alphabet$1("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join$2(""));
var POLYMOD_GENERATORS = [
	996825010,
	642813549,
	513874426,
	1027748829,
	705979059
];
function bech32Polymod(pre) {
	const b = pre >> 25;
	let chk = (pre & 33554431) << 5;
	for (let i = 0; i < POLYMOD_GENERATORS.length; i++) if ((b >> i & 1) === 1) chk ^= POLYMOD_GENERATORS[i];
	return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
	const len = prefix.length;
	let chk = 1;
	for (let i = 0; i < len; i++) {
		const c = prefix.charCodeAt(i);
		if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`);
		chk = bech32Polymod(chk) ^ c >> 5;
	}
	chk = bech32Polymod(chk);
	for (let i = 0; i < len; i++) chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 31;
	for (let v of words) chk = bech32Polymod(chk) ^ v;
	for (let i = 0; i < 6; i++) chk = bech32Polymod(chk);
	chk ^= encodingConst;
	return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
/**
* @__NO_SIDE_EFFECTS__
*/
function genBech32(encoding) {
	const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
	const _words = radix2(5);
	const fromWords = _words.decode;
	const toWords = _words.encode;
	const fromWordsUnsafe = unsafeWrapper(fromWords);
	function encode(prefix, words, limit = 90) {
		astr("bech32.encode prefix", prefix);
		if (isBytes(words)) words = Array.from(words);
		anumArr("bech32.encode", words);
		const plen = prefix.length;
		if (plen === 0) throw new TypeError(`Invalid prefix length ${plen}`);
		const actualLength = plen + 7 + words.length;
		if (limit !== false && actualLength > limit) throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
		const lowered = prefix.toLowerCase();
		const sum = bechChecksum(lowered, words, ENCODING_CONST);
		return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
	}
	function decode(str, limit = 90) {
		astr("bech32.decode input", str);
		const slen = str.length;
		if (slen < 8 || limit !== false && slen > limit) throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
		const lowered = str.toLowerCase();
		if (str !== lowered && str !== str.toUpperCase()) throw new Error(`String must be lowercase or uppercase`);
		const sepIndex = lowered.lastIndexOf("1");
		if (sepIndex === 0 || sepIndex === -1) throw new Error(`Letter "1" must be present between prefix and data only`);
		const prefix = lowered.slice(0, sepIndex);
		const data = lowered.slice(sepIndex + 1);
		if (data.length < 6) throw new Error("Data must be at least 6 characters long");
		const words = BECH_ALPHABET.decode(data).slice(0, -6);
		const sum = bechChecksum(prefix, words, ENCODING_CONST);
		if (!data.endsWith(sum)) throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
		return {
			prefix,
			words
		};
	}
	const decodeUnsafe = unsafeWrapper(decode);
	function decodeToBytes(str) {
		const { prefix, words } = decode(str, false);
		return {
			prefix,
			words,
			bytes: fromWords(words)
		};
	}
	function encodeFromBytes(prefix, bytes) {
		return encode(prefix, toWords(bytes));
	}
	return {
		encode,
		decode,
		encodeFromBytes,
		decodeToBytes,
		decodeUnsafe,
		fromWords,
		fromWordsUnsafe,
		toWords
	};
}
genBech32("bech32");
genBech32("bech32m");
/* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")() || chain(radix2(4), alphabet$1("0123456789abcdef"), join$2(""), normalize((s) => {
	if (typeof s !== "string" || s.length % 2 !== 0) throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
	return s.toLowerCase();
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+safe-json@1.0.2/node_modules/@walletconnect/safe-json/dist/esm/index.js
var JSONStringify = (data) => JSON.stringify(data, (_, value) => typeof value === "bigint" ? value.toString() + "n" : value);
var JSONParse = (json) => {
	const serializedData = json.replace(/([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g, "$1\"$2n\"$3");
	return JSON.parse(serializedData, (_, value) => {
		if (typeof value === "string" && value.match(/^\d+n$/)) return BigInt(value.substring(0, value.length - 1));
		return value;
	});
};
function safeJsonParse(value) {
	if (typeof value !== "string") throw new Error(`Cannot safe json parse value of type ${typeof value}`);
	try {
		return JSONParse(value);
	} catch (_a) {
		return value;
	}
}
function safeJsonStringify(value) {
	return typeof value === "string" ? value : JSONStringify(value) || "";
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+relay-auth@1.1.0/node_modules/@walletconnect/relay-auth/dist/index.es.js
function En$2(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function fe$2(t, ...e) {
	if (!En$2(t)) throw new Error("Uint8Array expected");
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function De$2(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function gn$2(t, e) {
	fe$2(t);
	const n = e.outputLen;
	if (t.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
}
var it$2 = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var _t$2 = (t) => new DataView(t.buffer, t.byteOffset, t.byteLength);
function yn$2(t) {
	if (typeof t != "string") throw new Error("utf8ToBytes expected string, got " + typeof t);
	return new Uint8Array(new TextEncoder().encode(t));
}
function de$2(t) {
	return typeof t == "string" && (t = yn$2(t)), fe$2(t), t;
}
var xn$2 = class {
	clone() {
		return this._cloneInto();
	}
};
function Bn$2(t) {
	const e = (r) => t().update(de$2(r)).digest(), n = t();
	return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function he$2(t = 32) {
	if (it$2 && typeof it$2.getRandomValues == "function") return it$2.getRandomValues(new Uint8Array(t));
	if (it$2 && typeof it$2.randomBytes == "function") return it$2.randomBytes(t);
	throw new Error("crypto.getRandomValues must be defined");
}
function Cn$2(t, e, n, r) {
	if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, n, r);
	const o = BigInt(32), s = BigInt(4294967295), a = Number(n >> o & s), u = Number(n & s), i = r ? 4 : 0, D = r ? 0 : 4;
	t.setUint32(e + i, a, r), t.setUint32(e + D, u, r);
}
var An$2 = class extends xn$2 {
	constructor(e, n, r, o) {
		super(), this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = _t$2(this.buffer);
	}
	update(e) {
		De$2(this);
		const { view: n, buffer: r, blockLen: o } = this;
		e = de$2(e);
		const s = e.length;
		for (let a = 0; a < s;) {
			const u = Math.min(o - this.pos, s - a);
			if (u === o) {
				const i = _t$2(e);
				for (; o <= s - a; a += o) this.process(i, a);
				continue;
			}
			r.set(e.subarray(a, a + u), this.pos), this.pos += u, a += u, this.pos === o && (this.process(n, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		De$2(this), gn$2(e, this), this.finished = !0;
		const { buffer: n, view: r, blockLen: o, isLE: s } = this;
		let { pos: a } = this;
		n[a++] = 128, this.buffer.subarray(a).fill(0), this.padOffset > o - a && (this.process(r, 0), a = 0);
		for (let l = a; l < o; l++) n[l] = 0;
		Cn$2(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
		const u = _t$2(e), i = this.outputLen;
		if (i % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
		const D = i / 4, c = this.get();
		if (D > c.length) throw new Error("_sha2: outputLen bigger than state");
		for (let l = 0; l < D; l++) u.setUint32(4 * l, c[l], s);
	}
	digest() {
		const { buffer: e, outputLen: n } = this;
		this.digestInto(e);
		const r = e.slice(0, n);
		return this.destroy(), r;
	}
	_cloneInto(e) {
		e || (e = new this.constructor()), e.set(...this.get());
		const { blockLen: n, buffer: r, length: o, finished: s, destroyed: a, pos: u } = this;
		return e.length = o, e.pos = u, e.finished = s, e.destroyed = a, o % n && e.buffer.set(r), e;
	}
};
var wt$2 = BigInt(2 ** 32 - 1), St$3 = BigInt(32);
function le$2(t, e = !1) {
	return e ? {
		h: Number(t & wt$2),
		l: Number(t >> St$3 & wt$2)
	} : {
		h: Number(t >> St$3 & wt$2) | 0,
		l: Number(t & wt$2) | 0
	};
}
function mn$1(t, e = !1) {
	let n = new Uint32Array(t.length), r = new Uint32Array(t.length);
	for (let o = 0; o < t.length; o++) {
		const { h: s, l: a } = le$2(t[o], e);
		[n[o], r[o]] = [s, a];
	}
	return [n, r];
}
var _n$2 = (t, e) => BigInt(t >>> 0) << St$3 | BigInt(e >>> 0), Sn$2 = (t, e, n) => t >>> n, vn$2 = (t, e, n) => t << 32 - n | e >>> n, In$2 = (t, e, n) => t >>> n | e << 32 - n, Un$2 = (t, e, n) => t << 32 - n | e >>> n, Tn$1 = (t, e, n) => t << 64 - n | e >>> n - 32, Fn$2 = (t, e, n) => t >>> n - 32 | e << 64 - n, Nn$2 = (t, e) => e, Ln$2 = (t, e) => t, On$2 = (t, e, n) => t << n | e >>> 32 - n, Hn$2 = (t, e, n) => e << n | t >>> 32 - n, zn$2 = (t, e, n) => e << n - 32 | t >>> 64 - n, Mn$2 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function qn$2(t, e, n, r) {
	const o = (e >>> 0) + (r >>> 0);
	return {
		h: t + n + (o / 2 ** 32 | 0) | 0,
		l: o | 0
	};
}
var $n$2 = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), kn$2 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Rn$2 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), jn$2 = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, Zn$1 = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Gn$1 = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, x$3 = {
	fromBig: le$2,
	split: mn$1,
	toBig: _n$2,
	shrSH: Sn$2,
	shrSL: vn$2,
	rotrSH: In$2,
	rotrSL: Un$2,
	rotrBH: Tn$1,
	rotrBL: Fn$2,
	rotr32H: Nn$2,
	rotr32L: Ln$2,
	rotlSH: On$2,
	rotlSL: Hn$2,
	rotlBH: zn$2,
	rotlBL: Mn$2,
	add: qn$2,
	add3L: $n$2,
	add3H: kn$2,
	add4L: Rn$2,
	add4H: jn$2,
	add5H: Gn$1,
	add5L: Zn$1
}, [Vn$2, Yn$1] = (() => x$3.split([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((t) => BigInt(t))))(), P$2 = new Uint32Array(80), Q$2 = new Uint32Array(80);
var Jn$2 = class extends An$2 {
	constructor() {
		super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
	}
	get() {
		const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: a, Dh: u, Dl: i, Eh: D, El: c, Fh: l, Fl: p, Gh: w, Gl: h, Hh: g, Hl: S } = this;
		return [
			e,
			n,
			r,
			o,
			s,
			a,
			u,
			i,
			D,
			c,
			l,
			p,
			w,
			h,
			g,
			S
		];
	}
	set(e, n, r, o, s, a, u, i, D, c, l, p, w, h, g, S) {
		this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = a | 0, this.Dh = u | 0, this.Dl = i | 0, this.Eh = D | 0, this.El = c | 0, this.Fh = l | 0, this.Fl = p | 0, this.Gh = w | 0, this.Gl = h | 0, this.Hh = g | 0, this.Hl = S | 0;
	}
	process(e, n) {
		for (let d = 0; d < 16; d++, n += 4) P$2[d] = e.getUint32(n), Q$2[d] = e.getUint32(n += 4);
		for (let d = 16; d < 80; d++) {
			const m = P$2[d - 15] | 0, F = Q$2[d - 15] | 0, q = x$3.rotrSH(m, F, 1) ^ x$3.rotrSH(m, F, 8) ^ x$3.shrSH(m, F, 7), z = x$3.rotrSL(m, F, 1) ^ x$3.rotrSL(m, F, 8) ^ x$3.shrSL(m, F, 7), I = P$2[d - 2] | 0, O = Q$2[d - 2] | 0, ot = x$3.rotrSH(I, O, 19) ^ x$3.rotrBH(I, O, 61) ^ x$3.shrSH(I, O, 6), tt = x$3.rotrSL(I, O, 19) ^ x$3.rotrBL(I, O, 61) ^ x$3.shrSL(I, O, 6), st = x$3.add4L(z, tt, Q$2[d - 7], Q$2[d - 16]);
			P$2[d] = x$3.add4H(st, q, ot, P$2[d - 7], P$2[d - 16]) | 0, Q$2[d] = st | 0;
		}
		let { Ah: r, Al: o, Bh: s, Bl: a, Ch: u, Cl: i, Dh: D, Dl: c, Eh: l, El: p, Fh: w, Fl: h, Gh: g, Gl: S, Hh: v, Hl: L } = this;
		for (let d = 0; d < 80; d++) {
			const m = x$3.rotrSH(l, p, 14) ^ x$3.rotrSH(l, p, 18) ^ x$3.rotrBH(l, p, 41), F = x$3.rotrSL(l, p, 14) ^ x$3.rotrSL(l, p, 18) ^ x$3.rotrBL(l, p, 41), q = l & w ^ ~l & g, z = p & h ^ ~p & S, I = x$3.add5L(L, F, z, Yn$1[d], Q$2[d]), O = x$3.add5H(I, v, m, q, Vn$2[d], P$2[d]), ot = I | 0, tt = x$3.rotrSH(r, o, 28) ^ x$3.rotrBH(r, o, 34) ^ x$3.rotrBH(r, o, 39), st = x$3.rotrSL(r, o, 28) ^ x$3.rotrBL(r, o, 34) ^ x$3.rotrBL(r, o, 39), at = r & s ^ r & u ^ s & u, Ct = o & a ^ o & i ^ a & i;
			v = g | 0, L = S | 0, g = w | 0, S = h | 0, w = l | 0, h = p | 0, {h: l, l: p} = x$3.add(D | 0, c | 0, O | 0, ot | 0), D = u | 0, c = i | 0, u = s | 0, i = a | 0, s = r | 0, a = o | 0;
			const At = x$3.add3L(ot, st, Ct);
			r = x$3.add3H(At, O, tt, at), o = At | 0;
		}
		({h: r, l: o} = x$3.add(this.Ah | 0, this.Al | 0, r | 0, o | 0)), {h: s, l: a} = x$3.add(this.Bh | 0, this.Bl | 0, s | 0, a | 0), {h: u, l: i} = x$3.add(this.Ch | 0, this.Cl | 0, u | 0, i | 0), {h: D, l: c} = x$3.add(this.Dh | 0, this.Dl | 0, D | 0, c | 0), {h: l, l: p} = x$3.add(this.Eh | 0, this.El | 0, l | 0, p | 0), {h: w, l: h} = x$3.add(this.Fh | 0, this.Fl | 0, w | 0, h | 0), {h: g, l: S} = x$3.add(this.Gh | 0, this.Gl | 0, g | 0, S | 0), {h: v, l: L} = x$3.add(this.Hh | 0, this.Hl | 0, v | 0, L | 0), this.set(r, o, s, a, u, i, D, c, l, p, w, h, g, S, v, L);
	}
	roundClean() {
		P$2.fill(0), Q$2.fill(0);
	}
	destroy() {
		this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
var Kn$2 = Bn$2(() => new Jn$2());
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ var vt$2 = BigInt(0), be$2 = BigInt(1), Wn$1 = BigInt(2);
function It$2(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function Ut$2(t) {
	if (!It$2(t)) throw new Error("Uint8Array expected");
}
function Tt$2(t, e) {
	if (typeof e != "boolean") throw new Error(t + " boolean expected, got " + e);
}
var Xn$1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function Ft$1(t) {
	Ut$2(t);
	let e = "";
	for (let n = 0; n < t.length; n++) e += Xn$1[t[n]];
	return e;
}
function pe$2(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	return t === "" ? vt$2 : BigInt("0x" + t);
}
var K$1 = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function we$2(t) {
	if (t >= K$1._0 && t <= K$1._9) return t - K$1._0;
	if (t >= K$1.A && t <= K$1.F) return t - (K$1.A - 10);
	if (t >= K$1.a && t <= K$1.f) return t - (K$1.a - 10);
}
function Ee$3(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	const e = t.length, n = e / 2;
	if (e % 2) throw new Error("hex string expected, got unpadded hex of length " + e);
	const r = new Uint8Array(n);
	for (let o = 0, s = 0; o < n; o++, s += 2) {
		const a = we$2(t.charCodeAt(s)), u = we$2(t.charCodeAt(s + 1));
		if (a === void 0 || u === void 0) {
			const i = t[s] + t[s + 1];
			throw new Error("hex string expected, got non-hex character \"" + i + "\" at index " + s);
		}
		r[o] = a * 16 + u;
	}
	return r;
}
function Pn$2(t) {
	return pe$2(Ft$1(t));
}
function Et$3(t) {
	return Ut$2(t), pe$2(Ft$1(Uint8Array.from(t).reverse()));
}
function ge$2(t, e) {
	return Ee$3(t.toString(16).padStart(e * 2, "0"));
}
function Nt$2(t, e) {
	return ge$2(t, e).reverse();
}
function W$2(t, e, n) {
	let r;
	if (typeof e == "string") try {
		r = Ee$3(e);
	} catch (s) {
		throw new Error(t + " must be hex string or Uint8Array, cause: " + s);
	}
	else if (It$2(e)) r = Uint8Array.from(e);
	else throw new Error(t + " must be hex string or Uint8Array");
	const o = r.length;
	if (typeof n == "number" && o !== n) throw new Error(t + " of length " + n + " expected, got " + o);
	return r;
}
function ye$2(...t) {
	let e = 0;
	for (let r = 0; r < t.length; r++) {
		const o = t[r];
		Ut$2(o), e += o.length;
	}
	const n = new Uint8Array(e);
	for (let r = 0, o = 0; r < t.length; r++) {
		const s = t[r];
		n.set(s, o), o += s.length;
	}
	return n;
}
var Lt$2 = (t) => typeof t == "bigint" && vt$2 <= t;
function Qn$2(t, e, n) {
	return Lt$2(t) && Lt$2(e) && Lt$2(n) && e <= t && t < n;
}
function ft$1(t, e, n, r) {
	if (!Qn$2(e, n, r)) throw new Error("expected valid " + t + ": " + n + " <= n < " + r + ", got " + e);
}
function tr$2(t) {
	let e;
	for (e = 0; t > vt$2; t >>= be$2, e += 1);
	return e;
}
var er$2 = (t) => (Wn$1 << BigInt(t - 1)) - be$2, nr$2 = {
	bigint: (t) => typeof t == "bigint",
	function: (t) => typeof t == "function",
	boolean: (t) => typeof t == "boolean",
	string: (t) => typeof t == "string",
	stringOrUint8Array: (t) => typeof t == "string" || It$2(t),
	isSafeInteger: (t) => Number.isSafeInteger(t),
	array: (t) => Array.isArray(t),
	field: (t, e) => e.Fp.isValid(t),
	hash: (t) => typeof t == "function" && Number.isSafeInteger(t.outputLen)
};
function Ot$2(t, e, n = {}) {
	const r = (o, s, a) => {
		const u = nr$2[s];
		if (typeof u != "function") throw new Error("invalid validator function");
		const i = t[o];
		if (!(a && i === void 0) && !u(i, t)) throw new Error("param " + String(o) + " is invalid. Expected " + s + ", got " + i);
	};
	for (const [o, s] of Object.entries(e)) r(o, s, !1);
	for (const [o, s] of Object.entries(n)) r(o, s, !0);
	return t;
}
function xe$1(t) {
	const e = /* @__PURE__ */ new WeakMap();
	return (n, ...r) => {
		const o = e.get(n);
		if (o !== void 0) return o;
		const s = t(n, ...r);
		return e.set(n, s), s;
	};
}
var M$2 = BigInt(0), N$3 = BigInt(1), nt$1 = BigInt(2), rr$2 = BigInt(3), Ht$2 = BigInt(4), Be$2 = BigInt(5), Ce$3 = BigInt(8);
function H(t, e) {
	const n = t % e;
	return n >= M$2 ? n : e + n;
}
function or$2(t, e, n) {
	if (e < M$2) throw new Error("invalid exponent, negatives unsupported");
	if (n <= M$2) throw new Error("invalid modulus");
	if (n === N$3) return M$2;
	let r = N$3;
	for (; e > M$2;) e & N$3 && (r = r * t % n), t = t * t % n, e >>= N$3;
	return r;
}
function J$2(t, e, n) {
	let r = t;
	for (; e-- > M$2;) r *= r, r %= n;
	return r;
}
function Ae$1(t, e) {
	if (t === M$2) throw new Error("invert: expected non-zero number");
	if (e <= M$2) throw new Error("invert: expected positive modulus, got " + e);
	let n = H(t, e), r = e, o = M$2, s = N$3;
	for (; n !== M$2;) {
		const u = r / n, i = r % n, D = o - s * u;
		r = n, n = i, o = s, s = D;
	}
	if (r !== N$3) throw new Error("invert: does not exist");
	return H(o, e);
}
function sr$2(t) {
	const e = (t - N$3) / nt$1;
	let n, r, o;
	for (n = t - N$3, r = 0; n % nt$1 === M$2; n /= nt$1, r++);
	for (o = nt$1; o < t && or$2(o, e, t) !== t - N$3; o++) if (o > 1e3) throw new Error("Cannot find square root: likely non-prime P");
	if (r === 1) {
		const a = (t + N$3) / Ht$2;
		return function(i, D) {
			const c = i.pow(D, a);
			if (!i.eql(i.sqr(c), D)) throw new Error("Cannot find square root");
			return c;
		};
	}
	const s = (n + N$3) / nt$1;
	return function(u, i) {
		if (u.pow(i, e) === u.neg(u.ONE)) throw new Error("Cannot find square root");
		let D = r, c = u.pow(u.mul(u.ONE, o), n), l = u.pow(i, s), p = u.pow(i, n);
		for (; !u.eql(p, u.ONE);) {
			if (u.eql(p, u.ZERO)) return u.ZERO;
			let w = 1;
			for (let g = u.sqr(p); w < D && !u.eql(g, u.ONE); w++) g = u.sqr(g);
			const h = u.pow(c, N$3 << BigInt(D - w - 1));
			c = u.sqr(h), l = u.mul(l, h), p = u.mul(p, c), D = w;
		}
		return l;
	};
}
function ir$2(t) {
	if (t % Ht$2 === rr$2) {
		const e = (t + N$3) / Ht$2;
		return function(r, o) {
			const s = r.pow(o, e);
			if (!r.eql(r.sqr(s), o)) throw new Error("Cannot find square root");
			return s;
		};
	}
	if (t % Ce$3 === Be$2) {
		const e = (t - Be$2) / Ce$3;
		return function(r, o) {
			const s = r.mul(o, nt$1), a = r.pow(s, e), u = r.mul(o, a), i = r.mul(r.mul(u, nt$1), a), D = r.mul(u, r.sub(i, r.ONE));
			if (!r.eql(r.sqr(D), o)) throw new Error("Cannot find square root");
			return D;
		};
	}
	return sr$2(t);
}
var ur$1 = (t, e) => (H(t, e) & N$3) === N$3, cr$2 = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function ar$1(t) {
	return Ot$2(t, cr$2.reduce((r, o) => (r[o] = "function", r), {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "isSafeInteger",
		BITS: "isSafeInteger"
	}));
}
function fr$2(t, e, n) {
	if (n < M$2) throw new Error("invalid exponent, negatives unsupported");
	if (n === M$2) return t.ONE;
	if (n === N$3) return e;
	let r = t.ONE, o = e;
	for (; n > M$2;) n & N$3 && (r = t.mul(r, o)), o = t.sqr(o), n >>= N$3;
	return r;
}
function Dr$2(t, e) {
	const n = new Array(e.length), r = e.reduce((s, a, u) => t.is0(a) ? s : (n[u] = s, t.mul(s, a)), t.ONE), o = t.inv(r);
	return e.reduceRight((s, a, u) => t.is0(a) ? s : (n[u] = t.mul(s, n[u]), t.mul(s, a)), o), n;
}
function me$2(t, e) {
	const n = e !== void 0 ? e : t.toString(2).length;
	return {
		nBitLength: n,
		nByteLength: Math.ceil(n / 8)
	};
}
function _e$3(t, e, n = !1, r = {}) {
	if (t <= M$2) throw new Error("invalid field: expected ORDER > 0, got " + t);
	const { nBitLength: o, nByteLength: s } = me$2(t, e);
	if (s > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let a;
	const u = Object.freeze({
		ORDER: t,
		isLE: n,
		BITS: o,
		BYTES: s,
		MASK: er$2(o),
		ZERO: M$2,
		ONE: N$3,
		create: (i) => H(i, t),
		isValid: (i) => {
			if (typeof i != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof i);
			return M$2 <= i && i < t;
		},
		is0: (i) => i === M$2,
		isOdd: (i) => (i & N$3) === N$3,
		neg: (i) => H(-i, t),
		eql: (i, D) => i === D,
		sqr: (i) => H(i * i, t),
		add: (i, D) => H(i + D, t),
		sub: (i, D) => H(i - D, t),
		mul: (i, D) => H(i * D, t),
		pow: (i, D) => fr$2(u, i, D),
		div: (i, D) => H(i * Ae$1(D, t), t),
		sqrN: (i) => i * i,
		addN: (i, D) => i + D,
		subN: (i, D) => i - D,
		mulN: (i, D) => i * D,
		inv: (i) => Ae$1(i, t),
		sqrt: r.sqrt || ((i) => (a || (a = ir$2(t)), a(u, i))),
		invertBatch: (i) => Dr$2(u, i),
		cmov: (i, D, c) => c ? D : i,
		toBytes: (i) => n ? Nt$2(i, s) : ge$2(i, s),
		fromBytes: (i) => {
			if (i.length !== s) throw new Error("Field.fromBytes: expected " + s + " bytes, got " + i.length);
			return n ? Et$3(i) : Pn$2(i);
		}
	});
	return Object.freeze(u);
}
var Se$2 = BigInt(0), gt$2 = BigInt(1);
function zt$2(t, e) {
	const n = e.negate();
	return t ? n : e;
}
function ve$1(t, e) {
	if (!Number.isSafeInteger(t) || t <= 0 || t > e) throw new Error("invalid window size, expected [1.." + e + "], got W=" + t);
}
function Mt$2(t, e) {
	ve$1(t, e);
	return {
		windows: Math.ceil(e / t) + 1,
		windowSize: 2 ** (t - 1)
	};
}
function dr$2(t, e) {
	if (!Array.isArray(t)) throw new Error("array expected");
	t.forEach((n, r) => {
		if (!(n instanceof e)) throw new Error("invalid point at index " + r);
	});
}
function hr$2(t, e) {
	if (!Array.isArray(t)) throw new Error("array of scalars expected");
	t.forEach((n, r) => {
		if (!e.isValid(n)) throw new Error("invalid scalar at index " + r);
	});
}
var qt$2 = /* @__PURE__ */ new WeakMap(), Ie$2 = /* @__PURE__ */ new WeakMap();
function $t$2(t) {
	return Ie$2.get(t) || 1;
}
function lr$1(t, e) {
	return {
		constTimeNegate: zt$2,
		hasPrecomputes(n) {
			return $t$2(n) !== 1;
		},
		unsafeLadder(n, r, o = t.ZERO) {
			let s = n;
			for (; r > Se$2;) r & gt$2 && (o = o.add(s)), s = s.double(), r >>= gt$2;
			return o;
		},
		precomputeWindow(n, r) {
			const { windows: o, windowSize: s } = Mt$2(r, e), a = [];
			let u = n, i = u;
			for (let D = 0; D < o; D++) {
				i = u, a.push(i);
				for (let c = 1; c < s; c++) i = i.add(u), a.push(i);
				u = i.double();
			}
			return a;
		},
		wNAF(n, r, o) {
			const { windows: s, windowSize: a } = Mt$2(n, e);
			let u = t.ZERO, i = t.BASE;
			const D = BigInt(2 ** n - 1), c = 2 ** n, l = BigInt(n);
			for (let p = 0; p < s; p++) {
				const w = p * a;
				let h = Number(o & D);
				o >>= l, h > a && (h -= c, o += gt$2);
				const g = w, S = w + Math.abs(h) - 1, v = p % 2 !== 0, L = h < 0;
				h === 0 ? i = i.add(zt$2(v, r[g])) : u = u.add(zt$2(L, r[S]));
			}
			return {
				p: u,
				f: i
			};
		},
		wNAFUnsafe(n, r, o, s = t.ZERO) {
			const { windows: a, windowSize: u } = Mt$2(n, e), i = BigInt(2 ** n - 1), D = 2 ** n, c = BigInt(n);
			for (let l = 0; l < a; l++) {
				const p = l * u;
				if (o === Se$2) break;
				let w = Number(o & i);
				if (o >>= c, w > u && (w -= D, o += gt$2), w === 0) continue;
				let h = r[p + Math.abs(w) - 1];
				w < 0 && (h = h.negate()), s = s.add(h);
			}
			return s;
		},
		getPrecomputes(n, r, o) {
			let s = qt$2.get(r);
			return s || (s = this.precomputeWindow(r, n), n !== 1 && qt$2.set(r, o(s))), s;
		},
		wNAFCached(n, r, o) {
			const s = $t$2(n);
			return this.wNAF(s, this.getPrecomputes(s, n, o), r);
		},
		wNAFCachedUnsafe(n, r, o, s) {
			const a = $t$2(n);
			return a === 1 ? this.unsafeLadder(n, r, s) : this.wNAFUnsafe(a, this.getPrecomputes(a, n, o), r, s);
		},
		setWindowSize(n, r) {
			ve$1(r, e), Ie$2.set(n, r), qt$2.delete(n);
		}
	};
}
function br$2(t, e, n, r) {
	if (dr$2(n, t), hr$2(r, e), n.length !== r.length) throw new Error("arrays of points and scalars must have equal length");
	const o = t.ZERO, s = tr$2(BigInt(n.length)), a = s > 12 ? s - 3 : s > 4 ? s - 2 : s ? 2 : 1, u = (1 << a) - 1, i = new Array(u + 1).fill(o), D = Math.floor((e.BITS - 1) / a) * a;
	let c = o;
	for (let l = D; l >= 0; l -= a) {
		i.fill(o);
		for (let w = 0; w < r.length; w++) {
			const h = r[w], g = Number(h >> BigInt(l) & BigInt(u));
			i[g] = i[g].add(n[w]);
		}
		let p = o;
		for (let w = i.length - 1, h = o; w > 0; w--) h = h.add(i[w]), p = p.add(h);
		if (c = c.add(p), l !== 0) for (let w = 0; w < a; w++) c = c.double();
	}
	return c;
}
function pr$2(t) {
	return ar$1(t.Fp), Ot$2(t, {
		n: "bigint",
		h: "bigint",
		Gx: "field",
		Gy: "field"
	}, {
		nBitLength: "isSafeInteger",
		nByteLength: "isSafeInteger"
	}), Object.freeze({
		...me$2(t.n, t.nBitLength),
		...t,
		p: t.Fp.ORDER
	});
}
var G$2 = BigInt(0), j$1 = BigInt(1), yt$1 = BigInt(2), wr$2 = BigInt(8), Er$2 = { zip215: !0 };
function gr$2(t) {
	const e = pr$2(t);
	return Ot$2(t, {
		hash: "function",
		a: "bigint",
		d: "bigint",
		randomBytes: "function"
	}, {
		adjustScalarBytes: "function",
		domain: "function",
		uvRatio: "function",
		mapToCurve: "function"
	}), Object.freeze({ ...e });
}
function yr$2(t) {
	const e = gr$2(t), { Fp: n, n: r, prehash: o, hash: s, randomBytes: a, nByteLength: u, h: i } = e, D = yt$1 << BigInt(u * 8) - j$1, c = n.create, l = _e$3(e.n, e.nBitLength), p = e.uvRatio || ((y, f) => {
		try {
			return {
				isValid: !0,
				value: n.sqrt(y * n.inv(f))
			};
		} catch {
			return {
				isValid: !1,
				value: G$2
			};
		}
	}), w = e.adjustScalarBytes || ((y) => y), h = e.domain || ((y, f, b) => {
		if (Tt$2("phflag", b), f.length || b) throw new Error("Contexts/pre-hash are not supported");
		return y;
	});
	function g(y, f) {
		ft$1("coordinate " + y, f, G$2, D);
	}
	function S(y) {
		if (!(y instanceof d)) throw new Error("ExtendedPoint expected");
	}
	const v = xe$1((y, f) => {
		const { ex: b, ey: E, ez: B } = y, C = y.is0();
		f ??= C ? wr$2 : n.inv(B);
		const A = c(b * f), U = c(E * f), _ = c(B * f);
		if (C) return {
			x: G$2,
			y: j$1
		};
		if (_ !== j$1) throw new Error("invZ was invalid");
		return {
			x: A,
			y: U
		};
	}), L = xe$1((y) => {
		const { a: f, d: b } = e;
		if (y.is0()) throw new Error("bad point: ZERO");
		const { ex: E, ey: B, ez: C, et: A } = y, U = c(E * E), _ = c(B * B), T = c(C * C), $ = c(T * T);
		if (c(T * c(c(U * f) + _)) !== c($ + c(b * c(U * _)))) throw new Error("bad point: equation left != right (1)");
		if (c(E * B) !== c(C * A)) throw new Error("bad point: equation left != right (2)");
		return !0;
	});
	class d {
		constructor(f, b, E, B) {
			this.ex = f, this.ey = b, this.ez = E, this.et = B, g("x", f), g("y", b), g("z", E), g("t", B), Object.freeze(this);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		static fromAffine(f) {
			if (f instanceof d) throw new Error("extended point not allowed");
			const { x: b, y: E } = f || {};
			return g("x", b), g("y", E), new d(b, E, j$1, c(b * E));
		}
		static normalizeZ(f) {
			const b = n.invertBatch(f.map((E) => E.ez));
			return f.map((E, B) => E.toAffine(b[B])).map(d.fromAffine);
		}
		static msm(f, b) {
			return br$2(d, l, f, b);
		}
		_setWindowSize(f) {
			q.setWindowSize(this, f);
		}
		assertValidity() {
			L(this);
		}
		equals(f) {
			S(f);
			const { ex: b, ey: E, ez: B } = this, { ex: C, ey: A, ez: U } = f, _ = c(b * U), T = c(C * B), $ = c(E * U), R = c(A * B);
			return _ === T && $ === R;
		}
		is0() {
			return this.equals(d.ZERO);
		}
		negate() {
			return new d(c(-this.ex), this.ey, this.ez, c(-this.et));
		}
		double() {
			const { a: f } = e, { ex: b, ey: E, ez: B } = this, C = c(b * b), A = c(E * E), U = c(yt$1 * c(B * B)), _ = c(f * C), T = b + E, $ = c(c(T * T) - C - A), R = _ + A, V = R - U, Y = _ - A, Z = c($ * V), X = c(R * Y), et = c($ * Y);
			return new d(Z, X, c(V * R), et);
		}
		add(f) {
			S(f);
			const { a: b, d: E } = e, { ex: B, ey: C, ez: A, et: U } = this, { ex: _, ey: T, ez: $, et: R } = f;
			if (b === BigInt(-1)) {
				const re = c((C - B) * (T + _)), oe = c((C + B) * (T - _)), mt = c(oe - re);
				if (mt === G$2) return this.double();
				const se = c(A * yt$1 * R), ie = c(U * yt$1 * $), ue = ie + se, ce = oe + re, ae = ie - se, Dn = c(ue * mt), dn = c(ce * ae), hn = c(ue * ae);
				return new d(Dn, dn, c(mt * ce), hn);
			}
			const V = c(B * _), Y = c(C * T), Z = c(U * E * R), X = c(A * $), et = c((B + C) * (_ + T) - V - Y), pt = X - Z, ee = X + Z, ne = c(Y - b * V), un = c(et * pt), cn = c(ee * ne), an = c(et * ne);
			return new d(un, cn, c(pt * ee), an);
		}
		subtract(f) {
			return this.add(f.negate());
		}
		wNAF(f) {
			return q.wNAFCached(this, f, d.normalizeZ);
		}
		multiply(f) {
			const b = f;
			ft$1("scalar", b, j$1, r);
			const { p: E, f: B } = this.wNAF(b);
			return d.normalizeZ([E, B])[0];
		}
		multiplyUnsafe(f, b = d.ZERO) {
			const E = f;
			return ft$1("scalar", E, G$2, r), E === G$2 ? F : this.is0() || E === j$1 ? this : q.wNAFCachedUnsafe(this, E, d.normalizeZ, b);
		}
		isSmallOrder() {
			return this.multiplyUnsafe(i).is0();
		}
		isTorsionFree() {
			return q.unsafeLadder(this, r).is0();
		}
		toAffine(f) {
			return v(this, f);
		}
		clearCofactor() {
			const { h: f } = e;
			return f === j$1 ? this : this.multiplyUnsafe(f);
		}
		static fromHex(f, b = !1) {
			const { d: E, a: B } = e, C = n.BYTES;
			f = W$2("pointHex", f, C), Tt$2("zip215", b);
			const A = f.slice(), U = f[C - 1];
			A[C - 1] = U & -129;
			const _ = Et$3(A);
			ft$1("pointHex.y", _, G$2, b ? D : n.ORDER);
			const $ = c(_ * _);
			let { isValid: Y, value: Z } = p(c($ - j$1), c(E * $ - B));
			if (!Y) throw new Error("Point.fromHex: invalid y coordinate");
			const X = (Z & j$1) === j$1, et = (U & 128) !== 0;
			if (!b && Z === G$2 && et) throw new Error("Point.fromHex: x=0 and x_0=1");
			return et !== X && (Z = c(-Z)), d.fromAffine({
				x: Z,
				y: _
			});
		}
		static fromPrivateKey(f) {
			return O(f).point;
		}
		toRawBytes() {
			const { x: f, y: b } = this.toAffine(), E = Nt$2(b, n.BYTES);
			return E[E.length - 1] |= f & j$1 ? 128 : 0, E;
		}
		toHex() {
			return Ft$1(this.toRawBytes());
		}
	}
	d.BASE = new d(e.Gx, e.Gy, j$1, c(e.Gx * e.Gy)), d.ZERO = new d(G$2, j$1, j$1, G$2);
	const { BASE: m, ZERO: F } = d, q = lr$1(d, u * 8);
	function z(y) {
		return H(y, r);
	}
	function I(y) {
		return z(Et$3(y));
	}
	function O(y) {
		const f = n.BYTES;
		y = W$2("private key", y, f);
		const b = W$2("hashed private key", s(y), 2 * f), E = w(b.slice(0, f)), B = b.slice(f, 2 * f), C = I(E), A = m.multiply(C);
		return {
			head: E,
			prefix: B,
			scalar: C,
			point: A,
			pointBytes: A.toRawBytes()
		};
	}
	function ot(y) {
		return O(y).pointBytes;
	}
	function tt(y = new Uint8Array(), ...f) {
		return I(s(h(ye$2(...f), W$2("context", y), !!o)));
	}
	function st(y, f, b = {}) {
		y = W$2("message", y), o && (y = o(y));
		const { prefix: E, scalar: B, pointBytes: C } = O(f), A = tt(b.context, E, y), U = m.multiply(A).toRawBytes(), T = z(A + tt(b.context, U, C, y) * B);
		ft$1("signature.s", T, G$2, r);
		return W$2("result", ye$2(U, Nt$2(T, n.BYTES)), n.BYTES * 2);
	}
	const at = Er$2;
	function Ct(y, f, b, E = at) {
		const { context: B, zip215: C } = E, A = n.BYTES;
		y = W$2("signature", y, 2 * A), f = W$2("message", f), b = W$2("publicKey", b, A), C !== void 0 && Tt$2("zip215", C), o && (f = o(f));
		const U = Et$3(y.slice(A, 2 * A));
		let _, T, $;
		try {
			_ = d.fromHex(b, C), T = d.fromHex(y.slice(0, A), C), $ = m.multiplyUnsafe(U);
		} catch {
			return !1;
		}
		if (!C && _.isSmallOrder()) return !1;
		const R = tt(B, T.toRawBytes(), _.toRawBytes(), f);
		return T.add(_.multiplyUnsafe(R)).subtract($).clearCofactor().equals(d.ZERO);
	}
	return m._setWindowSize(8), {
		CURVE: e,
		getPublicKey: ot,
		sign: st,
		verify: Ct,
		ExtendedPoint: d,
		utils: {
			getExtendedPublicKey: O,
			randomPrivateKey: () => a(n.BYTES),
			precompute(y = 8, f = d.BASE) {
				return f._setWindowSize(y), f.multiply(BigInt(3)), f;
			}
		}
	};
}
var kt$2 = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"), Ue$2 = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
var xr$2 = BigInt(1), Te$2 = BigInt(2);
var Br$2 = BigInt(5), Cr$2 = BigInt(8);
function Ar$2(t) {
	const e = BigInt(10), n = BigInt(20), r = BigInt(40), o = BigInt(80), s = kt$2, u = t * t % s * t % s, D = J$2(J$2(u, Te$2, s) * u % s, xr$2, s) * t % s, c = J$2(D, Br$2, s) * D % s, l = J$2(c, e, s) * c % s, p = J$2(l, n, s) * l % s, w = J$2(p, r, s) * p % s;
	return {
		pow_p_5_8: J$2(J$2(J$2(J$2(w, o, s) * w % s, o, s) * w % s, e, s) * c % s, Te$2, s) * t % s,
		b2: u
	};
}
function mr$2(t) {
	return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
}
function _r$2(t, e) {
	const n = kt$2, r = H(e * e * e, n), s = Ar$2(t * H(r * r * e, n)).pow_p_5_8;
	let a = H(t * r * s, n);
	const u = H(e * a * a, n), i = a, D = H(a * Ue$2, n), c = u === t, l = u === H(-t, n), p = u === H(-t * Ue$2, n);
	return c && (a = i), (l || p) && (a = D), ur$1(a, n) && (a = H(-a, n)), {
		isValid: c || l,
		value: a
	};
}
var Sr$2 = (() => _e$3(kt$2, void 0, !0))(), vr$2 = (() => ({
	a: BigInt(-1),
	d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
	Fp: Sr$2,
	n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
	h: Cr$2,
	Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
	Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
	hash: Kn$2,
	randomBytes: he$2,
	adjustScalarBytes: mr$2,
	uvRatio: _r$2
}))(), Rt$3 = (() => yr$2(vr$2))(), jt$2 = "EdDSA", Dt$1 = "base64url", Gt$2 = "utf8", xt$2 = "utf8", dt$2 = "base58btc";
function Xt$2(t) {
	return globalThis.Buffer != null ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : t;
}
function Le$3(t = 0) {
	return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? Xt$2(globalThis.Buffer.allocUnsafe(t)) : new Uint8Array(t);
}
function Oe$1(t, e) {
	e || (e = t.reduce((o, s) => o + s.length, 0));
	const n = Le$3(e);
	let r = 0;
	for (const o of t) n.set(o, r), r += o.length;
	return Xt$2(n);
}
function Ir$2(t, e) {
	if (t.length >= 255) throw new TypeError("Alphabet too long");
	for (var n = new Uint8Array(256), r = 0; r < n.length; r++) n[r] = 255;
	for (var o = 0; o < t.length; o++) {
		var s = t.charAt(o), a = s.charCodeAt(0);
		if (n[a] !== 255) throw new TypeError(s + " is ambiguous");
		n[a] = o;
	}
	var u = t.length, i = t.charAt(0), D = Math.log(u) / Math.log(256), c = Math.log(256) / Math.log(u);
	function l(h) {
		if (h instanceof Uint8Array || (ArrayBuffer.isView(h) ? h = new Uint8Array(h.buffer, h.byteOffset, h.byteLength) : Array.isArray(h) && (h = Uint8Array.from(h))), !(h instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (h.length === 0) return "";
		for (var g = 0, S = 0, v = 0, L = h.length; v !== L && h[v] === 0;) v++, g++;
		for (var d = (L - v) * c + 1 >>> 0, m = new Uint8Array(d); v !== L;) {
			for (var F = h[v], q = 0, z = d - 1; (F !== 0 || q < S) && z !== -1; z--, q++) F += 256 * m[z] >>> 0, m[z] = F % u >>> 0, F = F / u >>> 0;
			if (F !== 0) throw new Error("Non-zero carry");
			S = q, v++;
		}
		for (var I = d - S; I !== d && m[I] === 0;) I++;
		for (var O = i.repeat(g); I < d; ++I) O += t.charAt(m[I]);
		return O;
	}
	function p(h) {
		if (typeof h != "string") throw new TypeError("Expected String");
		if (h.length === 0) return new Uint8Array();
		var g = 0;
		if (h[g] !== " ") {
			for (var S = 0, v = 0; h[g] === i;) S++, g++;
			for (var L = (h.length - g) * D + 1 >>> 0, d = new Uint8Array(L); h[g];) {
				var m = n[h.charCodeAt(g)];
				if (m === 255) return;
				for (var F = 0, q = L - 1; (m !== 0 || F < v) && q !== -1; q--, F++) m += u * d[q] >>> 0, d[q] = m % 256 >>> 0, m = m / 256 >>> 0;
				if (m !== 0) throw new Error("Non-zero carry");
				v = F, g++;
			}
			if (h[g] !== " ") {
				for (var z = L - v; z !== L && d[z] === 0;) z++;
				for (var I = new Uint8Array(S + (L - z)), O = S; z !== L;) I[O++] = d[z++];
				return I;
			}
		}
	}
	function w(h) {
		var g = p(h);
		if (g) return g;
		throw new Error(`Non-${e} character`);
	}
	return {
		encode: l,
		decodeUnsafe: p,
		decode: w
	};
}
var Tr$2 = Ir$2;
var He$2 = (t) => {
	if (t instanceof Uint8Array && t.constructor.name === "Uint8Array") return t;
	if (t instanceof ArrayBuffer) return new Uint8Array(t);
	if (ArrayBuffer.isView(t)) return new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
	throw new Error("Unknown type, must be binary type");
}, Fr$1 = (t) => new TextEncoder().encode(t), Nr$2 = (t) => new TextDecoder().decode(t);
var Lr$2 = class {
	constructor(e, n, r) {
		this.name = e, this.prefix = n, this.baseEncode = r;
	}
	encode(e) {
		if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
		throw Error("Unknown type, must be binary type");
	}
};
var Or$2 = class {
	constructor(e, n, r) {
		if (this.name = e, this.prefix = n, n.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
		this.prefixCodePoint = n.codePointAt(0), this.baseDecode = r;
	}
	decode(e) {
		if (typeof e == "string") {
			if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
			return this.baseDecode(e.slice(this.prefix.length));
		} else throw Error("Can only multibase decode strings");
	}
	or(e) {
		return ze$1(this, e);
	}
};
var Hr$2 = class {
	constructor(e) {
		this.decoders = e;
	}
	or(e) {
		return ze$1(this, e);
	}
	decode(e) {
		const n = e[0], r = this.decoders[n];
		if (r) return r.decode(e);
		throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
	}
};
var ze$1 = (t, e) => new Hr$2({
	...t.decoders || { [t.prefix]: t },
	...e.decoders || { [e.prefix]: e }
});
var zr$1 = class {
	constructor(e, n, r, o) {
		this.name = e, this.prefix = n, this.baseEncode = r, this.baseDecode = o, this.encoder = new Lr$2(e, n, r), this.decoder = new Or$2(e, n, o);
	}
	encode(e) {
		return this.encoder.encode(e);
	}
	decode(e) {
		return this.decoder.decode(e);
	}
};
var Bt$2 = ({ name: t, prefix: e, encode: n, decode: r }) => new zr$1(t, e, n, r), ht$2 = ({ prefix: t, name: e, alphabet: n }) => {
	const { encode: r, decode: o } = Tr$2(n, e);
	return Bt$2({
		prefix: t,
		name: e,
		encode: r,
		decode: (s) => He$2(o(s))
	});
}, Mr$2 = (t, e, n, r) => {
	const o = {};
	for (let c = 0; c < e.length; ++c) o[e[c]] = c;
	let s = t.length;
	for (; t[s - 1] === "=";) --s;
	const a = new Uint8Array(s * n / 8 | 0);
	let u = 0, i = 0, D = 0;
	for (let c = 0; c < s; ++c) {
		const l = o[t[c]];
		if (l === void 0) throw new SyntaxError(`Non-${r} character`);
		i = i << n | l, u += n, u >= 8 && (u -= 8, a[D++] = 255 & i >> u);
	}
	if (u >= n || 255 & i << 8 - u) throw new SyntaxError("Unexpected end of data");
	return a;
}, qr$2 = (t, e, n) => {
	const r = e[e.length - 1] === "=", o = (1 << n) - 1;
	let s = "", a = 0, u = 0;
	for (let i = 0; i < t.length; ++i) for (u = u << 8 | t[i], a += 8; a > n;) a -= n, s += e[o & u >> a];
	if (a && (s += e[o & u << n - a]), r) for (; s.length * n & 7;) s += "=";
	return s;
}, k$4 = ({ name: t, prefix: e, bitsPerChar: n, alphabet: r }) => Bt$2({
	prefix: e,
	name: t,
	encode(o) {
		return qr$2(o, r, n);
	},
	decode(o) {
		return Mr$2(o, r, n, t);
	}
}), $r$2 = Bt$2({
	prefix: "\0",
	name: "identity",
	encode: (t) => Nr$2(t),
	decode: (t) => Fr$1(t)
});
var kr$2 = Object.freeze({
	__proto__: null,
	identity: $r$2
});
var Rr$2 = k$4({
	prefix: "0",
	name: "base2",
	alphabet: "01",
	bitsPerChar: 1
});
var jr$2 = Object.freeze({
	__proto__: null,
	base2: Rr$2
});
var Zr$2 = k$4({
	prefix: "7",
	name: "base8",
	alphabet: "01234567",
	bitsPerChar: 3
});
var Gr$2 = Object.freeze({
	__proto__: null,
	base8: Zr$2
});
var Vr$2 = ht$2({
	prefix: "9",
	name: "base10",
	alphabet: "0123456789"
});
var Yr$1 = Object.freeze({
	__proto__: null,
	base10: Vr$2
});
var Jr$1 = k$4({
	prefix: "f",
	name: "base16",
	alphabet: "0123456789abcdef",
	bitsPerChar: 4
}), Kr$1 = k$4({
	prefix: "F",
	name: "base16upper",
	alphabet: "0123456789ABCDEF",
	bitsPerChar: 4
});
var Wr$2 = Object.freeze({
	__proto__: null,
	base16: Jr$1,
	base16upper: Kr$1
});
var Xr$2 = k$4({
	prefix: "b",
	name: "base32",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567",
	bitsPerChar: 5
}), Pr$2 = k$4({
	prefix: "B",
	name: "base32upper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	bitsPerChar: 5
}), Qr$2 = k$4({
	prefix: "c",
	name: "base32pad",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
	bitsPerChar: 5
}), to$2 = k$4({
	prefix: "C",
	name: "base32padupper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
	bitsPerChar: 5
}), eo$2 = k$4({
	prefix: "v",
	name: "base32hex",
	alphabet: "0123456789abcdefghijklmnopqrstuv",
	bitsPerChar: 5
}), no$2 = k$4({
	prefix: "V",
	name: "base32hexupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	bitsPerChar: 5
}), ro$2 = k$4({
	prefix: "t",
	name: "base32hexpad",
	alphabet: "0123456789abcdefghijklmnopqrstuv=",
	bitsPerChar: 5
}), oo$2 = k$4({
	prefix: "T",
	name: "base32hexpadupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
	bitsPerChar: 5
}), so$2 = k$4({
	prefix: "h",
	name: "base32z",
	alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
	bitsPerChar: 5
});
var io$2 = Object.freeze({
	__proto__: null,
	base32: Xr$2,
	base32upper: Pr$2,
	base32pad: Qr$2,
	base32padupper: to$2,
	base32hex: eo$2,
	base32hexupper: no$2,
	base32hexpad: ro$2,
	base32hexpadupper: oo$2,
	base32z: so$2
});
var uo$2 = ht$2({
	prefix: "k",
	name: "base36",
	alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
}), co$2 = ht$2({
	prefix: "K",
	name: "base36upper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});
var ao$2 = Object.freeze({
	__proto__: null,
	base36: uo$2,
	base36upper: co$2
});
var fo$2 = ht$2({
	name: "base58btc",
	prefix: "z",
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
}), Do$2 = ht$2({
	name: "base58flickr",
	prefix: "Z",
	alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});
var ho$2 = Object.freeze({
	__proto__: null,
	base58btc: fo$2,
	base58flickr: Do$2
});
var lo$2 = k$4({
	prefix: "m",
	name: "base64",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	bitsPerChar: 6
}), bo$2 = k$4({
	prefix: "M",
	name: "base64pad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	bitsPerChar: 6
}), po$2 = k$4({
	prefix: "u",
	name: "base64url",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
	bitsPerChar: 6
}), wo$2 = k$4({
	prefix: "U",
	name: "base64urlpad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
	bitsPerChar: 6
});
var Eo$2 = Object.freeze({
	__proto__: null,
	base64: lo$2,
	base64pad: bo$2,
	base64url: po$2,
	base64urlpad: wo$2
});
var Me$3 = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), go$2 = Me$3.reduce((t, e, n) => (t[n] = e, t), []), yo$2 = Me$3.reduce((t, e, n) => (t[e.codePointAt(0)] = n, t), []);
function xo$2(t) {
	return t.reduce((e, n) => (e += go$2[n], e), "");
}
function Bo$2(t) {
	const e = [];
	for (const n of t) {
		const r = yo$2[n.codePointAt(0)];
		if (r === void 0) throw new Error(`Non-base256emoji character: ${n}`);
		e.push(r);
	}
	return new Uint8Array(e);
}
var Co$2 = Bt$2({
	prefix: "🚀",
	name: "base256emoji",
	encode: xo$2,
	decode: Bo$2
});
var Ao$2 = Object.freeze({
	__proto__: null,
	base256emoji: Co$2
}), mo$2 = $e$2, qe$2 = 128, So$2 = -128, vo$2 = Math.pow(2, 31);
function $e$2(t, e, n) {
	e = e || [], n = n || 0;
	for (var r = n; t >= vo$2;) e[n++] = t & 255 | qe$2, t /= 128;
	for (; t & So$2;) e[n++] = t & 255 | qe$2, t >>>= 7;
	return e[n] = t | 0, $e$2.bytes = n - r + 1, e;
}
var Io$2 = Pt$2, Uo$2 = 128, ke$3 = 127;
function Pt$2(t, r) {
	var n = 0, r = r || 0, o = 0, s = r, a, u = t.length;
	do {
		if (s >= u) throw Pt$2.bytes = 0, /* @__PURE__ */ new RangeError("Could not decode varint");
		a = t[s++], n += o < 28 ? (a & ke$3) << o : (a & ke$3) * Math.pow(2, o), o += 7;
	} while (a >= Uo$2);
	return Pt$2.bytes = s - r, n;
}
var To$2 = Math.pow(2, 7), Fo$2 = Math.pow(2, 14), No$2 = Math.pow(2, 21), Lo$2 = Math.pow(2, 28), Oo$2 = Math.pow(2, 35), Ho$2 = Math.pow(2, 42), zo$2 = Math.pow(2, 49), Mo$2 = Math.pow(2, 56), qo$2 = Math.pow(2, 63), $o$2 = function(t) {
	return t < To$2 ? 1 : t < Fo$2 ? 2 : t < No$2 ? 3 : t < Lo$2 ? 4 : t < Oo$2 ? 5 : t < Ho$2 ? 6 : t < zo$2 ? 7 : t < Mo$2 ? 8 : t < qo$2 ? 9 : 10;
}, Re$1 = {
	encode: mo$2,
	decode: Io$2,
	encodingLength: $o$2
};
var je$2 = (t, e, n = 0) => (Re$1.encode(t, e, n), e), Ze$2 = (t) => Re$1.encodingLength(t), Qt$2 = (t, e) => {
	const n = e.byteLength, r = Ze$2(t), o = r + Ze$2(n), s = new Uint8Array(o + n);
	return je$2(t, s, 0), je$2(n, s, r), s.set(e, o), new Ro$2(t, n, e, s);
};
var Ro$2 = class {
	constructor(e, n, r, o) {
		this.code = e, this.size = n, this.digest = r, this.bytes = o;
	}
};
var Ge$1 = ({ name: t, code: e, encode: n }) => new jo$2(t, e, n);
var jo$2 = class {
	constructor(e, n, r) {
		this.name = e, this.code = n, this.encode = r;
	}
	digest(e) {
		if (e instanceof Uint8Array) {
			const n = this.encode(e);
			return n instanceof Uint8Array ? Qt$2(this.code, n) : n.then((r) => Qt$2(this.code, r));
		} else throw Error("Unknown type, must be binary type");
	}
};
var Ve$2 = (t) => async (e) => new Uint8Array(await crypto.subtle.digest(t, e)), Zo$2 = Ge$1({
	name: "sha2-256",
	code: 18,
	encode: Ve$2("SHA-256")
}), Go$2 = Ge$1({
	name: "sha2-512",
	code: 19,
	encode: Ve$2("SHA-512")
});
var Vo$2 = Object.freeze({
	__proto__: null,
	sha256: Zo$2,
	sha512: Go$2
});
var Ye$2 = 0, Yo$2 = "identity", Je$1 = He$2, Jo$2 = (t) => Qt$2(Ye$2, Je$1(t));
var Wo$2 = Object.freeze({
	__proto__: null,
	identity: {
		code: Ye$2,
		name: Yo$2,
		encode: Je$1,
		digest: Jo$2
	}
});
new TextEncoder(), new TextDecoder();
var Ke$3 = {
	...kr$2,
	...jr$2,
	...Gr$2,
	...Yr$1,
	...Wr$2,
	...io$2,
	...ao$2,
	...ho$2,
	...Eo$2,
	...Ao$2
};
({
	...Vo$2,
	...Wo$2
});
function We$2(t, e, n, r) {
	return {
		name: t,
		prefix: e,
		encoder: {
			name: t,
			prefix: e,
			encode: n
		},
		decoder: { decode: r }
	};
}
var Xe$2 = We$2("utf8", "u", (t) => "u" + new TextDecoder("utf8").decode(t), (t) => new TextEncoder().encode(t.substring(1))), te$1 = We$2("ascii", "a", (t) => {
	let e = "a";
	for (let n = 0; n < t.length; n++) e += String.fromCharCode(t[n]);
	return e;
}, (t) => {
	t = t.substring(1);
	const e = Le$3(t.length);
	for (let n = 0; n < t.length; n++) e[n] = t.charCodeAt(n);
	return e;
}), Pe$2 = {
	utf8: Xe$2,
	"utf-8": Xe$2,
	hex: Ke$3.base16,
	latin1: te$1,
	ascii: te$1,
	binary: te$1,
	...Ke$3
};
function ct$2(t, e = "utf8") {
	const n = Pe$2[e];
	if (!n) throw new Error(`Unsupported encoding "${e}"`);
	return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? globalThis.Buffer.from(t.buffer, t.byteOffset, t.byteLength).toString("utf8") : n.encoder.encode(t).substring(1);
}
function rt$1(t, e = "utf8") {
	const n = Pe$2[e];
	if (!n) throw new Error(`Unsupported encoding "${e}"`);
	return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? Xt$2(globalThis.Buffer.from(t, "utf-8")) : n.decoder.decode(`${n.prefix}${t}`);
}
function lt$2(t) {
	return safeJsonParse(ct$2(rt$1(t, Dt$1), Gt$2));
}
function bt$1(t) {
	return ct$2(rt$1(safeJsonStringify(t), Gt$2), Dt$1);
}
function Qe$2(t) {
	return [
		"did",
		"key",
		"z" + ct$2(Oe$1([rt$1("K36", dt$2), t]), dt$2)
	].join(":");
}
function en$2(t) {
	return ct$2(t, Dt$1);
}
function nn$2(t) {
	return rt$1(t, Dt$1);
}
function rn$2(t) {
	return rt$1([bt$1(t.header), bt$1(t.payload)].join("."), xt$2);
}
function on$2(t) {
	return [
		bt$1(t.header),
		bt$1(t.payload),
		en$2(t.signature)
	].join(".");
}
function sn$2(t) {
	const e = t.split(".");
	return {
		header: lt$2(e[0]),
		payload: lt$2(e[1]),
		signature: nn$2(e[2]),
		data: rt$1(e.slice(0, 2).join("."), xt$2)
	};
}
function Po$2(t = he$2(32)) {
	const e = Rt$3.getPublicKey(t);
	return {
		secretKey: Oe$1([t, e]),
		publicKey: e
	};
}
async function Qo$1(t, e, n, r, o = (0, import_cjs$3.fromMiliseconds)(Date.now())) {
	const s = {
		alg: jt$2,
		typ: "JWT"
	}, i = {
		iss: Qe$2(r.publicKey),
		sub: t,
		aud: e,
		iat: o,
		exp: o + n
	}, D = rn$2({
		header: s,
		payload: i
	});
	return on$2({
		header: s,
		payload: i,
		signature: Rt$3.sign(D, r.secretKey.slice(0, 32))
	});
}
//#endregion
//#region ../../node_modules/.pnpm/uint8arrays@3.1.1/node_modules/uint8arrays/esm/src/util/as-uint8array.js
function asUint8Array(buf) {
	if (globalThis.Buffer != null) return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
	return buf;
}
//#endregion
//#region ../../node_modules/.pnpm/uint8arrays@3.1.1/node_modules/uint8arrays/esm/src/alloc.js
function allocUnsafe(size = 0) {
	if (globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null) return asUint8Array(globalThis.Buffer.allocUnsafe(size));
	return new Uint8Array(size);
}
//#endregion
//#region ../../node_modules/.pnpm/uint8arrays@3.1.1/node_modules/uint8arrays/esm/src/concat.js
function concat(arrays, length) {
	if (!length) length = arrays.reduce((acc, curr) => acc + curr.length, 0);
	const output = allocUnsafe(length);
	let offset = 0;
	for (const arr of arrays) {
		output.set(arr, offset);
		offset += arr.length;
	}
	return asUint8Array(output);
}
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/vendor/base-x.js
function base(ALPHABET, name) {
	if (ALPHABET.length >= 255) throw new TypeError("Alphabet too long");
	var BASE_MAP = new Uint8Array(256);
	for (var j = 0; j < BASE_MAP.length; j++) BASE_MAP[j] = 255;
	for (var i = 0; i < ALPHABET.length; i++) {
		var x = ALPHABET.charAt(i);
		var xc = x.charCodeAt(0);
		if (BASE_MAP[xc] !== 255) throw new TypeError(x + " is ambiguous");
		BASE_MAP[xc] = i;
	}
	var BASE = ALPHABET.length;
	var LEADER = ALPHABET.charAt(0);
	var FACTOR = Math.log(BASE) / Math.log(256);
	var iFACTOR = Math.log(256) / Math.log(BASE);
	function encode(source) {
		if (source instanceof Uint8Array);
		else if (ArrayBuffer.isView(source)) source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
		else if (Array.isArray(source)) source = Uint8Array.from(source);
		if (!(source instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (source.length === 0) return "";
		var zeroes = 0;
		var length = 0;
		var pbegin = 0;
		var pend = source.length;
		while (pbegin !== pend && source[pbegin] === 0) {
			pbegin++;
			zeroes++;
		}
		var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
		var b58 = new Uint8Array(size);
		while (pbegin !== pend) {
			var carry = source[pbegin];
			var i = 0;
			for (var it1 = size - 1; (carry !== 0 || i < length) && it1 !== -1; it1--, i++) {
				carry += 256 * b58[it1] >>> 0;
				b58[it1] = carry % BASE >>> 0;
				carry = carry / BASE >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			pbegin++;
		}
		var it2 = size - length;
		while (it2 !== size && b58[it2] === 0) it2++;
		var str = LEADER.repeat(zeroes);
		for (; it2 < size; ++it2) str += ALPHABET.charAt(b58[it2]);
		return str;
	}
	function decodeUnsafe(source) {
		if (typeof source !== "string") throw new TypeError("Expected String");
		if (source.length === 0) return new Uint8Array();
		var psz = 0;
		if (source[psz] === " ") return;
		var zeroes = 0;
		var length = 0;
		while (source[psz] === LEADER) {
			zeroes++;
			psz++;
		}
		var size = (source.length - psz) * FACTOR + 1 >>> 0;
		var b256 = new Uint8Array(size);
		while (source[psz]) {
			var carry = BASE_MAP[source.charCodeAt(psz)];
			if (carry === 255) return;
			var i = 0;
			for (var it3 = size - 1; (carry !== 0 || i < length) && it3 !== -1; it3--, i++) {
				carry += BASE * b256[it3] >>> 0;
				b256[it3] = carry % 256 >>> 0;
				carry = carry / 256 >>> 0;
			}
			if (carry !== 0) throw new Error("Non-zero carry");
			length = i;
			psz++;
		}
		if (source[psz] === " ") return;
		var it4 = size - length;
		while (it4 !== size && b256[it4] === 0) it4++;
		var vch = new Uint8Array(zeroes + (size - it4));
		var j = zeroes;
		while (it4 !== size) vch[j++] = b256[it4++];
		return vch;
	}
	function decode(string) {
		var buffer = decodeUnsafe(string);
		if (buffer) return buffer;
		throw new Error(`Non-${name} character`);
	}
	return {
		encode,
		decodeUnsafe,
		decode
	};
}
var _brrp__multiformats_scope_baseX = base;
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bytes.js
var coerce = (o) => {
	if (o instanceof Uint8Array && o.constructor.name === "Uint8Array") return o;
	if (o instanceof ArrayBuffer) return new Uint8Array(o);
	if (ArrayBuffer.isView(o)) return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
	throw new Error("Unknown type, must be binary type");
};
var fromString$1 = (str) => new TextEncoder().encode(str);
var toString$1 = (b) => new TextDecoder().decode(b);
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base.js
var Encoder = class {
	constructor(name, prefix, baseEncode) {
		this.name = name;
		this.prefix = prefix;
		this.baseEncode = baseEncode;
	}
	encode(bytes) {
		if (bytes instanceof Uint8Array) return `${this.prefix}${this.baseEncode(bytes)}`;
		else throw Error("Unknown type, must be binary type");
	}
};
var Decoder = class {
	constructor(name, prefix, baseDecode) {
		this.name = name;
		this.prefix = prefix;
		if (prefix.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
		this.prefixCodePoint = prefix.codePointAt(0);
		this.baseDecode = baseDecode;
	}
	decode(text) {
		if (typeof text === "string") {
			if (text.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
			return this.baseDecode(text.slice(this.prefix.length));
		} else throw Error("Can only multibase decode strings");
	}
	or(decoder) {
		return or$1(this, decoder);
	}
};
var ComposedDecoder = class {
	constructor(decoders) {
		this.decoders = decoders;
	}
	or(decoder) {
		return or$1(this, decoder);
	}
	decode(input) {
		const prefix = input[0];
		const decoder = this.decoders[prefix];
		if (decoder) return decoder.decode(input);
		else throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
	}
};
var or$1 = (left, right) => new ComposedDecoder({
	...left.decoders || { [left.prefix]: left },
	...right.decoders || { [right.prefix]: right }
});
var Codec = class {
	constructor(name, prefix, baseEncode, baseDecode) {
		this.name = name;
		this.prefix = prefix;
		this.baseEncode = baseEncode;
		this.baseDecode = baseDecode;
		this.encoder = new Encoder(name, prefix, baseEncode);
		this.decoder = new Decoder(name, prefix, baseDecode);
	}
	encode(input) {
		return this.encoder.encode(input);
	}
	decode(input) {
		return this.decoder.decode(input);
	}
};
var from$1 = ({ name, prefix, encode, decode }) => new Codec(name, prefix, encode, decode);
var baseX = ({ prefix, name, alphabet }) => {
	const { encode, decode } = _brrp__multiformats_scope_baseX(alphabet, name);
	return from$1({
		prefix,
		name,
		encode,
		decode: (text) => coerce(decode(text))
	});
};
var decode$2 = (string, alphabet, bitsPerChar, name) => {
	const codes = {};
	for (let i = 0; i < alphabet.length; ++i) codes[alphabet[i]] = i;
	let end = string.length;
	while (string[end - 1] === "=") --end;
	const out = new Uint8Array(end * bitsPerChar / 8 | 0);
	let bits = 0;
	let buffer = 0;
	let written = 0;
	for (let i = 0; i < end; ++i) {
		const value = codes[string[i]];
		if (value === void 0) throw new SyntaxError(`Non-${name} character`);
		buffer = buffer << bitsPerChar | value;
		bits += bitsPerChar;
		if (bits >= 8) {
			bits -= 8;
			out[written++] = 255 & buffer >> bits;
		}
	}
	if (bits >= bitsPerChar || 255 & buffer << 8 - bits) throw new SyntaxError("Unexpected end of data");
	return out;
};
var encode$3 = (data, alphabet, bitsPerChar) => {
	const pad = alphabet[alphabet.length - 1] === "=";
	const mask = (1 << bitsPerChar) - 1;
	let out = "";
	let bits = 0;
	let buffer = 0;
	for (let i = 0; i < data.length; ++i) {
		buffer = buffer << 8 | data[i];
		bits += 8;
		while (bits > bitsPerChar) {
			bits -= bitsPerChar;
			out += alphabet[mask & buffer >> bits];
		}
	}
	if (bits) out += alphabet[mask & buffer << bitsPerChar - bits];
	if (pad) while (out.length * bitsPerChar & 7) out += "=";
	return out;
};
var rfc4648 = ({ name, prefix, bitsPerChar, alphabet }) => {
	return from$1({
		prefix,
		name,
		encode(input) {
			return encode$3(input, alphabet, bitsPerChar);
		},
		decode(input) {
			return decode$2(input, alphabet, bitsPerChar, name);
		}
	});
};
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/identity.js
var identity_exports$1 = /* @__PURE__ */ __exportAll({ identity: () => identity$1 });
var identity$1 = from$1({
	prefix: "\0",
	name: "identity",
	encode: (buf) => toString$1(buf),
	decode: (str) => fromString$1(str)
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base2.js
var base2_exports = /* @__PURE__ */ __exportAll({ base2: () => base2 });
var base2 = rfc4648({
	prefix: "0",
	name: "base2",
	alphabet: "01",
	bitsPerChar: 1
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base8.js
var base8_exports = /* @__PURE__ */ __exportAll({ base8: () => base8 });
var base8 = rfc4648({
	prefix: "7",
	name: "base8",
	alphabet: "01234567",
	bitsPerChar: 3
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base10.js
var base10_exports = /* @__PURE__ */ __exportAll({ base10: () => base10 });
var base10 = baseX({
	prefix: "9",
	name: "base10",
	alphabet: "0123456789"
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base16.js
var base16_exports = /* @__PURE__ */ __exportAll({
	base16: () => base16,
	base16upper: () => base16upper
});
var base16 = rfc4648({
	prefix: "f",
	name: "base16",
	alphabet: "0123456789abcdef",
	bitsPerChar: 4
});
var base16upper = rfc4648({
	prefix: "F",
	name: "base16upper",
	alphabet: "0123456789ABCDEF",
	bitsPerChar: 4
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base32.js
var base32_exports = /* @__PURE__ */ __exportAll({
	base32: () => base32,
	base32hex: () => base32hex,
	base32hexpad: () => base32hexpad,
	base32hexpadupper: () => base32hexpadupper,
	base32hexupper: () => base32hexupper,
	base32pad: () => base32pad,
	base32padupper: () => base32padupper,
	base32upper: () => base32upper,
	base32z: () => base32z
});
var base32 = rfc4648({
	prefix: "b",
	name: "base32",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567",
	bitsPerChar: 5
});
var base32upper = rfc4648({
	prefix: "B",
	name: "base32upper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	bitsPerChar: 5
});
var base32pad = rfc4648({
	prefix: "c",
	name: "base32pad",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
	bitsPerChar: 5
});
var base32padupper = rfc4648({
	prefix: "C",
	name: "base32padupper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
	bitsPerChar: 5
});
var base32hex = rfc4648({
	prefix: "v",
	name: "base32hex",
	alphabet: "0123456789abcdefghijklmnopqrstuv",
	bitsPerChar: 5
});
var base32hexupper = rfc4648({
	prefix: "V",
	name: "base32hexupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	bitsPerChar: 5
});
var base32hexpad = rfc4648({
	prefix: "t",
	name: "base32hexpad",
	alphabet: "0123456789abcdefghijklmnopqrstuv=",
	bitsPerChar: 5
});
var base32hexpadupper = rfc4648({
	prefix: "T",
	name: "base32hexpadupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
	bitsPerChar: 5
});
var base32z = rfc4648({
	prefix: "h",
	name: "base32z",
	alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
	bitsPerChar: 5
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base36.js
var base36_exports = /* @__PURE__ */ __exportAll({
	base36: () => base36,
	base36upper: () => base36upper
});
var base36 = baseX({
	prefix: "k",
	name: "base36",
	alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
});
var base36upper = baseX({
	prefix: "K",
	name: "base36upper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base58.js
var base58_exports = /* @__PURE__ */ __exportAll({
	base58btc: () => base58btc,
	base58flickr: () => base58flickr
});
var base58btc = baseX({
	name: "base58btc",
	prefix: "z",
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
});
var base58flickr = baseX({
	name: "base58flickr",
	prefix: "Z",
	alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base64.js
var base64_exports = /* @__PURE__ */ __exportAll({
	base64: () => base64,
	base64pad: () => base64pad,
	base64url: () => base64url,
	base64urlpad: () => base64urlpad
});
var base64 = rfc4648({
	prefix: "m",
	name: "base64",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	bitsPerChar: 6
});
var base64pad = rfc4648({
	prefix: "M",
	name: "base64pad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	bitsPerChar: 6
});
var base64url = rfc4648({
	prefix: "u",
	name: "base64url",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
	bitsPerChar: 6
});
var base64urlpad = rfc4648({
	prefix: "U",
	name: "base64urlpad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
	bitsPerChar: 6
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/bases/base256emoji.js
var base256emoji_exports = /* @__PURE__ */ __exportAll({ base256emoji: () => base256emoji });
var alphabet = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂");
var alphabetBytesToChars = alphabet.reduce((p, c, i) => {
	p[i] = c;
	return p;
}, []);
var alphabetCharsToBytes = alphabet.reduce((p, c, i) => {
	p[c.codePointAt(0)] = i;
	return p;
}, []);
function encode$2(data) {
	return data.reduce((p, c) => {
		p += alphabetBytesToChars[c];
		return p;
	}, "");
}
function decode$1(str) {
	const byts = [];
	for (const char of str) {
		const byt = alphabetCharsToBytes[char.codePointAt(0)];
		if (byt === void 0) throw new Error(`Non-base256emoji character: ${char}`);
		byts.push(byt);
	}
	return new Uint8Array(byts);
}
var base256emoji = from$1({
	prefix: "🚀",
	name: "base256emoji",
	encode: encode$2,
	decode: decode$1
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/vendor/varint.js
var encode_1 = encode$1;
var MSB = 128, MSBALL = -128, INT = Math.pow(2, 31);
function encode$1(num, out, offset) {
	out = out || [];
	offset = offset || 0;
	var oldOffset = offset;
	while (num >= INT) {
		out[offset++] = num & 255 | MSB;
		num /= 128;
	}
	while (num & MSBALL) {
		out[offset++] = num & 255 | MSB;
		num >>>= 7;
	}
	out[offset] = num | 0;
	encode$1.bytes = offset - oldOffset + 1;
	return out;
}
var decode = read;
var MSB$1 = 128, REST$1 = 127;
function read(buf, offset) {
	var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
	do {
		if (counter >= l) {
			read.bytes = 0;
			throw new RangeError("Could not decode varint");
		}
		b = buf[counter++];
		res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
		shift += 7;
	} while (b >= MSB$1);
	read.bytes = counter - offset;
	return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function(value) {
	return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
};
var _brrp_varint = {
	encode: encode_1,
	decode,
	encodingLength: length
};
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/varint.js
var encodeTo = (int, target, offset = 0) => {
	_brrp_varint.encode(int, target, offset);
	return target;
};
var encodingLength = (int) => {
	return _brrp_varint.encodingLength(int);
};
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/hashes/digest.js
var create = (code, digest) => {
	const size = digest.byteLength;
	const sizeOffset = encodingLength(code);
	const digestOffset = sizeOffset + encodingLength(size);
	const bytes = new Uint8Array(digestOffset + size);
	encodeTo(code, bytes, 0);
	encodeTo(size, bytes, sizeOffset);
	bytes.set(digest, digestOffset);
	return new Digest(code, size, digest, bytes);
};
var Digest = class {
	constructor(code, size, digest, bytes) {
		this.code = code;
		this.size = size;
		this.digest = digest;
		this.bytes = bytes;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/hashes/hasher.js
var from = ({ name, code, encode }) => new Hasher(name, code, encode);
var Hasher = class {
	constructor(name, code, encode) {
		this.name = name;
		this.code = code;
		this.encode = encode;
	}
	digest(input) {
		if (input instanceof Uint8Array) {
			const result = this.encode(input);
			return result instanceof Uint8Array ? create(this.code, result) : result.then((digest) => create(this.code, digest));
		} else throw Error("Unknown type, must be binary type");
	}
};
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/hashes/sha2.js
var sha2_exports = /* @__PURE__ */ __exportAll({
	sha256: () => sha256,
	sha512: () => sha512
});
var sha256 = from({
	name: "sha2-256",
	code: 18,
	encode: (input) => coerce(crypto$1.createHash("sha256").update(input).digest())
});
var sha512 = from({
	name: "sha2-512",
	code: 19,
	encode: (input) => coerce(crypto$1.createHash("sha512").update(input).digest())
});
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/hashes/identity.js
var identity_exports = /* @__PURE__ */ __exportAll({ identity: () => identity });
var code = 0;
var name$1 = "identity";
var encode = coerce;
var digest = (input) => create(code, encode(input));
var identity = {
	code,
	name: name$1,
	encode,
	digest
};
//#endregion
//#region ../../node_modules/.pnpm/multiformats@9.9.0/node_modules/multiformats/esm/src/basics.js
var bases = {
	...identity_exports$1,
	...base2_exports,
	...base8_exports,
	...base10_exports,
	...base16_exports,
	...base32_exports,
	...base36_exports,
	...base58_exports,
	...base64_exports,
	...base256emoji_exports
};
({
	...sha2_exports,
	...identity_exports
});
//#endregion
//#region ../../node_modules/.pnpm/uint8arrays@3.1.1/node_modules/uint8arrays/esm/src/util/bases.js
function createCodec(name, prefix, encode, decode) {
	return {
		name,
		prefix,
		encoder: {
			name,
			prefix,
			encode
		},
		decoder: { decode }
	};
}
var string = createCodec("utf8", "u", (buf) => {
	return "u" + new TextDecoder("utf8").decode(buf);
}, (str) => {
	return new TextEncoder().encode(str.substring(1));
});
var ascii = createCodec("ascii", "a", (buf) => {
	let string = "a";
	for (let i = 0; i < buf.length; i++) string += String.fromCharCode(buf[i]);
	return string;
}, (str) => {
	str = str.substring(1);
	const buf = allocUnsafe(str.length);
	for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
	return buf;
});
var BASES = {
	utf8: string,
	"utf-8": string,
	hex: bases.base16,
	latin1: ascii,
	ascii,
	binary: ascii,
	...bases
};
//#endregion
//#region ../../node_modules/.pnpm/uint8arrays@3.1.1/node_modules/uint8arrays/esm/src/from-string.js
function fromString(string, encoding = "utf8") {
	const base = BASES[encoding];
	if (!base) throw new Error(`Unsupported encoding "${encoding}"`);
	if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) return asUint8Array(globalThis.Buffer.from(string, "utf-8"));
	return base.decoder.decode(`${base.prefix}${string}`);
}
//#endregion
//#region ../../node_modules/.pnpm/uint8arrays@3.1.1/node_modules/uint8arrays/esm/src/to-string.js
function toString(array, encoding = "utf8") {
	const base = BASES[encoding];
	if (!base) throw new Error(`Unsupported encoding "${encoding}"`);
	if ((encoding === "utf8" || encoding === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null) return globalThis.Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString("utf8");
	return base.encoder.encode(array).substring(1);
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+relay-api@1.0.11/node_modules/@walletconnect/relay-api/dist/index.es.js
var C$2 = {
	waku: {
		publish: "waku_publish",
		batchPublish: "waku_batchPublish",
		subscribe: "waku_subscribe",
		batchSubscribe: "waku_batchSubscribe",
		subscription: "waku_subscription",
		unsubscribe: "waku_unsubscribe",
		batchUnsubscribe: "waku_batchUnsubscribe",
		batchFetchMessages: "waku_batchFetchMessages"
	},
	irn: {
		publish: "irn_publish",
		batchPublish: "irn_batchPublish",
		subscribe: "irn_subscribe",
		batchSubscribe: "irn_batchSubscribe",
		subscription: "irn_subscription",
		unsubscribe: "irn_unsubscribe",
		batchUnsubscribe: "irn_batchUnsubscribe",
		batchFetchMessages: "irn_batchFetchMessages"
	},
	iridium: {
		publish: "iridium_publish",
		batchPublish: "iridium_batchPublish",
		subscribe: "iridium_subscribe",
		batchSubscribe: "iridium_batchSubscribe",
		subscription: "iridium_subscription",
		unsubscribe: "iridium_unsubscribe",
		batchUnsubscribe: "iridium_batchUnsubscribe",
		batchFetchMessages: "iridium_batchFetchMessages"
	}
};
//#endregion
//#region ../../node_modules/.pnpm/blakejs@1.2.1/node_modules/blakejs/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ERROR_MSG_INPUT = "Input must be an string, Buffer or Uint8Array";
	function normalizeInput(input) {
		let ret;
		if (input instanceof Uint8Array) ret = input;
		else if (typeof input === "string") ret = new TextEncoder().encode(input);
		else throw new Error(ERROR_MSG_INPUT);
		return ret;
	}
	function toHex(bytes) {
		return Array.prototype.map.call(bytes, function(n) {
			return (n < 16 ? "0" : "") + n.toString(16);
		}).join("");
	}
	function uint32ToHex(val) {
		return (4294967296 + val).toString(16).substring(1);
	}
	function debugPrint(label, arr, size) {
		let msg = "\n" + label + " = ";
		for (let i = 0; i < arr.length; i += 2) {
			if (size === 32) {
				msg += uint32ToHex(arr[i]).toUpperCase();
				msg += " ";
				msg += uint32ToHex(arr[i + 1]).toUpperCase();
			} else if (size === 64) {
				msg += uint32ToHex(arr[i + 1]).toUpperCase();
				msg += uint32ToHex(arr[i]).toUpperCase();
			} else throw new Error("Invalid size " + size);
			if (i % 6 === 4) msg += "\n" + new Array(label.length + 4).join(" ");
			else if (i < arr.length - 2) msg += " ";
		}
		console.log(msg);
	}
	function testSpeed(hashFn, N, M) {
		let startMs = (/* @__PURE__ */ new Date()).getTime();
		const input = new Uint8Array(N);
		for (let i = 0; i < N; i++) input[i] = i % 256;
		const genMs = (/* @__PURE__ */ new Date()).getTime();
		console.log("Generated random input in " + (genMs - startMs) + "ms");
		startMs = genMs;
		for (let i = 0; i < M; i++) {
			const hashHex = hashFn(input);
			const hashMs = (/* @__PURE__ */ new Date()).getTime();
			const ms = hashMs - startMs;
			startMs = hashMs;
			console.log("Hashed in " + ms + "ms: " + hashHex.substring(0, 20) + "...");
			console.log(Math.round(N / (1 << 20) / (ms / 1e3) * 100) / 100 + " MB PER SECOND");
		}
	}
	module.exports = {
		normalizeInput,
		toHex,
		debugPrint,
		testSpeed
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/blakejs@1.2.1/node_modules/blakejs/blake2b.js
var require_blake2b = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = require_util();
	function ADD64AA(v, a, b) {
		const o0 = v[a] + v[b];
		let o1 = v[a + 1] + v[b + 1];
		if (o0 >= 4294967296) o1++;
		v[a] = o0;
		v[a + 1] = o1;
	}
	function ADD64AC(v, a, b0, b1) {
		let o0 = v[a] + b0;
		if (b0 < 0) o0 += 4294967296;
		let o1 = v[a + 1] + b1;
		if (o0 >= 4294967296) o1++;
		v[a] = o0;
		v[a + 1] = o1;
	}
	function B2B_GET32(arr, i) {
		return arr[i] ^ arr[i + 1] << 8 ^ arr[i + 2] << 16 ^ arr[i + 3] << 24;
	}
	function B2B_G(a, b, c, d, ix, iy) {
		const x0 = m[ix];
		const x1 = m[ix + 1];
		const y0 = m[iy];
		const y1 = m[iy + 1];
		ADD64AA(v, a, b);
		ADD64AC(v, a, x0, x1);
		let xor0 = v[d] ^ v[a];
		let xor1 = v[d + 1] ^ v[a + 1];
		v[d] = xor1;
		v[d + 1] = xor0;
		ADD64AA(v, c, d);
		xor0 = v[b] ^ v[c];
		xor1 = v[b + 1] ^ v[c + 1];
		v[b] = xor0 >>> 24 ^ xor1 << 8;
		v[b + 1] = xor1 >>> 24 ^ xor0 << 8;
		ADD64AA(v, a, b);
		ADD64AC(v, a, y0, y1);
		xor0 = v[d] ^ v[a];
		xor1 = v[d + 1] ^ v[a + 1];
		v[d] = xor0 >>> 16 ^ xor1 << 16;
		v[d + 1] = xor1 >>> 16 ^ xor0 << 16;
		ADD64AA(v, c, d);
		xor0 = v[b] ^ v[c];
		xor1 = v[b + 1] ^ v[c + 1];
		v[b] = xor1 >>> 31 ^ xor0 << 1;
		v[b + 1] = xor0 >>> 31 ^ xor1 << 1;
	}
	var BLAKE2B_IV32 = new Uint32Array([
		4089235720,
		1779033703,
		2227873595,
		3144134277,
		4271175723,
		1013904242,
		1595750129,
		2773480762,
		2917565137,
		1359893119,
		725511199,
		2600822924,
		4215389547,
		528734635,
		327033209,
		1541459225
	]);
	var SIGMA82 = new Uint8Array([
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		14,
		10,
		4,
		8,
		9,
		15,
		13,
		6,
		1,
		12,
		0,
		2,
		11,
		7,
		5,
		3,
		11,
		8,
		12,
		0,
		5,
		2,
		15,
		13,
		10,
		14,
		3,
		6,
		7,
		1,
		9,
		4,
		7,
		9,
		3,
		1,
		13,
		12,
		11,
		14,
		2,
		6,
		5,
		10,
		4,
		0,
		15,
		8,
		9,
		0,
		5,
		7,
		2,
		4,
		10,
		15,
		14,
		1,
		11,
		12,
		6,
		8,
		3,
		13,
		2,
		12,
		6,
		10,
		0,
		11,
		8,
		3,
		4,
		13,
		7,
		5,
		15,
		14,
		1,
		9,
		12,
		5,
		1,
		15,
		14,
		13,
		4,
		10,
		0,
		7,
		6,
		3,
		9,
		2,
		8,
		11,
		13,
		11,
		7,
		14,
		12,
		1,
		3,
		9,
		5,
		0,
		15,
		4,
		8,
		6,
		2,
		10,
		6,
		15,
		14,
		9,
		11,
		3,
		0,
		8,
		12,
		2,
		13,
		7,
		1,
		4,
		10,
		5,
		10,
		2,
		8,
		4,
		7,
		6,
		1,
		5,
		15,
		11,
		9,
		14,
		3,
		12,
		13,
		0,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		14,
		10,
		4,
		8,
		9,
		15,
		13,
		6,
		1,
		12,
		0,
		2,
		11,
		7,
		5,
		3
	].map(function(x) {
		return x * 2;
	}));
	var v = new Uint32Array(32);
	var m = new Uint32Array(32);
	function blake2bCompress(ctx, last) {
		let i = 0;
		for (i = 0; i < 16; i++) {
			v[i] = ctx.h[i];
			v[i + 16] = BLAKE2B_IV32[i];
		}
		v[24] = v[24] ^ ctx.t;
		v[25] = v[25] ^ ctx.t / 4294967296;
		if (last) {
			v[28] = ~v[28];
			v[29] = ~v[29];
		}
		for (i = 0; i < 32; i++) m[i] = B2B_GET32(ctx.b, 4 * i);
		for (i = 0; i < 12; i++) {
			B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
			B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
			B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
			B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
			B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
			B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
			B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
			B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
		}
		for (i = 0; i < 16; i++) ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
	}
	var parameterBlock = new Uint8Array([
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
	]);
	function blake2bInit(outlen, key, salt, personal) {
		if (outlen === 0 || outlen > 64) throw new Error("Illegal output length, expected 0 < length <= 64");
		if (key && key.length > 64) throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
		if (salt && salt.length !== 16) throw new Error("Illegal salt, expected Uint8Array with length is 16");
		if (personal && personal.length !== 16) throw new Error("Illegal personal, expected Uint8Array with length is 16");
		const ctx = {
			b: new Uint8Array(128),
			h: new Uint32Array(16),
			t: 0,
			c: 0,
			outlen
		};
		parameterBlock.fill(0);
		parameterBlock[0] = outlen;
		if (key) parameterBlock[1] = key.length;
		parameterBlock[2] = 1;
		parameterBlock[3] = 1;
		if (salt) parameterBlock.set(salt, 32);
		if (personal) parameterBlock.set(personal, 48);
		for (let i = 0; i < 16; i++) ctx.h[i] = BLAKE2B_IV32[i] ^ B2B_GET32(parameterBlock, i * 4);
		if (key) {
			blake2bUpdate(ctx, key);
			ctx.c = 128;
		}
		return ctx;
	}
	function blake2bUpdate(ctx, input) {
		for (let i = 0; i < input.length; i++) {
			if (ctx.c === 128) {
				ctx.t += ctx.c;
				blake2bCompress(ctx, false);
				ctx.c = 0;
			}
			ctx.b[ctx.c++] = input[i];
		}
	}
	function blake2bFinal(ctx) {
		ctx.t += ctx.c;
		while (ctx.c < 128) ctx.b[ctx.c++] = 0;
		blake2bCompress(ctx, true);
		const out = new Uint8Array(ctx.outlen);
		for (let i = 0; i < ctx.outlen; i++) out[i] = ctx.h[i >> 2] >> 8 * (i & 3);
		return out;
	}
	function blake2b(input, key, outlen, salt, personal) {
		outlen = outlen || 64;
		input = util.normalizeInput(input);
		if (salt) salt = util.normalizeInput(salt);
		if (personal) personal = util.normalizeInput(personal);
		const ctx = blake2bInit(outlen, key, salt, personal);
		blake2bUpdate(ctx, input);
		return blake2bFinal(ctx);
	}
	function blake2bHex(input, key, outlen, salt, personal) {
		const output = blake2b(input, key, outlen, salt, personal);
		return util.toHex(output);
	}
	module.exports = {
		blake2b,
		blake2bHex,
		blake2bInit,
		blake2bUpdate,
		blake2bFinal
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/blakejs@1.2.1/node_modules/blakejs/blake2s.js
var require_blake2s = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = require_util();
	function B2S_GET32(v, i) {
		return v[i] ^ v[i + 1] << 8 ^ v[i + 2] << 16 ^ v[i + 3] << 24;
	}
	function B2S_G(a, b, c, d, x, y) {
		v[a] = v[a] + v[b] + x;
		v[d] = ROTR32(v[d] ^ v[a], 16);
		v[c] = v[c] + v[d];
		v[b] = ROTR32(v[b] ^ v[c], 12);
		v[a] = v[a] + v[b] + y;
		v[d] = ROTR32(v[d] ^ v[a], 8);
		v[c] = v[c] + v[d];
		v[b] = ROTR32(v[b] ^ v[c], 7);
	}
	function ROTR32(x, y) {
		return x >>> y ^ x << 32 - y;
	}
	var BLAKE2S_IV = new Uint32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]);
	var SIGMA = new Uint8Array([
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		14,
		10,
		4,
		8,
		9,
		15,
		13,
		6,
		1,
		12,
		0,
		2,
		11,
		7,
		5,
		3,
		11,
		8,
		12,
		0,
		5,
		2,
		15,
		13,
		10,
		14,
		3,
		6,
		7,
		1,
		9,
		4,
		7,
		9,
		3,
		1,
		13,
		12,
		11,
		14,
		2,
		6,
		5,
		10,
		4,
		0,
		15,
		8,
		9,
		0,
		5,
		7,
		2,
		4,
		10,
		15,
		14,
		1,
		11,
		12,
		6,
		8,
		3,
		13,
		2,
		12,
		6,
		10,
		0,
		11,
		8,
		3,
		4,
		13,
		7,
		5,
		15,
		14,
		1,
		9,
		12,
		5,
		1,
		15,
		14,
		13,
		4,
		10,
		0,
		7,
		6,
		3,
		9,
		2,
		8,
		11,
		13,
		11,
		7,
		14,
		12,
		1,
		3,
		9,
		5,
		0,
		15,
		4,
		8,
		6,
		2,
		10,
		6,
		15,
		14,
		9,
		11,
		3,
		0,
		8,
		12,
		2,
		13,
		7,
		1,
		4,
		10,
		5,
		10,
		2,
		8,
		4,
		7,
		6,
		1,
		5,
		15,
		11,
		9,
		14,
		3,
		12,
		13,
		0
	]);
	var v = new Uint32Array(16);
	var m = new Uint32Array(16);
	function blake2sCompress(ctx, last) {
		let i = 0;
		for (i = 0; i < 8; i++) {
			v[i] = ctx.h[i];
			v[i + 8] = BLAKE2S_IV[i];
		}
		v[12] ^= ctx.t;
		v[13] ^= ctx.t / 4294967296;
		if (last) v[14] = ~v[14];
		for (i = 0; i < 16; i++) m[i] = B2S_GET32(ctx.b, 4 * i);
		for (i = 0; i < 10; i++) {
			B2S_G(0, 4, 8, 12, m[SIGMA[i * 16 + 0]], m[SIGMA[i * 16 + 1]]);
			B2S_G(1, 5, 9, 13, m[SIGMA[i * 16 + 2]], m[SIGMA[i * 16 + 3]]);
			B2S_G(2, 6, 10, 14, m[SIGMA[i * 16 + 4]], m[SIGMA[i * 16 + 5]]);
			B2S_G(3, 7, 11, 15, m[SIGMA[i * 16 + 6]], m[SIGMA[i * 16 + 7]]);
			B2S_G(0, 5, 10, 15, m[SIGMA[i * 16 + 8]], m[SIGMA[i * 16 + 9]]);
			B2S_G(1, 6, 11, 12, m[SIGMA[i * 16 + 10]], m[SIGMA[i * 16 + 11]]);
			B2S_G(2, 7, 8, 13, m[SIGMA[i * 16 + 12]], m[SIGMA[i * 16 + 13]]);
			B2S_G(3, 4, 9, 14, m[SIGMA[i * 16 + 14]], m[SIGMA[i * 16 + 15]]);
		}
		for (i = 0; i < 8; i++) ctx.h[i] ^= v[i] ^ v[i + 8];
	}
	function blake2sInit(outlen, key) {
		if (!(outlen > 0 && outlen <= 32)) throw new Error("Incorrect output length, should be in [1, 32]");
		const keylen = key ? key.length : 0;
		if (key && !(keylen > 0 && keylen <= 32)) throw new Error("Incorrect key length, should be in [1, 32]");
		const ctx = {
			h: new Uint32Array(BLAKE2S_IV),
			b: new Uint8Array(64),
			c: 0,
			t: 0,
			outlen
		};
		ctx.h[0] ^= 16842752 ^ keylen << 8 ^ outlen;
		if (keylen > 0) {
			blake2sUpdate(ctx, key);
			ctx.c = 64;
		}
		return ctx;
	}
	function blake2sUpdate(ctx, input) {
		for (let i = 0; i < input.length; i++) {
			if (ctx.c === 64) {
				ctx.t += ctx.c;
				blake2sCompress(ctx, false);
				ctx.c = 0;
			}
			ctx.b[ctx.c++] = input[i];
		}
	}
	function blake2sFinal(ctx) {
		ctx.t += ctx.c;
		while (ctx.c < 64) ctx.b[ctx.c++] = 0;
		blake2sCompress(ctx, true);
		const out = new Uint8Array(ctx.outlen);
		for (let i = 0; i < ctx.outlen; i++) out[i] = ctx.h[i >> 2] >> 8 * (i & 3) & 255;
		return out;
	}
	function blake2s(input, key, outlen) {
		outlen = outlen || 32;
		input = util.normalizeInput(input);
		const ctx = blake2sInit(outlen, key);
		blake2sUpdate(ctx, input);
		return blake2sFinal(ctx);
	}
	function blake2sHex(input, key, outlen) {
		const output = blake2s(input, key, outlen);
		return util.toHex(output);
	}
	module.exports = {
		blake2s,
		blake2sHex,
		blake2sInit,
		blake2sUpdate,
		blake2sFinal
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+utils@2.21.5_bufferutil@4.1.0_db0@0.3.4_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/@walletconnect/utils/dist/index.es.js
var import_blakejs = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var b2b = require_blake2b();
	var b2s = require_blake2s();
	module.exports = {
		blake2b: b2b.blake2b,
		blake2bHex: b2b.blake2bHex,
		blake2bInit: b2b.blake2bInit,
		blake2bUpdate: b2b.blake2bUpdate,
		blake2bFinal: b2b.blake2bFinal,
		blake2s: b2s.blake2s,
		blake2sHex: b2s.blake2sHex,
		blake2sInit: b2s.blake2sInit,
		blake2sUpdate: b2s.blake2sUpdate,
		blake2sFinal: b2s.blake2sFinal
	};
})))();
var xe = ":";
function Fe$1(t) {
	const [e, n] = t.split(xe);
	return {
		namespace: e,
		reference: n
	};
}
function ve(t, e) {
	return t.includes(":") ? [t] : e.chains || [];
}
var $s$1 = Object.defineProperty, Cs$1 = Object.defineProperties, Ls$1 = Object.getOwnPropertyDescriptors, Jn$1 = Object.getOwnPropertySymbols, js$1 = Object.prototype.hasOwnProperty, ks$1 = Object.prototype.propertyIsEnumerable, Ze$1 = (t, e, n) => e in t ? $s$1(t, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : t[e] = n, Qn$1 = (t, e) => {
	for (var n in e || (e = {})) js$1.call(e, n) && Ze$1(t, n, e[n]);
	if (Jn$1) for (var n of Jn$1(e)) ks$1.call(e, n) && Ze$1(t, n, e[n]);
	return t;
}, Ps$1 = (t, e) => Cs$1(t, Ls$1(e)), tr$1 = (t, e, n) => Ze$1(t, typeof e != "symbol" ? e + "" : e, n), J$1 = {
	reactNative: "react-native",
	node: "node",
	browser: "browser",
	unknown: "unknown"
};
function Ye$1() {
	return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
}
function Bt$1() {
	return !(0, import_cjs$1.getDocument)() && !!(0, import_cjs$1.getNavigator)() && navigator.product === "ReactNative";
}
function Ms$1() {
	return Bt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u" && (global == null ? void 0 : global.Platform.OS) === "android";
}
function Vs$1() {
	return Bt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u" && (global == null ? void 0 : global.Platform.OS) === "ios";
}
function zt$1() {
	return !Ye$1() && !!(0, import_cjs$1.getNavigator)() && !!(0, import_cjs$1.getDocument)();
}
function Pt$1() {
	return Bt$1() ? J$1.reactNative : Ye$1() ? J$1.node : zt$1() ? J$1.browser : J$1.unknown;
}
function qs$1() {
	var t;
	try {
		return Bt$1() && typeof global < "u" && typeof (global == null ? void 0 : global.Application) < "u" ? (t = global.Application) == null ? void 0 : t.applicationId : void 0;
	} catch {
		return;
	}
}
function or(t, e) {
	const n = new URLSearchParams(t);
	for (const r of Object.keys(e).sort()) if (e.hasOwnProperty(r)) {
		const o = e[r];
		o !== void 0 && n.set(r, o);
	}
	return n.toString();
}
function Ks$1(t) {
	var e, n;
	const r = sr$1();
	try {
		return t != null && t.url && r.url && new URL(t.url).host !== new URL(r.url).host && (console.warn(`The configured WalletConnect 'metadata.url':${t.url} differs from the actual page url:${r.url}. This is probably unintended and can lead to issues.`), t.url = r.url), (e = t?.icons) != null && e.length && t.icons.length > 0 && (t.icons = t.icons.filter((o) => o !== "")), Ps$1(Qn$1(Qn$1({}, r), t), {
			url: t?.url || r.url,
			name: t?.name || r.name,
			description: t?.description || r.description,
			icons: (n = t?.icons) != null && n.length && t.icons.length > 0 ? t.icons : r.icons
		});
	} catch (o) {
		return console.warn("Error populating app metadata", o), t || r;
	}
}
function sr$1() {
	return (0, import_cjs$2.getWindowMetadata)() || {
		name: "",
		description: "",
		url: "",
		icons: [""]
	};
}
function ir$1() {
	if (Pt$1() === J$1.reactNative && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u") {
		const { OS: n, Version: r } = global.Platform;
		return [n, r].join("-");
	}
	const t = detect();
	if (t === null) return "unknown";
	const e = t.os ? t.os.replace(" ", "").toLowerCase() : "unknown";
	return t.type === "browser" ? [
		e,
		t.name,
		t.version
	].join("-") : [e, t.version].join("-");
}
function fr$1() {
	var t;
	const e = Pt$1();
	return e === J$1.browser ? [e, ((t = (0, import_cjs$1.getLocation)()) == null ? void 0 : t.host) || "unknown"].join(":") : e;
}
function cr$1(t, e, n) {
	const r = ir$1(), o = fr$1();
	return [
		[t, e].join("-"),
		["js", n].join("-"),
		r,
		o
	].join("/");
}
function zs({ protocol: t, version: e, relayUrl: n, sdkVersion: r, auth: o, projectId: s, useOnCloseEvent: i, bundleId: f, packageName: a }) {
	const l = n.split("?"), u = {
		auth: o,
		ua: cr$1(t, e, r),
		projectId: s,
		useOnCloseEvent: i || void 0,
		packageName: a || void 0,
		bundleId: f || void 0
	}, h = or(l[1] || "", u);
	return l[0] + "?" + h;
}
function It$1(t, e) {
	return t.filter((n) => e.includes(n)).length === t.length;
}
function Ys$1(t) {
	return Object.fromEntries(t.entries());
}
function Xs$1(t) {
	return new Map(Object.entries(t));
}
function ei$1(t = import_cjs$3.FIVE_MINUTES, e) {
	const n = (0, import_cjs$3.toMiliseconds)(t || import_cjs$3.FIVE_MINUTES);
	let r, o, s, i;
	return {
		resolve: (f) => {
			s && r && (clearTimeout(s), r(f), i = Promise.resolve(f));
		},
		reject: (f) => {
			s && o && (clearTimeout(s), o(f));
		},
		done: () => new Promise((f, a) => {
			if (i) return f(i);
			s = setTimeout(() => {
				const l = new Error(e);
				i = Promise.reject(l), a(l);
			}, n), r = f, o = a;
		})
	};
}
function ni$1(t, e, n) {
	return new Promise(async (r, o) => {
		const s = setTimeout(() => o(new Error(n)), e);
		try {
			r(await t);
		} catch (i) {
			o(i);
		}
		clearTimeout(s);
	});
}
function Xe$1(t, e) {
	if (typeof e == "string" && e.startsWith(`${t}:`)) return e;
	if (t.toLowerCase() === "topic") {
		if (typeof e != "string") throw new Error("Value must be \"string\" for expirer target type: topic");
		return `topic:${e}`;
	} else if (t.toLowerCase() === "id") {
		if (typeof e != "number") throw new Error("Value must be \"number\" for expirer target type: id");
		return `id:${e}`;
	}
	throw new Error(`Unknown expirer target type: ${t}`);
}
function ri$1(t) {
	return Xe$1("topic", t);
}
function oi$1(t) {
	return Xe$1("id", t);
}
function si$1(t) {
	const [e, n] = t.split(":"), r = {
		id: void 0,
		topic: void 0
	};
	if (e === "topic" && typeof n == "string") r.topic = n;
	else if (e === "id" && Number.isInteger(Number(n))) r.id = Number(n);
	else throw new Error(`Invalid target, expected id:number or topic:string, got ${e}:${n}`);
	return r;
}
function ii$1(t, e) {
	return (0, import_cjs$3.fromMiliseconds)((e || Date.now()) + (0, import_cjs$3.toMiliseconds)(t));
}
function fi$1(t) {
	return Date.now() >= (0, import_cjs$3.toMiliseconds)(t);
}
function ci$1(t, e) {
	return `${t}${e ? `:${e}` : ""}`;
}
function ct$1(t = [], e = []) {
	return [...new Set([...t, ...e])];
}
async function ai$1({ id: t, topic: e, wcDeepLink: n }) {
	var r;
	try {
		if (!n) return;
		const s = (typeof n == "string" ? JSON.parse(n) : n)?.href;
		if (typeof s != "string") return;
		const i = dr$1(s, t, e), f = Pt$1();
		if (f === J$1.browser) {
			if (!((r = (0, import_cjs$1.getDocument)()) != null && r.hasFocus())) {
				console.warn("Document does not have focus, skipping deeplink.");
				return;
			}
			hr$1(i);
		} else f === J$1.reactNative && typeof (global == null ? void 0 : global.Linking) < "u" && await global.Linking.openURL(i);
	} catch (o) {
		console.error(o);
	}
}
function dr$1(t, e, n) {
	const r = `requestId=${e}&sessionTopic=${n}`;
	t.endsWith("/") && (t = t.slice(0, -1));
	let o = `${t}`;
	if (t.startsWith("https://t.me")) {
		const s = t.includes("?") ? "&startapp=" : "?startapp=";
		o = `${o}${s}${br$1(r, !0)}`;
	} else o = `${o}/wc?${r}`;
	return o;
}
function hr$1(t) {
	let e = "_self";
	gr$1() ? e = "_top" : (pr$1() || t.startsWith("https://") || t.startsWith("http://")) && (e = "_blank"), window.open(t, e, "noreferrer noopener");
}
async function ui$1(t, e) {
	let n = "";
	try {
		if (zt$1() && (n = localStorage.getItem(e), n)) return n;
		n = await t.getItem(e);
	} catch (r) {
		console.error(r);
	}
	return n;
}
function li$1(t, e) {
	if (!t.includes(e)) return null;
	const n = t.split(/([&,?,=])/);
	return n[n.indexOf(e) + 2];
}
function di$1() {
	return typeof crypto < "u" && crypto != null && crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu, (t) => {
		const e = Math.random() * 16 | 0;
		return (t === "x" ? e : e & 3 | 8).toString(16);
	});
}
function hi$1() {
	return typeof process < "u" && process.env.IS_VITEST === "true";
}
function pr$1() {
	return typeof window < "u" && (!!window.TelegramWebviewProxy || !!window.Telegram || !!window.TelegramWebviewProxyProto);
}
function gr$1() {
	try {
		return window.self !== window.top;
	} catch {
		return !1;
	}
}
function br$1(t, e = !1) {
	const n = Buffer.from(t).toString("base64");
	return e ? n.replace(/[=]/g, "") : n;
}
function Qe$1(t) {
	return Buffer.from(t, "base64").toString("utf-8");
}
function pi$1(t) {
	return new Promise((e) => setTimeout(e, t));
}
var gi$1 = class {
	constructor({ limit: e }) {
		tr$1(this, "limit"), tr$1(this, "set"), this.limit = e, this.set = /* @__PURE__ */ new Set();
	}
	add(e) {
		if (!this.set.has(e)) {
			if (this.set.size >= this.limit) {
				const n = this.set.values().next().value;
				n && this.set.delete(n);
			}
			this.set.add(e);
		}
	}
	has(e) {
		return this.set.has(e);
	}
};
var Be$1 = BigInt(2 ** 32 - 1), yr$1 = BigInt(32);
function mr$1(t, e = !1) {
	return e ? {
		h: Number(t & Be$1),
		l: Number(t >> yr$1 & Be$1)
	} : {
		h: Number(t >> yr$1 & Be$1) | 0,
		l: Number(t & Be$1) | 0
	};
}
function wr$1(t, e = !1) {
	const n = t.length;
	let r = new Uint32Array(n), o = new Uint32Array(n);
	for (let s = 0; s < n; s++) {
		const { h: i, l: f } = mr$1(t[s], e);
		[r[s], o[s]] = [i, f];
	}
	return [r, o];
}
var xr$1 = (t, e, n) => t >>> n, vr$1 = (t, e, n) => t << 32 - n | e >>> n, At$1 = (t, e, n) => t >>> n | e << 32 - n, St$2 = (t, e, n) => t << 32 - n | e >>> n, se$1 = (t, e, n) => t << 64 - n | e >>> n - 32, ie$1 = (t, e, n) => t >>> n - 32 | e << 64 - n, bi$1 = (t, e) => e, yi$1 = (t, e) => t, mi$1 = (t, e, n) => t << n | e >>> 32 - n, wi$1 = (t, e, n) => e << n | t >>> 32 - n, xi$1 = (t, e, n) => e << n - 32 | t >>> 64 - n, vi$1 = (t, e, n) => t << n - 32 | e >>> 64 - n;
function dt$1(t, e, n, r) {
	const o = (e >>> 0) + (r >>> 0);
	return {
		h: t + n + (o / 2 ** 32 | 0) | 0,
		l: o | 0
	};
}
var tn = (t, e, n) => (t >>> 0) + (e >>> 0) + (n >>> 0), en$1 = (t, e, n, r) => e + n + r + (t / 2 ** 32 | 0) | 0, Ei$1 = (t, e, n, r) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0), Bi$1 = (t, e, n, r, o) => e + n + r + o + (t / 2 ** 32 | 0) | 0, Ii$1 = (t, e, n, r, o) => (t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0), Ai$1 = (t, e, n, r, o, s) => e + n + r + o + s + (t / 2 ** 32 | 0) | 0, Gt$1 = typeof globalThis == "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
function nn$1(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function mt$1(t) {
	if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
function at(t, ...e) {
	if (!nn$1(t)) throw new Error("Uint8Array expected");
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function rn$1(t) {
	if (typeof t != "function" || typeof t.create != "function") throw new Error("Hash should be wrapped by utils.createHasher");
	mt$1(t.outputLen), mt$1(t.blockLen);
}
function Nt$1(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function on$1(t, e) {
	at(t);
	const n = e.outputLen;
	if (t.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
}
function fe$1(t) {
	return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function ut$1(...t) {
	for (let e = 0; e < t.length; e++) t[e].fill(0);
}
function sn$1(t) {
	return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
function gt$1(t, e) {
	return t << 32 - e | t >>> e;
}
var Er$1 = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Br$1(t) {
	return t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;
}
var wt$1 = Er$1 ? (t) => t : (t) => Br$1(t);
function Si$1(t) {
	for (let e = 0; e < t.length; e++) t[e] = Br$1(t[e]);
	return t;
}
var Ot$1 = Er$1 ? (t) => t : Si$1, Ir$1 = typeof Uint8Array.from([]).toHex == "function" && typeof Uint8Array.fromHex == "function", Ni$1 = Array.from({ length: 256 }, (t, e) => e.toString(16).padStart(2, "0"));
function ce$1(t) {
	if (at(t), Ir$1) return t.toHex();
	let e = "";
	for (let n = 0; n < t.length; n++) e += Ni$1[t[n]];
	return e;
}
var xt$1 = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function Ar$1(t) {
	if (t >= xt$1._0 && t <= xt$1._9) return t - xt$1._0;
	if (t >= xt$1.A && t <= xt$1.F) return t - (xt$1.A - 10);
	if (t >= xt$1.a && t <= xt$1.f) return t - (xt$1.a - 10);
}
function fn$1(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	if (Ir$1) return Uint8Array.fromHex(t);
	const e = t.length, n = e / 2;
	if (e % 2) throw new Error("hex string expected, got unpadded hex of length " + e);
	const r = new Uint8Array(n);
	for (let o = 0, s = 0; o < n; o++, s += 2) {
		const i = Ar$1(t.charCodeAt(s)), f = Ar$1(t.charCodeAt(s + 1));
		if (i === void 0 || f === void 0) {
			const a = t[s] + t[s + 1];
			throw new Error("hex string expected, got non-hex character \"" + a + "\" at index " + s);
		}
		r[o] = i * 16 + f;
	}
	return r;
}
function Oi$1(t) {
	if (typeof t != "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(t));
}
function ht$1(t) {
	return typeof t == "string" && (t = Oi$1(t)), at(t), t;
}
function Ht$1(...t) {
	let e = 0;
	for (let r = 0; r < t.length; r++) {
		const o = t[r];
		at(o), e += o.length;
	}
	const n = new Uint8Array(e);
	for (let r = 0, o = 0; r < t.length; r++) {
		const s = t[r];
		n.set(s, o), o += s.length;
	}
	return n;
}
var Ie$1 = class {};
function ae$1(t) {
	const e = (r) => t().update(ht$1(r)).digest(), n = t();
	return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = () => t(), e;
}
function Ui$1(t) {
	const e = (r, o) => t(o).update(ht$1(r)).digest(), n = t({});
	return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
function Zt$1(t = 32) {
	if (Gt$1 && typeof Gt$1.getRandomValues == "function") return Gt$1.getRandomValues(new Uint8Array(t));
	if (Gt$1 && typeof Gt$1.randomBytes == "function") return Uint8Array.from(Gt$1.randomBytes(t));
	throw new Error("crypto.getRandomValues must be defined");
}
var _i$1 = BigInt(0), ue$1 = BigInt(1), Ti$1 = BigInt(2), Ri$1 = BigInt(7), $i$1 = BigInt(256), Ci$1 = BigInt(113), Sr$1 = [], Nr$1 = [], Or$1 = [];
for (let t = 0, e = ue$1, n = 1, r = 0; t < 24; t++) {
	[n, r] = [r, (2 * n + 3 * r) % 5], Sr$1.push(2 * (5 * r + n)), Nr$1.push((t + 1) * (t + 2) / 2 % 64);
	let o = _i$1;
	for (let s = 0; s < 7; s++) e = (e << ue$1 ^ (e >> Ri$1) * Ci$1) % $i$1, e & Ti$1 && (o ^= ue$1 << (ue$1 << BigInt(s)) - ue$1);
	Or$1.push(o);
}
var Ur$1 = wr$1(Or$1, !0), Li$1 = Ur$1[0], ji$1 = Ur$1[1], _r$1 = (t, e, n) => n > 32 ? xi$1(t, e, n) : mi$1(t, e, n), Tr$1 = (t, e, n) => n > 32 ? vi$1(t, e, n) : wi$1(t, e, n);
function ki$1(t, e = 24) {
	const n = new Uint32Array(10);
	for (let r = 24 - e; r < 24; r++) {
		for (let i = 0; i < 10; i++) n[i] = t[i] ^ t[i + 10] ^ t[i + 20] ^ t[i + 30] ^ t[i + 40];
		for (let i = 0; i < 10; i += 2) {
			const f = (i + 8) % 10, a = (i + 2) % 10, l = n[a], c = n[a + 1], u = _r$1(l, c, 1) ^ n[f], h = Tr$1(l, c, 1) ^ n[f + 1];
			for (let g = 0; g < 50; g += 10) t[i + g] ^= u, t[i + g + 1] ^= h;
		}
		let o = t[2], s = t[3];
		for (let i = 0; i < 24; i++) {
			const f = Nr$1[i], a = _r$1(o, s, f), l = Tr$1(o, s, f), c = Sr$1[i];
			o = t[c], s = t[c + 1], t[c] = a, t[c + 1] = l;
		}
		for (let i = 0; i < 50; i += 10) {
			for (let f = 0; f < 10; f++) n[f] = t[i + f];
			for (let f = 0; f < 10; f++) t[i + f] ^= ~n[(f + 2) % 10] & n[(f + 4) % 10];
		}
		t[0] ^= Li$1[r], t[1] ^= ji$1[r];
	}
	ut$1(n);
}
var qn$1 = class qn$1 extends Ie$1 {
	constructor(e, n, r, o = !1, s = 24) {
		if (super(), this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, this.enableXOF = !1, this.blockLen = e, this.suffix = n, this.outputLen = r, this.enableXOF = o, this.rounds = s, mt$1(r), !(0 < e && e < 200)) throw new Error("only keccak-f1600 function is supported");
		this.state = new Uint8Array(200), this.state32 = fe$1(this.state);
	}
	clone() {
		return this._cloneInto();
	}
	keccak() {
		Ot$1(this.state32), ki$1(this.state32, this.rounds), Ot$1(this.state32), this.posOut = 0, this.pos = 0;
	}
	update(e) {
		Nt$1(this), e = ht$1(e), at(e);
		const { blockLen: n, state: r } = this, o = e.length;
		for (let s = 0; s < o;) {
			const i = Math.min(n - this.pos, o - s);
			for (let f = 0; f < i; f++) r[this.pos++] ^= e[s++];
			this.pos === n && this.keccak();
		}
		return this;
	}
	finish() {
		if (this.finished) return;
		this.finished = !0;
		const { state: e, suffix: n, pos: r, blockLen: o } = this;
		e[r] ^= n, n & 128 && r === o - 1 && this.keccak(), e[o - 1] ^= 128, this.keccak();
	}
	writeInto(e) {
		Nt$1(this, !1), at(e), this.finish();
		const n = this.state, { blockLen: r } = this;
		for (let o = 0, s = e.length; o < s;) {
			this.posOut >= r && this.keccak();
			const i = Math.min(r - this.posOut, s - o);
			e.set(n.subarray(this.posOut, this.posOut + i), o), this.posOut += i, o += i;
		}
		return e;
	}
	xofInto(e) {
		if (!this.enableXOF) throw new Error("XOF is not possible for this instance");
		return this.writeInto(e);
	}
	xof(e) {
		return mt$1(e), this.xofInto(new Uint8Array(e));
	}
	digestInto(e) {
		if (on$1(e, this), this.finished) throw new Error("digest() was already called");
		return this.writeInto(e), this.destroy(), e;
	}
	digest() {
		return this.digestInto(new Uint8Array(this.outputLen));
	}
	destroy() {
		this.destroyed = !0, ut$1(this.state);
	}
	_cloneInto(e) {
		const { blockLen: n, suffix: r, outputLen: o, rounds: s, enableXOF: i } = this;
		return e || (e = new qn$1(n, r, o, i, s)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = s, e.suffix = r, e.outputLen = o, e.enableXOF = i, e.destroyed = this.destroyed, e;
	}
};
var Pi$1 = (t, e, n) => ae$1(() => new qn$1(e, t, n)), Hi = Pi$1(1, 136, 256 / 8);
function Di$1(t, e, n, r) {
	if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, n, r);
	const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), f = Number(n & s), a = r ? 4 : 0, l = r ? 0 : 4;
	t.setUint32(e + a, i, r), t.setUint32(e + l, f, r);
}
function Mi$1(t, e, n) {
	return t & e ^ ~t & n;
}
function Vi$1(t, e, n) {
	return t & e ^ t & n ^ e & n;
}
var Rr$1 = class extends Ie$1 {
	constructor(e, n, r, o) {
		super(), this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.blockLen = e, this.outputLen = n, this.padOffset = r, this.isLE = o, this.buffer = new Uint8Array(e), this.view = sn$1(this.buffer);
	}
	update(e) {
		Nt$1(this), e = ht$1(e), at(e);
		const { view: n, buffer: r, blockLen: o } = this, s = e.length;
		for (let i = 0; i < s;) {
			const f = Math.min(o - this.pos, s - i);
			if (f === o) {
				const a = sn$1(e);
				for (; o <= s - i; i += o) this.process(a, i);
				continue;
			}
			r.set(e.subarray(i, i + f), this.pos), this.pos += f, i += f, this.pos === o && (this.process(n, 0), this.pos = 0);
		}
		return this.length += e.length, this.roundClean(), this;
	}
	digestInto(e) {
		Nt$1(this), on$1(e, this), this.finished = !0;
		const { buffer: n, view: r, blockLen: o, isLE: s } = this;
		let { pos: i } = this;
		n[i++] = 128, ut$1(this.buffer.subarray(i)), this.padOffset > o - i && (this.process(r, 0), i = 0);
		for (let u = i; u < o; u++) n[u] = 0;
		Di$1(r, o - 8, BigInt(this.length * 8), s), this.process(r, 0);
		const f = sn$1(e), a = this.outputLen;
		if (a % 4) throw new Error("_sha2: outputLen should be aligned to 32bit");
		const l = a / 4, c = this.get();
		if (l > c.length) throw new Error("_sha2: outputLen bigger than state");
		for (let u = 0; u < l; u++) f.setUint32(4 * u, c[u], s);
	}
	digest() {
		const { buffer: e, outputLen: n } = this;
		this.digestInto(e);
		const r = e.slice(0, n);
		return this.destroy(), r;
	}
	_cloneInto(e) {
		e || (e = new this.constructor()), e.set(...this.get());
		const { blockLen: n, buffer: r, length: o, finished: s, destroyed: i, pos: f } = this;
		return e.destroyed = i, e.finished = s, e.length = o, e.pos = f, o % n && e.buffer.set(r), e;
	}
	clone() {
		return this._cloneInto();
	}
};
var Ut$1 = Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), W$1 = Uint32Array.from([
	3418070365,
	3238371032,
	1654270250,
	914150663,
	2438529370,
	812702999,
	355462360,
	4144912697,
	1731405415,
	4290775857,
	2394180231,
	1750603025,
	3675008525,
	1694076839,
	1203062813,
	3204075428
]), Y$1 = Uint32Array.from([
	1779033703,
	4089235720,
	3144134277,
	2227873595,
	1013904242,
	4271175723,
	2773480762,
	1595750129,
	1359893119,
	2917565137,
	2600822924,
	725511199,
	528734635,
	4215389547,
	1541459225,
	327033209
]), qi$1 = Uint32Array.from([
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
]), _t$1 = new Uint32Array(64);
var Ki$1 = class extends Rr$1 {
	constructor(e = 32) {
		super(64, e, 8, !1), this.A = Ut$1[0] | 0, this.B = Ut$1[1] | 0, this.C = Ut$1[2] | 0, this.D = Ut$1[3] | 0, this.E = Ut$1[4] | 0, this.F = Ut$1[5] | 0, this.G = Ut$1[6] | 0, this.H = Ut$1[7] | 0;
	}
	get() {
		const { A: e, B: n, C: r, D: o, E: s, F: i, G: f, H: a } = this;
		return [
			e,
			n,
			r,
			o,
			s,
			i,
			f,
			a
		];
	}
	set(e, n, r, o, s, i, f, a) {
		this.A = e | 0, this.B = n | 0, this.C = r | 0, this.D = o | 0, this.E = s | 0, this.F = i | 0, this.G = f | 0, this.H = a | 0;
	}
	process(e, n) {
		for (let u = 0; u < 16; u++, n += 4) _t$1[u] = e.getUint32(n, !1);
		for (let u = 16; u < 64; u++) {
			const h = _t$1[u - 15], g = _t$1[u - 2], w = gt$1(h, 7) ^ gt$1(h, 18) ^ h >>> 3;
			_t$1[u] = (gt$1(g, 17) ^ gt$1(g, 19) ^ g >>> 10) + _t$1[u - 7] + w + _t$1[u - 16] | 0;
		}
		let { A: r, B: o, C: s, D: i, E: f, F: a, G: l, H: c } = this;
		for (let u = 0; u < 64; u++) {
			const h = gt$1(f, 6) ^ gt$1(f, 11) ^ gt$1(f, 25), g = c + h + Mi$1(f, a, l) + qi$1[u] + _t$1[u] | 0, y = (gt$1(r, 2) ^ gt$1(r, 13) ^ gt$1(r, 22)) + Vi$1(r, o, s) | 0;
			c = l, l = a, a = f, f = i + g | 0, i = s, s = o, o = r, r = g + y | 0;
		}
		r = r + this.A | 0, o = o + this.B | 0, s = s + this.C | 0, i = i + this.D | 0, f = f + this.E | 0, a = a + this.F | 0, l = l + this.G | 0, c = c + this.H | 0, this.set(r, o, s, i, f, a, l, c);
	}
	roundClean() {
		ut$1(_t$1);
	}
	destroy() {
		this.set(0, 0, 0, 0, 0, 0, 0, 0), ut$1(this.buffer);
	}
};
var $r$1 = wr$1([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((t) => BigInt(t))), Fi$1 = $r$1[0], zi$1 = $r$1[1], Tt$1 = new Uint32Array(80), Rt$2 = new Uint32Array(80);
var cn$1 = class extends Rr$1 {
	constructor(e = 64) {
		super(128, e, 16, !1), this.Ah = Y$1[0] | 0, this.Al = Y$1[1] | 0, this.Bh = Y$1[2] | 0, this.Bl = Y$1[3] | 0, this.Ch = Y$1[4] | 0, this.Cl = Y$1[5] | 0, this.Dh = Y$1[6] | 0, this.Dl = Y$1[7] | 0, this.Eh = Y$1[8] | 0, this.El = Y$1[9] | 0, this.Fh = Y$1[10] | 0, this.Fl = Y$1[11] | 0, this.Gh = Y$1[12] | 0, this.Gl = Y$1[13] | 0, this.Hh = Y$1[14] | 0, this.Hl = Y$1[15] | 0;
	}
	get() {
		const { Ah: e, Al: n, Bh: r, Bl: o, Ch: s, Cl: i, Dh: f, Dl: a, Eh: l, El: c, Fh: u, Fl: h, Gh: g, Gl: w, Hh: y, Hl: x } = this;
		return [
			e,
			n,
			r,
			o,
			s,
			i,
			f,
			a,
			l,
			c,
			u,
			h,
			g,
			w,
			y,
			x
		];
	}
	set(e, n, r, o, s, i, f, a, l, c, u, h, g, w, y, x) {
		this.Ah = e | 0, this.Al = n | 0, this.Bh = r | 0, this.Bl = o | 0, this.Ch = s | 0, this.Cl = i | 0, this.Dh = f | 0, this.Dl = a | 0, this.Eh = l | 0, this.El = c | 0, this.Fh = u | 0, this.Fl = h | 0, this.Gh = g | 0, this.Gl = w | 0, this.Hh = y | 0, this.Hl = x | 0;
	}
	process(e, n) {
		for (let L = 0; L < 16; L++, n += 4) Tt$1[L] = e.getUint32(n), Rt$2[L] = e.getUint32(n += 4);
		for (let L = 16; L < 80; L++) {
			const V = Tt$1[L - 15] | 0, _ = Rt$2[L - 15] | 0, k = At$1(V, _, 1) ^ At$1(V, _, 8) ^ xr$1(V, _, 7), j = St$2(V, _, 1) ^ St$2(V, _, 8) ^ vr$1(V, _, 7), $ = Tt$1[L - 2] | 0, d = Rt$2[L - 2] | 0, m = At$1($, d, 19) ^ se$1($, d, 61) ^ xr$1($, d, 6), b = Ei$1(j, St$2($, d, 19) ^ ie$1($, d, 61) ^ vr$1($, d, 6), Rt$2[L - 7], Rt$2[L - 16]);
			Tt$1[L] = Bi$1(b, k, m, Tt$1[L - 7], Tt$1[L - 16]) | 0, Rt$2[L] = b | 0;
		}
		let { Ah: r, Al: o, Bh: s, Bl: i, Ch: f, Cl: a, Dh: l, Dl: c, Eh: u, El: h, Fh: g, Fl: w, Gh: y, Gl: x, Hh: R, Hl: M } = this;
		for (let L = 0; L < 80; L++) {
			const V = At$1(u, h, 14) ^ At$1(u, h, 18) ^ se$1(u, h, 41), _ = St$2(u, h, 14) ^ St$2(u, h, 18) ^ ie$1(u, h, 41), k = u & g ^ ~u & y, j = h & w ^ ~h & x, $ = Ii$1(M, _, j, zi$1[L], Rt$2[L]), d = Ai$1($, R, V, k, Fi$1[L], Tt$1[L]), m = $ | 0, p = At$1(r, o, 28) ^ se$1(r, o, 34) ^ se$1(r, o, 39), b = St$2(r, o, 28) ^ ie$1(r, o, 34) ^ ie$1(r, o, 39), v = r & s ^ r & f ^ s & f, B = o & i ^ o & a ^ i & a;
			R = y | 0, M = x | 0, y = g | 0, x = w | 0, g = u | 0, w = h | 0, {h: u, l: h} = dt$1(l | 0, c | 0, d | 0, m | 0), l = f | 0, c = a | 0, f = s | 0, a = i | 0, s = r | 0, i = o | 0;
			const E = tn(m, b, B);
			r = en$1(E, d, p, v), o = E | 0;
		}
		({h: r, l: o} = dt$1(this.Ah | 0, this.Al | 0, r | 0, o | 0)), {h: s, l: i} = dt$1(this.Bh | 0, this.Bl | 0, s | 0, i | 0), {h: f, l: a} = dt$1(this.Ch | 0, this.Cl | 0, f | 0, a | 0), {h: l, l: c} = dt$1(this.Dh | 0, this.Dl | 0, l | 0, c | 0), {h: u, l: h} = dt$1(this.Eh | 0, this.El | 0, u | 0, h | 0), {h: g, l: w} = dt$1(this.Fh | 0, this.Fl | 0, g | 0, w | 0), {h: y, l: x} = dt$1(this.Gh | 0, this.Gl | 0, y | 0, x | 0), {h: R, l: M} = dt$1(this.Hh | 0, this.Hl | 0, R | 0, M | 0), this.set(r, o, s, i, f, a, l, c, u, h, g, w, y, x, R, M);
	}
	roundClean() {
		ut$1(Tt$1, Rt$2);
	}
	destroy() {
		ut$1(this.buffer), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
var Gi$1 = class extends cn$1 {
	constructor() {
		super(48), this.Ah = W$1[0] | 0, this.Al = W$1[1] | 0, this.Bh = W$1[2] | 0, this.Bl = W$1[3] | 0, this.Ch = W$1[4] | 0, this.Cl = W$1[5] | 0, this.Dh = W$1[6] | 0, this.Dl = W$1[7] | 0, this.Eh = W$1[8] | 0, this.El = W$1[9] | 0, this.Fh = W$1[10] | 0, this.Fl = W$1[11] | 0, this.Gh = W$1[12] | 0, this.Gl = W$1[13] | 0, this.Hh = W$1[14] | 0, this.Hl = W$1[15] | 0;
	}
};
var X$1 = Uint32Array.from([
	573645204,
	4230739756,
	2673172387,
	3360449730,
	596883563,
	1867755857,
	2520282905,
	1497426621,
	2519219938,
	2827943907,
	3193839141,
	1401305490,
	721525244,
	746961066,
	246885852,
	2177182882
]);
var Zi = class extends cn$1 {
	constructor() {
		super(32), this.Ah = X$1[0] | 0, this.Al = X$1[1] | 0, this.Bh = X$1[2] | 0, this.Bl = X$1[3] | 0, this.Ch = X$1[4] | 0, this.Cl = X$1[5] | 0, this.Dh = X$1[6] | 0, this.Dl = X$1[7] | 0, this.Eh = X$1[8] | 0, this.El = X$1[9] | 0, this.Fh = X$1[10] | 0, this.Fl = X$1[11] | 0, this.Gh = X$1[12] | 0, this.Gl = X$1[13] | 0, this.Hh = X$1[14] | 0, this.Hl = X$1[15] | 0;
	}
};
var Ae = ae$1(() => new Ki$1()), Wi = ae$1(() => new cn$1()), Yi = ae$1(() => new Gi$1()), Xi = ae$1(() => new Zi()), Ji$1 = Uint8Array.from([
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3,
	11,
	8,
	12,
	0,
	5,
	2,
	15,
	13,
	10,
	14,
	3,
	6,
	7,
	1,
	9,
	4,
	7,
	9,
	3,
	1,
	13,
	12,
	11,
	14,
	2,
	6,
	5,
	10,
	4,
	0,
	15,
	8,
	9,
	0,
	5,
	7,
	2,
	4,
	10,
	15,
	14,
	1,
	11,
	12,
	6,
	8,
	3,
	13,
	2,
	12,
	6,
	10,
	0,
	11,
	8,
	3,
	4,
	13,
	7,
	5,
	15,
	14,
	1,
	9,
	12,
	5,
	1,
	15,
	14,
	13,
	4,
	10,
	0,
	7,
	6,
	3,
	9,
	2,
	8,
	11,
	13,
	11,
	7,
	14,
	12,
	1,
	3,
	9,
	5,
	0,
	15,
	4,
	8,
	6,
	2,
	10,
	6,
	15,
	14,
	9,
	11,
	3,
	0,
	8,
	12,
	2,
	13,
	7,
	1,
	4,
	10,
	5,
	10,
	2,
	8,
	4,
	7,
	6,
	1,
	5,
	15,
	11,
	9,
	14,
	3,
	12,
	13,
	0,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3,
	11,
	8,
	12,
	0,
	5,
	2,
	15,
	13,
	10,
	14,
	3,
	6,
	7,
	1,
	9,
	4,
	7,
	9,
	3,
	1,
	13,
	12,
	11,
	14,
	2,
	6,
	5,
	10,
	4,
	0,
	15,
	8,
	9,
	0,
	5,
	7,
	2,
	4,
	10,
	15,
	14,
	1,
	11,
	12,
	6,
	8,
	3,
	13,
	2,
	12,
	6,
	10,
	0,
	11,
	8,
	3,
	4,
	13,
	7,
	5,
	15,
	14,
	1,
	9
]), F$1 = Uint32Array.from([
	4089235720,
	1779033703,
	2227873595,
	3144134277,
	4271175723,
	1013904242,
	1595750129,
	2773480762,
	2917565137,
	1359893119,
	725511199,
	2600822924,
	4215389547,
	528734635,
	327033209,
	1541459225
]), N$2 = new Uint32Array(32);
function $t$1(t, e, n, r, o, s) {
	const i = o[s], f = o[s + 1];
	let a = N$2[2 * t], l = N$2[2 * t + 1], c = N$2[2 * e], u = N$2[2 * e + 1], h = N$2[2 * n], g = N$2[2 * n + 1], w = N$2[2 * r], y = N$2[2 * r + 1], x = tn(a, c, i);
	l = en$1(x, l, u, f), a = x | 0, {Dh: y, Dl: w} = {
		Dh: y ^ l,
		Dl: w ^ a
	}, {Dh: y, Dl: w} = {
		Dh: bi$1(y, w),
		Dl: yi$1(y)
	}, {h: g, l: h} = dt$1(g, h, y, w), {Bh: u, Bl: c} = {
		Bh: u ^ g,
		Bl: c ^ h
	}, {Bh: u, Bl: c} = {
		Bh: At$1(u, c, 24),
		Bl: St$2(u, c, 24)
	}, N$2[2 * t] = a, N$2[2 * t + 1] = l, N$2[2 * e] = c, N$2[2 * e + 1] = u, N$2[2 * n] = h, N$2[2 * n + 1] = g, N$2[2 * r] = w, N$2[2 * r + 1] = y;
}
function Ct$1(t, e, n, r, o, s) {
	const i = o[s], f = o[s + 1];
	let a = N$2[2 * t], l = N$2[2 * t + 1], c = N$2[2 * e], u = N$2[2 * e + 1], h = N$2[2 * n], g = N$2[2 * n + 1], w = N$2[2 * r], y = N$2[2 * r + 1], x = tn(a, c, i);
	l = en$1(x, l, u, f), a = x | 0, {Dh: y, Dl: w} = {
		Dh: y ^ l,
		Dl: w ^ a
	}, {Dh: y, Dl: w} = {
		Dh: At$1(y, w, 16),
		Dl: St$2(y, w, 16)
	}, {h: g, l: h} = dt$1(g, h, y, w), {Bh: u, Bl: c} = {
		Bh: u ^ g,
		Bl: c ^ h
	}, {Bh: u, Bl: c} = {
		Bh: se$1(u, c, 63),
		Bl: ie$1(u, c, 63)
	}, N$2[2 * t] = a, N$2[2 * t + 1] = l, N$2[2 * e] = c, N$2[2 * e + 1] = u, N$2[2 * n] = h, N$2[2 * n + 1] = g, N$2[2 * r] = w, N$2[2 * r + 1] = y;
}
function Qi(t, e = {}, n, r, o) {
	if (mt$1(n), t < 0 || t > n) throw new Error("outputLen bigger than keyLen");
	const { key: s, salt: i, personalization: f } = e;
	if (s !== void 0 && (s.length < 1 || s.length > n)) throw new Error("key length must be undefined or 1.." + n);
	if (i !== void 0 && i.length !== r) throw new Error("salt must be undefined or " + r);
	if (f !== void 0 && f.length !== o) throw new Error("personalization must be undefined or " + o);
}
var tf = class extends Ie$1 {
	constructor(e, n) {
		super(), this.finished = !1, this.destroyed = !1, this.length = 0, this.pos = 0, mt$1(e), mt$1(n), this.blockLen = e, this.outputLen = n, this.buffer = new Uint8Array(e), this.buffer32 = fe$1(this.buffer);
	}
	update(e) {
		Nt$1(this), e = ht$1(e), at(e);
		const { blockLen: n, buffer: r, buffer32: o } = this, s = e.length, i = e.byteOffset, f = e.buffer;
		for (let a = 0; a < s;) {
			this.pos === n && (Ot$1(o), this.compress(o, 0, !1), Ot$1(o), this.pos = 0);
			const l = Math.min(n - this.pos, s - a), c = i + a;
			if (l === n && !(c % 4) && a + l < s) {
				const u = new Uint32Array(f, c, Math.floor((s - a) / 4));
				Ot$1(u);
				for (let h = 0; a + n < s; h += o.length, a += n) this.length += n, this.compress(u, h, !1);
				Ot$1(u);
				continue;
			}
			r.set(e.subarray(a, a + l), this.pos), this.pos += l, this.length += l, a += l;
		}
		return this;
	}
	digestInto(e) {
		Nt$1(this), on$1(e, this);
		const { pos: n, buffer32: r } = this;
		this.finished = !0, ut$1(this.buffer.subarray(n)), Ot$1(r), this.compress(r, 0, !0), Ot$1(r);
		const o = fe$1(e);
		this.get().forEach((s, i) => o[i] = wt$1(s));
	}
	digest() {
		const { buffer: e, outputLen: n } = this;
		this.digestInto(e);
		const r = e.slice(0, n);
		return this.destroy(), r;
	}
	_cloneInto(e) {
		const { buffer: n, length: r, finished: o, destroyed: s, outputLen: i, pos: f } = this;
		return e || (e = new this.constructor({ dkLen: i })), e.set(...this.get()), e.buffer.set(n), e.destroyed = s, e.finished = o, e.length = r, e.pos = f, e.outputLen = i, e;
	}
	clone() {
		return this._cloneInto();
	}
};
var ef = class extends tf {
	constructor(e = {}) {
		const n = e.dkLen === void 0 ? 64 : e.dkLen;
		super(128, n), this.v0l = F$1[0] | 0, this.v0h = F$1[1] | 0, this.v1l = F$1[2] | 0, this.v1h = F$1[3] | 0, this.v2l = F$1[4] | 0, this.v2h = F$1[5] | 0, this.v3l = F$1[6] | 0, this.v3h = F$1[7] | 0, this.v4l = F$1[8] | 0, this.v4h = F$1[9] | 0, this.v5l = F$1[10] | 0, this.v5h = F$1[11] | 0, this.v6l = F$1[12] | 0, this.v6h = F$1[13] | 0, this.v7l = F$1[14] | 0, this.v7h = F$1[15] | 0, Qi(n, e, 64, 16, 16);
		let { key: r, personalization: o, salt: s } = e, i = 0;
		if (r !== void 0 && (r = ht$1(r), i = r.length), this.v0l ^= this.outputLen | i << 8 | 16842752, s !== void 0) {
			s = ht$1(s);
			const f = fe$1(s);
			this.v4l ^= wt$1(f[0]), this.v4h ^= wt$1(f[1]), this.v5l ^= wt$1(f[2]), this.v5h ^= wt$1(f[3]);
		}
		if (o !== void 0) {
			o = ht$1(o);
			const f = fe$1(o);
			this.v6l ^= wt$1(f[0]), this.v6h ^= wt$1(f[1]), this.v7l ^= wt$1(f[2]), this.v7h ^= wt$1(f[3]);
		}
		if (r !== void 0) {
			const f = new Uint8Array(this.blockLen);
			f.set(r), this.update(f);
		}
	}
	get() {
		let { v0l: e, v0h: n, v1l: r, v1h: o, v2l: s, v2h: i, v3l: f, v3h: a, v4l: l, v4h: c, v5l: u, v5h: h, v6l: g, v6h: w, v7l: y, v7h: x } = this;
		return [
			e,
			n,
			r,
			o,
			s,
			i,
			f,
			a,
			l,
			c,
			u,
			h,
			g,
			w,
			y,
			x
		];
	}
	set(e, n, r, o, s, i, f, a, l, c, u, h, g, w, y, x) {
		this.v0l = e | 0, this.v0h = n | 0, this.v1l = r | 0, this.v1h = o | 0, this.v2l = s | 0, this.v2h = i | 0, this.v3l = f | 0, this.v3h = a | 0, this.v4l = l | 0, this.v4h = c | 0, this.v5l = u | 0, this.v5h = h | 0, this.v6l = g | 0, this.v6h = w | 0, this.v7l = y | 0, this.v7h = x | 0;
	}
	compress(e, n, r) {
		this.get().forEach((a, l) => N$2[l] = a), N$2.set(F$1, 16);
		let { h: o, l: s } = mr$1(BigInt(this.length));
		N$2[24] = F$1[8] ^ s, N$2[25] = F$1[9] ^ o, r && (N$2[28] = ~N$2[28], N$2[29] = ~N$2[29]);
		let i = 0;
		const f = Ji$1;
		for (let a = 0; a < 12; a++) $t$1(0, 4, 8, 12, e, n + 2 * f[i++]), Ct$1(0, 4, 8, 12, e, n + 2 * f[i++]), $t$1(1, 5, 9, 13, e, n + 2 * f[i++]), Ct$1(1, 5, 9, 13, e, n + 2 * f[i++]), $t$1(2, 6, 10, 14, e, n + 2 * f[i++]), Ct$1(2, 6, 10, 14, e, n + 2 * f[i++]), $t$1(3, 7, 11, 15, e, n + 2 * f[i++]), Ct$1(3, 7, 11, 15, e, n + 2 * f[i++]), $t$1(0, 5, 10, 15, e, n + 2 * f[i++]), Ct$1(0, 5, 10, 15, e, n + 2 * f[i++]), $t$1(1, 6, 11, 12, e, n + 2 * f[i++]), Ct$1(1, 6, 11, 12, e, n + 2 * f[i++]), $t$1(2, 7, 8, 13, e, n + 2 * f[i++]), Ct$1(2, 7, 8, 13, e, n + 2 * f[i++]), $t$1(3, 4, 9, 14, e, n + 2 * f[i++]), Ct$1(3, 4, 9, 14, e, n + 2 * f[i++]);
		this.v0l ^= N$2[0] ^ N$2[16], this.v0h ^= N$2[1] ^ N$2[17], this.v1l ^= N$2[2] ^ N$2[18], this.v1h ^= N$2[3] ^ N$2[19], this.v2l ^= N$2[4] ^ N$2[20], this.v2h ^= N$2[5] ^ N$2[21], this.v3l ^= N$2[6] ^ N$2[22], this.v3h ^= N$2[7] ^ N$2[23], this.v4l ^= N$2[8] ^ N$2[24], this.v4h ^= N$2[9] ^ N$2[25], this.v5l ^= N$2[10] ^ N$2[26], this.v5h ^= N$2[11] ^ N$2[27], this.v6l ^= N$2[12] ^ N$2[28], this.v6h ^= N$2[13] ^ N$2[29], this.v7l ^= N$2[14] ^ N$2[30], this.v7h ^= N$2[15] ^ N$2[31], ut$1(N$2);
	}
	destroy() {
		this.destroyed = !0, ut$1(this.buffer32), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
var nf = Ui$1((t) => new ef(t)), rf = "https://rpc.walletconnect.org/v1";
function an$1(t) {
	const e = `Ethereum Signed Message:
${t.length}`, n = new TextEncoder().encode(e + t);
	return "0x" + Buffer.from(Hi(n)).toString("hex");
}
async function Cr$1(t, e, n, r, o, s) {
	switch (n.t) {
		case "eip191": return await Lr$1(t, e, n.s);
		case "eip1271": return await jr$1(t, e, n.s, r, o, s);
		default: throw new Error(`verifySignature failed: Attempted to verify CacaoSignature with unknown type: ${n.t}`);
	}
}
async function Lr$1(t, e, n) {
	return (await recoverAddress({
		hash: an$1(e),
		signature: n
	})).toLowerCase() === t.toLowerCase();
}
async function jr$1(t, e, n, r, o, s) {
	const i = Fe$1(r);
	if (!i.namespace || !i.reference) throw new Error(`isValidEip1271Signature failed: chainId must be in CAIP-2 format, received: ${r}`);
	try {
		const f = "0x1626ba7e", a = "0000000000000000000000000000000000000000000000000000000000000040", l = n.substring(2), c = (l.length / 2).toString(16).padStart(64, "0"), h = f + (e.startsWith("0x") ? e : an$1(e)).substring(2) + a + c + l, { result: w } = await (await fetch(`${s || rf}/?chainId=${r}&projectId=${o}`, {
			headers: { "Content-Type": "application/json" },
			method: "POST",
			body: JSON.stringify({
				id: of(),
				jsonrpc: "2.0",
				method: "eth_call",
				params: [{
					to: t,
					data: h
				}, "latest"]
			})
		})).json();
		return w ? w.slice(0, 10).toLowerCase() === f.toLowerCase() : !1;
	} catch (f) {
		return console.error("isValidEip1271Signature: ", f), !1;
	}
}
function of() {
	return Date.now() + Math.floor(Math.random() * 1e3);
}
function sf(t) {
	const e = atob(t), n = new Uint8Array(e.length);
	for (let i = 0; i < e.length; i++) n[i] = e.charCodeAt(i);
	const r = n[0];
	if (r === 0) throw new Error("No signatures found");
	const o = 1 + r * 64;
	if (n.length < o) throw new Error("Transaction data too short for claimed signature count");
	if (n.length < 100) throw new Error("Transaction too short");
	const s = Buffer.from(t, "base64").slice(1, 65);
	return esm_default.encode(s);
}
function ff(t) {
	const e = new Uint8Array(Buffer.from(t, "base64")), n = Array.from("TransactionData::").map((s) => s.charCodeAt(0)), r = new Uint8Array(n.length + e.length);
	r.set(n), r.set(e, n.length);
	const o = nf(r, { dkLen: 32 });
	return esm_default.encode(o);
}
function cf(t) {
	const e = new Uint8Array(Ae(kr$1(t)));
	return esm_default.encode(e);
}
function kr$1(t) {
	if (t instanceof Uint8Array) return t;
	if (Array.isArray(t)) return new Uint8Array(t);
	if (typeof t == "object" && t != null && t.data) return new Uint8Array(Object.values(t.data));
	if (typeof t == "object" && t) return new Uint8Array(Object.values(t));
	throw new Error("getNearUint8ArrayFromBytes: Unexpected result type from bytes array");
}
function af(t) {
	const n = decode$3(Buffer.from(t, "base64")).txn;
	if (!n) throw new Error("Invalid signed transaction: missing 'txn' field");
	const r = encode$4(n), o = Buffer.from("TX"), i = Xi(Buffer.concat([o, Buffer.from(r)]));
	return base32$1.encode(i).replace(/=+$/, "");
}
function un$1(t) {
	const e = [];
	let n = BigInt(t);
	for (; n >= BigInt(128);) e.push(Number(n & BigInt(127) | BigInt(128))), n >>= BigInt(7);
	return e.push(Number(n)), Buffer.from(e);
}
function uf(t) {
	const e = Buffer.from(t.signed.bodyBytes, "base64"), n = Buffer.from(t.signed.authInfoBytes, "base64"), r = Buffer.from(t.signature.signature, "base64"), o = [];
	o.push(Buffer.from([10])), o.push(un$1(e.length)), o.push(e), o.push(Buffer.from([18])), o.push(un$1(n.length)), o.push(n), o.push(Buffer.from([26])), o.push(un$1(r.length)), o.push(r);
	const i = Ae(Buffer.concat(o));
	return Buffer.from(i).toString("hex").toUpperCase();
}
var lf = Object.defineProperty, df = Object.defineProperties, hf = Object.getOwnPropertyDescriptors, Pr$1 = Object.getOwnPropertySymbols, pf = Object.prototype.hasOwnProperty, gf = Object.prototype.propertyIsEnumerable, Hr$1 = (t, e, n) => e in t ? lf(t, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : t[e] = n, ln$1 = (t, e) => {
	for (var n in e || (e = {})) pf.call(e, n) && Hr$1(t, n, e[n]);
	if (Pr$1) for (var n of Pr$1(e)) gf.call(e, n) && Hr$1(t, n, e[n]);
	return t;
}, Dr$1 = (t, e) => df(t, hf(e));
var bf = "did:pkh:", Se$1 = (t) => t?.split(":"), Mr$1 = (t) => {
	const e = t && Se$1(t);
	if (e) return t.includes(bf) ? e[3] : e[1];
}, Vr$1 = (t) => {
	const e = t && Se$1(t);
	if (e) return e[2] + ":" + e[3];
}, dn$1 = (t) => {
	const e = t && Se$1(t);
	if (e) return e.pop();
};
async function yf(t) {
	const { cacao: e, projectId: n } = t, { s: r, p: o } = e, s = qr$1(o, o.iss);
	return await Cr$1(dn$1(o.iss), s, r, Vr$1(o.iss), n);
}
var qr$1 = (t, e) => {
	const n = `${t.domain} wants you to sign in with your Ethereum account:`, r = dn$1(e);
	if (!t.aud && !t.uri) throw new Error("Either `aud` or `uri` is required to construct the message");
	let o = t.statement || void 0;
	const s = `URI: ${t.aud || t.uri}`, i = `Version: ${t.version}`, f = `Chain ID: ${Mr$1(e)}`, a = `Nonce: ${t.nonce}`, l = `Issued At: ${t.iat}`, c = t.exp ? `Expiration Time: ${t.exp}` : void 0, u = t.nbf ? `Not Before: ${t.nbf}` : void 0, h = t.requestId ? `Request ID: ${t.requestId}` : void 0, g = t.resources ? `Resources:${t.resources.map((y) => `
- ${y}`).join("")}` : void 0, w = Oe(t.resources);
	if (w) {
		const y = Lt$1(w);
		o = gn$1(o, y);
	}
	return [
		n,
		r,
		"",
		o,
		"",
		s,
		i,
		f,
		a,
		l,
		c,
		u,
		h,
		g
	].filter((y) => y != null).join(`
`);
};
function Gr$1(t) {
	return Buffer.from(JSON.stringify(t)).toString("base64");
}
function Zr$1(t) {
	return JSON.parse(Buffer.from(t, "base64").toString("utf-8"));
}
function bt(t) {
	if (!t) throw new Error("No recap provided, value is undefined");
	if (!t.att) throw new Error("No `att` property found");
	const e = Object.keys(t.att);
	if (!(e != null && e.length)) throw new Error("No resources found in `att` property");
	e.forEach((n) => {
		const r = t.att[n];
		if (Array.isArray(r)) throw new Error(`Resource must be an object: ${n}`);
		if (typeof r != "object") throw new Error(`Resource must be an object: ${n}`);
		if (!Object.keys(r).length) throw new Error(`Resource object is empty: ${n}`);
		Object.keys(r).forEach((o) => {
			const s = r[o];
			if (!Array.isArray(s)) throw new Error(`Ability limits ${o} must be an array of objects, found: ${s}`);
			if (!s.length) throw new Error(`Value of ${o} is empty array, must be an array with objects`);
			s.forEach((i) => {
				if (typeof i != "object") throw new Error(`Ability limits (${o}) must be an array of objects, found: ${i}`);
			});
		});
	});
}
function Wr$1(t, e, n, r = {}) {
	return n?.sort((o, s) => o.localeCompare(s)), { att: { [t]: hn$1(e, n, r) } };
}
function hn$1(t, e, n = {}) {
	e = e?.sort((o, s) => o.localeCompare(s));
	const r = e.map((o) => ({ [`${t}/${o}`]: [n] }));
	return Object.assign({}, ...r);
}
function Ne(t) {
	return bt(t), `urn:recap:${Gr$1(t).replace(/=/g, "")}`;
}
function Lt$1(t) {
	const e = Zr$1(t.replace("urn:recap:", ""));
	return bt(e), e;
}
function Ef(t, e, n) {
	return Ne(Wr$1(t, e, n));
}
function pn$1(t) {
	return t && t.includes("urn:recap:");
}
function Bf(t, e) {
	return Ne(Xr$1(Lt$1(t), Lt$1(e)));
}
function Xr$1(t, e) {
	bt(t), bt(e);
	const n = Object.keys(t.att).concat(Object.keys(e.att)).sort((o, s) => o.localeCompare(s)), r = { att: {} };
	return n.forEach((o) => {
		var s, i;
		Object.keys(((s = t.att) == null ? void 0 : s[o]) || {}).concat(Object.keys(((i = e.att) == null ? void 0 : i[o]) || {})).sort((f, a) => f.localeCompare(a)).forEach((f) => {
			var a, l;
			r.att[o] = Dr$1(ln$1({}, r.att[o]), { [f]: ((a = t.att[o]) == null ? void 0 : a[f]) || ((l = e.att[o]) == null ? void 0 : l[f]) });
		});
	}), r;
}
function gn$1(t = "", e) {
	bt(e);
	const n = "I further authorize the stated URI to perform the following actions on my behalf: ";
	if (t.includes(n)) return t;
	const r = [];
	let o = 0;
	Object.keys(e.att).forEach((f) => {
		const a = Object.keys(e.att[f]).map((u) => ({
			ability: u.split("/")[0],
			action: u.split("/")[1]
		}));
		a.sort((u, h) => u.action.localeCompare(h.action));
		const l = {};
		a.forEach((u) => {
			l[u.ability] || (l[u.ability] = []), l[u.ability].push(u.action);
		});
		const c = Object.keys(l).map((u) => (o++, `(${o}) '${u}': '${l[u].join("', '")}' for '${f}'.`));
		r.push(c.join(", ").replace(".,", "."));
	});
	const i = `${n}${r.join(" ")}`;
	return `${t ? t + " " : ""}${i}`;
}
function If(t) {
	var e;
	const n = Lt$1(t);
	bt(n);
	const r = (e = n.att) == null ? void 0 : e.eip155;
	return r ? Object.keys(r).map((o) => o.split("/")[1]) : [];
}
function Af(t) {
	const e = Lt$1(t);
	bt(e);
	const n = [];
	return Object.values(e.att).forEach((r) => {
		Object.values(r).forEach((o) => {
			var s;
			(s = o?.[0]) != null && s.chains && n.push(o[0].chains);
		});
	}), [...new Set(n.flat())];
}
function Oe(t) {
	if (!t) return;
	const e = t?.[t.length - 1];
	return pn$1(e) ? e : void 0;
}
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */ function Qr$1(t) {
	return t instanceof Uint8Array || ArrayBuffer.isView(t) && t.constructor.name === "Uint8Array";
}
function bn$1(t) {
	if (typeof t != "boolean") throw new Error(`boolean expected, not ${t}`);
}
function yn$1(t) {
	if (!Number.isSafeInteger(t) || t < 0) throw new Error("positive integer expected, got " + t);
}
function nt(t, ...e) {
	if (!Qr$1(t)) throw new Error("Uint8Array expected");
	if (e.length > 0 && !e.includes(t.length)) throw new Error("Uint8Array expected of length " + e + ", got length=" + t.length);
}
function to$1(t, e = !0) {
	if (t.destroyed) throw new Error("Hash instance has been destroyed");
	if (e && t.finished) throw new Error("Hash#digest() has already been called");
}
function Sf(t, e) {
	nt(t);
	const n = e.outputLen;
	if (t.length < n) throw new Error("digestInto() expects output buffer of length at least " + n);
}
function jt$1(t) {
	return new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4));
}
function Wt$1(...t) {
	for (let e = 0; e < t.length; e++) t[e].fill(0);
}
function Nf(t) {
	return new DataView(t.buffer, t.byteOffset, t.byteLength);
}
var Of = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
function Uf(t) {
	if (typeof t != "string") throw new Error("string expected");
	return new Uint8Array(new TextEncoder().encode(t));
}
function mn(t) {
	if (typeof t == "string") t = Uf(t);
	else if (Qr$1(t)) t = wn$1(t);
	else throw new Error("Uint8Array expected, got " + typeof t);
	return t;
}
function _f(t, e) {
	if (e == null || typeof e != "object") throw new Error("options must be defined");
	return Object.assign(t, e);
}
function Tf(t, e) {
	if (t.length !== e.length) return !1;
	let n = 0;
	for (let r = 0; r < t.length; r++) n |= t[r] ^ e[r];
	return n === 0;
}
var Rf = (t, e) => {
	function n(r, ...o) {
		if (nt(r), !Of) throw new Error("Non little-endian hardware is not yet supported");
		if (t.nonceLength !== void 0) {
			const c = o[0];
			if (!c) throw new Error("nonce / iv required");
			t.varSizeNonce ? nt(c) : nt(c, t.nonceLength);
		}
		const s = t.tagLength;
		s && o[1] !== void 0 && nt(o[1]);
		const i = e(r, ...o), f = (c, u) => {
			if (u !== void 0) {
				if (c !== 2) throw new Error("cipher output not supported");
				nt(u);
			}
		};
		let a = !1;
		return {
			encrypt(c, u) {
				if (a) throw new Error("cannot encrypt() twice with same key + nonce");
				return a = !0, nt(c), f(i.encrypt.length, u), i.encrypt(c, u);
			},
			decrypt(c, u) {
				if (nt(c), s && c.length < s) throw new Error("invalid ciphertext length: smaller than tagLength=" + s);
				return f(i.decrypt.length, u), i.decrypt(c, u);
			}
		};
	}
	return Object.assign(n, t), n;
};
function eo$1(t, e, n = !0) {
	if (e === void 0) return new Uint8Array(t);
	if (e.length !== t) throw new Error("invalid output length, expected " + t + ", got: " + e.length);
	if (n && !Cf(e)) throw new Error("invalid output, must be aligned");
	return e;
}
function no$1(t, e, n, r) {
	if (typeof t.setBigUint64 == "function") return t.setBigUint64(e, n, r);
	const o = BigInt(32), s = BigInt(4294967295), i = Number(n >> o & s), f = Number(n & s), a = r ? 4 : 0, l = r ? 0 : 4;
	t.setUint32(e + a, i, r), t.setUint32(e + l, f, r);
}
function $f(t, e, n) {
	bn$1(n);
	const r = new Uint8Array(16), o = Nf(r);
	return no$1(o, 0, BigInt(e), n), no$1(o, 8, BigInt(t), n), r;
}
function Cf(t) {
	return t.byteOffset % 4 === 0;
}
function wn$1(t) {
	return Uint8Array.from(t);
}
var ro$1 = (t) => Uint8Array.from(t.split("").map((e) => e.charCodeAt(0))), Lf = ro$1("expand 16-byte k"), jf = ro$1("expand 32-byte k"), kf = jt$1(Lf), Pf = jt$1(jf);
function D$1(t, e) {
	return t << e | t >>> 32 - e;
}
function xn$1(t) {
	return t.byteOffset % 4 === 0;
}
var Ue$1 = 64, Hf = 16, oo$1 = 2 ** 32 - 1, so$1 = new Uint32Array();
function Df(t, e, n, r, o, s, i, f) {
	const a = o.length, l = new Uint8Array(Ue$1), c = jt$1(l), u = xn$1(o) && xn$1(s), h = u ? jt$1(o) : so$1, g = u ? jt$1(s) : so$1;
	for (let w = 0; w < a; i++) {
		if (t(e, n, r, c, i, f), i >= oo$1) throw new Error("arx: counter overflow");
		const y = Math.min(Ue$1, a - w);
		if (u && y === Ue$1) {
			const x = w / 4;
			if (w % 4 !== 0) throw new Error("arx: invalid block position");
			for (let R = 0, M; R < Hf; R++) M = x + R, g[M] = h[M] ^ c[R];
			w += Ue$1;
			continue;
		}
		for (let x = 0, R; x < y; x++) R = w + x, s[R] = o[R] ^ l[x];
		w += y;
	}
}
function Mf(t, e) {
	const { allowShortKeys: n, extendNonceFn: r, counterLength: o, counterRight: s, rounds: i } = _f({
		allowShortKeys: !1,
		counterLength: 8,
		counterRight: !1,
		rounds: 20
	}, e);
	if (typeof t != "function") throw new Error("core must be a function");
	return yn$1(o), yn$1(i), bn$1(s), bn$1(n), (f, a, l, c, u = 0) => {
		nt(f), nt(a), nt(l);
		const h = l.length;
		if (c === void 0 && (c = new Uint8Array(h)), nt(c), yn$1(u), u < 0 || u >= oo$1) throw new Error("arx: counter overflow");
		if (c.length < h) throw new Error(`arx: output (${c.length}) is shorter than data (${h})`);
		const g = [];
		let w = f.length, y, x;
		if (w === 32) g.push(y = wn$1(f)), x = Pf;
		else if (w === 16 && n) y = new Uint8Array(32), y.set(f), y.set(f, 16), x = kf, g.push(y);
		else throw new Error(`arx: invalid 32-byte key, got length=${w}`);
		xn$1(a) || g.push(a = wn$1(a));
		const R = jt$1(y);
		if (r) {
			if (a.length !== 24) throw new Error("arx: extended nonce must be 24 bytes");
			r(x, R, jt$1(a.subarray(0, 16)), R), a = a.subarray(16);
		}
		const M = 16 - o;
		if (M !== a.length) throw new Error(`arx: nonce must be ${M} or 16 bytes`);
		if (M !== 12) {
			const V = new Uint8Array(12);
			V.set(a, s ? 0 : 12 - a.length), a = V, g.push(a);
		}
		const L = jt$1(a);
		return Df(t, x, R, L, l, c, u, i), Wt$1(...g), c;
	};
}
var G$1 = (t, e) => t[e++] & 255 | (t[e++] & 255) << 8;
var Vf = class {
	constructor(e) {
		this.blockLen = 16, this.outputLen = 16, this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.pos = 0, this.finished = !1, e = mn(e), nt(e, 32);
		const n = G$1(e, 0), r = G$1(e, 2), o = G$1(e, 4), s = G$1(e, 6), i = G$1(e, 8), f = G$1(e, 10), a = G$1(e, 12), l = G$1(e, 14);
		this.r[0] = n & 8191, this.r[1] = (n >>> 13 | r << 3) & 8191, this.r[2] = (r >>> 10 | o << 6) & 7939, this.r[3] = (o >>> 7 | s << 9) & 8191, this.r[4] = (s >>> 4 | i << 12) & 255, this.r[5] = i >>> 1 & 8190, this.r[6] = (i >>> 14 | f << 2) & 8191, this.r[7] = (f >>> 11 | a << 5) & 8065, this.r[8] = (a >>> 8 | l << 8) & 8191, this.r[9] = l >>> 5 & 127;
		for (let c = 0; c < 8; c++) this.pad[c] = G$1(e, 16 + 2 * c);
	}
	process(e, n, r = !1) {
		const o = r ? 0 : 2048, { h: s, r: i } = this, f = i[0], a = i[1], l = i[2], c = i[3], u = i[4], h = i[5], g = i[6], w = i[7], y = i[8], x = i[9], R = G$1(e, n + 0), M = G$1(e, n + 2), L = G$1(e, n + 4), V = G$1(e, n + 6), _ = G$1(e, n + 8), k = G$1(e, n + 10), j = G$1(e, n + 12), $ = G$1(e, n + 14);
		let d = s[0] + (R & 8191), m = s[1] + ((R >>> 13 | M << 3) & 8191), p = s[2] + ((M >>> 10 | L << 6) & 8191), b = s[3] + ((L >>> 7 | V << 9) & 8191), v = s[4] + ((V >>> 4 | _ << 12) & 8191), B = s[5] + (_ >>> 1 & 8191), E = s[6] + ((_ >>> 14 | k << 2) & 8191), I = s[7] + ((k >>> 11 | j << 5) & 8191), S = s[8] + ((j >>> 8 | $ << 8) & 8191), O = s[9] + ($ >>> 5 | o), A = 0, T = A + d * f + m * (5 * x) + p * (5 * y) + b * (5 * w) + v * (5 * g);
		A = T >>> 13, T &= 8191, T += B * (5 * h) + E * (5 * u) + I * (5 * c) + S * (5 * l) + O * (5 * a), A += T >>> 13, T &= 8191;
		let U = A + d * a + m * f + p * (5 * x) + b * (5 * y) + v * (5 * w);
		A = U >>> 13, U &= 8191, U += B * (5 * g) + E * (5 * h) + I * (5 * u) + S * (5 * c) + O * (5 * l), A += U >>> 13, U &= 8191;
		let C = A + d * l + m * a + p * f + b * (5 * x) + v * (5 * y);
		A = C >>> 13, C &= 8191, C += B * (5 * w) + E * (5 * g) + I * (5 * h) + S * (5 * u) + O * (5 * c), A += C >>> 13, C &= 8191;
		let H = A + d * c + m * l + p * a + b * f + v * (5 * x);
		A = H >>> 13, H &= 8191, H += B * (5 * y) + E * (5 * w) + I * (5 * g) + S * (5 * h) + O * (5 * u), A += H >>> 13, H &= 8191;
		let q = A + d * u + m * c + p * l + b * a + v * f;
		A = q >>> 13, q &= 8191, q += B * (5 * x) + E * (5 * y) + I * (5 * w) + S * (5 * g) + O * (5 * h), A += q >>> 13, q &= 8191;
		let P = A + d * h + m * u + p * c + b * l + v * a;
		A = P >>> 13, P &= 8191, P += B * f + E * (5 * x) + I * (5 * y) + S * (5 * w) + O * (5 * g), A += P >>> 13, P &= 8191;
		let K = A + d * g + m * h + p * u + b * c + v * l;
		A = K >>> 13, K &= 8191, K += B * a + E * f + I * (5 * x) + S * (5 * y) + O * (5 * w), A += K >>> 13, K &= 8191;
		let et = A + d * w + m * g + p * h + b * u + v * c;
		A = et >>> 13, et &= 8191, et += B * l + E * a + I * f + S * (5 * x) + O * (5 * y), A += et >>> 13, et &= 8191;
		let Z = A + d * y + m * w + p * g + b * h + v * u;
		A = Z >>> 13, Z &= 8191, Z += B * c + E * l + I * a + S * f + O * (5 * x), A += Z >>> 13, Z &= 8191;
		let z = A + d * x + m * y + p * w + b * g + v * h;
		A = z >>> 13, z &= 8191, z += B * u + E * c + I * l + S * a + O * f, A += z >>> 13, z &= 8191, A = (A << 2) + A | 0, A = A + T | 0, T = A & 8191, A = A >>> 13, U += A, s[0] = T, s[1] = U, s[2] = C, s[3] = H, s[4] = q, s[5] = P, s[6] = K, s[7] = et, s[8] = Z, s[9] = z;
	}
	finalize() {
		const { h: e, pad: n } = this, r = new Uint16Array(10);
		let o = e[1] >>> 13;
		e[1] &= 8191;
		for (let f = 2; f < 10; f++) e[f] += o, o = e[f] >>> 13, e[f] &= 8191;
		e[0] += o * 5, o = e[0] >>> 13, e[0] &= 8191, e[1] += o, o = e[1] >>> 13, e[1] &= 8191, e[2] += o, r[0] = e[0] + 5, o = r[0] >>> 13, r[0] &= 8191;
		for (let f = 1; f < 10; f++) r[f] = e[f] + o, o = r[f] >>> 13, r[f] &= 8191;
		r[9] -= 8192;
		let s = (o ^ 1) - 1;
		for (let f = 0; f < 10; f++) r[f] &= s;
		s = ~s;
		for (let f = 0; f < 10; f++) e[f] = e[f] & s | r[f];
		e[0] = (e[0] | e[1] << 13) & 65535, e[1] = (e[1] >>> 3 | e[2] << 10) & 65535, e[2] = (e[2] >>> 6 | e[3] << 7) & 65535, e[3] = (e[3] >>> 9 | e[4] << 4) & 65535, e[4] = (e[4] >>> 12 | e[5] << 1 | e[6] << 14) & 65535, e[5] = (e[6] >>> 2 | e[7] << 11) & 65535, e[6] = (e[7] >>> 5 | e[8] << 8) & 65535, e[7] = (e[8] >>> 8 | e[9] << 5) & 65535;
		let i = e[0] + n[0];
		e[0] = i & 65535;
		for (let f = 1; f < 8; f++) i = (e[f] + n[f] | 0) + (i >>> 16) | 0, e[f] = i & 65535;
		Wt$1(r);
	}
	update(e) {
		to$1(this), e = mn(e), nt(e);
		const { buffer: n, blockLen: r } = this, o = e.length;
		for (let s = 0; s < o;) {
			const i = Math.min(r - this.pos, o - s);
			if (i === r) {
				for (; r <= o - s; s += r) this.process(e, s);
				continue;
			}
			n.set(e.subarray(s, s + i), this.pos), this.pos += i, s += i, this.pos === r && (this.process(n, 0, !1), this.pos = 0);
		}
		return this;
	}
	destroy() {
		Wt$1(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(e) {
		to$1(this), Sf(e, this), this.finished = !0;
		const { buffer: n, h: r } = this;
		let { pos: o } = this;
		if (o) {
			for (n[o++] = 1; o < 16; o++) n[o] = 0;
			this.process(n, 0, !0);
		}
		this.finalize();
		let s = 0;
		for (let i = 0; i < 8; i++) e[s++] = r[i] >>> 0, e[s++] = r[i] >>> 8;
		return e;
	}
	digest() {
		const { buffer: e, outputLen: n } = this;
		this.digestInto(e);
		const r = e.slice(0, n);
		return this.destroy(), r;
	}
};
function qf(t) {
	const e = (r, o) => t(o).update(mn(r)).digest(), n = t(new Uint8Array(32));
	return e.outputLen = n.outputLen, e.blockLen = n.blockLen, e.create = (r) => t(r), e;
}
var Kf = qf((t) => new Vf(t));
function Ff(t, e, n, r, o, s = 20) {
	let i = t[0], f = t[1], a = t[2], l = t[3], c = e[0], u = e[1], h = e[2], g = e[3], w = e[4], y = e[5], x = e[6], R = e[7], M = o, L = n[0], V = n[1], _ = n[2], k = i, j = f, $ = a, d = l, m = c, p = u, b = h, v = g, B = w, E = y, I = x, S = R, O = M, A = L, T = V, U = _;
	for (let H = 0; H < s; H += 2) k = k + m | 0, O = D$1(O ^ k, 16), B = B + O | 0, m = D$1(m ^ B, 12), k = k + m | 0, O = D$1(O ^ k, 8), B = B + O | 0, m = D$1(m ^ B, 7), j = j + p | 0, A = D$1(A ^ j, 16), E = E + A | 0, p = D$1(p ^ E, 12), j = j + p | 0, A = D$1(A ^ j, 8), E = E + A | 0, p = D$1(p ^ E, 7), $ = $ + b | 0, T = D$1(T ^ $, 16), I = I + T | 0, b = D$1(b ^ I, 12), $ = $ + b | 0, T = D$1(T ^ $, 8), I = I + T | 0, b = D$1(b ^ I, 7), d = d + v | 0, U = D$1(U ^ d, 16), S = S + U | 0, v = D$1(v ^ S, 12), d = d + v | 0, U = D$1(U ^ d, 8), S = S + U | 0, v = D$1(v ^ S, 7), k = k + p | 0, U = D$1(U ^ k, 16), I = I + U | 0, p = D$1(p ^ I, 12), k = k + p | 0, U = D$1(U ^ k, 8), I = I + U | 0, p = D$1(p ^ I, 7), j = j + b | 0, O = D$1(O ^ j, 16), S = S + O | 0, b = D$1(b ^ S, 12), j = j + b | 0, O = D$1(O ^ j, 8), S = S + O | 0, b = D$1(b ^ S, 7), $ = $ + v | 0, A = D$1(A ^ $, 16), B = B + A | 0, v = D$1(v ^ B, 12), $ = $ + v | 0, A = D$1(A ^ $, 8), B = B + A | 0, v = D$1(v ^ B, 7), d = d + m | 0, T = D$1(T ^ d, 16), E = E + T | 0, m = D$1(m ^ E, 12), d = d + m | 0, T = D$1(T ^ d, 8), E = E + T | 0, m = D$1(m ^ E, 7);
	let C = 0;
	r[C++] = i + k | 0, r[C++] = f + j | 0, r[C++] = a + $ | 0, r[C++] = l + d | 0, r[C++] = c + m | 0, r[C++] = u + p | 0, r[C++] = h + b | 0, r[C++] = g + v | 0, r[C++] = w + B | 0, r[C++] = y + E | 0, r[C++] = x + I | 0, r[C++] = R + S | 0, r[C++] = M + O | 0, r[C++] = L + A | 0, r[C++] = V + T | 0, r[C++] = _ + U | 0;
}
var zf = Mf(Ff, {
	counterRight: !1,
	counterLength: 4,
	allowShortKeys: !1
}), Gf = new Uint8Array(16), io$1 = (t, e) => {
	t.update(e);
	const n = e.length % 16;
	n && t.update(Gf.subarray(n));
}, Zf = new Uint8Array(32);
function fo$1(t, e, n, r, o) {
	const s = t(e, n, Zf), i = Kf.create(s);
	o && io$1(i, o), io$1(i, r);
	const f = $f(r.length, o ? o.length : 0, !0);
	i.update(f);
	const a = i.digest();
	return Wt$1(s, f), a;
}
var Wf = (t) => (e, n, r) => ({
	encrypt(s, i) {
		const f = s.length;
		i = eo$1(f + 16, i, !1), i.set(s);
		const a = i.subarray(0, -16);
		t(e, n, a, a, 1);
		const l = fo$1(t, e, n, a, r);
		return i.set(l, f), Wt$1(l), i;
	},
	decrypt(s, i) {
		i = eo$1(s.length - 16, i, !1);
		const f = s.subarray(0, -16), a = s.subarray(-16), l = fo$1(t, e, n, f, r);
		if (!Tf(a, l)) throw new Error("invalid tag");
		return i.set(s.subarray(0, -16)), t(e, n, i, i, 1), Wt$1(l), i;
	}
}), co$1 = Rf({
	blockSize: 64,
	nonceLength: 12,
	tagLength: 16
}, Wf(zf));
var ao$1 = class extends Ie$1 {
	constructor(e, n) {
		super(), this.finished = !1, this.destroyed = !1, rn$1(e);
		const r = ht$1(n);
		if (this.iHash = e.create(), typeof this.iHash.update != "function") throw new Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
		const o = this.blockLen, s = new Uint8Array(o);
		s.set(r.length > o ? e.create().update(r).digest() : r);
		for (let i = 0; i < s.length; i++) s[i] ^= 54;
		this.iHash.update(s), this.oHash = e.create();
		for (let i = 0; i < s.length; i++) s[i] ^= 106;
		this.oHash.update(s), ut$1(s);
	}
	update(e) {
		return Nt$1(this), this.iHash.update(e), this;
	}
	digestInto(e) {
		Nt$1(this), at(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
	}
	digest() {
		const e = new Uint8Array(this.oHash.outputLen);
		return this.digestInto(e), e;
	}
	_cloneInto(e) {
		e || (e = Object.create(Object.getPrototypeOf(this), {}));
		const { oHash: n, iHash: r, finished: o, destroyed: s, blockLen: i, outputLen: f } = this;
		return e = e, e.finished = o, e.destroyed = s, e.blockLen = i, e.outputLen = f, e.oHash = n._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e;
	}
	clone() {
		return this._cloneInto();
	}
	destroy() {
		this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
	}
};
var _e$2 = (t, e, n) => new ao$1(t, e).update(n).digest();
_e$2.create = (t, e) => new ao$1(t, e);
function Yf(t, e, n) {
	return rn$1(t), n === void 0 && (n = new Uint8Array(t.outputLen)), _e$2(t, ht$1(n), ht$1(e));
}
var vn$1 = Uint8Array.from([0]), uo$1 = Uint8Array.of();
function Xf(t, e, n, r = 32) {
	rn$1(t), mt$1(r);
	const o = t.outputLen;
	if (r > 255 * o) throw new Error("Length should be <= 255*HashLen");
	const s = Math.ceil(r / o);
	n === void 0 && (n = uo$1);
	const i = new Uint8Array(s * o), f = _e$2.create(t, e), a = f._cloneInto(), l = new Uint8Array(f.outputLen);
	for (let c = 0; c < s; c++) vn$1[0] = c + 1, a.update(c === 0 ? uo$1 : l).update(n).update(vn$1).digestInto(l), i.set(l, o * c), f._cloneInto(a);
	return f.destroy(), a.destroy(), ut$1(l, vn$1), i.slice(0, r);
}
var Jf = (t, e, n, r, o) => Xf(t, Yf(t, e, n), r, o), Te$1 = Ae, En$1 = BigInt(0), Bn$1 = BigInt(1);
function Re(t, e) {
	if (typeof e != "boolean") throw new Error(t + " boolean expected, got " + e);
}
function $e$1(t) {
	const e = t.toString(16);
	return e.length & 1 ? "0" + e : e;
}
function lo$1(t) {
	if (typeof t != "string") throw new Error("hex string expected, got " + typeof t);
	return t === "" ? En$1 : BigInt("0x" + t);
}
function Ce$2(t) {
	return lo$1(ce$1(t));
}
function Le$2(t) {
	return at(t), lo$1(ce$1(Uint8Array.from(t).reverse()));
}
function In$1(t, e) {
	return fn$1(t.toString(16).padStart(e * 2, "0"));
}
function An$1(t, e) {
	return In$1(t, e).reverse();
}
function rt(t, e, n) {
	let r;
	if (typeof e == "string") try {
		r = fn$1(e);
	} catch (s) {
		throw new Error(t + " must be hex string or Uint8Array, cause: " + s);
	}
	else if (nn$1(e)) r = Uint8Array.from(e);
	else throw new Error(t + " must be hex string or Uint8Array");
	const o = r.length;
	if (typeof n == "number" && o !== n) throw new Error(t + " of length " + n + " expected, got " + o);
	return r;
}
var Sn$1 = (t) => typeof t == "bigint" && En$1 <= t;
function Qf(t, e, n) {
	return Sn$1(t) && Sn$1(e) && Sn$1(n) && e <= t && t < n;
}
function Nn$1(t, e, n, r) {
	if (!Qf(e, n, r)) throw new Error("expected valid " + t + ": " + n + " <= n < " + r + ", got " + e);
}
function tc(t) {
	let e;
	for (e = 0; t > En$1; t >>= Bn$1, e += 1);
	return e;
}
var je$1 = (t) => (Bn$1 << BigInt(t)) - Bn$1;
function ec(t, e, n) {
	if (typeof t != "number" || t < 2) throw new Error("hashLen must be a number");
	if (typeof e != "number" || e < 2) throw new Error("qByteLen must be a number");
	if (typeof n != "function") throw new Error("hmacFn must be a function");
	const r = (g) => new Uint8Array(g), o = (g) => Uint8Array.of(g);
	let s = r(t), i = r(t), f = 0;
	const a = () => {
		s.fill(1), i.fill(0), f = 0;
	}, l = (...g) => n(i, s, ...g), c = (g = r(0)) => {
		i = l(o(0), g), s = l(), g.length !== 0 && (i = l(o(1), g), s = l());
	}, u = () => {
		if (f++ >= 1e3) throw new Error("drbg: tried 1000 values");
		let g = 0;
		const w = [];
		for (; g < e;) {
			s = l();
			const y = s.slice();
			w.push(y), g += s.length;
		}
		return Ht$1(...w);
	};
	return (g, w) => {
		a(), c(g);
		let y;
		for (; !(y = w(u()));) c();
		return a(), y;
	};
}
function ke$2(t, e, n = {}) {
	if (!t || typeof t != "object") throw new Error("expected valid options object");
	function r(o, s, i) {
		const f = t[o];
		if (i && f === void 0) return;
		const a = typeof f;
		if (a !== s || f === null) throw new Error(`param "${o}" is invalid: expected ${s}, got ${a}`);
	}
	Object.entries(e).forEach(([o, s]) => r(o, s, !1)), Object.entries(n).forEach(([o, s]) => r(o, s, !0));
}
function ho$1(t) {
	const e = /* @__PURE__ */ new WeakMap();
	return (n, ...r) => {
		const o = e.get(n);
		if (o !== void 0) return o;
		const s = t(n, ...r);
		return e.set(n, s), s;
	};
}
var ot = BigInt(0), Q$1 = BigInt(1), Dt = BigInt(2), nc = BigInt(3), po$1 = BigInt(4), go$1 = BigInt(5), bo$1 = BigInt(8);
function lt$1(t, e) {
	const n = t % e;
	return n >= ot ? n : e + n;
}
function pt$1(t, e, n) {
	let r = t;
	for (; e-- > ot;) r *= r, r %= n;
	return r;
}
function yo$1(t, e) {
	if (t === ot) throw new Error("invert: expected non-zero number");
	if (e <= ot) throw new Error("invert: expected positive modulus, got " + e);
	let n = lt$1(t, e), r = e, o = ot, s = Q$1;
	for (; n !== ot;) {
		const f = r / n, a = r % n, l = o - s * f;
		r = n, n = a, o = s, s = l;
	}
	if (r !== Q$1) throw new Error("invert: does not exist");
	return lt$1(o, e);
}
function mo$1(t, e) {
	const n = (t.ORDER + Q$1) / po$1, r = t.pow(e, n);
	if (!t.eql(t.sqr(r), e)) throw new Error("Cannot find square root");
	return r;
}
function rc(t, e) {
	const n = (t.ORDER - go$1) / bo$1, r = t.mul(e, Dt), o = t.pow(r, n), s = t.mul(e, o), i = t.mul(t.mul(s, Dt), o), f = t.mul(s, t.sub(i, t.ONE));
	if (!t.eql(t.sqr(f), e)) throw new Error("Cannot find square root");
	return f;
}
function oc(t) {
	if (t < BigInt(3)) throw new Error("sqrt is not defined for small field");
	let e = t - Q$1, n = 0;
	for (; e % Dt === ot;) e /= Dt, n++;
	let r = Dt;
	const o = Yt$1(t);
	for (; xo$1(o, r) === 1;) if (r++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (n === 1) return mo$1;
	let s = o.pow(r, e);
	const i = (e + Q$1) / Dt;
	return function(a, l) {
		if (a.is0(l)) return l;
		if (xo$1(a, l) !== 1) throw new Error("Cannot find square root");
		let c = n, u = a.mul(a.ONE, s), h = a.pow(l, e), g = a.pow(l, i);
		for (; !a.eql(h, a.ONE);) {
			if (a.is0(h)) return a.ZERO;
			let w = 1, y = a.sqr(h);
			for (; !a.eql(y, a.ONE);) if (w++, y = a.sqr(y), w === c) throw new Error("Cannot find square root");
			const x = Q$1 << BigInt(c - w - 1), R = a.pow(u, x);
			c = w, u = a.sqr(R), h = a.mul(h, u), g = a.mul(g, R);
		}
		return g;
	};
}
function sc(t) {
	return t % po$1 === nc ? mo$1 : t % bo$1 === go$1 ? rc : oc(t);
}
var ic = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
function fc(t) {
	return ke$2(t, ic.reduce((r, o) => (r[o] = "function", r), {
		ORDER: "bigint",
		MASK: "bigint",
		BYTES: "number",
		BITS: "number"
	})), t;
}
function cc(t, e, n) {
	if (n < ot) throw new Error("invalid exponent, negatives unsupported");
	if (n === ot) return t.ONE;
	if (n === Q$1) return e;
	let r = t.ONE, o = e;
	for (; n > ot;) n & Q$1 && (r = t.mul(r, o)), o = t.sqr(o), n >>= Q$1;
	return r;
}
function wo$1(t, e, n = !1) {
	const r = new Array(e.length).fill(n ? t.ZERO : void 0), o = e.reduce((i, f, a) => t.is0(f) ? i : (r[a] = i, t.mul(i, f)), t.ONE), s = t.inv(o);
	return e.reduceRight((i, f, a) => t.is0(f) ? i : (r[a] = t.mul(i, r[a]), t.mul(i, f)), s), r;
}
function xo$1(t, e) {
	const n = (t.ORDER - Q$1) / Dt, r = t.pow(e, n), o = t.eql(r, t.ONE), s = t.eql(r, t.ZERO), i = t.eql(r, t.neg(t.ONE));
	if (!o && !s && !i) throw new Error("invalid Legendre symbol result");
	return o ? 1 : s ? 0 : -1;
}
function ac(t, e) {
	e !== void 0 && mt$1(e);
	const n = e !== void 0 ? e : t.toString(2).length;
	return {
		nBitLength: n,
		nByteLength: Math.ceil(n / 8)
	};
}
function Yt$1(t, e, n = !1, r = {}) {
	if (t <= ot) throw new Error("invalid field: expected ORDER > 0, got " + t);
	let o, s;
	if (typeof e == "object" && e != null) {
		if (r.sqrt || n) throw new Error("cannot specify opts in two arguments");
		const c = e;
		c.BITS && (o = c.BITS), c.sqrt && (s = c.sqrt), typeof c.isLE == "boolean" && (n = c.isLE);
	} else typeof e == "number" && (o = e), r.sqrt && (s = r.sqrt);
	const { nBitLength: i, nByteLength: f } = ac(t, o);
	if (f > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
	let a;
	const l = Object.freeze({
		ORDER: t,
		isLE: n,
		BITS: i,
		BYTES: f,
		MASK: je$1(i),
		ZERO: ot,
		ONE: Q$1,
		create: (c) => lt$1(c, t),
		isValid: (c) => {
			if (typeof c != "bigint") throw new Error("invalid field element: expected bigint, got " + typeof c);
			return ot <= c && c < t;
		},
		is0: (c) => c === ot,
		isValidNot0: (c) => !l.is0(c) && l.isValid(c),
		isOdd: (c) => (c & Q$1) === Q$1,
		neg: (c) => lt$1(-c, t),
		eql: (c, u) => c === u,
		sqr: (c) => lt$1(c * c, t),
		add: (c, u) => lt$1(c + u, t),
		sub: (c, u) => lt$1(c - u, t),
		mul: (c, u) => lt$1(c * u, t),
		pow: (c, u) => cc(l, c, u),
		div: (c, u) => lt$1(c * yo$1(u, t), t),
		sqrN: (c) => c * c,
		addN: (c, u) => c + u,
		subN: (c, u) => c - u,
		mulN: (c, u) => c * u,
		inv: (c) => yo$1(c, t),
		sqrt: s || ((c) => (a || (a = sc(t)), a(l, c))),
		toBytes: (c) => n ? An$1(c, f) : In$1(c, f),
		fromBytes: (c) => {
			if (c.length !== f) throw new Error("Field.fromBytes: expected " + f + " bytes, got " + c.length);
			return n ? Le$2(c) : Ce$2(c);
		},
		invertBatch: (c) => wo$1(l, c),
		cmov: (c, u, h) => h ? u : c
	});
	return Object.freeze(l);
}
function vo$1(t) {
	if (typeof t != "bigint") throw new Error("field order must be bigint");
	const e = t.toString(2).length;
	return Math.ceil(e / 8);
}
function Eo$1(t) {
	const e = vo$1(t);
	return e + Math.ceil(e / 2);
}
function uc(t, e, n = !1) {
	const r = t.length, o = vo$1(e), s = Eo$1(e);
	if (r < 16 || r < s || r > 1024) throw new Error("expected " + s + "-1024 bytes of input, got " + r);
	const f = lt$1(n ? Le$2(t) : Ce$2(t), e - Q$1) + Q$1;
	return n ? An$1(f, o) : In$1(f, o);
}
var Xt$1 = BigInt(0), Mt$1 = BigInt(1);
function le$1(t, e) {
	const n = e.negate();
	return t ? n : e;
}
function lc(t, e, n) {
	const r = e === "pz" ? (i) => i.pz : (i) => i.ez, o = wo$1(t.Fp, n.map(r));
	return n.map((i, f) => i.toAffine(o[f])).map(t.fromAffine);
}
function Bo$1(t, e) {
	if (!Number.isSafeInteger(t) || t <= 0 || t > e) throw new Error("invalid window size, expected [1.." + e + "], got W=" + t);
}
function On$1(t, e) {
	Bo$1(t, e);
	const n = Math.ceil(e / t) + 1, r = 2 ** (t - 1), o = 2 ** t;
	return {
		windows: n,
		windowSize: r,
		mask: je$1(t),
		maxNumber: o,
		shiftBy: BigInt(t)
	};
}
function Io$1(t, e, n) {
	const { windowSize: r, mask: o, maxNumber: s, shiftBy: i } = n;
	let f = Number(t & o), a = t >> i;
	f > r && (f -= s, a += Mt$1);
	const l = e * r, c = l + Math.abs(f) - 1, u = f === 0, h = f < 0, g = e % 2 !== 0;
	return {
		nextN: a,
		offset: c,
		isZero: u,
		isNeg: h,
		isNegF: g,
		offsetF: l
	};
}
function dc(t, e) {
	if (!Array.isArray(t)) throw new Error("array expected");
	t.forEach((n, r) => {
		if (!(n instanceof e)) throw new Error("invalid point at index " + r);
	});
}
function hc(t, e) {
	if (!Array.isArray(t)) throw new Error("array of scalars expected");
	t.forEach((n, r) => {
		if (!e.isValid(n)) throw new Error("invalid scalar at index " + r);
	});
}
var Un$1 = /* @__PURE__ */ new WeakMap(), Ao$1 = /* @__PURE__ */ new WeakMap();
function _n$1(t) {
	return Ao$1.get(t) || 1;
}
function So$1(t) {
	if (t !== Xt$1) throw new Error("invalid wNAF");
}
function pc(t, e) {
	return {
		constTimeNegate: le$1,
		hasPrecomputes(n) {
			return _n$1(n) !== 1;
		},
		unsafeLadder(n, r, o = t.ZERO) {
			let s = n;
			for (; r > Xt$1;) r & Mt$1 && (o = o.add(s)), s = s.double(), r >>= Mt$1;
			return o;
		},
		precomputeWindow(n, r) {
			const { windows: o, windowSize: s } = On$1(r, e), i = [];
			let f = n, a = f;
			for (let l = 0; l < o; l++) {
				a = f, i.push(a);
				for (let c = 1; c < s; c++) a = a.add(f), i.push(a);
				f = a.double();
			}
			return i;
		},
		wNAF(n, r, o) {
			let s = t.ZERO, i = t.BASE;
			const f = On$1(n, e);
			for (let a = 0; a < f.windows; a++) {
				const { nextN: l, offset: c, isZero: u, isNeg: h, isNegF: g, offsetF: w } = Io$1(o, a, f);
				o = l, u ? i = i.add(le$1(g, r[w])) : s = s.add(le$1(h, r[c]));
			}
			return So$1(o), {
				p: s,
				f: i
			};
		},
		wNAFUnsafe(n, r, o, s = t.ZERO) {
			const i = On$1(n, e);
			for (let f = 0; f < i.windows && o !== Xt$1; f++) {
				const { nextN: a, offset: l, isZero: c, isNeg: u } = Io$1(o, f, i);
				if (o = a, !c) {
					const h = r[l];
					s = s.add(u ? h.negate() : h);
				}
			}
			return So$1(o), s;
		},
		getPrecomputes(n, r, o) {
			let s = Un$1.get(r);
			return s || (s = this.precomputeWindow(r, n), n !== 1 && (typeof o == "function" && (s = o(s)), Un$1.set(r, s))), s;
		},
		wNAFCached(n, r, o) {
			const s = _n$1(n);
			return this.wNAF(s, this.getPrecomputes(s, n, o), r);
		},
		wNAFCachedUnsafe(n, r, o, s) {
			const i = _n$1(n);
			return i === 1 ? this.unsafeLadder(n, r, s) : this.wNAFUnsafe(i, this.getPrecomputes(i, n, o), r, s);
		},
		setWindowSize(n, r) {
			Bo$1(r, e), Ao$1.set(n, r), Un$1.delete(n);
		}
	};
}
function gc(t, e, n, r) {
	let o = e, s = t.ZERO, i = t.ZERO;
	for (; n > Xt$1 || r > Xt$1;) n & Mt$1 && (s = s.add(o)), r & Mt$1 && (i = i.add(o)), o = o.double(), n >>= Mt$1, r >>= Mt$1;
	return {
		p1: s,
		p2: i
	};
}
function bc(t, e, n, r) {
	dc(n, t), hc(r, e);
	const o = n.length, s = r.length;
	if (o !== s) throw new Error("arrays of points and scalars must have equal length");
	const i = t.ZERO, f = tc(BigInt(o));
	let a = 1;
	f > 12 ? a = f - 3 : f > 4 ? a = f - 2 : f > 0 && (a = 2);
	const l = je$1(a), c = new Array(Number(l) + 1).fill(i), u = Math.floor((e.BITS - 1) / a) * a;
	let h = i;
	for (let g = u; g >= 0; g -= a) {
		c.fill(i);
		for (let y = 0; y < s; y++) {
			const x = r[y], R = Number(x >> BigInt(g) & l);
			c[R] = c[R].add(n[y]);
		}
		let w = i;
		for (let y = c.length - 1, x = i; y > 0; y--) x = x.add(c[y]), w = w.add(x);
		if (h = h.add(w), g !== 0) for (let y = 0; y < a; y++) h = h.double();
	}
	return h;
}
function No$1(t, e) {
	if (e) {
		if (e.ORDER !== t) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
		return fc(e), e;
	} else return Yt$1(t);
}
function yc(t, e, n = {}) {
	if (!e || typeof e != "object") throw new Error(`expected valid ${t} CURVE object`);
	for (const f of [
		"p",
		"n",
		"h"
	]) {
		const a = e[f];
		if (!(typeof a == "bigint" && a > Xt$1)) throw new Error(`CURVE.${f} must be positive bigint`);
	}
	const r = No$1(e.p, n.Fp), o = No$1(e.n, n.Fn), i = [
		"Gx",
		"Gy",
		"a",
		t === "weierstrass" ? "b" : "d"
	];
	for (const f of i) if (!r.isValid(e[f])) throw new Error(`CURVE.${f} must be valid field element of CURVE.Fp`);
	return {
		Fp: r,
		Fn: o
	};
}
var de$1 = BigInt(0), Jt$1 = BigInt(1), Pe$1 = BigInt(2);
function mc(t) {
	return ke$2(t, {
		adjustScalarBytes: "function",
		powPminus2: "function"
	}), Object.freeze({ ...t });
}
function wc(t) {
	const { P: n, type: r, adjustScalarBytes: o, powPminus2: s, randomBytes: i } = mc(t), f = r === "x25519";
	if (!f && r !== "x448") throw new Error("invalid type");
	const a = i || Zt$1, l = f ? 255 : 448, c = f ? 32 : 56, u = BigInt(f ? 9 : 5), h = BigInt(f ? 121665 : 39081), g = f ? Pe$1 ** BigInt(254) : Pe$1 ** BigInt(447), y = g + (f ? BigInt(8) * Pe$1 ** BigInt(251) - Jt$1 : BigInt(4) * Pe$1 ** BigInt(445) - Jt$1) + Jt$1, x = (d) => lt$1(d, n), R = M(u);
	function M(d) {
		return An$1(x(d), c);
	}
	function L(d) {
		const m = rt("u coordinate", d, c);
		return f && (m[31] &= 127), x(Le$2(m));
	}
	function V(d) {
		return Le$2(o(rt("scalar", d, c)));
	}
	function _(d, m) {
		const p = $(L(m), V(d));
		if (p === de$1) throw new Error("invalid private or public key received");
		return M(p);
	}
	function k(d) {
		return _(d, R);
	}
	function j(d, m, p) {
		const b = x(d * (m - p));
		return m = x(m - b), p = x(p + b), {
			x_2: m,
			x_3: p
		};
	}
	function $(d, m) {
		Nn$1("u", d, de$1, n), Nn$1("scalar", m, g, y);
		const p = m, b = d;
		let v = Jt$1, B = de$1, E = d, I = Jt$1, S = de$1;
		for (let A = BigInt(l - 1); A >= de$1; A--) {
			const T = p >> A & Jt$1;
			S ^= T, {x_2: v, x_3: E} = j(S, v, E), {x_2: B, x_3: I} = j(S, B, I), S = T;
			const U = v + B, C = x(U * U), H = v - B, q = x(H * H), P = C - q, K = E + I, Z = x((E - I) * U), z = x(K * H), Ft = Z + z, yt = Z - z;
			E = x(Ft * Ft), I = x(b * x(yt * yt)), v = x(C * q), B = x(P * (C + x(h * P)));
		}
		({x_2: v, x_3: E} = j(S, v, E)), {x_2: B, x_3: I} = j(S, B, I);
		const O = s(B);
		return x(v * O);
	}
	return {
		scalarMult: _,
		scalarMultBase: k,
		getSharedSecret: (d, m) => _(d, m),
		getPublicKey: (d) => k(d),
		utils: { randomPrivateKey: () => a(c) },
		GuBytes: R.slice()
	};
}
var xc = BigInt(1), Oo$1 = BigInt(2), vc = BigInt(3), Ec = BigInt(5), Uo$1 = {
	p: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed"),
	n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
	h: BigInt(8),
	a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
	d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
	Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
	Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
};
function Ic(t) {
	const e = BigInt(10), n = BigInt(20), r = BigInt(40), o = BigInt(80), s = Uo$1.p, f = t * t % s * t % s, l = pt$1(pt$1(f, Oo$1, s) * f % s, xc, s) * t % s, c = pt$1(l, Ec, s) * l % s, u = pt$1(c, e, s) * c % s, h = pt$1(u, n, s) * u % s, g = pt$1(h, r, s) * h % s;
	return {
		pow_p_5_8: pt$1(pt$1(pt$1(pt$1(g, o, s) * g % s, o, s) * g % s, e, s) * c % s, Oo$1, s) * t % s,
		b2: f
	};
}
function Ac(t) {
	return t[0] &= 248, t[31] &= 127, t[31] |= 64, t;
}
var Tn = (() => {
	const t = Uo$1.p;
	return wc({
		P: t,
		type: "x25519",
		powPminus2: (e) => {
			const { pow_p_5_8: n, b2: r } = Ic(e);
			return lt$1(pt$1(n, vc, t) * r, t);
		},
		adjustScalarBytes: Ac
	});
})();
function _o$1(t) {
	t.lowS !== void 0 && Re("lowS", t.lowS), t.prehash !== void 0 && Re("prehash", t.prehash);
}
var Sc = class extends Error {
	constructor(e = "") {
		super(e);
	}
};
var vt$1 = {
	Err: Sc,
	_tlv: {
		encode: (t, e) => {
			const { Err: n } = vt$1;
			if (t < 0 || t > 256) throw new n("tlv.encode: wrong tag");
			if (e.length & 1) throw new n("tlv.encode: unpadded data");
			const r = e.length / 2, o = $e$1(r);
			if (o.length / 2 & 128) throw new n("tlv.encode: long form length too big");
			const s = r > 127 ? $e$1(o.length / 2 | 128) : "";
			return $e$1(t) + s + o + e;
		},
		decode(t, e) {
			const { Err: n } = vt$1;
			let r = 0;
			if (t < 0 || t > 256) throw new n("tlv.encode: wrong tag");
			if (e.length < 2 || e[r++] !== t) throw new n("tlv.decode: wrong tlv");
			const o = e[r++], s = !!(o & 128);
			let i = 0;
			if (!s) i = o;
			else {
				const a = o & 127;
				if (!a) throw new n("tlv.decode(long): indefinite length not supported");
				if (a > 4) throw new n("tlv.decode(long): byte length is too big");
				const l = e.subarray(r, r + a);
				if (l.length !== a) throw new n("tlv.decode: length bytes not complete");
				if (l[0] === 0) throw new n("tlv.decode(long): zero leftmost byte");
				for (const c of l) i = i << 8 | c;
				if (r += a, i < 128) throw new n("tlv.decode(long): not minimal encoding");
			}
			const f = e.subarray(r, r + i);
			if (f.length !== i) throw new n("tlv.decode: wrong value length");
			return {
				v: f,
				l: e.subarray(r + i)
			};
		}
	},
	_int: {
		encode(t) {
			const { Err: e } = vt$1;
			if (t < he$1) throw new e("integer: negative integers are not allowed");
			let n = $e$1(t);
			if (Number.parseInt(n[0], 16) & 8 && (n = "00" + n), n.length & 1) throw new e("unexpected DER parsing assertion: unpadded hex");
			return n;
		},
		decode(t) {
			const { Err: e } = vt$1;
			if (t[0] & 128) throw new e("invalid signature integer: negative");
			if (t[0] === 0 && !(t[1] & 128)) throw new e("invalid signature integer: unnecessary leading zero");
			return Ce$2(t);
		}
	},
	toSig(t) {
		const { Err: e, _int: n, _tlv: r } = vt$1, o = rt("signature", t), { v: s, l: i } = r.decode(48, o);
		if (i.length) throw new e("invalid signature: left bytes after parsing");
		const { v: f, l: a } = r.decode(2, s), { v: l, l: c } = r.decode(2, a);
		if (c.length) throw new e("invalid signature: left bytes after parsing");
		return {
			r: n.decode(f),
			s: n.decode(l)
		};
	},
	hexFromSig(t) {
		const { _tlv: e, _int: n } = vt$1, s = e.encode(2, n.encode(t.r)) + e.encode(2, n.encode(t.s));
		return e.encode(48, s);
	}
}, he$1 = BigInt(0), pe$1 = BigInt(1), Nc = BigInt(2), He$1 = BigInt(3), Oc = BigInt(4);
function Uc(t, e, n) {
	function r(o) {
		const s = t.sqr(o), i = t.mul(s, o);
		return t.add(t.add(i, t.mul(o, e)), n);
	}
	return r;
}
function To$1(t, e, n) {
	const { BYTES: r } = t;
	function o(s) {
		let i;
		if (typeof s == "bigint") i = s;
		else {
			let f = rt("private key", s);
			if (e) {
				if (!e.includes(f.length * 2)) throw new Error("invalid private key");
				const a = new Uint8Array(r);
				a.set(f, a.length - f.length), f = a;
			}
			try {
				i = t.fromBytes(f);
			} catch {
				throw new Error(`invalid private key: expected ui8a of size ${r}, got ${typeof s}`);
			}
		}
		if (n && (i = t.create(i)), !t.isValidNot0(i)) throw new Error("invalid private key: out of range [1..N-1]");
		return i;
	}
	return o;
}
function _c(t, e = {}) {
	const { Fp: n, Fn: r } = yc("weierstrass", t, e), { h: o, n: s } = t;
	ke$2(e, {}, {
		allowInfinityPoint: "boolean",
		clearCofactor: "function",
		isTorsionFree: "function",
		fromBytes: "function",
		toBytes: "function",
		endo: "object",
		wrapPrivateKey: "boolean"
	});
	const { endo: i } = e;
	if (i && (!n.is0(t.a) || typeof i.beta != "bigint" || typeof i.splitScalar != "function")) throw new Error("invalid endo: expected \"beta\": bigint and \"splitScalar\": function");
	function f() {
		if (!n.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
	}
	function a($, d, m) {
		const { x: p, y: b } = d.toAffine(), v = n.toBytes(p);
		if (Re("isCompressed", m), m) {
			f();
			return Ht$1(Ro$1(!n.isOdd(b)), v);
		} else return Ht$1(Uint8Array.of(4), v, n.toBytes(b));
	}
	function l($) {
		at($);
		const d = n.BYTES, m = d + 1, p = 2 * d + 1, b = $.length, v = $[0], B = $.subarray(1);
		if (b === m && (v === 2 || v === 3)) {
			const E = n.fromBytes(B);
			if (!n.isValid(E)) throw new Error("bad point: is not on curve, wrong x");
			const I = h(E);
			let S;
			try {
				S = n.sqrt(I);
			} catch (T) {
				const U = T instanceof Error ? ": " + T.message : "";
				throw new Error("bad point: is not on curve, sqrt error" + U);
			}
			f();
			const O = n.isOdd(S);
			return (v & 1) === 1 !== O && (S = n.neg(S)), {
				x: E,
				y: S
			};
		} else if (b === p && v === 4) {
			const E = n.fromBytes(B.subarray(d * 0, d * 1)), I = n.fromBytes(B.subarray(d * 1, d * 2));
			if (!g(E, I)) throw new Error("bad point: is not on curve");
			return {
				x: E,
				y: I
			};
		} else throw new Error(`bad point: got length ${b}, expected compressed=${m} or uncompressed=${p}`);
	}
	const c = e.toBytes || a, u = e.fromBytes || l, h = Uc(n, t.a, t.b);
	function g($, d) {
		const m = n.sqr(d), p = h($);
		return n.eql(m, p);
	}
	if (!g(t.Gx, t.Gy)) throw new Error("bad curve params: generator point");
	const w = n.mul(n.pow(t.a, He$1), Oc), y = n.mul(n.sqr(t.b), BigInt(27));
	if (n.is0(n.add(w, y))) throw new Error("bad curve params: a or b");
	function x($, d, m = !1) {
		if (!n.isValid(d) || m && n.is0(d)) throw new Error(`bad point coordinate ${$}`);
		return d;
	}
	function R($) {
		if (!($ instanceof _)) throw new Error("ProjectivePoint expected");
	}
	const M = ho$1(($, d) => {
		const { px: m, py: p, pz: b } = $;
		if (n.eql(b, n.ONE)) return {
			x: m,
			y: p
		};
		const v = $.is0();
		d ??= v ? n.ONE : n.inv(b);
		const B = n.mul(m, d), E = n.mul(p, d), I = n.mul(b, d);
		if (v) return {
			x: n.ZERO,
			y: n.ZERO
		};
		if (!n.eql(I, n.ONE)) throw new Error("invZ was invalid");
		return {
			x: B,
			y: E
		};
	}), L = ho$1(($) => {
		if ($.is0()) {
			if (e.allowInfinityPoint && !n.is0($.py)) return;
			throw new Error("bad point: ZERO");
		}
		const { x: d, y: m } = $.toAffine();
		if (!n.isValid(d) || !n.isValid(m)) throw new Error("bad point: x or y not field elements");
		if (!g(d, m)) throw new Error("bad point: equation left != right");
		if (!$.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
		return !0;
	});
	function V($, d, m, p, b) {
		return m = new _(n.mul(m.px, $), m.py, m.pz), d = le$1(p, d), m = le$1(b, m), d.add(m);
	}
	class _ {
		constructor(d, m, p) {
			this.px = x("x", d), this.py = x("y", m, !0), this.pz = x("z", p), Object.freeze(this);
		}
		static fromAffine(d) {
			const { x: m, y: p } = d || {};
			if (!d || !n.isValid(m) || !n.isValid(p)) throw new Error("invalid affine point");
			if (d instanceof _) throw new Error("projective point not allowed");
			return n.is0(m) && n.is0(p) ? _.ZERO : new _(m, p, n.ONE);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		static normalizeZ(d) {
			return lc(_, "pz", d);
		}
		static fromBytes(d) {
			return at(d), _.fromHex(d);
		}
		static fromHex(d) {
			const m = _.fromAffine(u(rt("pointHex", d)));
			return m.assertValidity(), m;
		}
		static fromPrivateKey(d) {
			const m = To$1(r, e.allowedPrivateKeyLengths, e.wrapPrivateKey);
			return _.BASE.multiply(m(d));
		}
		static msm(d, m) {
			return bc(_, r, d, m);
		}
		precompute(d = 8, m = !0) {
			return j.setWindowSize(this, d), m || this.multiply(He$1), this;
		}
		_setWindowSize(d) {
			this.precompute(d);
		}
		assertValidity() {
			L(this);
		}
		hasEvenY() {
			const { y: d } = this.toAffine();
			if (!n.isOdd) throw new Error("Field doesn't support isOdd");
			return !n.isOdd(d);
		}
		equals(d) {
			R(d);
			const { px: m, py: p, pz: b } = this, { px: v, py: B, pz: E } = d, I = n.eql(n.mul(m, E), n.mul(v, b)), S = n.eql(n.mul(p, E), n.mul(B, b));
			return I && S;
		}
		negate() {
			return new _(this.px, n.neg(this.py), this.pz);
		}
		double() {
			const { a: d, b: m } = t, p = n.mul(m, He$1), { px: b, py: v, pz: B } = this;
			let E = n.ZERO, I = n.ZERO, S = n.ZERO, O = n.mul(b, b), A = n.mul(v, v), T = n.mul(B, B), U = n.mul(b, v);
			return U = n.add(U, U), S = n.mul(b, B), S = n.add(S, S), E = n.mul(d, S), I = n.mul(p, T), I = n.add(E, I), E = n.sub(A, I), I = n.add(A, I), I = n.mul(E, I), E = n.mul(U, E), S = n.mul(p, S), T = n.mul(d, T), U = n.sub(O, T), U = n.mul(d, U), U = n.add(U, S), S = n.add(O, O), O = n.add(S, O), O = n.add(O, T), O = n.mul(O, U), I = n.add(I, O), T = n.mul(v, B), T = n.add(T, T), O = n.mul(T, U), E = n.sub(E, O), S = n.mul(T, A), S = n.add(S, S), S = n.add(S, S), new _(E, I, S);
		}
		add(d) {
			R(d);
			const { px: m, py: p, pz: b } = this, { px: v, py: B, pz: E } = d;
			let I = n.ZERO, S = n.ZERO, O = n.ZERO;
			const A = t.a, T = n.mul(t.b, He$1);
			let U = n.mul(m, v), C = n.mul(p, B), H = n.mul(b, E), q = n.add(m, p), P = n.add(v, B);
			q = n.mul(q, P), P = n.add(U, C), q = n.sub(q, P), P = n.add(m, b);
			let K = n.add(v, E);
			return P = n.mul(P, K), K = n.add(U, H), P = n.sub(P, K), K = n.add(p, b), I = n.add(B, E), K = n.mul(K, I), I = n.add(C, H), K = n.sub(K, I), O = n.mul(A, P), I = n.mul(T, H), O = n.add(I, O), I = n.sub(C, O), O = n.add(C, O), S = n.mul(I, O), C = n.add(U, U), C = n.add(C, U), H = n.mul(A, H), P = n.mul(T, P), C = n.add(C, H), H = n.sub(U, H), H = n.mul(A, H), P = n.add(P, H), U = n.mul(C, P), S = n.add(S, U), U = n.mul(K, P), I = n.mul(q, I), I = n.sub(I, U), U = n.mul(q, C), O = n.mul(K, O), O = n.add(O, U), new _(I, S, O);
		}
		subtract(d) {
			return this.add(d.negate());
		}
		is0() {
			return this.equals(_.ZERO);
		}
		multiply(d) {
			const { endo: m } = e;
			if (!r.isValidNot0(d)) throw new Error("invalid scalar: out of range");
			let p, b;
			const v = (B) => j.wNAFCached(this, B, _.normalizeZ);
			if (m) {
				const { k1neg: B, k1: E, k2neg: I, k2: S } = m.splitScalar(d), { p: O, f: A } = v(E), { p: T, f: U } = v(S);
				b = A.add(U), p = V(m.beta, O, T, B, I);
			} else {
				const { p: B, f: E } = v(d);
				p = B, b = E;
			}
			return _.normalizeZ([p, b])[0];
		}
		multiplyUnsafe(d) {
			const { endo: m } = e, p = this;
			if (!r.isValid(d)) throw new Error("invalid scalar: out of range");
			if (d === he$1 || p.is0()) return _.ZERO;
			if (d === pe$1) return p;
			if (j.hasPrecomputes(this)) return this.multiply(d);
			if (m) {
				const { k1neg: b, k1: v, k2neg: B, k2: E } = m.splitScalar(d), { p1: I, p2: S } = gc(_, p, v, E);
				return V(m.beta, I, S, b, B);
			} else return j.wNAFCachedUnsafe(p, d);
		}
		multiplyAndAddUnsafe(d, m, p) {
			const b = this.multiplyUnsafe(m).add(d.multiplyUnsafe(p));
			return b.is0() ? void 0 : b;
		}
		toAffine(d) {
			return M(this, d);
		}
		isTorsionFree() {
			const { isTorsionFree: d } = e;
			return o === pe$1 ? !0 : d ? d(_, this) : j.wNAFCachedUnsafe(this, s).is0();
		}
		clearCofactor() {
			const { clearCofactor: d } = e;
			return o === pe$1 ? this : d ? d(_, this) : this.multiplyUnsafe(o);
		}
		toBytes(d = !0) {
			return Re("isCompressed", d), this.assertValidity(), c(_, this, d);
		}
		toRawBytes(d = !0) {
			return this.toBytes(d);
		}
		toHex(d = !0) {
			return ce$1(this.toBytes(d));
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	_.BASE = new _(t.Gx, t.Gy, n.ONE), _.ZERO = new _(n.ZERO, n.ONE, n.ZERO), _.Fp = n, _.Fn = r;
	const k = r.BITS, j = pc(_, e.endo ? Math.ceil(k / 2) : k);
	return _;
}
function Ro$1(t) {
	return Uint8Array.of(t ? 2 : 3);
}
function Tc(t, e, n = {}) {
	ke$2(e, { hash: "function" }, {
		hmac: "function",
		lowS: "boolean",
		randomBytes: "function",
		bits2int: "function",
		bits2int_modN: "function"
	});
	const r = e.randomBytes || Zt$1, o = e.hmac || ((p, ...b) => _e$2(e.hash, p, Ht$1(...b))), { Fp: s, Fn: i } = t, { ORDER: f, BITS: a } = i;
	function l(p) {
		return p > f >> pe$1;
	}
	function c(p) {
		return l(p) ? i.neg(p) : p;
	}
	function u(p, b) {
		if (!i.isValidNot0(b)) throw new Error(`invalid signature ${p}: out of range 1..CURVE.n`);
	}
	class h {
		constructor(b, v, B) {
			u("r", b), u("s", v), this.r = b, this.s = v, B != null && (this.recovery = B), Object.freeze(this);
		}
		static fromCompact(b) {
			const v = i.BYTES, B = rt("compactSignature", b, v * 2);
			return new h(i.fromBytes(B.subarray(0, v)), i.fromBytes(B.subarray(v, v * 2)));
		}
		static fromDER(b) {
			const { r: v, s: B } = vt$1.toSig(rt("DER", b));
			return new h(v, B);
		}
		assertValidity() {}
		addRecoveryBit(b) {
			return new h(this.r, this.s, b);
		}
		recoverPublicKey(b) {
			const v = s.ORDER, { r: B, s: E, recovery: I } = this;
			if (I == null || ![
				0,
				1,
				2,
				3
			].includes(I)) throw new Error("recovery id invalid");
			if (f * Nc < v && I > 1) throw new Error("recovery id is ambiguous for h>1 curve");
			const O = I === 2 || I === 3 ? B + f : B;
			if (!s.isValid(O)) throw new Error("recovery id 2 or 3 invalid");
			const A = s.toBytes(O), T = t.fromHex(Ht$1(Ro$1((I & 1) === 0), A)), U = i.inv(O), C = L(rt("msgHash", b)), H = i.create(-C * U), q = i.create(E * U), P = t.BASE.multiplyUnsafe(H).add(T.multiplyUnsafe(q));
			if (P.is0()) throw new Error("point at infinify");
			return P.assertValidity(), P;
		}
		hasHighS() {
			return l(this.s);
		}
		normalizeS() {
			return this.hasHighS() ? new h(this.r, i.neg(this.s), this.recovery) : this;
		}
		toBytes(b) {
			if (b === "compact") return Ht$1(i.toBytes(this.r), i.toBytes(this.s));
			if (b === "der") return fn$1(vt$1.hexFromSig(this));
			throw new Error("invalid format");
		}
		toDERRawBytes() {
			return this.toBytes("der");
		}
		toDERHex() {
			return ce$1(this.toBytes("der"));
		}
		toCompactRawBytes() {
			return this.toBytes("compact");
		}
		toCompactHex() {
			return ce$1(this.toBytes("compact"));
		}
	}
	const g = To$1(i, n.allowedPrivateKeyLengths, n.wrapPrivateKey), w = {
		isValidPrivateKey(p) {
			try {
				return g(p), !0;
			} catch {
				return !1;
			}
		},
		normPrivateKeyToScalar: g,
		randomPrivateKey: () => {
			const p = f;
			return uc(r(Eo$1(p)), p);
		},
		precompute(p = 8, b = t.BASE) {
			return b.precompute(p, !1);
		}
	};
	function y(p, b = !0) {
		return t.fromPrivateKey(p).toBytes(b);
	}
	function x(p) {
		if (typeof p == "bigint") return !1;
		if (p instanceof t) return !0;
		const v = rt("key", p).length, B = s.BYTES, E = B + 1, I = 2 * B + 1;
		if (!(n.allowedPrivateKeyLengths || i.BYTES === E)) return v === E || v === I;
	}
	function R(p, b, v = !0) {
		if (x(p) === !0) throw new Error("first arg must be private key");
		if (x(b) === !1) throw new Error("second arg must be public key");
		return t.fromHex(b).multiply(g(p)).toBytes(v);
	}
	const M = e.bits2int || function(p) {
		if (p.length > 8192) throw new Error("input is too large");
		const b = Ce$2(p), v = p.length * 8 - a;
		return v > 0 ? b >> BigInt(v) : b;
	}, L = e.bits2int_modN || function(p) {
		return i.create(M(p));
	}, V = je$1(a);
	function _(p) {
		return Nn$1("num < 2^" + a, p, he$1, V), i.toBytes(p);
	}
	function k(p, b, v = j) {
		if (["recovered", "canonical"].some((q) => q in v)) throw new Error("sign() legacy options not supported");
		const { hash: B } = e;
		let { lowS: E, prehash: I, extraEntropy: S } = v;
		E ??= !0, p = rt("msgHash", p), _o$1(v), I && (p = rt("prehashed msgHash", B(p)));
		const O = L(p), A = g(b), T = [_(A), _(O)];
		if (S != null && S !== !1) {
			const q = S === !0 ? r(s.BYTES) : S;
			T.push(rt("extraEntropy", q));
		}
		const U = Ht$1(...T), C = O;
		function H(q) {
			const P = M(q);
			if (!i.isValidNot0(P)) return;
			const K = i.inv(P), et = t.BASE.multiply(P).toAffine(), Z = i.create(et.x);
			if (Z === he$1) return;
			const z = i.create(K * i.create(C + Z * A));
			if (z === he$1) return;
			let Ft = (et.x === Z ? 0 : 2) | Number(et.y & pe$1), yt = z;
			return E && l(z) && (yt = c(z), Ft ^= 1), new h(Z, yt, Ft);
		}
		return {
			seed: U,
			k2sig: H
		};
	}
	const j = {
		lowS: e.lowS,
		prehash: !1
	}, $ = {
		lowS: e.lowS,
		prehash: !1
	};
	function d(p, b, v = j) {
		const { seed: B, k2sig: E } = k(p, b, v);
		return ec(e.hash.outputLen, i.BYTES, o)(B, E);
	}
	t.BASE.precompute(8);
	function m(p, b, v, B = $) {
		const E = p;
		b = rt("msgHash", b), v = rt("publicKey", v), _o$1(B);
		const { lowS: I, prehash: S, format: O } = B;
		if ("strict" in B) throw new Error("options.strict was renamed to lowS");
		if (O !== void 0 && ![
			"compact",
			"der",
			"js"
		].includes(O)) throw new Error("format must be \"compact\", \"der\" or \"js\"");
		const A = typeof E == "string" || nn$1(E), T = !A && !O && typeof E == "object" && E !== null && typeof E.r == "bigint" && typeof E.s == "bigint";
		if (!A && !T) throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
		let U, C;
		try {
			if (T) if (O === void 0 || O === "js") U = new h(E.r, E.s);
			else throw new Error("invalid format");
			if (A) {
				try {
					O !== "compact" && (U = h.fromDER(E));
				} catch (yt) {
					if (!(yt instanceof vt$1.Err)) throw yt;
				}
				!U && O !== "der" && (U = h.fromCompact(E));
			}
			C = t.fromHex(v);
		} catch {
			return !1;
		}
		if (!U || I && U.hasHighS()) return !1;
		S && (b = e.hash(b));
		const { r: H, s: q } = U, P = L(b), K = i.inv(q), et = i.create(P * K), Z = i.create(H * K), z = t.BASE.multiplyUnsafe(et).add(C.multiplyUnsafe(Z));
		return z.is0() ? !1 : i.create(z.x) === H;
	}
	return Object.freeze({
		getPublicKey: y,
		getSharedSecret: R,
		sign: d,
		verify: m,
		utils: w,
		Point: t,
		Signature: h
	});
}
function Rc(t) {
	const e = {
		a: t.a,
		b: t.b,
		p: t.Fp.ORDER,
		n: t.n,
		h: t.h,
		Gx: t.Gx,
		Gy: t.Gy
	};
	return {
		CURVE: e,
		curveOpts: {
			Fp: t.Fp,
			Fn: Yt$1(e.n, t.nBitLength),
			allowedPrivateKeyLengths: t.allowedPrivateKeyLengths,
			allowInfinityPoint: t.allowInfinityPoint,
			endo: t.endo,
			wrapPrivateKey: t.wrapPrivateKey,
			isTorsionFree: t.isTorsionFree,
			clearCofactor: t.clearCofactor,
			fromBytes: t.fromBytes,
			toBytes: t.toBytes
		}
	};
}
function $c(t) {
	const { CURVE: e, curveOpts: n } = Rc(t);
	return {
		CURVE: e,
		curveOpts: n,
		ecdsaOpts: {
			hash: t.hash,
			hmac: t.hmac,
			randomBytes: t.randomBytes,
			lowS: t.lowS,
			bits2int: t.bits2int,
			bits2int_modN: t.bits2int_modN
		}
	};
}
function Cc(t, e) {
	return Object.assign({}, e, {
		ProjectivePoint: e.Point,
		CURVE: t
	});
}
function Lc(t) {
	const { CURVE: e, curveOpts: n, ecdsaOpts: r } = $c(t);
	return Cc(t, Tc(_c(e, n), r, n));
}
function Rn$1(t, e) {
	const n = (r) => Lc({
		...t,
		hash: r
	});
	return {
		...n(e),
		create: n
	};
}
var $o$1 = {
	p: BigInt("0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff"),
	n: BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551"),
	h: BigInt(1),
	a: BigInt("0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc"),
	b: BigInt("0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"),
	Gx: BigInt("0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"),
	Gy: BigInt("0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5")
}, Co$1 = {
	p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000ffffffff"),
	n: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973"),
	h: BigInt(1),
	a: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeffffffff0000000000000000fffffffc"),
	b: BigInt("0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef"),
	Gx: BigInt("0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7"),
	Gy: BigInt("0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f")
}, Lo$1 = {
	p: BigInt("0x1ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
	n: BigInt("0x01fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa51868783bf2f966b7fcc0148f709a5d03bb5c9b8899c47aebb6fb71e91386409"),
	h: BigInt(1),
	a: BigInt("0x1fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc"),
	b: BigInt("0x0051953eb9618e1c9a1f929a21a0b68540eea2da725b99b315f3b8b489918ef109e156193951ec7e937b1652c0bd3bb1bf073573df883d2c34f1ef451fd46b503f00"),
	Gx: BigInt("0x00c6858e06b70404e9cd9e3ecb662395b4429c648139053fb521f828af606b4d3dbaa14b5e77efe75928fe1dc127a2ffa8de3348b3c1856a429bf97e7e31c2e5bd66"),
	Gy: BigInt("0x011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650")
}, jc = Yt$1($o$1.p), kc = Yt$1(Co$1.p), Pc = Yt$1(Lo$1.p), Hc = Rn$1({
	...$o$1,
	Fp: jc,
	lowS: !1
}, Ae);
Rn$1({
	...Co$1,
	Fp: kc,
	lowS: !1
}, Yi), Rn$1({
	...Lo$1,
	Fp: Pc,
	lowS: !1,
	allowedPrivateKeyLengths: [
		130,
		131,
		132
	]
}, Wi);
var Dc = Hc, $n$1 = "base10", tt$1 = "base16", Qt$1 = "base64pad", De$1 = "base64url", te = "utf8", Mc = 0, jo$1 = 1, be$1 = 12, Ln$1 = 32;
function Vc() {
	const t = Tn.utils.randomPrivateKey(), e = Tn.getPublicKey(t);
	return {
		privateKey: toString(t, tt$1),
		publicKey: toString(e, tt$1)
	};
}
function qc() {
	return toString(Zt$1(Ln$1), tt$1);
}
function Kc(t, e) {
	return toString(Jf(Te$1, Tn.getSharedSecret(fromString(t, tt$1), fromString(e, tt$1)), void 0, void 0, Ln$1), tt$1);
}
function Fc(t) {
	return toString(Te$1(fromString(t, tt$1)), tt$1);
}
function zc(t) {
	return toString(Te$1(fromString(t, te)), tt$1);
}
function jn$1(t) {
	return fromString(`${t}`, $n$1);
}
function Vt$2(t) {
	return Number(toString(t, $n$1));
}
function ko$1(t) {
	return t.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function Po$1(t) {
	const e = t.replace(/-/g, "+").replace(/_/g, "/"), n = (4 - e.length % 4) % 4;
	return e + "=".repeat(n);
}
function Gc(t) {
	const e = jn$1(typeof t.type < "u" ? t.type : 0);
	if (Vt$2(e) === 1 && typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
	const n = typeof t.senderPublicKey < "u" ? fromString(t.senderPublicKey, tt$1) : void 0, r = typeof t.iv < "u" ? fromString(t.iv, tt$1) : Zt$1(be$1), i = kn$1({
		type: e,
		sealed: co$1(fromString(t.symKey, tt$1), r).encrypt(fromString(t.message, te)),
		iv: r,
		senderPublicKey: n
	});
	return t.encoding === "base64url" ? ko$1(i) : i;
}
function Zc(t) {
	const e = fromString(t.symKey, tt$1), { sealed: n, iv: r } = Me$2({
		encoded: t.encoded,
		encoding: t.encoding
	}), o = co$1(e, r).decrypt(n);
	if (o === null) throw new Error("Failed to decrypt");
	return toString(o, te);
}
function Wc(t, e) {
	const n = jn$1(2), r = Zt$1(be$1), s = kn$1({
		type: n,
		sealed: fromString(t, te),
		iv: r
	});
	return e === "base64url" ? ko$1(s) : s;
}
function Yc(t, e) {
	const { sealed: n } = Me$2({
		encoded: t,
		encoding: e
	});
	return toString(n, te);
}
function kn$1(t) {
	if (Vt$2(t.type) === 2) return toString(concat([t.type, t.sealed]), Qt$1);
	if (Vt$2(t.type) === 1) {
		if (typeof t.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
		return toString(concat([
			t.type,
			t.senderPublicKey,
			t.iv,
			t.sealed
		]), Qt$1);
	}
	return toString(concat([
		t.type,
		t.iv,
		t.sealed
	]), Qt$1);
}
function Me$2(t) {
	const n = fromString((t.encoding || "base64pad") === "base64url" ? Po$1(t.encoded) : t.encoded, Qt$1), r = n.slice(Mc, jo$1), o = jo$1;
	if (Vt$2(r) === 1) {
		const a = 33, l = 45, c = n.slice(o, a), u = n.slice(a, l);
		return {
			type: r,
			sealed: n.slice(l),
			iv: u,
			senderPublicKey: c
		};
	}
	if (Vt$2(r) === 2) return {
		type: r,
		sealed: n.slice(o),
		iv: Zt$1(be$1)
	};
	const s = 13, i = n.slice(o, s);
	return {
		type: r,
		sealed: n.slice(s),
		iv: i
	};
}
function Xc(t, e) {
	const n = Me$2({
		encoded: t,
		encoding: e?.encoding
	});
	return Ho$1({
		type: Vt$2(n.type),
		senderPublicKey: typeof n.senderPublicKey < "u" ? toString(n.senderPublicKey, tt$1) : void 0,
		receiverPublicKey: e?.receiverPublicKey
	});
}
function Ho$1(t) {
	const e = t?.type || 0;
	if (e === 1) {
		if (typeof t?.senderPublicKey > "u") throw new Error("missing sender public key");
		if (typeof t?.receiverPublicKey > "u") throw new Error("missing receiver public key");
	}
	return {
		type: e,
		senderPublicKey: t?.senderPublicKey,
		receiverPublicKey: t?.receiverPublicKey
	};
}
function Jc(t) {
	return t.type === 1 && typeof t.senderPublicKey == "string" && typeof t.receiverPublicKey == "string";
}
function Qc(t) {
	return t.type === 2;
}
function Do$1(t) {
	const e = Buffer.from(t.x, "base64"), n = Buffer.from(t.y, "base64");
	return concat([
		new Uint8Array([4]),
		e,
		n
	]);
}
function ta(t, e) {
	const [n, r, o] = t.split("."), s = Buffer.from(Po$1(o), "base64");
	if (s.length !== 64) throw new Error("Invalid signature length");
	const i = s.slice(0, 32), f = s.slice(32, 64), l = Te$1(`${n}.${r}`), c = Do$1(e);
	if (!Dc.verify(concat([i, f]), l, c)) throw new Error("Invalid signature");
	return sn$2(t).payload;
}
function ea(t) {
	return t?.relay || { protocol: "irn" };
}
function na(t) {
	const e = C$2[t];
	if (typeof e > "u") throw new Error(`Relay Protocol not supported: ${t}`);
	return e;
}
function Vo$1(t, e = "-") {
	const n = {}, r = "relay" + e;
	return Object.keys(t).forEach((o) => {
		if (o.startsWith(r)) {
			const s = o.replace(r, "");
			n[s] = t[o];
		}
	}), n;
}
function ra(t) {
	if (!t.includes("wc:")) {
		const l = Qe$1(t);
		l != null && l.includes("wc:") && (t = l);
	}
	t = t.includes("wc://") ? t.replace("wc://", "") : t, t = t.includes("wc:") ? t.replace("wc:", "") : t;
	const e = t.indexOf(":"), n = t.indexOf("?") !== -1 ? t.indexOf("?") : void 0, r = t.substring(0, e), o = t.substring(e + 1, n).split("@"), s = typeof n < "u" ? t.substring(n) : "", i = new URLSearchParams(s), f = {};
	i.forEach((l, c) => {
		f[c] = l;
	});
	const a = typeof f.methods == "string" ? f.methods.split(",") : void 0;
	return {
		protocol: r,
		topic: qo$1(o[0]),
		version: parseInt(o[1], 10),
		symKey: f.symKey,
		relay: Vo$1(f),
		methods: a,
		expiryTimestamp: f.expiryTimestamp ? parseInt(f.expiryTimestamp, 10) : void 0
	};
}
function qo$1(t) {
	return t.startsWith("//") ? t.substring(2) : t;
}
function Ko$1(t, e = "-") {
	const n = "relay", r = {};
	return Object.keys(t).forEach((o) => {
		const s = o, i = n + e + s;
		t[s] && (r[i] = t[s]);
	}), r;
}
function oa(t) {
	const e = new URLSearchParams(), n = Ko$1(t.relay);
	Object.keys(n).sort().forEach((o) => {
		e.set(o, n[o]);
	}), e.set("symKey", t.symKey), t.expiryTimestamp && e.set("expiryTimestamp", t.expiryTimestamp.toString()), t.methods && e.set("methods", t.methods.join(","));
	const r = e.toString();
	return `${t.protocol}:${t.topic}@${t.version}?${r}`;
}
function sa(t, e, n) {
	return `${t}?wc_ev=${n}&topic=${e}`;
}
var ia = Object.defineProperty, fa = Object.defineProperties, ca = Object.getOwnPropertyDescriptors, Fo$1 = Object.getOwnPropertySymbols, aa = Object.prototype.hasOwnProperty, ua = Object.prototype.propertyIsEnumerable, zo$1 = (t, e, n) => e in t ? ia(t, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : t[e] = n, la = (t, e) => {
	for (var n in e || (e = {})) aa.call(e, n) && zo$1(t, n, e[n]);
	if (Fo$1) for (var n of Fo$1(e)) ua.call(e, n) && zo$1(t, n, e[n]);
	return t;
}, da = (t, e) => fa(t, ca(e));
function qt$1(t) {
	const e = [];
	return t.forEach((n) => {
		const [r, o] = n.split(":");
		e.push(`${r}:${o}`);
	}), e;
}
function Go$1(t) {
	const e = [];
	return Object.values(t).forEach((n) => {
		e.push(...qt$1(n.accounts));
	}), e;
}
function Zo$1(t, e) {
	const n = [];
	return Object.values(t).forEach((r) => {
		qt$1(r.accounts).includes(e) && n.push(...r.methods);
	}), n;
}
function Wo$1(t, e) {
	const n = [];
	return Object.values(t).forEach((r) => {
		qt$1(r.accounts).includes(e) && n.push(...r.events);
	}), n;
}
function Pn$1(t) {
	return t.includes(":");
}
function Yo$1(t) {
	return Pn$1(t) ? t.split(":")[0] : t;
}
function ye$1(t) {
	var e, n, r;
	const o = {};
	if (!Ve$1(t)) return o;
	for (const [s, i] of Object.entries(t)) {
		const f = Pn$1(s) ? [s] : i.chains, a = i.methods || [], l = i.events || [], c = Yo$1(s);
		o[c] = da(la({}, o[c]), {
			chains: ct$1(f, (e = o[c]) == null ? void 0 : e.chains),
			methods: ct$1(a, (n = o[c]) == null ? void 0 : n.methods),
			events: ct$1(l, (r = o[c]) == null ? void 0 : r.events)
		});
	}
	return o;
}
function Xo$1(t) {
	const e = {};
	return t?.forEach((n) => {
		var r;
		const [o, s] = n.split(":");
		e[o] || (e[o] = {
			accounts: [],
			chains: [],
			events: [],
			methods: []
		}), e[o].accounts.push(n), (r = e[o].chains) == null || r.push(`${o}:${s}`);
	}), e;
}
function ga(t, e) {
	e = e.map((r) => r.replace("did:pkh:", ""));
	const n = Xo$1(e);
	for (const [r, o] of Object.entries(n)) o.methods ? o.methods = ct$1(o.methods, t) : o.methods = t, o.events = ["chainChanged", "accountsChanged"];
	return n;
}
function ba(t, e) {
	var n, r, o, s, i, f;
	const a = ye$1(t), l = ye$1(e), c = {}, u = Object.keys(a).concat(Object.keys(l));
	for (const h of u) c[h] = {
		chains: ct$1((n = a[h]) == null ? void 0 : n.chains, (r = l[h]) == null ? void 0 : r.chains),
		methods: ct$1((o = a[h]) == null ? void 0 : o.methods, (s = l[h]) == null ? void 0 : s.methods),
		events: ct$1((i = a[h]) == null ? void 0 : i.events, (f = l[h]) == null ? void 0 : f.events)
	};
	return c;
}
var Jo$1 = {
	INVALID_METHOD: {
		message: "Invalid method.",
		code: 1001
	},
	INVALID_EVENT: {
		message: "Invalid event.",
		code: 1002
	},
	INVALID_UPDATE_REQUEST: {
		message: "Invalid update request.",
		code: 1003
	},
	INVALID_EXTEND_REQUEST: {
		message: "Invalid extend request.",
		code: 1004
	},
	INVALID_SESSION_SETTLE_REQUEST: {
		message: "Invalid session settle request.",
		code: 1005
	},
	UNAUTHORIZED_METHOD: {
		message: "Unauthorized method.",
		code: 3001
	},
	UNAUTHORIZED_EVENT: {
		message: "Unauthorized event.",
		code: 3002
	},
	UNAUTHORIZED_UPDATE_REQUEST: {
		message: "Unauthorized update request.",
		code: 3003
	},
	UNAUTHORIZED_EXTEND_REQUEST: {
		message: "Unauthorized extend request.",
		code: 3004
	},
	USER_REJECTED: {
		message: "User rejected.",
		code: 5e3
	},
	USER_REJECTED_CHAINS: {
		message: "User rejected chains.",
		code: 5001
	},
	USER_REJECTED_METHODS: {
		message: "User rejected methods.",
		code: 5002
	},
	USER_REJECTED_EVENTS: {
		message: "User rejected events.",
		code: 5003
	},
	UNSUPPORTED_CHAINS: {
		message: "Unsupported chains.",
		code: 5100
	},
	UNSUPPORTED_METHODS: {
		message: "Unsupported methods.",
		code: 5101
	},
	UNSUPPORTED_EVENTS: {
		message: "Unsupported events.",
		code: 5102
	},
	UNSUPPORTED_ACCOUNTS: {
		message: "Unsupported accounts.",
		code: 5103
	},
	UNSUPPORTED_NAMESPACE_KEY: {
		message: "Unsupported namespace key.",
		code: 5104
	},
	USER_DISCONNECTED: {
		message: "User disconnected.",
		code: 6e3
	},
	SESSION_SETTLEMENT_FAILED: {
		message: "Session settlement failed.",
		code: 7e3
	},
	WC_METHOD_UNSUPPORTED: {
		message: "Unsupported wc_ method.",
		code: 10001
	}
}, Qo = {
	NOT_INITIALIZED: {
		message: "Not initialized.",
		code: 1
	},
	NO_MATCHING_KEY: {
		message: "No matching key.",
		code: 2
	},
	RESTORE_WILL_OVERRIDE: {
		message: "Restore will override.",
		code: 3
	},
	RESUBSCRIBED: {
		message: "Resubscribed.",
		code: 4
	},
	MISSING_OR_INVALID: {
		message: "Missing or invalid.",
		code: 5
	},
	EXPIRED: {
		message: "Expired.",
		code: 6
	},
	UNKNOWN_TYPE: {
		message: "Unknown type.",
		code: 7
	},
	MISMATCHED_TOPIC: {
		message: "Mismatched topic.",
		code: 8
	},
	NON_CONFORMING_NAMESPACES: {
		message: "Non conforming namespaces.",
		code: 9
	}
};
function Et$2(t, e) {
	const { message: n, code: r } = Qo[t];
	return {
		message: e ? `${n} ${e}` : n,
		code: r
	};
}
function Kt$1(t, e) {
	const { message: n, code: r } = Jo$1[t];
	return {
		message: e ? `${n} ${e}` : n,
		code: r
	};
}
function me$1(t, e) {
	return Array.isArray(t) ? typeof e < "u" && t.length ? t.every(e) : !0 : !1;
}
function Ve$1(t) {
	return Object.getPrototypeOf(t) === Object.prototype && Object.keys(t).length;
}
function kt$1(t) {
	return typeof t > "u";
}
function it$1(t, e) {
	return e && kt$1(t) ? !0 : typeof t == "string" && !!t.trim().length;
}
function qe$1(t, e) {
	return e && kt$1(t) ? !0 : typeof t == "number" && !isNaN(t);
}
function ya(t, e) {
	const { requiredNamespaces: n } = e, r = Object.keys(t.namespaces), o = Object.keys(n);
	let s = !0;
	return It$1(o, r) ? (r.forEach((i) => {
		const { accounts: f, methods: a, events: l } = t.namespaces[i], c = qt$1(f), u = n[i];
		(!It$1(ve(i, u), c) || !It$1(u.methods, a) || !It$1(u.events, l)) && (s = !1);
	}), s) : !1;
}
function we$1(t) {
	return it$1(t, !1) && t.includes(":") ? t.split(":").length === 2 : !1;
}
function ts(t) {
	if (it$1(t, !1) && t.includes(":")) {
		const e = t.split(":");
		if (e.length === 3) {
			const n = e[0] + ":" + e[1];
			return !!e[2] && we$1(n);
		}
	}
	return !1;
}
function ma(t) {
	function e(n) {
		try {
			return typeof new URL(n) < "u";
		} catch {
			return !1;
		}
	}
	try {
		if (it$1(t, !1)) {
			if (e(t)) return !0;
			return e(Qe$1(t));
		}
	} catch {}
	return !1;
}
function wa(t) {
	var e;
	return (e = t?.proposer) == null ? void 0 : e.publicKey;
}
function xa(t) {
	return t?.topic;
}
function va(t, e) {
	let n = null;
	return it$1(t?.publicKey, !1) || (n = Et$2("MISSING_OR_INVALID", `${e} controller public key should be a string`)), n;
}
function Hn$1(t) {
	let e = !0;
	return me$1(t) ? t.length && (e = t.every((n) => it$1(n, !1))) : e = !1, e;
}
function es(t, e, n) {
	let r = null;
	return me$1(e) && e.length ? e.forEach((o) => {
		r || we$1(o) || (r = Kt$1("UNSUPPORTED_CHAINS", `${n}, chain ${o} should be a string and conform to "namespace:chainId" format`));
	}) : we$1(t) || (r = Kt$1("UNSUPPORTED_CHAINS", `${n}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)), r;
}
function ns(t, e, n) {
	let r = null;
	return Object.entries(t).forEach(([o, s]) => {
		if (r) return;
		const i = es(o, ve(o, s), `${e} ${n}`);
		i && (r = i);
	}), r;
}
function rs(t, e) {
	let n = null;
	return me$1(t) ? t.forEach((r) => {
		n || ts(r) || (n = Kt$1("UNSUPPORTED_ACCOUNTS", `${e}, account ${r} should be a string and conform to "namespace:chainId:address" format`));
	}) : n = Kt$1("UNSUPPORTED_ACCOUNTS", `${e}, accounts should be an array of strings conforming to "namespace:chainId:address" format`), n;
}
function os$1(t, e) {
	let n = null;
	return Object.values(t).forEach((r) => {
		if (n) return;
		const o = rs(r?.accounts, `${e} namespace`);
		o && (n = o);
	}), n;
}
function ss(t, e) {
	let n = null;
	return Hn$1(t?.methods) ? Hn$1(t?.events) || (n = Kt$1("UNSUPPORTED_EVENTS", `${e}, events should be an array of strings or empty array for no events`)) : n = Kt$1("UNSUPPORTED_METHODS", `${e}, methods should be an array of strings or empty array for no methods`), n;
}
function Dn$1(t, e) {
	let n = null;
	return Object.values(t).forEach((r) => {
		if (n) return;
		const o = ss(r, `${e}, namespace`);
		o && (n = o);
	}), n;
}
function Ea(t, e, n) {
	let r = null;
	if (t && Ve$1(t)) {
		const o = Dn$1(t, e);
		o && (r = o);
		const s = ns(t, e, n);
		s && (r = s);
	} else r = Et$2("MISSING_OR_INVALID", `${e}, ${n} should be an object with data`);
	return r;
}
function is(t, e) {
	let n = null;
	if (t && Ve$1(t)) {
		const r = Dn$1(t, e);
		r && (n = r);
		const o = os$1(t, e);
		o && (n = o);
	} else n = Et$2("MISSING_OR_INVALID", `${e}, namespaces should be an object with data`);
	return n;
}
function fs$1(t) {
	return it$1(t.protocol, !0);
}
function Ba(t, e) {
	let n = !1;
	return e && !t ? n = !0 : t && me$1(t) && t.length && t.forEach((r) => {
		n = fs$1(r);
	}), n;
}
function Ia(t) {
	return typeof t == "number";
}
function Aa(t) {
	return typeof t < "u" && true;
}
function Sa(t) {
	return !(!t || typeof t != "object" || !t.code || !qe$1(t.code, !1) || !t.message || !it$1(t.message, !1));
}
function Na(t) {
	return !(kt$1(t) || !it$1(t.method, !1));
}
function Oa(t) {
	return !(kt$1(t) || kt$1(t.result) && kt$1(t.error) || !qe$1(t.id, !1) || !it$1(t.jsonrpc, !1));
}
function Ua(t) {
	return !(kt$1(t) || !it$1(t.name, !1));
}
function _a(t, e) {
	return !(!we$1(e) || !Go$1(t).includes(e));
}
function Ta(t, e, n) {
	return it$1(n, !1) ? Zo$1(t, e).includes(n) : !1;
}
function Ra(t, e, n) {
	return it$1(n, !1) ? Wo$1(t, e).includes(n) : !1;
}
function cs(t, e, n) {
	let r = null;
	const o = $a(t), s = Ca(e), i = Object.keys(o), f = Object.keys(s), a = as(Object.keys(t)), l = as(Object.keys(e)), c = a.filter((u) => !l.includes(u));
	return c.length && (r = Et$2("NON_CONFORMING_NAMESPACES", `${n} namespaces keys don't satisfy requiredNamespaces.
      Required: ${c.toString()}
      Received: ${Object.keys(e).toString()}`)), It$1(i, f) || (r = Et$2("NON_CONFORMING_NAMESPACES", `${n} namespaces chains don't satisfy required namespaces.
      Required: ${i.toString()}
      Approved: ${f.toString()}`)), Object.keys(e).forEach((u) => {
		if (!u.includes(":") || r) return;
		const h = qt$1(e[u].accounts);
		h.includes(u) || (r = Et$2("NON_CONFORMING_NAMESPACES", `${n} namespaces accounts don't satisfy namespace accounts for ${u}
        Required: ${u}
        Approved: ${h.toString()}`));
	}), i.forEach((u) => {
		r || (It$1(o[u].methods, s[u].methods) ? It$1(o[u].events, s[u].events) || (r = Et$2("NON_CONFORMING_NAMESPACES", `${n} namespaces events don't satisfy namespace events for ${u}`)) : r = Et$2("NON_CONFORMING_NAMESPACES", `${n} namespaces methods don't satisfy namespace methods for ${u}`));
	}), r;
}
function $a(t) {
	const e = {};
	return Object.keys(t).forEach((n) => {
		var r;
		n.includes(":") ? e[n] = t[n] : (r = t[n].chains) == null || r.forEach((o) => {
			e[o] = {
				methods: t[n].methods,
				events: t[n].events
			};
		});
	}), e;
}
function as(t) {
	return [...new Set(t.map((e) => e.includes(":") ? e.split(":")[0] : e))];
}
function Ca(t) {
	const e = {};
	return Object.keys(t).forEach((n) => {
		if (n.includes(":")) e[n] = t[n];
		else qt$1(t[n].accounts)?.forEach((o) => {
			e[o] = {
				accounts: t[n].accounts.filter((s) => s.includes(`${o}:`)),
				methods: t[n].methods,
				events: t[n].events
			};
		});
	}), e;
}
function La(t, e) {
	return qe$1(t, !1) && t <= e.max && t >= e.min;
}
function ja() {
	const t = Pt$1();
	return new Promise((e) => {
		switch (t) {
			case J$1.browser:
				e(us());
				break;
			case J$1.reactNative:
				e(ls());
				break;
			case J$1.node:
				e(ds());
				break;
			default: e(!0);
		}
	});
}
function us() {
	return zt$1() && navigator?.onLine;
}
async function ls() {
	if (Bt$1() && typeof global < "u" && global != null && global.NetInfo) return (await (global == null ? void 0 : global.NetInfo.fetch()))?.isConnected;
	return !0;
}
function ds() {
	return !0;
}
function ka(t) {
	switch (Pt$1()) {
		case J$1.browser:
			hs$1(t);
			break;
		case J$1.reactNative:
			ps(t);
			break;
		case J$1.node: break;
	}
}
function hs$1(t) {
	!Bt$1() && zt$1() && (window.addEventListener("online", () => t(!0)), window.addEventListener("offline", () => t(!1)));
}
function ps(t) {
	Bt$1() && typeof global < "u" && global != null && global.NetInfo && global?.NetInfo.addEventListener((e) => t(e?.isConnected));
}
function Pa() {
	var t;
	return zt$1() && (0, import_cjs$1.getDocument)() ? ((t = (0, import_cjs$1.getDocument)()) == null ? void 0 : t.visibilityState) === "visible" : !0;
}
var Mn$1 = {};
var Ha = class {
	static get(e) {
		return Mn$1[e];
	}
	static set(e, n) {
		Mn$1[e] = n;
	}
	static delete(e) {
		delete Mn$1[e];
	}
};
function gs$1(t) {
	const e = esm_default.decode(t);
	if (e.length < 33) throw new Error("Too short to contain a public key");
	return e.slice(1, 33);
}
function bs$1({ publicKey: t, signature: e, payload: n }) {
	var r;
	const o = Vn$1(n.method), s = 128 | parseInt(((r = n.version) == null ? void 0 : r.toString()) || "4"), i = Ma(n.address), f = n.era === "00" ? new Uint8Array([0]) : Vn$1(n.era);
	if (f.length !== 1 && f.length !== 2) throw new Error("Invalid era length");
	const a = parseInt(n.nonce, 16), l = new Uint8Array([a & 255, a >> 8 & 255]), u = qa(BigInt(`0x${Da(n.tip)}`)), h = new Uint8Array([
		0,
		...t,
		i,
		...e,
		...f,
		...l,
		...u,
		...o
	]), g = Va(h.length + 1);
	return new Uint8Array([
		...g,
		s,
		...h
	]);
}
function ys(t) {
	const n = (0, import_blakejs.blake2b)(Vn$1(t), void 0, 32);
	return "0x" + Buffer.from(n).toString("hex");
}
function Vn$1(t) {
	return new Uint8Array(t.replace(/^0x/, "").match(/.{1,2}/g).map((e) => parseInt(e, 16)));
}
function Da(t) {
	return t.startsWith("0x") ? t.slice(2) : t;
}
function Ma(t) {
	const e = esm_default.decode(t)[0];
	return e === 42 ? 0 : e === 60 ? 2 : 1;
}
function Va(t) {
	if (t < 64) return new Uint8Array([t << 2]);
	if (t < 16384) {
		const e = t << 2 | 1;
		return new Uint8Array([e & 255, e >> 8 & 255]);
	} else if (t < 1 << 30) {
		const e = t << 2 | 2;
		return new Uint8Array([
			e & 255,
			e >> 8 & 255,
			e >> 16 & 255,
			e >> 24 & 255
		]);
	} else throw new Error("Compact encoding > 2^30 not supported");
}
function qa(t) {
	if (t < BigInt(1) << BigInt(6)) return new Uint8Array([Number(t << BigInt(2))]);
	if (t < BigInt(1) << BigInt(14)) {
		const e = t << BigInt(2) | BigInt(1);
		return new Uint8Array([Number(e & BigInt(255)), Number(e >> BigInt(8) & BigInt(255))]);
	} else if (t < BigInt(1) << BigInt(30)) {
		const e = t << BigInt(2) | BigInt(2);
		return new Uint8Array([
			Number(e & BigInt(255)),
			Number(e >> BigInt(8) & BigInt(255)),
			Number(e >> BigInt(16) & BigInt(255)),
			Number(e >> BigInt(24) & BigInt(255))
		]);
	} else throw new Error("BigInt compact encoding not supported > 2^30");
}
function Ka(t) {
	const e = Uint8Array.from(Buffer.from(t.signature, "hex")), r = bs$1({
		publicKey: gs$1(t.transaction.address),
		signature: e,
		payload: t.transaction
	});
	return ys(Buffer.from(r).toString("hex"));
}
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connect@4.89.0_bufferutil@4.1.0_db0@0.3.4_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/@dynamic-labs/wallet-connect/_virtual/_tslib.js
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
function __awaiter$2(thisArg, _arguments, P, generator) {
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
//#region ../../node_modules/.pnpm/@walletconnect+events@1.0.1/node_modules/@walletconnect/events/dist/esm/events.js
var IEvents = class {};
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+heartbeat@1.2.2/node_modules/@walletconnect/heartbeat/dist/index.es.js
var n$2 = class extends IEvents {
	constructor(e) {
		super();
	}
};
var s$1 = import_cjs$3.FIVE_SECONDS, r$1 = { pulse: "heartbeat_pulse" };
var i$2 = class i$2 extends n$2 {
	constructor(e) {
		super(e), this.events = new EventEmitter(), this.interval = s$1, this.interval = e?.interval || s$1;
	}
	static async init(e) {
		const t = new i$2(e);
		return await t.init(), t;
	}
	async init() {
		await this.initialize();
	}
	stop() {
		clearInterval(this.intervalRef);
	}
	on(e, t) {
		this.events.on(e, t);
	}
	once(e, t) {
		this.events.once(e, t);
	}
	off(e, t) {
		this.events.off(e, t);
	}
	removeListener(e, t) {
		this.events.removeListener(e, t);
	}
	async initialize() {
		this.intervalRef = setInterval(() => this.pulse(), (0, import_cjs$3.toMiliseconds)(this.interval));
	}
	pulse() {
		this.events.emit(r$1.pulse);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/destr@2.0.5/node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
	if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
		warnKeyDropped(key);
		return;
	}
	return value;
}
function warnKeyDropped(key) {
	console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
	if (typeof value !== "string") return value;
	if (value[0] === "\"" && value[value.length - 1] === "\"" && value.indexOf("\\") === -1) return value.slice(1, -1);
	const _value = value.trim();
	if (_value.length <= 9) switch (_value.toLowerCase()) {
		case "true": return true;
		case "false": return false;
		case "undefined": return;
		case "null": return null;
		case "nan": return NaN;
		case "infinity": return Number.POSITIVE_INFINITY;
		case "-infinity": return Number.NEGATIVE_INFINITY;
	}
	if (!JsonSigRx.test(value)) {
		if (options.strict) throw new SyntaxError("[destr] Invalid JSON");
		return value;
	}
	try {
		if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
			if (options.strict) throw new Error("[destr] Possible prototype pollution");
			return JSON.parse(value, jsonParseTransform);
		}
		return JSON.parse(value);
	} catch (error) {
		if (options.strict) throw error;
		return value;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/unstorage@1.17.5_db0@0.3.4_idb-keyval@6.2.5/node_modules/unstorage/dist/shared/unstorage.zVDD2mZo.mjs
function wrapToPromise(value) {
	if (!value || typeof value.then !== "function") return Promise.resolve(value);
	return value;
}
function asyncCall(function_, ...arguments_) {
	try {
		return wrapToPromise(function_(...arguments_));
	} catch (error) {
		return Promise.reject(error);
	}
}
function isPrimitive(value) {
	const type = typeof value;
	return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
	const proto = Object.getPrototypeOf(value);
	return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
	if (isPrimitive(value)) return String(value);
	if (isPureObject(value) || Array.isArray(value)) return JSON.stringify(value);
	if (typeof value.toJSON === "function") return stringify(value.toJSON());
	throw new Error("[unstorage] Cannot stringify value!");
}
var BASE64_PREFIX = "base64:";
function serializeRaw(value) {
	if (typeof value === "string") return value;
	return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
	if (typeof value !== "string") return value;
	if (!value.startsWith(BASE64_PREFIX)) return value;
	return base64Decode(value.slice(7));
}
function base64Decode(input) {
	if (globalThis.Buffer) return Buffer.from(input, "base64");
	return Uint8Array.from(globalThis.atob(input), (c) => c.codePointAt(0));
}
function base64Encode(input) {
	if (globalThis.Buffer) return Buffer.from(input).toString("base64");
	return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
	if (!key) return "";
	return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
	return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
	base = normalizeKey(base);
	return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
	if (depth === void 0) return true;
	let substrCount = 0;
	let index = key.indexOf(":");
	while (index > -1) {
		substrCount++;
		index = key.indexOf(":", index + 1);
	}
	return substrCount <= depth;
}
function filterKeyByBase(key, base) {
	if (base) return key.startsWith(base) && key[key.length - 1] !== "$";
	return key[key.length - 1] !== "$";
}
//#endregion
//#region ../../node_modules/.pnpm/unstorage@1.17.5_db0@0.3.4_idb-keyval@6.2.5/node_modules/unstorage/dist/index.mjs
function defineDriver(factory) {
	return factory;
}
var DRIVER_NAME = "memory";
var memory = defineDriver(() => {
	const data = /* @__PURE__ */ new Map();
	return {
		name: DRIVER_NAME,
		getInstance: () => data,
		hasItem(key) {
			return data.has(key);
		},
		getItem(key) {
			return data.get(key) ?? null;
		},
		getItemRaw(key) {
			return data.get(key) ?? null;
		},
		setItem(key, value) {
			data.set(key, value);
		},
		setItemRaw(key, value) {
			data.set(key, value);
		},
		removeItem(key) {
			data.delete(key);
		},
		getKeys() {
			return [...data.keys()];
		},
		clear() {
			data.clear();
		},
		dispose() {
			data.clear();
		}
	};
});
function createStorage(options = {}) {
	const context = {
		mounts: { "": options.driver || memory() },
		mountpoints: [""],
		watching: false,
		watchListeners: [],
		unwatch: {}
	};
	const getMount = (key) => {
		for (const base of context.mountpoints) if (key.startsWith(base)) return {
			base,
			relativeKey: key.slice(base.length),
			driver: context.mounts[base]
		};
		return {
			base: "",
			relativeKey: key,
			driver: context.mounts[""]
		};
	};
	const getMounts = (base, includeParent) => {
		return context.mountpoints.filter((mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)).map((mountpoint) => ({
			relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
			mountpoint,
			driver: context.mounts[mountpoint]
		}));
	};
	const onChange = (event, key) => {
		if (!context.watching) return;
		key = normalizeKey(key);
		for (const listener of context.watchListeners) listener(event, key);
	};
	const startWatch = async () => {
		if (context.watching) return;
		context.watching = true;
		for (const mountpoint in context.mounts) context.unwatch[mountpoint] = await watch(context.mounts[mountpoint], onChange, mountpoint);
	};
	const stopWatch = async () => {
		if (!context.watching) return;
		for (const mountpoint in context.unwatch) await context.unwatch[mountpoint]();
		context.unwatch = {};
		context.watching = false;
	};
	const runBatch = (items, commonOptions, cb) => {
		const batches = /* @__PURE__ */ new Map();
		const getBatch = (mount) => {
			let batch = batches.get(mount.base);
			if (!batch) {
				batch = {
					driver: mount.driver,
					base: mount.base,
					items: []
				};
				batches.set(mount.base, batch);
			}
			return batch;
		};
		for (const item of items) {
			const isStringItem = typeof item === "string";
			const key = normalizeKey(isStringItem ? item : item.key);
			const value = isStringItem ? void 0 : item.value;
			const options2 = isStringItem || !item.options ? commonOptions : {
				...commonOptions,
				...item.options
			};
			const mount = getMount(key);
			getBatch(mount).items.push({
				key,
				value,
				relativeKey: mount.relativeKey,
				options: options2
			});
		}
		return Promise.all([...batches.values()].map((batch) => cb(batch))).then((r) => r.flat());
	};
	const storage = {
		hasItem(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			return asyncCall(driver.hasItem, relativeKey, opts);
		},
		getItem(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			return asyncCall(driver.getItem, relativeKey, opts).then((value) => destr(value));
		},
		getItems(items, commonOptions = {}) {
			return runBatch(items, commonOptions, (batch) => {
				if (batch.driver.getItems) return asyncCall(batch.driver.getItems, batch.items.map((item) => ({
					key: item.relativeKey,
					options: item.options
				})), commonOptions).then((r) => r.map((item) => ({
					key: joinKeys(batch.base, item.key),
					value: destr(item.value)
				})));
				return Promise.all(batch.items.map((item) => {
					return asyncCall(batch.driver.getItem, item.relativeKey, item.options).then((value) => ({
						key: item.key,
						value: destr(value)
					}));
				}));
			});
		},
		getItemRaw(key, opts = {}) {
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (driver.getItemRaw) return asyncCall(driver.getItemRaw, relativeKey, opts);
			return asyncCall(driver.getItem, relativeKey, opts).then((value) => deserializeRaw(value));
		},
		async setItem(key, value, opts = {}) {
			if (value === void 0) return storage.removeItem(key);
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (!driver.setItem) return;
			await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
			if (!driver.watch) onChange("update", key);
		},
		async setItems(items, commonOptions) {
			await runBatch(items, commonOptions, async (batch) => {
				if (batch.driver.setItems) return asyncCall(batch.driver.setItems, batch.items.map((item) => ({
					key: item.relativeKey,
					value: stringify(item.value),
					options: item.options
				})), commonOptions);
				if (!batch.driver.setItem) return;
				await Promise.all(batch.items.map((item) => {
					return asyncCall(batch.driver.setItem, item.relativeKey, stringify(item.value), item.options);
				}));
			});
		},
		async setItemRaw(key, value, opts = {}) {
			if (value === void 0) return storage.removeItem(key, opts);
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (driver.setItemRaw) await asyncCall(driver.setItemRaw, relativeKey, value, opts);
			else if (driver.setItem) await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
			else return;
			if (!driver.watch) onChange("update", key);
		},
		async removeItem(key, opts = {}) {
			if (typeof opts === "boolean") opts = { removeMeta: opts };
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			if (!driver.removeItem) return;
			await asyncCall(driver.removeItem, relativeKey, opts);
			if (opts.removeMeta || opts.removeMata) await asyncCall(driver.removeItem, relativeKey + "$", opts);
			if (!driver.watch) onChange("remove", key);
		},
		async getMeta(key, opts = {}) {
			if (typeof opts === "boolean") opts = { nativeOnly: opts };
			key = normalizeKey(key);
			const { relativeKey, driver } = getMount(key);
			const meta = /* @__PURE__ */ Object.create(null);
			if (driver.getMeta) Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
			if (!opts.nativeOnly) {
				const value = await asyncCall(driver.getItem, relativeKey + "$", opts).then((value_) => destr(value_));
				if (value && typeof value === "object") {
					if (typeof value.atime === "string") value.atime = new Date(value.atime);
					if (typeof value.mtime === "string") value.mtime = new Date(value.mtime);
					Object.assign(meta, value);
				}
			}
			return meta;
		},
		setMeta(key, value, opts = {}) {
			return this.setItem(key + "$", value, opts);
		},
		removeMeta(key, opts = {}) {
			return this.removeItem(key + "$", opts);
		},
		async getKeys(base, opts = {}) {
			base = normalizeBaseKey(base);
			const mounts = getMounts(base, true);
			let maskedMounts = [];
			const allKeys = [];
			let allMountsSupportMaxDepth = true;
			for (const mount of mounts) {
				if (!mount.driver.flags?.maxDepth) allMountsSupportMaxDepth = false;
				const rawKeys = await asyncCall(mount.driver.getKeys, mount.relativeBase, opts);
				for (const key of rawKeys) {
					const fullKey = mount.mountpoint + normalizeKey(key);
					if (!maskedMounts.some((p) => fullKey.startsWith(p))) allKeys.push(fullKey);
				}
				maskedMounts = [mount.mountpoint, ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))];
			}
			const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
			return allKeys.filter((key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base));
		},
		async clear(base, opts = {}) {
			base = normalizeBaseKey(base);
			await Promise.all(getMounts(base, false).map(async (m) => {
				if (m.driver.clear) return asyncCall(m.driver.clear, m.relativeBase, opts);
				if (m.driver.removeItem) {
					const keys = await m.driver.getKeys(m.relativeBase || "", opts);
					return Promise.all(keys.map((key) => m.driver.removeItem(key, opts)));
				}
			}));
		},
		async dispose() {
			await Promise.all(Object.values(context.mounts).map((driver) => dispose(driver)));
		},
		async watch(callback) {
			await startWatch();
			context.watchListeners.push(callback);
			return async () => {
				context.watchListeners = context.watchListeners.filter((listener) => listener !== callback);
				if (context.watchListeners.length === 0) await stopWatch();
			};
		},
		async unwatch() {
			context.watchListeners = [];
			await stopWatch();
		},
		mount(base, driver) {
			base = normalizeBaseKey(base);
			if (base && context.mounts[base]) throw new Error(`already mounted at ${base}`);
			if (base) {
				context.mountpoints.push(base);
				context.mountpoints.sort((a, b) => b.length - a.length);
			}
			context.mounts[base] = driver;
			if (context.watching) Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
				context.unwatch[base] = unwatcher;
			}).catch(console.error);
			return storage;
		},
		async unmount(base, _dispose = true) {
			base = normalizeBaseKey(base);
			if (!base || !context.mounts[base]) return;
			if (context.watching && base in context.unwatch) {
				context.unwatch[base]?.();
				delete context.unwatch[base];
			}
			if (_dispose) await dispose(context.mounts[base]);
			context.mountpoints = context.mountpoints.filter((key) => key !== base);
			delete context.mounts[base];
		},
		getMount(key = "") {
			key = normalizeKey(key) + ":";
			const m = getMount(key);
			return {
				driver: m.driver,
				base: m.base
			};
		},
		getMounts(base = "", opts = {}) {
			base = normalizeKey(base);
			return getMounts(base, opts.parents).map((m) => ({
				driver: m.driver,
				base: m.mountpoint
			}));
		},
		keys: (base, opts = {}) => storage.getKeys(base, opts),
		get: (key, opts = {}) => storage.getItem(key, opts),
		set: (key, value, opts = {}) => storage.setItem(key, value, opts),
		has: (key, opts = {}) => storage.hasItem(key, opts),
		del: (key, opts = {}) => storage.removeItem(key, opts),
		remove: (key, opts = {}) => storage.removeItem(key, opts)
	};
	return storage;
}
function watch(driver, onChange, base) {
	return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {};
}
async function dispose(driver) {
	if (typeof driver.dispose === "function") await asyncCall(driver.dispose);
}
//#endregion
//#region ../../node_modules/.pnpm/idb-keyval@6.2.5/node_modules/idb-keyval/dist/index.js
function promisifyRequest(request) {
	return new Promise((resolve, reject) => {
		request.oncomplete = request.onsuccess = () => resolve(request.result);
		request.onabort = request.onerror = () => reject(request.error);
	});
}
function createStore(dbName, storeName) {
	let dbp;
	const getDB = () => {
		if (dbp) return dbp;
		const request = indexedDB.open(dbName);
		request.onupgradeneeded = () => request.result.createObjectStore(storeName);
		dbp = promisifyRequest(request);
		dbp.then((db) => {
			db.onclose = () => dbp = void 0;
		}, () => {});
		return dbp;
	};
	return (txMode, callback) => getDB().then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
var defaultGetStoreFunc;
function defaultGetStore() {
	if (!defaultGetStoreFunc) defaultGetStoreFunc = createStore("keyval-store", "keyval");
	return defaultGetStoreFunc;
}
/**
* Get a value by its key.
*
* @param key
* @param customStore Method to get a custom store. Use with caution (see the docs).
*/
function get(key, customStore = defaultGetStore()) {
	return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
/**
* Set a value with a key.
*
* @param key
* @param value
* @param customStore Method to get a custom store. Use with caution (see the docs).
*/
function set(key, value, customStore = defaultGetStore()) {
	return customStore("readwrite", (store) => {
		store.put(value, key);
		return promisifyRequest(store.transaction);
	});
}
/**
* Delete a particular key from the store.
*
* @param key
* @param customStore Method to get a custom store. Use with caution (see the docs).
*/
function del(key, customStore = defaultGetStore()) {
	return customStore("readwrite", (store) => {
		store.delete(key);
		return promisifyRequest(store.transaction);
	});
}
/**
* Clear all values in the store.
*
* @param customStore Method to get a custom store. Use with caution (see the docs).
*/
function clear(customStore = defaultGetStore()) {
	return customStore("readwrite", (store) => {
		store.clear();
		return promisifyRequest(store.transaction);
	});
}
function eachCursor(store, callback) {
	store.openCursor().onsuccess = function() {
		if (!this.result) return;
		callback(this.result);
		this.result.continue();
	};
	return promisifyRequest(store.transaction);
}
/**
* Get all keys in the store.
*
* @param customStore Method to get a custom store. Use with caution (see the docs).
*/
function keys(customStore = defaultGetStore()) {
	return customStore("readonly", (store) => {
		if (store.getAllKeys) return promisifyRequest(store.getAllKeys());
		const items = [];
		return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+keyvaluestorage@1.1.1_db0@0.3.4/node_modules/@walletconnect/keyvaluestorage/dist/index.es.js
var x$2 = "idb-keyval";
var z$2 = (i = {}) => {
	const t = i.base && i.base.length > 0 ? `${i.base}:` : "", e = (s) => t + s;
	let n;
	return i.dbName && i.storeName && (n = createStore(i.dbName, i.storeName)), {
		name: x$2,
		options: i,
		async hasItem(s) {
			return !(typeof await get(e(s), n) > "u");
		},
		async getItem(s) {
			return await get(e(s), n) ?? null;
		},
		setItem(s, a) {
			return set(e(s), a, n);
		},
		removeItem(s) {
			return del(e(s), n);
		},
		getKeys() {
			return keys(n);
		},
		clear() {
			return clear(n);
		}
	};
};
var D = "WALLET_CONNECT_V2_INDEXED_DB", E$2 = "keyvaluestorage";
var _$1 = class {
	constructor() {
		this.indexedDb = createStorage({ driver: z$2({
			dbName: D,
			storeName: E$2
		}) });
	}
	async getKeys() {
		return this.indexedDb.getKeys();
	}
	async getEntries() {
		return (await this.indexedDb.getItems(await this.indexedDb.getKeys())).map((t) => [t.key, t.value]);
	}
	async getItem(t) {
		const e = await this.indexedDb.getItem(t);
		if (e !== null) return e;
	}
	async setItem(t, e) {
		await this.indexedDb.setItem(t, safeJsonStringify(e));
	}
	async removeItem(t) {
		await this.indexedDb.removeItem(t);
	}
};
var l$1 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, c$3 = { exports: {} };
(function() {
	let i;
	function t() {}
	i = t, i.prototype.getItem = function(e) {
		return this.hasOwnProperty(e) ? String(this[e]) : null;
	}, i.prototype.setItem = function(e, n) {
		this[e] = String(n);
	}, i.prototype.removeItem = function(e) {
		delete this[e];
	}, i.prototype.clear = function() {
		const e = this;
		Object.keys(e).forEach(function(n) {
			e[n] = void 0, delete e[n];
		});
	}, i.prototype.key = function(e) {
		return e = e || 0, Object.keys(this)[e];
	}, i.prototype.__defineGetter__("length", function() {
		return Object.keys(this).length;
	}), typeof l$1 < "u" && l$1.localStorage ? c$3.exports = l$1.localStorage : typeof window < "u" && window.localStorage ? c$3.exports = window.localStorage : c$3.exports = new t();
})();
function k$3(i) {
	var t;
	return [i[0], safeJsonParse((t = i[1]) != null ? t : "")];
}
var K = class {
	constructor() {
		this.localStorage = c$3.exports;
	}
	async getKeys() {
		return Object.keys(this.localStorage);
	}
	async getEntries() {
		return Object.entries(this.localStorage).map(k$3);
	}
	async getItem(t) {
		const e = this.localStorage.getItem(t);
		if (e !== null) return safeJsonParse(e);
	}
	async setItem(t, e) {
		this.localStorage.setItem(t, safeJsonStringify(e));
	}
	async removeItem(t) {
		this.localStorage.removeItem(t);
	}
};
var N$1 = "wc_storage_version", y$3 = 1, O$3 = async (i, t, e) => {
	const n = N$1, s = await t.getItem(n);
	if (s && s >= y$3) {
		e(t);
		return;
	}
	const a = await i.getKeys();
	if (!a.length) {
		e(t);
		return;
	}
	const m = [];
	for (; a.length;) {
		const r = a.shift();
		if (!r) continue;
		const o = r.toLowerCase();
		if (o.includes("wc@") || o.includes("walletconnect") || o.includes("wc_") || o.includes("wallet_connect")) {
			const f = await i.getItem(r);
			await t.setItem(r, f), m.push(r);
		}
	}
	await t.setItem(n, y$3), e(t), j(i, m);
}, j = async (i, t) => {
	t.length && t.forEach(async (e) => {
		await i.removeItem(e);
	});
};
var h$3 = class {
	constructor() {
		this.initialized = !1, this.setInitialized = (e) => {
			this.storage = e, this.initialized = !0;
		};
		const t = new K();
		this.storage = t;
		try {
			O$3(t, new _$1(), this.setInitialized);
		} catch {
			this.initialized = !0;
		}
	}
	async getKeys() {
		return await this.initialize(), this.storage.getKeys();
	}
	async getEntries() {
		return await this.initialize(), this.storage.getEntries();
	}
	async getItem(t) {
		return await this.initialize(), this.storage.getItem(t);
	}
	async setItem(t, e) {
		return await this.initialize(), this.storage.setItem(t, e);
	}
	async removeItem(t) {
		return await this.initialize(), this.storage.removeItem(t);
	}
	async initialize() {
		this.initialized || await new Promise((t) => {
			const e = setInterval(() => {
				this.initialized && (clearInterval(e), t());
			}, 20);
		});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/pino-std-serializers@4.0.0/node_modules/pino-std-serializers/lib/err.js
var require_err = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = errSerializer;
	var { toString } = Object.prototype;
	var seen = Symbol("circular-ref-tag");
	var rawSymbol = Symbol("pino-raw-err-ref");
	var pinoErrProto = Object.create({}, {
		type: {
			enumerable: true,
			writable: true,
			value: void 0
		},
		message: {
			enumerable: true,
			writable: true,
			value: void 0
		},
		stack: {
			enumerable: true,
			writable: true,
			value: void 0
		},
		raw: {
			enumerable: false,
			get: function() {
				return this[rawSymbol];
			},
			set: function(val) {
				this[rawSymbol] = val;
			}
		}
	});
	Object.defineProperty(pinoErrProto, rawSymbol, {
		writable: true,
		value: {}
	});
	function errSerializer(err) {
		if (!(err instanceof Error)) return err;
		err[seen] = void 0;
		const _err = Object.create(pinoErrProto);
		_err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
		_err.message = err.message;
		_err.stack = err.stack;
		for (const key in err) if (_err[key] === void 0) {
			const val = err[key];
			if (val instanceof Error) {
				if (!val.hasOwnProperty(seen)) _err[key] = errSerializer(val);
			} else _err[key] = val;
		}
		delete err[seen];
		_err.raw = err;
		return _err;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/pino-std-serializers@4.0.0/node_modules/pino-std-serializers/lib/req.js
var require_req = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		mapHttpRequest,
		reqSerializer
	};
	var rawSymbol = Symbol("pino-raw-req-ref");
	var pinoReqProto = Object.create({}, {
		id: {
			enumerable: true,
			writable: true,
			value: ""
		},
		method: {
			enumerable: true,
			writable: true,
			value: ""
		},
		url: {
			enumerable: true,
			writable: true,
			value: ""
		},
		query: {
			enumerable: true,
			writable: true,
			value: ""
		},
		params: {
			enumerable: true,
			writable: true,
			value: ""
		},
		headers: {
			enumerable: true,
			writable: true,
			value: {}
		},
		remoteAddress: {
			enumerable: true,
			writable: true,
			value: ""
		},
		remotePort: {
			enumerable: true,
			writable: true,
			value: ""
		},
		raw: {
			enumerable: false,
			get: function() {
				return this[rawSymbol];
			},
			set: function(val) {
				this[rawSymbol] = val;
			}
		}
	});
	Object.defineProperty(pinoReqProto, rawSymbol, {
		writable: true,
		value: {}
	});
	function reqSerializer(req) {
		const connection = req.info || req.socket;
		const _req = Object.create(pinoReqProto);
		_req.id = typeof req.id === "function" ? req.id() : req.id || (req.info ? req.info.id : void 0);
		_req.method = req.method;
		if (req.originalUrl) {
			_req.url = req.originalUrl;
			_req.query = req.query;
			_req.params = req.params;
		} else _req.url = req.path || (req.url ? req.url.path || req.url : void 0);
		_req.headers = req.headers;
		_req.remoteAddress = connection && connection.remoteAddress;
		_req.remotePort = connection && connection.remotePort;
		_req.raw = req.raw || req;
		return _req;
	}
	function mapHttpRequest(req) {
		return { req: reqSerializer(req) };
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/pino-std-serializers@4.0.0/node_modules/pino-std-serializers/lib/res.js
var require_res = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		mapHttpResponse,
		resSerializer
	};
	var rawSymbol = Symbol("pino-raw-res-ref");
	var pinoResProto = Object.create({}, {
		statusCode: {
			enumerable: true,
			writable: true,
			value: 0
		},
		headers: {
			enumerable: true,
			writable: true,
			value: ""
		},
		raw: {
			enumerable: false,
			get: function() {
				return this[rawSymbol];
			},
			set: function(val) {
				this[rawSymbol] = val;
			}
		}
	});
	Object.defineProperty(pinoResProto, rawSymbol, {
		writable: true,
		value: {}
	});
	function resSerializer(res) {
		const _res = Object.create(pinoResProto);
		_res.statusCode = res.statusCode;
		_res.headers = res.getHeaders ? res.getHeaders() : res._headers;
		_res.raw = res;
		return _res;
	}
	function mapHttpResponse(res) {
		return { res: resSerializer(res) };
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/pino-std-serializers@4.0.0/node_modules/pino-std-serializers/index.js
var require_pino_std_serializers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var errSerializer = require_err();
	var reqSerializers = require_req();
	var resSerializers = require_res();
	module.exports = {
		err: errSerializer,
		mapHttpRequest: reqSerializers.mapHttpRequest,
		mapHttpResponse: resSerializers.mapHttpResponse,
		req: reqSerializers.reqSerializer,
		res: resSerializers.resSerializer,
		wrapErrorSerializer: function wrapErrorSerializer(customSerializer) {
			if (customSerializer === errSerializer) return customSerializer;
			return function wrapErrSerializer(err) {
				return customSerializer(errSerializer(err));
			};
		},
		wrapRequestSerializer: function wrapRequestSerializer(customSerializer) {
			if (customSerializer === reqSerializers.reqSerializer) return customSerializer;
			return function wrappedReqSerializer(req) {
				return customSerializer(reqSerializers.reqSerializer(req));
			};
		},
		wrapResponseSerializer: function wrapResponseSerializer(customSerializer) {
			if (customSerializer === resSerializers.resSerializer) return customSerializer;
			return function wrappedResSerializer(res) {
				return customSerializer(resSerializers.resSerializer(res));
			};
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/caller.js
var require_caller = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function noOpPrepareStackTrace(_, stack) {
		return stack;
	}
	module.exports = function getCallers() {
		const originalPrepare = Error.prepareStackTrace;
		Error.prepareStackTrace = noOpPrepareStackTrace;
		const stack = (/* @__PURE__ */ new Error()).stack;
		Error.prepareStackTrace = originalPrepare;
		if (!Array.isArray(stack)) return;
		const entries = stack.slice(2);
		const fileNames = [];
		for (const entry of entries) {
			if (!entry) continue;
			fileNames.push(entry.getFileName());
		}
		return fileNames;
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-redact@3.5.0/node_modules/fast-redact/lib/validator.js
var require_validator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = validator;
	function validator(opts = {}) {
		const { ERR_PATHS_MUST_BE_STRINGS = () => "fast-redact - Paths must be (non-empty) strings", ERR_INVALID_PATH = (s) => `fast-redact – Invalid path (${s})` } = opts;
		return function validate({ paths }) {
			paths.forEach((s) => {
				if (typeof s !== "string") throw Error(ERR_PATHS_MUST_BE_STRINGS());
				try {
					if (/〇/.test(s)) throw Error();
					const expr = (s[0] === "[" ? "" : ".") + s.replace(/^\*/, "〇").replace(/\.\*/g, ".〇").replace(/\[\*\]/g, "[〇]");
					if (/\n|\r|;/.test(expr)) throw Error();
					if (/\/\*/.test(expr)) throw Error();
					Function(`
            'use strict'
            const o = new Proxy({}, { get: () => o, set: () => { throw Error() } });
            const 〇 = null;
            o${expr}
            if ([o${expr}].length !== 1) throw Error()`)();
				} catch (e) {
					throw Error(ERR_INVALID_PATH(s));
				}
			});
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-redact@3.5.0/node_modules/fast-redact/lib/rx.js
var require_rx = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = /[^.[\]]+|\[((?:.)*?)\]/g;
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-redact@3.5.0/node_modules/fast-redact/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var rx = require_rx();
	module.exports = parse;
	function parse({ paths }) {
		const wildcards = [];
		var wcLen = 0;
		const secret = paths.reduce(function(o, strPath, ix) {
			var path = strPath.match(rx).map((p) => p.replace(/'|"|`/g, ""));
			const leadingBracket = strPath[0] === "[";
			path = path.map((p) => {
				if (p[0] === "[") return p.substr(1, p.length - 2);
				else return p;
			});
			const star = path.indexOf("*");
			if (star > -1) {
				const before = path.slice(0, star);
				const beforeStr = before.join(".");
				const after = path.slice(star + 1, path.length);
				const nested = after.length > 0;
				wcLen++;
				wildcards.push({
					before,
					beforeStr,
					after,
					nested
				});
			} else o[strPath] = {
				path,
				val: void 0,
				precensored: false,
				circle: "",
				escPath: JSON.stringify(strPath),
				leadingBracket
			};
			return o;
		}, {});
		return {
			wildcards,
			wcLen,
			secret
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-redact@3.5.0/node_modules/fast-redact/lib/redactor.js
var require_redactor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var rx = require_rx();
	module.exports = redactor;
	function redactor({ secret, serialize, wcLen, strict, isCensorFct, censorFctTakesPath }, state) {
		const redact = Function("o", `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict, serialize)}
    }
    const { censor, secret } = this
    const originalSecret = {}
    const secretKeys = Object.keys(secret)
    for (var i = 0; i < secretKeys.length; i++) {
      originalSecret[secretKeys[i]] = secret[secretKeys[i]]
    }

    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    this.secret = originalSecret
    ${resultTmpl(serialize)}
  `).bind(state);
		redact.state = state;
		if (serialize === false) redact.restore = (o) => state.restore(o);
		return redact;
	}
	function redactTmpl(secret, isCensorFct, censorFctTakesPath) {
		return Object.keys(secret).map((path) => {
			const { escPath, leadingBracket, path: arrPath } = secret[path];
			const skip = leadingBracket ? 1 : 0;
			const delim = leadingBracket ? "" : ".";
			const hops = [];
			var match;
			while ((match = rx.exec(path)) !== null) {
				const [, ix] = match;
				const { index, input } = match;
				if (index > skip) hops.push(input.substring(0, index - (ix ? 0 : 1)));
			}
			var existence = hops.map((p) => `o${delim}${p}`).join(" && ");
			if (existence.length === 0) existence += `o${delim}${path} != null`;
			else existence += ` && o${delim}${path} != null`;
			const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join("\n")}
      }
    `;
			const censorArgs = censorFctTakesPath ? `val, ${JSON.stringify(arrPath)}` : `val`;
			return `
      if (${existence}) {
        const val = o${delim}${path}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path} = ${isCensorFct ? `censor(${censorArgs})` : "censor"}
          ${circularDetection}
        }
      }
    `;
		}).join("\n");
	}
	function dynamicRedactTmpl(hasWildcards, isCensorFct, censorFctTakesPath) {
		return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : "";
	}
	function resultTmpl(serialize) {
		return serialize === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `;
	}
	function strictImpl(strict, serialize) {
		return strict === true ? `throw Error('fast-redact: primitives cannot be redacted')` : serialize === false ? `return o` : `return this.serialize(o)`;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-redact@3.5.0/node_modules/fast-redact/lib/modifiers.js
var require_modifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		groupRedact,
		groupRestore,
		nestedRedact,
		nestedRestore
	};
	function groupRestore({ keys, values, target }) {
		if (target == null || typeof target === "string") return;
		const length = keys.length;
		for (var i = 0; i < length; i++) {
			const k = keys[i];
			target[k] = values[i];
		}
	}
	function groupRedact(o, path, censor, isCensorFct, censorFctTakesPath) {
		const target = get(o, path);
		if (target == null || typeof target === "string") return {
			keys: null,
			values: null,
			target,
			flat: true
		};
		const keys = Object.keys(target);
		const keysLength = keys.length;
		const pathLength = path.length;
		const pathWithKey = censorFctTakesPath ? [...path] : void 0;
		const values = new Array(keysLength);
		for (var i = 0; i < keysLength; i++) {
			const key = keys[i];
			values[i] = target[key];
			if (censorFctTakesPath) {
				pathWithKey[pathLength] = key;
				target[key] = censor(target[key], pathWithKey);
			} else if (isCensorFct) target[key] = censor(target[key]);
			else target[key] = censor;
		}
		return {
			keys,
			values,
			target,
			flat: true
		};
	}
	/**
	* @param {RestoreInstruction[]} instructions a set of instructions for restoring values to objects
	*/
	function nestedRestore(instructions) {
		for (let i = 0; i < instructions.length; i++) {
			const { target, path, value } = instructions[i];
			let current = target;
			for (let i = path.length - 1; i > 0; i--) current = current[path[i]];
			current[path[0]] = value;
		}
	}
	function nestedRedact(store, o, path, ns, censor, isCensorFct, censorFctTakesPath) {
		const target = get(o, path);
		if (target == null) return;
		const keys = Object.keys(target);
		const keysLength = keys.length;
		for (var i = 0; i < keysLength; i++) {
			const key = keys[i];
			specialSet(store, target, key, path, ns, censor, isCensorFct, censorFctTakesPath);
		}
		return store;
	}
	function has(obj, prop) {
		return obj !== void 0 && obj !== null ? "hasOwn" in Object ? Object.hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop) : false;
	}
	function specialSet(store, o, k, path, afterPath, censor, isCensorFct, censorFctTakesPath) {
		const afterPathLen = afterPath.length;
		const lastPathIndex = afterPathLen - 1;
		const originalKey = k;
		var i = -1;
		var n;
		var nv;
		var ov;
		var oov = null;
		var wc = null;
		var kIsWc;
		var wcov;
		var consecutive = false;
		var level = 0;
		var depth = 0;
		var redactPathCurrent = tree();
		ov = n = o[k];
		if (typeof n !== "object") return;
		while (n != null && ++i < afterPathLen) {
			depth += 1;
			k = afterPath[i];
			oov = ov;
			if (k !== "*" && !wc && !(typeof n === "object" && k in n)) break;
			if (k === "*") {
				if (wc === "*") consecutive = true;
				wc = k;
				if (i !== lastPathIndex) continue;
			}
			if (wc) {
				const wcKeys = Object.keys(n);
				for (var j = 0; j < wcKeys.length; j++) {
					const wck = wcKeys[j];
					wcov = n[wck];
					kIsWc = k === "*";
					if (consecutive) {
						redactPathCurrent = node(redactPathCurrent, wck, depth);
						level = i;
						ov = iterateNthLevel(wcov, level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, o[originalKey], depth + 1);
					} else if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
						if (kIsWc) ov = wcov;
						else ov = wcov[k];
						nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
							...path,
							originalKey,
							...afterPath
						]) : censor(ov) : censor;
						if (kIsWc) {
							const rv = restoreInstr(node(redactPathCurrent, wck, depth), ov, o[originalKey]);
							store.push(rv);
							n[wck] = nv;
						} else if (wcov[k] === nv) {} else if (nv === void 0 && censor !== void 0 || has(wcov, k) && nv === ov) redactPathCurrent = node(redactPathCurrent, wck, depth);
						else {
							redactPathCurrent = node(redactPathCurrent, wck, depth);
							const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, o[originalKey]);
							store.push(rv);
							wcov[k] = nv;
						}
					}
				}
				wc = null;
			} else {
				ov = n[k];
				redactPathCurrent = node(redactPathCurrent, k, depth);
				nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
					...path,
					originalKey,
					...afterPath
				]) : censor(ov) : censor;
				if (has(n, k) && nv === ov || nv === void 0 && censor !== void 0) {} else {
					const rv = restoreInstr(redactPathCurrent, ov, o[originalKey]);
					store.push(rv);
					n[k] = nv;
				}
				n = n[k];
			}
			if (typeof n !== "object") break;
			if (ov === oov || typeof ov === "undefined") {}
		}
	}
	function get(o, p) {
		var i = -1;
		var l = p.length;
		var n = o;
		while (n != null && ++i < l) n = n[p[i]];
		return n;
	}
	function iterateNthLevel(wcov, level, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth) {
		if (level === 0) {
			if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
				if (kIsWc) ov = wcov;
				else ov = wcov[k];
				nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [
					...path,
					originalKey,
					...afterPath
				]) : censor(ov) : censor;
				if (kIsWc) {
					const rv = restoreInstr(redactPathCurrent, ov, parent);
					store.push(rv);
					n[wck] = nv;
				} else if (wcov[k] === nv) {} else if (nv === void 0 && censor !== void 0 || has(wcov, k) && nv === ov) {} else {
					const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, parent);
					store.push(rv);
					wcov[k] = nv;
				}
			}
		}
		for (const key in wcov) if (typeof wcov[key] === "object") {
			redactPathCurrent = node(redactPathCurrent, key, depth);
			iterateNthLevel(wcov[key], level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth + 1);
		}
	}
	/**
	* @typedef {object} TreeNode
	* @prop {TreeNode} [parent] reference to the parent of this node in the tree, or `null` if there is no parent
	* @prop {string} key the key that this node represents (key here being part of the path being redacted
	* @prop {TreeNode[]} children the child nodes of this node
	* @prop {number} depth the depth of this node in the tree
	*/
	/**
	* instantiate a new, empty tree
	* @returns {TreeNode}
	*/
	function tree() {
		return {
			parent: null,
			key: null,
			children: [],
			depth: 0
		};
	}
	/**
	* creates a new node in the tree, attaching it as a child of the provided parent node
	* if the specified depth matches the parent depth, adds the new node as a _sibling_ of the parent instead
	* @param {TreeNode} parent the parent node to add a new node to (if the parent depth matches the provided `depth` value, will instead add as a sibling of this
	* @param {string} key the key that the new node represents (key here being part of the path being redacted)
	* @param {number} depth the depth of the new node in the tree - used to determing whether to add the new node as a child or sibling of the provided `parent` node
	* @returns {TreeNode} a reference to the newly created node in the tree
	*/
	function node(parent, key, depth) {
		if (parent.depth === depth) return node(parent.parent, key, depth);
		var child = {
			parent,
			key,
			depth,
			children: []
		};
		parent.children.push(child);
		return child;
	}
	/**
	* @typedef {object} RestoreInstruction
	* @prop {string[]} path a reverse-order path that can be used to find the correct insertion point to restore a `value` for the given `parent` object
	* @prop {*} value the value to restore
	* @prop {object} target the object to restore the `value` in
	*/
	/**
	* create a restore instruction for the given redactPath node
	* generates a path in reverse order by walking up the redactPath tree
	* @param {TreeNode} node a tree node that should be at the bottom of the redact path (i.e. have no children) - this will be used to walk up the redact path tree to construct the path needed to restore
	* @param {*} value the value to restore
	* @param {object} target a reference to the parent object to apply the restore instruction to
	* @returns {RestoreInstruction} an instruction used to restore a nested value for a specific object
	*/
	function restoreInstr(node, value, target) {
		let current = node;
		const path = [];
		do {
			path.push(current.key);
			current = current.parent;
		} while (current.parent != null);
		return {
			path,
			value,
			target
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-redact@3.5.0/node_modules/fast-redact/lib/restorer.js
var require_restorer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { groupRestore, nestedRestore } = require_modifiers();
	module.exports = restorer;
	function restorer() {
		return function compileRestore() {
			if (this.restore) {
				this.restore.state.secret = this.secret;
				return;
			}
			const { secret, wcLen } = this;
			const paths = Object.keys(secret);
			const resetters = resetTmpl(secret, paths);
			const hasWildcards = wcLen > 0;
			const state = hasWildcards ? {
				secret,
				groupRestore,
				nestedRestore
			} : { secret };
			this.restore = Function("o", restoreTmpl(resetters, paths, hasWildcards)).bind(state);
			this.restore.state = state;
		};
	}
	/**
	* Mutates the original object to be censored by restoring its original values
	* prior to censoring.
	*
	* @param {object} secret Compiled object describing which target fields should
	* be censored and the field states.
	* @param {string[]} paths The list of paths to censor as provided at
	* initialization time.
	*
	* @returns {string} String of JavaScript to be used by `Function()`. The
	* string compiles to the function that does the work in the description.
	*/
	function resetTmpl(secret, paths) {
		return paths.map((path) => {
			const { circle, escPath, leadingBracket } = secret[path];
			return `
      if (secret[${escPath}].val !== undefined) {
        try { ${circle ? `o.${circle} = secret[${escPath}].val` : `o${leadingBracket ? "" : "."}${path} = secret[${escPath}].val`} } catch (e) {}
        ${`secret[${escPath}].val = undefined`}
      }
    `;
		}).join("");
	}
	/**
	* Creates the body of the restore function
	*
	* Restoration of the redacted object happens
	* backwards, in reverse order of redactions,
	* so that repeated redactions on the same object
	* property can be eventually rolled back to the
	* original value.
	*
	* This way dynamic redactions are restored first,
	* starting from the last one working backwards and
	* followed by the static ones.
	*
	* @returns {string} the body of the restore function
	*/
	function restoreTmpl(resetters, paths, hasWildcards) {
		return `
    const secret = this.secret
    ${hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = len - 1; i >= ${paths.length}; i--) {
      const k = keys[i]
      const o = secret[k]
      if (o) {
        if (o.flat === true) this.groupRestore(o)
        else this.nestedRestore(o)
        secret[k] = null
      }
    }
  ` : ""}
    ${resetters}
    return o
  `;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-redact@3.5.0/node_modules/fast-redact/lib/state.js
var require_state = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = state;
	function state(o) {
		const { secret, censor, compileRestore, serialize, groupRedact, nestedRedact, wildcards, wcLen } = o;
		const builder = [{
			secret,
			censor,
			compileRestore
		}];
		if (serialize !== false) builder.push({ serialize });
		if (wcLen > 0) builder.push({
			groupRedact,
			nestedRedact,
			wildcards,
			wcLen
		});
		return Object.assign(...builder);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/fast-redact@3.5.0/node_modules/fast-redact/index.js
var require_fast_redact = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var validator = require_validator();
	var parse = require_parse();
	var redactor = require_redactor();
	var restorer = require_restorer();
	var { groupRedact, nestedRedact } = require_modifiers();
	var state = require_state();
	var rx = require_rx();
	var validate = validator();
	var noop = (o) => o;
	noop.restore = noop;
	var DEFAULT_CENSOR = "[REDACTED]";
	fastRedact.rx = rx;
	fastRedact.validator = validator;
	module.exports = fastRedact;
	function fastRedact(opts = {}) {
		const paths = Array.from(new Set(opts.paths || []));
		const serialize = "serialize" in opts ? opts.serialize === false ? opts.serialize : typeof opts.serialize === "function" ? opts.serialize : JSON.stringify : JSON.stringify;
		const remove = opts.remove;
		if (remove === true && serialize !== JSON.stringify) throw Error("fast-redact – remove option may only be set when serializer is JSON.stringify");
		const censor = remove === true ? void 0 : "censor" in opts ? opts.censor : DEFAULT_CENSOR;
		const isCensorFct = typeof censor === "function";
		const censorFctTakesPath = isCensorFct && censor.length > 1;
		if (paths.length === 0) return serialize || noop;
		validate({
			paths,
			serialize,
			censor
		});
		const { wildcards, wcLen, secret } = parse({
			paths,
			censor
		});
		const compileRestore = restorer();
		return redactor({
			secret,
			wcLen,
			serialize,
			strict: "strict" in opts ? opts.strict : true,
			isCensorFct,
			censorFctTakesPath
		}, state({
			secret,
			censor,
			compileRestore,
			serialize,
			groupRedact,
			nestedRedact,
			wildcards,
			wcLen
		}));
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/symbols.js
var require_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var setLevelSym = Symbol("pino.setLevel");
	var getLevelSym = Symbol("pino.getLevel");
	var levelValSym = Symbol("pino.levelVal");
	var useLevelLabelsSym = Symbol("pino.useLevelLabels");
	var useOnlyCustomLevelsSym = Symbol("pino.useOnlyCustomLevels");
	var mixinSym = Symbol("pino.mixin");
	var lsCacheSym = Symbol("pino.lsCache");
	var chindingsSym = Symbol("pino.chindings");
	var parsedChindingsSym = Symbol("pino.parsedChindings");
	var asJsonSym = Symbol("pino.asJson");
	var writeSym = Symbol("pino.write");
	var redactFmtSym = Symbol("pino.redactFmt");
	var timeSym = Symbol("pino.time");
	var timeSliceIndexSym = Symbol("pino.timeSliceIndex");
	var streamSym = Symbol("pino.stream");
	var stringifySym = Symbol("pino.stringify");
	var stringifySafeSym = Symbol("pino.stringifySafe");
	var stringifiersSym = Symbol("pino.stringifiers");
	var endSym = Symbol("pino.end");
	var formatOptsSym = Symbol("pino.formatOpts");
	var messageKeySym = Symbol("pino.messageKey");
	var nestedKeySym = Symbol("pino.nestedKey");
	var nestedKeyStrSym = Symbol("pino.nestedKeyStr");
	var mixinMergeStrategySym = Symbol("pino.mixinMergeStrategy");
	var wildcardFirstSym = Symbol("pino.wildcardFirst");
	var serializersSym = Symbol.for("pino.serializers");
	var formattersSym = Symbol.for("pino.formatters");
	var hooksSym = Symbol.for("pino.hooks");
	module.exports = {
		setLevelSym,
		getLevelSym,
		levelValSym,
		useLevelLabelsSym,
		mixinSym,
		lsCacheSym,
		chindingsSym,
		parsedChindingsSym,
		asJsonSym,
		writeSym,
		serializersSym,
		redactFmtSym,
		timeSym,
		timeSliceIndexSym,
		streamSym,
		stringifySym,
		stringifySafeSym,
		stringifiersSym,
		endSym,
		formatOptsSym,
		messageKeySym,
		nestedKeySym,
		wildcardFirstSym,
		needsMetadataGsym: Symbol.for("pino.metadata"),
		useOnlyCustomLevelsSym,
		formattersSym,
		hooksSym,
		nestedKeyStrSym,
		mixinMergeStrategySym
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/redaction.js
var require_redaction = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fastRedact = require_fast_redact();
	var { redactFmtSym, wildcardFirstSym } = require_symbols();
	var { rx, validator } = fastRedact;
	var validate = validator({
		ERR_PATHS_MUST_BE_STRINGS: () => "pino – redacted paths must be strings",
		ERR_INVALID_PATH: (s) => `pino – redact paths array contains an invalid path (${s})`
	});
	var CENSOR = "[Redacted]";
	var strict = false;
	function redaction(opts, serialize) {
		const { paths, censor } = handle(opts);
		const shape = paths.reduce((o, str) => {
			rx.lastIndex = 0;
			const first = rx.exec(str);
			const next = rx.exec(str);
			let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
			if (ns === "*") ns = wildcardFirstSym;
			if (next === null) {
				o[ns] = null;
				return o;
			}
			if (o[ns] === null) return o;
			const { index } = next;
			const nextPath = `${str.substr(index, str.length - 1)}`;
			o[ns] = o[ns] || [];
			if (ns !== wildcardFirstSym && o[ns].length === 0) o[ns].push(...o[wildcardFirstSym] || []);
			if (ns === wildcardFirstSym) Object.keys(o).forEach(function(k) {
				if (o[k]) o[k].push(nextPath);
			});
			o[ns].push(nextPath);
			return o;
		}, {});
		const result = { [redactFmtSym]: fastRedact({
			paths,
			censor,
			serialize,
			strict
		}) };
		const topCensor = (...args) => {
			return typeof censor === "function" ? serialize(censor(...args)) : serialize(censor);
		};
		return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
			if (shape[k] === null) o[k] = (value) => topCensor(value, [k]);
			else {
				const wrappedCensor = typeof censor === "function" ? (value, path) => {
					return censor(value, [k, ...path]);
				} : censor;
				o[k] = fastRedact({
					paths: shape[k],
					censor: wrappedCensor,
					serialize,
					strict
				});
			}
			return o;
		}, result);
	}
	function handle(opts) {
		if (Array.isArray(opts)) {
			opts = {
				paths: opts,
				censor: CENSOR
			};
			validate(opts);
			return opts;
		}
		let { paths, censor = CENSOR, remove } = opts;
		if (Array.isArray(paths) === false) throw Error("pino – redact must contain an array of strings");
		if (remove === true) censor = void 0;
		validate({
			paths,
			censor
		});
		return {
			paths,
			censor
		};
	}
	module.exports = redaction;
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/time.js
var require_time = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var nullTime = () => "";
	var epochTime = () => `,"time":${Date.now()}`;
	var unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
	var isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
	module.exports = {
		nullTime,
		epochTime,
		unixTime,
		isoTime
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function tryStringify(o) {
		try {
			return JSON.stringify(o);
		} catch (e) {
			return "\"[Circular]\"";
		}
	}
	module.exports = format;
	function format(f, args, opts) {
		var ss = opts && opts.stringify || tryStringify;
		var offset = 1;
		if (typeof f === "object" && f !== null) {
			var len = args.length + offset;
			if (len === 1) return f;
			var objects = new Array(len);
			objects[0] = ss(f);
			for (var index = 1; index < len; index++) objects[index] = ss(args[index]);
			return objects.join(" ");
		}
		if (typeof f !== "string") return f;
		var argLen = args.length;
		if (argLen === 0) return f;
		var str = "";
		var a = 1 - offset;
		var lastPos = -1;
		var flen = f && f.length || 0;
		for (var i = 0; i < flen;) {
			if (f.charCodeAt(i) === 37 && i + 1 < flen) {
				lastPos = lastPos > -1 ? lastPos : 0;
				switch (f.charCodeAt(i + 1)) {
					case 100:
					case 102:
						if (a >= argLen) break;
						if (args[a] == null) break;
						if (lastPos < i) str += f.slice(lastPos, i);
						str += Number(args[a]);
						lastPos = i + 2;
						i++;
						break;
					case 105:
						if (a >= argLen) break;
						if (args[a] == null) break;
						if (lastPos < i) str += f.slice(lastPos, i);
						str += Math.floor(Number(args[a]));
						lastPos = i + 2;
						i++;
						break;
					case 79:
					case 111:
					case 106:
						if (a >= argLen) break;
						if (args[a] === void 0) break;
						if (lastPos < i) str += f.slice(lastPos, i);
						var type = typeof args[a];
						if (type === "string") {
							str += "'" + args[a] + "'";
							lastPos = i + 2;
							i++;
							break;
						}
						if (type === "function") {
							str += args[a].name || "<anonymous>";
							lastPos = i + 2;
							i++;
							break;
						}
						str += ss(args[a]);
						lastPos = i + 2;
						i++;
						break;
					case 115:
						if (a >= argLen) break;
						if (lastPos < i) str += f.slice(lastPos, i);
						str += String(args[a]);
						lastPos = i + 2;
						i++;
						break;
					case 37:
						if (lastPos < i) str += f.slice(lastPos, i);
						str += "%";
						lastPos = i + 2;
						i++;
						a--;
						break;
				}
				++a;
			}
			++i;
		}
		if (lastPos === -1) return f;
		else if (lastPos < flen) str += f.slice(lastPos);
		return str;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/atomic-sleep@1.0.0/node_modules/atomic-sleep/index.js
var require_atomic_sleep = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
		const nil = new Int32Array(new SharedArrayBuffer(4));
		function sleep(ms) {
			if ((ms > 0 && ms < Infinity) === false) {
				if (typeof ms !== "number" && typeof ms !== "bigint") throw TypeError("sleep: ms must be a number");
				throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
			}
			Atomics.wait(nil, 0, 0, Number(ms));
		}
		module.exports = sleep;
	} else {
		function sleep(ms) {
			if ((ms > 0 && ms < Infinity) === false) {
				if (typeof ms !== "number" && typeof ms !== "bigint") throw TypeError("sleep: ms must be a number");
				throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
			}
			const target = Date.now() + Number(ms);
			while (target > Date.now());
		}
		module.exports = sleep;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/sonic-boom@2.8.0/node_modules/sonic-boom/index.js
var require_sonic_boom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs = __require("fs");
	var EventEmitter$5 = __require("events");
	var inherits = __require("util").inherits;
	var path = __require("path");
	var sleep = require_atomic_sleep();
	var BUSY_WRITE_TIMEOUT = 100;
	var MAX_WRITE = 16 * 1024;
	function openFile(file, sonic) {
		sonic._opening = true;
		sonic._writing = true;
		sonic._asyncDrainScheduled = false;
		function fileOpened(err, fd) {
			if (err) {
				sonic._reopening = false;
				sonic._writing = false;
				sonic._opening = false;
				if (sonic.sync) process.nextTick(() => {
					if (sonic.listenerCount("error") > 0) sonic.emit("error", err);
				});
				else sonic.emit("error", err);
				return;
			}
			sonic.fd = fd;
			sonic.file = file;
			sonic._reopening = false;
			sonic._opening = false;
			sonic._writing = false;
			if (sonic.sync) process.nextTick(() => sonic.emit("ready"));
			else sonic.emit("ready");
			if (sonic._reopening) return;
			if (!sonic._writing && sonic._len > sonic.minLength && !sonic.destroyed) actualWrite(sonic);
		}
		const flags = sonic.append ? "a" : "w";
		const mode = sonic.mode;
		if (sonic.sync) try {
			if (sonic.mkdir) fs.mkdirSync(path.dirname(file), { recursive: true });
			fileOpened(null, fs.openSync(file, flags, mode));
		} catch (err) {
			fileOpened(err);
			throw err;
		}
		else if (sonic.mkdir) fs.mkdir(path.dirname(file), { recursive: true }, (err) => {
			if (err) return fileOpened(err);
			fs.open(file, flags, mode, fileOpened);
		});
		else fs.open(file, flags, mode, fileOpened);
	}
	function SonicBoom(opts) {
		if (!(this instanceof SonicBoom)) return new SonicBoom(opts);
		let { fd, dest, minLength, maxLength, maxWrite, sync, append = true, mode, mkdir, retryEAGAIN } = opts || {};
		fd = fd || dest;
		this._bufs = [];
		this._len = 0;
		this.fd = -1;
		this._writing = false;
		this._writingBuf = "";
		this._ending = false;
		this._reopening = false;
		this._asyncDrainScheduled = false;
		this._hwm = Math.max(minLength || 0, 16387);
		this.file = null;
		this.destroyed = false;
		this.minLength = minLength || 0;
		this.maxLength = maxLength || 0;
		this.maxWrite = maxWrite || MAX_WRITE;
		this.sync = sync || false;
		this.append = append || false;
		this.mode = mode;
		this.retryEAGAIN = retryEAGAIN || (() => true);
		this.mkdir = mkdir || false;
		if (typeof fd === "number") {
			this.fd = fd;
			process.nextTick(() => this.emit("ready"));
		} else if (typeof fd === "string") openFile(fd, this);
		else throw new Error("SonicBoom supports only file descriptors and files");
		if (this.minLength >= this.maxWrite) throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`);
		this.release = (err, n) => {
			if (err) {
				if (err.code === "EAGAIN" && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) if (this.sync) try {
					sleep(BUSY_WRITE_TIMEOUT);
					this.release(void 0, 0);
				} catch (err) {
					this.release(err);
				}
				else setTimeout(() => {
					fs.write(this.fd, this._writingBuf, "utf8", this.release);
				}, BUSY_WRITE_TIMEOUT);
				else {
					this._writing = false;
					this.emit("error", err);
				}
				return;
			}
			this.emit("write", n);
			this._len -= n;
			this._writingBuf = this._writingBuf.slice(n);
			if (this._writingBuf.length) {
				if (!this.sync) {
					fs.write(this.fd, this._writingBuf, "utf8", this.release);
					return;
				}
				try {
					do {
						const n = fs.writeSync(this.fd, this._writingBuf, "utf8");
						this._len -= n;
						this._writingBuf = this._writingBuf.slice(n);
					} while (this._writingBuf);
				} catch (err) {
					this.release(err);
					return;
				}
			}
			const len = this._len;
			if (this._reopening) {
				this._writing = false;
				this._reopening = false;
				this.reopen();
			} else if (len > this.minLength) actualWrite(this);
			else if (this._ending) if (len > 0) actualWrite(this);
			else {
				this._writing = false;
				actualClose(this);
			}
			else {
				this._writing = false;
				if (this.sync) {
					if (!this._asyncDrainScheduled) {
						this._asyncDrainScheduled = true;
						process.nextTick(emitDrain, this);
					}
				} else this.emit("drain");
			}
		};
		this.on("newListener", function(name) {
			if (name === "drain") this._asyncDrainScheduled = false;
		});
	}
	function emitDrain(sonic) {
		if (!(sonic.listenerCount("drain") > 0)) return;
		sonic._asyncDrainScheduled = false;
		sonic.emit("drain");
	}
	inherits(SonicBoom, EventEmitter$5);
	SonicBoom.prototype.write = function(data) {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		const len = this._len + data.length;
		const bufs = this._bufs;
		if (this.maxLength && len > this.maxLength) {
			this.emit("drop", data);
			return this._len < this._hwm;
		}
		if (bufs.length === 0 || bufs[bufs.length - 1].length + data.length > this.maxWrite) bufs.push("" + data);
		else bufs[bufs.length - 1] += data;
		this._len = len;
		if (!this._writing && this._len >= this.minLength) actualWrite(this);
		return this._len < this._hwm;
	};
	SonicBoom.prototype.flush = function() {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		if (this._writing || this.minLength <= 0) return;
		if (this._bufs.length === 0) this._bufs.push("");
		actualWrite(this);
	};
	SonicBoom.prototype.reopen = function(file) {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		if (this._opening) {
			this.once("ready", () => {
				this.reopen(file);
			});
			return;
		}
		if (this._ending) return;
		if (!this.file) throw new Error("Unable to reopen a file descriptor, you must pass a file to SonicBoom");
		this._reopening = true;
		if (this._writing) return;
		const fd = this.fd;
		this.once("ready", () => {
			if (fd !== this.fd) fs.close(fd, (err) => {
				if (err) return this.emit("error", err);
			});
		});
		openFile(file || this.file, this);
	};
	SonicBoom.prototype.end = function() {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		if (this._opening) {
			this.once("ready", () => {
				this.end();
			});
			return;
		}
		if (this._ending) return;
		this._ending = true;
		if (this._writing) return;
		if (this._len > 0 && this.fd >= 0) actualWrite(this);
		else actualClose(this);
	};
	SonicBoom.prototype.flushSync = function() {
		if (this.destroyed) throw new Error("SonicBoom destroyed");
		if (this.fd < 0) throw new Error("sonic boom is not ready yet");
		if (!this._writing && this._writingBuf.length > 0) {
			this._bufs.unshift(this._writingBuf);
			this._writingBuf = "";
		}
		while (this._bufs.length) {
			const buf = this._bufs[0];
			try {
				this._len -= fs.writeSync(this.fd, buf, "utf8");
				this._bufs.shift();
			} catch (err) {
				if (err.code !== "EAGAIN" || !this.retryEAGAIN(err, buf.length, this._len - buf.length)) throw err;
				sleep(BUSY_WRITE_TIMEOUT);
			}
		}
	};
	SonicBoom.prototype.destroy = function() {
		if (this.destroyed) return;
		actualClose(this);
	};
	function actualWrite(sonic) {
		const release = sonic.release;
		sonic._writing = true;
		sonic._writingBuf = sonic._writingBuf || sonic._bufs.shift() || "";
		if (sonic.sync) try {
			release(null, fs.writeSync(sonic.fd, sonic._writingBuf, "utf8"));
		} catch (err) {
			release(err);
		}
		else fs.write(sonic.fd, sonic._writingBuf, "utf8", release);
	}
	function actualClose(sonic) {
		if (sonic.fd === -1) {
			sonic.once("ready", actualClose.bind(null, sonic));
			return;
		}
		sonic.destroyed = true;
		sonic._bufs = [];
		if (sonic.fd !== 1 && sonic.fd !== 2) fs.close(sonic.fd, done);
		else setImmediate(done);
		function done(err) {
			if (err) {
				sonic.emit("error", err);
				return;
			}
			if (sonic._ending && !sonic._writing) sonic.emit("finish");
			sonic.emit("close");
		}
	}
	/**
	* These export configurations enable JS and TS developers
	* to consumer SonicBoom in whatever way best suits their needs.
	* Some examples of supported import syntax includes:
	* - `const SonicBoom = require('SonicBoom')`
	* - `const { SonicBoom } = require('SonicBoom')`
	* - `import * as SonicBoom from 'SonicBoom'`
	* - `import { SonicBoom } from 'SonicBoom'`
	* - `import SonicBoom from 'SonicBoom'`
	*/
	SonicBoom.SonicBoom = SonicBoom;
	SonicBoom.default = SonicBoom;
	module.exports = SonicBoom;
}));
//#endregion
//#region ../../node_modules/.pnpm/process-warning@1.0.0/node_modules/process-warning/index.js
var require_process_warning = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { format } = __require("util");
	function build() {
		const codes = {};
		const emitted = /* @__PURE__ */ new Map();
		function create(name, code, message) {
			if (!name) throw new Error("Warning name must not be empty");
			if (!code) throw new Error("Warning code must not be empty");
			if (!message) throw new Error("Warning message must not be empty");
			code = code.toUpperCase();
			if (codes[code] !== void 0) throw new Error(`The code '${code}' already exist`);
			function buildWarnOpts(a, b, c) {
				let formatted;
				if (a && b && c) formatted = format(message, a, b, c);
				else if (a && b) formatted = format(message, a, b);
				else if (a) formatted = format(message, a);
				else formatted = message;
				return {
					code,
					name,
					message: formatted
				};
			}
			emitted.set(code, false);
			codes[code] = buildWarnOpts;
			return codes[code];
		}
		function emit(code, a, b, c) {
			if (codes[code] === void 0) throw new Error(`The code '${code}' does not exist`);
			if (emitted.get(code) === true) return;
			emitted.set(code, true);
			const warning = codes[code](a, b, c);
			process.emitWarning(warning.message, warning.name, warning.code);
		}
		return {
			create,
			emit,
			emitted
		};
	}
	module.exports = build;
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/deprecations.js
var require_deprecations = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var warning = require_process_warning()();
	module.exports = warning;
	var warnName = "PinoWarning";
	warning.create(warnName, "PINODEP008", "prettyPrint is deprecated, look at https://github.com/pinojs/pino-pretty for alternatives.");
	warning.create(warnName, "PINODEP009", "The use of pino.final is discouraged in Node.js v14+ and not required. It will be removed in the next major version");
}));
//#endregion
//#region ../../node_modules/.pnpm/on-exit-leak-free@0.2.0/node_modules/on-exit-leak-free/index.js
var require_on_exit_leak_free = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function genWrap(wraps, ref, fn, event) {
		function wrap() {
			const obj = ref.deref();
			/* istanbul ignore else */
			if (obj !== void 0) fn(obj, event);
		}
		wraps[event] = wrap;
		process.once(event, wrap);
	}
	var registry = new FinalizationRegistry(clear);
	var map = /* @__PURE__ */ new WeakMap();
	function clear(wraps) {
		process.removeListener("exit", wraps.exit);
		process.removeListener("beforeExit", wraps.beforeExit);
	}
	function register(obj, fn) {
		if (obj === void 0) throw new Error("the object can't be undefined");
		const ref = new WeakRef(obj);
		const wraps = {};
		map.set(obj, wraps);
		registry.register(obj, wraps);
		genWrap(wraps, ref, fn, "exit");
		genWrap(wraps, ref, fn, "beforeExit");
	}
	function unregister(obj) {
		const wraps = map.get(obj);
		map.delete(obj);
		if (wraps) clear(wraps);
		registry.unregister(obj);
	}
	module.exports = {
		register,
		unregister
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/thread-stream@0.15.2/node_modules/thread-stream/lib/wait.js
var require_wait = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var MAX_TIMEOUT = 1e3;
	function wait(state, index, expected, timeout, done) {
		const max = Date.now() + timeout;
		let current = Atomics.load(state, index);
		if (current === expected) {
			done(null, "ok");
			return;
		}
		let prior = current;
		const check = (backoff) => {
			if (Date.now() > max) done(null, "timed-out");
			else setTimeout(() => {
				prior = current;
				current = Atomics.load(state, index);
				if (current === prior) check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
				else if (current === expected) done(null, "ok");
				else done(null, "not-equal");
			}, backoff);
		};
		check(1);
	}
	function waitDiff(state, index, expected, timeout, done) {
		const max = Date.now() + timeout;
		let current = Atomics.load(state, index);
		if (current !== expected) {
			done(null, "ok");
			return;
		}
		const check = (backoff) => {
			if (Date.now() > max) done(null, "timed-out");
			else setTimeout(() => {
				current = Atomics.load(state, index);
				if (current !== expected) done(null, "ok");
				else check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
			}, backoff);
		};
		check(1);
	}
	module.exports = {
		wait,
		waitDiff
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/thread-stream@0.15.2/node_modules/thread-stream/lib/indexes.js
var require_indexes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		WRITE_INDEX: 4,
		READ_INDEX: 8
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/thread-stream@0.15.2/node_modules/thread-stream/index.js
var require_thread_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EventEmitter: EventEmitter$4 } = __require("events");
	var { Worker } = __require("worker_threads");
	var { join: join$1 } = __require("path");
	var { pathToFileURL } = __require("url");
	var { wait } = require_wait();
	var { WRITE_INDEX, READ_INDEX } = require_indexes();
	var buffer = __require("buffer");
	var assert = __require("assert");
	var kImpl = Symbol("kImpl");
	var MAX_STRING = buffer.constants.MAX_STRING_LENGTH;
	var FakeWeakRef = class {
		constructor(value) {
			this._value = value;
		}
		deref() {
			return this._value;
		}
	};
	var FinalizationRegistry = global.FinalizationRegistry || class FakeFinalizationRegistry {
		register() {}
		unregister() {}
	};
	var WeakRef = global.WeakRef || FakeWeakRef;
	var registry = new FinalizationRegistry((worker) => {
		if (worker.exited) return;
		worker.terminate();
	});
	function createWorker(stream, opts) {
		const { filename, workerData } = opts;
		const worker = new Worker(("__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {})["thread-stream-worker"] || join$1(__dirname, "lib", "worker.js"), {
			...opts.workerOpts,
			workerData: {
				filename: filename.indexOf("file://") === 0 ? filename : pathToFileURL(filename).href,
				dataBuf: stream[kImpl].dataBuf,
				stateBuf: stream[kImpl].stateBuf,
				workerData
			}
		});
		worker.stream = new FakeWeakRef(stream);
		worker.on("message", onWorkerMessage);
		worker.on("exit", onWorkerExit);
		registry.register(stream, worker);
		return worker;
	}
	function drain(stream) {
		assert(!stream[kImpl].sync);
		if (stream[kImpl].needDrain) {
			stream[kImpl].needDrain = false;
			stream.emit("drain");
		}
	}
	function nextFlush(stream) {
		const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		let leftover = stream[kImpl].data.length - writeIndex;
		if (leftover > 0) {
			if (stream[kImpl].buf.length === 0) {
				stream[kImpl].flushing = false;
				if (stream[kImpl].ending) end(stream);
				else if (stream[kImpl].needDrain) process.nextTick(drain, stream);
				return;
			}
			let toWrite = stream[kImpl].buf.slice(0, leftover);
			let toWriteBytes = Buffer.byteLength(toWrite);
			if (toWriteBytes <= leftover) {
				stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
				write(stream, toWrite, nextFlush.bind(null, stream));
			} else stream.flush(() => {
				if (stream.destroyed) return;
				Atomics.store(stream[kImpl].state, READ_INDEX, 0);
				Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
				while (toWriteBytes > stream[kImpl].data.length) {
					leftover = leftover / 2;
					toWrite = stream[kImpl].buf.slice(0, leftover);
					toWriteBytes = Buffer.byteLength(toWrite);
				}
				stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
				write(stream, toWrite, nextFlush.bind(null, stream));
			});
		} else if (leftover === 0) {
			if (writeIndex === 0 && stream[kImpl].buf.length === 0) return;
			stream.flush(() => {
				Atomics.store(stream[kImpl].state, READ_INDEX, 0);
				Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
				nextFlush(stream);
			});
		} else throw new Error("overwritten");
	}
	function onWorkerMessage(msg) {
		const stream = this.stream.deref();
		if (stream === void 0) {
			this.exited = true;
			this.terminate();
			return;
		}
		switch (msg.code) {
			case "READY":
				this.stream = new WeakRef(stream);
				stream.flush(() => {
					stream[kImpl].ready = true;
					stream.emit("ready");
				});
				break;
			case "ERROR":
				destroy(stream, msg.err);
				break;
			default: throw new Error("this should not happen: " + msg.code);
		}
	}
	function onWorkerExit(code) {
		const stream = this.stream.deref();
		if (stream === void 0) return;
		registry.unregister(stream);
		stream.worker.exited = true;
		stream.worker.off("exit", onWorkerExit);
		destroy(stream, code !== 0 ? /* @__PURE__ */ new Error("The worker thread exited") : null);
	}
	var ThreadStream = class extends EventEmitter$4 {
		constructor(opts = {}) {
			super();
			if (opts.bufferSize < 4) throw new Error("bufferSize must at least fit a 4-byte utf-8 char");
			this[kImpl] = {};
			this[kImpl].stateBuf = new SharedArrayBuffer(128);
			this[kImpl].state = new Int32Array(this[kImpl].stateBuf);
			this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024);
			this[kImpl].data = Buffer.from(this[kImpl].dataBuf);
			this[kImpl].sync = opts.sync || false;
			this[kImpl].ending = false;
			this[kImpl].ended = false;
			this[kImpl].needDrain = false;
			this[kImpl].destroyed = false;
			this[kImpl].flushing = false;
			this[kImpl].ready = false;
			this[kImpl].finished = false;
			this[kImpl].errored = null;
			this[kImpl].closed = false;
			this[kImpl].buf = "";
			this.worker = createWorker(this, opts);
		}
		write(data) {
			if (this[kImpl].destroyed) throw new Error("the worker has exited");
			if (this[kImpl].ending) throw new Error("the worker is ending");
			if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) try {
				writeSync(this);
				this[kImpl].flushing = true;
			} catch (err) {
				destroy(this, err);
				return false;
			}
			this[kImpl].buf += data;
			if (this[kImpl].sync) try {
				writeSync(this);
				return true;
			} catch (err) {
				destroy(this, err);
				return false;
			}
			if (!this[kImpl].flushing) {
				this[kImpl].flushing = true;
				setImmediate(nextFlush, this);
			}
			this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0;
			return !this[kImpl].needDrain;
		}
		end() {
			if (this[kImpl].destroyed) return;
			this[kImpl].ending = true;
			end(this);
		}
		flush(cb) {
			if (this[kImpl].destroyed) {
				if (typeof cb === "function") process.nextTick(cb, /* @__PURE__ */ new Error("the worker has exited"));
				return;
			}
			const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX);
			wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
				if (err) {
					destroy(this, err);
					process.nextTick(cb, err);
					return;
				}
				if (res === "not-equal") {
					this.flush(cb);
					return;
				}
				process.nextTick(cb);
			});
		}
		flushSync() {
			if (this[kImpl].destroyed) return;
			writeSync(this);
			flushSync(this);
		}
		unref() {
			this.worker.unref();
		}
		ref() {
			this.worker.ref();
		}
		get ready() {
			return this[kImpl].ready;
		}
		get destroyed() {
			return this[kImpl].destroyed;
		}
		get closed() {
			return this[kImpl].closed;
		}
		get writable() {
			return !this[kImpl].destroyed && !this[kImpl].ending;
		}
		get writableEnded() {
			return this[kImpl].ending;
		}
		get writableFinished() {
			return this[kImpl].finished;
		}
		get writableNeedDrain() {
			return this[kImpl].needDrain;
		}
		get writableObjectMode() {
			return false;
		}
		get writableErrored() {
			return this[kImpl].errored;
		}
	};
	function destroy(stream, err) {
		if (stream[kImpl].destroyed) return;
		stream[kImpl].destroyed = true;
		if (err) {
			stream[kImpl].errored = err;
			stream.emit("error", err);
		}
		if (!stream.worker.exited) stream.worker.terminate().catch(() => {}).then(() => {
			stream[kImpl].closed = true;
			stream.emit("close");
		});
		else setImmediate(() => {
			stream[kImpl].closed = true;
			stream.emit("close");
		});
	}
	function write(stream, data, cb) {
		const current = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		const length = Buffer.byteLength(data);
		stream[kImpl].data.write(data, current);
		Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length);
		Atomics.notify(stream[kImpl].state, WRITE_INDEX);
		cb();
		return true;
	}
	function end(stream) {
		if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) return;
		stream[kImpl].ended = true;
		try {
			stream.flushSync();
			let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
			Atomics.store(stream[kImpl].state, WRITE_INDEX, -1);
			Atomics.notify(stream[kImpl].state, WRITE_INDEX);
			let spins = 0;
			while (readIndex !== -1) {
				Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
				readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
				if (readIndex === -2) throw new Error("end() failed");
				if (++spins === 10) throw new Error("end() took too long (10s)");
			}
			process.nextTick(() => {
				stream[kImpl].finished = true;
				stream.emit("finish");
			});
		} catch (err) {
			destroy(stream, err);
		}
	}
	function writeSync(stream) {
		const cb = () => {
			if (stream[kImpl].ending) end(stream);
			else if (stream[kImpl].needDrain) process.nextTick(drain, stream);
		};
		stream[kImpl].flushing = false;
		while (stream[kImpl].buf.length !== 0) {
			const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
			let leftover = stream[kImpl].data.length - writeIndex;
			if (leftover === 0) {
				flushSync(stream);
				Atomics.store(stream[kImpl].state, READ_INDEX, 0);
				Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
				continue;
			} else if (leftover < 0) throw new Error("overwritten");
			let toWrite = stream[kImpl].buf.slice(0, leftover);
			let toWriteBytes = Buffer.byteLength(toWrite);
			if (toWriteBytes <= leftover) {
				stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
				write(stream, toWrite, cb);
			} else {
				flushSync(stream);
				Atomics.store(stream[kImpl].state, READ_INDEX, 0);
				Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
				while (toWriteBytes > stream[kImpl].buf.length) {
					leftover = leftover / 2;
					toWrite = stream[kImpl].buf.slice(0, leftover);
					toWriteBytes = Buffer.byteLength(toWrite);
				}
				stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
				write(stream, toWrite, cb);
			}
		}
	}
	function flushSync(stream) {
		if (stream[kImpl].flushing) throw new Error("unable to flush while flushing");
		const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
		let spins = 0;
		while (true) {
			const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
			if (readIndex === -2) throw new Error("_flushSync failed");
			if (readIndex !== writeIndex) Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
			else break;
			if (++spins === 10) throw new Error("_flushSync took too long (10s)");
		}
	}
	module.exports = ThreadStream;
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/transport.js
var require_transport = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { createRequire } = __require("module");
	var getCallers = require_caller();
	var { join, isAbsolute } = __require("path");
	var sleep = require_atomic_sleep();
	var onExit;
	if (global.WeakRef && global.WeakMap && global.FinalizationRegistry) onExit = require_on_exit_leak_free();
	var ThreadStream = require_thread_stream();
	function setupOnExit(stream) {
		/* istanbul ignore next */
		if (onExit) {
			onExit.register(stream, autoEnd);
			stream.on("close", function() {
				onExit.unregister(stream);
			});
		} else {
			const fn = autoEnd.bind(null, stream);
			process.once("beforeExit", fn);
			process.once("exit", fn);
			stream.on("close", function() {
				process.removeListener("beforeExit", fn);
				process.removeListener("exit", fn);
			});
		}
	}
	function buildStream(filename, workerData, workerOpts) {
		const stream = new ThreadStream({
			filename,
			workerData,
			workerOpts
		});
		stream.on("ready", onReady);
		stream.on("close", function() {
			process.removeListener("exit", onExit);
		});
		process.on("exit", onExit);
		function onReady() {
			process.removeListener("exit", onExit);
			stream.unref();
			if (workerOpts.autoEnd !== false) setupOnExit(stream);
		}
		function onExit() {
			if (stream.closed) return;
			stream.flushSync();
			sleep(100);
			stream.end();
		}
		return stream;
	}
	function autoEnd(stream) {
		stream.ref();
		stream.flushSync();
		stream.end();
		stream.once("close", function() {
			stream.unref();
		});
	}
	function transport(fullOptions) {
		const { pipeline, targets, levels, options = {}, worker = {}, caller = getCallers() } = fullOptions;
		const callers = typeof caller === "string" ? [caller] : caller;
		const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
		let target = fullOptions.target;
		if (target && targets) throw new Error("only one of target or targets can be specified");
		if (targets) {
			target = bundlerOverrides["pino-worker"] || join(__dirname, "worker.js");
			options.targets = targets.map((dest) => {
				return {
					...dest,
					target: fixTarget(dest.target)
				};
			});
		} else if (pipeline) {
			target = bundlerOverrides["pino-pipeline-worker"] || join(__dirname, "worker-pipeline.js");
			options.targets = pipeline.map((dest) => {
				return {
					...dest,
					target: fixTarget(dest.target)
				};
			});
		}
		if (levels) options.levels = levels;
		return buildStream(fixTarget(target), options, worker);
		function fixTarget(origin) {
			origin = bundlerOverrides[origin] || origin;
			if (isAbsolute(origin) || origin.indexOf("file://") === 0) return origin;
			if (origin === "pino/file") return join(__dirname, "..", "file.js");
			let fixTarget;
			for (const filePath of callers) try {
				fixTarget = createRequire(filePath).resolve(origin);
				break;
			} catch (err) {
				continue;
			}
			if (!fixTarget) throw new Error(`unable to determine transport target for "${origin}"`);
			return fixTarget;
		}
	}
	module.exports = transport;
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/tools.js
var require_tools = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var format = require_quick_format_unescaped();
	var { mapHttpRequest, mapHttpResponse } = require_pino_std_serializers();
	var SonicBoom = require_sonic_boom();
	var warning = require_deprecations();
	var { lsCacheSym, chindingsSym, parsedChindingsSym, writeSym, serializersSym, formatOptsSym, endSym, stringifiersSym, stringifySym, stringifySafeSym, wildcardFirstSym, needsMetadataGsym, redactFmtSym, streamSym, nestedKeySym, formattersSym, messageKeySym, nestedKeyStrSym } = require_symbols();
	var { isMainThread } = __require("worker_threads");
	var transport = require_transport();
	function noop() {}
	function genLog(level, hook) {
		if (!hook) return LOG;
		return function hookWrappedLog(...args) {
			hook.call(this, args, LOG, level);
		};
		function LOG(o, ...n) {
			if (typeof o === "object") {
				let msg = o;
				if (o !== null) {
					if (o.method && o.headers && o.socket) o = mapHttpRequest(o);
					else if (typeof o.setHeader === "function") o = mapHttpResponse(o);
				}
				let formatParams;
				if (msg === null && n.length === 0) formatParams = [null];
				else {
					msg = n.shift();
					formatParams = n;
				}
				this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level);
			} else this[writeSym](null, format(o, n, this[formatOptsSym]), level);
		}
	}
	function asString(str) {
		let result = "";
		let last = 0;
		let found = false;
		let point = 255;
		const l = str.length;
		if (l > 100) return JSON.stringify(str);
		for (var i = 0; i < l && point >= 32; i++) {
			point = str.charCodeAt(i);
			if (point === 34 || point === 92) {
				result += str.slice(last, i) + "\\";
				last = i;
				found = true;
			}
		}
		if (!found) result = str;
		else result += str.slice(last);
		return point < 32 ? JSON.stringify(str) : "\"" + result + "\"";
	}
	function asJson(obj, msg, num, time) {
		const stringify = this[stringifySym];
		const stringifySafe = this[stringifySafeSym];
		const stringifiers = this[stringifiersSym];
		const end = this[endSym];
		const chindings = this[chindingsSym];
		const serializers = this[serializersSym];
		const formatters = this[formattersSym];
		const messageKey = this[messageKeySym];
		let data = this[lsCacheSym][num] + time;
		data = data + chindings;
		let value;
		if (formatters.log) obj = formatters.log(obj);
		const wildcardStringifier = stringifiers[wildcardFirstSym];
		let propStr = "";
		for (const key in obj) {
			value = obj[key];
			if (Object.prototype.hasOwnProperty.call(obj, key) && value !== void 0) {
				value = serializers[key] ? serializers[key](value) : value;
				const stringifier = stringifiers[key] || wildcardStringifier;
				switch (typeof value) {
					case "undefined":
					case "function": continue;
					case "number": if (Number.isFinite(value) === false) value = null;
					case "boolean":
						if (stringifier) value = stringifier(value);
						break;
					case "string":
						value = (stringifier || asString)(value);
						break;
					default: value = (stringifier || stringify)(value, stringifySafe);
				}
				if (value === void 0) continue;
				propStr += ",\"" + key + "\":" + value;
			}
		}
		let msgStr = "";
		if (msg !== void 0) {
			value = serializers[messageKey] ? serializers[messageKey](msg) : msg;
			const stringifier = stringifiers[messageKey] || wildcardStringifier;
			switch (typeof value) {
				case "function": break;
				case "number": if (Number.isFinite(value) === false) value = null;
				case "boolean":
					if (stringifier) value = stringifier(value);
					msgStr = ",\"" + messageKey + "\":" + value;
					break;
				case "string":
					value = (stringifier || asString)(value);
					msgStr = ",\"" + messageKey + "\":" + value;
					break;
				default:
					value = (stringifier || stringify)(value, stringifySafe);
					msgStr = ",\"" + messageKey + "\":" + value;
			}
		}
		if (this[nestedKeySym] && propStr) return data + this[nestedKeyStrSym] + propStr.slice(1) + "}" + msgStr + end;
		else return data + propStr + msgStr + end;
	}
	function asChindings(instance, bindings) {
		let value;
		let data = instance[chindingsSym];
		const stringify = instance[stringifySym];
		const stringifySafe = instance[stringifySafeSym];
		const stringifiers = instance[stringifiersSym];
		const wildcardStringifier = stringifiers[wildcardFirstSym];
		const serializers = instance[serializersSym];
		const formatter = instance[formattersSym].bindings;
		bindings = formatter(bindings);
		for (const key in bindings) {
			value = bindings[key];
			if ((key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels" && bindings.hasOwnProperty(key) && value !== void 0) === true) {
				value = serializers[key] ? serializers[key](value) : value;
				value = (stringifiers[key] || wildcardStringifier || stringify)(value, stringifySafe);
				if (value === void 0) continue;
				data += ",\"" + key + "\":" + value;
			}
		}
		return data;
	}
	function getPrettyStream(opts, prettifier, dest, instance) {
		if (prettifier && typeof prettifier === "function") {
			prettifier = prettifier.bind(instance);
			return prettifierMetaWrapper(prettifier(opts), dest, opts);
		}
		try {
			const prettyFactory = __require("pino-pretty").prettyFactory;
			prettyFactory.asMetaWrapper = prettifierMetaWrapper;
			return prettifierMetaWrapper(prettyFactory(opts), dest, opts);
		} catch (e) {
			if (e.message.startsWith("Cannot find module 'pino-pretty'")) throw Error("Missing `pino-pretty` module: `pino-pretty` must be installed separately");
			throw e;
		}
	}
	function prettifierMetaWrapper(pretty, dest, opts) {
		opts = Object.assign({ suppressFlushSyncWarning: false }, opts);
		let warned = false;
		return {
			[needsMetadataGsym]: true,
			lastLevel: 0,
			lastMsg: null,
			lastObj: null,
			lastLogger: null,
			flushSync() {
				if (opts.suppressFlushSyncWarning || warned) return;
				warned = true;
				setMetadataProps(dest, this);
				dest.write(pretty(Object.assign({
					level: 40,
					msg: "pino.final with prettyPrint does not support flushing",
					time: Date.now()
				}, this.chindings())));
			},
			chindings() {
				const lastLogger = this.lastLogger;
				let chindings = null;
				if (!lastLogger) return null;
				if (lastLogger.hasOwnProperty(parsedChindingsSym)) chindings = lastLogger[parsedChindingsSym];
				else {
					chindings = JSON.parse("{" + lastLogger[chindingsSym].substr(1) + "}");
					lastLogger[parsedChindingsSym] = chindings;
				}
				return chindings;
			},
			write(chunk) {
				const lastLogger = this.lastLogger;
				const chindings = this.chindings();
				let time = this.lastTime;
				/* istanbul ignore next */
				if (typeof time === "number") {} else if (time.match(/^\d+/)) time = parseInt(time);
				else time = time.slice(1, -1);
				const lastObj = this.lastObj;
				const lastMsg = this.lastMsg;
				const errorProps = null;
				const formatters = lastLogger[formattersSym];
				const formattedObj = formatters.log ? formatters.log(lastObj) : lastObj;
				const messageKey = lastLogger[messageKeySym];
				if (lastMsg && formattedObj && !Object.prototype.hasOwnProperty.call(formattedObj, messageKey)) formattedObj[messageKey] = lastMsg;
				const obj = Object.assign({
					level: this.lastLevel,
					time
				}, formattedObj, errorProps);
				const serializers = lastLogger[serializersSym];
				const keys = Object.keys(serializers);
				for (var i = 0; i < keys.length; i++) {
					const key = keys[i];
					if (obj[key] !== void 0) obj[key] = serializers[key](obj[key]);
				}
				for (const key in chindings) if (!obj.hasOwnProperty(key)) obj[key] = chindings[key];
				const redact = lastLogger[stringifiersSym][redactFmtSym];
				const formatted = pretty(typeof redact === "function" ? redact(obj) : obj);
				if (formatted === void 0) return;
				setMetadataProps(dest, this);
				dest.write(formatted);
			}
		};
	}
	function hasBeenTampered(stream) {
		return stream.write !== stream.constructor.prototype.write;
	}
	function buildSafeSonicBoom(opts) {
		const stream = new SonicBoom(opts);
		stream.on("error", filterBrokenPipe);
		if (!opts.sync && isMainThread) setupOnExit(stream);
		return stream;
		function filterBrokenPipe(err) {
			if (err.code === "EPIPE") {
				stream.write = noop;
				stream.end = noop;
				stream.flushSync = noop;
				stream.destroy = noop;
				return;
			}
			stream.removeListener("error", filterBrokenPipe);
			stream.emit("error", err);
		}
	}
	function setupOnExit(stream) {
		/* istanbul ignore next */
		if (global.WeakRef && global.WeakMap && global.FinalizationRegistry) {
			const onExit = require_on_exit_leak_free();
			onExit.register(stream, autoEnd);
			stream.on("close", function() {
				onExit.unregister(stream);
			});
		}
	}
	function autoEnd(stream, eventName) {
		/* istanbul ignore next */
		if (stream.destroyed) return;
		if (eventName === "beforeExit") {
			stream.flush();
			stream.on("drain", function() {
				stream.end();
			});
		} else stream.flushSync();
	}
	function createArgsNormalizer(defaultOptions) {
		return function normalizeArgs(instance, caller, opts = {}, stream) {
			if (typeof opts === "string") {
				stream = buildSafeSonicBoom({
					dest: opts,
					sync: true
				});
				opts = {};
			} else if (typeof stream === "string") {
				if (opts && opts.transport) throw Error("only one of option.transport or stream can be specified");
				stream = buildSafeSonicBoom({
					dest: stream,
					sync: true
				});
			} else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
				stream = opts;
				opts = {};
			} else if (opts.transport) {
				if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) throw Error("option.transport do not allow stream, please pass to option directly. e.g. pino(transport)");
				if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === "function") throw Error("option.transport.targets do not allow custom level formatters");
				let customLevels;
				if (opts.customLevels) customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels);
				stream = transport({
					caller,
					...opts.transport,
					levels: customLevels
				});
			}
			opts = Object.assign({}, defaultOptions, opts);
			opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers);
			opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters);
			if ("onTerminated" in opts) throw Error("The onTerminated option has been removed, use pino.final instead");
			if ("changeLevelName" in opts) {
				process.emitWarning("The changeLevelName option is deprecated and will be removed in v7. Use levelKey instead.", { code: "changeLevelName_deprecation" });
				opts.levelKey = opts.changeLevelName;
				delete opts.changeLevelName;
			}
			const { enabled, prettyPrint, prettifier, messageKey } = opts;
			if (enabled === false) opts.level = "silent";
			stream = stream || process.stdout;
			if (stream === process.stdout && stream.fd >= 0 && !hasBeenTampered(stream)) stream = buildSafeSonicBoom({
				fd: stream.fd,
				sync: true
			});
			if (prettyPrint) {
				warning.emit("PINODEP008");
				stream = getPrettyStream(Object.assign({ messageKey }, prettyPrint), prettifier, stream, instance);
			}
			return {
				opts,
				stream
			};
		};
	}
	function final(logger, handler) {
		if (Number(process.versions.node.split(".")[0]) >= 14) warning.emit("PINODEP009");
		if (typeof logger === "undefined" || typeof logger.child !== "function") throw Error("expected a pino logger instance");
		const hasHandler = typeof handler !== "undefined";
		if (hasHandler && typeof handler !== "function") throw Error("if supplied, the handler parameter should be a function");
		const stream = logger[streamSym];
		if (typeof stream.flushSync !== "function") throw Error("final requires a stream that has a flushSync method, such as pino.destination");
		const finalLogger = new Proxy(logger, { get: (logger, key) => {
			if (key in logger.levels.values) return (...args) => {
				logger[key](...args);
				stream.flushSync();
			};
			return logger[key];
		} });
		if (!hasHandler) {
			try {
				stream.flushSync();
			} catch {}
			return finalLogger;
		}
		return (err = null, ...args) => {
			try {
				stream.flushSync();
			} catch (e) {}
			return handler(err, finalLogger, ...args);
		};
	}
	function stringify(obj, stringifySafeFn) {
		try {
			return JSON.stringify(obj);
		} catch (_) {
			try {
				return (stringifySafeFn || this[stringifySafeSym])(obj);
			} catch (_) {
				return "\"[unable to serialize, circular reference is too complex to analyze]\"";
			}
		}
	}
	function buildFormatters(level, bindings, log) {
		return {
			level,
			bindings,
			log
		};
	}
	function setMetadataProps(dest, that) {
		if (dest[needsMetadataGsym] === true) {
			dest.lastLevel = that.lastLevel;
			dest.lastMsg = that.lastMsg;
			dest.lastObj = that.lastObj;
			dest.lastTime = that.lastTime;
			dest.lastLogger = that.lastLogger;
		}
	}
	/**
	* Convert a string integer file descriptor to a proper native integer
	* file descriptor.
	*
	* @param {string} destination The file descriptor string to attempt to convert.
	*
	* @returns {Number}
	*/
	function normalizeDestFileDescriptor(destination) {
		const fd = Number(destination);
		if (typeof destination === "string" && Number.isFinite(fd)) return fd;
		return destination;
	}
	module.exports = {
		noop,
		buildSafeSonicBoom,
		getPrettyStream,
		asChindings,
		asJson,
		genLog,
		createArgsNormalizer,
		final,
		stringify,
		buildFormatters,
		normalizeDestFileDescriptor
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/levels.js
var require_levels = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { lsCacheSym, levelValSym, useOnlyCustomLevelsSym, streamSym, formattersSym, hooksSym } = require_symbols();
	var { noop, genLog } = require_tools();
	var levels = {
		trace: 10,
		debug: 20,
		info: 30,
		warn: 40,
		error: 50,
		fatal: 60
	};
	var levelMethods = {
		fatal: (hook) => {
			const logFatal = genLog(levels.fatal, hook);
			return function(...args) {
				const stream = this[streamSym];
				logFatal.call(this, ...args);
				if (typeof stream.flushSync === "function") try {
					stream.flushSync();
				} catch (e) {}
			};
		},
		error: (hook) => genLog(levels.error, hook),
		warn: (hook) => genLog(levels.warn, hook),
		info: (hook) => genLog(levels.info, hook),
		debug: (hook) => genLog(levels.debug, hook),
		trace: (hook) => genLog(levels.trace, hook)
	};
	var nums = Object.keys(levels).reduce((o, k) => {
		o[levels[k]] = k;
		return o;
	}, {});
	var initialLsCache = Object.keys(nums).reduce((o, k) => {
		o[k] = "{\"level\":" + Number(k);
		return o;
	}, {});
	function genLsCache(instance) {
		const formatter = instance[formattersSym].level;
		const { labels } = instance.levels;
		const cache = {};
		for (const label in labels) {
			const level = formatter(labels[label], Number(label));
			cache[label] = JSON.stringify(level).slice(0, -1);
		}
		instance[lsCacheSym] = cache;
		return instance;
	}
	function isStandardLevel(level, useOnlyCustomLevels) {
		if (useOnlyCustomLevels) return false;
		switch (level) {
			case "fatal":
			case "error":
			case "warn":
			case "info":
			case "debug":
			case "trace": return true;
			default: return false;
		}
	}
	function setLevel(level) {
		const { labels, values } = this.levels;
		if (typeof level === "number") {
			if (labels[level] === void 0) throw Error("unknown level value" + level);
			level = labels[level];
		}
		if (values[level] === void 0) throw Error("unknown level " + level);
		const preLevelVal = this[levelValSym];
		const levelVal = this[levelValSym] = values[level];
		const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym];
		const hook = this[hooksSym].logMethod;
		for (const key in values) {
			if (levelVal > values[key]) {
				this[key] = noop;
				continue;
			}
			this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook);
		}
		this.emit("level-change", level, levelVal, labels[preLevelVal], preLevelVal);
	}
	function getLevel(level) {
		const { levels, levelVal } = this;
		return levels && levels.labels ? levels.labels[levelVal] : "";
	}
	function isLevelEnabled(logLevel) {
		const { values } = this.levels;
		const logLevelVal = values[logLevel];
		return logLevelVal !== void 0 && logLevelVal >= this[levelValSym];
	}
	function mappings(customLevels = null, useOnlyCustomLevels = false) {
		const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
			o[customLevels[k]] = k;
			return o;
		}, {}) : null;
		return {
			labels: Object.assign(Object.create(Object.prototype, { Infinity: { value: "silent" } }), useOnlyCustomLevels ? null : nums, customNums),
			values: Object.assign(Object.create(Object.prototype, { silent: { value: Infinity } }), useOnlyCustomLevels ? null : levels, customLevels)
		};
	}
	function assertDefaultLevelFound(defaultLevel, customLevels, useOnlyCustomLevels) {
		if (typeof defaultLevel === "number") {
			if (![].concat(Object.keys(customLevels || {}).map((key) => customLevels[key]), useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level), Infinity).includes(defaultLevel)) throw Error(`default level:${defaultLevel} must be included in custom levels`);
			return;
		}
		if (!(defaultLevel in Object.assign(Object.create(Object.prototype, { silent: { value: Infinity } }), useOnlyCustomLevels ? null : levels, customLevels))) throw Error(`default level:${defaultLevel} must be included in custom levels`);
	}
	function assertNoLevelCollisions(levels, customLevels) {
		const { labels, values } = levels;
		for (const k in customLevels) {
			if (k in values) throw Error("levels cannot be overridden");
			if (customLevels[k] in labels) throw Error("pre-existing level values cannot be used for new levels");
		}
	}
	module.exports = {
		initialLsCache,
		genLsCache,
		levelMethods,
		getLevel,
		setLevel,
		isLevelEnabled,
		mappings,
		levels,
		assertNoLevelCollisions,
		assertDefaultLevelFound
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/package.json
var package_exports = /* @__PURE__ */ __exportAll({
	author: () => author,
	bin: () => bin,
	browser: () => browser,
	bugs: () => bugs,
	contributors: () => contributors,
	default: () => package_default,
	dependencies: () => dependencies,
	description: () => description,
	devDependencies: () => devDependencies,
	files: () => files,
	homepage: () => homepage,
	keywords: () => keywords,
	license: () => "MIT",
	main: () => main,
	name: () => name,
	precommit: () => precommit,
	repository: () => repository,
	scripts: () => scripts,
	tsd: () => tsd,
	type: () => type,
	types: () => types,
	version: () => version$1
}), name, version$1, description, main, type, types, browser, files, scripts, bin, precommit, repository, keywords, author, contributors, bugs, homepage, devDependencies, dependencies, tsd, package_default;
var init_package = __esmMin((() => {
	name = "pino";
	version$1 = "7.11.0";
	description = "super fast, all natural json logger";
	main = "pino.js";
	type = "commonjs";
	types = "pino.d.ts";
	browser = "./browser.js";
	files = [
		"pino.js",
		"file.js",
		"pino.d.ts",
		"bin.js",
		"browser.js",
		"pretty.js",
		"usage.txt",
		"test",
		"docs",
		"example.js",
		"lib"
	];
	scripts = {
		"docs": "docsify serve",
		"browser-test": "airtap --local 8080 test/browser*test.js",
		"lint": "eslint .",
		"test": "npm run lint && npm run transpile && tap --ts && jest test/jest && npm run test-types",
		"test-ci": "npm run lint && npm run transpile && tap --ts --no-check-coverage --coverage-report=lcovonly && npm run test-types",
		"test-ci-pnpm": "pnpm run lint && npm run transpile && tap --ts --no-coverage --no-check-coverage && pnpm run test-types",
		"test-ci-yarn-pnp": "yarn run lint && npm run transpile && tap --ts --no-check-coverage --coverage-report=lcovonly",
		"test-types": "tsc && tsd && ts-node test/types/pino.ts",
		"transpile": "node ./test/fixtures/ts/transpile.cjs",
		"cov-ui": "tap --ts --coverage-report=html",
		"bench": "node benchmarks/utils/runbench all",
		"bench-basic": "node benchmarks/utils/runbench basic",
		"bench-object": "node benchmarks/utils/runbench object",
		"bench-deep-object": "node benchmarks/utils/runbench deep-object",
		"bench-multi-arg": "node benchmarks/utils/runbench multi-arg",
		"bench-longs-tring": "node benchmarks/utils/runbench long-string",
		"bench-child": "node benchmarks/utils/runbench child",
		"bench-child-child": "node benchmarks/utils/runbench child-child",
		"bench-child-creation": "node benchmarks/utils/runbench child-creation",
		"bench-formatters": "node benchmarks/utils/runbench formatters",
		"update-bench-doc": "node benchmarks/utils/generate-benchmark-doc > docs/benchmarks.md"
	};
	bin = { "pino": "./bin.js" };
	precommit = "test";
	repository = {
		"type": "git",
		"url": "git+https://github.com/pinojs/pino.git"
	};
	keywords = [
		"fast",
		"logger",
		"stream",
		"json"
	];
	author = "Matteo Collina <hello@matteocollina.com>";
	contributors = [
		"David Mark Clements <huperekchuno@googlemail.com>",
		"James Sumners <james.sumners@gmail.com>",
		"Thomas Watson Steen <w@tson.dk> (https://twitter.com/wa7son)"
	];
	bugs = { "url": "https://github.com/pinojs/pino/issues" };
	homepage = "http://getpino.io";
	devDependencies = {
		"@types/flush-write-stream": "^1.0.0",
		"@types/node": "^17.0.0",
		"@types/tap": "^15.0.6",
		"airtap": "4.0.4",
		"benchmark": "^2.1.4",
		"bole": "^4.0.0",
		"bunyan": "^1.8.14",
		"docsify-cli": "^4.4.1",
		"eslint": "^7.17.0",
		"eslint-config-standard": "^16.0.3",
		"eslint-plugin-import": "^2.22.1",
		"eslint-plugin-node": "^11.1.0",
		"eslint-plugin-promise": "^5.1.0",
		"execa": "^5.0.0",
		"fastbench": "^1.0.1",
		"flush-write-stream": "^2.0.0",
		"import-fresh": "^3.2.1",
		"jest": "^27.3.1",
		"log": "^6.0.0",
		"loglevel": "^1.6.7",
		"pino-pretty": "^v7.6.0",
		"pre-commit": "^1.2.2",
		"proxyquire": "^2.1.3",
		"pump": "^3.0.0",
		"rimraf": "^3.0.2",
		"semver": "^7.0.0",
		"split2": "^4.0.0",
		"steed": "^1.1.3",
		"strip-ansi": "^6.0.0",
		"tap": "^16.0.0",
		"tape": "^5.0.0",
		"through2": "^4.0.0",
		"ts-node": "^10.7.0",
		"tsd": "^0.20.0",
		"typescript": "^4.4.4",
		"winston": "^3.3.3"
	};
	dependencies = {
		"atomic-sleep": "^1.0.0",
		"fast-redact": "^3.0.0",
		"on-exit-leak-free": "^0.2.0",
		"pino-abstract-transport": "v0.5.0",
		"pino-std-serializers": "^4.0.0",
		"process-warning": "^1.0.0",
		"quick-format-unescaped": "^4.0.3",
		"real-require": "^0.1.0",
		"safe-stable-stringify": "^2.1.0",
		"sonic-boom": "^2.2.1",
		"thread-stream": "^0.15.1"
	};
	tsd = { "directory": "test/types" };
	package_default = {
		name,
		version: version$1,
		description,
		main,
		type,
		types,
		browser,
		files,
		scripts,
		bin,
		precommit,
		repository,
		keywords,
		author,
		contributors,
		license: "MIT",
		bugs,
		homepage,
		devDependencies,
		dependencies,
		tsd
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/meta.js
var require_meta = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { version } = (init_package(), __toCommonJS(package_exports).default);
	module.exports = { version };
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/proto.js
var require_proto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EventEmitter: EventEmitter$3 } = __require("events");
	var { lsCacheSym, levelValSym, setLevelSym, getLevelSym, chindingsSym, parsedChindingsSym, mixinSym, asJsonSym, writeSym, mixinMergeStrategySym, timeSym, timeSliceIndexSym, streamSym, serializersSym, formattersSym, useOnlyCustomLevelsSym, needsMetadataGsym, redactFmtSym, stringifySym, formatOptsSym, stringifiersSym } = require_symbols();
	var { getLevel, setLevel, isLevelEnabled, mappings, initialLsCache, genLsCache, assertNoLevelCollisions } = require_levels();
	var { asChindings, asJson, buildFormatters, stringify } = require_tools();
	var { version } = require_meta();
	var redaction = require_redaction();
	var prototype = {
		constructor: class Pino {},
		child,
		bindings,
		setBindings,
		flush,
		isLevelEnabled,
		version,
		get level() {
			return this[getLevelSym]();
		},
		set level(lvl) {
			this[setLevelSym](lvl);
		},
		get levelVal() {
			return this[levelValSym];
		},
		set levelVal(n) {
			throw Error("levelVal is read-only");
		},
		[lsCacheSym]: initialLsCache,
		[writeSym]: write,
		[asJsonSym]: asJson,
		[getLevelSym]: getLevel,
		[setLevelSym]: setLevel
	};
	Object.setPrototypeOf(prototype, EventEmitter$3.prototype);
	module.exports = function() {
		return Object.create(prototype);
	};
	var resetChildingsFormatter = (bindings) => bindings;
	function child(bindings, options) {
		if (!bindings) throw Error("missing bindings for child Pino");
		options = options || {};
		const serializers = this[serializersSym];
		const formatters = this[formattersSym];
		const instance = Object.create(this);
		if (options.hasOwnProperty("serializers") === true) {
			instance[serializersSym] = Object.create(null);
			for (const k in serializers) instance[serializersSym][k] = serializers[k];
			const parentSymbols = Object.getOwnPropertySymbols(serializers);
			for (var i = 0; i < parentSymbols.length; i++) {
				const ks = parentSymbols[i];
				instance[serializersSym][ks] = serializers[ks];
			}
			for (const bk in options.serializers) instance[serializersSym][bk] = options.serializers[bk];
			const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers);
			for (var bi = 0; bi < bindingsSymbols.length; bi++) {
				const bks = bindingsSymbols[bi];
				instance[serializersSym][bks] = options.serializers[bks];
			}
		} else instance[serializersSym] = serializers;
		if (options.hasOwnProperty("formatters")) {
			const { level, bindings: chindings, log } = options.formatters;
			instance[formattersSym] = buildFormatters(level || formatters.level, chindings || resetChildingsFormatter, log || formatters.log);
		} else instance[formattersSym] = buildFormatters(formatters.level, resetChildingsFormatter, formatters.log);
		if (options.hasOwnProperty("customLevels") === true) {
			assertNoLevelCollisions(this.levels, options.customLevels);
			instance.levels = mappings(options.customLevels, instance[useOnlyCustomLevelsSym]);
			genLsCache(instance);
		}
		if (typeof options.redact === "object" && options.redact !== null || Array.isArray(options.redact)) {
			instance.redact = options.redact;
			const stringifiers = redaction(instance.redact, stringify);
			const formatOpts = { stringify: stringifiers[redactFmtSym] };
			instance[stringifySym] = stringify;
			instance[stringifiersSym] = stringifiers;
			instance[formatOptsSym] = formatOpts;
		}
		instance[chindingsSym] = asChindings(instance, bindings);
		const childLevel = options.level || this.level;
		instance[setLevelSym](childLevel);
		return instance;
	}
	function bindings() {
		const chindingsJson = `{${this[chindingsSym].substr(1)}}`;
		const bindingsFromJson = JSON.parse(chindingsJson);
		delete bindingsFromJson.pid;
		delete bindingsFromJson.hostname;
		return bindingsFromJson;
	}
	function setBindings(newBindings) {
		const chindings = asChindings(this, newBindings);
		this[chindingsSym] = chindings;
		delete this[parsedChindingsSym];
	}
	/**
	* Default strategy for creating `mergeObject` from arguments and the result from `mixin()`.
	* Fields from `mergeObject` have higher priority in this strategy.
	*
	* @param {Object} mergeObject The object a user has supplied to the logging function.
	* @param {Object} mixinObject The result of the `mixin` method.
	* @return {Object}
	*/
	function defaultMixinMergeStrategy(mergeObject, mixinObject) {
		return Object.assign(mixinObject, mergeObject);
	}
	function write(_obj, msg, num) {
		const t = this[timeSym]();
		const mixin = this[mixinSym];
		const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy;
		let obj;
		if (_obj === void 0 || _obj === null) obj = {};
		else if (_obj instanceof Error) {
			obj = { err: _obj };
			if (msg === void 0) msg = _obj.message;
		} else {
			obj = _obj;
			if (msg === void 0 && _obj.err) msg = _obj.err.message;
		}
		if (mixin) obj = mixinMergeStrategy(obj, mixin(obj, num));
		const s = this[asJsonSym](obj, msg, num, t);
		const stream = this[streamSym];
		if (stream[needsMetadataGsym] === true) {
			stream.lastLevel = num;
			stream.lastObj = obj;
			stream.lastMsg = msg;
			stream.lastTime = t.slice(this[timeSliceIndexSym]);
			stream.lastLogger = this;
		}
		stream.write(s);
	}
	function noop() {}
	function flush() {
		const stream = this[streamSym];
		if ("flush" in stream) stream.flush(noop);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js
var require_safe_stable_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { hasOwnProperty } = Object.prototype;
	var stringify = configure();
	stringify.configure = configure;
	stringify.stringify = stringify;
	stringify.default = stringify;
	exports.stringify = stringify;
	exports.configure = configure;
	module.exports = stringify;
	var strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
	function strEscape(str) {
		if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) return `"${str}"`;
		return JSON.stringify(str);
	}
	function sort(array, comparator) {
		if (array.length > 200 || comparator) return array.sort(comparator);
		for (let i = 1; i < array.length; i++) {
			const currentValue = array[i];
			let position = i;
			while (position !== 0 && array[position - 1] > currentValue) {
				array[position] = array[position - 1];
				position--;
			}
			array[position] = currentValue;
		}
		return array;
	}
	var typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Object.getPrototypeOf(new Int8Array())), Symbol.toStringTag).get;
	function isTypedArrayWithEntries(value) {
		return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
	}
	function stringifyTypedArray(array, separator, maximumBreadth) {
		if (array.length < maximumBreadth) maximumBreadth = array.length;
		const whitespace = separator === "," ? "" : " ";
		let res = `"0":${whitespace}${array[0]}`;
		for (let i = 1; i < maximumBreadth; i++) res += `${separator}"${i}":${whitespace}${array[i]}`;
		return res;
	}
	function getCircularValueOption(options) {
		if (hasOwnProperty.call(options, "circularValue")) {
			const circularValue = options.circularValue;
			if (typeof circularValue === "string") return `"${circularValue}"`;
			if (circularValue == null) return circularValue;
			if (circularValue === Error || circularValue === TypeError) return { toString() {
				throw new TypeError("Converting circular structure to JSON");
			} };
			throw new TypeError("The \"circularValue\" argument must be of type string or the value null or undefined");
		}
		return "\"[Circular]\"";
	}
	function getDeterministicOption(options) {
		let value;
		if (hasOwnProperty.call(options, "deterministic")) {
			value = options.deterministic;
			if (typeof value !== "boolean" && typeof value !== "function") throw new TypeError("The \"deterministic\" argument must be of type boolean or comparator function");
		}
		return value === void 0 ? true : value;
	}
	function getBooleanOption(options, key) {
		let value;
		if (hasOwnProperty.call(options, key)) {
			value = options[key];
			if (typeof value !== "boolean") throw new TypeError(`The "${key}" argument must be of type boolean`);
		}
		return value === void 0 ? true : value;
	}
	function getPositiveIntegerOption(options, key) {
		let value;
		if (hasOwnProperty.call(options, key)) {
			value = options[key];
			if (typeof value !== "number") throw new TypeError(`The "${key}" argument must be of type number`);
			if (!Number.isInteger(value)) throw new TypeError(`The "${key}" argument must be an integer`);
			if (value < 1) throw new RangeError(`The "${key}" argument must be >= 1`);
		}
		return value === void 0 ? Infinity : value;
	}
	function getItemCount(number) {
		if (number === 1) return "1 item";
		return `${number} items`;
	}
	function getUniqueReplacerSet(replacerArray) {
		const replacerSet = /* @__PURE__ */ new Set();
		for (const value of replacerArray) if (typeof value === "string" || typeof value === "number") replacerSet.add(String(value));
		return replacerSet;
	}
	function getStrictOption(options) {
		if (hasOwnProperty.call(options, "strict")) {
			const value = options.strict;
			if (typeof value !== "boolean") throw new TypeError("The \"strict\" argument must be of type boolean");
			if (value) return (value) => {
				let message = `Object can not safely be stringified. Received type ${typeof value}`;
				if (typeof value !== "function") message += ` (${value.toString()})`;
				throw new Error(message);
			};
		}
	}
	function configure(options) {
		options = { ...options };
		const fail = getStrictOption(options);
		if (fail) {
			if (options.bigint === void 0) options.bigint = false;
			if (!("circularValue" in options)) options.circularValue = Error;
		}
		const circularValue = getCircularValueOption(options);
		const bigint = getBooleanOption(options, "bigint");
		const deterministic = getDeterministicOption(options);
		const comparator = typeof deterministic === "function" ? deterministic : void 0;
		const maximumDepth = getPositiveIntegerOption(options, "maximumDepth");
		const maximumBreadth = getPositiveIntegerOption(options, "maximumBreadth");
		function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
			let value = parent[key];
			if (typeof value === "object" && value !== null && typeof value.toJSON === "function") value = value.toJSON(key);
			value = replacer.call(parent, key, value);
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (stack.indexOf(value) !== -1) return circularValue;
					let res = "";
					let join = ",";
					const originalIndentation = indentation;
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						if (spacer !== "") {
							indentation += spacer;
							res += `\n${indentation}`;
							join = `,\n${indentation}`;
						}
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
							res += tmp !== void 0 ? tmp : "null";
							res += join;
						}
						const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						if (spacer !== "") res += `\n${originalIndentation}`;
						stack.pop();
						return `[${res}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					let whitespace = "";
					let separator = "";
					if (spacer !== "") {
						indentation += spacer;
						join = `,\n${indentation}`;
						whitespace = " ";
					}
					const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (deterministic && !isTypedArrayWithEntries(value)) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key = keys[i];
						const tmp = stringifyFnReplacer(key, value, stack, replacer, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key)}:${whitespace}${tmp}`;
							separator = join;
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
						separator = join;
					}
					if (spacer !== "" && separator.length > 1) res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
			if (typeof value === "object" && value !== null && typeof value.toJSON === "function") value = value.toJSON(key);
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (stack.indexOf(value) !== -1) return circularValue;
					const originalIndentation = indentation;
					let res = "";
					let join = ",";
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						if (spacer !== "") {
							indentation += spacer;
							res += `\n${indentation}`;
							join = `,\n${indentation}`;
						}
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
							res += tmp !== void 0 ? tmp : "null";
							res += join;
						}
						const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						if (spacer !== "") res += `\n${originalIndentation}`;
						stack.pop();
						return `[${res}]`;
					}
					stack.push(value);
					let whitespace = "";
					if (spacer !== "") {
						indentation += spacer;
						join = `,\n${indentation}`;
						whitespace = " ";
					}
					let separator = "";
					for (const key of replacer) {
						const tmp = stringifyArrayReplacer(key, value[key], stack, replacer, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key)}:${whitespace}${tmp}`;
							separator = join;
						}
					}
					if (spacer !== "" && separator.length > 1) res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifyIndent(key, value, stack, spacer, indentation) {
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (typeof value.toJSON === "function") {
						value = value.toJSON(key);
						if (typeof value !== "object") return stringifyIndent(key, value, stack, spacer, indentation);
						if (value === null) return "null";
					}
					if (stack.indexOf(value) !== -1) return circularValue;
					const originalIndentation = indentation;
					if (Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						indentation += spacer;
						let res = `\n${indentation}`;
						const join = `,\n${indentation}`;
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
							res += tmp !== void 0 ? tmp : "null";
							res += join;
						}
						const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
						}
						res += `\n${originalIndentation}`;
						stack.pop();
						return `[${res}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					indentation += spacer;
					const join = `,\n${indentation}`;
					let res = "";
					let separator = "";
					let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (isTypedArrayWithEntries(value)) {
						res += stringifyTypedArray(value, join, maximumBreadth);
						keys = keys.slice(value.length);
						maximumPropertiesToStringify -= value.length;
						separator = join;
					}
					if (deterministic) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key = keys[i];
						const tmp = stringifyIndent(key, value[key], stack, spacer, indentation);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key)}: ${tmp}`;
							separator = join;
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
						separator = join;
					}
					if (separator !== "") res = `\n${indentation}${res}\n${originalIndentation}`;
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringifySimple(key, value, stack) {
			switch (typeof value) {
				case "string": return strEscape(value);
				case "object": {
					if (value === null) return "null";
					if (typeof value.toJSON === "function") {
						value = value.toJSON(key);
						if (typeof value !== "object") return stringifySimple(key, value, stack);
						if (value === null) return "null";
					}
					if (stack.indexOf(value) !== -1) return circularValue;
					let res = "";
					const hasLength = value.length !== void 0;
					if (hasLength && Array.isArray(value)) {
						if (value.length === 0) return "[]";
						if (maximumDepth < stack.length + 1) return "\"[Array]\"";
						stack.push(value);
						const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
						let i = 0;
						for (; i < maximumValuesToStringify - 1; i++) {
							const tmp = stringifySimple(String(i), value[i], stack);
							res += tmp !== void 0 ? tmp : "null";
							res += ",";
						}
						const tmp = stringifySimple(String(i), value[i], stack);
						res += tmp !== void 0 ? tmp : "null";
						if (value.length - 1 > maximumBreadth) {
							const removedKeys = value.length - maximumBreadth - 1;
							res += `,"... ${getItemCount(removedKeys)} not stringified"`;
						}
						stack.pop();
						return `[${res}]`;
					}
					let keys = Object.keys(value);
					const keyLength = keys.length;
					if (keyLength === 0) return "{}";
					if (maximumDepth < stack.length + 1) return "\"[Object]\"";
					let separator = "";
					let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
					if (hasLength && isTypedArrayWithEntries(value)) {
						res += stringifyTypedArray(value, ",", maximumBreadth);
						keys = keys.slice(value.length);
						maximumPropertiesToStringify -= value.length;
						separator = ",";
					}
					if (deterministic) keys = sort(keys, comparator);
					stack.push(value);
					for (let i = 0; i < maximumPropertiesToStringify; i++) {
						const key = keys[i];
						const tmp = stringifySimple(key, value[key], stack);
						if (tmp !== void 0) {
							res += `${separator}${strEscape(key)}:${tmp}`;
							separator = ",";
						}
					}
					if (keyLength > maximumBreadth) {
						const removedKeys = keyLength - maximumBreadth;
						res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
					}
					stack.pop();
					return `{${res}}`;
				}
				case "number": return isFinite(value) ? String(value) : fail ? fail(value) : "null";
				case "boolean": return value === true ? "true" : "false";
				case "undefined": return;
				case "bigint": if (bigint) return String(value);
				default: return fail ? fail(value) : void 0;
			}
		}
		function stringify(value, replacer, space) {
			if (arguments.length > 1) {
				let spacer = "";
				if (typeof space === "number") spacer = " ".repeat(Math.min(space, 10));
				else if (typeof space === "string") spacer = space.slice(0, 10);
				if (replacer != null) {
					if (typeof replacer === "function") return stringifyFnReplacer("", { "": value }, [], replacer, spacer, "");
					if (Array.isArray(replacer)) return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
				}
				if (spacer.length !== 0) return stringifyIndent("", value, [], spacer, "");
			}
			return stringifySimple("", value, []);
		}
		return stringify;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/pino@7.11.0/node_modules/pino/lib/multistream.js
var require_multistream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var metadata = Symbol.for("pino.metadata");
	var { levels } = require_levels();
	var defaultLevels = Object.create(levels);
	defaultLevels.silent = Infinity;
	var DEFAULT_INFO_LEVEL = levels.info;
	function multistream(streamsArray, opts) {
		let counter = 0;
		streamsArray = streamsArray || [];
		opts = opts || { dedupe: false };
		let levels = defaultLevels;
		if (opts.levels && typeof opts.levels === "object") levels = opts.levels;
		const res = {
			write,
			add,
			flushSync,
			end,
			minLevel: 0,
			streams: [],
			clone,
			[metadata]: true
		};
		if (Array.isArray(streamsArray)) streamsArray.forEach(add, res);
		else add.call(res, streamsArray);
		streamsArray = null;
		return res;
		function write(data) {
			let dest;
			const level = this.lastLevel;
			const { streams } = this;
			let stream;
			for (let i = 0; i < streams.length; i++) {
				dest = streams[i];
				if (dest.level <= level) {
					stream = dest.stream;
					if (stream[metadata]) {
						const { lastTime, lastMsg, lastObj, lastLogger } = this;
						stream.lastLevel = level;
						stream.lastTime = lastTime;
						stream.lastMsg = lastMsg;
						stream.lastObj = lastObj;
						stream.lastLogger = lastLogger;
					}
					if (!opts.dedupe || dest.level === level) stream.write(data);
				} else break;
			}
		}
		function flushSync() {
			for (const { stream } of this.streams) if (typeof stream.flushSync === "function") stream.flushSync();
		}
		function add(dest) {
			if (!dest) return res;
			const isStream = typeof dest.write === "function" || dest.stream;
			const stream_ = dest.write ? dest : dest.stream;
			if (!isStream) throw Error("stream object needs to implement either StreamEntry or DestinationStream interface");
			const { streams } = this;
			let level;
			if (typeof dest.levelVal === "number") level = dest.levelVal;
			else if (typeof dest.level === "string") level = levels[dest.level];
			else if (typeof dest.level === "number") level = dest.level;
			else level = DEFAULT_INFO_LEVEL;
			const dest_ = {
				stream: stream_,
				level,
				levelVal: void 0,
				id: counter++
			};
			streams.unshift(dest_);
			streams.sort(compareByLevel);
			this.minLevel = streams[0].level;
			return res;
		}
		function end() {
			for (const { stream } of this.streams) {
				if (typeof stream.flushSync === "function") stream.flushSync();
				stream.end();
			}
		}
		function clone(level) {
			const streams = new Array(this.streams.length);
			for (let i = 0; i < streams.length; i++) streams[i] = {
				level,
				stream: this.streams[i].stream
			};
			return {
				write,
				add,
				minLevel: level,
				streams,
				clone,
				flushSync,
				[metadata]: true
			};
		}
	}
	function compareByLevel(a, b) {
		return a.level - b.level;
	}
	module.exports = multistream;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+logger@2.1.2/node_modules/@walletconnect/logger/dist/index.es.js
var import_pino = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var os = __require("os");
	var stdSerializers = require_pino_std_serializers();
	var caller = require_caller();
	var redaction = require_redaction();
	var time = require_time();
	var proto = require_proto();
	var symbols = require_symbols();
	var { configure } = require_safe_stable_stringify();
	var { assertDefaultLevelFound, mappings, genLsCache, levels } = require_levels();
	var { createArgsNormalizer, asChindings, final, buildSafeSonicBoom, buildFormatters, stringify, normalizeDestFileDescriptor, noop } = require_tools();
	var { version } = require_meta();
	var { chindingsSym, redactFmtSym, serializersSym, timeSym, timeSliceIndexSym, streamSym, stringifySym, stringifySafeSym, stringifiersSym, setLevelSym, endSym, formatOptsSym, messageKeySym, nestedKeySym, mixinSym, useOnlyCustomLevelsSym, formattersSym, hooksSym, nestedKeyStrSym, mixinMergeStrategySym } = symbols;
	var { epochTime, nullTime } = time;
	var { pid } = process;
	var hostname = os.hostname();
	var defaultErrorSerializer = stdSerializers.err;
	var normalize = createArgsNormalizer({
		level: "info",
		levels,
		messageKey: "msg",
		nestedKey: null,
		enabled: true,
		prettyPrint: false,
		base: {
			pid,
			hostname
		},
		serializers: Object.assign(Object.create(null), { err: defaultErrorSerializer }),
		formatters: Object.assign(Object.create(null), {
			bindings(bindings) {
				return bindings;
			},
			level(label, number) {
				return { level: number };
			}
		}),
		hooks: { logMethod: void 0 },
		timestamp: epochTime,
		name: void 0,
		redact: null,
		customLevels: null,
		useOnlyCustomLevels: false,
		depthLimit: 5,
		edgeLimit: 100
	});
	var serializers = Object.assign(Object.create(null), stdSerializers);
	function pino(...args) {
		const instance = {};
		const { opts, stream } = normalize(instance, caller(), ...args);
		const { redact, crlf, serializers, timestamp, messageKey, nestedKey, base, name, level, customLevels, mixin, mixinMergeStrategy, useOnlyCustomLevels, formatters, hooks, depthLimit, edgeLimit } = opts;
		const stringifySafe = configure({
			maximumDepth: depthLimit,
			maximumBreadth: edgeLimit
		});
		const allFormatters = buildFormatters(formatters.level, formatters.bindings, formatters.log);
		const stringifiers = redact ? redaction(redact, stringify) : {};
		const stringifyFn = stringify.bind({ [stringifySafeSym]: stringifySafe });
		const formatOpts = redact ? { stringify: stringifiers[redactFmtSym] } : { stringify: stringifyFn };
		const end = "}" + (crlf ? "\r\n" : "\n");
		const coreChindings = asChindings.bind(null, {
			[chindingsSym]: "",
			[serializersSym]: serializers,
			[stringifiersSym]: stringifiers,
			[stringifySym]: stringify,
			[stringifySafeSym]: stringifySafe,
			[formattersSym]: allFormatters
		});
		let chindings = "";
		if (base !== null) if (name === void 0) chindings = coreChindings(base);
		else chindings = coreChindings(Object.assign({}, base, { name }));
		const time = timestamp instanceof Function ? timestamp : timestamp ? epochTime : nullTime;
		const timeSliceIndex = time().indexOf(":") + 1;
		if (useOnlyCustomLevels && !customLevels) throw Error("customLevels is required if useOnlyCustomLevels is set true");
		if (mixin && typeof mixin !== "function") throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
		assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
		const levels = mappings(customLevels, useOnlyCustomLevels);
		Object.assign(instance, {
			levels,
			[useOnlyCustomLevelsSym]: useOnlyCustomLevels,
			[streamSym]: stream,
			[timeSym]: time,
			[timeSliceIndexSym]: timeSliceIndex,
			[stringifySym]: stringify,
			[stringifySafeSym]: stringifySafe,
			[stringifiersSym]: stringifiers,
			[endSym]: end,
			[formatOptsSym]: formatOpts,
			[messageKeySym]: messageKey,
			[nestedKeySym]: nestedKey,
			[nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : "",
			[serializersSym]: serializers,
			[mixinSym]: mixin,
			[mixinMergeStrategySym]: mixinMergeStrategy,
			[chindingsSym]: chindings,
			[formattersSym]: allFormatters,
			[hooksSym]: hooks,
			silent: noop
		});
		Object.setPrototypeOf(instance, proto());
		genLsCache(instance);
		instance[setLevelSym](level);
		return instance;
	}
	module.exports = pino;
	module.exports.destination = (dest = process.stdout.fd) => {
		if (typeof dest === "object") {
			dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd);
			return buildSafeSonicBoom(dest);
		} else return buildSafeSonicBoom({
			dest: normalizeDestFileDescriptor(dest),
			minLength: 0,
			sync: true
		});
	};
	module.exports.transport = require_transport();
	module.exports.multistream = require_multistream();
	module.exports.final = final;
	module.exports.levels = mappings();
	module.exports.stdSerializers = serializers;
	module.exports.stdTimeFunctions = Object.assign({}, time);
	module.exports.symbols = symbols;
	module.exports.version = version;
	module.exports.default = pino;
	module.exports.pino = pino;
})))());
var c$2 = { level: "info" }, n$1 = "custom_context", l = 1e3 * 1024;
var O$2 = class {
	constructor(e) {
		this.nodeValue = e, this.sizeInBytes = new TextEncoder().encode(this.nodeValue).length, this.next = null;
	}
	get value() {
		return this.nodeValue;
	}
	get size() {
		return this.sizeInBytes;
	}
};
var d$2 = class {
	constructor(e) {
		this.head = null, this.tail = null, this.lengthInNodes = 0, this.maxSizeInBytes = e, this.sizeInBytes = 0;
	}
	append(e) {
		const t = new O$2(e);
		if (t.size > this.maxSizeInBytes) throw new Error(`[LinkedList] Value too big to insert into list: ${e} with size ${t.size}`);
		for (; this.size + t.size > this.maxSizeInBytes;) this.shift();
		this.head ? (this.tail && (this.tail.next = t), this.tail = t) : (this.head = t, this.tail = t), this.lengthInNodes++, this.sizeInBytes += t.size;
	}
	shift() {
		if (!this.head) return;
		const e = this.head;
		this.head = this.head.next, this.head || (this.tail = null), this.lengthInNodes--, this.sizeInBytes -= e.size;
	}
	toArray() {
		const e = [];
		let t = this.head;
		for (; t !== null;) e.push(t.value), t = t.next;
		return e;
	}
	get length() {
		return this.lengthInNodes;
	}
	get size() {
		return this.sizeInBytes;
	}
	toOrderedArray() {
		return Array.from(this);
	}
	[Symbol.iterator]() {
		let e = this.head;
		return { next: () => {
			if (!e) return {
				done: !0,
				value: null
			};
			const t = e.value;
			return e = e.next, {
				done: !1,
				value: t
			};
		} };
	}
};
var L$1 = class {
	constructor(e, t = l) {
		this.level = e ?? "error", this.levelValue = import_pino.levels.values[this.level], this.MAX_LOG_SIZE_IN_BYTES = t, this.logs = new d$2(this.MAX_LOG_SIZE_IN_BYTES);
	}
	forwardToConsole(e, t) {
		t === import_pino.levels.values.error ? console.error(e) : t === import_pino.levels.values.warn ? console.warn(e) : t === import_pino.levels.values.debug ? console.debug(e) : t === import_pino.levels.values.trace ? console.trace(e) : console.log(e);
	}
	appendToLogs(e) {
		this.logs.append(safeJsonStringify({
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			log: e
		}));
		const t = typeof e == "string" ? JSON.parse(e).level : e.level;
		t >= this.levelValue && this.forwardToConsole(e, t);
	}
	getLogs() {
		return this.logs;
	}
	clearLogs() {
		this.logs = new d$2(this.MAX_LOG_SIZE_IN_BYTES);
	}
	getLogArray() {
		return Array.from(this.logs);
	}
	logsToBlob(e) {
		const t = this.getLogArray();
		return t.push(safeJsonStringify({ extraMetadata: e })), new Blob(t, { type: "application/json" });
	}
};
var m$1 = class {
	constructor(e, t = l) {
		this.baseChunkLogger = new L$1(e, t);
	}
	write(e) {
		this.baseChunkLogger.appendToLogs(e);
	}
	getLogs() {
		return this.baseChunkLogger.getLogs();
	}
	clearLogs() {
		this.baseChunkLogger.clearLogs();
	}
	getLogArray() {
		return this.baseChunkLogger.getLogArray();
	}
	logsToBlob(e) {
		return this.baseChunkLogger.logsToBlob(e);
	}
	downloadLogsBlobInBrowser(e) {
		const t = URL.createObjectURL(this.logsToBlob(e)), o = document.createElement("a");
		o.href = t, o.download = `walletconnect-logs-${(/* @__PURE__ */ new Date()).toISOString()}.txt`, document.body.appendChild(o), o.click(), document.body.removeChild(o), URL.revokeObjectURL(t);
	}
};
var B$1 = class {
	constructor(e, t = l) {
		this.baseChunkLogger = new L$1(e, t);
	}
	write(e) {
		this.baseChunkLogger.appendToLogs(e);
	}
	getLogs() {
		return this.baseChunkLogger.getLogs();
	}
	clearLogs() {
		this.baseChunkLogger.clearLogs();
	}
	getLogArray() {
		return this.baseChunkLogger.getLogArray();
	}
	logsToBlob(e) {
		return this.baseChunkLogger.logsToBlob(e);
	}
};
var x$1 = Object.defineProperty, S$2 = Object.defineProperties, _ = Object.getOwnPropertyDescriptors, p$2 = Object.getOwnPropertySymbols, T$1 = Object.prototype.hasOwnProperty, z$1 = Object.prototype.propertyIsEnumerable, f$4 = (r, e, t) => e in r ? x$1(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, i$1 = (r, e) => {
	for (var t in e || (e = {})) T$1.call(e, t) && f$4(r, t, e[t]);
	if (p$2) for (var t of p$2(e)) z$1.call(e, t) && f$4(r, t, e[t]);
	return r;
}, g$1 = (r, e) => S$2(r, _(e));
function k$2(r) {
	return g$1(i$1({}, r), { level: r?.level || c$2.level });
}
function v$3(r, e = n$1) {
	return r[e] || "";
}
function b$2(r, e, t = n$1) {
	return r[t] = e, r;
}
function y$2(r, e = n$1) {
	let t = "";
	return typeof r.bindings > "u" ? t = v$3(r, e) : t = r.bindings().context || "", t;
}
function w$2(r, e, t = n$1) {
	const o = y$2(r, t);
	return o.trim() ? `${o}/${e}` : e;
}
function E$1(r, e, t = n$1) {
	const o = w$2(r, e, t);
	return b$2(r.child({ context: o }), o, t);
}
function C$1(r) {
	var e, t;
	const o = new m$1((e = r.opts) == null ? void 0 : e.level, r.maxSizeInBytes);
	return {
		logger: (0, import_pino.default)(g$1(i$1({}, r.opts), {
			level: "trace",
			browser: g$1(i$1({}, (t = r.opts) == null ? void 0 : t.browser), { write: (a) => o.write(a) })
		})),
		chunkLoggerController: o
	};
}
function I$2(r) {
	var e;
	const t = new B$1((e = r.opts) == null ? void 0 : e.level, r.maxSizeInBytes);
	return {
		logger: (0, import_pino.default)(g$1(i$1({}, r.opts), { level: "trace" }), t),
		chunkLoggerController: t
	};
}
function A$2(r) {
	return typeof r.loggerOverride < "u" && typeof r.loggerOverride != "string" ? {
		logger: r.loggerOverride,
		chunkLoggerController: null
	} : typeof window < "u" ? C$1(r) : I$2(r);
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+types@2.21.5_db0@0.3.4/node_modules/@walletconnect/types/dist/index.es.js
var a = Object.defineProperty, u = (e, s, r) => s in e ? a(e, s, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: r
}) : e[s] = r, c$1 = (e, s, r) => u(e, typeof s != "symbol" ? s + "" : s, r);
var h$1 = class extends IEvents {
	constructor(s) {
		super(), this.opts = s, c$1(this, "protocol", "wc"), c$1(this, "version", 2);
	}
};
var p$1 = Object.defineProperty, b$1 = (e, s, r) => s in e ? p$1(e, s, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: r
}) : e[s] = r, v$2 = (e, s, r) => b$1(e, typeof s != "symbol" ? s + "" : s, r);
var I$1 = class extends IEvents {
	constructor(s, r) {
		super(), this.core = s, this.logger = r, v$2(this, "records", /* @__PURE__ */ new Map());
	}
};
var y$1 = class {
	constructor(s, r) {
		this.logger = s, this.core = r;
	}
};
var m = class extends IEvents {
	constructor(s, r) {
		super(), this.relayer = s, this.logger = r;
	}
};
var d$1 = class extends IEvents {
	constructor(s) {
		super();
	}
};
var f$3 = class {
	constructor(s, r, t, q) {
		this.core = s, this.logger = r, this.name = t;
	}
};
var P$1 = class extends IEvents {
	constructor(s, r) {
		super(), this.relayer = s, this.logger = r;
	}
};
var S$1 = class extends IEvents {
	constructor(s, r) {
		super(), this.core = s, this.logger = r;
	}
};
var M$1 = class {
	constructor(s, r, t) {
		this.core = s, this.logger = r, this.store = t;
	}
};
var O$1 = class {
	constructor(s, r) {
		this.projectId = s, this.logger = r;
	}
};
var R$1 = class {
	constructor(s, r, t) {
		this.core = s, this.logger = r, this.telemetryEnabled = t;
	}
};
var T = Object.defineProperty, k$1 = (e, s, r) => s in e ? T(e, s, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: r
}) : e[s] = r, i = (e, s, r) => k$1(e, typeof s != "symbol" ? s + "" : s, r);
var J = class {
	constructor(s) {
		this.opts = s, i(this, "protocol", "wc"), i(this, "version", 2);
	}
};
var V$1 = class {
	constructor(s) {
		this.client = s;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-utils@1.0.8/node_modules/@walletconnect/jsonrpc-utils/dist/esm/constants.js
var PARSE_ERROR = "PARSE_ERROR";
var INVALID_REQUEST = "INVALID_REQUEST";
var METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
var INVALID_PARAMS = "INVALID_PARAMS";
var INTERNAL_ERROR = "INTERNAL_ERROR";
var SERVER_ERROR = "SERVER_ERROR";
var RESERVED_ERROR_CODES = [
	-32700,
	-32600,
	-32601,
	-32602,
	-32603
];
var SERVER_ERROR_CODE_RANGE = [-32e3, -32099];
var STANDARD_ERROR_MAP = {
	[PARSE_ERROR]: {
		code: -32700,
		message: "Parse error"
	},
	[INVALID_REQUEST]: {
		code: -32600,
		message: "Invalid Request"
	},
	[METHOD_NOT_FOUND]: {
		code: -32601,
		message: "Method not found"
	},
	[INVALID_PARAMS]: {
		code: -32602,
		message: "Invalid params"
	},
	[INTERNAL_ERROR]: {
		code: -32603,
		message: "Internal error"
	},
	[SERVER_ERROR]: {
		code: -32e3,
		message: "Server error"
	}
};
var DEFAULT_ERROR = SERVER_ERROR;
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-utils@1.0.8/node_modules/@walletconnect/jsonrpc-utils/dist/esm/error.js
function isServerErrorCode(code) {
	return code <= SERVER_ERROR_CODE_RANGE[0] && code >= SERVER_ERROR_CODE_RANGE[1];
}
function isReservedErrorCode(code) {
	return RESERVED_ERROR_CODES.includes(code);
}
function isValidErrorCode(code) {
	return typeof code === "number";
}
function getError(type) {
	if (!Object.keys(STANDARD_ERROR_MAP).includes(type)) return STANDARD_ERROR_MAP[DEFAULT_ERROR];
	return STANDARD_ERROR_MAP[type];
}
function getErrorByCode(code) {
	const match = Object.values(STANDARD_ERROR_MAP).find((e) => e.code === code);
	if (!match) return STANDARD_ERROR_MAP[DEFAULT_ERROR];
	return match;
}
function validateJsonRpcError(response) {
	if (typeof response.error.code === "undefined") return {
		valid: false,
		error: "Missing code for JSON-RPC error"
	};
	if (typeof response.error.message === "undefined") return {
		valid: false,
		error: "Missing message for JSON-RPC error"
	};
	if (!isValidErrorCode(response.error.code)) return {
		valid: false,
		error: `Invalid error code type for JSON-RPC: ${response.error.code}`
	};
	if (isReservedErrorCode(response.error.code)) {
		const error = getErrorByCode(response.error.code);
		if (error.message !== STANDARD_ERROR_MAP["SERVER_ERROR"].message && response.error.message === error.message) return {
			valid: false,
			error: `Invalid error code message for JSON-RPC: ${response.error.code}`
		};
	}
	return { valid: true };
}
function parseConnectionError(e, url, type) {
	return e.message.includes("getaddrinfo ENOTFOUND") || e.message.includes("connect ECONNREFUSED") ? /* @__PURE__ */ new Error(`Unavailable ${type} RPC url at ${url}`) : e;
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+environment@1.0.1/node_modules/@walletconnect/environment/dist/cjs/crypto.js
var require_crypto = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isBrowserCryptoAvailable = exports.getSubtleCrypto = exports.getBrowerCrypto = void 0;
	function getBrowerCrypto() {
		return (global === null || global === void 0 ? void 0 : global.crypto) || (global === null || global === void 0 ? void 0 : global.msCrypto) || {};
	}
	exports.getBrowerCrypto = getBrowerCrypto;
	function getSubtleCrypto() {
		const browserCrypto = getBrowerCrypto();
		return browserCrypto.subtle || browserCrypto.webkitSubtle;
	}
	exports.getSubtleCrypto = getSubtleCrypto;
	function isBrowserCryptoAvailable() {
		return !!getBrowerCrypto() && !!getSubtleCrypto();
	}
	exports.isBrowserCryptoAvailable = isBrowserCryptoAvailable;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+environment@1.0.1/node_modules/@walletconnect/environment/dist/cjs/env.js
var require_env = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isBrowser = exports.isNode = exports.isReactNative = void 0;
	function isReactNative() {
		return typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative";
	}
	exports.isReactNative = isReactNative;
	function isNode() {
		return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
	}
	exports.isNode = isNode;
	function isBrowser() {
		return !isReactNative() && !isNode();
	}
	exports.isBrowser = isBrowser;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+environment@1.0.1/node_modules/@walletconnect/environment/dist/cjs/index.js
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1 = __require("tslib");
	tslib_1.__exportStar(require_crypto(), exports);
	tslib_1.__exportStar(require_env(), exports);
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-utils@1.0.8/node_modules/@walletconnect/jsonrpc-utils/dist/esm/env.js
var env_exports = /* @__PURE__ */ __exportAll({ isNodeJs: () => isNodeJs });
var import_cjs = require_cjs();
__reExport(env_exports, /* @__PURE__ */ __toESM(require_cjs()));
var isNodeJs = import_cjs.isNode;
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-utils@1.0.8/node_modules/@walletconnect/jsonrpc-utils/dist/esm/format.js
function payloadId(entropy = 3) {
	return Date.now() * Math.pow(10, entropy) + Math.floor(Math.random() * Math.pow(10, entropy));
}
function getBigIntRpcId(entropy = 6) {
	return BigInt(payloadId(entropy));
}
function formatJsonRpcRequest(method, params, id) {
	return {
		id: id || payloadId(),
		jsonrpc: "2.0",
		method,
		params
	};
}
function formatJsonRpcResult(id, result) {
	return {
		id,
		jsonrpc: "2.0",
		result
	};
}
function formatJsonRpcError(id, error, data) {
	return {
		id,
		jsonrpc: "2.0",
		error: formatErrorMessage(error, data)
	};
}
function formatErrorMessage(error, data) {
	if (typeof error === "undefined") return getError(INTERNAL_ERROR);
	if (typeof error === "string") error = Object.assign(Object.assign({}, getError(SERVER_ERROR)), { message: error });
	if (typeof data !== "undefined") error.data = data;
	if (isReservedErrorCode(error.code)) error = getErrorByCode(error.code);
	return error;
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-utils@1.0.8/node_modules/@walletconnect/jsonrpc-utils/dist/esm/routing.js
function isValidRoute(route) {
	if (route.includes("*")) return isValidWildcardRoute(route);
	if (/\W/g.test(route)) return false;
	return true;
}
function isValidDefaultRoute(route) {
	return route === "*";
}
function isValidWildcardRoute(route) {
	if (isValidDefaultRoute(route)) return true;
	if (!route.includes("*")) return false;
	if (route.split("*").length !== 2) return false;
	if (route.split("*").filter((x) => x.trim() === "").length !== 1) return false;
	return true;
}
function isValidLeadingWildcardRoute(route) {
	return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[0].trim();
}
function isValidTrailingWildcardRoute(route) {
	return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[1].trim();
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-types@1.0.4/node_modules/@walletconnect/jsonrpc-types/dist/index.es.js
var e = class {};
var o$1 = class extends e {
	constructor(c) {
		super();
	}
};
var n = class extends e {
	constructor() {
		super();
	}
};
var r = class extends n {
	constructor(c) {
		super();
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-utils@1.0.8/node_modules/@walletconnect/jsonrpc-utils/dist/esm/url.js
var HTTP_REGEX = "^https?:";
var WS_REGEX = "^wss?:";
function getUrlProtocol(url) {
	const matches = url.match(/* @__PURE__ */ new RegExp(/^\w+:/, "gi"));
	if (!matches || !matches.length) return;
	return matches[0];
}
function matchRegexProtocol(url, regex) {
	const protocol = getUrlProtocol(url);
	if (typeof protocol === "undefined") return false;
	return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
	return matchRegexProtocol(url, HTTP_REGEX);
}
function isWsUrl(url) {
	return matchRegexProtocol(url, WS_REGEX);
}
function isLocalhostUrl(url) {
	return (/* @__PURE__ */ new RegExp("wss?://localhost(:d{2,5})?")).test(url);
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-utils@1.0.8/node_modules/@walletconnect/jsonrpc-utils/dist/esm/validators.js
function isJsonRpcPayload(payload) {
	return typeof payload === "object" && "id" in payload && "jsonrpc" in payload && payload.jsonrpc === "2.0";
}
function isJsonRpcRequest(payload) {
	return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
	return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
	return "result" in payload;
}
function isJsonRpcError(payload) {
	return "error" in payload;
}
function isJsonRpcValidationInvalid(validation) {
	return "error" in validation && validation.valid === false;
}
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-utils@1.0.8/node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({
	DEFAULT_ERROR: () => DEFAULT_ERROR,
	IBaseJsonRpcProvider: () => n,
	IEvents: () => e,
	IJsonRpcConnection: () => o$1,
	IJsonRpcProvider: () => r,
	INTERNAL_ERROR: () => INTERNAL_ERROR,
	INVALID_PARAMS: () => INVALID_PARAMS,
	INVALID_REQUEST: () => INVALID_REQUEST,
	METHOD_NOT_FOUND: () => METHOD_NOT_FOUND,
	PARSE_ERROR: () => PARSE_ERROR,
	RESERVED_ERROR_CODES: () => RESERVED_ERROR_CODES,
	SERVER_ERROR: () => SERVER_ERROR,
	SERVER_ERROR_CODE_RANGE: () => SERVER_ERROR_CODE_RANGE,
	STANDARD_ERROR_MAP: () => STANDARD_ERROR_MAP,
	formatErrorMessage: () => formatErrorMessage,
	formatJsonRpcError: () => formatJsonRpcError,
	formatJsonRpcRequest: () => formatJsonRpcRequest,
	formatJsonRpcResult: () => formatJsonRpcResult,
	getBigIntRpcId: () => getBigIntRpcId,
	getError: () => getError,
	getErrorByCode: () => getErrorByCode,
	isHttpUrl: () => isHttpUrl,
	isJsonRpcError: () => isJsonRpcError,
	isJsonRpcPayload: () => isJsonRpcPayload,
	isJsonRpcRequest: () => isJsonRpcRequest,
	isJsonRpcResponse: () => isJsonRpcResponse,
	isJsonRpcResult: () => isJsonRpcResult,
	isJsonRpcValidationInvalid: () => isJsonRpcValidationInvalid,
	isLocalhostUrl: () => isLocalhostUrl,
	isNodeJs: () => isNodeJs,
	isReservedErrorCode: () => isReservedErrorCode,
	isServerErrorCode: () => isServerErrorCode,
	isValidDefaultRoute: () => isValidDefaultRoute,
	isValidErrorCode: () => isValidErrorCode,
	isValidLeadingWildcardRoute: () => isValidLeadingWildcardRoute,
	isValidRoute: () => isValidRoute,
	isValidTrailingWildcardRoute: () => isValidTrailingWildcardRoute,
	isValidWildcardRoute: () => isValidWildcardRoute,
	isWsUrl: () => isWsUrl,
	parseConnectionError: () => parseConnectionError,
	payloadId: () => payloadId,
	validateJsonRpcError: () => validateJsonRpcError
});
__reExport(esm_exports, env_exports);
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-provider@1.0.14/node_modules/@walletconnect/jsonrpc-provider/dist/index.es.js
var o = class extends r {
	constructor(t) {
		super(t), this.events = new EventEmitter(), this.hasRegisteredEventListeners = !1, this.connection = this.setConnection(t), this.connection.connected && this.registerEventListeners();
	}
	async connect(t = this.connection) {
		await this.open(t);
	}
	async disconnect() {
		await this.close();
	}
	on(t, e) {
		this.events.on(t, e);
	}
	once(t, e) {
		this.events.once(t, e);
	}
	off(t, e) {
		this.events.off(t, e);
	}
	removeListener(t, e) {
		this.events.removeListener(t, e);
	}
	async request(t, e) {
		return this.requestStrict(formatJsonRpcRequest(t.method, t.params || [], t.id || getBigIntRpcId().toString()), e);
	}
	async requestStrict(t, e) {
		return new Promise(async (i, s) => {
			if (!this.connection.connected) try {
				await this.open();
			} catch (n) {
				s(n);
			}
			this.events.on(`${t.id}`, (n) => {
				isJsonRpcError(n) ? s(n.error) : i(n.result);
			});
			try {
				await this.connection.send(t, e);
			} catch (n) {
				s(n);
			}
		});
	}
	setConnection(t = this.connection) {
		return t;
	}
	onPayload(t) {
		this.events.emit("payload", t), isJsonRpcResponse(t) ? this.events.emit(`${t.id}`, t) : this.events.emit("message", {
			type: t.method,
			data: t.params
		});
	}
	onClose(t) {
		t && t.code === 3e3 && this.events.emit("error", /* @__PURE__ */ new Error(`WebSocket connection closed abnormally with code: ${t.code} ${t.reason ? `(${t.reason})` : ""}`)), this.events.emit("disconnect");
	}
	async open(t = this.connection) {
		this.connection === t && this.connection.connected || (this.connection.connected && this.close(), typeof t == "string" && (await this.connection.open(t), t = this.connection), this.connection = this.setConnection(t), await this.connection.open(), this.registerEventListeners(), this.events.emit("connect"));
	}
	async close() {
		await this.connection.close();
	}
	registerEventListeners() {
		this.hasRegisteredEventListeners || (this.connection.on("payload", (t) => this.onPayload(t)), this.connection.on("close", (t) => this.onClose(t)), this.connection.on("error", (t) => this.events.emit("error", t)), this.connection.on("register_error", (t) => this.onClose()), this.hasRegisteredEventListeners = !0);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		BINARY_TYPES: [
			"nodebuffer",
			"arraybuffer",
			"fragments"
		],
		GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
		kStatusCode: Symbol("status-code"),
		kWebSocket: Symbol("websocket"),
		EMPTY_BUFFER: Buffer.alloc(0),
		NOOP: () => {}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/buffer-util.js
var require_buffer_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EMPTY_BUFFER } = require_constants();
	/**
	* Merges an array of buffers into a new buffer.
	*
	* @param {Buffer[]} list The array of buffers to concat
	* @param {Number} totalLength The total length of buffers in the list
	* @return {Buffer} The resulting buffer
	* @public
	*/
	function concat(list, totalLength) {
		if (list.length === 0) return EMPTY_BUFFER;
		if (list.length === 1) return list[0];
		const target = Buffer.allocUnsafe(totalLength);
		let offset = 0;
		for (let i = 0; i < list.length; i++) {
			const buf = list[i];
			target.set(buf, offset);
			offset += buf.length;
		}
		if (offset < totalLength) return target.slice(0, offset);
		return target;
	}
	/**
	* Masks a buffer using the given mask.
	*
	* @param {Buffer} source The buffer to mask
	* @param {Buffer} mask The mask to use
	* @param {Buffer} output The buffer where to store the result
	* @param {Number} offset The offset at which to start writing
	* @param {Number} length The number of bytes to mask.
	* @public
	*/
	function _mask(source, mask, output, offset, length) {
		for (let i = 0; i < length; i++) output[offset + i] = source[i] ^ mask[i & 3];
	}
	/**
	* Unmasks a buffer using the given mask.
	*
	* @param {Buffer} buffer The buffer to unmask
	* @param {Buffer} mask The mask to use
	* @public
	*/
	function _unmask(buffer, mask) {
		const length = buffer.length;
		for (let i = 0; i < length; i++) buffer[i] ^= mask[i & 3];
	}
	/**
	* Converts a buffer to an `ArrayBuffer`.
	*
	* @param {Buffer} buf The buffer to convert
	* @return {ArrayBuffer} Converted buffer
	* @public
	*/
	function toArrayBuffer(buf) {
		if (buf.byteLength === buf.buffer.byteLength) return buf.buffer;
		return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
	}
	/**
	* Converts `data` to a `Buffer`.
	*
	* @param {*} data The data to convert
	* @return {Buffer} The buffer
	* @throws {TypeError}
	* @public
	*/
	function toBuffer(data) {
		toBuffer.readOnly = true;
		if (Buffer.isBuffer(data)) return data;
		let buf;
		if (data instanceof ArrayBuffer) buf = Buffer.from(data);
		else if (ArrayBuffer.isView(data)) buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
		else {
			buf = Buffer.from(data);
			toBuffer.readOnly = false;
		}
		return buf;
	}
	try {
		const bufferUtil = __require("bufferutil");
		const bu = bufferUtil.BufferUtil || bufferUtil;
		module.exports = {
			concat,
			mask(source, mask, output, offset, length) {
				if (length < 48) _mask(source, mask, output, offset, length);
				else bu.mask(source, mask, output, offset, length);
			},
			toArrayBuffer,
			toBuffer,
			unmask(buffer, mask) {
				if (buffer.length < 32) _unmask(buffer, mask);
				else bu.unmask(buffer, mask);
			}
		};
	} catch (e) 	/* istanbul ignore next */ {
		module.exports = {
			concat,
			mask: _mask,
			toArrayBuffer,
			toBuffer,
			unmask: _unmask
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/limiter.js
var require_limiter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var kDone = Symbol("kDone");
	var kRun = Symbol("kRun");
	/**
	* A very simple job queue with adjustable concurrency. Adapted from
	* https://github.com/STRML/async-limiter
	*/
	var Limiter = class {
		/**
		* Creates a new `Limiter`.
		*
		* @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
		*     to run concurrently
		*/
		constructor(concurrency) {
			this[kDone] = () => {
				this.pending--;
				this[kRun]();
			};
			this.concurrency = concurrency || Infinity;
			this.jobs = [];
			this.pending = 0;
		}
		/**
		* Adds a job to the queue.
		*
		* @param {Function} job The job to run
		* @public
		*/
		add(job) {
			this.jobs.push(job);
			this[kRun]();
		}
		/**
		* Removes a job from the queue and runs it if possible.
		*
		* @private
		*/
		[kRun]() {
			if (this.pending === this.concurrency) return;
			if (this.jobs.length) {
				const job = this.jobs.shift();
				this.pending++;
				job(this[kDone]);
			}
		}
	};
	module.exports = Limiter;
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var zlib = __require("zlib");
	var bufferUtil = require_buffer_util();
	var Limiter = require_limiter();
	var { kStatusCode, NOOP } = require_constants();
	var TRAILER = Buffer.from([
		0,
		0,
		255,
		255
	]);
	var kPerMessageDeflate = Symbol("permessage-deflate");
	var kTotalLength = Symbol("total-length");
	var kCallback = Symbol("callback");
	var kBuffers = Symbol("buffers");
	var kError = Symbol("error");
	var zlibLimiter;
	/**
	* permessage-deflate implementation.
	*/
	var PerMessageDeflate = class {
		/**
		* Creates a PerMessageDeflate instance.
		*
		* @param {Object} [options] Configuration options
		* @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
		*     disabling of server context takeover
		* @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
		*     acknowledge disabling of client context takeover
		* @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
		*     use of a custom server window size
		* @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
		*     for, or request, a custom client window size
		* @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
		*     deflate
		* @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
		*     inflate
		* @param {Number} [options.threshold=1024] Size (in bytes) below which
		*     messages should not be compressed
		* @param {Number} [options.concurrencyLimit=10] The number of concurrent
		*     calls to zlib
		* @param {Boolean} [isServer=false] Create the instance in either server or
		*     client mode
		* @param {Number} [maxPayload=0] The maximum allowed message length
		*/
		constructor(options, isServer, maxPayload) {
			this._maxPayload = maxPayload | 0;
			this._options = options || {};
			this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
			this._isServer = !!isServer;
			this._deflate = null;
			this._inflate = null;
			this.params = null;
			if (!zlibLimiter) zlibLimiter = new Limiter(this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10);
		}
		/**
		* @type {String}
		*/
		static get extensionName() {
			return "permessage-deflate";
		}
		/**
		* Create an extension negotiation offer.
		*
		* @return {Object} Extension parameters
		* @public
		*/
		offer() {
			const params = {};
			if (this._options.serverNoContextTakeover) params.server_no_context_takeover = true;
			if (this._options.clientNoContextTakeover) params.client_no_context_takeover = true;
			if (this._options.serverMaxWindowBits) params.server_max_window_bits = this._options.serverMaxWindowBits;
			if (this._options.clientMaxWindowBits) params.client_max_window_bits = this._options.clientMaxWindowBits;
			else if (this._options.clientMaxWindowBits == null) params.client_max_window_bits = true;
			return params;
		}
		/**
		* Accept an extension negotiation offer/response.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Object} Accepted configuration
		* @public
		*/
		accept(configurations) {
			configurations = this.normalizeParams(configurations);
			this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
			return this.params;
		}
		/**
		* Releases all resources used by the extension.
		*
		* @public
		*/
		cleanup() {
			if (this._inflate) {
				this._inflate.close();
				this._inflate = null;
			}
			if (this._deflate) {
				const callback = this._deflate[kCallback];
				this._deflate.close();
				this._deflate = null;
				if (callback) callback(/* @__PURE__ */ new Error("The deflate stream was closed while data was being processed"));
			}
		}
		/**
		*  Accept an extension negotiation offer.
		*
		* @param {Array} offers The extension negotiation offers
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsServer(offers) {
			const opts = this._options;
			const accepted = offers.find((params) => {
				if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) return false;
				return true;
			});
			if (!accepted) throw new Error("None of the extension offers can be accepted");
			if (opts.serverNoContextTakeover) accepted.server_no_context_takeover = true;
			if (opts.clientNoContextTakeover) accepted.client_no_context_takeover = true;
			if (typeof opts.serverMaxWindowBits === "number") accepted.server_max_window_bits = opts.serverMaxWindowBits;
			if (typeof opts.clientMaxWindowBits === "number") accepted.client_max_window_bits = opts.clientMaxWindowBits;
			else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) delete accepted.client_max_window_bits;
			return accepted;
		}
		/**
		* Accept the extension negotiation response.
		*
		* @param {Array} response The extension negotiation response
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsClient(response) {
			const params = response[0];
			if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) throw new Error("Unexpected parameter \"client_no_context_takeover\"");
			if (!params.client_max_window_bits) {
				if (typeof this._options.clientMaxWindowBits === "number") params.client_max_window_bits = this._options.clientMaxWindowBits;
			} else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error("Unexpected or invalid parameter \"client_max_window_bits\"");
			return params;
		}
		/**
		* Normalize parameters.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Array} The offers/response with normalized parameters
		* @private
		*/
		normalizeParams(configurations) {
			configurations.forEach((params) => {
				Object.keys(params).forEach((key) => {
					let value = params[key];
					if (value.length > 1) throw new Error(`Parameter "${key}" must have only a single value`);
					value = value[0];
					if (key === "client_max_window_bits") {
						if (value !== true) {
							const num = +value;
							if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
							value = num;
						} else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else if (key === "server_max_window_bits") {
						const num = +value;
						if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
						value = num;
					} else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
						if (value !== true) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else throw new Error(`Unknown parameter "${key}"`);
					params[key] = value;
				});
			});
			return configurations;
		}
		/**
		* Decompress data. Concurrency limited.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		decompress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._decompress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Compress data. Concurrency limited.
		*
		* @param {Buffer} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		compress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._compress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Decompress data.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_decompress(data, fin, callback) {
			const endpoint = this._isServer ? "client" : "server";
			if (!this._inflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._inflate = zlib.createInflateRaw({
					...this._options.zlibInflateOptions,
					windowBits
				});
				this._inflate[kPerMessageDeflate] = this;
				this._inflate[kTotalLength] = 0;
				this._inflate[kBuffers] = [];
				this._inflate.on("error", inflateOnError);
				this._inflate.on("data", inflateOnData);
			}
			this._inflate[kCallback] = callback;
			this._inflate.write(data);
			if (fin) this._inflate.write(TRAILER);
			this._inflate.flush(() => {
				const err = this._inflate[kError];
				if (err) {
					this._inflate.close();
					this._inflate = null;
					callback(err);
					return;
				}
				const data = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
				if (this._inflate._readableState.endEmitted) {
					this._inflate.close();
					this._inflate = null;
				} else {
					this._inflate[kTotalLength] = 0;
					this._inflate[kBuffers] = [];
					if (fin && this.params[`${endpoint}_no_context_takeover`]) this._inflate.reset();
				}
				callback(null, data);
			});
		}
		/**
		* Compress data.
		*
		* @param {Buffer} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_compress(data, fin, callback) {
			const endpoint = this._isServer ? "server" : "client";
			if (!this._deflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._deflate = zlib.createDeflateRaw({
					...this._options.zlibDeflateOptions,
					windowBits
				});
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				this._deflate.on("error", NOOP);
				this._deflate.on("data", deflateOnData);
			}
			this._deflate[kCallback] = callback;
			this._deflate.write(data);
			this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
				if (!this._deflate) return;
				let data = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
				if (fin) data = data.slice(0, data.length - 4);
				this._deflate[kCallback] = null;
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				if (fin && this.params[`${endpoint}_no_context_takeover`]) this._deflate.reset();
				callback(null, data);
			});
		}
	};
	module.exports = PerMessageDeflate;
	/**
	* The listener of the `zlib.DeflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function deflateOnData(chunk) {
		this[kBuffers].push(chunk);
		this[kTotalLength] += chunk.length;
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function inflateOnData(chunk) {
		this[kTotalLength] += chunk.length;
		if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
			this[kBuffers].push(chunk);
			return;
		}
		this[kError] = /* @__PURE__ */ new RangeError("Max payload size exceeded");
		this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
		this[kError][kStatusCode] = 1009;
		this.removeListener("data", inflateOnData);
		this.reset();
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'error'` event.
	*
	* @param {Error} err The emitted error
	* @private
	*/
	function inflateOnError(err) {
		this[kPerMessageDeflate]._inflate = null;
		err[kStatusCode] = 1007;
		this[kCallback](err);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/validation.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Checks if a status code is allowed in a close frame.
	*
	* @param {Number} code The status code
	* @return {Boolean} `true` if the status code is valid, else `false`
	* @public
	*/
	function isValidStatusCode(code) {
		return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
	}
	/**
	* Checks if a given buffer contains only correct UTF-8.
	* Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	* Markus Kuhn.
	*
	* @param {Buffer} buf The buffer to check
	* @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	* @public
	*/
	function _isValidUTF8(buf) {
		const len = buf.length;
		let i = 0;
		while (i < len) if ((buf[i] & 128) === 0) i++;
		else if ((buf[i] & 224) === 192) {
			if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) return false;
			i += 2;
		} else if ((buf[i] & 240) === 224) {
			if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) return false;
			i += 3;
		} else if ((buf[i] & 248) === 240) {
			if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) return false;
			i += 4;
		} else return false;
		return true;
	}
	try {
		let isValidUTF8 = __require("utf-8-validate");
		/* istanbul ignore if */
		if (typeof isValidUTF8 === "object") isValidUTF8 = isValidUTF8.Validation.isValidUTF8;
		module.exports = {
			isValidStatusCode,
			isValidUTF8(buf) {
				return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
			}
		};
	} catch (e) 	/* istanbul ignore next */ {
		module.exports = {
			isValidStatusCode,
			isValidUTF8: _isValidUTF8
		};
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/receiver.js
var require_receiver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Writable } = __require("stream");
	var PerMessageDeflate = require_permessage_deflate();
	var { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } = require_constants();
	var { concat, toArrayBuffer, unmask } = require_buffer_util();
	var { isValidStatusCode, isValidUTF8 } = require_validation();
	var GET_INFO = 0;
	var GET_PAYLOAD_LENGTH_16 = 1;
	var GET_PAYLOAD_LENGTH_64 = 2;
	var GET_MASK = 3;
	var GET_DATA = 4;
	var INFLATING = 5;
	/**
	* HyBi Receiver implementation.
	*
	* @extends Writable
	*/
	var Receiver = class extends Writable {
		/**
		* Creates a Receiver instance.
		*
		* @param {String} [binaryType=nodebuffer] The type for binary data
		* @param {Object} [extensions] An object containing the negotiated extensions
		* @param {Boolean} [isServer=false] Specifies whether to operate in client or
		*     server mode
		* @param {Number} [maxPayload=0] The maximum allowed message length
		* @param {Number} [maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [maxFragments=0] The maximum number of message
		*     fragments
		*/
		constructor(binaryType, extensions, isServer, maxPayload, maxBufferedChunks, maxFragments) {
			super();
			this._binaryType = binaryType || BINARY_TYPES[0];
			this[kWebSocket] = void 0;
			this._extensions = extensions || {};
			this._isServer = !!isServer;
			this._maxBufferedChunks = maxBufferedChunks | 0;
			this._maxFragments = maxFragments | 0;
			this._maxPayload = maxPayload | 0;
			this._bufferedBytes = 0;
			this._buffers = [];
			this._compressed = false;
			this._payloadLength = 0;
			this._mask = void 0;
			this._fragmented = 0;
			this._masked = false;
			this._fin = false;
			this._opcode = 0;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._fragments = [];
			this._state = GET_INFO;
			this._loop = false;
		}
		/**
		* Implements `Writable.prototype._write()`.
		*
		* @param {Buffer} chunk The chunk of data to write
		* @param {String} encoding The character encoding of `chunk`
		* @param {Function} cb Callback
		* @private
		*/
		_write(chunk, encoding, cb) {
			if (this._opcode === 8 && this._state == GET_INFO) return cb();
			if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) return cb(error(RangeError, "Too many buffered chunks", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
			this._bufferedBytes += chunk.length;
			this._buffers.push(chunk);
			this.startLoop(cb);
		}
		/**
		* Consumes `n` bytes from the buffered data.
		*
		* @param {Number} n The number of bytes to consume
		* @return {Buffer} The consumed bytes
		* @private
		*/
		consume(n) {
			this._bufferedBytes -= n;
			if (n === this._buffers[0].length) return this._buffers.shift();
			if (n < this._buffers[0].length) {
				const buf = this._buffers[0];
				this._buffers[0] = buf.slice(n);
				return buf.slice(0, n);
			}
			const dst = Buffer.allocUnsafe(n);
			do {
				const buf = this._buffers[0];
				const offset = dst.length - n;
				if (n >= buf.length) dst.set(this._buffers.shift(), offset);
				else {
					dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
					this._buffers[0] = buf.slice(n);
				}
				n -= buf.length;
			} while (n > 0);
			return dst;
		}
		/**
		* Starts the parsing loop.
		*
		* @param {Function} cb Callback
		* @private
		*/
		startLoop(cb) {
			let err;
			this._loop = true;
			do
				switch (this._state) {
					case GET_INFO:
						err = this.getInfo();
						break;
					case GET_PAYLOAD_LENGTH_16:
						err = this.getPayloadLength16();
						break;
					case GET_PAYLOAD_LENGTH_64:
						err = this.getPayloadLength64();
						break;
					case GET_MASK:
						this.getMask();
						break;
					case GET_DATA:
						err = this.getData(cb);
						break;
					default:
						this._loop = false;
						return;
				}
			while (this._loop);
			cb(err);
		}
		/**
		* Reads the first two bytes of a frame.
		*
		* @return {(RangeError|undefined)} A possible error
		* @private
		*/
		getInfo() {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			const buf = this.consume(2);
			if ((buf[0] & 48) !== 0) {
				this._loop = false;
				return error(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
			}
			const compressed = (buf[0] & 64) === 64;
			if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
				this._loop = false;
				return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
			}
			this._fin = (buf[0] & 128) === 128;
			this._opcode = buf[0] & 15;
			this._payloadLength = buf[1] & 127;
			if (this._opcode === 0) {
				if (compressed) {
					this._loop = false;
					return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
				}
				if (!this._fragmented) {
					this._loop = false;
					return error(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE");
				}
				this._opcode = this._fragmented;
			} else if (this._opcode === 1 || this._opcode === 2) {
				if (this._fragmented) {
					this._loop = false;
					return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
				}
				this._compressed = compressed;
			} else if (this._opcode > 7 && this._opcode < 11) {
				if (!this._fin) {
					this._loop = false;
					return error(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN");
				}
				if (compressed) {
					this._loop = false;
					return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
				}
				if (this._payloadLength > 125) {
					this._loop = false;
					return error(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
				}
			} else {
				this._loop = false;
				return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
			}
			if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
			this._masked = (buf[1] & 128) === 128;
			if (this._isServer) {
				if (!this._masked) {
					this._loop = false;
					return error(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK");
				}
			} else if (this._masked) {
				this._loop = false;
				return error(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK");
			}
			if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
			else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
			else return this.haveLength();
		}
		/**
		* Gets extended payload length (7+16).
		*
		* @return {(RangeError|undefined)} A possible error
		* @private
		*/
		getPayloadLength16() {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			this._payloadLength = this.consume(2).readUInt16BE(0);
			return this.haveLength();
		}
		/**
		* Gets extended payload length (7+64).
		*
		* @return {(RangeError|undefined)} A possible error
		* @private
		*/
		getPayloadLength64() {
			if (this._bufferedBytes < 8) {
				this._loop = false;
				return;
			}
			const buf = this.consume(8);
			const num = buf.readUInt32BE(0);
			if (num > Math.pow(2, 21) - 1) {
				this._loop = false;
				return error(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
			}
			this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
			return this.haveLength();
		}
		/**
		* Payload length has been read.
		*
		* @return {(RangeError|undefined)} A possible error
		* @private
		*/
		haveLength() {
			if (this._payloadLength && this._opcode < 8) {
				this._totalPayloadLength += this._payloadLength;
				if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
					this._loop = false;
					return error(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
				}
			}
			if (this._masked) this._state = GET_MASK;
			else this._state = GET_DATA;
		}
		/**
		* Reads mask bytes.
		*
		* @private
		*/
		getMask() {
			if (this._bufferedBytes < 4) {
				this._loop = false;
				return;
			}
			this._mask = this.consume(4);
			this._state = GET_DATA;
		}
		/**
		* Reads data bytes.
		*
		* @param {Function} cb Callback
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		getData(cb) {
			let data = EMPTY_BUFFER;
			if (this._payloadLength) {
				if (this._bufferedBytes < this._payloadLength) {
					this._loop = false;
					return;
				}
				data = this.consume(this._payloadLength);
				if (this._masked) unmask(data, this._mask);
			}
			if (this._opcode > 7) return this.controlMessage(data);
			if (this._compressed) {
				this._state = INFLATING;
				this.decompress(data, cb);
				return;
			}
			if (data.length) {
				if (this._maxFragments > 0 && this._fragments.length >= this._maxFragments) {
					this._loop = false;
					return error(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS");
				}
				this._messageLength = this._totalPayloadLength;
				this._fragments.push(data);
			}
			return this.dataMessage();
		}
		/**
		* Decompresses data.
		*
		* @param {Buffer} data Compressed data
		* @param {Function} cb Callback
		* @private
		*/
		decompress(data, cb) {
			this._extensions[PerMessageDeflate.extensionName].decompress(data, this._fin, (err, buf) => {
				if (err) return cb(err);
				if (buf.length) {
					this._messageLength += buf.length;
					if (this._messageLength > this._maxPayload && this._maxPayload > 0) return cb(error(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
					if (this._maxFragments > 0 && this._fragments.length >= this._maxFragments) return cb(error(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
					this._fragments.push(buf);
				}
				const er = this.dataMessage();
				if (er) return cb(er);
				this.startLoop(cb);
			});
		}
		/**
		* Handles a data message.
		*
		* @return {(Error|undefined)} A possible error
		* @private
		*/
		dataMessage() {
			if (this._fin) {
				const messageLength = this._messageLength;
				const fragments = this._fragments;
				this._totalPayloadLength = 0;
				this._messageLength = 0;
				this._fragmented = 0;
				this._fragments = [];
				if (this._opcode === 2) {
					let data;
					if (this._binaryType === "nodebuffer") data = concat(fragments, messageLength);
					else if (this._binaryType === "arraybuffer") data = toArrayBuffer(concat(fragments, messageLength));
					else data = fragments;
					this.emit("message", data);
				} else {
					const buf = concat(fragments, messageLength);
					if (!isValidUTF8(buf)) {
						this._loop = false;
						return error(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
					}
					this.emit("message", buf.toString());
				}
			}
			this._state = GET_INFO;
		}
		/**
		* Handles a control message.
		*
		* @param {Buffer} data Data to handle
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		controlMessage(data) {
			if (this._opcode === 8) {
				this._loop = false;
				if (data.length === 0) {
					this.emit("conclude", 1005, "");
					this.end();
				} else if (data.length === 1) return error(RangeError, "invalid payload length 1", true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
				else {
					const code = data.readUInt16BE(0);
					if (!isValidStatusCode(code)) return error(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE");
					const buf = data.slice(2);
					if (!isValidUTF8(buf)) return error(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
					this.emit("conclude", code, buf.toString());
					this.end();
				}
			} else if (this._opcode === 9) this.emit("ping", data);
			else this.emit("pong", data);
			this._state = GET_INFO;
		}
	};
	module.exports = Receiver;
	/**
	* Builds an error object.
	*
	* @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	* @param {String} message The error message
	* @param {Boolean} prefix Specifies whether or not to add a default prefix to
	*     `message`
	* @param {Number} statusCode The status code
	* @param {String} errorCode The exposed error code
	* @return {(Error|RangeError)} The error
	* @private
	*/
	function error(ErrorCtor, message, prefix, statusCode, errorCode) {
		const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
		Error.captureStackTrace(err, error);
		err.code = errorCode;
		err[kStatusCode] = statusCode;
		return err;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/sender.js
var require_sender = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	__require("net");
	__require("tls");
	var { randomFillSync: randomFillSync$1 } = __require("crypto");
	var PerMessageDeflate = require_permessage_deflate();
	var { EMPTY_BUFFER } = require_constants();
	var { isValidStatusCode } = require_validation();
	var { mask: applyMask, toBuffer } = require_buffer_util();
	var mask = Buffer.alloc(4);
	module.exports = class Sender {
		/**
		* Creates a Sender instance.
		*
		* @param {(net.Socket|tls.Socket)} socket The connection socket
		* @param {Object} [extensions] An object containing the negotiated extensions
		*/
		constructor(socket, extensions) {
			this._extensions = extensions || {};
			this._socket = socket;
			this._firstFragment = true;
			this._compress = false;
			this._bufferedBytes = 0;
			this._deflating = false;
			this._queue = [];
		}
		/**
		* Frames a piece of data according to the HyBi WebSocket protocol.
		*
		* @param {Buffer} data The data to frame
		* @param {Object} options Options object
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @return {Buffer[]} The framed data as a list of `Buffer` instances
		* @public
		*/
		static frame(data, options) {
			const merge = options.mask && options.readOnly;
			let offset = options.mask ? 6 : 2;
			let payloadLength = data.length;
			if (data.length >= 65536) {
				offset += 8;
				payloadLength = 127;
			} else if (data.length > 125) {
				offset += 2;
				payloadLength = 126;
			}
			const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);
			target[0] = options.fin ? options.opcode | 128 : options.opcode;
			if (options.rsv1) target[0] |= 64;
			target[1] = payloadLength;
			if (payloadLength === 126) target.writeUInt16BE(data.length, 2);
			else if (payloadLength === 127) {
				target.writeUInt32BE(0, 2);
				target.writeUInt32BE(data.length, 6);
			}
			if (!options.mask) return [target, data];
			randomFillSync$1(mask, 0, 4);
			target[1] |= 128;
			target[offset - 4] = mask[0];
			target[offset - 3] = mask[1];
			target[offset - 2] = mask[2];
			target[offset - 1] = mask[3];
			if (merge) {
				applyMask(data, mask, target, offset, data.length);
				return [target];
			}
			applyMask(data, mask, data, 0, data.length);
			return [target, data];
		}
		/**
		* Sends a close message to the other peer.
		*
		* @param {Number} [code] The status code component of the body
		* @param {String} [data] The message component of the body
		* @param {Boolean} [mask=false] Specifies whether or not to mask the message
		* @param {Function} [cb] Callback
		* @public
		*/
		close(code, data, mask, cb) {
			let buf;
			if (code === void 0) buf = EMPTY_BUFFER;
			else if (typeof code !== "number" || !isValidStatusCode(code)) throw new TypeError("First argument must be a valid error code number");
			else if (data === void 0 || data === "") {
				buf = Buffer.allocUnsafe(2);
				buf.writeUInt16BE(code, 0);
			} else {
				const length = Buffer.byteLength(data);
				if (length > 123) throw new RangeError("The message must not be greater than 123 bytes");
				buf = Buffer.allocUnsafe(2 + length);
				buf.writeUInt16BE(code, 0);
				buf.write(data, 2);
			}
			if (this._deflating) this.enqueue([
				this.doClose,
				buf,
				mask,
				cb
			]);
			else this.doClose(buf, mask, cb);
		}
		/**
		* Frames and sends a close message.
		*
		* @param {Buffer} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @private
		*/
		doClose(data, mask, cb) {
			this.sendFrame(Sender.frame(data, {
				fin: true,
				rsv1: false,
				opcode: 8,
				mask,
				readOnly: false
			}), cb);
		}
		/**
		* Sends a ping message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		ping(data, mask, cb) {
			const buf = toBuffer(data);
			if (buf.length > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			if (this._deflating) this.enqueue([
				this.doPing,
				buf,
				mask,
				toBuffer.readOnly,
				cb
			]);
			else this.doPing(buf, mask, toBuffer.readOnly, cb);
		}
		/**
		* Frames and sends a ping message.
		*
		* @param {Buffer} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
		* @param {Function} [cb] Callback
		* @private
		*/
		doPing(data, mask, readOnly, cb) {
			this.sendFrame(Sender.frame(data, {
				fin: true,
				rsv1: false,
				opcode: 9,
				mask,
				readOnly
			}), cb);
		}
		/**
		* Sends a pong message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		pong(data, mask, cb) {
			const buf = toBuffer(data);
			if (buf.length > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			if (this._deflating) this.enqueue([
				this.doPong,
				buf,
				mask,
				toBuffer.readOnly,
				cb
			]);
			else this.doPong(buf, mask, toBuffer.readOnly, cb);
		}
		/**
		* Frames and sends a pong message.
		*
		* @param {Buffer} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
		* @param {Function} [cb] Callback
		* @private
		*/
		doPong(data, mask, readOnly, cb) {
			this.sendFrame(Sender.frame(data, {
				fin: true,
				rsv1: false,
				opcode: 10,
				mask,
				readOnly
			}), cb);
		}
		/**
		* Sends a data message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Object} options Options object
		* @param {Boolean} [options.compress=false] Specifies whether or not to
		*     compress `data`
		* @param {Boolean} [options.binary=false] Specifies whether `data` is binary
		*     or text
		* @param {Boolean} [options.fin=false] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		send(data, options, cb) {
			const buf = toBuffer(data);
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			let opcode = options.binary ? 2 : 1;
			let rsv1 = options.compress;
			if (this._firstFragment) {
				this._firstFragment = false;
				if (rsv1 && perMessageDeflate) rsv1 = buf.length >= perMessageDeflate._threshold;
				this._compress = rsv1;
			} else {
				rsv1 = false;
				opcode = 0;
			}
			if (options.fin) this._firstFragment = true;
			if (perMessageDeflate) {
				const opts = {
					fin: options.fin,
					rsv1,
					opcode,
					mask: options.mask,
					readOnly: toBuffer.readOnly
				};
				if (this._deflating) this.enqueue([
					this.dispatch,
					buf,
					this._compress,
					opts,
					cb
				]);
				else this.dispatch(buf, this._compress, opts, cb);
			} else this.sendFrame(Sender.frame(buf, {
				fin: options.fin,
				rsv1: false,
				opcode,
				mask: options.mask,
				readOnly: toBuffer.readOnly
			}), cb);
		}
		/**
		* Dispatches a data message.
		*
		* @param {Buffer} data The message to send
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     `data`
		* @param {Object} options Options object
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		dispatch(data, compress, options, cb) {
			if (!compress) {
				this.sendFrame(Sender.frame(data, options), cb);
				return;
			}
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			this._bufferedBytes += data.length;
			this._deflating = true;
			perMessageDeflate.compress(data, options.fin, (_, buf) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while data was being compressed");
					if (typeof cb === "function") cb(err);
					for (let i = 0; i < this._queue.length; i++) {
						const callback = this._queue[i][4];
						if (typeof callback === "function") callback(err);
					}
					return;
				}
				this._bufferedBytes -= data.length;
				this._deflating = false;
				options.readOnly = false;
				this.sendFrame(Sender.frame(buf, options), cb);
				this.dequeue();
			});
		}
		/**
		* Executes queued send operations.
		*
		* @private
		*/
		dequeue() {
			while (!this._deflating && this._queue.length) {
				const params = this._queue.shift();
				this._bufferedBytes -= params[1].length;
				Reflect.apply(params[0], this, params.slice(1));
			}
		}
		/**
		* Enqueues a send operation.
		*
		* @param {Array} params Send operation parameters.
		* @private
		*/
		enqueue(params) {
			this._bufferedBytes += params[1].length;
			this._queue.push(params);
		}
		/**
		* Sends a frame.
		*
		* @param {Buffer[]} list The frame to send
		* @param {Function} [cb] Callback
		* @private
		*/
		sendFrame(list, cb) {
			if (list.length === 2) {
				this._socket.cork();
				this._socket.write(list[0]);
				this._socket.write(list[1], cb);
				this._socket.uncork();
			} else this._socket.write(list[0], cb);
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/event-target.js
var require_event_target = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Class representing an event.
	*
	* @private
	*/
	var Event = class {
		/**
		* Create a new `Event`.
		*
		* @param {String} type The name of the event
		* @param {Object} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(type, target) {
			this.target = target;
			this.type = type;
		}
	};
	/**
	* Class representing a message event.
	*
	* @extends Event
	* @private
	*/
	var MessageEvent = class extends Event {
		/**
		* Create a new `MessageEvent`.
		*
		* @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
		* @param {WebSocket} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(data, target) {
			super("message", target);
			this.data = data;
		}
	};
	/**
	* Class representing a close event.
	*
	* @extends Event
	* @private
	*/
	var CloseEvent = class extends Event {
		/**
		* Create a new `CloseEvent`.
		*
		* @param {Number} code The status code explaining why the connection is being
		*     closed
		* @param {String} reason A human-readable string explaining why the
		*     connection is closing
		* @param {WebSocket} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(code, reason, target) {
			super("close", target);
			this.wasClean = target._closeFrameReceived && target._closeFrameSent;
			this.reason = reason;
			this.code = code;
		}
	};
	/**
	* Class representing an open event.
	*
	* @extends Event
	* @private
	*/
	var OpenEvent = class extends Event {
		/**
		* Create a new `OpenEvent`.
		*
		* @param {WebSocket} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(target) {
			super("open", target);
		}
	};
	/**
	* Class representing an error event.
	*
	* @extends Event
	* @private
	*/
	var ErrorEvent = class extends Event {
		/**
		* Create a new `ErrorEvent`.
		*
		* @param {Object} error The error that generated this event
		* @param {WebSocket} target A reference to the target to which the event was
		*     dispatched
		*/
		constructor(error, target) {
			super("error", target);
			this.message = error.message;
			this.error = error;
		}
	};
	module.exports = {
		/**
		* Register an event listener.
		*
		* @param {String} type A string representing the event type to listen for
		* @param {Function} listener The listener to add
		* @param {Object} [options] An options object specifies characteristics about
		*     the event listener
		* @param {Boolean} [options.once=false] A `Boolean`` indicating that the
		*     listener should be invoked at most once after being added. If `true`,
		*     the listener would be automatically removed when invoked.
		* @public
		*/
		addEventListener(type, listener, options) {
			if (typeof listener !== "function") return;
			function onMessage(data) {
				listener.call(this, new MessageEvent(data, this));
			}
			function onClose(code, message) {
				listener.call(this, new CloseEvent(code, message, this));
			}
			function onError(error) {
				listener.call(this, new ErrorEvent(error, this));
			}
			function onOpen() {
				listener.call(this, new OpenEvent(this));
			}
			const method = options && options.once ? "once" : "on";
			if (type === "message") {
				onMessage._listener = listener;
				this[method](type, onMessage);
			} else if (type === "close") {
				onClose._listener = listener;
				this[method](type, onClose);
			} else if (type === "error") {
				onError._listener = listener;
				this[method](type, onError);
			} else if (type === "open") {
				onOpen._listener = listener;
				this[method](type, onOpen);
			} else this[method](type, listener);
		},
		/**
		* Remove an event listener.
		*
		* @param {String} type A string representing the event type to remove
		* @param {Function} listener The listener to remove
		* @public
		*/
		removeEventListener(type, listener) {
			const listeners = this.listeners(type);
			for (let i = 0; i < listeners.length; i++) if (listeners[i] === listener || listeners[i]._listener === listener) this.removeListener(type, listeners[i]);
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/extension.js
var require_extension = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var tokenChars = [
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
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		0,
		1,
		0
	];
	/**
	* Adds an offer to the map of extension offers or a parameter to the map of
	* parameters.
	*
	* @param {Object} dest The map of extension offers or parameters
	* @param {String} name The extension or parameter name
	* @param {(Object|Boolean|String)} elem The extension parameters or the
	*     parameter value
	* @private
	*/
	function push(dest, name, elem) {
		if (dest[name] === void 0) dest[name] = [elem];
		else dest[name].push(elem);
	}
	/**
	* Parses the `Sec-WebSocket-Extensions` header into an object.
	*
	* @param {String} header The field value of the header
	* @return {Object} The parsed object
	* @public
	*/
	function parse(header) {
		const offers = Object.create(null);
		if (header === void 0 || header === "") return offers;
		let params = Object.create(null);
		let mustUnescape = false;
		let isEscaping = false;
		let inQuotes = false;
		let extensionName;
		let paramName;
		let start = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			const code = header.charCodeAt(i);
			if (extensionName === void 0) if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 32 || code === 9) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const name = header.slice(start, end);
				if (code === 44) {
					push(offers, name, params);
					params = Object.create(null);
				} else extensionName = name;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (paramName === void 0) if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 32 || code === 9) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				push(params, header.slice(start, end), true);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				start = end = -1;
			} else if (code === 61 && start !== -1 && end === -1) {
				paramName = header.slice(start, i);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (isEscaping) {
				if (tokenChars[code] !== 1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (start === -1) start = i;
				else if (!mustUnescape) mustUnescape = true;
				isEscaping = false;
			} else if (inQuotes) if (tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 34 && start !== -1) {
				inQuotes = false;
				end = i;
			} else if (code === 92) isEscaping = true;
			else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (code === 34 && header.charCodeAt(i - 1) === 61) inQuotes = true;
			else if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (start !== -1 && (code === 32 || code === 9)) {
				if (end === -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				let value = header.slice(start, end);
				if (mustUnescape) {
					value = value.replace(/\\/g, "");
					mustUnescape = false;
				}
				push(params, paramName, value);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				paramName = void 0;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || inQuotes) throw new SyntaxError("Unexpected end of input");
		if (end === -1) end = i;
		const token = header.slice(start, end);
		if (extensionName === void 0) push(offers, token, params);
		else {
			if (paramName === void 0) push(params, token, true);
			else if (mustUnescape) push(params, paramName, token.replace(/\\/g, ""));
			else push(params, paramName, token);
			push(offers, extensionName, params);
		}
		return offers;
	}
	/**
	* Builds the `Sec-WebSocket-Extensions` header field value.
	*
	* @param {Object} extensions The map of extensions and parameters to format
	* @return {String} A string representing the given object
	* @public
	*/
	function format(extensions) {
		return Object.keys(extensions).map((extension) => {
			let configurations = extensions[extension];
			if (!Array.isArray(configurations)) configurations = [configurations];
			return configurations.map((params) => {
				return [extension].concat(Object.keys(params).map((k) => {
					let values = params[k];
					if (!Array.isArray(values)) values = [values];
					return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
				})).join("; ");
			}).join(", ");
		}).join(", ");
	}
	module.exports = {
		format,
		parse
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/websocket.js
var require_websocket = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$2 = __require("events");
	var https = __require("https");
	var http$1 = __require("http");
	var net = __require("net");
	var tls = __require("tls");
	var { randomBytes, createHash: createHash$1 } = __require("crypto");
	var { Readable } = __require("stream");
	var { URL: URL$1 } = __require("url");
	var PerMessageDeflate = require_permessage_deflate();
	var Receiver = require_receiver();
	var Sender = require_sender();
	var { BINARY_TYPES, EMPTY_BUFFER, GUID, kStatusCode, kWebSocket, NOOP } = require_constants();
	var { addEventListener, removeEventListener } = require_event_target();
	var { format, parse } = require_extension();
	var { toBuffer } = require_buffer_util();
	var readyStates = [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	];
	var protocolVersions = [8, 13];
	var closeTimeout = 30 * 1e3;
	/**
	* Class representing a WebSocket.
	*
	* @extends EventEmitter
	*/
	var WebSocket = class WebSocket extends EventEmitter$2 {
		/**
		* Create a new `WebSocket`.
		*
		* @param {(String|URL)} address The URL to which to connect
		* @param {(String|String[])} [protocols] The subprotocols
		* @param {Object} [options] Connection options
		*/
		constructor(address, protocols, options) {
			super();
			this._binaryType = BINARY_TYPES[0];
			this._closeCode = 1006;
			this._closeFrameReceived = false;
			this._closeFrameSent = false;
			this._closeMessage = "";
			this._closeTimer = null;
			this._extensions = {};
			this._protocol = "";
			this._readyState = WebSocket.CONNECTING;
			this._receiver = null;
			this._sender = null;
			this._socket = null;
			if (address !== null) {
				this._bufferedAmount = 0;
				this._isServer = false;
				this._redirects = 0;
				if (Array.isArray(protocols)) protocols = protocols.join(", ");
				else if (typeof protocols === "object" && protocols !== null) {
					options = protocols;
					protocols = void 0;
				}
				initAsClient(this, address, protocols, options);
			} else this._isServer = true;
		}
		/**
		* This deviates from the WHATWG interface since ws doesn't support the
		* required default "blob" type (instead we define a custom "nodebuffer"
		* type).
		*
		* @type {String}
		*/
		get binaryType() {
			return this._binaryType;
		}
		set binaryType(type) {
			if (!BINARY_TYPES.includes(type)) return;
			this._binaryType = type;
			if (this._receiver) this._receiver._binaryType = type;
		}
		/**
		* @type {Number}
		*/
		get bufferedAmount() {
			if (!this._socket) return this._bufferedAmount;
			return this._socket._writableState.length + this._sender._bufferedBytes;
		}
		/**
		* @type {String}
		*/
		get extensions() {
			return Object.keys(this._extensions).join();
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onclose() {}
		/* istanbul ignore next */
		set onclose(listener) {}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onerror() {}
		/* istanbul ignore next */
		set onerror(listener) {}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onopen() {}
		/* istanbul ignore next */
		set onopen(listener) {}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onmessage() {}
		/* istanbul ignore next */
		set onmessage(listener) {}
		/**
		* @type {String}
		*/
		get protocol() {
			return this._protocol;
		}
		/**
		* @type {Number}
		*/
		get readyState() {
			return this._readyState;
		}
		/**
		* @type {String}
		*/
		get url() {
			return this._url;
		}
		/**
		* Set up the socket and the internal resources.
		*
		* @param {(net.Socket|tls.Socket)} socket The network socket between the
		*     server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Number} [maxPayload=0] The maximum allowed message size
		* @param {Number} [maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [maxFragments=0] The maximum number of message
		*     fragments
		* @private
		*/
		setSocket(socket, head, maxPayload, maxBufferedChunks, maxFragments) {
			const receiver = new Receiver(this.binaryType, this._extensions, this._isServer, maxPayload, maxBufferedChunks, maxFragments);
			this._sender = new Sender(socket, this._extensions);
			this._receiver = receiver;
			this._socket = socket;
			receiver[kWebSocket] = this;
			socket[kWebSocket] = this;
			receiver.on("conclude", receiverOnConclude);
			receiver.on("drain", receiverOnDrain);
			receiver.on("error", receiverOnError);
			receiver.on("message", receiverOnMessage);
			receiver.on("ping", receiverOnPing);
			receiver.on("pong", receiverOnPong);
			socket.setTimeout(0);
			socket.setNoDelay();
			if (head.length > 0) socket.unshift(head);
			socket.on("close", socketOnClose);
			socket.on("data", socketOnData);
			socket.on("end", socketOnEnd);
			socket.on("error", socketOnError);
			this._readyState = WebSocket.OPEN;
			this.emit("open");
		}
		/**
		* Emit the `'close'` event.
		*
		* @private
		*/
		emitClose() {
			if (!this._socket) {
				this._readyState = WebSocket.CLOSED;
				this.emit("close", this._closeCode, this._closeMessage);
				return;
			}
			if (this._extensions[PerMessageDeflate.extensionName]) this._extensions[PerMessageDeflate.extensionName].cleanup();
			this._receiver.removeAllListeners();
			this._readyState = WebSocket.CLOSED;
			this.emit("close", this._closeCode, this._closeMessage);
		}
		/**
		* Start a closing handshake.
		*
		*          +----------+   +-----------+   +----------+
		*     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
		*    |     +----------+   +-----------+   +----------+     |
		*          +----------+   +-----------+         |
		* CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
		*          +----------+   +-----------+   |
		*    |           |                        |   +---+        |
		*                +------------------------+-->|fin| - - - -
		*    |         +---+                      |   +---+
		*     - - - - -|fin|<---------------------+
		*              +---+
		*
		* @param {Number} [code] Status code explaining why the connection is closing
		* @param {String} [data] A string explaining why the connection is closing
		* @public
		*/
		close(code, data) {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) return abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
			if (this.readyState === WebSocket.CLOSING) {
				if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
				return;
			}
			this._readyState = WebSocket.CLOSING;
			this._sender.close(code, data, !this._isServer, (err) => {
				if (err) return;
				this._closeFrameSent = true;
				if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end();
			});
			this._closeTimer = setTimeout(this._socket.destroy.bind(this._socket), closeTimeout);
		}
		/**
		* Send a ping.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the ping is sent
		* @public
		*/
		ping(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.ping(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a pong.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the pong is sent
		* @public
		*/
		pong(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.pong(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a data message.
		*
		* @param {*} data The message to send
		* @param {Object} [options] Options object
		* @param {Boolean} [options.compress] Specifies whether or not to compress
		*     `data`
		* @param {Boolean} [options.binary] Specifies whether `data` is binary or
		*     text
		* @param {Boolean} [options.fin=true] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when data is written out
		* @public
		*/
		send(data, options, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof options === "function") {
				cb = options;
				options = {};
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			const opts = {
				binary: typeof data !== "string",
				mask: !this._isServer,
				compress: true,
				fin: true,
				...options
			};
			if (!this._extensions[PerMessageDeflate.extensionName]) opts.compress = false;
			this._sender.send(data || EMPTY_BUFFER, opts, cb);
		}
		/**
		* Forcibly close the connection.
		*
		* @public
		*/
		terminate() {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) return abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
			if (this._socket) {
				this._readyState = WebSocket.CLOSING;
				this._socket.destroy();
			}
		}
	};
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	[
		"binaryType",
		"bufferedAmount",
		"extensions",
		"protocol",
		"readyState",
		"url"
	].forEach((property) => {
		Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});
	[
		"open",
		"error",
		"close",
		"message"
	].forEach((method) => {
		Object.defineProperty(WebSocket.prototype, `on${method}`, {
			enumerable: true,
			get() {
				const listeners = this.listeners(method);
				for (let i = 0; i < listeners.length; i++) if (listeners[i]._listener) return listeners[i]._listener;
			},
			set(listener) {
				const listeners = this.listeners(method);
				for (let i = 0; i < listeners.length; i++) if (listeners[i]._listener) this.removeListener(method, listeners[i]);
				this.addEventListener(method, listener);
			}
		});
	});
	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;
	module.exports = WebSocket;
	/**
	* Initialize a WebSocket client.
	*
	* @param {WebSocket} websocket The client to initialize
	* @param {(String|URL)} address The URL to which to connect
	* @param {String} [protocols] The subprotocols
	* @param {Object} [options] Connection options
	* @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	*     permessage-deflate
	* @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	*     handshake request
	* @param {Number} [options.protocolVersion=13] Value of the
	*     `Sec-WebSocket-Version` header
	* @param {String} [options.origin] Value of the `Origin` or
	*     `Sec-WebSocket-Origin` header
	* @param {Number} [options.maxBufferedChunks=1048576] The maximum number of
	*     buffered data chunks
	* @param {Number} [options.maxFragments=131072] The maximum number of message
	*     fragments
	* @param {Number} [options.maxPayload=104857600] The maximum allowed message
	*     size
	* @param {Boolean} [options.followRedirects=false] Whether or not to follow
	*     redirects
	* @param {Number} [options.maxRedirects=10] The maximum number of redirects
	*     allowed
	* @private
	*/
	function initAsClient(websocket, address, protocols, options) {
		const opts = {
			protocolVersion: protocolVersions[1],
			maxBufferedChunks: 1024 * 1024,
			maxFragments: 128 * 1024,
			maxPayload: 100 * 1024 * 1024,
			perMessageDeflate: true,
			followRedirects: false,
			maxRedirects: 10,
			...options,
			createConnection: void 0,
			socketPath: void 0,
			hostname: void 0,
			protocol: void 0,
			timeout: void 0,
			method: void 0,
			host: void 0,
			path: void 0,
			port: void 0
		};
		if (!protocolVersions.includes(opts.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
		let parsedUrl;
		if (address instanceof URL$1) {
			parsedUrl = address;
			websocket._url = address.href;
		} else {
			parsedUrl = new URL$1(address);
			websocket._url = address;
		}
		const isUnixSocket = parsedUrl.protocol === "ws+unix:";
		if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
			const err = /* @__PURE__ */ new Error(`Invalid URL: ${websocket.url}`);
			if (websocket._redirects === 0) throw err;
			else {
				emitErrorAndClose(websocket, err);
				return;
			}
		}
		const isSecure = parsedUrl.protocol === "wss:" || parsedUrl.protocol === "https:";
		const defaultPort = isSecure ? 443 : 80;
		const key = randomBytes(16).toString("base64");
		const get = isSecure ? https.get : http$1.get;
		let perMessageDeflate;
		opts.createConnection = isSecure ? tlsConnect : netConnect;
		opts.defaultPort = opts.defaultPort || defaultPort;
		opts.port = parsedUrl.port || defaultPort;
		opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
		opts.headers = {
			"Sec-WebSocket-Version": opts.protocolVersion,
			"Sec-WebSocket-Key": key,
			Connection: "Upgrade",
			Upgrade: "websocket",
			...opts.headers
		};
		opts.path = parsedUrl.pathname + parsedUrl.search;
		opts.timeout = opts.handshakeTimeout;
		if (opts.perMessageDeflate) {
			perMessageDeflate = new PerMessageDeflate(opts.perMessageDeflate !== true ? opts.perMessageDeflate : {}, false, opts.maxPayload);
			opts.headers["Sec-WebSocket-Extensions"] = format({ [PerMessageDeflate.extensionName]: perMessageDeflate.offer() });
		}
		if (protocols) opts.headers["Sec-WebSocket-Protocol"] = protocols;
		if (opts.origin) if (opts.protocolVersion < 13) opts.headers["Sec-WebSocket-Origin"] = opts.origin;
		else opts.headers.Origin = opts.origin;
		if (parsedUrl.username || parsedUrl.password) opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
		if (isUnixSocket) {
			const parts = opts.path.split(":");
			opts.socketPath = parts[0];
			opts.path = parts[1];
		}
		if (opts.followRedirects) {
			if (websocket._redirects === 0) {
				websocket._originalUnixSocket = isUnixSocket;
				websocket._originalSecure = isSecure;
				websocket._originalHostOrSocketPath = isUnixSocket ? opts.socketPath : parsedUrl.host;
				const headers = options && options.headers;
				options = {
					...options,
					headers: {}
				};
				if (headers) for (const [key, value] of Object.entries(headers)) options.headers[key.toLowerCase()] = value;
			} else {
				const isSameHost = isUnixSocket ? websocket._originalUnixSocket ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalUnixSocket ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
				if (!isSameHost || websocket._originalSecure && !isSecure) {
					delete opts.headers.authorization;
					delete opts.headers.cookie;
					if (!isSameHost) delete opts.headers.host;
					opts.auth = void 0;
				}
			}
			if (opts.auth && !options.headers.authorization) options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
		}
		let req = websocket._req = get(opts);
		if (opts.timeout) req.on("timeout", () => {
			abortHandshake(websocket, req, "Opening handshake has timed out");
		});
		req.on("error", (err) => {
			if (req === null || req.aborted) return;
			req = websocket._req = null;
			emitErrorAndClose(websocket, err);
		});
		req.on("response", (res) => {
			const location = res.headers.location;
			const statusCode = res.statusCode;
			if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
				if (++websocket._redirects > opts.maxRedirects) {
					abortHandshake(websocket, req, "Maximum redirects exceeded");
					return;
				}
				req.abort();
				let addr;
				try {
					addr = new URL$1(location, address);
				} catch (err) {
					emitErrorAndClose(websocket, err);
					return;
				}
				initAsClient(websocket, addr, protocols, options);
			} else if (!websocket.emit("unexpected-response", req, res)) abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
		});
		req.on("upgrade", (res, socket, head) => {
			websocket.emit("upgrade", res);
			if (websocket.readyState !== WebSocket.CONNECTING) return;
			req = websocket._req = null;
			const upgrade = res.headers.upgrade;
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshake(websocket, socket, "Invalid Upgrade header");
				return;
			}
			const digest = createHash$1("sha1").update(key + GUID).digest("base64");
			if (res.headers["sec-websocket-accept"] !== digest) {
				abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
				return;
			}
			const serverProt = res.headers["sec-websocket-protocol"];
			const protList = (protocols || "").split(/, */);
			let protError;
			if (!protocols && serverProt) protError = "Server sent a subprotocol but none was requested";
			else if (protocols && !serverProt) protError = "Server sent no subprotocol";
			else if (serverProt && !protList.includes(serverProt)) protError = "Server sent an invalid subprotocol";
			if (protError) {
				abortHandshake(websocket, socket, protError);
				return;
			}
			if (serverProt) websocket._protocol = serverProt;
			const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
			if (secWebSocketExtensions !== void 0) {
				if (!perMessageDeflate) {
					abortHandshake(websocket, socket, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
					return;
				}
				let extensions;
				try {
					extensions = parse(secWebSocketExtensions);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				const extensionNames = Object.keys(extensions);
				if (extensionNames.length) {
					if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
						abortHandshake(websocket, socket, "Server indicated an extension that was not requested");
						return;
					}
					try {
						perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
					} catch (err) {
						abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
						return;
					}
					websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
				}
			}
			websocket.setSocket(socket, head, opts.maxPayload, opts.maxBufferedChunks, opts.maxFragments);
		});
	}
	/**
	* Emit the `'error'` and `'close'` event.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {Error} The error to emit
	* @private
	*/
	function emitErrorAndClose(websocket, err) {
		websocket._readyState = WebSocket.CLOSING;
		websocket.emit("error", err);
		websocket.emitClose();
	}
	/**
	* Create a `net.Socket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {net.Socket} The newly created socket used to start the connection
	* @private
	*/
	function netConnect(options) {
		options.path = options.socketPath;
		return net.connect(options);
	}
	/**
	* Create a `tls.TLSSocket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {tls.TLSSocket} The newly created socket used to start the connection
	* @private
	*/
	function tlsConnect(options) {
		options.path = void 0;
		if (!options.servername && options.servername !== "") options.servername = net.isIP(options.host) ? "" : options.host;
		return tls.connect(options);
	}
	/**
	* Abort the handshake and emit an error.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	*     abort or the socket to destroy
	* @param {String} message The error message
	* @private
	*/
	function abortHandshake(websocket, stream, message) {
		websocket._readyState = WebSocket.CLOSING;
		const err = new Error(message);
		Error.captureStackTrace(err, abortHandshake);
		if (stream.setHeader) {
			stream.abort();
			if (stream.socket && !stream.socket.destroyed) stream.socket.destroy();
			stream.once("abort", websocket.emitClose.bind(websocket));
			websocket.emit("error", err);
		} else {
			stream.destroy(err);
			stream.once("error", websocket.emit.bind(websocket, "error"));
			stream.once("close", websocket.emitClose.bind(websocket));
		}
	}
	/**
	* Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	* when the `readyState` attribute is `CLOSING` or `CLOSED`.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {*} [data] The data to send
	* @param {Function} [cb] Callback
	* @private
	*/
	function sendAfterClose(websocket, data, cb) {
		if (data) {
			const length = toBuffer(data).length;
			if (websocket._socket) websocket._sender._bufferedBytes += length;
			else websocket._bufferedAmount += length;
		}
		if (cb) cb(/* @__PURE__ */ new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`));
	}
	/**
	* The listener of the `Receiver` `'conclude'` event.
	*
	* @param {Number} code The status code
	* @param {String} reason The reason for closing
	* @private
	*/
	function receiverOnConclude(code, reason) {
		const websocket = this[kWebSocket];
		websocket._closeFrameReceived = true;
		websocket._closeMessage = reason;
		websocket._closeCode = code;
		if (websocket._socket[kWebSocket] === void 0) return;
		websocket._socket.removeListener("data", socketOnData);
		process.nextTick(resume, websocket._socket);
		if (code === 1005) websocket.close();
		else websocket.close(code, reason);
	}
	/**
	* The listener of the `Receiver` `'drain'` event.
	*
	* @private
	*/
	function receiverOnDrain() {
		this[kWebSocket]._socket.resume();
	}
	/**
	* The listener of the `Receiver` `'error'` event.
	*
	* @param {(RangeError|Error)} err The emitted error
	* @private
	*/
	function receiverOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket._socket[kWebSocket] !== void 0) {
			websocket._socket.removeListener("data", socketOnData);
			process.nextTick(resume, websocket._socket);
			websocket.close(err[kStatusCode]);
		}
		websocket.emit("error", err);
	}
	/**
	* The listener of the `Receiver` `'finish'` event.
	*
	* @private
	*/
	function receiverOnFinish() {
		this[kWebSocket].emitClose();
	}
	/**
	* The listener of the `Receiver` `'message'` event.
	*
	* @param {(String|Buffer|ArrayBuffer|Buffer[])} data The message
	* @private
	*/
	function receiverOnMessage(data) {
		this[kWebSocket].emit("message", data);
	}
	/**
	* The listener of the `Receiver` `'ping'` event.
	*
	* @param {Buffer} data The data included in the ping frame
	* @private
	*/
	function receiverOnPing(data) {
		const websocket = this[kWebSocket];
		websocket.pong(data, !websocket._isServer, NOOP);
		websocket.emit("ping", data);
	}
	/**
	* The listener of the `Receiver` `'pong'` event.
	*
	* @param {Buffer} data The data included in the pong frame
	* @private
	*/
	function receiverOnPong(data) {
		this[kWebSocket].emit("pong", data);
	}
	/**
	* Resume a readable stream
	*
	* @param {Readable} stream The readable stream
	* @private
	*/
	function resume(stream) {
		stream.resume();
	}
	/**
	* The listener of the `net.Socket` `'close'` event.
	*
	* @private
	*/
	function socketOnClose() {
		const websocket = this[kWebSocket];
		this.removeListener("close", socketOnClose);
		this.removeListener("data", socketOnData);
		this.removeListener("end", socketOnEnd);
		websocket._readyState = WebSocket.CLOSING;
		let chunk;
		if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && (chunk = websocket._socket.read()) !== null) websocket._receiver.write(chunk);
		websocket._receiver.end();
		this[kWebSocket] = void 0;
		clearTimeout(websocket._closeTimer);
		if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) websocket.emitClose();
		else {
			websocket._receiver.on("error", receiverOnFinish);
			websocket._receiver.on("finish", receiverOnFinish);
		}
	}
	/**
	* The listener of the `net.Socket` `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function socketOnData(chunk) {
		if (!this[kWebSocket]._receiver.write(chunk)) this.pause();
	}
	/**
	* The listener of the `net.Socket` `'end'` event.
	*
	* @private
	*/
	function socketOnEnd() {
		const websocket = this[kWebSocket];
		websocket._readyState = WebSocket.CLOSING;
		websocket._receiver.end();
		this.end();
	}
	/**
	* The listener of the `net.Socket` `'error'` event.
	*
	* @private
	*/
	function socketOnError() {
		const websocket = this[kWebSocket];
		this.removeListener("error", socketOnError);
		this.on("error", NOOP);
		if (websocket) {
			websocket._readyState = WebSocket.CLOSING;
			this.destroy();
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Duplex } = __require("stream");
	/**
	* Emits the `'close'` event on a stream.
	*
	* @param {Duplex} stream The stream.
	* @private
	*/
	function emitClose(stream) {
		stream.emit("close");
	}
	/**
	* The listener of the `'end'` event.
	*
	* @private
	*/
	function duplexOnEnd() {
		if (!this.destroyed && this._writableState.finished) this.destroy();
	}
	/**
	* The listener of the `'error'` event.
	*
	* @param {Error} err The error
	* @private
	*/
	function duplexOnError(err) {
		this.removeListener("error", duplexOnError);
		this.destroy();
		if (this.listenerCount("error") === 0) this.emit("error", err);
	}
	/**
	* Wraps a `WebSocket` in a duplex stream.
	*
	* @param {WebSocket} ws The `WebSocket` to wrap
	* @param {Object} [options] The options for the `Duplex` constructor
	* @return {Duplex} The duplex stream
	* @public
	*/
	function createWebSocketStream(ws, options) {
		let resumeOnReceiverDrain = true;
		let terminateOnDestroy = true;
		function receiverOnDrain() {
			if (resumeOnReceiverDrain) ws._socket.resume();
		}
		if (ws.readyState === ws.CONNECTING) ws.once("open", function open() {
			ws._receiver.removeAllListeners("drain");
			ws._receiver.on("drain", receiverOnDrain);
		});
		else {
			ws._receiver.removeAllListeners("drain");
			ws._receiver.on("drain", receiverOnDrain);
		}
		const duplex = new Duplex({
			...options,
			autoDestroy: false,
			emitClose: false,
			objectMode: false,
			writableObjectMode: false
		});
		ws.on("message", function message(msg) {
			if (!duplex.push(msg)) {
				resumeOnReceiverDrain = false;
				ws._socket.pause();
			}
		});
		ws.once("error", function error(err) {
			if (duplex.destroyed) return;
			terminateOnDestroy = false;
			duplex.destroy(err);
		});
		ws.once("close", function close() {
			if (duplex.destroyed) return;
			duplex.push(null);
		});
		duplex._destroy = function(err, callback) {
			if (ws.readyState === ws.CLOSED) {
				callback(err);
				process.nextTick(emitClose, duplex);
				return;
			}
			let called = false;
			ws.once("error", function error(err) {
				called = true;
				callback(err);
			});
			ws.once("close", function close() {
				if (!called) callback(err);
				process.nextTick(emitClose, duplex);
			});
			if (terminateOnDestroy) ws.terminate();
		};
		duplex._final = function(callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._final(callback);
				});
				return;
			}
			if (ws._socket === null) return;
			if (ws._socket._writableState.finished) {
				callback();
				if (duplex._readableState.endEmitted) duplex.destroy();
			} else {
				ws._socket.once("finish", function finish() {
					callback();
				});
				ws.close();
			}
		};
		duplex._read = function() {
			if ((ws.readyState === ws.OPEN || ws.readyState === ws.CLOSING) && !resumeOnReceiverDrain) {
				resumeOnReceiverDrain = true;
				if (!ws._receiver._writableState.needDrain) ws._socket.resume();
			}
		};
		duplex._write = function(chunk, encoding, callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._write(chunk, encoding, callback);
				});
				return;
			}
			ws.send(chunk, callback);
		};
		duplex.on("end", duplexOnEnd);
		duplex.on("error", duplexOnError);
		return duplex;
	}
	module.exports = createWebSocketStream;
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/lib/websocket-server.js
var require_websocket_server = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$1 = __require("events");
	var http = __require("http");
	__require("https");
	__require("net");
	__require("tls");
	var { createHash } = __require("crypto");
	var PerMessageDeflate = require_permessage_deflate();
	var WebSocket = require_websocket();
	var { format, parse } = require_extension();
	var { GUID, kWebSocket } = require_constants();
	var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
	var RUNNING = 0;
	var CLOSING = 1;
	var CLOSED = 2;
	/**
	* Class representing a WebSocket server.
	*
	* @extends EventEmitter
	*/
	var WebSocketServer = class extends EventEmitter$1 {
		/**
		* Create a `WebSocketServer` instance.
		*
		* @param {Object} options Configuration options
		* @param {Number} [options.backlog=511] The maximum length of the queue of
		*     pending connections
		* @param {Boolean} [options.clientTracking=true] Specifies whether or not to
		*     track clients
		* @param {Function} [options.handleProtocols] A hook to handle protocols
		* @param {String} [options.host] The hostname where to bind the server
		* @param {Number} [options.maxBufferedChunks=1048576] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=131072] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=104857600] The maximum allowed message
		*     size
		* @param {Boolean} [options.noServer=false] Enable no server mode
		* @param {String} [options.path] Accept only connections matching this path
		* @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
		*     permessage-deflate
		* @param {Number} [options.port] The port where to bind the server
		* @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
		*     server to use
		* @param {Function} [options.verifyClient] A hook to reject connections
		* @param {Function} [callback] A listener for the `listening` event
		*/
		constructor(options, callback) {
			super();
			options = {
				maxBufferedChunks: 1024 * 1024,
				maxFragments: 128 * 1024,
				maxPayload: 100 * 1024 * 1024,
				perMessageDeflate: false,
				handleProtocols: null,
				clientTracking: true,
				verifyClient: null,
				noServer: false,
				backlog: null,
				server: null,
				host: null,
				path: null,
				port: null,
				...options
			};
			if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) throw new TypeError("One and only one of the \"port\", \"server\", or \"noServer\" options must be specified");
			if (options.port != null) {
				this._server = http.createServer((req, res) => {
					const body = http.STATUS_CODES[426];
					res.writeHead(426, {
						"Content-Length": body.length,
						"Content-Type": "text/plain"
					});
					res.end(body);
				});
				this._server.listen(options.port, options.host, options.backlog, callback);
			} else if (options.server) this._server = options.server;
			if (this._server) {
				const emitConnection = this.emit.bind(this, "connection");
				this._removeListeners = addListeners(this._server, {
					listening: this.emit.bind(this, "listening"),
					error: this.emit.bind(this, "error"),
					upgrade: (req, socket, head) => {
						this.handleUpgrade(req, socket, head, emitConnection);
					}
				});
			}
			if (options.perMessageDeflate === true) options.perMessageDeflate = {};
			if (options.clientTracking) this.clients = /* @__PURE__ */ new Set();
			this.options = options;
			this._state = RUNNING;
		}
		/**
		* Returns the bound address, the address family name, and port of the server
		* as reported by the operating system if listening on an IP socket.
		* If the server is listening on a pipe or UNIX domain socket, the name is
		* returned as a string.
		*
		* @return {(Object|String|null)} The address of the server
		* @public
		*/
		address() {
			if (this.options.noServer) throw new Error("The server is operating in \"noServer\" mode");
			if (!this._server) return null;
			return this._server.address();
		}
		/**
		* Close the server.
		*
		* @param {Function} [cb] Callback
		* @public
		*/
		close(cb) {
			if (cb) this.once("close", cb);
			if (this._state === CLOSED) {
				process.nextTick(emitClose, this);
				return;
			}
			if (this._state === CLOSING) return;
			this._state = CLOSING;
			if (this.clients) for (const client of this.clients) client.terminate();
			const server = this._server;
			if (server) {
				this._removeListeners();
				this._removeListeners = this._server = null;
				if (this.options.port != null) {
					server.close(emitClose.bind(void 0, this));
					return;
				}
			}
			process.nextTick(emitClose, this);
		}
		/**
		* See if a given request should be handled by this server instance.
		*
		* @param {http.IncomingMessage} req Request object to inspect
		* @return {Boolean} `true` if the request is valid, else `false`
		* @public
		*/
		shouldHandle(req) {
			if (this.options.path) {
				const index = req.url.indexOf("?");
				if ((index !== -1 ? req.url.slice(0, index) : req.url) !== this.options.path) return false;
			}
			return true;
		}
		/**
		* Handle a HTTP Upgrade request.
		*
		* @param {http.IncomingMessage} req The request object
		* @param {(net.Socket|tls.Socket)} socket The network socket between the
		*     server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @public
		*/
		handleUpgrade(req, socket, head, cb) {
			socket.on("error", socketOnError);
			const key = req.headers["sec-websocket-key"] !== void 0 ? req.headers["sec-websocket-key"].trim() : false;
			const upgrade = req.headers.upgrade;
			const version = +req.headers["sec-websocket-version"];
			const extensions = {};
			if (req.method !== "GET" || upgrade === void 0 || upgrade.toLowerCase() !== "websocket" || !key || !keyRegex.test(key) || version !== 8 && version !== 13 || !this.shouldHandle(req)) return abortHandshake(socket, 400);
			if (this.options.perMessageDeflate) {
				const perMessageDeflate = new PerMessageDeflate(this.options.perMessageDeflate, true, this.options.maxPayload);
				try {
					const offers = parse(req.headers["sec-websocket-extensions"]);
					if (offers[PerMessageDeflate.extensionName]) {
						perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
						extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
					}
				} catch (err) {
					return abortHandshake(socket, 400);
				}
			}
			if (this.options.verifyClient) {
				const info = {
					origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
					secure: !!(req.socket.authorized || req.socket.encrypted),
					req
				};
				if (this.options.verifyClient.length === 2) {
					this.options.verifyClient(info, (verified, code, message, headers) => {
						if (!verified) return abortHandshake(socket, code || 401, message, headers);
						this.completeUpgrade(key, extensions, req, socket, head, cb);
					});
					return;
				}
				if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
			}
			this.completeUpgrade(key, extensions, req, socket, head, cb);
		}
		/**
		* Upgrade the connection to WebSocket.
		*
		* @param {String} key The value of the `Sec-WebSocket-Key` header
		* @param {Object} extensions The accepted extensions
		* @param {http.IncomingMessage} req The request object
		* @param {(net.Socket|tls.Socket)} socket The network socket between the
		*     server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @throws {Error} If called more than once with the same socket
		* @private
		*/
		completeUpgrade(key, extensions, req, socket, head, cb) {
			if (!socket.readable || !socket.writable) return socket.destroy();
			if (socket[kWebSocket]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
			if (this._state > RUNNING) return abortHandshake(socket, 503);
			const headers = [
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-WebSocket-Accept: ${createHash("sha1").update(key + GUID).digest("base64")}`
			];
			const ws = new WebSocket(null);
			let protocol = req.headers["sec-websocket-protocol"];
			if (protocol) {
				protocol = protocol.split(",").map(trim);
				if (this.options.handleProtocols) protocol = this.options.handleProtocols(protocol, req);
				else protocol = protocol[0];
				if (protocol) {
					headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
					ws._protocol = protocol;
				}
			}
			if (extensions[PerMessageDeflate.extensionName]) {
				const params = extensions[PerMessageDeflate.extensionName].params;
				const value = format({ [PerMessageDeflate.extensionName]: [params] });
				headers.push(`Sec-WebSocket-Extensions: ${value}`);
				ws._extensions = extensions;
			}
			this.emit("headers", headers, req);
			socket.write(headers.concat("\r\n").join("\r\n"));
			socket.removeListener("error", socketOnError);
			ws.setSocket(socket, head, this.options.maxPayload, this.options.maxBufferedChunks, this.options.maxFragments);
			if (this.clients) {
				this.clients.add(ws);
				ws.on("close", () => this.clients.delete(ws));
			}
			cb(ws, req);
		}
	};
	module.exports = WebSocketServer;
	/**
	* Add event listeners on an `EventEmitter` using a map of <event, listener>
	* pairs.
	*
	* @param {EventEmitter} server The event emitter
	* @param {Object.<String, Function>} map The listeners to add
	* @return {Function} A function that will remove the added listeners when
	*     called
	* @private
	*/
	function addListeners(server, map) {
		for (const event of Object.keys(map)) server.on(event, map[event]);
		return function removeListeners() {
			for (const event of Object.keys(map)) server.removeListener(event, map[event]);
		};
	}
	/**
	* Emit a `'close'` event on an `EventEmitter`.
	*
	* @param {EventEmitter} server The event emitter
	* @private
	*/
	function emitClose(server) {
		server._state = CLOSED;
		server.emit("close");
	}
	/**
	* Handle premature socket errors.
	*
	* @private
	*/
	function socketOnError() {
		this.destroy();
	}
	/**
	* Close the connection when preconditions are not fulfilled.
	*
	* @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} [message] The HTTP response body
	* @param {Object} [headers] Additional HTTP response headers
	* @private
	*/
	function abortHandshake(socket, code, message, headers) {
		if (socket.writable) {
			message = message || http.STATUS_CODES[code];
			headers = {
				Connection: "close",
				"Content-Type": "text/html",
				"Content-Length": Buffer.byteLength(message),
				...headers
			};
			socket.write(`HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
		}
		socket.removeListener("error", socketOnError);
		socket.destroy();
	}
	/**
	* Remove whitespace characters from both ends of a string.
	*
	* @param {String} str The string
	* @return {String} A new string representing `str` stripped of whitespace
	*     characters from both its beginning and end
	* @private
	*/
	function trim(str) {
		return str.trim();
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/ws@7.5.11_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/ws/index.js
var require_ws = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var WebSocket = require_websocket();
	WebSocket.createWebSocketStream = require_stream();
	WebSocket.Server = require_websocket_server();
	WebSocket.Receiver = require_receiver();
	WebSocket.Sender = require_sender();
	module.exports = WebSocket;
}));
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+jsonrpc-ws-connection@1.0.16_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/@walletconnect/jsonrpc-ws-connection/dist/index.es.js
var v$1 = () => typeof WebSocket < "u" ? WebSocket : typeof global < "u" && typeof global.WebSocket < "u" ? global.WebSocket : typeof window < "u" && typeof window.WebSocket < "u" ? window.WebSocket : typeof self < "u" && typeof self.WebSocket < "u" ? self.WebSocket : require_ws(), w$1 = () => typeof WebSocket < "u" || typeof global < "u" && typeof global.WebSocket < "u" || typeof window < "u" && typeof window.WebSocket < "u" || typeof self < "u" && typeof self.WebSocket < "u", d = (r) => r.split("?")[0], h = 10, b = v$1();
var f$2 = class {
	constructor(e) {
		if (this.url = e, this.events = new EventEmitter(), this.registering = !1, !isWsUrl(e)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e}`);
		this.url = e;
	}
	get connected() {
		return typeof this.socket < "u";
	}
	get connecting() {
		return this.registering;
	}
	on(e, t) {
		this.events.on(e, t);
	}
	once(e, t) {
		this.events.once(e, t);
	}
	off(e, t) {
		this.events.off(e, t);
	}
	removeListener(e, t) {
		this.events.removeListener(e, t);
	}
	async open(e = this.url) {
		await this.register(e);
	}
	async close() {
		return new Promise((e, t) => {
			if (typeof this.socket > "u") {
				t(/* @__PURE__ */ new Error("Connection already closed"));
				return;
			}
			this.socket.onclose = (n) => {
				this.onClose(n), e();
			}, this.socket.close();
		});
	}
	async send(e) {
		typeof this.socket > "u" && (this.socket = await this.register());
		try {
			this.socket.send(safeJsonStringify(e));
		} catch (t) {
			this.onError(e.id, t);
		}
	}
	register(e = this.url) {
		if (!isWsUrl(e)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e}`);
		if (this.registering) {
			const t = this.events.getMaxListeners();
			return (this.events.listenerCount("register_error") >= t || this.events.listenerCount("open") >= t) && this.events.setMaxListeners(t + 1), new Promise((n, s) => {
				this.events.once("register_error", (o) => {
					this.resetMaxListeners(), s(o);
				}), this.events.once("open", () => {
					if (this.resetMaxListeners(), typeof this.socket > "u") return s(/* @__PURE__ */ new Error("WebSocket connection is missing or invalid"));
					n(this.socket);
				});
			});
		}
		return this.url = e, this.registering = !0, new Promise((t, n) => {
			const o = new b(e, [], (0, esm_exports.isReactNative)() ? void 0 : { rejectUnauthorized: !isLocalhostUrl(e) });
			w$1() ? o.onerror = (i) => {
				const a = i;
				n(this.emitError(a.error));
			} : o.on("error", (i) => {
				n(this.emitError(i));
			}), o.onopen = () => {
				this.onOpen(o), t(o);
			};
		});
	}
	onOpen(e) {
		e.onmessage = (t) => this.onPayload(t), e.onclose = (t) => this.onClose(t), this.socket = e, this.registering = !1, this.events.emit("open");
	}
	onClose(e) {
		this.socket = void 0, this.registering = !1, this.events.emit("close", e);
	}
	onPayload(e) {
		if (typeof e.data > "u") return;
		const t = typeof e.data == "string" ? safeJsonParse(e.data) : e.data;
		this.events.emit("payload", t);
	}
	onError(e, t) {
		const n = this.parseError(t), o = formatJsonRpcError(e, n.message || n.toString());
		this.events.emit("payload", o);
	}
	parseError(e, t = this.url) {
		return parseConnectionError(e, d(t), "WS");
	}
	resetMaxListeners() {
		this.events.getMaxListeners() > h && this.events.setMaxListeners(h);
	}
	emitError(e) {
		const t = this.parseError(new Error(e?.message || `WebSocket connection failed for host: ${d(this.url)}`));
		return this.events.emit("register_error", t), t;
	}
}, he = "core", B = `wc@2:${he}:`, Et$1 = {
	name: he,
	logger: "error"
}, It = { database: ":memory:" }, Tt = "crypto", ke$1 = "client_ed25519_seed", Ct = import_cjs$3.ONE_DAY, Pt = "keychain", Ot = "messages", je = import_cjs$3.SIX_HOURS, At = "publisher", $t = "relayer", C = {
	message: "relayer_message",
	message_ack: "relayer_message_ack",
	connect: "relayer_connect",
	disconnect: "relayer_disconnect",
	error: "relayer_error",
	connection_stalled: "relayer_connection_stalled",
	transport_closed: "relayer_transport_closed",
	publish: "relayer_publish"
}, L = {
	payload: "payload",
	connect: "connect",
	disconnect: "disconnect",
	error: "error"
}, _e$1 = "2.21.5", Q = {
	link_mode: "link_mode",
	relay: "relay"
}, le = {
	inbound: "inbound",
	outbound: "outbound"
}, jt = "WALLETCONNECT_CLIENT_ID", $$1 = {
	created: "subscription_created",
	deleted: "subscription_deleted",
	expired: "subscription_expired",
	disabled: "subscription_disabled",
	sync: "subscription_sync",
	resubscribed: "subscription_resubscribed"
};
import_cjs$3.THIRTY_DAYS;
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+core@2.21.5_bufferutil@4.1.0_db0@0.3.4_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/@walletconnect/core/dist/index.es.js
var Ut = "subscription";
import_cjs$3.FIVE_SECONDS * 1e3;
var Mt = "pairing";
import_cjs$3.THIRTY_DAYS;
var se = {
	wc_pairingDelete: {
		req: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1e3
		},
		res: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1001
		}
	},
	wc_pairingPing: {
		req: {
			ttl: import_cjs$3.THIRTY_SECONDS,
			prompt: !1,
			tag: 1002
		},
		res: {
			ttl: import_cjs$3.THIRTY_SECONDS,
			prompt: !1,
			tag: 1003
		}
	},
	unregistered_method: {
		req: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 0
		},
		res: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 0
		}
	}
}, re = {
	create: "pairing_create",
	expire: "pairing_expire",
	delete: "pairing_delete",
	ping: "pairing_ping"
}, F = {
	created: "history_created",
	updated: "history_updated",
	deleted: "history_deleted",
	sync: "history_sync"
}, Bt = "history", qt = "expirer", M = {
	created: "expirer_created",
	deleted: "expirer_deleted",
	expired: "expirer_expired",
	sync: "expirer_sync"
};
import_cjs$3.ONE_DAY;
var Wt = "verify-api", Qs = "https://verify.walletconnect.com", Ht = "https://verify.walletconnect.org", Yt = `${Ht}/v3`, Jt = [Qs, Ht], Xt = "echo", Zt = "https://echo.walletconnect.com", G = {
	pairing_started: "pairing_started",
	pairing_uri_validation_success: "pairing_uri_validation_success",
	pairing_uri_not_expired: "pairing_uri_not_expired",
	store_new_pairing: "store_new_pairing",
	subscribing_pairing_topic: "subscribing_pairing_topic",
	subscribe_pairing_topic_success: "subscribe_pairing_topic_success",
	existing_pairing: "existing_pairing",
	pairing_not_expired: "pairing_not_expired",
	emit_inactive_pairing: "emit_inactive_pairing",
	emit_session_proposal: "emit_session_proposal",
	subscribing_to_pairing_topic: "subscribing_to_pairing_topic"
}, Y = {
	no_wss_connection: "no_wss_connection",
	no_internet_connection: "no_internet_connection",
	malformed_pairing_uri: "malformed_pairing_uri",
	active_pairing_already_exists: "active_pairing_already_exists",
	subscribe_pairing_topic_failure: "subscribe_pairing_topic_failure",
	pairing_expired: "pairing_expired",
	proposal_expired: "proposal_expired",
	proposal_listener_not_found: "proposal_listener_not_found"
}, tr = {
	session_approve_started: "session_approve_started",
	proposal_not_expired: "proposal_not_expired",
	session_namespaces_validation_success: "session_namespaces_validation_success",
	create_session_topic: "create_session_topic",
	subscribing_session_topic: "subscribing_session_topic",
	subscribe_session_topic_success: "subscribe_session_topic_success",
	publishing_session_approve: "publishing_session_approve",
	session_approve_publish_success: "session_approve_publish_success",
	store_session: "store_session",
	publishing_session_settle: "publishing_session_settle",
	session_settle_publish_success: "session_settle_publish_success"
}, ir = {
	no_internet_connection: "no_internet_connection",
	no_wss_connection: "no_wss_connection",
	proposal_expired: "proposal_expired",
	subscribe_session_topic_failure: "subscribe_session_topic_failure",
	session_approve_publish_failure: "session_approve_publish_failure",
	session_settle_publish_failure: "session_settle_publish_failure",
	session_approve_namespace_validation_failure: "session_approve_namespace_validation_failure",
	proposal_not_found: "proposal_not_found"
}, sr = {
	authenticated_session_approve_started: "authenticated_session_approve_started",
	authenticated_session_not_expired: "authenticated_session_not_expired",
	chains_caip2_compliant: "chains_caip2_compliant",
	chains_evm_compliant: "chains_evm_compliant",
	create_authenticated_session_topic: "create_authenticated_session_topic",
	cacaos_verified: "cacaos_verified",
	store_authenticated_session: "store_authenticated_session",
	subscribing_authenticated_session_topic: "subscribing_authenticated_session_topic",
	subscribe_authenticated_session_topic_success: "subscribe_authenticated_session_topic_success",
	publishing_authenticated_session_approve: "publishing_authenticated_session_approve",
	authenticated_session_approve_publish_success: "authenticated_session_approve_publish_success"
}, rr = {
	no_internet_connection: "no_internet_connection",
	no_wss_connection: "no_wss_connection",
	missing_session_authenticate_request: "missing_session_authenticate_request",
	session_authenticate_request_expired: "session_authenticate_request_expired",
	chains_caip2_compliant_failure: "chains_caip2_compliant_failure",
	chains_evm_compliant_failure: "chains_evm_compliant_failure",
	invalid_cacao: "invalid_cacao",
	subscribe_authenticated_session_topic_failure: "subscribe_authenticated_session_topic_failure",
	authenticated_session_approve_publish_failure: "authenticated_session_approve_publish_failure",
	authenticated_session_pending_request_not_found: "authenticated_session_pending_request_not_found"
}, Qt = .1, ei = "event-client", ii = "https://pulse.walletconnect.org/batch";
function nr(r, e) {
	if (r.length >= 255) throw new TypeError("Alphabet too long");
	for (var t = new Uint8Array(256), i = 0; i < t.length; i++) t[i] = 255;
	for (var s = 0; s < r.length; s++) {
		var n = r.charAt(s), o = n.charCodeAt(0);
		if (t[o] !== 255) throw new TypeError(n + " is ambiguous");
		t[o] = s;
	}
	var a = r.length, c = r.charAt(0), h = Math.log(a) / Math.log(256), l = Math.log(256) / Math.log(a);
	function d(u) {
		if (u instanceof Uint8Array || (ArrayBuffer.isView(u) ? u = new Uint8Array(u.buffer, u.byteOffset, u.byteLength) : Array.isArray(u) && (u = Uint8Array.from(u))), !(u instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
		if (u.length === 0) return "";
		for (var b = 0, x = 0, I = 0, D = u.length; I !== D && u[I] === 0;) I++, b++;
		for (var j = (D - I) * l + 1 >>> 0, T = new Uint8Array(j); I !== D;) {
			for (var q = u[I], J = 0, K = j - 1; (q !== 0 || J < x) && K !== -1; K--, J++) q += 256 * T[K] >>> 0, T[K] = q % a >>> 0, q = q / a >>> 0;
			if (q !== 0) throw new Error("Non-zero carry");
			x = J, I++;
		}
		for (var H = j - x; H !== j && T[H] === 0;) H++;
		for (var me = c.repeat(b); H < j; ++H) me += r.charAt(T[H]);
		return me;
	}
	function g(u) {
		if (typeof u != "string") throw new TypeError("Expected String");
		if (u.length === 0) return new Uint8Array();
		var b = 0;
		if (u[b] !== " ") {
			for (var x = 0, I = 0; u[b] === c;) x++, b++;
			for (var D = (u.length - b) * h + 1 >>> 0, j = new Uint8Array(D); u[b];) {
				var T = t[u.charCodeAt(b)];
				if (T === 255) return;
				for (var q = 0, J = D - 1; (T !== 0 || q < I) && J !== -1; J--, q++) T += a * j[J] >>> 0, j[J] = T % 256 >>> 0, T = T / 256 >>> 0;
				if (T !== 0) throw new Error("Non-zero carry");
				I = q, b++;
			}
			if (u[b] !== " ") {
				for (var K = D - I; K !== D && j[K] === 0;) K++;
				for (var H = new Uint8Array(x + (D - K)), me = x; K !== D;) H[me++] = j[K++];
				return H;
			}
		}
	}
	function _(u) {
		var b = g(u);
		if (b) return b;
		throw new Error(`Non-${e} character`);
	}
	return {
		encode: d,
		decodeUnsafe: g,
		decode: _
	};
}
var ar = nr;
var si = (r) => {
	if (r instanceof Uint8Array && r.constructor.name === "Uint8Array") return r;
	if (r instanceof ArrayBuffer) return new Uint8Array(r);
	if (ArrayBuffer.isView(r)) return new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
	throw new Error("Unknown type, must be binary type");
}, cr = (r) => new TextEncoder().encode(r), hr = (r) => new TextDecoder().decode(r);
var lr = class {
	constructor(e, t, i) {
		this.name = e, this.prefix = t, this.baseEncode = i;
	}
	encode(e) {
		if (e instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e)}`;
		throw Error("Unknown type, must be binary type");
	}
};
var ur = class {
	constructor(e, t, i) {
		if (this.name = e, this.prefix = t, t.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
		this.prefixCodePoint = t.codePointAt(0), this.baseDecode = i;
	}
	decode(e) {
		if (typeof e == "string") {
			if (e.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
			return this.baseDecode(e.slice(this.prefix.length));
		} else throw Error("Can only multibase decode strings");
	}
	or(e) {
		return ri(this, e);
	}
};
var dr = class {
	constructor(e) {
		this.decoders = e;
	}
	or(e) {
		return ri(this, e);
	}
	decode(e) {
		const t = e[0], i = this.decoders[t];
		if (i) return i.decode(e);
		throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
	}
};
var ri = (r, e) => new dr({
	...r.decoders || { [r.prefix]: r },
	...e.decoders || { [e.prefix]: e }
});
var gr = class {
	constructor(e, t, i, s) {
		this.name = e, this.prefix = t, this.baseEncode = i, this.baseDecode = s, this.encoder = new lr(e, t, i), this.decoder = new ur(e, t, s);
	}
	encode(e) {
		return this.encoder.encode(e);
	}
	decode(e) {
		return this.decoder.decode(e);
	}
};
var Ee$1 = ({ name: r, prefix: e, encode: t, decode: i }) => new gr(r, e, t, i), de = ({ prefix: r, name: e, alphabet: t }) => {
	const { encode: i, decode: s } = ar(t, e);
	return Ee$1({
		prefix: r,
		name: e,
		encode: i,
		decode: (n) => si(s(n))
	});
}, pr = (r, e, t, i) => {
	const s = {};
	for (let l = 0; l < e.length; ++l) s[e[l]] = l;
	let n = r.length;
	for (; r[n - 1] === "=";) --n;
	const o = new Uint8Array(n * t / 8 | 0);
	let a = 0, c = 0, h = 0;
	for (let l = 0; l < n; ++l) {
		const d = s[r[l]];
		if (d === void 0) throw new SyntaxError(`Non-${i} character`);
		c = c << t | d, a += t, a >= 8 && (a -= 8, o[h++] = 255 & c >> a);
	}
	if (a >= t || 255 & c << 8 - a) throw new SyntaxError("Unexpected end of data");
	return o;
}, yr = (r, e, t) => {
	const i = e[e.length - 1] === "=", s = (1 << t) - 1;
	let n = "", o = 0, a = 0;
	for (let c = 0; c < r.length; ++c) for (a = a << 8 | r[c], o += 8; o > t;) o -= t, n += e[s & a >> o];
	if (o && (n += e[s & a << t - o]), i) for (; n.length * t & 7;) n += "=";
	return n;
}, P = ({ name: r, prefix: e, bitsPerChar: t, alphabet: i }) => Ee$1({
	prefix: e,
	name: r,
	encode(s) {
		return yr(s, i, t);
	},
	decode(s) {
		return pr(s, i, t, r);
	}
}), br = Ee$1({
	prefix: "\0",
	name: "identity",
	encode: (r) => hr(r),
	decode: (r) => cr(r)
});
var mr = Object.freeze({
	__proto__: null,
	identity: br
});
var fr = P({
	prefix: "0",
	name: "base2",
	alphabet: "01",
	bitsPerChar: 1
});
var Dr = Object.freeze({
	__proto__: null,
	base2: fr
});
var vr = P({
	prefix: "7",
	name: "base8",
	alphabet: "01234567",
	bitsPerChar: 3
});
var wr = Object.freeze({
	__proto__: null,
	base8: vr
});
var _r = de({
	prefix: "9",
	name: "base10",
	alphabet: "0123456789"
});
var Er = Object.freeze({
	__proto__: null,
	base10: _r
});
var Ir = P({
	prefix: "f",
	name: "base16",
	alphabet: "0123456789abcdef",
	bitsPerChar: 4
}), Tr = P({
	prefix: "F",
	name: "base16upper",
	alphabet: "0123456789ABCDEF",
	bitsPerChar: 4
});
var Cr = Object.freeze({
	__proto__: null,
	base16: Ir,
	base16upper: Tr
});
var Pr = P({
	prefix: "b",
	name: "base32",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567",
	bitsPerChar: 5
}), Sr = P({
	prefix: "B",
	name: "base32upper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	bitsPerChar: 5
}), Or = P({
	prefix: "c",
	name: "base32pad",
	alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
	bitsPerChar: 5
}), Rr = P({
	prefix: "C",
	name: "base32padupper",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
	bitsPerChar: 5
}), Ar = P({
	prefix: "v",
	name: "base32hex",
	alphabet: "0123456789abcdefghijklmnopqrstuv",
	bitsPerChar: 5
}), xr = P({
	prefix: "V",
	name: "base32hexupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	bitsPerChar: 5
}), Nr = P({
	prefix: "t",
	name: "base32hexpad",
	alphabet: "0123456789abcdefghijklmnopqrstuv=",
	bitsPerChar: 5
}), $r = P({
	prefix: "T",
	name: "base32hexpadupper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
	bitsPerChar: 5
}), zr = P({
	prefix: "h",
	name: "base32z",
	alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
	bitsPerChar: 5
});
var Lr = Object.freeze({
	__proto__: null,
	base32: Pr,
	base32upper: Sr,
	base32pad: Or,
	base32padupper: Rr,
	base32hex: Ar,
	base32hexupper: xr,
	base32hexpad: Nr,
	base32hexpadupper: $r,
	base32z: zr
});
var kr = de({
	prefix: "k",
	name: "base36",
	alphabet: "0123456789abcdefghijklmnopqrstuvwxyz"
}), jr = de({
	prefix: "K",
	name: "base36upper",
	alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
});
var Ur = Object.freeze({
	__proto__: null,
	base36: kr,
	base36upper: jr
});
var Fr = de({
	name: "base58btc",
	prefix: "z",
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
}), Mr = de({
	name: "base58flickr",
	prefix: "Z",
	alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
});
var Kr = Object.freeze({
	__proto__: null,
	base58btc: Fr,
	base58flickr: Mr
});
var Br = P({
	prefix: "m",
	name: "base64",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
	bitsPerChar: 6
}), Vr = P({
	prefix: "M",
	name: "base64pad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	bitsPerChar: 6
}), qr = P({
	prefix: "u",
	name: "base64url",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
	bitsPerChar: 6
}), Gr = P({
	prefix: "U",
	name: "base64urlpad",
	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
	bitsPerChar: 6
});
var Wr = Object.freeze({
	__proto__: null,
	base64: Br,
	base64pad: Vr,
	base64url: qr,
	base64urlpad: Gr
});
var ni = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"), Hr = ni.reduce((r, e, t) => (r[t] = e, r), []), Yr = ni.reduce((r, e, t) => (r[e.codePointAt(0)] = t, r), []);
function Jr(r) {
	return r.reduce((e, t) => (e += Hr[t], e), "");
}
function Xr(r) {
	const e = [];
	for (const t of r) {
		const i = Yr[t.codePointAt(0)];
		if (i === void 0) throw new Error(`Non-base256emoji character: ${t}`);
		e.push(i);
	}
	return new Uint8Array(e);
}
var Zr = Ee$1({
	prefix: "🚀",
	name: "base256emoji",
	encode: Jr,
	decode: Xr
});
var Qr = Object.freeze({
	__proto__: null,
	base256emoji: Zr
}), en = ai, oi = 128, sn = -128, rn = Math.pow(2, 31);
function ai(r, e, t) {
	e = e || [], t = t || 0;
	for (var i = t; r >= rn;) e[t++] = r & 255 | oi, r /= 128;
	for (; r & sn;) e[t++] = r & 255 | oi, r >>>= 7;
	return e[t] = r | 0, ai.bytes = t - i + 1, e;
}
var nn = Me$1, on = 128, ci = 127;
function Me$1(r, i) {
	var t = 0, i = i || 0, s = 0, n = i, o, a = r.length;
	do {
		if (n >= a) throw Me$1.bytes = 0, /* @__PURE__ */ new RangeError("Could not decode varint");
		o = r[n++], t += s < 28 ? (o & ci) << s : (o & ci) * Math.pow(2, s), s += 7;
	} while (o >= on);
	return Me$1.bytes = n - i, t;
}
var an = Math.pow(2, 7), cn = Math.pow(2, 14), hn = Math.pow(2, 21), ln = Math.pow(2, 28), un = Math.pow(2, 35), dn = Math.pow(2, 42), gn = Math.pow(2, 49), pn = Math.pow(2, 56), yn = Math.pow(2, 63), bn = function(r) {
	return r < an ? 1 : r < cn ? 2 : r < hn ? 3 : r < ln ? 4 : r < un ? 5 : r < dn ? 6 : r < gn ? 7 : r < pn ? 8 : r < yn ? 9 : 10;
}, hi = {
	encode: en,
	decode: nn,
	encodingLength: bn
};
var li = (r, e, t = 0) => (hi.encode(r, e, t), e), ui = (r) => hi.encodingLength(r), Ke$1 = (r, e) => {
	const t = e.byteLength, i = ui(r), s = i + ui(t), n = new Uint8Array(s + t);
	return li(r, n, 0), li(t, n, i), n.set(e, s), new fn(r, t, e, n);
};
var fn = class {
	constructor(e, t, i, s) {
		this.code = e, this.size = t, this.digest = i, this.bytes = s;
	}
};
var di = ({ name: r, code: e, encode: t }) => new Dn(r, e, t);
var Dn = class {
	constructor(e, t, i) {
		this.name = e, this.code = t, this.encode = i;
	}
	digest(e) {
		if (e instanceof Uint8Array) {
			const t = this.encode(e);
			return t instanceof Uint8Array ? Ke$1(this.code, t) : t.then((i) => Ke$1(this.code, i));
		} else throw Error("Unknown type, must be binary type");
	}
};
var gi = (r) => async (e) => new Uint8Array(await crypto.subtle.digest(r, e)), vn = di({
	name: "sha2-256",
	code: 18,
	encode: gi("SHA-256")
}), wn = di({
	name: "sha2-512",
	code: 19,
	encode: gi("SHA-512")
});
var _n = Object.freeze({
	__proto__: null,
	sha256: vn,
	sha512: wn
});
var pi = 0, En = "identity", yi = si, In = (r) => Ke$1(pi, yi(r));
var Cn = Object.freeze({
	__proto__: null,
	identity: {
		code: pi,
		name: En,
		encode: yi,
		digest: In
	}
});
new TextEncoder(), new TextDecoder();
var bi = {
	...mr,
	...Dr,
	...wr,
	...Er,
	...Cr,
	...Lr,
	...Ur,
	...Kr,
	...Wr,
	...Qr
};
({
	..._n,
	...Cn
});
function mi(r) {
	return globalThis.Buffer != null ? new Uint8Array(r.buffer, r.byteOffset, r.byteLength) : r;
}
function Pn(r = 0) {
	return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? mi(globalThis.Buffer.allocUnsafe(r)) : new Uint8Array(r);
}
function fi(r, e, t, i) {
	return {
		name: r,
		prefix: e,
		encoder: {
			name: r,
			prefix: e,
			encode: t
		},
		decoder: { decode: i }
	};
}
var Di = fi("utf8", "u", (r) => "u" + new TextDecoder("utf8").decode(r), (r) => new TextEncoder().encode(r.substring(1))), Be = fi("ascii", "a", (r) => {
	let e = "a";
	for (let t = 0; t < r.length; t++) e += String.fromCharCode(r[t]);
	return e;
}, (r) => {
	r = r.substring(1);
	const e = Pn(r.length);
	for (let t = 0; t < r.length; t++) e[t] = r.charCodeAt(t);
	return e;
}), Sn = {
	utf8: Di,
	"utf-8": Di,
	hex: bi.base16,
	latin1: Be,
	ascii: Be,
	binary: Be,
	...bi
};
function On(r, e = "utf8") {
	const t = Sn[e];
	if (!t) throw new Error(`Unsupported encoding "${e}"`);
	return (e === "utf8" || e === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? mi(globalThis.Buffer.from(r, "utf-8")) : t.decoder.decode(`${t.prefix}${r}`);
}
var Rn = Object.defineProperty, An = (r, e, t) => e in r ? Rn(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, W = (r, e, t) => An(r, typeof e != "symbol" ? e + "" : e, t);
var vi = class {
	constructor(e, t) {
		this.core = e, this.logger = t, W(this, "keychain", /* @__PURE__ */ new Map()), W(this, "name", Pt), W(this, "version", "0.3"), W(this, "initialized", !1), W(this, "storagePrefix", B), W(this, "init", async () => {
			if (!this.initialized) {
				const i = await this.getKeyChain();
				typeof i < "u" && (this.keychain = i), this.initialized = !0;
			}
		}), W(this, "has", (i) => (this.isInitialized(), this.keychain.has(i))), W(this, "set", async (i, s) => {
			this.isInitialized(), this.keychain.set(i, s), await this.persist();
		}), W(this, "get", (i) => {
			this.isInitialized();
			const s = this.keychain.get(i);
			if (typeof s > "u") {
				const { message: n } = Et$2("NO_MATCHING_KEY", `${this.name}: ${i}`);
				throw new Error(n);
			}
			return s;
		}), W(this, "del", async (i) => {
			this.isInitialized(), this.keychain.delete(i), await this.persist();
		}), this.core = e, this.logger = E$1(t, this.name);
	}
	get context() {
		return y$2(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	async setKeyChain(e) {
		await this.core.storage.setItem(this.storageKey, Ys$1(e));
	}
	async getKeyChain() {
		const e = await this.core.storage.getItem(this.storageKey);
		return typeof e < "u" ? Xs$1(e) : void 0;
	}
	async persist() {
		await this.setKeyChain(this.keychain);
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var xn = Object.defineProperty, Nn = (r, e, t) => e in r ? xn(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, S = (r, e, t) => Nn(r, typeof e != "symbol" ? e + "" : e, t);
var wi = class {
	constructor(e, t, i) {
		this.core = e, this.logger = t, S(this, "name", Tt), S(this, "keychain"), S(this, "randomSessionIdentifier", qc()), S(this, "initialized", !1), S(this, "init", async () => {
			this.initialized || (await this.keychain.init(), this.initialized = !0);
		}), S(this, "hasKeys", (s) => (this.isInitialized(), this.keychain.has(s))), S(this, "getClientId", async () => {
			this.isInitialized();
			return Qe$2(Po$2(await this.getClientSeed()).publicKey);
		}), S(this, "generateKeyPair", () => {
			this.isInitialized();
			const s = Vc();
			return this.setPrivateKey(s.publicKey, s.privateKey);
		}), S(this, "signJWT", async (s) => {
			this.isInitialized();
			const o = Po$2(await this.getClientSeed()), a = this.randomSessionIdentifier;
			return await Qo$1(a, s, Ct, o);
		}), S(this, "generateSharedKey", (s, n, o) => {
			this.isInitialized();
			const c = Kc(this.getPrivateKey(s), n);
			return this.setSymKey(c, o);
		}), S(this, "setSymKey", async (s, n) => {
			this.isInitialized();
			const o = n || Fc(s);
			return await this.keychain.set(o, s), o;
		}), S(this, "deleteKeyPair", async (s) => {
			this.isInitialized(), await this.keychain.del(s);
		}), S(this, "deleteSymKey", async (s) => {
			this.isInitialized(), await this.keychain.del(s);
		}), S(this, "encode", async (s, n, o) => {
			this.isInitialized();
			const a = Ho$1(o), c = safeJsonStringify(n);
			if (Qc(a)) return Wc(c, o?.encoding);
			if (Jc(a)) {
				const g = a.senderPublicKey, _ = a.receiverPublicKey;
				s = await this.generateSharedKey(g, _);
			}
			const h = this.getSymKey(s), { type: l, senderPublicKey: d } = a;
			return Gc({
				type: l,
				symKey: h,
				message: c,
				senderPublicKey: d,
				encoding: o?.encoding
			});
		}), S(this, "decode", async (s, n, o) => {
			this.isInitialized();
			const a = Xc(n, o);
			if (Qc(a)) return safeJsonParse(Yc(n, o?.encoding));
			if (Jc(a)) {
				const c = a.receiverPublicKey, h = a.senderPublicKey;
				s = await this.generateSharedKey(c, h);
			}
			try {
				return safeJsonParse(Zc({
					symKey: this.getSymKey(s),
					encoded: n,
					encoding: o?.encoding
				}));
			} catch (c) {
				this.logger.error(`Failed to decode message from topic: '${s}', clientId: '${await this.getClientId()}'`), this.logger.error(c);
			}
		}), S(this, "getPayloadType", (s, n = Qt$1) => {
			return Vt$2(Me$2({
				encoded: s,
				encoding: n
			}).type);
		}), S(this, "getPayloadSenderPublicKey", (s, n = Qt$1) => {
			const o = Me$2({
				encoded: s,
				encoding: n
			});
			return o.senderPublicKey ? toString(o.senderPublicKey, tt$1) : void 0;
		}), this.core = e, this.logger = E$1(t, this.name), this.keychain = i || new vi(this.core, this.logger);
	}
	get context() {
		return y$2(this.logger);
	}
	async setPrivateKey(e, t) {
		return await this.keychain.set(e, t), e;
	}
	getPrivateKey(e) {
		return this.keychain.get(e);
	}
	async getClientSeed() {
		let e = "";
		try {
			e = this.keychain.get(ke$1);
		} catch {
			e = qc(), await this.keychain.set(ke$1, e);
		}
		return On(e, "base16");
	}
	getSymKey(e) {
		return this.keychain.get(e);
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var $n = Object.defineProperty, zn = Object.defineProperties, Ln = Object.getOwnPropertyDescriptors, _i = Object.getOwnPropertySymbols, kn = Object.prototype.hasOwnProperty, jn = Object.prototype.propertyIsEnumerable, Ve = (r, e, t) => e in r ? $n(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, Un = (r, e) => {
	for (var t in e || (e = {})) kn.call(e, t) && Ve(r, t, e[t]);
	if (_i) for (var t of _i(e)) jn.call(e, t) && Ve(r, t, e[t]);
	return r;
}, Fn = (r, e) => zn(r, Ln(e)), k = (r, e, t) => Ve(r, typeof e != "symbol" ? e + "" : e, t);
var Ei = class extends y$1 {
	constructor(e, t) {
		super(e, t), this.logger = e, this.core = t, k(this, "messages", /* @__PURE__ */ new Map()), k(this, "messagesWithoutClientAck", /* @__PURE__ */ new Map()), k(this, "name", Ot), k(this, "version", "0.3"), k(this, "initialized", !1), k(this, "storagePrefix", B), k(this, "init", async () => {
			if (!this.initialized) {
				this.logger.trace("Initialized");
				try {
					const i = await this.getRelayerMessages();
					typeof i < "u" && (this.messages = i);
					const s = await this.getRelayerMessagesWithoutClientAck();
					typeof s < "u" && (this.messagesWithoutClientAck = s), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({
						type: "method",
						method: "restore",
						size: this.messages.size
					});
				} catch (i) {
					this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(i);
				} finally {
					this.initialized = !0;
				}
			}
		}), k(this, "set", async (i, s, n) => {
			this.isInitialized();
			const o = zc(s);
			let a = this.messages.get(i);
			if (typeof a > "u" && (a = {}), typeof a[o] < "u") return o;
			if (a[o] = s, this.messages.set(i, a), n === le.inbound) {
				const c = this.messagesWithoutClientAck.get(i) || {};
				this.messagesWithoutClientAck.set(i, Fn(Un({}, c), { [o]: s }));
			}
			return await this.persist(), o;
		}), k(this, "get", (i) => {
			this.isInitialized();
			let s = this.messages.get(i);
			return typeof s > "u" && (s = {}), s;
		}), k(this, "getWithoutAck", (i) => {
			this.isInitialized();
			const s = {};
			for (const n of i) {
				const o = this.messagesWithoutClientAck.get(n) || {};
				s[n] = Object.values(o);
			}
			return s;
		}), k(this, "has", (i, s) => {
			this.isInitialized();
			return typeof this.get(i)[zc(s)] < "u";
		}), k(this, "ack", async (i, s) => {
			this.isInitialized();
			const n = this.messagesWithoutClientAck.get(i);
			if (typeof n > "u") return;
			const o = zc(s);
			delete n[o], Object.keys(n).length === 0 ? this.messagesWithoutClientAck.delete(i) : this.messagesWithoutClientAck.set(i, n), await this.persist();
		}), k(this, "del", async (i) => {
			this.isInitialized(), this.messages.delete(i), this.messagesWithoutClientAck.delete(i), await this.persist();
		}), this.logger = E$1(e, this.name), this.core = t;
	}
	get context() {
		return y$2(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	get storageKeyWithoutClientAck() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name + "_withoutClientAck";
	}
	async setRelayerMessages(e) {
		await this.core.storage.setItem(this.storageKey, Ys$1(e));
	}
	async setRelayerMessagesWithoutClientAck(e) {
		await this.core.storage.setItem(this.storageKeyWithoutClientAck, Ys$1(e));
	}
	async getRelayerMessages() {
		const e = await this.core.storage.getItem(this.storageKey);
		return typeof e < "u" ? Xs$1(e) : void 0;
	}
	async getRelayerMessagesWithoutClientAck() {
		const e = await this.core.storage.getItem(this.storageKeyWithoutClientAck);
		return typeof e < "u" ? Xs$1(e) : void 0;
	}
	async persist() {
		await this.setRelayerMessages(this.messages), await this.setRelayerMessagesWithoutClientAck(this.messagesWithoutClientAck);
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var Mn = Object.defineProperty, Kn = Object.defineProperties, Bn = Object.getOwnPropertyDescriptors, Ii = Object.getOwnPropertySymbols, Vn = Object.prototype.hasOwnProperty, qn = Object.prototype.propertyIsEnumerable, qe = (r, e, t) => e in r ? Mn(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, Ie = (r, e) => {
	for (var t in e || (e = {})) Vn.call(e, t) && qe(r, t, e[t]);
	if (Ii) for (var t of Ii(e)) qn.call(e, t) && qe(r, t, e[t]);
	return r;
}, Ge = (r, e) => Kn(r, Bn(e)), V = (r, e, t) => qe(r, typeof e != "symbol" ? e + "" : e, t);
var Gn = class extends m {
	constructor(e, t) {
		super(e, t), this.relayer = e, this.logger = t, V(this, "events", new EventEmitter()), V(this, "name", At), V(this, "queue", /* @__PURE__ */ new Map()), V(this, "publishTimeout", (0, import_cjs$3.toMiliseconds)(import_cjs$3.ONE_MINUTE)), V(this, "initialPublishTimeout", (0, import_cjs$3.toMiliseconds)(import_cjs$3.ONE_SECOND * 15)), V(this, "needsTransportRestart", !1), V(this, "publish", async (i, s, n) => {
			var o;
			this.logger.debug("Publishing Payload"), this.logger.trace({
				type: "method",
				method: "publish",
				params: {
					topic: i,
					message: s,
					opts: n
				}
			});
			const a = n?.ttl || je, c = ea(n), h = n?.prompt || !1, l = n?.tag || 0, d = n?.id || getBigIntRpcId().toString(), g = {
				topic: i,
				message: s,
				opts: {
					ttl: a,
					relay: c,
					prompt: h,
					tag: l,
					id: d,
					attestation: n?.attestation,
					tvf: n?.tvf
				}
			}, _ = `Failed to publish payload, please try again. id:${d} tag:${l}`;
			try {
				const u = new Promise(async (b) => {
					const x = ({ id: D }) => {
						g.opts.id === D && (this.removeRequestFromQueue(D), this.relayer.events.removeListener(C.publish, x), b(g));
					};
					this.relayer.events.on(C.publish, x);
					const I = ni$1(new Promise((D, j) => {
						this.rpcPublish({
							topic: i,
							message: s,
							ttl: a,
							prompt: h,
							tag: l,
							id: d,
							attestation: n?.attestation,
							tvf: n?.tvf
						}).then(D).catch((T) => {
							this.logger.warn(T, T?.message), j(T);
						});
					}), this.initialPublishTimeout, `Failed initial publish, retrying.... id:${d} tag:${l}`);
					try {
						await I, this.events.removeListener(C.publish, x);
					} catch (D) {
						this.queue.set(d, Ge(Ie({}, g), { attempt: 1 })), this.logger.warn(D, D?.message);
					}
				});
				this.logger.trace({
					type: "method",
					method: "publish",
					params: {
						id: d,
						topic: i,
						message: s,
						opts: n
					}
				}), await ni$1(u, this.publishTimeout, _);
			} catch (u) {
				if (this.logger.debug("Failed to Publish Payload"), this.logger.error(u), (o = n?.internal) != null && o.throwOnFailedPublish) throw u;
			} finally {
				this.queue.delete(d);
			}
		}), V(this, "on", (i, s) => {
			this.events.on(i, s);
		}), V(this, "once", (i, s) => {
			this.events.once(i, s);
		}), V(this, "off", (i, s) => {
			this.events.off(i, s);
		}), V(this, "removeListener", (i, s) => {
			this.events.removeListener(i, s);
		}), this.relayer = e, this.logger = E$1(t, this.name), this.registerEventListeners();
	}
	get context() {
		return y$2(this.logger);
	}
	async rpcPublish(e) {
		var t, i, s, n;
		const { topic: o, message: a, ttl: c = je, prompt: h, tag: l, id: d, attestation: g, tvf: _ } = e, u = {
			method: na(ea().protocol).publish,
			params: Ie({
				topic: o,
				message: a,
				ttl: c,
				prompt: h,
				tag: l,
				attestation: g
			}, _),
			id: d
		};
		kt$1((t = u.params) == null ? void 0 : t.prompt) && ((i = u.params) == null || delete i.prompt), kt$1((s = u.params) == null ? void 0 : s.tag) && ((n = u.params) == null || delete n.tag), this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "message",
			direction: "outgoing",
			request: u
		});
		const b = await this.relayer.request(u);
		return this.relayer.events.emit(C.publish, e), this.logger.debug("Successfully Published Payload"), b;
	}
	removeRequestFromQueue(e) {
		this.queue.delete(e);
	}
	checkQueue() {
		this.queue.forEach(async (e, t) => {
			const i = e.attempt + 1;
			this.queue.set(t, Ge(Ie({}, e), { attempt: i }));
			const { topic: s, message: n, opts: o, attestation: a } = e;
			this.logger.warn({}, `Publisher: queue->publishing: ${e.opts.id}, tag: ${e.opts.tag}, attempt: ${i}`), await this.rpcPublish(Ge(Ie({}, e), {
				topic: s,
				message: n,
				ttl: o.ttl,
				prompt: o.prompt,
				tag: o.tag,
				id: o.id,
				attestation: a,
				tvf: o.tvf
			})), this.logger.warn({}, `Publisher: queue->published: ${e.opts.id}`);
		});
	}
	registerEventListeners() {
		this.relayer.core.heartbeat.on(r$1.pulse, () => {
			if (this.needsTransportRestart) {
				this.needsTransportRestart = !1, this.relayer.events.emit(C.connection_stalled);
				return;
			}
			this.checkQueue();
		}), this.relayer.on(C.message_ack, (e) => {
			this.removeRequestFromQueue(e.id.toString());
		});
	}
};
var Wn = Object.defineProperty, Hn = (r, e, t) => e in r ? Wn(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, ne = (r, e, t) => Hn(r, typeof e != "symbol" ? e + "" : e, t);
var Yn = class {
	constructor() {
		ne(this, "map", /* @__PURE__ */ new Map()), ne(this, "set", (e, t) => {
			const i = this.get(e);
			this.exists(e, t) || this.map.set(e, [...i, t]);
		}), ne(this, "get", (e) => this.map.get(e) || []), ne(this, "exists", (e, t) => this.get(e).includes(t)), ne(this, "delete", (e, t) => {
			if (typeof t > "u") {
				this.map.delete(e);
				return;
			}
			if (!this.map.has(e)) return;
			const i = this.get(e);
			if (!this.exists(e, t)) return;
			const s = i.filter((n) => n !== t);
			if (!s.length) {
				this.map.delete(e);
				return;
			}
			this.map.set(e, s);
		}), ne(this, "clear", () => {
			this.map.clear();
		});
	}
	get topics() {
		return Array.from(this.map.keys());
	}
};
var Jn = Object.defineProperty, Xn = Object.defineProperties, Zn = Object.getOwnPropertyDescriptors, Ti = Object.getOwnPropertySymbols, Qn = Object.prototype.hasOwnProperty, eo = Object.prototype.propertyIsEnumerable, We = (r, e, t) => e in r ? Jn(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, ge = (r, e) => {
	for (var t in e || (e = {})) Qn.call(e, t) && We(r, t, e[t]);
	if (Ti) for (var t of Ti(e)) eo.call(e, t) && We(r, t, e[t]);
	return r;
}, He = (r, e) => Xn(r, Zn(e)), f$1 = (r, e, t) => We(r, typeof e != "symbol" ? e + "" : e, t);
var Ci = class extends P$1 {
	constructor(e, t) {
		super(e, t), this.relayer = e, this.logger = t, f$1(this, "subscriptions", /* @__PURE__ */ new Map()), f$1(this, "topicMap", new Yn()), f$1(this, "events", new EventEmitter()), f$1(this, "name", Ut), f$1(this, "version", "0.3"), f$1(this, "pending", /* @__PURE__ */ new Map()), f$1(this, "cached", []), f$1(this, "initialized", !1), f$1(this, "storagePrefix", B), f$1(this, "subscribeTimeout", (0, import_cjs$3.toMiliseconds)(import_cjs$3.ONE_MINUTE)), f$1(this, "initialSubscribeTimeout", (0, import_cjs$3.toMiliseconds)(import_cjs$3.ONE_SECOND * 15)), f$1(this, "clientId"), f$1(this, "batchSubscribeTopicsLimit", 500), f$1(this, "init", async () => {
			this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), await this.restore()), this.initialized = !0;
		}), f$1(this, "subscribe", async (i, s) => {
			this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({
				type: "method",
				method: "subscribe",
				params: {
					topic: i,
					opts: s
				}
			});
			try {
				const n = ea(s), o = {
					topic: i,
					relay: n,
					transportType: s?.transportType
				};
				this.pending.set(i, o);
				const a = await this.rpcSubscribe(i, n, s);
				return typeof a == "string" && (this.onSubscribe(a, o), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({
					type: "method",
					method: "subscribe",
					params: {
						topic: i,
						opts: s
					}
				})), a;
			} catch (n) {
				throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(n), n;
			}
		}), f$1(this, "unsubscribe", async (i, s) => {
			this.isInitialized(), typeof s?.id < "u" ? await this.unsubscribeById(i, s.id, s) : await this.unsubscribeByTopic(i, s);
		}), f$1(this, "isSubscribed", (i) => new Promise((s) => {
			s(this.topicMap.topics.includes(i));
		})), f$1(this, "isKnownTopic", (i) => new Promise((s) => {
			s(this.topicMap.topics.includes(i) || this.pending.has(i) || this.cached.some((n) => n.topic === i));
		})), f$1(this, "on", (i, s) => {
			this.events.on(i, s);
		}), f$1(this, "once", (i, s) => {
			this.events.once(i, s);
		}), f$1(this, "off", (i, s) => {
			this.events.off(i, s);
		}), f$1(this, "removeListener", (i, s) => {
			this.events.removeListener(i, s);
		}), f$1(this, "start", async () => {
			await this.onConnect();
		}), f$1(this, "stop", async () => {
			await this.onDisconnect();
		}), f$1(this, "restart", async () => {
			await this.restore(), await this.onRestart();
		}), f$1(this, "checkPending", async () => {
			if (this.pending.size === 0 && (!this.initialized || !this.relayer.connected)) return;
			const i = [];
			this.pending.forEach((s) => {
				i.push(s);
			}), await this.batchSubscribe(i);
		}), f$1(this, "registerEventListeners", () => {
			this.relayer.core.heartbeat.on(r$1.pulse, async () => {
				await this.checkPending();
			}), this.events.on($$1.created, async (i) => {
				const s = $$1.created;
				this.logger.info(`Emitting ${s}`), this.logger.debug({
					type: "event",
					event: s,
					data: i
				}), await this.persist();
			}), this.events.on($$1.deleted, async (i) => {
				const s = $$1.deleted;
				this.logger.info(`Emitting ${s}`), this.logger.debug({
					type: "event",
					event: s,
					data: i
				}), await this.persist();
			});
		}), this.relayer = e, this.logger = E$1(t, this.name), this.clientId = "";
	}
	get context() {
		return y$2(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
	}
	get length() {
		return this.subscriptions.size;
	}
	get ids() {
		return Array.from(this.subscriptions.keys());
	}
	get values() {
		return Array.from(this.subscriptions.values());
	}
	get topics() {
		return this.topicMap.topics;
	}
	get hasAnyTopics() {
		return this.topicMap.topics.length > 0 || this.pending.size > 0 || this.cached.length > 0 || this.subscriptions.size > 0;
	}
	hasSubscription(e, t) {
		let i = !1;
		try {
			i = this.getSubscription(e).topic === t;
		} catch {}
		return i;
	}
	reset() {
		this.cached = [], this.initialized = !0;
	}
	onDisable() {
		this.values.length > 0 && (this.cached = this.values), this.subscriptions.clear(), this.topicMap.clear();
	}
	async unsubscribeByTopic(e, t) {
		const i = this.topicMap.get(e);
		await Promise.all(i.map(async (s) => await this.unsubscribeById(e, s, t)));
	}
	async unsubscribeById(e, t, i) {
		this.logger.debug("Unsubscribing Topic"), this.logger.trace({
			type: "method",
			method: "unsubscribe",
			params: {
				topic: e,
				id: t,
				opts: i
			}
		});
		try {
			const s = ea(i);
			await this.restartToComplete({
				topic: e,
				id: t,
				relay: s
			}), await this.rpcUnsubscribe(e, t, s);
			const n = Kt$1("USER_DISCONNECTED", `${this.name}, ${e}`);
			await this.onUnsubscribe(e, t, n), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({
				type: "method",
				method: "unsubscribe",
				params: {
					topic: e,
					id: t,
					opts: i
				}
			});
		} catch (s) {
			throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(s), s;
		}
	}
	async rpcSubscribe(e, t, i) {
		var s;
		(!i || i?.transportType === Q.relay) && await this.restartToComplete({
			topic: e,
			id: e,
			relay: t
		});
		const n = {
			method: na(t.protocol).subscribe,
			params: { topic: e }
		};
		this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "outgoing",
			request: n
		});
		const o = (s = i?.internal) == null ? void 0 : s.throwOnFailedPublish;
		try {
			const a = await this.getSubscriptionId(e);
			if (i?.transportType === Q.link_mode) return setTimeout(() => {
				(this.relayer.connected || this.relayer.connecting) && this.relayer.request(n).catch((l) => this.logger.warn(l));
			}, (0, import_cjs$3.toMiliseconds)(import_cjs$3.ONE_SECOND)), a;
			const h = await ni$1(new Promise(async (l) => {
				const d = (g) => {
					g.topic === e && (this.events.removeListener($$1.created, d), l(g.id));
				};
				this.events.on($$1.created, d);
				try {
					const g = await ni$1(new Promise((_, u) => {
						this.relayer.request(n).catch((b) => {
							this.logger.warn(b, b?.message), u(b);
						}).then(_);
					}), this.initialSubscribeTimeout, `Subscribing to ${e} failed, please try again`);
					this.events.removeListener($$1.created, d), l(g);
				} catch {}
			}), this.subscribeTimeout, `Subscribing to ${e} failed, please try again`);
			if (!h && o) throw new Error(`Subscribing to ${e} failed, please try again`);
			return h ? a : null;
		} catch (a) {
			if (this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(C.connection_stalled), o) throw a;
		}
		return null;
	}
	async rpcBatchSubscribe(e) {
		if (!e.length) return;
		const t = e[0].relay, i = {
			method: na(t.protocol).batchSubscribe,
			params: { topics: e.map((s) => s.topic) }
		};
		this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "outgoing",
			request: i
		});
		try {
			await await ni$1(new Promise((s) => {
				this.relayer.request(i).catch((n) => this.logger.warn(n)).then(s);
			}), this.subscribeTimeout, "rpcBatchSubscribe failed, please try again");
		} catch {
			this.relayer.events.emit(C.connection_stalled);
		}
	}
	async rpcBatchFetchMessages(e) {
		if (!e.length) return;
		const t = e[0].relay, i = {
			method: na(t.protocol).batchFetchMessages,
			params: { topics: e.map((n) => n.topic) }
		};
		this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "outgoing",
			request: i
		});
		let s;
		try {
			s = await await ni$1(new Promise((n, o) => {
				this.relayer.request(i).catch((a) => {
					this.logger.warn(a), o(a);
				}).then(n);
			}), this.subscribeTimeout, "rpcBatchFetchMessages failed, please try again");
		} catch {
			this.relayer.events.emit(C.connection_stalled);
		}
		return s;
	}
	rpcUnsubscribe(e, t, i) {
		const s = {
			method: na(i.protocol).unsubscribe,
			params: {
				topic: e,
				id: t
			}
		};
		return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "outgoing",
			request: s
		}), this.relayer.request(s);
	}
	onSubscribe(e, t) {
		this.setSubscription(e, He(ge({}, t), { id: e })), this.pending.delete(t.topic);
	}
	onBatchSubscribe(e) {
		e.length && e.forEach((t) => {
			this.setSubscription(t.id, ge({}, t)), this.pending.delete(t.topic);
		});
	}
	async onUnsubscribe(e, t, i) {
		this.events.removeAllListeners(t), this.hasSubscription(t, e) && this.deleteSubscription(t, i), await this.relayer.messages.del(e);
	}
	async setRelayerSubscriptions(e) {
		await this.relayer.core.storage.setItem(this.storageKey, e);
	}
	async getRelayerSubscriptions() {
		return await this.relayer.core.storage.getItem(this.storageKey);
	}
	setSubscription(e, t) {
		this.logger.debug("Setting subscription"), this.logger.trace({
			type: "method",
			method: "setSubscription",
			id: e,
			subscription: t
		}), this.addSubscription(e, t);
	}
	addSubscription(e, t) {
		this.subscriptions.set(e, ge({}, t)), this.topicMap.set(t.topic, e), this.events.emit($$1.created, t);
	}
	getSubscription(e) {
		this.logger.debug("Getting subscription"), this.logger.trace({
			type: "method",
			method: "getSubscription",
			id: e
		});
		const t = this.subscriptions.get(e);
		if (!t) {
			const { message: i } = Et$2("NO_MATCHING_KEY", `${this.name}: ${e}`);
			throw new Error(i);
		}
		return t;
	}
	deleteSubscription(e, t) {
		this.logger.debug("Deleting subscription"), this.logger.trace({
			type: "method",
			method: "deleteSubscription",
			id: e,
			reason: t
		});
		const i = this.getSubscription(e);
		this.subscriptions.delete(e), this.topicMap.delete(i.topic, e), this.events.emit($$1.deleted, He(ge({}, i), { reason: t }));
	}
	async persist() {
		await this.setRelayerSubscriptions(this.values), this.events.emit($$1.sync);
	}
	async onRestart() {
		if (this.cached.length) {
			const e = [...this.cached], t = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
			for (let i = 0; i < t; i++) {
				const s = e.splice(0, this.batchSubscribeTopicsLimit);
				await this.batchSubscribe(s);
			}
		}
		this.events.emit($$1.resubscribed);
	}
	async restore() {
		try {
			const e = await this.getRelayerSubscriptions();
			if (typeof e > "u" || !e.length) return;
			if (this.subscriptions.size) {
				const { message: t } = Et$2("RESTORE_WILL_OVERRIDE", this.name);
				throw this.logger.error(t), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(t);
			}
			this.cached = e, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({
				type: "method",
				method: "restore",
				subscriptions: this.values
			});
		} catch (e) {
			this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e);
		}
	}
	async batchSubscribe(e) {
		e.length && (await this.rpcBatchSubscribe(e), this.onBatchSubscribe(await Promise.all(e.map(async (t) => He(ge({}, t), { id: await this.getSubscriptionId(t.topic) })))));
	}
	async batchFetchMessages(e) {
		if (!e.length) return;
		this.logger.trace(`Fetching batch messages for ${e.length} subscriptions`);
		const t = await this.rpcBatchFetchMessages(e);
		t && t.messages && (await pi$1((0, import_cjs$3.toMiliseconds)(import_cjs$3.ONE_SECOND)), await this.relayer.handleBatchMessageEvents(t.messages));
	}
	async onConnect() {
		await this.restart(), this.reset();
	}
	onDisconnect() {
		this.onDisable();
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
	async restartToComplete(e) {
		!this.relayer.connected && !this.relayer.connecting && (this.cached.push(e), await this.relayer.transportOpen());
	}
	async getClientId() {
		return this.clientId || (this.clientId = await this.relayer.core.crypto.getClientId()), this.clientId;
	}
	async getSubscriptionId(e) {
		return zc(e + await this.getClientId());
	}
};
var to = Object.defineProperty, Pi = Object.getOwnPropertySymbols, io = Object.prototype.hasOwnProperty, so = Object.prototype.propertyIsEnumerable, Ye = (r, e, t) => e in r ? to(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, Si = (r, e) => {
	for (var t in e || (e = {})) io.call(e, t) && Ye(r, t, e[t]);
	if (Pi) for (var t of Pi(e)) so.call(e, t) && Ye(r, t, e[t]);
	return r;
}, y = (r, e, t) => Ye(r, typeof e != "symbol" ? e + "" : e, t);
var Oi = class extends d$1 {
	constructor(e) {
		super(e), y(this, "protocol", "wc"), y(this, "version", 2), y(this, "core"), y(this, "logger"), y(this, "events", new EventEmitter()), y(this, "provider"), y(this, "messages"), y(this, "subscriber"), y(this, "publisher"), y(this, "name", $t), y(this, "transportExplicitlyClosed", !1), y(this, "initialized", !1), y(this, "connectionAttemptInProgress", !1), y(this, "relayUrl"), y(this, "projectId"), y(this, "packageName"), y(this, "bundleId"), y(this, "hasExperiencedNetworkDisruption", !1), y(this, "pingTimeout"), y(this, "heartBeatTimeout", (0, import_cjs$3.toMiliseconds)(import_cjs$3.THIRTY_SECONDS + import_cjs$3.FIVE_SECONDS)), y(this, "reconnectTimeout"), y(this, "connectPromise"), y(this, "reconnectInProgress", !1), y(this, "requestsInFlight", []), y(this, "connectTimeout", (0, import_cjs$3.toMiliseconds)(import_cjs$3.ONE_SECOND * 15)), y(this, "request", async (t) => {
			var i, s;
			this.logger.debug("Publishing Request Payload");
			const n = t.id || getBigIntRpcId().toString();
			await this.toEstablishConnection();
			try {
				this.logger.trace({
					id: n,
					method: t.method,
					topic: (i = t.params) == null ? void 0 : i.topic
				}, "relayer.request - publishing...");
				const o = `${n}:${((s = t.params) == null ? void 0 : s.tag) || ""}`;
				this.requestsInFlight.push(o);
				const a = await this.provider.request(t);
				return this.requestsInFlight = this.requestsInFlight.filter((c) => c !== o), a;
			} catch (o) {
				throw this.logger.debug(`Failed to Publish Request: ${n}`), o;
			}
		}), y(this, "resetPingTimeout", () => {
			Ye$1() && (clearTimeout(this.pingTimeout), this.pingTimeout = setTimeout(() => {
				var t, i, s, n;
				try {
					this.logger.debug({}, "pingTimeout: Connection stalled, terminating..."), (n = (s = (i = (t = this.provider) == null ? void 0 : t.connection) == null ? void 0 : i.socket) == null ? void 0 : s.terminate) == null || n.call(s);
				} catch (o) {
					this.logger.warn(o, o?.message);
				}
			}, this.heartBeatTimeout));
		}), y(this, "onPayloadHandler", (t) => {
			this.onProviderPayload(t), this.resetPingTimeout();
		}), y(this, "onConnectHandler", () => {
			this.logger.warn({}, "Relayer connected 🛜"), this.startPingTimeout(), this.events.emit(C.connect);
		}), y(this, "onDisconnectHandler", () => {
			this.logger.warn({}, "Relayer disconnected 🛑"), this.requestsInFlight = [], this.onProviderDisconnect();
		}), y(this, "onProviderErrorHandler", (t) => {
			this.logger.fatal(`Fatal socket error: ${t.message}`), this.events.emit(C.error, t), this.logger.fatal("Fatal socket error received, closing transport"), this.transportClose();
		}), y(this, "registerProviderListeners", () => {
			this.provider.on(L.payload, this.onPayloadHandler), this.provider.on(L.connect, this.onConnectHandler), this.provider.on(L.disconnect, this.onDisconnectHandler), this.provider.on(L.error, this.onProviderErrorHandler);
		}), this.core = e.core, this.logger = typeof e.logger < "u" && typeof e.logger != "string" ? E$1(e.logger, this.name) : (0, import_pino.default)(k$2({ level: e.logger || "error" })), this.messages = new Ei(this.logger, e.core), this.subscriber = new Ci(this, this.logger), this.publisher = new Gn(this, this.logger), this.relayUrl = e?.relayUrl || "wss://relay.walletconnect.org", this.projectId = e.projectId, Ms$1() ? this.packageName = qs$1() : Vs$1() && (this.bundleId = qs$1()), this.provider = {};
	}
	async init() {
		this.logger.trace("Initialized"), this.registerEventListeners(), await Promise.all([this.messages.init(), this.subscriber.init()]), this.initialized = !0, this.transportOpen().catch((e) => this.logger.warn(e, e?.message));
	}
	get context() {
		return y$2(this.logger);
	}
	get connected() {
		var e, t, i;
		return ((i = (t = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : t.socket) == null ? void 0 : i.readyState) === 1 || !1;
	}
	get connecting() {
		var e, t, i;
		return ((i = (t = (e = this.provider) == null ? void 0 : e.connection) == null ? void 0 : t.socket) == null ? void 0 : i.readyState) === 0 || this.connectPromise !== void 0 || !1;
	}
	async publish(e, t, i) {
		this.isInitialized(), await this.publisher.publish(e, t, i), await this.recordMessageEvent({
			topic: e,
			message: t,
			publishedAt: Date.now(),
			transportType: Q.relay
		}, le.outbound);
	}
	async subscribe(e, t) {
		var i, s, n;
		this.isInitialized(), (!(t != null && t.transportType) || t?.transportType === "relay") && await this.toEstablishConnection();
		const o = typeof ((i = t?.internal) == null ? void 0 : i.throwOnFailedPublish) > "u" ? !0 : (s = t?.internal) == null ? void 0 : s.throwOnFailedPublish;
		let a = ((n = this.subscriber.topicMap.get(e)) == null ? void 0 : n[0]) || "", c;
		const h = (l) => {
			l.topic === e && (this.subscriber.off($$1.created, h), c());
		};
		return await Promise.all([new Promise((l) => {
			c = l, this.subscriber.on($$1.created, h);
		}), new Promise(async (l, d) => {
			a = await this.subscriber.subscribe(e, Si({ internal: { throwOnFailedPublish: o } }, t)).catch((g) => {
				o && d(g);
			}) || a, l();
		})]), a;
	}
	async unsubscribe(e, t) {
		this.isInitialized(), await this.subscriber.unsubscribe(e, t);
	}
	on(e, t) {
		this.events.on(e, t);
	}
	once(e, t) {
		this.events.once(e, t);
	}
	off(e, t) {
		this.events.off(e, t);
	}
	removeListener(e, t) {
		this.events.removeListener(e, t);
	}
	async transportDisconnect() {
		this.provider.disconnect && (this.hasExperiencedNetworkDisruption || this.connected) ? await ni$1(this.provider.disconnect(), 2e3, "provider.disconnect()").catch(() => this.onProviderDisconnect()) : this.onProviderDisconnect();
	}
	async transportClose() {
		this.transportExplicitlyClosed = !0, await this.transportDisconnect();
	}
	async transportOpen(e) {
		if (!this.subscriber.hasAnyTopics) {
			this.logger.info("Starting WS connection skipped because the client has no topics to work with.");
			return;
		}
		if (this.connectPromise ? (this.logger.debug({}, "Waiting for existing connection attempt to resolve..."), await this.connectPromise, this.logger.debug({}, "Existing connection attempt resolved")) : (this.connectPromise = new Promise(async (t, i) => {
			await this.connect(e).then(t).catch(i).finally(() => {
				this.connectPromise = void 0;
			});
		}), await this.connectPromise), !this.connected) throw new Error(`Couldn't establish socket connection to the relay server: ${this.relayUrl}`);
	}
	async restartTransport(e) {
		this.logger.debug({}, "Restarting transport..."), !this.connectionAttemptInProgress && (this.relayUrl = e || this.relayUrl, await this.confirmOnlineStateOrThrow(), await this.transportClose(), await this.transportOpen());
	}
	async confirmOnlineStateOrThrow() {
		if (!await ja()) throw new Error("No internet connection detected. Please restart your network and try again.");
	}
	async handleBatchMessageEvents(e) {
		if (e?.length === 0) {
			this.logger.trace("Batch message events is empty. Ignoring...");
			return;
		}
		const t = e.sort((i, s) => i.publishedAt - s.publishedAt);
		this.logger.debug(`Batch of ${t.length} message events sorted`);
		for (const i of t) try {
			await this.onMessageEvent(i);
		} catch (s) {
			this.logger.warn(s, "Error while processing batch message event: " + s?.message);
		}
		this.logger.trace(`Batch of ${t.length} message events processed`);
	}
	async onLinkMessageEvent(e, t) {
		const { topic: i } = e;
		if (!t.sessionExists) {
			const n = {
				topic: i,
				expiry: ii$1(import_cjs$3.FIVE_MINUTES),
				relay: { protocol: "irn" },
				active: !1
			};
			await this.core.pairing.pairings.set(i, n);
		}
		this.events.emit(C.message, e), await this.recordMessageEvent(e, le.inbound);
	}
	async connect(e) {
		await this.confirmOnlineStateOrThrow(), e && e !== this.relayUrl && (this.relayUrl = e, await this.transportDisconnect()), this.connectionAttemptInProgress = !0, this.transportExplicitlyClosed = !1;
		let t = 1;
		for (; t < 6;) {
			try {
				if (this.transportExplicitlyClosed) break;
				this.logger.debug({}, `Connecting to ${this.relayUrl}, attempt: ${t}...`), await this.createProvider(), await new Promise(async (i, s) => {
					const n = () => {
						s(/* @__PURE__ */ new Error("Connection interrupted while trying to connect"));
					};
					this.provider.once(L.disconnect, n), await ni$1(new Promise((o, a) => {
						this.provider.connect().then(o).catch(a);
					}), this.connectTimeout, `Socket stalled when trying to connect to ${this.relayUrl}`).catch((o) => {
						s(o);
					}).finally(() => {
						this.provider.off(L.disconnect, n), clearTimeout(this.reconnectTimeout);
					}), await new Promise(async (o, a) => {
						const c = () => {
							s(/* @__PURE__ */ new Error("Connection interrupted while trying to subscribe"));
						};
						this.provider.once(L.disconnect, c), await this.subscriber.start().then(o).catch(a).finally(() => {
							this.provider.off(L.disconnect, c);
						});
					}), this.hasExperiencedNetworkDisruption = !1, i();
				});
			} catch (i) {
				await this.subscriber.stop();
				const s = i;
				this.logger.warn({}, s.message), this.hasExperiencedNetworkDisruption = !0;
			} finally {
				this.connectionAttemptInProgress = !1;
			}
			if (this.connected) {
				this.logger.debug({}, `Connected to ${this.relayUrl} successfully on attempt: ${t}`);
				break;
			}
			await new Promise((i) => setTimeout(i, (0, import_cjs$3.toMiliseconds)(t * 1))), t++;
		}
	}
	startPingTimeout() {
		var e, t, i, s, n;
		if (Ye$1()) try {
			(t = (e = this.provider) == null ? void 0 : e.connection) != null && t.socket && ((n = (s = (i = this.provider) == null ? void 0 : i.connection) == null ? void 0 : s.socket) == null || n.on("ping", () => {
				this.resetPingTimeout();
			})), this.resetPingTimeout();
		} catch (o) {
			this.logger.warn(o, o?.message);
		}
	}
	async createProvider() {
		this.provider.connection && this.unregisterProviderListeners();
		const e = await this.core.crypto.signJWT(this.relayUrl);
		this.provider = new o(new f$2(zs({
			sdkVersion: _e$1,
			protocol: this.protocol,
			version: this.version,
			relayUrl: this.relayUrl,
			projectId: this.projectId,
			auth: e,
			useOnCloseEvent: !0,
			bundleId: this.bundleId,
			packageName: this.packageName
		}))), this.registerProviderListeners();
	}
	async recordMessageEvent(e, t) {
		const { topic: i, message: s } = e;
		await this.messages.set(i, s, t);
	}
	async shouldIgnoreMessageEvent(e) {
		const { topic: t, message: i } = e;
		if (!i || i.length === 0) return this.logger.warn(`Ignoring invalid/empty message: ${i}`), !0;
		if (!await this.subscriber.isKnownTopic(t)) return this.logger.warn(`Ignoring message for unknown topic ${t}`), !0;
		const s = this.messages.has(t, i);
		return s && this.logger.warn(`Ignoring duplicate message: ${i}`), s;
	}
	async onProviderPayload(e) {
		if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({
			type: "payload",
			direction: "incoming",
			payload: e
		}), isJsonRpcRequest(e)) {
			if (!e.method.endsWith("_subscription")) return;
			const t = e.params, { topic: i, message: s, publishedAt: n, attestation: o } = t.data, a = {
				topic: i,
				message: s,
				publishedAt: n,
				transportType: Q.relay,
				attestation: o
			};
			this.logger.debug("Emitting Relayer Payload"), this.logger.trace(Si({
				type: "event",
				event: t.id
			}, a)), this.events.emit(t.id, a), await this.acknowledgePayload(e), await this.onMessageEvent(a);
		} else isJsonRpcResponse(e) && this.events.emit(C.message_ack, e);
	}
	async onMessageEvent(e) {
		await this.shouldIgnoreMessageEvent(e) || (await this.recordMessageEvent(e, le.inbound), this.events.emit(C.message, e));
	}
	async acknowledgePayload(e) {
		const t = formatJsonRpcResult(e.id, !0);
		await this.provider.connection.send(t);
	}
	unregisterProviderListeners() {
		this.provider.off(L.payload, this.onPayloadHandler), this.provider.off(L.connect, this.onConnectHandler), this.provider.off(L.disconnect, this.onDisconnectHandler), this.provider.off(L.error, this.onProviderErrorHandler), clearTimeout(this.pingTimeout);
	}
	async registerEventListeners() {
		let e = await ja();
		ka(async (t) => {
			e !== t && (e = t, t ? await this.transportOpen().catch((i) => this.logger.error(i, i?.message)) : (this.hasExperiencedNetworkDisruption = !0, await this.transportDisconnect(), this.transportExplicitlyClosed = !1));
		}), this.core.heartbeat.on(r$1.pulse, async () => {
			if (!this.transportExplicitlyClosed && !this.connected && Pa()) try {
				await this.confirmOnlineStateOrThrow(), await this.transportOpen();
			} catch (t) {
				this.logger.warn(t, t?.message);
			}
		});
	}
	async onProviderDisconnect() {
		clearTimeout(this.pingTimeout), this.events.emit(C.disconnect), this.connectionAttemptInProgress = !1, !this.reconnectInProgress && (this.reconnectInProgress = !0, await this.subscriber.stop(), this.subscriber.hasAnyTopics && (this.transportExplicitlyClosed || (this.reconnectTimeout = setTimeout(async () => {
			await this.transportOpen().catch((e) => this.logger.error(e, e?.message)), this.reconnectTimeout = void 0, this.reconnectInProgress = !1;
		}, (0, import_cjs$3.toMiliseconds)(.1)))));
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
	async toEstablishConnection() {
		if (await this.confirmOnlineStateOrThrow(), !this.connected) {
			if (this.connectPromise) {
				await this.connectPromise;
				return;
			}
			await this.connect();
		}
	}
};
function ro(r, e) {
	return r === e || Number.isNaN(r) && Number.isNaN(e);
}
function Ri(r) {
	return Object.getOwnPropertySymbols(r).filter((e) => Object.prototype.propertyIsEnumerable.call(r, e));
}
function Ai(r) {
	return r == null ? r === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(r);
}
var no = "[object RegExp]", oo = "[object String]", ao = "[object Number]", co = "[object Boolean]", xi = "[object Arguments]", ho = "[object Symbol]", lo = "[object Date]", uo = "[object Map]", go = "[object Set]", po = "[object Array]", yo = "[object Function]", bo = "[object ArrayBuffer]", Je = "[object Object]", mo = "[object Error]", fo = "[object DataView]", Do = "[object Uint8Array]", vo = "[object Uint8ClampedArray]", wo = "[object Uint16Array]", _o = "[object Uint32Array]", Eo = "[object BigUint64Array]", Io = "[object Int8Array]", To = "[object Int16Array]", Co = "[object Int32Array]", Po = "[object BigInt64Array]", So = "[object Float32Array]", Oo = "[object Float64Array]";
function Ro() {}
function Ni(r) {
	if (!r || typeof r != "object") return !1;
	const e = Object.getPrototypeOf(r);
	return e === null || e === Object.prototype || Object.getPrototypeOf(e) === null ? Object.prototype.toString.call(r) === "[object Object]" : !1;
}
function Ao(r, e, t) {
	return pe(r, e, void 0, void 0, void 0, void 0, t);
}
function pe(r, e, t, i, s, n, o) {
	const a = o(r, e, t, i, s, n);
	if (a !== void 0) return a;
	if (typeof r == typeof e) switch (typeof r) {
		case "bigint":
		case "string":
		case "boolean":
		case "symbol":
		case "undefined": return r === e;
		case "number": return r === e || Object.is(r, e);
		case "function": return r === e;
		case "object": return ye(r, e, n, o);
	}
	return ye(r, e, n, o);
}
function ye(r, e, t, i) {
	if (Object.is(r, e)) return !0;
	let s = Ai(r), n = Ai(e);
	if (s === xi && (s = Je), n === xi && (n = Je), s !== n) return !1;
	switch (s) {
		case oo: return r.toString() === e.toString();
		case ao: return ro(r.valueOf(), e.valueOf());
		case co:
		case lo:
		case ho: return Object.is(r.valueOf(), e.valueOf());
		case no: return r.source === e.source && r.flags === e.flags;
		case yo: return r === e;
	}
	t = t ?? /* @__PURE__ */ new Map();
	const o = t.get(r), a = t.get(e);
	if (o != null && a != null) return o === e;
	t.set(r, e), t.set(e, r);
	try {
		switch (s) {
			case uo:
				if (r.size !== e.size) return !1;
				for (const [c, h] of r.entries()) if (!e.has(c) || !pe(h, e.get(c), c, r, e, t, i)) return !1;
				return !0;
			case go: {
				if (r.size !== e.size) return !1;
				const c = Array.from(r.values()), h = Array.from(e.values());
				for (let l = 0; l < c.length; l++) {
					const d = c[l], g = h.findIndex((_) => pe(d, _, void 0, r, e, t, i));
					if (g === -1) return !1;
					h.splice(g, 1);
				}
				return !0;
			}
			case po:
			case Do:
			case vo:
			case wo:
			case _o:
			case Eo:
			case Io:
			case To:
			case Co:
			case Po:
			case So:
			case Oo:
				if (typeof Buffer < "u" && Buffer.isBuffer(r) !== Buffer.isBuffer(e) || r.length !== e.length) return !1;
				for (let c = 0; c < r.length; c++) if (!pe(r[c], e[c], c, r, e, t, i)) return !1;
				return !0;
			case bo: return r.byteLength !== e.byteLength ? !1 : ye(new Uint8Array(r), new Uint8Array(e), t, i);
			case fo: return r.byteLength !== e.byteLength || r.byteOffset !== e.byteOffset ? !1 : ye(new Uint8Array(r), new Uint8Array(e), t, i);
			case mo: return r.name === e.name && r.message === e.message;
			case Je: {
				if (!(ye(r.constructor, e.constructor, t, i) || Ni(r) && Ni(e))) return !1;
				const h = [...Object.keys(r), ...Ri(r)], l = [...Object.keys(e), ...Ri(e)];
				if (h.length !== l.length) return !1;
				for (let d = 0; d < h.length; d++) {
					const g = h[d], _ = r[g];
					if (!Object.hasOwn(e, g)) return !1;
					const u = e[g];
					if (!pe(_, u, g, r, e, t, i)) return !1;
				}
				return !0;
			}
			default: return !1;
		}
	} finally {
		t.delete(r), t.delete(e);
	}
}
function xo(r, e) {
	return Ao(r, e, Ro);
}
var No = Object.defineProperty, $i = Object.getOwnPropertySymbols, $o = Object.prototype.hasOwnProperty, zo = Object.prototype.propertyIsEnumerable, Xe = (r, e, t) => e in r ? No(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, zi = (r, e) => {
	for (var t in e || (e = {})) $o.call(e, t) && Xe(r, t, e[t]);
	if ($i) for (var t of $i(e)) zo.call(e, t) && Xe(r, t, e[t]);
	return r;
}, z = (r, e, t) => Xe(r, typeof e != "symbol" ? e + "" : e, t);
var Li = class extends f$3 {
	constructor(e, t, i, s = B, n = void 0) {
		super(e, t, i, s), this.core = e, this.logger = t, this.name = i, z(this, "map", /* @__PURE__ */ new Map()), z(this, "version", "0.3"), z(this, "cached", []), z(this, "initialized", !1), z(this, "getKey"), z(this, "storagePrefix", B), z(this, "recentlyDeleted", []), z(this, "recentlyDeletedLimit", 200), z(this, "init", async () => {
			this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((o) => {
				this.getKey && o !== null && !kt$1(o) ? this.map.set(this.getKey(o), o) : wa(o) ? this.map.set(o.id, o) : xa(o) && this.map.set(o.topic, o);
			}), this.cached = [], this.initialized = !0);
		}), z(this, "set", async (o, a) => {
			this.isInitialized(), this.map.has(o) ? await this.update(o, a) : (this.logger.debug("Setting value"), this.logger.trace({
				type: "method",
				method: "set",
				key: o,
				value: a
			}), this.map.set(o, a), await this.persist());
		}), z(this, "get", (o) => (this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({
			type: "method",
			method: "get",
			key: o
		}), this.getData(o))), z(this, "getAll", (o) => (this.isInitialized(), o ? this.values.filter((a) => Object.keys(o).every((c) => xo(a[c], o[c]))) : this.values)), z(this, "update", async (o, a) => {
			this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({
				type: "method",
				method: "update",
				key: o,
				update: a
			});
			const c = zi(zi({}, this.getData(o)), a);
			this.map.set(o, c), await this.persist();
		}), z(this, "delete", async (o, a) => {
			this.isInitialized(), this.map.has(o) && (this.logger.debug("Deleting value"), this.logger.trace({
				type: "method",
				method: "delete",
				key: o,
				reason: a
			}), this.map.delete(o), this.addToRecentlyDeleted(o), await this.persist());
		}), this.logger = E$1(t, this.name), this.storagePrefix = s, this.getKey = n;
	}
	get context() {
		return y$2(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	get length() {
		return this.map.size;
	}
	get keys() {
		return Array.from(this.map.keys());
	}
	get values() {
		return Array.from(this.map.values());
	}
	addToRecentlyDeleted(e) {
		this.recentlyDeleted.push(e), this.recentlyDeleted.length >= this.recentlyDeletedLimit && this.recentlyDeleted.splice(0, this.recentlyDeletedLimit / 2);
	}
	async setDataStore(e) {
		await this.core.storage.setItem(this.storageKey, e);
	}
	async getDataStore() {
		return await this.core.storage.getItem(this.storageKey);
	}
	getData(e) {
		const t = this.map.get(e);
		if (!t) {
			if (this.recentlyDeleted.includes(e)) {
				const { message: s } = Et$2("MISSING_OR_INVALID", `Record was recently deleted - ${this.name}: ${e}`);
				throw this.logger.error(s), new Error(s);
			}
			const { message: i } = Et$2("NO_MATCHING_KEY", `${this.name}: ${e}`);
			throw this.logger.error(i), new Error(i);
		}
		return t;
	}
	async persist() {
		await this.setDataStore(this.values);
	}
	async restore() {
		try {
			const e = await this.getDataStore();
			if (typeof e > "u" || !e.length) return;
			if (this.map.size) {
				const { message: t } = Et$2("RESTORE_WILL_OVERRIDE", this.name);
				throw this.logger.error(t), new Error(t);
			}
			this.cached = e, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({
				type: "method",
				method: "restore",
				value: this.values
			});
		} catch (e) {
			this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e);
		}
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var Lo = Object.defineProperty, ko = (r, e, t) => e in r ? Lo(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, p = (r, e, t) => ko(r, typeof e != "symbol" ? e + "" : e, t);
var ki = class {
	constructor(e, t) {
		this.core = e, this.logger = t, p(this, "name", Mt), p(this, "version", "0.3"), p(this, "events", new gs()), p(this, "pairings"), p(this, "initialized", !1), p(this, "storagePrefix", B), p(this, "ignoredPayloadTypes", [1]), p(this, "registeredMethods", []), p(this, "init", async () => {
			this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = !0, this.logger.trace("Initialized"));
		}), p(this, "register", ({ methods: i }) => {
			this.isInitialized(), this.registeredMethods = [...new Set([...this.registeredMethods, ...i])];
		}), p(this, "create", async (i) => {
			this.isInitialized();
			const s = qc(), n = await this.core.crypto.setSymKey(s), o = ii$1(import_cjs$3.FIVE_MINUTES), a = { protocol: "irn" }, c = {
				topic: n,
				expiry: o,
				relay: a,
				active: !1,
				methods: i?.methods
			}, h = oa({
				protocol: this.core.protocol,
				version: this.core.version,
				topic: n,
				symKey: s,
				relay: a,
				expiryTimestamp: o,
				methods: i?.methods
			});
			return this.events.emit(re.create, c), this.core.expirer.set(n, o), await this.pairings.set(n, c), await this.core.relayer.subscribe(n, { transportType: i?.transportType }), {
				topic: n,
				uri: h
			};
		}), p(this, "pair", async (i) => {
			this.isInitialized();
			const s = this.core.eventClient.createEvent({ properties: {
				topic: i?.uri,
				trace: [G.pairing_started]
			} });
			this.isValidPair(i, s);
			const { topic: n, symKey: o, relay: a, expiryTimestamp: c, methods: h } = ra(i.uri);
			s.props.properties.topic = n, s.addTrace(G.pairing_uri_validation_success), s.addTrace(G.pairing_uri_not_expired);
			let l;
			if (this.pairings.keys.includes(n)) {
				if (l = this.pairings.get(n), s.addTrace(G.existing_pairing), l.active) throw s.setError(Y.active_pairing_already_exists), /* @__PURE__ */ new Error(`Pairing already exists: ${n}. Please try again with a new connection URI.`);
				s.addTrace(G.pairing_not_expired);
			}
			const d = c || ii$1(import_cjs$3.FIVE_MINUTES), g = {
				topic: n,
				relay: a,
				expiry: d,
				active: !1,
				methods: h
			};
			this.core.expirer.set(n, d), await this.pairings.set(n, g), s.addTrace(G.store_new_pairing), i.activatePairing && await this.activate({ topic: n }), this.events.emit(re.create, g), s.addTrace(G.emit_inactive_pairing), this.core.crypto.keychain.has(n) || await this.core.crypto.setSymKey(o, n), s.addTrace(G.subscribing_pairing_topic);
			try {
				await this.core.relayer.confirmOnlineStateOrThrow();
			} catch {
				s.setError(Y.no_internet_connection);
			}
			try {
				await this.core.relayer.subscribe(n, { relay: a });
			} catch (_) {
				throw s.setError(Y.subscribe_pairing_topic_failure), _;
			}
			return s.addTrace(G.subscribe_pairing_topic_success), g;
		}), p(this, "activate", async ({ topic: i }) => {
			this.isInitialized();
			const s = ii$1(import_cjs$3.FIVE_MINUTES);
			this.core.expirer.set(i, s), await this.pairings.update(i, {
				active: !0,
				expiry: s
			});
		}), p(this, "ping", async (i) => {
			this.isInitialized(), await this.isValidPing(i), this.logger.warn("ping() is deprecated and will be removed in the next major release.");
			const { topic: s } = i;
			if (this.pairings.keys.includes(s)) {
				const n = await this.sendRequest(s, "wc_pairingPing", {}), { done: o, resolve: a, reject: c } = ei$1();
				this.events.once(ci$1("pairing_ping", n), ({ error: h }) => {
					h ? c(h) : a();
				}), await o();
			}
		}), p(this, "updateExpiry", async ({ topic: i, expiry: s }) => {
			this.isInitialized(), await this.pairings.update(i, { expiry: s });
		}), p(this, "updateMetadata", async ({ topic: i, metadata: s }) => {
			this.isInitialized(), await this.pairings.update(i, { peerMetadata: s });
		}), p(this, "getPairings", () => (this.isInitialized(), this.pairings.values)), p(this, "disconnect", async (i) => {
			this.isInitialized(), await this.isValidDisconnect(i);
			const { topic: s } = i;
			this.pairings.keys.includes(s) && (await this.sendRequest(s, "wc_pairingDelete", Kt$1("USER_DISCONNECTED")), await this.deletePairing(s));
		}), p(this, "formatUriFromPairing", (i) => {
			this.isInitialized();
			const { topic: s, relay: n, expiry: o, methods: a } = i, c = this.core.crypto.keychain.get(s);
			return oa({
				protocol: this.core.protocol,
				version: this.core.version,
				topic: s,
				symKey: c,
				relay: n,
				expiryTimestamp: o,
				methods: a
			});
		}), p(this, "sendRequest", async (i, s, n) => {
			const o = formatJsonRpcRequest(s, n), a = await this.core.crypto.encode(i, o), c = se[s].req;
			return this.core.history.set(i, o), this.core.relayer.publish(i, a, c), o.id;
		}), p(this, "sendResult", async (i, s, n) => {
			const o = formatJsonRpcResult(i, n), a = await this.core.crypto.encode(s, o), h = se[(await this.core.history.get(s, i)).request.method].res;
			await this.core.relayer.publish(s, a, h), await this.core.history.resolve(o);
		}), p(this, "sendError", async (i, s, n) => {
			const o = formatJsonRpcError(i, n), a = await this.core.crypto.encode(s, o), c = (await this.core.history.get(s, i)).request.method, h = se[c] ? se[c].res : se.unregistered_method.res;
			await this.core.relayer.publish(s, a, h), await this.core.history.resolve(o);
		}), p(this, "deletePairing", async (i, s) => {
			await this.core.relayer.unsubscribe(i), await Promise.all([
				this.pairings.delete(i, Kt$1("USER_DISCONNECTED")),
				this.core.crypto.deleteSymKey(i),
				s ? Promise.resolve() : this.core.expirer.del(i)
			]);
		}), p(this, "cleanup", async () => {
			const i = this.pairings.getAll().filter((s) => fi$1(s.expiry));
			await Promise.all(i.map((s) => this.deletePairing(s.topic)));
		}), p(this, "onRelayEventRequest", async (i) => {
			const { topic: s, payload: n } = i;
			switch (n.method) {
				case "wc_pairingPing": return await this.onPairingPingRequest(s, n);
				case "wc_pairingDelete": return await this.onPairingDeleteRequest(s, n);
				default: return await this.onUnknownRpcMethodRequest(s, n);
			}
		}), p(this, "onRelayEventResponse", async (i) => {
			const { topic: s, payload: n } = i, o = (await this.core.history.get(s, n.id)).request.method;
			switch (o) {
				case "wc_pairingPing": return this.onPairingPingResponse(s, n);
				default: return this.onUnknownRpcMethodResponse(o);
			}
		}), p(this, "onPairingPingRequest", async (i, s) => {
			const { id: n } = s;
			try {
				this.isValidPing({ topic: i }), await this.sendResult(n, i, !0), this.events.emit(re.ping, {
					id: n,
					topic: i
				});
			} catch (o) {
				await this.sendError(n, i, o), this.logger.error(o);
			}
		}), p(this, "onPairingPingResponse", (i, s) => {
			const { id: n } = s;
			setTimeout(() => {
				isJsonRpcResult(s) ? this.events.emit(ci$1("pairing_ping", n), {}) : isJsonRpcError(s) && this.events.emit(ci$1("pairing_ping", n), { error: s.error });
			}, 500);
		}), p(this, "onPairingDeleteRequest", async (i, s) => {
			const { id: n } = s;
			try {
				this.isValidDisconnect({ topic: i }), await this.deletePairing(i), this.events.emit(re.delete, {
					id: n,
					topic: i
				});
			} catch (o) {
				await this.sendError(n, i, o), this.logger.error(o);
			}
		}), p(this, "onUnknownRpcMethodRequest", async (i, s) => {
			const { id: n, method: o } = s;
			try {
				if (this.registeredMethods.includes(o)) return;
				const a = Kt$1("WC_METHOD_UNSUPPORTED", o);
				await this.sendError(n, i, a), this.logger.error(a);
			} catch (a) {
				await this.sendError(n, i, a), this.logger.error(a);
			}
		}), p(this, "onUnknownRpcMethodResponse", (i) => {
			this.registeredMethods.includes(i) || this.logger.error(Kt$1("WC_METHOD_UNSUPPORTED", i));
		}), p(this, "isValidPair", (i, s) => {
			var n;
			if (!Aa(i)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", `pair() params: ${i}`);
				throw s.setError(Y.malformed_pairing_uri), new Error(a);
			}
			if (!ma(i.uri)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", `pair() uri: ${i.uri}`);
				throw s.setError(Y.malformed_pairing_uri), new Error(a);
			}
			const o = ra(i?.uri);
			if (!((n = o?.relay) != null && n.protocol)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", "pair() uri#relay-protocol");
				throw s.setError(Y.malformed_pairing_uri), new Error(a);
			}
			if (!(o != null && o.symKey)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", "pair() uri#symKey");
				throw s.setError(Y.malformed_pairing_uri), new Error(a);
			}
			if (o != null && o.expiryTimestamp && (0, import_cjs$3.toMiliseconds)(o?.expiryTimestamp) < Date.now()) {
				s.setError(Y.pairing_expired);
				const { message: a } = Et$2("EXPIRED", "pair() URI has expired. Please try again with a new connection URI.");
				throw new Error(a);
			}
		}), p(this, "isValidPing", async (i) => {
			if (!Aa(i)) {
				const { message: n } = Et$2("MISSING_OR_INVALID", `ping() params: ${i}`);
				throw new Error(n);
			}
			const { topic: s } = i;
			await this.isValidPairingTopic(s);
		}), p(this, "isValidDisconnect", async (i) => {
			if (!Aa(i)) {
				const { message: n } = Et$2("MISSING_OR_INVALID", `disconnect() params: ${i}`);
				throw new Error(n);
			}
			const { topic: s } = i;
			await this.isValidPairingTopic(s);
		}), p(this, "isValidPairingTopic", async (i) => {
			if (!it$1(i, !1)) {
				const { message: s } = Et$2("MISSING_OR_INVALID", `pairing topic should be a string: ${i}`);
				throw new Error(s);
			}
			if (!this.pairings.keys.includes(i)) {
				const { message: s } = Et$2("NO_MATCHING_KEY", `pairing topic doesn't exist: ${i}`);
				throw new Error(s);
			}
			if (fi$1(this.pairings.get(i).expiry)) {
				await this.deletePairing(i);
				const { message: s } = Et$2("EXPIRED", `pairing topic: ${i}`);
				throw new Error(s);
			}
		}), this.core = e, this.logger = E$1(t, this.name), this.pairings = new Li(this.core, this.logger, this.name, this.storagePrefix);
	}
	get context() {
		return y$2(this.logger);
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
	registerRelayerEvents() {
		this.core.relayer.on(C.message, async (e) => {
			const { topic: t, message: i, transportType: s } = e;
			if (this.pairings.keys.includes(t) && s !== Q.link_mode && !this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i))) try {
				const n = await this.core.crypto.decode(t, i);
				isJsonRpcRequest(n) ? (this.core.history.set(t, n), await this.onRelayEventRequest({
					topic: t,
					payload: n
				})) : isJsonRpcResponse(n) && (await this.core.history.resolve(n), await this.onRelayEventResponse({
					topic: t,
					payload: n
				}), this.core.history.delete(t, n.id)), await this.core.relayer.messages.ack(t, i);
			} catch (n) {
				this.logger.error(n);
			}
		});
	}
	registerExpirerEvents() {
		this.core.expirer.on(M.expired, async (e) => {
			const { topic: t } = si$1(e.target);
			t && this.pairings.keys.includes(t) && (await this.deletePairing(t, !0), this.events.emit(re.expire, { topic: t }));
		});
	}
};
var jo = Object.defineProperty, Uo = (r, e, t) => e in r ? jo(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, O = (r, e, t) => Uo(r, typeof e != "symbol" ? e + "" : e, t);
var ji = class extends I$1 {
	constructor(e, t) {
		super(e, t), this.core = e, this.logger = t, O(this, "records", /* @__PURE__ */ new Map()), O(this, "events", new EventEmitter()), O(this, "name", Bt), O(this, "version", "0.3"), O(this, "cached", []), O(this, "initialized", !1), O(this, "storagePrefix", B), O(this, "init", async () => {
			this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i) => this.records.set(i.id, i)), this.cached = [], this.registerEventListeners(), this.initialized = !0);
		}), O(this, "set", (i, s, n) => {
			if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({
				type: "method",
				method: "set",
				topic: i,
				request: s,
				chainId: n
			}), this.records.has(s.id)) return;
			const o = {
				id: s.id,
				topic: i,
				request: {
					method: s.method,
					params: s.params || null
				},
				chainId: n,
				expiry: ii$1(import_cjs$3.THIRTY_DAYS)
			};
			this.records.set(o.id, o), this.persist(), this.events.emit(F.created, o);
		}), O(this, "resolve", async (i) => {
			if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({
				type: "method",
				method: "update",
				response: i
			}), !this.records.has(i.id)) return;
			const s = await this.getRecord(i.id);
			typeof s.response > "u" && (s.response = isJsonRpcError(i) ? { error: i.error } : { result: i.result }, this.records.set(s.id, s), this.persist(), this.events.emit(F.updated, s));
		}), O(this, "get", async (i, s) => (this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({
			type: "method",
			method: "get",
			topic: i,
			id: s
		}), await this.getRecord(s))), O(this, "delete", (i, s) => {
			this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({
				type: "method",
				method: "delete",
				id: s
			}), this.values.forEach((n) => {
				if (n.topic === i) {
					if (typeof s < "u" && n.id !== s) return;
					this.records.delete(n.id), this.events.emit(F.deleted, n);
				}
			}), this.persist();
		}), O(this, "exists", async (i, s) => (this.isInitialized(), this.records.has(s) ? (await this.getRecord(s)).topic === i : !1)), O(this, "on", (i, s) => {
			this.events.on(i, s);
		}), O(this, "once", (i, s) => {
			this.events.once(i, s);
		}), O(this, "off", (i, s) => {
			this.events.off(i, s);
		}), O(this, "removeListener", (i, s) => {
			this.events.removeListener(i, s);
		}), this.logger = E$1(t, this.name);
	}
	get context() {
		return y$2(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	get size() {
		return this.records.size;
	}
	get keys() {
		return Array.from(this.records.keys());
	}
	get values() {
		return Array.from(this.records.values());
	}
	get pending() {
		const e = [];
		return this.values.forEach((t) => {
			if (typeof t.response < "u") return;
			const i = {
				topic: t.topic,
				request: formatJsonRpcRequest(t.request.method, t.request.params, t.id),
				chainId: t.chainId
			};
			return e.push(i);
		}), e;
	}
	async setJsonRpcRecords(e) {
		await this.core.storage.setItem(this.storageKey, e);
	}
	async getJsonRpcRecords() {
		return await this.core.storage.getItem(this.storageKey);
	}
	getRecord(e) {
		this.isInitialized();
		const t = this.records.get(e);
		if (!t) {
			const { message: i } = Et$2("NO_MATCHING_KEY", `${this.name}: ${e}`);
			throw new Error(i);
		}
		return t;
	}
	async persist() {
		await this.setJsonRpcRecords(this.values), this.events.emit(F.sync);
	}
	async restore() {
		try {
			const e = await this.getJsonRpcRecords();
			if (typeof e > "u" || !e.length) return;
			if (this.records.size) {
				const { message: t } = Et$2("RESTORE_WILL_OVERRIDE", this.name);
				throw this.logger.error(t), new Error(t);
			}
			this.cached = e, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({
				type: "method",
				method: "restore",
				records: this.values
			});
		} catch (e) {
			this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e);
		}
	}
	registerEventListeners() {
		this.events.on(F.created, (e) => {
			const t = F.created;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				record: e
			});
		}), this.events.on(F.updated, (e) => {
			const t = F.updated;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				record: e
			});
		}), this.events.on(F.deleted, (e) => {
			const t = F.deleted;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				record: e
			});
		}), this.core.heartbeat.on(r$1.pulse, () => {
			this.cleanup();
		});
	}
	cleanup() {
		try {
			this.isInitialized();
			let e = !1;
			this.records.forEach((t) => {
				(0, import_cjs$3.toMiliseconds)(t.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${t.id}`), this.records.delete(t.id), this.events.emit(F.deleted, t, !1), e = !0);
			}), e && this.persist();
		} catch (e) {
			this.logger.warn(e);
		}
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var Fo = Object.defineProperty, Mo = (r, e, t) => e in r ? Fo(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, A$1 = (r, e, t) => Mo(r, typeof e != "symbol" ? e + "" : e, t);
var Ui = class extends S$1 {
	constructor(e, t) {
		super(e, t), this.core = e, this.logger = t, A$1(this, "expirations", /* @__PURE__ */ new Map()), A$1(this, "events", new EventEmitter()), A$1(this, "name", qt), A$1(this, "version", "0.3"), A$1(this, "cached", []), A$1(this, "initialized", !1), A$1(this, "storagePrefix", B), A$1(this, "init", async () => {
			this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i) => this.expirations.set(i.target, i)), this.cached = [], this.registerEventListeners(), this.initialized = !0);
		}), A$1(this, "has", (i) => {
			try {
				const s = this.formatTarget(i);
				return typeof this.getExpiration(s) < "u";
			} catch {
				return !1;
			}
		}), A$1(this, "set", (i, s) => {
			this.isInitialized();
			const n = this.formatTarget(i), o = {
				target: n,
				expiry: s
			};
			this.expirations.set(n, o), this.checkExpiry(n, o), this.events.emit(M.created, {
				target: n,
				expiration: o
			});
		}), A$1(this, "get", (i) => {
			this.isInitialized();
			const s = this.formatTarget(i);
			return this.getExpiration(s);
		}), A$1(this, "del", (i) => {
			if (this.isInitialized(), this.has(i)) {
				const s = this.formatTarget(i), n = this.getExpiration(s);
				this.expirations.delete(s), this.events.emit(M.deleted, {
					target: s,
					expiration: n
				});
			}
		}), A$1(this, "on", (i, s) => {
			this.events.on(i, s);
		}), A$1(this, "once", (i, s) => {
			this.events.once(i, s);
		}), A$1(this, "off", (i, s) => {
			this.events.off(i, s);
		}), A$1(this, "removeListener", (i, s) => {
			this.events.removeListener(i, s);
		}), this.logger = E$1(t, this.name);
	}
	get context() {
		return y$2(this.logger);
	}
	get storageKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
	}
	get length() {
		return this.expirations.size;
	}
	get keys() {
		return Array.from(this.expirations.keys());
	}
	get values() {
		return Array.from(this.expirations.values());
	}
	formatTarget(e) {
		if (typeof e == "string") return ri$1(e);
		if (typeof e == "number") return oi$1(e);
		const { message: t } = Et$2("UNKNOWN_TYPE", `Target type: ${typeof e}`);
		throw new Error(t);
	}
	async setExpirations(e) {
		await this.core.storage.setItem(this.storageKey, e);
	}
	async getExpirations() {
		return await this.core.storage.getItem(this.storageKey);
	}
	async persist() {
		await this.setExpirations(this.values), this.events.emit(M.sync);
	}
	async restore() {
		try {
			const e = await this.getExpirations();
			if (typeof e > "u" || !e.length) return;
			if (this.expirations.size) {
				const { message: t } = Et$2("RESTORE_WILL_OVERRIDE", this.name);
				throw this.logger.error(t), new Error(t);
			}
			this.cached = e, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({
				type: "method",
				method: "restore",
				expirations: this.values
			});
		} catch (e) {
			this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e);
		}
	}
	getExpiration(e) {
		const t = this.expirations.get(e);
		if (!t) {
			const { message: i } = Et$2("NO_MATCHING_KEY", `${this.name}: ${e}`);
			throw this.logger.warn(i), new Error(i);
		}
		return t;
	}
	checkExpiry(e, t) {
		const { expiry: i } = t;
		(0, import_cjs$3.toMiliseconds)(i) - Date.now() <= 0 && this.expire(e, t);
	}
	expire(e, t) {
		this.expirations.delete(e), this.events.emit(M.expired, {
			target: e,
			expiration: t
		});
	}
	checkExpirations() {
		this.core.relayer.connected && this.expirations.forEach((e, t) => this.checkExpiry(t, e));
	}
	registerEventListeners() {
		this.core.heartbeat.on(r$1.pulse, () => this.checkExpirations()), this.events.on(M.created, (e) => {
			const t = M.created;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				data: e
			}), this.persist();
		}), this.events.on(M.expired, (e) => {
			const t = M.expired;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				data: e
			}), this.persist();
		}), this.events.on(M.deleted, (e) => {
			const t = M.deleted;
			this.logger.info(`Emitting ${t}`), this.logger.debug({
				type: "event",
				event: t,
				data: e
			}), this.persist();
		});
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: e } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(e);
		}
	}
};
var Ko = Object.defineProperty, Bo = (r, e, t) => e in r ? Ko(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, w = (r, e, t) => Bo(r, typeof e != "symbol" ? e + "" : e, t);
var Fi = class extends M$1 {
	constructor(e, t, i) {
		super(e, t, i), this.core = e, this.logger = t, this.store = i, w(this, "name", Wt), w(this, "abortController"), w(this, "isDevEnv"), w(this, "verifyUrlV3", Yt), w(this, "storagePrefix", B), w(this, "version", 2), w(this, "publicKey"), w(this, "fetchPromise"), w(this, "init", async () => {
			var s;
			this.isDevEnv || (this.publicKey = await this.store.getItem(this.storeKey), this.publicKey && (0, import_cjs$3.toMiliseconds)((s = this.publicKey) == null ? void 0 : s.expiresAt) < Date.now() && (this.logger.debug("verify v2 public key expired"), await this.removePublicKey()));
		}), w(this, "register", async (s) => {
			if (!zt$1() || this.isDevEnv) return;
			const n = window.location.origin, { id: o, decryptedId: a } = s, c = `${this.verifyUrlV3}/attestation?projectId=${this.core.projectId}&origin=${n}&id=${o}&decryptedId=${a}`;
			try {
				const h = (0, import_cjs$1.getDocument)(), l = this.startAbortTimer(import_cjs$3.ONE_SECOND * 5), d = await new Promise((g, _) => {
					const u = () => {
						window.removeEventListener("message", x), h.body.removeChild(b), _("attestation aborted");
					};
					this.abortController.signal.addEventListener("abort", u);
					const b = h.createElement("iframe");
					b.src = c, b.style.display = "none", b.addEventListener("error", u, { signal: this.abortController.signal });
					const x = (I) => {
						if (I.data && typeof I.data == "string") try {
							const D = JSON.parse(I.data);
							if (D.type === "verify_attestation") {
								if (sn$2(D.attestation).payload.id !== o) return;
								clearInterval(l), h.body.removeChild(b), this.abortController.signal.removeEventListener("abort", u), window.removeEventListener("message", x), g(D.attestation === null ? "" : D.attestation);
							}
						} catch (D) {
							this.logger.warn(D);
						}
					};
					h.body.appendChild(b), window.addEventListener("message", x, { signal: this.abortController.signal });
				});
				return this.logger.debug("jwt attestation", d), d;
			} catch (h) {
				this.logger.warn(h);
			}
			return "";
		}), w(this, "resolve", async (s) => {
			if (this.isDevEnv) return "";
			const { attestationId: n, hash: o, encryptedId: a } = s;
			if (n === "") {
				this.logger.debug("resolve: attestationId is empty, skipping");
				return;
			}
			if (n) {
				if (sn$2(n).payload.id !== a) return;
				const h = await this.isValidJwtAttestation(n);
				if (h) {
					if (!h.isVerified) {
						this.logger.warn("resolve: jwt attestation: origin url not verified");
						return;
					}
					return h;
				}
			}
			if (!o) return;
			const c = this.getVerifyUrl(s?.verifyUrl);
			return this.fetchAttestation(o, c);
		}), w(this, "fetchAttestation", async (s, n) => {
			this.logger.debug(`resolving attestation: ${s} from url: ${n}`);
			const o = this.startAbortTimer(import_cjs$3.ONE_SECOND * 5), a = await fetch(`${n}/attestation/${s}?v2Supported=true`, { signal: this.abortController.signal });
			return clearTimeout(o), a.status === 200 ? await a.json() : void 0;
		}), w(this, "getVerifyUrl", (s) => {
			let n = s || "https://verify.walletconnect.org";
			return Jt.includes(n) || (this.logger.info(`verify url: ${n}, not included in trusted list, assigning default: https://verify.walletconnect.org`), n = "https://verify.walletconnect.org"), n;
		}), w(this, "fetchPublicKey", async () => {
			try {
				this.logger.debug(`fetching public key from: ${this.verifyUrlV3}`);
				const s = this.startAbortTimer(import_cjs$3.FIVE_SECONDS), n = await fetch(`${this.verifyUrlV3}/public-key`, { signal: this.abortController.signal });
				return clearTimeout(s), await n.json();
			} catch (s) {
				this.logger.warn(s);
			}
		}), w(this, "persistPublicKey", async (s) => {
			this.logger.debug("persisting public key to local storage", s), await this.store.setItem(this.storeKey, s), this.publicKey = s;
		}), w(this, "removePublicKey", async () => {
			this.logger.debug("removing verify v2 public key from storage"), await this.store.removeItem(this.storeKey), this.publicKey = void 0;
		}), w(this, "isValidJwtAttestation", async (s) => {
			const n = await this.getPublicKey();
			try {
				if (n) return this.validateAttestation(s, n);
			} catch (a) {
				this.logger.error(a), this.logger.warn("error validating attestation");
			}
			const o = await this.fetchAndPersistPublicKey();
			try {
				if (o) return this.validateAttestation(s, o);
			} catch (a) {
				this.logger.error(a), this.logger.warn("error validating attestation");
			}
		}), w(this, "getPublicKey", async () => this.publicKey ? this.publicKey : await this.fetchAndPersistPublicKey()), w(this, "fetchAndPersistPublicKey", async () => {
			if (this.fetchPromise) return await this.fetchPromise, this.publicKey;
			this.fetchPromise = new Promise(async (n) => {
				const o = await this.fetchPublicKey();
				o && (await this.persistPublicKey(o), n(o));
			});
			const s = await this.fetchPromise;
			return this.fetchPromise = void 0, s;
		}), w(this, "validateAttestation", (s, n) => {
			const o = ta(s, n.publicKey), a = {
				hasExpired: (0, import_cjs$3.toMiliseconds)(o.exp) < Date.now(),
				payload: o
			};
			if (a.hasExpired) throw this.logger.warn("resolve: jwt attestation expired"), /* @__PURE__ */ new Error("JWT attestation expired");
			return {
				origin: a.payload.origin,
				isScam: a.payload.isScam,
				isVerified: a.payload.isVerified
			};
		}), this.logger = E$1(t, this.name), this.abortController = new AbortController(), this.isDevEnv = hi$1(), this.init();
	}
	get storeKey() {
		return this.storagePrefix + this.version + this.core.customStoragePrefix + "//verify:public:key";
	}
	get context() {
		return y$2(this.logger);
	}
	startAbortTimer(e) {
		return this.abortController = new AbortController(), setTimeout(() => this.abortController.abort(), (0, import_cjs$3.toMiliseconds)(e));
	}
};
var Vo = Object.defineProperty, qo = (r, e, t) => e in r ? Vo(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, Mi = (r, e, t) => qo(r, typeof e != "symbol" ? e + "" : e, t);
var Ki = class extends O$1 {
	constructor(e, t) {
		super(e, t), this.projectId = e, this.logger = t, Mi(this, "context", Xt), Mi(this, "registerDeviceToken", async (i) => {
			const { clientId: s, token: n, notificationType: o, enableEncrypted: a = !1 } = i, c = `${Zt}/${this.projectId}/clients`;
			await fetch(c, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					client_id: s,
					type: o,
					token: n,
					always_raw: a
				})
			});
		}), this.logger = E$1(t, this.context);
	}
};
var Go = Object.defineProperty, Bi = Object.getOwnPropertySymbols, Wo = Object.prototype.hasOwnProperty, Ho = Object.prototype.propertyIsEnumerable, Ze = (r, e, t) => e in r ? Go(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, be = (r, e) => {
	for (var t in e || (e = {})) Wo.call(e, t) && Ze(r, t, e[t]);
	if (Bi) for (var t of Bi(e)) Ho.call(e, t) && Ze(r, t, e[t]);
	return r;
}, E = (r, e, t) => Ze(r, typeof e != "symbol" ? e + "" : e, t);
var Vi = class extends R$1 {
	constructor(e, t, i = !0) {
		super(e, t, i), this.core = e, this.logger = t, E(this, "context", ei), E(this, "storagePrefix", B), E(this, "storageVersion", Qt), E(this, "events", /* @__PURE__ */ new Map()), E(this, "shouldPersist", !1), E(this, "init", async () => {
			if (!hi$1()) try {
				const s = {
					eventId: di$1(),
					timestamp: Date.now(),
					domain: this.getAppDomain(),
					props: {
						event: "INIT",
						type: "",
						properties: {
							client_id: await this.core.crypto.getClientId(),
							user_agent: cr$1(this.core.relayer.protocol, this.core.relayer.version, _e$1)
						}
					}
				};
				await this.sendEvent([s]);
			} catch (s) {
				this.logger.warn(s);
			}
		}), E(this, "createEvent", (s) => {
			const { event: n = "ERROR", type: o = "", properties: { topic: a, trace: c } } = s, h = di$1(), l = this.core.projectId || "", g = be({
				eventId: h,
				timestamp: Date.now(),
				props: {
					event: n,
					type: o,
					properties: {
						topic: a,
						trace: c
					}
				},
				bundleId: l,
				domain: this.getAppDomain()
			}, this.setMethods(h));
			return this.telemetryEnabled && (this.events.set(h, g), this.shouldPersist = !0), g;
		}), E(this, "getEvent", (s) => {
			const { eventId: n, topic: o } = s;
			if (n) return this.events.get(n);
			const a = Array.from(this.events.values()).find((c) => c.props.properties.topic === o);
			if (a) return be(be({}, a), this.setMethods(a.eventId));
		}), E(this, "deleteEvent", (s) => {
			const { eventId: n } = s;
			this.events.delete(n), this.shouldPersist = !0;
		}), E(this, "setEventListeners", () => {
			this.core.heartbeat.on(r$1.pulse, async () => {
				this.shouldPersist && await this.persist(), this.events.forEach((s) => {
					(0, import_cjs$3.fromMiliseconds)(Date.now()) - (0, import_cjs$3.fromMiliseconds)(s.timestamp) > 86400 && (this.events.delete(s.eventId), this.shouldPersist = !0);
				});
			});
		}), E(this, "setMethods", (s) => ({
			addTrace: (n) => this.addTrace(s, n),
			setError: (n) => this.setError(s, n)
		})), E(this, "addTrace", (s, n) => {
			const o = this.events.get(s);
			o && (o.props.properties.trace.push(n), this.events.set(s, o), this.shouldPersist = !0);
		}), E(this, "setError", (s, n) => {
			const o = this.events.get(s);
			o && (o.props.type = n, o.timestamp = Date.now(), this.events.set(s, o), this.shouldPersist = !0);
		}), E(this, "persist", async () => {
			await this.core.storage.setItem(this.storageKey, Array.from(this.events.values())), this.shouldPersist = !1;
		}), E(this, "restore", async () => {
			try {
				const s = await this.core.storage.getItem(this.storageKey) || [];
				if (!s.length) return;
				s.forEach((n) => {
					this.events.set(n.eventId, be(be({}, n), this.setMethods(n.eventId)));
				});
			} catch (s) {
				this.logger.warn(s);
			}
		}), E(this, "submit", async () => {
			if (!this.telemetryEnabled || this.events.size === 0) return;
			const s = [];
			for (const [n, o] of this.events) o.props.type && s.push(o);
			if (s.length !== 0) try {
				if ((await this.sendEvent(s)).ok) for (const n of s) this.events.delete(n.eventId), this.shouldPersist = !0;
			} catch (n) {
				this.logger.warn(n);
			}
		}), E(this, "sendEvent", async (s) => {
			const n = this.getAppDomain() ? "" : "&sp=desktop";
			return await fetch(`${ii}?projectId=${this.core.projectId}&st=events_sdk&sv=js-${_e$1}${n}`, {
				method: "POST",
				body: JSON.stringify(s)
			});
		}), E(this, "getAppDomain", () => sr$1().url), this.logger = E$1(t, this.context), this.telemetryEnabled = i, i ? this.restore().then(async () => {
			await this.submit(), this.setEventListeners();
		}) : this.persist();
	}
	get storageKey() {
		return this.storagePrefix + this.storageVersion + this.core.customStoragePrefix + "//" + this.context;
	}
};
var Yo = Object.defineProperty, qi = Object.getOwnPropertySymbols, Jo = Object.prototype.hasOwnProperty, Xo = Object.prototype.propertyIsEnumerable, Qe = (r, e, t) => e in r ? Yo(r, e, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : r[e] = t, Gi = (r, e) => {
	for (var t in e || (e = {})) Jo.call(e, t) && Qe(r, t, e[t]);
	if (qi) for (var t of qi(e)) Xo.call(e, t) && Qe(r, t, e[t]);
	return r;
}, v = (r, e, t) => Qe(r, typeof e != "symbol" ? e + "" : e, t);
var Zo = class Te extends h$1 {
	constructor(e) {
		var t;
		super(e), v(this, "protocol", "wc"), v(this, "version", 2), v(this, "name", he), v(this, "relayUrl"), v(this, "projectId"), v(this, "customStoragePrefix"), v(this, "events", new EventEmitter()), v(this, "logger"), v(this, "heartbeat"), v(this, "relayer"), v(this, "crypto"), v(this, "storage"), v(this, "history"), v(this, "expirer"), v(this, "pairing"), v(this, "verify"), v(this, "echoClient"), v(this, "linkModeSupportedApps"), v(this, "eventClient"), v(this, "initialized", !1), v(this, "logChunkController"), v(this, "on", (a, c) => this.events.on(a, c)), v(this, "once", (a, c) => this.events.once(a, c)), v(this, "off", (a, c) => this.events.off(a, c)), v(this, "removeListener", (a, c) => this.events.removeListener(a, c)), v(this, "dispatchEnvelope", ({ topic: a, message: c, sessionExists: h }) => {
			if (!a || !c) return;
			const l = {
				topic: a,
				message: c,
				publishedAt: Date.now(),
				transportType: Q.link_mode
			};
			this.relayer.onLinkMessageEvent(l, { sessionExists: h });
		});
		const i = this.getGlobalCore(e?.customStoragePrefix);
		if (i) try {
			return this.customStoragePrefix = i.customStoragePrefix, this.logger = i.logger, this.heartbeat = i.heartbeat, this.crypto = i.crypto, this.history = i.history, this.expirer = i.expirer, this.storage = i.storage, this.relayer = i.relayer, this.pairing = i.pairing, this.verify = i.verify, this.echoClient = i.echoClient, this.linkModeSupportedApps = i.linkModeSupportedApps, this.eventClient = i.eventClient, this.initialized = i.initialized, this.logChunkController = i.logChunkController, i;
		} catch (a) {
			console.warn("Failed to copy global core", a);
		}
		this.projectId = e?.projectId, this.relayUrl = e?.relayUrl || "wss://relay.walletconnect.org", this.customStoragePrefix = e != null && e.customStoragePrefix ? `:${e.customStoragePrefix}` : "";
		const { logger: n, chunkLoggerController: o } = A$2({
			opts: k$2({
				level: typeof e?.logger == "string" && e.logger ? e.logger : Et$1.logger,
				name: he
			}),
			maxSizeInBytes: e?.maxLogBlobSizeInBytes,
			loggerOverride: e?.logger
		});
		this.logChunkController = o, (t = this.logChunkController) != null && t.downloadLogsBlobInBrowser && (window.downloadLogsBlobInBrowser = async () => {
			var a, c;
			(a = this.logChunkController) != null && a.downloadLogsBlobInBrowser && ((c = this.logChunkController) == null || c.downloadLogsBlobInBrowser({ clientId: await this.crypto.getClientId() }));
		}), this.logger = E$1(n, this.name), this.heartbeat = new i$2(), this.crypto = new wi(this, this.logger, e?.keychain), this.history = new ji(this, this.logger), this.expirer = new Ui(this, this.logger), this.storage = e != null && e.storage ? e.storage : new h$3(Gi(Gi({}, It), e?.storageOptions)), this.relayer = new Oi({
			core: this,
			logger: this.logger,
			relayUrl: this.relayUrl,
			projectId: this.projectId
		}), this.pairing = new ki(this, this.logger), this.verify = new Fi(this, this.logger, this.storage), this.echoClient = new Ki(this.projectId || "", this.logger), this.linkModeSupportedApps = [], this.eventClient = new Vi(this, this.logger, e?.telemetryEnabled), this.setGlobalCore(this);
	}
	static async init(e) {
		const t = new Te(e);
		await t.initialize();
		const i = await t.crypto.getClientId();
		return await t.storage.setItem(jt, i), t;
	}
	get context() {
		return y$2(this.logger);
	}
	async start() {
		this.initialized || await this.initialize();
	}
	async getLogsBlob() {
		var e;
		return (e = this.logChunkController) == null ? void 0 : e.logsToBlob({ clientId: await this.crypto.getClientId() });
	}
	async addLinkModeSupportedApp(e) {
		this.linkModeSupportedApps.includes(e) || (this.linkModeSupportedApps.push(e), await this.storage.setItem("WALLETCONNECT_LINK_MODE_APPS", this.linkModeSupportedApps));
	}
	async initialize() {
		this.logger.trace("Initialized");
		try {
			await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.linkModeSupportedApps = await this.storage.getItem("WALLETCONNECT_LINK_MODE_APPS") || [], this.initialized = !0, this.logger.info("Core Initialization Success");
		} catch (e) {
			throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`, e), this.logger.error(e.message), e;
		}
	}
	getGlobalCore(e = "") {
		try {
			if (this.isGlobalCoreDisabled()) return;
			const t = `_walletConnectCore_${e}`, i = `${t}_count`;
			return globalThis[i] = (globalThis[i] || 0) + 1, globalThis[i] > 1 && console.warn(`WalletConnect Core is already initialized. This is probably a mistake and can lead to unexpected behavior. Init() was called ${globalThis[i]} times.`), globalThis[t];
		} catch (t) {
			console.warn("Failed to get global WalletConnect core", t);
			return;
		}
	}
	setGlobalCore(e) {
		var t;
		try {
			if (this.isGlobalCoreDisabled()) return;
			const i = `_walletConnectCore_${((t = e.opts) == null ? void 0 : t.customStoragePrefix) || ""}`;
			globalThis[i] = e;
		} catch (i) {
			console.warn("Failed to set global WalletConnect core", i);
		}
	}
	isGlobalCoreDisabled() {
		try {
			return typeof process < "u" && process.env.DISABLE_GLOBAL_CORE === "true";
		} catch {
			return !0;
		}
	}
}, De = "client", me = `wc@2:${De}:`, we = {
	name: De,
	logger: "error",
	controller: !1,
	relayUrl: "wss://relay.walletconnect.org"
}, Le = "WALLETCONNECT_DEEPLINK_CHOICE", ht = "proposal";
import_cjs$3.THIRTY_DAYS;
//#endregion
//#region ../../node_modules/.pnpm/@walletconnect+sign-client@2.21.5_bufferutil@4.1.0_db0@0.3.4_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/@walletconnect/sign-client/dist/index.es.js
var Me = "Proposal expired", dt = "session", X = import_cjs$3.SEVEN_DAYS, ut = "engine", N = {
	wc_sessionPropose: {
		req: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !0,
			tag: 1100
		},
		res: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1101
		},
		reject: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1120
		},
		autoReject: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1121
		}
	},
	wc_sessionSettle: {
		req: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1102
		},
		res: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1103
		}
	},
	wc_sessionUpdate: {
		req: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1104
		},
		res: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1105
		}
	},
	wc_sessionExtend: {
		req: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1106
		},
		res: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1107
		}
	},
	wc_sessionRequest: {
		req: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !0,
			tag: 1108
		},
		res: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1109
		}
	},
	wc_sessionEvent: {
		req: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !0,
			tag: 1110
		},
		res: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1111
		}
	},
	wc_sessionDelete: {
		req: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1112
		},
		res: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1113
		}
	},
	wc_sessionPing: {
		req: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1114
		},
		res: {
			ttl: import_cjs$3.ONE_DAY,
			prompt: !1,
			tag: 1115
		}
	},
	wc_sessionAuthenticate: {
		req: {
			ttl: import_cjs$3.ONE_HOUR,
			prompt: !0,
			tag: 1116
		},
		res: {
			ttl: import_cjs$3.ONE_HOUR,
			prompt: !1,
			tag: 1117
		},
		reject: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1118
		},
		autoReject: {
			ttl: import_cjs$3.FIVE_MINUTES,
			prompt: !1,
			tag: 1119
		}
	}
}, _e = {
	min: import_cjs$3.FIVE_MINUTES,
	max: import_cjs$3.SEVEN_DAYS
}, $ = {
	idle: "IDLE",
	active: "ACTIVE"
}, gt = {
	eth_sendTransaction: { key: "" },
	eth_sendRawTransaction: { key: "" },
	wallet_sendCalls: { key: "" },
	solana_signTransaction: { key: "signature" },
	solana_signAllTransactions: { key: "transactions" },
	solana_signAndSendTransaction: { key: "signature" },
	sui_signAndExecuteTransaction: { key: "digest" },
	sui_signTransaction: { key: "" },
	hedera_signAndExecuteTransaction: { key: "transactionId" },
	hedera_executeTransaction: { key: "transactionId" },
	near_signTransaction: { key: "" },
	near_signTransactions: { key: "" },
	tron_signTransaction: { key: "txID" },
	xrpl_signTransaction: { key: "" },
	xrpl_signTransactionFor: { key: "" },
	algo_signTxn: { key: "" },
	sendTransfer: { key: "txid" },
	stacks_stxTransfer: { key: "txId" },
	polkadot_signTransaction: { key: "" },
	cosmos_signDirect: { key: "" }
}, yt = "request", mt = [
	"wc_sessionPropose",
	"wc_sessionRequest",
	"wc_authRequest",
	"wc_sessionAuthenticate"
], _t = "auth", Et = "authKeys", ft = "pairingTopics", St = "requests", ae = `wc@1.5:${_t}:`, ce = `${ae}:PUB_KEY`;
var Os = Object.defineProperty, bs = Object.defineProperties, As = Object.getOwnPropertyDescriptors, Rt = Object.getOwnPropertySymbols, xs = Object.prototype.hasOwnProperty, Vs = Object.prototype.propertyIsEnumerable, $e = (S, o, t) => o in S ? Os(S, o, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : S[o] = t, I = (S, o) => {
	for (var t in o || (o = {})) xs.call(o, t) && $e(S, t, o[t]);
	if (Rt) for (var t of Rt(o)) Vs.call(o, t) && $e(S, t, o[t]);
	return S;
}, x = (S, o) => bs(S, As(o)), c = (S, o, t) => $e(S, typeof o != "symbol" ? o + "" : o, t);
var Cs = class extends V$1 {
	constructor(o) {
		super(o), c(this, "name", ut), c(this, "events", new gs()), c(this, "initialized", !1), c(this, "requestQueue", {
			state: $.idle,
			queue: []
		}), c(this, "sessionRequestQueue", {
			state: $.idle,
			queue: []
		}), c(this, "emittedSessionRequests", new gi$1({ limit: 500 })), c(this, "requestQueueDelay", import_cjs$3.ONE_SECOND), c(this, "expectedPairingMethodMap", /* @__PURE__ */ new Map()), c(this, "recentlyDeletedMap", /* @__PURE__ */ new Map()), c(this, "recentlyDeletedLimit", 200), c(this, "relayMessageCache", []), c(this, "pendingSessions", /* @__PURE__ */ new Map()), c(this, "init", async () => {
			this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), await this.registerLinkModeListeners(), this.client.core.pairing.register({ methods: Object.keys(N) }), this.initialized = !0, setTimeout(async () => {
				await this.processPendingMessageEvents(), this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
			}, (0, import_cjs$3.toMiliseconds)(this.requestQueueDelay)));
		}), c(this, "connect", async (t) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			const e = x(I({}, t), {
				requiredNamespaces: t.requiredNamespaces || {},
				optionalNamespaces: t.optionalNamespaces || {}
			});
			await this.isValidConnect(e), e.optionalNamespaces = ba(e.requiredNamespaces, e.optionalNamespaces), e.requiredNamespaces = {};
			const { pairingTopic: s, requiredNamespaces: i, optionalNamespaces: r, sessionProperties: n, scopedProperties: a, relays: l } = e;
			let p = s, h, u = !1;
			try {
				if (p) {
					const T = this.client.core.pairing.pairings.get(p);
					this.client.logger.warn("connect() with existing pairing topic is deprecated and will be removed in the next major release."), u = T.active;
				}
			} catch (T) {
				throw this.client.logger.error(`connect() -> pairing.get(${p}) failed`), T;
			}
			if (!p || !u) {
				const { topic: T, uri: K } = await this.client.core.pairing.create();
				p = T, h = K;
			}
			if (!p) {
				const { message: T } = Et$2("NO_MATCHING_KEY", `connect() pairing topic: ${p}`);
				throw new Error(T);
			}
			const d = await this.client.core.crypto.generateKeyPair(), w = N.wc_sessionPropose.req.ttl || import_cjs$3.FIVE_MINUTES, m = ii$1(w), y = x(I(I({
				requiredNamespaces: i,
				optionalNamespaces: r,
				relays: l ?? [{ protocol: "irn" }],
				proposer: {
					publicKey: d,
					metadata: this.client.metadata
				},
				expiryTimestamp: m,
				pairingTopic: p
			}, n && { sessionProperties: n }), a && { scopedProperties: a }), { id: payloadId() }), E = ci$1("session_connect", y.id), { reject: _, resolve: V, done: C } = ei$1(w, Me), v = ({ id: T }) => {
				T === y.id && (this.client.events.off("proposal_expire", v), this.pendingSessions.delete(y.id), this.events.emit(E, { error: {
					message: "Proposal expired",
					code: 0
				} }));
			};
			return this.client.events.on("proposal_expire", v), this.events.once(E, ({ error: T, session: K }) => {
				this.client.events.off("proposal_expire", v), T ? _(T) : K && V(K);
			}), await this.sendRequest({
				topic: p,
				method: "wc_sessionPropose",
				params: y,
				throwOnFailedPublish: !0,
				clientRpcId: y.id
			}), await this.setProposal(y.id, y), {
				uri: h,
				approval: C
			};
		}), c(this, "pair", async (t) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				return await this.client.core.pairing.pair(t);
			} catch (e) {
				throw this.client.logger.error("pair() failed"), e;
			}
		}), c(this, "approve", async (t) => {
			var e, s, i;
			const r = this.client.core.eventClient.createEvent({ properties: {
				topic: (e = t?.id) == null ? void 0 : e.toString(),
				trace: [tr.session_approve_started]
			} });
			try {
				this.isInitialized(), await this.confirmOnlineStateOrThrow();
			} catch (q) {
				throw r.setError(ir.no_internet_connection), q;
			}
			try {
				await this.isValidProposalId(t?.id);
			} catch (q) {
				throw this.client.logger.error(`approve() -> proposal.get(${t?.id}) failed`), r.setError(ir.proposal_not_found), q;
			}
			try {
				await this.isValidApprove(t);
			} catch (q) {
				throw this.client.logger.error("approve() -> isValidApprove() failed"), r.setError(ir.session_approve_namespace_validation_failure), q;
			}
			const { id: n, relayProtocol: a, namespaces: l, sessionProperties: p, scopedProperties: h, sessionConfig: u } = t, d = this.client.proposal.get(n);
			this.client.core.eventClient.deleteEvent({ eventId: r.eventId });
			const { pairingTopic: w, proposer: m, requiredNamespaces: y, optionalNamespaces: E } = d;
			let _ = (s = this.client.core.eventClient) == null ? void 0 : s.getEvent({ topic: w });
			_ || (_ = (i = this.client.core.eventClient) == null ? void 0 : i.createEvent({
				type: tr.session_approve_started,
				properties: {
					topic: w,
					trace: [tr.session_approve_started, tr.session_namespaces_validation_success]
				}
			}));
			const V = await this.client.core.crypto.generateKeyPair(), C = m.publicKey, v = await this.client.core.crypto.generateSharedKey(V, C), T = I(I(I({
				relay: { protocol: a ?? "irn" },
				namespaces: l,
				controller: {
					publicKey: V,
					metadata: this.client.metadata
				},
				expiry: ii$1(X)
			}, p && { sessionProperties: p }), h && { scopedProperties: h }), u && { sessionConfig: u }), K = Q.relay;
			_.addTrace(tr.subscribing_session_topic);
			try {
				await this.client.core.relayer.subscribe(v, { transportType: K });
			} catch (q) {
				throw _.setError(ir.subscribe_session_topic_failure), q;
			}
			_.addTrace(tr.subscribe_session_topic_success);
			const fe = x(I({}, T), {
				topic: v,
				requiredNamespaces: y,
				optionalNamespaces: E,
				pairingTopic: w,
				acknowledged: !1,
				self: T.controller,
				peer: {
					publicKey: m.publicKey,
					metadata: m.metadata
				},
				controller: V,
				transportType: Q.relay
			});
			await this.client.session.set(v, fe), _.addTrace(tr.store_session);
			try {
				_.addTrace(tr.publishing_session_settle), await this.sendRequest({
					topic: v,
					method: "wc_sessionSettle",
					params: T,
					throwOnFailedPublish: !0
				}).catch((q) => {
					throw _?.setError(ir.session_settle_publish_failure), q;
				}), _.addTrace(tr.session_settle_publish_success), _.addTrace(tr.publishing_session_approve), await this.sendResult({
					id: n,
					topic: w,
					result: {
						relay: { protocol: a ?? "irn" },
						responderPublicKey: V
					},
					throwOnFailedPublish: !0
				}).catch((q) => {
					throw _?.setError(ir.session_approve_publish_failure), q;
				}), _.addTrace(tr.session_approve_publish_success);
			} catch (q) {
				throw this.client.logger.error(q), this.client.session.delete(v, Kt$1("USER_DISCONNECTED")), await this.client.core.relayer.unsubscribe(v), q;
			}
			return this.client.core.eventClient.deleteEvent({ eventId: _.eventId }), await this.client.core.pairing.updateMetadata({
				topic: w,
				metadata: m.metadata
			}), await this.deleteProposal(n), await this.client.core.pairing.activate({ topic: w }), await this.setExpiry(v, ii$1(X)), {
				topic: v,
				acknowledged: () => Promise.resolve(this.client.session.get(v))
			};
		}), c(this, "reject", async (t) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				await this.isValidReject(t);
			} catch (r) {
				throw this.client.logger.error("reject() -> isValidReject() failed"), r;
			}
			const { id: e, reason: s } = t;
			let i;
			try {
				i = this.client.proposal.get(e).pairingTopic;
			} catch (r) {
				throw this.client.logger.error(`reject() -> proposal.get(${e}) failed`), r;
			}
			i && await this.sendError({
				id: e,
				topic: i,
				error: s,
				rpcOpts: N.wc_sessionPropose.reject
			}), await this.deleteProposal(e);
		}), c(this, "update", async (t) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				await this.isValidUpdate(t);
			} catch (h) {
				throw this.client.logger.error("update() -> isValidUpdate() failed"), h;
			}
			const { topic: e, namespaces: s } = t, { done: i, resolve: r, reject: n } = ei$1(), a = payloadId(), l = getBigIntRpcId().toString(), p = this.client.session.get(e).namespaces;
			return this.events.once(ci$1("session_update", a), ({ error: h }) => {
				h ? n(h) : r();
			}), await this.client.session.update(e, { namespaces: s }), await this.sendRequest({
				topic: e,
				method: "wc_sessionUpdate",
				params: { namespaces: s },
				throwOnFailedPublish: !0,
				clientRpcId: a,
				relayRpcId: l
			}).catch((h) => {
				this.client.logger.error(h), this.client.session.update(e, { namespaces: p }), n(h);
			}), { acknowledged: i };
		}), c(this, "extend", async (t) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				await this.isValidExtend(t);
			} catch (a) {
				throw this.client.logger.error("extend() -> isValidExtend() failed"), a;
			}
			const { topic: e } = t, s = payloadId(), { done: i, resolve: r, reject: n } = ei$1();
			return this.events.once(ci$1("session_extend", s), ({ error: a }) => {
				a ? n(a) : r();
			}), await this.setExpiry(e, ii$1(X)), this.sendRequest({
				topic: e,
				method: "wc_sessionExtend",
				params: {},
				clientRpcId: s,
				throwOnFailedPublish: !0
			}).catch((a) => {
				n(a);
			}), { acknowledged: i };
		}), c(this, "request", async (t) => {
			this.isInitialized();
			try {
				await this.isValidRequest(t);
			} catch (y) {
				throw this.client.logger.error("request() -> isValidRequest() failed"), y;
			}
			const { chainId: e, request: s, topic: i, expiry: r = N.wc_sessionRequest.req.ttl } = t, n = this.client.session.get(i);
			n?.transportType === Q.relay && await this.confirmOnlineStateOrThrow();
			const a = payloadId(), l = getBigIntRpcId().toString(), { done: p, resolve: h, reject: u } = ei$1(r, "Request expired. Please try again.");
			this.events.once(ci$1("session_request", a), ({ error: y, result: E }) => {
				y ? u(y) : h(E);
			});
			const d = "wc_sessionRequest", w = this.getAppLinkIfEnabled(n.peer.metadata, n.transportType);
			if (w) return await this.sendRequest({
				clientRpcId: a,
				relayRpcId: l,
				topic: i,
				method: d,
				params: {
					request: x(I({}, s), { expiryTimestamp: ii$1(r) }),
					chainId: e
				},
				expiry: r,
				throwOnFailedPublish: !0,
				appLink: w
			}).catch((y) => u(y)), this.client.events.emit("session_request_sent", {
				topic: i,
				request: s,
				chainId: e,
				id: a
			}), await p();
			const m = {
				request: x(I({}, s), { expiryTimestamp: ii$1(r) }),
				chainId: e
			};
			return await Promise.all([
				new Promise(async (y) => {
					await this.sendRequest({
						clientRpcId: a,
						relayRpcId: l,
						topic: i,
						method: d,
						params: m,
						expiry: r,
						throwOnFailedPublish: !0,
						tvf: this.getTVFParams(a, m)
					}).catch((E) => u(E)), this.client.events.emit("session_request_sent", {
						topic: i,
						request: s,
						chainId: e,
						id: a
					}), y();
				}),
				new Promise(async (y) => {
					var E;
					if (!((E = n.sessionConfig) != null && E.disableDeepLink)) await ai$1({
						id: a,
						topic: i,
						wcDeepLink: await ui$1(this.client.core.storage, Le)
					});
					y();
				}),
				p()
			]).then((y) => y[2]);
		}), c(this, "respond", async (t) => {
			this.isInitialized(), await this.isValidRespond(t);
			const { topic: e, response: s } = t, { id: i } = s, r = this.client.session.get(e);
			r.transportType === Q.relay && await this.confirmOnlineStateOrThrow();
			const n = this.getAppLinkIfEnabled(r.peer.metadata, r.transportType);
			isJsonRpcResult(s) ? await this.sendResult({
				id: i,
				topic: e,
				result: s.result,
				throwOnFailedPublish: !0,
				appLink: n
			}) : isJsonRpcError(s) && await this.sendError({
				id: i,
				topic: e,
				error: s.error,
				appLink: n
			}), this.cleanupAfterResponse(t);
		}), c(this, "ping", async (t) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow();
			try {
				await this.isValidPing(t);
			} catch (s) {
				throw this.client.logger.error("ping() -> isValidPing() failed"), s;
			}
			const { topic: e } = t;
			if (this.client.session.keys.includes(e)) {
				const s = payloadId(), i = getBigIntRpcId().toString(), { done: r, resolve: n, reject: a } = ei$1();
				this.events.once(ci$1("session_ping", s), ({ error: l }) => {
					l ? a(l) : n();
				}), await Promise.all([this.sendRequest({
					topic: e,
					method: "wc_sessionPing",
					params: {},
					throwOnFailedPublish: !0,
					clientRpcId: s,
					relayRpcId: i
				}), r()]);
			} else this.client.core.pairing.pairings.keys.includes(e) && (this.client.logger.warn("ping() on pairing topic is deprecated and will be removed in the next major release."), await this.client.core.pairing.ping({ topic: e }));
		}), c(this, "emit", async (t) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidEmit(t);
			const { topic: e, event: s, chainId: i } = t, r = getBigIntRpcId().toString(), n = payloadId();
			await this.sendRequest({
				topic: e,
				method: "wc_sessionEvent",
				params: {
					event: s,
					chainId: i
				},
				throwOnFailedPublish: !0,
				relayRpcId: r,
				clientRpcId: n
			});
		}), c(this, "disconnect", async (t) => {
			this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidDisconnect(t);
			const { topic: e } = t;
			if (this.client.session.keys.includes(e)) await this.sendRequest({
				topic: e,
				method: "wc_sessionDelete",
				params: Kt$1("USER_DISCONNECTED"),
				throwOnFailedPublish: !0
			}), await this.deleteSession({
				topic: e,
				emitEvent: !1
			});
			else if (this.client.core.pairing.pairings.keys.includes(e)) await this.client.core.pairing.disconnect({ topic: e });
			else {
				const { message: s } = Et$2("MISMATCHED_TOPIC", `Session or pairing topic not found: ${e}`);
				throw new Error(s);
			}
		}), c(this, "find", (t) => (this.isInitialized(), this.client.session.getAll().filter((e) => ya(e, t)))), c(this, "getPendingSessionRequests", () => this.client.pendingRequest.getAll()), c(this, "authenticate", async (t, e) => {
			var s;
			this.isInitialized(), this.isValidAuthenticate(t);
			const i = e && this.client.core.linkModeSupportedApps.includes(e) && ((s = this.client.metadata.redirect) == null ? void 0 : s.linkMode), r = i ? Q.link_mode : Q.relay;
			r === Q.relay && await this.confirmOnlineStateOrThrow();
			const { chains: n, statement: a = "", uri: l, domain: p, nonce: h, type: u, exp: d, nbf: w, methods: m = [], expiry: y } = t, E = [...t.resources || []], { topic: _, uri: V } = await this.client.core.pairing.create({
				methods: ["wc_sessionAuthenticate"],
				transportType: r
			});
			this.client.logger.info({
				message: "Generated new pairing",
				pairing: {
					topic: _,
					uri: V
				}
			});
			const C = await this.client.core.crypto.generateKeyPair(), v = Fc(C);
			if (await Promise.all([this.client.auth.authKeys.set(ce, {
				responseTopic: v,
				publicKey: C
			}), this.client.auth.pairingTopics.set(v, {
				topic: v,
				pairingTopic: _
			})]), await this.client.core.relayer.subscribe(v, { transportType: r }), this.client.logger.info(`sending request to new pairing topic: ${_}`), m.length > 0) {
				const { namespace: O } = Fe$1(n[0]);
				let k = Ef(O, "request", m);
				Oe(E) && (k = Bf(k, E.pop())), E.push(k);
			}
			const T = y && y > N.wc_sessionAuthenticate.req.ttl ? y : N.wc_sessionAuthenticate.req.ttl, K = {
				authPayload: {
					type: u ?? "caip122",
					chains: n,
					statement: a,
					aud: l,
					domain: p,
					version: "1",
					nonce: h,
					iat: (/* @__PURE__ */ new Date()).toISOString(),
					exp: d,
					nbf: w,
					resources: E
				},
				requester: {
					publicKey: C,
					metadata: this.client.metadata
				},
				expiryTimestamp: ii$1(T)
			}, q = {
				requiredNamespaces: {},
				optionalNamespaces: { eip155: {
					chains: n,
					methods: [...new Set(["personal_sign", ...m])],
					events: ["chainChanged", "accountsChanged"]
				} },
				relays: [{ protocol: "irn" }],
				pairingTopic: _,
				proposer: {
					publicKey: C,
					metadata: this.client.metadata
				},
				expiryTimestamp: ii$1(N.wc_sessionPropose.req.ttl),
				id: payloadId()
			}, { done: It, resolve: Ue, reject: Se } = ei$1(T, "Request expired"), te = payloadId(), le = ci$1("session_connect", q.id), Re = ci$1("session_request", te), pe = async ({ error: O, session: k }) => {
				this.events.off(Re, ve), O ? Se(O) : k && Ue({ session: k });
			}, ve = async (O) => {
				var k, Ge, je;
				if (await this.deletePendingAuthRequest(te, {
					message: "fulfilled",
					code: 0
				}), O.error) {
					const ie = Kt$1("WC_METHOD_UNSUPPORTED", "wc_sessionAuthenticate");
					return O.error.code === ie.code ? void 0 : (this.events.off(le, pe), Se(O.error.message));
				}
				await this.deleteProposal(q.id), this.events.off(le, pe);
				const { cacaos: Fe, responder: Q$3 } = O.result, Te = [], Qe = [];
				for (const ie of Fe) {
					await yf({
						cacao: ie,
						projectId: this.client.core.projectId
					}) || (this.client.logger.error(ie, "Signature verification failed"), Se(Kt$1("SESSION_SETTLEMENT_FAILED", "Signature verification failed")));
					const { p: qe } = ie, Pe = Oe(qe.resources), He = [Vr$1(qe.iss)], Tt = dn$1(qe.iss);
					if (Pe) {
						const Ne = If(Pe), qt = Af(Pe);
						Te.push(...Ne), He.push(...qt);
					}
					for (const Ne of He) Qe.push(`${Ne}:${Tt}`);
				}
				const se = await this.client.core.crypto.generateSharedKey(C, Q$3.publicKey);
				let he;
				Te.length > 0 && (he = {
					topic: se,
					acknowledged: !0,
					self: {
						publicKey: C,
						metadata: this.client.metadata
					},
					peer: Q$3,
					controller: Q$3.publicKey,
					expiry: ii$1(X),
					requiredNamespaces: {},
					optionalNamespaces: {},
					relay: { protocol: "irn" },
					pairingTopic: _,
					namespaces: ga([...new Set(Te)], [...new Set(Qe)]),
					transportType: r
				}, await this.client.core.relayer.subscribe(se, { transportType: r }), await this.client.session.set(se, he), _ && await this.client.core.pairing.updateMetadata({
					topic: _,
					metadata: Q$3.metadata
				}), he = this.client.session.get(se)), (k = this.client.metadata.redirect) != null && k.linkMode && (Ge = Q$3.metadata.redirect) != null && Ge.linkMode && (je = Q$3.metadata.redirect) != null && je.universal && e && (this.client.core.addLinkModeSupportedApp(Q$3.metadata.redirect.universal), this.client.session.update(se, { transportType: Q.link_mode })), Ue({
					auths: Fe,
					session: he
				});
			};
			this.events.once(le, pe), this.events.once(Re, ve);
			let Ie;
			try {
				if (i) {
					const O = formatJsonRpcRequest("wc_sessionAuthenticate", K, te);
					this.client.core.history.set(_, O);
					Ie = sa(e, _, await this.client.core.crypto.encode("", O, {
						type: 2,
						encoding: De$1
					}));
				} else await Promise.all([this.sendRequest({
					topic: _,
					method: "wc_sessionAuthenticate",
					params: K,
					expiry: t.expiry,
					throwOnFailedPublish: !0,
					clientRpcId: te
				}), this.sendRequest({
					topic: _,
					method: "wc_sessionPropose",
					params: q,
					expiry: N.wc_sessionPropose.req.ttl,
					throwOnFailedPublish: !0,
					clientRpcId: q.id
				})]);
			} catch (O) {
				throw this.events.off(le, pe), this.events.off(Re, ve), O;
			}
			return await this.setProposal(q.id, q), await this.setAuthRequest(te, {
				request: x(I({}, K), { verifyContext: {} }),
				pairingTopic: _,
				transportType: r
			}), {
				uri: Ie ?? V,
				response: It
			};
		}), c(this, "approveSessionAuthenticate", async (t) => {
			const { id: e, auths: s } = t, i = this.client.core.eventClient.createEvent({ properties: {
				topic: e.toString(),
				trace: [sr.authenticated_session_approve_started]
			} });
			try {
				this.isInitialized();
			} catch (y) {
				throw i.setError(rr.no_internet_connection), y;
			}
			const r = this.getPendingAuthRequest(e);
			if (!r) throw i.setError(rr.authenticated_session_pending_request_not_found), /* @__PURE__ */ new Error(`Could not find pending auth request with id ${e}`);
			const n = r.transportType || Q.relay;
			n === Q.relay && await this.confirmOnlineStateOrThrow();
			const a = r.requester.publicKey, l = await this.client.core.crypto.generateKeyPair(), p = Fc(a), h = {
				type: 1,
				receiverPublicKey: a,
				senderPublicKey: l
			}, u = [], d = [];
			for (const y of s) {
				if (!await yf({
					cacao: y,
					projectId: this.client.core.projectId
				})) {
					i.setError(rr.invalid_cacao);
					const v = Kt$1("SESSION_SETTLEMENT_FAILED", "Signature verification failed");
					throw await this.sendError({
						id: e,
						topic: p,
						error: v,
						encodeOpts: h
					}), new Error(v.message);
				}
				i.addTrace(sr.cacaos_verified);
				const { p: E } = y, _ = Oe(E.resources), V = [Vr$1(E.iss)], C = dn$1(E.iss);
				if (_) {
					const v = If(_), T = Af(_);
					u.push(...v), V.push(...T);
				}
				for (const v of V) d.push(`${v}:${C}`);
			}
			const w = await this.client.core.crypto.generateSharedKey(l, a);
			i.addTrace(sr.create_authenticated_session_topic);
			let m;
			if (u?.length > 0) {
				m = {
					topic: w,
					acknowledged: !0,
					self: {
						publicKey: l,
						metadata: this.client.metadata
					},
					peer: {
						publicKey: a,
						metadata: r.requester.metadata
					},
					controller: a,
					expiry: ii$1(X),
					authentication: s,
					requiredNamespaces: {},
					optionalNamespaces: {},
					relay: { protocol: "irn" },
					pairingTopic: r.pairingTopic,
					namespaces: ga([...new Set(u)], [...new Set(d)]),
					transportType: n
				}, i.addTrace(sr.subscribing_authenticated_session_topic);
				try {
					await this.client.core.relayer.subscribe(w, { transportType: n });
				} catch (y) {
					throw i.setError(rr.subscribe_authenticated_session_topic_failure), y;
				}
				i.addTrace(sr.subscribe_authenticated_session_topic_success), await this.client.session.set(w, m), i.addTrace(sr.store_authenticated_session), await this.client.core.pairing.updateMetadata({
					topic: r.pairingTopic,
					metadata: r.requester.metadata
				});
			}
			i.addTrace(sr.publishing_authenticated_session_approve);
			try {
				await this.sendResult({
					topic: p,
					id: e,
					result: {
						cacaos: s,
						responder: {
							publicKey: l,
							metadata: this.client.metadata
						}
					},
					encodeOpts: h,
					throwOnFailedPublish: !0,
					appLink: this.getAppLinkIfEnabled(r.requester.metadata, n)
				});
			} catch (y) {
				throw i.setError(rr.authenticated_session_approve_publish_failure), y;
			}
			return await this.client.auth.requests.delete(e, {
				message: "fulfilled",
				code: 0
			}), await this.client.core.pairing.activate({ topic: r.pairingTopic }), this.client.core.eventClient.deleteEvent({ eventId: i.eventId }), { session: m };
		}), c(this, "rejectSessionAuthenticate", async (t) => {
			this.isInitialized();
			const { id: e, reason: s } = t, i = this.getPendingAuthRequest(e);
			if (!i) throw new Error(`Could not find pending auth request with id ${e}`);
			i.transportType === Q.relay && await this.confirmOnlineStateOrThrow();
			const r = i.requester.publicKey, n = await this.client.core.crypto.generateKeyPair(), a = Fc(r), l = {
				type: 1,
				receiverPublicKey: r,
				senderPublicKey: n
			};
			await this.sendError({
				id: e,
				topic: a,
				error: s,
				encodeOpts: l,
				rpcOpts: N.wc_sessionAuthenticate.reject,
				appLink: this.getAppLinkIfEnabled(i.requester.metadata, i.transportType)
			}), await this.client.auth.requests.delete(e, {
				message: "rejected",
				code: 0
			}), await this.deleteProposal(e);
		}), c(this, "formatAuthMessage", (t) => {
			this.isInitialized();
			const { request: e, iss: s } = t;
			return qr$1(e, s);
		}), c(this, "processRelayMessageCache", () => {
			setTimeout(async () => {
				if (this.relayMessageCache.length !== 0) for (; this.relayMessageCache.length > 0;) try {
					const t = this.relayMessageCache.shift();
					t && await this.onRelayMessage(t);
				} catch (t) {
					this.client.logger.error(t);
				}
			}, 50);
		}), c(this, "cleanupDuplicatePairings", async (t) => {
			if (t.pairingTopic) try {
				const e = this.client.core.pairing.pairings.get(t.pairingTopic), s = this.client.core.pairing.pairings.getAll().filter((i) => {
					var r, n;
					return ((r = i.peerMetadata) == null ? void 0 : r.url) && ((n = i.peerMetadata) == null ? void 0 : n.url) === t.peer.metadata.url && i.topic && i.topic !== e.topic;
				});
				if (s.length === 0) return;
				this.client.logger.info(`Cleaning up ${s.length} duplicate pairing(s)`), await Promise.all(s.map((i) => this.client.core.pairing.disconnect({ topic: i.topic }))), this.client.logger.info("Duplicate pairings clean up finished");
			} catch (e) {
				this.client.logger.error(e);
			}
		}), c(this, "deleteSession", async (t) => {
			var e;
			const { topic: s, expirerHasDeleted: i = !1, emitEvent: r = !0, id: n = 0 } = t, { self: a } = this.client.session.get(s);
			await this.client.core.relayer.unsubscribe(s), await this.client.session.delete(s, Kt$1("USER_DISCONNECTED")), this.addToRecentlyDeleted(s, "session"), this.client.core.crypto.keychain.has(a.publicKey) && await this.client.core.crypto.deleteKeyPair(a.publicKey), this.client.core.crypto.keychain.has(s) && await this.client.core.crypto.deleteSymKey(s), i || this.client.core.expirer.del(s), this.client.core.storage.removeItem(Le).catch((l) => this.client.logger.warn(l)), this.getPendingSessionRequests().forEach((l) => {
				l.topic === s && this.deletePendingSessionRequest(l.id, Kt$1("USER_DISCONNECTED"));
			}), s === ((e = this.sessionRequestQueue.queue[0]) == null ? void 0 : e.topic) && (this.sessionRequestQueue.state = $.idle), r && this.client.events.emit("session_delete", {
				id: n,
				topic: s
			});
		}), c(this, "deleteProposal", async (t, e) => {
			if (e) try {
				const s = this.client.proposal.get(t);
				this.client.core.eventClient.getEvent({ topic: s.pairingTopic })?.setError(ir.proposal_expired);
			} catch {}
			await Promise.all([this.client.proposal.delete(t, Kt$1("USER_DISCONNECTED")), e ? Promise.resolve() : this.client.core.expirer.del(t)]), this.addToRecentlyDeleted(t, "proposal");
		}), c(this, "deletePendingSessionRequest", async (t, e, s = !1) => {
			await Promise.all([this.client.pendingRequest.delete(t, e), s ? Promise.resolve() : this.client.core.expirer.del(t)]), this.addToRecentlyDeleted(t, "request"), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i) => i.id !== t), s && (this.sessionRequestQueue.state = $.idle, this.client.events.emit("session_request_expire", { id: t }));
		}), c(this, "deletePendingAuthRequest", async (t, e, s = !1) => {
			await Promise.all([this.client.auth.requests.delete(t, e), s ? Promise.resolve() : this.client.core.expirer.del(t)]);
		}), c(this, "setExpiry", async (t, e) => {
			this.client.session.keys.includes(t) && (this.client.core.expirer.set(t, e), await this.client.session.update(t, { expiry: e }));
		}), c(this, "setProposal", async (t, e) => {
			this.client.core.expirer.set(t, ii$1(N.wc_sessionPropose.req.ttl)), await this.client.proposal.set(t, e);
		}), c(this, "setAuthRequest", async (t, e) => {
			const { request: s, pairingTopic: i, transportType: r = Q.relay } = e;
			this.client.core.expirer.set(t, s.expiryTimestamp), await this.client.auth.requests.set(t, {
				authPayload: s.authPayload,
				requester: s.requester,
				expiryTimestamp: s.expiryTimestamp,
				id: t,
				pairingTopic: i,
				verifyContext: s.verifyContext,
				transportType: r
			});
		}), c(this, "setPendingSessionRequest", async (t) => {
			const { id: e, topic: s, params: i, verifyContext: r } = t, n = i.request.expiryTimestamp || ii$1(N.wc_sessionRequest.req.ttl);
			this.client.core.expirer.set(e, n), await this.client.pendingRequest.set(e, {
				id: e,
				topic: s,
				params: i,
				verifyContext: r
			});
		}), c(this, "sendRequest", async (t) => {
			const { topic: e, method: s, params: i, expiry: r, relayRpcId: n, clientRpcId: a, throwOnFailedPublish: l, appLink: p, tvf: h } = t, u = formatJsonRpcRequest(s, i, a);
			let d;
			const w = !!p;
			try {
				const E = w ? De$1 : Qt$1;
				d = await this.client.core.crypto.encode(e, u, { encoding: E });
			} catch (E) {
				throw await this.cleanup(), this.client.logger.error(`sendRequest() -> core.crypto.encode() for topic ${e} failed`), E;
			}
			let m;
			if (mt.includes(s)) {
				const E = zc(JSON.stringify(u)), _ = zc(d);
				m = await this.client.core.verify.register({
					id: _,
					decryptedId: E
				});
			}
			const y = N[s].req;
			if (y.attestation = m, r && (y.ttl = r), n && (y.id = n), this.client.core.history.set(e, u), w) {
				const E = sa(p, e, d);
				await global.Linking.openURL(E, this.client.name);
			} else {
				const E = N[s].req;
				r && (E.ttl = r), n && (E.id = n), E.tvf = x(I({}, h), { correlationId: u.id }), l ? (E.internal = x(I({}, E.internal), { throwOnFailedPublish: !0 }), await this.client.core.relayer.publish(e, d, E)) : this.client.core.relayer.publish(e, d, E).catch((_) => this.client.logger.error(_));
			}
			return u.id;
		}), c(this, "sendResult", async (t) => {
			const { id: e, topic: s, result: i, throwOnFailedPublish: r, encodeOpts: n, appLink: a } = t, l = formatJsonRpcResult(e, i);
			let p;
			const h = a && typeof (global == null ? void 0 : global.Linking) < "u";
			try {
				const w = h ? De$1 : Qt$1;
				p = await this.client.core.crypto.encode(s, l, x(I({}, n || {}), { encoding: w }));
			} catch (w) {
				throw await this.cleanup(), this.client.logger.error(`sendResult() -> core.crypto.encode() for topic ${s} failed`), w;
			}
			let u, d;
			try {
				u = await this.client.core.history.get(s, e);
				const w = u.request;
				try {
					d = this.getTVFParams(e, w.params, i);
				} catch (m) {
					this.client.logger.warn(`sendResult() -> getTVFParams() failed: ${m?.message}`);
				}
			} catch (w) {
				throw this.client.logger.error(`sendResult() -> history.get(${s}, ${e}) failed`), w;
			}
			if (h) {
				const w = sa(a, s, p);
				await global.Linking.openURL(w, this.client.name);
			} else {
				const m = N[u.request.method].res;
				m.tvf = x(I({}, d), { correlationId: e }), r ? (m.internal = x(I({}, m.internal), { throwOnFailedPublish: !0 }), await this.client.core.relayer.publish(s, p, m)) : this.client.core.relayer.publish(s, p, m).catch((y) => this.client.logger.error(y));
			}
			await this.client.core.history.resolve(l);
		}), c(this, "sendError", async (t) => {
			const { id: e, topic: s, error: i, encodeOpts: r, rpcOpts: n, appLink: a } = t, l = formatJsonRpcError(e, i);
			let p;
			const h = a && typeof (global == null ? void 0 : global.Linking) < "u";
			try {
				const d = h ? De$1 : Qt$1;
				p = await this.client.core.crypto.encode(s, l, x(I({}, r || {}), { encoding: d }));
			} catch (d) {
				throw await this.cleanup(), this.client.logger.error(`sendError() -> core.crypto.encode() for topic ${s} failed`), d;
			}
			let u;
			try {
				u = await this.client.core.history.get(s, e);
			} catch (d) {
				throw this.client.logger.error(`sendError() -> history.get(${s}, ${e}) failed`), d;
			}
			if (h) {
				const d = sa(a, s, p);
				await global.Linking.openURL(d, this.client.name);
			} else {
				const d = u.request.method, w = n || N[d].res;
				this.client.core.relayer.publish(s, p, w);
			}
			await this.client.core.history.resolve(l);
		}), c(this, "cleanup", async () => {
			const t = [], e = [];
			this.client.session.getAll().forEach((s) => {
				let i = !1;
				fi$1(s.expiry) && (i = !0), this.client.core.crypto.keychain.has(s.topic) || (i = !0), i && t.push(s.topic);
			}), this.client.proposal.getAll().forEach((s) => {
				fi$1(s.expiryTimestamp) && e.push(s.id);
			}), await Promise.all([...t.map((s) => this.deleteSession({ topic: s })), ...e.map((s) => this.deleteProposal(s))]);
		}), c(this, "onProviderMessageEvent", async (t) => {
			!this.initialized || this.relayMessageCache.length > 0 ? this.relayMessageCache.push(t) : await this.onRelayMessage(t);
		}), c(this, "onRelayEventRequest", async (t) => {
			this.requestQueue.queue.push(t), await this.processRequestsQueue();
		}), c(this, "processRequestsQueue", async () => {
			if (this.requestQueue.state === $.active) {
				this.client.logger.info("Request queue already active, skipping...");
				return;
			}
			for (this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0;) {
				this.requestQueue.state = $.active;
				const t = this.requestQueue.queue.shift();
				if (t) try {
					await this.processRequest(t);
				} catch (e) {
					this.client.logger.warn(e);
				}
			}
			this.requestQueue.state = $.idle;
		}), c(this, "processRequest", async (t) => {
			const { topic: e, payload: s, attestation: i, transportType: r, encryptedId: n } = t, a = s.method;
			if (!this.shouldIgnorePairingRequest({
				topic: e,
				requestMethod: a
			})) switch (a) {
				case "wc_sessionPropose": return await this.onSessionProposeRequest({
					topic: e,
					payload: s,
					attestation: i,
					encryptedId: n
				});
				case "wc_sessionSettle": return await this.onSessionSettleRequest(e, s);
				case "wc_sessionUpdate": return await this.onSessionUpdateRequest(e, s);
				case "wc_sessionExtend": return await this.onSessionExtendRequest(e, s);
				case "wc_sessionPing": return await this.onSessionPingRequest(e, s);
				case "wc_sessionDelete": return await this.onSessionDeleteRequest(e, s);
				case "wc_sessionRequest": return await this.onSessionRequest({
					topic: e,
					payload: s,
					attestation: i,
					encryptedId: n,
					transportType: r
				});
				case "wc_sessionEvent": return await this.onSessionEventRequest(e, s);
				case "wc_sessionAuthenticate": return await this.onSessionAuthenticateRequest({
					topic: e,
					payload: s,
					attestation: i,
					encryptedId: n,
					transportType: r
				});
				default: return this.client.logger.info(`Unsupported request method ${a}`);
			}
		}), c(this, "onRelayEventResponse", async (t) => {
			const { topic: e, payload: s, transportType: i } = t, r = (await this.client.core.history.get(e, s.id)).request.method;
			switch (r) {
				case "wc_sessionPropose": return this.onSessionProposeResponse(e, s, i);
				case "wc_sessionSettle": return this.onSessionSettleResponse(e, s);
				case "wc_sessionUpdate": return this.onSessionUpdateResponse(e, s);
				case "wc_sessionExtend": return this.onSessionExtendResponse(e, s);
				case "wc_sessionPing": return this.onSessionPingResponse(e, s);
				case "wc_sessionRequest": return this.onSessionRequestResponse(e, s);
				case "wc_sessionAuthenticate": return this.onSessionAuthenticateResponse(e, s);
				default: return this.client.logger.info(`Unsupported response method ${r}`);
			}
		}), c(this, "onRelayEventUnknownPayload", (t) => {
			const { topic: e } = t, { message: s } = Et$2("MISSING_OR_INVALID", `Decoded payload on topic ${e} is not identifiable as a JSON-RPC request or a response.`);
			throw new Error(s);
		}), c(this, "shouldIgnorePairingRequest", (t) => {
			const { topic: e, requestMethod: s } = t, i = this.expectedPairingMethodMap.get(e);
			return !i || i.includes(s) ? !1 : !!(i.includes("wc_sessionAuthenticate") && this.client.events.listenerCount("session_authenticate") > 0);
		}), c(this, "onSessionProposeRequest", async (t) => {
			const { topic: e, payload: s, attestation: i, encryptedId: r } = t, { params: n, id: a } = s;
			try {
				const l = this.client.core.eventClient.getEvent({ topic: e });
				this.client.events.listenerCount("session_proposal") === 0 && (console.warn("No listener for session_proposal event"), l?.setError(Y.proposal_listener_not_found)), this.isValidConnect(I({}, s.params));
				const h = I({
					id: a,
					pairingTopic: e,
					expiryTimestamp: n.expiryTimestamp || ii$1(N.wc_sessionPropose.req.ttl),
					attestation: i,
					encryptedId: r
				}, n);
				await this.setProposal(a, h);
				const u = await this.getVerifyContext({
					attestationId: i,
					hash: zc(JSON.stringify(s)),
					encryptedId: r,
					metadata: h.proposer.metadata
				});
				l?.addTrace(G.emit_session_proposal), this.client.events.emit("session_proposal", {
					id: a,
					params: h,
					verifyContext: u
				});
			} catch (l) {
				await this.sendError({
					id: a,
					topic: e,
					error: l,
					rpcOpts: N.wc_sessionPropose.autoReject
				}), this.client.logger.error(l);
			}
		}), c(this, "onSessionProposeResponse", async (t, e, s) => {
			const { id: i } = e;
			if (isJsonRpcResult(e)) {
				const { result: r } = e;
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					result: r
				});
				const n = this.client.proposal.get(i);
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					proposal: n
				});
				const a = n.proposer.publicKey;
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					selfPublicKey: a
				});
				const l = r.responderPublicKey;
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					peerPublicKey: l
				});
				const p = await this.client.core.crypto.generateSharedKey(a, l);
				this.pendingSessions.set(i, {
					sessionTopic: p,
					pairingTopic: t,
					proposalId: i,
					publicKey: a
				});
				const h = await this.client.core.relayer.subscribe(p, { transportType: s });
				this.client.logger.trace({
					type: "method",
					method: "onSessionProposeResponse",
					subscriptionId: h
				}), await this.client.core.pairing.activate({ topic: t });
			} else if (isJsonRpcError(e)) {
				await this.deleteProposal(i);
				const r = ci$1("session_connect", i);
				if (this.events.listenerCount(r) === 0) throw new Error(`emitting ${r} without any listeners, 954`);
				this.events.emit(r, { error: e.error });
			}
		}), c(this, "onSessionSettleRequest", async (t, e) => {
			const { id: s, params: i } = e;
			try {
				this.isValidSessionSettleRequest(i);
				const { relay: r, controller: n, expiry: a, namespaces: l, sessionProperties: p, scopedProperties: h, sessionConfig: u } = e.params, d = [...this.pendingSessions.values()].find((y) => y.sessionTopic === t);
				if (!d) return this.client.logger.error(`Pending session not found for topic ${t}`);
				const w = this.client.proposal.get(d.proposalId), m = x(I(I(I({
					topic: t,
					relay: r,
					expiry: a,
					namespaces: l,
					acknowledged: !0,
					pairingTopic: d.pairingTopic,
					requiredNamespaces: w.requiredNamespaces,
					optionalNamespaces: w.optionalNamespaces,
					controller: n.publicKey,
					self: {
						publicKey: d.publicKey,
						metadata: this.client.metadata
					},
					peer: {
						publicKey: n.publicKey,
						metadata: n.metadata
					}
				}, p && { sessionProperties: p }), h && { scopedProperties: h }), u && { sessionConfig: u }), { transportType: Q.relay });
				await this.client.session.set(m.topic, m), await this.setExpiry(m.topic, m.expiry), await this.client.core.pairing.updateMetadata({
					topic: d.pairingTopic,
					metadata: m.peer.metadata
				}), this.client.events.emit("session_connect", { session: m }), this.events.emit(ci$1("session_connect", d.proposalId), { session: m }), this.pendingSessions.delete(d.proposalId), this.deleteProposal(d.proposalId, !1), this.cleanupDuplicatePairings(m), await this.sendResult({
					id: e.id,
					topic: t,
					result: !0
				});
			} catch (r) {
				await this.sendError({
					id: s,
					topic: t,
					error: r
				}), this.client.logger.error(r);
			}
		}), c(this, "onSessionSettleResponse", async (t, e) => {
			const { id: s } = e;
			isJsonRpcResult(e) ? (await this.client.session.update(t, { acknowledged: !0 }), this.events.emit(ci$1("session_approve", s), {})) : isJsonRpcError(e) && (await this.client.session.delete(t, Kt$1("USER_DISCONNECTED")), this.events.emit(ci$1("session_approve", s), { error: e.error }));
		}), c(this, "onSessionUpdateRequest", async (t, e) => {
			const { params: s, id: i } = e;
			try {
				const r = `${t}_session_update`, n = Ha.get(r);
				if (n && this.isRequestOutOfSync(n, i)) {
					this.client.logger.warn(`Discarding out of sync request - ${i}`), this.sendError({
						id: i,
						topic: t,
						error: Kt$1("INVALID_UPDATE_REQUEST")
					});
					return;
				}
				this.isValidUpdate(I({ topic: t }, s));
				try {
					Ha.set(r, i), await this.client.session.update(t, { namespaces: s.namespaces }), await this.sendResult({
						id: i,
						topic: t,
						result: !0
					});
				} catch (a) {
					throw Ha.delete(r), a;
				}
				this.client.events.emit("session_update", {
					id: i,
					topic: t,
					params: s
				});
			} catch (r) {
				await this.sendError({
					id: i,
					topic: t,
					error: r
				}), this.client.logger.error(r);
			}
		}), c(this, "isRequestOutOfSync", (t, e) => e.toString().slice(0, -3) < t.toString().slice(0, -3)), c(this, "onSessionUpdateResponse", (t, e) => {
			const { id: s } = e, i = ci$1("session_update", s);
			if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
			isJsonRpcResult(e) ? this.events.emit(ci$1("session_update", s), {}) : isJsonRpcError(e) && this.events.emit(ci$1("session_update", s), { error: e.error });
		}), c(this, "onSessionExtendRequest", async (t, e) => {
			const { id: s } = e;
			try {
				this.isValidExtend({ topic: t }), await this.setExpiry(t, ii$1(X)), await this.sendResult({
					id: s,
					topic: t,
					result: !0
				}), this.client.events.emit("session_extend", {
					id: s,
					topic: t
				});
			} catch (i) {
				await this.sendError({
					id: s,
					topic: t,
					error: i
				}), this.client.logger.error(i);
			}
		}), c(this, "onSessionExtendResponse", (t, e) => {
			const { id: s } = e, i = ci$1("session_extend", s);
			if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
			isJsonRpcResult(e) ? this.events.emit(ci$1("session_extend", s), {}) : isJsonRpcError(e) && this.events.emit(ci$1("session_extend", s), { error: e.error });
		}), c(this, "onSessionPingRequest", async (t, e) => {
			const { id: s } = e;
			try {
				this.isValidPing({ topic: t }), await this.sendResult({
					id: s,
					topic: t,
					result: !0,
					throwOnFailedPublish: !0
				}), this.client.events.emit("session_ping", {
					id: s,
					topic: t
				});
			} catch (i) {
				await this.sendError({
					id: s,
					topic: t,
					error: i
				}), this.client.logger.error(i);
			}
		}), c(this, "onSessionPingResponse", (t, e) => {
			const { id: s } = e, i = ci$1("session_ping", s);
			setTimeout(() => {
				if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners 2176`);
				isJsonRpcResult(e) ? this.events.emit(ci$1("session_ping", s), {}) : isJsonRpcError(e) && this.events.emit(ci$1("session_ping", s), { error: e.error });
			}, 500);
		}), c(this, "onSessionDeleteRequest", async (t, e) => {
			const { id: s } = e;
			try {
				this.isValidDisconnect({
					topic: t,
					reason: e.params
				}), Promise.all([
					new Promise((i) => {
						this.client.core.relayer.once(C.publish, async () => {
							i(await this.deleteSession({
								topic: t,
								id: s
							}));
						});
					}),
					this.sendResult({
						id: s,
						topic: t,
						result: !0
					}),
					this.cleanupPendingSentRequestsForTopic({
						topic: t,
						error: Kt$1("USER_DISCONNECTED")
					})
				]).catch((i) => this.client.logger.error(i));
			} catch (i) {
				this.client.logger.error(i);
			}
		}), c(this, "onSessionRequest", async (t) => {
			var e, s, i;
			const { topic: r, payload: n, attestation: a, encryptedId: l, transportType: p } = t, { id: h, params: u } = n;
			try {
				await this.isValidRequest(I({ topic: r }, u));
				const d = this.client.session.get(r), m = {
					id: h,
					topic: r,
					params: u,
					verifyContext: await this.getVerifyContext({
						attestationId: a,
						hash: zc(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest", u, h))),
						encryptedId: l,
						metadata: d.peer.metadata,
						transportType: p
					})
				};
				await this.setPendingSessionRequest(m), p === Q.link_mode && (e = d.peer.metadata.redirect) != null && e.universal && this.client.core.addLinkModeSupportedApp((s = d.peer.metadata.redirect) == null ? void 0 : s.universal), (i = this.client.signConfig) != null && i.disableRequestQueue ? this.emitSessionRequest(m) : (this.addSessionRequestToSessionRequestQueue(m), this.processSessionRequestQueue());
			} catch (d) {
				await this.sendError({
					id: h,
					topic: r,
					error: d
				}), this.client.logger.error(d);
			}
		}), c(this, "onSessionRequestResponse", (t, e) => {
			const { id: s } = e, i = ci$1("session_request", s);
			if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
			isJsonRpcResult(e) ? this.events.emit(ci$1("session_request", s), { result: e.result }) : isJsonRpcError(e) && this.events.emit(ci$1("session_request", s), { error: e.error });
		}), c(this, "onSessionEventRequest", async (t, e) => {
			const { id: s, params: i } = e;
			try {
				const r = `${t}_session_event_${i.event.name}`, n = Ha.get(r);
				if (n && this.isRequestOutOfSync(n, s)) {
					this.client.logger.info(`Discarding out of sync request - ${s}`);
					return;
				}
				this.isValidEmit(I({ topic: t }, i)), this.client.events.emit("session_event", {
					id: s,
					topic: t,
					params: i
				}), Ha.set(r, s);
			} catch (r) {
				await this.sendError({
					id: s,
					topic: t,
					error: r
				}), this.client.logger.error(r);
			}
		}), c(this, "onSessionAuthenticateResponse", (t, e) => {
			const { id: s } = e;
			this.client.logger.trace({
				type: "method",
				method: "onSessionAuthenticateResponse",
				topic: t,
				payload: e
			}), isJsonRpcResult(e) ? this.events.emit(ci$1("session_request", s), { result: e.result }) : isJsonRpcError(e) && this.events.emit(ci$1("session_request", s), { error: e.error });
		}), c(this, "onSessionAuthenticateRequest", async (t) => {
			var e;
			const { topic: s, payload: i, attestation: r, encryptedId: n, transportType: a } = t;
			try {
				const { requester: l, authPayload: p, expiryTimestamp: h } = i.params, u = await this.getVerifyContext({
					attestationId: r,
					hash: zc(JSON.stringify(i)),
					encryptedId: n,
					metadata: l.metadata,
					transportType: a
				}), d = {
					requester: l,
					pairingTopic: s,
					id: i.id,
					authPayload: p,
					verifyContext: u,
					expiryTimestamp: h
				};
				await this.setAuthRequest(i.id, {
					request: d,
					pairingTopic: s,
					transportType: a
				}), a === Q.link_mode && (e = l.metadata.redirect) != null && e.universal && this.client.core.addLinkModeSupportedApp(l.metadata.redirect.universal), this.client.events.emit("session_authenticate", {
					topic: s,
					params: i.params,
					id: i.id,
					verifyContext: u
				});
			} catch (l) {
				this.client.logger.error(l);
				const p = i.params.requester.publicKey, h = await this.client.core.crypto.generateKeyPair(), u = this.getAppLinkIfEnabled(i.params.requester.metadata, a), d = {
					type: 1,
					receiverPublicKey: p,
					senderPublicKey: h
				};
				await this.sendError({
					id: i.id,
					topic: s,
					error: l,
					encodeOpts: d,
					rpcOpts: N.wc_sessionAuthenticate.autoReject,
					appLink: u
				});
			}
		}), c(this, "addSessionRequestToSessionRequestQueue", (t) => {
			this.sessionRequestQueue.queue.push(t);
		}), c(this, "cleanupAfterResponse", (t) => {
			this.deletePendingSessionRequest(t.response.id, {
				message: "fulfilled",
				code: 0
			}), setTimeout(() => {
				this.sessionRequestQueue.state = $.idle, this.processSessionRequestQueue();
			}, (0, import_cjs$3.toMiliseconds)(this.requestQueueDelay));
		}), c(this, "cleanupPendingSentRequestsForTopic", ({ topic: t, error: e }) => {
			const s = this.client.core.history.pending;
			s.length > 0 && s.filter((i) => i.topic === t && i.request.method === "wc_sessionRequest").forEach((i) => {
				const r = i.request.id, n = ci$1("session_request", r);
				if (this.events.listenerCount(n) === 0) throw new Error(`emitting ${n} without any listeners`);
				this.events.emit(ci$1("session_request", i.request.id), { error: e });
			});
		}), c(this, "processSessionRequestQueue", () => {
			if (this.sessionRequestQueue.state === $.active) {
				this.client.logger.info("session request queue is already active.");
				return;
			}
			const t = this.sessionRequestQueue.queue[0];
			if (!t) {
				this.client.logger.info("session request queue is empty.");
				return;
			}
			try {
				this.emitSessionRequest(t);
			} catch (e) {
				this.client.logger.error(e);
			}
		}), c(this, "emitSessionRequest", (t) => {
			if (this.emittedSessionRequests.has(t.id)) {
				this.client.logger.warn({ id: t.id }, `Skipping emitting \`session_request\` event for duplicate request. id: ${t.id}`);
				return;
			}
			this.sessionRequestQueue.state = $.active, this.emittedSessionRequests.add(t.id), this.client.events.emit("session_request", t);
		}), c(this, "onPairingCreated", (t) => {
			if (t.methods && this.expectedPairingMethodMap.set(t.topic, t.methods), t.active) return;
			const e = this.client.proposal.getAll().find((s) => s.pairingTopic === t.topic);
			e && this.onSessionProposeRequest({
				topic: t.topic,
				payload: formatJsonRpcRequest("wc_sessionPropose", x(I({}, e), {
					requiredNamespaces: e.requiredNamespaces,
					optionalNamespaces: e.optionalNamespaces,
					relays: e.relays,
					proposer: e.proposer,
					sessionProperties: e.sessionProperties,
					scopedProperties: e.scopedProperties
				}), e.id),
				attestation: e.attestation,
				encryptedId: e.encryptedId
			});
		}), c(this, "isValidConnect", async (t) => {
			if (!Aa(t)) {
				const { message: l } = Et$2("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(t)}`);
				throw new Error(l);
			}
			const { pairingTopic: e, requiredNamespaces: s, optionalNamespaces: i, sessionProperties: r, scopedProperties: n, relays: a } = t;
			if (kt$1(e) || await this.isValidPairingTopic(e), !Ba(a, !0)) {
				const { message: l } = Et$2("MISSING_OR_INVALID", `connect() relays: ${a}`);
				throw new Error(l);
			}
			if (!kt$1(s) && Ve$1(s) !== 0) {
				const l = "requiredNamespaces are deprecated and are automatically assigned to optionalNamespaces";
				[
					"fatal",
					"error",
					"silent"
				].includes(this.client.logger.level) ? console.warn(l) : this.client.logger.warn(l), this.validateNamespaces(s, "requiredNamespaces");
			}
			if (!kt$1(i) && Ve$1(i) !== 0 && this.validateNamespaces(i, "optionalNamespaces"), kt$1(r) || this.validateSessionProps(r, "sessionProperties"), !kt$1(n)) {
				this.validateSessionProps(n, "scopedProperties");
				const l = Object.keys(s || {}).concat(Object.keys(i || {}));
				if (!Object.keys(n).every((p) => l.includes(p.split(":")[0]))) throw new Error(`Scoped properties must be a subset of required/optional namespaces, received: ${JSON.stringify(n)}, required/optional namespaces: ${JSON.stringify(l)}`);
			}
		}), c(this, "validateNamespaces", (t, e) => {
			const s = Ea(t, "connect()", e);
			if (s) throw new Error(s.message);
		}), c(this, "isValidApprove", async (t) => {
			if (!Aa(t)) throw new Error(Et$2("MISSING_OR_INVALID", `approve() params: ${t}`).message);
			const { id: e, namespaces: s, relayProtocol: i, sessionProperties: r, scopedProperties: n } = t;
			this.checkRecentlyDeleted(e), await this.isValidProposalId(e);
			const a = this.client.proposal.get(e), l = is(s, "approve()");
			if (l) throw new Error(l.message);
			const p = cs(a.requiredNamespaces, s, "approve()");
			if (p) throw new Error(p.message);
			if (!it$1(i, !0)) {
				const { message: h } = Et$2("MISSING_OR_INVALID", `approve() relayProtocol: ${i}`);
				throw new Error(h);
			}
			if (kt$1(r) || this.validateSessionProps(r, "sessionProperties"), !kt$1(n)) {
				this.validateSessionProps(n, "scopedProperties");
				const h = new Set(Object.keys(s));
				if (!Object.keys(n).every((u) => h.has(u.split(":")[0]))) throw new Error(`Scoped properties must be a subset of approved namespaces, received: ${JSON.stringify(n)}, approved namespaces: ${Array.from(h).join(", ")}`);
			}
		}), c(this, "isValidReject", async (t) => {
			if (!Aa(t)) {
				const { message: i } = Et$2("MISSING_OR_INVALID", `reject() params: ${t}`);
				throw new Error(i);
			}
			const { id: e, reason: s } = t;
			if (this.checkRecentlyDeleted(e), await this.isValidProposalId(e), !Sa(s)) {
				const { message: i } = Et$2("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(s)}`);
				throw new Error(i);
			}
		}), c(this, "isValidSessionSettleRequest", (t) => {
			if (!Aa(t)) {
				const { message: l } = Et$2("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${t}`);
				throw new Error(l);
			}
			const { relay: e, controller: s, namespaces: i, expiry: r } = t;
			if (!fs$1(e)) {
				const { message: l } = Et$2("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
				throw new Error(l);
			}
			const n = va(s, "onSessionSettleRequest()");
			if (n) throw new Error(n.message);
			const a = is(i, "onSessionSettleRequest()");
			if (a) throw new Error(a.message);
			if (fi$1(r)) {
				const { message: l } = Et$2("EXPIRED", "onSessionSettleRequest()");
				throw new Error(l);
			}
		}), c(this, "isValidUpdate", async (t) => {
			if (!Aa(t)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", `update() params: ${t}`);
				throw new Error(a);
			}
			const { topic: e, namespaces: s } = t;
			this.checkRecentlyDeleted(e), await this.isValidSessionTopic(e);
			const i = this.client.session.get(e), r = is(s, "update()");
			if (r) throw new Error(r.message);
			const n = cs(i.requiredNamespaces, s, "update()");
			if (n) throw new Error(n.message);
		}), c(this, "isValidExtend", async (t) => {
			if (!Aa(t)) {
				const { message: s } = Et$2("MISSING_OR_INVALID", `extend() params: ${t}`);
				throw new Error(s);
			}
			const { topic: e } = t;
			this.checkRecentlyDeleted(e), await this.isValidSessionTopic(e);
		}), c(this, "isValidRequest", async (t) => {
			if (!Aa(t)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", `request() params: ${t}`);
				throw new Error(a);
			}
			const { topic: e, request: s, chainId: i, expiry: r } = t;
			this.checkRecentlyDeleted(e), await this.isValidSessionTopic(e);
			const { namespaces: n } = this.client.session.get(e);
			if (!_a(n, i)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", `request() chainId: ${i}`);
				throw new Error(a);
			}
			if (!Na(s)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", `request() ${JSON.stringify(s)}`);
				throw new Error(a);
			}
			if (!Ta(n, i, s.method)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", `request() method: ${s.method}`);
				throw new Error(a);
			}
			if (r && !La(r, _e)) {
				const { message: a } = Et$2("MISSING_OR_INVALID", `request() expiry: ${r}. Expiry must be a number (in seconds) between ${_e.min} and ${_e.max}`);
				throw new Error(a);
			}
		}), c(this, "isValidRespond", async (t) => {
			var e;
			if (!Aa(t)) {
				const { message: r } = Et$2("MISSING_OR_INVALID", `respond() params: ${t}`);
				throw new Error(r);
			}
			const { topic: s, response: i } = t;
			try {
				await this.isValidSessionTopic(s);
			} catch (r) {
				throw (e = t?.response) != null && e.id && this.cleanupAfterResponse(t), r;
			}
			if (!Oa(i)) {
				const { message: r } = Et$2("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(i)}`);
				throw new Error(r);
			}
		}), c(this, "isValidPing", async (t) => {
			if (!Aa(t)) {
				const { message: s } = Et$2("MISSING_OR_INVALID", `ping() params: ${t}`);
				throw new Error(s);
			}
			const { topic: e } = t;
			await this.isValidSessionOrPairingTopic(e);
		}), c(this, "isValidEmit", async (t) => {
			if (!Aa(t)) {
				const { message: n } = Et$2("MISSING_OR_INVALID", `emit() params: ${t}`);
				throw new Error(n);
			}
			const { topic: e, event: s, chainId: i } = t;
			await this.isValidSessionTopic(e);
			const { namespaces: r } = this.client.session.get(e);
			if (!_a(r, i)) {
				const { message: n } = Et$2("MISSING_OR_INVALID", `emit() chainId: ${i}`);
				throw new Error(n);
			}
			if (!Ua(s)) {
				const { message: n } = Et$2("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s)}`);
				throw new Error(n);
			}
			if (!Ra(r, i, s.name)) {
				const { message: n } = Et$2("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s)}`);
				throw new Error(n);
			}
		}), c(this, "isValidDisconnect", async (t) => {
			if (!Aa(t)) {
				const { message: s } = Et$2("MISSING_OR_INVALID", `disconnect() params: ${t}`);
				throw new Error(s);
			}
			const { topic: e } = t;
			await this.isValidSessionOrPairingTopic(e);
		}), c(this, "isValidAuthenticate", (t) => {
			const { chains: e, uri: s, domain: i, nonce: r } = t;
			if (!Array.isArray(e) || e.length === 0) throw new Error("chains is required and must be a non-empty array");
			if (!it$1(s, !1)) throw new Error("uri is required parameter");
			if (!it$1(i, !1)) throw new Error("domain is required parameter");
			if (!it$1(r, !1)) throw new Error("nonce is required parameter");
			if ([...new Set(e.map((a) => Fe$1(a).namespace))].length > 1) throw new Error("Multi-namespace requests are not supported. Please request single namespace only.");
			const { namespace: n } = Fe$1(e[0]);
			if (n !== "eip155") throw new Error("Only eip155 namespace is supported for authenticated sessions. Please use .connect() for non-eip155 chains.");
		}), c(this, "getVerifyContext", async (t) => {
			const { attestationId: e, hash: s, encryptedId: i, metadata: r, transportType: n } = t, a = { verified: {
				verifyUrl: r.verifyUrl || "https://verify.walletconnect.org",
				validation: "UNKNOWN",
				origin: r.url || ""
			} };
			try {
				if (n === Q.link_mode) {
					const p = this.getAppLinkIfEnabled(r, n);
					return a.verified.validation = p && new URL(p).origin === new URL(r.url).origin ? "VALID" : "INVALID", a;
				}
				const l = await this.client.core.verify.resolve({
					attestationId: e,
					hash: s,
					encryptedId: i,
					verifyUrl: r.verifyUrl
				});
				l && (a.verified.origin = l.origin, a.verified.isScam = l.isScam, a.verified.validation = l.origin === new URL(r.url).origin ? "VALID" : "INVALID");
			} catch (l) {
				this.client.logger.warn(l);
			}
			return this.client.logger.debug(`Verify context: ${JSON.stringify(a)}`), a;
		}), c(this, "validateSessionProps", (t, e) => {
			Object.values(t).forEach((s, i) => {
				if (s == null) {
					const { message: r } = Et$2("MISSING_OR_INVALID", `${e} must contain an existing value for each key. Received: ${s} for key ${Object.keys(t)[i]}`);
					throw new Error(r);
				}
			});
		}), c(this, "getPendingAuthRequest", (t) => {
			const e = this.client.auth.requests.get(t);
			return typeof e == "object" ? e : void 0;
		}), c(this, "addToRecentlyDeleted", (t, e) => {
			if (this.recentlyDeletedMap.set(t, e), this.recentlyDeletedMap.size >= this.recentlyDeletedLimit) {
				let s = 0;
				const i = this.recentlyDeletedLimit / 2;
				for (const r of this.recentlyDeletedMap.keys()) {
					if (s++ >= i) break;
					this.recentlyDeletedMap.delete(r);
				}
			}
		}), c(this, "checkRecentlyDeleted", (t) => {
			const e = this.recentlyDeletedMap.get(t);
			if (e) {
				const { message: s } = Et$2("MISSING_OR_INVALID", `Record was recently deleted - ${e}: ${t}`);
				throw new Error(s);
			}
		}), c(this, "isLinkModeEnabled", (t, e) => {
			var s, i, r, n, a, l, p, h, u;
			return !t || e !== Q.link_mode ? !1 : ((i = (s = this.client.metadata) == null ? void 0 : s.redirect) == null ? void 0 : i.linkMode) === !0 && ((n = (r = this.client.metadata) == null ? void 0 : r.redirect) == null ? void 0 : n.universal) !== void 0 && ((l = (a = this.client.metadata) == null ? void 0 : a.redirect) == null ? void 0 : l.universal) !== "" && ((p = t?.redirect) == null ? void 0 : p.universal) !== void 0 && ((h = t?.redirect) == null ? void 0 : h.universal) !== "" && ((u = t?.redirect) == null ? void 0 : u.linkMode) === !0 && this.client.core.linkModeSupportedApps.includes(t.redirect.universal) && typeof (global == null ? void 0 : global.Linking) < "u";
		}), c(this, "getAppLinkIfEnabled", (t, e) => {
			var s;
			return this.isLinkModeEnabled(t, e) ? (s = t?.redirect) == null ? void 0 : s.universal : void 0;
		}), c(this, "handleLinkModeMessage", ({ url: t }) => {
			if (!t || !t.includes("wc_ev") || !t.includes("topic")) return;
			const e = li$1(t, "topic") || "", s = decodeURIComponent(li$1(t, "wc_ev") || ""), i = this.client.session.keys.includes(e);
			i && this.client.session.update(e, { transportType: Q.link_mode }), this.client.core.dispatchEnvelope({
				topic: e,
				message: s,
				sessionExists: i
			});
		}), c(this, "registerLinkModeListeners", async () => {
			var t;
			if (hi$1() || Bt$1() && (t = this.client.metadata.redirect) != null && t.linkMode) {
				const e = global == null ? void 0 : global.Linking;
				if (typeof e < "u") {
					e.addEventListener("url", this.handleLinkModeMessage, this.client.name);
					const s = await e.getInitialURL();
					s && setTimeout(() => {
						this.handleLinkModeMessage({ url: s });
					}, 50);
				}
			}
		}), c(this, "getTVFParams", (t, e, s) => {
			var i, r, n;
			if (!((i = e.request) != null && i.method)) return {};
			const a = {
				correlationId: t,
				rpcMethods: [e.request.method],
				chainId: e.chainId
			};
			try {
				a.txHashes = this.extractTxHashesFromResult(e.request, s), a.contractAddresses = this.isValidContractData(e.request.params) ? [(n = (r = e.request.params) == null ? void 0 : r[0]) == null ? void 0 : n.to] : [];
			} catch (l) {
				this.client.logger.warn("Error getting TVF params", l);
			}
			return a;
		}), c(this, "isValidContractData", (t) => {
			var e;
			if (!t) return !1;
			try {
				const s = t?.data || ((e = t?.[0]) == null ? void 0 : e.data);
				if (!s.startsWith("0x")) return !1;
				const i = s.slice(2);
				return /^[0-9a-fA-F]*$/.test(i) ? i.length % 2 === 0 : !1;
			} catch {}
			return !1;
		}), c(this, "extractTxHashesFromResult", (t, e) => {
			var s;
			try {
				if (!e) return [];
				const i = t.method, r = gt[i];
				if (i === "sui_signTransaction") return [ff(e.transactionBytes)];
				if (i === "near_signTransaction") return [cf(e)];
				if (i === "near_signTransactions") return e.map((a) => cf(a));
				if (i === "xrpl_signTransactionFor" || i === "xrpl_signTransaction") return [(s = e.tx_json) == null ? void 0 : s.hash];
				if (i === "polkadot_signTransaction") return [Ka({
					transaction: t.params.transactionPayload,
					signature: e.signature
				})];
				if (i === "algo_signTxn") return me$1(e) ? e.map((a) => af(a)) : [af(e)];
				if (i === "cosmos_signDirect") return [uf(e)];
				if (typeof e == "string") return [e];
				const n = e[r.key];
				if (me$1(n)) return i === "solana_signAllTransactions" ? n.map((a) => sf(a)) : n;
				if (typeof n == "string") return [n];
			} catch (i) {
				this.client.logger.warn("Error extracting tx hashes from result", i);
			}
			return [];
		});
	}
	async processPendingMessageEvents() {
		try {
			const o = this.client.session.keys, t = this.client.core.relayer.messages.getWithoutAck(o);
			for (const [e, s] of Object.entries(t)) for (const i of s) try {
				await this.onProviderMessageEvent({
					topic: e,
					message: i,
					publishedAt: Date.now()
				});
			} catch {
				this.client.logger.warn(`Error processing pending message event for topic: ${e}, message: ${i}`);
			}
		} catch (o) {
			this.client.logger.warn("processPendingMessageEvents failed", o);
		}
	}
	isInitialized() {
		if (!this.initialized) {
			const { message: o } = Et$2("NOT_INITIALIZED", this.name);
			throw new Error(o);
		}
	}
	async confirmOnlineStateOrThrow() {
		await this.client.core.relayer.confirmOnlineStateOrThrow();
	}
	registerRelayerEvents() {
		this.client.core.relayer.on(C.message, (o) => {
			this.onProviderMessageEvent(o);
		});
	}
	async onRelayMessage(o) {
		const { topic: t, message: e, attestation: s, transportType: i } = o, { publicKey: r } = this.client.auth.authKeys.keys.includes(ce) ? this.client.auth.authKeys.get(ce) : {
			responseTopic: void 0,
			publicKey: void 0
		};
		try {
			const n = await this.client.core.crypto.decode(t, e, {
				receiverPublicKey: r,
				encoding: i === Q.link_mode ? De$1 : Qt$1
			});
			isJsonRpcRequest(n) ? (this.client.core.history.set(t, n), await this.onRelayEventRequest({
				topic: t,
				payload: n,
				attestation: s,
				transportType: i,
				encryptedId: zc(e)
			})) : isJsonRpcResponse(n) ? (await this.client.core.history.resolve(n), await this.onRelayEventResponse({
				topic: t,
				payload: n,
				transportType: i
			}), this.client.core.history.delete(t, n.id)) : await this.onRelayEventUnknownPayload({
				topic: t,
				payload: n,
				transportType: i
			}), await this.client.core.relayer.messages.ack(t, e);
		} catch (n) {
			this.client.logger.error(n);
		}
	}
	registerExpirerEvents() {
		this.client.core.expirer.on(M.expired, async (o) => {
			const { topic: t, id: e } = si$1(o.target);
			if (e && this.client.pendingRequest.keys.includes(e)) return await this.deletePendingSessionRequest(e, Et$2("EXPIRED"), !0);
			if (e && this.client.auth.requests.keys.includes(e)) return await this.deletePendingAuthRequest(e, Et$2("EXPIRED"), !0);
			t ? this.client.session.keys.includes(t) && (await this.deleteSession({
				topic: t,
				expirerHasDeleted: !0
			}), this.client.events.emit("session_expire", { topic: t })) : e && (await this.deleteProposal(e, !0), this.client.events.emit("proposal_expire", { id: e }));
		});
	}
	registerPairingEvents() {
		this.client.core.pairing.events.on(re.create, (o) => this.onPairingCreated(o)), this.client.core.pairing.events.on(re.delete, (o) => {
			this.addToRecentlyDeleted(o.topic, "pairing");
		});
	}
	isValidPairingTopic(o) {
		if (!it$1(o, !1)) {
			const { message: t } = Et$2("MISSING_OR_INVALID", `pairing topic should be a string: ${o}`);
			throw new Error(t);
		}
		if (!this.client.core.pairing.pairings.keys.includes(o)) {
			const { message: t } = Et$2("NO_MATCHING_KEY", `pairing topic doesn't exist: ${o}`);
			throw new Error(t);
		}
		if (fi$1(this.client.core.pairing.pairings.get(o).expiry)) {
			const { message: t } = Et$2("EXPIRED", `pairing topic: ${o}`);
			throw new Error(t);
		}
	}
	async isValidSessionTopic(o) {
		if (!it$1(o, !1)) {
			const { message: t } = Et$2("MISSING_OR_INVALID", `session topic should be a string: ${o}`);
			throw new Error(t);
		}
		if (this.checkRecentlyDeleted(o), !this.client.session.keys.includes(o)) {
			const { message: t } = Et$2("NO_MATCHING_KEY", `session topic doesn't exist: ${o}`);
			throw new Error(t);
		}
		if (fi$1(this.client.session.get(o).expiry)) {
			await this.deleteSession({ topic: o });
			const { message: t } = Et$2("EXPIRED", `session topic: ${o}`);
			throw new Error(t);
		}
		if (!this.client.core.crypto.keychain.has(o)) {
			const { message: t } = Et$2("MISSING_OR_INVALID", `session topic does not exist in keychain: ${o}`);
			throw await this.deleteSession({ topic: o }), new Error(t);
		}
	}
	async isValidSessionOrPairingTopic(o) {
		if (this.checkRecentlyDeleted(o), this.client.session.keys.includes(o)) await this.isValidSessionTopic(o);
		else if (this.client.core.pairing.pairings.keys.includes(o)) this.isValidPairingTopic(o);
		else if (it$1(o, !1)) {
			const { message: t } = Et$2("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${o}`);
			throw new Error(t);
		} else {
			const { message: t } = Et$2("MISSING_OR_INVALID", `session or pairing topic should be a string: ${o}`);
			throw new Error(t);
		}
	}
	async isValidProposalId(o) {
		if (!Ia(o)) {
			const { message: t } = Et$2("MISSING_OR_INVALID", `proposal id should be a number: ${o}`);
			throw new Error(t);
		}
		if (!this.client.proposal.keys.includes(o)) {
			const { message: t } = Et$2("NO_MATCHING_KEY", `proposal id doesn't exist: ${o}`);
			throw new Error(t);
		}
		if (fi$1(this.client.proposal.get(o).expiryTimestamp)) {
			await this.deleteProposal(o);
			const { message: t } = Et$2("EXPIRED", `proposal id: ${o}`);
			throw new Error(t);
		}
	}
};
var ks = class extends Li {
	constructor(o, t) {
		super(o, t, ht, me), this.core = o, this.logger = t;
	}
};
var vt = class extends Li {
	constructor(o, t) {
		super(o, t, dt, me), this.core = o, this.logger = t;
	}
};
var Ds = class extends Li {
	constructor(o, t) {
		super(o, t, yt, me, (e) => e.id), this.core = o, this.logger = t;
	}
};
var Ls = class extends Li {
	constructor(o, t) {
		super(o, t, Et, ae, () => ce), this.core = o, this.logger = t;
	}
};
var Ms = class extends Li {
	constructor(o, t) {
		super(o, t, ft, ae), this.core = o, this.logger = t;
	}
};
var $s = class extends Li {
	constructor(o, t) {
		super(o, t, St, ae, (e) => e.id), this.core = o, this.logger = t;
	}
};
var Ks = Object.defineProperty, Us = (S, o, t) => o in S ? Ks(S, o, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : S[o] = t, Ke = (S, o, t) => Us(S, typeof o != "symbol" ? o + "" : o, t);
var Gs = class {
	constructor(o, t) {
		this.core = o, this.logger = t, Ke(this, "authKeys"), Ke(this, "pairingTopics"), Ke(this, "requests"), this.authKeys = new Ls(this.core, this.logger), this.pairingTopics = new Ms(this.core, this.logger), this.requests = new $s(this.core, this.logger);
	}
	async init() {
		await this.authKeys.init(), await this.pairingTopics.init(), await this.requests.init();
	}
};
var js = Object.defineProperty, Fs = (S, o, t) => o in S ? js(S, o, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: t
}) : S[o] = t, f = (S, o, t) => Fs(S, typeof o != "symbol" ? o + "" : o, t);
var Ee = class Ee extends J {
	constructor(o) {
		super(o), f(this, "protocol", "wc"), f(this, "version", 2), f(this, "name", we.name), f(this, "metadata"), f(this, "core"), f(this, "logger"), f(this, "events", new EventEmitter()), f(this, "engine"), f(this, "session"), f(this, "proposal"), f(this, "pendingRequest"), f(this, "auth"), f(this, "signConfig"), f(this, "on", (e, s) => this.events.on(e, s)), f(this, "once", (e, s) => this.events.once(e, s)), f(this, "off", (e, s) => this.events.off(e, s)), f(this, "removeListener", (e, s) => this.events.removeListener(e, s)), f(this, "removeAllListeners", (e) => this.events.removeAllListeners(e)), f(this, "connect", async (e) => {
			try {
				return await this.engine.connect(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "pair", async (e) => {
			try {
				return await this.engine.pair(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "approve", async (e) => {
			try {
				return await this.engine.approve(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "reject", async (e) => {
			try {
				return await this.engine.reject(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "update", async (e) => {
			try {
				return await this.engine.update(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "extend", async (e) => {
			try {
				return await this.engine.extend(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "request", async (e) => {
			try {
				return await this.engine.request(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "respond", async (e) => {
			try {
				return await this.engine.respond(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "ping", async (e) => {
			try {
				return await this.engine.ping(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "emit", async (e) => {
			try {
				return await this.engine.emit(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "disconnect", async (e) => {
			try {
				return await this.engine.disconnect(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "find", (e) => {
			try {
				return this.engine.find(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "getPendingSessionRequests", () => {
			try {
				return this.engine.getPendingSessionRequests();
			} catch (e) {
				throw this.logger.error(e.message), e;
			}
		}), f(this, "authenticate", async (e, s) => {
			try {
				return await this.engine.authenticate(e, s);
			} catch (i) {
				throw this.logger.error(i.message), i;
			}
		}), f(this, "formatAuthMessage", (e) => {
			try {
				return this.engine.formatAuthMessage(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "approveSessionAuthenticate", async (e) => {
			try {
				return await this.engine.approveSessionAuthenticate(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), f(this, "rejectSessionAuthenticate", async (e) => {
			try {
				return await this.engine.rejectSessionAuthenticate(e);
			} catch (s) {
				throw this.logger.error(s.message), s;
			}
		}), this.name = o?.name || we.name, this.metadata = Ks$1(o?.metadata), this.signConfig = o?.signConfig;
		const t = typeof o?.logger < "u" && typeof o?.logger != "string" ? o.logger : (0, import_pino.default)(k$2({ level: o?.logger || we.logger }));
		this.core = o?.core || new Zo(o), this.logger = E$1(t, this.name), this.session = new vt(this.core, this.logger), this.proposal = new ks(this.core, this.logger), this.pendingRequest = new Ds(this.core, this.logger), this.engine = new Cs(this), this.auth = new Gs(this.core, this.logger);
	}
	static async init(o) {
		const t = new Ee(o);
		return await t.initialize(), t;
	}
	get context() {
		return y$2(this.logger);
	}
	get pairing() {
		return this.core.pairing.pairings;
	}
	async initialize() {
		this.logger.trace("Initialized");
		try {
			await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.auth.init(), await this.engine.init(), this.logger.info("SignClient Initialization Success");
		} catch (o) {
			throw this.logger.info("SignClient Initialization Failure"), this.logger.error(o.message), o;
		}
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connect@4.89.0_bufferutil@4.1.0_db0@0.3.4_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/@dynamic-labs/wallet-connect/src/utils/logger.js
var logger$1 = new Logger("wallet-connect");
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connect@4.89.0_bufferutil@4.1.0_db0@0.3.4_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/@dynamic-labs/wallet-connect/src/getSignClientSingleton/reconcileOrphanedPairings.js
var reconcileOrphanedPairings = (signClient) => __awaiter$2(void 0, void 0, void 0, function* () {
	let pairings;
	try {
		pairings = signClient.core.pairing.getPairings();
	} catch (error) {
		logger$1.warn("[reconcileOrphanedPairings] failed to read pairings", { errorMessage: error instanceof Error ? error.message : String(error) });
		return;
	}
	if (pairings.length === 0) return;
	yield Promise.all(pairings.map((pairing) => __awaiter$2(void 0, void 0, void 0, function* () {
		if (signClient.session.getAll().some((session) => session.pairingTopic === pairing.topic)) return;
		try {
			yield signClient.core.pairing.disconnect({ topic: pairing.topic });
		} catch (error) {
			logger$1.warn("[reconcileOrphanedPairings] failed to disconnect pairing", {
				errorMessage: error instanceof Error ? error.message : String(error),
				topic: pairing.topic
			});
		}
	})));
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connect@4.89.0_bufferutil@4.1.0_db0@0.3.4_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/@dynamic-labs/wallet-connect/src/getSignClientSingleton/getSignClientSingleton.js
/**
* WalletConnect's SignClient would already internally share its core if we had
* multiple instances of it, so instead we will just use a singleton already.
*
* A SignClient is able to handle multiple sessions and multi chain connections.
*/
var signClientSingleton = void 0;
var getSignClientSingleton = (_a) => __awaiter$2(void 0, [_a], void 0, function* ({ projectId, appIcon, appName, redirectUrl }) {
	if (!signClientSingleton) {
		const redirect = redirectUrl ? { native: redirectUrl } : void 0;
		signClientSingleton = yield Ee.init({
			customStoragePrefix: `dynamicauth_${projectId}_walletconnect`,
			metadata: {
				description: "",
				icons: [appIcon],
				name: appName,
				redirect,
				url: ""
			},
			projectId
		});
		reconcileOrphanedPairings(signClientSingleton);
	}
	return signClientSingleton;
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/walletConnect/parsePairingTopicFromUri/parsePairingTopicFromUri.js
var parsePairingTopicFromUri = (uri) => {
	if (!uri) return;
	const match = /^wc:([^@?]+)@/.exec(uri);
	return match === null || match === void 0 ? void 0 : match[1];
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/walletConnect/SolanaWalletConnectConnector/createSolanaSignerForWalletConnect/createSolanaSignerForWalletConnect.js
var createSolanaSignerForWalletConnect = ({ walletConnector }) => {
	const connect = () => __awaiter$3(void 0, void 0, void 0, function* () {
		const address = walletConnector.getActiveAddress();
		if (!address) return;
		return {
			address,
			publicKey: new PublicKey(address)
		};
	});
	const disconnect = () => __awaiter$3(void 0, void 0, void 0, function* () {
		yield walletConnector.endSession();
	});
	const on = (event, listener) => {
		if (event === "connect") {
			logger$2.debug("on - Not implemented for event: connect");
			return signer;
		}
		if (event === "activeWalletDidChange") {
			walletConnector.listenToActiveAccountChange(listener);
			return signer;
		}
		walletConnector.signClient.on("session_event", (sessionEvent) => {
			if (!walletConnector.session || sessionEvent.topic !== walletConnector.session.topic) return;
			if (sessionEvent.params.event.name === "accountsChanged" && event === "accountChanged") {
				const accountsParam = sessionEvent.params.event.data;
				listener(filterDuplicates(accountsParam.map((account) => {
					if (account.startsWith("solana:")) return account.split(":")[2];
					return account;
				}))[0]);
				return;
			}
			if (sessionEvent.params.event.name === "disconnected" && event === "disconnect") {
				listener("");
				return;
			}
		});
		return signer;
	};
	const signMessage = (messageArrayBuffer) => __awaiter$3(void 0, void 0, void 0, function* () {
		return { signature: yield walletConnector.signEncodedMessage(messageArrayBuffer) };
	});
	const signAllTransactions = (transactions) => __awaiter$3(void 0, void 0, void 0, function* () {
		return walletConnector.signAllTransactions(transactions);
	});
	const signAndSendTransaction = (transaction, options) => __awaiter$3(void 0, void 0, void 0, function* () {
		return { signature: yield walletConnector.signAndSendTransaction(transaction, options) };
	});
	const signTransaction = (transaction) => __awaiter$3(void 0, void 0, void 0, function* () {
		return walletConnector.signTransaction(transaction);
	});
	const signer = {
		addListener: () => {
			throw new Error("addListener - Not implemented");
		},
		connect,
		disconnect,
		emit: () => {
			throw new Error("emit - Not implemented");
		},
		eventNames: () => {
			logger$2.error("eventNames - Not implemented");
			return [];
		},
		isBackpack: false,
		isBraveWallet: false,
		get isConnected() {
			return Boolean(walletConnector.getActiveAddress());
		},
		isExodus: false,
		isGlow: false,
		isMagicEden: false,
		isPhantom: false,
		isSolflare: false,
		listenerCount: () => {
			logger$2.error("listenerCount - Not implemented");
			return 0;
		},
		listeners: () => {
			logger$2.error("listeners - Not implemented");
			return [];
		},
		off: () => {
			throw new Error("off - Not implemented");
		},
		on,
		once: () => {
			throw new Error("once - Not implemented");
		},
		providers: [],
		get publicKey() {
			const address = walletConnector.getActiveAddress();
			return address ? new PublicKey(address) : void 0;
		},
		removeAllListeners: () => {
			throw new Error("removeAllListeners - Not implemented");
		},
		removeListener: () => {
			throw new Error("removeListener - Not implemented");
		},
		signAllTransactions,
		signAndSendTransaction,
		signMessage,
		signTransaction
	};
	return signer;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/walletConnect/SolanaWalletConnectConnector/SolanaWalletConnectConnector.js
var WC_SOLANA_CURRENT_CHAIN_KEY = "dynamic-wc2-solana-current-chain";
var SolanaWalletConnectConnector = class SolanaWalletConnectConnector extends SolanaWalletConnector {
	constructor(opts) {
		super(opts);
		this.activeAccountEmitter = new eventemitter3_default();
		this.isInitialized = false;
		this.canConnectViaQrCode = true;
		this.isWalletConnect = true;
		this.canHandleMultipleConnections = false;
		/**
		* Set to false to prevent merging wallet book chains with connector-specific chains.
		*
		* Solana WalletConnect connectors (e.g., Trust Wallet Solana connector) have a walletKey
		* like 'trust' that matches the wallet book entry for the Trust Wallet brand. The wallet
		* book entry indicates Trust supports both EVM and SOL chains globally. However, THIS
		* specific connector instance only supports SOL.
		*
		* If we merge wallet book chains, a Solana-only connector would incorrectly include ETH/EVM
		* in its supported chains, causing it to pass the filter when only ETH is enabled (even
		* though Solana is disabled). By setting this to false, we ensure that only the connector's
		* specific supported chains (['SOL']) are used for filtering, so Solana connectors are
		* correctly filtered out when Solana is disabled.
		*/
		this.mergeWalletBookChains = false;
		this.name = opts.walletName;
		const storedChainId = StorageService.getItem(WC_SOLANA_CURRENT_CHAIN_KEY);
		if (storedChainId) this.setNetworkId(storedChainId);
		if (opts.overrideKey) this.overrideKey = opts.overrideKey;
		if (!opts.projectId) throw new DynamicError("WalletConnect project ID is required");
	}
	get deepLinkPreference() {
		var _a;
		return (_a = this.constructorProps.deepLinkPreference) !== null && _a !== void 0 ? _a : "native";
	}
	/**
	* Accesses the sign client singleton instance, and throws if it is not
	* immediately available.
	*/
	get signClient() {
		if (!SolanaWalletConnectConnector.signClientReference) throw new DynamicError("Failed to access sign client for Wallet Connect Solana: Sign client not initialized");
		return SolanaWalletConnectConnector.signClientReference;
	}
	getAvailableMethods() {
		var _a, _b;
		if (!this.session) return [];
		return (_b = (_a = this.session.namespaces.solana) === null || _a === void 0 ? void 0 : _a.methods) !== null && _b !== void 0 ? _b : [];
	}
	getSupportedNetworks() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a, _b;
			if (!this.session) return this.solNetworks.map((network) => network.chainId.toString());
			const sessionChains = (_b = (_a = this.session.namespaces.solana) === null || _a === void 0 ? void 0 : _a.chains) !== null && _b !== void 0 ? _b : [];
			return this.solNetworks.filter((network) => sessionChains.includes(`solana:${network.genesisHash}`)).map((network) => network.chainId.toString());
		});
	}
	getActiveAddress() {
		var _a, _b;
		if (!this.session) {
			logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] getActiveAddress - no session, returning undefined");
			return;
		}
		logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] getActiveAddress - session", this.session);
		return (_b = (_a = this.session.namespaces.solana) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b[0].split(":")[2];
	}
	listenToActiveAccountChange(listener) {
		this.activeAccountEmitter.on("activeAccountDidChange", listener);
		return () => {
			this.activeAccountEmitter.off("activeAccountDidChange", listener);
		};
	}
	isSendBalanceUnsupported() {
		if (!this.session) return false;
		const supportedMethods = this.getAvailableMethods();
		return !supportedMethods.includes("solana_signAndSendTransaction") && !supportedMethods.includes("solana_signTransaction");
	}
	createUiTransaction(from) {
		return __awaiter$3(this, void 0, void 0, function* () {
			yield this.validateActiveWallet(from);
			if (this.isSendBalanceUnsupported()) throw new DynamicError("Wallet does not support signing transactions. Please connect to a wallet that supports signing transactions.");
			return new SolanaUiTransaction({
				connection: this.getWalletClient(),
				from,
				onSubmit: (transaction) => __awaiter$3(this, void 0, void 0, function* () {
					var _a;
					if (!transaction) return;
					const blockhash = yield this.getWalletClient().getLatestBlockhash();
					if ("version" in transaction) transaction.message.recentBlockhash = blockhash.blockhash;
					else {
						transaction.recentBlockhash = blockhash.blockhash;
						transaction.feePayer = (_a = transaction.feePayer) !== null && _a !== void 0 ? _a : new PublicKey(from);
					}
					return yield this.signAndSendTransaction(transaction);
				})
			});
		});
	}
	getSigner() {
		return __awaiter$3(this, void 0, void 0, function* () {
			return createSolanaSignerForWalletConnect({ walletConnector: this });
		});
	}
	connect() {
		return __awaiter$3(this, void 0, void 0, function* () {
			throw new Error("Connect method not implemented.");
		});
	}
	static globalInit(args) {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a, _b;
			SolanaWalletConnectConnector.signClientPromise = getSignClientSingleton({
				appIcon: (_a = args.appLogoUrl) !== null && _a !== void 0 ? _a : "",
				appName: (_b = args.appName) !== null && _b !== void 0 ? _b : "",
				projectId: args.projectId,
				redirectUrl: args.redirectUrl
			});
			SolanaWalletConnectConnector.signClientReference = yield SolanaWalletConnectConnector.signClientPromise;
			SolanaWalletConnectConnector.signClientReference.on("session_event", (event) => {
				SolanaWalletConnectConnector.sessionEventListeners.forEach((listener) => {
					listener(event);
				});
			});
		});
	}
	static testOnly__reset() {
		SolanaWalletConnectConnector.signClientPromise = void 0;
		SolanaWalletConnectConnector.signClientReference = void 0;
		SolanaWalletConnectConnector.sessionEventListeners = [];
	}
	init() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a, _b, _c, _d;
			if (this.isInitialized) return;
			logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] init called");
			this.isInitialized = true;
			if (!((_d = (_c = (_b = (_a = this.constructorProps.settings) === null || _a === void 0 ? void 0 : _a.sdk) === null || _b === void 0 ? void 0 : _b.walletConnect) === null || _c === void 0 ? void 0 : _c.v2Enabled) !== null && _d !== void 0 ? _d : false)) {
				logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] skipping init - WalletConnect is not enabled in project settings");
				return;
			}
			if (SolanaWalletConnectConnector.signClientPromise) {
				yield SolanaWalletConnectConnector.signClientPromise;
				this.setupWCEventListeners();
				return;
			}
			yield SolanaWalletConnectConnector.globalInit(this.constructorProps);
			this.setupWCEventListeners();
		});
	}
	handleSessionEvent({ params: { event }, topic }) {
		var _a, _b;
		if (!this.session || topic !== this.session.topic) return;
		if (event.name === "chainChanged") {
			const chainParam = event.data;
			let chainId = chainParam;
			if (typeof chainParam === "string" && chainParam.startsWith("solana:")) {
				const chainHash = chainParam.split(":")[1];
				chainId = (_b = (_a = this.solNetworks.find((network) => network.genesisHash === chainHash)) === null || _a === void 0 ? void 0 : _a.networkId.toString()) !== null && _b !== void 0 ? _b : chainParam;
			}
			logger$2.debug("[SolanaWalletConnect] onChainChange", { chainId });
			if (chainId === this.getNetworkId()) {
				logger$2.debug(`[SolanaWalletConnect] onChainChange - ignoring chainChanged event with same chain id as current chain id: ${chainId}`);
				return;
			}
			this.switchNetwork({ networkChainId: parseInt(String(chainId)) });
			return;
		}
		if (event.name === "accountsChanged") {
			const accountsParam = event.data;
			const accounts = filterDuplicates(accountsParam.map((account) => {
				if (account.startsWith("solana:")) return account.split(":")[2];
				return account;
			}));
			logger$2.debug("[SolanaWalletConnect] onAccountChanged", { accounts });
			this.emit("accountChange", { accounts });
			return;
		}
		if (event.name === "disconnected") {
			logger$2.debug("[SolanaWalletConnect] onDisconnect");
			this.emit("disconnect");
			this.endSession();
			return;
		}
	}
	setupWCEventListeners() {
		SolanaWalletConnectConnector.sessionEventListeners.push((event) => this.handleSessionEvent(event));
	}
	endSession() {
		return __awaiter$3(this, void 0, void 0, function* () {
			logger$2.debug("[SolanaWalletConnect] endSession");
			this.connectionUri = void 0;
			if (!this.session) {
				yield this.disconnectPendingPairing();
				return;
			}
			yield this.signClient.disconnect({
				reason: Jo$1.USER_DISCONNECTED,
				topic: this.session.topic
			});
			this.session = void 0;
			this.pendingPairingTopic = void 0;
		});
	}
	disconnectPendingPairing() {
		return __awaiter$3(this, void 0, void 0, function* () {
			const topic = this.pendingPairingTopic;
			if (!topic) return;
			this.pendingPairingTopic = void 0;
			try {
				yield this.signClient.core.pairing.disconnect({ topic });
			} catch (error) {
				logger$2.warn("[SolanaWalletConnect] Failed to disconnect pending pairing", {
					errorMessage: error instanceof Error ? error.message : String(error),
					topic
				});
			}
		});
	}
	displayUri(connectionOpts) {
		return __awaiter$3(this, void 0, void 0, function* () {
			if (!this.connectionUri) return;
			logger$2.debug("[SolanaWalletConnect] handleDisplayURI", this.connectionUri);
			yield performPlatformSpecificConnectionMethod(this.connectionUri, this.metadata.deepLinks, {
				onDesktopUri: connectionOpts === null || connectionOpts === void 0 ? void 0 : connectionOpts.onDesktopUri,
				onDisplayUri: connectionOpts === null || connectionOpts === void 0 ? void 0 : connectionOpts.onDisplayUri
			}, this.deepLinkPreference, this.constructorProps.redirectUrl);
		});
	}
	getAddress(opts) {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			logger$2.debug("[SolanaWalletConnect] getAddress", opts);
			if (this.session) return this.getActiveAddress();
			/**
			* In mobile/Safari, if the user just navigates back after the deeplink prompt the connection
			* is not rejected, so the previous connection URI is still valid and we can use it to handle the connection
			*/
			if (this.connectionUri) {
				logger$2.debug("[SolanaWalletConnect] getAddress - connecting to WalletConnect with existing connection URI");
				yield this.displayUri(opts);
				return;
			}
			logger$2.logVerboseTroubleshootingMessage("[WalletConnectConnector] getAddress", {
				inAppBrowserUrl: (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.inAppBrowserUrl,
				isMobile: isMobile(),
				mobileExperience: this.mobileExperience
			});
			if (this.openInAppBrowserIfRequired()) return;
			logger$2.debug("[SolanaWalletConnect] getAddress - connecting to WalletConnect");
			const chains = this.solNetworks.map((network) => `solana:${network.genesisHash}`);
			const signClient = yield SolanaWalletConnectConnector.signClientPromise;
			if (!signClient) throw new DynamicError("Failed to access sign client for Wallet Connect Solana: Sign client not initialized");
			try {
				const { approval, uri } = yield signClient.connect({ optionalNamespaces: { solana: {
					chains,
					events: [
						"chainChanged",
						"accountsChanged",
						"disconnected"
					],
					methods: [
						"solana_signMessage",
						"solana_signTransaction",
						"solana_requestAccounts",
						"solana_getAccounts",
						"solana_signAllTransactions",
						"solana_signAndSendTransaction"
					]
				} } });
				logger$2.debug("[SolanaWalletConnect] getAddress - connection URI", uri);
				this.connectionUri = uri;
				this.pendingPairingTopic = parsePairingTopicFromUri(uri);
				yield this.displayUri(opts);
				this.session = yield approval();
				this.pendingPairingTopic = void 0;
				const activeAddress = this.getActiveAddress();
				this.activeAccountEmitter.emit("activeAccountDidChange", activeAddress);
				return activeAddress;
			} finally {
				this.connectionUri = void 0;
			}
		});
	}
	signClientRequest(_a) {
		return __awaiter$3(this, arguments, void 0, function* ({ method, params }) {
			var _b, _c;
			if (!this.session) throw new DynamicError("Session not initialized. Please connect to a wallet first.");
			const chainId = `solana:${(_c = (_b = this.getSelectedNetwork()) === null || _b === void 0 ? void 0 : _b.genesisHash) !== null && _c !== void 0 ? _c : this.solNetworks[0].genesisHash}`;
			try {
				const requestPromise = this.signClient.request({
					chainId,
					request: {
						method,
						params
					},
					topic: this.session.topic
				});
				this.deepLinkIfApplicable({ method });
				return yield requestPromise;
			} catch (error) {
				if (error.message === "An error has occured. Please, try again.") {
					yield this.endSession();
					throw new DynamicError("Wallet connection lost. Please, try again.");
				}
				throw error;
			}
		});
	}
	deepLinkIfApplicable(params) {
		const methodsThatRequireDeepLink = [
			"solana_signMessage",
			"solana_signTransaction",
			"solana_signAllTransactions",
			"solana_signAndSendTransaction"
		];
		const deepLink = this.getDeepLink();
		if (isMobile() && deepLink && methodsThatRequireDeepLink.includes(params.method)) {
			const currentUrl = PlatformService.getUrl();
			walletReturnRoute.set(currentUrl.pathname);
			PlatformService.openURL(deepLink);
		}
	}
	signMessage(messageToSign, options) {
		return __awaiter$3(this, void 0, void 0, function* () {
			logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] signMessage", messageToSign, options);
			const encodedMessage = new TextEncoder().encode(messageToSign);
			return bufferToBase64(yield this.signEncodedMessage(encodedMessage, options));
		});
	}
	signEncodedMessage(encodedMessage, options) {
		return __awaiter$3(this, void 0, void 0, function* () {
			logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] signEncodedMessage", encodedMessage, options);
			if (options === null || options === void 0 ? void 0 : options.address) yield this.validateActiveWallet(options.address);
			const activeAddress = this.getActiveAddress();
			if (!activeAddress) throw new DynamicError("No active address found");
			const { signature } = yield this.signClientRequest({
				method: "solana_signMessage",
				params: {
					message: import_bs58.default.encode(encodedMessage),
					pubkey: new PublicKey(activeAddress).toBase58()
				}
			});
			return import_bs58.default.decode(signature);
		});
	}
	serializeTransaction(transaction) {
		const serialized = transaction.serialize({
			requireAllSignatures: false,
			verifySignatures: false
		});
		return Buffer.from(new Uint8Array(serialized)).toString("base64");
	}
	signTransaction(transaction) {
		return __awaiter$3(this, void 0, void 0, function* () {
			const activeAddress = this.getActiveAddress();
			if (!activeAddress) throw new DynamicError("Active account address is required");
			logger$2.debug("[SolanaWalletConnect] Signing transaction", {
				activeAddress,
				isVersioned: "version" in transaction,
				transaction
			});
			const serializedTransaction = this.serializeTransaction(transaction);
			logger$2.debug("[SolanaWalletConnect] Sending to wallet for signing", { serializedLength: serializedTransaction.length });
			const { signature } = yield this.signClientRequest({
				method: "solana_signTransaction",
				params: { transaction: serializedTransaction }
			});
			logger$2.debug("[SolanaWalletConnect] Received transaction signature from wallet", { signature });
			const signatureBytes = import_bs58.default.decode(signature);
			transaction.addSignature(new PublicKey(activeAddress), signatureBytes);
			return transaction;
		});
	}
	signAllTransactions(transactions) {
		return __awaiter$3(this, void 0, void 0, function* () {
			const serializedTransactions = transactions.map(this.serializeTransaction);
			const { transactions: signedTransactions } = yield this.signClientRequest({
				method: "solana_signAllTransactions",
				params: { transactions: serializedTransactions }
			});
			return signedTransactions.map((signedTransaction, index) => {
				const originalTransaction = transactions[index];
				const decodedTransaction = new Uint8Array(Buffer.from(signedTransaction, "base64"));
				if (isVersionedTransaction$1(originalTransaction)) return VersionedTransaction.deserialize(decodedTransaction);
				return Transaction.from(decodedTransaction);
			});
		});
	}
	signAndSendTransaction(transaction, options) {
		return __awaiter$3(this, void 0, void 0, function* () {
			const supportedMethods = this.getAvailableMethods();
			if (supportedMethods.includes("solana_signAndSendTransaction")) {
				const serializedTransaction = this.serializeTransaction(transaction);
				const { signature } = yield this.signClientRequest({
					method: "solana_signAndSendTransaction",
					params: {
						sendOptions: options,
						transaction: serializedTransaction
					}
				});
				return signature;
			}
			if (supportedMethods.includes("solana_signTransaction")) {
				logger$2.debug("[SolanaWalletConnect] Using fallback: signTransaction + sendRawTransaction");
				const signedTransaction = yield this.signTransaction(transaction);
				const isSigned = isTxAlreadySigned(signedTransaction);
				logger$2.debug("[SolanaWalletConnect] Transaction signed, checking signatures", {
					hasSignatures: "signatures" in signedTransaction && signedTransaction.signatures.length > 0,
					isSigned,
					signaturesLength: "signatures" in signedTransaction ? signedTransaction.signatures.length : "N/A"
				});
				if (!isSigned) throw new DynamicError("Transaction returned from wallet was not properly signed. The wallet may have rejected the signing request.");
				const serialized = signedTransaction.serialize();
				logger$2.debug("[SolanaWalletConnect] Transaction serialized", { serializedLength: serialized.length });
				const signature = yield this.getWalletClient().sendRawTransaction(serialized, options);
				logger$2.debug("[SolanaWalletConnect] Transaction sent successfully", { signature });
				return signature;
			}
			throw new DynamicError("Wallet does not support signing and sending transactions. Please connect to a wallet that supports at least solana_signTransaction.");
		});
	}
	getDeepLink() {
		const deepLink = getDeepLink({
			deepLinks: this.metadata.deepLinks,
			mode: "regular",
			preference: this.deepLinkPreference
		});
		logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] getDeepLink - deepLink", deepLink);
		if (!deepLink) return;
		if (this.session) return `${deepLink}?sessionTopic=${this.session.topic}`;
		return deepLink;
	}
	getConnectedAccounts() {
		return __awaiter$3(this, void 0, void 0, function* () {
			/**
			* Each session has a single account (it might be on multiple chains hence the array),
			* but that account is stored as a CAIP-10 string, so we need to parse it to get the address
			*/
			const account = this.getActiveAddress();
			if (!account) {
				logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] getConnectedAccounts - no activeAccounts, returning empty array");
				return [];
			}
			logger$2.logVerboseTroubleshootingMessage("[SolanaWalletConnect] getConnectedAccounts - activeAccounts", [account]);
			return [account];
		});
	}
	getConnectionUri() {
		return this.connectionUri;
	}
	validateActiveWallet(expectedAddress) {
		return __awaiter$3(this, void 0, void 0, function* () {
			logger$2.debug("[SolanaWalletConnect] validateActiveWallet - validating wallet", expectedAddress);
			const [activeAddress] = yield this.getConnectedAccounts();
			if (isSameAddress(activeAddress, expectedAddress, this.connectedChain)) {
				logger$2.debug("[SolanaWalletConnect] validateActiveWallet - wallet is active");
				return;
			}
			return this.handleWalletNotActive({
				activeAddress,
				expectedAddress
			});
		});
	}
};
SolanaWalletConnectConnector.sessionEventListeners = [];
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/InjectedWalletBase/InjectedWalletBase.js
var InjectedWalletBase = class extends SolanaWalletConnector {
	constructor() {
		super(...arguments);
		/**
		* For historical reasons, all wallet connect data for wallets reside in the EVM entry for the wallet in wallet book.
		* Therefore, for Solana wallets that support wallet connect, we must also hold the reference to the wallet book
		* entry that has the wallet connect data for it.
		*/
		this.walletConnectWalletBookEntry = void 0;
	}
	getMobileOrInstalledWallet() {
		const canUseWalletConnect = this.walletConnectWalletBookEntry && this.constructorProps.projectId;
		logger$2.logVerboseTroubleshootingMessage("[SOL InjectedWalletBase] getMobileOrInstalledWallet", {
			canUseWalletConnect,
			isInstalledOnBrowser: this.isInstalledOnBrowser(),
			projectId: this.constructorProps.projectId,
			walletConnectWalletBookEntry: this.walletConnectWalletBookEntry
		});
		if (this.isInstalledOnBrowser() || !canUseWalletConnect) return this;
		const wcConnector = new SolanaWalletConnectConnector(Object.assign(Object.assign({}, this.constructorProps), {
			metadata: getWalletMetadataFromWalletBook(Object.assign(Object.assign({}, this.metadata), {
				walletBook: this.walletBook,
				walletBookWallet: this.walletConnectWalletBookEntry,
				walletKey: this.key
			})),
			overrideKey: this.key,
			walletName: this.name
		}));
		wcConnector.init();
		return wcConnector;
	}
	get solProviderHelper() {
		if (!this._solProviderHelper) this._solProviderHelper = new SolProviderHelper(this);
		return this._solProviderHelper;
	}
	findProvider() {
		var _a;
		return (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.getInstalledProvider();
	}
	setupEventListeners() {
		var _a;
		(_a = this.solProviderHelper) === null || _a === void 0 || _a._setupEventListeners();
	}
	teardownEventListeners() {
		var _a;
		(_a = this.solProviderHelper) === null || _a === void 0 || _a._teardownEventListeners();
	}
	connect() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			yield (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.connect();
		});
	}
	getSigner() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			return (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.connect();
		});
	}
	createUiTransaction(from) {
		return __awaiter$3(this, void 0, void 0, function* () {
			yield this.validateActiveWallet(from);
			return new SolanaUiTransaction({
				connection: this.getWalletClient(),
				from,
				onSubmit: (transaction) => __awaiter$3(this, void 0, void 0, function* () {
					var _a;
					if (!transaction) return;
					const signer = yield this.getSigner();
					if (!signer) throw new Error("Signer not found");
					const blockhash = yield this.getWalletClient().getLatestBlockhash();
					if ("version" in transaction) transaction.message.recentBlockhash = blockhash.blockhash;
					else {
						const userAddress = yield this.getAddress();
						if (!userAddress) throw new Error("User address not found");
						transaction.recentBlockhash = blockhash.blockhash;
						transaction.feePayer = (_a = transaction.feePayer) !== null && _a !== void 0 ? _a : new PublicKey(userAddress);
					}
					return (yield signer.signAndSendTransaction(transaction)).signature;
				})
			});
		});
	}
	isInstalledOnBrowser() {
		var _a;
		return Boolean((_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.isInstalledHelper());
	}
	getAddress() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			if (this.openInAppBrowserIfRequired()) return;
			return (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.getAddress();
		});
	}
	signMessage(messageToSign) {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a, _b;
			const walletAddress = yield (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.getAddress();
			if (walletAddress && this.isLedgerAddress(walletAddress)) throw new SignMessageNotSupportedError(this.name);
			return (_b = this.solProviderHelper) === null || _b === void 0 ? void 0 : _b.signMessage(messageToSign);
		});
	}
	getConnectedAccounts() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a, _b;
			return (_b = (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.getConnectedAccounts()) !== null && _b !== void 0 ? _b : [];
		});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/BackpackSol/BackpackSol.js
var BackpackSol = class extends InjectedWalletBase {
	constructor(props) {
		super(props);
		this.name = "Backpack";
		this.overrideKey = "backpacksol";
		this.walletConnectWalletBookEntry = findWalletBookWallet(props.walletBook, this.key);
	}
	getSigner() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			return (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.connect();
		});
	}
	signMessage(messageToSign) {
		return __awaiter$3(this, void 0, void 0, function* () {
			if (!(yield this.getAddress())) return;
			const provider = yield this.getSigner();
			if (!provider) return;
			const signedMessage = yield provider.signMessage(Buffer.from(messageToSign, "utf8"));
			if (!signedMessage) return;
			if (typeof signedMessage === "object" && "signature" in signedMessage) return bufferToBase64(signedMessage.signature);
			return bufferToBase64(signedMessage);
		});
	}
};
Object.defineProperty(BackpackSol, "key", {
	value: "backpacksol",
	writable: false
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas-svm@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_f_2bb416435e077540d4371a6bed4b0554/node_modules/@dynamic-labs/waas-svm/_virtual/_tslib.js
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
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_faste_08d60f15080b34dbbd358321f71b67c9/node_modules/@dynamic-labs/waas/package.js
var version = "4.89.0";
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_faste_08d60f15080b34dbbd358321f71b67c9/node_modules/@dynamic-labs/waas/_virtual/_tslib.js
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
//#region ../../node_modules/.pnpm/@dynamic-labs+waas@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_faste_08d60f15080b34dbbd358321f71b67c9/node_modules/@dynamic-labs/waas/utils/createWaasClientSecureStorage.js
var createWaasClientSecureStorage = () => ({
	getClientKeyShare: (accountAddress) => __awaiter(void 0, void 0, void 0, function* () {
		const shares = StorageService.getItem(`waas_client_key_share_${accountAddress}`, { priority: ["secureStorage"] });
		return shares ? JSON.parse(shares) : [];
	}),
	removeClientKeyShare: (accountAddress) => __awaiter(void 0, void 0, void 0, function* () {
		StorageService.removeItem(`waas_client_key_share_${accountAddress}`, { priority: ["secureStorage"] });
	}),
	setClientKeyShare: (accountAddress, shares) => __awaiter(void 0, void 0, void 0, function* () {
		return StorageService.setItem(`waas_client_key_share_${accountAddress}`, JSON.stringify(shares), { priority: ["secureStorage"] });
	})
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_faste_08d60f15080b34dbbd358321f71b67c9/node_modules/@dynamic-labs/waas/utils/instrumentation.js
var InstrumentationTimer = class {
	constructor(startTime) {
		this.startTime = startTime || Date.now();
		this.stepStartTime = this.startTime;
	}
	getElapsed() {
		return Date.now() - this.startTime;
	}
	startStep() {
		this.stepStartTime = Date.now();
	}
	getStepElapsed() {
		return Date.now() - this.stepStartTime;
	}
	resetStep() {
		this.startStep();
	}
	setStartTime(startTime) {
		this.startTime = startTime;
	}
	setStepStartTime(stepStartTime) {
		this.stepStartTime = stepStartTime;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_faste_08d60f15080b34dbbd358321f71b67c9/node_modules/@dynamic-labs/waas/src/DynamicWaasMixin.js
var UNKNOWN_ERROR_CODE = "unknown";
var WaasExportHandler = class {
	constructor() {
		this.iframeStamper = null;
	}
	setIframeStamper(iframe) {
		this.iframeStamper = iframe;
	}
	clear() {
		if (this.iframeStamper) {
			this.iframeStamper.remove();
			this.iframeStamper = null;
		}
	}
};
var withDynamicWaas = (BaseClass) => {
	class DynamicWaasMixin extends BaseClass {
		setGetAuthTokenFunction(getAuthToken) {
			this.getAuthToken = getAuthToken;
		}
		setOnUnauthorizedFunction(onUnauthorized) {
			this.onUnauthorized = onUnauthorized;
		}
		setWaasAuthMode(authMode) {
			this.authMode = authMode;
		}
		setGetMfaTokenFunction(getMfaToken) {
			this.getMfaToken = getMfaToken;
		}
		setGetElevatedAccessTokenFunction(getElevatedAccessToken) {
			this.getElevatedAccessToken = getElevatedAccessToken;
		}
		setGetWalletPasswordFunction(getWalletPassword) {
			this.getWalletPassword = getWalletPassword;
		}
		/**
		* Checks if the wallet needs a password for signing operations.
		* Returns the password if needed, or undefined if the wallet is already unlocked.
		*/
		getPasswordIfNeeded(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress }) {
				const recoveryState = yield this.getWalletRecoveryState({ accountAddress });
				if (recoveryState.walletReadyState === "ready") return;
				if (!recoveryState.isPasswordEncrypted) return;
				if (!this.getWalletPassword) throw new DynamicError("Wallet is locked but no password provider is configured");
				const password = yield this.getWalletPassword({
					accountAddress,
					chainName: this.chainName
				});
				if (!password) throw new UserRejectedRequestError();
				return password;
			});
		}
		/**
		* Prompts for the wallet password if the wallet is password-encrypted.
		*
		* Unlike `getPasswordIfNeeded` (which skips the prompt when the wallet is
		* already unlocked in memory), this method always asks for the password
		* when the wallet is password-encrypted. Use it for operations that
		* encrypt/decrypt data stored externally (e.g. cloud backup/restore),
		* where the password is required to encrypt/decrypt the shares on disk.
		*
		* Returns undefined if the wallet is not password-encrypted or if no
		* password provider is configured.
		*/
		getPassword(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress }) {
				if (!this.getWalletPassword) return;
				if (!(yield this.getWalletRecoveryState({ accountAddress })).isPasswordEncrypted) return;
				return this.getWalletPassword({
					accountAddress,
					chainName: this.chainName
				});
			});
		}
		setEnvironmentId(environmentId) {
			this.environmentId = environmentId;
		}
		setBaseApiUrl(baseApiUrl) {
			this.baseApiUrl = baseApiUrl;
		}
		setBaseClientKeysharesRelayApiUrl(baseClientKeysharesRelayApiUrl) {
			this.baseClientKeysharesRelayApiUrl = baseClientKeysharesRelayApiUrl;
		}
		setRelayUrl(relayUrl) {
			this.relayUrl = relayUrl;
		}
		setGetSignedSessionIdFunction(getSignedSessionId) {
			this.getSignedSessionId = getSignedSessionId;
		}
		delegateKeyShares(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, password }) {
				var _b, _c;
				if (!accountAddress) throw new Error("Account address is required");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPasswordIfNeeded({ accountAddress });
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new Error("Signed session ID is required");
				const authToken = (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this);
				if (!authToken) throw new Error("Auth token is required");
				return walletClient.delegateKeyShares({
					accountAddress,
					authToken,
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		constructor(...args) {
			super(...args);
			this.name = "Dynamic Waas";
			this.overrideKey = "dynamicwaas";
			this.isEmbeddedWallet = true;
			this.authMode = "header";
			this.__exportHandler = new WaasExportHandler();
			const { connectedChain } = this;
			const chainName = {
				ALEO: "ALEO",
				BTC: "BTC",
				EVM: "EVM",
				SOL: "SVM",
				STELLAR: "STELLAR",
				SUI: "SUI",
				TEMPO: "TEMPO",
				TON: "TON"
			}[connectedChain];
			if (!chainName) throw new DynamicError(`Unsupported chain: ${connectedChain}`);
			this.chainName = chainName;
		}
		createDynamicWaasClient(traceContext) {
			return __awaiter(this, void 0, void 0, function* () {
				var _a;
				const authToken = (_a = this.getAuthToken) === null || _a === void 0 ? void 0 : _a.call(this);
				if (!authToken && this.authMode === "header") throw new DynamicError("Auth token is required in non-cookie auth mode");
				if (!this.environmentId) throw new DynamicError("Environment ID is required");
				const client = new DynamicWalletClient({
					authMode: this.authMode || "header",
					authToken: authToken || "",
					baseApiUrl: this.baseApiUrl || "https://app.dynamicauth.com",
					baseClientKeysharesRelayApiUrl: this.baseClientKeysharesRelayApiUrl,
					baseMPCRelayApiUrl: this.relayUrl || "https://relay.dynamicauth.com",
					chainName: this.chainName,
					environmentId: this.environmentId,
					sdkVersion: version
				}, Object.assign(Object.assign(Object.assign({}, PlatformService.isWaasSecureStorageSupported ? { secureStorage: createWaasClientSecureStorage() } : {}), this.getSignedSessionId ? { getSignedSessionId: this.getSignedSessionId } : {}), this.onUnauthorized ? { onUnauthorized: this.onUnauthorized } : {}));
				this.instrumentAsync({
					context: traceContext,
					fn: () => __awaiter(this, void 0, void 0, function* () {
						return client.initialize();
					}),
					operation: "createDynamicWaasClient",
					resource: "initialize"
				});
				return client;
			});
		}
		getWaasWalletClient(traceContext) {
			return __awaiter(this, void 0, void 0, function* () {
				if (!this.dynamicWaasClient) this.dynamicWaasClient = yield this.createDynamicWaasClient(traceContext);
				return this.dynamicWaasClient;
			});
		}
		createWalletAccount() {
			return __awaiter(this, arguments, void 0, function* ({ thresholdSignatureScheme = "TWO_OF_TWO", password, bitcoinConfig } = {}) {
				var _a, _b;
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_a = this.getSignedSessionId) === null || _a === void 0 ? void 0 : _a.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				return yield walletClient.createWalletAccount({
					authToken: (_b = this.getAuthToken) === null || _b === void 0 ? void 0 : _b.call(this),
					bitcoinConfig,
					password,
					signedSessionId,
					thresholdSignatureScheme
				});
			});
		}
		importPrivateKey(_a) {
			return __awaiter(this, arguments, void 0, function* ({ privateKey, thresholdSignatureScheme = "TWO_OF_TWO", publicAddressCheck, addressType, legacyWalletId, password }) {
				var _b, _c;
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				yield walletClient.importPrivateKey({
					addressType,
					authToken: (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this),
					legacyWalletId,
					password,
					privateKey,
					publicAddressCheck,
					signedSessionId,
					thresholdSignatureScheme
				});
			});
		}
		exportPrivateKey() {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, displayContainer, password } = {}) {
				var _a, _b, _c, _d;
				const walletClient = yield this.getWaasWalletClient();
				const targetAccountAddress = accountAddress || (yield this.getActiveAccountAddress());
				if (!targetAccountAddress) throw new DynamicError("Account address is required");
				if (!displayContainer) throw new DynamicError("Missing display container for export private key");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPasswordIfNeeded({ accountAddress: targetAccountAddress });
				const signedSessionId = yield (_a = this.getSignedSessionId) === null || _a === void 0 ? void 0 : _a.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				this.__exportHandler.setIframeStamper(displayContainer);
				const mfaToken = yield (_b = this.getMfaToken) === null || _b === void 0 ? void 0 : _b.call(this, { mfaAction: MFAAction.WalletWaasExport });
				const elevatedAccessToken = yield (_c = this.getElevatedAccessToken) === null || _c === void 0 ? void 0 : _c.call(this, { scope: TokenScope.Walletexport });
				yield walletClient.exportPrivateKey({
					accountAddress: targetAccountAddress,
					authToken: (_d = this.getAuthToken) === null || _d === void 0 ? void 0 : _d.call(this),
					displayContainer,
					elevatedAccessToken,
					mfaToken,
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		getExportHandler() {
			return this.__exportHandler;
		}
		exportClientKeyshares(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, password }) {
				var _b, _c;
				if (!accountAddress) throw new DynamicError("Account address is required");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPasswordIfNeeded({ accountAddress });
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				yield (yield this.getWaasWalletClient()).exportClientKeyshares({
					accountAddress,
					authToken: (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this),
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		backupKeySharesToGoogleDrive(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, password, googleDriveAccessToken }) {
				var _b, _c;
				if (!accountAddress) throw new DynamicError("Account address is required");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPassword({ accountAddress });
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				return walletClient.backupKeySharesToGoogleDrive({
					accountAddress,
					authToken: (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this),
					googleDriveAccessToken,
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		exportClientKeysharesFromGoogleDrive(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, password }) {
				var _b, _c;
				if (!accountAddress) throw new DynamicError("Account address is required");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPassword({ accountAddress });
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				return walletClient.exportClientKeysharesFromGoogleDrive({
					accountAddress,
					authToken: (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this),
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		backupKeySharesToICloud(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, password }) {
				var _b, _c;
				if (!accountAddress) throw new DynamicError("Account address is required");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPassword({ accountAddress });
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				return walletClient.backupKeySharesToICloud({
					accountAddress,
					authToken: (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this),
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		displayICloudSignIn(_a) {
			return __awaiter(this, arguments, void 0, function* ({ displayContainer }) {
				return (yield this.getWaasWalletClient()).displayICloudSignIn({ displayContainer });
			});
		}
		hideICloudSignIn() {
			return __awaiter(this, void 0, void 0, function* () {
				return (yield this.getWaasWalletClient()).hideICloudSignIn();
			});
		}
		isICloudAuthenticated() {
			return __awaiter(this, void 0, void 0, function* () {
				return (yield this.getWaasWalletClient()).isICloudAuthenticated();
			});
		}
		refreshWalletAccountShares(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, password }) {
				var _b, _c, _d, _e, _f, _g;
				if (!accountAddress) throw new DynamicError("Account address is required");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPasswordIfNeeded({ accountAddress });
				const walletClient = yield this.getWaasWalletClient();
				const recoverySignedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				const backupSignedSessionId = yield (_c = this.getSignedSessionId) === null || _c === void 0 ? void 0 : _c.call(this);
				if (!recoverySignedSessionId || !backupSignedSessionId) throw new DynamicError("Signed session ID is required");
				yield walletClient.getWallet({
					accountAddress,
					authToken: (_d = this.getAuthToken) === null || _d === void 0 ? void 0 : _d.call(this),
					signedSessionId: recoverySignedSessionId
				});
				const mfaToken = yield (_e = this.getMfaToken) === null || _e === void 0 ? void 0 : _e.call(this, { mfaAction: MFAAction.WalletWaasRefresh });
				const elevatedAccessToken = yield (_f = this.getElevatedAccessToken) === null || _f === void 0 ? void 0 : _f.call(this, { scope: TokenScope.Walletdelegate });
				return walletClient.refreshWalletAccountShares({
					accountAddress,
					authToken: (_g = this.getAuthToken) === null || _g === void 0 ? void 0 : _g.call(this),
					elevatedAccessToken,
					mfaToken,
					password: resolvedPassword,
					signedSessionId: backupSignedSessionId
				});
			});
		}
		reshareWalletAccountShares(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, thresholdSignatureScheme, password }) {
				var _b, _c, _d, _e;
				if (!accountAddress) throw new DynamicError("Account address is required");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPasswordIfNeeded({ accountAddress });
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				const wallet = (yield walletClient.getWallets()).find((w) => w.accountAddress === accountAddress);
				if (!wallet) throw new DynamicError("Wallet not found");
				const oldThresholdSignatureScheme = wallet.thresholdSignatureScheme;
				const mfaToken = yield (_c = this.getMfaToken) === null || _c === void 0 ? void 0 : _c.call(this, { mfaAction: MFAAction.WalletWaasReshare });
				const elevatedAccessToken = yield (_d = this.getElevatedAccessToken) === null || _d === void 0 ? void 0 : _d.call(this, { scope: TokenScope.Walletdelegate });
				return walletClient.reshare({
					accountAddress,
					authToken: (_e = this.getAuthToken) === null || _e === void 0 ? void 0 : _e.call(this),
					elevatedAccessToken,
					mfaToken,
					newThresholdSignatureScheme: thresholdSignatureScheme,
					oldThresholdSignatureScheme,
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		revokeDelegation(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, password }) {
				var _b, _c;
				if (!accountAddress) throw new DynamicError("Account address is required");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPasswordIfNeeded({ accountAddress });
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				return walletClient.revokeDelegation({
					accountAddress,
					authToken: (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this),
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		updatePassword(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, existingPassword, newPassword }) {
				if (!accountAddress) throw new DynamicError("Account address is required");
				const resolvedExistingPassword = existingPassword !== null && existingPassword !== void 0 ? existingPassword : yield this.getPasswordIfNeeded({ accountAddress });
				if (!resolvedExistingPassword) throw new DynamicError("Existing password is required to update password");
				const walletClient = yield this.getWaasWalletClient();
				if (!this.getSignedSessionId) throw new DynamicError("Signed session ID is required");
				const encryptedWallets = (yield walletClient.getAllWallets()).filter((w) => {
					var _a;
					return (_a = w.clientKeySharesBackupInfo) === null || _a === void 0 ? void 0 : _a.passwordEncrypted;
				});
				const passwordUpdateBatchId = crypto.randomUUID();
				yield Promise.all(encryptedWallets.map((wallet) => __awaiter(this, void 0, void 0, function* () {
					var _b;
					const signedSessionId = yield this.getSignedSessionId();
					yield walletClient.updatePassword({
						accountAddress: wallet.accountAddress,
						authToken: (_b = this.getAuthToken) === null || _b === void 0 ? void 0 : _b.call(this),
						existingPassword: resolvedExistingPassword,
						newPassword,
						passwordUpdateBatchId,
						signedSessionId
					});
				})));
			});
		}
		setPassword(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, newPassword }) {
				if (!accountAddress) throw new DynamicError("Account address is required");
				const walletClient = yield this.getWaasWalletClient();
				if (!this.getSignedSessionId) throw new DynamicError("Signed session ID is required");
				const wallets = yield walletClient.getAllWallets();
				const passwordUpdateBatchId = crypto.randomUUID();
				yield Promise.all(wallets.map((wallet) => __awaiter(this, void 0, void 0, function* () {
					var _b;
					const signedSessionId = yield this.getSignedSessionId();
					yield walletClient.setPassword({
						accountAddress: wallet.accountAddress,
						authToken: (_b = this.getAuthToken) === null || _b === void 0 ? void 0 : _b.call(this),
						newPassword,
						passwordUpdateBatchId,
						signedSessionId
					});
				})));
			});
		}
		signRawMessage(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, message, password }) {
				var _b, _c, _d, _e;
				if (!accountAddress) throw new DynamicError("Account address is required");
				if (message.length !== 64) throw new DynamicError("Message must be 64 characters long");
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPasswordIfNeeded({ accountAddress });
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				const mfaToken = yield (_c = this.getMfaToken) === null || _c === void 0 ? void 0 : _c.call(this, { mfaAction: MFAAction.WalletWaasSign });
				const elevatedAccessToken = yield (_d = this.getElevatedAccessToken) === null || _d === void 0 ? void 0 : _d.call(this, { scope: TokenScope.Walletsign });
				return walletClient.signRawMessage({
					accountAddress,
					authToken: (_e = this.getAuthToken) === null || _e === void 0 ? void 0 : _e.call(this),
					elevatedAccessToken,
					message,
					mfaToken,
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		unlockWallet(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress, password }) {
				var _b, _c;
				const resolvedPassword = password !== null && password !== void 0 ? password : yield this.getPasswordIfNeeded({ accountAddress });
				if (!resolvedPassword) throw new DynamicError("Password is required to unlock this wallet");
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				return walletClient.unlockWallet({
					accountAddress,
					authToken: (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this),
					password: resolvedPassword,
					signedSessionId
				});
			});
		}
		getWalletRecoveryState(_a) {
			return __awaiter(this, arguments, void 0, function* ({ accountAddress }) {
				var _b, _c;
				const walletClient = yield this.getWaasWalletClient();
				const signedSessionId = yield (_b = this.getSignedSessionId) === null || _b === void 0 ? void 0 : _b.call(this);
				if (!signedSessionId) throw new DynamicError("Signed session ID is required");
				return walletClient.getWalletRecoveryState({
					accountAddress,
					authToken: (_c = this.getAuthToken) === null || _c === void 0 ? void 0 : _c.call(this),
					signedSessionId
				});
			});
		}
		endSession(reason) {
			return __awaiter(this, void 0, void 0, function* () {
				const waasClient = yield this.getWaasWalletClient();
				if (!waasClient) return;
				if (reason !== "token-expired") {
					const accountAddress = yield this.getActiveAccountAddress();
					if (accountAddress) try {
						yield createWaasClientSecureStorage().removeClientKeyShare(accountAddress);
					} catch (error) {
						this.instrument("[endSession] direct key share removal failed", Object.assign({
							key: "endSession-removeClientKeyShare-failed",
							time: 0
						}, this.buildErrorInstrumentContext(error)));
					}
					Promise.resolve(waasClient.cleanup()).catch((error) => {
						this.instrument("[endSession] background iframe cleanup failed", Object.assign({
							key: "endSession-cleanup-failed",
							time: 0
						}, this.buildErrorInstrumentContext(error)));
					});
				}
				this.dynamicWaasClient = void 0;
			});
		}
		/**
		* Get connected accounts by fetching wallets from Waas client.
		*/
		getConnectedAccounts() {
			return __awaiter(this, void 0, void 0, function* () {
				try {
					return (yield (yield this.getWaasWalletClient()).getWallets()).map((w) => w === null || w === void 0 ? void 0 : w.accountAddress).filter((a) => typeof a === "string");
				} catch (error) {
					this.logger.debug("[getConnectedAccounts] Failed to fetch wallets from Waas client", { error });
					return [];
				}
			});
		}
		generateTraceId() {
			const bytes = new Uint8Array(16);
			crypto.getRandomValues(bytes);
			return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
		}
		/**
		* Normalizes an unknown thrown value into the error fields used across
		* instrumentation so callers don't re-derive them at each catch site.
		*
		* Wrapped in try/catch: this is best-effort logging, and a value that
		* resists formatting (e.g. an object whose toString throws) must never
		* turn a log line into an exception that blocks the calling flow such as
		* logout.
		*
		* `public` (not `private`) because the TS `private` keyword can't be used
		* on this mixin's exported class expression (TS4094), and ECMAScript
		* `#private` isn't supported by the package's Jest/Babel transform. It is
		* internal-only despite the modifier — same constraint as `instrument`.
		*/
		buildErrorInstrumentContext(error) {
			var _a, _b;
			try {
				return {
					errorCode: (_a = error === null || error === void 0 ? void 0 : error.code) !== null && _a !== void 0 ? _a : UNKNOWN_ERROR_CODE,
					errorMessage: error instanceof Error ? error.message : String(error),
					errorType: (_b = error === null || error === void 0 ? void 0 : error.constructor) === null || _b === void 0 ? void 0 : _b.name
				};
			} catch (_c) {
				return { errorCode: UNKNOWN_ERROR_CODE };
			}
		}
		/**
		* Helper method to instrument with automatic properties inclusion
		*/
		instrument(message, context) {
			const defaultContext = {
				accountAddress: context.accountAddress || this.activeAccountAddress,
				environmentId: context.environmentId || this.environmentId,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				traceId: context.traceId || this.generateTraceId()
			};
			this.logger.debug(message, Object.assign(Object.assign({}, defaultContext), context));
			this.logger.instrument(message, Object.assign(Object.assign({}, defaultContext), context));
		}
		instrumentAsync(_a) {
			return __awaiter(this, arguments, void 0, function* ({ operation, resource, fn, context }) {
				const timing = new InstrumentationTimer(context === null || context === void 0 ? void 0 : context.startTime);
				if (context === null || context === void 0 ? void 0 : context.stepStartTime) timing.setStepStartTime(context.stepStartTime);
				else timing.startStep();
				this.instrument(`[${operation}] ${resource} - start`, Object.assign({
					key: `${resource}-start`,
					operation,
					stepTime: timing.getStepElapsed(),
					time: timing.getElapsed()
				}, context));
				try {
					const result = yield fn(timing);
					this.instrument(`[${operation}] ${resource} - completed`, Object.assign({
						key: `${resource}-completed`,
						operation,
						stepTime: timing.getStepElapsed(),
						time: timing.getElapsed()
					}, context));
					return result;
				} catch (error) {
					const isUserRejection = error instanceof UserRejectedRequestError || (error === null || error === void 0 ? void 0 : error.code) === "user_rejected_request";
					const errorContext = this.buildErrorInstrumentContext(error);
					if (isUserRejection) this.logger.debug(`[${operation}] ${resource} - cancelled`, Object.assign(Object.assign({
						key: `${resource}-cancelled`,
						operation,
						stepTime: timing.getStepElapsed(),
						time: timing.getElapsed()
					}, context), errorContext));
					else this.instrument(`[${operation}] ${resource} - failed`, Object.assign(Object.assign({
						key: `${resource}-failed`,
						operation,
						stepTime: timing.getStepElapsed(),
						time: timing.getElapsed()
					}, context), errorContext));
					throw error;
				}
			});
		}
	}
	return DynamicWaasMixin;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas-svm@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_f_2bb416435e077540d4371a6bed4b0554/node_modules/@dynamic-labs/waas-svm/utils/logger.js
var logger = new Logger("@dynamic-labs/waas-svm");
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas-svm@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_f_2bb416435e077540d4371a6bed4b0554/node_modules/@dynamic-labs/waas-svm/src/signer/DynamicWaasSVMSigner.js
/**
* Signer implementation for DynamicWaasSVMConnector
* This class provides a similar interface to TurnkeySolanaSigner
*/
var DynamicWaasSVMSigner = class extends eventemitter3_default {
	constructor({ walletConnector }) {
		super();
		this.isConnected = true;
		this.providers = [this];
		this.isBraveWallet = false;
		this.isGlow = false;
		this.isPhantom = false;
		this.isSolflare = false;
		this.isExodus = false;
		this.isBackpack = false;
		this.isMagicEden = false;
		this.walletConnector = walletConnector;
		this.accountAddress = this.walletConnector.activeAccountAddress;
		this.publicKey = this.accountAddress ? new PublicKey(this.accountAddress) : void 0;
	}
	signMessage(encodedMessage) {
		return __awaiter$1(this, void 0, void 0, function* () {
			const messageString = Buffer.from(encodedMessage).toString();
			const signedMessage = yield this.walletConnector.signMessage(messageString);
			return { signature: import_bs58.default.decode(signedMessage) };
		});
	}
	signTransaction(transaction) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return this.walletConnector.signTransaction(transaction);
		});
	}
	signAllTransactions(transactions) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return this.walletConnector.signAllTransactions(transactions);
		});
	}
	signAndSendTransaction(transaction, options) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return { signature: yield this.walletConnector.signAndSendTransaction(transaction, options) };
		});
	}
	connect(_args) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return {
				address: this.accountAddress,
				publicKey: this.publicKey
			};
		});
	}
	disconnect() {
		return __awaiter$1(this, void 0, void 0, function* () {});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas-svm@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_f_2bb416435e077540d4371a6bed4b0554/node_modules/@dynamic-labs/waas-svm/src/connector/DynamicWaasSVMConnector.js
var DynamicWaasSVMConnector = class extends withDynamicWaas(SolanaWalletConnector) {
	connect() {
		throw new Error("Method not implemented.");
	}
	constructor(props) {
		super(props);
		this.name = "Dynamic Waas";
		this.overrideKey = "dynamicwaas";
		this.isEmbeddedWallet = true;
		this.getSvmGasSponsorshipEnabled = () => false;
		this.logger = logger;
		this.walletUiUtils = props.walletUiUtils;
	}
	/**
	* Set a getter that resolves the current SVM gas sponsorship state.
	* Using a getter avoids stale values from initialization race conditions.
	*/
	setSvmGasSponsorshipEnabled(getEnabled) {
		this.getSvmGasSponsorshipEnabled = getEnabled;
	}
	/**
	* Check if a transaction is already signed (has non-zero signatures).
	*/
	isTxAlreadySigned(transaction) {
		if ("version" in transaction) return transaction.signatures.some((sig) => !sig.every((byte) => byte === 0));
		return transaction.signatures.some((sig) => sig.signature && !sig.signature.every((byte) => byte === 0));
	}
	/**
	* Sponsor a transaction if gas sponsorship is enabled and the tx is unsigned.
	* Falls back to original transaction on error.
	*/
	maybeSponsorTransaction(transaction) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (!this.getSvmGasSponsorshipEnabled()) return transaction;
			if (this.isTxAlreadySigned(transaction)) {
				logger.debug("[maybeSponsorTransaction] Skipping sponsorship - transaction already signed");
				return transaction;
			}
			if (!this.environmentId) {
				logger.warn("[maybeSponsorTransaction] Missing environmentId, skipping sponsorship");
				return transaction;
			}
			try {
				const sponsoredTransaction = yield sponsorSolanaTransaction(this.environmentId, transaction);
				logger.info("[maybeSponsorTransaction] Transaction sponsored successfully");
				return sponsoredTransaction;
			} catch (error) {
				logger.warn("[maybeSponsorTransaction] Failed to sponsor transaction, using original", { error });
				return transaction;
			}
		});
	}
	/**
	* Override setEnvironmentId to ensure it's set on the global logger
	*/
	setEnvironmentId(environmentId) {
		super.setEnvironmentId(environmentId);
		Logger.setEnvironmentId(environmentId);
	}
	setActiveAccountAddress(accountAddress) {
		this.activeAccountAddress = accountAddress;
	}
	getActiveAccountAddress() {
		return __awaiter$1(this, void 0, void 0, function* () {
			return this.activeAccountAddress;
		});
	}
	validateActiveWallet(expectedAddress) {
		return __awaiter$1(this, void 0, void 0, function* () {
			var _a;
			const targetWallet = yield (yield this.getWaasWalletClient()).getWallet({
				accountAddress: expectedAddress,
				authToken: (_a = this.getAuthToken) === null || _a === void 0 ? void 0 : _a.call(this),
				signedSessionId: ""
			});
			if (!targetWallet) throw new DynamicError("Account not found");
			if (!isSameAddress(targetWallet.accountAddress, this.activeAccountAddress || "", this.connectedChain)) this.activeAccountAddress = targetWallet.accountAddress;
		});
	}
	internalSignMessage(message_1) {
		return __awaiter$1(this, arguments, void 0, function* (message, { parentTraceId, startTime } = {}) {
			var _a, _b, _c, _d;
			const traceId = parentTraceId || this.generateTraceId();
			const effectiveStartTime = startTime || Date.now();
			const walletClient = yield this.instrumentAsync({
				context: {
					chainName: "SVM",
					startTime: effectiveStartTime,
					traceId
				},
				fn: () => __awaiter$1(this, void 0, void 0, function* () {
					return this.getWaasWalletClient();
				}),
				operation: "internalSignMessage",
				resource: "getWaasWalletClient"
			});
			if (!this.activeAccountAddress) throw new Error("Active account address is required");
			const signedSessionId = yield (_a = this.getSignedSessionId) === null || _a === void 0 ? void 0 : _a.call(this);
			if (!signedSessionId) throw new DynamicError("Signed session ID is required");
			const mfaToken = yield (_b = this.getMfaToken) === null || _b === void 0 ? void 0 : _b.call(this, { mfaAction: MFAAction.WalletWaasSign });
			const elevatedAccessToken = yield (_c = this.getElevatedAccessToken) === null || _c === void 0 ? void 0 : _c.call(this, { scope: TokenScope.Walletsign });
			const password = yield this.getPasswordIfNeeded({ accountAddress: this.activeAccountAddress });
			const accountAddress = this.activeAccountAddress;
			const authToken = (_d = this.getAuthToken) === null || _d === void 0 ? void 0 : _d.call(this);
			return yield this.instrumentAsync({
				context: {
					chainName: "SVM",
					startTime: effectiveStartTime,
					traceId
				},
				fn: () => __awaiter$1(this, void 0, void 0, function* () {
					return walletClient.signMessage({
						accountAddress,
						authToken,
						elevatedAccessToken,
						message,
						mfaToken,
						password,
						signedSessionId,
						traceContext: {
							startTime: effectiveStartTime,
							traceId
						}
					});
				}),
				operation: "internalSignMessage",
				resource: "walletClient.signMessage"
			});
		});
	}
	signMessage(message) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (!this.activeAccountAddress) throw new Error("Active account address is required");
			const traceId = this.generateTraceId();
			const startTime = Date.now();
			this.instrument("[signMessage] start", {
				key: "signMessage-start",
				startTime,
				time: 0,
				traceId
			});
			const signedMessage = yield this.walletUiUtils.signMessage({
				handler: () => __awaiter$1(this, void 0, void 0, function* () {
					return this.internalSignMessage(message, {
						parentTraceId: traceId,
						startTime
					});
				}),
				message,
				walletConnector: this
			});
			this.instrument("[signMessage] completed", {
				key: "signMessage-completed",
				startTime,
				time: Date.now() - startTime,
				traceId
			});
			return signedMessage;
		});
	}
	internalSignTransaction(transaction_1) {
		return __awaiter$1(this, arguments, void 0, function* (transaction, { parentTraceId, startTime, overrideBlockhash } = {}) {
			var _a, _b, _c;
			const traceId = parentTraceId || this.generateTraceId();
			const effectiveStartTime = startTime || Date.now();
			const txToSign = yield this.maybeSponsorTransaction(transaction);
			if (overrideBlockhash) if (isVersionedTransaction$1(txToSign)) txToSign.message.recentBlockhash = overrideBlockhash.blockhash;
			else {
				txToSign.recentBlockhash = overrideBlockhash.blockhash;
				txToSign.lastValidBlockHeight = overrideBlockhash.lastValidBlockHeight;
			}
			const walletClient = yield this.instrumentAsync({
				context: {
					chainName: "SVM",
					startTime: effectiveStartTime,
					traceId
				},
				fn: () => __awaiter$1(this, void 0, void 0, function* () {
					return this.getWaasWalletClient();
				}),
				operation: "internalSignTransaction",
				resource: "getWaasWalletClient"
			});
			const signedSessionId = yield (_a = this.getSignedSessionId) === null || _a === void 0 ? void 0 : _a.call(this);
			if (!signedSessionId) throw new DynamicError("Signed session ID is required");
			if (!this.activeAccountAddress) throw new Error("Active account address is required");
			const mfaToken = yield (_b = this.getMfaToken) === null || _b === void 0 ? void 0 : _b.call(this, { mfaAction: MFAAction.WalletWaasSign });
			const elevatedAccessToken = yield (_c = this.getElevatedAccessToken) === null || _c === void 0 ? void 0 : _c.call(this, { scope: TokenScope.Walletsign });
			const password = yield this.getPasswordIfNeeded({ accountAddress: this.activeAccountAddress });
			const isVersionedSolanaTransaction = isVersionedTransaction$1(txToSign);
			const messageBytes = isVersionedSolanaTransaction ? txToSign.message.serialize() : txToSign.serializeMessage();
			const messageToSign = Buffer.from(messageBytes).toString("hex");
			const chainId = yield this.getNetwork(true);
			const senderAddress = this.activeAccountAddress;
			const signature = yield this.instrumentAsync({
				context: {
					chainName: "SVM",
					startTime: effectiveStartTime,
					traceId
				},
				fn: () => __awaiter$1(this, void 0, void 0, function* () {
					var _d;
					return walletClient.signTransaction({
						authToken: (_d = this.getAuthToken) === null || _d === void 0 ? void 0 : _d.call(this),
						chainId,
						elevatedAccessToken,
						mfaToken,
						password,
						senderAddress,
						signedSessionId,
						traceContext: {
							startTime: effectiveStartTime,
							traceId
						},
						transaction: messageToSign
					});
				}),
				operation: "internalSignTransaction",
				resource: "signTransaction"
			});
			txToSign.addSignature(new PublicKey(this.activeAccountAddress), Buffer.from(signature, "hex"));
			if (!isVersionedSolanaTransaction) try {
				txToSign.serialize({
					requireAllSignatures: false,
					verifySignatures: true
				});
			} catch (err) {
				logger.warn("[internalSignTransaction] Signature verification failed for legacy Transaction", err);
			}
			return txToSign;
		});
	}
	signTransaction(transaction) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (!this.activeAccountAddress) throw new Error("Active account address is required");
			const traceId = this.generateTraceId();
			const startTime = Date.now();
			this.instrument("[signTransaction] start", {
				key: "signTransaction-start",
				startTime,
				time: 0,
				traceId
			});
			const uiTransaction = new SolanaUiTransaction({
				connection: this.getWalletClient(),
				from: this.activeAccountAddress,
				multipleTransactions: [transaction],
				onSubmit: () => __awaiter$1(this, void 0, void 0, function* () {
					return this.internalSignTransaction(transaction, {
						parentTraceId: traceId,
						startTime
					});
				})
			});
			const signedTransaction = yield this.walletUiUtils.signTransaction(this, uiTransaction);
			this.instrument("[signTransaction] completed", {
				key: "signTransaction-completed",
				startTime,
				time: Date.now() - startTime,
				traceId
			});
			return signedTransaction;
		});
	}
	internalSignAllTransactions(transactions) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (!this.activeAccountAddress) throw new Error("Active account address is required");
			const signedTransactions = [];
			for (const transaction of transactions) {
				const signedTx = yield this.internalSignTransaction(transaction);
				signedTransactions.push(signedTx);
			}
			return signedTransactions;
		});
	}
	signAllTransactions(transactions) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (!this.activeAccountAddress) throw new Error("Active account address is required");
			const traceId = this.generateTraceId();
			const startTime = Date.now();
			this.instrument("[signAllTransactions] start", {
				key: "signAllTransactions-start",
				startTime,
				time: 0,
				traceId
			});
			const uiTransaction = new SolanaUiTransaction({
				connection: this.getWalletClient(),
				from: this.activeAccountAddress,
				multipleTransactions: transactions,
				onSubmit: () => __awaiter$1(this, void 0, void 0, function* () {
					return this.internalSignAllTransactions(transactions);
				})
			});
			const signedTransactions = yield this.walletUiUtils.signTransaction(this, uiTransaction);
			this.instrument("[signAllTransactions] completed", {
				key: "signAllTransactions-completed",
				startTime,
				time: Date.now() - startTime,
				traceId
			});
			return signedTransactions;
		});
	}
	internalSignAndSendTransaction(transaction_1, options_1) {
		return __awaiter$1(this, arguments, void 0, function* (transaction, options, { parentTraceId, startTime } = {}) {
			var _a;
			const traceId = parentTraceId || this.generateTraceId();
			const effectiveStartTime = startTime || Date.now();
			if (!this.activeAccountAddress) throw new Error("Active account address is required");
			const connection = this.getWalletClient();
			const { blockhash, lastValidBlockHeight } = yield connection.getLatestBlockhash("finalized");
			const signedTransaction = yield this.instrumentAsync({
				context: {
					chainName: "SVM",
					startTime: effectiveStartTime,
					traceId
				},
				fn: () => __awaiter$1(this, void 0, void 0, function* () {
					return this.internalSignTransaction(transaction, {
						overrideBlockhash: {
							blockhash,
							lastValidBlockHeight
						},
						parentTraceId: traceId,
						startTime: effectiveStartTime
					});
				}),
				operation: "internalSignAndSendTransaction",
				resource: "internalSignTransaction"
			});
			const serializedTransaction = !isVersionedTransaction$1(signedTransaction) ? signedTransaction.serialize({
				requireAllSignatures: false,
				verifySignatures: true
			}) : signedTransaction.serialize();
			const signature = yield this.instrumentAsync({
				context: {
					chainName: "SVM",
					rpcUrl: connection.rpcEndpoint,
					startTime: effectiveStartTime,
					traceId
				},
				fn: () => __awaiter$1(this, void 0, void 0, function* () {
					return connection.sendRawTransaction(serializedTransaction, options);
				}),
				operation: "internalSignAndSendTransaction",
				resource: "sendRawTransaction"
			});
			const confirmationStartTime = Date.now();
			try {
				const confirmationResult = yield connection.confirmTransaction({
					blockhash,
					lastValidBlockHeight,
					signature
				}, (_a = options === null || options === void 0 ? void 0 : options.preflightCommitment) !== null && _a !== void 0 ? _a : "confirmed");
				const confirmationEndTime = Date.now();
				const confirmationStepElapsed = confirmationEndTime - confirmationStartTime;
				const confirmationTotalElapsed = confirmationEndTime - effectiveStartTime;
				if (confirmationResult.value.err) {
					logger.error(`[internalSignAndSendTransaction] Transaction failed - total: ${confirmationTotalElapsed}ms, step: ${confirmationStepElapsed}ms`, {
						accountAddress: this.activeAccountAddress,
						error: confirmationResult.value.err,
						key: "internalSignAndSendTransaction-transactionFailed",
						rpcUrl: connection.rpcEndpoint,
						stepTime: confirmationStepElapsed,
						time: confirmationTotalElapsed,
						traceId
					});
					throw new TransactionFailedError(confirmationResult.value.err);
				}
				this.instrument(`[internalSignAndSendTransaction] Transaction confirmed - total: ${confirmationTotalElapsed}ms, step: ${confirmationStepElapsed}ms`, {
					key: "internalSignAndSendTransaction-transactionSuccess",
					rpcUrl: connection.rpcEndpoint,
					stepTime: confirmationStepElapsed,
					time: confirmationTotalElapsed,
					traceId
				});
			} catch (error) {
				if (error instanceof TransactionFailedError) throw error;
				const timeoutTotalElapsed = Date.now() - confirmationStartTime;
				logger.error(`[internalSignAndSendTransaction] Confirmation timed out - total: ${timeoutTotalElapsed}ms`, {
					accountAddress: this.activeAccountAddress,
					error,
					key: "internalSignAndSendTransaction-confirmationTimedOut",
					rpcUrl: connection.rpcEndpoint,
					signature,
					time: timeoutTotalElapsed,
					traceId
				});
				throw new TransactionConfirmationTimeoutError(signature);
			}
			return signature;
		});
	}
	signAndSendTransaction(transaction, options) {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (!this.activeAccountAddress) throw new Error("Active account address is required");
			const traceId = this.generateTraceId();
			const startTime = Date.now();
			this.instrument("[signAndSendTransaction] start", {
				key: "signAndSendTransaction-start",
				options,
				startTime,
				time: 0,
				traceId
			});
			const uiTransaction = new SolanaUiTransaction({
				connection: this.getWalletClient(),
				from: this.activeAccountAddress,
				multipleTransactions: [transaction],
				onSubmit: () => __awaiter$1(this, void 0, void 0, function* () {
					return this.internalSignAndSendTransaction(transaction, options, {
						parentTraceId: traceId,
						startTime
					});
				})
			});
			const result = yield this.walletUiUtils.sendTransaction(this, uiTransaction);
			this.instrument("[signAndSendTransaction] completed", {
				key: "signAndSendTransaction-completed",
				startTime,
				time: Date.now() - startTime,
				traceId
			});
			return result;
		});
	}
	getSigner() {
		return __awaiter$1(this, void 0, void 0, function* () {
			return new DynamicWaasSVMSigner({ walletConnector: this });
		});
	}
	getWalletClientByAddress({ accountAddress }) {
		this.setActiveAccountAddress(accountAddress);
		return this.getWalletClient();
	}
	exportClientKeyshares(_a) {
		const _super = Object.create(null, { exportClientKeyshares: { get: () => super.exportClientKeyshares } });
		return __awaiter$1(this, arguments, void 0, function* ({ accountAddress, password }) {
			const targetAccountAddress = accountAddress || this.activeAccountAddress;
			if (!targetAccountAddress) throw new Error("Account address is required");
			const traceId = this.generateTraceId();
			const startTime = Date.now();
			this.instrument("[exportClientKeyshares] start", {
				key: "exportClientKeyshares-start",
				startTime,
				time: 0,
				traceId
			});
			const result = yield _super.exportClientKeyshares.call(this, {
				accountAddress: targetAccountAddress,
				password
			});
			this.instrument("[exportClientKeyshares] completed", {
				key: "exportClientKeyshares-completed",
				startTime,
				time: Date.now() - startTime,
				traceId
			});
			return result;
		});
	}
	createUiTransaction(from) {
		return __awaiter$1(this, void 0, void 0, function* () {
			yield this.validateActiveWallet(from);
			return new SolanaUiTransaction({
				connection: this.getWalletClient(),
				from,
				onSubmit: (transaction) => __awaiter$1(this, void 0, void 0, function* () {
					if (!transaction) return void 0;
					return this.internalSignAndSendTransaction(transaction);
				})
			});
		});
	}
	signMessageWithContext() {
		return __awaiter$1(this, void 0, void 0, function* () {
			throw new Error("Not implemented");
		});
	}
};
Object.defineProperty(DynamicWaasSVMConnector, "key", {
	value: "dynamicwaas",
	writable: false
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+waas-svm@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_f_2bb416435e077540d4371a6bed4b0554/node_modules/@dynamic-labs/waas-svm/src/DynamicWaasSvmConnectors.js
var DynamicWaasSVMConnectors = () => [DynamicWaasSVMConnector];
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/PhantomInjected/PhantomInjected.js
var PhantomInjected = class extends InjectedWalletBase {
	constructor() {
		super(...arguments);
		this.name = "Phantom";
		this.overrideKey = "phantom";
	}
	getAddress() {
		const _super = Object.create(null, { getAddress: { get: () => super.getAddress } });
		return __awaiter$3(this, void 0, void 0, function* () {
			if (this.isInstalledOnBrowser()) return _super.getAddress.call(this);
			if (isMobile()) handleMobileWalletRedirect({
				nativeLink: "phantom://browse",
				universalLink: "https://phantom.app/ul/browse"
			});
		});
	}
	canGetChainAddress() {
		var _a, _b;
		return ((_b = (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.findProvider()) === null || _b === void 0 ? void 0 : _b.publicKey) !== null;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/phantomRedirect/buildUrl/buildUrl.js
var import_nacl_fast = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(nacl) {
		"use strict";
		var gf = function(init) {
			var i, r = new Float64Array(16);
			if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
			return r;
		};
		var randombytes = function() {
			throw new Error("no PRNG");
		};
		var _0 = new Uint8Array(16);
		var _9 = new Uint8Array(32);
		_9[0] = 9;
		var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([
			30883,
			4953,
			19914,
			30187,
			55467,
			16705,
			2637,
			112,
			59544,
			30585,
			16505,
			36039,
			65139,
			11119,
			27886,
			20995
		]), D2 = gf([
			61785,
			9906,
			39828,
			60374,
			45398,
			33411,
			5274,
			224,
			53552,
			61171,
			33010,
			6542,
			64743,
			22239,
			55772,
			9222
		]), X = gf([
			54554,
			36645,
			11616,
			51542,
			42930,
			38181,
			51040,
			26924,
			56412,
			64982,
			57905,
			49316,
			21502,
			52590,
			14035,
			8553
		]), Y = gf([
			26200,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214
		]), I = gf([
			41136,
			18958,
			6951,
			50414,
			58488,
			44335,
			6150,
			12099,
			55207,
			15867,
			153,
			11085,
			57099,
			20417,
			9344,
			11139
		]);
		function ts64(x, i, h, l) {
			x[i] = h >> 24 & 255;
			x[i + 1] = h >> 16 & 255;
			x[i + 2] = h >> 8 & 255;
			x[i + 3] = h & 255;
			x[i + 4] = l >> 24 & 255;
			x[i + 5] = l >> 16 & 255;
			x[i + 6] = l >> 8 & 255;
			x[i + 7] = l & 255;
		}
		function vn(x, xi, y, yi, n) {
			var i, d = 0;
			for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
			return (1 & d - 1 >>> 8) - 1;
		}
		function crypto_verify_16(x, xi, y, yi) {
			return vn(x, xi, y, yi, 16);
		}
		function crypto_verify_32(x, xi, y, yi) {
			return vn(x, xi, y, yi, 32);
		}
		function core_salsa20(o, p, k, c) {
			var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
			var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
			for (var i = 0; i < 20; i += 2) {
				u = x0 + x12 | 0;
				x4 ^= u << 7 | u >>> 25;
				u = x4 + x0 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x4 | 0;
				x12 ^= u << 13 | u >>> 19;
				u = x12 + x8 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x1 | 0;
				x9 ^= u << 7 | u >>> 25;
				u = x9 + x5 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x9 | 0;
				x1 ^= u << 13 | u >>> 19;
				u = x1 + x13 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x6 | 0;
				x14 ^= u << 7 | u >>> 25;
				u = x14 + x10 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x14 | 0;
				x6 ^= u << 13 | u >>> 19;
				u = x6 + x2 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x11 | 0;
				x3 ^= u << 7 | u >>> 25;
				u = x3 + x15 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x3 | 0;
				x11 ^= u << 13 | u >>> 19;
				u = x11 + x7 | 0;
				x15 ^= u << 18 | u >>> 14;
				u = x0 + x3 | 0;
				x1 ^= u << 7 | u >>> 25;
				u = x1 + x0 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x1 | 0;
				x3 ^= u << 13 | u >>> 19;
				u = x3 + x2 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x4 | 0;
				x6 ^= u << 7 | u >>> 25;
				u = x6 + x5 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x6 | 0;
				x4 ^= u << 13 | u >>> 19;
				u = x4 + x7 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x9 | 0;
				x11 ^= u << 7 | u >>> 25;
				u = x11 + x10 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x11 | 0;
				x9 ^= u << 13 | u >>> 19;
				u = x9 + x8 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x14 | 0;
				x12 ^= u << 7 | u >>> 25;
				u = x12 + x15 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x12 | 0;
				x14 ^= u << 13 | u >>> 19;
				u = x14 + x13 | 0;
				x15 ^= u << 18 | u >>> 14;
			}
			x0 = x0 + j0 | 0;
			x1 = x1 + j1 | 0;
			x2 = x2 + j2 | 0;
			x3 = x3 + j3 | 0;
			x4 = x4 + j4 | 0;
			x5 = x5 + j5 | 0;
			x6 = x6 + j6 | 0;
			x7 = x7 + j7 | 0;
			x8 = x8 + j8 | 0;
			x9 = x9 + j9 | 0;
			x10 = x10 + j10 | 0;
			x11 = x11 + j11 | 0;
			x12 = x12 + j12 | 0;
			x13 = x13 + j13 | 0;
			x14 = x14 + j14 | 0;
			x15 = x15 + j15 | 0;
			o[0] = x0 >>> 0 & 255;
			o[1] = x0 >>> 8 & 255;
			o[2] = x0 >>> 16 & 255;
			o[3] = x0 >>> 24 & 255;
			o[4] = x1 >>> 0 & 255;
			o[5] = x1 >>> 8 & 255;
			o[6] = x1 >>> 16 & 255;
			o[7] = x1 >>> 24 & 255;
			o[8] = x2 >>> 0 & 255;
			o[9] = x2 >>> 8 & 255;
			o[10] = x2 >>> 16 & 255;
			o[11] = x2 >>> 24 & 255;
			o[12] = x3 >>> 0 & 255;
			o[13] = x3 >>> 8 & 255;
			o[14] = x3 >>> 16 & 255;
			o[15] = x3 >>> 24 & 255;
			o[16] = x4 >>> 0 & 255;
			o[17] = x4 >>> 8 & 255;
			o[18] = x4 >>> 16 & 255;
			o[19] = x4 >>> 24 & 255;
			o[20] = x5 >>> 0 & 255;
			o[21] = x5 >>> 8 & 255;
			o[22] = x5 >>> 16 & 255;
			o[23] = x5 >>> 24 & 255;
			o[24] = x6 >>> 0 & 255;
			o[25] = x6 >>> 8 & 255;
			o[26] = x6 >>> 16 & 255;
			o[27] = x6 >>> 24 & 255;
			o[28] = x7 >>> 0 & 255;
			o[29] = x7 >>> 8 & 255;
			o[30] = x7 >>> 16 & 255;
			o[31] = x7 >>> 24 & 255;
			o[32] = x8 >>> 0 & 255;
			o[33] = x8 >>> 8 & 255;
			o[34] = x8 >>> 16 & 255;
			o[35] = x8 >>> 24 & 255;
			o[36] = x9 >>> 0 & 255;
			o[37] = x9 >>> 8 & 255;
			o[38] = x9 >>> 16 & 255;
			o[39] = x9 >>> 24 & 255;
			o[40] = x10 >>> 0 & 255;
			o[41] = x10 >>> 8 & 255;
			o[42] = x10 >>> 16 & 255;
			o[43] = x10 >>> 24 & 255;
			o[44] = x11 >>> 0 & 255;
			o[45] = x11 >>> 8 & 255;
			o[46] = x11 >>> 16 & 255;
			o[47] = x11 >>> 24 & 255;
			o[48] = x12 >>> 0 & 255;
			o[49] = x12 >>> 8 & 255;
			o[50] = x12 >>> 16 & 255;
			o[51] = x12 >>> 24 & 255;
			o[52] = x13 >>> 0 & 255;
			o[53] = x13 >>> 8 & 255;
			o[54] = x13 >>> 16 & 255;
			o[55] = x13 >>> 24 & 255;
			o[56] = x14 >>> 0 & 255;
			o[57] = x14 >>> 8 & 255;
			o[58] = x14 >>> 16 & 255;
			o[59] = x14 >>> 24 & 255;
			o[60] = x15 >>> 0 & 255;
			o[61] = x15 >>> 8 & 255;
			o[62] = x15 >>> 16 & 255;
			o[63] = x15 >>> 24 & 255;
		}
		function core_hsalsa20(o, p, k, c) {
			var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
			var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
			for (var i = 0; i < 20; i += 2) {
				u = x0 + x12 | 0;
				x4 ^= u << 7 | u >>> 25;
				u = x4 + x0 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x4 | 0;
				x12 ^= u << 13 | u >>> 19;
				u = x12 + x8 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x1 | 0;
				x9 ^= u << 7 | u >>> 25;
				u = x9 + x5 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x9 | 0;
				x1 ^= u << 13 | u >>> 19;
				u = x1 + x13 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x6 | 0;
				x14 ^= u << 7 | u >>> 25;
				u = x14 + x10 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x14 | 0;
				x6 ^= u << 13 | u >>> 19;
				u = x6 + x2 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x11 | 0;
				x3 ^= u << 7 | u >>> 25;
				u = x3 + x15 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x3 | 0;
				x11 ^= u << 13 | u >>> 19;
				u = x11 + x7 | 0;
				x15 ^= u << 18 | u >>> 14;
				u = x0 + x3 | 0;
				x1 ^= u << 7 | u >>> 25;
				u = x1 + x0 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x1 | 0;
				x3 ^= u << 13 | u >>> 19;
				u = x3 + x2 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x4 | 0;
				x6 ^= u << 7 | u >>> 25;
				u = x6 + x5 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x6 | 0;
				x4 ^= u << 13 | u >>> 19;
				u = x4 + x7 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x9 | 0;
				x11 ^= u << 7 | u >>> 25;
				u = x11 + x10 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x11 | 0;
				x9 ^= u << 13 | u >>> 19;
				u = x9 + x8 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x14 | 0;
				x12 ^= u << 7 | u >>> 25;
				u = x12 + x15 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x12 | 0;
				x14 ^= u << 13 | u >>> 19;
				u = x14 + x13 | 0;
				x15 ^= u << 18 | u >>> 14;
			}
			o[0] = x0 >>> 0 & 255;
			o[1] = x0 >>> 8 & 255;
			o[2] = x0 >>> 16 & 255;
			o[3] = x0 >>> 24 & 255;
			o[4] = x5 >>> 0 & 255;
			o[5] = x5 >>> 8 & 255;
			o[6] = x5 >>> 16 & 255;
			o[7] = x5 >>> 24 & 255;
			o[8] = x10 >>> 0 & 255;
			o[9] = x10 >>> 8 & 255;
			o[10] = x10 >>> 16 & 255;
			o[11] = x10 >>> 24 & 255;
			o[12] = x15 >>> 0 & 255;
			o[13] = x15 >>> 8 & 255;
			o[14] = x15 >>> 16 & 255;
			o[15] = x15 >>> 24 & 255;
			o[16] = x6 >>> 0 & 255;
			o[17] = x6 >>> 8 & 255;
			o[18] = x6 >>> 16 & 255;
			o[19] = x6 >>> 24 & 255;
			o[20] = x7 >>> 0 & 255;
			o[21] = x7 >>> 8 & 255;
			o[22] = x7 >>> 16 & 255;
			o[23] = x7 >>> 24 & 255;
			o[24] = x8 >>> 0 & 255;
			o[25] = x8 >>> 8 & 255;
			o[26] = x8 >>> 16 & 255;
			o[27] = x8 >>> 24 & 255;
			o[28] = x9 >>> 0 & 255;
			o[29] = x9 >>> 8 & 255;
			o[30] = x9 >>> 16 & 255;
			o[31] = x9 >>> 24 & 255;
		}
		function crypto_core_salsa20(out, inp, k, c) {
			core_salsa20(out, inp, k, c);
		}
		function crypto_core_hsalsa20(out, inp, k, c) {
			core_hsalsa20(out, inp, k, c);
		}
		var sigma = new Uint8Array([
			101,
			120,
			112,
			97,
			110,
			100,
			32,
			51,
			50,
			45,
			98,
			121,
			116,
			101,
			32,
			107
		]);
		function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
			var z = new Uint8Array(16), x = new Uint8Array(64);
			var u, i;
			for (i = 0; i < 16; i++) z[i] = 0;
			for (i = 0; i < 8; i++) z[i] = n[i];
			while (b >= 64) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
				u = 1;
				for (i = 8; i < 16; i++) {
					u = u + (z[i] & 255) | 0;
					z[i] = u & 255;
					u >>>= 8;
				}
				b -= 64;
				cpos += 64;
				mpos += 64;
			}
			if (b > 0) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
			}
			return 0;
		}
		function crypto_stream_salsa20(c, cpos, b, n, k) {
			var z = new Uint8Array(16), x = new Uint8Array(64);
			var u, i;
			for (i = 0; i < 16; i++) z[i] = 0;
			for (i = 0; i < 8; i++) z[i] = n[i];
			while (b >= 64) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < 64; i++) c[cpos + i] = x[i];
				u = 1;
				for (i = 8; i < 16; i++) {
					u = u + (z[i] & 255) | 0;
					z[i] = u & 255;
					u >>>= 8;
				}
				b -= 64;
				cpos += 64;
			}
			if (b > 0) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < b; i++) c[cpos + i] = x[i];
			}
			return 0;
		}
		function crypto_stream(c, cpos, d, n, k) {
			var s = new Uint8Array(32);
			crypto_core_hsalsa20(s, n, k, sigma);
			var sn = new Uint8Array(8);
			for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
			return crypto_stream_salsa20(c, cpos, d, sn, s);
		}
		function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
			var s = new Uint8Array(32);
			crypto_core_hsalsa20(s, n, k, sigma);
			var sn = new Uint8Array(8);
			for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
			return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
		}
		var poly1305 = function(key) {
			this.buffer = new Uint8Array(16);
			this.r = new Uint16Array(10);
			this.h = new Uint16Array(10);
			this.pad = new Uint16Array(8);
			this.leftover = 0;
			this.fin = 0;
			var t0 = key[0] & 255 | (key[1] & 255) << 8, t1, t2, t3, t4, t5, t6, t7;
			this.r[0] = t0 & 8191;
			t1 = key[2] & 255 | (key[3] & 255) << 8;
			this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
			t2 = key[4] & 255 | (key[5] & 255) << 8;
			this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
			t3 = key[6] & 255 | (key[7] & 255) << 8;
			this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
			t4 = key[8] & 255 | (key[9] & 255) << 8;
			this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
			this.r[5] = t4 >>> 1 & 8190;
			t5 = key[10] & 255 | (key[11] & 255) << 8;
			this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
			t6 = key[12] & 255 | (key[13] & 255) << 8;
			this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
			t7 = key[14] & 255 | (key[15] & 255) << 8;
			this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
			this.r[9] = t7 >>> 5 & 127;
			this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
			this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
			this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
			this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
			this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
			this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
			this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
			this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
		};
		poly1305.prototype.blocks = function(m, mpos, bytes) {
			var hibit = this.fin ? 0 : 2048;
			var t0, t1, t2, t3, t4, t5, t6, t7, c;
			var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
			var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
			var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
			while (bytes >= 16) {
				t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
				h0 += t0 & 8191;
				t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
				h1 += (t0 >>> 13 | t1 << 3) & 8191;
				t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
				h2 += (t1 >>> 10 | t2 << 6) & 8191;
				t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
				h3 += (t2 >>> 7 | t3 << 9) & 8191;
				t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
				h4 += (t3 >>> 4 | t4 << 12) & 8191;
				h5 += t4 >>> 1 & 8191;
				t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
				h6 += (t4 >>> 14 | t5 << 2) & 8191;
				t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
				h7 += (t5 >>> 11 | t6 << 5) & 8191;
				t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
				h8 += (t6 >>> 8 | t7 << 8) & 8191;
				h9 += t7 >>> 5 | hibit;
				c = 0;
				d0 = c;
				d0 += h0 * r0;
				d0 += h1 * (5 * r9);
				d0 += h2 * (5 * r8);
				d0 += h3 * (5 * r7);
				d0 += h4 * (5 * r6);
				c = d0 >>> 13;
				d0 &= 8191;
				d0 += h5 * (5 * r5);
				d0 += h6 * (5 * r4);
				d0 += h7 * (5 * r3);
				d0 += h8 * (5 * r2);
				d0 += h9 * (5 * r1);
				c += d0 >>> 13;
				d0 &= 8191;
				d1 = c;
				d1 += h0 * r1;
				d1 += h1 * r0;
				d1 += h2 * (5 * r9);
				d1 += h3 * (5 * r8);
				d1 += h4 * (5 * r7);
				c = d1 >>> 13;
				d1 &= 8191;
				d1 += h5 * (5 * r6);
				d1 += h6 * (5 * r5);
				d1 += h7 * (5 * r4);
				d1 += h8 * (5 * r3);
				d1 += h9 * (5 * r2);
				c += d1 >>> 13;
				d1 &= 8191;
				d2 = c;
				d2 += h0 * r2;
				d2 += h1 * r1;
				d2 += h2 * r0;
				d2 += h3 * (5 * r9);
				d2 += h4 * (5 * r8);
				c = d2 >>> 13;
				d2 &= 8191;
				d2 += h5 * (5 * r7);
				d2 += h6 * (5 * r6);
				d2 += h7 * (5 * r5);
				d2 += h8 * (5 * r4);
				d2 += h9 * (5 * r3);
				c += d2 >>> 13;
				d2 &= 8191;
				d3 = c;
				d3 += h0 * r3;
				d3 += h1 * r2;
				d3 += h2 * r1;
				d3 += h3 * r0;
				d3 += h4 * (5 * r9);
				c = d3 >>> 13;
				d3 &= 8191;
				d3 += h5 * (5 * r8);
				d3 += h6 * (5 * r7);
				d3 += h7 * (5 * r6);
				d3 += h8 * (5 * r5);
				d3 += h9 * (5 * r4);
				c += d3 >>> 13;
				d3 &= 8191;
				d4 = c;
				d4 += h0 * r4;
				d4 += h1 * r3;
				d4 += h2 * r2;
				d4 += h3 * r1;
				d4 += h4 * r0;
				c = d4 >>> 13;
				d4 &= 8191;
				d4 += h5 * (5 * r9);
				d4 += h6 * (5 * r8);
				d4 += h7 * (5 * r7);
				d4 += h8 * (5 * r6);
				d4 += h9 * (5 * r5);
				c += d4 >>> 13;
				d4 &= 8191;
				d5 = c;
				d5 += h0 * r5;
				d5 += h1 * r4;
				d5 += h2 * r3;
				d5 += h3 * r2;
				d5 += h4 * r1;
				c = d5 >>> 13;
				d5 &= 8191;
				d5 += h5 * r0;
				d5 += h6 * (5 * r9);
				d5 += h7 * (5 * r8);
				d5 += h8 * (5 * r7);
				d5 += h9 * (5 * r6);
				c += d5 >>> 13;
				d5 &= 8191;
				d6 = c;
				d6 += h0 * r6;
				d6 += h1 * r5;
				d6 += h2 * r4;
				d6 += h3 * r3;
				d6 += h4 * r2;
				c = d6 >>> 13;
				d6 &= 8191;
				d6 += h5 * r1;
				d6 += h6 * r0;
				d6 += h7 * (5 * r9);
				d6 += h8 * (5 * r8);
				d6 += h9 * (5 * r7);
				c += d6 >>> 13;
				d6 &= 8191;
				d7 = c;
				d7 += h0 * r7;
				d7 += h1 * r6;
				d7 += h2 * r5;
				d7 += h3 * r4;
				d7 += h4 * r3;
				c = d7 >>> 13;
				d7 &= 8191;
				d7 += h5 * r2;
				d7 += h6 * r1;
				d7 += h7 * r0;
				d7 += h8 * (5 * r9);
				d7 += h9 * (5 * r8);
				c += d7 >>> 13;
				d7 &= 8191;
				d8 = c;
				d8 += h0 * r8;
				d8 += h1 * r7;
				d8 += h2 * r6;
				d8 += h3 * r5;
				d8 += h4 * r4;
				c = d8 >>> 13;
				d8 &= 8191;
				d8 += h5 * r3;
				d8 += h6 * r2;
				d8 += h7 * r1;
				d8 += h8 * r0;
				d8 += h9 * (5 * r9);
				c += d8 >>> 13;
				d8 &= 8191;
				d9 = c;
				d9 += h0 * r9;
				d9 += h1 * r8;
				d9 += h2 * r7;
				d9 += h3 * r6;
				d9 += h4 * r5;
				c = d9 >>> 13;
				d9 &= 8191;
				d9 += h5 * r4;
				d9 += h6 * r3;
				d9 += h7 * r2;
				d9 += h8 * r1;
				d9 += h9 * r0;
				c += d9 >>> 13;
				d9 &= 8191;
				c = (c << 2) + c | 0;
				c = c + d0 | 0;
				d0 = c & 8191;
				c = c >>> 13;
				d1 += c;
				h0 = d0;
				h1 = d1;
				h2 = d2;
				h3 = d3;
				h4 = d4;
				h5 = d5;
				h6 = d6;
				h7 = d7;
				h8 = d8;
				h9 = d9;
				mpos += 16;
				bytes -= 16;
			}
			this.h[0] = h0;
			this.h[1] = h1;
			this.h[2] = h2;
			this.h[3] = h3;
			this.h[4] = h4;
			this.h[5] = h5;
			this.h[6] = h6;
			this.h[7] = h7;
			this.h[8] = h8;
			this.h[9] = h9;
		};
		poly1305.prototype.finish = function(mac, macpos) {
			var g = new Uint16Array(10);
			var c, mask, f, i;
			if (this.leftover) {
				i = this.leftover;
				this.buffer[i++] = 1;
				for (; i < 16; i++) this.buffer[i] = 0;
				this.fin = 1;
				this.blocks(this.buffer, 0, 16);
			}
			c = this.h[1] >>> 13;
			this.h[1] &= 8191;
			for (i = 2; i < 10; i++) {
				this.h[i] += c;
				c = this.h[i] >>> 13;
				this.h[i] &= 8191;
			}
			this.h[0] += c * 5;
			c = this.h[0] >>> 13;
			this.h[0] &= 8191;
			this.h[1] += c;
			c = this.h[1] >>> 13;
			this.h[1] &= 8191;
			this.h[2] += c;
			g[0] = this.h[0] + 5;
			c = g[0] >>> 13;
			g[0] &= 8191;
			for (i = 1; i < 10; i++) {
				g[i] = this.h[i] + c;
				c = g[i] >>> 13;
				g[i] &= 8191;
			}
			g[9] -= 8192;
			mask = (c ^ 1) - 1;
			for (i = 0; i < 10; i++) g[i] &= mask;
			mask = ~mask;
			for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
			this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
			this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
			this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
			this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
			this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
			this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
			this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
			this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
			f = this.h[0] + this.pad[0];
			this.h[0] = f & 65535;
			for (i = 1; i < 8; i++) {
				f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
				this.h[i] = f & 65535;
			}
			mac[macpos + 0] = this.h[0] >>> 0 & 255;
			mac[macpos + 1] = this.h[0] >>> 8 & 255;
			mac[macpos + 2] = this.h[1] >>> 0 & 255;
			mac[macpos + 3] = this.h[1] >>> 8 & 255;
			mac[macpos + 4] = this.h[2] >>> 0 & 255;
			mac[macpos + 5] = this.h[2] >>> 8 & 255;
			mac[macpos + 6] = this.h[3] >>> 0 & 255;
			mac[macpos + 7] = this.h[3] >>> 8 & 255;
			mac[macpos + 8] = this.h[4] >>> 0 & 255;
			mac[macpos + 9] = this.h[4] >>> 8 & 255;
			mac[macpos + 10] = this.h[5] >>> 0 & 255;
			mac[macpos + 11] = this.h[5] >>> 8 & 255;
			mac[macpos + 12] = this.h[6] >>> 0 & 255;
			mac[macpos + 13] = this.h[6] >>> 8 & 255;
			mac[macpos + 14] = this.h[7] >>> 0 & 255;
			mac[macpos + 15] = this.h[7] >>> 8 & 255;
		};
		poly1305.prototype.update = function(m, mpos, bytes) {
			var i, want;
			if (this.leftover) {
				want = 16 - this.leftover;
				if (want > bytes) want = bytes;
				for (i = 0; i < want; i++) this.buffer[this.leftover + i] = m[mpos + i];
				bytes -= want;
				mpos += want;
				this.leftover += want;
				if (this.leftover < 16) return;
				this.blocks(this.buffer, 0, 16);
				this.leftover = 0;
			}
			if (bytes >= 16) {
				want = bytes - bytes % 16;
				this.blocks(m, mpos, want);
				mpos += want;
				bytes -= want;
			}
			if (bytes) {
				for (i = 0; i < bytes; i++) this.buffer[this.leftover + i] = m[mpos + i];
				this.leftover += bytes;
			}
		};
		function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
			var s = new poly1305(k);
			s.update(m, mpos, n);
			s.finish(out, outpos);
			return 0;
		}
		function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
			var x = new Uint8Array(16);
			crypto_onetimeauth(x, 0, m, mpos, n, k);
			return crypto_verify_16(h, hpos, x, 0);
		}
		function crypto_secretbox(c, m, d, n, k) {
			var i;
			if (d < 32) return -1;
			crypto_stream_xor(c, 0, m, 0, d, n, k);
			crypto_onetimeauth(c, 16, c, 32, d - 32, c);
			for (i = 0; i < 16; i++) c[i] = 0;
			return 0;
		}
		function crypto_secretbox_open(m, c, d, n, k) {
			var i;
			var x = new Uint8Array(32);
			if (d < 32) return -1;
			crypto_stream(x, 0, 32, n, k);
			if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
			crypto_stream_xor(m, 0, c, 0, d, n, k);
			for (i = 0; i < 32; i++) m[i] = 0;
			return 0;
		}
		function set25519(r, a) {
			var i;
			for (i = 0; i < 16; i++) r[i] = a[i] | 0;
		}
		function car25519(o) {
			var i, v, c = 1;
			for (i = 0; i < 16; i++) {
				v = o[i] + c + 65535;
				c = Math.floor(v / 65536);
				o[i] = v - c * 65536;
			}
			o[0] += c - 1 + 37 * (c - 1);
		}
		function sel25519(p, q, b) {
			var t, c = ~(b - 1);
			for (var i = 0; i < 16; i++) {
				t = c & (p[i] ^ q[i]);
				p[i] ^= t;
				q[i] ^= t;
			}
		}
		function pack25519(o, n) {
			var i, j, b;
			var m = gf(), t = gf();
			for (i = 0; i < 16; i++) t[i] = n[i];
			car25519(t);
			car25519(t);
			car25519(t);
			for (j = 0; j < 2; j++) {
				m[0] = t[0] - 65517;
				for (i = 1; i < 15; i++) {
					m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
					m[i - 1] &= 65535;
				}
				m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
				b = m[15] >> 16 & 1;
				m[14] &= 65535;
				sel25519(t, m, 1 - b);
			}
			for (i = 0; i < 16; i++) {
				o[2 * i] = t[i] & 255;
				o[2 * i + 1] = t[i] >> 8;
			}
		}
		function neq25519(a, b) {
			var c = new Uint8Array(32), d = new Uint8Array(32);
			pack25519(c, a);
			pack25519(d, b);
			return crypto_verify_32(c, 0, d, 0);
		}
		function par25519(a) {
			var d = new Uint8Array(32);
			pack25519(d, a);
			return d[0] & 1;
		}
		function unpack25519(o, n) {
			var i;
			for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
			o[15] &= 32767;
		}
		function A(o, a, b) {
			for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
		}
		function Z(o, a, b) {
			for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
		}
		function M(o, a, b) {
			var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
			v = a[0];
			t0 += v * b0;
			t1 += v * b1;
			t2 += v * b2;
			t3 += v * b3;
			t4 += v * b4;
			t5 += v * b5;
			t6 += v * b6;
			t7 += v * b7;
			t8 += v * b8;
			t9 += v * b9;
			t10 += v * b10;
			t11 += v * b11;
			t12 += v * b12;
			t13 += v * b13;
			t14 += v * b14;
			t15 += v * b15;
			v = a[1];
			t1 += v * b0;
			t2 += v * b1;
			t3 += v * b2;
			t4 += v * b3;
			t5 += v * b4;
			t6 += v * b5;
			t7 += v * b6;
			t8 += v * b7;
			t9 += v * b8;
			t10 += v * b9;
			t11 += v * b10;
			t12 += v * b11;
			t13 += v * b12;
			t14 += v * b13;
			t15 += v * b14;
			t16 += v * b15;
			v = a[2];
			t2 += v * b0;
			t3 += v * b1;
			t4 += v * b2;
			t5 += v * b3;
			t6 += v * b4;
			t7 += v * b5;
			t8 += v * b6;
			t9 += v * b7;
			t10 += v * b8;
			t11 += v * b9;
			t12 += v * b10;
			t13 += v * b11;
			t14 += v * b12;
			t15 += v * b13;
			t16 += v * b14;
			t17 += v * b15;
			v = a[3];
			t3 += v * b0;
			t4 += v * b1;
			t5 += v * b2;
			t6 += v * b3;
			t7 += v * b4;
			t8 += v * b5;
			t9 += v * b6;
			t10 += v * b7;
			t11 += v * b8;
			t12 += v * b9;
			t13 += v * b10;
			t14 += v * b11;
			t15 += v * b12;
			t16 += v * b13;
			t17 += v * b14;
			t18 += v * b15;
			v = a[4];
			t4 += v * b0;
			t5 += v * b1;
			t6 += v * b2;
			t7 += v * b3;
			t8 += v * b4;
			t9 += v * b5;
			t10 += v * b6;
			t11 += v * b7;
			t12 += v * b8;
			t13 += v * b9;
			t14 += v * b10;
			t15 += v * b11;
			t16 += v * b12;
			t17 += v * b13;
			t18 += v * b14;
			t19 += v * b15;
			v = a[5];
			t5 += v * b0;
			t6 += v * b1;
			t7 += v * b2;
			t8 += v * b3;
			t9 += v * b4;
			t10 += v * b5;
			t11 += v * b6;
			t12 += v * b7;
			t13 += v * b8;
			t14 += v * b9;
			t15 += v * b10;
			t16 += v * b11;
			t17 += v * b12;
			t18 += v * b13;
			t19 += v * b14;
			t20 += v * b15;
			v = a[6];
			t6 += v * b0;
			t7 += v * b1;
			t8 += v * b2;
			t9 += v * b3;
			t10 += v * b4;
			t11 += v * b5;
			t12 += v * b6;
			t13 += v * b7;
			t14 += v * b8;
			t15 += v * b9;
			t16 += v * b10;
			t17 += v * b11;
			t18 += v * b12;
			t19 += v * b13;
			t20 += v * b14;
			t21 += v * b15;
			v = a[7];
			t7 += v * b0;
			t8 += v * b1;
			t9 += v * b2;
			t10 += v * b3;
			t11 += v * b4;
			t12 += v * b5;
			t13 += v * b6;
			t14 += v * b7;
			t15 += v * b8;
			t16 += v * b9;
			t17 += v * b10;
			t18 += v * b11;
			t19 += v * b12;
			t20 += v * b13;
			t21 += v * b14;
			t22 += v * b15;
			v = a[8];
			t8 += v * b0;
			t9 += v * b1;
			t10 += v * b2;
			t11 += v * b3;
			t12 += v * b4;
			t13 += v * b5;
			t14 += v * b6;
			t15 += v * b7;
			t16 += v * b8;
			t17 += v * b9;
			t18 += v * b10;
			t19 += v * b11;
			t20 += v * b12;
			t21 += v * b13;
			t22 += v * b14;
			t23 += v * b15;
			v = a[9];
			t9 += v * b0;
			t10 += v * b1;
			t11 += v * b2;
			t12 += v * b3;
			t13 += v * b4;
			t14 += v * b5;
			t15 += v * b6;
			t16 += v * b7;
			t17 += v * b8;
			t18 += v * b9;
			t19 += v * b10;
			t20 += v * b11;
			t21 += v * b12;
			t22 += v * b13;
			t23 += v * b14;
			t24 += v * b15;
			v = a[10];
			t10 += v * b0;
			t11 += v * b1;
			t12 += v * b2;
			t13 += v * b3;
			t14 += v * b4;
			t15 += v * b5;
			t16 += v * b6;
			t17 += v * b7;
			t18 += v * b8;
			t19 += v * b9;
			t20 += v * b10;
			t21 += v * b11;
			t22 += v * b12;
			t23 += v * b13;
			t24 += v * b14;
			t25 += v * b15;
			v = a[11];
			t11 += v * b0;
			t12 += v * b1;
			t13 += v * b2;
			t14 += v * b3;
			t15 += v * b4;
			t16 += v * b5;
			t17 += v * b6;
			t18 += v * b7;
			t19 += v * b8;
			t20 += v * b9;
			t21 += v * b10;
			t22 += v * b11;
			t23 += v * b12;
			t24 += v * b13;
			t25 += v * b14;
			t26 += v * b15;
			v = a[12];
			t12 += v * b0;
			t13 += v * b1;
			t14 += v * b2;
			t15 += v * b3;
			t16 += v * b4;
			t17 += v * b5;
			t18 += v * b6;
			t19 += v * b7;
			t20 += v * b8;
			t21 += v * b9;
			t22 += v * b10;
			t23 += v * b11;
			t24 += v * b12;
			t25 += v * b13;
			t26 += v * b14;
			t27 += v * b15;
			v = a[13];
			t13 += v * b0;
			t14 += v * b1;
			t15 += v * b2;
			t16 += v * b3;
			t17 += v * b4;
			t18 += v * b5;
			t19 += v * b6;
			t20 += v * b7;
			t21 += v * b8;
			t22 += v * b9;
			t23 += v * b10;
			t24 += v * b11;
			t25 += v * b12;
			t26 += v * b13;
			t27 += v * b14;
			t28 += v * b15;
			v = a[14];
			t14 += v * b0;
			t15 += v * b1;
			t16 += v * b2;
			t17 += v * b3;
			t18 += v * b4;
			t19 += v * b5;
			t20 += v * b6;
			t21 += v * b7;
			t22 += v * b8;
			t23 += v * b9;
			t24 += v * b10;
			t25 += v * b11;
			t26 += v * b12;
			t27 += v * b13;
			t28 += v * b14;
			t29 += v * b15;
			v = a[15];
			t15 += v * b0;
			t16 += v * b1;
			t17 += v * b2;
			t18 += v * b3;
			t19 += v * b4;
			t20 += v * b5;
			t21 += v * b6;
			t22 += v * b7;
			t23 += v * b8;
			t24 += v * b9;
			t25 += v * b10;
			t26 += v * b11;
			t27 += v * b12;
			t28 += v * b13;
			t29 += v * b14;
			t30 += v * b15;
			t0 += 38 * t16;
			t1 += 38 * t17;
			t2 += 38 * t18;
			t3 += 38 * t19;
			t4 += 38 * t20;
			t5 += 38 * t21;
			t6 += 38 * t22;
			t7 += 38 * t23;
			t8 += 38 * t24;
			t9 += 38 * t25;
			t10 += 38 * t26;
			t11 += 38 * t27;
			t12 += 38 * t28;
			t13 += 38 * t29;
			t14 += 38 * t30;
			c = 1;
			v = t0 + c + 65535;
			c = Math.floor(v / 65536);
			t0 = v - c * 65536;
			v = t1 + c + 65535;
			c = Math.floor(v / 65536);
			t1 = v - c * 65536;
			v = t2 + c + 65535;
			c = Math.floor(v / 65536);
			t2 = v - c * 65536;
			v = t3 + c + 65535;
			c = Math.floor(v / 65536);
			t3 = v - c * 65536;
			v = t4 + c + 65535;
			c = Math.floor(v / 65536);
			t4 = v - c * 65536;
			v = t5 + c + 65535;
			c = Math.floor(v / 65536);
			t5 = v - c * 65536;
			v = t6 + c + 65535;
			c = Math.floor(v / 65536);
			t6 = v - c * 65536;
			v = t7 + c + 65535;
			c = Math.floor(v / 65536);
			t7 = v - c * 65536;
			v = t8 + c + 65535;
			c = Math.floor(v / 65536);
			t8 = v - c * 65536;
			v = t9 + c + 65535;
			c = Math.floor(v / 65536);
			t9 = v - c * 65536;
			v = t10 + c + 65535;
			c = Math.floor(v / 65536);
			t10 = v - c * 65536;
			v = t11 + c + 65535;
			c = Math.floor(v / 65536);
			t11 = v - c * 65536;
			v = t12 + c + 65535;
			c = Math.floor(v / 65536);
			t12 = v - c * 65536;
			v = t13 + c + 65535;
			c = Math.floor(v / 65536);
			t13 = v - c * 65536;
			v = t14 + c + 65535;
			c = Math.floor(v / 65536);
			t14 = v - c * 65536;
			v = t15 + c + 65535;
			c = Math.floor(v / 65536);
			t15 = v - c * 65536;
			t0 += c - 1 + 37 * (c - 1);
			c = 1;
			v = t0 + c + 65535;
			c = Math.floor(v / 65536);
			t0 = v - c * 65536;
			v = t1 + c + 65535;
			c = Math.floor(v / 65536);
			t1 = v - c * 65536;
			v = t2 + c + 65535;
			c = Math.floor(v / 65536);
			t2 = v - c * 65536;
			v = t3 + c + 65535;
			c = Math.floor(v / 65536);
			t3 = v - c * 65536;
			v = t4 + c + 65535;
			c = Math.floor(v / 65536);
			t4 = v - c * 65536;
			v = t5 + c + 65535;
			c = Math.floor(v / 65536);
			t5 = v - c * 65536;
			v = t6 + c + 65535;
			c = Math.floor(v / 65536);
			t6 = v - c * 65536;
			v = t7 + c + 65535;
			c = Math.floor(v / 65536);
			t7 = v - c * 65536;
			v = t8 + c + 65535;
			c = Math.floor(v / 65536);
			t8 = v - c * 65536;
			v = t9 + c + 65535;
			c = Math.floor(v / 65536);
			t9 = v - c * 65536;
			v = t10 + c + 65535;
			c = Math.floor(v / 65536);
			t10 = v - c * 65536;
			v = t11 + c + 65535;
			c = Math.floor(v / 65536);
			t11 = v - c * 65536;
			v = t12 + c + 65535;
			c = Math.floor(v / 65536);
			t12 = v - c * 65536;
			v = t13 + c + 65535;
			c = Math.floor(v / 65536);
			t13 = v - c * 65536;
			v = t14 + c + 65535;
			c = Math.floor(v / 65536);
			t14 = v - c * 65536;
			v = t15 + c + 65535;
			c = Math.floor(v / 65536);
			t15 = v - c * 65536;
			t0 += c - 1 + 37 * (c - 1);
			o[0] = t0;
			o[1] = t1;
			o[2] = t2;
			o[3] = t3;
			o[4] = t4;
			o[5] = t5;
			o[6] = t6;
			o[7] = t7;
			o[8] = t8;
			o[9] = t9;
			o[10] = t10;
			o[11] = t11;
			o[12] = t12;
			o[13] = t13;
			o[14] = t14;
			o[15] = t15;
		}
		function S(o, a) {
			M(o, a, a);
		}
		function inv25519(o, i) {
			var c = gf();
			var a;
			for (a = 0; a < 16; a++) c[a] = i[a];
			for (a = 253; a >= 0; a--) {
				S(c, c);
				if (a !== 2 && a !== 4) M(c, c, i);
			}
			for (a = 0; a < 16; a++) o[a] = c[a];
		}
		function pow2523(o, i) {
			var c = gf();
			var a;
			for (a = 0; a < 16; a++) c[a] = i[a];
			for (a = 250; a >= 0; a--) {
				S(c, c);
				if (a !== 1) M(c, c, i);
			}
			for (a = 0; a < 16; a++) o[a] = c[a];
		}
		function crypto_scalarmult(q, n, p) {
			var z = new Uint8Array(32);
			var x = new Float64Array(80), r, i;
			var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
			for (i = 0; i < 31; i++) z[i] = n[i];
			z[31] = n[31] & 127 | 64;
			z[0] &= 248;
			unpack25519(x, p);
			for (i = 0; i < 16; i++) {
				b[i] = x[i];
				d[i] = a[i] = c[i] = 0;
			}
			a[0] = d[0] = 1;
			for (i = 254; i >= 0; --i) {
				r = z[i >>> 3] >>> (i & 7) & 1;
				sel25519(a, b, r);
				sel25519(c, d, r);
				A(e, a, c);
				Z(a, a, c);
				A(c, b, d);
				Z(b, b, d);
				S(d, e);
				S(f, a);
				M(a, c, a);
				M(c, b, e);
				A(e, a, c);
				Z(a, a, c);
				S(b, a);
				Z(c, d, f);
				M(a, c, _121665);
				A(a, a, d);
				M(c, c, a);
				M(a, d, f);
				M(d, b, x);
				S(b, e);
				sel25519(a, b, r);
				sel25519(c, d, r);
			}
			for (i = 0; i < 16; i++) {
				x[i + 16] = a[i];
				x[i + 32] = c[i];
				x[i + 48] = b[i];
				x[i + 64] = d[i];
			}
			var x32 = x.subarray(32);
			var x16 = x.subarray(16);
			inv25519(x32, x32);
			M(x16, x16, x32);
			pack25519(q, x16);
			return 0;
		}
		function crypto_scalarmult_base(q, n) {
			return crypto_scalarmult(q, n, _9);
		}
		function crypto_box_keypair(y, x) {
			randombytes(x, 32);
			return crypto_scalarmult_base(y, x);
		}
		function crypto_box_beforenm(k, y, x) {
			var s = new Uint8Array(32);
			crypto_scalarmult(s, x, y);
			return crypto_core_hsalsa20(k, _0, s, sigma);
		}
		var crypto_box_afternm = crypto_secretbox;
		var crypto_box_open_afternm = crypto_secretbox_open;
		function crypto_box(c, m, d, n, y, x) {
			var k = new Uint8Array(32);
			crypto_box_beforenm(k, y, x);
			return crypto_box_afternm(c, m, d, n, k);
		}
		function crypto_box_open(m, c, d, n, y, x) {
			var k = new Uint8Array(32);
			crypto_box_beforenm(k, y, x);
			return crypto_box_open_afternm(m, c, d, n, k);
		}
		var K = [
			1116352408,
			3609767458,
			1899447441,
			602891725,
			3049323471,
			3964484399,
			3921009573,
			2173295548,
			961987163,
			4081628472,
			1508970993,
			3053834265,
			2453635748,
			2937671579,
			2870763221,
			3664609560,
			3624381080,
			2734883394,
			310598401,
			1164996542,
			607225278,
			1323610764,
			1426881987,
			3590304994,
			1925078388,
			4068182383,
			2162078206,
			991336113,
			2614888103,
			633803317,
			3248222580,
			3479774868,
			3835390401,
			2666613458,
			4022224774,
			944711139,
			264347078,
			2341262773,
			604807628,
			2007800933,
			770255983,
			1495990901,
			1249150122,
			1856431235,
			1555081692,
			3175218132,
			1996064986,
			2198950837,
			2554220882,
			3999719339,
			2821834349,
			766784016,
			2952996808,
			2566594879,
			3210313671,
			3203337956,
			3336571891,
			1034457026,
			3584528711,
			2466948901,
			113926993,
			3758326383,
			338241895,
			168717936,
			666307205,
			1188179964,
			773529912,
			1546045734,
			1294757372,
			1522805485,
			1396182291,
			2643833823,
			1695183700,
			2343527390,
			1986661051,
			1014477480,
			2177026350,
			1206759142,
			2456956037,
			344077627,
			2730485921,
			1290863460,
			2820302411,
			3158454273,
			3259730800,
			3505952657,
			3345764771,
			106217008,
			3516065817,
			3606008344,
			3600352804,
			1432725776,
			4094571909,
			1467031594,
			275423344,
			851169720,
			430227734,
			3100823752,
			506948616,
			1363258195,
			659060556,
			3750685593,
			883997877,
			3785050280,
			958139571,
			3318307427,
			1322822218,
			3812723403,
			1537002063,
			2003034995,
			1747873779,
			3602036899,
			1955562222,
			1575990012,
			2024104815,
			1125592928,
			2227730452,
			2716904306,
			2361852424,
			442776044,
			2428436474,
			593698344,
			2756734187,
			3733110249,
			3204031479,
			2999351573,
			3329325298,
			3815920427,
			3391569614,
			3928383900,
			3515267271,
			566280711,
			3940187606,
			3454069534,
			4118630271,
			4000239992,
			116418474,
			1914138554,
			174292421,
			2731055270,
			289380356,
			3203993006,
			460393269,
			320620315,
			685471733,
			587496836,
			852142971,
			1086792851,
			1017036298,
			365543100,
			1126000580,
			2618297676,
			1288033470,
			3409855158,
			1501505948,
			4234509866,
			1607167915,
			987167468,
			1816402316,
			1246189591
		];
		function crypto_hashblocks_hl(hh, hl, m, n) {
			var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
			var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
			var pos = 0;
			while (n >= 128) {
				for (i = 0; i < 16; i++) {
					j = 8 * i + pos;
					wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
					wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
				}
				for (i = 0; i < 80; i++) {
					bh0 = ah0;
					bh1 = ah1;
					bh2 = ah2;
					bh3 = ah3;
					bh4 = ah4;
					bh5 = ah5;
					bh6 = ah6;
					bh7 = ah7;
					bl0 = al0;
					bl1 = al1;
					bl2 = al2;
					bl3 = al3;
					bl4 = al4;
					bl5 = al5;
					bl6 = al6;
					bl7 = al7;
					h = ah7;
					l = al7;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = (ah4 >>> 14 | al4 << 18) ^ (ah4 >>> 18 | al4 << 14) ^ (al4 >>> 9 | ah4 << 23);
					l = (al4 >>> 14 | ah4 << 18) ^ (al4 >>> 18 | ah4 << 14) ^ (ah4 >>> 9 | al4 << 23);
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = ah4 & ah5 ^ ~ah4 & ah6;
					l = al4 & al5 ^ ~al4 & al6;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = K[i * 2];
					l = K[i * 2 + 1];
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = wh[i % 16];
					l = wl[i % 16];
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					th = c & 65535 | d << 16;
					tl = a & 65535 | b << 16;
					h = th;
					l = tl;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = (ah0 >>> 28 | al0 << 4) ^ (al0 >>> 2 | ah0 << 30) ^ (al0 >>> 7 | ah0 << 25);
					l = (al0 >>> 28 | ah0 << 4) ^ (ah0 >>> 2 | al0 << 30) ^ (ah0 >>> 7 | al0 << 25);
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
					l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					bh7 = c & 65535 | d << 16;
					bl7 = a & 65535 | b << 16;
					h = bh3;
					l = bl3;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = th;
					l = tl;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					bh3 = c & 65535 | d << 16;
					bl3 = a & 65535 | b << 16;
					ah1 = bh0;
					ah2 = bh1;
					ah3 = bh2;
					ah4 = bh3;
					ah5 = bh4;
					ah6 = bh5;
					ah7 = bh6;
					ah0 = bh7;
					al1 = bl0;
					al2 = bl1;
					al3 = bl2;
					al4 = bl3;
					al5 = bl4;
					al6 = bl5;
					al7 = bl6;
					al0 = bl7;
					if (i % 16 === 15) for (j = 0; j < 16; j++) {
						h = wh[j];
						l = wl[j];
						a = l & 65535;
						b = l >>> 16;
						c = h & 65535;
						d = h >>> 16;
						h = wh[(j + 9) % 16];
						l = wl[(j + 9) % 16];
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						th = wh[(j + 1) % 16];
						tl = wl[(j + 1) % 16];
						h = (th >>> 1 | tl << 31) ^ (th >>> 8 | tl << 24) ^ th >>> 7;
						l = (tl >>> 1 | th << 31) ^ (tl >>> 8 | th << 24) ^ (tl >>> 7 | th << 25);
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						th = wh[(j + 14) % 16];
						tl = wl[(j + 14) % 16];
						h = (th >>> 19 | tl << 13) ^ (tl >>> 29 | th << 3) ^ th >>> 6;
						l = (tl >>> 19 | th << 13) ^ (th >>> 29 | tl << 3) ^ (tl >>> 6 | th << 26);
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						b += a >>> 16;
						c += b >>> 16;
						d += c >>> 16;
						wh[j] = c & 65535 | d << 16;
						wl[j] = a & 65535 | b << 16;
					}
				}
				h = ah0;
				l = al0;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[0];
				l = hl[0];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[0] = ah0 = c & 65535 | d << 16;
				hl[0] = al0 = a & 65535 | b << 16;
				h = ah1;
				l = al1;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[1];
				l = hl[1];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[1] = ah1 = c & 65535 | d << 16;
				hl[1] = al1 = a & 65535 | b << 16;
				h = ah2;
				l = al2;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[2];
				l = hl[2];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[2] = ah2 = c & 65535 | d << 16;
				hl[2] = al2 = a & 65535 | b << 16;
				h = ah3;
				l = al3;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[3];
				l = hl[3];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[3] = ah3 = c & 65535 | d << 16;
				hl[3] = al3 = a & 65535 | b << 16;
				h = ah4;
				l = al4;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[4];
				l = hl[4];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[4] = ah4 = c & 65535 | d << 16;
				hl[4] = al4 = a & 65535 | b << 16;
				h = ah5;
				l = al5;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[5];
				l = hl[5];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[5] = ah5 = c & 65535 | d << 16;
				hl[5] = al5 = a & 65535 | b << 16;
				h = ah6;
				l = al6;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[6];
				l = hl[6];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[6] = ah6 = c & 65535 | d << 16;
				hl[6] = al6 = a & 65535 | b << 16;
				h = ah7;
				l = al7;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[7];
				l = hl[7];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[7] = ah7 = c & 65535 | d << 16;
				hl[7] = al7 = a & 65535 | b << 16;
				pos += 128;
				n -= 128;
			}
			return n;
		}
		function crypto_hash(out, m, n) {
			var hh = new Int32Array(8), hl = new Int32Array(8), x = new Uint8Array(256), i, b = n;
			hh[0] = 1779033703;
			hh[1] = 3144134277;
			hh[2] = 1013904242;
			hh[3] = 2773480762;
			hh[4] = 1359893119;
			hh[5] = 2600822924;
			hh[6] = 528734635;
			hh[7] = 1541459225;
			hl[0] = 4089235720;
			hl[1] = 2227873595;
			hl[2] = 4271175723;
			hl[3] = 1595750129;
			hl[4] = 2917565137;
			hl[5] = 725511199;
			hl[6] = 4215389547;
			hl[7] = 327033209;
			crypto_hashblocks_hl(hh, hl, m, n);
			n %= 128;
			for (i = 0; i < n; i++) x[i] = m[b - n + i];
			x[n] = 128;
			n = 256 - 128 * (n < 112 ? 1 : 0);
			x[n - 9] = 0;
			ts64(x, n - 8, b / 536870912 | 0, b << 3);
			crypto_hashblocks_hl(hh, hl, x, n);
			for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
			return 0;
		}
		function add(p, q) {
			var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
			Z(a, p[1], p[0]);
			Z(t, q[1], q[0]);
			M(a, a, t);
			A(b, p[0], p[1]);
			A(t, q[0], q[1]);
			M(b, b, t);
			M(c, p[3], q[3]);
			M(c, c, D2);
			M(d, p[2], q[2]);
			A(d, d, d);
			Z(e, b, a);
			Z(f, d, c);
			A(g, d, c);
			A(h, b, a);
			M(p[0], e, f);
			M(p[1], h, g);
			M(p[2], g, f);
			M(p[3], e, h);
		}
		function cswap(p, q, b) {
			var i;
			for (i = 0; i < 4; i++) sel25519(p[i], q[i], b);
		}
		function pack(r, p) {
			var tx = gf(), ty = gf(), zi = gf();
			inv25519(zi, p[2]);
			M(tx, p[0], zi);
			M(ty, p[1], zi);
			pack25519(r, ty);
			r[31] ^= par25519(tx) << 7;
		}
		function scalarmult(p, q, s) {
			var b, i;
			set25519(p[0], gf0);
			set25519(p[1], gf1);
			set25519(p[2], gf1);
			set25519(p[3], gf0);
			for (i = 255; i >= 0; --i) {
				b = s[i / 8 | 0] >> (i & 7) & 1;
				cswap(p, q, b);
				add(q, p);
				add(p, p);
				cswap(p, q, b);
			}
		}
		function scalarbase(p, s) {
			var q = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			set25519(q[0], X);
			set25519(q[1], Y);
			set25519(q[2], gf1);
			M(q[3], X, Y);
			scalarmult(p, q, s);
		}
		function crypto_sign_keypair(pk, sk, seeded) {
			var d = new Uint8Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			var i;
			if (!seeded) randombytes(sk, 32);
			crypto_hash(d, sk, 32);
			d[0] &= 248;
			d[31] &= 127;
			d[31] |= 64;
			scalarbase(p, d);
			pack(pk, p);
			for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
			return 0;
		}
		var L = new Float64Array([
			237,
			211,
			245,
			92,
			26,
			99,
			18,
			88,
			214,
			156,
			247,
			162,
			222,
			249,
			222,
			20,
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
			16
		]);
		function modL(r, x) {
			var carry, i, j, k;
			for (i = 63; i >= 32; --i) {
				carry = 0;
				for (j = i - 32, k = i - 12; j < k; ++j) {
					x[j] += carry - 16 * x[i] * L[j - (i - 32)];
					carry = Math.floor((x[j] + 128) / 256);
					x[j] -= carry * 256;
				}
				x[j] += carry;
				x[i] = 0;
			}
			carry = 0;
			for (j = 0; j < 32; j++) {
				x[j] += carry - (x[31] >> 4) * L[j];
				carry = x[j] >> 8;
				x[j] &= 255;
			}
			for (j = 0; j < 32; j++) x[j] -= carry * L[j];
			for (i = 0; i < 32; i++) {
				x[i + 1] += x[i] >> 8;
				r[i] = x[i] & 255;
			}
		}
		function reduce(r) {
			var x = new Float64Array(64), i;
			for (i = 0; i < 64; i++) x[i] = r[i];
			for (i = 0; i < 64; i++) r[i] = 0;
			modL(r, x);
		}
		function crypto_sign(sm, m, n, sk) {
			var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
			var i, j, x = new Float64Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			crypto_hash(d, sk, 32);
			d[0] &= 248;
			d[31] &= 127;
			d[31] |= 64;
			var smlen = n + 64;
			for (i = 0; i < n; i++) sm[64 + i] = m[i];
			for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
			crypto_hash(r, sm.subarray(32), n + 32);
			reduce(r);
			scalarbase(p, r);
			pack(sm, p);
			for (i = 32; i < 64; i++) sm[i] = sk[i];
			crypto_hash(h, sm, n + 64);
			reduce(h);
			for (i = 0; i < 64; i++) x[i] = 0;
			for (i = 0; i < 32; i++) x[i] = r[i];
			for (i = 0; i < 32; i++) for (j = 0; j < 32; j++) x[i + j] += h[i] * d[j];
			modL(sm.subarray(32), x);
			return smlen;
		}
		function unpackneg(r, p) {
			var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
			set25519(r[2], gf1);
			unpack25519(r[1], p);
			S(num, r[1]);
			M(den, num, D);
			Z(num, num, r[2]);
			A(den, r[2], den);
			S(den2, den);
			S(den4, den2);
			M(den6, den4, den2);
			M(t, den6, num);
			M(t, t, den);
			pow2523(t, t);
			M(t, t, num);
			M(t, t, den);
			M(t, t, den);
			M(r[0], t, den);
			S(chk, r[0]);
			M(chk, chk, den);
			if (neq25519(chk, num)) M(r[0], r[0], I);
			S(chk, r[0]);
			M(chk, chk, den);
			if (neq25519(chk, num)) return -1;
			if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
			M(r[3], r[0], r[1]);
			return 0;
		}
		function crypto_sign_open(m, sm, n, pk) {
			var i;
			var t = new Uint8Array(32), h = new Uint8Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			], q = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			if (n < 64) return -1;
			if (unpackneg(q, pk)) return -1;
			for (i = 0; i < n; i++) m[i] = sm[i];
			for (i = 0; i < 32; i++) m[i + 32] = pk[i];
			crypto_hash(h, m, n);
			reduce(h);
			scalarmult(p, q, h);
			scalarbase(q, sm.subarray(32));
			add(p, q);
			pack(t, p);
			n -= 64;
			if (crypto_verify_32(sm, 0, t, 0)) {
				for (i = 0; i < n; i++) m[i] = 0;
				return -1;
			}
			for (i = 0; i < n; i++) m[i] = sm[i + 64];
			return n;
		}
		var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
		nacl.lowlevel = {
			crypto_core_hsalsa20,
			crypto_stream_xor,
			crypto_stream,
			crypto_stream_salsa20_xor,
			crypto_stream_salsa20,
			crypto_onetimeauth,
			crypto_onetimeauth_verify,
			crypto_verify_16,
			crypto_verify_32,
			crypto_secretbox,
			crypto_secretbox_open,
			crypto_scalarmult,
			crypto_scalarmult_base,
			crypto_box_beforenm,
			crypto_box_afternm,
			crypto_box,
			crypto_box_open,
			crypto_box_keypair,
			crypto_hash,
			crypto_sign,
			crypto_sign_keypair,
			crypto_sign_open,
			crypto_secretbox_KEYBYTES,
			crypto_secretbox_NONCEBYTES,
			crypto_secretbox_ZEROBYTES,
			crypto_secretbox_BOXZEROBYTES,
			crypto_scalarmult_BYTES,
			crypto_scalarmult_SCALARBYTES,
			crypto_box_PUBLICKEYBYTES,
			crypto_box_SECRETKEYBYTES,
			crypto_box_BEFORENMBYTES,
			crypto_box_NONCEBYTES,
			crypto_box_ZEROBYTES,
			crypto_box_BOXZEROBYTES,
			crypto_sign_BYTES,
			crypto_sign_PUBLICKEYBYTES,
			crypto_sign_SECRETKEYBYTES,
			crypto_sign_SEEDBYTES,
			crypto_hash_BYTES,
			gf,
			D,
			L,
			pack25519,
			unpack25519,
			M,
			A,
			S,
			Z,
			pow2523,
			add,
			set25519,
			modL,
			scalarmult,
			scalarbase
		};
		function checkLengths(k, n) {
			if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
			if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
		}
		function checkBoxLengths(pk, sk) {
			if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
			if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
		}
		function checkArrayTypes() {
			for (var i = 0; i < arguments.length; i++) if (!(arguments[i] instanceof Uint8Array)) throw new TypeError("unexpected type, use Uint8Array");
		}
		function cleanup(arr) {
			for (var i = 0; i < arr.length; i++) arr[i] = 0;
		}
		nacl.randomBytes = function(n) {
			var b = new Uint8Array(n);
			randombytes(b, n);
			return b;
		};
		nacl.secretbox = function(msg, nonce, key) {
			checkArrayTypes(msg, nonce, key);
			checkLengths(key, nonce);
			var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
			var c = new Uint8Array(m.length);
			for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
			crypto_secretbox(c, m, m.length, nonce, key);
			return c.subarray(crypto_secretbox_BOXZEROBYTES);
		};
		nacl.secretbox.open = function(box, nonce, key) {
			checkArrayTypes(box, nonce, key);
			checkLengths(key, nonce);
			var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
			var m = new Uint8Array(c.length);
			for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
			if (c.length < 32) return null;
			if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
			return m.subarray(crypto_secretbox_ZEROBYTES);
		};
		nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
		nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
		nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
		nacl.scalarMult = function(n, p) {
			checkArrayTypes(n, p);
			if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
			if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
			var q = new Uint8Array(crypto_scalarmult_BYTES);
			crypto_scalarmult(q, n, p);
			return q;
		};
		nacl.scalarMult.base = function(n) {
			checkArrayTypes(n);
			if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
			var q = new Uint8Array(crypto_scalarmult_BYTES);
			crypto_scalarmult_base(q, n);
			return q;
		};
		nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
		nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
		nacl.box = function(msg, nonce, publicKey, secretKey) {
			var k = nacl.box.before(publicKey, secretKey);
			return nacl.secretbox(msg, nonce, k);
		};
		nacl.box.before = function(publicKey, secretKey) {
			checkArrayTypes(publicKey, secretKey);
			checkBoxLengths(publicKey, secretKey);
			var k = new Uint8Array(crypto_box_BEFORENMBYTES);
			crypto_box_beforenm(k, publicKey, secretKey);
			return k;
		};
		nacl.box.after = nacl.secretbox;
		nacl.box.open = function(msg, nonce, publicKey, secretKey) {
			var k = nacl.box.before(publicKey, secretKey);
			return nacl.secretbox.open(msg, nonce, k);
		};
		nacl.box.open.after = nacl.secretbox.open;
		nacl.box.keyPair = function() {
			var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
			crypto_box_keypair(pk, sk);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl.box.keyPair.fromSecretKey = function(secretKey) {
			checkArrayTypes(secretKey);
			if (secretKey.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
			var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
			crypto_scalarmult_base(pk, secretKey);
			return {
				publicKey: pk,
				secretKey: new Uint8Array(secretKey)
			};
		};
		nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
		nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
		nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
		nacl.box.nonceLength = crypto_box_NONCEBYTES;
		nacl.box.overheadLength = nacl.secretbox.overheadLength;
		nacl.sign = function(msg, secretKey) {
			checkArrayTypes(msg, secretKey);
			if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
			var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
			crypto_sign(signedMsg, msg, msg.length, secretKey);
			return signedMsg;
		};
		nacl.sign.open = function(signedMsg, publicKey) {
			checkArrayTypes(signedMsg, publicKey);
			if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
			var tmp = new Uint8Array(signedMsg.length);
			var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
			if (mlen < 0) return null;
			var m = new Uint8Array(mlen);
			for (var i = 0; i < m.length; i++) m[i] = tmp[i];
			return m;
		};
		nacl.sign.detached = function(msg, secretKey) {
			var signedMsg = nacl.sign(msg, secretKey);
			var sig = new Uint8Array(crypto_sign_BYTES);
			for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
			return sig;
		};
		nacl.sign.detached.verify = function(msg, sig, publicKey) {
			checkArrayTypes(msg, sig, publicKey);
			if (sig.length !== crypto_sign_BYTES) throw new Error("bad signature size");
			if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
			var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
			var m = new Uint8Array(crypto_sign_BYTES + msg.length);
			var i;
			for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
			for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
			return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
		};
		nacl.sign.keyPair = function() {
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
			crypto_sign_keypair(pk, sk);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl.sign.keyPair.fromSecretKey = function(secretKey) {
			checkArrayTypes(secretKey);
			if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
			return {
				publicKey: pk,
				secretKey: new Uint8Array(secretKey)
			};
		};
		nacl.sign.keyPair.fromSeed = function(seed) {
			checkArrayTypes(seed);
			if (seed.length !== crypto_sign_SEEDBYTES) throw new Error("bad seed size");
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
			for (var i = 0; i < 32; i++) sk[i] = seed[i];
			crypto_sign_keypair(pk, sk, true);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
		nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
		nacl.sign.seedLength = crypto_sign_SEEDBYTES;
		nacl.sign.signatureLength = crypto_sign_BYTES;
		nacl.hash = function(msg) {
			checkArrayTypes(msg);
			var h = new Uint8Array(crypto_hash_BYTES);
			crypto_hash(h, msg, msg.length);
			return h;
		};
		nacl.hash.hashLength = crypto_hash_BYTES;
		nacl.verify = function(x, y) {
			checkArrayTypes(x, y);
			if (x.length === 0 || y.length === 0) return false;
			if (x.length !== y.length) return false;
			return vn(x, 0, y, 0, x.length) === 0 ? true : false;
		};
		nacl.setPRNG = function(fn) {
			randombytes = fn;
		};
		(function() {
			var crypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
			if (crypto && crypto.getRandomValues) {
				var QUOTA = 65536;
				nacl.setPRNG(function(x, n) {
					var i, v = new Uint8Array(n);
					for (i = 0; i < n; i += QUOTA) crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
					for (i = 0; i < n; i++) x[i] = v[i];
					cleanup(v);
				});
			} else if (typeof __require !== "undefined") {
				crypto = __require("crypto");
				if (crypto && crypto.randomBytes) nacl.setPRNG(function(x, n) {
					var i, v = crypto.randomBytes(n);
					for (i = 0; i < n; i++) x[i] = v[i];
					cleanup(v);
				});
			}
		})();
	})(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
})))(), 1);
var buildUrl = (path, params) => `https://phantom.app/ul/v1/${path}?${params.toString()}`;
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/phantomRedirect/clearRedirectUrlForPhantom/clearRedirectUrlForPhantom.js
/**
* Clear the redirect link phantom will use to return to the dapp
*
* This is necessary because the redirect link is used to return to the dapp
* and it contains params that cause issues when the SDK is loading.
* For example the redirect may include the errorCode or errorMessage which
* will cause the SDK to throw an error and not complete the redirect.
*/
var clearRedirectUrlForPhantom = (url) => {
	[
		"data",
		"nonce",
		"phantom_encryption_public_key",
		"errorCode",
		"errorMessage",
		"data"
	].forEach((param) => {
		url.searchParams.delete(param);
	});
	return url.toString();
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/phantomRedirect/decryptPayload/decryptPayload.js
var failForMissingParam = (paramName, param) => {
	const message = `Failed to decrypt phantom redirect payload: ${paramName} was invalid (${param})`;
	logger$2.error(message);
	throw new Error(message);
};
var decryptPayload = (data, nonce, sharedSecret) => {
	if (!data) failForMissingParam("data", data);
	if (!nonce) failForMissingParam("nonce", nonce);
	if (!sharedSecret) failForMissingParam("sharedSecret", sharedSecret);
	const decryptedData = import_nacl_fast.default.box.open.after(import_bs58.default.decode(data), import_bs58.default.decode(nonce), sharedSecret);
	if (!decryptedData) throw new Error("Unable to decrypt data");
	return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/phantomRedirect/encryptPayload/encryptPayload.js
var encryptPayload = (payload, sharedSecret) => {
	const nonce = import_nacl_fast.default.randomBytes(24);
	return [nonce, import_nacl_fast.default.box.after(Buffer.from(JSON.stringify(payload)), nonce, sharedSecret)];
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/phantomRedirect/storage/storage.js
var storage = {
	address: {
		get: () => {
			var _a;
			const value = (_a = localStorage.getItem("dynamic_phantom_wallet_address")) !== null && _a !== void 0 ? _a : void 0;
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] address.get", { value });
			return value;
		},
		remove: () => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] address.remove");
			localStorage.removeItem("dynamic_phantom_wallet_address");
		},
		set: (address) => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] address.set", { address: address.toString() });
			localStorage.setItem("dynamic_phantom_wallet_address", address.toString());
		}
	},
	encryptionPublicKey: {
		get: () => {
			const rawPublicKey = localStorage.getItem("dynamic_phantom_public_key");
			if (!rawPublicKey) return;
			return new Uint8Array(JSON.parse(rawPublicKey));
		},
		remove: () => {
			localStorage.removeItem("dynamic_phantom_public_key");
		},
		set: (publicKey) => {
			localStorage.setItem("dynamic_phantom_public_key", JSON.stringify([...publicKey]));
		}
	},
	encryptionSecretKey: {
		get: () => {
			const rawSecretKey = localStorage.getItem("dynamic_phantom_secret_key");
			if (!rawSecretKey) return;
			return new Uint8Array(JSON.parse(rawSecretKey));
		},
		remove: () => {
			localStorage.removeItem("dynamic_phantom_secret_key");
		},
		set: (secretKey) => {
			localStorage.setItem("dynamic_phantom_secret_key", JSON.stringify([...secretKey]));
		}
	},
	message: {
		get: () => {
			var _a;
			const value = (_a = localStorage.getItem("dynamic_phantom_message_to_sign")) !== null && _a !== void 0 ? _a : void 0;
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] message.get", {
				hasMessage: Boolean(value),
				messageLength: value === null || value === void 0 ? void 0 : value.length,
				messagePreview: value === null || value === void 0 ? void 0 : value.substring(0, 100)
			});
			return value;
		},
		remove: () => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] message.remove");
			localStorage.removeItem("dynamic_phantom_message_to_sign");
		},
		set: (message) => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] message.set", {
				messageLength: message.length,
				messagePreview: message.substring(0, 100)
			});
			localStorage.setItem("dynamic_phantom_message_to_sign", message);
		}
	},
	method: {
		get: () => {
			var _a;
			const value = (_a = localStorage.getItem("dynamic_phantom_method")) !== null && _a !== void 0 ? _a : void 0;
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] method.get", { value });
			return value;
		},
		remove: () => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] method.remove");
			localStorage.removeItem("dynamic_phantom_method");
		},
		set: (method) => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] method.set", { method });
			localStorage.setItem("dynamic_phantom_method", method);
		}
	},
	requestId: {
		get: () => {
			var _a;
			return (_a = localStorage.getItem("dynamic_phantom_request_id")) !== null && _a !== void 0 ? _a : void 0;
		},
		remove: () => {
			localStorage.removeItem("dynamic_phantom_request_id");
		},
		set: (requestId) => {
			localStorage.setItem("dynamic_phantom_request_id", requestId);
		}
	},
	sendOptions: {
		get: () => {
			var _a;
			return (_a = localStorage.getItem("dynamic_phantom_send_options")) !== null && _a !== void 0 ? _a : void 0;
		},
		remove: () => {
			localStorage.removeItem("dynamic_phantom_send_options");
		},
		set: (options) => {
			localStorage.setItem("dynamic_phantom_send_options", options);
		}
	},
	session: {
		get: () => {
			var _a;
			const value = (_a = localStorage.getItem("dynamic_phantom_session")) !== null && _a !== void 0 ? _a : void 0;
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] session.get", { hasSession: Boolean(value) });
			return value;
		},
		remove: () => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] session.remove");
			localStorage.removeItem("dynamic_phantom_session");
		},
		set: (session) => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] session.set", { session });
			localStorage.setItem("dynamic_phantom_session", session);
		}
	},
	sharedSecret: {
		get: () => {
			const rawSharedSecret = localStorage.getItem("dynamic_phantom_shared_secret");
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] sharedSecret.get", { hasSharedSecret: Boolean(rawSharedSecret) });
			if (!rawSharedSecret) return;
			return new Uint8Array(JSON.parse(rawSharedSecret));
		},
		remove: () => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] sharedSecret.remove");
			localStorage.removeItem("dynamic_phantom_shared_secret");
		},
		set: (sharedSecret) => {
			logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] sharedSecret.set", { sharedSecretLength: sharedSecret.length });
			localStorage.setItem("dynamic_phantom_shared_secret", JSON.stringify([...sharedSecret]));
		}
	}
};
var clearStorage = () => {
	logger$2.logVerboseTroubleshootingMessage("[PhantomStorage] clearStorage called");
	for (const key in storage) storage[key].remove();
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/phantomRedirect/PhantomRedirect/PhantomRedirect.js
var PhantomRedirect = class extends SolanaWalletConnector {
	constructor(props) {
		super(Object.assign({}, props));
		this.name = "Phantom";
		this.overrideKey = "phantom";
	}
	getMethod() {
		throw new Error("Method not implemented.");
	}
	/**
	* Sets up a Promise/listener pattern for native mobile redirects.
	* Returns undefined if not on native mobile.
	*/
	setupNativeMobileListener({ eventName, methodName, getResult, shouldIgnoreEvent }) {
		if (!PlatformService.isNativeMobile) return;
		const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
		storage.requestId.set(requestId);
		logger$2.logVerboseTroubleshootingMessage(`[PhantomRedirect] ${methodName} - setting up listener`, { requestId });
		return new Promise((resolve, reject) => {
			const listener = (event) => {
				if (event.requestId !== requestId || (shouldIgnoreEvent === null || shouldIgnoreEvent === void 0 ? void 0 : shouldIgnoreEvent(event, requestId))) {
					logger$2.logVerboseTroubleshootingMessage(`[PhantomRedirect] ${methodName} - ignoring event (requestId mismatch)`, {
						expectedRequestId: requestId,
						receivedRequestId: event.requestId
					});
					return;
				}
				logger$2.logVerboseTroubleshootingMessage(`[PhantomRedirect] ${methodName} - listener received matching event`, {
					errorCode: event.errorCode,
					requestId
				});
				this.off(eventName, listener);
				if (event.errorCode) reject(new Error(event.errorMessage || event.errorCode));
				else resolve(getResult(event));
			};
			this.on(eventName, listener);
		});
	}
	/**
	* Encrypts payload, builds Phantom redirect URL, stores method, and opens URL.
	*/
	openPhantomUrl({ payload, sharedSecret, encryptionPublicKey, phantomEndpoint, methodToStore }) {
		const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
		const url = buildUrl(phantomEndpoint, new URLSearchParams({
			dapp_encryption_public_key: import_bs58.default.encode(encryptionPublicKey),
			nonce: import_bs58.default.encode(nonce),
			payload: import_bs58.default.encode(encryptedPayload),
			redirect_link: clearRedirectUrlForPhantom(PlatformService.getUrl())
		}));
		storage.method.set(methodToStore);
		logger$2.debug(`[PhantomRedirect] ${methodToStore} - opening Phantom`, { isNativeMobile: PlatformService.isNativeMobile });
		PlatformService.openURL(url);
	}
	getAddress() {
		return __awaiter$3(this, void 0, void 0, function* () {
			const address = storage.address.get();
			if (address) return address;
			yield this.connect();
		});
	}
	connect() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			const connectionType = StorageService.getItem(PHANTOM_REDIRECT_CONNECTION_TYPE_KEY);
			if (connectionType) if (connectionType.connectorConsumed) StorageService.setItem(PHANTOM_REDIRECT_CONNECTION_TYPE_KEY, void 0);
			else {
				connectionType.connectorConsumed = true;
				StorageService.setItem(PHANTOM_REDIRECT_CONNECTION_TYPE_KEY, connectionType);
			}
			const keyPair = import_nacl_fast.default.box.keyPair();
			storage.encryptionPublicKey.set(keyPair.publicKey);
			storage.encryptionSecretKey.set(keyPair.secretKey);
			const { href } = PlatformService.getUrl();
			const isLocalHost = href.includes("localhost") || href.includes("0.0.0.0") || href.includes("127.0.0.1");
			const currentNetwork = this.getSelectedNetwork();
			let cluster = (_a = currentNetwork === null || currentNetwork === void 0 ? void 0 : currentNetwork.cluster) !== null && _a !== void 0 ? _a : "mainnet-beta";
			if (cluster === "mainnet") cluster = "mainnet-beta";
			const url = buildUrl("connect", new URLSearchParams({
				app_url: isLocalHost ? "https://demo.dynamic.xyz" : href,
				cluster,
				dapp_encryption_public_key: import_bs58.default.encode(keyPair.publicKey),
				redirect_link: clearRedirectUrlForPhantom(PlatformService.getUrl())
			}));
			PlatformService.openURL(url);
		});
	}
	getSession() {
		return __awaiter$3(this, void 0, void 0, function* () {
			const { data, nonce, phantom_encryption_public_key: phantomEncryptionPublicKey, encryptionSecretKey } = this.getInputsOrThrow("getSession", [
				"data",
				"nonce",
				"phantom_encryption_public_key"
			], ["encryptionSecretKey"]);
			const sharedSecret = import_nacl_fast.default.box.before(import_bs58.default.decode(phantomEncryptionPublicKey), encryptionSecretKey);
			storage.sharedSecret.set(sharedSecret);
			const connectData = decryptPayload(data, nonce, sharedSecret);
			storage.session.set(connectData.session);
			storage.address.set(new PublicKey(connectData.public_key));
			return connectData.public_key;
		});
	}
	signMessage(messageToSign) {
		return __awaiter$3(this, void 0, void 0, function* () {
			logger$2.debug("[PhantomRedirect] signMessage called", {
				messageLength: messageToSign.length,
				messagePreview: messageToSign.substring(0, 200)
			});
			const { session, sharedSecret, encryptionPublicKey } = this.getInputsOrThrow("signMessage", [], [
				"session",
				"sharedSecret",
				"encryptionPublicKey"
			]);
			storage.message.set(messageToSign);
			const payload = {
				message: import_bs58.default.encode(Buffer.from(messageToSign)),
				session
			};
			this.openPhantomUrl({
				encryptionPublicKey,
				methodToStore: "signMessage",
				payload,
				phantomEndpoint: "signMessage",
				sharedSecret
			});
			const nativePromise = this.setupNativeMobileListener({
				eventName: "signMessage",
				getResult: (event) => event.signature,
				methodName: "signMessage",
				shouldIgnoreEvent: (event) => event.message !== messageToSign
			});
			if (nativePromise) return nativePromise;
			logger$2.debug("[PhantomRedirect] signMessage - mobile web, throwing ignore error");
			throw new Error("ignore");
		});
	}
	extractSignature() {
		var _a;
		logger$2.debug("[PhantomRedirect] extractSignature called");
		const { data, nonce, sharedSecret, message } = this.getInputsOrThrow("extractSignature", ["data", "nonce"], ["sharedSecret", "message"]);
		logger$2.debug("[PhantomRedirect] extractSignature - retrieved from storage", {
			dataPresent: Boolean(data),
			message,
			messageLength: message === null || message === void 0 ? void 0 : message.length,
			noncePresent: Boolean(nonce),
			sharedSecretPresent: Boolean(sharedSecret)
		});
		const signMessageData = decryptPayload(data, nonce, sharedSecret);
		logger$2.debug("[PhantomRedirect] extractSignature - decrypted payload", {
			signature: signMessageData.signature,
			signatureLength: (_a = signMessageData.signature) === null || _a === void 0 ? void 0 : _a.length
		});
		return {
			message,
			signature: signMessageData.signature
		};
	}
	extractTransactions() {
		const { data, nonce, sharedSecret } = this.getInputsOrThrow("extractTransactions", ["data", "nonce"], ["sharedSecret"]);
		return decryptPayload(data, nonce, sharedSecret).transactions.map((t) => Transaction.from(import_bs58.default.decode(t)));
	}
	extractTransaction() {
		const { data, nonce, sharedSecret } = this.getInputsOrThrow("extractTransaction", ["data", "nonce"], ["sharedSecret"]);
		const signTransactionData = decryptPayload(data, nonce, sharedSecret);
		const transactionBytes = import_bs58.default.decode(signTransactionData.transaction);
		try {
			return VersionedTransaction.deserialize(transactionBytes);
		} catch (_a) {
			return Transaction.from(transactionBytes);
		}
	}
	/**
	* Extracts the signed transaction and sends it to the network.
	* Used for signAndSendTransaction since Phantom redirect doesn't support it natively.
	* @returns The transaction signature
	*/
	extractAndSendTransaction() {
		return __awaiter$3(this, void 0, void 0, function* () {
			logger$2.debug("[PhantomRedirect] extractAndSendTransaction called");
			const signedTransaction = this.extractTransaction();
			const sendOptionsJson = storage.sendOptions.get();
			storage.sendOptions.remove();
			const sendOptions = sendOptionsJson ? JSON.parse(sendOptionsJson) : void 0;
			logger$2.debug("[PhantomRedirect] Sending transaction to network", {
				hasSendOptions: Boolean(sendOptions),
				isVersioned: signedTransaction instanceof VersionedTransaction
			});
			const serialized = signedTransaction.serialize();
			const signature = yield this.getWalletClient().sendRawTransaction(serialized, sendOptions);
			logger$2.debug("[PhantomRedirect] Transaction sent successfully", { signature });
			return signature;
		});
	}
	consumeMethod() {
		const method = storage.method.get();
		storage.method.remove();
		return method;
	}
	consumeRequestId() {
		const requestId = storage.requestId.get();
		storage.requestId.remove();
		return requestId;
	}
	getSigner() {
		return __awaiter$3(this, void 0, void 0, function* () {
			const address = storage.address.get();
			if (!address) return;
			return {
				addListener: () => {
					throw new Error("Not implemented");
				},
				connect: () => {
					throw new Error("Not implemented");
				},
				disconnect: () => {
					throw new Error("Not implemented");
				},
				emit: () => {
					throw new Error("Not implemented");
				},
				eventNames: () => {
					throw new Error("Not implemented");
				},
				isBackpack: false,
				isBraveWallet: false,
				isConnected: true,
				isExodus: false,
				isGlow: false,
				isMagicEden: false,
				isPhantom: true,
				isSolflare: false,
				listenerCount: () => {
					throw new Error("Not implemented");
				},
				listeners: () => {
					throw new Error("Not implemented");
				},
				off: () => {
					throw new Error("Not implemented");
				},
				on: () => {
					throw new Error("Not implemented");
				},
				once: () => {
					throw new Error("Not implemented");
				},
				providers: [],
				publicKey: new PublicKey(address),
				removeAllListeners: () => {
					throw new Error("Not implemented");
				},
				removeListener: () => {
					throw new Error("Not implemented");
				},
				signAllTransactions: (transactions) => __awaiter$3(this, void 0, void 0, function* () {
					const serializedTransactions = transactions.map((t) => import_bs58.default.encode(t.serialize({ requireAllSignatures: false })));
					const { session, sharedSecret, encryptionPublicKey } = this.getInputsOrThrow("signAllTransactions", [], [
						"session",
						"sharedSecret",
						"encryptionPublicKey"
					]);
					const payload = {
						session,
						transactions: serializedTransactions
					};
					this.openPhantomUrl({
						encryptionPublicKey,
						methodToStore: "signAllTransactions",
						payload,
						phantomEndpoint: "signAllTransactions",
						sharedSecret
					});
					const nativePromise = this.setupNativeMobileListener({
						eventName: "signAllTransactions",
						getResult: (event) => event.transactions || [],
						methodName: "signAllTransactions"
					});
					if (nativePromise) return nativePromise;
					return [];
				}),
				signAndSendTransaction: (transaction, options) => __awaiter$3(this, void 0, void 0, function* () {
					const serializedTransaction = import_bs58.default.encode(transaction.serialize({ requireAllSignatures: false }));
					const { session, sharedSecret, encryptionPublicKey } = this.getInputsOrThrow("signAndSendTransaction", [], [
						"session",
						"sharedSecret",
						"encryptionPublicKey"
					]);
					const payload = {
						session,
						transaction: serializedTransaction
					};
					if (options) storage.sendOptions.set(JSON.stringify(options));
					this.openPhantomUrl({
						encryptionPublicKey,
						methodToStore: "signAndSendTransaction",
						payload,
						phantomEndpoint: "signTransaction",
						sharedSecret
					});
					const nativePromise = this.setupNativeMobileListener({
						eventName: "signAndSendTransaction",
						getResult: (event) => ({ signature: event.signature || "" }),
						methodName: "signAndSendTransaction"
					});
					if (nativePromise) return nativePromise;
					return { signature: "" };
				}),
				signMessage: (message) => __awaiter$3(this, void 0, void 0, function* () {
					const messageString = new TextDecoder().decode(message);
					const signature = yield this.signMessage(messageString);
					return { signature: signature ? import_bs58.default.decode(signature) : new Uint8Array(0) };
				}),
				signTransaction: (transaction) => __awaiter$3(this, void 0, void 0, function* () {
					const serializedTransaction = import_bs58.default.encode(transaction.serialize({ requireAllSignatures: false }));
					const { session, sharedSecret, encryptionPublicKey } = this.getInputsOrThrow("signTransaction", [], [
						"session",
						"sharedSecret",
						"encryptionPublicKey"
					]);
					const payload = {
						session,
						transaction: serializedTransaction
					};
					this.openPhantomUrl({
						encryptionPublicKey,
						methodToStore: "signTransaction",
						payload,
						phantomEndpoint: "signTransaction",
						sharedSecret
					});
					const nativePromise = this.setupNativeMobileListener({
						eventName: "signTransaction",
						getResult: (event) => event.transaction,
						methodName: "signTransaction"
					});
					if (nativePromise) return nativePromise;
					return transaction;
				})
			};
		});
	}
	getConnectedAccounts() {
		return __awaiter$3(this, void 0, void 0, function* () {
			const address = storage.address.get();
			return address ? [address] : [];
		});
	}
	endSession() {
		return __awaiter$3(this, void 0, void 0, function* () {
			const address = storage.address.get();
			const session = storage.session.get();
			const sharedSecret = storage.sharedSecret.get();
			const encryptionPublicKey = storage.encryptionPublicKey.get();
			clearStorage();
			if (!address || !session || !encryptionPublicKey || !sharedSecret) return;
			const [nonce, encryptedPayload] = encryptPayload({ session }, sharedSecret);
			const url = buildUrl("disconnect", new URLSearchParams({
				dapp_encryption_public_key: import_bs58.default.encode(encryptionPublicKey),
				nonce: import_bs58.default.encode(nonce),
				payload: import_bs58.default.encode(encryptedPayload),
				redirect_link: clearRedirectUrlForPhantom(PlatformService.getUrl())
			}));
			PlatformService.openURL(url);
		});
	}
	/**
	* Helper method to get inputs from query params and localstorage
	*
	* The second argument is used to read values from the query string
	*   e.g. ['data', 'nonce'] -> params.get('data') and params.get('nonce')
	*
	* The third argument is used to read values from local storage
	*   e.g. ['address', 'message'] -> storage.address.get() and storage.message.get()
	*
	* Throws an error if any of the inputs are unable to be found in their respective locations
	*/
	getInputsOrThrow(methodName, queryParams, storageParams) {
		const inputs = {};
		const queryString = PlatformService.getUrl().searchParams;
		queryParams.forEach((param) => {
			const value = queryString.get(param);
			if (!value) throw new Error(`[PhantomRedirect] ${methodName} called, but required input '${param}' not found in query params`);
			inputs[param] = value;
		});
		storageParams.forEach((storageParam) => {
			const value = storage[storageParam].get();
			if (!value) throw new Error(`[PhantomRedirect] ${methodName} called, but required input '${storageParam}' not found in local storage`);
			inputs[storageParam] = value;
		});
		return inputs;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/Phantom/Phantom.js
var Phantom = class extends SolanaWalletConnector {
	constructor() {
		super(...arguments);
		this.name = "Phantom";
		this.overrideKey = "phantom";
	}
	connect() {
		return __awaiter$3(this, void 0, void 0, function* () {
			yield this.getMobileOrInstalledWallet().connect();
		});
	}
	getSigner() {
		return __awaiter$3(this, void 0, void 0, function* () {
			return this.getMobileOrInstalledWallet().getSigner();
		});
	}
	getMobileOrInstalledWallet() {
		const phantomInjected = new PhantomInjected(this.constructorProps);
		if (isMobile() && !phantomInjected.isInstalledOnBrowser() && this.mobileExperience === "redirect") return new PhantomRedirect(this.constructorProps);
		return phantomInjected;
	}
};
Object.defineProperty(Phantom, "key", {
	value: "phantom",
	writable: false
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/CoinbaseSolana/CoinbaseSolana.js
var CoinbaseSolana = class extends InjectedWalletBase {
	constructor() {
		super(...arguments);
		this.name = "Coinbase";
		this.overrideKey = "coinbasesolana";
	}
	getSigner() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a;
			return (_a = this.solProviderHelper) === null || _a === void 0 ? void 0 : _a.connect();
		});
	}
	signMessage(messageToSign) {
		return __awaiter$3(this, void 0, void 0, function* () {
			const walletAddress = yield this.getAddress();
			if (!walletAddress) return;
			const provider = yield this.getSigner();
			if (!provider) return;
			const encodedMessage = new TextEncoder().encode(messageToSign);
			const signedMessage = yield provider.signMessage(encodedMessage, walletAddress);
			if (!signedMessage) return;
			return bufferToBase64(isSignedMessage(signedMessage) ? signedMessage.signature : signedMessage);
		});
	}
};
Object.defineProperty(CoinbaseSolana, "key", {
	value: "coinbasesolana",
	writable: false
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/Solflare/Solflare.js
var Solflare = class extends InjectedWalletBase {
	constructor(props) {
		super(props);
		this.name = "Solflare";
		this.overrideKey = "solflare";
		this.walletConnectWalletBookEntry = findWalletBookWallet(props.walletBook, this.key);
	}
	getMobileOrInstalledWallet() {
		return this;
	}
	getAddress() {
		return __awaiter$3(this, void 0, void 0, function* () {
			var _a, _b;
			/**
			* It should redirect to in-app browser if on mobile and if not in the in-app browser,
			* this checks if it is not in the in-app browser by checking if the provider is not available.
			*/
			if (isMobile() && !this.isInstalledOnBrowser()) {
				const mobileDeepLinks = (_a = this.metadata.deepLinks) === null || _a === void 0 ? void 0 : _a.mobile;
				handleMobileWalletRedirect({
					nativeLink: (mobileDeepLinks === null || mobileDeepLinks === void 0 ? void 0 : mobileDeepLinks.native) || "solflare://ul/v1/browse",
					universalLink: (mobileDeepLinks === null || mobileDeepLinks === void 0 ? void 0 : mobileDeepLinks.universal) || "https://solflare.com/ul/v1/browse"
				});
				return;
			}
			return (_b = this.solProviderHelper) === null || _b === void 0 ? void 0 : _b.getAddress();
		});
	}
	signMessage(messageToSign) {
		return __awaiter$3(this, void 0, void 0, function* () {
			if (!(yield this.getAddress())) return;
			const provider = yield this.getSigner();
			if (!provider) return;
			const encodedMessage = new TextEncoder().encode(messageToSign);
			const isSignedMessage = (value) => value.signature !== void 0;
			yield provider.connect();
			/**
			* TODO: Remove the sleep once problem is fixed on Solflare's extension.
			* Tracked in DYN-442
			*/
			yield new Promise((resolve) => {
				setTimeout(resolve, 100);
			});
			const rawMessage = yield provider.signMessage(encodedMessage, "utf8");
			return isSignedMessage(rawMessage) ? bufferToBase64(rawMessage.signature) : void 0;
		});
	}
};
Object.defineProperty(Solflare, "key", {
	value: "solflare",
	writable: false
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/utils/getConnectorConstructorInjectedWallet/getConnectorConstructorInjectedWallet.js
var getConnectorConstructorInjectedWallet = ({ key, wallet, walletBook }) => {
	const { shortName } = wallet;
	const name = shortName || wallet.name;
	/**
	* For historical reasons, all wallet connect data for wallets reside in the EVM entry for the wallet in wallet book.
	* Therefore, in order to tell whether this Sol wallet supports wallet connect, we will have to find the wallet book
	* entry that has the wallet connect data for it.
	*/
	let walletConnectWalletBookEntry = void 0;
	if (wallet.group) walletConnectWalletBookEntry = Object.values(walletBook.wallets).find((entry) => {
		var _a;
		return entry.walletConnect && entry.group === wallet.group && ((_a = entry.chains) === null || _a === void 0 ? void 0 : _a.some((chain) => chain.includes("solana:")));
	});
	const InjectedWalletConstructor = class extends InjectedWalletBase {
		constructor() {
			super(...arguments);
			this.walletName = name;
			this.name = name;
			this.walletConnectWalletBookEntry = walletConnectWalletBookEntry;
			this.overrideKey = key;
		}
	};
	Object.defineProperty(InjectedWalletConstructor, "key", {
		value: key,
		writable: false
	});
	return InjectedWalletConstructor;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/walletStandard/createSolanaSignerFromWalletStandard/createSolanaSignerFromWalletStandard.js
var isVersionedTransaction = (transaction) => !("instructions" in transaction);
var createSolanaSignerFromWalletStandard = ({ wallet, walletConnector }) => {
	const features = wallet.features;
	const hasAutoConnectedAccounts = () => {
		var _a, _b, _c;
		return Boolean(((_a = wallet.accounts) === null || _a === void 0 ? void 0 : _a.length) > 0 && ((_b = wallet.accounts[0]) === null || _b === void 0 ? void 0 : _b.publicKey) && ((_c = wallet.accounts[0]) === null || _c === void 0 ? void 0 : _c.address));
	};
	const connect = (args) => __awaiter$3(void 0, void 0, void 0, function* () {
		var _a;
		const autoConnectedAccounts = wallet.accounts;
		logger$2.logVerboseTroubleshootingMessage("[SolanaWalletStandardConnector] - connect", { autoConnectedAccounts });
		if (hasAutoConnectedAccounts()) return {
			address: autoConnectedAccounts[0].address,
			publicKey: autoConnectedAccounts[0].publicKey
		};
		const connectMethod = (_a = features["standard:connect"]) === null || _a === void 0 ? void 0 : _a.connect;
		if (!connectMethod) {
			logger$2.error("connect - Not implemented");
			return;
		}
		const result = yield connectMethod({ silent: false });
		if (!result.accounts[0]) return;
		return {
			address: result.accounts[0].address,
			publicKey: result.accounts[0].publicKey
		};
	});
	const disconnect = () => __awaiter$3(void 0, void 0, void 0, function* () {
		var _b;
		const disconnectMethod = (_b = features["standard:disconnect"]) === null || _b === void 0 ? void 0 : _b.disconnect;
		if (!disconnectMethod) {
			logger$2.debug("disconnect - Not implemented");
			return;
		}
		yield disconnectMethod();
	});
	const getCurrentAccount = () => __awaiter$3(void 0, void 0, void 0, function* () {
		const address = yield walletConnector.getAddress();
		const account = wallet.accounts.find((account) => account.address === address);
		if (!account) throw new Error("Account not found");
		return account;
	});
	const getChain = () => {
		var _a;
		const currentNetwork = walletConnector.getSelectedNetwork();
		if (!currentNetwork) throw new Error("Network not found");
		return `solana:${(_a = currentNetwork.cluster) !== null && _a !== void 0 ? _a : "mainnet"}`;
	};
	const signTransaction = (transaction) => __awaiter$3(void 0, void 0, void 0, function* () {
		return (yield signAllTransactions([transaction]))[0];
	});
	const signAllTransactions = (transactions) => __awaiter$3(void 0, void 0, void 0, function* () {
		const signTransactionMethod = features["solana:signTransaction"].signTransaction;
		const account = yield getCurrentAccount();
		const chain = getChain();
		return (yield signTransactionMethod(...transactions.map((transaction) => ({
			account,
			chain,
			transaction: transaction.serialize({ requireAllSignatures: false })
		})))).map(({ signedTransaction }, index) => {
			const inputTransaction = transactions[index];
			if (isVersionedTransaction(inputTransaction)) return VersionedTransaction.deserialize(signedTransaction);
			return Transaction.from(signedTransaction);
		});
	});
	const signAndSendTransaction = (transaction) => __awaiter$3(void 0, void 0, void 0, function* () {
		var _c;
		const signAndSendTransactionMethod = (_c = features["solana:signAndSendTransaction"]) === null || _c === void 0 ? void 0 : _c.signAndSendTransaction;
		if (!signAndSendTransactionMethod) {
			logger$2.error("signAndSendTransaction - Not implemented");
			throw new Error("signAndSendTransaction - Not implemented by wallet");
		}
		const [{ signature }] = yield signAndSendTransactionMethod({
			account: yield getCurrentAccount(),
			chain: getChain(),
			transaction: transaction.serialize({ requireAllSignatures: false })
		});
		return { signature: import_bs58.default.encode(signature) };
	});
	const signMessage = (message) => __awaiter$3(void 0, void 0, void 0, function* () {
		var _d;
		const signMessageMethod = (_d = features["solana:signMessage"]) === null || _d === void 0 ? void 0 : _d.signMessage;
		if (!signMessageMethod) {
			logger$2.error("signMessage - Not implemented");
			throw new Error("signMessage - Not implemented by wallet");
		}
		return { signature: (yield signMessageMethod({
			account: yield getCurrentAccount(),
			message
		}))[0].signature };
	});
	const on = (event, listener) => {
		var _a;
		const onMethod = (_a = features["standard:events"]) === null || _a === void 0 ? void 0 : _a.on;
		if (!onMethod) {
			logger$2.error("on - Not implemented");
			return;
		}
		logger$2.debug(`[SolanaWalletStandardConnector] - on: ${event}`);
		if (event !== "accountChanged") {
			logger$2.debug(`on - Not implemented for event: ${event}`);
			return;
		}
		const wrappedListener = (prop) => {
			var _a, _b;
			const publicKey = (_b = (_a = prop.accounts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.publicKey;
			if (publicKey) listener(new TextDecoder().decode(publicKey));
		};
		return onMethod("change", wrappedListener);
	};
	return {
		addListener: () => {
			throw new Error("addListener - Not implemented");
		},
		connect,
		disconnect,
		emit: () => {
			throw new Error("emit - Not implemented");
		},
		eventNames: () => {
			logger$2.error("eventNames - Not implemented");
			return [];
		},
		isBackpack: false,
		isBraveWallet: false,
		isConnected: hasAutoConnectedAccounts(),
		isExodus: false,
		isGlow: false,
		isMagicEden: false,
		isPhantom: false,
		isSolflare: false,
		listenerCount: () => {
			logger$2.error("listenerCount - Not implemented");
			return 0;
		},
		listeners: () => {
			logger$2.error("listeners - Not implemented");
			return [];
		},
		off: () => {
			throw new Error("off - Not implemented");
		},
		on,
		once: () => {
			throw new Error("once - Not implemented");
		},
		providers: [],
		get publicKey() {
			var _a, _b;
			if (!((_b = (_a = wallet.accounts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.publicKey)) return;
			return new PublicKey(wallet.accounts[0].publicKey);
		},
		removeAllListeners: () => {
			throw new Error("removeAllListeners - Not implemented");
		},
		removeListener: () => {
			throw new Error("removeListener - Not implemented");
		},
		send: () => {
			throw new Error("send - Not implemented");
		},
		signAllTransactions,
		signAndSendTransaction,
		signMessage,
		signTransaction
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/walletStandard/getConnectorConstructorForWalletStandardWallet/getConnectorConstructorForWalletStandardWallet.js
var getConnectorConstructorForWalletStandardWallet = (wallet, walletBookMetadata = {}, walletBookKey = void 0) => {
	const sanitizedName = sanitizeName(wallet.name);
	const ConnectorConstructor = class extends InjectedWalletBase {
		constructor(props) {
			super(Object.assign(Object.assign({}, props), { metadata: Object.assign(Object.assign({}, walletBookMetadata), {
				groupKey: sanitizedName,
				icon: wallet.icon,
				id: sanitizedName,
				name: wallet.name
			}) }));
			this.name = wallet.name;
			this.overrideKey = `${sanitizedName}sol`;
			this._provider = createSolanaSignerFromWalletStandard({
				wallet,
				walletConnector: this
			});
		}
		findProvider() {
			return this._provider;
		}
	};
	Object.defineProperty(ConnectorConstructor, "key", {
		value: walletBookKey !== null && walletBookKey !== void 0 ? walletBookKey : sanitizedName,
		writable: false
	});
	return ConnectorConstructor;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/walletStandard/getWalletStandardWallets/getWalletStandardWallets.js
var getWalletStandardWallets = () => {
	const { get, on } = getWallets();
	return {
		on,
		wallets: get()
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/walletStandard/hasAllWalletStandardRequiredFeatures/hasAllWalletStandardRequiredFeatures.js
var hasAllWalletStandardRequiredFeatures = (wallet, authMode = "connect-and-sign") => {
	var _a, _b, _c, _d;
	const hasBasicFeatures = Boolean(((_a = wallet.features) === null || _a === void 0 ? void 0 : _a["standard:events"]) && ((_b = wallet.features) === null || _b === void 0 ? void 0 : _b["standard:connect"]) && ((_c = wallet.features) === null || _c === void 0 ? void 0 : _c["solana:signTransaction"]));
	const hasAuthModeFeatures = authMode === "connect-and-sign" ? Boolean((_d = wallet.features) === null || _d === void 0 ? void 0 : _d["solana:signMessage"]) : true;
	return hasBasicFeatures && hasAuthModeFeatures;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/fetchInjectedWalletConnectors.js
/**
* Teardown for the active wallet-standard discovery (register listener + poll).
* Recreated on each fetchInjectedWalletConnectors call.
*/
var teardownSolanaWalletStandardDiscovery = null;
var SOLANA_WALLET_STANDARD_POLL_INTERVAL_MS = 300;
var SOLANA_WALLET_STANDARD_POLL_DURATION_MS = 5e3;
var injectedWalletOverrides = [
	CoinbaseSolana,
	BackpackSol,
	Solflare
];
var walletsWithCustomConnectors = [
	"coinbasesolana",
	"phantom",
	"phantomledger",
	"backpacksol",
	"solflare",
	"metamasksol"
];
var injectedWalletOverridesByWalletStandardName = {
	Backpack: BackpackSol,
	"Coinbase Wallet": CoinbaseSolana,
	Phantom,
	Solflare
};
var shouldAddWalletStandardConnector = (wallet, walletBook, authMode) => {
	var _a;
	const { name } = wallet;
	const chain = "sol";
	const connectorKey = `${sanitizeName(name)}${chain}`;
	logger$2.logVerboseTroubleshootingMessage("[SOL shouldAddWalletStandardConnector]", name, chain, connectorKey, wallet.features);
	const shouldHandleWalletFromWalletBook = ([key, wallet]) => {
		var _a, _b, _c, _d, _e, _f;
		const hasMatchingKey = key === connectorKey;
		const needsCustomConnector = walletsWithCustomConnectors.includes(connectorKey);
		const hasMatchingNameAndChain = wallet.name === name && ((_b = (_a = wallet.injectedConfig) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.chain) === chain;
		const isNotWalletStandard = !((_f = (_e = (_d = (_c = wallet.injectedConfig) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.walletStandard) === null || _e === void 0 ? void 0 : _e.features) === null || _f === void 0 ? void 0 : _f.length);
		return (hasMatchingKey || needsCustomConnector || hasMatchingNameAndChain) && isNotWalletStandard;
	};
	const shouldHandleFromWalletBook = Object.entries((_a = walletBook === null || walletBook === void 0 ? void 0 : walletBook.wallets) !== null && _a !== void 0 ? _a : {}).find(shouldHandleWalletFromWalletBook);
	const hasAllFeatures = hasAllWalletStandardRequiredFeatures(wallet, authMode);
	logger$2.logVerboseTroubleshootingMessage("[SOL shouldAddWalletStandardConnector]", {
		hasAllFeatures,
		shouldAdd: !shouldHandleFromWalletBook && hasAllFeatures,
		shouldHandleFromWalletBook
	});
	return !shouldHandleFromWalletBook && hasAllFeatures;
};
var emitWalletStandardConnector = (wallet, walletBook) => {
	var _a, _b;
	logger$2.logVerboseTroubleshootingMessage("[SOL fetchInjectedWalletConnectors] Emitting providerInjected for wallet-standard wallet", wallet.name);
	const walletBookWallet = findWalletBookWalletByNameAndChain(walletBook, wallet.name, "sol");
	const walletKey = walletBookWallet ? (_b = Object.entries((_a = walletBook === null || walletBook === void 0 ? void 0 : walletBook.wallets) !== null && _a !== void 0 ? _a : {}).find(([, entry]) => entry === walletBookWallet)) === null || _b === void 0 ? void 0 : _b[0] : void 0;
	const injectedConnectorConstructor = getConnectorConstructorForWalletStandardWallet(wallet, walletBookWallet && getWalletMetadataFromWalletBook({
		walletBook,
		walletBookWallet,
		walletKey: walletKey !== null && walletKey !== void 0 ? walletKey : `${sanitizeName(wallet.name)}sol`
	}), walletKey);
	walletConnectorEvents.emit("providerInjected", { injectedConnectorConstructor });
};
var setupSolanaWalletStandardDiscovery = (walletBook, authMode) => {
	if (typeof window === "undefined") return;
	teardownSolanaWalletStandardDiscovery === null || teardownSolanaWalletStandardDiscovery === void 0 || teardownSolanaWalletStandardDiscovery();
	const discoveredWallets = /* @__PURE__ */ new Set();
	const handleWallet = (wallet) => {
		if (discoveredWallets.has(wallet.name)) return;
		const overrideConstructor = injectedWalletOverridesByWalletStandardName[wallet.name];
		if (overrideConstructor) {
			discoveredWallets.add(wallet.name);
			logger$2.logVerboseTroubleshootingMessage("[SOL fetchInjectedWalletConnectors] Emitting providerInjected for late-registered custom connector wallet", wallet.name);
			walletConnectorEvents.emit("providerInjected", { injectedConnectorConstructor: overrideConstructor });
			return;
		}
		if (!shouldAddWalletStandardConnector(wallet, walletBook, authMode)) return;
		discoveredWallets.add(wallet.name);
		emitWalletStandardConnector(wallet, walletBook);
	};
	const { on, wallets: initialWallets } = getWalletStandardWallets();
	initialWallets.forEach((wallet) => {
		if (injectedWalletOverridesByWalletStandardName[wallet.name] || shouldAddWalletStandardConnector(wallet, walletBook, authMode)) discoveredWallets.add(wallet.name);
	});
	const removeRegisterListener = on("register", handleWallet);
	const pollForNewWallets = () => {
		getWalletStandardWallets().wallets.forEach(handleWallet);
	};
	const pollIntervalId = setInterval(pollForNewWallets, SOLANA_WALLET_STANDARD_POLL_INTERVAL_MS);
	const pollTimeoutId = setTimeout(() => {
		clearInterval(pollIntervalId);
	}, SOLANA_WALLET_STANDARD_POLL_DURATION_MS);
	teardownSolanaWalletStandardDiscovery = () => {
		removeRegisterListener === null || removeRegisterListener === void 0 || removeRegisterListener();
		clearInterval(pollIntervalId);
		clearTimeout(pollTimeoutId);
	};
};
var fetchInjectedWalletConnectors = ({ walletBook, authMode }) => {
	var _a;
	setupSolanaWalletStandardDiscovery(walletBook, authMode);
	const walletBookConnectors = Object.entries((_a = walletBook === null || walletBook === void 0 ? void 0 : walletBook.wallets) !== null && _a !== void 0 ? _a : {}).filter(([key, wallet]) => {
		var _a, _b, _c;
		const injectedConfig = (_a = wallet.injectedConfig) === null || _a === void 0 ? void 0 : _a.find((config) => config.chain === "sol");
		const isSolanaWallet = Boolean(injectedConfig);
		const shouldBeFiltered = walletsWithCustomConnectors.includes(key) || ((_c = (_b = injectedConfig === null || injectedConfig === void 0 ? void 0 : injectedConfig.walletStandard) === null || _b === void 0 ? void 0 : _b.features) === null || _c === void 0 ? void 0 : _c.length);
		return isSolanaWallet && !shouldBeFiltered;
	}).map(([key, wallet]) => getConnectorConstructorInjectedWallet({
		key,
		wallet,
		walletBook
	}));
	const { wallets: walletStandardWallets } = getWalletStandardWallets();
	const walletStandardConnectors = walletStandardWallets.filter((wallet) => shouldAddWalletStandardConnector(wallet, walletBook, authMode)).map((wallet) => {
		var _a, _b;
		const [walletBookKey, walletBookWallet] = (_b = Object.entries((_a = walletBook === null || walletBook === void 0 ? void 0 : walletBook.wallets) !== null && _a !== void 0 ? _a : {}).find(([, walletBookEntry]) => {
			var _a, _b;
			return walletBookEntry.name === wallet.name && ((_b = (_a = walletBookEntry.injectedConfig) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.chain) === "sol";
		})) !== null && _b !== void 0 ? _b : [];
		return getConnectorConstructorForWalletStandardWallet(wallet, walletBookWallet && getWalletMetadataFromWalletBook({
			walletBook,
			walletBookWallet,
			/* istanbul ignore next */
			walletKey: walletBookKey !== null && walletBookKey !== void 0 ? walletBookKey : `${sanitizeName(wallet.name)}sol`
		}), walletBookKey);
	});
	logger$2.logVerboseTroubleshootingMessage("[SOL fetchInjectedWalletConnectors] walletStandardConnectors", walletStandardConnectors.map((w) => w.name));
	return [...walletBookConnectors, ...walletStandardConnectors];
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/injected/FallbackSolanaConnector/FallbackSolanaConnector.js
var FallbackSolanaConnector = class extends InjectedWalletBase {
	constructor() {
		super(...arguments);
		this.name = "Fallback Connector";
		this.overrideKey = "fallbackconnector";
		this.isAvailable = false;
	}
	isInstalledOnBrowser() {
		return false;
	}
};
Object.defineProperty(FallbackSolanaConnector, "key", {
	value: "fallbackconnector",
	writable: false
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/walletConnect/utils/getSolanaWalletConnectConnector/getSolanaWalletConnectConnector.js
var getSolanaWalletConnectConnector = () => {
	const SolanaWalletConnectConnectorConstructor = class extends SolanaWalletConnectConnector {
		constructor(props) {
			super(Object.assign(Object.assign({}, props), {
				metadata: {
					groupKey: "walletconnect",
					name: "WalletConnect"
				},
				walletName: "WalletConnect Sol"
			}));
		}
	};
	Object.defineProperty(SolanaWalletConnectConnectorConstructor, "key", {
		value: "walletconnectsol",
		writable: false
	});
	return SolanaWalletConnectConnectorConstructor;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/walletConnect/utils/addSolanaWalletConnectConnectors/addSolanaWalletConnectConnectors.js
/**
* Adds Solana WalletConnect connectors to the list of connectors, avoiding duplicates
* by checking what connectors are already present
*/
var addSolanaWalletConnectConnectors = ({ walletBook, connectors: currentConnectors }) => {
	var _a;
	const walletEntries = Object.entries((_a = walletBook === null || walletBook === void 0 ? void 0 : walletBook.wallets) !== null && _a !== void 0 ? _a : {});
	const allWcConstructors = walletEntries.filter(([, wallet]) => {
		var _a;
		return wallet.walletConnect && ((_a = wallet.chains) === null || _a === void 0 ? void 0 : _a.some((chain) => chain.includes("solana:")));
	}).map(([key, wallet]) => {
		const { shortName } = wallet;
		const name = shortName || wallet.name;
		const SolanaWalletConnectConnectorConstructor = class extends SolanaWalletConnectConnector {
			constructor(props) {
				super(Object.assign(Object.assign({}, props), {
					metadata: getWalletMetadataFromWalletBook({
						walletBook,
						walletBookWallet: wallet,
						walletKey: key
					}),
					overrideKey: key,
					walletName: name
				}));
				this.overrideKey = key;
			}
		};
		const entryKeysWithSameGroup = walletEntries.filter(([, { group }]) => group && group === wallet.group).map(([key]) => key);
		Object.defineProperty(SolanaWalletConnectConnectorConstructor, "key", {
			value: key,
			writable: false
		});
		Object.defineProperty(SolanaWalletConnectConnectorConstructor, "groupedKeys", {
			value: entryKeysWithSameGroup,
			writable: false
		});
		return SolanaWalletConnectConnectorConstructor;
	});
	let filteredWcConstructors = allWcConstructors;
	if (currentConnectors.length > 0) filteredWcConstructors = allWcConstructors.filter((constructor) => currentConnectors.every((existingConnector) => existingConnector["key"] !== constructor["key"] && !constructor["groupedKeys"].includes(existingConnector["key"])));
	return [...currentConnectors, ...filteredWcConstructors];
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1.0_db0_6100aa317f73d365048e4245d2bce7e0/node_modules/@dynamic-labs/solana/src/SolanaWalletConnectors.js
var SolanaWalletConnectors = (props) => {
	const hasSolanaNetworks = (props.solNetworks || []).length > 0;
	const initialConnectors = [
		...injectedWalletOverrides,
		...fetchInjectedWalletConnectors(props),
		...TurnkeySolanaWalletConnectors(props),
		...DynamicWaasSVMConnectors(),
		...MetaMaskSolanaWalletConnectors(props),
		Phantom,
		FallbackSolanaConnector,
		...hasSolanaNetworks ? [getSolanaWalletConnectConnector()] : []
	];
	if (!hasSolanaNetworks) return initialConnectors;
	return addSolanaWalletConnectConnectors({
		connectors: initialConnectors,
		walletBook: props.walletBook
	});
};
//#endregion
export { base64$1 as n, SolanaWalletConnectors as t };
