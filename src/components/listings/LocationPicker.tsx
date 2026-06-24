"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  AZ_MAP_CENTER,
  AZ_MAP_PICKER_ZOOM,
  isValidCoordinates,
} from "@/lib/map";
import { fixLeafletIcon } from "@/lib/leaflet-icon";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapViewSync({
  lat,
  lng,
}: {
  lat: number | null;
  lng: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (lat != null && lng != null) {
      map.setView([lat, lng], Math.max(map.getZoom(), AZ_MAP_PICKER_ZOOM));
    }
  }, [lat, lng, map]);

  return null;
}

export function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const hasPin = lat != null && lng != null;
  const center = hasPin ? [lat, lng] : [AZ_MAP_CENTER.lat, AZ_MAP_CENTER.lng];

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (isValidCoordinates(latitude, longitude)) {
          onChange(latitude, longitude);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="location-picker">
      <div className="location-picker__toolbar">
        <p className="location-picker__hint">
          Xəritədə mülkün yerini klikləyin və ya pin-i sürüşdürün.
        </p>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={handleUseMyLocation}
        >
          Cari mövqeyim
        </button>
      </div>

      <div className="location-picker__map">
        <MapContainer
          center={center as [number, number]}
          zoom={AZ_MAP_PICKER_ZOOM}
          scrollWheelZoom
          className="location-picker__map-inner"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onSelect={onChange} />
          <MapViewSync lat={lat} lng={lng} />
          {hasPin && (
            <Marker
              position={[lat, lng]}
              draggable
              eventHandlers={{
                dragend(e) {
                  const { lat: newLat, lng: newLng } = e.target.getLatLng();
                  onChange(newLat, newLng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <input type="hidden" name="lat" value={lat ?? ""} required={hasPin} />
      <input type="hidden" name="lng" value={lng ?? ""} required={hasPin} />

      {hasPin ? (
        <p className="location-picker__coords">
          Koordinatlar: {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      ) : (
        <p className="location-picker__coords location-picker__coords--empty">
          Yer seçilməyib *
        </p>
      )}
    </div>
  );
}
