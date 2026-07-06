"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { updatePassword, type AuthState } from "@/lib/auth/actions";
import { validateResetPasswordForm } from "@/lib/form/validate-auth-form";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function ResetPasswordForm() {
  const t = useTranslations("auth.form");
  const tReset = useTranslations("auth.reset");
  const tErrors = useTranslations("auth.errors");
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    updatePassword,
    null
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const displayError = clientError ?? state?.error;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const validationError = validateResetPasswordForm(
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

  return (
    <form className="auth-form" action={formAction} noValidate onSubmit={handleSubmit}>
      {displayError && <p className="auth-form__error">{displayError}</p>}

      <PasswordInput
        label={t("password")}
        name="password"
        autoComplete="new-password"
        placeholder={t("passwordMinPlaceholder")}
        minLength={6}
      />

      <PasswordInput
        label={tReset("confirmPassword")}
        name="confirmPassword"
        autoComplete="new-password"
        placeholder={t("passwordMinPlaceholder")}
        minLength={6}
      />

      <button
        type="submit"
        className="btn btn--primary auth-form__submit"
        disabled={pending}
      >
        {pending ? tReset("submitPending") : tReset("submit")}
      </button>

      <p className="auth-form__footer">
        <Link href="/auth/forgot-password">{tReset("requestNewLink")}</Link>
      </p>
    </form>
  );
}
