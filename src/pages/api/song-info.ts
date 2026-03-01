import type { APIRoute } from 'astro';
import { parseSongUrl, fetchMetadataForUrl } from '../../lib/song-parser';
import { jsonOk, jsonError } from '../../lib/api-response';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const kv = locals.runtime.env.KV;
    const url = new URL(request.url);
    const songUrl = url.searchParams.get('url');

    if (!songUrl) {
      return jsonError('Query parameter "url" is required');
    }

    if (!parseSongUrl(songUrl)) {
      return jsonError('Invalid song URL. Spotify, YouTube, and Apple Music links are supported.');
    }

    const metadata = await fetchMetadataForUrl(songUrl, kv);

    if (!metadata) {
      return jsonError('Could not fetch song metadata. Please check the URL.');
    }

    return jsonOk(metadata);
  } catch {
    return jsonError('Internal server error', 500);
  }
};
