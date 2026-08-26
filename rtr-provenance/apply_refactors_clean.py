import re

with open('src/components/StageDetailPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import for StageDetailHeader
if "import StageDetailHeader" not in content:
    content = content.replace("import { LocationMap } from './maps'", "import { LocationMap } from './maps'\nimport StageDetailHeader from './StageDetailHeader'")

# 2. Replace Top Portal Anchor Bar
anchor_start = content.find('{/* Top Portal Anchor Bar */}')
anchor_end = content.find('{/* Stage-specific layout */}')
if anchor_start != -1 and anchor_end != -1:
    replacement = """{/* Global Stage Header */}
            <StageDetailHeader
              stageNumber={stage.number}
              title={stage.title}
              status={stage.status}
              description={stage.subtitle}
              accentColor={stage.color}
              onClose={onClose}
            />
            
            """
    content = content[:anchor_start] + replacement + content[anchor_end:]

# 3. Replace FarmerPanelLayout (lines ~566 to 933)
farmer_start = content.find('function FarmerPanelLayout')
farmer_end = content.find('function FarmerDataRow')
new_farmer = """function FarmerPanelLayout({ stage, checksDone, onClose: _onClose, onOpenDoc }: {
  stage:        ProvenanceStage
  checksDone:   boolean
  onClose:      () => void
  onOpenDoc:    () => void
}) {
  const d = stage.data as FarmerStageData
  const C = stage.color

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
          { label: 'Source Location',  value: `${d.farmerDistrict}, ${d.farmerState}` },
          { label: 'Species',          value: d.species },
          { label: 'Plant Part',       value: d.partUsed },
          { label: 'Collection Time',  value: d.collectionTime },
          { label: 'Quantity',         value: d.totalCollection },
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
          <LocationMap
            location={{ lat: 19.9975, lng: 73.7898 }}
            type="farmer"
            label={`${d.farmerName} — Collection`}
            sublabel={`${d.farmerDistrict}, ${d.farmerState}`}
            privacy="customer"
            accuracyM={d.gpsAccuracyM}
            statusBadge="GPS CAPTURED ✓ LOCATION VERIFIED ✓"
            height={200}
          />
        </div>
      </div>

      {/* ═══ COL 3: Certificates & Ledger ═══ */}
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
        {/* Compliance */}
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Agronomy Details
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: 13, color: '#f0f8f0' }}>Soil Health Status</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C, marginTop: 4 }}>{d.soilHealthStatus}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: 13, color: '#f0f8f0' }}>Cultivation Type</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C, marginTop: 4 }}>{d.cultivationType}</div>
            </div>
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
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#f0f8f0' }}>#8219914</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Tx Hash</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: C }}>0x4b7f...9e21</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"""
if farmer_start != -1 and farmer_end != -1:
    content = content[:farmer_start] + new_farmer + content[farmer_end:]


# 4. Replace LabPanelLayout (lines ~248 to 544)
lab_start = content.find('function LabPanelLayout')
lab_end = content.find('function LabKV')
new_lab = """function LabPanelLayout({ stage, checksDone, onClose: _onClose, onOpenReport }: {
  stage:        ProvenanceStage
  checksDone:   boolean
  onClose:      () => void
  onOpenReport: () => void
}) {
  const d = stage.data as LabStageData
  const C = stage.color

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '32% 34% 34%', gap: 0, minHeight: 0 }}>
      {/* ═══ COL 1: Testing Identity ═══ */}
      <div style={{
        padding: '24px 32px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto',
      }}>
        {[
          { label: 'Laboratory',       value: d.labName },
          { label: 'Location',         value: d.labCity },
          { label: 'Accreditation',    value: d.accreditation },
          { label: 'Test ID',          value: d.testId },
          { label: 'Batch ID',         value: d.batchId },
          { label: 'Report Issued',    value: d.reportIssueDate },
          { label: 'Withanolides',     value: d.withanolideContent },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{item.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: '#f0f8f0', textAlign: 'right' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* ═══ COL 2: Test Results ═══ */}
      <div style={{ padding: '24px 32px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
          Analytical Results
        </div>
        {d.results.map((res, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < d.results.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: 8, paddingTop: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{res.label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 13, color: res.status === 'pass' ? '#7CFF4F' : '#f0f8f0' }}>{res.value} {res.unit ? res.unit : ''}</span>
          </div>
        ))}
      </div>

      {/* ═══ COL 3: Certificate & Ledger ═══ */}
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Certificate of Analysis
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: 13, color: '#f0f8f0' }}>Lab Report</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C, marginTop: 4 }}>{d.certificateId}</div>
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
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: '#f0f8f0' }}>#8245592</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: 'var(--night-dim)' }}>Tx Hash</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: C }}>0x9e12...b45a</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"""
if lab_start != -1 and lab_end != -1:
    content = content[:lab_start] + new_lab + content[lab_end:]


# 5. Replace ProductPanelLayout (lines ~1394 to 1692)
product_start = content.find('function ProductPanelLayout')
product_end = content.find('function PanelReviewModal')
new_product = """function ProductPanelLayout({ stage, checksDone, onClose: _onClose, onOpenDocs, onOpenReview }: {
  stage:        ProvenanceStage
  checksDone:   boolean
  onClose:      () => void
  onOpenDocs:   () => void
  onOpenReview: () => void
}) {
  const d = stage.data as ProductStageData
  const C = stage.color

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      
      <div style={{ padding: '40px 60px', display: 'flex', gap: 60, alignItems: 'center' }}>
        
        {/* Left: Product Image & Badges */}
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            {/* Soft glow behind the product */}
            <div style={{ position: 'absolute', inset: -20, background: `radial-gradient(circle, ${C}30 0%, transparent 70%)`, filter: 'blur(20px)' }} />
            <img src={d.productImageUrl || 'https://raw.githubusercontent.com/mudassirdjsce/SIH-internal-prototype-/refs/heads/main/public/demo-assets/himalaya-bottle.png'} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
          </div>
        </div>

        {/* Right: Product Details & Metrics */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Header */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
              {d.brand}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: '#f0f8f0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {d.productName}
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
            {[
              { label: 'Product Batch',  value: d.batchCode },
              { label: 'Pack Serial',    value: d.packSerial },
              { label: 'Tablet Count',   value: d.tabletCount + ' tablets' },
              { label: 'Net Weight',     value: d.netWeight },
              { label: 'Manufactured',   value: d.manufactured },
              { label: 'Expiry',         value: d.expiry },
            ].map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: 'var(--night-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: '#f0f8f0' }}>{item.value}</div>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
             <button
              onClick={onOpenDocs}
              style={{
                flex: 1, padding: '16px 24px', borderRadius: 12,
                background: `linear-gradient(to right, ${C}20, transparent)`,
                border: `1px solid ${C}40`, color: '#f0f8f0',
                fontFamily: "var(--font-mono)", fontSize: 12, textTransform: 'uppercase',
                letterSpacing: '0.1em', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ color: C, fontSize: 10, marginBottom: 4 }}>View Records</div>
              <div>Quality Documents</div>
            </button>

            <button
              onClick={onOpenReview}
              style={{
                flex: 1, padding: '16px 24px', borderRadius: 12,
                background: `linear-gradient(to right, #7CFF4F20, transparent)`,
                border: `1px solid #7CFF4F40`, color: '#f0f8f0',
                fontFamily: "var(--font-mono)", fontSize: 12, textTransform: 'uppercase',
                letterSpacing: '0.1em', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ color: '#7CFF4F', fontSize: 10, marginBottom: 4 }}>Interactive</div>
              <div>Rate Product</div>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

"""
if product_start != -1 and product_end != -1:
    content = content[:product_start] + new_product + content[product_end:]


with open('src/components/StageDetailPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

