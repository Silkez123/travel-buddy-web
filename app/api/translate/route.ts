import { NextRequest, NextResponse } from "next/server";

const DEEPL_API_URL = process.env.DEEPL_API_FREE === "true"
  ? "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate";

export async function POST(req: NextRequest) {
  const { text, targetLang, sourceLang } = await req.json();

  if (!text || !targetLang) {
    return NextResponse.json({ error: "Missing text or targetLang" }, { status: 400 });
  }

  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    // Return mock translation when no key is configured
    return NextResponse.json({
      translatedText: `[DeepL] ${text}`,
      detectedSourceLang: sourceLang === "auto" ? "EN" : sourceLang,
      mock: true,
    });
  }

  const params = new URLSearchParams({
    text,
    target_lang: targetLang,
  });

  if (sourceLang && sourceLang !== "auto") {
    params.append("source_lang", sourceLang);
  }

  const res = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const translation = data.translations?.[0];

  return NextResponse.json({
    translatedText: translation?.text ?? "",
    detectedSourceLang: translation?.detected_source_language ?? sourceLang,
    mock: false,
  });
}
