import api from './axios'
import type { OrderDto } from '@/features/orders/types'

export const ordersApi = {
  getAll: () =>
    api.get<OrderDto[]>('/api/Orders/admin/all').then((r) => r.data),

  getById: (id: string) =>
    api.get<OrderDto>(`/api/Orders/${id}`).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.put(`/api/Orders/admin/${id}/status`, { status }).then((r) => r.data),
}
