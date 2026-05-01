"use client";
import { Place } from "@/types";
import { Star, MapPin, Clock, Phone } from "lucide-react";

interface PlaceCardProps {
  place: Place;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  restaurant: "bg-orange-50 text-orange-700",
  cafe: "bg-amber-50 text-amber-700",
  bar: "bg-purple-50 text-purple-700",
  museum: "bg-blue-50 text-blue-700",
  park: "bg-green-50 text-green-700",
  attraction: "bg-pink-50 text-pink-700",
  hotel: "bg-indigo-50 text-indigo-700",
  shopping: "bg-rose-50 text-rose-700",
};

const SOURCE_BADGE: Record<string, { label: string; color: string }> = {
  yelp: { label: "Yelp", color: "bg-red-100 text-red-700" },
  tripadvisor: { label: "TripAdvisor", color: "bg-emerald-100 text-emerald-700" },
  openstreetmap: { label: "OpenStreetMap", color: "bg-blue-100 text-blue-700" },
};

export default function PlaceCard({ place, selected, onClick, compact }: PlaceCardProps) {
  const priceStr = "$".repeat(place.priceLevel);
  const categoryStyle = CATEGORY_COLORS[place.category] ?? "bg-stone-100 text-stone-600";
  const badge = SOURCE_BADGE[place.source];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all ${
          selected
            ? "border-emerald-400 bg-emerald-50 shadow-sm"
            : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
        }`}
      >
        <div
          className="w-12 h-12 rounded-lg bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${place.imageUrl})` }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 text-sm truncate">{place.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-stone-600">{place.rating}</span>
            <span className="text-xs text-stone-400">({place.reviewCount.toLocaleString()})</span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs text-stone-500">{priceStr}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border overflow-hidden transition-all ${
        selected
          ? "border-emerald-400 shadow-md ring-2 ring-emerald-200"
          : "border-stone-200 bg-white hover:shadow-md hover:border-stone-300"
      }`}
    >
      <div
        className="h-40 bg-cover bg-center w-full relative"
        style={{ backgroundImage: `url(${place.imageUrl})` }}
      >
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryStyle}`}>
            {place.category}
          </span>
          {badge && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-stone-900 text-sm leading-tight">{place.name}</h3>
          <span className="text-xs text-stone-400 shrink-0 mt-0.5">{priceStr}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-stone-700">{place.rating}</span>
          <span className="text-xs text-stone-400">({place.reviewCount.toLocaleString()})</span>
        </div>
        {place.hours && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Clock size={11} className="text-stone-400" />
            <span className="text-xs text-stone-500 truncate">{place.hours}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={11} className="text-stone-400" />
          <span className="text-xs text-stone-500 truncate">{place.address}</span>
        </div>
        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {place.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
