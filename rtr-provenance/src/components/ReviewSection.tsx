import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Leaf, Star } from 'lucide-react'
import { PRODUCT } from '../data/provenance'

/* ---------------------------------------------------------------------------
   ScratchCode + ReviewSection — pack ownership verification + verified review
--------------------------------------------------------------------------- */

const VALID_CODE  = PRODUCT.scratchCode    // RTR-8472
const REVIEW_TAGS = ['Sleep', 'Stress', 'Energy', 'Immunity', 'Digestion']

interface ReviewEntry {
  rating: number
  text: string
  tags: string[]
  createdAt: string
}

export default function ReviewSection() {
  const [phase, setPhase] = useState<'collapsed' | 'code' | 'verified' | 'form' | 'done'>('collapsed')
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

  if (phase === 'collapsed') {
    return (
      <div className="review-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          style={{
            background: 'rgba(8,16,6,0.88)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '18px 22px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: '#e4ede0' }}>
              Share Your Experience
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', marginTop: 2 }}>
              Pack ownership required · Enter scratch code
            </div>
          </div>
          <button className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 12, flexShrink: 0 }} onClick={() => setPhase('code')}>
            Enter Code
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="review-section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'rgba(8,16,6,0.92)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderTop: '2px solid #7CFF4F',
          borderRadius: '20px 20px 0 0',
          padding: '24px 22px 28px',
        }}
      >
        {/* Code entry */}
        {phase === 'code' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: '#e4ede0' }}>
                Verify Your Pack
              </div>
              <button onClick={() => setPhase('collapsed')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--night-dim)', padding: 4 }}>
                <X size={16} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--night-dim)', marginBottom: 18, lineHeight: 1.55 }}>
              Enter the code hidden under the scratch panel on the back of your pack.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={code}
                onChange={(e) => { setCode(formatCode(e.target.value)); setError('') }}
                onKeyDown={(e) => e.key === 'Enter' && verify()}
                placeholder="RTR-XXXX"
                style={{
                  flex: 1, height: 48, padding: '0 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${error ? 'rgba(192,68,47,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: 12, color: '#e4ede0',
                  fontFamily: "var(--font-mono)",
                  fontSize: 18, letterSpacing: '0.2em', textTransform: 'uppercase',
                  outline: 'none',
                }}
              />
              <button className="btn btn-primary" style={{ padding: '0 22px', height: 48 }} onClick={verify}>
                Verify
              </button>
            </div>
            {error && (
              <div style={{ marginTop: 10, fontSize: 12, color: '#d97070' }}>
                {error}
              </div>
            )}
            <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>
              Demo code: <span style={{ color: '#7CFF4F' }}>{VALID_CODE}</span>
            </div>
          </div>
        )}

        {/* Verified flash */}
        {phase === 'verified' && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(124, 255, 79,0.15)', border: '2px solid rgba(124, 255, 79,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Check size={22} color="#7CFF4F" strokeWidth={3} />
              </div>
            </motion.div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: '#7CFF4F' }}>
              Pack Verified ✓
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: 'var(--night-dim)', marginTop: 4 }}>
              Loading review form…
            </div>
          </div>
        )}

        {/* Review form */}
        {phase === 'form' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7CFF4F' }} />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: '#7CFF4F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Pack Verified — Leave a Verified Review
              </div>
            </div>

            {/* Rating */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 10 }}>
                Your Rating
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} className="star-btn" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star
                      size={28}
                      strokeWidth={1.8}
                      color={n <= rating ? '#b9d45c' : 'rgba(255,255,255,0.15)'}
                      fill={n <= rating ? '#b9d45c' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Text */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--night-dim)', display: 'block', marginBottom: 8 }}>
                Your Review
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="What did you notice?"
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'rgba(124, 255, 79, 0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 12, color: '#e4ede0', resize: 'vertical',
                  fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.55,
                  outline: 'none',
                }}
              />
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 8 }}>
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

        {/* Submission confirmed */}
        {phase === 'done' && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, delay: 0.1 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(124, 255, 79,0.15)', border: '2px solid rgba(124, 255, 79,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={24} color="#7CFF4F" strokeWidth={2.5} />
              </div>
            </motion.div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: '#7CFF4F' }}>
              Verified Review ✓
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: 'var(--night-dim)', marginTop: 6 }}>
              {reviews[0]?.rating} ★ · {reviews[0]?.createdAt}
            </div>
            <div style={{ fontSize: 13, color: 'var(--night-dim)', marginTop: 10, lineHeight: 1.55 }}>
              Thank you for helping future customers.
            </div>
            {reviews.length > 0 && (
              <div style={{ marginTop: 20, textAlign: 'left' }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--night-dim)', marginBottom: 10 }}>
                  All Reviews ({reviews.length})
                </div>
                {reviews.slice(0, 3).map((r, i) => (
                  <div key={i} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: '#b9d45c' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>{r.createdAt}</span>
                    </div>
                    {r.text && <div style={{ fontSize: 13, color: '#c4dfb8', lineHeight: 1.5 }}>{r.text}</div>}
                    {r.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        {r.tags.map((t) => (
                          <span key={t} style={{ padding: '2px 10px', borderRadius: 999, background: 'rgba(124, 255, 79,0.12)', border: '1px solid rgba(124, 255, 79,0.22)', fontSize: 11, color: '#7CFF4F' }}>
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
    </div>
  )
}
