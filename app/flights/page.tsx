"use client";
import { useState } from "react";
import { Plane, Search, ExternalLink, ArrowRight } from "lucide-react";

const PARTNERS = [
  {
    name: "Kiwi.com",
    logo: "✈️",
    description: "Find the cheapest flights with flexible dates and multi-city trips",
    badge: "Best Prices",
    badgeColor: "bg-sky-100 text-sky-700",
    getUrl: (from: string, to: string, date: string) =>
      `https://www.kiwi.com/en/search/results/${encodeURIComponent(from || "anywhere")}/${encodeURIComponent(to || "anywhere")}/${date || "anytime"}/no-return`,
  },
  {
    name: "Google Flights",
    logo: "🔍",
    description: "Compare hundreds of airlines and booking sites at once",
    badge: "Most Comprehensive",
    badgeColor: "bg-purple-100 text-purple-700",
    getUrl: (from: string, to: string, date: string) =>
      `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(from)}+to+${encodeURIComponent(to)}`,
  },
  {
    name: "Skyscanner",
    logo: "🌐",
    description: "Search millions of routes and set price alerts",
    badge: "Price Alerts",
    badgeColor: "bg-emerald-100 text-emerald-700",
    getUrl: (from: string, to: string, date: string) =>
      `https://www.skyscanner.com/transport/flights/${encodeURIComponent(from)}/${encodeURIComponent(to)}/${date?.replace(/-/g, "") || ""}`,
  },
  {
    name: "Kayak",
    logo: "🛫",
    description: "Explore fare trends and find the best time to fly",
    badge: "Fare Predictor",
    badgeColor: "bg-orange-100 text-orange-700",
    getUrl: (from: string, to: string, date: string) =>
      `https://www.kayak.com/flights/${encodeURIComponent(from)}-${encodeURIComponent(to)}/${date || ""}`,
  },
];

const TIPS = [
  { icon: "📅", tip: "Book 6–8 weeks ahead for domestic, 3–6 months for international" },
  { icon: "🔔", tip: "Set price alerts — fares fluctuate, and you can save 20–40%" },
  { icon: "📦", tip: "Compare carry-on policies — some 'cheap' fares add bag fees" },
  { icon: "🌍", tip: "Try nearby airports for potentially much lower fares" },
];

export default function FlightsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-br from-sky-500 to-indigo-700 text-white px-5 pt-12 pb-8 md:rounded-2xl md:mb-6">
        <p className="text-sky-200 text-sm font-medium tracking-wide uppercase">Book & Save</p>
        <h1 className="text-3xl font-bold mt-1 flex items-center gap-2"><Plane size={28} /> Flights</h1>
        <p className="text-sky-200 text-sm mt-1">Compare top booking sites to find the best deal</p>
      </div>

      <div className="p-4 md:p-0 flex flex-col gap-5">
        {/* Search form */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
          <h2 className="font-semibold text-stone-800">Quick Search</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">From</label>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="New York (JFK)"
                className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">To</label>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Tokyo (NRT)"
                className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Departure date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>
        </div>

        {/* Partner cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.getUrl(from, to, date)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-3 hover:border-sky-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.logo}</span>
                  <div>
                    <p className="font-bold text-stone-900">{p.name}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
                  </div>
                </div>
                <ExternalLink size={16} className="text-stone-400 group-hover:text-sky-500 transition-colors mt-1" />
              </div>
              <p className="text-sm text-stone-500">{p.description}</p>
              <div className="flex items-center gap-1 text-sky-600 text-sm font-medium">
                Search flights <ArrowRight size={14} />
              </div>
            </a>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="font-semibold text-amber-800 mb-3">💡 Flight Booking Tips</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {TIPS.map((t) => (
              <div key={t.tip} className="flex gap-2 text-sm text-amber-700">
                <span>{t.icon}</span>
                <span>{t.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
