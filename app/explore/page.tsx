"use client";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { SavedPlace } from "@/types";
import { uid } from "@/lib/utils";
import { MapPin, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";

interface Place {
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
}

const CATEGORIES = ["restaurants", "attractions", "hotels", "cafes", "museums", "parks"];

export default function ExplorePage() {
  const { savedPlaces, addSavedPlace, removeSavedPlace } = useStore();
  const [category, setCategory] = useState("attractions");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Location access denied. Enable location to explore nearby places.")
    );
  }, []);

  async function search() {
    if (!userLocation) {
      setError("Waiting for location…");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { lat, lng } = userLocation;
      const query = encodeURIComponent(category);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&lat=${lat}&lon=${lng}&format=json&limit=12&bounded=0&addressdetails=1`
      );
      const data = await res.json();
      setPlaces(
        data.map((d: Record<string, unknown>) => ({
          name: d.name || d.display_name,
          category,
          address: (d.display_name as string).split(",").slice(0, 3).join(", "),
          lat: parseFloat(d.lat as string),
          lng: parseFloat(d.lon as string),
        }))
      );
    } catch {
      setError("Failed to load places. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function isSaved(name: string) {
    return savedPlaces.some((p) => p.name === name);
  }

  async function toggleSave(place: Place) {
    const existing = savedPlaces.find((p) => p.name === place.name);
    if (existing) {
      await removeSavedPlace(existing.id);
    } else {
      const sp: SavedPlace = { id: uid(), ...place, savedAt: new Date().toISOString() };
      await addSavedPlace(sp);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-br from-sky-500 to-blue-700 text-white px-5 pt-12 pb-6">
        <p className="text-sky-200 text-sm font-medium tracking-wide uppercase">Explore</p>
        <h1 className="text-3xl font-bold mt-1">Nearby places</h1>
        {userLocation && <p className="text-sky-200 text-xs mt-1">📍 Location found</p>}
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                category === c ? "bg-sky-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={search}
          disabled={loading || !userLocation}
          className="flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-2xl font-semibold disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
          {loading ? "Searching…" : `Find ${category} nearby`}
        </button>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {places.length > 0 && (
          <div className="flex flex-col gap-3">
            {places.map((place, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 truncate">{place.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{place.address}</p>
                </div>
                <button
                  onClick={() => toggleSave(place)}
                  className="shrink-0 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                >
                  {isSaved(place.name)
                    ? <BookmarkCheck size={20} className="text-sky-500" />
                    : <Bookmark size={20} className="text-stone-400" />
                  }
                </button>
              </div>
            ))}
          </div>
        )}

        {savedPlaces.length > 0 && (
          <div className="mt-2">
            <h2 className="font-bold text-stone-800 mb-3">Saved places</h2>
            <div className="flex flex-col gap-2">
              {savedPlaces.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                  <span className="text-lg">📍</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">{p.name}</p>
                    <p className="text-xs text-stone-400 truncate">{p.address}</p>
                  </div>
                  <button onClick={() => removeSavedPlace(p.id)} className="text-stone-300 hover:text-red-400 text-lg">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
