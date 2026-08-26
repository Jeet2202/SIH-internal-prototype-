const fs = require('fs');
let content = fs.readFileSync('src/components/ManufacturingStagePanel.tsx', 'utf8');

// 1. Remove state
content = content.replace(
  '  const [docModalOpen, setDocModalOpen] = useState(false)\n  const [selectedDoc, setSelectedDoc] = useState<{label: string; ref: string} | null>(null)',
  ''
);
content = content.replace(
  '  const [docModalOpen, setDocModalOpen] = useState(false)\r\n  const [selectedDoc, setSelectedDoc] = useState<{label: string; ref: string} | null>(null)',
  ''
);

content = content.replace(
  '    setDocModalOpen(false)\n    setSelectedDoc(null)',
  ''
);
content = content.replace(
  '    setDocModalOpen(false)\r\n    setSelectedDoc(null)',
  ''
);

content = content.replace(
  '        if (docModalOpen) { setDocModalOpen(false); return }',
  ''
);

content = content.replace(
  '}, [onClose, docModalOpen])',
  '}, [onClose])'
);

content = content.replace(
  '  const handleOpenDoc = (doc: {label: string; ref: string}) => {\n    setSelectedDoc(doc)\n    setDocModalOpen(true)\n  }',
  ''
);
content = content.replace(
  '  const handleOpenDoc = (doc: {label: string; ref: string}) => {\r\n    setSelectedDoc(doc)\r\n    setDocModalOpen(true)\r\n  }',
  ''
);

// 2. MiddleColumn signature
content = content.replace('function MiddleColumn({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (doc: any) => void }) {', 'function MiddleColumn({ rec }: { rec: typeof MANUFACTURING_RECORD }) {');
content = content.replace('<MiddleColumn rec={rec} onOpenDoc={handleOpenDoc} />', '<MiddleColumn rec={rec} />');

// 3. RightColumn signature
content = content.replace('function RightColumn({ rec, onOpenDoc }: { rec: typeof MANUFACTURING_RECORD; onOpenDoc: (doc: any) => void }) {', 'function RightColumn({ rec }: { rec: typeof MANUFACTURING_RECORD }) {');
content = content.replace('<RightColumn  rec={rec} onOpenDoc={handleOpenDoc} />', '<RightColumn  rec={rec} />');

// 4. Remove DocumentViewer invocation
let docModalInvocationRegex = /          \{\/\* Document Viewer Modal \*\/\}[\s\S]*?rec=\{rec\}\r?\n          \/>/;
content = content.replace(docModalInvocationRegex, '');

// 5. Remove DocumentModal definition
let docModalRegex = /function DocumentModal\(\{[\s\S]*?\}\)\s*\{[\s\S]*?\n\}\n/g;
content = content.replace(docModalRegex, '');

// 6. MiddleColumn View buttons
let mcViewBtnRegex = /            <button\r?\n\s*onClick=\{[\s\S]*?\}\r?\n\s*style=\{\{\r?\n\s*marginLeft: 'auto',[\s\S]*?<\/button>/g;
content = content.replace(mcViewBtnRegex, '');

// 7. RightColumn View buttons
let rcViewBtnRegex = /<button\r?\n\s*onClick=\{[\s\S]*?\}\r?\n\s*style=\{\{\r?\n\s*display: 'flex',[\s\S]*?<\/button>/g;
content = content.replace(rcViewBtnRegex, '');

fs.writeFileSync('src/components/ManufacturingStagePanel.tsx', content);
