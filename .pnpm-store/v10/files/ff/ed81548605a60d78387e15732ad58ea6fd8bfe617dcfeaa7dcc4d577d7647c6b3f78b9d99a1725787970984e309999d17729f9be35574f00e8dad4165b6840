'use client'
import { __awaiter } from '../../../../../../_virtual/_tslib.js';
import { jsx } from 'react/jsx-runtime';
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useWidgetContext } from '../../context/DynamicWidgetContext.js';
import { SetupPasswordConfirmView } from '../SetupPasswordConfirmView/SetupPasswordConfirmView.js';
import { SetupPasswordEnterView } from '../SetupPasswordEnterView/SetupPasswordEnterView.js';
import '@dynamic-labs/utils';
import '@dynamic-labs/iconic';
import '../../../../context/ViewContext/ViewContext.js';
import { SetupPasswordKnowledgeCheckView } from '../SetupPasswordKnowledgeCheckView/SetupPasswordKnowledgeCheckView.js';
import { SetupPasswordSuccessView } from '../SetupPasswordSuccessView/SetupPasswordSuccessView.js';
import { SetupPasswordTermsView } from '../SetupPasswordTermsView/SetupPasswordTermsView.js';

const SetupPasswordView = ({ onComplete, onCancel, onDone, skipKnowledgeCheck = false, }) => {
    const { t } = useTranslation();
    const { setDynamicWidgetView, setIsOpen } = useWidgetContext();
    const [currentStep, setCurrentStep] = useState('terms');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const goToAccountAndSecurity = useCallback(() => {
        setDynamicWidgetView('account-and-security-settings');
    }, [setDynamicWidgetView]);
    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
        else {
            goToAccountAndSecurity();
        }
    }, [onCancel, goToAccountAndSecurity]);
    const handleTermsContinue = useCallback(() => {
        setCurrentStep('enter');
    }, []);
    const handleEnterContinue = useCallback((newPassword) => {
        setPassword(newPassword);
        setCurrentStep('confirm');
    }, []);
    const handleEnterBack = useCallback(() => {
        setCurrentStep('terms');
    }, []);
    const runOnComplete = useCallback((pwd) => __awaiter(void 0, void 0, void 0, function* () {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            yield onComplete(pwd);
            setCurrentStep('success');
        }
        catch (_a) {
            setSubmitError(t('dyn_setup_password.confirm.error.failed'));
        }
        finally {
            setIsSubmitting(false);
        }
    }), [onComplete, t]);
    const handleConfirmContinue = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (skipKnowledgeCheck) {
            yield runOnComplete(password);
        }
        else {
            setCurrentStep('knowledge-check');
        }
    }), [skipKnowledgeCheck, runOnComplete, password]);
    const handleConfirmBack = useCallback(() => {
        setCurrentStep('enter');
    }, []);
    const handleKnowledgeCheckContinue = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        yield runOnComplete(password);
    }), [runOnComplete, password]);
    const handleKnowledgeCheckBack = useCallback(() => {
        setCurrentStep('confirm');
    }, []);
    const goToWallets = useCallback(() => {
        setDynamicWidgetView('wallets');
    }, [setDynamicWidgetView]);
    const handleSuccess = useCallback(() => {
        onDone === null || onDone === void 0 ? void 0 : onDone();
        if (onCancel) {
            goToWallets();
            setIsOpen(false);
        }
        else {
            goToAccountAndSecurity();
        }
    }, [onDone, onCancel, goToAccountAndSecurity, goToWallets, setIsOpen]);
    switch (currentStep) {
        case 'terms':
            return (jsx(SetupPasswordTermsView, { onContinue: handleTermsContinue, onBack: onCancel ? undefined : handleCancel }));
        case 'enter':
            return (jsx(SetupPasswordEnterView, { onContinue: handleEnterContinue, onBack: handleEnterBack }));
        case 'confirm':
            return (jsx(SetupPasswordConfirmView, { password: password, onContinue: handleConfirmContinue, onBack: handleConfirmBack, isLoading: isSubmitting && skipKnowledgeCheck, error: skipKnowledgeCheck ? submitError : null }));
        case 'knowledge-check':
            return (jsx(SetupPasswordKnowledgeCheckView, { onContinue: handleKnowledgeCheckContinue, onBack: handleKnowledgeCheckBack, isLoading: isSubmitting, error: submitError }));
        case 'success':
            return jsx(SetupPasswordSuccessView, { onDone: handleSuccess });
        default:
            return null;
    }
};

export { SetupPasswordView };
