import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PRODUCT } from '../data/provenance'
import type { ProvenanceStage } from '../types/provenance'

/* ---------------------------------------------------------------------------
   NavArrows — left/right navigation buttons
   
   Positioned on the left and right edges, vertically centered in the
   DNA/stage area (above any detail panel).
   
   Clicking cycles through PRODUCT.stages in order.
--------------------------------------------------------------------------- */

interface NavArrowsProps {
  selectedStage: ProvenanceStage | null
  onSelectStage: (stage: ProvenanceStage | null) => void
  detailOpen: boolean
}

export default function NavArrows({ selectedStage, onSelectStage, detailOpen }: NavArrowsProps) {
  const stages = PRODUCT.stages
  const currentIdx = selectedStage ? stages.findIndex(s => s.id === selectedStage.id) : -1

  const goPrev = () => {
    if (currentIdx <= 0) {
      onSelectStage(stages[stages.length - 1])
    } else {
      onSelectStage(stages[currentIdx - 1])
    }
  }

  const goNext = () => {
    if (currentIdx === -1) {
      onSelectStage(stages[0])
    } else if (currentIdx >= stages.length - 1) {
      onSelectStage(stages[0])
    } else {
      onSelectStage(stages[currentIdx + 1])
    }
  }

  // When detail panel is open, shift arrows up to stay above it (~42vh)
  const verticalCenter = detailOpen ? 'calc(29vh)' : '50%'

  return (
    <>
      {/* LEFT arrow */}
      <button
        id="nav-arrow-left"
        onClick={goPrev}
        aria-label="Previous stage"
        style={{
          position: 'fixed',
          left: 18,
          top: verticalCenter,
          transform: 'translateY(-50%)',
          zIndex: 28,
          width: 42, height: 42,
          borderRadius: '50%',
          background: 'rgba(8,18,5,0.82)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(126,200,90,0.30)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(143,168,136,0.70)',
          transition: 'all 0.22s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(126,200,90,0.65)'
          el.style.color = '#a0d870'
          el.style.transform = 'translateY(-50%) scale(1.08)'
          el.style.boxShadow = '0 0 18px rgba(126,200,90,0.25)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(126,200,90,0.30)'
          el.style.color = 'rgba(143,168,136,0.70)'
          el.style.transform = 'translateY(-50%) scale(1)'
          el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* RIGHT arrow */}
      <button
        id="nav-arrow-right"
        onClick={goNext}
        aria-label="Next stage"
        style={{
          position: 'fixed',
          right: 18,
          top: verticalCenter,
          transform: 'translateY(-50%)',
          zIndex: 28,
          width: 42, height: 42,
          borderRadius: '50%',
          background: 'rgba(8,18,5,0.82)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(126,200,90,0.30)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(143,168,136,0.70)',
          transition: 'all 0.22s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(126,200,90,0.65)'
          el.style.color = '#a0d870'
          el.style.transform = 'translateY(-50%) scale(1.08)'
          el.style.boxShadow = '0 0 18px rgba(126,200,90,0.25)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(126,200,90,0.30)'
          el.style.color = 'rgba(143,168,136,0.70)'
          el.style.transform = 'translateY(-50%) scale(1)'
          el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <ChevronRight size={20} />
      </button>
    </>
  )
}
