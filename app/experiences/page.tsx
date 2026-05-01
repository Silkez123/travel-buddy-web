"use client";
import { useState, useEffect, useCallback } from "react";
import { Experience, ExperienceCategory, SavedExperience, Booking } from "@/types";
import ExperienceCard from "@/components/ExperienceCard";
import { Search, Ticket, Bookmark, BookmarkCheck, Users, Calendar, ChevronLeft, Check, Minus, Plus } from "lucide-react";
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

type ModalView = "detail" | "booking" | "confirmed";

export default function ExperiencesPage() {
  const { savedExperiences, addSavedExperience, removeSavedExperience, addBooking } = useStore();
  const [cityInput, setCityInput] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ExperienceCategory | "all">("all");
  const [maxPrice, setMaxPrice] = useState(9999);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Experience | null>(null);
  const [modalView, setModalView] = useState<ModalView>("detail");
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);

  // Booking form state
  const [bookDate, setBookDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function openDetail(exp: Experience) {
    setSelected(exp);
    setModalView("detail");
    setBookDate("");
    setAdults(1);
    setChildren(0);
    setNotes("");
    setLastBooking(null);
  }

  function closeModal() {
    setSelected(null);
    setModalView("detail");
  }

  const fetchExperiences = useCallback(async (city: string, cat: string, price: number) => {
    setLoading(true);
    const params = new URLSearchParams({ city, category: cat, maxPrice: String(price) });
    const res = await fetch(`/api/experiences?${params}`);
    const data = await res.json();
    setExperiences(data.results ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchExperiences(query, category, maxPrice); }, [query, category, maxPrice, fetchExperiences]);

  function handleSearch(e: React.FormEvent) { e.preventDefault(); setQuery(cityInput); }

  function isSaved(id: string) { return savedExperiences.some((e) => e.experience.id === id); }

  async function toggleSave(exp: Experience) {
    const existing = savedExperiences.find((e) => e.experience.id === exp.id);
    if (existing) await removeSavedExperience(existing.id);
    else await addSavedExperience({ id: uid(), experience: exp, booked: false, savedAt: new Date().toISOString() } satisfies SavedExperience);
  }

  async function handleBook() {
    if (!selected || !bookDate) return;
    setSaving(true);
    const price = selected.price;
    const childPrice = Math.round(price * 0.75 * 100) / 100;
    const total = Math.round((adults * price + children * childPrice) * 100) / 100;

    const booking: Booking = {
      id: uid(),
      experience: selected,
      date: bookDate,
      adults,
      children,
      totalPrice: total,
      currency: selected.currency ?? "USD",
      status: "confirmed",
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    await addBooking(booking);
    setLastBooking(booking);
    setModalView("confirmed");
    setSaving(false);
  }

  const totalPrice = selected
    ? Math.round((adults * selected.price + children * Math.round(selected.price * 0.75)) * 100) / 100
    : 0;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="flex flex-col">
      {/* Header + filters */}
      <div className="px-4 pt-6 pb-4 md:pt-0">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Experiences</h1>
        <p className="text-sm text-stone-500 mb-4">Tours, activities & adventures via Viator</p>
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2.5">
            <Search size={16} className="text-stone-400 shrink-0" />
            <input value={cityInput} onChange={(e) => setCityInput(e.target.value)}
              placeholder="City, country or destination…"
              className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none" />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors">Search</button>
        </form>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 mb-3">
          {CATEGORIES.map(({ value, label, emoji }) => (
            <button key={value} onClick={() => setCategory(value)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === value ? "bg-violet-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
              {emoji} {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {PRICE_FILTERS.map(({ label, max }) => (
            <button key={max} onClick={() => setMaxPrice(max)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${maxPrice === max ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {!query && (
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Browse by destination</p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
            {POPULAR_CITIES.map((city) => (
              <button key={city.name} onClick={() => { setCityInput(city.name); setQuery(city.name); }}
                className="shrink-0 flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 hover:bg-stone-50 transition-colors">
                <span>{city.emoji}</span>
                <span className="text-sm font-medium text-stone-700">{city.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pb-6">
        {query && <p className="text-sm font-semibold text-stone-600 mb-3">{loading ? "Searching…" : `${experiences.length} experiences in ${query}`}</p>}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3,4].map((i) => <div key={i} className="h-72 bg-stone-100 rounded-2xl animate-pulse" />)}</div>
        ) : experiences.length === 0 && query ? (
          <div className="text-center py-16 text-stone-400">
            <Ticket size={40} strokeWidth={1} className="mx-auto mb-3" />
            <p className="text-sm font-medium">No experiences found</p>
            <p className="text-xs mt-1">Try a different destination or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.map((exp) => <ExperienceCard key={exp.id} experience={exp} onClick={() => openDetail(exp)} />)}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">

            {/* ── View: Detail ── */}
            {modalView === "detail" && (
              <>
                <div className="h-48 bg-cover bg-center relative rounded-t-2xl" style={{ backgroundImage: `url(${selected.imageUrl})` }}>
                  <button onClick={closeModal} className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">✕</button>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="font-bold text-stone-900 text-lg leading-snug flex-1">{selected.title}</h2>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-stone-900">${selected.price}</p>
                      <p className="text-xs text-stone-400">per person</p>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 mb-4">{selected.description}</p>
                  {selected.highlights.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Highlights</p>
                      <ul className="space-y-1">{selected.highlights.map((h) => <li key={h} className="flex items-start gap-2 text-sm text-stone-700"><span className="text-emerald-500 mt-0.5">✓</span>{h}</li>)}</ul>
                    </div>
                  )}
                  {selected.included.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Included</p>
                      <ul className="space-y-1">{selected.included.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-stone-700"><span className="text-blue-400 mt-0.5">✓</span>{item}</li>)}</ul>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => toggleSave(selected)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold border transition-colors ${isSaved(selected.id) ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100"}`}>
                      {isSaved(selected.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                      {isSaved(selected.id) ? "Saved" : "Save"}
                    </button>
                    <button onClick={() => setModalView("booking")}
                      className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors">
                      Book Now — ${selected.price}/person
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── View: Booking Form ── */}
            {modalView === "booking" && (
              <div className="p-5">
                <div className="flex items-center gap-3 mb-5">
                  <button onClick={() => setModalView("detail")} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-stone-900 text-base leading-tight truncate">{selected.title}</h2>
                    <p className="text-xs text-stone-400">${selected.price}/person</p>
                  </div>
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2"><Calendar size={15} /> Select date</label>
                  <input type="date" min={minDate} value={bookDate} onChange={(e) => setBookDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
                </div>

                {/* Guests */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3"><Users size={15} /> Guests</label>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Adults", sub: "Age 18+", value: adults, set: setAdults, min: 1 },
                      { label: "Children", sub: "Age 3–17 · 25% off", value: children, set: setChildren, min: 0 },
                    ].map(({ label, sub, value, set, min }) => (
                      <div key={label} className="flex items-center justify-between bg-stone-50 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-stone-800">{label}</p>
                          <p className="text-xs text-stone-400">{sub}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => set(Math.max(min, value - 1))} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 disabled:opacity-30 transition-colors" disabled={value <= min}>
                            <Minus size={14} />
                          </button>
                          <span className="w-5 text-center font-bold text-stone-900">{value}</span>
                          <button onClick={() => set(value + 1)} className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100 transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-5">
                  <label className="text-sm font-semibold text-stone-700 mb-2 block">Special requests <span className="font-normal text-stone-400">(optional)</span></label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Dietary requirements, accessibility needs, etc."
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400" />
                </div>

                {/* Price breakdown */}
                <div className="bg-violet-50 rounded-xl p-4 mb-4 space-y-1.5">
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>{adults} adult{adults !== 1 ? "s" : ""} × ${selected.price}</span>
                    <span>${(adults * selected.price).toFixed(2)}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between text-sm text-stone-600">
                      <span>{children} child{children !== 1 ? "ren" : ""} × ${(selected.price * 0.75).toFixed(2)}</span>
                      <span>${(children * selected.price * 0.75).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-violet-200">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button onClick={handleBook} disabled={!bookDate || saving}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
                  {saving ? "Confirming…" : `Confirm Booking · $${totalPrice.toFixed(2)}`}
                </button>
              </div>
            )}

            {/* ── View: Confirmed ── */}
            {modalView === "confirmed" && lastBooking && (
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Check size={30} className="text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-stone-900 mb-1">Booking Confirmed!</h2>
                <p className="text-sm text-stone-500 mb-6">Your spot is reserved. Check My Bookings for details.</p>

                <div className="w-full bg-stone-50 rounded-2xl p-4 text-left space-y-2 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-stone-500">Experience</span><span className="font-medium text-stone-900 text-right max-w-[60%] leading-tight">{lastBooking.experience.title}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-stone-500">Date</span><span className="font-medium text-stone-900">{lastBooking.date}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-stone-500">Guests</span><span className="font-medium text-stone-900">{lastBooking.adults} adult{lastBooking.adults !== 1 ? "s" : ""}{lastBooking.children > 0 ? ` · ${lastBooking.children} child${lastBooking.children !== 1 ? "ren" : ""}` : ""}</span></div>
                  <div className="flex justify-between text-sm border-t border-stone-200 pt-2"><span className="font-semibold text-stone-700">Total paid</span><span className="font-bold text-stone-900">${lastBooking.totalPrice.toFixed(2)}</span></div>
                </div>

                <div className="flex gap-3 w-full">
                  <button onClick={closeModal} className="flex-1 py-3 border border-stone-300 rounded-xl text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors">Back to Experiences</button>
                  <a href="/bookings" className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold text-center transition-colors">View Bookings</a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
