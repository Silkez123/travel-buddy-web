"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Place, PlaceCategory } from "@/types";
import PlaceCard from "@/components/PlaceCard";
import MapView from "@/components/MapView";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { POPULAR_CITIES } from "@/lib/mock-data";

const CATEGORIES: { value: PlaceCategory | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "🌍" },
  { value: "restaurant", label: "Eat", emoji: "🍽" },
  { value: "cafe", label: "Café", emoji: "☕" },
  { value: "attraction", label: "See", emoji: "📸" },
  { value: "museum", label: "Museum", emoji: "🏛" },
  { value: "park", label: "Park", emoji: "🌿" },
  { value: "shopping", label: "Shop", emoji: "🛍" },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") ?? "";

  const [query, setQuery] = useState(initialCity);
  const [cityInput, setCityInput] = useState(initialCity);
  const [category, setCategory] = useState<PlaceCategory | "all">("all");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [showMap, setShowMap] = useState(true);

  const fetchPlaces = useCallback(async (city: string, cat: string) => {
    setLoading(true);
    const params = new URLSearchParams({ city, category: cat });
    const res = await fetch(`/api/places/search?${params}`);
    const data = await res.json();
    setPlaces(data.results ?? []);
    if (data.center) setMapCenter(data.center);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (query) fetchPlaces(query, category);
  }, [query, category, fetchPlaces]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(cityInput);
  }

  function handlePlaceSelect(place: Place) {
    setSelectedPlace(place);
    setMapCenter({ lat: place.lat, lng: place.lng });
  }

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 md:pt-0 bg-white border-b border-stone-200 md:bg-transparent md:border-none">
        <h1 className="text-2xl font-bold text-stone-900 mb-3">Explore</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2.5">
            <Search size={16} className="text-stone-400 shrink-0" />
            <input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="City or destination…"
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Go
          </button>
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showMap ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-stone-200 text-stone-600"
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </form>

        {/* Category filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === value
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Body: map + list */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map */}
        {showMap && (
          <div className="h-56 md:h-auto md:flex-1 relative">
            <MapView
              center={mapCenter}
              places={places}
              selectedPlaceId={selectedPlace?.id}
              onPlaceSelect={handlePlaceSelect}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Results list */}
        <div className="flex-1 md:max-w-sm overflow-y-auto border-t border-stone-200 md:border-t-0 md:border-l bg-white">
          {/* Popular city shortcuts when no query */}
          {!query && (
            <div className="p-4">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                Popular Cities
              </p>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      setCityInput(city.name);
                      setQuery(city.name);
                      setMapCenter({ lat: city.lat, lng: city.lng });
                    }}
                    className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 hover:bg-stone-100 transition-colors text-left"
                  >
                    <span className="text-xl">{city.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{city.name}</p>
                      <p className="text-xs text-stone-400">{city.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-500" />
                  {query}
                </p>
                <p className="text-xs text-stone-400">{places.length} places</p>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-stone-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : places.length === 0 ? (
                <div className="text-center py-10 text-stone-400">
                  <MapPin size={32} strokeWidth={1} className="mx-auto mb-2" />
                  <p className="text-sm">No places found</p>
                  <p className="text-xs mt-1">Try a different city or category</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {places.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      compact
                      selected={selectedPlace?.id === place.id}
                      onClick={() => handlePlaceSelect(place)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected place detail drawer */}
      {selectedPlace && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-auto md:right-0 md:top-0 md:w-96 bg-white border-t md:border-l border-stone-200 shadow-xl md:shadow-none z-40 overflow-y-auto max-h-72 md:max-h-full">
          <div className="relative">
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${selectedPlace.imageUrl})` }}
            />
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 text-xs"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <h2 className="font-bold text-stone-900">{selectedPlace.name}</h2>
            <p className="text-sm text-stone-500 mt-1">{selectedPlace.description}</p>
            {selectedPlace.hours && (
              <p className="text-xs text-stone-400 mt-2">🕐 {selectedPlace.hours}</p>
            )}
            {selectedPlace.phone && (
              <p className="text-xs text-stone-400 mt-1">📞 {selectedPlace.phone}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  );
}
