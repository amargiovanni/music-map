import { SPOTIFY_URL_REGEX, YOUTUBE_URL_REGEX, APPLE_MUSIC_URL_REGEX, CACHE_TTL_SONG, USER_AGENT, USER_AGENT_BROWSER } from './constants';
import { withKvCache } from './kv-cache';
import type { SongInfo } from '../types/index';

type KVNamespace = import('@cloudflare/workers-types').KVNamespace;

// ── Parse a song URL into source + ID ──────────────────────────────
export function parseSongUrl(
  url: string,
): { id: string; source: 'spotify' | 'youtube' | 'apple_music'; storefront?: string } | null {
  const spotifyMatch = url.match(SPOTIFY_URL_REGEX);
  if (spotifyMatch) {
    return { id: spotifyMatch[1], source: 'spotify' };
  }

  const youtubeMatch = url.match(YOUTUBE_URL_REGEX);
  if (youtubeMatch) {
    return { id: youtubeMatch[1], source: 'youtube' };
  }

  const appleMatch = url.match(APPLE_MUSIC_URL_REGEX);
  if (appleMatch) {
    const storefront = appleMatch[1];
    const trackId = appleMatch[2] || appleMatch[3];
    if (trackId) {
      return { id: trackId, source: 'apple_music', storefront };
    }
  }

  return null;
}

// ── Fetch metadata for any supported song URL ───────────────────────
export async function fetchMetadataForUrl(
  url: string,
  kv: KVNamespace,
): Promise<SongInfo | null> {
  const parsed = parseSongUrl(url);
  if (!parsed) return null;

  if (parsed.source === 'spotify') {
    return fetchSpotifyMetadata(parsed.id, kv);
  } else if (parsed.source === 'youtube') {
    return fetchYouTubeMetadata(parsed.id, kv);
  } else {
    return fetchAppleMusicMetadata(parsed.id, kv, parsed.storefront);
  }
}

// ── Fetch Spotify metadata via oEmbed (no API key needed) ──────────
export async function fetchSpotifyMetadata(
  trackId: string,
  kv: KVNamespace,
): Promise<SongInfo | null> {
  return withKvCache<SongInfo>(kv, `song:spotify:${trackId}`, CACHE_TTL_SONG, async () => {
    const trackUrl = `https://open.spotify.com/track/${trackId}`;
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}`;

    // Fetch oEmbed data and page HTML in parallel
    const [oembedRes, pageRes] = await Promise.all([
      fetch(oembedUrl, { headers: { 'User-Agent': USER_AGENT } }),
      fetch(trackUrl, { headers: { 'User-Agent': USER_AGENT_BROWSER }, redirect: 'follow' })
        .catch(() => null),
    ]);

    if (!oembedRes.ok) return null;

    const data = (await oembedRes.json()) as {
      title?: string;
      thumbnail_url?: string;
    };

    const title = data.title ?? 'Unknown Title';
    let artist = 'Unknown Artist';

    // oEmbed doesn't include artist — parse the page OG tags
    if (pageRes?.ok) {
      try {
        const html = await pageRes.text();
        // og:description format: "Artist · Album · Song · Year"
        const match = html.match(/og:description[^>]*content="([^"]+)"/);
        if (match) {
          const firstPart = match[1].split('\u00B7')[0]?.trim(); // split on ·
          if (firstPart) artist = firstPart;
        }
      } catch {
        // Non-critical: continue with "Unknown Artist"
      }
    }

    return {
      title,
      artist,
      thumbnail_url: data.thumbnail_url ?? '',
      embed_url: `https://open.spotify.com/embed/track/${trackId}`,
      source: 'spotify',
    };
  });
}

// ── Fetch YouTube metadata via oEmbed ───────────────────────────────
export async function fetchYouTubeMetadata(
  videoId: string,
  kv: KVNamespace,
): Promise<SongInfo | null> {
  return withKvCache<SongInfo>(kv, `song:youtube:${videoId}`, CACHE_TTL_SONG, async () => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

    const response = await fetch(oembedUrl, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };

    const title = data.title ?? 'Unknown Title';
    const artist = data.author_name ?? 'Unknown Artist';
    const thumbnail =
      data.thumbnail_url ?? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      title,
      artist,
      thumbnail_url: thumbnail,
      embed_url: `https://www.youtube.com/embed/${videoId}`,
      source: 'youtube',
    };
  });
}

// ── Fetch Apple Music metadata via iTunes Lookup API (no API key) ──
export async function fetchAppleMusicMetadata(
  trackId: string,
  kv: KVNamespace,
  storefront = 'us',
): Promise<SongInfo | null> {
  return withKvCache<SongInfo>(kv, `song:apple_music:${trackId}`, CACHE_TTL_SONG, async () => {
    // Try iTunes Lookup API first, then fallback to OG tag scraping
    return await fetchAppleMusicViaLookup(trackId, storefront)
      ?? await fetchAppleMusicViaOgTags(trackId, storefront);
  });
}

async function fetchAppleMusicViaLookup(
  trackId: string,
  storefront: string,
): Promise<SongInfo | null> {
  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${trackId}&entity=song&country=${storefront}`;

    const response = await fetch(lookupUrl, {
      headers: { 'User-Agent': USER_AGENT_BROWSER },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      resultCount?: number;
      results?: Array<{
        trackName?: string;
        artistName?: string;
        artworkUrl100?: string;
        collectionId?: number;
        trackId?: number;
      }>;
    };

    if (!data.resultCount || !data.results?.length) return null;

    const track = data.results[0];
    const title = track.trackName ?? 'Unknown Title';
    const artist = track.artistName ?? 'Unknown Artist';

    const thumbnail = track.artworkUrl100
      ? track.artworkUrl100.replace('100x100', '600x600')
      : '';

    const albumId = track.collectionId;
    const embedUrl = albumId
      ? `https://embed.music.apple.com/${storefront}/album/${albumId}?i=${trackId}`
      : '';

    return { title, artist, thumbnail_url: thumbnail, embed_url: embedUrl, source: 'apple_music' };
  } catch {
    return null;
  }
}

async function fetchAppleMusicViaOgTags(
  trackId: string,
  storefront: string,
): Promise<SongInfo | null> {
  try {
    const pageUrl = `https://music.apple.com/${storefront}/song/${trackId}`;
    const response = await fetch(pageUrl, {
      headers: { 'User-Agent': USER_AGENT_BROWSER },
      redirect: 'follow',
    });

    if (!response.ok) return null;

    const html = await response.text();

    const titleMatch = html.match(/og:title[^>]*content="([^"]+)"/);
    const descMatch = html.match(/og:description[^>]*content="([^"]+)"/);
    const imageMatch = html.match(/og:image[^>]*content="([^"]+)"/);

    const title = titleMatch?.[1] ?? 'Unknown Title';
    // og:description often starts with the artist name
    const artist = descMatch?.[1]?.split(/[·\-—]/)?.[0]?.trim() ?? 'Unknown Artist';
    const thumbnail = imageMatch?.[1]?.replace(/\d+x\d+/, '600x600') ?? '';

    const embedUrl = `https://embed.music.apple.com/${storefront}/song/${trackId}`;

    return { title, artist, thumbnail_url: thumbnail, embed_url: embedUrl, source: 'apple_music' };
  } catch {
    return null;
  }
}
