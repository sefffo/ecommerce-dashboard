import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Layers } from 'lucide-react'
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

export function TypesPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: types, isLoading } = useQuery({ queryKey: ['types'], queryFn: productsApi.getTypes })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const createMutation = useMutation({
    mutationFn: (data: FormData) => productsApi.createType(data.name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['types'] })
      toast.success('Type created')
      setShowCreate(false)
      reset()
    },
    onError: () => toast.error('Failed to create type'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.deleteType(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['types'] })
      toast.success('Type deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete type'),
  })

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Product Types</h1>
          <p className="text-muted text-sm">{types?.length ?? 0} types</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Add Type
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
            ) : !types?.length ? (
              <tr>
                <td colSpan={3}>
                  <EmptyState
                    icon={Layers}
                    title="No types yet"
                    description="Create product types to categorize your catalog."
                    action={
                      <button className="btn-primary" onClick={() => setShowCreate(true)}>
                        <Plus className="w-4 h-4" /> Add Type
                      </button>
                    }
                  />
                </td>
              </tr>
            ) : types.map((t) => (
              <tr key={t.id} className="border-b border-white/[0.04] table-row-hover">
                <td className="px-5 py-3 font-mono text-xs text-muted">{t.id}</td>
                <td className="px-5 py-3 text-sm text-text font-medium">{t.name}</td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => setDeleteId(t.id)}
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

      <Modal open={showCreate} onOpenChange={setShowCreate} title="Add Type" size="sm">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="label">Type Name</label>
            <input {...register('name')} className="input" placeholder="e.g. Boots" autoFocus />
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
        title="Delete type?"
        description="Products assigned to this type may be affected."
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
