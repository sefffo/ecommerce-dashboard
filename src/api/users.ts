import api from './axios'

// There is NO dedicated users/account management controller in this backend.
// The only user-related endpoints are under AuthenticationController:
//   POST /api/Authentication/assign-role  (SuperAdmin only)
//   POST /api/Authentication/refresh-token (used for revoke via token)
//   GET  /api/Authentication/CurrentUser
//
// There is no GET /api/users, no DELETE /api/users/{id}, no list-all-users endpoint.
// These features do not exist in the deployed backend.

export interface UserDto {
  id: string
  displayName: string
  email: string
  token: string
  refreshToken: string
}

export const usersApi = {
  // Assign a role to a user by email (SuperAdmin only)
  assignRole: (userEmail: string, roleName: string) =>
    api.post('/api/Authentication/assign-role', { userEmail, roleName }).then((r) => r.data),

  // Get current authenticated user profile
  getCurrentUser: () =>
    api.get<UserDto>('/api/Authentication/CurrentUser').then((r) => r.data),

  // Check if an email is registered
  checkEmail: (email: string) =>
    api.get<boolean>('/api/Authentication/check-email', { params: { email } }).then((r) => r.data),
}
