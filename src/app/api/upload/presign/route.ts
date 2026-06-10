import { NextResponse } from "next/server";
import { buildStoragePath, getPresignedUploadUrl } from "@/lib/storage/s3";
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
  const { listingId, fileName, contentType } = body as {
    listingId: string;
    fileName: string;
    contentType: string;
  };

  if (!listingId || !fileName || !contentType) {
    return NextResponse.json({ error: "Məlumat natamamdır" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(contentType)) {
    return NextResponse.json({ error: "Yalnız JPEG, PNG, WebP" }, { status: 400 });
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

  const storagePath = buildStoragePath(user.id, listingId, fileName);
  const uploadUrl = await getPresignedUploadUrl(storagePath, contentType);

  return NextResponse.json({ uploadUrl, storagePath });
}
