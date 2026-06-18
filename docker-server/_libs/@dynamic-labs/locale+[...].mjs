//#region ../../node_modules/.pnpm/react-i18next@13.5.0_i18next@23.4.6_react-dom@19.2.7_react@19.2.7__react-native@0.86.0__d236bbf72b038f6fea8054448d76a626/node_modules/react-i18next/dist/es/unescape.js
var matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
var htmlEntities = {
	"&amp;": "&",
	"&#38;": "&",
	"&lt;": "<",
	"&#60;": "<",
	"&gt;": ">",
	"&#62;": ">",
	"&apos;": "'",
	"&#39;": "'",
	"&quot;": "\"",
	"&#34;": "\"",
	"&nbsp;": " ",
	"&#160;": " ",
	"&copy;": "©",
	"&#169;": "©",
	"&reg;": "®",
	"&#174;": "®",
	"&hellip;": "…",
	"&#8230;": "…",
	"&#x2F;": "/",
	"&#47;": "/"
};
var unescapeHtmlEntity = (m) => htmlEntities[m];
var unescape = (text) => text.replace(matchHtmlEntity, unescapeHtmlEntity);
//#endregion
//#region ../../node_modules/.pnpm/react-i18next@13.5.0_i18next@23.4.6_react-dom@19.2.7_react@19.2.7__react-native@0.86.0__d236bbf72b038f6fea8054448d76a626/node_modules/react-i18next/dist/es/defaults.js
var defaultOptions = {
	bindI18n: "languageChanged",
	bindI18nStore: "",
	transEmptyNodeValue: "",
	transSupportBasicHtmlNodes: true,
	transWrapTextNodes: "",
	transKeepBasicHtmlNodesFor: [
		"br",
		"strong",
		"i",
		"p"
	],
	useSuspense: true,
	unescape
};
function setDefaults() {
	let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	defaultOptions = {
		...defaultOptions,
		...options
	};
}
function getDefaults() {
	return defaultOptions;
}
//#endregion
//#region ../../node_modules/.pnpm/react-i18next@13.5.0_i18next@23.4.6_react-dom@19.2.7_react@19.2.7__react-native@0.86.0__d236bbf72b038f6fea8054448d76a626/node_modules/react-i18next/dist/es/i18nInstance.js
var i18nInstance;
function setI18n(instance) {
	i18nInstance = instance;
}
function getI18n() {
	return i18nInstance;
}
//#endregion
//#region ../../node_modules/.pnpm/react-i18next@13.5.0_i18next@23.4.6_react-dom@19.2.7_react@19.2.7__react-native@0.86.0__d236bbf72b038f6fea8054448d76a626/node_modules/react-i18next/dist/es/initReactI18next.js
var initReactI18next = {
	type: "3rdParty",
	init(instance) {
		setDefaults(instance.options.react);
		setI18n(instance);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/i18next@23.4.6/node_modules/i18next/dist/esm/i18next.js
var consoleLogger = {
	type: "logger",
	log(args) {
		this.output("log", args);
	},
	warn(args) {
		this.output("warn", args);
	},
	error(args) {
		this.output("error", args);
	},
	output(type, args) {
		if (console && console[type]) console[type].apply(console, args);
	}
};
var baseLogger = new class Logger {
	constructor(concreteLogger) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		this.init(concreteLogger, options);
	}
	init(concreteLogger) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		this.prefix = options.prefix || "i18next:";
		this.logger = concreteLogger || consoleLogger;
		this.options = options;
		this.debug = options.debug;
	}
	log() {
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		return this.forward(args, "log", "", true);
	}
	warn() {
		for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
		return this.forward(args, "warn", "", true);
	}
	error() {
		for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) args[_key3] = arguments[_key3];
		return this.forward(args, "error", "");
	}
	deprecate() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
	}
	forward(args, lvl, prefix, debugOnly) {
		if (debugOnly && !this.debug) return null;
		if (typeof args[0] === "string") args[0] = `${prefix}${this.prefix} ${args[0]}`;
		return this.logger[lvl](args);
	}
	create(moduleName) {
		return new Logger(this.logger, {
			prefix: `${this.prefix}:${moduleName}:`,
			...this.options
		});
	}
	clone(options) {
		options = options || this.options;
		options.prefix = options.prefix || this.prefix;
		return new Logger(this.logger, options);
	}
}();
var EventEmitter = class {
	constructor() {
		this.observers = {};
	}
	on(events, listener) {
		events.split(" ").forEach((event) => {
			this.observers[event] = this.observers[event] || [];
			this.observers[event].push(listener);
		});
		return this;
	}
	off(event, listener) {
		if (!this.observers[event]) return;
		if (!listener) {
			delete this.observers[event];
			return;
		}
		this.observers[event] = this.observers[event].filter((l) => l !== listener);
	}
	emit(event) {
		for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
		if (this.observers[event]) [].concat(this.observers[event]).forEach((observer) => {
			observer(...args);
		});
		if (this.observers["*"]) [].concat(this.observers["*"]).forEach((observer) => {
			observer.apply(observer, [event, ...args]);
		});
	}
};
function defer() {
	let res;
	let rej;
	const promise = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	});
	promise.resolve = res;
	promise.reject = rej;
	return promise;
}
function makeString(object) {
	if (object == null) return "";
	return "" + object;
}
function copy(a, s, t) {
	a.forEach((m) => {
		if (s[m]) t[m] = s[m];
	});
}
function getLastOfPath(object, path, Empty) {
	function cleanKey(key) {
		return key && key.indexOf("###") > -1 ? key.replace(/###/g, ".") : key;
	}
	function canNotTraverseDeeper() {
		return !object || typeof object === "string";
	}
	const stack = typeof path !== "string" ? [].concat(path) : path.split(".");
	while (stack.length > 1) {
		if (canNotTraverseDeeper()) return {};
		const key = cleanKey(stack.shift());
		if (!object[key] && Empty) object[key] = new Empty();
		if (Object.prototype.hasOwnProperty.call(object, key)) object = object[key];
		else object = {};
	}
	if (canNotTraverseDeeper()) return {};
	return {
		obj: object,
		k: cleanKey(stack.shift())
	};
}
function setPath(object, path, newValue) {
	const { obj, k } = getLastOfPath(object, path, Object);
	obj[k] = newValue;
}
function pushPath(object, path, newValue, concat) {
	const { obj, k } = getLastOfPath(object, path, Object);
	obj[k] = obj[k] || [];
	if (concat) obj[k] = obj[k].concat(newValue);
	if (!concat) obj[k].push(newValue);
}
function getPath(object, path) {
	const { obj, k } = getLastOfPath(object, path);
	if (!obj) return void 0;
	return obj[k];
}
function getPathWithDefaults(data, defaultData, key) {
	const value = getPath(data, key);
	if (value !== void 0) return value;
	return getPath(defaultData, key);
}
function deepExtend(target, source, overwrite) {
	for (const prop in source) if (prop !== "__proto__" && prop !== "constructor") if (prop in target) if (typeof target[prop] === "string" || target[prop] instanceof String || typeof source[prop] === "string" || source[prop] instanceof String) {
		if (overwrite) target[prop] = source[prop];
	} else deepExtend(target[prop], source[prop], overwrite);
	else target[prop] = source[prop];
	return target;
}
function regexEscape(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
var _entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;",
	"/": "&#x2F;"
};
function escape(data) {
	if (typeof data === "string") return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
	return data;
}
var chars = [
	" ",
	",",
	"?",
	"!",
	";"
];
function looksLikeObjectPath(key, nsSeparator, keySeparator) {
	nsSeparator = nsSeparator || "";
	keySeparator = keySeparator || "";
	const possibleChars = chars.filter((c) => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
	if (possibleChars.length === 0) return true;
	const r = new RegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
	let matched = !r.test(key);
	if (!matched) {
		const ki = key.indexOf(keySeparator);
		if (ki > 0 && !r.test(key.substring(0, ki))) matched = true;
	}
	return matched;
}
function deepFind(obj, path) {
	let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
	if (!obj) return void 0;
	if (obj[path]) return obj[path];
	const paths = path.split(keySeparator);
	let current = obj;
	for (let i = 0; i < paths.length; ++i) {
		if (!current) return void 0;
		if (typeof current[paths[i]] === "string" && i + 1 < paths.length) return;
		if (current[paths[i]] === void 0) {
			let j = 2;
			let p = paths.slice(i, i + j).join(keySeparator);
			let mix = current[p];
			while (mix === void 0 && paths.length > i + j) {
				j++;
				p = paths.slice(i, i + j).join(keySeparator);
				mix = current[p];
			}
			if (mix === void 0) return void 0;
			if (mix === null) return null;
			if (path.endsWith(p)) {
				if (typeof mix === "string") return mix;
				if (p && typeof mix[p] === "string") return mix[p];
			}
			const joinedPath = paths.slice(i + j).join(keySeparator);
			if (joinedPath) return deepFind(mix, joinedPath, keySeparator);
			return;
		}
		current = current[paths[i]];
	}
	return current;
}
function getCleanedCode(code) {
	if (code && code.indexOf("_") > 0) return code.replace("_", "-");
	return code;
}
var ResourceStore = class extends EventEmitter {
	constructor(data) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
			ns: ["translation"],
			defaultNS: "translation"
		};
		super();
		this.data = data || {};
		this.options = options;
		if (this.options.keySeparator === void 0) this.options.keySeparator = ".";
		if (this.options.ignoreJSONStructure === void 0) this.options.ignoreJSONStructure = true;
	}
	addNamespaces(ns) {
		if (this.options.ns.indexOf(ns) < 0) this.options.ns.push(ns);
	}
	removeNamespaces(ns) {
		const index = this.options.ns.indexOf(ns);
		if (index > -1) this.options.ns.splice(index, 1);
	}
	getResource(lng, ns, key) {
		let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
		const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
		let path = [lng, ns];
		if (key && typeof key !== "string") path = path.concat(key);
		if (key && typeof key === "string") path = path.concat(keySeparator ? key.split(keySeparator) : key);
		if (lng.indexOf(".") > -1) path = lng.split(".");
		const result = getPath(this.data, path);
		if (result || !ignoreJSONStructure || typeof key !== "string") return result;
		return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
	}
	addResource(lng, ns, key, value) {
		let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : { silent: false };
		const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
		let path = [lng, ns];
		if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
		if (lng.indexOf(".") > -1) {
			path = lng.split(".");
			value = ns;
			ns = path[1];
		}
		this.addNamespaces(ns);
		setPath(this.data, path, value);
		if (!options.silent) this.emit("added", lng, ns, key, value);
	}
	addResources(lng, ns, resources) {
		let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : { silent: false };
		for (const m in resources) if (typeof resources[m] === "string" || Object.prototype.toString.apply(resources[m]) === "[object Array]") this.addResource(lng, ns, m, resources[m], { silent: true });
		if (!options.silent) this.emit("added", lng, ns, resources);
	}
	addResourceBundle(lng, ns, resources, deep, overwrite) {
		let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : { silent: false };
		let path = [lng, ns];
		if (lng.indexOf(".") > -1) {
			path = lng.split(".");
			deep = resources;
			resources = ns;
			ns = path[1];
		}
		this.addNamespaces(ns);
		let pack = getPath(this.data, path) || {};
		if (deep) deepExtend(pack, resources, overwrite);
		else pack = {
			...pack,
			...resources
		};
		setPath(this.data, path, pack);
		if (!options.silent) this.emit("added", lng, ns, resources);
	}
	removeResourceBundle(lng, ns) {
		if (this.hasResourceBundle(lng, ns)) delete this.data[lng][ns];
		this.removeNamespaces(ns);
		this.emit("removed", lng, ns);
	}
	hasResourceBundle(lng, ns) {
		return this.getResource(lng, ns) !== void 0;
	}
	getResourceBundle(lng, ns) {
		if (!ns) ns = this.options.defaultNS;
		if (this.options.compatibilityAPI === "v1") return { ...this.getResource(lng, ns) };
		return this.getResource(lng, ns);
	}
	getDataByLanguage(lng) {
		return this.data[lng];
	}
	hasLanguageSomeTranslations(lng) {
		const data = this.getDataByLanguage(lng);
		return !!(data && Object.keys(data) || []).find((v) => data[v] && Object.keys(data[v]).length > 0);
	}
	toJSON() {
		return this.data;
	}
};
var postProcessor = {
	processors: {},
	addPostProcessor(module) {
		this.processors[module.name] = module;
	},
	handle(processors, value, key, options, translator) {
		processors.forEach((processor) => {
			if (this.processors[processor]) value = this.processors[processor].process(value, key, options, translator);
		});
		return value;
	}
};
var checkedLoadedFor = {};
var Translator = class Translator extends EventEmitter {
	constructor(services) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		super();
		copy([
			"resourceStore",
			"languageUtils",
			"pluralResolver",
			"interpolator",
			"backendConnector",
			"i18nFormat",
			"utils"
		], services, this);
		this.options = options;
		if (this.options.keySeparator === void 0) this.options.keySeparator = ".";
		this.logger = baseLogger.create("translator");
	}
	changeLanguage(lng) {
		if (lng) this.language = lng;
	}
	exists(key) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { interpolation: {} };
		if (key === void 0 || key === null) return false;
		const resolved = this.resolve(key, options);
		return resolved && resolved.res !== void 0;
	}
	extractFromKey(key, options) {
		let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
		if (nsSeparator === void 0) nsSeparator = ":";
		const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
		let namespaces = options.ns || this.options.defaultNS || [];
		const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
		const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
		if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
			const m = key.match(this.interpolator.nestingRegexp);
			if (m && m.length > 0) return {
				key,
				namespaces
			};
			const parts = key.split(nsSeparator);
			if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
			key = parts.join(keySeparator);
		}
		if (typeof namespaces === "string") namespaces = [namespaces];
		return {
			key,
			namespaces
		};
	}
	translate(keys, options, lastKey) {
		if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) options = this.options.overloadTranslationOptionHandler(arguments);
		if (typeof options === "object") options = { ...options };
		if (!options) options = {};
		if (keys === void 0 || keys === null) return "";
		if (!Array.isArray(keys)) keys = [String(keys)];
		const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
		const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
		const { key, namespaces } = this.extractFromKey(keys[keys.length - 1], options);
		const namespace = namespaces[namespaces.length - 1];
		const lng = options.lng || this.language;
		const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
		if (lng && lng.toLowerCase() === "cimode") {
			if (appendNamespaceToCIMode) {
				const nsSeparator = options.nsSeparator || this.options.nsSeparator;
				if (returnDetails) return {
					res: `${namespace}${nsSeparator}${key}`,
					usedKey: key,
					exactUsedKey: key,
					usedLng: lng,
					usedNS: namespace
				};
				return `${namespace}${nsSeparator}${key}`;
			}
			if (returnDetails) return {
				res: key,
				usedKey: key,
				exactUsedKey: key,
				usedLng: lng,
				usedNS: namespace
			};
			return key;
		}
		const resolved = this.resolve(keys, options);
		let res = resolved && resolved.res;
		const resUsedKey = resolved && resolved.usedKey || key;
		const resExactUsedKey = resolved && resolved.exactUsedKey || key;
		const resType = Object.prototype.toString.apply(res);
		const noObject = [
			"[object Number]",
			"[object Function]",
			"[object RegExp]"
		];
		const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
		const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
		if (handleAsObjectInI18nFormat && res && typeof res !== "string" && typeof res !== "boolean" && typeof res !== "number" && noObject.indexOf(resType) < 0 && !(typeof joinArrays === "string" && resType === "[object Array]")) {
			if (!options.returnObjects && !this.options.returnObjects) {
				if (!this.options.returnedObjectHandler) this.logger.warn("accessing an object - but returnObjects options is not enabled!");
				const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, {
					...options,
					ns: namespaces
				}) : `key '${key} (${this.language})' returned an object instead of string.`;
				if (returnDetails) {
					resolved.res = r;
					return resolved;
				}
				return r;
			}
			if (keySeparator) {
				const resTypeIsArray = resType === "[object Array]";
				const copy = resTypeIsArray ? [] : {};
				const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
				for (const m in res) if (Object.prototype.hasOwnProperty.call(res, m)) {
					const deepKey = `${newKeyToUse}${keySeparator}${m}`;
					copy[m] = this.translate(deepKey, {
						...options,
						joinArrays: false,
						ns: namespaces
					});
					if (copy[m] === deepKey) copy[m] = res[m];
				}
				res = copy;
			}
		} else if (handleAsObjectInI18nFormat && typeof joinArrays === "string" && resType === "[object Array]") {
			res = res.join(joinArrays);
			if (res) res = this.extendTranslation(res, keys, options, lastKey);
		} else {
			let usedDefault = false;
			let usedKey = false;
			const needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
			const hasDefaultValue = Translator.hasDefaultValue(options);
			const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
			const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, { ordinal: false }) : "";
			const defaultValue = options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
			if (!this.isValidLookup(res) && hasDefaultValue) {
				usedDefault = true;
				res = defaultValue;
			}
			if (!this.isValidLookup(res)) {
				usedKey = true;
				res = key;
			}
			const resForMissing = (options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && usedKey ? void 0 : res;
			const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
			if (usedKey || usedDefault || updateMissing) {
				this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
				if (keySeparator) {
					const fk = this.resolve(key, {
						...options,
						keySeparator: false
					});
					if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
				}
				let lngs = [];
				const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
				if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) for (let i = 0; i < fallbackLngs.length; i++) lngs.push(fallbackLngs[i]);
				else if (this.options.saveMissingTo === "all") lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
				else lngs.push(options.lng || this.language);
				const send = (l, k, specificDefaultValue) => {
					const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
					if (this.options.missingKeyHandler) this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
					else if (this.backendConnector && this.backendConnector.saveMissing) this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
					this.emit("missingKey", l, namespace, k, res);
				};
				if (this.options.saveMissing) if (this.options.saveMissingPlurals && needsPluralHandling) lngs.forEach((language) => {
					this.pluralResolver.getSuffixes(language, options).forEach((suffix) => {
						send([language], key + suffix, options[`defaultValue${suffix}`] || defaultValue);
					});
				});
				else send(lngs, key, defaultValue);
			}
			res = this.extendTranslation(res, keys, options, resolved, lastKey);
			if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;
			if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) if (this.options.compatibilityAPI !== "v1") res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : void 0);
			else res = this.options.parseMissingKeyHandler(res);
		}
		if (returnDetails) {
			resolved.res = res;
			return resolved;
		}
		return res;
	}
	extendTranslation(res, key, options, resolved, lastKey) {
		var _this = this;
		if (this.i18nFormat && this.i18nFormat.parse) res = this.i18nFormat.parse(res, {
			...this.options.interpolation.defaultVariables,
			...options
		}, options.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, { resolved });
		else if (!options.skipInterpolation) {
			if (options.interpolation) this.interpolator.init({
				...options,
				interpolation: {
					...this.options.interpolation,
					...options.interpolation
				}
			});
			const skipOnVariables = typeof res === "string" && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
			let nestBef;
			if (skipOnVariables) {
				const nb = res.match(this.interpolator.nestingRegexp);
				nestBef = nb && nb.length;
			}
			let data = options.replace && typeof options.replace !== "string" ? options.replace : options;
			if (this.options.interpolation.defaultVariables) data = {
				...this.options.interpolation.defaultVariables,
				...data
			};
			res = this.interpolator.interpolate(res, data, options.lng || this.language, options);
			if (skipOnVariables) {
				const na = res.match(this.interpolator.nestingRegexp);
				const nestAft = na && na.length;
				if (nestBef < nestAft) options.nest = false;
			}
			if (!options.lng && this.options.compatibilityAPI !== "v1" && resolved && resolved.res) options.lng = resolved.usedLng;
			if (options.nest !== false) res = this.interpolator.nest(res, function() {
				for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
				if (lastKey && lastKey[0] === args[0] && !options.context) {
					_this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
					return null;
				}
				return _this.translate(...args, key);
			}, options);
			if (options.interpolation) this.interpolator.reset();
		}
		const postProcess = options.postProcess || this.options.postProcess;
		const postProcessorNames = typeof postProcess === "string" ? [postProcess] : postProcess;
		if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
			i18nResolved: resolved,
			...options
		} : options, this);
		return res;
	}
	resolve(keys) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		let found;
		let usedKey;
		let exactUsedKey;
		let usedLng;
		let usedNS;
		if (typeof keys === "string") keys = [keys];
		keys.forEach((k) => {
			if (this.isValidLookup(found)) return;
			const extracted = this.extractFromKey(k, options);
			const key = extracted.key;
			usedKey = key;
			let namespaces = extracted.namespaces;
			if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
			const needsPluralHandling = options.count !== void 0 && typeof options.count !== "string";
			const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
			const needsContextHandling = options.context !== void 0 && (typeof options.context === "string" || typeof options.context === "number") && options.context !== "";
			const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
			namespaces.forEach((ns) => {
				if (this.isValidLookup(found)) return;
				usedNS = ns;
				if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(usedNS)) {
					checkedLoadedFor[`${codes[0]}-${ns}`] = true;
					this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
				}
				codes.forEach((code) => {
					if (this.isValidLookup(found)) return;
					usedLng = code;
					const finalKeys = [key];
					if (this.i18nFormat && this.i18nFormat.addLookupKeys) this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
					else {
						let pluralSuffix;
						if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count, options);
						const zeroSuffix = `${this.options.pluralSeparator}zero`;
						const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
						if (needsPluralHandling) {
							finalKeys.push(key + pluralSuffix);
							if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
							if (needsZeroSuffixLookup) finalKeys.push(key + zeroSuffix);
						}
						if (needsContextHandling) {
							const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
							finalKeys.push(contextKey);
							if (needsPluralHandling) {
								finalKeys.push(contextKey + pluralSuffix);
								if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
								if (needsZeroSuffixLookup) finalKeys.push(contextKey + zeroSuffix);
							}
						}
					}
					let possibleKey;
					while (possibleKey = finalKeys.pop()) if (!this.isValidLookup(found)) {
						exactUsedKey = possibleKey;
						found = this.getResource(code, ns, possibleKey, options);
					}
				});
			});
		});
		return {
			res: found,
			usedKey,
			exactUsedKey,
			usedLng,
			usedNS
		};
	}
	isValidLookup(res) {
		return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
	}
	getResource(code, ns, key) {
		let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
		return this.resourceStore.getResource(code, ns, key, options);
	}
	static hasDefaultValue(options) {
		const prefix = "defaultValue";
		for (const option in options) if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, 12) && void 0 !== options[option]) return true;
		return false;
	}
};
function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
var LanguageUtil = class {
	constructor(options) {
		this.options = options;
		this.supportedLngs = this.options.supportedLngs || false;
		this.logger = baseLogger.create("languageUtils");
	}
	getScriptPartFromCode(code) {
		code = getCleanedCode(code);
		if (!code || code.indexOf("-") < 0) return null;
		const p = code.split("-");
		if (p.length === 2) return null;
		p.pop();
		if (p[p.length - 1].toLowerCase() === "x") return null;
		return this.formatLanguageCode(p.join("-"));
	}
	getLanguagePartFromCode(code) {
		code = getCleanedCode(code);
		if (!code || code.indexOf("-") < 0) return code;
		const p = code.split("-");
		return this.formatLanguageCode(p[0]);
	}
	formatLanguageCode(code) {
		if (typeof code === "string" && code.indexOf("-") > -1) {
			const specialCases = [
				"hans",
				"hant",
				"latn",
				"cyrl",
				"cans",
				"mong",
				"arab"
			];
			let p = code.split("-");
			if (this.options.lowerCaseLng) p = p.map((part) => part.toLowerCase());
			else if (p.length === 2) {
				p[0] = p[0].toLowerCase();
				p[1] = p[1].toUpperCase();
				if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
			} else if (p.length === 3) {
				p[0] = p[0].toLowerCase();
				if (p[1].length === 2) p[1] = p[1].toUpperCase();
				if (p[0] !== "sgn" && p[2].length === 2) p[2] = p[2].toUpperCase();
				if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
				if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
			}
			return p.join("-");
		}
		return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
	}
	isSupportedCode(code) {
		if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) code = this.getLanguagePartFromCode(code);
		return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
	}
	getBestMatchFromCodes(codes) {
		if (!codes) return null;
		let found;
		codes.forEach((code) => {
			if (found) return;
			const cleanedLng = this.formatLanguageCode(code);
			if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
		});
		if (!found && this.options.supportedLngs) codes.forEach((code) => {
			if (found) return;
			const lngOnly = this.getLanguagePartFromCode(code);
			if (this.isSupportedCode(lngOnly)) return found = lngOnly;
			found = this.options.supportedLngs.find((supportedLng) => {
				if (supportedLng === lngOnly) return supportedLng;
				if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
				if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
			});
		});
		if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
		return found;
	}
	getFallbackCodes(fallbacks, code) {
		if (!fallbacks) return [];
		if (typeof fallbacks === "function") fallbacks = fallbacks(code);
		if (typeof fallbacks === "string") fallbacks = [fallbacks];
		if (Object.prototype.toString.apply(fallbacks) === "[object Array]") return fallbacks;
		if (!code) return fallbacks.default || [];
		let found = fallbacks[code];
		if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
		if (!found) found = fallbacks[this.formatLanguageCode(code)];
		if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
		if (!found) found = fallbacks.default;
		return found || [];
	}
	toResolveHierarchy(code, fallbackCode) {
		const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
		const codes = [];
		const addCode = (c) => {
			if (!c) return;
			if (this.isSupportedCode(c)) codes.push(c);
			else this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
		};
		if (typeof code === "string" && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
			if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
			if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
			if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
		} else if (typeof code === "string") addCode(this.formatLanguageCode(code));
		fallbackCodes.forEach((fc) => {
			if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
		});
		return codes;
	}
};
var sets = [
	{
		lngs: [
			"ach",
			"ak",
			"am",
			"arn",
			"br",
			"fil",
			"gun",
			"ln",
			"mfe",
			"mg",
			"mi",
			"oc",
			"pt",
			"pt-BR",
			"tg",
			"tl",
			"ti",
			"tr",
			"uz",
			"wa"
		],
		nr: [1, 2],
		fc: 1
	},
	{
		lngs: [
			"af",
			"an",
			"ast",
			"az",
			"bg",
			"bn",
			"ca",
			"da",
			"de",
			"dev",
			"el",
			"en",
			"eo",
			"es",
			"et",
			"eu",
			"fi",
			"fo",
			"fur",
			"fy",
			"gl",
			"gu",
			"ha",
			"hi",
			"hu",
			"hy",
			"ia",
			"it",
			"kk",
			"kn",
			"ku",
			"lb",
			"mai",
			"ml",
			"mn",
			"mr",
			"nah",
			"nap",
			"nb",
			"ne",
			"nl",
			"nn",
			"no",
			"nso",
			"pa",
			"pap",
			"pms",
			"ps",
			"pt-PT",
			"rm",
			"sco",
			"se",
			"si",
			"so",
			"son",
			"sq",
			"sv",
			"sw",
			"ta",
			"te",
			"tk",
			"ur",
			"yo"
		],
		nr: [1, 2],
		fc: 2
	},
	{
		lngs: [
			"ay",
			"bo",
			"cgg",
			"fa",
			"ht",
			"id",
			"ja",
			"jbo",
			"ka",
			"km",
			"ko",
			"ky",
			"lo",
			"ms",
			"sah",
			"su",
			"th",
			"tt",
			"ug",
			"vi",
			"wo",
			"zh"
		],
		nr: [1],
		fc: 3
	},
	{
		lngs: [
			"be",
			"bs",
			"cnr",
			"dz",
			"hr",
			"ru",
			"sr",
			"uk"
		],
		nr: [
			1,
			2,
			5
		],
		fc: 4
	},
	{
		lngs: ["ar"],
		nr: [
			0,
			1,
			2,
			3,
			11,
			100
		],
		fc: 5
	},
	{
		lngs: ["cs", "sk"],
		nr: [
			1,
			2,
			5
		],
		fc: 6
	},
	{
		lngs: ["csb", "pl"],
		nr: [
			1,
			2,
			5
		],
		fc: 7
	},
	{
		lngs: ["cy"],
		nr: [
			1,
			2,
			3,
			8
		],
		fc: 8
	},
	{
		lngs: ["fr"],
		nr: [1, 2],
		fc: 9
	},
	{
		lngs: ["ga"],
		nr: [
			1,
			2,
			3,
			7,
			11
		],
		fc: 10
	},
	{
		lngs: ["gd"],
		nr: [
			1,
			2,
			3,
			20
		],
		fc: 11
	},
	{
		lngs: ["is"],
		nr: [1, 2],
		fc: 12
	},
	{
		lngs: ["jv"],
		nr: [0, 1],
		fc: 13
	},
	{
		lngs: ["kw"],
		nr: [
			1,
			2,
			3,
			4
		],
		fc: 14
	},
	{
		lngs: ["lt"],
		nr: [
			1,
			2,
			10
		],
		fc: 15
	},
	{
		lngs: ["lv"],
		nr: [
			1,
			2,
			0
		],
		fc: 16
	},
	{
		lngs: ["mk"],
		nr: [1, 2],
		fc: 17
	},
	{
		lngs: ["mnk"],
		nr: [
			0,
			1,
			2
		],
		fc: 18
	},
	{
		lngs: ["mt"],
		nr: [
			1,
			2,
			11,
			20
		],
		fc: 19
	},
	{
		lngs: ["or"],
		nr: [2, 1],
		fc: 2
	},
	{
		lngs: ["ro"],
		nr: [
			1,
			2,
			20
		],
		fc: 20
	},
	{
		lngs: ["sl"],
		nr: [
			5,
			1,
			2,
			3
		],
		fc: 21
	},
	{
		lngs: ["he", "iw"],
		nr: [
			1,
			2,
			20,
			21
		],
		fc: 22
	}
];
var _rulesPluralsTypes = {
	1: function(n) {
		return Number(n > 1);
	},
	2: function(n) {
		return Number(n != 1);
	},
	3: function(n) {
		return 0;
	},
	4: function(n) {
		return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
	},
	5: function(n) {
		return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
	},
	6: function(n) {
		return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
	},
	7: function(n) {
		return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
	},
	8: function(n) {
		return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
	},
	9: function(n) {
		return Number(n >= 2);
	},
	10: function(n) {
		return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
	},
	11: function(n) {
		return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
	},
	12: function(n) {
		return Number(n % 10 != 1 || n % 100 == 11);
	},
	13: function(n) {
		return Number(n !== 0);
	},
	14: function(n) {
		return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
	},
	15: function(n) {
		return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
	},
	16: function(n) {
		return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
	},
	17: function(n) {
		return Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1);
	},
	18: function(n) {
		return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
	},
	19: function(n) {
		return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
	},
	20: function(n) {
		return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
	},
	21: function(n) {
		return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
	},
	22: function(n) {
		return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
	}
};
var nonIntlVersions = [
	"v1",
	"v2",
	"v3"
];
var intlVersions = ["v4"];
var suffixesOrder = {
	zero: 0,
	one: 1,
	two: 2,
	few: 3,
	many: 4,
	other: 5
};
function createRules() {
	const rules = {};
	sets.forEach((set) => {
		set.lngs.forEach((l) => {
			rules[l] = {
				numbers: set.nr,
				plurals: _rulesPluralsTypes[set.fc]
			};
		});
	});
	return rules;
}
var PluralResolver = class {
	constructor(languageUtils) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		this.languageUtils = languageUtils;
		this.options = options;
		this.logger = baseLogger.create("pluralResolver");
		if ((!this.options.compatibilityJSON || intlVersions.includes(this.options.compatibilityJSON)) && (typeof Intl === "undefined" || !Intl.PluralRules)) {
			this.options.compatibilityJSON = "v3";
			this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
		}
		this.rules = createRules();
	}
	addRule(lng, obj) {
		this.rules[lng] = obj;
	}
	getRule(code) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		if (this.shouldUseIntlApi()) try {
			return new Intl.PluralRules(getCleanedCode(code), { type: options.ordinal ? "ordinal" : "cardinal" });
		} catch {
			return;
		}
		return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
	}
	needsPlural(code) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		const rule = this.getRule(code, options);
		if (this.shouldUseIntlApi()) return rule && rule.resolvedOptions().pluralCategories.length > 1;
		return rule && rule.numbers.length > 1;
	}
	getPluralFormsOfKey(code, key) {
		let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
	}
	getSuffixes(code) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		const rule = this.getRule(code, options);
		if (!rule) return [];
		if (this.shouldUseIntlApi()) return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
		return rule.numbers.map((number) => this.getSuffix(code, number, options));
	}
	getSuffix(code, count) {
		let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		const rule = this.getRule(code, options);
		if (rule) {
			if (this.shouldUseIntlApi()) return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
			return this.getSuffixRetroCompatible(rule, count);
		}
		this.logger.warn(`no plural rule found for: ${code}`);
		return "";
	}
	getSuffixRetroCompatible(rule, count) {
		const idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
		let suffix = rule.numbers[idx];
		if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
			if (suffix === 2) suffix = "plural";
			else if (suffix === 1) suffix = "";
		}
		const returnSuffix = () => this.options.prepend && suffix.toString() ? this.options.prepend + suffix.toString() : suffix.toString();
		if (this.options.compatibilityJSON === "v1") {
			if (suffix === 1) return "";
			if (typeof suffix === "number") return `_plural_${suffix.toString()}`;
			return returnSuffix();
		} else if (this.options.compatibilityJSON === "v2") return returnSuffix();
		else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) return returnSuffix();
		return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
	}
	shouldUseIntlApi() {
		return !nonIntlVersions.includes(this.options.compatibilityJSON);
	}
};
function deepFindWithDefaults(data, defaultData, key) {
	let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
	let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
	let path = getPathWithDefaults(data, defaultData, key);
	if (!path && ignoreJSONStructure && typeof key === "string") {
		path = deepFind(data, key, keySeparator);
		if (path === void 0) path = deepFind(defaultData, key, keySeparator);
	}
	return path;
}
var Interpolator = class {
	constructor() {
		let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		this.logger = baseLogger.create("interpolator");
		this.options = options;
		this.format = options.interpolation && options.interpolation.format || ((value) => value);
		this.init(options);
	}
	init() {
		let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (!options.interpolation) options.interpolation = { escapeValue: true };
		const iOpts = options.interpolation;
		this.escape = iOpts.escape !== void 0 ? iOpts.escape : escape;
		this.escapeValue = iOpts.escapeValue !== void 0 ? iOpts.escapeValue : true;
		this.useRawValueToEscape = iOpts.useRawValueToEscape !== void 0 ? iOpts.useRawValueToEscape : false;
		this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || "{{";
		this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || "}}";
		this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
		this.unescapePrefix = iOpts.unescapeSuffix ? "" : iOpts.unescapePrefix || "-";
		this.unescapeSuffix = this.unescapePrefix ? "" : iOpts.unescapeSuffix || "";
		this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape("$t(");
		this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(")");
		this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ",";
		this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1e3;
		this.alwaysFormat = iOpts.alwaysFormat !== void 0 ? iOpts.alwaysFormat : false;
		this.resetRegExp();
	}
	reset() {
		if (this.options) this.init(this.options);
	}
	resetRegExp() {
		const regexpStr = `${this.prefix}(.+?)${this.suffix}`;
		this.regexp = new RegExp(regexpStr, "g");
		const regexpUnescapeStr = `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`;
		this.regexpUnescape = new RegExp(regexpUnescapeStr, "g");
		const nestingRegexpStr = `${this.nestingPrefix}(.+?)${this.nestingSuffix}`;
		this.nestingRegexp = new RegExp(nestingRegexpStr, "g");
	}
	interpolate(str, data, lng, options) {
		let match;
		let value;
		let replaces;
		const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
		function regexSafe(val) {
			return val.replace(/\$/g, "$$$$");
		}
		const handleFormat = (key) => {
			if (key.indexOf(this.formatSeparator) < 0) {
				const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
				return this.alwaysFormat ? this.format(path, void 0, lng, {
					...options,
					...data,
					interpolationkey: key
				}) : path;
			}
			const p = key.split(this.formatSeparator);
			const k = p.shift().trim();
			const f = p.join(this.formatSeparator).trim();
			return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
				...options,
				...data,
				interpolationkey: k
			});
		};
		this.resetRegExp();
		const missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
		const skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
		[{
			regex: this.regexpUnescape,
			safeValue: (val) => regexSafe(val)
		}, {
			regex: this.regexp,
			safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
		}].forEach((todo) => {
			replaces = 0;
			while (match = todo.regex.exec(str)) {
				const matchedVar = match[1].trim();
				value = handleFormat(matchedVar);
				if (value === void 0) if (typeof missingInterpolationHandler === "function") {
					const temp = missingInterpolationHandler(str, match, options);
					value = typeof temp === "string" ? temp : "";
				} else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) value = "";
				else if (skipOnVariables) {
					value = match[0];
					continue;
				} else {
					this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
					value = "";
				}
				else if (typeof value !== "string" && !this.useRawValueToEscape) value = makeString(value);
				const safeValue = todo.safeValue(value);
				str = str.replace(match[0], safeValue);
				if (skipOnVariables) {
					todo.regex.lastIndex += value.length;
					todo.regex.lastIndex -= match[0].length;
				} else todo.regex.lastIndex = 0;
				replaces++;
				if (replaces >= this.maxReplaces) break;
			}
		});
		return str;
	}
	nest(str, fc) {
		let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		let match;
		let value;
		let clonedOptions;
		function handleHasOptions(key, inheritedOptions) {
			const sep = this.nestingOptionsSeparator;
			if (key.indexOf(sep) < 0) return key;
			const c = key.split(new RegExp(`${sep}[ ]*{`));
			let optionsString = `{${c[1]}`;
			key = c[0];
			optionsString = this.interpolate(optionsString, clonedOptions);
			const matchedSingleQuotes = optionsString.match(/'/g);
			const matchedDoubleQuotes = optionsString.match(/"/g);
			if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) optionsString = optionsString.replace(/'/g, "\"");
			try {
				clonedOptions = JSON.parse(optionsString);
				if (inheritedOptions) clonedOptions = {
					...inheritedOptions,
					...clonedOptions
				};
			} catch (e) {
				this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
				return `${key}${sep}${optionsString}`;
			}
			delete clonedOptions.defaultValue;
			return key;
		}
		while (match = this.nestingRegexp.exec(str)) {
			let formatters = [];
			clonedOptions = { ...options };
			clonedOptions = clonedOptions.replace && typeof clonedOptions.replace !== "string" ? clonedOptions.replace : clonedOptions;
			clonedOptions.applyPostProcessor = false;
			delete clonedOptions.defaultValue;
			let doReduce = false;
			if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
				const r = match[1].split(this.formatSeparator).map((elem) => elem.trim());
				match[1] = r.shift();
				formatters = r;
				doReduce = true;
			}
			value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
			if (value && match[0] === str && typeof value !== "string") return value;
			if (typeof value !== "string") value = makeString(value);
			if (!value) {
				this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
				value = "";
			}
			if (doReduce) value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
				...options,
				interpolationkey: match[1].trim()
			}), value.trim());
			str = str.replace(match[0], value);
			this.regexp.lastIndex = 0;
		}
		return str;
	}
};
function parseFormatStr(formatStr) {
	let formatName = formatStr.toLowerCase().trim();
	const formatOptions = {};
	if (formatStr.indexOf("(") > -1) {
		const p = formatStr.split("(");
		formatName = p[0].toLowerCase().trim();
		const optStr = p[1].substring(0, p[1].length - 1);
		if (formatName === "currency" && optStr.indexOf(":") < 0) {
			if (!formatOptions.currency) formatOptions.currency = optStr.trim();
		} else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
			if (!formatOptions.range) formatOptions.range = optStr.trim();
		} else optStr.split(";").forEach((opt) => {
			if (!opt) return;
			const [key, ...rest] = opt.split(":");
			const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
			if (!formatOptions[key.trim()]) formatOptions[key.trim()] = val;
			if (val === "false") formatOptions[key.trim()] = false;
			if (val === "true") formatOptions[key.trim()] = true;
			if (!isNaN(val)) formatOptions[key.trim()] = parseInt(val, 10);
		});
	}
	return {
		formatName,
		formatOptions
	};
}
function createCachedFormatter(fn) {
	const cache = {};
	return function invokeFormatter(val, lng, options) {
		const key = lng + JSON.stringify(options);
		let formatter = cache[key];
		if (!formatter) {
			formatter = fn(getCleanedCode(lng), options);
			cache[key] = formatter;
		}
		return formatter(val);
	};
}
var Formatter = class {
	constructor() {
		let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		this.logger = baseLogger.create("formatter");
		this.options = options;
		this.formats = {
			number: createCachedFormatter((lng, opt) => {
				const formatter = new Intl.NumberFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			}),
			currency: createCachedFormatter((lng, opt) => {
				const formatter = new Intl.NumberFormat(lng, {
					...opt,
					style: "currency"
				});
				return (val) => formatter.format(val);
			}),
			datetime: createCachedFormatter((lng, opt) => {
				const formatter = new Intl.DateTimeFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			}),
			relativetime: createCachedFormatter((lng, opt) => {
				const formatter = new Intl.RelativeTimeFormat(lng, { ...opt });
				return (val) => formatter.format(val, opt.range || "day");
			}),
			list: createCachedFormatter((lng, opt) => {
				const formatter = new Intl.ListFormat(lng, { ...opt });
				return (val) => formatter.format(val);
			})
		};
		this.init(options);
	}
	init(services) {
		const iOpts = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { interpolation: {} }).interpolation;
		this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ",";
	}
	add(name, fc) {
		this.formats[name.toLowerCase().trim()] = fc;
	}
	addCached(name, fc) {
		this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
	}
	format(value, format, lng) {
		let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		return format.split(this.formatSeparator).reduce((mem, f) => {
			const { formatName, formatOptions } = parseFormatStr(f);
			if (this.formats[formatName]) {
				let formatted = mem;
				try {
					const valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
					const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
					formatted = this.formats[formatName](mem, l, {
						...formatOptions,
						...options,
						...valOptions
					});
				} catch (error) {
					this.logger.warn(error);
				}
				return formatted;
			} else this.logger.warn(`there was no format function for ${formatName}`);
			return mem;
		}, value);
	}
};
function removePending(q, name) {
	if (q.pending[name] !== void 0) {
		delete q.pending[name];
		q.pendingCount--;
	}
}
var Connector = class extends EventEmitter {
	constructor(backend, store, services) {
		let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		super();
		this.backend = backend;
		this.store = store;
		this.services = services;
		this.languageUtils = services.languageUtils;
		this.options = options;
		this.logger = baseLogger.create("backendConnector");
		this.waitingReads = [];
		this.maxParallelReads = options.maxParallelReads || 10;
		this.readingCalls = 0;
		this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
		this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
		this.state = {};
		this.queue = [];
		if (this.backend && this.backend.init) this.backend.init(services, options.backend, options);
	}
	queueLoad(languages, namespaces, options, callback) {
		const toLoad = {};
		const pending = {};
		const toLoadLanguages = {};
		const toLoadNamespaces = {};
		languages.forEach((lng) => {
			let hasAllNamespaces = true;
			namespaces.forEach((ns) => {
				const name = `${lng}|${ns}`;
				if (!options.reload && this.store.hasResourceBundle(lng, ns)) this.state[name] = 2;
				else if (this.state[name] < 0);
				else if (this.state[name] === 1) {
					if (pending[name] === void 0) pending[name] = true;
				} else {
					this.state[name] = 1;
					hasAllNamespaces = false;
					if (pending[name] === void 0) pending[name] = true;
					if (toLoad[name] === void 0) toLoad[name] = true;
					if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
				}
			});
			if (!hasAllNamespaces) toLoadLanguages[lng] = true;
		});
		if (Object.keys(toLoad).length || Object.keys(pending).length) this.queue.push({
			pending,
			pendingCount: Object.keys(pending).length,
			loaded: {},
			errors: [],
			callback
		});
		return {
			toLoad: Object.keys(toLoad),
			pending: Object.keys(pending),
			toLoadLanguages: Object.keys(toLoadLanguages),
			toLoadNamespaces: Object.keys(toLoadNamespaces)
		};
	}
	loaded(name, err, data) {
		const s = name.split("|");
		const lng = s[0];
		const ns = s[1];
		if (err) this.emit("failedLoading", lng, ns, err);
		if (data) this.store.addResourceBundle(lng, ns, data);
		this.state[name] = err ? -1 : 2;
		const loaded = {};
		this.queue.forEach((q) => {
			pushPath(q.loaded, [lng], ns);
			removePending(q, name);
			if (err) q.errors.push(err);
			if (q.pendingCount === 0 && !q.done) {
				Object.keys(q.loaded).forEach((l) => {
					if (!loaded[l]) loaded[l] = {};
					const loadedKeys = q.loaded[l];
					if (loadedKeys.length) loadedKeys.forEach((n) => {
						if (loaded[l][n] === void 0) loaded[l][n] = true;
					});
				});
				q.done = true;
				if (q.errors.length) q.callback(q.errors);
				else q.callback();
			}
		});
		this.emit("loaded", loaded);
		this.queue = this.queue.filter((q) => !q.done);
	}
	read(lng, ns, fcName) {
		let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
		let wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
		let callback = arguments.length > 5 ? arguments[5] : void 0;
		if (!lng.length) return callback(null, {});
		if (this.readingCalls >= this.maxParallelReads) {
			this.waitingReads.push({
				lng,
				ns,
				fcName,
				tried,
				wait,
				callback
			});
			return;
		}
		this.readingCalls++;
		const resolver = (err, data) => {
			this.readingCalls--;
			if (this.waitingReads.length > 0) {
				const next = this.waitingReads.shift();
				this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
			}
			if (err && data && tried < this.maxRetries) {
				setTimeout(() => {
					this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
				}, wait);
				return;
			}
			callback(err, data);
		};
		const fc = this.backend[fcName].bind(this.backend);
		if (fc.length === 2) {
			try {
				const r = fc(lng, ns);
				if (r && typeof r.then === "function") r.then((data) => resolver(null, data)).catch(resolver);
				else resolver(null, r);
			} catch (err) {
				resolver(err);
			}
			return;
		}
		return fc(lng, ns, resolver);
	}
	prepareLoading(languages, namespaces) {
		let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		let callback = arguments.length > 3 ? arguments[3] : void 0;
		if (!this.backend) {
			this.logger.warn("No backend was added via i18next.use. Will not load resources.");
			return callback && callback();
		}
		if (typeof languages === "string") languages = this.languageUtils.toResolveHierarchy(languages);
		if (typeof namespaces === "string") namespaces = [namespaces];
		const toLoad = this.queueLoad(languages, namespaces, options, callback);
		if (!toLoad.toLoad.length) {
			if (!toLoad.pending.length) callback();
			return null;
		}
		toLoad.toLoad.forEach((name) => {
			this.loadOne(name);
		});
	}
	load(languages, namespaces, callback) {
		this.prepareLoading(languages, namespaces, {}, callback);
	}
	reload(languages, namespaces, callback) {
		this.prepareLoading(languages, namespaces, { reload: true }, callback);
	}
	loadOne(name) {
		let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
		const s = name.split("|");
		const lng = s[0];
		const ns = s[1];
		this.read(lng, ns, "read", void 0, void 0, (err, data) => {
			if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
			if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
			this.loaded(name, err, data);
		});
	}
	saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
		let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
		let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {};
		if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
			this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
			return;
		}
		if (key === void 0 || key === null || key === "") return;
		if (this.backend && this.backend.create) {
			const opts = {
				...options,
				isUpdate
			};
			const fc = this.backend.create.bind(this.backend);
			if (fc.length < 6) try {
				let r;
				if (fc.length === 5) r = fc(languages, namespace, key, fallbackValue, opts);
				else r = fc(languages, namespace, key, fallbackValue);
				if (r && typeof r.then === "function") r.then((data) => clb(null, data)).catch(clb);
				else clb(null, r);
			} catch (err) {
				clb(err);
			}
			else fc(languages, namespace, key, fallbackValue, clb, opts);
		}
		if (!languages || !languages[0]) return;
		this.store.addResource(languages[0], namespace, key, fallbackValue);
	}
};
function get() {
	return {
		debug: false,
		initImmediate: true,
		ns: ["translation"],
		defaultNS: ["translation"],
		fallbackLng: ["dev"],
		fallbackNS: false,
		supportedLngs: false,
		nonExplicitSupportedLngs: false,
		load: "all",
		preload: false,
		simplifyPluralSuffix: true,
		keySeparator: ".",
		nsSeparator: ":",
		pluralSeparator: "_",
		contextSeparator: "_",
		partialBundledLanguages: false,
		saveMissing: false,
		updateMissing: false,
		saveMissingTo: "fallback",
		saveMissingPlurals: true,
		missingKeyHandler: false,
		missingInterpolationHandler: false,
		postProcess: false,
		postProcessPassResolved: false,
		returnNull: false,
		returnEmptyString: true,
		returnObjects: false,
		joinArrays: false,
		returnedObjectHandler: false,
		parseMissingKeyHandler: false,
		appendNamespaceToMissingKey: false,
		appendNamespaceToCIMode: false,
		overloadTranslationOptionHandler: function handle(args) {
			let ret = {};
			if (typeof args[1] === "object") ret = args[1];
			if (typeof args[1] === "string") ret.defaultValue = args[1];
			if (typeof args[2] === "string") ret.tDescription = args[2];
			if (typeof args[2] === "object" || typeof args[3] === "object") {
				const options = args[3] || args[2];
				Object.keys(options).forEach((key) => {
					ret[key] = options[key];
				});
			}
			return ret;
		},
		interpolation: {
			escapeValue: true,
			format: (value, format, lng, options) => value,
			prefix: "{{",
			suffix: "}}",
			formatSeparator: ",",
			unescapePrefix: "-",
			nestingPrefix: "$t(",
			nestingSuffix: ")",
			nestingOptionsSeparator: ",",
			maxReplaces: 1e3,
			skipOnVariables: true
		}
	};
}
function transformOptions(options) {
	if (typeof options.ns === "string") options.ns = [options.ns];
	if (typeof options.fallbackLng === "string") options.fallbackLng = [options.fallbackLng];
	if (typeof options.fallbackNS === "string") options.fallbackNS = [options.fallbackNS];
	if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) options.supportedLngs = options.supportedLngs.concat(["cimode"]);
	return options;
}
function noop() {}
function bindMemberFunctions(inst) {
	Object.getOwnPropertyNames(Object.getPrototypeOf(inst)).forEach((mem) => {
		if (typeof inst[mem] === "function") inst[mem] = inst[mem].bind(inst);
	});
}
var I18n = class I18n extends EventEmitter {
	constructor() {
		let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		let callback = arguments.length > 1 ? arguments[1] : void 0;
		super();
		this.options = transformOptions(options);
		this.services = {};
		this.logger = baseLogger;
		this.modules = { external: [] };
		bindMemberFunctions(this);
		if (callback && !this.isInitialized && !options.isClone) {
			if (!this.options.initImmediate) {
				this.init(options, callback);
				return this;
			}
			setTimeout(() => {
				this.init(options, callback);
			}, 0);
		}
	}
	init() {
		var _this = this;
		let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		let callback = arguments.length > 1 ? arguments[1] : void 0;
		if (typeof options === "function") {
			callback = options;
			options = {};
		}
		if (!options.defaultNS && options.defaultNS !== false && options.ns) {
			if (typeof options.ns === "string") options.defaultNS = options.ns;
			else if (options.ns.indexOf("translation") < 0) options.defaultNS = options.ns[0];
		}
		const defOpts = get();
		this.options = {
			...defOpts,
			...this.options,
			...transformOptions(options)
		};
		if (this.options.compatibilityAPI !== "v1") this.options.interpolation = {
			...defOpts.interpolation,
			...this.options.interpolation
		};
		if (options.keySeparator !== void 0) this.options.userDefinedKeySeparator = options.keySeparator;
		if (options.nsSeparator !== void 0) this.options.userDefinedNsSeparator = options.nsSeparator;
		function createClassOnDemand(ClassOrObject) {
			if (!ClassOrObject) return null;
			if (typeof ClassOrObject === "function") return new ClassOrObject();
			return ClassOrObject;
		}
		if (!this.options.isClone) {
			if (this.modules.logger) baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
			else baseLogger.init(null, this.options);
			let formatter;
			if (this.modules.formatter) formatter = this.modules.formatter;
			else if (typeof Intl !== "undefined") formatter = Formatter;
			const lu = new LanguageUtil(this.options);
			this.store = new ResourceStore(this.options.resources, this.options);
			const s = this.services;
			s.logger = baseLogger;
			s.resourceStore = this.store;
			s.languageUtils = lu;
			s.pluralResolver = new PluralResolver(lu, {
				prepend: this.options.pluralSeparator,
				compatibilityJSON: this.options.compatibilityJSON,
				simplifyPluralSuffix: this.options.simplifyPluralSuffix
			});
			if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
				s.formatter = createClassOnDemand(formatter);
				s.formatter.init(s, this.options);
				this.options.interpolation.format = s.formatter.format.bind(s.formatter);
			}
			s.interpolator = new Interpolator(this.options);
			s.utils = { hasLoadedNamespace: this.hasLoadedNamespace.bind(this) };
			s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
			s.backendConnector.on("*", function(event) {
				for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
				_this.emit(event, ...args);
			});
			if (this.modules.languageDetector) {
				s.languageDetector = createClassOnDemand(this.modules.languageDetector);
				if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
			}
			if (this.modules.i18nFormat) {
				s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
				if (s.i18nFormat.init) s.i18nFormat.init(this);
			}
			this.translator = new Translator(this.services, this.options);
			this.translator.on("*", function(event) {
				for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
				_this.emit(event, ...args);
			});
			this.modules.external.forEach((m) => {
				if (m.init) m.init(this);
			});
		}
		this.format = this.options.interpolation.format;
		if (!callback) callback = noop;
		if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
			const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
			if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
		}
		if (!this.services.languageDetector && !this.options.lng) this.logger.warn("init: no languageDetector is used and no lng is defined");
		[
			"getResource",
			"hasResourceBundle",
			"getResourceBundle",
			"getDataByLanguage"
		].forEach((fcName) => {
			this[fcName] = function() {
				return _this.store[fcName](...arguments);
			};
		});
		[
			"addResource",
			"addResources",
			"addResourceBundle",
			"removeResourceBundle"
		].forEach((fcName) => {
			this[fcName] = function() {
				_this.store[fcName](...arguments);
				return _this;
			};
		});
		const deferred = defer();
		const load = () => {
			const finish = (err, t) => {
				if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
				this.isInitialized = true;
				if (!this.options.isClone) this.logger.log("initialized", this.options);
				this.emit("initialized", this.options);
				deferred.resolve(t);
				callback(err, t);
			};
			if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized) return finish(null, this.t.bind(this));
			this.changeLanguage(this.options.lng, finish);
		};
		if (this.options.resources || !this.options.initImmediate) load();
		else setTimeout(load, 0);
		return deferred;
	}
	loadResources(language) {
		let usedCallback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
		const usedLng = typeof language === "string" ? language : this.language;
		if (typeof language === "function") usedCallback = language;
		if (!this.options.resources || this.options.partialBundledLanguages) {
			if (usedLng && usedLng.toLowerCase() === "cimode") return usedCallback();
			const toLoad = [];
			const append = (lng) => {
				if (!lng) return;
				this.services.languageUtils.toResolveHierarchy(lng).forEach((l) => {
					if (toLoad.indexOf(l) < 0) toLoad.push(l);
				});
			};
			if (!usedLng) this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((l) => append(l));
			else append(usedLng);
			if (this.options.preload) this.options.preload.forEach((l) => append(l));
			this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
				if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
				usedCallback(e);
			});
		} else usedCallback(null);
	}
	reloadResources(lngs, ns, callback) {
		const deferred = defer();
		if (!lngs) lngs = this.languages;
		if (!ns) ns = this.options.ns;
		if (!callback) callback = noop;
		this.services.backendConnector.reload(lngs, ns, (err) => {
			deferred.resolve();
			callback(err);
		});
		return deferred;
	}
	use(module) {
		if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
		if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
		if (module.type === "backend") this.modules.backend = module;
		if (module.type === "logger" || module.log && module.warn && module.error) this.modules.logger = module;
		if (module.type === "languageDetector") this.modules.languageDetector = module;
		if (module.type === "i18nFormat") this.modules.i18nFormat = module;
		if (module.type === "postProcessor") postProcessor.addPostProcessor(module);
		if (module.type === "formatter") this.modules.formatter = module;
		if (module.type === "3rdParty") this.modules.external.push(module);
		return this;
	}
	setResolvedLanguage(l) {
		if (!l || !this.languages) return;
		if (["cimode", "dev"].indexOf(l) > -1) return;
		for (let li = 0; li < this.languages.length; li++) {
			const lngInLngs = this.languages[li];
			if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
			if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
				this.resolvedLanguage = lngInLngs;
				break;
			}
		}
	}
	changeLanguage(lng, callback) {
		var _this2 = this;
		this.isLanguageChangingTo = lng;
		const deferred = defer();
		this.emit("languageChanging", lng);
		const setLngProps = (l) => {
			this.language = l;
			this.languages = this.services.languageUtils.toResolveHierarchy(l);
			this.resolvedLanguage = void 0;
			this.setResolvedLanguage(l);
		};
		const done = (err, l) => {
			if (l) {
				setLngProps(l);
				this.translator.changeLanguage(l);
				this.isLanguageChangingTo = void 0;
				this.emit("languageChanged", l);
				this.logger.log("languageChanged", l);
			} else this.isLanguageChangingTo = void 0;
			deferred.resolve(function() {
				return _this2.t(...arguments);
			});
			if (callback) callback(err, function() {
				return _this2.t(...arguments);
			});
		};
		const setLng = (lngs) => {
			if (!lng && !lngs && this.services.languageDetector) lngs = [];
			const l = typeof lngs === "string" ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
			if (l) {
				if (!this.language) setLngProps(l);
				if (!this.translator.language) this.translator.changeLanguage(l);
				if (this.services.languageDetector && this.services.languageDetector.cacheUserLanguage) this.services.languageDetector.cacheUserLanguage(l);
			}
			this.loadResources(l, (err) => {
				done(err, l);
			});
		};
		if (!lng && this.services.languageDetector && !this.services.languageDetector.async) setLng(this.services.languageDetector.detect());
		else if (!lng && this.services.languageDetector && this.services.languageDetector.async) if (this.services.languageDetector.detect.length === 0) this.services.languageDetector.detect().then(setLng);
		else this.services.languageDetector.detect(setLng);
		else setLng(lng);
		return deferred;
	}
	getFixedT(lng, ns, keyPrefix) {
		var _this3 = this;
		const fixedT = function(key, opts) {
			let options;
			if (typeof opts !== "object") {
				for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) rest[_key3 - 2] = arguments[_key3];
				options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
			} else options = { ...opts };
			options.lng = options.lng || fixedT.lng;
			options.lngs = options.lngs || fixedT.lngs;
			options.ns = options.ns || fixedT.ns;
			options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
			const keySeparator = _this3.options.keySeparator || ".";
			let resultKey;
			if (options.keyPrefix && Array.isArray(key)) resultKey = key.map((k) => `${options.keyPrefix}${keySeparator}${k}`);
			else resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
			return _this3.t(resultKey, options);
		};
		if (typeof lng === "string") fixedT.lng = lng;
		else fixedT.lngs = lng;
		fixedT.ns = ns;
		fixedT.keyPrefix = keyPrefix;
		return fixedT;
	}
	t() {
		return this.translator && this.translator.translate(...arguments);
	}
	exists() {
		return this.translator && this.translator.exists(...arguments);
	}
	setDefaultNamespace(ns) {
		this.options.defaultNS = ns;
	}
	hasLoadedNamespace(ns) {
		let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		if (!this.isInitialized) {
			this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
			return false;
		}
		if (!this.languages || !this.languages.length) {
			this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
			return false;
		}
		const lng = options.lng || this.resolvedLanguage || this.languages[0];
		const fallbackLng = this.options ? this.options.fallbackLng : false;
		const lastLng = this.languages[this.languages.length - 1];
		if (lng.toLowerCase() === "cimode") return true;
		const loadNotPending = (l, n) => {
			const loadState = this.services.backendConnector.state[`${l}|${n}`];
			return loadState === -1 || loadState === 2;
		};
		if (options.precheck) {
			const preResult = options.precheck(this, loadNotPending);
			if (preResult !== void 0) return preResult;
		}
		if (this.hasResourceBundle(lng, ns)) return true;
		if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
		if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
		return false;
	}
	loadNamespaces(ns, callback) {
		const deferred = defer();
		if (!this.options.ns) {
			if (callback) callback();
			return Promise.resolve();
		}
		if (typeof ns === "string") ns = [ns];
		ns.forEach((n) => {
			if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
		});
		this.loadResources((err) => {
			deferred.resolve();
			if (callback) callback(err);
		});
		return deferred;
	}
	loadLanguages(lngs, callback) {
		const deferred = defer();
		if (typeof lngs === "string") lngs = [lngs];
		const preloaded = this.options.preload || [];
		const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0);
		if (!newLngs.length) {
			if (callback) callback();
			return Promise.resolve();
		}
		this.options.preload = preloaded.concat(newLngs);
		this.loadResources((err) => {
			deferred.resolve();
			if (callback) callback(err);
		});
		return deferred;
	}
	dir(lng) {
		if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
		if (!lng) return "rtl";
		const rtlLngs = [
			"ar",
			"shu",
			"sqr",
			"ssh",
			"xaa",
			"yhd",
			"yud",
			"aao",
			"abh",
			"abv",
			"acm",
			"acq",
			"acw",
			"acx",
			"acy",
			"adf",
			"ads",
			"aeb",
			"aec",
			"afb",
			"ajp",
			"apc",
			"apd",
			"arb",
			"arq",
			"ars",
			"ary",
			"arz",
			"auz",
			"avl",
			"ayh",
			"ayl",
			"ayn",
			"ayp",
			"bbz",
			"pga",
			"he",
			"iw",
			"ps",
			"pbt",
			"pbu",
			"pst",
			"prp",
			"prd",
			"ug",
			"ur",
			"ydd",
			"yds",
			"yih",
			"ji",
			"yi",
			"hbo",
			"men",
			"xmn",
			"fa",
			"jpr",
			"peo",
			"pes",
			"prs",
			"dv",
			"sam",
			"ckb"
		];
		const languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
		return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
	}
	static createInstance() {
		return new I18n(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, arguments.length > 1 ? arguments[1] : void 0);
	}
	cloneInstance() {
		let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
		const forkResourceStore = options.forkResourceStore;
		if (forkResourceStore) delete options.forkResourceStore;
		const mergedOptions = {
			...this.options,
			...options,
			isClone: true
		};
		const clone = new I18n(mergedOptions);
		if (options.debug !== void 0 || options.prefix !== void 0) clone.logger = clone.logger.clone(options);
		[
			"store",
			"services",
			"language"
		].forEach((m) => {
			clone[m] = this[m];
		});
		clone.services = { ...this.services };
		clone.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
		if (forkResourceStore) {
			clone.store = new ResourceStore(this.store.data, mergedOptions);
			clone.services.resourceStore = clone.store;
		}
		clone.translator = new Translator(clone.services, mergedOptions);
		clone.translator.on("*", function(event) {
			for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) args[_key4 - 1] = arguments[_key4];
			clone.emit(event, ...args);
		});
		clone.init(mergedOptions, callback);
		clone.translator.options = mergedOptions;
		clone.translator.backendConnector.services.utils = { hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone) };
		return clone;
	}
	toJSON() {
		return {
			options: this.options,
			store: this.store,
			language: this.language,
			languages: this.languages,
			resolvedLanguage: this.resolvedLanguage
		};
	}
};
var instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;
instance.createInstance;
instance.dir;
instance.init;
instance.loadResources;
instance.reloadResources;
instance.use;
instance.changeLanguage;
instance.getFixedT;
instance.t;
instance.exists;
instance.setDefaultNamespace;
instance.hasLoadedNamespace;
instance.loadNamespaces;
instance.loadLanguages;
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+locale@4.89.0_react-dom@19.2.7_react@19.2.7__react-native@0.86.0_@babel+c_af4a65d0b4e2b3329363fb322c11de9f/node_modules/@dynamic-labs/locale/src/lib/en/translation.js
var translation = {
	/**
	* @description copy keys for account exists view
	* @default
	* {
	connect: 'Connect with {{socialOauth}}',
	description: 'It looks like an account already exists using',
	title: 'Account already exists',
	trail_message_email: '. Please log in with your email.',
	trail_message_social: 'through {{socialOauth}}',
	}
	*/
	dyn_sandbox_maximum_threshold: {
		title: "Max User Limit Reached",
		description: "Your sandbox environment has reached your 100 MAU limit. To test with new users, delete existing users.",
		button: "Back"
	},
	dyn_account_exists: {
		connect: "Connect with {{socialOauth}}",
		description_email: "It looks like an account already exists using",
		description_social: "To restore your account to the right place, we need you to log in again.",
		title: "Re-Authentication Required",
		trail_message_email: ". Please log in with your email.",
		trail_message_social: "through {{socialOauth}}"
	},
	/**
	* @description copy keys for active wallet information (address, network, etc)
	* @default
	* {
	testnet_warning: 'A testnet network has been selected. Please only use testnet funds or they will be lost.',
	ordinals_address: 'Ordinals address',
	payment_address: 'Payment address',
	balance: 'Total balance',
	options: {
	copy_ens: 'Copy ENS',
	view_address: 'View address',
	disconnect: 'Disconnect',
	settings: 'Wallet settings',
	export: 'Export private keys',
	},
	}
	*/
	dyn_active_wallet_info: {
		testnet_warning: "A testnet network has been selected. Please only use testnet funds or they will be lost.",
		ordinals_address: "Ordinals address",
		payment_address: "Payment address",
		midnight_unshielded_address: "Unshielded address",
		midnight_dust_address: "Dust address",
		midnight_shielded_address: "Shielded address",
		midnight_shielded_balance: "Shielded balance",
		midnight_unshielded_balance: "Unshielded balance",
		midnight_dust_generating: "DUST generating",
		balance: "Total balance",
		options: {
			copy_ens: "Copy ENS",
			view_address: "View address",
			view_addresses: "View addresses",
			disconnect: "Disconnect",
			settings: "Wallet settings",
			export: "Export private keys"
		}
	},
	/**
	* @description copy keys for wallet details card
	* @default
	* {
	header: 'Wallet Details',
	address: 'Address',
	copy: 'Copy',
	copied: 'Copied!',
	}
	*/
	dyn_wallet_details_card: {
		header: "Wallet Details",
		address: "Address",
		copy: "Copy",
		copied: "Copied!"
	},
	/**
	* @description copy keys for add network view
	* @default
	* {
	title: 'Add {{name}} network to your wallet',
	add_button: {
	title: 'Add network',
	},
	cancel_button: {
	title: 'Cancel',
	},
	}
	*/
	dyn_add_network_view: {
		title: "Network unavailable",
		description: "This network is not supported in your {{name}} wallet.",
		add_button: { title: "Add Network" },
		cancel_button: { title: "Cancel" }
	},
	/**
	* @description copy keys for bridge view
	* @default
	* {
	summary_view: {
	connection_succeed: 'Congratulations on connecting both your {{firstBlockchainName}} and {{secondBlockchainName}} wallets',
	title: 'Welcome to {{appName}}',
	},
	welcome_view: {
	button: 'Get started',
	description: 'You’ll need to connect both your {{firstBlockchainName}} and {{secondBlockchainName}} wallets to get started',
	title: 'Connect to {{appName}}',
	},
	widget: {
	address: 'Copy wallet address',
	connect: 'Connect wallet',
	connect_with_network: 'Connect {{blockchainName}} wallet',
	copy: {
	address: 'Copy wallet address',
	ens: 'Copy ENS',
	},
	disconnect: 'Disconnect',
	edit_profile: 'Edit profile',
	wallet_network: '{{networkName}} wallet',
	},
	}
	*/
	dyn_bridge: {
		summary_view: {
			connection_succeed: "Congratulations on connecting both your {{firstBlockchainName}} and {{secondBlockchainName}} wallets",
			title: "Welcome to {{appName}}"
		},
		welcome_view: {
			button: "Get started",
			description: "You’ll need to connect both your {{firstBlockchainName}} and {{secondBlockchainName}} wallets to get started",
			title: "Connect to {{appName}}"
		},
		widget: {
			address: "Copy wallet address",
			connect: "Connect wallet",
			connect_with_network: "Connect {{blockchainName}} wallet",
			copy: {
				address: "Copy wallet address",
				ens: "Copy ENS"
			},
			disconnect: "Disconnect",
			edit_profile: "Edit profile",
			wallet_network: "{{networkName}} wallet"
		}
	},
	/**
	* @description copy keys for Dynamic Captcha
	* @default
	* {
	verify_user_subtitle: 'We need to quickly verify you’re human before we proceed.',
	verify_user_title: "Let's verify you're human",
	}
	*/
	dyn_captcha: {
		verify_user_subtitle: "We need to quickly verify you’re human before we proceed.",
		verify_user_title: "Let's verify you're human"
	},
	/**
	* @description copy keys for sanctioned access blocked view
	* @default
	* {
	*  title: 'Access Blocked',
	*  content: 'Logging in is not available to persons in {{jurisdiction}} as you are in a sanctioned jurisdiction.',
	* }
	*/
	dyn_access_blocked: {
		title: "Access Blocked",
		content: "Logging in is not available to persons in {{jurisdiction}} as you are in a sanctioned jurisdiction."
	},
	/**
	* @description copy keys for chainalysis blocked wallet view
	* @default
	* {
	title: 'Access denied',
	}
	*/
	dyn_chainalysis_blocked_wallet: { title: "Access denied" },
	/**
	* @description copy keys for collecting user data
	* @default
	* {
	description: 'We need a bit of information to get started',
	fields: {
	alias: {
	label: 'Alias',
	},
	country: {
	label: 'Country',
	},
	email: {
	label: 'Email',
	validation: 'Email is not valid',
	},
	first_name: {
	label: 'First Name',
	},
	job_title: {
	label: 'Job Title',
	},
	last_name: {
	label: 'Last Name',
	},
	phone_number: {
	label: 'Phone number',
	validation: 'Phone number is not valid',
	too_short: 'Phone number is too short',
	},
	policies_consent: {
	label: 'Policies Consent',
	},
	t_shirt_size: {
	label: 'T-Shirt Size',
	},
	team: {
	label: 'Team',
	},
	username: {
	label: 'Username',
	validation: 'Username is not valid',
	},
	},
	greeting: 'Welcome to {{appName}}',
	log_out_button: 'Log out',
	not_supported_network: {
	description: 'Your wallet is not connected to a supported network. Please update before continuing.',
	error_message: 'This network is not available, please update.',
	title: 'Update Network',
	},
	update_email_tooltip:
	'This email is tied to your wallet so cannot be updated',
	update_phone_number_tooltip:
	'This phone number is tied to your wallet so cannot be updated',
	lock_editing_multiple_verified_fields:
	'You can only edit 1 field at a time that requires verification',
	}
	*/
	dyn_collect_user_data: {
		description: "We need a bit of information to get started",
		fields: {
			alias: { label: "Alias" },
			country: { label: "Country" },
			email: {
				label: "E-mail",
				validation: "Email is not valid"
			},
			first_name: { label: "First Name" },
			job_title: { label: "Job Title" },
			last_name: { label: "Last Name" },
			phone_number: {
				label: "Phone number",
				validation: "Phone number is not valid",
				too_short: "Phone number is too short"
			},
			policies_consent: { label: "Policies Consent" },
			t_shirt_size: { label: "T-Shirt Size" },
			team: { label: "Team" },
			username: {
				label: "Username",
				validation: "Username is not valid"
			}
		},
		greeting: "Welcome to {{appName}}",
		log_out_button: "Log out",
		not_supported_network: {
			description: "Your wallet is not connected to a supported network. Please update before continuing.",
			error_message: "This network is not available, please update.",
			title: "Update Network"
		},
		update_email_tooltip: "This email is tied to your wallet so cannot be updated",
		update_phone_number_tooltip: "This phone number is tied to your wallet so cannot be updated",
		lock_editing_multiple_verified_fields: "You can only edit 1 field at a time that requires verification"
	},
	/**
	* @description copy keys for common component text and labels
	* @default
	* {
	aria: {
	collapsed: 'Collapsed',
	expanded: 'Expanded',
	},
	}
	*/
	dyn_common: { aria: {
		collapsed: "Collapsed",
		expanded: "Expanded"
	} },
	/**
	* @description copy keys for create password view
	* @default
	* {
	continue: 'Continue',
	create_input: {
	label: 'Create passcode',
	placeholder: 'Create passcode',
	},
	confirm_input: {
	label: 'Confirm passcode',
	placeholder: 'Confirm passcode',
	},
	current_password_input: {
	label: 'Current passcode',
	placeholder: 'Current passcode',
	},
	description:
	"Choose a strong, unique passcode to ensure your account's security and privacy.",
	errors: {
	invalid_current_password: 'Invalid current passcode',
	error_changing_password: 'Error changing passcode',
	new_password_same_as_old: 'New passcode cannot be the same as the old passcode',
	password_mismatch: 'Passcodes do not match',
	user_closed_view: 'User closed the view',
	},
	intro: {
	continue: 'Set up a passcode',
	description: {
	title: 'Add a passcode to protect your account',
	additional_protection: {
	title: 'Passcode Security',
	description:
	'Add a secure passcode to further prevent un-authrized access to your account.',
	},
	restore_access: {
	title: 'Restore Access',
	description:
	'You will be asked to enter it when signing on to a new device.',
	},
	},
	title: 'Add a Passcode',
	},
	logout: 'Log out',
	title: {
	create: 'Create passcode',
	update: 'Create new passcode',
	},
	update_input: {
	label: 'New passcode',
	placeholder: 'New passcode',
	},
	}
	*/
	dyn_create_password: {
		continue: "Continue",
		create_input: {
			label: "Create passcode",
			placeholder: "Create passcode"
		},
		confirm_input: {
			label: "Confirm passcode",
			placeholder: "Confirm passcode"
		},
		current_password_input: {
			label: "Current passcode",
			placeholder: "Current passcode"
		},
		description: "Choose a strong, unique passcode to ensure your account's security and privacy.",
		errors: {
			invalid_current_password: "Invalid current passcode",
			error_changing_password: "Error changing passcode",
			new_password_same_as_old: "New passcode cannot be the same as the old passcode",
			password_mismatch: "Passcodes do not match",
			user_closed_view: "User closed the view"
		},
		intro: {
			continue: "Set up a passcode",
			description: {
				title: "Add a passcode to protect your account",
				additional_protection: {
					title: "Passcode Security",
					description: "Add a secure passcode to further prevent un-authrized access to your account."
				},
				restore_access: {
					title: "Restore Access",
					description: "You will be asked to enter it when signing on to a new device."
				}
			},
			title: "Add a Passcode"
		},
		logout: "Log out",
		title: {
			create: "Create passcode",
			update: "Create new passcode"
		},
		update_input: {
			label: "New passcode",
			placeholder: "New passcode"
		}
	},
	/**
	* @description copy keys for creating wallet wallet message
	* @default
	* {
	loading_message: 'Your wallet is being created...',
	}
	*/
	dyn_creating_wallet: { loading_message: "Your wallet is being created..." },
	/**
	* @description copy keys for email verification view after email logging in with magiclink
	* @default
	* {
	description: 'We’ve sent a verification email to',
	note: 'Note: it might take a few seconds to proceed after clicking the link in your email',
	title: 'Confirm your email',
	}
	*/
	dyn_email_confirmation: {
		description: "We’ve sent a verification email to",
		note: "Note: it might take a few seconds to proceed after clicking the link in your email",
		title: "Confirm your email"
	},
	/**
	* @description copy keys for email update view
	* @default
	* {
	current_email: 'Your current email address is',
	label: 'Email address',
	send_verification: 'Send Verification Code',
	title: 'Update email',
	}
	*/
	dyn_email_update: {
		current_email: "Your current email address is",
		label: "Email address",
		send_verification: "Send Verification Code",
		title: "Update email"
	},
	/**
	* @description copy keys for one-time password verification view after logging in with dynamic email or phone number provider or after kyc verification
	* @default
	* {
	code_not_received: 'Did not receive a code? Check spam or',
	code_sent: 'Code sent',
	description: 'We’ve sent a verification code to',
	log_out_button: 'Log out',
	resend_code: 'Re-send code',
	resend_code_in: 'Re-send code in {{remainingSeconds}}',
	confirm_code: 'Confirm verification code',
	verification_succeeded: 'Verification code confirmed',
	hang_tight: 'Hang tight while we get things ready for you',
	
	email: {
	title: 'Confirm your email',
	complete:
	'Verification complete, the email is now verified to this account.',
	},
	phone_number: {
	title: 'Confirm your phone number',
	edit: 'Edit phone number',
	complete:
	'Verification complete, the phone number is now verified to this account.',
	},
	},
	*/
	dyn_otp_verification: {
		code_not_received: "Did not receive a code? Check spam or",
		code_sent: "Code sent",
		description: "We’ve sent a verification code to",
		log_out_button: "Log out",
		resend_code: "Re-send code",
		resend_code_in: "Re-send code in {{remainingSeconds}}",
		confirm_code: "Confirm verification code",
		verification_succeeded: "Verification code confirmed",
		hang_tight: "Hang tight while we get things ready for you",
		email: {
			title: "Confirm your email",
			complete: "Verification complete, the email is now verified to this account."
		},
		phone_number: {
			title: "Confirm your phone number",
			edit: "Edit phone number",
			complete: "Verification complete, the phone number is now verified to this account."
		}
	},
	/**
	* @description copy keys for deposit view
	* @default
	* {
	title: 'Deposit',
	}
	*/
	dyn_deposit: {
		title: "Deposit",
		receive_funds_on: "You can receive tokens on "
	},
	dyn_exchange_transfer_confirmation: {
		title: "Deposit Confirmation",
		from: "From",
		to: "To",
		fee: "Network Fee",
		fee_not_found: "N/A",
		receive: "Receive",
		cost: "Amount + Fees",
		cost_no_fee: "Amount",
		terms: "By confirming I agree to the Terms of Service and acknowledge this deposit is final.",
		send: "Send {{fiatCurrency}} {{fiatCurrencySymbol}}",
		confirm: "Confirm",
		cancel: "Cancel",
		account: "User {{exchange}}"
	},
	dyn_deposited_exchange: {
		title: "Deposited",
		description: " was successfully deposited to {{address}}",
		done: "Done",
		view: "View Transaction"
	},
	dyn_exchange_mfa: {
		title: "Confirm Verification Code",
		placeholder: "Enter Verification Code Here",
		description: "Enter the code sent to you or generated by your authenticator app",
		button: "Confirm"
	},
	dyn_exchange_whitelist_warning: {
		title: "Whitelisting Required",
		description: "To complete your first transfer with {{exchange}}, please follow these steps:",
		step1: { kraken: "Open Kraken. Click Transfer, then Withdraw" },
		step2: "Whitelist your wallet address",
		step3: "Complete the first transfer on {{exchange}}",
		view_instructions: "View Instructions",
		done: "I’m Done",
		address: "Your Wallet Address",
		open: "Open {{exchange}}"
	},
	dyn_fund_from_exchange: { title: "Fund from Exchange" },
	dyn_exchange_transfer_errors: {
		title: "Unable to execute transfer.",
		mfa_failed: "Incorrect security code. Please double-check your MFA code and try again.",
		invalid_currency_description: "Please choose a supported currency and try again.",
		invalid_balance: "This transfer, including fees, exceeds your available balance. Transfer a smaller amount.",
		amount_too_small: "The amount you’re trying to transfer is below the minimum allowed by the selected exchange. Please enter a larger amount and try again.",
		address_not_whitelisted: "The destination address is not whitelisted on this exchange. Please add it to your whitelist before retrying the transfer.",
		unknown: "An unknown error occurred."
	},
	/**
	* @description copy keys for embedded wallet authenticator choice view
	* @default
	* {
	description:
	'Protect your account and simplify your transaction experience.',
	email: {
	badge: 'Fastest',
	description: ' You will need to renew after {{expiration}} minutes ',
	title: 'Use a one-time code',
	},
	passkey: {
	auth_info: {
	convinience: {
	title: 'Convenient and Fast',
	description:
	'Use Face ID or Touch ID to complete transactions quickly.',
	},
	security: {
	title: 'Increased Security',
	description:
	'Passkeys are encrypted end-to-end on your device or password manager to prevent phishing attempts.',
	},
	add_button: 'Add a passkey',
	start_button: 'Add a passkey',
	},
	no_email_auth_info: {
	convinience: {
	title: 'Simple and Fast',
	description:
	'Works across devices and syncs between devices and browsers.',
	},
	security: {
	title: 'Secured with a bio-metric',
	description: 'Phishing resistant and encrypted.',
	},
	add_button: 'Add passkey',
	start_button: 'Add passkey',
	},
	badge: 'Recommended',
	description:
	'Works across devices & secured with biometric to prevent phishing attempts ',
	title: 'Create new passkey',
	reveal_title: 'Add a passkey',
	},
	skip: 'Not now',
	title: 'Account security',
	need_help_title: 'Problem Signing?',
	need_help_description: 'Select from an option below to complete',
	reveal_title: 'Verification Required',
	reveal_description: 'Choose a verification method.',
	}
	*/
	dyn_embedded_authenticator: {
		description: "Protect your account and simplify your transaction experience.",
		email: {
			badge: "Fastest",
			description: " You will need to renew after {{expiration}} minutes ",
			title: "Use a one-time code"
		},
		passkey: {
			auth_info: {
				convinience: {
					title: "Convenient and Fast",
					description: "Use Face ID or Touch ID to complete transactions quickly."
				},
				security: {
					title: "Increased Security",
					description: "Passkeys are encrypted end-to-end on your device or password manager to prevent phishing attempts."
				},
				add_button: "Add a passkey",
				start_button: "Add a passkey"
			},
			no_email_auth_info: {
				convinience: {
					title: "Simple and Fast",
					description: "Works across devices and syncs between devices and browsers."
				},
				security: {
					title: "Secured with a bio-metric",
					description: "Phishing resistant and encrypted."
				},
				add_button: "Add passkey",
				start_button: "Add passkey"
			},
			badge: "Recommended",
			description: "Works across devices & secured with biometric to prevent phishing attempts ",
			title: "Create new passkey",
			reveal_title: "Add a passkey"
		},
		skip: "Not now",
		title: "Account security",
		need_help_title: "Problem Signing?",
		need_help_description: "Select from an option below to complete",
		reveal_title: "Verification Required",
		reveal_description: "Choose a verification method."
	},
	/**
	* @description copy keys for enter password view
	* @default
	* {
	continue_button_label: 'Continue',
	description: 'Please enter your passcode below to continue.',
	error: {
	invalid_password: 'Invalid passcode',
	},
	input: {
	label: 'Passcode',
	placeholder: 'Passcode',
	},
	title: 'Enter passcode',
	}
	*/
	dyn_enter_password: {
		title: "Enter Password",
		description: "Enter your password to continue with this transaction.",
		label: "Your Password",
		placeholder: "Enter your password",
		button: { continue: "Continue" },
		error: {
			required: "Password is required",
			invalid_password: "Incorrect Password",
			failed: "Failed to unlock wallet"
		}
	},
	/**
	* @description copy keys for Dynamic Farcaster connect view
	* @default
	* {
	copy_button: 'Copy QR URI',
	scan_title: "Scan this QR code from your mobile app or phone's camera to connect.",
	}
	*/
	dyn_farcaster_connect_view: {
		copy_button: "Copy QR URI",
		scan_title: "Scan this QR code from your mobile app or phone's camera to connect."
	},
	/**
	* @description copy keys for log in view
	* @default
	* dyn_login: {
	connect_wallet: {
	title: 'Connect',
	},
	email_form: {
	email_field: {
	label: 'Enter your email',
	},
	submit_button: {
	label: 'Continue',
	},
	},
	email_or_phone: {
	use_email: 'Use email',
	use_phone: 'Use phone',
	prefer_email: 'Prefer email sign up?',
	prefer_phone: 'Prefer phone number sign up?',
	},
	helper: {
	all_wallet_list: 'Get your first wallet',
	email_form: {
	invalid_email: 'Invalid or incorrect email. Did you mistype it?',
	},
	pending_connect: {
	title: 'Connecting a wallet',
	},
	pending_signature: {
	title: 'Signing a wallet',
	},
	pending_signature_without_back_button: {
	title: 'Signing a wallet',
	},
	phone_number_form: {
	invalid_phone: 'Invalid or incorrect number. Did you mistype it?',
	invalid_sms_verification:
	'The code you entered is incorrect. Please try again.',
	too_many_sms_verification_attempts:
	'Too many verification attempts, please try again later.',
	},
	qr_code: {
	title: 'Connecting a wallet',
	},
	wallet_only: 'Get your first wallet',
	},
	passkey: {
	button_label: 'Sign in with Passkey',
	},
	qr_code: {
	title: 'Connect',
	},
	separators: {
	default: 'OR',
	},
	sign_wallet: {
	title: 'Sign',
	},
	select_wallet_in_wallet_group: {
	title: 'Select',
	},
	social: {
	button_label: 'Continue with {{provider}}',
	overlay_title: 'Choose a social account',
	},
	title: {
	all: 'Log in or sign up',
	all_wallet_list: 'Select your wallet',
	wallet_only: 'Select your wallet',
	},
	wallet_group: {
	title: 'Select Chain',
	},
	wallet_list: {
	button_only: 'Continue with a wallet',
	},
	mobile_wallet_redirect: {
	backup_title: 'Connect mobile app',
	prompt: "Tap 'Open' to continue",
	get_app_prompt: 'Get',
	open_prompt: 'Open',
	redirect_fail_message:
	"If the app doesn't open, you might need to download the {{walletName}} Wallet app.",
	app_store: 'App Store',
	play_store: 'Play Store',
	},
	wrong_social_account: {
	retry_button: 'Try again',
	retry_title: 'Please connect with: ',
	subtitle:
	'You must connect with the same account you originally signed in with.',
	title: 'Whoops. Wrong Account',
	},
	},
	*/
	dyn_login: {
		connect_wallet: { title: "Connect" },
		email_form: {
			email_field: { label: "Enter your email" },
			submit_button: { label: "Continue" }
		},
		email_or_phone: {
			use_email: "Use email",
			use_phone: "Use phone",
			prefer_email: "Prefer email sign up?",
			prefer_phone: "Prefer phone number sign up?"
		},
		helper: {
			all_wallet_list: "Get your first wallet",
			email_form: { invalid_email: "Invalid or incorrect email. Did you mistype it?" },
			pending_connect: { title: "Connecting a wallet" },
			pending_signature: { title: "Signing a wallet" },
			pending_signature_without_back_button: { title: "Signing a wallet" },
			phone_number_form: {
				invalid_phone: "Invalid or incorrect number. Did you mistype it?",
				invalid_sms_verification: "The code you entered is incorrect. Please try again.",
				too_many_sms_verification_attempts: "Too many verification attempts, please try again later."
			},
			qr_code: { title: "Connecting a wallet" },
			wallet_only: "Get your first wallet"
		},
		passkey: { button_label: "Sign in with Passkey" },
		qr_code: { title: "Connect" },
		separators: { default: "OR" },
		sign_wallet: { title: "Sign" },
		select_wallet_in_wallet_group: { title: "Select" },
		social: {
			button_label: "Continue with {{provider}}",
			overlay_title: "Choose a social account"
		},
		title: {
			all: "Log in or sign up",
			all_wallet_list: "Select your wallet",
			wallet_only: "Select your wallet"
		},
		wallet_group: { title: "Select Chain" },
		wallet_list: { button_only: "Continue with a wallet" },
		mobile_wallet_redirect: {
			backup_title: "Connect mobile app",
			prompt: "Tap 'Open' to continue",
			get_app_prompt: "Get",
			open_prompt: "Open",
			redirect_fail_message: "If the app doesn't open, you might need to download the {{walletName}} Wallet app.",
			app_store: "App Store",
			play_store: "Play Store"
		},
		wrong_social_account: {
			retry_button: "Try again",
			retry_title: "Please connect with: ",
			subtitle: "You must connect with the same account you originally signed in with.",
			title: "Whoops. Wrong Account"
		}
	},
	/**
	* @description copy keys for Dynamic manage passkeys view which are used inside dynamic widget
	* @default
	* {
	title: 'My passkeys',
	passkey_from: 'from',
	passkey_providers: {
	android: 'Android Phone',
	brave: 'Brave Browser',
	chrome: 'Google Chrome',
	edge: 'Microsoft Edge',
	firefox: 'Firefox',
	iPhone: 'iPhone',
	opera: 'Opera Browser',
	safari: 'Safari Browser',
	},
	passkey_rename: 'Rename',
	passkey_delete: 'Delete',
	recovery_button: 'Set up new passkey',
	}
	*/
	dyn_manage_passkeys: {
		title: "Manage passkeys",
		passkey_from: "from",
		passkey_providers: {
			android: "Android Phone",
			brave: "Brave Browser",
			chrome: "Google Chrome",
			edge: "Microsoft Edge",
			firefox: "Firefox",
			iPhone: "iPhone",
			opera: "Opera Browser",
			safari: "Safari Browser",
			passkey: "Passkey"
		},
		passkey_rename: "Rename",
		passkey_delete: "Delete",
		recovery_button: "Set up new passkey"
	},
	/**
	* @description copy keys for Dynamic rename passkey view
	* @default
	* {
	error: Whoops! There was an error updating your passkey
	input_label: 'Passkey name',
	save: 'Save',
	title: 'Rename your passkey',
	not_found: 'No passkeys found',
	}
	*/
	dyn_rename_passkeys: {
		error: "Whoops! There was an error updating your passkey",
		input_label: "Passkey name",
		save: "Save",
		title: "Rename your passkey",
		not_found: "No passkeys found"
	},
	/**
	* @description export keys for Dynamic embedded reveal view
	* @default
	* {
	title: 'Export wallet',
	agreement_title: 'Agree to continue',
	private_key_title: 'Private key',
	recovery_phrase_title: 'Secret recovery phrase',
	description:
	'Your wallet is non-custodial, meaning you are always in control of it.',
	statement_1: {
	title: 'Do not publicly share your {{keyType}}',
	description: 'Your {{keyType}} controls your account and assets.',
	},
	checkbox_label:
	'I am responsible for safeguarding and using my wallet key information.',
	reveal_description: 'Make sure to safely back up this information',
	reveal_button_label: 'Reveal',
	copy_button_label: 'Copy to clipboard',
	done_button_label: "I'm Done",
	aa_warning: {
	title: 'Your assets are not in this wallet.',
	subtitle:
	'This is a smart-contract wallet. You will not see your balance if you import this to an external service. Please send your assets to your preferred external wallet first to access your funds:',
	button: 'here',
	},
	unlink: 'Unlink wallet info',
	},
	*/
	dyn_embedded_reveal: {
		title: "Export wallet",
		agreement_title: "Agree to continue",
		prompt_for_export_title: "Back up wallet key",
		private_key_title: "Export Key",
		recovery_phrase_title: "Secret recovery phrase",
		badge_label: "Sensitive information",
		prompt_for_export_description: "Your wallet is ready. Back up your key to protect your assets.",
		statement_1: {
			title: "Non-custodial wallet",
			description: "You're always in control"
		},
		statement_2: { title: "Keep your key private. It controls your account and assets." },
		checkbox_label: "I am responsible for safeguarding and using my wallet key information.",
		reveal_description: "Make sure to safely back up this information",
		skip_button_label: "Skip for now",
		reveal_button_label: "Reveal",
		backup_button_label: "Back up now",
		copy_button_label: "Copy to clipboard",
		done_button_label: "I'm Done",
		aa_warning: {
			title: "Your assets are not in this wallet.",
			subtitle: "This is a smart-contract wallet. You will not see your balance if you import this to an external service. Please send your assets to your preferred external wallet first to access your funds:",
			button: "here"
		},
		unlink: "Unlink wallet info"
	},
	/**
	* @description export keys for Dynamic embedded delete view
	* @default
	*
	*/
	dyn_embedded_delete: {
		title: "Unlink from app",
		description_1: "By continuing you acknowledge that if you return to the application, you will receive a new wallet address.",
		description_2: "Once unlinked, you cannot recover any wallet information through this application including any associated smart contract wallets.",
		acknowledgement: "I have safely backed up my wallet seed phrase information. If I return to this application, a new wallet will be created for me.",
		cancel_button: "Cancel",
		action_button: "Unlink & Log out"
	},
	/**
	* @description Settings for Dynamic settings view which are used inside dynamic widget
	* @default
	* {
	global_connectivity_section: {
	title: 'Global Connectivity',
	connected_apps_button: 'Connected Apps',
	},
	export_section: {
	backup_button: 'Backup Key Share',
	backup_button_v2: 'Backup',
	export_button: 'Export Private Key',
	export_recovery_button: 'Export & Recovery',
	private_key_button: 'Private key',
	srp_button: 'Recovery phrase',
	title: 'Export & Backup',
	},
	identity_section: {
	title: 'Recovery',
	add_email_button: 'Add an email',
	},
	tags: { recommended: 'Recommended' },
	security_section: {
	email_auth_button: 'One time code',
	passkey_button: 'Passkeys',
	password_button: 'Passcode',
	mfa_button: 'Authenticator App',
	title: '2 factor authentication',
	},
	mfa_section: {
	title: 'MFA',
	passkey_button: 'Passkeys',
	totp_button: 'TOTP',
	passcode_button: 'Add Passcode',
	},
	wallet_security_section: {
	title: 'Wallet Security',
	passkey_button: 'Passkeys',
	},
	title: 'Settings',
	button_logout: 'Log out',
	empty_screen: {
	title: 'Nothing to see here yet!',
	},
	delete_account: {
	title: 'Delete My Account',
	description:
	'Deleting your account will permanently remove all data, including wallet details and linked smart contract wallets. This action cannot be undone.',
	backup_confirmation_embedded:
	"I confirm I've backed up my wallet keys. If I proceed, a new wallet will be created. Any wallets or assets not backed up will be lost permanently.",
	backup_confirmation_no_embedded:
	'I confirm that all of my information will be deleted. If I return, a new user profile will be created. These changes cannot be undone.',
	type_delete: 'Enter DELETE in the box below to confirm this action.',
	cancel: 'Cancel',
	confirm: 'Delete Account',
	deleting: 'Deleting...',
	type_delete_label: 'Type to confirm',
	},
	session_management: {
	title: 'Security Settings',
	session_management_button: 'Session Management',
	},
	}
	*/
	dyn_settings: {
		account_permissions_section: {
			title: "Account Permissions",
			delegated_wallets_button: "Delegated Wallets"
		},
		global_connectivity_section: {
			title: "Global Connectivity",
			connected_apps_button: "Connected Apps"
		},
		export_section: {
			backup_button: "Backup Key Share",
			backup_button_v2: "Backup",
			export_button: "Export Private Key",
			export_recovery_button: "Export & Recovery",
			private_key_button: "Private key",
			srp_button: "Recovery phrase",
			title: "Export & Backup"
		},
		identity_section: {
			title: "Recovery",
			add_email_button: "Add an email"
		},
		tags: { recommended: "Recommended" },
		security_section: {
			email_auth_button: "One time code",
			passkey_button: "Passkeys",
			password_button: "Passcode",
			mfa_button: "Authenticator App",
			title: "2 factor authentication"
		},
		mfa_section: {
			title: "MFA",
			passkey_button: "Passkeys",
			totp_button: "TOTP",
			passcode_button: "Add Passcode"
		},
		wallet_security_section: {
			title: "Wallet Security",
			passkey_button: "Passkeys"
		},
		title: "Settings",
		button_logout: "Log out",
		account_security: {
			title: "Account & Security",
			password: {
				title: "Password",
				button: "Set Up Password",
				set_button: "Set Password",
				reset_button: "Reset Password"
			}
		},
		empty_screen: { title: "Nothing to see here yet!" },
		delete_account: {
			title: "Delete My Account",
			description: "Deleting your account will permanently remove all data, including wallet details and linked smart contract wallets. This action cannot be undone.",
			backup_confirmation_embedded: "I confirm I've backed up my wallet keys. If I proceed, a new wallet will be created. Any wallets or assets not backed up will be lost permanently.",
			backup_confirmation_no_embedded: "I confirm that all of my information will be deleted. If I return, a new user profile will be created. These changes cannot be undone.",
			type_delete: "Enter DELETE in the box below to confirm this action.",
			cancel: "Cancel",
			confirm: "Delete Account",
			deleting: "Deleting...",
			type_delete_label: "Type to confirm"
		},
		session_management: {
			title: "Security Settings",
			session_management_button: "Session Management"
		}
	},
	/**
	* @description copy keys for global wallet view
	* @default
	*  {
	connect_to_apps: 'Connect to apps',
	scan_qr_code: 'Scan QR Code',
	or: 'OR',
	walletconnect_uri: 'WalletConnect URI',
	the_dapp: 'the dApp',
	this_app: 'this app',
	confirm: {
	title: 'Confirm Connection',
	description: 'Are you sure you want to connect to {{name}}?',
	cancel_button: 'Cancel',
	connect_button: 'Connect',
	},
	banner: {
	warning: 'There was an error connecting to {{name}}.',
	success: 'Successfully connected to {{name}}.',
	already_connected: 'You are already connected to {{name}}.',
	expired:
	'The link you entered expired, please get a new URI from the app.',
	bad_input:
	'Invalid URI. Please check below for how to find the valid URI.',
	},
	help: {
	title: 'How do I find the URI code?',
	step: {
	1: '1. Go to the website you want to connect to',
	2: '2. Locate the "Connect" or "Login" button',
	3: '3. Open WalletConnect from the list',
	},
	learn_more: 'Learn more about global wallets',
	},
	malicious_site: {
	certain: {
	title: 'Malicious app detected!',
	subtitle_header: 'Risk of losing funds',
	subtitle_text:
	'The site is known to exploit and or take assets from connected wallets.',
	go_back: 'Cancel',
	proceed: 'Proceed',
	},
	unknown: {
	title: 'Site verification did not run.',
	subtitle_header: 'Double check the app',
	subtitle_text:
	'We were unable to verify the vailidity of the app at this time.',
	go_back: 'Cancel',
	proceed: 'Proceed',
	},
	},
	connected_apps: {
	title: 'Connected Apps',
	no_connections: 'No connected apps',
	},
	},
	*/
	global_wallet: {
		connect_to_apps: "Connect to apps",
		scan_qr_code: "Scan QR Code",
		or: "OR",
		walletconnect_uri: "WalletConnect URI",
		the_dapp: "the dApp",
		this_app: "this app",
		confirm: {
			title: "Confirm Connection",
			description: "Are you sure you want to connect to {{name}}?",
			cancel_button: "Cancel",
			connect_button: "Connect"
		},
		banner: {
			warning: "There was an error connecting to {{name}}.",
			success: "Successfully connected to {{name}}.",
			already_connected: "You are already connected to {{name}}.",
			expired: "The link you entered expired, please get a new URI from the app.",
			bad_input: "Invalid URI. Please check below for how to find the valid URI."
		},
		help: {
			title: "How do I find the URI code?",
			step: {
				1: "1. Go to the website you want to connect to",
				2: "2. Locate the \"Connect\" or \"Login\" button",
				3: "3. Open WalletConnect from the list"
			},
			learn_more: "Learn more about global wallets"
		},
		malicious_site: {
			certain: {
				title: "Malicious app detected!",
				subtitle_header: "Risk of losing funds",
				subtitle_text: "The site is known to exploit and or take assets from connected wallets.",
				go_back: "Cancel",
				proceed: "Proceed"
			},
			unknown: {
				title: "Site verification did not run.",
				subtitle_header: "Double check the app",
				subtitle_text: "We were unable to verify the vailidity of the app at this time.",
				go_back: "Cancel",
				proceed: "Proceed"
			}
		},
		connected_apps: {
			title: "Connected Apps",
			subtitle: "Connected apps allow you to interact with your wallet on other platforms.",
			success: "Successfully connected to {{name}}.",
			delegate_wallets: {
				title: "Delegated Wallets",
				button: "Delegated Wallets"
			}
		}
	},
	/**
	* @description copy keys for wallets delegated view
	* @default
	* {
	*   title: 'Wallets Delegated',
	*   subtitle: 'Delegated wallets allow you to interact with your wallet on other platforms.',
	* },
	*/
	wallets_delegated: {
		title: "Wallets Delegated",
		subtitle: "Delegated wallets allow you to interact with your wallet on other platforms."
	},
	/**
	* @description copy keys for totp mfa management view
	* @default
	*  {
	title: 'Authenticator App',
	add_mfa_button: 'Authenticator App',
	no_devices: 'No authenticator apps configured',
	generate_backup_codes_button: 'Get new backup codes',
	},
	*/
	dyn_manage_mfa: {
		title: "Authenticator App",
		add_mfa_button: "Authenticator App",
		no_devices: "No authenticator apps configured",
		generate_backup_codes_button: "Get new backup codes",
		delete: "Delete"
	},
	/**
	* @description copy keys for passkeys mfa management view
	* @default
	*  {
	*    title: 'Passkeys',
	*    add_passkey_button: 'Passkey',
	*    no_passkeys: 'No passkeys set up yet',
	*  },
	*/
	dyn_manage_passkeys_mfa: {
		title: "Passkeys",
		add_passkey_button: "Passkey",
		no_passkeys: "No passkeys set up yet"
	},
	/**
	* @description copy keys for waas backup unsuccessful view
	* @default
	* {
	title: 'Backup Unsuccessful',
	description: "We weren't able to back up your wallet. To keep things secure, we'll need to refresh and generate a new wallet for you.",
	try_again: 'Try Again',
	},
	*/
	dyn_waas: {
		backup_unsuccessful: {
			title: "Let's try that again",
			description: "It looks like setup didn't finish all the way. Click below and we'll get you back on track.",
			try_again: "Try Again",
			log_out: "Log Out"
		},
		backup_info: {
			title: "About Backup",
			subtitle: "Why backup as shares?",
			description: "As a security best practice, you can store two independent recovery shares. This lets you restore your wallet from your own backups alone, giving you full control over the recovery process",
			warning: "You'll need both parts to recover your wallet, and they should never be stored together"
		},
		backup: {
			title: "Backup Key Share",
			subtitle: "Secure your wallets as a two-part backup. One part saved to your cloud, the other to your device. You will need both to recover your wallets.",
			checkbox_label: "I understand I must keep both parts secure and separate",
			continue_button: "Continue to Backup",
			cloud_backup_title: "1. Cloud Backup",
			cloud_backup_subtitle: "Back up your first key share to a cloud provider",
			cloud_backup_header: "Cloud Backup",
			backup_to_google_drive: "Backup to Google Drive",
			backup_to_icloud: "Backup to iCloud",
			icloud_ready_title: "Sign in to backup",
			icloud_ready_subtitle: "Sign in with your Apple ID below, then continue to backup your wallet.",
			sign_in_with_icloud: "Sign in with iCloud",
			continue_backup: "Continue",
			progress_title: "Backing up {{current}} of {{total}} wallets...",
			progress_initializing: "Preparing backup...",
			progress_subtitle: "Securely saving to your cloud. Don't close this window",
			progress_complete: "Backup complete!",
			google_drive_title: "Backup Key Share",
			google_drive_description: "Back up your wallet to help protect your access and recover it if needed.",
			google_drive: "Google Drive",
			backed_up: "BACKED UP",
			google_drive_subtitle: "Secure cloud backup with your Google account.",
			back_up: "Back Up",
			error: "Failed to back up wallet. Please try again.",
			download_title: "2. Download",
			download_subtitle: "Download your second key share and store it securely on your local device",
			download_key_share: "Download Key Share",
			downloading: "Downloading...({{current}}/{{total}})",
			download_complete: "Download Complete",
			download_error: "Failed to download key share. Please try again.",
			success_title: "Backup Successful",
			success_description_one: "Your local key shares have been successfully downloaded for {{count}} wallet. Store these files securely and separately from your cloud backup.",
			success_description_other: "Your local key shares have been successfully downloaded for {{count}} wallets. Store these files securely and separately from your cloud backup.",
			done: "Done",
			error_title: "Cloud backup failed. Don't worry, your account is still safe.",
			error_try_again: "Try Again",
			gdrive_grant_access_title: "Confirm Drive permission",
			gdrive_grant_access_subtitle: "Allow {{appName}} to save an encrypted backup file to your Google Drive.",
			gdrive_grant_access_cta: "Grant access",
			gdrive_grant_access_cancel: "Cancel",
			gdrive_grant_access_error: "We couldn't get Drive permission. Please try again.",
			gdrive_post_flight_title: "Drive permission was missing. Grant access and we'll finish the backup."
		}
	},
	/**
	* @description copy keys for mfa views
	* @default
	* {
	choose_device_view: {
	title: 'Secure your account',
	select_options: 'Protect your account by adding multi-factor authentication',
	authenticator_app: 'Authenticator app',
	authenticator_app_description:
	'Use your preferred authenticator app such as Authy, Google Authenticator, etc.',
	passkey: 'Passkey',
	passkey_description: 'Works across devices & secured with biometrics to prevent phishing attempts.',
	backup_code: 'Backup code',
	backup_code_description:
	'Enter one of your saved backup codes to authenticate.',
	choose_another_method:  'Choose another method',
	choose_another_method_description: 'Use one of the methods below:',
	logout: 'Log out',
	},
	display_backup_codes_view: {
	title: 'Back up your codes',
	body: 'Backup codes help recover your account if you lose access to your device. Each code can be used only 1 time.',
	warning: 'You won’t be able to see these again',
	copy_all: 'Copy all',
	download: 'Download',
	checkbox: 'I have safely stored a copy of my backup codes',
	complete: 'Complete',
	},
	otp_verification_view: {
	title: 'Confirm verification code',
	body: 'Enter the verification code generated by your authenticator app',
	error: 'Invalid code. Please try again.',
	rate_limit_error: 'Too many attempts, please try again later.',
	choose_another_method: 'Use a different method',
	logout: 'Log out',
	},
	secure_device_view: {
	title: 'Secure your account',
	body: 'Setup a new sign-in method in your authenticator app',
	continue: 'Continue',
	helper: {
	button: "Can't scan QR Code?",
	title: 'Troubles with scanning?',
	step1: {
	title: 'Open your Authenticator App',
	description: 'You will set up a new sign-in method',
	},
	step2: {
	title: 'Enter the key provided below',
	description: 'Make sure time-based or one-time password is enabled.',
	},
	uri: {
	title: 'Copy the full URI',
	description:
	'This only works if your authenticator app supports TOTP URIs',
	},
	},
	logout: 'Log out',
	},
	recovery_view: {
	title: 'Enter your backup code',
	body: 'Your backup code is one of the 10 codes you received when you first enrolled in multi-factor authentication',
	input_label: 'Enter back up code',
	button_label: 'Continue',
	get_help: {
	description: 'Missing your back up codes?',
	button_label: 'Get Help',
	},
	helper: {
	title: 'Mfa Recovery Help',
	},
	},
	setup_passkey_view: {
	title: 'Set up your passkey',
	description: 'Passkeys help safeguard your account and make access easier. Finish set up in just a few seconds.',
	},
	confirm_passkey_view: {
	title: 'Confirm your passkey',
	description: 'Use your saved passkey to verify your identity and continue securely.',
	error: {
	not_allowed: 'The passkey request timed out or was rejected.',
	},
	},
	},
	*/
	dyn_mfa: {
		choose_device_view: {
			title: "Secure your account",
			select_options: "Protect your account by adding multi-factor authentication",
			authenticator_app: "Authenticator app",
			authenticator_app_description: "Use your preferred authenticator app such as Authy, Google Authenticator, etc.",
			passkey: "Passkey",
			passkey_description: "Works across devices & secured with biometrics to prevent phishing attempts.",
			backup_code: "Backup code",
			backup_code_description: "Enter one of your saved backup codes to authenticate.",
			choose_another_method: "Choose another method",
			choose_another_method_description: "Use one of the methods below:",
			logout: "Log out"
		},
		display_backup_codes_view: {
			title: "Back up your codes",
			body: "Backup codes help recover your account if you lose access to your device. Each code can be used only 1 time.",
			warning: "You won’t be able to see these again",
			copy_all: "Copy all",
			download: "Download",
			checkbox: "I've safely stored a copy of my backup codes",
			complete: "Complete"
		},
		otp_verification_view: {
			title: "Confirm verification code",
			body: "Enter the verification code generated by your authenticator app",
			error: "Invalid code. Please try again.",
			rate_limit_error: "Too many attempts, please try again later.",
			choose_another_method: "Use a different method",
			logout: "Log out"
		},
		secure_device_view: {
			title: "Secure your account",
			body: "Setup a new sign-in method in your authenticator app",
			continue: "Continue",
			helper: {
				button: "Can't scan QR Code?",
				title: "Troubles with scanning?",
				step1: {
					title: "Open your Authenticator App",
					description: "You will set up a new sign-in method"
				},
				step2: {
					title: "Enter the key provided below",
					description: "Make sure time-based or one-time password is enabled."
				},
				uri: {
					title: "Copy the full URI",
					description: "This only works if your authenticator app supports TOTP URIs"
				}
			},
			logout: "Log out"
		},
		recovery_view: {
			title: "Enter your backup code",
			body: "Your backup code is one of the 10 codes you received when you first enrolled in multi-factor authentication",
			input_label: "Enter back up code",
			button_label: "Continue",
			get_help: {
				description: "Missing your back up codes?",
				button_label: "Get Help"
			},
			helper: { title: "Mfa Recovery Help" }
		},
		setup_passkey_view: {
			title: "Set up your passkey",
			description: "Passkeys help safeguard your account and make access easier. Finish set up in just a few seconds."
		},
		confirm_passkey_view: {
			title: "Confirm your passkey",
			description: "Use your saved passkey to verify your identity and continue securely.",
			error: { not_allowed: "The passkey request timed out or was rejected." }
		}
	},
	/**
	* @description copy keys for merge user accounts view
	* @default
	* {
	confirm_button: 'Merge accounts',
	errors: {
	merge_error: 'Something went wrong, please try again.',
	},
	wallet: {
	content: 'This wallet is associated to another account. Would you like to merge accounts?',
	title: 'Wallet already in use',
	},
	}
	*/
	dyn_merge_user_accounts: {
		confirm_button: "Merge accounts",
		errors: { merge_error: "Something went wrong, please try again." },
		wallet: {
			content: "This wallet is associated to another account. Would you like to merge accounts?",
			title: "Wallet already in use"
		}
	},
	/**
	* @description copy keys for merge user accounts conflicts view
	* @default
	* {
	confirm_button: 'Confirm & Merge',
	description:
	'You have some conflicting information. Please select your preferences',
	errors: {
	merge_error: 'Something went wrong, please try again.',
	},
	title: 'Confirm your preferences',
	}
	*/
	dyn_merge_user_accounts_conflicts: {
		confirm_button: "Confirm & Merge",
		description: "You have some conflicting information. Please select your preferences",
		errors: { merge_error: "Something went wrong, please try again." },
		title: "Confirm your preferences"
	},
	/**
	* @description copy keys for merge user accounts view when using email associated to a different account
	* @default
	* {
	cancel_button: "No, I'll use a different email",
	confirm_button: 'Yes, link to existing account',
	errors: {
	merge_error: 'Something went wrong, please try again.',
	},
	existing_account: 'An account already exists that uses',
	existing_account_trail: 'email.',
	title: 'Would you like to link this wallet to this existing account?',
	}
	*/
	dyn_merge_user_accounts_with_same_email: {
		cancel_button: "No, I'll use a different email",
		confirm_button: "Yes, link to existing account",
		errors: { merge_error: "Something went wrong, please try again." },
		existing_account: "An account already exists that uses",
		existing_account_trail: "email.",
		title: "Would you like to link this wallet to this existing account?"
	},
	/**
	* @description copy key for Dynamic need help footer section
	* @default
	* {
	info: 'Problem Signing?',
	contact_support: 'Contact support',
	divider: 'or',
	help_button: 'go here.',
	}
	*/
	dyn_need_help_section: {
		info: {
			v1: "Need Help?",
			not_v1: "Need help? Get in touch:"
		},
		contact_support: "Contact support",
		divider: "or",
		help_button: "Go here for support",
		visit_platform: "Visit {{platform}}"
	},
	/**
	* @description copy keys for network not supported view
	* @default
	* {
	button: 'Switch Network',
	subtitle: 'Your wallet is not connected to a supported network. Please update before continuing.',
	title: 'Update Network',
	warning_message: 'This network is not available, please update.',
	}
	*/
	dyn_network_not_supported: {
		button: "Switch Network",
		subtitle: "Your wallet is not connected to a supported network. Please update before continuing.",
		title: "Update Network",
		warning_message: "This network is not available, please update.",
		wallet: "Not Supported"
	},
	/**
	* @description copy keys for network not supported view for manual switch
	* @default
	* {
	subtitle_network_defined_metamaskstarknet:
	'To continue, please update the network in your wallet to {{network}} by visiting the Starknet Snap companion app',
	subtitle_network_defined_metamaskstarknet_companion_app: 'companion app',
	subtitle_network_defined: 'To continue, please update the network in your wallet to {{network}}',
	subtitle_no_network_defined: 'Your wallet does not support switching networks from this app. Switch networks directly in your wallet.',
	title: 'Update your Network',
	warning_message: 'This network is not available, please update.',
	}
	*/
	dyn_network_not_supported_manual_switch: {
		subtitle_network_defined_metamaskstarknet: "To continue, please update the network in your wallet to {{network}} by visiting the Starknet Snap",
		subtitle_network_defined_metamaskstarknet_companion_app: "companion app",
		subtitle_network_defined: "To continue, please update the network in your wallet to {{network}}",
		subtitle_no_network_defined: "Your wallet does not support switching networks from this app. Switch networks directly in your wallet.",
		title: "Update your Network",
		warning_message: "This network is not available, please update."
	},
	/**
	* @description copy keys for no access view
	* @default
	* {
	chainalysis: {
	button_text: 'Try another method',
	description: 'This wallet has been correlated to illicit activity and cannot access this site.',
	social_media_link_text: 'Why am I seeing this message?',
	social_media_link_url: 'https://docs.dynamic.xyz/docs',
	title: 'This address seems corrupted.',
	},
	default: {
	button_text: 'Try another method',
	description: "You are not currently on the allow list.",
	title: 'Access denied',
	},
	gate: {
	button_text: 'Try a different wallet',
	description: 'A NFT or a token is required to access this site.',
	title: 'You cannot access the site',
	},
	not_in_the_list_image_alt: 'user is not in the list',
	title: "You don't have access",
	}
	*/
	dyn_no_access: {
		chainalysis: {
			button_text: "Try another method",
			description: "This wallet has been correlated to illicit activity and cannot access this site.",
			social_media_link_text: "Why am I seeing this message?",
			social_media_link_url: "https://docs.dynamic.xyz/docs",
			title: "This address seems corrupted."
		},
		default: {
			button_text: "Try another method",
			description: "You are not currently on the allow list.",
			title: "Access denied"
		},
		gate: {
			button_text: "Try a different wallet",
			description: "A NFT or a token is required to access this site.",
			title: "You cannot access the site"
		},
		not_in_the_list_image_alt: "user is not in the list",
		title: "You don't have access"
	},
	/**
	* @description copy keys for email OTP verification for magiclink
	* @default
	* {
	banner_text: 'Sign in to access your email based wallet',
	}
	*/
	dyn_magic_verification: { banner_text: "Sign in to access your email based wallet" },
	/**
	* @description copy key for passkey created success banner
	* @default
	* {
	text: 'A new passkey has been created',
	}
	*/
	dyn_passkey_success: {
		created: "A new passkey has been created",
		edited: "Your passkey has been edited"
	},
	/**
	* @description copy keys for passkey intro view
	* @default
	* {
	button: 'Set up a passkey',
	button_logout: 'Log out',
	button_skip: 'Skip for now',
	disabled: 'Passkeys are not available on this device or browser. Please open on Chrome, Safari, or Brave to continue',
	helper: {
	section_1: {
	description: 'Passkeys are a standard built by Apple, Google and others, and eliminates the use of passwords.',
	title: 'Built by Apple and Google',
	},
	section_2: {
	description: 'Passkeys are stored on your phone and are not shared with anyone.',
	title: 'Secure and Private',
	},
	title: "What's Passkey",
	tooltip: 'Need some help?',
	},
	sms_auth: {
	title: 'Finish set up',
	description:
	'Add a security method to finish your profile and complete transactions',
	},
	subtitle: 'Passkeys are stored natively to your device with a biometric and can only be accessed by you.',
	title: 'Secure your wallet',
	}
	*/
	dyn_passkey_intro: {
		button: "Set up a passkey",
		button_logout: "Log out",
		button_skip: "Skip for now",
		disabled: "Passkeys are not available on this device or browser. Please open on Chrome, Safari, or Brave to continue",
		helper: {
			section_1: {
				description: "Passkeys are a standard built by Apple, Google and others, and eliminates the use of passwords.",
				title: "Built by Apple and Google"
			},
			section_2: {
				description: "Passkeys are stored on your phone and are not shared with anyone.",
				title: "Secure and Private"
			},
			title: "What's Passkey",
			tooltip: "Need some help?"
		},
		sms_auth: {
			title: "Finish set up",
			description: "Add a security method to finish your profile and complete transactions"
		},
		subtitle: "Passkeys are stored natively to your device with a biometric and can only be accessed by you.",
		title: "Secure your wallet"
	},
	/**
	* @description copy keys for passkey new domain detected modal
	* @default
	* {
	title: 'New domain detected',
	description: 'To complete your transaction select a signing method',
	actions: {
	passkey: {
	title: 'Add new passkey',
	subtitle: 'Does not expire. Works across devices & secured with biometric.',
	},
	emailAuth: {
	title: 'Use a one-time code',
	subtitle: 'Allows you to transact for 30 min',
	},
	badges: {
	recommended: 'Recommended',
	fastest: 'Fastest',
	},
	},
	}
	*/
	dyn_passkey_new_domain_detected: {
		title: "New domain detected",
		description: "To complete your transaction select a signing method",
		actions: {
			passkey: {
				title: "Add new passkey",
				subtitle: "Does not expire. Works across devices & secured with biometric."
			},
			emailAuth: {
				title: "Use a one-time code",
				subtitle: "Allows you to transact for 30 min"
			},
			badges: {
				recommended: "Recommended",
				fastest: "Fastest"
			}
		}
	},
	/**
	* @description copy keys for passkeys recovery flow
	* @default
	* {
	add_email: {
	description:
	'Don’t get locked out if you delete your passkey or lose your device.',
	input_label: 'Enter your email',
	title: 'Add a recovery email',
	confirm_button: 'Confirm with a passkey',
	skip_button: 'Skip for now',
	success_message: 'Recovery email added!',
	},
	code: {
	description: 'A verification code has been sent to {{email}}',
	input_label: 'Enter your code here...',
	title: 'Verification code sent',
	resend: {
	button: 'Resend code',
	text: "Didn't receive a code?",
	},
	},
	complete: {
	complete_button: 'Create a passkey',
	description: 'Secure your wallet by adding a new passkey.',
	title: 'Create a new passkey',
	},
	start: {
	description:
	'To complete this process, ensure you are using the same device/browser.',
	start_button: 'Send me an email',
	title: 'Initiate Request',
	},
	}
	*/
	dyn_passkey_recovery: {
		add_email: {
			description: "Don’t get locked out if you delete your passkey or lose your device.",
			input_label: "Enter your email",
			title: "Add a recovery email",
			confirm_button: "Confirm with a passkey",
			skip_button: "Skip for now",
			success_message: "Recovery email added!"
		},
		code: {
			description: "A verification code has been sent to {{email}}",
			input_label: "Enter your code here...",
			title: "Verification code sent",
			resend: {
				button: "Resend code",
				text: "Didn't receive a code?"
			}
		},
		complete: {
			complete_button: "Create a passkey",
			description: "Secure your wallet by adding a new passkey.",
			title: "Create a new passkey"
		},
		start: {
			description: "To complete this process, ensure you are using the same device/browser.",
			start_button: "Send me an email",
			title: "Initiate Request"
		}
	},
	/**
	* @description copy keys for Dynamic pending wallet connection
	* @default
	* {
	mobile: 'Click connect in your mobile wallet',
	computer: 'Click connect in your wallet popup',
	}
	*/
	dyn_pending_connection: {
		title: "Connect",
		mobile: "Click connect in your mobile wallet",
		computer: "Click connect in your wallet popup"
	},
	/**
	* @description copy keys for Dynamic pending signature, we have overrides for phantom ledger which does not support message signing.
	* @default
	* {
	click_to_sign: 'Click to Sign',
	link_wallet_message: 'Sign the message in your wallet to approve linking this wallet to your account',
	note: 'Note: ',
	phantom_ledger_sign: "Click sign in your wallet to confirm you own this wallet (this doesn't cost gas).",
	phantom_ledger_warning: "Ledger with Phantom doesn't support message signing. When logging in, a small fee (which should not apply) may appear. See below to learn more.",
	regular_sign_description: 'Click sign-in in your wallet to confirm you own this wallet.',
	}
	*/
	dyn_pending_signature: {
		click_to_sign: "Click to Sign",
		link_wallet_message: "Sign the message in your wallet to approve linking this wallet to your account",
		note: "Note: ",
		phantom_ledger_sign: "Click sign in your wallet to confirm you own this wallet (this doesn't cost gas).",
		phantom_ledger_warning: "Ledger doesn't support message signing. When logging in, a small fee (which should not apply) may appear. See below to learn more.",
		regular_sign_description: "Click sign-in in your wallet to confirm you own this wallet."
	},
	/**
	* @description copy keys for Dynamic QR code Wallet Connection Pop-Up
	* @default
	* {
	copy_button: 'Copy QR URI',
	get_extension_button: 'Get extension',
	open_button: 'Open App',
	scan_title: "Scan this QR code from your mobile {{app}} or phone's camera to connect.",
	wallet_not_installed: {
	browser_install: 'Install {{browser}} extension',
	install: 'Install {{wallet}} extension to connect',
	refresh: 'Refresh the page once installed',
	select: 'Select from your preferred options below:',
	},
	}
	*/
	dyn_qr_code: {
		copy_button: "Copy QR URI",
		get_extension_button: "Get Extension",
		open_button: "Open App",
		scan_title: "Scan this QR code from your mobile {{app}} or phone's camera to connect.",
		wallet_not_installed: {
			browser_install: "Install {{browser}} extension",
			install: "Install {{wallet}} extension to connect",
			refresh: "Refresh the page once installed",
			select: "Select from your preferred options below:"
		}
	},
	/**
	* @description copy keys for Dynamic wallet locked/disconnected
	* @default
	* {
	connect_continue: 'Connect your wallet to continue',
	title: 'Welcome back',
	subtitle: "We couldn't connect to your wallet. Click connect to retry the connection ",
	connect: 'Connect wallet',
	logout: 'Log out',
	}
	*/
	dyn_wallet_locked: {
		connect_continue: "Connect your wallet to continue",
		title: "Welcome back",
		subtitle: "We couldn't connect to your wallet. Click connect to retry the connection ",
		connect: "Connect wallet",
		logout: "Log out"
	},
	/**
	* @description copy keys for passkeys creation flow for existent embedded wallets
	* @default
	* {
	code: {
	action_based_description: 'To {{action}} verify account.',
	description: 'A secure code has been sent to {{email}}.',
	input_label: 'Enter your code here...',
	title: 'Verification code sent',
	resend: {
	button: 'Resend code',
	text: "Didn't receive a code?",
	},
	complete_transaction_action: 'complete transaction',
	sign_message_action: 'sign this message',
	},
	complete: {
	complete_button: 'Create a passkey',
	description:
	'Passkeys are stored natively to your device with a biometric and can only be accessed by you.',
	title: 'Secure your account',
	},
	start: {
	description:
	'A one-time security code will be sent to the email on file. It will expire in 15 minutes.',
	start_button: 'Send me an email',
	title: 'Send Email Code',
	},
	}
	*/
	dyn_passkey_secure_modal: {
		code: {
			action_based_description: "To {{action}} verify account.",
			description: "A secure code has been sent to {{email}}.",
			input_label: "Enter your code here...",
			title: "Verification code sent",
			resend: {
				button: "Resend code",
				text: "Didn't receive a code?"
			},
			complete_transaction_action: "complete transaction",
			sign_message_action: "sign this message"
		},
		complete: {
			complete_button: "Create a passkey",
			description: "Passkeys are stored natively to your device with a biometric and can only be accessed by you.",
			title: "Secure your account"
		},
		start: {
			description: "A one-time security code will be sent to the email on file. It will expire in 15 minutes.",
			start_button: "Send me an email",
			title: "Send Email Code"
		}
	},
	/**
	* @description copy keys for save password view
	* @default
	* {
	badge_text: 'Important!',
	checkbox_label: 'I have safely stored a copy of my passcode.',
	continue: 'Continue',
	copy_button: {
	copy: 'Copy',
	copied: 'Copied',
	},
	description: 'You must retain a copy of this passcode.',
	download_button: 'Download',
	logout: 'Log out',
	password_input: {
	label: 'Passcode',
	placeholder: 'Passcode',
	},
	title: 'Save passcode',
	warning:
	'If you lose your passcode, you cannot recover access to your account.',
	}
	*/
	dyn_save_password: {
		badge_text: "Important!",
		checkbox_label: "I have safely stored a copy of my passcode.",
		continue: "Continue",
		copy_button: {
			copy: "Copy",
			copied: "Copied"
		},
		description: "You must retain a copy of this passcode.",
		download_button: "Download",
		logout: "Log out",
		password_input: {
			label: "Passcode",
			placeholder: "Passcode"
		},
		title: "Save passcode",
		warning: "If you lose your passcode, you cannot recover access to your account."
	},
	/**
	* @description copy keys for setup password flow
	* @default
	* {
	terms: {
	title: 'Set up password',
	description: 'Before setting up a password, please acknowledge the following:',
	checkbox_1: 'I understand that if I lose my password, I will permanently lose access to my wallet and all assets.',
	checkbox_2: 'I understand that Dynamic support cannot recover my password or access my wallet.',
	checkbox_3: 'I understand that this password is only for this application and cannot be used elsewhere.',
	},
	enter: {
	title: 'Create password',
	description: 'Set a strong password to protect your wallet.',
	label: 'Password',
	placeholder: 'Enter password',
	requirement_length: '8-70 characters',
	requirement_uppercase: '1 uppercase letter',
	requirement_lowercase: '1 lowercase letter',
	requirement_number: '1 number',
	requirement_symbol: '1 special character',
	},
	confirm: {
	title: 'Confirm password',
	description: 'Re-enter your password to confirm.',
	label: 'Confirm password',
	placeholder: 'Re-enter password',
	match: 'Passwords match',
	mismatch: 'Passwords do not match',
	},
	knowledge_check: {
	title: 'Knowledge check',
	question: 'What happens if you lose your password?',
	option_a: 'I can reset it through email',
	option_b: 'Support can help me recover access',
	option_c: 'I will permanently lose access to my wallet',
	error: 'Incorrect. If you lose your password, you will permanently lose access to your wallet and all assets.',
	},
	success: {
	title: 'Password created successfully!',
	description: 'All set! You have successfully created a password.',
	},
	button: {
	continue: 'Continue',
	confirm: 'Confirm',
	done: 'Done',
	},
	}
	*/
	dyn_setup_password: {
		terms: {
			title: "Set up password",
			description: "Before setting up a password, please acknowledge the following:",
			checkbox_1: "I understand that if I lose my password, I will permanently lose access to my wallet and all assets.",
			checkbox_2: "I understand that {{appName}} support cannot recover my password or access my wallet.",
			checkbox_3: "I understand that this password is only for this application and cannot be used elsewhere."
		},
		enter: {
			title: "Create password",
			description: "Set a strong password to protect your wallet.",
			label: "Password",
			placeholder: "Enter password",
			requirement_length: "8-70 characters",
			requirement_uppercase: "1 uppercase letter",
			requirement_lowercase: "1 lowercase letter",
			requirement_number: "1 number",
			requirement_symbol: "1 special character"
		},
		confirm: {
			title: "Confirm password",
			description: "Re-enter your password to confirm.",
			label: "Confirm password",
			placeholder: "Re-enter password",
			match: "Passwords match",
			mismatch: "Passwords do not match",
			error: { failed: "Failed to set up password. Please try again." }
		},
		knowledge_check: {
			title: "Knowledge check",
			description: "Answer the question to confirm you understand.",
			question: "What happens if you lose your password?",
			option_a: "I can reset it via email",
			option_b: "Support can recover my access",
			option_c: "I permanently lose access to my wallet",
			error: "Incorrect. No password recovery — you’ll lose access permanently. Choose the correct answer and try again.",
			review_terms: "Review terms again"
		},
		success: {
			title: "Password created successfully!",
			description: "All set! You have successfully created a password."
		},
		button: {
			continue: "Continue",
			confirm: "Confirm",
			done: "Done"
		}
	},
	dyn_reset_password: {
		current: {
			title: "Enter Current Password",
			description: "Confirm your current password to continue",
			label: "Your current Password",
			placeholder: "Enter your password",
			error: {
				required: "Password is required",
				invalid_password: "Current password is incorrect",
				failed: "Failed to verify password"
			}
		},
		enter: {
			title: "Reset password",
			description: "Set a strong password to protect your wallet.",
			same_password_error: "New password cannot be the same as your current password"
		},
		confirm: {
			title: "Confirm your Password",
			description: "Enter your password again to verify you've securely saved it.",
			acknowledgment: "I understand that if I lose my password I will lose access to my account and my assets. Keep your password safe.",
			error: { failed: "Failed to update password. Please try again." }
		},
		success: {
			title: "Password updated successfully!",
			description: "All set! You have successfully reset your password."
		}
	},
	/**
	* @description copy keys for unlock wallet view
	* @default
	* {
	title: 'Enter Password',
	description: 'Enter your password to continue with this action. The wallet will be unlocked for the duration of this session.',
	button: {
	continue: 'Continue'
	}
	}
	*/
	dyn_unlock_wallet: {
		title: "Enter Password",
		description: "Enter your password to continue with this action. The wallet will be unlocked for the duration of this session.",
		button: { continue: "Continue" }
	},
	/**
	* @description copy keys for secure pregenerated embedded wallet
	* @default
	* {
	description: 'Make transactions simpler and more secure.',
	action: 'Get started'
	}
	*/
	dyn_secure_pregenerated_wallet: {
		description: "Make transactions simpler and more secure.",
		action: "Get started"
	},
	dyn_duplicate_wallet: {
		title: "Choose Another Wallet",
		description: "You’ve selected the same wallet for both sending and receiving. To continue, choose a different wallet.",
		return: "Return to wallet list"
	},
	dyn_secondary_wallet: {
		title: "Select Wallet",
		copy_address: "Copy address",
		view_address: "View address",
		copy_ens: "Copy ENS",
		view_ens: "View ENS",
		unlink: "Unlink",
		switch_wallet: "Switch wallet",
		unlink_from_account: "Unlink from my account",
		disconnect_from_account: "Disconnect from my account",
		export: "Export private keys",
		connect_new: "Connect new",
		link_new: "Link new"
	},
	/**
	* @description copy keys for send transaction flow views
	* @default
	* {
	confirmation: {
	cancel_button: 'Cancel',
	confirm_button: 'Confirm',
	data: {
	amount: 'Amount',
	from: 'From (You)',
	gas: 'Gas',
	gas_estimate: 'Network Fee',
	to: 'To',
	total: 'Total',
	},
	not_applied: 'N/A',
	title: 'Confirm transaction',
	},
	data: {
	amount: {
	label: 'Amount',
	placeholder: 'Select amount',
	},
	balance: {
	label: 'Balance:',
	},
	from: 'Send from',
	recipient: {
	label: 'Recipient',
	placeholder: 'Enter wallet address...',
	},
	},
	multiple_recipients: 'Multiple',
	send_button: 'Send now',
	succeeded: {
	continue_button: 'Continue',
	network: {
	label: 'Network',
	},
	recipient: {
	label: 'Recipient',
	},
	title: 'Transaction successfully sent',
	total_amount: {
	label: 'Total amount',
	},
	},
	validation: {
	amount: {
	invalid_decimals: 'Please enter a value up to the {{decimals}}th decimal place.',
	invalid_format: 'The amount is in invalid format',
	non_zero: 'Enter an amount greater than 0.',
	over_balance: 'Insufficient funds to send this amount.',
	required: 'The amount field is required',
	},
	recipient: {
	invalid_format: 'The address is in invalid format',
	required: 'The recipient is required',
	},
	},
	warning_message: {
	insufficient_funds: 'Insufficient funds due to gas price increase from estimate. Please add {{amountLeft}} {{currencySymbol}} to continue.',
	},
	error_message: {
	gas_not_sponsored: 'The gas fee has increased. Confirm if you still want to complete this transaction.',
	},
	}
	*/
	dyn_send_transaction: {
		confirmation: {
			cancel_button: "Cancel",
			confirm_button: "Confirm",
			send: "Confirm",
			data: {
				amount: "Amount",
				from: "From (You)",
				gas: "Gas",
				gas_estimate: "Network Fee",
				to: "To",
				total: "Total",
				wallet_used: "Wallet used",
				network: "Network",
				recipient: "Recipient",
				destination: "Interacting with",
				gas_tooltip: "Gas fees are charged by the network and can change quickly based on usage.",
				sending: "Sending",
				receiving: "Receiving",
				transfer: {
					send: "Send",
					receive: "Receive"
				}
			},
			not_applied: "N/A",
			title: "Confirm transaction"
		},
		data: {
			amount: {
				label: "Amount",
				placeholder: "Enter amount"
			},
			balance: { label: "Balance:" },
			from: "Send from",
			send: "Send",
			send_preview: "Send Preview",
			confirmation_tx: "Confirm Transaction",
			banner: "You're nearly done! Confirm transaction to proceed.",
			recipient: {
				label: "Address",
				placeholder: "Enter wallet address..."
			},
			fee_token_label: "Pay fees with",
			fee_token_embedded_only: "Fee token selection is only available with embedded wallets",
			select_token: "Select any token",
			symbol_available: "{{symbol}} Available"
		},
		multiple_recipients: "Multiple",
		preview_transaction: "Preview transaction",
		send_button: "Send now",
		succeeded: {
			continue_button: "Done",
			network: { label: "Network" },
			recipient: { label: "Recipient" },
			title: "Transaction successfully sent to",
			total_amount: { label: "Total amount" }
		},
		validation: {
			amount: {
				invalid_decimals: "Please enter a value up to the {{decimals}}th decimal place.",
				invalid_format: "The amount is in invalid format",
				non_zero: "Enter an amount greater than 0.",
				over_balance: "Insufficient funds to send this amount.",
				required: "The amount field is required"
			},
			recipient: {
				invalid_format: "The address is in invalid format",
				required: "The recipient is required"
			}
		},
		info_message: { refresh_balance_time: "Your balance may take up to 30s to refresh." },
		warning_message: {
			insufficient_funds: {
				title: "Insufficient funds",
				description: "Insufficient funds for transaction. Please add {{amountLeft}} {{currencySymbol}} to continue."
			},
			insufficient_gas_funds: {
				title: "Insufficient gas funds",
				description: "Please add {{amountLeft}} {{currencySymbol}} to continue."
			},
			failed_simulation: {
				title: "Transaction expected to fail",
				description: "Something went wrong. Check your balances and try again."
			}
		},
		error_message: {
			confirmation_timeout: "Transaction confirmation timed out. The transaction may have succeeded. Check the link below to verify.",
			confirmation_timeout_with_link: "Transaction confirmation timed out. The transaction may have succeeded. <link>Check on-chain</link> to verify.",
			gas_not_sponsored: "The gas fee has increased. Confirm if you still want to complete this transaction.",
			something_went_wrong: "Something went wrong with the transaction. Please try again."
		}
	},
	/**
	* @description copy keys for Select Chain view
	* @default
	* {
	description: "This wallet supports multiple chains. Select which chain you'd like to connect to",
	using_hardware_wallet_toggle_label: 'Using Ledger',
	}
	*/
	dyn_select_chain: {
		description: "This wallet supports multiple chains. Select which chain you'd like to connect to",
		using_hardware_wallet_toggle_label: "Using Ledger"
	},
	/**
	* @description copy keys for Select Wallet view
	* @default
	* {
	description: "This wallet supports multiple chains. Select which chain you'd like to connect to",
	using_hardware_wallet_toggle_label: 'Using Ledger with {{chainName}}',
	}
	*/
	dyn_select_wallet: { description: "Select your preferred {{walletName}} wallet?" },
	/**
	* @description copy keys for Select Chain view
	* @default
	* {
	title: "Connect",
	description:
	"This wallet supports using ledger. Toggle on ledger to enable it.",
	using_hardware_wallet_toggle_label: "Using Ledger with {{chainName}}",
	button: "Connect",
	}
	*/
	dyn_select_hardware_wallet: {
		title: "Connect",
		description: "This wallet supports using ledger. Toggle on ledger to enable it.",
		using_hardware_wallet_toggle_label: "Using Ledger with {{chainName}}",
		button: "Connect"
	},
	/**
	* @description copy keys for session key approval view
	* @default
	* {
	aria: {
	close_button_label: 'Close',
	},
	title: 'Approve Access',
	description:
	'You’re granting this site access. Review the permissions before confirming.',
	approve_button: 'Approve',
	reject_button: 'Deny',
	}
	*/
	dyn_session_key_approval: {
		aria: { close_button_label: "Close" },
		title: "Approve Access",
		description: "You’re granting this site access. Review the permissions before confirming.",
		approve_button: "Approve",
		reject_button: "Deny"
	},
	/**
	* @description copy keys for session management view
	* @default
	* {
	aria: {
	back_button_label: 'Back',
	info_button_label: 'Info',
	},
	title: 'Session Management',
	empty_sessions_view: {
	loading: 'Loading sessions...',
	title: 'No active sessions found',
	},
	info_view: {
	title: 'Connected App Sessions',
	description_bold: 'Easily manage which apps have access to your wallet. ',
	description_2:
	"Each session represents a connection you've made with a site or app.",
	description_3:
	'You can revoke access anytime to stay in control of where and how your wallet is used.',
	continue_button: 'Continue',
	},
	revoke_access_view: {
	title: 'Revoke Access',
	description:
	"You're removing this site's permissions. Confirm to revoke access.",
	cancel_button: 'Cancel',
	revoke_button: 'Revoke',
	success_message: 'Revoked {{sessionName}}',
	error_message: 'Failed to revoke {{sessionName}}',
	},
	session_component: {
	aria: {
	collapse_permissions: 'Collapse',
	expand_permissions: 'Expand',
	},
	permission_details: 'Permission details',
	revoke_button: 'Revoke',
	},
	}
	*/
	dyn_session_management: {
		aria: {
			back_button_label: "Back",
			info_button_label: "Info",
			close_button_label: "Close"
		},
		title: "Session Management",
		empty_sessions_view: {
			loading: "Loading sessions...",
			title: "No active sessions found"
		},
		info_view: {
			title: "Connected App Sessions",
			description_bold: "Easily manage which apps have access to your wallet. ",
			description_2: "Each session represents a connection you've made with a site or app.",
			description_3: "You can revoke access anytime to stay in control of where and how your wallet is used.",
			continue_button: "Continue"
		},
		revoke_access_view: {
			title: "Revoke Access",
			description: "You're removing this site's permissions. Confirm to revoke access.",
			cancel_button: "Cancel",
			revoke_button: "Revoke",
			success_message: "Revoked {{sessionName}}",
			error_message: "Failed to revoke {{sessionName}}"
		},
		session_component: {
			aria: {
				collapse_permissions: "Collapse",
				expand_permissions: "Expand"
			},
			permission_details: "Permission details",
			revoke_button: "Revoke"
		}
	},
	/**
	* @description copy keys for session permissions component
	* @default
	* {
	permissions_label: 'Permissions',
	permissions: {
	ownership: 'Act on your behalf',
	access: 'Access ends automatically in {{time}}',
	},
	spending_label: 'Allow Spending',
	spending_limit: 'Can spend up to:',
	advanced_label: 'Advanced',
	advanced_description: 'Session information',
	connected: 'Connected: {{time}} ago',
	}
	*/
	dyn_session_permissions: {
		permissions_label: "Permissions",
		permissions: {
			ownership: "Act on your behalf",
			access: "Access ends automatically in {{time}}"
		},
		spending_label: "Allow Spending",
		spending_limit: "Can spend up to:",
		advanced_label: "Advanced",
		advanced_description: "Session information",
		connected: "Connected: {{time}} ago"
	},
	/**
	* @description copy keys for sign message flow views
	* @default
	* {
	cancel_button: 'Reject',
	sign_button: 'Sign',
	title: 'Signature request',
	warning: 'Only sign this message if you trust this site.',
	message_label: 'Message:',
	}
	*/
	dyn_sign_message: {
		cancel_button: "Reject",
		sign_button: "Sign",
		title: "Signature request",
		warning: "Only sign this message if you trust this site.",
		message_label: "Message:"
	},
	/**
	* @description copy keys for social redirect view
	* @default
	* {
	logging_in: 'Logging you in',
	}
	*/
	dyn_social_redirect: { logging_in: "Logging you in" },
	/**
	* @description copy keys for wallet redirect view
	* @default
	* {
	loading: 'Loading...',
	}
	*/
	dyn_wallet_redirect: { loading: "Loading..." },
	/**
	* @description copy keys for messages related to time since a date
	* @default
	* {
	second: 'second',
	seconds: 'seconds',
	minute: 'minute',
	minutes: 'minutes',
	hour: 'hour',
	hours: 'hours',
	day: 'day',
	days: 'days',
	month: 'month',
	months: 'months',
	year: 'year',
	years: 'years',
	ago: 'ago',
	created: 'Created',
	}
	*/
	dyn_time_since: {
		second: "second",
		seconds: "seconds",
		minute: "minute",
		minutes: "minutes",
		hour: "hour",
		hours: "hours",
		day: "day",
		days: "days",
		month: "month",
		months: "months",
		year: "year",
		years: "years",
		ago: "ago",
		created: "Created"
	},
	/**
	* @description copy keys for connecting wallets view
	* @default
	* {
	mobile: {
	wallet_list: {
	helper: 'Get your first wallet',
	title: 'WalletConnect wallets',
	},
	},
	}
	*/
	dyn_wallet_conect: { mobile: { wallet_list: {
		helper: "Get your first wallet",
		title: "WalletConnect wallets"
	} } },
	/**
	* @description copy keys for linking wallets to profile view
	* @default
	* {
	cannot_link: {
	cancel_button: 'Cancel',
	description: 'This wallet is the only wallet in your other account. You cannot transfer it, since then you will lose access to that account.',
	link_other_button: 'Link a different wallet',
	title: 'Cannot link this wallet to a new account',
	},
	confirm_button: 'Link wallet to current account',
	existent_account: {
	acceptance: 'I understand that linking this wallet means that I will lose access to the other account.',
	warning: 'Linking your wallet to this account will unlink it from its previously associated account',
	},
	log_out_button: 'Log out',
	title: 'Transfer this wallet?'
	}
	*/
	/**
	* @description copy keys for pending account switch to link modal
	* @default
	* {
	title: 'Wallet is already linked, switch wallet in {{walletName}}',
	description: 'To link a new wallet, open {{walletName}} and switch to the account you want to link.',
	}
	*/
	dyn_pending_account_switch_to_link: {
		title: "Wallet is already linked, switch wallet in {{walletName}}",
		description: "To link a new wallet, open {{walletName}} and switch to the account you want to link."
	},
	dyn_wallet_link: {
		cannot_link: {
			cancel_button: "Cancel",
			description: "This wallet is the only wallet in your other account. You cannot transfer it, since then you will lose access to that account.",
			link_other_button: "Link a different wallet",
			title: "Cannot link this wallet to a new account"
		},
		confirm_button: "Link wallet to current account",
		existent_account: {
			acceptance: "I understand that linking this wallet means that I will lose access to the other account.",
			warning: "Linking your wallet to this account will unlink it from its previously associated account"
		},
		log_out_button: "Log out",
		title: "Transfer this wallet?",
		already_exists: {
			title: "Wallet Already Linked",
			description: "This wallet is already used as an embedded wallet. You cannot link it unless you delete the existing embedded wallet."
		}
	},
	/**
	* @description copy keys for connecting wallets list view
	* @default
	* {
	configuration_mismatch: 'Oops, no login methods have been configured.',
	helper: 'Get your first wallet',
	search: {
	label: 'Search through {{numberOfWallets}} wallets...',
	not_found: {
	description: 'The wallet you’re looking for may not be available, or linking more than one of these wallets might not be possible.',
	title: 'Wallet not available',
	},
	},
	title: {
	connect: 'Connect a new wallet',
	link: 'Link a new wallet',
	select: 'Select your wallet',
	},
	view_all: 'View all wallets',
	wallet_missing: {
	description: 'Try search instead',
	title: "Don't see your wallet?",
	},
	}
	*/
	dyn_wallet_list: {
		configuration_mismatch: "Oops, no login methods have been configured.",
		helper: "Get your first wallet",
		search: {
			label: "Search through {{numberOfWallets}} wallets...",
			not_found: {
				description: "The wallet you’re looking for may not be available, or linking more than one of these wallets might not be possible.",
				title: "Wallet not available"
			}
		},
		title: {
			connect: "Connect a new wallet",
			link: "Link a new wallet",
			select: "Select your wallet"
		},
		view_all: "View all wallets",
		wallet_missing: {
			description: "Try search instead",
			title: "Don't see your wallet?"
		}
	},
	dyn_exchange_list: {
		search: {
			label: "Search through exchanges",
			not_found: {
				description: "The exchange you’re looking for may not be available.",
				title: "Exchange not available"
			}
		},
		item: { connected: "Connected" },
		no_exchanges: "Oops, no exchanges have been configured."
	},
	dyn_unified_list: {
		title: "Funding Source",
		exchange: "Exchange",
		wallet: "Wallet",
		onramp: "Onramp",
		search: {
			label: "Search Wallets, Exchanges, & Onramps",
			not_found: {
				description: "The wallet, exchange, or onramp you’re looking for may not be available.",
				title: "Wallet, Exchange, or Onramp not available"
			}
		},
		item: { connected: "Connected" }
	},
	/**
	* @description copy keys for transferring wallets between accounts view
	* @default
	* {
	sign: {
	spinner: {
	cancel: 'Cancel',
	confirm_transfer:
	'Sign the message to confirm transferring this wallet to this account.',
	},
	title: 'Sign to confirm transfer',
	},
	}
	*/
	dyn_wallet_transfer: { sign: {
		spinner: {
			cancel: "Cancel",
			confirm_transfer: "Sign the message to confirm transferring this wallet to this account."
		},
		title: "Sign to confirm transfer"
	} },
	/**
	* @description copy keys for Dynamic widget nav bar
	* @default
	*
	dyn_nav_bar: {
	wallets: 'Wallets',
	profile: 'Profile',
	settings: 'Settings',
	},
	**/
	dyn_nav_bar: {
		wallets: "Wallets",
		profile: "Profile",
		settings: "Settings"
	},
	/**
	* @description copy keys for Dynamic widget
	* @default
	* {
	connect: 'Log in or sign up',
	empty_wallets: '{{action}} additional wallets to see them here.',
	other_wallets: 'My other wallets',
	}
	*/
	dyn_widget: {
		connect: "Log in or sign up",
		empty_wallets: "{{action}} additional wallets to see them here.",
		other_wallets: "My other wallets",
		empty_wallets_action_link: "Link",
		empty_wallets_action_connect: "Connect"
	},
	/**
	* @description copy keys for Dynamic wallet information card
	* @default
	* {
	balance: 'Balance'
	}
	*/
	dyn_wallet_information: {
		balance: "Balance",
		multi_asset: { empty_state: "No assets in this wallet" }
	},
	/**
	* @description copy keys for Unlink wallet prompt
	* @default
	* {
	disconnect_title: 'Disconnect your wallet?',
	unlink_title: 'Unlink your wallet?',
	disconnect_description: 'Are you sure you want to disconnect your wallet?',
	unlink_description: 'Are you sure you want to unlink your wallet?',
	disconnect_button: 'Yes, disconnect',
	unlink_button: 'Yes, unlink',
	cancel_button: 'No',
	}
	*/
	dyn_unlink_wallet_pop_up: {
		disconnect_title: "Disconnect your wallet?",
		unlink_title: "Unlink your wallet?",
		disconnect_description: "Are you sure you want to disconnect your wallet?",
		unlink_description: "Are you sure you want to unlink your wallet?",
		disconnect_button: "Yes, disconnect",
		unlink_button: "Yes, unlink",
		cancel_button: "No"
	},
	/**
	* @description copy keys for the user profile widget
	* @default
	* {
	my_information: {
	title: 'My information',
	},
	my_wallet: {
	title: 'My wallet',
	},
	social_accounts: {
	title: 'Social accounts',
	},
	tooltips: {
	verified_email: 'This email is verified',
	verified_phone: 'This phone number is verified',
	},
	wallets: {
	link_wallet_button: 'Link wallet',
	title: 'Wallets',
	},
	}
	*/
	dyn_user_profile: {
		my_information: { title: "My information" },
		my_wallet: { title: "My wallet" },
		social_accounts: { title: "Social accounts" },
		tooltips: {
			verified_email: "This email is verified",
			verified_phone: "This phone number is verified"
		},
		wallets: {
			link_wallet_button: "Link wallet",
			title: "Want to add a wallet?"
		},
		edit_profile_button: "Edit Profile"
	},
	/**
	* @description copy keys for Dynamic subdomain field
	* @default
	* {
	label: 'Subdomain Handle',
	available: 'Subdomain is available',
	not_available: 'Subdomain is not available',
	error: 'Subdomain check failed',
	details:
	'A subdomain handle will create a unique ENS subdomain for your wallet, helping you easily share and identify it.',
	}
	*/
	dyn_subdomain_field: {
		label: "Subdomain Handle",
		available: "Subdomain is available",
		not_available: "Subdomain is not available",
		error: "Subdomain check failed",
		details: "A subdomain handle will create a unique ENS subdomain for your wallet, helping you easily share and identify it."
	},
	/**
	* @description copy keys for Detected new wallet prompt
	* @default
	* {
	title: 'Account Change Detected',
	description: 'Your active account in {{walletName}} has changed. This account is not currently linked to this app. Do you want to add it?',
	confirm_button: 'Yes, link this wallet',
	}
	*/
	dyn_detected_new_wallet: {
		title: "Account Change Detected",
		description: "Your active account in {{walletName}} has changed. This account is not currently linked to this app. Do you want to add it?",
		confirm_button: "Yes, link this wallet"
	},
	/**
	* @description copy keys for sync wallet view
	* @default
	* {
	switch_wallet: {
	title: 'Your wallets are mismatched. \nSwitch to continue.',
	active_address: {
	heading: 'Currently active in wallet',
	},
	expected_address: {
	heading: 'Currently active on website',
	prompt: 'Manually switch to this wallet',
	},
	},
	reconnecting: {
	title: 'This wallet is not connected',
	description: 'Reconnecting wallet {{walletAddress}} to make it active...',
	},
	reconnect_with_qr_code: {
	title: 'This wallet is not connected',
	},
	cancel_button: 'Cancel',
	retry_button: 'Retry',
	}
	*/
	dyn_sync_wallet: {
		switch_wallet: {
			title: "Your wallets are mismatched. \nSwitch to continue.",
			active_address: { heading: "Currently active in wallet" },
			expected_address: {
				heading: "Currently active on website",
				prompt: "Manually switch to this wallet"
			}
		},
		reconnecting: {
			title: "This wallet is not connected",
			description: "Reconnecting wallet {{walletAddress}} to make it active..."
		},
		reconnect_with_qr_code: { title: "This wallet is not connected" },
		cancel_button: "Cancel",
		retry_button: "Retry"
	},
	/**
	* @description copy keys for the wallet funding flow
	* @default
	* {
	success: 'Transaction processing',
	success_txn_link: 'View transaction',
	
	funding_method_selection: {
	title: 'Deposit',
	qr_option: 'Receive by QR',
	buy_option: 'Buy Crypto',
	external_wallet_option: 'From External Wallet',
	linked_wallet_option: 'From Linked Wallet',
	},
	onramp_provider_selection: {
	title: 'Select provider',
	description: 'Select from a list of available onramp providers.',
	},
	from_linked_wallet: {
	title: 'Fund from Linked Wallet',
	},
	
	from_external_wallet: {
	title: 'Fund from External Wallet',
	},
	
	from_wallet: {
	amount_input: {
	title: 'Fund from Wallet',
	wallet_detail_from: 'From',
	confirm_button: 'Confirm Transaction',
	pricing_unavailable: 'Pricing unavailable.',
	minimum_error: 'Minimum {{minimum}}',
	balance_error: 'Insufficient funds',
	},
	token_select: {
	title: 'Select a Token',
	search_placeholder: 'Search for a token',
	no_assets_title: 'No Supported Assets',
	no_assets_description: 'No supported assets in this wallet',
	},
	},
	}
	*/
	dyn_wallet_funding: {
		success: "Transaction processing",
		success_txn_link: "View transaction",
		funding_method_selection: {
			title: "Deposit",
			qr_option: "Receive by QR",
			buy_option: "Buy Crypto",
			external_wallet_option: "From External Wallet",
			linked_wallet_option: "From Linked Wallet",
			exchange_option: "From Exchange"
		},
		onramp_provider_selection: {
			title: "Select provider",
			description: "Select from a list of available onramp providers."
		},
		from_linked_wallet: { title: "Fund from Linked Wallet" },
		from_exchange: { title: "From Exchange" },
		from_external_wallet: { title: "Fund from External Wallet" },
		from_wallet: {
			amount_input: {
				title: "Fund from Wallet",
				wallet_detail_from: "From",
				confirm_button: "Confirm Transaction",
				pricing_unavailable: "Pricing unavailable.",
				minimum_error: "Minimum {{minimum}}",
				balance_error: "Insufficient funds: Buy more"
			},
			token_select: {
				title: "Select a Token",
				search_placeholder: "Search for a token",
				no_assets_title: "No Supported Assets",
				no_assets_description: "No supported assets in this wallet"
			}
		}
	},
	/**
	* @description copy keys for Crypto.com onramp
	* @default
	* {
	*   title: 'Deposit',
	*   amount_label: 'Amount to purchase',
	*   amount_description: 'Enter the USD amount you want to spend',
	*   token_label: 'Token to receive',
	*   token_description: 'Choose which token you want to purchase',
	*   wallet_info: 'Tokens will be sent to your wallet',
	*   creating_payment: 'Creating Payment...',
	*   create_payment: 'Continue to Payment',
	* }
	*/
	dyn_crypto_com_onramp: {
		title: "Deposit",
		amount_label: "Amount to purchase",
		amount_description: "Enter the USD amount you want to spend",
		token_label: "Token to receive",
		token_description: "Choose which token you want to purchase",
		wallet_info: "Tokens will be sent to your wallet",
		wallet_detail_to: "Tokens will be sent to",
		creating_payment: "Creating Payment...",
		create_payment: "Continue to Payment",
		currency_label: "Payment Currency",
		select_currency: "Select Currency"
	},
	/**
	* @description copy keys for Dynamic widget header
	* @default
	* {
	buttons: {
	deposit_funds: 'Deposit',
	send_funds: 'Send',
	more: 'More',
	},
	}
	*/
	dyn_widget_header: { buttons: {
		deposit_funds: "Deposit",
		send_funds: "Send",
		more: "More"
	} },
	/**
	* @description copy keys for general dynamic errors
	* @default
	* {
	default: 'Something went wrong. Please try again.',
	user_rejected: 'User rejected the request.',
	message_signature_denied: 'Message signature denied',
	wallet_locked: 'Please unlock your wallet extension and try again.',
	invalid_parameters: 'Invalid parameters. Please try again.',
	internal_error: 'There was an internal error. Please try again.',
	account_already_linked_to_different_profile:
	'This social account is already linked to a different profile.',
	connection_rejected: 'Connection rejected. Please try again.',
	missing_public_address: 'Connection cancelled. Please try again',
	connection_proposal_expired:
	'Connection proposal expired. Please try again.',
	sei_not_enabled_in_keplr_wallet:
	'Sei network is not enabled in Keplr. Please enable it and try again.',
	rate_limit_error: 'Too many requests. Please try again later.',
	}
	*/
	dyn_error: {
		default: "Something went wrong. Please try again.",
		user_rejected: "User rejected the request.",
		message_signature_denied: "Message signature denied",
		wallet_locked: "Please unlock your wallet extension and try again.",
		invalid_parameters: "Invalid parameters. Please try again.",
		internal_error: "There was an internal error. Please try again.",
		account_already_linked_to_different_profile: "This social account is already linked to a different profile.",
		connection_rejected: "Connection rejected. Please try again.",
		credential_not_enabled_for_sign_in: "This credential cannot be used for sign-in. Please use your primary credential.",
		missing_public_address: "Connection cancelled. Please try again",
		connection_proposal_expired: "Connection proposal expired. Please try again.",
		sei_not_enabled_in_keplr_wallet: "Sei network is not enabled in Keplr. Please enable it and try again.",
		rate_limit_error: "Too many requests. Please try again later."
	},
	/**
	* @description copy keys for search component
	* @default
	* {
	clear: 'Clear',
	}
	*/
	dyn_search: { clear: "Clear" },
	/**
	* @description copy keys for account upgraded view
	* @default
	* {
	*   title: 'Account Upgraded',
	*   message: 'All done! You've got the latest version — more powerful, flexible, and ready for what's next.',
	*   continue_button: 'Continue',
	* }
	*/
	dyn_account_upgraded: {
		title: "Account Upgraded",
		message: "All done! You've got the latest version — more powerful, flexible, and ready for what's next.",
		continue_button: "Continue"
	},
	/**
	* @description copy keys for Dynamic WaaS upgrade view
	* @default
	* {
	*   title: 'Upgrade your account',
	*   description: 'A new version of your account is available, with better security and easier recovery.',
	*   eligible_wallets: 'Eligible wallets',
	*   how_to_upgrade: 'How would you like to upgrade?',
	*   keep_existing: 'Keep existing wallet',
	*   keep_existing_desc: 'Export your legacy wallet and securely import the private key to upgrade',
	*   start_fresh: 'Start fresh',
	*   start_fresh_desc: 'Removes your legacy wallet and create a brand new upgraded wallet',
	*   recommended: 'recommended',
	*   upgrade: 'Upgrade',
	*   not_now: 'Not now',
	* }
	*/
	dyn_upgrade_wallet: {
		title: "Upgrade your account",
		description: "A new version of your account is available, with better security and easier recovery.",
		eligible_wallets: "Eligible wallets",
		how_to_upgrade: "How would you like to upgrade?",
		keep_existing: "Keep existing wallet",
		keep_existing_desc: "Export your legacy wallet and securely import the private key to upgrade",
		start_fresh: "Start fresh",
		start_fresh_desc: "Removes your legacy wallet and create a brand new upgraded wallet",
		recommended: "recommended",
		upgrade: "Upgrade",
		not_now: "Not now"
	},
	/**
	* @description copy keys for Dynamic wallet upgrade flow view
	* @default
	* {
	*   title: 'Upgrade your wallet',
	*   step_wallet_upgrade: '{{walletName}} Upgrade',
	*   new_wallet_title: 'Create New Wallet',
	*   new_wallet_coming_soon: 'New wallet creation coming soon...',
	*   copy_private_key_subtitle: 'Import your wallet key to upgrade your wallet. You will not lose access to any assets. Your wallet will always remain in your control.',
	*   copy_private_key_title: 'Copy',
	*   step_2_upgrade_description: 'Paste',
	*   upgrade_wallet: 'Upgrade Account',
	*   cancel: 'Cancel',
	*   export_failed: 'Failed to export wallet',
	*   upgrade_failed: 'Failed to upgrade wallet',
	* }
	*/
	dyn_wallet_upgrade_flow: {
		title: "Upgrade your wallet",
		step_wallet_upgrade: "{{walletName}} Upgrade",
		new_wallet_title: "Create New Wallet",
		new_wallet_coming_soon: "New wallet creation coming soon...",
		copy_private_key_subtitle: "Import your wallet key to upgrade your wallet. You will not lose access to any assets. Your wallet will always remain in your control.",
		copy_private_key_title: "Copy",
		step_2_upgrade_description: "Paste",
		upgrade_wallet: "Upgrade Account",
		cancel: "Cancel",
		export_failed: "Failed to export wallet",
		upgrade_failed: "Failed to upgrade wallet"
	},
	dyn_export_and_recovery: {
		title: "Export & Recovery",
		private_key: "Private Key",
		export_shares: "Export Share",
		advanced: "ADVANCED"
	},
	dyn_export_shares: {
		title: "Export Key Shares",
		sensitive_info: "Sensitive information",
		threshold_description: "You'll need at least {{required}} out of {{total}} shares to restore access to your wallet.",
		how_to_use_title: "How to use them",
		bullet_1: "Store your shares in separate secure locations.",
		bullet_2: "You'll need {{required}} shares to recover offline.",
		bullet_3: "You can re-import them through your wallet recovery flow.",
		acknowledge: "I am responsible for safeguarding and using my wallet key share information.",
		download_button: "Download Share",
		error: "Failed to export shares. Please try again."
	},
	dyn_export_shares_passcode: {
		title: "Enter Passcode",
		description: "To export your recovery shares, enter your passcode.",
		enter_passcode: "Enter passcode",
		error: "Invalid passcode"
	},
	dyn_wallet_delegation: {
		title: "Wallet delegation approval",
		approval_required: "Approval required",
		approval_requested: "Approval requested",
		approval_description: "{{appName}} is requesting access to perform automations on your behalf. You can revoke this permission at any time.",
		select_wallets: "Select Wallets",
		select_all: "Select All",
		deselect_all: "Deselect All",
		clear: "Clear",
		approve_button: "Approve delegation",
		deny_button: "Deny",
		done_button: "Done",
		approving_permissions: "Approving permissions",
		permissions_description: "{{appName}} is requesting access to perform automations on your behalf. You can revoke this permission at any time.",
		permissions_granted: "Permissions granted",
		permissions_description_granted: "{{appName}} has been granted access to perform automations on your behalf. You can revoke this permission at any time.",
		revoke_note: "You can always revoke these permissions in your wallet settings.",
		wallets_selected: "wallets selected",
		edit_selections: "Edit Selections",
		save_selections: "Save Selections",
		edit_wallets_title: "Edit Wallets",
		my_wallet: "My Wallet",
		all_wallets: "All Wallets",
		agreement_text: "I understand, and agree to accept this permission request",
		selected_wallets: "Selected Wallets",
		edit_wallets_to_delegate: "Edit Wallets to Delegate",
		something_went_wrong: "Something went wrong",
		delegation_timeout_message: "The delegation request timed out or was rejected. Please try approving again or come back in another time.",
		partial_failure_title: "Some wallets were not delegated",
		partial_failure_message: "{{successCount}} of {{total}} wallets were delegated. Try again to retry the {{failureCount}} that failed.",
		try_again_button: "Try again",
		logout_button: "Log out",
		learn_more: "Learn more",
		learn_more_description: "Delegating your wallet lets this app act on your behalf, even when you're not here. This is useful for things like trading bots or other automated workflows. You stay in control — you can revoke access anytime in your wallet settings.",
		learn_more_okay_button: "Okay"
	},
	dyn_device_registration: {
		title: "New device detected",
		description: "To keep your account secure, we've sent a verification email to {{email}}",
		logout: "Log out"
	},
	dyn_device_management: {
		manage_title: "Manage Trusted Devices",
		manage_trusted_devices_button: "Manage Trusted Devices",
		trusted_devices_section_title: "Devices",
		this_device: "This Device",
		remove_device_title: "Remove {{deviceName}}",
		remove_device_description: "Are you sure you want to remove {{deviceName}} as a trusted Device? This will sign out and remove all access.",
		remove_button: "Remove",
		cancel_button: "Cancel",
		remove_all_devices: "Remove All Devices",
		remove_all_devices_title: "Remove All Devices",
		remove_all_devices_description: "Are you sure you want to remove all trusted devices? This will sign out all devices and remove all access.",
		no_devices: "No trusted devices found."
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+locale@4.89.0_react-dom@19.2.7_react@19.2.7__react-native@0.86.0_@babel+c_af4a65d0b4e2b3329363fb322c11de9f/node_modules/@dynamic-labs/locale/src/lib/helpers/deepMerge.js
var deepMerge = (obj1, obj2) => {
	if (typeof obj1 !== "object" || typeof obj2 !== "object") return obj2;
	const result = Object.assign({}, obj1);
	for (const key in obj2) if (Object.prototype.hasOwnProperty.call(obj2, key)) if (typeof obj2[key] === "object" && Object.prototype.hasOwnProperty.call(obj1, key) && typeof obj1[key] === "object") result[key] = deepMerge(obj1[key], obj2[key]);
	else result[key] = obj2[key];
	return result;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+locale@4.89.0_react-dom@19.2.7_react@19.2.7__react-native@0.86.0_@babel+c_af4a65d0b4e2b3329363fb322c11de9f/node_modules/@dynamic-labs/locale/src/lib/locale.js
var Locale = class Locale {
	static setResources(customResources) {
		if (Locale.__resources__) return;
		if (!customResources) {
			Locale.__resources__ = { en: { translation } };
			return;
		}
		const sdkResources = {};
		Object.keys(customResources).forEach((lang) => {
			sdkResources[lang] = { translation: deepMerge(Object.assign({}, translation), customResources[lang]) };
		});
		Locale.__resources__ = sdkResources;
	}
	static setup(resources) {
		if (Locale.__initialized__ && Locale.__i18nInstance__) return Locale.__i18nInstance__;
		Locale.setResources(resources);
		const i18nInstance = instance.createInstance();
		i18nInstance.use(initReactI18next).init({
			fallbackLng: "en",
			interpolation: { escapeValue: false },
			lng: "en",
			resources: Locale.getResources()
		});
		Locale.__i18nInstance__ = i18nInstance;
		Locale.__initialized__ = true;
		return Locale.__i18nInstance__;
	}
	static getInstance() {
		if (!Locale.__initialized__) this.setup();
		// istanbul ignore next
		if (!Locale.__i18nInstance__ || !Locale.__initialized__) throw new Error("Locale is not initialized");
		return Locale.__i18nInstance__;
	}
};
Locale.__i18nInstance__ = null;
Locale.__initialized__ = false;
Locale.getResources = () => Locale.__resources__;
//#endregion
export { getDefaults as i, translation as n, getI18n as r, Locale as t };
