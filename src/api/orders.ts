import api from './axios'
import type { OrderDto } from '@/features/orders/types'

// Controller: OrderController → [Route("api/[controller]")]
// resolves to: api/Order (singular — NOT Orders)

export const ordersApi = {
  // Dashboard: returns ALL orders across all users (Admin/SuperAdmin only)
  getAll: () =>
    api.get<OrderDto[]>('/api/Order/Admin/AllOrders').then((r) => r.data),

  // For a regular user's own order history (email-scoped)
  getMyOrders: () =>
    api.get<OrderDto[]>('/api/Order/AllOrders').then((r) => r.data),

  getById: (id: string) =>
    api.get<OrderDto>(`/api/Order/${id}`).then((r) => r.data),

  getDeliveryMethods: () =>
    api.get('/api/Order/DeliveryMethods').then((r) => r.data),
}
