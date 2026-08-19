import type { Locale } from "@/i18n/routing";

interface FlagIconProps {
  locale: Locale;
  className?: string;
}

/**
 * Hand-drawn SVG flags. Emoji flags (🇦🇿 etc.) don't render as pictures on
 * every OS/font combination (many Linux setups fall back to the two-letter
 * region code), so we render actual flag shapes instead.
 */
export function FlagIcon({ locale, className }: FlagIconProps) {
  if (locale === "ru") {
    return (
      <svg
        className={className}
        width="20"
        height="14"
        viewBox="0 0 24 16"
        aria-hidden="true"
      >
        <rect width="24" height="16" fill="#fff" />
        <rect y="5.33" width="24" height="5.34" fill="#0039A6" />
        <rect y="10.67" width="24" height="5.33" fill="#D52B1E" />
      </svg>
    );
  }

  if (locale === "tr") {
    return (
      <svg
        className={className}
        width="20"
        height="14"
        viewBox="0 0 24 16"
        aria-hidden="true"
      >
        <rect width="24" height="16" fill="#E30A17" />
        <mask id="tr-crescent">
          <rect width="24" height="16" fill="#fff" />
          <circle cx="9.6" cy="8" r="3.6" fill="#000" />
        </mask>
        <circle cx="8.4" cy="8" r="4.3" fill="#fff" mask="url(#tr-crescent)" />
        <polygon
          points="14,5.7 14.53,7.27 16.19,7.29 14.86,8.28 15.35,9.86 14,8.9 12.65,9.86 13.14,8.28 11.81,7.29 13.47,7.27"
          fill="#fff"
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width="20"
      height="14"
      viewBox="0 0 24 16"
      aria-hidden="true"
    >
      <rect width="24" height="16" fill="#00B5E2" />
      <rect y="5.33" width="24" height="5.34" fill="#EF3340" />
      <rect y="10.67" width="24" height="5.33" fill="#509E2F" />
      <mask id="az-crescent">
        <rect y="5.33" width="24" height="5.34" fill="#fff" />
        <circle cx="12.9" cy="8" r="1.6" fill="#000" />
      </mask>
      <circle cx="11" cy="8" r="1.9" fill="#fff" mask="url(#az-crescent)" />
      <polygon
        points="15,6.4 15.35,7.51 16.52,7.51 15.57,8.19 15.94,9.29 15,8.6 14.06,9.29 14.43,8.19 13.48,7.51 14.65,7.51"
        fill="#fff"
      />
    </svg>
  );
}
