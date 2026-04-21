import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { productsApi } from '@/api/products'
import { TableSkeleton, ListSkeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Modal } from '@/components/shared/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { formatCurrency } from '@/lib/utils'
import type { CreateProductDto, ProductDto } from '@/features/products/types'

const schema = z.object({
  name: z.string().min(3, 'Min 3 chars').max(100),
  description: z.string().min(20, 'Min 20 chars').max(500),
  pictureUrl: z.string().url('Must be a valid URL'),
  price: z.coerce.number().min(0.01, 'Must be > 0'),
  productType: z.string().min(1, 'Select a type'),
  productBrand: z.string().min(1, 'Select a brand'),
})
type FormData = z.infer<typeof schema>

function fallbackImage(e: React.SyntheticEvent<HTMLImageElement>) {
  ;(e.target as HTMLImageElement).src = 'https://placehold.co/96x96/1c1c1c/71717a?text=?'
}

export function ProductsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [brandId, setBrandId] = useState<number | undefined>()
  const [typeId, setTypeId] = useState<number | undefined>()
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, brandId, typeId, pageIndex: page }],
    queryFn: () => productsApi.getAll({ search, brandId, typeId, pageIndex: page, pageSize: 10 }),
  })
  const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: productsApi.getBrands })
  const { data: types } = useQuery({ queryKey: ['types'], queryFn: productsApi.getTypes })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: (dto: CreateProductDto) => productsApi.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created')
      setShowCreate(false)
      reset()
    },
    onError: () => toast.error('Failed to create product'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete product'),
  })

  const totalPages = data ? Math.ceil(data.totalCount / 10) : 1
  const rows = data?.data ?? []

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="h-page">Products</h2>
          <p className="h-page-sub">{data?.totalCount ?? 0} total products</p>
        </div>
        <button className="btn-primary w-full sm:w-auto" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input pl-9"
            placeholder="Search products…"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:gap-2.5">
          <select
            className="input sm:w-40"
            value={brandId || ''}
            onChange={(e) => { setBrandId(e.target.value ? Number(e.target.value) : undefined); setPage(1) }}
          >
            <option value="">All Brands</option>
            {brands?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select
            className="input sm:w-40"
            value={typeId || ''}
            onChange={(e) => { setTypeId(e.target.value ? Number(e.target.value) : undefined); setPage(1) }}
          >
            <option value="">All Types</option>
            {types?.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Image', 'Name', 'Price', 'Brand', 'Type', ''].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton cols={6} rows={8} />
              ) : !rows.length ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={Package}
                      title="No products found"
                      description="Add your first product or adjust the filters."
                      action={
                        <button className="btn-primary" onClick={() => setShowCreate(true)}>
                          <Plus className="w-4 h-4" /> Add Product
                        </button>
                      }
                    />
                  </td>
                </tr>
              ) : rows.map((p: ProductDto) => (
                <tr key={p.id} className="border-b border-white/[0.04] table-row-hover">
                  <td className="px-5 py-3">
                    <img
                      src={p.pictureUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover bg-surface-2"
                      onError={fallbackImage}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-text text-sm font-medium">{p.name}</p>
                    <p className="text-muted text-xs truncate max-w-xs">{p.description}</p>
                  </td>
                  <td className="px-5 py-3 text-sm font-mono text-text tabular-nums">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-3 text-sm text-muted">{p.productBrand}</td>
                  <td className="px-5 py-3 text-sm text-muted">{p.productType}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      aria-label="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
            <p className="text-muted text-xs">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button className="btn-secondary py-1 px-3 text-xs" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <button className="btn-secondary py-1 px-3 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2.5">
        {isLoading ? (
          <ListSkeleton rows={5} />
        ) : !rows.length ? (
          <div className="card p-6">
            <EmptyState
              icon={Package}
              compact
              title="No products found"
              description="Add your first product or adjust the filters."
              action={
                <button className="btn-primary" onClick={() => setShowCreate(true)}>
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              }
            />
          </div>
        ) : (
          <>
            {rows.map((p: ProductDto) => (
              <div key={p.id} className="card p-3 flex gap-3 items-start">
                <img
                  src={p.pictureUrl}
                  alt={p.name}
                  className="w-16 h-16 rounded-lg object-cover bg-surface-2 flex-shrink-0"
                  onError={fallbackImage}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-text text-sm font-medium line-clamp-1">{p.name}</p>
                    <p className="text-sm font-mono text-text tabular-nums whitespace-nowrap">{formatCurrency(p.price)}</p>
                  </div>
                  <p className="text-muted text-xs line-clamp-2 mt-0.5">{p.description}</p>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge-neutral text-[10px]">{p.productBrand}</span>
                      <span className="badge-neutral text-[10px]">{p.productType}</span>
                    </div>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      aria-label="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="card flex items-center justify-between px-4 py-3">
                <p className="text-muted text-xs">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button className="btn-secondary py-1 px-3 text-xs" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
                  <button className="btn-secondary py-1 px-3 text-xs" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} onOpenChange={setShowCreate} title="Add Product" size="lg">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Name</label>
              <input {...register('name')} className="input" placeholder="Product name" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea {...register('description')} className="input min-h-[88px] resize-none" placeholder="Min 20 characters…" />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label className="label">Price ($)</label>
              <input {...register('price')} type="number" step="0.01" className="input" placeholder="99.99" />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="label">Image URL</label>
              <input {...register('pictureUrl')} className="input" placeholder="https://…" />
              {errors.pictureUrl && <p className="text-red-400 text-xs mt-1">{errors.pictureUrl.message}</p>}
            </div>
            <div>
              <label className="label">Brand</label>
              <select {...register('productBrand')} className="input">
                <option value="">Select brand</option>
                {brands?.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
              {errors.productBrand && <p className="text-red-400 text-xs mt-1">{errors.productBrand.message}</p>}
            </div>
            <div>
              <label className="label">Type</label>
              <select {...register('productType')} className="input">
                <option value="">Select type</option>
                {types?.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
              {errors.productType && <p className="text-red-400 text-xs mt-1">{errors.productType.message}</p>}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={() => { setShowCreate(false); reset() }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete product?"
        description="This action cannot be undone. The product will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
