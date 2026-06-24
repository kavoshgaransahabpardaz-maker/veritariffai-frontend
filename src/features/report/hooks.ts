import { useQuery } from '@tanstack/react-query'
import { getReport } from '@/lib/api/report'

export function useReportQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId, 'report'],
    enabled: Boolean(token && shipmentId),
    queryFn: () => getReport(token!, shipmentId),
  })
}
