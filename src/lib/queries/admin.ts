import { createClient } from "@/lib/supabase/server";

import type { PriceUnit } from "@/types/database";

export interface PendingListing {
  id: string;
  title: string;
  price_per_night: number;
  price_unit: PriceUnit;
  currency: string;
  city: string;
  region: string;
  max_guests: number;
  whatsapp_phone: string;
  created_at: string;
  category: { name_az: string } | null;
  owner: { full_name: string | null; phone: string | null } | null;
  cover_image: string | null;
}

export interface AdminStats {
  pending: number;
  approved: number;
  rejected: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [pending, approved, rejected] = await Promise.all([
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected"),
  ]);

  return {
    pending: pending.count ?? 0,
    approved: approved.count ?? 0,
    rejected: rejected.count ?? 0,
  };
}

export async function getPendingListings(): Promise<PendingListing[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      id, title, price_per_night, price_unit, currency, city, region,
      max_guests, whatsapp_phone, created_at,
      category:categories(name_az),
      owner:profiles(full_name, phone),
      listing_images(url, is_cover, sort_order)
    `
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getPendingListings:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const images = (row.listing_images ?? []) as {
      url: string;
      is_cover: boolean;
      sort_order: number;
    }[];
    const sorted = [...images].sort((a, b) => {
      if (a.is_cover) return -1;
      if (b.is_cover) return 1;
      return a.sort_order - b.sort_order;
    });

    const category = Array.isArray(row.category) ? row.category[0] : row.category;
    const owner = Array.isArray(row.owner) ? row.owner[0] : row.owner;

    return {
      id: row.id,
      title: row.title,
      price_per_night: row.price_per_night,
      price_unit: (row.price_unit as PriceUnit) ?? "day",
      currency: row.currency,
      city: row.city,
      region: row.region,
      max_guests: row.max_guests,
      whatsapp_phone: row.whatsapp_phone,
      created_at: row.created_at,
      category: category ?? null,
      owner: owner ?? null,
      cover_image: sorted[0]?.url ?? null,
    };
  });
}
