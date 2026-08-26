/**
 * PRAMANA — Standard Leaflet Map Configuration
 *
 * Production-ready geographic configuration.
 * Configures dark tile layers, attribution, stage color mappings,
 * and privacy boundaries.
 */

export interface MapConfig {
  tileUrl:     string
  attribution: string
  maxZoom:     number
  minZoom:     number
  defaultZoom: number
}

// Support Vite env variables with fallback to CARTO Dark Matter & OSM
export const MAP_CONFIG: MapConfig = {
  tileUrl: import.meta.env?.VITE_MAP_TILE_URL ||
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: import.meta.env?.VITE_MAP_ATTRIBUTION ||
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
  maxZoom:     18,
  minZoom:     4,
  defaultZoom: 10,
}

// Stage-specific accent colors for map markers & polylines
export const STAGE_MAP_COLORS = {
  farmer:        '#7ec85a', // Green
  lab:           '#4ea8d2', // Blue
  transport:     '#8b6cd4', // Purple
  manufacturing: '#c8922e', // Amber
  product:       '#7ec85a', // Green
} as const

export type StageMapType = keyof typeof STAGE_MAP_COLORS
