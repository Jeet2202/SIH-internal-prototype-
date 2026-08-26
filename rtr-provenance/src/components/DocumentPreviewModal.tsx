import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ShieldCheck, MapPin, User, Leaf, Hash, Clock,
  Globe, FileText, Check, AlertTriangle,
} from 'lucide-react'

/* ---------------------------------------------------------------------------
   DocumentPreviewModal — Simulated "Botanical Source / Collection Record"

   PROTOTYPE DISCLAIMER
   This modal shows a simulated provenance document for demonstration only.
   It is not an actual certificate, permit, or official record issued by any
   government authority, certification body, or real organisation.
   All IDs, names, and values are fictional demonstration data.
--------------------------------------------------------------------------- */

interface DocumentPreviewModalProps {
  open:    boolean
  onClose: () => void
}

export default function DocumentPreviewModal({ open, onClose }: DocumentPreviewModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="doc-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              zIndex: 90,
              background: 'rgba(2,6,2,0.92)',
              backdropFilter: 'blur(14px)',
            }}
          />

          {/* Document modal card */}
          <motion.div
            key="doc-modal"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position:       'fixed',
              top: '50%', left: '50%',
              transform:      'translate(-50%, -50%)',
              zIndex:         92,
              width:          'min(700px, 96vw)',
              maxHeight:      '90vh',
              overflowY:      'auto',
              background:     'rgba(5,12,4,0.98)',
              backdropFilter: 'blur(30px)',
              border:         '1px solid rgba(124, 255, 79,0.30)',
              borderTop:      '2px solid rgba(124, 255, 79,0.70)',
              borderRadius:   22,
              boxShadow:      '0 28px 90px rgba(0,0,0,0.80), 0 0 60px rgba(124, 255, 79,0.07)',
            }}
          >
            {/* ── Document header bar ── */}
            <div style={{
              padding:      '20px 28px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display:      'flex',
              alignItems:   'flex-start',
              gap:          16,
            }}>
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(124, 255, 79,0.14)',
                border:     '1.5px solid rgba(124, 255, 79,0.36)',
                display:    'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={20} color="#7CFF4F" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 9,
                  letterSpacing: '0.26em', textTransform: 'uppercase',
                  color: '#7CFF4F', marginBottom: 4,
                }}>
                  Prototype Record · Root to Remedy Verification Network
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20, fontWeight: 700, color: '#e4ede0',
                }}>
                  Botanical Source / Collection Record
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10.5,
                  color: 'rgba(200,220,190,0.6)', marginTop: 3, letterSpacing: '0.06em',
                }}>
                  Record ID: BOT-COL-ASH-2026-001
                </div>
              </div>

              {/* Close */}
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

            {/* ── Prototype disclaimer banner ── */}
            <div style={{
              margin:  '14px 24px 0',
              padding: '10px 16px',
              background:  'rgba(255,165,0,0.08)',
              border:      '1px solid rgba(255,165,0,0.28)',
              borderRadius: 10,
              display:     'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <AlertTriangle size={14} color="rgba(255,165,0,0.80)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                color: 'rgba(255,165,0,0.70)', lineHeight: 1.55, margin: 0,
              }}>
                <strong style={{ color: 'rgba(255,165,0,0.90)' }}>PROTOTYPE RECORD</strong>{' '}
                — This document is a simulated demonstration record created for the Root to Remedy
                provenance prototype. It is not an official certificate, government permit, or
                attestation from any real authority. All names, IDs, and values are fictional.
              </p>
            </div>

            {/* ── Verified status strip ── */}
            <div style={{
              margin: '14px 24px 0',
              padding: '10px 16px',
              background:  'rgba(124, 255, 79,0.08)',
              border:      '1px solid rgba(124, 255, 79,0.25)',
              borderRadius: 10,
              display:     'flex', alignItems: 'center', gap: 10,
            }}>
              <ShieldCheck size={16} color="#7CFF4F" />
              <div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13, fontWeight: 600, color: '#7CFF4F',
                }}>
                  Status: VERIFIED
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 9,
                  color: 'rgba(124, 255, 79,0.55)', marginTop: 2, letterSpacing: '0.06em',
                }}>
                  Issued by: Root to Remedy Verification Network (Prototype Demo)
                </div>
              </div>
              <div style={{
                marginLeft: 'auto',
                fontFamily: "var(--font-mono)", fontSize: 9,
                color: '#7CFF4F', textAlign: 'right',
              }}>
                <div>14 Aug 2026</div>
                <div style={{ color: 'rgba(124, 255, 79,0.5)' }}>08:45 AM IST</div>
              </div>
            </div>

            {/* ── Document body ── */}
            <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Section: Collector Details */}
              <DocSection title="Collector Details" icon={<User size={12} color="#7CFF4F" />} color="#7CFF4F">
                <DocRow label="Collector Name"  value="Mahesh Patil" />
                <DocRow label="Role"            value="Registered Botanical Collector" />
                <DocRow label="Cooperative"     value="Nashik Herbal Growers Cooperative" />
                <DocRow label="Eligibility ID"  value="COL-ELIG-2026-001" mono />
                <DocRow label="District"        value="Nashik, Maharashtra, India" />
              </DocSection>

              {/* Section: Botanical Material */}
              <DocSection title="Botanical Material" icon={<Leaf size={12} color="#7CFF4F" />} color="#7CFF4F">
                <DocRow label="Common Name"       value="Ashwagandha" />
                <DocRow label="Scientific Name"   value="Withania somnifera" italic />
                <DocRow label="Plant Part"        value="Root" />
                <DocRow label="Form at Collection" value="Fresh root, uncured" />
                <DocRow label="Collection Method" value="Cultivated botanical crop" />
              </DocSection>

              {/* Section: Collection Event */}
              <DocSection title="Collection Event" icon={<Clock size={12} color="#7CFF4F" />} color="#7CFF4F">
                <DocRow label="Collection ID"     value="COL-ASH-2026-001" mono />
                <DocRow label="Batch ID"          value="ASH-2026-001" mono />
                <DocRow label="Harvest Date"      value="14 August 2026" />
                <DocRow label="Collection Time"   value="08:45 AM IST" />
                <DocRow label="Season"            value="Kharif 2026" />
                <DocRow label="Quantity Collected" value="250 kg (independently weighed)" />
              </DocSection>

              {/* Section: Geographic Origin */}
              <DocSection title="Geographic Origin" icon={<MapPin size={12} color="#7CFF4F" />} color="#7CFF4F">
                <DocRow label="Locality"     value="Nashik" />
                <DocRow label="District"     value="Nashik" />
                <DocRow label="State"        value="Maharashtra" />
                <DocRow label="Country"      value="India" />
                <DocRow label="Latitude"     value="19.9975° N" mono />
                <DocRow label="Longitude"    value="73.7898° E" mono />
                <DocRow label="GPS Accuracy" value="±8 metres" />
              </DocSection>

              {/* Section: Compliance / Verification */}
              <DocSection title="Compliance Verification" icon={<ShieldCheck size={12} color="#7CFF4F" />} color="#7CFF4F">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
                  {[
                    'GPS source verified',
                    'Quantity independently verified',
                    'Species visually and botanically confirmed',
                    'Source verified against cooperative register',
                    'Collection event recorded before ledger entry',
                    'Collector eligibility active at time of collection',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(124, 255, 79,0.14)', border: '1px solid rgba(124, 255, 79,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Check size={8} color="#7CFF4F" strokeWidth={3} />
                      </div>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: '#c8e0c0' }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </DocSection>

              {/* Section: Ledger Record */}
              <DocSection title="Ledger Record" icon={<Hash size={12} color="#7CFF4F" />} color="#7CFF4F">
                <div style={{
                  background:   'rgba(124, 255, 79,0.05)',
                  border:       '1px solid rgba(124, 255, 79,0.18)',
                  borderRadius: 10, padding: '12px 14px',
                }}>
                  <DocRow label="Transaction ID" value="0x7d3f…a9b21c" mono />
                  <DocRow label="Block Number"   value="4587123"        mono />
                  <DocRow label="Timestamp"      value="14 Aug 2026, 08:45 AM IST" />
                  <DocRow label="Network"        value="Permissioned Ledger" last />
                </div>
                <div style={{
                  marginTop: 8,
                  fontFamily: "var(--font-mono)", fontSize: 8.5,
                  color: 'rgba(124, 255, 79,0.40)', lineHeight: 1.55,
                }}>
                  <Globe size={9} color="rgba(124, 255, 79,0.40)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
                  PROTOTYPE: In production, this hash would reference an immutable on-chain record.
                  This demonstration uses a simulated transaction ID.
                </div>
              </DocSection>

            </div>

            {/* ── Footer ── */}
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '14px 24px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 14,
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 9,
                color: 'rgba(255,255,255,0.25)', lineHeight: 1.5,
              }}>
                Root to Remedy · Provenance Prototype · Demo Record<br />
                This is a demonstration record · Not an official document
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: '9px 20px', borderRadius: 10,
                  background: 'rgba(124, 255, 79,0.14)', border: '1px solid rgba(124, 255, 79,0.32)',
                  color: '#7CFF4F', fontFamily: "var(--font-mono)",
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

/* ── Document section wrapper ────────────────────────────────────── */
function DocSection({ title, icon, color, children }: {
  title: string
  icon:  React.ReactNode
  color: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background:   'rgba(255,255,255,0.025)',
      border:       `1px solid ${color}1e`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: `1px solid ${color}18`,
        background: `${color}0a`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {icon}
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 8.5,
          letterSpacing: '0.18em', textTransform: 'uppercase', color,
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '10px 16px' }}>
        {children}
      </div>
    </div>
  )
}

/* ── Document row ─────────────────────────────────────────────────── */
function DocRow({ label, value, mono, italic, last }: {
  label:   string
  value:   string
  mono?:   boolean
  italic?: boolean
  last?:   boolean
}) {
  return (
    <div style={{
      display:       'flex',
      justifyContent: 'space-between',
      alignItems:    'flex-start',
      padding:       '5px 0',
      borderBottom:  last ? 'none' : '1px solid rgba(124, 255, 79, 0.04)',
      gap:           12,
    }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 8.5,
        letterSpacing: '0.10em', textTransform: 'uppercase',
        color: 'rgba(160,180,150,0.55)', flexShrink: 0, paddingTop: 1,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
        fontSize:   mono ? 10 : 12,
        color:      '#e0eedc',
        fontStyle:  italic ? 'italic' : 'normal',
        textAlign:  'right',
      }}>
        {value}
      </span>
    </div>
  )
}
