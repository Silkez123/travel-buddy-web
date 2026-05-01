"use client";
import { EsimPlan } from "@/types";
import { Wifi, Calendar, Zap, Check, X, ExternalLink } from "lucide-react";

const AFFILIATE_CODE = process.env.NEXT_PUBLIC_AIRALO_AFFILIATE_CODE ?? "";

function airaloUrl(plan: EsimPlan): string {
  const base = "https://www.airalo.com";
  const params = new URLSearchParams({ code: AFFILIATE_CODE });
  // Route to the relevant country page when possible
  if (plan.coverage === "global") return `${base}/esim-store?${params}`;
  if (plan.coverage === "regional") return `${base}/esim-store/regional?${params}`;
  return `${base}/${plan.country.toLowerCase().replace(/\s+/g, "-")}-esim?${params}`;
}

interface EsimPlanCardProps {
  plan: EsimPlan;
  onSelect?: () => void;
}

const COVERAGE_BADGE: Record<string, { label: string; color: string }> = {
  local: { label: "Local", color: "bg-blue-50 text-blue-700" },
  regional: { label: "Regional", color: "bg-violet-50 text-violet-700" },
  global: { label: "Global 🌍", color: "bg-emerald-50 text-emerald-700" },
};

export default function EsimPlanCard({ plan, onSelect }: EsimPlanCardProps) {
  const badge = COVERAGE_BADGE[plan.coverage];
  const pricePerDay = (plan.priceUsd / plan.durationDays).toFixed(2);

  return (
    <div
      className={`bg-white border rounded-2xl p-4 hover:shadow-md hover:border-stone-300 transition-all flex flex-col gap-3 ${
        plan.popular ? "border-emerald-300 ring-1 ring-emerald-200" : "border-stone-200"
      }`}
    >
      {plan.popular && (
        <div className="flex justify-end -mt-1">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            ★ Popular
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl">{plan.flag}</span>
            <div>
              <p className="font-bold text-stone-900 text-sm leading-tight">{plan.carrier}</p>
              <p className="text-xs text-stone-500">{plan.country}</p>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-stone-900">${plan.priceUsd.toFixed(2)}</p>
          <p className="text-xs text-stone-400">${pricePerDay}/day</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center bg-stone-50 rounded-xl p-2 gap-0.5">
          <Wifi size={16} className="text-emerald-600" />
          <span className="text-sm font-bold text-stone-900">{plan.dataGb}GB</span>
          <span className="text-xs text-stone-500">Data</span>
        </div>
        <div className="flex flex-col items-center bg-stone-50 rounded-xl p-2 gap-0.5">
          <Calendar size={16} className="text-blue-500" />
          <span className="text-sm font-bold text-stone-900">{plan.durationDays}d</span>
          <span className="text-xs text-stone-500">Valid</span>
        </div>
        <div className="flex flex-col items-center bg-stone-50 rounded-xl p-2 gap-0.5">
          <Zap size={16} className="text-amber-500" />
          <span className="text-xs font-bold text-stone-900">{plan.network}</span>
          <span className="text-xs text-stone-500">Speed</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
          {badge.label}
        </span>
        <div className="flex gap-3 text-stone-500">
          <span className="flex items-center gap-1">
            {plan.hotspotAllowed ? (
              <Check size={12} className="text-emerald-500" />
            ) : (
              <X size={12} className="text-stone-300" />
            )}
            Hotspot
          </span>
          <span className="flex items-center gap-1">
            {plan.topUpAvailable ? (
              <Check size={12} className="text-emerald-500" />
            ) : (
              <X size={12} className="text-stone-300" />
            )}
            Top-up
          </span>
        </div>
      </div>

      <a
        href={airaloUrl(plan)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onSelect}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        Get this eSIM — ${plan.priceUsd.toFixed(2)}
        <ExternalLink size={13} />
      </a>
    </div>
  );
}
