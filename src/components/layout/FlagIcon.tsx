import type { Locale } from "@/i18n/routing";

interface FlagIconProps {
  locale: Locale;
  className?: string;
}

/**
 * Bayraqlar SVG kimi çəkilib — emoji bayraqlar (🇦🇿, 🇹🇷 …) bütün
 * əməliyyat sistemi/şrift kombinasiyalarında şəkil kimi göstərilmir.
 *
 * Aypara `path` ilə (iki qövs) çəkilir, `mask` ilə yox: eyni səhifədə
 * bir neçə bayraq render olunduğu üçün təkrarlanan `id` problemi olmasın.
 */
export function FlagIcon({ locale, className }: FlagIconProps) {
  const common = {
    className,
    width: 21,
    height: 14,
    viewBox: "0 0 30 20",
    role: "presentation" as const,
    "aria-hidden": true,
  };

  if (locale === "ru") {
    return (
      <svg {...common}>
        <rect width="30" height="20" fill="#fff" />
        <rect y="6.67" width="30" height="6.66" fill="#0039A6" />
        <rect y="13.33" width="30" height="6.67" fill="#D52B1E" />
        <rect
          width="30"
          height="20"
          fill="none"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (locale === "tr") {
    return (
      <svg {...common}>
        <rect width="30" height="20" fill="#E30A17" />
        {/* Aypara: xarici dairə (m 10,10 r 5) − daxili dairə (m 11.5,10 r 4) */}
        <path
          d="M13.75,6.69 A5,5 0 1,0 13.75,13.31 A4,4 0 1,1 13.75,6.69 Z"
          fill="#fff"
        />
        {/* Beşguşəli ulduz, mərkəz (16.5,10) */}
        <polygon
          points="14.00,10.00 15.73,9.44 15.73,7.62 16.80,9.09 18.52,8.53 17.45,10.00 18.52,11.47 16.80,10.91 15.73,12.38 15.73,10.56"
          fill="#fff"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect width="30" height="20" fill="#00B5E2" />
      <rect y="6.67" width="30" height="6.66" fill="#EF3340" />
      <rect y="13.33" width="30" height="6.67" fill="#509E2F" />
      {/* Aypara: xarici dairə (m 13,10 r 3.6) − daxili dairə (m 14.3,10 r 3) */}
      <path
        d="M15.17,7.13 A3.6,3.6 0 1,0 15.17,12.87 A3,3 0 1,1 15.17,7.13 Z"
        fill="#fff"
      />
      {/* Səkkizguşəli ulduz, mərkəz (18.2,10) */}
      <polygon
        points="20.60,10.00 19.41,10.50 19.90,11.70 18.70,11.21 18.20,12.40 17.70,11.21 16.50,11.70 16.99,10.50 15.80,10.00 16.99,9.50 16.50,8.30 17.70,8.79 18.20,7.60 18.70,8.79 19.90,8.30 19.41,9.50"
        fill="#fff"
      />
    </svg>
  );
}
