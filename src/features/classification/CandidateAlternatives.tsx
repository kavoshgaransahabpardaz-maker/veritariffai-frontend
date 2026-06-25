import { Button } from '@/components/ui/button'

type Candidate = {
  hs_code: string
  description?: string | null
  rationale?: string | null
}

type CandidateAlternativesProps = {
  alternatives: Candidate[]
  onSelect: (hsCode: string) => void
  isSelecting: boolean
}

export function CandidateAlternatives({ alternatives, onSelect, isSelecting }: CandidateAlternativesProps) {
  if (alternatives.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Alternative codes
      </p>
      <div className="space-y-2">
        {alternatives.map((candidate) => (
          <div
            key={candidate.hs_code}
            className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4"
          >
            <div className="min-w-0">
              <span className="code-chip text-base font-semibold text-[var(--ink)]">
                {candidate.hs_code}
              </span>
              {candidate.description ? (
                <p className="mt-1 text-sm text-[var(--muted)]">{candidate.description}</p>
              ) : null}
              {candidate.rationale ? (
                <p className="mt-1 text-xs italic text-[var(--muted)]">{candidate.rationale}</p>
              ) : null}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(candidate.hs_code)}
              disabled={isSelecting}
            >
              Use this code
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
