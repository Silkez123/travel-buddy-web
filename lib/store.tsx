"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { Postcard, Trip, SavedPlace, SavedExperience, BoardingPass } from "@/types";
import * as db from "@/lib/db";
import { createClient } from "@/lib/supabase/client";

interface StoreState {
  user: User | null;
  postcards: Postcard[];
  trips: Trip[];
  savedPlaces: SavedPlace[];
  savedExperiences: SavedExperience[];
  boardingPasses: BoardingPass[];
  loading: boolean;
  addPostcard: (p: Postcard) => Promise<void>;
  removePostcard: (id: string) => Promise<void>;
  addTrip: (t: Trip) => Promise<void>;
  removeTrip: (id: string) => Promise<void>;
  addSavedPlace: (p: SavedPlace) => Promise<void>;
  removeSavedPlace: (id: string) => Promise<void>;
  addSavedExperience: (e: SavedExperience) => Promise<void>;
  removeSavedExperience: (id: string) => Promise<void>;
  markExperienceBooked: (id: string, booked: boolean) => Promise<void>;
  addBoardingPass: (p: BoardingPass) => Promise<void>;
  removeBoardingPass: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [savedExperiences, setSavedExperiences] = useState<SavedExperience[]>([]);
  const [boardingPasses, setBoardingPasses] = useState<BoardingPass[]>([]);
  const [loading, setLoading] = useState(true);
  const migratedRef = useRef(false);

  // ── Load data based on auth state ─────────────────────────────────────────
  const loadData = useCallback(async (currentUser: User | null) => {
    setLoading(true);
    try {
      if (currentUser) {
        const [t, p, s, e, bp] = await Promise.all([
          db.sb_getAllTrips(supabase),
          db.sb_getAllPostcards(supabase),
          db.sb_getAllSavedPlaces(supabase),
          db.sb_getAllSavedExperiences(supabase),
          db.sb_getAllBoardingPasses(supabase),
        ]);
        setTrips(t);
        setPostcards(p);
        setSavedPlaces(s);
        setSavedExperiences(e);
        setBoardingPasses(bp);
      } else {
        const [t, p, s, e] = await Promise.all([
          db.idb_getAllTrips(),
          db.idb_getAllPostcards(),
          db.idb_getAllSavedPlaces(),
          db.idb_getAllSavedExperiences(),
        ]);
        setTrips(t.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        setPostcards(p.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
        setSavedPlaces(s);
        setSavedExperiences(e.sort((a, b) => b.savedAt.localeCompare(a.savedAt)));
        setBoardingPasses([]); // Boarding passes are cloud-only (auth required)
      }
    } catch (err) {
      console.error("Store load error:", err);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth state subscription ───────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      loadData(u);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const nextUser = session?.user ?? null;
        setUser(nextUser);

        if (event === "SIGNED_IN" && nextUser && !migratedRef.current) {
          migratedRef.current = true;
          await db.migrateLocalToSupabase(supabase, nextUser.id).catch(() => {});
        }

        loadData(nextUser);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const addPostcard = useCallback(async (p: Postcard) => {
    if (user) await db.sb_savePostcard(supabase, p, user.id);
    else await db.idb_savePostcard(p);
    setPostcards((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const removePostcard = useCallback(async (id: string) => {
    if (user) await db.sb_deletePostcard(supabase, id);
    else await db.idb_deletePostcard(id);
    setPostcards((prev) => prev.filter((x) => x.id !== id));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addTrip = useCallback(async (t: Trip) => {
    if (user) await db.sb_saveTrip(supabase, t, user.id);
    else await db.idb_saveTrip(t);
    setTrips((prev) => [t, ...prev.filter((x) => x.id !== t.id)]);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeTrip = useCallback(async (id: string) => {
    if (user) await db.sb_deleteTrip(supabase, id);
    else await db.idb_deleteTrip(id);
    setTrips((prev) => prev.filter((x) => x.id !== id));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addSavedPlace = useCallback(async (p: SavedPlace) => {
    if (user) await db.sb_savePlaceItem(supabase, p, user.id);
    else await db.idb_savePlaceItem(p);
    setSavedPlaces((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeSavedPlace = useCallback(async (id: string) => {
    if (user) await db.sb_deleteSavedPlace(supabase, id);
    else await db.idb_deleteSavedPlace(id);
    setSavedPlaces((prev) => prev.filter((x) => x.id !== id));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addSavedExperience = useCallback(async (e: SavedExperience) => {
    if (user) await db.sb_saveSavedExperience(supabase, e, user.id);
    else await db.idb_saveSavedExperience(e);
    setSavedExperiences((prev) => [e, ...prev.filter((x) => x.id !== e.id)]);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeSavedExperience = useCallback(async (id: string) => {
    if (user) await db.sb_deleteSavedExperience(supabase, id);
    else await db.idb_deleteSavedExperience(id);
    setSavedExperiences((prev) => prev.filter((x) => x.id !== id));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const markExperienceBooked = useCallback(async (id: string, booked: boolean) => {
    if (user) await db.sb_updateSavedExperienceBooked(supabase, id, booked);
    setSavedExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, booked } : e))
    );
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addBoardingPass = useCallback(async (p: BoardingPass) => {
    if (user) await db.sb_saveBoardingPass(supabase, p, user.id);
    else await db.idb_saveBoardingPass(p);
    setBoardingPasses((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeBoardingPass = useCallback(async (id: string) => {
    if (user) await db.sb_deleteBoardingPass(supabase, id);
    else await db.idb_deleteBoardingPass(id);
    setBoardingPasses((prev) => prev.filter((x) => x.id !== id));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StoreContext.Provider
      value={{
        user, postcards, trips, savedPlaces, savedExperiences, boardingPasses, loading,
        addPostcard, removePostcard,
        addTrip, removeTrip,
        addSavedPlace, removeSavedPlace,
        addSavedExperience, removeSavedExperience, markExperienceBooked,
        addBoardingPass, removeBoardingPass,
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
