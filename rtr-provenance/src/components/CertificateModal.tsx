import { motion } from 'framer-motion'
import { X, Check, Award } from 'lucide-react'

/* ---------------------------------------------------------------------------
   CertificateModal — Botanical certification document for the collection
--------------------------------------------------------------------------- */

interface CertificateModalProps {
  onClose: () => void
}

export default function CertificateModal({ onClose }: CertificateModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-box glass-raised"
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: '2px solid #7CFF4F', maxWidth: 580 }}
      >
        {/* Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--night-dim)' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Certificate document */}
        <div style={{
          border: '1.5px solid rgba(124, 255, 79,0.35)',
          borderRadius: 18,
          overflow: 'hidden',
          background: 'rgba(8,16,6,0.95)',
          position: 'relative',
        }}>
          {/* Certificate header band */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(34,68,20,0.8) 0%, rgba(18,36,10,0.8) 100%)',
            borderBottom: '1px solid rgba(124, 255, 79,0.2)',
            padding: '24px 28px',
            display: 'flex', gap: 20, alignItems: 'center',
          }}>
            {/* Logo area */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(124, 255, 79,0.15)',
              border: '1.5px solid rgba(124, 255, 79,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Award size={24} color="#7CFF4F" strokeWidth={1.6} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7CFF4F', marginBottom: 4 }}>
                National Medicinal Plants Board · QCI
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: '#e4ede0', lineHeight: 1.25 }}>
                NMPB–QCI VCSMPP
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 11, color: 'var(--night-dim)', marginTop: 2 }}>
                Voluntary Certification Scheme for Medicinal Plant Produce
              </div>
            </div>
            {/* Verified stamp */}
            <div style={{
              marginLeft: 'auto',
              border: '2px solid rgba(124, 255, 79,0.5)',
              borderRadius: '50%', width: 60, height: 60,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-8deg)',
              color: '#7CFF4F',
            }}>
              <Check size={18} strokeWidth={3} />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: '0.1em', marginTop: 1 }}>
                VERIFIED
              </div>
            </div>
          </div>

          {/* Certificate body */}
          <div style={{ padding: '24px 28px' }}>
            {/* Certificate fields */}
            <div style={{ display: 'grid', gap: '0' }}>
              {[
                { label: 'Certification Scheme',  value: 'NMPB–QCI VCSMPP', mono: false },
                { label: 'Practice Standard',     value: 'Good Field Collection Practices (GFCP)', mono: false },
                { label: 'Certified Entity',      value: 'Khedgaon Medicinal Plant Collection Hub', mono: false },
                { label: 'Species Covered',       value: 'Withania somnifera (Ashwagandha)', mono: false },
                { label: 'Certificate ID',        value: 'DEMO-NMPB-VCSMPP-ASH-2026-KHG-047', mono: true },
                { label: 'Certificate Status',    value: 'VERIFIED ✓', mono: true },
                { label: 'Issued Date',           value: 'January 2026', mono: false },
                { label: 'Valid Until',           value: 'December 2027', mono: false },
              ].map((field) => (
                <div key={field.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  gap: 12,
                }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--night-dim)', flexShrink: 0, paddingTop: 2 }}>
                    {field.label}
                  </span>
                  <span style={{
                    fontFamily: field.mono ? "var(--font-mono)" : "var(--font-body)",
                    fontSize: field.mono ? 11 : 13,
                    color: field.value.includes('✓') ? '#7CFF4F' : '#e4ede0',
                    textAlign: 'right',
                  }}>
                    {field.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Compliance statement */}
            <div style={{
              marginTop: 20, padding: '14px 16px',
              background: 'rgba(124, 255, 79,0.06)',
              border: '1px solid rgba(124, 255, 79,0.16)',
              borderRadius: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Check size={13} color="#7CFF4F" strokeWidth={3} style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: 'var(--night-dim)', lineHeight: 1.55 }}>
                  This collection batch was conducted under Good Field Collection Practices (GFCP) guidelines per NMPB–QCI standards. The collection hub, species identity, location, quantity, and seasonal timing comply with voluntary certification criteria.
                </div>
              </div>
            </div>

            {/* Prototype disclaimer */}
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: 'rgba(200,146,46,0.06)',
              border: '1px solid rgba(200,146,46,0.15)',
              borderRadius: 10,
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: 'rgba(200,146,46,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Demo Data · Prototype Only
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'rgba(200,146,46,0.55)', marginTop: 3 }}>
                This is prototype data for demonstration. The certificate ID is fictional. No live government API was queried.
              </div>
            </div>
          </div>

          {/* Footer signature band */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '16px 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(255,255,255,0.01)',
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)', letterSpacing: '0.1em' }}>
                VERIFICATION ANCHORED TO
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#7CFF4F', marginTop: 2 }}>
                PRAMANA Provenance Network
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(124, 255, 79,0.1)',
              border: '1px solid rgba(124, 255, 79,0.28)',
              borderRadius: 999, padding: '5px 12px',
            }}>
              <Check size={11} color="#7CFF4F" strokeWidth={3} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: '#7CFF4F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Document Verified
              </span>
            </div>
          </div>
        </div>

        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={onClose}>
          Close Certificate
        </button>
      </motion.div>
    </div>
  )
}
