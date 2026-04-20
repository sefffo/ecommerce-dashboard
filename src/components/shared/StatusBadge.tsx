import { ORDER_STATUS_CONFIG } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: string }) {
  const config = ORDER_STATUS_CONFIG[status] || { label: status, className: 'badge-neutral' }
  return <span className={cn('badge', config.className)}>{config.label}</span>
}
