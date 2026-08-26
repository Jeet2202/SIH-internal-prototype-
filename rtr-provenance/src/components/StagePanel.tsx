import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, MapPin, FlaskConical, Factory, Truck, Package, Award } from 'lucide-react'
import type {
  ProvenanceStage, FarmerStageData, LabStageData,
  ManufacturingStageData, TransportStageData, ProductStageData
} from '../types/provenance'
import MapModal from './MapModal'
import CertificateModal from './CertificateModal'

/* ---------------------------------------------------------------------------
   StagePanel — LEFT-SIDE glass panel that slides in when a node is selected.
   
   Layout:
   ┌──────────────────────┐          3D DNA (still visible)
   │ 01 / FARMER          │              ●
   │ PROOF OF ORIGIN      │             / stem
   │                      │       [FARMER NODE]
   │ Collection Hub       │
   │ Khedgaon...          │
   │ Species: Ashwagandha │
   │                      │
   │ ✓ GPS Verified       │
   │ ✓ Species Verified   │
   │                      │
   │ [MAP] [CERTIFICATE]  │
   └──────────────────────┘
--------------------------------------------------------------------------- */

interface StagePanelProps {
  stage: ProvenanceStage | null
  onClose: () => void
}

export default function StagePanel({ stage, onClose }: StagePanelProps) {
  const [showMap,  setShowMap]  = useState(false)
  const [showCert, setShowCert] = useState(false)
  const [checksDone, setChecksDone] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    setShowMap(false)
    setShowCert(false)
    setChecksDone(false)
    if (stage) {
      const t = setTimeout(() => setChecksDone(true), 1200)
      return () => clearTimeout(t)
    }
  }, [stage?.id])

  return (
    <>
      <AnimatePresence mode="wait">
        {stage && (
          <motion.div
            key={stage.id}
            initial={{ x: '-105%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-105%', opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              zIndex: 40,
              width: 'min(440px, 92vw)',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              padding: '28px 28px 28px',
              borderRadius: '0 24px 24px 0',
              background: 'rgba(6,14,4,0.92)',
              backdropFilter: 'blur(22px)',
              borderTop: `2px solid ${stage.color}`,
              borderRight: `1px solid ${stage.color}30`,
              borderBottom: `1px solid rgba(255,255,255,0.07)`,
              boxShadow: `8px 0 40px rgba(0,0,0,0.6), inset -1px 0 0 rgba(255,255,255,0.04)`,
            }}
          >
            {/* ── Panel header ── */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22 }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 11,
                background: `${stage.color}1a`,
                border: `1.5px solid ${stage.color}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <StageIcon type={stage.type} color={stage.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 9.5, letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: stage.color, marginBottom: 3,
                }}>
                  {String(stage.number).padStart(2, '0')} · {stage.subtitle}
                </div>
                <div style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 21, fontWeight: 700, color: '#e4ede0', lineHeight: 1.15,
                }}>
                  {stage.title}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <VerifiedPill />
                <button
                  onClick={onClose}
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--night-dim)',
                    transition: 'all 0.2s',
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>

            {/* Thin divider */}
            <div style={{
              height: 1,
              background: `linear-gradient(to right, ${stage.color}40, transparent)`,
              marginBottom: 20,
            }} />

            {/* ── Stage content ── staggered */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
            >
              <StageContent
                stage={stage}
                checksDone={checksDone}
                onShowMap={() => setShowMap(true)}
                onShowCert={() => setShowCert(true)}
              />
            </motion.div>

            {/* ── Verification checklist ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{ marginTop: 18 }}
            >
              <Label>Verification</Label>
              {stage.data.checks.map((check, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: checksDone ? 1 : 0, x: checksDone ? 0 : -8 }}
                  transition={{ delay: 0.6 + i * 0.12, duration: 0.3 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '9px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: `${stage.color}1e`,
                    border: `1px solid ${stage.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Check size={10} color={stage.color} strokeWidth={3} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, color: '#d8e8d4' }}>{check.label}</div>
                    {check.detail && (
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: 'var(--night-dim)', marginTop: 1 }}>
                        {check.detail}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Back button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              style={{ marginTop: 18 }}
            >
              <button
                onClick={onClose}
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
              >
                ← Back to Journey
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showMap  && <MapModal  onClose={() => setShowMap(false)} />}
      {showCert && <CertificateModal onClose={() => setShowCert(false)} />}
    </>
  )
}

/* ── Stage-specific content ────────────────────────────────────── */

function StageContent({
  stage, checksDone, onShowMap, onShowCert
}: {
  stage: ProvenanceStage
  checksDone: boolean
  onShowMap: () => void
  onShowCert: () => void
}) {
  switch (stage.type) {
    case 'farmer':        return <FarmerContent   data={stage.data as FarmerStageData}         color={stage.color} onShowMap={onShowMap} onShowCert={onShowCert} />
    case 'lab':           return <LabContent       data={stage.data as LabStageData}            color={stage.color} />
    case 'manufacturing': return <MfgContent       data={stage.data as ManufacturingStageData}  color={stage.color} />
    case 'transport':     return <TransportContent data={stage.data as TransportStageData}      color={stage.color} />
    case 'product':       return <ProductContent   data={stage.data as ProductStageData}        color={stage.color} />
  }
}

function FarmerContent({ data, color, onShowMap, onShowCert }: {
  data: FarmerStageData; color: string; onShowMap: () => void; onShowCert: () => void
}) {
  return (
    <div>
      <InfoGrid>
        <InfoRow label="Collection Hub" value={data.collectionHub} color={color} />
        <InfoRow label="Location"       value={data.location}     color={color} />
        <InfoRow label="Species"        value={data.species}      sub={data.botanicalName} italic color={color} />
        <InfoRow label="Batch"          value={data.batchId}      mono color={color} />
        <InfoRow label="Date"           value={data.collectionDate} color={color} />
        <InfoRow label="Volume"         value={data.totalCollection} color={color} />
        <InfoRow label="Contributors"   value={`${data.farmerCount} verified farmers`} color={color} />
      </InfoGrid>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={onShowMap}>
          <MapPin size={11} /> View Location
        </button>
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={onShowCert}>
          <Award size={11} /> Certificate
        </button>
      </div>
    </div>
  )
}

function LabContent({ data, color }: { data: LabStageData; color: string }) {
  return (
    <div>
      <InfoGrid>
        <InfoRow label="Laboratory"    value={data.labName}       color={color} />
        <InfoRow label="Accreditation" value={data.accreditation} color={color} />
        <InfoRow label="Sample ID"     value={data.sampleId}      mono color={color} />
        <InfoRow label="Test Date"     value={data.testDate}      color={color} />
        <InfoRow label="Certificate"   value={data.certificateId} mono color={color} />
      </InfoGrid>
      <div style={{ marginTop: 14 }}>
        <Label>Test Results</Label>
        {data.results.map((r, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 12, color: '#c8dfc4' }}>{r.label}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color }}>{r.value}</span>
            </div>
            {r.detail && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: 'var(--night-dim)', marginTop: 1 }}>{r.detail}</div>}
            <div className="metric-bar-track" style={{ marginTop: 4 }}>
              <div className="metric-bar-fill" style={{ width: `${Math.min(97, 60 + i * 8)}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MfgContent({ data, color }: { data: ManufacturingStageData; color: string }) {
  return (
    <div>
      <InfoGrid>
        <InfoRow label="Manufacturer" value={data.manufacturer} color={color} />
        <InfoRow label="Input Batch"  value={data.inputBatch}   mono color={color} />
        <InfoRow label="Output Batch" value={data.outputBatch}  mono color={color} />
      </InfoGrid>
      <div style={{ marginTop: 14 }}>
        <Label>Processing Journey</Label>
        <div style={{ position: 'relative', paddingLeft: 4 }}>
          <div style={{
            position: 'absolute', left: 9, top: 8, bottom: 8, width: 1,
            background: `linear-gradient(to bottom, ${color}60, transparent)`,
          }} />
          {data.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: `${color}20`, border: `1.5px solid ${color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
              }}>
                <Check size={9} color={color} strokeWidth={3} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: '#e4ede0' }}>{step.name}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: 'var(--night-dim)', marginTop: 1 }}>
                  {step.detail}{step.input && step.output ? ` · ${step.input} → ${step.output}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TransportContent({ data, color }: { data: TransportStageData; color: string }) {
  return (
    <div>
      <InfoGrid>
        <InfoRow label="Partner"  value={data.partner}     color={color} />
        <InfoRow label="Pickup"   value={data.pickupDate}  color={color} />
        <InfoRow label="To"       value={data.destination} color={color} />
      </InfoGrid>
      <div style={{ marginTop: 14 }}>
        <Label>Condition Monitoring</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {data.metrics.map((m, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${color}20`,
              borderRadius: 12,
            }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 4 }}>
                {m.label}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductContent({ data, color }: { data: ProductStageData; color: string }) {
  return (
    <div>
      <InfoGrid>
        <InfoRow label="Product"    value={data.productName}  color={color} />
        <InfoRow label="Brand"      value={data.brand}        color={color} />
        <InfoRow label="Batch"      value={data.batch}        mono color={color} />
        <InfoRow label="Pack"       value={data.packSerial}   mono color={color} />
        <InfoRow label="Mfg Date"   value={data.manufactured} color={color} />
        <InfoRow label="Expiry"     value={data.expiry}       color={color} />
      </InfoGrid>
      <div style={{ marginTop: 14 }}>
        <Label>Chain Summary</Label>
        {data.chainSummary.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', marginBottom: 5,
            borderRadius: 10,
            background: `${color}0e`,
            border: `1px solid ${color}25`,
          }}>
            <Check size={11} color={color} strokeWidth={3} />
            <span style={{ fontSize: 12.5, color: '#d8e8d4' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Primitives ─────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 9.5, letterSpacing: '0.2em',
      textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 8,
    }}>
      {children}
    </div>
  )
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

function InfoRow({ label, value, sub, mono, italic, color }: {
  label: string; value: string; sub?: string; mono?: boolean; italic?: boolean; color: string
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 12,
    }}>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--night-dim)', flexShrink: 0, paddingTop: 1,
      }}>
        {label}
      </span>
      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontFamily: mono ? "'IBM Plex Mono', monospace" : 'inherit',
          fontSize: mono ? 10.5 : 12.5, color: '#e4ede0',
          fontStyle: italic ? 'italic' : 'normal',
        }}>
          {value}
        </span>
        {sub && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: 'var(--night-dim)', fontStyle: 'italic' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

function VerifiedPill() {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'rgba(126,200,90,0.12)',
      border: '1px solid rgba(126,200,90,0.28)',
      borderRadius: 999, padding: '3px 9px',
    }}>
      <Check size={9} color="#7ec85a" strokeWidth={3} />
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, letterSpacing: '0.14em', color: '#9fda74', textTransform: 'uppercase' }}>
        Verified
      </span>
    </div>
  )
}

function StageIcon({ type, color }: { type: string; color: string }) {
  const props = { size: 18, color, strokeWidth: 1.8 }
  switch (type) {
    case 'farmer':        return <Package {...props} />
    case 'lab':           return <FlaskConical {...props} />
    case 'manufacturing': return <Factory {...props} />
    case 'transport':     return <Truck {...props} />
    case 'product':       return <Package {...props} />
    default:              return <Package {...props} />
  }
}
