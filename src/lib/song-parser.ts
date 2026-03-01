import { SPOTIFY_URL_REGEX, YOUTUBE_URL_REGEX, APPLE_MUSIC_URL_REGEX } from './constants';
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

// ── Fetch Spotify metadata via oEmbed (no API key needed) ──────────
export async function fetchSpotifyMetadata(
  trackId: string,
  kv: KVNamespace,
): Promise<SongInfo | null> {
  const cacheKey = `song:spotify:${trackId}`;

  // Check KV cache first
  try {
    const cached = await kv.get(cacheKey, 'json');
    if (cached) return cached as SongInfo;
  } catch {
    // Cache miss or error — continue to fetch
  }

  try {
    const trackUrl = `https://open.spotify.com/track/${trackId}`;
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}`;

    const response = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'MusicMap/1.0' },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      title?: string;
      thumbnail_url?: string;
    };

    const title = data.title ?? 'Unknown Title';
    let artist = 'Unknown Artist';

    // oEmbed doesn't include artist — fetch the track page OG tags
    try {
      const pageRes = await fetch(trackUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MusicMap/1.0)' },
        redirect: 'follow',
      });
      if (pageRes.ok) {
        const html = await pageRes.text();
        // og:description format: "Artist · Album · Song · Year"
        const match = html.match(/og:description[^>]*content="([^"]+)"/);
        if (match) {
          const firstPart = match[1].split('\u00B7')[0]?.trim(); // split on ·
          if (firstPart) artist = firstPart;
        }
      }
    } catch {
      // Non-critical: continue with "Unknown Artist"
    }

    const songInfo: SongInfo = {
      title,
      artist,
      thumbnail_url: data.thumbnail_url ?? '',
      embed_url: `https://open.spotify.com/embed/track/${trackId}`,
      source: 'spotify',
    };

    // Cache in KV with 24h TTL
    try {
      await kv.put(cacheKey, JSON.stringify(songInfo), {
        expirationTtl: 86400,
      });
    } catch {
      // Non-critical: caching failure shouldn't break the flow
    }

    return songInfo;
  } catch {
    return null;
  }
}

// ── Fetch YouTube metadata via noembed.com ─────────────────────────
export async function fetchYouTubeMetadata(
  videoId: string,
  kv: KVNamespace,
): Promise<SongInfo | null> {
  const cacheKey = `song:youtube:${videoId}`;

  // Check KV cache first
  try {
    const cached = await kv.get(cacheKey, 'json');
    if (cached) return cached as SongInfo;
  } catch {
    // Cache miss or error — continue to fetch
  }

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

    const response = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'MusicMap/1.0' },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };

    // YouTube titles often include artist info, but author_name is the channel
    const title = data.title ?? 'Unknown Title';
    const artist = data.author_name ?? 'Unknown Artist';
    const thumbnail =
      data.thumbnail_url ?? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const songInfo: SongInfo = {
      title,
      artist,
      thumbnail_url: thumbnail,
      embed_url: `https://www.youtube.com/embed/${videoId}`,
      source: 'youtube',
    };

    // Cache in KV with 24h TTL
    try {
      await kv.put(cacheKey, JSON.stringify(songInfo), {
        expirationTtl: 86400,
      });
    } catch {
      // Non-critical: caching failure shouldn't break the flow
    }

    return songInfo;
  } catch {
    return null;
  }
}

// ── Fetch Apple Music metadata via iTunes Lookup API (no API key) ──
export async function fetchAppleMusicMetadata(
  trackId: string,
  kv: KVNamespace,
  storefront = 'us',
): Promise<SongInfo | null> {
  const cacheKey = `song:apple_music:${trackId}`;

  // Check KV cache first
  try {
    const cached = await kv.get(cacheKey, 'json');
    if (cached) return cached as SongInfo;
  } catch {
    // Cache miss or error — continue to fetch
  }

  // Try iTunes Lookup API first, then fallback to OG tag scraping
  const songInfo = await fetchAppleMusicViaLookup(trackId, storefront)
    ?? await fetchAppleMusicViaOgTags(trackId, storefront);

  if (!songInfo) return null;

  // Cache in KV with 24h TTL
  try {
    await kv.put(cacheKey, JSON.stringify(songInfo), {
      expirationTtl: 86400,
    });
  } catch {
    // Non-critical
  }

  return songInfo;
}

async function fetchAppleMusicViaLookup(
  trackId: string,
  storefront: string,
): Promise<SongInfo | null> {
  try {
    const lookupUrl = `https://itunes.apple.com/lookup?id=${trackId}&entity=song&country=${storefront}`;

    const response = await fetch(lookupUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MusicMap/1.0)' },
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
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MusicMap/1.0)' },
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
