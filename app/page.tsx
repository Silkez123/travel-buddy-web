"use client";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { PlusCircle, MapPin, Image as ImageIcon } from "lucide-react";
import PostcardThumb from "@/components/PostcardThumb";

export default function HomePage() {
  const { postcards, trips } = useStore();
  const recent = postcards.slice(0, 6);
  const activeTrips = trips.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white px-5 pt-12 pb-8">
        <p className="text-emerald-100 text-sm font-medium tracking-wide uppercase">Travel Buddy</p>
        <h1 className="text-3xl font-bold mt-1">
          {postcards.length === 0 ? "Start your journey" : "Your adventures"}
        </h1>
        <div className="flex gap-4 mt-4 text-sm text-emerald-100">
          <span>{postcards.length} postcards</span>
          <span>·</span>
          <span>{trips.length} trips</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/postcards/new"
            className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 hover:bg-emerald-100 transition-colors"
          >
            <PlusCircle className="text-emerald-600" size={24} />
            <span className="font-semibold text-emerald-800">New Postcard</span>
          </Link>
          <Link
            href="/trips/new"
            className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-2xl p-4 hover:bg-teal-100 transition-colors"
          >
            <MapPin className="text-teal-600" size={24} />
            <span className="font-semibold text-teal-800">New Trip</span>
          </Link>
        </div>

        {/* Active trips strip */}
        {activeTrips.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-stone-800">Trips</h2>
              <Link href="/trips" className="text-sm text-emerald-600 font-medium">See all</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
              {activeTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="flex-shrink-0 bg-white border border-stone-200 rounded-2xl p-3 w-36 hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl mb-1">{trip.emoji}</div>
                  <p className="font-semibold text-stone-800 text-sm truncate">{trip.name}</p>
                  <p className="text-xs text-stone-500 truncate">{trip.destination}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent postcards */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-stone-800">Recent Postcards</h2>
            {postcards.length > 0 && (
              <Link href="/postcards" className="text-sm text-emerald-600 font-medium">See all</Link>
            )}
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-stone-400">
              <ImageIcon size={40} strokeWidth={1} />
              <p className="text-sm">No postcards yet — create your first!</p>
              <Link
                href="/postcards/new"
                className="mt-1 px-4 py-2 bg-emerald-600 text-white text-sm rounded-full font-medium"
              >
                Create Postcard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recent.map((pc) => (
                <PostcardThumb key={pc.id} postcard={pc} />
              ))}
            </div>
          )}
        </section>

        {postcards.length > 0 && (
          <p className="text-center text-xs text-stone-400 pb-2">
            Last postcard · {formatDate(postcards[0].createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}
