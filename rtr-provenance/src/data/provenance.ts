/**
 * Root to Remedy — Himalaya Ashwagandha Pure Herbs, 60 Tablets
 * Customer Provenance Record · Batch HIM-ASH-2026-0614
 *
 * PROTOTYPE DISCLAIMER
 * ─────────────────────
 * All document references (certificate IDs, blockchain hashes, GPS coordinates,
 * test values, permit numbers, vehicle IDs) are SIMULATED for demonstration
 * purposes. They are marked with _proto: true throughout.
 *
 * This file is structured to match what a production backend would return,
 * so that replacing it with real API responses requires no component changes —
 * only this data source needs to be swapped.
 *
 * Data shape: see src/types/provenance.ts
 */

import type { ProvenanceProduct } from '../types/provenance'

/* ──────────────────────────────────────────────────────────────────────────
   PRODUCT MASTER
────────────────────────────────────────────────────────────────────────── */
export const PRODUCT: ProvenanceProduct = {
  productName:       'Himalaya Ashwagandha Pure Herbs',
  brand:             'Himalaya',
  category:          'Herbal Supplement',
  skuCode:           'HIM-ASH-PH-60T',
  batchCode:         'HIM-ASH-2026-0614',
  packSerial:        'HIM-8F42-0614-A3',
  tabletCount:       60,
  netWeight:         '30 g',
  manufacturedDate:  'August 2026',
  expiryDate:        'July 2028',
  status:            'PRODUCT VERIFIED',
  traceabilityLabel: '5 / 5 STAGES VERIFIED · 100% TRACEABLE',
  scratchCode:       'RTR-8472',

  /* Legacy aliases for backward-compat with VerificationHeader & BottomActionBar */
  batch:             'HIM-ASH-2026-0614',
  name:              'Himalaya Ashwagandha Pure Herbs',

  /* ────────────────────────────────────────────────────────────────────────
     PROVENANCE STAGES
  ──────────────────────────────────────────────────────────────────────── */
  stages: [

    /* ══════════════════════════════════════════════════════════════════════
       STAGE 1 — FARMER / COLLECTION
       Who:  Prakruthi Agro Cooperative Society
       What: Collection of Ashwagandha roots from registered tribal farmers
       Where: Mandsaur District, Madhya Pradesh
    ══════════════════════════════════════════════════════════════════════ */
    {
      id:           'farmer',
      number:       1,
      type:         'farmer',
      title:        'Farmer / Collection',
      subtitle:     'PROOF OF ORIGIN',
      purposeLabel: 'Origin Verified',
      status:       'verified',
      color:        '#7ec85a',
      glowColor:    'rgba(126,200,90,0.6)',
      nodePosition: 'up',
      tPosition:    0.10,
      data: {
        type:              'farmer',
        stageId:           'STG-01-FARM',
        eventId:           'EVT-KOOP-2026-0614-F',
        date:              '12 August 2026',
        entity:            'Prakruthi Agro Cooperative Society',
        entityType:        'Registered Farmer Cooperative',
        description:       'Ashwagandha roots are harvested by 34 registered tribal farmers affiliated with Prakruthi Agro Cooperative Society in Mandsaur, Madhya Pradesh — one of India\'s primary ashwagandha belts. Roots are collected in the post-monsoon dry season (Oct–Feb) when withanolide content peaks. Each farmer\'s parcel is individually weighed and GPS-tagged before aggregation at the cooperative hub. Only roots meeting size, moisture, and visual quality standards are accepted.',
        collectionHub:     'Prakruthi Agro Cooperative Hub, Mandsaur',
        species:           'Ashwagandha',
        botanicalName:     'Withania somnifera (L.) Dunal',
        partUsed:          'Root (dried)',
        cultivationType:   'Semi-wild / Traditional rainfed cultivation',
        harvestSeason:     'Post-monsoon · Oct 2025 – Feb 2026',
        totalCollection:   '820 kg (dry root)',
        farmerCount:       34,
        farmerCooperative: 'Prakruthi Agro Cooperative Society · Reg. No. MP/COOP/2019/1187',
        batchId:           'MAND-ASH-2026-0614',
        soilHealthStatus:  'pH 7.2 · Loamy black soil · No synthetic pesticide history',
        collectorLicense:  'MP-AYUSH-COL/2026/4472 · Valid through 31 Mar 2027',
        location: {
          lat:     24.0765,
          lng:     75.0696,
          label:   'Collection Hub',
          city:    'Mandsaur',
          state:   'Madhya Pradesh',
          country: 'India',
        },
        documents: [
          { label: 'Cooperative Registration Certificate',    ref: 'MP/COOP/2019/1187',          _proto: true },
          { label: 'Collector Licence',                       ref: 'MP-AYUSH-COL/2026/4472',      _proto: true },
          { label: 'Farmer Eligibility Register (34 names)', ref: 'PACS-FARM-REG-2026.pdf',       _proto: true },
          { label: 'GPS Zone Approval — Mandsaur District',  ref: 'MP-GPS-ZONE/2026/MAN-04',     _proto: true },
          { label: 'Collection Batch Receipt',                ref: 'MAND-ASH-2026-0614-REC.pdf',  _proto: true },
        ],
        blockchain: {
          txHash:    '0x3a8f…d71b04',
          blockNum:  '6241088',
          timestamp: '12 Aug 2026, 06:42 PM IST',
          network:   'Hyperledger Fabric (Permissioned)',
          _proto:    true,
        },
        checks: [
          { label: 'Cooperative registration active',           detail: 'MP/COOP/2019/1187 · valid',                  status: 'pass' },
          { label: 'GPS zone approved (Mandsaur District)',     detail: 'MP-GPS-ZONE/2026/MAN-04 · Zone 4B',          status: 'pass' },
          { label: 'Harvest season compliant',                  detail: 'Oct 2025 – Feb 2026 window',                  status: 'pass' },
          { label: 'Species identity pre-confirmed at hub',     detail: 'Withania somnifera · visual + olfactory ID',  status: 'pass' },
          { label: 'All 34 farmers registered & eligible',      detail: '34 / 34 verified',                            status: 'pass' },
          { label: 'Batch receipt issued',                      detail: '820 kg · MAND-ASH-2026-0614',                 status: 'pass' },
        ],
      },
    },

    /* ══════════════════════════════════════════════════════════════════════
       STAGE 2 — LABORATORY TESTING
       Who:  Agilus Diagnostics & Research Ltd. (NABL Accredited)
       What: Multi-parameter quality & identity testing on raw material
       Where: Pune, Maharashtra
    ══════════════════════════════════════════════════════════════════════ */
    {
      id:           'lab',
      number:       2,
      type:         'lab',
      title:        'Laboratory Testing',
      subtitle:     'PROOF OF QUALITY',
      purposeLabel: 'Quality Verified',
      status:       'verified',
      color:        '#4ea8d2',
      glowColor:    'rgba(78,168,210,0.6)',
      nodePosition: 'down',
      tPosition:    0.28,
      data: {
        type:               'lab',
        stageId:            'STG-02-LAB',
        eventId:            'EVT-LAB-2026-0614-Q',
        date:               '18 August 2026',
        entity:             'Agilus Diagnostics & Research Ltd.',
        entityType:         'Third-Party Analytical Laboratory',
        description:        'A representative sample from batch MAND-ASH-2026-0614 was dispatched under chain-of-custody seal to Agilus Diagnostics & Research Ltd., a NABL-accredited laboratory in Pune. Testing covered species authentication via ITS2 DNA barcoding, quantification of the primary active marker (withanolide glycosides), and a full safety screen including heavy metals, pesticide residue, and microbial limits — as required by WHO guidelines for herbal medicines and Ayurveda pharmacopoeia standards.',
        labName:            'Agilus Diagnostics & Research Ltd.',
        accreditation:      'NABL Accredited · Cert. No. TC-7741 · Valid 2027',
        sampleId:           'AGI-ASH-2026-0614',
        testDate:           '18–20 August 2026',
        certificateId:      'NABL/2026/AY/01143',
        withanolideContent: '≥ 2.5% (w/w) — Meets Himalaya internal specification',
        location: {
          lat:     18.5204,
          lng:     73.8567,
          label:   'Testing Laboratory',
          city:    'Pune',
          state:   'Maharashtra',
          country: 'India',
        },
        results: [
          { label: 'Species Identification',       value: 'Withania somnifera',  status: 'pass', detail: 'DNA Barcoding ITS2 · 99.1% sequence match · NCBI KC172458' },
          { label: 'Withanolide Glycosides',       value: '2.72%',  unit: '% w/w',   limit: '≥ 2.5%',   status: 'pass', detail: 'HPLC analysis · Himalaya spec: ≥ 2.5%' },
          { label: 'Moisture Content',             value: '7.8%',   unit: '%',        limit: '≤ 10%',    status: 'pass', detail: 'Loss on drying method' },
          { label: 'Total Ash',                    value: '4.3%',   unit: '%',        limit: '≤ 7%',     status: 'pass', detail: 'IP standard' },
          { label: 'Pesticide Residue (total)',    value: '< 0.01', unit: 'ppm',      limit: '≤ 0.05',   status: 'pass', detail: 'GC-MS/MS multiclass screen' },
          { label: 'Lead (Pb)',                    value: '0.31',   unit: 'ppm',      limit: '≤ 10 ppm', status: 'pass', detail: 'ICP-OES · WHO GACP limit' },
          { label: 'Arsenic (As)',                 value: '0.09',   unit: 'ppm',      limit: '≤ 3 ppm',  status: 'pass', detail: 'ICP-OES · WHO GACP limit' },
          { label: 'Microbial Load (TPC)',         value: '< 1 × 10³', unit: 'CFU/g', limit: '≤ 10⁵',   status: 'pass', detail: 'Pour plate method' },
          { label: 'Aflatoxins (B1+B2+G1+G2)',    value: '< 1.0',  unit: 'μg/kg',   limit: '≤ 10',     status: 'pass', detail: 'HPLC-FLD method' },
        ],
        documents: [
          { label: 'NABL Certificate of Accreditation',   ref: 'TC-7741',                    _proto: true },
          { label: 'Certificate of Analysis',             ref: 'NABL/2026/AY/01143',         _proto: true },
          { label: 'DNA Barcoding Report',                ref: 'AGI-DNA-2026-0614.pdf',       _proto: true },
          { label: 'Heavy Metals ICP-OES Report',         ref: 'AGI-HM-2026-0614.pdf',       _proto: true },
          { label: 'Pesticide GC-MS Screen Report',       ref: 'AGI-PES-2026-0614.pdf',      _proto: true },
          { label: 'Chain-of-Custody Transfer Record',    ref: 'AGI-COC-2026-0614.pdf',      _proto: true },
        ],
        blockchain: {
          txHash:    '0x9c2d…a41f77',
          blockNum:  '6241529',
          timestamp: '20 Aug 2026, 04:18 PM IST',
          network:   'Hyperledger Fabric (Permissioned)',
          _proto:    true,
        },
        checks: [
          { label: 'NABL accreditation active',               detail: 'TC-7741 · valid through 2027',          status: 'pass' },
          { label: 'Species confirmed by ITS2 DNA barcoding', detail: '99.1% · NCBI KC172458',                 status: 'pass' },
          { label: 'Withanolide content meets specification',  detail: '2.72% ≥ 2.5% spec',                    status: 'pass' },
          { label: 'All heavy metals within WHO/GACP limits', detail: 'Pb 0.31 · As 0.09 (ppm)',              status: 'pass' },
          { label: 'Pesticide residue below detection limit',  detail: '< 0.01 ppm (all analytes)',             status: 'pass' },
          { label: 'Microbial limits compliant',               detail: 'TPC < 1×10³ CFU/g',                    status: 'pass' },
          { label: 'Certificate anchored to batch',            detail: 'NABL/2026/AY/01143 → MAND-ASH-2026-0614', status: 'pass' },
        ],
      },
    },

    /* ══════════════════════════════════════════════════════════════════════
       STAGE 3 — TRANSPORTATION (Raw material to plant)
       Who:  SafeMove Cold Cargo Pvt. Ltd.
       What: Temperature-monitored road freight from Mandsaur to Baddi (HP)
       Where: Mandsaur → Baddi
    ══════════════════════════════════════════════════════════════════════ */
    {
      id:           'transport',
      number:       3,
      type:         'transport',
      title:        'Transportation',
      subtitle:     'PROOF OF CUSTODY',
      purposeLabel: 'Custody Verified',
      status:       'verified',
      color:        '#8b6cd4',
      glowColor:    'rgba(139,108,212,0.6)',
      nodePosition: 'up',
      tPosition:    0.48,
      data: {
        type:             'transport',
        stageId:          'STG-03-TRANS',
        eventId:          'EVT-TRN-2026-0614-M',
        date:             '22–23 August 2026',
        entity:           'SafeMove Cold Cargo Pvt. Ltd.',
        entityType:       'Licensed Pharma Logistics Carrier',
        description:      'Approved quantity of tested raw material (820 kg, batch MAND-ASH-2026-0614) was handed over to SafeMove Cold Cargo under a signed chain-of-custody document. The vehicle was sealed with a numbered tamper-evident seal. IoT data loggers recorded temperature and humidity every 15 minutes throughout the 780 km journey from Mandsaur, MP to the Himalaya manufacturing facility in Baddi, HP. No deviations from the approved storage condition (15–30°C, RH ≤ 65%) were recorded. Delivery was acknowledged at Baddi on 23 August 2026.',
        carrier:          'SafeMove Cold Cargo Pvt. Ltd.',
        vehicleId:        'MP-09-GF-4422',
        pickupDate:       '22 August 2026, 07:30 AM',
        deliveryDate:     '23 August 2026, 02:15 PM',
        origin:           'Prakruthi Agro Hub, Mandsaur, MP',
        destination:      'Himalaya Drug Company Plant, Baddi, HP',
        distanceKm:       780,
        storageCondition: '15–30°C · RH ≤ 65% · Pharma-grade van',
        location: {
          lat:     30.9526,
          lng:     76.7909,
          label:   'Delivery — Himalaya Plant, Baddi',
          city:    'Baddi',
          state:   'Himachal Pradesh',
          country: 'India',
        },
        metrics: [
          { label: 'Avg. Temperature',     value: '21.4°C · Within limit',        status: 'pass' },
          { label: 'Max Temperature',      value: '26.8°C · Below 30°C limit',    status: 'pass' },
          { label: 'Avg. Humidity (RH)',   value: '58% · Within limit',           status: 'pass' },
          { label: 'GPS Route Integrity',  value: 'No deviations · Verified',     status: 'pass' },
          { label: 'Tamper-Evident Seal',  value: 'TES-0614-448 · Intact',        status: 'pass' },
          { label: 'Transit Duration',     value: '30 h 45 min · As planned',     status: 'pass' },
          { label: 'Delivery Receipt',     value: '23 Aug 2026 · Signed ✓',       status: 'pass' },
        ],
        documents: [
          { label: 'Chain-of-Custody Transfer Document', ref: 'COC-TRN-2026-0614.pdf',       _proto: true },
          { label: 'IoT Temperature Log (15-min)',       ref: 'IOTLOG-TRN-0614-FULL.csv',    _proto: true },
          { label: 'GPS Route Report',                   ref: 'GPS-TRN-0614-ROUTE.pdf',      _proto: true },
          { label: 'Tamper-Seal Verification Photo',    ref: 'SEAL-TRN-0614-TES448.jpg',    _proto: true },
          { label: 'Delivery Receipt — Baddi Plant',    ref: 'DELREC-0614-BADDI.pdf',        _proto: true },
        ],
        blockchain: {
          txHash:    '0xb7e1…3c90a2',
          blockNum:  '6241984',
          timestamp: '23 Aug 2026, 02:22 PM IST',
          network:   'Hyperledger Fabric (Permissioned)',
          _proto:    true,
        },
        checks: [
          { label: 'Custody transfer document signed',       detail: 'COC-TRN-2026-0614',                status: 'pass' },
          { label: 'Temperature within limits throughout',   detail: 'Max 26.8°C · Limit 30°C',         status: 'pass' },
          { label: 'Humidity within limits throughout',      detail: 'Max 62% RH · Limit 65%',          status: 'pass' },
          { label: 'No GPS route deviations recorded',       detail: '780 km · 0 deviations',           status: 'pass' },
          { label: 'Tamper-evident seal intact at delivery', detail: 'TES-0614-448 · verified',         status: 'pass' },
          { label: 'Delivery confirmed at Baddi plant',      detail: '23 Aug 2026, 02:15 PM',           status: 'pass' },
        ],
      },
    },

    /* ══════════════════════════════════════════════════════════════════════
       STAGE 4 — MANUFACTURING
       Who:  Himalaya Drug Company — Baddi Plant
       What: GMP tablet manufacturing (drying → milling → granulation → compression → coating → packaging)
       Where: Baddi, Himachal Pradesh
    ══════════════════════════════════════════════════════════════════════ */
    {
      id:           'manufacturing',
      number:       4,
      type:         'manufacturing',
      title:        'Manufacturing',
      subtitle:     'PROOF OF PROCESSING',
      purposeLabel: 'Processing Verified',
      status:       'verified',
      color:        '#c8922e',
      glowColor:    'rgba(200,146,46,0.6)',
      nodePosition: 'down',
      tPosition:    0.68,
      data: {
        type:            'manufacturing',
        stageId:         'STG-04-MFG',
        eventId:         'EVT-MFG-2026-0614-P',
        date:            '24–26 August 2026',
        entity:          'Himalaya Drug Company Pvt. Ltd.',
        entityType:      'Licensed Ayurvedic Drug Manufacturer',
        description:     'The released raw material (820 kg, batch MAND-ASH-2026-0614) was processed at the Himalaya Drug Company\'s WHO-GMP–certified Baddi plant in Himachal Pradesh. Processing follows a validated manufacturing process: secondary drying, fine milling, wet granulation, tablet compression, film-coating, and blister/bottle packaging. Yield and in-process checks (tablet weight, hardness, disintegration) are recorded at every step. The output — batch HIM-ASH-2026-0614, 60-tablet bottles — was released by the Quality Control department after passing all finished-product specifications.',
        manufacturer:    'Himalaya Drug Company Pvt. Ltd.',
        facilityLicense: 'AY/MFG/HP/2026/0321 · Valid through 31 Dec 2027',
        gmpCertificate:  'WHO-GMP · Cert. No. HP-WHO-GMP/2025/047',
        inputBatch:      'MAND-ASH-2026-0614',
        outputBatch:     'HIM-ASH-2026-0614',
        tabletCount:     60,
        dosagePerUnit:   '300 mg Ashwagandha root extract equivalent',
        excipients:      ['Microcrystalline Cellulose', 'Croscarmellose Sodium', 'Magnesium Stearate', 'HPMC film coat'],
        location: {
          lat:     30.9526,
          lng:     76.7909,
          label:   'Manufacturing Plant',
          city:    'Baddi',
          state:   'Himachal Pradesh',
          country: 'India',
        },
        steps: [
          { step: 1, name: 'Raw Material Intake & Quarantine', detail: 'Received 820 kg · CoA verified · Placed in quarantine pending QC release', input: '820 kg', status: 'pass' },
          { step: 2, name: 'Secondary Drying',                 detail: 'Tray dryer · 55°C · 4 h · Final moisture 6.1%', input: '820 kg', output: '798 kg', status: 'pass' },
          { step: 3, name: 'Fine Milling',                     detail: 'Hammer mill · 80-mesh sieve · Particle uniformity achieved', input: '798 kg', output: '791 kg', status: 'pass' },
          { step: 4, name: 'Granulation & Blending',           detail: 'Wet granulation · FBD drying · Blend uniformity: CV < 2%', input: '791 kg', output: '788 kg', status: 'pass' },
          { step: 5, name: 'Tablet Compression',               detail: '300 mg target weight · Hardness 6–9 kP · Disintegration < 15 min', input: '788 kg', output: '2.627 M tablets', status: 'pass' },
          { step: 6, name: 'Film Coating',                     detail: 'HPMC aqueous coat · Weight gain 2–3% · Appearance uniform', status: 'pass' },
          { step: 7, name: 'QC Release & Packaging',           detail: '60-tab HDPE bottles · Lot-coded · HIM-ASH-2026-0614 released', output: '43,783 bottles', status: 'pass' },
        ],
        documents: [
          { label: 'Manufacturing Licence',              ref: 'AY/MFG/HP/2026/0321',              _proto: true },
          { label: 'WHO-GMP Certificate',                ref: 'HP-WHO-GMP/2025/047',              _proto: true },
          { label: 'Batch Manufacturing Record',         ref: 'BMR-HIM-ASH-2026-0614.pdf',        _proto: true },
          { label: 'In-Process Test Records',            ref: 'IPT-HIM-ASH-2026-0614.pdf',        _proto: true },
          { label: 'QC Release Order',                   ref: 'QCR-HIM-ASH-2026-0614.pdf',        _proto: true },
          { label: 'Finished Product CoA',               ref: 'FPCOA-HIM-ASH-2026-0614.pdf',     _proto: true },
        ],
        blockchain: {
          txHash:    '0xf3a9…82b61c',
          blockNum:  '6242771',
          timestamp: '26 Aug 2026, 05:44 PM IST',
          network:   'Hyperledger Fabric (Permissioned)',
          _proto:    true,
        },
        checks: [
          { label: 'Manufacturing licence active',         detail: 'AY/MFG/HP/2026/0321',              status: 'pass' },
          { label: 'WHO-GMP certification current',        detail: 'HP-WHO-GMP/2025/047',              status: 'pass' },
          { label: 'Input traced from raw material batch', detail: 'MAND-ASH-2026-0614 → HIM-ASH-2026-0614', status: 'pass' },
          { label: 'All 7 manufacturing steps recorded',   detail: '7 / 7 steps · BMR signed',          status: 'pass' },
          { label: 'In-process tests passed',              detail: 'Weight · hardness · disintegration', status: 'pass' },
          { label: 'QC release order issued',              detail: 'QCR-HIM-ASH-2026-0614',              status: 'pass' },
          { label: 'Yield within validated range',         detail: '43,783 bottles · 96.1% yield',       status: 'pass' },
        ],
      },
    },

    /* ══════════════════════════════════════════════════════════════════════
       STAGE 5 — FINAL PRODUCT / PACKAGING
       Who:  Himalaya Drug Company (QC verified pack)
       What: This specific bottle — authenticated by QR scan
       Where: Your hands (consumer)
    ══════════════════════════════════════════════════════════════════════ */
    {
      id:           'product',
      number:       5,
      type:         'product',
      title:        'Final Product',
      subtitle:     'PROOF OF AUTHENTICITY',
      purposeLabel: 'Product Verified',
      status:       'verified',
      color:        '#7ec85a',
      glowColor:    'rgba(126,200,90,0.6)',
      nodePosition: 'up',
      tPosition:    0.88,
      data: {
        type:         'product',
        stageId:      'STG-05-PROD',
        eventId:      'EVT-PROD-2026-0614-A',
        date:         '26 August 2026',
        entity:       'Himalaya Drug Company Pvt. Ltd.',
        entityType:   'Brand Owner / Manufacturer',
        description:  'This bottle of Himalaya Ashwagandha Pure Herbs (60 tablets, Batch HIM-ASH-2026-0614) has been uniquely serialised and linked to its complete provenance chain. The QR code printed on this bottle resolves exclusively to this record. The pack serial number is immutably recorded — it cannot be reused, duplicated, or forged. All 5 provenance stages have been individually verified and anchored to a permissioned ledger. This product is 100% traceable from root to tablet.',
        productName:  'Himalaya Ashwagandha Pure Herbs',
        brand:        'Himalaya',
        skuCode:      'HIM-ASH-PH-60T',
        batchCode:    'HIM-ASH-2026-0614',
        packSerial:   'HIM-8F42-0614-A3',
        tabletCount:  60,
        netWeight:    '30 g',
        manufactured: 'August 2026',
        expiry:       'July 2028',
        qrLinkedTo:   'HIM-8F42-0614-A3',
        location: {
          lat:     30.9526,
          lng:     76.7909,
          label:   'Packaged — Baddi Plant',
          city:    'Baddi',
          state:   'Himachal Pradesh',
          country: 'India',
        },
        chainSummary: [
          { stage: 'Farmer / Collection',    eventId: 'EVT-KOOP-2026-0614-F', status: 'pass' },
          { stage: 'Laboratory Testing',     eventId: 'EVT-LAB-2026-0614-Q',  status: 'pass' },
          { stage: 'Transportation',         eventId: 'EVT-TRN-2026-0614-M',  status: 'pass' },
          { stage: 'Manufacturing',          eventId: 'EVT-MFG-2026-0614-P',  status: 'pass' },
          { stage: 'Final Product',          eventId: 'EVT-PROD-2026-0614-A', status: 'pass' },
        ],
        documents: [
          { label: 'Finished Product Certificate of Analysis', ref: 'FPCOA-HIM-ASH-2026-0614.pdf', _proto: true },
          { label: 'Pack Serialisation Record',                ref: 'SER-HIM-8F42-0614-A3.pdf',    _proto: true },
          { label: 'QR Issuance Log',                          ref: 'QRLOG-2026-0614.csv',          _proto: true },
        ],
        blockchain: {
          txHash:    '0xc5f8…09e34b',
          blockNum:  '6243102',
          timestamp: '26 Aug 2026, 08:31 PM IST',
          network:   'Hyperledger Fabric (Permissioned)',
          _proto:    true,
        },
        checks: [
          { label: 'Pack serial uniquely registered',          detail: 'HIM-8F42-0614-A3 · 1-of-1',           status: 'pass' },
          { label: 'QR code resolves to this provenance record', detail: 'Scan verified at lookup',             status: 'pass' },
          { label: 'Batch fully traceable to raw material',    detail: 'MAND-ASH-2026-0614 → HIM-ASH-2026-0614', status: 'pass' },
          { label: '5 of 5 stages verified',                   detail: 'All events anchored to ledger',         status: 'pass' },
          { label: 'Product within expiry window',             detail: 'Expires Jul 2028',                       status: 'pass' },
        ],
      },
    },

  ], // end stages
}
