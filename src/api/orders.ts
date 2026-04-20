import api from './axios'
import type { OrderDto } from '@/features/orders/types'

// Controller: OrderController → [Route("api/[controller]")]
// resolves to: api/Order  (singular — NOT Orders)
// NOTE: GetAllOrders returns orders for the authenticated user only.
// There is no admin-specific "get all orders" endpoint in this backend.
export const ordersApi = {
  getAll: () =>
    api.get<OrderDto[]>('/api/Order/AllOrders').then((r) => r.data),

  getById: (id: string) =>
    api.get<OrderDto>(`/api/Order/${id}`).then((r) => r.data),

  getDeliveryMethods: () =>
    api.get('/api/Order/DeliveryMethods').then((r) => r.data),

  // No updateStatus endpoint exists in the backend — removed to avoid 404s
}
