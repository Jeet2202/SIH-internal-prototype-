import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, MapPin, FlaskConical, Factory, Truck, Package,
  Cpu, Clock, Globe, Hash, Leaf, FileText, AlertCircle,
  ShieldCheck, Microscope, TestTube, Boxes, TruckIcon,
  ThumbsUp, ArrowRight, X,
} from 'lucide-react'
import type {
  ProvenanceStage,
  FarmerStageData,
  LabStageData,
  ManufacturingStageData,
  TransportStageData,
  ProductStageData,
  LinkedDocument,
} from '../types/provenance'

/* ---------------------------------------------------------------------------
   StageDetailPanel — bottom-docked, full-width, 3-column provenance panel.

   Layout:
   ┌──────────────────┬──────────────────┬──────────────────────────────────┐
   │ COL 1 (30%)      │ COL 2 (35%)      │ COL 3 (35%)                      │
   │ Stage badge      │ Location / Map   │ About + stage-specific detail     │
   │ Key fields       │ Location chip    │ Documents list                    │
   │ Verification ✓   │ Stylised map     │ Blockchain record (PROTOTYPE tag) │
   └──────────────────┴──────────────────┴──────────────────────────────────┘
--------------------------------------------------------------------------- */

/* ── Location metadata ────────────────────────────────────────────── */
// Pulled directly from stage.data.location in the new data model.

/* ── Props ──────────────────────────────────────────────────────── */
interface StageDetailPanelProps {
  stage:   ProvenanceStage | null
  onClose: () => void
  hidden?: boolean
}

/* ══════════════════════════════════════════════════════════════════
   ROOT PANEL
══════════════════════════════════════════════════════════════════ */
export default function StageDetailPanel({ stage, onClose, hidden = false }: StageDetailPanelProps) {
  const [checksDone, setChecksDone] = useState(false)

  useEffect(() => {
    setChecksDone(false)
    if (stage) {
      const t = setTimeout(() => setChecksDone(true), 700)
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
          transition={{ duration: 0.50, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position:       'fixed',
            bottom:         0, left: 0, right: 0,
            zIndex:         40,
            maxHeight:      '44vh',
            overflowY:      'auto',
            background:     'rgba(4,10,3,0.96)',
            backdropFilter: 'blur(28px)',
            borderTop:      `1.5px solid ${stage.color}55`,
            boxShadow:      `0 -8px 60px rgba(0,0,0,0.75), 0 -1px 0 ${stage.color}22`,
            pointerEvents:  hidden ? 'none' : 'auto',
          }}
        >
          {/* Coloured top bar */}
          <div style={{
            height:     2,
            background: `linear-gradient(90deg, transparent, ${stage.color}70, ${stage.color}, ${stage.color}70, transparent)`,
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close stage panel"
            style={{
              position:   'absolute', top: 10, right: 14, zIndex: 50,
              width: 26, height: 26, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border:     '1px solid rgba(255,255,255,0.12)',
              display:    'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
              transition: 'all 0.2s',
            }}
          >
            <X size={13} />
          </button>

          {/* 3-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '30% 1fr 1fr', gap: 0, minHeight: 0 }}>
            <Column1 stage={stage} checksDone={checksDone} />
            <Column2 stage={stage} />
            <Column3 stage={stage} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════════════════════════════════
   COLUMN 1 — Stage identity + key fields + verification checks
══════════════════════════════════════════════════════════════════ */
function Column1({ stage, checksDone }: { stage: ProvenanceStage; checksDone: boolean }) {
  const d = stage.data

  return (
    <div style={{
      padding:     '16px 18px 16px 22px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display:     'flex', flexDirection: 'column', gap: 10,
      overflowY:   'auto',
    }}>
      {/* ─ Stage header ─ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.30 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
      >
        {/* Number badge */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: `${stage.color}18`, border: `1.5px solid ${stage.color}45`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Instrument Sans', sans-serif", fontSize: 17, fontWeight: 700,
            color: stage.color, textShadow: `0 0 10px ${stage.color}60`,
          }}>
            {stage.number}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 8,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: stage.color, marginBottom: 2,
          }}>
            {stage.subtitle}
          </div>
          <div style={{
            fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 700,
            color: '#e4ede0', lineHeight: 1.15,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {stage.title}
          </div>
        </div>

        {/* Verified pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
          background: 'rgba(126,200,90,0.12)', border: '1px solid rgba(126,200,90,0.30)',
          borderRadius: 999, padding: '3px 9px',
        }}>
          <Check size={8} color="#7ec85a" strokeWidth={3} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7.5, letterSpacing: '0.14em', color: '#9fda74', textTransform: 'uppercase' }}>
            Verified
          </span>
        </div>
      </motion.div>

      {/* Entity + date sub-row */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.14, duration: 0.28 }}
        style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}
      >
        <MicroTag icon={<ShieldCheck size={9} color={stage.color} />} text={d.entity} color={stage.color} />
        <MicroTag icon={<Clock size={9} color="var(--night-dim)" />}  text={d.date}   color="var(--night-dim)" />
      </motion.div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(to right, ${stage.color}40, transparent)` }} />

      {/* Stage-specific key-value rows */}
      <motion.div
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.30 }}
        style={{ flex: 1 }}
      >
        <StageKeyRows stage={stage} />
      </motion.div>

      {/* Verification checks */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28, duration: 0.28 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 5,
        }}>
          Verification checks
        </div>
        {d.checks.slice(0, 4).map((chk, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: checksDone ? 1 : 0, x: checksDone ? 0 : -5 }}
            transition={{ delay: 0.45 + i * 0.09, duration: 0.22 }}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 7,
              padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div style={{
              width: 15, height: 15, borderRadius: '50%', flexShrink: 0, marginTop: 1,
              background: `${stage.color}1e`, border: `1px solid ${stage.color}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={7} color={stage.color} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: '#d8e8d4', lineHeight: 1.35 }}>{chk.label}</div>
              {chk.detail && (
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: 'var(--night-dim)', marginTop: 1 }}>
                  {chk.detail}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   COLUMN 2 — Location / Map
══════════════════════════════════════════════════════════════════ */
function Column2({ stage }: { stage: ProvenanceStage }) {
  const loc = stage.data.location

  return (
    <div style={{
      padding:     '16px 16px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display:     'flex', flexDirection: 'column', gap: 10,
      overflowY:   'auto',
    }}>
      {/* Location header */}
      <motion.div
        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.30 }}
      >
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: '0.20em',
          textTransform: 'uppercase', color: stage.color, marginBottom: 4,
        }}>
          {loc.label}
        </div>
        <div style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 14, fontWeight: 600,
          color: '#e4ede0', marginBottom: 3,
        }}>
          {loc.city}, {loc.state}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: 'var(--night-dim)',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <MapPin size={9} color="var(--night-dim)" />
          {loc.lat.toFixed(4)}° N, {loc.lng.toFixed(4)}° E
        </div>
      </motion.div>

      {/* Stylised map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.26, duration: 0.38 }}
        style={{
          flex: 1, minHeight: 100, borderRadius: 14, overflow: 'hidden',
          position: 'relative', border: `1px solid ${stage.color}25`,
        }}
      >
        {/* Dark satellite-like base */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 32% 42%, #0a1f06 0%, #050d02 60%)',
        }} />
        {/* Grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
          <defs>
            <pattern id={`grid-${stage.id}`} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke={stage.color} strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${stage.id})`} />
        </svg>
        {/* "Roads" — unique per stage based on id */}
        <StageMapRoads stageId={stage.id} color={stage.color} />
        {/* Pin */}
        <div style={{ position: 'absolute', top: '42%', left: '48%', transform: 'translate(-50%,-100%)' }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
            background: stage.color, boxShadow: `0 0 12px ${stage.color}90, 0 0 24px ${stage.color}50`,
          }} />
        </div>
        <div style={{
          position: 'absolute', top: '42%', left: '48%', transform: 'translate(-50%,-50%)',
          width: 30, height: 30, borderRadius: '50%',
          border: `1.5px solid ${stage.color}55`,
          animation: 'pulse-ring 2.2s ease-in-out infinite',
        }} />
        {/* Footer chip */}
        <div style={{
          position: 'absolute', bottom: 7, left: 8, right: 8,
          background: 'rgba(4,10,3,0.80)', borderRadius: 8, padding: '5px 9px',
          backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <MapPin size={8} color={stage.color} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, color: '#9fda74', letterSpacing: '0.06em' }}>
            {loc.city}, {loc.state}, {loc.country}
          </span>
        </div>
      </motion.div>

      {/* Entity type chip */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.38, duration: 0.25 }}
        style={{
          background: `${stage.color}0e`, border: `1px solid ${stage.color}25`,
          borderRadius: 10, padding: '8px 12px',
        }}
      >
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: stage.color,
          letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3,
        }}>
          Responsible Entity
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#d4e8ce' }}>
          {stage.data.entity}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: 'var(--night-dim)', marginTop: 2 }}>
          {stage.data.entityType}
        </div>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   COLUMN 3 — Description + Documents + Blockchain
══════════════════════════════════════════════════════════════════ */
function Column3({ stage }: { stage: ProvenanceStage }) {
  const d = stage.data
  return (
    <div style={{
      padding: '16px 20px 16px 14px', display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto',
    }}>
      {/* About card */}
      <motion.div
        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.30 }}
        style={{
          background: 'rgba(255,255,255,0.025)', border: `1px solid ${stage.color}1e`,
          borderRadius: 13, padding: '12px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: `${stage.color}20`, border: `1px solid ${stage.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <StageIconSmall type={stage.type} color={stage.color} />
          </div>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: stage.color,
          }}>
            About This Stage
          </span>
        </div>
        <p style={{ fontSize: 11, color: '#b8d8b2', lineHeight: 1.60, fontFamily: "'Inter', sans-serif" }}>
          {d.description}
        </p>
      </motion.div>

      {/* Stage-specific extra content (lab results, transport metrics, etc.) */}
      <StageExtraContent stage={stage} />

      {/* Documents */}
      <motion.div
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.28 }}
        style={{
          background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 13, padding: '11px 14px',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
        }}>
          <FileText size={10} color="var(--night-dim)" />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--night-dim)' }}>
            Linked Documents
          </span>
          <span style={{
            marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: 7,
            letterSpacing: '0.10em', color: 'rgba(255,165,0,0.55)', textTransform: 'uppercase',
          }}>
            ⚠ PROTOTYPE RECORDS
          </span>
        </div>
        {d.documents.slice(0, 4).map((doc, i) => (
          <DocRow key={i} doc={doc} />
        ))}
      </motion.div>

      {/* Blockchain record */}
      <motion.div
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.28 }}
        style={{
          background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(126,200,90,0.16)',
          borderRadius: 13, padding: '11px 14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
          <Cpu size={10} color="#7ec85a" />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7ec85a' }}>
            Ledger Record
          </span>
          <span style={{
            marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: 7,
            color: 'rgba(126,200,90,0.45)', textTransform: 'uppercase', letterSpacing: '0.10em',
          }}>
            PROTOTYPE DEMO
          </span>
        </div>
        <BCRow icon={<Hash size={8}  color="var(--night-dim)" />} label="TX Hash"     value={d.blockchain.txHash}    mono />
        <BCRow icon={<Cpu  size={8}  color="var(--night-dim)" />} label="Block"       value={d.blockchain.blockNum}  mono />
        <BCRow icon={<Clock size={8} color="var(--night-dim)" />} label="Timestamp"   value={d.blockchain.timestamp}      />
        <BCRow icon={<Globe size={8} color="var(--night-dim)" />} label="Network"     value={d.blockchain.network}   last />
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   STAGE-SPECIFIC EXTRA CONTENT (Column 3 middle card, varies by type)
══════════════════════════════════════════════════════════════════ */
function StageExtraContent({ stage }: { stage: ProvenanceStage }) {
  switch (stage.type) {
    case 'lab':
      return <LabResultsCard data={stage.data as LabStageData} color={stage.color} />
    case 'transport':
      return <TransportMetricsCard data={stage.data as TransportStageData} color={stage.color} />
    case 'manufacturing':
      return <MfgStepsCard data={stage.data as ManufacturingStageData} color={stage.color} />
    case 'farmer':
      return <FarmerDetailCard data={stage.data as FarmerStageData} color={stage.color} />
    case 'product':
      return <ProductChainCard data={stage.data as ProductStageData} color={stage.color} />
    default:
      return null
  }
}

function LabResultsCard({ data, color }: { data: LabStageData; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <Microscope size={10} color={color} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
          Test Results Summary
        </span>
      </div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#9fda74',
        padding: '5px 9px', background: 'rgba(126,200,90,0.08)', borderRadius: 7,
        marginBottom: 7, letterSpacing: '0.06em',
      }}>
        Withanolide content: {data.withanolideContent}
      </div>
      {data.results.slice(0, 4).map((r, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, color: 'var(--night-dim)', flexShrink: 0 }}>{r.label}</span>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#e0eedc' }}>
              {r.value}{r.unit ? ` ${r.unit}` : ''}
            </span>
            {r.limit && (
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7.5, color: 'var(--night-dim)' }}>
                limit {r.limit}
              </div>
            )}
          </div>
          <Check size={8} color={color} strokeWidth={3} style={{ marginLeft: 5, marginTop: 2, flexShrink: 0 }} />
        </div>
      ))}
    </motion.div>
  )
}

function TransportMetricsCard({ data, color }: { data: TransportStageData; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <TruckIcon size={10} color={color} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
          Transit Conditions
        </span>
      </div>
      {/* Route summary */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, color: '#d4e8ce',
        padding: '5px 9px', background: `${color}0d`, borderRadius: 7, marginBottom: 7,
      }}>
        <span style={{ color }}>{data.origin.split(',')[0]}</span>
        <ArrowRight size={9} color="var(--night-dim)" />
        <span style={{ color }}>{data.destination.split(',')[0]}</span>
        <span style={{ color: 'var(--night-dim)', marginLeft: 'auto' }}>{data.distanceKm} km</span>
      </div>
      {data.metrics.slice(0, 5).map((m, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, color: 'var(--night-dim)' }}>{m.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#e0eedc' }}>{m.value}</span>
            <Check size={7} color={color} strokeWidth={3} />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function MfgStepsCard({ data, color }: { data: ManufacturingStageData; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <Boxes size={10} color={color} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
          Process Steps
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: 'var(--night-dim)' }}>
          {data.steps.length} steps
        </span>
      </div>
      {/* Dosage info */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, color: '#9fda74',
        padding: '4px 9px', background: `${color}0d`, borderRadius: 7, marginBottom: 7,
      }}>
        {data.dosagePerUnit} per tablet · {data.tabletCount} tablets/bottle
      </div>
      {data.steps.slice(0, 4).map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'flex-start', gap: 7,
          padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 1,
            background: `${color}18`, border: `1px solid ${color}45`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, color,
          }}>
            {s.step}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: '#d8e8d4' }}>{s.name}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7.5, color: 'var(--night-dim)', marginTop: 1 }}>
              {s.detail}
            </div>
          </div>
          <Check size={7} color={color} strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
        </div>
      ))}
    </motion.div>
  )
}

function FarmerDetailCard({ data, color }: { data: FarmerStageData; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <Leaf size={10} color={color} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
          Botanical Details
        </span>
      </div>
      <SRow label="Species"        value={`${data.species} (${data.botanicalName})`} />
      <SRow label="Part Used"      value={data.partUsed}          />
      <SRow label="Cultivation"    value={data.cultivationType}   />
      <SRow label="Season"         value={data.harvestSeason}     />
      <SRow label="Soil Status"    value={data.soilHealthStatus}  />
      <SRow label="Coop Reg."      value={data.farmerCooperative.split('·')[0].trim()} />
    </motion.div>
  )
}

function ProductChainCard({ data, color }: { data: ProductStageData; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <ThumbsUp size={10} color={color} />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
          Chain Summary
        </span>
        <span style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: '#9fda74',
        }}>
          <ShieldCheck size={9} color="#9fda74" /> 5 / 5 verified
        </span>
      </div>
      {data.chainSummary.map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div>
            <div style={{ fontSize: 10, color: '#d8e8d4' }}>{s.stage}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7.5, color: 'var(--night-dim)' }}>{s.eventId}</div>
          </div>
          <Check size={9} color={color} strokeWidth={3} />
        </div>
      ))}
      {/* Pack serial */}
      <div style={{
        marginTop: 8, padding: '6px 9px', background: `${color}0d`,
        borderRadius: 7, fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, color: '#9fda74',
      }}>
        Pack: {data.packSerial} · {data.tabletCount} tablets · Exp. {data.expiry}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   COLUMN 1: Stage-specific key-value rows (left column bottom section)
══════════════════════════════════════════════════════════════════ */
function StageKeyRows({ stage }: { stage: ProvenanceStage }) {
  switch (stage.type) {
    case 'farmer': {
      const d = stage.data as FarmerStageData
      return (
        <div>
          <KV label="Collection Hub" value={d.collectionHub}      c={stage.color} />
          <KV label="Batch ID"       value={d.batchId}            c={stage.color} mono />
          <KV label="Quantity"       value={d.totalCollection}    c={stage.color} />
          <KV label="Contributors"   value={`${d.farmerCount} registered farmers`} c={stage.color} />
          <KV label="Licence"        value={d.collectorLicense.split('·')[0].trim()} c={stage.color} mono />
        </div>
      )
    }
    case 'lab': {
      const d = stage.data as LabStageData
      return (
        <div>
          <KV label="Laboratory"     value={d.labName}            c={stage.color} />
          <KV label="Accreditation"  value={d.accreditation}      c={stage.color} />
          <KV label="Sample ID"      value={d.sampleId}           c={stage.color} mono />
          <KV label="Certificate"    value={d.certificateId}      c={stage.color} mono />
          <KV label="Test Period"    value={d.testDate}           c={stage.color} />
        </div>
      )
    }
    case 'transport': {
      const d = stage.data as TransportStageData
      return (
        <div>
          <KV label="Carrier"        value={d.carrier}            c={stage.color} />
          <KV label="Vehicle"        value={d.vehicleId}          c={stage.color} mono />
          <KV label="Pickup"         value={d.pickupDate}         c={stage.color} />
          <KV label="Delivery"       value={d.deliveryDate}       c={stage.color} />
          <KV label="Condition"      value={d.storageCondition}   c={stage.color} />
        </div>
      )
    }
    case 'manufacturing': {
      const d = stage.data as ManufacturingStageData
      return (
        <div>
          <KV label="Manufacturer"   value={d.manufacturer}       c={stage.color} />
          <KV label="MFG Licence"    value={d.facilityLicense.split('·')[0].trim()} c={stage.color} mono />
          <KV label="GMP Cert."      value={d.gmpCertificate.split('·')[0].trim()}  c={stage.color} mono />
          <KV label="Input Batch"    value={d.inputBatch}         c={stage.color} mono />
          <KV label="Output Batch"   value={d.outputBatch}        c={stage.color} mono />
        </div>
      )
    }
    case 'product': {
      const d = stage.data as ProductStageData
      return (
        <div>
          <KV label="Product"        value={d.productName}        c={stage.color} />
          <KV label="Brand"          value={d.brand}              c={stage.color} />
          <KV label="SKU"            value={d.skuCode}            c={stage.color} mono />
          <KV label="Pack Serial"    value={d.packSerial}         c={stage.color} mono />
          <KV label="Manufactured"   value={d.manufactured}       c={stage.color} />
          <KV label="Expiry"         value={d.expiry}             c={stage.color} />
        </div>
      )
    }
  }
}

/* ══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════════════ */

function KV({ label, value, c, mono }: { label: string; value: string; c: string; mono?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 8,
    }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: 'var(--night-dim)', flexShrink: 0, paddingTop: 1,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif",
        fontSize: mono ? 9 : 10.5, color: '#e0eedc', textAlign: 'right',
      }}>
        {value}
        {' '}
        <Check size={7} color={c} strokeWidth={3} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </span>
    </div>
  )
}

function SRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 8,
    }}>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7.5, color: 'var(--night-dim)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9.5, color: '#d8e8d4', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function MicroTag({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 999, padding: '3px 9px',
      fontFamily: "'Inter', sans-serif", fontSize: 10, color,
      maxWidth: '100%', overflow: 'hidden',
    }}>
      {icon}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  )
}

function DocRow({ doc }: { doc: LinkedDocument }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <FileText size={8} color="rgba(255,165,0,0.55)" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: '#c8dcc4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {doc.label}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7.5, color: 'var(--night-dim)' }}>
          {doc.ref}
          {doc._proto && <span style={{ color: 'rgba(255,165,0,0.45)', marginLeft: 5 }}>[prototype]</span>}
        </div>
      </div>
    </div>
  )
}

function BCRow({ icon, label, value, mono, last }: {
  icon: React.ReactNode; label: string; value: string; mono?: boolean; last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: 8, padding: '5px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: 'var(--night-dim)',
      }}>
        {icon} {label}
      </div>
      <div style={{
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "'Inter', sans-serif",
        fontSize: mono ? 9 : 10.5, color: '#c8e0c4', textAlign: 'right', wordBreak: 'break-all',
      }}>
        {value}
      </div>
    </div>
  )
}

/* ── Stage icons (small, Column 3 header) ───────────────────────── */
function StageIconSmall({ type, color }: { type: string; color: string }) {
  const p = { size: 11, color, strokeWidth: 2 }
  switch (type) {
    case 'farmer':        return <Leaf         {...p} />
    case 'lab':           return <FlaskConical {...p} />
    case 'manufacturing': return <Factory      {...p} />
    case 'transport':     return <Truck        {...p} />
    case 'product':       return <Package      {...p} />
    default:              return <Package      {...p} />
  }
}

/* ── Unique map "roads" per stage ───────────────────────────────── */
function StageMapRoads({ stageId, color }: { stageId: string; color: string }) {
  const configs: Record<string, React.ReactNode> = {
    farmer: (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}>
        <path d="M 0,65 C 40,60 80,55 130,62 S 200,58 240,55" fill="none" stroke={color} strokeWidth="1.5"/>
        <path d="M 60,10 L 62,90"     fill="none" stroke={color} strokeWidth="0.9"/>
        <path d="M 100,5 Q 105,45 100,90" fill="none" stroke={color} strokeWidth="0.7"/>
        <path d="M 0,40 L 200,38"    fill="none" stroke={color} strokeWidth="0.7"/>
      </svg>
    ),
    lab: (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}>
        <path d="M 20,50 L 220,50"   fill="none" stroke={color} strokeWidth="1.5"/>
        <path d="M 20,30 L 220,30"   fill="none" stroke={color} strokeWidth="0.8"/>
        <path d="M 20,70 L 220,70"   fill="none" stroke={color} strokeWidth="0.8"/>
        <path d="M 80,5 L 80,95"     fill="none" stroke={color} strokeWidth="0.9"/>
        <path d="M 140,5 L 140,95"   fill="none" stroke={color} strokeWidth="0.7"/>
      </svg>
    ),
    transport: (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}>
        {/* NH-52 / route style */}
        <path d="M -5,62 Q 60,55 120,58 T 250,52" fill="none" stroke={color} strokeWidth="2.0"/>
        <path d="M -5,72 Q 60,65 120,68 T 250,62" fill="none" stroke={color} strokeWidth="0.6" strokeDasharray="4 4"/>
        <path d="M 50,5 L 52,95"  fill="none" stroke={color} strokeWidth="0.8"/>
        <path d="M 175,5 L 178,95" fill="none" stroke={color} strokeWidth="0.8"/>
      </svg>
    ),
    manufacturing: (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}>
        <rect x="30" y="25" width="60" height="45" fill="none" stroke={color} strokeWidth="0.8"/>
        <rect x="110" y="30" width="45" height="38" fill="none" stroke={color} strokeWidth="0.6"/>
        <path d="M 0,78 L 240,78"   fill="none" stroke={color} strokeWidth="1.2"/>
        <path d="M 0,15 L 240,15"   fill="none" stroke={color} strokeWidth="0.7"/>
      </svg>
    ),
    product: (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }}>
        <path d="M 0,55 L 240,55"   fill="none" stroke={color} strokeWidth="1.4"/>
        <path d="M 0,35 L 240,35"   fill="none" stroke={color} strokeWidth="0.7"/>
        <path d="M 0,75 L 240,75"   fill="none" stroke={color} strokeWidth="0.7"/>
        <circle cx="120" cy="55" r="18" fill="none" stroke={color} strokeWidth="0.8"/>
        <circle cx="120" cy="55" r="8"  fill="none" stroke={color} strokeWidth="0.6"/>
      </svg>
    ),
  }
  return <>{configs[stageId] ?? configs['farmer']}</>
}

/* ── unused icon imports kept to avoid lint errors ───────────────── */
void AlertCircle
void TestTube
