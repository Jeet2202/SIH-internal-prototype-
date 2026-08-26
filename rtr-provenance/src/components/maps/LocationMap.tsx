/**
 * Root to Remedy — Location Map Component
 *
 * Reusable Leaflet map for single-point locations:
 * - Farmer / Collection Hub
 * - Laboratory Testing Facility
 * - Manufacturing Plant
 * - Distribution Hub
 *
 * Supports Privacy Mode (customer-facing approximate radius vs internal exact GPS).
 */

import { Marker, Popup, Circle } from 'react-leaflet'
import StandardMapContainer from './MapContainer'
import { createStageMarkerIcon } from './MapMarker'
import { STAGE_MAP_COLORS, type StageMapType } from './mapConfig'

export interface GeoLocation {
  lat:     number
  lng:     number
  label:   string
  city?:   string
  state?:  string
  country?: string
}

export interface LocationMapProps {
  location:   GeoLocation
  type?:      StageMapType
  label?:     string
  sublabel?:  string
  accuracyM?: number
  privacy?:   'customer' | 'internal'
  zoom?:      number
  height?:    string | number
  style?:     React.CSSProperties
  icon?:      'leaf' | 'flask' | 'truck' | 'factory' | 'package' | 'pin'
  statusBadge?: string
}

export default function LocationMap({
  location,
  type = 'farmer',
  label,
  sublabel,
  accuracyM = 15,
  privacy = 'customer',
  zoom = 11,
  height = '100%',
  style = {},
  icon,
  statusBadge = 'VERIFIED LOCATION',
}: LocationMapProps) {
  const accentColor = STAGE_MAP_COLORS[type] || '#7ec85a'
  const displayLabel = label || location.label || `${location.city || ''}, ${location.state || ''}`

  const defaultIconType = icon || (
    type === 'farmer' ? 'leaf' :
    type === 'lab' ? 'flask' :
    type === 'transport' ? 'truck' :
    type === 'manufacturing' ? 'factory' : 'package'
  )

  const markerIcon = createStageMarkerIcon({
    type,
    color: accentColor,
    label: displayLabel,
    sublabel: sublabel || (privacy === 'customer' ? 'Approx. Area' : `±${accuracyM}m`),
    icon: defaultIconType,
    pulse: true,
  })

  return (
    <StandardMapContainer
      center={[location.lat, location.lng]}
      zoom={zoom}
      height={height}
      style={{
        border: `1px solid ${accentColor}35`,
        ...style,
      }}
    >
      {/* Privacy Area Circle for Customer View */}
      {privacy === 'customer' && (
        <Circle
          center={[location.lat, location.lng]}
          radius={1800} // 1.8km approximate privacy boundary
          pathOptions={{
            color:       accentColor,
            fillColor:   accentColor,
            fillOpacity: 0.08,
            weight:      1.2,
            dashArray:   '4 4',
          }}
        />
      )}

      {/* Exact Accuracy Circle for Internal View */}
      {privacy === 'internal' && accuracyM && (
        <Circle
          center={[location.lat, location.lng]}
          radius={accuracyM}
          pathOptions={{
            color:       accentColor,
            fillColor:   accentColor,
            fillOpacity: 0.20,
            weight:      1.5,
          }}
        />
      )}

      {/* Main Location Marker */}
      <Marker position={[location.lat, location.lng]} icon={markerIcon}>
        <Popup className="rtr-map-popup">
          <div style={{
            background: '#0a0d0a',
            color: '#e4ede0',
            padding: '8px 10px',
            borderRadius: '8px',
            border: `1px solid ${accentColor}40`,
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            minWidth: '160px',
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '7.5px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: accentColor,
              marginBottom: '3px',
            }}>
              {statusBadge}
            </div>
            <div style={{ fontWeight: 700, fontSize: '12px', marginBottom: '2px' }}>
              {displayLabel}
            </div>
            {location.city && (
              <div style={{ color: 'rgba(200,220,190,0.7)', fontSize: '10px', marginBottom: '4px' }}>
                {location.city}, {location.state}, {location.country || 'India'}
              </div>
            )}
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '8px',
              color: 'rgba(200,220,190,0.5)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '4px',
            }}>
              {privacy === 'customer'
                ? 'Approx. Coordinates Protected'
                : `GPS: ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E (±${accuracyM}m)`}
            </div>
          </div>
        </Popup>
      </Marker>
    </StandardMapContainer>
  )
}
