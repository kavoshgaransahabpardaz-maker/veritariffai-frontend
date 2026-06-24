import { apiRequest } from '@/lib/api/client'
import { shipmentListSchema, shipmentSchema } from '@/lib/api/schemas'
import type { ShipmentCreate, ShipmentUpdate } from '@/lib/api/types'

export function listShipments(token: string) {
  return apiRequest({
    path: '/api/v1/shipments/',
    token,
    schema: shipmentListSchema,
  })
}

export function createShipment(token: string, body: ShipmentCreate) {
  return apiRequest({
    path: '/api/v1/shipments/',
    method: 'POST',
    token,
    body,
    schema: shipmentSchema,
  })
}

export function getShipment(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}`,
    token,
    schema: shipmentSchema,
  })
}

export function updateShipment(token: string, shipmentId: string, body: ShipmentUpdate) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}`,
    method: 'PATCH',
    token,
    body,
    schema: shipmentSchema,
  })
}
