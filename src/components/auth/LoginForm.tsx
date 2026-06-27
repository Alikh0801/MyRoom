"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { signIn, type AuthState } from "@/lib/auth/actions";
import {
  TurnstileField,
  useTurnstileRequired,
} from "@/components/auth/TurnstileField";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const t = useTranslations("auth.form");
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    signIn,
    null
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRequired = useTurnstileRequired();
  const submitDisabled = pending || (turnstileRequired && !turnstileToken);

  return (
    <form className="auth-form" action={formAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {state?.error && <p className="auth-form__error">{state.error}</p>}

      <label className="auth-form__field">
        {t("email")}
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
        />
      </label>

      <label className="auth-form__field">
        {t("password")}
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          minLength={6}
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
        {pending ? t("submitLoginPending") : t("submitLogin")}
      </button>

      <p className="auth-form__footer">
        {t("noAccount")}{" "}
        <Link href="/auth/register">{t("registerLink")}</Link>
      </p>
    </form>
  );
}
