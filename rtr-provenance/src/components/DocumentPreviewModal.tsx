import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ShieldCheck, MapPin, User, Leaf, Hash, Clock,
  Globe, FileText, Check, AlertTriangle,
} from 'lucide-react'

import { useMobile } from '../hooks/useMobile'

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
  const isMobile = useMobile()
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
          <div style={{ position: 'fixed', inset: 0, zIndex: 92, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.div
              key="doc-modal"
              initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.93, y: 24 }}
              animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents:  'auto',
                width:          isMobile ? '100vw' : 'min(800px, 96vw)',
                height:         isMobile ? '100dvh' : '85vh',
                position:       isMobile ? 'absolute' : 'static',
                bottom:         isMobile ? 0 : 'auto',
                background:     'rgba(5,12,4,0.98)',
                backdropFilter: 'blur(30px)',
                border:         isMobile ? 'none' : '1px solid rgba(124, 255, 79,0.30)',
                borderTop:      isMobile ? '1px solid rgba(124, 255, 79,0.30)' : '1px solid rgba(124, 255, 79,0.30)',
                borderRadius:   isMobile ? '16px 16px 0 0' : 16,
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
              <span style={{ fontFamily: "var(--font-display)", color: '#7CFF4F', fontSize: 14, fontWeight: 600 }}>Botanical Identity & Source Verification</span>
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
              src="/documents/stage1.pdf#toolbar=0"
              style={{ width: '100%', flex: 1, border: 'none' }}
              title="Botanical Source Document"
            />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
