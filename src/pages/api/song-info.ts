import type { APIRoute } from 'astro';
import { parseSongUrl, fetchSpotifyMetadata, fetchYouTubeMetadata, fetchAppleMusicMetadata } from '../../lib/song-parser';

export const prerender = false;

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const kv = locals.runtime.env.KV;
    const url = new URL(request.url);
    const songUrl = url.searchParams.get('url');

    if (!songUrl) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Query parameter "url" is required' }),
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const parsed = parseSongUrl(songUrl);
    if (!parsed) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Invalid song URL. Spotify, YouTube, and Apple Music links are supported.',
        }),
        { status: 400, headers: CORS_HEADERS },
      );
    }

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
        { status: 400, headers: CORS_HEADERS },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, data: metadata }),
      { status: 200, headers: CORS_HEADERS },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: CORS_HEADERS },
    );
  }
};
