import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Leaf, Star } from 'lucide-react'
import { PRODUCT } from '../data/provenance'

/* ---------------------------------------------------------------------------
   ReviewModal — scratch code verification + review form
   
   Rendered as a proper MODAL with:
   - Dark backdrop (z-index 80) that dismisses on click
   - Centered card that does NOT compete with the provenance panel
   - Correct z-index layering — sits above everything
   - Smooth open/close via Framer Motion
--------------------------------------------------------------------------- */

const VALID_CODE  = PRODUCT.scratchCode    // RTR-8472
const REVIEW_TAGS = ['Sleep', 'Stress', 'Energy', 'Immunity', 'Digestion']

interface ReviewEntry {
  rating: number
  text: string
  tags: string[]
  createdAt: string
}

interface ReviewModalProps {
  open: boolean
  onClose: () => void
}

export default function ReviewModal({ open, onClose }: ReviewModalProps) {
  const [phase, setPhase] = useState<'code' | 'verified' | 'form' | 'done'>('code')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [reviews, setReviews] = useState<ReviewEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('rtr_reviews') || '[]') } catch { return [] }
  })

  const formatCode = (raw: string) => {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
    return clean.length > 3 ? `${clean.slice(0, 3)}-${clean.slice(3)}` : clean
  }

  const verify = () => {
    const entered = code.trim().toUpperCase()
    if (entered === VALID_CODE) {
      setError('')
      setPhase('verified')
      setTimeout(() => setPhase('form'), 1000)
    } else {
      setError('Code not verified. Try RTR-8472 for this demo.')
    }
  }

  const submit = () => {
    if (rating === 0) return
    const entry: ReviewEntry = {
      rating,
      text: text.trim(),
      tags: [...tags],
      createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    }
    const updated = [entry, ...reviews]
    setReviews(updated)
    localStorage.setItem('rtr_reviews', JSON.stringify(updated))
    setPhase('done')
  }

  const handleClose = () => {
    onClose()
    // Reset form state after animation finishes
    setTimeout(() => {
      setPhase('code')
      setCode('')
      setError('')
      setRating(0)
      setText('')
      setTags([])
    }, 400)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="review-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={handleClose}
            style={{
              position: 'fixed', inset: 0,
              zIndex: 78,
              background: 'rgba(3,8,2,0.88)',
              backdropFilter: 'blur(10px)',
            }}
          />

          {/* ── Modal card ── */}
          <motion.div
            key="review-modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 80,
              width: 'min(560px, 94vw)',
              maxHeight: '88vh',
              overflowY: 'auto',
              background: 'rgba(6,14,4,0.96)',
              backdropFilter: 'blur(28px)',
              border: '1px solid rgba(126,200,90,0.28)',
              borderTop: '2px solid rgba(126,200,90,0.65)',
              borderRadius: 24,
              padding: '30px 30px 32px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 60px rgba(126,200,90,0.08)',
            }}
          >
            {/* Close button */}
            <button
              id="btn-review-close"
              onClick={handleClose}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--night-dim)',
                transition: 'all 0.2s',
              }}
            >
              <X size={15} />
            </button>

            {/* ── Code entry phase ── */}
            {phase === 'code' && (
              <div>
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#7ec85a', marginBottom: 8 }}>
                    Share Your Experience
                  </div>
                  <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#e4ede0' }}>
                    Verify Your Pack
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--night-dim)', marginBottom: 22, lineHeight: 1.6 }}>
                  Enter the scratch code hidden under the panel on the back of your product pack to unlock a verified review.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={code}
                    onChange={(e) => { setCode(formatCode(e.target.value)); setError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && verify()}
                    placeholder="RTR-XXXX"
                    autoFocus
                    style={{
                      flex: 1, height: 50, padding: '0 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${error ? 'rgba(200,80,60,0.5)' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 14, color: '#e4ede0',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 20, letterSpacing: '0.22em', textTransform: 'uppercase',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    style={{ height: 50, padding: '0 24px', fontSize: 13 }}
                    onClick={verify}
                  >
                    Verify
                  </button>
                </div>
                {error && (
                  <div style={{ marginTop: 10, fontSize: 12, color: '#d97070' }}>
                    {error}
                  </div>
                )}
                <div style={{ marginTop: 14, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--night-dim)' }}>
                  Demo code: <span style={{ color: '#7ec85a' }}>{VALID_CODE}</span>
                </div>
              </div>
            )}

            {/* ── Verified flash phase ── */}
            {phase === 'verified' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(126,200,90,0.16)',
                    border: '2px solid rgba(126,200,90,0.42)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <Check size={24} color="#7ec85a" strokeWidth={3} />
                  </div>
                </motion.div>
                <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#9fda74' }}>
                  Pack Verified ✓
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--night-dim)', marginTop: 6 }}>
                  Loading review form…
                </div>
              </div>
            )}

            {/* ── Review form phase ── */}
            {phase === 'form' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7ec85a' }} />
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#9fda74', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Pack Verified — Leave a Verified Review
                  </div>
                </div>

                {/* Rating */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 12 }}>
                    Your Rating
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} className="star-btn" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                        <Star
                          size={30}
                          strokeWidth={1.6}
                          color={n <= rating ? '#b9d45c' : 'rgba(255,255,255,0.15)'}
                          fill={n <= rating ? '#b9d45c' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--night-dim)', display: 'block', marginBottom: 10 }}>
                    Your Review
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    placeholder="What did you notice?"
                    style={{
                      width: '100%', padding: '13px 16px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 14, color: '#e4ede0', resize: 'vertical',
                      fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.6,
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Tags */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 10 }}>
                    Experience Tags
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {REVIEW_TAGS.map((t) => (
                      <button
                        key={t}
                        className={`tag-btn${tags.includes(t) ? ' active' : ''}`}
                        onClick={() => setTags((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: rating === 0 ? 0.4 : 1, pointerEvents: rating === 0 ? 'none' : 'auto' }}
                  onClick={submit}
                >
                  <Leaf size={14} />
                  Submit Verified Review
                </button>
              </div>
            )}

            {/* ── Done phase ── */}
            {phase === 'done' && (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'rgba(126,200,90,0.16)',
                    border: '2px solid rgba(126,200,90,0.38)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px',
                  }}>
                    <Check size={26} color="#7ec85a" strokeWidth={2.5} />
                  </div>
                </motion.div>
                <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#9fda74' }}>
                  Verified Review ✓
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: 'var(--night-dim)', marginTop: 8 }}>
                  {reviews[0]?.rating} ★ · {reviews[0]?.createdAt}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--night-dim)', marginTop: 12, lineHeight: 1.6 }}>
                  Thank you for helping future customers.
                </div>
                {reviews.length > 0 && (
                  <div style={{ marginTop: 22, textAlign: 'left' }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 12 }}>
                      All Reviews ({reviews.length})
                    </div>
                    {reviews.slice(0, 3).map((r, i) => (
                      <div key={i} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                          <span style={{ color: '#b9d45c' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: 'var(--night-dim)' }}>{r.createdAt}</span>
                        </div>
                        {r.text && <div style={{ fontSize: 13.5, color: '#c4dfb8', lineHeight: 1.55 }}>{r.text}</div>}
                        {r.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                            {r.tags.map((t) => (
                              <span key={t} style={{ padding: '2px 10px', borderRadius: 999, background: 'rgba(126,200,90,0.12)', border: '1px solid rgba(126,200,90,0.22)', fontSize: 11, color: '#9fda74' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
