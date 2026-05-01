"use client";
import { useState, useEffect, useCallback } from "react";
import { EsimPlan } from "@/types";
import EsimPlanCard from "@/components/EsimPlanCard";
import { Wifi, Search, Check } from "lucide-react";

const COVERAGE_FILTERS = [
  { value: "all", label: "All Coverage" },
  { value: "local", label: "Local" },
  { value: "regional", label: "Regional" },
  { value: "global", label: "Global 🌍" },
];

const POPULAR_COUNTRIES = [
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Thailand", code: "TH", flag: "🇹🇭" },
  { name: "Europe", code: "EU", flag: "🇪🇺" },
  { name: "Global", code: "WW", flag: "🌍" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Choose a plan", desc: "Pick local, regional, or global coverage" },
  { step: "2", title: "Buy & install", desc: "Scan a QR code — no physical SIM required" },
  { step: "3", title: "Stay connected", desc: "Data activates when you land" },
];

export default function EsimPage() {
  const [countryInput, setCountryInput] = useState("");
  const [country, setCountry] = useState("");
  const [coverage, setCoverage] = useState("all");
  const [plans, setPlans] = useState<EsimPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState<string | null>(null);

  const fetchPlans = useCallback(async (c: string, cov: string) => {
    setLoading(true);
    const params = new URLSearchParams({ country: c, coverage: cov });
    const res = await fetch(`/api/esim/plans?${params}`);
    const data = await res.json();
    setPlans(data.results ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans(country, coverage);
  }, [country, coverage, fetchPlans]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setCountry(countryInput);
  }

  function handlePurchase(plan: EsimPlan) {
    setPurchased(plan.id);
    setTimeout(() => setPurchased(null), 3000);
  }

  return (
    <div className="flex flex-col px-4 pt-6 pb-6 md:pt-0 gap-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 mb-1 flex items-center gap-2">
          <Wifi className="text-amber-500" size={24} />
          eSIM Plans
        </h1>
        <p className="text-sm text-stone-500">
          Stay connected anywhere — powered by Airalo
        </p>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">How it works</p>
        <div className="grid grid-cols-3 gap-3">
          {HOW_IT_WORKS.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-1.5">
                {step}
              </div>
              <p className="text-xs font-semibold text-stone-800">{title}</p>
              <p className="text-xs text-stone-500 mt-0.5 leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2.5">
          <Search size={16} className="text-stone-400 shrink-0" />
          <input
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            placeholder="Country or region…"
            className="flex-1 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Search
        </button>
      </form>

      {/* Quick country picker */}
      <div>
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
          Quick Select
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {POPULAR_COUNTRIES.map(({ name, code, flag }) => (
            <button
              key={code}
              onClick={() => {
                setCountryInput(name);
                setCountry(code.toLowerCase());
              }}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                country === code.toLowerCase()
                  ? "bg-amber-50 border-amber-400 text-amber-800"
                  : "bg-white border-stone-200 text-stone-700 hover:border-stone-400"
              }`}
            >
              <span>{flag}</span>
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Coverage filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {COVERAGE_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCoverage(value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              coverage === value
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Plans */}
      <div>
        {!loading && plans.length > 0 && (
          <p className="text-sm text-stone-500 mb-3">{plans.length} plan{plans.length !== 1 ? "s" : ""} available</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 bg-stone-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <Wifi size={40} strokeWidth={1} className="mx-auto mb-3" />
            <p className="text-sm font-medium">No plans found</p>
            <p className="text-xs mt-1">Try a different country or coverage type</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                <EsimPlanCard
                  plan={plan}
                  onSelect={() => handlePurchase(plan)}
                />
                {purchased === plan.id && (
                  <div className="absolute inset-0 bg-emerald-600/90 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Check size={32} className="mx-auto mb-2" />
                      <p className="font-bold">eSIM Added!</p>
                      <p className="text-sm text-emerald-100">QR code sent to your email</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-stone-400 text-center">
        eSIM plans are powered by Airalo. Purchase links coming soon — this is a preview.
      </p>
    </div>
  );
}
