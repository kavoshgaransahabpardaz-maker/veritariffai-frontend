import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--ink)] px-4 py-2.5 text-white hover:bg-[#1b2f49]',
        secondary:
          'bg-[var(--surface-muted)] px-4 py-2.5 text-[var(--ink)] hover:bg-[var(--surface-strong)]',
        outline:
          'border border-[var(--border)] bg-white px-4 py-2.5 text-[var(--ink)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]',
        ghost: 'px-3 py-2 text-[var(--ink)] hover:bg-[var(--surface-muted)]',
        danger: 'bg-[var(--danger)] px-4 py-2.5 text-white hover:opacity-90',
      },
      size: {
        default: 'h-11',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-2xl px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
