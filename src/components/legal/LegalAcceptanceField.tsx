import Link from "next/link";

interface LegalAcceptanceFieldProps {
  className?: string;
}

export function LegalAcceptanceField({ className }: LegalAcceptanceFieldProps) {
  return (
    <label
      className={`legal-acceptance${className ? ` ${className}` : ""}`}
    >
      <input type="checkbox" name="acceptTerms" required />
      <span className="legal-acceptance__text">
        <Link href="/terms" target="_blank" rel="noopener noreferrer">
          İstifadəçi şərtləri və qaydaları
        </Link>
        {" "}və{" "}
        <Link href="/privacy" target="_blank" rel="noopener noreferrer">
          Məxfilik siyasətini
        </Link>
        {" "}oxudum və qəbul edirəm *
      </span>
    </label>
  );
}
