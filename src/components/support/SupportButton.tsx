"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { submitSupportMessage } from "@/lib/support/actions";

function SupportIcon() {
  return (
    <svg
      className="support-btn__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

interface SupportButtonProps {
  /** Qonaqlarda ikon modal açmır — giriş səhifəsinə aparır */
  isLoggedIn: boolean;
}

export function SupportButton({ isLoggedIn }: SupportButtonProps) {
  const t = useTranslations("support");
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    firstFieldRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setError(null);
    setDone(false);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitSupportMessage(formData);
      if (result.ok) {
        setDone(true);
      } else {
        setError(t(`errors.${result.error}`));
      }
    });
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/auth/login?redirectTo=/"
        className="support-btn"
        aria-label={t("open")}
        title={t("open")}
      >
        <SupportIcon />
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="support-btn"
        onClick={() => setOpen(true)}
        aria-label={t("open")}
        title={t("open")}
      >
        <SupportIcon />
      </button>

      {open && (
        <div
          className="support-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-modal-title"
          onClick={(e) => {
            if (!dialogRef.current?.contains(e.target as Node)) close();
          }}
        >
          <div className="support-modal__panel" ref={dialogRef}>
            <button
              type="button"
              className="support-modal__close"
              onClick={close}
              aria-label={t("close")}
            >
              ×
            </button>

            {done ? (
              <div className="support-modal__done">
                <h2 id="support-modal-title" className="support-modal__title">
                  {t("sentTitle")}
                </h2>
                <p className="support-modal__text">{t("sentText")}</p>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={close}
                >
                  {t("close")}
                </button>
              </div>
            ) : (
              <>
                <h2 id="support-modal-title" className="support-modal__title">
                  {t("title")}
                </h2>
                <p className="support-modal__text">{t("description")}</p>

                <form action={handleSubmit} className="support-form">
                  {error && <p className="auth-form__error">{error}</p>}

                  <label className="support-form__field">
                    {t("subject")}
                    <input
                      ref={firstFieldRef}
                      name="subject"
                      required
                      maxLength={120}
                      placeholder={t("subjectPlaceholder")}
                    />
                  </label>

                  <label className="support-form__field">
                    {t("message")}
                    <textarea
                      name="body"
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={6}
                      placeholder={t("messagePlaceholder")}
                    />
                  </label>

                  <button
                    type="submit"
                    className="btn btn--primary support-form__submit"
                    disabled={isPending}
                  >
                    {isPending ? t("sending") : t("send")}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
