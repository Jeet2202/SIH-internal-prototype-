import { Check, X } from 'lucide-react'

interface StageDetailHeaderProps {
  stageNumber: number
  title: string
  status: string
  description: string
  accentColor: string
  onClose: () => void
}

export default function StageDetailHeader({ stageNumber, title, status, description, accentColor, onClose }: StageDetailHeaderProps) {
  const numStr = stageNumber.toString().padStart(2, '0')
  return (
    <div style={{
      flexShrink: 0,
      padding: '20px 32px 20px 32px',
      borderBottom: `1px solid ${accentColor}20`,
      background: 'rgba(255,255,255,0.015)',
      position: 'relative'
    }}>
      {/* Close button - absolute top right */}
      <button
        onClick={onClose}
        aria-label="Close stage panel"
        style={{
          position: 'absolute',
          top: 20, right: 32,
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
          transition: 'all 0.2s',
        }}
      >
        <X size={16} />
      </button>

      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: accentColor, lineHeight: 1, marginBottom: 8 }}>
        {numStr}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: '#f0f8f0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {title}
        </div>
        {status && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: `${accentColor}15`, border: `1px solid ${accentColor}40`,
            borderRadius: 999, padding: '4px 12px',
          }}>
            <Check size={12} color={accentColor} strokeWidth={3} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: accentColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {status}
            </span>
          </div>
        )}
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: 'var(--night-dim)', maxWidth: '600px', lineHeight: 1.5 }}>
        {description}
      </div>
    </div>
  )
}
