import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { AppLayout } from '@/routes/AppLayout'
import { AuthCallbackPage } from '@/routes/AuthCallbackPage'
import { ClassificationPage } from '@/routes/ClassificationPage'
import { CostPage } from '@/routes/CostPage'
import { DocumentsPage } from '@/routes/DocumentsPage'
import { IntakePage } from '@/routes/IntakePage'
import { LoginPage } from '@/routes/LoginPage'
import { NewShipmentPage } from '@/routes/NewShipmentPage'
import { NotFoundPage } from '@/routes/NotFoundPage'
import { OriginPage } from '@/routes/OriginPage'
import { ReportPage } from '@/routes/ReportPage'
import { ScreeningPage } from '@/routes/ScreeningPage'
import { ShipmentWorkspaceLayout } from '@/routes/ShipmentWorkspaceLayout'
import { ShipmentsPage } from '@/routes/ShipmentsPage'

function ProtectedLayout() {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page)] px-6 text-center">
        <div className="max-w-md rounded-3xl border border-[var(--border)] bg-white px-8 py-10 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            Verifying session
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--ink)]">
            Opening your shipment workspace
          </h1>
        </div>
      </div>
    )
  }

  return <AppLayout />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <ShipmentsPage />,
          },
          {
            path: 'shipments/new',
            element: <NewShipmentPage />,
          },
          {
            path: 'shipments/:shipmentId',
            element: <ShipmentWorkspaceLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="intake" replace />,
              },
              {
                path: 'intake',
                element: <IntakePage />,
              },
              {
                path: 'classification',
                element: <ClassificationPage />,
              },
              {
                path: 'screening',
                element: <ScreeningPage />,
              },
              {
                path: 'cost',
                element: <CostPage />,
              },
              {
                path: 'origin',
                element: <OriginPage />,
              },
              {
                path: 'documents',
                element: <DocumentsPage />,
              },
              {
                path: 'report',
                element: <ReportPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
