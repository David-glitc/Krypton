import { exists } from '../runtime.js';
import { CreateMfaTokenFromJSON, CreateMfaTokenToJSON } from './CreateMfaToken.js';
import { TokenScopeFromJSON, TokenScopeToJSON } from './TokenScope.js';

/* tslint:disable */
function EmailVerificationMfaRequestFromJSON(json) {
    return EmailVerificationMfaRequestFromJSONTyped(json);
}
function EmailVerificationMfaRequestFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'verificationUUID': json['verificationUUID'],
        'verificationToken': json['verificationToken'],
        'createMfaToken': !exists(json, 'createMfaToken') ? undefined : CreateMfaTokenFromJSON(json['createMfaToken']),
        'requestedScopes': !exists(json, 'requestedScopes') ? undefined : (json['requestedScopes'].map(TokenScopeFromJSON)),
    };
}
function EmailVerificationMfaRequestToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'verificationUUID': value.verificationUUID,
        'verificationToken': value.verificationToken,
        'createMfaToken': CreateMfaTokenToJSON(value.createMfaToken),
        'requestedScopes': value.requestedScopes === undefined ? undefined : (value.requestedScopes.map(TokenScopeToJSON)),
    };
}

export { EmailVerificationMfaRequestFromJSON, EmailVerificationMfaRequestFromJSONTyped, EmailVerificationMfaRequestToJSON };
