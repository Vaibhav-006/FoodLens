-- FoodLens PostgreSQL Schema
-- Run via: psql $DATABASE_URL -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode         TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  brand           TEXT,
  image_url       TEXT,
  serving_size_g  NUMERIC,
  nutrition       JSONB NOT NULL DEFAULT '{}',
  ingredients_raw TEXT,
  ingredients     JSONB NOT NULL DEFAULT '[]',
  source          TEXT NOT NULL DEFAULT 'openfoodfacts',
  nutriscore      CHAR(1),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);

-- ─── Ingredient Knowledge Base ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ingredients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT UNIQUE NOT NULL,
  aliases         TEXT[] NOT NULL DEFAULT '{}',
  e_number        TEXT,
  category        TEXT NOT NULL DEFAULT 'unknown',
  purpose         TEXT,
  what_is_it      TEXT,
  why_used        TEXT,
  benefits        TEXT[] NOT NULL DEFAULT '{}',
  concerns        TEXT[] NOT NULL DEFAULT '{}',
  evidence_grade  CHAR(1) NOT NULL DEFAULT 'C',
  risk_level      TEXT NOT NULL DEFAULT 'unknown',
  fssai_status    TEXT,
  fda_status      TEXT,
  efsa_status     TEXT,
  adi_mg_per_kg   NUMERIC,
  "references"    TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingredients_name   ON ingredients(name);
CREATE INDEX IF NOT EXISTS idx_ingredients_enumber ON ingredients(e_number);
CREATE INDEX IF NOT EXISTS idx_ingredients_aliases ON ingredients USING GIN(aliases);

-- ─── Scan History (for logged-in users) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS scan_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT NOT NULL,            -- Clerk user ID / Supabase auth.uid
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  scanned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scan_history_user ON scan_history(user_id, scanned_at DESC);

-- ─── AI Chat Sessions ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     TEXT,
  product_ids UUID[] NOT NULL DEFAULT '{}',
  messages    JSONB NOT NULL DEFAULT '[]',
  language    TEXT NOT NULL DEFAULT 'en',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

