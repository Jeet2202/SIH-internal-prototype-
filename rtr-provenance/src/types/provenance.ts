// All provenance types for the Root to Remedy customer experience

export type StageStatus = 'verified' | 'pending' | 'failed';

export type StageType = 'farmer' | 'lab' | 'manufacturing' | 'transport' | 'product';

export interface VerificationCheck {
  label: string;
  detail?: string;
  status: 'pass' | 'fail' | 'warning';
}

export interface FarmerStageData {
  type: 'farmer';
  collectionHub: string;
  location: string;
  species: string;
  botanicalName: string;
  collectionDate: string;
  batchId: string;
  farmerCount: number;
  totalCollection: string;
  checks: VerificationCheck[];
}

export interface LabStageData {
  type: 'lab';
  labName: string;
  accreditation: string;
  sampleId: string;
  testDate: string;
  results: { label: string; value: string; status: 'pass' | 'warning'; detail?: string }[];
  certificateId: string;
  checks: VerificationCheck[];
}

export interface ManufacturingStageData {
  type: 'manufacturing';
  manufacturer: string;
  inputBatch: string;
  outputBatch: string;
  steps: { name: string; detail: string; input?: string; output?: string; status: 'pass' }[];
  checks: VerificationCheck[];
}

export interface TransportStageData {
  type: 'transport';
  partner: string;
  pickupDate: string;
  destination: string;
  metrics: { label: string; value: string; status: 'pass' | 'warning' }[];
  checks: VerificationCheck[];
}

export interface ProductStageData {
  type: 'product';
  productName: string;
  brand: string;
  batch: string;
  manufactured: string;
  expiry: string;
  packSerial: string;
  chainSummary: { label: string; status: 'pass' }[];
  checks: VerificationCheck[];
}

export type StageData =
  | FarmerStageData
  | LabStageData
  | ManufacturingStageData
  | TransportStageData
  | ProductStageData;

export interface ProvenanceStage {
  id: string;
  number: number;
  type: StageType;
  title: string;
  subtitle: string;
  purposeLabel: string;
  status: StageStatus;
  color: string;            // hex
  glowColor: string;        // rgba
  nodePosition: 'up' | 'down';
  tPosition: number;        // 0–1 along DNA axis
  data: StageData;
}

export interface ProvenanceProduct {
  name: string;
  brand: string;
  batch: string;
  packSerial: string;
  status: 'PRODUCT VERIFIED';
  traceabilityLabel: string;
  stages: ProvenanceStage[];
  scratchCode: string;
}
