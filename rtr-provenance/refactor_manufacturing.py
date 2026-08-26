import re

with open('src/components/ManufacturingStagePanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '/* ─── Panel Header ───────────────────────────────────────────────── */'
end_marker = '/* ══════════════════════════════════════════════════════════════════\n   SHARED PRIMITIVES'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    exit(1)

# Add import for StageDetailHeader if not present
if "import StageDetailHeader" not in content:
    import_idx = content.find("import { LocationMap } from './maps'")
    content = content[:import_idx] + "import StageDetailHeader from '../components/StageDetailHeader'\n" + content[import_idx:]
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)

header_replace = """          {/* Global Stage Header */}
          <StageDetailHeader
            stageNumber={4}
            title="MANUFACTURING"
            status="Verified"
            description="Verified manufacturing record for the finished product."
            accentColor={AMBER}
            onClose={onClose}
          />"""

# we need to replace the PanelHeader invocation in the main component
inv_start = content.find('{/* Header strip */}')
inv_end = content.find('{/* 3-column body */}')
if inv_start != -1 and inv_end != -1:
    content = content[:inv_start] + header_replace + "\n\n          " + content[inv_end:]

# Now replace the PanelHeader definition and columns
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_columns = """/* ══════════════════════════════════════════════════════════════════
   LEFT COLUMN — MANUFACTURER
══════════════════════════════════════════════════════════════════ */
function LeftColumn({ rec }: { rec: typeof MANUFACTURING_RECORD }) {
  return (
    <div style={{
      padding: '24px 32px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
    }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Facility Details
      </div>
      {[
        { label: 'Facility Name',   value: rec.manufacturer.name },
        { label: 'Facility ID',     value: rec.manufacturer.id },
        { label: 'Location',        value: rec.manufacturer.location.split(',')[0] },
        { label: 'GMP Certified',   value: rec.manufacturer.gmpCertificate },
        { label: 'Licence Expiry',  value: rec.manufacturer.licenceExpiry },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0', textAlign: 'right' }}>{item.value}</span>
        </div>
      ))}
      
      <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Facility Map
      </div>
      <div style={{ flex: 1, minHeight: 200, borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.12)` }}>
        <LocationMap
          location={{ lat: 19.9975, lng: 73.7898 }}
          type="facility"
          label={rec.manufacturer.name}
          sublabel={rec.manufacturer.id}
          privacy="public"
          accuracyM={5}
          statusBadge="GMP CERTIFIED"
          height={200}
        />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MIDDLE COLUMN — INPUTS
══════════════════════════════════════════════════════════════════ */
function MiddleColumn({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (l: string, r: string) => void }) {
  return (
    <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Input Batch
      </div>
      {[
        { label: 'Verified Batch',   value: rec.inputBatch.batchId },
        { label: 'Quantity Received', value: rec.inputBatch.quantityKg + ' kg' },
        { label: 'Status',           value: rec.inputBatch.acceptanceStatus },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, paddingTop: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: item.value.includes('Accepted') ? GREEN : '#f0f8f0' }}>{item.value}</span>
        </div>
      ))}

      <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Verification Checks
      </div>
      {rec.checks.slice(0, 3).map((chk, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: 8, paddingTop: 4 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{chk.label}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: chk.status === 'pass' ? GREEN : '#f0f8f0' }}>PASS</span>
        </div>
      ))}
      
      <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
        Processing Pipeline
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 16px 8px 16px' }}>
        {rec.processingSteps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124, 255, 79, 0.1)', border: '1px solid rgba(124, 255, 79, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={10} color={GREEN} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: '#f0f8f0', marginBottom: 2 }}>{step.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   RIGHT COLUMN — OUTPUTS
══════════════════════════════════════════════════════════════════ */
function RightColumn({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (l: string, r: string) => void }) {
  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Product Output
        </div>
        {[
          { label: 'Product Batch',  value: rec.packaging.productBatchId },
          { label: 'Pack Size',      value: rec.packaging.packSize },
          { label: 'Bottles Produced', value: rec.packaging.bottleCount + '' },
          { label: 'QC Release',     value: rec.qualityRelease.status },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10, paddingTop: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: item.value === 'Released' ? GREEN : '#f0f8f0' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Compliance Documents
        </div>
        {rec.documents.map((doc, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: 13, color: '#f0f8f0' }}>{doc.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: AMBER, marginTop: 4 }}>{doc.ref}</div>
            </div>
            <button onClick={() => onOpenDoc(doc.label, doc.ref)} style={{ padding: '6px 12px', borderRadius: 6, background: `${AMBER}15`, border: `1px solid ${AMBER}40`, color: AMBER, fontSize: 10, fontFamily: "var(--font-mono)", textTransform: 'uppercase', cursor: 'pointer' }}>
              View
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Ledger Record
        </div>
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Block</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#f0f8f0' }}>{rec.ledger.blockNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Tx Hash</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: AMBER }}>{rec.ledger.transactionId.substring(0, 16)}...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   DOCUMENT MODAL
══════════════════════════════════════════════════════════════════ */
function DocumentModal({ open, onClose, doc, rec }: { open: boolean; onClose: () => void; doc: { label: string; ref: string } | null; rec: typeof MANUFACTURING_RECORD }) {
  if (!doc) return null
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            style={{ background: 'rgba(10,5,2,0.95)', border: `1px solid ${AMBER}40`, borderRadius: 16, padding: 24, width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: `${AMBER}15`, border: `1px solid ${AMBER}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} color={AMBER} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Compliance Record</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: '#f0f8f0' }}>{doc.label}</div>
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Document Type</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 12, color: '#f0f8f0' }}>{doc.label}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Product Batch</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: GREEN }}>{rec.packaging.productBatchId}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Formulation ID</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: '#f0f8f0' }}>{rec.formulation.formulationId}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Reference Code</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: '#f0f8f0' }}>{doc.ref}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)' }}>Status</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: GREEN }}>Verified / Demonstration</span>
               </div>
            </div>
            
            <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 8, padding: 12, display: 'flex', gap: 12 }}>
              <Info size={16} color={AMBER} />
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: '#d0c8b0', lineHeight: 1.5 }}>
                Not attached to current prototype dataset. Available in production enterprise integration.
              </div>
            </div>
            
            <button onClick={onClose} style={{ width: '100%', padding: '12px', background: `${AMBER}20`, border: `1px solid ${AMBER}50`, borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: '#f0e8d8', cursor: 'pointer' }}>
              Close Viewer
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"""

content = content[:start_idx] + new_columns + content[end_idx:]

with open('src/components/ManufacturingStagePanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
