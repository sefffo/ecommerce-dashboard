import api from './axios'

// UserDTO from backend: record UserDTO(string Email, string DisplayName, string Token, string RefreshToken)
// GetAllUsers: GET /api/Authentication/users  (SuperAdmin only)
// AssignRole:  POST /api/Authentication/assign-role  { UserEmail, RoleName }
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
}
