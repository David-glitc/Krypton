import { exists } from '../runtime.js';

/* tslint:disable */
function SignMessageBtcTransactionFromJSON(json) {
    return SignMessageBtcTransactionFromJSONTyped(json);
}
function SignMessageBtcTransactionFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'psbt': json['psbt'],
        'chainId': json['chainId'],
        'accountAddress': !exists(json, 'accountAddress') ? undefined : json['accountAddress'],
    };
}
function SignMessageBtcTransactionToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'psbt': value.psbt,
        'chainId': value.chainId,
        'accountAddress': value.accountAddress,
    };
}

export { SignMessageBtcTransactionFromJSON, SignMessageBtcTransactionFromJSONTyped, SignMessageBtcTransactionToJSON };
