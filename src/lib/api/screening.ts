import { apiRequest } from '@/lib/api/client'
import { screeningResultListSchema } from '@/lib/api/schemas'

export function getScreening(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/screening`,
    token,
    schema: screeningResultListSchema,
  })
}

export function runScreening(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/screening/run`,
    method: 'POST',
    token,
    schema: screeningResultListSchema,
  })
}
