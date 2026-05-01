import { NextRequest, NextResponse } from "next/server";
import { MOCK_ESIM_PLANS } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country")?.toLowerCase() ?? "";
  const coverage = searchParams.get("coverage") ?? "all";

  let results = MOCK_ESIM_PLANS;

  if (country) {
    results = results.filter(
      (p) =>
        p.country.toLowerCase().includes(country) ||
        p.countryCode.toLowerCase() === country
    );
  }

  if (coverage !== "all") {
    results = results.filter((p) => p.coverage === coverage);
  }

  results = results.sort((a, b) => a.priceUsd - b.priceUsd);

  await new Promise((r) => setTimeout(r, 200));

  return NextResponse.json({ results, total: results.length, source: "airalo-mock" });
}
