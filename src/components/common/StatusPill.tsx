import { cn, formatLabel } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  clear: 'bg-[var(--success-soft)] text-[var(--success)]',
  ready: 'bg-[var(--success-soft)] text-[var(--success)]',
  certified: 'bg-[var(--success-soft)] text-[var(--success)]',
  hit: 'bg-[var(--danger-soft)] text-[var(--danger)]',
  blocked: 'bg-[var(--danger-soft)] text-[var(--danger)]',
  review: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  pending: 'bg-[var(--surface-muted)] text-[var(--ink-soft)]',
  not_started: 'bg-[var(--surface-muted)] text-[var(--ink-soft)]',
  needs_input: 'bg-[var(--warning-soft)] text-[var(--warning)]',
  in_progress: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  draft: 'bg-[var(--surface-muted)] text-[var(--ink-soft)]',
  done: 'bg-[var(--success-soft)] text-[var(--success)]',
}

type StatusPillProps = {
  status: string | null | undefined
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const normalized = status ?? 'pending'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        statusStyles[normalized] ?? 'bg-[var(--surface-muted)] text-[var(--ink-soft)]',
        className,
      )}
    >
      {formatLabel(normalized)}
    </span>
  )
}
