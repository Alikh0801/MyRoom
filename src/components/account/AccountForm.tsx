"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { PhoneInput, toLocalDigits } from "@/components/auth/PhoneInput";
import { updateAccount, type AccountState } from "@/lib/account/actions";

const AZ_PREFIX = "+994";

function toFullPhone(localDigits: string): string {
  return localDigits ? `${AZ_PREFIX}${localDigits}` : "";
}

interface AccountFormProps {
  fullName: string;
  phone: string;
  whatsappPhone: string;
  email: string;
}

export function AccountForm({
  fullName: initialFullName,
  phone: initialPhone,
  whatsappPhone: initialWhatsapp,
  email,
}: AccountFormProps) {
  const t = useTranslations("account");
  // Vəziyyətdə YALNIZ yerli rəqəmlər saxlanılır ("501234567"). Bazadan gələn
  // dəyər "+994..." formatındadır, ona görə başlanğıcda çevrilir — əks halda
  // "+994" prefiksi ikiqat əlavə olunurdu.
  const [phone, setPhone] = useState(() => toLocalDigits(initialPhone));
  const [whatsappPhone, setWhatsappPhone] = useState(() =>
    toLocalDigits(initialWhatsapp)
  );
  // Mövcud nömrələr eynidirsə, checkbox onsuz da işarələnmiş açılır
  const [sameAsPhone, setSameAsPhone] = useState(() => {
    const p = toLocalDigits(initialPhone);
    return Boolean(p) && p === toLocalDigits(initialWhatsapp);
  });
  const [state, formAction, pending] = useActionState<
    AccountState | null,
    FormData
  >(updateAccount, null);

  function handlePhoneChange(value: string) {
    setPhone(value);
    if (sameAsPhone) setWhatsappPhone(value);
  }

  function handleSameAsPhoneChange(checked: boolean) {
    setSameAsPhone(checked);
    if (checked) setWhatsappPhone(phone);
  }

  return (
    <form action={formAction} className="account-form">
      {state?.error && <p className="auth-form__error">{state.error}</p>}
      {state?.success && <p className="auth-form__success">{state.success}</p>}

      <section className="account-form__section">
        <h2 className="account-form__legend">{t("sections.personal")}</h2>

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
      </section>

      <section className="account-form__section">
        <h2 className="account-form__legend">{t("sections.contact")}</h2>

        <div className="account-form__row">
          <PhoneInput
            label={t("phone")}
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={t("phonePlaceholder")}
            autoComplete="tel-national"
          />

          {sameAsPhone ? (
            <input type="hidden" name="whatsappPhone" value={toFullPhone(phone)} />
          ) : (
            <PhoneInput
              label={t("whatsapp")}
              name="whatsappPhone"
              value={whatsappPhone}
              onChange={setWhatsappPhone}
              placeholder={t("phonePlaceholder")}
            />
          )}
        </div>

        <label className="account-form__checkbox">
          <input
            type="checkbox"
            name="whatsappSameAsPhone"
            checked={sameAsPhone}
            onChange={(e) => handleSameAsPhoneChange(e.target.checked)}
          />
          {t("whatsappSameAsPhone")}
        </label>

        <p className="account-form__note">{t("contactNote")}</p>
      </section>

      <section className="account-form__section">
        <h2 className="account-form__legend">{t("sections.login")}</h2>

        {/* Email dəyişikliyi ayrıca təsdiq axını tələb edir — burada yalnız göstərilir */}
        <label className="auth-form__field">
          {t("email")}
          <input type="email" value={email} disabled readOnly />
          <span className="account-form__hint">{t("emailHint")}</span>
        </label>
      </section>

      <div className="account-form__actions">
        <button type="submit" className="btn btn--primary" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
