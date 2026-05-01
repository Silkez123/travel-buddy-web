import { openDB, DBSchema, IDBPDatabase } from "idb";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Postcard, Trip, SavedPlace, SavedExperience, BoardingPass } from "@/types";

// ── IndexedDB (local / offline) ───────────────────────────────────────────────

interface TravelBuddyDB extends DBSchema {
  postcards: { key: string; value: Postcard; indexes: { by_trip: string } };
  trips: { key: string; value: Trip };
  saved_places: { key: string; value: SavedPlace };
  saved_experiences: { key: string; value: SavedExperience };
  boarding_passes: { key: string; value: BoardingPass };
}

let dbPromise: Promise<IDBPDatabase<TravelBuddyDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<TravelBuddyDB>("travel-buddy", 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const postcardStore = db.createObjectStore("postcards", { keyPath: "id" });
          postcardStore.createIndex("by_trip", "tripId");
          db.createObjectStore("trips", { keyPath: "id" });
          db.createObjectStore("saved_places", { keyPath: "id" });
        }
        if (oldVersion < 2) {
          db.createObjectStore("saved_experiences", { keyPath: "id" });
          db.createObjectStore("boarding_passes", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

// Postcards — IndexedDB
export async function idb_getAllPostcards(): Promise<Postcard[]> {
  const db = await getDB();
  return db.getAll("postcards");
}
export async function idb_savePostcard(p: Postcard): Promise<void> {
  const db = await getDB();
  await db.put("postcards", p);
}
export async function idb_deletePostcard(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("postcards", id);
}

// Trips — IndexedDB
export async function idb_getAllTrips(): Promise<Trip[]> {
  const db = await getDB();
  return db.getAll("trips");
}
export async function idb_saveTrip(t: Trip): Promise<void> {
  const db = await getDB();
  await db.put("trips", t);
}
export async function idb_deleteTrip(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("trips", id);
}

// Saved Places — IndexedDB
export async function idb_getAllSavedPlaces(): Promise<SavedPlace[]> {
  const db = await getDB();
  return db.getAll("saved_places");
}
export async function idb_savePlaceItem(p: SavedPlace): Promise<void> {
  const db = await getDB();
  await db.put("saved_places", p);
}
export async function idb_deleteSavedPlace(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("saved_places", id);
}

// ── Supabase (cloud / cross-device) ──────────────────────────────────────────

function rowToTrip(row: Record<string, unknown>): Trip {
  return {
    id: row.id as string,
    name: row.name as string,
    destination: row.destination as string,
    emoji: row.emoji as string,
    startDate: row.start_date as string,
    endDate: (row.end_date as string) ?? "",
    createdAt: row.created_at as string,
  };
}

function rowToPostcard(row: Record<string, unknown>): Postcard {
  return {
    id: row.id as string,
    tripId: (row.trip_id as string) ?? undefined,
    photos: (row.photos as string[]) ?? [],
    message: (row.message as string) ?? "",
    location: (row.location as string) ?? "",
    templateId: (row.template_id as Postcard["templateId"]) ?? "classic",
    stickers: (row.stickers as Postcard["stickers"]) ?? [],
    messageFontSize: (row.message_font_size as number) ?? 14,
    messageColor: (row.message_color as string) ?? "#1c1917",
    createdAt: row.created_at as string,
  };
}

function rowToSavedPlace(row: Record<string, unknown>): SavedPlace {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    address: (row.address as string) ?? "",
    lat: row.lat as number,
    lng: row.lng as number,
    savedAt: row.saved_at as string,
  };
}

// Trips — Supabase
export async function sb_getAllTrips(supabase: SupabaseClient): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToTrip);
}

export async function sb_saveTrip(supabase: SupabaseClient, t: Trip, userId: string): Promise<void> {
  const { error } = await supabase.from("trips").upsert({
    id: t.id,
    user_id: userId,
    name: t.name,
    destination: t.destination,
    emoji: t.emoji,
    start_date: t.startDate,
    end_date: t.endDate || null,
    created_at: t.createdAt,
  });
  if (error) throw error;
}

export async function sb_deleteTrip(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw error;
}

// Postcards — Supabase
export async function sb_getAllPostcards(supabase: SupabaseClient): Promise<Postcard[]> {
  const { data, error } = await supabase
    .from("postcards")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToPostcard);
}

export async function sb_savePostcard(supabase: SupabaseClient, p: Postcard, userId: string): Promise<void> {
  const { error } = await supabase.from("postcards").upsert({
    id: p.id,
    user_id: userId,
    trip_id: p.tripId ?? null,
    photos: p.photos,
    message: p.message,
    location: p.location,
    template_id: p.templateId,
    stickers: p.stickers,
    message_font_size: p.messageFontSize,
    message_color: p.messageColor,
    created_at: p.createdAt,
  });
  if (error) throw error;
}

export async function sb_deletePostcard(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("postcards").delete().eq("id", id);
  if (error) throw error;
}

// Saved Places — Supabase
export async function sb_getAllSavedPlaces(supabase: SupabaseClient): Promise<SavedPlace[]> {
  const { data, error } = await supabase
    .from("saved_places")
    .select("*")
    .order("saved_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToSavedPlace);
}

export async function sb_savePlaceItem(supabase: SupabaseClient, p: SavedPlace, userId: string): Promise<void> {
  const { error } = await supabase.from("saved_places").upsert({
    id: p.id,
    user_id: userId,
    name: p.name,
    category: p.category,
    address: p.address,
    lat: p.lat,
    lng: p.lng,
    saved_at: p.savedAt,
  });
  if (error) throw error;
}

export async function sb_deleteSavedPlace(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("saved_places").delete().eq("id", id);
  if (error) throw error;
}

// Saved Experiences — IndexedDB
export async function idb_getAllSavedExperiences(): Promise<SavedExperience[]> {
  const db = await getDB();
  return db.getAll("saved_experiences");
}
export async function idb_saveSavedExperience(e: SavedExperience): Promise<void> {
  const db = await getDB();
  await db.put("saved_experiences", e);
}
export async function idb_deleteSavedExperience(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("saved_experiences", id);
}

// Boarding Passes — IndexedDB
export async function idb_getAllBoardingPasses(): Promise<BoardingPass[]> {
  const db = await getDB();
  return db.getAll("boarding_passes");
}
export async function idb_saveBoardingPass(p: BoardingPass): Promise<void> {
  const db = await getDB();
  await db.put("boarding_passes", p);
}
export async function idb_deleteBoardingPass(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("boarding_passes", id);
}

// Saved Experiences — Supabase
export async function sb_getAllSavedExperiences(supabase: SupabaseClient): Promise<SavedExperience[]> {
  const { data, error } = await supabase
    .from("saved_experiences")
    .select("*")
    .order("saved_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    experience: row.experience as SavedExperience["experience"],
    booked: row.booked as boolean,
    notes: row.notes as string | undefined,
    savedAt: row.saved_at as string,
  }));
}
export async function sb_saveSavedExperience(supabase: SupabaseClient, e: SavedExperience, userId: string): Promise<void> {
  const { error } = await supabase.from("saved_experiences").upsert({
    id: e.id,
    user_id: userId,
    experience: e.experience,
    booked: e.booked,
    notes: e.notes ?? null,
    saved_at: e.savedAt,
  });
  if (error) throw error;
}
export async function sb_deleteSavedExperience(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("saved_experiences").delete().eq("id", id);
  if (error) throw error;
}
export async function sb_updateSavedExperienceBooked(supabase: SupabaseClient, id: string, booked: boolean): Promise<void> {
  const { error } = await supabase.from("saved_experiences").update({ booked }).eq("id", id);
  if (error) throw error;
}

// Boarding Passes — Supabase
export async function sb_getAllBoardingPasses(supabase: SupabaseClient): Promise<BoardingPass[]> {
  const { data, error } = await supabase
    .from("boarding_passes")
    .select("*")
    .order("departure_date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    airline: row.airline as string,
    flightNumber: row.flight_number as string,
    origin: row.origin as string,
    originCode: row.origin_code as string,
    destination: row.destination as string,
    destinationCode: row.destination_code as string,
    departureDate: row.departure_date as string,
    departureTime: row.departure_time as string,
    arrivalTime: row.arrival_time as string,
    seat: row.seat as string,
    gate: row.gate as string | undefined,
    terminal: row.terminal as string | undefined,
    bookingRef: row.booking_ref as string,
    passengerName: row.passenger_name as string,
    class: row.class as BoardingPass["class"],
    createdAt: row.created_at as string,
  }));
}
export async function sb_saveBoardingPass(supabase: SupabaseClient, p: BoardingPass, userId: string): Promise<void> {
  const { error } = await supabase.from("boarding_passes").upsert({
    id: p.id,
    user_id: userId,
    airline: p.airline,
    flight_number: p.flightNumber,
    origin: p.origin,
    origin_code: p.originCode,
    destination: p.destination,
    destination_code: p.destinationCode,
    departure_date: p.departureDate,
    departure_time: p.departureTime,
    arrival_time: p.arrivalTime,
    seat: p.seat,
    gate: p.gate ?? null,
    terminal: p.terminal ?? null,
    booking_ref: p.bookingRef,
    passenger_name: p.passengerName,
    class: p.class,
    created_at: p.createdAt,
  });
  if (error) throw error;
}
export async function sb_deleteBoardingPass(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("boarding_passes").delete().eq("id", id);
  if (error) throw error;
}

// ── Migration helper ──────────────────────────────────────────────────────────
// Call after login to push any locally-stored data to Supabase

export async function migrateLocalToSupabase(supabase: SupabaseClient, userId: string): Promise<void> {
  const [localTrips, localPostcards, localPlaces, localExperiences] = await Promise.all([
    idb_getAllTrips(),
    idb_getAllPostcards(),
    idb_getAllSavedPlaces(),
    idb_getAllSavedExperiences(),
  ]);

  await Promise.all([
    ...localTrips.map((t) => sb_saveTrip(supabase, t, userId).catch(() => {})),
    ...localPostcards.map((p) => sb_savePostcard(supabase, p, userId).catch(() => {})),
    ...localPlaces.map((p) => sb_savePlaceItem(supabase, p, userId).catch(() => {})),
    ...localExperiences.map((e) => sb_saveSavedExperience(supabase, e, userId).catch(() => {})),
  ]);
}

// Legacy aliases kept for any remaining code that calls the old names
export const getAllPostcards = idb_getAllPostcards;
export const getPostcardsByTrip = async (tripId: string): Promise<Postcard[]> => {
  const all = await idb_getAllPostcards();
  return all.filter((p) => p.tripId === tripId);
};
export const savePostcard = idb_savePostcard;
export const deletePostcard = idb_deletePostcard;
export const getAllTrips = idb_getAllTrips;
export const saveTrip = idb_saveTrip;
export const deleteTrip = idb_deleteTrip;
export const getAllSavedPlaces = idb_getAllSavedPlaces;
export const savePlaceItem = idb_savePlaceItem;
export const deleteSavedPlace = idb_deleteSavedPlace;
