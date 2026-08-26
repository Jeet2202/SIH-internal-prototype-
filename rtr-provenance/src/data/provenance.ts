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
       Who:  Mahesh Patil — Nashik Herbal Growers Cooperative
       What: Collection of Ashwagandha roots, cultivated crop
       Where: Nashik, Maharashtra

       PROTOTYPE DISCLAIMER: All names, IDs, coordinates, and documents
       below are simulated demonstration records. They are not actual
       records from a real supplier, government authority, or certification
       body. Marked _proto: true throughout.
    ══════════════════════════════════════════════════════════════════════ */
    {
      id:           'farmer',
      number:       1,
      type:         'farmer',
      title:        'Farmer / Collection',
      subtitle:     'PROOF OF ORIGIN',
      purposeLabel: 'Origin Verified',
      status:       'verified',
      color:        '#7CFF4F',
      glowColor:    'rgba(124, 255, 79,0.6)',
      nodePosition: 'up',
      tPosition:    0.10,
      data: {
        type:              'farmer',
        stageId:           'STG-01-FARM',
        eventId:           'EVT-COL-2026-001',
        date:              '14 August 2026',
        entity:            'Mahesh Patil',
        entityType:        'Registered Botanical Collector',
        description:       'This stage records the origin of the botanical raw material used in your product. Mahesh Patil, a registered collector with the Nashik Herbal Growers Cooperative, harvested 250 kg of fresh Ashwagandha roots from his cultivated plot in Nashik, Maharashtra on 14 August 2026. The collection event was GPS-tagged at source, the quantity independently weighed, and the species visually and botanically confirmed before the batch was accepted into the supply chain.',

        /* Collector identity */
        collectionHub:     'Nashik Herbal Growers Cooperative — Collection Point 4',
        species:           'Ashwagandha',
        botanicalName:     'Withania somnifera',
        partUsed:          'Root (fresh, uncured)',
        cultivationType:   'Cultivated botanical crop',
        harvestSeason:     'Kharif 2026',
        totalCollection:   '250 kg',
        farmerCount:       1,
        farmerCooperative: 'Nashik Herbal Growers Cooperative',
        batchId:           'ASH-2026-001',
        soilHealthStatus:  'Red laterite loam · pH 6.8 · No synthetic pesticide declaration signed',
        collectorLicense:  'COL-ELIG-2026-001 · Nashik Herbal Growers Cooperative',

        /* Farmer-specific fields consumed by FarmerDetailPanel */
        farmerName:        'Mahesh Patil',
        farmerRole:        'Registered Botanical Collector',
        farmerDistrict:    'Nashik',
        farmerState:       'Maharashtra',
        collectionId:      'COL-ASH-2026-001',
        collectionTime:    '08:45 AM IST',
        collectionMethod:  'Cultivated botanical crop',
        gpsAccuracyM:      8,
        farmerImageUrl:    '/farmer-mahesh-patil.jpg',

        location: {
          lat:     19.9975,
          lng:     73.7898,
          label:   'Collection Location',
          city:    'Nashik',
          state:   'Maharashtra',
          country: 'India',
        },
        documents: [
          {
            label:  'Botanical Source / Collection Record',
            ref:    'BOT-COL-ASH-2026-001',
            _proto: true,
          },
          {
            label:  'Collector Eligibility Record',
            ref:    'COL-ELIG-2026-001',
            _proto: true,
          },
          {
            label:  'GPS Collection Log',
            ref:    'GPS-LOG-COL-2026-001',
            _proto: true,
          },
          {
            label:  'Quantity Verification Receipt',
            ref:    'QTY-VER-ASH-2026-001',
            _proto: true,
          },
        ],
        blockchain: {
          txHash:    '0x7d3f…a9b21c',
          blockNum:  '4587123',
          timestamp: '14 Aug 2026, 08:45 AM IST',
          network:   'Permissioned Ledger',
          _proto:    true,
        },
        checks: [
          { label: 'Species recorded',                   detail: 'Withania somnifera confirmed',        status: 'pass' },
          { label: 'Collection location captured',       detail: '19.9975° N, 73.7898° E · ±8 m',     status: 'pass' },
          { label: 'Quantity recorded',                  detail: '250 kg · independently weighed',      status: 'pass' },
          { label: 'Collector eligibility verified',     detail: 'COL-ELIG-2026-001 · active',          status: 'pass' },
          { label: 'Collection event recorded',          detail: 'EVT-COL-2026-001 anchored to ledger', status: 'pass' },
          { label: 'GPS source verified',                detail: 'Accuracy ±8 m · timestamp matched',   status: 'pass' },
        ],
      },
    },

    /* ══════════════════════════════════════════════════════════════════════
       STAGE 2 — LABORATORY TESTING
       Who:  Certified Botanical Testing Laboratory, Mumbai
       What: Multi-parameter quality testing on raw material batch ASH-2026-001

       PROTOTYPE DISCLAIMER: All test results, IDs, and report references
       are simulated demonstration data. They do not represent genuine
       laboratory results from any real accreditation body or test house.
       Marked _proto: true throughout.
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
        eventId:            'EVT-LAB-2026-014',
        date:               '18 August 2026',
        entity:             'Certified Botanical Testing Laboratory',
        entityType:         'Third-Party Analytical Laboratory',
        description:        'The batch ASH-2026-001 (250 kg Ashwagandha root, collected by Mahesh Patil, Nashik) was sampled and dispatched under chain-of-custody seal to the Certified Botanical Testing Laboratory in Mumbai for independent quality testing. The testing panel covered identity confirmation, moisture content, foreign matter, ash value, microbial load, and heavy metals screening — defined quality parameters that every batch must meet before being accepted into the supply chain. A formal report was issued on 18 August 2026 upon the batch achieving PASS status across all critical parameters.',

        labName:            'Certified Botanical Testing Laboratory',
        accreditation:      'Registered Analytical Laboratory · ID: LAB-MH-0241',
        sampleId:           'SMP-ASH-001',
        testDate:           '16–18 August 2026',
        certificateId:      'LAB-RPT-ASH-2026-014',
        withanolideContent: '2.72% (w/w) — Meets specification (≥ 2.5%)',

        /* Extended lab fields */
        testId:             'LAB-ASH-2026-014',
        laboratoryId:       'LAB-MH-0241',
        batchId:            'ASH-2026-001',
        sampleReceivedDate: '16 August 2026',
        sampleReceivedTime: '11:20 AM IST',
        sampleQuantity:     '500 g',
        reportId:           'LAB-RPT-ASH-2026-014',
        reportIssueDate:    '18 August 2026',
        labCity:            'Mumbai',
        labImageUrl:        '/lab-testing-scene.jpg',

        location: {
          lat:     19.0760,
          lng:     72.8777,
          label:   'Testing Laboratory',
          city:    'Mumbai',
          state:   'Maharashtra',
          country: 'India',
        },

        results: [
          {
            label:  'Identity',
            value:  'Conforming',
            method: 'Botanical identification',
            status: 'pass',
            detail: 'Withania somnifera confirmed by organoleptic + TLC',
          },
          {
            label:  'Moisture Content',
            value:  '8.2',
            unit:   '%',
            limit:  '< 10 %',
            method: 'Loss on drying (100–105°C)',
            status: 'pass',
            detail: 'Result: 8.2% · Spec: < 10%',
          },
          {
            label:  'Foreign Matter',
            value:  '0.4',
            unit:   '%',
            limit:  '< 2 %',
            method: 'Visual examination',
            status: 'pass',
            detail: 'Stem pieces and soil · Well within limit',
          },
          {
            label:  'Ash Value',
            value:  '6.1',
            unit:   '%',
            limit:  'Within specification',
            method: 'Total ash by ignition',
            status: 'pass',
            detail: 'Total ash by ignition · Compliant',
          },
          {
            label:  'Microbial Load',
            value:  'Within specification',
            method: 'Pour plate (TPC, yeast, mould)',
            status: 'pass',
            detail: 'TPC, yeast/mould, coliforms · All within limits',
          },
          {
            label:  'Heavy Metals',
            value:  'Within permissible limits',
            method: 'ICP-OES (Pb, As, Cd, Hg)',
            status: 'pass',
            detail: 'Lead, Arsenic, Cadmium, Mercury · All below WHO/FAO limits',
          },
        ],

        documents: [
          { label: 'Prototype Laboratory Report',       ref: 'LAB-RPT-ASH-2026-014',   _proto: true },
          { label: 'Sample Receipt / Chain-of-Custody', ref: 'COC-LAB-ASH-2026-014',   _proto: true },
          { label: 'Heavy Metals Screen (ICP-OES)',     ref: 'HM-LAB-ASH-2026-014',    _proto: true },
          { label: 'Microbial Limits Test Record',      ref: 'MICRO-LAB-ASH-2026-014', _proto: true },
        ],

        blockchain: {
          txHash:    '0x91ac…72ef',
          blockNum:  '4587198',
          timestamp: '18 Aug 2026, 04:15 PM IST',
          network:   'Permissioned Ledger',
          _proto:    true,
        },

        checks: [
          { label: 'Sample linked to collection batch', detail: 'SMP-ASH-001 → ASH-2026-001',              status: 'pass' },
          { label: 'Test results recorded',             detail: '6 / 6 parameters tested',                  status: 'pass' },
          { label: 'All critical tests passed',         detail: 'Identity, moisture, ash, microbial, metals', status: 'pass' },
          { label: 'Lab report verified',               detail: 'LAB-RPT-ASH-2026-014 · 18 Aug 2026',      status: 'pass' },
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
          { step: 7, name: 'QC Release & Packaging',           detail: '60-tab HDPE bottles · Lot-coded · PRD-ASH-2026-0447 released', output: '43,783 bottles', status: 'pass' },
        ],
        documents: [
          { label: 'Manufacturing Licence',      ref: 'AY/MFG/HP/2026/0321',          _proto: true },
          { label: 'WHO-GMP Certificate',        ref: 'HP-WHO-GMP/2025/047',          _proto: true },
          { label: 'Batch Manufacturing Record', ref: 'BMR-ASH-2026-0447',            _proto: true },
          { label: 'In-Process Test Records',    ref: 'IPT-ASH-2026-0447',            _proto: true },
          { label: 'QC Release Order',           ref: 'QCR-ASH-2026-0447',            _proto: true },
          { label: 'Finished Product CoA',       ref: 'FPCOA-ASH-2026-0447',          _proto: true },
        ],
        blockchain: {
          txHash:    '0xf3a9…82b61c',
          blockNum:  '4587450',
          timestamp: '26 Aug 2026, 05:44 PM IST',
          network:   'Permissioned Ledger',
          _proto:    true,
        },
        checks: [
          { label: 'Manufacturing licence active',         detail: 'AY/MFG/HP/2026/0321',                     status: 'pass' },
          { label: 'WHO-GMP certification current',        detail: 'HP-WHO-GMP/2025/047',                     status: 'pass' },
          { label: 'Input traced from raw material batch', detail: 'ASH-2026-001 → PRD-ASH-2026-0447',        status: 'pass' },
          { label: 'All 7 manufacturing steps recorded',   detail: '7 / 7 steps · BMR signed',                 status: 'pass' },
          { label: 'In-process tests passed',              detail: 'Weight · hardness · disintegration',       status: 'pass' },
          { label: 'QC release order issued',              detail: 'QCR-ASH-2026-0447',                        status: 'pass' },
          { label: 'Yield within validated range',         detail: '43,783 bottles · 96.1% yield',             status: 'pass' },
        ],
      },
    },

    /* ══════════════════════════════════════════════════════════════════════
       STAGE 5 — FINAL PRODUCT / PACKAGING
       This is the bottle the customer physically holds.
       QR scan resolves to this exact record.

       PROTOTYPE DISCLAIMER: All IDs, serial numbers, and ledger records
       are simulated demonstration data. Marked _proto: true throughout.
    ══════════════════════════════════════════════════════════════════════ */
    {
      id:           'product',
      number:       5,
      type:         'product',
      title:        'Final Product',
      subtitle:     'PROOF OF AUTHENTICITY',
      purposeLabel: 'Product Verified',
      status:       'verified',
      color:        '#7CFF4F',
      glowColor:    'rgba(124, 255, 79,0.6)',
      nodePosition: 'up',
      tPosition:    0.88,
      data: {
        type:               'product',
        stageId:            'STG-05-PROD',
        eventId:            'EVT-PROD-2026-0447',
        date:               '29 August 2026',
        entity:             'Himalaya Drug Company Pvt. Ltd.',
        entityType:         'Brand Owner / Manufacturer',
        description:        'This bottle of Himalaya Ashwagandha Pure Herbs (60 tablets, Batch PRD-ASH-2026-0447) has been uniquely serialised and linked to its complete provenance chain. The QR code printed on this bottle resolves exclusively to this record. The pack serial is immutably recorded — it cannot be reused, duplicated, or forged. All 5 provenance stages have been individually verified and anchored to a permissioned ledger. This product is 100% traceable from root to tablet.',

        /* Product identity */
        productName:        'Himalaya Ashwagandha',
        brand:              'Himalaya',
        skuCode:            'HIM-ASH-PH-60T',
        batchCode:          'PRD-ASH-2026-0447',
        packSerial:         'PRD-ASH-2026-0447',
        tabletCount:        60,
        netWeight:          '30 g',
        manufactured:       'August 2026',
        expiry:             'July 2028',
        qrLinkedTo:         'R2R-PRD-ASH-2026-0447',

        /* Extended product fields */
        productId:          'PRD-ASH-2026-0447',
        qrIdentifier:       'R2R-PRD-ASH-2026-0447',
        scratchCodeEnabled: true,
        stagesVerified:     5,
        traceabilityPct:    100,
        productImageUrl:    '/himalaya-ashwagandha-bottle.jpg',

        location: {
          lat:     30.9526,
          lng:     76.7909,
          label:   'Packaged — Baddi Plant',
          city:    'Baddi',
          state:   'Himachal Pradesh',
          country: 'India',
        },

        chainSummary: [
          { stage: 'Farmer / Collection', eventId: 'EVT-COL-2026-001',  status: 'pass', color: '#7CFF4F', icon: 'leaf'    },
          { stage: 'Laboratory Testing',  eventId: 'EVT-LAB-2026-014',  status: 'pass', color: '#4ea8d2', icon: 'flask'   },
          { stage: 'Transportation',      eventId: 'EVT-TRN-2026-014',  status: 'pass', color: '#8b6cd4', icon: 'truck'   },
          { stage: 'Manufacturing',       eventId: 'EVT-MFG-2026-0447', status: 'pass', color: '#e8a84a', icon: 'factory' },
          { stage: 'Final Product',       eventId: 'EVT-PROD-2026-0447',status: 'pass', color: '#7CFF4F', icon: 'package' },
        ],

        documents: [
          { label: 'Botanical Source / Collection Record', ref: 'BOT-COL-ASH-2026-001',   _proto: true },
          { label: 'Prototype Laboratory Report',         ref: 'LAB-RPT-ASH-2026-014',   _proto: true },
          { label: 'Transportation Chain Record',         ref: 'TRANS-REC-ASH-2026-014',  _proto: true },
          { label: 'Batch Manufacturing Record',          ref: 'BMR-ASH-2026-0447',       _proto: true },
          { label: 'Product Verification Record',         ref: 'PROD-VER-ASH-2026-0447',  _proto: true },
        ],

        blockchain: {
          txHash:    '0xf821…44bc',
          blockNum:  '4587521',
          timestamp: '29 Aug 2026, 10:00 AM IST',
          network:   'Permissioned Ledger',
          _proto:    true,
        },

        checks: [
          { label: 'Pack serial uniquely registered',          detail: 'PRD-ASH-2026-0447 · 1-of-1',             status: 'pass' },
          { label: 'QR code resolves to this provenance record', detail: 'R2R-PRD-ASH-2026-0447 · verified',     status: 'pass' },
          { label: 'Batch fully traceable to raw material',    detail: 'ASH-2026-001 → PRD-ASH-2026-0447',       status: 'pass' },
          { label: '5 of 5 stages verified',                   detail: 'All events anchored to ledger',             status: 'pass' },
          { label: 'Product within expiry window',             detail: 'Manufactured Aug 2026 · Expires Jul 2028', status: 'pass' },
        ],
      },
    },

  ], // end stages
}

