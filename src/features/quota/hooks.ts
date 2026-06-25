import { useQuery } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/client'
import { getQuota } from '@/lib/api/quota'

export function useQuotaQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'quota'],
    enabled: Boolean(token && shipmentId),
    queryFn: async () => {
      try {
        return await getQuota(token!, shipmentId)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null
        }

        throw error
      }
    },
  })
}
