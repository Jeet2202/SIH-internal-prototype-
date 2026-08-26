/**
 * Root to Remedy — Stage 3: TRANSPORTATION
 * Completed custody record for batch ASH-2026-001
 *
 * PROTOTYPE DISCLAIMER
 * ─────────────────────
 * All IDs, policy numbers, vehicle IDs, driver names, GPS checkpoint counts,
 * and blockchain hashes are SIMULATED for demonstration purposes only.
 * No real insurance product, logistics company, or driver is represented.
 *
 * This is a finished, delivered shipment — NOT a live-tracking record.
 * The QR code was scanned on the finished product after all supply-chain
 * events had already been completed.
 */

import type { TransportationRecord } from '../types/transportation'

export const TRANSPORTATION_RECORD: TransportationRecord = {
  stageNumber: 3,
  stage:       'TRANSPORTATION',
  title:       'Transportation',
  status:      'Verified',

  shipmentId:  'SHP-ASH-2026-001',
  batchId:     'ASH-2026-001',

  transporter: {
    name:               'Verified Botanical Logistics',
    transporterId:      'TRN-MH-1024',
    verificationStatus: 'Verified',
    registeredLocation: 'Nashik, Maharashtra',
    vehicleId:          'MH-15-AB-4821',
    vehicleType:        'Temperature-Monitored Goods Carrier',
    driverName:         'Rakesh Jadhav',
    driverId:           'DRV-MH-4821',
  },

  route: {
    origin:          'Nashik, Maharashtra',
    destination:     'Mumbai, Maharashtra',
    distanceKm:      165,
    routeStatus:     'Verified',
    gpsCheckpoints:  12,
    routeDeviations: 0,
  },

  shipment: {
    pickupDate:     '19 August 2026',
    pickupTime:     '07:30 AM IST',
    arrivalDate:    '19 August 2026',
    arrivalTime:    '02:15 PM IST',
    deliveryStatus: 'Delivered',
  },

  conditions: {
    temperature:     '24.6 °C',
    humidity:        '58 %',
    conditionStatus: 'Within threshold',
  },

  monitoring: {
    gpsTracking:         'Recorded',
    conditionMonitoring: 'Recorded',
    routeVerified:       true,
    tamperCheck:         'No anomaly detected',
  },

  insurance: {
    status:            'Protected during transit',
    policyId:          'INS-ASH-2026-001',
    coverage:          'Transit batch protection',
    triggerMonitoring: ['GPS', 'Temperature', 'Humidity', 'Custody events'],
    transitStatus:     'Completed — no claim triggered',
  },

  ledger: {
    transactionId: '0xa21f...9bc4',
    blockNumber:   '4587234',
    timestamp:     '19 Aug 2026, 02:20 PM IST',
    network:       'Permissioned Ledger',
    _proto:        true,
  },
}
