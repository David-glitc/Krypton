'use client'
import { __awaiter } from '../_virtual/_tslib.js';
import { StorageService } from '@dynamic-labs/utils';

const createWaasClientSecureStorage = () => ({
    getClientKeyShare: (accountAddress) => __awaiter(void 0, void 0, void 0, function* () {
        const shares = StorageService.getItem(`waas_client_key_share_${accountAddress}`, {
            priority: ['secureStorage'],
        });
        return shares ? JSON.parse(shares) : [];
    }),
    removeClientKeyShare: (accountAddress) => __awaiter(void 0, void 0, void 0, function* () {
        StorageService.removeItem(`waas_client_key_share_${accountAddress}`, {
            priority: ['secureStorage'],
        });
    }),
    setClientKeyShare: (accountAddress, shares) => __awaiter(void 0, void 0, void 0, function* () {
        return StorageService.setItem(`waas_client_key_share_${accountAddress}`, JSON.stringify(shares), {
            priority: ['secureStorage'],
        });
    }),
});

export { createWaasClientSecureStorage };
