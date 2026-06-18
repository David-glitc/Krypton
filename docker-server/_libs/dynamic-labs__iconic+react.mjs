import { r as __exportAll, s as __toESM, t as __commonJSMin } from "../_runtime.mjs";
import { J as Logger, T as getIconicSpriteUrl } from "./@dynamic-labs-connectors/metamask-solana+[...].mjs";
//#region ../../node_modules/.pnpm/react@19.2.7/node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, assign = Object.assign, emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	}, hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result;
			ctor = ctor();
			ctor.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject;
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error;
			});
			-1 === payload._status && (payload._status = 0, payload._result = ctor);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	}, Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = function(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	};
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.2.7";
}));
//#endregion
//#region ../../node_modules/.pnpm/react@19.2.7/node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/Iconic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var ICONIC_SPRITE_URL = getIconicSpriteUrl();
var createIconic = (props) => {
	const Icon = Object.assign(Object.assign({}, props), { function: (props) => {
		const url = `${ICONIC_SPRITE_URL}#${Icon.iconName}`;
		return (0, import_react.createElement)("img", Object.assign(Object.assign({ "data-testid": `iconic-${Icon.iconName}` }, props), {
			alt: Icon.alt,
			src: url
		}));
	} });
	const IconicComponent = Icon.function.bind(Icon);
	Object.assign(IconicComponent, {
		iconName: Icon.iconName,
		sourcePath: Icon.sourcePath
	});
	return IconicComponent;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/icons/browsers/index.js
var BraveIcon = createIconic({
	alt: "Brave Browser",
	iconName: "brave",
	sourcePath: "icons/browsers/brave.svg"
});
var ChromeIcon = createIconic({
	alt: "Chrome Browser",
	iconName: "chrome",
	sourcePath: "icons/browsers/chrome.svg"
});
var EdgeIcon = createIconic({
	alt: "Edge Browser",
	iconName: "edge",
	sourcePath: "icons/browsers/edge.svg"
});
var FirefoxIcon = createIconic({
	alt: "Firefox Browser",
	iconName: "firefox",
	sourcePath: "icons/browsers/firefox.svg"
});
var OperaIcon = createIconic({
	alt: "Opera Browser",
	iconName: "opera",
	sourcePath: "icons/browsers/opera.svg"
});
var SafariIcon = createIconic({
	alt: "Opera Browser",
	iconName: "safari",
	sourcePath: "icons/browsers/safari.svg"
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/icons/chains/index.js
var AleoIcon = createIconic({
	alt: "Aleo Chain",
	iconName: "aleo",
	sourcePath: "icons/chains/aleo.svg"
});
var AlgorandIcon = createIconic({
	alt: "Algorand Chain",
	iconName: "algorand",
	sourcePath: "icons/chains/algorand.svg"
});
var AptosIcon = createIconic({
	alt: "Aptos Chain",
	iconName: "aptos",
	sourcePath: "icons/chains/aptos.svg"
});
createIconic({
	alt: "Arbitrum Chain",
	iconName: "arbitrum",
	sourcePath: "icons/chains/arbitrum.svg"
});
createIconic({
	alt: "Aurora Chain",
	iconName: "aurora",
	sourcePath: "icons/chains/aurora.svg"
});
createIconic({
	alt: "Axelar Chain",
	iconName: "axelar",
	sourcePath: "icons/chains/axelar.svg"
});
createIconic({
	alt: "Base Chain",
	iconName: "base",
	sourcePath: "icons/chains/base.svg"
});
createIconic({
	alt: "Berachain Chain",
	iconName: "berachain",
	sourcePath: "icons/chains/berachain.svg"
});
var BitcoinIcon = createIconic({
	alt: "Bitcoin Chain",
	iconName: "bitcoin",
	sourcePath: "icons/chains/bitcoin.svg"
});
createIconic({
	alt: "BNB Chain",
	iconName: "bnb",
	sourcePath: "icons/chains/bnb.svg"
});
var CosmosIcon = createIconic({
	alt: "Cosmos Chain",
	iconName: "cosmos",
	sourcePath: "icons/chains/cosmos.svg"
});
var EclipseIcon = createIconic({
	alt: "Eclipse",
	iconName: "eclipse",
	sourcePath: "icons/chains/eclipse.svg"
});
var EthereumIcon = createIconic({
	alt: "Ethereum Chain",
	iconName: "ethereum",
	sourcePath: "icons/chains/ethereum.svg"
});
var FlowIcon = createIconic({
	alt: "Flow Chain",
	iconName: "flow",
	sourcePath: "icons/chains/flow.svg"
});
createIconic({
	alt: "Gnosis Chain",
	iconName: "gnosis",
	sourcePath: "icons/chains/gnosis.svg"
});
createIconic({
	alt: "Goerli Chain",
	iconName: "goerli",
	sourcePath: "icons/chains/goerli.svg"
});
var MidnightIcon = createIconic({
	alt: "Midnight Chain",
	iconName: "midnight",
	sourcePath: "icons/chains/midnight.svg"
});
createIconic({
	alt: "Optimism Chain",
	iconName: "optimism",
	sourcePath: "icons/chains/optimism.svg"
});
createIconic({
	alt: "Osmosis Chain",
	iconName: "osmosis",
	sourcePath: "icons/chains/osmosis.svg"
});
createIconic({
	alt: "Palm Chain",
	iconName: "palm",
	sourcePath: "icons/chains/palm.svg"
});
createIconic({
	alt: "Polygon Chain",
	iconName: "polygon",
	sourcePath: "icons/chains/polygon.svg"
});
createIconic({
	alt: "Sei Chain",
	iconName: "sei",
	sourcePath: "icons/chains/sei.svg"
});
var SolanaIcon = createIconic({
	alt: "Solana Chain",
	iconName: "solana",
	sourcePath: "icons/chains/solana.svg"
});
var SparkIcon = createIconic({
	alt: "Spark Chain",
	iconName: "spark",
	sourcePath: "icons/chains/spark.svg"
});
var StarknetIcon = createIconic({
	alt: "Starknet Chain",
	iconName: "starknet",
	sourcePath: "icons/chains/starknet.svg"
});
var StellarIcon = createIconic({
	alt: "Stellar Chain",
	iconName: "stellar",
	sourcePath: "icons/chains/stellar.svg"
});
var SuiIcon = createIconic({
	alt: "Sui Chain",
	iconName: "sui",
	sourcePath: "icons/chains/sui.svg"
});
var TempoIcon = createIconic({
	alt: "Tempo Chain",
	iconName: "tempo",
	sourcePath: "icons/chains/tempo.svg"
});
var TonIcon = createIconic({
	alt: "Ton Chain",
	iconName: "ton",
	sourcePath: "icons/chains/ton.svg"
});
var TronIcon = createIconic({
	alt: "Tron Chain",
	iconName: "tron",
	sourcePath: "icons/chains/tron.svg"
});
createIconic({
	alt: "zkSync Era Chain",
	iconName: "zkSync",
	sourcePath: "icons/chains/zkSync.svg"
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/icons/social/index.js
var social_exports = /* @__PURE__ */ __exportAll({
	AppleDarkSocialIcon: () => AppleDarkSocialIcon,
	AppleSocialIcon: () => AppleSocialIcon,
	BinanceSocialIcon: () => BinanceSocialIcon,
	BitbucketIcon: () => BitbucketIcon,
	CoinbaseSocialDarkIcon: () => CoinbaseSocialDarkIcon,
	CoinbaseSocialIcon: () => CoinbaseSocialIcon,
	DiscordIcon: () => DiscordIcon,
	EpicGamesDarkIcon: () => EpicGamesDarkIcon,
	EpicGamesIcon: () => EpicGamesIcon,
	FacebookIcon: () => FacebookIcon,
	FarcasterIcon: () => FarcasterIcon,
	GithubDarkIcon: () => GithubDarkIcon,
	GithubIcon: () => GithubIcon,
	GitlabIcon: () => GitlabIcon,
	GoogleIcon: () => GoogleIcon,
	HelpdeskIcon: () => HelpdeskIcon,
	InstagramIcon: () => InstagramIcon,
	KrakenDarkIcon: () => KrakenDarkIcon,
	KrakenIcon: () => KrakenIcon,
	LineIcon: () => LineIcon,
	LinkedinIcon: () => LinkedinIcon,
	MicrosoftIcon: () => MicrosoftIcon,
	OktaIcon: () => OktaIcon,
	OnePasswordDarkIcon: () => OnePasswordDarkIcon,
	OnePasswordIcon: () => OnePasswordIcon,
	ShopifyIcon: () => ShopifyIcon,
	SlackIcon: () => SlackIcon,
	SpotifyDarkIcon: () => SpotifyDarkIcon,
	SpotifyIcon: () => SpotifyIcon,
	SteamDarkIcon: () => SteamDarkIcon,
	SteamIcon: () => SteamIcon,
	TelegramIcon: () => TelegramIcon,
	TikTokDarkIcon: () => TikTokDarkIcon,
	TikTokIcon: () => TikTokIcon,
	TwitchDarkIcon: () => TwitchDarkIcon,
	TwitchIcon: () => TwitchIcon,
	TwitterDarkIcon: () => TwitterDarkIcon,
	TwitterIcon: () => TwitterIcon,
	YouTubeIcon: () => YouTubeIcon
});
var BitbucketIcon = createIconic({
	alt: "Bitbucket",
	iconName: "bitbucket",
	sourcePath: "icons/social/bitbucket.svg"
});
var DiscordIcon = createIconic({
	alt: "Discord",
	iconName: "discord",
	sourcePath: "icons/social/discord.svg"
});
var FacebookIcon = createIconic({
	alt: "Facebook",
	iconName: "facebook",
	sourcePath: "icons/social/facebook.svg"
});
var FarcasterIcon = createIconic({
	alt: "Farcaster",
	iconName: "farcaster",
	sourcePath: "icons/social/farcaster.svg"
});
var GithubIcon = createIconic({
	alt: "Github",
	iconName: "github",
	sourcePath: "icons/social/github.svg"
});
var GithubDarkIcon = createIconic({
	alt: "Github",
	iconName: "github-dark",
	sourcePath: "icons/social/github-dark.svg"
});
var GitlabIcon = createIconic({
	alt: "Gitlab",
	iconName: "gitlab",
	sourcePath: "icons/social/gitlab.svg"
});
var GoogleIcon = createIconic({
	alt: "Google",
	iconName: "google",
	sourcePath: "icons/social/google.svg"
});
var HelpdeskIcon = createIconic({
	alt: "Helpdesk",
	iconName: "helpdesk",
	sourcePath: "icons/social/helpdesk.svg"
});
var LinkedinIcon = createIconic({
	alt: "Linkedin",
	iconName: "linkedin",
	sourcePath: "icons/social/linkedin.svg"
});
var MicrosoftIcon = createIconic({
	alt: "Microsoft",
	iconName: "microsoft",
	sourcePath: "icons/social/microsoft.svg"
});
var SlackIcon = createIconic({
	alt: "Slack",
	iconName: "slack",
	sourcePath: "icons/social/slack.svg"
});
var TelegramIcon = createIconic({
	alt: "Telegram",
	iconName: "telegram",
	sourcePath: "icons/social/telegram.svg"
});
var TwitchIcon = createIconic({
	alt: "Twitch",
	iconName: "twitch",
	sourcePath: "icons/social/twitch.svg"
});
var TwitchDarkIcon = createIconic({
	alt: "Twitch",
	iconName: "twitch-dark",
	sourcePath: "icons/social/twitch-dark.svg"
});
var TwitterIcon = createIconic({
	alt: "Twitter",
	iconName: "twitter",
	sourcePath: "icons/social/twitter.svg"
});
var TwitterDarkIcon = createIconic({
	alt: "Twitter",
	iconName: "twitter-dark",
	sourcePath: "icons/social/twitter-dark.svg"
});
var AppleSocialIcon = createIconic({
	alt: "Apple",
	iconName: "apple",
	sourcePath: "icons/social/apple.svg"
});
var AppleDarkSocialIcon = createIconic({
	alt: "Apple",
	iconName: "apple-dark",
	sourcePath: "icons/social/apple-dark.svg"
});
var CoinbaseSocialIcon = createIconic({
	alt: "Coinbase",
	iconName: "coinbasesocial",
	sourcePath: "icons/social/coinbasesocial.svg"
});
var CoinbaseSocialDarkIcon = createIconic({
	alt: "Coinbase",
	iconName: "coinbasesocial-dark",
	sourcePath: "icons/social/coinbasesocial-dark.svg"
});
var InstagramIcon = createIconic({
	alt: "Instagram",
	iconName: "instagram",
	sourcePath: "icons/social/instagram.svg"
});
var YouTubeIcon = createIconic({
	alt: "YouTube",
	iconName: "youtube",
	sourcePath: "icons/social/youtube.svg"
});
var OnePasswordIcon = createIconic({
	alt: "onePassword",
	iconName: "one-password",
	sourcePath: "icons/social/onePassword.svg"
});
var OnePasswordDarkIcon = createIconic({
	alt: "onePassword-dark",
	iconName: "one-password-dark",
	sourcePath: "icons/social/onePassword-dark.svg"
});
var EpicGamesIcon = createIconic({
	alt: "epicGames",
	iconName: "epicgames",
	sourcePath: "icons/social/epicgames.svg"
});
var EpicGamesDarkIcon = createIconic({
	alt: "epicGames-dark",
	iconName: "epicgames-dark",
	sourcePath: "icons/social/epicgames-dark.svg"
});
var SpotifyIcon = createIconic({
	alt: "spotify",
	iconName: "spotify",
	sourcePath: "icons/social/spotify.svg"
});
var SpotifyDarkIcon = createIconic({
	alt: "spotify-dark",
	iconName: "spotify-dark",
	sourcePath: "icons/social/spotify-dark.svg"
});
var SteamIcon = createIconic({
	alt: "steam",
	iconName: "steam",
	sourcePath: "icons/social/steam.svg"
});
var SteamDarkIcon = createIconic({
	alt: "steam-dark",
	iconName: "steam-dark",
	sourcePath: "icons/social/steam-dark.svg"
});
var TikTokIcon = createIconic({
	alt: "tiktok",
	iconName: "tiktok",
	sourcePath: "icons/social/tiktok.svg"
});
var TikTokDarkIcon = createIconic({
	alt: "tiktok-dark",
	iconName: "tiktok-dark",
	sourcePath: "icons/social/tiktok-dark.svg"
});
var LineIcon = createIconic({
	alt: "line",
	iconName: "line",
	sourcePath: "icons/social/line.svg"
});
var ShopifyIcon = createIconic({
	alt: "shopify",
	iconName: "shopify",
	sourcePath: "icons/social/shopify.svg"
});
var KrakenIcon = createIconic({
	alt: "kraken",
	iconName: "kraken",
	sourcePath: "icons/social/kraken.svg"
});
var KrakenDarkIcon = createIconic({
	alt: "kraken-dark",
	iconName: "kraken-dark",
	sourcePath: "icons/social/kraken-dark.svg"
});
var BinanceSocialIcon = createIconic({
	alt: "binance",
	iconName: "binancesocial",
	sourcePath: "icons/social/binancesocial.svg"
});
var OktaIcon = createIconic({
	alt: "okta",
	iconName: "okta",
	sourcePath: "icons/social/okta.svg"
});
createIconic({
	alt: "1inch Wallet",
	iconName: "1inch.svg",
	sourcePath: "icons/wallets/1inch.svg"
});
createIconic({
	alt: "Argent X Wallet",
	iconName: "argentx",
	sourcePath: "icons/wallets/argentx.svg"
});
createIconic({
	alt: "Argent Web Wallet",
	iconName: "argentwebwallet",
	sourcePath: "icons/wallets/argent-web-wallet.svg"
});
createIconic({
	alt: "Backpack Wallet",
	iconName: "backpack",
	sourcePath: "icons/wallets/backpack.svg"
});
createIconic({
	alt: "Binance Wallet",
	iconName: "binance.svg",
	sourcePath: "icons/wallets/binance.svg"
});
createIconic({
	alt: "BitPay Wallet",
	iconName: "bitpay.svg",
	sourcePath: "icons/wallets/bitpay.svg"
});
createIconic({
	alt: "Blocto Wallet",
	iconName: "blocto",
	sourcePath: "icons/wallets/blocto.svg"
});
createIconic({
	alt: "Braavos Wallet",
	iconName: "braavos",
	sourcePath: "icons/wallets/braavos.svg"
});
createIconic({
	alt: "ByBit Wallet",
	iconName: "bybit",
	sourcePath: "icons/wallets/bybit.svg"
});
createIconic({
	alt: "Coin98 Wallet",
	iconName: "coin98",
	sourcePath: "icons/wallets/coin98.svg"
});
createIconic({
	alt: "Coinbase Wallet",
	iconName: "coinbase",
	sourcePath: "icons/wallets/coinbase.svg"
});
createIconic({
	alt: "Crypto Wallet",
	iconName: "crypto.svg",
	sourcePath: "icons/wallets/crypto.svg"
});
createIconic({
	alt: "Dapper Wallet",
	iconName: "dapper",
	sourcePath: "icons/wallets/dapper.svg"
});
createIconic({
	alt: "Dawn Wallet",
	iconName: "dawn",
	sourcePath: "icons/wallets/dawn.svg"
});
createIconic({
	alt: "Default Wallet",
	iconName: "defaultwallet",
	sourcePath: "icons/wallets/default.svg"
});
createIconic({
	alt: "Dapper Wallet",
	iconName: "emailsign.svg",
	sourcePath: "icons/wallets/emailsign.svg"
});
var SignInWithEmailIcon = createIconic({
	alt: "Sign in with Email",
	iconName: "signinwithemail",
	sourcePath: "icons/wallets/signinwithemail.svg"
});
createIconic({
	alt: "Exodus Wallet",
	iconName: "exodus",
	sourcePath: "icons/wallets/exodus.svg"
});
createIconic({
	alt: "Fireblocks Wallet",
	iconName: "fireblocks",
	sourcePath: "icons/wallets/fireblocks.svg"
});
createIconic({
	alt: "Flow Wallet",
	iconName: "flowwallet",
	sourcePath: "icons/wallets/flowwallet.svg"
});
createIconic({
	alt: "Fordefi Wallet",
	iconName: "fordefi",
	sourcePath: "icons/wallets/fordefi.svg"
});
createIconic({
	alt: "Fortmatic Wallet",
	iconName: "fortmatic",
	sourcePath: "icons/wallets/fortmatic.svg"
});
createIconic({
	alt: "Frame Wallet",
	iconName: "frame",
	sourcePath: "icons/wallets/frame.svg"
});
createIconic({
	alt: "Gamestop Wallet",
	iconName: "gamestop",
	sourcePath: "icons/wallets/gamestop.svg"
});
createIconic({
	alt: "Glow Wallet",
	iconName: "glow",
	sourcePath: "icons/wallets/glow.svg"
});
createIconic({
	alt: "ImToken Wallet",
	iconName: "imtoken.svg",
	sourcePath: "icons/wallets/imtoken.svg"
});
createIconic({
	alt: "Injected Wallet",
	iconName: "injectedwallet",
	sourcePath: "icons/wallets/injectedwallet.svg"
});
createIconic({
	alt: "Infinex Wallet",
	iconName: "infinex",
	sourcePath: "icons/wallets/infinex.svg"
});
createIconic({
	alt: "Keplr Wallet",
	iconName: "keplr",
	sourcePath: "icons/wallets/keplr.svg"
});
createIconic({
	alt: "Ledger Wallet",
	iconName: "ledger",
	sourcePath: "icons/wallets/ledger.svg"
});
createIconic({
	alt: "Lilico Wallet",
	iconName: "lilico",
	sourcePath: "icons/wallets/lilico.svg"
});
createIconic({
	alt: "Linen Wallet",
	iconName: "linen.svg",
	sourcePath: "icons/wallets/linen.svg"
});
createIconic({
	alt: "Matic Wallet",
	iconName: "matic",
	sourcePath: "icons/wallets/matic.svg"
});
createIconic({
	alt: "MetaMask Wallet",
	iconName: "metamask",
	sourcePath: "icons/wallets/metamask.svg"
});
createIconic({
	alt: "Missing Wallet",
	iconName: "missing",
	sourcePath: "icons/wallets/missing.svg"
});
createIconic({
	alt: "MyAlgo Wallet",
	iconName: "myalgo",
	sourcePath: "icons/wallets/myalgo.svg"
});
createIconic({
	alt: "Omni Wallet",
	iconName: "omni",
	sourcePath: "icons/wallets/omni.svg"
});
createIconic({
	alt: "OpeanSea Wallet",
	iconName: "opeansea",
	sourcePath: "icons/wallets/opensea.svg"
});
createIconic({
	alt: "Oyl Wallet",
	iconName: "oyl",
	sourcePath: "icons/wallets/oyl.svg"
});
createIconic({
	alt: "Passkeys Wallet",
	iconName: "passkeys",
	sourcePath: "icons/wallets/passkeys.svg"
});
createIconic({
	alt: "Pera Wallet",
	iconName: "pera",
	sourcePath: "icons/wallets/pera.svg"
});
createIconic({
	alt: "Phantom Wallet",
	iconName: "phantom",
	sourcePath: "icons/wallets/phantom.svg"
});
createIconic({
	alt: "Rabby Wallet",
	iconName: "rabby",
	sourcePath: "icons/wallets/rabby.svg"
});
createIconic({
	alt: "Rainbow Wallet",
	iconName: "rainbow",
	sourcePath: "icons/wallets/rainbow.svg"
});
createIconic({
	alt: "Safe Wallet",
	iconName: "safe",
	sourcePath: "icons/wallets/safe.svg"
});
createIconic({
	alt: "Sequence Wallet",
	iconName: "sequence",
	sourcePath: "icons/wallets/sequence.svg"
});
createIconic({
	alt: "Slush — A Sui wallet",
	iconName: "slush",
	sourcePath: "icons/wallets/slush.svg"
});
createIconic({
	alt: "Solflare Wallet",
	iconName: "solflare",
	sourcePath: "icons/wallets/solflare.svg"
});
createIconic({
	alt: "Spot Wallet",
	iconName: "spot",
	sourcePath: "icons/wallets/spot.svg"
});
createIconic({
	alt: "Stroke Wallet",
	iconName: "stroke",
	sourcePath: "icons/wallets/stroke.svg"
});
createIconic({
	alt: "Suiet Wallet",
	iconName: "suiet",
	sourcePath: "icons/wallets/suiet.svg"
});
createIconic({
	alt: "Taho Wallet",
	iconName: "tallycash",
	sourcePath: "icons/wallets/tallycash.svg"
});
createIconic({
	alt: "Terra Wallet",
	iconName: "terra",
	sourcePath: "icons/wallets/terra.svg"
});
createIconic({
	alt: "Torus Wallet",
	iconName: "torus",
	sourcePath: "icons/wallets/torus.svg"
});
createIconic({
	alt: "TronLink Wallet",
	iconName: "tronlink",
	sourcePath: "icons/wallets/tronlink.svg"
});
createIconic({
	alt: "Trust Wallet",
	iconName: "trust",
	sourcePath: "icons/wallets/trust.svg"
});
createIconic({
	alt: "Unstoppable Wallet",
	iconName: "unstoppable",
	sourcePath: "icons/wallets/unstoppable.svg"
});
createIconic({
	alt: "Venly Wallet",
	iconName: "venly",
	sourcePath: "icons/wallets/venly.svg"
});
var WalletConnectIcon = createIconic({
	alt: "Wallet Connect Wallet",
	iconName: "walletconnect",
	sourcePath: "icons/wallets/walletconnect.svg"
});
createIconic({
	alt: "Magic Link Wallet",
	iconName: "magiclink",
	sourcePath: "icons/wallets/magic-link.svg"
});
createIconic({
	alt: "Turnkey",
	iconName: "turnkey",
	sourcePath: "icons/wallets/embedded-wallet.svg"
});
createIconic({
	alt: "Dynamic Waas",
	iconName: "dynamicwaas",
	sourcePath: "icons/wallets/embedded-wallet.svg"
});
createIconic({
	alt: "Zengo Wallet",
	iconName: "zengo",
	sourcePath: "icons/wallets/zengo.svg"
});
createIconic({
	alt: "Superb Wallet",
	iconName: "superb",
	sourcePath: "icons/wallets/superb.svg"
});
createIconic({
	alt: "ZeroDev",
	iconName: "zerodev",
	sourcePath: "icons/wallets/embedded-wallet.svg"
});
createIconic({
	alt: "Smart Wallet",
	iconName: "smartwallet",
	sourcePath: "icons/wallets/smart-wallet.svg"
});
createIconic({
	alt: "Magic Eden",
	iconName: "magiceden",
	sourcePath: "icons/wallets/magiceden.svg"
});
createIconic({
	alt: "Xverse",
	iconName: "xverse",
	sourcePath: "icons/wallets/xverse.svg"
});
createIconic({
	alt: "Unisat",
	iconName: "unisat",
	sourcePath: "icons/wallets/unisat.svg"
});
createIconic({
	alt: "Leather",
	iconName: "leather",
	sourcePath: "icons/wallets/leather.svg"
});
createIconic({
	alt: "OKX",
	iconName: "okx",
	sourcePath: "icons/wallets/okx.svg"
});
createIconic({
	alt: "Coinbase WaaS",
	iconName: "coinbasewaas",
	sourcePath: "icons/wallets/embedded-wallet.svg"
});
createIconic({
	alt: "MetaMask Starknet Snap",
	iconName: "metamaskstarknetsnap",
	sourcePath: "icons/wallets/metamask-starknet.svg"
});
createIconic({
	alt: "Nightly",
	iconName: "nightly",
	sourcePath: "icons/wallets/nightly.svg"
});
createIconic({
	alt: "OneKey",
	iconName: "onekey",
	sourcePath: "icons/wallets/onekey.svg"
});
createIconic({
	alt: "Ambire",
	iconName: "ambire",
	sourcePath: "icons/wallets/ambire.svg"
});
createIconic({
	alt: "Bitget Wallet",
	iconName: "bitgetwallet",
	sourcePath: "icons/wallets/bitgetwallet.svg"
});
createIconic({
	alt: "Math Wallet",
	iconName: "coin98",
	sourcePath: "icons/wallets/coin98.svg"
});
createIconic({
	alt: "Clover Wallet",
	iconName: "clover",
	sourcePath: "icons/wallets/clover.svg"
});
createIconic({
	alt: "Unknown Wallet",
	iconName: "unknown-wallet",
	sourcePath: "icons/wallets/unknown.svg"
});
createIconic({
	alt: "Abstract",
	iconName: "abstract",
	sourcePath: "icons/wallets/abstract.svg"
});
createIconic({
	alt: "Eden Online",
	iconName: "edenonline",
	sourcePath: "icons/wallets/edenonline.svg"
});
createIconic({
	alt: "Intersend",
	iconName: "intersend",
	sourcePath: "icons/wallets/intersend.svg"
});
createIconic({
	alt: "Pontem",
	iconName: "pontem",
	sourcePath: "icons/wallets/pontem.svg"
});
createIconic({
	alt: "Lobstr",
	iconName: "lobstr",
	sourcePath: "icons/wallets/lobstr.svg"
});
createIconic({
	alt: "Freighter",
	iconName: "freighter",
	sourcePath: "icons/wallets/freighter.svg"
});
createIconic({
	alt: "Shield",
	iconName: "shield",
	sourcePath: "icons/wallets/shield.svg"
});
createIconic({
	alt: "1am",
	iconName: "1am",
	sourcePath: "icons/wallets/1am.svg"
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/icons/mobile/index.js
var AppleIcon = createIconic({
	alt: "Apple",
	iconName: "apple",
	sourcePath: "icons/mobile/apple.svg"
});
var AndroidIcon = createIconic({
	alt: "Android",
	iconName: "android",
	sourcePath: "icons/mobile/android.svg"
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/icons/misc/index.js
var CaptchaWaveIcon = createIconic({
	alt: "Captcha Wave",
	iconName: "captcha-wave",
	sourcePath: "icons/misc/captcha-wave.svg"
});
var UserProfileIcon = createIconic({
	alt: "User Profile",
	iconName: "user-profile",
	sourcePath: "icons/misc/user-profile.svg"
});
createIconic({
	alt: "Arrow Send",
	iconName: "arrow-send",
	sourcePath: "icons/misc/arrow-send.svg"
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/_virtual/_tslib.js
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
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/logger.js
var logger = new Logger("iconic");
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/components/getSocialIcon.js
var getSocialIcon = (name, variant = "light") => {
	const map = Object.fromEntries(Object.values(social_exports).map((icon) => [icon.iconName, icon]));
	if (variant === "dark") {
		const darkIcon = map[`${name.toLowerCase()}-dark`];
		if (darkIcon) return darkIcon;
	}
	const icon = map[name.toLowerCase()];
	if (icon) return icon;
	throw new Error(`Icon ${name}, not found`);
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/components/findSocialIcon.js
var findSocialIcon = (name, variant = "light") => {
	try {
		return getSocialIcon(name, variant);
	} catch (e) {
		logger.error(e);
		return null;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+iconic@4.89.0_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/@dynamic-labs/iconic/src/components/SocialIcon.js
var SocialIcon = (_a) => {
	var { name, variant } = _a, props = __rest(_a, ["name", "variant"]);
	const Icon = findSocialIcon(name, variant);
	if (!Icon) return null;
	return (0, import_react.createElement)(Icon, props, null);
};
//#endregion
export { BraveIcon as A, SparkIcon as C, TempoIcon as D, SuiIcon as E, SafariIcon as F, require_react as I, EdgeIcon as M, FirefoxIcon as N, TonIcon as O, OperaIcon as P, SolanaIcon as S, StellarIcon as T, CosmosIcon as _, AndroidIcon as a, FlowIcon as b, WalletConnectIcon as c, SlackIcon as d, TwitterIcon as f, BitcoinIcon as g, AptosIcon as h, UserProfileIcon as i, ChromeIcon as j, TronIcon as k, DiscordIcon as l, AlgorandIcon as m, findSocialIcon as n, AppleIcon as o, AleoIcon as p, CaptchaWaveIcon as r, SignInWithEmailIcon as s, SocialIcon as t, HelpdeskIcon as u, EclipseIcon as v, StarknetIcon as w, MidnightIcon as x, EthereumIcon as y };
