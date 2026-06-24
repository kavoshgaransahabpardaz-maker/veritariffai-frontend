import { confidenceMeta, type ConfidenceTier } from '@/lib/confidence'
import { cn } from '@/lib/utils'

type ConfidenceBadgeProps = {
  tier: ConfidenceTier
  reason?: string | null
  className?: string
}

export function ConfidenceBadge({ tier, reason, className }: ConfidenceBadgeProps) {
  const meta = confidenceMeta[tier]
  const Icon = meta.icon

  return (
    <span
      className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold', meta.className, className)}
      title={reason ?? undefined}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  )
}
