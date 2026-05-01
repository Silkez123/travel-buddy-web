"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  Home, BookOpen, Globe, Map, Stamp,
  Ticket, Wifi, Languages, PlusCircle,
  DollarSign, LogIn, LogOut, User, Plane, Bookmark,
} from "lucide-react";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Map },
  { href: "/experiences", label: "Experiences", icon: Ticket },
  { href: "/tickets", label: "My Tickets", icon: Bookmark },
  { href: "/passes", label: "Boarding Passes", icon: Plane },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/currency", label: "Currency", icon: DollarSign },
  { href: "/esim", label: "eSIM", icon: Wifi },
  { href: "/trips", label: "Trips", icon: BookOpen },
  { href: "/postcards", label: "Postcards", icon: Globe },
  { href: "/passport", label: "Passport", icon: Stamp },
];

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { postcards, trips, user, signOut } = useStore();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <aside className="w-60 shrink-0 h-full bg-white border-r border-stone-200 flex flex-col">
      <div className="px-5 py-6 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">✈️</span>
          <div>
            <p className="font-bold text-stone-900 leading-tight">Travel Buddy</p>
            <p className="text-xs text-stone-400">{trips.length} trips · {postcards.length} postcards</p>
          </div>
        </div>
      </div>

      <div className="px-3 pt-4">
        <Link
          href="/trips/new"
          className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <PlusCircle size={15} /> New Trip
        </Link>
      </div>

      <nav className="flex-1 px-3 pt-3 overflow-y-auto">
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
      </nav>

      {/* Auth section */}
      <div className="px-3 pb-3 pt-2 border-t border-stone-100">
        {user ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <User size={13} className="text-emerald-700" />
              </div>
              <p className="text-xs text-stone-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors w-full"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <LogIn size={18} strokeWidth={1.8} />
            Sign in to sync
          </Link>
        )}
      </div>

      <div className="px-5 py-3 border-t border-stone-100">
        <p className="text-xs text-stone-400">© 2025 Travel Buddy</p>
      </div>
    </aside>
  );
}
