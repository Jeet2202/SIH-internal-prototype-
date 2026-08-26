import re
with open('src/components/StageDetailPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '/* ══════════════════════════════════════════════════════════════════\n   FARMER PANEL LAYOUT'
end_marker = '/* ══════════════════════════════════════════════════════════════════\n   LAB PANEL LAYOUT'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_farmer_layout = """/* ══════════════════════════════════════════════════════════════════
   FARMER PANEL LAYOUT
   3-column view for Stage 1 Farmer / Collection
══════════════════════════════════════════════════════════════════ */

function FarmerPanelLayout({ stage, checksDone, onClose: _onClose, onOpenDoc }: {
  stage:        ProvenanceStage
  checksDone:   boolean
  onClose:      () => void
  onOpenDoc:    () => void
}) {
  const d    = stage.data as FarmerStageData
  const C    = stage.color

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '32% 34% 34%', gap: 0, minHeight: 0 }}>
      {/* ═══ COL 1: Collection Information ═══ */}
      <div style={{
        padding: '24px 32px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
      }}>
        {[
          { label: 'Collector',        value: d.farmerName },
          { label: 'Source Location',  value: `${d.village}, ${d.state}` },
          { label: 'Species',          value: d.species },
          { label: 'Plant Part',       value: d.plantPart },
          { label: 'Collection Date',  value: d.date },
          { label: 'Quantity',         value: d.quantity },
          { label: 'Collection ID',    value: d.collectionId },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0', textAlign: 'right' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* ═══ COL 2: Source Map ═══ */}
      <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Location Map
        </div>
        <div style={{ flex: 1, minHeight: 200, borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.12)` }}>
          <FarmerSourceMap />
        </div>
      </div>

      {/* ═══ COL 3: Certificates & Ledger ═══ */}
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
        {/* Certificates */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Certification & Compliance
          </div>
          {d.certificates.map((cert, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: 13, color: '#f0f8f0' }}>{cert.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C, marginTop: 4 }}>{cert.issuer}</div>
              </div>
              <button onClick={onOpenDoc} style={{ padding: '6px 12px', borderRadius: 6, background: `${C}15`, border: `1px solid ${C}40`, color: C, fontSize: 10, fontFamily: "var(--font-mono)", textTransform: 'uppercase', cursor: 'pointer' }}>
                View
              </button>
            </div>
          ))}
        </div>

        {/* Ledger */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Ledger Record
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Block</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#f0f8f0' }}>{stage.ledgerData?.blockNumber || '#8219914'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Tx Hash</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: C }}>{stage.ledgerData?.transactionHash.substring(0, 16) || '0x...'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"""

content = content[:start_idx] + new_farmer_layout + content[end_idx:]

with open('src/components/StageDetailPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
