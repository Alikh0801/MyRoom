"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { submitSupportMessage } from "@/lib/support/actions";

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Şikayət/təklif modalı. Vəziyyəti kənardan idarə olunur — həm başlıqdakı
 * ikon, həm də mobil profil menyusundakı sətir eyni modalı açır, ona görə
 * modal menyunun içində yox, ondan kənarda render olunmalıdır (menyu
 * bağlananda modal da bağlanmasın deyə).
 */
export function SupportModal({ open, onClose }: SupportModalProps) {
  const t = useTranslations("support");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    firstFieldRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  function close() {
    onClose();
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

  if (!open) return null;

  return (
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
            <button type="button" className="btn btn--primary" onClick={close}>
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
  );
}
