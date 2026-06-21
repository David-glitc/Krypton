import { exists } from '../runtime.js';
import { AuthenticationExtensionsClientOutputsFromJSON, AuthenticationExtensionsClientOutputsToJSON } from './AuthenticationExtensionsClientOutputs.js';
import { AuthenticatorAssertionResponseFromJSON, AuthenticatorAssertionResponseToJSON } from './AuthenticatorAssertionResponse.js';
import { AuthenticatorAttachmentFromJSON, AuthenticatorAttachmentToJSON } from './AuthenticatorAttachment.js';
import { CreateMfaTokenFromJSON, CreateMfaTokenToJSON } from './CreateMfaToken.js';
import { PublicKeyCredentialTypeFromJSON, PublicKeyCredentialTypeToJSON } from './PublicKeyCredentialType.js';
import { TokenScopeFromJSON, TokenScopeToJSON } from './TokenScope.js';

/* tslint:disable */
function PasskeyAuthRequestFromJSON(json) {
    return PasskeyAuthRequestFromJSONTyped(json);
}
function PasskeyAuthRequestFromJSONTyped(json, ignoreDiscriminator) {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        'id': json['id'],
        'rawId': json['rawId'],
        'response': AuthenticatorAssertionResponseFromJSON(json['response']),
        'authenticatorAttachment': !exists(json, 'authenticatorAttachment') ? undefined : AuthenticatorAttachmentFromJSON(json['authenticatorAttachment']),
        'clientExtensionResults': AuthenticationExtensionsClientOutputsFromJSON(json['clientExtensionResults']),
        'type': PublicKeyCredentialTypeFromJSON(json['type']),
        'createMfaToken': !exists(json, 'createMfaToken') ? undefined : CreateMfaTokenFromJSON(json['createMfaToken']),
        'requestedScopes': !exists(json, 'requestedScopes') ? undefined : (json['requestedScopes'].map(TokenScopeFromJSON)),
    };
}
function PasskeyAuthRequestToJSON(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        'id': value.id,
        'rawId': value.rawId,
        'response': AuthenticatorAssertionResponseToJSON(value.response),
        'authenticatorAttachment': AuthenticatorAttachmentToJSON(value.authenticatorAttachment),
        'clientExtensionResults': AuthenticationExtensionsClientOutputsToJSON(value.clientExtensionResults),
        'type': PublicKeyCredentialTypeToJSON(value.type),
        'createMfaToken': CreateMfaTokenToJSON(value.createMfaToken),
        'requestedScopes': value.requestedScopes === undefined ? undefined : (value.requestedScopes.map(TokenScopeToJSON)),
    };
}

export { PasskeyAuthRequestFromJSON, PasskeyAuthRequestFromJSONTyped, PasskeyAuthRequestToJSON };
