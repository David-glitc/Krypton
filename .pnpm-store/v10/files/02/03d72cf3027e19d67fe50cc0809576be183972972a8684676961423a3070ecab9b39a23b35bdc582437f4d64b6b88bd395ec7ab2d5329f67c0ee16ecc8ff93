import { exists } from '../runtime.js';

/* tslint:disable */
function WalletKeyShareInfoFromJSON(json) {
    return WalletKeyShareInfoFromJSONTyped(json);
}
function WalletKeyShareInfoFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': json['id'],
        'backupLocation': json['backupLocation'],
        'passwordEncrypted': json['passwordEncrypted'],
        'walletShareDeveloperKeyEncrypted': !exists(json, 'walletShareDeveloperKeyEncrypted') ? undefined : json['walletShareDeveloperKeyEncrypted'],
        'externalKeyShareId': !exists(json, 'externalKeyShareId') ? undefined : json['externalKeyShareId'],
        'keygenId': !exists(json, 'keygenId') ? undefined : json['keygenId'],
    };
}
function WalletKeyShareInfoToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'backupLocation': value.backupLocation,
        'passwordEncrypted': value.passwordEncrypted,
        'walletShareDeveloperKeyEncrypted': value.walletShareDeveloperKeyEncrypted,
        'externalKeyShareId': value.externalKeyShareId,
        'keygenId': value.keygenId,
    };
}

export { WalletKeyShareInfoFromJSON, WalletKeyShareInfoFromJSONTyped, WalletKeyShareInfoToJSON };
