"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { uid, fileToDataURL } from "@/lib/utils";
import { Postcard, TemplateId, Sticker } from "@/types";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import TemplatePreview from "@/components/TemplatePreview";
import StickerPicker from "@/components/StickerPicker";

const TEMPLATES: { id: TemplateId; label: string; emoji: string }[] = [
  { id: "classic", label: "Classic", emoji: "🖼️" },
  { id: "modern", label: "Modern", emoji: "🌃" },
  { id: "vintage", label: "Vintage", emoji: "📜" },
  { id: "split", label: "Split", emoji: "⬜" },
  { id: "duo", label: "Duo", emoji: "🔲" },
  { id: "grid", label: "Grid", emoji: "🟫" },
  { id: "feature", label: "Feature", emoji: "🌅" },
];

const STEPS = ["Photos", "Template", "Message", "Location", "Stickers", "Preview"];

export default function NewPostcardPage() {
  const router = useRouter();
  const { addPostcard, trips } = useStore();
  const [step, setStep] = useState(0);

  // Form state
  const [photos, setPhotos] = useState<string[]>([]);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("#1c1917");
  const [messageFontSize, setMessageFontSize] = useState(14);
  const [location, setLocation] = useState("");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [tripId, setTripId] = useState("");

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const urls = await Promise.all(files.map(fileToDataURL));
    setPhotos((prev) => [...prev, ...urls]);
  }

  async function handleSave() {
    const postcard: Postcard = {
      id: uid(),
      tripId: tripId || undefined,
      photos,
      message,
      location,
      templateId,
      stickers,
      messageFontSize,
      messageColor,
      createdAt: new Date().toISOString(),
    };
    await addPostcard(postcard);
    router.push(`/postcards/${postcard.id}`);
  }

  const canNext =
    (step === 0 && photos.length > 0) ||
    step === 1 ||
    step === 2 ||
    (step === 3 && location.trim().length > 0) ||
    step === 4 ||
    step === 5;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4">
        <button onClick={() => (step === 0 ? router.back() : setStep(step - 1))} className="p-2 -ml-2 rounded-full hover:bg-stone-100">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-stone-900">New Postcard</h1>
          <p className="text-xs text-stone-500">{STEPS[step]}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 px-4 mb-4">
        {STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? "bg-emerald-500" : "bg-stone-200"}`} />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-stone-600 text-sm">Add one or more photos to your postcard.</p>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-2xl p-8 cursor-pointer hover:bg-emerald-50 transition-colors">
              <span className="text-3xl mb-2">📷</span>
              <span className="text-sm font-medium text-emerald-700">Tap to add photos</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
            </label>
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-colors ${
                  templateId === t.id ? "border-emerald-500 bg-emerald-50" : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <span className="text-3xl">{t.emoji}</span>
                <span className="text-sm font-medium text-stone-700">{t.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your postcard message..."
              rows={5}
              className="w-full border border-stone-300 rounded-2xl p-4 text-stone-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
              style={{ fontSize: messageFontSize }}
            />
            <div className="flex items-center gap-3">
              <label className="text-sm text-stone-600">Size</label>
              <input
                type="range" min={10} max={24} value={messageFontSize}
                onChange={(e) => setMessageFontSize(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-stone-500 w-8">{messageFontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-stone-600">Color</label>
              <input type="color" value={messageColor} onChange={(e) => setMessageColor(e.target.value)} className="w-10 h-8 rounded cursor-pointer" />
            </div>
            {trips.length > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-sm text-stone-600">Trip</label>
                <select
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  className="flex-1 border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">None</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <p className="text-stone-600 text-sm">Where was this postcard from?</p>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Paris, France"
              className="w-full border border-stone-300 rounded-2xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={() => {
                if (!navigator.geolocation) return;
                navigator.geolocation.getCurrentPosition(async (pos) => {
                  const { latitude: lat, longitude: lng } = pos.coords;
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                  const data = await res.json();
                  const city = data.address?.city || data.address?.town || data.address?.village || "";
                  const country = data.address?.country || "";
                  setLocation([city, country].filter(Boolean).join(", "));
                });
              }}
              className="flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
            >
              📍 Use my current location
            </button>
          </div>
        )}

        {step === 4 && (
          <StickerPicker stickers={stickers} onChange={setStickers} photo={photos[0]} />
        )}

        {step === 5 && (
          <div className="flex flex-col gap-4">
            <TemplatePreview
              templateId={templateId}
              photos={photos}
              message={message}
              location={location}
              stickers={stickers}
              messageColor={messageColor}
              messageFontSize={messageFontSize}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-6 pt-3 border-t border-stone-100">
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-2xl font-semibold disabled:opacity-40 transition-opacity"
          >
            {STEPS[step + 1]} <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-2xl font-semibold"
          >
            Save Postcard <Check size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
