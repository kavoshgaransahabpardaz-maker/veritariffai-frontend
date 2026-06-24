import { apiRequest } from '@/lib/api/client'
import { genericObjectSchema } from '@/lib/api/schemas'

export function getReport(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/report`,
    token,
    schema: genericObjectSchema,
  })
}
