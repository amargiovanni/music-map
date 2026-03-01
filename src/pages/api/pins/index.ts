import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import { getPinsByBounds, getPinsNearby, createPin } from '../../../lib/db';
import { parseSongUrl, fetchSpotifyMetadata, fetchYouTubeMetadata, fetchAppleMusicMetadata } from '../../../lib/song-parser';
import { reverseGeocode } from '../../../lib/geocode';
import { checkRateLimit } from '../../../lib/rate-limit';
import { containsProfanity } from '../../../lib/profanity';
import { MAX_MEMORY_LENGTH } from '../../../lib/constants';
import type { CreatePinPayload } from '../../../types/index';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' };

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
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid bounds format. Expected: south,west,north,east' }),
          { status: 400, headers: JSON_HEADERS },
        );
      }

      const [south, west, north, east] = parts;
      const pins = await getPinsByBounds(db, south, west, north, east);
      return new Response(
        JSON.stringify({ ok: true, data: pins }),
        { status: 200, headers: JSON_HEADERS },
      );
    }

    // Nearby query: ?near=lat,lng&radius=5km
    const nearParam = url.searchParams.get('near');
    if (nearParam) {
      const parts = nearParam.split(',').map(Number);
      if (parts.length !== 2 || parts.some(isNaN)) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid near format. Expected: lat,lng' }),
          { status: 400, headers: JSON_HEADERS },
        );
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
      return new Response(
        JSON.stringify({ ok: true, data: pins }),
        { status: 200, headers: JSON_HEADERS },
      );
    }

    // No valid query params
    return new Response(
      JSON.stringify({ ok: false, error: 'Provide either bounds or near query parameter' }),
      { status: 400, headers: JSON_HEADERS },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: JSON_HEADERS },
    );
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
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid JSON body' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    // Validate required fields
    const { latitude, longitude, song_url, memory_text, display_name, locale } = body;

    if (latitude == null || longitude == null) {
      return new Response(
        JSON.stringify({ ok: false, error: 'latitude and longitude are required' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return new Response(
        JSON.stringify({ ok: false, error: 'latitude and longitude must be numbers' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return new Response(
        JSON.stringify({ ok: false, error: 'latitude must be between -90 and 90, longitude between -180 and 180' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    if (!song_url || typeof song_url !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'song_url is required' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    // Validate memory_text length
    if (memory_text && memory_text.length > MAX_MEMORY_LENGTH) {
      return new Response(
        JSON.stringify({ ok: false, error: `memory_text must be ${MAX_MEMORY_LENGTH} characters or less` }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    // Rate limit check
    const ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';

    const rateLimit = await checkRateLimit(kv, ip);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Rate limit exceeded. Try again later.' }),
        { status: 429, headers: JSON_HEADERS },
      );
    }

    // Parse song URL
    const parsed = parseSongUrl(song_url);
    if (!parsed) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid song URL. Spotify, YouTube, and Apple Music links are supported.' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    // Fetch song metadata
    let metadata;
    if (parsed.source === 'spotify') {
      metadata = await fetchSpotifyMetadata(parsed.id, kv);
    } else if (parsed.source === 'youtube') {
      metadata = await fetchYouTubeMetadata(parsed.id, kv);
    } else {
      metadata = await fetchAppleMusicMetadata(parsed.id, kv, parsed.storefront);
    }

    if (!metadata) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Could not fetch song metadata. Please check the URL.' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    // Profanity check on memory_text and display_name
    if (memory_text && containsProfanity(memory_text)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'memory_text contains inappropriate language' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    const finalDisplayName = display_name?.trim().slice(0, 50) || 'Anonymous';
    if (containsProfanity(finalDisplayName)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'display_name contains inappropriate language' }),
        { status: 400, headers: JSON_HEADERS },
      );
    }

    // Reverse geocode location
    const geo = await reverseGeocode(latitude, longitude, kv);

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

    return new Response(
      JSON.stringify({ ok: true, data: pin }),
      { status: 201, headers: JSON_HEADERS },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
};
