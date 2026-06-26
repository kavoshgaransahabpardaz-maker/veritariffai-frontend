import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/client'
import { evaluateMeltAndPour, evaluateOrigin, getOriginResult, getOriginRule, setBom } from '@/lib/api/origin'
import type { BomItemCreate } from '@/lib/api/types'

export function useOriginRuleQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'origin-rule'],
    enabled: Boolean(token && shipmentId),
    queryFn: () => getOriginRule(token!, shipmentId),
  })
}

export function useOriginResultQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'origin-result'],
    enabled: Boolean(token && shipmentId),
    queryFn: async () => {
      try {
        return await getOriginResult(token!, shipmentId)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null
        }

        throw error
      }
    },
  })
}

export function useSetBomMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items: BomItemCreate[]) => setBom(token!, shipmentId, items),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'bom'], result)
    },
  })
}

export function useEvaluateOriginMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (insufficientOperationsAttested: boolean) =>
      evaluateOrigin(token!, shipmentId, insufficientOperationsAttested),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'origin-result'], result)
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId] })
    },
  })
}

export function useMeltAndPourMutation(token: string | null | undefined, shipmentId: string) {
  return useMutation({
    mutationFn: () => evaluateMeltAndPour(token!, shipmentId),
  })
}
