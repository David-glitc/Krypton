'use client'
import { useEffect } from 'react';
import { walletReturnRoute, PlatformService } from '@dynamic-labs/utils';
import { dynamicEvents } from '../../../events/dynamicEvents.js';

/**
 * Hook that listens for URL updates (from wallet deep link returns) and
 * emits the walletReturnFromDeepLink event with the previous route.
 *
 * This allows customers to navigate back to where the user was before
 * the wallet operation.
 */
const useWalletReturnRoute = () => {
    useEffect(() => {
        // Check immediately on mount in case the WebView was unmounted while the wallet
        // was open and the URL redirect arrived before listeners were registered
        const routeOnMount = walletReturnRoute.getAndClear();
        if (routeOnMount) {
            dynamicEvents.emit('walletReturnFromDeepLink', {
                previousRoute: routeOnMount,
            });
        }
        const unsubscribe = PlatformService.onUrlUpdate(() => {
            const previousRoute = walletReturnRoute.getAndClear();
            if (previousRoute) {
                dynamicEvents.emit('walletReturnFromDeepLink', { previousRoute });
            }
        });
        return unsubscribe;
    }, []);
};

export { useWalletReturnRoute };
