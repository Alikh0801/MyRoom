"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { signIn, type AuthState } from "@/lib/auth/actions";
import { validateLoginForm } from "@/lib/form/validate-auth-form";
import {
  TurnstileField,
  useTurnstileRequired,
} from "@/components/auth/TurnstileField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const t = useTranslations("auth.form");
  const tErrors = useTranslations("auth.errors");
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    signIn,
    null
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRequired = useTurnstileRequired();
  const submitDisabled = pending || (turnstileRequired && !turnstileToken);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const validationError = validateLoginForm(
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

  const displayError = clientError ?? state?.error;

  return (
    <div className="auth-form-wrapper">
      <form className="auth-form" action={formAction} noValidate onSubmit={handleSubmit}>
        <input type="hidden" name="redirectTo" value={redirectTo} />

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

        <PasswordInput
          label={t("password")}
          name="password"
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          minLength={6}
        />

        <p className="auth-form__forgot">
          <Link href="/auth/forgot-password">{t("forgotPasswordLink")}</Link>
        </p>

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
          {pending ? t("submitLoginPending") : t("submitLogin")}
        </button>
      </form>

      <GoogleSignInButton redirectTo={redirectTo} />

      <p className="auth-form__footer">
        {t("noAccount")}{" "}
        <Link href="/auth/register">{t("registerLink")}</Link>
      </p>
    </div>
  );
}
