import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const auth = useAuth()

  return (
    <div className="min-h-screen bg-[var(--page)]">
      <header className="border-b border-[var(--border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--ink)] text-sm font-semibold text-white">
                VT
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  VeriTariff AI
                </p>
                <p className="text-sm font-semibold text-[var(--ink)]">Trade compliance co-pilot</p>
              </div>
            </Link>
            <nav className="hidden items-center gap-3 md:flex">
              {[
                { label: 'Shipments', href: '/' },
                { label: 'Start shipment', href: '/shipments/new' },
              ].map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-3 py-2 text-sm font-medium text-[var(--ink-soft)] transition-colors',
                      isActive && 'bg-[var(--surface-muted)] text-[var(--ink)]',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Signed in
              </p>
              <p className="text-sm font-medium text-[var(--ink)]">{auth.user?.email ?? 'Loading user'}</p>
            </div>
            <Button variant="outline" onClick={auth.logout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

