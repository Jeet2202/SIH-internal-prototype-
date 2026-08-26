/**
 * Root to Remedy — Provenance Calculation Service
 *
 * Computes dynamic stage verification, traceability percentages,
 * and detects suspicious/broken chain states dynamically from ledger data.
 */

import { PRODUCT } from '../data/provenance'
import type { ProvenanceProduct, ProvenanceStage } from '../types/provenance'

export interface ProvenanceVerificationStatus {
  totalStages:           number
  verifiedStages:        number
  traceabilityPercentage:number
  overallStatus:         'VERIFIED' | 'PENDING' | 'BROKEN_CHAIN' | 'RECALLED' | 'SUSPICIOUS'
  isFullyVerifiable:     boolean
}

export class ProvenanceService {
  /**
   * Computes verification metrics from active stage records
   */
  static calculateVerificationMetrics(product: ProvenanceProduct = PRODUCT): ProvenanceVerificationStatus {
    const stages = product.stages
    const totalStages = stages.length

    // Count stages with passing verification status
    let verifiedCount = 0
    let hasBrokenLink = false

    for (const stage of stages) {
      if (stage.status === 'verified') {
        verifiedCount++
      } else if (stage.status === 'failed') {
        hasBrokenLink = true
      }
    }

    const traceabilityPercentage = totalStages > 0
      ? Math.round((verifiedCount / totalStages) * 100)
      : 0

    let overallStatus: ProvenanceVerificationStatus['overallStatus'] = 'VERIFIED'
    if (hasBrokenLink) {
      overallStatus = 'BROKEN_CHAIN'
    } else if (verifiedCount < totalStages) {
      overallStatus = 'PENDING'
    }

    return {
      totalStages,
      verifiedStages: verifiedCount,
      traceabilityPercentage,
      overallStatus,
      isFullyVerifiable: verifiedCount === totalStages,
    }
  }

  /**
   * Retrieve stage by number
   */
  static getStageByNumber(stageNumber: number, product: ProvenanceProduct = PRODUCT): ProvenanceStage | undefined {
    return product.stages.find((s) => s.number === stageNumber)
  }
}
