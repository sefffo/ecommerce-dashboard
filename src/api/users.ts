import api from './axios'

export interface UserDto {
  id: string
  displayName: string
  email: string
  roles: string[]
  createdAt?: string
}

export const usersApi = {
  getAll: () =>
    api.get<UserDto[]>('/api/Account/users').then((r) => r.data),

  updateRole: (id: string, role: string) =>
    api.put(`/api/Account/users/${id}/roles`, { role }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/Account/users/${id}`).then((r) => r.data),

  revokeToken: (email: string) =>
    api.post('/api/Auth/revoke-token', { email }).then((r) => r.data),
}
