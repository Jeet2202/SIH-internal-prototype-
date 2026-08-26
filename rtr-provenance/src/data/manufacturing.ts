/**
 * PRAMANA — Stage 4: MANUFACTURING
 * Completed manufacturing record for input batch ASH-2026-004 → PRD-ASH-2026-0447
 *
 * PROTOTYPE DISCLAIMER
 * ─────────────────────
 * All IDs, certificate numbers, measurements, blockchain hashes, and document
 * references are SIMULATED for demonstration purposes only.
 * Fields with _proto: true must be replaced by real API data in production.
 *
 * "Himalaya Roots Formulations" is a fictional entity used for this prototype.
 * It does not represent any real company named Himalaya.
 *
 * Lineage: ASH-2026-004 ─► MFG-ASH-2026-004 ─► PRD-ASH-2026-0447 ─► HIM-8F42-0614-A3
 */

import type { ManufacturingRecord } from '../types/manufacturing'

export const MANUFACTURING_RECORD: ManufacturingRecord = {
  stageNumber: 4,
  stage:       'MANUFACTURING',
  title:       'Manufacturing',
  status:      'Verified',

  /* ── Manufacturer / facility ─────────────────────────────────── */
  manufacturer: {
    id:             'M-01',
    name:           'Himalaya Roots Formulations',
    location:       'Nashik, Maharashtra, India',
    licenceId:      'AY/MFG/MH/2026/0109',
    licenceExpiry:  '31 Dec 2027',
    gmpCertificate: 'WHO-GMP · Cert. No. MH-WHO-GMP/2025/031',
    facilityType:   'Licensed Ayurvedic Drug Manufacturer',
  },

  /* ── Input botanical batch ───────────────────────────────────── */
  inputBatch: {
    batchId:          'ASH-2026-004',
    species:          'Ashwagandha',
    botanicalName:    'Withania somnifera (L.) Dunal',
    plantPart:        'Root (dried)',
    materialType:     'Verified botanical raw material',
    quantityKg:       780,
    acceptanceStatus: 'Accepted for processing',
    sourceStage:      'Transportation',
  },

  /* ── Manufacturing event ─────────────────────────────────────── */
  manufacturing: {
    manufacturingId: 'MFG-ASH-2026-004',
    acceptedAt:      '20 Aug 2026, 09:00 AM IST',
    completedAt:     '24 Aug 2026, 04:30 PM IST',
    batchMfgRecord:  'BMR-MFG-ASH-2026-004',
    status:          'Completed',
  },

  /* ── Processing steps ────────────────────────────────────────── */
  processingSteps: [
    {
      step:        1,
      name:        'Raw Material Reception',
      detail:      'Botanical batch ASH-2026-004 received at facility M-01. Certificate of Analysis verified. Material placed in quarantine pending QC release.',
      inputQty:    '780 kg',
      outputQty:   '780 kg',
      temperature: undefined,
      humidity:    undefined,
      duration:    '4 h (quarantine)',
      anomaly:     false,
      status:      'pass',
    },
    {
      step:        2,
      name:        'Drying',
      detail:      'Secondary drying in tray dryer to reduce residual moisture to specification. Final moisture content within validated limit.',
      inputQty:    '780 kg',
      outputQty:   '756 kg',
      temperature: '55 °C',
      humidity:    undefined,
      duration:    '4 h',
      anomaly:     false,
      status:      'pass',
    },
    {
      step:        3,
      name:        'Grinding / Milling',
      detail:      'Hammer mill processing through 80-mesh sieve. Particle size uniformity achieved within validated specification.',
      inputQty:    '756 kg',
      outputQty:   '749 kg',
      temperature: undefined,
      humidity:    undefined,
      duration:    '3 h',
      anomaly:     false,
      status:      'pass',
    },
    {
      step:        4,
      name:        'Storage (Pre-formulation)',
      detail:      'Milled material stored in controlled conditions pending formulation. Temperature and humidity monitored continuously.',
      inputQty:    '749 kg',
      outputQty:   '749 kg',
      temperature: '22 °C',
      humidity:    '45 %',
      duration:    '18 h',
      anomaly:     false,
      status:      'pass',
    },
    {
      step:        5,
      name:        'Formulation',
      detail:      'Granulation, blending with excipients, tablet compression, and film coating. Blend uniformity CV < 2%. Tablet weight, hardness, and disintegration checked in-process.',
      inputQty:    '749 kg',
      outputQty:   '2.49 M tablets',
      temperature: undefined,
      humidity:    undefined,
      duration:    '28 h',
      anomaly:     false,
      status:      'pass',
    },
    {
      step:        6,
      name:        'Packaging',
      detail:      'HDPE bottles (60-tablet packs) filled, capped, labelled, and lot-coded. Product batch PRD-ASH-2026-0447 assigned. QR serial HIM-8F42-0614-A3 issued.',
      inputQty:    '2.49 M tablets',
      outputQty:   '41,500 bottles',
      temperature: undefined,
      humidity:    undefined,
      duration:    '8 h',
      anomaly:     false,
      status:      'pass',
    },
    {
      step:        7,
      name:        'Quality Release',
      detail:      'All finished-product specifications met. QC release order QCR-PRD-ASH-2026-0447 issued by quality department. Batch cleared for distribution.',
      inputQty:    undefined,
      outputQty:   '41,500 bottles released',
      temperature: undefined,
      humidity:    undefined,
      duration:    '6 h',
      anomaly:     false,
      status:      'pass',
    },
  ],

  /* ── Formulation ─────────────────────────────────────────────── */
  formulation: {
    formulationId:  'FORM-ASH-2026-0447',
    inputBatches:   ['ASH-2026-004'],
    productBatchId: 'PRD-ASH-2026-0447',
    productName:    'Ashwagandha Pure Herbs',
    dosageForm:     'Film-coated tablet',
    dosagePerUnit:  '300 mg Ashwagandha root extract equivalent',
    tabletCount:    60,
    composition: [
      { ingredient: 'Ashwagandha Root Extract (Withania somnifera)', amount: '300 mg', sourceBatch: 'ASH-2026-004' },
      { ingredient: 'Microcrystalline Cellulose',                   amount: 'q.s.',   sourceBatch: 'EXCIP-MCC-2026' },
      { ingredient: 'Croscarmellose Sodium',                        amount: 'q.s.',   sourceBatch: 'EXCIP-CCS-2026' },
      { ingredient: 'Magnesium Stearate',                           amount: 'q.s.',   sourceBatch: 'EXCIP-MGS-2026' },
      { ingredient: 'HPMC Film Coat',                               amount: '2–3% wg',sourceBatch: 'EXCIP-HPMC-2026' },
    ],
  },

  /* ── Packaging ───────────────────────────────────────────────── */
  packaging: {
    productBatchId:    'PRD-ASH-2026-0447',
    sku:               'HIM-ASH-PH-60T',
    packSize:          '60 tablets / HDPE bottle',
    packagingMaterial: 'HDPE bottle · aluminium foil seal · printed label',
    bottleCount:       41500,
    manufactureDate:   '24 Aug 2026',
    expiryDate:        'Jul 2028',
    packagingStatus:   'Completed',
  },

  /* ── QR / serialisation ──────────────────────────────────────── */
  qrLink: {
    productBatchId: 'PRD-ASH-2026-0447',
    packSerial:     'HIM-8F42-0614-A3',
    qrStatus:       'Issued',
    qrEvent:        'EVT-QR-2026-0447-A',
  },

  /* ── Quality release ─────────────────────────────────────────── */
  qualityRelease: {
    releaseRecord: 'QCR-PRD-ASH-2026-0447',
    releaseDate:   '24 Aug 2026, 04:30 PM IST',
    releasedBy:    'Quality Control Department — M-01',
    status:        'Released',
  },

  /* ── Documents (only mark attached: true if actually present) ── */
  documents: [
    { label: 'Batch Manufacturing Record',  ref: 'BMR-MFG-ASH-2026-004.pdf',     attached: false, _proto: true },
    { label: 'Formulation Record',          ref: 'FORM-ASH-2026-0447.pdf',        attached: false, _proto: true },
    { label: 'In-Process Test Records',     ref: 'IPT-MFG-ASH-2026-004.pdf',      attached: false, _proto: true },
    { label: 'QC Release Order',            ref: 'QCR-PRD-ASH-2026-0447.pdf',     attached: false, _proto: true },
    { label: 'Finished Product CoA',        ref: 'FPCOA-PRD-ASH-2026-0447.pdf',   attached: false, _proto: true },
    { label: 'Manufacturing Licence',       ref: 'AY/MFG/MH/2026/0109',           attached: false, _proto: true },
  ],

  /* ── Verification checks ─────────────────────────────────────── */
  checks: [
    { label: 'Manufacturing licence active',          detail: 'AY/MFG/MH/2026/0109 · Valid to 31 Dec 2027',  status: 'pass' },
    { label: 'WHO-GMP certification current',         detail: 'MH-WHO-GMP/2025/031',                          status: 'pass' },
    { label: 'Input batch traced from raw material',  detail: 'ASH-2026-004 → PRD-ASH-2026-0447',             status: 'pass' },
    { label: 'All 7 processing steps recorded',       detail: '7 / 7 steps · BMR signed',                     status: 'pass' },
    { label: 'In-process tests passed',               detail: 'Weight · hardness · disintegration',            status: 'pass' },
    { label: 'QC release order issued',               detail: 'QCR-PRD-ASH-2026-0447',                         status: 'pass' },
    { label: 'Product batch created and serialised',  detail: 'PRD-ASH-2026-0447 · 41,500 bottles',            status: 'pass' },
    { label: 'QR issued to product batch',            detail: 'HIM-8F42-0614-A3 · EVT-QR-2026-0447-A',        status: 'pass' },
  ],

  /* ── Ledger record ───────────────────────────────────────────── */
  ledger: {
    transactionId: '0xf3a9…82b61c',
    blockNumber:   '6242771',
    timestamp:     '24 Aug 2026, 04:45 PM IST',
    network:       'Hyperledger Fabric (Permissioned)',
    _proto:        true,
  },
}
