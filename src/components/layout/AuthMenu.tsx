"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";

function PersonIcon() {
  return (
    <svg
      className="auth-menu__icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.75" fill="currentColor" opacity="0.92" />
      <path
        d="M6.25 19.25c.65-3.05 2.95-4.75 5.75-4.75s5.1 1.7 5.75 4.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AuthMenu() {
  const t = useTranslations("nav");
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
    <div className="auth-menu" ref={rootRef}>
      <button
        type="button"
        className={`auth-menu__trigger${open ? " auth-menu__trigger--open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("authMenu")}
      >
        <span className="auth-menu__icon-wrap">
          <PersonIcon />
        </span>
      </button>

      {open && (
        <div className="user-menu__dropdown auth-menu__dropdown" role="menu">
          <div className="user-menu__links">
            <Link
              href="/auth/login"
              className="user-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {t("login")}
            </Link>
            <Link
              href="/auth/register"
              className="user-menu__item auth-menu__item--primary"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {t("register")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
