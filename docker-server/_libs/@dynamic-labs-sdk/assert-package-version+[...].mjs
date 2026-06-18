//#region ../../node_modules/.pnpm/@dynamic-labs-sdk+assert-package-version@1.8.2/node_modules/@dynamic-labs-sdk/assert-package-version/dist/index.esm.js
var VersionMismatchError = class extends Error {
	constructor(targetVersion, packageVersions$1) {
		const errorMessage = `
🚨 Version Mismatch Error

One or more \`@dynamic-labs-sdk\` packages are installed with mismatched versions. All \`@dynamic-labs-sdk\` packages must be on the same version to work correctly.

Affected Packages:
${Object.entries(packageVersions$1).filter(([, v]) => v !== targetVersion).map(([pkgName, installedVersion]) => `- \`${pkgName}\` (installed: **${installedVersion}**, required: **${targetVersion}**)`).join("\n")}

💡 To fix this issue, update all @dynamic-labs-sdk/* packages to version \`${targetVersion}\` in your package.json
`;
		super(errorMessage.trim());
		this.name = "VersionMismatchError";
	}
};
/**
* A mapping of package names to their versions.
* @not-instrumented
*/
var packageVersions = {};
/**
* Timeout ID for batching version checks.
*/
var versionCheckTimeout = null;
/**
* Asserts that all `@dynamic-labs-sdk` packages are on the same version.
* Throws an error with instructions if versions mismatch.
*
* @param {string} packageName - The name of the package to assert.
* @param {string} version - The version of the package.
* @not-instrumented
*/
var assertPackageVersion = (packageName, version) => {
	packageVersions[packageName] = version;
	if (versionCheckTimeout) {
		clearTimeout(versionCheckTimeout);
		versionCheckTimeout = null;
	}
	/**
	* Set a timeout to batch the version check.
	* This ensures that the check is executed after all package versions have been imported
	* and registered.
	*/
	versionCheckTimeout = setTimeout(() => {
		const versions = Object.values(packageVersions);
		const [firstVersion] = versions;
		if (!versions.every((v) => v === firstVersion)) {
			const error = new VersionMismatchError(packageVersions["@dynamic-labs-sdk/client"] || firstVersion, packageVersions);
			console.error(error);
		}
		versionCheckTimeout = null;
	}, 100);
};
//#endregion
export { assertPackageVersion as t };
