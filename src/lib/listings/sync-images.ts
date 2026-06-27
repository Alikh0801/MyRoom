import type { SupabaseClient } from "@supabase/supabase-js";
import { deleteFile } from "@/lib/storage/s3";

export async function syncListingImages(
  supabase: SupabaseClient,
  listingId: string,
  deletedIds: string[],
  imageOrder: string[]
): Promise<{ error?: string }> {
  const uniqueDeleted = [...new Set(deletedIds.filter(Boolean))];
  const uniqueOrder = [...new Set(imageOrder.filter(Boolean))];

  if (uniqueDeleted.length > 0) {
    const { data: rows, error: fetchError } = await supabase
      .from("listing_images")
      .select("id, storage_path")
      .eq("listing_id", listingId)
      .in("id", uniqueDeleted);

    if (fetchError || !rows || rows.length !== uniqueDeleted.length) {
      return { error: fetchError?.message ?? "fetch_failed" };
    }

    const { error: deleteError } = await supabase
      .from("listing_images")
      .delete()
      .eq("listing_id", listingId)
      .in("id", uniqueDeleted);

    if (deleteError) {
      return { error: deleteError.message };
    }

    await Promise.all(
      rows.map((row) =>
        deleteFile(row.storage_path).catch((err) => {
          console.error("syncListingImages S3 delete:", err);
        })
      )
    );
  }

  if (uniqueOrder.length > 0) {
    for (let i = 0; i < uniqueOrder.length; i++) {
      const { error } = await supabase
        .from("listing_images")
        .update({ sort_order: i, is_cover: i === 0 })
        .eq("id", uniqueOrder[i])
        .eq("listing_id", listingId);

      if (error) {
        return { error: error.message };
      }
    }
  }

  return {};
}
