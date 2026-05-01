"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Place } from "@/types";

// Dynamically import the actual map to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-stone-100 rounded-2xl">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface MapViewProps {
  center: { lat: number; lng: number };
  places?: Place[];
  onPlaceSelect?: (place: Place) => void;
  selectedPlaceId?: string;
  className?: string;
}

export default function MapView(props: MapViewProps) {
  return (
    <div className={`rounded-2xl overflow-hidden ${props.className ?? ""}`}>
      <LeafletMap {...props} />
    </div>
  );
}
