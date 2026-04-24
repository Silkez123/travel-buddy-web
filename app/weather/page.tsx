"use client";
import { useState } from "react";
import { Cloud, Loader2, MapPin, Thermometer, Droplets, Wind, Backpack } from "lucide-react";

interface WeatherData {
  tempMin: number;
  tempMax: number;
  precipitation: number;
  windspeed: number;
  description: string;
}

interface PackingCategory {
  name: string;
  emoji: string;
  items: string[];
}

interface PackingList {
  categories: PackingCategory[];
  tips: string[];
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Drizzle",
  55: "Heavy drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 80: "Rain showers",
  81: "Heavy showers", 82: "Violent showers", 95: "Thunderstorm",
};

export default function WeatherPage() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [packing, setPacking] = useState<PackingList | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingPacking, setLoadingPacking] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeather() {
    if (!destination.trim()) return;
    setLoadingWeather(true);
    setLoadingPacking(false);
    setWeather(null);
    setPacking(null);
    setError("");

    try {
      // Geocode destination
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`
      );
      const geoData = await geoRes.json();
      if (!geoData.length) throw new Error("Destination not found");

      const { lat, lon } = geoData[0];

      // Fetch weather
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,weathercode&timezone=auto&forecast_days=7`
      );
      const wData = await wRes.json();
      const d = wData.daily;

      const w: WeatherData = {
        tempMax: Math.round(Math.max(...d.temperature_2m_max)),
        tempMin: Math.round(Math.min(...d.temperature_2m_min)),
        precipitation: Math.round(d.precipitation_sum.reduce((a: number, b: number) => a + b, 0)),
        windspeed: Math.round(Math.max(...d.windspeed_10m_max)),
        description: WEATHER_CODES[d.weathercode[0]] ?? "Variable",
      };

      setWeather(w);

      // Now fetch packing list
      setLoadingPacking(true);
      const pkRes = await fetch("/api/packing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, startDate, endDate, weather: w }),
      });
      const pkData = await pkRes.json();
      if (pkData.error) throw new Error(pkData.error);
      setPacking(pkData);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoadingWeather(false);
      setLoadingPacking(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 to-blue-700 text-white px-5 pt-12 pb-8 md:rounded-2xl md:mb-6">
        <p className="text-sky-200 text-sm font-medium tracking-wide uppercase">AI Powered</p>
        <h1 className="text-3xl font-bold mt-1">Weather & Packing</h1>
        <p className="text-sky-200 text-sm mt-1">Smart packing list for any destination</p>
      </div>

      <div className="p-4 md:p-0 flex flex-col gap-5">
        {/* Form */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-stone-700 mb-1.5 block">Destination</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                placeholder="e.g. Tokyo, Japan"
                className="w-full pl-9 pr-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-stone-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Departure</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Return</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-stone-300 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <button
            onClick={fetchWeather}
            disabled={!destination.trim() || loadingWeather || loadingPacking}
            className="flex items-center justify-center gap-2 w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors"
          >
            {loadingWeather || loadingPacking
              ? <><Loader2 size={18} className="animate-spin" /> {loadingWeather ? "Fetching weather…" : "Generating packing list…"}</>
              : <><Cloud size={18} /> Get Weather & Packing List</>
            }
          </button>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>

        {/* Weather card */}
        {weather && (
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5">
            <h2 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
              <Cloud size={18} /> Weather Forecast — {destination}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3 text-center">
                <Thermometer size={20} className="text-orange-400 mx-auto mb-1" />
                <p className="text-xs text-stone-500">Temperature</p>
                <p className="font-bold text-stone-800">{weather.tempMin}°–{weather.tempMax}°C</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <Droplets size={20} className="text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-stone-500">Precipitation</p>
                <p className="font-bold text-stone-800">{weather.precipitation}mm</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <Wind size={20} className="text-teal-400 mx-auto mb-1" />
                <p className="text-xs text-stone-500">Max Wind</p>
                <p className="font-bold text-stone-800">{weather.windspeed} km/h</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <Cloud size={20} className="text-stone-400 mx-auto mb-1" />
                <p className="text-xs text-stone-500">Conditions</p>
                <p className="font-bold text-stone-800 text-sm">{weather.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Packing list */}
        {packing && (
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-stone-800 flex items-center gap-2">
              <Backpack size={18} /> AI Packing List
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {packing.categories.map((cat) => (
                <div key={cat.name} className="bg-white border border-stone-200 rounded-2xl p-4">
                  <p className="font-semibold text-stone-800 mb-2">
                    {cat.emoji} {cat.name}
                  </p>
                  <ul className="space-y-1">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {packing.tips.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="font-semibold text-amber-800 mb-2">💡 Travel Tips for {destination}</p>
                <ul className="space-y-1.5">
                  {packing.tips.map((tip) => (
                    <li key={tip} className="text-sm text-amber-700 flex gap-2">
                      <span className="shrink-0">→</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
