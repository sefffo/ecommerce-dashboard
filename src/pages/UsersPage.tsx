import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, ShieldCheck, Trash2, RefreshCw, Search } from 'lucide-react'
import { toast } from 'sonner'
import { usersApi, type UserDto } from '@/api/users'
import { ListSkeleton } from '@/components/shared/Skeleton'
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
    <div className="space-y-5 max-w-5xl">
      <div>
        <h2 className="h-page">Users</h2>
        <p className="h-page-sub">
          {users?.length ?? 0} registered user{users?.length === 1 ? '' : 's'}
        </p>
      </div>

      <div className="relative sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          className="input pl-9"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <ListSkeleton rows={6} />
      ) : !filtered.length ? (
        <div className="card p-8">
          <EmptyState icon={Users} title="No users found" description="Registered users will appear here." />
        </div>
      ) : (
        <div className="card divide-y divide-white/[0.04]">
          {filtered.map((u) => (
            <div
              key={u.email}
              className="flex flex-col gap-3 px-4 sm:px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-semibold flex-shrink-0">
                  {u.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-text font-medium truncate">{u.displayName}</p>
                  <p className="text-xs text-muted font-mono truncate">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={() => { setAssignTarget(u); setSelectedRole('User') }}
                  className="btn-ghost text-xs gap-1.5 py-1.5 px-2.5"
                  title="Assign role"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Role
                </button>
                <button
                  onClick={() => setRevokeTarget(u)}
                  className="btn-icon text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  title="Revoke refresh token"
                  aria-label="Revoke refresh token"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(u)}
                  className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  title="Delete user"
                  aria-label="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={assignTarget !== null} onOpenChange={(o) => !o && setAssignTarget(null)} title="Assign Role" size="sm">
        <div className="space-y-4">
          <div className="card p-3 bg-surface-2">
            <p className="text-xs text-muted mb-0.5 uppercase tracking-wide">User</p>
            <p className="text-sm text-text font-medium truncate">{assignTarget?.displayName}</p>
            <p className="text-xs text-muted font-mono truncate">{assignTarget?.email}</p>
          </div>
          <div>
            <label className="label mb-2 block">New Role</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex-1 min-w-[90px] px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    selectedRole === role
                      ? 'bg-accent/10 border-accent/40 text-accent'
                      : 'bg-surface-2 border-white/[0.08] text-muted hover:text-text hover:border-white/[0.14]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end pt-1">
            <button className="btn-secondary" onClick={() => setAssignTarget(null)}>Cancel</button>
            <button className="btn-primary" onClick={() => assignMutation.mutate()} disabled={assignMutation.isPending}>
              {assignMutation.isPending ? 'Assigning…' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete user?"
        description={`This will permanently delete ${deleteTarget?.displayName} (${deleteTarget?.email}). This cannot be undone.`}
        confirmLabel="Delete user"
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />

      <ConfirmDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
        title="Revoke refresh token?"
        description={`${revokeTarget?.displayName} will be signed out immediately and must log in again.`}
        confirmLabel="Revoke token"
        tone="primary"
        onConfirm={() => revokeMutation.mutate()}
        loading={revokeMutation.isPending}
      />
    </div>
  )
}
