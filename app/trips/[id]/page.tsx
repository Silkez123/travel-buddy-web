"use client";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import PostcardThumb from "@/components/PostcardThumb";

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { trips, postcards, removeTrip } = useStore();
  const trip = trips.find((t) => t.id === id);
  const tripPostcards = postcards.filter((p) => p.tripId === id);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-stone-400">
        <p>Trip not found</p>
        <button onClick={() => router.back()} className="text-emerald-600 font-medium">Go back</button>
      </div>
    );
  }

  async function handleDelete() {
    if (!confirm(`Delete trip "${trip!.name}"?`)) return;
    await removeTrip(trip!.id);
    router.replace("/trips");
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-emerald-700 text-white px-5 pt-12 pb-6">
        <div className="flex items-start justify-between mb-3">
          <button onClick={() => router.back()} className="p-1 -ml-1 rounded-full hover:bg-white/20">
            <ArrowLeft size={20} />
          </button>
          <button onClick={handleDelete} className="p-1 rounded-full hover:bg-white/20">
            <Trash2 size={18} />
          </button>
        </div>
        <div className="text-4xl mb-2">{trip.emoji}</div>
        <h1 className="text-2xl font-bold">{trip.name}</h1>
        <p className="text-teal-100 text-sm mt-1">📍 {trip.destination}</p>
        <div className="flex gap-3 mt-3 text-sm text-teal-100">
          <span>{formatDate(trip.startDate)}</span>
          {trip.endDate && <><span>→</span><span>{formatDate(trip.endDate)}</span></>}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-stone-700">{tripPostcards.length} postcard{tripPostcards.length !== 1 ? "s" : ""}</p>
          <Link
            href={`/postcards/new`}
            className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium"
          >
            <PlusCircle size={16} /> Add postcard
          </Link>
        </div>

        {tripPostcards.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-stone-400">
            <span className="text-4xl">✉️</span>
            <p className="text-sm">No postcards for this trip yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {tripPostcards.map((pc) => (
              <PostcardThumb key={pc.id} postcard={pc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
