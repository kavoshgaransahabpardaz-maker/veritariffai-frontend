import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

type CitationRef = {
  ref?: string
  text: string
}

// Polymorphic: either legacy flat { text, source_ref } or new gate { gate_id, outcome, citations[] }
type CitationItem = {
  text?: string
  source_ref?: string | null
  gate_id?: string
  outcome?: string
  citations?: CitationRef[]
}

type CitationChainProps = {
  citations: CitationItem[] | null | undefined
}

export function CitationChain({ citations }: CitationChainProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  if (!citations || citations.length === 0) return null

  function toggle(index: number) {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const isGateFormat = 'gate_id' in citations[0]

  if (isGateFormat) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Decision chain
        </h4>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          {citations.map((item, index) => {
            const isExpanded = Boolean(expanded[index])
            const hasCitations = item.citations && item.citations.length > 0

            return (
              <div key={index} className="border-b border-[var(--border)] last:border-b-0">
                <div className="flex items-start gap-3 bg-[var(--surface-muted)] px-4 py-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.gate_id ? (
                        <span className="code-chip rounded-lg bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-[var(--muted)]">
                          {item.gate_id}
                        </span>
                      ) : null}
                      {item.outcome ? (
                        <span className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-semibold text-white">
                          {item.outcome}
                        </span>
                      ) : null}
                    </div>
                    {hasCitations ? (
                      <button
                        type="button"
                        onClick={() => toggle(index)}
                        className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
                      >
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        {isExpanded ? 'Hide legal basis' : `Show legal basis (${item.citations!.length})`}
                      </button>
                    ) : null}
                  </div>
                </div>
                {hasCitations && isExpanded ? (
                  <div className="divide-y divide-[var(--border)] bg-white">
                    {item.citations!.map((ref, rIdx) => (
                      <div key={rIdx} className="px-4 py-3">
                        {ref.ref ? (
                          <p className="code-chip mb-1 text-xs font-semibold text-[var(--muted)]">{ref.ref}</p>
                        ) : null}
                        <p className="text-sm text-[var(--ink)]">{ref.text}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Legacy flat format
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Legal basis
      </h4>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        {citations.map((citation, index) => {
          const isExpanded = Boolean(expanded[index])
          const hasRef = Boolean(citation.source_ref)

          return (
            <div key={index} className="border-b border-[var(--border)] last:border-b-0">
              <div className="flex items-start gap-3 bg-[var(--surface-muted)] px-4 py-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-semibold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--ink)]">{citation.text}</p>
                  {hasRef ? (
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className="mt-1.5 flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline"
                    >
                      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      {isExpanded ? 'Hide reference' : 'Show reference'}
                    </button>
                  ) : null}
                </div>
              </div>
              {hasRef && isExpanded ? (
                <div className="bg-white px-4 py-3">
                  <p className="code-chip text-xs text-[var(--ink-soft)]">{citation.source_ref}</p>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
