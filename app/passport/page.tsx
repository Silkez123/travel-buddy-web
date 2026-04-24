"use client";
import { useStore } from "@/lib/store";

function StatCard({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white border border-stone-200 rounded-2xl p-4 shadow-sm gap-1">
      <span className="text-3xl">{emoji}</span>
      <span className="text-2xl font-bold text-stone-800">{value}</span>
      <span className="text-xs text-stone-500 text-center">{label}</span>
    </div>
  );
}

export default function PassportPage() {
  const { postcards, trips, savedPlaces } = useStore();

  const countries = new Set(
    postcards.map((p) => p.location.split(",").pop()?.trim()).filter(Boolean)
  ).size;

  const cities = new Set(
    postcards.map((p) => p.location.split(",")[0]?.trim()).filter(Boolean)
  ).size;

  const templateCounts = postcards.reduce<Record<string, number>>((acc, p) => {
    acc[p.templateId] = (acc[p.templateId] ?? 0) + 1;
    return acc;
  }, {});

  const topTemplate = Object.entries(templateCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="flex flex-col">
      <div className="bg-gradient-to-br from-violet-500 to-purple-700 text-white px-5 pt-12 pb-8">
        <p className="text-violet-200 text-sm font-medium tracking-wide uppercase">Travel Passport</p>
        <h1 className="text-3xl font-bold mt-1">Your stats</h1>
        <p className="text-violet-200 text-sm mt-2">Every journey captured</p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard emoji="✉️" value={postcards.length} label="Postcards" />
          <StatCard emoji="🗺️" value={trips.length} label="Trips" />
          <StatCard emoji="🌍" value={countries} label="Countries" />
          <StatCard emoji="🏙️" value={cities} label="Cities" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <StatCard emoji="📍" value={savedPlaces.length} label="Saved Places" />
        </div>

        {topTemplate && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
            <p className="text-sm text-violet-700 font-medium">Favourite template</p>
            <p className="text-lg font-bold text-violet-900 capitalize mt-1">{topTemplate[0]}</p>
            <p className="text-xs text-violet-500">Used {topTemplate[1]} time{topTemplate[1] !== 1 ? "s" : ""}</p>
          </div>
        )}

        {postcards.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-8 text-stone-400">
            <span className="text-5xl">🌐</span>
            <p className="text-sm text-center">Create postcards to build your travel stats</p>
          </div>
        )}

        {/* Recent locations */}
        {postcards.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-stone-800">Recent locations</h2>
            {[...new Set(postcards.map((p) => p.location).filter(Boolean))].slice(0, 8).map((loc) => (
              <div key={loc} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                <span className="text-lg">📍</span>
                <span className="text-sm text-stone-700">{loc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
