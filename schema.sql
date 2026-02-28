-- Music Map — D1 Database Schema
-- Run with: wrangler d1 execute music-map-db --local --file=schema.sql

-- ── Pins table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pins (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  latitude    REAL    NOT NULL,
  longitude   REAL    NOT NULL,
  song_title  TEXT    NOT NULL,
  artist_name TEXT    NOT NULL,
  song_url    TEXT    NOT NULL,
  song_source TEXT    NOT NULL CHECK (song_source IN ('spotify', 'youtube', 'apple_music')),
  thumbnail_url TEXT  NOT NULL,
  embed_url   TEXT,
  memory_text TEXT,
  display_name TEXT   NOT NULL DEFAULT 'Anonymous',
  city        TEXT,
  country     TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  locale      TEXT    NOT NULL DEFAULT 'en' CHECK (locale IN ('it', 'en'))
);

-- ── Indexes ─────────────────────────────────────────────────────────

-- Bounding box queries on latitude/longitude
CREATE INDEX IF NOT EXISTS idx_pins_lat_lng ON pins (latitude, longitude);

-- Unique slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_pins_slug ON pins (slug);

-- Recency / trending queries
CREATE INDEX IF NOT EXISTS idx_pins_created_at ON pins (created_at DESC);

-- ── Full-text search ────────────────────────────────────────────────

CREATE VIRTUAL TABLE IF NOT EXISTS pins_fts USING fts5(
  song_title,
  artist_name,
  city,
  content='pins',
  content_rowid='id'
);

-- Triggers to keep FTS index in sync with the pins table

CREATE TRIGGER IF NOT EXISTS pins_ai AFTER INSERT ON pins BEGIN
  INSERT INTO pins_fts (rowid, song_title, artist_name, city)
  VALUES (new.id, new.song_title, new.artist_name, new.city);
END;

CREATE TRIGGER IF NOT EXISTS pins_ad AFTER DELETE ON pins BEGIN
  INSERT INTO pins_fts (pins_fts, rowid, song_title, artist_name, city)
  VALUES ('delete', old.id, old.song_title, old.artist_name, old.city);
END;

CREATE TRIGGER IF NOT EXISTS pins_au AFTER UPDATE ON pins BEGIN
  INSERT INTO pins_fts (pins_fts, rowid, song_title, artist_name, city)
  VALUES ('delete', old.id, old.song_title, old.artist_name, old.city);
  INSERT INTO pins_fts (rowid, song_title, artist_name, city)
  VALUES (new.id, new.song_title, new.artist_name, new.city);
END;
