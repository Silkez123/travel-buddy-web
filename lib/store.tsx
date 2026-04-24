"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Postcard, Trip, SavedPlace } from "@/types";
import * as db from "@/lib/db";

interface StoreState {
  postcards: Postcard[];
  trips: Trip[];
  savedPlaces: SavedPlace[];
  addPostcard: (p: Postcard) => Promise<void>;
  removePostcard: (id: string) => Promise<void>;
  addTrip: (t: Trip) => Promise<void>;
  removeTrip: (id: string) => Promise<void>;
  addSavedPlace: (p: SavedPlace) => Promise<void>;
  removeSavedPlace: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  useEffect(() => {
    Promise.all([db.getAllPostcards(), db.getAllTrips(), db.getAllSavedPlaces()]).then(
      ([p, t, s]) => {
        setPostcards(p.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        setTrips(t.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        setSavedPlaces(s);
      }
    );
  }, []);

  const addPostcard = useCallback(async (p: Postcard) => {
    await db.savePostcard(p);
    setPostcards((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
  }, []);

  const removePostcard = useCallback(async (id: string) => {
    await db.deletePostcard(id);
    setPostcards((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addTrip = useCallback(async (t: Trip) => {
    await db.saveTrip(t);
    setTrips((prev) => [t, ...prev.filter((x) => x.id !== t.id)]);
  }, []);

  const removeTrip = useCallback(async (id: string) => {
    await db.deleteTrip(id);
    setTrips((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addSavedPlace = useCallback(async (p: SavedPlace) => {
    await db.savePlaceItem(p);
    setSavedPlaces((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
  }, []);

  const removeSavedPlace = useCallback(async (id: string) => {
    await db.deleteSavedPlace(id);
    setSavedPlaces((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return (
    <StoreContext.Provider
      value={{ postcards, trips, savedPlaces, addPostcard, removePostcard, addTrip, removeTrip, addSavedPlace, removeSavedPlace }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
