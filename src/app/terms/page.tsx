import { LegalDocument } from "@/components/legal/LegalDocument";
import { TERMS_INTRO, TERMS_SECTIONS } from "@/lib/legal/terms-az";

export const metadata = {
  title: "Şərtlər və qaydalar",
  description:
    "MyRoom platformasının istifadəçi şərtləri, elan qaydaları və hüquqi müddəalar.",
};

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="container">
        <LegalDocument
          title="İstifadəçi şərtləri və qaydalar"
          intro={TERMS_INTRO}
          sections={TERMS_SECTIONS}
          relatedHref="/privacy"
          relatedLabel="Məxfilik siyasəti"
        />
      </div>
    </div>
  );
}
