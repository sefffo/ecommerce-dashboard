import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function SuperAdminRoute() {
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin)
  return isSuperAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}
