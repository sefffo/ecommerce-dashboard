import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/pages/LoginPage'
import { OverviewPage } from '@/pages/OverviewPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { BrandsPage } from '@/pages/BrandsPage'
import { TypesPage } from '@/pages/TypesPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { UsersPage } from '@/pages/UsersPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { SuperAdminRoute } from '@/components/shared/SuperAdminRoute'

export default function App() {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage)
  useEffect(() => { hydrateFromStorage() }, [hydrateFromStorage])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<OverviewPage />} />
          <Route path="/dashboard/products" element={<ProductsPage />} />
          <Route path="/dashboard/brands" element={<BrandsPage />} />
          <Route path="/dashboard/types" element={<TypesPage />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/orders/:id" element={<OrderDetailPage />} />
          <Route element={<SuperAdminRoute />}>
            <Route path="/dashboard/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
