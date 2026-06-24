import { apiRequest } from '@/lib/api/client'
import {
  bomItemListSchema,
  originResultSchema,
  originRuleSchema,
} from '@/lib/api/schemas'
import type { BomItemCreate } from '@/lib/api/types'

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
