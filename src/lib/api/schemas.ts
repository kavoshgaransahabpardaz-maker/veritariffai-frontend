import { z } from 'zod'
import { normalizeConfidence } from '@/lib/confidence'

const laneSchema = z.enum(['EU_EU', 'EU_UK', 'UK_EU', 'EU_ROW', 'UK_ROW'])
const shipmentStatusSchema = z.enum(['draft', 'in_progress', 'ready', 'blocked'])
const confidenceStringSchema = z.string().transform((value) => normalizeConfidence(value))

export const googleAuthUrlSchema = z.object({
  auth_url: z.string().url(),
})

export const userSchema = z
  .object({
    id: z.string(),
    email: z.string().min(1),
    is_active: z.boolean(),
  })
  .passthrough()

export const shipmentSchema = z
  .object({
    id: z.string(),
    user_id: z.string(),
    name: z.string(),
    lane: laneSchema,
    status: shipmentStatusSchema,
    origin_country: z.string(),
    destination_country: z.string(),
    incoterms: z.string().nullable(),
    currency: z.string(),
    declared_value: z.string().nullable(),
    ex_works_value: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
    section_statuses: z.record(z.string(), z.string()),
  })
  .passthrough()

export const shipmentListSchema = z.array(shipmentSchema)

export const extractionSchema = z
  .object({
    id: z.string(),
    shipment_id: z.string(),
    source: z.enum(['invoice', 'description']),
    raw_ref: z.string().nullable(),
    fields_json: z.record(z.string(), z.unknown()).nullable(),
    per_field_confidence_json: z.record(z.string(), z.unknown()).nullable(),
    status: z.enum(['pending', 'done', 'failed']),
    confirmed: z.boolean(),
    created_at: z.string(),
  })
  .passthrough()

export const qaSchema = z
  .object({
    question: z.string(),
    options: z.array(z.string()).nullable().optional(),
    state_token: z.string(),
    is_complete: z.boolean(),
    candidate_code: z.string().nullable().optional(),
    confidence: confidenceStringSchema.nullable().optional(),
  })
  .passthrough()

export const classificationSchema = z
  .object({
    id: z.string(),
    shipment_id: z.string(),
    hs_code: z.string().nullable(),
    description: z.string().nullable(),
    confidence: confidenceStringSchema,
    source: z.enum(['assistant', 'override']),
    official_data_json: z.record(z.string(), z.unknown()).nullable(),
    dual_use_flag: z.boolean().nullable(),
    created_at: z.string(),
  })
  .passthrough()

export const costSchema = z
  .object({
    id: z.string(),
    shipment_id: z.string(),
    goods_value: z.string(),
    duty_preferential: z.string().nullable(),
    duty_mfn: z.string().nullable(),
    import_vat: z.string().nullable(),
    other_fees_json: z.record(z.string(), z.unknown()).nullable(),
    vat_treatment: z.enum(['standard', 'pva', 'reclaimable']),
    as_of: z.string(),
    computed_at: z.string(),
    confidence: confidenceStringSchema,
    confidence_reason: z.string(),
    disclaimer: z.string(),
    not_a_customs_ruling: z.boolean(),
    intrastat_note: z.string().nullable().optional(),
  })
  .passthrough()

export const screeningResultSchema = z
  .object({
    id: z.string(),
    shipment_id: z.string(),
    party_id: z.string().nullable(),
    list_source: z.string(),
    outcome: z.enum(['clear', 'hit', 'review']),
    match_json: z.record(z.string(), z.unknown()).nullable(),
    screened_at: z.string(),
  })
  .passthrough()

export const screeningResultListSchema = z.array(screeningResultSchema)

export const bomItemSchema = z
  .object({
    id: z.string(),
    shipment_id: z.string(),
    material_name: z.string(),
    hs_code: z.string().nullable(),
    claimed_origin_country: z.string(),
    value: z.string(),
    supplier_declaration_status: z.enum(['on_file', 'pending', 'none']),
  })
  .passthrough()

export const bomItemListSchema = z.array(bomItemSchema)

export const originRuleSchema = z
  .object({
    id: z.string(),
    hs_heading: z.string(),
    agreement: z.string(),
    rule_type: z.enum(['wholly_obtained', 'ctc', 'max_nom', 'specific_process', 'alternatives']),
    rule_json: z.record(z.string(), z.unknown()),
    source_ref: z.string(),
  })
  .passthrough()

export const originResultSchema = z
  .object({
    id: z.string(),
    shipment_id: z.string(),
    rule_id: z.string().nullable(),
    qualifies: z.boolean(),
    basis: z.string(),
    non_originating_pct: z.string().nullable(),
    cap_pct: z.string().nullable(),
    margin_pct: z.string().nullable(),
    treated_conservatively: z.boolean(),
    blocking_items_json: z.array(z.record(z.string(), z.unknown())).nullable(),
    confidence: confidenceStringSchema,
    confidence_reason: z.string(),
    insufficient_operations_flag: z.boolean(),
    evaluated_at: z.string(),
    disclaimer: z.string(),
    not_a_customs_ruling: z.boolean(),
  })
  .passthrough()

export const documentSummarySchema = z
  .object({
    id: z.string(),
    doc_type: z.string(),
    status: z.enum(['not_started', 'needs_input', 'ready', 'certified', 'blocked']),
    blocker: z.string().nullable(),
  })
  .passthrough()

export const documentSummaryListSchema = z.array(documentSummarySchema)

export const documentDetailSchema = z
  .object({
    id: z.string(),
    shipment_id: z.string(),
    doc_type: z.string(),
    status: z.enum(['not_started', 'needs_input', 'ready', 'certified', 'blocked']),
    draft_json: z.record(z.string(), z.unknown()).nullable(),
    blocker: z.string().nullable(),
    certified_by_user_at: z.string().nullable(),
    evidence_refs_json: z.array(z.unknown()).nullable(),
    created_at: z.string(),
    updated_at: z.string().nullable(),
  })
  .passthrough()

export const requestOkSchema = z.record(z.string(), z.unknown())

export const genericObjectSchema = z.record(z.string(), z.unknown())

export const apiErrorSchema = z
  .object({
    detail: z.array(z.object({ msg: z.string() })).optional(),
  })
  .passthrough()
