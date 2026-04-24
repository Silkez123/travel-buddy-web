"use client";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { PlusCircle, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TripsPage() {
  const { trips, postcards, removeTrip } = useStore();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete trip "${name}"?`)) return;
    await removeTrip(id);
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">Trips</h1>
        <Link href="/trips/new" className="p-2 bg-emerald-600 text-white rounded-full">
          <PlusCircle size={20} />
        </Link>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-3">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-stone-400">
            <span className="text-5xl">🗺️</span>
            <p className="text-sm">No trips yet</p>
            <Link href="/trips/new" className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-full font-medium">
              Plan your first trip
            </Link>
          </div>
        ) : (
          trips.map((trip) => {
            const count = postcards.filter((p) => p.tripId === trip.id).length;
            return (
              <div key={trip.id} className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <Link href={`/trips/${trip.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center bg-stone-50 rounded-xl shrink-0">
                    {trip.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 truncate">{trip.name}</p>
                    <p className="text-sm text-stone-500 truncate">{trip.destination}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {formatDate(trip.startDate)} · {count} postcard{count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(trip.id, trip.name)}
                  className="p-2 rounded-full hover:bg-red-50 shrink-0"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
