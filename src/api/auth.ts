import api from './axios'
import type { LoginDto, AuthResponse, RefreshTokenDto } from '@/features/auth/types'

export const authApi = {
  login: (dto: LoginDto) =>
    api.post<AuthResponse>('/api/Auth/login', dto).then((r) => r.data),

  refreshToken: (dto: RefreshTokenDto) =>
    api.post<AuthResponse>('/api/Auth/refresh-token', dto).then((r) => r.data),

  revokeToken: (token: string) =>
    api.post('/api/Auth/revoke-token', { token }).then((r) => r.data),
}
