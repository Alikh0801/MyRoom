import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

/**
 * Naməlum ünvanlar üçün tutucu (catch-all) marşrut.
 *
 * Bu fayl olmadan `/ru/olmayan-sehife` kimi ünvanlar `[locale]` seqmentinə
 * heç düşmür və Next.js kök `not-found.tsx`-i göstərir — o isə həmişə default
 * dildədir (rus/türk istifadəçi Azərbaycan dilində 404 görürdü).
 *
 * Burada `notFound()` çağırmaqla `[locale]/not-found.tsx` işə düşür: səhifə
 * istifadəçinin dilində, başlıq/altlıq ilə birlikdə göstərilir.
 *
 * DİQQƏT: bu marşrut `(with-skeleton)` qrupundan kənardadır — yuxarıda
 * `loading.tsx` olsaydı cavab axınlanar və status 404 əvəzinə 200 qayıdardı
 * (axtarış motorları üçün "soft 404").
 */

type CatchAllProps = {
  params: Promise<{ locale: string; rest: string[] }>;
};

export default async function LocaleCatchAllPage({ params }: CatchAllProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  notFound();
}
