import { PageLoading } from "@/components/ui/PageLoading";

/** Yalnız /blog indeksinə aiddir — blog/[slug] real 404 qaytarmalıdır. */
export default function Loading() {
  return <PageLoading />;
}
