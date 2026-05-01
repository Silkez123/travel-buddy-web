"use client";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { Star, Clock, ExternalLink, Trash2, CheckCircle, Circle, Ticket } from "lucide-react";

export default function TicketsPage() {
  const { savedExperiences, removeSavedExperience, markExperienceBooked } = useStore();

  const booked = savedExperiences.filter((e) => e.booked);
  const saved = savedExperiences.filter((e) => !e.booked);

  if (savedExperiences.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="px-4 pt-10 pb-4">
          <h1 className="text-2xl font-bold text-stone-900">My Tickets</h1>
          <p className="text-sm text-stone-500 mt-0.5">Saved & booked experiences</p>
        </div>
        <div className="flex flex-col items-center gap-3 py-20 text-stone-400 px-4">
          <Ticket size={48} strokeWidth={1} />
          <p className="text-sm font-medium">No saved experiences yet</p>
          <p className="text-xs text-center text-stone-400">Browse experiences and tap the bookmark icon to save them here</p>
          <Link
            href="/experiences"
            className="mt-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-full"
          >
            Browse experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">My Tickets</h1>
        <p className="text-sm text-stone-500 mt-0.5">{savedExperiences.length} saved · {booked.length} booked</p>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-6">
        {booked.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">✅ Booked</p>
            <div className="flex flex-col gap-3">
              {booked.map((item) => (
                <ExperienceTicketCard
                  key={item.id}
                  item={item}
                  onRemove={() => removeSavedExperience(item.id)}
                  onToggleBooked={() => markExperienceBooked(item.id, !item.booked)}
                />
              ))}
            </div>
          </section>
        )}

        {saved.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">🔖 Saved</p>
            <div className="flex flex-col gap-3">
              {saved.map((item) => (
                <ExperienceTicketCard
                  key={item.id}
                  item={item}
                  onRemove={() => removeSavedExperience(item.id)}
                  onToggleBooked={() => markExperienceBooked(item.id, !item.booked)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ExperienceTicketCard({
  item,
  onRemove,
  onToggleBooked,
}: {
  item: import("@/types").SavedExperience;
  onRemove: () => void;
  onToggleBooked: () => void;
}) {
  const { experience: exp, booked } = item;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${booked ? "border-emerald-200" : "border-stone-200"}`}>
      {/* Ticket header strip */}
      <div className={`h-1.5 ${booked ? "bg-emerald-500" : "bg-violet-500"}`} />

      <div className="flex gap-3 p-4">
        {/* Image */}
        <div
          className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${exp.imageUrl})` }}
        />

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2">{exp.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span>{exp.rating}</span>
            <span>·</span>
            <Clock size={11} />
            <span>{exp.durationHours}h</span>
            <span>·</span>
            <span className="font-semibold text-stone-700">${exp.price}</span>
          </div>
          {exp.city && (
            <p className="text-xs text-stone-400 mt-0.5">📍 {exp.city}{exp.country ? `, ${exp.country}` : ""}</p>
          )}
        </div>
      </div>

      {/* Dashed separator (perforated look) */}
      <div className="flex items-center gap-1 px-4">
        <div className="w-4 h-4 rounded-full bg-stone-100 -ml-6 shrink-0 border border-stone-200" />
        <div className="flex-1 border-t-2 border-dashed border-stone-200" />
        <div className="w-4 h-4 rounded-full bg-stone-100 -mr-6 shrink-0 border border-stone-200" />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 gap-2">
        <button
          onClick={onToggleBooked}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            booked
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          {booked ? <CheckCircle size={13} /> : <Circle size={13} />}
          {booked ? "Booked" : "Mark as booked"}
        </button>

        <div className="flex items-center gap-2">
          <a
            href={exp.bookingUrl ?? `https://www.viator.com/search?text=${encodeURIComponent(exp.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full text-violet-600 hover:bg-violet-50 transition-colors"
            title="Open on Viator"
          >
            <ExternalLink size={15} />
          </a>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-full text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Remove"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
