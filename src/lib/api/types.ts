import type { components } from '@/lib/api/generated/schema'
import type { ConfidenceTier } from '@/lib/confidence'

// Generated types (stable backend contracts)
export type User = components['schemas']['UserResponse']
export type Shipment = components['schemas']['ShipmentResponse']
export type ShipmentCreate = components['schemas']['ShipmentCreate']
export type ShipmentUpdate = components['schemas']['ShipmentUpdate']
export type ExtractionResult = components['schemas']['ExtractionResultResponse']
export type CostBreakdown = components['schemas']['CostBreakdownResponse']
export type ScreeningResult = components['schemas']['ScreeningResultResponse']
export type OriginRule = components['schemas']['OriginRuleResponse']
export type BomItem = components['schemas']['BomItemResponse']
export type BomItemCreate = components['schemas']['BomItemCreate']
export type DocumentSummary = components['schemas']['DocumentSummaryResponse']
export type DocumentDetail = components['schemas']['DocumentResponse']
export type DocType = components['schemas']['DocType']

// Extended types — hand-maintained to include fields added in steel feature spec
// Leaf citation inside a gate item
export type CitationRef = {
  ref?: string
  text: string
}

// Supports both legacy flat { text, source_ref } and new gate { gate_id, outcome, citations[] }
export type Citation = {
  // legacy flat format
  text?: string
  source_ref?: string | null
  // new gate format (classification)
  gate_id?: string
  outcome?: string
  citations?: CitationRef[]
}

export type QAAttribute = {
  name: string
  value: string
  source?: string
  confidence?: ConfidenceTier | null
  citation?: string | null
}

export type QACandidate = {
  hs_code: string
  description?: string | null
  rationale?: string | null
}

export type QAResponse = {
  question?: string
  options?: string[] | null
  state_token: string
  is_complete: boolean
  candidate_code?: string | null
  confidence?: ConfidenceTier | null
  auto_resolved?: boolean | null
  citation_chain?: Citation[] | null
  alternatives?: QACandidate[] | null
  attributes?: QAAttribute[] | null
  why_text?: string | null
  [key: string]: unknown
}

export type Classification = {
  id: string
  shipment_id: string
  hs_code: string | null
  description: string | null
  confidence: ConfidenceTier
  confidence_reason?: string | null
  source: 'assistant' | 'override'
  official_data_json?: Record<string, unknown> | null
  controls?: string[] | null
  citation_chain?: Citation[] | null
  auto_resolved?: boolean | null
  candidate_codes?: QACandidate[] | null
  tree_version?: string | null
  nomenclature_version?: string | null
  created_at: string
}

export type OriginResult = {
  id: string
  shipment_id: string
  rule_id: string | null
  qualifies: boolean
  basis: string
  non_originating_pct: string | null
  cap_pct: string | null
  margin_pct: string | null
  melt_country?: string | null
  pour_country?: string | null
  melt_pour_qualifies?: boolean | null
  disqualifying_reason?: string | null
  treated_conservatively: boolean
  blocking_items_json: Record<string, unknown>[] | null
  confidence: ConfidenceTier
  confidence_reason: string
  insufficient_operations_flag: boolean
  evaluated_at: string
  disclaimer: string
  not_a_customs_ruling: boolean
  citations?: Citation[] | null
}

export type MeltAndPourResult = {
  eligible: boolean
  melt_country: string | null
  pour_country: string | null
  confidence: string
  disqualifying_reason: string | null
  citations: string[] | null
}
