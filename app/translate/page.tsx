"use client";
import { useState, useRef } from "react";
import { Languages, ArrowLeftRight, Copy, Check, RotateCcw, Loader2 } from "lucide-react";
import { DEEPL_LANGUAGES, COMMON_PHRASES } from "@/lib/mock-data";

const TARGET_LANGS = DEEPL_LANGUAGES.filter((l) => l.code !== "auto");

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("ES");
  const [result, setResult] = useState<{ text: string; detectedLang: string; mock?: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const categories = Array.from(new Set(COMMON_PHRASES.map((p) => p.category)));

  async function translate(text: string = sourceText) {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang, sourceLang }),
    });
    const data = await res.json();
    setResult({
      text: data.translatedText ?? "",
      detectedLang: data.detectedSourceLang ?? sourceLang,
      mock: data.mock,
    });
    setLoading(false);
  }

  function swapLanguages() {
    if (sourceLang === "auto" || !result) return;
    const prevTarget = targetLang;
    const prevSource = sourceLang;
    setTargetLang(prevSource);
    setSourceLang(prevTarget);
    setSourceText(result.text);
    setResult(null);
  }

  async function copyResult() {
    if (!result?.text) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function usePhrase(text: string) {
    setSourceText(text);
    setResult(null);
    textareaRef.current?.focus();
    translate(text);
  }

  const sourceLangName = DEEPL_LANGUAGES.find((l) => l.code === sourceLang)?.name ?? "Auto-detect";
  const targetLangName = TARGET_LANGS.find((l) => l.code === targetLang)?.name ?? targetLang;

  return (
    <div className="flex flex-col px-4 pt-6 pb-6 md:pt-0 gap-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 mb-1 flex items-center gap-2">
          <Languages className="text-emerald-600" size={24} />
          Translate
        </h1>
        <p className="text-sm text-stone-500">Powered by DeepL — 30+ languages</p>
      </div>

      {/* Language pair selector */}
      <div className="flex items-center gap-2">
        <select
          value={sourceLang}
          onChange={(e) => { setSourceLang(e.target.value); setResult(null); }}
          className="flex-1 bg-stone-100 text-stone-800 text-sm font-medium rounded-xl px-3 py-2.5 outline-none cursor-pointer"
        >
          {DEEPL_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>

        <button
          onClick={swapLanguages}
          disabled={sourceLang === "auto"}
          className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeftRight size={16} className="text-stone-600" />
        </button>

        <select
          value={targetLang}
          onChange={(e) => { setTargetLang(e.target.value); setResult(null); }}
          className="flex-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium rounded-xl px-3 py-2.5 outline-none cursor-pointer"
        >
          {TARGET_LANGS.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={sourceText}
            onChange={(e) => { setSourceText(e.target.value); setResult(null); }}
            placeholder="Enter text to translate…"
            rows={4}
            className="w-full bg-stone-100 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none resize-none"
          />
          {sourceText && (
            <button
              onClick={() => { setSourceText(""); setResult(null); }}
              className="absolute top-2.5 right-2.5 text-stone-400 hover:text-stone-600"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">{sourceText.length} characters</span>
          <button
            onClick={() => translate()}
            disabled={!sourceText.trim() || loading}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Languages size={14} />}
            Translate
          </button>
        </div>
      </div>

      {/* Result */}
      {(loading || result) && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700">{targetLangName}</span>
              {result?.mock && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  Mock — add DEEPL_API_KEY
                </span>
              )}
              {!result?.mock && result && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  via DeepL
                </span>
              )}
            </div>
            {result && (
              <button onClick={copyResult} className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800">
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-emerald-100 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-emerald-100 rounded animate-pulse w-1/2" />
            </div>
          ) : (
            <p className="text-stone-800 text-base leading-relaxed">{result?.text}</p>
          )}
          {result?.detectedLang && result.detectedLang !== sourceLang && sourceLang === "auto" && (
            <p className="text-xs text-stone-400 mt-2">
              Detected: {DEEPL_LANGUAGES.find((l) => l.code === result.detectedLang)?.name ?? result.detectedLang}
            </p>
          )}
        </div>
      )}

      {/* Common phrases */}
      <div>
        <h2 className="font-bold text-stone-800 mb-3">Common Travel Phrases</h2>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 mb-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {COMMON_PHRASES.filter((p) => !selectedCategory || p.category === selectedCategory).map(
            (phrase) => (
              <button
                key={phrase.en}
                onClick={() => usePhrase(phrase.en)}
                className="flex items-center justify-between bg-white border border-stone-200 rounded-xl px-4 py-3 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left group"
              >
                <div>
                  <p className="text-sm font-medium text-stone-800">{phrase.en}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{phrase.category}</p>
                </div>
                <span className="text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Translate →
                </span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
