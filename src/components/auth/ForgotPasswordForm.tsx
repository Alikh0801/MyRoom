"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { requestPasswordReset, type AuthState } from "@/lib/auth/actions";
import { validateForgotPasswordForm } from "@/lib/form/validate-auth-form";
import {
  TurnstileField,
  useTurnstileRequired,
} from "@/components/auth/TurnstileField";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.form");
  const tForgot = useTranslations("auth.forgot");
  const tErrors = useTranslations("auth.errors");
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    requestPasswordReset,
    null
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRequired = useTurnstileRequired();
  const submitDisabled = pending || (turnstileRequired && !turnstileToken);
  const displayError = clientError ?? state?.error;
  const emailSent = Boolean(state?.success);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const validationError = validateForgotPasswordForm(
      new FormData(event.currentTarget),
      (key) => tErrors(key)
    );

    if (validationError) {
      event.preventDefault();
      setClientError(validationError);
      return;
    }

    setClientError(null);
  }

  if (emailSent) {
    return (
      <div className="auth-form">
        <p className="auth-form__success">{state?.success}</p>
        <p className="auth-form__footer">
          <Link href="/auth/login">{t("loginLink")}</Link>
        </p>
      </div>
    );
  }

  return (
    <form className="auth-form" action={formAction} noValidate onSubmit={handleSubmit}>
      {displayError && <p className="auth-form__error">{displayError}</p>}

      <label className="auth-form__field">
        {t("email")}
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
        />
      </label>

      {turnstileRequired && (
        <input type="hidden" name="turnstileToken" value={turnstileToken} />
      )}
      <TurnstileField
        resetKey={state?.error}
        onTokenChange={setTurnstileToken}
      />

      <button
        type="submit"
        className="btn btn--primary auth-form__submit"
        disabled={submitDisabled}
      >
        {pending ? tForgot("submitPending") : tForgot("submit")}
      </button>

      <p className="auth-form__footer">
        <Link href="/auth/login">{tForgot("backToLogin")}</Link>
      </p>
    </form>
  );
}
