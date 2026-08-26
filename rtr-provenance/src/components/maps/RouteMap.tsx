/**
 * PRAMANA — Route Map Component
 *
 * Reusable Leaflet map for transportation & multi-hop custody tracking:
 * - Real route polylines
 * - Origin & Destination markers
 * - GPS Checkpoint pins
 * - Temperature / condition overlays
 */

import { Marker, Popup, Polyline } from 'react-leaflet'
import StandardMapContainer from './MapContainer'
import { createStageMarkerIcon } from './MapMarker'
import { STAGE_MAP_COLORS } from './mapConfig'

export interface RoutePoint {
  lat:   number
  lng:   number
  label: string
  time?: string
  status?: string
}

export interface RouteMapProps {
  origin:       RoutePoint
  destination:  RoutePoint
  polyline:     [number, number][]
  checkpoints?: RoutePoint[]
  status?:      'verified' | 'in_transit' | 'warning'
  height?:      string | number
  style?:       React.CSSProperties
}

export default function RouteMap({
  origin,
  destination,
  polyline,
  checkpoints = [],
  status = 'verified',
  height = '100%',
  style = {},
}: RouteMapProps) {
  const accent = STAGE_MAP_COLORS.transport // Purple #8b6cd4

  const originIcon = createStageMarkerIcon({
    type: 'transport',
    color: accent,
    label: origin.label,
    sublabel: 'ORIGIN',
    icon: 'pin',
    pulse: false,
  })

  const destIcon = createStageMarkerIcon({
    type: 'manufacturing',
    color: STAGE_MAP_COLORS.manufacturing,
    label: destination.label,
    sublabel: 'DESTINATION',
    icon: 'factory',
    pulse: true,
  })

  // Calculate center between origin & destination
  const centerLat = (origin.lat + destination.lat) / 2
  const centerLng = (origin.lng + destination.lng) / 2

  return (
    <StandardMapContainer
      center={[centerLat, centerLng]}
      zoom={9}
      height={height}
      style={{
        border: `1.5px solid ${accent}40`,
        ...style,
      }}
    >
      {/* Route glow line */}
      <Polyline
        positions={polyline}
        pathOptions={{
          color:   accent,
          weight:  6,
          opacity: 0.25,
        }}
      />

      {/* Main route polyline */}
      <Polyline
        positions={polyline}
        pathOptions={{
          color:     accent,
          weight:    2.5,
          opacity:   0.90,
          dashArray: status === 'in_transit' ? '6 6' : undefined,
        }}
      />

      {/* Origin Marker */}
      <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
        <Popup className="rtr-map-popup">
          <div style={{ padding: '6px', fontSize: '11px', color: '#e0d8f0', background: '#0a0814' }}>
            <div style={{ color: accent, fontSize: '8px', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>
              Origin Checkpoint
            </div>
            <strong>{origin.label}</strong>
            {origin.time && <div style={{ fontSize: '9px', color: 'rgba(200,190,230,0.6)' }}>Departed: {origin.time}</div>}
          </div>
        </Popup>
      </Marker>

      {/* Checkpoints */}
      {checkpoints.map((cp, idx) => {
        const cpIcon = createStageMarkerIcon({
          type: 'transport',
          color: accent,
          label: cp.label,
          sublabel: cp.time || `CP ${idx + 1}`,
          icon: 'pin',
          pulse: false,
        })
        return (
          <Marker key={idx} position={[cp.lat, cp.lng]} icon={cpIcon}>
            <Popup className="rtr-map-popup">
              <div style={{ padding: '6px', fontSize: '11px', color: '#e0d8f0', background: '#0a0814' }}>
                <div style={{ color: accent, fontSize: '8px', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>
                  Waypoint #{idx + 1}
                </div>
                <strong>{cp.label}</strong>
                {cp.time && <div style={{ fontSize: '9px', color: 'rgba(200,190,230,0.6)' }}>Time: {cp.time}</div>}
                {cp.status && <div style={{ fontSize: '9px', color: '#7ec85a' }}>{cp.status}</div>}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {/* Destination Marker */}
      <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
        <Popup className="rtr-map-popup">
          <div style={{ padding: '6px', fontSize: '11px', color: '#e0d8f0', background: '#0a0814' }}>
            <div style={{ color: STAGE_MAP_COLORS.manufacturing, fontSize: '8px', textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>
              Delivery Point
            </div>
            <strong>{destination.label}</strong>
            {destination.time && <div style={{ fontSize: '9px', color: 'rgba(200,190,230,0.6)' }}>Delivered: {destination.time}</div>}
          </div>
        </Popup>
      </Marker>
    </StandardMapContainer>
  )
}
