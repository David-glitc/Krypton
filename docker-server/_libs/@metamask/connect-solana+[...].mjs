import { r as __exportAll } from "../../_runtime.mjs";
import { n as esm_default } from "../@dynamic-labs-connectors/metamask-solana+[...].mjs";
import { n as createMultichainClient, t as createLogger } from "./connect-multichain+[...].mjs";
//#region ../../node_modules/.pnpm/@solana+wallet-standard-features@1.3.0/node_modules/@solana/wallet-standard-features/lib/esm/signAndSendTransaction.js
/** Name of the feature. */
var SolanaSignAndSendTransaction = "solana:signAndSendTransaction";
//#endregion
//#region ../../node_modules/.pnpm/@solana+wallet-standard-features@1.3.0/node_modules/@solana/wallet-standard-features/lib/esm/signIn.js
/** Name of the feature. */
var SolanaSignIn = "solana:signIn";
//#endregion
//#region ../../node_modules/.pnpm/@solana+wallet-standard-features@1.3.0/node_modules/@solana/wallet-standard-features/lib/esm/signMessage.js
/** Name of the feature. */
var SolanaSignMessage = "solana:signMessage";
//#endregion
//#region ../../node_modules/.pnpm/@solana+wallet-standard-features@1.3.0/node_modules/@solana/wallet-standard-features/lib/esm/signTransaction.js
/** Name of the feature. */
var SolanaSignTransaction = "solana:signTransaction";
//#endregion
//#region ../../node_modules/.pnpm/@wallet-standard+features@1.1.1/node_modules/@wallet-standard/features/lib/esm/connect.js
/** Name of the feature. */
var StandardConnect = "standard:connect";
//#endregion
//#region ../../node_modules/.pnpm/@wallet-standard+features@1.1.1/node_modules/@wallet-standard/features/lib/esm/disconnect.js
/** Name of the feature. */
var StandardDisconnect = "standard:disconnect";
//#endregion
//#region ../../node_modules/.pnpm/@wallet-standard+features@1.1.1/node_modules/@wallet-standard/features/lib/esm/events.js
/** Name of the feature. */
var StandardEvents = "standard:events";
//#endregion
//#region ../../node_modules/.pnpm/@wallet-standard+wallet@1.1.1/node_modules/@wallet-standard/wallet/lib/esm/register.js
var __classPrivateFieldGet$3 = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet$3 = function(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _RegisterWalletEvent_detail;
/**
* Register a {@link "@wallet-standard/base".Wallet} as a Standard Wallet with the app.
*
* This dispatches a {@link "@wallet-standard/base".WindowRegisterWalletEvent} to notify the app that the Wallet is
* ready to be registered.
*
* This also adds a listener for {@link "@wallet-standard/base".WindowAppReadyEvent} to listen for a notification from
* the app that the app is ready to register the Wallet.
*
* This combination of event dispatch and listener guarantees that the Wallet will be registered synchronously as soon
* as the app is ready whether the Wallet loads before or after the app.
*
* @param wallet Wallet to register.
*
* @group Wallet
*/
function registerWallet(wallet) {
	const callback = ({ register }) => register(wallet);
	try {
		window.dispatchEvent(new RegisterWalletEvent(callback));
	} catch (error) {
		console.error("wallet-standard:register-wallet event could not be dispatched\n", error);
	}
	try {
		window.addEventListener("wallet-standard:app-ready", ({ detail: api }) => callback(api));
	} catch (error) {
		console.error("wallet-standard:app-ready event listener could not be added\n", error);
	}
}
var RegisterWalletEvent = class extends Event {
	get detail() {
		return __classPrivateFieldGet$3(this, _RegisterWalletEvent_detail, "f");
	}
	get type() {
		return "wallet-standard:register-wallet";
	}
	constructor(callback) {
		super("wallet-standard:register-wallet", {
			bubbles: false,
			cancelable: false,
			composed: false
		});
		_RegisterWalletEvent_detail.set(this, void 0);
		__classPrivateFieldSet$3(this, _RegisterWalletEvent_detail, callback, "f");
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
_RegisterWalletEvent_detail = /* @__PURE__ */ new WeakMap();
//#endregion
//#region ../../node_modules/.pnpm/@wallet-standard+wallet@1.1.1/node_modules/@wallet-standard/wallet/lib/esm/util.js
var __classPrivateFieldGet$2 = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet$2 = function(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _ReadonlyWalletAccount_address, _ReadonlyWalletAccount_publicKey, _ReadonlyWalletAccount_chains, _ReadonlyWalletAccount_features, _ReadonlyWalletAccount_label, _ReadonlyWalletAccount_icon;
/**
* Base implementation of a {@link "@wallet-standard/base".WalletAccount} to be used or extended by a
* {@link "@wallet-standard/base".Wallet}.
*
* `WalletAccount` properties must be read-only. This class enforces this by making all properties
* [truly private](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) and
* read-only, using getters for access, returning copies instead of references, and calling
* [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
* on the instance.
*
* @group Account
*/
var ReadonlyWalletAccount = class ReadonlyWalletAccount {
	/** Implementation of {@link "@wallet-standard/base".WalletAccount.address | WalletAccount::address} */
	get address() {
		return __classPrivateFieldGet$2(this, _ReadonlyWalletAccount_address, "f");
	}
	/** Implementation of {@link "@wallet-standard/base".WalletAccount.publicKey | WalletAccount::publicKey} */
	get publicKey() {
		return __classPrivateFieldGet$2(this, _ReadonlyWalletAccount_publicKey, "f").slice();
	}
	/** Implementation of {@link "@wallet-standard/base".WalletAccount.chains | WalletAccount::chains} */
	get chains() {
		return __classPrivateFieldGet$2(this, _ReadonlyWalletAccount_chains, "f").slice();
	}
	/** Implementation of {@link "@wallet-standard/base".WalletAccount.features | WalletAccount::features} */
	get features() {
		return __classPrivateFieldGet$2(this, _ReadonlyWalletAccount_features, "f").slice();
	}
	/** Implementation of {@link "@wallet-standard/base".WalletAccount.label | WalletAccount::label} */
	get label() {
		return __classPrivateFieldGet$2(this, _ReadonlyWalletAccount_label, "f");
	}
	/** Implementation of {@link "@wallet-standard/base".WalletAccount.icon | WalletAccount::icon} */
	get icon() {
		return __classPrivateFieldGet$2(this, _ReadonlyWalletAccount_icon, "f");
	}
	/**
	* Create and freeze a read-only account.
	*
	* @param account Account to copy properties from.
	*/
	constructor(account) {
		_ReadonlyWalletAccount_address.set(this, void 0);
		_ReadonlyWalletAccount_publicKey.set(this, void 0);
		_ReadonlyWalletAccount_chains.set(this, void 0);
		_ReadonlyWalletAccount_features.set(this, void 0);
		_ReadonlyWalletAccount_label.set(this, void 0);
		_ReadonlyWalletAccount_icon.set(this, void 0);
		if (new.target === ReadonlyWalletAccount) Object.freeze(this);
		__classPrivateFieldSet$2(this, _ReadonlyWalletAccount_address, account.address, "f");
		__classPrivateFieldSet$2(this, _ReadonlyWalletAccount_publicKey, account.publicKey.slice(), "f");
		__classPrivateFieldSet$2(this, _ReadonlyWalletAccount_chains, account.chains.slice(), "f");
		__classPrivateFieldSet$2(this, _ReadonlyWalletAccount_features, account.features.slice(), "f");
		__classPrivateFieldSet$2(this, _ReadonlyWalletAccount_label, account.label, "f");
		__classPrivateFieldSet$2(this, _ReadonlyWalletAccount_icon, account.icon, "f");
	}
};
_ReadonlyWalletAccount_address = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_publicKey = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_chains = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_features = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_label = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_icon = /* @__PURE__ */ new WeakMap();
//#endregion
//#region ../../node_modules/.pnpm/@solana+wallet-standard-chains@1.1.1/node_modules/@solana/wallet-standard-chains/lib/esm/index.js
/** Solana Mainnet (beta) cluster, e.g. https://api.mainnet-beta.solana.com */
var SOLANA_MAINNET_CHAIN = "solana:mainnet";
/** Solana Devnet cluster, e.g. https://api.devnet.solana.com */
var SOLANA_DEVNET_CHAIN = "solana:devnet";
/** Solana Testnet cluster, e.g. https://api.testnet.solana.com */
var SOLANA_TESTNET_CHAIN = "solana:testnet";
//#endregion
//#region ../../node_modules/.pnpm/@metamask+solana-wallet-standard@0.6.0/node_modules/@metamask/solana-wallet-standard/dist/icon.mjs
var metamaskIcon = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjIzIiBoZWlnaHQ9IjIzIiB4PSIzLjUiIHk9IjMuNSIgdmlld0JveD0iMCAwIDE0MS41MSAxMzYuNDIiPjxwYXRoIGZpbGw9IiNGRjVDMTYiIGQ9Im0xMzIuMjQgMTMxLjc1LTMwLjQ4LTkuMDctMjIuOTkgMTMuNzQtMTYuMDMtLjAxLTIzLTEzLjc0LTMwLjQ3IDkuMDhMMCAxMDAuNDdsOS4yNy0zNC43M0wwIDM2LjQgOS4yNyAwbDQ3LjYgMjguNDRoMjcuNzZMMTMyLjI0IDBsOS4yNyAzNi4zOC05LjI3IDI5LjM2IDkuMjcgMzQuNzItOS4yNyAzMS4zWiIvPjxwYXRoIGZpbGw9IiNGRjVDMTYiIGQ9Im05LjI3IDAgNDcuNjEgMjguNDZMNTQuOTggNDggOS4yOSAwWm0zMC40NyAxMDAuNDggMjAuOTUgMTUuOTUtMjAuOTUgNi4yNHYtMjIuMlpNNTkuMDEgNzQuMSA1NSA0OCAyOS4yMiA2NS43NWgtLjAybC4wOCAxOC4yNyAxMC40NS05LjkyaDE5LjI5Wk0xMzIuMjUgMGwtNDcuNiAyOC40Nkw4Ni41MSA0OGw0NS43Mi00OFptLTMwLjQ3IDEwMC40OC0yMC45NCAxNS45NSAyMC45NCA2LjI0di0yMi4yWm0xMC41My0zNC43M0w4Ni41MyA0OCA4Mi41IDc0LjFoMTkuMjdsMTAuNDYgOS45LjA3LTE4LjI2WiIvPjxwYXRoIGZpbGw9IiNFMzQ4MDciIGQ9Im0zOS43MyAxMjIuNjctMzAuNDYgOS4wOEwwIDEwMC40OGgzOS43M3YyMi4yWk01OS4wMiA3NC4xbDUuODIgMzcuNzEtOC4wNy0yMC45Ny0yNy40OS02LjgyIDEwLjQ2LTkuOTJINTlabTQyLjc2IDQ4LjU5IDMwLjQ3IDkuMDcgOS4yNy0zMS4yN2gtMzkuNzR6TTgyLjUgNzQuMDlsLTUuODIgMzcuNzEgOC4wNi0yMC45NyAyNy41LTYuODItMTAuNDctOS45MnoiLz48cGF0aCBmaWxsPSIjRkY4RDVEIiBkPSJtMCAxMDAuNDcgOS4yNy0zNC43M0gyOS4ybC4wNyAxOC4yNyAyNy41IDYuODIgOC4wNiAyMC45Ny00LjE1IDQuNjItMjAuOTQtMTUuOTZIMFptMTQxLjUgMC05LjI2LTM0LjczaC0xOS45M2wtLjA3IDE4LjI3LTI3LjUgNi44Mi04LjA2IDIwLjk3IDQuMTUgNC42MiAyMC45NC0xNS45NmgzOS43NFpNODQuNjQgMjguNDRINTYuODhsLTEuODkgMTkuNTQgOS44NCA2My44aDExLjg1bDkuODUtNjMuOC0xLjktMTkuNTRaIi8+PHBhdGggZmlsbD0iIzY2MTgwMCIgZD0iTTkuMjcgMCAwIDM2LjM4bDkuMjcgMjkuMzZIMjkuMkw1NC45OCA0OHptNDMuOTggODEuNjdoLTkuMDNsLTQuOTIgNC44MSAxNy40NyA0LjMzLTMuNTItOS4xNVpNMTMyLjI0IDBsOS4yNyAzNi4zOC05LjI3IDI5LjM2aC0xOS45M0w4Ni41MyA0OHpNODguMjcgODEuNjdoOS4wNGw0LjkyIDQuODItMTcuNDkgNC4zNCAzLjUzLTkuMTdabS05LjUgNDIuMyAyLjA2LTcuNTQtNC4xNS00LjYySDY0LjgybC00LjE0IDQuNjIgMi4wNSA3LjU0Ii8+PHBhdGggZmlsbD0iI0MwQzRDRCIgZD0iTTc4Ljc3IDEyMy45N3YxMi40NUg2Mi43NHYtMTIuNDVoMTYuMDJaIi8+PHBhdGggZmlsbD0iI0U3RUJGNiIgZD0ibTM5Ljc0IDEyMi42NiAyMyAxMy43NnYtMTIuNDZsLTIuMDUtNy41NHptNjIuMDMgMC0yMyAxMy43NnYtMTIuNDZsMi4wNi03LjU0eiIvPjwvc3ZnPjwvc3ZnPg==";
//#endregion
//#region ../../node_modules/.pnpm/@metamask+solana-wallet-standard@0.6.0/node_modules/@metamask/solana-wallet-standard/dist/types.mjs
var Scope;
(function(Scope) {
	Scope["MAINNET"] = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
	Scope["DEVNET"] = "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1";
	Scope["TESTNET"] = "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z";
})(Scope || (Scope = {}));
var scopes = Object.values(Scope);
//#endregion
//#region ../../node_modules/.pnpm/@metamask+solana-wallet-standard@0.6.0/node_modules/@metamask/solana-wallet-standard/dist/utils.mjs
var CAIP_ACCOUNT_ID_REGEX = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})):(?<accountAddress>[-.%a-zA-Z0-9]{1,128})$/u;
/**
* Validates and parses a CAIP-10 account ID.
*
* @param caipAccountId - The CAIP-10 account ID to validate and parse.
* @returns The CAIP-10 address.
*/
function getAddressFromCaipAccountId(caipAccountId) {
	const match = CAIP_ACCOUNT_ID_REGEX.exec(caipAccountId);
	if (!match?.groups?.accountAddress) throw new Error("Invalid CAIP account ID.");
	return match.groups.accountAddress;
}
function getScopeFromWalletStandardChain(chainId) {
	switch (chainId) {
		case SOLANA_MAINNET_CHAIN:
		case void 0: return Scope.MAINNET;
		case SOLANA_TESTNET_CHAIN: return Scope.TESTNET;
		case SOLANA_DEVNET_CHAIN: return Scope.DEVNET;
		default:
			if (scopes.includes(chainId)) return chainId;
			throw new Error(`Unsupported chainId: ${chainId}`);
	}
}
function isAccountChangedEvent(event) {
	return event.params?.notification?.method === "metamask_accountsChanged";
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+solana-wallet-standard@0.6.0/node_modules/@metamask/solana-wallet-standard/dist/wallet.mjs
var __classPrivateFieldGet$1 = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet$1 = function(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _MetamaskWallet_instances, _MetamaskWallet_listeners, _MetamaskWallet_selectedAddressOnPageLoadPromise, _MetamaskWallet_account, _MetamaskWallet_removeAccountsChangedListener, _MetamaskWallet_on, _MetamaskWallet_emit, _MetamaskWallet_off, _MetamaskWallet_connect, _MetamaskWallet_signIn, _MetamaskWallet_disconnect, _MetamaskWallet_signAndSendTransaction, _MetamaskWallet_signTransaction, _MetamaskWallet_signMessage, _MetamaskWallet_handleAccountsChangedEvent, _MetamaskWallet_getAccountFromAddress, _MetamaskWallet_validateSendTransactionInput, _MetamaskWallet_tryRestoringSession, _MetamaskWallet_createSession;
var MetamaskWalletAccount = class MetamaskWalletAccount extends ReadonlyWalletAccount {
	constructor({ address, publicKey, chains }) {
		super({
			address,
			publicKey,
			chains,
			features: [
				SolanaSignAndSendTransaction,
				SolanaSignTransaction,
				SolanaSignMessage,
				SolanaSignIn
			]
		});
		if (new.target === MetamaskWalletAccount) Object.freeze(this);
	}
};
var MetamaskWallet = class {
	/**
	* Listen for up to 2 seconds to the accountsChanged event emitted on page load
	* @returns If any, the initial selected address
	*/
	getInitialSelectedAddress() {
		return new Promise((resolve) => {
			const timeout = setTimeout(() => {
				resolve(void 0);
			}, 2e3);
			const handleAccountChange = (data) => {
				if (isAccountChangedEvent(data)) {
					const address = data?.params?.notification?.params?.[0];
					if (address) {
						clearTimeout(timeout);
						removeNotification?.();
						resolve(address);
					}
				}
			};
			const removeNotification = this.client.onNotification(handleAccountChange);
		});
	}
	get accounts() {
		return __classPrivateFieldGet$1(this, _MetamaskWallet_account, "f") ? [__classPrivateFieldGet$1(this, _MetamaskWallet_account, "f")] : [];
	}
	get features() {
		return {
			[StandardConnect]: {
				version: this.version,
				connect: __classPrivateFieldGet$1(this, _MetamaskWallet_connect, "f")
			},
			[SolanaSignIn]: {
				version: this.version,
				signIn: __classPrivateFieldGet$1(this, _MetamaskWallet_signIn, "f")
			},
			[StandardDisconnect]: {
				version: this.version,
				disconnect: __classPrivateFieldGet$1(this, _MetamaskWallet_disconnect, "f")
			},
			[StandardEvents]: {
				version: this.version,
				on: __classPrivateFieldGet$1(this, _MetamaskWallet_on, "f")
			},
			[SolanaSignAndSendTransaction]: {
				version: this.version,
				supportedTransactionVersions: ["legacy", 0],
				signAndSendTransaction: __classPrivateFieldGet$1(this, _MetamaskWallet_signAndSendTransaction, "f")
			},
			[SolanaSignTransaction]: {
				version: this.version,
				supportedTransactionVersions: ["legacy", 0],
				signTransaction: __classPrivateFieldGet$1(this, _MetamaskWallet_signTransaction, "f")
			},
			[SolanaSignMessage]: {
				version: this.version,
				signMessage: __classPrivateFieldGet$1(this, _MetamaskWallet_signMessage, "f")
			}
		};
	}
	constructor({ client, walletName }) {
		_MetamaskWallet_instances.add(this);
		_MetamaskWallet_listeners.set(this, {});
		this.version = "1.0.0";
		this.icon = metamaskIcon;
		this.chains = [
			SOLANA_MAINNET_CHAIN,
			SOLANA_DEVNET_CHAIN,
			SOLANA_TESTNET_CHAIN
		];
		_MetamaskWallet_selectedAddressOnPageLoadPromise.set(this, void 0);
		_MetamaskWallet_account.set(this, void 0);
		_MetamaskWallet_removeAccountsChangedListener.set(this, void 0);
		_MetamaskWallet_on.set(this, (event, listener) => {
			if (__classPrivateFieldGet$1(this, _MetamaskWallet_listeners, "f")[event]) __classPrivateFieldGet$1(this, _MetamaskWallet_listeners, "f")[event]?.push(listener);
			else __classPrivateFieldGet$1(this, _MetamaskWallet_listeners, "f")[event] = [listener];
			return () => __classPrivateFieldGet$1(this, _MetamaskWallet_instances, "m", _MetamaskWallet_off).call(this, event, listener);
		});
		_MetamaskWallet_connect.set(this, async () => {
			if (this.accounts.length) return { accounts: this.accounts };
			await __classPrivateFieldGet$1(this, _MetamaskWallet_tryRestoringSession, "f").call(this);
			if (!this.accounts.length) await __classPrivateFieldGet$1(this, _MetamaskWallet_createSession, "f").call(this, Scope.MAINNET);
			if (!this.accounts.length) return { accounts: [] };
			__classPrivateFieldSet$1(this, _MetamaskWallet_removeAccountsChangedListener, this.client.onNotification(__classPrivateFieldGet$1(this, _MetamaskWallet_instances, "m", _MetamaskWallet_handleAccountsChangedEvent).bind(this)), "f");
			return { accounts: this.accounts };
		});
		_MetamaskWallet_signIn.set(this, async (...inputs) => {
			if (!__classPrivateFieldGet$1(this, _MetamaskWallet_account, "f") || !this.scope) {
				await __classPrivateFieldGet$1(this, _MetamaskWallet_connect, "f").call(this);
				if (!__classPrivateFieldGet$1(this, _MetamaskWallet_account, "f") || !this.scope) throw new Error("Not connected");
			}
			const results = [];
			for (const input of inputs) {
				const signInRes = await this.client.invokeMethod({
					scope: this.scope,
					request: {
						method: "signIn",
						params: {
							...input,
							domain: input.domain || window.location.host,
							address: input.address || __classPrivateFieldGet$1(this, _MetamaskWallet_account, "f").address
						}
					}
				});
				results.push({
					account: __classPrivateFieldGet$1(this, _MetamaskWallet_account, "f"),
					signedMessage: Buffer.from(signInRes.signedMessage, "base64"),
					signature: esm_default.decode(signInRes.signature)
				});
			}
			return results;
		});
		_MetamaskWallet_disconnect.set(this, async (options = {}) => {
			const { revokeSession = true } = options;
			__classPrivateFieldSet$1(this, _MetamaskWallet_account, void 0, "f");
			this.scope = void 0;
			__classPrivateFieldGet$1(this, _MetamaskWallet_removeAccountsChangedListener, "f")?.call(this);
			__classPrivateFieldSet$1(this, _MetamaskWallet_removeAccountsChangedListener, void 0, "f");
			__classPrivateFieldGet$1(this, _MetamaskWallet_instances, "m", _MetamaskWallet_emit).call(this, "change", { accounts: this.accounts });
			if (revokeSession) await this.client.revokeSession({ scopes: [
				Scope.MAINNET,
				Scope.DEVNET,
				Scope.TESTNET
			] });
		});
		_MetamaskWallet_signAndSendTransaction.set(this, async (...inputs) => {
			const account = __classPrivateFieldGet$1(this, _MetamaskWallet_account, "f");
			if (!account) throw new Error("Not connected");
			__classPrivateFieldGet$1(this, _MetamaskWallet_validateSendTransactionInput, "f").call(this, inputs);
			const scope = getScopeFromWalletStandardChain(inputs[0]?.chain);
			if (((await this.client.getSession())?.sessionScopes[scope]?.accounts)?.includes(`${scope}:${account.address}`)) this.scope = scope;
			else await __classPrivateFieldGet$1(this, _MetamaskWallet_createSession, "f").call(this, scope, [account.address]);
			const results = [];
			for (const { transaction: transactionBuffer, account } of inputs) {
				const transaction = Buffer.from(transactionBuffer).toString("base64");
				const signAndSendTransactionRes = await this.client.invokeMethod({
					scope,
					request: {
						method: "signAndSendTransaction",
						params: {
							account: { address: account.address },
							transaction,
							scope
						}
					}
				});
				results.push({ signature: esm_default.decode(signAndSendTransactionRes.signature) });
			}
			return results;
		});
		_MetamaskWallet_signTransaction.set(this, async (...inputs) => {
			if (!this.scope) throw new Error("Not connected");
			const results = [];
			for (const { transaction: transactionBuffer, account } of inputs) {
				const transaction = Buffer.from(transactionBuffer).toString("base64");
				const signTransactionRes = await this.client.invokeMethod({
					scope: this.scope,
					request: {
						method: "signTransaction",
						params: {
							account: { address: account.address },
							transaction,
							scope: this.scope
						}
					}
				});
				results.push({ signedTransaction: Uint8Array.from(Buffer.from(signTransactionRes.signedTransaction, "base64")) });
			}
			return results;
		});
		_MetamaskWallet_signMessage.set(this, async (...inputs) => {
			if (!this.scope) throw new Error("Not connected");
			const results = [];
			for (const { message: messageBuffer, account } of inputs) {
				const message = Buffer.from(messageBuffer).toString("base64");
				const signMessageRes = await this.client.invokeMethod({
					scope: this.scope,
					request: {
						method: "signMessage",
						params: {
							message,
							account: { address: account.address }
						}
					}
				});
				results.push({
					signedMessage: Buffer.from(signMessageRes.signedMessage, "base64"),
					signature: esm_default.decode(signMessageRes.signature),
					signatureType: signMessageRes.signatureType
				});
			}
			return results;
		});
		_MetamaskWallet_validateSendTransactionInput.set(this, (inputs) => {
			const accountAddress = __classPrivateFieldGet$1(this, _MetamaskWallet_account, "f")?.address;
			const firstChain = inputs[0]?.chain;
			for (const { account: { address: transactionAddress }, chain } of inputs) {
				if (transactionAddress !== accountAddress) throw new Error("Invalid transaction addresses");
				if (chain !== firstChain) throw new Error("All transactions must be on the same chain");
			}
		});
		_MetamaskWallet_tryRestoringSession.set(this, async () => {
			try {
				const existingSession = await this.client.getSession();
				if (!existingSession) return;
				const account = await __classPrivateFieldGet$1(this, _MetamaskWallet_selectedAddressOnPageLoadPromise, "f");
				this.updateSession(existingSession, account);
			} catch (error) {
				console.warn("Error restoring session", error);
			}
		});
		_MetamaskWallet_createSession.set(this, async (scope, addresses) => {
			let resolvePromise;
			const waitForAccountChangedPromise = new Promise((resolve) => {
				resolvePromise = resolve;
			});
			const handleAccountChange = (data) => {
				if (!isAccountChangedEvent(data)) return;
				const selectedAddress = data?.params?.notification?.params?.[0];
				if (selectedAddress) {
					removeNotification();
					resolvePromise(selectedAddress);
				}
			};
			const removeNotification = this.client.onNotification(handleAccountChange);
			const session = await this.client.createSession({
				optionalScopes: { [scope]: {
					...addresses ? { accounts: addresses.map((address) => `${scope}:${address}`) } : {},
					methods: [],
					notifications: []
				} },
				sessionProperties: { solana_accountChanged_notifications: true }
			});
			const selectedAddress = await Promise.race([waitForAccountChangedPromise, new Promise((resolve) => setTimeout(() => resolve(void 0), 200))]);
			this.updateSession(session, selectedAddress);
		});
		this.client = client;
		this.name = `${walletName ?? "MetaMask"}`;
		__classPrivateFieldSet$1(this, _MetamaskWallet_selectedAddressOnPageLoadPromise, this.getInitialSelectedAddress(), "f");
	}
	/**
	* Updates the session and the account to connect to.
	* This method handles the logic for selecting the appropriate Solana network scope (mainnet/devnet/testnet)
	* and account to connect to based on the following priority:
	* 1. First tries to find an available scope in order: mainnet > devnet > testnet, supposing the same set of accounts
	*    is available for all Solana scopes
	* 2. For account selection:
	*    - First tries to use the selectedAddress param, most likely coming from the accountsChanged event
	*    - Falls back to the previously saved account if it exists in the scope
	*    - Finally defaults to the first account in the scope
	*
	* @param session - The session data containing available scopes and accounts
	* @param selectedAddress - The address that was selected by the user, if any
	*/
	updateSession(session, selectedAddress) {
		const sessionScopes = new Set(Object.keys(session?.sessionScopes ?? {}));
		const scope = [
			Scope.MAINNET,
			Scope.DEVNET,
			Scope.TESTNET
		].find((scope) => sessionScopes.has(scope));
		if (!scope) {
			__classPrivateFieldSet$1(this, _MetamaskWallet_account, void 0, "f");
			return;
		}
		const scopeAccounts = session?.sessionScopes[scope]?.accounts;
		if (!scopeAccounts?.[0]) {
			__classPrivateFieldSet$1(this, _MetamaskWallet_account, void 0, "f");
			return;
		}
		let addressToConnect;
		if (selectedAddress && scopeAccounts.includes(`${scope}:${selectedAddress}`)) addressToConnect = selectedAddress;
		else if (__classPrivateFieldGet$1(this, _MetamaskWallet_account, "f")?.address && scopeAccounts.includes(`${scope}:${__classPrivateFieldGet$1(this, _MetamaskWallet_account, "f")?.address}`)) addressToConnect = __classPrivateFieldGet$1(this, _MetamaskWallet_account, "f").address;
		else addressToConnect = getAddressFromCaipAccountId(scopeAccounts[0]);
		__classPrivateFieldSet$1(this, _MetamaskWallet_account, __classPrivateFieldGet$1(this, _MetamaskWallet_instances, "m", _MetamaskWallet_getAccountFromAddress).call(this, addressToConnect), "f");
		this.scope = scope;
		__classPrivateFieldGet$1(this, _MetamaskWallet_instances, "m", _MetamaskWallet_emit).call(this, "change", { accounts: this.accounts });
	}
};
_MetamaskWallet_listeners = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_selectedAddressOnPageLoadPromise = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_account = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_removeAccountsChangedListener = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_on = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_connect = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_signIn = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_disconnect = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_signAndSendTransaction = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_signTransaction = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_signMessage = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_validateSendTransactionInput = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_tryRestoringSession = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_createSession = /* @__PURE__ */ new WeakMap(), _MetamaskWallet_instances = /* @__PURE__ */ new WeakSet(), _MetamaskWallet_emit = function _MetamaskWallet_emit(event, ...args) {
	for (const listener of __classPrivateFieldGet$1(this, _MetamaskWallet_listeners, "f")[event] ?? []) listener.apply(null, args);
}, _MetamaskWallet_off = function _MetamaskWallet_off(event, listener) {
	__classPrivateFieldGet$1(this, _MetamaskWallet_listeners, "f")[event] = __classPrivateFieldGet$1(this, _MetamaskWallet_listeners, "f")[event]?.filter((existingListener) => listener !== existingListener);
}, _MetamaskWallet_handleAccountsChangedEvent = async function _MetamaskWallet_handleAccountsChangedEvent(data) {
	if (!isAccountChangedEvent(data)) return;
	const addressToSelect = data?.params?.notification?.params?.[0];
	if (!addressToSelect) {
		await __classPrivateFieldGet$1(this, _MetamaskWallet_disconnect, "f").call(this, { revokeSession: false });
		return;
	}
	const session = await this.client.getSession();
	this.updateSession(session, addressToSelect);
}, _MetamaskWallet_getAccountFromAddress = function _MetamaskWallet_getAccountFromAddress(address) {
	return new MetamaskWalletAccount({
		address,
		publicKey: new Uint8Array(esm_default.decode(address)),
		chains: this.chains
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@metamask+solana-wallet-standard@0.6.0/node_modules/@metamask/solana-wallet-standard/dist/index.mjs
function getWalletStandard(options) {
	return new MetamaskWallet(options);
}
async function registerSolanaWalletStandard(options) {
	registerWallet(getWalletStandard(options));
}
//#endregion
//#region ../../node_modules/.pnpm/@wallet-standard+app@1.1.1/node_modules/@wallet-standard/app/lib/esm/wallets.js
var __classPrivateFieldGet = function(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var _AppReadyEvent_detail;
var wallets = void 0;
var registeredWalletsSet = /* @__PURE__ */ new Set();
function addRegisteredWallet(wallet) {
	cachedWalletsArray = void 0;
	registeredWalletsSet.add(wallet);
}
function removeRegisteredWallet(wallet) {
	cachedWalletsArray = void 0;
	registeredWalletsSet.delete(wallet);
}
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
		get,
		on
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
	wallets = wallets.filter((wallet) => !registeredWalletsSet.has(wallet));
	if (!wallets.length) return () => {};
	wallets.forEach((wallet) => addRegisteredWallet(wallet));
	listeners["register"]?.forEach((listener) => guard(() => listener(...wallets)));
	return function unregister() {
		wallets.forEach((wallet) => removeRegisteredWallet(wallet));
		listeners["unregister"]?.forEach((listener) => guard(() => listener(...wallets)));
	};
}
var cachedWalletsArray;
function get() {
	if (!cachedWalletsArray) cachedWalletsArray = [...registeredWalletsSet];
	return cachedWalletsArray;
}
function on(event, listener) {
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
	get detail() {
		return __classPrivateFieldGet(this, _AppReadyEvent_detail, "f");
	}
	get type() {
		return "wallet-standard:app-ready";
	}
	constructor(api) {
		super("wallet-standard:app-ready", {
			bubbles: false,
			cancelable: false,
			composed: false
		});
		_AppReadyEvent_detail.set(this, void 0);
		__classPrivateFieldSet(this, _AppReadyEvent_detail, api, "f");
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
//#region ../../node_modules/.pnpm/@metamask+connect-solana@1.1.0_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/@metamask/connect-solana/dist/node/es/connect-solana.mjs
var connect_solana_exports = /* @__PURE__ */ __exportAll({ createSolanaClient: () => createSolanaClient });
var __async = (__this, __arguments, generator) => {
	return new Promise((resolve, reject) => {
		var fulfilled = (value) => {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		};
		var rejected = (value) => {
			try {
				step(generator.throw(value));
			} catch (e) {
				reject(e);
			}
		};
		var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
		step((generator = generator.apply(__this, __arguments)).next());
	});
};
var SOLANA_CAIP_IDS = {
	mainnet: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
	devnet: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
	testnet: "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"
};
function convertNetworksToCAIP(networks) {
	return Object.entries(networks).reduce((acc, [network, rpcUrl]) => {
		const caipId = SOLANA_CAIP_IDS[network];
		if (caipId && rpcUrl) acc[caipId] = rpcUrl;
		return acc;
	}, {});
}
var logger = createLogger("metamask-connect:solana", "93");
var isMetamaskExtensionRegistered = () => {
	return getWallets().get().some((wallet) => wallet.name.toLowerCase().includes("metamask"));
};
function createSolanaClient(options) {
	return __async(this, null, function* () {
		var _a, _b, _c, _d, _e;
		const defaultNetworks = { mainnet: "https://api.mainnet-beta.solana.com" };
		const skipAutoRegister = (_a = options.skipAutoRegister) != null ? _a : false;
		const supportedNetworks = convertNetworksToCAIP((_c = (_b = options.api) == null ? void 0 : _b.supportedNetworks) != null ? _c : defaultNetworks);
		const core = yield createMultichainClient({
			dapp: options.dapp,
			api: { supportedNetworks },
			analytics: { integrationType: ((_d = options.analytics) == null ? void 0 : _d.integrationType) || "direct" },
			versions: { "connect-solana": "1.1.0" }
		});
		const client = core.provider;
		const walletName = "MetaMask";
		let hasRegisteredMmc = false;
		let handledInitRegistration;
		const initRegistrationHandledPromise = new Promise((resolve) => {
			handledInitRegistration = resolve;
		});
		const registerWallet = () => __async(null, null, function* () {
			if (hasRegisteredMmc) {
				logger("MetaMask Connect is already registered. Skipping...");
				return;
			}
			if (isMetamaskExtensionRegistered()) {
				logger("MetaMask extension is already registered. Skipping...");
				return;
			}
			yield registerSolanaWalletStandard({
				client,
				walletName
			});
			hasRegisteredMmc = true;
		});
		if (skipAutoRegister) handledInitRegistration();
		else setTimeout(() => __async(null, null, function* () {
			try {
				yield registerWallet();
			} finally {
				handledInitRegistration();
			}
		}), 1e3);
		const provider = getWalletStandard({
			client,
			walletName
		});
		const session = yield core.provider.getSession();
		if (Object.keys((_e = session == null ? void 0 : session.sessionScopes) != null ? _e : {}).some((scope) => scope.startsWith("solana:"))) yield provider.features["standard:connect"].connect();
		return {
			core,
			getWallet: () => provider,
			registerWallet: () => __async(null, null, function* () {
				yield initRegistrationHandledPromise;
				yield registerWallet();
			}),
			disconnect: () => __async(null, null, function* () {
				return yield core.disconnect(Object.values(SOLANA_CAIP_IDS));
			})
		};
	});
}
//#endregion
export { connect_solana_exports as t };
