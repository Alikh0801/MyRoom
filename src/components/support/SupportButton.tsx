"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SupportIcon } from "@/components/support/SupportIcon";

interface SupportButtonProps {
  /** Qonaqlarda ikon modal açmır — giriş səhifəsinə aparır */
  isLoggedIn: boolean;
  /** Daxil olmuş istifadəçidə modalı açır (modal HeaderActions-da saxlanılır) */
  onOpen?: () => void;
}

/**
 * Başlıqdakı dəstək ikonu. Mobil ekranlarda gizlədilir — orada eyni əməliyyat
 * profil menyusunun içindən açılır (bax: HeaderActions).
 */
export function SupportButton({ isLoggedIn, onOpen }: SupportButtonProps) {
  const t = useTranslations("support");

  if (!isLoggedIn) {
    return (
      <Link
        href="/auth/login?redirectTo=/"
        className="support-btn support-btn--desktop"
        aria-label={t("open")}
        title={t("open")}
      >
        <SupportIcon />
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="support-btn support-btn--desktop"
      onClick={onOpen}
      aria-label={t("open")}
      title={t("open")}
    >
      <SupportIcon />
    </button>
  );
}
