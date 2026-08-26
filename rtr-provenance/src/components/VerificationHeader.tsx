import { motion } from 'framer-motion'
import { ShieldCheck, Leaf } from 'lucide-react'
import { PRODUCT } from '../data/provenance'

/* ---------------------------------------------------------------------------
   VerificationHeader — matches Image 2 composition:
   
   [Leaf] Batch ID              ROOT TO REMEDY            [5/5 STAGES]
          PRD-ASH-2026-0447   PRODUCT VERIFIED ✓          100% TRACEABLE
                              Every step verified.
--------------------------------------------------------------------------- */

export default function VerificationHeader() {
  return (
    <div className="header-bar" style={{ alignItems: 'center' }}>

      {/* Left: Batch ID card */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        style={{
          flex: '0 0 auto',
          background: 'rgba(6,14,4,0.82)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(124, 255, 79,0.22)',
          borderRadius: 14,
          padding: '10px 16px',
          minWidth: 160,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <Leaf size={12} color="#7CFF4F" strokeWidth={2} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7CFF4F' }}>
            Batch ID
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: '#e4ede0', letterSpacing: '0.04em' }}>
          {PRODUCT.batch}
        </div>
        {/* Scan pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
          <MiniPill label="Bottle Scanned ✓" />
          <MiniPill label="Provenance Matched ✓" />
        </div>
      </motion.div>

      {/* Center: Brand + Verified status — matches Image 2 top center */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        style={{
          flex: 1,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Brand name */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#7CFF4F',
          marginBottom: 5,
        }}>
          Root to Remedy
        </div>

        {/* Large PRODUCT VERIFIED */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 'clamp(22px, 3.2vw, 38px)',
            fontWeight: 700,
            color: '#e4ede0',
            letterSpacing: '0.02em',
            lineHeight: 1.1,
          }}>
            Product Verified
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(124, 255, 79,0.18)',
            border: '2px solid rgba(124, 255, 79,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(124, 255, 79,0.3)',
          }}>
            <ShieldCheck size={16} color="#7CFF4F" strokeWidth={2.2} />
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 12,
          color: 'var(--night-dim)',
          marginTop: 4,
          letterSpacing: '0.03em',
        }}>
          Every step verified. Every record trusted.
        </div>
      </motion.div>

      {/* Right: Traceability card */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        style={{
          flex: '0 0 auto',
          background: 'rgba(6,14,4,0.82)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(124, 255, 79,0.22)',
          borderRadius: 14,
          padding: '10px 18px',
          minWidth: 160,
          textAlign: 'right',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'flex-end', marginBottom: 5 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7CFF4F' }}>
            5 / 5 STAGES VERIFIED
          </span>
          <ShieldCheck size={12} color="#7CFF4F" strokeWidth={2} />
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: '#7CFF4F' }}>
          100%
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>
          TRACEABLE
        </div>
        {/* Stage dots */}
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 6 }}>
          {PRODUCT.stages.map((s) => (
            <div key={s.id} title={s.title} style={{
              width: 24, height: 3, borderRadius: 2,
              background: s.color, opacity: 0.82,
            }} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function MiniPill({ label }: { label: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(124, 255, 79,0.08)',
      border: '1px solid rgba(124, 255, 79,0.2)',
      borderRadius: 999, padding: '2px 9px',
      fontFamily: "var(--font-mono)",
      fontSize: 8.5, letterSpacing: '0.1em', color: '#8fcb6a',
    }}>
      {label}
    </div>
  )
}
