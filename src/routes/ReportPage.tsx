import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { HeadlineChips } from '@/components/common/HeadlineChips'
import { SectionCard } from '@/components/common/SectionCard'
import { useAuth } from '@/features/auth/AuthProvider'
import { useReportQuery } from '@/features/report/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'
import { normalizeConfidence } from '@/lib/confidence'
import { formatLabel, isRecord } from '@/lib/utils'

export function ReportPage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const reportQuery = useReportQuery(auth.tokens?.accessToken, shipment.id)

  const data = reportQuery.data
  const chips = isRecord(data) ? data.chips : undefined
  const sections = isRecord(data) && Array.isArray(data.sections) ? data.sections : []
  const disclaimer = isRecord(data) && typeof data.disclaimer === 'string' ? data.disclaimer : null

  return (
    <div className="space-y-6">
      <SectionCard
        title="Shipment report"
        eyebrow="Big-view report"
        description="This page renders the backend report payload directly and keeps any disclaimer intact."
      >
        {chips ? <HeadlineChips chips={chips} /> : <p className="text-sm text-[var(--muted)]">No headline chips were returned yet.</p>}
      </SectionCard>

      {sections.length ? (
        sections.map((section, index) => {
          const record = isRecord(section) ? section : {}
          const key = typeof record.key === 'string' ? record.key : `section-${index}`
          const confidence =
            typeof record.confidence === 'string' ? normalizeConfidence(record.confidence) : null

          return (
            <SectionCard
              key={key}
              title={formatLabel(key)}
              description="Rendered directly from the report response."
              actions={confidence ? <ConfidenceBadge tier={confidence} /> : null}
            >
              <pre className="overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-xs text-[var(--ink)]">
                {JSON.stringify(record, null, 2)}
              </pre>
            </SectionCard>
          )
        })
      ) : (
        <SectionCard title="Report sections" description="Sections appear after the backend returns report data.">
          <p className="text-sm text-[var(--muted)]">No report sections are available yet for this shipment.</p>
        </SectionCard>
      )}

      {disclaimer ? (
        <SectionCard title="Disclaimer" description="Returned by the backend and shown verbatim.">
          <p className="text-sm text-[var(--muted)]">{disclaimer}</p>
        </SectionCard>
      ) : null}
    </div>
  )
}
