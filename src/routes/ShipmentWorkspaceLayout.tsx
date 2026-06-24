import { NavLink, Outlet, useParams } from 'react-router-dom'
import { CodeChip } from '@/components/common/CodeChip'
import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusPill } from '@/components/common/StatusPill'
import { useAuth } from '@/features/auth/AuthProvider'
import { useShipmentQuery } from '@/features/shipments/hooks'
import { cn } from '@/lib/utils'

const stepItems = [
  { key: 'intake', label: 'Intake' },
  { key: 'classification', label: 'Classification' },
  { key: 'screening', label: 'Screening' },
  { key: 'cost', label: 'Cost' },
  { key: 'origin', label: 'Origin' },
  { key: 'documents', label: 'Documents' },
  { key: 'report', label: 'Report' },
]

export function ShipmentWorkspaceLayout() {
  const { shipmentId = '' } = useParams()
  const auth = useAuth()
  const shipmentQuery = useShipmentQuery(auth.tokens?.accessToken, shipmentId)

  if (shipmentQuery.isLoading) {
    return <div className="h-80 animate-pulse rounded-[2rem] bg-[var(--surface-muted)]" />
  }

  if (!shipmentQuery.data) {
    return <EmptyState title="Shipment not available" description="The selected shipment could not be loaded from the backend." />
  }

  const shipment = shipmentQuery.data
  const isIntraEu = shipment.lane === 'EU_EU'

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Shipment workspace</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--ink)]">{shipment.name}</h1>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {shipment.origin_country} to {shipment.destination_country}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CodeChip value={shipment.lane} />
            <StatusPill status={shipment.status} />
          </div>
        </div>
      </section>

      {isIntraEu ? (
        <SectionCard
          title="Intra-EU simplified state"
          description="This lane collapses the customs workflow. The app should present the simplified no-customs path instead of the full guided step rail."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-medium text-[var(--ink)]">Customs position</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Free circulation, no customs declarations in this slice.</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-medium text-[var(--ink)]">What stays relevant</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Commercial data quality, VAT mechanics, and any Intrastat note returned by the backend.</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-medium text-[var(--ink)]">Next milestone</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Render the backend report and the reduced workflow explicitly for EU to EU movements.</p>
            </div>
          </div>
        </SectionCard>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[var(--radius)] border border-[var(--border)] bg-white p-4 shadow-sm">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Workflow</p>
            <nav className="mt-4 space-y-2">
              {stepItems.map((step) => (
                <NavLink
                  key={step.key}
                  to={`/shipments/${shipment.id}/${step.key}`}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-2xl border border-transparent px-3 py-3 text-sm transition',
                      isActive
                        ? 'border-[var(--border)] bg-[var(--surface-muted)] text-[var(--ink)]'
                        : 'text-[var(--ink-soft)] hover:bg-[var(--surface-muted)]',
                    )
                  }
                >
                  <span>{step.label}</span>
                  <StatusPill status={shipment.section_statuses[step.key] ?? 'pending'} />
                </NavLink>
              ))}
            </nav>
          </aside>
          <Outlet context={{ shipment }} />
        </div>
      )}
    </div>
  )
}

