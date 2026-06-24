import { LegalDocument } from "@/components/legal/LegalDocument";
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from "@/lib/legal/privacy-az";

export const metadata = {
  title: "Məxfilik siyasəti",
  description:
    "MyRoom platformasında şəxsi məlumatların toplanması, emalı və qorunması qaydaları.",
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="container">
        <LegalDocument
          title="Məxfilik siyasəti"
          intro={PRIVACY_INTRO}
          sections={PRIVACY_SECTIONS}
          relatedHref="/terms"
          relatedLabel="İstifadəçi şərtləri və qaydalar"
        />
      </div>
    </div>
  );
}
