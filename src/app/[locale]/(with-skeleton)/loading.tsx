import { PageLoading } from "@/components/ui/PageLoading";

/**
 * loading.tsx seqmentin bütün alt ağacını Suspense-ə bükür, Suspense isə
 * cavabı stream edir — Next.js stream olunan cavabda həmişə 200 göndərir.
 * Ona görə bu fayl yalnız notFound() çağıra bilməyən səhifələri əhatə edən
 * route group-un içindədir. 404 verə bilən route-lar (listings/[id],
 * owners/[id], blog/[slug]) qəsdən bu qrupdan kənardadır ki, real 404
 * qaytara bilsinlər.
 */
export default function Loading() {
  return <PageLoading />;
}
