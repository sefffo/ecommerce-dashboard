import api from './axios'
import type { ProductParams, PaginatedProducts, CreateProductDto, BrandDto, TypeDto } from '@/features/products/types'

// Controller: ProductsController → [Route("api/[controller]")]
// resolves to: api/Products
export const productsApi = {
  getAll: (params?: ProductParams) =>
    api.get<PaginatedProducts>('/api/Products', { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get(`/api/Products/${id}`).then((r) => r.data),

  create: (dto: CreateProductDto) =>
    api.post('/api/Products', dto).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/api/Products/${id}`).then((r) => r.data),

  getBrands: () =>
    api.get<BrandDto[]>('/api/Products/brands').then((r) => r.data),

  getTypes: () =>
    api.get<TypeDto[]>('/api/Products/types').then((r) => r.data),

  createBrand: (dto: { name: string }) =>
    api.post<BrandDto>('/api/Products/brands', dto).then((r) => r.data),

  createType: (dto: { name: string }) =>
    api.post<TypeDto>('/api/Products/types', dto).then((r) => r.data),

  deleteBrand: (id: number) =>
    api.delete(`/api/Products/brands/${id}`).then((r) => r.data),

  deleteType: (id: number) =>
    api.delete(`/api/Products/types/${id}`).then((r) => r.data),

  /**
   * Uploads an image file to the backend's `/api/Upload` endpoint (multipart/form-data).
   * Backend returns `Result<string>` wrapping the public URL of the uploaded image.
   * Use the returned URL as `pictureUrl` in CreateProductDto.
   */
  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('Image', file)
    const res = await api.post<{ value: string; isSuccess: boolean; errors?: unknown[] }>(
      '/api/Upload',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    // Backend wraps the URL in Result<string>.Ok(url) → { isSuccess, value, errors }
    // Serializer camelCases to `value`. Fall back to the raw payload shape if the server
    // ever returns the string directly.
    const payload = res.data as unknown
    if (typeof payload === 'string') return payload
    if (payload && typeof payload === 'object' && 'value' in payload) {
      return (payload as { value: string }).value
    }
    throw new Error('Upload succeeded but the server did not return a URL.')
  },
}
