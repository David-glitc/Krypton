'use client'
import { ChainEnum } from '@dynamic-labs/sdk-api-core';

// Stellar mainnet network hash prefix
const STELLAR_MAINNET_HASH_PREFIX = '7ac33997';
// Stellar testnet network hash prefix
const STELLAR_TESTNET_HASH_PREFIX = 'cee0302d';
// Stellar CAIP-2 mainnet identifier
const STELLAR_CAIP2_MAINNET = 'stellar:pubnet';
// Stellar CAIP-2 testnet identifier
const STELLAR_CAIP2_TESTNET = 'stellar:testnet';
// Stellar mainnet numeric network ID
const STELLAR_MAINNET_NETWORK_ID = 800;
// Stellar testnet numeric network ID
const STELLAR_TESTNET_NETWORK_ID = 801;
/**
 * Converts Stellar network identifiers to numeric network IDs.
 * Supports both hash format (7ac33997...) and CAIP-2 format (stellar:pubnet).
 */
const convertStellarNetworkToNumeric = (networkId) => {
    if (networkId === undefined) {
        return undefined;
    }
    const networkStr = String(networkId);
    const isMainnet = networkStr.startsWith(STELLAR_MAINNET_HASH_PREFIX) ||
        networkStr === STELLAR_CAIP2_MAINNET;
    if (isMainnet) {
        return STELLAR_MAINNET_NETWORK_ID;
    }
    const isTestnet = networkStr.startsWith(STELLAR_TESTNET_HASH_PREFIX) ||
        networkStr === STELLAR_CAIP2_TESTNET;
    if (isTestnet) {
        return STELLAR_TESTNET_NETWORK_ID;
    }
    // Return original if it's already numeric
    const numericId = Number(networkId);
    return isNaN(numericId) ? undefined : numericId;
};
/**
 * Resolves the network ID for API requests, handling chain-specific conversions.
 */
const resolveNetworkIdForRequest = (chainName, networkId) => {
    // Bitcoin does not need a network ID but the request requires one
    if (chainName === ChainEnum.Btc) {
        return 1;
    }
    if (chainName === ChainEnum.Stellar) {
        return convertStellarNetworkToNumeric(networkId);
    }
    if (networkId === undefined) {
        return undefined;
    }
    const numericId = Number(networkId);
    return isNaN(numericId) ? undefined : numericId;
};
// Error code for rate limiting
const RATE_LIMIT_CODE = 429;
/**
 * Extracts an appropriate error message from an error object.
 */
const getTokenBalanceErrorMessage = (error) => {
    if ((error === null || error === void 0 ? void 0 : error.code) === RATE_LIMIT_CODE) {
        return 'Too many requests fetching balances';
    }
    if (error === null || error === void 0 ? void 0 : error.message) {
        return error.message;
    }
    return 'error fetching token balance';
};

export { convertStellarNetworkToNumeric, getTokenBalanceErrorMessage, resolveNetworkIdForRequest };
