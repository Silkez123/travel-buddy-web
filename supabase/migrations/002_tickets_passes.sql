-- Migration 002: Saved Experiences + Boarding Passes
-- Run in: Supabase Dashboard → SQL Editor

-- ── Saved Experiences ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_experiences (
  id         TEXT        PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  experience JSONB       NOT NULL,
  booked     BOOLEAN     NOT NULL DEFAULT false,
  notes      TEXT,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE saved_experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their saved experiences"
  ON saved_experiences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS saved_experiences_user_id_idx ON saved_experiences(user_id);

-- ── Boarding Passes ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS boarding_passes (
  id                TEXT             PRIMARY KEY,
  user_id           UUID             NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  airline           TEXT             NOT NULL,
  flight_number     TEXT             NOT NULL,
  origin            TEXT             NOT NULL DEFAULT '',
  origin_code       TEXT             NOT NULL,
  destination       TEXT             NOT NULL DEFAULT '',
  destination_code  TEXT             NOT NULL,
  departure_date    TEXT             NOT NULL,
  departure_time    TEXT             NOT NULL,
  arrival_time      TEXT             NOT NULL,
  seat              TEXT             NOT NULL,
  gate              TEXT,
  terminal          TEXT,
  booking_ref       TEXT             NOT NULL,
  passenger_name    TEXT             NOT NULL,
  class             TEXT             NOT NULL DEFAULT 'economy',
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

ALTER TABLE boarding_passes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their boarding passes"
  ON boarding_passes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS boarding_passes_user_id_idx ON boarding_passes(user_id);
