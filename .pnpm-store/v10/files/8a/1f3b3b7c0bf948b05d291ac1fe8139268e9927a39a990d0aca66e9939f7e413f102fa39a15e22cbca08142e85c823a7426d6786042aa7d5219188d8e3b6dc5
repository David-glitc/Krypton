import { exists } from '../runtime.js';
import { CreateMfaTokenFromJSON, CreateMfaTokenToJSON } from './CreateMfaToken.js';
import { TokenScopeFromJSON, TokenScopeToJSON } from './TokenScope.js';

/* tslint:disable */
function MFAAuthRecoveryDevicePostRequestFromJSON(json) {
    return MFAAuthRecoveryDevicePostRequestFromJSONTyped(json);
}
function MFAAuthRecoveryDevicePostRequestFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'createMfaToken': !exists(json, 'createMfaToken') ? undefined : CreateMfaTokenFromJSON(json['createMfaToken']),
        'code': json['code'],
        'requestedScopes': !exists(json, 'requestedScopes') ? undefined : (json['requestedScopes'].map(TokenScopeFromJSON)),
    };
}
function MFAAuthRecoveryDevicePostRequestToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'createMfaToken': CreateMfaTokenToJSON(value.createMfaToken),
        'code': value.code,
        'requestedScopes': value.requestedScopes === undefined ? undefined : (value.requestedScopes.map(TokenScopeToJSON)),
    };
}

export { MFAAuthRecoveryDevicePostRequestFromJSON, MFAAuthRecoveryDevicePostRequestFromJSONTyped, MFAAuthRecoveryDevicePostRequestToJSON };
