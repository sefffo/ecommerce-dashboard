import api from './axios'
import type { ProductParams, PaginatedProducts, CreateProductDto, BrandDto, TypeDto } from '@/features/products/types'

export const productsApi = {
  getAll: (params?: ProductParams) =>
    api.get<PaginatedProducts>('/api/Products', { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get(`/api/Products/${id}`).then((r) => r.data),

  create: (dto: CreateProductDto) =>
    api.post('/api/Products', dto).then((r) => r.data),

  update: (id: number, dto: Partial<CreateProductDto>) =>
    api.put(`/api/Products/${id}`, dto).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/api/Products/${id}`).then((r) => r.data),

  getBrands: () =>
    api.get<BrandDto[]>('/api/Products/brands').then((r) => r.data),

  getTypes: () =>
    api.get<TypeDto[]>('/api/Products/types').then((r) => r.data),

  createBrand: (name: string) =>
    api.post('/api/Products/brands', { name }).then((r) => r.data),

  deleteBrand: (id: number) =>
    api.delete(`/api/Products/brands/${id}`).then((r) => r.data),

  createType: (name: string) =>
    api.post('/api/Products/types', { name }).then((r) => r.data),

  deleteType: (id: number) =>
    api.delete(`/api/Products/types/${id}`).then((r) => r.data),
}
