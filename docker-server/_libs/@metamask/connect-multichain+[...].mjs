import { a as __require, o as __toCommonJS, s as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { A as import_eventemitter3, I as init_lib, L as lib_exports, a as deflate_1, j as init_eventemitter3, o as init_pako_esm } from "../@coral-xyz/anchor.mjs";
import { t as analytics } from "./analytics+[...].mjs";
import { randomFillSync, randomUUID } from "crypto";
//#region ../../node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js
var require_ms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
				starIndex = templateIndex;
				matchIndex = searchIndex;
				templateIndex++;
			} else {
				searchIndex++;
				templateIndex++;
			}
			else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region ../../node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/browser.js
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/has-flag@4.0.0/node_modules/has-flag/index.js
var require_has_flag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (flag, argv = process.argv) => {
		const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf("--");
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/supports-color@8.1.1/node_modules/supports-color/index.js
var require_supports_color = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var os = __require("os");
	var tty$1 = __require("tty");
	var hasFlag = require_has_flag();
	var { env } = process;
	var flagForceColor;
	if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) flagForceColor = 0;
	else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) flagForceColor = 1;
	function envForceColor() {
		if ("FORCE_COLOR" in env) {
			if (env.FORCE_COLOR === "true") return 1;
			if (env.FORCE_COLOR === "false") return 0;
			return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
		}
	}
	function translateLevel(level) {
		if (level === 0) return false;
		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}
	function supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
		const noFlagForceColor = envForceColor();
		if (noFlagForceColor !== void 0) flagForceColor = noFlagForceColor;
		const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
		if (forceColor === 0) return 0;
		if (sniffFlags) {
			if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
			if (hasFlag("color=256")) return 2;
		}
		if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
		const min = forceColor || 0;
		if (env.TERM === "dumb") return min;
		if (process.platform === "win32") {
			const osRelease = os.release().split(".");
			if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
			return 1;
		}
		if ("CI" in env) {
			if ([
				"TRAVIS",
				"CIRCLECI",
				"APPVEYOR",
				"GITLAB_CI",
				"GITHUB_ACTIONS",
				"BUILDKITE",
				"DRONE"
			].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
			return min;
		}
		if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		if (env.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in env) {
			const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (env.TERM_PROGRAM) {
				case "iTerm.app": return version >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		if (/-256(color)?$/i.test(env.TERM)) return 2;
		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
		if ("COLORTERM" in env) return 1;
		return min;
	}
	function getSupportLevel(stream, options = {}) {
		return translateLevel(supportsColor(stream, {
			streamIsTTY: stream && stream.isTTY,
			...options
		}));
	}
	module.exports = {
		supportsColor: getSupportLevel,
		stdout: getSupportLevel({ isTTY: tty$1.isatty(1) }),
		stderr: getSupportLevel({ isTTY: tty$1.isatty(2) })
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty = __require("tty");
	var util = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/debug@4.4.3/node_modules/debug/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser();
	else module.exports = require_node();
}));
//#endregion
//#region ../../node_modules/.pnpm/bowser@2.14.1/node_modules/bowser/src/constants.js
init_eventemitter3();
var import_src = /* @__PURE__ */ __toESM(require_src(), 1);
var BROWSER_ALIASES_MAP = {
	AmazonBot: "amazonbot",
	"Amazon Silk": "amazon_silk",
	"Android Browser": "android",
	BaiduSpider: "baiduspider",
	Bada: "bada",
	BingCrawler: "bingcrawler",
	Brave: "brave",
	BlackBerry: "blackberry",
	"ChatGPT-User": "chatgpt_user",
	Chrome: "chrome",
	ClaudeBot: "claudebot",
	Chromium: "chromium",
	Diffbot: "diffbot",
	DuckDuckBot: "duckduckbot",
	DuckDuckGo: "duckduckgo",
	Electron: "electron",
	Epiphany: "epiphany",
	FacebookExternalHit: "facebookexternalhit",
	Firefox: "firefox",
	Focus: "focus",
	Generic: "generic",
	"Google Search": "google_search",
	Googlebot: "googlebot",
	GPTBot: "gptbot",
	"Internet Explorer": "ie",
	InternetArchiveCrawler: "internetarchivecrawler",
	"K-Meleon": "k_meleon",
	LibreWolf: "librewolf",
	Linespider: "linespider",
	Maxthon: "maxthon",
	"Meta-ExternalAds": "meta_externalads",
	"Meta-ExternalAgent": "meta_externalagent",
	"Meta-ExternalFetcher": "meta_externalfetcher",
	"Meta-WebIndexer": "meta_webindexer",
	"Microsoft Edge": "edge",
	"MZ Browser": "mz",
	"NAVER Whale Browser": "naver",
	"OAI-SearchBot": "oai_searchbot",
	Omgilibot: "omgilibot",
	Opera: "opera",
	"Opera Coast": "opera_coast",
	"Pale Moon": "pale_moon",
	PerplexityBot: "perplexitybot",
	"Perplexity-User": "perplexity_user",
	PhantomJS: "phantomjs",
	PingdomBot: "pingdombot",
	Puffin: "puffin",
	QQ: "qq",
	QQLite: "qqlite",
	QupZilla: "qupzilla",
	Roku: "roku",
	Safari: "safari",
	Sailfish: "sailfish",
	"Samsung Internet for Android": "samsung_internet",
	SlackBot: "slackbot",
	SeaMonkey: "seamonkey",
	Sleipnir: "sleipnir",
	"Sogou Browser": "sogou",
	Swing: "swing",
	Tizen: "tizen",
	"UC Browser": "uc",
	Vivaldi: "vivaldi",
	"WebOS Browser": "webos",
	WeChat: "wechat",
	YahooSlurp: "yahooslurp",
	"Yandex Browser": "yandex",
	YandexBot: "yandexbot",
	YouBot: "youbot"
};
var BROWSER_MAP = {
	amazonbot: "AmazonBot",
	amazon_silk: "Amazon Silk",
	android: "Android Browser",
	baiduspider: "BaiduSpider",
	bada: "Bada",
	bingcrawler: "BingCrawler",
	blackberry: "BlackBerry",
	brave: "Brave",
	chatgpt_user: "ChatGPT-User",
	chrome: "Chrome",
	claudebot: "ClaudeBot",
	chromium: "Chromium",
	diffbot: "Diffbot",
	duckduckbot: "DuckDuckBot",
	duckduckgo: "DuckDuckGo",
	edge: "Microsoft Edge",
	electron: "Electron",
	epiphany: "Epiphany",
	facebookexternalhit: "FacebookExternalHit",
	firefox: "Firefox",
	focus: "Focus",
	generic: "Generic",
	google_search: "Google Search",
	googlebot: "Googlebot",
	gptbot: "GPTBot",
	ie: "Internet Explorer",
	internetarchivecrawler: "InternetArchiveCrawler",
	k_meleon: "K-Meleon",
	librewolf: "LibreWolf",
	linespider: "Linespider",
	maxthon: "Maxthon",
	meta_externalads: "Meta-ExternalAds",
	meta_externalagent: "Meta-ExternalAgent",
	meta_externalfetcher: "Meta-ExternalFetcher",
	meta_webindexer: "Meta-WebIndexer",
	mz: "MZ Browser",
	naver: "NAVER Whale Browser",
	oai_searchbot: "OAI-SearchBot",
	omgilibot: "Omgilibot",
	opera: "Opera",
	opera_coast: "Opera Coast",
	pale_moon: "Pale Moon",
	perplexitybot: "PerplexityBot",
	perplexity_user: "Perplexity-User",
	phantomjs: "PhantomJS",
	pingdombot: "PingdomBot",
	puffin: "Puffin",
	qq: "QQ Browser",
	qqlite: "QQ Browser Lite",
	qupzilla: "QupZilla",
	roku: "Roku",
	safari: "Safari",
	sailfish: "Sailfish",
	samsung_internet: "Samsung Internet for Android",
	seamonkey: "SeaMonkey",
	slackbot: "SlackBot",
	sleipnir: "Sleipnir",
	sogou: "Sogou Browser",
	swing: "Swing",
	tizen: "Tizen",
	uc: "UC Browser",
	vivaldi: "Vivaldi",
	webos: "WebOS Browser",
	wechat: "WeChat",
	yahooslurp: "YahooSlurp",
	yandex: "Yandex Browser",
	yandexbot: "YandexBot",
	youbot: "YouBot"
};
var PLATFORMS_MAP = {
	bot: "bot",
	desktop: "desktop",
	mobile: "mobile",
	tablet: "tablet",
	tv: "tv"
};
var OS_MAP = {
	Android: "Android",
	Bada: "Bada",
	BlackBerry: "BlackBerry",
	ChromeOS: "Chrome OS",
	HarmonyOS: "HarmonyOS",
	iOS: "iOS",
	Linux: "Linux",
	MacOS: "macOS",
	PlayStation4: "PlayStation 4",
	Roku: "Roku",
	Tizen: "Tizen",
	WebOS: "WebOS",
	Windows: "Windows",
	WindowsPhone: "Windows Phone"
};
var ENGINE_MAP = {
	Blink: "Blink",
	EdgeHTML: "EdgeHTML",
	Gecko: "Gecko",
	Presto: "Presto",
	Trident: "Trident",
	WebKit: "WebKit"
};
//#endregion
//#region ../../node_modules/.pnpm/bowser@2.14.1/node_modules/bowser/src/utils.js
var Utils = class Utils {
	/**
	* Get first matched item for a string
	* @param {RegExp} regexp
	* @param {String} ua
	* @return {Array|{index: number, input: string}|*|boolean|string}
	*/
	static getFirstMatch(regexp, ua) {
		const match = ua.match(regexp);
		return match && match.length > 0 && match[1] || "";
	}
	/**
	* Get second matched item for a string
	* @param regexp
	* @param {String} ua
	* @return {Array|{index: number, input: string}|*|boolean|string}
	*/
	static getSecondMatch(regexp, ua) {
		const match = ua.match(regexp);
		return match && match.length > 1 && match[2] || "";
	}
	/**
	* Match a regexp and return a constant or undefined
	* @param {RegExp} regexp
	* @param {String} ua
	* @param {*} _const Any const that will be returned if regexp matches the string
	* @return {*}
	*/
	static matchAndReturnConst(regexp, ua, _const) {
		if (regexp.test(ua)) return _const;
	}
	static getWindowsVersionName(version) {
		switch (version) {
			case "NT": return "NT";
			case "XP": return "XP";
			case "NT 5.0": return "2000";
			case "NT 5.1": return "XP";
			case "NT 5.2": return "2003";
			case "NT 6.0": return "Vista";
			case "NT 6.1": return "7";
			case "NT 6.2": return "8";
			case "NT 6.3": return "8.1";
			case "NT 10.0": return "10";
			default: return;
		}
	}
	/**
	* Get macOS version name
	*    10.5 - Leopard
	*    10.6 - Snow Leopard
	*    10.7 - Lion
	*    10.8 - Mountain Lion
	*    10.9 - Mavericks
	*    10.10 - Yosemite
	*    10.11 - El Capitan
	*    10.12 - Sierra
	*    10.13 - High Sierra
	*    10.14 - Mojave
	*    10.15 - Catalina
	*    11 - Big Sur
	*    12 - Monterey
	*    13 - Ventura
	*    14 - Sonoma
	*    15 - Sequoia
	*
	* @example
	*   getMacOSVersionName("10.14") // 'Mojave'
	*
	* @param  {string} version
	* @return {string} versionName
	*/
	static getMacOSVersionName(version) {
		const v = version.split(".").splice(0, 2).map((s) => parseInt(s, 10) || 0);
		v.push(0);
		const major = v[0];
		const minor = v[1];
		if (major === 10) switch (minor) {
			case 5: return "Leopard";
			case 6: return "Snow Leopard";
			case 7: return "Lion";
			case 8: return "Mountain Lion";
			case 9: return "Mavericks";
			case 10: return "Yosemite";
			case 11: return "El Capitan";
			case 12: return "Sierra";
			case 13: return "High Sierra";
			case 14: return "Mojave";
			case 15: return "Catalina";
			default: return;
		}
		switch (major) {
			case 11: return "Big Sur";
			case 12: return "Monterey";
			case 13: return "Ventura";
			case 14: return "Sonoma";
			case 15: return "Sequoia";
			default: return;
		}
	}
	/**
	* Get Android version name
	*    1.5 - Cupcake
	*    1.6 - Donut
	*    2.0 - Eclair
	*    2.1 - Eclair
	*    2.2 - Froyo
	*    2.x - Gingerbread
	*    3.x - Honeycomb
	*    4.0 - Ice Cream Sandwich
	*    4.1 - Jelly Bean
	*    4.4 - KitKat
	*    5.x - Lollipop
	*    6.x - Marshmallow
	*    7.x - Nougat
	*    8.x - Oreo
	*    9.x - Pie
	*
	* @example
	*   getAndroidVersionName("7.0") // 'Nougat'
	*
	* @param  {string} version
	* @return {string} versionName
	*/
	static getAndroidVersionName(version) {
		const v = version.split(".").splice(0, 2).map((s) => parseInt(s, 10) || 0);
		v.push(0);
		if (v[0] === 1 && v[1] < 5) return void 0;
		if (v[0] === 1 && v[1] < 6) return "Cupcake";
		if (v[0] === 1 && v[1] >= 6) return "Donut";
		if (v[0] === 2 && v[1] < 2) return "Eclair";
		if (v[0] === 2 && v[1] === 2) return "Froyo";
		if (v[0] === 2 && v[1] > 2) return "Gingerbread";
		if (v[0] === 3) return "Honeycomb";
		if (v[0] === 4 && v[1] < 1) return "Ice Cream Sandwich";
		if (v[0] === 4 && v[1] < 4) return "Jelly Bean";
		if (v[0] === 4 && v[1] >= 4) return "KitKat";
		if (v[0] === 5) return "Lollipop";
		if (v[0] === 6) return "Marshmallow";
		if (v[0] === 7) return "Nougat";
		if (v[0] === 8) return "Oreo";
		if (v[0] === 9) return "Pie";
	}
	/**
	* Get version precisions count
	*
	* @example
	*   getVersionPrecision("1.10.3") // 3
	*
	* @param  {string} version
	* @return {number}
	*/
	static getVersionPrecision(version) {
		return version.split(".").length;
	}
	/**
	* Calculate browser version weight
	*
	* @example
	*   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
	*   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
	*   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
	*   compareVersions('1.10.2.1',  '1.0800.2');     // -1
	*   compareVersions('1.10.2.1',  '1.10',  true);  // 0
	*
	* @param {String} versionA versions versions to compare
	* @param {String} versionB versions versions to compare
	* @param {boolean} [isLoose] enable loose comparison
	* @return {Number} comparison result: -1 when versionA is lower,
	* 1 when versionA is bigger, 0 when both equal
	*/
	static compareVersions(versionA, versionB, isLoose = false) {
		const versionAPrecision = Utils.getVersionPrecision(versionA);
		const versionBPrecision = Utils.getVersionPrecision(versionB);
		let precision = Math.max(versionAPrecision, versionBPrecision);
		let lastPrecision = 0;
		const chunks = Utils.map([versionA, versionB], (version) => {
			const delta = precision - Utils.getVersionPrecision(version);
			const _version = version + new Array(delta + 1).join(".0");
			return Utils.map(_version.split("."), (chunk) => new Array(20 - chunk.length).join("0") + chunk).reverse();
		});
		if (isLoose) lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
		precision -= 1;
		while (precision >= lastPrecision) {
			if (chunks[0][precision] > chunks[1][precision]) return 1;
			if (chunks[0][precision] === chunks[1][precision]) {
				if (precision === lastPrecision) return 0;
				precision -= 1;
			} else if (chunks[0][precision] < chunks[1][precision]) return -1;
		}
	}
	/**
	* Array::map polyfill
	*
	* @param  {Array} arr
	* @param  {Function} iterator
	* @return {Array}
	*/
	static map(arr, iterator) {
		const result = [];
		let i;
		if (Array.prototype.map) return Array.prototype.map.call(arr, iterator);
		for (i = 0; i < arr.length; i += 1) result.push(iterator(arr[i]));
		return result;
	}
	/**
	* Array::find polyfill
	*
	* @param  {Array} arr
	* @param  {Function} predicate
	* @return {Array}
	*/
	static find(arr, predicate) {
		let i;
		let l;
		if (Array.prototype.find) return Array.prototype.find.call(arr, predicate);
		for (i = 0, l = arr.length; i < l; i += 1) {
			const value = arr[i];
			if (predicate(value, i)) return value;
		}
	}
	/**
	* Object::assign polyfill
	*
	* @param  {Object} obj
	* @param  {Object} ...objs
	* @return {Object}
	*/
	static assign(obj, ...assigners) {
		const result = obj;
		let i;
		let l;
		if (Object.assign) return Object.assign(obj, ...assigners);
		for (i = 0, l = assigners.length; i < l; i += 1) {
			const assigner = assigners[i];
			if (typeof assigner === "object" && assigner !== null) Object.keys(assigner).forEach((key) => {
				result[key] = assigner[key];
			});
		}
		return obj;
	}
	/**
	* Get short version/alias for a browser name
	*
	* @example
	*   getBrowserAlias('Microsoft Edge') // edge
	*
	* @param  {string} browserName
	* @return {string}
	*/
	static getBrowserAlias(browserName) {
		return BROWSER_ALIASES_MAP[browserName];
	}
	/**
	* Get browser name for a short version/alias
	*
	* @example
	*   getBrowserTypeByAlias('edge') // Microsoft Edge
	*
	* @param  {string} browserAlias
	* @return {string}
	*/
	static getBrowserTypeByAlias(browserAlias) {
		return BROWSER_MAP[browserAlias] || "";
	}
};
//#endregion
//#region ../../node_modules/.pnpm/bowser@2.14.1/node_modules/bowser/src/parser-browsers.js
/**
* Browsers' descriptors
*
* The idea of descriptors is simple. You should know about them two simple things:
* 1. Every descriptor has a method or property called `test` and a `describe` method.
* 2. Order of descriptors is important.
*
* More details:
* 1. Method or property `test` serves as a way to detect whether the UA string
* matches some certain browser or not. The `describe` method helps to make a result
* object with params that show some browser-specific things: name, version, etc.
* 2. Order of descriptors is important because a Parser goes through them one by one
* in course. For example, if you insert Chrome's descriptor as the first one,
* more then a half of browsers will be described as Chrome, because they will pass
* the Chrome descriptor's test.
*
* Descriptor's `test` could be a property with an array of RegExps, where every RegExp
* will be applied to a UA string to test it whether it matches or not.
* If a descriptor has two or more regexps in the `test` array it tests them one by one
* with a logical sum operation. Parser stops if it has found any RegExp that matches the UA.
*
* Or `test` could be a method. In that case it gets a Parser instance and should
* return true/false to get the Parser know if this browser descriptor matches the UA or not.
*/
var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
var browsersList = [
	{
		test: [/gptbot/i],
		describe(ua) {
			const browser = { name: "GPTBot" };
			const version = Utils.getFirstMatch(/gptbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/chatgpt-user/i],
		describe(ua) {
			const browser = { name: "ChatGPT-User" };
			const version = Utils.getFirstMatch(/chatgpt-user\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/oai-searchbot/i],
		describe(ua) {
			const browser = { name: "OAI-SearchBot" };
			const version = Utils.getFirstMatch(/oai-searchbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [
			/claudebot/i,
			/claude-web/i,
			/claude-user/i,
			/claude-searchbot/i
		],
		describe(ua) {
			const browser = { name: "ClaudeBot" };
			const version = Utils.getFirstMatch(/(?:claudebot|claude-web|claude-user|claude-searchbot)\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/omgilibot/i, /webzio-extended/i],
		describe(ua) {
			const browser = { name: "Omgilibot" };
			const version = Utils.getFirstMatch(/(?:omgilibot|webzio-extended)\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/diffbot/i],
		describe(ua) {
			const browser = { name: "Diffbot" };
			const version = Utils.getFirstMatch(/diffbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/perplexitybot/i],
		describe(ua) {
			const browser = { name: "PerplexityBot" };
			const version = Utils.getFirstMatch(/perplexitybot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/perplexity-user/i],
		describe(ua) {
			const browser = { name: "Perplexity-User" };
			const version = Utils.getFirstMatch(/perplexity-user\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/youbot/i],
		describe(ua) {
			const browser = { name: "YouBot" };
			const version = Utils.getFirstMatch(/youbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/meta-webindexer/i],
		describe(ua) {
			const browser = { name: "Meta-WebIndexer" };
			const version = Utils.getFirstMatch(/meta-webindexer\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/meta-externalads/i],
		describe(ua) {
			const browser = { name: "Meta-ExternalAds" };
			const version = Utils.getFirstMatch(/meta-externalads\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/meta-externalagent/i],
		describe(ua) {
			const browser = { name: "Meta-ExternalAgent" };
			const version = Utils.getFirstMatch(/meta-externalagent\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/meta-externalfetcher/i],
		describe(ua) {
			const browser = { name: "Meta-ExternalFetcher" };
			const version = Utils.getFirstMatch(/meta-externalfetcher\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/googlebot/i],
		describe(ua) {
			const browser = { name: "Googlebot" };
			const version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/linespider/i],
		describe(ua) {
			const browser = { name: "Linespider" };
			const version = Utils.getFirstMatch(/(?:linespider)(?:-[-\w]+)?[\s/](\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/amazonbot/i],
		describe(ua) {
			const browser = { name: "AmazonBot" };
			const version = Utils.getFirstMatch(/amazonbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/bingbot/i],
		describe(ua) {
			const browser = { name: "BingCrawler" };
			const version = Utils.getFirstMatch(/bingbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/baiduspider/i],
		describe(ua) {
			const browser = { name: "BaiduSpider" };
			const version = Utils.getFirstMatch(/baiduspider\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/duckduckbot/i],
		describe(ua) {
			const browser = { name: "DuckDuckBot" };
			const version = Utils.getFirstMatch(/duckduckbot\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/ia_archiver/i],
		describe(ua) {
			const browser = { name: "InternetArchiveCrawler" };
			const version = Utils.getFirstMatch(/ia_archiver\/(\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/facebookexternalhit/i, /facebookcatalog/i],
		describe() {
			return { name: "FacebookExternalHit" };
		}
	},
	{
		test: [/slackbot/i, /slack-imgProxy/i],
		describe(ua) {
			const browser = { name: "SlackBot" };
			const version = Utils.getFirstMatch(/(?:slackbot|slack-imgproxy)(?:-[-\w]+)?[\s/](\d+(\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/yahoo!?[\s/]*slurp/i],
		describe() {
			return { name: "YahooSlurp" };
		}
	},
	{
		test: [/yandexbot/i, /yandexmobilebot/i],
		describe() {
			return { name: "YandexBot" };
		}
	},
	{
		test: [/pingdom/i],
		describe() {
			return { name: "PingdomBot" };
		}
	},
	{
		test: [/opera/i],
		describe(ua) {
			const browser = { name: "Opera" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/opr\/|opios/i],
		describe(ua) {
			const browser = { name: "Opera" };
			const version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/SamsungBrowser/i],
		describe(ua) {
			const browser = { name: "Samsung Internet for Android" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/Whale/i],
		describe(ua) {
			const browser = { name: "NAVER Whale Browser" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/PaleMoon/i],
		describe(ua) {
			const browser = { name: "Pale Moon" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:PaleMoon)[\s/](\d+(?:\.\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/MZBrowser/i],
		describe(ua) {
			const browser = { name: "MZ Browser" };
			const version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/focus/i],
		describe(ua) {
			const browser = { name: "Focus" };
			const version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/swing/i],
		describe(ua) {
			const browser = { name: "Swing" };
			const version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/coast/i],
		describe(ua) {
			const browser = { name: "Opera Coast" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/opt\/\d+(?:.?_?\d+)+/i],
		describe(ua) {
			const browser = { name: "Opera Touch" };
			const version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/yabrowser/i],
		describe(ua) {
			const browser = { name: "Yandex Browser" };
			const version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/ucbrowser/i],
		describe(ua) {
			const browser = { name: "UC Browser" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/Maxthon|mxios/i],
		describe(ua) {
			const browser = { name: "Maxthon" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/epiphany/i],
		describe(ua) {
			const browser = { name: "Epiphany" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/puffin/i],
		describe(ua) {
			const browser = { name: "Puffin" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/sleipnir/i],
		describe(ua) {
			const browser = { name: "Sleipnir" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/k-meleon/i],
		describe(ua) {
			const browser = { name: "K-Meleon" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/micromessenger/i],
		describe(ua) {
			const browser = { name: "WeChat" };
			const version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/qqbrowser/i],
		describe(ua) {
			const browser = { name: /qqbrowserlite/i.test(ua) ? "QQ Browser Lite" : "QQ Browser" };
			const version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/msie|trident/i],
		describe(ua) {
			const browser = { name: "Internet Explorer" };
			const version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/\sedg\//i],
		describe(ua) {
			const browser = { name: "Microsoft Edge" };
			const version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/edg([ea]|ios)/i],
		describe(ua) {
			const browser = { name: "Microsoft Edge" };
			const version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/vivaldi/i],
		describe(ua) {
			const browser = { name: "Vivaldi" };
			const version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/seamonkey/i],
		describe(ua) {
			const browser = { name: "SeaMonkey" };
			const version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/sailfish/i],
		describe(ua) {
			const browser = { name: "Sailfish" };
			const version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/silk/i],
		describe(ua) {
			const browser = { name: "Amazon Silk" };
			const version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/phantom/i],
		describe(ua) {
			const browser = { name: "PhantomJS" };
			const version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/slimerjs/i],
		describe(ua) {
			const browser = { name: "SlimerJS" };
			const version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
		describe(ua) {
			const browser = { name: "BlackBerry" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/(web|hpw)[o0]s/i],
		describe(ua) {
			const browser = { name: "WebOS Browser" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/bada/i],
		describe(ua) {
			const browser = { name: "Bada" };
			const version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/tizen/i],
		describe(ua) {
			const browser = { name: "Tizen" };
			const version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/qupzilla/i],
		describe(ua) {
			const browser = { name: "QupZilla" };
			const version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/librewolf/i],
		describe(ua) {
			const browser = { name: "LibreWolf" };
			const version = Utils.getFirstMatch(/(?:librewolf)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/firefox|iceweasel|fxios/i],
		describe(ua) {
			const browser = { name: "Firefox" };
			const version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/electron/i],
		describe(ua) {
			const browser = { name: "Electron" };
			const version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [
			/sogoumobilebrowser/i,
			/metasr/i,
			/se 2\.[x]/i
		],
		describe(ua) {
			const browser = { name: "Sogou Browser" };
			const sogouMobileVersion = Utils.getFirstMatch(/(?:sogoumobilebrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
			const chromiumVersion = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
			const seVersion = Utils.getFirstMatch(/se ([\d.]+)x/i, ua);
			const version = sogouMobileVersion || chromiumVersion || seVersion;
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/MiuiBrowser/i],
		describe(ua) {
			const browser = { name: "Miui" };
			const version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test(parser) {
			if (parser.hasBrand("DuckDuckGo")) return true;
			return parser.test(/\sDdg\/[\d.]+$/i);
		},
		describe(ua, parser) {
			const browser = { name: "DuckDuckGo" };
			if (parser) {
				const hintsVersion = parser.getBrandVersion("DuckDuckGo");
				if (hintsVersion) {
					browser.version = hintsVersion;
					return browser;
				}
			}
			const uaVersion = Utils.getFirstMatch(/\sDdg\/([\d.]+)$/i, ua);
			if (uaVersion) browser.version = uaVersion;
			return browser;
		}
	},
	{
		test(parser) {
			return parser.hasBrand("Brave");
		},
		describe(ua, parser) {
			const browser = { name: "Brave" };
			if (parser) {
				const hintsVersion = parser.getBrandVersion("Brave");
				if (hintsVersion) {
					browser.version = hintsVersion;
					return browser;
				}
			}
			return browser;
		}
	},
	{
		test: [/chromium/i],
		describe(ua) {
			const browser = { name: "Chromium" };
			const version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/chrome|crios|crmo/i],
		describe(ua) {
			const browser = { name: "Chrome" };
			const version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/GSA/i],
		describe(ua) {
			const browser = { name: "Google Search" };
			const version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test(parser) {
			const notLikeAndroid = !parser.test(/like android/i);
			const butAndroid = parser.test(/android/i);
			return notLikeAndroid && butAndroid;
		},
		describe(ua) {
			const browser = { name: "Android Browser" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/playstation 4/i],
		describe(ua) {
			const browser = { name: "PlayStation 4" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/safari|applewebkit/i],
		describe(ua) {
			const browser = { name: "Safari" };
			const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
			if (version) browser.version = version;
			return browser;
		}
	},
	{
		test: [/.*/i],
		describe(ua) {
			const regexp = ua.search("\\(") !== -1 ? /^(.*)\/(.*)[ \t]\((.*)/ : /^(.*)\/(.*) /;
			return {
				name: Utils.getFirstMatch(regexp, ua),
				version: Utils.getSecondMatch(regexp, ua)
			};
		}
	}
];
//#endregion
//#region ../../node_modules/.pnpm/bowser@2.14.1/node_modules/bowser/src/parser-os.js
var parser_os_default = [
	{
		test: [/Roku\/DVP/],
		describe(ua) {
			const version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
			return {
				name: OS_MAP.Roku,
				version
			};
		}
	},
	{
		test: [/windows phone/i],
		describe(ua) {
			const version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
			return {
				name: OS_MAP.WindowsPhone,
				version
			};
		}
	},
	{
		test: [/windows /i],
		describe(ua) {
			const version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
			const versionName = Utils.getWindowsVersionName(version);
			return {
				name: OS_MAP.Windows,
				version,
				versionName
			};
		}
	},
	{
		test: [/Macintosh(.*?) FxiOS(.*?)\//],
		describe(ua) {
			const result = { name: OS_MAP.iOS };
			const version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
			if (version) result.version = version;
			return result;
		}
	},
	{
		test: [/macintosh/i],
		describe(ua) {
			const version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, ".");
			const versionName = Utils.getMacOSVersionName(version);
			const os = {
				name: OS_MAP.MacOS,
				version
			};
			if (versionName) os.versionName = versionName;
			return os;
		}
	},
	{
		test: [/(ipod|iphone|ipad)/i],
		describe(ua) {
			const version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, ".");
			return {
				name: OS_MAP.iOS,
				version
			};
		}
	},
	{
		test: [/OpenHarmony/i],
		describe(ua) {
			const version = Utils.getFirstMatch(/OpenHarmony\s+(\d+(\.\d+)*)/i, ua);
			return {
				name: OS_MAP.HarmonyOS,
				version
			};
		}
	},
	{
		test(parser) {
			const notLikeAndroid = !parser.test(/like android/i);
			const butAndroid = parser.test(/android/i);
			return notLikeAndroid && butAndroid;
		},
		describe(ua) {
			const version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
			const versionName = Utils.getAndroidVersionName(version);
			const os = {
				name: OS_MAP.Android,
				version
			};
			if (versionName) os.versionName = versionName;
			return os;
		}
	},
	{
		test: [/(web|hpw)[o0]s/i],
		describe(ua) {
			const version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
			const os = { name: OS_MAP.WebOS };
			if (version && version.length) os.version = version;
			return os;
		}
	},
	{
		test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
		describe(ua) {
			const version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua) || Utils.getFirstMatch(/\bbb(\d+)/i, ua);
			return {
				name: OS_MAP.BlackBerry,
				version
			};
		}
	},
	{
		test: [/bada/i],
		describe(ua) {
			const version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);
			return {
				name: OS_MAP.Bada,
				version
			};
		}
	},
	{
		test: [/tizen/i],
		describe(ua) {
			const version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);
			return {
				name: OS_MAP.Tizen,
				version
			};
		}
	},
	{
		test: [/linux/i],
		describe() {
			return { name: OS_MAP.Linux };
		}
	},
	{
		test: [/CrOS/],
		describe() {
			return { name: OS_MAP.ChromeOS };
		}
	},
	{
		test: [/PlayStation 4/],
		describe(ua) {
			const version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
			return {
				name: OS_MAP.PlayStation4,
				version
			};
		}
	}
];
//#endregion
//#region ../../node_modules/.pnpm/bowser@2.14.1/node_modules/bowser/src/parser-platforms.js
var parser_platforms_default = [
	{
		test: [/googlebot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Google"
			};
		}
	},
	{
		test: [/linespider/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Line"
			};
		}
	},
	{
		test: [/amazonbot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Amazon"
			};
		}
	},
	{
		test: [/gptbot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "OpenAI"
			};
		}
	},
	{
		test: [/chatgpt-user/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "OpenAI"
			};
		}
	},
	{
		test: [/oai-searchbot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "OpenAI"
			};
		}
	},
	{
		test: [/baiduspider/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Baidu"
			};
		}
	},
	{
		test: [/bingbot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Bing"
			};
		}
	},
	{
		test: [/duckduckbot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "DuckDuckGo"
			};
		}
	},
	{
		test: [
			/claudebot/i,
			/claude-web/i,
			/claude-user/i,
			/claude-searchbot/i
		],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Anthropic"
			};
		}
	},
	{
		test: [/omgilibot/i, /webzio-extended/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Webz.io"
			};
		}
	},
	{
		test: [/diffbot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Diffbot"
			};
		}
	},
	{
		test: [/perplexitybot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Perplexity AI"
			};
		}
	},
	{
		test: [/perplexity-user/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Perplexity AI"
			};
		}
	},
	{
		test: [/youbot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "You.com"
			};
		}
	},
	{
		test: [/ia_archiver/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Internet Archive"
			};
		}
	},
	{
		test: [/meta-webindexer/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Meta"
			};
		}
	},
	{
		test: [/meta-externalads/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Meta"
			};
		}
	},
	{
		test: [/meta-externalagent/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Meta"
			};
		}
	},
	{
		test: [/meta-externalfetcher/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Meta"
			};
		}
	},
	{
		test: [/facebookexternalhit/i, /facebookcatalog/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Meta"
			};
		}
	},
	{
		test: [/slackbot/i, /slack-imgProxy/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Slack"
			};
		}
	},
	{
		test: [/yahoo/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Yahoo"
			};
		}
	},
	{
		test: [/yandexbot/i, /yandexmobilebot/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Yandex"
			};
		}
	},
	{
		test: [/pingdom/i],
		describe() {
			return {
				type: PLATFORMS_MAP.bot,
				vendor: "Pingdom"
			};
		}
	},
	{
		test: [/huawei/i],
		describe(ua) {
			const model = Utils.getFirstMatch(/(can-l01)/i, ua) && "Nova";
			const platform = {
				type: PLATFORMS_MAP.mobile,
				vendor: "Huawei"
			};
			if (model) platform.model = model;
			return platform;
		}
	},
	{
		test: [/nexus\s*(?:7|8|9|10).*/i],
		describe() {
			return {
				type: PLATFORMS_MAP.tablet,
				vendor: "Nexus"
			};
		}
	},
	{
		test: [/ipad/i],
		describe() {
			return {
				type: PLATFORMS_MAP.tablet,
				vendor: "Apple",
				model: "iPad"
			};
		}
	},
	{
		test: [/Macintosh(.*?) FxiOS(.*?)\//],
		describe() {
			return {
				type: PLATFORMS_MAP.tablet,
				vendor: "Apple",
				model: "iPad"
			};
		}
	},
	{
		test: [/kftt build/i],
		describe() {
			return {
				type: PLATFORMS_MAP.tablet,
				vendor: "Amazon",
				model: "Kindle Fire HD 7"
			};
		}
	},
	{
		test: [/silk/i],
		describe() {
			return {
				type: PLATFORMS_MAP.tablet,
				vendor: "Amazon"
			};
		}
	},
	{
		test: [/tablet(?! pc)/i],
		describe() {
			return { type: PLATFORMS_MAP.tablet };
		}
	},
	{
		test(parser) {
			const iDevice = parser.test(/ipod|iphone/i);
			const likeIDevice = parser.test(/like (ipod|iphone)/i);
			return iDevice && !likeIDevice;
		},
		describe(ua) {
			const model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
			return {
				type: PLATFORMS_MAP.mobile,
				vendor: "Apple",
				model
			};
		}
	},
	{
		test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
		describe() {
			return {
				type: PLATFORMS_MAP.mobile,
				vendor: "Nexus"
			};
		}
	},
	{
		test: [/Nokia/i],
		describe(ua) {
			const model = Utils.getFirstMatch(/Nokia\s+([0-9]+(\.[0-9]+)?)/i, ua);
			const platform = {
				type: PLATFORMS_MAP.mobile,
				vendor: "Nokia"
			};
			if (model) platform.model = model;
			return platform;
		}
	},
	{
		test: [/[^-]mobi/i],
		describe() {
			return { type: PLATFORMS_MAP.mobile };
		}
	},
	{
		test(parser) {
			return parser.getBrowserName(true) === "blackberry";
		},
		describe() {
			return {
				type: PLATFORMS_MAP.mobile,
				vendor: "BlackBerry"
			};
		}
	},
	{
		test(parser) {
			return parser.getBrowserName(true) === "bada";
		},
		describe() {
			return { type: PLATFORMS_MAP.mobile };
		}
	},
	{
		test(parser) {
			return parser.getBrowserName() === "windows phone";
		},
		describe() {
			return {
				type: PLATFORMS_MAP.mobile,
				vendor: "Microsoft"
			};
		}
	},
	{
		test(parser) {
			const osMajorVersion = Number(String(parser.getOSVersion()).split(".")[0]);
			return parser.getOSName(true) === "android" && osMajorVersion >= 3;
		},
		describe() {
			return { type: PLATFORMS_MAP.tablet };
		}
	},
	{
		test(parser) {
			return parser.getOSName(true) === "android";
		},
		describe() {
			return { type: PLATFORMS_MAP.mobile };
		}
	},
	{
		test: [/smart-?tv|smarttv/i],
		describe() {
			return { type: PLATFORMS_MAP.tv };
		}
	},
	{
		test: [/netcast/i],
		describe() {
			return { type: PLATFORMS_MAP.tv };
		}
	},
	{
		test(parser) {
			return parser.getOSName(true) === "macos";
		},
		describe() {
			return {
				type: PLATFORMS_MAP.desktop,
				vendor: "Apple"
			};
		}
	},
	{
		test(parser) {
			return parser.getOSName(true) === "windows";
		},
		describe() {
			return { type: PLATFORMS_MAP.desktop };
		}
	},
	{
		test(parser) {
			return parser.getOSName(true) === "linux";
		},
		describe() {
			return { type: PLATFORMS_MAP.desktop };
		}
	},
	{
		test(parser) {
			return parser.getOSName(true) === "playstation 4";
		},
		describe() {
			return { type: PLATFORMS_MAP.tv };
		}
	},
	{
		test(parser) {
			return parser.getOSName(true) === "roku";
		},
		describe() {
			return { type: PLATFORMS_MAP.tv };
		}
	}
];
//#endregion
//#region ../../node_modules/.pnpm/bowser@2.14.1/node_modules/bowser/src/parser-engines.js
var parser_engines_default = [
	{
		test(parser) {
			return parser.getBrowserName(true) === "microsoft edge";
		},
		describe(ua) {
			if (/\sedg\//i.test(ua)) return { name: ENGINE_MAP.Blink };
			const version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);
			return {
				name: ENGINE_MAP.EdgeHTML,
				version
			};
		}
	},
	{
		test: [/trident/i],
		describe(ua) {
			const engine = { name: ENGINE_MAP.Trident };
			const version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) engine.version = version;
			return engine;
		}
	},
	{
		test(parser) {
			return parser.test(/presto/i);
		},
		describe(ua) {
			const engine = { name: ENGINE_MAP.Presto };
			const version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) engine.version = version;
			return engine;
		}
	},
	{
		test(parser) {
			const isGecko = parser.test(/gecko/i);
			const likeGecko = parser.test(/like gecko/i);
			return isGecko && !likeGecko;
		},
		describe(ua) {
			const engine = { name: ENGINE_MAP.Gecko };
			const version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) engine.version = version;
			return engine;
		}
	},
	{
		test: [/(apple)?webkit\/537\.36/i],
		describe() {
			return { name: ENGINE_MAP.Blink };
		}
	},
	{
		test: [/(apple)?webkit/i],
		describe(ua) {
			const engine = { name: ENGINE_MAP.WebKit };
			const version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);
			if (version) engine.version = version;
			return engine;
		}
	}
];
//#endregion
//#region ../../node_modules/.pnpm/bowser@2.14.1/node_modules/bowser/src/parser.js
/**
* @typedef {Object} ClientHints
* @property {Array<{brand: string, version: string}>} [brands] Array of brand objects
* @property {boolean} [mobile] Whether the device is mobile
* @property {string} [platform] Platform name (e.g., "Windows", "macOS")
* @property {string} [platformVersion] Platform version
* @property {string} [architecture] CPU architecture
* @property {string} [model] Device model
* @property {boolean} [wow64] Whether running under WoW64
*/
/**
* The main class that arranges the whole parsing process.
*/
var Parser = class {
	/**
	* Create instance of Parser
	*
	* @param {String} UA User-Agent string
	* @param {Boolean|ClientHints} [skipParsingOrHints=false] Either a boolean to skip parsing,
	* or a ClientHints object containing User-Agent Client Hints data
	* @param {ClientHints} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
	*
	* @throw {Error} in case of empty UA String
	*
	* @constructor
	*/
	constructor(UA, skipParsingOrHints = false, clientHints = null) {
		if (UA === void 0 || UA === null || UA === "") throw new Error("UserAgent parameter can't be empty");
		this._ua = UA;
		let skipParsing = false;
		if (typeof skipParsingOrHints === "boolean") {
			skipParsing = skipParsingOrHints;
			this._hints = clientHints;
		} else if (skipParsingOrHints != null && typeof skipParsingOrHints === "object") this._hints = skipParsingOrHints;
		else this._hints = null;
		/**
		* @typedef ParsedResult
		* @property {Object} browser
		* @property {String|undefined} [browser.name]
		* Browser name, like `"Chrome"` or `"Internet Explorer"`
		* @property {String|undefined} [browser.version] Browser version as a String `"12.01.45334.10"`
		* @property {Object} os
		* @property {String|undefined} [os.name] OS name, like `"Windows"` or `"macOS"`
		* @property {String|undefined} [os.version] OS version, like `"NT 5.1"` or `"10.11.1"`
		* @property {String|undefined} [os.versionName] OS name, like `"XP"` or `"High Sierra"`
		* @property {Object} platform
		* @property {String|undefined} [platform.type]
		* platform type, can be either `"desktop"`, `"tablet"` or `"mobile"`
		* @property {String|undefined} [platform.vendor] Vendor of the device,
		* like `"Apple"` or `"Samsung"`
		* @property {String|undefined} [platform.model] Device model,
		* like `"iPhone"` or `"Kindle Fire HD 7"`
		* @property {Object} engine
		* @property {String|undefined} [engine.name]
		* Can be any of this: `WebKit`, `Blink`, `Gecko`, `Trident`, `Presto`, `EdgeHTML`
		* @property {String|undefined} [engine.version] String version of the engine
		*/
		this.parsedResult = {};
		if (skipParsing !== true) this.parse();
	}
	/**
	* Get Client Hints data
	* @return {ClientHints|null}
	*
	* @public
	* @example
	* const parser = Bowser.getParser(UA, clientHints);
	* const hints = parser.getHints();
	* console.log(hints.platform); // 'Windows'
	* console.log(hints.mobile); // false
	*/
	getHints() {
		return this._hints;
	}
	/**
	* Check if a brand exists in Client Hints brands array
	* @param {string} brandName The brand name to check for
	* @return {boolean}
	*
	* @public
	* @example
	* const parser = Bowser.getParser(UA, clientHints);
	* if (parser.hasBrand('Google Chrome')) {
	*   console.log('Chrome detected!');
	* }
	*/
	hasBrand(brandName) {
		if (!this._hints || !Array.isArray(this._hints.brands)) return false;
		const brandLower = brandName.toLowerCase();
		return this._hints.brands.some((b) => b.brand && b.brand.toLowerCase() === brandLower);
	}
	/**
	* Get brand version from Client Hints
	* @param {string} brandName The brand name to get version for
	* @return {string|undefined}
	*
	* @public
	* @example
	* const parser = Bowser.getParser(UA, clientHints);
	* const version = parser.getBrandVersion('Google Chrome');
	* console.log(version); // '131'
	*/
	getBrandVersion(brandName) {
		if (!this._hints || !Array.isArray(this._hints.brands)) return;
		const brandLower = brandName.toLowerCase();
		const brand = this._hints.brands.find((b) => b.brand && b.brand.toLowerCase() === brandLower);
		return brand ? brand.version : void 0;
	}
	/**
	* Get UserAgent string of current Parser instance
	* @return {String} User-Agent String of the current <Parser> object
	*
	* @public
	*/
	getUA() {
		return this._ua;
	}
	/**
	* Test a UA string for a regexp
	* @param {RegExp} regex
	* @return {Boolean}
	*/
	test(regex) {
		return regex.test(this._ua);
	}
	/**
	* Get parsed browser object
	* @return {Object}
	*/
	parseBrowser() {
		this.parsedResult.browser = {};
		const browserDescriptor = Utils.find(browsersList, (_browser) => {
			if (typeof _browser.test === "function") return _browser.test(this);
			if (Array.isArray(_browser.test)) return _browser.test.some((condition) => this.test(condition));
			throw new Error("Browser's test function is not valid");
		});
		if (browserDescriptor) this.parsedResult.browser = browserDescriptor.describe(this.getUA(), this);
		return this.parsedResult.browser;
	}
	/**
	* Get parsed browser object
	* @return {Object}
	*
	* @public
	*/
	getBrowser() {
		if (this.parsedResult.browser) return this.parsedResult.browser;
		return this.parseBrowser();
	}
	/**
	* Get browser's name
	* @return {String} Browser's name or an empty string
	*
	* @public
	*/
	getBrowserName(toLowerCase) {
		if (toLowerCase) return String(this.getBrowser().name).toLowerCase() || "";
		return this.getBrowser().name || "";
	}
	/**
	* Get browser's version
	* @return {String} version of browser
	*
	* @public
	*/
	getBrowserVersion() {
		return this.getBrowser().version;
	}
	/**
	* Get OS
	* @return {Object}
	*
	* @example
	* this.getOS();
	* {
	*   name: 'macOS',
	*   version: '10.11.12'
	* }
	*/
	getOS() {
		if (this.parsedResult.os) return this.parsedResult.os;
		return this.parseOS();
	}
	/**
	* Parse OS and save it to this.parsedResult.os
	* @return {*|{}}
	*/
	parseOS() {
		this.parsedResult.os = {};
		const os = Utils.find(parser_os_default, (_os) => {
			if (typeof _os.test === "function") return _os.test(this);
			if (Array.isArray(_os.test)) return _os.test.some((condition) => this.test(condition));
			throw new Error("Browser's test function is not valid");
		});
		if (os) this.parsedResult.os = os.describe(this.getUA());
		return this.parsedResult.os;
	}
	/**
	* Get OS name
	* @param {Boolean} [toLowerCase] return lower-cased value
	* @return {String} name of the OS — macOS, Windows, Linux, etc.
	*/
	getOSName(toLowerCase) {
		const { name } = this.getOS();
		if (toLowerCase) return String(name).toLowerCase() || "";
		return name || "";
	}
	/**
	* Get OS version
	* @return {String} full version with dots ('10.11.12', '5.6', etc)
	*/
	getOSVersion() {
		return this.getOS().version;
	}
	/**
	* Get parsed platform
	* @return {{}}
	*/
	getPlatform() {
		if (this.parsedResult.platform) return this.parsedResult.platform;
		return this.parsePlatform();
	}
	/**
	* Get platform name
	* @param {Boolean} [toLowerCase=false]
	* @return {*}
	*/
	getPlatformType(toLowerCase = false) {
		const { type } = this.getPlatform();
		if (toLowerCase) return String(type).toLowerCase() || "";
		return type || "";
	}
	/**
	* Get parsed platform
	* @return {{}}
	*/
	parsePlatform() {
		this.parsedResult.platform = {};
		const platform = Utils.find(parser_platforms_default, (_platform) => {
			if (typeof _platform.test === "function") return _platform.test(this);
			if (Array.isArray(_platform.test)) return _platform.test.some((condition) => this.test(condition));
			throw new Error("Browser's test function is not valid");
		});
		if (platform) this.parsedResult.platform = platform.describe(this.getUA());
		return this.parsedResult.platform;
	}
	/**
	* Get parsed engine
	* @return {{}}
	*/
	getEngine() {
		if (this.parsedResult.engine) return this.parsedResult.engine;
		return this.parseEngine();
	}
	/**
	* Get engines's name
	* @return {String} Engines's name or an empty string
	*
	* @public
	*/
	getEngineName(toLowerCase) {
		if (toLowerCase) return String(this.getEngine().name).toLowerCase() || "";
		return this.getEngine().name || "";
	}
	/**
	* Get parsed platform
	* @return {{}}
	*/
	parseEngine() {
		this.parsedResult.engine = {};
		const engine = Utils.find(parser_engines_default, (_engine) => {
			if (typeof _engine.test === "function") return _engine.test(this);
			if (Array.isArray(_engine.test)) return _engine.test.some((condition) => this.test(condition));
			throw new Error("Browser's test function is not valid");
		});
		if (engine) this.parsedResult.engine = engine.describe(this.getUA());
		return this.parsedResult.engine;
	}
	/**
	* Parse full information about the browser
	* @returns {Parser}
	*/
	parse() {
		this.parseBrowser();
		this.parseOS();
		this.parsePlatform();
		this.parseEngine();
		return this;
	}
	/**
	* Get parsed result
	* @return {ParsedResult}
	*/
	getResult() {
		return Utils.assign({}, this.parsedResult);
	}
	/**
	* Check if parsed browser matches certain conditions
	*
	* @param {Object} checkTree It's one or two layered object,
	* which can include a platform or an OS on the first layer
	* and should have browsers specs on the bottom-laying layer
	*
	* @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
	* Returns `undefined` when the browser is no described in the checkTree object.
	*
	* @example
	* const browser = Bowser.getParser(window.navigator.userAgent);
	* if (browser.satisfies({chrome: '>118.01.1322' }))
	* // or with os
	* if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
	* // or with platforms
	* if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
	*/
	satisfies(checkTree) {
		const platformsAndOSes = {};
		let platformsAndOSCounter = 0;
		const browsers = {};
		let browsersCounter = 0;
		Object.keys(checkTree).forEach((key) => {
			const currentDefinition = checkTree[key];
			if (typeof currentDefinition === "string") {
				browsers[key] = currentDefinition;
				browsersCounter += 1;
			} else if (typeof currentDefinition === "object") {
				platformsAndOSes[key] = currentDefinition;
				platformsAndOSCounter += 1;
			}
		});
		if (platformsAndOSCounter > 0) {
			const platformsAndOSNames = Object.keys(platformsAndOSes);
			const OSMatchingDefinition = Utils.find(platformsAndOSNames, (name) => this.isOS(name));
			if (OSMatchingDefinition) {
				const osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);
				if (osResult !== void 0) return osResult;
			}
			const platformMatchingDefinition = Utils.find(platformsAndOSNames, (name) => this.isPlatform(name));
			if (platformMatchingDefinition) {
				const platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);
				if (platformResult !== void 0) return platformResult;
			}
		}
		if (browsersCounter > 0) {
			const browserNames = Object.keys(browsers);
			const matchingDefinition = Utils.find(browserNames, (name) => this.isBrowser(name, true));
			if (matchingDefinition !== void 0) return this.compareVersion(browsers[matchingDefinition]);
		}
	}
	/**
	* Check if the browser name equals the passed string
	* @param {string} browserName The string to compare with the browser name
	* @param [includingAlias=false] The flag showing whether alias will be included into comparison
	* @returns {boolean}
	*/
	isBrowser(browserName, includingAlias = false) {
		const defaultBrowserName = this.getBrowserName().toLowerCase();
		let browserNameLower = browserName.toLowerCase();
		const alias = Utils.getBrowserTypeByAlias(browserNameLower);
		if (includingAlias && alias) browserNameLower = alias.toLowerCase();
		return browserNameLower === defaultBrowserName;
	}
	compareVersion(version) {
		let expectedResults = [0];
		let comparableVersion = version;
		let isLoose = false;
		const currentBrowserVersion = this.getBrowserVersion();
		if (typeof currentBrowserVersion !== "string") return;
		if (version[0] === ">" || version[0] === "<") {
			comparableVersion = version.substr(1);
			if (version[1] === "=") {
				isLoose = true;
				comparableVersion = version.substr(2);
			} else expectedResults = [];
			if (version[0] === ">") expectedResults.push(1);
			else expectedResults.push(-1);
		} else if (version[0] === "=") comparableVersion = version.substr(1);
		else if (version[0] === "~") {
			isLoose = true;
			comparableVersion = version.substr(1);
		}
		return expectedResults.indexOf(Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose)) > -1;
	}
	/**
	* Check if the OS name equals the passed string
	* @param {string} osName The string to compare with the OS name
	* @returns {boolean}
	*/
	isOS(osName) {
		return this.getOSName(true) === String(osName).toLowerCase();
	}
	/**
	* Check if the platform type equals the passed string
	* @param {string} platformType The string to compare with the platform type
	* @returns {boolean}
	*/
	isPlatform(platformType) {
		return this.getPlatformType(true) === String(platformType).toLowerCase();
	}
	/**
	* Check if the engine name equals the passed string
	* @param {string} engineName The string to compare with the engine name
	* @returns {boolean}
	*/
	isEngine(engineName) {
		return this.getEngineName(true) === String(engineName).toLowerCase();
	}
	/**
	* Is anything? Check if the browser is called "anything",
	* the OS called "anything" or the platform called "anything"
	* @param {String} anything
	* @param [includingAlias=false] The flag showing whether alias will be included into comparison
	* @returns {Boolean}
	*/
	is(anything, includingAlias = false) {
		return this.isBrowser(anything, includingAlias) || this.isOS(anything) || this.isPlatform(anything);
	}
	/**
	* Check if any of the given values satisfies this.is(anything)
	* @param {String[]} anythings
	* @returns {Boolean}
	*/
	some(anythings = []) {
		return anythings.some((anything) => this.is(anything));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/bowser@2.14.1/node_modules/bowser/src/bowser.js
/*!
* Bowser - a browser detector
* https://github.com/bowser-js/bowser
* MIT License | (c) Dustin Diaz 2012-2015
* MIT License | (c) Denis Demchenko 2015-2019
*/
/**
* Bowser class.
* Keep it simple as much as it can be.
* It's supposed to work with collections of {@link Parser} instances
* rather then solve one-instance problems.
* All the one-instance stuff is located in Parser class.
*
* @class
* @classdesc Bowser is a static object, that provides an API to the Parsers
* @hideconstructor
*/
var Bowser = class {
	/**
	* Creates a {@link Parser} instance
	*
	* @param {String} UA UserAgent string
	* @param {Boolean|Object} [skipParsingOrHints=false] Either a boolean to skip parsing,
	* or a ClientHints object (navigator.userAgentData)
	* @param {Object} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
	* @returns {Parser}
	* @throws {Error} when UA is not a String
	*
	* @example
	* const parser = Bowser.getParser(window.navigator.userAgent);
	* const result = parser.getResult();
	*
	* @example
	* // With User-Agent Client Hints
	* const parser = Bowser.getParser(
	*   window.navigator.userAgent,
	*   window.navigator.userAgentData
	* );
	*/
	static getParser(UA, skipParsingOrHints = false, clientHints = null) {
		if (typeof UA !== "string") throw new Error("UserAgent should be a string");
		return new Parser(UA, skipParsingOrHints, clientHints);
	}
	/**
	* Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
	*
	* @param {String} UA UserAgent string
	* @param {Object} [clientHints] User-Agent Client Hints data (navigator.userAgentData)
	* @return {ParsedResult}
	*
	* @example
	* const result = Bowser.parse(window.navigator.userAgent);
	*
	* @example
	* // With User-Agent Client Hints
	* const result = Bowser.parse(
	*   window.navigator.userAgent,
	*   window.navigator.userAgentData
	* );
	*/
	static parse(UA, clientHints = null) {
		return new Parser(UA, clientHints).getResult();
	}
	static get BROWSER_MAP() {
		return BROWSER_MAP;
	}
	static get ENGINE_MAP() {
		return ENGINE_MAP;
	}
	static get OS_MAP() {
		return OS_MAP;
	}
	static get PLATFORMS_MAP() {
		return PLATFORMS_MAP;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@metamask+superstruct@3.2.1/node_modules/@metamask/superstruct/dist/error.mjs
/**
* A `StructFailure` represents a single specific failure in validation.
*/
/**
* `StructError` objects are thrown (or returned) when validation fails.
*
* Validation logic is design to exit early for maximum performance. The error
* represents the first error encountered during validation. For more detail,
* the `error.failures` property is a generator function that can be run to
* continue validation and receive all the failures in the data.
*/
var StructError = class extends TypeError {
	constructor(failure, failures) {
		let cached;
		const { message, explanation, ...rest } = failure;
		const { path } = failure;
		const cause = path.length === 0 ? message : `At path: ${path.join(".")} -- ${message}`;
		super(explanation ?? cause);
		if (explanation !== null && explanation !== void 0) this.cause = cause;
		Object.assign(this, rest);
		this.name = this.constructor.name;
		this.failures = () => {
			return cached ?? (cached = [failure, ...failures()]);
		};
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@metamask+superstruct@3.2.1/node_modules/@metamask/superstruct/dist/utils.mjs
/**
* Check if a value is an iterator.
*
* @param value - The value to check.
* @returns Whether the value is an iterator.
*/
function isIterable(value) {
	return isObject$1(value) && typeof value[Symbol.iterator] === "function";
}
/**
* Check if a value is a plain object.
*
* @param value - The value to check.
* @returns Whether the value is a plain object.
*/
function isObject$1(value) {
	return typeof value === "object" && value !== null;
}
/**
* Return a value as a printable string.
*
* @param value - The value to print.
* @returns The value as a string.
*/
function print(value) {
	if (typeof value === "symbol") return value.toString();
	return typeof value === "string" ? JSON.stringify(value) : `${value}`;
}
/**
* Shift (remove and return) the first value from the `input` iterator.
* Like `Array.prototype.shift()` but for an `Iterator`.
*
* @param input - The iterator to shift.
* @returns The first value of the iterator, or `undefined` if the iterator is
* empty.
*/
function shiftIterator(input) {
	const { done, value } = input.next();
	return done ? void 0 : value;
}
/**
* Convert a single validation result to a failure.
*
* @param result - The result to convert.
* @param context - The context of the validation.
* @param struct - The struct being validated.
* @param value - The value being validated.
* @returns A failure if the result is a failure, or `undefined` if the result
* is a success.
*/
function toFailure(result, context, struct, value) {
	if (result === true) return;
	else if (result === false) result = {};
	else if (typeof result === "string") result = { message: result };
	const { path, branch } = context;
	const { type } = struct;
	const { refinement, message = `Expected a value of type \`${type}\`${refinement ? ` with refinement \`${refinement}\`` : ""}, but received: \`${print(value)}\`` } = result;
	return {
		value,
		type,
		refinement,
		key: path[path.length - 1],
		path,
		branch,
		...result,
		message
	};
}
/**
* Convert a validation result to an iterable of failures.
*
* @param result - The result to convert.
* @param context - The context of the validation.
* @param struct - The struct being validated.
* @param value - The value being validated.
* @yields The failures.
* @returns An iterable of failures.
*/
function* toFailures(result, context, struct, value) {
	if (!isIterable(result)) result = [result];
	for (const validationResult of result) {
		const failure = toFailure(validationResult, context, struct, value);
		if (failure) yield failure;
	}
}
/**
* Check a value against a struct, traversing deeply into nested values, and
* returning an iterator of failures or success.
*
* @param value - The value to check.
* @param struct - The struct to check against.
* @param options - Optional settings.
* @param options.path - The path to the value in the input data.
* @param options.branch - The branch of the value in the input data.
* @param options.coerce - Whether to coerce the value before validating it.
* @param options.mask - Whether to mask the value before validating it.
* @param options.message - An optional message to include in the error.
* @yields An iterator of failures or success.
* @returns An iterator of failures or success.
*/
function* run(value, struct, options = {}) {
	const { path = [], branch = [value], coerce = false, mask = false } = options;
	const context = {
		path,
		branch
	};
	if (coerce) {
		value = struct.coercer(value, context);
		if (mask && struct.type !== "type" && isObject$1(struct.schema) && isObject$1(value) && !Array.isArray(value)) {
			for (const key in value) if (struct.schema[key] === void 0) delete value[key];
		}
	}
	let status = "valid";
	for (const failure of struct.validator(value, context)) {
		failure.explanation = options.message;
		status = "not_valid";
		yield [failure, void 0];
	}
	for (let [innerKey, innerValue, innerStruct] of struct.entries(value, context)) {
		const iterable = run(innerValue, innerStruct, {
			path: innerKey === void 0 ? path : [...path, innerKey],
			branch: innerKey === void 0 ? branch : [...branch, innerValue],
			coerce,
			mask,
			message: options.message
		});
		for (const result of iterable) if (result[0]) {
			status = result[0].refinement === null || result[0].refinement === void 0 ? "not_valid" : "not_refined";
			yield [result[0], void 0];
		} else if (coerce) {
			innerValue = result[1];
			if (innerKey === void 0) value = innerValue;
			else if (value instanceof Map) value.set(innerKey, innerValue);
			else if (value instanceof Set) value.add(innerValue);
			else if (isObject$1(value)) {
				if (innerValue !== void 0 || innerKey in value) value[innerKey] = innerValue;
			}
		}
	}
	if (status !== "not_valid") for (const failure of struct.refiner(value, context)) {
		failure.explanation = options.message;
		status = "not_refined";
		yield [failure, void 0];
	}
	if (status === "valid") yield [void 0, value];
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+superstruct@3.2.1/node_modules/@metamask/superstruct/dist/struct.mjs
/**
* `Struct` objects encapsulate the validation logic for a specific type of
* values. Once constructed, you use the `assert`, `is` or `validate` helpers to
* validate unknown input data against the struct.
*/
var Struct = class {
	constructor(props) {
		const { type, schema, validator, refiner, coercer = (value) => value, entries = function* () {} } = props;
		this.type = type;
		this.schema = schema;
		this.entries = entries;
		this.coercer = coercer;
		if (validator) this.validator = (value, context) => {
			return toFailures(validator(value, context), context, this, value);
		};
		else this.validator = () => [];
		if (refiner) this.refiner = (value, context) => {
			return toFailures(refiner(value, context), context, this, value);
		};
		else this.refiner = () => [];
	}
	/**
	* Assert that a value passes the struct's validation, throwing if it doesn't.
	*/
	assert(value, message) {
		return assert(value, this, message);
	}
	/**
	* Create a value with the struct's coercion logic, then validate it.
	*/
	create(value, message) {
		return create(value, this, message);
	}
	/**
	* Check if a value passes the struct's validation.
	*/
	is(value) {
		return is(value, this);
	}
	/**
	* Mask a value, coercing and validating it, but returning only the subset of
	* properties defined by the struct's schema.
	*/
	mask(value, message) {
		return mask(value, this, message);
	}
	/**
	* Validate a value with the struct's validation logic, returning a tuple
	* representing the result.
	*
	* You may optionally pass `true` for the `withCoercion` argument to coerce
	* the value before attempting to validate it. If you do, the result will
	* contain the coerced result when successful.
	*/
	validate(value, options = {}) {
		return validate(value, this, options);
	}
};
var ExactOptionalBrand = "EXACT_OPTIONAL";
/**
* An `ExactOptionalStruct` is a `Struct` that is used to create exactly optional
* properties of `object()` structs.
*/
var ExactOptionalStruct = class extends Struct {
	constructor(props) {
		super({
			...props,
			type: `exact optional ${props.type}`
		});
		this.brand = ExactOptionalBrand;
	}
	static isExactOptional(value) {
		return isObject$1(value) && "brand" in value && value.brand === ExactOptionalBrand;
	}
};
/**
* Assert that a value passes a struct, throwing if it doesn't.
*
* @param value - The value to validate.
* @param struct - The struct to validate against.
* @param message - An optional message to include in the error.
*/
function assert(value, struct, message) {
	const result = validate(value, struct, { message });
	if (result[0]) throw result[0];
}
/**
* Create a value with the coercion logic of struct and validate it.
*
* @param value - The value to coerce and validate.
* @param struct - The struct to validate against.
* @param message - An optional message to include in the error.
* @returns The coerced and validated value.
*/
function create(value, struct, message) {
	const result = validate(value, struct, {
		coerce: true,
		message
	});
	if (result[0]) throw result[0];
	else return result[1];
}
/**
* Mask a value, returning only the subset of properties defined by a struct.
*
* @param value - The value to mask.
* @param struct - The struct to mask against.
* @param message - An optional message to include in the error.
* @returns The masked value.
*/
function mask(value, struct, message) {
	const result = validate(value, struct, {
		coerce: true,
		mask: true,
		message
	});
	if (result[0]) throw result[0];
	else return result[1];
}
/**
* Check if a value passes a struct.
*
* @param value - The value to validate.
* @param struct - The struct to validate against.
* @returns `true` if the value passes the struct, `false` otherwise.
*/
function is(value, struct) {
	return !validate(value, struct)[0];
}
/**
* Validate a value against a struct, returning an error if invalid, or the
* value (with potential coercion) if valid.
*
* @param value - The value to validate.
* @param struct - The struct to validate against.
* @param options - Optional settings.
* @param options.coerce - Whether to coerce the value before validating it.
* @param options.mask - Whether to mask the value before validating it.
* @param options.message - An optional message to include in the error.
* @returns A tuple containing the error (if invalid) and the validated value.
*/
function validate(value, struct, options = {}) {
	const tuples = run(value, struct, options);
	const tuple = shiftIterator(tuples);
	if (tuple[0]) return [new StructError(tuple[0], function* () {
		for (const innerTuple of tuples) if (innerTuple[0]) yield innerTuple[0];
	}), void 0];
	return [void 0, tuple[1]];
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+superstruct@3.2.1/node_modules/@metamask/superstruct/dist/structs/utilities.mjs
/**
* Define a new struct type with a custom validation function.
*
* @param name - The name of the struct type.
* @param validator - The validation function.
* @returns A new struct type.
*/
function define(name, validator) {
	return new Struct({
		type: name,
		schema: null,
		validator
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+superstruct@3.2.1/node_modules/@metamask/superstruct/dist/structs/types.mjs
/**
* Ensure that any value passes validation.
*
* @returns A struct that will always pass validation.
*/
function any() {
	return define("any", () => true);
}
/**
* Ensure that a value is an array and that its elements are of a specific type.
*
* Note: If you omit the element struct, the arrays elements will not be
* iterated at all. This can be helpful for cases where performance is critical,
* and it is preferred to using `array(any())`.
*
* @param Element - The struct to validate each element in the array against.
* @returns A new struct that will only accept arrays of the given type.
*/
function array(Element) {
	return new Struct({
		type: "array",
		schema: Element,
		*entries(value) {
			if (Element && Array.isArray(value)) for (const [index, arrayValue] of value.entries()) yield [
				index,
				arrayValue,
				Element
			];
		},
		coercer(value) {
			return Array.isArray(value) ? value.slice() : value;
		},
		validator(value) {
			return Array.isArray(value) || `Expected an array value, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is an integer.
*
* @returns A new struct that will only accept integers.
*/
function integer() {
	return define("integer", (value) => {
		return typeof value === "number" && !isNaN(value) && Number.isInteger(value) || `Expected an integer, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value is an exact value, using `===` for comparison.
*
* @param constant - The exact value that the input must be.
* @returns A new struct that will only accept the exact given value.
*/
function literal(constant) {
	const description = print(constant);
	const valueType = typeof constant;
	return new Struct({
		type: "literal",
		schema: valueType === "string" || valueType === "number" || valueType === "boolean" ? constant : null,
		validator(value) {
			return value === constant || `Expected the literal \`${description}\`, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that no value ever passes validation.
*
* @returns A new struct that will never pass validation.
*/
function never() {
	return define("never", () => false);
}
/**
* Augment an existing struct to allow `null` values.
*
* @param struct - The struct to augment.
* @returns A new struct that will accept `null` values.
*/
function nullable(struct) {
	return new Struct({
		...struct,
		validator: (value, ctx) => value === null || struct.validator(value, ctx),
		refiner: (value, ctx) => value === null || struct.refiner(value, ctx)
	});
}
/**
* Ensure that a value is a number.
*
* @returns A new struct that will only accept numbers.
*/
function number() {
	return define("number", (value) => {
		return typeof value === "number" && !isNaN(value) || `Expected a number, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value is an object, that it has a known set of properties,
* and that its properties are of specific types.
*
* Note: Unrecognized properties will fail validation.
*
* @param schema - An object that defines the structure of the object.
* @returns A new struct that will only accept objects.
*/
function object$1(schema) {
	const knowns = schema ? Object.keys(schema) : [];
	const Never = never();
	return new Struct({
		type: "object",
		schema: schema ?? null,
		*entries(value) {
			if (schema && isObject$1(value)) {
				const unknowns = new Set(Object.keys(value));
				for (const key of knowns) {
					unknowns.delete(key);
					const propertySchema = schema[key];
					if (ExactOptionalStruct.isExactOptional(propertySchema) && !Object.prototype.hasOwnProperty.call(value, key)) continue;
					yield [
						key,
						value[key],
						schema[key]
					];
				}
				for (const key of unknowns) yield [
					key,
					value[key],
					Never
				];
			}
		},
		validator(value) {
			return isObject$1(value) || `Expected an object, but received: ${print(value)}`;
		},
		coercer(value) {
			return isObject$1(value) ? { ...value } : value;
		}
	});
}
/**
* Augment a struct to allow `undefined` values.
*
* @param struct - The struct to augment.
* @returns A new struct that will accept `undefined` values.
*/
function optional(struct) {
	return new Struct({
		...struct,
		validator: (value, ctx) => value === void 0 || struct.validator(value, ctx),
		refiner: (value, ctx) => value === void 0 || struct.refiner(value, ctx)
	});
}
/**
* Ensure that a value is an object with keys and values of specific types, but
* without ensuring any specific shape of properties.
*
* Like TypeScript's `Record` utility.
*/
/**
* Ensure that a value is an object with keys and values of specific types, but
* without ensuring any specific shape of properties.
*
* @param Key - The struct to validate each key in the record against.
* @param Value - The struct to validate each value in the record against.
* @returns A new struct that will only accept objects.
*/
function record(Key, Value) {
	return new Struct({
		type: "record",
		schema: null,
		*entries(value) {
			if (isObject$1(value)) for (const objectKey in value) {
				const objectValue = value[objectKey];
				yield [
					objectKey,
					objectKey,
					Key
				];
				yield [
					objectKey,
					objectValue,
					Value
				];
			}
		},
		validator(value) {
			return isObject$1(value) || `Expected an object, but received: ${print(value)}`;
		}
	});
}
/**
* Ensure that a value is a string.
*
* @returns A new struct that will only accept strings.
*/
function string() {
	return define("string", (value) => {
		return typeof value === "string" || `Expected a string, but received: ${print(value)}`;
	});
}
/**
* Ensure that a value matches one of a set of types.
*
* @param Structs - The set of structs that the value must match.
* @returns A new struct that will only accept values that match one of the
* given structs.
*/
function union(Structs) {
	const description = Structs.map((struct) => struct.type).join(" | ");
	return new Struct({
		type: "union",
		schema: null,
		coercer(value) {
			for (const InnerStruct of Structs) {
				const [error, coerced] = InnerStruct.validate(value, { coerce: true });
				if (!error) return coerced;
			}
			return value;
		},
		validator(value, ctx) {
			const failures = [];
			for (const InnerStruct of Structs) {
				const [ ...tuples] = run(value, InnerStruct, ctx);
				const [first] = tuples;
				if (!first?.[0]) return [];
				for (const [failure] of tuples) if (failure) failures.push(failure);
			}
			return [`Expected the value to satisfy a union of \`${description}\`, but received: ${print(value)}`, ...failures];
		}
	});
}
/**
* Ensure that any value passes validation, without widening its type to `any`.
*
* @returns A struct that will always pass validation.
*/
function unknown() {
	return define("unknown", () => true);
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+superstruct@3.2.1/node_modules/@metamask/superstruct/dist/structs/coercions.mjs
/**
* Augment a `Struct` to add an additional coercion step to its input.
*
* This allows you to transform input data before validating it, to increase the
* likelihood that it passes validation—for example for default values, parsing
* different formats, etc.
*
* Note: You must use `create(value, Struct)` on the value to have the coercion
* take effect! Using simply `assert()` or `is()` will not use coercion.
*
* @param struct - The struct to augment.
* @param condition - A struct that the input must pass to be coerced.
* @param coercer - A function that takes the input and returns the coerced
* value.
* @returns A new struct that will coerce its input before validating it.
*/
function coerce(struct, condition, coercer) {
	return new Struct({
		...struct,
		coercer: (value, ctx) => {
			return is(value, condition) ? struct.coercer(coercer(value, ctx), ctx) : struct.coercer(value, ctx);
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+superstruct@3.2.1/node_modules/@metamask/superstruct/dist/structs/refinements.mjs
/**
* Augment a `Struct` to add an additional refinement to the validation.
*
* The refiner function is guaranteed to receive a value of the struct's type,
* because the struct's existing validation will already have passed. This
* allows you to layer additional validation on top of existing structs.
*
* @param struct - The struct to augment.
* @param name - The name of the refinement.
* @param refiner - The refiner function.
* @returns A new struct that will run the refiner function after the existing
* validation.
*/
function refine(struct, name, refiner) {
	return new Struct({
		...struct,
		*refiner(value, ctx) {
			yield* struct.refiner(value, ctx);
			const failures = toFailures(refiner(value, ctx), ctx, struct, value);
			for (const failure of failures) yield {
				...failure,
				refinement: name
			};
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+utils@11.11.0/node_modules/@metamask/utils/dist/misc.mjs
/**
* A type guard for {@link RuntimeObject}.
*
* @param value - The value to check.
* @returns Whether the specified value has a runtime type of `object` and is
* neither `null` nor an `Array`.
*/
function isObject(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
/**
* A type guard for ensuring an object has a property.
*
* @param objectToCheck - The object to check.
* @param name - The property name to check for.
* @returns Whether the specified object has an own property with the specified
* name, regardless of whether it is enumerable or not.
*/
var hasProperty = (objectToCheck, name) => Object.hasOwnProperty.call(objectToCheck, name);
/**
* Predefined sizes (in Bytes) of specific parts of JSON structure.
*/
var JsonSize;
(function(JsonSize) {
	JsonSize[JsonSize["Null"] = 4] = "Null";
	JsonSize[JsonSize["Comma"] = 1] = "Comma";
	JsonSize[JsonSize["Wrapper"] = 1] = "Wrapper";
	JsonSize[JsonSize["True"] = 4] = "True";
	JsonSize[JsonSize["False"] = 5] = "False";
	JsonSize[JsonSize["Quote"] = 1] = "Quote";
	JsonSize[JsonSize["Colon"] = 1] = "Colon";
	JsonSize[JsonSize["Date"] = 24] = "Date";
})(JsonSize = JsonSize || (JsonSize = {}));
/**
* Check if the value is plain object.
*
* @param value - Value to be checked.
* @returns True if an object is the plain JavaScript object,
* false if the object is not plain (e.g. function).
*/
function isPlainObject(value) {
	if (typeof value !== "object" || value === null) return false;
	try {
		let proto = value;
		while (Object.getPrototypeOf(proto) !== null) proto = Object.getPrototypeOf(proto);
		return Object.getPrototypeOf(value) === proto;
	} catch (_) {
		return false;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+utils@11.11.0/node_modules/@metamask/utils/dist/superstruct.mjs
/**
* Defines a new string-struct matching a regular expression.
*
* @example
* const EthAddressStruct = definePattern('EthAddress', /^0x[0-9a-f]{40}$/iu);
* type EthAddress = Infer<typeof EthAddressStruct>; // string
*
* const CaipChainIdStruct = defineTypedPattern<`${string}:${string}`>(
*   'CaipChainId',
*   /^[-a-z0-9]{3,8}:[-_a-zA-Z0-9]{1,32}$/u;
* );
* type CaipChainId = Infer<typeof CaipChainIdStruct>; // `${string}:${string}`
* @param name - Type name.
* @param pattern - Regular expression to match.
* @template Pattern - The pattern type, defaults to `string`.
* @returns A new string-struct that matches the given pattern.
*/
function definePattern(name, pattern) {
	return define(name, (value) => {
		return typeof value === "string" && pattern.test(value);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+utils@11.11.0/node_modules/@metamask/utils/dist/caip-types.mjs
var CAIP_CHAIN_ID_REGEX = /^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})$/u;
var CAIP_NAMESPACE_REGEX = /^[-a-z0-9]{3,8}$/u;
var CAIP_REFERENCE_REGEX = /^[-_a-zA-Z0-9]{1,32}$/u;
var CAIP_ACCOUNT_ID_REGEX = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32})):(?<accountAddress>[-.%a-zA-Z0-9]{1,128})$/u;
var CAIP_ACCOUNT_ADDRESS_REGEX = /^[-.%a-zA-Z0-9]{1,128}$/u;
var CAIP_ASSET_NAMESPACE_REGEX = /^[-a-z0-9]{3,8}$/u;
var CAIP_ASSET_REFERENCE_REGEX = /^[-.%a-zA-Z0-9]{1,128}$/u;
var CAIP_TOKEN_ID_REGEX = /^[-.%a-zA-Z0-9]{1,78}$/u;
var CAIP_ASSET_TYPE_REGEX = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32}))\/(?<assetNamespace>[-a-z0-9]{3,8}):(?<assetReference>[-.%a-zA-Z0-9]{1,128})$/u;
var CAIP_ASSET_ID_REGEX = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32}))\/(?<assetNamespace>[-a-z0-9]{3,8}):(?<assetReference>[-.%a-zA-Z0-9]{1,128})\/(?<tokenId>[-.%a-zA-Z0-9]{1,78})$/u;
var CAIP_ASSET_TYPE_OR_ID_REGEX = /^(?<chainId>(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-_a-zA-Z0-9]{1,32}))\/(?<assetNamespace>[-a-z0-9]{3,8}):(?<assetReference>[-.%a-zA-Z0-9]{1,128})(\/(?<tokenId>[-.%a-zA-Z0-9]{1,78}))?$/u;
definePattern("CaipChainId", CAIP_CHAIN_ID_REGEX);
definePattern("CaipNamespace", CAIP_NAMESPACE_REGEX);
definePattern("CaipReference", CAIP_REFERENCE_REGEX);
definePattern("CaipAccountId", CAIP_ACCOUNT_ID_REGEX);
definePattern("CaipAccountAddress", CAIP_ACCOUNT_ADDRESS_REGEX);
definePattern("CaipAssetNamespace", CAIP_ASSET_NAMESPACE_REGEX);
definePattern("CaipAssetReference", CAIP_ASSET_REFERENCE_REGEX);
definePattern("CaipTokenId", CAIP_TOKEN_ID_REGEX);
definePattern("CaipAssetType", CAIP_ASSET_TYPE_REGEX);
definePattern("CaipAssetId", CAIP_ASSET_ID_REGEX);
definePattern("CaipAssetTypeOrId", CAIP_ASSET_TYPE_OR_ID_REGEX);
/** Known CAIP namespaces. */
var KnownCaipNamespace;
(function(KnownCaipNamespace) {
	/** BIP-122 (Bitcoin) compatible chains. */
	KnownCaipNamespace["Bip122"] = "bip122";
	/** Solana compatible chains */
	KnownCaipNamespace["Solana"] = "solana";
	/** Stellar compatible chains */
	KnownCaipNamespace["Stellar"] = "stellar";
	/** Tron compatible chains */
	KnownCaipNamespace["Tron"] = "tron";
	/** EIP-155 compatible chains. */
	KnownCaipNamespace["Eip155"] = "eip155";
	KnownCaipNamespace["Wallet"] = "wallet";
})(KnownCaipNamespace = KnownCaipNamespace || (KnownCaipNamespace = {}));
/**
* Parse a CAIP-2 chain ID to an object containing the namespace and reference.
* This validates the CAIP-2 chain ID before parsing it.
*
* @param caipChainId - The CAIP-2 chain ID to validate and parse.
* @returns The parsed CAIP-2 chain ID.
*/
function parseCaipChainId(caipChainId) {
	const match = CAIP_CHAIN_ID_REGEX.exec(caipChainId);
	if (!match?.groups) throw new Error("Invalid CAIP chain ID.");
	return {
		namespace: match.groups.namespace,
		reference: match.groups.reference
	};
}
/**
* Parse an CAIP-10 account ID to an object containing the chain ID, parsed chain ID, and account address.
* This validates the CAIP-10 account ID before parsing it.
*
* @param caipAccountId - The CAIP-10 account ID to validate and parse.
* @returns The parsed CAIP-10 account ID.
*/
function parseCaipAccountId(caipAccountId) {
	const match = CAIP_ACCOUNT_ID_REGEX.exec(caipAccountId);
	if (!match?.groups) throw new Error("Invalid CAIP account ID.");
	return {
		address: match.groups.accountAddress,
		chainId: match.groups.chainId,
		chain: {
			namespace: match.groups.namespace,
			reference: match.groups.reference
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+utils@11.11.0/node_modules/@metamask/utils/dist/json.mjs
/**
* A struct to check if the given value is a valid object, with support for
* {@link exactOptional} types.
*
* @deprecated Use `exactOptional` and `object` from `@metamask/superstruct@>=3.2.0` instead.
* @param schema - The schema of the object.
* @returns A struct to check if the given value is an object.
*/
var object = (schema) => object$1(schema);
/**
* Check the last field of a path is present.
*
* @param context - The context to check.
* @param context.path - The path to check.
* @param context.branch - The branch to check.
* @returns Whether the last field of a path is present.
*/
function hasOptional({ path, branch }) {
	const field = path[path.length - 1];
	return hasProperty(branch[branch.length - 2], field);
}
/**
* A struct which allows the property of an object to be absent, or to be present
* as long as it's valid and not set to `undefined`.
*
* This struct should be used in conjunction with the {@link object} from this
* library, to get proper type inference.
*
* @deprecated Use `exactOptional` and `object` from `@metamask/superstruct@>=3.2.0` instead.
* @param struct - The struct to check the value against, if present.
* @returns A struct to check if the given value is valid, or not present.
* @example
* ```ts
* const struct = object({
*   foo: exactOptional(string()),
*   bar: exactOptional(number()),
*   baz: optional(boolean()),
*   qux: unknown(),
* });
*
* type Type = Infer<typeof struct>;
* // Type is equivalent to:
* // {
* //   foo?: string;
* //   bar?: number;
* //   baz?: boolean | undefined;
* //   qux: unknown;
* // }
* ```
*/
function exactOptional(struct) {
	return new Struct({
		...struct,
		type: `optional ${struct.type}`,
		validator: (value, context) => !hasOptional(context) || struct.validator(value, context),
		refiner: (value, context) => !hasOptional(context) || struct.refiner(value, context)
	});
}
/**
* Validate an unknown input to be valid JSON.
*
* Useful for constructing JSON structs.
*
* @param json - An unknown value.
* @returns True if the value is valid JSON, otherwise false.
*/
function validateJson(json) {
	if (json === null || typeof json === "boolean" || typeof json === "string") return true;
	if (typeof json === "number" && Number.isFinite(json)) return true;
	if (typeof json === "object") {
		let every = true;
		if (Array.isArray(json)) {
			for (let i = 0; i < json.length; i++) if (!validateJson(json[i])) {
				every = false;
				break;
			}
			return every;
		}
		const entries = Object.entries(json);
		for (let i = 0; i < entries.length; i++) if (typeof entries[i][0] !== "string" || !validateJson(entries[i][1])) {
			every = false;
			break;
		}
		return every;
	}
	return false;
}
/**
* A struct to check if the given value is a valid JSON-serializable value.
*
* Note that this struct is unsafe. For safe validation, use {@link JsonStruct}.
*/
var UnsafeJsonStruct = define("JSON", (json) => validateJson(json));
/**
* A struct to check if the given value is a valid JSON-serializable value.
*
* This struct sanitizes the value before validating it, so that it is safe to
* use with untrusted input.
*/
var JsonStruct = coerce(UnsafeJsonStruct, refine(any(), "JSON", (value) => is(value, UnsafeJsonStruct)), (value) => JSON.parse(JSON.stringify(value, (propKey, propValue) => {
	if (propKey === "__proto__" || propKey === "constructor") return;
	return propValue;
})));
/**
* Check if the given value is a valid {@link Json} value, i.e., a value that is
* serializable to JSON.
*
* @param value - The value to check.
* @returns Whether the value is a valid {@link Json} value.
*/
function isValidJson(value) {
	try {
		getSafeJson(value);
		return true;
	} catch {
		return false;
	}
}
/**
* Validate and return sanitized JSON.
*
* Note:
* This function uses sanitized JsonStruct for validation
* that applies stringify and then parse of a value provided
* to ensure that there are no getters which can have side effects
* that can cause security issues.
*
* @param value - JSON structure to be processed.
* @returns Sanitized JSON structure.
*/
function getSafeJson(value) {
	return create(value, JsonStruct);
}
var JsonRpcVersionStruct = literal("2.0");
var JsonRpcIdStruct = nullable(union([number(), string()]));
var JsonRpcErrorStruct = object({
	code: integer(),
	message: string(),
	data: exactOptional(JsonStruct),
	stack: exactOptional(string())
});
var JsonRpcParamsStruct = union([record(string(), JsonStruct), array(JsonStruct)]);
object({
	id: JsonRpcIdStruct,
	jsonrpc: JsonRpcVersionStruct,
	method: string(),
	params: exactOptional(JsonRpcParamsStruct)
});
object({
	jsonrpc: JsonRpcVersionStruct,
	method: string(),
	params: exactOptional(JsonRpcParamsStruct)
});
object$1({
	id: JsonRpcIdStruct,
	jsonrpc: JsonRpcVersionStruct,
	result: optional(unknown()),
	error: optional(JsonRpcErrorStruct)
});
union([object({
	id: JsonRpcIdStruct,
	jsonrpc: JsonRpcVersionStruct,
	result: JsonStruct
}), object({
	id: JsonRpcIdStruct,
	jsonrpc: JsonRpcVersionStruct,
	error: JsonRpcErrorStruct
})]);
//#endregion
//#region ../../node_modules/.pnpm/@metamask+multichain-api-client@0.10.1/node_modules/@metamask/multichain-api-client/dist/helpers/utils.mjs
init_pako_esm();
var MAX$1 = 4294967295;
var idCounter$1 = Math.floor(Math.random() * MAX$1);
/**
* Gets an ID that is guaranteed to be unique so long as no more than
* 4_294_967_295 (uint32 max) IDs are created, or the IDs are rapidly turned
* over.
*
* @returns The unique ID.
*/
var getUniqueId = () => {
	idCounter$1 = (idCounter$1 + 1) % MAX$1;
	return idCounter$1;
};
/**
* Detects if we're in a Chrome-like environment with extension support
*/
var isChromeRuntime = () => {
	return typeof chrome !== "undefined" && chrome.runtime && typeof chrome.runtime.connect === "function";
};
/**
* Retry a function until we get a response
* @param fn - Function to execute
* @param maxRetries - Max number of retries
* @param requestTimeout - Maximum delay before aborting each request attempt
* @param retryDelay - Delay between retries (defaults to requestTimeout) in case of error
* @returns
*/
async function withRetry(fn, options = {}) {
	const { maxRetries = 10, retryDelay = 200, timeoutErrorClass } = options;
	for (let attempt = 0; attempt <= maxRetries; attempt++) try {
		return await fn();
	} catch (error) {
		if (attempt >= maxRetries) throw error;
		if (timeoutErrorClass && typeof timeoutErrorClass === "function" && error instanceof timeoutErrorClass) continue;
		await new Promise((resolve) => setTimeout(resolve, retryDelay));
	}
	throw new Error("Max retries exceeded");
}
/**
* Returns a promise that resolves or rejects like the given promise, but fails if the timeout is exceeded.
* @param promise - The promise to monitor
* @param timeoutMs - Maximum duration in ms. Use -1 to disable timeout.
* @param errorFactory - Optional callback to generate a custom error on timeout
*/
function withTimeout(promise, timeoutMs, errorFactory) {
	if (timeoutMs === -1) return promise;
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			if (errorFactory) reject(errorFactory());
			else reject(/* @__PURE__ */ new Error(`Timeout after ${timeoutMs}ms`));
		}, timeoutMs);
		promise.then((value) => {
			clearTimeout(timer);
			resolve(value);
		}).catch((err) => {
			clearTimeout(timer);
			reject(err);
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+multichain-api-client@0.10.1/node_modules/@metamask/multichain-api-client/dist/types/errors.mjs
var MultichainApiError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = this.constructor.name;
		this.cause = error;
		Object.setPrototypeOf(this, this.constructor.prototype);
	}
};
var TransportError = class extends Error {
	constructor(message, originalError) {
		super(message);
		this.name = this.constructor.name;
		this.cause = originalError;
		Object.setPrototypeOf(this, this.constructor.prototype);
	}
};
var TransportTimeoutError = class extends TransportError {
	constructor(message = "Transport request timed out", originalError) {
		super(message, originalError);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@metamask+multichain-api-client@0.10.1/node_modules/@metamask/multichain-api-client/dist/multichainClient.mjs
/**
* Creates a Multichain API client with the specified transport
*
* @param options - Configuration options for the client
* @param options.transport - The transport layer to use for communication with the wallet
* @param options.requestTimeout - Maximum delay before aborting each request attempt
* @returns A promise that resolves to a MultichainApiClient instance
*
* @example
* ```typescript
* const client = getMultichainClient({
*   transport: getDefaultTransport()
* });
*
* // Create a session with optional scopes
* const session = await client.createSession({
*   optionalScopes: { 'eip155:1': { methods: ['eth_sendTransaction'] } }
* });
*
* // Invoke a method
* const result = await client.invokeMethod({
*   scope: 'eip155:1',
*   request: {
*     method: 'eth_sendTransaction',
*     params: { to: '0x1234...', value: '0x0' }
*   }
* });
* ```
*/
function getMultichainClient({ transport }) {
	let initializationPromise = void 0;
	let connectionPromise = void 0;
	async function ensureConnected() {
		if (transport.isConnected()) return;
		if (!connectionPromise) connectionPromise = transport.connect();
		await connectionPromise;
	}
	async function ensureInitialized() {
		if (initializationPromise) return await initializationPromise;
		initializationPromise = (async () => {
			await ensureConnected();
			await withRetry(() => transport.request({ method: "wallet_getSession" }, { timeout: transport.warmupTimeout ?? 1e3 }));
		})();
		return await initializationPromise;
	}
	ensureConnected();
	return {
		createSession: async (params) => {
			await ensureInitialized();
			return await request({
				transport,
				method: "wallet_createSession",
				params
			});
		},
		getSession: async () => {
			await ensureInitialized();
			return await request({
				transport,
				method: "wallet_getSession"
			});
		},
		revokeSession: async (params) => {
			await ensureInitialized();
			initializationPromise = void 0;
			connectionPromise = void 0;
			await request({
				transport,
				method: "wallet_revokeSession",
				params
			});
			await transport.disconnect();
		},
		invokeMethod: async (params) => {
			await ensureInitialized();
			return await request({
				transport,
				method: "wallet_invokeMethod",
				params
			});
		},
		extendsRpcApi: () => {
			return getMultichainClient({ transport });
		},
		onNotification: (callback) => {
			return transport.onNotification(callback);
		}
	};
}
async function request({ transport, method, params, timeout }) {
	const res = await transport.request({
		method,
		params
	}, { timeout });
	if (res?.error) throw new MultichainApiError(res.error);
	return res.result;
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+multichain-api-client@0.10.1/node_modules/@metamask/multichain-api-client/dist/transports/constants.mjs
var REQUEST_CAIP = "caip-348";
var CONTENT_SCRIPT = "metamask-contentscript";
var MULTICHAIN_SUBSTREAM_NAME = "metamask-multichain-provider";
var METAMASK_PROVIDER_STREAM_NAME = "metamask-provider";
//#endregion
//#region ../../node_modules/.pnpm/@metamask+multichain-api-client@0.10.1/node_modules/@metamask/multichain-api-client/dist/helpers/metamaskExtensionId.mjs
/**
* Get the MetaMask extension ID by sending a metamask_getProviderState to the content script
*/
async function detectMetamaskExtensionId() {
	return new Promise((resolve, reject) => {
		const messageHandler = (event) => {
			if (isProviderMessage(event)) {
				const data = event?.data?.data?.data;
				if (data?.method === "METAMASK_EXTENSION_CONNECT_CAN_RETRY") getProviderState();
				else if (data?.result?.extensionId) {
					const extensionId = data?.result?.extensionId;
					resolve(extensionId);
					window.removeEventListener("message", messageHandler);
					clearTimeout(timeoutId);
				}
			}
		};
		const timeoutId = setTimeout(() => {
			window.removeEventListener("message", messageHandler);
			reject(/* @__PURE__ */ new Error("MetaMask extension not found"));
		}, 1e4);
		window.addEventListener("message", messageHandler);
		getProviderState();
	});
}
function getProviderState() {
	window.postMessage({
		target: CONTENT_SCRIPT,
		data: {
			name: METAMASK_PROVIDER_STREAM_NAME,
			data: { method: "metamask_getProviderState" }
		}
	}, location.origin);
}
function isProviderMessage(event) {
	const { target, data } = event.data;
	return target === "metamask-inpage" && data?.name === "metamask-provider" && event.origin === location.origin;
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+multichain-api-client@0.10.1/node_modules/@metamask/multichain-api-client/dist/transports/externallyConnectableTransport.mjs
/**
* Creates a transport that communicates with the MetaMask extension via Chrome's externally_connectable API
*
* @param params - Configuration parameters for the transport
* @param params.extensionId - Optional MetaMask extension ID. If not provided, it will be auto-detected.
* @returns A Transport instance that communicates with the MetaMask extension
*
* @example
* ```typescript
* // Create transport with auto-detection of extension ID
* const transport = getExternallyConnectableTransport();
*
* // Create transport with specific extension ID
* const transport = getExternallyConnectableTransport({
*   extensionId: '...'
* });
* ```
*/
function getExternallyConnectableTransport(params = {}) {
	let { extensionId } = params;
	const { defaultTimeout = -1, warmupTimeout = 200 } = params;
	let chromePort;
	let requestId = getUniqueId();
	const pendingRequests = /* @__PURE__ */ new Map();
	/**
	* Storing notification callbacks.
	* If we detect a "notification" (a message without an id) coming from the extension or fallback, we'll call each callback in here.
	*/
	const notificationCallbacks = /* @__PURE__ */ new Set();
	/**
	* Handle messages from the extension
	* @param msg
	*/
	function handleMessage(msg) {
		const { data } = msg;
		if (data?.id === null || data?.id === void 0) notifyCallbacks(data);
		else if (pendingRequests.has(data.id)) {
			const resolve = pendingRequests.get(data.id);
			pendingRequests.delete(data.id);
			resolve?.(data);
		}
	}
	/**
	* Fire our local notification callbacks
	*/
	function notifyCallbacks(data) {
		for (const cb of notificationCallbacks) try {
			cb(data);
		} catch (err) {
			console.log("[ChromeTransport] notifyCallbacks error:", err);
		}
	}
	function removeAllNotificationListeners() {
		notificationCallbacks.clear();
	}
	return {
		warmupTimeout,
		connect: async () => {
			try {
				if (!extensionId) extensionId = await detectMetamaskExtensionId();
				const pendingPort = chrome.runtime.connect(extensionId);
				let isActive = true;
				pendingPort.onDisconnect.addListener(() => {
					console.log("[ChromeTransport] chromePort disconnected");
					chromePort = void 0;
					isActive = false;
				});
				await new Promise((resolve) => setTimeout(resolve, 10));
				if (!isActive) throw new Error(`No extension found with id: ${extensionId}`);
				pendingPort.onMessage.addListener(handleMessage);
				chromePort = pendingPort;
			} catch (err) {
				throw new TransportError("Failed to connect to MetaMask", err);
			}
		},
		disconnect: async () => {
			if (chromePort) try {
				chromePort.disconnect();
				chromePort = void 0;
				removeAllNotificationListeners();
				pendingRequests.clear();
			} catch (err) {
				console.log("[ChromeTransport] disconnect error:", err);
			}
		},
		isConnected: () => chromePort !== void 0,
		request: async (params, options = {}) => {
			const { timeout = defaultTimeout } = options;
			const currentChromePort = chromePort;
			if (!currentChromePort) throw new TransportError("Chrome port not connected");
			const id = requestId++;
			const requestPayload = {
				id,
				jsonrpc: "2.0",
				...params
			};
			try {
				return await withTimeout(new Promise((resolve) => {
					pendingRequests.set(id, resolve);
					currentChromePort.postMessage({
						type: REQUEST_CAIP,
						data: requestPayload
					});
				}), timeout, () => new TransportTimeoutError());
			} catch (err) {
				if (pendingRequests.has(id)) pendingRequests.delete(id);
				throw err;
			}
		},
		onNotification: (callback) => {
			notificationCallbacks.add(callback);
			return () => {
				notificationCallbacks.delete(callback);
			};
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+multichain-api-client@0.10.1/node_modules/@metamask/multichain-api-client/dist/transports/windowPostMessageTransport.mjs
/**
* Creates a transport that communicates with the MetaMask extension via window.postMessage
* This is primarily used for Firefox where the externally_connectable API is not available
*
* @returns A Transport instance that communicates with the MetaMask extension
*
* @example
* ```typescript
* const transport = getWindowPostMessageTransport();
* await transport.connect();
* const result = await transport.request({ method: 'eth_getBalance', params: ['0x123', 'latest'] });
* ```
*/
function getWindowPostMessageTransport(params = {}) {
	const { defaultTimeout = -1, warmupTimeout = 200 } = params;
	let messageListener = null;
	const pendingRequests = /* @__PURE__ */ new Map();
	/**
	* Storing notification callbacks.
	* If we detect a "notification" (a message without an id) coming from the extension, we'll call each callback in here.
	*/
	const notificationCallbacks = /* @__PURE__ */ new Set();
	/**
	* Fire our local notification callbacks
	*/
	function notifyCallbacks(data) {
		for (const cb of notificationCallbacks) try {
			cb(data);
		} catch (err) {
			console.log("[WindowPostMessageTransport] notifyCallbacks error:", err);
		}
	}
	function handleMessage(message) {
		if (message?.id === null || message?.id === void 0) notifyCallbacks(message);
		else if (pendingRequests.has(message.id)) {
			const resolve = pendingRequests.get(message.id);
			pendingRequests.delete(message.id);
			resolve?.(message);
		}
	}
	function sendRequest(request) {
		window.postMessage({
			target: CONTENT_SCRIPT,
			data: {
				name: MULTICHAIN_SUBSTREAM_NAME,
				data: request
			}
		}, location.origin);
	}
	async function disconnect() {
		if (messageListener) {
			window.removeEventListener("message", messageListener);
			messageListener = null;
		}
		pendingRequests.clear();
		notificationCallbacks.clear();
	}
	const isConnected = () => Boolean(messageListener);
	return {
		warmupTimeout,
		connect: async () => {
			if (isConnected()) await disconnect();
			messageListener = (event) => {
				const { target, data } = event.data;
				if (target !== "metamask-inpage" || data?.name !== "metamask-multichain-provider" || event.origin !== location.origin) return;
				handleMessage(data.data);
			};
			window.addEventListener("message", messageListener);
		},
		disconnect,
		isConnected,
		request: (params, options = {}) => {
			const { timeout = defaultTimeout } = options;
			if (!isConnected()) throw new TransportError("Transport not connected");
			const id = getUniqueId();
			const request = {
				jsonrpc: "2.0",
				id,
				...params
			};
			return withTimeout(new Promise((resolve) => {
				pendingRequests.set(id, (value) => resolve(value));
				sendRequest(request);
			}), timeout, () => new TransportTimeoutError()).catch((err) => {
				if (pendingRequests.has(id)) pendingRequests.delete(id);
				throw err;
			});
		},
		onNotification: (callback) => {
			notificationCallbacks.add(callback);
			return () => {
				notificationCallbacks.delete(callback);
			};
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+multichain-api-client@0.10.1/node_modules/@metamask/multichain-api-client/dist/index.mjs
/**
* Gets the default transport for the current environment (Chrome, Firefox, etc.)
*
* @param params - Configuration parameters for the transport
* @param params.extensionId - Optional MetaMask extension ID for Chrome. If not provided, it will be auto-detected.
* @returns A Transport instance suitable for the current environment
*
* @example
* ```typescript
* // Get default transport with auto-detection of extension ID
* const transport = getDefaultTransport();
*
* // Get default transport with specific extension ID
* const transport = getDefaultTransport({ extensionId: '...' });
* ```
*/
function getDefaultTransport({ extensionId, defaultTimeout, warmupTimeout } = {}) {
	return isChromeRuntime() ? getExternallyConnectableTransport({
		extensionId,
		defaultTimeout,
		warmupTimeout
	}) : getWindowPostMessageTransport({
		defaultTimeout,
		warmupTimeout
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+rpc-errors@7.0.3/node_modules/@metamask/rpc-errors/dist/error-constants.mjs
var import_fast_safe_stringify = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = stringify;
	stringify.default = stringify;
	stringify.stable = deterministicStringify;
	stringify.stableStringify = deterministicStringify;
	var LIMIT_REPLACE_NODE = "[...]";
	var CIRCULAR_REPLACE_NODE = "[Circular]";
	var arr = [];
	var replacerStack = [];
	function defaultOptions() {
		return {
			depthLimit: Number.MAX_SAFE_INTEGER,
			edgesLimit: Number.MAX_SAFE_INTEGER
		};
	}
	function stringify(obj, replacer, spacer, options) {
		if (typeof options === "undefined") options = defaultOptions();
		decirc(obj, "", 0, [], void 0, 0, options);
		var res;
		try {
			if (replacerStack.length === 0) res = JSON.stringify(obj, replacer, spacer);
			else res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
		} catch (_) {
			return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
		} finally {
			while (arr.length !== 0) {
				var part = arr.pop();
				if (part.length === 4) Object.defineProperty(part[0], part[1], part[3]);
				else part[0][part[1]] = part[2];
			}
		}
		return res;
	}
	function setReplace(replace, val, k, parent) {
		var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
		if (propertyDescriptor.get !== void 0) if (propertyDescriptor.configurable) {
			Object.defineProperty(parent, k, { value: replace });
			arr.push([
				parent,
				k,
				val,
				propertyDescriptor
			]);
		} else replacerStack.push([
			val,
			k,
			replace
		]);
		else {
			parent[k] = replace;
			arr.push([
				parent,
				k,
				val
			]);
		}
	}
	function decirc(val, k, edgeIndex, stack, parent, depth, options) {
		depth += 1;
		var i;
		if (typeof val === "object" && val !== null) {
			for (i = 0; i < stack.length; i++) if (stack[i] === val) {
				setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
				return;
			}
			if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
				setReplace(LIMIT_REPLACE_NODE, val, k, parent);
				return;
			}
			if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
				setReplace(LIMIT_REPLACE_NODE, val, k, parent);
				return;
			}
			stack.push(val);
			if (Array.isArray(val)) for (i = 0; i < val.length; i++) decirc(val[i], i, i, stack, val, depth, options);
			else {
				var keys = Object.keys(val);
				for (i = 0; i < keys.length; i++) {
					var key = keys[i];
					decirc(val[key], key, i, stack, val, depth, options);
				}
			}
			stack.pop();
		}
	}
	function compareFunction(a, b) {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	}
	function deterministicStringify(obj, replacer, spacer, options) {
		if (typeof options === "undefined") options = defaultOptions();
		var tmp = deterministicDecirc(obj, "", 0, [], void 0, 0, options) || obj;
		var res;
		try {
			if (replacerStack.length === 0) res = JSON.stringify(tmp, replacer, spacer);
			else res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
		} catch (_) {
			return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
		} finally {
			while (arr.length !== 0) {
				var part = arr.pop();
				if (part.length === 4) Object.defineProperty(part[0], part[1], part[3]);
				else part[0][part[1]] = part[2];
			}
		}
		return res;
	}
	function deterministicDecirc(val, k, edgeIndex, stack, parent, depth, options) {
		depth += 1;
		var i;
		if (typeof val === "object" && val !== null) {
			for (i = 0; i < stack.length; i++) if (stack[i] === val) {
				setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
				return;
			}
			try {
				if (typeof val.toJSON === "function") return;
			} catch (_) {
				return;
			}
			if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
				setReplace(LIMIT_REPLACE_NODE, val, k, parent);
				return;
			}
			if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
				setReplace(LIMIT_REPLACE_NODE, val, k, parent);
				return;
			}
			stack.push(val);
			if (Array.isArray(val)) for (i = 0; i < val.length; i++) deterministicDecirc(val[i], i, i, stack, val, depth, options);
			else {
				var tmp = {};
				var keys = Object.keys(val).sort(compareFunction);
				for (i = 0; i < keys.length; i++) {
					var key = keys[i];
					deterministicDecirc(val[key], key, i, stack, val, depth, options);
					tmp[key] = val[key];
				}
				if (typeof parent !== "undefined") {
					arr.push([
						parent,
						k,
						val
					]);
					parent[k] = tmp;
				} else return tmp;
			}
			stack.pop();
		}
	}
	function replaceGetterValues(replacer) {
		replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
			return v;
		};
		return function(key, val) {
			if (replacerStack.length > 0) for (var i = 0; i < replacerStack.length; i++) {
				var part = replacerStack[i];
				if (part[1] === key && part[0] === val) {
					val = part[2];
					replacerStack.splice(i, 1);
					break;
				}
			}
			return replacer.call(this, key, val);
		};
	}
})))(), 1);
var errorCodes = {
	rpc: {
		invalidInput: -32e3,
		resourceNotFound: -32001,
		resourceUnavailable: -32002,
		transactionRejected: -32003,
		methodNotSupported: -32004,
		limitExceeded: -32005,
		parse: -32700,
		invalidRequest: -32600,
		methodNotFound: -32601,
		invalidParams: -32602,
		internal: -32603
	},
	provider: {
		userRejectedRequest: 4001,
		unauthorized: 4100,
		unsupportedMethod: 4200,
		disconnected: 4900,
		chainDisconnected: 4901
	}
};
var errorValues = {
	"-32700": {
		standard: "JSON RPC 2.0",
		message: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
	},
	"-32600": {
		standard: "JSON RPC 2.0",
		message: "The JSON sent is not a valid Request object."
	},
	"-32601": {
		standard: "JSON RPC 2.0",
		message: "The method does not exist / is not available."
	},
	"-32602": {
		standard: "JSON RPC 2.0",
		message: "Invalid method parameter(s)."
	},
	"-32603": {
		standard: "JSON RPC 2.0",
		message: "Internal JSON-RPC error."
	},
	"-32000": {
		standard: "EIP-1474",
		message: "Invalid input."
	},
	"-32001": {
		standard: "EIP-1474",
		message: "Resource not found."
	},
	"-32002": {
		standard: "EIP-1474",
		message: "Resource unavailable."
	},
	"-32003": {
		standard: "EIP-1474",
		message: "Transaction rejected."
	},
	"-32004": {
		standard: "EIP-1474",
		message: "Method not supported."
	},
	"-32005": {
		standard: "EIP-1474",
		message: "Request limit exceeded."
	},
	"4001": {
		standard: "EIP-1193",
		message: "User rejected the request."
	},
	"4100": {
		standard: "EIP-1193",
		message: "The requested account and/or method has not been authorized by the user."
	},
	"4200": {
		standard: "EIP-1193",
		message: "The requested method is not supported by this Ethereum provider."
	},
	"4900": {
		standard: "EIP-1193",
		message: "The provider is disconnected from all chains."
	},
	"4901": {
		standard: "EIP-1193",
		message: "The provider is disconnected from the specified chain."
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@metamask+rpc-errors@7.0.3/node_modules/@metamask/rpc-errors/dist/utils.mjs
var FALLBACK_ERROR_CODE = errorCodes.rpc.internal;
var FALLBACK_MESSAGE = "Unspecified error message. This is a bug, please report it.";
getMessageFromCode(FALLBACK_ERROR_CODE);
var JSON_RPC_SERVER_ERROR_MESSAGE = "Unspecified server error.";
/**
* Gets the message for a given code, or a fallback message if the code has
* no corresponding message.
*
* @param code - The error code.
* @param fallbackMessage - The fallback message to use if the code has no
* corresponding message.
* @returns The message for the given code, or the fallback message if the code
* has no corresponding message.
*/
function getMessageFromCode(code, fallbackMessage = FALLBACK_MESSAGE) {
	if (isValidCode(code)) {
		const codeString = code.toString();
		if (hasProperty(errorValues, codeString)) return errorValues[codeString].message;
		if (isJsonRpcServerError(code)) return JSON_RPC_SERVER_ERROR_MESSAGE;
	}
	return fallbackMessage;
}
/**
* Returns whether the given code is valid.
* A code is valid if it is an integer.
*
* @param code - The error code.
* @returns Whether the given code is valid.
*/
function isValidCode(code) {
	return Number.isInteger(code);
}
/**
* Check if the given code is a valid JSON-RPC server error code.
*
* @param code - The error code.
* @returns Whether the given code is a valid JSON-RPC server error code.
*/
function isJsonRpcServerError(code) {
	return code >= -32099 && code <= -32e3;
}
/**
* Serializes an unknown error to be used as the `cause` in a fallback error.
*
* @param error - The unknown error.
* @returns A JSON-serializable object containing as much information about the original error as possible.
*/
function serializeCause(error) {
	if (Array.isArray(error)) return error.map((entry) => {
		if (isValidJson(entry)) return entry;
		else if (isObject(entry)) return serializeObject(entry);
		return null;
	});
	else if (isObject(error)) return serializeObject(error);
	if (isValidJson(error)) return error;
	return null;
}
/**
* Extracts all JSON-serializable properties from an object.
*
* @param object - The object in question.
* @returns An object containing all the JSON-serializable properties.
*/
function serializeObject(object) {
	return Object.getOwnPropertyNames(object).reduce((acc, key) => {
		const value = object[key];
		if (isValidJson(value)) acc[key] = value;
		return acc;
	}, {});
}
/**
* Returns true if supplied error data has a usable `cause` property; false otherwise.
*
* @param data - Optional data to validate.
* @returns Whether cause property is present and an object.
*/
function dataHasCause(data) {
	return isObject(data) && hasProperty(data, "cause") && isObject(data.cause);
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+rpc-errors@7.0.3/node_modules/@metamask/rpc-errors/dist/classes.mjs
function $importDefault(module) {
	if (module?.__esModule) return module.default;
	return module;
}
var safeStringify = $importDefault(import_fast_safe_stringify.default);
/**
* Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors
* per EIP-1474.
*
* Permits any integer error code.
*/
var JsonRpcError = class extends Error {
	constructor(code, message, data) {
		if (!Number.isInteger(code)) throw new Error("\"code\" must be an integer.");
		if (!message || typeof message !== "string") throw new Error("\"message\" must be a non-empty string.");
		if (dataHasCause(data)) {
			super(message, { cause: data.cause });
			if (!hasProperty(this, "cause")) Object.assign(this, { cause: data.cause });
		} else super(message);
		if (data !== void 0) this.data = data;
		this.code = code;
	}
	/**
	* Get the error as JSON-serializable object.
	*
	* @returns A plain object with all public class properties.
	*/
	serialize() {
		const serialized = {
			code: this.code,
			message: this.message
		};
		if (this.data !== void 0) {
			serialized.data = this.data;
			if (isPlainObject(this.data)) serialized.data.cause = serializeCause(this.data.cause);
		}
		if (this.stack) serialized.stack = this.stack;
		return serialized;
	}
	/**
	* Get a string representation of the serialized error, omitting any circular
	* references.
	*
	* @returns A string representation of the serialized error.
	*/
	toString() {
		return safeStringify(this.serialize(), stringifyReplacer, 2);
	}
};
/**
* Error subclass implementing Ethereum Provider errors per EIP-1193.
* Permits integer error codes in the [ 1000 <= 4999 ] range.
*/
var EthereumProviderError = class extends JsonRpcError {
	/**
	* Create an Ethereum Provider JSON-RPC error.
	*
	* @param code - The JSON-RPC error code. Must be an integer in the
	* `1000 <= n <= 4999` range.
	* @param message - The JSON-RPC error message.
	* @param data - Optional data to include in the error.
	*/
	constructor(code, message, data) {
		if (!isValidEthProviderCode(code)) throw new Error("\"code\" must be an integer such that: 1000 <= code <= 4999");
		super(code, message, data);
	}
};
/**
* Check if the given code is a valid JSON-RPC error code.
*
* @param code - The code to check.
* @returns Whether the code is valid.
*/
function isValidEthProviderCode(code) {
	return Number.isInteger(code) && code >= 1e3 && code <= 4999;
}
/**
* A JSON replacer function that omits circular references.
*
* @param _ - The key being replaced.
* @param value - The value being replaced.
* @returns The value to use in place of the original value.
*/
function stringifyReplacer(_, value) {
	if (value === "[Circular]") return;
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+rpc-errors@7.0.3/node_modules/@metamask/rpc-errors/dist/errors.mjs
var rpcErrors = {
	/**
	* Get a JSON RPC 2.0 Parse (-32700) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	parse: (arg) => getJsonRpcError(errorCodes.rpc.parse, arg),
	/**
	* Get a JSON RPC 2.0 Invalid Request (-32600) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	invalidRequest: (arg) => getJsonRpcError(errorCodes.rpc.invalidRequest, arg),
	/**
	* Get a JSON RPC 2.0 Invalid Params (-32602) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	invalidParams: (arg) => getJsonRpcError(errorCodes.rpc.invalidParams, arg),
	/**
	* Get a JSON RPC 2.0 Method Not Found (-32601) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	methodNotFound: (arg) => getJsonRpcError(errorCodes.rpc.methodNotFound, arg),
	/**
	* Get a JSON RPC 2.0 Internal (-32603) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	internal: (arg) => getJsonRpcError(errorCodes.rpc.internal, arg),
	/**
	* Get a JSON RPC 2.0 Server error.
	* Permits integer error codes in the [ -32099 <= -32005 ] range.
	* Codes -32000 through -32004 are reserved by EIP-1474.
	*
	* @param opts - The error options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	server: (opts) => {
		if (!opts || typeof opts !== "object" || Array.isArray(opts)) throw new Error("Ethereum RPC Server errors must provide single object argument.");
		const { code } = opts;
		if (!Number.isInteger(code) || code > -32005 || code < -32099) throw new Error("\"code\" must be an integer such that: -32099 <= code <= -32005");
		return getJsonRpcError(code, opts);
	},
	/**
	* Get an Ethereum JSON RPC Invalid Input (-32000) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	invalidInput: (arg) => getJsonRpcError(errorCodes.rpc.invalidInput, arg),
	/**
	* Get an Ethereum JSON RPC Resource Not Found (-32001) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	resourceNotFound: (arg) => getJsonRpcError(errorCodes.rpc.resourceNotFound, arg),
	/**
	* Get an Ethereum JSON RPC Resource Unavailable (-32002) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	resourceUnavailable: (arg) => getJsonRpcError(errorCodes.rpc.resourceUnavailable, arg),
	/**
	* Get an Ethereum JSON RPC Transaction Rejected (-32003) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	transactionRejected: (arg) => getJsonRpcError(errorCodes.rpc.transactionRejected, arg),
	/**
	* Get an Ethereum JSON RPC Method Not Supported (-32004) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	methodNotSupported: (arg) => getJsonRpcError(errorCodes.rpc.methodNotSupported, arg),
	/**
	* Get an Ethereum JSON RPC Limit Exceeded (-32005) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link JsonRpcError} class.
	*/
	limitExceeded: (arg) => getJsonRpcError(errorCodes.rpc.limitExceeded, arg)
};
var providerErrors = {
	/**
	* Get an Ethereum Provider User Rejected Request (4001) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link EthereumProviderError} class.
	*/
	userRejectedRequest: (arg) => {
		return getEthProviderError(errorCodes.provider.userRejectedRequest, arg);
	},
	/**
	* Get an Ethereum Provider Unauthorized (4100) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link EthereumProviderError} class.
	*/
	unauthorized: (arg) => {
		return getEthProviderError(errorCodes.provider.unauthorized, arg);
	},
	/**
	* Get an Ethereum Provider Unsupported Method (4200) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link EthereumProviderError} class.
	*/
	unsupportedMethod: (arg) => {
		return getEthProviderError(errorCodes.provider.unsupportedMethod, arg);
	},
	/**
	* Get an Ethereum Provider Not Connected (4900) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link EthereumProviderError} class.
	*/
	disconnected: (arg) => {
		return getEthProviderError(errorCodes.provider.disconnected, arg);
	},
	/**
	* Get an Ethereum Provider Chain Not Connected (4901) error.
	*
	* @param arg - The error message or options bag.
	* @returns An instance of the {@link EthereumProviderError} class.
	*/
	chainDisconnected: (arg) => {
		return getEthProviderError(errorCodes.provider.chainDisconnected, arg);
	},
	/**
	* Get a custom Ethereum Provider error.
	*
	* @param opts - The error options bag.
	* @returns An instance of the {@link EthereumProviderError} class.
	*/
	custom: (opts) => {
		if (!opts || typeof opts !== "object" || Array.isArray(opts)) throw new Error("Ethereum Provider custom errors must provide single object argument.");
		const { code, message, data } = opts;
		if (!message || typeof message !== "string") throw new Error("\"message\" must be a nonempty string");
		return new EthereumProviderError(code, message, data);
	}
};
/**
* Get a generic JSON-RPC error class instance.
*
* @param code - The error code.
* @param arg - The error message or options bag.
* @returns An instance of the {@link JsonRpcError} class.
*/
function getJsonRpcError(code, arg) {
	const [message, data] = parseOpts(arg);
	return new JsonRpcError(code, message ?? getMessageFromCode(code), data);
}
/**
* Get an Ethereum Provider error class instance.
*
* @param code - The error code.
* @param arg - The error message or options bag.
* @returns An instance of the {@link EthereumProviderError} class.
*/
function getEthProviderError(code, arg) {
	const [message, data] = parseOpts(arg);
	return new EthereumProviderError(code, message ?? getMessageFromCode(code), data);
}
/**
* Get an error message and optional data from an options bag.
*
* @param arg - The error message or options bag.
* @returns A tuple containing the error message and optional data.
*/
function parseOpts(arg) {
	if (arg) {
		if (typeof arg === "string") return [arg];
		else if (typeof arg === "object" && !Array.isArray(arg)) {
			const { message, data } = arg;
			if (message && typeof message !== "string") throw new Error("Must specify string message.");
			return [message ?? void 0, data];
		}
	}
	return [];
}
//#endregion
//#region ../../node_modules/.pnpm/@paulmillr+qr@0.2.1/node_modules/@paulmillr/qr/index.js
/*!
Copyright (c) 2023 Paul Miller (paulmillr.com)
The library @paulmillr/qr is dual-licensed under the Apache 2.0 OR MIT license.
You can select a license of your choice.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
function assertNumber(n) {
	if (!Number.isSafeInteger(n)) throw new Error(`Wrong integer: ${n}`);
}
function validateVersion(ver) {
	if (!Number.isSafeInteger(ver) || ver < 1 || ver > 40) throw new Error(`Invalid version=${ver}. Expected number [1..40]`);
}
function bin(dec, pad) {
	return dec.toString(2).padStart(pad, "0");
}
function mod(a, b) {
	const result = a % b;
	return result >= 0 ? result : b + result;
}
function fillArr(length, val) {
	return new Array(length).fill(val);
}
/**
* Interleaves byte blocks.
* @param blocks [[1, 2, 3], [4, 5, 6]]
* @returns [1, 4, 2, 5, 3, 6]
*/
function interleaveBytes(...blocks) {
	let len = 0;
	for (const b of blocks) len = Math.max(len, b.length);
	const res = [];
	for (let i = 0; i < len; i++) for (const b of blocks) {
		if (i >= b.length) continue;
		res.push(b[i]);
	}
	return new Uint8Array(res);
}
function includesAt(lst, pattern, index) {
	if (index < 0 || index + pattern.length > lst.length) return false;
	for (let i = 0; i < pattern.length; i++) if (pattern[i] !== lst[index + i]) return false;
	return true;
}
function best() {
	let best;
	let bestScore = Infinity;
	return {
		add(score, value) {
			if (score >= bestScore) return;
			best = value;
			bestScore = score;
		},
		get: () => best,
		score: () => bestScore
	};
}
function alphabet(alphabet) {
	return {
		has: (char) => alphabet.includes(char),
		decode: (input) => {
			if (!Array.isArray(input) || input.length && typeof input[0] !== "string") throw new Error("alphabet.decode input should be array of strings");
			return input.map((letter) => {
				if (typeof letter !== "string") throw new Error(`alphabet.decode: not string element=${letter}`);
				const index = alphabet.indexOf(letter);
				if (index === -1) throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
				return index;
			});
		},
		encode: (digits) => {
			if (!Array.isArray(digits) || digits.length && typeof digits[0] !== "number") throw new Error("alphabet.encode input should be an array of numbers");
			return digits.map((i) => {
				assertNumber(i);
				if (i < 0 || i >= alphabet.length) throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
				return alphabet[i];
			});
		}
	};
}
var Bitmap = class Bitmap {
	static size(size, limit) {
		if (typeof size === "number") size = {
			height: size,
			width: size
		};
		if (!Number.isSafeInteger(size.height) && size.height !== Infinity) throw new Error(`Bitmap: wrong height=${size.height} (${typeof size.height})`);
		if (!Number.isSafeInteger(size.width) && size.width !== Infinity) throw new Error(`Bitmap: wrong width=${size.width} (${typeof size.width})`);
		if (limit !== void 0) size = {
			width: Math.min(size.width, limit.width),
			height: Math.min(size.height, limit.height)
		};
		return size;
	}
	static fromString(s) {
		s = s.replace(/^\n+/g, "").replace(/\n+$/g, "");
		const lines = s.split("\n");
		const height = lines.length;
		const data = new Array(height);
		let width;
		for (const line of lines) {
			const row = line.split("").map((i) => {
				if (i === "X") return true;
				if (i === " ") return false;
				if (i === "?") return void 0;
				throw new Error(`Bitmap.fromString: unknown symbol=${i}`);
			});
			if (width && row.length !== width) throw new Error(`Bitmap.fromString different row sizes: width=${width} cur=${row.length}`);
			width = row.length;
			data.push(row);
		}
		if (!width) width = 0;
		return new Bitmap({
			height,
			width
		}, data);
	}
	constructor(size, data) {
		const { height, width } = Bitmap.size(size);
		this.data = data || Array.from({ length: height }, () => fillArr(width, void 0));
		this.height = height;
		this.width = width;
	}
	point(p) {
		return this.data[p.y][p.x];
	}
	isInside(p) {
		return 0 <= p.x && p.x < this.width && 0 <= p.y && p.y < this.height;
	}
	size(offset) {
		if (!offset) return {
			height: this.height,
			width: this.width
		};
		const { x, y } = this.xy(offset);
		return {
			height: this.height - y,
			width: this.width - x
		};
	}
	xy(c) {
		if (typeof c === "number") c = {
			x: c,
			y: c
		};
		if (!Number.isSafeInteger(c.x)) throw new Error(`Bitmap: wrong x=${c.x}`);
		if (!Number.isSafeInteger(c.y)) throw new Error(`Bitmap: wrong y=${c.y}`);
		c.x = mod(c.x, this.width);
		c.y = mod(c.y, this.height);
		return c;
	}
	rect(c, size, value) {
		const { x, y } = this.xy(c);
		const { height, width } = Bitmap.size(size, this.size({
			x,
			y
		}));
		for (let yPos = 0; yPos < height; yPos++) for (let xPos = 0; xPos < width; xPos++) this.data[y + yPos][x + xPos] = typeof value === "function" ? value({
			x: xPos,
			y: yPos
		}, this.data[y + yPos][x + xPos]) : value;
		return this;
	}
	rectRead(c, size, fn) {
		return this.rect(c, size, (c, cur) => {
			fn(c, cur);
			return cur;
		});
	}
	hLine(c, len, value) {
		return this.rect(c, {
			width: len,
			height: 1
		}, value);
	}
	vLine(c, len, value) {
		return this.rect(c, {
			width: 1,
			height: len
		}, value);
	}
	border(border = 2, value) {
		const height = this.height + 2 * border;
		const width = this.width + 2 * border;
		const v = fillArr(border, value);
		const h = Array.from({ length: border }, () => fillArr(width, value));
		return new Bitmap({
			height,
			width
		}, [
			...h,
			...this.data.map((i) => [
				...v,
				...i,
				...v
			]),
			...h
		]);
	}
	embed(c, bm) {
		return this.rect(c, bm.size(), ({ x, y }) => bm.data[y][x]);
	}
	rectSlice(c, size = this.size()) {
		const rect = new Bitmap(Bitmap.size(size, this.size(this.xy(c))));
		this.rect(c, size, ({ x, y }, cur) => rect.data[y][x] = cur);
		return rect;
	}
	inverse() {
		const { height, width } = this;
		return new Bitmap({
			height: width,
			width: height
		}).rect({
			x: 0,
			y: 0
		}, Infinity, ({ x, y }) => this.data[x][y]);
	}
	scale(factor) {
		if (!Number.isSafeInteger(factor) || factor > 1024) throw new Error(`Wrong scale factor: ${factor}`);
		const { height, width } = this;
		return new Bitmap({
			height: factor * height,
			width: factor * width
		}).rect({
			x: 0,
			y: 0
		}, Infinity, ({ x, y }) => this.data[Math.floor(y / factor)][Math.floor(x / factor)]);
	}
	clone() {
		return new Bitmap(this.size()).rect({
			x: 0,
			y: 0
		}, this.size(), ({ x, y }) => this.data[y][x]);
	}
	assertDrawn() {
		this.rectRead(0, Infinity, (_, cur) => {
			if (typeof cur !== "boolean") throw new Error(`Invalid color type=${typeof cur}`);
		});
	}
	toString() {
		return this.data.map((i) => i.map((j) => j === void 0 ? "?" : j ? "X" : " ").join("")).join("\n");
	}
	toASCII() {
		const { height, width, data } = this;
		let out = "";
		for (let y = 0; y < height; y += 2) {
			for (let x = 0; x < width; x++) {
				const first = data[y][x];
				const second = y + 1 >= height ? true : data[y + 1][x];
				if (!first && !second) out += "█";
				else if (!first && second) out += "▀";
				else if (first && !second) out += "▄";
				else if (first && second) out += " ";
			}
			out += "\n";
		}
		return out;
	}
	toTerm() {
		const reset = "\x1B[0m";
		const whiteBG = `\x1b[1;47m  ${reset}`;
		const darkBG = `\x1b[40m  ${reset}`;
		return this.data.map((i) => i.map((j) => j ? darkBG : whiteBG).join("")).join("\n");
	}
	toSVG() {
		let out = `<svg xmlns:svg="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" version="1.1" xmlns="http://www.w3.org/2000/svg">`;
		this.rectRead(0, Infinity, ({ x, y }, val) => {
			if (val) out += `<rect x="${x}" y="${y}" width="1" height="1" />`;
		});
		out += "</svg>";
		return out;
	}
	toGIF() {
		const u16le = (i) => [i & 255, i >>> 8 & 255];
		const dims = [...u16le(this.width), ...u16le(this.height)];
		const data = [];
		this.rectRead(0, Infinity, (_, cur) => data.push(+(cur === true)));
		const N = 126;
		const bytes = [
			71,
			73,
			70,
			56,
			55,
			97,
			...dims,
			246,
			0,
			0,
			255,
			255,
			255,
			...fillArr(381, 0),
			44,
			0,
			0,
			0,
			0,
			...dims,
			0,
			7
		];
		const fullChunks = Math.floor(data.length / N);
		for (let i = 0; i < fullChunks; i++) bytes.push(127, 128, ...data.slice(N * i, N * (i + 1)).map((i) => +i));
		bytes.push(data.length % N + 1, 128, ...data.slice(fullChunks * N).map((i) => +i));
		bytes.push(1, 129, 0, 59);
		return new Uint8Array(bytes);
	}
	toImage(isRGB = false) {
		const { height, width } = this.size();
		const data = new Uint8Array(height * width * (isRGB ? 3 : 4));
		let i = 0;
		for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
			const value = !!this.data[y][x] ? 0 : 255;
			data[i++] = value;
			data[i++] = value;
			data[i++] = value;
			if (!isRGB) data[i++] = 255;
		}
		return {
			height,
			width,
			data
		};
	}
};
var ECMode = [
	"low",
	"medium",
	"quartile",
	"high"
];
var Encoding = [
	"numeric",
	"alphanumeric",
	"byte",
	"kanji",
	"eci"
];
var BYTES = [
	26,
	44,
	70,
	100,
	134,
	172,
	196,
	242,
	292,
	346,
	404,
	466,
	532,
	581,
	655,
	733,
	815,
	901,
	991,
	1085,
	1156,
	1258,
	1364,
	1474,
	1588,
	1706,
	1828,
	1921,
	2051,
	2185,
	2323,
	2465,
	2611,
	2761,
	2876,
	3034,
	3196,
	3362,
	3532,
	3706
];
var WORDS_PER_BLOCK = {
	low: [
		7,
		10,
		15,
		20,
		26,
		18,
		20,
		24,
		30,
		18,
		20,
		24,
		26,
		30,
		22,
		24,
		28,
		30,
		28,
		28,
		28,
		28,
		30,
		30,
		26,
		28,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30
	],
	medium: [
		10,
		16,
		26,
		18,
		24,
		16,
		18,
		22,
		22,
		26,
		30,
		22,
		22,
		24,
		24,
		28,
		28,
		26,
		26,
		26,
		26,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28
	],
	quartile: [
		13,
		22,
		18,
		26,
		18,
		24,
		18,
		22,
		20,
		24,
		28,
		26,
		24,
		20,
		30,
		24,
		28,
		28,
		26,
		30,
		28,
		30,
		30,
		30,
		30,
		28,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30
	],
	high: [
		17,
		28,
		22,
		16,
		22,
		28,
		26,
		26,
		24,
		28,
		24,
		28,
		22,
		24,
		24,
		30,
		28,
		28,
		26,
		28,
		30,
		24,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30
	]
};
var ECC_BLOCKS = {
	low: [
		1,
		1,
		1,
		1,
		1,
		2,
		2,
		2,
		2,
		4,
		4,
		4,
		4,
		4,
		6,
		6,
		6,
		6,
		7,
		8,
		8,
		9,
		9,
		10,
		12,
		12,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		19,
		20,
		21,
		22,
		24,
		25
	],
	medium: [
		1,
		1,
		1,
		2,
		2,
		4,
		4,
		4,
		5,
		5,
		5,
		8,
		9,
		9,
		10,
		10,
		11,
		13,
		14,
		16,
		17,
		17,
		18,
		20,
		21,
		23,
		25,
		26,
		28,
		29,
		31,
		33,
		35,
		37,
		38,
		40,
		43,
		45,
		47,
		49
	],
	quartile: [
		1,
		1,
		2,
		2,
		4,
		4,
		6,
		6,
		8,
		8,
		8,
		10,
		12,
		16,
		12,
		17,
		16,
		18,
		21,
		20,
		23,
		23,
		25,
		27,
		29,
		34,
		34,
		35,
		38,
		40,
		43,
		45,
		48,
		51,
		53,
		56,
		59,
		62,
		65,
		68
	],
	high: [
		1,
		1,
		2,
		4,
		4,
		4,
		5,
		6,
		8,
		8,
		11,
		11,
		16,
		16,
		18,
		16,
		19,
		21,
		25,
		25,
		25,
		34,
		30,
		32,
		35,
		37,
		40,
		42,
		45,
		48,
		51,
		54,
		57,
		60,
		63,
		66,
		70,
		74,
		77,
		81
	]
};
var info = {
	size: {
		encode: (ver) => 21 + 4 * (ver - 1),
		decode: (size) => (size - 17) / 4
	},
	sizeType: (ver) => Math.floor((ver + 7) / 17),
	alignmentPatterns(ver) {
		if (ver === 1) return [];
		const first = 6;
		const last = info.size.encode(ver) - first - 1;
		const distance = last - first;
		const count = Math.ceil(distance / 28);
		let interval = Math.floor(distance / count);
		if (interval % 2) interval += 1;
		else if (distance % count * 2 >= count) interval += 2;
		const res = [first];
		for (let m = 1; m < count; m++) res.push(last - (count - m) * interval);
		res.push(last);
		return res;
	},
	ECCode: {
		low: 1,
		medium: 0,
		quartile: 3,
		high: 2
	},
	formatMask: 21522,
	formatBits(ecc, maskIdx) {
		const data = info.ECCode[ecc] << 3 | maskIdx;
		let d = data;
		for (let i = 0; i < 10; i++) d = d << 1 ^ (d >> 9) * 1335;
		return (data << 10 | d) ^ info.formatMask;
	},
	versionBits(ver) {
		let d = ver;
		for (let i = 0; i < 12; i++) d = d << 1 ^ (d >> 11) * 7973;
		return ver << 12 | d;
	},
	alphabet: {
		numeric: alphabet("0123456789"),
		alphanumerc: alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:")
	},
	lengthBits(ver, type) {
		return {
			numeric: [
				10,
				12,
				14
			],
			alphanumeric: [
				9,
				11,
				13
			],
			byte: [
				8,
				16,
				16
			],
			kanji: [
				8,
				10,
				12
			],
			eci: [
				0,
				0,
				0
			]
		}[type][info.sizeType(ver)];
	},
	modeBits: {
		numeric: "0001",
		alphanumeric: "0010",
		byte: "0100",
		kanji: "1000",
		eci: "0111"
	},
	capacity(ver, ecc) {
		const bytes = BYTES[ver - 1];
		const words = WORDS_PER_BLOCK[ecc][ver - 1];
		const numBlocks = ECC_BLOCKS[ecc][ver - 1];
		const blockLen = Math.floor(bytes / numBlocks) - words;
		const shortBlocks = numBlocks - bytes % numBlocks;
		return {
			words,
			numBlocks,
			shortBlocks,
			blockLen,
			capacity: (bytes - words * numBlocks) * 8,
			total: (words + blockLen) * numBlocks + numBlocks - shortBlocks
		};
	}
};
var PATTERNS = [
	(x, y) => (x + y) % 2 == 0,
	(_x, y) => y % 2 == 0,
	(x, _y) => x % 3 == 0,
	(x, y) => (x + y) % 3 == 0,
	(x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 == 0,
	(x, y) => x * y % 2 + x * y % 3 == 0,
	(x, y) => (x * y % 2 + x * y % 3) % 2 == 0,
	(x, y) => ((x + y) % 2 + x * y % 3) % 2 == 0
];
var GF = {
	tables: ((p_poly) => {
		const exp = fillArr(256, 0);
		const log = fillArr(256, 0);
		for (let i = 0, x = 1; i < 256; i++) {
			exp[i] = x;
			log[x] = i;
			x <<= 1;
			if (x & 256) x ^= p_poly;
		}
		return {
			exp,
			log
		};
	})(285),
	exp: (x) => GF.tables.exp[x],
	log(x) {
		if (x === 0) throw new Error(`GF.log: wrong arg=${x}`);
		return GF.tables.log[x] % 255;
	},
	mul(x, y) {
		if (x === 0 || y === 0) return 0;
		return GF.tables.exp[(GF.tables.log[x] + GF.tables.log[y]) % 255];
	},
	add: (x, y) => x ^ y,
	pow: (x, e) => GF.tables.exp[GF.tables.log[x] * e % 255],
	inv(x) {
		if (x === 0) throw new Error(`GF.inverse: wrong arg=${x}`);
		return GF.tables.exp[255 - GF.tables.log[x]];
	},
	polynomial(poly) {
		if (poly.length == 0) throw new Error("GF.polymomial: wrong length");
		if (poly[0] !== 0) return poly;
		let i = 0;
		for (; i < poly.length - 1 && poly[i] == 0; i++);
		return poly.slice(i);
	},
	monomial(degree, coefficient) {
		if (degree < 0) throw new Error(`GF.monomial: wrong degree=${degree}`);
		if (coefficient == 0) return [0];
		let coefficients = fillArr(degree + 1, 0);
		coefficients[0] = coefficient;
		return GF.polynomial(coefficients);
	},
	degree: (a) => a.length - 1,
	coefficient: (a, degree) => a[GF.degree(a) - degree],
	mulPoly(a, b) {
		if (a[0] === 0 || b[0] === 0) return [0];
		const res = fillArr(a.length + b.length - 1, 0);
		for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) res[i + j] = GF.add(res[i + j], GF.mul(a[i], b[j]));
		return GF.polynomial(res);
	},
	mulPolyScalar(a, scalar) {
		if (scalar == 0) return [0];
		if (scalar == 1) return a;
		const res = fillArr(a.length, 0);
		for (let i = 0; i < a.length; i++) res[i] = GF.mul(a[i], scalar);
		return GF.polynomial(res);
	},
	mulPolyMonomial(a, degree, coefficient) {
		if (degree < 0) throw new Error("GF.mulPolyMonomial: wrong degree");
		if (coefficient == 0) return [0];
		const res = fillArr(a.length + degree, 0);
		for (let i = 0; i < a.length; i++) res[i] = GF.mul(a[i], coefficient);
		return GF.polynomial(res);
	},
	addPoly(a, b) {
		if (a[0] === 0) return b;
		if (b[0] === 0) return a;
		let smaller = a;
		let larger = b;
		if (smaller.length > larger.length) [smaller, larger] = [larger, smaller];
		let sumDiff = fillArr(larger.length, 0);
		let lengthDiff = larger.length - smaller.length;
		let s = larger.slice(0, lengthDiff);
		for (let i = 0; i < s.length; i++) sumDiff[i] = s[i];
		for (let i = lengthDiff; i < larger.length; i++) sumDiff[i] = GF.add(smaller[i - lengthDiff], larger[i]);
		return GF.polynomial(sumDiff);
	},
	remainderPoly(data, divisor) {
		const out = Array.from(data);
		for (let i = 0; i < data.length - divisor.length + 1; i++) {
			const elm = out[i];
			if (elm === 0) continue;
			for (let j = 1; j < divisor.length; j++) if (divisor[j] !== 0) out[i + j] = GF.add(out[i + j], GF.mul(divisor[j], elm));
		}
		return out.slice(data.length - divisor.length + 1, out.length);
	},
	divisorPoly(degree) {
		let g = [1];
		for (let i = 0; i < degree; i++) g = GF.mulPoly(g, [1, GF.pow(2, i)]);
		return g;
	},
	evalPoly(poly, a) {
		if (a == 0) return GF.coefficient(poly, 0);
		let res = poly[0];
		for (let i = 1; i < poly.length; i++) res = GF.add(GF.mul(a, res), poly[i]);
		return res;
	},
	euclidian(a, b, R) {
		if (GF.degree(a) < GF.degree(b)) [a, b] = [b, a];
		let rLast = a;
		let r = b;
		let tLast = [0];
		let t = [1];
		while (2 * GF.degree(r) >= R) {
			let rLastLast = rLast;
			let tLastLast = tLast;
			rLast = r;
			tLast = t;
			if (rLast[0] === 0) throw new Error("rLast[0] === 0");
			r = rLastLast;
			let q = [0];
			const dltInverse = GF.inv(rLast[0]);
			while (GF.degree(r) >= GF.degree(rLast) && r[0] !== 0) {
				const degreeDiff = GF.degree(r) - GF.degree(rLast);
				const scale = GF.mul(r[0], dltInverse);
				q = GF.addPoly(q, GF.monomial(degreeDiff, scale));
				r = GF.addPoly(r, GF.mulPolyMonomial(rLast, degreeDiff, scale));
			}
			q = GF.mulPoly(q, tLast);
			t = GF.addPoly(q, tLastLast);
			if (GF.degree(r) >= GF.degree(rLast)) throw new Error(`Division failed r: ${r}, rLast: ${rLast}`);
		}
		const sigmaTildeAtZero = GF.coefficient(t, 0);
		if (sigmaTildeAtZero == 0) throw new Error("sigmaTilde(0) was zero");
		const inverse = GF.inv(sigmaTildeAtZero);
		return [GF.mulPolyScalar(t, inverse), GF.mulPolyScalar(r, inverse)];
	}
};
function RS(eccWords) {
	return {
		encode(from) {
			const d = GF.divisorPoly(eccWords);
			const pol = Array.from(from);
			pol.push(...d.slice(0, -1).fill(0));
			return Uint8Array.from(GF.remainderPoly(pol, d));
		},
		decode(to) {
			const res = to.slice();
			const poly = GF.polynomial(Array.from(to));
			let syndrome = fillArr(eccWords, 0);
			let hasError = false;
			for (let i = 0; i < eccWords; i++) {
				const evl = GF.evalPoly(poly, GF.exp(i));
				syndrome[syndrome.length - 1 - i] = evl;
				if (evl !== 0) hasError = true;
			}
			if (!hasError) return res;
			syndrome = GF.polynomial(syndrome);
			const monomial = GF.monomial(eccWords, 1);
			const [errorLocator, errorEvaluator] = GF.euclidian(monomial, syndrome, eccWords);
			const locations = fillArr(GF.degree(errorLocator), 0);
			let e = 0;
			for (let i = 1; i < 256 && e < locations.length; i++) if (GF.evalPoly(errorLocator, i) === 0) locations[e++] = GF.inv(i);
			if (e !== locations.length) throw new Error("RS.decode: wrong errors number");
			for (let i = 0; i < locations.length; i++) {
				const pos = res.length - 1 - GF.log(locations[i]);
				if (pos < 0) throw new Error("RS.decode: wrong error location");
				const xiInverse = GF.inv(locations[i]);
				let denominator = 1;
				for (let j = 0; j < locations.length; j++) {
					if (i === j) continue;
					denominator = GF.mul(denominator, GF.add(1, GF.mul(locations[j], xiInverse)));
				}
				res[pos] = GF.add(res[pos], GF.mul(GF.evalPoly(errorEvaluator, xiInverse), GF.inv(denominator)));
			}
			return res;
		}
	};
}
function interleave(ver, ecc) {
	const { words, shortBlocks, numBlocks, blockLen, total } = info.capacity(ver, ecc);
	const rs = RS(words);
	return {
		encode(bytes) {
			const blocks = [];
			const eccBlocks = [];
			for (let i = 0; i < numBlocks; i++) {
				const len = blockLen + (i < shortBlocks ? 0 : 1);
				blocks.push(bytes.subarray(0, len));
				eccBlocks.push(rs.encode(bytes.subarray(0, len)));
				bytes = bytes.subarray(len);
			}
			const resBlocks = interleaveBytes(...blocks);
			const resECC = interleaveBytes(...eccBlocks);
			const res = new Uint8Array(resBlocks.length + resECC.length);
			res.set(resBlocks);
			res.set(resECC, resBlocks.length);
			return res;
		},
		decode(data) {
			if (data.length !== total) throw new Error(`interleave.decode: len(data)=${data.length}, total=${total}`);
			const blocks = [];
			for (let i = 0; i < numBlocks; i++) {
				const isShort = i < shortBlocks;
				blocks.push(new Uint8Array(words + blockLen + (isShort ? 0 : 1)));
			}
			let pos = 0;
			for (let i = 0; i < blockLen; i++) for (let j = 0; j < numBlocks; j++) blocks[j][i] = data[pos++];
			for (let j = shortBlocks; j < numBlocks; j++) blocks[j][blockLen] = data[pos++];
			for (let i = blockLen; i < blockLen + words; i++) for (let j = 0; j < numBlocks; j++) {
				const isShort = j < shortBlocks;
				blocks[j][i + (isShort ? 0 : 1)] = data[pos++];
			}
			const res = [];
			for (const block of blocks) res.push(...Array.from(rs.decode(block)).slice(0, -words));
			return Uint8Array.from(res);
		}
	};
}
function drawTemplate(ver, ecc, maskIdx, test = false) {
	const size = info.size.encode(ver);
	let b = new Bitmap(size + 2);
	const finder = new Bitmap(3).rect(0, 3, true).border(1, false).border(1, true).border(1, false);
	b = b.embed(0, finder).embed({
		x: -finder.width,
		y: 0
	}, finder).embed({
		x: 0,
		y: -finder.height
	}, finder);
	b = b.rectSlice(1, size);
	const align = new Bitmap(1).rect(0, 1, true).border(1, false).border(1, true);
	const alignPos = info.alignmentPatterns(ver);
	for (const y of alignPos) for (const x of alignPos) {
		if (b.data[y][x] !== void 0) continue;
		b.embed({
			x: x - 2,
			y: y - 2
		}, align);
	}
	b = b.hLine({
		x: 0,
		y: 6
	}, Infinity, ({ x }, cur) => cur === void 0 ? x % 2 == 0 : cur).vLine({
		x: 6,
		y: 0
	}, Infinity, ({ y }, cur) => cur === void 0 ? y % 2 == 0 : cur);
	{
		const bits = info.formatBits(ecc, maskIdx);
		const getBit = (i) => !test && (bits >> i & 1) == 1;
		for (let i = 0; i < 6; i++) b.data[i][8] = getBit(i);
		for (let i = 6; i < 8; i++) b.data[i + 1][8] = getBit(i);
		for (let i = 8; i < 15; i++) b.data[size - 15 + i][8] = getBit(i);
		for (let i = 0; i < 8; i++) b.data[8][size - i - 1] = getBit(i);
		for (let i = 8; i < 9; i++) b.data[8][15 - i - 1 + 1] = getBit(i);
		for (let i = 9; i < 15; i++) b.data[8][15 - i - 1] = getBit(i);
		b.data[size - 8][8] = !test;
	}
	if (ver >= 7) {
		const bits = info.versionBits(ver);
		for (let i = 0; i < 18; i += 1) {
			const bit = !test && (bits >> i & 1) == 1;
			const x = Math.floor(i / 3);
			const y = i % 3 + size - 8 - 3;
			b.data[x][y] = bit;
			b.data[y][x] = bit;
		}
	}
	return b;
}
function zigzag(tpl, maskIdx, fn) {
	const size = tpl.height;
	const pattern = PATTERNS[maskIdx];
	let dir = -1;
	let y = size - 1;
	for (let xOffset = size - 1; xOffset > 0; xOffset -= 2) {
		if (xOffset == 6) xOffset = 5;
		for (;; y += dir) {
			for (let j = 0; j < 2; j += 1) {
				const x = xOffset - j;
				if (tpl.data[y][x] !== void 0) continue;
				fn(x, y, pattern(x, y));
			}
			if (y + dir < 0 || y + dir >= size) break;
		}
		dir = -dir;
	}
}
function detectType(str) {
	let type = "numeric";
	for (let x of str) {
		if (info.alphabet.numeric.has(x)) continue;
		type = "alphanumeric";
		if (!info.alphabet.alphanumerc.has(x)) return "byte";
	}
	return type;
}
/**
* @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
	return new Uint8Array(new TextEncoder().encode(str));
}
function encode(ver, ecc, data, type) {
	let encoded = "";
	let dataLen = data.length;
	if (type === "numeric") {
		const t = info.alphabet.numeric.decode(data.split(""));
		const n = t.length;
		for (let i = 0; i < n - 2; i += 3) encoded += bin(t[i] * 100 + t[i + 1] * 10 + t[i + 2], 10);
		if (n % 3 === 1) encoded += bin(t[n - 1], 4);
		else if (n % 3 === 2) encoded += bin(t[n - 2] * 10 + t[n - 1], 7);
	} else if (type === "alphanumeric") {
		const t = info.alphabet.alphanumerc.decode(data.split(""));
		const n = t.length;
		for (let i = 0; i < n - 1; i += 2) encoded += bin(t[i] * 45 + t[i + 1], 11);
		if (n % 2 == 1) encoded += bin(t[n - 1], 6);
	} else if (type === "byte") {
		const utf8 = utf8ToBytes(data);
		dataLen = utf8.length;
		encoded = Array.from(utf8).map((i) => bin(i, 8)).join("");
	} else throw new Error("encode: unsupported type");
	const { capacity } = info.capacity(ver, ecc);
	const len = bin(dataLen, info.lengthBits(ver, type));
	let bits = info.modeBits[type] + len + encoded;
	if (bits.length > capacity) throw new Error("Capacity overflow");
	bits += "0".repeat(Math.min(4, Math.max(0, capacity - bits.length)));
	if (bits.length % 8) bits += "0".repeat(8 - bits.length % 8);
	const padding = "1110110000010001";
	for (let idx = 0; bits.length !== capacity; idx++) bits += padding[idx % 16];
	const bytes = Uint8Array.from(bits.match(/(.{8})/g).map((i) => Number(`0b${i}`)));
	return interleave(ver, ecc).encode(bytes);
}
function drawQR(ver, ecc, data, maskIdx, test = false) {
	const b = drawTemplate(ver, ecc, maskIdx, test);
	let i = 0;
	const need = 8 * data.length;
	zigzag(b, maskIdx, (x, y, mask) => {
		let value = false;
		if (i < need) {
			value = (data[i >>> 3] >> (7 - i & 7) & 1) !== 0;
			i++;
		}
		b.data[y][x] = value !== mask;
	});
	if (i !== need) throw new Error("QR: bytes left after draw");
	return b;
}
function penalty(bm) {
	const inverse = bm.inverse();
	const sameColor = (row) => {
		let res = 0;
		for (let i = 0, same = 1, last = void 0; i < row.length; i++) {
			if (last === row[i]) {
				same++;
				if (i !== row.length - 1) continue;
			}
			if (same >= 5) res += 3 + (same - 5);
			last = row[i];
			same = 1;
		}
		return res;
	};
	let adjacent = 0;
	bm.data.forEach((row) => adjacent += sameColor(row));
	inverse.data.forEach((column) => adjacent += sameColor(column));
	let box = 0;
	let b = bm.data;
	const lastW = bm.width - 1;
	const lastH = bm.height - 1;
	for (let x = 0; x < lastW; x++) for (let y = 0; y < lastH; y++) {
		const x1 = x + 1;
		const y1 = y + 1;
		if (b[x][y] === b[x1][y] && b[x1][y] === b[x][y1] && b[x1][y] === b[x1][y1]) box += 3;
	}
	const finderPattern = (row) => {
		const finderPattern = [
			true,
			false,
			true,
			true,
			true,
			false,
			true
		];
		const lightPattern = [
			false,
			false,
			false,
			false
		];
		const p1 = [...finderPattern, ...lightPattern];
		const p2 = [...lightPattern, ...finderPattern];
		let res = 0;
		for (let i = 0; i < row.length; i++) {
			if (includesAt(row, p1, i)) res += 40;
			if (includesAt(row, p2, i)) res += 40;
		}
		return res;
	};
	let finder = 0;
	for (const row of bm.data) finder += finderPattern(row);
	for (const column of inverse.data) finder += finderPattern(column);
	let darkPixels = 0;
	bm.rectRead(0, Infinity, (_c, val) => darkPixels += val ? 1 : 0);
	const darkPercent = darkPixels / (bm.height * bm.width) * 100;
	const dark = 10 * Math.floor(Math.abs(darkPercent - 50) / 5);
	return adjacent + box + finder + dark;
}
function drawQRBest(ver, ecc, data, maskIdx) {
	if (maskIdx === void 0) {
		const bestMask = best();
		for (let mask = 0; mask < PATTERNS.length; mask++) bestMask.add(penalty(drawQR(ver, ecc, data, mask, true)), mask);
		maskIdx = bestMask.get();
	}
	if (maskIdx === void 0) throw new Error("Cannot find mask");
	return drawQR(ver, ecc, data, maskIdx);
}
function validateECC(ec) {
	if (!ECMode.includes(ec)) throw new Error(`Invalid error correction mode=${ec}. Expected: ${ECMode}`);
}
function validateEncoding(enc) {
	if (!Encoding.includes(enc)) throw new Error(`Encoding: invalid mode=${enc}. Expected: ${Encoding}`);
	if (enc === "kanji" || enc === "eci") throw new Error(`Encoding: ${enc} is not supported (yet?).`);
}
function validateMask(mask) {
	if (![
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7
	].includes(mask) || !PATTERNS[mask]) throw new Error(`Invalid mask=${mask}. Expected number [0..7]`);
}
function encodeQR(text, output = "raw", opts = {}) {
	const ecc = opts.ecc !== void 0 ? opts.ecc : "medium";
	validateECC(ecc);
	const encoding = opts.encoding !== void 0 ? opts.encoding : detectType(text);
	validateEncoding(encoding);
	if (opts.mask !== void 0) validateMask(opts.mask);
	let ver = opts.version;
	let data, err = /* @__PURE__ */ new Error("Unknown error");
	if (ver !== void 0) {
		validateVersion(ver);
		data = encode(ver, ecc, text, encoding);
	} else for (let i = 1; i <= 40; i++) try {
		data = encode(i, ecc, text, encoding);
		ver = i;
		break;
	} catch (e) {
		err = e;
	}
	if (!ver || !data) throw err;
	let res = drawQRBest(ver, ecc, data, opts.mask);
	res.assertDrawn();
	const border = opts.border === void 0 ? 2 : opts.border;
	if (!Number.isSafeInteger(border)) throw new Error(`Wrong border type=${typeof border}`);
	res = res.border(border, false);
	if (opts.scale !== void 0) res = res.scale(opts.scale);
	if (output === "raw") return res.data;
	else if (output === "ascii") return res.toASCII();
	else if (output === "svg") return res.toSVG();
	else if (output === "gif") return res.toGIF();
	else if (output === "term") return res.toTerm();
	else throw new Error(`Unknown output: ${output}`);
}
//#endregion
//#region ../../node_modules/.pnpm/cross-fetch@4.1.0/node_modules/cross-fetch/dist/node-ponyfill.js
var require_node_ponyfill = /* @__PURE__ */ __commonJSMin(((exports, module) => {
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
}));
//#endregion
//#region ../../node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).slice(1));
function unsafeStringify(arr, offset = 0) {
	return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
//#endregion
//#region ../../node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm/rng.js
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
	if (poolPtr > rnds8Pool.length - 16) {
		randomFillSync(rnds8Pool);
		poolPtr = 0;
	}
	return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
//#endregion
//#region ../../node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm/native.js
var native_default = { randomUUID };
//#endregion
//#region ../../node_modules/.pnpm/uuid@11.1.1/node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
	if (native_default.randomUUID && !buf && !options) return native_default.randomUUID();
	options = options || {};
	const rnds = options.random ?? options.rng?.() ?? rng();
	if (rnds.length < 16) throw new Error("Random bytes length must be >= 16");
	rnds[6] = rnds[6] & 15 | 64;
	rnds[8] = rnds[8] & 63 | 128;
	if (buf) {
		offset = offset || 0;
		if (offset < 0 || offset + 16 > buf.length) throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
		for (let i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
		return buf;
	}
	return unsafeStringify(rnds);
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+onboarding@1.0.1/node_modules/@metamask/onboarding/dist/metamask-onboarding.es.js
var import_node_ponyfill = /* @__PURE__ */ __toESM(require_node_ponyfill(), 1);
/*! *****************************************************************************
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
function __generator(thisArg, body) {
	var _ = {
		label: 0,
		sent: function() {
			if (t[0] & 1) throw t[1];
			return t[1];
		},
		trys: [],
		ops: []
	}, f, y, t, g;
	return g = {
		next: verb(0),
		"throw": verb(1),
		"return": verb(2)
	}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
		return this;
	}), g;
	function verb(n) {
		return function(v) {
			return step([n, v]);
		};
	}
	function step(op) {
		if (f) throw new TypeError("Generator is already executing.");
		while (_) try {
			if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
			if (y = 0, t) op = [op[0] & 2, t.value];
			switch (op[0]) {
				case 0:
				case 1:
					t = op;
					break;
				case 4:
					_.label++;
					return {
						value: op[1],
						done: false
					};
				case 5:
					_.label++;
					y = op[1];
					op = [0];
					continue;
				case 7:
					op = _.ops.pop();
					_.trys.pop();
					continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
						_ = 0;
						continue;
					}
					if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
						_.label = op[1];
						break;
					}
					if (op[0] === 6 && _.label < t[1]) {
						_.label = t[1];
						t = op;
						break;
					}
					if (t && _.label < t[2]) {
						_.label = t[2];
						_.ops.push(op);
						break;
					}
					if (t[2]) _.ops.pop();
					_.trys.pop();
					continue;
			}
			op = body.call(thisArg, _);
		} catch (e) {
			op = [6, e];
			y = 0;
		} finally {
			f = t = 0;
		}
		if (op[0] & 5) throw op[1];
		return {
			value: op[0] ? op[1] : void 0,
			done: true
		};
	}
}
var ONBOARDING_STATE = {
	INSTALLED: "INSTALLED",
	NOT_INSTALLED: "NOT_INSTALLED",
	REGISTERED: "REGISTERED",
	REGISTERING: "REGISTERING",
	RELOADING: "RELOADING"
};
var EXTENSION_DOWNLOAD_URL = {
	CHROME: "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
	FIREFOX: "https://addons.mozilla.org/firefox/addon/ether-metamask/",
	DEFAULT: "https://metamask.io"
};
var REGISTRATION_IN_PROGRESS = "REGISTRATION_IN_PROGRESS";
var FORWARDER_ID = "FORWARDER_ID";
var Onboarding = function() {
	function Onboarding(_a) {
		var _b = _a === void 0 ? {} : _a, _c = _b.forwarderOrigin, forwarderOrigin = _c === void 0 ? "https://fwd.metamask.io" : _c, _d = _b.forwarderMode, forwarderMode = _d === void 0 ? Onboarding.FORWARDER_MODE.INJECT : _d;
		this.forwarderOrigin = forwarderOrigin;
		this.forwarderMode = forwarderMode;
		this.state = Onboarding.isMetaMaskInstalled() ? ONBOARDING_STATE.INSTALLED : ONBOARDING_STATE.NOT_INSTALLED;
		var browser = Onboarding._detectBrowser();
		if (browser) this.downloadUrl = EXTENSION_DOWNLOAD_URL[browser];
		else this.downloadUrl = EXTENSION_DOWNLOAD_URL.DEFAULT;
		this._onMessage = this._onMessage.bind(this);
		this._onMessageFromForwarder = this._onMessageFromForwarder.bind(this);
		this._openForwarder = this._openForwarder.bind(this);
		this._openDownloadPage = this._openDownloadPage.bind(this);
		this.startOnboarding = this.startOnboarding.bind(this);
		this.stopOnboarding = this.stopOnboarding.bind(this);
		window.addEventListener("message", this._onMessage);
		if (forwarderMode === Onboarding.FORWARDER_MODE.INJECT && sessionStorage.getItem(REGISTRATION_IN_PROGRESS) === "true") Onboarding._injectForwarder(this.forwarderOrigin);
	}
	Onboarding.prototype._onMessage = function(event) {
		if (event.origin !== this.forwarderOrigin) return;
		if (event.data.type === "metamask:reload") return this._onMessageFromForwarder(event);
		console.debug("Unknown message from '" + event.origin + "' with data " + JSON.stringify(event.data));
	};
	Onboarding.prototype._onMessageUnknownStateError = function(state) {
		throw new Error("Unknown state: '" + state + "'");
	};
	Onboarding.prototype._onMessageFromForwarder = function(event) {
		return __awaiter(this, void 0, void 0, function() {
			var _a;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						_a = this.state;
						switch (_a) {
							case ONBOARDING_STATE.RELOADING: return [3, 1];
							case ONBOARDING_STATE.NOT_INSTALLED: return [3, 2];
							case ONBOARDING_STATE.INSTALLED: return [3, 3];
							case ONBOARDING_STATE.REGISTERING: return [3, 5];
							case ONBOARDING_STATE.REGISTERED: return [3, 6];
						}
						return [3, 7];
					case 1:
						console.debug("Ignoring message while reloading");
						return [3, 8];
					case 2:
						console.debug("Reloading now to register with MetaMask");
						this.state = ONBOARDING_STATE.RELOADING;
						location.reload();
						return [3, 8];
					case 3:
						console.debug("Registering with MetaMask");
						this.state = ONBOARDING_STATE.REGISTERING;
						return [4, Onboarding._register()];
					case 4:
						_b.sent();
						this.state = ONBOARDING_STATE.REGISTERED;
						event.source.postMessage({ type: "metamask:registrationCompleted" }, event.origin);
						this.stopOnboarding();
						return [3, 8];
					case 5:
						console.debug("Already registering - ignoring reload message");
						return [3, 8];
					case 6:
						console.debug("Already registered - ignoring reload message");
						return [3, 8];
					case 7:
						this._onMessageUnknownStateError(this.state);
						_b.label = 8;
					case 8: return [2];
				}
			});
		});
	};
	/**
	* Starts onboarding by opening the MetaMask download page and the Onboarding forwarder
	*/
	Onboarding.prototype.startOnboarding = function() {
		sessionStorage.setItem(REGISTRATION_IN_PROGRESS, "true");
		this._openDownloadPage();
		this._openForwarder();
	};
	/**
	* Stops onboarding registration, including removing the injected forwarder (if any)
	*
	* Typically this function is not necessary, but it can be useful for cases where
	* onboarding completes before the forwarder has registered.
	*/
	Onboarding.prototype.stopOnboarding = function() {
		if (sessionStorage.getItem(REGISTRATION_IN_PROGRESS) === "true") {
			if (this.forwarderMode === Onboarding.FORWARDER_MODE.INJECT) {
				console.debug("Removing forwarder");
				Onboarding._removeForwarder();
			}
			sessionStorage.setItem(REGISTRATION_IN_PROGRESS, "false");
		}
	};
	Onboarding.prototype._openForwarder = function() {
		if (this.forwarderMode === Onboarding.FORWARDER_MODE.OPEN_TAB) window.open(this.forwarderOrigin, "_blank");
		else Onboarding._injectForwarder(this.forwarderOrigin);
	};
	Onboarding.prototype._openDownloadPage = function() {
		window.open(this.downloadUrl, "_blank");
	};
	/**
	* Checks whether the MetaMask extension is installed
	*/
	Onboarding.isMetaMaskInstalled = function() {
		return Boolean(window.ethereum && window.ethereum.isMetaMask);
	};
	Onboarding._register = function() {
		return window.ethereum.request({ method: "wallet_registerOnboarding" });
	};
	Onboarding._injectForwarder = function(forwarderOrigin) {
		var container = document.body;
		var iframe = document.createElement("iframe");
		iframe.setAttribute("height", "0");
		iframe.setAttribute("width", "0");
		iframe.setAttribute("style", "display: none;");
		iframe.setAttribute("src", forwarderOrigin);
		iframe.setAttribute("id", FORWARDER_ID);
		container.insertBefore(iframe, container.children[0]);
	};
	Onboarding._removeForwarder = function() {
		var _a;
		(_a = document.getElementById(FORWARDER_ID)) === null || _a === void 0 || _a.remove();
	};
	Onboarding._detectBrowser = function() {
		var browserInfo = Bowser.parse(window.navigator.userAgent);
		if (browserInfo.browser.name === "Firefox") return "FIREFOX";
		else if (["Chrome", "Chromium"].includes(browserInfo.browser.name || "")) return "CHROME";
		return null;
	};
	Onboarding.FORWARDER_MODE = {
		INJECT: "INJECT",
		OPEN_TAB: "OPEN_TAB"
	};
	return Onboarding;
}();
//#endregion
//#region ../../node_modules/.pnpm/@metamask+connect-multichain@0.13.0_bufferutil@4.1.0_utf-8-validate@6.0.6/node_modules/@metamask/connect-multichain/dist/node/es/connect-multichain.mjs
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = (msg) => {
	throw TypeError(msg);
};
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
var __esm = (fn, res) => function __init() {
	return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
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
var BaseErr;
var init_base = __esm({ "src/domain/errors/base.ts"() {
	"use strict";
	BaseErr = class extends Error {
		constructor(message, code) {
			super(message);
			this.message = message;
			this.code = code;
		}
	};
} });
var _RPCHttpErr, RPCHttpErr, _RPCReadonlyResponseErr, RPCReadonlyResponseErr, _RPCReadonlyRequestErr, RPCReadonlyRequestErr, _RPCInvokeMethodErr, RPCInvokeMethodErr;
var init_rpc = __esm({ "src/domain/errors/rpc.ts"() {
	"use strict";
	init_base();
	_RPCHttpErr = class _RPCHttpErr extends BaseErr {
		constructor(rpcEndpoint, method, httpStatus) {
			super(`RPCErr${_RPCHttpErr.code}: ${httpStatus} on ${rpcEndpoint} for method ${method}`, _RPCHttpErr.code);
			this.rpcEndpoint = rpcEndpoint;
			this.method = method;
			this.httpStatus = httpStatus;
		}
	};
	_RPCHttpErr.code = 50;
	RPCHttpErr = _RPCHttpErr;
	_RPCReadonlyResponseErr = class _RPCReadonlyResponseErr extends BaseErr {
		constructor(reason) {
			super(`RPCErr${_RPCReadonlyResponseErr.code}: RPC Client response reason ${reason}`, _RPCReadonlyResponseErr.code);
			this.reason = reason;
		}
	};
	_RPCReadonlyResponseErr.code = 51;
	RPCReadonlyResponseErr = _RPCReadonlyResponseErr;
	_RPCReadonlyRequestErr = class _RPCReadonlyRequestErr extends BaseErr {
		constructor(reason) {
			super(`RPCErr${_RPCReadonlyRequestErr.code}: RPC Client fetch reason ${reason}`, _RPCReadonlyRequestErr.code);
			this.reason = reason;
		}
	};
	_RPCReadonlyRequestErr.code = 52;
	RPCReadonlyRequestErr = _RPCReadonlyRequestErr;
	_RPCInvokeMethodErr = class _RPCInvokeMethodErr extends BaseErr {
		constructor(reason, rpcCode, rpcMessage) {
			super(`RPCErr${_RPCInvokeMethodErr.code}: RPC Client invoke method reason (${reason})`, _RPCInvokeMethodErr.code);
			this.reason = reason;
			this.rpcCode = rpcCode;
			this.rpcMessage = rpcMessage;
		}
	};
	_RPCInvokeMethodErr.code = 53;
	RPCInvokeMethodErr = _RPCInvokeMethodErr;
} });
var init_errors = __esm({ "src/domain/errors/index.ts"() {
	"use strict";
	init_rpc();
} });
var _emitter, EventEmitter;
var init_events = __esm({ "src/domain/events/index.ts"() {
	"use strict";
	EventEmitter = class {
		constructor() {
			__privateAdd(this, _emitter, new import_eventemitter3.default());
		}
		/**
		* Emits an event with the specified name and arguments.
		*
		* @template TEventName - The name of the event to emit (must be a key of TEvents)
		* @param eventName - The name of the event to emit
		* @param eventArg - The arguments to pass to the event handlers
		*/
		emit(eventName, ...eventArg) {
			__privateGet(this, _emitter).emit(eventName, ...eventArg);
		}
		/**
		* Registers an event handler for the specified event.
		*
		* @template TEventName - The name of the event to listen for (must be a key of TEvents)
		* @param eventName - The name of the event to listen for
		* @param handler - The function to call when the event is emitted
		* @returns Nothing
		*/
		on(eventName, handler) {
			__privateGet(this, _emitter).on(eventName, handler);
			return () => {
				this.off(eventName, handler);
			};
		}
		/**
		* Removes a specific event handler for the specified event.
		*
		* @template TEventName - The name of the event to remove the handler from (must be a key of TEvents)
		* @param eventName - The name of the event to remove the handler from
		* @param handler - The specific handler function to remove
		*/
		off(eventName, handler) {
			__privateGet(this, _emitter).off(eventName, handler);
		}
		/**
		* Removes a specific event handler for the specified event.
		* Added for compatibility as some libraries use this method name.
		*
		* @template TEventName - The name of the event to remove the handler from (must be a key of TEvents)
		* @param eventName - The name of the event to remove the handler from
		* @param handler - The specific handler function to remove
		*/
		removeListener(eventName, handler) {
			__privateGet(this, _emitter).off(eventName, handler);
		}
		/**
		* Registers an event handler for the specified event that will only be called once.
		*
		* @template TEventName - The name of the event to listen for (must be a key of TEvents)
		* @param eventName - The name of the event to listen for
		* @param handler - The function to call when the event is emitted (only once)
		* @returns A function to remove the listener
		*/
		once(eventName, handler) {
			__privateGet(this, _emitter).once(eventName, handler);
			return () => {
				this.off(eventName, handler);
			};
		}
		/**
		* Returns the number of listeners registered for the specified event.
		*
		* @template TEventName - The name of the event to count listeners for (must be a key of TEvents)
		* @param eventName - The name of the event to count listeners for
		* @returns The number of listeners registered for the event
		*/
		listenerCount(eventName) {
			return __privateGet(this, _emitter).listenerCount(eventName);
		}
	};
	_emitter = /* @__PURE__ */ new WeakMap();
} });
function isNamespaceEnabled(debugValue, namespace) {
	return debugValue.includes(namespace) || debugValue.includes("metamask-sdk:*") || debugValue.includes("*");
}
var createLogger, enableDebug, isEnabled;
var init_logger = __esm({ "src/domain/logger/index.ts"() {
	"use strict";
	createLogger = (namespace = "metamask-sdk", color = "214") => {
		const logger5 = (0, import_src.default)(namespace);
		logger5.color = color;
		return logger5;
	};
	enableDebug = (namespace = "metamask-sdk") => {
		import_src.default.enable(namespace);
	};
	isEnabled = (namespace, storage) => __async(null, null, function* () {
		var _a2;
		if ("process" in globalThis && ((_a2 = process == null ? void 0 : process.env) == null ? void 0 : _a2.DEBUG)) {
			const { DEBUG } = process.env;
			return isNamespaceEnabled(DEBUG, namespace);
		}
		const storageDebug = yield storage.getDebug();
		if (storageDebug) return isNamespaceEnabled(storageDebug, namespace);
		return false;
	});
} }), RPC_HANDLED_METHODS, SDK_HANDLED_METHODS;
var init_constants = __esm({ "src/domain/multichain/api/constants.ts"() {
	"use strict";
	RPC_HANDLED_METHODS = /* @__PURE__ */ new Set([
		"eth_blockNumber",
		"eth_gasPrice",
		"eth_maxPriorityFeePerGas",
		"eth_blobBaseFee",
		"eth_feeHistory",
		"eth_getBalance",
		"eth_getCode",
		"eth_getStorageAt",
		"eth_call",
		"eth_estimateGas",
		"eth_getLogs",
		"eth_getProof",
		"eth_getTransactionCount",
		"eth_getBlockByNumber",
		"eth_getBlockByHash",
		"eth_getBlockTransactionCountByNumber",
		"eth_getBlockTransactionCountByHash",
		"eth_getUncleCountByBlockNumber",
		"eth_getUncleCountByBlockHash",
		"eth_getTransactionByHash",
		"eth_getTransactionByBlockNumberAndIndex",
		"eth_getTransactionByBlockHashAndIndex",
		"eth_getTransactionReceipt",
		"eth_getUncleByBlockNumberAndIndex",
		"eth_getUncleByBlockHashAndIndex",
		"eth_getFilterChanges",
		"eth_getFilterLogs",
		"eth_newBlockFilter",
		"eth_newFilter",
		"eth_newPendingTransactionFilter",
		"eth_sendRawTransaction",
		"eth_syncing",
		"eth_uninstallFilter"
	]);
	SDK_HANDLED_METHODS = /* @__PURE__ */ new Set(["eth_accounts", "eth_chainId"]);
} });
var init_infura = __esm({ "src/domain/multichain/api/infura.ts"() {
	"use strict";
	init_constants();
} });
function getTransportType(type) {
	switch (type) {
		case "browser": return "browser";
		case "mwp": return "mwp";
		default: return "unknown";
	}
}
var TransportType, MultichainCore;
var init_multichain = __esm({ "src/domain/multichain/index.ts"() {
	"use strict";
	init_events();
	init_constants();
	init_infura();
	TransportType = /* @__PURE__ */ ((TransportType2) => {
		TransportType2["Browser"] = "browser";
		TransportType2["MWP"] = "mwp";
		TransportType2["UNKNOWN"] = "unknown";
		return TransportType2;
	})(TransportType || {});
	MultichainCore = class extends EventEmitter {
		constructor(options) {
			super();
			this.options = options;
		}
		/**
		* Merges the given options into the current instance options.
		* Only the mergeable keys are updated (api.supportedNetworks, versions, ui.*, mobile.*, transport.extensionId, debug).
		* The main thing to note is that the value for `dapp` is not merged as it does not make sense for
		* subsequent calls to `createMultichainClient` to have a different `dapp` value.
		* Used when createMultichainClient is called with an existing singleton.
		*
		* @param partial - Options to merge/overwrite onto the current instance
		*/
		mergeOptions(partial) {
			var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
			const opts = this.options;
			this.options = __spreadProps(__spreadValues({}, opts), {
				api: __spreadProps(__spreadValues({}, opts.api), { supportedNetworks: __spreadValues(__spreadValues({}, opts.api.supportedNetworks), (_b = (_a2 = partial.api) == null ? void 0 : _a2.supportedNetworks) != null ? _b : {}) }),
				versions: __spreadValues(__spreadValues({}, opts.versions), (_c = partial.versions) != null ? _c : {}),
				ui: __spreadProps(__spreadValues({}, opts.ui), {
					headless: (_e = (_d = partial.ui) == null ? void 0 : _d.headless) != null ? _e : opts.ui.headless,
					preferExtension: (_g = (_f = partial.ui) == null ? void 0 : _f.preferExtension) != null ? _g : opts.ui.preferExtension,
					showInstallModal: (_i = (_h = partial.ui) == null ? void 0 : _h.showInstallModal) != null ? _i : opts.ui.showInstallModal
				}),
				mobile: __spreadValues(__spreadValues({}, opts.mobile), (_j = partial.mobile) != null ? _j : {}),
				transport: __spreadProps(__spreadValues({}, (_k = opts.transport) != null ? _k : {}), { extensionId: (_n = (_l = partial.transport) == null ? void 0 : _l.extensionId) != null ? _n : (_m = opts.transport) == null ? void 0 : _m.extensionId }),
				debug: (_o = partial.debug) != null ? _o : opts.debug
			});
		}
	};
} });
function isNotBrowser() {
	if (typeof window === "undefined") return true;
	if (!(window == null ? void 0 : window.navigator)) return true;
	return (navigator == null ? void 0 : navigator.product) === "ReactNative";
}
function isReactNative() {
	var _a2, _b;
	if (typeof global !== "undefined" && ((_a2 = global == null ? void 0 : global.navigator) == null ? void 0 : _a2.product) === "ReactNative") return true;
	return typeof window !== "undefined" && window.navigator !== void 0 && ((_b = window.navigator) == null ? void 0 : _b.product) === "ReactNative";
}
function isMetaMaskMobileWebView() {
	return typeof window !== "undefined" && Boolean(window.ReactNativeWebView) && Boolean(window.navigator.userAgent.endsWith("MetaMaskMobile"));
}
function isMobile() {
	var _a2, _b;
	const browser = Bowser.parse(window.navigator.userAgent);
	return ((_a2 = browser == null ? void 0 : browser.platform) == null ? void 0 : _a2.type) === "mobile" || ((_b = browser == null ? void 0 : browser.platform) == null ? void 0 : _b.type) === "tablet";
}
function getPlatformType() {
	if (isReactNative()) return "react-native";
	if (isNotBrowser()) return "nodejs";
	if (isMetaMaskMobileWebView()) return "in-app-browser";
	if (isMobile()) return "web-mobile";
	return "web-desktop";
}
function isSecure() {
	const platformType = getPlatformType();
	return isReactNative() || platformType === "web-mobile";
}
function hasExtension() {
	return __async(this, null, function* () {
		return detectionPromise;
	});
}
var PlatformType, detectionPromise;
var init_platform = __esm({ "src/domain/platform/index.ts"() {
	"use strict";
	PlatformType = /* @__PURE__ */ ((PlatformType2) => {
		PlatformType2["NonBrowser"] = "nodejs";
		PlatformType2["MetaMaskMobileWebview"] = "in-app-browser";
		PlatformType2["DesktopWeb"] = "web-desktop";
		PlatformType2["MobileWeb"] = "web-mobile";
		PlatformType2["ReactNative"] = "react-native";
		return PlatformType2;
	})(PlatformType || {});
	detectionPromise = (() => __async(null, null, function* () {
		const pt = getPlatformType();
		if (pt === "nodejs" || pt === "react-native") return Promise.resolve(false);
		return new Promise((resolve) => {
			const providers = [];
			const handler = (event) => {
				var _a2, _b;
				if ((_b = (_a2 = event == null ? void 0 : event.detail) == null ? void 0 : _a2.info) == null ? void 0 : _b.rdns) providers.push(event.detail);
			};
			window.addEventListener("eip6963:announceProvider", handler);
			window.dispatchEvent(new Event("eip6963:requestProvider"));
			setTimeout(() => {
				window.removeEventListener("eip6963:announceProvider", handler);
				resolve(providers.some((provider) => {
					var _a2, _b;
					return (_b = (_a2 = provider == null ? void 0 : provider.info) == null ? void 0 : _a2.rdns) == null ? void 0 : _b.startsWith("io.metamask");
				}));
			}, 300);
		});
	}))();
} });
var StoreAdapter;
var init_adapter = __esm({ "src/domain/store/adapter.ts"() {
	"use strict";
	StoreAdapter = class {
		constructor(options) {
			this.options = options;
		}
	};
} });
var StoreClient;
var init_client = __esm({ "src/domain/store/client.ts"() {
	"use strict";
	StoreClient = class {};
} });
var init_store = __esm({ "src/domain/store/index.ts"() {
	"use strict";
	init_adapter();
	init_client();
} });
var Modal;
var init_types = __esm({ "src/domain/ui/types.ts"() {
	"use strict";
	Modal = class {
		constructor(options) {
			this.options = options;
		}
		get isMounted() {
			return this.instance !== void 0;
		}
		get data() {
			if (typeof this.options === "object" && this.options && "link" in this.options) return this.options.link;
			if (typeof this.options === "object" && this.options && "otpCode" in this.options) return this.options.otpCode;
			throw new Error("Invalid options");
		}
		set data(data) {
			if (typeof this.options === "object" && this.options && "link" in this.options) this.options.link = data;
			if (typeof this.options === "object" && this.options && "otpCode" in this.options) this.options.otpCode = data;
		}
	};
} });
var init_ui = __esm({ "src/domain/ui/index.ts"() {
	"use strict";
	init_types();
} });
function getGlobalObject() {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof global !== "undefined") return global;
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	throw new Error("Unable to locate global object");
}
function base64Encode(str) {
	if (typeof btoa !== "undefined") return btoa(str);
	else if (typeof Buffer !== "undefined") return Buffer.from(str).toString("base64");
	throw new Error("No base64 encoding method available");
}
function compressString(str) {
	const compressed = deflate_1(str);
	return base64Encode(String.fromCharCode.apply(null, Array.from(compressed)));
}
function getDappId(dapp) {
	var _a2;
	return (_a2 = dapp.url) != null ? _a2 : dapp.name;
}
function openDeeplink(options, deeplink, universalLink) {
	var _a2;
	const { mobile } = options;
	if ((_a2 = mobile == null ? void 0 : mobile.useDeeplink) != null ? _a2 : true) {
		if (typeof window !== "undefined") window.location.href = deeplink;
	} else if (typeof document !== "undefined") {
		const link = document.createElement("a");
		link.href = universalLink;
		link.target = "_self";
		link.rel = "noreferrer noopener";
		link.click();
	}
}
function mergeRequestedSessionWithExisting(sessionData, scopes, caipAccountIds, sessionProperties) {
	const existingCaipChainIds = Object.keys(sessionData.sessionScopes);
	const existingCaipAccountIds = [];
	Object.values(sessionData.sessionScopes).forEach((scopeObject) => {
		if ((scopeObject == null ? void 0 : scopeObject.accounts) && Array.isArray(scopeObject.accounts)) scopeObject.accounts.forEach((account) => {
			existingCaipAccountIds.push(account);
		});
	});
	return {
		mergedScopes: Array.from(/* @__PURE__ */ new Set([...existingCaipChainIds, ...scopes])),
		mergedCaipAccountIds: Array.from(/* @__PURE__ */ new Set([...existingCaipAccountIds, ...caipAccountIds])),
		mergedSessionProperties: __spreadValues(__spreadValues({}, sessionData.sessionProperties), sessionProperties)
	};
}
function getOptionalScopes(scopes) {
	return scopes.reduce((prev, scope) => __spreadProps(__spreadValues({}, prev), { [scope]: {
		methods: [],
		notifications: [],
		accounts: []
	} }), {});
}
function normalizeNativeUrl(url) {
	var _a2;
	if (/^https?:\/\//u.test(url)) return;
	const schemeMatch = url.match(/^([^:]*):\/\//u);
	return {
		url: `https://${(((_a2 = schemeMatch == null ? void 0 : schemeMatch[1]) != null ? _a2 : url).toLowerCase().replace(/[^a-z0-9-]/gu, "-").replace(/^-+|-+$/gu, "") || "unknown").slice(0, 63).replace(/-+$/u, "")}.rn.dapp.local`,
		nativeScheme: url
	};
}
function setupDappMetadata(options) {
	var _a2, _b;
	const platform = getPlatformType();
	const isBrowser = platform === "web-desktop" || platform === "web-mobile" || platform === "in-app-browser";
	if (!((_a2 = options.dapp) == null ? void 0 : _a2.name)) throw new Error("You must provide dapp name");
	if (isBrowser) options.dapp = __spreadProps(__spreadValues({}, options.dapp), { url: `${window.location.protocol}//${window.location.host}` });
	if (!((_b = options.dapp) == null ? void 0 : _b.url)) throw new Error("You must provide dapp url");
	if (platform === "react-native" && options.dapp.url) {
		const normalized = normalizeNativeUrl(options.dapp.url);
		if (normalized) {
			console.info(`Normalizing dapp URL for React Native: "${options.dapp.url}" -> "${normalized.url}"`);
			options.dapp = __spreadProps(__spreadValues({}, options.dapp), {
				url: normalized.url,
				nativeScheme: normalized.nativeScheme
			});
		}
	}
	const BASE_64_ICON_MAX_LENGTH = 163400;
	const urlPattern = /^(http|https):\/\/[^\s]*$/u;
	if (options.dapp) {
		if ("iconUrl" in options.dapp) {
			if (options.dapp.iconUrl && !urlPattern.test(options.dapp.iconUrl)) {
				console.warn("Invalid dappMetadata.iconUrl: URL must start with http:// or https://");
				options.dapp.iconUrl = void 0;
			}
		}
		if ("base64Icon" in options.dapp) {
			if (options.dapp.base64Icon && options.dapp.base64Icon.length > BASE_64_ICON_MAX_LENGTH) {
				console.warn("Invalid dappMetadata.base64Icon: Base64-encoded icon string length must be less than 163400 characters");
				options.dapp.base64Icon = void 0;
			}
		}
		if (options.dapp.url && !urlPattern.test(options.dapp.url)) console.warn("Invalid dappMetadata.url: URL must start with http:// or https://");
		const favicon = extractFavicon();
		if (favicon && !("iconUrl" in options.dapp) && !("base64Icon" in options.dapp)) {
			const faviconUrl = `${window.location.protocol}//${window.location.host}${favicon}`;
			options.dapp.iconUrl = faviconUrl;
		}
	}
	return options;
}
function isSameScopesAndAccounts(currentScopes, proposedScopes, walletSession, proposedCaipAccountIds) {
	if (!(currentScopes.every((scope) => proposedScopes.includes(scope)) && proposedScopes.every((scope) => currentScopes.includes(scope)))) return false;
	const existingAccountIds = Object.values(walletSession.sessionScopes).filter(({ accounts }) => Boolean(accounts)).flatMap(({ accounts }) => accounts != null ? accounts : []);
	return proposedCaipAccountIds.every((proposedAccountId) => existingAccountIds.includes(proposedAccountId));
}
function getValidAccounts(caipAccountIds) {
	return caipAccountIds.reduce((caipAccounts, caipAccountId) => {
		try {
			return [...caipAccounts, parseCaipAccountId(caipAccountId)];
		} catch (error) {
			const stringifiedAccountId = JSON.stringify(caipAccountId);
			console.error(`Invalid CAIP account ID: ${stringifiedAccountId}`, error);
			return caipAccounts;
		}
	}, []);
}
function addValidAccounts(optionalScopes, validAccounts) {
	var _a2;
	if (!optionalScopes || !(validAccounts == null ? void 0 : validAccounts.length)) return optionalScopes;
	const result = Object.fromEntries(Object.entries(optionalScopes).map(([scope, scopeData]) => {
		var _a3, _b, _c;
		return [scope, {
			methods: [...(_a3 = scopeData == null ? void 0 : scopeData.methods) != null ? _a3 : []],
			notifications: [...(_b = scopeData == null ? void 0 : scopeData.notifications) != null ? _b : []],
			accounts: [...(_c = scopeData == null ? void 0 : scopeData.accounts) != null ? _c : []]
		}];
	}));
	const accountsByChain = /* @__PURE__ */ new Map();
	for (const account of validAccounts) {
		const chainKey = `${account.chain.namespace}:${account.chain.reference}`;
		const accountId = `${account.chainId}:${account.address}`;
		if (!accountsByChain.has(chainKey)) accountsByChain.set(chainKey, []);
		(_a2 = accountsByChain.get(chainKey)) == null || _a2.push(accountId);
	}
	for (const [scopeKey, scopeData] of Object.entries(result)) {
		if (!(scopeData == null ? void 0 : scopeData.accounts)) continue;
		try {
			const scopeDetails = parseCaipChainId(scopeKey);
			const chainKey = `${scopeDetails.namespace}:${scopeDetails.reference}`;
			const matchingAccounts = accountsByChain.get(chainKey);
			if (matchingAccounts) {
				const existingAccounts = new Set(scopeData.accounts);
				const newAccounts = matchingAccounts.filter((account) => !existingAccounts.has(account));
				scopeData.accounts.push(...newAccounts);
			}
		} catch (error) {
			console.error(`Invalid scope format: ${scopeKey}`, error);
		}
	}
	return result;
}
var extractFavicon, MAX, idCounter, getUniqueRequestId;
var init_utils = __esm({ "src/multichain/utils/index.ts"() {
	"use strict";
	init_domain();
	extractFavicon = () => {
		var _a2;
		if (typeof document === "undefined") return;
		let favicon;
		const nodeList = document.getElementsByTagName("link");
		for (let i = 0; i < nodeList.length; i++) if (nodeList[i].getAttribute("rel") === "icon" || nodeList[i].getAttribute("rel") === "shortcut icon") favicon = (_a2 = nodeList[i].getAttribute("href")) != null ? _a2 : void 0;
		return favicon;
	};
	MAX = 4294967295;
	idCounter = Math.floor(Math.random() * MAX);
	getUniqueRequestId = () => {
		idCounter = (idCounter + 1) % MAX;
		return idCounter;
	};
} });
function isRejectionError(error) {
	var _a2, _b;
	if (typeof error !== "object" || error === null) return false;
	const errorObj = error;
	const errorCode = errorObj.code;
	const errorMessage = (_b = (_a2 = errorObj.message) == null ? void 0 : _a2.toLowerCase()) != null ? _b : "";
	return errorCode === 4001 || errorCode === 4100 || errorMessage.includes("reject") || errorMessage.includes("denied") || errorMessage.includes("cancel") || errorMessage.includes("user");
}
function getBaseAnalyticsProperties(options, storage) {
	return __async(this, null, function* () {
		var _a2;
		const dappId = getDappId(options.dapp);
		const platform = getPlatformType();
		const anonId = yield storage.getAnonId();
		return {
			mmconnect_versions: (_a2 = options.versions) != null ? _a2 : {},
			dapp_id: dappId,
			platform,
			anon_id: anonId
		};
	});
}
function getWalletActionAnalyticsProperties(options, storage, invokeOptions, transportType) {
	return __async(this, null, function* () {
		var _a2;
		const dappId = getDappId(options.dapp);
		const anonId = yield storage.getAnonId();
		return {
			mmconnect_versions: (_a2 = options.versions) != null ? _a2 : {},
			dapp_id: dappId,
			method: invokeOptions.request.method,
			caip_chain_id: invokeOptions.scope,
			anon_id: anonId,
			transport_type: transportType
		};
	});
}
var init_analytics = __esm({ "src/multichain/utils/analytics.ts"() {
	"use strict";
	init_utils();
	init_domain();
} });
function getVersion() {
	return "0.0.0";
}
var init_utils2 = __esm({ "src/domain/utils/index.ts"() {
	"use strict";
	init_analytics();
} });
var init_domain = __esm({ "src/domain/index.ts"() {
	"use strict";
	init_errors();
	init_events();
	init_logger();
	init_multichain();
	init_platform();
	init_store();
	init_ui();
	init_utils2();
} });
var MULTICHAIN_PROVIDER_STREAM_NAME;
var init_constants2 = __esm({ "src/multichain/transports/constants.ts"() {
	"use strict";
	MULTICHAIN_PROVIDER_STREAM_NAME = "metamask-multichain-provider";
} });
var mwp_exports = {};
__export(mwp_exports, { MWPTransport: () => MWPTransport });
var DEFAULT_REQUEST_TIMEOUT2, CONNECTION_GRACE_PERIOD, DEFAULT_CONNECTION_TIMEOUT, DEFAULT_RESUME_TIMEOUT, SESSION_STORE_KEY, ACCOUNTS_STORE_KEY, CHAIN_STORE_KEY, PENDING_SESSION_REQUEST_KEY, CACHED_METHOD_LIST, CACHED_RESET_METHOD_LIST, logger, MWPTransport;
var init_mwp = __esm({ "src/multichain/transports/mwp/index.ts"() {
	"use strict";
	init_domain();
	init_utils();
	init_constants2();
	DEFAULT_REQUEST_TIMEOUT2 = 60 * 1e3;
	CONNECTION_GRACE_PERIOD = 60 * 1e3;
	DEFAULT_CONNECTION_TIMEOUT = DEFAULT_REQUEST_TIMEOUT2 + CONNECTION_GRACE_PERIOD;
	DEFAULT_RESUME_TIMEOUT = 10 * 1e3;
	SESSION_STORE_KEY = "cache_wallet_getSession";
	ACCOUNTS_STORE_KEY = "cache_eth_accounts";
	CHAIN_STORE_KEY = "cache_eth_chainId";
	PENDING_SESSION_REQUEST_KEY = "pending_session_request";
	CACHED_METHOD_LIST = [
		"wallet_getSession",
		"wallet_createSession",
		"wallet_sessionChanged"
	];
	CACHED_RESET_METHOD_LIST = ["wallet_revokeSession", "wallet_revokePermissions"];
	logger = createLogger("metamask-sdk:transport");
	MWPTransport = class {
		constructor(dappClient, kvstore, options = {
			requestTimeout: DEFAULT_REQUEST_TIMEOUT2,
			connectionTimeout: DEFAULT_CONNECTION_TIMEOUT,
			resumeTimeout: DEFAULT_RESUME_TIMEOUT
		}) {
			this.dappClient = dappClient;
			this.kvstore = kvstore;
			this.options = options;
			this.__pendingRequests = /* @__PURE__ */ new Map();
			this.notificationCallbacks = /* @__PURE__ */ new Set();
			this.dappClient.on("message", this.handleMessage.bind(this));
			this.dappClient.on("session_request", (sessionRequest) => {
				this.currentSessionRequest = sessionRequest;
				this.kvstore.set(PENDING_SESSION_REQUEST_KEY, JSON.stringify(sessionRequest)).catch((err) => {
					logger("Failed to store pending session request", err);
				});
			});
			if (typeof window !== "undefined" && typeof window.addEventListener !== "undefined") {
				this.windowFocusHandler = this.onWindowFocus.bind(this);
				window.addEventListener("focus", this.windowFocusHandler);
			}
		}
		get pendingRequests() {
			return this.__pendingRequests;
		}
		set pendingRequests(pendingRequests) {
			this.__pendingRequests = pendingRequests;
		}
		get sessionRequest() {
			return this.currentSessionRequest;
		}
		/**
		* Returns the stored pending session request from the dappClient session_request event, if any.
		*
		* @returns The stored SessionRequest, or null if none or invalid.
		*/
		getStoredPendingSessionRequest() {
			return __async(this, null, function* () {
				try {
					const raw = yield this.kvstore.get(PENDING_SESSION_REQUEST_KEY);
					if (!raw) return null;
					return JSON.parse(raw);
				} catch (e) {
					return null;
				}
			});
		}
		/**
		* Removes the stored pending session request from the KVStore.
		* This is necessary to ensure that ConnectMultichain is able to correctly
		* infer the MWP Transport connection attempt status.
		*/
		removeStoredPendingSessionRequest() {
			return __async(this, null, function* () {
				yield this.kvstore.delete(PENDING_SESSION_REQUEST_KEY);
			});
		}
		onWindowFocus() {
			if (!this.isConnected()) this.dappClient.reconnect();
		}
		notifyCallbacks(data) {
			this.notificationCallbacks.forEach((callback) => callback(data));
		}
		rejectRequest(id, error = /* @__PURE__ */ new Error("Request rejected")) {
			const request = this.pendingRequests.get(id);
			if (request) {
				this.pendingRequests.delete(id);
				clearTimeout(request.timeout);
				request.reject(error);
			}
		}
		parseWalletError(errorPayload) {
			const errorData = errorPayload;
			if (typeof errorData.code === "number" && typeof errorData.message === "string") {
				const { code, message: message2 } = errorData;
				if (code >= 1e3 && code <= 4999) return providerErrors.custom({
					code,
					message: message2
				});
				return new JsonRpcError(code, message2);
			}
			const message = errorPayload instanceof Error ? errorPayload.message : JSON.stringify(errorPayload);
			return rpcErrors.internal({ message });
		}
		handleMessage(message) {
			if (typeof message === "object" && message !== null) {
				if ("data" in message) {
					const messagePayload = message.data;
					if ("id" in messagePayload && typeof messagePayload.id === "string") {
						const request = this.pendingRequests.get(messagePayload.id);
						if (request) {
							clearTimeout(request.timeout);
							if ("error" in messagePayload && messagePayload.error) {
								this.pendingRequests.delete(messagePayload.id);
								request.reject(this.parseWalletError(messagePayload.error));
								return;
							}
							const requestWithName = __spreadProps(__spreadValues({}, messagePayload), { method: request.method === "wallet_getSession" || request.method === "wallet_createSession" ? "wallet_sessionChanged" : request.method });
							const notification = __spreadProps(__spreadValues({}, messagePayload), {
								method: request.method === "wallet_getSession" || request.method === "wallet_createSession" ? "wallet_sessionChanged" : request.method,
								params: requestWithName.result
							});
							this.notifyCallbacks(notification);
							request.resolve(requestWithName);
							this.pendingRequests.delete(messagePayload.id);
						}
					} else {
						if (message.data.method === "metamask_chainChanged") this.kvstore.set(CHAIN_STORE_KEY, JSON.stringify(message.data.params.chainId));
						if (message.data.method === "metamask_accountsChanged") this.kvstore.set(ACCOUNTS_STORE_KEY, JSON.stringify(message.data.params));
						if (message.data.method === "wallet_sessionChanged") {
							const response = { result: message.data.params };
							this.kvstore.set(SESSION_STORE_KEY, JSON.stringify(response));
						}
						this.notifyCallbacks(message.data);
					}
				}
			}
		}
		onResumeSuccess(resumeResolve, resumeReject, options) {
			return __async(this, null, function* () {
				var _a2, _b, _c, _d, _e, _f, _g;
				try {
					yield this.waitForWalletSessionIfNotCached();
					const sessionRequest = yield this.request({ method: "wallet_getSession" });
					if (sessionRequest.error) return resumeReject(new Error(sessionRequest.error.message));
					let walletSession = sessionRequest.result;
					if (walletSession && options) {
						const currentScopes = Object.keys((_a2 = walletSession == null ? void 0 : walletSession.sessionScopes) != null ? _a2 : {});
						const proposedScopes = (_b = options == null ? void 0 : options.scopes) != null ? _b : [];
						const proposedCaipAccountIds = (_c = options == null ? void 0 : options.caipAccountIds) != null ? _c : [];
						const hasSameScopesAndAccounts = isSameScopesAndAccounts(currentScopes, proposedScopes, walletSession, proposedCaipAccountIds);
						if (options.forceRequest || !hasSameScopesAndAccounts) {
							const sessionRequest2 = { optionalScopes: addValidAccounts(getOptionalScopes((_d = options == null ? void 0 : options.scopes) != null ? _d : []), getValidAccounts((_e = options == null ? void 0 : options.caipAccountIds) != null ? _e : [])) };
							const response = yield this.request({
								method: "wallet_createSession",
								params: sessionRequest2
							});
							if (response.error) return resumeReject(new Error(response.error.message));
							walletSession = response.result;
						}
					} else if (!walletSession) {
						const sessionRequest2 = { optionalScopes: addValidAccounts(getOptionalScopes((_f = options == null ? void 0 : options.scopes) != null ? _f : []), getValidAccounts((_g = options == null ? void 0 : options.caipAccountIds) != null ? _g : [])) };
						const response = yield this.request({
							method: "wallet_createSession",
							params: sessionRequest2
						});
						if (response.error) return resumeReject(new Error(response.error.message));
						walletSession = response.result;
					}
					yield this.removeStoredPendingSessionRequest();
					this.notifyCallbacks({
						method: "wallet_sessionChanged",
						params: walletSession
					});
					return resumeResolve();
				} catch (err) {
					return resumeReject(err);
				}
			});
		}
		init() {
			return __async(this, null, function* () {});
		}
		sendEip1193Message(payload, options) {
			return __async(this, null, function* () {
				const request = __spreadValues({
					jsonrpc: "2.0",
					id: String(getUniqueRequestId())
				}, payload);
				const cachedWalletSession = yield this.getCachedResponse(request);
				if (cachedWalletSession) {
					this.notifyCallbacks(cachedWalletSession);
					return cachedWalletSession;
				}
				return new Promise((resolve, reject) => {
					var _a2;
					const timeout = setTimeout(() => {
						this.rejectRequest(request.id, new TransportTimeoutError());
					}, (_a2 = options == null ? void 0 : options.timeout) != null ? _a2 : this.options.requestTimeout);
					this.pendingRequests.set(request.id, {
						request,
						method: request.method,
						resolve: (response) => __async(this, null, function* () {
							yield this.storeWalletSession(request, response);
							return resolve(response);
						}),
						reject,
						timeout
					});
					this.dappClient.sendRequest({
						name: "metamask-provider",
						data: request
					}).catch(reject);
				});
			});
		}
		connect(options) {
			return __async(this, null, function* () {
				const { dappClient } = this;
				const session = yield this.getActiveSession();
				if (session) logger("active session found", {
					id: session.id,
					channel: session.channel,
					expiresAt: session.expiresAt
				});
				const storedSessionRequestBeforeConnectionAttempt = yield this.getStoredPendingSessionRequest();
				let timeout;
				let initialConnectionMessageHandler;
				return new Promise((resolve, reject) => __async(this, null, function* () {
					let connection;
					if (session) connection = new Promise((resumeResolve, resumeReject) => {
						var _a2;
						if (this.dappClient.state === "CONNECTED") this.onResumeSuccess(resumeResolve, resumeReject, options);
						else {
							this.dappClient.once("connected", () => __async(this, null, function* () {
								this.onResumeSuccess(resumeResolve, resumeReject, options);
							}));
							dappClient.resume((_a2 = session == null ? void 0 : session.id) != null ? _a2 : "");
						}
					});
					else connection = new Promise((resolveConnection, rejectConnection) => {
						var _a2, _b;
						const sessionRequest = {
							optionalScopes: addValidAccounts(getOptionalScopes((_a2 = options == null ? void 0 : options.scopes) != null ? _a2 : []), getValidAccounts((_b = options == null ? void 0 : options.caipAccountIds) != null ? _b : [])),
							sessionProperties: options == null ? void 0 : options.sessionProperties
						};
						const request = {
							jsonrpc: "2.0",
							id: String(getUniqueRequestId()),
							method: "wallet_createSession",
							params: sessionRequest
						};
						initialConnectionMessageHandler = (message) => __async(this, null, function* () {
							if (typeof message !== "object" || message === null) return;
							if (!("data" in message)) return;
							const messagePayload = message.data;
							const isMatchingId = messagePayload.id === request.id;
							const isMatchingMethod = messagePayload.method === "wallet_createSession" || messagePayload.method === "wallet_sessionChanged";
							if (!isMatchingId && !isMatchingMethod) return;
							if (messagePayload.error) return rejectConnection(this.parseWalletError(messagePayload.error));
							yield this.storeWalletSession(request, messagePayload);
							yield this.removeStoredPendingSessionRequest();
							this.notifyCallbacks(messagePayload);
							return resolveConnection();
						});
						this.dappClient.on("message", initialConnectionMessageHandler);
						dappClient.connect({
							mode: "trusted",
							initialPayload: {
								name: MULTICHAIN_PROVIDER_STREAM_NAME,
								data: request
							}
						}).catch((error) => {
							if (initialConnectionMessageHandler) this.dappClient.off("message", initialConnectionMessageHandler);
							rejectConnection(error);
						});
					});
					timeout = setTimeout(() => {
						reject(new TransportTimeoutError());
					}, storedSessionRequestBeforeConnectionAttempt ? this.options.resumeTimeout : this.options.connectionTimeout);
					connection.then(resolve).catch(reject);
				})).catch((error) => __async(this, null, function* () {
					yield this.dappClient.disconnect();
					throw error;
				})).finally(() => {
					if (timeout) clearTimeout(timeout);
					if (initialConnectionMessageHandler) {
						this.dappClient.off("message", initialConnectionMessageHandler);
						initialConnectionMessageHandler = void 0;
					}
					this.removeStoredPendingSessionRequest();
				});
			});
		}
		/**
		* Disconnects from the Mobile Wallet Protocol
		*
		* @param [scopes] - The scopes to revoke. If not provided or empty, all scopes will be revoked.
		* @returns Nothing
		*/
		disconnect() {
			return __async(this, arguments, function* (scopes = []) {
				var _a2, _b;
				const cachedSession = yield this.getCachedResponse({
					jsonrpc: "2.0",
					id: "0",
					method: "wallet_getSession"
				});
				const cachedSessionScopes = (_b = (_a2 = cachedSession == null ? void 0 : cachedSession.result) == null ? void 0 : _a2.sessionScopes) != null ? _b : {};
				const remainingScopes = scopes.length === 0 ? [] : Object.keys(cachedSessionScopes).filter((scope) => !scopes.includes(scope));
				const newSessionScopes = Object.fromEntries(Object.entries(cachedSessionScopes).filter(([key]) => remainingScopes.includes(key)));
				this.request({
					method: "wallet_revokeSession",
					params: { scopes }
				}).catch((err) => {
					console.error("error revoking session", err);
				});
				if (!remainingScopes.some((scope) => scope.includes("eip155"))) {
					this.kvstore.delete(ACCOUNTS_STORE_KEY);
					this.kvstore.delete(CHAIN_STORE_KEY);
				}
				if (remainingScopes.length > 0) this.kvstore.set(SESSION_STORE_KEY, JSON.stringify({ result: { sessionScopes: newSessionScopes } }));
				else {
					this.kvstore.delete(SESSION_STORE_KEY);
					if (typeof window !== "undefined" && typeof window.removeEventListener !== "undefined" && this.windowFocusHandler) {
						window.removeEventListener("focus", this.windowFocusHandler);
						this.windowFocusHandler = void 0;
					}
					yield this.dappClient.disconnect();
				}
				this.notifyCallbacks({
					method: "wallet_sessionChanged",
					params: { sessionScopes: newSessionScopes }
				});
			});
		}
		/**
		* Checks if the transport is connected
		*
		* @returns True if transport is connected, false otherwise
		*/
		isConnected() {
			return this.dappClient.state === "CONNECTED";
		}
		/**
		* Attempts to re-establish a connection via DappClient
		*
		* @returns Nothing
		*/
		attemptResumeSession() {
			return __async(this, null, function* () {
				try {
					yield this.dappClient.reconnect();
					yield new Promise((resolve, reject) => {
						const timeout = setTimeout(() => {
							reject(/* @__PURE__ */ new Error("Resume timeout"));
						}, 2e3);
						if (this.isConnected()) {
							clearTimeout(timeout);
							resolve();
						} else this.dappClient.once("connected", () => {
							clearTimeout(timeout);
							resolve();
						});
					});
				} catch (error) {
					return Promise.reject(/* @__PURE__ */ new Error(`Failed to resume session: ${error.message}`));
				}
			});
		}
		getCachedResponse(request) {
			return __async(this, null, function* () {
				var _a2;
				if (request.method === "wallet_getSession") {
					const walletGetSession = yield this.kvstore.get(SESSION_STORE_KEY);
					if (walletGetSession) {
						const walletSession = JSON.parse(walletGetSession);
						return {
							id: request.id,
							jsonrpc: "2.0",
							result: (_a2 = walletSession.params) != null ? _a2 : walletSession.result,
							method: request.method
						};
					}
				} else if (request.method === "eth_accounts") {
					const ethAccounts = yield this.kvstore.get(ACCOUNTS_STORE_KEY);
					if (ethAccounts) return {
						id: request.id,
						jsonrpc: "2.0",
						result: JSON.parse(ethAccounts),
						method: request.method
					};
				} else if (request.method === "eth_chainId") {
					const ethChainId = yield this.kvstore.get(CHAIN_STORE_KEY);
					if (ethChainId) return {
						id: request.id,
						jsonrpc: "2.0",
						result: JSON.parse(ethChainId),
						method: request.method
					};
				}
			});
		}
		storeWalletSession(request, response) {
			return __async(this, null, function* () {
				if (response.error) return;
				if (CACHED_METHOD_LIST.includes(request.method)) yield this.kvstore.set(SESSION_STORE_KEY, JSON.stringify(response));
				else if (request.method === "eth_accounts") yield this.kvstore.set(ACCOUNTS_STORE_KEY, JSON.stringify(response.result));
				else if (request.method === "eth_chainId") yield this.kvstore.set(CHAIN_STORE_KEY, JSON.stringify(response.result));
				else if (CACHED_RESET_METHOD_LIST.includes(request.method)) {
					yield this.kvstore.delete(SESSION_STORE_KEY);
					yield this.kvstore.delete(ACCOUNTS_STORE_KEY);
					yield this.kvstore.delete(CHAIN_STORE_KEY);
				}
			});
		}
		request(payload, options) {
			return __async(this, null, function* () {
				const request = __spreadValues({
					jsonrpc: "2.0",
					id: String(getUniqueRequestId())
				}, payload);
				const cachedWalletSession = yield this.getCachedResponse(request);
				if (cachedWalletSession) {
					this.notifyCallbacks(cachedWalletSession);
					return cachedWalletSession;
				}
				if (!this.isConnected()) yield this.attemptResumeSession();
				return new Promise((resolve, reject) => {
					var _a2;
					const timeout = setTimeout(() => {
						this.rejectRequest(request.id, new TransportTimeoutError());
					}, (_a2 = options == null ? void 0 : options.timeout) != null ? _a2 : this.options.requestTimeout);
					this.pendingRequests.set(request.id, {
						request,
						method: request.method,
						resolve: (response) => __async(this, null, function* () {
							yield this.storeWalletSession(request, response);
							return resolve(response);
						}),
						reject,
						timeout
					});
					this.dappClient.sendRequest({
						name: MULTICHAIN_PROVIDER_STREAM_NAME,
						data: request
					}).catch(reject);
				});
			});
		}
		onNotification(callback) {
			this.notificationCallbacks.add(callback);
			return () => {
				this.notificationCallbacks.delete(callback);
			};
		}
		getActiveSession() {
			return __async(this, null, function* () {
				const { kvstore } = this;
				const { SessionStore } = yield import("./mobile-wallet-protocol-core+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
				const sessionStore = yield SessionStore.create(kvstore);
				try {
					const [activeSession] = yield sessionStore.list();
					return activeSession;
				} catch (error) {
					logger("error getting active session", error);
					return;
				}
			});
		}
		waitForWalletSessionIfNotCached() {
			return __async(this, null, function* () {
				if (yield this.kvstore.get(SESSION_STORE_KEY)) return;
				let unsubscribe;
				const responsePromise = new Promise((resolve) => {
					unsubscribe = this.onNotification((message) => {
						if (typeof message === "object" && message !== null) {
							if ("data" in message) {
								const messagePayload = message.data;
								if (messagePayload.method === "wallet_getSession" || messagePayload.method === "wallet_sessionChanged") {
									unsubscribe();
									resolve();
								}
							}
						}
					});
				});
				const timeoutPromise = new Promise((_resolve, reject) => {
					setTimeout(() => {
						unsubscribe();
						this.removeStoredPendingSessionRequest();
						reject(new TransportTimeoutError());
					}, this.options.resumeTimeout);
				});
				return Promise.race([responsePromise, timeoutPromise]);
			});
		}
	};
} });
var KeyManager_exports = {};
__export(KeyManager_exports, { createKeyManager: () => createKeyManager });
function createKeyManager() {
	return __async(this, null, function* () {
		const { decrypt, encrypt, PrivateKey, PublicKey } = yield import("../eciesjs.mjs").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
		return {
			generateKeyPair() {
				const privateKey = new PrivateKey();
				return {
					privateKey: new Uint8Array(privateKey.secret),
					publicKey: privateKey.publicKey.toBytes(true)
				};
			},
			encrypt(plaintext, theirPublicKey) {
				return __async(this, null, function* () {
					return encrypt(theirPublicKey, Buffer.from(plaintext, "utf8")).toString("base64");
				});
			},
			decrypt(encryptedB64, myPrivateKey) {
				return __async(this, null, function* () {
					const decryptedBuffer = yield decrypt(myPrivateKey, Buffer.from(encryptedB64, "base64"));
					return Buffer.from(decryptedBuffer).toString("utf8");
				});
			},
			validatePeerKey(key) {
				PublicKey.fromHex(Buffer.from(key).toString("hex"));
			}
		};
	});
}
var init_KeyManager = __esm({ "src/multichain/transports/mwp/KeyManager.ts"() {
	"use strict";
} });
function formatRemainingTime(milliseconds) {
	if (milliseconds <= 0) return "EXPIRED";
	return `${Math.floor(milliseconds / 1e3)}s`;
}
function shouldLogCountdown(remainingSeconds) {
	if (remainingSeconds <= 10) return true;
	else if (remainingSeconds <= 30) return remainingSeconds % 5 === 0;
	else if (remainingSeconds <= 60) return remainingSeconds % 10 === 0;
	else if (remainingSeconds <= 300) return remainingSeconds % 30 === 0;
	return remainingSeconds % 60 === 0;
}
var init_utils3 = __esm({ "src/ui/modals/base/utils.ts"() {
	"use strict";
} });
var logger3, _expirationInterval, _lastLoggedCountdown, AbstractInstallModal;
var init_AbstractInstallModal = __esm({ "src/ui/modals/base/AbstractInstallModal.ts"() {
	"use strict";
	init_utils3();
	init_domain();
	logger3 = createLogger("metamask-sdk:ui");
	AbstractInstallModal = class extends Modal {
		constructor() {
			super(...arguments);
			__privateAdd(this, _expirationInterval, null);
			__privateAdd(this, _lastLoggedCountdown, -1);
		}
		get link() {
			return this.data;
		}
		set link(link) {
			this.data = link;
		}
		get connectionRequest() {
			return this.options.connectionRequest;
		}
		set connectionRequest(connectionRequest) {
			this.options.connectionRequest = connectionRequest;
		}
		updateLink(link) {
			this.link = link;
			if (this.instance) this.instance.link = link;
		}
		updateExpiresIn(expiresIn) {
			if (expiresIn >= 0 && this.instance) this.instance.expiresIn = expiresIn;
		}
		startExpirationCheck(connectionRequest) {
			this.stopExpirationCheck();
			let currentConnectionRequest = connectionRequest;
			__privateSet(this, _expirationInterval, setInterval(() => __async(this, null, function* () {
				const { sessionRequest } = currentConnectionRequest;
				const now = Date.now();
				const remainingMs = sessionRequest.expiresAt - now;
				const remainingSeconds = Math.floor(remainingMs / 1e3);
				if (remainingMs > 0 && shouldLogCountdown(remainingSeconds) && __privateGet(this, _lastLoggedCountdown) !== remainingSeconds) {
					const formattedTime = formatRemainingTime(remainingMs);
					logger3(`[UI: InstallModal-nodejs()] QR code expires in: ${formattedTime} (${remainingSeconds}s)`);
					__privateSet(this, _lastLoggedCountdown, remainingSeconds);
				}
				if (now >= sessionRequest.expiresAt) {
					this.stopExpirationCheck();
					logger3("[UI: InstallModal-nodejs()] ⏰ QR code EXPIRED! Generating new one...");
					try {
						currentConnectionRequest = yield this.options.createConnectionRequest();
						const generateQRCode = yield this.options.generateQRCode(currentConnectionRequest);
						__privateSet(this, _lastLoggedCountdown, -1);
						this.updateLink(generateQRCode);
						this.updateExpiresIn(remainingSeconds);
						this.renderQRCode(generateQRCode, currentConnectionRequest);
					} catch (error) {
						logger3(`[UI: InstallModal-nodejs()] \u274C Error generating new QR code: ${error}`);
					}
				}
			}), 1e3));
		}
		stopExpirationCheck() {
			if (__privateGet(this, _expirationInterval)) {
				clearInterval(__privateGet(this, _expirationInterval));
				__privateSet(this, _expirationInterval, null);
				logger3("[UI: InstallModal-nodejs()] 🛑 Stopped QR code expiration checking");
			}
		}
	};
	_expirationInterval = /* @__PURE__ */ new WeakMap();
	_lastLoggedCountdown = /* @__PURE__ */ new WeakMap();
} });
var logger4, InstallModal;
var init_install = __esm({ "src/ui/modals/node/install.ts"() {
	"use strict";
	init_domain();
	init_AbstractInstallModal();
	init_utils3();
	logger4 = createLogger("metamask-sdk:ui");
	InstallModal = class extends AbstractInstallModal {
		displayQRWithCountdown(qrCodeLink, expiresInMs) {
			const isExpired = expiresInMs <= 0;
			const formattedTime = formatRemainingTime(expiresInMs);
			const qrCode = encodeQR(qrCodeLink, "ascii");
			console.clear();
			console.log(qrCode);
			if (isExpired) console.log("EXPIRED - Generating new QR code...");
			else console.log(`EXPIRES IN: ${formattedTime}`);
		}
		renderQRCode(link, connectionRequest) {
			const { sessionRequest } = connectionRequest;
			const expiresIn = sessionRequest.expiresAt - Date.now();
			const shouldLog = shouldLogCountdown(Math.floor(expiresIn / 1e3));
			const formattedTime = formatRemainingTime(expiresIn);
			this.startExpirationCheck(connectionRequest);
			this.displayQRWithCountdown(link, expiresIn);
			if (shouldLog) logger4(`[UI: InstallModal-nodejs()] QR code expires in: ${formattedTime} (${expiresIn}ms)`);
		}
		mount() {
			if (!this.link) throw new Error("Session request is required");
			const { link, connectionRequest } = this;
			this.renderQRCode(link, connectionRequest);
		}
		unmount() {
			console.clear();
			this.stopExpirationCheck();
		}
	};
} });
var AbstractOTPCodeModal;
var init_AbstractOTPModal = __esm({ "src/ui/modals/base/AbstractOTPModal.ts"() {
	"use strict";
	init_domain();
	AbstractOTPCodeModal = class extends Modal {
		get otpCode() {
			return this.data;
		}
		set otpCode(code) {
			this.data = code;
		}
		updateOTPCode(code) {
			this.otpCode = code;
			if (this.instance) this.instance.otpCode = code;
		}
	};
} });
var OTPCodeModal;
var init_otp = __esm({ "src/ui/modals/node/otp.ts"() {
	"use strict";
	init_AbstractOTPModal();
	OTPCodeModal = class extends AbstractOTPCodeModal {
		mount() {}
		unmount() {}
	};
} });
var node_exports = {};
__export(node_exports, {
	InstallModal: () => InstallModal,
	OTPCodeModal: () => OTPCodeModal
});
var init_node = __esm({ "src/ui/modals/node/index.ts"() {
	"use strict";
	init_install();
	init_otp();
} });
var node_exports2 = {};
__export(node_exports2, { StoreAdapterNode: () => StoreAdapterNode });
var _storage, StoreAdapterNode;
var init_node2 = __esm({ "src/store/adapters/node.ts"() {
	"use strict";
	init_domain();
	StoreAdapterNode = class extends StoreAdapter {
		constructor() {
			super(...arguments);
			this.platform = "node";
			__privateAdd(this, _storage, /* @__PURE__ */ new Map());
		}
		get(key) {
			return __async(this, null, function* () {
				var _a2;
				return (_a2 = __privateGet(this, _storage).get(key)) != null ? _a2 : null;
			});
		}
		set(key, value) {
			return __async(this, null, function* () {
				__privateGet(this, _storage).set(key, value);
			});
		}
		delete(key) {
			return __async(this, null, function* () {
				__privateGet(this, _storage).delete(key);
			});
		}
	};
	_storage = /* @__PURE__ */ new WeakMap();
} });
init_domain();
var MWP_RELAY_URL = "wss://mm-sdk-relay.api.cx.metamask.io/connection/websocket";
var METAMASK_CONNECT_BASE_URL = "https://metamask.app.link/connect";
var METAMASK_DEEPLINK_BASE = "metamask://connect";
init_domain();
init_analytics();
init_logger();
init_multichain();
init_platform();
init_domain();
var rpcId = 1;
function getNextRpcId() {
	rpcId += 1;
	return rpcId;
}
var MissingRpcEndpointErr = class extends Error {};
var RpcClient = class {
	constructor(config, sdkInfo) {
		this.config = config;
		this.sdkInfo = sdkInfo;
	}
	/**
	* Routes the request to a configured RPC node.
	*
	* @param options - The invoke method options.
	* @returns The JSON response from the RPC node.
	*/
	request(options) {
		return __async(this, null, function* () {
			const { request } = options;
			const body = JSON.stringify({
				jsonrpc: "2.0",
				method: request.method,
				params: request.params,
				id: getNextRpcId()
			});
			const rpcEndpoint = this.getRpcEndpoint(options.scope);
			const rpcRequest = yield this.fetchWithTimeout(rpcEndpoint, body, "POST", this.getHeaders(rpcEndpoint), 3e4);
			return yield this.parseResponse(rpcRequest);
		});
	}
	getRpcEndpoint(scope) {
		var _a2, _b, _c;
		const rpcEndpoint = ((_c = (_b = (_a2 = this.config) == null ? void 0 : _a2.api) == null ? void 0 : _b.supportedNetworks) != null ? _c : {})[scope];
		if (!rpcEndpoint) throw new MissingRpcEndpointErr(`No RPC endpoint found for scope ${scope}`);
		return rpcEndpoint;
	}
	fetchWithTimeout(endpoint, body, method, headers, timeout) {
		return __async(this, null, function* () {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);
			try {
				const response = yield (0, import_node_ponyfill.default)(endpoint, {
					method,
					headers,
					body,
					signal: controller.signal
				});
				clearTimeout(timeoutId);
				if (!response.ok) throw new RPCHttpErr(endpoint, method, response.status);
				return response;
			} catch (error) {
				clearTimeout(timeoutId);
				if (error instanceof RPCHttpErr) throw error;
				if (error instanceof Error && error.name === "AbortError") throw new RPCReadonlyRequestErr(`Request timeout after ${timeout}ms`);
				throw new RPCReadonlyRequestErr(error.message);
			}
		});
	}
	parseResponse(response) {
		return __async(this, null, function* () {
			try {
				return (yield response.json()).result;
			} catch (error) {
				throw new RPCReadonlyResponseErr(error.message);
			}
		});
	}
	getHeaders(rpcEndpoint) {
		const defaultHeaders = {
			Accept: "application/json",
			"Content-Type": "application/json"
		};
		if (rpcEndpoint.includes("infura")) return __spreadProps(__spreadValues({}, defaultHeaders), { "Metamask-Sdk-Info": this.sdkInfo });
		return defaultHeaders;
	}
};
init_domain();
init_utils();
init_analytics();
var _RequestRouter_instances, withAnalyticsTracking_fn, trackWalletActionRequested_fn, trackWalletActionSucceeded_fn, trackWalletActionFailed_fn, trackWalletActionRejected_fn;
var RequestRouter = class {
	constructor(transport, rpcClient, config, transportType) {
		this.transport = transport;
		this.rpcClient = rpcClient;
		this.config = config;
		this.transportType = transportType;
		__privateAdd(this, _RequestRouter_instances);
	}
	/**
	* The main entry point for invoking an RPC method.
	* This method acts as a router, determining the correct handling strategy
	* for the request and delegating to the appropriate private handler.
	*
	* @param options
	*/
	invokeMethod(options) {
		return __async(this, null, function* () {
			const { method } = options.request;
			if (RPC_HANDLED_METHODS.has(method)) return this.handleWithRpcNode(options);
			if (SDK_HANDLED_METHODS.has(method)) return this.handleWithSdkState(options);
			return this.handleWithWallet(options);
		});
	}
	/**
	* Forwards the request directly to the wallet via the transport.
	*
	* @param options
	*/
	handleWithWallet(options) {
		return __async(this, null, function* () {
			return __privateMethod(this, _RequestRouter_instances, withAnalyticsTracking_fn).call(this, options, () => __async(this, null, function* () {
				const request = this.transport.request({
					method: "wallet_invokeMethod",
					params: options
				});
				const { ui, mobile } = this.config;
				const { showInstallModal = false } = ui != null ? ui : {};
				if (isSecure() && !showInstallModal) setTimeout(() => __async(this, null, function* () {
					const session = yield this.transport.getActiveSession();
					if (!session) throw new Error("No active session found");
					const url = `${METAMASK_DEEPLINK_BASE}/mwp?id=${encodeURIComponent(session.id)}`;
					if (mobile == null ? void 0 : mobile.preferredOpenLink) mobile.preferredOpenLink(url, "_self");
					else openDeeplink(this.config, url, METAMASK_CONNECT_BASE_URL);
				}), 10);
				const response = yield request;
				if (response.error) {
					const { error } = response;
					throw new RPCInvokeMethodErr(`RPC Request failed with code ${error.code}: ${error.message}`, error.code, error.message);
				}
				return response.result;
			}));
		});
	}
	/**
	* Routes the request to a configured RPC node.
	*
	* @param options
	*/
	handleWithRpcNode(options) {
		return __async(this, null, function* () {
			try {
				return yield this.rpcClient.request(options);
			} catch (error) {
				if (error instanceof MissingRpcEndpointErr) return this.handleWithWallet(options);
				throw error;
			}
		});
	}
	/**
	* Responds directly from the SDK's session state.
	*
	* @param options
	*/
	handleWithSdkState(options) {
		return __async(this, null, function* () {
			console.warn(`Method "${options.request.method}" is configured for SDK state handling, but this is not yet implemented. Falling back to wallet passthrough.`);
			return this.handleWithWallet(options);
		});
	}
};
_RequestRouter_instances = /* @__PURE__ */ new WeakSet();
withAnalyticsTracking_fn = function(options, execute) {
	return __async(this, null, function* () {
		var _a2;
		yield __privateMethod(this, _RequestRouter_instances, trackWalletActionRequested_fn).call(this, options);
		try {
			const result = yield execute();
			yield __privateMethod(this, _RequestRouter_instances, trackWalletActionSucceeded_fn).call(this, options);
			return result;
		} catch (error) {
			if (isRejectionError(error)) yield __privateMethod(this, _RequestRouter_instances, trackWalletActionRejected_fn).call(this, options);
			else yield __privateMethod(this, _RequestRouter_instances, trackWalletActionFailed_fn).call(this, options);
			if (error instanceof RPCInvokeMethodErr) throw error;
			const castError = error;
			throw new RPCInvokeMethodErr((_a2 = castError.message) != null ? _a2 : "Unknown error", castError.code);
		}
	});
};
trackWalletActionRequested_fn = function(options) {
	return __async(this, null, function* () {
		const props = yield getWalletActionAnalyticsProperties(this.config, this.config.storage, options, this.transportType);
		analytics.track("mmconnect_wallet_action_requested", props);
	});
};
trackWalletActionSucceeded_fn = function(options) {
	return __async(this, null, function* () {
		const props = yield getWalletActionAnalyticsProperties(this.config, this.config.storage, options, this.transportType);
		analytics.track("mmconnect_wallet_action_succeeded", props);
	});
};
trackWalletActionFailed_fn = function(options) {
	return __async(this, null, function* () {
		const props = yield getWalletActionAnalyticsProperties(this.config, this.config.storage, options, this.transportType);
		analytics.track("mmconnect_wallet_action_failed", props);
	});
};
trackWalletActionRejected_fn = function(options) {
	return __async(this, null, function* () {
		const props = yield getWalletActionAnalyticsProperties(this.config, this.config.storage, options, this.transportType);
		analytics.track("mmconnect_wallet_action_rejected", props);
	});
};
init_utils();
var DEFAULT_REQUEST_TIMEOUT = 60 * 1e3;
var _notificationCallbacks, _transport, _defaultRequestOptions, _pendingRequests, _handleResponseListener, _handleNotificationListener, _DefaultTransport_instances, notifyCallbacks_fn, isMetamaskProviderEvent_fn, handleResponse_fn, handleNotification_fn, setupMessageListener_fn, init_fn;
var DefaultTransport = class {
	constructor() {
		__privateAdd(this, _DefaultTransport_instances);
		__privateAdd(this, _notificationCallbacks, /* @__PURE__ */ new Set());
		__privateAdd(this, _transport, getDefaultTransport());
		__privateAdd(this, _defaultRequestOptions, { timeout: DEFAULT_REQUEST_TIMEOUT });
		__privateAdd(this, _pendingRequests, /* @__PURE__ */ new Map());
		__privateAdd(this, _handleResponseListener);
		__privateAdd(this, _handleNotificationListener);
	}
	sendEip1193Message(payload, options) {
		return __async(this, null, function* () {
			__privateMethod(this, _DefaultTransport_instances, setupMessageListener_fn).call(this);
			const requestId = String(getUniqueRequestId());
			const request = __spreadValues({
				jsonrpc: "2.0",
				id: requestId
			}, payload);
			return new Promise((resolve, reject) => {
				var _a2;
				const timeout = setTimeout(() => {
					__privateGet(this, _pendingRequests).delete(requestId);
					reject(/* @__PURE__ */ new Error("Request timeout"));
				}, (_a2 = options == null ? void 0 : options.timeout) != null ? _a2 : __privateGet(this, _defaultRequestOptions).timeout);
				__privateGet(this, _pendingRequests).set(requestId, {
					resolve: (response) => {
						resolve(response);
					},
					reject,
					timeout
				});
				window.postMessage({
					target: "metamask-contentscript",
					data: {
						name: "metamask-provider",
						data: request
					}
				}, location.origin);
			});
		});
	}
	init() {
		return __async(this, null, function* () {
			yield __privateMethod(this, _DefaultTransport_instances, init_fn).call(this);
			let walletSession = { sessionScopes: {} };
			try {
				walletSession = (yield this.request({ method: "wallet_getSession" }, __privateGet(this, _defaultRequestOptions))).result;
			} catch (e) {
				console.error("Failed to get wallet session during DefaultTransport init");
			}
			__privateMethod(this, _DefaultTransport_instances, notifyCallbacks_fn).call(this, {
				method: "wallet_sessionChanged",
				params: walletSession
			});
		});
	}
	connect(options) {
		return __async(this, null, function* () {
			var _a2, _b, _c, _d, _e;
			yield __privateMethod(this, _DefaultTransport_instances, init_fn).call(this);
			const sessionRequest = yield this.request({ method: "wallet_getSession" }, __privateGet(this, _defaultRequestOptions));
			if (sessionRequest.error) throw new Error(sessionRequest.error.message);
			let walletSession = sessionRequest.result;
			const createSessionParams = {
				optionalScopes: addValidAccounts(getOptionalScopes((_a2 = options == null ? void 0 : options.scopes) != null ? _a2 : []), getValidAccounts((_b = options == null ? void 0 : options.caipAccountIds) != null ? _b : [])),
				sessionProperties: options == null ? void 0 : options.sessionProperties
			};
			if (walletSession && options && !options.forceRequest) {
				const currentScopes = Object.keys((_c = walletSession == null ? void 0 : walletSession.sessionScopes) != null ? _c : {});
				const proposedScopes = (_d = options == null ? void 0 : options.scopes) != null ? _d : [];
				const proposedCaipAccountIds = (_e = options == null ? void 0 : options.caipAccountIds) != null ? _e : [];
				if (!isSameScopesAndAccounts(currentScopes, proposedScopes, walletSession, proposedCaipAccountIds)) {
					const response = yield this.request({
						method: "wallet_createSession",
						params: createSessionParams
					}, __privateGet(this, _defaultRequestOptions));
					if (response.error) throw new Error(response.error.message);
					walletSession = response.result;
				}
			} else if (!walletSession || (options == null ? void 0 : options.forceRequest)) {
				const response = yield this.request({
					method: "wallet_createSession",
					params: createSessionParams
				}, __privateGet(this, _defaultRequestOptions));
				if (response.error) throw new Error(response.error.message);
				walletSession = response.result;
			}
			__privateMethod(this, _DefaultTransport_instances, notifyCallbacks_fn).call(this, {
				method: "wallet_sessionChanged",
				params: walletSession
			});
		});
	}
	disconnect() {
		return __async(this, arguments, function* (scopes = []) {
			yield this.request({
				method: "wallet_revokeSession",
				params: { scopes }
			});
		});
	}
	isConnected() {
		return __privateGet(this, _transport).isConnected();
	}
	request(_0) {
		return __async(this, arguments, function* (request, options = __privateGet(this, _defaultRequestOptions)) {
			return __privateGet(this, _transport).request(request, options);
		});
	}
	onNotification(callback) {
		__privateGet(this, _transport).onNotification(callback);
		__privateGet(this, _notificationCallbacks).add(callback);
		return () => {
			__privateGet(this, _notificationCallbacks).delete(callback);
		};
	}
	getActiveSession() {
		return __async(this, null, function* () {
			throw new Error("getActiveSession is purposely not implemented for the DefaultTransport");
		});
	}
	getStoredPendingSessionRequest() {
		return __async(this, null, function* () {
			throw new Error("getStoredPendingSessionRequest is purposely not implemented for the DefaultTransport");
		});
	}
};
_notificationCallbacks = /* @__PURE__ */ new WeakMap();
_transport = /* @__PURE__ */ new WeakMap();
_defaultRequestOptions = /* @__PURE__ */ new WeakMap();
_pendingRequests = /* @__PURE__ */ new WeakMap();
_handleResponseListener = /* @__PURE__ */ new WeakMap();
_handleNotificationListener = /* @__PURE__ */ new WeakMap();
_DefaultTransport_instances = /* @__PURE__ */ new WeakSet();
notifyCallbacks_fn = function(data) {
	for (const callback of __privateGet(this, _notificationCallbacks)) try {
		callback(data);
	} catch (error) {
		console.log("[WindowPostMessageTransport] notifyCallbacks error:", error);
	}
};
isMetamaskProviderEvent_fn = function(event) {
	var _a2, _b;
	return ((_b = (_a2 = event == null ? void 0 : event.data) == null ? void 0 : _a2.data) == null ? void 0 : _b.name) === "metamask-provider" && event.origin === location.origin;
};
handleResponse_fn = function(event) {
	var _a2, _b;
	if (!__privateMethod(this, _DefaultTransport_instances, isMetamaskProviderEvent_fn).call(this, event)) return;
	const responseData = (_b = (_a2 = event == null ? void 0 : event.data) == null ? void 0 : _a2.data) == null ? void 0 : _b.data;
	if (typeof responseData === "object" && responseData !== null && "method" in responseData) return;
	if (typeof responseData === "object" && responseData !== null && "id" in responseData && ("result" in responseData || "error" in responseData)) {
		const responseId = String(responseData.id);
		const pendingRequest = __privateGet(this, _pendingRequests).get(responseId);
		if (pendingRequest) {
			clearTimeout(pendingRequest.timeout);
			__privateGet(this, _pendingRequests).delete(responseId);
			const response = responseData;
			if ("error" in response && response.error) {
				const error = new Error(response.error.message || "Request failed");
				if (typeof response.error.code === "number") error.code = response.error.code;
				pendingRequest.reject(error);
			} else pendingRequest.resolve(response);
		}
	}
};
handleNotification_fn = function(event) {
	var _a2, _b;
	if (!__privateMethod(this, _DefaultTransport_instances, isMetamaskProviderEvent_fn).call(this, event)) return;
	const responseData = (_b = (_a2 = event == null ? void 0 : event.data) == null ? void 0 : _a2.data) == null ? void 0 : _b.data;
	if (typeof responseData === "object" && responseData !== null && "method" in responseData) __privateMethod(this, _DefaultTransport_instances, notifyCallbacks_fn).call(this, responseData);
};
setupMessageListener_fn = function() {
	if (__privateGet(this, _handleResponseListener)) return;
	__privateSet(this, _handleResponseListener, __privateMethod(this, _DefaultTransport_instances, handleResponse_fn).bind(this));
	__privateSet(this, _handleNotificationListener, __privateMethod(this, _DefaultTransport_instances, handleNotification_fn).bind(this));
	window.addEventListener("message", __privateGet(this, _handleResponseListener));
	window.addEventListener("message", __privateGet(this, _handleNotificationListener));
};
init_fn = function() {
	return __async(this, null, function* () {
		__privateMethod(this, _DefaultTransport_instances, setupMessageListener_fn).call(this);
		if (!__privateGet(this, _transport).isConnected()) yield __privateGet(this, _transport).connect();
	});
};
init_utils();
var _notificationCallbacks2, _MultichainApiClientWrapperTransport_instances, walletCreateSession_fn, walletGetSession_fn, walletRevokeSession_fn, walletInvokeMethod_fn;
var MultichainApiClientWrapperTransport = class {
	constructor(metamaskConnectMultichain) {
		this.metamaskConnectMultichain = metamaskConnectMultichain;
		__privateAdd(this, _MultichainApiClientWrapperTransport_instances);
		__privateAdd(this, _notificationCallbacks2, /* @__PURE__ */ new Set());
	}
	isTransportDefined() {
		try {
			return Boolean(this.metamaskConnectMultichain.transport);
		} catch (_error) {
			return false;
		}
	}
	isTransportConnected() {
		return this.isTransportDefined() && this.metamaskConnectMultichain.transport.isConnected();
	}
	clearNotificationCallbacks() {
		__privateGet(this, _notificationCallbacks2).clear();
	}
	notifyCallbacks(data) {
		__privateGet(this, _notificationCallbacks2).forEach((callback) => {
			callback(data);
		});
	}
	clearTransportNotificationListener() {
		var _a2;
		(_a2 = this.notificationListener) == null || _a2.call(this);
		this.notificationListener = void 0;
	}
	setupTransportNotificationListener() {
		if (!this.isTransportDefined() || this.notificationListener) return;
		this.notificationListener = this.metamaskConnectMultichain.transport.onNotification(this.notifyCallbacks.bind(this));
	}
	connect() {
		return __async(this, null, function* () {
			return Promise.resolve();
		});
	}
	disconnect() {
		return __async(this, null, function* () {
			return Promise.resolve();
		});
	}
	isConnected() {
		return true;
	}
	request(_0) {
		return __async(this, arguments, function* (params, _options = {}) {
			const requestPayload = __spreadValues({
				id: getUniqueRequestId(),
				jsonrpc: "2.0"
			}, params);
			switch (requestPayload.method) {
				case "wallet_createSession": return __privateMethod(this, _MultichainApiClientWrapperTransport_instances, walletCreateSession_fn).call(this, requestPayload);
				case "wallet_getSession": return __privateMethod(this, _MultichainApiClientWrapperTransport_instances, walletGetSession_fn).call(this, requestPayload);
				case "wallet_revokeSession": return __privateMethod(this, _MultichainApiClientWrapperTransport_instances, walletRevokeSession_fn).call(this, requestPayload);
				case "wallet_invokeMethod": return __privateMethod(this, _MultichainApiClientWrapperTransport_instances, walletInvokeMethod_fn).call(this, requestPayload);
				default: throw new Error(`Unsupported method: ${requestPayload.method}`);
			}
		});
	}
	onNotification(callback) {
		this.setupTransportNotificationListener();
		__privateGet(this, _notificationCallbacks2).add(callback);
		return () => {
			__privateGet(this, _notificationCallbacks2).delete(callback);
		};
	}
};
_notificationCallbacks2 = /* @__PURE__ */ new WeakMap();
_MultichainApiClientWrapperTransport_instances = /* @__PURE__ */ new WeakSet();
walletCreateSession_fn = function(request) {
	return __async(this, null, function* () {
		const createSessionParams = request.params;
		const scopes = Object.keys(__spreadValues(__spreadValues({}, createSessionParams.optionalScopes), createSessionParams.requiredScopes));
		const scopeAccounts = [];
		scopes.forEach((scope) => {
			var _a2, _b, _c, _d;
			const requiredScope = (_a2 = createSessionParams.requiredScopes) == null ? void 0 : _a2[scope];
			const optionalScope = (_b = createSessionParams.optionalScopes) == null ? void 0 : _b[scope];
			if (requiredScope) scopeAccounts.push(...(_c = requiredScope.accounts) != null ? _c : []);
			if (optionalScope) scopeAccounts.push(...(_d = optionalScope.accounts) != null ? _d : []);
		});
		const accounts = [...new Set(scopeAccounts)];
		yield this.metamaskConnectMultichain.connect(scopes, accounts, createSessionParams.sessionProperties);
		return this.metamaskConnectMultichain.transport.request({ method: "wallet_getSession" });
	});
};
walletGetSession_fn = function(request) {
	return __async(this, null, function* () {
		if (!this.isTransportConnected()) return {
			jsonrpc: "2.0",
			id: request.id,
			result: { sessionScopes: {} }
		};
		return this.metamaskConnectMultichain.transport.request({ method: "wallet_getSession" });
	});
};
walletRevokeSession_fn = function(request) {
	return __async(this, null, function* () {
		var _a2;
		const revokeSessionParams = request.params;
		const scopes = (_a2 = revokeSessionParams == null ? void 0 : revokeSessionParams.scopes) != null ? _a2 : [];
		try {
			yield this.metamaskConnectMultichain.disconnect(scopes);
			return {
				jsonrpc: "2.0",
				id: request.id,
				result: true
			};
		} catch (_error) {
			return {
				jsonrpc: "2.0",
				id: request.id,
				result: false
			};
		}
	});
};
walletInvokeMethod_fn = function(request) {
	return __async(this, null, function* () {
		if (!this.isTransportConnected()) return { error: providerErrors.unauthorized() };
		return { result: this.metamaskConnectMultichain.invokeMethod(request.params) };
	});
};
init_utils();
var logger2 = createLogger("metamask-sdk:core");
var SINGLETON_KEY = "__METAMASK_CONNECT_MULTICHAIN_SINGLETON__";
var _a, _provider, _providerTransportWrapper, _transport2, _dappClient, _beforeUnloadListener, _transportType, _listener, _anonId, _sdkInfo, _MetaMaskConnectMultichain_instances, setupAnalytics_fn, onTransportNotification_fn, getStoredTransport_fn, setupTransport_fn, buildConnectionMetadata_fn, init_fn2, createDappClient_fn, setupMWP_fn, onBeforeUnload_fn, createBeforeUnloadListener_fn, renderInstallModalAsync_fn, showInstallModal_fn, headlessConnect_fn, setupDefaultTransport_fn, deeplinkConnect_fn, handleConnection_fn, getCaipSession_fn, openConnectDeeplinkIfNeeded_fn;
var _MetaMaskConnectMultichain = class _MetaMaskConnectMultichain extends MultichainCore {
	constructor(options) {
		var _a2, _b, _c, _d, _e, _f;
		const withDappMetadata = setupDappMetadata(options);
		const integrationType = ((_a2 = options.analytics) == null ? void 0 : _a2.integrationType) || "direct";
		const allOptions = __spreadProps(__spreadValues({}, withDappMetadata), {
			ui: __spreadProps(__spreadValues({}, withDappMetadata.ui), {
				preferExtension: (_b = withDappMetadata.ui.preferExtension) != null ? _b : true,
				showInstallModal: (_c = withDappMetadata.ui.showInstallModal) != null ? _c : false,
				headless: (_d = withDappMetadata.ui.headless) != null ? _d : false
			}),
			analytics: __spreadProps(__spreadValues({}, (_e = options.analytics) != null ? _e : {}), { integrationType }),
			versions: __spreadValues({ "connect-multichain": "0.13.0" }, (_f = options.versions) != null ? _f : {})
		});
		super(allOptions);
		__privateAdd(this, _MetaMaskConnectMultichain_instances);
		__privateAdd(this, _provider);
		__privateAdd(this, _providerTransportWrapper);
		__privateAdd(this, _transport2);
		__privateAdd(this, _dappClient);
		__privateAdd(this, _beforeUnloadListener);
		__privateAdd(this, _transportType);
		this._status = "pending";
		__privateAdd(this, _listener);
		__privateAdd(this, _anonId);
		__privateAdd(this, _sdkInfo, `Sdk/Javascript SdkVersion/${getVersion()} Platform/${getPlatformType()} dApp/${(_a = this.options.dapp.url) != null ? _a : this.options.dapp.name} dAppTitle/${this.options.dapp.name}`);
		__privateSet(this, _providerTransportWrapper, new MultichainApiClientWrapperTransport(this));
		__privateSet(this, _provider, getMultichainClient({ transport: __privateGet(this, _providerTransportWrapper) }));
	}
	get status() {
		return this._status;
	}
	set status(value) {
		if (this._status === value) return;
		this._status = value;
		this.emit("stateChanged", value);
	}
	get provider() {
		return __privateGet(this, _provider);
	}
	get transport() {
		if (!__privateGet(this, _transport2)) throw new Error("Transport not initialized, establish connection first");
		return __privateGet(this, _transport2);
	}
	get dappClient() {
		if (!__privateGet(this, _dappClient)) throw new Error("DappClient not initialized, establish connection first");
		return __privateGet(this, _dappClient);
	}
	get transportType() {
		var _a2;
		return (_a2 = __privateGet(this, _transportType)) != null ? _a2 : "unknown";
	}
	get storage() {
		return this.options.storage;
	}
	static create(options) {
		return __async(this, null, function* () {
			var _a2, _b;
			const globalObject = getGlobalObject();
			const existing = globalObject[SINGLETON_KEY];
			if (existing) {
				const instance = yield existing;
				instance.mergeOptions(options);
				analytics.setGlobalProperty("mmconnect_versions", (_a2 = instance.options.versions) != null ? _a2 : {});
				if ((_b = options.analytics) == null ? void 0 : _b.integrationType) analytics.setGlobalProperty("integration_types", [options.analytics.integrationType]);
				if (options.debug) enableDebug("metamask-sdk:*");
				return instance;
			}
			const instancePromise = (() => __async(null, null, function* () {
				var _a3;
				const instance = new _MetaMaskConnectMultichain(options);
				if (yield isEnabled("metamask-sdk:core", instance.options.storage)) enableDebug("metamask-sdk:core");
				yield __privateMethod(_a3 = instance, _MetaMaskConnectMultichain_instances, init_fn2).call(_a3);
				return instance;
			}))();
			globalObject[SINGLETON_KEY] = instancePromise;
			instancePromise.catch((error) => {
				globalObject[SINGLETON_KEY] = void 0;
				console.error("Error initializing MetaMaskConnectMultichain", error);
			});
			return instancePromise;
		});
	}
	connect(scopes, caipAccountIds, sessionProperties, forceRequest) {
		return __async(this, null, function* () {
			var _a2;
			if (this.status === "connecting" && __privateGet(this, _transportType) === "mwp") {
				yield __privateMethod(this, _MetaMaskConnectMultichain_instances, openConnectDeeplinkIfNeeded_fn).call(this);
				throw new Error("Existing connection is pending. Please check your MetaMask Mobile app to continue.");
			}
			const { ui } = this.options;
			const platformType = getPlatformType();
			const isWeb = platformType === "in-app-browser" || platformType === "web-desktop";
			const { preferExtension = true, showInstallModal = false } = ui;
			const secure = isSecure();
			const hasExtensionInstalled = yield hasExtension();
			let transportType;
			if (platformType === "in-app-browser" || isWeb && hasExtensionInstalled && preferExtension) transportType = "browser";
			else transportType = "mwp";
			try {
				const baseProps = yield getBaseAnalyticsProperties(this.options, this.storage);
				const dappConfiguredChains = Object.keys(this.options.api.supportedNetworks);
				analytics.track("mmconnect_connection_initiated", __spreadProps(__spreadValues({}, baseProps), {
					transport_type: transportType,
					dapp_configured_chains: dappConfiguredChains,
					dapp_requested_chains: scopes
				}));
			} catch (error) {
				logger2("Error tracking connection_initiated event", error);
			}
			const { mergedScopes, mergedCaipAccountIds, mergedSessionProperties } = mergeRequestedSessionWithExisting(yield __privateMethod(this, _MetaMaskConnectMultichain_instances, getCaipSession_fn).call(this), scopes, caipAccountIds, sessionProperties);
			const nonEmptySessionProperties = Object.keys(mergedSessionProperties != null ? mergedSessionProperties : {}).length > 0 ? mergedSessionProperties : void 0;
			if (((_a2 = __privateGet(this, _transport2)) == null ? void 0 : _a2.isConnected()) && !secure) return __privateMethod(this, _MetaMaskConnectMultichain_instances, handleConnection_fn).call(this, __privateGet(this, _transport2).connect({
				scopes: mergedScopes,
				caipAccountIds: mergedCaipAccountIds,
				sessionProperties: nonEmptySessionProperties,
				forceRequest
			}).then(() => __async(this, null, function* () {
				if (__privateGet(this, _transportType) === "mwp") return this.storage.setTransport("mwp");
				return this.storage.setTransport("browser");
			})), scopes, transportType);
			if (platformType === "in-app-browser") {
				const defaultTransport = yield __privateMethod(this, _MetaMaskConnectMultichain_instances, setupDefaultTransport_fn).call(this);
				return __privateMethod(this, _MetaMaskConnectMultichain_instances, handleConnection_fn).call(this, defaultTransport.connect({
					scopes: mergedScopes,
					caipAccountIds: mergedCaipAccountIds,
					sessionProperties: nonEmptySessionProperties,
					forceRequest
				}), scopes, transportType);
			}
			if (isWeb && hasExtensionInstalled && preferExtension) {
				const defaultTransport = yield __privateMethod(this, _MetaMaskConnectMultichain_instances, setupDefaultTransport_fn).call(this);
				return __privateMethod(this, _MetaMaskConnectMultichain_instances, handleConnection_fn).call(this, defaultTransport.connect({
					scopes: mergedScopes,
					caipAccountIds: mergedCaipAccountIds,
					sessionProperties: nonEmptySessionProperties,
					forceRequest
				}), scopes, transportType);
			}
			yield __privateMethod(this, _MetaMaskConnectMultichain_instances, setupMWP_fn).call(this);
			const shouldShowInstallModal = hasExtensionInstalled ? showInstallModal : !preferExtension || showInstallModal;
			if (secure && !shouldShowInstallModal) return __privateMethod(this, _MetaMaskConnectMultichain_instances, handleConnection_fn).call(this, __privateMethod(this, _MetaMaskConnectMultichain_instances, deeplinkConnect_fn).call(this, mergedScopes, mergedCaipAccountIds, nonEmptySessionProperties), scopes, transportType);
			return __privateMethod(this, _MetaMaskConnectMultichain_instances, handleConnection_fn).call(this, __privateMethod(this, _MetaMaskConnectMultichain_instances, showInstallModal_fn).call(this, shouldShowInstallModal, mergedScopes, mergedCaipAccountIds, nonEmptySessionProperties), scopes, transportType);
		});
	}
	emit(event, args) {
		var _a2, _b;
		(_b = (_a2 = this.options.transport) == null ? void 0 : _a2.onNotification) == null || _b.call(_a2, {
			method: event,
			params: args
		});
		super.emit(event, args);
	}
	disconnect() {
		return __async(this, arguments, function* (scopes = []) {
			var _a2, _b, _c;
			const sessionData = yield __privateMethod(this, _MetaMaskConnectMultichain_instances, getCaipSession_fn).call(this);
			const remainingScopes = scopes.length === 0 ? [] : Object.keys(sessionData.sessionScopes).filter((scope) => !scopes.includes(scope));
			yield (_a2 = __privateGet(this, _transport2)) == null ? void 0 : _a2.disconnect(scopes);
			if (remainingScopes.length === 0) {
				yield this.storage.removeTransport();
				if (__privateGet(this, _transportType) !== "browser") {
					yield (_b = __privateGet(this, _listener)) == null ? void 0 : _b.call(this);
					(_c = __privateGet(this, _beforeUnloadListener)) == null || _c.call(this);
					__privateSet(this, _listener, void 0);
					__privateSet(this, _beforeUnloadListener, void 0);
					__privateSet(this, _transport2, void 0);
					__privateSet(this, _transportType, void 0);
					__privateGet(this, _providerTransportWrapper).clearTransportNotificationListener();
					__privateSet(this, _dappClient, void 0);
				}
				this.status = "disconnected";
			}
		});
	}
	invokeMethod(request) {
		return __async(this, null, function* () {
			var _a2;
			const { transport, options } = this;
			return new RequestRouter(transport, new RpcClient(options, __privateGet(this, _sdkInfo)), options, (_a2 = __privateGet(this, _transportType)) != null ? _a2 : "unknown").invokeMethod(request);
		});
	}
	openSimpleDeeplinkIfNeeded() {
		const { ui, mobile } = this.options;
		const { showInstallModal = false } = ui != null ? ui : {};
		if (isSecure() && !showInstallModal) setTimeout(() => __async(this, null, function* () {
			const session = yield this.transport.getActiveSession();
			if (!session) throw new Error("No active session found");
			const url = `${METAMASK_DEEPLINK_BASE}/mwp?id=${encodeURIComponent(session.id)}`;
			if (mobile == null ? void 0 : mobile.preferredOpenLink) mobile.preferredOpenLink(url, "_self");
			else openDeeplink(this.options, url, METAMASK_CONNECT_BASE_URL);
		}), 10);
	}
	emitSessionChanged() {
		return __async(this, null, function* () {
			var _a2, _b;
			const emptySession = { sessionScopes: {} };
			if (!((_a2 = __privateGet(this, _transport2)) == null ? void 0 : _a2.isConnected())) {
				this.emit("wallet_sessionChanged", emptySession);
				return;
			}
			const response = yield this.transport.request({ method: "wallet_getSession" });
			this.emit("wallet_sessionChanged", (_b = response.result) != null ? _b : emptySession);
		});
	}
};
_provider = /* @__PURE__ */ new WeakMap();
_providerTransportWrapper = /* @__PURE__ */ new WeakMap();
_transport2 = /* @__PURE__ */ new WeakMap();
_dappClient = /* @__PURE__ */ new WeakMap();
_beforeUnloadListener = /* @__PURE__ */ new WeakMap();
_transportType = /* @__PURE__ */ new WeakMap();
_listener = /* @__PURE__ */ new WeakMap();
_anonId = /* @__PURE__ */ new WeakMap();
_sdkInfo = /* @__PURE__ */ new WeakMap();
_MetaMaskConnectMultichain_instances = /* @__PURE__ */ new WeakSet();
setupAnalytics_fn = function() {
	return __async(this, null, function* () {
		var _a2, _b;
		const platform = getPlatformType();
		if (!(platform === "in-app-browser" || platform === "web-desktop" || platform === "web-mobile") && !(platform === "react-native")) return;
		const dappId = getDappId(this.options.dapp);
		const anonId = yield this.storage.getAnonId();
		__privateSet(this, _anonId, anonId);
		const { integrationType } = (_a2 = this.options.analytics) != null ? _a2 : { integrationType: "" };
		analytics.setGlobalProperty("mmconnect_versions", (_b = this.options.versions) != null ? _b : {});
		analytics.setGlobalProperty("dapp_id", dappId);
		analytics.setGlobalProperty("anon_id", anonId);
		analytics.setGlobalProperty("platform", platform);
		if (integrationType) analytics.setGlobalProperty("integration_types", [integrationType]);
		analytics.enable();
	});
};
onTransportNotification_fn = function(payload) {
	return __async(this, null, function* () {
		var _a2, _b, _c;
		if (typeof payload === "object" && payload !== null && "method" in payload) {
			if (payload.method === "wallet_sessionChanged") {
				const sessionScopes = (_b = (_a2 = payload.params) == null ? void 0 : _a2.sessionScopes) != null ? _b : {};
				const hasScopes = Object.keys(sessionScopes).length > 0;
				if (this.status === "loaded" && !hasScopes) return;
				this.status = hasScopes ? "connected" : "disconnected";
			}
			this.emit(payload.method, (_c = payload.params) != null ? _c : payload.result);
		}
	});
};
getStoredTransport_fn = function() {
	return __async(this, null, function* () {
		const transportType = yield this.storage.getTransport();
		const hasExtensionInstalled = yield hasExtension();
		if (transportType) {
			if (transportType === "browser") {
				if (hasExtensionInstalled) {
					const apiTransport = new DefaultTransport();
					__privateSet(this, _transport2, apiTransport);
					__privateSet(this, _transportType, "browser");
					__privateGet(this, _providerTransportWrapper).setupTransportNotificationListener();
					__privateSet(this, _listener, apiTransport.onNotification(__privateMethod(this, _MetaMaskConnectMultichain_instances, onTransportNotification_fn).bind(this)));
					return apiTransport;
				}
			} else if (transportType === "mwp") {
				const { adapter: kvstore } = this.options.storage;
				const dappClient = yield __privateMethod(this, _MetaMaskConnectMultichain_instances, createDappClient_fn).call(this);
				const { MWPTransport: MWPTransport2 } = yield Promise.resolve().then(() => (init_mwp(), mwp_exports));
				const apiTransport = new MWPTransport2(dappClient, kvstore);
				__privateSet(this, _dappClient, dappClient);
				__privateSet(this, _transport2, apiTransport);
				__privateSet(this, _transportType, "mwp");
				__privateGet(this, _providerTransportWrapper).setupTransportNotificationListener();
				__privateSet(this, _listener, apiTransport.onNotification(__privateMethod(this, _MetaMaskConnectMultichain_instances, onTransportNotification_fn).bind(this)));
				return apiTransport;
			}
			yield this.storage.removeTransport();
		}
	});
};
setupTransport_fn = function() {
	return __async(this, null, function* () {
		var _a2;
		if (yield __privateMethod(this, _MetaMaskConnectMultichain_instances, getStoredTransport_fn).call(this)) {
			if (!this.transport.isConnected()) {
				this.status = "connecting";
				yield this.transport.connect();
			}
			this.status = "connected";
			if (__privateGet(this, _transportType) === "mwp") yield this.storage.setTransport("mwp");
			else yield this.storage.setTransport("browser");
		} else {
			this.status = "loaded";
			const hasExtensionInstalled = yield hasExtension();
			const preferExtension = (_a2 = this.options.ui.preferExtension) != null ? _a2 : true;
			if (hasExtensionInstalled && preferExtension) {
				yield __privateMethod(this, _MetaMaskConnectMultichain_instances, setupDefaultTransport_fn).call(this, { persist: false });
				try {
					yield this.transport.init();
				} catch (error) {
					console.error("Passive init failed:", error);
				}
			}
		}
	});
};
buildConnectionMetadata_fn = function() {
	const metadata = {
		dapp: this.options.dapp,
		sdk: {
			version: getVersion(),
			platform: getPlatformType()
		}
	};
	if (__privateGet(this, _anonId)) metadata.analytics = { remote_session_id: __privateGet(this, _anonId) };
	return metadata;
};
init_fn2 = function() {
	return __async(this, null, function* () {
		try {
			yield __privateMethod(this, _MetaMaskConnectMultichain_instances, setupAnalytics_fn).call(this);
			yield __privateMethod(this, _MetaMaskConnectMultichain_instances, setupTransport_fn).call(this);
		} catch (error) {
			yield this.storage.removeTransport();
			this.status = "pending";
			logger2("MetaMaskSDK error during initialization", error);
		}
	});
};
createDappClient_fn = function() {
	return __async(this, null, function* () {
		const [mwpCore, { DappClient: DappClientClass }, { createKeyManager: createKeyManager2 }] = yield Promise.all([
			import("./mobile-wallet-protocol-core+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t(), 1)),
			import("./mobile-wallet-protocol-dapp-client+[...].mjs").then((n) => n.t),
			Promise.resolve().then(() => (init_KeyManager(), KeyManager_exports))
		]);
		const keymanager = yield createKeyManager2();
		const { adapter: kvstore } = this.options.storage;
		const sessionstore = yield mwpCore.SessionStore.create(kvstore);
		const websocket = typeof window !== "undefined" ? WebSocket : (yield import("../@coral-xyz/anchor.mjs").then((n) => (n.N(), n.P))).WebSocket;
		return new DappClientClass({
			transport: yield mwpCore.WebSocketTransport.create({
				url: MWP_RELAY_URL,
				kvstore,
				websocket
			}),
			sessionstore,
			keymanager
		});
	});
};
setupMWP_fn = function() {
	return __async(this, null, function* () {
		if (__privateGet(this, _transportType) === "mwp") return;
		const { adapter: kvstore } = this.options.storage;
		const dappClient = yield __privateMethod(this, _MetaMaskConnectMultichain_instances, createDappClient_fn).call(this);
		__privateSet(this, _dappClient, dappClient);
		const { MWPTransport: MWPTransport2 } = yield Promise.resolve().then(() => (init_mwp(), mwp_exports));
		const apiTransport = new MWPTransport2(dappClient, kvstore);
		__privateSet(this, _transport2, apiTransport);
		__privateSet(this, _transportType, "mwp");
		__privateGet(this, _providerTransportWrapper).setupTransportNotificationListener();
		__privateSet(this, _listener, this.transport.onNotification(__privateMethod(this, _MetaMaskConnectMultichain_instances, onTransportNotification_fn).bind(this)));
		yield this.storage.setTransport("mwp");
	});
};
onBeforeUnload_fn = function() {
	return __async(this, null, function* () {
		var _a2;
		if ((_a2 = this.options.ui.factory.modal) == null ? void 0 : _a2.isMounted) yield this.storage.removeTransport();
	});
};
createBeforeUnloadListener_fn = function() {
	const handler = __privateMethod(this, _MetaMaskConnectMultichain_instances, onBeforeUnload_fn).bind(this);
	if (typeof window !== "undefined" && typeof window.addEventListener !== "undefined") window.addEventListener("beforeunload", handler);
	return () => {
		if (typeof window !== "undefined" && typeof window.removeEventListener !== "undefined") window.removeEventListener("beforeunload", handler);
	};
};
renderInstallModalAsync_fn = function(desktopPreferred, scopes, caipAccountIds, sessionProperties) {
	return __async(this, null, function* () {
		return new Promise((resolve, reject) => {
			this.options.ui.factory.renderInstallModal(desktopPreferred, () => __async(this, null, function* () {
				if (this.dappClient.state === "CONNECTED" || this.dappClient.state === "CONNECTING") yield this.dappClient.disconnect();
				return new Promise((_resolve) => {
					this.dappClient.on("session_request", (sessionRequest) => {
						_resolve({
							sessionRequest,
							metadata: __privateMethod(this, _MetaMaskConnectMultichain_instances, buildConnectionMetadata_fn).call(this)
						});
					});
					(() => __async(this, null, function* () {
						var _a2;
						try {
							yield this.transport.connect({
								scopes,
								caipAccountIds,
								sessionProperties
							});
							yield this.options.ui.factory.unload();
							(_a2 = this.options.ui.factory.modal) == null || _a2.unmount();
							this.status = "connected";
							yield this.storage.setTransport("mwp");
						} catch (error) {
							const { ProtocolError, ErrorCode } = yield import("./mobile-wallet-protocol-core+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
							if (error instanceof ProtocolError) {
								if (error.code !== ErrorCode.REQUEST_EXPIRED) {
									this.status = "disconnected";
									yield this.options.ui.factory.unload(error);
									reject(error);
								}
							} else {
								this.status = "disconnected";
								const normalizedError = error instanceof Error ? error : new Error(String(error));
								yield this.options.ui.factory.unload(normalizedError);
								reject(normalizedError);
							}
						}
					}))().catch(() => {});
				});
			}), (error) => __async(this, null, function* () {
				if (error) {
					yield this.storage.removeTransport();
					reject(error);
				} else {
					yield this.storage.setTransport("mwp");
					resolve();
				}
			}), (uri) => {
				this.emit("display_uri", uri);
			}).catch((error) => {
				reject(error instanceof Error ? error : new Error(String(error)));
			});
		});
	});
};
showInstallModal_fn = function(desktopPreferred, scopes, caipAccountIds, sessionProperties) {
	return __async(this, null, function* () {
		__privateGet(this, _beforeUnloadListener) ?? __privateSet(this, _beforeUnloadListener, __privateMethod(this, _MetaMaskConnectMultichain_instances, createBeforeUnloadListener_fn).call(this));
		if (this.options.ui.headless) yield __privateMethod(this, _MetaMaskConnectMultichain_instances, headlessConnect_fn).call(this, scopes, caipAccountIds, sessionProperties);
		else yield __privateMethod(this, _MetaMaskConnectMultichain_instances, renderInstallModalAsync_fn).call(this, desktopPreferred, scopes, caipAccountIds, sessionProperties);
	});
};
headlessConnect_fn = function(scopes, caipAccountIds, sessionProperties) {
	return __async(this, null, function* () {
		return new Promise((resolve, reject) => {
			if (this.dappClient.state === "CONNECTED" || this.dappClient.state === "CONNECTING") this.dappClient.disconnect().catch(() => {});
			this.dappClient.on("session_request", (sessionRequest) => {
				const connectionRequest = {
					sessionRequest,
					metadata: __privateMethod(this, _MetaMaskConnectMultichain_instances, buildConnectionMetadata_fn).call(this)
				};
				const deeplink = this.options.ui.factory.createConnectionDeeplink(connectionRequest);
				this.emit("display_uri", deeplink);
			});
			this.transport.connect({
				scopes,
				caipAccountIds,
				sessionProperties
			}).then(() => __async(this, null, function* () {
				this.status = "connected";
				yield this.storage.setTransport("mwp");
				resolve();
			})).catch((error) => __async(this, null, function* () {
				const { ProtocolError } = yield import("./mobile-wallet-protocol-core+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
				if (error instanceof ProtocolError) {
					this.status = "disconnected";
					yield this.storage.removeTransport();
					reject(error);
				} else {
					this.status = "disconnected";
					yield this.storage.removeTransport();
					reject(error instanceof Error ? error : new Error(String(error)));
				}
			}));
		});
	});
};
setupDefaultTransport_fn = function() {
	return __async(this, arguments, function* (options = { persist: true }) {
		if (__privateGet(this, _transportType) === "browser") return __privateGet(this, _transport2);
		if (options == null ? void 0 : options.persist) yield this.storage.setTransport("browser");
		const transport = new DefaultTransport();
		__privateSet(this, _listener, transport.onNotification(__privateMethod(this, _MetaMaskConnectMultichain_instances, onTransportNotification_fn).bind(this)));
		__privateSet(this, _transport2, transport);
		__privateSet(this, _transportType, "browser");
		__privateGet(this, _providerTransportWrapper).setupTransportNotificationListener();
		return transport;
	});
};
deeplinkConnect_fn = function(scopes, caipAccountIds, sessionProperties) {
	return __async(this, null, function* () {
		return new Promise((resolve, reject) => __async(this, null, function* () {
			const dappClientMessageHandler = (payload) => {
				var _a2;
				if (typeof payload !== "object" || payload === null || !("data" in payload)) return;
				const data = payload.data;
				if (typeof data === "object" && data !== null) {
					if (data.error) {
						this.dappClient.off("message", dappClientMessageHandler);
						reject(data.error);
					}
					if ((_a2 = data == null ? void 0 : data.result) == null ? void 0 : _a2.sessionScopes) this.dappClient.off("message", dappClientMessageHandler);
				}
			};
			this.dappClient.on("message", dappClientMessageHandler);
			let timeout;
			if (this.transport.isConnected()) timeout = setTimeout(() => {
				this.openSimpleDeeplinkIfNeeded();
			}, 250);
			else this.dappClient.once("session_request", (sessionRequest) => {
				var _a2;
				const connectionRequest = {
					sessionRequest,
					metadata: __privateMethod(this, _MetaMaskConnectMultichain_instances, buildConnectionMetadata_fn).call(this)
				};
				const deeplink = this.options.ui.factory.createConnectionDeeplink(connectionRequest);
				const universalLink = this.options.ui.factory.createConnectionUniversalLink(connectionRequest);
				this.emit("display_uri", deeplink);
				if ((_a2 = this.options.mobile) == null ? void 0 : _a2.preferredOpenLink) this.options.mobile.preferredOpenLink(deeplink, "_self");
				else openDeeplink(this.options, deeplink, universalLink);
			});
			return this.transport.connect({
				scopes,
				caipAccountIds,
				sessionProperties
			}).then(resolve).catch((error) => __async(this, null, function* () {
				yield this.storage.removeTransport();
				this.dappClient.off("message", dappClientMessageHandler);
				reject(error instanceof Error ? error : new Error(String(error)));
			})).finally(() => {
				if (timeout) clearTimeout(timeout);
			});
		}));
	});
};
handleConnection_fn = function(promise, scopes, transportType) {
	return __async(this, null, function* () {
		this.status = "connecting";
		return promise.then(() => __async(this, null, function* () {
			this.status = "connected";
			try {
				const baseProps = yield getBaseAnalyticsProperties(this.options, this.storage);
				analytics.track("mmconnect_connection_established", __spreadProps(__spreadValues({}, baseProps), {
					transport_type: transportType,
					user_permissioned_chains: scopes
				}));
			} catch (error) {
				logger2("Error tracking connection_established event", error);
			}
		})).catch((error) => __async(this, null, function* () {
			this.status = "disconnected";
			try {
				const baseProps = yield getBaseAnalyticsProperties(this.options, this.storage);
				if (isRejectionError(error)) analytics.track("mmconnect_connection_rejected", __spreadProps(__spreadValues({}, baseProps), { transport_type: transportType }));
				else analytics.track("mmconnect_connection_failed", __spreadProps(__spreadValues({}, baseProps), { transport_type: transportType }));
			} catch (e) {
				logger2("Error tracking connection failed/rejected event", error);
			}
			throw error;
		}));
	});
};
getCaipSession_fn = function() {
	return __async(this, null, function* () {
		var _a2;
		let sessionData = {
			sessionScopes: {},
			sessionProperties: {}
		};
		if ((_a2 = __privateGet(this, _transport2)) == null ? void 0 : _a2.isConnected()) try {
			const response = yield this.transport.request({ method: "wallet_getSession" });
			if (response.result) sessionData = response.result;
		} catch (e) {}
		return sessionData;
	});
};
openConnectDeeplinkIfNeeded_fn = function() {
	return __async(this, null, function* () {
		var _a2, _b;
		const { ui } = this.options;
		const { showInstallModal = false } = ui != null ? ui : {};
		if (!(isSecure() && !showInstallModal)) return;
		const storedSessionRequest = yield (_a2 = __privateGet(this, _transport2)) == null ? void 0 : _a2.getStoredPendingSessionRequest();
		if (!storedSessionRequest) return;
		const connectionRequest = {
			sessionRequest: storedSessionRequest,
			metadata: __privateMethod(this, _MetaMaskConnectMultichain_instances, buildConnectionMetadata_fn).call(this)
		};
		const deeplink = this.options.ui.factory.createConnectionDeeplink(connectionRequest);
		const universalLink = this.options.ui.factory.createConnectionUniversalLink(connectionRequest);
		if ((_b = this.options.mobile) == null ? void 0 : _b.preferredOpenLink) this.options.mobile.preferredOpenLink(deeplink, "_self");
		else openDeeplink(this.options, deeplink, universalLink);
	});
};
var MetaMaskConnectMultichain = _MetaMaskConnectMultichain;
init_base();
var _StorageGetErr = class _StorageGetErr extends BaseErr {
	constructor(platform, key, reason) {
		super(`StorageErr${_StorageGetErr.code}: ${platform} storage get error in key: ${key} - ${reason}`, _StorageGetErr.code);
		this.platform = platform;
		this.key = key;
		this.reason = reason;
	}
};
_StorageGetErr.code = 60;
var StorageGetErr = _StorageGetErr;
var _StorageSetErr = class _StorageSetErr extends BaseErr {
	constructor(platform, key, reason) {
		super(`StorageErr${_StorageSetErr.code}: ${platform} storage set error in key: ${key} - ${reason}`, _StorageSetErr.code);
		this.platform = platform;
		this.key = key;
		this.reason = reason;
	}
};
_StorageSetErr.code = 61;
var StorageSetErr = _StorageSetErr;
var _StorageDeleteErr = class _StorageDeleteErr extends BaseErr {
	constructor(platform, key, reason) {
		super(`StorageErr${_StorageDeleteErr.code}: ${platform} storage delete error in key: ${key} - ${reason}`, _StorageDeleteErr.code);
		this.platform = platform;
		this.key = key;
		this.reason = reason;
	}
};
_StorageDeleteErr.code = 62;
var StorageDeleteErr = _StorageDeleteErr;
init_multichain();
init_client();
var Store = class extends StoreClient {
	constructor(adapter) {
		super();
		this.adapter = adapter;
	}
	getTransport() {
		return __async(this, null, function* () {
			try {
				const transport = yield this.adapter.get("multichain-transport");
				if (!transport) return null;
				return getTransportType(transport);
			} catch (err) {
				throw new StorageGetErr(this.adapter.platform, "multichain-transport", err.message);
			}
		});
	}
	setTransport(transport) {
		return __async(this, null, function* () {
			try {
				yield this.adapter.set("multichain-transport", transport);
			} catch (err) {
				throw new StorageSetErr(this.adapter.platform, "multichain-transport", err.message);
			}
		});
	}
	removeTransport() {
		return __async(this, null, function* () {
			try {
				yield this.adapter.delete("multichain-transport");
			} catch (err) {
				throw new StorageDeleteErr(this.adapter.platform, "multichain-transport", err.message);
			}
		});
	}
	getAnonId() {
		return __async(this, null, function* () {
			try {
				const anonId = yield this.adapter.get("anonId");
				if (anonId) return anonId;
				const newAnonId = v4();
				yield this.adapter.set("anonId", newAnonId);
				return newAnonId;
			} catch (err) {
				throw new StorageGetErr(this.adapter.platform, "anonId", err.message);
			}
		});
	}
	getExtensionId() {
		return __async(this, null, function* () {
			try {
				return yield this.adapter.get("extensionId");
			} catch (err) {
				throw new StorageGetErr(this.adapter.platform, "extensionId", err.message);
			}
		});
	}
	setAnonId(anonId) {
		return __async(this, null, function* () {
			try {
				return yield this.adapter.set("anonId", anonId);
			} catch (err) {
				throw new StorageSetErr(this.adapter.platform, "anonId", err.message);
			}
		});
	}
	setExtensionId(extensionId) {
		return __async(this, null, function* () {
			try {
				return yield this.adapter.set("extensionId", extensionId);
			} catch (err) {
				throw new StorageSetErr(this.adapter.platform, "extensionId", err.message);
			}
		});
	}
	removeExtensionId() {
		return __async(this, null, function* () {
			try {
				return yield this.adapter.delete("extensionId");
			} catch (err) {
				throw new StorageDeleteErr(this.adapter.platform, "extensionId", err.message);
			}
		});
	}
	removeAnonId() {
		return __async(this, null, function* () {
			try {
				return yield this.adapter.delete("anonId");
			} catch (err) {
				throw new StorageDeleteErr(this.adapter.platform, "anonId", err.message);
			}
		});
	}
	getDebug() {
		return __async(this, null, function* () {
			try {
				return yield this.adapter.get("DEBUG");
			} catch (err) {
				throw new StorageGetErr(this.adapter.platform, "DEBUG", err.message);
			}
		});
	}
};
init_domain();
init_utils();
var BaseModalFactory = class {
	/**
	* Creates a new modal factory instance.
	*
	* @param options - The modals configuration object
	*/
	constructor(options) {
		this.options = options;
		this.platform = getPlatformType();
		this.validateModals();
	}
	validateModals() {
		const missingModals = ["InstallModal", "OTPCodeModal"].filter((modal) => !this.options[modal]);
		if (missingModals.length > 0) throw new Error(`Missing required modals: ${missingModals.join(", ")}`);
	}
	unload(error) {
		return __async(this, null, function* () {
			var _a2, _b;
			(_a2 = this.modal) == null || _a2.unmount();
			yield (_b = this.successCallback) == null ? void 0 : _b.call(this, error);
		});
	}
	/**
	* Determines if the current platform is a mobile native environment.
	* Currently only includes React Native.
	*/
	get isMobile() {
		return this.platform === "react-native";
	}
	/**
	* Determines if the current platform is a Node.js environment.
	* Used for server-side or non-browser environments.
	*/
	get isNode() {
		return this.platform === "nodejs";
	}
	/**
	* Determines if the current platform is a web environment.
	* Includes desktop web, MetaMask mobile webview, and mobile web.
	*/
	get isWeb() {
		return this.platform === "web-desktop" || this.platform === "in-app-browser" || this.platform === "web-mobile";
	}
	getContainer() {
		return typeof document === "undefined" ? void 0 : document.createElement("div");
	}
	getMountedContainer() {
		if (typeof document === "undefined") return;
		const container = this.getContainer();
		if (container) document.body.appendChild(container);
		return container;
	}
	createConnectionDeeplink(connectionRequest) {
		if (!connectionRequest) throw new Error("createConnectionDeeplink can only be called with a connection request");
		const compressed = compressString(JSON.stringify(connectionRequest));
		return `${METAMASK_DEEPLINK_BASE}/mwp?p=${encodeURIComponent(compressed)}&c=1`;
	}
	createConnectionUniversalLink(connectionRequest) {
		if (!connectionRequest) return `${METAMASK_CONNECT_BASE_URL}`;
		const compressed = compressString(JSON.stringify(connectionRequest));
		return `${METAMASK_CONNECT_BASE_URL}/mwp?p=${encodeURIComponent(compressed)}&c=1`;
	}
	onCloseModal(shouldTerminate = true) {
		return __async(this, null, function* () {
			return this.unload(shouldTerminate ? /* @__PURE__ */ new Error("User closed modal") : void 0);
		});
	}
	onStartDesktopOnboarding() {
		new Onboarding().startOnboarding();
	}
	renderInstallModal(showInstallModal, createConnectionRequest, successCallback, onDisplayUri) {
		return __async(this, null, function* () {
			var _a2, _b;
			(_a2 = this.modal) == null || _a2.unmount();
			yield this.preload();
			this.successCallback = successCallback;
			this.displayUriCallback = onDisplayUri;
			const parentElement = this.getMountedContainer();
			const connectionRequest = yield createConnectionRequest();
			const qrCodeLink = this.createConnectionDeeplink(connectionRequest);
			(_b = this.displayUriCallback) == null || _b.call(this, qrCodeLink);
			const modal = new this.options.InstallModal({
				expiresIn: (connectionRequest.sessionRequest.expiresAt - Date.now()) / 1e3,
				connectionRequest,
				parentElement,
				showInstallModal,
				link: qrCodeLink,
				generateQRCode: (request) => __async(this, null, function* () {
					var _a3;
					const newLink = this.createConnectionDeeplink(request);
					(_a3 = this.displayUriCallback) == null || _a3.call(this, newLink);
					return newLink;
				}),
				onClose: this.onCloseModal.bind(this),
				startDesktopOnboarding: this.onStartDesktopOnboarding.bind(this),
				createConnectionRequest,
				onDisplayUri: this.displayUriCallback
			});
			this.modal = modal;
			modal.mount();
		});
	}
	renderOTPCodeModal(createOTPCode, successCallback, updateOTPCode) {
		return __async(this, null, function* () {
			var _a2;
			(_a2 = this.modal) == null || _a2.unmount();
			yield this.preload();
			this.successCallback = successCallback;
			const container = this.getMountedContainer();
			const otpCode = yield createOTPCode();
			const modal = new this.options.OTPCodeModal({
				parentElement: container,
				otpCode,
				onClose: this.onCloseModal.bind(this),
				createOTPCode,
				updateOTPCode: (otpCode2) => updateOTPCode(otpCode2, modal)
			});
			this.modal = modal;
			modal.mount();
		});
	}
};
function preload() {
	return __async(this, null, function* () {
		if (typeof document === "undefined") return;
		try {
			const { defineCustomElements } = yield import("../metamask__multichain-ui.mjs").then((n) => n.t);
			yield defineCustomElements();
		} catch (error) {
			console.error("Failed to load customElements:", error);
		}
	});
}
var ModalFactory = class extends BaseModalFactory {
	preload() {
		return __async(this, null, function* () {
			return preload();
		});
	}
};
init_domain();
var createMultichainClient = (options) => __async(null, null, function* () {
	if (options.debug) enableDebug("metamask-sdk:*");
	const uiModules = yield Promise.resolve().then(() => (init_node(), node_exports));
	let storage;
	if (options.storage) storage = options.storage;
	else {
		const { StoreAdapterNode: StoreAdapterNode2 } = yield Promise.resolve().then(() => (init_node2(), node_exports2));
		storage = new Store(new StoreAdapterNode2());
	}
	const factory = new ModalFactory(uiModules);
	return MetaMaskConnectMultichain.create(__spreadProps(__spreadValues({}, options), {
		storage,
		ui: __spreadProps(__spreadValues({}, options.ui), { factory })
	}));
});
//#endregion
export { createMultichainClient as n, v4 as r, createLogger as t };
