import { apiRequest } from '@/lib/api/client'
import { extractionSchema } from '@/lib/api/schemas'

export function describeShipment(token: string, shipmentId: string, description: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/intake/describe`,
    method: 'POST',
    token,
    body: { description },
    schema: extractionSchema,
  })
}

export function uploadInvoice(token: string, shipmentId: string, file: File) {
  const formData = new FormData()
  formData.set('file', file)

  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/intake/invoice`,
    method: 'POST',
    token,
    body: formData,
    schema: extractionSchema,
  })
}

export function getExtraction(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/extraction`,
    token,
    schema: extractionSchema,
  })
}

export function confirmFields(token: string, shipmentId: string, fields: Record<string, unknown>) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/confirm-fields`,
    method: 'POST',
    token,
    body: { fields },
    schema: extractionSchema,
  })
}
