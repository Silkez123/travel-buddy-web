"use client";
import { Experience } from "@/types";
import { Star, Clock, Users, Globe } from "lucide-react";

interface ExperienceCardProps {
  experience: Experience;
  onClick?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  tour: "bg-blue-50 text-blue-700",
  activity: "bg-violet-50 text-violet-700",
  food: "bg-orange-50 text-orange-700",
  adventure: "bg-red-50 text-red-700",
  culture: "bg-amber-50 text-amber-700",
  transport: "bg-teal-50 text-teal-700",
};

export default function ExperienceCard({ experience, onClick }: ExperienceCardProps) {
  const durationLabel =
    experience.durationHours < 1
      ? `${experience.durationHours * 60} min`
      : experience.durationHours === Math.floor(experience.durationHours)
      ? `${experience.durationHours}h`
      : `${experience.durationHours}h`;

  const categoryStyle = CATEGORY_COLORS[experience.category] ?? "bg-stone-100 text-stone-600";

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-stone-300 transition-all group"
    >
      <div
        className="h-44 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${experience.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryStyle}`}>
            {experience.category}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 bg-white/95 rounded-lg px-2 py-1">
          <span className="text-sm font-bold text-stone-900">
            ${experience.price}
            <span className="text-xs font-normal text-stone-500"> / person</span>
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {experience.title}
        </h3>

        <div className="flex items-center gap-1 mt-1.5">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-stone-700">{experience.rating}</span>
          <span className="text-xs text-stone-400">({experience.reviewCount.toLocaleString()} reviews)</span>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {durationLabel}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {experience.groupSize}
          </span>
          <span className="flex items-center gap-1">
            <Globe size={11} />
            {experience.languages[0]}
            {experience.languages.length > 1 ? ` +${experience.languages.length - 1}` : ""}
          </span>
        </div>

        {experience.highlights.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {experience.highlights.slice(0, 2).map((h) => (
              <li key={h} className="text-xs text-stone-500 flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span>
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">via {experience.provider}</span>
          <span className="text-xs font-semibold text-emerald-600 group-hover:underline">
            Book now →
          </span>
        </div>
      </div>
    </button>
  );
}
