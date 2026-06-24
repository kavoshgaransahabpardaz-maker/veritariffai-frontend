import { apiRequest } from '@/lib/api/client'
import { classificationSchema, qaSchema } from '@/lib/api/schemas'

export function startClassification(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/classify/start`,
    method: 'POST',
    token,
    schema: qaSchema,
  })
}

export function answerClassification(token: string, shipmentId: string, answer: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/classify/answer`,
    method: 'POST',
    token,
    body: { answer },
    schema: qaSchema,
  })
}

export function getClassification(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/classification`,
    token,
    schema: classificationSchema,
  })
}

export function overrideClassification(
  token: string,
  shipmentId: string,
  payload: { hs_code: string; description?: string },
) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/classification`,
    method: 'PUT',
    token,
    body: payload,
    schema: classificationSchema,
  })
}
