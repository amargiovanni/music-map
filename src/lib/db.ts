import type { Pin } from '../types/index';

type D1Database = import('@cloudflare/workers-types').D1Database;

// ── Helper: map a D1 row to a Pin ──────────────────────────────────
function rowToPin(row: Record<string, unknown>): Pin {
  return {
    id: row.id as number,
    slug: row.slug as string,
    latitude: row.latitude as number,
    longitude: row.longitude as number,
    song_title: row.song_title as string,
    artist_name: row.artist_name as string,
    song_url: row.song_url as string,
    song_source: row.song_source as Pin['song_source'],
    thumbnail_url: row.thumbnail_url as string,
    embed_url: (row.embed_url as string) ?? null,
    memory_text: (row.memory_text as string) ?? null,
    display_name: row.display_name as string,
    city: (row.city as string) ?? null,
    country: (row.country as string) ?? null,
    created_at: row.created_at as string,
    locale: row.locale as Pin['locale'],
    user_id: (row.user_id as string) ?? null,
  };
}

// ── Bounding box query ─────────────────────────────────────────────
export async function getPinsByBounds(
  db: D1Database,
  south: number,
  west: number,
  north: number,
  east: number,
): Promise<Pin[]> {
  const stmt = db
    .prepare(
      `SELECT * FROM pins
       WHERE latitude BETWEEN ?1 AND ?2
         AND longitude BETWEEN ?3 AND ?4
       ORDER BY created_at DESC
       LIMIT 200`,
    )
    .bind(south, north, west, east);

  const { results } = await stmt.all();
  return (results ?? []).map(rowToPin);
}

// ── Nearby query (approximate degree conversion) ───────────────────
export async function getPinsNearby(
  db: D1Database,
  lat: number,
  lng: number,
  radiusKm: number = 5,
): Promise<Pin[]> {
  // 1 degree of latitude ~ 111 km
  const latDelta = radiusKm / 111;
  // 1 degree of longitude varies by latitude
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  const south = lat - latDelta;
  const north = lat + latDelta;
  const west = lng - lngDelta;
  const east = lng + lngDelta;

  const stmt = db
    .prepare(
      `SELECT * FROM pins
       WHERE latitude BETWEEN ?1 AND ?2
         AND longitude BETWEEN ?3 AND ?4
       ORDER BY created_at DESC
       LIMIT 200`,
    )
    .bind(south, north, west, east);

  const { results } = await stmt.all();
  return (results ?? []).map(rowToPin);
}

// ── Single pin by slug ─────────────────────────────────────────────
export async function getPinBySlug(
  db: D1Database,
  slug: string,
): Promise<Pin | null> {
  const stmt = db.prepare('SELECT * FROM pins WHERE slug = ?1').bind(slug);
  const row = await stmt.first();
  return row ? rowToPin(row as Record<string, unknown>) : null;
}

// ── Search pins (LIKE-based fallback) ──────────────────────────────
export async function searchPins(
  db: D1Database,
  query: string,
): Promise<Pin[]> {
  const pattern = `%${query}%`;
  const stmt = db
    .prepare(
      `SELECT * FROM pins
       WHERE song_title LIKE ?1
          OR artist_name LIKE ?1
          OR city LIKE ?1
       ORDER BY created_at DESC
       LIMIT 50`,
    )
    .bind(pattern);

  const { results } = await stmt.all();
  return (results ?? []).map(rowToPin);
}

// ── Random pin ─────────────────────────────────────────────────────
export async function getRandomPin(db: D1Database): Promise<Pin | null> {
  const stmt = db.prepare(
    'SELECT * FROM pins ORDER BY RANDOM() LIMIT 1',
  );
  const row = await stmt.first();
  return row ? rowToPin(row as Record<string, unknown>) : null;
}

// ── Trending (most recent) pins ────────────────────────────────────
export async function getTrendingPins(
  db: D1Database,
  limit: number = 20,
): Promise<Pin[]> {
  const stmt = db
    .prepare('SELECT * FROM pins ORDER BY created_at DESC LIMIT ?1')
    .bind(limit);

  const { results } = await stmt.all();
  return (results ?? []).map(rowToPin);
}

// ── Create pin ─────────────────────────────────────────────────────
export interface CreatePinData {
  slug: string;
  latitude: number;
  longitude: number;
  song_title: string;
  artist_name: string;
  song_url: string;
  song_source: 'spotify' | 'youtube' | 'apple_music';
  thumbnail_url: string;
  embed_url: string | null;
  memory_text: string | null;
  display_name: string;
  city: string | null;
  country: string | null;
  locale: 'it' | 'en';
  user_id?: string | null;
}

export async function createPin(
  db: D1Database,
  data: CreatePinData,
): Promise<Pin> {
  const stmt = db
    .prepare(
      `INSERT INTO pins
         (slug, latitude, longitude, song_title, artist_name, song_url,
          song_source, thumbnail_url, embed_url, memory_text, display_name,
          city, country, locale, user_id)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
       RETURNING *`,
    )
    .bind(
      data.slug,
      data.latitude,
      data.longitude,
      data.song_title,
      data.artist_name,
      data.song_url,
      data.song_source,
      data.thumbnail_url,
      data.embed_url,
      data.memory_text,
      data.display_name,
      data.city,
      data.country,
      data.locale,
      data.user_id ?? null,
    );

  const row = await stmt.first();
  if (!row) {
    throw new Error('Failed to create pin');
  }
  return rowToPin(row as Record<string, unknown>);
}

// ── Get pins by user ID ────────────────────────────────────────────
export async function getPinsByUserId(
  db: D1Database,
  userId: string,
): Promise<Pin[]> {
  const stmt = db
    .prepare('SELECT * FROM pins WHERE user_id = ?1 ORDER BY created_at DESC LIMIT 500')
    .bind(userId);

  const { results } = await stmt.all();
  return (results ?? []).map(rowToPin);
}

// ── Count all pins ─────────────────────────────────────────────────
export async function countPins(db: D1Database): Promise<number> {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM pins');
  const row = await stmt.first<{ count: number }>();
  return row?.count ?? 0;
}
