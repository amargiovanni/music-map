import React, { useState, useEffect, useCallback, useRef } from 'react';

import type { Pin, GeoPosition, MapBounds } from '../types';
import { API_BASE } from '../lib/constants';
import { createPin, fetchPin, searchPins, fetchRandomPin } from '../lib/api';

// ── Hooks ──────────────────────────────────────────────────────────
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../hooks/useAuth';
import { useMapPins } from './map/useMapPins';
import { useMapInteraction } from './map/useMapInteraction';

// ── Components ─────────────────────────────────────────────────────
import { MapView } from './map/MapView';
import { TopBar } from './TopBar';
import { SongCard } from './SongCard';
import { PinForm } from './PinForm';
import { FAB } from './FAB';
import { PinCounter } from './PinCounter';
import { EmptyState } from './EmptyState';
import { LandingOverlay } from './LandingOverlay';
import { LoginPrompt } from './LoginPrompt';
import { MyPinsPanel } from './MyPinsPanel';

// ── Props ──────────────────────────────────────────────────────────

interface MusicMapAppProps {
  /** When the user lands on /pin/[slug] the slug is forwarded here so
   *  we can fetch the pin and fly to it on mount. */
  initialPinSlug?: string;
  /** Server-side auth check passed from Astro page */
  isAuthenticated?: boolean;
}

// ── Component ──────────────────────────────────────────────────────

export function MusicMapApp({ initialPinSlug, isAuthenticated: serverAuth }: MusicMapAppProps) {
  // ── Theme & language ──────────────────────────────────────────
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  // ── Auth ────────────────────────────────────────────────────
  const { authenticated, login, logout } = useAuth(serverAuth);
  const [showLanding, setShowLanding] = useState(!serverAuth && !initialPinSlug);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showMyPins, setShowMyPins] = useState(false);

  // ── Map data ──────────────────────────────────────────────────
  const { pins, loading, totalCount, loadPinsForBounds } = useMapPins();
  const { flyToTarget, flyTo, clearFlyTarget } = useMapInteraction();

  // ── Geolocation ───────────────────────────────────────────────
  const { position: userPosition, requestPosition } = useGeolocation();

  // ── Selected pin ──────────────────────────────────────────────
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  // ── Pin creation flow ─────────────────────────────────────────
  const [isPinFormOpen, setIsPinFormOpen] = useState(false);
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [placedPosition, setPlacedPosition] = useState<GeoPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Search ────────────────────────────────────────────────────
  const [searchResults, setSearchResults] = useState<Pin[]>([]);

  // ── Global pin count ─────────────────────────────────────────
  const [globalCount, setGlobalCount] = useState(0);

  // ── Note animation ────────────────────────────────────────────
  const [noteAnimation, setNoteAnimation] = useState<GeoPosition | null>(null);

  // Track whether we need to auto-set placed position from geolocation
  const pendingLocationForPinRef = useRef(false);

  // Track whether we need to fly to user position for "near me"
  const pendingNearMeRef = useRef(false);

  // ── Initial pin load (from /pin/[slug]) ───────────────────────
  useEffect(() => {
    if (!initialPinSlug) return;

    let cancelled = false;

    (async () => {
      const result = await fetchPin(initialPinSlug);
      if (cancelled) return;

      if (result.ok && result.data) {
        const pin = result.data;
        setSelectedPin(pin);
        flyTo(pin.latitude, pin.longitude, 14);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch global pin count ────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/count`);
        const json = await res.json();
        if (json.data?.count) setGlobalCount(json.data.count);
      } catch { /* silent */ }
    })();
  }, []);

  // ── When geolocation resolves, apply it to any pending action ──
  useEffect(() => {
    if (!userPosition) return;

    // If we were waiting for location to place a pin
    if (pendingLocationForPinRef.current) {
      pendingLocationForPinRef.current = false;
      setPlacedPosition(userPosition);
    }

    // If we were waiting for location for "near me"
    if (pendingNearMeRef.current) {
      pendingNearMeRef.current = false;
      flyTo(userPosition.latitude, userPosition.longitude, 14);
    }
  }, [userPosition, flyTo]);

  // ── Map bounds change ─────────────────────────────────────────
  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      loadPinsForBounds(bounds);
    },
    [loadPinsForBounds],
  );

  // ── Pin selection ─────────────────────────────────────────────
  const handlePinSelect = useCallback(
    (pin: Pin | null) => {
      setSelectedPin(pin);
      // Close pin form when selecting a pin to avoid clutter
      if (pin) {
        setIsPinFormOpen(false);
        setIsPlacingPin(false);
      }
    },
    [],
  );

  // ── Map click (used during pin placement) ─────────────────────
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (!isPlacingPin) return;
      setPlacedPosition({ latitude: lat, longitude: lng });
      setIsPlacingPin(false);
      setIsPinFormOpen(true);
    },
    [isPlacingPin],
  );

  // ── FAB click — open/close the pin form ───────────────────────
  const handleFABClick = useCallback(() => {
    if (!authenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setIsPinFormOpen((prev) => {
      if (prev) {
        // Closing — reset placement state
        setIsPlacingPin(false);
        setPlacedPosition(null);
        return false;
      }
      // Opening — close the song card if one is open
      setSelectedPin(null);
      return true;
    });
  }, [authenticated]);

  // ── Pin form: "Use my location" ───────────────────────────────
  const handleRequestLocation = useCallback(() => {
    if (userPosition) {
      setPlacedPosition(userPosition);
    } else {
      pendingLocationForPinRef.current = true;
      requestPosition();
    }
  }, [userPosition, requestPosition]);

  // ── Pin form: "Choose on map" ─────────────────────────────────
  const handleRequestMapPick = useCallback(() => {
    setIsPlacingPin(true);
    // Temporarily hide the form so the user can see the map
    setIsPinFormOpen(false);
  }, []);

  // ── Pin form: submit ──────────────────────────────────────────
  const handlePinSubmit = useCallback(
    async (data: { song_url: string; memory_text?: string; display_name?: string }) => {
      if (!placedPosition) return;

      setIsSubmitting(true);

      const result = await createPin({
        latitude: placedPosition.latitude,
        longitude: placedPosition.longitude,
        song_url: data.song_url,
        memory_text: data.memory_text,
        display_name: data.display_name,
        locale: lang,
      });

      setIsSubmitting(false);

      if (result.ok && result.data) {
        const newPin = result.data;

        // Close the form and reset placement state
        setIsPinFormOpen(false);
        setPlacedPosition(null);
        setIsPlacingPin(false);

        // Bump the global counter
        setGlobalCount((c) => c + 1);

        // Trigger the note animation at the new pin position
        setNoteAnimation({
          latitude: newPin.latitude,
          longitude: newPin.longitude,
        });

        // Select the new pin so the user sees the SongCard
        setSelectedPin(newPin);

        // Reload pins for the current viewport (the hook debounces this)
        // We fly to the new pin to make sure it's visible
        flyTo(newPin.latitude, newPin.longitude, 14);
      } else {
        // Show a simple error — in a future iteration this could be
        // an inline toast or error banner instead of alert().
        alert(result.error ?? 'Something went wrong. Please try again.');
      }
    },
    [placedPosition, lang, flyTo],
  );

  // ── Pin form: cancel ──────────────────────────────────────────
  const handlePinCancel = useCallback(() => {
    setIsPinFormOpen(false);
    setPlacedPosition(null);
    setIsPlacingPin(false);
  }, []);

  // ── Search ────────────────────────────────────────────────────
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const result = await searchPins(query);
    if (result.ok && result.data) {
      setSearchResults(result.data);
    } else {
      setSearchResults([]);
    }
  }, []);

  const handleSearchSelect = useCallback(
    (pin: Pin) => {
      flyTo(pin.latitude, pin.longitude, 14);
      setSelectedPin(pin);
      setSearchResults([]);
    },
    [flyTo],
  );

  // ── Near me ───────────────────────────────────────────────────
  const handleNearMe = useCallback(() => {
    if (userPosition) {
      flyTo(userPosition.latitude, userPosition.longitude, 14);
    } else {
      pendingNearMeRef.current = true;
      requestPosition();
    }
  }, [userPosition, flyTo, requestPosition]);

  // ── Random pin ────────────────────────────────────────────────
  // Not directly wired in the current UI, but available for future
  // discovery features. We fetch a random pin, fly to it, and select it.
  const handleRandomPin = useCallback(async () => {
    const result = await fetchRandomPin();
    if (result.ok && result.data) {
      const pin = result.data;
      flyTo(pin.latitude, pin.longitude, 13);
      setSelectedPin(pin);
    }
  }, [flyTo]);

  // ── Note animation complete ───────────────────────────────────
  const handleNoteAnimationComplete = useCallback(() => {
    setNoteAnimation(null);
  }, []);

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-viewport map layer */}
      <MapView
        theme={theme}
        pins={pins}
        selectedPin={selectedPin}
        onPinSelect={handlePinSelect}
        onBoundsChange={handleBoundsChange}
        onMapClick={handleMapClick}
        isPlacingPin={isPlacingPin}
        placedPosition={placedPosition}
        flyToTarget={flyToTarget}
        noteAnimation={noteAnimation}
        onNoteAnimationComplete={handleNoteAnimationComplete}
      />

      {/* Top bar: search, theme toggle, language toggle, near me, random, auth */}
      <TopBar
        lang={lang}
        theme={theme}
        onSearch={handleSearch}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLang}
        onNearMe={handleNearMe}
        onRandomPin={handleRandomPin}
        searchResults={searchResults}
        onSelectSearchResult={handleSearchSelect}
        isAuthenticated={authenticated}
        onSignIn={() => setShowLoginPrompt(true)}
        onSignOut={logout}
        onMyPins={() => setShowMyPins(true)}
      />

      {/* Song detail card — shown when a pin is selected and the form is closed */}
      {selectedPin && !isPinFormOpen && (
        <SongCard
          pin={selectedPin}
          lang={lang}
          onClose={() => handlePinSelect(null)}
          onShare={() => {}}
        />
      )}

      {/* Pin creation form */}
      {isPinFormOpen && (
        <PinForm
          lang={lang}
          position={placedPosition}
          onSubmit={handlePinSubmit}
          onCancel={handlePinCancel}
          onRequestLocation={handleRequestLocation}
          onRequestMapPick={handleRequestMapPick}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Floating action button — opens the pin form */}
      <FAB
        lang={lang}
        onClick={handleFABClick}
        isActive={isPinFormOpen}
      />

      {/* Pin counter badge */}
      <PinCounter count={globalCount || totalCount} lang={lang} />

      {/* Empty state hint — only when the viewport has no pins and we're done loading */}
      {pins.length === 0 && !loading && !showLanding && <EmptyState lang={lang} />}

      {/* Landing overlay for unauthenticated users */}
      {showLanding && (
        <LandingOverlay lang={lang} onDismiss={() => setShowLanding(false)} />
      )}

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <LoginPrompt
          lang={lang}
          onClose={() => setShowLoginPrompt(false)}
          onLogin={login}
        />
      )}

      {/* My pins panel */}
      {showMyPins && (
        <MyPinsPanel
          lang={lang}
          onClose={() => setShowMyPins(false)}
          onSelectPin={(pin) => {
            flyTo(pin.latitude, pin.longitude, 14);
            setSelectedPin(pin);
          }}
        />
      )}
    </div>
  );
}
