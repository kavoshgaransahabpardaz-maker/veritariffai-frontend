import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { Input } from '@/components/ui/input'
import { normalizeConfidence } from '@/lib/confidence'
import { formatLabel, isRecord } from '@/lib/utils'

type FieldConfirmTableProps = {
  values: Record<string, unknown>
  confidenceByField?: Record<string, unknown> | null
  onChange: (key: string, value: string) => void
}

function getFieldMeta(value: unknown) {
  if (typeof value === 'string') {
    return { tier: normalizeConfidence(value), reason: undefined as string | undefined }
  }

  if (isRecord(value)) {
    const rawTier = typeof value.confidence === 'string' ? value.confidence : 'verify'
    const reason = typeof value.reason === 'string' ? value.reason : undefined
    return { tier: normalizeConfidence(rawTier), reason }
  }

  return { tier: normalizeConfidence(undefined), reason: undefined as string | undefined }
}

export function FieldConfirmTable({ values, confidenceByField, onChange }: FieldConfirmTableProps) {
  const entries = Object.entries(values)

  if (!entries.length) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <table className="min-w-full divide-y divide-[var(--border)]">
        <thead className="bg-[var(--surface-muted)]">
          <tr className="text-left text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            <th className="px-4 py-3">Field</th>
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">Confidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] bg-white">
          {entries.map(([key, value]) => {
            const fieldMeta = getFieldMeta(confidenceByField?.[key])

            return (
              <tr key={key} className="align-top">
                <td className="px-4 py-3 text-sm font-medium text-[var(--ink)]">{formatLabel(key)}</td>
                <td className="px-4 py-3">
                  <Input value={String(value ?? '')} onChange={(event) => onChange(key, event.target.value)} />
                </td>
                <td className="px-4 py-3">
                  <ConfidenceBadge tier={fieldMeta.tier} reason={fieldMeta.reason} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
