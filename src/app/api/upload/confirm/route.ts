import { NextResponse } from "next/server";
import { getPublicUrl } from "@/lib/storage/s3";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş tələb olunur" }, { status: 401 });
  }

  const body = await request.json();
  const { listingId, storagePath, isCover, sortOrder } = body as {
    listingId: string;
    storagePath: string;
    isCover?: boolean;
    sortOrder?: number;
  };

  if (!listingId || !storagePath) {
    return NextResponse.json({ error: "Məlumat natamamdır" }, { status: 400 });
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id")
    .eq("id", listingId)
    .eq("owner_id", user.id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Elan tapılmadı" }, { status: 404 });
  }

  const url = getPublicUrl(storagePath);

  const { data: image, error } = await supabase
    .from("listing_images")
    .insert({
      listing_id: listingId,
      url,
      storage_path: storagePath,
      is_cover: isCover ?? false,
      sort_order: sortOrder ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ image });
}
