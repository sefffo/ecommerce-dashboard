import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-surface-2 border border-white/[0.06] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-muted" />
      </div>
      <h3 className="text-text text-sm font-medium mb-1">{title}</h3>
      <p className="text-muted text-sm max-w-xs mb-5">{description}</p>
      {action}
    </div>
  )
}
