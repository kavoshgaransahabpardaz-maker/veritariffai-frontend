import { apiRequest } from '@/lib/api/client'
import { quotaSchema } from '@/lib/api/schemas'

export function getQuota(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/quota`,
    token,
    schema: quotaSchema,
  })
}
