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
