import { FieldConfirmTable } from '@/components/common/FieldConfirmTable'
import { HumanReviewBanner } from '@/components/common/HumanReviewBanner'
import { isRecord } from '@/lib/utils'

type MtcAuditPanelProps = {
  heatNumber?: string | null
  meltCountry?: string | null
  pourCountry?: string | null
  chemicalComposition?: Record<string, unknown> | null
  mechanicalProperties?: Record<string, unknown> | null
  perFieldConfidence?: Record<string, unknown> | null
  status?: string
}

export function MtcAuditPanel({
  heatNumber,
  meltCountry,
  pourCountry,
  chemicalComposition,
  mechanicalProperties,
  perFieldConfidence,
  status,
}: MtcAuditPanelProps) {
  const fields: Record<string, unknown> = {
    'Heat Number': heatNumber,
    'Melt Country': meltCountry,
    'Pour Country': pourCountry,
    ...(chemicalComposition && Object.fromEntries(
      Object.entries(chemicalComposition).map(([k, v]) => [`Chemical: ${k}`, v])
    )),
    ...(mechanicalProperties && Object.fromEntries(
      Object.entries(mechanicalProperties).map(([k, v]) => [`Mechanical: ${k}`, v])
    )),
  }

  if (status === 'needs_human_review') {
    return (
      <div className="space-y-4">
        <HumanReviewBanner message="MTC extraction needs human review." />
        {Object.keys(fields).length > 0 ? (
          <FieldConfirmTable
            values={fields}
            confidenceByField={isRecord(perFieldConfidence) ? perFieldConfidence : null}
            onChange={() => {}}
          />
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-[var(--ink)]">Extracted MTC Data</h4>
      </div>
      {Object.keys(fields).length > 0 ? (
        <FieldConfirmTable
          values={fields}
          confidenceByField={isRecord(perFieldConfidence) ? perFieldConfidence : null}
          onChange={() => {}}
        />
      ) : (
        <p className="text-sm text-[var(--muted)]">No data extracted yet.</p>
      )}
    </div>
  )
}