import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react'
import type { ProvenanceStage } from '../types/provenance'

/* ---------------------------------------------------------------------------
   BottomActionBar — single component with two states:
   
   OVERVIEW (no stage selected):
     [← Back to Overview (dim)]   [Verify Provenance]   [Share Your Experience]
   
   DETAIL (stage selected):
     [← Back to Overview]   [✓ 100% traceable]   [Verify Another Product]
   
   Positioned just above the detail panel (or at bottom when no panel).
--------------------------------------------------------------------------- */

interface BottomActionBarProps {
  selectedStage: ProvenanceStage | null
  onClearStage: () => void
  onOpenReview: () => void
  onVerify: () => void
  detailOpen: boolean
}

export default function BottomActionBar({
  selectedStage,
  onClearStage,
  onOpenReview,
  onVerify,
  detailOpen,
}: BottomActionBarProps) {
  // When detail panel is open (~42vh), position bar just above it
  const bottomPos = detailOpen ? 'calc(42vh + 2px)' : '28px'

  return (
    <motion.div
      animate={{ bottom: bottomPos }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        left: 0, right: 0,
        zIndex: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        background: 'rgba(4,10,3,0.82)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(126,200,90,0.14)',
      }}
    >
      {/* LEFT */}
      <button
        id="btn-back-overview"
        onClick={onClearStage}
        disabled={!selectedStage}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: selectedStage ? 'pointer' : 'default',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, letterSpacing: '0.08em',
          color: selectedStage ? '#9fda74' : 'rgba(143,168,136,0.35)',
          transition: 'color 0.2s',
          padding: '6px 0',
        }}
      >
        <ArrowLeft size={14} />
        Back to Overview
      </button>

      {/* CENTER */}
      <AnimatePresence mode="wait">
        {selectedStage ? (
          <motion.div
            key="detail-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'Inter', sans-serif",
              fontSize: 12, color: '#9fda74',
            }}
          >
            <ShieldCheck size={14} color="#7ec85a" />
            This product is 100% traceable from root to remedy
          </motion.div>
        ) : (
          <motion.div
            key="overview-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <button
              id="btn-verify-provenance"
              className="btn btn-primary"
              style={{ padding: '9px 22px', fontSize: 12 }}
              onClick={onVerify}
            >
              <ShieldCheck size={13} />
              Verify Provenance
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIGHT */}
      <AnimatePresence mode="wait">
        {selectedStage ? (
          <motion.div
            key="detail-right"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            <button
              id="btn-verify-another"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 999, padding: '7px 16px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10.5, letterSpacing: '0.06em',
                color: 'var(--night-dim)', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={12} />
              Verify Another Product
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="overview-right"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            <button
              id="btn-share-experience"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 999, padding: '7px 16px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10.5, letterSpacing: '0.06em',
                color: 'var(--night-dim)', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(126,200,90,0.35)'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#b0cc90'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.10)'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--night-dim)'
              }}
              onClick={onOpenReview}
            >
              Share Your Experience / Enter Code
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
