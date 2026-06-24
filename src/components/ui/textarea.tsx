import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'flex min-h-32 w-full rounded-2xl border border-[var(--border)] bg-white px-3 py-3 text-sm text-[var(--ink)] shadow-sm outline-none placeholder:text-[var(--muted)]',
        className,
      )}
      {...props}
    />
  )
}
