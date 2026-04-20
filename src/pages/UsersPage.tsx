import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, ShieldCheck, Trash2, RefreshCw, Search, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { usersApi, type UserDto } from '@/api/users'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Modal } from '@/components/shared/Modal'

const ROLES = ['User', 'Admin', 'SuperAdmin'] as const
type Role = (typeof ROLES)[number]

export function UsersPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [assignTarget, setAssignTarget] = useState<UserDto | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role>('User')
  const [deleteTarget, setDeleteTarget] = useState<UserDto | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<UserDto | null>(null)

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  })

  const assignMutation = useMutation({
    mutationFn: () =>
      usersApi.assignRole({ userEmail: assignTarget!.email, roleName: selectedRole }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success(`Role "${selectedRole}" assigned to ${assignTarget?.email}`)
      setAssignTarget(null)
    },
    onError: () => toast.error('Failed to assign role'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => usersApi.deleteUser(deleteTarget!.email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success(`User ${deleteTarget?.email} deleted`)
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete user'),
  })

  const revokeMutation = useMutation({
    mutationFn: () => usersApi.revokeToken(revokeTarget!.email),
    onSuccess: () => {
      toast.success(`Refresh token revoked for ${revokeTarget?.email}`)
      setRevokeTarget(null)
    },
    onError: () => toast.error('Failed to revoke token'),
  })

  const filtered = (users ?? []).filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-lg font-semibold text-text">Users</h1>
        <p className="text-muted text-sm">
          {users?.length ?? 0} registered users
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          className="input pl-9"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['User', 'Email', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton cols={3} rows={8} />
              ) : !filtered.length ? (
                <tr>
                  <td colSpan={3}>
                    <EmptyState icon={Users} title="No users found" description="Registered users will appear here." />
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.email} className="border-b border-white/[0.04] table-row-hover">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-semibold flex-shrink-0">
                          {u.displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-text font-medium">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted font-mono">{u.email}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setAssignTarget(u); setSelectedRole('User') }}
                          className="btn-ghost text-xs gap-1.5 py-1.5 px-2"
                          title="Assign role"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Role
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setRevokeTarget(u)}
                          className="btn-ghost p-1.5 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                          title="Revoke refresh token"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="btn-ghost p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={assignTarget !== null} onClose={() => setAssignTarget(null)} title="Assign Role">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted mb-0.5">User</p>
            <p className="text-sm text-text font-medium">{assignTarget?.displayName}</p>
            <p className="text-xs text-muted font-mono">{assignTarget?.email}</p>
          </div>
          <div>
            <label className="label mb-2 block">New Role</label>
            <div className="flex gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    selectedRole === role
                      ? 'bg-accent/10 border-accent/40 text-accent'
                      : 'bg-surface-2 border-white/[0.08] text-muted hover:text-text'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="btn-secondary" onClick={() => setAssignTarget(null)}>Cancel</button>
            <button className="btn-primary" onClick={() => assignMutation.mutate()} disabled={assignMutation.isPending}>
              {assignMutation.isPending ? 'Assigning...' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete user?"
        description={`This will permanently delete ${deleteTarget?.displayName} (${deleteTarget?.email}). This cannot be undone.`}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        title="Revoke refresh token?"
        description={`${revokeTarget?.displayName} will be signed out immediately and must log in again.`}
        onConfirm={() => revokeMutation.mutate()}
        loading={revokeMutation.isPending}
        danger={false}
      />
    </div>
  )
}
