/*
 * PRAMANA — Provenance Type System
 *
 * Designed to match production data shape so a real backend can replace
 * static data without touching component logic.
 *
 * PROTOTYPE NOTE: All document IDs, blockchain hashes, GPS coordinates,
 * and certificate numbers are simulated for demonstration purposes.
 * They are clearly marked with _proto: true so an integration layer
 * can filter / replace them later.
 */

/* ── Primitive shared types ─────────────────────────────────────── */

export type StageStatus = 'verified' | 'pending' | 'failed';
export type StageType   = 'farmer' | 'lab' | 'transport' | 'manufacturing' | 'product';

/** A single verification assertion */
export interface VerificationCheck {
  label:   string;
  detail?: string;
  status:  'pass' | 'fail' | 'warning';
  _proto?: boolean;   // true = simulated in prototype
}

/** A linked document (test report, permit, certificate, etc.) */
export interface LinkedDocument {
  label:    string;     // "NABL Test Report"
  ref:      string;     // human-readable ID / filename
  url?:     string;     // future: real URL
  _proto:   boolean;    // always true in prototype
}

/** Blockchain / ledger record — stub shape matching production intent */
export interface BlockchainRecord {
  txHash:    string;
  blockNum:  string;
  timestamp: string;
  network:   string;
  _proto:    boolean;
}

/** GPS coordinates */
export interface GeoPoint {
  lat:     number;
  lng:     number;
  label:   string;
  city:    string;
  state:   string;
  country: string;
}

/* ══════════════════════════════════════════════════════════════════
   STAGE-SPECIFIC DATA SHAPES
   Every stage extends a shared BaseStageData, then adds its own
   domain-specific fields. This mirrors what a production API would return.
══════════════════════════════════════════════════════════════════════ */

/** Shared base — present on every stage */
interface BaseStageData {
  stageId:     string;
  eventId:     string;           // unique event / record ID
  date:        string;           // ISO-8601 or human display string
  entity:      string;           // responsible party name
  entityType:  string;           // "Farm Cooperative" | "Laboratory" | ...
  description: string;           // full paragraph for "About this stage"
  location:    GeoPoint;
  documents:   LinkedDocument[];
  blockchain:  BlockchainRecord;
  checks:      VerificationCheck[];
}

/* ─── Stage 1: Farmer / Collection ─────────────────────────────── */
export interface FarmerStageData extends BaseStageData {
  type:              'farmer';
  collectionHub:     string;
  species:           string;
  botanicalName:     string;
  partUsed:          string;     // "Root"
  cultivationType:   string;     // "Organic / Wild-collected"
  harvestSeason:     string;
  totalCollection:   string;     // "640 kg"
  farmerCount:       number;
  farmerCooperative: string;
  batchId:           string;
  soilHealthStatus:  string;
  collectorLicense:  string;
  /* Extended farmer identity fields */
  farmerName:        string;
  farmerRole:        string;
  farmerDistrict:    string;
  farmerState:       string;
  collectionId:      string;
  collectionTime:    string;
  collectionMethod:  string;
  gpsAccuracyM:      number;
  farmerImageUrl:    string;
}

/* ─── Stage 2: Laboratory Testing ──────────────────────────────── */
export interface LabStageData extends BaseStageData {
  type:               'lab';
  labName:            string;
  accreditation:      string;
  sampleId:           string;
  testDate:           string;
  certificateId:      string;
  withanolideContent: string;
  /* Extended lab fields */
  testId:             string;
  laboratoryId:       string;
  batchId:            string;
  sampleReceivedDate: string;
  sampleReceivedTime: string;
  sampleQuantity:     string;
  reportId:           string;
  reportIssueDate:    string;
  labCity:            string;
  labImageUrl:        string;
  results: {
    label:   string;
    value:   string;
    unit?:   string;
    limit?:  string;
    method?: string;
    status:  'pass' | 'warning' | 'fail';
    detail?: string;
  }[];
}

/* ─── Stage 3: Transportation ───────────────────────────────────── */
export interface TransportStageData extends BaseStageData {
  type:            'transport';
  carrier:         string;
  vehicleId:       string;
  pickupDate:      string;
  deliveryDate:    string;
  origin:          string;
  destination:     string;
  distanceKm:      number;
  storageCondition: string;
  metrics: {
    label:   string;
    value:   string;
    status:  'pass' | 'warning' | 'fail';
  }[];
}

/* ─── Stage 4: Manufacturing ────────────────────────────────────── */
export interface ManufacturingStageData extends BaseStageData {
  type:           'manufacturing';
  manufacturer:   string;
  facilityLicense: string;
  gmpCertificate: string;
  inputBatch:     string;
  outputBatch:    string;
  tabletCount:    number;
  dosagePerUnit:  string;         // "300 mg"
  excipients:     string[];
  steps: {
    step:    number;
    name:    string;
    detail:  string;
    input?:  string;
    output?: string;
    status:  'pass' | 'warning';
  }[];
}

/* ─── Stage 5: Final Product / Packaging ──────────────────── */
export interface ProductStageData extends BaseStageData {
  type:                'product';
  productName:         string;
  brand:               string;
  skuCode:             string;
  batchCode:           string;
  packSerial:          string;
  tabletCount:         number;
  netWeight:           string;
  manufactured:        string;
  expiry:              string;
  qrLinkedTo:          string;
  /* Extended product fields */
  productId:           string;
  qrIdentifier:        string;
  scratchCodeEnabled:  boolean;
  stagesVerified:      number;
  traceabilityPct:     number;
  productImageUrl:     string;
  chainSummary: {
    stage:   string;
    eventId: string;
    status:  'pass' | 'fail';
    color:   string;
    icon:    string;
  }[];
}

/* ══════════════════════════════════════════════════════════════════
   DISCRIMINATED UNION
══════════════════════════════════════════════════════════════════════ */
export type StageData =
  | FarmerStageData
  | LabStageData
  | TransportStageData
  | ManufacturingStageData
  | ProductStageData;

/* ── ProvenanceStage ────────────────────────────────────────────── */
export interface ProvenanceStage {
  id:            string;
  number:        number;
  type:          StageType;
  title:         string;
  subtitle:      string;
  purposeLabel:  string;
  status:        StageStatus;
  color:         string;          // hex
  glowColor:     string;          // rgba
  nodePosition:  'up' | 'down';
  tPosition:     number;          // 0–1 along DNA axis
  data:          StageData;
}

/* ── ProvenanceProduct ──────────────────────────────────────────── */
export interface ProvenanceProduct {
  productName:        string;
  brand:              string;
  category:           string;
  skuCode:            string;
  batchCode:          string;
  packSerial:         string;
  tabletCount:        number;
  netWeight:          string;
  manufacturedDate:   string;
  expiryDate:         string;
  status:             'PRODUCT VERIFIED';
  traceabilityLabel:  string;
  scratchCode:        string;
  // Legacy aliases kept for backward-compat with existing components
  batch:              string;
  name:               string;
  stages:             ProvenanceStage[];
}
