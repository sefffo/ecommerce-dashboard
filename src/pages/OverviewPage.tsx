import { useQuery } from '@tanstack/react-query'
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { productsApi } from '@/api/products'
import { ordersApi } from '@/api/orders'
import { formatCurrency, formatDate, ORDER_STATUS_CONFIG } from '@/lib/utils'
import { StatCardSkeleton, TableSkeleton } from '@/components/shared/Skeleton'
import { StatusBadge } from '@/components/shared/StatusBadge'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

function StatCard({
  label, value, icon: Icon, accent,
}: { label: string; value: string | number; icon: LucideIcon; accent?: string }) {
  return (
    <div className="card p-5 animate-fadeIn">
      <div className="flex items-start justify-between mb-3">
        <p className="text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
        <div className="w-8 h-8 rounded-lg bg-surface-2 border border-white/[0.06] flex items-center justify-center">
          <Icon className={cn('w-4 h-4', accent || 'text-muted')} />
        </div>
      </div>
      <p className="text-text text-2xl font-semibold font-mono tabular-nums">{value}</p>
    </div>
  )
}

export function OverviewPage() {
  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['products', { pageSize: 1 }],
    queryFn: () => productsApi.getAll({ pageSize: 1 }),
  })
  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getAll,
  })

  const revenue = useMemo(
    () => orders?.reduce((sum, o) => sum + (o.subTotal || 0), 0) || 0,
    [orders]
  )

  const chartData = useMemo(() => {
    if (!orders) return []
    const byDate: Record<string, number> = {}
    orders.forEach((o) => {
      const d = formatDate(o.orderDate)
      byDate[d] = (byDate[d] || 0) + 1
    })
    return Object.entries(byDate).slice(-14).map(([date, count]) => ({ date, orders: count }))
  }, [orders])

  const statusData = useMemo(() => {
    if (!orders) return []
    const acc: Record<string, number> = {}
    orders.forEach((o) => { acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1 })
    return Object.entries(acc).map(([status, count]) => ({ status, count }))
  }, [orders])

  const recentOrders = useMemo(() => orders?.slice(0, 10) || [], [orders])
  const uniqueCustomers = useMemo(() => new Set(orders?.map((o) => o.userEmail)).size, [orders])

  const tooltipStyle = {
    contentStyle: { background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: '#e4e4e7' },
    itemStyle: { color: '#0ea5e9' },
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-lg font-semibold text-text">Overview</h1>
        <p className="text-muted text-sm">Welcome back. Here's what's happening.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingProducts || loadingOrders ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Products" value={productsData?.totalCount || 0} icon={Package} accent="text-accent" />
            <StatCard label="Total Orders" value={orders?.length || 0} icon={ShoppingCart} accent="text-green-400" />
            <StatCard label="Total Revenue" value={formatCurrency(revenue)} icon={TrendingUp} accent="text-yellow-400" />
            <StatCard label="Customers" value={uniqueCustomers} icon={Users} accent="text-purple-400" />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-text text-sm font-medium mb-4">Orders over time</p>
          {loadingOrders ? (
            <div className="h-48 skeleton rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ left: -20 }}>
                <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="orders" stroke="#0ea5e9" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#0ea5e9' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <p className="text-text text-sm font-medium mb-4">Orders by status</p>
          {loadingOrders ? (
            <div className="h-48 skeleton rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={statusData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="status" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" fill="#0ea5e9" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <p className="text-text text-sm font-medium">Recent Orders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Order ID', 'Customer', 'Subtotal', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingOrders
                ? <TableSkeleton cols={5} rows={6} />
                : recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/[0.04] table-row-hover">
                    <td className="px-5 py-3 font-mono text-xs text-muted">{order.id.toString().slice(0, 8)}</td>
                    <td className="px-5 py-3 text-sm text-text">{order.userEmail}</td>
                    <td className="px-5 py-3 text-sm font-mono text-text">{formatCurrency(order.subTotal)}</td>
                    <td className="px-5 py-3"><StatusBadge status={order.orderStatus} /></td>
                    <td className="px-5 py-3 text-sm text-muted">{formatDate(order.orderDate)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
