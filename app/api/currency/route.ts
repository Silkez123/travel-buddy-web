import { NextRequest, NextResponse } from "next/server";

// Frankfurter uses ECB data — free, no API key required
const BASE = "https://api.frankfurter.app";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "USD";
  const to = searchParams.get("to") ?? "EUR";
  const amount = parseFloat(searchParams.get("amount") ?? "1");

  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  // Frankfurter returns 1:1 when from === to without hitting API
  if (from === to) {
    return NextResponse.json({ from, to, amount, result: amount, rate: 1 });
  }

  try {
    const url = `${BASE}/latest?from=${from}&to=${to}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Frankfurter ${res.status}`);
    const data = await res.json();

    const rate: number = data.rates?.[to];
    if (!rate) throw new Error(`No rate for ${to}`);

    return NextResponse.json({
      from,
      to,
      amount,
      result: Math.round(amount * rate * 10000) / 10000,
      rate,
      date: data.date,
    });
  } catch (err) {
    console.error("Currency error:", err);
    return NextResponse.json({ error: "Failed to fetch exchange rate" }, { status: 502 });
  }
}

// Return list of supported currencies
export async function POST() {
  try {
    const res = await fetch(`${BASE}/currencies`, { cache: "force-cache" });
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Fallback list of common travel currencies
    return NextResponse.json({
      AED: "UAE Dirham", AUD: "Australian Dollar", BGN: "Bulgarian Lev",
      BRL: "Brazilian Real", CAD: "Canadian Dollar", CHF: "Swiss Franc",
      CNY: "Chinese Yuan", CZK: "Czech Koruna", DKK: "Danish Krone",
      EUR: "Euro", GBP: "British Pound", HKD: "Hong Kong Dollar",
      HUF: "Hungarian Forint", IDR: "Indonesian Rupiah", ILS: "Israeli Shekel",
      INR: "Indian Rupee", ISK: "Icelandic Króna", JPY: "Japanese Yen",
      KRW: "South Korean Won", MXN: "Mexican Peso", MYR: "Malaysian Ringgit",
      NOK: "Norwegian Krone", NZD: "New Zealand Dollar", PHP: "Philippine Peso",
      PLN: "Polish Zloty", RON: "Romanian Leu", SEK: "Swedish Krona",
      SGD: "Singapore Dollar", THB: "Thai Baht", TRY: "Turkish Lira",
      USD: "US Dollar", ZAR: "South African Rand",
    });
  }
}
