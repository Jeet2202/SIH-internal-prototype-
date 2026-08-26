import re

with open('src/components/StageDetailPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '/* ══════════════════════════════════════════════════════════════════\n   LAB PANEL LAYOUT'
end_marker = '/* ── Lab key-value row (Col 1) ─────────────────────────────────── */'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_lab_layout = """/* ══════════════════════════════════════════════════════════════════
   LAB PANEL LAYOUT
   3-column view for Stage 2 Laboratory Testing
══════════════════════════════════════════════════════════════════ */

function LabPanelLayout({ stage, checksDone, onClose: _onClose, onOpenReport }: {
  stage:        ProvenanceStage
  checksDone:   boolean
  onClose:      () => void
  onOpenReport: () => void
}) {
  const d    = stage.data as LabStageData
  const C    = stage.color

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '32% 34% 34%', gap: 0, minHeight: 0 }}>
      {/* ═══ COL 1: Laboratory Information ═══ */}
      <div style={{
        padding: '24px 32px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
      }}>
        {[
          { label: 'Laboratory',       value: d.labName },
          { label: 'Lab ID',           value: d.laboratoryId },
          { label: 'Batch Received',   value: d.batchId },
          { label: 'Test Date',        value: d.testDate },
          { label: 'Species',          value: d.species },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0', textAlign: 'right' }}>{item.value}</span>
          </div>
        ))}
        
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Test Results
          </div>
          {d.checks.map((chk, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < d.checks.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: 8, paddingTop: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{chk.label}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: '#f0f8f0' }}>{chk.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ COL 2: Lab Location Map ═══ */}
      <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Facility Location Map
        </div>
        <div style={{ flex: 1, minHeight: 200, borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.12)` }}>
          <LocationMap
            location={d.location}
            type="lab"
            label={d.labName}
            sublabel={d.laboratoryId}
            privacy="internal"
            accuracyM={10}
            statusBadge="TESTING FACILITY VERIFIED"
          />
        </div>
      </div>

      {/* ═══ COL 3: Lab Report & Ledger ═══ */}
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
        {/* Lab Report */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Lab Report / Certificate
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: 13, color: '#f0f8f0' }}>Quality Report</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C, marginTop: 4 }}>{d.reportId}</div>
            </div>
            <button onClick={onOpenReport} style={{ padding: '6px 12px', borderRadius: 6, background: `${C}15`, border: `1px solid ${C}40`, color: C, fontSize: 10, fontFamily: "var(--font-mono)", textTransform: 'uppercase', cursor: 'pointer' }}>
              View
            </button>
          </div>
        </div>

        {/* Ledger */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Ledger Record
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Block</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#f0f8f0' }}>{d.blockchain.blockNum}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Tx Hash</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: C }}>{d.blockchain.txHash.substring(0, 16)}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"""

content = content[:start_idx] + new_lab_layout + content[end_idx:]

with open('src/components/StageDetailPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
