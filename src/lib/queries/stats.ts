import { addCalendarDaysInBaku, toBakuWallClock } from "@/lib/datetime/baku";
import { createClient } from "@/lib/supabase/server";

const DAILY_SERIES_LENGTH = 14;
const REGION_LOOKBACK_DAYS = 30;
const TOP_LISTINGS_LIMIT = 8;
const TOP_REGIONS_LIMIT = 8;
const TODAY_LISTINGS_LIMIT = 20;

export interface DailyVisitPoint {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface RegionVisitCount {
  label: string;
  visits: number;
}

export interface TopViewedListing {
  id: string;
  title: string;
  city: string;
  region: string;
  viewCount: number;
}

/** Bu gün (Bakı vaxtı) baxılan elan — baxış sayı və neçə fərqli adam */
export interface TodayListingView {
  id: string;
  title: string;
  city: string;
  views: number;
  visitors: number;
}

export interface SiteStats {
  todayVisits: number;
  last7DaysVisits: number;
  last7DaysUniqueVisitors: number;
  dailySeries: DailyVisitPoint[];
  topRegions: RegionVisitCount[];
  topListings: TopViewedListing[];
  todayListings: TodayListingView[];
}

/**
 * Günləri Bakı təqvimi ilə ayırır. Server UTC-də işlədiyi üçün sadə
 * `iso.slice(0,10)` gecə 00:00–04:00 arası ziyarətləri əvvəlki günə yazırdı.
 */
function toDateKey(iso: string): string {
  const { year, month, day } = toBakuWallClock(new Date(iso));
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildDailySeries(
  rows: { created_at: string; visitor_id: string }[]
): DailyVisitPoint[] {
  const byDate = new Map<string, { visits: number; visitors: Set<string> }>();

  for (const row of rows) {
    const key = toDateKey(row.created_at);
    const bucket = byDate.get(key) ?? { visits: 0, visitors: new Set<string>() };
    bucket.visits += 1;
    bucket.visitors.add(row.visitor_id);
    byDate.set(key, bucket);
  }

  const series: DailyVisitPoint[] = [];
  const now = new Date();

  for (let i = DAILY_SERIES_LENGTH - 1; i >= 0; i -= 1) {
    // Günlər Bakı təqvimi ilə sayılır ki, "bu gün" xanası ilə uyğun olsun
    const key = toDateKey(addCalendarDaysInBaku(now, -i).toISOString());
    const bucket = byDate.get(key);

    series.push({
      date: key,
      visits: bucket?.visits ?? 0,
      uniqueVisitors: bucket?.visitors.size ?? 0,
    });
  }

  return series;
}

/** Yol "/listings/<id>" formatındadırsa elan id-sini qaytarır */
function listingIdFromPath(path: string): string | null {
  const match = path.match(/^\/listings\/([^/?#]+)\/?$/);
  return match ? match[1] : null;
}

function buildRegionBreakdown(
  rows: { city: string | null; region: string | null; country: string | null }[]
): RegionVisitCount[] {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const label = row.city || row.region || row.country || "Naməlum";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, visits]) => ({ label, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, TOP_REGIONS_LIMIT);
}

async function getTopListings(): Promise<TopViewedListing[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("id, title, city, region, view_count")
    .eq("status", "approved")
    .order("view_count", { ascending: false })
    .limit(TOP_LISTINGS_LIMIT);

  if (error) {
    console.error("getTopListings:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    city: row.city,
    region: row.region,
    viewCount: row.view_count ?? 0,
  }));
}

/**
 * Ziyarət sətirlərindən verilmiş gün üzrə elan baxışlarını yığır.
 * Saf funksiyadır (bazaya müraciət etmir) — ayrıca test edilə bilsin deyə
 * ixrac olunur.
 */
export function aggregateListingViews(
  rows: { created_at: string; visitor_id: string; path: string | null }[],
  dayKey: string
): Map<string, { views: number; visitors: number }> {
  const byListing = new Map<string, { views: number; visitors: Set<string> }>();

  for (const row of rows) {
    if (!row.path || toDateKey(row.created_at) !== dayKey) continue;
    const listingId = listingIdFromPath(row.path);
    if (!listingId) continue;

    const bucket = byListing.get(listingId) ?? {
      views: 0,
      visitors: new Set<string>(),
    };
    bucket.views += 1;
    bucket.visitors.add(row.visitor_id);
    byListing.set(listingId, bucket);
  }

  return new Map(
    [...byListing].map(([id, b]) => [id, { views: b.views, visitors: b.visitors.size }])
  );
}

/**
 * Bu gün (Bakı vaxtı) hansı elanlara baxılıb: hər elan üzrə baxış sayı və
 * neçə fərqli ziyarətçi. Məlumat site_visits-dəki yoldan çıxarılır — elan
 * səhifəsi baxışları onsuz da orada qeyd olunur, əlavə cədvəl lazım deyil.
 */
async function buildTodayListingViews(
  rows: { created_at: string; visitor_id: string; path: string | null }[],
  todayKey: string
): Promise<TodayListingView[]> {
  const byListing = aggregateListingViews(rows, todayKey);

  if (byListing.size === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id, title, city")
    .in("id", [...byListing.keys()]);

  if (error) {
    console.error("buildTodayListingViews:", error.message);
    return [];
  }

  const titles = new Map(
    (data ?? []).map((row) => [row.id, { title: row.title, city: row.city }])
  );

  return [...byListing.entries()]
    // Silinmiş elanlar başlıqsız qalır — onları göstərmirik
    .filter(([id]) => titles.has(id))
    .map(([id, bucket]) => ({
      id,
      title: titles.get(id)!.title,
      city: titles.get(id)!.city,
      views: bucket.views,
      visitors: bucket.visitors,
    }))
    .sort((a, b) => b.views - a.views || b.visitors - a.visitors)
    .slice(0, TODAY_LISTINGS_LIMIT);
}

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient();

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - REGION_LOOKBACK_DAYS);

  const [visitsResult, topListings] = await Promise.all([
    supabase
      .from("site_visits")
      .select("created_at, visitor_id, country, region, city, path")
      .gte("created_at", since.toISOString()),
    getTopListings(),
  ]);

  if (visitsResult.error) {
    console.error("getSiteStats:", visitsResult.error.message);
  }

  const rows = visitsResult.data ?? [];
  const dailySeries = buildDailySeries(rows);
  const topRegions = buildRegionBreakdown(rows);

  const todayKey = dailySeries[dailySeries.length - 1]?.date;
  const todayVisits = dailySeries.find((point) => point.date === todayKey)?.visits ?? 0;

  const last7 = dailySeries.slice(-7);
  const last7DaysVisits = last7.reduce((sum, point) => sum + point.visits, 0);
  const last7DaysUniqueVisitors = new Set(
    rows
      .filter((row) => toDateKey(row.created_at) >= (last7[0]?.date ?? ""))
      .map((row) => row.visitor_id)
  ).size;

  const todayListings = await buildTodayListingViews(rows, todayKey ?? "");

  return {
    todayVisits,
    last7DaysVisits,
    last7DaysUniqueVisitors,
    dailySeries,
    topRegions,
    topListings,
    todayListings,
  };
}
