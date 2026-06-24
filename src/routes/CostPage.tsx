import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { useCostQuery } from '@/features/cost/hooks'
import { useExtractionQuery } from '@/features/intake/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'
import { getCost } from '@/lib/api/cost'
import { normalizeConfidence } from '@/lib/confidence'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export function CostPage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const queryClient = useQueryClient()
  const extractionQuery = useExtractionQuery(auth.tokens?.accessToken, shipment.id)
  const costQuery = useCostQuery(auth.tokens?.accessToken, shipment.id)

  const refreshMutation = useMutation({
    mutationFn: () => getCost(auth.tokens!.accessToken, shipment.id, true),
    onSuccess: (result) => {
      queryClient.setQueryData(['shipments', shipment.id, 'cost'], result)
    },
  })

  const extractionConfirmed = Boolean(extractionQuery.data?.confirmed)
  const isIntraEu = shipment.lane === 'EU_EU'

  if (isIntraEu) {
    return (
      <SectionCard
        title="Cost (intra-EU)"
        eyebrow="Simplified"
        description="For EU to EU lanes, the UI collapses the full customs cost breakdown. Render the Intrastat note from the backend where applicable."
      >
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4 text-sm text-[var(--muted)]">
          Lane: <span className="code-chip font-semibold text-[var(--ink)]">{shipment.lane}</span>
        </div>
      </SectionCard>
    )
  }

  return (
    <div className="space-y-6">
      {!extractionConfirmed ? (
        <div className="rounded-[var(--radius)] border border-[var(--warning)]/15 bg-[var(--warning-soft)] px-5 py-4 text-sm text-[var(--warning)]">
          Cost is locked until extracted fields are confirmed. Go back to{' '}
          <Link className="font-semibold underline" to="../intake">
            intake
          </Link>{' '}
          to confirm.
        </div>
      ) : null}

      <SectionCard
        title="Cost"
        eyebrow="VAT-forward"
        description="The client does not compute duty or VAT locally. It renders backend values and disclaimer."
        actions={
          <Button
            variant="outline"
            onClick={() => refreshMutation.mutate()}
            disabled={!extractionConfirmed || refreshMutation.isPending}
          >
            {refreshMutation.isPending ? 'Refreshing...' : 'Refresh from tariff'}
          </Button>
        }
      >
        {costQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
            ))}
          </div>
        ) : costQuery.data ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Import VAT</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">
                  {formatCurrency(costQuery.data.import_vat, shipment.currency)}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">VAT treatment: {costQuery.data.vat_treatment}</p>
              </div>
              <ConfidenceBadge tier={normalizeConfidence(costQuery.data.confidence)} reason={costQuery.data.confidence_reason} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Duty</p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[var(--muted)]">Preferential duty (if origin qualifies)</span>
                    <span className="font-semibold text-[var(--ink)]">
                      {formatCurrency(costQuery.data.duty_preferential, shipment.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[var(--muted)]">MFN fallback</span>
                    <span className="font-semibold text-[var(--ink)]">
                      {formatCurrency(costQuery.data.duty_mfn, shipment.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">As of</p>
                <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{formatDateTime(costQuery.data.as_of)}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Computed {formatDateTime(costQuery.data.computed_at)}
                </p>
                {costQuery.data.intrastat_note ? (
                  <p className="mt-4 text-sm text-[var(--muted)]">{costQuery.data.intrastat_note}</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-5 text-sm text-[var(--muted)]">
              {costQuery.data.disclaimer}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No cost breakdown yet"
            description="Confirm intake fields and complete classification to enable a backend cost computation."
          />
        )}

        {costQuery.error ? (
          <p className="mt-4 text-sm text-[var(--danger)]">Unable to load costs from the backend.</p>
        ) : null}
      </SectionCard>
    </div>
  )
}

