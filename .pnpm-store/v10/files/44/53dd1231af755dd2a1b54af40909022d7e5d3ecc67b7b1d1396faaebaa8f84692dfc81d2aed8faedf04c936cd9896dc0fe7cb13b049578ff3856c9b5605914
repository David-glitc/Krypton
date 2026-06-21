import { exists } from '../runtime.js';

/* tslint:disable */
function ConflictFromJSON(json) {
    return ConflictFromJSONTyped(json);
}
function ConflictFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'error': !exists(json, 'error') ? undefined : json['error'],
    };
}
function ConflictToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'error': value.error,
    };
}

export { ConflictFromJSON, ConflictFromJSONTyped, ConflictToJSON };
