import { motion, AnimatePresence } from 'framer-motion'
import {
  X, FlaskConical, Hash, Clock, Globe, Check,
  AlertTriangle, ShieldCheck, FileText, Microscope,
  Thermometer, Beaker,
} from 'lucide-react'

/* ---------------------------------------------------------------------------
   LabReportModal — Simulated "Prototype Laboratory Report"
   LAB-RPT-ASH-2026-014

   PROTOTYPE DISCLAIMER
   This modal renders a demonstration laboratory report only.
   It is NOT a genuine analytical report from any real laboratory,
   accreditation body, or certification authority.
   All values, IDs, and results are fictional prototype data.
--------------------------------------------------------------------------- */

interface LabReportModalProps {
  open:    boolean
  onClose: () => void
}

/* Test result rows for the report */
const TEST_ROWS = [
  {
    parameter:     'Identity',
    method:        'Botanical identification (organoleptic + TLC)',
    specification: 'Withania somnifera conforming',
    result:        'Conforming',
    status:        'PASS' as const,
  },
  {
    parameter:     'Moisture Content',
    method:        'Loss on drying at 100–105°C',
    specification: '< 10 %',
    result:        '8.2 %',
    status:        'PASS' as const,
  },
  {
    parameter:     'Foreign Matter',
    method:        'Visual examination of sample',
    specification: '< 2 %',
    result:        '0.4 %',
    status:        'PASS' as const,
  },
  {
    parameter:     'Ash Value (Total)',
    method:        'Total ash by ignition at 600°C',
    specification: 'Within specification',
    result:        '6.1 %',
    status:        'PASS' as const,
  },
  {
    parameter:     'Microbial Load (TPC)',
    method:        'Pour plate method (aerobic count)',
    specification: 'Within pharmacopoeial limits',
    result:        'Within specification',
    status:        'PASS' as const,
  },
  {
    parameter:     'Yeast & Mould',
    method:        'Pour plate (YM agar)',
    specification: 'Within pharmacopoeial limits',
    result:        'Within specification',
    status:        'PASS' as const,
  },
  {
    parameter:     'Heavy Metals (Pb, As, Cd, Hg)',
    method:        'ICP-OES / ICP-MS',
    specification: 'Within WHO/FAO permissible limits',
    result:        'Within permissible limits',
    status:        'PASS' as const,
  },
]

export default function LabReportModal({ open, onClose }: LabReportModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="lab-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 90,
              background:     'rgba(2,5,10,0.93)',
              backdropFilter: 'blur(14px)',
            }}
          />

          {/* Report card */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 92, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.div
              key="lab-modal"
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents:  'auto',
                width:          'min(800px, 96vw)',
                height:         '85vh',
                background:     'rgba(5,12,4,0.98)',
                backdropFilter: 'blur(30px)',
                border:         '1px solid rgba(124, 255, 79,0.30)',
                borderRadius:   16,
                boxShadow:      '0 28px 90px rgba(0,0,0,0.80), 0 0 60px rgba(124, 255, 79,0.07)',
                display:        'flex',
                flexDirection:  'column',
                overflow:       'hidden',
              }}
            >
            {/* Header with Close Button */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid rgba(124,255,79,0.2)',
              background: 'rgba(124,255,79,0.05)'
            }}>
              <span style={{ fontFamily: "var(--font-display)", color: '#7CFF4F', fontSize: 14, fontWeight: 600 }}>Analytical Test Report</span>
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
            
            {/* PDF Viewer */}
            <iframe
              src="/documents/stage2.pdf#toolbar=0"
              style={{ width: '100%', flex: 1, border: 'none' }}
              title="Analytical Test Report"
            />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Lab section wrapper ──────────────────────────────────────────── */
function LabSection({ title, icon, color, children }: {
  title: string; icon: React.ReactNode; color: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.018)', border: `1px solid ${color}18`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{
        padding: '10px 16px', borderBottom: `1px solid ${color}14`,
        background: `${color}08`, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {icon}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.18em', textTransform: 'uppercase', color }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '10px 16px' }}>{children}</div>
    </div>
  )
}

/* ── Lab row ──────────────────────────────────────────────────────── */
function LabRow({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '5px 0', borderBottom: last ? 'none' : '1px solid rgba(124, 255, 79, 0.04)', gap: 12,
    }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(78,168,210,0.45)', flexShrink: 0, paddingTop: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 10 : 12, color: '#cce6f5', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  )
}

/* Suppress unused imports */
void Thermometer
