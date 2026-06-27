import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="container empty-state">
      <h1 className="section__title">{t("pageNotFound")}</h1>
      <p className="section__subtitle">{t("pageNotFoundText")}</p>
      <Link href="/" className="btn btn--primary" style={{ marginTop: "1rem" }}>
        {t("backHome")}
      </Link>
    </div>
  );
}
