"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeftRight, Loader2, TrendingUp } from "lucide-react";

const POPULAR = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "INR", "MXN", "SGD", "HKD", "NOK", "SEK", "DKK", "NZD", "THB", "AED", "BRL", "ZAR"];

const FLAG: Record<string, string> = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", AUD: "🇦🇺",
  CAD: "🇨🇦", CHF: "🇨🇭", CNY: "🇨🇳", INR: "🇮🇳", MXN: "🇲🇽",
  SGD: "🇸🇬", HKD: "🇭🇰", NOK: "🇳🇴", SEK: "🇸🇪", DKK: "🇩🇰",
  NZD: "🇳🇿", THB: "🇹🇭", AED: "🇦🇪", BRL: "🇧🇷", ZAR: "🇿🇦",
  KRW: "🇰🇷", PLN: "🇵🇱", TRY: "🇹🇷", IDR: "🇮🇩", PHP: "🇵🇭",
  MYR: "🇲🇾", ILS: "🇮🇱", CZK: "🇨🇿", HUF: "🇭🇺", RON: "🇷🇴", BGN: "🇧🇬",
};

interface ConvertResult {
  result: number;
  rate: number;
  date?: string;
}

export default function CurrencyPage() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load currency list on mount
  useEffect(() => {
    fetch("/api/currency", { method: "POST" })
      .then((r) => r.json())
      .then(setCurrencies)
      .catch(() => {});
  }, []);

  const convert = useCallback(async () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setResult(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/currency?from=${from}&to=${to}&amount=${num}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError((e as Error).message || "Failed to fetch rate");
    } finally {
      setLoading(false);
    }
  }, [amount, from, to]);

  // Auto-convert on input change
  useEffect(() => {
    const t = setTimeout(convert, 400);
    return () => clearTimeout(t);
  }, [convert]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const allCodes = Object.keys(currencies).length
    ? Object.keys(currencies)
    : POPULAR;

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-stone-900">Currency</h1>
        <p className="text-sm text-stone-500 mt-0.5">Live rates · European Central Bank</p>
      </div>

      <div className="px-4 flex flex-col gap-4 pb-8">
        {/* Amount input */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4">
          <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">Amount</label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-3xl font-bold text-stone-900 mt-1 focus:outline-none bg-transparent"
            placeholder="0"
          />
        </div>

        {/* From / Swap / To */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white border border-stone-200 rounded-2xl p-4">
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">From</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl">{FLAG[from] ?? "🏳️"}</span>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="flex-1 text-lg font-bold text-stone-900 bg-transparent focus:outline-none cursor-pointer"
              >
                {allCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            {currencies[from] && (
              <p className="text-xs text-stone-400 mt-0.5 truncate">{currencies[from]}</p>
            )}
          </div>

          <button
            onClick={swap}
            className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeftRight size={16} />
          </button>

          <div className="flex-1 bg-white border border-stone-200 rounded-2xl p-4">
            <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">To</label>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl">{FLAG[to] ?? "🏳️"}</span>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 text-lg font-bold text-stone-900 bg-transparent focus:outline-none cursor-pointer"
              >
                {allCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            {currencies[to] && (
              <p className="text-xs text-stone-400 mt-0.5 truncate">{currencies[to]}</p>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 min-h-[100px] flex flex-col justify-center">
          {loading ? (
            <div className="flex items-center gap-2 text-stone-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Fetching rate…</span>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : result ? (
            <>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Result</p>
              <p className="text-4xl font-bold text-emerald-600 mt-1">
                {FLAG[to] ?? ""} {result.result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                <span className="text-lg font-semibold text-stone-500 ml-2">{to}</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-400">
                <TrendingUp size={12} />
                <span>
                  1 {from} = {result.rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}
                </span>
                {result.date && <span>· {result.date}</span>}
              </div>
            </>
          ) : (
            <p className="text-sm text-stone-400">Enter an amount to convert</p>
          )}
        </div>

        {/* Quick amounts */}
        <div>
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Quick amounts</p>
          <div className="flex flex-wrap gap-2">
            {[1, 5, 10, 20, 50, 100, 500, 1000].map((n) => (
              <button
                key={n}
                onClick={() => setAmount(String(n))}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  amount === String(n)
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-stone-700 border-stone-200 hover:border-emerald-300"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Popular currency grid */}
        <div>
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Popular currencies</p>
          <div className="grid grid-cols-4 gap-2">
            {POPULAR.slice(0, 12).map((code) => (
              <button
                key={code}
                onClick={() => setTo(code)}
                className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-colors ${
                  to === code
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                    : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                }`}
              >
                <span className="text-xl">{FLAG[code] ?? "🏳️"}</span>
                <span className="text-xs font-semibold mt-0.5">{code}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-stone-400 text-center">
          Rates from the European Central Bank via Frankfurter. Not for financial advice.
        </p>
      </div>
    </div>
  );
}
