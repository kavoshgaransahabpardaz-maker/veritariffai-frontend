import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  FileCheck,
  FileText,
  Layers,
  MapPin,
  Package,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { getGoogleAuthUrl } from '@/lib/api/auth'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Steel Classification',
    body: 'Gate-by-gate HS code resolution from MTC composition data. Confidence tiers tell you exactly when the code is certain and when to review.',
  },
  {
    icon: FileText,
    title: 'MTC Processing',
    body: 'Upload a mill test certificate and extract heat number, melt/pour countries, chemical composition, and mechanical properties in seconds.',
  },
  {
    icon: MapPin,
    title: 'Rules of Origin',
    body: 'TCA melt-and-pour determination with full citation chain. Qualifies against ORIG-4 automatically — always VERIFY before you commit.',
  },
  {
    icon: Layers,
    title: 'Duty & Cost Calculation',
    body: 'Preferential and MFN duty side by side. Safeguard quota headroom, import VAT, and intrastat notes — all backed by official tariff data.',
  },
  {
    icon: Shield,
    title: 'Sanctions Screening',
    body: 'Screen parties against live restricted-party lists. Clear, hit, or review outcomes with match evidence kept on record.',
  },
  {
    icon: FileCheck,
    title: "Documents & Barrister's Bundle",
    body: 'Generate Statement of Origin, MTC audit report, and a SHA-256 sealed barrister\'s bundle. Certification is always an explicit act.',
  },
]

const STEPS = [
  { n: '01', label: 'Intake', sub: 'Upload invoice + MTC, confirm extracted fields' },
  { n: '02', label: 'Classify', sub: 'AI resolves HS code through gate questions' },
  { n: '03', label: 'Screen', sub: 'Party and cargo sanctions check' },
  { n: '04', label: 'Cost', sub: 'Duty, VAT, quota, and safeguard rates' },
  { n: '05', label: 'Certify', sub: 'Origin + documents + sealed evidence bundle' },
]

const STATS = [
  { value: '< 2 min', label: 'From MTC upload to HS code' },
  { value: '99%+', label: 'Classification accuracy on steel grades' },
  { value: '100%', label: 'Audit trail — every decision cited' },
]

export function LoginPage() {
  const auth = useAuth()
  const authUrlQuery = useQuery({
    queryKey: ['auth', 'google-url'],
    queryFn: getGoogleAuthUrl,
  })

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleSignIn() {
    if (authUrlQuery.data?.auth_url) {
      window.location.assign(authUrlQuery.data.auth_url)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[var(--ink)]" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif' }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-sm font-semibold tracking-tight text-[var(--ink)]">VeriTariff AI</span>
          </div>
          <button
            type="button"
            onClick={handleSignIn}
            disabled={authUrlQuery.isLoading || !authUrlQuery.data?.auth_url}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-[var(--ink)] px-5 text-xs font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            Sign in
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-[var(--ink)] px-6 pb-32 pt-28 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/70">
            <Zap className="h-3.5 w-3.5 text-[var(--accent)]" />
            Steel trade compliance infrastructure
          </div>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Trade compliance.
            <br />
            <span className="text-white/50">Finally intelligent.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/60">
            VeriTariff AI takes a steel shipment from raw MTC to certified customs documents — classifying HS codes,
            verifying origin, calculating duty, and assembling a sealed evidence bundle in minutes.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleSignIn}
              disabled={authUrlQuery.isLoading || !authUrlQuery.data?.auth_url}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[var(--ink)] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold text-white/80 transition-colors hover:border-white/40"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-[var(--border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="px-10 py-12 text-center">
              <p className="text-4xl font-semibold tracking-tight text-[var(--ink)]">{s.value}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[var(--surface-muted)] px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Capabilities</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
              Everything your customs team needs. Nothing it doesn't.
            </h2>
          </div>
          <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white px-8 py-8">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
                  <Icon className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-white px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Workflow</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
              Five steps from shipment to evidence file.
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-[2.3rem] top-6 hidden h-[calc(100%-3rem)] w-px bg-[var(--border)] lg:block" />
            <div className="space-y-0 divide-y divide-[var(--border)] lg:divide-y-0 lg:space-y-6">
              {STEPS.map((step) => (
                <div key={step.n} className="flex items-start gap-6 py-6 lg:py-0">
                  <div className="relative z-10 flex h-[4.6rem] w-[4.6rem] shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-white text-2xl font-semibold text-[var(--ink)]">
                    {step.n}
                  </div>
                  <div className="pt-3">
                    <p className="text-base font-semibold text-[var(--ink)]">{step.label}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Confidence tiers callout ── */}
      <section className="bg-[var(--ink)] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Confidence tiers</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
                Every decision has a confidence level. No black boxes.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
                Classification, origin, and cost results carry{' '}
                <span className="font-semibold text-[#4ade80]">HIGH</span>,{' '}
                <span className="font-semibold text-[#fb923c]">VERIFY</span>, or{' '}
                <span className="font-semibold text-[#f87171]">NEEDS&nbsp;HUMAN</span>{' '}
                tiers — with a complete legal citation chain you can share with your customs broker or barrister.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:w-72">
              {[
                { label: 'HIGH', desc: 'MTC data ≥ 0.8 confidence. Safe to proceed.', color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
                { label: 'VERIFY', desc: 'Inferred attributes. User must confirm before certifying.', color: '#fb923c', bg: 'rgba(251,146,60,0.08)' },
                { label: 'NEEDS HUMAN', desc: 'Missing data or GRI-3 complexity. Route to expert review.', color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
              ].map((tier) => (
                <div
                  key={tier.label}
                  className="rounded-2xl border px-5 py-4"
                  style={{ borderColor: `${tier.color}30`, background: tier.bg }}
                >
                  <p className="text-xs font-semibold tracking-wider" style={{ color: tier.color }}>{tier.label}</p>
                  <p className="mt-1 text-sm text-white/60">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="border-b border-[var(--border)] bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Audit-ready by design', body: 'Every gate question, override, and certification is recorded with timestamps and user identity. Prepared for HMRC or CBP review.' },
              { icon: FileText, title: 'Official tariff data', body: 'Duty rates, nomenclature rules, and safeguard quota headroom are sourced from official tariff schedules — not estimates.' },
              { icon: Zap, title: 'Zero-config deployment', body: 'Docker-native, HTTPS-first. Backend and frontend deploy behind a single nginx proxy. No VPN, no complex IAM.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-3xl border border-[var(--border)] p-8">
                <Icon className="mb-4 h-6 w-6 text-[var(--accent)]" />
                <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sign-in CTA ── */}
      <section className="bg-[var(--surface-muted)] px-6 py-28">
        <div className="mx-auto max-w-md text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--success-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--success)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Live backend connected
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--ink)]">
            Start classifying.
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Sign in with your Google account to open the workspace. Your first shipment takes under five minutes.
          </p>
          <button
            type="button"
            onClick={handleSignIn}
            disabled={authUrlQuery.isLoading || !authUrlQuery.data?.auth_url}
            className="mt-8 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[var(--ink)] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            Continue with Google
            <ArrowRight className="h-4 w-4" />
          </button>
          {authUrlQuery.error ? (
            <p className="mt-4 text-sm text-[var(--danger)]">
              Unable to reach the auth service. Check your connection and retry.
            </p>
          ) : null}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] bg-white px-6 py-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--ink)]">VeriTariff AI</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Trade compliance infrastructure for steel importers. Not a substitute for a licensed customs broker.
          </p>
        </div>
      </footer>

    </div>
  )
}
