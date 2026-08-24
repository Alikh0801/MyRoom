"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { signUp, type AuthState } from "@/lib/auth/actions";
import { validateRegisterForm } from "@/lib/form/validate-auth-form";
import {
  TurnstileField,
  useTurnstileRequired,
} from "@/components/auth/TurnstileField";
import { LegalAcceptanceField } from "@/components/legal/LegalAcceptanceField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export function RegisterForm() {
  const t = useTranslations("auth.form");
  const tErrors = useTranslations("auth.errors");
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    signUp,
    null
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRequired = useTurnstileRequired();

  function handleSameAsPhoneChange(checked: boolean) {
    setSameAsPhone(checked);
    if (checked) {
      setWhatsappPhone(phone);
    }
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    if (sameAsPhone) {
      setWhatsappPhone(value);
    }
  }

  const submitDisabled = pending || (turnstileRequired && !turnstileToken);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const validationError = validateRegisterForm(
      new FormData(event.currentTarget),
      sameAsPhone,
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
        {displayError && <p className="auth-form__error">{displayError}</p>}

        <label className="auth-form__field">
          {t("fullName")}
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            placeholder={t("fullNamePlaceholder")}
          />
        </label>

        <label className="auth-form__field">
          {t("email")}
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
          />
        </label>

        <PhoneInput
          label={t("phone")}
          name="phone"
          value={phone}
          onChange={handlePhoneChange}
          placeholder={t("phonePlaceholder")}
        />

        <label className="auth-form__checkbox">
          <input
            type="checkbox"
            checked={sameAsPhone}
            onChange={(e) => handleSameAsPhoneChange(e.target.checked)}
          />
          {t("whatsappSameAsPhone")}
        </label>

        {sameAsPhone ? (
          <input
            type="hidden"
            name="whatsappPhone"
            value={phone ? `+994${phone.replace(/\D/g, "").slice(0, 9)}` : ""}
          />
        ) : (
          <PhoneInput
            label={t("whatsapp")}
            name="whatsappPhone"
            value={whatsappPhone}
            onChange={setWhatsappPhone}
            placeholder={t("phonePlaceholder")}
          />
        )}

        <PasswordInput
          label={t("password")}
          name="password"
          autoComplete="new-password"
          placeholder={t("passwordMinPlaceholder")}
          minLength={6}
        />

        {turnstileRequired && (
          <input type="hidden" name="turnstileToken" value={turnstileToken} />
        )}
        <TurnstileField
          resetKey={state?.error}
          onTokenChange={setTurnstileToken}
        />

        <LegalAcceptanceField />

        <button
          type="submit"
          className="btn btn--primary auth-form__submit"
          disabled={submitDisabled}
        >
          {pending ? t("submitRegisterPending") : t("submitRegister")}
        </button>
      </form>

      <GoogleSignInButton showConsent />

      <p className="auth-form__footer">
        {t("hasAccount")} <Link href="/auth/login">{t("loginLink")}</Link>
      </p>
    </div>
  );
}
