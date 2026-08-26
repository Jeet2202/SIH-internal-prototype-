/**
 * Root to Remedy — Standard Leaflet Map Container
 *
 * Provides a dark-themed Leaflet Map with attribution and responsive sizing.
 */

import React, { useEffect, useRef } from 'react'
import { MapContainer as RLMapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CONFIG } from './mapConfig'

interface BaseMapContainerProps {
  center:       [number, number]
  zoom?:        number
  height?:      string | number
  width?:       string | number
  className?:   string
  style?:       React.CSSProperties
  children?:    React.ReactNode
  scrollWheelZoom?: boolean
  attributionControl?: boolean
}

// Helper to invalidate size on container resize
function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 250)
    return () => clearTimeout(timer)
  }, [map])
  return null
}

export default function StandardMapContainer({
  center,
  zoom = MAP_CONFIG.defaultZoom,
  height = '100%',
  width = '100%',
  className = '',
  style = {},
  children,
  scrollWheelZoom = false,
  attributionControl = true,
}: BaseMapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={`rtr-map-wrapper ${className}`}
      style={{
        position:     'relative',
        width,
        height,
        borderRadius: style.borderRadius || '12px',
        overflow:     'hidden',
        border:       style.border || '1px solid rgba(255,255,255,0.08)',
        background:   '#050805',
        ...style,
      }}
    >
      <RLMapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        attributionControl={attributionControl}
        style={{ width: '100%', height: '100%', background: '#050805' }}
        zoomControl={false}
      >
        <TileLayer
          url={MAP_CONFIG.tileUrl}
          attribution={MAP_CONFIG.attribution}
          maxZoom={MAP_CONFIG.maxZoom}
          minZoom={MAP_CONFIG.minZoom}
        />
        <MapResizer />
        {children}
      </RLMapContainer>
    </div>
  )
}
