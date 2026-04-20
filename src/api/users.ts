import api from './axios'

export interface UserDto {
  email: string
  displayName: string
  token: string
  refreshToken: string
}

export interface AssignRoleDto {
  userEmail: string
  roleName: string
}

export const usersApi = {
  getAll: () =>
    api.get<UserDto[]>('/api/Authentication/users').then((r) => r.data),

  assignRole: (dto: AssignRoleDto) =>
    api.post('/api/Authentication/assign-role', dto).then((r) => r.data),

  deleteUser: (email: string) =>
    api.delete(`/api/Authentication/users/${encodeURIComponent(email)}`).then((r) => r.data),

  revokeToken: (email: string) =>
    api.post(`/api/Authentication/users/${encodeURIComponent(email)}/revoke-token`).then((r) => r.data),
}
