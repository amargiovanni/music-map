import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { getPinsByBounds, getPinsNearby, createPin } from '../../../lib/db';
import { parseSongUrl, fetchMetadataForUrl } from '../../../lib/song-parser';
import { reverseGeocode } from '../../../lib/geocode';
import { checkRateLimit } from '../../../lib/rate-limit';
import { containsProfanity } from '../../../lib/profanity';
import { MAX_MEMORY_LENGTH } from '../../../lib/constants';
import { jsonOk, jsonError } from '../../../lib/api-response';
import type { CreatePinPayload } from '../../../types/index';

export const prerender = false;

// ── GET: list pins by bounds or nearby ─────────────────────────────
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const url = new URL(request.url);

    // Bounding box query: ?bounds=south,west,north,east
    const boundsParam = url.searchParams.get('bounds');
    if (boundsParam) {
      const parts = boundsParam.split(',').map(Number);
      if (parts.length !== 4 || parts.some(isNaN)) {
        return jsonError('Invalid bounds format. Expected: south,west,north,east');
      }

      const [south, west, north, east] = parts;
      const pins = await getPinsByBounds(db, south, west, north, east);
      return jsonOk(pins);
    }

    // Nearby query: ?near=lat,lng&radius=5km
    const nearParam = url.searchParams.get('near');
    if (nearParam) {
      const parts = nearParam.split(',').map(Number);
      if (parts.length !== 2 || parts.some(isNaN)) {
        return jsonError('Invalid near format. Expected: lat,lng');
      }

      const [lat, lng] = parts;
      let radiusKm = 5;
      const radiusParam = url.searchParams.get('radius');
      if (radiusParam) {
        const parsed = parseFloat(radiusParam.replace('km', ''));
        if (!isNaN(parsed) && parsed > 0) {
          radiusKm = parsed;
        }
      }

      const pins = await getPinsNearby(db, lat, lng, radiusKm);
      return jsonOk(pins);
    }

    // No valid query params
    return jsonError('Provide either bounds or near query parameter');
  } catch {
    return jsonError('Internal server error', 500);
  }
};

// ── POST: create a new pin ─────────────────────────────────────────
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = locals.runtime.env.DB;
    const kv = locals.runtime.env.KV;

    // Parse request body
    let body: CreatePinPayload;
    try {
      body = await request.json() as CreatePinPayload;
    } catch {
      return jsonError('Invalid JSON body');
    }

    // Validate required fields
    const { latitude, longitude, song_url, memory_text, display_name, locale } = body;

    if (latitude == null || longitude == null) {
      return jsonError('latitude and longitude are required');
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return jsonError('latitude and longitude must be numbers');
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return jsonError('latitude must be between -90 and 90, longitude between -180 and 180');
    }

    if (!song_url || typeof song_url !== 'string') {
      return jsonError('song_url is required');
    }

    // Validate memory_text length
    if (memory_text && memory_text.length > MAX_MEMORY_LENGTH) {
      return jsonError(`memory_text must be ${MAX_MEMORY_LENGTH} characters or less`);
    }

    // Rate limit check
    const ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';

    const rateLimit = await checkRateLimit(kv, ip);
    if (!rateLimit.allowed) {
      return jsonError('Rate limit exceeded. Try again later.', 429);
    }

    // Validate song URL format before expensive fetch
    const parsed = parseSongUrl(song_url);
    if (!parsed) {
      return jsonError('Invalid song URL. Spotify, YouTube, and Apple Music links are supported.');
    }

    // Fetch song metadata and reverse geocode in parallel
    const [metadata, geo] = await Promise.all([
      fetchMetadataForUrl(song_url, kv),
      reverseGeocode(latitude, longitude, kv),
    ]);

    if (!metadata) {
      return jsonError('Could not fetch song metadata. Please check the URL.');
    }

    // Profanity check on memory_text and display_name
    if (memory_text && containsProfanity(memory_text)) {
      return jsonError('memory_text contains inappropriate language');
    }

    const finalDisplayName = display_name?.trim().slice(0, 50) || 'Anonymous';
    if (containsProfanity(finalDisplayName)) {
      return jsonError('display_name contains inappropriate language');
    }

    // Generate slug
    const slug = nanoid(10);

    // Insert into database
    const userId = locals.userId ?? null;
    const pin = await createPin(db, {
      slug,
      latitude,
      longitude,
      song_title: metadata.title,
      artist_name: metadata.artist,
      song_url,
      song_source: parsed.source,
      thumbnail_url: metadata.thumbnail_url,
      embed_url: metadata.embed_url,
      memory_text: memory_text?.trim() || null,
      display_name: finalDisplayName,
      city: geo.city,
      country: geo.country,
      locale: locale === 'it' ? 'it' : 'en',
      user_id: userId,
    });

    return jsonOk(pin, 201);
  } catch {
    return jsonError('Internal server error', 500);
  }
};
