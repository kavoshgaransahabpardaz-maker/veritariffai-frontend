import { apiRequest } from '@/lib/api/client'
import { mtcSchema } from '@/lib/api/schemas'

export function uploadMtc(token: string, shipmentId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/intake/mtc`,
    method: 'POST',
    token,
    body: formData,
  })
}

export function getMtc(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/mtc`,
    token,
    schema: mtcSchema,
  })
}
