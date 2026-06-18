import { Kt as exists } from "./@dynamic-labs-sdk/client+[...].mjs";
//#region ../../node_modules/.pnpm/@dynamic-labs+sdk-api-core@0.0.1015/node_modules/@dynamic-labs/sdk-api-core/src/models/JwtVerifiedCredentialHashes.js
function JwtVerifiedCredentialHashesFromJSON(json) {
	return JwtVerifiedCredentialHashesFromJSONTyped(json);
}
function JwtVerifiedCredentialHashesFromJSONTyped(json, ignoreDiscriminator) {
	if (json === void 0 || json === null) return json;
	return {
		"blockchain": !exists(json, "blockchain") ? void 0 : json["blockchain"],
		"email": !exists(json, "email") ? void 0 : json["email"],
		"oauth": !exists(json, "oauth") ? void 0 : json["oauth"],
		"phoneNumber": !exists(json, "phoneNumber") ? void 0 : json["phoneNumber"],
		"externalUser": !exists(json, "externalUser") ? void 0 : json["externalUser"]
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@dynamic-labs+sdk-api-core@0.0.1015/node_modules/@dynamic-labs/sdk-api-core/src/models/MinifiedDynamicJwt.js
function MinifiedDynamicJwtFromJSON(json) {
	return MinifiedDynamicJwtFromJSONTyped(json);
}
function MinifiedDynamicJwtFromJSONTyped(json, ignoreDiscriminator) {
	if (json === void 0 || json === null) return json;
	return {
		"kid": json["kid"],
		"aud": json["aud"],
		"iss": json["iss"],
		"sub": json["sub"],
		"sid": json["sid"],
		"exp": !exists(json, "exp") ? void 0 : json["exp"],
		"iat": !exists(json, "iat") ? void 0 : json["iat"],
		"environmentId": json["environment_id"],
		"lastVerifiedCredentialId": json["last_verified_credential_id"],
		"signinCredentialId": !exists(json, "signin_credential_id") ? void 0 : json["signin_credential_id"],
		"sessionPublicKey": !exists(json, "session_public_key") ? void 0 : json["session_public_key"],
		"scope": !exists(json, "scope") ? void 0 : json["scope"],
		"verifiedCredentialsHashes": !exists(json, "verifiedCredentialsHashes") ? void 0 : JwtVerifiedCredentialHashesFromJSON(json["verifiedCredentialsHashes"]),
		"email": !exists(json, "email") ? void 0 : json["email"],
		"username": !exists(json, "username") ? void 0 : json["username"],
		"serverAuth": !exists(json, "server_auth") ? void 0 : json["server_auth"],
		"hashedIp": !exists(json, "hashed_ip") ? void 0 : json["hashed_ip"],
		"originalSid": !exists(json, "originalSid") ? void 0 : json["originalSid"],
		"refreshExp": !exists(json, "refreshExp") ? void 0 : json["refreshExp"],
		"sdkVersion": !exists(json, "sdkVersion") ? void 0 : json["sdkVersion"],
		"deviceRegistrationId": !exists(json, "deviceRegistrationId") ? void 0 : json["deviceRegistrationId"]
	};
}
//#endregion
export { MinifiedDynamicJwtFromJSON as t };
