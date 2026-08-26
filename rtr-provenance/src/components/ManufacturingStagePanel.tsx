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
import StageDetailHeader from '../components/StageDetailHeader'
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
  isMobile?: boolean
}

/* ══════════════════════════════════════════════════════════════════
   ROOT PANEL
══════════════════════════════════════════════════════════════════ */
export default function ManufacturingStagePanel({ open, onClose, hidden = false, isMobile = false }: Props) {
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
    <>
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="mfg-panel"
          initial={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: hidden ? 0 : 1, y: hidden && isMobile ? '100%' : 0 }}
          exit={isMobile ? { y: '100%', opacity: 1 } : { scale: 0.85, opacity: 0, y: 15 }}
          transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:       'fixed',
            top:            isMobile ? 'auto' : '2vh',
            bottom:         isMobile ? 0 : '2vh',
            left:           isMobile ? 0 : '2.5vw',
            right:          isMobile ? 0 : '2.5vw',
            height:         isMobile ? '85vh' : 'auto',
            zIndex:         50,
            background:     'rgba(6,3,1,0.96)',
            backdropFilter: 'blur(36px)',
            border:         `1.5px solid ${AMBER}50`,
            borderRadius:   isMobile ? '24px 24px 0 0' : 20,
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

                    {/* Global Stage Header */}
          <StageDetailHeader
            stageNumber={4}
            title="MANUFACTURING"
            status="Verified"
            description="Verified manufacturing record for the finished product."
            accentColor={AMBER}
            onClose={onClose}
          />

          {/* 3-column body */}
          <div className="mobile-scroll-container" style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: 'column',
            gridTemplateColumns: isMobile ? 'none' : '28% 1fr 28%',
            gap: isMobile ? 24 : 0,
            flex: 1, minHeight: 0,
            overflowY: 'auto'
          }}>
            <LeftColumn  rec={rec} />
            <MiddleColumn rec={rec} onOpenDoc={handleOpenDoc} />
            <RightColumn  rec={rec} onOpenDoc={handleOpenDoc} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>

          {/* Document Viewer Modal */}
          <DocumentModal
            open={docModalOpen}
            onClose={() => setDocModalOpen(false)}
            doc={selectedDoc}
            rec={rec}
          />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════
   LEFT COLUMN — MANUFACTURER
══════════════════════════════════════════════════════════════════ */
function LeftColumn({ rec }: { rec: typeof MANUFACTURING_RECORD }) {
  return (
    <div style={{
      padding: '24px 32px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
    }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Facility Details
      </div>
      {[
        { label: 'Facility Name',   value: rec.manufacturer.name },
        { label: 'Facility ID',     value: rec.manufacturer.id },
        { label: 'Location',        value: rec.manufacturer.location.split(',')[0] },
        { label: 'GMP Certified',   value: rec.manufacturer.gmpCertificate },
        { label: 'Licence Expiry',  value: rec.manufacturer.licenceExpiry },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0', textAlign: 'right' }}>{item.value}</span>
        </div>
      ))}
      
      <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Facility Map
      </div>
      <div style={{ flex: 1, minHeight: 200, borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.12)` }}>
        <LocationMap
          location={{ lat: 19.0760, lng: 72.8777, label: rec.manufacturer.name }}
          type="manufacturing"
          label={rec.manufacturer.name}
          sublabel={rec.manufacturer.id}
          privacy="internal"
          accuracyM={5}
          statusBadge="GMP CERTIFIED"
          height={200}
        />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MIDDLE COLUMN — INPUTS
══════════════════════════════════════════════════════════════════ */
function MiddleColumn({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (l: string, r: string) => void }) {
  return (
    <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Input Batch
      </div>
      {[
        { label: 'Verified Batch',   value: rec.inputBatch.batchId },
        { label: 'Quantity Received', value: rec.inputBatch.quantityKg + ' kg' },
        { label: 'Status',           value: rec.inputBatch.acceptanceStatus },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, paddingTop: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: item.value.includes('Accepted') ? GREEN : '#f0f8f0' }}>{item.value}</span>
        </div>
      ))}

      <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Verification Checks
      </div>
      {rec.checks.slice(0, 3).map((chk, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: 8, paddingTop: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{chk.label}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: chk.status === 'pass' ? GREEN : '#f0f8f0' }}>PASS</span>
        </div>
      ))}
      
      <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Processing Pipeline
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 16px 8px 16px' }}>
        {rec.processingSteps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124, 255, 79, 0.1)', border: '1px solid rgba(124, 255, 79, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={10} color={GREEN} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: '#f0f8f0', marginBottom: 2 }}>{step.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RIGHT COLUMN — OUTPUTS
══════════════════════════════════════════════════════════════════ */
function RightColumn({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (l: string, r: string) => void }) {
  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Product Output
        </div>
        {[
          { label: 'Product Batch',  value: rec.packaging.productBatchId },
          { label: 'Pack Size',      value: rec.packaging.packSize },
          { label: 'Bottles Produced', value: rec.packaging.bottleCount + '' },
          { label: 'QC Release',     value: rec.qualityRelease.status },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, paddingTop: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: item.value === 'Released' ? GREEN : '#f0f8f0' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Compliance Documents
        </div>
        {rec.documents.map((doc, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: 13, color: '#f0f8f0' }}>{doc.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: AMBER, marginTop: 4 }}>{doc.ref}</div>
            </div>
            <button onClick={() => onOpenDoc(doc.label, doc.ref)} style={{ padding: '6px 12px', borderRadius: 6, background: `${AMBER}15`, border: `1px solid ${AMBER}40`, color: AMBER, fontSize: 10, fontFamily: "var(--font-mono)", textTransform: 'uppercase', cursor: 'pointer' }}>
              View
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
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
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: AMBER }}>{rec.ledger.transactionId.substring(0, 16)}...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   DOCUMENT MODAL
══════════════════════════════════════════════════════════════════ */
function DocumentModal({ open, onClose, doc, rec }: { open: boolean; onClose: () => void; doc: { label: string; ref: string } | null; rec: typeof MANUFACTURING_RECORD }) {
  if (!doc) return null
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            style={{ background: 'rgba(10,5,2,0.95)', border: `1px solid ${AMBER}40`, borderRadius: 16, padding: 24, width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: `${AMBER}15`, border: `1px solid ${AMBER}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color={AMBER} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Compliance Record</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: '#f0f8f0' }}>{doc.label}</div>
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Document Type</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: '#f0f8f0' }}>{doc.label}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Product Batch</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: GREEN }}>{rec.packaging.productBatchId}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Formulation ID</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: '#f0f8f0' }}>{rec.formulation.formulationId}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Reference Code</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: '#f0f8f0' }}>{doc.ref}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Status</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: GREEN }}>Verified / Demonstration</span>
               </div>
            </div>
            
            <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 8, padding: 12, display: 'flex', gap: 12 }}>
              <Info size={16} color={AMBER} />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#d0c8b0', lineHeight: 1.5 }}>
                Not attached to current prototype dataset. Available in production enterprise integration.
              </div>
            </div>
            
            <button onClick={onClose} style={{ width: '100%', padding: '12px', background: `${AMBER}20`, border: `1px solid ${AMBER}50`, borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: '#f0e8d8', cursor: 'pointer' }}>
              Close Viewer
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
