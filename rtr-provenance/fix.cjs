const fs = require('fs');
let lines = fs.readFileSync('src/components/StageDetailPanel.tsx', 'utf8').split('\n');
lines = lines.slice(0, 1840);
const code = `
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
fs.writeFileSync('src/components/StageDetailPanel.tsx', lines.join('\n') + '\n' + code);
