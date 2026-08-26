import type { ProvenanceProduct } from '../types/provenance';

export const PRODUCT: ProvenanceProduct = {
  name: 'Ashwagandha Capsules',
  brand: 'Root to Remedy',
  batch: 'PRD-ASH-2026-0447',
  packSerial: 'RTR-ASH-8F42-0193',
  status: 'PRODUCT VERIFIED',
  traceabilityLabel: '5 / 5 STAGES VERIFIED · 100% TRACEABLE',
  scratchCode: 'RTR-8472',

  stages: [
    /* -----------------------------------------------------------------------
       STAGE 01 — FARMER / COLLECTION
    ----------------------------------------------------------------------- */
    {
      id: 'farmer',
      number: 1,
      type: 'farmer',
      title: 'Farmer & Collection',
      subtitle: 'PROOF OF ORIGIN',
      purposeLabel: 'Origin Verified',
      status: 'verified',
      color: '#7ec85a',
      glowColor: 'rgba(126,200,90,0.6)',
      nodePosition: 'up',
      tPosition: 0.12,
      data: {
        type: 'farmer',
        collectionHub: 'Khedgaon Medicinal Plant Collection Hub',
        location: 'Khedgaon, Maharashtra, India',
        species: 'Ashwagandha',
        botanicalName: 'Withania somnifera',
        collectionDate: '20 August 2026',
        batchId: 'KHED-ASH-026',
        farmerCount: 27,
        totalCollection: '640 kg',
        checks: [
          { label: 'Registered collection hub', status: 'pass' },
          { label: 'GPS zone verified', detail: 'Jalna approved zone', status: 'pass' },
          { label: 'Collection window valid', detail: '15 Nov – 15 Mar season', status: 'pass' },
          { label: 'Species identification confirmed', detail: 'Withania somnifera · 96.2%', status: 'pass' },
          { label: 'Quantity recorded and linked', detail: '640 kg · KHED-ASH-026', status: 'pass' },
          { label: 'Farmer eligibility verified', detail: '27 of 27 eligible', status: 'pass' },
        ],
      },
    },

    /* -----------------------------------------------------------------------
       STAGE 02 — LABORATORY
    ----------------------------------------------------------------------- */
    {
      id: 'lab',
      number: 2,
      type: 'lab',
      title: 'Laboratory Testing',
      subtitle: 'PROOF OF QUALITY',
      purposeLabel: 'Quality Verified',
      status: 'verified',
      color: '#4ea8d2',
      glowColor: 'rgba(78,168,210,0.6)',
      nodePosition: 'down',
      tPosition: 0.30,
      data: {
        type: 'lab',
        labName: 'Sanjeevani Analytical Laboratories',
        accreditation: 'NABL Accredited · TC-9942',
        sampleId: 'LAB-ASH-2026-026',
        testDate: '22 August 2026',
        certificateId: 'NABL/2026/AY/00891',
        results: [
          { label: 'Species Identification', value: 'Withania somnifera ✓', status: 'pass', detail: 'DNA Barcoding · ITS2 · 98.7% match' },
          { label: 'Moisture Content', value: '8.4%', status: 'pass', detail: 'Limit ≤ 12% · PASS' },
          { label: 'Pesticide Residue', value: '0.018 ppm', status: 'pass', detail: 'Limit ≤ 0.05 ppm · PASS' },
          { label: 'Lead (Pb)', value: '0.42 ppm', status: 'pass', detail: 'Limit ≤ 10 ppm · PASS' },
          { label: 'Arsenic (As)', value: '0.14 ppm', status: 'pass', detail: 'Limit ≤ 3 ppm · PASS' },
          { label: 'NABL Certificate', value: 'Verified ✓', status: 'pass', detail: 'NABL/2026/AY/00891' },
        ],
        checks: [
          { label: 'NABL accredited laboratory', detail: 'TC-9942 · active', status: 'pass' },
          { label: 'Species confirmed by DNA barcoding', detail: '98.7% match', status: 'pass' },
          { label: 'All chemical parameters within limits', status: 'pass' },
          { label: 'Certificate ID anchored to record', detail: 'NABL/2026/AY/00891', status: 'pass' },
          { label: 'Batch ID matches certificate', detail: 'LAB-ASH-2026-026', status: 'pass' },
        ],
      },
    },

    /* -----------------------------------------------------------------------
       STAGE 03 — MANUFACTURING
    ----------------------------------------------------------------------- */
    {
      id: 'manufacturing',
      number: 3,
      type: 'manufacturing',
      title: 'Manufacturing',
      subtitle: 'PROOF OF PROCESSING',
      purposeLabel: 'Processing Verified',
      status: 'verified',
      color: '#c8922e',
      glowColor: 'rgba(200,146,46,0.6)',
      nodePosition: 'up',
      tPosition: 0.50,
      data: {
        type: 'manufacturing',
        manufacturer: 'Anantam Ayurveda Works',
        inputBatch: 'KHED-ASH-026',
        outputBatch: 'PRD-ASH-2026-0447',
        steps: [
          { name: 'Raw Material Intake', detail: 'Batch KHED-ASH-026 · 640 kg received', input: '640 kg', status: 'pass' },
          { name: 'Drying', detail: '42°C · 38% humidity · 18 h', input: '640 kg', output: '621 kg', status: 'pass' },
          { name: 'Grinding', detail: 'Mesh 80 · planetary mill', input: '621 kg', output: '612 kg', status: 'pass' },
          { name: 'Formulation', detail: 'Capsule formulation · 500 mg per cap', input: '612 kg', output: '609 kg', status: 'pass' },
          { name: 'Packaging', detail: '60 capsule packs · PRD-ASH-2026-0447', output: '10,150 units', status: 'pass' },
        ],
        checks: [
          { label: 'Facility licence active', detail: 'AY/MFG/MH/2231', status: 'pass' },
          { label: 'Input traced to KHED-ASH-026', status: 'pass' },
          { label: 'All processing steps recorded', detail: '5 of 5', status: 'pass' },
          { label: 'Yield within expected range', detail: '95.2%', status: 'pass' },
          { label: 'Output batch PRD-ASH-2026-0447 created', status: 'pass' },
        ],
      },
    },

    /* -----------------------------------------------------------------------
       STAGE 04 — TRANSPORTATION
    ----------------------------------------------------------------------- */
    {
      id: 'transport',
      number: 4,
      type: 'transport',
      title: 'Transportation',
      subtitle: 'PROOF OF CUSTODY',
      purposeLabel: 'Custody Verified',
      status: 'verified',
      color: '#8b6cd4',
      glowColor: 'rgba(139,108,212,0.6)',
      nodePosition: 'down',
      tPosition: 0.70,
      data: {
        type: 'transport',
        partner: 'Verified Logistics Partner',
        pickupDate: '24 August 2026',
        destination: 'Mumbai Distribution Centre',
        metrics: [
          { label: 'Temperature', value: '23.4°C · Within limit ✓', status: 'pass' },
          { label: 'Humidity', value: '56% · Within limit ✓', status: 'pass' },
          { label: 'GPS Route', value: 'Verified ✓', status: 'pass' },
          { label: 'Shock / Vibration', value: 'Within threshold ✓', status: 'pass' },
          { label: 'Insurance', value: 'Active during transit ✓', status: 'pass' },
          { label: 'Delivery', value: '25 Aug 2026 · Confirmed ✓', status: 'pass' },
        ],
        checks: [
          { label: 'Custody transfer from manufacturer confirmed', status: 'pass' },
          { label: 'Temperature maintained within limits', detail: 'Max 23.4°C', status: 'pass' },
          { label: 'No route deviations recorded', status: 'pass' },
          { label: 'Delivery at distribution centre confirmed', status: 'pass' },
          { label: 'Insurance active throughout', status: 'pass' },
        ],
      },
    },

    /* -----------------------------------------------------------------------
       STAGE 05 — FINAL PRODUCT
    ----------------------------------------------------------------------- */
    {
      id: 'product',
      number: 5,
      type: 'product',
      title: 'Final Product',
      subtitle: 'PROOF OF PRODUCT',
      purposeLabel: 'Product Verified',
      status: 'verified',
      color: '#7ec85a',
      glowColor: 'rgba(126,200,90,0.6)',
      nodePosition: 'up',
      tPosition: 0.88,
      data: {
        type: 'product',
        productName: 'Ashwagandha Capsules',
        brand: 'Root to Remedy',
        batch: 'PRD-ASH-2026-0447',
        manufactured: '25 August 2026',
        expiry: '24 August 2028',
        packSerial: 'RTR-ASH-8F42-0193',
        chainSummary: [
          { label: 'Collection verified', status: 'pass' },
          { label: 'Lab quality verified', status: 'pass' },
          { label: 'Manufacturing verified', status: 'pass' },
          { label: 'Transport verified', status: 'pass' },
          { label: 'Product authenticated', status: 'pass' },
        ],
        checks: [
          { label: 'Product batch linked to source', detail: 'KHED-ASH-026 → PRD-ASH-2026-0447', status: 'pass' },
          { label: 'QR serial matches pack', detail: 'RTR-ASH-8F42-0193', status: 'pass' },
          { label: 'Provenance record complete', detail: '5 of 5 stages', status: 'pass' },
          { label: 'No chain integrity issues', status: 'pass' },
          { label: 'Product within expiry', detail: 'Valid until 24 Aug 2028', status: 'pass' },
        ],
      },
    },
  ],
};
