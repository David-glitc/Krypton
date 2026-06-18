import { r as __exportAll } from "../_runtime.mjs";
//#region ../../node_modules/.pnpm/ably@2.17.1_bufferutil@4.1.0_react-dom@19.2.7_react@19.2.7__react@19.2.7_utf-8-validate@6.0.6/node_modules/ably/build/modular/index.mjs
var modular_exports = /* @__PURE__ */ __exportAll({
	BaseRealtime: () => baserealtime_default,
	ErrorInfo: () => ErrorInfo,
	FetchRequest: () => fetchRequest,
	WebSocketTransport: () => websockettransport_default
});
/*@license Copyright 2015-2022 Ably Real-time Ltd (ably.com)

Ably JavaScript Library v2.17.1
https://github.com/ably/ably-js

Released under the Apache Licence v2.0*/
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __spreadValues = (a, b) => {
	for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
	if (__getOwnPropSymbols) {
		for (var prop of __getOwnPropSymbols(b)) if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
	}
	return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
	var target = {};
	for (var prop in source) if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
	if (source != null && __getOwnPropSymbols) {
		for (var prop of __getOwnPropSymbols(source)) if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
	}
	return target;
};
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};
var __await = function(promise, isYieldStar) {
	this[0] = promise;
	this[1] = isYieldStar;
};
var __asyncGenerator = (__this, __arguments, generator) => {
	var resume = (k, v, yes, no) => {
		try {
			var x = generator[k](v), isAwait = (v = x.value) instanceof __await, done = x.done;
			Promise.resolve(isAwait ? v[0] : v).then((y) => isAwait ? resume(k === "return" ? k : "next", v[1] ? {
				done: y.done,
				value: y.value
			} : y, yes, no) : yes({
				value: y,
				done
			})).catch((e) => resume("throw", e, yes, no));
		} catch (e) {
			no(e);
		}
	};
	var method = (k) => it[k] = (x) => new Promise((yes, no) => resume(k, x, yes, no));
	var it = {};
	return generator = generator.apply(__this, __arguments), it[Symbol.asyncIterator] = () => it, method("next"), method("throw"), method("return"), it;
};
var Platform = class {};
var globalObject = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : self;
function pad(timeSegment, three) {
	return `${timeSegment}`.padStart(three ? 3 : 2, "0");
}
function getHandler(logger) {
	return Platform.Config.logTimestamps ? function(msg) {
		const time = /* @__PURE__ */ new Date();
		logger(pad(time.getHours()) + ":" + pad(time.getMinutes()) + ":" + pad(time.getSeconds()) + "." + pad(time.getMilliseconds(), 1) + " " + msg);
	} : function(msg) {
		logger(msg);
	};
}
var getDefaultLoggers = () => {
	var _a2;
	let consoleLogger;
	let errorLogger;
	if (typeof ((_a2 = globalObject == null ? void 0 : globalObject.console) == null ? void 0 : _a2.log) === "function") {
		consoleLogger = function(...args) {
			console.log.apply(console, args);
		};
		errorLogger = console.warn ? function(...args) {
			console.warn.apply(console, args);
		} : consoleLogger;
	} else consoleLogger = errorLogger = function() {};
	return [consoleLogger, errorLogger].map(getHandler);
};
var _Logger = class _Logger {
	constructor() {
		this.deprecated = (description, msg) => {
			this.deprecationWarning(`${description} is deprecated and will be removed in a future version. ${msg}`);
		};
		this.shouldLog = (level) => {
			return level <= this.logLevel;
		};
		this.setLog = (level, handler) => {
			if (level !== void 0) this.logLevel = level;
			if (handler !== void 0) this.logHandler = this.logErrorHandler = handler;
		};
		this.logLevel = _Logger.defaultLogLevel;
		this.logHandler = _Logger.defaultLogHandler;
		this.logErrorHandler = _Logger.defaultLogErrorHandler;
	}
	static initLogHandlers() {
		const [logHandler, logErrorHandler] = getDefaultLoggers();
		this.defaultLogHandler = logHandler;
		this.defaultLogErrorHandler = logErrorHandler;
		this.defaultLogger = new _Logger();
	}
	/**
	* Calls to this method are never stripped by the `stripLogs` esbuild plugin. Use it for log statements that you wish to always be included in the modular variant of the SDK.
	*/
	static logActionNoStrip(logger, level, action, message) {
		logger.logAction(level, action, message);
	}
	logAction(level, action, message) {
		if (this.shouldLog(level)) (level === 1 ? this.logErrorHandler : this.logHandler)("Ably: " + action + ": " + message, level);
	}
	renamedClientOption(oldName, newName) {
		this.deprecationWarning(`The \`${oldName}\` client option has been renamed to \`${newName}\`. Please update your code to use \`${newName}\` instead. \`${oldName}\` will be removed in a future version.`);
	}
	renamedMethod(className, oldName, newName) {
		this.deprecationWarning(`\`${className}\`\u2019s \`${oldName}\` method has been renamed to \`${newName}\`. Please update your code to use \`${newName}\` instead. \`${oldName}\` will be removed in a future version.`);
	}
	deprecationWarning(message) {
		if (this.shouldLog(1)) this.logErrorHandler(`Ably: Deprecation warning - ${message}`, 1);
	}
};
_Logger.defaultLogLevel = 1;
_Logger.LOG_NONE = 0;
_Logger.LOG_ERROR = 1;
_Logger.LOG_MAJOR = 2;
_Logger.LOG_MINOR = 3;
_Logger.LOG_MICRO = 4;
/**
* In the modular variant of the SDK, the `stripLogs` esbuild plugin strips out all calls to this method (when invoked as `Logger.logAction(...)`) except when called with level `Logger.LOG_ERROR`. If you wish for a log statement to never be stripped, use the {@link logActionNoStrip} method instead.
*
* The aforementioned plugin expects `level` to be an expression of the form `Logger.LOG_*`; that is, you can’t dynamically specify the log level.
*/
_Logger.logAction = (logger, level, action, message) => {
	_Logger.logActionNoStrip(logger, level, action, message);
};
var logger_default = _Logger;
var utils_exports = {};
__export(utils_exports, {
	Format: () => Format,
	allSame: () => allSame,
	allToLowerCase: () => allToLowerCase,
	allToUpperCase: () => allToUpperCase,
	arrChooseN: () => arrChooseN,
	arrDeleteValue: () => arrDeleteValue,
	arrEquals: () => arrEquals,
	arrIntersect: () => arrIntersect,
	arrIntersectOb: () => arrIntersectOb,
	arrPopRandomElement: () => arrPopRandomElement,
	arrWithoutValue: () => arrWithoutValue,
	cheapRandStr: () => cheapRandStr,
	containsValue: () => containsValue,
	copy: () => copy,
	createMissingPluginError: () => createMissingPluginError,
	dataSizeBytes: () => dataSizeBytes,
	decodeBody: () => decodeBody,
	encodeBody: () => encodeBody,
	ensureArray: () => ensureArray,
	forInOwnNonNullProperties: () => forInOwnNonNullProperties,
	getBackoffCoefficient: () => getBackoffCoefficient,
	getGlobalObject: () => getGlobalObject,
	getJitterCoefficient: () => getJitterCoefficient,
	getRetryTime: () => getRetryTime,
	inherits: () => inherits,
	inspectBody: () => inspectBody,
	inspectError: () => inspectError,
	intersect: () => intersect,
	isEmpty: () => isEmpty,
	isErrorInfoOrPartialErrorInfo: () => isErrorInfoOrPartialErrorInfo,
	isNil: () => isNil,
	isObject: () => isObject,
	keysArray: () => keysArray,
	listenerToAsyncIterator: () => listenerToAsyncIterator,
	matchDerivedChannel: () => matchDerivedChannel,
	mixin: () => mixin,
	parseQueryString: () => parseQueryString,
	prototypicalClone: () => prototypicalClone,
	randomString: () => randomString,
	shallowClone: () => shallowClone,
	shallowEquals: () => shallowEquals,
	stringifyValues: () => stringifyValues,
	throwMissingPluginError: () => throwMissingPluginError,
	toBase64: () => toBase64,
	toQueryString: () => toQueryString,
	valuesArray: () => valuesArray,
	whenPromiseSettles: () => whenPromiseSettles,
	withTimeoutAsync: () => withTimeoutAsync
});
function toString(err) {
	let result = "[" + err.constructor.name;
	if (err.message) result += ": " + err.message;
	if (err.statusCode) result += "; statusCode=" + err.statusCode;
	if (err.code) result += "; code=" + err.code;
	if (err.cause) result += "; cause=" + inspectError(err.cause);
	if (err.href && !(err.message && err.message.indexOf("help.ably.io") > -1)) result += "; see " + err.href + " ";
	result += "]";
	return result;
}
var ErrorInfo = class _ErrorInfo extends Error {
	constructor(message, code, statusCode, cause) {
		super(message);
		if (typeof Object.setPrototypeOf !== "undefined") Object.setPrototypeOf(this, _ErrorInfo.prototype);
		this.code = code;
		this.statusCode = statusCode;
		this.cause = cause;
	}
	toString() {
		return toString(this);
	}
	static fromValues(values) {
		const { message, code, statusCode } = values;
		if (typeof message !== "string" || typeof code !== "number" || typeof statusCode !== "number") throw new Error("ErrorInfo.fromValues(): invalid values: " + Platform.Config.inspect(values));
		const result = Object.assign(new _ErrorInfo(message, code, statusCode), values);
		if (result.code && !result.href) result.href = "https://help.ably.io/error/" + result.code;
		return result;
	}
};
var PartialErrorInfo = class _PartialErrorInfo extends Error {
	constructor(message, code, statusCode, cause) {
		super(message);
		if (typeof Object.setPrototypeOf !== "undefined") Object.setPrototypeOf(this, _PartialErrorInfo.prototype);
		this.code = code;
		this.statusCode = statusCode;
		this.cause = cause;
	}
	toString() {
		return toString(this);
	}
	static fromValues(values) {
		const { message, code, statusCode } = values;
		if (typeof message !== "string" || !isNil(code) && typeof code !== "number" || !isNil(statusCode) && typeof statusCode !== "number") throw new Error("PartialErrorInfo.fromValues(): invalid values: " + Platform.Config.inspect(values));
		const result = Object.assign(new _PartialErrorInfo(message, code, statusCode), values);
		if (result.code && !result.href) result.href = "https://help.ably.io/error/" + result.code;
		return result;
	}
};
function randomPosn(arrOrStr) {
	return Math.floor(Math.random() * arrOrStr.length);
}
function mixin(target, ...args) {
	for (let i = 0; i < args.length; i++) {
		const source = args[i];
		if (!source) break;
		for (const key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
	}
	return target;
}
function copy(src) {
	return mixin({}, src);
}
function ensureArray(obj) {
	if (isNil(obj)) return [];
	if (Array.isArray(obj)) return obj;
	return [obj];
}
function isObject(ob) {
	return Object.prototype.toString.call(ob) == "[object Object]";
}
function isEmpty(ob) {
	for (const prop in ob) return false;
	return true;
}
function isNil(arg) {
	return arg == null;
}
function shallowClone(ob) {
	const result = /* @__PURE__ */ new Object();
	for (const prop in ob) result[prop] = ob[prop];
	return result;
}
function prototypicalClone(ob, ownProperties) {
	class F {}
	F.prototype = ob;
	const result = new F();
	if (ownProperties) mixin(result, ownProperties);
	return result;
}
var inherits = function(ctor, superCtor) {
	if (Platform.Config.inherits) {
		Platform.Config.inherits(ctor, superCtor);
		return;
	}
	ctor.super_ = superCtor;
	ctor.prototype = prototypicalClone(superCtor.prototype, { constructor: ctor });
};
function containsValue(ob, val) {
	for (const i in ob) if (ob[i] == val) return true;
	return false;
}
function intersect(arr, ob) {
	return Array.isArray(ob) ? arrIntersect(arr, ob) : arrIntersectOb(arr, ob);
}
function arrIntersect(arr1, arr2) {
	const result = [];
	for (let i = 0; i < arr1.length; i++) {
		const member = arr1[i];
		if (arr2.indexOf(member) != -1) result.push(member);
	}
	return result;
}
function arrIntersectOb(arr, ob) {
	const result = [];
	for (let i = 0; i < arr.length; i++) {
		const member = arr[i];
		if (member in ob) result.push(member);
	}
	return result;
}
function arrDeleteValue(arr, val) {
	const idx = arr.indexOf(val);
	const res = idx != -1;
	if (res) arr.splice(idx, 1);
	return res;
}
function arrWithoutValue(arr, val) {
	const newArr = arr.slice();
	arrDeleteValue(newArr, val);
	return newArr;
}
function keysArray(ob, ownOnly) {
	const result = [];
	for (const prop in ob) {
		if (ownOnly && !Object.prototype.hasOwnProperty.call(ob, prop)) continue;
		result.push(prop);
	}
	return result;
}
function valuesArray(ob, ownOnly) {
	const result = [];
	for (const prop in ob) {
		if (ownOnly && !Object.prototype.hasOwnProperty.call(ob, prop)) continue;
		result.push(ob[prop]);
	}
	return result;
}
function forInOwnNonNullProperties(ob, fn) {
	for (const prop in ob) if (Object.prototype.hasOwnProperty.call(ob, prop) && ob[prop]) fn(prop);
}
function allSame(arr, prop) {
	if (arr.length === 0) return true;
	const first = arr[0][prop];
	return arr.every(function(item) {
		return item[prop] === first;
	});
}
var Format = /* @__PURE__ */ ((Format2) => {
	Format2["msgpack"] = "msgpack";
	Format2["json"] = "json";
	return Format2;
})(Format || {});
function arrPopRandomElement(arr) {
	return arr.splice(randomPosn(arr), 1)[0];
}
function toQueryString(params) {
	const parts = [];
	if (params) for (const key in params) parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
	return parts.length ? "?" + parts.join("&") : "";
}
function stringifyValues(params) {
	return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]));
}
function parseQueryString(query) {
	let match;
	const search = /([^?&=]+)=?([^&]*)/g;
	const result = {};
	while (match = search.exec(query)) result[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
	return result;
}
function isErrorInfoOrPartialErrorInfo(err) {
	return typeof err == "object" && err !== null && (err instanceof ErrorInfo || err instanceof PartialErrorInfo);
}
function inspectError(err) {
	var _a2, _b;
	if (err instanceof Error || ((_a2 = err == null ? void 0 : err.constructor) == null ? void 0 : _a2.name) === "ErrorInfo" || ((_b = err == null ? void 0 : err.constructor) == null ? void 0 : _b.name) === "PartialErrorInfo") return err.toString();
	return Platform.Config.inspect(err);
}
function inspectBody(body) {
	if (Platform.BufferUtils.isBuffer(body)) return body.toString();
	else if (typeof body === "string") return body;
	else return Platform.Config.inspect(body);
}
function dataSizeBytes(data) {
	if (Platform.BufferUtils.isBuffer(data)) return Platform.BufferUtils.byteLength(data);
	if (typeof data === "string") return Platform.Config.stringByteSize(data);
	if (typeof data === "number") return 8;
	if (typeof data === "boolean") return 1;
	throw new Error(`Expected input of Utils.dataSizeBytes to be a string, a number, a boolean or a buffer, but was: ${typeof data}`);
}
function cheapRandStr() {
	return String(Math.random()).substr(2);
}
var randomString = async (numBytes) => {
	const buffer = await Platform.Config.getRandomArrayBuffer(numBytes);
	return Platform.BufferUtils.base64Encode(buffer);
};
function arrChooseN(arr, n2) {
	const numItems = Math.min(n2, arr.length), mutableArr = arr.slice(), result = [];
	for (let i = 0; i < numItems; i++) result.push(arrPopRandomElement(mutableArr));
	return result;
}
function whenPromiseSettles(promise, callback) {
	promise.then((result) => {
		callback?.(null, result);
	}).catch((err) => {
		callback?.(err);
	});
}
function decodeBody(body, MsgPack, format) {
	if (format == "msgpack") {
		if (!MsgPack) throwMissingPluginError("MsgPack");
		return MsgPack.decode(body);
	}
	return JSON.parse(String(body));
}
function encodeBody(body, MsgPack, format) {
	if (format == "msgpack") {
		if (!MsgPack) throwMissingPluginError("MsgPack");
		return MsgPack.encode(body, true);
	}
	return JSON.stringify(body);
}
function allToLowerCase(arr) {
	return arr.map(function(element) {
		return element && element.toLowerCase();
	});
}
function allToUpperCase(arr) {
	return arr.map(function(element) {
		return element && element.toUpperCase();
	});
}
function getBackoffCoefficient(count) {
	return Math.min((count + 2) / 3, 2);
}
function getJitterCoefficient() {
	return 1 - Math.random() * .2;
}
function getRetryTime(initialTimeout, retryAttempt) {
	return initialTimeout * getBackoffCoefficient(retryAttempt) * getJitterCoefficient();
}
function getGlobalObject() {
	if (typeof global !== "undefined") return global;
	if (typeof window !== "undefined") return window;
	return self;
}
function shallowEquals(source, target) {
	return Object.keys(source).every((key) => source[key] === target[key]) && Object.keys(target).every((key) => target[key] === source[key]);
}
function matchDerivedChannel(name) {
	const match = name.match(/^(\[([^?]*)(?:(.*))\])?(.+)$/);
	if (!match || !match.length || match.length < 5) throw new ErrorInfo("regex match failed", 400, 40010);
	if (match[2]) throw new ErrorInfo(`cannot use a derived option with a ${match[2]} channel`, 400, 40010);
	return {
		qualifierParam: match[3] || "",
		channelName: match[4]
	};
}
function toBase64(str) {
	const bufferUtils = Platform.BufferUtils;
	const textBuffer = bufferUtils.utf8Encode(str);
	return bufferUtils.base64Encode(textBuffer);
}
function arrEquals(a, b) {
	return a.length === b.length && a.every(function(val, i) {
		return val === b[i];
	});
}
function createMissingPluginError(pluginName) {
	return new ErrorInfo(`${pluginName} plugin not provided`, 40019, 400);
}
function throwMissingPluginError(pluginName) {
	throw createMissingPluginError(pluginName);
}
async function withTimeoutAsync(promise, timeout = 5e3, err = "Timeout expired") {
	const e = new ErrorInfo(err, 5e4, 500);
	return Promise.race([promise, new Promise((_resolve, reject) => setTimeout(() => reject(e), timeout))]);
}
function listenerToAsyncIterator(registerListener) {
	return __asyncGenerator(this, null, function* () {
		const eventQueue = [];
		let resolveNext = null;
		const removeListener2 = registerListener((event) => {
			if (resolveNext) {
				const resolve = resolveNext;
				resolveNext = null;
				resolve(event);
			} else eventQueue.push(event);
		});
		try {
			while (true) if (eventQueue.length > 0) yield eventQueue.shift();
			else {
				if (resolveNext) throw new ErrorInfo("Concurrent next() calls are not supported", 4e4, 400);
				yield yield new __await(new Promise((resolve) => {
					resolveNext = resolve;
				}));
			}
		} finally {
			removeListener2();
		}
	});
}
var version = "2.17.1";
var Defaults = {
	ENDPOINT: "main",
	ENVIRONMENT: "",
	REST_HOST: "rest.ably.io",
	REALTIME_HOST: "realtime.ably.io",
	FALLBACK_HOSTS: [
		"main.a.fallback.ably-realtime.com",
		"main.b.fallback.ably-realtime.com",
		"main.c.fallback.ably-realtime.com",
		"main.d.fallback.ably-realtime.com",
		"main.e.fallback.ably-realtime.com"
	],
	PORT: 80,
	TLS_PORT: 443,
	TIMEOUTS: {
		disconnectedRetryTimeout: 15e3,
		suspendedRetryTimeout: 3e4,
		httpRequestTimeout: 1e4,
		httpMaxRetryDuration: 15e3,
		channelRetryTimeout: 15e3,
		fallbackRetryTimeout: 6e5,
		connectionStateTtl: 12e4,
		realtimeRequestTimeout: 1e4,
		recvTimeout: 9e4,
		webSocketConnectTimeout: 1e4,
		webSocketSlowTimeout: 4e3
	},
	httpMaxRetryCount: 3,
	maxMessageSize: 65536,
	version,
	protocolVersion: 5,
	agent: "ably-js/" + version,
	getPort,
	getHttpScheme,
	getPrimaryDomainFromEndpoint,
	getEndpointFallbackHosts,
	getFallbackHosts,
	getHosts,
	checkHost,
	objectifyOptions,
	normaliseOptions,
	defaultGetHeaders,
	defaultPostHeaders
};
function getPort(options, tls) {
	return tls || options.tls ? options.tlsPort : options.port;
}
function getHttpScheme(options) {
	return options.tls ? "https://" : "http://";
}
function isFqdnIpOrLocalhost(endpoint) {
	return endpoint.includes(".") || endpoint.includes("::") || endpoint === "localhost";
}
function getPrimaryDomainFromEndpoint(endpoint) {
	if (isFqdnIpOrLocalhost(endpoint)) return endpoint;
	if (endpoint.startsWith("nonprod:")) return `${endpoint.replace("nonprod:", "")}.realtime.ably-nonprod.net`;
	return `${endpoint}.realtime.ably.net`;
}
function getEndpointFallbackHosts(endpoint) {
	if (isFqdnIpOrLocalhost(endpoint)) return [];
	if (endpoint.startsWith("nonprod:")) return endpointFallbacks(endpoint.replace("nonprod:", ""), "ably-realtime-nonprod.com");
	return endpointFallbacks(endpoint, "ably-realtime.com");
}
function endpointFallbacks(routingPolicyId, domain) {
	return [
		"a",
		"b",
		"c",
		"d",
		"e"
	].map((id) => `${routingPolicyId}.${id}.fallback.${domain}`);
}
function getFallbackHosts(options) {
	const fallbackHosts = options.fallbackHosts, httpMaxRetryCount = typeof options.httpMaxRetryCount !== "undefined" ? options.httpMaxRetryCount : Defaults.httpMaxRetryCount;
	return fallbackHosts ? arrChooseN(fallbackHosts, httpMaxRetryCount) : [];
}
function getHosts(options) {
	return [options.primaryDomain].concat(getFallbackHosts(options));
}
function checkHost(host) {
	if (typeof host !== "string") throw new ErrorInfo("host must be a string; was a " + typeof host, 4e4, 400);
	if (!host.length) throw new ErrorInfo("host must not be zero-length", 4e4, 400);
}
function getTimeouts(options) {
	const timeouts = {};
	for (const prop in Defaults.TIMEOUTS) timeouts[prop] = options[prop] || Defaults.TIMEOUTS[prop];
	return timeouts;
}
function getAgentString(options) {
	let agentStr = Defaults.agent;
	if (options.agents) for (var agent2 in options.agents) agentStr += " " + agent2 + "/" + options.agents[agent2];
	return agentStr;
}
function objectifyOptions(options, allowKeyOrToken, sourceForErrorMessage, logger, modularPluginsToInclude) {
	if (options === void 0) {
		const msg = allowKeyOrToken ? `${sourceForErrorMessage} must be initialized with either a client options object, an Ably API key, or an Ably Token` : `${sourceForErrorMessage} must be initialized with a client options object`;
		logger_default.logAction(logger, logger_default.LOG_ERROR, `${sourceForErrorMessage}()`, msg);
		throw new Error(msg);
	}
	let optionsObj;
	if (typeof options === "string") if (options.indexOf(":") == -1) {
		if (!allowKeyOrToken) {
			const msg = `${sourceForErrorMessage} cannot be initialized with just an Ably Token; you must provide a client options object with a \`plugins\` property. (Set this Ably Token as the object\u2019s \`token\` property.)`;
			logger_default.logAction(logger, logger_default.LOG_ERROR, `${sourceForErrorMessage}()`, msg);
			throw new Error(msg);
		}
		optionsObj = { token: options };
	} else {
		if (!allowKeyOrToken) {
			const msg = `${sourceForErrorMessage} cannot be initialized with just an Ably API key; you must provide a client options object with a \`plugins\` property. (Set this Ably API key as the object\u2019s \`key\` property.)`;
			logger_default.logAction(logger, logger_default.LOG_ERROR, `${sourceForErrorMessage}()`, msg);
			throw new Error(msg);
		}
		optionsObj = { key: options };
	}
	else optionsObj = options;
	if (modularPluginsToInclude) optionsObj = __spreadProps(__spreadValues({}, optionsObj), { plugins: __spreadValues(__spreadValues({}, modularPluginsToInclude), optionsObj.plugins) });
	return optionsObj;
}
function checkIfClientOptionsAreValid(options) {
	if (options.endpoint && (options.environment || options.restHost || options.realtimeHost)) throw new ErrorInfo("The `endpoint` option cannot be used in conjunction with the `environment`, `restHost`, or `realtimeHost` options.", 40106, 400);
	if (options.environment && (options.restHost || options.realtimeHost)) throw new ErrorInfo("The `environment` option cannot be used in conjunction with the `restHost`, or `realtimeHost` options.", 40106, 400);
}
function normaliseOptions(options, MsgPack, logger) {
	const loggerToUse = logger != null ? logger : logger_default.defaultLogger;
	if (options.environment) loggerToUse.deprecated("The `environment` client option", "Use the `endpoint` client option instead.");
	if (options.restHost) loggerToUse.deprecated("The `restHost` client option", "Use the `endpoint` client option instead.");
	if (options.realtimeHost) loggerToUse.deprecated("The `realtimeHost` client option", "Use the `endpoint` client option instead.");
	checkIfClientOptionsAreValid(options);
	if (typeof options.recover === "function" && options.closeOnUnload === true) {
		logger_default.logAction(loggerToUse, logger_default.LOG_ERROR, "Defaults.normaliseOptions", "closeOnUnload was true and a session recovery function was set - these are mutually exclusive, so unsetting the latter");
		options.recover = void 0;
	}
	if (!("closeOnUnload" in options)) options.closeOnUnload = !options.recover;
	if (!("queueMessages" in options)) options.queueMessages = true;
	const endpoint = options.endpoint || Defaults.ENDPOINT;
	if (!options.fallbackHosts && !options.restHost && !options.realtimeHost && !options.port && !options.tlsPort) options.fallbackHosts = getEndpointFallbackHosts(options.environment || endpoint);
	const primaryDomainFromEnvironment = options.environment && `${options.environment}.realtime.ably.net`;
	const primaryDomain = options.restHost || options.realtimeHost || primaryDomainFromEnvironment || getPrimaryDomainFromEndpoint(endpoint);
	(options.fallbackHosts || []).concat(primaryDomain).forEach(checkHost);
	options.port = options.port || Defaults.PORT;
	options.tlsPort = options.tlsPort || Defaults.TLS_PORT;
	if (!("tls" in options)) options.tls = true;
	const timeouts = getTimeouts(options);
	if (MsgPack) if ("useBinaryProtocol" in options) options.useBinaryProtocol = Platform.Config.supportsBinary && options.useBinaryProtocol;
	else options.useBinaryProtocol = Platform.Config.preferBinary;
	else options.useBinaryProtocol = false;
	const headers = {};
	if (options.clientId) headers["X-Ably-ClientId"] = Platform.BufferUtils.base64Encode(Platform.BufferUtils.utf8Encode(options.clientId));
	if (!("idempotentRestPublishing" in options)) options.idempotentRestPublishing = true;
	let connectivityCheckParams = null;
	let connectivityCheckUrl = options.connectivityCheckUrl;
	if (options.connectivityCheckUrl) {
		let [uri, qs] = options.connectivityCheckUrl.split("?");
		connectivityCheckParams = qs ? parseQueryString(qs) : {};
		if (uri.indexOf("://") === -1) uri = "https://" + uri;
		connectivityCheckUrl = uri;
	}
	let wsConnectivityCheckUrl = options.wsConnectivityCheckUrl;
	if (wsConnectivityCheckUrl && wsConnectivityCheckUrl.indexOf("://") === -1) wsConnectivityCheckUrl = "wss://" + wsConnectivityCheckUrl;
	return __spreadProps(__spreadValues({}, options), {
		primaryDomain,
		maxMessageSize: options.maxMessageSize || Defaults.maxMessageSize,
		timeouts,
		connectivityCheckParams,
		connectivityCheckUrl,
		wsConnectivityCheckUrl,
		headers
	});
}
function normaliseChannelOptions(Crypto2, logger, options) {
	const channelOptions = options || {};
	if (channelOptions.cipher) {
		if (!Crypto2) throwMissingPluginError("Crypto");
		const cipher = Crypto2.getCipher(channelOptions.cipher, logger);
		channelOptions.cipher = cipher.cipherParams;
		channelOptions.channelCipher = cipher.cipher;
	} else if ("cipher" in channelOptions) {
		channelOptions.cipher = void 0;
		channelOptions.channelCipher = null;
	}
	return channelOptions;
}
var contentTypes = {
	json: "application/json",
	xml: "application/xml",
	html: "text/html",
	msgpack: "application/x-msgpack",
	text: "text/plain"
};
var defaultHeadersOptions = {
	format: "json",
	protocolVersion: Defaults.protocolVersion
};
function defaultGetHeaders(options, { format, protocolVersion = defaultHeadersOptions.protocolVersion } = {}) {
	return {
		accept: contentTypes[format != null ? format : options.useBinaryProtocol ? "msgpack" : "json"],
		"X-Ably-Version": protocolVersion.toString(),
		"Ably-Agent": getAgentString(options)
	};
}
function defaultPostHeaders(options, { format, protocolVersion = defaultHeadersOptions.protocolVersion } = {}) {
	const accept = contentTypes[format != null ? format : options.useBinaryProtocol ? "msgpack" : "json"];
	return {
		accept,
		"content-type": accept,
		"X-Ably-Version": protocolVersion.toString(),
		"Ably-Agent": getAgentString(options)
	};
}
var defaults_default = Defaults;
function getDefaults(platformDefaults) {
	return Object.assign(Defaults, platformDefaults);
}
var multicaster_default = class _Multicaster {
	constructor(logger, members) {
		this.logger = logger;
		this.members = members || [];
	}
	call(err, result) {
		for (const member of this.members) if (member) try {
			member(err, result);
		} catch (e) {
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Multicaster multiple callback handler", "Unexpected exception: " + e + "; stack = " + e.stack);
		}
	}
	push(...args) {
		this.members.push(...args);
	}
	createPromise() {
		return new Promise((resolve, reject) => {
			this.push((err, result) => {
				err ? reject(err) : resolve(result);
			});
		});
	}
	resolveAll(result) {
		this.call(null, result);
	}
	rejectAll(err) {
		this.call(err);
	}
	static create(logger, members) {
		const instance = new _Multicaster(logger, members);
		return Object.assign((err, result) => instance.call(err, result), {
			push: (fn) => instance.push(fn),
			createPromise: () => instance.createPromise(),
			resolveAll: (result) => instance.resolveAll(result),
			rejectAll: (err) => instance.rejectAll(err)
		});
	}
};
var HttpMethods = /* @__PURE__ */ ((HttpMethods2) => {
	HttpMethods2["Get"] = "get";
	HttpMethods2["Delete"] = "delete";
	HttpMethods2["Post"] = "post";
	HttpMethods2["Put"] = "put";
	HttpMethods2["Patch"] = "patch";
	return HttpMethods2;
})(HttpMethods || {});
var HttpMethods_default = HttpMethods;
var HttpStatusCodes = /* @__PURE__ */ ((HttpStatusCodes2) => {
	HttpStatusCodes2[HttpStatusCodes2["Success"] = 200] = "Success";
	HttpStatusCodes2[HttpStatusCodes2["NoContent"] = 204] = "NoContent";
	HttpStatusCodes2[HttpStatusCodes2["BadRequest"] = 400] = "BadRequest";
	HttpStatusCodes2[HttpStatusCodes2["Unauthorized"] = 401] = "Unauthorized";
	HttpStatusCodes2[HttpStatusCodes2["Forbidden"] = 403] = "Forbidden";
	HttpStatusCodes2[HttpStatusCodes2["RequestTimeout"] = 408] = "RequestTimeout";
	HttpStatusCodes2[HttpStatusCodes2["InternalServerError"] = 500] = "InternalServerError";
	return HttpStatusCodes2;
})(HttpStatusCodes || {});
function isSuccessCode(statusCode) {
	return statusCode >= 200 && statusCode < 400;
}
var HttpStatusCodes_default = HttpStatusCodes;
var MAX_TOKEN_LENGTH = Math.pow(2, 17);
function random() {
	return ("000000" + Math.floor(Math.random() * 0x2386f26fc10000)).slice(-16);
}
function isRealtime(client) {
	return !!client.connection;
}
function normaliseAuthcallbackError(err) {
	if (!isErrorInfoOrPartialErrorInfo(err)) return new ErrorInfo(inspectError(err), err.code || 40170, err.statusCode || 401);
	if (!err.code) if (err.statusCode === 403) err.code = 40300;
	else {
		err.code = 40170;
		err.statusCode = 401;
	}
	return err;
}
var hmac = (text, key) => {
	const bufferUtils = Platform.BufferUtils;
	const textBuffer = bufferUtils.utf8Encode(text);
	const keyBuffer = bufferUtils.utf8Encode(key);
	const digest = bufferUtils.hmacSha256(textBuffer, keyBuffer);
	return bufferUtils.base64Encode(digest);
};
function c14n(capability) {
	if (!capability) return "";
	if (typeof capability == "string") capability = JSON.parse(capability);
	const c14nCapability = /* @__PURE__ */ Object.create(null);
	const keys = keysArray(capability, true);
	if (!keys) return "";
	keys.sort();
	for (let i = 0; i < keys.length; i++) c14nCapability[keys[i]] = capability[keys[i]].sort();
	return JSON.stringify(c14nCapability);
}
function logAndValidateTokenAuthMethod(authOptions, logger) {
	if (authOptions.authCallback) {} else if (authOptions.authUrl) {} else if (authOptions.key) {} else if (authOptions.tokenDetails) {} else {
		const msg = "authOptions must include valid authentication parameters";
		logger_default.logAction(logger, logger_default.LOG_ERROR, "Auth()", msg);
		throw new Error(msg);
	}
}
function basicAuthForced(options) {
	return "useTokenAuth" in options && !options.useTokenAuth;
}
function useTokenAuth(options) {
	return options.useTokenAuth || !basicAuthForced(options) && (options.authCallback || options.authUrl || options.token || options.tokenDetails);
}
function noWayToRenew(options) {
	return !options.key && !options.authCallback && !options.authUrl;
}
var trId = 0;
function getTokenRequestId() {
	return trId++;
}
var Auth = class {
	constructor(client, options) {
		this.authOptions = {};
		this.client = client;
		this.tokenParams = options.defaultTokenParams || {};
		this.currentTokenRequestId = null;
		this.waitingForTokenRequest = null;
		if (useTokenAuth(options)) {
			if (noWayToRenew(options)) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth()", "Warning: library initialized with a token literal without any way to renew the token when it expires (no authUrl, authCallback, or key). See https://help.ably.io/error/40171 for help");
			this._saveTokenOptions(options.defaultTokenParams, options);
			logAndValidateTokenAuthMethod(this.authOptions, this.logger);
		} else {
			if (!options.key) {
				const msg = "No authentication options provided; need one of: key, authUrl, or authCallback (or for testing only, token or tokenDetails)";
				logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth()", msg);
				throw new ErrorInfo(msg, 40160, 401);
			}
			this._saveBasicOptions(options);
		}
	}
	get logger() {
		return this.client.logger;
	}
	async authorize(tokenParams, authOptions) {
		if (authOptions && authOptions.key && this.authOptions.key !== authOptions.key) throw new ErrorInfo("Unable to update auth options with incompatible key", 40102, 401);
		try {
			let tokenDetails = await this._forceNewToken(tokenParams != null ? tokenParams : null, authOptions != null ? authOptions : null);
			if (isRealtime(this.client)) return new Promise((resolve, reject) => {
				this.client.connection.connectionManager.onAuthUpdated(tokenDetails, (err, tokenDetails2) => err ? reject(err) : resolve(tokenDetails2));
			});
			else return tokenDetails;
		} catch (err) {
			if (this.client.connection && err.statusCode === HttpStatusCodes_default.Forbidden) this.client.connection.connectionManager.actOnErrorFromAuthorize(err);
			throw err;
		}
	}
	async _forceNewToken(tokenParams, authOptions) {
		this.tokenDetails = null;
		this._saveTokenOptions(tokenParams, authOptions);
		logAndValidateTokenAuthMethod(this.authOptions, this.logger);
		try {
			return this._ensureValidAuthCredentials(true);
		} finally {
			delete this.tokenParams.timestamp;
			delete this.authOptions.queryTime;
		}
	}
	async requestToken(tokenParams, authOptions) {
		const resolvedAuthOptions = authOptions || this.authOptions;
		const resolvedTokenParams = tokenParams || copy(this.tokenParams);
		let tokenRequestCallback, client = this.client;
		if (resolvedAuthOptions.authCallback) tokenRequestCallback = resolvedAuthOptions.authCallback;
		else if (resolvedAuthOptions.authUrl) tokenRequestCallback = (params, cb) => {
			const authHeaders = mixin({ accept: "application/json, text/plain" }, resolvedAuthOptions.authHeaders);
			const usePost = resolvedAuthOptions.authMethod && resolvedAuthOptions.authMethod.toLowerCase() === "post";
			let providedQsParams;
			const queryIdx = resolvedAuthOptions.authUrl.indexOf("?");
			if (queryIdx > -1) {
				providedQsParams = parseQueryString(resolvedAuthOptions.authUrl.slice(queryIdx));
				resolvedAuthOptions.authUrl = resolvedAuthOptions.authUrl.slice(0, queryIdx);
				if (!usePost) resolvedAuthOptions.authParams = mixin(providedQsParams, resolvedAuthOptions.authParams);
			}
			const authParams = mixin({}, resolvedAuthOptions.authParams || {}, params);
			const authUrlRequestCallback = (result) => {
				var _a2, _b;
				let body = (_a2 = result.body) != null ? _a2 : null;
				let contentType = null;
				if (result.error) {} else {
					const contentTypeHeaderOrHeaders = (_b = result.headers["content-type"]) != null ? _b : null;
					if (Array.isArray(contentTypeHeaderOrHeaders)) contentType = contentTypeHeaderOrHeaders.join(", ");
					else contentType = contentTypeHeaderOrHeaders;
				}
				if (result.error) {
					cb(result.error, null);
					return;
				}
				if (result.unpacked) {
					cb(null, body);
					return;
				}
				if (Platform.BufferUtils.isBuffer(body)) body = body.toString();
				if (!contentType) {
					cb(new ErrorInfo("authUrl response is missing a content-type header", 40170, 401), null);
					return;
				}
				const json = contentType.indexOf("application/json") > -1, text = contentType.indexOf("text/plain") > -1 || contentType.indexOf("application/jwt") > -1;
				if (!json && !text) {
					cb(new ErrorInfo("authUrl responded with unacceptable content-type " + contentType + ", should be either text/plain, application/jwt or application/json", 40170, 401), null);
					return;
				}
				if (json) {
					if (body.length > MAX_TOKEN_LENGTH) {
						cb(new ErrorInfo("authUrl response exceeded max permitted length", 40170, 401), null);
						return;
					}
					try {
						body = JSON.parse(body);
					} catch (e) {
						cb(new ErrorInfo("Unexpected error processing authURL response; err = " + e.message, 40170, 401), null);
						return;
					}
				}
				cb(null, body, contentType);
			};
			if (usePost) {
				const headers = authHeaders || {};
				headers["content-type"] = "application/x-www-form-urlencoded";
				const body = toQueryString(authParams).slice(1);
				whenPromiseSettles(this.client.http.doUri(HttpMethods_default.Post, resolvedAuthOptions.authUrl, headers, body, providedQsParams), (err, result) => err ? authUrlRequestCallback(err) : authUrlRequestCallback(result));
			} else whenPromiseSettles(this.client.http.doUri(HttpMethods_default.Get, resolvedAuthOptions.authUrl, authHeaders || {}, null, authParams), (err, result) => err ? authUrlRequestCallback(err) : authUrlRequestCallback(result));
		};
		else if (resolvedAuthOptions.key) tokenRequestCallback = (params, cb) => {
			whenPromiseSettles(this.createTokenRequest(params, resolvedAuthOptions), (err, result) => cb(err, result != null ? result : null));
		};
		else {
			const msg = "Need a new token, but authOptions does not include any way to request one (no authUrl, authCallback, or key)";
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth()", "library initialized with a token literal without any way to renew the token when it expires (no authUrl, authCallback, or key). See https://help.ably.io/error/40171 for help");
			throw new ErrorInfo(msg, 40171, 403);
		}
		if ("capability" in resolvedTokenParams) resolvedTokenParams.capability = c14n(resolvedTokenParams.capability);
		const tokenRequest = (signedTokenParams, tokenCb) => {
			const path = "/keys/" + signedTokenParams.keyName + "/requestToken", tokenUri = function(host) {
				return client.baseUri(host) + path;
			};
			const requestHeaders = defaults_default.defaultPostHeaders(this.client.options, { format: "json" });
			if (resolvedAuthOptions.requestHeaders) mixin(requestHeaders, resolvedAuthOptions.requestHeaders);
			whenPromiseSettles(this.client.http.do(HttpMethods_default.Post, tokenUri, requestHeaders, JSON.stringify(signedTokenParams), null), (err, result) => err ? tokenCb(err) : tokenCb(result.error, result.body, result.unpacked));
		};
		return new Promise((resolve, reject) => {
			let tokenRequestCallbackTimeoutExpired = false, timeoutLength = this.client.options.timeouts.realtimeRequestTimeout, tokenRequestCallbackTimeout = setTimeout(() => {
				tokenRequestCallbackTimeoutExpired = true;
				const msg = "Token request callback timed out after " + timeoutLength / 1e3 + " seconds";
				logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", msg);
				reject(new ErrorInfo(msg, 40170, 401));
			}, timeoutLength);
			tokenRequestCallback(resolvedTokenParams, (err, tokenRequestOrDetails, contentType) => {
				if (tokenRequestCallbackTimeoutExpired) return;
				clearTimeout(tokenRequestCallbackTimeout);
				if (err) {
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", "token request signing call returned error; err = " + inspectError(err));
					reject(normaliseAuthcallbackError(err));
					return;
				}
				if (typeof tokenRequestOrDetails === "string") {
					if (tokenRequestOrDetails.length === 0) reject(new ErrorInfo("Token string is empty", 40170, 401));
					else if (tokenRequestOrDetails.length > MAX_TOKEN_LENGTH) reject(new ErrorInfo("Token string exceeded max permitted length (was " + tokenRequestOrDetails.length + " bytes)", 40170, 401));
					else if (tokenRequestOrDetails === "undefined" || tokenRequestOrDetails === "null") reject(new ErrorInfo("Token string was literal null/undefined", 40170, 401));
					else if (tokenRequestOrDetails[0] === "{" && !(contentType && contentType.indexOf("application/jwt") > -1)) reject(new ErrorInfo("Token was double-encoded; make sure you're not JSON-encoding an already encoded token request or details", 40170, 401));
					else resolve({ token: tokenRequestOrDetails });
					return;
				}
				if (typeof tokenRequestOrDetails !== "object" || tokenRequestOrDetails === null) {
					const msg = "Expected token request callback to call back with a token string or token request/details object, but got a " + typeof tokenRequestOrDetails;
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", msg);
					reject(new ErrorInfo(msg, 40170, 401));
					return;
				}
				const objectSize = JSON.stringify(tokenRequestOrDetails).length;
				if (objectSize > MAX_TOKEN_LENGTH && !resolvedAuthOptions.suppressMaxLengthCheck) {
					reject(new ErrorInfo("Token request/details object exceeded max permitted stringified size (was " + objectSize + " bytes)", 40170, 401));
					return;
				}
				if ("issued" in tokenRequestOrDetails) {
					resolve(tokenRequestOrDetails);
					return;
				}
				if (!("keyName" in tokenRequestOrDetails)) {
					const msg = "Expected token request callback to call back with a token string, token request object, or token details object";
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", msg);
					reject(new ErrorInfo(msg, 40170, 401));
					return;
				}
				tokenRequest(tokenRequestOrDetails, (err2, tokenResponse, unpacked) => {
					if (err2) {
						logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth.requestToken()", "token request API call returned error; err = " + inspectError(err2));
						reject(normaliseAuthcallbackError(err2));
						return;
					}
					if (!unpacked) tokenResponse = JSON.parse(tokenResponse);
					resolve(tokenResponse);
				});
			});
		});
	}
	/**
	* Create and sign a token request based on the given options.
	* NOTE this can only be used when the key value is available locally.
	* Otherwise, signed token requests must be obtained from the key
	* owner (either using the token request callback or url).
	*
	* @param authOptions
	* an object containing the request options:
	* - key:           the key to use. If not specified, a key passed in constructing
	*                  the Rest interface will be used
	*
	* - queryTime      (optional) boolean indicating that the ably system should be
	*                  queried for the current time when none is specified explicitly
	*
	* - requestHeaders (optional, unsupported, for testing only) extra headers to add to the
	*                  requestToken request
	*
	* @param tokenParams
	* an object containing the parameters for the requested token:
	* - ttl:       (optional) the requested life of the token in ms. If none is specified
	*                  a default of 1 hour is provided. The maximum lifetime is 24hours; any request
	*                  exceeding that lifetime will be rejected with an error.
	*
	* - capability:    (optional) the capability to associate with the access token.
	*                  If none is specified, a token will be requested with all of the
	*                  capabilities of the specified key.
	*
	* - clientId:      (optional) a client ID to associate with the token; if not
	*                  specified, a clientId passed in constructing the Rest interface will be used
	*
	* - timestamp:     (optional) the time in ms since the epoch. If none is specified,
	*                  the system will be queried for a time value to use.
	*/
	async createTokenRequest(tokenParams, authOptions) {
		authOptions = authOptions || this.authOptions;
		tokenParams = tokenParams || copy(this.tokenParams);
		const key = authOptions.key;
		if (!key) throw new ErrorInfo("No key specified", 40101, 403);
		const keyParts = key.split(":"), keyName = keyParts[0], keySecret = keyParts[1];
		if (!keySecret) throw new ErrorInfo("Invalid key specified", 40101, 403);
		if (tokenParams.clientId === "") throw new ErrorInfo("clientId can’t be an empty string", 40012, 400);
		if ("capability" in tokenParams) tokenParams.capability = c14n(tokenParams.capability);
		const request = mixin({ keyName }, tokenParams), clientId = tokenParams.clientId || "", ttl = tokenParams.ttl || "", capability = tokenParams.capability || "";
		if (!request.timestamp) request.timestamp = await this._getTimestamp(authOptions && authOptions.queryTime);
		const nonce = request.nonce || (request.nonce = random()), timestamp = request.timestamp;
		const signText = request.keyName + "\n" + ttl + "\n" + capability + "\n" + clientId + "\n" + timestamp + "\n" + nonce + "\n";
		request.mac = request.mac || hmac(signText, keySecret);
		return request;
	}
	/**
	* Get the auth query params to use for a websocket connection,
	* based on the current auth parameters
	*/
	async getAuthParams() {
		if (this.method == "basic") return { key: this.key };
		else {
			let tokenDetails = await this._ensureValidAuthCredentials(false);
			if (!tokenDetails) throw new Error("Auth.getAuthParams(): _ensureValidAuthCredentials returned no error or tokenDetails");
			return { access_token: tokenDetails.token };
		}
	}
	/**
	* Get the authorization header to use for a REST or comet request,
	* based on the current auth parameters
	*/
	async getAuthHeaders() {
		if (this.method == "basic") return { authorization: "Basic " + this.basicKey };
		else {
			const tokenDetails = await this._ensureValidAuthCredentials(false);
			if (!tokenDetails) throw new Error("Auth.getAuthParams(): _ensureValidAuthCredentials returned no error or tokenDetails");
			return { authorization: "Bearer " + toBase64(tokenDetails.token) };
		}
	}
	_saveBasicOptions(authOptions) {
		this.method = "basic";
		this.key = authOptions.key;
		this.basicKey = toBase64(authOptions.key);
		this.authOptions = authOptions || {};
		if ("clientId" in authOptions) this._userSetClientId(authOptions.clientId);
	}
	_saveTokenOptions(tokenParams, authOptions) {
		this.method = "token";
		if (tokenParams) this.tokenParams = tokenParams;
		if (authOptions) {
			if (authOptions.token) authOptions.tokenDetails = typeof authOptions.token === "string" ? { token: authOptions.token } : authOptions.token;
			if (authOptions.tokenDetails) this.tokenDetails = authOptions.tokenDetails;
			if ("clientId" in authOptions) this._userSetClientId(authOptions.clientId);
			this.authOptions = authOptions;
		}
	}
	async _ensureValidAuthCredentials(forceSupersede) {
		const token = this.tokenDetails;
		if (token) {
			if (this._tokenClientIdMismatch(token.clientId)) throw new ErrorInfo("Mismatch between clientId in token (" + token.clientId + ") and current clientId (" + this.clientId + ")", 40102, 403);
			if (!this.client.isTimeOffsetSet() || !token.expires || token.expires >= this.client.getTimestampUsingOffset()) return token;
			this.tokenDetails = null;
		}
		const promise = (this.waitingForTokenRequest || (this.waitingForTokenRequest = multicaster_default.create(this.logger))).createPromise();
		if (this.currentTokenRequestId !== null && !forceSupersede) return promise;
		const tokenRequestId = this.currentTokenRequestId = getTokenRequestId();
		let tokenResponse, caughtError = null;
		try {
			tokenResponse = await this.requestToken(this.tokenParams, this.authOptions);
		} catch (err) {
			caughtError = err;
		}
		if (this.currentTokenRequestId > tokenRequestId) return promise;
		this.currentTokenRequestId = null;
		const multicaster = this.waitingForTokenRequest;
		this.waitingForTokenRequest = null;
		if (caughtError) {
			multicaster?.rejectAll(caughtError);
			return promise;
		}
		multicaster?.resolveAll(this.tokenDetails = tokenResponse);
		return promise;
	}
	_userSetClientId(clientId) {
		if (!(typeof clientId === "string" || clientId === null)) throw new ErrorInfo("clientId must be either a string or null", 40012, 400);
		else if (clientId === "*") throw new ErrorInfo("Can’t use \"*\" as a clientId as that string is reserved. (To change the default token request behaviour to use a wildcard clientId, instantiate the library with {defaultTokenParams: {clientId: \"*\"}}), or if calling authorize(), pass it in as a tokenParam: authorize({clientId: \"*\"}, authOptions)", 40012, 400);
		else {
			const err = this._uncheckedSetClientId(clientId);
			if (err) throw err;
		}
	}
	_uncheckedSetClientId(clientId) {
		if (this._tokenClientIdMismatch(clientId)) {
			const msg = "Unexpected clientId mismatch: client has " + this.clientId + ", requested " + clientId;
			const err = new ErrorInfo(msg, 40102, 401);
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Auth._uncheckedSetClientId()", msg);
			return err;
		} else {
			this.clientId = this.tokenParams.clientId = clientId;
			return null;
		}
	}
	_tokenClientIdMismatch(tokenClientId) {
		return !!(this.clientId && this.clientId !== "*" && tokenClientId && tokenClientId !== "*" && this.clientId !== tokenClientId);
	}
	static isTokenErr(error) {
		return error.code && error.code >= 40140 && error.code < 40150;
	}
	revokeTokens(specifiers, options) {
		return this.client.rest.revokeTokens(specifiers, options);
	}
	/**
	* Same as {@link BaseClient.getTimestamp} but also takes into account {@link Auth.authOptions}
	*/
	async _getTimestamp(queryTime) {
		return this.client.getTimestamp(queryTime || !!this.authOptions.queryTime);
	}
};
var auth_default = Auth;
function paramString(params) {
	const paramPairs = [];
	if (params) for (const needle in params) paramPairs.push(needle + "=" + params[needle]);
	return paramPairs.join("&");
}
function appendingParams(uri, params) {
	return uri + (params ? "?" : "") + paramString(params);
}
function logResult(result, method, uri, params, logger) {
	if (result.error) logger_default.logActionNoStrip(logger, logger_default.LOG_MICRO, "Http." + method + "()", "Received Error; " + appendingParams(uri, params) + "; Error: " + inspectError(result.error));
	else logger_default.logActionNoStrip(logger, logger_default.LOG_MICRO, "Http." + method + "()", "Received; " + appendingParams(uri, params) + "; Headers: " + paramString(result.headers) + "; StatusCode: " + result.statusCode + "; Body" + (Platform.BufferUtils.isBuffer(result.body) ? " (Base64): " + Platform.BufferUtils.base64Encode(result.body) : ": " + result.body));
}
function logRequest(method, uri, body, params, logger) {
	if (logger.shouldLog(logger_default.LOG_MICRO)) logger_default.logActionNoStrip(logger, logger_default.LOG_MICRO, "Http." + method + "()", "Sending; " + appendingParams(uri, params) + "; Body" + (Platform.BufferUtils.isBuffer(body) ? " (Base64): " + Platform.BufferUtils.base64Encode(body) : ": " + body));
}
var Http = class {
	constructor(client) {
		this.client = client;
		this.platformHttp = new Platform.Http(client);
		this.checkConnectivity = this.platformHttp.checkConnectivity ? () => this.platformHttp.checkConnectivity() : void 0;
	}
	get logger() {
		var _a2, _b;
		return (_b = (_a2 = this.client) == null ? void 0 : _a2.logger) != null ? _b : logger_default.defaultLogger;
	}
	get supportsAuthHeaders() {
		return this.platformHttp.supportsAuthHeaders;
	}
	get supportsLinkHeaders() {
		return this.platformHttp.supportsLinkHeaders;
	}
	_getHosts(client) {
		const connection = client.connection, connectionHost = connection && connection.connectionManager.host;
		if (connectionHost) return [connectionHost].concat(defaults_default.getFallbackHosts(client.options));
		return defaults_default.getHosts(client.options);
	}
	/**
	* This method will not throw any errors; rather, it will communicate any error by populating the {@link RequestResult.error} property of the returned {@link RequestResult}.
	*/
	async do(method, path, headers, body, params) {
		try {
			const client = this.client;
			if (!client) return { error: new ErrorInfo("http.do called without client", 5e4, 500) };
			const uriFromHost = typeof path === "function" ? path : function(host) {
				return client.baseUri(host) + path;
			};
			const currentFallback = client._currentFallback;
			if (currentFallback) if (currentFallback.validUntil > Date.now()) {
				const result = await this.doUri(method, uriFromHost(currentFallback.host), headers, body, params);
				if (result.error && this.platformHttp.shouldFallback(result.error)) {
					client._currentFallback = null;
					return this.do(method, path, headers, body, params);
				}
				return result;
			} else client._currentFallback = null;
			const hosts = this._getHosts(client);
			if (hosts.length === 1) return this.doUri(method, uriFromHost(hosts[0]), headers, body, params);
			let tryAHostStartedAt = null;
			const tryAHost = async (candidateHosts, persistOnSuccess) => {
				const host = candidateHosts.shift();
				tryAHostStartedAt = tryAHostStartedAt != null ? tryAHostStartedAt : /* @__PURE__ */ new Date();
				const result = await this.doUri(method, uriFromHost(host), headers, body, params);
				if (result.error && this.platformHttp.shouldFallback(result.error) && candidateHosts.length) {
					if (Date.now() - tryAHostStartedAt.getTime() > client.options.timeouts.httpMaxRetryDuration) return { error: new ErrorInfo(`Timeout for trying fallback hosts retries. Total elapsed time exceeded the ${client.options.timeouts.httpMaxRetryDuration}ms limit`, 50003, 500) };
					return tryAHost(candidateHosts, true);
				}
				if (persistOnSuccess) client._currentFallback = {
					host,
					validUntil: Date.now() + client.options.timeouts.fallbackRetryTimeout
				};
				return result;
			};
			return tryAHost(hosts);
		} catch (err) {
			return { error: new ErrorInfo(`Unexpected error in Http.do: ${inspectError(err)}`, 500, 5e4) };
		}
	}
	/**
	* This method will not throw any errors; rather, it will communicate any error by populating the {@link RequestResult.error} property of the returned {@link RequestResult}.
	*/
	async doUri(method, uri, headers, body, params) {
		try {
			logRequest(method, uri, body, params, this.logger);
			const result = await this.platformHttp.doUri(method, uri, headers, body, params);
			if (this.logger.shouldLog(logger_default.LOG_MICRO)) logResult(result, method, uri, params, this.logger);
			return result;
		} catch (err) {
			return { error: new ErrorInfo(`Unexpected error in Http.doUri: ${inspectError(err)}`, 500, 5e4) };
		}
	}
};
function callListener(logger, eventThis, listener, args) {
	try {
		listener.apply(eventThis, args);
	} catch (e) {
		logger_default.logAction(logger, logger_default.LOG_ERROR, "EventEmitter.emit()", "Unexpected listener exception: " + e + "; stack = " + (e && e.stack));
	}
}
function removeListener(targetListeners, listener, eventFilter) {
	let listeners;
	let index;
	let eventName;
	for (let targetListenersIndex = 0; targetListenersIndex < targetListeners.length; targetListenersIndex++) {
		listeners = targetListeners[targetListenersIndex];
		if (eventFilter) listeners = listeners[eventFilter];
		if (Array.isArray(listeners)) {
			while ((index = listeners.indexOf(listener)) !== -1) listeners.splice(index, 1);
			if (eventFilter && listeners.length === 0) delete targetListeners[targetListenersIndex][eventFilter];
		} else if (isObject(listeners)) {
			for (eventName in listeners) if (Object.prototype.hasOwnProperty.call(listeners, eventName) && Array.isArray(listeners[eventName])) removeListener([listeners], listener, eventName);
		}
	}
}
var EventEmitter = class {
	constructor(logger) {
		this.logger = logger;
		this.any = [];
		this.events = /* @__PURE__ */ Object.create(null);
		this.anyOnce = [];
		this.eventsOnce = /* @__PURE__ */ Object.create(null);
	}
	on(...args) {
		if (args.length === 1) {
			const listener = args[0];
			if (typeof listener === "function") this.any.push(listener);
			else throw new Error("EventListener.on(): Invalid arguments: " + Platform.Config.inspect(args));
		}
		if (args.length === 2) {
			const [event, listener] = args;
			if (typeof listener !== "function") throw new Error("EventListener.on(): Invalid arguments: " + Platform.Config.inspect(args));
			if (isNil(event)) this.any.push(listener);
			else if (Array.isArray(event)) event.forEach((eventName) => {
				this.on(eventName, listener);
			});
			else {
				if (typeof event !== "string") throw new Error("EventListener.on(): Invalid arguments: " + Platform.Config.inspect(args));
				(this.events[event] || (this.events[event] = [])).push(listener);
			}
		}
	}
	off(...args) {
		if (args.length == 0 || isNil(args[0]) && isNil(args[1])) {
			this.any = [];
			this.events = /* @__PURE__ */ Object.create(null);
			this.anyOnce = [];
			this.eventsOnce = /* @__PURE__ */ Object.create(null);
			return;
		}
		const [firstArg, secondArg] = args;
		let listener = null;
		let event = null;
		if (args.length === 1 || !secondArg) if (typeof firstArg === "function") listener = firstArg;
		else event = firstArg;
		else {
			if (typeof secondArg !== "function") throw new Error("EventEmitter.off(): invalid arguments:" + Platform.Config.inspect(args));
			[event, listener] = [firstArg, secondArg];
		}
		if (listener && isNil(event)) {
			removeListener([
				this.any,
				this.events,
				this.anyOnce,
				this.eventsOnce
			], listener);
			return;
		}
		if (Array.isArray(event)) {
			event.forEach((eventName) => {
				this.off(eventName, listener);
			});
			return;
		}
		if (typeof event !== "string") throw new Error("EventEmitter.off(): invalid arguments:" + Platform.Config.inspect(args));
		if (listener) removeListener([this.events, this.eventsOnce], listener, event);
		else {
			delete this.events[event];
			delete this.eventsOnce[event];
		}
	}
	/**
	* Get the array of listeners for a given event; excludes once events
	* @param event (optional) the name of the event, or none for 'any'
	* @return array of events, or null if none
	*/
	listeners(event) {
		if (event) {
			const listeners = this.events[event] || [];
			if (this.eventsOnce[event]) Array.prototype.push.apply(listeners, this.eventsOnce[event]);
			return listeners.length ? listeners : null;
		}
		return this.any.length ? this.any : null;
	}
	/**
	* Emit an event
	* @param event the event name
	* @param args the arguments to pass to the listener
	*/
	emit(event, ...args) {
		const eventThis = { event };
		const listeners = [];
		if (this.anyOnce.length) {
			Array.prototype.push.apply(listeners, this.anyOnce);
			this.anyOnce = [];
		}
		if (this.any.length) Array.prototype.push.apply(listeners, this.any);
		const eventsOnceListeners = this.eventsOnce[event];
		if (eventsOnceListeners) {
			Array.prototype.push.apply(listeners, eventsOnceListeners);
			delete this.eventsOnce[event];
		}
		const eventsListeners = this.events[event];
		if (eventsListeners) Array.prototype.push.apply(listeners, eventsListeners);
		listeners.forEach((listener) => {
			callListener(this.logger, eventThis, listener, args);
		});
	}
	once(...args) {
		const argCount = args.length;
		if (argCount === 0 || argCount === 1 && typeof args[0] !== "function") {
			const event = args[0];
			return new Promise((resolve) => {
				this.once(event, resolve);
			});
		}
		const [firstArg, secondArg] = args;
		if (args.length === 1 && typeof firstArg === "function") this.anyOnce.push(firstArg);
		else if (isNil(firstArg)) {
			if (typeof secondArg !== "function") throw new Error("EventEmitter.once(): Invalid arguments:" + Platform.Config.inspect(args));
			this.anyOnce.push(secondArg);
		} else if (Array.isArray(firstArg)) {
			const self2 = this;
			const listenerWrapper = function() {
				const innerArgs = Array.prototype.slice.call(arguments);
				firstArg.forEach(function(eventName) {
					self2.off(eventName, listenerWrapper);
				});
				if (typeof secondArg !== "function") throw new Error("EventEmitter.once(): Invalid arguments:" + Platform.Config.inspect(args));
				secondArg.apply(this, innerArgs);
			};
			firstArg.forEach(function(eventName) {
				self2.on(eventName, listenerWrapper);
			});
		} else {
			if (typeof firstArg !== "string") throw new Error("EventEmitter.once(): Invalid arguments:" + Platform.Config.inspect(args));
			const listeners = this.eventsOnce[firstArg] || (this.eventsOnce[firstArg] = []);
			if (secondArg) {
				if (typeof secondArg !== "function") throw new Error("EventEmitter.once(): Invalid arguments:" + Platform.Config.inspect(args));
				listeners.push(secondArg);
			}
		}
	}
	/**
	* Listen for a single occurrence of a state event and fire immediately if currentState matches targetState
	* @param targetState the name of the state event to listen to
	* @param currentState the name of the current state of this object
	*/
	async whenState(targetState, currentState) {
		if (typeof targetState !== "string" || typeof currentState !== "string") throw new Error("whenState requires a valid state String argument");
		if (targetState === currentState) return null;
		else return this.once(targetState);
	}
};
var eventemitter_default = EventEmitter;
var actions = {
	HEARTBEAT: 0,
	ACK: 1,
	NACK: 2,
	CONNECT: 3,
	CONNECTED: 4,
	DISCONNECT: 5,
	DISCONNECTED: 6,
	CLOSE: 7,
	CLOSED: 8,
	ERROR: 9,
	ATTACH: 10,
	ATTACHED: 11,
	DETACH: 12,
	DETACHED: 13,
	PRESENCE: 14,
	MESSAGE: 15,
	SYNC: 16,
	AUTH: 17,
	ACTIVATE: 18,
	OBJECT: 19,
	OBJECT_SYNC: 20,
	ANNOTATION: 21
};
var ActionName = [];
Object.keys(actions).forEach(function(name) {
	ActionName[actions[name]] = name;
});
var flags = {
	HAS_PRESENCE: 1,
	HAS_BACKLOG: 2,
	RESUMED: 4,
	TRANSIENT: 16,
	ATTACH_RESUME: 32,
	HAS_OBJECTS: 128,
	PRESENCE: 65536,
	PUBLISH: 1 << 17,
	SUBSCRIBE: 1 << 18,
	PRESENCE_SUBSCRIBE: 1 << 19,
	ANNOTATION_PUBLISH: 1 << 21,
	ANNOTATION_SUBSCRIBE: 1 << 22,
	OBJECT_SUBSCRIBE: 1 << 24,
	OBJECT_PUBLISH: 1 << 25
};
var flagNames = Object.keys(flags);
flags.MODE_ALL = flags.PRESENCE | flags.PUBLISH | flags.SUBSCRIBE | flags.PRESENCE_SUBSCRIBE | flags.ANNOTATION_PUBLISH | flags.ANNOTATION_SUBSCRIBE | flags.OBJECT_SUBSCRIBE | flags.OBJECT_PUBLISH;
var channelModes = [
	"PRESENCE",
	"PUBLISH",
	"SUBSCRIBE",
	"PRESENCE_SUBSCRIBE",
	"ANNOTATION_PUBLISH",
	"ANNOTATION_SUBSCRIBE",
	"OBJECT_SUBSCRIBE",
	"OBJECT_PUBLISH"
];
function normaliseContext(context) {
	if (!context || !context.channelOptions) return {
		channelOptions: context,
		plugins: {},
		baseEncodedPreviousPayload: void 0
	};
	return context;
}
async function encrypt(msg, cipherOptions) {
	const { data, encoding } = await encryptData(msg.data, msg.encoding, cipherOptions);
	msg.data = data;
	msg.encoding = encoding;
	return msg;
}
async function encryptData(data, encoding, cipherOptions) {
	let cipher = cipherOptions.channelCipher;
	let dataToEncrypt = data;
	let finalEncoding = encoding ? encoding + "/" : "";
	if (!Platform.BufferUtils.isBuffer(dataToEncrypt)) {
		dataToEncrypt = Platform.BufferUtils.utf8Encode(String(dataToEncrypt));
		finalEncoding = finalEncoding + "utf-8/";
	}
	const ciphertext = await cipher.encrypt(dataToEncrypt);
	finalEncoding = finalEncoding + "cipher+" + cipher.algorithm;
	return {
		data: ciphertext,
		encoding: finalEncoding
	};
}
async function encode(msg, options) {
	const { data, encoding } = encodeData(msg.data, msg.encoding);
	msg.data = data;
	msg.encoding = encoding;
	if (options != null && options.cipher) return encrypt(msg, options);
	else return msg;
}
function encodeData(data, encoding) {
	if (typeof data == "string" || Platform.BufferUtils.isBuffer(data) || data === null || data === void 0) return {
		data,
		encoding
	};
	if (isObject(data) || Array.isArray(data)) return {
		data: JSON.stringify(data),
		encoding: encoding ? encoding + "/json" : "json"
	};
	throw new ErrorInfo("Data type is unsupported", 40013, 400);
}
async function decode(message, inputContext) {
	const { data, encoding, error } = await decodeData(message.data, message.encoding, inputContext);
	message.data = data;
	message.encoding = encoding;
	if (error) throw error;
}
async function decodeData(data, encoding, inputContext) {
	const context = normaliseContext(inputContext);
	let lastPayload = data;
	let decodedData = data;
	let finalEncoding = encoding;
	let decodingError;
	if (encoding) {
		const xforms = encoding.split("/");
		let lastProcessedEncodingIndex;
		let encodingsToProcess = xforms.length;
		let xform = "";
		try {
			while ((lastProcessedEncodingIndex = encodingsToProcess) > 0) {
				const match = xforms[--encodingsToProcess].match(/([-\w]+)(\+([\w-]+))?/);
				if (!match) break;
				xform = match[1];
				switch (xform) {
					case "base64":
						decodedData = Platform.BufferUtils.base64Decode(String(decodedData));
						if (lastProcessedEncodingIndex == xforms.length) lastPayload = decodedData;
						continue;
					case "utf-8":
						decodedData = Platform.BufferUtils.utf8Decode(decodedData);
						continue;
					case "json":
						decodedData = JSON.parse(decodedData);
						continue;
					case "cipher": if (context.channelOptions != null && context.channelOptions.cipher && context.channelOptions.channelCipher) {
						const xformAlgorithm = match[3], cipher = context.channelOptions.channelCipher;
						if (xformAlgorithm != cipher.algorithm) throw new Error("Unable to decrypt message with given cipher; incompatible cipher params");
						decodedData = await cipher.decrypt(decodedData);
						continue;
					} else throw new Error("Unable to decrypt message; not an encrypted channel");
					case "vcdiff":
						if (!context.plugins || !context.plugins.vcdiff) throw new ErrorInfo("Missing Vcdiff decoder (https://github.com/ably-forks/vcdiff-decoder)", 40019, 400);
						if (typeof Uint8Array === "undefined") throw new ErrorInfo("Delta decoding not supported on this browser (need ArrayBuffer & Uint8Array)", 40020, 400);
						try {
							let deltaBase = context.baseEncodedPreviousPayload;
							if (typeof deltaBase === "string") deltaBase = Platform.BufferUtils.utf8Encode(deltaBase);
							const deltaBaseBuffer = Platform.BufferUtils.toBuffer(deltaBase);
							decodedData = Platform.BufferUtils.toBuffer(decodedData);
							decodedData = Platform.BufferUtils.arrayBufferViewToBuffer(context.plugins.vcdiff.decode(decodedData, deltaBaseBuffer));
							lastPayload = decodedData;
						} catch (e) {
							throw new ErrorInfo("Vcdiff delta decode failed with " + e, 40018, 400);
						}
						continue;
					default: throw new Error("Unknown encoding");
				}
			}
		} catch (e) {
			const err = e;
			decodingError = new ErrorInfo(`Error processing the ${xform} encoding, decoder returned \u2018${err.message}\u2019`, err.code || 40013, 400);
		} finally {
			finalEncoding = lastProcessedEncodingIndex <= 0 ? null : xforms.slice(0, lastProcessedEncodingIndex).join("/");
		}
	}
	if (decodingError) return {
		error: decodingError,
		data: decodedData,
		encoding: finalEncoding
	};
	context.baseEncodedPreviousPayload = lastPayload;
	return {
		data: decodedData,
		encoding: finalEncoding
	};
}
function wireToJSON(...args) {
	const format = args.length > 0 ? "json" : "msgpack";
	const { data, encoding } = encodeDataForWire(this.data, this.encoding, format);
	return Object.assign({}, this, {
		encoding,
		data
	});
}
function encodeDataForWire(data, encoding, format) {
	if (!data || !Platform.BufferUtils.isBuffer(data)) return {
		data,
		encoding
	};
	if (format === "msgpack") return {
		data: Platform.BufferUtils.toBuffer(data),
		encoding
	};
	return {
		data: Platform.BufferUtils.base64Encode(data),
		encoding: encoding ? encoding + "/base64" : "base64"
	};
}
var MessageEncoding = {
	encryptData,
	encodeData,
	encodeDataForWire,
	decodeData
};
function populateFieldsFromParent(parent) {
	const { id, connectionId, timestamp } = parent;
	let msgs;
	switch (parent.action) {
		case actions.MESSAGE:
			msgs = parent.messages;
			break;
		case actions.PRESENCE:
		case actions.SYNC:
			msgs = parent.presence;
			break;
		case actions.ANNOTATION:
			msgs = parent.annotations;
			break;
		case actions.OBJECT:
		case actions.OBJECT_SYNC:
			msgs = parent.state;
			break;
		default: throw new ErrorInfo("Unexpected action " + parent.action, 4e4, 400);
	}
	for (let i = 0; i < msgs.length; i++) {
		const msg = msgs[i];
		if (!msg.connectionId) msg.connectionId = connectionId;
		if (!msg.timestamp) msg.timestamp = timestamp;
		if (id && !msg.id) msg.id = id + ":" + i;
	}
}
function strMsg(m, cls) {
	let result = "[" + cls;
	for (const attr in m) if (attr === "data") {
		if (typeof m.data == "string") result += "; data=" + m.data;
		else if (Platform.BufferUtils.isBuffer(m.data)) result += "; data (buffer)=" + Platform.BufferUtils.base64Encode(m.data);
		else if (typeof m.data !== "undefined") result += "; data (json)=" + JSON.stringify(m.data);
	} else if (attr && (attr === "extras" || attr === "operation")) result += "; " + attr + "=" + JSON.stringify(m[attr]);
	else if (attr === "version") result += "; version=" + JSON.stringify(m[attr]);
	else if (attr === "annotations") result += "; annotations=" + JSON.stringify(m[attr]);
	else if (m[attr] !== void 0) result += "; " + attr + "=" + m[attr];
	result += "]";
	return result;
}
var BaseMessage = class {};
var BaseClient = class {
	constructor(options) {
		/**
		* These exports are for use by UMD plugins; reason being so that constructors and static methods can be accessed by these plugins without needing to import the classes directly and result in the class existing in both the plugin and the core library.
		*/
		this.Platform = Platform;
		this.ErrorInfo = ErrorInfo;
		this.Logger = logger_default;
		this.Defaults = defaults_default;
		this.Utils = utils_exports;
		this.EventEmitter = eventemitter_default;
		this.MessageEncoding = MessageEncoding;
		var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
		this._additionalHTTPRequestImplementations = (_a2 = options.plugins) != null ? _a2 : null;
		this.logger = new logger_default();
		this.logger.setLog(options.logLevel, options.logHandler);
		this._MsgPack = (_c = (_b = options.plugins) == null ? void 0 : _b.MsgPack) != null ? _c : null;
		const normalOptions = this.options = defaults_default.normaliseOptions(options, this._MsgPack, this.logger);
		if (normalOptions.key) {
			const keyMatch = normalOptions.key.match(/^([^:\s]+):([^:.\s]+)$/);
			if (!keyMatch) {
				const msg = "invalid key parameter";
				logger_default.logAction(this.logger, logger_default.LOG_ERROR, "BaseClient()", msg);
				throw new ErrorInfo(msg, 40400, 404);
			}
			normalOptions.keyName = keyMatch[1];
			normalOptions.keySecret = keyMatch[2];
		}
		if ("clientId" in normalOptions) {
			if (!(typeof normalOptions.clientId === "string" || normalOptions.clientId === null)) throw new ErrorInfo("clientId must be either a string or null", 40012, 400);
			else if (normalOptions.clientId === "*") throw new ErrorInfo("Can’t use \"*\" as a clientId as that string is reserved. (To change the default token request behaviour to use a wildcard clientId, use {defaultTokenParams: {clientId: \"*\"}})", 40012, 400);
		}
		this._currentFallback = null;
		this.serverTimeOffset = null;
		this.http = new Http(this);
		this.auth = new auth_default(this, normalOptions);
		this._rest = ((_d = options.plugins) == null ? void 0 : _d.Rest) ? new options.plugins.Rest(this) : null;
		this._Crypto = (_f = (_e = options.plugins) == null ? void 0 : _e.Crypto) != null ? _f : null;
		this.__FilteredSubscriptions = (_h = (_g = options.plugins) == null ? void 0 : _g.MessageInteractions) != null ? _h : null;
		this._Annotations = (_j = (_i = options.plugins) == null ? void 0 : _i.Annotations) != null ? _j : null;
	}
	get rest() {
		if (!this._rest) throwMissingPluginError("Rest");
		return this._rest;
	}
	get _FilteredSubscriptions() {
		if (!this.__FilteredSubscriptions) throwMissingPluginError("MessageInteractions");
		return this.__FilteredSubscriptions;
	}
	get channels() {
		return this.rest.channels;
	}
	get push() {
		return this.rest.push;
	}
	/** RSH8 */
	device() {
		var _a2;
		if (!((_a2 = this.options.plugins) == null ? void 0 : _a2.Push) || !this.push.LocalDevice) throwMissingPluginError("Push");
		if (!this._device) this._device = this.push.LocalDevice.load(this);
		return this._device;
	}
	baseUri(host) {
		return defaults_default.getHttpScheme(this.options) + host + ":" + defaults_default.getPort(this.options, false);
	}
	async stats(params) {
		return this.rest.stats(params);
	}
	async time(params) {
		return this.rest.time(params);
	}
	async request(method, path, version2, params, body, customHeaders) {
		return this.rest.request(method, path, version2, params, body, customHeaders);
	}
	batchPublish(specOrSpecs) {
		return this.rest.batchPublish(specOrSpecs);
	}
	batchPresence(channels) {
		return this.rest.batchPresence(channels);
	}
	setLog(logOptions) {
		this.logger.setLog(logOptions.level, logOptions.handler);
	}
	/**
	* Get the current time based on the local clock,
	* or if the option queryTime is true, return the server time.
	* The server time offset from the local time is stored so that
	* only one request to the server to get the time is ever needed
	*/
	async getTimestamp(queryTime) {
		if (!this.isTimeOffsetSet() && queryTime) return this.time();
		return this.getTimestampUsingOffset();
	}
	getTimestampUsingOffset() {
		return Date.now() + (this.serverTimeOffset || 0);
	}
	isTimeOffsetSet() {
		return this.serverTimeOffset !== null;
	}
};
BaseClient.Platform = Platform;
var baseclient_default = BaseClient;
var _PushChannelSubscription = class _PushChannelSubscription {
	/**
	* Overload toJSON() to intercept JSON.stringify()
	* @return {*}
	*/
	toJSON() {
		return {
			channel: this.channel,
			deviceId: this.deviceId,
			clientId: this.clientId
		};
	}
	toString() {
		let result = "[PushChannelSubscription";
		if (this.channel) result += "; channel=" + this.channel;
		if (this.deviceId) result += "; deviceId=" + this.deviceId;
		if (this.clientId) result += "; clientId=" + this.clientId;
		result += "]";
		return result;
	}
	static fromResponseBody(body, MsgPack, format) {
		if (format) body = decodeBody(body, MsgPack, format);
		if (Array.isArray(body)) return _PushChannelSubscription.fromValuesArray(body);
		else return _PushChannelSubscription.fromValues(body);
	}
	static fromValues(values) {
		return Object.assign(new _PushChannelSubscription(), values);
	}
	static fromValuesArray(values) {
		const count = values.length, result = new Array(count);
		for (let i = 0; i < count; i++) result[i] = _PushChannelSubscription.fromValues(values[i]);
		return result;
	}
};
_PushChannelSubscription.toRequestBody = encodeBody;
var actions3 = [
	"message.create",
	"message.update",
	"message.delete",
	"meta",
	"message.summary",
	"message.append"
];
function stringifyAction(action) {
	return actions3[action || 0] || "unknown";
}
function getMessageSize(msg) {
	let size = 0;
	if (msg.name) size += msg.name.length;
	if (msg.clientId) size += msg.clientId.length;
	if (msg.extras) size += JSON.stringify(msg.extras).length;
	if (msg.data) size += dataSizeBytes(msg.data);
	return size;
}
async function encodeArray(messages, options) {
	return Promise.all(messages.map((message) => message.encode(options)));
}
function getMessagesSize(messages) {
	let msg, total = 0;
	for (let i = 0; i < messages.length; i++) {
		msg = messages[i];
		total += msg.size || (msg.size = getMessageSize(msg));
	}
	return total;
}
var Message = class _Message extends BaseMessage {
	expandFields() {
		if (!this.version) this.version = {};
		if (!this.version.serial && this.serial) this.version.serial = this.serial;
		if (!this.version.timestamp && this.timestamp) this.version.timestamp = this.timestamp;
		if (!this.annotations) this.annotations = { summary: {} };
		else if (!this.annotations.summary) this.annotations.summary = {};
		if (this.annotations && this.annotations.summary) {
			for (const [type, summaryEntry] of Object.entries(this.annotations.summary)) if (type.endsWith(":distinct.v1") || type.endsWith(":unique.v1") || type.endsWith(":multiple.v1")) {
				for (const [, entry] of Object.entries(summaryEntry)) if (!entry.clipped) entry.clipped = false;
			} else if (type.endsWith(":flag.v1")) {
				if (!summaryEntry.clipped) summaryEntry.clipped = false;
			}
		}
	}
	async encode(options) {
		return encode(Object.assign(new WireMessage(), this, { action: actions3.indexOf(this.action || "message.create") }), options);
	}
	static fromValues(values) {
		return Object.assign(new _Message(), values);
	}
	static fromValuesArray(values) {
		return values.map((v) => _Message.fromValues(v));
	}
	toString() {
		return strMsg(this, "Message");
	}
};
var WireMessage = class _WireMessage extends BaseMessage {
	toJSON(...args) {
		return wireToJSON.call(this, ...args);
	}
	static fromValues(values) {
		return Object.assign(new _WireMessage(), values);
	}
	static fromValuesArray(values) {
		return values.map((v) => _WireMessage.fromValues(v));
	}
	async decodeWithErr(inputContext, logger) {
		const res = Object.assign(new Message(), __spreadProps(__spreadValues({}, this), { action: stringifyAction(this.action) }));
		let err;
		try {
			await decode(res, inputContext);
		} catch (e) {
			logger_default.logAction(logger, logger_default.LOG_ERROR, "WireMessage.decode()", inspectError(e));
			err = e;
		}
		res.expandFields();
		return {
			decoded: res,
			err
		};
	}
	async decode(inputContext, logger) {
		const { decoded } = await this.decodeWithErr(inputContext, logger);
		return decoded;
	}
	toString() {
		return strMsg(this, "WireMessage");
	}
};
var message_default = Message;
var ChannelStateChange = class {
	constructor(previous, current, resumed, hasBacklog, reason) {
		this.previous = previous;
		this.current = current;
		if (current === "attached") {
			this.resumed = resumed;
			this.hasBacklog = hasBacklog;
		}
		if (reason) this.reason = reason;
	}
};
var channelstatechange_default = ChannelStateChange;
var noop = function() {};
function validateChannelOptions(options) {
	if (options && "params" in options && !isObject(options.params)) return new ErrorInfo("options.params must be an object", 4e4, 400);
	if (options && "modes" in options) {
		if (!Array.isArray(options.modes)) return new ErrorInfo("options.modes must be an array", 4e4, 400);
		for (let i = 0; i < options.modes.length; i++) {
			const currentMode = options.modes[i];
			if (!currentMode || typeof currentMode !== "string" || !channelModes.includes(String.prototype.toUpperCase.call(currentMode))) return new ErrorInfo("Invalid channel mode: " + currentMode, 4e4, 400);
		}
	}
}
var RealtimeChannel = class _RealtimeChannel extends eventemitter_default {
	constructor(client, name, options) {
		var _a2, _b, _c;
		super(client.logger);
		this._annotations = null;
		this._mode = 0;
		this.retryCount = 0;
		this.history = async function(params) {
			const restMixin = this.client.rest.channelMixin;
			if (params && params.untilAttach) {
				if (this.state !== "attached") throw new ErrorInfo("option untilAttach requires the channel to be attached", 4e4, 400);
				if (!this.properties.attachSerial) throw new ErrorInfo("untilAttach was specified and channel is attached, but attachSerial is not defined", 4e4, 400);
				delete params.untilAttach;
				params.from_serial = this.properties.attachSerial;
			}
			return restMixin.history(this, params);
		};
		this.whenState = (state) => {
			return eventemitter_default.prototype.whenState.call(this, state, this.state);
		};
		this.name = name;
		this.channelOptions = normaliseChannelOptions((_a2 = client._Crypto) != null ? _a2 : null, this.logger, options);
		this.client = client;
		this._presence = client._RealtimePresence ? new client._RealtimePresence.RealtimePresence(this) : null;
		if (client._Annotations) this._annotations = new client._Annotations.RealtimeAnnotations(this);
		this.connectionManager = client.connection.connectionManager;
		this.state = "initialized";
		this.subscriptions = new eventemitter_default(this.logger);
		this.syncChannelSerial = void 0;
		this.properties = {
			attachSerial: void 0,
			channelSerial: void 0
		};
		this.setOptions(options);
		this.errorReason = null;
		this._attachResume = false;
		this._decodingContext = {
			channelOptions: this.channelOptions,
			plugins: client.options.plugins || {},
			baseEncodedPreviousPayload: void 0
		};
		this._lastPayload = {
			messageId: null,
			protocolMessageChannelSerial: null,
			decodeFailureRecoveryInProgress: null
		};
		this._allChannelChanges = new eventemitter_default(this.logger);
		if ((_b = client.options.plugins) == null ? void 0 : _b.Push) this._push = new client.options.plugins.Push.PushChannel(this);
		if ((_c = client.options.plugins) == null ? void 0 : _c.LiveObjects) this._object = new client.options.plugins.LiveObjects.RealtimeObject(this);
	}
	get presence() {
		if (!this._presence) throwMissingPluginError("RealtimePresence");
		return this._presence;
	}
	get annotations() {
		if (!this._annotations) throwMissingPluginError("Annotations");
		return this._annotations;
	}
	get push() {
		if (!this._push) throwMissingPluginError("Push");
		return this._push;
	}
	/** @spec RTL27 */
	get object() {
		if (!this._object) throwMissingPluginError("LiveObjects");
		return this._object;
	}
	invalidStateError() {
		return new ErrorInfo("Channel operation failed as channel state is " + this.state, 90001, 400, this.errorReason || void 0);
	}
	static processListenerArgs(args) {
		args = Array.prototype.slice.call(args);
		if (typeof args[0] === "function") args.unshift(null);
		return args;
	}
	async setOptions(options) {
		var _a2;
		const previousChannelOptions = this.channelOptions;
		const err = validateChannelOptions(options);
		if (err) throw err;
		this.channelOptions = normaliseChannelOptions((_a2 = this.client._Crypto) != null ? _a2 : null, this.logger, options);
		if (this._decodingContext) this._decodingContext.channelOptions = this.channelOptions;
		if (this._shouldReattachToSetOptions(options, previousChannelOptions)) {
			this.attachImpl();
			return new Promise((resolve, reject) => {
				this._allChannelChanges.once([
					"attached",
					"update",
					"detached",
					"failed"
				], function(stateChange) {
					switch (this.event) {
						case "update":
						case "attached":
							resolve();
							break;
						default: reject(stateChange.reason);
					}
				});
			});
		}
	}
	_shouldReattachToSetOptions(options, prevOptions) {
		if (!(this.state === "attached" || this.state === "attaching")) return false;
		if (options == null ? void 0 : options.params) {
			const requestedParams = omitAgent(options.params);
			const existingParams = omitAgent(prevOptions.params);
			if (Object.keys(requestedParams).length !== Object.keys(existingParams).length) return true;
			if (!shallowEquals(existingParams, requestedParams)) return true;
		}
		if (options == null ? void 0 : options.modes) {
			if (!prevOptions.modes || !arrEquals(options.modes, prevOptions.modes)) return true;
		}
		return false;
	}
	async publish(...args) {
		const first = args[0], second = args[1];
		let messages;
		let params;
		if (typeof first === "string" || first === null || first === void 0) {
			messages = [message_default.fromValues({
				name: first,
				data: second
			})];
			params = args[2];
		} else if (isObject(first)) {
			messages = [message_default.fromValues(first)];
			params = args[1];
		} else if (Array.isArray(first)) {
			messages = message_default.fromValuesArray(first);
			params = args[1];
		} else throw new ErrorInfo("The single-argument form of publish() expects a message object or an array of message objects", 40013, 400);
		const maxMessageSize = this.client.options.maxMessageSize;
		const wireMessages = await encodeArray(messages, this.channelOptions);
		const size = getMessagesSize(wireMessages);
		if (size > maxMessageSize) throw new ErrorInfo(`Maximum size of messages that can be published at once exceeded (was ${size} bytes; limit is ${maxMessageSize} bytes)`, 40009, 400);
		this.throwIfUnpublishableState();
		const pm = fromValues2({
			action: actions.MESSAGE,
			channel: this.name,
			messages: wireMessages,
			params: params ? stringifyValues(params) : void 0
		});
		return await this.sendMessage(pm) || { serials: [] };
	}
	throwIfUnpublishableState() {
		if (!this.connectionManager.activeState()) throw this.connectionManager.getError();
		if (this.state === "failed" || this.state === "suspended") throw this.invalidStateError();
	}
	onEvent(messages) {
		const subscriptions = this.subscriptions;
		for (let i = 0; i < messages.length; i++) {
			const message = messages[i];
			subscriptions.emit(message.name, message);
		}
	}
	async attach() {
		if (this.state === "attached") return null;
		return new Promise((resolve, reject) => {
			this._attach(false, null, (err, result) => err ? reject(err) : resolve(result));
		});
	}
	_attach(forceReattach, attachReason, callback) {
		if (!callback) callback = (err) => {
			if (err) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "RealtimeChannel._attach()", "Channel attach failed: " + err.toString());
		};
		const connectionManager = this.connectionManager;
		if (!connectionManager.activeState()) {
			callback(connectionManager.getError());
			return;
		}
		if (this.state !== "attaching" || forceReattach) this.requestState("attaching", attachReason);
		this.once(function(stateChange) {
			switch (this.event) {
				case "attached":
					callback?.(null, stateChange);
					break;
				case "detached":
				case "suspended":
				case "failed":
					callback?.(stateChange.reason || connectionManager.getError() || new ErrorInfo("Unable to attach; reason unknown; state = " + this.event, 9e4, 500));
					break;
				case "detaching":
					callback?.(new ErrorInfo("Attach request superseded by a subsequent detach request", 9e4, 409));
					break;
			}
		});
	}
	attachImpl() {
		const attachMsg = fromValues2({
			action: actions.ATTACH,
			channel: this.name,
			params: this.channelOptions.params,
			channelSerial: this.properties.channelSerial
		});
		if (this.channelOptions.modes) attachMsg.encodeModesToFlags(allToUpperCase(this.channelOptions.modes));
		if (this._attachResume) attachMsg.setFlag("ATTACH_RESUME");
		if (this._lastPayload.decodeFailureRecoveryInProgress) attachMsg.channelSerial = this._lastPayload.protocolMessageChannelSerial;
		this.sendMessage(attachMsg).catch(noop);
	}
	async detach() {
		const connectionManager = this.connectionManager;
		switch (this.state) {
			case "suspended":
				this.notifyState("detached");
				return;
			case "detached": return;
			case "failed": throw new ErrorInfo("Unable to detach; channel state = failed", 90001, 400);
			default:
				if (connectionManager.state.state !== "connected") {
					this.notifyState("detached");
					return;
				}
				this.requestState("detaching");
			case "detaching": return new Promise((resolve, reject) => {
				this.once(function(stateChange) {
					switch (this.event) {
						case "detached":
							resolve();
							break;
						case "attached":
						case "suspended":
						case "failed":
							reject(stateChange.reason || connectionManager.getError() || new ErrorInfo("Unable to detach; reason unknown; state = " + this.event, 9e4, 500));
							break;
						case "attaching":
							reject(new ErrorInfo("Detach request superseded by a subsequent attach request", 9e4, 409));
							break;
					}
				});
			});
		}
	}
	detachImpl() {
		const msg = fromValues2({
			action: actions.DETACH,
			channel: this.name
		});
		this.sendMessage(msg).catch(noop);
	}
	async subscribe(...args) {
		const [event, listener] = _RealtimeChannel.processListenerArgs(args);
		if (this.state === "failed") throw ErrorInfo.fromValues(this.invalidStateError());
		if (event && typeof event === "object" && !Array.isArray(event)) this.client._FilteredSubscriptions.subscribeFilter(this, event, listener);
		else this.subscriptions.on(event, listener);
		if (this.channelOptions.attachOnSubscribe !== false) return this.attach();
		else return null;
	}
	unsubscribe(...args) {
		var _a2;
		const [event, listener] = _RealtimeChannel.processListenerArgs(args);
		if (typeof event === "object" && !listener || ((_a2 = this.filteredSubscriptions) == null ? void 0 : _a2.has(listener))) {
			this.client._FilteredSubscriptions.getAndDeleteFilteredSubscriptions(this, event, listener).forEach((l) => this.subscriptions.off(l));
			return;
		}
		this.subscriptions.off(event, listener);
	}
	sync() {
		switch (this.state) {
			case "initialized":
			case "detaching":
			case "detached": throw new PartialErrorInfo("Unable to sync to channel; not attached", 4e4);
			default:
		}
		const connectionManager = this.connectionManager;
		if (!connectionManager.activeState()) throw connectionManager.getError();
		const syncMessage = fromValues2({
			action: actions.SYNC,
			channel: this.name
		});
		if (this.syncChannelSerial) syncMessage.channelSerial = this.syncChannelSerial;
		connectionManager.send(syncMessage);
	}
	async sendMessage(msg) {
		return new Promise((resolve, reject) => {
			this.connectionManager.send(msg, this.client.options.queueMessages, (err, publishResponse) => {
				if (err) reject(err);
				else resolve(publishResponse);
			});
		});
	}
	async sendPresence(presence) {
		const msg = fromValues2({
			action: actions.PRESENCE,
			channel: this.name,
			presence
		});
		await this.sendMessage(msg);
	}
	async sendState(objectMessages) {
		const msg = fromValues2({
			action: actions.OBJECT,
			channel: this.name,
			state: objectMessages
		});
		await this.sendMessage(msg);
	}
	async processMessage(message) {
		if (message.action === actions.ATTACHED || message.action === actions.MESSAGE || message.action === actions.PRESENCE || message.action === actions.OBJECT || message.action === actions.ANNOTATION) this.setChannelSerial(message.channelSerial);
		let syncChannelSerial, isSync = false;
		switch (message.action) {
			case actions.ATTACHED: {
				this.properties.attachSerial = message.channelSerial;
				this._mode = message.getMode();
				this.params = message.params || {};
				const modesFromFlags = message.decodeModesFromFlags();
				this.modes = modesFromFlags && allToLowerCase(modesFromFlags) || void 0;
				const resumed = message.hasFlag("RESUMED");
				const hasPresence = message.hasFlag("HAS_PRESENCE");
				const hasBacklog = message.hasFlag("HAS_BACKLOG");
				const hasObjects = message.hasFlag("HAS_OBJECTS");
				if (this.state === "attached") {
					if (!resumed) {
						if (this._presence) this._presence.onAttached(hasPresence);
						if (this._object) this._object.onAttached(hasObjects);
					}
					const change = new channelstatechange_default(this.state, this.state, resumed, hasBacklog, message.error);
					this._allChannelChanges.emit("update", change);
					if (!resumed || this.channelOptions.updateOnAttached) this.emit("update", change);
				} else if (this.state === "detaching") this.checkPendingState();
				else this.notifyState("attached", message.error, resumed, hasPresence, hasBacklog, hasObjects);
				break;
			}
			case actions.DETACHED: {
				const detachErr = message.error ? ErrorInfo.fromValues(message.error) : new ErrorInfo("Channel detached", 90001, 404);
				if (this.state === "detaching") this.notifyState("detached", detachErr);
				else if (this.state === "attaching") this.notifyState("suspended", detachErr);
				else if (this.state === "attached" || this.state === "suspended") this.requestState("attaching", detachErr);
				break;
			}
			case actions.SYNC:
				isSync = true;
				syncChannelSerial = this.syncChannelSerial = message.channelSerial;
				if (!message.presence) break;
			case actions.PRESENCE: {
				if (!message.presence) break;
				populateFieldsFromParent(message);
				const options = this.channelOptions;
				if (this._presence) {
					const presenceMessages = await Promise.all(message.presence.map((wpm) => {
						return wpm.decode(options, this.logger);
					}));
					this._presence.setPresence(presenceMessages, isSync, syncChannelSerial);
				}
				break;
			}
			case actions.OBJECT:
			case actions.OBJECT_SYNC: {
				if (!this._object || !message.state) return;
				populateFieldsFromParent(message);
				const format = this.client.connection.connectionManager.getActiveTransportFormat();
				const objectMessages = message.state.map((om) => om.decode(this.client, format));
				if (message.action === actions.OBJECT) this._object.handleObjectMessages(objectMessages);
				else this._object.handleObjectSyncMessages(objectMessages, message.channelSerial);
				break;
			}
			case actions.MESSAGE: {
				if (this.state !== "attached") return;
				populateFieldsFromParent(message);
				const encoded = message.messages, firstMessage = encoded[0], lastMessage = encoded[encoded.length - 1];
				if (firstMessage.extras && firstMessage.extras.delta && firstMessage.extras.delta.from !== this._lastPayload.messageId) {
					const msg = "Delta message decode failure - previous message not available for message \"" + message.id + "\" on this channel \"" + this.name + "\".";
					logger_default.logAction(this.logger, logger_default.LOG_ERROR, "RealtimeChannel.processMessage()", msg);
					this._startDecodeFailureRecovery(new ErrorInfo(msg, 40018, 400));
					break;
				}
				let messages = [];
				for (let i = 0; i < encoded.length; i++) {
					const { decoded, err } = await encoded[i].decodeWithErr(this._decodingContext, this.logger);
					messages[i] = decoded;
					if (err) switch (err.code) {
						case 40018:
							this._startDecodeFailureRecovery(err);
							return;
						case 40019:
						case 40021:
							this.notifyState("failed", err);
							return;
						default:
					}
				}
				this._lastPayload.messageId = lastMessage.id;
				this._lastPayload.protocolMessageChannelSerial = message.channelSerial;
				this.onEvent(messages);
				break;
			}
			case actions.ANNOTATION: {
				populateFieldsFromParent(message);
				const options = this.channelOptions;
				if (this._annotations) {
					const annotations = await Promise.all((message.annotations || []).map((wpm) => {
						return wpm.decode(options, this.logger);
					}));
					this._annotations._processIncoming(annotations);
				}
				break;
			}
			case actions.ERROR: {
				const err = message.error;
				if (err && err.code == 80016) this.checkPendingState();
				else this.notifyState("failed", ErrorInfo.fromValues(err));
				break;
			}
			default:
		}
	}
	_startDecodeFailureRecovery(reason) {
		if (!this._lastPayload.decodeFailureRecoveryInProgress) {
			this._lastPayload.decodeFailureRecoveryInProgress = true;
			this._attach(true, reason, () => {
				this._lastPayload.decodeFailureRecoveryInProgress = false;
			});
		}
	}
	onAttached() {}
	notifyState(state, reason, resumed, hasPresence, hasBacklog, hasObjects) {
		this.clearStateTimer();
		if ([
			"detached",
			"suspended",
			"failed"
		].includes(state)) this.properties.channelSerial = null;
		if (state === this.state) return;
		if (this._presence) this._presence.actOnChannelState(state, hasPresence, reason);
		if (this._object) this._object.actOnChannelState(state, hasObjects);
		if (state === "suspended" && this.connectionManager.state.sendEvents) this.startRetryTimer();
		else this.cancelRetryTimer();
		if (reason) this.errorReason = reason;
		const change = new channelstatechange_default(this.state, state, resumed, hasBacklog, reason);
		const action = "Channel state for channel \"" + this.name + "\"";
		const message = state + (reason ? "; reason: " + reason : "");
		if (state === "failed") logger_default.logAction(this.logger, logger_default.LOG_ERROR, action, message);
		if (state !== "attaching" && state !== "suspended") this.retryCount = 0;
		if (state === "attached") this.onAttached();
		if (state === "attached") this._attachResume = true;
		else if (state === "detaching" || state === "failed") this._attachResume = false;
		this.state = state;
		this._allChannelChanges.emit(state, change);
		this.emit(state, change);
	}
	requestState(state, reason) {
		this.notifyState(state, reason);
		this.checkPendingState();
	}
	checkPendingState() {
		if (!this.connectionManager.state.sendEvents) return;
		switch (this.state) {
			case "attaching":
				this.startStateTimerIfNotRunning();
				this.attachImpl();
				break;
			case "detaching":
				this.startStateTimerIfNotRunning();
				this.detachImpl();
				break;
			case "attached":
				this.sync();
				break;
			default: break;
		}
	}
	timeoutPendingState() {
		switch (this.state) {
			case "attaching": {
				const err = new ErrorInfo("Channel attach timed out", 90007, 408);
				this.notifyState("suspended", err);
				break;
			}
			case "detaching": {
				const err = new ErrorInfo("Channel detach timed out", 90007, 408);
				this.notifyState("attached", err);
				break;
			}
			default:
				this.checkPendingState();
				break;
		}
	}
	startStateTimerIfNotRunning() {
		if (!this.stateTimer) this.stateTimer = setTimeout(() => {
			this.stateTimer = null;
			this.timeoutPendingState();
		}, this.client.options.timeouts.realtimeRequestTimeout);
	}
	clearStateTimer() {
		const stateTimer = this.stateTimer;
		if (stateTimer) {
			clearTimeout(stateTimer);
			this.stateTimer = null;
		}
	}
	startRetryTimer() {
		if (this.retryTimer) return;
		this.retryCount++;
		const retryDelay = getRetryTime(this.client.options.timeouts.channelRetryTimeout, this.retryCount);
		this.retryTimer = setTimeout(() => {
			if (this.state === "suspended" && this.connectionManager.state.sendEvents) {
				this.retryTimer = null;
				this.requestState("attaching");
			}
		}, retryDelay);
	}
	cancelRetryTimer() {
		if (this.retryTimer) {
			clearTimeout(this.retryTimer);
			this.retryTimer = null;
		}
	}
	getReleaseErr() {
		const s = this.state;
		if (s === "initialized" || s === "detached" || s === "failed") return null;
		return new ErrorInfo("Can only release a channel in a state where there is no possibility of further updates from the server being received (initialized, detached, or failed); was " + s, 90001, 400);
	}
	setChannelSerial(channelSerial) {
		if (channelSerial) this.properties.channelSerial = channelSerial;
	}
	async status() {
		return this.client.rest.channelMixin.status(this);
	}
	async getMessage(serialOrMessage) {
		return this.client.rest.channelMixin.getMessage(this, serialOrMessage);
	}
	async updateMessage(message, operation, params) {
		return this.sendUpdate(message, "message.update", operation, params);
	}
	async deleteMessage(message, operation, params) {
		return this.sendUpdate(message, "message.delete", operation, params);
	}
	async appendMessage(message, operation, params) {
		return this.sendUpdate(message, "message.append", operation, params);
	}
	async sendUpdate(message, action, operation, params) {
		var _a2, _b;
		if (!message.serial) throw new ErrorInfo("This message lacks a serial and cannot be updated. Make sure you have enabled \"Message annotations, updates, and deletes\" in channel settings on your dashboard.", 40003, 400);
		this.throwIfUnpublishableState();
		const wireMessage = await message_default.fromValues(__spreadProps(__spreadValues({}, message), {
			action,
			version: operation
		})).encode(this.channelOptions);
		const pm = fromValues2({
			action: actions.MESSAGE,
			channel: this.name,
			messages: [wireMessage],
			params: params ? stringifyValues(params) : void 0
		});
		const publishResponse = await this.sendMessage(pm);
		return { versionSerial: (_b = (_a2 = publishResponse == null ? void 0 : publishResponse.serials) == null ? void 0 : _a2[0]) != null ? _b : null };
	}
	async getMessageVersions(serialOrMessage, params) {
		return this.client.rest.channelMixin.getMessageVersions(this, serialOrMessage, params);
	}
	/**
	* Ensures the channel is attached, attaching if necessary.
	*
	* This method is intended for use by features like Presence or Objects that need to
	* implicitly attach the channel when an operation is called (e.g., `presence.get()` per RTP11b,
	* or `objects.get()`). This guarantees that the corresponding sync sequence will start and
	* that the operation will resolve for callers even if they did not explicitly attach beforehand.
	*/
	async ensureAttached() {
		switch (this.state) {
			case "attached":
			case "suspended": break;
			case "initialized":
			case "detached":
			case "detaching":
			case "attaching":
				await this.attach();
				break;
			default: throw ErrorInfo.fromValues(this.invalidStateError());
		}
	}
};
function omitAgent(channelParams) {
	const _a2 = channelParams || {}, { agent: _ } = _a2;
	return __objRest(_a2, ["agent"]);
}
var realtimechannel_default = RealtimeChannel;
var serialize2 = encodeBody;
function toStringArray(array) {
	const result = [];
	if (array) for (let i = 0; i < array.length; i++) result.push(array[i].toString());
	return "[ " + result.join(", ") + " ]";
}
function deserialize(serialized, MsgPack, presenceMessagePlugin, annotationsPlugin, objectsPlugin, format) {
	return fromDeserialized(decodeBody(serialized, MsgPack, format), presenceMessagePlugin, annotationsPlugin, objectsPlugin);
}
function fromDeserialized(deserialized, presenceMessagePlugin, annotationsPlugin, objectsPlugin) {
	let error;
	if (deserialized.error) error = ErrorInfo.fromValues(deserialized.error);
	let messages;
	if (deserialized.messages) messages = WireMessage.fromValuesArray(deserialized.messages);
	let presence;
	if (presenceMessagePlugin && deserialized.presence) presence = presenceMessagePlugin.WirePresenceMessage.fromValuesArray(deserialized.presence);
	let annotations;
	if (annotationsPlugin && deserialized.annotations) annotations = annotationsPlugin.WireAnnotation.fromValuesArray(deserialized.annotations);
	let state;
	if (objectsPlugin && deserialized.state) state = objectsPlugin.WireObjectMessage.fromValuesArray(deserialized.state, utils_exports, MessageEncoding);
	return Object.assign(new ProtocolMessage2(), __spreadProps(__spreadValues({}, deserialized), {
		presence,
		messages,
		annotations,
		state,
		error
	}));
}
function fromValues2(values) {
	return Object.assign(new ProtocolMessage2(), values);
}
function stringify(msg, presenceMessagePlugin, annotationsPlugin, objectsPlugin) {
	let result = "[ProtocolMessage";
	if (msg.action !== void 0) result += "; action=" + ActionName[msg.action] || msg.action;
	const simpleAttributes = [
		"id",
		"channel",
		"channelSerial",
		"connectionId",
		"count",
		"msgSerial",
		"timestamp"
	];
	let attribute;
	for (let attribIndex = 0; attribIndex < simpleAttributes.length; attribIndex++) {
		attribute = simpleAttributes[attribIndex];
		if (msg[attribute] !== void 0) result += "; " + attribute + "=" + msg[attribute];
	}
	if (msg.messages) result += "; messages=" + toStringArray(WireMessage.fromValuesArray(msg.messages));
	if (msg.presence && presenceMessagePlugin) result += "; presence=" + toStringArray(presenceMessagePlugin.WirePresenceMessage.fromValuesArray(msg.presence));
	if (msg.annotations && annotationsPlugin) result += "; annotations=" + toStringArray(annotationsPlugin.WireAnnotation.fromValuesArray(msg.annotations));
	if (msg.state && objectsPlugin) result += "; state=" + toStringArray(objectsPlugin.WireObjectMessage.fromValuesArray(msg.state, utils_exports, MessageEncoding));
	if (msg.error) result += "; error=" + ErrorInfo.fromValues(msg.error).toString();
	if (msg.auth && msg.auth.accessToken) result += "; token=" + msg.auth.accessToken;
	if (msg.flags) result += "; flags=" + flagNames.filter(msg.hasFlag).join(",");
	if (msg.params) {
		let stringifiedParams = "";
		forInOwnNonNullProperties(msg.params, function(prop) {
			if (stringifiedParams.length > 0) stringifiedParams += "; ";
			stringifiedParams += prop + "=" + msg.params[prop];
		});
		if (stringifiedParams.length > 0) result += "; params=[" + stringifiedParams + "]";
	}
	result += "]";
	return result;
}
var ProtocolMessage2 = class {
	constructor() {
		this.hasFlag = (flag) => {
			return (this.flags & flags[flag]) > 0;
		};
	}
	setFlag(flag) {
		return this.flags = this.flags | flags[flag];
	}
	getMode() {
		return (this.flags || 0) & flags.MODE_ALL;
	}
	encodeModesToFlags(modes) {
		modes.forEach((mode) => this.setFlag(mode));
	}
	decodeModesFromFlags() {
		const modes = [];
		channelModes.forEach((mode) => {
			if (this.hasFlag(mode)) modes.push(mode);
		});
		return modes.length > 0 ? modes : void 0;
	}
};
var MessageQueue = class extends eventemitter_default {
	constructor(logger) {
		super(logger);
		this.messages = [];
	}
	count() {
		return this.messages.length;
	}
	push(message) {
		this.messages.push(message);
	}
	shift() {
		return this.messages.shift();
	}
	last() {
		return this.messages[this.messages.length - 1];
	}
	copyAll() {
		return this.messages.slice();
	}
	append(messages) {
		this.messages.push.apply(this.messages, messages);
	}
	prepend(messages) {
		this.messages.unshift.apply(this.messages, messages);
	}
	/**
	* For all messages targeted by the selector, calls their callback and removes them from the queue.
	*
	* @param selector - Describes which messages to target. 'all' means all messages in the queue (regardless of whether they have had a `msgSerial` assigned); `serial` / `count` targets a range of messages described by an `ACK` or `NACK` received from Ably (this assumes that all the messages in the queue have had a `msgSerial` assigned).
	*/
	completeMessages(selector, err, res) {
		err = err || null;
		const messages = this.messages;
		if (messages.length === 0) throw new Error("MessageQueue.completeMessages(): completeMessages called on any empty MessageQueue");
		let completeMessages = [];
		if (selector === "all") completeMessages = messages.splice(0);
		else {
			const first = messages[0];
			if (first) {
				const startSerial = first.message.msgSerial;
				const endSerial = selector.serial + selector.count;
				if (endSerial > startSerial) completeMessages = messages.splice(0, endSerial - startSerial);
			}
		}
		for (let i = 0; i < completeMessages.length; i++) {
			const message = completeMessages[i];
			const publishResponse = res == null ? void 0 : res[i];
			message.callback(err, publishResponse);
		}
		if (messages.length == 0) this.emit("idle");
	}
	completeAllMessages(err) {
		this.completeMessages("all", err);
	}
	resetSendAttempted() {
		for (let msg of this.messages) msg.sendAttempted = false;
	}
	clear() {
		this.messages = [];
		this.emit("idle");
	}
};
var messagequeue_default = MessageQueue;
var PendingMessage = class {
	constructor(message, callback) {
		this.message = message;
		this.callback = callback;
		this.merged = false;
		const action = message.action;
		this.sendAttempted = false;
		this.ackRequired = typeof action === "number" && [
			actions.MESSAGE,
			actions.PRESENCE,
			actions.ANNOTATION,
			actions.OBJECT
		].includes(action);
	}
};
var Protocol = class extends eventemitter_default {
	constructor(transport) {
		super(transport.logger);
		this.transport = transport;
		this.messageQueue = new messagequeue_default(this.logger);
		transport.on("ack", (serial, count, res) => {
			this.onAck(serial, count, res);
		});
		transport.on("nack", (serial, count, err) => {
			this.onNack(serial, count, err);
		});
	}
	onAck(serial, count, res) {
		this.messageQueue.completeMessages({
			serial,
			count
		}, null, res);
	}
	onNack(serial, count, err) {
		logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Protocol.onNack()", "serial = " + serial + "; count = " + count + "; err = " + inspectError(err));
		if (!err) err = new ErrorInfo("Unable to send message; channel not responding", 50001, 500);
		this.messageQueue.completeMessages({
			serial,
			count
		}, err);
	}
	onceIdle(listener) {
		const messageQueue = this.messageQueue;
		if (messageQueue.count() === 0) {
			listener();
			return;
		}
		messageQueue.once("idle", listener);
	}
	send(pendingMessage) {
		if (pendingMessage.ackRequired) this.messageQueue.push(pendingMessage);
		if (this.logger.shouldLog(logger_default.LOG_MICRO)) logger_default.logActionNoStrip(this.logger, logger_default.LOG_MICRO, "Protocol.send()", "sending msg; " + stringify(pendingMessage.message, this.transport.connectionManager.realtime._RealtimePresence, this.transport.connectionManager.realtime._Annotations, this.transport.connectionManager.realtime._liveObjectsPlugin));
		pendingMessage.sendAttempted = true;
		this.transport.send(pendingMessage.message);
	}
	getTransport() {
		return this.transport;
	}
	getPendingMessages() {
		return this.messageQueue.copyAll();
	}
	clearPendingMessages() {
		return this.messageQueue.clear();
	}
	finish() {
		const transport = this.transport;
		this.onceIdle(function() {
			transport.disconnect();
		});
	}
};
var protocol_default = Protocol;
var ConnectionStateChange = class {
	constructor(previous, current, retryIn, reason) {
		this.previous = previous;
		this.current = current;
		if (retryIn) this.retryIn = retryIn;
		if (reason) this.reason = reason;
	}
};
var connectionstatechange_default = ConnectionStateChange;
var ConnectionErrorCodes = {
	DISCONNECTED: 80003,
	SUSPENDED: 80002,
	FAILED: 8e4,
	CLOSING: 80017,
	CLOSED: 80017,
	UNKNOWN_CONNECTION_ERR: 50002,
	UNKNOWN_CHANNEL_ERR: 50001
};
var ConnectionErrors = {
	disconnected: () => ErrorInfo.fromValues({
		statusCode: 400,
		code: ConnectionErrorCodes.DISCONNECTED,
		message: "Connection to server temporarily unavailable"
	}),
	suspended: () => ErrorInfo.fromValues({
		statusCode: 400,
		code: ConnectionErrorCodes.SUSPENDED,
		message: "Connection to server unavailable"
	}),
	failed: () => ErrorInfo.fromValues({
		statusCode: 400,
		code: ConnectionErrorCodes.FAILED,
		message: "Connection failed or disconnected by server"
	}),
	closing: () => ErrorInfo.fromValues({
		statusCode: 400,
		code: ConnectionErrorCodes.CLOSING,
		message: "Connection closing"
	}),
	closed: () => ErrorInfo.fromValues({
		statusCode: 400,
		code: ConnectionErrorCodes.CLOSED,
		message: "Connection closed"
	}),
	unknownConnectionErr: () => ErrorInfo.fromValues({
		statusCode: 500,
		code: ConnectionErrorCodes.UNKNOWN_CONNECTION_ERR,
		message: "Internal connection error"
	}),
	unknownChannelErr: () => ErrorInfo.fromValues({
		statusCode: 500,
		code: ConnectionErrorCodes.UNKNOWN_CONNECTION_ERR,
		message: "Internal channel error"
	})
};
function isRetriable(err) {
	if (!err.statusCode || !err.code || err.statusCode >= 500) return true;
	return Object.values(ConnectionErrorCodes).includes(err.code);
}
var connectionerrors_default = ConnectionErrors;
var closeMessage = fromValues2({ action: actions.CLOSE });
var disconnectMessage = fromValues2({ action: actions.DISCONNECT });
var Transport = class extends eventemitter_default {
	constructor(connectionManager, auth, params, forceJsonProtocol) {
		super(connectionManager.logger);
		if (forceJsonProtocol) {
			params.format = void 0;
			params.heartbeats = true;
		}
		this.connectionManager = connectionManager;
		this.auth = auth;
		this.params = params;
		this.timeouts = params.options.timeouts;
		this.format = params.format;
		this.isConnected = false;
		this.isFinished = false;
		this.isDisposed = false;
		this.maxIdleInterval = null;
		this.idleTimer = null;
		this.lastActivity = null;
	}
	connect() {}
	close() {
		if (this.isConnected) this.requestClose();
		this.finish("closed", connectionerrors_default.closed());
	}
	disconnect(err) {
		if (this.isConnected) this.requestDisconnect();
		this.finish("disconnected", err || connectionerrors_default.disconnected());
	}
	fail(err) {
		if (this.isConnected) this.requestDisconnect();
		this.finish("failed", err || connectionerrors_default.failed());
	}
	finish(event, err) {
		var _a2;
		if (this.isFinished) return;
		this.isFinished = true;
		this.isConnected = false;
		this.maxIdleInterval = null;
		clearTimeout((_a2 = this.idleTimer) != null ? _a2 : void 0);
		this.idleTimer = null;
		this.emit(event, err);
		this.dispose();
	}
	onProtocolMessage(message) {
		if (this.logger.shouldLog(logger_default.LOG_MICRO)) logger_default.logActionNoStrip(this.logger, logger_default.LOG_MICRO, "Transport.onProtocolMessage()", "received on " + this.shortName + ": " + stringify(message, this.connectionManager.realtime._RealtimePresence, this.connectionManager.realtime._Annotations, this.connectionManager.realtime._liveObjectsPlugin) + "; connectionId = " + this.connectionManager.connectionId);
		this.onActivity();
		switch (message.action) {
			case actions.HEARTBEAT:
				logger_default.logActionNoStrip(this.logger, logger_default.LOG_MICRO, "Transport.onProtocolMessage()", this.shortName + " heartbeat; connectionId = " + this.connectionManager.connectionId);
				this.emit("heartbeat", message.id);
				break;
			case actions.CONNECTED:
				this.onConnect(message);
				this.emit("connected", message.error, message.connectionId, message.connectionDetails, message);
				break;
			case actions.CLOSED:
				this.onClose(message);
				break;
			case actions.DISCONNECTED:
				this.onDisconnect(message);
				break;
			case actions.ACK:
				this.emit("ack", message.msgSerial, message.count, message.res);
				break;
			case actions.NACK:
				this.emit("nack", message.msgSerial, message.count, message.error);
				break;
			case actions.SYNC:
				this.connectionManager.onChannelMessage(message, this);
				break;
			case actions.ACTIVATE: break;
			case actions.AUTH:
				whenPromiseSettles(this.auth.authorize(), (err) => {
					if (err) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Transport.onProtocolMessage()", "Ably requested re-authentication, but unable to obtain a new token: " + inspectError(err));
				});
				break;
			case actions.ERROR:
				if (message.channel === void 0) {
					this.onFatalError(message);
					break;
				}
				this.connectionManager.onChannelMessage(message, this);
				break;
			default: this.connectionManager.onChannelMessage(message, this);
		}
	}
	onConnect(message) {
		this.isConnected = true;
		if (!message.connectionDetails) throw new Error("Transport.onConnect(): Connect message recieved without connectionDetails");
		const maxPromisedIdle = message.connectionDetails.maxIdleInterval;
		if (maxPromisedIdle) {
			this.maxIdleInterval = maxPromisedIdle + this.timeouts.realtimeRequestTimeout;
			this.onActivity();
		}
	}
	onDisconnect(message) {
		const err = message && message.error;
		this.finish("disconnected", err);
	}
	onFatalError(message) {
		const err = message && message.error;
		this.finish("failed", err);
	}
	onClose(message) {
		const err = message && message.error;
		this.finish("closed", err);
	}
	requestClose() {
		this.send(closeMessage);
	}
	requestDisconnect() {
		this.send(disconnectMessage);
	}
	ping(id) {
		const msg = { action: actions.HEARTBEAT };
		if (id) msg.id = id;
		this.send(fromValues2(msg));
	}
	dispose() {
		this.isDisposed = true;
		this.off();
	}
	onActivity() {
		if (!this.maxIdleInterval) return;
		this.lastActivity = this.connectionManager.lastActivity = Date.now();
		this.setIdleTimer(this.maxIdleInterval + 100);
	}
	setIdleTimer(timeout) {
		if (!this.idleTimer) this.idleTimer = setTimeout(() => {
			this.onIdleTimerExpire();
		}, timeout);
	}
	onIdleTimerExpire() {
		if (!this.lastActivity || !this.maxIdleInterval) throw new Error("Transport.onIdleTimerExpire(): lastActivity/maxIdleInterval not set");
		this.idleTimer = null;
		const sinceLast = Date.now() - this.lastActivity;
		const timeRemaining = this.maxIdleInterval - sinceLast;
		if (timeRemaining <= 0) {
			const msg = "No activity seen from realtime in " + sinceLast + "ms; assuming connection has dropped";
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Transport.onIdleTimerExpire()", msg);
			this.disconnect(new ErrorInfo(msg, 80003, 408));
		} else this.setIdleTimer(timeRemaining + 100);
	}
	static tryConnect(transportCtor, connectionManager, auth, transportParams, callback) {
		const transport = new transportCtor(connectionManager, auth, transportParams);
		let transportAttemptTimer;
		const errorCb = function(err) {
			clearTimeout(transportAttemptTimer);
			callback({
				event: this.event,
				error: err
			});
		};
		const realtimeRequestTimeout = connectionManager.options.timeouts.realtimeRequestTimeout;
		transportAttemptTimer = setTimeout(() => {
			transport.off([
				"preconnect",
				"disconnected",
				"failed"
			]);
			transport.dispose();
			errorCb.call({ event: "disconnected" }, new ErrorInfo("Timeout waiting for transport to indicate itself viable", 5e4, 500));
		}, realtimeRequestTimeout);
		transport.on(["failed", "disconnected"], errorCb);
		transport.on("preconnect", function() {
			clearTimeout(transportAttemptTimer);
			transport.off(["failed", "disconnected"], errorCb);
			callback(null, transport);
		});
		transport.connect();
		return transport;
	}
	static isAvailable() {
		throw new ErrorInfo("isAvailable not implemented for transport", 5e4, 500);
	}
};
var transport_default = Transport;
var TransportNames;
((TransportNames2) => {
	TransportNames2.WebSocket = "web_socket";
	TransportNames2.Comet = "comet";
	TransportNames2.XhrPolling = "xhr_polling";
})(TransportNames || (TransportNames = {}));
var globalObject2 = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : self;
var haveWebStorage = () => {
	var _a2;
	return typeof Platform.WebStorage !== "undefined" && ((_a2 = Platform.WebStorage) == null ? void 0 : _a2.localSupported);
};
var haveSessionStorage = () => {
	var _a2;
	return typeof Platform.WebStorage !== "undefined" && ((_a2 = Platform.WebStorage) == null ? void 0 : _a2.sessionSupported);
};
var noop2 = function() {};
var transportPreferenceName = "ably-transport-preference";
function decodeRecoveryKey(recoveryKey) {
	try {
		return JSON.parse(recoveryKey);
	} catch (e) {
		return null;
	}
}
var TransportParams = class {
	constructor(options, host, mode, connectionKey) {
		this.options = options;
		this.host = host;
		this.mode = mode;
		this.connectionKey = connectionKey;
		this.format = options.useBinaryProtocol ? "msgpack" : "json";
	}
	getConnectParams(authParams) {
		const params = authParams ? copy(authParams) : {};
		const options = this.options;
		switch (this.mode) {
			case "resume":
				params.resume = this.connectionKey;
				break;
			case "recover": {
				const recoveryContext = decodeRecoveryKey(options.recover);
				if (recoveryContext) params.recover = recoveryContext.connectionKey;
				break;
			}
			default:
		}
		if (options.clientId !== void 0) params.clientId = options.clientId;
		if (options.echoMessages === false) params.echo = "false";
		if (this.format !== void 0) params.format = this.format;
		if (this.stream !== void 0) params.stream = this.stream;
		if (this.heartbeats !== void 0) params.heartbeats = this.heartbeats;
		params.v = defaults_default.protocolVersion;
		params.agent = getAgentString(this.options);
		if (options.transportParams !== void 0) mixin(params, options.transportParams);
		return params;
	}
	toString() {
		let result = "[mode=" + this.mode;
		if (this.host) result += ",host=" + this.host;
		if (this.connectionKey) result += ",connectionKey=" + this.connectionKey;
		if (this.format) result += ",format=" + this.format;
		result += "]";
		return result;
	}
};
var connectionmanager_default = class _ConnectionManager extends eventemitter_default {
	constructor(realtime, options) {
		super(realtime.logger);
		this.supportedTransports = {};
		this.disconnectedRetryCount = 0;
		this.pendingChannelMessagesState = {
			isProcessing: false,
			queue: []
		};
		this.realtime = realtime;
		this.initTransports();
		this.options = options;
		const timeouts = options.timeouts;
		const connectingTimeout = timeouts.webSocketConnectTimeout + timeouts.realtimeRequestTimeout;
		this.states = {
			initialized: {
				state: "initialized",
				terminal: false,
				queueEvents: true,
				sendEvents: false,
				failState: "disconnected"
			},
			connecting: {
				state: "connecting",
				terminal: false,
				queueEvents: true,
				sendEvents: false,
				retryDelay: connectingTimeout,
				failState: "disconnected"
			},
			connected: {
				state: "connected",
				terminal: false,
				queueEvents: false,
				sendEvents: true,
				failState: "disconnected"
			},
			disconnected: {
				state: "disconnected",
				terminal: false,
				queueEvents: true,
				sendEvents: false,
				retryDelay: timeouts.disconnectedRetryTimeout,
				failState: "disconnected"
			},
			suspended: {
				state: "suspended",
				terminal: false,
				queueEvents: false,
				sendEvents: false,
				retryDelay: timeouts.suspendedRetryTimeout,
				failState: "suspended"
			},
			closing: {
				state: "closing",
				terminal: false,
				queueEvents: false,
				sendEvents: false,
				retryDelay: timeouts.realtimeRequestTimeout,
				failState: "closed"
			},
			closed: {
				state: "closed",
				terminal: true,
				queueEvents: false,
				sendEvents: false,
				failState: "closed"
			},
			failed: {
				state: "failed",
				terminal: true,
				queueEvents: false,
				sendEvents: false,
				failState: "failed"
			}
		};
		this.state = this.states.initialized;
		this.errorReason = null;
		this.queuedMessages = new messagequeue_default(this.logger);
		this.msgSerial = 0;
		this.connectionDetails = void 0;
		this.connectionId = void 0;
		this.connectionKey = void 0;
		this.connectionStateTtl = timeouts.connectionStateTtl;
		this.maxIdleInterval = null;
		this.transports = intersect(options.transports || defaults_default.defaultTransports, this.supportedTransports);
		this.transportPreference = null;
		if (this.transports.includes(TransportNames.WebSocket)) this.webSocketTransportAvailable = true;
		if (this.transports.includes(TransportNames.XhrPolling)) this.baseTransport = TransportNames.XhrPolling;
		else if (this.transports.includes(TransportNames.Comet)) this.baseTransport = TransportNames.Comet;
		this.domains = defaults_default.getHosts(options);
		this.activeProtocol = null;
		this.host = null;
		this.lastAutoReconnectAttempt = null;
		this.lastActivity = null;
		this.forceFallbackHost = false;
		this.connectCounter = 0;
		this.wsCheckResult = null;
		this.webSocketSlowTimer = null;
		this.webSocketGiveUpTimer = null;
		this.abandonedWebSocket = false;
		if (!this.transports.length) {
			const msg = "no requested transports available";
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "realtime.ConnectionManager()", msg);
			throw new Error(msg);
		}
		const addEventListener = Platform.Config.addEventListener;
		if (addEventListener) {
			if (haveSessionStorage() && typeof options.recover === "function") addEventListener("beforeunload", this.persistConnection.bind(this));
			if (options.closeOnUnload === true) addEventListener("beforeunload", () => {
				this.requestState({ state: "closing" });
			});
			addEventListener("online", () => {
				var _a2;
				if (this.state == this.states.disconnected || this.state == this.states.suspended) this.requestState({ state: "connecting" });
				else if (this.state == this.states.connecting) {
					(_a2 = this.pendingTransport) == null || _a2.off();
					this.disconnectAllTransports();
					this.startConnect();
				}
			});
			addEventListener("offline", () => {
				if (this.state == this.states.connected) this.disconnectAllTransports();
			});
		}
	}
	/*********************
	* transport management
	*********************/
	static supportedTransports(additionalImplementations) {
		const storage = { supportedTransports: {} };
		this.initTransports(additionalImplementations, storage);
		return storage.supportedTransports;
	}
	static initTransports(additionalImplementations, storage) {
		const implementations = __spreadValues(__spreadValues({}, Platform.Transports.bundledImplementations), additionalImplementations);
		[TransportNames.WebSocket, ...Platform.Transports.order].forEach((transportName) => {
			const transport = implementations[transportName];
			if (transport && transport.isAvailable()) storage.supportedTransports[transportName] = transport;
		});
	}
	initTransports() {
		_ConnectionManager.initTransports(this.realtime._additionalTransportImplementations, this);
	}
	createTransportParams(host, mode) {
		return new TransportParams(this.options, host, mode, this.connectionKey);
	}
	getTransportParams(callback) {
		const decideMode = (modeCb) => {
			if (this.connectionKey) {
				modeCb("resume");
				return;
			}
			if (typeof this.options.recover === "string") {
				modeCb("recover");
				return;
			}
			const recoverFn = this.options.recover, lastSessionData = this.getSessionRecoverData();
			this.sessionRecoveryName();
			if (lastSessionData && typeof recoverFn === "function") {
				recoverFn(lastSessionData, (shouldRecover) => {
					if (shouldRecover) {
						this.options.recover = lastSessionData.recoveryKey;
						modeCb("recover");
					} else modeCb("clean");
				});
				return;
			}
			modeCb("clean");
		};
		decideMode((mode) => {
			const transportParams = this.createTransportParams(null, mode);
			if (mode === "recover") {
				const recoveryContext = decodeRecoveryKey(this.options.recover);
				if (recoveryContext) this.msgSerial = recoveryContext.msgSerial;
			}
			callback(transportParams);
		});
	}
	/**
	* Attempt to connect using a given transport
	* @param transportParams
	* @param candidate, the transport to try
	* @param callback
	*/
	tryATransport(transportParams, candidate, callback) {
		this.proposedTransport = transport_default.tryConnect(this.supportedTransports[candidate], this, this.realtime.auth, transportParams, (wrappedErr, transport) => {
			const state = this.state;
			if (state == this.states.closing || state == this.states.closed || state == this.states.failed) {
				if (transport) transport.close();
				callback(true);
				return;
			}
			if (wrappedErr) {
				if (auth_default.isTokenErr(wrappedErr.error) && !(this.errorReason && auth_default.isTokenErr(this.errorReason))) {
					this.errorReason = wrappedErr.error;
					whenPromiseSettles(this.realtime.auth._forceNewToken(null, null), (err) => {
						if (err) {
							this.actOnErrorFromAuthorize(err);
							return;
						}
						this.tryATransport(transportParams, candidate, callback);
					});
				} else if (wrappedErr.event === "failed") {
					this.notifyState({
						state: "failed",
						error: wrappedErr.error
					});
					callback(true);
				} else if (wrappedErr.event === "disconnected") if (!isRetriable(wrappedErr.error)) {
					this.notifyState({
						state: this.states.connecting.failState,
						error: wrappedErr.error
					});
					callback(true);
				} else callback(false);
				return;
			}
			this.setTransportPending(transport, transportParams);
			callback(null, transport);
		});
	}
	/**
	* Called when a transport is indicated to be viable, and the ConnectionManager
	* expects to activate this transport as soon as it is connected.
	* @param transport
	* @param transportParams
	*/
	setTransportPending(transport, transportParams) {
		const mode = transportParams.mode;
		this.pendingTransport = transport;
		this.cancelWebSocketSlowTimer();
		this.cancelWebSocketGiveUpTimer();
		transport.once("connected", (error, connectionId, connectionDetails) => {
			this.activateTransport(error, transport, connectionId, connectionDetails);
			if (mode === "recover" && this.options.recover) {
				delete this.options.recover;
				this.unpersistConnection();
			}
		});
		const self2 = this;
		transport.on([
			"disconnected",
			"closed",
			"failed"
		], function(error) {
			self2.deactivateTransport(transport, this.event, error);
		});
		this.emit("transport.pending", transport);
	}
	/**
	* Called when a transport is connected, and the connectionmanager decides that
	* it will now be the active transport. Returns whether or not it activated
	* the transport (if the connection is closing/closed it will choose not to).
	* @param transport the transport instance
	* @param connectionId the id of the new active connection
	* @param connectionDetails the details of the new active connection
	*/
	activateTransport(error, transport, connectionId, connectionDetails) {
		if (error) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.activateTransport()", "error = " + error);
		if (connectionId) {}
		if (connectionDetails) {}
		this.persistTransportPreference(transport);
		const existingState = this.state, connectedState = this.states.connected.state;
		if (existingState.state == this.states.closing.state || existingState.state == this.states.closed.state || existingState.state == this.states.failed.state) {
			transport.disconnect();
			return false;
		}
		delete this.pendingTransport;
		if (!transport.isConnected) return false;
		const existingActiveProtocol = this.activeProtocol;
		this.activeProtocol = new protocol_default(transport);
		this.host = transport.params.host;
		const connectionKey = connectionDetails.connectionKey;
		if (connectionKey && this.connectionKey != connectionKey) this.setConnection(connectionId, connectionDetails, !!error);
		this.onConnectionDetailsUpdate(connectionDetails, transport);
		Platform.Config.nextTick(() => {
			transport.on("connected", (connectedErr, _connectionId, connectionDetails2) => {
				this.onConnectionDetailsUpdate(connectionDetails2, transport);
				this.emit("update", new connectionstatechange_default(connectedState, connectedState, null, connectedErr));
			});
		});
		if (existingState.state === this.states.connected.state) {
			if (error) {
				this.errorReason = this.realtime.connection.errorReason = error;
				this.emit("update", new connectionstatechange_default(connectedState, connectedState, null, error));
			}
		} else {
			this.notifyState({
				state: "connected",
				error
			});
			this.errorReason = this.realtime.connection.errorReason = error || null;
		}
		this.emit("transport.active", transport);
		if (existingActiveProtocol) {
			if (existingActiveProtocol.messageQueue.count() > 0) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.activateTransport()", "Previous active protocol (for transport " + existingActiveProtocol.transport.shortName + ", new one is " + transport.shortName + ") finishing with " + existingActiveProtocol.messageQueue.count() + " messages still pending");
			if (existingActiveProtocol.transport === transport) {
				const msg = "Assumption violated: activating a transport that was also the transport for the previous active protocol; transport = " + transport.shortName + "; stack = " + (/* @__PURE__ */ new Error()).stack;
				logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.activateTransport()", msg);
			} else existingActiveProtocol.finish();
		}
		return true;
	}
	/**
	* Called when a transport is no longer the active transport. This can occur
	* in any transport connection state.
	* @param transport
	*/
	deactivateTransport(transport, state, error) {
		const currentProtocol = this.activeProtocol, wasActive = currentProtocol && currentProtocol.getTransport() === transport, wasPending = transport === this.pendingTransport, noTransportsScheduledForActivation = this.noTransportsScheduledForActivation();
		if (error && error.message) {}
		if (wasActive) {
			this.queuePendingMessages(currentProtocol.getPendingMessages());
			currentProtocol.clearPendingMessages();
			this.activeProtocol = this.host = null;
		}
		this.emit("transport.inactive", transport);
		if (wasActive && noTransportsScheduledForActivation || wasActive && state === "failed" || state === "closed" || currentProtocol === null && wasPending) {
			if (state === "disconnected" && error && error.statusCode > 500 && this.domains.length > 1) {
				this.unpersistTransportPreference();
				this.forceFallbackHost = true;
				this.notifyState({
					state,
					error,
					retryImmediately: true
				});
				return;
			}
			const newConnectionState = state === "failed" && auth_default.isTokenErr(error) ? "disconnected" : state;
			this.notifyState({
				state: newConnectionState,
				error
			});
			return;
		}
	}
	noTransportsScheduledForActivation() {
		return !this.pendingTransport || !this.pendingTransport.isConnected;
	}
	setConnection(connectionId, connectionDetails, hasConnectionError) {
		const prevConnId = this.connectionId;
		if (prevConnId && prevConnId !== connectionId || !prevConnId && hasConnectionError) {
			this.msgSerial = 0;
			this.queuedMessages.resetSendAttempted();
		}
		if (this.connectionId !== connectionId) {}
		this.realtime.connection.id = this.connectionId = connectionId;
		this.realtime.connection.key = this.connectionKey = connectionDetails.connectionKey;
	}
	clearConnection() {
		this.realtime.connection.id = this.connectionId = void 0;
		this.realtime.connection.key = this.connectionKey = void 0;
		this.msgSerial = 0;
		this.queuedMessages.resetSendAttempted();
		this.unpersistConnection();
	}
	createRecoveryKey() {
		if (!this.connectionKey) return null;
		return JSON.stringify({
			connectionKey: this.connectionKey,
			msgSerial: this.msgSerial,
			channelSerials: this.realtime.channels.channelSerials()
		});
	}
	checkConnectionStateFreshness() {
		if (!this.lastActivity || !this.connectionId) return;
		if (Date.now() - this.lastActivity > this.connectionStateTtl + this.maxIdleInterval) {
			this.clearConnection();
			this.states.connecting.failState = "suspended";
		}
	}
	/**
	* Called when the connectionmanager wants to persist transport
	* state for later recovery. Only applicable in the browser context.
	*/
	persistConnection() {
		if (haveSessionStorage()) {
			const recoveryKey = this.createRecoveryKey();
			if (recoveryKey) this.setSessionRecoverData({
				recoveryKey,
				disconnectedAt: Date.now(),
				location: globalObject2.location,
				clientId: this.realtime.auth.clientId
			});
		}
	}
	/**
	* Called when the connectionmanager wants to persist transport
	* state for later recovery. Only applicable in the browser context.
	*/
	unpersistConnection() {
		this.clearSessionRecoverData();
	}
	getActiveTransportFormat() {
		var _a2;
		return (_a2 = this.activeProtocol) == null ? void 0 : _a2.getTransport().format;
	}
	/*********************
	* state management
	*********************/
	getError() {
		if (this.errorReason) {
			const newError = PartialErrorInfo.fromValues(this.errorReason);
			newError.cause = this.errorReason;
			return newError;
		}
		return this.getStateError();
	}
	getStateError() {
		var _a2, _b;
		return (_b = (_a2 = connectionerrors_default)[this.state.state]) == null ? void 0 : _b.call(_a2);
	}
	activeState() {
		return this.state.queueEvents || this.state.sendEvents;
	}
	enactStateChange(stateChange) {
		const action = "Connection state";
		const message = stateChange.current + (stateChange.reason ? "; reason: " + stateChange.reason : "");
		if (stateChange.current === "failed") logger_default.logAction(this.logger, logger_default.LOG_ERROR, action, message);
		const newState = this.state = this.states[stateChange.current];
		if (stateChange.reason) {
			this.errorReason = stateChange.reason;
			this.realtime.connection.errorReason = stateChange.reason;
		}
		if (newState.terminal || newState.state === "suspended") this.clearConnection();
		this.emit("connectionstate", stateChange);
	}
	/****************************************
	* ConnectionManager connection lifecycle
	****************************************/
	startTransitionTimer(transitionState) {
		if (this.transitionTimer) clearTimeout(this.transitionTimer);
		this.transitionTimer = setTimeout(() => {
			if (this.transitionTimer) {
				this.transitionTimer = null;
				this.notifyState({ state: transitionState.failState });
			}
		}, transitionState.retryDelay);
	}
	cancelTransitionTimer() {
		if (this.transitionTimer) {
			clearTimeout(this.transitionTimer);
			this.transitionTimer = null;
		}
	}
	startSuspendTimer() {
		if (this.suspendTimer) return;
		this.suspendTimer = setTimeout(() => {
			if (this.suspendTimer) {
				this.suspendTimer = null;
				this.states.connecting.failState = "suspended";
				this.notifyState({ state: "suspended" });
			}
		}, this.connectionStateTtl);
	}
	checkSuspendTimer(state) {
		if (state !== "disconnected" && state !== "suspended" && state !== "connecting") this.cancelSuspendTimer();
	}
	cancelSuspendTimer() {
		this.states.connecting.failState = "disconnected";
		if (this.suspendTimer) {
			clearTimeout(this.suspendTimer);
			this.suspendTimer = null;
		}
	}
	startRetryTimer(interval) {
		this.retryTimer = setTimeout(() => {
			this.retryTimer = null;
			this.requestState({ state: "connecting" });
		}, interval);
	}
	cancelRetryTimer() {
		if (this.retryTimer) {
			clearTimeout(this.retryTimer);
			this.retryTimer = null;
		}
	}
	startWebSocketSlowTimer() {
		this.webSocketSlowTimer = setTimeout(() => {
			this.checkWsConnectivity().then(() => {
				this.wsCheckResult = true;
			}).catch(() => {
				this.wsCheckResult = false;
			});
			if (this.realtime.http.checkConnectivity) whenPromiseSettles(this.realtime.http.checkConnectivity(), (err, connectivity) => {
				if (err || !connectivity) {
					this.cancelWebSocketGiveUpTimer();
					this.notifyState({
						state: "disconnected",
						error: new ErrorInfo("Unable to connect (network unreachable)", 80003, 404)
					});
				}
			});
		}, this.options.timeouts.webSocketSlowTimeout);
	}
	cancelWebSocketSlowTimer() {
		if (this.webSocketSlowTimer) {
			clearTimeout(this.webSocketSlowTimer);
			this.webSocketSlowTimer = null;
		}
	}
	startWebSocketGiveUpTimer(transportParams) {
		this.webSocketGiveUpTimer = setTimeout(() => {
			var _a2, _b;
			if (!this.wsCheckResult) {
				if (this.baseTransport) {
					this.abandonedWebSocket = true;
					(_a2 = this.proposedTransport) == null || _a2.dispose();
					(_b = this.pendingTransport) == null || _b.dispose();
					this.connectBase(transportParams, ++this.connectCounter);
				}
			}
		}, this.options.timeouts.webSocketConnectTimeout);
	}
	cancelWebSocketGiveUpTimer() {
		if (this.webSocketGiveUpTimer) {
			clearTimeout(this.webSocketGiveUpTimer);
			this.webSocketGiveUpTimer = null;
		}
	}
	notifyState(indicated) {
		var _a2, _b;
		const state = indicated.state;
		const retryImmediately = state === "disconnected" && (this.state === this.states.connected || indicated.retryImmediately || this.state === this.states.connecting && indicated.error && auth_default.isTokenErr(indicated.error) && !(this.errorReason && auth_default.isTokenErr(this.errorReason)));
		if (state == this.state.state) return;
		this.cancelTransitionTimer();
		this.cancelRetryTimer();
		this.cancelWebSocketSlowTimer();
		this.cancelWebSocketGiveUpTimer();
		this.checkSuspendTimer(indicated.state);
		if (state === "suspended" || state === "connected") this.disconnectedRetryCount = 0;
		if (this.state.terminal) return;
		const newState = this.states[indicated.state];
		let retryDelay = newState.retryDelay;
		if (newState.state === "disconnected") {
			this.disconnectedRetryCount++;
			retryDelay = getRetryTime(newState.retryDelay, this.disconnectedRetryCount);
		}
		const change = new connectionstatechange_default(this.state.state, newState.state, retryDelay, indicated.error || ((_b = (_a2 = connectionerrors_default)[newState.state]) == null ? void 0 : _b.call(_a2)));
		if (retryImmediately) {
			const autoReconnect = () => {
				if (this.state === this.states.disconnected) {
					this.lastAutoReconnectAttempt = Date.now();
					this.requestState({ state: "connecting" });
				}
			};
			const sinceLast = this.lastAutoReconnectAttempt && Date.now() - this.lastAutoReconnectAttempt + 1;
			if (sinceLast && sinceLast < 1e3) setTimeout(autoReconnect, 1e3 - sinceLast);
			else Platform.Config.nextTick(autoReconnect);
		} else if (state === "disconnected" || state === "suspended") this.startRetryTimer(retryDelay);
		if (state === "disconnected" && !retryImmediately || state === "suspended" || newState.terminal) Platform.Config.nextTick(() => {
			this.disconnectAllTransports();
		});
		if (state == "connected" && !this.activeProtocol) logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.notifyState()", "Broken invariant: attempted to go into connected state, but there is no active protocol");
		this.enactStateChange(change);
		if (this.state.sendEvents) this.sendQueuedMessages();
		else if (!this.state.queueEvents) {
			this.realtime.channels.propogateConnectionInterruption(state, change.reason);
			this.failQueuedMessages(change.reason);
		}
	}
	requestState(request) {
		var _a2, _b;
		const state = request.state;
		if (state == this.state.state) return;
		this.cancelWebSocketSlowTimer();
		this.cancelWebSocketGiveUpTimer();
		this.cancelTransitionTimer();
		this.cancelRetryTimer();
		this.checkSuspendTimer(state);
		if (state == "connecting" && this.state.state == "connected") return;
		if (state == "closing" && this.state.state == "closed") return;
		const newState = this.states[state], change = new connectionstatechange_default(this.state.state, newState.state, null, request.error || ((_b = (_a2 = connectionerrors_default)[newState.state]) == null ? void 0 : _b.call(_a2)));
		this.enactStateChange(change);
		if (state == "connecting") Platform.Config.nextTick(() => {
			this.startConnect();
		});
		if (state == "closing") this.closeImpl();
	}
	startConnect() {
		if (this.state !== this.states.connecting) return;
		const auth = this.realtime.auth;
		const connectCount = ++this.connectCounter;
		const connect = () => {
			this.checkConnectionStateFreshness();
			this.getTransportParams((transportParams) => {
				if (transportParams.mode === "recover" && transportParams.options.recover) {
					const recoveryContext = decodeRecoveryKey(transportParams.options.recover);
					if (recoveryContext) this.realtime.channels.recoverChannels(recoveryContext.channelSerials);
				}
				if (connectCount !== this.connectCounter) return;
				this.connectImpl(transportParams, connectCount);
			});
		};
		this.startSuspendTimer();
		this.startTransitionTimer(this.states.connecting);
		if (auth.method === "basic") connect();
		else {
			const authCb = (err) => {
				if (connectCount !== this.connectCounter) return;
				if (err) this.actOnErrorFromAuthorize(err);
				else connect();
			};
			if (this.errorReason && auth_default.isTokenErr(this.errorReason)) whenPromiseSettles(auth._forceNewToken(null, null), authCb);
			else whenPromiseSettles(auth._ensureValidAuthCredentials(false), authCb);
		}
	}
	connectImpl(transportParams, connectCount) {
		if (this.state.state !== this.states.connecting.state) return;
		const transportPreference = this.getTransportPreference();
		if (transportPreference && transportPreference === this.baseTransport && this.webSocketTransportAvailable) this.checkWsConnectivity().then(() => {
			this.unpersistTransportPreference();
			if (this.state === this.states.connecting) {
				this.disconnectAllTransports();
				this.connectWs(transportParams, ++this.connectCounter);
			}
		}).catch(noop2);
		if (transportPreference && transportPreference === this.baseTransport || this.baseTransport && !this.webSocketTransportAvailable) this.connectBase(transportParams, connectCount);
		else this.connectWs(transportParams, connectCount);
	}
	connectWs(transportParams, connectCount) {
		this.wsCheckResult = null;
		this.abandonedWebSocket = false;
		this.startWebSocketSlowTimer();
		this.startWebSocketGiveUpTimer(transportParams);
		this.tryTransportWithFallbacks("web_socket", transportParams, true, connectCount, () => {
			return this.wsCheckResult !== false && !this.abandonedWebSocket;
		});
	}
	connectBase(transportParams, connectCount) {
		if (this.baseTransport) this.tryTransportWithFallbacks(this.baseTransport, transportParams, false, connectCount, () => true);
		else this.notifyState({
			state: "disconnected",
			error: new ErrorInfo("No transports left to try", 8e4, 404)
		});
	}
	tryTransportWithFallbacks(transportName, transportParams, ws, connectCount, shouldContinue) {
		const giveUp = (err) => {
			this.notifyState({
				state: this.states.connecting.failState,
				error: err
			});
		};
		const candidateHosts = this.domains.slice();
		const hostAttemptCb = (fatal, transport) => {
			if (connectCount !== this.connectCounter) return;
			if (!shouldContinue()) {
				if (transport) transport.dispose();
				return;
			}
			if (!transport && !fatal) tryFallbackHosts();
		};
		const host = candidateHosts.shift();
		if (!host) {
			giveUp(new ErrorInfo("Unable to connect (no available host)", 80003, 404));
			return;
		}
		transportParams.host = host;
		const tryFallbackHosts = () => {
			if (!candidateHosts.length) {
				giveUp(new ErrorInfo("Unable to connect (and no more fallback hosts to try)", 80003, 404));
				return;
			}
			if (!this.realtime.http.checkConnectivity) {
				giveUp(new PartialErrorInfo("Internal error: Http.checkConnectivity not set", null, 500));
				return;
			}
			whenPromiseSettles(this.realtime.http.checkConnectivity(), (err, connectivity) => {
				if (connectCount !== this.connectCounter) return;
				if (!shouldContinue()) return;
				if (err) {
					giveUp(err);
					return;
				}
				if (!connectivity) {
					giveUp(new ErrorInfo("Unable to connect (network unreachable)", 80003, 404));
					return;
				}
				transportParams.host = arrPopRandomElement(candidateHosts);
				this.tryATransport(transportParams, transportName, hostAttemptCb);
			});
		};
		if (this.forceFallbackHost && candidateHosts.length) {
			this.forceFallbackHost = false;
			tryFallbackHosts();
			return;
		}
		this.tryATransport(transportParams, transportName, hostAttemptCb);
	}
	closeImpl() {
		this.cancelSuspendTimer();
		this.startTransitionTimer(this.states.closing);
		if (this.pendingTransport) this.pendingTransport.close();
		if (this.activeProtocol) this.activeProtocol.getTransport().close();
		this.notifyState({ state: "closed" });
	}
	onAuthUpdated(tokenDetails, callback) {
		var _a2;
		switch (this.state.state) {
			case "connected": {
				const activeTransport = (_a2 = this.activeProtocol) == null ? void 0 : _a2.getTransport();
				if (activeTransport && activeTransport.onAuthUpdated) activeTransport.onAuthUpdated(tokenDetails);
				const authMsg = fromValues2({
					action: actions.AUTH,
					auth: { accessToken: tokenDetails.token }
				});
				this.send(authMsg);
				const successListener = () => {
					this.off(failureListener);
					callback(null, tokenDetails);
				};
				const failureListener = (stateChange) => {
					if (stateChange.current === "failed") {
						this.off(successListener);
						this.off(failureListener);
						callback(stateChange.reason || this.getStateError());
					}
				};
				this.once("connectiondetails", successListener);
				this.on("connectionstate", failureListener);
				break;
			}
			case "connecting": this.disconnectAllTransports();
			default: {
				const listener = (stateChange) => {
					switch (stateChange.current) {
						case "connected":
							this.off(listener);
							callback(null, tokenDetails);
							break;
						case "failed":
						case "closed":
						case "suspended":
							this.off(listener);
							callback(stateChange.reason || this.getStateError());
							break;
						default: break;
					}
				};
				this.on("connectionstate", listener);
				if (this.state.state === "connecting") this.startConnect();
				else this.requestState({ state: "connecting" });
			}
		}
	}
	disconnectAllTransports() {
		this.connectCounter++;
		if (this.pendingTransport) this.pendingTransport.disconnect();
		delete this.pendingTransport;
		if (this.proposedTransport) this.proposedTransport.disconnect();
		delete this.pendingTransport;
		if (this.activeProtocol) this.activeProtocol.getTransport().disconnect();
	}
	/******************
	* event queueing
	******************/
	send(msg, queueEvent, callback) {
		callback = callback || noop2;
		const state = this.state;
		if (state.sendEvents) {
			this.sendImpl(new PendingMessage(msg, callback));
			return;
		}
		if (!(queueEvent && state.queueEvents)) {
			const err = "rejecting event, queueEvent was " + queueEvent + ", state was " + state.state;
			callback(this.errorReason || new ErrorInfo(err, 9e4, 400));
			return;
		}
		if (this.logger.shouldLog(logger_default.LOG_MICRO)) {}
		this.queue(msg, callback);
	}
	sendImpl(pendingMessage) {
		const msg = pendingMessage.message;
		if (pendingMessage.ackRequired && !pendingMessage.sendAttempted) msg.msgSerial = this.msgSerial++;
		try {
			this.activeProtocol.send(pendingMessage);
		} catch (e) {
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.sendImpl()", "Unexpected exception in transport.send(): " + e.stack);
		}
	}
	queue(msg, callback) {
		this.queuedMessages.push(new PendingMessage(msg, callback));
	}
	sendQueuedMessages() {
		let pendingMessage;
		while (pendingMessage = this.queuedMessages.shift()) this.sendImpl(pendingMessage);
	}
	queuePendingMessages(pendingMessages) {
		if (pendingMessages && pendingMessages.length) this.queuedMessages.prepend(pendingMessages);
	}
	failQueuedMessages(err) {
		const numQueued = this.queuedMessages.count();
		if (numQueued > 0) {
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.failQueuedMessages()", "failing " + numQueued + " queued messages, err = " + inspectError(err));
			this.queuedMessages.completeAllMessages(err);
		}
	}
	onChannelMessage(message, transport) {
		this.pendingChannelMessagesState.queue.push({
			message,
			transport
		});
		if (!this.pendingChannelMessagesState.isProcessing) this.processNextPendingChannelMessage();
	}
	processNextPendingChannelMessage() {
		if (this.pendingChannelMessagesState.queue.length > 0) {
			this.pendingChannelMessagesState.isProcessing = true;
			const pendingChannelMessage = this.pendingChannelMessagesState.queue.shift();
			this.processChannelMessage(pendingChannelMessage.message).catch((err) => {
				logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.processNextPendingChannelMessage() received error ", err);
			}).finally(() => {
				this.pendingChannelMessagesState.isProcessing = false;
				this.processNextPendingChannelMessage();
			});
		}
	}
	async processChannelMessage(message) {
		await this.realtime.channels.processChannelMessage(message);
	}
	async ping() {
		var _a2;
		if (this.state.state !== "connected") throw new ErrorInfo("Unable to ping service; not connected", 4e4, 400);
		const transport = (_a2 = this.activeProtocol) == null ? void 0 : _a2.getTransport();
		if (!transport) throw this.getStateError();
		const pingStart = Date.now();
		const id = cheapRandStr();
		return withTimeoutAsync(new Promise((resolve) => {
			const onHeartbeat = (responseId) => {
				if (responseId === id) {
					transport.off("heartbeat", onHeartbeat);
					resolve(Date.now() - pingStart);
				}
			};
			transport.on("heartbeat", onHeartbeat);
			transport.ping(id);
		}), this.options.timeouts.realtimeRequestTimeout, "Timeout waiting for heartbeat response");
	}
	abort(error) {
		this.activeProtocol.getTransport().fail(error);
	}
	getTransportPreference() {
		var _a2, _b;
		return this.transportPreference || haveWebStorage() && ((_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.get) == null ? void 0 : _b.call(_a2, transportPreferenceName));
	}
	persistTransportPreference(transport) {
		var _a2, _b;
		this.transportPreference = transport.shortName;
		if (haveWebStorage()) (_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.set) == null || _b.call(_a2, transportPreferenceName, transport.shortName);
	}
	unpersistTransportPreference() {
		var _a2, _b;
		this.transportPreference = null;
		if (haveWebStorage()) (_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.remove) == null || _b.call(_a2, transportPreferenceName);
	}
	actOnErrorFromAuthorize(err) {
		if (err.code === 40171) this.notifyState({
			state: "failed",
			error: err
		});
		else if (err.code === 40102) this.notifyState({
			state: "failed",
			error: err
		});
		else if (err.statusCode === HttpStatusCodes_default.Forbidden) {
			const msg = "Client configured authentication provider returned 403; failing the connection";
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.actOnErrorFromAuthorize()", msg);
			this.notifyState({
				state: "failed",
				error: new ErrorInfo(msg, 80019, 403, err)
			});
		} else this.notifyState({
			state: this.state.failState,
			error: new ErrorInfo("Client configured authentication provider request failed", 80019, 401, err)
		});
	}
	onConnectionDetailsUpdate(connectionDetails, transport) {
		if (!connectionDetails) return;
		this.connectionDetails = connectionDetails;
		if (connectionDetails.maxMessageSize) this.options.maxMessageSize = connectionDetails.maxMessageSize;
		const clientId = connectionDetails.clientId;
		if (clientId) {
			const err = this.realtime.auth._uncheckedSetClientId(clientId);
			if (err) {
				logger_default.logAction(this.logger, logger_default.LOG_ERROR, "ConnectionManager.onConnectionDetailsUpdate()", err.message);
				transport.fail(err);
				return;
			}
		}
		const connectionStateTtl = connectionDetails.connectionStateTtl;
		if (connectionStateTtl) this.connectionStateTtl = connectionStateTtl;
		this.maxIdleInterval = connectionDetails.maxIdleInterval;
		this.emit("connectiondetails", connectionDetails);
	}
	checkWsConnectivity() {
		const wsConnectivityCheckUrl = this.options.wsConnectivityCheckUrl || defaults_default.wsConnectivityCheckUrl;
		const ws = new Platform.Config.WebSocket(wsConnectivityCheckUrl);
		return new Promise((resolve, reject) => {
			let finished = false;
			ws.onopen = () => {
				if (!finished) {
					finished = true;
					resolve();
					ws.close();
				}
			};
			ws.onclose = ws.onerror = () => {
				if (!finished) {
					finished = true;
					reject();
				}
			};
		});
	}
	sessionRecoveryName() {
		return this.options.recoveryKeyStorageName || "ably-connection-recovery";
	}
	getSessionRecoverData() {
		var _a2, _b;
		return haveSessionStorage() && ((_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.getSession) == null ? void 0 : _b.call(_a2, this.sessionRecoveryName()));
	}
	setSessionRecoverData(value) {
		var _a2, _b;
		return haveSessionStorage() && ((_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.setSession) == null ? void 0 : _b.call(_a2, this.sessionRecoveryName(), value));
	}
	clearSessionRecoverData() {
		var _a2, _b;
		return haveSessionStorage() && ((_b = (_a2 = Platform.WebStorage) == null ? void 0 : _a2.removeSession) == null ? void 0 : _b.call(_a2, this.sessionRecoveryName()));
	}
};
var Connection = class extends eventemitter_default {
	constructor(ably, options) {
		super(ably.logger);
		this.whenState = (state) => {
			return eventemitter_default.prototype.whenState.call(this, state, this.state);
		};
		this.ably = ably;
		this.connectionManager = new connectionmanager_default(ably, options);
		this.state = this.connectionManager.state.state;
		this.key = void 0;
		this.id = void 0;
		this.errorReason = null;
		this.connectionManager.on("connectionstate", (stateChange) => {
			const state = this.state = stateChange.current;
			Platform.Config.nextTick(() => {
				this.emit(state, stateChange);
			});
		});
		this.connectionManager.on("update", (stateChange) => {
			Platform.Config.nextTick(() => {
				this.emit("update", stateChange);
			});
		});
	}
	connect() {
		this.connectionManager.requestState({ state: "connecting" });
	}
	async ping() {
		return this.connectionManager.ping();
	}
	close() {
		this.connectionManager.requestState({ state: "closing" });
	}
	get recoveryKey() {
		this.logger.deprecationWarning("The `Connection.recoveryKey` attribute has been replaced by the `Connection.createRecoveryKey()` method. Replace your usage of `recoveryKey` with the return value of `createRecoveryKey()`. `recoveryKey` will be removed in a future version.");
		return this.createRecoveryKey();
	}
	createRecoveryKey() {
		return this.connectionManager.createRecoveryKey();
	}
};
var connection_default = Connection;
var _BaseRealtime = class _BaseRealtime extends baseclient_default {
	constructor(options) {
		var _a2, _b, _c, _d;
		super(defaults_default.objectifyOptions(options, false, "BaseRealtime", logger_default.defaultLogger));
		if (typeof EdgeRuntime === "string") throw new ErrorInfo(`Ably.Realtime instance cannot be used in Vercel Edge runtime. If you are running Vercel Edge functions, please replace your "new Ably.Realtime()" with "new Ably.Rest()" and use Ably Rest API instead of the Realtime API. If you are server-rendering your application in the Vercel Edge runtime, please use the condition "if (typeof EdgeRuntime === 'string')" to prevent instantiating Ably.Realtime instance during SSR in the Vercel Edge runtime.`, 4e4, 400);
		this._additionalTransportImplementations = _BaseRealtime.transportImplementationsFromPlugins(this.options.plugins);
		this._RealtimePresence = (_b = (_a2 = this.options.plugins) == null ? void 0 : _a2.RealtimePresence) != null ? _b : null;
		this._liveObjectsPlugin = (_d = (_c = this.options.plugins) == null ? void 0 : _c.LiveObjects) != null ? _d : null;
		this.connection = new connection_default(this, this.options);
		this._channels = new Channels2(this);
		if (this.options.autoConnect !== false) this.connect();
	}
	static transportImplementationsFromPlugins(plugins) {
		const transports = {};
		if (plugins == null ? void 0 : plugins.WebSocketTransport) transports[TransportNames.WebSocket] = plugins.WebSocketTransport;
		if (plugins == null ? void 0 : plugins.XHRPolling) transports[TransportNames.XhrPolling] = plugins.XHRPolling;
		return transports;
	}
	get channels() {
		return this._channels;
	}
	get clientId() {
		return this.auth.clientId;
	}
	connect() {
		this.connection.connect();
	}
	close() {
		this.connection.close();
	}
};
_BaseRealtime.EventEmitter = eventemitter_default;
var BaseRealtime = _BaseRealtime;
var Channels2 = class extends eventemitter_default {
	constructor(realtime) {
		super(realtime.logger);
		this.realtime = realtime;
		this.all = /* @__PURE__ */ Object.create(null);
		realtime.connection.connectionManager.on("transport.active", () => {
			this.onTransportActive();
		});
	}
	channelSerials() {
		let serials = {};
		for (const name of keysArray(this.all, true)) {
			const channel = this.all[name];
			if (channel.properties.channelSerial) serials[name] = channel.properties.channelSerial;
		}
		return serials;
	}
	recoverChannels(channelSerials) {
		for (const name of keysArray(channelSerials, true)) {
			const channel = this.get(name);
			channel.properties.channelSerial = channelSerials[name];
		}
	}
	async processChannelMessage(msg) {
		const channelName = msg.channel;
		if (channelName === void 0) {
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Channels.processChannelMessage()", "received event unspecified channel, action = " + msg.action);
			return;
		}
		const channel = this.all[channelName];
		if (!channel) {
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "Channels.processChannelMessage()", "received event for non-existent channel: " + channelName);
			return;
		}
		await channel.processMessage(msg);
	}
	onTransportActive() {
		for (const channelName in this.all) {
			const channel = this.all[channelName];
			if (channel.state === "attaching" || channel.state === "detaching") channel.checkPendingState();
			else if (channel.state === "suspended") channel._attach(false, null);
			else if (channel.state === "attached") channel.requestState("attaching");
		}
	}
	propogateConnectionInterruption(connectionState, reason) {
		const connectionStateToChannelState = {
			closing: "detached",
			closed: "detached",
			failed: "failed",
			suspended: "suspended"
		};
		const fromChannelStates = [
			"attaching",
			"attached",
			"detaching",
			"suspended"
		];
		const toChannelState = connectionStateToChannelState[connectionState];
		for (const channelId in this.all) {
			const channel = this.all[channelId];
			if (fromChannelStates.includes(channel.state)) channel.notifyState(toChannelState, reason);
		}
	}
	get(name, channelOptions) {
		name = String(name);
		let channel = this.all[name];
		if (!channel) channel = this.all[name] = new realtimechannel_default(this.realtime, name, channelOptions);
		else if (channelOptions) {
			if (channel._shouldReattachToSetOptions(channelOptions, channel.channelOptions)) throw new ErrorInfo("Channels.get() cannot be used to set channel options that would cause the channel to reattach. Please, use RealtimeChannel.setOptions() instead.", 4e4, 400);
			channel.setOptions(channelOptions);
		}
		return channel;
	}
	getDerived(name, deriveOptions, channelOptions) {
		if (deriveOptions.filter) {
			const filter = toBase64(deriveOptions.filter);
			const match = matchDerivedChannel(name);
			name = `[filter=${filter}${match.qualifierParam}]${match.channelName}`;
		}
		return this.get(name, channelOptions);
	}
	release(name) {
		name = String(name);
		const channel = this.all[name];
		if (!channel) return;
		const releaseErr = channel.getReleaseErr();
		if (releaseErr) throw releaseErr;
		delete this.all[name];
	}
};
var baserealtime_default = BaseRealtime;
var uint8Array = Uint8Array;
var uint32Array = Uint32Array;
var pow = Math.pow;
var DEFAULT_STATE = new uint32Array(8);
var ROUND_CONSTANTS = [];
var M = new uint32Array(64);
function getFractionalBits(n2) {
	return (n2 - (n2 | 0)) * pow(2, 32) | 0;
}
var n = 2;
var nPrime = 0;
while (nPrime < 64) {
	isPrime = true;
	for (factor = 2; factor <= n / 2; factor++) if (n % factor === 0) isPrime = false;
	if (isPrime) {
		if (nPrime < 8) DEFAULT_STATE[nPrime] = getFractionalBits(pow(n, 1 / 2));
		ROUND_CONSTANTS[nPrime] = getFractionalBits(pow(n, 1 / 3));
		nPrime++;
	}
	n++;
}
var isPrime;
var factor;
var LittleEndian = !!new uint8Array(new uint32Array([1]).buffer)[0];
function convertEndian(word) {
	if (LittleEndian) return word >>> 24 | (word >>> 16 & 255) << 8 | (word & 65280) << 8 | word << 24;
	else return word;
}
function rightRotate(word, bits) {
	return word >>> bits | word << 32 - bits;
}
function sha256(data) {
	var STATE = DEFAULT_STATE.slice();
	var legth = data.length;
	var bitLength = legth * 8;
	var newBitLength = 512 - (bitLength + 64) % 512 - 1 + bitLength + 65;
	var bytes = new uint8Array(newBitLength / 8);
	var words = new uint32Array(bytes.buffer);
	bytes.set(data, 0);
	bytes[legth] = 128;
	words[words.length - 1] = convertEndian(bitLength);
	var round;
	for (var block = 0; block < newBitLength / 32; block += 16) {
		var workingState = STATE.slice();
		for (round = 0; round < 64; round++) {
			var MRound;
			if (round < 16) MRound = convertEndian(words[block + round]);
			else {
				var gamma0x = M[round - 15];
				var gamma1x = M[round - 2];
				MRound = M[round - 7] + M[round - 16] + (rightRotate(gamma0x, 7) ^ rightRotate(gamma0x, 18) ^ gamma0x >>> 3) + (rightRotate(gamma1x, 17) ^ rightRotate(gamma1x, 19) ^ gamma1x >>> 10);
			}
			M[round] = MRound |= 0;
			var t1 = (rightRotate(workingState[4], 6) ^ rightRotate(workingState[4], 11) ^ rightRotate(workingState[4], 25)) + (workingState[4] & workingState[5] ^ ~workingState[4] & workingState[6]) + workingState[7] + MRound + ROUND_CONSTANTS[round];
			var t2 = (rightRotate(workingState[0], 2) ^ rightRotate(workingState[0], 13) ^ rightRotate(workingState[0], 22)) + (workingState[0] & workingState[1] ^ workingState[2] & (workingState[0] ^ workingState[1]));
			for (var i = 7; i > 0; i--) workingState[i] = workingState[i - 1];
			workingState[0] = t1 + t2 | 0;
			workingState[4] = workingState[4] + t1 | 0;
		}
		for (round = 0; round < 8; round++) STATE[round] = STATE[round] + workingState[round] | 0;
	}
	return new uint8Array(new uint32Array(STATE.map(function(val) {
		return convertEndian(val);
	})).buffer);
}
function hmac2(key, data) {
	if (key.length > 64) key = sha256(key);
	if (key.length < 64) {
		const tmp = new Uint8Array(64);
		tmp.set(key, 0);
		key = tmp;
	}
	var innerKey = new Uint8Array(64);
	var outerKey = new Uint8Array(64);
	for (var i = 0; i < 64; i++) {
		innerKey[i] = 54 ^ key[i];
		outerKey[i] = 92 ^ key[i];
	}
	var msg = new Uint8Array(data.length + 64);
	msg.set(innerKey, 0);
	msg.set(data, 64);
	var result = new Uint8Array(96);
	result.set(outerKey, 0);
	result.set(sha256(msg), 64);
	return sha256(result);
}
var BufferUtils = class {
	constructor() {
		this.base64CharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		this.hexCharSet = "0123456789abcdef";
	}
	uint8ViewToBase64(bytes) {
		let base64 = "";
		const encodings = this.base64CharSet;
		const byteLength = bytes.byteLength;
		const byteRemainder = byteLength % 3;
		const mainLength = byteLength - byteRemainder;
		let a, b, c, d;
		let chunk;
		for (let i = 0; i < mainLength; i = i + 3) {
			chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
			a = (chunk & 16515072) >> 18;
			b = (chunk & 258048) >> 12;
			c = (chunk & 4032) >> 6;
			d = chunk & 63;
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
		}
		if (byteRemainder == 1) {
			chunk = bytes[mainLength];
			a = (chunk & 252) >> 2;
			b = (chunk & 3) << 4;
			base64 += encodings[a] + encodings[b] + "==";
		} else if (byteRemainder == 2) {
			chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
			a = (chunk & 64512) >> 10;
			b = (chunk & 1008) >> 4;
			c = (chunk & 15) << 2;
			base64 += encodings[a] + encodings[b] + encodings[c] + "=";
		}
		return base64;
	}
	base64ToArrayBuffer(base64) {
		const binary_string = atob == null ? void 0 : atob(base64);
		const len = binary_string.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
		return this.toArrayBuffer(bytes);
	}
	isBuffer(buffer) {
		return buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer);
	}
	toBuffer(buffer) {
		if (!ArrayBuffer) throw new Error("Can't convert to Buffer: browser does not support the necessary types");
		if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
		if (ArrayBuffer.isView(buffer)) return new Uint8Array(this.toArrayBuffer(buffer));
		throw new Error("BufferUtils.toBuffer expected an ArrayBuffer or a view onto one");
	}
	toArrayBuffer(buffer) {
		if (!ArrayBuffer) throw new Error("Can't convert to ArrayBuffer: browser does not support the necessary types");
		if (buffer instanceof ArrayBuffer) return buffer;
		if (ArrayBuffer.isView(buffer)) return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
		throw new Error("BufferUtils.toArrayBuffer expected an ArrayBuffer or a view onto one");
	}
	base64Encode(buffer) {
		return this.uint8ViewToBase64(this.toBuffer(buffer));
	}
	base64UrlEncode(buffer) {
		return this.base64Encode(buffer).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	}
	base64Decode(str) {
		if (ArrayBuffer && Platform.Config.atob) return this.base64ToArrayBuffer(str);
		else throw new Error("Expected ArrayBuffer to exist and Platform.Config.atob to be configured");
	}
	hexEncode(buffer) {
		return this.toBuffer(buffer).reduce((accum, byte) => accum + byte.toString(16).padStart(2, "0"), "");
	}
	hexDecode(hexEncodedBytes) {
		if (hexEncodedBytes.length % 2 !== 0) throw new Error("Can't create a byte array from a hex string of odd length");
		const uint8Array2 = new Uint8Array(hexEncodedBytes.length / 2);
		for (let i = 0; i < uint8Array2.length; i++) uint8Array2[i] = parseInt(hexEncodedBytes.slice(2 * i, 2 * (i + 1)), 16);
		return this.toArrayBuffer(uint8Array2);
	}
	utf8Encode(string) {
		if (Platform.Config.TextEncoder) {
			const encodedByteArray = new Platform.Config.TextEncoder().encode(string);
			return this.toArrayBuffer(encodedByteArray);
		} else throw new Error("Expected TextEncoder to be configured");
	}
	utf8Decode(buffer) {
		if (!this.isBuffer(buffer)) throw new Error("Expected input of utf8decode to be an arraybuffer or typed array");
		if (TextDecoder) return new TextDecoder().decode(buffer);
		else throw new Error("Expected TextDecoder to be configured");
	}
	areBuffersEqual(buffer1, buffer2) {
		if (!buffer1 || !buffer2) return false;
		const arrayBuffer1 = this.toArrayBuffer(buffer1);
		const arrayBuffer2 = this.toArrayBuffer(buffer2);
		if (arrayBuffer1.byteLength != arrayBuffer2.byteLength) return false;
		const bytes1 = new Uint8Array(arrayBuffer1);
		const bytes2 = new Uint8Array(arrayBuffer2);
		for (var i = 0; i < bytes1.length; i++) if (bytes1[i] != bytes2[i]) return false;
		return true;
	}
	byteLength(buffer) {
		if (buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer)) return buffer.byteLength;
		return -1;
	}
	arrayBufferViewToBuffer(arrayBufferView) {
		return this.toArrayBuffer(arrayBufferView);
	}
	concat(buffers) {
		const sumLength = buffers.reduce((acc, v) => acc + v.byteLength, 0);
		const result = new Uint8Array(sumLength);
		let offset = 0;
		for (const buffer of buffers) {
			const uint8Array2 = this.toBuffer(buffer);
			result.set(uint8Array2, offset);
			offset += uint8Array2.byteLength;
		}
		return result.buffer;
	}
	sha256(message) {
		const hash = sha256(this.toBuffer(message));
		return this.toArrayBuffer(hash);
	}
	hmacSha256(message, key) {
		const hash = hmac2(this.toBuffer(key), this.toBuffer(message));
		return this.toArrayBuffer(hash);
	}
};
var bufferutils_default = new BufferUtils();
var XHRStates = /* @__PURE__ */ ((XHRStates2) => {
	XHRStates2[XHRStates2["REQ_SEND"] = 0] = "REQ_SEND";
	XHRStates2[XHRStates2["REQ_RECV"] = 1] = "REQ_RECV";
	XHRStates2[XHRStates2["REQ_RECV_POLL"] = 2] = "REQ_RECV_POLL";
	XHRStates2[XHRStates2["REQ_RECV_STREAM"] = 3] = "REQ_RECV_STREAM";
	return XHRStates2;
})(XHRStates || {});
var XHRStates_default = XHRStates;
function createMissingImplementationError() {
	return new ErrorInfo("No HTTP request plugin provided. Provide at least one of the FetchRequest or XHRRequest plugins.", 400, 4e4);
}
var _a;
var Http2 = (_a = class {
	constructor(client) {
		this.checksInProgress = null;
		this.checkConnectivity = void 0;
		this.supportsAuthHeaders = false;
		this.supportsLinkHeaders = false;
		var _a2;
		this.client = client != null ? client : null;
		const connectivityCheckUrl = (client == null ? void 0 : client.options.connectivityCheckUrl) || defaults_default.connectivityCheckUrl;
		const connectivityCheckParams = (_a2 = client == null ? void 0 : client.options.connectivityCheckParams) != null ? _a2 : null;
		const connectivityUrlIsDefault = !(client == null ? void 0 : client.options.connectivityCheckUrl);
		const requestImplementations = __spreadValues(__spreadValues({}, Http2.bundledRequestImplementations), client == null ? void 0 : client._additionalHTTPRequestImplementations);
		const xhrRequestImplementation = requestImplementations.XHRRequest;
		const fetchRequestImplementation = requestImplementations.FetchRequest;
		const hasImplementation = !!(xhrRequestImplementation || fetchRequestImplementation);
		if (!hasImplementation) throw createMissingImplementationError();
		if (Platform.Config.xhrSupported && xhrRequestImplementation) {
			this.supportsAuthHeaders = true;
			this.Request = async function(method, uri, headers, params, body) {
				return new Promise((resolve) => {
					var _a3;
					const req = xhrRequestImplementation.createRequest(uri, headers, params, body, XHRStates_default.REQ_SEND, (_a3 = client && client.options.timeouts) != null ? _a3 : null, this.logger, method);
					req.once("complete", (error, body2, headers2, unpacked, statusCode) => resolve({
						error,
						body: body2,
						headers: headers2,
						unpacked,
						statusCode
					}));
					req.exec();
				});
			};
			if (client == null ? void 0 : client.options.disableConnectivityCheck) this.checkConnectivity = async function() {
				return true;
			};
			else this.checkConnectivity = async function() {
				var _a3;
				const requestResult = await this.doUri(HttpMethods_default.Get, connectivityCheckUrl, null, null, connectivityCheckParams);
				let result = false;
				if (!connectivityUrlIsDefault) result = !requestResult.error && isSuccessCode(requestResult.statusCode);
				else result = !requestResult.error && ((_a3 = requestResult.body) == null ? void 0 : _a3.replace(/\n/, "")) == "yes";
				return result;
			};
		} else if (Platform.Config.fetchSupported && fetchRequestImplementation) {
			this.supportsAuthHeaders = true;
			this.Request = async (method, uri, headers, params, body) => {
				return fetchRequestImplementation(method, client != null ? client : null, uri, headers, params, body);
			};
			if (client == null ? void 0 : client.options.disableConnectivityCheck) this.checkConnectivity = async function() {
				return true;
			};
			else this.checkConnectivity = async function() {
				var _a3;
				const requestResult = await this.doUri(HttpMethods_default.Get, connectivityCheckUrl, null, null, null);
				return !requestResult.error && ((_a3 = requestResult.body) == null ? void 0 : _a3.replace(/\n/, "")) == "yes";
			};
		} else this.Request = async () => {
			return { error: hasImplementation ? new PartialErrorInfo("no supported HTTP transports available", null, 400) : createMissingImplementationError() };
		};
	}
	get logger() {
		var _a2, _b;
		return (_b = (_a2 = this.client) == null ? void 0 : _a2.logger) != null ? _b : logger_default.defaultLogger;
	}
	async doUri(method, uri, headers, body, params) {
		if (!this.Request) return { error: new PartialErrorInfo("Request invoked before assigned to", null, 500) };
		return this.Request(method, uri, headers, params, body);
	}
	shouldFallback(errorInfo) {
		const statusCode = errorInfo.statusCode;
		return statusCode === 408 && !errorInfo.code || statusCode === 400 && !errorInfo.code || statusCode >= 500 && statusCode <= 504;
	}
}, _a.methods = [
	HttpMethods_default.Get,
	HttpMethods_default.Delete,
	HttpMethods_default.Post,
	HttpMethods_default.Put,
	HttpMethods_default.Patch
], _a.methodsWithoutBody = [HttpMethods_default.Get, HttpMethods_default.Delete], _a.methodsWithBody = [
	HttpMethods_default.Post,
	HttpMethods_default.Put,
	HttpMethods_default.Patch
], _a);
var http_default = Http2;
var test = "ablyjs-storage-test";
var globalObject3 = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : self;
var Webstorage = class {
	constructor() {
		try {
			globalObject3.sessionStorage.setItem(test, test);
			globalObject3.sessionStorage.removeItem(test);
			this.sessionSupported = true;
		} catch (e) {
			this.sessionSupported = false;
		}
		try {
			globalObject3.localStorage.setItem(test, test);
			globalObject3.localStorage.removeItem(test);
			this.localSupported = true;
		} catch (e) {
			this.localSupported = false;
		}
	}
	get(name) {
		return this._get(name, false);
	}
	getSession(name) {
		return this._get(name, true);
	}
	remove(name) {
		return this._remove(name, false);
	}
	removeSession(name) {
		return this._remove(name, true);
	}
	set(name, value, ttl) {
		return this._set(name, value, ttl, false);
	}
	setSession(name, value, ttl) {
		return this._set(name, value, ttl, true);
	}
	_set(name, value, ttl, session) {
		const wrappedValue = { value };
		if (ttl) wrappedValue.expires = Date.now() + ttl;
		return this.storageInterface(session).setItem(name, JSON.stringify(wrappedValue));
	}
	_get(name, session) {
		if (session && !this.sessionSupported) throw new Error("Session Storage not supported");
		if (!session && !this.localSupported) throw new Error("Local Storage not supported");
		const rawItem = this.storageInterface(session).getItem(name);
		if (!rawItem) return null;
		const wrappedValue = JSON.parse(rawItem);
		if (wrappedValue.expires && wrappedValue.expires < Date.now()) {
			this.storageInterface(session).removeItem(name);
			return null;
		}
		return wrappedValue.value;
	}
	_remove(name, session) {
		return this.storageInterface(session).removeItem(name);
	}
	storageInterface(session) {
		return session ? globalObject3.sessionStorage : globalObject3.localStorage;
	}
};
var webstorage_default = new Webstorage();
var globalObject4 = getGlobalObject();
var isVercelEdgeRuntime = typeof EdgeRuntime === "string";
if (typeof Window === "undefined" && typeof WorkerGlobalScope === "undefined" && !isVercelEdgeRuntime) console.log("Warning: this distribution of Ably is intended for browsers. On nodejs, please use the 'ably' package on npm");
function allowComet() {
	const loc = globalObject4.location;
	return !globalObject4.WebSocket || !loc || !loc.origin || loc.origin.indexOf("http") > -1;
}
function isWebWorkerContext() {
	if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) return true;
	else return false;
}
var config_default = {
	agent: "browser",
	logTimestamps: true,
	userAgent: globalObject4.navigator && globalObject4.navigator.userAgent.toString(),
	currentUrl: globalObject4.location && globalObject4.location.href,
	binaryType: "arraybuffer",
	WebSocket: globalObject4.WebSocket,
	fetchSupported: !!globalObject4.fetch,
	xhrSupported: globalObject4.XMLHttpRequest && "withCredentials" in new XMLHttpRequest(),
	allowComet: allowComet(),
	useProtocolHeartbeats: true,
	supportsBinary: !!globalObject4.TextDecoder,
	preferBinary: false,
	ArrayBuffer: globalObject4.ArrayBuffer,
	atob: globalObject4.atob,
	nextTick: typeof globalObject4.queueMicrotask === "function" ? (f) => globalObject4.queueMicrotask(f) : (f) => Promise.resolve().then(f),
	addEventListener: globalObject4.addEventListener,
	inspect: JSON.stringify,
	stringByteSize: function(str) {
		return globalObject4.TextDecoder && new globalObject4.TextEncoder().encode(str).length || str.length;
	},
	TextEncoder: globalObject4.TextEncoder,
	TextDecoder: globalObject4.TextDecoder,
	getRandomArrayBuffer: async function(byteLength) {
		const byteArray = new Uint8Array(byteLength);
		globalObject4.crypto.getRandomValues(byteArray);
		return byteArray.buffer;
	},
	isWebworker: isWebWorkerContext(),
	push: {
		platform: "browser",
		formFactor: "desktop",
		storage: webstorage_default
	}
};
TransportNames.XhrPolling;
var shortName2 = TransportNames.WebSocket;
function isNodeWebSocket(ws) {
	return !!ws.on;
}
var WebSocketTransport = class extends transport_default {
	constructor(connectionManager, auth, params) {
		super(connectionManager, auth, params);
		this.shortName = shortName2;
		params.heartbeats = Platform.Config.useProtocolHeartbeats;
		this.wsHost = params.host;
	}
	static isAvailable() {
		return !!Platform.Config.WebSocket;
	}
	createWebSocket(uri, connectParams) {
		this.uri = uri + toQueryString(connectParams);
		return new Platform.Config.WebSocket(this.uri);
	}
	toString() {
		return "WebSocketTransport; uri=" + this.uri;
	}
	connect() {
		transport_default.prototype.connect.call(this);
		const self2 = this, params = this.params, options = params.options;
		const wsUri = (options.tls ? "wss://" : "ws://") + this.wsHost + ":" + defaults_default.getPort(options) + "/";
		whenPromiseSettles(this.auth.getAuthParams(), function(err, authParams) {
			if (self2.isDisposed) return;
			let paramStr = "";
			for (const param in authParams) paramStr += " " + param + ": " + authParams[param] + ";";
			if (err) {
				self2.disconnect(err);
				return;
			}
			const connectParams = params.getConnectParams(authParams);
			try {
				const wsConnection = self2.wsConnection = self2.createWebSocket(wsUri, connectParams);
				wsConnection.binaryType = Platform.Config.binaryType;
				wsConnection.onopen = function() {
					self2.onWsOpen();
				};
				wsConnection.onclose = function(ev) {
					self2.onWsClose(ev);
				};
				wsConnection.onmessage = function(ev) {
					self2.onWsData(ev.data);
				};
				wsConnection.onerror = function(ev) {
					self2.onWsError(ev);
				};
				if (isNodeWebSocket(wsConnection)) wsConnection.on("ping", function() {
					self2.onActivity();
				});
			} catch (e) {
				logger_default.logAction(self2.logger, logger_default.LOG_ERROR, "WebSocketTransport.connect()", "Unexpected exception creating websocket: err = " + (e.stack || e.message));
				self2.disconnect(e);
			}
		});
	}
	send(message) {
		const wsConnection = this.wsConnection;
		if (!wsConnection) {
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "WebSocketTransport.send()", "No socket connection");
			return;
		}
		try {
			wsConnection.send(serialize2(message, this.connectionManager.realtime._MsgPack, this.params.format));
		} catch (e) {
			const msg = "Exception from ws connection when trying to send: " + inspectError(e);
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "WebSocketTransport.send()", msg);
			this.finish("disconnected", new ErrorInfo(msg, 5e4, 500));
		}
	}
	onWsData(data) {
		try {
			this.onProtocolMessage(deserialize(data, this.connectionManager.realtime._MsgPack, this.connectionManager.realtime._RealtimePresence, this.connectionManager.realtime._Annotations, this.connectionManager.realtime._liveObjectsPlugin, this.format));
		} catch (e) {
			logger_default.logAction(this.logger, logger_default.LOG_ERROR, "WebSocketTransport.onWsData()", "Unexpected exception handing channel message: " + e.stack);
		}
	}
	onWsOpen() {
		this.emit("preconnect");
	}
	onWsClose(ev) {
		let wasClean, code;
		if (typeof ev == "object") {
			code = ev.code;
			wasClean = ev.wasClean || code === 1e3;
		} else {
			code = ev;
			wasClean = code == 1e3;
		}
		delete this.wsConnection;
		if (wasClean) {
			const err = new ErrorInfo("Websocket closed", 80003, 400);
			this.finish("disconnected", err);
		} else {
			const err = new ErrorInfo("Unclean disconnection of WebSocket ; code = " + code, 80003, 400);
			this.finish("disconnected", err);
		}
		this.emit("disposed");
	}
	onWsError(err) {
		Platform.Config.nextTick(() => {
			this.disconnect(Error(err.message));
		});
	}
	dispose() {
		this.isDisposed = true;
		const wsConnection = this.wsConnection;
		if (wsConnection) {
			wsConnection.onmessage = function() {};
			delete this.wsConnection;
			Platform.Config.nextTick(() => {
				if (!wsConnection) throw new Error("WebSocketTransport.dispose(): wsConnection is not defined");
				wsConnection.close();
			});
		}
	}
};
var websockettransport_default = WebSocketTransport;
var ModularTransports = {
	order: ["xhr_polling"],
	bundledImplementations: {}
};
var defaults_default2 = {
	connectivityCheckUrl: "https://internet-up.ably-realtime.com/is-the-internet-up.txt",
	wsConnectivityCheckUrl: "wss://ws-up.ably-realtime.com",
	defaultTransports: [TransportNames.XhrPolling, TransportNames.WebSocket]
};
function isAblyError2(responseBody, headers) {
	return !!headers.get("x-ably-errorcode");
}
function getAblyError2(responseBody, headers) {
	if (isAblyError2(responseBody, headers)) return responseBody.error && ErrorInfo.fromValues(responseBody.error);
}
function convertHeaders(headers) {
	const result = {};
	headers.forEach((value, key) => {
		result[key] = value;
	});
	return result;
}
async function fetchRequest(method, client, uri, headers, params, body) {
	const fetchHeaders = new Headers(headers || {});
	const _method = method ? method.toUpperCase() : isNil(body) ? "GET" : "POST";
	const controller = new AbortController();
	let timeout;
	const timeoutPromise = new Promise((resolve) => {
		timeout = setTimeout(() => {
			controller.abort();
			resolve({ error: new PartialErrorInfo("Request timed out", null, 408) });
		}, client ? client.options.timeouts.httpRequestTimeout : defaults_default.TIMEOUTS.httpRequestTimeout);
	});
	const requestInit = {
		method: _method,
		headers: fetchHeaders,
		body,
		signal: controller.signal
	};
	if (!Platform.Config.isWebworker) requestInit.credentials = fetchHeaders.has("authorization") ? "include" : "same-origin";
	const resultPromise = (async () => {
		try {
			const urlParams = new URLSearchParams(params || {});
			urlParams.set("rnd", cheapRandStr());
			const preparedURI = uri + "?" + urlParams;
			const res = await getGlobalObject().fetch(preparedURI, requestInit);
			clearTimeout(timeout);
			if (res.status == 204) return {
				error: null,
				statusCode: res.status
			};
			const contentType = res.headers.get("Content-Type");
			let body2;
			if (contentType && contentType.indexOf("application/x-msgpack") > -1) body2 = await res.arrayBuffer();
			else if (contentType && contentType.indexOf("application/json") > -1) body2 = await res.json();
			else body2 = await res.text();
			const unpacked = !!contentType && contentType.indexOf("application/x-msgpack") === -1;
			const headers2 = convertHeaders(res.headers);
			if (!res.ok) return {
				error: getAblyError2(body2, res.headers) || new PartialErrorInfo("Error response received from server: " + res.status + " body was: " + Platform.Config.inspect(body2), null, res.status),
				body: body2,
				headers: headers2,
				unpacked,
				statusCode: res.status
			};
			else return {
				error: null,
				body: body2,
				headers: headers2,
				unpacked,
				statusCode: res.status
			};
		} catch (error) {
			clearTimeout(timeout);
			return { error };
		}
	})();
	return Promise.race([timeoutPromise, resultPromise]);
}
var modularBundledRequestImplementations = {};
Platform.BufferUtils = bufferutils_default;
Platform.Http = http_default;
Platform.Config = config_default;
Platform.Transports = ModularTransports;
Platform.WebStorage = webstorage_default;
http_default.bundledRequestImplementations = modularBundledRequestImplementations;
logger_default.initLogHandlers();
Platform.Defaults = getDefaults(defaults_default2);
if (Platform.Config.agent) Platform.Defaults.agent += " " + Platform.Config.agent;
//#endregion
export { modular_exports as t };
