import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { normalizeConfidence } from '@/lib/confidence'

type Attribute = {
  name: string
  value: string
  source?: string
  confidence?: string | null
  citation?: string | null
}

type AttributeSummaryProps = {
  attributes: Attribute[] | null | undefined
}

const sourceTagStyle: Record<string, string> = {
  'from MTC': 'bg-[var(--accent-soft)] text-[var(--accent)]',
  'from invoice': 'bg-[var(--surface-strong)] text-[var(--ink-soft)]',
  'you answered': 'bg-[var(--success-soft)] text-[var(--success)]',
}

export function AttributeSummary({ attributes }: AttributeSummaryProps) {
  if (!attributes || attributes.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        What we know
      </p>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <table className="min-w-full divide-y divide-[var(--border)]">
          <thead className="bg-[var(--surface-muted)]">
            <tr className="text-left text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <th className="px-4 py-2.5">Attribute</th>
              <th className="px-4 py-2.5">Value</th>
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-white">
            {attributes.map((attr, index) => (
              <tr key={index} className="align-middle">
                <td className="px-4 py-3 text-sm font-medium text-[var(--ink)]">{attr.name}</td>
                <td className="px-4 py-3">
                  <span className="code-chip text-sm font-semibold text-[var(--ink)]">{attr.value}</span>
                  {attr.citation ? (
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{attr.citation}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {attr.source ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${sourceTagStyle[attr.source] ?? 'bg-[var(--surface-muted)] text-[var(--ink-soft)]'}`}
                    >
                      {attr.source}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {attr.confidence ? (
                    <ConfidenceBadge tier={normalizeConfidence(attr.confidence)} />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
