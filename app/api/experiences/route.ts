import { NextRequest, NextResponse } from "next/server";
import { MOCK_EXPERIENCES } from "@/lib/mock-data";
import { Experience, ExperienceCategory } from "@/types";

const VIATOR_BASE = "https://api.viator.com/partner";

function viatorHeaders() {
  return {
    "exp-api-key": process.env.VIATOR_API_KEY ?? "",
    "Accept": "application/json;version=2.0",
    "Accept-Language": "en-US",
    "Content-Type": "application/json",
  };
}

function viatorCategoryToLocal(tags: string[]): ExperienceCategory {
  const t = tags.map((s) => s.toLowerCase()).join(" ");
  if (t.includes("food") || t.includes("drink") || t.includes("culinary") || t.includes("cooking")) return "food";
  if (t.includes("adventure") || t.includes("outdoor") || t.includes("sport")) return "adventure";
  if (t.includes("museum") || t.includes("history") || t.includes("culture") || t.includes("art")) return "culture";
  if (t.includes("transport") || t.includes("transfer") || t.includes("cruise")) return "transport";
  if (t.includes("activity") || t.includes("class") || t.includes("workshop")) return "activity";
  return "tour";
}

function mapViatorProduct(p: Record<string, unknown>): Experience {
  const title = (p.title as string) ?? "Experience";
  const images = (p.images as { variants?: { url: string }[] }[]) ?? [];
  const imageUrl = images[0]?.variants?.find((v) => v.url?.includes("800"))?.url
    ?? images[0]?.variants?.[0]?.url
    ?? "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80";

  const pricing = p.pricing as { summary?: { fromPrice?: number }; currency?: string } | undefined;
  const reviews = p.reviews as { combinedAverageRating?: number; totalReviews?: number } | undefined;
  const duration = p.duration as { fixedDurationInMinutes?: number } | undefined;
  const tags = ((p.tags as { allNamesByLocale?: { en?: string[] } }[]) ?? [])
    .flatMap((t) => t.allNamesByLocale?.en ?? []);
  const location = p.productUrl as string ?? "";
  const cityMatch = location.match(/\/([^/]+)-tours/);

  return {
    id: (p.productCode as string) ?? String(Math.random()),
    title,
    category: viatorCategoryToLocal(tags),
    city: cityMatch?.[1]?.replace(/-/g, " ") ?? "",
    country: "",
    durationHours: Math.round(((duration?.fixedDurationInMinutes ?? 120) / 60) * 10) / 10,
    price: pricing?.summary?.fromPrice ?? 0,
    currency: pricing?.currency ?? "USD",
    rating: reviews?.combinedAverageRating ?? 4.5,
    reviewCount: reviews?.totalReviews ?? 0,
    imageUrl,
    description: (p.description as string ?? "").replace(/<[^>]+>/g, "").slice(0, 200),
    highlights: ((p.inclusions as { otherDescription?: string }[]) ?? [])
      .slice(0, 4)
      .map((inc) => inc.otherDescription ?? "")
      .filter(Boolean),
    provider: "Viator",
    source: "viator",
    groupSize: "Check availability",
    languages: ["English"],
    included: ((p.inclusions as { otherDescription?: string }[]) ?? [])
      .slice(0, 3)
      .map((inc) => inc.otherDescription ?? "")
      .filter(Boolean),
  } satisfies Experience;
}

async function searchViator(city: string, category: string, maxPrice: number): Promise<Experience[]> {
  const body: Record<string, unknown> = {
    searchTerm: city,
    searchTypes: [
      {
        searchType: "PRODUCTS",
        pagination: { start: 1, count: 20 },
      },
    ],
    currency: "USD",
  };

  const res = await fetch(`${VIATOR_BASE}/search/freetext`, {
    method: "POST",
    headers: viatorHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Viator ${res.status}`);
  const data = await res.json();

  let products: Record<string, unknown>[] =
    data.products?.results ?? data.experiences?.results ?? [];

  if (maxPrice < 9999) {
    products = products.filter((p) => {
      const price = (p.pricing as { summary?: { fromPrice?: number } })?.summary?.fromPrice ?? 0;
      return price <= maxPrice;
    });
  }

  const experiences = products.map(mapViatorProduct);

  if (category !== "all") {
    return experiences.filter((e) => e.category === category);
  }
  return experiences;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? "";
  const category = searchParams.get("category") ?? "all";
  const maxPrice = Number(searchParams.get("maxPrice") ?? "9999");

  const apiKey = process.env.VIATOR_API_KEY;

  // Fall back to mock data if no API key or no city
  if (!apiKey || !city) {
    let results = MOCK_EXPERIENCES;
    if (city) results = results.filter((e) => e.city.toLowerCase().includes(city.toLowerCase()) || e.country.toLowerCase().includes(city.toLowerCase()));
    if (category !== "all") results = results.filter((e) => e.category === category);
    results = results.filter((e) => e.price <= maxPrice);
    return NextResponse.json({ results, total: results.length, source: "viator-mock" });
  }

  try {
    const results = await searchViator(city, category, maxPrice);
    return NextResponse.json({ results, total: results.length, source: "viator" });
  } catch (err) {
    console.error("Viator error:", err);
    // Fall back to mock on error
    let results = MOCK_EXPERIENCES;
    if (city) results = results.filter((e) => e.city.toLowerCase().includes(city.toLowerCase()));
    return NextResponse.json({ results, total: results.length, source: "viator-mock-fallback" });
  }
}
