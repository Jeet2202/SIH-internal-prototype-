import re

with open('src/components/StageDetailPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '/* ══════════════════════════════════════════════════════════════════\n   PRODUCT PANEL LAYOUT'
end_marker = '/* ── Generic column blocks ───────────────────────────────────────── */'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_product_layout = """/* ══════════════════════════════════════════════════════════════════
   PRODUCT PANEL LAYOUT
   Centered layout for Stage 5 Final Product
══════════════════════════════════════════════════════════════════ */

function ProductPanelLayout({ stage, checksDone, onClose: _onClose, onOpenDocs }: {
  stage:         ProvenanceStage
  checksDone:    boolean
  onClose:       () => void
  onOpenDocs:    () => void
}) {
  const d = stage.data as ProductStageData
  const C = '#7CFF4F'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 24px 20px 24px' }}>
        <div style={{ display: 'flex', gap: 40, maxWidth: 800, width: '100%' }}>
          
          {/* Left: Product Image */}
          <div style={{
            width: 160, height: 200, borderRadius: 16, overflow: 'hidden', flexShrink: 0,
            border: `2px solid ${C}55`,
            boxShadow: `0 0 28px ${C}28, 0 0 0 5px ${C}10`,
          }}>
            <img
              src={d.bottleImageUrl}
              alt="Final Product"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          {/* Right: Product Details */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: '#f0f8f0', marginBottom: 8 }}>
              {d.productName}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
              {[
                { label: 'Product Batch',       value: d.batchCode },
                { label: 'Pack Size',           value: d.packSize },
                { label: 'Pack / Serial',       value: d.qrIdentifier },
                { label: 'Manufacturing Batch', value: d.sourceBatch },
                { label: 'Quality Release',     value: 'RELEASED ✓' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: item.value.includes('✓') ? C : '#f0f8f0' }}>{item.value}</span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button
                onClick={onOpenDocs}
                style={{
                  padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                  background: `${C}15`, border: `1px solid ${C}40`,
                  fontFamily: "var(--font-mono)", fontSize: 10, color: C, textTransform: 'uppercase', letterSpacing: '0.1em'
                }}
              >
                View Release Documents
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* ── SHARE YOUR EXPERIENCE SECTION ── */}
      <div style={{ 
        marginTop: 40, 
        padding: '40px 24px', 
        borderTop: '1px solid rgba(124, 255, 79, 0.15)', 
        background: 'rgba(0,0,0,0.2)',
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <ProductReviewSection />
        </div>
      </div>
    </div>
  )
}

"""

content = content[:start_idx] + new_product_layout + content[end_idx:]

with open('src/components/StageDetailPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
