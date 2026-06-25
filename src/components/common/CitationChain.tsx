type Citation = {
  text: string
  source_ref?: string | null
}

type CitationChainProps = {
  citations: Citation[] | null | undefined
}

export function CitationChain({ citations }: CitationChainProps) {
  if (!citations || citations.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-[var(--ink)]">Sources</h4>
      <div className="space-y-2">
        {citations.map((citation, index) => (
          <div
            key={index}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3"
          >
            <p className="text-sm text-[var(--ink)]">{citation.text}</p>
            {citation.source_ref ? (
              <p className="mt-1 text-xs text-[var(--muted)] font-mono">{citation.source_ref}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}