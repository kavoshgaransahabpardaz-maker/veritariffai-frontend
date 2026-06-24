import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/client'
import { confirmFields, describeShipment, getExtraction, uploadInvoice } from '@/lib/api/intake'

export function useExtractionQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'extraction'],
    enabled: Boolean(token && shipmentId),
    queryFn: async () => {
      try {
        return await getExtraction(token!, shipmentId)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null
        }

        throw error
      }
    },
    refetchInterval(query) {
      return query.state.data?.status === 'pending' ? 3000 : false
    },
  })
}

export function useDescribeShipmentMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (description: string) => describeShipment(token!, shipmentId, description),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'extraction'], result)
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId] })
    },
  })
}

export function useUploadInvoiceMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadInvoice(token!, shipmentId, file),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'extraction'], result)
    },
  })
}

export function useConfirmFieldsMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fields: Record<string, unknown>) => confirmFields(token!, shipmentId, fields),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'extraction'], result)
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId] })
    },
  })
}
