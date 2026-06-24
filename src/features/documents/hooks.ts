import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/client'
import {
  certifyDocument,
  generateDocument,
  getDocument,
  listDocuments,
  requestDeclaration,
} from '@/lib/api/documents'
import type { DocType } from '@/lib/api/types'

export function useDocumentsQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'documents'],
    enabled: Boolean(token && shipmentId),
    queryFn: () => listDocuments(token!, shipmentId),
  })
}

export function useDocumentQuery(
  token: string | null | undefined,
  shipmentId: string,
  docType: DocType | null,
) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'documents', docType],
    enabled: Boolean(token && shipmentId && docType),
    queryFn: async () => {
      try {
        return await getDocument(token!, shipmentId, docType!)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null
        }

        throw error
      }
    },
  })
}

export function useGenerateDocumentMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (docType: DocType) => generateDocument(token!, shipmentId, docType),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'documents', result.doc_type], result)
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId, 'documents'] })
    },
  })
}

export function useRequestDeclarationMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (docType: DocType) => requestDeclaration(token!, shipmentId, docType),
    onSuccess: (_, docType) => {
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId, 'documents', docType] })
    },
  })
}

export function useCertifyDocumentMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (docType: DocType) => certifyDocument(token!, shipmentId, docType),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'documents', result.doc_type], result)
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId, 'documents'] })
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId] })
    },
  })
}
