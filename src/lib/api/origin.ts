import { z } from 'zod'
import { apiRequest } from '@/lib/api/client'
import {
  bomItemListSchema,
  originResultSchema,
  originRuleSchema,
} from '@/lib/api/schemas'
import type { BomItemCreate, MeltAndPourResult } from '@/lib/api/types'

const meltAndPourResultSchema = z.object({
  eligible: z.boolean(),
  melt_country: z.string().nullable(),
  pour_country: z.string().nullable(),
  confidence: z.string(),
  disqualifying_reason: z.string().nullable().optional(),
  citations: z.array(z.string()).nullable().optional(),
}).loose()

export function getOriginRule(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/origin/rule`,
    token,
    schema: originRuleSchema,
  })
}

export function setBom(token: string, shipmentId: string, items: BomItemCreate[]) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/origin/bom`,
    method: 'PUT',
    token,
    body: { items },
    schema: bomItemListSchema,
  })
}

export function evaluateOrigin(
  token: string,
  shipmentId: string,
  insufficientOperationsAttested = false,
) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/origin/evaluate`,
    method: 'POST',
    token,
    body: {
      insufficient_operations_attested: insufficientOperationsAttested,
    },
    schema: originResultSchema,
  })
}

export function getOriginResult(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/origin`,
    token,
    schema: originResultSchema,
  })
}

export function evaluateMeltAndPour(token: string, shipmentId: string): Promise<MeltAndPourResult> {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/origin/melt-and-pour`,
    method: 'POST',
    token,
    schema: meltAndPourResultSchema,
  }) as Promise<MeltAndPourResult>
}
