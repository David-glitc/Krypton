import { J as Logger$1, K as DynamicError, Z as import_eventemitter3 } from "../@dynamic-labs-connectors/metamask-solana+[...].mjs";
//#region ../../node_modules/.pnpm/@dynamic-labs+utils@4.89.0/node_modules/@dynamic-labs/utils/src/errors/RequestChannelNotHandledError.js
var RequestChannelNotHandledError = class extends DynamicError {};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs-wallet+primitives@1.0.16/node_modules/@dynamic-labs-wallet/primitives/index.esm.js
var SigningAlgorithm = /*#__PURE__*/ function(SigningAlgorithm) {
	SigningAlgorithm["ECDSA"] = "ECDSA";
	SigningAlgorithm["ED25519"] = "ED25519";
	SigningAlgorithm["BIP340"] = "BIP340";
	SigningAlgorithm["EDBLS12_377"] = "EDBLS12_377";
	return SigningAlgorithm;
}({});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs-wallet+core@1.0.16_@dynamic-labs-wallet+forward-mpc-client@0.10.1_@dynami_1f702c24c2139e4e49a00a14dd7418f5/node_modules/@dynamic-labs-wallet/core/index.esm.js
var ENVIRONMENT_ENUM = /*#__PURE__*/ function(ENVIRONMENT_ENUM) {
	ENVIRONMENT_ENUM["development"] = "development";
	ENVIRONMENT_ENUM["preprod"] = "preprod";
	ENVIRONMENT_ENUM["production"] = "production";
	return ENVIRONMENT_ENUM;
}({});
var WalletOperation = /*#__PURE__*/ function(WalletOperation) {
	WalletOperation["REACH_THRESHOLD"] = "REACH_THRESHOLD";
	WalletOperation["REACH_ALL_PARTIES"] = "REACH_ALL_PARTIES";
	WalletOperation["SIGN_MESSAGE"] = "SIGN_MESSAGE";
	WalletOperation["SIGN_TRANSACTION"] = "SIGN_TRANSACTION";
	WalletOperation["REFRESH"] = "REFRESH";
	WalletOperation["RESHARE"] = "RESHARE";
	WalletOperation["EXPORT_PRIVATE_KEY"] = "EXPORT_PRIVATE_KEY";
	WalletOperation["NO_OPERATION"] = "NO_OPERATION";
	WalletOperation["RECOVER"] = "RECOVER";
	return WalletOperation;
}({});
var IFRAME_DOMAIN_MAP = {
	development: "http://localhost:4200",
	preprod: "https://app.dynamic-preprod.xyz",
	production: "https://app.dynamicauth.com"
};
var BITCOIN_DERIVATION_PATHS = {
	NATIVE_SEGWIT: [
		84,
		0,
		0,
		0,
		0
	],
	TAPROOT: [
		86,
		0,
		0,
		0,
		0
	]
};
/**
* Midnight derivation paths for different address types
* Based on BIP-44 with role index at position 3:
* m/44'/2400'/0'/role/0
*/ var MIDNIGHT_DERIVATION_PATHS = {
	UNSHIELDED: [
		44,
		2400,
		0,
		0,
		0
	],
	SHIELDED: [
		44,
		2400,
		0,
		3,
		0
	],
	DUST: [
		44,
		2400,
		0,
		2,
		0
	]
};
BITCOIN_DERIVATION_PATHS.TAPROOT, SigningAlgorithm.BIP340, BITCOIN_DERIVATION_PATHS.NATIVE_SEGWIT, SigningAlgorithm.ECDSA;
SigningAlgorithm.ECDSA, SigningAlgorithm.ED25519, SigningAlgorithm.ED25519, SigningAlgorithm.ED25519, SigningAlgorithm.ED25519, SigningAlgorithm.ED25519, SigningAlgorithm.ED25519, SigningAlgorithm.ECDSA, SigningAlgorithm.ECDSA, SigningAlgorithm.EDBLS12_377, MIDNIGHT_DERIVATION_PATHS.UNSHIELDED, SigningAlgorithm.BIP340;
var URL_PATTERNS = {
	[ENVIRONMENT_ENUM.development]: /^http:\/\/localhost:\d+$/,
	[ENVIRONMENT_ENUM.preprod]: /-preprod/,
	[ENVIRONMENT_ENUM.production]: /^(?!.*dynamic-preprod)(?!http:\/\/localhost:\d+).*/
};
function getEnvironmentFromUrl(url) {
	if (!url) return ENVIRONMENT_ENUM.production;
	if (URL_PATTERNS[ENVIRONMENT_ENUM.development].test(url)) return ENVIRONMENT_ENUM.development;
	if (URL_PATTERNS[ENVIRONMENT_ENUM.preprod].test(url)) return ENVIRONMENT_ENUM.preprod;
	return ENVIRONMENT_ENUM.production;
}
function _extends$1() {
	_extends$1 = Object.assign || function assign(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
var AuthMode = /*#__PURE__*/ function(AuthMode) {
	AuthMode["HEADER"] = "header";
	AuthMode["COOKIE"] = "cookie";
	return AuthMode;
}({});
var NoopLogger = class {
	debug() {}
	info() {}
	warn() {}
	error() {}
};
var _Logger = class Logger {
	static configure(logger) {
		this._instance = logger;
	}
	static setContext(context) {
		this._context = _extends$1({}, this._context, context);
	}
	static resetContext() {
		this._context = {};
	}
	static debug(message, ...args) {
		const { context } = this._parse(args);
		if (context) this._instance.debug(message, context);
		else this._instance.debug(message);
	}
	static info(message, ...args) {
		const { context } = this._parse(args);
		if (context) this._instance.info(message, context);
		else this._instance.info(message);
	}
	static warn(message, ...args) {
		const { context } = this._parse(args);
		if (context) this._instance.warn(message, context);
		else this._instance.warn(message);
	}
	static error(message, ...args) {
		const { error, context } = this._parse(args);
		if (error) this._instance.error(message, context != null ? context : {}, error);
		else if (context) this._instance.error(message, context);
		else this._instance.error(message);
	}
	/**
	* Separates variadic args into a merged context object and an optional Error.
	* All plain objects are merged (later args win). Error instances are extracted.
	* Handles unknown/primitive args by wrapping them in a context object.
	*/ static _parse(args) {
		let error;
		let merged = _extends$1({}, this._context);
		let hasData = Object.keys(this._context).length > 0;
		for (const arg of args) if (arg instanceof Error) error = arg;
		else if (arg !== null && typeof arg === "object") {
			merged = _extends$1({}, merged, arg);
			hasData = true;
		} else if (arg !== void 0 && arg !== null) {
			merged = _extends$1({}, merged, { value: arg });
			hasData = true;
		}
		return {
			context: hasData ? merged : void 0,
			error
		};
	}
};
_Logger._instance = new NoopLogger(), _Logger._context = {};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/messageTransport/messageTransport.js
/** Creates a simple message transport for general use */
var createMessageTransport = () => {
	const listeners = /* @__PURE__ */ new Set();
	return {
		emit: (message) => listeners.forEach((callback) => callback(message)),
		off: (callback) => listeners.delete(callback),
		on: (callback) => listeners.add(callback)
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/messageTransport/decorators/applyDefaultMessageOrigin/applyDefaultMessageOrigin.js
/** Allows setting a default origin, making the origin property optional */
var applyDefaultMessageOrigin = ({ defaultOrigin, messageTransport }) => Object.assign(Object.assign({}, messageTransport), {
	defaultOrigin,
	emit: (message) => {
		var _a;
		messageTransport.emit(Object.assign(Object.assign({}, message), { origin: (_a = message.origin) !== null && _a !== void 0 ? _a : defaultOrigin }));
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/messageTransport/decorators/applyRecoveryManager/applyRecoveryManager.js
var MAX_RETRIES = 1;
/**
* Applies recovery management functionality to a MessageTransport
* This allows for handling message delivery failures and connection recovery
*/
var applyRecoveryManager = ({ messageTransport }) => {
	const eventEmitter = new import_eventemitter3.default();
	const messageRetryCounts = /* @__PURE__ */ new Map();
	return Object.assign(Object.assign({}, messageTransport), { recoveryManager: {
		canRetryMessageSessionId: (messageSessionId) => {
			var _a;
			return ((_a = messageRetryCounts.get(messageSessionId)) !== null && _a !== void 0 ? _a : 0) < MAX_RETRIES;
		},
		onRecoveryRequested: (callback) => {
			eventEmitter.on("recoveryRequested", callback);
			return () => eventEmitter.off("recoveryRequested", callback);
		},
		triggerRecovery: (messageSessionId) => {
			var _a;
			const currentCount = (_a = messageRetryCounts.get(messageSessionId)) !== null && _a !== void 0 ? _a : 0;
			messageRetryCounts.set(messageSessionId, currentCount + 1);
			if (messageTransport.isBlocked()) return;
			eventEmitter.emit("recoveryRequested");
		}
	} });
};
/**
* Type guard to check if a MessageTransport has recovery management functionality
*/
var hasRecoveryManager = (messageTransport) => "recoveryManager" in messageTransport;
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/messageTransport/decorators/makeWaitForUnblock/makeWaitForUnblock.js
/**
* Decorator that adds the following features to a MessageTransport:
* 1. Any emit calls will not emit the message yet. These messages will be stored.
* 2. When the unblock method is called:
*    1. All stored messages are emitted.
*    2. Any future emit calls will no longer store the message, and instead
*      will emit them right away, as normal.
*/
var makeWaitForUnblock = ({ messageTransport, bypassBlockIf = () => false }) => {
	/** Whether to block any new messages */
	let blocked = true;
	/**
	* Messages pending to be sent once unblocked, along with their onEmit callbacks
	*/
	let pendingMessages = [];
	/**
	* Ids of incoming message sessions.
	* We don't want to block responses to these messages.
	*/
	const bypassedMessageSessionIds = /* @__PURE__ */ new Set();
	return {
		block: () => {
			blocked = true;
		},
		emit: (message, options) => {
			const { onEmit } = options !== null && options !== void 0 ? options : {};
			if (bypassBlockIf(message) && blocked) bypassedMessageSessionIds.add(message.messageSessionId);
			if (blocked && !bypassedMessageSessionIds.has(message.messageSessionId)) {
				pendingMessages.push({
					message,
					onEmit
				});
				return;
			}
			messageTransport.emit(message);
			onEmit === null || onEmit === void 0 || onEmit();
		},
		isBlocked: () => blocked,
		off: (callback) => messageTransport.off(callback),
		on: (callback) => messageTransport.on(callback),
		unblock: () => {
			if (!blocked) return;
			blocked = false;
			for (const { message, onEmit } of pendingMessages) {
				messageTransport.emit(message);
				onEmit === null || onEmit === void 0 || onEmit();
			}
			pendingMessages = [];
			bypassedMessageSessionIds.clear();
		}
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/_virtual/_tslib.js
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
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/debug/debug.js
/**
* Global debug flag that can be set to true to enable debug mode
* for all resources that use the message transport.
*/
var globalDebugEnabled = false;
var isGlobalDebugEnabled = () => globalDebugEnabled;
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/utils/isSerializedError/isSerializedError.js
var isSerializedError = (serializedError) => {
	if (typeof serializedError !== "object" || serializedError === null) return false;
	const { message, stack } = serializedError;
	return typeof message === "string" && typeof stack === "string";
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/utils/logger.js
var logger$1 = new Logger$1("message-transport");
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/utils/parseErrorFromTransport/parseErrorFromTransport.js
/**
* Parses a serialized error object back into an Error instance.
* This function will recreate an Error or a specific subclass of Error
* based on the name property if it matches known error types.
* Additional properties are added back to the reconstructed error object.
*
* @param {SerializedError} serializedError - The serialized error object to parse.
* @returns {Error} - The reconstructed Error instance.
*/
var parseErrorFromTransport = (serializedError) => {
	const { message, name, stack } = serializedError, otherProps = __rest(serializedError, [
		"message",
		"name",
		"stack"
	]);
	let error;
	if (message) try {
		const data = JSON.parse(message);
		if (Array.isArray(data)) return data;
	} catch (_a) {}
	switch (name) {
		case "TypeError":
			error = new TypeError(message);
			break;
		case "ReferenceError":
			error = new ReferenceError(message);
			break;
		case "SyntaxError":
			error = new SyntaxError(message);
			break;
		case "RangeError":
			error = new RangeError(message);
			break;
		case "EvalError":
			error = new EvalError(message);
			break;
		case "URIError":
			error = new URIError(message);
			break;
		default:
			error = new Error(message);
			error.name = name || "Error";
	}
	if (stack) error.stack = [message, stack].join("\n");
	Object.assign(error, otherProps);
	return error;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/utils/serializeErrorForTransport/serializeErrorForTransport.js
/**
* Serializes an error to a JSON object to be sent by transport.
* This function checks if the input is an instance of Error to capture
* standard properties like message, name, and stack. It also attempts to
* serialize any enumerable properties that are present on error-like objects.
*
* @param {unknown} err - The error or error-like object to serialize.
* @returns {SerializedError} - The serialized error object.
*/
var serializeErrorForTransport = (err) => {
	if (err instanceof Error) return convertError(err);
	else if (Array.isArray(err)) return { message: JSON.stringify(err) };
	else if (typeof err === "object" && err !== null) {
		const errorMessage = serializeObjectToMessage(err);
		return convertError(Object.assign({
			message: errorMessage,
			name: "Error",
			stack: ""
		}, err));
	}
	return { message: String(err) };
};
var convertError = (err) => Object.assign({
	message: err.message,
	name: err.name,
	stack: err.stack
}, err);
var serializeObjectToMessage = (obj) => {
	try {
		return JSON.stringify(obj);
	} catch (_a) {
		return String(obj);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/requestChannel/utils/utils.js
/** Given a request event name, returns the event name for its resolve */
var getResolveMessageType = (type) => `${type}__resolve`;
/** Given a request event name, returns the event name for its reject */
var getRejectMessageType = (type) => `${type}__reject`;
/** Given a request event name, returns the event name for its acknowledgement */
var getAckMessageType = (type) => `${type}__ack`;
/** Returns a "no handlers registered" error for a message type */
var createNoHandlerError = (type) => {
	const message = `No handlers were registered for message of type ${type}`;
	logger$1.warn(message);
	return new RequestChannelNotHandledError(message);
};
/**
* When a request is sent, a timer will be started. If it times out before
* a corresponding ack message is received, we reject the request with NO_HANDLERS_REGISTERED.
*
* This controls how many ms we should wait before we time out.
*/
var TIMEOUT_DURATION = 5e3;
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/requestChannel/createRequestChannelMessageSender/createRequestChannelMessageSender.js
var createRequestChannelMessageSender = ({ requestType, messageSessionId, timeoutMap, onReceiveAck, messageTransport, onTimeout, params, debugOverride, disableAckForOutgoingMessage = false }) => {
	/**
	* Tracks whether this sender's message has timed out.
	* This way we can identify that it was a false negative if the message
	* eventually arrives later.
	*/
	let messageTimedOut = false;
	const ackMessageType = getAckMessageType(requestType);
	const isDebugEnabled = () => debugOverride !== null && debugOverride !== void 0 ? debugOverride : isGlobalDebugEnabled();
	const outgoingMessage = {
		args: params,
		doNotAck: disableAckForOutgoingMessage,
		messageSessionId,
		type: requestType
	};
	const getTimestamp = () => (/* @__PURE__ */ new Date()).toISOString();
	const handleAckMessage = ({ messageSessionId: incomingSessionId, type: incomingType, doNotAck: incomingDoNotAck }) => {
		if (incomingSessionId !== messageSessionId || incomingType !== ackMessageType || incomingDoNotAck) return;
		if (isDebugEnabled()) logger$1.debug(`[messageSender ${requestType} ${getTimestamp()}] — received ack message (messageSessionId: ${messageSessionId}). Message timeout ID: ${timeoutMap[messageSessionId]}. Content of timeoutMap: ${JSON.stringify(timeoutMap)}`);
		clearTimeout(timeoutMap[messageSessionId]);
		delete timeoutMap[messageSessionId];
		onReceiveAck === null || onReceiveAck === void 0 || onReceiveAck();
		if (messageTimedOut) {
			if (isDebugEnabled()) logger$1.debug(`[messageSender ${requestType} ${getTimestamp()}] — identified a false negative for message time out. Message: ${requestType} with session id ${messageSessionId}`);
			logger$1.instrument(`Identified a false negative for message time out. Message: ${requestType} with session id ${messageSessionId}. Params: ${JSON.stringify(params)}`);
		}
	};
	const sendMessage = () => {
		if (disableAckForOutgoingMessage) {
			messageTransport.emit(outgoingMessage);
			return;
		}
		const startTimer = () => {
			const timeoutTimer = setTimeout(() => {
				if (hasRecoveryManager(messageTransport) && messageTransport.recoveryManager.canRetryMessageSessionId(messageSessionId)) {
					if (isDebugEnabled()) logger$1.debug(`[messageSender ${requestType} ${getTimestamp()}] — timed out, triggering recovery (messageSessionId: ${messageSessionId})`);
					messageTransport.recoveryManager.triggerRecovery(messageSessionId);
					if (isDebugEnabled()) logger$1.debug(`[messageSender ${requestType} ${getTimestamp()}] — attempting to send message again (messageSessionId: ${messageSessionId})`);
					sendMessage();
				} else {
					onTimeout();
					messageTimedOut = true;
				}
			}, TIMEOUT_DURATION);
			if (isDebugEnabled()) logger$1.debug(`[messageSender ${requestType} ${getTimestamp()}] — setting timeout timer (messageSessionId: ${messageSessionId}). Timeout ID: ${timeoutTimer}. Content of timeoutMap: ${JSON.stringify(timeoutMap)}`);
			timeoutMap[messageSessionId] = timeoutTimer;
		};
		if ("isBlocked" in messageTransport && messageTransport.isBlocked()) {
			messageTransport.emit(outgoingMessage, { onEmit: startTimer });
			return;
		}
		startTimer();
		messageTransport.emit(outgoingMessage);
	};
	return {
		handleAckMessage,
		sendMessage
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/requestChannel/requestChannel.js
/**
* Allows handling and submitting requests to and from a webview.
* Requests are messages that (can) expect some response.
*
* Functions similarly to an event emitter, but adds a response feature:
* - Emitting an event type is the act of making a "request" of a specific type,
* and it returns a promise that will resolve to the request's response.
* - Listening to an event type is the act of "handling" requests of a specific type.
* This handler callback must return a promise if this request type expects responses.
*
* Think of it this way:
* Whenever I emit an event, I am submitting a request.
* Whoever listens to the event will handle my request.
* If the request type expects some kind of response, they will
* return a promise that resolves (or rejects) after my request is fulfilled.
*
* This is an abstraction built on top of the MessageTransport interface.
*/
var createRequestChannel = (messageTransport, { debugOverride, disableAcknowledgement } = {}) => {
	/** Used to generated unique ids */
	let uniqueIdCounter = 0;
	/** Id prefix unique to this channel */
	const idPrefix = Math.random().toString();
	/** Always returns a different string */
	const getUniqueId = () => `${idPrefix}-${uniqueIdCounter++}`;
	/** Maps a request's session ID to its time out timer */
	const timeoutMap = {};
	const isDebugEnabled = () => debugOverride !== null && debugOverride !== void 0 ? debugOverride : isGlobalDebugEnabled();
	const getTimestamp = () => (/* @__PURE__ */ new Date()).toISOString();
	return {
		emit: (requestType, ...params) => new Promise((resolve, reject) => {
			const { handleAckMessage, sendMessage } = createRequestChannelMessageSender({
				debugOverride,
				disableAckForOutgoingMessage: disableAcknowledgement,
				messageSessionId: getUniqueId(),
				messageTransport,
				onReceiveAck: () => {
					cleanupMessageHandler();
					resolve();
				},
				onTimeout: () => {
					reject(createNoHandlerError(requestType));
					cleanupMessageHandler();
				},
				params,
				requestType,
				timeoutMap
			});
			const cleanupMessageHandler = () => messageTransport.off(handleAckMessage);
			if (disableAcknowledgement) resolve();
			else messageTransport.on(handleAckMessage);
			sendMessage();
		}),
		handle: (requestType, handler) => {
			const messageHandler = (_a) => __awaiter(void 0, [_a], void 0, function* ({ args, messageSessionId, type: incomingType, doNotAck = false }) {
				if (requestType !== incomingType) return;
				if (!doNotAck) messageTransport.emit({
					args: [],
					messageSessionId,
					type: getAckMessageType(requestType)
				});
				const result = handler(...args);
				if (!(result instanceof Promise)) return;
				try {
					const response = yield result;
					messageTransport.emit({
						args: [response],
						messageSessionId,
						type: getResolveMessageType(requestType)
					});
				} catch (error) {
					messageTransport.emit({
						args: [serializeErrorForTransport(error)],
						messageSessionId,
						type: getRejectMessageType(requestType)
					});
				}
			});
			messageTransport.on(messageHandler);
			return () => {
				messageTransport.off(messageHandler);
			};
		},
		request: (requestType, ...params) => new Promise((resolve, reject) => {
			const messageSessionId = getUniqueId();
			const resolveMessageType = getResolveMessageType(requestType);
			const rejectMessageType = getRejectMessageType(requestType);
			const { handleAckMessage, sendMessage } = createRequestChannelMessageSender({
				debugOverride,
				disableAckForOutgoingMessage: disableAcknowledgement,
				messageSessionId,
				messageTransport,
				onTimeout: () => {
					reject(createNoHandlerError(requestType));
					cleanupMessageHandler();
				},
				params,
				requestType,
				timeoutMap
			});
			const handleMessage = (message) => {
				if (message.messageSessionId !== messageSessionId) return;
				if (isDebugEnabled()) logger$1.debug(`[request ${requestType} ${getTimestamp()}] — received response message (messageSessionId: ${messageSessionId})`);
				const { args: [result], type: incomingType } = message;
				if (incomingType === resolveMessageType) {
					cleanupMessageHandler();
					resolve(result);
					if (isDebugEnabled()) logger$1.debug(`[request ${requestType} ${getTimestamp()}] — resolved message (messageSessionId: ${messageSessionId})`);
					return;
				}
				if (incomingType === rejectMessageType) {
					cleanupMessageHandler();
					if (isSerializedError(result)) reject(parseErrorFromTransport(result));
					else reject(result);
					if (isDebugEnabled()) logger$1.debug(`[request ${requestType} ${getTimestamp()}] — rejected message (messageSessionId: ${messageSessionId})`);
					return;
				}
				handleAckMessage(message);
			};
			const cleanupMessageHandler = () => messageTransport.off(handleMessage);
			messageTransport.on(handleMessage);
			sendMessage();
		})
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+message-transport@4.89.0/node_modules/@dynamic-labs/message-transport/src/utils/parseMessageTransportData/parseMessageTransportData.js
var parseMessageTransportData = (parsedData) => {
	if (!parsedData || typeof parsedData !== "object") return;
	const message = {
		args: parsedData.args,
		doNotAck: parsedData.doNotAck,
		messageSessionId: parsedData.messageSessionId,
		origin: parsedData.origin,
		transportStamps: parsedData.transportStamps,
		type: parsedData.type
	};
	if (!Array.isArray(message.args) || typeof message.messageSessionId !== "string" || typeof message.origin !== "string" || typeof message.type !== "string") return;
	return message;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs-wallet+browser-wallet-client@1.0.16_@dynamic-labs-wallet+forward-mpc-clie_e2c83e6e8d584eba04e82aad0721a03d/node_modules/@dynamic-labs-wallet/browser-wallet-client/index.esm.js
function _extends() {
	_extends = Object.assign || function assign(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
var iframeMessageHandler = class {
	handleIframeMessageResponseError(response) {
		if (typeof response === "object" && response !== null && "error" in response) throw new Error(String(response.error));
	}
	async getWallets(request) {
		const response = await this.requestChannel.request("getWallets", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async getAllWallets(request) {
		const response = await this.requestChannel.request("getAllWallets", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async getWallet(request) {
		const response = await this.requestChannel.request("getWallet", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async createWalletAccount(request) {
		const response = await this.requestChannel.request("createWalletAccount", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async requiresPasswordForOperation(request) {
		const response = await this.requestChannel.request("requiresPasswordForOperation", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async signMessage(request) {
		const response = await this.requestChannel.request("signMessage", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async signRawMessage(request) {
		const response = await this.requestChannel.request("signRawMessage", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async signTransaction(request) {
		const response = await this.requestChannel.request("signTransaction", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async isPasswordEncrypted(request) {
		const response = await this.requestChannel.request("isPasswordEncrypted", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async backupKeySharesToGoogleDrive(request) {
		const response = await this.requestChannel.request("backupKeySharesToGoogleDrive", request);
		this.handleIframeMessageResponseError(response);
	}
	async backupKeySharesToICloud(request) {
		const response = await this.requestChannel.request("backupKeySharesToICloud", request);
		this.handleIframeMessageResponseError(response);
	}
	async displayICloudSignIn(chainName) {
		await this.requestChannel.request("displayICloudSignIn", { chainName });
	}
	async hideICloudSignIn() {
		await this.requestChannel.request("hideICloudSignIn");
	}
	async isICloudAuthenticated(chainName) {
		return this.requestChannel.request("isICloudAuthenticated", { chainName });
	}
	async delegateKeyShares(request) {
		const response = await this.requestChannel.request("delegateKeyShares", request);
		this.handleIframeMessageResponseError(response);
	}
	async revokeDelegation(request) {
		const response = await this.requestChannel.request("revokeDelegation", request);
		this.handleIframeMessageResponseError(response);
	}
	async exportClientKeysharesFromGoogleDrive(request) {
		const response = await this.requestChannel.request("exportClientKeysharesFromGoogleDrive", request);
		this.handleIframeMessageResponseError(response);
	}
	async refreshWalletAccountShares(request) {
		const response = await this.requestChannel.request("refreshWalletAccountShares", request);
		this.handleIframeMessageResponseError(response);
	}
	async reshare(request) {
		const response = await this.requestChannel.request("reshare", request);
		this.handleIframeMessageResponseError(response);
	}
	async exportPrivateKey(request) {
		const response = await this.requestChannel.request("exportPrivateKey", request);
		this.handleIframeMessageResponseError(response);
	}
	async proveAleoTransaction(request) {
		const response = await this.requestChannel.request("proveAleoTransaction", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async findAleoOwnedRecords(request) {
		const response = await this.requestChannel.request("findAleoOwnedRecords", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async isAleoFeemasterCovered(request) {
		const response = await this.requestChannel.request("isAleoFeemasterCovered", request);
		this.handleIframeMessageResponseError(response);
		return Boolean(response);
	}
	async verifyPassword(request) {
		const response = await this.requestChannel.request("verifyPassword", request);
		this.handleIframeMessageResponseError(response);
	}
	async updatePassword(request) {
		const response = await this.requestChannel.request("updatePassword", request);
		this.handleIframeMessageResponseError(response);
	}
	async setPassword(request) {
		const response = await this.requestChannel.request("setPassword", request);
		this.handleIframeMessageResponseError(response);
	}
	async importPrivateKey(request) {
		const response = await this.requestChannel.request("importPrivateKey", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async sendAuthToken(token, authMode, traceContext) {
		return this.requestChannel.request("sendAuthToken", token, authMode, traceContext);
	}
	async exportClientKeyshares(request) {
		const response = await this.requestChannel.request("exportClientKeyshares", request);
		this.handleIframeMessageResponseError(response);
	}
	async offlineExportPrivateKey(request) {
		const response = await this.requestChannel.request("offlineExportPrivateKey", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async signTypedData(request) {
		const response = await this.requestChannel.request("signTypedData", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async cleanup() {
		return this.requestChannel.request("cleanup");
	}
	async getWalletRecoveryState(request) {
		const response = await this.requestChannel.request("getWalletRecoveryState", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	async unlockWallet(request) {
		const response = await this.requestChannel.request("unlockWallet", request);
		this.handleIframeMessageResponseError(response);
		return response;
	}
	constructor(messageTransport) {
		this.requestChannel = createRequestChannel(messageTransport);
	}
};
var logger = new Logger$1("DynamicWaasWalletClient");
var setupMessageTransportBridge = (messageTransport, iframe, iframeOrigin) => {
	const logger = new Logger$1("debug");
	function hostListener(message) {
		if (message.origin !== "host") return;
		if (!(iframe == null ? void 0 : iframe.contentWindow) || iframe.isConnected === false) {
			logger.error("Cannot send message to iframe: contentWindow is unavailable");
			return;
		}
		try {
			iframe.contentWindow.postMessage(message, iframeOrigin);
		} catch (error) {
			logger.error("Failed to post message to iframe:", error);
		}
	}
	messageTransport.on(hostListener);
	const handleIncomingMessage = (message) => {
		const { data } = message;
		if (!data) return;
		if ((data == null ? void 0 : data.origin) !== "webview") return;
		if (typeof data !== "object") return;
		try {
			const message = parseMessageTransportData(data);
			messageTransport.emit(message);
		} catch (error) {
			if (!(error instanceof SyntaxError)) logger.error("Error handling incoming message:", error);
		}
	};
	/**
	* Handle incoming message from android client
	*/ document.addEventListener("message", handleIncomingMessage);
	/**
	* Handle incoming message from iOS client
	*/ window.addEventListener("message", handleIncomingMessage);
	return () => {
		messageTransport.off(hostListener);
		document.removeEventListener("message", handleIncomingMessage);
		window.removeEventListener("message", handleIncomingMessage);
	};
};
var createIframeWaasSDKContainer = () => {
	let iframe = null;
	const messageHandlers = /* @__PURE__ */ new Set();
	const errorHandlers = /* @__PURE__ */ new Set();
	let windowListenerAttached = false;
	let cspListenerAttached = false;
	const windowMessageListener = (event) => {
		if (event.source !== (iframe == null ? void 0 : iframe.contentWindow)) return;
		let expectedOrigin;
		try {
			expectedOrigin = new URL(iframe.src).origin;
		} catch (e) {
			return;
		}
		if (event.origin !== expectedOrigin) return;
		const { data } = event;
		const isHandshake = typeof data === "string" && data.length > 0;
		const isTransportMessage = typeof data === "object" && data !== null && !Array.isArray(data) && "origin" in data && data.origin === "webview";
		if (!isHandshake && !isTransportMessage) return;
		for (const handler of messageHandlers) handler(data);
	};
	const fireError = (error) => {
		for (const handler of errorHandlers) handler(error);
	};
	const cspViolationListener = (event) => {
		var _event_blockedURI, _event_violatedDirective, _event_violatedDirective1;
		const iframeOrigin = (iframe == null ? void 0 : iframe.src) ? new URL(iframe.src).origin : void 0;
		if (!(iframeOrigin && ((_event_blockedURI = event.blockedURI) == null ? void 0 : _event_blockedURI.includes(iframeOrigin)) || ((_event_violatedDirective = event.violatedDirective) == null ? void 0 : _event_violatedDirective.includes("frame-src")) || ((_event_violatedDirective1 = event.violatedDirective) == null ? void 0 : _event_violatedDirective1.includes("child-src")))) return;
		logger.error("CSP violation detected that may affect iframe loading:", {
			blockedURI: event.blockedURI,
			violatedDirective: event.violatedDirective,
			originalPolicy: event.originalPolicy,
			sourceFile: event.sourceFile,
			lineNumber: event.lineNumber,
			columnNumber: event.columnNumber,
			iframeOrigin
		});
	};
	return {
		async setUrl(url) {
			iframe = document.createElement("iframe");
			iframe.style.display = "none";
			iframe.style.position = "fixed";
			iframe.style.top = "0";
			iframe.style.left = "0";
			iframe.style.width = "0";
			iframe.style.height = "0";
			iframe.style.border = "none";
			iframe.style.pointerEvents = "none";
			iframe.setAttribute("title", "Dynamic Wallet Iframe");
			iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-downloads");
			iframe.setAttribute("referrerpolicy", "origin");
			iframe.onerror = (error) => {
				fireError(error);
			};
			if (!cspListenerAttached) {
				document.addEventListener("securitypolicyviolation", cspViolationListener);
				cspListenerAttached = true;
			}
			iframe.src = url;
			document.body.appendChild(iframe);
		},
		sendMessage(data) {
			if (!(iframe == null ? void 0 : iframe.contentWindow)) throw new Error("Cannot send message: iframe not loaded");
			const origin = new URL(iframe.src).origin;
			try {
				iframe.contentWindow.postMessage(data, origin);
			} catch (error) {
				logger.error("Failed to post message to iframe:", error);
				throw error;
			}
		},
		onMessage(handler) {
			messageHandlers.add(handler);
			if (!windowListenerAttached) {
				window.addEventListener("message", windowMessageListener);
				windowListenerAttached = true;
			}
			return () => {
				messageHandlers.delete(handler);
			};
		},
		onError(handler) {
			errorHandlers.add(handler);
			return () => {
				errorHandlers.delete(handler);
			};
		},
		isAlive() {
			var _iframe_isConnected;
			return !!(iframe == null ? void 0 : iframe.contentWindow) && ((_iframe_isConnected = iframe.isConnected) != null ? _iframe_isConnected : true);
		},
		destroy() {
			if (windowListenerAttached) {
				window.removeEventListener("message", windowMessageListener);
				windowListenerAttached = false;
			}
			if (cspListenerAttached) {
				document.removeEventListener("securitypolicyviolation", cspViolationListener);
				cspListenerAttached = false;
			}
			messageHandlers.clear();
			errorHandlers.clear();
			iframe?.remove();
			iframe = null;
		}
	};
};
var FRAME_ANCESTORS_QUERY_PARAM = "frameAncestors";
/**
* Builds the iframe message transport with the recovery + block decorators.
*
* The transport stack from outside in:
*   applyRecoveryManager  — exposes recoveryManager + retry tracking used by
*                           the request channel's 5s timeout.
*   applyDefaultMessageOrigin — stamps outgoing messages with origin: 'host'.
*   makeWaitForUnblock    — lets us pause emit() while we rebuild a torn-down
*                           iframe so in-flight retries land on a fresh bridge
*                           instead of the dead one. bypassBlockIf lets the
*                           re-auth message and incoming webview messages flow
*                           during the blocked window — without that bypass,
*                           the queued retry would arrive at the rebuilt iframe
*                           before its auth token and get rejected.
*/ function createIframeMessageTransport() {
	return applyRecoveryManager({ messageTransport: applyDefaultMessageOrigin({
		defaultOrigin: "host",
		messageTransport: makeWaitForUnblock({
			messageTransport: createMessageTransport(),
			bypassBlockIf: (message) => message.origin === "webview" || message.type === "sendAuthToken"
		})
	}) });
}
var IframeManager = class IframeManager {
	/**
	* Apply constructor-provided overrides for the iframe load timeout and
	* retry budget to the static singleton state. Writing to the statics keeps
	* the timeout doubling logic in {@link resetSharedWaasSDKContainer}
	* coherent across instances that share the same `iframeLoadPromise`.
	*
	* Invalid values (non-finite, out of range) are clamped or ignored rather
	* than thrown — the iframe must still load even if a misconfigured host
	* passes nonsense.
	*/ static applyLoadTuning({ iframeLoadTimeout, maxRetryAttempts }) {
		if (typeof iframeLoadTimeout === "number" && Number.isFinite(iframeLoadTimeout)) IframeManager.iframeLoadTimeout = Math.min(Math.max(iframeLoadTimeout, IframeManager.minIframeLoadTimeout), IframeManager.maxIframeLoadTimeout);
		if (typeof maxRetryAttempts === "number" && Number.isFinite(maxRetryAttempts)) IframeManager.maxRetryAttempts = Math.min(Math.max(Math.floor(maxRetryAttempts), 0), IframeManager.maxAllowedRetryAttempts);
	}
	async initialize() {
		await this.doInitializeIframeCommunication();
	}
	/**
	* this is called on class construction time
	* @returns {Promise<void>} that resolves when the iframe is loaded and the message transport and iframe storage are initialized
	*/ initializeIframeCommunication() {
		var _IframeManager;
		(_IframeManager = IframeManager).iframeLoadPromise ?? (_IframeManager.iframeLoadPromise = this.doInitializeIframeCommunication());
		return IframeManager.iframeLoadPromise;
	}
	/**
	* initialize the iframe communication by awaiting the iframe load promise
	* and initializing the message transport and iframe storage after iframe is successfully loaded
	*/ async doInitializeIframeCommunication() {
		try {
			await this.loadIframe();
		} catch (error) {
			this.logger.error("Error initializing iframe:", error);
			throw error;
		}
	}
	buildIframeUrlSearchParams() {
		var _this_instanceId, _this_sdkVersion, _this_baseClientKeysharesRelayApiUrl;
		const params = new URLSearchParams({
			instanceId: (_this_instanceId = this.instanceId) != null ? _this_instanceId : "",
			hostOrigin: window.location.origin,
			environmentId: this.environmentId,
			baseApiUrl: this.baseApiUrl,
			baseMPCRelayApiUrl: this.baseMPCRelayApiUrl,
			sdkVersion: (_this_sdkVersion = this.sdkVersion) != null ? _this_sdkVersion : "",
			debug: String(this.debug),
			baseClientKeysharesRelayApiUrl: (_this_baseClientKeysharesRelayApiUrl = this.baseClientKeysharesRelayApiUrl) != null ? _this_baseClientKeysharesRelayApiUrl : "",
			secureStorage: this.secureStorage ? "true" : ""
		});
		const seenAdditional = /* @__PURE__ */ new Set();
		for (const raw of this.additionalTrustedOrigins) {
			const trimmed = raw.trim();
			if (!trimmed) continue;
			if (trimmed.length > IframeManager.maxTrustedOriginStringLength) {
				this.logger.warn("Skipping additionalTrustedOrigin (exceeds max length)");
				continue;
			}
			try {
				const u = new URL(trimmed);
				if (u.protocol !== "http:" && u.protocol !== "https:") {
					this.logger.warn("Skipping additionalTrustedOrigin (unsupported scheme)", { trimmed });
					continue;
				}
				const origin = u.origin;
				if (seenAdditional.has(origin)) continue;
				if (seenAdditional.size >= IframeManager.maxAdditionalTrustedOrigins) {
					this.logger.warn("additionalTrustedOrigin limit reached, extra entries ignored");
					break;
				}
				seenAdditional.add(origin);
				params.append(FRAME_ANCESTORS_QUERY_PARAM, origin);
			} catch (e) {
				this.logger.warn("Skipping invalid additionalTrustedOrigin", { trimmed });
			}
		}
		return params;
	}
	/**
	* Build the URL that the transport provider should load.
	*/ buildIframeUrl() {
		const params = this.buildIframeUrlSearchParams();
		return `${this.iframeDomain}/waas-v1/${this.environmentId}?${params.toString()}`;
	}
	/**
	* Set up the bridge between the MessageTransport and the WaasSDKContainer.
	* - Host-origin messages from the transport are forwarded to the sandbox host via sendMessage.
	* - Messages received from the sandbox host are parsed and emitted into the transport.
	*
	* Returns a teardown function so callers can detach listeners when the
	* sandbox host is rebuilt (needed by the recovery flow — the transport
	* survives the rebuild and would otherwise accumulate stale listeners).
	*/ setupWaasSDKContainerBridge(transport, waasSDKContainer) {
		const transportListener = (message) => {
			if (message.origin === "host") waasSDKContainer.sendMessage(message);
		};
		transport.on(transportListener);
		const unsubscribeFromWaasSDKContainer = waasSDKContainer.onMessage((data) => {
			if (typeof data !== "object" || data === null) return;
			if (!("origin" in data) || data.origin !== "webview") return;
			try {
				const parsed = parseMessageTransportData(data);
				if (!parsed) return;
				transport.emit(parsed);
			} catch (error) {
				if (!(error instanceof SyntaxError)) this.logger.error("Error handling incoming message:", error);
			}
		});
		return () => {
			transport.off(transportListener);
			unsubscribeFromWaasSDKContainer();
		};
	}
	/**
	* initialize the message transport after iframe is successfully loaded
	*/ async initializeMessageTransport() {
		if (this.messageTransport && this.iframeMessageHandler) {
			this.logger.debug("Skipping initializeMessageTransport: transport and message handler already initialized");
			return;
		}
		await this.initializeIframeCommunication();
		const transport = createIframeMessageTransport();
		this.messageTransport = transport;
		var _this_waasSDKContainer;
		const waasSDKContainer = (_this_waasSDKContainer = this.waasSDKContainer) != null ? _this_waasSDKContainer : IframeManager.sharedWaasSDKContainer;
		if (waasSDKContainer) this.cleanupBridge = this.setupWaasSDKContainerBridge(transport, waasSDKContainer);
		else if (this.iframe) this.cleanupBridge = setupMessageTransportBridge(this.messageTransport, this.iframe, this.iframeDomain);
		else throw new Error("No sandbox host or iframe available");
		this.iframeMessageHandler = new iframeMessageHandler(this.messageTransport);
		if (this.secureStorage || this.getSignedSessionIdCallback || this.onUnauthorized) this.iframeRequestChannel = this.setupIframeRequestHandlers(this.messageTransport);
		this.cleanupRecoverySubscription = transport.recoveryManager.onRecoveryRequested(() => {
			this.logger.info("(recoverIframe) Iframe transport recovery requested — rebuilding iframe");
			transport.block();
			this.recoverIframe(transport).catch((error) => {
				this.logger.error("(recoverIframe) Iframe recovery failed:", error);
				transport.unblock();
			});
		});
		transport.unblock();
		await this.initAuthToken();
	}
	/**
	* Rebuild the sandbox host and its bridge while preserving the message transport
	* (which owns the request channel's retry timer and recovery manager).
	*
	* Triggered by the request channel's recovery flow when an outgoing message
	* goes 5s without an ack — typically because the iframe was torn down by a
	* relogin or RN modal unmount and the host still holds a stale reference.
	*/ async recoverIframe(transport) {
		var _IframeManager_sharedWaasSDKContainer;
		if ((_IframeManager_sharedWaasSDKContainer = IframeManager.sharedWaasSDKContainer) == null ? void 0 : _IframeManager_sharedWaasSDKContainer.isAlive()) {
			this.logger.info("(recoverIframe) Container still alive — request-channel timeout, skipping rebuild");
			if (this.waasSDKContainer !== IframeManager.sharedWaasSDKContainer) {
				this.cleanupBridge == null || this.cleanupBridge.call(this);
				this.waasSDKContainer = IframeManager.sharedWaasSDKContainer;
				this.cleanupBridge = this.setupWaasSDKContainerBridge(transport, this.waasSDKContainer);
			}
			transport.unblock();
			return;
		}
		this.cleanupBridge == null || this.cleanupBridge.call(this);
		this.cleanupBridge = null;
		if (IframeManager.sharedWaasSDKContainer) {
			IframeManager.sharedWaasSDKContainer.destroy();
			IframeManager.sharedWaasSDKContainer = null;
		}
		IframeManager.iframeLoadPromise = null;
		this.waasSDKContainer = null;
		this.logger.info("(recoverIframe) Rebuilding shared container");
		await this.loadIframe();
		var _this_waasSDKContainer;
		const waasSDKContainer = (_this_waasSDKContainer = this.waasSDKContainer) != null ? _this_waasSDKContainer : IframeManager.sharedWaasSDKContainer;
		if (!waasSDKContainer) throw new Error("Failed to mount fresh container during recovery");
		this.cleanupBridge = this.setupWaasSDKContainerBridge(transport, waasSDKContainer);
		await this.initAuthToken();
		transport.unblock();
	}
	/**
	* Sets up message handlers for iframe → host requests (secureStorage and getSignedSessionId)
	*/ setupIframeRequestHandlers(transport) {
		const requestChannel = createRequestChannel(transport);
		if (this.secureStorage) {
			requestChannel.handle("getClientKeyShare", this.handleGetClientKeyShare.bind(this));
			requestChannel.handle("setClientKeyShare", this.handleSetClientKeyShare.bind(this));
			requestChannel.handle("removeClientKeyShare", this.handleRemoveClientKeyShare.bind(this));
		}
		if (this.getSignedSessionIdCallback) requestChannel.handle("getSignedSessionId", this.handleGetSignedSessionId.bind(this));
		if (this.onUnauthorized) requestChannel.handle("notifyUnauthorized", this.handleNotifyUnauthorized.bind(this));
		return requestChannel;
	}
	/**
	* Handler for the iframe's `notifyUnauthorized` reverse-channel request.
	* Fires the host's logout callback once per session; further 401 bursts are
	* ignored until the next session re-initializes this manager.
	*/ async handleNotifyUnauthorized(_request) {
		if (this.unauthorizedHandled) return;
		this.unauthorizedHandled = true;
		this.logger.info("(notifyUnauthorized) iframe reported a 401 — invoking host logout callback");
		try {
			await (this.onUnauthorized == null ? void 0 : this.onUnauthorized.call(this));
		} catch (error) {
			this.logger.error("(notifyUnauthorized) onUnauthorized handler threw:", error);
		}
	}
	/**
	* Handler for getClientKeyShare requests from iframe
	*/ async handleGetClientKeyShare(request) {
		if (!this.secureStorage) throw new Error("Secure storage not available");
		return { keyShares: await this.secureStorage.getClientKeyShare(request.accountAddress) };
	}
	/**
	* Handler for setClientKeyShare requests from iframe
	*/ async handleSetClientKeyShare(request) {
		if (!this.secureStorage) throw new Error("Secure storage not available");
		await this.secureStorage.setClientKeyShare(request.accountAddress, request.keyShares);
	}
	/**
	* Handler for removeClientKeyShare requests from iframe
	*/ async handleRemoveClientKeyShare(request) {
		if (!this.secureStorage) throw new Error("Secure storage not available");
		await this.secureStorage.removeClientKeyShare(request.accountAddress);
	}
	/**
	* Handler for getSignedSessionId requests from iframe
	*/ async handleGetSignedSessionId(_request) {
		if (!this.getSignedSessionIdCallback) throw new Error("Signed session ID callback not available");
		return { signedSessionId: await this.getSignedSessionIdCallback() };
	}
	/**
	* securely exchange the auth token with iframe securely
	*/ async initAuthToken() {
		if (!this.iframeMessageHandler) throw new Error("Iframe message handler not initialized");
		try {
			await this.iframeMessageHandler.sendAuthToken(this.authToken, this.authMode);
		} catch (error) {
			throw new Error("Failed to establish secure token exchange: " + error);
		}
	}
	/**
	* Reset the shared provider and iframe load promise, and iframe instance count
	*/ resetSharedWaasSDKContainer() {
		this.cleanupBridge == null || this.cleanupBridge.call(this);
		this.cleanupBridge = null;
		this.cleanupRecoverySubscription == null || this.cleanupRecoverySubscription.call(this);
		this.cleanupRecoverySubscription = null;
		if (IframeManager.sharedWaasSDKContainer) {
			IframeManager.sharedWaasSDKContainer.destroy();
			IframeManager.sharedWaasSDKContainer = null;
		}
		IframeManager.iframeInstanceCount = 0;
		IframeManager.iframeLoadPromise = null;
		this.waasSDKContainer = null;
		this.iframeMessageHandler = null;
		this.messageTransport = null;
		IframeManager.iframeLoadTimeout = Math.min(IframeManager.iframeLoadTimeout * 2, IframeManager.maxIframeLoadTimeout);
	}
	async loadIframe() {
		var _IframeManager_sharedWaasSDKContainer;
		if ((_IframeManager_sharedWaasSDKContainer = IframeManager.sharedWaasSDKContainer) == null ? void 0 : _IframeManager_sharedWaasSDKContainer.isAlive()) {
			this.waasSDKContainer = IframeManager.sharedWaasSDKContainer;
			IframeManager.iframeInstanceCount++;
			return Promise.resolve();
		}
		if (IframeManager.iframeLoadPromise) return IframeManager.iframeLoadPromise.then(() => {
			this.waasSDKContainer = IframeManager.sharedWaasSDKContainer;
			IframeManager.iframeInstanceCount++;
		});
		if (IframeManager.sharedWaasSDKContainer) {
			IframeManager.sharedWaasSDKContainer.destroy();
			IframeManager.sharedWaasSDKContainer = null;
		}
		const loadPromise = IframeManager.iframeLoadPromise = this.createWaasSDKContainerLoadPromise();
		loadPromise.finally(() => {
			if (IframeManager.iframeLoadPromise === loadPromise) IframeManager.iframeLoadPromise = null;
		}).catch(() => {});
		return loadPromise;
	}
	createWaasSDKContainerLoadPromise() {
		return new Promise((resolve, reject) => {
			const attemptLoad = () => {
				IframeManager.iframeLoadAttempts++;
				this.logger.debug(`Loading iframe for waas wallet client... (attempt ${IframeManager.iframeLoadAttempts}/${IframeManager.maxRetryAttempts + 1})`, this.getIframeContext());
				const waasSDKContainer = this.createWaasSDKContainer();
				const context = _extends({}, this.getIframeContext(), { attempt: IframeManager.iframeLoadAttempts });
				const handleError = (error) => {
					clearTimeout(timeoutId);
					unsubscribeHandshake();
					unsubscribeError();
					waasSDKContainer.destroy();
					if (IframeManager.iframeLoadAttempts <= IframeManager.maxRetryAttempts) {
						const errorMsg = error instanceof Error ? error.message : String(error);
						this.logger.warn(`(loadIframe) Iframe failed to load on attempt ${IframeManager.iframeLoadAttempts}, retrying... context: ${JSON.stringify(context)}, error: ${errorMsg}`);
						setTimeout(attemptLoad, 1e3);
					} else {
						this.logger.error("Iframe failed to load after all retry attempts: ", error);
						this.resetSharedWaasSDKContainer();
						IframeManager.iframeLoadAttempts = 0;
						reject(/* @__PURE__ */ new Error(`Failed to load iframe after all retry attempts... context: ${JSON.stringify(context)}`));
					}
				};
				const timeoutId = setTimeout(() => {
					handleError("Iframe load timeout");
				}, IframeManager.iframeLoadTimeout);
				const unsubscribeError = waasSDKContainer.onError(handleError);
				const unsubscribeHandshake = waasSDKContainer.onMessage((data) => {
					if (data === `iframe-ready-${this.instanceId}`) {
						clearTimeout(timeoutId);
						unsubscribeHandshake();
						unsubscribeError();
						IframeManager.sharedWaasSDKContainer = waasSDKContainer;
						this.waasSDKContainer = waasSDKContainer;
						IframeManager.iframeInstanceCount++;
						IframeManager.iframeLoadAttempts = 0;
						resolve();
						this.logger.debug("Iframe loaded successfully...", this.getIframeContext());
					}
				});
				const url = this.buildIframeUrl();
				this.logger.debug("Creating iframe with src:", url);
				waasSDKContainer.setUrl(url).catch(handleError);
			};
			attemptLoad();
		});
	}
	getIframeContext() {
		var _this_sdkVersion;
		return {
			iframeDomain: this.iframeDomain,
			environmentId: this.environmentId,
			sdkVersion: (_this_sdkVersion = this.sdkVersion) != null ? _this_sdkVersion : "",
			instanceId: this.instanceId,
			chainName: this.chainName,
			iframeLoadTimeout: IframeManager.iframeLoadTimeout
		};
	}
	/**
	* Load an iframe for a specific container
	* @param {HTMLElement} container - The container to which the iframe will be attached
	* @returns {Promise<HTMLIFrameElement>} that resolves when the iframe is loaded
	*/ loadIframeForContainer(container) {
		return new Promise((resolve, reject) => {
			var _this_sdkVersion;
			const context = {
				iframeDomain: this.iframeDomain,
				environmentId: this.environmentId,
				sdkVersion: (_this_sdkVersion = this.sdkVersion) != null ? _this_sdkVersion : "",
				instanceId: this.instanceId,
				chainName: this.chainName,
				iframeLoadTimeout: IframeManager.iframeLoadTimeout
			};
			this.logger.debug(`Loading iframe for container...`, context);
			const iframe = document.createElement("iframe");
			let messageListener = null;
			const iframeTimeoutId = setTimeout(() => {
				if (messageListener) window.removeEventListener("message", messageListener);
				this.logger.error(`(loadIframeForContainer) Iframe load timeout due to no handshake message from iframe, this could be network issues, incorrect iframe domain, or CORS errors that prevents iframe from being loaded or sending handshake message, context: ${JSON.stringify(context)}`);
				reject(/* @__PURE__ */ new Error(`(loadIframeForContainer) Iframe load timeout due to no handshake message from iframe, this could be network issues, incorrect iframe domain, or CORS errors that prevents iframe from being loaded or sending handshake message, context: ${JSON.stringify(context)}`));
			}, IframeManager.iframeLoadTimeout);
			iframe.style.display = "block";
			iframe.style.width = "100%";
			iframe.style.height = "100%";
			iframe.setAttribute("title", "Dynamic Wallet Storage");
			iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");
			iframe.setAttribute("referrerpolicy", "origin");
			const params = this.buildIframeUrlSearchParams();
			iframe.src = `${this.iframeDomain}/waas-v1/${this.environmentId}?${params.toString()}`;
			this.logger.debug("Creating iframe with src:", iframe.src);
			container.appendChild(iframe);
			iframe.onload = () => {
				this.logger.debug("Iframe onload fired, waiting for ready message...");
			};
			iframe.onerror = (error) => {
				if (messageListener) window.removeEventListener("message", messageListener);
				clearTimeout(iframeTimeoutId);
				this.logger.error("Iframe failed to load due to errors: ", error);
				reject(/* @__PURE__ */ new Error("Failed to load iframe due to unknown load errors, this is likely a browser or network issue."));
			};
			messageListener = (event) => {
				if (event.source === iframe.contentWindow && event.data === `iframe-ready-${this.instanceId}`) {
					if (messageListener) window.removeEventListener("message", messageListener);
					clearTimeout(iframeTimeoutId);
					this.iframe = iframe;
					IframeManager.iframeInstanceCount++;
					resolve(iframe);
					var _this_sdkVersion;
					this.logger.debug("Iframe loaded successfully...", {
						iframeDomain: this.iframeDomain,
						environmentId: this.environmentId,
						sdkVersion: (_this_sdkVersion = this.sdkVersion) != null ? _this_sdkVersion : "",
						instanceId: this.instanceId,
						chainName: this.chainName
					});
				}
			};
			window.addEventListener("message", messageListener);
		});
	}
	/**
	* Initializes the iframe display for a specific container.
	*
	* @param {HTMLElement} container - The container to which the iframe will be attached.
	* @returns:
	*   iframe: HTMLIFrameElement;
	*   iframeDisplay: IframeDisplayChannelAdapter;
	*   cleanup: () => void;
	*/ async initializeIframeDisplayForContainer({ container }) {
		try {
			const iframe = await this.loadIframeForContainer(container);
			const transport = applyDefaultMessageOrigin({
				defaultOrigin: "host",
				messageTransport: createMessageTransport()
			});
			const cleanupBridge = setupMessageTransportBridge(transport, iframe, this.iframeDomain);
			const iframeDisplay = new iframeMessageHandler(transport);
			if (this.secureStorage || this.getSignedSessionIdCallback) this.setupIframeRequestHandlers(transport);
			var _this_authMode;
			await iframeDisplay.sendAuthToken(this.authToken, (_this_authMode = this.authMode) != null ? _this_authMode : AuthMode.HEADER);
			return {
				iframe,
				iframeDisplay,
				cleanup: () => {
					cleanupBridge();
					container.removeChild(iframe);
				}
			};
		} catch (error) {
			this.logger.error("Error initializing iframe:", error);
			throw error;
		}
	}
	async cleanup() {
		await this.initializeMessageTransport();
		if (!this.iframeMessageHandler) throw new Error("Iframe message handler not initialized");
		try {
			await this.iframeMessageHandler.cleanup();
		} catch (error) {
			this.logger.warn("(cleanup) iframeMessageHandler.cleanup() failed; proceeding with DOM teardown", { error: error instanceof Error ? error.message : error });
		}
		if (this.waasSDKContainer) {
			IframeManager.iframeInstanceCount--;
			this.cleanupBridge == null || this.cleanupBridge.call(this);
			this.cleanupBridge = null;
			this.cleanupRecoverySubscription == null || this.cleanupRecoverySubscription.call(this);
			this.cleanupRecoverySubscription = null;
			if (IframeManager.sharedWaasSDKContainer && IframeManager.iframeInstanceCount === 0) {
				IframeManager.sharedWaasSDKContainer.destroy();
				IframeManager.sharedWaasSDKContainer = null;
				IframeManager.iframeLoadPromise = null;
			}
			this.waasSDKContainer = null;
			this.messageTransport = null;
			this.iframeMessageHandler = null;
			this.iframeRequestChannel = void 0;
			this.unauthorizedHandled = false;
		}
	}
	constructor({ environmentId, baseApiUrl, baseMPCRelayApiUrl, chainName, sdkVersion, authMode = AuthMode.HEADER, authToken, debug, baseClientKeysharesRelayApiUrl, additionalTrustedOrigins, iframeLoadTimeout, maxRetryAttempts }, internalOptions) {
		this.logger = logger;
		this.instanceId = null;
		this.iframeDomain = null;
		this.messageTransport = null;
		this.iframeMessageHandler = null;
		/** Teardown function returned by setupMessageTransportBridge — detaches all
		* listeners. Tracked so we can rebuild the bridge on iframe recovery without
		* leaking listeners against the dead iframe. */ this.cleanupBridge = null;
		/** Unsubscribe for the onRecoveryRequested listener. Tracked so logout detaches
		* it — otherwise the request channel's retry timer keeps firing recovery against
		* a torn-down transport on the next session. */ this.cleanupRecoverySubscription = null;
		this.iframe = null;
		this.waasSDKContainer = null;
		/** One-shot guard so a burst of 401 notifications triggers a single logout. */ this.unauthorizedHandled = false;
		this.environmentId = environmentId;
		this.authToken = authToken;
		this.authMode = authMode;
		this.baseApiUrl = baseApiUrl;
		this.baseMPCRelayApiUrl = baseMPCRelayApiUrl;
		this.chainName = chainName;
		this.sdkVersion = sdkVersion;
		this.baseClientKeysharesRelayApiUrl = baseClientKeysharesRelayApiUrl;
		this.additionalTrustedOrigins = additionalTrustedOrigins ? [...additionalTrustedOrigins] : [];
		if (internalOptions == null ? void 0 : internalOptions.secureStorage) this.secureStorage = internalOptions.secureStorage;
		if (internalOptions == null ? void 0 : internalOptions.getSignedSessionId) this.getSignedSessionIdCallback = internalOptions.getSignedSessionId;
		var _internalOptions_createWaasSDKContainer;
		this.createWaasSDKContainer = (_internalOptions_createWaasSDKContainer = internalOptions == null ? void 0 : internalOptions.createWaasSDKContainer) != null ? _internalOptions_createWaasSDKContainer : createIframeWaasSDKContainer;
		this.onUnauthorized = internalOptions == null ? void 0 : internalOptions.onUnauthorized;
		const environment = getEnvironmentFromUrl(baseApiUrl);
		this.iframeDomain = IFRAME_DOMAIN_MAP[environment];
		if (this.authMode === AuthMode.COOKIE) this.iframeDomain = this.baseApiUrl;
		this.instanceId = crypto.randomUUID();
		this.debug = Boolean(debug);
		this.logger.setLogLevel(this.debug ? "DEBUG" : "INFO");
		IframeManager.applyLoadTuning({
			iframeLoadTimeout,
			maxRetryAttempts
		});
	}
};
IframeManager.iframeLoadPromise = null;
/**
* Initial timeout (ms) for the iframe to complete its boot handshake.
* On each failed attempt the active timeout doubles (capped at 60_000ms — see
* {@link resetSharedWaasSDKContainer}) before the next retry.
*
* Default chosen to comfortably cover the iframe's P95 cold-start at the
* time of writing (~13s for global traffic on a 3 MB MPC WASM payload).
* Override via the `iframeLoadTimeout` constructor option when the host
* environment needs a different budget (e.g. constrained mobile webviews).
*
* Held as a static (not instance) field because the shared
* `iframeLoadPromise` is itself static — all instances in a page must
* agree on the active timeout for the retry doubling logic to remain
* coherent.
*/ IframeManager.iframeLoadTimeout = 2e4;
IframeManager.iframeLoadAttempts = 0;
/**
* Number of retry attempts beyond the initial load attempt. The total
* number of attempts is `maxRetryAttempts + 1`. Override via the
* `maxRetryAttempts` constructor option.
*/ IframeManager.maxRetryAttempts = 1;
IframeManager.minIframeLoadTimeout = 1e3;
IframeManager.maxIframeLoadTimeout = 6e4;
IframeManager.maxAllowedRetryAttempts = 10;
IframeManager.sharedWaasSDKContainer = null;
IframeManager.iframeInstanceCount = 0;
IframeManager.maxAdditionalTrustedOrigins = 32;
IframeManager.maxTrustedOriginStringLength = 200;
var DynamicWalletClient = class extends IframeManager {
	async withHandler(operation) {
		await this.initializeMessageTransport();
		if (!this.iframeMessageHandler) throw new Error("Iframe message handler not initialized");
		return operation(this.iframeMessageHandler);
	}
	async getWallets() {
		return this.withHandler((handler) => handler.getWallets({ chainName: this.chainName }));
	}
	async getAllWallets() {
		return this.withHandler((handler) => handler.getAllWallets({ chainName: this.chainName }));
	}
	async getWallet({ accountAddress, walletOperation = WalletOperation.NO_OPERATION, signedSessionId, authToken }) {
		return this.withHandler((handler) => handler.getWallet({
			chainName: this.chainName,
			accountAddress,
			walletOperation,
			signedSessionId,
			authToken
		}));
	}
	async getWalletRecoveryState({ accountAddress, authToken, signedSessionId, password, traceContext }) {
		return this.withHandler((handler) => handler.getWalletRecoveryState({
			chainName: this.chainName,
			accountAddress,
			authToken,
			signedSessionId,
			password,
			traceContext
		}));
	}
	async unlockWallet({ accountAddress, password, signedSessionId, authToken, traceContext }) {
		return this.withHandler((handler) => handler.unlockWallet({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			traceContext
		}));
	}
	async createWalletAccount({ thresholdSignatureScheme, password = void 0, signedSessionId, authToken, traceContext, bitcoinConfig }) {
		return this.withHandler((handler) => handler.createWalletAccount({
			chainName: this.chainName,
			thresholdSignatureScheme,
			password,
			signedSessionId,
			authToken,
			traceContext,
			bitcoinConfig
		}));
	}
	async requiresPasswordForOperation({ accountAddress, walletOperation = WalletOperation.REACH_THRESHOLD, authToken }) {
		return this.withHandler((handler) => handler.requiresPasswordForOperation({
			chainName: this.chainName,
			accountAddress,
			walletOperation,
			authToken
		}));
	}
	async isPasswordEncrypted({ accountAddress, authToken }) {
		return this.withHandler((handler) => handler.isPasswordEncrypted({
			chainName: this.chainName,
			accountAddress,
			authToken
		}));
	}
	async signMessage({ message, accountAddress, password = void 0, signedSessionId, authToken, mfaToken, elevatedAccessToken, context, traceContext, bitcoinConfig }) {
		const contextString = JSON.stringify(context, (_key, value) => typeof value === "bigint" ? value.toString() : value);
		return this.withHandler((handler) => handler.signMessage({
			chainName: this.chainName,
			message,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			context: contextString,
			traceContext,
			bitcoinConfig
		}));
	}
	async signRawMessage({ message, accountAddress, password = void 0, signedSessionId, authToken, mfaToken, elevatedAccessToken, context, traceContext, bitcoinConfig }) {
		return this.withHandler((handler) => handler.signRawMessage({
			chainName: this.chainName,
			message,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			context,
			traceContext,
			bitcoinConfig
		}));
	}
	/**
	* Signs a transaction and returns the signature, @transaction is a string of the serialized transaction
	* EVM:
	*   transaction = serializeTransaction()
	* SOL:
	*   const messageBytes = transaction.serializeMessage();
	*   const messageToSign = Buffer.from(messageBytes).toString("hex");
	* SUI:
	*  const txBytes = await txb.build({ client });
	*  const txString = Buffer.from(txBytes).toString("hex");
	*/ async signTransaction({ senderAddress, transaction, password = void 0, signedSessionId, authToken, mfaToken, elevatedAccessToken, chainId, traceContext, bitcoinConfig }) {
		return this.withHandler((handler) => handler.signTransaction({
			chainName: this.chainName,
			senderAddress,
			transaction,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			chainId,
			traceContext,
			bitcoinConfig
		}));
	}
	async signTypedData({ accountAddress, typedData, password = void 0, signedSessionId, authToken, mfaToken, elevatedAccessToken, traceContext }) {
		return this.withHandler((handler) => handler.signTypedData({
			chainName: this.chainName,
			accountAddress,
			typedData: JSON.stringify(typedData),
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			traceContext
		}));
	}
	async backupKeySharesToGoogleDrive({ accountAddress, password = void 0, signedSessionId, authToken, googleDriveAccessToken, traceContext }) {
		return this.withHandler((handler) => handler.backupKeySharesToGoogleDrive({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			googleDriveAccessToken,
			traceContext
		}));
	}
	async backupKeySharesToICloud({ accountAddress, password = void 0, signedSessionId, authToken, traceContext }) {
		return this.withHandler((handler) => handler.backupKeySharesToICloud({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			traceContext
		}));
	}
	async displayICloudSignIn({ displayContainer }) {
		const { iframeDisplay } = await this.initializeIframeDisplayForContainer({ container: displayContainer });
		if (!iframeDisplay) throw new Error("Failed to initialize iframe handler with display functionality");
		return iframeDisplay.displayICloudSignIn(this.chainName);
	}
	async hideICloudSignIn() {
		return this.withHandler((handler) => handler.hideICloudSignIn());
	}
	async isICloudAuthenticated() {
		return this.withHandler((handler) => handler.isICloudAuthenticated(this.chainName));
	}
	async delegateKeyShares({ accountAddress, password, signedSessionId, authToken, mfaToken, traceContext }) {
		return this.withHandler((handler) => handler.delegateKeyShares({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			traceContext
		}));
	}
	async revokeDelegation({ accountAddress, password, signedSessionId, authToken, mfaToken, traceContext }) {
		return this.withHandler((handler) => handler.revokeDelegation({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			traceContext
		}));
	}
	async exportClientKeysharesFromGoogleDrive({ accountAddress, password, signedSessionId, authToken, googleDriveAccessToken, traceContext }) {
		return this.withHandler((handler) => handler.exportClientKeysharesFromGoogleDrive({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			googleDriveAccessToken,
			traceContext
		}));
	}
	async refreshWalletAccountShares({ accountAddress, password, signedSessionId, authToken, mfaToken, elevatedAccessToken, traceContext }) {
		return this.withHandler((handler) => handler.refreshWalletAccountShares({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			traceContext
		}));
	}
	async reshare({ accountAddress, oldThresholdSignatureScheme, newThresholdSignatureScheme, password, signedSessionId, authToken, mfaToken, elevatedAccessToken, traceContext }) {
		return this.withHandler((handler) => handler.reshare({
			chainName: this.chainName,
			accountAddress,
			oldThresholdSignatureScheme,
			newThresholdSignatureScheme,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			traceContext
		}));
	}
	async exportPrivateKey({ accountAddress, elevatedAccessToken, displayContainer, password, signedSessionId, authToken, mfaToken, traceContext, bitcoinConfig }) {
		const { iframeDisplay } = await this.initializeIframeDisplayForContainer({ container: displayContainer });
		if (!iframeDisplay) throw new Error("Failed to initialize iframe handler with display functionality");
		return iframeDisplay.exportPrivateKey({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			traceContext,
			bitcoinConfig
		});
	}
	/**
	* Aleo full transaction: view key → MPC sign → prove + broadcast via DPS.
	* Forwards to the iframe's DynamicAleoWalletClient.proveTransaction. View
	* key stays in the iframe throughout.
	*/ async proveTransaction({ accountAddress, programId, functionName, inputs, inputTypes, broadcast, password, signedSessionId, authToken, mfaToken, elevatedAccessToken, chainId, traceContext }) {
		return this.withHandler((handler) => handler.proveAleoTransaction({
			chainName: "ALEO",
			accountAddress,
			programId,
			functionName,
			inputs,
			inputTypes,
			broadcast,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			chainId,
			traceContext
		}));
	}
	/**
	* List all Aleo records owned by the wallet via Provable's RecordScanner —
	* across every Aleo program (credits.aleo, custom tokens, etc.). Each record
	* carries `program_name` + `record_name` so callers can classify by token.
	* View key stays in the iframe — the scanner runs inside the iframe's
	* DynamicAleoWalletClient.
	*/ async findOwnedRecords({ accountAddress, password, signedSessionId, authToken, mfaToken, elevatedAccessToken, chainId, traceContext }) {
		return this.withHandler((handler) => handler.findAleoOwnedRecords({
			chainName: "ALEO",
			accountAddress,
			password,
			signedSessionId,
			authToken,
			mfaToken,
			elevatedAccessToken,
			chainId,
			traceContext
		}));
	}
	/**
	* Coverage check against ANF's Feemaster policy for any Aleo
	* (programId, functionName) pair on the given network. Used by the widget
	* to decide whether a user-paid confirmation modal is needed before a
	* shield/send/join. Goes through the iframe so the same `apiClient` /
	* baseApiUrl / auth pipeline as every other call applies. Never throws —
	* returns `false` on any policy fetch failure.
	*/ async isAleoFeemasterCovered({ programId, functionName, chainId, traceContext }) {
		return this.withHandler((handler) => handler.isAleoFeemasterCovered({
			chainName: "ALEO",
			programId,
			functionName,
			chainId,
			traceContext
		}));
	}
	async verifyPassword({ accountAddress, password, walletOperation = WalletOperation.NO_OPERATION, signedSessionId, authToken, traceContext }) {
		return this.withHandler((handler) => handler.verifyPassword({
			chainName: this.chainName,
			accountAddress,
			password,
			walletOperation,
			signedSessionId,
			authToken,
			traceContext
		}));
	}
	async updatePassword({ accountAddress, existingPassword, newPassword, signedSessionId, authToken, passwordUpdateBatchId, traceContext }) {
		return this.withHandler((handler) => handler.updatePassword({
			chainName: this.chainName,
			accountAddress,
			existingPassword,
			newPassword,
			signedSessionId,
			authToken,
			passwordUpdateBatchId,
			traceContext
		}));
	}
	async setPassword({ accountAddress, newPassword, signedSessionId, authToken, passwordUpdateBatchId, traceContext }) {
		return this.withHandler((handler) => handler.setPassword({
			chainName: this.chainName,
			accountAddress,
			newPassword,
			signedSessionId,
			authToken,
			passwordUpdateBatchId,
			traceContext
		}));
	}
	async importPrivateKey({ privateKey, thresholdSignatureScheme, password, signedSessionId, authToken, publicAddressCheck, addressType, traceContext, legacyWalletId }) {
		return this.withHandler((handler) => handler.importPrivateKey({
			chainName: this.chainName,
			privateKey,
			thresholdSignatureScheme,
			password,
			signedSessionId,
			authToken,
			publicAddressCheck,
			addressType,
			traceContext,
			legacyWalletId
		}));
	}
	async exportClientKeyshares({ accountAddress, password, signedSessionId, authToken, traceContext }) {
		return this.withHandler((handler) => handler.exportClientKeyshares({
			chainName: this.chainName,
			accountAddress,
			password,
			signedSessionId,
			authToken,
			traceContext
		}));
	}
	/**
	* keyShares is stringified list of EcdsaKeygenResult[] and Ed25519KeygenResult[]
	*/ async offlineExportPrivateKey({ keyShares, derivationPath, traceContext }) {
		const args = {
			chainName: this.chainName,
			keyShares,
			derivationPath
		};
		const serializedArgs = JSON.stringify(args);
		const argsBuffer = new TextEncoder().encode(serializedArgs);
		const base64Args = Buffer.from(argsBuffer).toString("base64");
		return this.withHandler((handler) => handler.offlineExportPrivateKey({
			chainName: this.chainName,
			base64Args,
			traceContext
		}));
	}
	constructor({ environmentId, authToken, baseApiUrl, baseMPCRelayApiUrl, baseClientKeysharesRelayApiUrl, chainName, sdkVersion, debug, authMode = AuthMode.HEADER, additionalTrustedOrigins, iframeLoadTimeout, maxRetryAttempts }, internalOptions) {
		super({
			environmentId,
			authToken,
			baseApiUrl,
			baseMPCRelayApiUrl,
			baseClientKeysharesRelayApiUrl,
			chainName,
			sdkVersion,
			debug,
			authMode,
			additionalTrustedOrigins,
			iframeLoadTimeout,
			maxRetryAttempts
		}, internalOptions);
	}
};
//#endregion
export { DynamicWalletClient as t };
