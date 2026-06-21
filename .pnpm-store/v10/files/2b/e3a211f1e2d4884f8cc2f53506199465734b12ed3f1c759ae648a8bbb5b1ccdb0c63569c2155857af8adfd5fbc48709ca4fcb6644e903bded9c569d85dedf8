import { CheckoutTransactionFromJSON, CheckoutTransactionToJSON } from './CheckoutTransaction.js';

/* tslint:disable */
function CheckoutTransactionCreateResponseFromJSON(json) {
    return CheckoutTransactionCreateResponseFromJSONTyped(json);
}
function CheckoutTransactionCreateResponseFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'sessionExpiresAt': (new Date(json['sessionExpiresAt'])),
        'sessionToken': json['sessionToken'],
        'transaction': CheckoutTransactionFromJSON(json['transaction']),
    };
}
function CheckoutTransactionCreateResponseToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'sessionExpiresAt': (value.sessionExpiresAt.toISOString()),
        'sessionToken': value.sessionToken,
        'transaction': CheckoutTransactionToJSON(value.transaction),
    };
}

export { CheckoutTransactionCreateResponseFromJSON, CheckoutTransactionCreateResponseFromJSONTyped, CheckoutTransactionCreateResponseToJSON };
