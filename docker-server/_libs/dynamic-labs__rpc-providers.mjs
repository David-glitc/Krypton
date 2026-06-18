import { a as ProviderChain } from "./@dynamic-labs/embedded-wallet-solana+[...].mjs";
//#region ../../node_modules/.pnpm/@dynamic-labs+rpc-providers@4.89.0/node_modules/@dynamic-labs/rpc-providers/_virtual/_tslib.js
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
//#region ../../node_modules/.pnpm/@dynamic-labs+rpc-providers@4.89.0/node_modules/@dynamic-labs/rpc-providers/src/ChainRpcProviders.js
var ChainRpcProvidersClass = class ChainRpcProvidersClass {
	static get client() {
		if (!ChainRpcProvidersClass.instance) ChainRpcProvidersClass.instance = new ChainRpcProvidersClass();
		return ChainRpcProvidersClass.instance;
	}
	constructor() {
		this.getProvidersMethods = {};
	}
	static getProviders(configurations) {
		Object.values(ProviderChain).forEach((chain) => {
			var _a, _b;
			if (!ChainRpcProvidersClass.providers[chain]) {
				const providers = (_b = (_a = ChainRpcProvidersClass.client.getProvidersMethods)[chain]) === null || _b === void 0 ? void 0 : _b.call(_a, configurations);
				if (providers) Object.assign(ChainRpcProvidersClass.providers, { [chain]: providers });
			}
		});
		return ChainRpcProvidersClass.providers;
	}
	static registerChainProviders(providerChain, fn) {
		return __awaiter(this, void 0, void 0, function* () {
			if (!ChainRpcProvidersClass.client.getProvidersMethods[providerChain]) Object.assign(ChainRpcProvidersClass.client.getProvidersMethods, { [providerChain]: fn });
		});
	}
};
ChainRpcProvidersClass.providers = {};
ChainRpcProvidersClass.wipeInstance = () => {
	ChainRpcProvidersClass.instance = void 0;
	ChainRpcProvidersClass.providers = {};
};
var ChainRpcProviders = ChainRpcProvidersClass;
//#endregion
export { ChainRpcProviders as t };
