import { CheckoutFromJSON, CheckoutToJSON } from './Checkout.js';

/* tslint:disable */
function CheckoutsResponseFromJSON(json) {
    return CheckoutsResponseFromJSONTyped(json);
}
function CheckoutsResponseFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'checkouts': (json['checkouts'].map(CheckoutFromJSON)),
    };
}
function CheckoutsResponseToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'checkouts': (value.checkouts.map(CheckoutToJSON)),
    };
}

export { CheckoutsResponseFromJSON, CheckoutsResponseFromJSONTyped, CheckoutsResponseToJSON };
