import api from './axios'
import type { ProductParams, PaginatedProducts, CreateProductDto, BrandDto, TypeDto } from '@/features/products/types'

// Controller: ProductsController → [Route("api/[controller]")]
// resolves to: api/Products
// NOTE: No update (PUT) or delete (DELETE) product/brand/type endpoints exist in the backend.
// Only GET and POST are implemented. Removed non-existent calls.
export const productsApi = {
  getAll: (params?: ProductParams) =>
    api.get<PaginatedProducts>('/api/Products', { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get(`/api/Products/${id}`).then((r) => r.data),

  create: (dto: CreateProductDto) =>
    api.post('/api/Products', dto).then((r) => r.data),

  getBrands: () =>
    api.get<BrandDto[]>('/api/Products/brands').then((r) => r.data),

  getTypes: () =>
    api.get<TypeDto[]>('/api/Products/types').then((r) => r.data),

  createBrand: (dto: { name: string }) =>
    api.post<BrandDto>('/api/Products/brands', dto).then((r) => r.data),

  createType: (dto: { name: string }) =>
    api.post<TypeDto>('/api/Products/types', dto).then((r) => r.data),
}
