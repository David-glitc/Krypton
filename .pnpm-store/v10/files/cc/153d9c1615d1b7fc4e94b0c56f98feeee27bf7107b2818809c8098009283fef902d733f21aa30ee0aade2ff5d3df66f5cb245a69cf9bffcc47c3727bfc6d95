import { exists } from '../runtime.js';

/* tslint:disable */
function CheckoutSettlementDataFromJSON(json) {
    return CheckoutSettlementDataFromJSONTyped(json);
}
function CheckoutSettlementDataFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'toChainId': json['toChainId'],
        'toToken': json['toToken'],
        'toAddress': json['toAddress'],
        'completedAt': !exists(json, 'completedAt') ? undefined : (new Date(json['completedAt'])),
    };
}
function CheckoutSettlementDataToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'toChainId': value.toChainId,
        'toToken': value.toToken,
        'toAddress': value.toAddress,
        'completedAt': value.completedAt === undefined ? undefined : (value.completedAt.toISOString()),
    };
}

export { CheckoutSettlementDataFromJSON, CheckoutSettlementDataFromJSONTyped, CheckoutSettlementDataToJSON };
