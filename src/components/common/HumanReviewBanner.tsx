type HumanReviewBannerProps = {
  message?: string
}

export function HumanReviewBanner({ message }: HumanReviewBannerProps) {
  return (
    <div className="rounded-2xl border border-[var(--info)]/15 bg-[var(--info-soft)] px-4 py-4">
      <h4 className="font-medium text-[var(--info)]">
        Human review in progress
      </h4>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {message || "This extraction has been flagged for human review. We'll notify you when it's complete."}
      </p>
    </div>
  )
}
