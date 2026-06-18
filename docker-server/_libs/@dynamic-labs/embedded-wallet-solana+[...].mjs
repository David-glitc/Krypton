import { K as DynamicError, O as isSameAddress, U as __classPrivateFieldGet, W as __classPrivateFieldSet, _ as Transaction, a as DYNAMIC_SVM_NETWORK_ID_LS_KEY, c as createAssociatedTokenAccountInstruction, d as TOKEN_2022_PROGRAM_ID, f as TOKEN_PROGRAM_ID, g as SystemProgram, h as PublicKey, i as getBackwardsCompatibleSolNetworks, l as getAssociatedTokenAddress, m as LAMPORTS_PER_SOL$1, o as getOverrideRpcUrlForNetwork, p as Connection, s as SolanaWallet, u as createTransferCheckedInstruction, v as VersionedTransaction, y as __awaiter$1 } from "../@dynamic-labs-connectors/metamask-solana+[...].mjs";
import { c as IframeStamper, i as WebauthnStamper, l as isHttpClient, n as findTurnkeyVerifiedCredentials, o as logger, r as TurnkeyWalletConnectorBase, s as TURNKEY_SDK_SESSION_KEY_RETRYABLE_ERRORS, t as TurnkeyWalletConnectorInfo } from "./embedded-wallet+[...].mjs";
import { $ as getDefaultClient, Q as getCore, Y as createApiClient } from "../@dynamic-labs-sdk/client+[...].mjs";
import { _ as VersionedTransaction$1, d as PublicKey$1, m as Transaction$1, v as init_index_esm } from "../@coral-xyz/anchor.mjs";
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/bufferToBase64/bufferToBase64.js
var bufferToBase64 = (buf) => {
	const binstr = Array.prototype.map.call(buf, (ch) => String.fromCharCode(ch)).join("");
	return Buffer.from(binstr, "binary").toString("base64");
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/ceil/ceil.js
var ceil = (value, precision = 0) => {
	const multiplier = Math.pow(10, precision);
	return Math.ceil(value * multiplier) / multiplier;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/errors/TransactionConfirmationTimeoutError.js
var TransactionConfirmationTimeoutError = class extends DynamicError {
	constructor(transactionSignature) {
		super(`Transaction confirmation timed out. Signature: ${transactionSignature}`);
		this.transactionSignature = transactionSignature;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/errors/TransactionFailedError.js
var TransactionFailedError = class extends DynamicError {
	constructor(chainError) {
		super(`Transaction failed: ${JSON.stringify(chainError)}`);
		this.chainError = chainError;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/trimEnd/trimEnd.js
var trimEnd = (text, char = "") => {
	let endIndex = text.length - 1;
	while (endIndex >= 0 && text[endIndex] === char) endIndex--;
	return text.slice(0, endIndex + 1);
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/formatNumberText/formatNumberText.js
var formatNumberText = (value, { precision = 0 } = {}) => {
	if (!precision) return value;
	const [integerPart, decimalPart] = ceil(parseFloat(value), precision).toFixed(precision).split(".");
	return `${integerPart}.${trimEnd(decimalPart, "0") || "0"}`;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/services/FetchService/FetchService.js
var _a, _FetchService_implementation;
/**
* Class implementing the fetch service with a configurable fetch implementation.
*/
var FetchService = class {
	static get implementation() {
		if (!__classPrivateFieldGet(_a, _a, "f", _FetchService_implementation)) return { fetch: window.fetch.bind(window) };
		return __classPrivateFieldGet(_a, _a, "f", _FetchService_implementation);
	}
	static set implementation(implementation) {
		__classPrivateFieldSet(_a, _a, implementation, "f", _FetchService_implementation);
	}
	static get fetch() {
		return _a.implementation.fetch;
	}
};
_a = FetchService;
_FetchService_implementation = { value: void 0 };
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+rpc-providers@4.89.0/node_modules/@dynamic-labs/rpc-providers/src/RpcProviders.js
var ProviderChain;
(function(ProviderChain) {
	ProviderChain["ECLIPSE"] = "eclipse";
	ProviderChain["EVM"] = "evm";
	ProviderChain["SOLANA"] = "solana";
	ProviderChain["STARKNET"] = "starknet";
	ProviderChain["SUI"] = "sui";
})(ProviderChain || (ProviderChain = {}));
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1._dc4aa6854ef4161dca3d011934dd96b7/node_modules/@dynamic-labs/solana-core/src/utils/SolanaUiTransaction/SolanaUiTransaction.js
var LAMPORTS_PER_SOL = 1e9;
var SolanaUiTransaction = class {
	constructor({ onSubmit, from, connection, multipleTransactions }) {
		this.chain = "SOL";
		this.data = void 0;
		this.fee = { gas: void 0 };
		this.formatNonNativeToken = (value, decimals) => (Number(value) / Number(Math.pow(10, decimals))).toString();
		this.from = from;
		this.onSubmit = onSubmit;
		this.connection = connection;
		this.multipleTransactions = multipleTransactions;
	}
	fetchFee() {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (this.fee.gas) return;
			let transactions = this.multipleTransactions;
			if (!transactions) {
				const tx = yield this.createTransactionSafe();
				if (!tx) return;
				transactions = tx instanceof Array ? tx : [tx];
			}
			const compiledMessages = yield Promise.all(transactions.map((tx) => __awaiter$1(this, void 0, void 0, function* () {
				if ("version" in tx) return tx.message;
				return tx.compileMessage();
			})));
			if (compiledMessages.some((msg) => !msg)) throw new Error("Invalid transaction");
			const getFeeWithRetry = (message) => __awaiter$1(this, void 0, void 0, function* () {
				let res = yield this.connection.getFeeForMessage(message, "confirmed");
				let retryCount = 0;
				while (res.value === null && retryCount < 5) {
					res = yield this.connection.getFeeForMessage(message, "confirmed");
					retryCount++;
				}
				return res.value ? BigInt(res.value) : BigInt(0);
			});
			const fees = yield Promise.all(compiledMessages.map((message) => getFeeWithRetry(message)));
			this.fee.gas = fees.reduce((acc, fee) => acc + fee, BigInt(0));
			if (this.fee.gas === BigInt(0)) this.fee.gas = void 0;
		});
	}
	isGasSponsored() {
		var _a;
		if (!((_a = this.multipleTransactions) === null || _a === void 0 ? void 0 : _a.length)) return false;
		return this.multipleTransactions.every((tx) => {
			var _a;
			if ("version" in tx) return this.from !== tx.message.staticAccountKeys[0].toBase58();
			if ("feePayer" in tx) return this.from !== ((_a = tx.feePayer) === null || _a === void 0 ? void 0 : _a.toBase58());
			return false;
		});
	}
	parse(input) {
		const lamports = Math.round(parseFloat(input) * LAMPORTS_PER_SOL);
		return BigInt(lamports);
	}
	parseNonNativeToken(input, decimals) {
		return BigInt(Math.floor(Number(input) * Math.pow(10, decimals)));
	}
	format(value, { precision } = {}) {
		return formatNumberText((Number(value) / LAMPORTS_PER_SOL).toLocaleString("fullwide", {
			maximumFractionDigits: 20,
			minimumFractionDigits: 0,
			useGrouping: false
		}), { precision });
	}
	submit() {
		return __awaiter$1(this, void 0, void 0, function* () {
			if (this.multipleTransactions) return this.onSubmit();
			const sendTransaction = yield this.createTransaction();
			return this.onSubmit(sendTransaction);
		});
	}
	getBalance() {
		return __awaiter$1(this, void 0, void 0, function* () {
			const publicKey = new PublicKey(this.from);
			const balance = yield this.connection.getBalance(publicKey);
			return BigInt(balance);
		});
	}
	validateAddressFormat(address) {
		if (address === "dyn_send_transaction.multiple_recipients") return true;
		return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
	}
	createTransaction() {
		return __awaiter$1(this, void 0, void 0, function* () {
			var _a;
			const { value, to, nonNativeAddress: splTokenMintAddress, nonNativeValue } = this;
			if (!to) throw new Error("Destination is required");
			if (this.multipleTransactions) return this.multipleTransactions;
			const sendTransaction = new Transaction();
			const fromPubkey = new PublicKey(this.from);
			const toPubkey = new PublicKey(to);
			if (splTokenMintAddress && nonNativeValue) {
				const tokenMintPubkey = new PublicKey(splTokenMintAddress);
				const amount = nonNativeValue;
				const mintAccountInfo = yield this.connection.getAccountInfo(tokenMintPubkey);
				const tokenProgramId = (mintAccountInfo === null || mintAccountInfo === void 0 ? void 0 : mintAccountInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
				const fromTokenAccount = (_a = (yield this.connection.getTokenAccountsByOwner(fromPubkey, { mint: tokenMintPubkey })).value[0]) === null || _a === void 0 ? void 0 : _a.pubkey;
				if (!fromTokenAccount) throw new Error("Source token account not found");
				let toTokenAccountPubkey;
				try {
					toTokenAccountPubkey = yield getAssociatedTokenAddress(tokenMintPubkey, toPubkey, false, tokenProgramId);
					yield this.connection.getTokenAccountBalance(toTokenAccountPubkey);
				} catch (_b) {
					toTokenAccountPubkey = yield getAssociatedTokenAddress(tokenMintPubkey, toPubkey, false, tokenProgramId);
					sendTransaction.add(createAssociatedTokenAccountInstruction(fromPubkey, toTokenAccountPubkey, toPubkey, tokenMintPubkey, tokenProgramId));
				}
				const tokenDecimals = this.nonNativeDecimal || 0;
				sendTransaction.add(createTransferCheckedInstruction(fromTokenAccount, tokenMintPubkey, toTokenAccountPubkey, fromPubkey, amount, tokenDecimals, [], tokenProgramId));
			} else {
				const lamports = value !== null && value !== void 0 ? value : BigInt(0);
				sendTransaction.add(SystemProgram.transfer({
					fromPubkey,
					lamports,
					toPubkey
				}));
			}
			const { blockhash } = yield this.connection.getLatestBlockhash();
			sendTransaction.feePayer = new PublicKey(this.from);
			sendTransaction.recentBlockhash = blockhash;
			return sendTransaction;
		});
	}
	createTransactionSafe() {
		return __awaiter$1(this, void 0, void 0, function* () {
			try {
				return yield this.createTransaction();
			} catch (error) {
				return;
			}
		});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+solana-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1._dc4aa6854ef4161dca3d011934dd96b7/node_modules/@dynamic-labs/solana-core/src/utils/isTransactionSigned/isTransactionSigned.js
var isTxAlreadySigned = (transaction) => {
	let alreadySigned = false;
	if ("version" in transaction) alreadySigned = transaction.signatures.some((sig) => !sig.every((byte) => byte === 0));
	else alreadySigned = transaction.signatures.some((sig) => sig.signature);
	return alreadySigned;
};
//#endregion
//#region ../../node_modules/.pnpm/@turnkey+http@3.10.0/node_modules/@turnkey/http/dist/shared.mjs
var TurnkeyActivityError = class extends Error {
	constructor(input) {
		const { message, cause, activityId, activityStatus, activityType } = input;
		super(message);
		this.name = "TurnkeyActivityError";
		this.activityId = activityId ?? void 0;
		this.activityStatus = activityStatus ?? void 0;
		this.activityType = activityType ?? void 0;
		this.cause = cause ?? void 0;
	}
};
var TurnkeyActivityConsensusNeededError = class extends Error {
	constructor(input) {
		const { message, cause, activityId, activityStatus, activityType } = input;
		super(message);
		this.name = "TurnkeyActivityConsensusNeededError";
		this.activityId = activityId ?? void 0;
		this.activityStatus = activityStatus ?? void 0;
		this.activityType = activityType ?? void 0;
		this.cause = cause ?? void 0;
	}
};
function assertActivityCompleted(activity) {
	const { id: activityId, status: activityStatus } = activity;
	if (activityStatus === "ACTIVITY_STATUS_CONSENSUS_NEEDED") throw new TurnkeyActivityConsensusNeededError({
		message: "Activity requires consensus",
		activityId,
		activityStatus
	});
	if (activityStatus !== "ACTIVITY_STATUS_COMPLETED") throw new TurnkeyActivityError({
		message: `Expected COMPLETED status, got ${activityStatus}`,
		activityId,
		activityStatus
	});
	return true;
}
function assertNonNull(input) {
	if (input == null) throw new Error(`Got unexpected ${JSON.stringify(input)}`);
	return input;
}
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet-solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buff_9145164504d80f2c32a77ef6cf952981/node_modules/@dynamic-labs/embedded-wallet-solana/_virtual/_tslib.js
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
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
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
//#region ../../node_modules/.pnpm/@turnkey+solana@1.0.42_bufferutil@4.1.0_typescript@5.9.3_utf-8-validate@6.0.6_zod@4.4.3/node_modules/@turnkey/solana/dist/index.mjs
init_index_esm();
var TurnkeySigner = class {
	constructor(input) {
		this.organizationId = input.organizationId;
		this.client = input.client;
	}
	/**
	* This function takes an array of Solana transactions and adds a signature with Turnkey to each of them
	*
	* @param txs array of Transaction | VersionedTransaction (native @solana/web3.js type)
	* @param fromAddress Solana address (base58 encoded)
	*/
	async signAllTransactions(txs, fromAddress, organizationId) {
		const fromKey = new PublicKey$1(fromAddress);
		let messages = txs.map((tx) => this.getMessageToSign(tx).toString("hex"));
		const signatures = (await this.signRawPayloads(messages, fromAddress, organizationId))?.signatures?.map((sig) => `${sig?.r}${sig?.s}`);
		for (let i in txs) txs[i]?.addSignature(fromKey, Buffer.from(signatures[i], "hex"));
		return txs;
	}
	/**
	* This function takes a Solana transaction and adds a signature with Turnkey
	*
	* @param tx Transaction | VersionedTransaction object (native @solana/web3.js type)
	* @param fromAddress Solana address (base58 encoded)
	*/
	async addSignature(tx, fromAddress, organizationId) {
		const fromKey = new PublicKey$1(fromAddress);
		const messageToSign = this.getMessageToSign(tx);
		const signRawPayloadResult = await this.signRawPayload(messageToSign.toString("hex"), fromAddress, organizationId ?? this.organizationId);
		const signature = `${signRawPayloadResult?.r}${signRawPayloadResult?.s}`;
		tx.addSignature(fromKey, Buffer.from(signature, "hex"));
	}
	/**
	* This function takes a message and returns it after being signed with Turnkey
	*
	* @param message The message to sign (Uint8Array)
	* @param fromAddress Solana address (base58 encoded)
	*/
	async signMessage(message, fromAddress, organizationId) {
		const signRawPayloadResult = await this.signRawPayload(Buffer.from(message).toString("hex"), fromAddress, organizationId);
		return Buffer.from(`${signRawPayloadResult?.r}${signRawPayloadResult?.s}`, "hex");
	}
	/**
	* This function takes a Solana transaction, adds a signature via Turnkey,
	* and returns a new transaction
	*
	* @param tx Transaction | VersionedTransaction object (native @solana/web3.js type)
	* @param fromAddress Solana address (base58 encoded)
	*/
	async signTransaction(tx, fromAddress, organizationId) {
		const payloadToSign = Buffer.from(tx.serialize({
			requireAllSignatures: false,
			verifySignatures: false
		})).toString("hex");
		const signedTransaction = await this.signTransactionImpl(payloadToSign, fromAddress, organizationId);
		const decodedTransaction = Buffer.from(signedTransaction, "hex");
		return "version" in tx ? VersionedTransaction$1.deserialize(decodedTransaction) : Transaction$1.from(decodedTransaction);
	}
	async signTransactionImpl(unsignedTransaction, signWith, organizationId) {
		if (isHttpClient(this.client)) {
			const { activity } = await this.client.signTransaction({
				type: "ACTIVITY_TYPE_SIGN_TRANSACTION_V2",
				organizationId: organizationId ?? this.organizationId,
				timestampMs: String(Date.now()),
				parameters: {
					signWith,
					unsignedTransaction,
					type: "TRANSACTION_TYPE_SOLANA"
				}
			});
			assertActivityCompleted(activity);
			return assertNonNull(activity?.result?.signTransactionResult?.signedTransaction);
		} else {
			const { activity, signedTransaction } = await this.client.signTransaction({
				...organizationId !== void 0 && { organizationId },
				signWith,
				unsignedTransaction,
				type: "TRANSACTION_TYPE_SOLANA"
			});
			assertActivityCompleted(activity);
			return assertNonNull(signedTransaction);
		}
	}
	async signRawPayload(payload, signWith, organizationId) {
		if (isHttpClient(this.client)) {
			const { activity } = await this.client.signRawPayload({
				type: "ACTIVITY_TYPE_SIGN_RAW_PAYLOAD_V2",
				organizationId: organizationId ?? this.organizationId,
				timestampMs: String(Date.now()),
				parameters: {
					signWith,
					payload,
					encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
					hashFunction: "HASH_FUNCTION_NOT_APPLICABLE"
				}
			});
			assertActivityCompleted(activity);
			return assertNonNull(activity?.result?.signRawPayloadResult);
		} else {
			const { activity, r, s, v } = await this.client.signRawPayload({
				...organizationId !== void 0 && { organizationId },
				signWith,
				payload,
				encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
				hashFunction: "HASH_FUNCTION_NOT_APPLICABLE"
			});
			assertActivityCompleted(activity);
			return assertNonNull({
				r,
				s,
				v
			});
		}
	}
	async signRawPayloads(payloads, signWith, organizationId) {
		if (isHttpClient(this.client)) {
			const { activity } = await this.client.signRawPayloads({
				type: "ACTIVITY_TYPE_SIGN_RAW_PAYLOADS",
				organizationId: organizationId ?? this.organizationId,
				timestampMs: String(Date.now()),
				parameters: {
					signWith,
					payloads,
					encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
					hashFunction: "HASH_FUNCTION_NOT_APPLICABLE"
				}
			});
			assertActivityCompleted(activity);
			return assertNonNull(activity?.result?.signRawPayloadsResult);
		} else {
			const { activity, signatures } = await this.client.signRawPayloads({
				...organizationId !== void 0 && { organizationId },
				signWith,
				payloads,
				encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
				hashFunction: "HASH_FUNCTION_NOT_APPLICABLE"
			});
			assertActivityCompleted(activity);
			return assertNonNull({ signatures });
		}
	}
	getMessageToSign(tx) {
		let messageToSign;
		if (typeof tx.serializeMessage === "function") messageToSign = tx.serializeMessage();
		else messageToSign = Buffer.from(tx.message.serialize());
		return messageToSign;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet-solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buff_9145164504d80f2c32a77ef6cf952981/node_modules/@dynamic-labs/embedded-wallet-solana/src/lib/utils/createSolanaConnection/createSolanaConnection.js
var createSolanaConnection = (rpcUrl, commitmentOrConfig) => {
	if (!rpcUrl) throw new Error("rpcUrl is required");
	return new Connection(rpcUrl, commitmentOrConfig);
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet-solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buff_9145164504d80f2c32a77ef6cf952981/node_modules/@dynamic-labs/embedded-wallet-solana/src/lib/utils/api/api.js
var serializeTransaction = (transaction) => {
	if (transaction instanceof VersionedTransaction) return Buffer.from(new Uint8Array(transaction.serialize())).toString("base64");
	else return Buffer.from(new Uint8Array(transaction.serialize({ verifySignatures: false }))).toString("base64");
};
var deserializeTransaction = (serializedTransaction) => {
	const transactionBuffer = Buffer.from(serializedTransaction, "base64");
	return VersionedTransaction.deserialize(new Uint8Array(transactionBuffer));
};
var optimizeSolanaTransaction = (environmentId, transaction, address) => __awaiter(void 0, void 0, void 0, function* () {
	const request = {
		environmentId,
		solanaTransactionOptimizationRequest: {
			address,
			transaction: serializeTransaction(transaction)
		}
	};
	return deserializeTransaction((yield createApiClient({}, getDefaultClient()).optimizeTransaction(request)).transaction);
});
/**
* Sponsors a Solana transaction using the Grid API via our backend.
* This covers network fees so users don't need SOL for gas.
*
* Uses direct fetch to avoid SDK API client dependency version issues.
*/
var sponsorSolanaTransaction = (environmentId, transaction) => __awaiter(void 0, void 0, void 0, function* () {
	const serializedTransaction = serializeTransaction(transaction);
	const core = getCore(getDefaultClient());
	const { legacyToken } = core.state.get();
	const url = `${core.apiBaseUrl}/sdk/${environmentId}/solana/sponsorTransaction`;
	if (!legacyToken) throw new Error("No auth token available for sponsoring transaction");
	const response = yield FetchService.fetch(url, {
		body: JSON.stringify({ transaction: serializedTransaction }),
		credentials: "include",
		headers: {
			Authorization: `Bearer ${legacyToken}`,
			"Content-Type": "application/json"
		},
		method: "POST"
	});
	if (!response.ok) {
		const errorBody = yield response.json().catch(() => ({}));
		throw new Error(errorBody.error || `Failed to sponsor transaction: ${response.status}`);
	}
	const data = yield response.json();
	if (!data.transaction) throw new Error("Invalid API response: missing transaction field");
	return deserializeTransaction(data.transaction);
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet-solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buff_9145164504d80f2c32a77ef6cf952981/node_modules/@dynamic-labs/embedded-wallet-solana/src/lib/TurnkeySolanaWalletConnector/TurnkeySolanaSigner.js
var TurnkeySolanaSigner = class {
	constructor({ walletConnector }) {
		this.isConnected = true;
		this.providers = [this];
		this.walletConnector = walletConnector;
		this.turnkeyAddress = this.walletConnector.turnkeyAddress;
		this.publicKey = this.turnkeyAddress ? new PublicKey(this.turnkeyAddress) : void 0;
	}
	signMessage(encodedMessage) {
		return __awaiter(this, void 0, void 0, function* () {
			return { signature: yield this.walletConnector.signUint8ArrayMessage(encodedMessage) };
		});
	}
	signTransaction(transaction) {
		return __awaiter(this, void 0, void 0, function* () {
			return this.walletConnector.signTransaction(transaction);
		});
	}
	signAllTransactions(transactions) {
		return __awaiter(this, void 0, void 0, function* () {
			return this.walletConnector.signAllTransactions(transactions);
		});
	}
	signAndSendTransaction(transaction, options) {
		return __awaiter(this, void 0, void 0, function* () {
			return { signature: yield this.walletConnector.signAndSendTransaction(transaction, options) };
		});
	}
	connect(_args) {
		return __awaiter(this, void 0, void 0, function* () {
			return {
				address: this.turnkeyAddress,
				publicKey: this.publicKey
			};
		});
	}
	disconnect() {
		return __awaiter(this, void 0, void 0, function* () {});
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet-solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buff_9145164504d80f2c32a77ef6cf952981/node_modules/@dynamic-labs/embedded-wallet-solana/src/lib/TurnkeySolanaWalletConnector/TurnkeySolanaWalletConnector.js
var TurnkeySolanaWalletConnector = class extends TurnkeyWalletConnectorBase {
	constructor(nameAndKey, props) {
		var _a;
		super(nameAndKey, props);
		this.ChainWallet = SolanaWallet;
		this.connectedChain = "SOL";
		this.supportedChains = ["SOL"];
		this.verifiedCredentialChain = "solana";
		this.getEnvId = () => {
			const dynamicNonce = localStorage.getItem("dynamic_nonce");
			if (dynamicNonce) {
				const parsed = JSON.parse(dynamicNonce);
				if (parsed && parsed.environmentId) return parsed.environmentId;
			}
			const dynamicNonceDemo = localStorage.getItem("dynamic_nonce_demo");
			if (dynamicNonceDemo) {
				const parsed = JSON.parse(dynamicNonceDemo);
				if (parsed && parsed.environmentId) return parsed.environmentId;
			}
			throw new Error("Failed to get environment id");
		};
		this.solNetworks = getBackwardsCompatibleSolNetworks(props.solNetworks, props.connectionConfig);
		this.walletUiUtils = props.walletUiUtils;
		this._turnkeyAccount = void 0;
		this.connectionConfig = props.connectionConfig;
		this.chainRpcProviders = props.chainRpcProviders;
		(_a = this.chainRpcProviders) === null || _a === void 0 || _a.registerSolanaProviders(this.connectionConfig);
		this.getTurnkeyClient().then((client) => {
			this.__turnkeyClient = client;
		});
	}
	getRpcUrl() {
		const network = this.getSelectedNetwork();
		if (!network) throw new DynamicError("No enabled networks");
		return getOverrideRpcUrlForNetwork(this.connectionConfig, network);
	}
	getConnection(commitmentOrConfig) {
		const rpcUrl = this.getRpcUrl();
		if (!rpcUrl) throw new DynamicError("No rpcUrl");
		return createSolanaConnection(rpcUrl, typeof commitmentOrConfig === "string" ? Object.assign(Object.assign({}, this.connectionConfig), { commitment: commitmentOrConfig }) : Object.assign(Object.assign({}, this.connectionConfig), commitmentOrConfig));
	}
	getWalletClient() {
		return this.getConnection();
	}
	getNetworkId() {
		var _a;
		const defaultChainId = (_a = this.solNetworks[0]) === null || _a === void 0 ? void 0 : _a.networkId.toString();
		const storedChainId = localStorage.getItem(DYNAMIC_SVM_NETWORK_ID_LS_KEY);
		return storedChainId !== null && storedChainId !== void 0 ? storedChainId : defaultChainId;
	}
	setNetworkId(networkId) {
		if (!networkId) localStorage.removeItem(DYNAMIC_SVM_NETWORK_ID_LS_KEY);
		else localStorage.setItem(DYNAMIC_SVM_NETWORK_ID_LS_KEY, networkId);
	}
	getSelectedNetwork() {
		return this.solNetworks.find((network) => network.networkId.toString() === this.getNetworkId());
	}
	/**
	* @param returnDynamicNetworkId - If true, the dynamic network ID will be returned instead of the network cluster
	* @returns The network cluster (e.g. 'mainnet', 'testnet', 'devnet') or dynamic network (used for switching networks)
	*/
	getNetwork() {
		return __awaiter(this, arguments, void 0, function* (returnDynamicNetworkId = false) {
			const network = this.getSelectedNetwork();
			if (!network) return "";
			const { networkId, genesisHash } = network;
			if (returnDynamicNetworkId) return networkId.toString();
			if (genesisHash === "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp") return "mainnet";
			if (genesisHash === "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z") return "testnet";
			if (genesisHash === "EtWTRABZaYq6iMfeYKouRu166VU2xqa1") return "devnet";
			return networkId.toString();
		});
	}
	switchNetwork(_a) {
		return __awaiter(this, arguments, void 0, function* ({ networkChainId }) {
			if (!networkChainId) return;
			const networkIdString = networkChainId.toString();
			if (!this.solNetworks.some((network) => network.networkId.toString() === networkIdString)) return;
			this.setNetworkId(networkIdString);
			this.emit("chainChange", { chain: networkIdString });
		});
	}
	getPublicClient() {
		return __awaiter(this, void 0, void 0, function* () {
			var _a;
			const network = this.getSelectedNetwork();
			if (!network) return;
			const networkId = network.networkId.toString();
			const configurations = {
				cosmos: [],
				evm: void 0,
				solana: this.solNetworks,
				starknet: void 0
			};
			if (!this.chainRpcProviders) return void 0;
			const providers = this.chainRpcProviders.getProviders(configurations);
			return (_a = this.chainRpcProviders.getSolanaProviderByChainId(providers, networkId)) === null || _a === void 0 ? void 0 : _a.provider;
		});
	}
	supportsNetworkSwitching() {
		return true;
	}
	setVerifiedCredentials(verifiedCredentials) {
		const turnkeyVerifiedCredentials = findTurnkeyVerifiedCredentials(verifiedCredentials, ProviderChain.SOLANA);
		const [turnkeyVerifiedCredential] = turnkeyVerifiedCredentials;
		if (!(JSON.stringify(this.verifiedCredentials) !== JSON.stringify(turnkeyVerifiedCredentials))) return;
		this.verifiedCredential = turnkeyVerifiedCredential;
		this.verifiedCredentials = turnkeyVerifiedCredentials;
		this.refreshTurnkeyAccount();
	}
	validateActiveWallet(expectedAddress) {
		return __awaiter(this, void 0, void 0, function* () {
			var _a, _b;
			if (!isSameAddress(((_a = this.verifiedCredential) === null || _a === void 0 ? void 0 : _a.address) || "", expectedAddress, this.connectedChain)) {
				const targetActiveAccount = (_b = this.verifiedCredentials) === null || _b === void 0 ? void 0 : _b.find((vc) => (vc === null || vc === void 0 ? void 0 : vc.address) === expectedAddress);
				if (!targetActiveAccount) throw new DynamicError("Account not found");
				this.verifiedCredential = targetActiveAccount;
				this.refreshTurnkeyAccount();
			}
		});
	}
	getAccount() {
		return this.turnkeyAddress;
	}
	endSession() {
		return __awaiter(this, void 0, void 0, function* () {
			this.setNetworkId(null);
		});
	}
	refreshTurnkeyAccount() {
		return __awaiter(this, void 0, void 0, function* () {
			this._turnkeyAccount = void 0;
			return this.getTurnkeyAccount();
		});
	}
	createTurnkeyAccount(_a) {
		return __awaiter(this, arguments, void 0, function* ({ organizationId }) {
			return new TurnkeySigner({
				client: yield this.getTurnkeyClient(),
				organizationId
			});
		});
	}
	getTurnkeyAccount() {
		return __awaiter(this, void 0, void 0, function* () {
			var _a, _b, _c, _d;
			if (this._turnkeyAccount && (this.getAuthenticatorHandler().recoveryType === "passkey" && ((_a = this.__turnkeyClient) === null || _a === void 0 ? void 0 : _a.stamper) instanceof WebauthnStamper || this.getAuthenticatorHandler().recoveryType === "email" && ((_b = this.__turnkeyClient) === null || _b === void 0 ? void 0 : _b.stamper) instanceof IframeStamper) && this.__turnkeyClient === this.getAuthenticatorHandler().client) return this._turnkeyAccount;
			const { turnkeySubOrganizationId } = (_c = this.walletProperties) !== null && _c !== void 0 ? _c : {};
			const { address } = (_d = this.verifiedCredential) !== null && _d !== void 0 ? _d : {};
			if (!turnkeySubOrganizationId || !address) return;
			this._turnkeyAccount = yield this.createTurnkeyAccount({ organizationId: turnkeySubOrganizationId });
			this.setLoggerMetadata();
			return this._turnkeyAccount;
		});
	}
	getSigner() {
		return __awaiter(this, void 0, void 0, function* () {
			return new TurnkeySolanaSigner({ walletConnector: this });
		});
	}
	getBalance(address) {
		return __awaiter(this, void 0, void 0, function* () {
			const connectionClient = this.getConnection();
			const publicKey = new PublicKey(address);
			const balance = yield connectionClient.getBalance(publicKey);
			return this.lamportsToSol(balance).toString();
		});
	}
	signUint8ArrayMessage(encodedMessage) {
		return __awaiter(this, void 0, void 0, function* () {
			if (!this.turnkeyAddress) throw new DynamicError("No turnkey account");
			const address = this.turnkeyAddress;
			let signedMessageRaw;
			yield this.createOrRestoreSession();
			yield this.walletUiUtils.signMessage({
				handler: () => __awaiter(this, void 0, void 0, function* () {
					var _a;
					let account = yield this.getTurnkeyAccount();
					try {
						signedMessageRaw = yield account === null || account === void 0 ? void 0 : account.signMessage(encodedMessage, address);
					} catch (err) {
						yield this.removeSessionKeys();
						yield this.createOrRestoreSession({ ignoreRestore: true });
						account = yield this.getTurnkeyAccount();
						signedMessageRaw = yield account === null || account === void 0 ? void 0 : account.signMessage(encodedMessage, address);
						logger.error("[TK - removeSessionKeys] failed to perform signUint8ArrayMessage activity", {
							address,
							err,
							turnkeySubOrganizationId: (_a = this.walletProperties) === null || _a === void 0 ? void 0 : _a.turnkeySubOrganizationId
						});
					}
					return bufferToBase64(signedMessageRaw || Buffer.from([]));
				}),
				message: new TextDecoder().decode(encodedMessage)
			});
			if (!signedMessageRaw) throw new Error("Failed to sign message");
			return signedMessageRaw;
		});
	}
	signMessage(messageToSign) {
		return __awaiter(this, void 0, void 0, function* () {
			const encodedMessage = new TextEncoder().encode(messageToSign);
			return bufferToBase64(yield this.signUint8ArrayMessage(encodedMessage));
		});
	}
	internalSignTransaction(transaction) {
		return __awaiter(this, void 0, void 0, function* () {
			var _a;
			yield this.createOrRestoreSession();
			let account = yield this.getTurnkeyAccount();
			const address = this.turnkeyAddress;
			if (!account || !address) throw new Error("No turnkey account");
			try {
				yield account.addSignature(transaction, address);
			} catch (err) {
				if (TURNKEY_SDK_SESSION_KEY_RETRYABLE_ERRORS.some((errorMsg) => err.message.toLowerCase().includes(errorMsg.toLowerCase()))) {
					yield this.removeSessionKeys();
					yield this.createOrRestoreSession({ ignoreRestore: true });
					account = yield this.getTurnkeyAccount();
					yield account.addSignature(transaction, address);
					logger.error("[TK - removeSessionKeys] failed to perform SignTransaction activity", {
						address,
						err,
						turnkeySubOrganizationId: (_a = this.walletProperties) === null || _a === void 0 ? void 0 : _a.turnkeySubOrganizationId
					});
				} else {
					logger.error("[TK] failed to perform SignTransaction activity", err);
					throw err;
				}
			}
			try {
				transaction.serialize({ requireAllSignatures: false });
			} catch (e) {
				logger.error("[SignTransaction] likely invalid signature, failed to serialize", e);
			}
			return transaction;
		});
	}
	signTransaction(transaction) {
		return __awaiter(this, void 0, void 0, function* () {
			if (!this.turnkeyAddress) throw new DynamicError("No turnkey account");
			const uiTransaction = new SolanaUiTransaction({
				connection: this.getConnection("confirmed"),
				from: this.turnkeyAddress,
				multipleTransactions: [transaction],
				onSubmit: () => __awaiter(this, void 0, void 0, function* () {
					return this.internalSignTransaction(transaction);
				})
			});
			return this.walletUiUtils.signTransaction(this, uiTransaction);
		});
	}
	createUiTransaction(from) {
		return __awaiter(this, void 0, void 0, function* () {
			yield this.validateActiveWallet(from);
			return new SolanaUiTransaction({
				connection: this.getConnection("confirmed"),
				from,
				onSubmit: (transaction) => __awaiter(this, void 0, void 0, function* () {
					if (!transaction) return void 0;
					return this.internalSignAndSendTransaction(transaction);
				})
			});
		});
	}
	internalSignAllTransactions(transactions) {
		return __awaiter(this, void 0, void 0, function* () {
			var _a;
			yield this.createOrRestoreSession();
			let account = yield this.getTurnkeyAccount();
			const address = this.turnkeyAddress;
			let signedTransactions;
			if (!account || !address) throw new Error("No turnkey account");
			try {
				signedTransactions = yield account.signAllTransactions(transactions, address);
			} catch (err) {
				if (TURNKEY_SDK_SESSION_KEY_RETRYABLE_ERRORS.some((errorMsg) => err.message.toLowerCase().includes(errorMsg.toLowerCase()))) {
					yield this.removeSessionKeys();
					yield this.createOrRestoreSession({ ignoreRestore: true });
					account = yield this.getTurnkeyAccount();
					signedTransactions = yield account.signAllTransactions(transactions, address);
					logger.error("[TK - removeSessionKeys] failed to perform SignAllTransactions activity", {
						address,
						err,
						turnkeySubOrganizationId: (_a = this.walletProperties) === null || _a === void 0 ? void 0 : _a.turnkeySubOrganizationId
					});
				} else {
					logger.error("[TK] failed to perform SignAllTransactions activity", err);
					throw err;
				}
			}
			try {
				signedTransactions.forEach((transaction) => {
					transaction.serialize({ requireAllSignatures: false });
				});
			} catch (e) {
				logger.error("[SignAllTransactions] likely invalid signature, failed to serialize", e);
			}
			return signedTransactions;
		});
	}
	signAllTransactions(transactions) {
		return __awaiter(this, void 0, void 0, function* () {
			if (!this.turnkeyAddress) throw new DynamicError("No turnkey account");
			const uiTransaction = new SolanaUiTransaction({
				connection: this.getConnection("confirmed"),
				from: this.turnkeyAddress,
				multipleTransactions: transactions,
				onSubmit: () => __awaiter(this, void 0, void 0, function* () {
					return this.internalSignAllTransactions(transactions);
				})
			});
			return this.walletUiUtils.signTransaction(this, uiTransaction);
		});
	}
	internalSignAndSendTransaction(transaction, options) {
		return __awaiter(this, void 0, void 0, function* () {
			var _a, _b;
			if (!this.turnkeyAddress) throw new DynamicError("Solana wallet not found");
			const currentConnection = this.getConnection((_b = (_a = this.connectionConfig) === null || _a === void 0 ? void 0 : _a.commitment) !== null && _b !== void 0 ? _b : "confirmed");
			const { blockhash, lastValidBlockHeight } = yield currentConnection.getLatestBlockhash("finalized");
			if ("version" in transaction) transaction.message.recentBlockhash = blockhash;
			else {
				transaction.recentBlockhash = blockhash;
				transaction.lastValidBlockHeight = lastValidBlockHeight;
			}
			const signedTransaction = yield this.internalSignTransaction(transaction);
			const signature = yield currentConnection.sendRawTransaction(signedTransaction.serialize(), options);
			try {
				const result = yield currentConnection.confirmTransaction({
					blockhash,
					lastValidBlockHeight,
					signature
				}, "confirmed");
				if (result.value.err) throw new TransactionFailedError(result.value.err);
			} catch (error) {
				if (error instanceof TransactionFailedError) throw error;
				logger.warn("[internalSignAndSendTransaction] Confirmation timed out, including signature for on-chain verification", {
					error,
					signature
				});
				throw new TransactionConfirmationTimeoutError(signature);
			}
			return signature;
		});
	}
	signAndSendTransaction(transaction, options) {
		return __awaiter(this, void 0, void 0, function* () {
			if (!this.turnkeyAddress) throw new DynamicError("Solana wallet not found");
			const optimizedTransaction = yield this.optimizeTransaction(transaction);
			const uiTransaction = new SolanaUiTransaction({
				connection: this.getConnection("confirmed"),
				from: this.turnkeyAddress,
				multipleTransactions: [optimizedTransaction],
				onSubmit: () => __awaiter(this, void 0, void 0, function* () {
					return this.internalSignAndSendTransaction(optimizedTransaction, options);
				})
			});
			return this.walletUiUtils.sendTransaction(this, uiTransaction);
		});
	}
	sendTransaction(transaction_1, connection_1) {
		return __awaiter(this, arguments, void 0, function* (transaction, connection, options = {}) {
			var _a;
			if (!this.turnkeyAddress) throw new DynamicError("Solana wallet not found");
			if (!transaction || !connection) throw new DynamicError("Transaction and connection are required");
			const { signers } = options, sendOptions = __rest(options, ["signers"]);
			const blockhash = yield connection.getLatestBlockhash({
				commitment: options.preflightCommitment,
				minContextSlot: options.minContextSlot
			});
			if ("version" in transaction) !(signers === null || signers === void 0) && signers.length && transaction.sign(signers);
			else {
				transaction.feePayer = transaction.feePayer || new PublicKey(this.turnkeyAddress);
				transaction.recentBlockhash = transaction.recentBlockhash || blockhash.blockhash;
				!(signers === null || signers === void 0) && signers.length && transaction.partialSign(...signers);
			}
			sendOptions.preflightCommitment = sendOptions.preflightCommitment || connection.commitment;
			const signature = yield connection.sendRawTransaction(transaction.serialize(), options);
			const transactionConfirmationStrategy = {
				blockhash: blockhash.blockhash,
				lastValidBlockHeight: blockhash.lastValidBlockHeight,
				signature
			};
			const result = yield connection === null || connection === void 0 ? void 0 : connection.confirmTransaction(transactionConfirmationStrategy);
			return ((_a = result === null || result === void 0 ? void 0 : result.value) === null || _a === void 0 ? void 0 : _a.err) ? JSON.stringify(result.value.err) : signature;
		});
	}
	lamportsToSol(lamports) {
		return lamports / LAMPORTS_PER_SOL$1;
	}
	optimizeTransaction(transaction) {
		return __awaiter(this, void 0, void 0, function* () {
			var _a;
			let optimizedTransaction = transaction;
			try {
				if ((yield this.getNetwork(true)) === "101" && !isTxAlreadySigned(transaction)) optimizedTransaction = yield optimizeSolanaTransaction(this.getEnvId(), transaction, (_a = this.turnkeyAddress) !== null && _a !== void 0 ? _a : "");
			} catch (e) {
				logger.warn("Failed to optimize transaction", e);
			}
			return optimizedTransaction;
		});
	}
	getBlockExplorerUrlsForCurrentNetwork() {
		return __awaiter(this, void 0, void 0, function* () {
			const network = this.getSelectedNetwork();
			if (!network) return [];
			return network.blockExplorerUrls;
		});
	}
	getEnabledNetworks() {
		return this.solNetworks;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+embedded-wallet-solana@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buff_9145164504d80f2c32a77ef6cf952981/node_modules/@dynamic-labs/embedded-wallet-solana/src/TurnkeySolanaWalletConnectors.js
var TurnkeySolanaWalletConnectors = (props) => {
	var _a;
	if ((_a = props.apiProviders) === null || _a === void 0 ? void 0 : _a.turnkey) {
		const TurnkeySolanaWalletConnectorConstructor = class extends TurnkeySolanaWalletConnector {
			constructor(innerProps) {
				super(TurnkeyWalletConnectorInfo.TurnkeyHD, Object.assign(Object.assign({}, props), innerProps));
			}
		};
		Object.defineProperty(TurnkeySolanaWalletConnectorConstructor, "key", {
			value: "turnkeyhd",
			writable: false
		});
		return [TurnkeySolanaWalletConnectorConstructor];
	}
	return [];
};
//#endregion
export { ProviderChain as a, TransactionConfirmationTimeoutError as c, SolanaUiTransaction as i, ceil as l, sponsorSolanaTransaction as n, FetchService as o, isTxAlreadySigned as r, TransactionFailedError as s, TurnkeySolanaWalletConnectors as t, bufferToBase64 as u };
