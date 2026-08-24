import { createClient } from "@/lib/supabase/server";

const DAILY_SERIES_LENGTH = 14;
const REGION_LOOKBACK_DAYS = 30;
const TOP_LISTINGS_LIMIT = 8;
const TOP_REGIONS_LIMIT = 8;

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

export interface SiteStats {
  todayVisits: number;
  last7DaysVisits: number;
  last7DaysUniqueVisitors: number;
  dailySeries: DailyVisitPoint[];
  topRegions: RegionVisitCount[];
  topListings: TopViewedListing[];
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10);
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
  const today = new Date();

  for (let i = DAILY_SERIES_LENGTH - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setUTCDate(day.getUTCDate() - i);
    const key = day.toISOString().slice(0, 10);
    const bucket = byDate.get(key);

    series.push({
      date: key,
      visits: bucket?.visits ?? 0,
      uniqueVisitors: bucket?.visitors.size ?? 0,
    });
  }

  return series;
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

export async function getSiteStats(): Promise<SiteStats> {
  const supabase = await createClient();

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - REGION_LOOKBACK_DAYS);

  const [visitsResult, topListings] = await Promise.all([
    supabase
      .from("site_visits")
      .select("created_at, visitor_id, country, region, city")
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

  return {
    todayVisits,
    last7DaysVisits,
    last7DaysUniqueVisitors,
    dailySeries,
    topRegions,
    topListings,
  };
}
