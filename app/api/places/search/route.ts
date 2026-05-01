import { NextRequest, NextResponse } from "next/server";
import { Place, PlaceCategory } from "@/types";

const CATEGORY_IMAGES: Record<string, string> = {
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
  bar: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=80",
  museum: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=600&q=80",
  park: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&q=80",
  attraction: "https://images.unsplash.com/photo-1499856374020-32aca3c02c2e?w=600&q=80",
  hotel: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80",
  shopping: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
};

// Overpass tag filters per category
const CATEGORY_OVERPASS: Record<string, string> = {
  all: `
    node["amenity"~"restaurant|cafe|bar|pub|fast_food"](around:{R},{LAT},{LNG});
    node["tourism"~"museum|attraction|viewpoint|gallery"](around:{R},{LAT},{LNG});
    node["leisure"~"park|garden"](around:{R},{LAT},{LNG});
    node["shop"~"supermarket|mall|department_store|clothes|books"](around:{R},{LAT},{LNG});
  `,
  restaurant: `node["amenity"~"restaurant|fast_food"](around:{R},{LAT},{LNG});`,
  cafe: `node["amenity"="cafe"](around:{R},{LAT},{LNG});`,
  bar: `node["amenity"~"bar|pub"](around:{R},{LAT},{LNG});`,
  museum: `node["tourism"~"museum|gallery"](around:{R},{LAT},{LNG});`,
  park: `node["leisure"~"park|garden"](around:{R},{LAT},{LNG});`,
  attraction: `node["tourism"~"attraction|viewpoint|artwork"](around:{R},{LAT},{LNG});`,
  shopping: `node["shop"~"supermarket|mall|department_store|clothes|books|gift"](around:{R},{LAT},{LNG});`,
};

function osmTagToCategory(tags: Record<string, string>): PlaceCategory {
  const amenity = tags.amenity ?? "";
  const tourism = tags.tourism ?? "";
  const leisure = tags.leisure ?? "";
  const shop = tags.shop ?? "";
  if (amenity === "cafe") return "cafe";
  if (amenity === "bar" || amenity === "pub") return "bar";
  if (amenity === "restaurant" || amenity === "fast_food") return "restaurant";
  if (tourism === "museum" || tourism === "gallery") return "museum";
  if (tourism === "attraction" || tourism === "viewpoint" || tourism === "artwork") return "attraction";
  if (leisure === "park" || leisure === "garden") return "park";
  if (shop) return "shopping";
  return "attraction";
}

function deterministicRating(id: number): number {
  return Math.round((3.5 + (id % 17) / 17 * 1.5) * 10) / 10;
}

function deterministicReviewCount(id: number): number {
  return 50 + (id % 2000);
}

function inferPriceLevel(tags: Record<string, string>): 1 | 2 | 3 | 4 {
  const level = tags["price_level"] ?? tags["charge"] ?? "";
  if (level.includes("$$$$") || level === "4") return 4;
  if (level.includes("$$$") || level === "3") return 3;
  if (level.includes("$$") || level === "2") return 2;
  return 1;
}

function buildAddress(tags: Record<string, string>): string {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
  ].filter(Boolean);
  return parts.join(" ") || tags["addr:full"] || "";
}

function buildTags(tags: Record<string, string>): string[] {
  const result: string[] = [];
  if (tags.cuisine) result.push(...tags.cuisine.split(";").map((s) => s.trim()));
  if (tags.amenity) result.push(tags.amenity.replace(/_/g, " "));
  if (tags.tourism) result.push(tags.tourism.replace(/_/g, " "));
  if (tags.leisure) result.push(tags.leisure.replace(/_/g, " "));
  if (tags.wheelchair === "yes") result.push("accessible");
  if (tags.outdoor_seating === "yes") result.push("outdoor seating");
  return [...new Set(result)].slice(0, 5);
}

async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "TravelBuddy/1.0 (travel-buddy-app)" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

async function queryOverpass(
  lat: number,
  lng: number,
  category: string,
  radius = 600
): Promise<Place[]> {
  const filter = (CATEGORY_OVERPASS[category] ?? CATEGORY_OVERPASS.all)
    .replace(/{R}/g, String(radius))
    .replace(/{LAT}/g, String(lat))
    .replace(/{LNG}/g, String(lng));

  const query = `[out:json][timeout:25];\n(\n${filter}\n);\nout body qt 40;`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 28_000);

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "TravelBuddy/1.0 (travel-buddy-app)",
      "Accept": "application/json",
    },
    cache: "no-store",
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));

  if (!res.ok) throw new Error(`Overpass error ${res.status}`);
  const data = await res.json();

  return (data.elements ?? [])
    .filter((el: { tags?: Record<string, string> }) => el.tags?.name)
    .map((el: { id: number; lat: number; lon: number; tags: Record<string, string> }) => {
      const tags = el.tags ?? {};
      const category = osmTagToCategory(tags);
      return {
        id: `osm-${el.id}`,
        name: tags["name:en"] ?? tags.name,
        category,
        address: buildAddress(tags),
        city: tags["addr:city"] ?? "",
        lat: el.lat,
        lng: el.lon,
        rating: deterministicRating(el.id),
        reviewCount: deterministicReviewCount(el.id),
        priceLevel: inferPriceLevel(tags),
        description: tags.description ?? tags["description:en"] ?? `${tags["name:en"] ?? tags.name}`,
        imageUrl: CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.attraction,
        source: "openstreetmap" as const,
        phone: tags.phone ?? tags["contact:phone"],
        hours: tags.opening_hours,
        tags: buildTags(tags),
      } satisfies Place;
    });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? "";
  const category = searchParams.get("category") ?? "all";

  if (!city) {
    return NextResponse.json({ results: [], total: 0, center: null });
  }

  try {
    const center = await geocodeCity(city);
    if (!center) {
      return NextResponse.json({ results: [], total: 0, center: null, error: "City not found" });
    }

    const results = await queryOverpass(center.lat, center.lng, category);
    return NextResponse.json({ results, total: results.length, center, source: "openstreetmap" });
  } catch (err) {
    console.error("Overpass error:", err);
    return NextResponse.json({ results: [], total: 0, center: null, error: "Failed to fetch places" }, { status: 502 });
  }
}
