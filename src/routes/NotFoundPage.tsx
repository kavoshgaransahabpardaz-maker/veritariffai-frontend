import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const error = useRouteError()

  const message = (() => {
    if (!error) {
      return 'The requested page is not available.'
    }

    if (isRouteErrorResponse(error)) {
      return error.statusText || 'The requested page is not available.'
    }

    if (error instanceof Error) {
      return error.message
    }

    return 'The requested page is not available.'
  })()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--page)] px-6">
      <div className="w-full max-w-lg rounded-[2rem] border border-[var(--border)] bg-white p-10 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">Page unavailable</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
        <div className="mt-7 flex justify-center gap-3">
          <Button asChild>
            <Link to="/">Go to shipments</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

