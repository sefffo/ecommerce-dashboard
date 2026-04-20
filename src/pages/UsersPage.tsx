import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, ShieldCheck, Search, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { usersApi, type UserDto } from '@/api/users'
import { TableSkeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Modal } from '@/components/shared/Modal'

const ROLES = ['User', 'Admin', 'SuperAdmin'] as const
type Role = typeof ROLES[number]

function roleBadge(role: Role) {
  const map: Record<Role, string> = {
    SuperAdmin: 'badge badge-error',
    Admin: 'badge badge-info',
    User: 'badge badge-neutral',
  }
  return map[role] ?? 'badge badge-neutral'
}

export function UsersPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [assignTarget, setAssignTarget] = useState<UserDto | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role>('User')

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

  const filtered = (users ?? []).filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text">Users</h1>
          <p className="text-muted text-sm">
            {users?.length ?? 0} registered users &mdash; SuperAdmin only
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          className="input pl-9"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Name', 'Email', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide"
                  >
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
                    <EmptyState
                      icon={Users}
                      title="No users found"
                      description="Registered users will appear here."
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.email} className="border-b border-white/[0.04] table-row-hover">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-semibold">
                          {u.displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-text font-medium">{u.displayName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted font-mono">{u.email}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => {
                          setAssignTarget(u)
                          setSelectedRole('User')
                        }}
                        className="btn-ghost text-xs gap-1.5 py-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Assign Role
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Role Modal */}
      <Modal
        open={assignTarget !== null}
        onClose={() => setAssignTarget(null)}
        title="Assign Role"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted mb-1">User</p>
            <p className="text-sm text-text font-medium">{assignTarget?.displayName}</p>
            <p className="text-xs text-muted font-mono">{assignTarget?.email}</p>
          </div>

          <div>
            <label className="label">New Role</label>
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
            <button className="btn-secondary" onClick={() => setAssignTarget(null)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => assignMutation.mutate()}
              disabled={assignMutation.isPending}
            >
              {assignMutation.isPending ? 'Assigning…' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
