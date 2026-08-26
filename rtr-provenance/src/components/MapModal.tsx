import { motion } from 'framer-motion'
import { X, MapPin, Check } from 'lucide-react'
import { LocationMap } from './maps'

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
        style={{ borderTop: '2px solid #7ec85a' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: '#7ec85a', textTransform: 'uppercase', marginBottom: 4 }}>
              Collection Origin
            </div>
            <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600, color: '#e4ede0' }}>
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

        {/* Real Leaflet Map */}
        <div style={{ position: 'relative', height: '280px', marginBottom: 20, borderRadius: 16, overflow: 'hidden' }}>
          <LocationMap
            location={{
              lat: 19.83,
              lng: 75.88,
              label: 'Khedgaon Collection Hub',
              city: 'Jalna',
              state: 'Maharashtra',
              country: 'India',
            }}
            type="farmer"
            label="Khedgaon MPCH"
            sublabel="Jalna District"
            privacy="customer"
            zoom={10}
            statusBadge="COLLECTION HUB VERIFIED"
          />

          {/* Verification badge overlay */}
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 1000,
            background: 'rgba(12,22,8,0.92)', border: '1px solid rgba(126,200,90,0.35)',
            borderRadius: 10, padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(8px)',
          }}>
            <Check size={12} color="#7ec85a" strokeWidth={3} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#9fda74', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
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
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13, color: '#e4ede0' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(126,200,90,0.06)', border: '1px solid rgba(126,200,90,0.15)', borderRadius: 10 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--night-dim)', lineHeight: 1.5 }}>
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
