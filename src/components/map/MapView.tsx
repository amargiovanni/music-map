import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Map, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre';
import type { GeoJSON } from 'geojson';

import type { Pin, MapBounds, Theme, GeoPosition } from '../../types';
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_MIN_ZOOM,
  MAP_MAX_ZOOM,
  MAP_FLY_DURATION,
  CLUSTER_RADIUS,
  CLUSTER_MAX_ZOOM,
} from '../../lib/constants';
import {
  getMapStyle,
  clusterLayerStyle,
  clusterCountStyle,
  clusterCountPaint,
  pinLayerStyle,
  selectedPinGlowStyle,
} from './mapStyles';
import { PlacementMarker } from './PlacementMarker';
import { NoteAnimation } from './NoteAnimation';

// ── Props ─────────────────────────────────────────────────────────

interface MapViewProps {
  theme: Theme;
  pins: Pin[];
  selectedPin: Pin | null;
  onPinSelect: (pin: Pin | null) => void;
  onBoundsChange: (bounds: MapBounds) => void;
  onMapClick: (lat: number, lng: number) => void;
  isPlacingPin: boolean;
  placedPosition: GeoPosition | null;
  flyToTarget: { lat: number; lng: number; zoom?: number } | null;
  noteAnimation: GeoPosition | null;
  onNoteAnimationComplete: () => void;
}

// ── Interactable layer IDs ────────────────────────────────────────

const CLUSTER_LAYER_ID = 'clusters';
const PIN_LAYER_ID = 'unclustered-point';
const INTERACTIVE_LAYERS = [CLUSTER_LAYER_ID, PIN_LAYER_ID];

// ── Component ─────────────────────────────────────────────────────

export function MapView({
  theme,
  pins,
  selectedPin,
  onPinSelect,
  onBoundsChange,
  onMapClick,
  isPlacingPin,
  placedPosition,
  flyToTarget,
  noteAnimation,
  onNoteAnimationComplete,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  // ── Build GeoJSON from pins ───────────────────────────────────

  const geojsonData: GeoJSON.FeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: pins.map((pin) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [pin.longitude, pin.latitude],
        },
        properties: {
          id: pin.id,
          slug: pin.slug,
          song_title: pin.song_title,
          artist_name: pin.artist_name,
          thumbnail_url: pin.thumbnail_url,
          selected: pin.slug === selectedPin?.slug,
        },
      })),
    }),
    [pins, selectedPin]
  );

  // ── Fly-to effect ─────────────────────────────────────────────

  useEffect(() => {
    if (!flyToTarget || !mapRef.current) return;

    mapRef.current.flyTo({
      center: [flyToTarget.lng, flyToTarget.lat],
      zoom: flyToTarget.zoom ?? 13,
      duration: MAP_FLY_DURATION,
      essential: true,
    });
  }, [flyToTarget]);

  // ── Bounds change handler ─────────────────────────────────────

  const handleMoveEnd = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    onBoundsChange({
      north: ne.lat,
      south: sw.lat,
      east: ne.lng,
      west: sw.lng,
    });
  }, [onBoundsChange]);

  // ── Click handler ─────────────────────────────────────────────

  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;

      // Check if user clicked on a cluster
      const clusterFeatures = e.features?.filter(
        (f) => f.layer?.id === CLUSTER_LAYER_ID
      );
      if (clusterFeatures && clusterFeatures.length > 0) {
        const feature = clusterFeatures[0];
        const clusterId = feature.properties?.cluster_id;
        const geometry = feature.geometry;

        if (geometry.type === 'Point' && clusterId != null) {
          const source = map.getSource('pins') as maplibregl.GeoJSONSource | undefined;
          if (source && 'getClusterExpansionZoom' in source) {
            source.getClusterExpansionZoom(clusterId).then((zoom: number) => {
              map.flyTo({
                center: geometry.coordinates as [number, number],
                zoom: Math.min(zoom, MAP_MAX_ZOOM),
                duration: MAP_FLY_DURATION / 2,
              });
            });
          }
        }
        return;
      }

      // Check if user clicked on an individual pin
      const pinFeatures = e.features?.filter(
        (f) => f.layer?.id === PIN_LAYER_ID
      );
      if (pinFeatures && pinFeatures.length > 0) {
        const feature = pinFeatures[0];
        const slug = feature.properties?.slug;
        if (slug) {
          const pin = pins.find((p) => p.slug === slug);
          if (pin) {
            onPinSelect(pin);
            return;
          }
        }
      }

      // If placing a pin, the click places it on the map
      if (isPlacingPin) {
        onMapClick(e.lngLat.lat, e.lngLat.lng);
        return;
      }

      // Clicking empty space deselects
      onPinSelect(null);
    },
    [pins, isPlacingPin, onPinSelect, onMapClick]
  );

  // ── Cursor management ─────────────────────────────────────────

  const handleMouseEnter = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      map.getCanvas().style.cursor = 'pointer';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      map.getCanvas().style.cursor = isPlacingPin ? 'crosshair' : '';
    }
  }, [isPlacingPin]);

  // Update cursor when isPlacingPin changes
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.getCanvas().style.cursor = isPlacingPin ? 'crosshair' : '';
    }
  }, [isPlacingPin]);

  // ── Map style ─────────────────────────────────────────────────

  const mapStyle = useMemo(() => getMapStyle(theme), [theme]);

  // ── Render ────────────────────────────────────────────────────

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: MAP_DEFAULT_CENTER[0],
          latitude: MAP_DEFAULT_CENTER[1],
          zoom: MAP_DEFAULT_ZOOM,
        }}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        mapStyle={mapStyle}
        onMoveEnd={handleMoveEnd}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={INTERACTIVE_LAYERS}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
        {/* Navigation + Geolocation controls */}
        <NavigationControl position="bottom-left" showCompass={false} />
        <GeolocateControl
          position="bottom-left"
          trackUserLocation={false}
        />

        {/* Clustered pin source */}
        <Source
          id="pins"
          type="geojson"
          data={geojsonData}
          cluster={true}
          clusterRadius={CLUSTER_RADIUS}
          clusterMaxZoom={CLUSTER_MAX_ZOOM}
        >
          {/* Glow ring behind selected pin */}
          <Layer
            id="selected-glow"
            type="circle"
            filter={['all', ['!', ['has', 'point_count']], ['==', ['get', 'selected'], true]]}
            paint={selectedPinGlowStyle}
          />

          {/* Cluster circles */}
          <Layer
            id={CLUSTER_LAYER_ID}
            type="circle"
            filter={['has', 'point_count']}
            paint={clusterLayerStyle}
          />

          {/* Cluster count labels */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={clusterCountStyle}
            paint={clusterCountPaint}
          />

          {/* Individual pin circles */}
          <Layer
            id={PIN_LAYER_ID}
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={pinLayerStyle}
          />
        </Source>

        {/* Placement marker for pin being placed */}
        {placedPosition && <PlacementMarker position={placedPosition} />}

        {/* Celebratory note burst after pin creation */}
        {noteAnimation && (
          <NoteAnimation position={noteAnimation} onComplete={onNoteAnimationComplete} />
        )}
      </Map>
    </div>
  );
}
