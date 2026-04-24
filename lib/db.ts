import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Postcard, Trip, SavedPlace } from "@/types";

interface TravelBuddyDB extends DBSchema {
  postcards: { key: string; value: Postcard; indexes: { by_trip: string } };
  trips: { key: string; value: Trip };
  saved_places: { key: string; value: SavedPlace };
}

let dbPromise: Promise<IDBPDatabase<TravelBuddyDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<TravelBuddyDB>("travel-buddy", 1, {
      upgrade(db) {
        const postcardStore = db.createObjectStore("postcards", { keyPath: "id" });
        postcardStore.createIndex("by_trip", "tripId");
        db.createObjectStore("trips", { keyPath: "id" });
        db.createObjectStore("saved_places", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

// Postcards
export async function getAllPostcards(): Promise<Postcard[]> {
  const db = await getDB();
  return db.getAll("postcards");
}
export async function getPostcardsByTrip(tripId: string): Promise<Postcard[]> {
  const db = await getDB();
  return db.getAllFromIndex("postcards", "by_trip", tripId);
}
export async function savePostcard(p: Postcard): Promise<void> {
  const db = await getDB();
  await db.put("postcards", p);
}
export async function deletePostcard(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("postcards", id);
}

// Trips
export async function getAllTrips(): Promise<Trip[]> {
  const db = await getDB();
  return db.getAll("trips");
}
export async function saveTrip(t: Trip): Promise<void> {
  const db = await getDB();
  await db.put("trips", t);
}
export async function deleteTrip(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("trips", id);
}

// Saved Places
export async function getAllSavedPlaces(): Promise<SavedPlace[]> {
  const db = await getDB();
  return db.getAll("saved_places");
}
export async function savePlaceItem(p: SavedPlace): Promise<void> {
  const db = await getDB();
  await db.put("saved_places", p);
}
export async function deleteSavedPlace(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("saved_places", id);
}
