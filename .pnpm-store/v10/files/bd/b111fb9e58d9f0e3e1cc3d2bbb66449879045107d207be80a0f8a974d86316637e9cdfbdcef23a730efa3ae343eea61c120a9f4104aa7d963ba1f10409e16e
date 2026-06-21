'use client'
import { useStepUpAuthentication } from '../useStepUpAuthentication/useStepUpAuthentication.js';

/**
 * Opens the Dynamic MFA modal (passkey or TOTP) and resolves when the user completes MFA.
 *
 * @deprecated Use `useStepUpAuthentication().promptMfa()` instead. Step-up authentication
 * is the generic category; MFA is one verification method. The `promptMfa` method on
 * `useStepUpAuthentication` provides the same behavior. This hook will be removed in the
 * next major version.
 *
 * @returns A function that opens the MFA flow and returns a promise resolving to the
 *   MFA token (or `undefined` when using `requestedScopes` — use `getElevatedAccessToken({ scope })` after completion).
 */
const usePromptMfaAuth = () => {
    const { promptMfa } = useStepUpAuthentication();
    return promptMfa;
};

export { usePromptMfaAuth };
