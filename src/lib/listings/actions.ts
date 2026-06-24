"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidRegion } from "@/lib/regions";
import { isValidCoordinates } from "@/lib/map";
import { hasAcceptedLegalTerms } from "@/lib/legal/validation";
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
  const priceUnit = (formData.get("priceUnit") as string) || "day";
  const city = (formData.get("city") as string)?.trim();
  const region = (formData.get("region") as string)?.trim();
  const address = (formData.get("address") as string)?.trim() || null;
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const maxGuests = Number(formData.get("maxGuests"));
  const bedrooms = Number(formData.get("bedrooms"));
  const whatsappPhone = (formData.get("whatsappPhone") as string)?.trim();
  const amenityIds = formData.getAll("amenities") as string[];
  const roomTypeName = (formData.get("roomTypeName") as string)?.trim();
  const roomTypeFloorRaw = formData.get("roomTypeFloor") as string;
  const roomAmenityIds = formData.getAll("roomAmenities") as string[];

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
  if (!["day", "week", "month"].includes(priceUnit)) {
    return { error: "Qiymət vahidi seçin." };
  }
  if (!city || !region) {
    return { error: "Şəhər və rayon mütləqdir." };
  }
  if (!isValidRegion(region)) {
    return { error: "Rayon siyahıdan seçin." };
  }
  if (!isValidCoordinates(lat, lng)) {
    return { error: "Xəritədə düzgün yer seçin." };
  }
  if (!hasAcceptedLegalTerms(formData)) {
    return {
      error: "İstifadəçi şərtləri və Məxfilik siyasəti ilə razı olmalısınız.",
    };
  }
  if (!maxGuests || maxGuests < 1) {
    return { error: "Qonaq sayı ən azı 1 olmalıdır." };
  }
  if (!whatsappPhone) {
    return { error: "WhatsApp nömrəsi mütləqdir." };
  }

  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", categoryId)
    .single();

  const isHotel = category?.slug === "hotel";

  if (isHotel) {
    if (!roomTypeName || roomTypeName.length < 2) {
      return { error: "Otaq tipi adı ən azı 2 simvol olmalıdır." };
    }
  }

  let roomTypeFloor: number | null = null;
  if (roomTypeFloorRaw?.trim()) {
    const n = Number(roomTypeFloorRaw);
    if (!Number.isNaN(n) && n >= 0) roomTypeFloor = Math.floor(n);
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      category_id: categoryId,
      title,
      description,
      price_per_night: pricePerNight,
      price_unit: priceUnit,
      city,
      region,
      address,
      lat,
      lng,
      max_guests: maxGuests,
      bedrooms: bedrooms >= 0 ? bedrooms : 1,
      bathrooms: 1,
      whatsapp_phone: whatsappPhone,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !listing) {
    return { error: error?.message ?? "Elan yaradıla bilmədi." };
  }

  const listingId = listing.id;

  async function rollbackListing() {
    await supabase.from("listings").delete().eq("id", listingId);
  }

  if (amenityIds.length > 0) {
    const rows = amenityIds.map((amenityId) => ({
      listing_id: listingId,
      amenity_id: amenityId,
    }));
    const { error: amenityError } = await supabase
      .from("listing_amenities")
      .insert(rows);

    if (amenityError) {
      await rollbackListing();
      return { error: "Daxildir bölməsi saxlanıla bilmədi." };
    }
  }

  if (isHotel && roomTypeName) {
    const { data: roomType, error: roomTypeError } = await supabase
      .from("listing_room_types")
      .insert({
        listing_id: listingId,
        name: roomTypeName,
        floor: roomTypeFloor,
        sort_order: 0,
      })
      .select("id")
      .single();

    if (roomTypeError || !roomType) {
      await rollbackListing();
      return { error: "Otaq tipi saxlanıla bilmədi." };
    }

    if (roomAmenityIds.length > 0) {
      const rows = roomAmenityIds.map((amenityId) => ({
        room_type_id: roomType.id,
        amenity_id: amenityId,
      }));
      const { error: rtAmenityError } = await supabase
        .from("listing_room_type_amenities")
        .insert(rows);

      if (rtAmenityError) {
        await rollbackListing();
        return { error: "Otaq xüsusiyyətləri saxlanıla bilmədi." };
      }
    }
  }

  return { listingId: listingId };
}

export async function deleteMyListing(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/dashboard/listings");
  }

  const listingId = formData.get("listingId") as string;
  if (!listingId) return;

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("deleteMyListing:", error.message);
    return;
  }

  revalidatePath("/dashboard/listings");
  redirect("/dashboard/listings");
}

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/dashboard/listings/new");
  if (!user.email_confirmed_at) {
    redirect("/auth/check-email?reason=unconfirmed");
  }
  return user;
}
