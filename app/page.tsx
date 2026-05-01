"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Map, Ticket, Languages, Wifi, BookOpen, Globe, Search, ArrowRight } from "lucide-react";
import { POPULAR_CITIES } from "@/lib/mock-data";

const FEATURES = [
  {
    href: "/explore",
    icon: Map,
    label: "Explore",
    sublabel: "Places & Maps",
    description: "Restaurants, attractions & more powered by Apple Maps, Yelp & TripAdvisor",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    href: "/experiences",
    icon: Ticket,
    label: "Experiences",
    sublabel: "Tours & Activities",
    description: "Book local tours, cooking classes, and guided adventures via Viator",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 border-violet-200 hover:bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    href: "/translate",
    icon: Languages,
    label: "Translate",
    sublabel: "Powered by DeepL",
    description: "Instant translation in 30+ languages — text, phrases, and menus",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    href: "/esim",
    icon: Wifi,
    label: "eSIM",
    sublabel: "Stay Connected",
    description: "Buy local & global data plans from Airalo — no physical SIM needed",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    href: "/trips",
    icon: BookOpen,
    label: "Trips",
    sublabel: "Itinerary Builder",
    description: "Plan and organise all your upcoming adventures in one place",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50 border-rose-200 hover:bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    href: "/postcards",
    icon: Globe,
    label: "Postcards",
    sublabel: "Print & Send",
    description: "Create beautiful postcards from your travel photos and ship them worldwide",
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50 border-teal-200 hover:bg-teal-100",
    iconColor: "text-teal-600",
  },
];

export default function HomePage() {
  const { trips, postcards } = useStore();

  return (
    <div className="flex flex-col gap-0">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-700 text-white px-5 pt-14 pb-10 md:rounded-2xl md:mb-6">
        <p className="text-emerald-100 text-xs font-semibold tracking-widest uppercase">Travel Buddy</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 leading-tight">
          Your world,<br />all in one app.
        </h1>
        <p className="text-emerald-100 text-sm mt-2 max-w-xs">
          Explore, translate, book experiences, and stay connected wherever you go.
        </p>

        {/* Quick destination search */}
        <Link
          href="/explore"
          className="flex items-center gap-3 mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-3 transition-colors"
        >
          <Search size={18} className="text-white/70" />
          <span className="text-white/80 text-sm">Search destinations, places…</span>
        </Link>

        {/* Stats row */}
        <div className="flex gap-6 mt-5 text-sm text-emerald-100">
          <span>{trips.length} trip{trips.length !== 1 ? "s" : ""}</span>
          <span>·</span>
          <span>{postcards.length} postcard{postcards.length !== 1 ? "s" : ""}</span>
          <span>·</span>
          <span>30+ languages</span>
        </div>
      </div>

      <div className="p-4 md:p-0 flex flex-col gap-7">
        {/* Feature grid */}
        <section>
          <h2 className="font-bold text-stone-800 mb-3">Everything you need to travel</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FEATURES.map(({ href, icon: Icon, label, sublabel, bg, iconColor }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col gap-2 border rounded-2xl p-4 transition-colors ${bg}`}
              >
                <Icon size={24} className={iconColor} strokeWidth={1.8} />
                <div>
                  <p className={`font-bold text-sm ${iconColor.replace("text-", "text-").replace("-600", "-900")}`}>
                    {label}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{sublabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular destinations */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-stone-800">Popular Destinations</h2>
            <Link href="/explore" className="text-sm text-emerald-600 font-medium flex items-center gap-1">
              Explore <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city.name}
                href={`/explore?city=${encodeURIComponent(city.name)}`}
                className="shrink-0 flex flex-col items-center gap-1.5 bg-white border border-stone-200 rounded-2xl p-3 min-w-[90px] hover:shadow-md hover:border-stone-300 transition-all"
              >
                <span className="text-2xl">{city.emoji}</span>
                <p className="text-xs font-semibold text-stone-800 text-center leading-tight">{city.name}</p>
                <p className="text-xs text-stone-400">{city.country}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent trips */}
        {trips.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-stone-800">Your Trips</h2>
              <Link href="/trips" className="text-sm text-emerald-600 font-medium">See all</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {trips.slice(0, 4).map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="bg-white border border-stone-200 rounded-2xl p-3 hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mb-1">{trip.emoji}</div>
                  <p className="font-semibold text-stone-800 text-sm truncate">{trip.name}</p>
                  <p className="text-xs text-stone-500 truncate">{trip.destination}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Feature detail cards */}
        <section>
          <h2 className="font-bold text-stone-800 mb-3">What Travel Buddy does</h2>
          <div className="flex flex-col gap-3">
            {FEATURES.slice(0, 4).map(({ href, icon: Icon, label, description, iconColor, bg }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 bg-white border border-stone-200 rounded-2xl p-4 hover:shadow-md hover:border-stone-300 transition-all group"
              >
                <div className={`p-2.5 rounded-xl border ${bg}`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm">{label}</p>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{description}</p>
                </div>
                <ArrowRight size={16} className="text-stone-300 group-hover:text-stone-500 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
