"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { Postcard, Trip, SavedPlace } from "@/types";
import * as db from "@/lib/db";
import { createClient } from "@/lib/supabase/client";

interface StoreState {
  user: User | null;
  postcards: Postcard[];
  trips: Trip[];
  savedPlaces: SavedPlace[];
  loading: boolean;
  addPostcard: (p: Postcard) => Promise<void>;
  removePostcard: (id: string) => Promise<void>;
  addTrip: (t: Trip) => Promise<void>;
  removeTrip: (id: string) => Promise<void>;
  addSavedPlace: (p: SavedPlace) => Promise<void>;
  removeSavedPlace: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const migratedRef = useRef(false);

  // ── Load data based on auth state ─────────────────────────────────────────
  const loadData = useCallback(async (currentUser: User | null) => {
    setLoading(true);
    try {
      if (currentUser) {
        const [t, p, s] = await Promise.all([
          db.sb_getAllTrips(supabase),
          db.sb_getAllPostcards(supabase),
          db.sb_getAllSavedPlaces(supabase),
        ]);
        setTrips(t);
        setPostcards(p);
        setSavedPlaces(s);
      } else {
        const [t, p, s] = await Promise.all([
          db.idb_getAllTrips(),
          db.idb_getAllPostcards(),
          db.idb_getAllSavedPlaces(),
        ]);
        setTrips(t.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        setPostcards(p.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        setSavedPlaces(s);
      }
    } catch (err) {
      console.error("Store load error:", err);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth state subscription ───────────────────────────────────────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      loadData(u);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const nextUser = session?.user ?? null;
        setUser(nextUser);

        // On first sign-in, migrate any local IndexedDB data to Supabase
        if (event === "SIGNED_IN" && nextUser && !migratedRef.current) {
          migratedRef.current = true;
          await db.migrateLocalToSupabase(supabase, nextUser.id).catch(() => {});
        }

        loadData(nextUser);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── CRUD helpers ──────────────────────────────────────────────────────────
  const addPostcard = useCallback(async (p: Postcard) => {
    if (user) {
      await db.sb_savePostcard(supabase, p, user.id);
    } else {
      await db.idb_savePostcard(p);
    }
    setPostcards((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const removePostcard = useCallback(async (id: string) => {
    if (user) {
      await db.sb_deletePostcard(supabase, id);
    } else {
      await db.idb_deletePostcard(id);
    }
    setPostcards((prev) => prev.filter((x) => x.id !== id));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addTrip = useCallback(async (t: Trip) => {
    if (user) {
      await db.sb_saveTrip(supabase, t, user.id);
    } else {
      await db.idb_saveTrip(t);
    }
    setTrips((prev) => [t, ...prev.filter((x) => x.id !== t.id)]);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeTrip = useCallback(async (id: string) => {
    if (user) {
      await db.sb_deleteTrip(supabase, id);
    } else {
      await db.idb_deleteTrip(id);
    }
    setTrips((prev) => prev.filter((x) => x.id !== id));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addSavedPlace = useCallback(async (p: SavedPlace) => {
    if (user) {
      await db.sb_savePlaceItem(supabase, p, user.id);
    } else {
      await db.idb_savePlaceItem(p);
    }
    setSavedPlaces((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeSavedPlace = useCallback(async (id: string) => {
    if (user) {
      await db.sb_deleteSavedPlace(supabase, id);
    } else {
      await db.idb_deleteSavedPlace(id);
    }
    setSavedPlaces((prev) => prev.filter((x) => x.id !== id));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StoreContext.Provider
      value={{
        user,
        postcards,
        trips,
        savedPlaces,
        loading,
        addPostcard,
        removePostcard,
        addTrip,
        removeTrip,
        addSavedPlace,
        removeSavedPlace,
        signOut,
      }}
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
