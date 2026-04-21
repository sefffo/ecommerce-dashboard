import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ordersApi } from '@/api/orders'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Skeleton } from '@/components/shared/Skeleton'
import { formatCurrency, formatDateTime } from '@/lib/utils'

const STATUSES = ['PaymentPending', 'PaymentReceived', 'Paid', 'Preparing', 'Shipped', 'Delivered', 'Cancelled']

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id!),
    enabled: !!id,
  })

  const statusMutation = useMutation({
    mutationFn: (status: string) => ordersApi.updateStatus(id!, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order', id] })
      qc.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Order status updated')
    },
    onError: () => toast.error('Failed to update status'),
  })

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl animate-fadeIn">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!order) return <p className="text-muted text-sm">Order not found.</p>

  return (
    <div className="space-y-5 max-w-3xl animate-fadeIn">
      <button onClick={() => navigate(-1)} className="btn-ghost pl-0 text-muted">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Order Header */}
      <div className="card p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-muted text-xs mb-1 uppercase tracking-wide">Order ID</p>
            <p className="font-mono text-text text-sm">{order.id}</p>
          </div>
          <StatusBadge status={order.orderStatus} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-5">
          <div>
            <p className="text-muted text-xs mb-0.5 uppercase tracking-wide">Customer</p>
            <p className="text-text">{order.userEmail}</p>
          </div>
          <div>
            <p className="text-muted text-xs mb-0.5 uppercase tracking-wide">Date</p>
            <p className="text-text">{formatDateTime(order.orderDate)}</p>
          </div>
          <div>
            <p className="text-muted text-xs mb-0.5 uppercase tracking-wide">Delivery</p>
            <p className="text-text">{order.deliveryMethod ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted text-xs mb-0.5 uppercase tracking-wide">Subtotal</p>
            <p className="text-text font-mono">{formatCurrency(order.subTotal)}</p>
          </div>
          <div>
            <p className="text-muted text-xs mb-0.5 uppercase tracking-wide">Total</p>
            <p className="text-accent font-mono font-semibold">{formatCurrency(order.total)}</p>
          </div>
          <div>
            <p className="text-muted text-xs mb-0.5 uppercase tracking-wide">Invoice ID</p>
            <p className="text-text font-mono text-xs">{order.paymentInvoiceId ?? '—'}</p>
          </div>
        </div>

        {/* Shipping Address */}
        {order.address && (
          <div className="bg-surface-2 rounded-lg p-4 mb-5">
            <p className="text-muted text-xs mb-2 uppercase tracking-wide">Shipping Address</p>
            <p className="text-text text-sm">
              {order.address.firstName} {order.address.lastName}<br />
              {order.address.street}, {order.address.city}<br />
              {order.address.country}
            </p>
          </div>
        )}

        {/* Update Status */}
        <div>
          <p className="text-muted text-xs mb-2 uppercase tracking-wide">Update Status</p>
          <div className="flex items-center gap-3">
            <select
              className="input w-48"
              defaultValue={order.orderStatus}
              onChange={(e) => statusMutation.mutate(e.target.value)}
              disabled={statusMutation.isPending}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {statusMutation.isPending && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <p className="text-text text-sm font-medium">Order Items ({order.orderItems?.length ?? 0})</p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {order.orderItems?.length ? order.orderItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <img
                src={item.pictureUrl}
                alt={item.productName}
                className="w-12 h-12 rounded-lg object-cover bg-surface-2 shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/1c1c1c/71717a?text=?' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-text text-sm font-medium truncate">{item.productName}</p>
                <p className="text-muted text-xs">Qty: {item.quantity}</p>
              </div>
              <p className="text-text text-sm font-mono shrink-0">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          )) : (
            <p className="px-5 py-4 text-muted text-sm">No items in this order.</p>
          )}
        </div>
      </div>
    </div>
  )
}
