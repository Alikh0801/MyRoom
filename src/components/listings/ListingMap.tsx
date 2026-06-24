"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { AZ_MAP_DETAIL_ZOOM } from "@/lib/map";
import { fixLeafletIcon } from "@/lib/leaflet-icon";
import "leaflet/dist/leaflet.css";

interface ListingMapProps {
  lat: number;
  lng: number;
  title: string;
}

export function ListingMap({ lat, lng, title }: ListingMapProps) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <div className="listing-map">
      <h2 className="listing-map__title">Xəritədə yer</h2>
      <div className="listing-map__frame">
        <MapContainer
          center={[lat, lng]}
          zoom={AZ_MAP_DETAIL_ZOOM}
          scrollWheelZoom={false}
          dragging
          className="listing-map__inner"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} title={title} />
        </MapContainer>
      </div>
    </div>
  );
}
