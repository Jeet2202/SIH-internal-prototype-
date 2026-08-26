/**
 * ManufacturingStagePanel — Stage 4
 *
 * Dedicated bottom-docked panel for Stage 4 — MANUFACTURING / PROCESSING
 * Represents the COMPLETED historical manufacturing record that produced
 * the exact product the customer is holding.
 *
 * Lineage: ASH-2026-004 → MFG-ASH-2026-004 → PRD-ASH-2026-0447
 *
 * Layout: 3 columns
 *   LEFT   (28%): WHO + WHAT — Facility, Input batch, Verification checks, Provenance Lineage
 *   MIDDLE (44%): HOW — Animated processing pipeline (7 steps), Formulation flow & composition
 *   RIGHT  (28%): WHY + RECORD — About, Packaging/Product, QR Linkage, Documents, Ledger
 *
 * Accent: #c8922e (amber/gold manufacturing)
 * This is a READ-ONLY customer provenance view. No operational controls.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Check, Factory, Leaf, FlaskConical, Package, QrCode,
  Hash, Clock, Globe, Cpu, ChevronDown, ChevronRight, AlertCircle,
  Shield, FileText, Layers, Thermometer, Droplets, ArrowDown,
  ExternalLink, Info, CheckCircle2,
} from 'lucide-react'
import { MANUFACTURING_RECORD } from '../data/manufacturing'
import type { ProcessingStep } from '../types/manufacturing'
import { LocationMap } from './maps'

/* ─── Theme ─────────────────────────────────────────────────────── */
const AMBER   = '#c8922e'
const AMBER2  = '#e0aa4e'
const AMBER_G = 'rgba(200,146,46,0.50)'
const GREEN   = '#7CFF4F'
const GREEN_G = 'rgba(124, 255, 79,0.35)'
const DIM     = 'rgba(200,190,160,0.45)'
const SURFACE = 'rgba(255,255,255,0.02)'
const BORDER  = 'rgba(255,255,255,0.07)'

/* ─── Props ─────────────────────────────────────────────────────── */
interface Props {
  open:    boolean
  onClose: () => void
  hidden?: boolean
}

/* ══════════════════════════════════════════════════════════════════
   ROOT PANEL
══════════════════════════════════════════════════════════════════ */
export default function ManufacturingStagePanel({ open, onClose, hidden = false }: Props) {
  const rec = MANUFACTURING_RECORD
  const [docModalOpen, setDocModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<{ label: string; ref: string } | null>(null)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (docModalOpen) setDocModalOpen(false)
        else onClose()
      }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose, docModalOpen])

  const handleOpenDoc = (label: string, ref: string) => {
    setSelectedDoc({ label, ref })
    setDocModalOpen(true)
  }

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="mfg-panel"
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
            background:     'rgba(6,3,1,0.96)',
            backdropFilter: 'blur(36px)',
            border:         `1.5px solid ${AMBER}50`,
            borderRadius:   20,
            boxShadow:      `0 25px 80px rgba(0,0,0,0.92), 0 0 45px ${AMBER}25`,
            pointerEvents:  hidden ? 'none' : 'auto',
            display:        'flex',
            flexDirection:  'column',
            overflow:       'hidden',
          }}
        >
          {/* Top accent bar */}
          <div style={{
            height: 2, flexShrink: 0,
            background: `linear-gradient(90deg, transparent, ${AMBER}80, ${AMBER}, ${AMBER}80, transparent)`,
          }} />

          {/* Header strip */}
          <PanelHeader onClose={onClose} rec={rec} />

          {/* 3-column body */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '28% 1fr 28%',
            flex: 1, minHeight: 0,
          }}>
            <LeftColumn  rec={rec} />
            <MiddleColumn rec={rec} onOpenDoc={handleOpenDoc} />
            <RightColumn  rec={rec} onOpenDoc={handleOpenDoc} />
          </div>

          {/* Document Viewer Modal */}
          <DocumentModal
            open={docModalOpen}
            onClose={() => setDocModalOpen(false)}
            doc={selectedDoc}
            rec={rec}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Panel Header ───────────────────────────────────────────────── */
function PanelHeader({ onClose, rec }: { onClose: () => void; rec: typeof MANUFACTURING_RECORD }) {
  return (
    <div style={{
      flexShrink: 0,
      padding:    '9px 18px 8px 18px',
      display:    'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${AMBER}20`,
      background: 'rgba(255,255,255,0.015)',
    }}>
      {/* Stage badge */}
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: `${AMBER}1a`, border: `1.5px solid ${AMBER}45`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 10px ${AMBER_G}`,
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: AMBER }}>4</span>
      </div>

      <div style={{ marginLeft: 12 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: '0.26em', textTransform: 'uppercase', color: AMBER, lineHeight: 1 }}>
          PROOF OF PROCESSING
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700, color: '#f0e8d8' }}>
          MANUFACTURING
        </div>
      </div>

      <div style={{ marginLeft: 16 }}>
        <Pill color={GREEN}  text="VERIFIED"              icon={<Check   size={7} color={GREEN}  strokeWidth={3} />} />
      </div>

      <div style={{ marginLeft: 8 }}>
        <Pill color={AMBER2} text="MANUFACTURING COMPLETED" icon={<Factory size={7} color={AMBER2} />} />
      </div>

      <div style={{ marginLeft: 8 }}>
        <Pill color={GREEN}  text={`PRODUCT BATCH ${rec.packaging.productBatchId}`} icon={<Package size={7} color={GREEN} />} />
      </div>

      <div style={{ flex: 1 }} />

      {/* Demo badge */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: `${AMBER}70`,
        background: `${AMBER}0a`, border: `1px solid ${AMBER}22`,
        borderRadius: 5, padding: '2px 7px',
        marginRight: 8
      }}>
        DEMONSTRATION RECORD
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: `${AMBER}bb`, letterSpacing: '0.06em', marginRight: 16 }}>
        {rec.manufacturing.manufacturingId}
      </div>

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
          color: '#f0e8d0', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        ← BACK TO PROVENANCE
      </button>

      {/* Center node emblem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: `${AMBER}1a`, border: `1.5px solid ${AMBER}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 14px ${AMBER_G}`,
        }}>
          <span style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 13, fontWeight: 700, color: AMBER }}>4</span>
        </div>

        <div>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, lineHeight: 1 }}>
            PROVENANCE NODE · STAGE 04
          </div>
          <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontSize: 12, fontWeight: 700, color: '#f0e8d8' }}>
            MANUFACTURING
          </div>
        </div>

        <Pill color={GREEN}  text="VERIFIED"              icon={<Check   size={7} color={GREEN}  strokeWidth={3} />} />
        <Pill color={AMBER2} text="MANUFACTURING COMPLETED" icon={<Factory size={7} color={AMBER2} />} />
        <Pill color={GREEN}  text={`PRODUCT BATCH ${rec.packaging.productBatchId}`} icon={<Package size={7} color={GREEN} />} />
      </div>

      {/* Right side: Demo badge, ID & close button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono',monospace", fontSize: 7, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: `${AMBER}70`,
          background: `${AMBER}0a`, border: `1px solid ${AMBER}22`,
          borderRadius: 5, padding: '2px 7px',
        }}>
          DEMONSTRATION RECORD
        </div>

        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.5, color: `${AMBER}bb`, letterSpacing: '0.06em' }}>
          {rec.manufacturing.manufacturingId}
        </div>

        <button
          onClick={onClose}
          aria-label="Close manufacturing panel"
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
   Facility identity · Input batch · Verification checks · Lineage
══════════════════════════════════════════════════════════════════ */
function LeftColumn({ rec }: { rec: typeof MANUFACTURING_RECORD }) {
  return (
    <div style={{
      borderRight: `1px solid ${BORDER}`,
      overflowY:   'auto',
      padding:     '10px 12px 10px 16px',
      display:     'flex', flexDirection: 'column', gap: 7,
    }}>

      {/* ── MANUFACTURING FACILITY ── */}
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.26 }}>
        <ColLabel icon={<Factory size={8} color={AMBER} />} text="MANUFACTURING FACILITY" />
        <div style={{
          background: `${AMBER}0d`, border: `1px solid ${AMBER}28`,
          borderRadius: 11, padding: '8px 10px', marginTop: 5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6,
              background: `${AMBER}20`, border: `1px solid ${AMBER}45`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Factory size={10} color={AMBER} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700, color: '#f0e8d8' }}>
                {rec.manufacturer.name}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: `${AMBER}99`, letterSpacing: '0.08em' }}>
                DEMONSTRATION RECORD
              </div>
            </div>
          </div>
          <MetaRow label="Manufacturer ID" value={rec.manufacturer.id}           mono />
          <MetaRow label="Location"        value={rec.manufacturer.location}           />
          <MetaRow label="Licence"         value={rec.manufacturer.licenceId}    mono />
          <MetaRow label="GMP Cert"        value={rec.manufacturer.gmpCertificate}     />
          <MetaRow label="Status"          value="VERIFIED" verified last />

          {/* Real Leaflet Manufacturing Plant Location Map */}
          <div style={{ height: 110, borderRadius: 9, overflow: 'hidden', marginTop: 8, border: `1px solid ${AMBER}35` }}>
            <LocationMap
              location={{
                lat: 19.9975,
                lng: 73.7898,
                label: 'Himalaya Roots Formulations',
                city: 'Nashik',
                state: 'Maharashtra',
                country: 'India',
              }}
              type="manufacturing"
              label="Himalaya Plant M-01"
              sublabel="Nashik, Maharashtra"
              privacy="internal"
              statusBadge="MANUFACTURING PLANT VERIFIED"
              height={110}
            />
          </div>
        </div>
      </motion.div>

      {/* ── INPUT BOTANICAL BATCH ── */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.26 }}>
        <ColLabel icon={<Leaf size={8} color={GREEN} />} text="INPUT BOTANICAL BATCH" />
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 11, padding: '8px 10px', marginTop: 5,
        }}>
          <MetaRow label="Batch"         value={rec.inputBatch.batchId} mono accent={GREEN} />
          <MetaRow label="Common Name"   value={rec.inputBatch.species} />
          <MetaRow label="Species"       value={rec.inputBatch.botanicalName} italic />
          <MetaRow label="Plant Part"    value={rec.inputBatch.plantPart} />
          <MetaRow label="Material Type" value={rec.inputBatch.materialType} />
          <MetaRow label="Quantity"      value={`${rec.inputBatch.quantityKg} kg`} mono />
          <MetaRow label="Status"        value="ACCEPTED FOR PROCESSING" verified last />
        </div>
      </motion.div>

      {/* ── PROVENANCE LINEAGE VISUALIZATION ── */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.26 }}>
        <ColLabel icon={<Layers size={8} color={AMBER} />} text="PROVENANCE LINEAGE" />
        <div style={{
          background: `${AMBER}08`, border: `1px solid ${AMBER}20`,
          borderRadius: 10, padding: '7px 9px', marginTop: 5,
        }}>
          <ProvenanceLineageStrip />
        </div>
      </motion.div>

      {/* ── VERIFICATION CHECKS ── */}
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.26 }}>
        <ColLabel icon={<Shield size={8} color={AMBER} />} text="VERIFICATION CHECKS" />
        <div style={{
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 11, padding: '7px 10px', marginTop: 5,
        }}>
          {rec.checks.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 6,
              padding: '3px 0',
              borderBottom: i < rec.checks.length - 1 ? `1px solid ${BORDER}` : 'none',
            }}>
              <div style={{
                width: 13, height: 13, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                background: c.status === 'pass' ? GREEN_G : 'rgba(255,100,80,0.12)',
                border: `1px solid ${c.status === 'pass' ? GREEN : 'rgba(255,100,80,0.40)'}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.status === 'pass'
                  ? <Check size={6} color={GREEN} strokeWidth={3} />
                  : <AlertCircle size={7} color="#ff6450" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: c.status === 'pass' ? '#c8d8c0' : '#ffb0a0', lineHeight: 1.4 }}>
                  {c.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Provenance Lineage Strip ───────────────────────────────────── */
function ProvenanceLineageStrip() {
  const steps = [
    { label: 'FARMER',              code: 'ORIGIN',            hl: false },
    { label: 'LAB VERIFIED',        code: 'TESTING',           hl: false },
    { label: 'TRANSPORT COMPLETED', code: 'CUSTODY',           hl: false },
    { label: 'ASH-2026-004',        code: 'BOTANICAL INPUT',   hl: false, batch: true },
    { label: 'MANUFACTURING',       code: 'STAGE 4 (CURRENT)', hl: true },
    { label: 'PRD-ASH-2026-0447',   code: 'PRODUCT BATCH',     hl: false, batch: true },
    { label: 'FINAL PRODUCT',       code: 'AUTHENTICATED',     hl: false },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {steps.map((s, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: s.hl ? AMBER : s.batch ? GREEN : `${DIM}60`,
            boxShadow: s.hl ? `0 0 6px ${AMBER}` : 'none',
          }} />
          <div style={{
            flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: s.hl ? '2px 6px' : '1px 0',
            background: s.hl ? `${AMBER}18` : 'transparent',
            borderRadius: 4,
            border: s.hl ? `1px solid ${AMBER}40` : 'none',
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 7,
              fontWeight: s.hl || s.batch ? 700 : 400,
              color: s.hl ? AMBER2 : s.batch ? GREEN : '#c8c0b0',
            }}>
              {s.label}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 6, color: DIM }}>
              {s.code}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MIDDLE COLUMN — HOW
   Animated processing pipeline + Formulation flow & composition
══════════════════════════════════════════════════════════════════ */
function MiddleColumn({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (label: string, ref: string) => void }) {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  // Animate steps appearing one by one
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const revealNext = (n: number) => {
      if (n > rec.processingSteps.length) return
      setVisibleSteps(n)
      t = setTimeout(() => revealNext(n + 1), 200)
    }
    const start = setTimeout(() => revealNext(1), 300)
    return () => { clearTimeout(start); clearTimeout(t) }
  }, [rec.processingSteps.length])

  const toggleStep = (step: number) =>
    setExpandedStep(prev => prev === step ? null : step)

  return (
    <div style={{
      borderRight: `1px solid ${BORDER}`,
      overflowY:   'auto',
      padding:     '10px 12px',
      display:     'flex', flexDirection: 'column', gap: 6,
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.10, duration: 0.26 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.20em', textTransform: 'uppercase', color: AMBER }}>
          Processing Pipeline
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: DIM }}>
            {rec.manufacturing.acceptedAt.split(',')[0]} → {rec.manufacturing.completedAt.split(',')[0]}
          </span>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: GREEN_G, border: '1px solid rgba(124, 255, 79,0.25)',
            borderRadius: 999, padding: '2px 8px',
          }}>
            <Check size={7} color={GREEN} strokeWidth={3} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: GREEN, letterSpacing: '0.10em' }}>ALL STEPS COMPLETED</span>
          </div>
        </div>
      </motion.div>

      {/* Processing steps */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        {/* Vertical connector line */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12 }}>
          <div style={{
            width: 1.5,
            height: `${Math.min(visibleSteps, rec.processingSteps.length) * 44}px`,
            background: `linear-gradient(to bottom, ${AMBER}90, ${GREEN})`,
            transition: 'height 0.4s ease',
            borderRadius: 1,
          }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {rec.processingSteps.map((s, i) => (
            <AnimatePresence key={s.step}>
              {i < visibleSteps && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <StepCard
                    step={s}
                    expanded={expandedStep === s.step}
                    onToggle={() => toggleStep(s.step)}
                    isLast={i === rec.processingSteps.length - 1}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      {/* Formulation lineage panel */}
      <AnimatePresence>
        {visibleSteps >= rec.processingSteps.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.28 }}
          >
            <FormulationFlow rec={rec} onOpenDoc={onOpenDoc} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Individual processing step card ───────────────────────────── */
function StepCard({ step, expanded, onToggle, isLast }: {
  step: ProcessingStep; expanded: boolean; onToggle: () => void; isLast: boolean
}) {
  const stepColor = isLast ? GREEN : AMBER

  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left',
          background: expanded ? `${AMBER}0e` : 'transparent',
          border:     `1px solid ${expanded ? AMBER + '30' : 'transparent'}`,
          borderRadius: 8, padding: '4px 8px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7,
          transition: 'all 0.18s',
        }}
      >
        {/* Step number dot */}
        <div style={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
          background: isLast ? GREEN_G : `${AMBER}1a`,
          border: `1.5px solid ${stepColor}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: expanded ? `0 0 8px ${stepColor}60` : 'none',
          transition: 'all 0.2s',
        }}>
          {isLast
            ? <Check size={9} color={GREEN} strokeWidth={3} />
            : <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: AMBER, fontWeight: 700 }}>{step.step}</span>
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 10, color: '#e8dcc8', fontWeight: 600 }}>
            {step.name}
          </div>
          {!expanded && (step.inputQty || step.outputQty) && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: DIM, marginTop: 1 }}>
              {step.inputQty && `In: ${step.inputQty}`}
              {step.inputQty && step.outputQty && ' · '}
              {step.outputQty && `Out: ${step.outputQty}`}
            </div>
          )}
        </div>

        {/* Status chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: GREEN_G, border: '1px solid rgba(124, 255, 79,0.22)',
          borderRadius: 999, padding: '1.5px 7px', flexShrink: 0,
        }}>
          <Check size={6} color={GREEN} strokeWidth={3} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, color: GREEN, letterSpacing: '0.08em' }}>COMPLETED</span>
        </div>

        {expanded ? <ChevronDown size={10} color={AMBER} /> : <ChevronRight size={10} color={DIM} />}
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              background: `${AMBER}07`, border: `1px solid ${AMBER}18`,
              borderRadius: '0 0 8px 8px', padding: '7px 10px',
              margin: '0 0 2px 0',
            }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9.5, color: '#c0b8a0', lineHeight: 1.60, marginBottom: 6 }}>
                {step.detail}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <MiniStat label="Input"       value={step.inputQty || 'Not recorded in prototype dataset'} />
                <MiniStat label="Output"      value={step.outputQty || 'Not recorded in prototype dataset'} />
                <MiniStat label="Temperature" value={step.temperature || 'Not recorded in prototype dataset'} icon={<Thermometer size={7} color={AMBER2} />} />
                <MiniStat label="Humidity"    value={step.humidity || 'Not recorded in prototype dataset'}    icon={<Droplets    size={7} color={AMBER2} />} />
                <MiniStat label="Duration"    value={step.duration || 'Not recorded in prototype dataset'}    icon={<Clock       size={7} color={DIM}    />} />
              </div>
              <div style={{
                marginTop: 5, display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: "var(--font-mono)", fontSize: 7, color: GREEN,
              }}>
                <Check size={7} color={GREEN} strokeWidth={3} />
                {step.anomaly ? 'Anomaly flagged — see records' : 'No anomaly detected ✓'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Formulation lineage flow & composition ─────────────────────── */
function FormulationFlow({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (label: string, ref: string) => void }) {
  const [showComposition, setShowComposition] = useState(false)

  return (
    <div style={{
      background: `${AMBER}09`, border: `1.5px solid ${AMBER}28`,
      borderRadius: 11, padding: '8px 12px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 7,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 7.5,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: AMBER,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <FlaskConical size={9} color={AMBER} />
          Formulation — Batch Lineage
        </div>

        {/* View Formulation Document Button */}
        <button
          onClick={() => onOpenDoc('Formulation Record', 'FORM-ASH-2026-0447.pdf')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: `${AMBER}15`, border: `1px solid ${AMBER}40`,
            borderRadius: 6, padding: '2px 7px',
            fontFamily: "var(--font-mono)", fontSize: 6.5, color: AMBER2,
            cursor: 'pointer',
          }}
        >
          <FileText size={7} color={AMBER2} />
          View Formulation Document
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {/* Input batches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 6, color: DIM, textTransform: 'uppercase' }}>
            Input Botanical Batch
          </div>
          {rec.formulation.inputBatches.map((b, i) => (
            <div key={i} style={{
              fontFamily: "var(--font-mono)", fontSize: 8.5, fontWeight: 700,
              color: GREEN, background: GREEN_G, border: '1px solid rgba(124, 255, 79,0.25)',
              borderRadius: 6, padding: '3px 9px',
            }}>
              {b}
            </div>
          ))}
        </div>

        <ArrowDown size={11} color={`${AMBER}80`} style={{ flexShrink: 0 }} />

        {/* Formulation node */}
        <div style={{
          background: `${AMBER}15`, border: `1.5px solid ${AMBER}40`,
          borderRadius: 8, padding: '4px 10px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <FlaskConical size={10} color={AMBER} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: AMBER, letterSpacing: '0.08em', marginTop: 2 }}>
            FORMULATION
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, color: DIM }}>
            {rec.formulation.formulationId}
          </div>
        </div>

        <ArrowDown size={11} color={`${GREEN}80`} style={{ flexShrink: 0 }} />

        {/* Output product batch */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 6, color: DIM, textTransform: 'uppercase' }}>
            Product Batch
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 8.5, fontWeight: 700,
            color: GREEN, background: GREEN_G, border: '1px solid rgba(124, 255, 79,0.25)',
            borderRadius: 6, padding: '3px 9px',
          }}>
            {rec.formulation.productBatchId}
          </div>
        </div>
      </div>

      {/* Toggle composition list */}
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 6 }}>
        <button
          onClick={() => setShowComposition(!showComposition)}
          style={{
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: "var(--font-mono)", fontSize: 7, color: AMBER2,
          }}
        >
          {showComposition ? <ChevronDown size={8} color={AMBER2} /> : <ChevronRight size={8} color={AMBER2} />}
          <span>{showComposition ? 'Hide Composition Table' : 'Show Product Composition Breakdown (5 Items)'}</span>
        </button>

        {showComposition && (
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', padding: '2px 4px', fontFamily: "var(--font-mono)", fontSize: 6, color: DIM, textTransform: 'uppercase' }}>
              <span>Ingredient</span>
              <span>Amount</span>
              <span style={{ textAlign: 'right' }}>Source Batch</span>
            </div>
            {rec.formulation.composition.map((c, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr',
                padding: '3px 4px', borderRadius: 4,
                background: c.sourceBatch === rec.inputBatch.batchId ? 'rgba(124, 255, 79,0.08)' : 'rgba(255,255,255,0.02)',
                border: c.sourceBatch === rec.inputBatch.batchId ? '1px solid rgba(124, 255, 79,0.20)' : `1px solid ${BORDER}`,
                fontFamily: "var(--font-mono)", fontSize: 7,
              }}>
                <span style={{ color: c.sourceBatch === rec.inputBatch.batchId ? GREEN : '#e0d8c0' }}>{c.ingredient}</span>
                <span style={{ color: DIM }}>{c.amount}</span>
                <span style={{ textAlign: 'right', color: c.sourceBatch === rec.inputBatch.batchId ? GREEN : DIM }}>{c.sourceBatch}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Check size={7} color={GREEN} strokeWidth={3} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: GREEN }}>
          FORMULATION COMPLETED ✓
        </span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RIGHT COLUMN — WHY + RECORD
   About · Product batch · QR linkage · Documents · Ledger
══════════════════════════════════════════════════════════════════ */
function RightColumn({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (label: string, ref: string) => void }) {
  return (
    <div style={{
      padding:   '10px 14px 10px 10px',
      display:   'flex', flexDirection: 'column', gap: 7,
      overflowY: 'auto',
    }}>
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10, duration: 0.26 }}>
        <AboutCard />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20, duration: 0.26 }}>
        <ProductBatchCard rec={rec} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30, duration: 0.26 }}>
        <ManufacturingStatusCard rec={rec} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.26 }}>
        <DocumentsCard rec={rec} onOpenDoc={onOpenDoc} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46, duration: 0.26 }}>
        <LedgerCard rec={rec} />
      </motion.div>
    </div>
  )
}

/* ─── About card ─────────────────────────────────────────────────── */
function AboutCard() {
  return (
    <div style={{
      background: `${AMBER}08`, border: `1px solid ${AMBER}1e`,
      borderRadius: 11, padding: '8px 11px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <Factory size={9} color={AMBER} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: AMBER }}>
          About This Stage
        </span>
      </div>
      <p style={{ fontSize: 10, color: '#c0b0a0', lineHeight: 1.65, fontFamily: "var(--font-body)" }}>
        The verified botanical batch was received, processed through the recorded manufacturing steps,
        transformed into a finished product batch, packaged, and released for downstream distribution.
        Each processing event remains linked to the original botanical batch.
      </p>
    </div>
  )
}

/* ─── Product batch + QR card ────────────────────────────────────── */
function ProductBatchCard({ rec }: { rec: typeof MANUFACTURING_RECORD }) {
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`,
      borderRadius: 11, padding: '8px 11px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Package size={9} color={AMBER2} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AMBER2 }}>
          Finished Product Batch
        </span>
      </div>

      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
        color: GREEN, marginBottom: 5,
      }}>
        {rec.packaging.productBatchId}
      </div>

      <MetaRow label="Product"     value={rec.formulation.productName} />
      <MetaRow label="Dosage Form" value={rec.formulation.dosageForm} />
      <MetaRow label="Dosage"      value={rec.formulation.dosagePerUnit} />
      <MetaRow label="Pack Size"   value={rec.packaging.packSize} />
      <MetaRow label="SKU"         value={rec.packaging.sku}     mono />
      <MetaRow label="Mfg Date"    value={rec.packaging.manufactureDate} />
      <MetaRow label="Expiry"      value={rec.packaging.expiryDate} />
      <MetaRow label="Bottles"     value={rec.packaging.bottleCount.toLocaleString()} mono />
      <MetaRow label="Status"      value="PACKAGING COMPLETED" verified last />

      {/* QR linkage */}
      <div style={{ marginTop: 7, padding: '6px 9px', background: `${AMBER}08`, borderRadius: 8, border: `1px solid ${AMBER}20` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <QrCode size={8} color={AMBER} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: AMBER }}>
            QR Provenance Link
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: DIM }}>Pack Serial</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: '#e0d8c0' }}>{rec.qrLink.packSerial}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: DIM }}>QR Status</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={7} color={GREEN} strokeWidth={3} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: GREEN }}>ISSUED</span>
            </div>
          </div>
        </div>
        {/* QR chain mini-flow */}
        <div style={{ marginTop: 5, fontFamily: "var(--font-mono)", fontSize: 7, color: DIM, textAlign: 'center', lineHeight: 1.7 }}>
          MANUFACTURING → PRODUCT BATCH CREATED → QR ISSUED → CUSTOMER SCANS → THIS PAGE
        </div>
      </div>
    </div>
  )
}

/* ─── Manufacturing status summary ──────────────────────────────── */
function ManufacturingStatusCard({ rec }: { rec: typeof MANUFACTURING_RECORD }) {
  const items = [
    { label: 'Raw material received',  done: true },
    { label: 'Processing completed',   done: true },
    { label: 'Formulation completed',  done: true },
    { label: 'Product batch created',  done: true },
    { label: 'Packaging completed',    done: true },
    { label: 'Quality released',       done: true },
  ]
  return (
    <div style={{
      background: `${AMBER}06`, border: `1px solid ${AMBER}1a`,
      borderRadius: 11, padding: '8px 11px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Layers size={9} color={AMBER} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AMBER }}>
          Manufacturing Status
        </span>
        <div style={{ marginLeft: 'auto', fontFamily: "var(--font-mono)", fontSize: 7, color: DIM }}>
          QC: {rec.qualityRelease.releaseRecord}
        </div>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '2.5px 0',
          borderBottom: i < items.length - 1 ? `1px solid ${BORDER}` : 'none',
        }}>
          <div style={{
            width: 13, height: 13, borderRadius: '50%', flexShrink: 0,
            background: GREEN_G, border: '1px solid rgba(124, 255, 79,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Check size={6} color={GREEN} strokeWidth={3} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: '#b8c8b0' }}>{it.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Documents vault ────────────────────────────────────────────── */
function DocumentsCard({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (label: string, ref: string) => void }) {
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`,
      borderRadius: 11, padding: '8px 11px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <FileText size={9} color={DIM} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: DIM }}>
          Manufacturing Documents
        </span>
      </div>
      {rec.documents.map((d, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '3px 0', borderBottom: i < rec.documents.length - 1 ? `1px solid ${BORDER}` : 'none',
        }}>
          <button
            onClick={() => onOpenDoc(d.label, d.ref)}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: "var(--font-mono)", fontSize: 7, color: '#b0a898',
              display: 'flex', alignItems: 'center', gap: 4, textAlign: 'left',
            }}
          >
            <FileText size={7} color={AMBER} />
            <span style={{ textDecoration: 'underline' }}>{d.label}</span>
          </button>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 6.5,
            color: d.attached ? GREEN : DIM,
            background: d.attached ? GREEN_G : 'transparent',
            border: `1px solid ${d.attached ? 'rgba(124, 255, 79,0.25)' : 'transparent'}`,
            borderRadius: 4, padding: '1px 5px', flexShrink: 0,
          }}>
            {d.attached ? 'ATTACHED' : 'NOT IN DATASET'}
          </span>
        </div>
      ))}
      <div style={{ marginTop: 5, fontFamily: "var(--font-mono)", fontSize: 7, color: DIM }}>
        Documents available in production system · DEMONSTRATION RECORD
      </div>
    </div>
  )
}

/* ─── Ledger card ────────────────────────────────────────────────── */
function LedgerCard({ rec }: { rec: typeof MANUFACTURING_RECORD }) {
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${AMBER}22`,
      borderRadius: 11, padding: '8px 11px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Cpu size={9} color={AMBER2} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: AMBER2 }}>
          Ledger Record
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: "var(--font-mono)", fontSize: 7, color: `${AMBER}60`, letterSpacing: '0.10em' }}>
          PROTOTYPE DEMO
        </span>
      </div>
      <LedgerRow icon={<Hash  size={8} color={DIM} />} label="TX ID"    value={rec.ledger.transactionId} mono />
      <LedgerRow icon={<Cpu   size={8} color={DIM} />} label="Block"    value={rec.ledger.blockNumber}   mono />
      <LedgerRow icon={<Clock size={8} color={DIM} />} label="Time"     value={rec.ledger.timestamp} />
      <LedgerRow icon={<Globe size={8} color={DIM} />} label="Network"  value={rec.ledger.network} />
      <div style={{ marginTop: 6, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: `${AMBER}12`, border: `1px solid ${AMBER}30`,
          borderRadius: 999, padding: '2px 10px',
        }}>
          <Check size={7} color={AMBER2} strokeWidth={3} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: AMBER2, letterSpacing: '0.10em' }}>ANCHORED</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Document Viewer Modal ─────────────────────────────────────── */
function DocumentModal({
  open, onClose, doc, rec,
}: {
  open: boolean
  onClose: () => void
  doc: { label: string; ref: string } | null
  rec: typeof MANUFACTURING_RECORD
}) {
  if (!open || !doc) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: '#0a0512',
          border: `1.5px solid ${AMBER}45`,
          borderRadius: 14,
          padding: 20,
          maxWidth: 480,
          width: '100%',
          boxShadow: `0 20px 60px rgba(0,0,0,0.9), 0 0 30px ${AMBER_G}`,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `${AMBER}20`, border: `1px solid ${AMBER}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FileText size={14} color={AMBER} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                FORMULATION RECORD
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: '#f0e8d8' }}>
                {doc.label}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#c8c0b0',
            }}
          >
            <X size={12} />
          </button>
        </div>

        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <MetaRow label="Document Type"   value={doc.label} />
          <MetaRow label="Related Batch"   value={rec.inputBatch.batchId} mono accent={GREEN} />
          <MetaRow label="Product Batch"   value={rec.formulation.productBatchId} mono accent={GREEN} />
          <MetaRow label="Formulation ID"  value={rec.formulation.formulationId} mono />
          <MetaRow label="Reference Code"  value={doc.ref} mono />
          <MetaRow label="Status"          value="Verified / Demonstration Record" verified last />
        </div>

        <div style={{
          background: `${AMBER}0a`, border: `1px solid ${AMBER}25`,
          borderRadius: 8, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Info size={14} color={AMBER} style={{ flexShrink: 0 }} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: '#d0c8b0', lineHeight: 1.5 }}>
            <strong>FORMULATION DOCUMENT</strong><br />
            Not attached to current prototype dataset. Available in production enterprise integration.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: `${AMBER}20`, border: `1px solid ${AMBER}50`,
              borderRadius: 6, padding: '5px 14px',
              fontFamily: "var(--font-mono)", fontSize: 8.5, color: '#f0e8d8',
              cursor: 'pointer',
            }}
          >
            Close Viewer
          </button>
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
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: AMBER }}>
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
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: '0.10em', color, textTransform: 'uppercase' }}>{text}</span>
    </div>
  )
}

function MetaRow({ label, value, mono, verified, italic, accent, last }: {
  label: string; value: string; mono?: boolean; verified?: boolean; italic?: boolean; accent?: string; last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
      padding: '3px 0', borderBottom: last ? 'none' : `1px solid ${BORDER}`,
    }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: DIM, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "var(--font-mono)" : italic ? "var(--font-body)" : "var(--font-body)",
        fontStyle:  italic ? 'italic' : 'normal',
        fontSize:   mono ? 8 : 9.5,
        color: verified ? GREEN : (accent ?? '#d8cec0'),
        textAlign: 'right',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {value}
        {verified && <Check size={7} color={GREEN} strokeWidth={3} />}
      </span>
    </div>
  )
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div style={{
      background: `${AMBER}0a`, border: `1px solid ${AMBER}18`,
      borderRadius: 6, padding: '3px 6px',
      display: 'flex', flexDirection: 'column', gap: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {icon}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 6.5, color: DIM, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: AMBER2 }}>{value}</span>
    </div>
  )
}

function LedgerRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      gap: 8, padding: '3.5px 0', borderBottom: `1px solid ${BORDER}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: DIM }}>
        {icon} {label}
      </div>
      <div style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 8 : 9.5, color: '#c8c0b0', textAlign: 'right', wordBreak: 'break-all' }}>
        {value}
      </div>
    </div>
  )
}
