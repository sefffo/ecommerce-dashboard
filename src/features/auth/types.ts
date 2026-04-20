export interface LoginDto {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  displayName: string
  email: string
}

export interface RefreshTokenDto {
  token: string
  refreshToken: string
}

export interface DecodedToken {
  sub?: string
  email?: string
  role?: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string
  exp: number
}

export interface AuthUser {
  email: string
  displayName: string
  role: string
}
