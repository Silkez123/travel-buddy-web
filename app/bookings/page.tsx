"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { Calendar, Users, Trash2, CheckCircle, XCircle, Clock, Ticket } from "lucide-react";
import type { Booking, BookingStatus } from "@/types";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700",    icon: Clock },
  cancelled: { label: "Cancelled", color: "bg-stone-100 text-stone-500",    icon: XCircle },
};

const TABS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all",       label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending",   label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const { bookings, updateBookingStatus, removeBooking } = useStore();
  const [tab, setTab] = useState<"all" | BookingStatus>("all");

  const filtered = tab === "all" ? bookings : bookings.filter((b) => b.status === tab);

  const upcoming = bookings.filter((b) => b.status === "confirmed" && b.date >= new Date().toISOString().split("T")[0]);
  const spent = bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.totalPrice, 0);

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="px-4 pt-10 pb-4">
          <h1 className="text-2xl font-bold text-stone-900">My Bookings</h1>
        </div>
        <div className="flex flex-col items-center gap-3 py-20 text-stone-400 px-4 text-center">
          <Ticket size={48} strokeWidth={1} />
          <p className="text-sm font-medium">No bookings yet</p>
          <p className="text-xs text-stone-400">Browse experiences and tap Book Now to reserve your spot.</p>
          <Link href="/experiences" className="mt-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-full">
            Browse experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">My Bookings</h1>
        <p className="text-sm text-stone-500 mt-0.5">{bookings.length} total · {upcoming.length} upcoming</p>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total", value: bookings.length },
          { label: "Upcoming", value: upcoming.length },
          { label: "Spent", value: `$${spent.toFixed(0)}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-stone-200 rounded-2xl p-3 text-center">
            <p className="text-lg font-bold text-stone-900">{value}</p>
            <p className="text-xs text-stone-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto">
        {TABS.map(({ value, label }) => (
          <button key={value} onClick={() => setTab(value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === value ? "bg-violet-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 pb-8 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-stone-400 py-10">No {tab} bookings</p>
        ) : (
          filtered.map((booking) => <BookingCard key={booking.id} booking={booking} onCancel={() => updateBookingStatus(booking.id, "cancelled")} onRemove={() => removeBooking(booking.id)} />)
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking, onCancel, onRemove }: { booking: Booking; onCancel: () => void; onRemove: () => void }) {
  const { status, experience: exp } = booking;
  const cfg = STATUS_CONFIG[status];
  const StatusIcon = cfg.icon;
  const isPast = booking.date < new Date().toISOString().split("T")[0];

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden ${status === "cancelled" ? "border-stone-200 opacity-60" : "border-stone-200 shadow-sm"}`}>
      <div className="h-1.5" style={{ background: status === "confirmed" ? "#7c3aed" : status === "pending" ? "#d97706" : "#d1d5db" }} />

      <div className="flex gap-3 p-4">
        <div className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${exp.imageUrl})` }} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">{exp.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
            <span className="flex items-center gap-1"><Calendar size={11} />{booking.date}</span>
            <span className="flex items-center gap-1"><Users size={11} />{booking.adults + booking.children} guest{booking.adults + booking.children !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>
              <StatusIcon size={11} />{cfg.label}
            </span>
            <span className="text-sm font-bold text-stone-900">${booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Perforated divider */}
      <div className="flex items-center px-4">
        <div className="w-4 h-4 rounded-full bg-stone-100 -ml-6 border border-stone-200" />
        <div className="flex-1 border-t-2 border-dashed border-stone-200" />
        <div className="w-4 h-4 rounded-full bg-stone-100 -mr-6 border border-stone-200" />
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-xs text-stone-400">
          {booking.notes ? <span className="italic">"{booking.notes.slice(0, 40)}{booking.notes.length > 40 ? "…" : ""}"</span> : <span>No special requests</span>}
        </div>
        <div className="flex gap-1.5">
          {status === "confirmed" && !isPast && (
            <button onClick={onCancel} className="text-xs px-3 py-1.5 rounded-full border border-stone-300 text-stone-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors">
              Cancel
            </button>
          )}
          {status === "cancelled" && (
            <button onClick={onRemove} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
