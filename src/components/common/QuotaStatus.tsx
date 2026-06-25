type QuotaStatusProps = {
  status: 'available' | 'low' | 'exhausted'
  headroom?: string | null
}

export function QuotaStatus({ status, headroom }: QuotaStatusProps) {
  const badgeClass =
    status === 'available' ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]' :
    status === 'low' ? 'border-[var(--warning)] bg-[var(--warning-soft)] text-[var(--warning)]' :
    'border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)]'

  const label =
    status === 'available' ? 'Quota available' :
    status === 'low' ? 'Quota low' :
    'Quota exhausted'

  return (
    <div className="space-y-3">
      <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${badgeClass}`}>
        {label}
      </div>
      {headroom && (
        <p className="text-sm text-[var(--muted)]">
          Headroom: {headroom}
        </p>
      )}
    </div>
  )
}
