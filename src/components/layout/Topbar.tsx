import { LogOut, User, Menu } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuthStore } from '@/store/authStore'
import { cn, getRouteTitle } from '@/lib/utils'

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout, isSuperAdmin } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { title, subtitle } = getRouteTitle(location.pathname)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = (user?.displayName || user?.email || '?')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-5 lg:px-6 border-b border-white/[0.06] bg-surface/80 backdrop-blur-md shrink-0">
      {/* Mobile menu trigger */}
      <button
        onClick={onMenuClick}
        className="md:hidden btn-icon -ml-2"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title / subtitle */}
      <div className="flex-1 min-w-0">
        <h1 className="text-text text-sm sm:text-[15px] font-semibold tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted text-[11px] sm:text-xs leading-tight truncate hidden sm:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* User menu */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="flex items-center gap-2.5 hover:bg-white/[0.04] active:bg-white/[0.06] px-1.5 sm:px-2.5 py-1.5 rounded-lg transition-colors"
            aria-label="Account menu"
          >
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent text-[11px] font-semibold">
              {initials || <User className="w-3.5 h-3.5" />}
            </div>
            <div className="text-left hidden md:block min-w-0 max-w-[160px]">
              <p className="text-text text-xs font-medium leading-tight truncate">
                {user?.displayName}
              </p>
              <p className="text-muted text-[11px] leading-tight truncate">{user?.email}</p>
            </div>
            <span
              className={cn(
                'badge text-[10px] font-semibold hidden lg:inline-flex',
                isSuperAdmin ? 'badge-purple' : 'badge-accent',
              )}
            >
              {user?.role}
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[220px] bg-surface-2 border border-white/[0.08] rounded-lg p-1.5 shadow-elev-3 animate-scaleIn"
            align="end"
            sideOffset={8}
          >
            <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
              <p className="text-text text-sm font-medium truncate">{user?.displayName}</p>
              <p className="text-muted text-xs truncate">{user?.email}</p>
              <span
                className={cn(
                  'badge mt-2 text-[10px]',
                  isSuperAdmin ? 'badge-purple' : 'badge-accent',
                )}
              >
                {user?.role}
              </span>
            </div>
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/10 cursor-pointer outline-none transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
