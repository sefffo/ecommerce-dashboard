import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { productsApi } from '@/api/products'
import { ListSkeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Modal } from '@/components/shared/Modal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data as { detail?: string; title?: string; error?: string } | undefined
    return data?.detail ?? data?.error ?? data?.title ?? fallback
  }
  return fallback
}

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
    mutationFn: (data: FormData) => productsApi.createType({ name: data.name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['types'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Type created')
      setShowCreate(false)
      reset()
    },
    onError: (err: unknown) => toast.error(errorMessage(err, 'Failed to create type')),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.deleteType(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['types'] })
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Type deleted')
      setDeleteId(null)
    },
    onError: (err: unknown) => toast.error(errorMessage(err, 'Failed to delete type')),
  })

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="h-page">Product Types</h2>
          <p className="h-page-sub">{types?.length ?? 0} type{types?.length === 1 ? '' : 's'}</p>
        </div>
        <button className="btn-primary w-full sm:w-auto" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Add Type
        </button>
      </div>

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : !types?.length ? (
        <div className="card p-8">
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
        </div>
      ) : (
        <div className="card divide-y divide-white/[0.04]">
          {types.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-text font-medium truncate">{t.name}</p>
                  <p className="text-xs text-muted font-mono">#{t.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDeleteId(t.id)}
                className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                aria-label={`Delete ${t.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} onOpenChange={setShowCreate} title="Add Type" size="sm">
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="label">Type Name</label>
            <input {...register('name')} className="input" placeholder="e.g. Boots" autoFocus />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
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
        description="If any products still use this type, the delete will be blocked."
        confirmLabel="Delete"
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
