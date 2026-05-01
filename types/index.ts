export interface Sticker {
  id: string;
  emoji: string;
  x: number; // 0–1 normalized
  y: number;
  scale: number;
  rotation: number;
}

export type TemplateId =
  | "classic"
  | "modern"
  | "vintage"
  | "split"
  | "duo"
  | "grid"
  | "feature";

export interface Postcard {
  id: string;
  tripId?: string;
  photos: string[]; // base64 data URLs
  message: string;
  location: string;
  templateId: TemplateId;
  stickers: Sticker[];
  messageFontSize: number;
  messageColor: string;
  createdAt: string; // ISO date
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  emoji: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface SavedPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  savedAt: string;
}

export type PlaceCategory = "restaurant" | "attraction" | "hotel" | "cafe" | "bar" | "museum" | "park" | "shopping";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  city: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  description: string;
  imageUrl: string;
  source: "yelp" | "tripadvisor" | "openstreetmap";
  phone?: string;
  hours?: string;
  tags: string[];
}

export type ExperienceCategory = "tour" | "activity" | "food" | "adventure" | "culture" | "transport";

export interface Experience {
  id: string;
  title: string;
  category: ExperienceCategory;
  city: string;
  country: string;
  durationHours: number;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  highlights: string[];
  provider: string;
  source: "viator";
  groupSize: string;
  languages: string[];
  included: string[];
}

export interface EsimPlan {
  id: string;
  carrier: string;
  country: string;
  countryCode: string;
  flag: string;
  dataGb: number;
  durationDays: number;
  priceUsd: number;
  coverage: "local" | "regional" | "global";
  network: string;
  topUpAvailable: boolean;
  hotspotAllowed: boolean;
  source: "airalo";
  popular: boolean;
}

export interface TranslationResult {
  detectedSourceLang: string;
  translatedText: string;
}
