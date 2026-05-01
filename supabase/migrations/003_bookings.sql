-- Migration 003: Bookings
-- Run in: Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS bookings (
  id          TEXT        PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  experience  JSONB       NOT NULL,
  date        TEXT        NOT NULL,
  adults      INT         NOT NULL DEFAULT 1,
  children    INT         NOT NULL DEFAULT 0,
  total_price NUMERIC     NOT NULL,
  currency    TEXT        NOT NULL DEFAULT 'USD',
  status      TEXT        NOT NULL DEFAULT 'confirmed',
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their bookings"
  ON bookings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_date_idx    ON bookings(date);
