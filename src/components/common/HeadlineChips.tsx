import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { normalizeConfidence } from '@/lib/confidence'
import { formatLabel, isRecord } from '@/lib/utils'

type HeadlineChipsProps = {
  chips: unknown
}

export function HeadlineChips({ chips }: HeadlineChipsProps) {
  if (!isRecord(chips)) {
    return null
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {Object.entries(chips).map(([key, value]) => {
        const confidence =
          isRecord(value) && typeof value.confidence === 'string'
            ? normalizeConfidence(value.confidence)
            : null
        const display = isRecord(value) && 'value' in value ? value.value : value

        return (
          <div key={key} className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                {formatLabel(key)}
              </p>
              {confidence ? <ConfidenceBadge tier={confidence} /> : null}
            </div>
            <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
              {typeof display === 'string' ? display : JSON.stringify(display)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
