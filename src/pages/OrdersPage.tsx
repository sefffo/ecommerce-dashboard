import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { ordersApi } from '@/api/orders'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export function OrdersPage() {
  const navigate = useNavigate()
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  })

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-lg font-semibold text-text">Orders</h1>
        <p className="text-muted text-sm">{orders?.length ?? 0} total orders</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton cols={7} rows={10} />
              ) : !orders?.length ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={ShoppingCart}
                      title="No orders yet"
                      description="Orders placed by customers will appear here."
                    />
                  </td>
                </tr>
              ) : orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-white/[0.04] table-row-hover cursor-pointer"
                  onClick={() => navigate(`/dashboard/orders/${o.id}`)}
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted">{o.id.toString().slice(0, 8)}…</td>
                  <td className="px-5 py-3 text-sm text-text">{o.userEmail}</td>
                  <td className="px-5 py-3 text-sm text-muted">{o.orderItems?.length ?? 0}</td>
                  <td className="px-5 py-3 text-sm font-mono text-text">{formatCurrency(o.total)}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.orderStatus} /></td>
                  <td className="px-5 py-3 text-sm text-muted">{formatDateTime(o.orderDate)}</td>
                  <td className="px-5 py-3">
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
