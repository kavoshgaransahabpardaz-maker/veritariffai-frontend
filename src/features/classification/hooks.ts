import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/client'
import {
  answerClassification,
  getClassification,
  overrideClassification,
  startClassification,
} from '@/lib/api/classification'
import type { Classification, QAResponse } from '@/lib/api/types'

export function useClassificationQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'classification'],
    enabled: Boolean(token && shipmentId),
    queryFn: async (): Promise<Classification | null> => {
      try {
        return (await getClassification(token!, shipmentId)) as Classification
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
    mutationFn: (): Promise<QAResponse> =>
      startClassification(token!, shipmentId) as Promise<QAResponse>,
  })
}

export function useAnswerClassificationMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (answer: string): Promise<QAResponse> =>
      answerClassification(token!, shipmentId, answer) as Promise<QAResponse>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId, 'classification'] })
    },
  })
}

export function useOverrideClassificationMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { hs_code: string; description?: string }): Promise<Classification> =>
      overrideClassification(token!, shipmentId, payload) as Promise<Classification>,
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'classification'], result)
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId] })
    },
  })
}
