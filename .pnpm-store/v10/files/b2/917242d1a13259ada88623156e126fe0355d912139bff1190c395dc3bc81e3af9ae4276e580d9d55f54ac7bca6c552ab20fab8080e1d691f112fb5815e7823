import { exists } from '../runtime.js';
import { CreateMfaTokenFromJSON, CreateMfaTokenToJSON } from './CreateMfaToken.js';
import { TokenScopeFromJSON, TokenScopeToJSON } from './TokenScope.js';

/* tslint:disable */
function MFAAuthTotpDevicePostRequestFromJSON(json) {
    return MFAAuthTotpDevicePostRequestFromJSONTyped(json);
}
function MFAAuthTotpDevicePostRequestFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': !exists(json, 'id') ? undefined : json['id'],
        'createMfaToken': !exists(json, 'createMfaToken') ? undefined : CreateMfaTokenFromJSON(json['createMfaToken']),
        'code': json['code'],
        'requestedScopes': !exists(json, 'requestedScopes') ? undefined : (json['requestedScopes'].map(TokenScopeFromJSON)),
    };
}
function MFAAuthTotpDevicePostRequestToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'createMfaToken': CreateMfaTokenToJSON(value.createMfaToken),
        'code': value.code,
        'requestedScopes': value.requestedScopes === undefined ? undefined : (value.requestedScopes.map(TokenScopeToJSON)),
    };
}

export { MFAAuthTotpDevicePostRequestFromJSON, MFAAuthTotpDevicePostRequestFromJSONTyped, MFAAuthTotpDevicePostRequestToJSON };
