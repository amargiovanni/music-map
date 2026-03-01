-- Music Map — Schema Migration v2: Authentication
-- Run with: wrangler d1 execute music-map-db --local --file=schema-v2.sql

-- ── Users table (zero PII — only random IDs and hashed auth subjects) ──
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  auth_hash   TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_auth_hash ON users (auth_hash);

-- ── Add user_id to pins (nullable — existing pins stay anonymous) ──
ALTER TABLE pins ADD COLUMN user_id TEXT REFERENCES users(id);

CREATE INDEX IF NOT EXISTS idx_pins_user_id ON pins (user_id);
