import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function TableSkeleton({ cols, rows }: { cols: number; rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-white/[0.04]">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-3">
              <Skeleton className="h-4" style={{ width: `${60 + Math.random() * 30}%` } as React.CSSProperties} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
