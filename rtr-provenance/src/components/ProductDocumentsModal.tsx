import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Leaf, FlaskConical, Truck, Factory, Package,
  ShieldCheck, Hash, Globe, Check, AlertTriangle, FileText,
} from 'lucide-react'
import { useMobile } from '../hooks/useMobile'

/* ---------------------------------------------------------------------------
   ProductDocumentsModal — tabbed document viewer for Stage 5

   Tabs: Botanical · Lab · Transport · Manufacturing · Product Verification

   PROTOTYPE DISCLAIMER
   Every document shown here is a simulated demonstration record only.
   It is not an official certificate, report, or legal document.
   All IDs, values, and names are fictional.
--------------------------------------------------------------------------- */

interface ProductDocumentsModalProps {
  open:    boolean
  onClose: () => void
}

const DOCS = [
  {
    id:    'botanical',
    label: 'Botanical Source',
    icon:  <Leaf size={12} />,
    color: '#7CFF4F',
    ref:   'BOT-COL-ASH-2026-001',
    title: 'Botanical Source / Collection Record',
    rows:  [
      { label: 'Collector',       value: 'Mahesh Patil'                           },
      { label: 'Cooperative',     value: 'Nashik Herbal Growers Cooperative'       },
      { label: 'Collection ID',   value: 'COL-ASH-2026-001',  mono: true          },
      { label: 'Batch ID',        value: 'ASH-2026-001',       mono: true          },
      { label: 'Species',         value: 'Withania somnifera',  italic: true        },
      { label: 'Plant Part',      value: 'Root (fresh, uncured)'                   },
      { label: 'Date',            value: '14 August 2026'                          },
      { label: 'Quantity',        value: '250 kg'                                  },
      { label: 'Location',        value: 'Nashik, Maharashtra, India'              },
      { label: 'GPS',             value: '19.9975° N, 73.7898° E', mono: true      },
    ],
    conclusion: 'Collection event GPS-tagged, quantity independently weighed, species visually confirmed. Batch accepted into supply chain.',
  },
  {
    id:    'lab',
    label: 'Lab Report',
    icon:  <FlaskConical size={12} />,
    color: '#4ea8d2',
    ref:   'LAB-RPT-ASH-2026-014',
    title: 'Prototype Laboratory Report',
    rows:  [
      { label: 'Test ID',         value: 'LAB-ASH-2026-014',     mono: true },
      { label: 'Sample ID',       value: 'SMP-ASH-001',           mono: true },
      { label: 'Laboratory',      value: 'Certified Botanical Testing Laboratory' },
      { label: 'Lab ID',          value: 'LAB-MH-0241',           mono: true },
      { label: 'Location',        value: 'Mumbai, Maharashtra, India' },
      { label: 'Sample Received', value: '16 August 2026, 11:20 AM IST' },
      { label: 'Report Issued',   value: '18 August 2026' },
    ],
    tests: [
      { name: 'Identity',        result: 'Conforming',               pass: true },
      { name: 'Moisture',        result: '8.2% (limit < 10%)',       pass: true },
      { name: 'Foreign Matter',  result: '0.4% (limit < 2%)',        pass: true },
      { name: 'Ash Value',       result: '6.1% (within spec)',       pass: true },
      { name: 'Microbial Load',  result: 'Within specification',     pass: true },
      { name: 'Heavy Metals',    result: 'Within permissible limits',pass: true },
    ],
    conclusion: 'All 6 parameters PASS. Batch cleared for supply chain entry. Report: LAB-RPT-ASH-2026-014.',
  },
  {
    id:    'transport',
    label: 'Transport',
    icon:  <Truck size={12} />,
    color: '#8b6cd4',
    ref:   'TRANS-REC-ASH-2026-014',
    title: 'Transportation Chain Record',
    rows:  [
      { label: 'Carrier',        value: 'SafeMove Cold Cargo Pvt. Ltd.'           },
      { label: 'Vehicle ID',     value: 'MH-09-GF-4422',            mono: true    },
      { label: 'Origin',         value: 'Nashik Collection Hub, MH'               },
      { label: 'Destination',    value: 'Himalaya Facility, Baddi, HP'            },
      { label: 'Pickup',         value: '20 August 2026, 07:30 AM'                },
      { label: 'Delivery',       value: '21 August 2026, 02:15 PM'                },
      { label: 'Distance',       value: '≈ 1,200 km'                              },
      { label: 'Condition',      value: '15–30°C · RH ≤ 65%'                     },
      { label: 'Seal No.',       value: 'SEAL-2026-08-0914',         mono: true    },
    ],
    conclusion: 'No temperature or humidity deviations recorded. Tamper-evident seal intact at delivery. Batch integrity confirmed.',
  },
  {
    id:    'manufacturing',
    label: 'Manufacturing',
    icon:  <Factory size={12} />,
    color: '#e8a84a',
    ref:   'BMR-ASH-2026-0447',
    title: 'Batch Manufacturing Record',
    rows:  [
      { label: 'Manufacturer',   value: 'Himalaya Drug Company Pvt. Ltd.'         },
      { label: 'Facility',       value: 'Baddi Plant, Himachal Pradesh'            },
      { label: 'MFG Licence',    value: 'AY/MFG/HP/2026/0321',       mono: true   },
      { label: 'GMP Certificate', value: 'WHO-GMP · HP-WHO-GMP/2025/047'          },
      { label: 'Input Batch',    value: 'ASH-2026-001',               mono: true   },
      { label: 'Output Batch',   value: 'PRD-ASH-2026-0447',          mono: true   },
      { label: 'Process Period', value: '24–26 August 2026'                        },
      { label: 'Tablets/Bottle', value: '60'                                       },
      { label: 'Yield',          value: '43,783 bottles · 96.1%'                   },
    ],
    steps: ['Raw Material Intake & QC Release', 'Secondary Drying', 'Fine Milling', 'Granulation & Blending', 'Tablet Compression', 'Film Coating', 'Packaging & Serialisation'],
    conclusion: 'All 7 manufacturing steps recorded and approved. QC release issued. Batch PRD-ASH-2026-0447 cleared for distribution.',
  },
  {
    id:    'product',
    label: 'Product Verification',
    icon:  <Package size={12} />,
    color: '#7CFF4F',
    ref:   'PROD-VER-ASH-2026-0447',
    title: 'Product Verification Record',
    rows:  [
      { label: 'Product',        value: 'Himalaya Ashwagandha Pure Herbs'         },
      { label: 'Product ID',     value: 'PRD-ASH-2026-0447',          mono: true  },
      { label: 'SKU',            value: 'HIM-ASH-PH-60T',             mono: true  },
      { label: 'Pack Size',      value: '60 Tablets'                              },
      { label: 'QR Identifier',  value: 'R2R-PRD-ASH-2026-0447',      mono: true  },
      { label: 'Manufactured',   value: 'August 2026'                             },
      { label: 'Expiry',         value: 'July 2028'                               },
      { label: 'Stages Verified', value: '5 / 5 (100% traceable)'                },
      { label: 'Ledger TX',      value: '0xf821…44bc',                 mono: true  },
    ],
    conclusion: 'All 5 provenance stages verified. QR code resolves to this unique record. Product is 100% traceable from root to tablet.',
  },
]

export default function ProductDocumentsModal({ open, onClose }: ProductDocumentsModalProps) {
  const [activeTab, setActiveTab] = useState(0)
  const isMobile = useMobile()
  const doc = DOCS[activeTab]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="pdoc-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(2,6,2,0.93)', backdropFilter: 'blur(14px)' }}
          />
          <div style={{ position: 'fixed', inset: 0, zIndex: 92, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.div
              key="pdoc-modal"
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.93, y: 24 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents: 'auto',
                width: isMobile ? '100vw' : 'min(800px, 96vw)', 
                height: isMobile ? '100dvh' : '85vh',
                position: isMobile ? 'absolute' : 'static',
                bottom: isMobile ? 0 : 'auto',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                background: 'rgba(5, 12, 4, 0.98)', backdropFilter: 'blur(30px)',
                border: isMobile ? 'none' : `1px solid ${doc.color}28`, 
                borderTop: `2px solid ${doc.color}70`,
                borderRadius: isMobile ? '16px 16px 0 0' : 22, 
                boxShadow: '0 28px 90px rgba(0,0,0,0.85)',
              }}
            >
            {/* Header */}
            <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: `${doc.color}14`, border: `1.5px solid ${doc.color}36`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color={doc.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: doc.color, marginBottom: 3 }}>
                  Prototype Record · PRAMANA Verification Network
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: '#e4ede0' }}>{doc.title}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: `${doc.color}70`, marginTop: 2 }}>Ref: {doc.ref}</div>
              </div>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                <X size={13} />
              </button>
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
              {DOCS.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => setActiveTab(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', flexShrink: 0,
                    background: i === activeTab ? `${d.color}10` : 'none',
                    borderBottom: i === activeTab ? `2px solid ${d.color}` : '2px solid transparent',
                    color: i === activeTab ? d.color : 'rgba(255,255,255,0.35)',
                    fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.12em',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <span style={{ color: i === activeTab ? d.color : 'rgba(255,255,255,0.25)' }}>{d.icon}</span>
                  {d.label}
                </button>
              ))}
            </div>

            {/* Prototype disclaimer */}
            <div style={{ margin: '14px 22px 0', padding: '9px 14px', background: 'rgba(255,165,0,0.07)', border: '1px solid rgba(255,165,0,0.24)', borderRadius: 9, display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              <AlertTriangle size={12} color="rgba(255,165,0,0.80)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: 'rgba(255,165,0,0.68)', lineHeight: 1.5, margin: 0 }}>
                <strong style={{ color: 'rgba(255,165,0,0.88)' }}>DEMONSTRATION / PROTOTYPE RECORD</strong> — This document is a simulated record for the PRAMANA provenance prototype. It is not an official certificate, test report, or legal document. All IDs and values are fictional.
              </p>
            </div>

            {/* Document content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}
              >
                <iframe
                  src={`/documents/stage${activeTab + 1}.pdf#toolbar=0`}
                  style={{ width: '100%', height: '100%', minHeight: '600px', flex: 1, border: 'none' }}
                  title={doc.title}
                />
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 22px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
                PRAMANA · Prototype · Not an official document<br />
                <Hash size={8} color="rgba(124, 255, 79,0.35)" style={{ display: 'inline', marginRight: 4 }} />
                <span style={{ color: 'rgba(124, 255, 79,0.35)' }}>0xf821…44bc</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {activeTab > 0 && (
                  <button onClick={() => setActiveTab(t => t - 1)} style={{ padding: '7px 14px', borderRadius: 8, background: 'rgba(124, 255, 79, 0.04)', border: '1px solid rgba(255,255,255,0.10)', color: 'var(--night-dim)', fontFamily: "var(--font-mono)", fontSize: 9, cursor: 'pointer' }}>← Prev</button>
                )}
                {activeTab < DOCS.length - 1 && (
                  <button onClick={() => setActiveTab(t => t + 1)} style={{ padding: '7px 14px', borderRadius: 8, background: `${doc.color}14`, border: `1px solid ${doc.color}30`, color: doc.color, fontFamily: "var(--font-mono)", fontSize: 9, cursor: 'pointer' }}>Next →</button>
                )}
                <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(124, 255, 79,0.12)', border: '1px solid rgba(124, 255, 79,0.30)', color: '#7CFF4F', fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <X size={10} /> Close
                </button>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function PDocSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.018)', border: `1px solid ${color}16`, borderRadius: 13, overflow: 'hidden' }}>
      <div style={{ padding: '9px 14px', borderBottom: `1px solid ${color}12`, background: `${color}07`, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color }}>{title}</div>
      <div style={{ padding: '8px 14px' }}>{children}</div>
    </div>
  )
}

function PDocRow({ label, value, mono, italic }: { label: string; value: string; mono?: boolean; italic?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '4px 0', borderBottom: '1px solid rgba(124, 255, 79, 0.04)', gap: 12 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(180,200,170,0.45)', flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", fontSize: mono ? 9.5 : 11.5, color: '#e0eedc', textAlign: 'right', fontStyle: italic ? 'italic' : 'normal' }}>{value}</span>
    </div>
  )
}
