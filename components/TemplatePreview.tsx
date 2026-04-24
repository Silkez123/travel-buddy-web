"use client";
import { TemplateId, Sticker } from "@/types";

interface Props {
  templateId: TemplateId;
  photos: string[];
  message: string;
  location: string;
  stickers: Sticker[];
  messageColor: string;
  messageFontSize: number;
}

function StickerLayer({ stickers }: { stickers: Sticker[] }) {
  return (
    <>
      {stickers.map((s) => (
        <span
          key={s.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            fontSize: `${s.scale * 2}rem`,
            transform: `translate(-50%,-50%) rotate(${s.rotation}deg)`,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </>
  );
}

export default function TemplatePreview({ templateId, photos, message, location, stickers, messageColor, messageFontSize }: Props) {
  const photo = photos[0];
  const photo2 = photos[1];

  if (templateId === "classic") {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-200">
        <div className="relative aspect-[4/3] bg-stone-100">
          {photo && <img src={photo} alt="" className="w-full h-full object-cover" />}
          <StickerLayer stickers={stickers} />
        </div>
        <div className="p-4">
          {message && <p style={{ color: messageColor, fontSize: messageFontSize }} className="leading-snug">{message}</p>}
          {location && <p className="text-xs text-stone-400 mt-2">📍 {location}</p>}
        </div>
      </div>
    );
  }

  if (templateId === "modern") {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-stone-900">
        {photo && <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
        <div className="absolute bottom-0 p-4">
          {message && <p style={{ color: messageColor || "#fff", fontSize: messageFontSize }} className="leading-snug font-semibold">{message}</p>}
          {location && <p className="text-xs text-white/70 mt-1">📍 {location}</p>}
        </div>
        <StickerLayer stickers={stickers} />
      </div>
    );
  }

  if (templateId === "vintage") {
    return (
      <div className="bg-amber-50 rounded-2xl shadow-md overflow-hidden border-4 border-amber-200 p-3">
        <div className="relative aspect-[4/3] bg-amber-100 rounded-xl overflow-hidden">
          {photo && <img src={photo} alt="" className="w-full h-full object-cover sepia-[0.3]" />}
          <StickerLayer stickers={stickers} />
        </div>
        <div className="pt-3 font-serif">
          {message && <p style={{ color: messageColor || "#78350f", fontSize: messageFontSize }} className="italic">{message}</p>}
          {location && <p className="text-xs text-amber-700 mt-2">✉ {location}</p>}
        </div>
      </div>
    );
  }

  if (templateId === "split") {
    return (
      <div className="flex rounded-2xl shadow-md overflow-hidden border border-stone-200 aspect-[3/2]">
        <div className="relative w-1/2 bg-stone-100">
          {photo && <img src={photo} alt="" className="w-full h-full object-cover" />}
          <StickerLayer stickers={stickers} />
        </div>
        <div className="w-1/2 bg-white p-3 flex flex-col justify-center">
          {message && <p style={{ color: messageColor, fontSize: messageFontSize }} className="leading-snug">{message}</p>}
          {location && <p className="text-xs text-stone-400 mt-2">📍 {location}</p>}
        </div>
      </div>
    );
  }

  if (templateId === "duo") {
    return (
      <div className="bg-stone-100 rounded-2xl shadow-md overflow-hidden border border-stone-200">
        <div className="flex gap-1 p-1">
          <div className="flex-1 aspect-square bg-stone-200 rounded-xl overflow-hidden">
            {photo && <img src={photo} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 aspect-square bg-stone-200 rounded-xl overflow-hidden">
            {photo2 && <img src={photo2} alt="" className="w-full h-full object-cover" />}
          </div>
        </div>
        <div className="p-3 relative">
          {message && <p style={{ color: messageColor, fontSize: messageFontSize }}>{message}</p>}
          {location && <p className="text-xs text-stone-400 mt-1">📍 {location}</p>}
          <StickerLayer stickers={stickers} />
        </div>
      </div>
    );
  }

  if (templateId === "grid") {
    const gridPhotos = photos.slice(0, 4);
    return (
      <div className="bg-stone-100 rounded-2xl shadow-md overflow-hidden border border-stone-200">
        <div className="grid grid-cols-2 gap-1 p-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-stone-200 rounded-xl overflow-hidden">
              {gridPhotos[i] && <img src={gridPhotos[i]} alt="" className="w-full h-full object-cover" />}
            </div>
          ))}
        </div>
        <div className="p-3">
          {message && <p style={{ color: messageColor, fontSize: messageFontSize }}>{message}</p>}
          {location && <p className="text-xs text-stone-400 mt-1">📍 {location}</p>}
        </div>
      </div>
    );
  }

  // feature
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-stone-200">
      <div className="relative aspect-video bg-stone-100">
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" />}
        <StickerLayer stickers={stickers} />
      </div>
      {photos.length > 1 && (
        <div className="flex gap-1 px-3 pt-2">
          {photos.slice(1, 4).map((p, i) => (
            <div key={i} className="flex-1 aspect-square rounded-lg overflow-hidden">
              <img src={p} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      <div className="p-3">
        {message && <p style={{ color: messageColor, fontSize: messageFontSize }}>{message}</p>}
        {location && <p className="text-xs text-stone-400 mt-1">📍 {location}</p>}
      </div>
    </div>
  );
}
