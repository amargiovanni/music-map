// ── Map defaults ──────────────────────────────────────────────────
export const MAP_DEFAULT_CENTER: [number, number] = [12.4964, 41.9028]; // Roma
export const MAP_DEFAULT_ZOOM = 5;
export const MAP_MIN_ZOOM = 2;
export const MAP_MAX_ZOOM = 18;
export const MAP_FLY_DURATION = 2500; // ms

// ── Map tile styles ──────────────────────────────────────────────
export const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
export const MAP_STYLE_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// ── Clustering ───────────────────────────────────────────────────
export const CLUSTER_RADIUS = 60;
export const CLUSTER_MAX_ZOOM = 14;

// ── API ──────────────────────────────────────────────────────────
export const API_BASE = '/api';
export const DEBOUNCE_MS = 400;
export const MAX_MEMORY_LENGTH = 280;

// ── Rate limits ──────────────────────────────────────────────────
export const RATE_LIMIT_PINS_PER_HOUR = 10;

// ── Song sources ─────────────────────────────────────────────────
export const SPOTIFY_URL_REGEX = /(?:open\.spotify\.com\/track\/|spotify:track:)([a-zA-Z0-9]+)/;
export const YOUTUBE_URL_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
export const APPLE_MUSIC_URL_REGEX = /music\.apple\.com\/([a-z]{2})\/(?:album\/[^/?]+\/\d+\?i=(\d+)|song\/[^/?]+\/(\d+))/;

// ── Local storage keys ───────────────────────────────────────────
export const LS_THEME_KEY = 'music-map-theme';
export const LS_LANG_KEY = 'music-map-lang';

// ── Pin colors (by recency) ─────────────────────────────────────
export const PIN_COLOR_NEW = '#f0760b';    // brand-500
export const PIN_COLOR_RECENT = '#f39332'; // brand-400
export const PIN_COLOR_OLD = '#fad6a5';    // brand-200
export const PIN_COLOR_SELECTED = '#ff3053'; // accent-500
