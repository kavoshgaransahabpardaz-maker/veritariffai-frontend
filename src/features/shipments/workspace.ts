import { useOutletContext } from 'react-router-dom'
import type { Shipment } from '@/lib/api/types'

export type WorkspaceContextValue = {
  shipment: Shipment
}

export function useWorkspaceShipment() {
  return useOutletContext<WorkspaceContextValue>()
}
