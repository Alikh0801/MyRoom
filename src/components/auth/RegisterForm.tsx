"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { signUp, type AuthState } from "@/lib/auth/actions";
import {
  TurnstileField,
  useTurnstileRequired,
} from "@/components/auth/TurnstileField";
import { LegalAcceptanceField } from "@/components/legal/LegalAcceptanceField";

export function RegisterForm() {
  const t = useTranslations("auth.form");
  const [state, formAction, pending] = useActionState<AuthState | null, FormData>(
    signUp,
    null
  );
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

  return (
    <form className="auth-form" action={formAction}>
      {state?.error && <p className="auth-form__error">{state.error}</p>}

      <label className="auth-form__field">
        {t("fullName")}
        <input
          type="text"
          name="fullName"
          required
          autoComplete="name"
          placeholder={t("fullNamePlaceholder")}
        />
      </label>

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
        {t("phone")}
        <input
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder={t("phonePlaceholder")}
        />
      </label>

      <label className="auth-form__checkbox">
        <input
          type="checkbox"
          checked={sameAsPhone}
          onChange={(e) => handleSameAsPhoneChange(e.target.checked)}
        />
        {t("whatsappSameAsPhone")}
      </label>

      {sameAsPhone ? (
        <input type="hidden" name="whatsappPhone" value={phone} />
      ) : (
        <label className="auth-form__field">
          {t("whatsapp")}
          <input
            type="tel"
            name="whatsappPhone"
            required
            autoComplete="tel"
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            placeholder={t("phonePlaceholder")}
          />
        </label>
      )}

      <label className="auth-form__field">
        {t("password")}
        <input
          type="password"
          name="password"
          required
          autoComplete="new-password"
          placeholder={t("passwordMinPlaceholder")}
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

      <LegalAcceptanceField />

      <button
        type="submit"
        className="btn btn--primary auth-form__submit"
        disabled={submitDisabled}
      >
        {pending ? t("submitRegisterPending") : t("submitRegister")}
      </button>

      <p className="auth-form__footer">
        {t("hasAccount")} <Link href="/auth/login">{t("loginLink")}</Link>
      </p>
    </form>
  );
}
