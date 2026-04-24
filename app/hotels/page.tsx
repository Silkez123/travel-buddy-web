"use client";
import { useState } from "react";
import { Building2, ExternalLink, ArrowRight, Star } from "lucide-react";

const PARTNERS = [
  {
    name: "Booking.com",
    logo: "🏨",
    description: "World's largest accommodation site — hotels, apartments, villas & more",
    badge: "Free Cancellation",
    badgeColor: "bg-blue-100 text-blue-700",
    getUrl: (dest: string, checkin: string, checkout: string) =>
      `https://www.booking.com/search.html?ss=${encodeURIComponent(dest)}&checkin=${checkin}&checkout=${checkout}&aid=304142`,
  },
  {
    name: "Hotels.com",
    logo: "🛏️",
    description: "Earn a free night for every 10 nights you book",
    badge: "Rewards Program",
    badgeColor: "bg-red-100 text-red-700",
    getUrl: (dest: string, checkin: string, checkout: string) =>
      `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(dest)}&q-check-in=${checkin}&q-check-out=${checkout}`,
  },
  {
    name: "Hostelworld",
    logo: "🎒",
    description: "Best hostels worldwide — perfect for budget travelers",
    badge: "Budget Stays",
    badgeColor: "bg-green-100 text-green-700",
    getUrl: (dest: string, checkin: string, checkout: string) =>
      `https://www.hostelworld.com/s?q=${encodeURIComponent(dest)}&type=city&from=${checkin}&to=${checkout}`,
  },
  {
    name: "Airbnb",
    logo: "🏡",
    description: "Unique stays and experiences hosted by locals",
    badge: "Unique Stays",
    badgeColor: "bg-rose-100 text-rose-700",
    getUrl: (dest: string, checkin: string, checkout: string) =>
      `https://www.airbnb.com/s/${encodeURIComponent(dest)}/homes?checkin=${checkin}&checkout=${checkout}`,
  },
];

const STAY_TYPES = [
  { emoji: "🏨", label: "Hotel", sub: "Full service, amenities" },
  { emoji: "🏡", label: "Vacation rental", sub: "Home away from home" },
  { emoji: "🎒", label: "Hostel", sub: "Meet fellow travelers" },
  { emoji: "🏕️", label: "Glamping", sub: "Nature + comfort" },
];

export default function HotelsPage() {
  const [dest, setDest] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white px-5 pt-12 pb-8 md:rounded-2xl md:mb-6">
        <p className="text-indigo-200 text-sm font-medium tracking-wide uppercase">Book & Save</p>
        <h1 className="text-3xl font-bold mt-1 flex items-center gap-2"><Building2 size={28} /> Hotels & Stays</h1>
        <p className="text-indigo-200 text-sm mt-1">Find the perfect place to rest your head</p>
      </div>

      <div className="p-4 md:p-0 flex flex-col gap-5">
        {/* Stay type chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-wrap">
          {STAY_TYPES.map((s) => (
            <div key={s.label} className="flex-shrink-0 bg-white border border-stone-200 rounded-xl px-3 py-2 flex items-center gap-2 text-sm">
              <span>{s.emoji}</span>
              <div>
                <p className="font-medium text-stone-800">{s.label}</p>
                <p className="text-stone-400 text-xs">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-stone-800">Search Accommodation</h2>
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1 block">Destination</label>
            <input
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              placeholder="Paris, France"
              className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Check-in</label>
              <input
                type="date"
                value={checkin}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Check-out</label>
              <input
                type="date"
                value={checkout}
                min={checkin}
                onChange={(e) => setCheckout(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Partner cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.getUrl(dest, checkin, checkout)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.logo}</span>
                  <div>
                    <p className="font-bold text-stone-900">{p.name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
                  </div>
                </div>
                <ExternalLink size={16} className="text-stone-400 group-hover:text-indigo-500 transition-colors mt-1" />
              </div>
              <p className="text-sm text-stone-500">{p.description}</p>
              <div className="flex items-center gap-1 text-indigo-600 text-sm font-medium">
                Browse stays <ArrowRight size={14} />
              </div>
            </a>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="font-semibold text-amber-800 mb-3">💡 Accommodation Tips</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-700">
            <div className="flex gap-2"><span>📍</span><span>Stay near public transit to save on transport</span></div>
            <div className="flex gap-2"><span>🔄</span><span>Always book free cancellation when possible</span></div>
            <div className="flex gap-2"><span>💬</span><span>Read recent reviews — photos can be misleading</span></div>
            <div className="flex gap-2"><span>🏷️</span><span>Mid-week check-ins are often cheaper than weekends</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
