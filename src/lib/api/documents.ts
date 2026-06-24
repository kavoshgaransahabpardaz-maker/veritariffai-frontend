import { apiRequest } from '@/lib/api/client'
import {
  documentDetailSchema,
  documentSummaryListSchema,
  genericObjectSchema,
} from '@/lib/api/schemas'
import type { DocType } from '@/lib/api/types'

export function listDocuments(token: string, shipmentId: string) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/documents`,
    token,
    schema: documentSummaryListSchema,
  })
}

export function getDocument(token: string, shipmentId: string, docType: DocType) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/documents/${docType}`,
    token,
    schema: documentDetailSchema,
  })
}

export function generateDocument(token: string, shipmentId: string, docType: DocType) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/documents/${docType}/generate`,
    method: 'POST',
    token,
    schema: documentDetailSchema,
  })
}

export function requestDeclaration(token: string, shipmentId: string, docType: DocType) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/documents/${docType}/request-declaration`,
    method: 'POST',
    token,
    schema: genericObjectSchema,
  })
}

export function certifyDocument(token: string, shipmentId: string, docType: DocType) {
  return apiRequest({
    path: `/api/v1/shipments/${shipmentId}/documents/${docType}/certify`,
    method: 'POST',
    token,
    schema: documentDetailSchema,
  })
}
