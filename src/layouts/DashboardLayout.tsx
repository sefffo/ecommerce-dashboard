import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
