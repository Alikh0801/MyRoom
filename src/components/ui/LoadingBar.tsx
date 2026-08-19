import { getTranslations } from "next-intl/server";

export async function LoadingBar() {
  const t = await getTranslations("common");

  return (
    <div className="loading-bar" role="progressbar" aria-label={t("loading")}>
      <div className="loading-bar__progress" />
    </div>
  );
}
