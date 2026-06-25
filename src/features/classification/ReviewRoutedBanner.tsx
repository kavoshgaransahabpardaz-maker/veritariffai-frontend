import { ClipboardCheck } from 'lucide-react'

type ReviewRoutedBannerProps = {
  reason?: string | null
}

export function ReviewRoutedBanner({ reason }: ReviewRoutedBannerProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
          <ClipboardCheck className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Expert review
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--ink)]">
            This classification has been routed for expert review
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {reason ??
              'The automated classifier could not resolve this commodity code with sufficient confidence. A trade specialist will review it — this is a quality assurance step, not a failure.'}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'What you can do', body: 'Continue with other sections — intake, cost, and screening do not depend on a resolved code.' },
              { label: 'Expected turnaround', body: 'Expert review typically completes within 1 business day.' },
              { label: 'Override available', body: 'If you already know the correct HS code, use the manual override below to proceed immediately.' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <p className="text-xs font-semibold text-[var(--ink)]">{item.label}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
