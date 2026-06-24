import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/client'
import {
  answerClassification,
  getClassification,
  overrideClassification,
  startClassification,
} from '@/lib/api/classification'

export function useClassificationQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'classification'],
    enabled: Boolean(token && shipmentId),
    queryFn: async () => {
      try {
        return await getClassification(token!, shipmentId)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null
        }

        throw error
      }
    },
  })
}

export function useStartClassificationMutation(token: string | null | undefined, shipmentId: string) {
  return useMutation({
    mutationFn: () => startClassification(token!, shipmentId),
  })
}

export function useAnswerClassificationMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (answer: string) => answerClassification(token!, shipmentId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId, 'classification'] })
    },
  })
}

export function useOverrideClassificationMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { hs_code: string; description?: string }) =>
      overrideClassification(token!, shipmentId, payload),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'classification'], result)
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId] })
    },
  })
}
