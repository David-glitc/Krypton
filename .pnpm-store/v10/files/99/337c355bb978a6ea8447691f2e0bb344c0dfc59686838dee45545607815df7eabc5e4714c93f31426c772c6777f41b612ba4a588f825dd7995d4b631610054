import { exists } from '../runtime.js';

/* tslint:disable */
function WalletKeyShareInfoWithEncryptedAccountCredentialFromJSON(json) {
    return WalletKeyShareInfoWithEncryptedAccountCredentialFromJSONTyped(json);
}
function WalletKeyShareInfoWithEncryptedAccountCredentialFromJSONTyped(json, ignoreDiscriminator) {
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
        'encryptedAccountCredential': !exists(json, 'encryptedAccountCredential') ? undefined : json['encryptedAccountCredential'],
    };
}
function WalletKeyShareInfoWithEncryptedAccountCredentialToJSON(value) {
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
        'encryptedAccountCredential': value.encryptedAccountCredential,
    };
}

export { WalletKeyShareInfoWithEncryptedAccountCredentialFromJSON, WalletKeyShareInfoWithEncryptedAccountCredentialFromJSONTyped, WalletKeyShareInfoWithEncryptedAccountCredentialToJSON };
