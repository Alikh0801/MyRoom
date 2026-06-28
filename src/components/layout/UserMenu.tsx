"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/auth/actions";

interface UserMenuProps {
  fullName: string | null;
  email?: string;
  avatarUrl: string | null;
  isAdmin?: boolean;
}

function getInitials(fullName: string | null, email?: string) {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email[0]?.toUpperCase() ?? "?";
  return "?";
}

export function UserMenu({
  fullName,
  email,
  avatarUrl,
  isAdmin = false,
}: UserMenuProps) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initials = getInitials(fullName, email);

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
    <div className="user-menu" ref={rootRef}>
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("accountMenu")}
      >
        <span className="user-menu__avatar">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={36}
              height={36}
              className="user-menu__avatar-img"
            />
          ) : (
            initials
          )}
        </span>
        <svg
          className={`user-menu__chevron${open ? " user-menu__chevron--open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="user-menu__dropdown" role="menu">
          <div className="user-menu__profile">
            <p className="user-menu__name">{fullName ?? t("myAccount")}</p>
            {email && <p className="user-menu__email">{email}</p>}
          </div>

          <div className="user-menu__links">
            <Link
              href="/dashboard/listings"
              className="user-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {t("myListings")}
            </Link>
            <Link
              href="/dashboard/favorites"
              className="user-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {t("myFavorites")}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="user-menu__item"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {t("admin")}
              </Link>
            )}
          </div>

          <form action={signOut} className="user-menu__signout">
            <button type="submit" className="user-menu__item user-menu__item--danger">
              {t("signOut")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
