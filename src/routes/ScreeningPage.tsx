import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { useScreeningQuery, useRunScreeningMutation } from '@/features/screening/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'
import { normalizeConfidence } from '@/lib/confidence'
import { formatDateTime } from '@/lib/utils'

export function ScreeningPage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const screeningQuery = useScreeningQuery(auth.tokens?.accessToken, shipment.id)
  const runMutation = useRunScreeningMutation(auth.tokens?.accessToken, shipment.id)

  return (
    <SectionCard
      title="Screening"
      eyebrow="Parties and countries"
      description="Run sanctions screening against the backend. Clear outcomes should be explicit, not only warnings."
      actions={
        <Button onClick={() => runMutation.mutate()} disabled={runMutation.isPending}>
          {runMutation.isPending ? 'Running...' : 'Run screening'}
        </Button>
      }
    >
      {screeningQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
          ))}
        </div>
      ) : screeningQuery.data?.length ? (
        <div className="space-y-4">
          {screeningQuery.data.map((result) => (
            <div key={result.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">{result.list_source}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Screened {formatDateTime(result.screened_at)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status={result.outcome} />
                  <ConfidenceBadge tier={normalizeConfidence(result.outcome === 'clear' ? 'high' : 'verify')} />
                </div>
              </div>
              {result.match_json ? (
                <pre className="mt-4 overflow-auto rounded-2xl border border-[var(--border)] bg-white p-4 text-xs text-[var(--ink)]">
                  {JSON.stringify(result.match_json, null, 2)}
                </pre>
              ) : (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  {result.outcome === 'clear'
                    ? 'No sanctions hit was returned for this screening record.'
                    : 'The backend returned a reviewable match payload.'}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No screening results yet"
          description="Run screening to fetch party and country outcomes from the backend."
        />
      )}
      {screeningQuery.error ? (
        <p className="mt-4 text-sm text-[var(--danger)]">Unable to load screening results.</p>
      ) : null}
    </SectionCard>
  )
}
