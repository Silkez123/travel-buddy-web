"use client";
import Link from "next/link";
import { Postcard } from "@/types";
import { MapPin } from "lucide-react";

interface Props {
  postcard: Postcard;
}

const TEMPLATE_BG: Record<string, string> = {
  classic: "bg-white",
  modern: "bg-stone-900",
  vintage: "bg-amber-50",
  split: "bg-slate-100",
  duo: "bg-stone-100",
  grid: "bg-stone-100",
  feature: "bg-stone-100",
};

export default function PostcardThumb({ postcard }: Props) {
  const bg = TEMPLATE_BG[postcard.templateId] ?? "bg-stone-100";
  const photo = postcard.photos[0];

  return (
    <Link href={`/postcards/${postcard.id}`} className="block rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
      <div className={`relative aspect-[4/3] ${bg} flex items-center justify-center`}>
        {photo ? (
          <img src={photo} alt={postcard.location} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">✉️</span>
        )}
        {postcard.stickers.map((s) => (
          <span
            key={s.id}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              fontSize: `${s.scale * 1.5}rem`,
              transform: `translate(-50%,-50%) rotate(${s.rotation}deg)`,
            }}
          >
            {s.emoji}
          </span>
        ))}
      </div>
      <div className="px-3 py-2">
        <p className="text-xs text-stone-500 flex items-center gap-1 truncate">
          <MapPin size={10} className="shrink-0" />
          {postcard.location || "Unknown location"}
        </p>
        {postcard.message && (
          <p className="text-xs text-stone-700 mt-0.5 line-clamp-2">{postcard.message}</p>
        )}
      </div>
    </Link>
  );
}
