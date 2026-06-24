import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createShipment, getShipment, listShipments, updateShipment } from '@/lib/api/shipments'
import type { ShipmentCreate, ShipmentUpdate } from '@/lib/api/types'

export function useShipmentsQuery(token: string | null | undefined) {
  return useQuery({
    queryKey: ['shipments'],
    enabled: Boolean(token),
    queryFn: () => listShipments(token!),
  })
}

export function useShipmentQuery(token: string | null | undefined, shipmentId: string) {
  return useQuery({
    queryKey: ['shipments', shipmentId],
    enabled: Boolean(token && shipmentId),
    queryFn: () => getShipment(token!, shipmentId),
  })
}

export function useCreateShipmentMutation(token: string | null | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ShipmentCreate) => createShipment(token!, payload),
    onSuccess: (shipment) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      queryClient.setQueryData(['shipments', shipment.id], shipment)
    },
  })
}

export function useUpdateShipmentMutation(token: string | null | undefined, shipmentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ShipmentUpdate) => updateShipment(token!, shipmentId, payload),
    onSuccess: (shipment) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      queryClient.setQueryData(['shipments', shipmentId], shipment)
    },
  })
}
