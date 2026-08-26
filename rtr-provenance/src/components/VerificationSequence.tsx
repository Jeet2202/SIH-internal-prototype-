import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Check, X } from 'lucide-react'
import { PRODUCT } from '../data/provenance'

/* ---------------------------------------------------------------------------
   VerificationSequence — animated cinematic provenance verification
--------------------------------------------------------------------------- */

interface VerificationSequenceProps {
  open: boolean
  onClose: () => void
}

type StepState = 'idle' | 'running' | 'done'

const STEPS = [
  { label: 'Verifying Collection Record',    detail: 'GPS zone · species ID · farmer eligibility' },
  { label: 'Verifying Laboratory Record',    detail: 'NABL certificate · DNA match · chemical limits' },
  { label: 'Verifying Manufacturing Record', detail: 'Facility licence · batch traceability · yield' },
  { label: 'Verifying Transport Record',     detail: 'Custody handovers · temperature · GPS route' },
  { label: 'Verifying Product Record',       detail: 'QR serial · pack integrity · chain completeness' },
]

export default function VerificationSequence({ open, onClose }: VerificationSequenceProps) {
  const [stepStates, setStepStates] = useState<StepState[]>(STEPS.map(() => 'idle'))
  const [phase, setPhase] = useState<'idle' | 'running' | 'complete'>('idle')

  useEffect(() => {
    if (!open) {
      setStepStates(STEPS.map(() => 'idle'))
      setPhase('idle')
    }
  }, [open])

  const runVerification = async () => {
    setPhase('running')
    setStepStates(STEPS.map(() => 'idle'))

    for (let i = 0; i < STEPS.length; i++) {
      setStepStates((prev) => prev.map((s, j) => j === i ? 'running' : s))
      await delay(420 + Math.random() * 280)
      setStepStates((prev) => prev.map((s, j) => j === i ? 'done' : s))
      await delay(80)
    }

    await delay(400)
    setPhase('complete')
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            className="modal-box glass-raised"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ borderTop: '2px solid #7ec85a', maxWidth: 520 }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7ec85a', marginBottom: 5 }}>
                  Provenance Verification
                </div>
                <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600, color: '#e4ede0' }}>
                  Verify the Chain
                </div>
              </div>
              <button
                onClick={onClose}
                style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--night-dim)' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Idle state */}
            {phase === 'idle' && (
              <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'rgba(126,200,90,0.1)',
                  border: '1.5px solid rgba(126,200,90,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <ShieldCheck size={26} color="#7ec85a" strokeWidth={1.6} />
                </div>
                <p style={{ fontSize: 14, color: 'var(--night-dim)', lineHeight: 1.6, marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
                  Re-read every provenance record and confirm the supply-chain integrity from source to your hands.
                </p>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 14, padding: '14px 28px' }} onClick={runVerification}>
                  <ShieldCheck size={16} />
                  Verify Provenance
                </button>
              </div>
            )}

            {/* Running / complete state */}
            {phase !== 'idle' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  {STEPS.map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 14px', marginBottom: 8,
                        borderRadius: 14,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {/* Status icon */}
                      <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {stepStates[i] === 'idle' && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.18)' }} />
                        )}
                        {stepStates[i] === 'running' && (
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: '2px solid transparent',
                            borderTopColor: '#7ec85a',
                            animation: 'spin-slow 0.7s linear infinite',
                          }} />
                        )}
                        {stepStates[i] === 'done' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(126,200,90,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Check size={13} color="#7ec85a" strokeWidth={3} />
                          </motion.div>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: stepStates[i] === 'done' ? '#e4ede0' : 'var(--night-dim)' }}>
                          {step.label}
                        </div>
                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--night-dim)', marginTop: 2 }}>
                          {step.detail}
                        </div>
                      </div>

                      {stepStates[i] === 'done' && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#7ec85a' }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Completion banner */}
                <AnimatePresence>
                  {phase === 'complete' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        padding: '20px 24px', borderRadius: 18, textAlign: 'center',
                        background: 'rgba(126,200,90,0.1)',
                        border: '1px solid rgba(126,200,90,0.28)',
                        boxShadow: '0 0 32px rgba(126,200,90,0.12)',
                      }}
                    >
                      <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#9fda74' }}>
                        Provenance Integrity Verified
                      </div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--night-dim)', marginTop: 6 }}>
                        5 / 5 stages verified · No tampering detected
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 14 }}>
                        {PRODUCT.stages.map((s) => (
                          <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: 'var(--night-dim)', letterSpacing: '0.1em' }}>
                              {s.number}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {phase === 'complete' && (
                  <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={onClose}>
                    Close
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)) }
