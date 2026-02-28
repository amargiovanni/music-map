// ── Pin (database record + API response) ──────────────────────────
export interface Pin {
  id: number;
  slug: string;
  latitude: number;
  longitude: number;
  song_title: string;
  artist_name: string;
  song_url: string;
  song_source: 'spotify' | 'youtube';
  thumbnail_url: string;
  embed_url: string | null;
  memory_text: string | null;
  display_name: string;
  city: string | null;
  country: string | null;
  created_at: string;
  locale: 'it' | 'en';
}

// ── Pin creation payload ──────────────────────────────────────────
export interface CreatePinPayload {
  latitude: number;
  longitude: number;
  song_url: string;
  memory_text?: string;
  display_name?: string;
  locale?: 'it' | 'en';
}

// ── Song metadata (returned by /api/song-info) ───────────────────
export interface SongInfo {
  title: string;
  artist: string;
  thumbnail_url: string;
  embed_url: string;
  source: 'spotify' | 'youtube';
}

// ── Map viewport bounds ──────────────────────────────────────────
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ── Cluster (client-side grouping) ───────────────────────────────
export interface PinCluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  pins: Pin[];
}

// ── API response wrappers ────────────────────────────────────────
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedPins {
  pins: Pin[];
  total: number;
  hasMore: boolean;
}

// ── Theme ────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark';

// ── Language ─────────────────────────────────────────────────────
export type Language = 'it' | 'en';

// ── Geolocation ──────────────────────────────────────────────────
export interface GeoPosition {
  latitude: number;
  longitude: number;
}
