import { A as walletConnectorEvents, C as findWalletBookWallet, F as isIPhone, P as isIPad, R as isMobile, k as logger, w as renderTemplate } from "../@dynamic-labs-connectors/metamask-solana+[...].mjs";
import { Rt as ProviderEnum } from "../@dynamic-labs-sdk/client+[...].mjs";
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connector-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buffe_f795b07e227478935642fb6d19774621/node_modules/@dynamic-labs/wallet-connector-core/src/utils/getChainInfo/getChainInfo.js
var createChainInfo = (blockchainName, name, symbol, displayName) => ({
	blockchainName,
	displayName: displayName !== null && displayName !== void 0 ? displayName : blockchainName,
	name,
	symbol
});
var chainsInfo = [
	createChainInfo("Aleo", "aleo", "ALEO"),
	createChainInfo("Algorand", "algorand", "ALGO"),
	createChainInfo("Aptos", "aptos", "APTOS"),
	createChainInfo("Bitcoin", "bitcoin", "BTC"),
	createChainInfo("Cosmos", "cosmos", "COSMOS"),
	createChainInfo("Eclipse", "eclipse", "ECLIPSE"),
	createChainInfo("Ethereum", "evm", "ETH", "EVM"),
	createChainInfo("Flow", "flow", "FLOW"),
	createChainInfo("Midnight", "midnight", "MIDNIGHT"),
	createChainInfo("Solana", "solana", "SOL"),
	createChainInfo("Spark", "spark", "SPARK"),
	createChainInfo("Starknet", "starknet", "ETH"),
	createChainInfo("Stellar", "stellar", "XLM"),
	createChainInfo("Sui", "sui", "SUI"),
	createChainInfo("Tempo", "tempo", "TEMPO"),
	createChainInfo("Tron", "tron", "TRON"),
	createChainInfo("TON", "ton", "TON")
];
var chainOverrides = {
	algo: "algorand",
	bip122: "bitcoin",
	btc: "bitcoin",
	eip155: "evm",
	eth: "evm",
	sol: "solana",
	stark: "starknet",
	sui: "sui",
	ton: "ton"
};
var chainInfoOverrides;
var setChainInfoOverrides = (overrides) => {
	chainInfoOverrides = overrides;
};
var getChainInfo = (chain) => {
	var _a;
	const lowerCasedChain = chain.toLowerCase();
	const normalizedChain = (_a = chainOverrides[lowerCasedChain]) !== null && _a !== void 0 ? _a : lowerCasedChain;
	const chainInfo = chainsInfo.find((info) => info.name === normalizedChain || info.symbol.toLocaleLowerCase() === normalizedChain);
	if (!chainInfo) return;
	return chainInfo;
};
var getChainInfoWithOverrides = (chain) => {
	var _a, _b;
	const chainInfo = getChainInfo(chain);
	if (!chainInfo) return;
	const overrides = chainInfoOverrides === null || chainInfoOverrides === void 0 ? void 0 : chainInfoOverrides[chainInfo.name];
	const chainInfoClone = Object.assign({}, chainInfo);
	if (overrides) {
		chainInfoClone.blockchainName = (_a = overrides.displayName) !== null && _a !== void 0 ? _a : chainInfo.blockchainName;
		chainInfoClone.displayName = (_b = overrides.displayName) !== null && _b !== void 0 ? _b : chainInfo.displayName;
	}
	return chainInfoClone;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connector-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buffe_f795b07e227478935642fb6d19774621/node_modules/@dynamic-labs/wallet-connector-core/src/utils/isEmbeddedConnector/isEmbeddedConnector.js
var isEmbeddedConnector = (connector) => Boolean(connector.isEmbeddedWallet);
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+wallet-connector-core@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_buffe_f795b07e227478935642fb6d19774621/node_modules/@dynamic-labs/wallet-connector-core/src/utils/getWalletLinks/getWalletLinks.js
var getWalletLinks = (downloadLinks) => {
	var _a, _b, _c, _d, _e, _f, _g, _h;
	const links = {
		android: "",
		brave: "",
		chrome: "",
		edge: "",
		firefox: "",
		ios: ""
	};
	if (!downloadLinks) return links;
	links.brave = (_a = renderTemplate("chromeUrl", downloadLinks.chromeId)) !== null && _a !== void 0 ? _a : "";
	links.chrome = (_b = renderTemplate("chromeUrl", downloadLinks.chromeId)) !== null && _b !== void 0 ? _b : "";
	links.edge = (_c = renderTemplate("edgeUrl", downloadLinks.edgeId)) !== null && _c !== void 0 ? _c : "";
	links.firefox = (_d = renderTemplate("firefoxUrl", downloadLinks.firefoxId)) !== null && _d !== void 0 ? _d : "";
	links.ios = (_f = (_e = renderTemplate("iosUrl", downloadLinks.iosId)) !== null && _e !== void 0 ? _e : downloadLinks.iosUrl) !== null && _f !== void 0 ? _f : "";
	links.android = (_h = (_g = renderTemplate("androidUrl", downloadLinks.androidId)) !== null && _g !== void 0 ? _g : downloadLinks.androidUrl) !== null && _h !== void 0 ? _h : "";
	return links;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/message/message.js
var generateMessageToSign = ({ blockchain, domain, chainId, nonce, uri, publicKey, issuedAt = (/* @__PURE__ */ new Date()).toISOString(), statement, requestId, resources }) => {
	var _a, _b;
	if (blockchain === "STARK")
 /**
	* Starknet requires the strings to be 31 chars long
	* Nonce - we need to keep full size for nonce verification on the backend (the backend shortens it to 31 chars)
	* Domain - we need to shorten the domain to 31 chars
	*/
	return JSON.stringify({
		domain: domain.substring(0, 31),
		nonce
	});
	const prefix = [`${domain} wants you to sign in with your ${(_b = (_a = getChainInfo(blockchain)) === null || _a === void 0 ? void 0 : _a.blockchainName) !== null && _b !== void 0 ? _b : "Ethereum"} account:`, publicKey].join("\n");
	const prefixWithStatementGap = statement ? "\n\n" : "\n";
	const prefixWithStatement = `${[prefix, statement].join(prefixWithStatementGap)}\n`;
	const suffixFields = [];
	suffixFields.push(`URI: ${uri}`);
	suffixFields.push("Version: 1");
	if (chainId) suffixFields.push(`Chain ID: ${chainId}`);
	suffixFields.push(`Nonce: ${nonce}`);
	suffixFields.push(`Issued At: ${issuedAt}`);
	if (requestId) suffixFields.push(`Request ID: ${requestId}`);
	if (resources === null || resources === void 0 ? void 0 : resources.length) suffixFields.push(`Resources:${resources.map((resource) => "\n- " + resource).join()}`);
	return [prefixWithStatement, suffixFields.join("\n")].join("\n");
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getEnabledProviders/getEnabledProviders.js
var getEnabledProviders = (providers) => {
	var _a;
	return (_a = providers === null || providers === void 0 ? void 0 : providers.filter((provider) => Boolean(provider.enabledAt) || provider.provider === ProviderEnum.MagicLink && Boolean(provider.providerProjectId) || provider.provider === ProviderEnum.Turnkey)) !== null && _a !== void 0 ? _a : [];
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getApiProviders/getApiProviders.js
var getApiProviders = (providers) => Object.values(ProviderEnum).reduce((acc, provider) => {
	const foundProvider = providers.find((providerSetting) => providerSetting.provider === provider);
	if (foundProvider) acc[provider] = foundProvider;
	return acc;
}, {});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/const.js
var defaultWalletUiUtils = {
	addNetwork: () => {
		throw Error("addNetwork not implemented");
	},
	disabledConfirmationOnce: () => {
		throw Error("disabledConfirmationOnce, not implemented");
	},
	sendTransaction: () => {
		throw Error("requestSendTransactionConfirmation not implemented");
	},
	signMessage: () => {
		throw Error("signMessage not implemented");
	},
	signTransaction: () => {
		throw Error("signTransaction not implemented");
	},
	syncWallet: () => {
		throw Error("syncWallet not implemented");
	},
	zkSyncCreateSession: () => {
		throw Error("zkSyncCreateSession not implemented");
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getWalletConnectorConstructorOptions/getWalletConnectorConstructorOptions.js
var getWalletConnectorConstructorOptions = ({ appLogoUrl, appName, authMode, coinbaseWalletPreference, chainRpcProviders, deepLinkPreference, flowNetwork, mobileExperience, networkConfigurations, redirectUrl, settings, walletConnectProjectId, walletUiUtils, walletBook, walletConnectPreferredChains, useMetamaskSdk = false }) => {
	const aleoNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.aleo) || [];
	const eclipseNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.eclipse) || [];
	const evmNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.evm) || [];
	const solanaNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.solana) || [];
	const cosmosNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.cosmos) || [];
	const midnightNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.midnight) || [];
	const starknetNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.starknet) || [];
	const stellarNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.stellar) || [];
	const suiNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.sui) || [];
	const tronNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.tron) || [];
	const aptosNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.aptos) || [];
	const tonNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.ton) || [];
	const bitcoinNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.bitcoin) || [];
	const tempoNetworkConfigs = (networkConfigurations === null || networkConfigurations === void 0 ? void 0 : networkConfigurations.tempo) || [];
	return {
		aleoNetworks: aleoNetworkConfigs,
		apiProviders: getApiProviders(getEnabledProviders(settings.providers)),
		appLogoUrl,
		appName,
		aptosNetworks: aptosNetworkConfigs,
		authMode,
		bitcoinNetworks: bitcoinNetworkConfigs,
		chainRpcProviders,
		coinbaseWalletPreference,
		cosmosNetworks: cosmosNetworkConfigs,
		deepLinkPreference,
		eclipseNetworks: eclipseNetworkConfigs,
		evmNetworks: evmNetworkConfigs,
		flowNetwork,
		midnightNetworks: midnightNetworkConfigs,
		mobileExperience,
		projectId: walletConnectProjectId,
		redirectUrl,
		settings,
		solNetworks: solanaNetworkConfigs,
		starknetNetworks: starknetNetworkConfigs,
		stellarNetworks: stellarNetworkConfigs,
		suiNetworks: suiNetworkConfigs,
		tempoNetworks: tempoNetworkConfigs,
		tonNetworks: tonNetworkConfigs,
		tronNetworks: tronNetworkConfigs,
		useMetamaskSdk,
		walletBook,
		walletConnectPreferredChains,
		walletConnectorEventsEmitter: walletConnectorEvents,
		walletUiUtils: walletUiUtils || defaultWalletUiUtils
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getSupportedWallets/handleMobileWalletFilter/handleMobileWalletFilter.js
var handleMobileWalletFilter = (connector) => {
	var _a, _b;
	if (!connector.metadata) return false;
	const { downloadLinks, deepLinks } = connector.metadata;
	/**
	* WalletConnect provides a "universal" and "native" deep link. They recommend using
	* the universal deep link over the native one due to UX differences, and our current
	* implementation uses only universal. This means we need to filter for wallets that
	* have a universal deep link available.
	*/
	const hasWalletConnectLink = Boolean((_a = deepLinks === null || deepLinks === void 0 ? void 0 : deepLinks.mobile) === null || _a === void 0 ? void 0 : _a.universal) || Boolean((_b = deepLinks === null || deepLinks === void 0 ? void 0 : deepLinks.mobile) === null || _b === void 0 ? void 0 : _b.native);
	const shouldShowIfHadDownloadLink = !connector.isWalletConnect || connector.key === "walletconnect" || connector.key === "walletconnectsol" || hasWalletConnectLink;
	const walletLinks = getWalletLinks(downloadLinks);
	if (isIPad() || isIPhone()) return Boolean(walletLinks.ios) && shouldShowIfHadDownloadLink;
	else return Boolean(walletLinks.android) && shouldShowIfHadDownloadLink;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getSupportedWallets/filterWalletsForPlatform/filterWalletsForPlatform.js
var filterWalletsForPlatform = (walletBook, connectors) => connectors.filter((connector) => {
	const walletBookWallet = findWalletBookWallet(walletBook, connector.key);
	if (connector.isInstalledOnBrowser()) return true;
	else if (isEmbeddedConnector(connector)) return true;
	else if (walletBookWallet === null || walletBookWallet === void 0 ? void 0 : walletBookWallet.showOnlyIfInstalled) return false;
	else if (connector.canConnectViaCustodialService) return true;
	else if (!isMobile()) return true;
	else return handleMobileWalletFilter(connector);
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getSupportedWallets/applyLinksOverrides/applyLinksOverrides.js
var applyLinksOverrides = (walletBook, wallets) => wallets.map((wallet) => {
	const walletData = findWalletBookWallet(walletBook, wallet.key);
	if ((walletData === null || walletData === void 0 ? void 0 : walletData.switchNetworkOnlyFromWallet) !== void 0) wallet.switchNetworkOnlyFromWallet = walletData.switchNetworkOnlyFromWallet;
	return wallet;
});
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getSupportedWallets/getSupportedWallets.js
var walletConnectors = [];
var getSupportedWallets = (args) => {
	var _a;
	const { settings, skipMemo = false, walletConnectorsProp, walletBook } = args;
	if (!skipMemo && walletConnectors.length > 0) return walletConnectors;
	const disabledConnectors = (_a = settings.sdk.disabledWalletConnectors) !== null && _a !== void 0 ? _a : [];
	const opts = getWalletConnectorConstructorOptions(args);
	const allWalletConnectors = walletConnectorsProp.map((getWalletConnectorConstructors) => getWalletConnectorConstructors(opts)).flat().map((walletConnectorConstructor) => {
		try {
			return new walletConnectorConstructor(opts);
		} catch (error) {
			logger.error(`Failed to construct wallet ${walletConnectorConstructor.name}`, error);
			return;
		}
	}).filter((walletConnector) => {
		var _a;
		return walletConnector && (!((_a = walletConnector.metadata) === null || _a === void 0 ? void 0 : _a.id) || !disabledConnectors.includes(walletConnector.metadata.id));
	}).map((walletConnector) => {
		walletConnector === null || walletConnector === void 0 || walletConnector.init();
		return walletConnector;
	}).filter((walletConnector) => walletConnector === null || walletConnector === void 0 ? void 0 : walletConnector.filter()).map((walletConnector) => walletConnector.getMobileOrInstalledWallet());
	walletConnectors = applyLinksOverrides(walletBook, filterWalletsForPlatform(walletBook, allWalletConnectors.filter((walletConnector) => {
		if (!walletConnector.isWalletConnect) return true;
		return !allWalletConnectors.some((wc) => wc.key === walletConnector.key && wc.connectedChain === walletConnector.connectedChain && !wc.isWalletConnect && wc.isInstalledOnBrowser());
	})));
	return walletConnectors;
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getSupportedChainsForWalletConnector/getSupportedChainsForWalletConnector.js
var chainStringToChains = {
	"eip155:1": ["ETH", "EVM"],
	"flow:mainnet": ["FLOW"],
	"ton:mainnet": ["TON"]
};
var getSupportedChainsForWalletConnector = (walletBook, walletConnector) => {
	var _a;
	const walletBookWallet = findWalletBookWallet(walletBook, walletConnector.key);
	if (!walletConnector.mergeWalletBookChains || !walletBookWallet) return walletConnector.supportedChains;
	/**
	* chains could contain multiple eth networks eg
	*  "eip155:1",
	*  "eip155:10",
	*  "eip155:56",
	*  "eip155:100",
	*
	* so we will use a set to ensure uniqueness
	*/
	const chainSet = /* @__PURE__ */ new Set();
	((_a = walletBookWallet.chains) !== null && _a !== void 0 ? _a : []).forEach((chainString) => {
		const chains = chainStringToChains[chainString];
		chains === null || chains === void 0 || chains.forEach((chain) => {
			chainSet.add(chain);
		});
	});
	walletConnector.supportedChains.forEach((chain) => {
		chainSet.add(chain);
	});
	return [...chainSet];
};
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+multi-wallet@4.89.0_@dynamic-labs-wallet+primitives@1.0.16_bufferutil@4.1_0bda141b1ed6a0f0534a678b5acbc2c0/node_modules/@dynamic-labs/multi-wallet/src/utils/getEnabledWallets/getEnabledWallets.js
var getEnabledWallets = (props) => {
	return getSupportedWallets(props.getSupportedWalletOpts).filter((wallet) => {
		const supportedChains = getSupportedChainsForWalletConnector(props.getSupportedWalletOpts.walletBook, wallet);
		return props.enabledChains.some((chain) => supportedChains.includes(chain)) || wallet.key === "magiclink";
	});
};
//#endregion
export { isEmbeddedConnector as a, setChainInfoOverrides as c, getWalletLinks as i, getWalletConnectorConstructorOptions as n, getChainInfo as o, generateMessageToSign as r, getChainInfoWithOverrides as s, getEnabledWallets as t };
