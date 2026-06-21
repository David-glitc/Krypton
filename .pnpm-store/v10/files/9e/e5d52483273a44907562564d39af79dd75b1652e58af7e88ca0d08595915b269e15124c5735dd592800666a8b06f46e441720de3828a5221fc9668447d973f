import { exists } from '../runtime.js';

/* tslint:disable */
function DepositAmountsConfigInputFromJSON(json) {
    return DepositAmountsConfigInputFromJSONTyped(json);
}
function DepositAmountsConfigInputFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'minimum': !exists(json, 'minimum') ? undefined : json['minimum'],
        'presets': !exists(json, 'presets') ? undefined : json['presets'],
    };
}
function DepositAmountsConfigInputToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'minimum': value.minimum,
        'presets': value.presets,
    };
}

export { DepositAmountsConfigInputFromJSON, DepositAmountsConfigInputFromJSONTyped, DepositAmountsConfigInputToJSON };
