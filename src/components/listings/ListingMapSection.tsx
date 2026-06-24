"use client";

import dynamic from "next/dynamic";

interface ListingMapSectionProps {
  lat: number;
  lng: number;
  title: string;
}

const ListingMap = dynamic(
  () =>
    import("@/components/listings/ListingMap").then((mod) => mod.ListingMap),
  {
    ssr: false,
    loading: () => <div className="listing-map__frame listing-map__loading" />,
  }
);

export function ListingMapSection({ lat, lng, title }: ListingMapSectionProps) {
  return <ListingMap lat={lat} lng={lng} title={title} />;
}
