import { NextResponse } from "next/server";
import { isValidCoordinates } from "@/lib/map";
import type { GeocodeResult, GeocodeSearchResponse } from "@/lib/geocode/types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "MyRoomAZ/1.0 (https://myroomaz.com; listing-location-search)";

type NominatimItem = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const localeParam = searchParams.get("locale");
  const locale =
    localeParam === "ru" ? "ru" : localeParam === "tr" ? "tr" : "az";

  if (q.length < 2) {
    return NextResponse.json({ results: [] } satisfies GeocodeSearchResponse);
  }

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "0");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "az");
  const acceptLanguage =
    locale === "ru"
      ? "ru,az,en"
      : locale === "tr"
        ? "tr,az,en"
        : "az,ru,en";
  url.searchParams.set("accept-language", acceptLanguage);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          results: [],
          error: "searchFailed",
        } satisfies GeocodeSearchResponse,
        { status: 502 }
      );
    }

    const data = (await response.json()) as NominatimItem[];
    const results: GeocodeResult[] = [];

    for (const item of data) {
      const lat = Number(item.lat);
      const lng = Number(item.lon);
      if (!isValidCoordinates(lat, lng)) continue;

      results.push({
        id: String(item.place_id),
        label: item.display_name,
        lat,
        lng,
      });
    }

    return NextResponse.json({ results } satisfies GeocodeSearchResponse);
  } catch {
    return NextResponse.json(
      {
        results: [],
        error: "searchFailed",
      } satisfies GeocodeSearchResponse,
      { status: 502 }
    );
  }
}
