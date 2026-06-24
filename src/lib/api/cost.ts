import { apiRequest } from '@/lib/api/client'
import { costSchema } from '@/lib/api/schemas'

export function getCost(token: string, shipmentId: string, refresh = false) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/cost`,
    token,
    query: { refresh },
    schema: costSchema,
  })
}
