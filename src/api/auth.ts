import api from './axios'
import type { LoginDto, AuthResponse, RefreshTokenDto } from '@/features/auth/types'

// Controller: AuthenticationController → [Route("api/[controller]")]
// resolves to: api/Authentication
export const authApi = {
  login: (dto: LoginDto) =>
    api.post<AuthResponse>('/api/Authentication/login', dto).then((r) => r.data),

  refreshToken: (dto: RefreshTokenDto) =>
    api.post<AuthResponse>('/api/Authentication/refresh-token', dto).then((r) => r.data),

  revokeToken: (token: string) =>
    api.post('/api/Authentication/refresh-token', { token }).then((r) => r.data),

  assignRole: (userEmail: string, roleName: string) =>
    api.post('/api/Authentication/assign-role', { userEmail, roleName }).then((r) => r.data),

  getCurrentUser: () =>
    api.get('/api/Authentication/CurrentUser').then((r) => r.data),
}
