import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { productsApi } from '@/api/products'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Modal } from '@/components/shared/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

const schema = z.object({ name: z.string().min(1, 'Name is required').max(100) })
type FormData = z.infer<typeof schema>

export function BrandsPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: brands, isLoading } = useQuery({ queryKey: ['brands'], queryFn: productsApi.getBrands })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: (data: FormData) => productsApi.createBrand(data.name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand created')
      setShowCreate(false)
      reset()
    },
    onError: () => toast.error('Failed to create brand'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.deleteBrand(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete brand'),
  })

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Brands</h1>
          <p className="text-muted text-sm">{brands?.length ?? 0} brands</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Add Brand
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">ID</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton cols={3} rows={6} />
            ) : !brands?.length ? (
              <tr>
                <td colSpan={3}>
                  <EmptyState
                    icon={Tag}
                    title="No brands yet"
                    description="Create your first brand to assign to products."
                    action={
                      <button className="btn-primary" onClick={() => setShowCreate(true)}>
                        <Plus className="w-4 h-4" /> Add Brand
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : brands.map((b) => (
              <tr key={b.id} className="border-b border-white/[0.04] table-row-hover">
                <td className="px-5 py-3 font-mono text-xs text-muted">{b.id}</td>
                <td className="px-5 py-3 text-sm text-text font-medium">{b.name}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setDeleteId(b.id)}
                    className="btn-ghost p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={showCreate} onOpenChange={setShowCreate} title="Add Brand" size="sm">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="label">Brand Name</label>
            <input {...register('name')} className="input" placeholder="e.g. Nike" autoFocus />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" className="btn-secondary" onClick={() => { setShowCreate(false); reset() }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete brand?"
        description="Products assigned to this brand may be affected."
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
