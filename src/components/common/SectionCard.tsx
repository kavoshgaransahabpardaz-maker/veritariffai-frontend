import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionCardProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, description, eyebrow, actions, children, className }: SectionCardProps) {
  return (
    <section className={cn('rounded-[var(--radius)] border border-[var(--border)] bg-white p-6 shadow-sm', className)}>
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 text-xl font-semibold text-[var(--ink)]">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  )
}
