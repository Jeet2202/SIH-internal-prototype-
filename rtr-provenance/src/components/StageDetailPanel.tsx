import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, MapPin, FlaskConical, Factory, Truck, Package,
  Cpu, Clock, Globe, Hash,
} from 'lucide-react'
import type {
  ProvenanceStage, FarmerStageData, LabStageData,
  ManufacturingStageData, TransportStageData, ProductStageData
} from '../types/provenance'

/* ---------------------------------------------------------------------------
   StageDetailPanel — bottom-docked, full-width, 3-column provenance panel

   Matches IMAGE 1 layout:
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ [COL 1 — 30%]            [COL 2 — 35%]         [COL 3 — 35%]          │
   │  Stage # + Title          Location / Map         About This Stage       │
   │  Stage avatar             Map preview            Blockchain Record      │
   │  Key-value rows           Coordinates            TX ID / Block / Time   │
   │  Verification checks                                                     │
   └─────────────────────────────────────────────────────────────────────────┘
--------------------------------------------------------------------------- */

/* Hardcoded blockchain demo data per stage */
const BLOCKCHAIN_DATA: Record<string, {
  txId: string; block: string; timestamp: string; network: string
}> = {
  farmer: {
    txId: '0x7d3f...a9b210',
    block: '4587123',
    timestamp: '20 Aug 2026, 09:14 AM IST',
    network: 'Ethereum (Permissioned)',
  },
  lab: {
    txId: '0x2c8a...f3d901',
    block: '4587456',
    timestamp: '22 Aug 2026, 11:38 AM IST',
    network: 'Ethereum (Permissioned)',
  },
  manufacturing: {
    txId: '0xa14e...c6b732',
    block: '4588902',
    timestamp: '24 Aug 2026, 08:22 AM IST',
    network: 'Ethereum (Permissioned)',
  },
  transport: {
    txId: '0x5f9c...e2a445',
    block: '4589211',
    timestamp: '24 Aug 2026, 03:47 PM IST',
    network: 'Ethereum (Permissioned)',
  },
  product: {
    txId: '0xb82d...17c893',
    block: '4589890',
    timestamp: '25 Aug 2026, 02:05 PM IST',
    network: 'Ethereum (Permissioned)',
  },
}

const STAGE_ABOUT: Record<string, string> = {
  farmer: 'Herb is collected from 27 verified farmers in approved GPS zones, cross-checked for species identity, quantity, and seasonal compliance before any batch is recorded.',
  lab: 'Batch samples undergo NABL-accredited multi-parameter testing — species ID via DNA barcoding, heavy metals, pesticide residue, and moisture — before a numbered certificate is issued.',
  manufacturing: 'Raw material is traceable step-by-step through drying, grinding, capsule formulation, and packaging at a licensed GMP facility with yield tracking at every stage.',
  transport: 'Cold chain and route integrity monitored end-to-end via IoT sensors. Any temperature deviation or route anomaly would have been flagged and logged.',
  product: 'The finished product pack is linked to the full provenance chain. The QR code on this pack uniquely identifies it and cannot be reused or duplicated.',
}

const LOCATION_INFO: Record<string, { city: string; state: string; coords: string; label: string }> = {
  farmer:        { city: 'Khedgaon', state: 'Maharashtra', coords: '19.9975° N, 73.7898° E', label: 'Collection Hub' },
  lab:           { city: 'Nashik', state: 'Maharashtra', coords: '19.9975° N, 73.7898° E', label: 'Laboratory' },
  manufacturing: { city: 'Nashik', state: 'Maharashtra', coords: '20.0059° N, 73.7897° E', label: 'Facility' },
  transport:     { city: 'Mumbai', state: 'Maharashtra', coords: '19.0760° N, 72.8777° E', label: 'Distribution Centre' },
  product:       { city: 'Mumbai', state: 'Maharashtra', coords: '19.0760° N, 72.8777° E', label: 'Verified Product' },
}

/* ─── Props ──────────────────────────────────────────────────── */

interface StageDetailPanelProps {
  stage: ProvenanceStage | null
  onClose: () => void
  hidden?: boolean   // set true when ReviewModal is open
}

/* ─── Panel ──────────────────────────────────────────────────── */

export default function StageDetailPanel({ stage, onClose, hidden = false }: StageDetailPanelProps) {
  const [checksDone, setChecksDone] = useState(false)

  useEffect(() => {
    setChecksDone(false)
    if (stage) {
      const t = setTimeout(() => setChecksDone(true), 900)
      return () => clearTimeout(t)
    }
  }, [stage?.id])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence mode="wait">
      {stage && (
        <motion.div
          key={stage.id}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: hidden ? 0 : 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            maxHeight: '42vh',
            overflowY: 'auto',
            background: 'rgba(4,10,3,0.94)',
            backdropFilter: 'blur(24px)',
            borderTop: `1.5px solid ${stage.color}50`,
            boxShadow: `0 -8px 60px rgba(0,0,0,0.7), 0 -1px 0 ${stage.color}20`,
            pointerEvents: hidden ? 'none' : 'auto',
          }}
        >
          {/* ── Thin colored top accent bar ── */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${stage.color}80, ${stage.color}, ${stage.color}80, transparent)`,
          }} />

          {/* ── Panel inner ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '30% 1fr 1fr',
            gap: 0,
            minHeight: 0,
          }}>
            {/* ─── COLUMN 1: Stage Details ─── */}
            <Column1 stage={stage} checksDone={checksDone} onClose={onClose} />

            {/* ─── COLUMN 2: Location / Map ─── */}
            <Column2 stage={stage} />

            {/* ─── COLUMN 3: About + Blockchain ─── */}
            <Column3 stage={stage} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Column 1: Stage details ─────────────────────────────────── */

function Column1({ stage, checksDone, onClose }: {
  stage: ProvenanceStage
  checksDone: boolean
  onClose: () => void
}) {
  return (
    <div style={{
      padding: '18px 20px 18px 24px',
      borderRight: `1px solid rgba(255,255,255,0.06)`,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      overflowY: 'auto',
    }}>
      {/* Stage header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        {/* Stage number badge */}
        <div style={{
          width: 40, height: 40,
          borderRadius: 11,
          background: `${stage.color}18`,
          border: `1.5px solid ${stage.color}45`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 18, fontWeight: 700,
            color: stage.color,
            textShadow: `0 0 10px ${stage.color}60`,
          }}>
            {stage.number}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 8.5, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: stage.color,
            marginBottom: 2,
          }}>
            {stage.subtitle}
          </div>
          <div style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 16, fontWeight: 700, color: '#e4ede0',
            lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {stage.title}
          </div>
        </div>

        {/* Verified pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'rgba(126,200,90,0.12)',
          border: '1px solid rgba(126,200,90,0.30)',
          borderRadius: 999, padding: '3px 10px', flexShrink: 0,
        }}>
          <Check size={9} color="#7ec85a" strokeWidth={3} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 8, letterSpacing: '0.14em',
            color: '#9fda74', textTransform: 'uppercase',
          }}>
            Verified
          </span>
        </div>
      </motion.div>

      {/* Thin colored divider */}
      <div style={{
        height: 1,
        background: `linear-gradient(to right, ${stage.color}40, transparent)`,
      }} />

      {/* Stage-specific content */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.35 }}
        style={{ flex: 1 }}
      >
        <StageDataRows stage={stage} />
      </motion.div>

      {/* Verification checks — staggered */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 8.5, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--night-dim)',
          marginBottom: 6,
        }}>
          Verification
        </div>
        {stage.data.checks.slice(0, 3).map((check, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: checksDone ? 1 : 0, x: checksDone ? 0 : -6 }}
            transition={{ delay: 0.5 + i * 0.10, duration: 0.25 }}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '5px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: `${stage.color}1e`,
              border: `1px solid ${stage.color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
            }}>
              <Check size={8} color={stage.color} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#d8e8d4' }}>{check.label}</div>
              {check.detail && (
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 8.5, color: 'var(--night-dim)', marginTop: 1,
                }}>
                  {check.detail}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Column 2: Location / Map ─────────────────────────────────── */

function Column2({ stage }: { stage: ProvenanceStage }) {
  const loc = LOCATION_INFO[stage.id] || LOCATION_INFO['farmer']

  return (
    <div style={{
      padding: '18px 18px',
      borderRight: `1px solid rgba(255,255,255,0.06)`,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      overflowY: 'auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 8.5, letterSpacing: '0.20em',
          textTransform: 'uppercase', color: stage.color, marginBottom: 4,
        }}>
          {loc.label}
        </div>
        <div style={{
          fontFamily: "'Instrument Sans', sans-serif",
          fontSize: 14, fontWeight: 600, color: '#e4ede0', marginBottom: 2,
        }}>
          {loc.city}, {loc.state}, India
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9.5, color: 'var(--night-dim)',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <MapPin size={10} color="var(--night-dim)" />
          {loc.coords}
        </div>
      </motion.div>

      {/* Stylized map placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        style={{
          flex: 1,
          minHeight: 100,
          borderRadius: 14,
          overflow: 'hidden',
          position: 'relative',
          border: `1px solid ${stage.color}25`,
        }}
      >
        {/* Satellite-style dark map */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 30% 40%, #0a1f06 0%, #050e03 60%),
            radial-gradient(ellipse at 70% 60%, #08180504 0%, transparent 70%)
          `,
        }} />
        {/* Grid lines simulating map tiles */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
          <defs>
            <pattern id="mapgrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={stage.color} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)" />
        </svg>
        {/* Stylized "roads" */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.20 }}>
          <path d="M 10,70 Q 60,55 120,65 T 220,60" fill="none" stroke={stage.color} strokeWidth="1.5"/>
          <path d="M 50,20 L 55,90" fill="none" stroke={stage.color} strokeWidth="1"/>
          <path d="M 80,10 Q 90,50 85,90" fill="none" stroke={stage.color} strokeWidth="0.8"/>
          <path d="M 20,45 L 200,40" fill="none" stroke={stage.color} strokeWidth="0.8"/>
        </svg>
        {/* Location pin */}
        <div style={{
          position: 'absolute',
          top: '42%', left: '48%',
          transform: 'translate(-50%, -100%)',
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            background: stage.color,
            boxShadow: `0 0 14px ${stage.color}90, 0 0 28px ${stage.color}50`,
          }} />
        </div>
        {/* Pulse ring */}
        <div style={{
          position: 'absolute',
          top: '42%', left: '48%',
          transform: 'translate(-50%, -50%)',
          width: 32, height: 32, borderRadius: '50%',
          border: `1.5px solid ${stage.color}60`,
          animation: 'pulse-ring 2.2s ease-in-out infinite',
        }} />
        {/* Location name overlay */}
        <div style={{
          position: 'absolute', bottom: 8, left: 10, right: 10,
          background: 'rgba(4,10,3,0.75)',
          borderRadius: 8, padding: '5px 10px',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, color: '#9fda74', letterSpacing: '0.08em',
          }}>
            📍 {loc.city}, {loc.state}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Column 3: About + Blockchain ─────────────────────────────── */

function Column3({ stage }: { stage: ProvenanceStage }) {
  const bc = BLOCKCHAIN_DATA[stage.id] || BLOCKCHAIN_DATA['farmer']
  const about = STAGE_ABOUT[stage.id] || ''

  return (
    <div style={{
      padding: '18px 24px 18px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      overflowY: 'auto',
    }}>
      {/* About This Stage card */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.35 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${stage.color}22`,
          borderRadius: 14,
          padding: '14px 16px',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 8,
            background: `${stage.color}20`,
            border: `1px solid ${stage.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <StageIconSmall type={stage.type} color={stage.color} />
          </div>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: stage.color,
          }}>
            About This Stage
          </span>
        </div>
        <p style={{
          fontSize: 11.5, color: '#c0d8ba', lineHeight: 1.6,
          fontFamily: "'Inter', sans-serif",
        }}>
          {about}
        </p>
      </motion.div>

      {/* Blockchain Record card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.35 }}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(126,200,90,0.18)',
          borderRadius: 14,
          padding: '14px 16px',
          flex: 1,
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12,
        }}>
          <Cpu size={11} color="#7ec85a" />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#7ec85a',
          }}>
            Blockchain Record
          </span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 7.5, letterSpacing: '0.12em',
            color: 'rgba(126,200,90,0.5)', textTransform: 'uppercase',
          }}>
            PROTOTYPE DEMO
          </span>
        </div>

        {/* TX ID row */}
        <BlockchainRow
          icon={<Hash size={9} color="var(--night-dim)" />}
          label="Transaction ID"
          value={bc.txId}
          mono
        />
        <BlockchainRow
          icon={<Cpu size={9} color="var(--night-dim)" />}
          label="Block Number"
          value={bc.block}
          mono
        />
        <BlockchainRow
          icon={<Clock size={9} color="var(--night-dim)" />}
          label="Timestamp"
          value={bc.timestamp}
        />
        <BlockchainRow
          icon={<Globe size={9} color="var(--night-dim)" />}
          label="Network"
          value={bc.network}
          last
        />
      </motion.div>
    </div>
  )
}

/* ─── Column 3 helpers ──────────────────────────────────────────── */

function BlockchainRow({ icon, label, value, mono, last }: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
  last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 8, padding: '6px 0',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: 'var(--night-dim)',
      }}>
        {icon} {label}
      </div>
      <div style={{
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif",
        fontSize: mono ? 9.5 : 11,
        color: '#c8e0c4',
        textAlign: 'right',
        wordBreak: 'break-all',
      }}>
        {value}
      </div>
    </div>
  )
}

function StageIconSmall({ type, color }: { type: string; color: string }) {
  const props = { size: 12, color, strokeWidth: 2 }
  switch (type) {
    case 'farmer':        return <Package {...props} />
    case 'lab':           return <FlaskConical {...props} />
    case 'manufacturing': return <Factory {...props} />
    case 'transport':     return <Truck {...props} />
    case 'product':       return <Package {...props} />
    default:              return <Package {...props} />
  }
}

/* ─── Column 1: Stage-specific data rows ───────────────────────── */

function StageDataRows({ stage }: { stage: ProvenanceStage }) {
  switch (stage.type) {
    case 'farmer':        return <FarmerRows data={stage.data as FarmerStageData} color={stage.color} />
    case 'lab':           return <LabRows data={stage.data as LabStageData} color={stage.color} />
    case 'manufacturing': return <MfgRows data={stage.data as ManufacturingStageData} color={stage.color} />
    case 'transport':     return <TransportRows data={stage.data as TransportStageData} color={stage.color} />
    case 'product':       return <ProductRows data={stage.data as ProductStageData} color={stage.color} />
  }
}

function FarmerRows({ data, color }: { data: FarmerStageData; color: string }) {
  return (
    <div>
      <DR label="Collection Hub" value={data.collectionHub} color={color} />
      <DR label="Location"       value={data.location}     color={color} />
      <DR label="Species"        value={`${data.species} (${data.botanicalName})`} color={color} italic />
      <DR label="Date"           value={data.collectionDate} color={color} />
      <DR label="Quantity"       value={data.totalCollection} color={color} />
      <DR label="Batch ID"       value={data.batchId}     color={color} mono />
      <DR label="Contributors"   value={`${data.farmerCount} farmers`} color={color} />
    </div>
  )
}

function LabRows({ data, color }: { data: LabStageData; color: string }) {
  return (
    <div>
      <DR label="Laboratory"    value={data.labName}        color={color} />
      <DR label="Accreditation" value={data.accreditation}  color={color} />
      <DR label="Sample ID"     value={data.sampleId}       color={color} mono />
      <DR label="Test Date"     value={data.testDate}       color={color} />
      <DR label="Certificate"   value={data.certificateId}  color={color} mono />
    </div>
  )
}

function MfgRows({ data, color }: { data: ManufacturingStageData; color: string }) {
  return (
    <div>
      <DR label="Manufacturer"  value={data.manufacturer} color={color} />
      <DR label="Input Batch"   value={data.inputBatch}   color={color} mono />
      <DR label="Output Batch"  value={data.outputBatch}  color={color} mono />
      <DR label="Processing Steps" value={`${data.steps.length} steps tracked`} color={color} />
    </div>
  )
}

function TransportRows({ data, color }: { data: TransportStageData; color: string }) {
  return (
    <div>
      <DR label="Partner"      value={data.partner}     color={color} />
      <DR label="Pickup Date"  value={data.pickupDate}  color={color} />
      <DR label="Destination"  value={data.destination} color={color} />
      {data.metrics.slice(0, 3).map((m, i) => (
        <DR key={i} label={m.label} value={m.value} color={color} />
      ))}
    </div>
  )
}

function ProductRows({ data, color }: { data: ProductStageData; color: string }) {
  return (
    <div>
      <DR label="Product"  value={data.productName}  color={color} />
      <DR label="Brand"    value={data.brand}        color={color} />
      <DR label="Batch"    value={data.batch}        color={color} mono />
      <DR label="Pack"     value={data.packSerial}   color={color} mono />
      <DR label="Mfg"      value={data.manufactured} color={color} />
      <DR label="Expiry"   value={data.expiry}       color={color} />
    </div>
  )
}

/* ─── Detail row primitive ─────────────────────────────────────── */

function DR({ label, value, mono, italic, color }: {
  label: string; value: string; mono?: boolean; italic?: boolean; color: string
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '5px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 10,
    }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 8.5, letterSpacing: '0.10em', textTransform: 'uppercase',
        color: 'var(--night-dim)', flexShrink: 0, paddingTop: 1,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif",
        fontSize: mono ? 9.5 : 11,
        color: '#e0eedc',
        fontStyle: italic ? 'italic' : 'normal',
        textAlign: 'right',
      }}>
        {value}
        {' '}
        <Check size={8} color={color} strokeWidth={3} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </span>
    </div>
  )
}
