const fs = require('fs');
let content = fs.readFileSync('src/components/StageDetailPanel.tsx', 'utf8');

// 1. Imports
content = content.replace(
  "import DocumentPreviewModal from './DocumentPreviewModal'\r\nimport LabReportModal from './LabReportModal'\r\nimport ProductDocumentsModal from './ProductDocumentsModal'", 
  ""
);
content = content.replace(
  "import DocumentPreviewModal from './DocumentPreviewModal'\nimport LabReportModal from './LabReportModal'\nimport ProductDocumentsModal from './ProductDocumentsModal'", 
  ""
);
content = content.replace('LinkedDocument,', 'ProvenanceDocument,');

// 2. Modals to UnifiedDocumentModal
content = content.replace(
  '  const [docModalOpen,  setDocModalOpen]  = useState(false)\n  const [labModalOpen,  setLabModalOpen]  = useState(false)\n  const [prodDocsOpen,  setProdDocsOpen]  = useState(false)',
  '  const [selectedDoc,   setSelectedDoc]  = useState<ProvenanceDocument | null>(null)'
);
content = content.replace(
  '  const [docModalOpen,  setDocModalOpen]  = useState(false)\r\n  const [labModalOpen,  setLabModalOpen]  = useState(false)\r\n  const [prodDocsOpen,  setProdDocsOpen]  = useState(false)',
  '  const [selectedDoc,   setSelectedDoc]  = useState<ProvenanceDocument | null>(null)'
);

content = content.replace('setDocModalOpen(false)\n    setLabModalOpen(false)\n    setProdDocsOpen(false)', 'setSelectedDoc(null)');
content = content.replace('setDocModalOpen(false)\r\n    setLabModalOpen(false)\r\n    setProdDocsOpen(false)', 'setSelectedDoc(null)');

content = content.replace('if (docModalOpen)  { setDocModalOpen(false);  return }\n        if (labModalOpen)  { setLabModalOpen(false);  return }\n        if (prodDocsOpen)  { setProdDocsOpen(false);  return }', 'if (selectedDoc)   { setSelectedDoc(null);  return }');
content = content.replace('if (docModalOpen)  { setDocModalOpen(false);  return }\r\n        if (labModalOpen)  { setLabModalOpen(false);  return }\r\n        if (prodDocsOpen)  { setProdDocsOpen(false);  return }', 'if (selectedDoc)   { setSelectedDoc(null);  return }');

content = content.replace('onClose, docModalOpen, labModalOpen, prodDocsOpen, reviewOpen', 'onClose, selectedDoc, reviewOpen');

content = content.replace('onOpenDoc={() => setDocModalOpen(true)}', '');
content = content.replace('onOpenReport={() => setLabModalOpen(true)}', '');
content = content.replace('onOpenDocs={() => setProdDocsOpen(true)}', 'onOpenDocs={(doc) => setSelectedDoc(doc)}');

let modalsRegex = /\{\/\* Document preview modal \*\/\}[\s\S]*?onClose=\{\(\) => setProdDocsOpen\(false\)\}\r?\n\s+\/>/;
content = content.replace(modalsRegex, `{/* Unified Document viewer modal */}
      <UnifiedDocumentModal
        doc={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />`);

// 3. Remove view button from Farmer Panel
let farmerViewBtnRegex = /\{\/\* View Document button \*\/\}[\s\S]*?<\/button>/;
content = content.replace(farmerViewBtnRegex, '');

// 4. Change simulated label in Farmer Panel
let simRecordRegex = /\{\/\* Prototype label \*\/\}[\s\S]*?SIMULATED RECORD\r?\n\s+<\/div>/;
content = content.replace(simRecordRegex, `{/* Prototype label */}
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 7, color: 'var(--night-dim)', marginTop: 8,
            borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 6,
          }}>
            DOCUMENT AVAILABLE IN FINAL PRODUCT RECORD
          </div>`);
content = content.replace('{d.documents[0].ref}', '{d.eventId}');

let farmerColRecordTitle = /<div style=\{\{\s*fontSize: 11,\s*color: '#d4e8ce',\s*marginBottom: 2\s*\}\}>\r?\n\s*Botanical Source \/ Collection Record\r?\n\s*<\/div>\r?\n/;
content = content.replace(farmerColRecordTitle, '');

// 5. Remove view button from Lab Panel
let labViewBtnRegex = /<button\r?\n\s*onClick=\{onOpenReport\}[\s\S]*?<\/button>/;
content = content.replace(labViewBtnRegex, '');

let labSimRecordRegex = /<div style=\{\{\s*display: 'flex',\s*alignItems: 'center',\s*gap: 4,\s*marginTop: 7,\s*padding: '4px 8px',\s*background: 'rgba\(255,165,0,0\.07\)',\s*border: '1px solid rgba\(255,165,0,0\.22\)',\s*borderRadius: 6\s*\}\}>\r?\n\s*<AlertTriangle size=\{7\} color="rgba\(255,165,0,0\.65\)" \/>\r?\n\s*<span style=\{\{\s*fontFamily: "var\(--font-mono\)",\s*fontSize: 7\.5,\s*color: 'rgba\(255,165,0,0\.60\)'\s*\}\}>\r?\n\s*Demonstration Record — not a real laboratory report\r?\n\s*<\/span>\r?\n\s*<\/div>/;
content = content.replace(labSimRecordRegex, `<div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 7, padding: '4px 8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 7, color: 'var(--night-dim)' }}>
              DOCUMENT AVAILABLE IN FINAL PRODUCT RECORD
            </span>
          </div>`);

// 6. Fix signatures
content = content.replace('onClose: _onClose, onOpenReport }: {', 'onClose: _onClose }: {');
content = content.replace('  onOpenReport: () => void\r\n', '');
content = content.replace('  onOpenReport: () => void\n', '');

content = content.replace('onClose: _onClose, onOpenDoc }: {', 'onClose: _onClose }: {');
content = content.replace('  onOpenDoc:  () => void\r\n', '');
content = content.replace('  onOpenDoc:  () => void\n', '');

content = content.replace('onOpenDocs:    () => void', 'onOpenDocs:    (doc: ProvenanceDocument) => void');

// 7. Remove linked documents section from Column3Generic
let col3GenericRegex = /<div style=\{\{\s*display: 'flex',\s*alignItems: 'center',\s*gap: 6,\s*marginBottom: 8\s*\}\}>\r?\n\s*<FileText size=\{10\} color="var\(--night-dim\)" \/>\r?\n\s*<span style=\{\{\s*fontFamily: "var\(--font-mono\)",\s*fontSize: 8\.5,\s*letterSpacing: '0\.14em',\s*textTransform: 'uppercase',\s*color: 'var\(--night-dim\)'\s*\}\}>Linked Documents<\/span>\r?\n\s*<span style=\{\{\s*marginLeft: 'auto',\s*fontFamily: "var\(--font-mono\)",\s*fontSize: 7,\s*color: 'rgba\(255,165,0,0\.55\)',\s*textTransform: 'uppercase',\s*letterSpacing: '0\.10em'\s*\}\}>⚠ PROTOTYPE<\/span>\r?\n\s*<\/div>\r?\n\s*\{d\.documents\.slice\(0, 4\)\.map\(\(doc, i\) => <DocRow key=\{i\} doc=\{doc\} \/>\)\}\r?\n\s*<\/motion\.div>/;

// Replace it with just the closing tags for the previous elements if needed? Wait, Column3Generic has multiple motion.divs.
// It's the whole motion.div. I should replace the whole motion.div.
let col3GenericMotionRegex = /<motion\.div initial=\{\{\s*opacity: 0,\s*y: 4\s*\}\} animate=\{\{\s*opacity: 1,\s*y: 0\s*\}\} transition=\{\{\s*delay: 0\.34,\s*duration: 0\.28\s*\}\}\r?\n\s*style=\{\{\s*background: 'rgba\(255,255,255,0\.015\)',\s*border: '1px solid rgba\(255,255,255,0\.07\)',\s*borderRadius: 13,\s*padding: '11px 14px'\s*\}\}>\r?\n\s*<div style=\{\{\s*display: 'flex',\s*alignItems: 'center',\s*gap: 6,\s*marginBottom: 8\s*\}\}>\r?\n\s*<FileText size=\{10\} color="var\(--night-dim\)" \/>\r?\n\s*<span style=\{\{\s*fontFamily: "var\(--font-mono\)",\s*fontSize: 8\.5,\s*letterSpacing: '0\.14em',\s*textTransform: 'uppercase',\s*color: 'var\(--night-dim\)'\s*\}\}>Linked Documents<\/span>\r?\n\s*<span style=\{\{\s*marginLeft: 'auto',\s*fontFamily: "var\(--font-mono\)",\s*fontSize: 7,\s*color: 'rgba\(255,165,0,0\.55\)',\s*textTransform: 'uppercase',\s*letterSpacing: '0\.10em'\s*\}\}>⚠ PROTOTYPE<\/span>\r?\n\s*<\/div>\r?\n\s*\{d\.documents\.slice\(0, 4\)\.map\(\(doc, i\) => <DocRow key=\{i\} doc=\{doc\} \/>\)\}\r?\n\s*<\/motion\.div>/;

content = content.replace(col3GenericMotionRegex, '');

// 8. DocRow function removal
let docRowRegex = /function DocRow\(\{ doc \}: \{ doc: LinkedDocument \}\) \{[\s\S]*?\}\r?\n\r?\n/;
content = content.replace(docRowRegex, '');

// 9. Update Product Documents section
let productDocsRegex = /<div style=\{\{\s*display: 'flex',\s*alignItems: 'center',\s*gap: 6\s*\}\}>\r?\n\s*<FileText size=\{9\} color=\{C\} \/>\r?\n\s*<span style=\{\{\s*fontFamily: "var\(--font-mono\)",\s*fontSize: 8,\s*letterSpacing: '0\.16em',\s*textTransform: 'uppercase',\s*color: C\s*\}\}>\r?\n\s*Provenance Documents\r?\n\s*<\/span>\r?\n\s*<\/div>[\s\S]*?<\/button>\r?\n\s*<\/div>\r?\n\s*\)\)}/;

content = content.replace(productDocsRegex, `<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
          ))}`);

// 10. Append UnifiedDocumentModal
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
