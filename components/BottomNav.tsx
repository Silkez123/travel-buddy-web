"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Ticket, Languages, Wifi } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Map },
  { href: "/experiences", label: "Tours", icon: Ticket },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/esim", label: "eSIM", icon: Wifi },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex z-50 md:hidden">
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
              active ? "text-emerald-600" : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
