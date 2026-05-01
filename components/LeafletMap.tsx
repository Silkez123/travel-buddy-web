"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Place } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: "#f97316",
  cafe: "#d97706",
  bar: "#7c3aed",
  museum: "#2563eb",
  park: "#16a34a",
  attraction: "#db2777",
  hotel: "#0891b2",
  shopping: "#be185d",
};

function MapController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center.lat, center.lng, map]);
  return null;
}

interface LeafletMapProps {
  center: { lat: number; lng: number };
  places?: Place[];
  onPlaceSelect?: (place: Place) => void;
  selectedPlaceId?: string;
}

export default function LeafletMap({ center, places = [], onPlaceSelect, selectedPlaceId }: LeafletMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={false}
    >
      <MapController center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <CircleMarker
          key={place.id}
          center={[place.lat, place.lng]}
          radius={selectedPlaceId === place.id ? 11 : 8}
          pathOptions={{
            color: "#fff",
            weight: 2,
            fillColor: CATEGORY_COLORS[place.category] ?? "#6366f1",
            fillOpacity: 1,
          }}
          eventHandlers={{ click: () => onPlaceSelect?.(place) }}
        >
          <Popup>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{place.name}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>{place.category}</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
