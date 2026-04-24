"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Home, BookOpen, Globe, Map, Stamp, PlusCircle,
  Plane, Hotel, Ticket, ShieldCheck, Rss
} from "lucide-react";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trips", label: "Trips", icon: BookOpen },
  { href: "/postcards", label: "Postcards", icon: Globe },
  { href: "/feed", label: "Public Feed", icon: Rss },
  { href: "/explore", label: "Explore", icon: Map },
  { href: "/passport", label: "Passport", icon: Stamp },
];

const bookingNav = [
  { href: "/flights", label: "Flights", icon: Plane },
  { href: "/hotels", label: "Hotels", icon: Hotel },
  { href: "/experiences", label: "Experiences", icon: Ticket },
  { href: "/insurance", label: "Insurance", icon: ShieldCheck },
];

export default function SideNav() {
  const pathname = usePathname();
  const { postcards, trips } = useStore();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <aside className="w-60 shrink-0 h-full bg-white border-r border-stone-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <div>
            <p className="font-bold text-stone-900 leading-tight">Travel Buddy</p>
            <p className="text-xs text-stone-400">{postcards.length} postcards · {trips.length} trips</p>
          </div>
        </div>
      </div>

      {/* Quick create */}
      <div className="px-3 pt-4">
        <Link
          href="/postcards/new"
          className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <PlusCircle size={16} /> New Postcard
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 pt-4 overflow-y-auto">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2 mb-1">Menu</p>
        {mainNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-colors ${
              isActive(href)
                ? "bg-emerald-50 text-emerald-700"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <Icon size={18} strokeWidth={isActive(href) ? 2.5 : 1.8} />
            {label}
          </Link>
        ))}

        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2 mb-1 mt-5">Book & Save</p>
        {bookingNav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-colors ${
              isActive(href)
                ? "bg-emerald-50 text-emerald-700"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <Icon size={18} strokeWidth={isActive(href) ? 2.5 : 1.8} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-stone-100">
        <p className="text-xs text-stone-400">© 2025 Travel Buddy</p>
      </div>
    </aside>
  );
}
