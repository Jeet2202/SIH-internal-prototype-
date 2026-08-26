import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ChevronDown } from 'lucide-react'
import ProvenanceScene from './components/ProvenanceScene'
import VerificationHeader from './components/VerificationHeader'
import StageDetailPanel from './components/StageDetailPanel'
import TransportationStagePanel from './components/TransportationStagePanel'
import ManufacturingStagePanel from './components/ManufacturingStagePanel'
import NavArrows from './components/NavArrows'
import BottomActionBar from './components/BottomActionBar'
import ReviewModal from './components/ReviewModal'
import type { ProvenanceStage } from './types/provenance'

/* ---------------------------------------------------------------------------
   App — root component
   
   Layout:
   - ProvenanceScene: full-screen 3D canvas (z-index 0)
   - VerificationHeader: top bar (z-index 30)
   - NavArrows: left/right edge buttons (z-index 28)
   - StageHint: center below DNA (z-index 22)
   - BottomActionBar: just above/below detail panel (z-index 38)
   - StageDetailPanel: bottom-docked 3-column panel (z-index 40)
   - ReviewModal: centered modal with backdrop (z-index 78/80)
   - AutoRotateToggle: bottom right (z-index 25)
--------------------------------------------------------------------------- */

export default function App() {
  const [selectedStage, setSelectedStage] = useState<ProvenanceStage | null>(null)
  const [autoRotate,    setAutoRotate]    = useState(true)
  const [reviewOpen,    setReviewOpen]    = useState(false)
  const [showHint,      setShowHint]      = useState(true)
  const [interacted,    setInteracted]    = useState(false)

  const detailOpen = selectedStage !== null

  // DNA lifts when detail panel is open
  // liftY = 0 → normal, 1 → lifted ~0.5 world units
  const dnaLiftY = detailOpen ? 0.55 : 0

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
      />

      {/* ── UI overlay ── */}
      <div id="ui-layer">

        {/* ── Top header ── */}
        <VerificationHeader />

        {/* ── "Click any stage" instruction hint ── */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              key="stage-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2.4, duration: 0.8 }}
              style={{
                position: 'fixed',
                // Vertically position hint between DNA and bottom bar
                bottom: detailOpen ? 'calc(42vh + 58px)' : '78px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 22,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                transition: 'bottom 0.5s ease',
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

        {/* ── Auto-rotate toggle (bottom right) ── */}
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

        {/* ── Left/Right navigation arrows ── */}
        <NavArrows
          selectedStage={selectedStage}
          onSelectStage={handleSelectStage}
          detailOpen={detailOpen}
        />

        {/* ── Bottom action bar ── */}
        <BottomActionBar
          selectedStage={selectedStage}
          onClearStage={handleClearStage}
          onOpenReview={() => setReviewOpen(true)}
          onVerify={() => setReviewOpen(true)}
          detailOpen={detailOpen}
        />

        {/* ── Stage detail panel (bottom-docked, 3-column) ── */}
        {/* Use dedicated Transportation panel for Stage 3, Manufacturing panel for Stage 4; generic panel for others */}
        <TransportationStagePanel
          open={selectedStage?.type === 'transport'}
          onClose={handleClearStage}
          hidden={reviewOpen}
        />
        <ManufacturingStagePanel
          open={selectedStage?.type === 'manufacturing'}
          onClose={handleClearStage}
          hidden={reviewOpen}
        />
        <StageDetailPanel
          stage={selectedStage?.type !== 'transport' && selectedStage?.type !== 'manufacturing' ? selectedStage : null}
          onClose={handleClearStage}
          hidden={reviewOpen}
        />

        {/* ── Review modal ── */}
        <ReviewModal
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
        />
      </div>
    </div>
  )
}
