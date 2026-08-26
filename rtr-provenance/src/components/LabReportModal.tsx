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
          <motion.div
            key="lab-modal"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position:       'fixed',
              top: '50%', left: '50%',
              transform:      'translate(-50%, -50%)',
              zIndex:         92,
              width:          'min(740px, 96vw)',
              maxHeight:      '90vh',
              overflowY:      'auto',
              background:     'rgba(3,8,18,0.98)',
              backdropFilter: 'blur(30px)',
              border:         '1px solid rgba(78,168,210,0.30)',
              borderTop:      '2px solid rgba(78,168,210,0.75)',
              borderRadius:   22,
              boxShadow:      '0 28px 90px rgba(0,0,0,0.85), 0 0 60px rgba(78,168,210,0.07)',
            }}
          >
            {/* ── Report header ── */}
            <div style={{
              padding:      '22px 28px 18px',
              borderBottom: '1px solid rgba(78,168,210,0.12)',
              display:      'flex', alignItems: 'flex-start', gap: 16,
              background:   'rgba(78,168,210,0.04)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: 'rgba(78,168,210,0.14)',
                border:     '1.5px solid rgba(78,168,210,0.36)',
                display:    'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FlaskConical size={22} color="#4ea8d2" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 8.5,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: '#4ea8d2', marginBottom: 4,
                }}>
                  Prototype Record · Root to Remedy Verification Network
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20, fontWeight: 700, color: '#dff0f8',
                }}>
                  Prototype Laboratory Report
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10.5,
                  color: 'rgba(78,168,210,0.55)', marginTop: 3, letterSpacing: '0.06em',
                }}>
                  Report ID: LAB-RPT-ASH-2026-014 &nbsp;·&nbsp; Test ID: LAB-ASH-2026-014
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* ── Prototype disclaimer ── */}
            <div style={{
              margin: '14px 24px 0',
              padding: '10px 16px',
              background:  'rgba(255,165,0,0.07)',
              border:      '1px solid rgba(255,165,0,0.26)',
              borderRadius: 10,
              display:     'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <AlertTriangle size={14} color="rgba(255,165,0,0.80)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                color: 'rgba(255,165,0,0.70)', lineHeight: 1.55, margin: 0,
              }}>
                <strong style={{ color: 'rgba(255,165,0,0.90)' }}>DEMONSTRATION / PROTOTYPE RECORD</strong>
                {' '}— This document is a simulated laboratory report created for the Root to Remedy
                provenance prototype. It does not represent results from any real laboratory, accreditation
                body, or scientific test. All values, IDs, and results are fictional demonstration data.
              </p>
            </div>

            {/* ── Status strip ── */}
            <div style={{
              margin: '12px 24px 0',
              padding: '10px 16px',
              background:  'rgba(78,168,210,0.08)',
              border:      '1px solid rgba(78,168,210,0.22)',
              borderRadius: 10,
              display:     'flex', alignItems: 'center', gap: 12,
            }}>
              <ShieldCheck size={16} color="#4ea8d2" />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600, color: '#7dcfee' }}>
                  Report Status: VERIFIED &nbsp;·&nbsp; All Parameters: PASS
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'rgba(78,168,210,0.55)', marginTop: 2 }}>
                  Issued: 18 August 2026 &nbsp;·&nbsp; Certified Botanical Testing Laboratory, Mumbai
                </div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right', fontFamily: "var(--font-mono)", fontSize: 9, color: 'rgba(78,168,210,0.65)' }}>
                <div>LAB-MH-0241</div>
                <div>18 Aug 2026</div>
              </div>
            </div>

            {/* ── Report body ── */}
            <div style={{ padding: '18px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Identifiers */}
              <LabSection title="Report Details" icon={<FileText size={12} color="#4ea8d2" />} color="#4ea8d2">
                <LabRow label="Report ID"        value="LAB-RPT-ASH-2026-014" mono />
                <LabRow label="Test ID"          value="LAB-ASH-2026-014"     mono />
                <LabRow label="Laboratory"       value="Certified Botanical Testing Laboratory" />
                <LabRow label="Laboratory ID"    value="LAB-MH-0241"          mono />
                <LabRow label="Location"         value="Mumbai, Maharashtra, India" />
                <LabRow label="Report Date"      value="18 August 2026" />
              </LabSection>

              {/* Sample details */}
              <LabSection title="Sample Details" icon={<Beaker size={12} color="#4ea8d2" />} color="#4ea8d2">
                <LabRow label="Sample Reference"  value="SMP-ASH-001"      mono />
                <LabRow label="Linked Batch"      value="ASH-2026-001"     mono />
                <LabRow label="Material"          value="Ashwagandha Root (Withania somnifera)" />
                <LabRow label="Form"              value="Fresh root, uncured" />
                <LabRow label="Sample Quantity"   value="500 g" />
                <LabRow label="Sample Received"   value="16 August 2026, 11:20 AM IST" />
                <LabRow label="Testing Completed" value="18 August 2026" />
              </LabSection>

              {/* Test results table */}
              <LabSection title="Test Results" icon={<Microscope size={12} color="#4ea8d2" />} color="#4ea8d2">
                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '26% 28% 22% 14% 10%',
                  gap: 8, padding: '6px 0',
                  borderBottom: '1px solid rgba(78,168,210,0.20)',
                  marginBottom: 4,
                }}>
                  {['Parameter', 'Method', 'Specification', 'Result', 'Status'].map((h) => (
                    <div key={h} style={{
                      fontFamily: "var(--font-mono)", fontSize: 8,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'rgba(78,168,210,0.55)',
                    }}>{h}</div>
                  ))}
                </div>
                {TEST_ROWS.map((row, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '26% 28% 22% 14% 10%',
                    gap: 8, padding: '6px 0', alignItems: 'center',
                    borderBottom: i < TEST_ROWS.length - 1 ? '1px solid rgba(124, 255, 79, 0.04)' : 'none',
                  }}>
                    <div style={{ fontSize: 11, color: '#cce6f5' }}>{row.parameter}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: 'rgba(200,220,240,0.50)' }}>{row.method}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'rgba(200,220,240,0.60)' }}>{row.specification}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: '#cce6f5' }}>{row.result}</div>
                    <div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        padding: '2px 7px', borderRadius: 6,
                        background: 'rgba(78,168,210,0.14)',
                        border: '1px solid rgba(78,168,210,0.35)',
                        fontFamily: "var(--font-mono)", fontSize: 8,
                        color: '#7dcfee', letterSpacing: '0.08em',
                      }}>
                        <Check size={7} color="#7dcfee" strokeWidth={3} /> {row.status}
                      </span>
                    </div>
                  </div>
                ))}
              </LabSection>

              {/* Conclusion */}
              <LabSection title="Conclusion" icon={<ShieldCheck size={12} color="#4ea8d2" />} color="#4ea8d2">
                <div style={{
                  padding: '10px 12px',
                  background: 'rgba(78,168,210,0.07)', border: '1px solid rgba(78,168,210,0.18)',
                  borderRadius: 9, marginBottom: 10,
                }}>
                  <p style={{ fontSize: 12, color: '#b8dcee', lineHeight: 1.65, margin: 0 }}>
                    Sample SMP-ASH-001 (Batch ASH-2026-001) was tested against the defined quality
                    specification panel. All six (6) critical parameters — Identity, Moisture Content,
                    Foreign Matter, Ash Value, Microbial Load, and Heavy Metals — returned results
                    within specification or below permissible limits. The batch is hereby released
                    for use in the supply chain.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[
                    'Sample successfully linked to collection batch ASH-2026-001',
                    'All 7 test parameters recorded and within specification',
                    'Report issued and verified on 18 August 2026',
                    'Batch quality confirmed — cleared for supply chain entry',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(78,168,210,0.14)', border: '1px solid rgba(78,168,210,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Check size={8} color="#4ea8d2" strokeWidth={3} />
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#b8dcee' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </LabSection>

              {/* Ledger record */}
              <LabSection title="Ledger Record" icon={<Hash size={12} color="#4ea8d2" />} color="#4ea8d2">
                <div style={{
                  background: 'rgba(78,168,210,0.05)', border: '1px solid rgba(78,168,210,0.16)',
                  borderRadius: 10, padding: '12px 14px',
                }}>
                  <LabRow label="Transaction ID" value="0x91ac…72ef"             mono />
                  <LabRow label="Block Number"   value="4587198"                  mono />
                  <LabRow label="Timestamp"      value="18 Aug 2026, 04:15 PM IST"     />
                  <LabRow label="Network"        value="Permissioned Ledger"      last />
                </div>
                <div style={{
                  marginTop: 8,
                  fontFamily: "var(--font-mono)", fontSize: 8.5,
                  color: 'rgba(78,168,210,0.40)', lineHeight: 1.55,
                }}>
                  <Globe size={9} color="rgba(78,168,210,0.40)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
                  PROTOTYPE: In production, this hash would reference an immutable on-chain record anchored to the test report.
                </div>
              </LabSection>
            </div>

            {/* ── Footer ── */}
            <div style={{
              borderTop: '1px solid rgba(78,168,210,0.10)',
              padding: '14px 24px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
                Root to Remedy · Provenance Prototype · Demo Record<br />
                Demonstration / Prototype Record · Not a genuine laboratory report
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: '9px 20px', borderRadius: 10,
                  background: 'rgba(78,168,210,0.12)', border: '1px solid rgba(78,168,210,0.30)',
                  color: '#7dcfee', fontFamily: "var(--font-mono)",
                  fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <X size={11} /> Close
              </button>
            </div>
          </motion.div>
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
