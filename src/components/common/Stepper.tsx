import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'

type StepperItem = {
  key: string
  title: string
  description: string
  status: string
  actionLabel?: string
  onAction?: () => void
  disabled?: boolean
}

type StepperProps = {
  items: StepperItem[]
}

export function Stepper({ items }: StepperProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.key} className="relative rounded-2xl border border-[var(--border)] bg-white p-4">
          {index < items.length - 1 ? (
            <div className="absolute left-8 top-14 h-8 w-px bg-[var(--border)]" aria-hidden="true" />
          ) : null}
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-semibold text-[var(--ink)]">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-[var(--ink)]">{item.title}</h3>
                <StatusPill status={item.status} />
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.description}</p>
              {item.actionLabel && item.onAction ? (
                <div className="mt-4">
                  <Button variant="outline" onClick={item.onAction} disabled={item.disabled}>
                    {item.actionLabel}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
