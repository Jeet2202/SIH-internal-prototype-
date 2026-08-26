import { motion } from 'framer-motion'
import { X, MapPin, Check } from 'lucide-react'

/* ---------------------------------------------------------------------------
   MapModal — locality view showing Khedgaon collection hub
--------------------------------------------------------------------------- */

interface MapModalProps {
  onClose: () => void
}

export default function MapModal({ onClose }: MapModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-box glass-raised"
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: '2px solid #7CFF4F' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: '0.2em', color: '#7CFF4F', textTransform: 'uppercase', marginBottom: 4 }}>
              Collection Origin
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: '#e4ede0' }}>
              Collection Hub Location
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--night-dim)' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* SVG Map illustration */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <svg
            viewBox="0 0 520 300"
            style={{ width: '100%', borderRadius: 16, display: 'block' }}
          >
            {/* Background */}
            <rect width="520" height="300" fill="#0a1a08" rx="12" />

            {/* Subtle grid */}
            {[...Array(11)].map((_, i) => (
              <line key={`v${i}`} x1={i * 52} y1={0} x2={i * 52} y2={300} stroke="rgba(124, 255, 79, 0.04)" strokeWidth={0.5} />
            ))}
            {[...Array(7)].map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 50} x2={520} y2={i * 50} stroke="rgba(124, 255, 79, 0.04)" strokeWidth={0.5} />
            ))}

            {/* Maharashtra state outline (simplified) */}
            <path
              d="M 60,210 Q 80,180 120,160 Q 160,140 200,150 Q 240,155 280,140 Q 320,128 360,140 Q 400,155 420,180 Q 440,200 430,230 Q 415,255 390,265 Q 360,278 320,270 Q 280,265 250,275 Q 210,282 180,265 Q 150,252 130,240 Q 100,225 80,230 Z"
              fill="rgba(34,68,20,0.35)"
              stroke="rgba(124, 255, 79,0.25)"
              strokeWidth={1.5}
            />

            {/* Region label */}
            <text x="250" y="200" textAnchor="middle" fill="rgba(124, 255, 79,0.5)" fontSize="11" fontFamily="monospace" letterSpacing="2">
              MAHARASHTRA
            </text>

            {/* Jalna District marker zone */}
            <circle cx="295" cy="160" r="28" fill="rgba(124, 255, 79,0.07)" stroke="rgba(124, 255, 79,0.25)" strokeWidth={1} strokeDasharray="4 4" />
            <text x="295" y="200" textAnchor="middle" fill="rgba(124, 255, 79,0.45)" fontSize="8.5" fontFamily="monospace">
              JALNA DISTRICT
            </text>

            {/* Collection hub pin */}
            <circle cx="295" cy="160" r="8" fill="rgba(124, 255, 79,0.2)" />
            <circle cx="295" cy="160" r="4" fill="#7CFF4F" />
            <line x1="295" y1="164" x2="295" y2="185" stroke="#7CFF4F" strokeWidth={1.5} />
            <circle cx="295" cy="185" r="2" fill="#7CFF4F" />

            {/* Glowing rings */}
            <circle cx="295" cy="160" r="16" fill="none" stroke="#7CFF4F" strokeWidth={0.8} opacity={0.35}>
              <animate attributeName="r" values="16;26;16" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0;0.35" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Hub label box */}
            <rect x="170" y="88" width="180" height="48" rx="8" fill="rgba(12,22,8,0.9)" stroke="rgba(124, 255, 79,0.4)" strokeWidth={1} />
            <text x="260" y="107" textAnchor="middle" fill="#7CFF4F" fontSize="9" fontFamily="monospace" letterSpacing="1.5">
              KHEDGAON
            </text>
            <text x="260" y="120" textAnchor="middle" fill="#7CFF4F" fontSize="11" fontWeight="600" fontFamily="var(--font-display)">
              Collection Hub
            </text>
            <text x="260" y="132" textAnchor="middle" fill="rgba(143,168,136,0.7)" fontSize="7.5" fontFamily="monospace">
              19.83°N  75.88°E
            </text>
            {/* Connector */}
            <line x1="260" y1="136" x2="295" y2="152" stroke="rgba(124, 255, 79,0.35)" strokeWidth={0.8} strokeDasharray="3 3" />

            {/* Mumbai reference */}
            <circle cx="140" cy="240" r="3.5" fill="rgba(78,168,210,0.6)" />
            <text x="152" y="244" fill="rgba(78,168,210,0.55)" fontSize="9" fontFamily="monospace">Mumbai</text>

            {/* Nashik reference */}
            <circle cx="210" cy="148" r="3" fill="rgba(200,146,46,0.5)" />
            <text x="220" y="152" fill="rgba(200,146,46,0.5)" fontSize="9" fontFamily="monospace">Nashik</text>

            {/* India hint */}
            <text x="30" y="30" fill="rgba(255,255,255,0.12)" fontSize="10" fontFamily="monospace">INDIA</text>
          </svg>

          {/* Verification badge overlay */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(12,22,8,0.9)', border: '1px solid rgba(124, 255, 79,0.35)',
            borderRadius: 10, padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Check size={12} color="#7CFF4F" strokeWidth={3} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#7CFF4F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Origin Verified
            </span>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Collection Hub', value: 'Khedgaon MPCH' },
            { label: 'District',       value: 'Jalna, Maharashtra' },
            { label: 'Approx. Location', value: '19.83°N 75.88°E' },
            { label: 'Zone Status',    value: 'Approved Zone ✓' },
          ].map((item) => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, color: '#e4ede0' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(124, 255, 79,0.06)', border: '1px solid rgba(124, 255, 79,0.15)', borderRadius: 10 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', lineHeight: 1.5 }}>
            Locality view only · Exact GPS coordinates are not shown publicly to protect collector privacy · Collection hub location is verified by the platform
          </div>
        </div>

        <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  )
}
