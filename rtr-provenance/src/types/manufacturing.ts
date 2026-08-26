/**
 * PRAMANA — Manufacturing Stage Types (Stage 4)
 *
 * Typed record for the COMPLETED historical manufacturing event that
 * transformed botanical batch ASH-2026-004 into finished product
 * PRD-ASH-2026-0447.
 *
 * Lineage: ASH-2026-004 → ManufacturingProcess → PRD-ASH-2026-0447
 *
 * PROTOTYPE NOTE: All IDs, licences, certificates, measurements, and
 * blockchain references are SIMULATED for demonstration purposes only.
 * Fields marked _proto: true must be replaced by real API data in production.
 */

/* ── Manufacturer / facility ────────────────────────────────────── */
export interface ManufacturingFacility {
  id:              string;   // "M-01"
  name:            string;   // "Himalaya Roots Formulations"
  location:        string;   // "Nashik, Maharashtra, India"
  licenceId:       string;
  licenceExpiry:   string;
  gmpCertificate:  string;
  facilityType:    string;
}

/* ── Botanical input batch (received from Transportation) ───────── */
export interface ManufacturingInputBatch {
  batchId:        string;   // "ASH-2026-004"
  species:        string;   // "Ashwagandha"
  botanicalName:  string;   // "Withania somnifera (L.) Dunal"
  plantPart:      string;   // "Root (dried)"
  materialType:   string;
  quantityKg:     number;
  acceptanceStatus: string;
  sourceStage:    string;
}

/* ── A single processing step ───────────────────────────────────── */
export interface ProcessingStep {
  step:        number;
  name:        string;
  detail:      string;
  inputQty?:   string;
  outputQty?:  string;
  temperature?: string;
  humidity?:   string;
  duration?:   string;
  anomaly:     boolean;
  status:      'pass' | 'warning';
}

/* ── Manufacturing event envelope ───────────────────────────────── */
export interface ManufacturingEvent {
  manufacturingId: string;   // "MFG-ASH-2026-004"
  acceptedAt:      string;
  completedAt:     string;
  batchMfgRecord:  string;
  status:          'Completed';
}

/* ── Formulation / product batch creation ───────────────────────── */
export interface ManufacturingFormulation {
  formulationId:  string;
  inputBatches:   string[];  // ["ASH-2026-004"]
  productBatchId: string;    // "PRD-ASH-2026-0447"
  productName:    string;
  dosageForm:     string;
  dosagePerUnit:  string;
  tabletCount:    number;
  composition:    { ingredient: string; amount: string; sourceBatch: string }[];
}

/* ── Packaging ──────────────────────────────────────────────────── */
export interface ManufacturingPackaging {
  productBatchId:    string;
  sku:               string;
  packSize:          string;
  packagingMaterial: string;
  bottleCount:       number;
  manufactureDate:   string;
  expiryDate:        string;
  packagingStatus:   string;
}

/* ── QR / serialisation ─────────────────────────────────────────── */
export interface ManufacturingQRLink {
  productBatchId: string;
  packSerial:     string;
  qrStatus:       string;
  qrEvent:        string;
}

/* ── Quality release ────────────────────────────────────────────── */
export interface ManufacturingQualityRelease {
  releaseRecord: string;
  releaseDate:   string;
  releasedBy:    string;
  status:        'Released';
}

/* ── Ledger / blockchain anchor ─────────────────────────────────── */
export interface ManufacturingLedger {
  transactionId: string;
  blockNumber:   string;
  timestamp:     string;
  network:       string;
  _proto:        boolean;
}

/* ── Verification check ─────────────────────────────────────────── */
export interface ManufacturingCheck {
  label:  string;
  detail: string;
  status: 'pass' | 'warning' | 'fail';
}

/* ── Linked document stub ───────────────────────────────────────── */
export interface ManufacturingDocument {
  label:     string;
  ref:       string;
  attached:  boolean;  // false = "not in prototype dataset"
  _proto:    boolean;
}

/* ── Root record ────────────────────────────────────────────────── */
export interface ManufacturingRecord {
  stageNumber:    4;
  stage:          'MANUFACTURING';
  title:          'Manufacturing';
  status:         'Verified';

  manufacturer:     ManufacturingFacility;
  inputBatch:       ManufacturingInputBatch;
  manufacturing:    ManufacturingEvent;
  processingSteps:  ProcessingStep[];
  formulation:      ManufacturingFormulation;
  packaging:        ManufacturingPackaging;
  qrLink:           ManufacturingQRLink;
  qualityRelease:   ManufacturingQualityRelease;
  documents:        ManufacturingDocument[];
  checks:           ManufacturingCheck[];
  ledger:           ManufacturingLedger;
}
