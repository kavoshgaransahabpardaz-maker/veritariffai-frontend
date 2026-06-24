import { cn } from '@/lib/utils'

type CodeChipProps = {
  value: string
  className?: string
}

export function CodeChip({ value, className }: CodeChipProps) {
  return (
    <span
      className={cn(
        'code-chip inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-sm font-medium text-[var(--ink)]',
        className,
      )}
    >
      {value}
    </span>
  )
}
