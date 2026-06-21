'use client'
import { StorageService } from '../services/StorageService/StorageService.js';
import '../logger/logger.js';
import '../services/StorageService/storageEvents.js';

const WALLET_RETURN_ROUTE_KEY = 'dynamic-wallet-return-route';
/**
 * Utility for storing and retrieving the route to return to after
 * a wallet deep link operation completes.
 */
const walletReturnRoute = {
    /**
     * Clear any stored return route without retrieving it.
     */
    clear: () => {
        StorageService.removeItem(WALLET_RETURN_ROUTE_KEY);
    },
    /**
     * Get and clear the stored return route.
     * Returns undefined if no route was stored.
     */
    getAndClear: () => {
        const route = StorageService.getItem(WALLET_RETURN_ROUTE_KEY);
        if (route) {
            StorageService.removeItem(WALLET_RETURN_ROUTE_KEY);
        }
        return route !== null && route !== void 0 ? route : undefined;
    },
    /**
     * Store the current route before opening a wallet deep link.
     * This will be retrieved when the app returns from the wallet.
     */
    set: (route) => {
        StorageService.setItem(WALLET_RETURN_ROUTE_KEY, route);
    },
};

export { walletReturnRoute };
