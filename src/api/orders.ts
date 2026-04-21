import api from './axios'
import type { OrderDto, OrderItemDto, AddressDto } from '@/features/orders/types'

// Controller: OrderController → [Route("api/[controller]")]
// resolves to: api/Order (singular — NOT Orders)

// -------------------------------------------------------------
// Defensive normalization
// -------------------------------------------------------------
// ASP.NET Core is configured to emit camelCase, but Redis-cached
// payloads were being serialized with default options (PascalCase).
// The backend was fixed, but stale cache entries or future regressions
// could re-introduce the issue. We normalize any incoming order so the
// UI always sees the expected camelCase shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pick<T = unknown>(obj: any, ...keys: string[]): T | undefined {
  if (!obj) return undefined
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null) return obj[k] as T
  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeItem(raw: any): OrderItemDto {
  return {
    productName: pick<string>(raw, 'productName', 'ProductName') ?? '',
    pictureUrl: pick<string>(raw, 'pictureUrl', 'PictureUrl') ?? '',
    price: Number(pick(raw, 'price', 'Price') ?? 0),
    quantity: Number(pick(raw, 'quantity', 'Quantity') ?? 0),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAddress(raw: any): AddressDto {
  return {
    firstName: pick<string>(raw, 'firstName', 'FirstName') ?? '',
    lastName: pick<string>(raw, 'lastName', 'LastName') ?? '',
    country: pick<string>(raw, 'country', 'Country') ?? '',
    street: pick<string>(raw, 'street', 'Street') ?? '',
    city: pick<string>(raw, 'city', 'City') ?? '',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeOrder(raw: any): OrderDto {
  const items = pick<unknown[]>(raw, 'orderItems', 'OrderItems') ?? []
  const address = pick(raw, 'address', 'Address')
  return {
    id: pick<string>(raw, 'id', 'Id') ?? '',
    userEmail: pick<string>(raw, 'userEmail', 'UserEmail') ?? '',
    orderItems: (items as unknown[]).map(normalizeItem),
    address: normalizeAddress(address),
    deliveryMethod: pick<string>(raw, 'deliveryMethod', 'DeliveryMethod') ?? null,
    subTotal: Number(pick(raw, 'subTotal', 'SubTotal', 'subtotal', 'Subtotal') ?? 0),
    total: Number(pick(raw, 'total', 'Total') ?? 0),
    orderStatus: pick<string>(raw, 'orderStatus', 'OrderStatus') ?? '',
    orderDate: pick<string>(raw, 'orderDate', 'OrderDate') ?? '',
    paymentInvoiceId: pick<string>(raw, 'paymentInvoiceId', 'PaymentInvoiceId') ?? '',
  }
}

export const ordersApi = {
  // Dashboard: returns ALL orders across all users (Admin/SuperAdmin only)
  getAll: () =>
    api.get<unknown[]>('/api/Order/Admin/AllOrders').then((r) =>
      (r.data ?? []).map(normalizeOrder)
    ),

  // For a regular user's own order history (email-scoped)
  getMyOrders: () =>
    api.get<unknown[]>('/api/Order/AllOrders').then((r) =>
      (r.data ?? []).map(normalizeOrder)
    ),

  getById: (id: string) =>
    api.get<unknown>(`/api/Order/${id}`).then((r) => normalizeOrder(r.data)),

  getDeliveryMethods: () =>
    api.get('/api/Order/DeliveryMethods').then((r) => r.data),

  // NOTE: backend does not yet have a PATCH /api/Order/{id}/status endpoint.
  // This is a placeholder so the UI compiles. Wire it up once the endpoint exists.
  updateStatus: (id: string, status: string) =>
    api.patch(`/api/Order/${id}/status`, { status }).then((r) => r.data),
}
