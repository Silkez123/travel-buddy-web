"use client";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { PlusCircle, Trash2, LogIn, Plane } from "lucide-react";

const CLASS_LABEL: Record<string, string> = {
  economy: "Economy",
  business: "Business",
  first: "First Class",
};

const CLASS_COLOR: Record<string, string> = {
  economy: "from-sky-500 to-blue-700",
  business: "from-violet-500 to-purple-800",
  first: "from-amber-500 to-yellow-700",
};

export default function PassesPage() {
  const { user, boardingPasses, removeBoardingPass } = useStore();

  if (!user) {
    return (
      <div className="flex flex-col">
        <div className="px-4 pt-10 pb-4">
          <h1 className="text-2xl font-bold text-stone-900">Boarding Passes</h1>
        </div>
        <div className="flex flex-col items-center gap-4 py-20 px-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Plane size={28} className="text-blue-600" />
          </div>
          <h2 className="font-bold text-stone-900">Sign in to store boarding passes</h2>
          <p className="text-sm text-stone-500">
            Boarding passes are securely stored in the cloud and only available to signed-in users.
          </p>
          <Link
            href="/auth"
            className="flex items-center gap-2 mt-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-2xl"
          >
            <LogIn size={16} /> Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pt-10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Boarding Passes</h1>
          <p className="text-sm text-stone-500 mt-0.5">{boardingPasses.length} pass{boardingPasses.length !== 1 ? "es" : ""}</p>
        </div>
        <Link href="/passes/new" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
          <PlusCircle size={20} />
        </Link>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-4">
        {boardingPasses.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-stone-400">
            <Plane size={40} strokeWidth={1} />
            <p className="text-sm">No boarding passes yet</p>
            <Link
              href="/passes/new"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full font-medium"
            >
              Add your first pass
            </Link>
          </div>
        ) : (
          boardingPasses.map((pass) => (
            <BoardingPassCard key={pass.id} pass={pass} onRemove={() => removeBoardingPass(pass.id)} />
          ))
        )}
      </div>
    </div>
  );
}

function BoardingPassCard({ pass, onRemove }: { pass: import("@/types").BoardingPass; onRemove: () => void }) {
  const gradient = CLASS_COLOR[pass.class] ?? CLASS_COLOR.economy;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-200">
      {/* Top color band */}
      <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold opacity-80 uppercase tracking-widest">{pass.airline}</p>
            <p className="text-sm font-bold">{pass.flightNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">{CLASS_LABEL[pass.class]}</p>
            <p className="text-xs font-semibold">{pass.departureDate}</p>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-3xl font-black tracking-tight">{pass.originCode}</p>
            <p className="text-xs opacity-80 truncate max-w-[80px]">{pass.origin}</p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <Plane size={16} className="opacity-80" />
            <div className="w-full h-px bg-white/40" />
          </div>
          <div className="text-center">
            <p className="text-3xl font-black tracking-tight">{pass.destinationCode}</p>
            <p className="text-xs opacity-80 truncate max-w-[80px]">{pass.destination}</p>
          </div>
        </div>
      </div>

      {/* Perforated line */}
      <div className="flex items-center gap-1 -mx-0">
        <div className="w-5 h-5 rounded-full bg-stone-100 -ml-2.5 border border-stone-200" />
        <div className="flex-1 border-t-2 border-dashed border-stone-200" />
        <div className="w-5 h-5 rounded-full bg-stone-100 -mr-2.5 border border-stone-200" />
      </div>

      {/* Details grid */}
      <div className="p-4 grid grid-cols-4 gap-3">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Departs</p>
          <p className="font-bold text-stone-900 text-sm">{pass.departureTime}</p>
        </div>
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Arrives</p>
          <p className="font-bold text-stone-900 text-sm">{pass.arrivalTime}</p>
        </div>
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Seat</p>
          <p className="font-bold text-stone-900 text-sm">{pass.seat}</p>
        </div>
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide">Gate</p>
          <p className="font-bold text-stone-900 text-sm">{pass.gate ?? "—"}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4">
        <div>
          <p className="text-xs text-stone-400">Passenger</p>
          <p className="text-sm font-semibold text-stone-800">{pass.passengerName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-400">Booking ref</p>
          <p className="text-sm font-mono font-bold text-stone-800 tracking-widest">{pass.bookingRef}</p>
        </div>
        <button
          onClick={onRemove}
          className="ml-3 p-2 rounded-full hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
