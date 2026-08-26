import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ChevronDown } from 'lucide-react'
import ProvenanceScene from './components/ProvenanceScene'
import VerificationHeader from './components/VerificationHeader'
import StageDetailPanel from './components/StageDetailPanel'
import TransportationStagePanel from './components/TransportationStagePanel'
import ManufacturingStagePanel from './components/ManufacturingStagePanel'
import { useMobile } from './hooks/useMobile'
import type { ProvenanceStage } from './types/provenance'

/* ---------------------------------------------------------------------------
   App — root component
   
   Layout:
   - ProvenanceScene: full-screen 3D canvas (z-index 0)
   - VerificationHeader: top bar (z-index 30)
   - StageHint: center below DNA (z-index 22)
   - BottomActionBar: just above/below detail panel (z-index 38)
   - StageDetailPanel: bottom-docked 3-column panel (z-index 40)
   - ReviewModal: centered modal with backdrop (z-index 78/80)
   - AutoRotateToggle: bottom right (z-index 25)
--------------------------------------------------------------------------- */

export default function App() {
  const [selectedStage, setSelectedStage] = useState<ProvenanceStage | null>(null)
  const [autoRotate,    setAutoRotate]    = useState(true)
  const [showHint,      setShowHint]      = useState(true)
  const [interacted,    setInteracted]    = useState(false)
  const isMobile = useMobile()

  const detailOpen = selectedStage !== null

  // In the cinematic node-zoom experience, the camera zooms directly into the node at y=0,
  // so no artificial DNA lift jump is needed.
  const dnaLiftY = 0

  useEffect(() => {
    if (selectedStage) {
      setAutoRotate(false)
    } else {
      const t = setTimeout(() => setAutoRotate(true), 1400)
      return () => clearTimeout(t)
    }
  }, [selectedStage])

  const onFirstInteract = () => {
    if (!interacted) {
      setInteracted(true)
      setTimeout(() => setShowHint(false), 500)
    }
  }

  const handleSelectStage = (stage: ProvenanceStage | null) => {
    setSelectedStage(stage)
    onFirstInteract()
  }

  const handleClearStage = () => {
    handleSelectStage(null)
  }

  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#030a02' }}
      onPointerDown={onFirstInteract}
    >
      {/* ── Full-screen 3D Canvas ── */}
      <ProvenanceScene
        selectedStage={selectedStage}
        onSelectStage={handleSelectStage}
        autoRotate={autoRotate}
        dnaLiftY={dnaLiftY}
        isMobile={isMobile}
      />

      {/* ── UI overlay ── */}
      <div id="ui-layer">

        {/* ── Top header (fade out when full-screen stage portal is open) ── */}
        <div style={{ opacity: detailOpen ? 0 : 1, pointerEvents: detailOpen ? 'none' : 'auto', transition: 'opacity 0.35s ease' }}>
          <VerificationHeader isMobile={isMobile} />
        </div>

        {/* ── "Click any stage" instruction hint ── */}
        <AnimatePresence>
          {showHint && !detailOpen && !isMobile && (
            <motion.div
              key="stage-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2.4, duration: 0.8 }}
              style={{
                position: 'fixed',
                bottom: '78px',
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
              <ChevronDown size={12} color="rgba(143,168,136,0.40)" />
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(143,168,136,0.40)',
              }}>
                Click Any Stage to View Details
              </span>
              <ChevronDown size={12} color="rgba(143,168,136,0.40)" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile "Explore Provenance" bottom hint ── */}
        <AnimatePresence>
          {isMobile && !detailOpen && (
            <motion.div
              key="mobile-hint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                position: 'fixed',
                bottom: 40,
                left: '20px',
                right: '20px',
                background: 'rgba(6,14,4,0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(124, 255, 79,0.3)',
                borderRadius: 16,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                zIndex: 40,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                pointerEvents: 'none', // just a visual hint
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7CFF4F', boxShadow: '0 0 8px #7CFF4F' }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: '#7CFF4F', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Tap nodes to explore provenance
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Auto-rotate toggle (bottom right) ── */}
        {!isMobile && (
        <div style={{ opacity: detailOpen ? 0 : 1, pointerEvents: detailOpen ? 'none' : 'auto', transition: 'opacity 0.35s ease' }}>
          <button
            className="rotate-toggle"
            onClick={() => setAutoRotate((v) => !v)}
          >
            <RefreshCw
              size={11}
              color={autoRotate ? '#7CFF4F' : 'rgba(255,255,255,0.2)'}
              style={{
                transition: 'transform 0.3s',
                animation: autoRotate ? 'spin-slow 2.4s linear infinite' : 'none',
              }}
            />
            Auto Rotate
            <span style={{
              color: autoRotate ? '#7CFF4F' : 'rgba(255,255,255,0.2)',
              marginLeft: 3, fontWeight: 600,
            }}>
              {autoRotate ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
        )}



        {/* ── Stage detail panel (bottom-docked, 3-column on desktop, bottom sheet on mobile) ── */}
        <TransportationStagePanel
          open={selectedStage?.type === 'transport'}
          onClose={handleClearStage}
          hidden={false}
          isMobile={isMobile}
        />
        <ManufacturingStagePanel
          open={selectedStage?.type === 'manufacturing'}
          onClose={handleClearStage}
          hidden={false}
          isMobile={isMobile}
        />
        <StageDetailPanel
          stage={selectedStage?.type !== 'transport' && selectedStage?.type !== 'manufacturing' ? selectedStage : null}
          onClose={handleClearStage}
          hidden={false}
          isMobile={isMobile}
        />
      </div>
    </div>
  )
}
