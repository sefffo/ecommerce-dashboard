import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { ordersApi } from '@/api/orders'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Skeleton } from '@/components/shared/Skeleton'
import { formatCurrency, formatDateTime, ORDER_STATUS_CONFIG } from '@/lib/utils'

// Must match the backend OrderStatus enum
const STATUSES = [
  'Pending',
  'Processing',
  'PaymentPending',
  'PaymentReceived',
  'Paid',
  'Preparing',
  'Shipped',
  'Delivered',
  'Cancelled',
]

function InfoCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-muted text-[11px] uppercase tracking-[0.08em] mb-0.5">{label}</p>
      <div className="text-text text-sm truncate">{children}</div>
    </div>
  )
}

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
    onError: (err: unknown) => {
      let message = 'Failed to update status'
      if (err instanceof AxiosError) {
        const data = err.response?.data as { detail?: string; title?: string; error?: string } | undefined
        const detail = data?.detail ?? data?.error ?? data?.title
        if (detail) message = detail
        else if (err.response?.status === 403)
          message = 'You need Admin or SuperAdmin role to change order status.'
        else if (err.response?.status === 404) message = 'Order not found.'
      }
      toast.error(message)
    },
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
    <div className="space-y-4 sm:space-y-5 max-w-3xl animate-fadeIn">
      <button onClick={() => navigate(-1)} className="btn-ghost pl-0 text-text-2 -ml-2">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Order header */}
      <div className="card p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="min-w-0">
            <p className="text-muted text-[11px] mb-1 uppercase tracking-[0.08em]">Order ID</p>
            <p className="font-mono text-text text-sm break-all">{order.id}</p>
          </div>
          <StatusBadge status={order.orderStatus} />
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4 mb-5">
          <InfoCell label="Customer">
            <span className="truncate block">{order.userEmail}</span>
          </InfoCell>
          <InfoCell label="Date">{formatDateTime(order.orderDate)}</InfoCell>
          <InfoCell label="Delivery">{order.deliveryMethod || '—'}</InfoCell>
          <InfoCell label="Subtotal">
            <span className="font-mono tabular-nums">{formatCurrency(order.subTotal)}</span>
          </InfoCell>
          <InfoCell label="Total">
            <span className="text-accent font-mono tabular-nums font-semibold">
              {formatCurrency(order.total)}
            </span>
          </InfoCell>
          <InfoCell label="Invoice ID">
            <span className="font-mono text-xs break-all">{order.paymentInvoiceId || '—'}</span>
          </InfoCell>
        </div>

        {/* Shipping Address */}
        {order.address && (order.address.firstName || order.address.city) && (
          <div className="bg-surface-2 border border-white/[0.04] rounded-lg p-4 mb-5">
            <p className="text-muted text-[11px] mb-2 uppercase tracking-[0.08em]">
              Shipping address
            </p>
            <p className="text-text text-sm leading-relaxed">
              {order.address.firstName} {order.address.lastName}
              <br />
              {order.address.street}, {order.address.city}
              <br />
              {order.address.country}
            </p>
          </div>
        )}

        {/* Update status */}
        <div>
          <p className="text-muted text-[11px] mb-2 uppercase tracking-[0.08em]">Update status</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <select
              className="input sm:w-64"
              defaultValue={order.orderStatus}
              onChange={(e) => statusMutation.mutate(e.target.value)}
              disabled={statusMutation.isPending}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_CONFIG[s]?.label ?? s}
                </option>
              ))}
            </select>
            {statusMutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin text-muted" />
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-white/[0.06]">
          <p className="text-text text-sm font-semibold">
            Order items ({order.orderItems?.length ?? 0})
          </p>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {order.orderItems?.length ? (
            order.orderItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5">
                <img
                  src={item.pictureUrl}
                  alt={item.productName}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover bg-surface-2 shrink-0"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://placehold.co/48x48/1c1c1c/71717a?text=?'
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-text text-sm font-medium truncate">{item.productName}</p>
                  <p className="text-muted text-xs mt-0.5">
                    Qty: {item.quantity} · {formatCurrency(item.price)} each
                  </p>
                </div>
                <p className="text-text text-sm font-mono tabular-nums shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))
          ) : (
            <p className="px-4 sm:px-5 py-4 text-muted text-sm">No items in this order.</p>
          )}
        </div>
      </div>
    </div>
  )
}
