import { formatPercent } from '@/lib/utils'

type MarginBarProps = {
  nonOriginatingPct: string | null
  capPct: string | null
  marginPct: string | null
}

export function MarginBar({ nonOriginatingPct, capPct, marginPct }: MarginBarProps) {
  const used = Number(nonOriginatingPct ?? 0)
  const cap = Number(capPct ?? 0)
  const margin = Number(marginPct ?? 0)

  const usedWidth = Number.isFinite(used) ? Math.max(0, Math.min(used, 100)) : 0
  const capWidth = Number.isFinite(cap) ? Math.max(0, Math.min(cap, 100)) : 0
  return (
    <div className="space-y-3">
      <div className="relative h-5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
        <div className="h-full bg-[var(--accent)]" style={{ width: `${usedWidth}%` }} />
        <div
          className="absolute inset-y-0 w-0.5 bg-[var(--danger)]"
          style={{ left: `${capWidth}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-3">
        <p>Non-originating: <span className="font-semibold text-[var(--ink)]">{formatPercent(nonOriginatingPct)}</span></p>
        <p>Rule cap: <span className="font-semibold text-[var(--ink)]">{formatPercent(capPct)}</span></p>
        <p>Margin: <span className="font-semibold text-[var(--ink)]">{formatPercent(Number.isFinite(margin) ? String(margin) : marginPct ?? undefined)}</span></p>
      </div>
    </div>
  )
}
