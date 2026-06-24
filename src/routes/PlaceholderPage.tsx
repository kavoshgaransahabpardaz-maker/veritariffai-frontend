import { SectionCard } from '@/components/common/SectionCard'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <SectionCard title={title} description={description}>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-5 py-4 text-sm text-[var(--muted)]">
        This section is wired after the initial shipment slice is stable.
      </div>
    </SectionCard>
  )
}

