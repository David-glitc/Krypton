import { exists } from '../runtime.js';

/* tslint:disable */
function CheckoutFailureFromJSON(json) {
    return CheckoutFailureFromJSONTyped(json);
}
function CheckoutFailureFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'code': json['code'],
        'message': json['message'],
        'category': json['category'],
        'stage': json['stage'],
        'retryable': json['retryable'],
        'details': !exists(json, 'details') ? undefined : json['details'],
    };
}
function CheckoutFailureToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'code': value.code,
        'message': value.message,
        'category': value.category,
        'stage': value.stage,
        'retryable': value.retryable,
        'details': value.details,
    };
}

export { CheckoutFailureFromJSON, CheckoutFailureFromJSONTyped, CheckoutFailureToJSON };
