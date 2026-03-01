import { API_BASE } from './constants';
import type { Pin, SongInfo, ApiResponse, PaginatedPins, MapBounds } from '../types';

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json.error || 'Request failed' };
    return { ok: true, data: json.data ?? json };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

export async function fetchPinsByBounds(bounds: MapBounds): Promise<ApiResponse<Pin[]>> {
  const { south, west, north, east } = bounds;
  return request<Pin[]>(`/pins?bounds=${south},${west},${north},${east}`);
}

export async function fetchPinsNearby(lat: number, lng: number, radius = 5): Promise<ApiResponse<Pin[]>> {
  return request<Pin[]>(`/pins?near=${lat},${lng}&radius=${radius}km`);
}

export async function fetchPin(slug: string): Promise<ApiResponse<Pin>> {
  return request<Pin>(`/pins/${slug}`);
}

export async function searchPins(query: string): Promise<ApiResponse<Pin[]>> {
  return request<Pin[]>(`/pins/search?q=${encodeURIComponent(query)}`);
}

export async function fetchRandomPin(): Promise<ApiResponse<Pin>> {
  return request<Pin>('/pins/random');
}

export async function fetchTrendingPins(): Promise<ApiResponse<PaginatedPins>> {
  return request<PaginatedPins>('/pins/trending');
}

export async function createPin(payload: {
  latitude: number;
  longitude: number;
  song_url: string;
  memory_text?: string;
  display_name?: string;
  locale?: string;
}): Promise<ApiResponse<Pin>> {
  return request<Pin>('/pins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
}

export async function fetchSongInfo(url: string): Promise<ApiResponse<SongInfo>> {
  return request<SongInfo>(`/song-info?url=${encodeURIComponent(url)}`);
}

export async function fetchMyPins(): Promise<ApiResponse<Pin[]>> {
  return request<Pin[]>('/pins/mine', { credentials: 'include' });
}

