import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ShieldCheck, ChevronDown } from 'lucide-react'
import ProvenanceScene from './components/ProvenanceScene'
import VerificationHeader from './components/VerificationHeader'
import StagePanel from './components/StagePanel'
import VerificationSequence from './components/VerificationSequence'
import ReviewSection from './components/ReviewSection'
import type { ProvenanceStage } from './types/provenance'

/* ---------------------------------------------------------------------------
   App — root component
--------------------------------------------------------------------------- */

export default function App() {
  const [selectedStage, setSelectedStage] = useState<ProvenanceStage | null>(null)
  const [autoRotate,    setAutoRotate]    = useState(true)
  const [verifyOpen,    setVerifyOpen]    = useState(false)
  const [showHint,      setShowHint]      = useState(true)
  const [interacted,    setInteracted]    = useState(false)

  useEffect(() => {
    if (selectedStage) {
      setAutoRotate(false)
    } else {
      const t = setTimeout(() => setAutoRotate(true), 1200)
      return () => clearTimeout(t)
    }
  }, [selectedStage])

  const onFirstInteract = () => {
    if (!interacted) {
      setInteracted(true)
      setTimeout(() => setShowHint(false), 600)
    }
  }

  const handleSelectStage = (stage: ProvenanceStage | null) => {
    setSelectedStage(stage)
    onFirstInteract()
  }

  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#050f03' }}
      onPointerDown={onFirstInteract}
    >
      {/* ── Full-screen 3D Canvas ── */}
      <ProvenanceScene
        selectedStage={selectedStage}
        onSelectStage={handleSelectStage}
        autoRotate={autoRotate}
      />

      {/* ── UI overlay ── */}
      <div id="ui-layer">

        {/* Top header */}
        <VerificationHeader />

        {/* "Click any stage" instruction — Image 2 reference */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              key="stage-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2.2, duration: 0.7 }}
              style={{
                position: 'fixed',
                bottom: 140,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 22,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <ChevronDown size={13} color="rgba(143,168,136,0.45)" />
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10.5,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(143,168,136,0.45)',
              }}>
                Drag to Explore · Click Any Stage to View Provenance
              </span>
              <ChevronDown size={13} color="rgba(143,168,136,0.45)" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-rotate toggle */}
        <button
          className="rotate-toggle"
          onClick={() => setAutoRotate((v) => !v)}
        >
          <RefreshCw
            size={12}
            color={autoRotate ? '#7ec85a' : 'rgba(255,255,255,0.2)'}
            style={{
              transition: 'transform 0.3s',
              animation: autoRotate ? 'spin-slow 2.4s linear infinite' : 'none',
            }}
          />
          Auto Rotate
          <span style={{
            color: autoRotate ? '#7ec85a' : 'rgba(255,255,255,0.2)',
            marginLeft: 4, fontWeight: 600,
          }}>
            {autoRotate ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Verify provenance button */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{
            position: 'fixed',
            bottom: 90,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 26,
            whiteSpace: 'nowrap',
          }}
        >
          <button
            className="btn btn-primary"
            style={{ padding: '11px 26px', fontSize: 12.5 }}
            onClick={() => { setVerifyOpen(true); onFirstInteract() }}
          >
            <ShieldCheck size={14} />
            Verify Provenance
          </button>
        </motion.div>

        {/* LEFT side stage panel */}
        <StagePanel stage={selectedStage} onClose={() => handleSelectStage(null)} />

        {/* Verification sequence modal */}
        <VerificationSequence open={verifyOpen} onClose={() => setVerifyOpen(false)} />

        {/* Review section (bottom) */}
        <ReviewSection />
      </div>
    </div>
  )
}
