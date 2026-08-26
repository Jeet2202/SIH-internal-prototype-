/**
 * TransportationStagePanel — v2
 *
 * Dedicated panel for Stage 3 — TRANSPORTATION
 * Represents a COMPLETED, VERIFIED historical custody record.
 *
 * The customer has scanned a finished product. This shipment is DONE.
 * No live-tracking language. No "ACTIVE" badges. No operational controls.
 *
 * Layout: 3 columns
 *   LEFT   (30%): WHO + WHAT — Transporter identity, vehicle, driver, shipment record, conditions
 *   MIDDLE (40%): WHERE + WHEN — Leaflet route map, GPS stats, custody timeline
 *   RIGHT  (30%): WHY IT MATTERS — About stage, Smart Insurance flow, Ledger record
 *
 * Accent: #8b6cd4 (purple/blue transport)
 * Gold:   #e8c44a (Smart Insurance)
 */

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  X, Check, ShieldCheck, Truck, Thermometer, Droplets,
  Hash, Clock, Globe, Cpu, Navigation, Shield, Zap,
  Lock, User, MapPin, AlertCircle, ArrowDown,
} from 'lucide-react'
import { TRANSPORTATION_RECORD } from '../data/transportation'

/* ─── Theme ─────────────────────────────────────────────────────── */
const ACCENT  = '#8b6cd4'
const ACCENT2 = '#a78bfa'
const GLOW    = 'rgba(139,108,212,0.55)'
const GOLD    = '#e8c44a'
const GREEN   = '#7ec85a'
const DIM     = 'rgba(143,168,136,0.55)'

/* ─── Leaflet icon fix (webpack/vite asset issue) ───────────────── */
// Leaflet's default icon URLs break in Vite; use inline SVG markers instead.

function createSvgIcon(color: string, label: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <circle cx="16" cy="16" r="14" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="6"  fill="${color}"/>
      <line x1="16" y1="30" x2="16" y2="42" stroke="${color}" stroke-width="1.5"/>
    </svg>`
  return L.divIcon({
    html: `<div style="filter:drop-shadow(0 0 6px ${color}88)">${svg}</div>
           <div style="position:absolute;top:36px;left:50%;transform:translateX(-50%);
                       white-space:nowrap;font-family:IBM Plex Mono,monospace;font-size:9px;
                       font-weight:600;letter-spacing:.1em;color:${color};
                       text-shadow:0 0 6px ${color}88">${label}</div>`,
    className: '',
    iconSize:  [32, 56],
    iconAnchor:[16, 42],
    popupAnchor:[0, -44],
  })
}

/* ─── Props ─────────────────────────────────────────────────────── */
interface Props {
  open:    boolean
  onClose: () => void
  hidden?: boolean
}

/* ── Suppress Leaflet CSS warning caused by missing image assets ── */
// We use custom SVG markers so no PNG assets are needed.

/* ══════════════════════════════════════════════════════════════════
   ROOT PANEL
══════════════════════════════════════════════════════════════════ */
export default function TransportationStagePanel({ open, onClose, hidden = false }: Props) {
  const rec = TRANSPORTATION_RECORD

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="transport-panel-v2"
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: hidden ? 0 : 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 15 }}
          transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:       'fixed',
            top:            '2vh',
            bottom:         '2vh',
            left:           '2.5vw',
            right:          '2.5vw',
            zIndex:         50,
            background:     'rgba(4,2,12,0.96)',
            backdropFilter: 'blur(36px)',
            border:         `1.5px solid ${ACCENT}50`,
            borderRadius:   20,
            boxShadow:      `0 25px 80px rgba(0,0,0,0.92), 0 0 45px ${ACCENT}25`,
            pointerEvents:  hidden ? 'none' : 'auto',
            display:        'flex',
            flexDirection:  'column',
            overflow:       'hidden',
          }}
        >
          {/* Top accent bar */}
          <div style={{
            height:     2, flexShrink: 0,
            background: `linear-gradient(90deg, transparent, ${ACCENT}80, ${ACCENT}, ${ACCENT}80, transparent)`,
          }} />

          {/* Panel header strip */}
          <PanelHeader onClose={onClose} />

          {/* 3-column body */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '30% 1fr 30%',
            flex: 1,
            minHeight: 0,
          }}>
            <LeftColumn  rec={rec} />
            <MiddleColumn rec={rec} />
            <RightColumn  rec={rec} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Panel Header ───────────────────────────────────────────────── */
function PanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      flexShrink: 0,
      padding:    '9px 18px 8px 18px',
      display:    'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${ACCENT}20`,
      background: 'rgba(255,255,255,0.015)',
    }}>
      {/* Back button */}
      <button
        onClick={onClose}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid rgba(255,255,255,0.12)`,
          borderRadius: 8, padding: '5px 12px',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 8,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#e0d8f8', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        ← BACK TO PROVENANCE
      </button>

      {/* Center node emblem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: `${ACCENT}1a`, border: `1.5px solid ${ACCENT}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 14px ${GLOW}`,
        }}>
          <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, fontWeight: 700, color: ACCENT }}>3</span>
        </div>

        <div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT, lineHeight: 1 }}>
            PROVENANCE NODE · STAGE 03
          </div>
          <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 12, fontWeight: 700, color: '#f0ecf8' }}>
            TRANSPORTATION
          </div>
        </div>

        {/* VERIFIED pill */}
        <Pill color={GREEN} text="VERIFIED" icon={<Check size={7} color={GREEN} strokeWidth={3} />} />

        {/* DELIVERED pill */}
        <Pill color={ACCENT2} text="DELIVERED ✓" icon={<Truck size={7} color={ACCENT2} />} />
      </div>

      {/* Right side: shipment ID & close button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.5, color: `${ACCENT}bb`, letterSpacing: '0.06em' }}>
          {TRANSPORTATION_RECORD.shipmentId}
        </div>

        <button
          onClick={onClose}
          aria-label="Close transportation panel"
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border:     '1px solid rgba(255,255,255,0.12)',
            display:    'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            transition: 'all 0.2s',
          }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   LEFT COLUMN — WHO + WHAT
   Transporter identity · Vehicle · Driver · Shipment record · Conditions
══════════════════════════════════════════════════════════════════ */
function LeftColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  return (
    <div style={{
      borderRight: `1px solid rgba(255,255,255,0.06)`,
      overflowY:   'auto',
      padding:     '10px 14px 10px 16px',
      display:     'flex', flexDirection: 'column', gap: 8,
    }}>

      {/* ── TRANSPORTER / CUSTODIAN ── */}
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.26 }}>
        <ColLabel text="TRANSPORTER / CUSTODIAN" icon={<ShieldCheck size={8} color={ACCENT} />} />

        {/* Transporter name */}
        <div style={{
          background: `${ACCENT}0d`, border: `1px solid ${ACCENT}22`,
          borderRadius: 10, padding: '8px 10px', marginTop: 5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6,
              background: `${ACCENT}20`, border: `1px solid ${ACCENT}45`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Truck size={10} color={ACCENT} />
            </div>
            <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, fontWeight: 700, color: '#ddd8f0' }}>
              {rec.transporter.name}
            </div>
          </div>
          <MetaRow label="Transporter ID" value={rec.transporter.transporterId} mono />
          <MetaRow label="Verification"   value={rec.transporter.verificationStatus} verified />
          <MetaRow label="Registered"     value={rec.transporter.registeredLocation} last />
        </div>

        {/* Vehicle */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10, padding: '7px 10px', marginTop: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
            <Navigation size={8} color={DIM} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: DIM }}>
              Vehicle
            </span>
          </div>
          <MetaRow label="Vehicle ID"   value={rec.transporter.vehicleId}   mono />
          <MetaRow label="Vehicle Type" value={rec.transporter.vehicleType}  last />
        </div>

        {/* Driver */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10, padding: '7px 10px', marginTop: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
            <User size={8} color={DIM} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: DIM }}>
              Custody Personnel
            </span>
          </div>
          <MetaRow label="Driver / Custodian" value={rec.transporter.driverName} />
          <MetaRow label="Driver ID"           value={rec.transporter.driverId}   mono last />
        </div>
      </motion.div>

      {/* ── SHIPMENT RECORD ── */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.26 }}>
        <ColLabel text="SHIPMENT RECORD" icon={<Hash size={8} color={ACCENT} />} />
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10, padding: '7px 10px', marginTop: 5,
        }}>
          <MetaRow label="Shipment ID" value={rec.shipmentId}  mono accent={ACCENT} />
          <MetaRow label="Batch"       value={rec.batchId}     mono accent={ACCENT} />
          <MetaRow label="Pickup"      value={`${shortDate(rec.shipment.pickupDate)} · ${rec.shipment.pickupTime}`} />
          <MetaRow label="Delivered"   value={`${shortDate(rec.shipment.arrivalDate)} · ${rec.shipment.arrivalTime}`} />
          <MetaRow label="Duration"    value="6h 45m" />
          <MetaRow label="Status"      value="DELIVERED" verified last />
        </div>
      </motion.div>

      {/* ── TRANSIT CONDITIONS ── */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.26 }}>
        <ColLabel text="TRANSIT CONDITIONS" icon={<Thermometer size={8} color={ACCENT} />} />
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10, padding: '7px 10px', marginTop: 5,
        }}>
          <CondRow icon={<Thermometer size={9} color={ACCENT2} />} label="Temperature"          value={rec.conditions.temperature}       pass />
          <CondRow icon={<Droplets    size={9} color={ACCENT2} />} label="Humidity"              value={rec.conditions.humidity}           pass />
          <CondRow icon={<MapPin      size={9} color={ACCENT2} />} label="GPS Monitoring"        value="RECORDED"                         pass />
          <CondRow icon={<Zap         size={9} color={ACCENT2} />} label="Condition Monitoring"  value="RECORDED"                         pass />
          <CondRow icon={<Navigation  size={9} color={ACCENT2} />} label="Route Compliance"      value="VERIFIED"                         pass />
          <CondRow icon={<ShieldCheck size={9} color={ACCENT2} />} label="Tamper Status"         value="NO ANOMALY DETECTED"              pass last />
        </div>
      </motion.div>

    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MIDDLE COLUMN — WHERE + WHEN
   Leaflet map · GPS stats · Custody timeline
══════════════════════════════════════════════════════════════════ */

/* Coordinates */
const NASHIK : [number, number] = [20.0059, 73.7910]
const MUMBAI : [number, number] = [19.0760, 72.8777]

/* Intermediate waypoints for a realistic Maharashtra highway route */
const ROUTE_WAYPOINTS: [number, number][] = [
  NASHIK,
  [19.9735, 73.7012],  // Igatpuri direction
  [19.8206, 73.4816],  // Kasara Ghat approach
  [19.6833, 73.3101],  // Vasind
  [19.5503, 73.1428],  // Kalyan
  [19.3800, 73.0553],  // Thane
  [19.2183, 72.9781],  // Mulund
  MUMBAI,
]

/* Representative GPS checkpoint dots (6 of the 12 shown visually) */
const CHECKPOINT_DOTS: [number, number][] = [
  [19.9735, 73.7012],
  [19.8206, 73.4816],
  [19.6833, 73.3101],
  [19.5503, 73.1428],
  [19.3800, 73.0553],
  [19.2183, 72.9781],
]

/* ─── Map bounds fitter ──────────────────────────────────────────── */
function FitBounds() {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds([NASHIK, MUMBAI]).pad(0.18)
    map.fitBounds(bounds)
  }, [map])
  return null
}

/* ─── Animated polyline controller ──────────────────────────────── */
function AnimatedRoute({ color }: { color: string }) {
  const map = useMap()
  const lineRef = useRef<L.Polyline | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const DURATION = 1800
    let start: number | null = null
    let raf: number

    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min((now - start) / DURATION, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    const timer = setTimeout(() => { raf = requestAnimationFrame(tick) }, 400)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [])

  // Interpolate waypoints
  const total = ROUTE_WAYPOINTS.length - 1
  const idx   = Math.floor(progress * total)
  const frac  = (progress * total) - idx
  const sliced: [number, number][] = ROUTE_WAYPOINTS.slice(0, idx + 1)
  if (idx < total) {
    const a = ROUTE_WAYPOINTS[idx]
    const b = ROUTE_WAYPOINTS[idx + 1]
    sliced.push([a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac])
  }

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.setLatLngs(sliced)
    } else if (map) {
      lineRef.current = L.polyline(sliced, {
        color,
        weight:    3,
        opacity:   0.90,
        className: 'rtr-route-line',
      }).addTo(map)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  useEffect(() => {
    return () => { lineRef.current?.remove(); lineRef.current = null }
  }, [])

  return null
}

function MiddleColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  const [routeDone, setRouteDone] = useState(false)

  // Mark route as done after animation completes
  useEffect(() => {
    const t = setTimeout(() => setRouteDone(true), 2500)
    return () => clearTimeout(t)
  }, [])

  const originIcon = createSvgIcon(ACCENT2, 'NASHIK')
  const destIcon   = createSvgIcon(GREEN,   'MUMBAI')

  const checkpointIcon = L.divIcon({
    html: `<div style="width:7px;height:7px;border-radius:50%;background:${ACCENT2};
                        box-shadow:0 0 5px ${ACCENT2}99;border:1px solid rgba(255,255,255,0.3)"></div>`,
    className: '',
    iconSize:  [7, 7],
    iconAnchor:[3.5, 3.5],
  })

  return (
    <div style={{
      borderRight: `1px solid rgba(255,255,255,0.06)`,
      display:     'flex', flexDirection: 'column', gap: 6,
      padding:     '10px 12px 10px 12px',
      overflowY:   'auto',
    }}>

      {/* Route header */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.10, duration: 0.28 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, letterSpacing: '0.20em', textTransform: 'uppercase', color: ACCENT }}>
          Route · {rec.route.origin.split(',')[0]} → {rec.route.destination.split(',')[0]}
        </span>
        <AnimatePresence>
          {routeDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.28 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(126,200,90,0.10)', border: '1px solid rgba(126,200,90,0.30)',
                borderRadius: 999, padding: '2px 9px',
              }}
            >
              <Check size={7} color={GREEN} strokeWidth={3} />
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, color: GREEN, letterSpacing: '0.12em' }}>
                ROUTE VERIFIED
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── LEAFLET MAP ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.16, duration: 0.36 }}
        style={{
          flex: 1, minHeight: 0,
          borderRadius: 14, overflow: 'hidden',
          border: `1px solid ${ACCENT}25`,
          position: 'relative',
        }}
      >
        {/* Dark map overlay style injected via global style below */}
        <MapContainer
          center={[19.55, 73.35]}
          zoom={8}
          zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          style={{ width: '100%', height: '100%', background: '#060310' }}
        >
          {/* Dark tile layer — CartoDB Dark Matter */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          />

          <FitBounds />
          <AnimatedRoute color={ACCENT} />

          {/* Ghost full route (dashed, dim) */}
          <Polyline
            positions={ROUTE_WAYPOINTS}
            pathOptions={{ color: `${ACCENT}35`, weight: 2, dashArray: '5 6' }}
          />

          {/* Origin marker */}
          <Marker position={NASHIK} icon={originIcon}>
            <Popup className="rtr-map-popup">
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#d0c8f0' }}>
                <strong>NASHIK</strong><br />
                Collection / Dispatch Point<br />
                Pickup: 07:30 AM IST
              </div>
            </Popup>
          </Marker>

          {/* Destination marker */}
          <Marker position={MUMBAI} icon={destIcon}>
            <Popup className="rtr-map-popup">
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: '#c0f0a0' }}>
                <strong>MUMBAI</strong><br />
                Manufacturing Facility<br />
                Delivered: 02:15 PM IST ✓
              </div>
            </Popup>
          </Marker>

          {/* GPS checkpoint markers */}
          {CHECKPOINT_DOTS.map((pos, i) => (
            <Marker key={i} position={pos} icon={checkpointIcon}>
              <Popup className="rtr-map-popup">
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: '#c8c0e0' }}>
                  GPS Checkpoint #{i + 1}<br />
                  Recorded during transit<br />
                  <span style={{ color: GREEN }}>Status: Verified ✓</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map overlay: distance + GPS count */}
        <div style={{
          position: 'absolute', bottom: 7, left: 7, right: 7,
          background: 'rgba(4,2,12,0.84)', backdropFilter: 'blur(8px)',
          borderRadius: 9, padding: '5px 10px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          border: `1px solid ${ACCENT}20`,
          zIndex: 1000,
          pointerEvents: 'none',
        }}>
          <StatChip value={`${rec.route.distanceKm} km`}    label="Distance"          color={ACCENT2} />
          <StatChip value={`${rec.route.gpsCheckpoints}`}   label="GPS checkpoints"   color={ACCENT2} />
          <StatChip value={`${rec.route.routeDeviations}`}  label="Route deviations"  color={GREEN} />
        </div>
      </motion.div>

      {/* ── CUSTODY TIMELINE ── */}
      <motion.div
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44, duration: 0.28 }}
      >
        <CustodyTimeline routeDone={routeDone} />
      </motion.div>

    </div>
  )
}

/* ─── Stat chip inside map overlay ──────────────────────────────── */
function StatChip({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, color: DIM, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  )
}

/* ─── Custody Timeline ───────────────────────────────────────────── */
function CustodyTimeline({ routeDone }: { routeDone: boolean }) {
  const steps = [
    { time: '07:30 AM', label: 'PICKUP',     sub: 'Nashik',                             done: true,      color: ACCENT2 },
    { time: '',         label: 'IN TRANSIT', sub: 'GPS + condition monitoring recorded', done: routeDone, color: ACCENT  },
    { time: '02:15 PM', label: 'DELIVERED',  sub: 'Mumbai Manufacturing Facility',      done: routeDone, color: GREEN   },
  ]

  return (
    <div style={{
      background: `${ACCENT}09`, border: `1px solid ${ACCENT}20`,
      borderRadius: 10, padding: '8px 12px',
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: ACCENT, marginBottom: 7,
      }}>
        Custody Timeline
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i === 1 ? 1.5 : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 60 }}>
              {/* Time */}
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, color: s.done ? s.color : DIM, transition: 'color 0.5s' }}>
                {s.time}
              </div>
              {/* Node */}
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: s.done ? `${s.color}22` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${s.done ? s.color : 'rgba(255,255,255,0.10)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: s.done ? `0 0 8px ${s.color}60` : 'none',
                transition: 'all 0.5s ease',
              }}>
                {s.done && <Check size={8} color={s.color} strokeWidth={3} />}
              </div>
              {/* Label */}
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, letterSpacing: '0.10em', textTransform: 'uppercase', color: s.done ? s.color : DIM, transition: 'color 0.5s', textAlign: 'center' }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 7.5, color: 'rgba(200,192,220,0.65)', textAlign: 'center', lineHeight: 1.3 }}>
                {s.sub}
              </div>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1.5, margin: '-12px 4px 0',
                background: steps[i + 1].done
                  ? `linear-gradient(to right, ${s.color}, ${steps[i + 1].color})`
                  : `linear-gradient(to right, ${s.color}60, rgba(255,255,255,0.05))`,
                borderRadius: 1, transition: 'all 0.5s ease',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* CUSTODY COMPLETED badge */}
      <AnimatePresence>
        {routeDone && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.28 }}
            style={{
              marginTop: 8, display: 'flex', justifyContent: 'center',
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 8,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: GREEN,
            }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(126,200,90,0.08)', border: '1px solid rgba(126,200,90,0.25)',
              borderRadius: 999, padding: '3px 12px',
            }}>
              <Check size={8} color={GREEN} strokeWidth={3} />
              CUSTODY COMPLETED
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RIGHT COLUMN — WHY IT MATTERS
   About stage · Smart Insurance flow · Ledger record
══════════════════════════════════════════════════════════════════ */
function RightColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  return (
    <div style={{
      padding:  '10px 14px 10px 10px',
      display:  'flex', flexDirection: 'column', gap: 7,
      overflowY:'auto',
    }}>

      {/* ── ABOUT ── */}
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.28 }}>
        <AboutCard />
      </motion.div>

      {/* ── SMART INSURANCE ── */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.30 }}>
        <SmartInsuranceCard rec={rec} />
      </motion.div>

      {/* ── LEDGER RECORD ── */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.40, duration: 0.28 }}>
        <LedgerCard rec={rec} />
      </motion.div>
    </div>
  )
}

/* ─── About card ─────────────────────────────────────────────────── */
function AboutCard() {
  return (
    <div style={{
      background: `${ACCENT}08`, border: `1px solid ${ACCENT}1e`,
      borderRadius: 11, padding: '9px 11px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <div style={{
          width: 18, height: 18, borderRadius: 5,
          background: `${ACCENT}20`, border: `1px solid ${ACCENT}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Truck size={9} color={ACCENT} />
        </div>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT }}>
          About This Stage
        </span>
      </div>
      <p style={{ fontSize: 10, color: '#b0a8d8', lineHeight: 1.65, fontFamily: "'Inter',sans-serif" }}>
        Transportation creates a verified chain-of-custody record between the tested botanical
        batch and the manufacturing facility. During transit, GPS, environmental conditions, and
        custody events were recorded against the shipment so the batch can be verified after delivery.
      </p>
    </div>
  )
}

/* ─── Smart Insurance card ───────────────────────────────────────── */
function SmartInsuranceCard({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  return (
    <div style={{
      background:  'linear-gradient(135deg, rgba(22,14,52,0.97) 0%, rgba(12,8,32,0.97) 100%)',
      border:      `1.5px solid ${GOLD}38`,
      borderRadius: 13,
      padding:     '10px 12px',
      boxShadow:   `0 4px 28px rgba(232,196,74,0.07)`,
      position:    'relative', overflow: 'hidden',
    }}>
      {/* Top shimmer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg,transparent,${GOLD}70,transparent)` }} />
      {/* Corner glow */}
      <div style={{ position: 'absolute', top: -18, right: -18, width: 70, height: 70, borderRadius: '50%', background: `radial-gradient(circle,${GOLD}16 0%,transparent 70%)`, pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: `rgba(232,196,74,0.14)`, border: `1px solid rgba(232,196,74,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={10} color={GOLD} />
          </div>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, letterSpacing: '0.20em', textTransform: 'uppercase', color: `${GOLD}aa` }}>SMART INSURANCE</div>
            <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 11, fontWeight: 700, color: '#f5e8a8' }}>TRANSIT PROTECTION</div>
          </div>
        </div>
        {/* Completed badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'rgba(126,200,90,0.12)', border: '1px solid rgba(126,200,90,0.30)',
          borderRadius: 999, padding: '3px 9px',
        }}>
          <Check size={7} color={GREEN} strokeWidth={3} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, color: GREEN, letterSpacing: '0.10em' }}>COMPLETED</span>
        </div>
      </div>

      {/* Policy + Coverage */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <MiniBox label="Policy" value={rec.insurance.policyId} mono />
        <MiniBox label="Coverage" value={rec.insurance.coverage} />
      </div>

      {/* Flow diagram: inputs → check → outcome */}
      <div style={{
        background: 'rgba(0,0,0,0.22)', borderRadius: 8, padding: '7px 9px',
        marginBottom: 7, border: `1px solid ${GOLD}15`,
      }}>
        {/* Input signals */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 5 }}>
          {rec.insurance.triggerMonitoring.map((m, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              background: `rgba(232,196,74,0.08)`, border: `1px solid ${GOLD}25`,
              borderRadius: 6, padding: '2px 7px',
            }}>
              <Zap size={6} color={GOLD} />
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, color: '#ddd090', letterSpacing: '0.04em' }}>{m}</span>
            </div>
          ))}
        </div>
        {/* Arrow + automated check */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
          <ArrowDown size={9} color={`${GOLD}70`} />
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, color: `${GOLD}80`, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
            Automated condition check
          </div>
        </div>
        {/* Arrow + outcome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <ArrowDown size={9} color={`${GREEN}80`} />
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(126,200,90,0.09)', border: '1px solid rgba(126,200,90,0.22)',
            borderRadius: 6, padding: '2px 9px',
          }}>
            <Check size={7} color={GREEN} strokeWidth={3} />
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, color: GREEN, letterSpacing: '0.08em' }}>
              NO ANOMALY → NO CLAIM TRIGGERED
            </span>
          </div>
        </div>
      </div>

      {/* Transit outcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, color: `${GOLD}80`, textTransform: 'uppercase', letterSpacing: '0.10em' }}>Transit outcome</span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: GREEN, letterSpacing: '0.04em' }}>{rec.insurance.transitStatus}</span>
      </div>

      {/* Disclaimer */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '5px 8px', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
        <Lock size={7} color={`${GOLD}70`} style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 8.5, color: `${GOLD}80`, lineHeight: 1.55 }}>
          Transport events can be automatically evaluated against predefined protection conditions.
          If a qualifying anomaly occurs during transit, the recorded event can be used to trigger
          the configured insurance workflow.
        </p>
      </div>
    </div>
  )
}

/* ─── Ledger card ────────────────────────────────────────────────── */
function LedgerCard({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.018)', border: `1px solid ${ACCENT}22`,
      borderRadius: 11, padding: '9px 11px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <Cpu size={9} color={ACCENT2} />
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT2 }}>
          Ledger Record
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, color: `${ACCENT}60`, letterSpacing: '0.10em', textTransform: 'uppercase' }}>
          PROTOTYPE DEMO
        </span>
      </div>
      <LedgerRow icon={<Hash  size={8} color={DIM} />} label="TX ID"    value={rec.ledger.transactionId} mono />
      <LedgerRow icon={<Cpu   size={8} color={DIM} />} label="Block"    value={rec.ledger.blockNumber}   mono />
      <LedgerRow icon={<Clock size={8} color={DIM} />} label="Time"     value={rec.ledger.timestamp}          />
      <LedgerRow icon={<Globe size={8} color={DIM} />} label="Network"  value={rec.ledger.network}            />
      {/* Anchored status */}
      <div style={{
        marginTop: 6, display: 'flex', justifyContent: 'flex-end',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`,
          borderRadius: 999, padding: '2px 10px',
        }}>
          <Check size={7} color={ACCENT2} strokeWidth={3} />
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, color: ACCENT2, letterSpacing: '0.10em' }}>ANCHORED</span>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════════════ */

function ColLabel({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {icon}
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT }}>
        {text}
      </span>
    </div>
  )
}

function Pill({ color, text, icon }: { color: string; text: string; icon: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: `${color}12`, border: `1px solid ${color}30`,
      borderRadius: 999, padding: '2px 8px',
    }}>
      {icon}
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, letterSpacing: '0.12em', color, textTransform: 'uppercase' }}>{text}</span>
    </div>
  )
}

function MetaRow({ label, value, mono, verified, accent, last }: {
  label: string; value: string; mono?: boolean; verified?: boolean; accent?: string; last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
      padding: '3px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)',
    }}>
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: DIM, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "'IBM Plex Mono',monospace" : "'Inter',sans-serif",
        fontSize: mono ? 8 : 9.5,
        color: verified ? GREEN : (accent ?? '#d0c8f0'),
        textAlign: 'right',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {value}
        {verified && <Check size={7} color={GREEN} strokeWidth={3} />}
      </span>
    </div>
  )
}

function CondRow({ icon, label, value, pass, last }: {
  icon: React.ReactNode; label: string; value: string; pass?: boolean; last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '3.5px 0',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)',
    }}>
      {icon}
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, color: DIM, letterSpacing: '0.06em', minWidth: 72, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: '#d0c8f0', flex: 1 }}>
        {value}
      </span>
      {pass && (
        <div style={{
          width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(126,200,90,0.12)', border: '1px solid rgba(126,200,90,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={7} color={GREEN} strokeWidth={3} />
        </div>
      )}
    </div>
  )
}

function MiniBox({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ flex: 1, background: `rgba(232,196,74,0.06)`, border: `1px solid rgba(232,196,74,0.15)`, borderRadius: 7, padding: '4px 7px' }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 6.5, color: `${GOLD}80`, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: mono ? "'IBM Plex Mono',monospace" : "'Inter',sans-serif", fontSize: mono ? 7.5 : 8.5, color: '#f0e090' }}>{value}</div>
    </div>
  )
}

function LedgerRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      gap: 8, padding: '3.5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, fontFamily: "'IBM Plex Mono',monospace", fontSize: 7.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: DIM }}>
        {icon} {label}
      </div>
      <div style={{ fontFamily: mono ? "'IBM Plex Mono',monospace" : "'Inter',sans-serif", fontSize: mono ? 8 : 9.5, color: '#c8c0e8', textAlign: 'right', wordBreak: 'break-all' }}>
        {value}
      </div>
    </div>
  )
}

/* ── Helper ─────────────────────────────────────────────────────── */
function shortDate(d: string): string {
  return d.replace(' August', ' Aug').replace(' 2026', '')
}

/* ── Suppress unused import ─────────────────────────────────────── */
void AlertCircle
