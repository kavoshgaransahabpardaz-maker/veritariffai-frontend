import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'

export function AuthCallbackPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [auth.isAuthenticated, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--page)] px-6 text-center">
      <div className="max-w-md rounded-3xl border border-[var(--border)] bg-white px-8 py-10 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Finalising sign-in</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--ink)]">Completing your Google session</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          If tokens were returned in the URL fragment, this page will redirect into the shipment workspace automatically.
        </p>
      </div>
    </div>
  )
}

