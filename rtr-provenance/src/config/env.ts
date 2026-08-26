/**
 * PRAMANA — Production Environment Configuration
 *
 * Centralized configuration schema supporting development, staging,
 * and production environments without hardcoded secrets.
 */

export interface AppEnvConfig {
  mode:                 'development' | 'staging' | 'production'
  isProduction:         boolean
  isDemoEnabled:        boolean
  apiBaseUrl:           string
  ledgerNetwork:        string
  ledgerEndpoint:       string
  storageBucketUrl:     string
  mapTileUrl:           string
  mapAttribution:       string
  healthCheckEndpoint:  string
}

export const ENV: AppEnvConfig = {
  mode: (import.meta.env?.MODE as 'development' | 'staging' | 'production') || 'development',
  isProduction: import.meta.env?.PROD ?? false,
  isDemoEnabled: import.meta.env?.VITE_DEMO_ENABLED !== 'false' && !import.meta.env?.PROD,

  apiBaseUrl: import.meta.env?.VITE_API_BASE_URL || '/api',
  ledgerNetwork: import.meta.env?.VITE_LEDGER_NETWORK || 'Hyperledger Fabric (Permissioned)',
  ledgerEndpoint: import.meta.env?.VITE_LEDGER_ENDPOINT || 'https://ledger.roottoremedy.org/v1',
  storageBucketUrl: import.meta.env?.VITE_STORAGE_URL || 'https://storage.roottoremedy.org/documents',

  mapTileUrl: import.meta.env?.VITE_MAP_TILE_URL ||
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  mapAttribution: import.meta.env?.VITE_MAP_ATTRIBUTION ||
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',

  healthCheckEndpoint: '/api/health',
}
