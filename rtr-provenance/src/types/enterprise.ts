/**
 * Root to Remedy — Enterprise Production Domain Entities
 *
 * Full data model for commercial botanical provenance, multi-party custody,
 * laboratory assays, smart insurance, verifiable certificates, and ledger auditing.
 */

/* ── 1. Identity & Tenancy ── */
export type UserRole =
  | 'FARMER'
  | 'COLLECTOR'
  | 'LAB_ANALYST'
  | 'TRANSPORTER'
  | 'MANUFACTURER'
  | 'INSURER'
  | 'ADMIN'
  | 'CUSTOMER'

export interface Organization {
  id:          string
  name:        string
  type:        'COOPERATIVE' | 'LABORATORY' | 'LOGISTICS' | 'MANUFACTURER' | 'INSURANCE_PARTNER' | 'REGULATOR'
  regNumber:   string
  country:     string
  state:       string
  verifiedAt:  string
  status:      'ACTIVE' | 'SUSPENDED' | 'PENDING_AUDIT'
}

export interface EnterpriseUser {
  id:          string
  orgId:       string
  email:       string
  fullName:    string
  role:        UserRole
  phone?:      string
  createdAt:   string
}

/* ── 2. Botanical Raw Material & Collection ── */
export interface BotanicalBatch {
  id:              string
  batchNumber:     string
  cooperativeId:   string
  collectorId:     string
  species:         string
  botanicalName:   string
  partUsed:        string
  harvestDate:     string
  quantityKg:      number
  location: {
    lat:           number
    lng:           number
    accuracyM:     number
    district:      string
    state:         string
    country:       string
  }
  status:          'COLLECTED' | 'TESTED' | 'IN_TRANSIT' | 'PROCESSING' | 'COMPLETED' | 'RECALLED'
  ledgerTxId:      string
}

/* ── 3. Laboratory Testing & Assays ── */
export interface QualityAssay {
  id:              string
  testName:        string
  method:          string
  resultValue:     string
  unit?:           string
  specification:   string
  status:          'PASS' | 'FAIL' | 'FLAGGED'
}

export interface QualityTestRecord {
  id:              string
  batchId:         string
  labOrgId:        string
  certificateNo:   string
  sampleReceived:  string
  reportIssued:    string
  withanolidesPct: number
  assays:          QualityAssay[]
  overallResult:   'PASSED' | 'FAILED'
  pdfHashSha256:   string
  ledgerTxId:      string
}

/* ── 4. Verifiable Documents & Certificates ── */
export interface VerifiableCertificate {
  certificateId:   string
  documentType:    'BOTANICAL_SOURCE' | 'LAB_COA' | 'PHYTOSANITARY' | 'GMP_AUDIT' | 'TRANSPORT_CUSTODY' | 'INSURANCE_POLICY'
  issuerOrgId:     string
  issuerName:      string
  issueDate:       string
  expiryDate?:     string
  documentHash:    string // SHA-256
  storageUrl:      string
  verificationMethod: 'REGISTRY_API' | 'DIGITAL_SIGNATURE' | 'MANUAL_AUDIT'
  isVerified:      boolean
  ledgerTxId:      string
}

/* ── 5. Transportation & Telemetry ── */
export interface IoTTelemetry {
  deviceId:        string
  timestamp:       string
  temperatureC:    number
  humidityPct:     number
  lat:             number
  lng:             number
  batteryPct:      number
  isSimulated:     boolean
}

export interface ShipmentCustodyRecord {
  shipmentId:      string
  batchId:         string
  transporterOrgId:string
  vehicleId:       string
  driverId:        string
  origin:          string
  destination:     string
  dispatchedAt:    string
  deliveredAt:     string
  routeCompliance: boolean
  tempCompliant:   boolean
  humidityCompliant: boolean
  telemetryLogs:   IoTTelemetry[]
  ledgerTxId:      string
}

/* ── 6. Smart Insurance ── */
export interface SmartInsurancePolicy {
  policyId:        string
  insurerOrgId:    string
  insuredBatchId:  string
  coverageAmountInr: number
  conditions: {
    maxTempC:      number
    minTempC:      number
    maxHumidityPct:number
    maxTransitHours: number
  }
  status:          'ACTIVE' | 'EXPIRED' | 'CLAIM_TRIGGERED' | 'NO_BREACH'
  claimWorkflow?: {
    claimId:       string
    triggeredAt:   string
    reason:        string
    payoutStatus:  'PENDING_EVALUATION' | 'APPROVED' | 'DISMISSED'
  }
}

/* ── 7. Manufacturing & Formulation ── */
export interface ManufacturingProcessingStep {
  stepNumber:      number
  name:            string
  equipmentId:     string
  startedAt:       string
  completedAt:     string
  parameters:      Record<string, string | number>
  operatorId:      string
  isCompleted:     boolean
}

export interface ProductBatchRecord {
  productBatchId:  string
  inputRawBatchIds:string[]
  mfgFacilityId:   string
  formulationId:   string
  totalUnitsProduced: number
  mfgDate:         string
  expiryDate:      string
  releasedByQaId:  string
  ledgerTxId:      string
}

/* ── 8. Product Serial & QR Security ── */
export interface ProductSerialRecord {
  serialNumber:    string // Unique pack identifier
  productBatchId:  string
  scratchCodeHash: string // SHA-256 of silver scratch-off code
  isScratchRedeemed: boolean
  qrResolvedUrl:   string
  firstScannedAt?: string
  totalScanCount:  number
  suspiciousScanCount: number
  status:          'ACTIVE' | 'RECALLED' | 'SUSPICIOUS_DUPLICATE'
}

/* ── 9. Recall & Safety Alerts ── */
export interface RecallAlert {
  recallId:        string
  affectedBatchId: string
  issuingAuthority:string
  severity:        'CRITICAL' | 'STANDARD'
  reason:          string
  recallDate:      string
  guidanceForConsumer: string
  hotlineContact:  string
}

/* ── 10. Customer Reviews (Scratch Code Gated) ── */
export interface VerifiedCustomerReview {
  reviewId:        string
  productSerial:   string
  rating:          number
  reviewText:      string
  submittedAt:     string
  isVerifiedPurchase: boolean
  ledgerAnchorHash?: string
}

/* ── 11. Immutable Ledger Audit Entry ── */
export interface LedgerAuditEntry {
  txId:            string
  blockNumber:     number
  channelName:     string
  eventPayloadHash:string
  recordedAt:      string
  signingEntity:   string
}
