"use client";
import { useState } from "react";
import { Compass, ExternalLink, ArrowRight } from "lucide-react";

const PARTNERS = [
  {
    name: "Viator",
    logo: "🗺️",
    description: "300,000+ tours, activities, and experiences worldwide",
    badge: "Most Popular",
    badgeColor: "bg-emerald-100 text-emerald-700",
    getUrl: (dest: string) =>
      `https://www.viator.com/searchResults/all?text=${encodeURIComponent(dest)}`,
  },
  {
    name: "GetYourGuide",
    logo: "🎯",
    description: "Skip-the-line tickets, day trips, and local adventures",
    badge: "Skip the Line",
    badgeColor: "bg-yellow-100 text-yellow-700",
    getUrl: (dest: string) =>
      `https://www.getyourguide.com/s/?q=${encodeURIComponent(dest)}&partner_id=TB2024`,
  },
  {
    name: "Airbnb Experiences",
    logo: "🤝",
    description: "Unique activities hosted by passionate locals",
    badge: "Hosted Locally",
    badgeColor: "bg-rose-100 text-rose-700",
    getUrl: (dest: string) =>
      `https://www.airbnb.com/experiences?query=${encodeURIComponent(dest)}`,
  },
  {
    name: "Klook",
    logo: "🎟️",
    description: "Best for Asia travel — attractions, transport passes & more",
    badge: "Asia Specialist",
    badgeColor: "bg-orange-100 text-orange-700",
    getUrl: (dest: string) =>
      `https://www.klook.com/en-US/search/?query=${encodeURIComponent(dest)}`,
  },
];

const CATEGORIES = [
  { emoji: "🏛️", label: "Culture & History" },
  { emoji: "🍜", label: "Food & Drink" },
  { emoji: "🧗", label: "Adventure & Sports" },
  { emoji: "🎨", label: "Art & Workshops" },
  { emoji: "🚤", label: "Water Activities" },
  { emoji: "🌿", label: "Nature & Wildlife" },
  { emoji: "🎭", label: "Shows & Events" },
  { emoji: "📸", label: "Photography Tours" },
];

export default function ExperiencesPage() {
  const [dest, setDest] = useState("");

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white px-5 pt-12 pb-8 md:rounded-2xl md:mb-6">
        <p className="text-emerald-200 text-sm font-medium tracking-wide uppercase">Book & Save</p>
        <h1 className="text-3xl font-bold mt-1 flex items-center gap-2"><Compass size={28} /> Experiences</h1>
        <p className="text-emerald-200 text-sm mt-1">Tours, activities, and local adventures</p>
      </div>

      <div className="p-4 md:p-0 flex flex-col gap-5">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-wrap">
          {CATEGORIES.map((c) => (
            <div key={c.label} className="flex-shrink-0 bg-white border border-stone-200 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm text-stone-700 font-medium">
              <span>{c.emoji}</span> {c.label}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-3">
          <h2 className="font-semibold text-stone-800">Find Experiences</h2>
          <input
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            placeholder="Where are you going? e.g. Kyoto, Japan"
            className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {/* Partner cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.getUrl(dest)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.logo}</span>
                  <div>
                    <p className="font-bold text-stone-900">{p.name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
                  </div>
                </div>
                <ExternalLink size={16} className="text-stone-400 group-hover:text-emerald-500 transition-colors mt-1" />
              </div>
              <p className="text-sm text-stone-500">{p.description}</p>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                Explore activities <ArrowRight size={14} />
              </div>
            </a>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="font-semibold text-amber-800 mb-3">💡 Experience Tips</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-700">
            <div className="flex gap-2"><span>⏰</span><span>Book popular attractions weeks in advance</span></div>
            <div className="flex gap-2"><span>🌅</span><span>Early morning tours have smaller crowds and better light</span></div>
            <div className="flex gap-2"><span>🗣️</span><span>Local guides reveal stories guidebooks don't have</span></div>
            <div className="flex gap-2"><span>🔄</span><span>Free cancellation tours give you maximum flexibility</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
