import { ChainEnumFromJSON, ChainEnumToJSON } from './ChainEnum.js';

/* tslint:disable */
function WalletSanctionsResponseFromJSON(json) {
    return WalletSanctionsResponseFromJSONTyped(json);
}
function WalletSanctionsResponseFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'walletAddress': json['walletAddress'],
        'chain': ChainEnumFromJSON(json['chain']),
        'isBlocked': json['isBlocked'],
    };
}
function WalletSanctionsResponseToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'walletAddress': value.walletAddress,
        'chain': ChainEnumToJSON(value.chain),
        'isBlocked': value.isBlocked,
    };
}

export { WalletSanctionsResponseFromJSON, WalletSanctionsResponseFromJSONTyped, WalletSanctionsResponseToJSON };
