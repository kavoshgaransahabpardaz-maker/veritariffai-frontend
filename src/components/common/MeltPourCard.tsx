import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { CitationChain } from '@/components/common/CitationChain'
import { normalizeConfidence } from '@/lib/confidence'

type MeltPourCardProps = {
  meltCountry?: string | null
  pourCountry?: string | null
  qualifies?: boolean | null
  basis?: string
  confidence?: string
  disclaimer?: string
  citations?: Array<{ text: string; source_ref?: string | null }> | null
}

export function MeltPourCard({
  meltCountry,
  pourCountry,
  qualifies,
  basis,
  confidence,
  disclaimer,
  citations,
}: MeltPourCardProps) {
  const statusColor =
    qualifies === true ? 'text-[var(--success)]' :
    qualifies === false ? 'text-[var(--danger)]' :
    'text-[var(--warning)]'

  const statusLabel =
    qualifies === true ? 'Qualifies' :
    qualifies === false ? 'Does not qualify' :
    'Needs review'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {confidence ? (
          <ConfidenceBadge
            tier={normalizeConfidence(confidence)}
            reason="Based on MTC extraction"
          />
        ) : null}
        <span className={`text-lg font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Melt Country</p>
          <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
            {meltCountry || 'Not extracted'}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Pour Country</p>
          <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
            {pourCountry || 'Not extracted'}
          </p>
        </div>
      </div>

      {basis ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4">
          <p className="text-sm font-semibold text-[var(--ink)]">Basis</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{basis}</p>
        </div>
      ) : null}

      <CitationChain citations={citations} />

      {disclaimer ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4">
          <p className="text-xs text-[var(--muted)]">{disclaimer}</p>
        </div>
      ) : null}
    </div>
  )
}