import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react'

export type ConfidenceTier = 'high' | 'verify' | 'needs_human'

export const confidenceMeta: Record<
  ConfidenceTier,
  {
    label: string
    icon: LucideIcon
    className: string
  }
> = {
  high: {
    label: 'Official',
    icon: ShieldCheck,
    className:
      'border-[color:var(--success)]/20 bg-[color:var(--success-soft)] text-[color:var(--success)]',
  },
  verify: {
    label: 'Verify',
    icon: AlertTriangle,
    className:
      'border-[color:var(--warning)]/20 bg-[color:var(--warning-soft)] text-[color:var(--warning)]',
  },
  needs_human: {
    label: 'Needs human review',
    icon: ShieldAlert,
    className:
      'border-[color:var(--danger)]/20 bg-[color:var(--danger-soft)] text-[color:var(--danger)]',
  },
}

export function normalizeConfidence(value: string | null | undefined): ConfidenceTier {
  if (value === 'high' || value === 'verify' || value === 'needs_human') {
    return value
  }

  return 'verify'
}
