import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}
