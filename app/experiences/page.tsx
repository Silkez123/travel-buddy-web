"use client";
import { useState, useEffect, useCallback } from "react";
import { Experience, ExperienceCategory, SavedExperience } from "@/types";
import ExperienceCard from "@/components/ExperienceCard";
import { Search, Ticket, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { POPULAR_CITIES } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/utils";

const CATEGORIES: { value: ExperienceCategory | "all"; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "🌍" },
  { value: "tour", label: "Tours", emoji: "🗺" },
  { value: "food", label: "Food", emoji: "🍜" },
  { value: "adventure", label: "Adventure", emoji: "🏔" },
  { value: "culture", label: "Culture", emoji: "🏛" },
  { value: "activity", label: "Activities", emoji: "🎯" },
];

const PRICE_FILTERS = [
  { label: "Any price", max: 9999 },
  { label: "Under $50", max: 50 },
  { label: "Under $100", max: 100 },
  { label: "Under $200", max: 200 },
];

export default function ExperiencesPage() {
  const { savedExperiences, addSavedExperience, removeSavedExperience } = useStore();
  const [cityInput, setCityInput] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ExperienceCategory | "all">("all");
  const [maxPrice, setMaxPrice] = useState(9999);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Experience | null>(null);

  function isSaved(id: string) {
    return savedExperiences.some((e) => e.experience.id === id);
  }

  async function toggleSave(exp: Experience) {
    const existing = savedExperiences.find((e) => e.experience.id === exp.id);
    if (existing) {
      await removeSavedExperience(existing.id);
    } else {
      const saved: SavedExperience = {
        id: uid(),
        experience: exp,
        booked: false,
        savedAt: new Date().toISOString(),
      };
      await addSavedExperience(saved);
    }
  }

  const fetchExperiences = useCallback(async (city: string, cat: string, price: number) => {
    setLoading(true);
    const params = new URLSearchParams({ city, category: cat, maxPrice: String(price) });
    const res = await fetch(`/api/experiences?${params}`);
    const data = await res.json();
    setExperiences(data.results ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchExperiences(query, category, maxPrice);
  }, [query, category, maxPrice, fetchExperiences]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(cityInput);
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 md:pt-0">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Experiences</h1>
        <p className="text-sm text-stone-500 mb-4">Tours, activities & adventures via Viator</p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2.5">
            <Search size={16} className="text-stone-400 shrink-0" />
            <input
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="City, country or destination…"
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 mb-3">
          {CATEGORIES.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => setCategory(value)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === value
                  ? "bg-violet-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        {/* Price filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {PRICE_FILTERS.map(({ label, max }) => (
            <button
              key={max}
              onClick={() => setMaxPrice(max)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                maxPrice === max
                  ? "bg-stone-900 text-white border-stone-900"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Popular city shortcuts when no query */}
      {!query && (
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            Browse by destination
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  setCityInput(city.name);
                  setQuery(city.name);
                }}
                className="shrink-0 flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 hover:bg-stone-50 transition-colors"
              >
                <span>{city.emoji}</span>
                <span className="text-sm font-medium text-stone-700">{city.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="px-4 pb-6">
        {query && (
          <p className="text-sm font-semibold text-stone-600 mb-3">
            {loading ? "Searching…" : `${experiences.length} experiences in ${query}`}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-stone-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : experiences.length === 0 && query ? (
          <div className="text-center py-16 text-stone-400">
            <Ticket size={40} strokeWidth={1} className="mx-auto mb-3" />
            <p className="text-sm font-medium">No experiences found</p>
            <p className="text-xs mt-1">Try a different destination or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onClick={() => setSelected(exp)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Experience detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
            <div
              className="h-48 bg-cover bg-center relative rounded-t-2xl"
              style={{ backgroundImage: `url(${selected.imageUrl})` }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-bold text-stone-900 text-lg leading-snug flex-1">
                  {selected.title}
                </h2>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-stone-900">${selected.price}</p>
                  <p className="text-xs text-stone-400">per person</p>
                </div>
              </div>
              <p className="text-sm text-stone-600 mb-4">{selected.description}</p>
              <div className="mb-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Highlights</p>
                <ul className="space-y-1">
                  {selected.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-stone-700">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-5">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Included</p>
                <ul className="space-y-1">
                  {selected.included.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-stone-700">
                      <span className="text-blue-400 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleSave(selected)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold border transition-colors ${
                    isSaved(selected.id)
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {isSaved(selected.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  {isSaved(selected.id) ? "Saved" : "Save"}
                </button>
                <a
                  href={selected.bookingUrl ?? `https://www.viator.com/search?text=${encodeURIComponent(selected.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Book on Viator — ${selected.price}/person
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
