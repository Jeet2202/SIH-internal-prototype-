/**
 * Root to Remedy — Transportation Stage Types
 *
 * Typed record for Stage 3: TRANSPORTATION
 * Represents a COMPLETED, VERIFIED historical custody record.
 *
 * This is NOT a live-tracking type. All fields describe what happened
 * during a past transit event, anchored to the permissioned ledger.
 *
 * PROTOTYPE NOTE: All IDs, hashes, policy numbers, and driver details
 * are simulated for demonstration purposes only.
 */

/* ── Transporter identity ───────────────────────────────────────── */
export interface TransportationTransporter {
  name:               string;
  transporterId:      string;
  verificationStatus: string;   // "Verified"
  registeredLocation: string;
  vehicleId:          string;
  vehicleType:        string;   // "Temperature-Monitored Goods Carrier"
  driverName:         string;
  driverId:           string;
}

/* ── Route ──────────────────────────────────────────────────────── */
export interface TransportationRoute {
  origin:          string;
  destination:     string;
  distanceKm:      number;
  routeStatus:     string;   // "Verified"
  gpsCheckpoints:  number;
  routeDeviations: number;
}

/* ── Shipment timeline ──────────────────────────────────────────── */
export interface TransportationShipment {
  pickupDate:     string;
  pickupTime:     string;
  arrivalDate:    string;
  arrivalTime:    string;
  deliveryStatus: string;   // "Delivered"
}

/* ── Environmental conditions ───────────────────────────────────── */
export interface TransportationConditions {
  temperature:     string;
  humidity:        string;
  conditionStatus: string;   // "Within threshold"
}

/* ── Monitoring (all historical — strings, not booleans) ────────── */
export interface TransportationMonitoring {
  gpsTracking:         string;   // "Recorded"
  conditionMonitoring: string;   // "Recorded"
  routeVerified:       boolean;
  tamperCheck:         string;   // "No anomaly detected"
}

/* ── Smart Insurance (completed transit) ────────────────────────── */
export interface TransportationInsurance {
  status:            string;     // "Protected during transit"
  policyId:          string;
  coverage:          string;
  triggerMonitoring: string[];   // ["GPS", "Temperature", "Humidity", "Custody events"]
  transitStatus:     string;     // "Completed — no claim triggered"
}

/* ── Ledger / blockchain anchor ─────────────────────────────────── */
export interface TransportationLedger {
  transactionId: string;
  blockNumber:   string;
  timestamp:     string;
  network:       string;
  _proto:        boolean;
}

/* ── Root record ────────────────────────────────────────────────── */
export interface TransportationRecord {
  stageNumber: number;
  stage:       string;
  title:       string;
  status:      string;

  shipmentId:  string;
  batchId:     string;

  transporter: TransportationTransporter;
  route:       TransportationRoute;
  shipment:    TransportationShipment;
  conditions:  TransportationConditions;
  monitoring:  TransportationMonitoring;
  insurance:   TransportationInsurance;
  ledger:      TransportationLedger;
}
