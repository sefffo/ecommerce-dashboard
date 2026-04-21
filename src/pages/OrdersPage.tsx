import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronRight, Search } from 'lucide-react'
import { ordersApi } from '@/api/orders'
import { ListSkeleton, TableSkeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { ORDER_STATUS_CONFIG } from '@/lib/utils'

export function OrdersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  })

  const filtered = useMemo(() => {
    if (!orders) return []
    const q = search.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        o.userEmail?.toLowerCase().includes(q) ||
        String(o.id || '').toLowerCase().includes(q)
      const matchesStatus = !statusFilter || o.orderStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  const statusOptions = Object.keys(ORDER_STATUS_CONFIG)

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header */}
      <div>
        <h2 className="h-page">Orders</h2>
        <p className="h-page-sub">{orders?.length ?? 0} total · {filtered.length} shown</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search by email or order ID…"
          />
        </div>
        <select
          className="input sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_CONFIG[s]?.label ?? s}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Order ID', 'Customer', 'Items', 'Subtotal', 'Status', 'Date', ''].map((h, i) => (
                  <th
                    key={i}
                    className="px-5 py-3 text-left text-[11px] font-medium text-muted uppercase tracking-[0.08em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton cols={7} rows={8} />
              ) : !filtered.length ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={ShoppingCart}
                      title={search || statusFilter ? 'No orders match your filters' : 'No orders yet'}
                      description={
                        search || statusFilter
                          ? 'Try adjusting the search term or status filter.'
                          : 'Orders placed by customers will appear here.'
                      }
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((o, idx) => (
                  <tr
                    key={o.id || idx}
                    className="border-b border-white/[0.04] table-row-hover cursor-pointer"
                    onClick={() => o.id && navigate(`/dashboard/orders/${o.id}`)}
                  >
                    <td className="px-5 py-3 font-mono text-xs text-text-2">
                      {o.id ? `${String(o.id).slice(0, 8)}…` : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm text-text truncate max-w-[220px]">
                      {o.userEmail || '—'}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-2">{o.orderItems?.length ?? 0}</td>
                    <td className="px-5 py-3 text-sm font-mono tabular-nums text-text">
                      {formatCurrency(o.subTotal)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.orderStatus} />
                    </td>
                    <td className="px-5 py-3 text-sm text-text-2 whitespace-nowrap">
                      {formatDateTime(o.orderDate)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <ChevronRight className="w-4 h-4 text-muted inline" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden">
        {isLoading ? (
          <ListSkeleton rows={6} />
        ) : !filtered.length ? (
          <div className="card">
            <EmptyState
              icon={ShoppingCart}
              title={search || statusFilter ? 'No matching orders' : 'No orders yet'}
              description={
                search || statusFilter
                  ? 'Try adjusting the search term or status filter.'
                  : 'Orders placed by customers will appear here.'
              }
            />
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((o, idx) => (
              <button
                key={o.id || idx}
                onClick={() => o.id && navigate(`/dashboard/orders/${o.id}`)}
                className="w-full text-left card-interactive p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text truncate">
                      {o.userEmail || '—'}
                    </p>
                    <p className="text-[11px] font-mono text-muted mt-0.5">
                      {o.id ? String(o.id).slice(0, 8) : '—'}
                    </p>
                  </div>
                  <StatusBadge status={o.orderStatus} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted">Items</p>
                    <p className="text-text-2 mt-0.5">{o.orderItems?.length ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-muted">Subtotal</p>
                    <p className="text-text font-mono tabular-nums mt-0.5">
                      {formatCurrency(o.subTotal)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted">Date</p>
                    <p className="text-text-2 mt-0.5 truncate">{formatDateTime(o.orderDate)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
