import { ShieldCheck } from 'lucide-react'

type ControlsPanelProps = {
  controls: string[] | null | undefined
}

export function ControlsPanel({ controls }: ControlsPanelProps) {
  const hasControls = controls && controls.length > 0

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Steel controls
      </p>
      {hasControls ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {controls.map((control, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-xl border border-[var(--warning)]/20 bg-[var(--warning-soft)] px-3 py-1 text-xs font-semibold text-[var(--warning)]"
            >
              {control}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
          <span className="text-sm text-[var(--success)]">
            No steel import or export restrictions apply to this code.
          </span>
        </div>
      )}
    </div>
  )
}
