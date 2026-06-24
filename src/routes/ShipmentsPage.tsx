import { ArrowRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { useShipmentsQuery } from '@/features/shipments/hooks'
import { formatDateTime } from '@/lib/utils'

export function ShipmentsPage() {
  const auth = useAuth()
  const shipmentsQuery = useShipmentsQuery(auth.tokens?.accessToken)

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Shipments</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
            Start and complete one shipment at a time.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This initial slice covers login, shipment setup, intake confirmation, guided classification, and VAT-forward cost output against the
            live backend.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/shipments/new">
            <Plus className="mr-2 h-4 w-4" />
            Start a shipment
          </Link>
        </Button>
      </section>

      <SectionCard title="Your shipments" description="Resume a draft or continue an in-progress shipment.">
        {shipmentsQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
            ))}
          </div>
        ) : shipmentsQuery.data?.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {shipmentsQuery.data.map((shipment) => (
              <Link
                key={shipment.id}
                to={`/shipments/${shipment.id}/intake`}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5 transition hover:border-[var(--border-strong)] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--ink)]">{shipment.name}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {shipment.origin_country} to {shipment.destination_country}
                    </p>
                  </div>
                  <StatusPill status={shipment.status} />
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
                  <span className="code-chip rounded-lg bg-white px-2.5 py-1 text-[var(--ink)]">{shipment.lane}</span>
                  <span>Updated {formatDateTime(shipment.updated_at ?? shipment.created_at)}</span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                  Open workspace
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No shipments yet"
            description="Create your first shipment to unlock the intake, classification, and cost workflow."
            action={
              <Button asChild>
                <Link to="/shipments/new">Start a shipment</Link>
              </Button>
            }
          />
        )}
        {shipmentsQuery.error ? (
          <p className="mt-4 text-sm text-[var(--danger)]">Unable to load shipments from the backend right now.</p>
        ) : null}
      </SectionCard>
    </div>
  )
}

