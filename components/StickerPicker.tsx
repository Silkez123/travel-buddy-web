"use client";
import { useState, useRef } from "react";
import { Sticker } from "@/types";
import { uid } from "@/lib/utils";

const EMOJI_SETS = [
  ["🌴", "🌊", "🏔️", "🌋", "🗺️", "🧭", "⛺", "🚂"],
  ["✈️", "🚢", "🚁", "🏕️", "🎒", "📸", "🎫", "🎟️"],
  ["🌸", "🌺", "🌻", "🍃", "🦋", "🌈", "⭐", "🌙"],
  ["🍕", "🍜", "🍣", "🥘", "🍷", "☕", "🍦", "🎂"],
  ["❤️", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎"],
];

interface Props {
  stickers: Sticker[];
  onChange: (s: Sticker[]) => void;
  photo?: string;
}

export default function StickerPicker({ stickers, onChange, photo }: Props) {
  const [selected, setSelected] = useState("🌴");
  const canvasRef = useRef<HTMLDivElement>(null);

  function addSticker(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const sticker: Sticker = { id: uid(), emoji: selected, x, y, scale: 1.5, rotation: 0 };
    onChange([...stickers, sticker]);
  }

  function removeSticker(id: string) {
    onChange(stickers.filter((s) => s.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-stone-600">Tap the canvas to place a sticker. Tap a sticker to remove it.</p>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onClick={addSticker}
        className="relative aspect-[4/3] bg-stone-100 rounded-2xl overflow-hidden cursor-crosshair border-2 border-dashed border-stone-300"
      >
        {photo && <img src={photo} alt="" className="w-full h-full object-cover" />}
        {stickers.map((s) => (
          <button
            key={s.id}
            onClick={(e) => { e.stopPropagation(); removeSticker(s.id); }}
            className="absolute"
            style={{
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              fontSize: `${s.scale * 1.5}rem`,
              transform: `translate(-50%,-50%) rotate(${s.rotation}deg)`,
            }}
          >
            {s.emoji}
          </button>
        ))}
      </div>

      {/* Emoji sets */}
      <div className="flex flex-col gap-2">
        {EMOJI_SETS.map((row, i) => (
          <div key={i} className="flex gap-2 justify-center flex-wrap">
            {row.map((em) => (
              <button
                key={em}
                onClick={() => setSelected(em)}
                className={`text-2xl p-1.5 rounded-xl transition-colors ${selected === em ? "bg-emerald-100 ring-2 ring-emerald-400" : "hover:bg-stone-100"}`}
              >
                {em}
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-stone-400">Selected: {selected}</p>
    </div>
  );
}
