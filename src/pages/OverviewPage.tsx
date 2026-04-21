import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Package, ShoppingCart, TrendingUp, Users, ArrowRight } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts'
import type { LucideIcon } from 'lucide-react'
import { productsApi } from '@/api/products'
import { ordersApi } from '@/api/orders'
import { formatCurrency, formatDate } from '@/lib/utils'
import { StatCardSkeleton, TableSkeleton, ListSkeleton } from '@/components/shared/Skeleton'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { cn } from '@/lib/utils'

type KpiAccent = 'sky' | 'emerald' | 'amber' | 'purple'

const ACCENT_MAP: Record<KpiAccent, { bar: string; icon: string; iconBg: string }> = {
  sky:     { bar: 'kpi-accent-sky',     icon: 'text-accent',        iconBg: 'bg-accent/10 border-accent/25' },
  emerald: { bar: 'kpi-accent-emerald', icon: 'text-emerald-400',   iconBg: 'bg-emerald-500/10 border-emerald-500/25' },
  amber:   { bar: 'kpi-accent-amber',   icon: 'text-amber-400',     iconBg: 'bg-amber-500/10 border-amber-500/25' },
  purple:  { bar: 'kpi-accent-purple',  icon: 'text-purple-400',    iconBg: 'bg-purple-500/10 border-purple-500/25' },
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = 'sky',
}: {
  label: string
  value: string | number
  hint?: string
  icon: LucideIcon
  accent?: KpiAccent
}) {
  const a = ACCENT_MAP[accent]
  return (
    <div className="card p-4 sm:p-5 relative overflow-hidden animate-fadeIn">
      <div className={cn('absolute inset-x-0 top-0 h-[2px] opacity-70', a.bar)} />
      <div className="flex items-start justify-between mb-2.5">
        <p className="text-muted text-[11px] font-medium uppercase tracking-[0.08em]">{label}</p>
        <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center shrink-0', a.iconBg)}>
          <Icon className={cn('w-4 h-4', a.icon)} />
        </div>
      </div>
      <p className="text-text text-xl sm:text-2xl font-semibold font-mono tabular-nums leading-tight">
        {value}
      </p>
      {hint && <p className="text-muted text-xs mt-1.5">{hint}</p>}
    </div>
  )
}

const chartTooltip = {
  contentStyle: {
    background: '#181818',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    fontSize: 12,
    boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
  },
  labelStyle: { color: '#ededed', fontWeight: 500 },
  itemStyle: { color: '#0ea5e9' },
}

export function OverviewPage() {
  const navigate = useNavigate()

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
    [orders],
  )

  const chartData = useMemo(() => {
    if (!orders) return []
    const byDate: Record<string, number> = {}
    orders.forEach((o) => {
      const d = formatDate(o.orderDate)
      byDate[d] = (byDate[d] || 0) + 1
    })
    return Object.entries(byDate)
      .slice(-14)
      .map(([date, count]) => ({ date, orders: count }))
  }, [orders])

  const statusData = useMemo(() => {
    if (!orders) return []
    const acc: Record<string, number> = {}
    orders.forEach((o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1
    })
    return Object.entries(acc).map(([status, count]) => ({ status, count }))
  }, [orders])

  const recentOrders = useMemo(() => orders?.slice(0, 8) || [], [orders])
  const uniqueCustomers = useMemo(() => new Set(orders?.map((o) => o.userEmail)).size, [orders])

  const loading = loadingProducts || loadingOrders

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : (
            <>
              <StatCard
                label="Total Products"
                value={productsData?.totalCount ?? 0}
                icon={Package}
                accent="sky"
              />
              <StatCard
                label="Total Orders"
                value={orders?.length ?? 0}
                icon={ShoppingCart}
                accent="emerald"
              />
              <StatCard
                label="Total Revenue"
                value={formatCurrency(revenue)}
                icon={TrendingUp}
                accent="amber"
              />
              <StatCard
                label="Customers"
                value={uniqueCustomers}
                icon={Users}
                accent="purple"
              />
            </>
          )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-text text-sm font-semibold">Orders over time</p>
            <p className="text-muted text-xs">Last 14 days</p>
          </div>
          {loadingOrders ? (
            <div className="h-[180px] skeleton rounded-lg" />
          ) : chartData.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-muted text-xs">
              No orders yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ left: -20, right: 8 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip {...chartTooltip} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="url(#lineGrad)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-text text-sm font-semibold">Orders by status</p>
            <p className="text-muted text-xs">{statusData.length} statuses</p>
          </div>
          {loadingOrders ? (
            <div className="h-[180px] skeleton rounded-lg" />
          ) : statusData.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-muted text-xs">
              No orders yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={statusData} margin={{ left: -20, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="status"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip {...chartTooltip} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" fill="#0ea5e9" fillOpacity={0.85} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-white/[0.06] flex items-center justify-between gap-3">
          <div>
            <p className="text-text text-sm font-semibold">Recent Orders</p>
            <p className="text-muted text-xs mt-0.5 hidden sm:block">
              Latest {recentOrders.length} orders
            </p>
          </div>
          <button
            className="btn-ghost text-xs -mr-2"
            onClick={() => navigate('/dashboard/orders')}
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Order ID', 'Customer', 'Subtotal', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-medium text-muted uppercase tracking-[0.08em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingOrders ? (
                <TableSkeleton cols={5} rows={6} />
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-muted text-sm">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <tr
                    key={order.id || idx}
                    className="border-b border-white/[0.04] table-row-hover cursor-pointer"
                    onClick={() => order.id && navigate(`/dashboard/orders/${order.id}`)}
                  >
                    <td className="px-5 py-3 font-mono text-xs text-text-2">
                      {order.id ? String(order.id).slice(0, 8) : '—'}
                    </td>
                    <td className="px-5 py-3 text-sm text-text truncate max-w-[240px]">
                      {order.userEmail || '—'}
                    </td>
                    <td className="px-5 py-3 text-sm font-mono tabular-nums text-text">
                      {formatCurrency(order.subTotal)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-5 py-3 text-sm text-text-2">
                      {formatDate(order.orderDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden p-3 space-y-2">
          {loadingOrders ? (
            <ListSkeleton rows={4} />
          ) : recentOrders.length === 0 ? (
            <p className="text-center py-8 text-muted text-sm">No orders yet.</p>
          ) : (
            recentOrders.map((order, idx) => (
              <button
                key={order.id || idx}
                onClick={() => order.id && navigate(`/dashboard/orders/${order.id}`)}
                className="w-full text-left card-interactive p-3.5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {order.userEmail || '—'}
                    </p>
                    <p className="text-[11px] font-mono text-muted mt-0.5">
                      {order.id ? String(order.id).slice(0, 8) : '—'}
                    </p>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-2">{formatDate(order.orderDate)}</span>
                  <span className="font-mono tabular-nums text-text">
                    {formatCurrency(order.subTotal)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
