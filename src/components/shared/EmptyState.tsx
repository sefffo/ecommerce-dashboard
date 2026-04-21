import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  compact?: boolean
}

export function EmptyState({ icon: Icon, title, description, action, compact }: EmptyStateProps) {
  return (
    <div
      className={
        compact
          ? 'flex flex-col items-center justify-center py-10 px-6 text-center'
          : 'flex flex-col items-center justify-center py-14 sm:py-16 px-6 sm:px-8 text-center'
      }
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-2xl bg-accent/5 blur-xl" aria-hidden />
        <div className="relative w-14 h-14 rounded-2xl bg-surface-2 border border-white/[0.08] flex items-center justify-center">
          <Icon className="w-5 h-5 text-text-2" />
        </div>
      </div>
      <h3 className="text-text text-sm font-semibold mb-1.5">{title}</h3>
      <p className="text-text-2 text-sm max-w-sm mb-5 leading-relaxed">{description}</p>
      {action}
    </div>
  )
}
