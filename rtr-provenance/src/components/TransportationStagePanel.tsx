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
  Lock, User, MapPin, AlertCircle, ArrowDown, FileText,
} from 'lucide-react'
import { TRANSPORTATION_RECORD } from '../data/transportation'
import StageDetailHeader from './StageDetailHeader'

/* ─── Theme ─────────────────────────────────────────────────────── */
const ACCENT  = '#8b6cd4'
const ACCENT2 = '#a78bfa'
const GLOW    = 'rgba(139,108,212,0.55)'
const GOLD    = '#e8c44a'
const GREEN   = '#7CFF4F'
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
  const [docModalOpen, setDocModalOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
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

          {/* Global Stage Header */}
          <StageDetailHeader
            stageNumber={3}
            title="TRANSPORTATION"
            status="Verified"
            description="Verified movement of the botanical batch under monitored transport conditions."
            accentColor={ACCENT}
            onClose={onClose}
          />

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
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════
   LEFT COLUMN — SHIPMENT
══════════════════════════════════════════════════════════════════ */
function LeftColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  return (
    <div style={{
      padding: '24px 32px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
    }}>
      {[
        { label: 'Transporter',      value: rec.transporter.name },
        { label: 'Transporter ID',   value: rec.transporter.transporterId },
        { label: 'Vehicle Type',     value: rec.transporter.vehicleType },
        { label: 'Vehicle ID',       value: rec.transporter.vehicleId },
        { label: 'Driver',           value: rec.transporter.driverName },
        { label: 'Driver ID',        value: rec.transporter.driverId },
        { label: 'Shipment ID',      value: rec.shipmentId },
        { label: 'Origin',           value: rec.route.origin.split(',')[0] },
        { label: 'Destination',      value: rec.route.destination.split(',')[0] },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0', textAlign: 'right' }}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MIDDLE COLUMN — ROUTE
══════════════════════════════════════════════════════════════════ */
/* Coordinates */
const NASHIK : [number, number] = [20.0059, 73.7910]
const MUMBAI : [number, number] = [19.0760, 72.8777]
const ROUTE_WAYPOINTS: [number, number][] = [
  NASHIK, [19.9735, 73.7012], [19.8206, 73.4816], [19.6833, 73.3101],
  [19.5503, 73.1428], [19.3800, 73.0553], [19.2183, 72.9781], MUMBAI,
]
const CHECKPOINT_DOTS: [number, number][] = [
  [19.9735, 73.7012], [19.8206, 73.4816], [19.6833, 73.3101],
  [19.5503, 73.1428], [19.3800, 73.0553], [19.2183, 72.9781],
]

function FitBounds() {
  const map = useMap()
  useEffect(() => { map.fitBounds(L.latLngBounds([NASHIK, MUMBAI]).pad(0.18)) }, [map])
  return null
}

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
    if (lineRef.current) lineRef.current.setLatLngs(sliced)
    else if (map) {
      lineRef.current = L.polyline(sliced, { color, weight: 3, opacity: 0.90 }).addTo(map)
    }
  }, [progress, color, map])

  useEffect(() => {
    return () => { lineRef.current?.remove(); lineRef.current = null }
  }, [])

  return null
}

function MiddleColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  const originIcon = createSvgIcon(ACCENT2, 'NASHIK')
  const destIcon   = createSvgIcon(GREEN,   'MUMBAI')
  const checkpointIcon = L.divIcon({
    html: `<div style="width:7px;height:7px;border-radius:50%;background:${ACCENT2};box-shadow:0 0 5px ${ACCENT2}99;border:1px solid rgba(255,255,255,0.3)"></div>`,
    className: '', iconSize: [7, 7], iconAnchor: [3.5, 3.5],
  })

  return (
    <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Route Map
      </div>
      <div style={{ flex: 1, minHeight: 200, borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.12)`, position: 'relative' }}>
        <MapContainer
          center={[19.55, 73.35]} zoom={8} zoomControl={false} attributionControl={false} scrollWheelZoom={false} dragging={false} doubleClickZoom={false}
          style={{ width: '100%', height: '100%', background: '#060310' }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap contributors &copy; CARTO' />
          <FitBounds />
          <AnimatedRoute color={ACCENT} />
          <Polyline positions={ROUTE_WAYPOINTS} pathOptions={{ color: `${ACCENT}35`, weight: 2, dashArray: '5 6' }} />
          <Marker position={NASHIK} icon={originIcon} />
          <Marker position={MUMBAI} icon={destIcon} />
          {CHECKPOINT_DOTS.map((pos, i) => (
            <Marker key={i} position={pos} icon={checkpointIcon} />
          ))}
        </MapContainer>
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          background: 'rgba(4,2,12,0.84)', backdropFilter: 'blur(8px)',
          borderRadius: 12, padding: '10px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          border: `1px solid ${ACCENT}20`, zIndex: 1000, pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: ACCENT2 }}>{rec.route.distanceKm} km</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: DIM, textTransform: 'uppercase' }}>Distance</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: ACCENT2 }}>{rec.route.gpsCheckpoints}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: DIM, textTransform: 'uppercase' }}>Checkpoints</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: GREEN }}>{rec.route.routeDeviations}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: DIM, textTransform: 'uppercase' }}>Deviations</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RIGHT COLUMN — CONDITIONS & PROTECTION
══════════════════════════════════════════════════════════════════ */
function RightColumn({ rec }: { rec: typeof TRANSPORTATION_RECORD }) {
  return (
    <div style={{
      padding:  '10px 14px 10px 10px',
      display:  'flex', flexDirection: 'column', gap: 7,
      overflowY:'auto',
    }}>

      {/* ── COMBINED INFO ── */}
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.28 }}>
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
            {[
              { label: 'Temperature', value: rec.conditions.temperature },
              { label: 'Humidity',    value: rec.conditions.humidity },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, paddingTop: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0' }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
              Smart Insurance
            </div>
            <div style={{ background: 'rgba(232,196,74,0.1)', border: '1px solid rgba(232,196,74,0.3)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#e8c44a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Policy ID</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#f5e8a8' }}>{rec.insurance.policyId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#e8c44a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Coverage</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: '#f5e8a8' }}>{rec.insurance.coverage}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(232,196,74,0.2)', paddingTop: 10, marginTop: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: GREEN }}>{rec.insurance.transitStatus}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
              Ledger Record
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Block</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#f0f8f0' }}>{rec.ledger.blockNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Tx Hash</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: ACCENT }}>{rec.ledger.transactionId.substring(0, 16)}...</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── DOCUMENTS ── */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48, duration: 0.28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 7, padding: '4px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: 'var(--night-dim)' }}>
            DOCUMENT AVAILABLE IN FINAL PRODUCT RECORD
          </span>
        </div>
      </motion.div>
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
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT }}>
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
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: '0.12em', color, textTransform: 'uppercase' }}>{text}</span>
    </div>
  )
}

function MetaRow({ label, value, mono, verified, accent, last }: {
  label: string; value: string; mono?: boolean; verified?: boolean; accent?: string; last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
      padding: '3px 0', borderBottom: last ? 'none' : '1px solid rgba(124, 255, 79, 0.04)',
    }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: DIM, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
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
      borderBottom: last ? 'none' : '1px solid rgba(124, 255, 79, 0.04)',
    }}>
      {icon}
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: DIM, letterSpacing: '0.06em', minWidth: 72, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: '#d0c8f0', flex: 1 }}>
        {value}
      </span>
      {pass && (
        <div style={{
          width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(124, 255, 79,0.12)', border: '1px solid rgba(124, 255, 79,0.35)',
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
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, color: `${GOLD}80`, textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 7.5 : 8.5, color: '#f0e090' }}>{value}</div>
    </div>
  )
}

function LedgerRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      gap: 8, padding: '3.5px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: DIM }}>
        {icon} {label}
      </div>
      <div style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 8 : 9.5, color: '#c8c0e8', textAlign: 'right', wordBreak: 'break-all' }}>
        {value}
      </div>
    </div>
  )
}

/* ── Helper ─────────────────────────────────────────────────────── */
function shortDate(d: string): string {
  return d.replace(' August', ' Aug').replace(' 2026', '')
}

/* ─── Document Viewer Modal ─────────────────────────────────────── */
function DocumentModal({
  open, onClose
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          pointerEvents: 'auto',
          background: 'rgba(5,12,4,0.98)',
          border: `1px solid ${ACCENT}50`,
          borderRadius: 16,
          width: 'min(800px, 96vw)',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `0 28px 90px rgba(0,0,0,0.80), 0 0 60px ${ACCENT}20`,
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: `1px solid ${ACCENT}30`,
          background: `${ACCENT}0a`
        }}>
          <span style={{ fontFamily: "var(--font-display)", color: ACCENT2, fontSize: 14, fontWeight: 600 }}>Transit Insurance & Risk Report</span>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            }}
          >
            <X size={14} />
          </button>
        </div>
        
        <iframe
          src="/documents/stage3.pdf#toolbar=0"
          style={{ width: '100%', flex: 1, border: 'none' }}
          title="Transportation Document"
        />
      </motion.div>
    </div>
  )
}

/* ── Suppress unused import ─────────────────────────────────────── */
void AlertCircle
