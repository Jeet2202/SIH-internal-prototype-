const fs = require('fs');
let content = fs.readFileSync('src/components/StageDetailPanel.tsx', 'utf8');

// 1. Imports
content = content.replace(/import DocumentPreviewModal from '\.\/DocumentPreviewModal'\r?\nimport LabReportModal from '\.\/LabReportModal'\r?\nimport ProductDocumentsModal from '\.\/ProductDocumentsModal'/, '');
content = content.replace('LinkedDocument,', 'ProvenanceDocument,');

// 2. State
content = content.replace(
  '  const [docModalOpen,  setDocModalOpen]  = useState(false)\n  const [labModalOpen,  setLabModalOpen]  = useState(false)\n  const [prodDocsOpen,  setProdDocsOpen]  = useState(false)',
  '  const [selectedDoc,   setSelectedDoc]  = useState<ProvenanceDocument | null>(null)'
);
content = content.replace(
  '  const [docModalOpen,  setDocModalOpen]  = useState(false)\r\n  const [labModalOpen,  setLabModalOpen]  = useState(false)\r\n  const [prodDocsOpen,  setProdDocsOpen]  = useState(false)',
  '  const [selectedDoc,   setSelectedDoc]  = useState<ProvenanceDocument | null>(null)'
);

content = content.replace(
  '    setDocModalOpen(false)\n    setLabModalOpen(false)\n    setProdDocsOpen(false)',
  '    setSelectedDoc(null)'
);
content = content.replace(
  '    setDocModalOpen(false)\r\n    setLabModalOpen(false)\r\n    setProdDocsOpen(false)',
  '    setSelectedDoc(null)'
);

content = content.replace(
  '        if (docModalOpen)  { setDocModalOpen(false);  return }\n        if (labModalOpen)  { setLabModalOpen(false);  return }\n        if (prodDocsOpen)  { setProdDocsOpen(false);  return }',
  '        if (selectedDoc)   { setSelectedDoc(null);  return }'
);
content = content.replace(
  '        if (docModalOpen)  { setDocModalOpen(false);  return }\r\n        if (labModalOpen)  { setLabModalOpen(false);  return }\r\n        if (prodDocsOpen)  { setProdDocsOpen(false);  return }',
  '        if (selectedDoc)   { setSelectedDoc(null);  return }'
);

content = content.replace(
  '}, [onClose, docModalOpen, labModalOpen, prodDocsOpen, reviewOpen])',
  '}, [onClose, selectedDoc, reviewOpen])'
);

// 3. Modals replacement
content = content.replace(
  /      \{\/\* Document preview modal \*\/\}[\s\S]*?onClose=\{\(\) => setProdDocsOpen\(false\)\}\r?\n      \/>/,
  `      {/* Unified Document viewer modal */}
      <UnifiedDocumentModal
        doc={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />`
);

// 4. FarmerPanelLayout & LabPanelLayout signatures
content = content.replace('onOpenDoc={() => setDocModalOpen(true)}', '');
content = content.replace('onOpenReport={() => setLabModalOpen(true)}', '');
content = content.replace('onOpenDocs={() => setProdDocsOpen(true)}', 'onOpenDocs={(doc) => setSelectedDoc(doc)}');

content = content.replace('onClose: _onClose, onOpenReport }: {', 'onClose: _onClose }: {');
content = content.replace('  onOpenReport: () => void\n', '');
content = content.replace('  onOpenReport: () => void\r\n', '');

content = content.replace('onClose: _onClose, onOpenDoc }: {', 'onClose: _onClose }: {');
content = content.replace('  onOpenDoc:  () => void\n', '');
content = content.replace('  onOpenDoc:  () => void\r\n', '');

// 5. Remove View Buttons
// Lab View Button
content = content.replace(
  /            <button\r?\n              onClick=\{onOpenReport\}[\s\S]*?<\/button>/,
  ''
);
content = content.replace(
  /          <div style=\{\{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 7, padding: '4px 8px', background: 'rgba\(255,165,0,0\.07\)', border: '1px solid rgba\(255,165,0,0\.22\)', borderRadius: 6 \}\}>\r?\n            <AlertTriangle size=\{7\} color="rgba\(255,165,0,0\.65\)" \/>\r?\n            <span style=\{\{ fontFamily: "var\(--font-mono\)", fontSize: 7\.5, color: 'rgba\(255,165,0,0\.60\)' \}\}>\r?\n              Demonstration Record — not a real laboratory report\r?\n            <\/span>\r?\n          <\/div>/,
  `          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 7, padding: '4px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: 'var(--night-dim)' }}>
              DOCUMENT AVAILABLE IN FINAL PRODUCT RECORD
            </span>
          </div>`
);

// Farmer View Button
content = content.replace(
  /            \{\/\* View Document button \*\/\}[\s\S]*?<\/button>/,
  ''
);
content = content.replace(
  /          \{\/\* Prototype label \*\/\}[\s\S]*?SIMULATED RECORD\r?\n          <\/div>/,
  `          {/* Prototype label */}
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 7, color: 'var(--night-dim)', marginTop: 8,
            borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 6,
          }}>
            DOCUMENT AVAILABLE
          </div>`
);

content = content.replace(
  /\{d\.documents\[0\]\.ref\}/,
  '{d.eventId}'
);
content = content.replace(
  /          <div style=\{\{ fontSize: 11, color: '#d4e8ce', marginBottom: 2 \}\}>\r?\n            Botanical Source \/ Collection Record\r?\n          <\/div>\r?\n/,
  ''
);

// 6. Generic Column 3
content = content.replace(
  /        <div style=\{\{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 \}\}>\r?\n          <FileText size=\{10\} color="var\(--night-dim\)" \/>\r?\n          <span style=\{\{ fontFamily: "var\(--font-mono\)", fontSize: 8\.5, letterSpacing: '0\.14em', textTransform: 'uppercase', color: 'var\(--night-dim\)' \}\}>Linked Documents<\/span>\r?\n          <span style=\{\{ marginLeft: 'auto', fontFamily: "var\(--font-mono\)", fontSize: 7, color: 'rgba\(255,165,0,0\.55\)', textTransform: 'uppercase', letterSpacing: '0\.10em' \}\}>⚠ PROTOTYPE<\/span>\r?\n        <\/div>\r?\n        \{d\.documents\.slice\(0, 4\)\.map\(\(doc, i\) => <DocRow key=\{i\} doc=\{doc\} \/>\)\}\r?\n      <\/motion\.div>/,
  ''
);

// 7. DocRow
content = content.replace(
  /function DocRow\(\{ doc \}: \{ doc: LinkedDocument \}\) \{[\s\S]*?\}\r?\n\r?\n/,
  ''
);

// 8. Product Documents Map
content = content.replace(
  /          <div style=\{\{ display: 'flex', alignItems: 'center', gap: 6 \}\}>\r?\n              <FileText size=\{9\} color=\{C\} \/>\r?\n              <span style=\{\{ fontFamily: "var\(--font-mono\)", fontSize: 8, letterSpacing: '0\.16em', textTransform: 'uppercase', color: C \}\}>\r?\n                Provenance Documents\r?\n              <\/span>\r?\n            <\/div>[\s\S]*?<\/button>\r?\n            <\/div>\r?\n          \)\)}/,
  `          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={9} color={C} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: C }}>
                Provenance Documents
              </span>
            </div>
          </div>
          {d.provenanceDocuments.map((doc, i) => (
            <div key={i} style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.06)', 
              borderRadius: 8, 
              padding: '8px 10px',
              marginBottom: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: 10, color: '#dff0f8', marginBottom: 2 }}>{doc.title}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, color: 'var(--night-dim)' }}>{doc.description}</div>
              </div>
              <button
                onClick={() => onOpenDocs(doc)}
                style={{
                  flexShrink: 0, padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                  background: \`\${C}10\`, border: \`1px solid \${C}25\`,
                  fontFamily: "var(--font-mono)", fontSize: 7.5, color: \`\${C}90\`,
                  letterSpacing: '0.08em', textTransform: 'uppercase'
                }}
              >View</button>
            </div>
          ))}`
);

// 9. ProductPanelLayout Signature
content = content.replace(
  'onOpenDocs:    () => void',
  'onOpenDocs:    (doc: ProvenanceDocument) => void'
);

// 10. UnifiedDocumentModal appending
const modalCode = `
function UnifiedDocumentModal({ doc, onClose }: { doc: ProvenanceDocument | null, onClose: () => void }) {
  if (!doc) return null;
  const ACCENT = '#7CFF4F';
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: 'rgba(5,12,4,0.98)',
          border: \`1px solid \${ACCENT}50\`,
          borderRadius: 16,
          width: 'min(800px, 96vw)',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: \`0 28px 90px rgba(0,0,0,0.80), 0 0 60px \${ACCENT}20\`,
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: \`1px solid \${ACCENT}30\`,
          background: \`\${ACCENT}0a\`
        }}>
          <span style={{ fontFamily: 'var(--font-display)', color: '#dff0f8', fontSize: 14, fontWeight: 600 }}>{doc.title}</span>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            }}
          >
            <X size={14} />
          </button>
        </div>
        
        <iframe
          src={\`\${doc.fileUrl}#toolbar=0\`}
          style={{ width: '100%', flex: 1, border: 'none' }}
          title={doc.title}
        />
      </motion.div>
    </div>
  )
}
`;

fs.writeFileSync('src/components/StageDetailPanel.tsx', content + '\n' + modalCode);
