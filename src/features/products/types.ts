export interface ProductDto {
  id: number
  name: string
  description: string
  pictureUrl: string
  price: number
  productType: string
  productBrand: string
}

export interface CreateProductDto {
  name: string
  description: string
  pictureUrl: string
  price: number
  productType: string
  productBrand: string
}

export interface BrandDto { id: number; name: string }
export interface TypeDto  { id: number; name: string }

export interface PaginatedProducts {
  totalCount: number
  data: ProductDto[]
}

export interface ProductParams {
  pageIndex?: number
  pageSize?: number
  brandId?: number
  typeId?: number
  search?: string
  sort?: string
}
