import { apiRequest } from '@/lib/api/client'
import { bundleSchema } from '@/lib/api/schemas'

export function generateBundle(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/bundle/generate`,
    method: 'POST',
    token,
  })
}

export function getBundle(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/bundle`,
    token,
    schema: bundleSchema,
  })
}
