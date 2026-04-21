import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tag,
  Layers,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  path: string
  icon: typeof LayoutDashboard
  exact?: boolean
  superAdminOnly?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
      { label: 'Orders', path: '/dashboard/orders', icon: ShoppingCart },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Products', path: '/dashboard/products', icon: Package },
      { label: 'Brands', path: '/dashboard/brands', icon: Tag },
      { label: 'Types', path: '/dashboard/types', icon: Layers },
    ],
  },
  {
    label: 'Admin',
    items: [{ label: 'Users', path: '/dashboard/users', icon: Users, superAdminOnly: true }],
  },
]

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center h-14 px-4 border-b border-white/[0.06] shrink-0',
        collapsed && 'md:justify-center md:px-0',
      )}
    >
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-label="Commerce Admin">
        <rect width="32" height="32" rx="7" fill="#0ea5e9" />
        <path
          d="M8 22 L16 10 L24 22"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="10" r="2" fill="white" />
      </svg>
      <span
        className={cn(
          'ml-2.5 font-semibold text-text text-sm tracking-tight',
          collapsed && 'md:hidden',
        )}
      >
        Commerce
      </span>
    </div>
  )
}

function NavItems({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean
  onNavigate?: () => void
}) {
  const { isSuperAdmin } = useAuthStore()
  const location = useLocation()

  return (
    <nav className="flex-1 py-4 px-2 space-y-5 overflow-y-auto">
      {NAV_GROUPS.map((group) => {
        const items = group.items.filter((i) => !i.superAdminOnly || isSuperAdmin)
        if (!items.length) return null
        return (
          <div key={group.label} className="space-y-0.5">
            <p
              className={cn(
                'px-2.5 mb-1.5 text-[10px] uppercase tracking-[0.1em] text-muted font-semibold',
                collapsed && 'md:hidden',
              )}
            >
              {group.label}
            </p>
            {items.map((item) => {
              const Icon = item.icon
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname === item.path ||
                  location.pathname.startsWith(item.path + '/')
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    collapsed && 'md:justify-center md:px-0',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-2 hover:text-text hover:bg-white/[0.04]',
                  )}
                >
                  {isActive && (
                    <span
                      className={cn(
                        'absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-accent',
                        collapsed && 'md:hidden',
                      )}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className={cn(collapsed && 'md:hidden')}>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop rail (md+)                                                  */
/* ------------------------------------------------------------------ */
export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        'hidden md:flex relative flex-col bg-surface border-r border-white/[0.06] shrink-0',
        'transition-[width] duration-200',
        collapsed ? 'w-[60px]' : 'w-60',
      )}
    >
      <Logo collapsed={collapsed} />
      <NavItems collapsed={collapsed} />
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="flex items-center justify-center h-10 border-t border-white/[0.06] text-muted hover:text-text transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile drawer (< md)                                                */
/* ------------------------------------------------------------------ */
export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={cn(
          'md:hidden fixed inset-y-0 left-0 z-50 w-64 max-w-[82vw] bg-surface border-r border-white/[0.06] flex flex-col',
          'transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="7" fill="#0ea5e9" />
              <path
                d="M8 22 L16 10 L24 22"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="16" cy="10" r="2" fill="white" />
            </svg>
            <span className="font-semibold text-text text-sm tracking-tight">Commerce</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="btn-icon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <NavItems collapsed={false} onNavigate={onClose} />
      </aside>
    </>
  )
}
