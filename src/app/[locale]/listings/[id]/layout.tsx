import { notFound } from "next/navigation";
import { getListingById } from "@/lib/queries/listings";

/**
 * Elanın mövcudluğunu loading.tsx-in Suspense sərhədindən YUXARIDA yoxlayır.
 *
 * loading.tsx öz seqmentini stream etdiyi üçün, notFound() səhifə komponentində
 * çağırılsa cavab artıq 200 kimi bağlanmış olur (soft 404). Layout sərhəddən
 * yuxarıda render olunduğuna görə buradakı notFound() real 404 verir və
 * səhifə eyni zamanda skeleton göstərə bilir.
 *
 * getListingById cache() ilə bükülüb — layout və səhifə eyni sorğunu bölüşür.
 */
export default async function ListingDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) notFound();

  return <>{children}</>;
}
