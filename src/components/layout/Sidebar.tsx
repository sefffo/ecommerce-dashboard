import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Layers, ShoppingCart, Users,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Overview',  path: '/dashboard',          icon: LayoutDashboard, exact: true },
  { label: 'Products',  path: '/dashboard/products',  icon: Package },
  { label: 'Brands',    path: '/dashboard/brands',    icon: Tag },
  { label: 'Types',     path: '/dashboard/types',     icon: Layers },
  { label: 'Orders',    path: '/dashboard/orders',    icon: ShoppingCart },
  { label: 'Users',     path: '/dashboard/users',     icon: Users, superAdminOnly: true },
]

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { isSuperAdmin } = useAuthStore()
  const location = useLocation()
  const items = NAV_ITEMS.filter((item) => !item.superAdminOnly || isSuperAdmin)

  return (
    <aside className={cn(
      'relative flex flex-col bg-surface border-r border-white/[0.06] transition-all duration-200 shrink-0',
      collapsed ? 'w-14' : 'w-56'
    )}>
      {/* Logo */}
      <div className={cn(
        'flex items-center h-14 px-4 border-b border-white/[0.06]',
        collapsed && 'justify-center px-0'
      )}>
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-label="Commerce Admin Logo">
          <rect width="32" height="32" rx="6" fill="#0ea5e9" />
          <path d="M8 22 L16 10 L24 22" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="10" r="2" fill="white" />
        </svg>
        {!collapsed && <span className="ml-2.5 font-semibold text-text text-sm tracking-tight">Commerce</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all duration-150',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-muted hover:text-text hover:bg-white/[0.04]'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-10 border-t border-white/[0.06] text-muted hover:text-text transition-colors"
      >
        {collapsed
          ? <ChevronRight className="w-4 h-4" />
          : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
