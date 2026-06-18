//#region node_modules/.nitro/vite/services/ssr/assets/invite-CHUafwxM.js
var FEATURE_PRIVATE_BETA = true;
function isInviteAllowed(walletAddress) {
	if (!walletAddress) return false;
	return true;
}
function getInviteHint() {
	return "Connect an invited wallet to access /app during private beta.";
}
function isPrivateBetaActive() {
	return FEATURE_PRIVATE_BETA;
}
//#endregion
export { isInviteAllowed as n, isPrivateBetaActive as r, getInviteHint as t };
