"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { updateAccount, type AccountState } from "@/lib/account/actions";

interface AccountFormProps {
  fullName: string;
  phone: string;
  email: string;
}

export function AccountForm({
  fullName: initialFullName,
  phone: initialPhone,
  email,
}: AccountFormProps) {
  const t = useTranslations("account");
  const [phone, setPhone] = useState(initialPhone);
  const [state, formAction, pending] = useActionState<
    AccountState | null,
    FormData
  >(updateAccount, null);

  return (
    <form action={formAction} className="auth-form account-form">
      {state?.error && <p className="auth-form__error">{state.error}</p>}
      {state?.success && <p className="auth-form__success">{state.success}</p>}

      <label className="auth-form__field">
        {t("fullName")}
        <input
          type="text"
          name="fullName"
          defaultValue={initialFullName}
          placeholder={t("fullNamePlaceholder")}
          minLength={3}
          maxLength={80}
          required
          autoComplete="name"
        />
      </label>

      <PhoneInput
        label={t("phone")}
        name="phone"
        value={phone}
        onChange={setPhone}
        placeholder={t("phonePlaceholder")}
        autoComplete="tel-national"
      />

      {/* Email yalnız məlumat üçündür — dəyişdirilməsi ayrıca təsdiq axını tələb edir */}
      <label className="auth-form__field">
        {t("email")}
        <input type="email" value={email} disabled readOnly />
        <span className="account-form__hint">{t("emailHint")}</span>
      </label>

      <button
        type="submit"
        className="btn btn--primary auth-form__submit"
        disabled={pending}
      >
        {pending ? t("saving") : t("save")}
      </button>
    </form>
  );
}
