import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, MapPin, FlaskConical, Factory, Truck, Package,
  Cpu, Clock, Globe, Hash, Leaf, FileText, ShieldCheck,
  Microscope, Boxes, TruckIcon, ThumbsUp, ArrowRight,
  X, User, Scale, Navigation, AlertTriangle, ExternalLink,
} from 'lucide-react'
import DocumentPreviewModal from './DocumentPreviewModal'
import LabReportModal from './LabReportModal'
import ProductDocumentsModal from './ProductDocumentsModal'
import { LocationMap } from './maps'
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
   StageDetailPanel — bottom-docked 3-column provenance panel.

   When stage.type === 'farmer' → renders the full rich Farmer/Collection view
   (farmer avatar, GPS map, document preview, about/verification/blockchain).
   All other stages → generic 3-column layout.
--------------------------------------------------------------------------- */

interface StageDetailPanelProps {
  stage:   ProvenanceStage | null
  onClose: () => void
  hidden?: boolean
}

export default function StageDetailPanel({ stage, onClose, hidden = false }: StageDetailPanelProps) {
  const [checksDone,    setChecksDone]   = useState(false)
  const [docModalOpen,  setDocModalOpen]  = useState(false)
  const [labModalOpen,  setLabModalOpen]  = useState(false)
  const [prodDocsOpen,  setProdDocsOpen]  = useState(false)
  const [reviewOpen,    setReviewOpen]    = useState(false)

  useEffect(() => {
    setChecksDone(false)
    setDocModalOpen(false)
    setLabModalOpen(false)
    setProdDocsOpen(false)
    setReviewOpen(false)
    if (stage) {
      const t = setTimeout(() => setChecksDone(true), 700)
      return () => clearTimeout(t)
    }
  }, [stage?.id])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (docModalOpen)  { setDocModalOpen(false);  return }
        if (labModalOpen)  { setLabModalOpen(false);  return }
        if (prodDocsOpen)  { setProdDocsOpen(false);  return }
        if (reviewOpen)    { setReviewOpen(false);    return }
        onClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose, docModalOpen, labModalOpen, prodDocsOpen, reviewOpen])

  return (
    <>
      <AnimatePresence mode="wait">
        {stage && (
          <motion.div
            key={stage.id}
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
              display:        'flex',
              flexDirection:  'column',
              background:     'rgba(2, 8, 4, 0.96)',
              backdropFilter: 'blur(36px)',
              border:         `1.5px solid ${stage.color}50`,
              borderRadius:   20,
              boxShadow:      `0 25px 80px rgba(0,0,0,0.92), 0 0 45px ${stage.color}25`,
              overflow:       'hidden',
              pointerEvents:  hidden ? 'none' : 'auto',
            }}
          >
            {/* Top accent glow line */}
            <div style={{
              height:     2, flexShrink: 0,
              background: `linear-gradient(90deg, transparent, ${stage.color}80, ${stage.color}, ${stage.color}80, transparent)`,
            }} />

            {/* Top Portal Anchor Bar */}
            <div style={{
              flexShrink: 0,
              padding:    '9px 18px 8px 18px',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${stage.color}20`,
              background: 'rgba(255,255,255,0.015)',
            }}>
              {/* Back to helix button */}
              <button
                onClick={onClose}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid rgba(255,255,255,0.12)`,
                  borderRadius: 8, padding: '5px 12px',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 8,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#d0ecd0', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ← BACK TO PROVENANCE
              </button>

              {/* Node Portal Emblem (Center Anchor) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: `${stage.color}1c`, border: `1.5px solid ${stage.color}60`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 14px ${stage.color}70`,
                }}>
                  <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, fontWeight: 700, color: stage.color }}>
                    {stage.number}
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, color: stage.color, letterSpacing: '0.22em', textTransform: 'uppercase', lineHeight: 1 }}>
                    PROVENANCE NODE · STAGE 0{stage.number}
                  </div>
                  <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#f0f8f0' }}>
                    {stage.title}
                  </div>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: `${stage.color}15`, border: `1px solid ${stage.color}40`,
                  borderRadius: 999, padding: '2px 9px',
                }}>
                  <Check size={7} color={stage.color} strokeWidth={3} />
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7.5, color: stage.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close stage panel"
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

            {/* Stage-specific layout */}
            {stage.type === 'farmer'
              ? <FarmerPanelLayout
                  stage={stage}
                  checksDone={checksDone}
                  onClose={onClose}
                  onOpenDoc={() => setDocModalOpen(true)}
                />
              : stage.type === 'lab'
              ? <LabPanelLayout
                  stage={stage}
                  checksDone={checksDone}
                  onClose={onClose}
                  onOpenReport={() => setLabModalOpen(true)}
                />
              : stage.type === 'product'
              ? <ProductPanelLayout
                  stage={stage}
                  checksDone={checksDone}
                  onClose={onClose}
                  onOpenDocs={() => setProdDocsOpen(true)}
                  onOpenReview={() => setReviewOpen(true)}
                />
              : (
                <div style={{ display: 'grid', gridTemplateColumns: '30% 1fr 1fr', gap: 0, minHeight: 0 }}>
                  <Column1Generic stage={stage} checksDone={checksDone} />
                  <Column2Generic stage={stage} />
                  <Column3Generic stage={stage} />
                </div>
              )
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document preview modal */}
      <DocumentPreviewModal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
      />

      {/* Lab report modal */}
      <LabReportModal
        open={labModalOpen}
        onClose={() => setLabModalOpen(false)}
      />

      {/* Product provenance documents modal */}
      <ProductDocumentsModal
        open={prodDocsOpen}
        onClose={() => setProdDocsOpen(false)}
      />

      {/* Stage 5 in-panel review modal (inline ReviewModal) */}
      <PanelReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
      />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════
   LAB PANEL LAYOUT
   3-column scientific view for Stage 2 Laboratory Testing
   Accent colour: #4ea8d2 (blue/cyan)
══════════════════════════════════════════════════════════════════ */

function LabPanelLayout({ stage, checksDone, onClose: _onClose, onOpenReport }: {
  stage:        ProvenanceStage
  checksDone:   boolean
  onClose:      () => void
  onOpenReport: () => void
}) {
  const d    = stage.data as LabStageData
  const C    = stage.color   // #4ea8d2

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '32% 33% 35%', gap: 0, minHeight: 0 }}>

      {/* ═══ COL 1: Lab image + identity + test results ═══ */}
      <div style={{
        padding:     '14px 16px 16px 20px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display:     'flex', flexDirection: 'column', gap: 10,
        overflowY:   'auto',
      }}>
        {/* Lab image banner + identity block */}
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06, duration: 0.35 }}
          style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
        >
          {/* Lab scene image — rectangular with rounded corners */}
          <div style={{
            width: 66, height: 66, borderRadius: 14, flexShrink: 0, overflow: 'hidden',
            border:     `2px solid ${C}50`,
            boxShadow:  `0 0 18px ${C}28, 0 0 0 4px ${C}10`,
          }}>
            <img
              src={d.labImageUrl}
              alt="Laboratory Testing"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>

          {/* Identity */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 3 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 7.5,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: C, marginBottom: 3,
            }}>
              Stage 2 · Laboratory Testing
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 13,
              fontWeight: 700, color: '#dff0f8', lineHeight: 1.2, marginBottom: 2,
            }}>
              {d.labName}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: `${C}90`, marginBottom: 5 }}>
              {d.laboratoryId}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: `${C}14`, border: `1px solid ${C}35`,
              borderRadius: 999, padding: '3px 10px',
            }}>
              <Check size={8} color={C} strokeWidth={3} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: '#7dcfee', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Verified
              </span>
            </div>
          </div>
        </motion.div>

        {/* Key IDs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16, duration: 0.28 }}>
          <div style={{ height: 1, background: `linear-gradient(to right, ${C}45, transparent)`, marginBottom: 8 }} />
          <LabKV label="Test ID"        value={d.testId}           C={C} mono />
          <LabKV label="Sample ID"      value={d.sampleId}         C={C} mono />
          <LabKV label="Batch"          value={d.batchId}          C={C} mono />
          <LabKV label="Sample Rcvd"    value={`${d.sampleReceivedDate}, ${d.sampleReceivedTime}`} C={C} />
          <LabKV label="Report Issued"  value={d.reportIssueDate}  C={C} />
        </motion.div>

        {/* Test results — compact rows with PASS indicators */}
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.28 }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 6,
          }}>
            Test Results
          </div>
          {d.results.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: checksDone ? 1 : 0, x: checksDone ? 0 : -5 }}
              transition={{ delay: 0.40 + i * 0.07, duration: 0.20 }}
              style={{
                display:      'flex', alignItems: 'center', justifyContent: 'space-between',
                padding:      '4px 0',
                borderBottom: '1px solid rgba(124, 255, 79, 0.04)', gap: 8,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10.5, color: '#cce6f5', lineHeight: 1.25 }}>{r.label}</div>
                {r.value !== 'Conforming' && r.value !== 'Within specification' && r.value !== 'Within permissible limits' && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: `${C}80`, marginTop: 1 }}>
                    {r.value}{r.unit ? ` ${r.unit}` : ''}{r.limit ? ` · limit ${r.limit}` : ''}
                  </div>
                )}
              </div>
              {/* PASS badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0,
                padding: '2px 8px', borderRadius: 6,
                background: `${C}12`, border: `1px solid ${C}35`,
                fontFamily: "var(--font-mono)", fontSize: 7.5,
                color: '#7dcfee', letterSpacing: '0.08em',
              }}>
                <Check size={7} color={C} strokeWidth={3} /> PASS
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ═══ COL 2: Location map + chain-of-custody flow ═══ */}
      <div style={{
        padding:     '14px 14px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display:     'flex', flexDirection: 'column', gap: 10,
        overflowY:   'auto',
      }}>
        {/* Location header */}
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.30 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.20em', textTransform: 'uppercase', color: C, marginBottom: 3 }}>
            Laboratory Location
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: '#dff0f8', marginBottom: 2 }}>
            {d.location.city}, {d.location.state}, India
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={8} color="var(--night-dim)" />
            {d.location.lat.toFixed(4)}° N &nbsp; {d.location.lng.toFixed(4)}° E
          </div>
        </motion.div>

        {/* Real Leaflet Location Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.35 }}
          style={{ borderRadius: 13, overflow: 'hidden', position: 'relative', height: 140, border: `1px solid ${C}30` }}
        >
          <LocationMap
            location={d.location}
            type="lab"
            label={d.labName}
            sublabel={d.laboratoryId}
            privacy="internal"
            accuracyM={10}
            statusBadge="TESTING FACILITY VERIFIED"
            height={140}
          />
        </motion.div>

        {/* Chain of custody flow */}
        <motion.div
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.30, duration: 0.28 }}
          style={{ background: `${C}08`, border: `1px solid ${C}20`, borderRadius: 12, padding: '11px 14px' }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: C, marginBottom: 9 }}>
            Sample Chain of Custody
          </div>
          {[
            { label: 'Collection Batch',  sub: `ASH-2026-001 · Nashik`,    date: '14 Aug 2026' },
            { label: 'Sample Received',   sub: `SMP-ASH-001 · ${d.sampleQuantity}`, date: d.sampleReceivedDate },
            { label: 'Laboratory Tested', sub: `${d.labName}`,              date: d.testDate },
            { label: 'Report Issued',     sub: `${d.reportId}`,             date: d.reportIssueDate },
          ].map((step, i, arr) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              {/* Track */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: `${C}18`, border: `1.5px solid ${C}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={8} color={C} strokeWidth={3} />
                </div>
                {i < arr.length - 1 && (
                  <div style={{ width: 1, height: 16, background: `${C}35`, marginTop: 2 }} />
                )}
              </div>
              {/* Content */}
              <div style={{ paddingBottom: i < arr.length - 1 ? 10 : 0, paddingTop: 1 }}>
                <div style={{ fontSize: 10.5, color: '#cce6f5', lineHeight: 1.25 }}>{step.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'var(--night-dim)', marginTop: 1 }}>{step.sub}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: `${C}70`, marginTop: 1 }}>{step.date}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ═══ COL 3: About + Lab Report card + Blockchain + Checks ═══ */}
      <div style={{
        padding: '14px 18px 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 9,
        overflowY: 'auto',
      }}>
        {/* About */}
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20, duration: 0.28 }}
          style={{ background: 'rgba(255,255,255,0.023)', border: `1px solid ${C}1e`, borderRadius: 13, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
            <div style={{ width: 22, height: 22, borderRadius: 7, background: `${C}20`, border: `1px solid ${C}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={11} color={C} />
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: C }}>About This Stage</span>
          </div>
          <p style={{ fontSize: 10.5, color: '#b8d8e8', lineHeight: 1.60, fontFamily: "var(--font-body)" }}>{d.description}</p>
        </motion.div>

        {/* Lab Report card */}
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.26 }}
          style={{ background: `${C}0b`, border: `1px solid ${C}28`, borderRadius: 12, padding: '11px 14px' }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: C, marginBottom: 6 }}>
            Lab Report
          </div>
          <div style={{ fontSize: 11, color: '#cce6f5', marginBottom: 2 }}>Prototype Laboratory Report</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: 'var(--night-dim)', marginBottom: 8 }}>{d.reportId}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Check size={9} color={C} strokeWidth={3} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: '#7dcfee' }}>VERIFIED</span>
            </div>
            <button
              onClick={onOpenReport}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                padding: '5px 12px', borderRadius: 8,
                background: `${C}16`, border: `1px solid ${C}35`,
                color: '#7dcfee', fontFamily: "var(--font-mono)",
                fontSize: 8.5, letterSpacing: '0.10em', textTransform: 'uppercase',
              }}
            >
              <ExternalLink size={9} /> View Lab Report
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 7, padding: '4px 8px', background: 'rgba(255,165,0,0.07)', border: '1px solid rgba(255,165,0,0.22)', borderRadius: 6 }}>
            <AlertTriangle size={7} color="rgba(255,165,0,0.65)" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'rgba(255,165,0,0.60)' }}>
              Demonstration Record — not a real laboratory report
            </span>
          </div>
        </motion.div>

        {/* Verification checks */}
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.26 }}
          style={{ background: 'rgba(255,255,255,0.018)', border: `1px solid ${C}1a`, borderRadius: 13, padding: '11px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <ShieldCheck size={10} color={C} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: C }}>Quality Verification</span>
          </div>
          {d.checks.map((chk, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: checksDone ? 1 : 0, x: checksDone ? 0 : -5 }}
              transition={{ delay: 0.50 + i * 0.09, duration: 0.20 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '4px 0', borderBottom: i < d.checks.length - 1 ? '1px solid rgba(124, 255, 79, 0.04)' : 'none' }}
            >
              <div style={{ width: 15, height: 15, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: `${C}1e`, border: `1px solid ${C}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={7} color={C} strokeWidth={3} />
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: '#cce6f5', lineHeight: 1.30 }}>{chk.label}</div>
                {chk.detail && <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: 'var(--night-dim)', marginTop: 1 }}>{chk.detail}</div>}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Blockchain record */}
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.26 }}
          style={{ background: 'rgba(255,255,255,0.016)', border: `1px solid ${C}18`, borderRadius: 13, padding: '11px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
            <Cpu size={10} color={C} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: C }}>Ledger Record</span>
            <span style={{ marginLeft: 'auto', fontFamily: "var(--font-mono)", fontSize: 7, color: `${C}45`, textTransform: 'uppercase', letterSpacing: '0.10em' }}>PROTOTYPE</span>
          </div>
          <BCRow icon={<Hash size={8}  color="var(--night-dim)" />} label="TX Hash"   value={d.blockchain.txHash}    mono />
          <BCRow icon={<Cpu  size={8}  color="var(--night-dim)" />} label="Block"     value={d.blockchain.blockNum}  mono />
          <BCRow icon={<Clock size={8} color="var(--night-dim)" />} label="Timestamp" value={d.blockchain.timestamp}      />
          <BCRow icon={<Globe size={8} color="var(--night-dim)" />} label="Network"   value={d.blockchain.network}   last />
        </motion.div>
      </div>
    </div>
  )
}

/* ── Lab key-value row (Col 1) ─────────────────────────────────── */
function LabKV({ label, value, C, mono }: { label: string; value: string; C: string; mono?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)', gap: 8,
    }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--night-dim)', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 9 : 10.5, color: '#cce6f5', textAlign: 'right' }}>
        {value}
        {' '}<Check size={7} color={C} strokeWidth={3} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   FARMER PANEL LAYOUT
   Full 3-column rich view for Stage 1 Farmer/Collection
══════════════════════════════════════════════════════════════════ */

function FarmerPanelLayout({ stage, checksDone, onClose: _onClose, onOpenDoc }: {
  stage:      ProvenanceStage
  checksDone: boolean
  onClose:    () => void
  onOpenDoc:  () => void
}) {
  const d = stage.data as FarmerStageData

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '32% 34% 34%',
      gap: 0, minHeight: 0,
    }}>
      {/* ═══ COL 1: Farmer identity + collection key data ═══ */}
      <div style={{
        padding:     '14px 16px 16px 20px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display:     'flex', flexDirection: 'column', gap: 10,
        overflowY:   'auto',
      }}>
        {/* Farmer avatar + identity */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06, duration: 0.35 }}
          style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
        >
          {/* Circular farmer image */}
          <div style={{
            width: 66, height: 66, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
            border: `2px solid ${stage.color}55`,
            boxShadow: `0 0 18px ${stage.color}30, 0 0 0 4px ${stage.color}12`,
          }}>
            <img
              src={d.farmerImageUrl}
              alt="Mahesh Patil — Collector"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>

          {/* Name + role + verified */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 3 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 7.5,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: stage.color, marginBottom: 3,
            }}>
              Stage 1 · Farmer / Collection
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 16,
              fontWeight: 700, color: '#e4ede0', lineHeight: 1.15, marginBottom: 2,
            }}>
              {d.farmerName}
            </div>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 10.5, color: 'rgba(200,220,190,0.65)',
              marginBottom: 5,
            }}>
              {d.farmerRole}
            </div>
            {/* Verified pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(124, 255, 79,0.12)', border: '1px solid rgba(124, 255, 79,0.32)',
              borderRadius: 999, padding: '3px 10px',
            }}>
              <ShieldCheck size={9} color="#7CFF4F" strokeWidth={2.5} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 8,
                color: '#7CFF4F', letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Verified
              </span>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(to right, ${stage.color}45, transparent)` }} />

        {/* Key collection data rows */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.30 }}
          style={{ flex: 1 }}
        >
          <FarmerDataRow icon={<User size={9} color={stage.color} />}       label="Collector Name"    value={d.farmerName}                  color={stage.color} />
          <FarmerDataRow icon={<Leaf size={9} color={stage.color} />}       label="Cooperative"       value={d.farmerCooperative}           color={stage.color} />
          <FarmerDataRow icon={<MapPin size={9} color={stage.color} />}     label="District"          value={`${d.farmerDistrict}, ${d.farmerState}`} color={stage.color} />
          <FarmerDataRow icon={<Hash size={9} color={stage.color} />}       label="Collection ID"     value={d.collectionId}                color={stage.color} mono />
          <FarmerDataRow icon={<Hash size={9} color={stage.color} />}       label="Batch ID"          value={d.batchId}                     color={stage.color} mono />
          <FarmerDataRow icon={<Leaf size={9} color={stage.color} />}       label="Botanical Species" value={d.botanicalName}               color={stage.color} italic />
          <FarmerDataRow icon={<Leaf size={9} color={stage.color} />}       label="Plant Part"        value={d.partUsed}                    color={stage.color} />
          <FarmerDataRow icon={<Clock size={9} color={stage.color} />}      label="Harvest Date"      value={d.date}                        color={stage.color} />
          <FarmerDataRow icon={<Scale size={9} color={stage.color} />}      label="Qty Collected"     value={d.totalCollection}             color={stage.color} />
        </motion.div>
      </div>

      {/* ═══ COL 2: Location map + GPS + Document card ═══ */}
      <div style={{
        padding:     '14px 14px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display:     'flex', flexDirection: 'column', gap: 10,
        overflowY:   'auto',
      }}>
        {/* Location header */}
        <motion.div
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.30 }}
        >
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 8,
            letterSpacing: '0.20em', textTransform: 'uppercase',
            color: stage.color, marginBottom: 3,
          }}>
            Location
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 14,
            fontWeight: 600, color: '#e4ede0', marginBottom: 2,
          }}>
            {d.location.city}, {d.location.state}, India
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <MapPin size={8} color="var(--night-dim)" />
            {d.location.lat.toFixed(4)}° N &nbsp; {d.location.lng.toFixed(4)}° E
          </div>
        </motion.div>

        {/* Real Leaflet Location Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.24, duration: 0.35 }}
          style={{
            height: 145, borderRadius: 13, overflow: 'hidden',
            position: 'relative', border: `1px solid ${stage.color}28`,
          }}
        >
          <LocationMap
            location={d.location}
            type="farmer"
            label={`${d.farmerName} — Collection`}
            sublabel={`${d.location.city}, ${d.location.state}`}
            privacy="customer"
            accuracyM={d.gpsAccuracyM}
            statusBadge="GPS CAPTURED ✓ LOCATION VERIFIED ✓"
            height={145}
          />
        </motion.div>

        {/* GPS detail row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.25 }}
          style={{
            display: 'flex', gap: 6, flexWrap: 'wrap',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            background: 'rgba(124, 255, 79,0.08)', border: '1px solid rgba(124, 255, 79,0.22)',
            borderRadius: 8, padding: '5px 10px',
          }}>
            <Navigation size={9} color="#7CFF4F" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: '#7CFF4F', letterSpacing: '0.06em' }}>
              GPS Source Verified
            </span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(124, 255, 79, 0.04)', border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8, padding: '5px 10px',
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: 'var(--night-dim)' }}>
              GPS Accuracy: ±{d.gpsAccuracyM} m
            </span>
          </div>
        </motion.div>

        {/* Botanical Source Record card with "View Document" */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.28 }}
          style={{
            background:   `${stage.color}0c`,
            border:       `1px solid ${stage.color}28`,
            borderRadius: 12, padding: '11px 14px',
          }}
        >
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 8,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: stage.color, marginBottom: 6,
          }}>
            Botanical Source Record
          </div>
          <div style={{ fontSize: 11, color: '#d4e8ce', marginBottom: 2 }}>
            Botanical Source / Collection Record
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 8.5,
            color: 'var(--night-dim)', marginBottom: 8,
          }}>
            {d.documents[0].ref}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Check size={9} color="#7CFF4F" strokeWidth={3} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: '#7CFF4F' }}>
                VERIFIED
              </span>
            </div>
            {/* View Document button */}
            <button
              onClick={onOpenDoc}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                padding: '5px 12px', borderRadius: 8,
                background: 'rgba(124, 255, 79,0.14)', border: '1px solid rgba(124, 255, 79,0.32)',
                color: '#7CFF4F', fontFamily: "var(--font-mono)",
                fontSize: 8.5, letterSpacing: '0.10em', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
            >
              <ExternalLink size={9} /> View Document
            </button>
          </div>
          {/* Prototype label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4, marginTop: 7,
            padding: '4px 8px', background: 'rgba(255,165,0,0.07)',
            border: '1px solid rgba(255,165,0,0.22)', borderRadius: 6,
          }}>
            <AlertTriangle size={7} color="rgba(255,165,0,0.65)" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'rgba(255,165,0,0.60)' }}>
              Prototype Record — not an official document
            </span>
          </div>
        </motion.div>
      </div>

      {/* ═══ COL 3: About + Source Verification + Blockchain ═══ */}
      <div style={{
        padding: '14px 18px 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 10,
        overflowY: 'auto',
      }}>
        {/* About card */}
        <motion.div
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.20, duration: 0.30 }}
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
              <Leaf size={11} color={stage.color} />
            </div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 8.5,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: stage.color,
            }}>
              About This Stage
            </span>
          </div>
          <p style={{ fontSize: 10.5, color: '#b8d8b2', lineHeight: 1.60, fontFamily: "var(--font-body)" }}>
            {d.description}
          </p>
        </motion.div>

        {/* Source verification checklist */}
        <motion.div
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.30, duration: 0.28 }}
          style={{
            background: 'rgba(255,255,255,0.02)', border: `1px solid ${stage.color}20`,
            borderRadius: 13, padding: '11px 14px',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
          }}>
            <ShieldCheck size={10} color={stage.color} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 8.5,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: stage.color,
            }}>
              Source Verification
            </span>
          </div>
          {d.checks.map((chk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: checksDone ? 1 : 0, x: checksDone ? 0 : -5 }}
              transition={{ delay: 0.50 + i * 0.08, duration: 0.20 }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 7,
                padding: '4px 0', borderBottom: i < d.checks.length - 1 ? '1px solid rgba(124, 255, 79, 0.04)' : 'none',
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
                <div style={{ fontSize: 10.5, color: '#e4ede0', lineHeight: 1.30 }}>{chk.label}</div>
                {chk.detail && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: 'var(--night-dim)', marginTop: 1 }}>
                    {chk.detail}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Blockchain / Ledger record */}
        <motion.div
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.40, duration: 0.28 }}
          style={{
            background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(124, 255, 79,0.16)',
            borderRadius: 13, padding: '11px 14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
            <Cpu size={10} color="#7CFF4F" />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 8.5,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7CFF4F',
            }}>
              Blockchain / Ledger Record
            </span>
            <span style={{
              marginLeft: 'auto', fontFamily: "var(--font-mono)", fontSize: 7,
              color: 'rgba(124, 255, 79,0.42)', textTransform: 'uppercase', letterSpacing: '0.10em',
            }}>
              PROTOTYPE DEMO
            </span>
          </div>
          <BCRow icon={<Hash size={8}  color="var(--night-dim)" />} label="Transaction ID" value={d.blockchain.txHash}    mono />
          <BCRow icon={<Cpu  size={8}  color="var(--night-dim)" />} label="Block Number"   value={d.blockchain.blockNum}  mono />
          <BCRow icon={<Clock size={8} color="var(--night-dim)" />} label="Timestamp"      value={d.blockchain.timestamp}      />
          <BCRow icon={<Globe size={8} color="var(--night-dim)" />} label="Network"        value={d.blockchain.network}   last />
        </motion.div>
      </div>
    </div>
  )
}

/* ── Farmer data row ─────────────────────────────────────────────── */
function FarmerDataRow({ icon, label, value, color, mono, italic }: {
  icon: React.ReactNode; label: string; value: string
  color: string; mono?: boolean; italic?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        {icon}
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 7.5,
          letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--night-dim)',
        }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, textAlign: 'right' }}>
        <span style={{
          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
          fontSize: mono ? 9 : 10.5, color: '#e0eedc',
          fontStyle: italic ? 'italic' : 'normal',
        }}>
          {value}
        </span>
        <Check size={7} color={color} strokeWidth={3} style={{ flexShrink: 0 }} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   GENERIC 3-COLUMN LAYOUT (stages 2–5)
══════════════════════════════════════════════════════════════════ */

function Column1Generic({ stage, checksDone }: { stage: ProvenanceStage; checksDone: boolean }) {
  const d = stage.data
  return (
    <div style={{
      padding:     '16px 18px 16px 22px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display:     'flex', flexDirection: 'column', gap: 10,
      overflowY:   'auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.30 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: `${stage.color}18`, border: `1.5px solid ${stage.color}45`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: stage.color }}>
            {stage.number}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: stage.color, marginBottom: 2 }}>
            {stage.subtitle}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: '#e4ede0', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stage.title}
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0, background: 'rgba(124, 255, 79,0.12)', border: '1px solid rgba(124, 255, 79,0.30)', borderRadius: 999, padding: '3px 9px' }}>
          <Check size={8} color="#7CFF4F" strokeWidth={3} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.14em', color: '#7CFF4F', textTransform: 'uppercase' }}>Verified</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14, duration: 0.28 }} style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <MicroTag icon={<ShieldCheck size={9} color={stage.color} />} text={d.entity} color={stage.color} />
        <MicroTag icon={<Clock size={9} color="var(--night-dim)" />}  text={d.date}   color="var(--night-dim)" />
      </motion.div>

      <div style={{ height: 1, background: `linear-gradient(to right, ${stage.color}40, transparent)` }} />

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.30 }} style={{ flex: 1 }}>
        <StageKeyRows stage={stage} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28, duration: 0.28 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 5 }}>
          Verification
        </div>
        {d.checks.slice(0, 4).map((chk, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: checksDone ? 1 : 0, x: checksDone ? 0 : -5 }}
            transition={{ delay: 0.45 + i * 0.09, duration: 0.22 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)' }}
          >
            <div style={{ width: 15, height: 15, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: `${stage.color}1e`, border: `1px solid ${stage.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={7} color={stage.color} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: '#e4ede0', lineHeight: 1.35 }}>{chk.label}</div>
              {chk.detail && <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: 'var(--night-dim)', marginTop: 1 }}>{chk.detail}</div>}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function Column2Generic({ stage }: { stage: ProvenanceStage }) {
  const loc = stage.data.location
  return (
    <div style={{
      padding:     '16px 16px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display:     'flex', flexDirection: 'column', gap: 10,
      overflowY:   'auto',
    }}>
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.30 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.20em', textTransform: 'uppercase', color: stage.color, marginBottom: 4 }}>{loc.label}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: '#e4ede0', marginBottom: 3 }}>{loc.city}, {loc.state}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <MapPin size={9} color="var(--night-dim)" />{loc.lat.toFixed(4)}° N, {loc.lng.toFixed(4)}° E
        </div>
      </motion.div>

      {/* Real Leaflet Location Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.26, duration: 0.38 }}
        style={{ height: 145, borderRadius: 14, overflow: 'hidden', position: 'relative', border: `1px solid ${stage.color}25` }}
      >
        <LocationMap
          location={loc}
          type={stage.type as any}
          label={loc.label}
          sublabel={`${loc.city}, ${loc.state}`}
          privacy="customer"
          statusBadge="LOCATION VERIFIED"
          height={145}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38, duration: 0.25 }}
        style={{ background: `${stage.color}0e`, border: `1px solid ${stage.color}25`, borderRadius: 10, padding: '8px 12px' }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: stage.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3 }}>Responsible Entity</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: '#d4e8ce' }}>{stage.data.entity}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: 'var(--night-dim)', marginTop: 2 }}>{stage.data.entityType}</div>
      </motion.div>
    </div>
  )
}

function Column3Generic({ stage }: { stage: ProvenanceStage }) {
  const d = stage.data
  return (
    <div style={{ padding: '16px 20px 16px 14px', display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.30 }}
        style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${stage.color}1e`, borderRadius: 13, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, background: `${stage.color}20`, border: `1px solid ${stage.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StageIconSmall type={stage.type} color={stage.color} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: stage.color }}>About This Stage</span>
        </div>
        <p style={{ fontSize: 11, color: '#b8d8b2', lineHeight: 1.60, fontFamily: "var(--font-body)" }}>{d.description}</p>
      </motion.div>

      <StageExtraContent stage={stage} />

      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, duration: 0.28 }}
        style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13, padding: '11px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <FileText size={10} color="var(--night-dim)" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--night-dim)' }}>Linked Documents</span>
          <span style={{ marginLeft: 'auto', fontFamily: "var(--font-mono)", fontSize: 7, color: 'rgba(255,165,0,0.55)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>⚠ PROTOTYPE</span>
        </div>
        {d.documents.slice(0, 4).map((doc, i) => <DocRow key={i} doc={doc} />)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.28 }}
        style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(124, 255, 79,0.16)', borderRadius: 13, padding: '11px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
          <Cpu size={10} color="#7CFF4F" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7CFF4F' }}>Ledger Record</span>
          <span style={{ marginLeft: 'auto', fontFamily: "var(--font-mono)", fontSize: 7, color: 'rgba(124, 255, 79,0.42)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>PROTOTYPE</span>
        </div>
        <BCRow icon={<Hash size={8}  color="var(--night-dim)" />} label="TX Hash"   value={d.blockchain.txHash}    mono />
        <BCRow icon={<Cpu  size={8}  color="var(--night-dim)" />} label="Block"     value={d.blockchain.blockNum}  mono />
        <BCRow icon={<Clock size={8} color="var(--night-dim)" />} label="Timestamp" value={d.blockchain.timestamp}      />
        <BCRow icon={<Globe size={8} color="var(--night-dim)" />} label="Network"   value={d.blockchain.network}   last />
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   STAGE-SPECIFIC EXTRA CONTENT (Column 3 of generic layout)
══════════════════════════════════════════════════════════════════ */
function StageExtraContent({ stage }: { stage: ProvenanceStage }) {
  switch (stage.type) {
    case 'lab':           return <LabResultsCard      data={stage.data as LabStageData}            color={stage.color} />
    case 'transport':     return <TransportMetricsCard data={stage.data as TransportStageData}     color={stage.color} />
    case 'manufacturing': return <MfgStepsCard         data={stage.data as ManufacturingStageData} color={stage.color} />
    case 'product':       return <ProductChainCard     data={stage.data as ProductStageData}       color={stage.color} />
    default:              return null
  }
}

function LabResultsCard({ data, color }: { data: LabStageData; color: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <Microscope size={10} color={color} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>Test Results</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#7CFF4F', padding: '5px 9px', background: 'rgba(124, 255, 79,0.08)', borderRadius: 7, marginBottom: 7 }}>
        Withanolide content: {data.withanolideContent}
      </div>
      {data.results.slice(0, 4).map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)' }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: 'var(--night-dim)', flexShrink: 0 }}>{r.label}</span>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#e0eedc' }}>{r.value}{r.unit ? ` ${r.unit}` : ''}</span>
            {r.limit && <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'var(--night-dim)' }}>limit {r.limit}</div>}
          </div>
          <Check size={8} color={color} strokeWidth={3} style={{ marginLeft: 5, marginTop: 2, flexShrink: 0 }} />
        </div>
      ))}
    </motion.div>
  )
}

function TransportMetricsCard({ data, color }: { data: TransportStageData; color: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <TruckIcon size={10} color={color} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>Transit Conditions</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "var(--font-mono)", fontSize: 8.5, color: '#d4e8ce', padding: '5px 9px', background: `${color}0d`, borderRadius: 7, marginBottom: 7 }}>
        <span style={{ color }}>{data.origin.split(',')[0]}</span>
        <ArrowRight size={9} color="var(--night-dim)" />
        <span style={{ color }}>{data.destination.split(',')[0]}</span>
        <span style={{ color: 'var(--night-dim)', marginLeft: 'auto' }}>{data.distanceKm} km</span>
      </div>
      {data.metrics.slice(0, 5).map((m, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)' }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: 'var(--night-dim)' }}>{m.label}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 10, color: '#e0eedc' }}>{m.value}</span>
            <Check size={7} color={color} strokeWidth={3} />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function MfgStepsCard({ data, color }: { data: ManufacturingStageData; color: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <Boxes size={10} color={color} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>Process Steps</span>
        <span style={{ marginLeft: 'auto', fontFamily: "var(--font-mono)", fontSize: 8, color: 'var(--night-dim)' }}>{data.steps.length} steps</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: '#7CFF4F', padding: '4px 9px', background: `${color}0d`, borderRadius: 7, marginBottom: 7 }}>
        {data.dosagePerUnit} per tablet · {data.tabletCount} tablets/bottle
      </div>
      {data.steps.slice(0, 4).map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: `${color}18`, border: `1px solid ${color}45`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-mono)", fontSize: 7, color }}>{s.step}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: '#e4ede0' }}>{s.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'var(--night-dim)', marginTop: 1 }}>{s.detail}</div>
          </div>
          <Check size={7} color={color} strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} />
        </div>
      ))}
    </motion.div>
  )
}

function ProductChainCard({ data, color }: { data: ProductStageData; color: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.29, duration: 0.25 }}
      style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}20`, borderRadius: 13, padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
        <ThumbsUp size={10} color={color} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>Chain Summary</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "var(--font-mono)", fontSize: 8, color: '#7CFF4F' }}>
          <ShieldCheck size={9} color="#7CFF4F" /> 5 / 5
        </span>
      </div>
      {data.chainSummary.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)' }}>
          <div>
            <div style={{ fontSize: 10, color: '#e4ede0' }}>{s.stage}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'var(--night-dim)' }}>{s.eventId}</div>
          </div>
          <Check size={9} color={color} strokeWidth={3} />
        </div>
      ))}
      <div style={{ marginTop: 8, padding: '6px 9px', background: `${color}0d`, borderRadius: 7, fontFamily: "var(--font-mono)", fontSize: 8.5, color: '#7CFF4F' }}>
        Pack: {data.packSerial} · {data.tabletCount} tablets · Exp. {data.expiry}
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   GENERIC COLUMN 1 — stage-specific key-value rows
══════════════════════════════════════════════════════════════════ */
function StageKeyRows({ stage }: { stage: ProvenanceStage }) {
  switch (stage.type) {
    case 'lab': {
      const d = stage.data as LabStageData
      return (
        <div>
          <KV label="Laboratory"    value={d.labName}           c={stage.color} />
          <KV label="Accreditation" value={d.accreditation}     c={stage.color} />
          <KV label="Sample ID"     value={d.sampleId}          c={stage.color} mono />
          <KV label="Certificate"   value={d.certificateId}     c={stage.color} mono />
          <KV label="Test Period"   value={d.testDate}          c={stage.color} />
        </div>
      )
    }
    case 'transport': {
      const d = stage.data as TransportStageData
      return (
        <div>
          <KV label="Carrier"    value={d.carrier}          c={stage.color} />
          <KV label="Vehicle"    value={d.vehicleId}        c={stage.color} mono />
          <KV label="Pickup"     value={d.pickupDate}       c={stage.color} />
          <KV label="Delivery"   value={d.deliveryDate}     c={stage.color} />
          <KV label="Condition"  value={d.storageCondition} c={stage.color} />
        </div>
      )
    }
    case 'manufacturing': {
      const d = stage.data as ManufacturingStageData
      return (
        <div>
          <KV label="Manufacturer" value={d.manufacturer}                                   c={stage.color} />
          <KV label="MFG Licence"  value={d.facilityLicense.split('·')[0].trim()}          c={stage.color} mono />
          <KV label="GMP Cert."    value={d.gmpCertificate.split('·')[0].trim()}           c={stage.color} mono />
          <KV label="Input Batch"  value={d.inputBatch}                                    c={stage.color} mono />
          <KV label="Output Batch" value={d.outputBatch}                                   c={stage.color} mono />
        </div>
      )
    }
    case 'product': {
      const d = stage.data as ProductStageData
      return (
        <div>
          <KV label="Product"    value={d.productName}  c={stage.color} />
          <KV label="Brand"      value={d.brand}        c={stage.color} />
          <KV label="SKU"        value={d.skuCode}      c={stage.color} mono />
          <KV label="Pack"       value={d.packSerial}   c={stage.color} mono />
          <KV label="Mfg"        value={d.manufactured} c={stage.color} />
          <KV label="Expiry"     value={d.expiry}       c={stage.color} />
        </div>
      )
    }
    default: return null
  }
}

/* ══════════════════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════════════════ */

function KV({ label, value, c, mono }: { label: string; value: string; c: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)', gap: 8 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--night-dim)', flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 9 : 10.5, color: '#e0eedc', textAlign: 'right' }}>
        {value}{' '}<Check size={7} color={c} strokeWidth={3} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </span>
    </div>
  )
}

function MicroTag({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(124, 255, 79, 0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 999, padding: '3px 9px', fontFamily: "var(--font-body)", fontSize: 10, color, maxWidth: '100%', overflow: 'hidden' }}>
      {icon}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  )
}

function DocRow({ doc }: { doc: LinkedDocument }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)' }}>
      <FileText size={8} color="rgba(255,165,0,0.55)" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: '#c8dcc4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.label}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'var(--night-dim)' }}>
          {doc.ref}{doc._proto && <span style={{ color: 'rgba(255,165,0,0.45)', marginLeft: 5 }}>[prototype]</span>}
        </div>
      </div>
    </div>
  )
}

function BCRow({ icon, label, value, mono, last }: { icon: React.ReactNode; label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, padding: '5px 0', borderBottom: last ? 'none' : '1px solid rgba(124, 255, 79, 0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--night-dim)' }}>
        {icon} {label}
      </div>
      <div style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 9 : 10.5, color: '#c8e0c4', textAlign: 'right', wordBreak: 'break-all' }}>
        {value}
      </div>
    </div>
  )
}

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

/* Suppress unused import warnings */
void Scale
void Navigation
void AlertTriangle
void ExternalLink
void User

/* ══════════════════════════════════════════════════════════════════
   PRODUCT PANEL LAYOUT
   The CLIMAX stage — Stage 5 Final Product / Packaging
   Accent colour: #7CFF4F (Root to Remedy green)

   Col1: Product bottle image + QR identity + product identity card
   Col2: 5/5 Traceability arc + chain summary indicators
   Col3: Documents section + Customer verification block + CTA
══════════════════════════════════════════════════════════════════ */

const STAGE_COLORS: Record<string, string> = {
  farmer:        '#7CFF4F',
  lab:           '#4ea8d2',
  transport:     '#8b6cd4',
  manufacturing: '#e8a84a',
  product:       '#7CFF4F',
}

function ProductPanelLayout({ stage, checksDone, onClose: _onClose, onOpenDocs, onOpenReview }: {
  stage:         ProvenanceStage
  checksDone:    boolean
  onClose:       () => void
  onOpenDocs:    () => void
  onOpenReview:  () => void
}) {
  const d = stage.data as ProductStageData
  const C = '#7CFF4F'

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '34% 30% 36%', gap: 0, minHeight: 0 }}>

      {/* ═══ COL 1: Bottle image + QR identity + product card ═══ */}
      <div style={{
        padding: '10px 14px 14px 18px', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto',
      }}>
        {/* Product bottle photo + verification badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.04, duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', alignSelf: 'center' }}
        >
          <div style={{
            width: 90, height: 112, borderRadius: 16, overflow: 'hidden',
            border: `2px solid ${C}55`,
            boxShadow: `0 0 28px ${C}28, 0 0 0 5px ${C}10, 0 8px 32px rgba(0,0,0,0.60)`,
          }}>
            <img
              src={d.productImageUrl}
              alt="Himalaya Ashwagandha"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
          {/* Verified badge */}
          <div style={{
            position: 'absolute', bottom: -8, right: -8,
            width: 28, height: 28, borderRadius: '50%',
            background: `${C}22`, border: `2px solid ${C}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 14px ${C}60`,
          }}>
            <Check size={13} color={C} strokeWidth={3} />
          </div>
        </motion.div>

        {/* Product identity */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.28 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${C}80`, marginBottom: 2, textAlign: 'center' }}>
            ✓ Product Verified
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: '#dff0f8', textAlign: 'center', lineHeight: 1.2, marginBottom: 1 }}>
            {d.productName}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: 'var(--night-dim)', textAlign: 'center', marginBottom: 6 }}>
            Pure Herbs &nbsp;·&nbsp; {d.tabletCount} Tablets
          </div>
          <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C}40, transparent)`, marginBottom: 7 }} />
          {[
            { label: 'Batch',       value: d.batchCode,   mono: true },
            { label: 'SKU',         value: d.skuCode,     mono: true },
            { label: 'Mfg.',        value: d.manufactured             },
            { label: 'Expiry',      value: d.expiry                   },
          ].map(({ label, value, mono }, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)', gap: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--night-dim)', flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 9 : 10, color: '#dff0f8', textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </motion.div>

        {/* QR Provenance Link */}
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.26 }}
          style={{ background: `${C}08`, border: `1px solid ${C}28`, borderRadius: 11, padding: '9px 12px' }}
        >
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: C, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Package size={8} color={C} /> QR Provenance Link
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: '#a8e890', letterSpacing: '0.04em', wordBreak: 'break-all', lineHeight: 1.4 }}>
            {d.qrIdentifier}
          </div>
          <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C, boxShadow: `0 0 6px ${C}` }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: `${C}80`, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Active · Scan Verified</span>
          </div>
        </motion.div>
      </div>

      {/* ═══ COL 2: 5/5 Traceability + chain summary ═══ */}
      <div style={{
        padding: '10px 12px', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto',
      }}>
        {/* Traceability header */}
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.28 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: C, marginBottom: 3 }}>
            Traceability
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: '#dff0f8', lineHeight: 1.1 }}>
            {d.stagesVerified} / 5 <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--night-dim)' }}>stages</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: `${C}90`, marginTop: 2 }}>
            {d.traceabilityPct}% TRACEABLE
          </div>
        </motion.div>

        {/* Arc / ring indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.20, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px 0' }}
        >
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke={`${C}15`} strokeWidth="6" />
            <motion.circle
              cx="45" cy="45" r="36"
              fill="none" stroke={C} strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - d.traceabilityPct / 100)}`}
              transform="rotate(-90 45 45)"
              initial={{ strokeDashoffset: `${2 * Math.PI * 36}` }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 36 * (1 - d.traceabilityPct / 100)}` }}
              transition={{ delay: 0.45, duration: 1.2, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${C}90)` }}
            />
            <text x="45" y="41" textAnchor="middle" fontFamily="var(--font-display)" fontSize="16" fontWeight="800" fill="#dff0f8">{d.traceabilityPct}%</text>
            <text x="45" y="55" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill={`${C}80`} letterSpacing="1">TRACEABLE</text>
          </svg>
        </motion.div>

        {/* Stage chain summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {d.chainSummary.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: checksDone ? 1 : 0, x: checksDone ? 0 : -6 }}
              transition={{ delay: 0.40 + i * 0.09, duration: 0.22 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {/* Connector track */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: `${s.color}18`, border: `1.5px solid ${s.color}60`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={9} color={s.color} strokeWidth={3} />
                </div>
                {i < d.chainSummary.length - 1 && (
                  <div style={{ width: 1, height: 12, background: `${s.color}30`, margin: '2px 0' }} />
                )}
              </div>
              <div style={{ paddingBottom: i < d.chainSummary.length - 1 ? 6 : 0 }}>
                <div style={{ fontSize: 11, color: '#dff0f8', lineHeight: 1.2 }}>{s.stage}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'var(--night-dim)', marginTop: 1 }}>{s.eventId}</div>
              </div>
              <div style={{ marginLeft: 'auto', paddingBottom: i < d.chainSummary.length - 1 ? 6 : 0, flexShrink: 0 }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 7,
                  padding: '2px 6px', borderRadius: 5,
                  background: `${s.color}12`, border: `1px solid ${s.color}30`, color: s.color,
                  letterSpacing: '0.08em',
                }}>✓</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ COL 3: Documents + Customer Verify + CTA ═══ */}
      <div style={{
        padding: '10px 16px 14px 10px',
        display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto',
      }}>
        {/* Documents section */}
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.28 }}
          style={{ background: 'rgba(255,255,255,0.022)', border: `1px solid ${C}18`, borderRadius: 13, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={9} color={C} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: C }}>
                Provenance Documents
              </span>
            </div>
            <button
              onClick={onOpenDocs}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                padding: '4px 10px', borderRadius: 7,
                background: `${C}14`, border: `1px solid ${C}30`,
                color: '#7CFF4F', fontFamily: "var(--font-mono)",
                fontSize: 8, letterSpacing: '0.10em', textTransform: 'uppercase',
              }}
            >
              <ExternalLink size={8} /> View All
            </button>
          </div>
          {d.documents.map((doc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < d.documents.length - 1 ? '1px solid rgba(124, 255, 79, 0.04)' : 'none' }}>
              <Check size={8} color={C} strokeWidth={3} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: '#dff0f8', lineHeight: 1.25 }}>{doc.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'var(--night-dim)', marginTop: 1 }}>{doc.ref}</div>
              </div>
              <button
                onClick={onOpenDocs}
                style={{
                  flexShrink: 0, padding: '2px 8px', borderRadius: 6, cursor: 'pointer',
                  background: `${C}10`, border: `1px solid ${C}25`,
                  fontFamily: "var(--font-mono)", fontSize: 7.5, color: `${C}90`,
                }}
              >View</button>
            </div>
          ))}
        </motion.div>

        {/* Customer verify block */}
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.26 }}
          style={{ background: `${C}08`, border: `1px solid ${C}25`, borderRadius: 12, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <ShieldCheck size={10} color={C} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: C }}>
              Verify This Product
            </span>
          </div>
          {[
            { label: 'Batch',  value: d.batchCode      },
            { label: 'QR',     value: d.qrIdentifier   },
            { label: 'Status', value: 'AUTHENTIC PROVENANCE RECORD', highlight: true },
          ].map(({ label, value, highlight }, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '3px 0', borderBottom: i < 2 ? '1px solid rgba(124, 255, 79, 0.04)' : 'none', gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--night-dim)', flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: highlight ? 8 : 8.5, color: highlight ? C : '#dff0f8', textAlign: 'right', fontWeight: highlight ? 600 : 400 }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop: 7, textAlign: 'center', fontFamily: "var(--font-mono)", fontSize: 8.5, color: 'var(--night-dim)', letterSpacing: '0.14em' }}>
            Scan → Trace → Verify
          </div>
        </motion.div>

        {/* CTA — Share Your Experience */}
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.26 }}>
          <button
            onClick={onOpenReview}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '10px 0', borderRadius: 11, cursor: 'pointer',
              background: `linear-gradient(135deg, ${C}1a, ${C}08)`,
              border: `1.5px solid ${C}40`,
              color: '#7CFF4F', fontFamily: "var(--font-display)",
              fontSize: 12, fontWeight: 600, letterSpacing: '0.04em',
              boxShadow: `0 0 18px ${C}12`,
              transition: 'all 0.22s',
            }}
          >
            <Leaf size={12} color="#7CFF4F" />
            Share Your Experience
          </button>
          <div style={{ textAlign: 'center', marginTop: 5, fontFamily: "var(--font-mono)", fontSize: 8, color: 'var(--night-dim)', letterSpacing: '0.12em' }}>
            Enter scratch code on bottle back to leave a verified review
          </div>
        </motion.div>

        {/* Bottom: 100% traceable tagline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.50, duration: 0.28 }}
          style={{ marginTop: 'auto', textAlign: 'center', padding: '6px 0' }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 10.5, color: `${C}70`, fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1.45 }}>
            This product is 100% traceable<br/>from root to remedy
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   PanelReviewModal — self-contained scratch code + review modal
   for Stage 5, launched from within StageDetailPanel.

   IMPORTANT: Uses AnimatePresence + motion correctly so that
   when `open` flips to false, the exit animation plays and ALL
   DOM (backdrop + card) is removed. No lingering overlay, no
   pointer-event-blocking layers.
══════════════════════════════════════════════════════════════════ */

const PANEL_SCRATCH_CODE = 'R2R-60-2026'
const PANEL_REVIEW_TAGS  = ['Sleep', 'Stress', 'Energy', 'Immunity', 'Digestion']

interface PanelReviewModalProps {
  open:    boolean
  onClose: () => void
}

function PanelReviewModal({ open, onClose }: PanelReviewModalProps) {
  const [phase,  setPhase]  = useState<'code' | 'verified' | 'form' | 'done'>('code')
  const [code,   setCode]   = useState('')
  const [error,  setError]  = useState('')
  const [rating, setRating] = useState(0)
  const [text,   setText]   = useState('')
  const [tags,   setTags]   = useState<string[]>([])

  const verify = () => {
    const entered = code.trim().toUpperCase()
    if (entered === PANEL_SCRATCH_CODE) {
      setError('')
      setPhase('verified')
      setTimeout(() => setPhase('form'), 900)
    } else {
      setError(`Code not recognised. Use the demo code: ${PANEL_SCRATCH_CODE}`)
    }
  }

  const submit = () => {
    if (rating === 0) return
    try {
      const prev = JSON.parse(localStorage.getItem('rtr_reviews') || '[]')
      localStorage.setItem('rtr_reviews', JSON.stringify([{ rating, text, tags, createdAt: new Date().toLocaleDateString('en-IN') }, ...prev]))
    } catch { /* ignore */ }
    setPhase('done')
  }

  // Call onClose FIRST — parent sets open=false, AnimatePresence runs exit animation,
  // then DOM is fully removed. State reset happens after the exit animation.
  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setPhase('code'); setCode(''); setError('')
      setRating(0); setText(''); setTags([])
    }, 450)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — pointer-events removed when open=false → AnimatePresence removes from DOM */}
          <motion.div
            key="panel-review-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.26 }}
            onClick={handleClose}
            style={{ position: 'fixed', inset: 0, zIndex: 88, background: 'rgba(3,8,2,0.90)', backdropFilter: 'blur(12px)' }}
          />
          {/* Modal card */}
          <motion.div
            key="panel-review-modal"
            initial={{ opacity: 0, scale: 0.94, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 22 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              zIndex: 90, width: 'min(520px, 94vw)', maxHeight: '88vh', overflowY: 'auto',
              background: 'rgba(6,14,4,0.97)', backdropFilter: 'blur(28px)',
              border: '1px solid rgba(124, 255, 79,0.28)', borderTop: '2px solid rgba(124, 255, 79,0.65)',
              borderRadius: 22, padding: '28px 28px 30px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.75), 0 0 60px rgba(124, 255, 79,0.08)',
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--night-dim)' }}
            >
              <X size={14} />
            </button>

            {/* ── Code entry ── */}
            {phase === 'code' && (
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#7CFF4F', marginBottom: 7 }}>
                  Share Your Experience
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: '#e4ede0', marginBottom: 14 }}>
                  Enter Scratch Code
                </div>
                <p style={{ fontSize: 13, color: 'var(--night-dim)', marginBottom: 18, lineHeight: 1.6 }}>
                  Scratch the panel on the back of your bottle to reveal your unique code. Enter it below to leave a verified review.
                </p>
                <div style={{ display: 'flex', gap: 9, marginBottom: 8 }}>
                  <input
                    value={code}
                    onChange={e => { setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12)); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && verify()}
                    placeholder="R2R-60-XXXX"
                    autoFocus
                    style={{
                      flex: 1, height: 48, padding: '0 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${error ? 'rgba(200,80,60,0.5)' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 13, color: '#e4ede0',
                      fontFamily: "var(--font-mono)", fontSize: 18,
                      letterSpacing: '0.18em', textTransform: 'uppercase', outline: 'none',
                    }}
                  />
                  <button
                    onClick={verify}
                    style={{ padding: '0 22px', height: 48, borderRadius: 13, background: 'rgba(124, 255, 79,0.16)', border: '1.5px solid rgba(124, 255, 79,0.40)', color: '#7CFF4F', fontFamily: "var(--font-mono)", fontSize: 12, cursor: 'pointer', letterSpacing: '0.10em' }}
                  >
                    Verify
                  </button>
                </div>
                {error && <div style={{ fontSize: 12, color: '#d97070', marginBottom: 6 }}>{error}</div>}
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>
                  Demo code: <span style={{ color: '#7CFF4F' }}>{PANEL_SCRATCH_CODE}</span>
                </div>
              </div>
            )}

            {/* ── Verified flash ── */}
            {phase === 'verified' && (
              <div style={{ textAlign: 'center', padding: '14px 0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(124, 255, 79,0.16)', border: '2px solid rgba(124, 255, 79,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Check size={22} color="#7CFF4F" strokeWidth={3} />
                  </div>
                </motion.div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: '#7CFF4F' }}>✓ Code Verified</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', marginTop: 6 }}>Loading review form…</div>
              </div>
            )}

            {/* ── Review form ── */}
            {phase === 'form' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 18 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7CFF4F' }} />
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#7CFF4F', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Code Verified — Leave a Verified Review
                  </div>
                </div>
                {/* Stars */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 10 }}>Your Rating</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setRating(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <span style={{ fontSize: 28, color: n <= rating ? '#b9d45c' : 'rgba(255,255,255,0.15)' }}>★</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Text */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--night-dim)', display: 'block', marginBottom: 8 }}>Your Review</label>
                  <textarea
                    value={text} onChange={e => setText(e.target.value)} rows={3}
                    placeholder="What did you notice?"
                    style={{ width: '100%', padding: '12px 14px', background: 'rgba(124, 255, 79, 0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 13, color: '#e4ede0', resize: 'vertical', fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.6, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {/* Tags */}
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 9 }}>Experience Tags</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {PANEL_REVIEW_TAGS.map(t => (
                      <button
                        key={t}
                        onClick={() => setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                        style={{ padding: '5px 13px', borderRadius: 999, cursor: 'pointer', fontFamily: "var(--font-mono)", fontSize: 10, transition: 'all 0.2s', background: tags.includes(t) ? 'rgba(124, 255, 79,0.18)' : 'rgba(255,255,255,0.05)', border: tags.includes(t) ? '1px solid rgba(124, 255, 79,0.45)' : '1px solid rgba(255,255,255,0.09)', color: tags.includes(t) ? '#7CFF4F' : 'var(--night-dim)' }}
                      >{t}</button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={submit}
                  disabled={rating === 0}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 13, background: rating > 0 ? 'rgba(124, 255, 79,0.16)' : 'rgba(124, 255, 79, 0.04)', border: `1.5px solid ${rating > 0 ? 'rgba(124, 255, 79,0.40)' : 'rgba(255,255,255,0.08)'}`, color: rating > 0 ? '#7CFF4F' : 'var(--night-dim)', fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, cursor: rating > 0 ? 'pointer' : 'default', transition: 'all 0.2s' }}
                >
                  <Leaf size={14} />
                  Submit Verified Review
                </button>
              </div>
            )}

            {/* ── Done ── */}
            {phase === 'done' && (
              <div style={{ textAlign: 'center', padding: '6px 0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}>
                  <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'rgba(124, 255, 79,0.16)', border: '2px solid rgba(124, 255, 79,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Check size={24} color="#7CFF4F" strokeWidth={2.5} />
                  </div>
                </motion.div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: '#7CFF4F', marginBottom: 8 }}>Verified Review ✓</div>
                <div style={{ fontSize: 13.5, color: 'var(--night-dim)', lineHeight: 1.6, marginBottom: 20 }}>
                  Thank you for helping future customers.
                </div>
                <button
                  onClick={handleClose}
                  style={{ padding: '11px 30px', borderRadius: 13, background: 'rgba(124, 255, 79,0.14)', border: '1.5px solid rgba(124, 255, 79,0.36)', color: '#7CFF4F', fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* Suppress unused imports */
void Boxes
void TruckIcon
void ThumbsUp
void ArrowRight
void Microscope
