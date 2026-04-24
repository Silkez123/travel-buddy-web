"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/utils";
import { Trip } from "@/types";
import { ArrowLeft, Check } from "lucide-react";

const EMOJIS = ["✈️","🏖️","🏔️","🌴","🗺️","🏛️","🎭","🍜","🌊","⛷️","🚂","🚢","🏕️","🎡","🌸","🦁","🗽","🏯","🌋","🎪"];

export default function NewTripPage() {
  const router = useRouter();
  const { addTrip } = useStore();
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [emoji, setEmoji] = useState("✈️");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const canSave = name.trim() && destination.trim() && startDate;

  async function handleSave() {
    const trip: Trip = {
      id: uid(),
      name: name.trim(),
      destination: destination.trim(),
      emoji,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    };
    await addTrip(trip);
    router.replace(`/trips/${trip.id}`);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-10 pb-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-stone-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-stone-900 text-lg">New Trip</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-5">
        {/* Emoji picker */}
        <div>
          <label className="text-sm font-medium text-stone-700 mb-2 block">Icon</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((em) => (
              <button
                key={em}
                onClick={() => setEmoji(em)}
                className={`text-2xl p-2 rounded-xl transition-colors ${emoji === em ? "bg-emerald-100 ring-2 ring-emerald-400" : "bg-stone-100 hover:bg-stone-200"}`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700 mb-1.5 block">Trip name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer in Italy"
            className="w-full border border-stone-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700 mb-1.5 block">Destination</label>
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Rome, Italy"
            className="w-full border border-stone-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1.5 block">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-stone-300 rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1.5 block">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full border border-stone-300 rounded-2xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 pt-3 border-t border-stone-100">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-2xl font-semibold disabled:opacity-40"
        >
          Create Trip <Check size={18} />
        </button>
      </div>
    </div>
  );
}
