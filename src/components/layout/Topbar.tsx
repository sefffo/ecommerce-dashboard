import { LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

export function Topbar() {
  const { user, logout, isSuperAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-surface shrink-0">
      <div />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2.5 hover:bg-white/[0.04] px-2.5 py-1.5 rounded-lg transition-colors">
            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-text text-xs font-medium leading-tight">{user?.displayName}</p>
              <p className="text-muted text-[11px] leading-tight">{user?.email}</p>
            </div>
            <span className={cn(
              'badge text-[10px] font-semibold hidden sm:inline-flex',
              isSuperAdmin
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                : 'bg-accent/10 text-accent border border-accent/20'
            )}>
              {user?.role}
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[180px] bg-surface-2 border border-white/[0.08] rounded-lg p-1 shadow-xl animate-fadeIn"
            align="end"
            sideOffset={6}
          >
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
