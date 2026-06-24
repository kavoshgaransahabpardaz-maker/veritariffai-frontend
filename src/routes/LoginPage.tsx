import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { getGoogleAuthUrl } from '@/lib/api/auth'

export function LoginPage() {
  const auth = useAuth()
  const authUrlQuery = useQuery({
    queryKey: ['auth', 'google-url'],
    queryFn: getGoogleAuthUrl,
  })

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen bg-[var(--page)] px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--ink)] px-8 py-10 text-white shadow-sm sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/65">Guided completion</p>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
            Build a shipment with calm, explicit trade decisions.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78">
            Classify goods, review extraction fields, surface VAT before duty, and keep confidence visible wherever the backend says a
            judgment needs verification.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              'Confirm extraction before any downstream calculation',
              'Render official data with clear confidence signals',
              'Keep certification as an explicit user action',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/12 bg-white/6 p-4 text-sm text-white/85">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-white p-8 shadow-sm sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Live backend connected
          </div>
          <h2 className="mt-6 text-3xl font-semibold text-[var(--ink)]">Sign in with Google</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The current backend Swagger exposes Google OAuth endpoints, so this frontend slice uses that auth contract.
          </p>
          <Button
            className="mt-8 w-full justify-between"
            size="lg"
            onClick={() => {
              if (authUrlQuery.data?.auth_url) {
                window.location.assign(authUrlQuery.data.auth_url)
              }
            }}
            disabled={authUrlQuery.isLoading || !authUrlQuery.data?.auth_url}
          >
            Continue with Google
            <ArrowRight className="h-4 w-4" />
          </Button>
          {authUrlQuery.error ? (
            <p className="mt-4 text-sm text-[var(--danger)]">
              Unable to load the Google login URL. Check the backend auth configuration and try again.
            </p>
          ) : null}
          <p className="mt-6 text-xs leading-5 text-[var(--muted)]">
            Expected frontend callback route:{' '}
            <span className="code-chip rounded bg-[var(--surface-muted)] px-2 py-1 text-[var(--ink)]">/auth/callback</span>
          </p>
        </section>
      </div>
    </div>
  )
}

