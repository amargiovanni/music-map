import type { CircleLayerSpecification, SymbolLayerSpecification } from 'maplibre-gl';
import type { Theme } from '../../types';
import {
  MAP_STYLE_LIGHT,
  MAP_STYLE_DARK,
  PIN_COLOR_NEW,
  PIN_COLOR_SELECTED,
} from '../../lib/constants';

// ── Map style URL by theme ────────────────────────────────────────

export function getMapStyle(theme: Theme): string {
  return theme === 'dark' ? MAP_STYLE_DARK : MAP_STYLE_LIGHT;
}

// ── Cluster circle layer ──────────────────────────────────────────

export const clusterLayerStyle: CircleLayerSpecification['paint'] = {
  // Size ramps with point_count
  'circle-radius': [
    'step',
    ['get', 'point_count'],
    18,   // default: 18px for count < 10
    10, 22,  // 22px for count 10-49
    50, 28,  // 28px for count 50-99
    100, 34, // 34px for count >= 100
  ],
  // Brand color gradient based on count density
  'circle-color': [
    'step',
    ['get', 'point_count'],
    '#fad6a5', // brand-200 for small clusters (< 10)
    10, '#f39332', // brand-400 for medium (10-49)
    50, '#f0760b', // brand-500 for large (50-99)
    100, '#e15d06', // brand-600 for very large (>= 100)
  ],
  'circle-stroke-width': 2,
  'circle-stroke-color': 'rgba(255, 255, 255, 0.8)',
  'circle-opacity': 0.9,
};

// ── Cluster count label layer ─────────────────────────────────────

export const clusterCountStyle: SymbolLayerSpecification['layout'] = {
  'text-field': '{point_count_abbreviated}',
  'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
  'text-size': [
    'step',
    ['get', 'point_count'],
    12,
    10, 13,
    50, 14,
    100, 15,
  ],
  'text-allow-overlap': true,
};

export const clusterCountPaint: SymbolLayerSpecification['paint'] = {
  'text-color': '#ffffff',
};

// ── Individual pin layer ──────────────────────────────────────────

export const pinLayerStyle: CircleLayerSpecification['paint'] = {
  'circle-radius': [
    'case',
    ['==', ['get', 'selected'], true],
    10,
    7,
  ],
  'circle-color': [
    'case',
    ['==', ['get', 'selected'], true],
    PIN_COLOR_SELECTED,
    PIN_COLOR_NEW,
  ],
  'circle-stroke-width': 2,
  'circle-stroke-color': '#ffffff',
  'circle-opacity': 1,
};

// ── Pin hover style (applied via feature-state or a separate layer) ──

export const pinLayerHoverStyle: CircleLayerSpecification['paint'] = {
  'circle-radius': [
    'case',
    ['==', ['get', 'selected'], true],
    12,
    9,
  ],
  'circle-color': [
    'case',
    ['==', ['get', 'selected'], true],
    PIN_COLOR_SELECTED,
    PIN_COLOR_NEW,
  ],
  'circle-stroke-width': 2.5,
  'circle-stroke-color': '#ffffff',
  'circle-opacity': 1,
};

// ── Selected pin glow layer (rendered behind the pin) ─────────────

export const selectedPinGlowStyle: CircleLayerSpecification['paint'] = {
  'circle-radius': 18,
  'circle-color': PIN_COLOR_SELECTED,
  'circle-opacity': 0.25,
  'circle-blur': 1,
};
