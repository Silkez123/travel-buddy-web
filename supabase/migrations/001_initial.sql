-- Travel Buddy — initial schema
-- Run this in: Supabase Dashboard → SQL Editor

-- ── Trips ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id           TEXT        PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  destination  TEXT        NOT NULL,
  emoji        TEXT        NOT NULL DEFAULT '✈️',
  start_date   TEXT        NOT NULL,
  end_date     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their trips"
  ON trips FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Postcards ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS postcards (
  id                 TEXT        PRIMARY KEY,
  user_id            UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id            TEXT        REFERENCES trips(id) ON DELETE SET NULL,
  photos             JSONB       NOT NULL DEFAULT '[]',
  message            TEXT        NOT NULL DEFAULT '',
  location           TEXT        NOT NULL DEFAULT '',
  template_id        TEXT        NOT NULL DEFAULT 'classic',
  stickers           JSONB       NOT NULL DEFAULT '[]',
  message_font_size  INT         NOT NULL DEFAULT 14,
  message_color      TEXT        NOT NULL DEFAULT '#1c1917',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE postcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their postcards"
  ON postcards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Saved Places ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_places (
  id        TEXT             PRIMARY KEY,
  user_id   UUID             NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name      TEXT             NOT NULL,
  category  TEXT             NOT NULL,
  address   TEXT             NOT NULL DEFAULT '',
  lat       DOUBLE PRECISION NOT NULL,
  lng       DOUBLE PRECISION NOT NULL,
  saved_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their saved places"
  ON saved_places FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS trips_user_id_idx         ON trips(user_id);
CREATE INDEX IF NOT EXISTS postcards_user_id_idx     ON postcards(user_id);
CREATE INDEX IF NOT EXISTS postcards_trip_id_idx     ON postcards(trip_id);
CREATE INDEX IF NOT EXISTS saved_places_user_id_idx  ON saved_places(user_id);
