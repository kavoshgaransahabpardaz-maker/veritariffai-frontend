import { CheckCircle, Info } from 'lucide-react'
import { CitationChain } from '@/components/common/CitationChain'
import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { type ConfidenceTier } from '@/lib/confidence'
import type { Citation } from '@/lib/api/types'

type CodeResultProps = {
  hsCode: string
  description?: string | null
  confidence: ConfidenceTier
  confidenceReason?: string | null
  autoResolved?: boolean | null
  citationChain?: Citation[] | null
  whyText?: string | null
  treeVersion?: string | null
  nomenclatureVersion?: string | null
  onConfirm?: () => void
  isConfirming?: boolean
}

export function CodeResult({
  hsCode,
  description,
  confidence,
  confidenceReason,
  autoResolved,
  citationChain,
  whyText,
  treeVersion,
  nomenclatureVersion,
  onConfirm,
  isConfirming,
}: CodeResultProps) {
  const hasVersionInfo = treeVersion || nomenclatureVersion

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {autoResolved ? 'Auto-resolved commodity code' : 'Candidate commodity code'}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="code-chip text-2xl font-semibold tracking-wider text-[var(--ink)]">
                {hsCode}
              </span>
              {autoResolved ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--success)]">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Auto-resolved
                </span>
              ) : null}
            </div>
            {description ? (
              <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
            ) : null}
            {hasVersionInfo ? (
              <div
                className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted)]"
                title={`Decision tree: ${treeVersion ?? '—'} · Nomenclature: ${nomenclatureVersion ?? '—'}`}
              >
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>Tree v{treeVersion ?? '—'} · Nomenclature {nomenclatureVersion ?? '—'}</span>
              </div>
            ) : null}
          </div>
          <ConfidenceBadge tier={confidence} reason={confidenceReason ?? undefined} />
        </div>

        {confidence === 'verify' && onConfirm ? (
          <div className="mt-4 rounded-xl border border-[var(--warning)]/20 bg-[var(--warning-soft)] p-4">
            <p className="text-sm text-[var(--warning)]">
              Review the legal basis below before confirming. Confirmation is a deliberate act — it cannot be undone automatically.
            </p>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirming}
              className="mt-3 inline-flex items-center rounded-xl bg-[var(--warning)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isConfirming ? 'Confirming…' : 'Confirm this code'}
            </button>
          </div>
        ) : null}
      </div>

      {whyText ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Why this code</p>
          <p className="mt-2 text-sm text-[var(--ink)]">{whyText}</p>
        </div>
      ) : null}

      <CitationChain citations={citationChain} />
    </div>
  )
}
