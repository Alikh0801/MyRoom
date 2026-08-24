"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { signInWithGoogle } from "@/lib/auth/actions";

interface GoogleSignInButtonProps {
  redirectTo?: string;
  showConsent?: boolean;
}

function GoogleIcon() {
  return (
    <svg
      className="btn__icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A9.001 9.001 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

function GoogleDomainHint() {
  const t = useTranslations("auth.form");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="google-hint" ref={rootRef}>
      <button
        type="button"
        className="google-hint__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={t("googleDomainHintLabel")}
      >
        ?
      </button>

      {open && (
        <div className="google-hint__popover" role="tooltip">
          {t("googleDomainHint")}
        </div>
      )}
    </div>
  );
}

export function GoogleSignInButton({
  redirectTo = "/",
  showConsent = false,
}: GoogleSignInButtonProps) {
  const t = useTranslations("auth.form");
  const tLegal = useTranslations("legal");
  const action = signInWithGoogle.bind(null, redirectTo);

  return (
    <div className="auth-form__oauth">
      <div className="auth-form__divider">
        <span>{t("orDivider")}</span>
      </div>

      <div className="auth-form__google-row">
        <form action={action} className="auth-form__google-form">
          <button type="submit" className="btn btn--google auth-form__google">
            <GoogleIcon />
            {t("continueWithGoogle")}
          </button>
        </form>
        <GoogleDomainHint />
      </div>

      {showConsent && (
        <p className="auth-form__google-consent">
          {t("googleConsentPrefix")}{" "}
          <Link href="/terms" target="_blank" rel="noopener noreferrer">
            {tLegal("acceptTermsLink")}
          </Link>{" "}
          {tLegal("acceptAnd")}{" "}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
            {tLegal("acceptPrivacyLink")}
          </Link>{" "}
          {t("googleConsentSuffix")}
        </p>
      )}
    </div>
  );
}
