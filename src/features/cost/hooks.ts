import { useQuery } from '@tanstack/react-query'
import { getCost } from '@/lib/api/cost'

export function useCostQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'cost'],
    enabled: Boolean(token && shipmentId),
    queryFn: () => getCost(token!, shipmentId),
  })
}
