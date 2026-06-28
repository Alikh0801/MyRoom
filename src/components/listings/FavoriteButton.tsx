"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { toggleFavorite } from "@/lib/favorites/actions";

interface FavoriteButtonProps {
  listingId: string;
  initialFavorited?: boolean;
  isLoggedIn?: boolean;
  variant?: "card" | "detail";
  className?: string;
}

export function FavoriteButton({
  listingId,
  initialFavorited = false,
  isLoggedIn = false,
  variant = "card",
  className = "",
}: FavoriteButtonProps) {
  const t = useTranslations("favorites");
  const router = useRouter();
  const pathname = usePathname();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push(
        `/auth/login?redirectTo=${encodeURIComponent(pathname || "/")}`
      );
      return;
    }

    startTransition(async () => {
      const result = await toggleFavorite(listingId);

      if (result.error) {
        return;
      }

      if (typeof result.favorited === "boolean") {
        setFavorited(result.favorited);
      }
    });
  }

  const label = favorited ? t("remove") : t("add");

  return (
    <button
      type="button"
      className={`favorite-btn favorite-btn--${variant}${
        favorited ? " favorite-btn--active" : ""
      }${pending ? " favorite-btn--pending" : ""} ${className}`.trim()}
      onClick={handleClick}
      aria-pressed={favorited}
      aria-label={label}
      title={label}
      disabled={pending}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="favorite-btn__icon"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.75"
        />
      </svg>
    </button>
  );
}
