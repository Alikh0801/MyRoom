"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface CreateListingState {
  error?: string;
  listingId?: string;
}

export async function createListing(
  _prevState: CreateListingState | null,
  formData: FormData
): Promise<CreateListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Giriş tələb olunur." };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const categoryId = formData.get("categoryId") as string;
  const pricePerNight = Number(formData.get("pricePerNight"));
  const city = (formData.get("city") as string)?.trim();
  const region = (formData.get("region") as string)?.trim();
  const address = (formData.get("address") as string)?.trim() || null;
  const maxGuests = Number(formData.get("maxGuests"));
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  const whatsappPhone = (formData.get("whatsappPhone") as string)?.trim();
  const amenityIds = formData.getAll("amenities") as string[];

  if (!title || title.length < 5) {
    return { error: "Başlıq ən azı 5 simvol olmalıdır." };
  }
  if (!description || description.length < 20) {
    return { error: "Təsvir ən azı 20 simvol olmalıdır." };
  }
  if (!categoryId) {
    return { error: "Kateqoriya seçin." };
  }
  if (!pricePerNight || pricePerNight <= 0) {
    return { error: "Düzgün qiymət daxil edin." };
  }
  if (!city || !region) {
    return { error: "Şəhər və rayon mütləqdir." };
  }
  if (!maxGuests || maxGuests < 1) {
    return { error: "Qonaq sayı ən azı 1 olmalıdır." };
  }
  if (!whatsappPhone) {
    return { error: "WhatsApp nömrəsi mütləqdir." };
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      category_id: categoryId,
      title,
      description,
      price_per_night: pricePerNight,
      city,
      region,
      address,
      max_guests: maxGuests,
      bedrooms: bedrooms >= 0 ? bedrooms : 1,
      bathrooms: bathrooms >= 0 ? bathrooms : 1,
      whatsapp_phone: whatsappPhone,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !listing) {
    return { error: error?.message ?? "Elan yaradıla bilmədi." };
  }

  if (amenityIds.length > 0) {
    const rows = amenityIds.map((amenityId) => ({
      listing_id: listing.id,
      amenity_id: amenityId,
    }));
    const { error: amenityError } = await supabase
      .from("listing_amenities")
      .insert(rows);

    if (amenityError) {
      await supabase.from("listings").delete().eq("id", listing.id);
      return { error: "İmkanlar əlavə edilə bilmədi." };
    }
  }

  return { listingId: listing.id };
}

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/dashboard/listings/new");
  return user;
}
