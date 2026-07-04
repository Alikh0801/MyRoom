"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  resendVerificationOtp,
  verifyEmailOtp,
  type AuthState,
} from "@/lib/auth/actions";
import { EMAIL_OTP_LENGTH } from "@/lib/auth/otp";

const RESEND_COOLDOWN_SEC = 60;
const VERIFY_EMAIL_STORAGE_KEY = "myroom-verify-email";

interface VerifyEmailFormProps {
  email: string;
  isUnconfirmed?: boolean;
  otpExpiryMinutes: number;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(1, local.length - visible.length))}@${domain}`;
}

export function VerifyEmailForm({
  email: initialEmail,
  isUnconfirmed,
  otpExpiryMinutes,
}: VerifyEmailFormProps) {
  const t = useTranslations("auth.verify");
  const [email] = useState(() => {
    if (typeof window === "undefined") {
      return initialEmail;
    }

    if (initialEmail) {
      sessionStorage.setItem(VERIFY_EMAIL_STORAGE_KEY, initialEmail);
      return initialEmail;
    }

    return sessionStorage.getItem(VERIFY_EMAIL_STORAGE_KEY) ?? initialEmail;
  });
  const [verifyState, verifyAction, verifyPending] = useActionState<
    AuthState | null,
    FormData
  >(verifyEmailOtp, null);
  const [resendState, resendAction, resendPending] = useActionState<
    AuthState | null,
    FormData
  >(resendVerificationOtp, null);
  const [digits, setDigits] = useState<string[]>(
    Array(EMAIL_OTP_LENGTH).fill("")
  );
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (resendState?.success) {
      setCooldown(RESEND_COOLDOWN_SEC);
      setDigits(Array(EMAIL_OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  }, [resendState?.success]);

  useEffect(() => {
    if (verifyState?.errorKey !== "invalidToken") return;
    setCooldown(0);
    setDigits(Array(EMAIL_OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }, [verifyState?.errorKey]);

  const token = digits.join("");
  const error = verifyState?.error ?? resendState?.error;
  const success = resendState?.success;
  const tokenExpired = verifyState?.errorKey === "invalidToken";

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < EMAIL_OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, EMAIL_OTP_LENGTH);

    if (!pasted) return;

    const next = Array(EMAIL_OTP_LENGTH)
      .fill("")
      .map((_, index) => pasted[index] ?? "");
    setDigits(next);

    const focusIndex = Math.min(pasted.length, EMAIL_OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  const canResend = cooldown <= 0 && !resendPending;

  return (
    <div className="auth-form">
      {error && <p className="auth-form__error">{error}</p>}
      {success && <p className="auth-form__success">{success}</p>}

      <p className="auth-verify-email__hint">
        {isUnconfirmed ? t("hintUnconfirmed") : t("hintSignup")}
      </p>
      <p className="auth-verify-email__email">{maskEmail(email)}</p>
      <p className="auth-verify-email__expiry">
        {t("expiryHint", { minutes: otpExpiryMinutes })}
      </p>

      {tokenExpired && (
        <p className="auth-verify-email__expired-note">{t("expiredNote")}</p>
      )}

      <form action={verifyAction} className="auth-verify-email">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={token} />

        <div className="auth-otp" role="group" aria-label={t("otpLabel")}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              className="auth-otp__digit"
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              disabled={verifyPending}
              aria-label={t("otpDigit", { index: index + 1 })}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event.key)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        <button
          type="submit"
          className="btn btn--primary auth-form__submit"
          disabled={verifyPending || token.length !== EMAIL_OTP_LENGTH}
        >
          {verifyPending ? t("submitPending") : t("submit")}
        </button>
      </form>

      <form action={resendAction} className="auth-verify-email__resend">
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          className="auth-verify-email__resend-btn"
          disabled={!canResend}
        >
          {resendPending
            ? t("resendPending")
            : cooldown > 0
              ? t("resendCooldown", { seconds: cooldown })
              : t("resend")}
        </button>
      </form>
    </div>
  );
}
