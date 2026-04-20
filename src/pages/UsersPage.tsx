import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Users, ShieldCheck, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { usersApi } from '@/api/users'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function UsersPage() {
  const qc = useQueryClient()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [revokeEmail, setRevokeEmail] = useState<string | null>(null)

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => usersApi.updateRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Role updated')
    },
    onError: () => toast.error('Failed to update role'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete user'),
  })

  const revokeMutation = useMutation({
    mutationFn: (email: string) => usersApi.revokeToken(email),
    onSuccess: () => {
      toast.success('Refresh token revoked')
      setRevokeEmail(null)
    },
    onError: () => toast.error('Failed to revoke token'),
  })

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-lg font-semibold text-text">Users</h1>
        <p className="text-muted text-sm">{users?.length ?? 0} registered users — SuperAdmin only</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton cols={5} rows={8} />
              ) : !users?.length ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={Users}
                      title="No users found"
                      description="Registered users will appear here."
                    />
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-white/[0.04] table-row-hover">
                  <td className="px-5 py-3 text-sm text-text font-medium">{u.displayName}</td>
                  <td className="px-5 py-3 text-sm text-muted">{u.email}</td>
                  <td className="px-5 py-3">
                    <select
                      className="input py-1 text-xs w-32"
                      defaultValue={u.roles?.[0] || 'User'}
                      onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted">
                    {u.createdAt ? formatDate(u.createdAt) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setRevokeEmail(u.email)}
                        className={cn('btn-ghost p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10')}
                        title="Revoke refresh token"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(u.id)}
                        className="btn-ghost p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete user?"
        description="This will permanently remove the user and all their data."
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={revokeEmail !== null}
        onOpenChange={(open) => !open && setRevokeEmail(null)}
        title="Revoke refresh token?"
        description="The user will be signed out and must log in again."
        onConfirm={() => revokeEmail !== null && revokeMutation.mutate(revokeEmail)}
        loading={revokeMutation.isPending}
        danger={false}
      />
    </div>
  )
}
