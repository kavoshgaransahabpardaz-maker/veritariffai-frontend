import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getScreening, runScreening } from '@/lib/api/screening'

export function useScreeningQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'screening'],
    enabled: Boolean(token && shipmentId),
    queryFn: () => getScreening(token!, shipmentId),
  })
}

export function useRunScreeningMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => runScreening(token!, shipmentId),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipmentId, 'screening'], result)
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId] })
    },
  })
}
