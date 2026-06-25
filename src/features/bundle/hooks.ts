import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api/client'
import { generateBundle, getBundle } from '@/lib/api/bundle'

export function useBundleQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'bundle'],
    enabled: Boolean(token && shipmentId),
    queryFn: async () => {
      try {
        return await getBundle(token!, shipmentId)
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

export function useGenerateBundleMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => generateBundle(token!, shipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments', shipmentId, 'bundle'] })
    },
  })
}
